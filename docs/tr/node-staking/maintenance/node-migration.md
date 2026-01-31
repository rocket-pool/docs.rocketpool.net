# Bir Node'dan Diğerine Geçiş

Bazen, node makineniz artık işini yapamaz hale gelir ve başka bir makineye geçmeniz gerekir.
Bu, örneğin node'unuzu yükseltiyorsanız, bulut tabanlı bir node'dan özel donanımda yerel olarak barındırılan bir makineye geçiyorsanız veya hatta node'unuzun kendisi felaket düzeyinde bir donanım arızasına uğrarsa ve validator'larınızı bir yedek makinede çalıştırmanız gerekirse gerçekleşebilir.
Durum ne olursa olsun, bu rehber cüzdanınızı ve validator anahtarlarınızı bir node'dan diğerine slashing'e maruz kalmadan güvenli bir şekilde nasıl taşıyacağınızı anlamanıza yardımcı olacaktır.

## Slashing ve Slashing Veritabanı

Cüzdanınızı bir makineden diğerine taşırken veya cüzdanınızı başka bir makinede kurtarırken bu kadar dikkatli olmanızı teşvik etmemizin birincil nedeni **slashing** riskidir.
Slashing, bir veya daha fazla validator anahtarınızın Beacon Chain kurallarını ihlal eden ve ağa saldırmaya çalışıyormuşsunuz gibi görünen bir şey yapması durumunda gerçekleşir.
Buna yanıt olarak, zincir validator'ınızı zorla çıkaracak ve ciddi bir ceza uygulayacaktır - cezanın büyüklüğü, sizinkinin iki haftalık süresi içinde kaç validator'ın daha slashing'e uğradığına bağlıdır, ancak şu anda minimum **1 ETH**'dir ve maksimum yoktur.

"Ağa saldırma" olarak yorumlanabilecek birkaç koşul olsa da, gerçekte yanlışlıkla gerçekleşen tek koşul **double attestation** (veya **double proposal**)'dır.
Bu, validator'ınızın aynı slot için farklı oyları olan iki attestation (veya iki blok önerisi) göndermesi durumunda gerçekleşir (örneğin, belirli bir slot için bir tane seçmek yerine iki farklı aday bloka oy verir).

Bununla mücadele etmek için, Validator İstemciniz **Slashing Veritabanı** adında bir şey barındırır.
Slashing Veritabanı, validator'ınızın oylarının basitçe bir kaydıdır (yani, her oyun slot'u ve o oyun verildiği bloğun hash'i), böylece daha önce oy verdiği bir şeye tekrar oy vermemesini sağlar.

### Slashing'den Kaçınma

Her Validator İstemcisi, node'unuzun asla double attestation veya double proposal yapmamasını sağlamak için bir Slashing Veritabanı tutar.
Sorun, **olmadan** doğrulama yapmaya başladığınız durumlardan gelir ve bu nedenle validator'larınızın daha önce neye oy verdiğinin kaydı yoktur.
Bu durum birkaç durumda gerçekleşebilir:

1. Consensus İstemcisini yeni değiştirdiniz ve yeni istemci Slashing Veritabanını eskisinden taşımıyor (Smartnode bir istemci değişikliği sırasında bunu yapmaz).
2. Cüzdanınız bir makinede yüklü ve aktif olarak attestation yapıyorsunuz, ardından cüzdanınızı ikinci bir makineye yüklüyorsunuz _birinci makine hala aktif olarak attestation yaparken_.
3. Bir makinede doğrulamayı durduruyorsunuz ve cüzdanınızı ikinci bir makineye yüklüyorsunuz, ancak mevcut epoch'un finalize olması için yeterince beklemediğiniz için ikinci makineniz validator'larınızın zaten attestation yaptığı slot'lar için attestation yapıyor.

Slashing'den kaçınmanın standart yolu, **son başarılı attestation'ınızdan sonra en az 15 dakika beklemek** ve Validator İstemcinizi başlatıp tekrar attestation yapmadan önce **validator anahtarlarınızın yalnızca tek bir makinede bulunduğundan emin olmaktır**.

Daha spesifik olarak, plan validator'ınızın kasıtlı olarak bir attestation'ı kaçırmasını beklemek ve **bu kaçırmanın finalize edilmesini beklemektir**.
Finality sağlandığında, validator'ınız artık finalize edilmiş epoch için oy veremez ve onunla tekrar attestation yapmaya başlamak güvenlidir.

15 dakikalık bekleme, normal şekilde çalışırken (örneğin normal konsensüsle) Beacon Chain'in bir epoch'u finalize etmesinin yaklaşık 7 dakika sürdüğü temel kuralından gelir.
15 dakika beklemek, en az bir epoch'u kaçırdığınızı ve o epoch'un finalize olması için yeterince beklediğinizi, güvenlik için küçük bir tamponla birlikte garanti eder.

## Node Taşıma Kontrol Listesi

Yukarıdaki bağlamı göz önünde bulundurarak, işte node'unuzu taşırken slashing'e uğramamanızı sağlamak için takip edebileceğiniz yararlı bir kontrol listesi.
Bu, maksimum güvenlik için tasarlanmıştır, bu nedenle bazı adımların gereksiz olduğunu düşünseniz de, hepsini tamamlamanızı **şiddetle** tavsiye ederiz.

