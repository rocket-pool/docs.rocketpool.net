::: danger WARNUNG
Minipool-Einzahlungen sind derzeit in Vorbereitung auf Saturn 1 deaktiviert.
:::

# Umwandlung eines Solo-Validators in einen Minipool

Als die Beacon Chain zum ersten Mal gestartet wurde, wurden Validatoren mit einem speziellen Paar kryptografischer Schlüssel erstellt - dem **Validator-Schlüssel** und dem **Auszahlungsschlüssel**.

Der Validator-Schlüssel ist ein "Hot-Key", was bedeutet, dass er auf einer aktiven, mit dem Internet verbundenen Maschine gespeichert werden muss; dies ist der Schlüssel, der verwendet wird, um Ihre Attestierungen und Vorschläge zu signieren, und dient auch als Ihre "Adresse" auf der Beacon Chain (die Hex-Zeichenfolge, die zur Identifizierung Ihres Validators verwendet wird).

Der Auszahlungsschlüssel hingegen ist ein "Cold-Key", was bedeutet, dass er _nicht_ (und in der Tat _nicht sollte_) auf einer aktiven, mit dem Internet verbundenen Maschine gespeichert werden.
Er ist dazu gedacht, im Cold Storage weggeschlossen zu werden, sodass er nicht zugänglich ist, bis er benötigt wird.
Im Gegensatz zum Validator-Schlüssel ist der Auszahlungsschlüssel überhaupt nicht für Validierungsaufgaben verantwortlich.
Stattdessen besteht seine einzige Aufgabe darin, das Abheben der Gelder Ihres Validators auf der Beacon Chain zu verwalten (sobald Abhebungen implementiert wurden).

Dieses Dual-Key-System war die anfängliche Architektur, mit der die Beacon Chain gestartet wurde.
Zu dieser Zeit waren weder der Merge noch Abhebungen entworfen worden, aber dieses System wurde als robust genug angesehen, um mit jeder Form umzugehen, die das Protokoll annehmen würde, wenn beide implementiert würden.

Spulen wir vor bis heute, und jetzt haben wir ein viel besseres Verständnis davon, wie Abhebungen funktionieren.
Glücklicherweise wurden sie auf eine Weise implementiert, die es einem bestehenden Solo-Staking-Validator auf der Beacon Chain (der die alten Auszahlungsschlüssel-Credentials verwendet) ermöglicht, **direkt in einen Rocket Pool Minipool umzuwandeln**, ohne den Validator von der Beacon Chain beenden zu müssen!

Wenn Sie daran interessiert sind, mehr über diesen Prozess zu erfahren, dann ist dieser Leitfaden für Sie.
Wir werden behandeln, wie Abhebungen auf Ethereum auf hohem Niveau funktionieren, erklären, wie der Umwandlungsprozess funktioniert, und mit einer detaillierten Anleitung enden, wie Sie Ihren Validator in einen Minipool umwandeln.

## Warum sollte ich umwandeln?

Bevor wir in die technischen Details einsteigen, ist eine sehr wichtige Frage zu beantworten, _warum_ ein Solo-Staker diesen Prozess überhaupt in Betracht ziehen würde.
Die Umwandlung in einen Minipool ist nicht für jeden geeignet, aber dieser Abschnitt wird Ihnen helfen, eine informierte Entscheidung zu treffen, ob es etwas ist, das Sie verfolgen möchten.

Rocket Pool Minipools genießen mehrere Vorteile gegenüber herkömmlichen Solo-Staking-Validatoren:

- Sie **verdienen Provisionen** auf den Teil des ETH, den sie von den Pool-Stakern leihen (24 ETH).
- Ihr bestehender 32-ETH-Bond könnte verwendet werden, um bis zu **drei zusätzliche Validatoren** zu erstellen (zusätzlich zu dem, den Sie bereits haben).
- Sie sind berechtigt, am [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) teilzunehmen, der alle Execution-Layer-Belohnungen (z.B. aus Block-Vorschlägen und [MEV-Belohnungen](./mev.mdx)) pooled und sie während jedes Belohnungsintervalls fair unter den Teilnehmern verteilt.
- Wenn Sie RPL staken, verdienen sie Bonusprovision und RPL-Inflationsbelohnungen (die derzeit einen höheren APR als ETH-Staking-Belohnungen bieten).

