::: danger WARNUNG
Minipool-Einzahlungen sind derzeit in Vorbereitung auf Saturn 1 deaktiviert.
:::

# Das Deposit-Credit-System

Das Deposit-Credit-System ist ein Mechanismus, um ETH zu verfolgen, das zuvor von Node-Betreibern hinterlegt wurde, aber nicht mehr erforderlich ist, und es wieder verfügbar zu machen.
Die Quelle dieses Credits kommt aus zwei Quellen:

- [Migration eines bestehenden 16-ETH-Bonded-Minipools zu einem 8-ETH-Bonded-Minipool](./leb-migration.mdx) (was 8 ETH zum Credit-Saldo des Node-Betreibers hinzufügt)
- [Migration eines bestehenden Solo-Validators](./solo-staker-migration) in einen Minipool (was entweder 16 oder 24 ETH zum Credit-Saldo des Node-Betreibers hinzufügt, abhängig davon, welchen Minipool-Typ sie während der Migration erstellen)

Jeder Node-Betreiber beginnt mit einem Credit-Saldo von **0 ETH**.
Beide Aktionen erhöhen diesen Saldo entsprechend.

Dieses ETH wird _nicht_ liquide gemacht und an den Node-Betreiber zurückgegeben; stattdessen kann es verwendet werden, um **zusätzliche Minipools zu erstellen**, ohne dass ETH vom Node-Betreiber erforderlich ist.

Das Credit-System ist **transparent** für den Node-Betreiber; es wird automatisch verwendet (mit Benachrichtigungen in der Smartnode-CLI, die erklären, dass es verwendet wird) während der Operationen `rocketpool node deposit` oder `rocketpool node create-vacant-minipool`, falls möglich.
Wenn es _nicht_ verwendet werden kann, wird der Smartnode den Benutzer darauf hinweisen, dass es nicht verwendet werden kann und bei beiden Operationen eine normale ETH-Einzahlung erforderlich ist.

Weitere Details finden Sie im Abschnitt [Credit-Verfügbarkeit](#credit-verfugbarkeit) unten.

## Ein Beispiel

Angenommen, Sie haben einen Credit-Saldo von 0 ETH und einen einzelnen Minipool mit einer 16-ETH-Einzahlung.
Sie können dann [diesen Minipool zu einer 8-ETH-Einzahlung migrieren](./leb-migration.mdx).
Dies führt zu **8 ETH**, die nicht mehr hinterlegt sind.
Diese 8 ETH werden in Ihren **Credit-Saldo** eingezahlt.

Angenommen, Sie möchten nun einen _zweiten_ 8-ETH-Minipool erstellen.
Sie führen wie gewohnt `rocketpool node deposit` aus und wählen 8-ETH als Einzahlungsbetrag.
Normalerweise müssen Sie 8 Ihrer eigenen ETH für den Minipool bereitstellen.
Da Sie jedoch einen Credit-Saldo von 8 ETH haben, wird Rocket Pool **automatisch diesen verwenden**:

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

Die zweite Zeile hier ist die relevante: Sie teilt Ihnen mit, dass Sie genug ETH in Ihrem Credit-Saldo haben, um diese Einzahlung zu decken _und dass es zur Verwendung verfügbar ist_, sodass es den Saldo automatisch verwendet und keine zusätzlichen ETH von Ihrem Node-Wallet benötigt.

Weitere Details zur Verfügbarkeit des Credit-Saldos finden Sie [im Verfügbarkeitsabschnitt unten](#credit-verfugbarkeit).

## Anzeigen Ihres aktuellen Credit-Saldos

Um Ihren aktuellen Credit-Saldo anzuzeigen, führen Sie einfach den folgenden Befehl aus:

```shell
rocketpool node status
```

Dies erzeugt eine umfassende Liste von Details über Ihre Node, einschließlich ihres Credit-Saldos ganz oben:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Credit-Verfügbarkeit

In einigen Situationen könnte Ihre Node einen verfügbaren Credit-Saldo haben, aber ihn derzeit nicht verwenden können, um zusätzliche Minipools bereitzustellen.

Das ETH für Ihren Credit-Saldo wird aus dem **Deposit-Pool** entnommen.
Wenn Sie also 8 ETH als Credit verwenden möchten, um einen neuen 8-ETH-Minipool zu erstellen, werden letztendlich **alle 32 ETH für diesen Minipool** aus dem Deposit-Pool entnommen und keine von Ihnen benötigt.
Daher wird, wenn der Deposit-Pool nicht genug ETH hat, um den Pre-Deposit-Wert zu decken (derzeit auf 1 ETH festgelegt), **der Saldo nicht verfügbar sein**.

In dieser Situation wird der Smartnode Sie während einer `rocketpool node deposit`-Operation darauf hinweisen, dass er **nicht** Ihren Credit-Saldo verwenden kann und stattdessen ETH aus Ihrem Node-Wallet verwenden muss, um die Einzahlung abzuschließen.
Dies wird **nicht** Ihren Credit-Saldo verbrauchen; er bleibt unverändert und ist zur späteren Verwendung verfügbar, sobald der Deposit-Pool genug Guthaben hat, um ihn zu decken.
