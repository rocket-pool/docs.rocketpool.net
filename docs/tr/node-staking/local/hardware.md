# Staking Donanımı Seçimi

Rocket Pool node'u çalıştırmak için resmi bir donanım belirtimi bulunmamaktadır.
Bu sayfa, staking donanımı seçmek için kullanabileceğiniz bazı yönergeler ve örnekler sunmaktadır.

Node'unuzun minimum donanım gereksinimleri, seçeceğiniz Consensus ve Execution istemcilerine bağlı olacaktır.
Örneğin, node'unuzu düşük güçlü bir cihazda çalıştırmayı düşünüyorsanız, Execution istemcisi olarak `Geth` ve Consensus istemcisi olarak `Nimbus` kullanmakla sınırlı olabilirsiniz.
32+ GB RAM'e sahip daha güçlü bir NUC kullanıyorsanız, tüm istemci kombinasyonları size açıktır.

Aşağıdaki yönergeler, **rahat** bir donanım seviyesi istediğinizi varsayar, yani fazla kapasiteniz olacaktır.
Bu yönergeleri aklınızda tutarsanız, node'unuz Rocket Pool tarafından desteklenen tüm istemci kombinasyonlarını çalıştırmak için yeterli kaynaklara sahip olacaktır.
Bu, Ethereum ağındaki istemci çeşitliliği için çok önemli olan `random` bir istemci çifti seçmenize olanak tanır.

::: tip NOT
Ethereum staking çok bağışlayıcıdır.
Eviniz su bastıysa ve staking cihazınız bozulduysa, tekrar çalışır hale gelmek için bir hafta harcamanın büyük bir cezası yoktur (tabii ki çok nadir bir olay olan bir sync komitesinde olmadığınız sürece).
Bileşen arızası bir noktada meydana gelebilir, ancak bunun için stres yapmayın.
Kesinti, Ethereum ağının tamamında büyük bir kesinti sırasında çevrimdışı olmadığınız sürece sizi slash etmez.
:::

## Donanım Gereksinimleri

Ethereum validator'ları hesaplama açısından çok pahalı değildir, yani Execution ve Consensus istemcileriniz çalıştığında, herhangi bir ek validator **çok küçük miktarda ek kaynak** kullanacaktır.
Bu, 64 validator'a kadar büyür ve bu noktada 65. validator ve sonrası için gereken kaynaklar ihmal edilebilir düzeydedir.

Deneyimlerimize göre, mini-PC'ler ve NUC'lar dahil olmak üzere çoğu kurulum, etkili bir şekilde sınırsız sayıda validator çalıştırabilir.

### CPU Gereksinimleri

**Yönerge: en az 4 thread'e sahip herhangi bir modern CPU.**

Rocket Pool node'u çalıştırmak hesaplama açısından çok yoğun değildir.
CPU'nun en büyük etkisi, ilk oluşturduğunuzda (veya daha sonra istemcileri değiştirirseniz) node'unuzun blockchain durumunu ne kadar hızlı senkronize edebildiğidir.
İlk senkronizasyondan sonra, CPU o kadar yoğun kullanılmaz.

CPU isimlendirmesi yanıltıcı olabilir; 2010'dan bir Intel Core i5, genellikle 2022'den bir core i3'ten **daha az güçlüdür**.
Birçok topluluk üyesi, küçük form faktörleri nedeniyle Intel NUC cihazlarını kullanır, ancak eski bir i5 NUC, yeni bir i3'ten daha kötü bir seçim olabilir.
Bu nedenle, en fazla birkaç yaşında olan "modern" bir CPU kullanmanızı öneririz.
Daha spesifik olarak, **x64 tabanlı CPU'lar için**, [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) uzantısını destekleyen bir CPU öneriyoruz - desteklenip desteklenmediğini görmek için CPU'nuzun üretici özelliklerini kontrol edin.
Tüm modern CPU'lar bunu desteklemez; örneğin, Celeron CPU'lar bunu içermeme eğilimindedir.

ARM tabanlı CPU'lar (Mac M1 veya M2 ya da Rock 5B gibi) yukarıdaki BMI2 uzantısı için geçerli değildir.

