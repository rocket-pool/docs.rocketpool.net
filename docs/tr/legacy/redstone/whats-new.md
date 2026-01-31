# Rocket Pool Redstone Güncellemesi

Rocket Pool'un bir sonraki büyük güncellemesi olan **Redstone**, Ropsten ve Holesky test ağlarında beta testi için yayınlandı.
Bu sayfa, Redstone'un getirdiği önemli değişiklikleri, hem Smartnode stack'ine hem de genel olarak Rocket Pool protokolüne yapılan güncellemeleri açıklamaktadır.

Rocket Pool'un önceki sürümü ile Redstone arasındaki tüm farklılıkları anlamak için lütfen bu sayfayı baştan sona okuyun.

::: tip DİKKAT
Node'unuzu yükseltmeye nasıl hazırlayacağınız ve yükseltme sonrasında ne yapacağınız hakkında ayrıntılı bilgi için lütfen aşağıdaki kılavuzlara bakın:

- [Docker Mode için Kılavuz](./docker-migration.mdx)
- [Hybrid Mode için Kılavuz](./hybrid-migration.mdx)
- [Native Mode için Kılavuz](./native-migration.mdx)

:::

## Client Değişiklikleri ve The Merge

Ropsten (ve kısa süre sonra Holesky), **Execution ve Consensus Katmanlarının Birleşmesini** başarıyla tamamladı.
Artık Proof-of-Work kullanmıyor; bunun yerine, Ropsten'deki validator'lar artık her iki zincirde de blok oluşturma ve önerme sorumluluğuna sahip.
Bu, bazı heyecan verici finansal faydalarla birlikte gelirken (bunlar daha sonra tartışılacaktır), validator'ların çalışma şekline bazı önemli değişiklikler de getiriyor.

The Merge'ün bir parçası olarak client davranışındaki değişikliklerin kısa bir özeti aşağıdadır:

- Execution client'ınız artık üç API portu kullanıyor:
  - API'sine HTTP erişimi için bir tane (**varsayılan 8545**)
  - API'sine Websocket erişimi için bir tane (**varsayılan 8546**)
  - The Merge'den sonra Consensus client'lar tarafından kullanılan yeni **Engine API** için bir tane (**varsayılan 8551**)

- Execution client'lar artık çalışmak için bir Consensus client'a ihtiyaç duyuyor ve Consensus client'lar artık çalışmak için bir Execution client'a ihtiyaç duyuyor.
  - **Artık ikisi de izole bir şekilde çalışamaz.**

- Bir Execution client, bir ve yalnızca bir Consensus client'a bağlanmalıdır (ve tersi).
  - Birden fazla Execution client'ı tek bir Consensus client'a veya birden fazla Consensus client'ı tek bir Execution client'a bağlayamazsınız.
  - Bu nedenle, **yedek execution client'lar artık Rocket Pool node operatörleri için mevcut değildir**.

- **Tam execution client'lar** gereklidir.
  - Remote sağlayıcılar (Infura ve Pocket gibi) artık herhangi bir validator tarafından kullanılamaz, Rocket Pool veya başka.

## Fee Recipient'ler ve Distributor'ünüz

Validator'lar artık blok oluşturmaktan sorumlu olduğu için, bu, her işleme eklenen **öncelik ücretlerini** (**tip** olarak da bilinir) aldıkları anlamına gelir.
Bu ücretler ETH olarak ödenir ve minipool validator'larınızdan biri bir blok önerdiğinde doğrudan size sağlanır.
Beacon Chain'de kilitlenen ETH'nin aksine, **öncelik ücretlerinize erişmek için withdrawal'ları beklemeniz gerekmez**!
Blok önerme sürecinin bir parçası olarak size verilirler.

Ücretlerin nereye gönderileceğini bilmek için, Validator Client'ınız `fee recipient` olarak bilinen ekstra bir parametre gerektirir.
Bu, blok önerileri sırasında node'unuzun kazandığı tüm öncelik ücretlerinin gönderileceği Execution Layer (ETH1) üzerindeki adrestir.

Rocket Pool, bu ödülleri Beacon chain ödüllerinizi adil bir şekilde dağıttığı gibi adil bir şekilde dağıtmak üzere tasarlanmıştır: minipool validator'larınızın kazandığı öncelik ücretlerinin yarısı size gidecektir (artı tüm minipool'larınızın ortalama komisyonu), diğer yarısı ise pool staker'lara gidecektir (eksi ortalama komisyonunuz).

