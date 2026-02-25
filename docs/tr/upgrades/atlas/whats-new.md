# Atlas Güncellemesi

::: tip NOT
Atlas `18 Nisan 2023, 00:00 UTC` tarihinde dağıtıldı. En son protokol yükseltmesi olan Houston hakkında bilgi almak için lütfen [buraya](../houston/whats-new) bakın.
:::

Bu sayfa, Rocket Pool'un **Atlas** başlıklı bir sonraki büyük güncellemesinin protokole getirdiği, hem Smartnode stack'ine hem de Rocket Pool protokolüne genel olarak getirdiği önemli değişiklikleri açıklamaktadır.

Rocket Pool'un önceki sürümü (Redstone) ile Atlas arasındaki tüm farklılıkları anlamak için lütfen bu sayfayı baştan sona okuyun.

## Yeni Protokol Özellikleri

Atlas, hem topluluk geri bildirimlerine hem de Ethereum protokolündeki değişikliklere dayanan bazı heyecan verici yeni özellikler getiriyor.
Aşağıda bu değişikliklerin kısa bir listesi bulunmaktadır - herhangi biri hakkında daha fazla bilgi edinmek için üzerine tıklayın.

### Shapella ve Çekimler

Ethereum protokolü, bir sonraki büyük yükseltmesine hazırlanıyor: Execution katmanında **Shanghai** ve Consensus katmanında **Capella** - bunlar artık birbirine bağlı olduğundan, her ikisi de aynı anda gerçekleşecektir.
Ethereum kullanıcıları birleşik yükseltmeyi sevgiyle [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) olarak adlandırmaya başladılar.

Shapella, Beacon Chain'e **çekimler** getiriyor, yani düğüm operatörleri artık şu anda Beacon Chain'de kilitli olan ETH'ye erişebiliyor.
Bu iki şekilde gelir:

- Kısmi çekimler (**skimming**), ödülleriniz (32 ETH üzerindeki fazla Beacon Chain bakiyeniz) Execution Katmanındaki minipool'unuza gönderilir. Bu, _protokolün kendisi tarafından otomatik olarak_ zaman zaman yapılır (Mainnet'te yaklaşık dört veya beş günde bir).
- **Tam çekimler**, validator'ınızı Beacon Chain'den çıkarırsınız ve tüm bakiyesi Execution Katmanındaki minipool'unuza gönderilir. Bu, validator'ınız zincirden yeterince uzun süre çıkarıldıktan sonra _protokolün kendisi tarafından otomatik olarak_ yapılır.

