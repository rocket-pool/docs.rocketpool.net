# Überwachen Sie Ihren Smartnode Stack mit Alert-Benachrichtigungen

Die Smartnode Alert-Benachrichtigungsfunktion ermöglicht es Ihnen, Benachrichtigungen über den Zustand und wichtige Ereignisse Ihres Rocket Pool Smartnode zu erhalten.

## Übersicht des Alerting-Systems

Die Benachrichtigungsfunktion verwendet [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) zur Zustellung von Alerts. Alerting setzt voraus, dass Sie bereits die Anleitung [Einrichten des Grafana Dashboards](../grafana.mdx) befolgt haben, die durch die Einrichtung des Metrik-Trackers des Smartnode Stack führt. Die Alerts werden ausgelöst, wenn wichtige Metriken Ihres Smartnode bestimmte Schwellenwerte überschreiten oder wenn bestimmte Ereignisse auftreten, wie z.B. wenn der Fee Recipient Ihres Nodes geändert wird.

## Einrichten von Discord-Benachrichtigungen

Derzeit können Benachrichtigungen an Discord-Kanäle und Telegram-Chats gesendet werden. Sie können eines oder beide Ziele innerhalb der Rocket Pool Text User Interface (TUI) auf der Seite "Monitoring / Alerting" konfigurieren.

### Hinzufügen einer Discord Webhook URL:

1. Navigieren Sie zu Ihrem gewünschten Discord-Kanal und öffnen Sie dessen Einstellungen.
2. Suchen Sie unter "Integrationen" den Punkt "Webhooks" und klicken Sie darauf.
3. Klicken Sie auf "Webhook erstellen".
4. Geben Sie Ihrem Webhook einen Namen und wählen Sie einen Kanal aus, an den die Alerts gesendet werden sollen.
5. Kopieren Sie die bereitgestellte Webhook URL.
6. Navigieren Sie innerhalb der Rocket Pool TUI zur Seite "Monitoring / Alerting".
7. Fügen Sie die kopierte Webhook URL in das dafür vorgesehene Feld ein und speichern Sie die Konfiguration.

## Einrichten von Telegram-Benachrichtigungen

Sie können Telegram-Benachrichtigungen innerhalb der Rocket Pool Text User Interface (TUI) auf der Seite "Monitoring / Alerting" konfigurieren. Telegram-Benachrichtigungen werden über die Telegram Bot API gesendet. Sowohl ein Bot-Token als auch eine numerische Chat-ID sind erforderlich; nur eines von beiden auszufüllen bewirkt nichts.

### Hinzufügen eines Telegram Bot-Tokens und einer Chat-ID:

1. Öffnen Sie [@BotFather](https://t.me/BotFather) in Telegram und erstellen Sie einen neuen Bot.
2. Kopieren Sie das von BotFather bereitgestellte Bot-Token (nur das Token — ohne das Präfix `bot`).
3. Entscheiden Sie, ob die Benachrichtigungen an einen privaten Chat (DM) mit Ihnen, an eine Gruppe oder an einen Kanal gehen sollen.
4. Wenn Sie Benachrichtigungen per DM erhalten möchten, senden Sie zuerst `/start` an Ihren Bot. Öffnen Sie anschließend `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in einem Browser (ersetzen Sie `<YOUR_BOT_TOKEN>` durch das Token aus Schritt 2) und suchen Sie nach dem `"chat"`-Objekt:

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

Der Wert `"id"` ist die Chat-ID, die Sie im Feld Telegram Chat ID eintragen sollten.

5. Wenn Sie Benachrichtigungen in einer Gruppe oder einem Kanal erhalten möchten, fügen Sie den Bot als Mitglied hinzu (bei Kanälen muss der Bot Administrator sein). Gruppen- und Kanal-IDs sind negativ (sie beginnen typischerweise mit `-100`). Sobald der Bot den Chat sehen kann, verwenden Sie dieselbe `getUpdates`-URL, um die numerische Chat-ID zu ermitteln. Benutzernamen wie `@mychannel` funktionieren nicht.
6. Navigieren Sie in der Rocket Pool TUI zur Seite "Monitoring / Alerting".
7. Fügen Sie das Bot-Token und die numerische Chat-ID in die dafür vorgesehenen Felder ein und speichern Sie die Konfiguration.

::: tip TIPP
Fehlt Ihre bevorzugte Benachrichtigungsmethode? Das Rocket Pool Team sucht aktiv nach Feedback aus der Community bezüglich zusätzlicher Benachrichtigungsziele. Schlagen Sie gerne neue Benachrichtigungsziele vor unter https://github.com/rocket-pool/smartnode/issues.
:::

## Deaktivieren und Aktivieren von Alerts

Die Rocket Pool TUI bietet eine benutzerfreundliche Oberfläche zur Verwaltung Ihrer Alerts. Sie können auf diese Funktionalität über die Seite "Monitoring / Alerting" zugreifen. Diese Oberfläche ermöglicht es Ihnen, eine Liste aller konfigurierten Alerts anzuzeigen und einzelne Alerts nach Ihren Präferenzen zu aktivieren oder zu deaktivieren.

## Erweiterte Konfiguration

::: warning HINWEIS
Dieser Abschnitt richtet sich an fortgeschrittene Benutzer, die Erfahrung mit Prometheus und der Bearbeitung von YAML-Dateien haben.
:::

Für eine erweiterte Konfiguration von Alerts können Sie eigene Alerts basierend auf jeder Metrik hinzufügen, die im Prometheus-Container verfügbar ist, der vom Smartnode Stack verwaltet wird. Fügen Sie Ihre eigene yaml-Datei mit [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) in das Verzeichnis `~/.rocketpool/alerting/rules/` ein und starten Sie den Prometheus-Container mit `docker stop rocketpool_prometheus` gefolgt von `docker start rocketpool_prometheus` neu. Führen Sie dann `docker logs rocketpool_prometheus` aus, um zu bestätigen, dass Prometheus Ihre Konfigurationsdatei erfolgreich geladen hat (Sie möchten eine Zeile mit _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ sehen und nicht _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
