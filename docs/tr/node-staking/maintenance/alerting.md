# Smartnode Stack'inizi Uyarı Bildirimleri ile İzleme

Smartnode uyarı bildirimi işlevselliği, Rocket Pool Smartnode'unuzun sağlığı ve önemli olayları hakkında bildirim almanızı sağlar.

## Uyarı Sistemi Genel Bakış

Bildirim işlevselliği, uyarıları iletmek için [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) kullanır. Uyarı, Smartnode stack'inin metrik takipçisini kurma sürecini anlatan [Grafana Dashboard'unu Kurma](../grafana.mdx) rehberini zaten takip etmiş olmanızı gerektirir. Uyarılar, Smartnode'unuzdaki önemli metrikler belirli eşikleri aştığında veya node'unuzun ücret alıcısı değiştirildiğinde gibi belirli olaylar gerçekleştiğinde tetiklenir.

## Discord Bildirimlerini Kurma

Şu anda, bildirimler Discord kanallarına ve Telegram sohbetlerine gönderilebilir. Rocket Pool Metin Kullanıcı Arayüzü (TUI) içinde "Monitoring / Alerting" sayfasından bu hedeflerden birini veya her ikisini yapılandırabilirsiniz.

### Discord Webhook URL'si Ekleme:

1. İstediğiniz Discord kanalına gidin ve ayarlarını açın.
2. "Integrations" altında, "Webhooks"u bulun ve tıklayın.
3. "Create Webhook"e tıklayın.
4. Webhook'unuza bir ad verin ve uyarıların gönderileceği bir kanal seçin.
5. Sağlanan Webhook URL'sini kopyalayın.
6. Rocket Pool TUI içinde, "Monitoring / Alerting" sayfasına gidin.
7. Kopyalanan Webhook URL'sini belirlenen alana yapıştırın ve yapılandırmayı kaydedin.

## Telegram Bildirimlerini Ayarlama

Telegram bildirimlerini Rocket Pool Metin Kullanıcı Arayüzü (TUI) içinde "Monitoring / Alerting" sayfasında yapılandırabilirsiniz. Telegram bildirimleri Telegram Bot API üzerinden gönderilir. Hem bir bot token'ı hem de sayısal bir sohbet kimliği (chat ID) gereklidir; yalnızca birini doldurmak hiçbir işe yaramaz.

### Telegram Bot Token'ı ve Sohbet Kimliği Ekleme:

1. Telegram'da [@BotFather](https://t.me/BotFather) hesabını açın ve yeni bir bot oluşturun.
2. BotFather'ın verdiği bot token'ını kopyalayın (yalnızca token — `bot` önekini eklemeyin).
3. Uyarıların sizinle olan özel bir sohbete (DM), bir gruba mı yoksa bir kanala mı gideceğine karar verin.
4. Uyarıları DM olarak almak istiyorsanız, önce botunuza `/start` gönderin. Ardından tarayıcıda `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` adresini açın (`<YOUR_BOT_TOKEN>` yerine 2. adımdaki token'ı yazın) ve `"chat"` nesnesini arayın:

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

`"id"` değeri, Telegram Chat ID alanına girmeniz gereken sohbet kimliğidir.

5. Uyarıları bir grupta veya kanalda almak istiyorsanız, botu üye olarak ekleyin (kanallar için botun yönetici olması gerekir). Grup ve kanal kimlikleri negatiftir ve genellikle `-100` ile başlar. Bot sohbeti görebildikten sonra, sayısal sohbet kimliğini bulmak için aynı `getUpdates` URL'sini kullanın. `@mychannel` gibi kullanıcı adları çalışmayacaktır.
6. Rocket Pool TUI içinde "Monitoring / Alerting" sayfasına gidin.
7. Bot token'ını ve sayısal sohbet kimliğini ilgili alanlara yapıştırıp yapılandırmayı kaydedin.

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
