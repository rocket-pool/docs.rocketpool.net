# Ücret Dağıtıcıları ve Smoothing Pool

Node operatörleri, Ethereum zincirine önerdikleri herhangi bir blokta dahil ettikleri işlemlerden **öncelik ücretleri** (**bahşişler**) alırlar.
Bu ücretler Execution katmanından gelir ve orada kalır.

Consensus katmanında oluşturulan ve otomatik olarak periyodik olarak çekilen çoğu doğrulama ödülünün aksine, bu ücretler _anında likidir_.
Genel olarak, öncelik ücretleri size Beacon Chain ödüllerinin neredeyse kadar ETH sağlar, bu nedenle Merge'in çok güzel bir avantajıdır.

::: tip NOT
Hızlı bir hatırlatma olarak, farklı ödül türlerinin bir dökümü ve hangi katmanda sağlandıkları:

- Consensus Layer: onaylamalar, blok önerileri, senkronizasyon komiteleri, slashing raporları
- Execution Layer: blok önerilerinden öncelik ücretleri ve MEV (bir sonraki bölümde tartışılacak)

:::

## Ücret Alıcıları

Ethereum zincirinde bir blok önerdiğinizde, protokolün bloğunuza dahil edilen her işlemden gelen bahşişleri nereye göndereceğini bilmesi gerekir.
Bunları validator'ınızın adresine gönderemez, çünkü bu Consensus katmanındadır - Execution katmanında değil.
Bunları minipool adresinize gönderemez, çünkü solo staker'lar için de çalışması gerekir ve solo staker'ların Rocket Pool'un yaptığı gibi Execution katmanında validator'larına bağlı bir adresi yoktur.

Bunun yerine, çalışma şekli oldukça basittir: Rocket Pool Validator Client'ınızı başlattığında, **ücret alıcısı** adında bir argüman geçirir.
Ücret alıcısı, bahşişlerin gitmesini istediğiniz Execution katmanındaki bir adrestir.

Node'unuzun `fee recipient`'i aşağıdaki özel sözleşmelerden biri olabilir:

- Node'unuzun kendi kişisel **Ücret Dağıtıcısı**
- Node'unuzun megapool sözleşmesi
- **Smoothing Pool** (katılım isteğe bağlı)

Smart Node, yapılandırmanıza göre doğru ücret alıcısını otomatik olarak ayarlayacaktır:

