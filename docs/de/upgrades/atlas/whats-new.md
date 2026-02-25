# Das Atlas Update

::: tip HINWEIS
Atlas wurde am `18. April 2023, 00:00 UTC` bereitgestellt. Bitte besuchen Sie [hier](../houston/whats-new), um über Houston, das neueste Protokoll-Upgrade, zu lesen.
:::

Diese Seite beschreibt die wichtigsten Änderungen, die das nächste große Update von Rocket Pool mit dem Titel **Atlas** für das Protokoll mit sich bringt, einschließlich Updates sowohl für den Smartnode-Stack als auch für das Rocket Pool-Protokoll im Allgemeinen.

Bitte lesen Sie diese Seite gründlich durch, um alle Unterschiede zwischen der vorherigen Version von Rocket Pool (Redstone) und Atlas zu verstehen.

## Neue Protokoll-Features

Atlas bringt einige aufregende neue Features mit sich, die sowohl auf Community-Feedback als auch auf Änderungen am Ethereum-Protokoll selbst basieren.
Nachfolgend finden Sie eine kurze Liste dieser Änderungen - klicken Sie auf eine davon, um mehr darüber zu erfahren.

### Shapella und Withdrawals

Das Ethereum-Protokoll bereitet sich darauf vor, sein nächstes großes Upgrade durchzuführen: **Shanghai** auf der Execution Layer und **Capella** auf der Consensus Layer - da diese jetzt miteinander verbunden sind, werden beide gleichzeitig stattfinden.
Ethereum-Benutzer haben das kombinierte Upgrade liebevoll [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) genannt.

Shapella führt **Withdrawals** zur Beacon Chain ein, was bedeutet, dass Node Operators jetzt auf das ETH zugreifen können, das derzeit auf der Beacon Chain gesperrt ist.
Dies gibt es in zwei Varianten:

- Teilweise Withdrawals (**Skimming**), bei denen Ihre Belohnungen (Ihr Beacon Chain-Guthaben über 32 ETH) an Ihren Minipool auf der Execution Layer gesendet werden. Dies geschieht _automatisch durch das Protokoll selbst_ alle paar Tage (etwa alle vier oder fünf Tage auf Mainnet).
- **Vollständige Withdrawals**, bei denen Sie Ihren Validator von der Beacon Chain beenden und sein gesamtes Guthaben an Ihren Minipool auf der Execution Layer gesendet wird. Dies geschieht _automatisch durch das Protokoll selbst_, sobald Ihr Validator lange genug von der Chain beendet wurde.

Atlas führt einen neuen Delegate-Vertrag für Minipools ein, der es Node Operators ermöglicht, das ETH-Guthaben des Minipools jederzeit zu **verteilen** und es gleichmäßig zwischen dem Node Operator und den rETH-Inhabern (plus Kommission natürlich) aufzuteilen.
Dies gibt Node Operators **sofortigen Zugriff** auf ihre Beacon Chain-Belohnungen!
Es bringt auch den Anteil der rETH-Inhaber zurück in den Deposit Pool, sodass er verwendet werden kann, um rETH gegen ETH zum Wechselkurs des Protokolls zu entstaken (oder um neue Minipools zu erstellen).

### 8-ETH Bonded Minipools

Eine der am meisten erwarteten Änderungen in Atlas ist die Einführung der Möglichkeit, nur 8 ETH bereitzustellen, um einen Minipool zu erstellen, anstatt 16 ETH.
Minipools mit nur 8 ETH, die von ihrem besitzenden Node Operator gebonded wurden, werden mit **24 ETH** aus dem Staking Pool (bereitgestellt von rETH-Inhabern) kombiniert, um einen Validator zu erstellen.
Dies reduziert die Kapitalanforderung für den Betrieb Ihres eigenen Validators erheblich _und_ führt zu größeren Erträgen sowohl für den Node Operator als auch für die rETH-Staker!
Tatsächlich werden zwei 8-ETH-Minipools anstelle eines 16-ETH-Minipools **über 18% mehr Belohnungen** erbringen - selbst wenn der 16-ETH-Minipool eine Kommissionsrate von 20% hat.

Das Erstellen eines 8 ETH Minipools erfordert, dass Sie **mindestens 2,4 ETH im Wert von RPL** und **maximal 12 ETH im Wert von RPL** staken.
Diese repräsentieren 10% des Betrags, den Sie vom Protokoll _ausleihen_, und 150% des Betrags, den Sie selbst _bonden_ (staken).

Neue Minipools können entweder mit 8 ETH oder 16 ETH erstellt werden.
16 ETH Minipools sind unverändert, wie sie heute funktionieren, und stehen Benutzern zur Verfügung, die ihre Exposition gegenüber dem RPL-Token minimieren möchten.

