# Bir Node Operator'ün Sorumlulukları

## Ethereum Staking Nasıl Çalışır

Hatırlatma olarak, Proof of Stake'te staking **validatorler** aracılığıyla yapılır.
Bir validator, esasen Execution katmanında 32 ETH yatırılan tek bir Beacon Chain adresidir.
Validatorler, Beacon Chain'in tutarlılığını ve güvenliğini sağlamaktan sorumludur.
Bunu, işlemleri ve yeni blok önerilerini dinleyerek ve önerilen bloğun arka planda sayı hesaplaması ve doğrulama yaparak yasal, geçerli işlemler içerdiğine **onay vererek** yaparlar.
Ara sıra kendileri de yeni bloklar önerebilirler.

Validatorlere onaylar ve blok önerileri **rastgele bir programa göre atanır**.
Bu, herkesin sürekli olarak birbirleriyle yarışmaya çalıştığı ve diğerlerinden önce bir sonraki blokla gelmeye çalıştığı eski Proof of Work sisteminden çok farklıdır.
Bu, madencilerin bir sonraki bloğu bulamadıkları sürece bir blok ödülü kazanmalarının garanti edilmediği Proof of Work'ün aksine, Proof of Stake validatorlerinin görevlerini yerine getirdikleri sürece yavaş, istikrarlı bir gelire sahip olmalarının garanti olduğu anlamına gelir.
Bir validator çevrimdışıysa ve bir onayı veya blok önerisini kaçırırsa, **hafif bir ceza** alacaktır.
Yine de cezalar oldukça küçüktür; genel bir kural olarak, bir validator X saat çevrimdışıysa, tekrar çevrimiçi olduktan sonra aynı X saat içinde kaybettiği tüm ETH'yi geri kazanacaktır.

### Ödüller

Validatorler konsensus katmanı ödüllerini Onay, Blok Önerileri, Senkronizasyon Komiteleri (nadir) ve Slashing Ödüllerinden (son derece nadir) kazanırlar. Ayrıca execution katmanı ödüllerini Öncelik Ücretleri ve MEV'den kazanırlar.

10/2024 itibarıyla, genel APR ~%3.5'tir, %2.8'i konsensus katmanı APR'si ve %0.7'si execution katmanı APR'sidir. Bu bilgiyi bulabileceğiniz bir yer [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake)'dir.

### Cezalar

Validatorler çevrimdışıysa ve atanan görevlerini yerine getirmekte başarısız olursa küçük miktarlarda ETH ile cezalandırılırlar.
Buna **sızma** denir.
Bir validator Beacon zincirinin temel kurallarından birini ihlal ederse ve ağa saldırıyor gibi görünürse, **kesilmesine** maruz kalabilir.
Slashing, izniniz olmadan validatorünüzün zorla çıkarılmasıdır ve validatorünüzün ETH bakiyesinin bir kısmını kaldıran nispeten büyük bir para cezası eşliğindedir.

Gerçekçi olarak, slashing'e neden olabilecek tek koşul, validatorünüzün anahtarlarını aynı anda iki düğümde çalıştırmanızdır (yedek düğümünüz ana düğümünüz hala çalışırken yanlışlıkla açılan bir failover / redundancy kurulumu gibi).
Bunun olmasına izin vermeyin ve **kesilmezsiniz**.
Slashing, bakım için çevrimdışı olmaktan _meydana gelemez_.

Aşağıda bir validatora olabilecek cezaları gösteren bir tablo bulunmaktadır:

| Tip                   | Katman    | Miktar                                                                                  |
| --------------------- | --------- | --------------------------------------------------------------------------------------- |
| Missed Attestation    | Consensus | -0.000011 ETH\* onay başına (-normal bir onay ödülünün değerinin 9/10'u)                |
| Missed Proposal       | Consensus | 0                                                                                       |
| Missed Sync Committee | Consensus | -0.00047 ETH\* epoch başına (-tüm senkronizasyon komitesi için çevrimdışıysa toplam -0.1 ETH) |
| Slashing              | Consensus | Bakiyenizin en az 1/32'si, aşırı durumlarda tüm bakiyenize kadar                        |

\*_Ağdaki toplam validator sayısına göre değişir.
435.000 aktif validator için yaklaşık._

::: tip İPUCU
Genel bir kural olarak, X saat çevrimdışıysanız (ve bir senkronizasyon komitesinde değilseniz), tekrar çevrimiçi olduktan ve onay verdikten sonra X saat içinde sızan tüm ETH'nizi geri kazanacaksınız.
:::

## Rocket Pool Node'ları Nasıl Çalışır

Yeni bir validator oluşturmak için 32 ETH yatırması gereken solo staker'ların aksine, Rocket Pool node'ları validator başına yalnızca 8 ETH yatırması gerekir ("bond ETH" olarak adlandırılır).
Bu, yeni bir validator oluşturmak için staking havuzundan 24 ETH ile ("borrowed ETH" olarak adlandırılır, rETH karşılığında liquid staker depozitolarından gelir) birleştirilecektir.
Bu yeni validator bir **minipool**'a aittir.

Beacon zinciri için bir minipool, normal bir validator ile tamamen aynı görünür.
Aynı sorumluluklara, uyması gereken aynı kurallara, aynı ödüllere vb. sahiptir.
Tek fark, minipool'un execution katmanında nasıl oluşturulduğu ve node operator minipool'dan gönüllü olarak çıkmaya karar verdiğinde para çekme işlemlerinin nasıl çalıştığıdır.
Oluşturma, para çekme ve ödül delegasyonunun tümü Ethereum zincirindeki Rocket Pool'un **akıllı sözleşmeleri** tarafından yönetilir.
Bu onu tamamen merkeziyetsiz yapar.

Bir Rocket Pool **Node**'u, Rocket Pool'un akıllı sözleşmelerine kayıtlı bir Ethereum cüzdanına sahip tek bir bilgisayardır.
Node daha sonra karşılayabildiği kadar minipool oluşturabilir ve hepsi aynı makinede mutlu bir şekilde birlikte çalışabilir.
**Tek bir Rocket Pool node'u birçok, birçok minipool çalıştırabilir.**
Her minipool'un genel sistem performansı üzerinde ihmal edilebilir bir etkisi vardır; bazı insanlar tek bir node'da yüzlercesini çalıştırabilmiştir.

Bir minipool'un ön maliyeti 8 ETH'dir. Ayrıca, bir node operator ek ödüller almak ve protokol DAO'su içinde oy gücü kazanmak için node'una RPL stake edebilir.

## Rocket Pool Node Operatorleri

**Node operatorleri** Rocket Pool'un kalbi ve ruhudur.
Onlar Rocket Pool node'larını çalıştıran bireylerdir.

### Sorumluluklar

Staking havuzundan ETH'yi onunla minipooller çalıştırarak işe koyarlar, bu da Rocket Pool protokolü için staking ödülleri kazanır (ve böylece rETH'nin değerini artırır).
İşleri basittir, ancak son derece önemlidir: _mümkün olan en yüksek kalitede validatorler çalıştırın ve staking ödüllerini maksimize edin_.

