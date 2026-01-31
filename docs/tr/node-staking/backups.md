# Node'unuzu Yedekleme

::: tip NOT
Bu şu anda **Docker Mode** kurulumları için yazılmıştır.
Hybrid veya Native kullanıcılar için bazı konumlar farklılık gösterebilir.
:::

Genel olarak, node cüzdanınızı ve minipool'larınızı Smartnode üzerinden oluşturduysanız, node'unuzu tam bir arızadan kurtarmak için gerçekten ihtiyacınız olan tek şey **node cüzdanınızın anımsatıcısıdır**.
Diğer her şey bundan oldukça kolay bir şekilde kurtarılabilir.

Harici olarak oluşturulmuş validator anahtarlarına sahip minipool'larınız varsa (örneğin **Allnodes**'tan kendi barındırdığınız node'a geçiş yaptıysanız), validator'larınız için özel keystore dosyalarına da ihtiyacınız olacaktır çünkü bunlar node cüzdanından kurtarılamaz.

Bununla birlikte, Merge gerçekleştiğinde, Execution layer zincirini yeniden senkronize etmeniz gerektiğinde artık yedek olarak hafif bir Execution client'ı (örneğin Pocket veya Infura) kullanamazsınız.
Ayrıca, doğru şekilde tasdik etmek için aktif ve sağlıklı bir Execution client'ınızın olması gerekecektir.
Bir Execution client arızasından (bozuk veritabanı, SSD arızası veya ele geçirilmiş / çalınmış donanım gibi) kurtulmak için hızlı ve güvenilir bir yola sahip olmak kritik önem taşıyacaktır, çünkü sıfırdan senkronize etmek saatler hatta günler alabilir.

Bu rehberde, node'unuzun dayanıklılığını artırmaya ve gereksiz kesinti süresini en aza indirmeye yardımcı olmak için bunlardan bazılarını nasıl yedekleyeceğinizi göstereceğiz.

::: warning NOT
Bu rehber, Smartnode'u varsayılan dizine (`~/.rocketpool`) kurduğunuzu varsayar.
Farklı bir kurulum dizini belirttiyseniz, aşağıdaki talimatlarda bunu uygun şekilde değiştirin.
:::

## Yedeklenebilecek Öğeler

### Smartnode Yapılandırması

Smartnode yapılandırması `~/.rocketpool/user-settings.yml` içinde saklanır.
Bunu kaydedebilir ve tüm Smartnode ayarlarınızı (yani `rocketpool service config` içinde belirttiğiniz şeyleri) geri yüklemek için değiştirebilirsiniz.

### Execution Client / ETH1 Client Zincir Verisi

Execution client'ın zincir verisi muhtemelen yedeklenecek en önemli şeydir.
Belirtildiği gibi, EC zincir verinizi yeniden senkronize etmek birkaç gün alabilir.
Merge'den sonra, bu saatler ile günler arası kesinti süresi ve kayıp kar anlamına gelir!

Zincir verisi, varsayılan olarak `/var/lib/docker/volumes/rocketpool_eth1clientdata` konumunda bulunan `rocketpool_eth1clientdata` Docker volume'ü içinde saklanır.
Bu klasörün genellikle ayrıcalıksız kullanıcı hesapları tarafından erişilebilir olmadığını unutmayın; görmek için `root` kullanıcısına yükseltmeniz gerekecektir.

::: tip NOT
İlk Smartnode kurulumu sırasında Docker'ın depolama konumunu değiştirdiyseniz (Docker'ı ikinci bir SSD'de çalıştıran kişiler gibi), volume'ü `/<harici bağlama noktanız>/docker/volumes/rocketpool_eth1clientdata` konumunda bulacaksınız.

Hangi kurulum yolunu kullandığınızı hatırlamıyorsanız, konumu için `/etc/docker/daemon.json` kontrol edebilirsiniz.
Dosya mevcut değilse, varsayılan konumu kullanıyorsunuz demektir.
:::

