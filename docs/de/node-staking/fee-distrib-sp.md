# Fee Distributors und der Smoothing Pool

Node-Betreiber erhalten **Priority Fees** (**Trinkgelder**) aus den Transaktionen, die sie in alle von ihnen vorgeschlagenen Blöcke auf der Ethereum-Chain aufnehmen.
Diese Gebühren stammen von der Execution Layer und verbleiben dort.

Im Gegensatz zu den meisten Validierungsbelohnungen, die auf der Consensus Layer generiert und automatisch periodisch abgehoben werden, sind diese Gebühren _sofort liquid_.
Im Allgemeinen liefern Priority Fees fast genauso viel ETH wie Beacon Chain Belohnungen, daher sind sie ein sehr schöner Vorteil des Merge.

::: tip HINWEIS
Zur schnellen Erinnerung hier eine Aufschlüsselung der verschiedenen Arten von Belohnungen und auf welcher Layer sie bereitgestellt werden:

- Consensus Layer: Attestierungen, Blockvorschläge, Sync-Komitees, Slashing-Meldungen
- Execution Layer: Priority Fees und MEV (im nächsten Abschnitt besprochen) aus Blockvorschlägen

:::

## Fee Recipients

Wenn Sie einen Block auf der Ethereum-Chain vorschlagen, muss das Protokoll wissen, wohin die Trinkgelder aus jeder in Ihrem Block enthaltenen Transaktion gesendet werden sollen.
Es kann sie nicht an die Adresse Ihres Validators senden, da diese auf der Consensus Layer ist - nicht auf der Execution Layer.
Es kann sie nicht an Ihre Minipool-Adresse senden, da es auch für Solo-Staker funktionieren muss und Solo-Staker keine Adresse auf der Execution Layer haben, die mit ihren Validatoren verbunden ist, wie es bei Rocket Pool der Fall ist.

Stattdessen funktioniert es ziemlich einfach: Wenn Rocket Pool Ihren Validator Client startet, übergibt es ein Argument namens **Fee Recipient**.
Der Fee Recipient ist einfach eine Adresse auf der Execution Layer, wohin Sie die Trinkgelder senden möchten.

Der `Fee Recipient` Ihres Nodes kann einer der folgenden speziellen Contracts sein:

- Ihr eigener persönlicher **Fee Distributor**
- Der **Megapool**-Contract Ihres Nodes
- Der **Smoothing Pool** (Opt-in)

Der Smart Node setzt automatisch den korrekten Fee Recipient basierend auf Ihrer Konfiguration:

| Smoothing Pool Status | Hat Megapool-Validatoren | Hat Minipools | Fee Recipient |
|----------------------|-------------------------|---------------|---------------|
| Angemeldet | Nein | Ja | Smoothing Pool-Adresse |
| Angemeldet | Ja | Nein | Smoothing Pool-Adresse |
| Angemeldet | Ja | Ja | Smoothing Pool-Adresse (alle Validatoren) |
| Abgemeldet | Nein | Ja | Fee Distributor Contract-Adresse |
| Abgemeldet | Ja | Nein | Megapool Contract-Adresse |
| Abgemeldet | Ja | Ja | Megapool-Validatoren → Megapool-Adresse<br>Minipool-Validatoren → Fee Distributor-Adresse<br>(Pro Validator über [keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient) gesetzt) |



Rocket Pool ist so konzipiert, dass diese Belohnungen fair zwischen Ihnen und den rETH-Pool-Stakern verteilt werden, auf die gleiche Weise, wie es Ihre Beacon Chain Belohnungen fair verteilt: Ihr Anteil aller Priority Fees, die Ihre Minipool-Validatoren verdienen, geht an Sie (plus der durchschnittlichen Provision all Ihrer Minipools), und der verbleibende Anteil geht an die Pool-Staker (minus Ihrer durchschnittlichen Provision).
Der genaue Anteil hängt von der Anzahl Ihrer 8 ETH-bonded, 16 ETH-bonded Minipools und 4 ETH-bonded Megapool-Validatoren ab.

