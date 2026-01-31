---
next:
  text: Protocol DAO
  link: "/tr/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Genel Bakış

Bu bölüm, node'unuzu zincir üstü ve snapshot önerilere katılım için ayarlama sürecini özetlemektedir. Açılacak çok şey var, bu nedenle [Houston Yükseltmesi](/tr/legacy/houston/whats-new) hakkındaki genel bakışı okumanızı önemle tavsiye ediyoruz. Bu, zincir üstü yönetişimi etkinleştiren en son özellikleri ve protokolü şekillendirmeye nasıl katılabileceğinizi anlamanıza yardımcı olacaktır.

## Ön Koşullar

Smartnode'unuzu yapılandırmadan önce, lütfen şunları yaptığınızdan emin olun:

- Bir node makinesi (veya sanal makine) kurdunuz ve güvence altına aldınız ([Node'unuzu Güvence Altına Alma](../securing-your-node) kılavuzu aracılığıyla)
- Üzerine Smartnode'u [kurdunuz](../installing/overview) ve [yapılandırdınız](../config/overview)
- Smartnode'unuza bir node cüzdanı yüklediniz
- Execution ve Consensus istemcilerinizi senkronize ettiniz
- Node'unuzu [bir çekim adresi](../prepare-node#setting-your-withdrawal-address) ile tedarik ettiniz, [yedek istemcilerinizi](../fallback) kurdunuz (isteğe bağlı), [Smoothing Pool'a](../fee-distrib-sp#the-smoothing-pool) katıldınız (isteğe bağlı) ve [MEV](../mev) yapılandırdınız
- En az bir [minipool](../create-validator) oluşturdunuz

## Oylamada yer alan üç adres var

- pDAO Sinyal Adresi — doğrudan oy vermek istiyorsanız veya delegenizin Snapshot oyunu geçersiz kılmak istiyorsanız Snapshot adresiniz olarak kullanılacaktır. Bu adres yalnızca Snapshot için kullanılır, zincir üstü oylama için değil.

- pDAO Delege Node'u — oyunuzu delege etmeyi seçerseniz. Bunu delegenizin node adresine ayarlayacaksınız. Bir delege seçerseniz, onlar sizin için Snapshot'ta ve zincir üstü önerilerde oy kullanacaktır.

- Node Adresi — oyunuzu delege etmediyseniz veya delegenizin zincir üstü oyunu geçersiz kılmak istiyorsanız bunu node'unuzdan yapabilirsiniz.

## Kılavuzlar

[Protocol DAO](/tr/legacy/houston/pdao#the-protocol-dao-pdao), pDAO'nun Rocket Pool'u kimin ve nasıl yönettiğini tartışır. Bu sayfa, hazine harcamaları gibi pDAO görevlerinin zincir üstünde nasıl yürütülebileceğini ve yepyeni Güvenlik Konseyi'nin rolünü size anlatacaktır. Ayrıca bir pDAO önerisinin yaşam döngüsünde size rehberlik edecek ve spam'i önlemek ve kötü niyetli önerileri durdurmak için alınan bazı önlemleri açıklayacaktır.

[Smartnode olmayan kullanıcılar için oylama kurulumu](/tr/legacy/houston/nonsmartnode-setup), smartnode olmayan kullanıcıların (Allnodes kullanıcıları gibi) oylamayı nasıl kuracağını gösterir.

[Oylama Gücünü Başlatma](/tr/legacy/houston/participate#initializing-voting), node'unuzun oylama gücünü nasıl başlatacağınızı gösterir. Bu adım yalnızca node'unuz Houston Yükseltmesinden önce kaydedildiyse gereklidir.

[Snapshot Sinyal Adresinizi Ayarlama](/tr/legacy/houston/participate#setting-your-snapshot-signalling-address), bir Sinyal Adresi ayarlama adımlarında size yol gösterecektir. Node'unuzun özel anahtarını sıcak bir cüzdana yüklemeden node'unuzun oylama gücünü kullanarak Snapshot'ta oy kullanmanıza olanak tanıyacaktır. Smartnode CLI'nizin hazır olduğundan emin olun ve bu kılavuz için bir adres (node cüzdanınız olmayan) hazırlayın.

[Oylama Gücünü Delege Etme](/tr/legacy/houston/participate#delegating-voting-power), önerilere doğrudan oy vermek yerine oylama gücünü delege etmek için kullanabileceğiniz hızlı bir komuttur.

[Bir Önerinin Durumunu Görüntüleme](/tr/legacy/houston/participate#viewing-the-state-of-a-proposal), geçmiş ve devam eden zincir üstü önerilerin listesini nasıl görüntüleyebileceğinize dair bir kılavuzdur. Herhangi bir zincir üstü önerinin durumunu kontrol edebilecek ve ayrıntılarını okuyabileceksiniz.

[Bir Öneride Oy Kullanma](/tr/legacy/houston/participate#voting-on-a-proposal), zincir üstü bir öneride nasıl oy kullanılacağını gösterir. Bu kılavuz ayrıca dört seçeneği de ele alır: **Çekimser**, **Lehte**, **Aleyhte** ve **Veto**.

[Bir Öneri Oluşturma](/tr/legacy/houston/participate#creating-a-proposal), zincir üstü bir öneri sunmanın gerekliliklerinde ve adımlarında size yol gösterir.

[Başarılı bir öneriyi yürütme](/tr/legacy/houston/participate#executing-a-successful-proposal), başarılı bir önerinin etkilerinin Rocket Pool Protokolüne nasıl uygulanacağını gösterecektir.

[Tahvilleri ve Ödülleri Talep Etme](/tr/legacy/houston/participate#claiming-bonds-and-rewards), bir Öneren veya Meydan Okuyan tarafından tahvillerin veya ödüllerin hangi koşullarda talep edilebileceğini tartışır.

[Yinelenen hazine harcaması oluşturma ve talep etme](/tr/legacy/houston/participate#creating-a-recurring-treasury-spend), pDAO'ya yinelenen ödemeleri ekleme, değiştirme ve kaldırma konusunda tam kontrol veren bir özelliktir.
