# PC, Mini-PC veya NUC Hazırlama

Rocket Pool'u kurmadan önce, sisteminizin uyumlu olduğundan ve doğru çalışacağından emin olmak için yapmanız gereken birkaç kontrol vardır.

::: danger
Rocket Pool node'u çalıştırmak için özel bir makine oluşturmanızı şiddetle tavsiye ediyoruz.
Günlük masaüstü veya oyun bilgisayarı gibi genel kullanımlı bir makinede node çalıştırmak, cüzdanınızı tehlikeye atabilecek ve coin'lerinizin çalınmasına neden olabilecek ekstra güvenlik riskleri sunar.

**Maksimum güvenlik için, lütfen yalnızca node çalıştırmaya ayrılmış yeni bir makine kurun.**
:::

## Sistem Gereksinimleri

Aşağıda bir Rocket Pool node'unun gerektirdiği yazılım ve donanım gereksinimlerinin kısa bir açıklaması bulunmaktadır.
Bu kılavuz, makinenizi fiziksel olarak kurduğunuzu ve işletim sistemini kurduğunuzu varsayar.

### Desteklenen İşletim Sistemleri

Rocket Pool'un Smartnode istemcisi şu anda **Linux** ve **macOS** sistemlerini desteklemektedir.

Şu anda, **Windows** uzak bir Linux veya Mac makinesini yönetmek için kullanılabilir, ancak Smartnode'un kendisi şu anda Windows sisteminde çalışamamaktadır. Ancak, Rocket Pool bir Windows makinesi tarafından barındırılan Linux [sanal makinesinde](https://en.wikipedia.org/wiki/System_virtual_machine) çalıştırılabilir.
Bu kurulum, Linux'u ana işletim sistemi olarak kurmak yerine tercih edilmez, ancak gerekirse çalışır.
Ekstra kaynak yükü gerektireceğini ve kendi güvenlik risklerini getireceğini unutmayın, bu nedenle ana ağda gerçek Ether stake ederken bu kurulumu kullanmanızı tavsiye etmiyoruz.

Rocket Pool, **AMD64 (x64)** ve **arm64 (aarch64)** CPU mimarileri ile yerel olarak uyumludur.
Diğer mimariler için smartnode istemcilerini kaynaktan derlemeniz gerekecektir.

Kullanıcının Smartnode'u kurmak için **root / Yönetici** erişimine (veya **sudo** ayrıcalıklarına) sahip olması gerektiğini unutmayın.

#### Linux Desteği

