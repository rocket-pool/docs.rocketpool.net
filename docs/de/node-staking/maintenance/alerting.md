# Überwachen Sie Ihren Smartnode Stack mit Alert-Benachrichtigungen

Die Smartnode Alert-Benachrichtigungsfunktion ermöglicht es Ihnen, Benachrichtigungen über den Zustand und wichtige Ereignisse Ihres Rocket Pool Smartnode zu erhalten.

## Übersicht des Alerting-Systems

Die Benachrichtigungsfunktion verwendet [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) zur Zustellung von Alerts. Alerting setzt voraus, dass Sie bereits die Anleitung [Einrichten des Grafana Dashboards](../grafana.mdx) befolgt haben, die durch die Einrichtung des Metrik-Trackers des Smartnode Stack führt. Die Alerts werden ausgelöst, wenn wichtige Metriken Ihres Smartnode bestimmte Schwellenwerte überschreiten oder wenn bestimmte Ereignisse auftreten, wie z.B. wenn der Fee Recipient Ihres Nodes geändert wird.

## Einrichten von Discord-Benachrichtigungen

Derzeit können Benachrichtigungen an Discord-Kanäle gesendet werden. Sie können Discord-Benachrichtigungen innerhalb der Rocket Pool Text User Interface (TUI) auf der Seite "Monitoring / Alerting" konfigurieren.

### Hinzufügen einer Discord Webhook URL:

1. Navigieren Sie zu Ihrem gewünschten Discord-Kanal und öffnen Sie dessen Einstellungen.
2. Suchen Sie unter "Integrationen" den Punkt "Webhooks" und klicken Sie darauf.
3. Klicken Sie auf "Webhook erstellen".
4. Geben Sie Ihrem Webhook einen Namen und wählen Sie einen Kanal aus, an den die Alerts gesendet werden sollen.
5. Kopieren Sie die bereitgestellte Webhook URL.
6. Navigieren Sie innerhalb der Rocket Pool TUI zur Seite "Monitoring / Alerting".
7. Fügen Sie die kopierte Webhook URL in das dafür vorgesehene Feld ein und speichern Sie die Konfiguration.

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