Kurz gesagt, der **Fee Distributor** ist ein einzigartiger Contract, der mit Ihrem Node verbunden ist und Ihre Priority Fees sammelt und fair zwischen Ihnen und den rETH-Stakern aufteilt.
Er ist wie Ihr persönlicher Tresor für Priority Fees.
Jeder (einschließlich Sie) kann sein Guthaben jederzeit verteilen, um sicherzustellen, dass die Belohnungen immer für rETH-Staker verfügbar sind.

Der **Smoothing Pool** ist ein spezieller Opt-in-Contract, der es allen teilnehmenden Node-Betreibern ermöglicht, ihre Priority Fees zusammenzufassen und zu poolen, und sie während jedes Rocket Pool Belohnungsintervalls (derzeit alle 28 Tage) gleichmäßig unter den Teilnehmern und den rETH-Pool-Stakern zu verteilen.
Dies ist eine sehr überzeugende Funktion für Node-Betreiber, die sich nicht um den Glücksfaktor bei Blockvorschlägen mit hohen Priority Fees sorgen möchten und lieber einen schönen, regelmäßigen, konsistenten monatlichen Ertrag hätten.

Wir werden beide unten behandeln, damit Sie den Unterschied verstehen und ob Sie dem Smoothing Pool beitreten möchten oder nicht.

::: tip HINWEIS
Für Minipools, die nach dem 2024-10-28 erstellt wurden, wird der Smoothing Pool DRINGEND EMPFOHLEN, da er zur Verteilung der Bonusprovision verwendet wird. Wenn Sie sich gegen den Smoothing Pool entscheiden, erhalten diese Minipools insgesamt 5% Provision. Wenn Sie sich für den Smoothing Pool entscheiden, erhalten diese Minipools zwischen 10% (kein RPL gestaked) und 14% (RPL-Stake ist mit 10% des geliehenen ETH oder mehr bewertet) Provision.
:::

## Ihr Fee Distributor

Ihr Fee Distributor ist ein einzigartiger Contract auf der Execution Layer, der **spezifisch für Ihren Node** ist.
Er hält alle Priority Fees, die Sie im Laufe der Zeit verdient haben, und enthält die Logik, die erforderlich ist, um sie fair auf die rETH-Pool-Staker und Ihre Abhebungsadresse zu verteilen.
Dieser Verteilungsprozess **kann von jedem aufgerufen werden** (einschließlich rETH-Stakern), und kann **jederzeit** durchgeführt werden.
Es gibt kein Zeitlimit, bevor Belohnungen ablaufen.

Die Adresse Ihres Node-Fee Distributors ist **deterministisch basierend auf Ihrer Node-Adresse**.
Das bedeutet, sie ist im Voraus bekannt, bevor der Fee Distributor überhaupt erstellt wurde.

Neue Rocket Pool Nodes erstellen (initialisieren) ihren Node-Fee Distributor Contract automatisch bei der Registrierung.
Dies muss nur einmal ausgeführt werden.

Eine interessante Folge davon ist, dass die Adresse Ihres Distributors möglicherweise ein Guthaben ansammelt, **bevor** Sie Ihren Fee Distributor Contract initialisiert haben.
Das ist in Ordnung, da Ihr Distributor Zugriff auf all dieses vorhandene Guthaben erhält, sobald Sie ihn initialisieren.

### Anzeigen seiner Adresse und seines Guthabens

Sie können die Adresse und das Guthaben Ihres Fee Distributors als Teil von ansehen:

```shell
rocketpool node status
```

Die Ausgabe sieht so aus:

![](../node-staking/images/status-fee-distributor.png)

### Gebühren von Ihrem Fee Distributor beanspruchen

Sie können das gesamte Guthaben Ihres Fee Distributors mit folgendem Befehl beanspruchen und verteilen:

```shell
rocketpool node distribute-fees
```

Dies sendet Ihren Anteil der Belohnungen an Ihre **Abhebungsadresse**.

::: warning HINWEIS ZU STEUERPFLICHTIGEN EREIGNISSEN
Wann immer Sie einen neuen Minipool erstellen, ruft Rocket Pool automatisch `distribute-fees` auf.
Dies soll sicherstellen, dass alle Gebühren, die Sie angesammelt haben, mit der durchschnittlichen Provision Ihres Nodes verteilt werden, die sich ändern könnte, wenn Sie den neuen Minipool erstellen. Dies gilt nicht für die Erstellung von Megapool-Validatoren.

