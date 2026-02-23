::: danger UYARI
Saturn 1'e hazırlık kapsamında minipool yatırmaları şu anda devre dışı bırakılmıştır.
:::

# Solo Validator'ı Minipool'a Dönüştürme

Beacon Chain ilk başlatıldığında, validator'lar özel bir kriptografik anahtar çifti ile oluşturuldu - **validator anahtarı** ve **çekim anahtarı**.

Validator anahtarı bir "hot key"dir, yani İnternet'e bağlı aktif bir makinede saklanması gerekir; bu anahtar attestation'larınızı ve proposal'larınızı imzalamak için kullanılır ve ayrıca Beacon Chain'deki "adresiniz" olarak hizmet eder (validator'ınızı tanımlamak için kullanılan hex dizesi).

Çekim anahtarı ise bir "cold key"dir, bu da İnternet'e bağlı aktif bir makinede saklanma*sı* (ve aslında saklanma*ması gerektiği*) anlamına gelir.
Gerekene kadar erişilememesi için cold storage'da kilitli tutulması amaçlanır.
Validator anahtarından farklı olarak, çekim anahtarı doğrulama görevlerinden hiç sorumlu değildir.
Bunun yerine, tek görevi Beacon Chain'deki validator fonlarınızın çekilmesini yönetmektir (çekimler uygulandıktan sonra).

Bu çift anahtar sistemi, Beacon Chain'in başlatıldığı ilk mimariydi.
O zamanlar ne Merge ne de çekimler henüz tasarlanmamıştı, ancak bu sistem her ikisi de uygulandığında protokolün alacağı formu her ne olursa olsun yeterince sağlam kabul ediliyordu.

Bugüne hızlı bir şekilde ilerleyelim ve artık çekimlerin nasıl çalıştığı konusunda çok daha iyi bir anlayışa sahibiz.
Neyse ki, Beacon Chain'deki mevcut bir solo staking validator'ın (eski çekim anahtarı kimlik bilgilerini kullanan) Beacon Chain'den validator'dan çıkış yapmaya gerek kalmadan **doğrudan bir Rocket Pool minipool'a dönüştürülmesini** mümkün kılan bir şekilde uygulanmışlardır!

Bu süreç hakkında daha fazla bilgi edinmek istiyorsanız, bu rehber sizin için.
Ethereum'da çekimlerin nasıl çalıştığını yüksek düzeyde ele alacağız, dönüşüm sürecinin nasıl işlediğini açıklayacağız ve validator'ınızı bir minipool'a nasıl dönüştüreceğinizin ayrıntılı bir açıklamasıyla bitireceğiz.

## Neden Dönüştüreyim?

Teknik ayrıntılara girmeden önce cevaplanması gereken çok önemli bir soru, bir solo staker'ın neden bu süreci ilk etapta düşüneceğidir.
Minipool'a dönüşüm herkes için değildir, ancak bu bölüm bu konuda bilinçli bir seçim yapmanıza yardımcı olacaktır.

Rocket Pool minipool'ları geleneksel solo staking validator'larına göre çeşitli avantajlara sahiptir:

- Havuz staker'larından ödünç aldıkları ETH kısmı (24 ETH) üzerinden **komisyon kazanırlar**.
- Mevcut 32 ETH bond'unuz, **üç ek validator** (halihazırda sahip olduğunuzun üstüne) oluşturmak için kullanılabilir.
- Tüm Execution layer ödüllerini (örneğin, blok proposal'larından ve [MEV ödüllerinden](./mev.mdx)) bir araya getiren ve bunları her ödül aralığında katılımcılar arasında adil bir şekilde dağıtan [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)'a katılım için uygundurlar.
- RPL stake ederseniz, bonus komisyon ve RPL enflasyon ödülleri kazanacaklardır (şu anda ETH staking ödüllerinden daha yüksek bir APR sağlar).

Bununla birlikte, vurgulanması önemli olan bazı farklar vardır:

- **Akıllı sözleşme riskini** kabul etmeniz gerekecektir, çünkü protokol bir dizi akıllı sözleşme olarak uygulanmıştır.
- Benzer şekilde, geleneksel node operasyonu **Smartnode yığınından** yararlanır; node'unuzda bu yazılımı kurma ve çalıştırmayla ilişkili tüm riskleri kabul etmeniz gerekecektir.
- Bir node operatörü olmak bazı yeni kavramları öğrenmeyi gerektirir, bu nedenle biri olmakla ilişkili bir **öğrenme eğrisi** vardır.
- Minipool'lar ödüllerini havuz staker'larıyla paylaşmak zorundadır, bu nedenle validator'ın çekim adresi Execution katmanında bir akıllı sözleşme olacaktır, **sizin kontrol ettiğiniz bir EOA değil**. Bu, Execution layer ödülleri için **fee recipient**'iniz için de geçerlidir ve bu da ödüllerinizi adil bir şekilde paylaşabilecek bir akıllı sözleşme olmalıdır.
- Rocket Pool'un **Oracle DAO**'su, bilgileri Beacon Chain'den Execution katmanına taşımaktan ve protokolün uygulayamadığı ihlalleri tespit etmekten (yasadışı bir fee recipient adresi gibi) sorumludur. Bir minipool çalıştırmak, Oracle DAO'nun bu işi doğru yapmasına güvenmeniz gerektiği anlamına gelir.

Solo validator'ınızı dönüştürmeye karar vermeden önce bu artıları ve eksileri dikkatlice gözden geçirmenizi öneririz.
Süreçle devam etmek isterseniz, lütfen sonraki bölümleri okuyun.

## Ön Koşullar

Dönüşüm sürecine başlamak için aşağıdaki kriterleri karşılamanız gerekir:

1. Yeni minipool'u barındırmak için [Rocket Pool ağına kayıtlı bir node'unuz olmalıdır](./prepare-node.mdx).
1. Geçirmek istediğiniz validator, Beacon chain'de **aktif** olmalıdır. Beklemede, slashed, çıkış yapıyor / çıkış yapmış veya çekilmiş olamaz.
1. Validator, Beacon chain'de **en az 32 ETH** bakiyesine sahip olmalıdır.
1. Validator, [BLS key withdrawal credentials](https://launchpad.ethereum.org/en/withdrawals) (`0x00` credentials) sahip olmalıdır. Dönüştürme, zaten diğer Execution layer çekim kimlik bilgilerine (`0x01` credentials) geçiş yapmış validator'lar üzerinde **yapılamaz**.
1. (Opsiyonel) Smartnode'un çekim kimlik bilgilerini sizin için otomatik olarak geçirmesini istiyorsanız, **mnemonic ifadenizin elinizin altında** olması gerekir.

Bu koşullardan hiçbiri sizin için engelleyici değilse, validator dönüşümüne başlamaya uygunsunuz.

## Süreç Genel Bakışı

İlk adım **yeni bir "vacant" minipool oluşturmaktır**.
Oluşturma sırasında yeni bir validator yapan geleneksel minipool'ların aksine, vacant minipool'lar _mevcut_ validator'ları yönetmek için tasarlanmış özel minipool'lardır.
Sonuç olarak, vacant minipool'lar `prelaunch` aşamasında geleneksel minipool'lardan biraz farklı davranır.
Başlatma tamamlandıktan ve `staking` aşamasına girdiklerinde, geleneksel minipool'lar haline gelirler.

Vacant minipool oluşturma sırasında, Smartnode'un validator'ınızın çekim kimlik bilgilerini eski BLS çekim anahtarından yeni vacant minipool adresine otomatik olarak **değiştirmesi** seçeneği sunulacaktır.
Bunu şu anda yapmak istemiyorsanız, Smartnode'un bunu daha sonra özel bir komutla yapmasını sağlayabilir veya bunu kendiniz bir üçüncü taraf araçla yapabilirsiniz.
Validator'ın çekim kimlik bilgilerini minipool adresine değiştirmenin dönüşüm için **gerekli** olduğunu unutmayın, bu nedenle bunu nasıl yaparsanız yapın, sürecin başarıyla tamamlanması için yapılması gerekecektir.

Çekim kimlik bilgileri değiştirildikten sonra, **validator'ın private key'ini** Smartnode tarafından yönetilen Validator Client'a **içe aktarma** seçeneğiniz olacaktır.
Smartnode'un validator'ı sürdürmesini istiyorsanız, kendi validator'ınızı yönetmek zorunda kalmazsınız, bu çekici bir seçenektir.
Kendi Validator Client'ınızı sürdürmeyi ve anahtarları orada tutmayı tercih ederseniz, bunu yapmakta özgürsünüz.

Bu noktada yeni minipool'unuz **scrub check** dönemine girecektir, Oracle DAO sürekli olarak validator'ınızın Beacon Chain'deki bilgilerini analiz ederek yasal kaldığını doğrulayacaktır.
Bu şunları içerir:

- Çekim kimlik bilgileri henüz geçirilmemiş (hala orijinal `0x00` BLS key credentials) veya minipool adresine geçirilmiş. Bunları başka bir Execution layer adresine geçirmek havuzun scrub edilmesine neden olur.
  - Scrub check dönemi sona erdiğinde çekim kimlik bilgileri hala orijinal `0x00` BLS key credentials ise, havuz scrub edilecektir.
- Validator, kontrolün süresi boyunca aktif olarak staking durumunda. Slashed, exited veya withdrawn durumuna geçerse, havuz scrub edilecektir.

::: tip NOT
**Scrubbed** vacant minipool, Rocket Pool ağının bir parçası olmadığı anlamına gelir, ancak yine de size (node operatörü olarak) CLI'daki tipik token geri alma yöntemleriyle tüm fonlarınıza erişim sağlayacaktır.
Vacant minipool'lar scrub edilirse fonlar **kaybolmaz**.
Scrubbed minipool'lar, bunların sonuçları ve nasıl kullanılacağı hakkında daha fazla bilgi bu rehberin ilerleyen bölümlerinde yer almaktadır.
:::

Scrub check geçtikten sonra, vacant minipool'unuzu **promote edebileceksiniz**.
Bu, dönüşümü tamamlayacak ve onu vacant minipool'dan normal bir minipool'a dönüştürecektir.
Bu noktada minipool, ağdaki diğer tüm minipool'lar gibi davranacak ve solo validator'ınız resmi olarak bir Rocket Pool validator'ına dönüştürülmüş olacaktır!

Sürecin bir parçası olarak, ağ Beacon chain'deki toplam ödüllerinizin (ve scrub check sırasında skim edilirseniz yeni minipool'unuzun içindeki) bir anlık görüntüsünü alacaktır.
Tüm bu ödüllerin size ait olduğunu ve staking havuzuyla paylaşılmaması gerektiğini kabul edecek, bu nedenle bunların tümünü promosyon tamamlandıktan sonra istediğiniz zaman talep edebileceğiniz bir **refund** olarak sağlayacaktır.

Aşağıda her adım için talimatlar dahil dönüşüm sürecinin ayrıntılı bir açıklaması yer almaktadır.

## Adım 1: Vacant Minipool Oluşturma

Dönüşüm sürecine başlamak için, Smartnode CLI ile aşağıdaki komutu çalıştırın:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Örneğin, pubkey'i `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661` olan bir solo validator'ı dönüştürmek istiyorsanız, şunu çalıştırırsınız:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Süreç sırasında ne beklemeniz gerektiğine dair kısa bir özet göreceksiniz, ardından bu minipool'u oluştururken kullanmak istediğiniz bond miktarı için sorulacaksınız:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

**8 ETH** seçtiğinizde, validator'ınızı 8-ETH bonded minipool'a dönüştüreceksiniz.
Orijinal 32 ETH yatırmanız, havuz staker'larından ödünç alınan 24 ETH ile 8 ETH yatırıma dönüştürülecektir.
Dönüşüm süreci tamamlandığında, daha fazla minipool oluşturmak için kullanabileceğiniz 24 ETH [kredi bakiyesine](./credit) sahip olacaksınız.

Bir seçenek seçtiğinizde, Smartnode, girdiğiniz validator'ın ve node'unuzun yukarıda listelenen tüm ön koşul gereksinimlerini geçtiğini doğrulamak için birkaç kontrol yapacaktır.
Bundan sonra, gaz fiyatınızı onaylamanızı ve ardından yeni vacant minipool'u oluşturmak için işlemi göndermenizi isteyecektir.
Oluşturulduktan sonra, minipool'un adresi size sunulacaktır:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Bu, validator'ınızın çekim kimlik bilgilerini değiştirirken kullanacağınız adrestir.

Bu noktada, Smartnode bunu otomatik olarak yapmasını isteyip istemediğinizi soracaktır (validator'ın private key'ini Smartnode tarafından yönetilen Validator Client'a içe aktarmayla birlikte, ki bu daha sonra tartışılacaktır):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Bu soruya `y` cevabı verirseniz, Smartnode Adım 2 ve 3'ü otomatik olarak yapacaktır; lütfen aşağıdaki [Otomatik Çekim Kimlik Bilgisi Değişikliği ve Anahtar İçe Aktarma](#otomatik-cekim-kimlik-bilgisi-degisikligi-ve-anahtar-ice-aktarma) bölümüne bakın.

Bu soruya `n` cevabı verirseniz, komut sona erecek ve Adım 1'i tamamlamış olacaksınız.
Lütfen bir sonraki [Adım 2](#adim-2-validatorin-cekim-kimlik-bilgilerini-degistirme) bölümüne gidin.

::: tip NOT
Bu süreci şimdi reddederseniz, CLI kullanarak daha sonra devam edebilirsiniz.
Bunu nasıl yapacağınızı öğrenmek için aşağıdaki [**Adım 2**](#adim-2-validatorin-cekim-kimlik-bilgilerini-degistirme) ve [**Adım 3**](#opsiyonel-adim-3-validator-keyini-ice-aktarma) bölümlerini okuyun.
:::

### Otomatik Çekim Kimlik Bilgisi Değişikliği ve Anahtar İçe Aktarma

::: danger UYARI
Smartnode'un çekim kimlik bilgilerinizi otomatik olarak değiştirmesini ve validator'ınızın private key'ini içe aktarmasını seçerseniz, kendi başınıza yönettiğiniz eski Validator Client'tan validator key'ini kaldırmanız ve anahtarın hala belleğe yüklenmiş olmadığından emin olmak için **eski Validator Client'ı kapatmanız** **esastır**.

Ayrıca bunu yaptıktan sonra **en az 15 dakika** beklemeniz gerekir, böylece **kasıtlı olarak en az iki attestation'ı kaçırmış** olduğundan emin olun.
Bunu [https://beaconcha.in](https://beaconcha.in) gibi bir chain explorer'a bakarak doğrulayabilirsiniz.

En az 15 dakika beklemezseniz, Smartnode'un Validator Client'ı validator'ınızın anahtarıyla attestation yapmaya başladığında validator'ınız **SLASHED OLACAKTIR**!

Slashing riskine karşı mümkün olduğunca güvenli olmak için Smartnode yapılandırmasında **doppelganger detection**'ı etkinleştirmenizi şiddetle öneririz.
:::

Validator key'ini otomatik olarak içe aktarmayı ve çekim kimlik bilgilerini minipool adresine değiştirmeyi seçerseniz, Smartnode önce hem validator'ınızın BLS private key'ini hem de karşılık gelen orijinal çekim anahtarını oluşturmak için kullanılan mnemonic'i soracaktır:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Bunu girdikten sonra, Smartnode mnemonic ve validator'ın pubkey'ini kullanarak eski BLS tabanlı çekim anahtarınızı türetecektir.
Daha sonra Beacon Chain'e, çekim kimlik bilgilerini eski BLS çekim anahtarından yeni minipool adresine değiştirmek istediğinizi belirten, çekim anahtarınız tarafından imzalanmış bir mesaj gönderecektir:

```
Changing withdrawal credentials to the minipool address... done!
```

Son olarak, validator'ınızın anahtarını Smartnode'un Validator Client'ına içe aktaracak ve bu anahtarla doğrulamaya başlaması için onu yeniden başlatmak isteyip istemediğinizi soracaktır:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Bununla birlikte, adım 2 ve 3 tamamlanmıştır.
Çekim kimlik bilgilerinin düzgün bir şekilde değiştirildiğini ve anahtarın aktif olarak doğrulama yaptığını [https://beaconcha.in](https://beaconcha.in) gibi bir chain explorer kullanarak doğrulayabilirsiniz.

Scrub check hakkında bilgi edinmek için [Adım 4](#adim-4-scrub-checkini-bekleme) bölümüne gidin.

## Adım 2: Validator'ın Çekim Kimlik Bilgilerini Değiştirme

Yeni vacant minipool'u oluşturduğunuzda, bir sonraki adım validator'ınızın çekim kimlik bilgilerini eski `0x00` BLS-key kimlik bilgilerinden yeni minipool adresini içeren yeni `0x01` kimlik bilgilerine değiştirmektir.

Bunu yapmanın iki yolu vardır:

1. Smartnode CLI'ı kullanarak, `rocketpool minipool set-withdrawal-creds` komutuyla.
1. [ethdo](https://github.com/wealdtech/ethdo) gibi harici bir üçüncü taraf aracı kullanarak.

Bu rehberde, yöntem 1'i (Smartnode) nasıl kullanacağınızı anlatacağız.
Yöntem 2 hakkında daha fazla bilgi için, lütfen kullanmak istediğiniz aracın belgelerine başvurun.

Aşağıdaki komutu çalıştırarak başlayın:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Örneğin, yeni vacant minipool adresi `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C` ise, şunu çalıştırırsınız:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Smartnode daha sonra hem validator'ınızın anahtarını hem de karşılık gelen çekim anahtarını oluşturmak için kullanılan mnemonic'i soracaktır:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Bundan sonra, validator'ınızın çekim kimlik bilgilerinin değiştirilebileceğinden emin olmak için bazı güvenlik kontrolleri yapacaktır.
Başarılı olursa, Beacon Chain'e, çekim kimlik bilgilerini eski BLS çekim anahtarından yeni minipool adresine değiştirmek istediğinizi belirten, çekim anahtarınız tarafından imzalanmış bir mesaj gönderecektir:

```
Changing withdrawal credentials to the minipool address... done!
```

İşte bu kadar!
Çekim kimlik bilgilerinin düzgün bir şekilde değiştirildiğini [https://beaconcha.in](https://beaconcha.in) gibi bir chain explorer kullanarak doğrulayabilirsiniz.

## (Opsiyonel) Adım 3: Validator Key'ini İçe Aktarma

Validator'ınızı bir minipool'a dönüştürdükten sonra, Smartnode'un Validator Client'ının onu şu anda kendi başınıza yönettiğiniz yerine çalıştırmasını isteyebilirsiniz.
Bunun birkaç avantajı vardır:

- Organizasyonel açıdan daha "temiz"dir (Smartnode minipool'larınızı yönetir, harici olarak yönetilen Validator Client'ınız solo staking validator'larınızı yönetir).
- `rocketpool minipool exit` gibi komutların (mesajları imzalamak için validator key'inizi gerektiren komutlar) çalışmasına izin verir.

Ancak, bunu yapmadan önce anlamanız gereken bazı **çok önemli hususlar** vardır:

- Validator'ınızın key'inin kendi Validator Client'ınızdan kaldırıldığından ve onu Smartnode'a aktarmadan önce kaldırdıktan sonra en az 15 dakika beklediğinizden **emin olmalısınız**. Aşağıdaki uyarı kutusuna bakın.
- Validator keystore'unuza _ve şifre dosyasına_ yedek aldığınızdan **emin olmalısınız**, çünkü `rocketpool wallet recover` ve `rocketpool wallet rebuild` gibi komutlar Smartnode cüzdanının mnemonic'inden türetilmediği için yedek olmadan onları yeniden **oluşturamaz**.

Validator key'inizi Smartnode'a içe aktarmak istiyorsanız, aşağıda okumaya devam edin.

::: danger UYARI
Smartnode'un validator'ınızın private key'ini içe aktarmasını seçerseniz, kendi başınıza yönettiğiniz eski Validator Client'tan validator key'ini kaldırmanız ve anahtarın hala belleğe yüklenmiş olmadığından emin olmak için **eski Validator Client'ı kapatmanız** **esastır**.

Ayrıca bunu yaptıktan sonra **en az 15 dakika** beklemeniz gerekir, böylece **kasıtlı olarak en az iki attestation'ı kaçırmış** olduğundan emin olun.
Bunu [https://beaconcha.in](https://beaconcha.in) gibi bir chain explorer'a bakarak doğrulayabilirsiniz.

En az 15 dakika beklemezseniz, Smartnode'un Validator Client'ı validator'ınızın anahtarıyla attestation yapmaya başladığında validator'ınız **SLASHED OLACAKTIR**!

Slashing riskine karşı mümkün olduğunca güvenli olmak için Smartnode yapılandırmasında **doppelganger detection**'ı etkinleştirmenizi şiddetle öneririz.
:::

Aşağıdaki komutu çalıştırarak başlayın:

```
rocketpool minipool import-key <minipool address>
```

Örneğin, yeni vacant minipool adresi `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C` ise, şunu çalıştırırsınız:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Smartnode daha sonra validator'ınızın anahtarını oluşturmak için kullanılan mnemonic'i soracaktır:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Bundan sonra, validator'ınızın public key'ini bulana kadar o mnemonic'den oluşturulan farklı anahtarları dolaşacaktır.
Daha sonra onu içe aktaracak ve anahtarınızı yüklemesi için Smartnode'un Validator Client'ını yeniden başlatmak isteyip istemediğinizi soracaktır:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Bununla birlikte, validator key'iniz artık Smartnode'a içe aktarıldı ve attestation yapmaya başladığını görmelisiniz.
Bunu Validator Client'ın loglarını bu komutla izleyerek doğrulayabilirsiniz:

```
rocketpool service logs validator
```

Ayrıca [https://beaconcha.in](https://beaconcha.in) gibi bir chain explorer'ın Validator Client'ınızın validator'ınızın key'iyle attestation yaptığını görebildiğini doğrulayabilirsiniz.

## Adım 4: Doğru Fee Recipient'ı Atama

Geçiş sürecini başlattıktan sonra, [fee recipient](./fee-distrib-sp#fee-recipients)'ınızın düzgün bir şekilde ayarlandığından emin olmanız **zorunludur** (node'unuzun [fee distributor](./fee-distrib-sp#your-fee-distributor)'üne veya bunu tercih ettiyseniz [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)'a).
Bunu yapmazsanız ve solo validator'larınız için fee recipient'ta bırakırsanız, cezalandırılacaksınız ve kayıp telafi etmek için Beacon Chain stake'inizin bir kısmı düşülecektir.

::: tip NOT
**Bu adım yalnızca validator key'inizi kendi harici olarak yönetilen Validator Client'ınızda bırakırsanız gereklidir.**

Kendi VC'nizden kaldırıp Rocket Pool tarafından yönetilen VC'ye aktarırsanız, fee recipient'ınız `node` işlemi tarafından otomatik olarak doğru adrese atanacaktır.
:::

VC'nizde fee distributor veya Smoothing Pool'a ayarlamak isteme*diğiniz* diğer solo-staking anahtarlarını tutabileceğiniz için, bunu başarmanın tek yolu, geçirilmekte olan validator için fee recipient'ı manuel olarak ayarlamak için bir VC yapılandırma dosyası kullanmaktır.

Bu süreç, hangi Consensus Client'ı kullandığınıza bağlıdır; ayrıntılar için belgelere bakın, ancak işte bazı yararlı bağlantılar:

[Lighthouse: `validator_definitions.yml` aracılığıyla](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** şu anda validator'a özgü fee recipient'ları ayarlamayı desteklemiyor. Lütfen anahtarı, geçirilmeyen diğer solo anahtarlarla harici olarak yönetilen VC'nizde tutuyorsanız Lodestar kullanmayın.

[Nimbus: keymanager API aracılığıyla](https://nimbus.guide/keymanager-api.html)

[Prysm: `proposer-settings-file` aracılığıyla](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: `validators-proposer-config` aracılığıyla](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Eth-docker kullanıyorsanız, belgelerinde açıklandığı gibi kullandığınız her anahtar için bireysel recipient'ları ayarlamak için [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) komutunu kullanabilirsiniz.

## Adım 5: Scrub Check'ini Bekleme

Bu zamana kadar, adım 1 ve 2'yi (vacant minipool oluşturma ve validator'ınızın çekim kimlik bilgilerini değiştirme) ve isteğe bağlı olarak adım 3'ü (anahtarı Smartnode'a içe aktarma) tamamlamış olmalısınız.
Bir sonraki adım **scrub check**'inin tamamlanmasını beklemektir.
Bu, Oracle DAO tarafından aşağıdakileri doğrulamak için gerçekleştirilen bir işlemdir:

1. Validator'ınızın Beacon Chain'deki bakiyesi (ve Execution katmanında minipool'unuzun bakiyesi), ilk vacant minipool'u oluşturduğunuzda validator'ınızın sahip olduğu bakiyeden **en az** eşit olmalıdır, bakım sırasında herhangi bir kazara kaçırılan attestation'ı hesaba katmak için 0.01 ETH'lik küçük bir tampon eksi.

- Örneğin, adım 1'i gerçekleştirdiğinizde validator'ınızın Beacon Chain bakiyesi 35 ETH ise, birleştirilmiş Beacon Chain ve minipool bakiyeleri scrub check'inin tüm süresi boyunca **en az** 34.99 ETH olmalıdır.

2. Validator'ınız tüm scrub check için **aktif olarak staking** durumunda kalmalıdır - slashed, exited veya withdrawn olamaz.
3. Validator'ınızın çekim kimlik bilgileri ya **orijinal BLS tabanlı çekim anahtarı kimlik bilgileri** ya da **minipool'un adresini kullanan yeni 0x01 kimlik bilgileri** olmalıdır. Diğer kimlik bilgileri minipool'un scrub edilmesine neden olur.

- Çekim kimlik bilgisi değişikliğini gerçekleştirmek için **yaklaşık 2,5 günlük** bir yetkisiz kullanım süresi verilir (scrub döneminin 3 günlük süresinin %85'i).

Scrub check geçicidir; bu süre zarfında validator'ınızı çevrimiçi tutmak ve iyi performans göstermekten başka bir şey yapmanız gerekmez.

Scrub check'inde ne kadar süre kaldığını izlemek için, `node` loglarına aşağıdaki komutla bakabilirsiniz:

```
rocketpool service logs node
```

İlgili satırlar şöyle görünecektir:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

**3 gün** sürecek, bundan sonra geçmiş olacaksınız ve vacant minipool'u tam bir minipool'a promote etmek için [Adım 6](#adim-6-minipoolu-promote-etme)'ya geçebilirsiniz.

### Scrubbed Minipool'larla Çalışma

Minipool'unuz ne yazık ki scrub check'ini geçemezse ve feshedilirse, endişelenmeyin - sermayeniz kaybolmadı.
Feshedilen vacant minipool'lar esasen basitleştirilmiş çekim adresleri olarak hareket eder:

- Teknik olarak Rocket Pool ağının bir parçası değildirler.
- Minipool'a yatırılan herhangi bir sermaye _yalnızca_ node operatörüne aittir. Havuz staker'larıyla _paylaşılmaz_.
- Minipool oluşturma için bir yatırma kredisi ödülü verilmez.

Minipool'un bakiyesine istediğiniz zaman aşağıdaki komutla erişebilirsiniz:

```shell
rocketpool minipool distribute-balance
```

Bu, minipool'un tüm bakiyesini node'unuzun çekim adresine gönderecektir.

Validator'ınızı Beacon Chain'den çıkardığınızda ve tam bakiyesi minipool'a gönderildiğinde, onu geri alabilir ve minipool'u aşağıdaki komutla kapatabilirsiniz:

```shell
rocketpool minipool close
```

Bir kez daha, bu minipool'un tam bakiyesini node'unuzun çekim adresine gönderecektir.

## Adım 6: Minipool'u Promote Etme

Scrub check başarıyla geçildiğinde, vacant minipool'u tam bir minipool'a promote edebilirsiniz.
Bu iki şekilde yapılabilir:

1. `node` işleminin scrub check sona erdiğinde otomatik olarak halletmesine izin verin.
1. CLI kullanarak manuel olarak yapın.

İlk yöntem, `node` işlemi / konteynırını çalıştırdığınızı ve ağın gaz maliyetinin Smartnode yapılandırma sürecinde belirttiğiniz otomatik işlem eşiğinin altında olduğunu varsayarak minipool'u sizin için otomatik olarak promote edecektir (varsayılan 150).
`Node` loglarında, aşağıdaki gibi çıktılar göreceksiniz:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

`Node` işleminiz devre dışıysa, aşağıdaki komutla ikinci yöntemi kullanabilirsiniz:

```shell
rocketpool minipool promote
```

Buradan, sadece promosyon için uygun olan minipool'lar listesinden vacant minipool'unuzu seçin ve işlemi gönderin.

## Orijinal Dönüşüm Öncesi Ödüllerinizi Talep Etme

Promosyon üzerine, minipool'unuz `staking` durumuna girecek ve resmi olarak normal bir Rocket Pool minipool'u haline gelmiş olacaktır.
Ayrıntıları bu komutla gözden geçirebilirsiniz:

```shell
rocketpool minipool status
```

Bu size yeni minipool'unuzun durumunu, bakiyelerini, iadesini vb. gösterecektir.
Örneğin:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Burada aşağıdaki önemli bilgileri görebilirsiniz:

- `Node deposit`, bu minipool'un bir parçası olarak kişisel olarak ne kadar ETH bağladığınızı gösterir (bu durumda, 8 ETH).
- `RP deposit`, minipool'u oluşturmak için havuz staker'larından ne kadar ETH ödünç aldığınızı gösterir (bu durumda, 24 ETH).
- `Available refund`, minipool'un bakiyesinin ne kadarının doğrudan size gittiğini gösterir (havuz staker'larıyla _paylaşılmaz_. Bu, vacant minipool'u oluşturduğunuz sırada Beacon Chain'deki tüm ödüllerinize eşittir.
- `Minipool Balance (EL)`, minipool sözleşmesinin toplam bakiyesini gösterir.
- `Your portion (EL)`, minipool'un bakiyesinden iadesi çıkardıktan _sonra_ bakiyenin ne kadarının size ait olduğunu gösterir. Başka bir deyişle, bu, vacant minipool'u oluşturduktan _sonra_ kazandığınız ödüllerin sizin payınızdır.
- `Total EL rewards`, iadeniz artı dönüşüm sonrası ödüllerinizdir.

İadenizi talep etmek için aşağıdaki komutu çalıştırın:

```shell
rocketpool minipool refund
```

Sadece listeden minipool'unuzu seçin, işlemi onaylayın ve iadeniz node'unuzun çekim adresine gönderilecektir.

## Node Credit'inizi Kullanma

Artık aktif bir promote edilmiş minipool'unuz olduğuna göre, `rocketpool node status` çalıştırdığınızda node'unuzun bir kredi bakiyesi olduğunu fark edeceksiniz:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

Bu örnekte, orijinal 32 ETH validator bond'unu 8-ETH minipool'a dönüştürdüğümüz için, [**24 ETH kredi**](./credit) aldık.
Bu kredi, yeni minipool'lar ve validator'lar oluşturmak için ücretsiz olarak kullanılabilir!

Sadece `rocketpool node deposit` komutunu çalıştırın ve hangi bond miktarını kullanmak istediğinizi seçin.
Kredi bakiyenizde bond'u karşılamak için yeterli ETH varsa, otomatik olarak kullanılacaktır ve ek ETH stake etmenize gerek kalmayacaktır (yine de gaz için ödeme yapmanız gerekir).

::: warning NOT
Kredi bakiyeniz için kullanılan ETH, staking havuzundan gelir.
Staking havuzunda kredi bakiyenizi karşılamak için yeterli ETH yoksa, daha fazla ETH yatırılana kadar onu kullanamazsınız.
:::