Execution zincir verinizi verimli bir şekilde nasıl yedekleyeceğinize ilişkin ayrıntılı talimatlar için lütfen aşağıdaki [Execution Zincir Verinizi Yedekleme](#execution-zincir-verinizi-yedekleme) bölümüne bakın.

### İzleme ve Metrik Verileri

Bu veri, varsayılan olarak `/var/lib/docker/volumes/rocketpool_grafana-storage` konumunda bulunan `rocketpool_grafana-storage` Docker volume'ü içinde saklanır (veya Docker depolama konumunuzu özelleştirdiyseniz `/<harici bağlama noktanız>/docker/volumes/rocketpool_prometheus-data`).

## Yedeklenmemesi **Gereken** Öğeler

### Özel Anahtarlar ve Parolalar

Node cüzdanınızın özel anahtarı ve onu şifrelemek için kullanılan parola dosyası sırasıyla `~/.rocketpool/data/wallet` ve `~/.rocketpool/data/password` içinde saklanır.
Bu dosyaların genellikle yedeklenmesi gerekmez, çünkü `rocketpool wallet recover` kullanılarak anımsatıcınızdan kurtarılabilirler.

Herhangi bir nedenle, bu dosyaları yedeklemeye _karar verirseniz_, bunları nasıl sakladığınız konusunda **son derece dikkatli** olmanız gerekecektir.
Bu dosyalara erişim sağlayan herkes, node cüzdanınıza, validator'larınıza ve gas gibi şeyler için üzerinde sakladığınız tüm fonlara erişim sağlayacaktır.

Bu dosyaları yedeklemememenizi ve gerekirse sadece cüzdan anımsatıcınızı kullanarak kurtarmanızı **şiddetle tavsiye ederiz**.

### Consensus Client Zincir Verisi

Execution layer verisinin aksine, Consensus layer verisi [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing) sayesinde node'unuz için neredeyse o kadar önemli değildir.
Consensus client'lar, Beacon zincirinin başına hemen yeniden senkronize olmak ve doğrulama görevlerini sürdürmek için bu tekniği kolayca kullanabilir.

## Execution Zincir Verinizi Yedekleme

Smartnode, `rocketpool service export-eth1-data` komutu aracılığıyla Execution zincir verinizi yedekleme yeteneği ile birlikte gelir.
Perde arkasında, bu Linux içindeki güçlü bir yedekleme/kopyalama aracı olan `rsync` kullanır.

`rsync`, kaynak dizindeki (Docker volume'ünüz) ve hedef dizindeki (yedekleme konumunuz) dosyaları karşılaştırır.
Bir kaynak dosya hedef dizinde yoksa, tamamen kopyalanacaktır.
Ancak, _varsa_, `rsync` yalnızca iki dosya arasındaki _değişiklikleri_ kopyalayacaktır.

Bu, ilk yedeklemenin başlangıçta tüm verileri kopyalaması gerektiği için iyi miktarda zaman alacağı anlamına gelir.
Sonraki yedeklemeler yalnızca önceki yedeklemeniz ile şimdi arasındaki değişiklikleri kopyalayacak ve süreci çok daha hızlı hale getirecektir.

Bir yedekleme stratejisinin parçası olarak, `export-eth1-data` komutunu düzenli olarak çalıştırmayı planlayabilirsiniz.
Zincir verisinin bütünlüğünü sağlamak için, bu komutu çalıştırmak **verisini yedeklemeden önce Execution client'ı güvenli bir şekilde kapatacaktır**.
Her hafta zamanlamayı seçerseniz, Execution client'ınız yedeklemeyi güncellerken yalnızca birkaç dakikalığına kapalı olacaktır.
Bu kesinlikle verileri sıfırdan yeniden senkronize etmek için gereken günlerden daha iyidir.

Bir yedeklemeyi tetiklemek için, **veriyi dışa aktarmak istediğiniz depolama ortamını bağlayarak** başlayın.
Örneğin, bu harici bir sabit disk olabilir.

::: tip İPUCU
Linux'ta harici cihazları nasıl bağlayacağınızı bilmiyorsanız, kolaydır!
Cihazı node'unuza takın ve nasıl bağlayacağınızı öğrenmek için [bunun gibi bir rehberi](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/) takip edin.
:::

Bağladıktan sonra, bağlama yolunu not edin.
Bu örnek için, zincir verisini harici cihazın bağlandığı `/mnt/external-drive` adlı bir klasörde saklamak istediğimizi varsayalım.
Bunu aşağıda gördüğünüz her yerde gerçek bağlama yolunuzla değiştirin.

Şimdi, aşağıdaki komutu çalıştırın:

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Bu, hedef klasörünüzün erişilebilir olduğunu ve zincir verisini depolamak için yeterli boş alana sahip olduğunu kontrol edecektir.
Çıktı şöyle görünecektir:

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Gördüğünüz gibi, zincir verisi 100 GB'ın altında olacaktır (Hoodi testnet için; Ethereum mainnet'i bir büyüklük sırası daha büyük olacaktır) ve harici klasörde 287 GiB boş alan vardır, bu nedenle dışa aktarma devam edebilir.

Hazır olduğunuzda, burada `y` girin ve `Enter` tuşuna basın.
Bu, Execution client'ınızı durduracak ve zincir verisini hedef klasörünüze kopyalamaya başlayacaktır.
Çalışırken her bir dosyanın ilerlemesinin ekrandan geçtiğini göreceksiniz.

::: warning NOT
Bu çalışırken terminali _kapatmamanız_ önemlidir.
Bunu yaparsanız, kopyalama arka planda çalışmaya devam edecektir ancak ilerlemesini takip edemeyeceksiniz!
:::

Bittiğinde, Execution client container'ınızı otomatik olarak yeniden başlatacaktır.

**Dışa aktarma tamamlandıktan sonra mevcut zincir verinizin node'unuzdan silinmediğini unutmayın!**

### Execution Zincir Verinizi Geri Yükleme

Yedeklenen zincir verinizi geri yüklemeniz gerekirse, sadece aşağıdaki komutu çalıştırın.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger UYARI
Bu, `rocketpool_eth1clientdata` volume'ünüzdeki mevcut Execution client verisini otomatik olarak silecektir!
:::

Bittiğinde, Execution client'ınız hazır olacaktır.