Beachten Sie auch, dass jeder `distribute-fees` auf Ihrem Fee Distributor aufrufen kann (um zu verhindern, dass Sie rETH-Belohnungen als Geisel halten).
Sie können ein steuerpflichtiges Ereignis haben, wann immer diese Methode aufgerufen wird.

Bitte beachten Sie diese Bedingungen, wenn Sie entscheiden, ob Sie den Smoothing Pool verwenden möchten (unten besprochen).
:::

### Das Penalty System

Um sicherzustellen, dass Node-Betreiber nicht "betrügen", indem sie den in ihrem Validator Client verwendeten Fee Recipient manuell ändern, setzt Rocket Pool ein Penalty System ein.

Die Oracle DAO kann Node-Betreiber bestrafen, die die Protokollregeln nicht einhalten.

Wenn ein Node _nicht_ am Smoothing Pool teilnimmt, gelten die folgenden Adressen als gültige Fee Recipients:

- Die rETH-Adresse
- Die Smoothing Pool-Adresse
- Der Fee Distributor Contract des Nodes
- Der Megapool Contract des Nodes

Wenn ein Node am Smoothing Pool _teilnimmt_, gilt die folgende Adresse als gültiger Fee Recipient:

- Die Smoothing Pool-Adresse

Ein Fee Recipient, der keine der oben genannten gültigen Adressen ist, wird als **ungültig** betrachtet.