::: tip NOT
Bir NUC kullanmak istiyorsanız, NUC'un model numarasından ne kadar modern olduğunu anlayabilirsiniz.
Bunlar `NUC` + `nesil numarası` + `model` + `CPU türü` + `sonek` olarak biçimlendirilir.
Örneğin, bir `NUC11PAHi50Z` birimi 11. nesil bir i5 birimidir.
Intel web sitesinde [burada](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) NUC'ların bir listesini görebilirsiniz.

Asus PN50 veya PN51 gibi diğer mini-PC'ler bu konvansiyonu takip etmez, ancak hangi CPU'yu kullandıklarına ilişkin bilgiler ürün sayfalarında yer almalıdır.
:::

Bir CPU'daki çekirdek sayısı, **thread sayısından** daha az alakalıdır.
Rocket Pool node işletimi için **minimum 4 thread** öneriyoruz.
4 thread'li 2 çekirdekli bir CPU sorunsuz çalışacaktır.
Sadece 2 thread'e sahip bir CPU bulmak nadirdir.

### RAM Gereksinimleri

**Yönerge: en az 16 GB RAM, 32 GB tercih edilir, DDR4 tercih edilir**

Rocket Pool node'ları 16 GB RAM kadar az ile çalışabilir.
Genel olarak biraz daha fazlasına sahip olmanızı öneriyoruz, bu da biraz boşluk sağlar ve Teku gibi RAM yoğun istemciler için tam destek sunar.
Daha fazla RAM'in ek bir yararı, Execution istemcisine daha büyük bir önbellek boyutu sağlayabilmenizdir, bu da disk alanı kullanım hızınızı yavaşlatma eğilimindedir.

### SSD Gereksinimleri

**Yönerge: TLC veya daha iyisine sahip, DRAM önbelleği olan 2+ TB SSD. NVMe tercih edilir.**

Bu öğe çoğu insanın beklediğinden daha önemlidir.
Execution istemcisi IOPS'ye veya "saniyedeki işlem sayısına" büyük ölçüde dayanır; 15k Okuma IOPS ve 5k Yazma IOPS öneriyoruz
Pratikte bu şu anlama gelir:

- HDD (döner plaka) sürücüler çalışmayacaktır
- SATA veya harici USB 3.0+ SSD'ler _çalışabilir_
- NVMe SSD sürücüler tercih edilir

Kullanmak istediğiniz bir SSD'niz varsa ve node işletimi için yeterli performansa sahip olduğundan emin olmak istiyorsanız.

_\* Diskinizin bu performans gereksinimlerini karşılayıp karşılamadığından emin değilseniz, `fio` bunları test etmenin iyi bir yoludur.
Linux talimatları için [buraya](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/),
ve MacOS talimatları için [buraya](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) bakın._

:::tip NOT
SSD seçimi karmaşık bir seçim olabilir!

SSD'lerin flash çiplerinde veri depolama yöntemi, hız ve uzun ömür üzerinde belirgin bir etkiye sahiptir.
Bir SSD satın alırken `QLC`, `TLC` veya `SLC` gibi etiketler görebilirsiniz.
Bunlar, flash çipinin tek bir hücresinde bulunan veri miktarını temsil eder: `Q` "quad" için 4, `T` "triple" için 3, `M` "multi" için 2 ve `S` "single" için 1 anlamına gelir.

**TLC, MLC veya SLC** sürücüleri öneriyoruz.
Daha yavaş performansları ve daha düşük toplam güvenilirlikleri nedeniyle **QLC sürücüleri önermiyoruz**.

SSD'ler DRAM ile veya DRAM olmadan gelir, bu da SSD'deki verilere erişimi daha verimli hale getiren bir donanım öğesidir.
DRAM'li olanlar daha hızlıdır, ancak DRAM'siz olanlar daha ucuzdur.
Ancak, DRAM sorunsuz node işletimi sağlamak için oldukça önemlidir.

**DRAM** önbelleği olan bir sürücü öneriyoruz.
**DRAM'siz sürücüleri önermiyoruz**.
:::