Atlas, düğüm operatörlerinin minipool'un ETH bakiyesini istediği zaman **dağıtmasına** izin veren, düğüm operatörü ve rETH sahipleri arasında eşit şekilde bölen (artı komisyon tabii) minipool'lar için yeni bir delegate sözleşmesi sunar.
Bu, düğüm operatörlerine Beacon Chain ödüllerine **anında erişim** sağlar!
Ayrıca rETH sahiplerinin payını tekrar deposit pool'a koyar, böylece protokolün döviz kurunda rETH'yi ETH için unstake etmek için kullanılabilir (veya yeni minipool'lar oluşturmak için).

### 8-ETH Bonded Minipool'lar

Atlas'ta en çok beklenen değişikliklerden biri, 16 ETH yerine yalnızca 8 ETH sağlayarak minipool yapma yeteneğinin sunulmasıdır.
Sahip oldukları düğüm operatörü tarafından yalnızca 8 ETH bağlanmış minipool'lar, bir validator yapmak için (rETH sahipleri tarafından sağlanan) staking pool'dan **24 ETH** ile eşleştirilir.
Bu, kendi validator'ınızı çalıştırmak için gereken sermaye gereksinimini önemli ölçüde azaltır _ve_ hem düğüm operatörü hem de rETH staker'ları için daha büyük getiriler sağlar!
Aslında, bir 16-ETH minipool yerine iki 8-ETH minipool çalıştırmak **%18'den fazla ödül** sağlayacaktır - 16-ETH minipool %20 komisyon oranına sahip olsa bile.

Bir 8 ETH minipool oluşturmak, **en az 2,4 ETH değerinde RPL** ve **en fazla 12 ETH değerinde RPL** stake etmenizi gerektirir.
Bunlar, protokolden _ödünç aldığınız_ miktarın %10'unu ve kendinizin _bond ettiğiniz_ (stake ettiğiniz) miktarın %150'sini temsil eder.

Yeni minipool'lar 8 ETH veya 16 ETH ile oluşturulabilir.
16 ETH minipool'lar bugün çalıştıkları gibi değişmeden kalır ve RPL token'ına maruziyetlerini en aza indirmek isteyen kullanıcılar için mevcuttur.

8 ETH bond kullanarak yeni minipool'ların nasıl yapılacağını öğrenmek için lütfen [minipool oluşturma rehberine](../../node-staking/create-validator.mdx) bakın.

Ayrıca, Atlas uygulandıktan sonra, düğüm operatörleri **mevcut 16-ETH minipool'ları çıkmadan doğrudan 8-ETH minipool'a geçirebilir**.
Bu onlara [deposit credit'te](../../node-staking/credit) 8 ETH geri verecek, bu da **ücretsiz yeni bir 8-ETH minipool** oluşturmak için kullanılabilir!

8-ETH bond minipool'lar hakkında daha fazla bilgi edinmek için lütfen [bond azaltma rehberine](../../node-staking/leb-migration.mdx) bakın.

### Solo Validator Dönüşümü

Shapella yükseltmesinin bir parçası, solo validator'ların [validator'larının çekim kimlik bilgilerini](https://notes.ethereum.org/@launchpad/withdrawals-faq) orijinal (artık kullanılmayan) BLS tabanlı çekim anahtarından Execution katmanındaki bir adrese değiştirme yeteneğini içerir.
Bu adres, o validator'ın tüm ödülleri ve Beacon Chain'den çıktıktan sonra tam ETH bakiyesi için alıcı olacaktır.

Normal Rocket Pool düğüm operatörlerinin bunun hiçbiri hakkında endişelenmelerine gerek yok, çünkü protokol minipool'larınızı oluşturduğunuzda bunu otomatik olarak ayarladı.
_Ancak_, solo validator'lar için bu yeni gereksinimin bir parçası olarak, Atlas heyecan verici bir fırsat getiriyor: **mevcut solo validator'ınız** için çekim adresi olacak **özel bir minipool oluşturma** yeteneği.

Başka bir deyişle, bu **bir solo validator'ı çıkmadan doğrudan Rocket Pool minipool'a dönüştürmenize** olanak tanıyacaktır!

Bu, Rocket Pool minipool'larının tüm avantajlarını elde edeceğiniz anlamına gelir:

- Bir validator'ınızı (32 ETH bond ile) **dört minipool'a** (her biri 8 ETH bond ile) dönüştürme yeteneği, Beacon Chain'deki varlığınızı etkili bir şekilde **dört katına çıkarma**
- rETH staker'ları tarafından sağlanan minipool'ların kısmında komisyon
- Blok önerilerinden ve MEV'den gelen ödülleri havuzlamak ve eşit şekilde dağıtmak için Rocket Pool'un [Smoothing Pool'una](../../node-staking/fee-distrib-sp#the-smoothing-pool) erişim

Bir solo validator'ı minipool'a dönüştürme hakkında daha fazla bilgi için lütfen [Solo Validator'ı Minipool'a Dönüştürme](../../node-staking/solo-staker-migration) rehberine bakın.

## Yeni Smartnode Özellikleri

Rocket Pool protokolündeki temel değişikliklere ek olarak, Atlas ayrıca v1.9.0'da bulunan Smartnode stack'inin kendisine bazı heyecan verici yükseltmeler getiriyor.

### Otomatik Ödül Dağıtımları

Zaten aktif bir Rocket Pool düğüm operatörüysaniz, belirli otomatik süreçleri yöneten `rocketpool_node` sürecini tanıyor olabilirsiniz.
Örneğin, doğru fee recipient'a sahip olduğunuzdan emin olur ve `prelaunch` minipool'lar 12 saatlik scrub kontrolünü geçtikten sonra ikinci `stake` işlemini sizin için otomatik olarak çalıştırır.

Atlas'tan başlayarak, `node`'un yeni bir görevi var: **minipool ödüllerinin otomatik dağıtımı!**
Bu, [Shapella yükseltmesinin nasıl çalıştığına](../../node-staking/skimming) bağlıdır, ödüllerinizi Beacon Chain'den birkaç günde bir minipool'unuza aktararak.

Minipool'larınızdan herhangi biri kullanıcı tarafından belirtilen bir eşikten (varsayılan 1 ETH) daha büyük bir bakiyeye ulaştığında, düğüm otomatik olarak üzerinde `distribute-balance` çalıştıracaktır.
Bu, ödüllerinizin sizin kısmını çekim adresinize ve pool staker'ının kısmını tekrar deposit pool'a gönderecektir.

Eşiği değiştirmek, `service config` TUI'sinin `Smartnode and TX Fees` bölümünde, `Auto-Distribute Threshold` ayarı altında yapılabilir.

### Birleşik Grafana Dashboard

Popüler talep üzerine, düğüm operatörlerinin düğümlerinin durumunu, ilerlemesini ve genel sağlığını izlemelerine ve değerlendirmelerine yardımcı olmak için yeni bir [**Grafana dashboard**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) oluşturduk:

![](../../node-staking/images/grafana-1.3.jpg)

Aşağıdaki çok talep edilen özelliklerle birlikte gelir:

- Tek bir dashboard'da tüm Execution ve Consensus client'ları için destek - hangi client'ları kullandığınıza göre artık dashboard değiştirmeye gerek yok!
- CPU ve RAM kullanımı ve peer sayısı dahil Execution client istatistikleri
- Önceki epoch için onaylarınızın ne kadar "doğru" olduğunu takip eden onay doğruluğu izleme, böylece optimal ödüllerden ne kadar uzakta olduğunuzu bilirsiniz
- Smoothing Pool'un bakiyesini izleme
- Smoothing Pool'dan ETH dahil talep edilen ve talep edilmeyen ödüllerin izlenmesi
- Rocket Pool'un Snapshot tabanlı yönetim oylamaları hakkında istatistikler
- İşletim sisteminiz için biriniz ve zincir verileriniz için farklı bir SSD'niz varsa ikinci SSD'nin kullanılan alanını ve sıcaklığını izlemek için alan
- Ve dahası!

Yeni dashboard'u [Grafana rehberimizi](../../node-staking/grafana.mdx) takip ederek resmi Grafana hizmetinden `21863` ID'si kullanarak içe aktarabilirsiniz.

Bu yeni dashboard, topluluk üyesi **0xFornax**'ın kapsamlı yardımını içeren bir sevgi emeği oldu - tüm sıkı çalışmanız için teşekkür ederiz!

### Nimbus Değişiklikleri

Smartnode v1.9.0, Nimbus için **split mode desteği** sunuyor!
Beacon Node ve Validator Client'ı tek bir süreç / container içinde çalıştırmak yerine, Smartnode artık onları diğer client'lar gibi ayrı container'larda çalıştıracak. Bunun aşağıdaki faydaları vardır:

- Nimbus artık **fallback client'ları** destekliyor (birincil client'larınız bakım için kapalıyken, yeniden senkronize olurken gibi Nimbus'un Validator Client'ının bağlanabileceği ikincil bir Execution client ve Beacon Node).
- Nimbus artık **Harici Yönetilen (Hibrit) Mod**'da destekleniyor, böylece Smartnode'un yönettiği Validator Client'ı kendi başınıza sürdürdüğünüz harici bir Beacon Node'a eşleştirebilirsiniz.
- Yeni minipool'ların eklenmesinden sonra Beacon Node'un yeniden başlatılmasına gerek kalmadı, yani peer'larına yeniden bağlanırken onayları kaybetmiyorsunuz.

### Lodestar Desteği

[Lodestar](https://chainsafe.github.io/lodestar/) artık Consensus Client seçiminiz için bir seçenek olarak destekleniyor!
Bu, [Ethereum'un Launchpad'ine](https://launchpad.ethereum.org/en/lodestar) resmi olarak kabul edilen en yeni ektir ve doğrulama için hazırdır.
Lodestar, diğer client'lardan sevdiğiniz harika özelliklerin çoğunu destekler; Doppelganger Detection, MEV-Boost, harici yönetilen client'lar (Hibrit Mod) ve dahası!

### Yeni Network Snapshot Sistemi

Biraz daha teknik bir notta, v1.9.0 hem Execution hem de Consensus katmanlarında **düğümünüzle ilgili her şeyin** durumunun bir snapshot'ını hızlıca yakalamak için yepyeni bir sistem sunuyor.
Perde arkasında, bu sistem binlerce bireysel Execution client sorgusunu tek bir istekte toplamak için [MakerDAO'nun multicall sözleşmesini](https://github.com/makerdao/multicall) ve Will O'Beirne'in [Ethereum Balance Checker sözleşmesini](https://github.com/wbobeirne/eth-balance-checker) kullanır.

Bu, `node` sürecini çok sayıda validator'a sahip düğüm operatörleri için Execution client üzerinde çok daha az zorlayıcı hale getirir ve CPU yükünü önemli ölçüde azaltmalı, bu da onayları ve genel ödülleri iyileştirecektir.

Bu yeni sistem henüz CLI'nin kendisine girmedi, bu nedenle orada çalıştırdığınız tüm komutlar (`rocketpool minipool status` gibi) hala eski tek sorgu kurulumunu kullanacak.
Zamanla onu CLI'ye de ekleyeceğiz, bu da tüm komutlarını şimşek hızında yapacak (_işlemlerin doğrulanmasını bekleme hariç, bu hala biraz zaman alıyor_).
