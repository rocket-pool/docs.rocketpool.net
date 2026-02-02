# Überwachung Ihres Oracle DAO Nodes

Sobald Ihr Node läuft, ist es wichtig, dass Sie seine Gesundheit regelmäßig überwachen, um sicherzustellen, dass er seine automatisierten Aufgaben korrekt ausführt.
Dazu gehört Folgendes:

- Überwachung der Gesundheit Ihres physischen (oder virtuellen) Systems auf OS-Ebene
- Überwachung der Gesundheit Ihrer Execution- und/oder Consensus-Clients (wenn Sie lokale Clients betreiben)
- Sicherstellen, dass Ihr Node regelmäßig die erforderlichen Transaktionen für Statusaktualisierungen an die Chain übermittelt
- Sicherstellen, dass Sie einen ausreichenden ETH-Saldo in Ihrer Node-Wallet haben, um diese Transaktionen auszuführen
- Routinemäßiges Anwenden von Updates für den Smartnode, Ihre Clients (falls zutreffend) und Ihr Betriebssystem
- Überwachung der Gesundheit der anderen Oracle DAO-Mitglieder und Kommunikation mit ihnen, wenn Sie glauben, dass ihre Node(s) nicht ordnungsgemäß funktionierenS

In diesem Abschnitt beschreiben wir einige Beispiele, wie dies über die eingebaute [Grafana](https://grafana.com/)-Unterstützung des Smartnode erfolgen kann.

## Das Standard-Rocket-Pool-Dashboard

Der Smartnode bietet ein praktisches Dashboard, mit dem Sie viele der oben aufgeführten Metriken überwachen können.
Es gibt ein Dashboard für jeden Consensus Client.
Unten ist ein Beispiel des Dashboards für Nimbus:

![](../node-staking/images/nimbus-dashboard.png)

- Die Hardware-Gesundheit Ihrer Maschine wird im oberen linken Quadranten erfasst.
- Ihr Execution Client funktioniert ordnungsgemäß, wenn die Netzwerkstatistiken im unteren linken Quadranten ausgefüllt werden.
- Ihr Consensus Client funktioniert ordnungsgemäß, wenn die Peer-Anzahl im oberen rechten Quadranten mit einer Zahl ungleich Null aktualisiert wird; die genaue Zahl hängt von Ihrer Wahl des Clients und Ihrer Netzwerkkonfiguration ab.
- Der ETH-Saldo Ihres Nodes wird in der Tabelle unten rechts angezeigt.
- Alle Betriebssystem-Updates oder Smartnode-Updates werden im Feld `Available Updates` im oberen mittleren Panel angezeigt.

::: tip HINWEIS
Betriebssystem- und Smartnode-Updates erfordern den Update-Tracker, den Sie über `rocketpool service install-update-tracker` installieren können.
:::

Informationen zur Vorbereitung des Metriksystems und des Smartnode-Dashboards finden Sie auf den Seiten [Überwachung der Leistung Ihres Nodes](../node-staking/performance) und [Einrichten des Grafana-Dashboards](../node-staking/grafana.mdx) der Smartnode-Dokumentation.

## Das Oracle DAO Dashboard

Wir haben auch ein einfaches Dashboard speziell für Oracle DAO-Mitglieder erstellt:

![](../odao/images/odao-dashboard.png)

Dieses Dashboard verfolgt Folgendes:

- Den Status der Oracle DAO-Vorschläge, über die abgestimmt oder die ausgeführt werden müssen (mehr Details dazu im nächsten Abschnitt)
- Die Historie der Einreichungen für Preis- und Saldoaktualisierungen\*
- Die ETH-Salden jedes Oracle DAO-Nodes

\*_Beachten Sie, dass die Einreichung von Preisen und Salden derzeit ein Quorum von 51% der Nodes erfordert, die sich auf jeden einzelnen einigen müssen, woraufhin die Einreichung kanonisiert wird. Einreichungen von anderen Mitgliedern werden zurückgesetzt, da sie nicht mehr erforderlich sind. Wenn Ihr Node also nicht für ein bestimmtes Intervall einreicht, bedeutet das nicht, dass er offline ist. Sie sollten sich Sorgen machen, wenn Sie mehr als 5 aufeinanderfolgende Intervalle hintereinander verpassen, und sollten Ihre `watchtower`-Daemon-Logs überprüfen, um zu verifizieren, dass es keine Probleme gibt._

Das Aktivieren dieses Dashboards ist ein zweistufiger Prozess.

Aktivieren Sie zunächst Oracle DAO-Metriken im Abschnitt `Metrics` des `rocketpool service config`-Editors:

![](../odao/images/tui-odao-metrics.png)

Wenn Sie im Docker- oder Hybrid-Modus laufen, wird dies Ihren `node`-Daemon neu starten, um die Änderungen anzuwenden.
Wenn Sie im Native-Modus laufen, starten Sie bitte den `node`-Service manuell neu.

Importieren Sie zweitens das [Oracle DAO Dashboard](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) von Grafana Labs (ID `15003`) in den lokalen Grafana-Server Ihres Nodes.

## Überprüfung der Logs

Wenn Sie oder eines der anderen Oracle DAO-Mitglieder Bedenken bezüglich Ihres Nodes geäußert hat, ist die erste Verteidigungslinie, sich die `watchtower`-Daemon-Logs mit folgendem Befehl anzusehen (für Docker- und Hybrid-Modus):

```shell
rocketpool service logs watchtower
```

Dies zeigt die `docker`-Logs für den Watchtower-Container an und kürzt auf die letzten hundert Zeilen oder so.

Um weiter zurückzugehen, können Sie das `-t`-Flag verwenden, um die Anzahl der Zeilen anzugeben.
Zum Beispiel:

```shell
rocketpool service logs watchtower -t 2000
```

zeigt die letzten 2000 Zeilen an.
Da dies sehr schnell unübersichtlich wird, möchten Sie dies möglicherweise in ein Dienstprogramm wie `less` umleiten, damit es scrollbar ist.

## Nächste Schritte

Im nächsten Abschnitt werden wir die Aufgaben behandeln, die Sie als Oracle DAO-Mitglied manuell ausführen müssen.
