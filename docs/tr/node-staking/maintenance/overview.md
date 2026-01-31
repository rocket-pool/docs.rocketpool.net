---
next:
  text: Node'unuzun Performansını İzleme
  link: "/tr/node-staking/performance"
---

# Genel Bakış

Bu bölümde, node'unuzun ve validator'larınızın sağlığını nasıl izleyeceğinizi, kazançlarınızı nasıl takip edeceğinizi ve güncellemeler gibi periyodik bakım işlemlerini nasıl gerçekleştireceğinizi öğreneceksiniz.

## Ön Koşullar

Smartnode'unuzu yapılandırmadan önce, lütfen şunları yaptığınızdan emin olun:

- Bir node makinesi (veya sanal makine) kurduğunuzu ve güvenliğini sağladığınızı ([Node'unuzu Güvence Altına Alma](../securing-your-node) rehberi ile)
- Smartnode'u üzerine [yüklediğinizi](../installing/overview) ve [yapılandırdığınızı](../config/overview)
- Smartnode'unuzda bir node cüzdanı yüklediğinizi
- Execution ve Consensus istemcilerinizi senkronize ettiğinizi
- Node'unuzu [bir çekim adresi](../prepare-node.mdx#setting-your-withdrawal-address) ile tedarik ettiğinizi, [yedek istemcilerinizi](../fallback) kurduğunuzu (isteğe bağlı), [Smoothing Pool'a](../fee-distrib-sp#the-smoothing-pool) katıldığınızı (isteğe bağlı) ve [MEV'yi](../mev.mdx) yapılandırdığınızı
- En az bir [minipool](../create-validator.mdx) oluşturduğunuzu

## Rehberler

[Node'unuzun Performansını İzleme](../performance), node'unuzun sağlığını (CPU ve RAM tüketimi gibi kaynak perspektifinden) ve validator'larınızın Beacon Chain üzerindeki performansını takip etmek için bazı araçlar ve eğitimler sağlar.
Ethereum validator'u olarak görev süreniz boyunca kullanacağınız pek çok temel aracı kapsar.

[Grafana Dashboard'unu Kurma](../grafana.mdx), Smartnode stack'inin metrik takipçisini ve Grafana dashboard'unu kurma sürecini anlatır - node'unuz ve validator'larınız hakkında her şeyi izlemek için tek durak noktası ve her node operatörünün cephaneliğindeki temel araç.
Grafana dashboard'unu keşfetmenizi ve düzenli olarak kontrol etmenizi _şiddetle_ tavsiye ederiz.

[Smartnode Stack Uyarı Bildirimleri](./alerting.md), Rocket Pool Smartnode'unuzun sağlığı ve önemli olayları hakkında bildirim almak için Smartnode uyarı bildirimi işlevselliğini kullanmayı anlatır.

[Güncellemeleri Kontrol Etme](../updates), yeni güvenlik yamalarıyla node'unuzu düzenli olarak güncellemenin kritik süreçlerini, yeni bir sürümden sonra Smartnode'u nasıl güncelleyeceğinizi ve seçtiğiniz istemciler Smartnode'un en son sürümünün henüz içermediği yeni bir sürüm yayınlarsa istemci sürümlerini manuel olarak nasıl güncelleyeceğinizi kapsar.
Bir güncelleme yayınlandığında ona başvurmanız gerekebileceğinden, bu bölümün tamamını tanımanız gerekir.

[Node'unuzu Yedekleme](../backups), donanım arızası durumunda node'unuzun yapılandırmasını ve zincir verilerini nasıl yedekleyeceğinizi açıklayan isteğe bağlı bir rehberdir.

[Execution İstemcisini Budama](../pruning), SSD'nizin disk alanını kademeli olarak tüketen ve bu alanın bir kısmını geri kazanmak için periyodik budama gerektiren (Geth veya Nethermind gibi) bir Execution istemcisi çalıştıran herkes için **önemlidir**.
Bu istemcilerden birini çalıştırıyorsanız, budama sürecini kesinlikle tanımanız gerekir.

[Execution veya Consensus İstemcilerini Değiştirme](../change-clients) yararlı bir rehberdir; istemci seçiminizi değiştirme sürecini ve süreç boyunca neler beklenebileceğini anlatır.
Gelecekte herhangi bir nedenle istemci değiştirmeniz gerekirse diye, bu da tanımanız gereken iyi bir rehberdir.
