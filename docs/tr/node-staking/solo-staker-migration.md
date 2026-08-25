# Solo Staking'den Rocket Pool'a Geçiş

::: danger SOLO DOĞRULAYICI DÖNÜŞÜMÜ ARTIK MÜMKÜN DEĞİL
[Saturn 1 yükseltmesi](/tr/upgrades/saturn-1/whats-new), mevcut bir solo doğrulayıcıyı doğrudan bir Rocket Pool doğrulayıcısına dönüştürme özelliğini kaldırdı.
Minipoollar - solo doğrulayıcı dönüşümünü mümkün kılan "vacant (boş)" minipoollar dahil - artık oluşturulamıyor ve megapool doğrulayıcıları yalnızca yeni bir Beacon Chain depozitosuyla oluşturulabiliyor.

Stake'inizi solo staking'den Rocket Pool'a taşımak için artık **solo doğrulayıcınızdan çıkış yapmanız** ve **bir megapool altında yeni doğrulayıcılar oluşturmanız** gerekiyor.
Bu sayfa nelerin değiştiğini açıklıyor ve yeni süreçte size yol gösteriyor.
:::

## Saturn 1 ile Neler Değişti

Saturn 1'den önce, bir solo staker aktif bir doğrulayıcıyı Beacon Chain'den çıkarmadan bir Rocket Pool minipooluna dönüştürebiliyordu.
Süreç; özel bir "vacant" minipool oluşturmayı, doğrulayıcının çekim kimlik bilgilerini orijinal `0x00` BLS kimlik bilgilerinden minipoolun adresine değiştirmeyi, Oracle DAO'nun scrub kontrolünden geçmeyi ve son olarak minipoolu terfi ettirmeyi (promote) içeriyordu.

Saturn 1 yükseltmesi, yeni doğrulayıcı oluşturma yöntemi olarak minipoolları [megapoollarla](/tr/node-staking/megapools/overview) değiştirdi ve solo doğrulayıcı dönüşümü bu yeni sisteme taşınmadı:

- **Minipool oluşturma protokol düzeyinde devre dışı bırakıldı** ve buna vacant minipoollar da dahil. Mevcut bir doğrulayıcının çekim kimlik bilgilerini yönlendirebileceğiniz bir minipool sözleşmesi artık yok.
- **Megapool doğrulayıcıları, Rocket Pool deposit kuyruğu üzerinden** yeni bir Beacon Chain depozitosuyla oluşturulur: önce 1 ETH'lik bir prestake yapılır, ardından protokol doğrulayıcının çekim kimlik bilgilerini zincir üzerinde doğruladıktan sonra kalan 31 ETH yatırılır.
  Halihazırda aktif olan bir doğrulayıcı bu akıştan geçemez; dolayısıyla mevcut bir solo doğrulayıcıyı bir megapoola dahil edecek bir mekanizma bulunmuyor.
- Dönüşüm için kullanılan Smartnode komutları (`rocketpool node create-vacant-minipool` ve `rocketpool minipool promote` gibi) CLI'dan kaldırıldı.

Kısacası: bugün solo staking'den geçiş yapmanın tek yolu, **doğrulayıcınızı Beacon Chain'den çıkarmak ve çekilen ETH ile yeni megapool doğrulayıcıları oluşturmaktır**.

## Neden Geçiş Yapmalıyım?

Geçiş herkes için uygun olmayabilir, ancak Rocket Pool megapool doğrulayıcıları geleneksel solo staking doğrulayıcılarına göre çeşitli avantajlara sahiptir:

