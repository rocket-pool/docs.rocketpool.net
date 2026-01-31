# Node Gereksinimleri ve Platform Seçimi

Pekala!
Yani bir Rocket Pool node'u çalıştırmayı denemeye karar verdiniz.
Sürecin ilk adımı, node'unuzu hangi tür bir platformda çalıştırmak istediğinize karar vermektir.
Aklınızda zaten bir tane varsa, harika!
Bir sonraki bölüme geçebilirsiniz.
Henüz emin değilseniz, seçenekleriniz hakkında bazı bilgiler için okumaya devam edin.

## Tam Node Gereksinimleri

Bir **tam node**, Rocket Pool stack'i ile birlikte hem bir Execution Client hem de Consensus Client çalıştıran bir node'dur.
Merge gerçekleştiğine göre, Rocket Pool node'larının bu konfigürasyonu çalıştırması gerekir (ancak Execution ve Consensus clientlar zaten bir solo-staking kurulumu çalıştıran kullanıcılar için harici olarak yönetilebilir - bunu daha sonra daha ayrıntılı olarak ele alacağız).

Tam bir Rocket Pool node'unu iyi çalıştırmak için neyin gerekli olduğuna dair basit bir özet:

- **Kararlı bir İnternet bağlantısı**. Ne kadar uzun süre çevrimiçi kalırsanız, ödülleriniz o kadar iyi olur. Kesintili bir İnternet bağlantısı getirilerinize zarar verir ve buna bağlı olarak rETH oran büyümesine.
- En az **10Mbps yukarı ve aşağı bant genişliği**. Tam bir node, konfigürasyonunuza ve minipool sayınıza bağlı olarak genellikle yaklaşık 8Mbps ila 10Mbps yukarı ve aşağı ağ trafiği alır.
- İnternet servis sağlayıcınız tarafından uygulanan **veri limiti yok**. Tam bir node çalıştırmak çok fazla veri alacaktır - yalnızca zincir verisi için ayda 2 TB'nin üzerinde raporlar gördük. Bu, ETH clientlarına birkaç ayar ayarlamasıyla bir miktar azaltılabilir, ancak genel bir kural olarak, İnternet planınız aylık bir veri sınırıyla geliyorsa tam bir node çalıştırmayın.
- **Kararlı elektrik**. Kararlı bir İnternet bağlantısına ihtiyaç duyulmasıyla aynı nedenle, güvenilir güce de sahip olmak istersiniz. Bu, kısa elektrik kesintileriyle başa çıkmak için büyük bir UPS (yedek pil) ile azaltılabilir.
- Yeterli özelliklere sahip bir **bilgisayar**. Bu oldukça esnektir çünkü _gerçekten_ hangi Execution ve Consensus client kullandığınıza ve bunları hangi ayarlarla yapılandırdığınıza bağlıdır. Bilgisayar yerel bir makine olabilir veya bulutta barındırılabilir. Bu iki seçenek hakkında daha fazla bilgi ve sizin için en iyisine nasıl karar vereceğiniz için aşağıyı okuyun.

Bilgisayar [donanım yönergelerini](./local/hardware.md) karşılamalıdır

::: warning NOT
Şu anda yalnızca **Linux** ve **macOS** platformları desteklenmektedir.
**Windows şu anda Smartnode işletimi için desteklenmemektedir**.
:::

## Yerel Bir Node Çalıştırma

Güvenilir elektriğiniz ve limitsiz İnternet erişiminiz varsa ve bir bilgisayar oluşturmaya (veya hazır satın almaya) ve bakımını yapmaya istekliyseniz, yerel bir node çalıştırmak sizin için harika bir seçim olabilir. Bu seçenekle, Rocket Pool node'u olarak özel bir bilgisayar kuracak ve onu kendi evinizde yerel olarak çalıştıracaksınız.

Avantajlar:

- Hizmetler dışında aylık ücret yok
- Kendi makineniz ve verileri (cüzdanınızın anahtarı dahil) üzerinde tam kontrol
- İstediğiniz zaman bakım ve yükseltme gerçekleştirme erişimi
- Execution ve Consensus'ün ve Rocket Pool'un merkeziyetsizliğine katkıda bulunur (ve dolayısıyla güvenliklerine)

Dezavantajlar:

- Kararlı, limitsiz İnternet ve elektrik gerektirir
  - **Bir node çalıştırmak ayda en az 1.5 TB veri kullanır. Bu miktarın altında bir veri sınırınız varsa, yerel bir node çalıştırırken sorunlarla karşılaşabilirsiniz!**
- Ağ ve bilgisayar güvenliğinden yalnızca siz sorumlusunuz
- Bilgisayar bakımı konusunda deneyimli değilseniz zorlayıcı olabilir
- Hırsızlığa karşı savunmasız

Avantajlar dezavantajlardan daha ağır basıyor gibi geliyorsa, [Yerel Node Operator Kılavuzumuza](./local/hardware.html) göz atın.

## Bir Sunucuda Çalıştırma

Güvenilir limitsiz bir İnternet planınız yoksa veya kendi fiziksel bilgisayarınızı oluşturup bakımını yapmakla uğraşmak istemiyorsanız, bir barındırma sağlayıcısından kiraladığınız özel bir sunucu çalıştırmaya bakmak isteyebilirsiniz. Esasen, bu şirketler sizin için aylık bir ücret karşılığında mutlulukla bir sunucu oluşturacak ve çalıştıracaktır. Bu ücretten rahatsız değilseniz ve bir Rocket Pool node'u çalıştırmak istiyorsanız, bir sunucu kullanmak iyi bir strateji olabilir.

Avantajlar:

- Bakım yok, sorunları düzeltmek için genellikle destek mevcuttur
- İnternet planınızı veya veri sınırınızı etkilemez
- Genellikle profesyonel bir veri merkezinde çalıştırılır, çok az kesinti süresi
- Kendi bilgisayarınızı satın almaktan / oluşturmaktan daha uygun maliyetli olabilir

Dezavantajlar:

- Execution ve Consensus'ü ve Rocket Pool'u biraz daha merkezileştirir, bu da ağların güvenliğini zayıflatır
- Aylık ücretler
- Sunucular veri sınırlarıyla gelebilir veya pahalı ağ I/O oranlarına sahip olabilir
- Barındırıcıların makinenizin içeriğini incelemesi ve güvenli değilse cüzdanınızın anahtarını alması mümkündür

Bu avantajlar dezavantajlardan daha ağır basıyor gibi geliyorsa, [Sunucu Node Operator Kılavuzumuza](./vps/providers.html) göz atın.