| Smoothing Pool Durumu | Megapool Validator'ları Var | Minipool'ları Var | Ücret Alıcısı |
|----------------------|-------------------------|---------------|---------------|
| Katılmış | Hayır | Evet | Smoothing Pool adresi |
| Katılmış | Evet | Hayır | Smoothing Pool adresi |
| Katılmış | Evet | Evet | Smoothing Pool adresi (tüm validator'lar) |
| Çıkmış | Hayır | Evet | Ücret Dağıtıcısı sözleşme adresi |
| Çıkmış | Evet | Hayır | Megapool sözleşme adresi |
| Çıkmış | Evet | Evet | Megapool validator'ları → Megapool adresi<br>Minipool validator'ları → Ücret Dağıtıcısı adresi<br>([keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient) aracılığıyla validator başına ayarlanır) |



Rocket Pool, bu ödülleri sizinle rETH pool staker'ları arasında adil bir şekilde dağıtmak üzere tasarlanmıştır, aynı şekilde Beacon chain ödüllerinizi adil bir şekilde dağıtır: minipool validator'larınızın kazandığı herhangi bir öncelik ücretinden size ait kısım size gidecektir (artı tüm minipool'larınızın ortalama komisyonu) ve kalan kısım pool staker'lara gidecektir (ortalama komisyonunuz eksi).
Tam kısım, sahip olduğunuz 8 ETH bağlı, 16 ETH bağlı minipool'lar ve 4 ETH bağlı megapool validator'larının sayısına bağlıdır.

Kısaca, **Ücret Dağıtıcısı** node'unuza bağlı, öncelik ücretlerinizi toplar ve adil bir şekilde sizinle rETH staker'lar arasında bölen benzersiz bir sözleşmedir.
Öncelik ücretleri için kendi kişisel kasanız gibidir.
Herhangi biri (siz dahil) ödüllerin her zaman rETH staker'lara sunulmasını sağlamak için herhangi bir zamanda bakiyesini dağıtabilir.

**Smoothing Pool**, tüm katılımcı node operatörlerinin öncelik ücretlerini birlikte toplamasına ve biriktirmesine izin veren ve bunları her Rocket Pool ödül aralığında (şu anda her 28 günde bir) katılımcılar ve rETH pool staker'ları arasında adil bir şekilde dağıtan özel bir katılım isteğe bağlı sözleşmedir.
Bu, yüksek öncelik ücretleri olan blok önerileri almanın getirdiği şans faktörü konusunda endişelenmek istemeyen ve bunun yerine güzel, düzenli, tutarlı bir aylık kazanç setine sahip olmayı tercih eden node operatörleri için çok cazip bir özelliktir.

Her ikisini de ele alacağız, böylece farkı anlayacak ve Smoothing Pool'a katılıp katılmak istemediğinize karar verebileceksiniz.

::: tip NOT
2024-10-28 sonrasında oluşturulan minipool'lar için smoothing pool ŞIDDETLE önerilir, çünkü bonus komisyon dağıtmak için kullanılır. Smoothing pool'dan çıkarsanız, bu minipool'lar toplam %5 komisyon alacaktır. Smoothing pool'a katılırsanız, bu minipool'lar %10 (RPL stake edilmemiş) ile %14 (RPL stake'i ödünç alınan ETH'nin %10'u veya daha fazlası değerindeyse) arasında komisyon alacaktır.
:::

## Ücret Dağıtıcınız

Ücret Dağıtıcınız, Execution Layer'da **node'unuza özgü** benzersiz bir sözleşmedir.
Zaman içinde kazandığınız tüm öncelik ücretlerini tutacak ve bunları rETH pool staker'lara ve çekim adresinize adil bir şekilde bölmek ve dağıtmak için gereken mantığı içerir.
Bu dağıtım süreci **herkes tarafından çağrılabilir** (rETH staker'lar dahil) ve **herhangi bir zamanda** yapılabilir.
Ödüllerin sona ermeden önce bir zaman sınırı yoktur.

Node'unuzun Ücret Dağıtıcısı adresi, **node adresinize göre deterministiktir**.
Bu, Ücret Dağıtıcısı oluşturulmadan önce bile önceden bilindiği anlamına gelir.

Yeni Rocket Pool node'ları, kayıt sırasında otomatik olarak node'larının Ücret Dağıtıcısı sözleşmesini oluşturur (başlatır).
Bu sadece bir kez çalıştırılması gerekir.

Bunun ilginç bir sonucu, Dağıtıcınızın adresinin, Ücret Dağıtıcısı sözleşmenizi başlatmadan **önce** bakiye biriktirmeye başlayabilmesidir.
Bu sorun değildir, çünkü Dağıtıcınız onu başlattığınız anda tüm bu mevcut bakiyeye erişim kazanacaktır.

### Adresini ve Bakiyesini Görüntüleme

Ücret dağıtıcınızın adresini ve bakiyesini şunun bir parçası olarak görüntüleyebilirsiniz:

```shell
rocketpool node status
```

Çıktı şöyle görünecektir:

![](../node-staking/images/status-fee-distributor.png)

### Ücret Dağıtıcınızdan Ücretleri Talep Etme

Aşağıdaki komutu kullanarak ücret dağıtıcınızın tüm bakiyesini talep edebilir ve dağıtabilirsiniz:

```shell
rocketpool node distribute-fees
```

Bu, ödüllerin sizin payınızı **çekim adresinize** gönderecektir.

::: warning VERGİYE TABİ OLAYLARA İLİŞKİN NOT
Yeni bir minipool oluşturduğunuzda, Rocket Pool otomatik olarak `distribute-fees` çağıracaktır.
Bu, biriktirdiğiniz ücretlerin node'unuzun ortalama komisyonu kullanılarak dağıtılmasını sağlamak içindir, bu da yeni minipool oluşturduğunuzda değişebilir. Bu, megapool validator oluşturma için geçerli değildir.

Ayrıca, herhangi birinin ücret dağıtıcınızda `distribute-fees` çağırabileceğini unutmayın (rETH ödüllerini rehin tutmanızı önlemek için).
Bu yöntem her çağrıldığında vergiye tabi bir olay yaşayabilirsiniz.

Smoothing Pool'u (aşağıda tartışılacak) kullanıp kullanmamaya karar verirken lütfen bu koşulları aklınızda bulundurun.
:::

### Ceza Sistemi

Node operatörlerinin Validator Client'larında kullanılan ücret alıcısını manuel olarak değiştirerek "hile yapmamalarını" sağlamak için Rocket Pool bir ceza sistemi kullanır.

Oracle DAO, protokol kurallarına uymayan node operatörlerini cezalandırabilir.

Bir node Smoothing Pool'dan _çıkarılmışsa_, aşağıdaki adresler geçerli ücret alıcıları olarak kabul edilir:

- rETH adresi
- Smoothing Pool adresi
- Node'un ücret dağıtıcısı sözleşmesi
- Node'un megapool sözleşmesi

Bir node Smoothing Pool'a _katılmışsa_, aşağıdaki adres geçerli bir ücret alıcısı olarak kabul edilir:

- Smoothing Pool adresi

Yukarıdaki geçerli adreslerden biri dışında bir ücret alıcısı **geçersiz** kabul edilir.

Smart Node yazılımı, yapılandırmanıza göre (Smoothing Pool'a katılıp katılmadığınız ve megapool validator'larınız, minipool'larınız veya her ikisi olup olmadığına göre) doğru ücret alıcısını otomatik olarak ayarlar. Her ikisine de sahip olan node'lar için çıkmış durumdayken, ücret alıcısı keymanager API kullanılarak validator başına ayarlanır. Koşulların tam listesi [burada](/node-staking/fee-distrib-sp#fee-recipients) özetlenmiştir.

Smartnode yazılımı, dürüst kullanıcıların asla cezalandırılmamasını sağlamak üzere tasarlanmıştır, hatta bunu yapmak için Validator Client'ı çevrimdışına almak zorunda kalsa bile.
Bu olursa, onaylama yapmayı durduracaksınız ve log dosyalarınızda Smartnode'un ücret alıcınızı neden doğru şekilde ayarlayamadığına dair hata mesajları göreceksiniz.

## Smoothing Pool

**Smoothing Pool**, Rocket Pool ağının node operatörlerimize sunduğu benzersiz bir katılım isteğe bağlı özelliktir.
Esasen, ona katılan her node operatörü için ücret alıcısı haline gelir ve bu node operatörleri tarafından önerilen bloklardan gelen öncelik ücretlerini toplu olarak bir büyük havuzda biriktirir. Bir Rocket Pool ödül kontrol noktası sırasında (RPL ödüllerini dağıtmak için kullanılanların aynısı), havuzun toplam ETH bakiyesi pool staker'lara ve ona katılan node operatörlerine adil bir şekilde dağıtılır.

Özünde, Smoothing Pool blok önerileri için seçilmeyle ilişkili rastgeleliği etkili bir şekilde ortadan kaldırmanın bir yoludur.
Hiç şanssız bir dönem geçirdiyseniz ve aylarca öneri alamadıysanız veya blok önerileriniz sadece düşük öncelik ücretlerine sahipse, Smoothing Pool'u oldukça heyecan verici bulabilirsiniz.

Matematiği anlaşılması kolay hale getirmek için, topluluk üyesi Ken Smith, Smoothing Pool ve Ücret Dağıtıcısının karlılığını karşılaştıran [kapsamlı bir analiz](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) hazırlamıştır, bu da bu grafikle güzelce özetlenmiştir:

![](../node-staking/images/sp-chart.png)

Kısacası, Smoothing Pool'da sizden daha fazla minipool olduğu sürece, ona katılarak daha iyi duruma gelme olasılığınız daha yüksektir.

### Kurallar

Smoothing Pool aşağıdaki kuralları kullanır:

- Smoothing Pool'un bakiyesinin node operatörleri arasında dağıtıldığı bir Rocket Pool ödül kontrol noktası sırasında (komisyonları faktörlü olarak), RPL stake eden node operatörleri, rETH staker'ları ve potansiyel olarak Rocket Pool DAO. Kesin yüzdeler Rocket Pool [Protocol Dao (pDAO) yönetişimi](/pdao/overview) tarafından belirlenir.

- Smoothing Pool'a katılmak **node seviyesinde** yapılır. Katılırsanız, tüm minipool'larınız ve megapool validator'larınız katılmış olur.

- Herkes herhangi bir zamanda katılabilir. Sistemi oynamayı önlemek için (örneğin, blok önerisi için seçildikten hemen sonra SP'den ayrılmak) tam bir ödül aralığı (Hoodi'de 3 gün, Mainnet'te 28 gün) beklemeleri gerekir.
  - Çıktıktan sonra, tekrar katılmak için başka bir tam aralık beklemeleri gerekir.

- Smoothing Pool, katılan her node'un sahip olduğu her validator'ın "payını" (aralık için havuzun ETH'sinin kısmı) hesaplar.
  - Pay, validator'ünüzün aralık boyunca performansının (Beacon Chain'de kaç onaylama gönderdiğinize ve kaçını kaçırdığınıza bakarak hesaplanır) ve komisyon oranınızın bir fonksiyonudur.

- Node'unuzun toplam payı, validator paylarınızın toplamıdır.

- Node'unuzun toplam payı, katıldığınız süreye göre ölçeklendirilir.
  - Tam aralık boyunca katılmışsanız, tam payınızı alırsınız.
  - Bir aralığın %30'u için katılmışsanız, tam payınızın %30'unu alırsınız.

Smoothing Pool ödülleri hesaplamasının tam teknik ayrıntılarıyla ilgileniyorsanız, lütfen [buradaki tam spesifikasyonu inceleyin](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Smoothing Pool'a Katılma ve Ayrılma

Smoothing Pool'a katılmak için şu komutu çalıştırın:

```shell
rocketpool node join-smoothing-pool
```

Bu sizi Rocket Pool sözleşmelerinde katılmış olarak kaydedecek ve Validator Client'ınızın `ücret alıcısını` otomatik olarak node'unuzun dağıtıcı sözleşmesinden Smoothing Pool sözleşmesine değiştirecektir.

Havuzdan ayrılmak için bu komutu çalıştırın:

```shell
rocketpool node leave-smoothing-pool
```

Bu sizi Rocket Pool sözleşmelerinde çıkmış olarak kaydedecek ve küçük bir gecikme geçtikten sonra, Validator Client'ınızın `ücret alıcısını` otomatik olarak Smoothing Pool sözleşmesinden node'unuzun Ücret Dağıtıcısı sözleşmesine geri değiştirecektir.

### Smoothing Pool'dan Ödülleri Talep Etme

Smoothing Pool'dan gelen ödüller, Redstone ödül sistemini kullanarak her ödül aralığının sonunda RPL ile birlikte paketlenir.
Bunları talep etmek şu kadar basittir:

```shell
rocketpool node claim-rewards
```

Smoothing Pool'a katılmışsanız, her aralık için aldığınız ETH miktarının sıfırdan fazla olduğunu fark edeceksiniz:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Burada Aralık 1'deki Smoothing Pool ödüllerinin, node'un bu aralık boyunca katıldığını ve buna göre ödüller aldığını gösterdiğini unutmayın.

RPL ve Smoothing Pool ödüllerini talep etme hakkında daha fazlasını kılavuzun ilerleyen bölümlerinde, [Ödülleri Talep Etme](./rewards) bölümünde ele alacağız.

## Sonraki Adımlar

Smoothing Pool'a katılıp katılmamaya karar verdikten sonra, MEV ve MEV ödülleriyle ilgili bir sonraki bölüme göz atın.