Bu amaçla, Smartnode, Validator Client'ınızın `fee recipient`'ini otomatik olarak node'unuzun **fee distributor**'ı olarak bilinen özel bir adrese ayarlayacaktır.
Fee distributor'ünüz, Execution Layer'da **node'unuza özel** benzersiz bir sözleşmedir.
Zaman içinde kazandığınız tüm öncelik ücretlerini tutacak ve bunları adil bir şekilde bölmek ve dağıtmak için gereken mantığı içerir.
Bu dağıtım süreci sizin (node operatörü) tarafınızdan kontrol edilir ve istediğiniz zaman yapılabilir.
Bir zaman sınırı yoktur.

Node'unuzun fee distributor'ünün adresi **node adresinize göre deterministik olarak belirlenir**.
Bu, fee distributor oluşturulmadan önce bile önceden bilindiği anlamına gelir.
**Smartnode bu adresi fee recipient olarak kullanacaktır.**

::: tip NOT
Varsayılan olarak, fee recipient'iniz Smartnode v1.5.0'ı yüklediğinizde **rETH adresine** ayarlanacaktır (Redstone sözleşme güncellemeleri henüz dağıtılmadıysa).
Smartnode, Redstone güncellemesi dağıtıldığında bunu otomatik olarak node'unuzun fee distributor adresine güncelleyecektir.

Bunun bir istisnası, **Smoothing Pool**'a katıldıysanızdır - daha fazla bilgi için bu sayfanın sonundaki bölüme bakın.
:::

Yeni Rocket Pool node'ları, kayıt sırasında otomatik olarak node'larının distributor sözleşmesini başlatacaktır.
Mevcut node'ların bu işlemi manuel olarak yapması gerekecektir.
Bu yalnızca bir kez çalıştırılması gerekir.

Bunun ilginç bir sonucu, node distributor sözleşmenizi başlatmadan **önce** distributor'ünüzün adresi bakiye biriktirmeye başlayabilir.
Bu sorun değil, çünkü distributor'ünüz onu başlattığınız anda tüm bu mevcut bakiyeye erişim kazanacaktır.

Fee distributor'ünüzün bakiyesini şunun bir parçası olarak görüntüleyebilirsiniz:

```shell
rocketpool node status
```

Çıktı şöyle görünecektir:

![](../../node-staking/images/status-fee-distributor.png)

Node'unuzun distributor'ünü başlatmak için, sadece bu yeni komutu çalıştırın:

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOT
Redstone güncellemesinden sonra, `rocketpool node deposit` ile yeni minipool'lar oluşturmadan önce bu fonksiyonu çağırmalısınız.
:::

Distributor'ünüz başlatıldığında, tüm bakiyesini talep edip dağıtmak için aşağıdaki komutu kullanabilirsiniz:

```shell
rocketpool node distribute-fees
```

Bu, ödüllerin sizin payınızı **withdrawal adresinize** gönderecektir.

## Rocket Pool Protokol Değişiklikleri

Execution ve Consensus client değişikliklerine ve yeni öncelik ücretlerine ek olarak, Rocket Pool protokolünün kendisi, bilmeniz gereken bazı önemli değişikliklerden geçti.

### Yeni Ödül Sistemi