Son değerlendirme sürücü boyutudur.
10/2024 itibarıyla, `geth` execution istemci veritabanı boyutu, ilk senkronizasyonunu tamamladıktan sonra (veya budamayı yeni bitirdikten sonra) yaklaşık 1.2TB alan gerektirir.
Bu zamanla istikrarlı bir şekilde büyüyecektir ve budama bu alanın bir kısmını geri kazandırabilse de, yeni budanmış durum _zamanla_ büyür.
Daha büyük bir sürücü ile gönül rahatlığına sahip olacaksınız.

### Yaygın Aksesuarlar

Birçok node operatörü, minimum gereksinimlerin ötesinde kurulumlarını geliştirir.
Bazı yaygın eklemeler şunlardır:

- SSD ömrünü uzatmak için SSD soğutucuları
- Elektrik kesintileri durumunda kesintisiz güç kaynakları (UPS)
- Bir şey başarısız olması durumunda yedek olarak bir geri dönüş node'u

Bunların hepsi sahip olmak için uygundur, ancak Rocket Pool node'u çalıştırmak için gerekli değildir.

## Örnek Kurulumlar

Bu bölümde, Rocket Pool topluluğunun kendileri için oluşturduğu çeşitli yapıların birkaçını sergileyeceğiz.
Bunlar, insanların kullandığı örneklerdir, kurulumunuzu nasıl çalıştırmanız gerektiğine dair öneriler değil.
Birçoğunun biraz eski olduğunu ve örneğin artık çok küçük olan SSD'ler kullandığını unutmayın.

### Xer0'nun Sunucusu

![](./images/Xer0.jpg)

Discord kullanıcısı **Xer0**, staking makineleri için geleneksel PC form faktörünü seçen birçok staker arasındadır.
Minimal bakım ve yükseltme gerektiren, önümüzdeki yıllarca dayanacak bir rig oluşturmak istediler, aynı zamanda her bileşenin tam özelleştirmesini sunuyorlardı.
Bu amaçla, Xer0 tam bir ATX sunucusu tasarladı ve inşa etti - geleneksel bir masaüstü PC gibi, ancak yalnızca Ethereum üzerinde staking'e yönelik.
Kurulumları altı çekirdekli bir Xeon Bronze 3204 (1.9 GHz), 8 DDR4 yuvası ve bir M.2 yuvası içerir... ancak bu esasen bir ev sunucusu yapısı olduğundan, tam bileşenler tamamen son kullanıcıya kalmıştır.

Xer0'nun kurulumu:

- Anakart: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Kasa: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Soğutucu: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Toplam: $1680**

İşte Xer0'nun bu kurulumu neden seçtiğine dair yorumları:

_Açıkçası, sadece Ethereum ağında staking yapmak için bir canavar oluşturmaya gerek yok, ancak böyle bir şey inşa etmemin birkaç nedeni var._

1. _Şimdi gelecekte 1 veya daha fazla validator'ın şu anda gördüğümüzden çok daha değerli olacağına inanıyorum, bu yüzden en az önümüzdeki 10-20 yıl boyunca hiçbir aksaklık olmadan ağı destekleyebilecek bir şey satın almak istedim._
1. _Bu kadar çekirdeğe sahip bir makine oluşturarak kendime çok daha fazla boşluk verdim, bu noktada bunun üzerine bir L2 toplayıcı çalıştırabilirim (donanımla ilgili) ve bir sunucuda çalıştırmak istediğim başka her şeyi çalıştırabilirim._ :)
1. _Bilgisayar oluşturmayı severim ve bu yüzden onu oluşturdum..._
1. _Bir sunucu yapısı ile, çoğu bilgisayarın yerel olarak sahip olmadığı donanım ve özelliklerle çok daha fazla esneklik sağlar._
1. _Biraz gelecek korumalı (her ihtimale karşı)_ :wink:

### Darcius'un Raf Rig'i

![](./images/Darcius.jpg)