1. **Yeni node'u hazırlayın** ve bu rehberleri takip edin, "Bir Node Hazırlama" bölümünden başlayıp Smartnode'u yükleyip Execution ve Consensus istemcisini senkronize etmeye kadar devam edin.
   - :warning: **YENİ bir cüzdan başlatMAYIN** veya eski cüzdanınızı node üzerinde kurtarMAYIN. İstemcilerin _cüzdan olmadan_ senkronize olmasına izin verin.

2. Yeni node'da istemcileriniz tamamen senkronize olana kadar **BEKLEYİN**.
3. Mnemonic'inizi doğru kaydettiğinizi yeni makinenizde `rocketpool wallet test-recovery` komutunu çalıştırarak doğrulayın. Bu, node cüzdanınızın ve tüm minipool'larınızın validator anahtarlarının doğru şekilde kurtarılabileceğini doğrulamak için anahtar kurtarmayı _simüle edecek_, ancak bunları gerçekten kurtarıp diske _kaydetmeyecek_, bu nedenle slashing riski yoktur.
   1. Smartnode, sağladığınız mnemonic'i kullanarak node cüzdanınızı kurtaramazsa, mnemonic'iniz geçersiz olabilir. Bu süreci **DURDURUN**; eski node'unuzdaki anahtarları kaldırmak, onların **sonsuza kadar kaybolması** anlamına gelebilir.
   2. Bu durumda validator'larınızdan çıkmanızı ve sermayenizi mümkün olan en kısa sürede çekmenizi öneririz, böylece çalışan mnemonic'e sahip olduğunuz yeni bir node ile yeniden başlayabilirsiniz.
4. **Eski node'unuzda doğrulamayı durdurun** (örneğin, validator istemcisini kapatmak için `rocketpool service stop` kullanarak).
5. **Eski node'unuzdan anahtarlarınızı silin** (örneğin, `rocketpool wallet purge` kullanarak).
   1. Anahtarların kaldırıldığını node'unuzun `data` klasörüne bakarak **DOĞRULAYIN** (varsayılan `~/.rocketpool/data/validators/`'dır) - her Consensus İstemcisi, o veri klasörü altında anahtarların kendi kopyası ile kendi klasörüne sahip olacaktır.
   2. Lütfen bunu nasıl yapacağınıza dair talimatlar için aşağıdaki [Anahtar Kaldırmayı Doğrulama](#verifying-key-removal) bölümüne bakın.
   3. Ensure **Hepsinin** silindiğinden emin olun.

6. **Eski node'unuzu kapatın** ve Ethernet kablosunu veya Wi-Fi modülünü çıkararak İnternetten bağlantısını kesin.

7. **Eski node'unuzdaki SSD'yi silin**, aşağıdaki yöntemlerden birini kullanarak:
   1. Bir Linux kurulumu olan önyüklenebilir bir USB sürücü kullanın (popüler [GParted](https://gparted.org/download.php) gibi) ve sürücüyü silmek için kullanın.
   2. Eski node'unuzdan **fiziksel olarak çıkarın**, bir USB dönüştürücü kullanarak başka bir makineye takın ve sürücüyü silmek için [GParted](https://installati.one/debian/11/gparted/) gibi bir araç kullanın.
   3. Eski node'unuzdan **fiziksel olarak çıkarın** ve bir çekiçle vurarak kırın ve bir daha asla kullanılmamasını sağlayın.

8. Devam etmeden önce en az 15 dakika **BEKLEYİN**. Validator'ınızın attestation kaydına bakmak için [https://beaconcha.in](https://beaconcha.in) gibi bir blok gezginini kullanın. En az bir attestation'ın eksik olarak kaydedildiğini _ve ilgili epoch'un finalize edildiğini_ bekleyin.
   1. NOT: Birden fazla minipool'unuz varsa, _hepsinin_ en az bir finalize edilmiş attestation'ı kaçırdığından emin olmalısınız.

9. [Mevcut Bir Cüzdanı İçe Aktarma / Kurtarma](../recovering-rp.mdx)'daki talimatları izleyerek yeni makinede **node cüzdanınızı kurtarın**.

10. Validator anahtarlarınızın yüklendiğinden emin olmak için **Validator İstemcinizi yeniden başlatın** (örneğin, `docker restart rocketpool_validator` ile).

Validator anahtarlarınız artık yeni node'unuza yüklenecek ve onunla güvenli bir şekilde attestation yapmaya başlayabilirsiniz.

## Anahtar Kaldırmayı Doğrulama

Validator anahtarları diskinizde `json` dosyaları şeklinde saklanır.
Node'unuzun `data` klasörünün içinde tutulurlar.
Varsayılan olarak, onları burada bulabilirsiniz:

```shell
~/.rocketpool/data/validators/
```

::: warning NOT
`service config` TUI'sini kullanarak `data` dizininizi değiştirdiyseniz (örneğin, bir Aegis anahtarı kullanıyorsunuz ve bunu `data` klasörünüz olarak ayarladınız, yukarıdaki yol `<your data folder>/validators` olarak değiştirilmelidir.)
:::

Her istemci, anahtarların kendi kopyasına sahip olacaktır, çünkü her istemci onları farklı bir formatta veya yapılandırmada bekler.

Diskteki anahtarları **bulmak** için aşağıdaki komutu çalıştırın:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Örneğin, iki minipool'u olan bir makinede, çıktı şöyle görünür:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

Bu, anahtarların henüz **silinmediği** ve hala dosya sisteminde olduğu bir örneği gösterir.

Anahtarlarınız **silinmişse**, bu komutun çıktısında herhangi bir istemcinin klasörlerinde hex dizelerinin (`0x` ile başlayan büyük dizeler) _hiçbirini_ görmemelisiniz.