Redstone güncellemesiyle tanıtılan en önemli değişikliklerden biri **yeni ödül sistemidir**.
Bu, node operatörlerinin RPL ödüllerini (ve Smoothing Pool'dan ETH - daha sonra tartışılacak) alma şeklinin tamamen elden geçirilmesidir.

_Eski_ ödül sisteminin aşağıdaki dezavantajları vardı:

- Talep etme yaklaşık 400k gas maliyetindeydi, bu oldukça pahalıdır.
- Node operatörlerinin her aralıkta (her 28 günde bir) ödülleri talep etmeleri gerekiyordu, aksi takdirde kaybederlerdi. Bu, küçük miktarda RPL'ye sahip node operatörleri için gas maliyetlerinin aşırı derecede pahalı olabileceği anlamına geliyordu.
- Ödüller, _talep_ zamanında belirlendi, checkpoint zamanında değil. Checkpoint ile talebiniz arasında bir kullanıcı önemli miktarda RPL stake ederse, ödülleriniz sulandırılabilir ve beklediğinizden daha az RPL alabilirsiniz.

_Yeni_ talep sistemi tüm bu sorunları çözer.

Her aralıkta, Oracle DAO toplu olarak Rocket Pool ağındaki node operatörlerinin durumunun **gerçek bir anlık görüntüsünü** oluşturacak ve tüm efektif stake miktarlarını içerecektir.
Bu bilgi bir [Merkle Ağacı](https://en.wikipedia.org/wiki/Merkle_tree)'na derlenir - tüm ayrıntıları smart contract'lara sunmanın son derece verimli bir yolu.
Merkle Ağacı bir JSON dosyasına oluşturulur ve [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System) üzerinde barındırılır ve Merkle Ağacının kökü sözleşmelere gönderilir.

Bu yeni sistemin aşağıdaki özellikleri vardır:

- Artık istediğiniz kadar **ödüllerin birikmesine izin verebilirsiniz**. Talep etme zamanı konusunda artık zaman sınırı yok.
- **Birden fazla aralığı** aynı anda talep edebilirsiniz.
- İlk talep işleminiz yaklaşık 85k gas kullanır. Sonraki her talep işlemi yaklaşık 55k gas maliyetindedir.
  - Aynı anda birden fazla aralık talep ediyorsanız, her ek aralık **6k gas** maliyetindedir, bu nedenle mümkün olduğunca çoğunu aynı anda talep etmek en maliyet etkindir.
- RPL ödülleriniz **artık sulandırılmıyor** - RPL ödülleriniz anlık görüntü zamanında sabittir ve her zaman bu miktar için uygunsunuz.
- Talep işleminin bir parçası olarak **RPL ödüllerinizin bir kısmını (veya tamamını) yeniden stake edebilirsiniz**, bu da bugüne kıyasla gas gereksinimlerini daha da azaltır.
- Şu anda, **tüm talepleriniz Mainnet'te olmalıdır** ancak daha sonraki bir tarihte Layer 2 ağlarında talep etme yeteneği oluşturmak için altyapıya sahibiz.

Node'unuz yeni bir ödül checkpoint'i algıladığında, o aralık için JSON dosyasını otomatik olarak indirecektir.
Ardından aşağıdaki komutu kullanarak ödüllerinizi gözden geçirebilirsiniz:

```shell
rocketpool node claim-rewards
```

Aralıklar geçtikçe ve ödüller biriktikçe, çıktı şöyle görünecektir:

![](../../node-staking/images/claim-rewards-gb.png)

Burada her aralıkta ne kadar ödül kazandığınızı hızlıca görebilir ve hangilerini talep etmek istediğinize karar verebilirsiniz.
**Ropsten'in aralık süresinin testi kolaylaştırmak için 1 güne ayarlandığını** unutmayın.

Ayrıca bu talep sırasında yeniden stake etmek istediğiniz bir miktar belirtebilirsiniz:

![](../../node-staking/images/autostake.png)

Bu, RPL ödüllerinizi tek bir işlemde birleştirmenize olanak tanır ve bugün kullanmanız gerekenden önemli ölçüde daha az gas kullanır.

::: tip NOT
Ödül checkpoint'ini Oracle DAO tarafından oluşturulan checkpoint'i indirmek yerine manuel olarak oluşturmayı tercih ederseniz, bu ayarı TUI'da `Download`'dan `Generate`'e değiştirebilirsiniz:

![](../../node-staking/images/tui-generate-tree.png)

İpucunun belirttiği gibi, bunu yapmak için bir archive node'a erişiminiz olması gerekecektir.
Yerel Execution client'ınız bir archive node değilse, bunun altındaki `Archive-Mode EC URL` kutusunda ayrı bir tane (Infura veya Alchemy gibi) belirtebilirsiniz.
Bu URL yalnızca Merkle ağaçları oluştururken kullanılacaktır; validation görevleri için kullanılmayacaktır.
:::

::: danger UYARI
_Anlık görüntü zamanında_ %10 RPL teminatının altındaysanız, o anlık görüntü için ödüllere uygun olmayacaksınız.
Mevcut sistemin aksine, tekrar uygun hale gelmek için talep etmeden önce basitçe "tamamlayabilirsiniz", bu o anlık görüntüde sonsuza kadar kilitlenecektir ve **o dönem için asla ödül almayacaksınız**.
O dönem için ödül almak için anlık görüntü zamanında %10 teminatın üzerinde **olmalısınız**.
:::

### Smoothing Pool

Redstone güncellemesinin son heyecan verici yeni özelliği **Smoothing Pool**'dur.
Smoothing Pool, ona katılan her üyenin öncelik ücretlerini toplu olarak havuzlayacak **isteğe bağlı bir özelliktir**.
Bir ödül checkpoint'i sırasında, havuzun toplam ETH bakiyesi bir pool staker kısmı ve bir node operatörü kısmına bölünür.
Node operatörü kısmındaki tüm ödüller **havuzun her üyesine adil bir şekilde dağıtılır**.

Özünde, Smoothing Pool, Beacon Chain'deki blok önerileriyle ilişkili rastgeleliği etkili bir şekilde ortadan kaldırmanın bir yoludur.
Hiç şansınızın kötü gittiği ve aylarca öneride bulunmadığınız bir dönem yaşadıysanız, Smoothing Pool'u oldukça heyecan verici bulabilirsiniz.

::: tip NOT
Smoothing Pool ödülleri, RPL ödülleri için kullanılan Merkle Ağacına dahil edilmiştir, bu nedenle bunları `rocketpool node claim-rewards` kullanarak RPL'yi talep ettiğiniz zamanda talep edersiniz.
:::

Ayrıntıları netleştirmeye yardımcı olmak için, Smoothing Pool aşağıdaki kuralları kullanır:

- Smoothing Pool'a katılmak **node düzeyinde** yapılır. Katılırsanız, tüm minipool'larınız katılmış olur.

- Node operatörünün toplam payı, Smoothing Pool'a katılan her node'daki her minipool'un ortalama komisyonu ile belirlenir.

- Herkes istediği zaman katılabilir. Sistemi suistimal etmemek için çıkmadan önce tam bir ödül aralığı (Ropsten'de 1 gün, Mainnet'te 28 gün) beklemelidir.
  - Çıktıktan sonra, tekrar katılmak için başka bir tam aralık beklemeniz gerekir.

- Smoothing Pool, katılan her node'un sahip olduğu her minipool'un "payını" (aralık için havuzun ETH'sinin kısmı) hesaplar.
  - Pay, minipool'unuzun aralık boyunca performansının (Beacon Chain'e kaç attestation gönderdiğinize ve kaç tanesini kaçırdığınıza bakılarak hesaplanır) ve minipool'unuzun komisyon oranının bir fonksiyonudur.

- Node'unuzun toplam payı, minipool paylarınızın toplamıdır.

- Node'unuzun toplam payı, katıldığınız süreye göre ölçeklenir.
  - Tam aralık için katılmışsanız, tam payınızı alırsınız.
  - Bir aralığın %30'u için katılmışsanız, tam payınızın %30'unu alırsınız.

Smoothing Pool'a katılmak için aşağıdaki komutu çalıştırın:

```shell
rocketpool node join-smoothing-pool
```

Bu, sizi Rocket Pool sözleşmelerinde katıldığınız olarak kaydedecek ve Validator Client'ınızın `fee recipient`'ini otomatik olarak node'unuzun distributor sözleşmesinden Smoothing Pool sözleşmesine değiştirecektir.

Havuzdan ayrılmak için bu komutu çalıştırın:

```shell
rocketpool node leave-smoothing-pool
```

### Ceza Sistemi

Node operatörlerinin Validator Client'larında kullanılan fee recipient'i manuel olarak değiştirerek "hile yapmamalarını" sağlamak için, Rocket Pool bir ceza sistemi kullanır.

Oracle DAO, Rocket Pool node operatörleri tarafından üretilen her bloğu sürekli olarak izler.
Aşağıdaki adreslerden biri dışında bir fee recipient'e sahip herhangi bir blok **geçersiz** kabul edilir:

- rETH adresi
- Smoothing Pool adresi
- Node'un fee distributor sözleşmesi (Smoothing Pool'dan çıkmışsa)

**Geçersiz** bir fee recipient ile bir blok öneren bir minipool **bir ihtar** alacaktır.
Üçüncü ihtarda, minipool **ihlaller** almaya başlayacaktır - her ihlal, minipool'dan fon çekerken **toplam Beacon Chain bakiyesinin %10'unu, ETH kazançları dahil** kesecek ve bunları rETH pool staker'lara gönderecektir.

İhlaller **minipool** düzeyindedir, **node** düzeyinde değil.

Smartnode yazılımı, dürüst kullanıcıların asla cezalandırılmamasını sağlamak için tasarlanmıştır, bunu yapmak için Validator Client'ı çevrimdışı duruma getirmesi gerekse bile.
Bu olursa, attestation yapmayı durduracaksınız ve Smartnode'un fee recipient'inizi neden doğru şekilde ayarlayamadığına dair log dosyalarınızda hata mesajları göreceksiniz.

## Yükseltme Öncesi ve Sonrası için Kılavuzlar

Node'unuzu yükseltmeye nasıl hazırlayacağınız ve yükseltme sonrasında ne yapacağınız hakkında ayrıntılı bilgi için lütfen aşağıdaki kılavuzlara bakın:

- [Docker Mode için Kılavuz](./docker-migration.mdx)
- [Hybrid Mode için Kılavuz](./hybrid-migration.mdx)
- [Native Mode için Kılavuz](./native-migration.mdx)