Rocket Pool'un kurucusu David Rugendyke (Discord'da **darcius** olarak bilinir) node'unu mükemmelleştirmek için uzun zaman harcadı.
Biraz tartışmanın ardından, küçük ve taşınabilir, ancak yine de muazzam miktarda işlem gücü içeren bir Mini-ITX oluşturdu.
Rig'i 8 çekirdekli bir Ryzen 7 5800x (3.8 GHz), iki DDR4 yuvası ve NVMe SSD'ler için iki M.2 yuvası içerir.
Rocket Pool node'larının en yüksek performanslı rig'lerinden biri, ancak iyi bir nedenle: darcius, Beacon zincirinden tüm Rocket Pool validator'ları hakkında Execution zincirine bilgi aktaran Oracle Node adı verilen özel bir Rocket Pool node'u türü çalıştırır.
İzlenecek binlerce Rocket Pool minipool aktif olduğunda, bu iş çok fazla güç gerektirir... ancak raf rig'i bu görev için kolayca yeterlidir.

Darcius'un kurulumu:

- Anakart: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Kasa: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Toplam: $1587**

### Yorick'in microATX Yapısı

![](./images/Yorick-stock.jpg)

Deneyimli donanım meraklısı **YorickDowne**, sunucu oluşturma ve bakım konusunda çok fazla deneyime sahiptir.
Bu bilgiyi kullanarak, esnek bir microATX kurulumuna karar verdi.
Makinesi tipik bir PC'den çok daha küçüktür, ancak yine de Rocket Pool node'u çalıştırırken önemli ölçütler olan dayanıklılığı ve çalışma süresini maksimize eden sunucu sınıfı teknolojiye sığmayı başarır.
Intel ve AMD kurulumları için önerileri var, bunları [web sitesinde](https://eth-docker.net/docs/Usage/Hardware) bulabilirsiniz.
Intel versiyonu dört çekirdekli bir i3-9100F (3.6 GHz) veya bir Xeon CPU kullanır ve AMD versiyonu ECC belleği destekleyen herhangi bir Ryzen CPU önerir.
Her iki konfigürasyon için de 16 GB ECC RAM ve 1 TB NVMe SSD önerir.

Yorick'in Kurulumu:

- Anakart: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Kasa: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Herhangi biri (örnek: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Kasa fanları: Herhangi biri
- **Toplam: Yaklaşık $886**

İşte Yorick'in bu kurulumu neden seçtiğine dair yorumları:

- _Bazı NUC'larla aynı veya daha düşük maliyettedir_
- _ECC RAM'e sahiptir, bu da bellek başarısız olursa - ki zaman zaman olur - bileceğim anlamına gelir, çünkü sistem bana söyleyecektir. Sorunumun bellekle ilgili olup olmadığını anlamak için 4-5 gün boyunca memtest87 çalıştırmak zorunda değilim. Zamanımı şiddetle koruyorum, böylece donanım sorunlarını gidermek yerine Discord'da konuşarak geçirebilirim_
- _IPMI'ye sahiptir, bu da Ethernet/tarayıcı aracılığıyla UEFI ve güç döngüsü dahil olmak üzere tüm makinenin uzaktan yönetimidir. Uzun bir tatile gitmeme izin verilmeli ve hala tam uzaktan erişime sahip olmalıyım._
- _Yedekli depolama istiyorsam, böylece olası SSD arızası bir olay değildir, bunu yapabilirim_
- _Yapı seçimlerinde büyük esneklik sağlar. Ne kadar RAM ve hesaplama istediğimi seçebilirim; TrueNAS Scale gibi sanallaştırma teknolojisi ile bir NAS çalıştırabilir ve node'u orada diğer ev sunucusu şeyleriyle birlikte çalıştırabilirim._

### Drez'in Dizüstü Bilgisayarı

![](./images/Drez.jpg)

Bazen, yeni donanım için para harcamak mantıklı değildir.
Discord kullanıcısı **Drez**'in durumunda, Rocket Pool node'u çalıştırmak bu zamanlardan biridir.
Drez'in etrafta yedek bir dizüstü bilgisayarı vardı ve onu kolaylıkla bir node'a dönüştürdüler.
Makineleri dört çekirdekli bir i7-4710HQ (2.5 GHz), iki DDR3 yuvası ve bir 2.5" SATA yuvası ile birlikte gelir.
Bir dizüstü bilgisayar olduğu için, kendi piliyle birlikte gelir (bu da UPS ihtiyacını ortadan kaldırır).
Zamanla bazı ek yükseltmeler eklediler, dizüstü bilgisayara ekstra gönül rahatlığı için daha fazla güç verdiler.

Drez'in kurulumu:

- Dizüstü bilgisayar: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Dahil)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Toplam: $1910**

İşte Drez'in bu kurulumu neden seçtiklerine dair yorumları:

_Bu dizüstü bilgisayarda staking yapacağımın ana nedeni, zaten yedek bir taneye sahip olmam ve yeni bir sunucu için ekstra para harcamak zorunda olmamam.
Mobilitesini, kompaktlığını, kolay izleme için yerleşik ekranını seviyorum.
Aşırı ısınma durumunda bir dizüstü bilgisayar soğutma pedi ve her ihtimale karşı yedek bir CPU soğutucusu satın aldım, ayrıca özellikle eski bir makinede çalıştıracaksanız termal macun pastasını değiştirmenizi öneririm_

## NUC'lar (Next Unit of Computing) ve Mini-PC'ler

Rocket Pool node'u çalıştırmak mutlaka kendi kendinize yapın masaüstü gerektirmez.
Aslında, staker'lar arasında en popüler kurulumlardan biri ünlü NUC'tur.
Bir NUC (Next Unit of Computing) esasen çok düşük güç kullanımı ve maksimum verimlilik etrafında tasarlanmış küçük, bağımsız bir bilgisayardır.
NUC'lar, düşük bakımları, düşük aylık çalışma maliyetleri ve kolay kurulumları nedeniyle yalnızca birkaç validator çalıştıran çoğu staker için harikadır.
PC'lerin aksine, NUC'lar bir kasada önceden monte edilmiş olarak gelir; tek yapmanız gereken biraz RAM eklemek, bir SSD eklemek ve çalışır hale gelirsiniz!
Aşağıda, bazı Rocket Pool deneyimli kullanıcılarının kullandığı ve önerdiği birkaç NUC kurulum örneği bulunmaktadır.

::: tip NOT
**Ethernet Adaptör Uyumluluğu**

Intel® NUC 11. veya 12. Nesil satın almayı planlıyorsanız, ethernet adaptörü ile bağlantı sorunlarıyla karşılaşabilirsiniz, özellikle adaptör **I225-LM** olarak tanımlanıyorsa (Satın almadan önce Intel özelliklerini kontrol edin).
Zaten bir tane varsa, bu endişeyi gidermek için atabileceğiniz adımlar vardır.
I225-LM adaptörü, özellikle Linux çekirdeklerini kullanırken **sistem donmalarına** ve beklenmeyen çekirdek davranışına yol açabilecek belirli uyumluluk zorluklarıyla ilişkilendirilmiştir.

NUC'unuzun sorunlu I225-LM ethernet adaptörünü kullanıp kullanmadığını belirlemek için terminalde şu komutu kullanabilirsiniz:

```shell
sudo lshw -class network | grep 225
```

Çıktı I225-LM adaptörünün varlığını doğrularsa, bahsedilen sorunları yaşayabilirsiniz. Ancak, bu sorunları azaltmak için uygulayabileceğiniz _çözümler_ vardır:

**USB-C'den Ethernet Adaptörü**: Uygulanabilir bir çözüm, bir USB-C'den Ethernet adaptörü edinmeyi ve internet kablonuzu bu harici adaptör aracılığıyla bağlamayı içerir. Bu yaklaşım ek donanım ve yapılandırma gerektirse de, uyumluluk çatışmalarını çözmede etkili olduğu kanıtlanmıştır. Bu, I225-LM adaptörüyle ilişkili donma veya çekirdekle ilgili anomalilerle karşılaşmadan en son kullanılabilir Linux çekirdeklerini kullanmanıza olanak tanır.**Zaten I225-LM'ye sahip bir NUC'unuz varsa bu önerilen çözümdür (şimdilik)** _Bir adaptör seçmenin, potansiyel gecikme veya azaltılmış internet hızı açısından bir değiş tokuş getirebileceğini unutmayın. Bu etkiyi azaltmak için, en az 1GB/s taşınabilirliğe sahip bir adaptör seçmeniz tavsiye edilir, böylece optimal veri aktarım hızlarını korumaya yardımcı olur._

**Sürücü ve Yazılım Güncellemeleri**: NUC modeliniz için resmi Intel® destek sayfasına [buradan](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads) başvurarak sürücülerinizi, donanım yazılımınızı ve BIOS'unuzu güncellemeyi düşünün. Bu, Intel web sitesinden en son kullanılabilir destek sürücüsünü kullanmayı veya uyumluluk endişelerini ele alan BIOS güncellemelerini uygulamayı içerebilir.

**Intel'in Yaması (Windows)**: Intel, Windows sistemlerinde benzer bir sorunu ele almak için bir yama yayınladı. Yamanın kendisi **doğrudan Linux ortamlarına uygulanmayabilir**, Intel tarafından sorunun tanınmasını ve çözümler sağlama çabalarını vurgular. Yama hakkında daha fazla ayrıntıyı bu [bağlantıda](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3) bulabilirsiniz.

Teknolojinin geliştiğini ve çözümlerin zamanla değişebileceğini unutmayın. Resmi İndirmeler [sayfalarında](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads) belirli NUC modeliniz için Intel tarafından sağlanan en son kaynaklarla her zaman güncel kalın.

Bu adımları izleyerek, Intel® NUC 11. ve 12. Nesil Ürünlerinde I225-LM ethernet adaptörüyle ilişkili uyumluluk zorluklarını ele alabilir, sunucu dağıtımınızla daha sorunsuz ve daha güvenilir bir deneyim sağlayabilirsiniz. _Bu adaptöre sahip NUC kullanıcılarının bir alt kümesi herhangi bir sorun yaşamadığını bildirmemiş olsa da, özellikle bir çekirdek yükseltmesinden sonra **kullanıcıların çoğunluğunun** sorunlarla karşılaştığını belirtmek önemlidir. Özellikle, 5.15.+ çekirdekleri I225-LM adaptörünü kullananlar için en kararlı seçenek olduğu kanıtlanmıştır. USB-C adaptörü kullanma fikri çekici değilse ve potansiyel rastgele donma riskini almaya istekliyseniz, **daha fazla kararlılık göstermiş bir çekirdek sürümünde kalmanız** tavsiye edilir._
:::

### Ken'in NUC8i5BEK'i

![](./images/Ken.jpg)

NUC8i5BEK, Intel'in 8. nesil işlemcili kendi NUC'larından biridir.
2018'de piyasaya sürülen bu model dört çekirdekli bir i5-8259U CPU (2.30 GHz), iki DDR4 yuvası, SSD'ler için bir M.2 yuvası ve USB 3.1 portları ile birlikte gelir.
Normalde yaklaşık 20 watt çeker, ancak Discord kullanıcısı **Ken** normal doğrulama sırasında onu 9 watt'a optimize edebildi.
Herhangi bir Execution ve herhangi bir Consensus istemcisini işlemeye fazlasıyla yeteneklidir, bu da onu hafif, verimli bir node makinesi için mükemmel bir seçim haline getirir.

Ken'in Kurulumu:

- Temel: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Fansız Kasa (isteğe bağlı): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Toplam: $691 ila $825**

İşte Ken'in bu kurulumu neden seçtiğine dair yorumları:

- _Küçük boyut ve ayak izi, güç kaynağı güç kablosunda bir tuğla (dizüstü bilgisayar gibi), tek kartlı bilgisayar, x86 mimarisi, düşük satın alma fiyatı noktası, düşük güç tüketimi (~10W), 3 yıllık garanti ve aktif bir üretim ürün hattı (Intel)._
- _8. nesiller fazlasıyla hızlı ve en son nesil yongalardan daha düşük bir fiyat noktasındadır._
- _Fansız (pasif soğutmalı) bir kasaya yükselttim, böylece NUC kesinlikle sessizdir (0 dB) çünkü onu ev ofisimde bırakıyorum (stok bir NUC zaten neredeyse sessizdir)._
- _Ayrıca fan yataklarında mekanik aşınma yoktur._
- _RP node'um olarak bu donanım platformunu emekliye ayırmaya karar verirsem yeniden satış veya yeniden kullanım değeri - NUC'lar harika bir iş istasyonu bilgisayarı yapar._

### GreyWizard'ın NUC10i7FNH'si

![](./images/GreyWizard.jpg)

NUC10i7FNH, Intel'in kendi NUC'larından bir diğeridir.
Bu, 10. nesil bir işlemciye sahiptir ve 2019'da piyasaya sürülmüştür.
Altı çekirdekli bir i7-10710U CPU (1.10 GHz, 4.7 GHz'e yükselir), iki DDR4 yuvası, SSD'ler için bir M.2 yuvası ve bir 2.5" yuvası ve USB 3.1 portları ile birlikte gelir.
Yaklaşık 20 watt güç çeker.
Güç tüketimi ve boyutuna göre inanılmaz derecede güçlü bir makinedir.
Discord kullanıcısı **GreyWizard** bu NUC'u node'u için kullanır - ekstra güç, Ethereum 2.0 zincirinin geleceği ne olursa olsun, makinesinin bununla başa çıkabileceğini bilerek gönül rahatlığı sağlar.

GreyWizard'ın Kurulumu:

- Temel: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154'er)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Toplam: $1068**

İşte GreyWizard'ın bu kurulumu neden seçtiğine dair yorumları:

_i7 NUC ile gittim çünkü genel boyut ve genel gidere göre olağanüstü performansın en iyi kombinasyonu gibi hissettim.
Ayrıca Micro ATX boyutunda bir makine oluşturmak gibi diğer seçeneklere de baktım.
Aradığım özelliklere sahip birini fiyatlandırdıktan sonra, bu Intel NUC yaklaşık aynı fiyatta çıktı ve form faktörü gerçekten yenilmesi zor.
Performans/gönül rahatlığı için ekstra boşluğa sahip olmayı seviyorum ve bunun neredeyse kesinlikle aşırı olduğunu kabul ediyorum.
Staking'i ciddi bir yatırım olarak görüyorum ve donanımımın yeterli olup olmayacağını merak etmek istemiyorum._

_Bunu bir seçenek olarak düşünen diğer insanlar için ipuçları..._

- _NUC oldukça sıcak çalışır, bir dizüstü bilgisayara benzer sıcaklıklar. CPU sıcaklığı konusunda endişeleniyorsanız ve güçlü bir şey istiyorsanız, Micro ATX gibi küçük masaüstü kurulumlarına bakmalısınız._
- _NUC'unuzun etrafında hava akışı için bol yer olduğundan emin olmak isteyeceksiniz. Toz birikmesini önlemek için alanı düzenli olarak temizlemeyi planlayın._
- _RAM kartlarınız için uyumluluğu kontrol ettiğinizden emin olun. Farklı NUC'lar toplam RAM, RAM hızları vb. değişen derecelerde destekler._
- _NUC ile gidiyorsanız, RAM seçerken kendinize büyüme alanı vermenizi öneririm... Örneğin, biraz ekstra harcayın ve istediğinizde (bu örnekte NUC'unuzun 64gb destekleyeceğini varsayarak) daha sonra genişletebilmeniz için 2x16 yerine tek bir 32gb RAM kartı alın_
- _Tartışmak isterseniz Discord'da benimle iletişime geçmekten çekinmeyin._

### ArtDemocrat'ın NUC10i5FNHN Yapım Süreci Videosu

Greywizard'ın kurulum açıklamalarını ve ipuçlarını tamamlamak için, ArtDemocrat bir NUC10 kurmak için ek bir yardım kaynağı olarak bu yapım süreci videosunu oluşturdu (bu durumda bir NUC10i5FNHN, ancak yapım süreci bir NUC10i7FNH için benzer olmalıdır):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat'ın Kurulumu:

- Temel: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17'nin PN50'si

![](./images/PN50-actioncj17.jpg)

ASUS PN50, Intel'in NUC ailesiyle çok ortak noktası olan bir mini-PC'dir.
Çok küçük bir form faktörüne sahiptir, ancak tam bir PC'nin tüm bileşenlerine ve özelliklerine sahiptir.
AMD CPU seçiminizle birlikte gelir, böylece performans ve maliyet arasında denge kurabilirsiniz (8 çekirdekli bir Ryzen R7-4700U 2.0 GHz'e kadar), iki DDR4 yuvası, SSD'ler için bir M.2 yuvası ve bir 2.5" yuvası ve USB 3.1 portları.
Ayrıca 90 watt'lık bir güç kaynağıyla birlikte gelir, ancak pratikte Rocket Pool node'u olarak hareket ederken bu kadar güç gerektirmez.
Discord kullanıcısı **actioncj17** birkaç farklı kurulum denedi, ancak PN50'yi her şeyin üzerinde tercih eder... ancak Rocket Pool node'u çalıştırmak için aşırı olduğunu mutlu bir şekilde kabul ederler.

Actioncj17'nin Kurulumu:

- Temel: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Toplam: $1118**

İşte actioncj17'nin bu kurulumu neden seçtiklerine dair yorumları:

_Asus PN50'yi neden seçtiğime dair cevabım oldukça basit.
AMD'nin Ryzen 7 4700U'sunun ne kadar harika olduğunu görmek istedim.
Diyelim ki hayal kırıklığına uğramadım.
Aslında Intel NUC10FNK ile başladım.
NUC'a 32gb ram ve 1tb 970 evo plus nvme m.2 koydum ve hızla çalışıyor.
NUC ile ilgili herhangi bir şikayetim yok ve iyi çalışıyor ama PN50'mden daha fazlasını alıyorum.
Rocketpool'da staking yapmak için her iki kurulumun da aşırı olduğunu söyleyebilirim, ancak biraz gelecek korumalı olmak zarar vermez.
Her ikisi de küçük ayak izlerine sahip ve nuc aslında fansız olduğu için çok daha sessiz.
Sonuç olarak PN50, elinize geçirebilirseniz paranızın karşılığını daha iyi verir._

### Moralcompass'ın Mini-PC'si

![](./images/moralcompass-minipc.jpg)

Discord kullanıcısı **moralcompass**, actioncj17'ye benzer bir rotaya gitti ve bir mini-PC seçti, ancak tercihi Intel CPU içindi.
Dört çekirdekli bir i5 8250U (1.6 GHz, 3.4 GHz'e kadar yükselir), bir DDR4 yuvası, SSD'ler için bir M.2 yuvası ve bir 2.5" yuvası ve USB 3.0 portları olan bir mini PC kullanırlar.
Moralcompass, duvardan sadece yaklaşık 10 watt çektiğini iddia eder, bu da bunun gibi mini PC'lerin çok verimli olduğunu gösterir.
Bu seçimle ilgili ilginç olan şey, tamamen pasif soğutmalı olmasıdır - fan bulunamaz!
Fansız mini PC'lerin birçok varyasyonu olsa da, moralcompass kendileri için işe yarayan birini buldu ve ona bağlı kaldı.

Moralcompass'ın Kurulumu:

- Temel: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Toplam: $655**

İşte moralcompass'ın bu kurulumu neden seçtiğine dair yorumları:

- _Hareketli parça yok, gürültü yok._
- _Çift intel NIC (bir gün bunu yönlendiricim olarak yeniden kullanmaya karar verirsem diye)_
- _NVME + SATA yuvaları (hız ve daha yüksek TBW dayanıklılığına sahip seçenekler için NVME'yi tercih ederim. SATA, HDD veya SSD seçeneği sunar. M.SATA arayüzlerinden kaçındım çünkü bu SSD'ler eski hale geliyor gibi görünüyor)_
- _UPS'den zarif kapatma sinyali için USB ve seri portlar mevcuttur_
