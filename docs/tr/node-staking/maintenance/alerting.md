# Smartnode Stack'inizi Uyarı Bildirimleri ile İzleme

Smartnode uyarı bildirimi işlevselliği, Rocket Pool Smartnode'unuzun sağlığı ve önemli olayları hakkında bildirim almanızı sağlar.

## Uyarı Sistemi Genel Bakış

Bildirim işlevselliği, uyarıları iletmek için [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) kullanır. Uyarı, Smartnode stack'inin metrik takipçisini kurma sürecini anlatan [Grafana Dashboard'unu Kurma](../grafana.mdx) rehberini zaten takip etmiş olmanızı gerektirir. Uyarılar, Smartnode'unuzdaki önemli metrikler belirli eşikleri aştığında veya node'unuzun ücret alıcısı değiştirildiğinde gibi belirli olaylar gerçekleştiğinde tetiklenir.

## Discord Bildirimlerini Kurma

Şu anda, bildirimler Discord kanallarına gönderilebilir. Discord bildirimlerini Rocket Pool Metin Kullanıcı Arayüzü (TUI) içinde "Monitoring / Alerting" sayfasında yapılandırabilirsiniz.

### Discord Webhook URL'si Ekleme:

1. İstediğiniz Discord kanalına gidin ve ayarlarını açın.
2. "Integrations" altında, "Webhooks"u bulun ve tıklayın.
3. "Create Webhook"e tıklayın.
4. Webhook'unuza bir ad verin ve uyarıların gönderileceği bir kanal seçin.
5. Sağlanan Webhook URL'sini kopyalayın.
6. Rocket Pool TUI içinde, "Monitoring / Alerting" sayfasına gidin.
7. Kopyalanan Webhook URL'sini belirlenen alana yapıştırın ve yapılandırmayı kaydedin.

::: tip İPUCU
En sevdiğiniz bildirim eksik mi? Rocket Pool ekibi, ek bildirim hedefleri konusunda topluluktan aktif olarak geri bildirim arıyor. https://github.com/rocket-pool/smartnode/issues adresinden yeni bildirim hedefleri önerebilirsiniz.
:::

## Uyarıları Devre Dışı Bırakma ve Etkinleştirme

Rocket Pool TUI, uyarılarınızı yönetmek için kullanıcı dostu bir arayüz sağlar. Bu işlevselliğe "Monitoring / Alerting" sayfası üzerinden erişebilirsiniz. Bu arayüz, yapılandırılmış tüm uyarıların bir listesini görüntülemenize ve tercihinize göre bireysel uyarıları etkinleştirmenize veya devre dışı bırakmanıza olanak tanır.

## Gelişmiş Yapılandırma

::: warning NOT
Bu bölüm, Prometheus konusunda deneyimli ve YAML dosyalarını değiştirmekte deneyimli ileri düzey kullanıcılar içindir.
:::

Uyarıların daha gelişmiş yapılandırması için, Smartnode Stack tarafından yönetilen Prometheus konteynerinde mevcut olan herhangi bir metriğe dayalı kendinizinkini ekleyebilirsiniz. [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) içeren kendi yaml dosyanızı `~/.rocketpool/alerting/rules/` dizinine ekleyin ve bu kuralları ekledikten sonra Prometheus konteynerini `docker stop rocketpool_prometheus` ve ardından `docker start rocketpool_prometheus` ile yeniden başlatın. Ardından Prometheus'un yapılandırma dosyanızı başarıyla yüklediğini doğrulamak için `docker logs rocketpool_prometheus` komutunu çalıştırın (bir satırda _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ görmek istersiniz ve _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._ görmek istemezsiniz)
