# Raspberry Pi Hazırlama

::: warning NOT
Bu sayfa arşiv amaçlı burada bırakılmıştır. Bir Ethereum doğrulayıcısı çalıştırmanın artan donanım ve performans gereksinimleri nedeniyle artık Raspberry Pi'da Rocket Pool çalıştırılmasını önermiyoruz.
:::

Bu kılavuz, Raspberry Pi kullanarak bir Rocket Pool node'u çalıştırmanız konusunda size yol gösterecektir.
Çoğu stake etme kılavuzunda bu genellikle önerilmese de, bunun cazip olduğunu biliyoruz çünkü tam bir PC kurmaktan çok daha uygun fiyatlı bir seçenek.
Bu amaçla, bir dizi ayarı ayarlamak ve optimize etmek için çok çalıştık ve iyi çalışıyor gibi görünen bir yapılandırma belirledik.

Bu kurulum Pi'de **tam bir Execution node'u** ve **tam bir Consensus node'u** çalıştıracak ve sisteminizin bir Rocket Pool node operatörü olarak hareket ederken aynı anda Ethereum ağının sağlığına katkıda bulunmasını sağlayacaktır.

## Ön Hazırlık

Raspberry Pi'de bir Rocket Pool node'u çalıştırmak için önce çalışan bir Raspberry Pi'ye sahip olmanız gerekir.
Zaten çalışan bir tane varsa - harika! [SSD'yi Bağlama](#mounting-the-ssd) bölümüne atlayabilirsiniz.
Devam etmeden önce **bir fan takılı** olduğundan emin olun.
Sıfırdan başlıyorsanız, okumaya devam edin.

### İhtiyacınız Olanlar

Rocket Pool'u bir Pi'de çalıştırmak için satın almanız gereken önerilen bileşenler şunlardır:

- **Raspberry Pi 4 Model B**, **8 GB model**
  - Not: Bu kurulumla 4 GB _kullanabilirsiniz_, ancak içiniz rahat olsun diye 8 GB ile gitmenizi şiddetle öneririz... gerçekten çok daha pahalı değil.
- Pi için **USB-C güç kaynağı**. **En az 3 amper** sağlayan bir tane istiyorsunuz.
- Bir **MicroSD kart**. Büyük olması gerekmiyor, 16 GB yeterli ve şimdi oldukça ucuzlar... ama en az **Sınıf 10 (U1)** olmalıdır.
- PC'niz için **MicroSD'den USB'ye** adaptör. Bu, Kart'a İşletim Sistemini yüklemek ve Pi'ye yüklemeden önce PC'nizde gereklidir.
  PC'nizde zaten bir SD portu varsa, yeni bir tane almanıza gerek yoktur.
- Bazı **soğutucular**. Pi'yi 7/24 ağır yük altında çalıştıracaksınız ve ısınacak.
  Soğutucular yardımcı olacak böylece kendini kısıtlamayacak. İdeal olarak 3'lük bir set istiyorsunuz: biri CPU için, biri RAM için ve biri USB kontrolörü için.
  [İşte güzel bir setin iyi bir örneği](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Bir **kasa**. Burada iki yol var: fanlı ve fansız.
  - Fanlı:
    - 40mm **fan**. Yukarıdakiyle aynı, amaç Rocket Pool node'unuzu çalıştırırken işleri serin tutmaktır.
    - Her şeyi bir araya getirmek için **fan montajlı bir kasa**.
      Ayrıca [bunun gibi](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) entegre fanlı bir kasa da alabilirsiniz, böylece fanları ayrı satın almanız gerekmez.
  - Fansız:
    - [Bunun gibi](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX) dev bir soğutucu gibi davranan **fansız bir kasa**.
      Sessiz olduğu için bu güzel bir seçenek, ancak Pi'niz **oldukça** ısınacaktır - özellikle ilk blockchain senkronizasyon süreci sırasında.
      Bizi bu yöne yönlendiren Discord kullanıcısı Ken'e teşekkürler!
  - Genel bir kural olarak, Pi'yi önemli ölçüde hız aşırtacağımız için **fanlı** gitmenizi öneririz.

Kolaylık sağlamak için bunların çoğunu bir arada alabilirsiniz - örneğin, [Canakit bir kit sunar](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) içinde birçok bileşen bulunur.
Ancak, parçaları ayrı olarak alırsanız hepsini daha ucuza alabilirsiniz (ve ekipmanınız varsa, [kendi Pi kasanızı 3D yazdırabilirsiniz](https://www.thingiverse.com/thing:3793664).)

İhtiyacınız olan diğer bileşenler:

- Bir **USB 3.0+ Katı Hal Sürücüsü**. Genel öneri **2 TB sürücü** içindir.
  - [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) iyi çalıştığı bilinen mükemmel bir örnektir.
  - :warning: SATA-USB adaptörü ile SATA SSD kullanmak [bunun gibi sorunlar](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931) nedeniyle **önerilmez**.
    Bu yolu tercih ederseniz, çalışıp çalışmayacağını kontrol etmek için kullanabileceğiniz bir performans testini [SSD'nin Performansını Test Etme](#testing-the-ssd-s-performance) bölümüne ekledik.
- İnternet erişimi için bir **ethernet kablosu**. En az **Cat 5e** derecelendirmeli olmalıdır.
  - Wi-Fi üzerinden bir node çalıştırmak **önerilmez**, ancak başka seçeneğiniz yoksa, ethernet kablosu kullanmak yerine bunu yapabilirsiniz.
- Elektrik kesintisi yaşarsanız güç kaynağı görevi görecek bir **UPS**.
  Pi gerçekten çok fazla güç çekmez, bu nedenle küçük bir UPS bile bir süre dayanır, ancak genel olarak ne kadar büyükse o kadar iyidir. Karşılayabileceğiniz kadar büyük bir UPS ile gidin.
  Ayrıca, **modeminizi, yönlendiricinizi ve diğer ağ ekipmanınızı** da ona bağlamanızı **öneririz** - Pi'nizi hayatta tutmanın yönlendiriciniz ölürse pek bir anlamı yok.

Konumunuza, satışlara, SSD ve UPS seçiminize ve bunların kaç tanesine zaten sahip olduğunuza bağlı olarak, muhtemelen tam bir kurulum için **yaklaşık 200 ila 500 USD** harcayacaksınız.

### Fanı Daha Sessiz Çalıştırma

Fanı aldığınızda, varsayılan olarak muhtemelen aşağıdaki resimde gösterildiği gibi 5v GPIO pinine bağlamanız talimatı verilecektir.
Fanın iki delikli bir konnektörü olacaktır; siyah olan GND'ye (pin 6), kırmızı olan da +5v'ye (pin 4) gitmelidir.
![](./images/pi/Pinout.png)

Ancak, deneyimlerimize göre, bu fanın gerçekten gerekli olmayan çok gürültülü ve hızlı çalışmasına neden oluyor.
Hala serin çalışırken daha sessiz hale getirmek istiyorsanız, 5v pini yerine 3.3v pinine (Pin 1, mavi olan) bağlamayı deneyin.
Bu, fanınızda siyah noktanın hala GND'ye (pin 6) gideceği, ancak şimdi kırmızı noktanın +3.3v'ye (pin 1) gideceği anlamına gelir.

Fanınızın yan yana iki delikli bir konnektörü varsa ve bunları ayıramazsanız, Pi'deki GPIO pinleri arasına [bunun gibi bazı jumper'lar](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) koyabilirsiniz.

### İşletim Sistemini Yükleme

Raspberry Pi'yi destekleyen birkaç Linux İşletim Sistemi çeşidi vardır.
Bu kılavuz için **Ubuntu 20.04**'e bağlı kalacağız.
Ubuntu dünya çapında kullanılan denenmiş ve gerçek bir İşletim Sistemidir ve 20.04 (bu yazının yazıldığı sırada) Uzun Vadeli Destek (LTS) sürümlerinin en sonuncusudur, bu da çok uzun bir süre güvenlik yamaları almaya devam edeceği anlamına gelir.
Raspbian gibi farklı bir Linux türüne bağlı kalmayı tercih ederseniz, bunun için mevcut kurulum kılavuzlarını takip etmekten çekinmeyin - sadece bu kılavuzun Ubuntu için oluşturulduğunu unutmayın, bu nedenle talimatların tümü İşletim Sisteminizle eşleşmeyebilir.

Canonical'daki güzel insanlar [Ubuntu Server görüntüsünü bir Pi'ye nasıl yükleyeceğinize dair harika bir kılavuz](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview) yazdılar.

Server kurulumu için yukarıdaki kılavuzun **1 ila 4. adımlarını** takip edin.
İşletim Sistemi görüntüsü için `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures` seçmek istiyorsunuz.

Bir masaüstü kullanıcı arayüzü istediğinize karar verirseniz (böylece fare kullanabilir ve sürükleyebileceğiniz pencereleriniz olabilir), 5. adımı da takip etmeniz gerekir.
Bunu yapmamanızı ve sadece sunucu görüntüsüne bağlı kalmanızı öneririz, çünkü masaüstü kullanıcı arayüzü nispeten az faydayla Pi'nize bazı ek yük ve işlem işi ekleyecektir.
Ancak, bir masaüstü çalıştırmaya kararlıysanız, Xubuntu seçeneğini seçmenizi öneririz.
Kaynaklar üzerinde oldukça hafiftir ve çok kullanıcı dostudur.

Bu tamamlandığında, Ubuntu'yu bir Rocket Pool node'u çalıştırmaya hazırlamaya başlamaya hazırsınız.
Üzerinde yerel terminal kullanabilir veya kurulum kılavuzunun önerdiği gibi masaüstü/dizüstü bilgisayarınızdan SSH yapabilirsiniz.
Süreç her iki şekilde de aynı olacaktır, bu nedenle sizin için en uygun olanı yapın.

`ssh`'a aşina değilseniz, [Güvenli Kabuk'a Giriş](../ssh) kılavuzuna göz atın.

::: warning NOT
Bu noktada, Pi'nizin IP adresini **statik** yapmak için yönlendiricinizi yapılandırmayı _şiddetle düşünmelisiniz_.
Bu, Pi'nizin sonsuza kadar aynı IP adresine sahip olacağı anlamına gelir, böylece her zaman o IP adresini kullanarak SSH yapabilirsiniz.
Aksi takdirde, bir noktada Pi'nizin IP'sinin değişmesi mümkündür ve yukarıdaki SSH komutu artık çalışmayacaktır.
Pi'nizin yeni IP adresinin ne olduğunu öğrenmek için yönlendiricinizin yapılandırmasına girmeniz gerekecektir.

Her yönlendirici farklıdır, bu nedenle statik IP adresi nasıl atanacağını öğrenmek için yönlendiricinizin belgelerine başvurmanız gerekecektir.
:::

## SSD'yi Bağlama

Toplamış olabileceğiniz gibi, yukarıdaki kurulum talimatlarını takip ettikten sonra, çekirdek İşletim Sistemi microSD karttan çalışacaktır.
Bu, tüm Execution ve Consensus blockchain verilerini tutmak için yeterince büyük veya yeterince hızlı değildir, SSD'nin devreye girdiği yer burasıdır.
Kullanmak için, onu bir dosya sistemiyle kurmamız ve Pi'ye bağlamamız gerekir.

### SSD'yi USB 3.0 Portlarına Bağlama

SSD'nizi Pi'nin USB 3.0 portlarından birine takarak başlayın. Bunlar siyah olanlar değil, **mavi** portlardır:

![](./images/pi/USB.png)

Siyah olanlar yavaş USB 2.0 portlarıdır; sadece fare ve klavye gibi aksesuarlar için iyidirler.
Klavyenizi mavi portlara takmışsanız, çıkarın ve şimdi siyah olanlara takın.

### SSD'yi Biçimlendirme ve Yeni Bölüm Oluşturma

::: warning
Bu işlem SSD'nizdeki her şeyi silecektir.
Zaten içinde şeyler olan bir bölümünüz varsa, hepsini silmek üzere olduğunuz için BU ADIMI ATLAYIN!
Bu SSD'yi daha önce hiç kullanmadıysanız ve tamamen boşsa, bu adımı takip edin.
:::

Diskinizin cihaz tablosundaki konumunu bulmak için şu komutu çalıştırın:

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

İhtiyacınız olan önemli şey `logical name: /dev/sda` kısmı veya daha doğrusu **`/dev/sda`** kısmıdır.
Buna SSD'nizin **cihaz konumu** diyeceğiz.
Bu kılavuz için, cihaz konumu olarak sadece `/dev/sda` kullanacağız - sizinki muhtemelen aynı olacaktır, ancak talimatların geri kalanı için gösterdiği her neyse onunla değiştirin.

Artık cihaz konumunu bildiğimize göre, onu biçimlendirelim ve gerçekten kullanabilmemiz için üzerinde yeni bir bölüm yapalım.
Yine, **bu komutlar diskte zaten olanı silecektir!**

Yeni bir bölüm tablosu oluşturun:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Yeni bölümü `ext4` dosya sistemiyle biçimlendirin:

```shell
sudo mkfs -t ext4 /dev/sda1
```

Ona bir etiket ekleyin (bunu yapmak zorunda değilsiniz, ama eğlencelidir):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Aşağıdaki komutu çalıştırarak bunun işe yaradığını onaylayın, burada gördüğünüz gibi çıktı göstermelidir:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Tüm bunları görürseniz, hazırsınız demektir. `UUID="..."` çıktısını alın ve geçici olarak bir yere koyun, çünkü bir dakika içinde buna ihtiyacınız olacak.

### Yeni Bölümü Optimize Etme

Ardından, doğrulayıcı etkinliği için optimize etmek üzere yeni dosya sistemini biraz ayarlayalım.

Varsayılan olarak, ext4 alanının %5'ini sistem süreçleri için ayıracaktır.
SSD'de buna ihtiyacımız yok çünkü sadece Execution ve Consensus zincir verilerini depoladığı için bunu devre dışı bırakabiliriz:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Bağlama ve Otomatik Bağlamayı Etkinleştirme

Sürücüyü kullanabilmek için dosya sistemine bağlamanız gerekir.
İstediğiniz yerde yeni bir bağlama noktası oluşturun (burada örnek olarak `/mnt/rpdata` kullanacağız, bunu kullanmaktan çekinmeyin):

```shell
sudo mkdir /mnt/rpdata
```

Şimdi yeni SSD bölümünü o klasöre bağlayın:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Bundan sonra, `/mnt/rpdata` klasörü SSD'ye işaret edecektir, bu nedenle o klasöre yazdığınız her şey SSD'de yaşayacaktır.
Execution ve Consensus için zincir verilerini burada depolayacağız.

Şimdi, başlangıçta otomatik olarak bağlanması için bağlama tablosuna ekleyelim.
Daha önce kullandığınız `blkid` komutundaki `UUID`'yi hatırlıyor musunuz?
İşte burası işe yarayacak.

```shell
sudo nano /etc/fstab
```

Bu, başlangıçta şuna benzeyen etkileşimli bir dosya düzenleyicisi açacaktır:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

En alta inmek için ok tuşlarını kullanın ve bu satırı sonuna ekleyin:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

`UUID=...` içindeki değeri diskinizinkiyle değiştirin, ardından kaydetmek için `Ctrl+O` ve `Enter`'a, ardından çıkmak için `Ctrl+X` ve `Enter`'a basın.
Şimdi yeniden başlattığınızda SSD otomatik olarak bağlanacaktır. Güzel!

### SSD'nin Performansını Test Etme

Daha ileri gitmeden önce, SSD'nizin okuma/yazma hızını ve saniyede kaç G/Ç isteğini (IOPS) kaldırabileceğini test etmelisiniz.
SSD'niz çok yavaşsa, o zaman bir Rocket Pool node'u için iyi çalışmayacak ve zamanla para kaybetmeye devam edeceksiniz.

Test etmek için `fio` adlı bir program kullanacağız. Şöyle kurun:

```shell
sudo apt install fio
```

Ardından, SSD'nizin bağlama noktasına gidin:

```shell
cd /mnt/rpdata
```

Şimdi, SSD performansını test etmek için şu komutu çalıştırın:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

Çıktı şöyle görünmelidir:

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

Önemsediğiniz şey, `test:` satırının altındaki `read:` ve `write:` ile başlayan satırlardır.

- **Okuma**nızın en az **15k** IOPS ve en az **60 MiB/s** bant genişliği (BW) olmalıdır.
- **Yazma**nızın en az **5000** IOPS ve en az **20 MiB/s** bant genişliği olmalıdır.

Bunlar kullandığımız Samsung T5'ten gelen özelliklerdir ve çok iyi çalışır.
Ayrıca 5k okuma IOPS ve 1k yazma IOPS'li daha yavaş bir SSD test ettik ve consensus katmanıyla yetişmekte çok zorlanıyor.
Yukarıdaki özelliklerin altında bir SSD kullanırsanız, sadece birçok kaçırılmış onay görebileceğinize hazır olun.
Sizinki bunları karşılıyor veya aşıyorsa, o zaman hazırsınız ve devam edebilirsiniz.

::: tip NOT
SSD'niz yukarıdaki özellikleri karşılamıyorsa ancak karşılaması gerekiyorsa, bir ürün yazılımı güncellemesiyle düzeltebilirsiniz.
Örneğin, bu Rocket Pool topluluğu tarafından Samsung T7 ile yaşanmıştır.
Kutusundan yeni çıkan ikisi sadece 3.5K okuma IOPS ve 1.2K yazma IOPS gösterdi.
Tüm mevcut ürün yazılımı güncellemelerini uyguladıktan sonra, performans yukarıdaki örnekte gösterilen sayılara geri döndü.
Sürücünüzün güncel olduğundan emin olmak için en son ürün yazılımı için üreticinizin destek web sitesine bakın - ürün yazılımını başka güncelleme kalmayana kadar birden çok kez güncellemeniz gerekebilir.
:::

Son olarak, yeni oluşturduğunuz test dosyasını kaldırın:

```shell
sudo rm /mnt/rpdata/test
```

## Swap Alanı Kurma

Pi'nin 8 GB (veya bu yolu tercih ettiyseniz 4 GB) RAM'i vardır.
Yapılandırmamız için bu yeterli olacaktır.
Yine de, biraz daha eklemek asla zarar vermez.
Şimdi yapacağımız şey **swap alanı** denilen bir şey eklemektir.
Esasen, korkunç bir şekler ters giderse ve Pi normal RAM'den tükenirse SSD'yi "yedek RAM" olarak kullanacağımız anlamına gelir.
SSD normal RAM kadar hızlı değildir, bu nedenle swap alanına çarparsa işleri yavaşlatacaktır, ancak tamamen çökmeyecek ve her şeyi kırmayacaktır.
Bunu (büyük olasılıkla) asla ihtiyaç durmayacağınız ekstra sigorta olarak düşünün.

### Swap Dosyası Oluşturma

İlk adım, swap alanınız olarak hareket edecek yeni bir dosya yapmaktır.
Ne kadar kullanmak istediğinize karar verin - makul bir başlangıç 8 GB olurdu, böylece toplam 16 GB için 8 GB normal RAM ve 8 GB "yedek RAM" olur.
Süper güvenli olmak için, sisteminizin toplam 32 GB için 8 GB normal RAM ve 24 GB "yedek RAM"i olması için 24 GB yapabilirsiniz, ancak bu muhtemelen aşırıdır.
Neyse ki, SSD'nizin 1 veya 2 TB alanı olduğu için, swapfile için 8 ila 24 GB ayırmak önemsizdir.

Bu adım adım kılavuzun hatırına, güzel bir orta yol seçelim - diyelim ki toplam 24 GB RAM için 16 GB swap alanı.
Giderken istediğiniz numarayı ikame edin.

Bunu girin, bu `/mnt/rpdata/swapfile` adlı yeni bir dosya oluşturacak ve onu 16 GB sıfırla dolduracaktır.
Miktarı değiştirmek için, `count=16` içindeki sayıyı istediğiniz herhangi bir sayıyla değiştirin. **Bunun uzun zaman alacağını unutmayın, ama sorun değil.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

Ardından, izinleri ayarlayın böylece yalnızca kök kullanıcı okuyabilir veya yazabilir (güvenlik için):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Şimdi, onu swap dosyası olarak işaretleyin:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Ardından, etkinleştirin:

```shell
sudo swapon /mnt/rpdata/swapfile
```

Son olarak, Pi'niz yeniden başlatıldığında otomatik olarak yüklensin diye bağlama tablosuna ekleyin:

```shell
sudo nano /etc/fstab
```

Dosya şöyle görünecek şekilde sonuna yeni bir satır ekleyin:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Kaydetmek için `Ctrl+O` ve `Enter`'a, ardından çıkmak için `Ctrl+X` ve `Enter`'a basın.

Etkin olduğunu doğrulamak için şu komutları çalıştırın:

```shell
sudo apt install htop
htop
```

Çıktınız en üstte şuna benzer olmalıdır:
![](./images/pi/Swap.png)

`Swp` etiketli son satırdaki ikinci sayı (`/`'dan sonraki) sıfır değilse, o zaman hazırsınız.
Örneğin, `0K / 16.0G` gösteriyorsa, swap alanınız başarıyla etkinleştirilmiştir.
`0K / 0K` gösteriyorsa çalışmadı ve önceki adımları doğru girdiğinizi onaylamanız gerekecektir.

`htop`'tan çıkmak ve terminale geri dönmek için `q` veya `F10`'a basın.

### Swappiness ve Önbellek Basıncını Yapılandırma

Varsayılan olarak, Linux sistemin RAM'inden biraz basıncı almak için çok fazla swap alanı kullanmaya istekli olacaktır.
Bunu istemiyoruz. Swap'a güvenmeden önce tüm RAM'i son saniyeye kadar kullanmasını istiyoruz.
Bir sonraki adım, sistemin "swappiness"ini değiştirmektir, bu temelde swap alanını kullanmaya ne kadar istekli olduğudur.
Bunu hangi değere ayarlayacağı konusunda çok fazla tartışma var, ancak 6 değerinin yeterince iyi çalıştığını bulduk.

Ayrıca, Pi'nin dosya sisteminin bir önbelleğini ne kadar hızlı sileceğini belirten "önbellek basıncını" düşürmek istiyoruz.
Kurulumumuzla çok fazla yedek RAM'e sahip olacağımız için, bunu "10" yapabiliriz, bu önbelleği bir süre bellekte bırakır ve disk I/O'yu azaltır.

Bunları ayarlamak için şu komutları çalıştırın:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Şimdi, yeniden başlatma sonrasında yeniden uygulanmaları için onları `sysctl.conf` dosyasına koyun:

```shell
sudo nano /etc/sysctl.conf
```

Sonuna bu iki satırı ekleyin:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Ardından daha önce yaptığınız gibi kaydedin ve çıkın (`Ctrl+O`, `Ctrl+X`).

## Pi'yi Hız Aşırtma

Varsayılan olarak, Pi ile birlikte gelen 1,5 GHz işlemci oldukça yetenekli küçük bir cihazdır.
Çoğunlukla, onunla sadece doğrulayabilmelisiniz.
Ancak, nadir durumlarda doğrulayıcı istemcinizin bazı şeyler üzerinde çalışmaya takılı kaldığını ve doğrulayıcınızın onay görevlerine ayak uydurmak için yeterli gücü olmadığını fark ettik.
Bu olduğunda, [beaconcha.in explorer](https://beaconcha.in)'da şuna benzer bir şey göreceksiniz (daha sonra [Node'unuzun Performansını İzleme](../performance) kılavuzunda daha ayrıntılı açıklanmıştır):

![](./images/pi/Incl-Dist.png)

8'lik bu dahil etme mesafesi, o onayı göndermek için gerçekten uzun zaman aldığı anlamına gelir ve geç kaldığınız için biraz cezalandırılacaksınız.
İdeal olarak, hepsi 0 olmalıdır.
Nadir olsa da, bunlar stok ayarlarda çalışırken ortaya çıkıyor.

Bununla birlikte, bunları azaltmanın bir yolu var: hız aşırtma.
Hız aşırtma, Pi'nizin CPU'sundan biraz daha fazla performans elde etmenin ve bu kötü yüksek dahil etme mesafelerini önlemenin açık ara en kolay yoludur.
Açıkçası, 1,5 GHz'lik varsayılan CPU saati gerçekten yetersiz.
Hız aşırtma yoluyla onu oldukça fazla hızlandırabilirsiniz ve ne kadar ileri götürdüğünüze bağlı olarak, bunu oldukça güvenli bir şekilde de yapabilirsiniz.

Pi'yi hız aşırtmak çok basittir - sadece bir metin dosyasındaki bazı sayıları değiştirmeyi içerir.
Önemli olan iki sayı vardır: birincisi **çekirdek saati**dir, bu da ARM CPU'nun ne kadar hızlı çalıştığını doğrudan belirler.
İkincisi **aşırı voltaj**dır, bu da ARM CPU'ya beslenen voltajı belirler.
Daha yüksek hızlar genellikle daha yüksek voltaj gerektirir, ancak Pi'nin CPU'su herhangi bir gözle görülür hasar olmaksızın oldukça fazla ekstra voltajı kaldırabilir.
Biraz daha hızlı yıpranabilir, ancak yine de yıllarca konuşuyoruz ve o zamana kadar Pi 5 çıkacak, yani gerçek bir zarar yok!

Bunun yerine, aşırı voltajla ilgili asıl endişe **daha yüksek voltajların daha yüksek sıcaklıklara yol açmasıdır**.
Bu bölüm, Pi'nizin ağır yük altında ne kadar ısındığını görmenize yardımcı olacak, böylece çok ileri gitmezsiniz.

::: warning
Yapacağımız seviyelerde hız aşırtma oldukça güvenli ve güvenilir olsa da, "silikon piyangosu" denilen şeyin insafındasınız.
Her CPU mikroskobik yollarla biraz farklıdır ve bazıları diğerlerinden daha iyi hız aşırtma yapabilir.
Çok ileri / çok sert hız aşırtırsanız, sisteminiz **kararsız** hale gelebilir.
Kararsız Pi'ler sürekli yeniden başlatmalardan tamamen donmaya kadar her türlü sonuçtan zarar görür.
**En kötü durumda, microSD kartınızı bozabilir ve her şeyi sıfırdan yeniden yüklemeniz gerekir!**

**Buradaki rehberliği takip ederek, bu riski aldığınız gerçeğini kabul etmeniz gerekir.**
Bu sizin için değmezse, bu bölümün geri kalanını atlayın.
:::

## Stok Yapılandırmasını Kıyaslama

Hız aşırtmadan önce, Pi'nizin stok, reyondaki yapılandırmasında neler yapabileceğini profil oluşturmalısınız.
Bakmak için üç önemli şey vardır:

1. **Performans** (Pi'nizin hesaplama hızı)
2. Yük altında **Sıcaklık** (ne kadar ısınıyor)
3. **Kararlılık** (çökmeden önce ne kadar süre çalışıyor)

Giderken her üçü hakkında da istatistikler alacağız.

### Performans

Performansı ölçmek için LINPACK kullanabilirsiniz.
Kaynaktan oluşturacağız.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

Şimdi şöyle çalıştırın:

```shell
linpack
Enter array size (q to quit) [200]:
```

Sadece 200 varsayılanında bırakmak için `enter`'a basın ve çalıştırmasına izin verin.
Bittiğinde, çıktı şöyle görünecektir:

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

Bakmanız gereken şey son satır, `KFLOPS` sütunundadır.
Bu sayı (yukarıdaki örnekte 1120277.186) hesaplama performansınızı temsil eder.
Kendi başına bir anlam ifade etmez, ancak hız aşırtılmış performansı karşılaştırmak için bize iyi bir temel verir.
Buna **stok KFLOPS** diyelim.

### Sıcaklık

Ardından, Pi'yi strese sokalım ve ağır yük altında sıcaklığını izleyelim.
İlk olarak, Pi hakkında ayrıntıları yazdırabilen `vcgencmd` adlı bir araç sağlayacak bu paketi yükleyin:

```shell
sudo apt install libraspberrypi-bin
```

Bu kurulduktan sonra, Pi'yi yeniden başlatın (bazı yeni izinlerin uygulanması için bu gereklidir).
Ardından, **stressberry** adlı bir program yükleyin.
Bu bizim kıyaslama aracımız olacaktır.
Şöyle kurun:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip NOT
Stressberry sıcaklık bilgilerini okuyamama veya `vchiq` örneğini açamama hakkında bir hata verirse, bunu aşağıdaki komutla düzeltebilirsiniz:

```shell
sudo usermod -aG video $USER
```

Ardından oturumu kapatın ve tekrar açın, SSH oturumunuzu yeniden başlatın veya makineyi yeniden başlatın ve tekrar deneyin.
:::

Ardından, şöyle çalıştırın:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Bu, Pi'nin 4 çekirdeğinde 60 saniye soğuma öncesi ve sonrası ile 300 saniye (5 dakika) boyunca "Stock" adlı yeni bir stres testi çalıştıracaktır.
Daha uzun süre çalıştırmasını veya daha fazla soğuma süresine sahip olmasını istiyorsanız bu zamanlamalarla oynayabilirsiniz, ancak bu benim için hızlı ve kirli bir stres testi olarak çalışıyor.
Sonuçlar `stock.out` adlı bir dosyaya kaydedilecektir.

Testin ana aşaması sırasında, çıktı şöyle görünecektir:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Bu temelde size Pi'nin ne kadar ısınacağını söyler.
85°C'de, Pi aslında kendini kısıtlamaya başlayacak ve aşırı ısınmaması için saat hızını düşürecektir.
Neyse ki, bir soğutucu ve fan eklediğiniz için buna yakın bir yere ulaşmamalısınız!
Bununla birlikte, genel olarak sistemin genel sağlığı için sıcaklıkları 65°C'nin altında tutmaya çalışıyoruz.

Normal doğrulama işlemleri sırasında sistem sıcaklığını izlemek istiyorsanız, bunu `vcgencmd` ile yapabilirsiniz:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Kararlılık

Bir hız aşırtmanın kararlılığını test etmek şu üç soruyu cevaplamayı içerir:

- Pi açılıyor ve oturum açma istemine / SSH sunucusunu başlatmaya mı ulaşıyor?
- Normal işlemler sırasında rastgele donuyor veya yeniden başlatıyor mu?
- Ağır yük altında rastgele donuyor veya yeniden başlatıyor mu?

Bir hız aşırtmanın gerçekten kararlı olması için cevaplar **evet, hayır ve hayır** olmalıdır.
Bunu test etmenin birkaç yolu vardır, ancak bu noktada en kolayı sadece `stressberry`'yi gerçekten uzun bir süre çalıştırmaktır.
Ne kadar uzun tamamen size kalmış - ne kadar uzun giderse, sistemin kararlı olduğundan o kadar emin olabilirsiniz.
Bazı insanlar sadece yukarıdaki 5 dakikalık testi çalıştırıyor ve hayatta kalırsa iyi diyorlar; diğerleri yarım saat çalıştırıyor; diğerleri 8 saat hatta daha fazla çalıştırıyor.
Ne kadar süre çalıştıracağınız, kendi risk toleransınıza göre vermeniz gereken kişisel bir karardır.

Çalışma süresini değiştirmek için, `-d` parametresini testin çalışmasını istediğiniz saniye sayısıyla değiştirin.
Örneğin, yarım saatin yolu olduğuna karar verdiyseniz, `-d 1800` yapabilirsiniz.

## İlk Hız Aşırtmanız - 1800 MHz (Hafif)

Yapacağımız ilk hız aşırtma nispeten "hafif" ve güvenilir, ancak yine de güzel bir hesaplama gücü artışı sağlıyor.
Stok 1500 MHz'den 1800 MHz'e çıkacağız - %20'lik bir hızlanma!

Bu dosyayı açın:

```shell
sudo nano /boot/firmware/usercfg.txt
```

Sonuna bu iki satırı ekleyin:

```shell
arm_freq=1800
over_voltage=3
```

Ardından dosyayı kaydedin ve yeniden başlatın.

Bu ayarlar CPU saatini %20 artıracak ve ayrıca CPU voltajını 0,88v'den 0,93v'ye yükseltecektir (her `over_voltage` ayarı onu 0,025v artırır).
Bu ayar herhangi bir Pi 4B tarafından ulaşılabilir olmalıdır, bu nedenle sisteminiz yeniden başlamalı ve sadece birkaç dakika içinde bir oturum açma istemi veya SSH erişimi sağlamalıdır.
Yoksa ve Pi'niz yanıt vermeyi durdurursa veya bir önyükleme döngüsüne girerse, onu sıfırlamanız gerekecektir - bunun için bir sonraki bölümü okuyun.

### Kararsız Hız Aşırtma Sonrasında Sıfırlama

Pi'niz yanıt vermeyi durdurursa veya tekrar tekrar yeniden başlatmaya devam ederse, o zaman hız aşırtmayı düşürmeniz gerekir.
Bunu yapmak için şu adımları izleyin:

1. Pi'yi kapatın.
2. MicroSD kartı çıkarın.
3. Kartı bir microSD adaptörü ile başka bir Linux bilgisayara takın.
   \*NOT: Bu **başka bir Linux bilgisayar olmalıdır**. Bir Windows makinesine takarsanız çalışmayacaktır, çünkü Windows SD kartın kullandığı `ext4` dosya sistemini okuyamaz!\*\*
4. Kartı diğer bilgisayara bağlayın.
5. `<SD bağlama noktası>/boot/firmware/usercfg.txt` dosyasını açın.
6. `arm_freq` değerini düşürün veya `over_voltage` değerini artırın. _NOT: **over_voltage=6'dan daha yükseğe çıkmayın.** Daha yüksek değerler Pi'nin garantisi tarafından desteklenmez ve CPU'yu rahat olabileceğinizden daha hızlı düşürme riskini taşır._
7. SD kartın bağlantısını kesin ve çıkarın.
8. Kartı Pi'ye geri takın ve açın.

Pi çalışıyorsa, harika! Aşağıda devam edin.
Yoksa, tüm süreci daha da muhafazakar ayarlarla tekrarlayın.
En kötü durumda, onu stok ayarlara geri döndürmek için `arm_freq` ve `over_voltage` satırlarını tamamen kaldırabilirsiniz.

### 1800 MHz'i Test Etme

Oturum açtığınızda, yeni performansı test etmek için tekrar `linpack` çalıştırın.
İşte test Pi'mizden bir örnek:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

Yine, son satırdaki `KFLOPS` sütununu alın.
Stok yapılandırmasıyla karşılaştırmak için, sadece iki sayıyı bölün:
`1337238.504 / 1120277.186 = 1.193668`

Pekala! Bu performansta %19,4'lük bir artış, %20 daha hızlı çalıştığımız için beklenen bir şey.
Şimdi yeni saat hızı ve voltaj ayarlarıyla sıcaklıkları kontrol edelim:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Şuna benzer çıktı görmelisiniz:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

Fena değil, stok ayarlardan yaklaşık 6° daha sıcak ama yine de kişisel olarak duracağımız eşiğin altında.

Rahatınız varsa burada daha uzun bir kararlılık testi çalıştırabilirsiniz veya işleri daha da yükseğe çıkarmak için devam edebilirsiniz.

## 2000 MHz'e Gitmek (Orta)

Bir sonraki kilometre taşı 2000 MHz olacaktır. Bu, oldukça önemli olan %33,3'lük bir saat hızı artışını temsil eder.
Çoğu insan bunu performans ve kararlılık arasında harika bir denge olarak görür, bu nedenle süreci burada durdurur.

Bu seviye için önerimiz bu ayarlarla başlamaktır:

```shell
arm_freq=2000
over_voltage=5
```

Bu, çekirdek voltajını 1.005v'ye yükseltecektir.
Bunu `linpack` ve `stressberry` testleriyle deneyin.
Onlardan sağ çıkarsa, o zaman hazırsınız. Donuyorsa veya rastgele yeniden başlatıyorsa, voltajı artırmalısınız:

```shell
arm_freq=2000
over_voltage=6
```

Bu, çekirdek voltajını garantiyi bozmadan önce gidebileceğiniz kadar yüksek olan 1.03v'ye koyar.
Bu genellikle çoğu Pi için çalışır.
Yoksa, voltajı daha da artırmak yerine, **saat hızınızı düşürmeli ve tekrar denemelisiniz.**

Referans olarak, 2000 çalışmamızdan sayılar şunlardır:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

Bu, bekleyeceğimiz ile uyumlu olan %32,3'lük bir hızlanma. Fena değil!

İşte sıcaklıklarımız:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

7 derece daha artış, ama yine de 65°C eşiğimizin altında.

## 2100 MHz'e Gitmek (Ağır)

Bir sonraki adım, stok yapılandırmasına göre sağlam bir **%40 hızlanmayı** temsil eder.

**NOT: Tüm Pi'ler `over_voltage=6`'da kalırken bunu yapabilme yeteneğine sahip değildir.
Deneyin ve bozulursa, 2000 MHz'e geri dönün.**

Yapılandırma şöyle görünecektir:

```shell
arm_freq=2100
over_voltage=6
```

Referans olarak, işte sonuçlarımız:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

Bu %39,4'lük bir hızlanma!

İşte sıcaklıklarımız:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

60°C'nin biraz altında, yani bol bol yer var.

## 2250 MHz'e Gitmek (Aşırı)

Bu, Pi'lerimizi çalıştırdığımız ayardır ve bu yazının yazıldığı sırada bir yıldan fazla süredir kararlıdır.
Yine de, **kullanıcılar bu kadar yüksek hız aşırtma konusunda uyarılır** - node'unuzun üretim yapılandırması yapmaya çalışmadan önce kapsamlı kararlılık testleri yaptığınızdan ve bol miktarda termal alanınız olduğundan emin olun!

Yapılandırmamız:

```shell
arm_freq=2250
over_voltage=10
```

İşte sonuçlarımız:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

Bu stok yapılandırmadan %46 daha hızlı!

OV10, stok ürün yazılımının Pi'nin gideceği kadardır ve 2250 MHz, üretimde güvenilir bir şekilde çalıştırabileceğimiz en hızlı olandır.

Stres testinde sıcaklıklar bu kadar yükseğe çıkıyor:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Ancak gerçek doğrulama sırasında, 60C'nin altında kalma eğilimindeler ki bu bizim için kabul edilebilir.

## Sonraki Adımlar

Ve bununla, Pi'niz çalışıyor ve Rocket Pool'u çalıştırmaya hazır!
[ETH İstemcilerinizi Seçme](../eth-clients) bölümüne geçin.
