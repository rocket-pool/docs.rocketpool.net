---
next:
  text: Protokol DAO
  link: "/tr/pdao/pdao"
---

# Genel Bakış

Bu bölüm, düğümünüzü on-chain ve snapshot tekliflerine katılacak şekilde yapılandırma sürecini özetlemektedir. Anlatılacak çok şey var, bu nedenle [Houston Güncellemesi](/tr/legacy/houston/whats-new) hakkındaki genel bakışı okumanızı şiddetle tavsiye ederiz. Bu, on-chain yönetimi etkinleştiren en son özellikleri ve protokolü şekillendirmeye nasıl katılabileceğinizi anlamanıza yardımcı olacaktır.

## Ön Koşullar

Smartnode'unuzu yapılandırmadan önce lütfen aşağıdakileri yaptığınızdan emin olun:

- Bir düğüm makinesi (veya sanal makine) kurduğunuzu ve güvenliğini sağladığınızı ([Düğümünüzü Güvence Altına Alma](/tr/node-staking/securing-your-node) rehberi aracılığıyla)
- Smartnode'un üzerine [kurulduğunu](/tr/node-staking/installing/overview) ve [yapılandırıldığını](/tr/node-staking/config/overview)
- Smartnode'unuza yüklenmiş bir düğüm cüzdanınız olduğunu
- Execution ve Consensus istemcilerinizi senkronize ettiğinizi
- Düğümünüzü [bir çekim adresi](/tr/node-staking/prepare-node#setting-your-withdrawal-address) ile yapılandırdığınızı, [yedek istemcilerinizi](/tr/node-staking/fallback) kurduğunuzu (opsiyonel), [Smoothing Pool](/tr/node-staking/fee-distrib-sp#the-smoothing-pool)'a katıldığınızı (opsiyonel) ve [MEV](/tr/node-staking/mev)'i yapılandırdığınızı
- En az bir [minipool](/tr/node-staking/create-validator) oluşturduğunuzu

## Oylamada üç adres rol alır

- pDAO Signalling Address — Doğrudan oy kullanmak istiyorsanız veya delegenizin Snapshot oyunu geçersiz kılmak istiyorsanız Snapshot adresiniz olarak kullanılacaktır. Bu adres yalnızca Snapshot için kullanılır, on-chain oylama için değil.

- pDAO Delegate Node — Oyunuzu devretmeyi seçerseniz. Bunu delegenizin düğüm adresine ayarlayacaksınız. Bir delege seçerseniz, onlar sizin için Snapshot'ta ve on-chain tekliflerde oy kullanacaktır.

- Node Address — Oyunuzu devretmediyseniz veya delegenizin on-chain oyunu geçersiz kılmak istiyorsanız bunu düğümünüzden yapabilirsiniz.

## Rehberler

[Protokol DAO](/tr/pdao/pdao), pDAO'nun Rocket Pool'u kimin ve nasıl yönettiğini tartışır. Bu sayfa, hazine harcamaları gibi pDAO görevlerinin on-chain üzerinde nasıl yürütülebileceği ve yepyeni Güvenlik Konseyi'nin rolü hakkında sizi bilgilendirecektir. Ayrıca bir pDAO teklifinin yaşam döngüsünde size yol gösterecek ve spam'i önlemek ve kötü niyetli teklifleri engellemek için alınan bazı önlemleri açıklayacaktır.

[Smartnode olmayan kullanıcılar için oylama kurulumu](/tr/legacy/houston/nonsmartnode-setup), smartnode olmayan kullanıcılara (Allnodes kullanıcıları gibi) oylamayı nasıl kuracaklarını gösterir.

[Oy Gücünü Başlatma](/tr/pdao/participate#initializing-voting), düğümünüzün oy gücünü nasıl başlatacağınızı gösterir. Bu adım yalnızca düğümünüz Houston Güncellemesinden önce kaydedildiyse gereklidir.

[Snapshot Signalling Address Ayarlama](/tr/pdao/participate#setting-your-snapshot-signalling-address), bir Signalling Address ayarlama adımlarında size yol gösterecektir. Düğümünüzün özel anahtarını hot wallet'a yüklemenize gerek kalmadan düğümünüzün oy gücünü kullanarak Snapshot'ta oy kullanmanıza izin verecektir. Bu rehber için Smartnode CLI'ınızı hazır bulundurun ve (düğüm cüzdanınız olmayan) bir adres hazırlayın.

[Oy Gücünü Devretme](/tr/pdao/participate#delegating-voting-power), teklifler üzerinde doğrudan oy kullanmak yerine oy gücünü devretmek için kullanabileceğiniz hızlı bir komuttur.

[Bir Teklifin Durumunu Görüntüleme](/tr/pdao/participate#viewing-the-state-of-a-proposal), geçmiş ve devam eden on-chain tekliflerin listesini nasıl görüntüleyebileceğinize dair bir rehberdir. Herhangi bir on-chain teklifin durumunu kontrol edebilecek ve ayrıntılarını okuyabileceksiniz.

[Bir Teklife Oy Verme](/tr/pdao/participate#voting-on-a-proposal), bir on-chain teklifine nasıl oy vereceğinizi gösterir. Bu rehber ayrıca dört seçeneği de ele alır: **Abstain**, **For**, **Against** ve **Veto**.

[Bir Teklif Oluşturma](/tr/pdao/participate#creating-a-proposal), bir on-chain teklifi oluşturma gerekliliklerinde ve adımlarında size yol gösterir.

[Başarılı bir teklifi yürütme](/tr/pdao/participate#executing-a-successful-proposal), başarılı bir teklifin etkilerini Rocket Pool Protokolüne nasıl uygulayacağınızı gösterecektir.

[Tahvil ve Ödülleri Talep Etme](/tr/pdao/participate#claiming-bonds-and-rewards), bir Teklif Sahibi veya Challenger tarafından tahvillerin veya ödüllerin talep edilebileceği koşulları tartışır.

[Yinelenen bir hazine harcaması oluşturma ve talep etme](/tr/pdao/participate#creating-a-recurring-treasury-spend), pDAO'ya yinelenen ödemeleri ekleme, değiştirme ve kaldırma konusunda tam kontrol sağlayan bir özelliktir.
