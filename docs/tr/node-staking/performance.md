# Düğümünüzün Performansını İzleme

Artık düğümünüz çalışıyor ve bir veya daha fazla minipool eklenmiş durumda, her şeyin sorunsuz çalıştığından emin olmak için her şeyi göz önünde bulundurmanız gerekecek.

Makinenizi şu şekilde izleyebilirsiniz:

1. Makine metriklerinize doğrudan erişerek
2. Üçüncü taraf araçları kullanarak dolaylı olarak

İhtiyaçlarınıza bağlı olarak her ikisinin bir kombinasyonunu kullanmanız önerilir.

## Makinenizin Durumunu Doğrudan İzleme

Makinenizin durumu ile ilgili olarak, göz önünde bulundurmak isteyeceğiniz birkaç yararlı metrik vardır:

- CPU Kullanımı
- Kalan boş RAM
- Swap alanı kullanımı (etkinleştirdiyseniz)
- Kalan boş disk alanı
- Ağ I/O (ISP'niz bir veri sınırı uyguluyorsa)

::: tip NOT
Aşağıdaki bölümler size bazı şeyleri izlemenin yollarını gösterir, ancak makinenizin terminaline giriş yapmanız gerekir.
[Grafana web gösterge paneli](./grafana.mdx) kullanan daha iyi, çok daha kullanışlı ve çok daha güzel görünen bir yöntem var ancak hala geliştirilme aşamasında.
O bölümün tamamlanması için bizi takipte kalın!
:::

### CPU, RAM ve Swap

İlk üç, `htop` programıyla kolayca görüntülenebilir.
Bu, size bir Raspberry Pi'den bu ekran görüntüsüyle gösterildiği gibi sistem kaynaklarınıza güzel bir canlı görünüm verecektir:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

Çubukların olduğu üst ekranda, numaralandırılmış çubukların her biri bir CPU çekirdeğinin mevcut kullanımına atıfta bulunur.

`Mem` size şu anda ne kadar RAM kullandığınızı (bu ekran görüntüsünde 1.75 GB) ve toplamda ne kadarınız olduğunu (3.70 GB) gösterir.

`Swp` size ne kadar swap alanı kullandığınızı (85.8 MB) ve toplamda ne kadarınız olduğunu (12.0 GB) gösterir.

Alt tabloda, her satır bir süreci temsil eder.
Execution ve Consensus istemcileriniz muhtemelen en üstte olacaktır (bu durumda Geth ve Nimbus) ki bunları `Command` etiketli en sağdaki sütunda görebilirsiniz.

`RES` sütunu her sürecin ne kadar RAM aldığını gösterir - bu ekran görüntüsünde Geth 748 MB ve Nimbus 383 MB alıyor.

`CPU%` sütunu her sürecin ne kadar CPU gücü tükettiğini gösterir.
%100 tek bir çekirdeği temsil eder, bu nedenle %100'ün üzerindeyse, birden fazla çekirdekten çok şey kullandığı anlamına gelir (Geth'in burada %213 ile yaptığı gibi).

### Kalan Boş Disk Alanı

Ne kadar boş disk alanınız olduğunu göz önünde bulundurmak aşağıdaki komutla yapmak kolaydır:

```
df -h
```

Bu, aşağıdaki örneğe benzer bir çıktı sağlayacaktır:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Hem İşletim Sisteminizi hem de Execution ve Consensus zincir verilerinizi depolayan bir sürücüye sahip olduğunuz geleneksel kurulumlar için, `Mounted on` sütununda `/` olan girişe bakmanız yeterlidir.
Bu, ana diskinizi temsil eder.
Eğer alan tükeniyormuş gibi görünüyorsa (örneğin, %80 kullanılıyorsa), biraz temizlik yapmayı düşünmeye başlamanız gerekir.
Örneğin, Geth çalıştırıyorsanız, biraz alan açmak için [nasıl budanacağına](./pruning) bakmak isteyebilirsiniz.

Execution ve Consensus zincir verilerini ayrı bir sürücüde depolayan kurulumlar için, `Mounted on` sütununda zincir veri klasörünüzün olduğu satıra da bakmak isteyeceksiniz.
Bu örnekte bir harici SSD'yi `/mnt/rpdata`'ya bağladık, bu yüzden çok büyümediğinden emin olmak için ona da göz kulak olmamız gerekecek.

