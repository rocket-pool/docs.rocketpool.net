---
next:
  text: Erstellen eines neuen Minipools (Validators)
  link: "/de/node-staking/create-validator"
---

::: danger WARNUNG
Minipool-Einzahlungen sind derzeit in Vorbereitung auf Saturn 1 deaktiviert.
:::

# Übersicht

Dieser Abschnitt behandelt die Prozesse der Erstellung und Migration von Minipools (Rocket Pool Validators).
Hier lernen Sie, wie Sie mit der Validierung des Ethereum-Netzwerks beginnen und dafür Belohnungen verdienen.

## Voraussetzungen

Bevor Sie Minipools betreiben, stellen Sie bitte sicher, dass Sie:

- Eine Node-Maschine (oder virtuelle Maschine) eingerichtet und gesichert haben (über den Leitfaden [Sichern Ihres Nodes](../securing-your-node))
- Den Smartnode darauf [installiert](../installing/overview) und [konfiguriert](../config/overview) haben
- Ein Node Wallet auf Ihrem Smartnode geladen haben
- Ihre Execution und Consensus Clients synchronisiert haben
- Ihren Node mit [einer Withdrawal Address](../prepare-node.mdx#setting-your-withdrawal-address) ausgestattet, Ihre [Fallback Clients](../fallback) eingerichtet (optional), sich für den [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) angemeldet (optional) und [MEV](../mev.mdx) konfiguriert haben

## Leitfäden

[Erstellen eines neuen Minipools (Validators)](../create-validator.mdx) erklärt den Prozess der Erstellung eines neuen Rocket Pool Minipools und des entsprechenden Validators auf der Beacon Chain.
Ob Sie Ihren allerersten Minipool erstellen oder bereits einige haben und einen weiteren erstellen möchten, dieser Leitfaden führt Sie Schritt für Schritt durch den Prozess.

[Der Minipool Delegate](./delegates) erklärt ein wenig darüber, was der Minipool Contract ist, und führt den **Delegate** Contract ein, der den Großteil seiner Funktionalität enthält.
Er demonstriert auch, wie Sie den Delegate für Ihre Minipools nach einem Netzwerk-Upgrade aktualisieren können, um neue Funktionen zu nutzen.

[Umwandlung eines Solo Validators in einen Minipool](../solo-staker-migration) führt durch den Prozess der Umwandlung eines bestehenden Validators außerhalb von Rocket Pool (wie z.B. einer, den Sie für Solo Staking verwenden) direkt in einen Rocket Pool Minipool, ohne die Beacon Chain verlassen und einen neuen Minipool erstellen zu müssen.
Wenn Sie ein Solo Staker sind, der diese Möglichkeit nutzen möchte, ist dies der richtige Leitfaden für Sie!

[Migration eines 16-ETH Minipools auf 8-ETH](../leb-migration.mdx) zeigt, wie Sie den gebondeten ETH-Betrag für einen Minipool von 16 ETH auf 8 ETH reduzieren können, wodurch Sie 8 ETH als Credit erhalten, die zur kostenlosen Erstellung eines neuen Minipools verwendet werden können (es kostet natürlich immer noch ETH für Gas).

[Das Deposit Credit System](../credit) behandelt das "ETH Credit" System, mit dem Sie neue Minipools erstellen können, ohne für deren ETH-Bonds bezahlen zu müssen, nachdem Sie eine der oben genannten Migrationen durchgeführt haben.