Node operatorleri şunlardan sorumludur:

- Bir bilgisayar kurma (fiziksel veya sanal)
- Uygulanabilirse ev ağları dahil olmak üzere doğru şekilde yapılandırma
- Üzerine Rocket Pool yükleme ve doğrulama gerçekleştirmek için minipooller kurma
- Hem dış hem de iç tehditlerden güvenli hale getirme
- Validatorlerinin ömrü boyunca bakımını yapma

Bu büyük bir sorumluluktur ve basit bir kur-ve-unut türü bir iş değildir; stake ettiği sürece node'unuza bakmanız gerekir.
Ancak büyük sorumlulukla birlikte büyük ödüller gelir.

### Ödüller

Bir Rocket Pool node'u çalıştırmanın başlıca faydaları şunlardır:

- Her validatorün ETH ödüllerinden payınızı ve komisyon kazanırsınız.
  - Stake edilmiş RPL olmayan 8 ETH bağlı minipooller için bu, solo staking'den %30 daha fazladır (`(8+24*.1)/8 = 1.3`)
  - RPL stake etmek artırılmış komisyon sağlar. Toplam ödünç alınan ETH'nizin %10'u veya daha fazlası değerinde RPL stake ile, ETH ödülleri solo staking'den %42 daha fazla gelir (`(8+24*.14)/8 = 1.42`)
  - **Not:** smoothing pool'a katılmazsanız, bunun yerine solo staking'den %15 daha fazla alacaksınız (`(8+24*.05)/8 = 1.15`) -- 2024-10-28'de veya sonrasında yapılan minipoolları olan kullanıcıların smoothing pool'u seçmeleri şiddetle tavsiye edilir.
- Ayrıca stake ettiğiniz RPL üzerinden ihraç ödülleri kazanırsınız.
  - Bir dönemin sonunda (her 28 günde bir), RPL'nizin bir anlık görüntüsü alınır.
  - Toplam ödünç alınan ETH'nizin değerinin **%15'ine kadar** RPL üzerinde maksimum verim kazanabilirsiniz.
    - Bunun ötesindeki RPL üzerinde azalan bir seviyede verim kazanacaksınız.
  - Stake edilmiş RPL'nizin karekökü temelinde oy gücü alacaksınız.

### Sınırlamalar

Yukarıdaki ödüllerle birlikte gelen bazı sınırlamalar vardır:

- Node'unuz kötü performans gösterirse ve minipool'unuzdan çıkmaya karar verene kadar aslında ETH kaybederseniz, kaybedilen tüm ETH payınızdan çıkar.
  - Örneğin: 30 ETH bakiyesiyle çıkarsanız, minipool'unuz başlangıçtaki 32 ETH depozitosundan 2 ETH kaybetmiştir. 6 ETH alacaksınız ve 24 ETH staking havuzuna iade edilecektir.
- Stake edilmiş RPL'niz daha az likit olacaktır
  - Bağlı ETH'nizin %60'ı değerinde olanın ötesindeki RPL stake'ini yalnızca çekebilirsiniz.
  - Son 28 gün içinde stake ettiyseniz RPL çekemezsiniz

### Bunu yapabilirsiniz

Komut satırını veya bilgisayar bakımını kullanmaya oldukça yeniyseniz, bu korkutucu bir zorluk gibi görünebilir.
Neyse ki, Rocket Pool'un en temel ilkelerinden biri _merkeziyetsizliktir_ - herhangi birinin, herhangi bir yerde, kararlılığa ve bilgiye sahipse bir node çalıştırabileceği gerçeği.
Kararlılık konusunda yardımcı olamasak da, bilgi konusunda yardımcı _olabiliriz_.
Bu bölüm, harika bir Rocket Pool node'unun nasıl çalıştırılacağını anlamanıza yardımcı olacak kılavuzlar, yönergeler ve bilgilerle doludur.
