---
next:
  text: The Protocol DAO
  link: "/tr/legacy/houston/pdao"
---

# Houston Yükseltmesi

Houston yükseltmesi büyük ölçüde protokolü yönetmek için Protocol DAO veya pDAO olarak bilinen tamamen zincir üstü bir DAO'yu tanıtmayı amaçlamaktadır. Benzersiz bir DAO'dur ve çalışması için snapshot oylaması veya başka herhangi bir 3. parti araca ihtiyaç duymaz, gerçekten zincir üstündedir ve türünün tek örneğidir, bununla ilgili daha fazlası aşağıda.

Bu yükseltme aynı zamanda protokol üzerine yeni entegrasyonların ve platformların oluşturulmasına olanak tanıyacak çok heyecan verici diğer özellikleri de tanıtacaktır. Bunlardan bazıları, node adına ETH stake etme yeteneğini (sadece node'un kendisinden değil) ve bir tarafın staking için ETH sağlamasına, diğer tarafın ise node operatörüne velayet vermeden RPL sağlamasına olanak tanıyan yeni bir RPL çekim adresi özelliğini içerir.

## Protocol DAO

Rocket Pool Protocol DAO (pDAO), protokolün yönünü şekillendirmekten sorumludur ve RPL yönetişimi tarafından yürütülür. Üyeleri ve oy güçleri, büyük ve küçük, hepsi doğrudan protokole katılan node operatörlerinden oluşur.

Genellikle daha geniş kripto alanında DAO yönetişimi token ağırlıklı oylama ile yapılır. Temel olarak, bir protokol/proje için ne kadar çok token tutarsanız, oy gücünüz o kadar büyük olur. Ayrıca protokole aktif olarak katılmanıza gerek yoktur, sadece token'ları tutmak yeterlidir.

Bu yönetişim tarzından kaçınmak istedik. Rocket Pool'un geleceğini yönlendirmek ve kılavuzluk etmek istiyorsanız, aktif olarak dahil olmanız gerekir, sadece soğuk cüzdanda token saklamak değil. En büyük Venture Capital fonlarından tek bir minipool çalıştıran sıradan adama kadar, onu yönetmek için protokole aktif olarak katılmanız gerekecek.

Şu anda protocol DAO, protokolde kullanılan çeşitli zincir üstü ayarlar üzerinde kontrole sahiptir. Rocket Pool içindeki bu Node Operatörleri tarafından yeni Rocket Pool Improvement Proposals (RPIP) yapılabilir ve oylanabilir. [**Mevcut RPIP kayıt defterini buradan görebilirsiniz**](https://rpips.rocketpool.net/). Detaylara düşkünseniz, şu anda bahsedilen zincir üstü protocol DAO için mevcut RPIP burada bulunabilir.

### pDAO ne yapabilir?

pDAO, protokolün birçok ayarı üzerinde kontrole sahiptir, hazine fonlarını harcayabilir ve Houston yükseltmemizde, protokoldeki herhangi bir potansiyel soruna hızlı yanıt vermek için yeni bir güvenlik konseyi ile birlikte gelir. Her birinden aşağıda biraz daha bahsedelim.

**Protokol Parametreleri:** Bunlar, rETH için yatırılabilecek minimum ETH miktarını kontrol eden ayar (şu anda 0.01 ETH) veya hatta deposit havuzunun maksimum boyutunu kontrol etme gibi protokolün belirli yönlerini kontrol eder; bu, node operatörlerine staking için atanmayı beklerken protokole yatırılabilecek maksimum ETH miktarıdır. [Bu ayarların tam tablosunu buradan bulabilirsiniz](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Hazine Fonları:** RPL'nin %5 enflasyon oranı vardır ve bunun bir kısmı pDAO hazinesine tahsis edilir. pDAO, bu hazineyi protokol odaklı çeşitli girişimlere harcama yeteneğine sahiptir; protokolün doğrudan geliştirilmesinin fonlanmasından, Rocket Pool'u kullanan 3. parti iyileştirmeleri ve projeleri fonlayan hibe yönetimine kadar. Houston yükseltmemiz, hazineden yapılan bu ödemelerin sadece toplu olarak değil, aynı zamanda devam eden fonlamaya ilişkin hedefleri takip etmeye yardımcı olmak için aşamalı olarak yapılabileceği yeni bir yetenek ekler.

**Güvenlik Konseyi:** Houston yükseltmesi pDAO'yu tamamen zincir üstü bir sisteme taşırken, [güvenlik konseyi](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council) şeklinde yeni bir güvenlik önlemi tanıtıldı. Bu üyeler pDAO tarafından seçilebilir ve herhangi bir potansiyel sorun meydana geldiğinde protokolü hızlı bir şekilde duraklatma yeteneğine sahiptirler. Herhangi bir güvenlik yanıtının yürütülmesi için üyeler arasında yeter sayı sağlanmalıdır. pDAO, gerekirse üyeleri kaldırma veya güvenlik konseyini tamamen feshetme yetkisine de sahiptir.

### Öneriler ve Oylama

Herhangi bir yönetişim sisteminin çalışması için öneriler ve oylamalar olması gerekir. Şu anda, bu ayarlar ve öneri değişiklikleri için snapshot oylaması kullanılıyor, ardından değişiklikleri yürütmek için bazı manuel müdahaleler gerekiyor. [Houston yükseltmesi ve RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33)'ün tanıtılmasıyla bu, herhangi bir node operatörünün herhangi bir 3. parti araca ihtiyaç duymadan doğrudan zincir üstünde öneriler oluşturmasına, oynamasına veya itiraz etmesine olanak tanıyan yeni bir iyimser hile kanıtı sistemine taşınıyor.

**Öneri Oluşturma:** Sıfır olmayan oy gücüne sahip herhangi bir node istediği zaman bir öneri oluşturabilir. Bunu yaparken tüm öneri süreci boyunca RPL şeklinde bir öneri teminatı kilitlemelidir.

**İtiraz Etme:** Bir öneri oluşturan node'un bunu gerekli yanlış verilerle yaptığı bulunursa, itiraz edilebilir ve itiraz eden kişi itiraz için bir teminat sağlamalıdır. İtirazı yapan node, başarılı olursa öneriyi oluştururken yapılan önerici teminatıyla ödüllendirilebilir, ancak geçersiz bir itiraz yaptıysa, önerici onların itiraz teminatını toplayabilir.

**Oylama**: Bir öneri, itiraz edilebileceği dönemi geçerse, oylama dönemlerine girer. Node operatörleri daha sonra aşağıdaki şekillerde oy kullanmayı seçebilirler:

1. Çekimser: Oylayanın oy gücü yeter sayıya katkıda bulunur ancak önerinin ne lehinde ne de aleyhindedir.
2. Lehte: Oylayan, önerinin yürütülmesi lehinde oy kullanır.
3. Aleyhte: Oylayan, önerinin yürütülmesine karşı oy kullanır.
4. Veto: Oylayan, öneriye karşı oy kullanır ve ayrıca öneriyi spam veya kötü niyetli olarak değerlendirdiğini belirtir. Veto yeter sayısı karşılanırsa, öneri hemen yenilir ve önerici teminatını kaybeder. Bu, spam, düşük kaliteli önerileri veya snapshot oylaması gibi zincir dışı süreçlerden önce geçmemiş önerileri caydırmak içindir.

**İki oylama dönemi** vardır:

- Oylama Dönemi 1: Oylayanlar veya başkaları adına oy kullanan delegeler için.
- Oylama Dönemi 2: Güçlerini delege eden ve delegelerinin kararını değiştirmek isteyen oylayanlar için.

Her iki oylama dönemi de geçtikten ve öneri başarılı olduktan sonra, öneri yürütülebilir ve değişiklik Rocket Pool protokolüne uygulanır.

Öneri oylama dönemlerini geçtikten sonra, öneri bir itirazla yenilmediyse veya veto edilmediyse, önerici RPL teminatını açabilir.

## Node adına ETH Stake Etme

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32), bir hesabın protokole kayıtlı bir Rocket Pool node'u [adına ETH stake etmesine](../houston/stake-eth-on-behalf.mdx) izin verir. Bu, node operatörünün doğrudan ETH sağlamadığı çeşitli durumları destekler:

- Node operatörleri için gelişmiş güvenlik, doğrudan donanım cüzdanlarından stake edebilirler, önceden node'a fon transfer etme ihtiyacını ortadan kaldırır.
- Fonların güvenilir bir veli tarafından yönetildiği Staking as a Service sağlayıcıları.
- Fonların akıllı sözleşmeler tarafından yönetildiği protokol entegrasyonları.
- Fonların bir hazine tarafından yönetildiği DAO'lar veya organizasyonlar.

Bu özelliğin birincil amacı tek yatırımcı senaryolarını kolaylaştırmak olsa da, birden fazla bağımsız yatırımcının da üzerine katmanlı akıllı sözleşmeler oluşturarak bu yeteneği kullanabileceğini belirtmek gerekir. Rocket Pool ayrıca önceki Atlas sürümümüzde adına RPL stake etme yeteneğini de tanıttı.

## RPL Çekim Adresi

Rocket Pool şu anda node operatörlerinin ETH ve RPL için bir çekim adresi belirtmelerine izin veriyor. Bu harici bir donanım cüzdanı veya benzer şekilde güvenli bir şey olabilir.

[RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31) ile ETH için bir çekim adresi ve isterseniz [RPL için yeni bir tane](../houston/rpl-withdrawal-address) belirleyebilirsiniz. Ayarlanmışsa RPL çekim adresi, enflasyon ödüllerinden RPL tetikleme ve talep etme yeteneğine sahip olacak ve ETH konsensüs ödülleri veya ETH ile ilgili hiçbir şey üzerinde etkisi olmayacaktır.

Bu, RPL'ye maruz kalmak istemeyen bir node operatörüne bir varlık tarafından RPL sağlanabileceği ilginç fırsatlar yaratır. Bu varlık daha sonra node için gerekli sigorta teminatını koyduğu için RPL ödülleri talep edebilir.

## Zaman Tabanlı Balance ve RPL Fiyat Gönderimleri

Rocket Pool node'larının ödüller için uygun olması için en az %10 teminatın RPL olarak stake edilmesi gerekir; "etkili stake"leri, her ödül aralığının sonunda Oracle DAO tarafından bildirilen ETH:RPL oranına göre hesaplanır. Daha önce, bu "dolum penceresi" (son RPL raporu ile aralığın sonu arasındaki süre) bir miktar belirsizliğe sahipti ve aralıktan aralığa dalgalanıyordu çünkü blok sayısıyla belirleniyordu. Bu, merge öncesi geçerliydi ancak blokların eklenme şeklindeki değişkenlik ve rastgeleliği faktörlemiyordu.

Bunu ele almak için fiyat ve balance raporlaması için aralıklar artık bloklar yerine saniyelere dayalı olacak. Bu değişiklik öngörülebilirliği sağlar ve bugün ödül aralıklarının hesaplanma şekliyle parite sağlar. Aralık `86400` saniyeye (bir gündeki saniye sayısı) ayarlanırsa, fiyatlar ve bakiyeler her gün aynı saatte bildirilir.

Protokol artık sabit ve kontrol edilebilir bir "dolum penceresine" sahip, tahmin yürütmeyi kaldırır ve kullanıcılara son fiyat güncellemesinden sonra dolum yapmak için tutarlı bir 24 saatlik pencere sağlar. Bu değişiklik hakkında daha fazla bilgiyi [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35)'te okumaktan çekinmeyin.

## Denetimler

Houston Yükseltmesi için hazırlık olarak, Rocket Pool Ethereum ekosistemindeki en saygın denetim ekiplerinden üçüyle çalıştı.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Kasım Sonu - Aralık Ortası 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Kasım Sonu 2023, ardından ikinci bir tur Mart 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Ocak Ortası - Nisan 2024)

Denetimlerin tam geçmişi ve Immunefi hata ödülü programının ayrıntıları için buraya bakın:
https://rocketpool.net/protocol/security
