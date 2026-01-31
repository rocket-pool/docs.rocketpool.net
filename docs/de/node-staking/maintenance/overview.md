---
next:
  text: Überwachung der Leistung Ihres Nodes
  link: "/de/node-staking/performance"
---

# Übersicht

In diesem Abschnitt erfahren Sie, wie Sie die Gesundheit Ihres Nodes und Ihrer Validatoren überwachen, Ihre Einnahmen verfolgen und regelmäßige Wartungsarbeiten wie Updates durchführen.

## Voraussetzungen

Bevor Sie Ihren Smartnode konfigurieren, stellen Sie bitte sicher, dass Sie:

- Eine Node-Maschine (oder virtuelle Maschine) eingerichtet und gesichert haben (über die Anleitung [Sichern Ihres Nodes](../securing-your-node))
- Den Smartnode darauf [installiert](../installing/overview) und [konfiguriert](../config/overview) haben
- Eine Node Wallet auf Ihrem Smartnode geladen haben
- Ihre Execution und Consensus Clients synchronisiert haben
- Ihren Node mit [einer Withdrawal-Adresse](../prepare-node.mdx#setting-your-withdrawal-address) bereitgestellt, Ihre [Fallback Clients](../fallback) eingerichtet (optional), sich für den [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) entschieden (optional) und [MEV](../mev.mdx) konfiguriert haben
- Mindestens einen [Minipool](../create-validator.mdx) erstellt haben

## Anleitungen

[Überwachung der Performance Ihres Nodes](../performance) bietet einige Tools und Tutorials zur Überwachung der Gesundheit Ihres Nodes (aus Ressourcenperspektive, wie CPU- und RAM-Verbrauch) und der Performance Ihrer Validatoren auf der Beacon Chain.
Es deckt viele grundlegende Tools ab, die Sie während Ihrer Zeit als Ethereum Validator verwenden werden.

[Einrichtung des Grafana Dashboards](../grafana.mdx) führt durch die Einrichtung des Metrics-Trackers des Smartnode Stacks und des Grafana Dashboards - eine zentrale Anlaufstelle für die Überwachung von allem über Ihren Node und Validatoren und ein unverzichtbares Werkzeug im Arsenal jedes Node Operators.
Wir empfehlen _dringend_, das Grafana Dashboard zu erkunden und regelmäßig zu überprüfen.

[Smartnode Stack Alert Benachrichtigungen](./alerting.md) führt durch die Verwendung der Smartnode Alert-Benachrichtigungsfunktion, um Benachrichtigungen über die Gesundheit und wichtige Ereignisse Ihres Rocket Pool Smartnode zu erhalten.

[Auf Updates prüfen](../updates) behandelt die wichtigen Prozesse der regelmäßigen Aktualisierung Ihres Nodes mit neuen Sicherheitspatches, wie der Smartnode nach einer neuen Version aktualisiert wird und wie Client-Versionen manuell aktualisiert werden, falls Ihre gewählten Clients eine neue Version veröffentlichen, die die neueste Smartnode-Version noch nicht enthält.
Sie sollten sich mit diesem gesamten Abschnitt vertraut machen, da Sie möglicherweise darauf zurückgreifen müssen, wenn ein Update veröffentlicht wird.

[Sicherung Ihres Nodes](../backups) ist eine optional Anleitung, die beschreibt, wie Sie die Konfiguration Ihres Nodes und seine Chain-Daten im Falle eines Hardwarefehlers sichern.

[Pruning des Execution Clients](../pruning) ist **wichtig** für alle, die einen Execution Client ausführen, der allmählich den gesamten Speicherplatz Ihrer SSD verbraucht und regelmäßiges Pruning erfordert (wie Geth oder Nethermind), um etwas von diesem Speicherplatz zurückzugewinnen.
Wenn Sie einen dieser Clients ausführen, sollten Sie sich definitiv mit dem Pruning-Prozess vertraut machen.

[Wechsel von Execution oder Consensus Clients](../change-clients) ist eine nützliche Anleitung; sie führt durch den Prozess des Wechsels Ihrer Client-Auswahl(en) und was während des Prozesses zu erwarten ist.
Dies ist eine weitere gute Anleitung, mit der Sie sich vertraut machen sollten, falls Sie aus irgendeinem Grund später Clients wechseln müssen.