### Ağ I/O ve Veri Kullanımı

Sisteminizin zamanla ne kadar ağ I/O kullandığını izlemek istiyorsanız, `vnstat` adlı güzel bir yardımcı program yükleyebilirsiniz.
İşte Ubuntu / Debian sistemine kurma örneği:

```shell
sudo apt install vnstat
```

Çalıştırmak için şunu yapın (`eth0`'ın İnternet bağlantınız için kullandığınız ağ arayüzünün adı olduğunu varsayarak):

```
vnstat -i eth0
```

Bu hemen çalışmayacak çünkü sisteminiz hakkında veri toplaması için zamana ihtiyacı var, ancak günler ve haftalar geçtikçe, şu şekilde görünecektir:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

Bu, ISP'niz bir veri sınırı uyguluyorsa yararlı olabilecek toplam ağ kullanımınızı takip etmenizi sağlayacaktır.

Çoğu modern sistemin eth0 yerine eno0 ve enp0s31f6 gibi diğer ağ arayüzlerini daha yaygın olarak kullandığını unutmayın.
Ağ arayüzünüzü kontrol etmeniz gerekiyorsa, aşağıdaki komutu çalıştırın:

```shell
ls /sys/class/net
```

Ethernet (kablolu) cihazlar genellikle yukarıdaki örnekler gibi `e` ile başlar.
Kablosuz cihazlar genellikle `w` ile başlar.

## Smartnode Uyarı Bildirimleri

[Smartnode Stack'inizi Uyarı Bildirimleriyle İzleme](./maintenance/alerting.md), Rocket Pool Smartnode'unuzun sağlığı ve önemli olayları hakkında bildirimler almak için Smartnode uyarı bildirimi işlevselliğini kullanmayı açıklar.

## Üçüncü Taraf Performans İzleme

En iyi izleme bir İsviçre peyniri modeli kullanır: her aracın delikleri vardır, ancak onları üst üste yığarsanız bir şeyin düşme ve sizi şaşırtma şansı daha azdır.

Bu üçüncü taraf araçlarının Rocket Pool topluluğu tarafından kullanıldığını, ancak Rocket Pool ekibi tarafından resmi olarak onaylanmadığını veya desteklenmediğini lütfen unutmayın.
Bir araç öneriniz varsa veya bir araç sahibiyseniz, aracınızla ilgili ayrıntılarla bir pull request eklemekten çekinmeyin.

### Beaconcha.in Web Sitesi: Metrik Kaynağı Olarak Beacon Chain'i Kullanma

[Beaconcha.in](https://beaconcha.in) blok gezgini web sitesi ve uygulaması, zincir üstü faaliyetine bakarak validatörünüzün performansını izlemenin bir yolunu sunar.
Ayrıca, kesinti gibi önemli olaylar için [e-posta bildirimleri](https://beaconcha.in/user/notifications) alma seçeneğine de sahiptirler.
Sitelerine gidin ve ekranın üst kısmındaki arama kutusuna validatörünüzün genel anahtarını girin.

::: tip
Validatörünüzün genel anahtarını unuttuysanız, `rocketpool minipool status` komutuyla kolayca alabilirsiniz.
:::

Her şey doğru ayarlanmışsa, şuna benzer bir şey görmelisiniz:
![](./local/images/pi/Beaconchain.png)

::: tip NOT
Yukarıdaki bağlantı, Beaconcha.in'in **mainnet** sürümü içindir.
Hoodi Testnet'te çalıştırıyorsanız, [bu bağlantıyı kullanın](https://hoodi.beaconcha.in)!
:::

Bu, validatörünüzün tüm Beacon Chain faaliyetinin bir kaydıdır.
Validatörünüzün Beacon Chain'deki bakiyesini kontrol etmek, zamanla büyümesini izlemek ve APY'nizi hesaplamak için kullanabilirsiniz.

Ayrıca, validatörünüzün canlı olup olmadığını ve doğru çalışıp çalışmadığını hızlıca ölçmek için de kullanabilirsiniz.
Öyleyse, tüm doğrulamaların **Status** için `Attested` demesi gerekir ve ideal olarak tüm **Opt. Incl. Dist.**'ler 0 olmalıdır (ara sıra 1 veya 2 iyidir).

Üzerlerinde `Missed` yazan çok sayıda blok varsa, validatörünüz düzgün çalışmıyor demektir.
Docker veya Hibrit mod kullanıyorsanız `rocketpool service logs ...` ile `eth1`, `eth2` ve `validator` servislerinin loglarını kontrol etmelisiniz (veya Native mod kullanıyorsanız karşılık gelen log scriptlerini) sorunları aramak için.

**Bu sekmeyi sabitlemelisiniz veya onunla bir yer imi oluşturmalısınız, böylece hızlıca ona atlayabilir ve validatörünüzün durumunu kontrol edebilirsiniz.**

#### Birden Fazla Minipool'u İzlemek için Beaconcha.in Kullanma

Beaconcha.in'in bir kerede birden fazla validatörü veya minipool'u izlemenize olanak tanıyan bir [gösterge paneli görünümü](https://beaconcha.in/dashboard) vardır.
Validatör indekslerinizi tek tek eklemeniz yeterlidir. Çok fazla minipool'unuz varsa, şunu çalıştırabilirsiniz:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

virgülle ayrılmış bir liste almak ve URL çubuğuna şu şekilde yerleştirin: `https://beaconcha.in/dashboard?validators=123456,123457`

### Beaconcha.in Uygulaması: Validatör Genel Bakışı ve Push Bildirimleri

Beaconcha.in web sitesi, metrikleri görüntülemek ve e-posta uyarıları ayarlamak için harika bir yoldur.
Mobil uygulamaları daha çok "bir bakışta" niteliğindedir.
Ayrıca şunlar gibi bazı yararlı uyarıları içeren bir push bildirimi hizmeti sunar:

1. Kaçırılan doğrulama gibi sorunların bildirimleri
2. Rocket Pool ödül turlarının bildirimleri
3. Düğümünüzdeki RPL'nin fazla/eksik teminatlandırılması

Uygulamanın ücretsiz bir sürümü ve ana ekran widget'ları gibi kolaylık özellikleri olan ücretli seçenekler olduğunu unutmayın.

### Beaconcha.in'de Validatörlerinizi Yeniden Adlandırma

Beaconcha.in web sitesinin, kullanıcıların validatörlerini yeniden adlandırmasına, daha kolay tanımlama/arama yapmasına olanak tanıyan bir özelliği vardır.

Bu özelliği kullanabilmek için, o validatörü kontrol eden kişi olduğunuzu kanıtlamak amacıyla düğüm cüzdanınızın özel anahtarını kullanarak bir mesaj imzalamanız gerekir.

Smartnode v1.5.1, `rocketpool node sign-message` komutunu kullanarak düğüm cüzdanınızın özel anahtarıyla mesaj imzalama yeteneğini içerir, ardından imzalamak istediğiniz mesajı sağlayın.
Validatörlerinizi yeniden adlandırmak için kullanılması için 'beaconcha.in' terimini içermelidir.

![](../node-staking/images/sign-message.png)

Beaconcha.in'deki validatör sayfanızı açın ve `Edit validator name` düğmesine tıklayın.

![](../node-staking/images/edit-validator-name.png)

sign-message komutundan çıkan sonucu kopyalayın ve "Signature" alanına yapıştırın.
İstediğiniz takma adı doldurun ve `Save changes` düğmesine tıklayın.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: Çalışma Süresi için Port Tarama

[Uptimerobot](https://uptimerobot.com/) hizmeti, açık bir port için bir IP adresini tarayan basit bir hizmettir.
Makineniz belirttiğiniz portta kullanılamaz hale gelirse, Uptimerobot size bir sorun olduğuna dair bir bildirim gönderebilir.
Hizmet, e-posta, push bildirimi, SMS, telefon araması ve webhook'lar dahil olmak üzere çok çeşitli bildirim seçeneklerine sahiptir.

Kurulum ekranı şuna benzer görünür:

![](./local/images/uptimerobot.png)

İzlenecek IP, düğümünüzün harici IP'sidir; bunu `ssh` ile düğümünüze giriş yaparak veya fiziksel olarak ve bir tarayıcıda [icanhazip.com](https://icanhazip.com/) açarak veya terminalinizde aşağıdaki komutu çalıştırarak bulabilirsiniz:

```shell
curl icanhazip.com
```

İzlenecek port, düğüm kurulumunuza bağlıdır; tipik Smartnode kurulumunu çalıştıran kullanıcılar muhtemelen Execution ve Consensus istemcileri için sırasıyla 30303 ve 9001 portlarını yönlendirmiştir, bu nedenle bunlar çalışma süresi izleme için iyi seçimlerdir.

### Rocketpool Metrics Dashboards

Düğüm performansınıza ve bir bütün olarak Rocket Pool ağına genel bir bakış sağlamak için birden fazla topluluk liderliğindeki girişim vardır.

### Pushover ile Scriptleme (gelişmiş)

::: tip NOT
[Smartnode Stack'inizi Uyarı Bildirimleriyle İzleme](./maintenance/alerting.md), düğümünüz için güncellemeler mevcut olduğunda bir bildirim içeren Smartnode uyarı bildirimi işlevselliğini kullanmayı açıklar.
:::

[Pushover](https://pushover.net/) hizmeti, kendinize push bildirimleri göndermenize olanak tanır.

::: warning NOT
Bu, üstlenilmesi gereken gelişmiş bir faaliyettir.
Shell scriptleme konusunda bilginiz varsa yararlı olabilir, ancak shell ortamında rahat değilseniz önerilmez.
:::

Pushover'a başlamak için:

1. [pushover.net](https://pushover.net/)'te bir hesap oluşturun
1. [Bir API token oluşturun](https://pushover.net/apps/build)
1. Pushover mobil uygulamasını ve/veya tarayıcı uzantısını yükleyin
1. Önemsediğiniz herhangi bir eylem için Pushover API'sini çağırın

Size bir push bildirimi göndermek için Pushover API'sini çağırmak, şu şekilde yapılandırılmış bir `curl` çağrısıyla yapılır:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Örnek: Güncellemeler Mevcut Olduğunda Push Bildirimi

`unattended-upgrades` ve `update-nofifier` paketlerini kullanarak otomatik güncellemeler ayarladıysanız, düğümünüz için güncellemeler mevcut olduğunda bir push bildirimi almak isteyebilirsiniz.
Bunu yapmanın olası bir yolu, `~/update-notifier.sh` içinde bir script oluşturmak ve `crontab` kullanarak her gün saat 9:00'da tetiklemektir.

Bunu yapmak için, önce şunu çalıştırarak script'i oluşturun:

```shell
nano ~/update-notifier.sh
```

Ardından aşağıdaki script'i yapıştırın:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

Ardından, script'i yürütülebilir olarak işaretlemek için aşağıdaki komutu çalıştırın:

```shell
chmod u+x ~/update-notifier.sh
```

Şimdi crontab'ınızı açmak için aşağıdaki komutu çalıştırın:

```shell
crontab -e
```

Ardından ok tuşlarını kullanarak aşağı kaydırın ve dosyanın şu şekilde görünmesi için `* 9 * * * ~/update-notifier.sh` satırını ekleyin:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

Ardından çıkmak için `control+x` tuşlarına basın ve değişikliklerinizi kaydetmek isteyip istemediğiniz sorulduğunda `Y` tuşuna basın.

Güncellemeleriniz varsa artık yerel saat 09:00'da bir bildirim almalısınız.
Terminalinize şunu yazarak script'i manuel olarak çalıştırabilirsiniz:

```shell
~/update-notifier.sh
```

#### Örnek: APC UPS Daemon'unuz Etkinleştiğinde Bildirim Alın

Bazı ev stake edenleri, güç kesintisi olursa düğümlerinin zarif bir şekilde kapanmasını sağlamak için `apcupsd` yardımcı programıyla Kesintisiz güç kaynağı kullanıyorlar.

`apcupsd` yardımcı programı, mantığını yönetmek için `apccontrol` script'ini kullanır, bu nedenle `/etc/apcupsd/apccontrol` dosyasını düzenleyerek bu daemon'un faaliyetini izlemek mümkündür.
Bunu yapmak için şunu çalıştırın:

```shell
sudo nano /etc/apcupsd/apccontrol
```

Ardından satırın üstüne aşağıdaki kodu ekleyin, böylece dosya şu şekilde görünsün:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

Bu, UPS daemon'unuz her işlem yaptığında, periyodik "kendi kendine test" işlevselliği dahil olmak üzere size bir push bildirimi gönderecektir.
