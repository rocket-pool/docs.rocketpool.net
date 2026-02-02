# Rocket Pool Oracle DAO

::: warning NOT
Bu dokümantasyon yalnızca Rocket Pool'un Oracle DAO üyeleri için geçerlidir.
Oracle DAO'ya açıkça davet edilmediyseniz ve sadece normal bir Rocket Pool node'u çalıştırmayı planlıyorsanız, kılavuzun bu bölümü sizin için geçerli değildir.
Güvenle görmezden gelebilirsiniz, ancak ilgileniyorsanız okumakta özgürsünüz.
:::

**Oracle DAO**, protokol tarafından gerektirilen ancak teknik sınırlamalar nedeniyle Akıllı Sözleşmeler tarafından gerçekleştirilemeyen idari görevlerden sorumlu olan özel Rocket Pool node'larının grubudur.
Bunlar esasen normal Rocket Pool node'ları ile aynıdır; aynı araçları kullanırlar, aynı yöntemlerle yapılandırılabilirler ve hatta normal minipool'lar çalıştırabilirler, ancak gerçekleştirdikleri ek görevlerle birlikte gelirler.
Bu, aşağıdakiler gibi şeyleri içerir:

- Validatör durumu ve bakiyeleri dahil olmak üzere Beacon Chain'den Execution Layer'a bilgi taşıma
- Minipool'ların zaten kullanımda olmayan validatör açık anahtarları kullanılarak oluşturulmasını ve protokolün onları güvenle finanse edebilmesi için [uygun çekim kimlik bilgilerine sahip olmalarını](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit) sağlama
- Her ödül periyodunun sonunda ödül Merkle ağacını oluşturma ve diğer node operatörlerinin erişimi için IPFS'ye yükleme
- Rocket Pool'un [ücret alıcısı gereksinimlerine](../node-staking/mev.mdx) uygunluk için teklifleri izleme
- Parametreleri değiştirme ve sözleşme yükseltmelerini onaylama dahil olmak üzere çekirdek protokolde değişiklikler önermek ve oylamak
- Diğer Oracle DAO üyelerini davet etme ve kaldırma dahil olmak üzere Oracle DAO kadrosunda değişiklikler önermek ve oylamak

Bu görevleri yerine getirmenin ödülü olarak, Oracle DAO toplu olarak her ödül periyodunda üretilen toplam RPL enflasyonunun [küçük bir yüzdesini](https://rpips.rocketpool.net/RPIPs/RPIP-25) alır ve üyeleri arasında eşit şekilde paylaşır.

Herkes tarafından izinsiz olarak oluşturulabilen ve çalıştırılabilen normal Rocket Pool node'larının aksine, Oracle DAO'ya üyelik mevcut üyeler tarafından **yalnızca davetiye ile** gerçekleşir.
Yakın zamanda Oracle DAO'ya katılmaya davet edildiyseniz, kılavuzun bu bölümü rolünüzü anlamanıza, node'unuzu kurmanıza ve sağlıklı kalmasını sağlamanıza yardımcı olacaktır.

## Gereksinimler

Bir Oracle DAO node'u çalıştırmak için aşağıdakilere ihtiyacınız olacaktır:

- Bir **Execution Client'ın RPC endpoint'ine** erişim. Bu, çoğu Rocket Pool node'unda olduğu gibi yerel olarak çalıştırılan bir istemci olabilir veya sizin veya kuruluşunuzun bağımsız olarak sürdürdüğü harici istemcilere bağlanabilir.
- Bir **Arşiv Modu Execution Client'a** erişim, bu ya birincil istemciniz ya da ek (yedek) bir istemci olarak işlev görebilir. Yalnızca görevlerinizin Execution Client'ınızdan temizlenmiş bir Execution Layer durumunu geri çağırmasını gerektiren nadir durumlarda kullanılacaktır. Bununla birlikte, bu dönemlerde görevlerinizin başarıyla yerine getirilebilmesini sağlamak için bir Arşiv Node'a erişiminizin olması **kritiktir**.
  - Bunun için yerinde bir arşiv node'u kullanmanızı **şiddetle** öneririz, çünkü [Infura](https://infura.io/pricing) veya [Alchemy](https://www.alchemy.com/pricing) gibi hizmetler, ödül ağacını oluşturma gibi kritik dönemlerde taleple başa çıkmakta bazı zorluklar göstermiştir.
- Bir **Arşiv Modu Beacon Node'unun REST API endpoint'ine** (HTTP üzerinden) erişim. Bu, çoğu Rocket Pool node'unda olduğu gibi yerel olarak çalıştırılan bir istemci olabilir veya sizin veya kuruluşunuzun bağımsız olarak sürdürdüğü harici istemcilere bağlanabilir.
- Standart Smartnode CLI.
- Smartnode daemon'u `watchtower` modunda yapılandırılmış ve çalışıyor (bu, tüm kullanıcılar için standart Smartnode paketi ile birlikte gelir, ancak yalnızca Oracle DAO node'ları için aktif olarak görevleri yerine getirir).
  - Bu bir Docker konteynerinde (standart kurulum) veya basit bir `systemd` hizmeti ("Native" modu) olarak çalıştırılabilir.
- Görevlerinizin gaz maliyetlerini ödemek için yeterli ETH (daha sonra tartışılacaktır).

::: warning NOT
Eğer yerinde bir arşiv node'u çalıştıramıyorsanız ve üçüncü taraf bir hizmete _güvenmek zorundaysanız_, aşağıdakileri göz önünde bulundurun:

Arşiv Modu yedekleme için **Infura** kullanmayı planlıyorsanız, en azından **Team** planına sahip olmalısınız.
Ücretsiz katman ve Developer katmanı yeterli değildir.

**Alchemy** kullanmayı planlıyorsanız, en azından **Growth** planına sahip olmalısınız.
Ücretsiz katman yeterli değildir.
:::

## Faaliyetler

Oracle DAO görevleri iki bölüme ayrılır.

1. **Otomatik görevler**: bunlar, Consensus Layer'dan Execution Layer'a bilgi taşıma, protokolün çeşitli yönlerini zincir dışı hesaplama ve bunları Akıllı Sözleşmelere güncellemeler olarak gönderme gibi rutin Rocket Pool operasyonuyla ilgili görevlerdir. Bunların her biri, Execution ve Consensus Client'larınız ve `watchtower` daemon'unuz normal şekilde çalıştığı sürece `watchtower` daemon süreci tarafından otomatik olarak gerçekleştirilir ve manuel müdahale gerektirmez.
2. **Manuel görevler**: bunlar, kendi karar vermenizi ve gerçekleştirmek için Oracle DAO'nun geri kalanıyla bant dışı iletişimi gerektiren görevlerdir. Bunlar, sözleşme yükseltmelerine oy verme, parametreleri değiştirme ve Oracle DAO'dan üyeleri davet etme veya çıkarma gibi şeyleri içerir. Bunların hepsi standart Smartnode CLI aracılığıyla yapılabilir.

Oracle DAO node'unuzu nasıl kuracağınızı öğrenmek için sonraki bölümü okuyun.