Linux işletim sisteminin birçok varyantı vardır (kısaca dağıtımlar veya **distro'lar** olarak adlandırılır). Rocket Pool'u herhangi bir modern dağıtımdan çalıştırabilirsiniz, ancak Rocket Pool'un yükleyicisi tüm yığını [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/) ve [Fedora](https://docs.fedoraproject.org/en-US/project/)'ya otomatik olarak kurabilir.

::: warning NOT
Ubuntu kullanmayı planlıyorsanız, 24.04 gibi bir **LTS** sürümü kullanmanızı şiddetle tavsiye ediyoruz.
Bu sürümler daha uzun süreler boyunca aktif olarak bakımı yapılır, bu da node'unuzun güvenliğine ve kararlılığına yardımcı olur.
:::

Diğer dağıtımlara kurulum için, Smartnode yükleyicisi bazı sistem bağımlılıklarını (örneğin `docker-compose`) otomatik olarak kuramayacaktır.
Kurulum sırasında bazı manuel adımlar gerekecektir.

`arm64` sistemleri için, Smartnode yükleyicisi yalnızca Debian ve Ubuntu gibi Debian tabanlı dağıtımları yerel olarak destekler.
Diğer dağıtımlar için kurulum sırasında manuel adımlar gerekecektir.

## İşletim Sistemini Kurma

macOS kullanıyorsanız, büyük olasılıkla zaten İşletim Sistemi yüklenmiştir ve bu adımı atlayabilirsiniz.

Linux'u sıfırdan kuruyorsanız, yukarıda listelenen dağıtımların her biri, İşletim Sistemini sıfırdan kurmak için yardımcı ve ayrıntılı eğitimlerle birlikte gelir.
Örnek olarak, **Debian Server**'ı kurma ve hazırlama sürecinde size yol göstereceğiz.
Debian, node işletimi için iyi bir seçimdir çünkü **maksimum istikrar ve güvenilirlik** üzerine odaklanır - bunların her ikisi de 7/24 çalışması gereken node makineleri için oldukça arzu edilir.

[İşte, node makinenize sıfırdan Debian kurmanın nasıl yapılacağını gösteren ekran görüntüleriyle iyi bir adım adım kılavuz](https://itslinuxfoss.com/debian-11-bullseye-guide/).

:::tip
Yukarıda bağlantılı kılavuza takip etmek isteyebileceğiniz birkaç yararlı değişikliğimiz var:

- **Root parolası** ayarlamanız istendiğinde, **boş bırakmanızı** öneririz. Bu, `root` hesabını devre dışı bırakacak ve bunun yerine `sudo` paketini kuracaktır, böylece kullanıcınız parolasını yeniden girerek yetkilerini yükselterek root işlemleri gerçekleştirebilir. Bu, Ubuntu Linux'un kurulma şekline benzer ve kullanıcılara daha tanıdık gelebilir.
- Sonlara doğru **Yazılım seçimi** ekranında, masaüstü GUI'nin yüklenmesini istemeyebilirsiniz.
  - Masaüstü GUI'ler bir node için büyük ölçüde gereksizdir; ekstra yük eklerler ve çoğu zaman kullanılmazlar çünkü yine de terminal üzerinden uzaktan kontrol edeceksiniz, bu yüzden burada **GNOME ve Debian masaüstü ortamını işaretini kaldırmayı** tercih ediyoruz.
  - Node'unuzda bir masaüstü UI istiyorsanız, **GNOME'un işaretini kaldırıp bunun yerine XFCE'yi işaretlemenizi** öneririz, çünkü sistem kaynakları üzerinde daha hafiftir. Ayrıca node üzerinde tarayıcılar veya Discord gibi ek yazılımlar çalıştırmamanızı öneririz, çünkü bunlar güvenliği azaltır ve sistem kaynaklarını tüketir.
  - **Web sunucusunun** işaretini kaldırın, ancak **SSH sunucusu** ve **standart sistem yardımcı programları**'nın işaretli kalmasına izin verin.
- Bir iso'dan flash sürücü oluşturduysanız, `apt` çalıştırmak için CD-ROM deposunu devre dışı bırakmanız gerekebilir.
  Bunun nasıl yapılacağına dair bir açıklama [burada](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/) bulabilirsiniz.
- Sisteminiz varsayılan olarak uyku/hazırda bekleme moduna geçecek şekilde ayarlanmış olabilir. Bu ayarları devre dışı bırakmak için şu komutu çalıştırabilirsiniz:
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### `sudo` Kurulumu

Rocket Pool'un yükleyicisi tüm bağımlılıklarını edinmek için `sudo` programını gerektirir.
Önceki adımda **root kullanıcı parolasını boş bıraktıysanız**, zaten buna sahip olacaksınız.
Değilse, lütfen şimdi aşağıdaki komutları çalıştırarak kurun:

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Ardından makineyi yeniden başlatın.
Artık `sudo apt update` gibi komutları `sudo` aracılığıyla çalıştırabilmelisiniz.

### SSH Kullanımı

Sunucu kurulduktan ve giriş yapabildiğinizden sonra, IP adresini almanız gerekir.
Bunu yapmanın kolay bir yolu, 'net-tools' paketine yerleşik olan `ifconfig` ile yapmaktır:

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Burada birkaç giriş görebilirsiniz, ancak aradığınız şuna benzer bir şey olacaktır:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

Bayraklar `UP,BROADCAST,RUNNING,MULTICAST` yazmalıdır.
`inet` değeri (burada `192.168.1.8`) makinenizin yerel IP adresidir.

Ardından, SSH'yi kurun:

```shell
sudo apt install openssh-server
```

:::tip NOT
Debian kurulumu sırasında **SSH sunucusu** kutusunu işaretlediyseniz, bunu zaten kurmuş olmalısınız, bu nedenle bu komut hiçbir şey yapmayacaktır.
:::

Bu tamamlandığında, `ssh` kullanarak dizüstü veya masaüstü bilgisayarınızdan makinenin terminaline uzaktan giriş yapabilirsiniz.

`ssh`'ye aşina değilseniz, [Güvenli Kabuk'a Giriş](../ssh) kılavuzuna bir göz atın.

:::warning NOT
Bu noktada, node'unuzun IP adresini **statik** yapmak için yönlendiricinizi yapılandırmayı _şiddetle düşünmelisiniz_.
Bu, node'unuzun sonsuza kadar aynı IP adresine sahip olacağı anlamına gelir, böylece her zaman o IP adresini kullanarak SSH yapabilirsiniz.
Aksi takdirde, node'unuzun IP'sinin bir noktada değişmesi mümkündür ve yukarıdaki SSH komutu artık çalışmayacaktır.
Node'unuzun yeni IP adresini öğrenmek için yönlendiricinizin yapılandırmasına girmeniz gerekecektir.

Her yönlendirici farklıdır, bu nedenle statik bir IP adresi atamayı öğrenmek için yönlendiricinizin belgelerine başvurmanız gerekecektir.
:::

## Swap Alanı Ayarlama

Çoğu durumda, Execution ve Consensus istemcilerinizi ve örnek türünüzü dikkatlice seçerseniz, RAM'iniz bitmemelidir.
Yine de, biraz daha eklemek asla zarar vermez.
Şimdi yapacağımız şey, **swap alanı** denen şeyi eklemektir.
Esasen, bir şeyler kötü bir şekilde ters giderse ve sunucunuzun normal RAM'i biterse, SSD'yi "yedek RAM" olarak kullanacağız demektir.
SSD normal RAM kadar hızlı değildir, bu nedenle swap alanına ulaşırsa işleri yavaşlatır, ancak tamamen çökmez ve her şeyi bozmaz.
Bunu (büyük olasılıkla) asla ihtiyaç duymayacağınız ekstra sigorta olarak düşünün.

### Swap Dosyası Oluşturma

İlk adım, swap alanınız olarak işlev görecek yeni bir dosya oluşturmaktır.
Ne kadar kullanmak istediğinize karar verin - makul bir başlangıç 8 GB olacaktır, böylece toplam 16 GB için 8 GB normal RAM ve 8 GB "yedek RAM"e sahip olursunuz.
Süper güvenli olmak için, sisteminizin toplam 32 GB için 8 GB normal RAM ve 24 GB "yedek RAM"e sahip olması için 24 GB yapabilirsiniz, ancak bu muhtemelen aşırıdır.
Neyse ki, SSD'nizde 1 veya 2 TB alan olduğundan, bir swapfile için 8 ila 24 GB ayırmak önemsizdir.

Bu adım adım anlatım için, güzel bir orta yol seçelim - diyelim ki toplam 24 GB RAM için 16 GB swap alanı.
İlerledikçe istediğiniz sayıyı değiştirin.

Bunu girin, bu `/swapfile` adlı yeni bir dosya oluşturacak ve 16 GB sıfırla dolduracaktır.
Miktarı değiştirmek için, `count=16` içindeki sayıyı istediğinizle değiştirin. **Bunun uzun zaman alacağını unutmayın, ama sorun değil.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

Ardından, izinleri yalnızca root kullanıcısının okuyabilmesi veya yazabilmesi için ayarlayın (güvenlik için):

```shell
sudo chmod 600 /swapfile
```

Şimdi, swap dosyası olarak işaretleyin:

```shell
sudo mkswap /swapfile
```

Ardından, etkinleştirin:

```shell
sudo swapon /swapfile
```

Son olarak, sunucunuz yeniden başlatıldığında otomatik olarak yüklenmesi için mount tablosuna ekleyin:

```shell
sudo nano /etc/fstab
```

Sona şuna benzeyen yeni bir satır ekleyin:

```
/swapfile                            none            swap    sw              0       0
```

Kaydetmek için `Ctrl+O` ve `Enter`, ardından çıkmak için `Ctrl+X` ve `Enter` tuşlarına basın.

Aktif olduğunu doğrulamak için bu komutları çalıştırın:

```shell
sudo apt install htop
htop
```

Çıktınız üstte şuna benzer görünmelidir:
![](../local/images/pi/Swap.png)

`Swp` etiketli son satırdaki ikinci sayı (`/`'den sonraki) sıfır değilse, her şey yolundadır.
Örneğin, `0K / 16.0G` gösteriyorsa swap alanınız başarıyla etkinleştirilmiştir.
`0K / 0K` gösteriyorsa çalışmamıştır ve önceki adımları doğru girdiğinizi onaylamanız gerekecektir.

`htop`'tan çıkmak ve terminale geri dönmek için `q` veya `F10` tuşuna basın.

### Swappiness ve Cache Pressure Yapılandırması

Varsayılan olarak, Linux sistem RAM'inin üzerindeki baskının bir kısmını almak için çok sayıda swap alanını istekli bir şekilde kullanacaktır.
Bunu istemiyoruz. SWAP'a güvenmeden önce RAM'in son saniyesine kadar tümünü kullanmasını istiyoruz.
Bir sonraki adım, sistemin "swappiness"ini değiştirmektir, bu temelde swap alanını kullanma konusunda ne kadar istekli olduğudur.
Bunu hangi değere ayarlayacağınız konusunda çok tartışma var, ancak 6 değerinin yeterince iyi çalıştığını bulduk.

Ayrıca "cache pressure"'ı düşürmek istiyoruz, bu sunucunun dosya sisteminin önbelleğini ne kadar hızlı sileceğini belirler.
Kurulumumuzla çok fazla yedek RAM'imiz olacağından, bunu "10" yapabiliriz, bu da önbelleği bir süre bellekte bırakacak ve disk I/O'sunu azaltacaktır.

Bunları ayarlamak için bu komutları çalıştırın:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Şimdi, bunları `sysctl.conf` dosyasına koyun, böylece yeniden başlatmadan sonra yeniden uygulanırlar:

```shell
sudo nano /etc/sysctl.conf
```

Sona bu iki satırı ekleyin:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Ardından daha önce yaptığınız gibi kaydedin ve çıkın (`Ctrl+O`, `Ctrl+X`).

### Kurulum Öncesi Sistem Kontrolleri

Rocket Pool'u kurmadan önce, lütfen aşağıdaki kontrol listesini gözden geçirin:

- Sisteminiz tamamen kurulmuştur, açılır ve işletim sistemine başlatılabilir.
- Sistem üzerinde İnternet'te gezinme, e-posta kontrol etme veya oyun oynama gibi başka hiçbir etkinlik yapmayacaksınız.
- Bir Linux işletim sistemi yüklüdür.
- Kullanıcı hesabınızın root / yönetici ayrıcalıkları vardır.
- Performans gereksinimlerini karşılayan bir SSD'niz var.
- SSD'niz dosya sisteminize mount edilmiştir.
- İlk Execution ve Consensus senkronizasyon işlemi için en az 1.5 TB boş disk alanınız var.
- ISS'nizin verilerinizi sınırlandırması durumunda, ayda 2 TB'den fazladır.

Tüm bu öğeleri kontrol edip onayladıysanız, Rocket Pool'u kurmaya ve bir node çalıştırmaya başlamaya hazırsınız!
[ETH İstemcilerinizi Seçme](../eth-clients) bölümüne geçin.