Die Smartnode-Software setzt automatisch den korrekten Fee Recipient basierend auf Ihrer Konfiguration (ob Sie am Smoothing Pool teilnehmen und ob Sie Megapool-Validatoren, Minipools oder beides haben). Für Nodes mit sowohl Megapool-Validatoren als auch Minipools bei abgemeldeten Status wird der Fee Recipient pro Validator über die Keymanager API gesetzt. Die vollständige Liste der Bedingungen ist [hier](/de/node-staking/fee-distrib-sp#fee-recipients) zusammengefasst.

Die Smartnode-Software ist so konzipiert, dass ehrliche Benutzer niemals bestraft werden, selbst wenn sie den Validator Client dafür offline nehmen muss.
Wenn dies passiert, hören Sie auf zu attestieren und sehen Fehlermeldungen in Ihren Log-Dateien darüber, warum die Smartnode Ihren Fee Recipient nicht korrekt setzen kann.

## Der Smoothing Pool

Der **Smoothing Pool** ist eine einzigartige Opt-in-Funktion des Rocket Pool Netzwerks, die unseren Node-Betreibern zur Verfügung steht.
Im Wesentlichen wird er zum Fee Recipient für jeden Node-Betreiber, der sich dafür entscheidet, und sammelt kollektiv die Priority Fees aus von diesen Node-Betreibern vorgeschlagenen Blöcken in einem großen Pool. Während eines Rocket Pool Belohnungs-Checkpoints (dieselben, die zur Verteilung von RPL-Belohnungen verwendet werden) wird das gesamte ETH-Guthaben des Pools fair an die Pool-Staker und die Node-Betreiber verteilt, die sich dafür entschieden haben.

Im Wesentlichen ist der Smoothing Pool eine Möglichkeit, die mit der Auswahl für Blockvorschläge verbundene Zufälligkeit effektiv zu eliminieren.
Wenn Sie jemals eine Pechsträhne hatten und monatelang keinen Vorschlag erhalten haben, oder wenn Ihre Blockvorschläge nur niedrige Priority Fees haben, könnte der Smoothing Pool Sie sehr begeistern.

Um die Mathematik leicht verständlich zu machen, hat Community-Mitglied Ken Smith eine [umfassende Analyse](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) zusammengestellt, die die Rentabilität des Smoothing Pools und des Fee Distributors vergleicht, was schön mit diesem Diagramm zusammengefasst wird:

![](../node-staking/images/sp-chart.png)

Kurz gesagt, solange der Smoothing Pool mehr Minipools hat als Sie, ist es wahrscheinlicher, dass Sie durch den Beitritt davon profitieren.

### Die Regeln

Der Smoothing Pool verwendet die folgenden Regeln:

- Während eines Rocket Pool Belohnungs-Checkpoints, wenn das Guthaben des Smoothing Pools zwischen Node-Betreibern (unter Berücksichtigung ihrer Provision), RPL-staking Node-Betreibern, rETH-Stakern und möglicherweise der Rocket Pool DAO verteilt wird. Die genauen Prozentzahlen werden durch die [Protocol Dao (pDAO) Governance](/de/pdao/overview) von Rocket Pool bestimmt.

- Die Teilnahme am Smoothing Pool erfolgt auf **Node-Ebene**. Wenn Sie sich entscheiden, sind alle Ihre Minipools und Megapool-Validatoren dabei.

- Jeder kann jederzeit teilnehmen. Sie müssen ein volles Belohnungsintervall (3 Tage auf Hoodi, 28 Tage auf Mainnet) warten, bevor sie wieder austreten können, um das System zu verhindern (z.B. den SP direkt nach der Auswahl für einen Blockvorschlag zu verlassen).
  - Nach dem Austritt müssen sie ein weiteres volles Intervall warten, um wieder teilzunehmen.

- Der Smoothing Pool berechnet den "Anteil" jedes Validators (Anteil am ETH des Pools für das Intervall), der jedem teilnehmenden Node gehört.
  - Der Anteil ist eine Funktion der Leistung Ihres Validators während des Intervalls (berechnet anhand der Anzahl der gesendeten Attestierungen auf der Beacon Chain und der verpassten) und der Provisionsrate.

- Der Gesamtanteil Ihres Nodes ist die Summe Ihrer Validator-Anteile.

- Der Gesamtanteil Ihres Nodes wird durch die Zeit skaliert, in der Sie teilgenommen haben.
  - Wenn Sie für das gesamte Intervall teilgenommen haben, erhalten Sie Ihren vollen Anteil.
  - Wenn Sie für 30% eines Intervalls teilgenommen haben, erhalten Sie 30% Ihres vollen Anteils.

Wenn Sie an den vollständigen technischen Details der Smoothing Pool-Belohnungsberechnung interessiert sind, lesen Sie bitte die [vollständige Spezifikation hier](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Beitritt und Austritt aus dem Smoothing Pool

Um am Smoothing Pool teilzunehmen, führen Sie den folgenden Befehl aus:

```shell
rocketpool node join-smoothing-pool
```

Dies zeichnet Sie als teilnehmend in den Rocket Pool Contracts auf und ändert automatisch den `Fee Recipient` Ihres Validator Clients von Ihrem Node-Distributor Contract zum Smoothing Pool Contract.

Um den Pool zu verlassen, führen Sie diesen Befehl aus:

```shell
rocketpool node leave-smoothing-pool
```

Dies zeichnet Sie als nicht teilnehmend in den Rocket Pool Contracts auf, und nach einer kurzen Verzögerung wird der `Fee Recipient` Ihres Validator Clients automatisch vom Smoothing Pool Contract zurück zu Ihrem Node-Fee Distributor Contract geändert.

### Beanspruchen von Belohnungen aus dem Smoothing Pool

Belohnungen aus dem Smoothing Pool werden am Ende jedes Belohnungsintervalls mit RPL zusammen gebündelt, unter Verwendung des Redstone Belohnungssystems.
Sie zu beanspruchen ist so einfach wie:

```shell
rocketpool node claim-rewards
```

Wenn Sie am Smoothing Pool teilnehmen, werden Sie feststellen, dass die Menge an ETH, die Sie für jedes Intervall erhalten, mehr als null ist:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Beachten Sie, dass die Smoothing Pool Belohnungen in Intervall 1 hier anzeigen, dass der Node während dieses Intervalls teilgenommen und entsprechend Belohnungen erhalten hat.

Wir werden später im Leitfaden im Abschnitt [Beanspruchen von Belohnungen](./rewards) mehr über das Beanspruchen von RPL- und Smoothing Pool-Belohnungen behandeln.

## Nächste Schritte

Sobald Sie sich entschieden haben, ob Sie dem Smoothing Pool beitreten möchten oder nicht, werfen Sie einen Blick auf den nächsten Abschnitt über MEV und MEV-Belohnungen.
