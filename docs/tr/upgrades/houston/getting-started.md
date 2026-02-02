# Houston Hızlı Başlangıç

İster deneyimli bir Node Operatörü, rETH sahibi veya meraklı bir gözlemci olun, bu sayfa Houston'da yer alan yeni özellikleri keşfetmeye başlamanıza yardımcı olacaktır.

##

### Oy Gücünü Başlatma

Her şeyden önce, **Node Operatörüyseniz** en önemli adım, oy gücünüzü açmak için [oylama başlatmaktır](../houston/participate#initializing-voting). Oylamayı başlatan node'lar, ağın toplam oy gücü hesaplanırken dahil edilir.

Houston'un başlangıcında, yeterli sayıda node oylamayı başlatana kadar pDAO oylaması devre dışı bırakılmıştır. Bu, toplam oy gücü ve yeter sayı düşükken hileli tekliflerin geçmesini önlemek içindir. Yeterli sayıda node oylamayı başlattıktan sonra, bir anahtar çevrilecek ve pDAO dümeni ele alacaktır.

Oy gücünü başlatmak için smartnode'da bu komutu kullanın:

```shell
rocketpool pdao initialize-voting
```

Bunu yalnızca bir kez yapmanız gerekir. Oylamayı başlatmak, node'unuzun oy gücünün gelecekteki zincir içi tekliflere dahil edilmesini ve bunlara oy kullanmanıza izin vermesini sağlayacaktır.

### Snapshot Sinyal Adresinizi Ayarlama

İkinci olarak, snapshot sinyal adresinizi ayarlamak isteyeceksiniz. Bu, node operatörlerinin node anahtarlarını sıcak bir cüzdana maruz bırakmak zorunda kalmadan tarayıcılarında veya mobil cihazlarında Snapshot oylarına katılmalarına olanak tanır.

Bunu kurmak birkaç adım içerir, bu nedenle bu kılavuzu takip etmek isteyeceksiniz:
[Snapshot Sinyal Adresinizi Ayarlama](../houston/participate#setting-your-snapshot-signalling-address).

### Zincir İçi Oy Gücünü Devretme

Seçtiğiniz bir topluluk üyesine zincir içi oy gücünü devretmek istiyorsanız, nasıl yapılacağını öğrenmek için [buraya](../houston/participate#delegating-voting-power) tıklayın.

##

# Kılavuzlar

[Tam Houston Genel Bakış](../houston/whats-new), tamamen zincir içi Protocol DAO'yu sunar ve bir node adına ETH stake etme, RPL çekim adresi ayarlama ve zaman tabanlı bakiye ve RPL gönderimleri gibi yeni özellikleri tanıtır. Houston akıllı sözleşme denetimlerini de burada bulabilirsiniz.

[Protocol DAO](../houston/pdao), pDAO'nun Rocket Pool'u kimin ve nasıl yönettiğini tartışır. Bu sayfa, hazine harcamaları gibi pDAO görevlerinin zincir içinde nasıl yürütülebileceği ve yepyeni Güvenlik Konseyi'nin rolü hakkında sizi bilgilendirecektir. Ayrıca bir pDAO teklifinin yaşam döngüsünü size anlatacak ve spam'i önlemek ve kötü amaçlı teklifleri düşürmek için alınan bazı önlemleri açıklayacaktır.

[Tekliflere Katılım](../houston/participate), Node Operatörlerinin pDAO tekliflerine nasıl katılabileceği konusunda ayrıntılı adım adım bir kılavuz içerir. Zincir içi bir teklif vermek, oy kullanmak veya oy gücünü devretmek istiyorsanız, bu sizin için kılavuzdur.

[Node Adına Eth Stake Etme](../houston/stake-eth-on-behalf.mdx), bir node adına ETH stake etme adımlarını ele alır. Bu, Houston'da tek yatırımcı senaryolarını kolaylaştırmak için tanıtılan yeni bir özelliktir. Mainnet'te gerçek ETH stake etmeden önce denemek isterseniz, bunu bir testnet'te nasıl yapacağınızı anlatacağız.

[RPL Çekim Adresi](../houston/rpl-withdrawal-address), node'unuz için bir RPL çekim adresinin nasıl ayarlanacağını gösterir. Bu, ayrı bir varlığın bir node için RPL sigorta teminatını sağlamasını etkinleştirmek istiyorsanız kullanışlıdır.