Davon abgesehen gibt es einige Unterschiede, die wichtig hervorzuheben sind:

- Sie müssen **Smart-Contract-Risiko** akzeptieren, da das Protokoll als eine Reihe von Smart Contracts implementiert ist.
- Ebenso nutzt der konventionelle Node-Betrieb den **Smartnode-Stack**; Sie müssen alle Risiken akzeptieren, die mit der Installation und dem Betrieb dieser Software auf Ihrem Node verbunden sind.
- Ein Node-Betreiber zu sein, bedeutet, einige neue Konzepte zu lernen, daher gibt es eine **Lernkurve**, die mit dem Werden eines solchen verbunden ist.
- Minipools müssen ihre Belohnungen mit den Pool-Stakern teilen, daher wird die Auszahlungsadresse des Validators ein Smart Contract auf dem Execution-Layer sein, **nicht eine EOA, die Sie kontrollieren**. Dies gilt auch für Ihren **Fee-Empfänger** für Execution-Layer-Belohnungen, der ebenfalls ein Smart Contract sein muss, der Ihre Belohnungen fair aufteilen kann.
- Rocket Pools **Oracle DAO** ist dafür verantwortlich, Informationen von der Beacon Chain zum Execution-Layer zu transportieren und Verstöße zu erkennen, die das Protokoll nicht durchsetzen kann (wie z.B. eine illegale Fee-Empfänger-Adresse). Das Betreiben eines Minipools bedeutet, dass Sie der Oracle DAO vertrauen müssen, diese Aufgabe korrekt zu erledigen.

Wir ermutigen Sie, diese Vor- und Nachteile sorgfältig durchzugehen, bevor Sie sich entscheiden, Ihren Solo-Validator umzuwandeln.
Wenn Sie mit dem Prozess fortfahren möchten, lesen Sie bitte die nächsten Abschnitte.

## Voraussetzungen

Um den Umwandlungsprozess zu beginnen, müssen Sie die folgenden Kriterien erfüllen:

1. Sie müssen [einen beim Rocket Pool Netzwerk registrierten Node](./prepare-node.mdx) haben, um den neuen Minipool zu hosten.
1. Der Validator, den Sie migrieren möchten, muss auf der Beacon Chain **aktiv** sein. Er kann nicht ausstehend, geslasht, beendet / ausgetreten oder abgehoben sein.
1. Der Validator muss ein Guthaben von **mindestens 32 ETH** auf der Beacon Chain haben.
1. Der Validator muss [BLS-Key-Auszahlungs-Credentials](https://launchpad.ethereum.org/en/withdrawals) (`0x00`-Credentials) haben. Die Umwandlung **kann nicht** bei Validatoren durchgeführt werden, die bereits zu anderen Execution-Layer-Auszahlungs-Credentials (`0x01`-Credentials) migriert wurden.
1. (Optional) Wenn Sie möchten, dass der Smartnode die Auszahlungs-Credentials automatisch für Sie migriert, müssen Sie Ihre **Mnemonik-Phrase zur Hand** haben.

Wenn keine dieser Bedingungen für Sie ein Hindernis darstellt, sind Sie berechtigt, mit der Validator-Umwandlung zu beginnen.

## Prozessübersicht

Der erste Schritt besteht darin, **einen neuen "leeren" Minipool zu erstellen**.
Im Gegensatz zu herkömmlichen Minipools, die während ihrer Erstellung einen neuen Validator erstellen, sind leere Minipools spezielle Minipools, die für die Verwaltung _bestehender_ Validatoren konzipiert sind.
Als Konsequenz verhalten sich leere Minipools während der `prelaunch`-Phase etwas anders als herkömmliche Minipools.
Sobald die Initialisierung abgeschlossen ist und sie in die `staking`-Phase eintreten, werden sie zu herkömmlichen Minipools.

Während der Erstellung eines leeren Minipools erhalten Sie die Option, dass der Smartnode automatisch **die Auszahlungs-Credentials Ihres Validators ändert** vom alten BLS-Auszahlungsschlüssel zur neuen leeren Minipool-Adresse.
Wenn Sie dies jetzt nicht tun möchten, kann der Smartnode es später mit einem dedizierten Befehl tun, oder Sie können es selbst mit einem Drittanbieter-Tool tun.
Beachten Sie, dass das Ändern der Auszahlungs-Credentials des Validators zur Minipool-Adresse für die Umwandlung **erforderlich** ist, daher muss dies unabhängig davon, wie Sie dies tun, für den erfolgreichen Abschluss des Prozesses durchgeführt werden.

Sobald die Auszahlungs-Credentials geändert wurden, haben Sie die Option, **den privaten Schlüssel des Validators zu importieren** in den vom Smartnode verwalteten Validator-Client.
Wenn Sie möchten, dass der Smartnode den Validator verwaltet, damit Sie ihn nicht selbst verwalten müssen, ist dies eine attraktive Option.
Wenn Sie es vorziehen, Ihren eigenen Validator-Client zu betreiben und die Schlüssel dort zu behalten, können Sie dies gerne tun.

An diesem Punkt wird Ihr neuer Minipool in die **Scrub-Check**-Periode eintreten, wo die Oracle DAO kontinuierlich die Informationen Ihres Validators auf der Beacon Chain analysiert, um zu bestätigen, dass sie legal bleiben.
Dies beinhaltet:

- Die Auszahlungs-Credentials wurden entweder noch nicht migriert (sind immer noch die ursprünglichen `0x00` BLS-Key-Credentials) oder wurden zur Adresse des Minipools migriert. Die Migration zu einer anderen Execution-Layer-Adresse führt dazu, dass der Pool gescrubt wird.
  - Wenn die Auszahlungs-Credentials zum Zeitpunkt des Endes der Scrub-Check-Periode immer noch die ursprünglichen `0x00` BLS-Key-Credentials sind, wird der Pool gescrubt.
- Der Validator befindet sich für die Dauer der Überprüfung im aktiv stakenden Zustand. Wenn er in die Zustände geslasht, ausgetreten oder abgehoben übergeht, wird der Pool gescrubt.

::: tip HINWEIS
Ein **geScrubbter** leerer Minipool bedeutet, dass er nicht Teil des Rocket Pool Netzwerks ist, aber er gibt Ihnen (dem Node-Betreiber) dennoch Zugriff auf alle Ihre Gelder über die typischen Token-Abrufmethoden in der CLI.
Gelder gehen **nicht verloren**, wenn leere Minipools gescrubt werden.
Weitere Informationen zu geScrubbten Minipools, ihren Auswirkungen und deren Verwendung finden Sie später in diesem Leitfaden.
:::

Nach bestandenem Scrub-Check können Sie Ihren leeren Minipool **promoten**.
Dies beendet die Umwandlung und ändert ihn von einem leeren Minipool in einen regulären.
An diesem Punkt verhält sich der Minipool wie jeder andere Minipool im Netzwerk, und Ihr Solo-Validator ist offiziell in einen Rocket Pool Validator umgewandelt!

Als Teil des Prozesses wird das Netzwerk Ihre Gesamtbelohnungen auf der Beacon Chain (und innerhalb Ihres neuen Minipools, falls Sie während des Scrub-Checks geskimmt werden) erfassen.
Es wird erkennen, dass all diese Belohnungen Ihnen gehören und nicht mit dem Staking-Pool geteilt werden sollten, sodass es sie alle als **Rückerstattung** bereitstellt, die Sie jederzeit nach Abschluss der Promotion beanspruchen können.

Nachfolgend finden Sie eine detaillierte Anleitung zum Umwandlungsprozess, einschließlich Anweisungen für jeden Schritt.

## Schritt 1: Erstellen eines leeren Minipools

Um den Umwandlungsprozess zu beginnen, führen Sie den folgenden Befehl mit der Smartnode-CLI aus:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Wenn Sie beispielsweise einen Solo-Validator mit Pubkey `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661` umwandeln möchten, würden Sie ausführen:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Sie sehen eine kurze Zusammenfassung darüber, was während des Prozesses zu erwarten ist, und werden dann aufgefordert, auszuwählen, welchen Bond-Betrag Sie bei der Erstellung dieses Minipools verwenden möchten:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

Sobald Sie **8 ETH** auswählen, wandeln Sie Ihren Validator in einen 8-ETH-gebondeten Minipool um.
Ihre ursprüngliche 32-ETH-Einzahlung wird in eine 8-ETH-Einzahlung umgewandelt, mit 24 ETH, die von den Pool-Stakern geliehen werden.
Sobald der Umwandlungsprozess abgeschlossen ist, haben Sie ein [Guthaben](./credit) von 24 ETH, das Sie verwenden können, um weitere Minipools zu erstellen.

Sobald Sie eine Option ausgewählt haben, führt der Smartnode einige Überprüfungen durch, um zu bestätigen, dass der von Ihnen eingegebene Validator und Ihr Node alle oben aufgeführten Voraussetzungen erfüllen.
Danach werden Sie aufgefordert, Ihren Gaspreis zu bestätigen und dann die Transaktion einzureichen, um den neuen leeren Minipool zu erstellen.
Nach der Erstellung wird Ihnen die Adresse des Minipools angezeigt:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Dies ist die Adresse, die Sie verwenden, wenn Sie die Auszahlungs-Credentials Ihres Validators ändern.

An diesem Punkt fragt der Smartnode, ob Sie möchten, dass der Smartnode dies automatisch tut (zusammen mit dem Import des privaten Schlüssels des Validators in den vom Smartnode verwalteten Validator-Client, was später besprochen wird):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Wenn Sie auf diese Frage mit `y` antworten, führt der Smartnode die Schritte 2 und 3 automatisch aus; siehe den Abschnitt [Automatische Änderung der Auszahlungs-Credentials und Schlüsselimport](#automatic-withdrawal-credential-change-and-key-import) unten.

Wenn Sie auf diese Frage mit `n` antworten, endet der Befehl und Sie haben Schritt 1 abgeschlossen.
Bitte gehen Sie als Nächstes zum Abschnitt [Schritt 2](#step-2-changing-the-validators-withdrawal-credentials).

::: tip HINWEIS
Wenn Sie diesen Prozess jetzt ablehnen, können Sie ihn zu einem späteren Zeitpunkt mit der CLI fortsetzen.
Lesen Sie die Abschnitte [**Schritt 2**](#step-2-changing-the-validators-withdrawal-credentials) und [**Schritt 3**](#optional-step-3-import-the-validator-key) unten, um zu erfahren, wie dies funktioniert.
:::

### Automatische Änderung der Auszahlungs-Credentials und Schlüsselimport

::: danger WARNUNG
Wenn Sie sich dafür entscheiden, dass der Smartnode Ihre Auszahlungs-Credentials automatisch ändert und den privaten Schlüssel Ihres Validators importiert, ist es **unerlässlich**, dass Sie den Validator-Schlüssel aus Ihrem alten, von Ihnen verwalteten Validator-Client entfernen und **den alten Validator-Client herunterfahren**, um sicherzustellen, dass er den Schlüssel nicht noch im Speicher geladen hat.

Sie müssen auch **mindestens 15 Minuten** danach warten, um sicherzustellen, dass er **absichtlich mindestens zwei Attestierungen verpasst hat**.
Sie können dies überprüfen, indem Sie einen Chain-Explorer wie [https://beaconcha.in](https://beaconcha.in) betrachten.

Wenn Sie nicht mindestens 15 Minuten warten, **WIRD IHR VALIDATOR GESLASHT**, wenn der Validator-Client des Smartnodes mit dem Schlüssel Ihres Validators attestiert!

Wir empfehlen dringend, auch **Doppelgänger-Erkennung** in der Smartnode-Konfiguration zu aktivieren, um so sicher wie möglich gegen das Risiko des Slashings zu sein.
:::

Wenn Sie sich dafür entscheiden, den Validator-Schlüssel automatisch zu importieren und die Auszahlungs-Credentials zur Minipool-Adresse zu ändern, fragt der Smartnode zunächst nach der Mnemonik, die zur Generierung sowohl des privaten BLS-Schlüssels Ihres Validators als auch des entsprechenden ursprünglichen Auszahlungsschlüssels verwendet wurde:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Nach Eingabe leitet der Smartnode Ihren alten BLS-basierten Auszahlungsschlüssel mithilfe der Mnemonik und des Pubkeys des Validators ab.
Er wird dann eine Nachricht an die Beacon Chain senden, signiert von Ihrem Auszahlungsschlüssel, die angibt, dass Sie die Auszahlungs-Credentials vom alten BLS-Auszahlungsschlüssel zur neuen Minipool-Adresse ändern möchten:

```
Changing withdrawal credentials to the minipool address... done!
```

Schließlich importiert er den Schlüssel Ihres Validators in den Validator-Client des Smartnodes und fragt, ob Sie ihn neu starten möchten, damit er mit diesem Schlüssel validiert:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Damit sind die Schritte 2 und 3 abgeschlossen.
Sie können überprüfen, dass die Auszahlungs-Credentials ordnungsgemäß geändert wurden und dass der Schlüssel aktiv validiert, indem Sie einen Chain-Explorer wie [https://beaconcha.in](https://beaconcha.in) verwenden.

Gehen Sie zum Abschnitt [Schritt 4](#step-4-waiting-for-the-scrub-check), um mehr über den Scrub-Check zu erfahren.

## Schritt 2: Ändern der Auszahlungs-Credentials des Validators

Wenn Sie den neuen leeren Minipool erstellt haben, ist der nächste Schritt, die Auszahlungs-Credentials Ihres Validators von den alten `0x00` BLS-Key-Credentials zu den neuen `0x01`-Credentials zu ändern, die die neue Minipool-Adresse enthalten.

Es gibt zwei Möglichkeiten, dies zu tun:

1. Verwendung der Smartnode-CLI über den Befehl `rocketpool minipool set-withdrawal-creds`.
1. Verwendung eines externen Drittanbieter-Tools wie [ethdo](https://github.com/wealdtech/ethdo).

In diesem Leitfaden werden wir durchgehen, wie man Methode 1 (den Smartnode) verwendet.
Weitere Informationen zu Methode 2 finden Sie in der Dokumentation für das Tool, das Sie verwenden möchten.

Beginnen Sie mit dem folgenden Befehl:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Wenn beispielsweise die neue leere Minipool-Adresse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C` war, würden Sie dies ausführen:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Der Smartnode fragt dann nach der Mnemonik, die zur Generierung sowohl des Schlüssels Ihres Validators als auch des entsprechenden Auszahlungsschlüssels verwendet wurde:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Danach führt er einige Sicherheitsüberprüfungen durch, um sicherzustellen, dass die Auszahlungs-Credentials Ihres Validators geändert werden können.
Wenn es erfolgreich ist, sendet er dann eine Nachricht an die Beacon Chain, signiert von Ihrem Auszahlungsschlüssel, die angibt, dass Sie die Auszahlungs-Credentials vom alten BLS-Auszahlungsschlüssel zur neuen Minipool-Adresse ändern möchten:

```
Changing withdrawal credentials to the minipool address... done!
```

Das war's!
Sie können überprüfen, dass die Auszahlungs-Credentials ordnungsgemäß geändert wurden, indem Sie einen Chain-Explorer wie [https://beaconcha.in](https://beaconcha.in) verwenden.

## (Optional) Schritt 3: Importieren des Validator-Schlüssels

Sobald Sie Ihren Validator in einen Minipool umgewandelt haben, möchten Sie möglicherweise, dass der Validator-Client des Smartnodes ihn betreibt, anstatt des von Ihnen derzeit verwalteten.
Dies hat einige Vorteile:

- Es ist "sauberer" aus organisatorischer Sicht (der Smartnode verwaltet Ihre Minipools, Ihr extern verwalteter Validator-Client verwaltet Ihre Solo-Staking-Validatoren).
- Es ermöglicht Befehle wie `rocketpool minipool exit` (Befehle, die Ihren Validator-Schlüssel zum Signieren von Nachrichten benötigen) zu funktionieren.

Es gibt jedoch einige **sehr wichtige Überlegungen**, die Sie verstehen sollten, bevor Sie dies tun:

- Sie **müssen sicherstellen**, dass der Schlüssel Ihres Validators aus Ihrem eigenen Validator-Client entfernt wurde und dass Sie mindestens 15 Minuten nach dem Entfernen gewartet haben, bevor Sie ihn in den Smartnode importieren. Siehe das Warnfeld unten.
- Sie **müssen sicherstellen**, dass Sie Ihren Validator-Keystore _und dessen Passwortdatei_ gesichert haben, da Befehle wie `rocketpool wallet recover` und `rocketpool wallet rebuild` sie **nicht** ohne Backup regenerieren können, da sie nicht von der Mnemonik der Smartnode-Wallet abgeleitet wurden.

Wenn Sie Ihren Validator-Schlüssel in den Smartnode importieren möchten, lesen Sie weiter unten.

::: danger WARNUNG
Wenn Sie sich dafür entscheiden, dass der Smartnode den privaten Schlüssel Ihres Validators importiert, ist es **unerlässlich**, dass Sie den Validator-Schlüssel aus Ihrem alten, von Ihnen verwalteten Validator-Client entfernen und **den alten Validator-Client herunterfahren**, um sicherzustellen, dass er den Schlüssel nicht noch im Speicher geladen hat.

Sie müssen auch **mindestens 15 Minuten** danach warten, um sicherzustellen, dass er **absichtlich mindestens zwei Attestierungen verpasst hat**.
Sie können dies überprüfen, indem Sie einen Chain-Explorer wie [https://beaconcha.in](https://beaconcha.in) betrachten.

Wenn Sie nicht mindestens 15 Minuten warten, **WIRD IHR VALIDATOR GESLASHT**, wenn der Validator-Client des Smartnodes mit dem Schlüssel Ihres Validators attestiert!

Wir empfehlen dringend, auch **Doppelgänger-Erkennung** in der Smartnode-Konfiguration zu aktivieren, um so sicher wie möglich gegen das Risiko des Slashings zu sein.
:::

Beginnen Sie mit dem folgenden Befehl:

```
rocketpool minipool import-key <minipool address>
```

Wenn beispielsweise die neue leere Minipool-Adresse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C` war, würden Sie dies ausführen:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Der Smartnode fragt dann nach der Mnemonik, die zur Generierung des Schlüssels Ihres Validators verwendet wurde:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Danach durchläuft er die verschiedenen Schlüssel, die aus dieser Mnemonik generiert wurden, bis er den öffentlichen Schlüssel Ihres Validators findet.
Er importiert ihn dann und fragt, ob Sie den Validator-Client des Smartnodes neu starten möchten, damit er Ihren Schlüssel lädt:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Damit ist Ihr Validator-Schlüssel jetzt in den Smartnode importiert und Sie sollten sehen, dass er attestiert.
Sie können dies bestätigen, indem Sie die Logs des Validator-Clients mit diesem Befehl verfolgen:

```
rocketpool service logs validator
```

Sie können auch überprüfen, dass ein Chain-Explorer wie [https://beaconcha.in](https://beaconcha.in) sehen kann, dass Ihr Validator-Client mit dem Schlüssel Ihres Validators attestiert.

## Schritt 4: Zuweisen des korrekten Fee-Empfängers

Sobald Sie den Migrationsprozess gestartet haben, ist es **unerlässlich**, dass Sie sicherstellen, dass Ihr [Fee-Empfänger](./fee-distrib-sp#fee-recipients) richtig eingestellt ist (entweder auf den [Fee-Distributor](./fee-distrib-sp#your-fee-distributor) Ihres Nodes oder auf den [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool), wenn Sie sich dafür entschieden haben).
Wenn Sie dies nicht tun und ihn auf dem Fee-Empfänger für Ihre Solo-Validatoren belassen, werden Sie bestraft und ein Teil Ihres Beacon-Chain-Stakes wird abgezogen, um den Verlust auszugleichen.

::: tip HINWEIS
**Dieser Schritt ist nur erforderlich, wenn Sie Ihren Validator-Schlüssel in Ihrem eigenen extern verwalteten Validator-Client belassen.**

Wenn Sie ihn aus Ihrem eigenen VC entfernen und in den von Rocket Pool verwalteten VC importieren, wird Ihr Fee-Empfänger automatisch vom `node`-Prozess der korrekten Adresse zugewiesen.
:::

Da Sie möglicherweise andere Solo-Staking-Schlüssel in Ihrem VC behalten, die Sie _nicht_ auf den Fee-Distributor oder Smoothing Pool setzen möchten, besteht die einzige Möglichkeit, dies zu erreichen, darin, eine VC-Konfigurationsdatei zu verwenden, um den Fee-Empfänger für den zu migrierenden Validator manuell festzulegen.

Dieser Prozess hängt davon ab, welchen Consensus-Client Sie verwenden; konsultieren Sie die Dokumentation für die Einzelheiten, aber hier sind einige hilfreiche Links:

[Lighthouse: über `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** unterstützt derzeit nicht das Festlegen validatorspezifischer Fee-Empfänger. Bitte verwenden Sie Lodestar nicht, wenn Sie den Schlüssel in Ihrem extern verwalteten VC mit anderen Solo-Keys behalten, die nicht migriert werden.

[Nimbus: über die Keymanager-API](https://nimbus.guide/keymanager-api.html)

[Prysm: über `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: über `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Wenn Sie eth-docker verwenden, können Sie den Befehl [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) verwenden, um individuelle Empfänger für jeden von Ihnen verwendeten Schlüssel festzulegen, wie in ihrer Dokumentation beschrieben.

## Schritt 5: Warten auf den Scrub-Check

Zu diesem Zeitpunkt sollten Sie die Schritte 1 und 2 (Erstellen des leeren Minipools und Ändern der Auszahlungs-Credentials Ihres Validators) und optional Schritt 3 (Importieren des Schlüssels in den Smartnode) abgeschlossen haben.
Der nächste Schritt besteht darin, auf den Abschluss des **Scrub-Checks** zu warten.
Dies ist ein von der Oracle DAO durchgeführter Prozess, um Folgendes zu überprüfen:

1. Das Guthaben Ihres Validators auf der Beacon Chain (und das Guthaben Ihres Minipools auf dem Execution-Layer) muss sich auf **mindestens** das Guthaben summieren, das Ihr Validator hatte, als Sie den leeren Minipool zum ersten Mal erstellt haben, minus eines kleinen Puffers von 0,01 ETH, um versehentlich verpasste Attestierungen während der Wartung zu berücksichtigen.

- Wenn Ihr Validator beispielsweise ein Beacon-Chain-Guthaben von 35 ETH hatte, als Sie Schritt 1 ausgeführt haben, müssen die kombinierten Beacon-Chain- und Minipool-Guthaben während der gesamten Dauer des Scrub-Checks **mindestens** 34,99 ETH betragen.

2. Ihr Validator muss während des gesamten Scrub-Checks im **aktiv stakenden** Status bleiben - er kann nicht geslasht, ausgetreten oder abgehoben werden.
3. Die Auszahlungs-Credentials Ihres Validators müssen entweder die **ursprünglichen BLS-basierten Auszahlungsschlüssel-Credentials** oder die **neuen 0x01-Credentials unter Verwendung der Minipool-Adresse** sein. Alle anderen Credentials führen dazu, dass der Minipool gescrubt wird.

- Sie erhalten eine Schonfrist von **ungefähr 2,5 Tagen**, um die Änderung der Auszahlungs-Credentials durchzuführen (85% der 3-tägigen Dauer der Scrub-Periode).

Der Scrub-Check ist vorübergehend; Sie müssen während dieser Zeit nichts anderes tun, als Ihren Validator online zu halten und gut zu performen.

Um zu überwachen, wie viel Zeit im Scrub-Check verbleibt, können Sie die `node`-Logs mit folgendem Befehl betrachten:

```
rocketpool service logs node
```

Die relevanten Zeilen sehen so aus:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

Es dauert **3 Tage**, danach haben Sie bestanden und können mit [Schritt 6](#step-6-promoting-the-minipool) fortfahren, um den leeren Minipool zu einem vollständigen zu promoten.

### Arbeiten mit geScrubbten Minipools

Wenn Ihr Minipool leider den Scrub-Check nicht besteht und aufgelöst wird, keine Sorge - Ihr Kapital ist nicht verloren.
Aufgelöste leere Minipools fungieren im Wesentlichen als vereinfachte Auszahlungsadressen:

- Sie sind technisch nicht Teil des Rocket Pool Netzwerks.
- Jedes in den Minipool eingezahlte Kapital gehört _ausschließlich_ dem Node-Betreiber. Es wird _nicht_ mit den Pool-Stakern geteilt.
- Sie erhalten kein Einzahlungsguthaben für die Erstellung des Minipools.

Sie können jederzeit auf das Guthaben des Minipools mit folgendem Befehl zugreifen:

```shell
rocketpool minipool distribute-balance
```

Dies sendet das gesamte Guthaben des Minipools an die Auszahlungsadresse Ihres Nodes.

Wenn Sie Ihren Validator von der Beacon Chain beendet haben und sein vollständiges Guthaben an den Minipool gesendet wurde, können Sie es abrufen und den Minipool mit folgendem Befehl schließen:

```shell
rocketpool minipool close
```

Auch dies sendet das volle Guthaben des Minipools an die Auszahlungsadresse Ihres Nodes.

## Schritt 6: Promoten des Minipools

Wenn der Scrub-Check erfolgreich bestanden wurde, können Sie den leeren Minipool zu einem vollständigen Minipool promoten.
Dies kann auf zwei Arten erfolgen:

1. Lassen Sie den `node`-Prozess es automatisch erledigen, sobald der Scrub-Check endet.
1. Tun Sie es manuell mit der CLI.

Die erste Methode promotet den Minipool automatisch für Sie, vorausgesetzt, Sie haben den `node`-Prozess / Container laufen und die Gaskosten des Netzwerks liegen unter der automatischen Transaktionsschwelle, die Sie im Smartnode-Konfigurationsprozess angegeben haben (Standard ist 150).
In den `node`-Logs sehen Sie eine Ausgabe wie folgt:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

Wenn Ihr `node`-Prozess deaktiviert ist, können Sie die zweite Methode über folgenden Befehl verwenden:

```shell
rocketpool minipool promote
```

Wählen Sie von hier aus einfach Ihren leeren Minipool aus der Liste der für die Promotion in Frage kommenden Minipools aus und reichen Sie die Transaktion ein.

## Beanspruchen Ihrer ursprünglichen Vorumwandlungs-Belohnungen

Nach der Promotion wird Ihr Minipool in den `staking`-Status eintreten und ist offiziell ein regulärer Rocket Pool Minipool geworden.
Sie können die Details mit diesem Befehl überprüfen:

```shell
rocketpool minipool status
```

Dies zeigt Ihnen den Status Ihres neuen Minipools, seine Guthaben, seine Rückerstattung usw.
Zum Beispiel:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Hier sehen Sie folgende wichtige Informationen:

- `Node deposit` zeigt, wie viel ETH Sie persönlich als Teil dieses Minipools gebondet haben (in diesem Fall 8 ETH).
- `RP deposit` zeigt, wie viel ETH Sie von den Pool-Stakern geliehen haben, um den Minipool zu erstellen (in diesem Fall 24 ETH).
- `Available refund` zeigt, wie viel des Guthabens des Minipools direkt an Sie geht (wird _nicht_ mit den Pool-Stakern geteilt). Dies entspricht allen Ihren Belohnungen auf der Beacon Chain zu dem Zeitpunkt, als Sie den leeren Minipool erstellt haben.
- `Minipool Balance (EL)` zeigt das Gesamtguthaben des Minipool-Contracts.
- `Your portion (EL)` zeigt, wie viel des Guthabens Ihnen gehört, _nachdem_ die Rückerstattung vom Guthaben des Minipools abgezogen wurde. Mit anderen Worten, dies ist Ihr Anteil an den Belohnungen, die Sie verdient haben, _nachdem_ Sie den leeren Minipool erstellt haben.
- `Total EL rewards` ist Ihre Rückerstattung plus Ihre Nach-Umwandlungs-Belohnungen.

Um Ihre Rückerstattung zu beanspruchen, führen Sie folgenden Befehl aus:

```shell
rocketpool minipool refund
```

Wählen Sie einfach Ihren Minipool aus der Liste aus, genehmigen Sie die Transaktion, und Ihre Rückerstattung wird an die Auszahlungsadresse Ihres Nodes gesendet.

## Verwendung Ihres Node-Guthabens

Jetzt, da Sie einen aktiven promoten Minipool haben, werden Sie feststellen, dass Ihr Node ein Guthaben hat, wenn Sie `rocketpool node status` ausführen:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

In diesem Beispiel haben wir, da wir den ursprünglichen 32-ETH-Validator-Bond in einen 8-ETH-Minipool umgewandelt haben, [**24 ETH Guthaben**](./credit) erhalten.
Dieses Guthaben kann verwendet werden, um neue Minipools und Validatoren kostenlos zu erstellen!

Führen Sie einfach den Befehl `rocketpool node deposit` aus und wählen Sie aus, welchen Bond-Betrag Sie verwenden möchten.
Wenn genug ETH in Ihrem Guthaben vorhanden ist, um den Bond zu decken, wird es automatisch verwendet und Sie müssen kein zusätzliches ETH staken (obwohl Sie immer noch für Gas bezahlen müssen).

::: warning HINWEIS
Das für Ihr Guthaben verwendete ETH stammt aus dem Staking-Pool.
Wenn der Staking-Pool nicht genug ETH hat, um Ihr Guthaben zu decken, können Sie es erst verwenden, wenn mehr ETH eingezahlt wurde.
:::
