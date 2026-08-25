# Migration vom Solo Staking zu Rocket Pool

::: danger DIE KONVERTIERUNG VON SOLO-VALIDATOREN IST NICHT MEHR MÖGLICH
Das [Saturn 1 Upgrade](/de/upgrades/saturn-1/whats-new) hat die Möglichkeit entfernt, einen bestehenden Solo-Validator direkt in einen Rocket Pool Validator umzuwandeln.
Minipools - einschließlich der „vacant" Minipools, die die Konvertierung von Solo-Validatoren ermöglichten - können nicht mehr erstellt werden, und Megapool-Validatoren können nur über eine neue Beacon-Chain-Einzahlung erstellt werden.

Um deinen Stake vom Solo Staking zu Rocket Pool zu verschieben, musst du jetzt **deinen Solo-Validator beenden** und **neue Validatoren unter einem Megapool erstellen**.
Diese Seite erklärt, was sich geändert hat, und führt dich durch den neuen Prozess.
:::

## Was sich mit Saturn 1 geändert hat

Vor Saturn 1 konnte ein Solo-Staker einen aktiven Validator in einen Rocket Pool Minipool umwandeln, ohne ihn von der Beacon Chain zu entfernen.
Der Prozess bestand darin, einen speziellen „vacant" Minipool zu erstellen, die Withdrawal Credentials des Validators von den ursprünglichen `0x00` BLS-Credentials auf die Adresse des Minipools zu ändern, den Scrub Check des Oracle DAO zu bestehen und den Minipool schließlich zu befördern (promote).

Das Saturn 1 Upgrade hat Minipools durch [Megapools](/de/node-staking/megapools/overview) als Weg zur Erstellung neuer Validatoren ersetzt, und die Konvertierung von Solo-Validatoren wurde nicht übernommen:

- **Die Erstellung von Minipools ist auf Protokollebene deaktiviert**, und das schließt vacant Minipools ein. Es gibt keinen Minipool-Vertrag mehr, auf den du die Withdrawal Credentials eines bestehenden Validators richten könntest.
- **Megapool-Validatoren werden über die Rocket Pool Deposit Queue erstellt**, mit einer neuen Beacon-Chain-Einzahlung: ein Prestake von 1 ETH, gefolgt von den restlichen 31 ETH, sobald das Protokoll die Withdrawal Credentials des Validators on-chain verifiziert hat.
  Ein bereits aktiver Validator kann diesen Ablauf nicht durchlaufen, daher gibt es keinen Mechanismus, um einen bestehenden Solo-Validator in einen Megapool aufzunehmen.
- Die für die Konvertierung verwendeten Smartnode-Befehle (wie `rocketpool node create-vacant-minipool` und `rocketpool minipool promote`) wurden aus der CLI entfernt.

Kurz gesagt: Der einzige Weg, heute vom Solo Staking zu migrieren, ist, **deinen Validator von der Beacon Chain zu beenden und mit dem abgehobenen ETH neue Megapool-Validatoren zu erstellen**.

## Warum sollte ich migrieren?

Die Migration ist nicht für jeden das Richtige, aber Rocket Pool Megapool-Validatoren genießen mehrere Vorteile gegenüber herkömmlichen Solo-Staking-Validatoren:

- Sie **verdienen eine Provision** auf den Anteil an ETH, den sie von den Pool-Stakern leihen (28 ETH pro Validator).
- Dein bestehender Stake von 32 ETH könnte verwendet werden, um bis zu **acht Megapool-Validatoren** zu erstellen (beim aktuellen Bond von je 4 ETH), die auf bis zu 224 ETH geliehenes ETH Provision verdienen.
- Sie sind zur Teilnahme am [Smoothing Pool](/de/node-staking/fee-distrib-sp#the-smoothing-pool) berechtigt, der alle Execution-Layer-Belohnungen (z. B. aus Blockvorschlägen und [MEV-Belohnungen](/de/node-staking/mev)) bündelt und in jedem Belohnungsintervall fair unter den Teilnehmern verteilt.
- Wenn du RPL auf deinem Megapool stakst, verdienst du [Voter-Share-Belohnungen](/de/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (einen Anteil an den ETH-Einnahmen des Protokolls) zusätzlich zu den RPL-Inflationsbelohnungen, sowie Stimmrecht in der [pDAO-Governance](/de/pdao/overview). RPL-Staking ist völlig optional.

Dennoch gibt es einige wichtige Unterschiede, die hervorzuheben sind:

- Du musst das **Smart-Contract-Risiko** akzeptieren, da das Protokoll als eine Reihe von Smart Contracts implementiert ist.
- Der herkömmliche Node-Betrieb nutzt den **Smartnode-Stack**; du musst alle Risiken akzeptieren, die mit der Installation und dem Betrieb dieser Software auf deinem Node verbunden sind.
- Node-Operator zu sein bedeutet, einige neue Konzepte zu lernen - es gibt also eine gewisse **Lernkurve**.
- Megapool-Validatoren teilen ihre Belohnungen mit den Pool-Stakern, daher ist die Withdrawal-Adresse deiner Validatoren dein Megapool-Vertrag auf dem Execution Layer, **keine EOA, die du kontrollierst**. Das gilt auch für deinen **Fee Recipient** für Execution-Layer-Belohnungen.
- **Dein Kapital verdient nichts, während es unterwegs ist.** Zwischen dem Beenden deines Solo-Validators und der Aktivierung deiner Megapool-Validatoren erhältst du keine Belohnungen. Neue Megapool-Validatoren müssen die Rocket Pool Deposit Queue _und_ die Beacon-Chain-Queue durchlaufen, bevor sie mit dem Attestieren beginnen. Lies daher den Abschnitt **Zeitliche Überlegungen** weiter unten, bevor du irgendetwas beendest.

Wir empfehlen dir, diese Vor- und Nachteile sorgfältig abzuwägen, bevor du dich für die Migration entscheidest.
Wenn du mit dem Prozess fortfahren möchtest, findest du die Schritte unten beschrieben.

## Schritt 1: Beende deinen Solo-Validator

Der erste Schritt besteht darin, deinen Solo-Validator von der Beacon Chain zu beenden und sein Guthaben abzuheben:

1. Wenn dein Validator noch `0x00` BLS Withdrawal Credentials hat, musst du sie zuerst [auf Execution-Layer Withdrawal Credentials aktualisieren](https://launchpad.ethereum.org/en/withdrawals), die auf eine von dir kontrollierte Adresse zeigen. Ohne dies kann dein ETH nach dem Exit nicht abgehoben werden.
1. Reiche einen **freiwilligen Exit (Voluntary Exit)** für den Validator ein. Das kannst du mit deinem Consensus- / Validator-Client tun; Details findest du in der Dokumentation deines Clients.
1. Warte, bis der Validator die Exit-Queue der Beacon Chain durchlaufen hat und sein vollständiges Guthaben an deine Withdrawal-Adresse überwiesen wurde.

::: warning WARNUNG
Ein freiwilliger Exit ist **unumkehrbar**. Sobald dein Validator beendet ist, kann er nie wieder validieren - der einzige Weg zurück ist die Erstellung eines neuen Validators.
Stelle sicher, dass du diese gesamte Seite gelesen hast (insbesondere den Abschnitt **Zeitliche Überlegungen**), bevor du den Exit durchführst.
:::

[validatorqueue.com](https://www.validatorqueue.com/) ist eine hilfreiche Seite, um die aktuelle Länge der Beacon-Chain-Exit-Queue zu prüfen.

## Schritt 2: Richte einen Rocket Pool Node ein

Während du auf die Verarbeitung deines Exits wartest, kannst du deinen Rocket Pool Node vorbereiten.

Wenn du neu im Rocket Pool Node-Betrieb bist, beginne mit dem [Node-Operator-Leitfaden](/de/node-staking/responsibilities), der alles abdeckt - von der Hardwareauswahl über die [Installation des Smartnode-Stacks](/de/node-staking/installing/overview) bis zur [Registrierung deines Nodes](/de/node-staking/prepare-node).
Da du bereits deinen eigenen Validator betrieben hast, wird dir vieles davon vertraut vorkommen - und wenn du bereits eigene Execution- und Consensus-Clients betreibst, könnte dich die [Hybrid-Konfiguration mit externen Clients](/de/node-staking/install-modes#the-hybrid-configuration-with-external-clients) interessieren.

## Schritt 3: Erstelle deine Megapool-Validatoren

Sobald dein abgehobenes ETH verfügbar ist, kannst du mit `rocketpool megapool deposit` Megapool-Validatoren erstellen.
Jeder Validator erfordert derzeit einen **Bond von 4 ETH** und leiht sich **28 ETH** aus dem Staking-Pool - deine 32 ETH abgehobener Stake könnten also bis zu **acht Megapool-Validatoren** finanzieren.
Dein Megapool-Vertrag wird automatisch mit deiner ersten Validator-Einzahlung bereitgestellt, und jeder danach erstellte Validator wird von demselben Megapool verwaltet.

Der Leitfaden [Einen Megapool (Validator) erstellen](/de/node-staking/megapools/create-megapool-validator) führt dich Schritt für Schritt durch den gesamten Prozess, einschließlich der Funktionsweise der Deposit Queue und der Bestätigung eines erfolgreichen Stakes.

::: tip HINWEIS
Anders als beim alten Konvertierungsprozess verwenden deine neuen Validatoren **neue Validator-Schlüssel**, die aus deiner Smartnode-Wallet generiert werden.
Deine alten Solo-Validator-Schlüssel werden nicht wiederverwendet, und der Validator Client des Smartnode verwaltet die neuen Schlüssel für dich - einen Schlüsselimport-Schritt gibt es nicht mehr.
:::

## Zeitliche Überlegungen

Der alte Konvertierungsprozess hatte keine Ausfallzeit: Dein Validator attestierte durchgehend weiter.
Der neue Migrationsweg bringt hingegen Ausfallzeit mit sich, daher lohnt es sich, die beteiligten Queues zu verstehen, bevor du deinen Solo-Validator beendest:

1. **Die Beacon-Chain-Exit-Queue**, die bestimmt, wie schnell dein Solo-Validator beendet und ausgezahlt werden kann.
1. **Die Rocket Pool Deposit Queue**, die bestimmt, wann deine neuen Validatoren mit geliehenem ETH aus dem Deposit Pool zusammengeführt werden. Express-Queue-Tickets wurden an bestehende Node-Operatoren auf Basis des in Legacy-Minipools gebondeten ETH verteilt; neue Nodes erhalten derzeit keine, daher reihen sich die Validatoren eines ehemaligen Solo-Stakers in die **Standard-Queue** ein.
1. **Die Beacon-Chain-Deposit-Queue**, die Megapool-Validatoren **zweimal** durchlaufen: einmal für den Prestake von 1 ETH und ein zweites Mal für den Stake der restlichen 31 ETH, nachdem das Protokoll die Withdrawal Credentials des Validators verifiziert hat.

Vom Moment des Exits deines Solo-Validators bis zur Aktivierung deiner Megapool-Validatoren verdienst du keine Belohnungen - prüfe also die Queues, bevor du dich festlegst.

::: tip Nützliche Links
[validatorqueue.com](https://www.validatorqueue.com/) ist eine hilfreiche Seite zur Überprüfung der Länge der Beacon-Chain-Queue. Diese Queue hängt von der Menge an ETH ab, die in die Beacon Chain ein- und austritt.
:::

Sollte die Deposit Queue länger sein, als dir lieb ist, kannst du [einen Validator jederzeit aus der Rocket Pool Deposit Queue entfernen](/de/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue), bevor ihm ETH zugewiesen wurde, und erhältst deinen Bond als [Einzahlungsguthaben](/de/node-staking/megapools/credit) zurück, das gegen rETH einlösbar ist.

## Alternative: Staking ohne eigenen Node

Wenn du nach Abwägung aller Vor- und Nachteile lieber gar keinen Node betreiben möchtest, kannst du dein abgehobenes ETH einfach mit [rETH](/de/liquid-staking/overview) staken - Rocket Pools Liquid-Staking-Token - und Staking-Belohnungen verdienen, ganz ohne Hardware, Wartung oder Warteschlangen auf deiner Seite.
