# Die Verantwortlichkeiten eines Node Operators

## Wie Ethereum Staking funktioniert

Zur Erinnerung: Staking in Proof of Stake erfolgt über **Validatoren**.
Ein Validator ist im Wesentlichen eine einzelne Beacon-Chain-Adresse, auf die 32 ETH auf der Execution-Schicht eingezahlt wurden.
Validatoren sind für die Aufrechterhaltung der Konsistenz und Sicherheit der Beacon Chain verantwortlich.
Sie tun dies, indem sie auf Transaktionen und neue Blockvorschläge hören und **bestätigen**, dass der vorgeschlagene Block legale, gültige Transaktionen enthält, indem sie im Hintergrund einige Zahlenverarbeitung und Verifizierung durchführen.
Gelegentlich dürfen sie selbst neue Blöcke vorschlagen.

Validatoren werden **nach einem zufälligen Zeitplan** Bestätigungen und Blockvorschlägen zugewiesen.
Dies unterscheidet sich stark vom alten Proof-of-Work-System, bei dem alle ständig versuchten, sich gegenseitig zu überholen und den nächsten Block vor allen anderen zu finden.
Das bedeutet, dass im Gegensatz zu Proof of Work, wo Miner keine Blockbelohnung garantiert erhielten, es sei denn, sie fanden den nächsten Block, Proof-of-Stake-Validatoren _garantiert_ ein langsames, stetiges Einkommen haben, solange sie ihre Pflichten erfüllen.
Wenn ein Validator offline ist und eine Bestätigung oder einen Blockvorschlag verpasst, wird er **leicht bestraft**.
Die Strafen sind jedoch recht klein; als Faustregel gilt: Wenn ein Validator X Stunden offline ist, wird er alle verlorenen ETH nach den gleichen X Stunden, in denen er wieder online ist, zurückgewinnen.

### Belohnungen

Validatoren verdienen Consensus-Layer-Belohnungen durch Bestätigungen, Blockvorschläge, Sync-Komitees (selten) und Slashing-Belohnungen (extrem selten). Sie verdienen auch Execution-Layer-Belohnungen durch Priority Fees und MEV.

