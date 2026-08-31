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

5/2026 itibarıyla, genel APR ~%2.634'tir, %2.8'i konsensus katmanı APR'si ve %0.22'si execution katmanı APR'sidir. Bu bilgiyi bulabileceğiniz bir yer [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake)'dir.

### Cezalar

Validatorler çevrimdışıysa ve atanan görevlerini yerine getirmekte başarısız olursa küçük miktarlarda ETH ile cezalandırılırlar.
Buna **sızma** denir.
Bir validator Beacon zincirinin temel kurallarından birini ihlal ederse ve ağa saldırıyor gibi görünürse, **kesilmesine** maruz kalabilir.
Slashing, izniniz olmadan validatorünüzün zorla çıkarılmasıdır ve validatorünüzün ETH bakiyesinin bir kısmını kaldıran nispeten büyük bir para cezası eşliğindedir.

Gerçekçi olarak, slashing'e neden olabilecek tek koşul, validatorünüzün anahtarlarını aynı anda iki düğümde çalıştırmanızdır (yedek düğümünüz ana düğümünüz hala çalışırken yanlışlıkla açılan bir failover / redundancy kurulumu gibi).
Bunun olmasına izin vermeyin ve **kesilmezsiniz**.
Slashing, bakım için çevrimdışı olmaktan _meydana gelemez_.

Aşağıda bir validatora olabilecek cezaları gösteren bir tablo bulunmaktadır:

| Tip                   | Katman    | Miktar                                                                                        |
| --------------------- | --------- | --------------------------------------------------------------------------------------------- |
| Missed Attestation    | Consensus | -0.000011 ETH\* onay başına (-normal bir onay ödülünün değerinin 9/10'u)                      |
| Missed Proposal       | Consensus | 0                                                                                             |
| Missed Sync Committee | Consensus | -0.00047 ETH\* epoch başına (-tüm senkronizasyon komitesi için çevrimdışıysa toplam -0.1 ETH) |
| Slashing              | Consensus | Bakiyenizin en az 1/32'si, aşırı durumlarda tüm bakiyenize kadar                              |

\*_Ağdaki toplam validator sayısına göre değişir.
435.000 aktif validator için yaklaşık._

::: tip İPUCU
Genel bir kural olarak, X saat çevrimdışıysanız (ve bir senkronizasyon komitesinde değilseniz), tekrar çevrimiçi olduktan ve onay verdikten sonra X saat içinde sızan tüm ETH'nizi geri kazanacaksınız.
:::

## Rocket Pool Node'ları Nasıl Çalışır

Yeni bir validator oluşturmak için 32 ETH yatırmak zorunda olan solo staker'ların aksine, Rocket Pool node'ları validator başına sadece 4 ETH ("bonded ETH" olarak adlandırılır) yatırmak zorundadır.
Bu, yeni bir megapool doğrulayıcısı oluşturmak için staking pool'dan 28 ETH ("borrowed ETH" olarak adlandırılır ve liquid staker'ların rETH karşılığında yatırdığı mevduatlardan gelir) ile eşleştirilecektir.

Beacon chain'e göre, bir megapool doğrulayıcısı normal bir validator'la tamamen aynı görünür.
Aynı sorumluluklara, uyması gereken aynı kurallara, aynı ödüllere vb. sahiptir.
Tek fark, megapool doğrulayıcısının execution layer üzerinde nasıl oluşturulduğu ve node operatörü megapool doğrulayıcısından gönüllü olarak çıkmaya karar verdiğinde çekimlerin nasıl çalıştığıdır.
Oluşturma, para çekme ve ödül delegasyonunun tümü Ethereum zincirindeki Rocket Pool'un **akıllı sözleşmeleri** tarafından yönetilir.
Bu onu tamamen merkeziyetsiz yapar.

Bir Rocket Pool **Node**'u, Rocket Pool'un akıllı sözleşmelerine kayıtlı bir Ethereum cüzdanına sahip tek bir bilgisayardır.
Node daha sonra karşılayabildiği kadar megapool doğrulayıcısı oluşturabilir ve hepsi aynı makinede mutlu bir şekilde birlikte çalışabilir.
**Tek bir Rocket Pool node'u birçok, birçok megapool doğrulayıcısı çalıştırabilir.**
Her megapool doğrulayıcısının genel sistem performansı üzerinde ihmal edilebilir bir etkisi vardır; bazı insanlar tek bir node'da yüzlercesini çalıştırabilmiştir.

Bir megapool doğrulayıcısının ön maliyeti 4 ETH'dir. Ayrıca, bir node operator ek ödüller almak ve protokol DAO'su içinde oy gücü kazanmak için isteğe bağlı olarak node'una RPL stake edebilir.

## Rocket Pool Node Operatorleri

**Node operatorleri** Rocket Pool'un kalbi ve ruhudur.
Onlar Rocket Pool node'larını çalıştıran bireylerdir.