Um zu erfahren, wie Sie neue Minipools mit einem 8 ETH Bond erstellen, besuchen Sie bitte die [Minipool-Erstellungsanleitung](../../node-staking/create-validator.mdx).

Sobald Atlas angewendet wurde, können Node Operators auch **bestehende 16-ETH-Minipools direkt in 8-ETH-Minipools migrieren, ohne beenden zu müssen**.
Dadurch erhalten sie 8 ETH zurück als [Deposit Credit](../../node-staking/credit), das verwendet werden kann, um **kostenlos einen neuen 8-ETH-Minipool zu erstellen**!

Um mehr über 8-ETH-Bond-Minipools zu erfahren, besuchen Sie bitte die [Bond-Reduction-Anleitung](../../node-staking/leb-migration.mdx).

### Solo Validator Conversion

Teil des Shapella-Upgrades ist die Möglichkeit für Solo-Validatoren, [ihre Validator-Withdrawal-Credentials zu ändern](https://notes.ethereum.org/@launchpad/withdrawals-faq) vom ursprünglichen (jetzt ungenutzten) BLS-basierten Withdrawal-Key zu einer Adresse auf der Execution Layer.
Diese Adresse wird der Empfänger für alle Belohnungen dieses Validators und sein vollständiges ETH-Guthaben sein, sobald er die Beacon Chain verlässt.

Reguläre Rocket Pool Node Operators müssen sich um nichts davon kümmern, da das Protokoll dies automatisch für Ihre Minipools eingerichtet hat, als Sie sie erstellt haben.
_Jedoch_, im Rahmen dieser neuen Anforderung für Solo-Validatoren bringt Atlas eine aufregende Möglichkeit: die Fähigkeit, **einen speziellen Minipool zu erstellen**, der zur Withdrawal-Adresse für Ihren **bestehenden Solo-Validator** wird.

Mit anderen Worten, dies ermöglicht es Ihnen, **einen Solo-Validator direkt in einen Rocket Pool Minipool umzuwandeln, ohne ihn beenden zu müssen!**

Das bedeutet, Sie erhalten alle Vorteile von Rocket Pool Minipools, einschließlich:

- Die Fähigkeit, Ihren einen Validator (mit einem 32 ETH Bond) in **vier Minipools** umzuwandeln (jeder mit einem 8 ETH Bond), wodurch sich Ihre Präsenz auf der Beacon Chain effektiv **vervierfacht**
- Kommission auf den Teil dieser Minipools, der von rETH-Stakern bereitgestellt wird
- Zugang zum [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) von Rocket Pool, um Belohnungen aus Block-Proposals und MEV zu poolen und gleichmäßig zu verteilen

Um mehr über die Umwandlung eines Solo-Validators in einen Minipool zu erfahren, besuchen Sie bitte die Anleitung [Umwandlung eines Solo-Validators in einen Minipool](../../node-staking/solo-staker-migration).

## Neue Smartnode-Features

Zusätzlich zu Kernänderungen am Rocket Pool-Protokoll bringt Atlas auch einige aufregende Upgrades für den Smartnode-Stack selbst mit sich, die in v1.9.0 vorhanden sind.

### Automatische Belohnungsverteilungen

Wenn Sie bereits ein aktiver Rocket Pool Node Operator sind, sind Sie möglicherweise mit dem `rocketpool_node`-Prozess vertraut, der bestimmte automatisierte Prozesse verwaltet.
Zum Beispiel stellt er sicher, dass Sie den richtigen Fee Recipient haben, und führt automatisch die zweite `stake`-Transaktion für Sie aus, nachdem `prelaunch`-Minipools die 12-Stunden-Scrub-Überprüfung bestanden haben.

Ab Atlas hat der `node` eine neue Aufgabe: **automatische Verteilung von Minipool-Belohnungen!**
Dies liegt an der Funktionsweise [des Shapella-Upgrades](../../node-staking/skimming), indem Ihre Belohnungen alle paar Tage von der Beacon Chain in Ihren Minipool geskimmt werden.

Wann immer einer Ihrer Minipools ein Guthaben erreicht, das größer ist als ein vom Benutzer festgelegter Schwellenwert (Standard von 1 ETH), führt der Node automatisch `distribute-balance` darauf aus.
Dies sendet Ihren Anteil der Belohnungen an Ihre Withdrawal-Adresse und den Anteil des Pool-Stakers zurück in den Deposit Pool.

Das Ändern des Schwellenwerts kann im Abschnitt `Smartnode and TX Fees` der `service config` TUI unter der Einstellung `Auto-Distribute Threshold` vorgenommen werden.

### Einheitliches Grafana Dashboard

Auf vielfachen Wunsch haben wir ein neues [**Grafana Dashboard**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) erstellt, um Node Operators dabei zu helfen, den Status, Fortschritt und die allgemeine Gesundheit ihrer Nodes zu verfolgen und zu bewerten:

![](../../node-staking/images/grafana-1.3.jpg)

Es bietet die folgenden stark nachgefragten Funktionen:

- Unterstützung für alle Execution- und Consensus-Clients in einem einzigen Dashboard - kein Wechseln von Dashboards mehr basierend darauf, welche Clients Sie verwenden!
- Execution Client-Statistiken, einschließlich CPU- und RAM-Nutzung sowie Peer-Anzahl
- Attestierungsgenauigkeitsverfolgung, die verfolgt, wie "korrekt" Ihre Attestierungen für die vorherige Epoche waren, sodass Sie wissen, wie weit Sie von optimalen Belohnungen entfernt sind
- Verfolgung des Guthabens des Smoothing Pools
- Verfolgung von beanspruchten und nicht beanspruchten Belohnungen, jetzt einschließlich ETH aus dem Smoothing Pool
- Statistiken über Snapshot-basierte Governance-Abstimmungen von Rocket Pool
- Platz für die Verfolgung des verwendeten Speicherplatzes und der Temperatur einer zweiten SSD, wenn Sie eine für Ihr OS und eine andere für Ihre Chain-Daten haben
- Und mehr!

Sie können das neue Dashboard vom offiziellen Grafana-Service mit der ID `21863` importieren, indem Sie unsere [Grafana-Anleitung](../../node-staking/grafana.mdx) befolgen.

Dieses neue Dashboard war eine Herzensangelegenheit, an der Community-Mitglied **0xFornax** umfassend mitgewirkt hat - vielen Dank für all Ihre harte Arbeit!

### Nimbus-Änderungen

Smartnode v1.9.0 führt **Split-Mode-Unterstützung** für Nimbus ein!
Anstatt den Beacon Node und den Validator Client in einem einzigen Prozess/Container auszuführen, führt der Smartnode sie jetzt in separaten Containern wie die anderen Clients aus. Dies hat folgende Vorteile:

- Nimbus unterstützt jetzt **Fallback-Clients** (einen sekundären Execution Client und Beacon Node, mit dem sich der Validator Client von Nimbus verbinden kann, wenn Ihre primären Clients für Wartungsarbeiten ausgefallen sind, wie z.B. Neusynchronisierung).
- Nimbus wird jetzt im **Externally-Managed (Hybrid) Mode** unterstützt, sodass Sie den Validator Client, den der Smartnode verwaltet, mit einem externen Beacon Node koppeln können, den Sie selbst warten.
- Der Beacon Node muss nach dem Hinzufügen neuer Minipools nicht mehr neu gestartet werden, was bedeutet, dass Sie keine Attestierungen verlieren, während er sich wieder mit seinen Peers verbindet.

### Lodestar-Unterstützung

[Lodestar](https://chainsafe.github.io/lodestar/) wird jetzt als Option für Ihren Consensus Client Ihrer Wahl unterstützt!
Dies ist die neueste Ergänzung, die offiziell zum [Launchpad von Ethereum](https://launchpad.ethereum.org/en/lodestar) hinzugefügt wurde, und ist bereit für die Validierung.
Lodestar unterstützt viele der großartigen Funktionen, die Sie von den anderen Clients lieben gelernt haben, einschließlich Doppelgänger-Erkennung, MEV-Boost, extern verwaltete Clients (Hybrid-Modus) und mehr!

### Neues Network Snapshot System

Auf einer etwas technischeren Ebene führt v1.9.0 ein brandneues System ein, um schnell einen Snapshot des Zustands von **allem über Ihren Node** sowohl auf der Execution- als auch auf der Consensus-Layer zu erfassen.
Unter der Haube nutzt dieses System [MakerDAOs Multicall-Vertrag](https://github.com/makerdao/multicall) und Will O'Beirnes [Ethereum Balance Checker-Vertrag](https://github.com/wbobeirne/eth-balance-checker), um Tausende einzelner Execution Client-Anfragen in eine einzige Anfrage zu bündeln.

Dies macht den `node`-Prozess für Node Operators mit einer großen Anzahl von Validatoren viel weniger belastend für den Execution Client und sollte seine CPU-Last erheblich reduzieren, was Attestierungen und Gesamtbelohnungen verbessern wird.

Dieses neue System hat es noch nicht in die CLI selbst geschafft, sodass alle Befehle, die Sie dort ausführen (wie `rocketpool minipool status`), weiterhin das alte Single-Query-Setup verwenden.
Im Laufe der Zeit werden wir es auch in die CLI einführen, was alle ihre Befehle blitzschnell machen wird (_außer dem Warten auf die Validierung von Transaktionen, das dauert immer noch eine Weile_).