Seit 10/2024 beträgt der Gesamt-APR etwa 3,5%, wobei 2,8% Consensus-Layer-APR und 0,7% Execution-Layer-APR sind. Eine Quelle für diese Informationen ist der [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Strafen

Validatoren werden für kleine Mengen ETH bestraft, wenn sie offline sind und ihre zugewiesenen Aufgaben nicht erfüllen.
Dies wird als **Leaking** bezeichnet.
Wenn ein Validator gegen eine der Kernregeln der Beacon Chain verstößt und das Netzwerk anzugreifen scheint, kann er **geslasht** werden.
Slashing ist ein erzwungenes Beenden Ihres Validators ohne Ihre Erlaubnis, begleitet von einer relativ großen Geldstrafe, die einen Teil des ETH-Guthabens Ihres Validators entfernt.

Realistischerweise ist die einzige Bedingung, die ein Slashing verursachen kann, wenn Sie die Schlüssel Ihres Validators auf zwei Nodes gleichzeitig ausführen (z. B. in einem Failover-/Redundanz-Setup, bei dem Ihr Backup-Node versehentlich eingeschaltet wird, während Ihr Haupt-Node noch läuft).
Lassen Sie dies nicht zu, und **Sie werden nicht geslasht**.
Slashing _kann nicht_ durch Offline-Sein für Wartungsarbeiten auftreten.

Unten ist eine Tabelle, die die Strafen zeigt, die einem Validator widerfahren können:

| Typ                     | Schicht   | Betrag                                                                                          |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| Verpasste Bestätigung   | Consensus | -0,000011 ETH\* pro Bestätigung (-9/10 des Werts einer normalen Bestätigungsbelohnung)          |
| Verpasster Vorschlag    | Consensus | 0                                                                                               |
| Verpasstes Sync-Komitee | Consensus | -0,00047 ETH\* pro Epoche (-0,1 ETH insgesamt, wenn während des gesamten Sync-Komitees offline) |
| Slashing                | Consensus | Mindestens 1/32 Ihres Guthabens, bis zu Ihrem gesamten Guthaben unter extremen Umständen        |

\*_Variiert basierend auf der Gesamtzahl der Validatoren im Netzwerk.
Ungefähre Werte für 435.000 aktive Validatoren._

::: tip TIPP
Als Faustregel gilt: Wenn Sie X Stunden offline sind (und Sie sich nicht in einem Sync-Komitee befinden), dann werden Sie alle Ihre geleakten ETH nach X Stunden zurückerhalten, sobald Sie wieder online sind und bestätigen.
:::

## Wie Rocket Pool Nodes funktionieren

Im Gegensatz zu Solo-Stakern, die 32 ETH als Einzahlung hinterlegen müssen, um einen neuen Validator zu erstellen, müssen Rocket Pool Nodes nur 8 ETH pro Validator hinterlegen (genannt "Bond ETH").
Dies wird mit 24 ETH aus dem Staking-Pool (genannt "geliehenes ETH", das von Liquid-Staker-Einlagen im Austausch für rETH stammt) kombiniert, um einen neuen Validator zu erstellen.
Dieser neue Validator gehört zu einem **Minipool**.

Für die Beacon Chain sieht ein Minipool genauso aus wie ein normaler Validator.
Er hat die gleichen Verantwortlichkeiten, die gleichen Regeln, die er befolgen muss, die gleichen Belohnungen und so weiter.
Der einzige Unterschied liegt darin, wie der Minipool auf der Execution-Schicht erstellt wurde und wie Abhebungen funktionieren, wenn der Node Operator sich entscheidet, den Minipool freiwillig zu beenden.
Die gesamte Erstellung, Abhebung und Belohnungszuweisung wird von Rocket Pools **Smart Contracts** auf der Ethereum-Chain verwaltet.
Dies macht es vollständig dezentralisiert.

Ein Rocket Pool **Node** ist ein einzelner Computer mit einer Ethereum-Wallet, die bei Rocket Pools Smart Contracts registriert wurde.
Der Node kann dann so viele Minipools erstellen, wie er sich leisten kann, die alle glücklich auf derselben Maschine zusammen laufen.
**Ein einzelner Rocket Pool Node kann viele, viele Minipools betreiben.**
Jeder Minipool hat eine vernachlässigbare Auswirkung auf die Gesamtsystemleistung; einige Leute konnten Hunderte davon auf einem einzigen Node betreiben.

Die Vorlaufkosten eines Minipools betragen 8 ETH. Darüber hinaus kann ein Node Operator RPL auf seinem Node staken, um sich für zusätzliche Belohnungen zu qualifizieren und Stimmrecht innerhalb der Protokoll-DAO zu erhalten.

## Rocket Pool Node Operators

**Node Operators** sind das Herz und die Seele von Rocket Pool.
Sie sind die Personen, die Rocket Pool Nodes betreiben.

### Verantwortlichkeiten

Sie bringen ETH aus dem Staking-Pool zum Arbeiten, indem sie damit Minipools betreiben, die Staking-Belohnungen für das Rocket Pool Protokoll verdienen (und somit den Wert von rETH erhöhen).
Ihre Aufgabe ist unkompliziert, aber von entscheidender Bedeutung: _Validatoren mit der höchstmöglichen Qualität betreiben und Staking-Belohnungen maximieren_.

Node Operators sind verantwortlich für:

- Einrichten eines Computers (entweder physisch oder virtuell)
- Korrektes Konfigurieren, einschließlich ihres Heimnetzwerks, falls zutreffend
- Installation von Rocket Pool darauf und Einrichtung von Minipools zur Durchführung der Validierung
- Absichern gegen externe und interne Bedrohungen
- Wartung für die Lebensdauer ihrer Validatoren

Es ist eine große Verantwortung und keine einfache "Einstellen-und-Vergessen"-Art von Aufgabe; Sie müssen sich um Ihren Node kümmern, solange er staket.
Mit großer Verantwortung kommen jedoch große Belohnungen.

### Belohnungen

Hier sind die Hauptvorteile des Betriebs eines Rocket Pool Nodes:

- Sie verdienen Ihren Anteil an den ETH-Belohnungen jedes Validators plus Provision.
  - Für 8 ETH-gebondete Minipools ohne gestaktes RPL entspricht dies 30% mehr als Solo-Staking (`(8+24*.1)/8 = 1,3`)
  - Das Staken von RPL bietet erhöhte Provisionen. Mit RPL-Stakes im Wert von 10% oder mehr Ihres gesamten geliehenen ETH ergeben sich ETH-Belohnungen von 42% mehr als Solo-Staking (`(8+24*.14)/8 = 1,42`)
  - **Hinweis:** Wenn Sie nicht am Smoothing Pool teilnehmen, erhalten Sie stattdessen 15% mehr als Solo-Staking (`(8+24*.05)/8 = 1,15`) -- es wird dringend empfohlen, dass Benutzer mit Minipools, die am/nach dem 28.10.2024 erstellt wurden, sich für den Smoothing Pool entscheiden.
- Sie verdienen auch Ausgabebelohnungen auf das RPL, das Sie staken.
  - Am Ende einer Periode (alle 28 Tage) gibt es einen Snapshot Ihres RPL.
  - Sie können maximale Rendite auf RPL **bis zu 15%** des Werts Ihres gesamten geliehenen ETH verdienen.
    - Sie werden Rendite auf RPL darüber hinaus verdienen, auf einem abnehmenden Niveau.
  - Sie erhalten Stimmrecht basierend auf der Quadratwurzel Ihres gestakten RPL.

### Einschränkungen

Es gibt einige Einschränkungen, die mit den oben genannten Belohnungen einhergehen:

- Wenn Ihr Node schlecht funktioniert und Sie tatsächlich ETH verlieren, wenn Sie sich entscheiden, Ihren Minipool zu beenden, kommt das gesamte verlorene ETH aus Ihrem Anteil.
  - Zum Beispiel: Wenn Sie mit einem Guthaben von 30 ETH aussteigen, dann hat Ihr Minipool 2 ETH von seiner anfänglichen 32-ETH-Einzahlung verloren. Sie erhalten 6 ETH, und 24 ETH werden an den Staking-Pool zurückgegeben.
- Ihr gestaktes RPL wird weniger liquide sein
  - Sie können nur RPL-Stakes zurückziehen, die über dem Wert von 60% Ihres gebondeten ETH liegen.
  - Sie können RPL nicht zurückziehen, wenn Sie in den letzten 28 Tagen gestaket haben

### Sie schaffen das

Wenn Sie relativ neu in der Verwendung der Befehlszeile oder der Computerwartung sind, kann dies wie eine beängstigende Herausforderung erscheinen.
Glücklicherweise ist eines der Kernprinzipien von Rocket Pool die _Dezentralisierung_ - die Tatsache, dass jeder, überall, einen Node betreiben kann, wenn er die Entschlossenheit und das Wissen hat.
Während wir bei der Entschlossenheit nicht helfen können, können wir _beim Wissen helfen_.
Dieser Abschnitt ist vollgepackt mit Leitfäden, Anleitungen und Informationen, die Ihnen helfen werden zu verstehen, wie man einen großartigen Rocket Pool Node betreibt.
