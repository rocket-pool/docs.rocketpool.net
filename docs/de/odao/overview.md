# Das Rocket Pool Oracle DAO

::: warning HINWEIS
Diese Dokumentation gilt nur für Mitglieder des Rocket Pool Oracle DAO.
Wenn Sie nicht ausdrücklich zum Oracle DAO eingeladen wurden und nur einen regulären Rocket Pool Node betreiben möchten, gilt dieser Abschnitt des Leitfadens nicht für Sie.
Sie können ihn sicher ignorieren, sind aber willkommen, ihn zu lesen, wenn Sie interessiert sind.
:::

Das **Oracle DAO** ist die Gruppe spezieller Rocket Pool Nodes, die für die administrativen Aufgaben verantwortlich sind, die vom Protokoll benötigt werden, aber aufgrund technischer Einschränkungen nicht durch Smart Contracts erreicht werden können.
Sie sind im Wesentlichen die gleichen wie normale Rocket Pool Nodes; sie verwenden die gleichen Werkzeuge, können mit denselben Methoden konfiguriert werden und können sogar reguläre Minipools betreiben, aber sie kommen mit ergänzenden Aufgaben, die sie ausführen.
Dies beinhaltet Dinge wie:

- Übertragen von Informationen von der Beacon Chain zur Execution Layer, einschließlich Validator-Status und -Guthaben
- Sicherstellen, dass Minipools mit öffentlichen Validator-Schlüsseln erstellt werden, die nicht bereits verwendet werden, und [die richtigen Abhebungsanmeldedaten haben](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit), damit das Protokoll sie sicher finanzieren kann
- Erstellen des Rewards-Merkle-Trees am Ende jeder Belohnungsperiode und Hochladen auf IPFS, damit andere Node Operators darauf zugreifen können
- Überwachen von Proposals auf Einhaltung der [Fee-Recipient-Anforderungen](../node-staking/mev.mdx) von Rocket Pool
- Vorschlagen und Abstimmen über Änderungen am Kernprotokoll, einschließlich Änderung von Parametern und Genehmigung von Vertrags-Upgrades
- Vorschlagen und Abstimmen über die Oracle DAO Mitgliederliste, einschließlich Einladen und Entfernen anderer Oracle DAO Mitglieder

Als Belohnung für die Erfüllung dieser Aufgaben erhält das Oracle DAO kollektiv einen [kleinen Prozentsatz](https://rpips.rocketpool.net/RPIPs/RPIP-25) der gesamten RPL-Inflation, die in jeder Belohnungsperiode produziert wird, gleichmäßig unter seinen Mitgliedern aufgeteilt.

Im Gegensatz zu normalen Rocket Pool Nodes, die von jedem ohne Erlaubnis erstellt und betrieben werden können, ist die Mitgliedschaft im Oracle DAO **nur auf Einladung** durch bestehende Mitglieder.
Wenn Sie kürzlich eingeladen wurden, dem Oracle DAO beizutreten, wird Ihnen dieser Abschnitt des Leitfadens helfen, Ihre Rolle zu verstehen, Ihren Node einzurichten und sicherzustellen, dass er gesund bleibt.

## Anforderungen

Um einen Oracle DAO Node zu betreiben, benötigen Sie Folgendes:

- Zugang zu einem **RPC-Endpunkt eines Execution Clients**. Dies kann ein lokal betriebener Client sein, wie es bei den meisten Rocket Pool Nodes der Fall ist, oder er kann auf externe Clients verweisen, die Sie oder Ihre Organisation unabhängig verwalten.
- Zugang zu einem **Execution Client im Archiv-Modus**, der entweder als Ihr primärer Client oder als ergänzender (Fallback-)Client fungieren kann. Er wird nur in seltenen Fällen verwendet, in denen Aufgaben erfordern, dass Ihr Node einen Execution Layer-Status abruft, der aus Ihrem Execution Client entfernt wurde. Dennoch ist es **kritisch**, dass Sie während dieser Perioden Zugang zu einem Archiv-Node haben, um sicherzustellen, dass Ihre Aufgaben erfolgreich erfüllt werden können.
  - Wir **empfehlen dringend**, dass Sie hierfür einen lokalen Archiv-Node verwenden, da Dienste wie [Infura](https://infura.io/pricing) oder [Alchemy](https://www.alchemy.com/pricing) Schwierigkeiten gezeigt haben, während kritischer Perioden wie dem Erstellen des Rewards-Trees mit der Nachfrage Schritt zu halten.
- Zugang zu einem **REST-API-Endpunkt eines Beacon Nodes im Archiv-Modus** (über HTTP). Dies kann ein lokal betriebener Client sein, wie es bei den meisten Rocket Pool Nodes der Fall ist, oder er kann auf externe Clients verweisen, die Sie oder Ihre Organisation unabhängig verwalten.
- Die Standard Smartnode CLI.
- Der Smartnode Daemon ist konfiguriert und läuft im `watchtower`-Modus (dies ist im Standard-Smartnode-Bundle für alle Benutzer enthalten, führt aber nur Aufgaben für Oracle DAO Nodes aus).
  - Dies kann in einem Docker-Container (Standard-Setup) oder als einfacher `systemd`-Dienst ("Native"-Modus) ausgeführt werden.
- Genügend ETH, um die Gaskosten Ihrer Aufgaben zu bezahlen (später besprochen).

::: warning HINWEIS
Wenn Sie einfach keinen lokalen Archiv-Node betreiben können und _unbedingt_ auf einen Drittanbieter-Dienst angewiesen sein müssen, beachten Sie Folgendes:

Wenn Sie **Infura** für Ihren Archiv-Modus-Fallback verwenden möchten, müssen Sie mindestens den **Team**-Plan haben.
Der kostenlose Tarif und der Developer-Tarif sind nicht ausreichend.

Wenn Sie **Alchemy** verwenden möchten, müssen Sie mindestens den **Growth**-Plan haben.
Der kostenlose Tarif ist nicht ausreichend.
:::

## Aktivitäten

Oracle DAO Aufgaben sind in zwei Teile aufgeteilt.

1. **Automatisierte Aufgaben**: Dies sind Aufgaben im Zusammenhang mit dem routinemäßigen Rocket Pool Betrieb, wie z.B. das Übertragen von Informationen von der Consensus Layer zur Execution Layer, das Off-Chain-Berechnen verschiedener Aspekte des Protokolls und das Einreichen als Updates in die Smart Contracts. Jede davon wird automatisch vom `watchtower` Daemon-Prozess durchgeführt und erfordert keine manuelle Intervention, solange Ihre Execution und Consensus Clients sowie Ihr `watchtower` Daemon alle normal funktionieren.
2. **Manuelle Aufgaben**: Dies sind Aufgaben, die Ihre eigene Entscheidungsfindung und Out-of-Band-Kommunikation mit dem Rest des Oracle DAO erfordern. Sie umfassen Dinge wie Abstimmungen über Vertrags-Upgrades, Änderung von Parametern und Einladen oder Entfernen von Mitgliedern zum/vom Oracle DAO. Diese können alle über die Standard Smartnode CLI durchgeführt werden.

Lesen Sie den nächsten Abschnitt, um zu erfahren, wie Sie Ihren Oracle DAO Node einrichten.