### Sorumluluklar

Staking havuzundan ETH'yi onunla megapool doğrulayıcıları çalıştırarak işe koyarlar, bu da Rocket Pool protokolü için staking ödülleri kazanır (ve böylece rETH'nin değerini artırır).
İşleri basittir, ancak son derece önemlidir: _mümkün olan en yüksek kalitede validatorler çalıştırın ve staking ödüllerini maksimize edin_.

Node operatorleri şunlardan sorumludur:

- Bir bilgisayar kurma (fiziksel veya sanal)
- Uygulanabilirse ev ağları dahil olmak üzere doğru şekilde yapılandırma
- Üzerine Rocket Pool yükleme ve doğrulama gerçekleştirmek için validator kurma
- Hem dış hem de iç tehditlerden güvenli hale getirme
- Validatorlerinin ömrü boyunca bakımını yapma

Bu büyük bir sorumluluktur ve basit bir kur-ve-unut türü bir iş değildir; stake ettiği sürece node'unuza bakmanız gerekir.
Ancak büyük sorumlulukla birlikte büyük ödüller gelir.

### Ödüller

Bir Rocket Pool node'u çalıştırmanın başlıca faydaları şunlardır:

- Her validatorün ETH ödüllerinden payınızı ve komisyon kazanırsınız.
  - Yalnızca 4 ETH kendi sermayenizle bir validator çalıştırırsınız; kalan 28 ETH liquid staker'lardan sağlanır.
  - Her megapool doğrulayıcısı, 28 ETH'lik protokol fonundan elde edilen ödüller üzerinden %5 komisyon kazanır. Bu, solo staking'den %35 daha fazlaya denk gelir (`(4 bonded + 28 borrowed * 0.05) / 4 = 1.35`).
  - [Smoothing Pool](fee-distrib-sp#smoothing-pool)'a katılarak, execution katmanı ödüllerini (öncelik ücretleri ve MEV) diğer katılımcılarla paylaşırsınız; bu da blok önerilerinin şansına bağlı kalmak yerine daha tutarlı getiriler sağlar.
- RPL stake etmek size ek ödüller kazandırır.
  - RPL stake edenler, stake ettikleri RPL ile orantılı olarak [protokol komisyonundan bir pay](megapools/staking-and-claiming-rewards#voter-sharein-megapool-rpl-stakerlarına-nasıl-dağıtıldığı) (ETH olarak ödenir) kazanır.
  - Ayrıca stake ettiğiniz RPL üzerinden ihraç ödülleri (RPL olarak ödenir) kazanırsınız.
    - Bir dönemin sonunda (her 28 günde bir), RPL'nizin bir anlık görüntüsü alınır.
    - Toplam ödünç alınan ETH değerinizin **%15'ine kadar** olan RPL üzerinde maksimum getiri elde edebilirsiniz.
    - %15'in ötesindeki RPL üzerinde de azalan bir seviyede getiri elde edersiniz.
  - Stake ettiğiniz RPL'nin karekökü temelinde, bonded ETH'nizin %150'sine kadar oy gücü elde edersiniz.

### Sınırlamalar

Yukarıdaki ödüllerle birlikte gelen bazı sınırlamalar vardır:

- Node'unuz kötü performans gösterirse ve megapool doğrulayıcınızdan çıkmaya karar verene kadar aslında ETH kaybederseniz, kaybedilen tüm ETH payınızdan çıkar.
  - Örneğin: 31 ETH bakiye ile çıkarsanız, megapool doğrulayıcınız ilk 32 ETH mevduatından 1 ETH kaybetmiş demektir. Siz 3 ETH alırsınız ve 28 ETH staking havuzuna geri döner.
- Stake edilmiş RPL'niz daha az likit olacaktır:
  - Megapool'da stake edilmiş RPL'nizin ne kadarını unstake edebileceğinize dair bir sınır yoktur, ancak unstake işlemini başlattıktan sonra çekim için 28 gün beklemeniz gerekir. Bu, kullanıcıların 28 günlük ödül dönemine tam zamanında RPL stake edip dönemin hemen ardından çekerek ödül sistemini istismar etmesini önler.

### Bunu yapabilirsiniz

Komut satırını veya bilgisayar bakımını kullanmaya oldukça yeniyseniz, bu korkutucu bir zorluk gibi görünebilir.
Neyse ki, Rocket Pool'un en temel ilkelerinden biri _merkeziyetsizliktir_ - herhangi birinin, herhangi bir yerde, kararlılığa ve bilgiye sahipse bir node çalıştırabileceği gerçeği.
Kararlılık konusunda yardımcı olamasak da, bilgi konusunda yardımcı _olabiliriz_.
Bu bölüm, harika bir Rocket Pool node'unun nasıl çalıştırılacağını anlamanıza yardımcı olacak kılavuzlar, yönergeler ve bilgilerle doludur.
