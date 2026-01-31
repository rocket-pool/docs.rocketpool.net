# Oracle DAO Node'unuzu İzleme

Node'unuz çalışmaya başladıktan sonra, otomatik görevlerini doğru şekilde yerine getirdiğinden emin olmak için düzenli olarak sağlığını izlemeniz önemlidir.
Bunu yapmak şunları içerir:

- Fiziksel (veya sanal) sisteminizin sağlığını işletim sistemi seviyesinde izlemek
- Execution ve/veya Consensus istemcilerinizin sağlığını izlemek (yerel istemciler çalıştırıyorsanız)
- Node'unuzun durum güncellemeleri için gerekli işlemleri zincire düzenli olarak gönderdiğinden emin olmak
- Bu işlemleri gerçekleştirmek için node cüzdanınızda yeterli ETH bakiyesine sahip olduğunuzdan emin olmak
- Smartnode, istemcileriniz (varsa) ve İşletim Sisteminiz için güncellemeleri rutin olarak uygulamak
- Diğer Oracle DAO üyelerinin sağlığını izlemek ve node'larının düzgün çalışmadığını düşünüyorsanız onlarla iletişim kurmak

Bu bölümde, bunları Smartnode'un yerleşik [Grafana](https://grafana.com/) desteği aracılığıyla nasıl yapacağınıza dair birkaç örnek açıklayacağız.

## Standart Rocket Pool Kontrol Paneli

Smartnode, yukarıda listelenen metriklerden çoğunu izlemenize olanak tanıyan kullanışlı bir kontrol paneli sağlar.
Her Consensus Client için bir kontrol paneli vardır.
Aşağıda Nimbus için kontrol panelinin bir örneği bulunmaktadır:

![](../node-staking/images/nimbus-dashboard.png)

- Makinenizin donanım sağlığı sol üst çeyrekte yakalanır.
- Execution istemciniz, sol alt çeyrekteki Ağ İstatistikleri dolduruluyorsa düzgün çalışıyor demektir.
- Consensus istemciniz, sağ üst çeyrekteki peer sayısı sıfır olmayan bir sayıyla güncelleniyorsa düzgün çalışıyor demektir; tam sayı, istemci seçiminize ve ağ yapılandırmanıza bağlıdır.
- Node'unuzun ETH bakiyesi sağ alttaki tabloda görüntülenir.
- Herhangi bir İşletim Sistemi güncellemesi veya Smartnode güncellemesi, üst ortadaki panelde bulunan `Available Updates` kutusunda sunulur.

::: tip NOT
İşletim Sistemi ve Smartnode güncellemeleri, `rocketpool service install-update-tracker` komutuyla yükleyebileceğiniz güncelleme izleyicisini gerektirir.
:::

Metrik sistemini ve Smartnode kontrol panelini nasıl hazırlayacağınız hakkında bilgi için lütfen Smartnode belgelerinin [Node'unuzun Performansını İzleme](../node-staking/performance) ve [Grafana Kontrol Panelini Kurma](../node-staking/grafana.mdx) sayfalarını ziyaret edin.

## Oracle DAO Kontrol Paneli

Ayrıca Oracle DAO üyelerine özel olarak uyarlanmış basit bir kontrol paneli oluşturduk:

![](../odao/images/odao-dashboard.png)

Bu kontrol paneli şunları izler:

- Oy verilmesi veya yürütülmesi gereken Oracle DAO tekliflerinin durumu (bunlar hakkında daha fazla ayrıntı bir sonraki bölümde)
- Fiyat ve bakiye güncellemeleri için gönderim geçmişi\*
- Her Oracle DAO node'unun ETH bakiyeleri

\*_Fiyat ve bakiye gönderiminin şu anda her biri için node'ların %51'inin bir çoğunluğa varmasını gerektirdiğini unutmayın, bu noktada gönderim resmileşir. Diğer üyelerden gelen gönderimler artık gerekli olmadıkları için geri döner, bu nedenle node'unuz belirli bir aralık için gönderim yapmazsa, bu çevrimdışı olduğu anlamına gelmez. Arka arkaya 5'ten fazla aralığı kaçırırsanız endişelenmelisiniz ve herhangi bir sorun olmadığını doğrulamak için `watchtower` daemon günlüklerinizi kontrol etmelisiniz._

Bu kontrol panelini etkinleştirmek iki adımlı bir süreçtir.

İlk olarak, `rocketpool service config` düzenleyicisinin `Metrics` bölümünde Oracle DAO metriklerini etkinleştirin:

![](../odao/images/tui-odao-metrics.png)

Docker veya Hybrid modunda çalışıyorsanız, bu değişiklikleri uygulamak için `node` daemon'unuzu yeniden başlatacaktır.
Native modunda çalışıyorsanız, lütfen `node` servisini manuel olarak yeniden başlatın.

İkinci olarak, [Oracle DAO kontrol panelini](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) (ID `15003`) Grafana Labs'dan node'unuzun yerel Grafana sunucusuna içe aktarın.

## Günlükleri Kontrol Etme

Siz veya diğer Oracle DAO üyelerinden biri node'unuzla ilgili endişe dile getirdiyse, ilk savunma hattı (Docker ve Hybrid modu için) aşağıdaki komutu kullanarak `watchtower` daemon günlüklerine bakmaktır:

```shell
rocketpool service logs watchtower
```

Bu, watchtower container'ı için `docker` günlüklerini gösterecek ve son yüz satıra kadar kısaltacaktır.

Daha geriye gitmek için, satır sayısını belirtmek üzere `-t` bayrağını kullanabilirsiniz.
Örneğin:

```shell
rocketpool service logs watchtower -t 2000
```

son 2000 satırı gösterecektir.
Bu çok hızlı bir şekilde karmaşıklaşacağından, kaydırılabilir olması için bunu `less` gibi bir yardımcı programa yönlendirmek isteyebilirsiniz.

## Sonraki Adımlar

Bir sonraki bölümde, Oracle DAO üyesi olarak manuel olarak gerçekleştirmeniz gereken görevleri ele alacağız.