- Pool stakerlarından ödünç aldıkları ETH kısmı üzerinden (doğrulayıcı başına 28 ETH) **komisyon kazanırlar**.
- Mevcut 32 ETH'lik stake'iniz, en fazla **sekiz megapool doğrulayıcısı** oluşturmak için kullanılabilir (mevcut bond her biri 4 ETH) ve 224 ETH'ye kadar ödünç alınan ETH üzerinden komisyon kazanabilirsiniz.
- Tüm Execution katmanı ödüllerini (örneğin blok önerileri ve [MEV ödülleri](/tr/node-staking/mev)) bir havuzda toplayan ve her ödül aralığında katılımcılar arasında adil şekilde dağıtan [Smoothing Pool](/tr/node-staking/fee-distrib-sp#the-smoothing-pool)'a katılmaya uygundurlar.
- Megapoolunuzda RPL stake ederseniz, RPL enflasyon ödüllerine ek olarak [voter share ödülleri](/tr/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (protokol ETH gelirinin bir payı) kazanır ve [pDAO yönetişiminde](/tr/pdao/overview) oy hakkı elde edersiniz. RPL stake etmek tamamen isteğe bağlıdır.

Bununla birlikte, vurgulanması gereken bazı önemli farklar da var:

- Protokol bir dizi akıllı sözleşme olarak uygulandığından **akıllı sözleşme riskini** kabul etmeniz gerekir.
- Geleneksel düğüm operatörlüğü **Smartnode yazılım yığınını** kullanır; bu yazılımı düğümünüze kurup çalıştırmanın getirdiği riskleri kabul etmeniz gerekir.
- Düğüm operatörü olmak bazı yeni kavramlar öğrenmeyi gerektirir, dolayısıyla bir **öğrenme eğrisi** vardır.
- Megapool doğrulayıcıları ödüllerini pool stakerlarıyla paylaşır; bu nedenle doğrulayıcılarınızın çekim adresi, Execution katmanındaki megapool sözleşmeniz olacaktır - **sizin kontrol ettiğiniz bir EOA değil**. Bu, Execution katmanı ödülleri için **fee recipient** adresiniz için de geçerlidir.
- **Sermayeniz geçiş sürecindeyken hiçbir şey kazanmaz.** Solo doğrulayıcınızın çıkışı ile megapool doğrulayıcılarınızın aktifleşmesi arasında hiçbir ödül kazanmazsınız. Yeni megapool doğrulayıcılarının attestation görevlerine başlamadan önce hem Rocket Pool deposit kuyruğundan _hem de_ Beacon Chain kuyruğundan geçmesi gerekir; bu yüzden herhangi bir çıkış yapmadan önce aşağıdaki **Zamanlama konuları** bölümünü okuyun.

Geçişe karar vermeden önce bu artıları ve eksileri dikkatlice değerlendirmenizi öneririz.
Sürece devam etmek istiyorsanız, adımlar aşağıda açıklanmıştır.

## Adım 1: Solo Doğrulayıcınızdan Çıkış Yapın

İlk adım, solo doğrulayıcınızı Beacon Chain'den çıkarmak ve bakiyesini çekmektir:

1. Doğrulayıcınız hâlâ `0x00` BLS çekim kimlik bilgilerine sahipse, önce bunları kontrol ettiğiniz bir adresi gösteren [Execution katmanı çekim kimlik bilgilerine güncellemeniz](https://launchpad.ethereum.org/en/withdrawals) gerekir. Bunu yapmazsanız, çıkıştan sonra ETH'niz çekilemez.
1. Doğrulayıcı için bir **gönüllü çıkış (voluntary exit)** gönderin. Bunu Consensus / Validator clientınızla yapabilirsiniz; ayrıntılar için clientınızın belgelerine bakın.
1. Doğrulayıcının Beacon Chain çıkış kuyruğundan geçmesini ve tüm bakiyesinin çekim adresinize aktarılmasını bekleyin.

::: warning UYARI
Gönüllü çıkış **geri alınamaz**. Doğrulayıcınız bir kez çıkış yaptığında bir daha asla doğrulama yapamaz - geri dönüşün tek yolu yeni bir doğrulayıcı oluşturmaktır.
Çıkış yapmadan önce bu sayfanın tamamını (özellikle **Zamanlama konuları** bölümünü) okuduğunuzdan emin olun.
:::

[validatorqueue.com](https://www.validatorqueue.com/), Beacon Chain çıkış kuyruğunun güncel uzunluğunu kontrol etmek için faydalı bir sitedir.

## Adım 2: Bir Rocket Pool Düğümü Kurun

Çıkışınızın işlenmesini beklerken Rocket Pool düğümünüzü hazırlayabilirsiniz.

Rocket Pool düğüm operatörlüğünde yeniyseniz, donanım seçiminden [Smartnode yığınının kurulumuna](/tr/node-staking/installing/overview) ve [düğümünüzün kaydına](/tr/node-staking/prepare-node) kadar her şeyi kapsayan [Düğüm Operatörü kılavuzuyla](/tr/node-staking/responsibilities) başlayın.
Kendi doğrulayıcınızı çalıştırdığınız için bunların çoğu size tanıdık gelecektir - ayrıca kendi Execution ve Consensus clientlarınızı zaten çalıştırıyorsanız, [harici clientlarla hibrit yapılandırma](/tr/node-staking/install-modes#the-hybrid-configuration-with-external-clients) ilginizi çekebilir.

## Adım 3: Megapool Doğrulayıcılarınızı Oluşturun

Çekilen ETH elinize ulaştığında, `rocketpool megapool deposit` komutunu kullanarak megapool doğrulayıcıları oluşturmaya hazırsınız.
Şu anda her doğrulayıcı **4 ETH bond** gerektirir ve staking havuzundan **28 ETH** ödünç alır; dolayısıyla çektiğiniz 32 ETH'lik stake, en fazla **sekiz megapool doğrulayıcısını** finanse edebilir.
Megapool sözleşmeniz ilk doğrulayıcı depozitonuzla birlikte otomatik olarak dağıtılır ve sonrasında oluşturduğunuz her doğrulayıcı aynı megapool tarafından yönetilir.

[Megapool (Doğrulayıcı) Oluşturma](/tr/node-staking/megapools/create-megapool-validator) kılavuzu, deposit kuyruğunun nasıl çalıştığı ve başarılı bir stake'in nasıl doğrulanacağı dahil olmak üzere tüm süreci adım adım anlatır.

::: tip NOT
Eski dönüşüm sürecinin aksine, yeni doğrulayıcılarınız Smartnode cüzdanınızdan üretilen **yeni doğrulayıcı anahtarları** kullanacaktır.
Eski solo doğrulayıcı anahtarlarınız yeniden kullanılmaz ve Smartnode'un Validator Client'ı yeni anahtarları sizin için yönetir - artık bir anahtar içe aktarma adımı yoktur.
:::

## Zamanlama konuları

Eski dönüşüm sürecinde kesinti yoktu: doğrulayıcınız süreç boyunca attestation görevlerine devam ediyordu.
Yeni geçiş yolu ise kesinti içerir; bu yüzden solo doğrulayıcınızdan çıkmadan önce ilgili kuyrukları anlamakta fayda var:

1. **Beacon Chain çıkış kuyruğu**: solo doğrulayıcınızın ne kadar hızlı çıkış yapıp çekilebileceğini belirler.
1. **Rocket Pool deposit kuyruğu**: yeni doğrulayıcılarınızın deposit havuzundan ödünç alınan ETH ile ne zaman eşleştirileceğini belirler. Express kuyruk biletleri, eski minipoollarda bond edilmiş ETH'ye göre mevcut düğüm operatörlerine dağıtıldı; yeni düğümler şu anda bilet almadığından, eski bir solo staker'ın doğrulayıcıları **standart kuyruğa** girecektir.
1. **Beacon Chain deposit kuyruğu**: megapool doğrulayıcıları bu kuyruktan **iki kez** geçer: bir kez 1 ETH'lik prestake için, ikinci kez de protokol doğrulayıcının çekim kimlik bilgilerini doğruladıktan sonra kalan 31 ETH'lik stake için.

Solo doğrulayıcınız çıkış yaptığı andan megapool doğrulayıcılarınız aktifleşene kadar ödül kazanmazsınız; bu yüzden karar vermeden önce kuyrukları kontrol edin.

::: tip Faydalı Bağlantılar
[validatorqueue.com](https://www.validatorqueue.com/), Beacon Chain kuyruğunun uzunluğunu kontrol etmek için faydalı bir sitedir. Bu kuyruk, Beacon Chain'e giren ve çıkan ETH miktarına bağlıdır.
:::

Deposit kuyruğu beklediğinizden uzun çıkarsa, doğrulayıcınıza ETH atanmadan önce istediğiniz zaman [doğrulayıcıyı Rocket Pool deposit kuyruğundan çıkarabilir](/tr/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) ve bond'unuzu rETH ile takas edilebilir [deposit kredisi](/tr/node-staking/megapools/credit) olarak geri alabilirsiniz.

## Alternatif: Düğüm Çalıştırmadan Staking

Artıları ve eksileri değerlendirdikten sonra düğüm çalıştırmamayı tercih ederseniz, çektiğiniz ETH'yi Rocket Pool'un likit staking tokenı olan [rETH](/tr/liquid-staking/overview) ile stake edebilir ve donanım, bakım veya kuyruk olmadan staking ödülleri kazanabilirsiniz.
