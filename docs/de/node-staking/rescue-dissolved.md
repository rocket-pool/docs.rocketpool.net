# Rettung eines aufgelösten Minipools

Im unwahrscheinlichen Fall, dass Ihr Minipool nicht innerhalb des Auflösungsfensters staked, wird er vom oDAO "aufgelöst" und die bereitgestellten Benutzermittel werden an den Deposit Pool zur Verwendung durch einen anderen Minipool zurückgegeben. In diesem Szenario müssen Sie den folgenden Prozess durchführen, um Ihr ETH abzurufen und Ihr RPL zu entsperren, um es zu entstaken.

## Aktualisieren Sie Ihren Minipool Delegate

Es wird dringend empfohlen, dass Sie den neuesten Minipool Delegate verwenden, wenn Sie diesen Prozess durchführen. Ältere Delegates enthalten eine `selfdestruct`-Operation, wenn sie geschlossen werden, was bedeutet, dass, falls der Prozess nicht korrekt in der angegebenen Reihenfolge abgeschlossen wird, Mittel möglicherweise für immer gesperrt werden. Sie können überprüfen, ob Ihr Minipool auf dem neuesten Delegate ist, indem Sie versuchen, [Ihren Delegate zu upgraden](./minipools/delegates#upgrading-your-delegate). Wenn Ihr Minipool nicht in der Liste der Minipools erscheint, die geupgradet werden können, können Sie unten fortfahren.

## Abrufen Ihres ungenutzten Einzahlungsbetrags

::: tip HINWEIS
Wenn Ihr Minipool vor Atlas aufgelöst wurde, können Sie diesen Schritt überspringen und direkt zu [Erhöhen Sie Ihr Beaconchain-Guthaben auf 32 ETH](#increase-your-beaconchain-balance-to-32-eth) gehen.
Sie müssen Ihren ungenutzten Einzahlungsbetrag nicht abrufen, da der gesamte Bond-Betrag vor Atlas auf die Beaconchain eingezahlt wurde.
:::

1 ETH aus Ihrer anfänglichen Bond-Einzahlung wird als anfängliche Einzahlung auf die Beaconchain verwendet, um die Withdrawal-Credentials Ihres Validators zu sichern. Der verbleibende Betrag wird in Ihren Minipool eingezahlt, wenn ihm ETH aus dem Deposit Pool zugewiesen wird.

Wenn Ihr Minipool aufgelöst wird, wird das Benutzer-ETH an den Deposit Pool zurückgegeben und Ihr ETH verbleibt im Minipool bereit, an Sie zurückgegeben zu werden. Verwenden Sie die [Manuelle Verteilung](./skimming#manual-distribution) von Belohnungen-Funktion, um dieses ETH abzurufen, das dann im nächsten Schritt verwendet werden kann, um Ihren Validator zu aktivieren.

## Erhöhen Sie Ihr Beaconchain-Guthaben auf 32 ETH

Sie müssen das Guthaben Ihres Validators auf das für die Aktivierung auf der Beaconchain erforderliche Minimum aufstocken. Dieser Betrag beträgt **32 ETH**. Wenn Sie einen 16 ETH gebondeten Minipool haben, benötigen Sie zusätzliche 16 ETH, und wenn Sie einen 8 ETH gebondeten Minipool haben, benötigen Sie zusätzliche 24 ETH während dieses Schritts.

Zahlen Sie den erforderlichen Betrag an ETH in Ihre Node-Adresse ein und geben Sie dann den folgenden Befehl ein, um den Prozess zu beginnen:

```shell
rocketpool minipool rescue-dissolved
```

Es wird Ihnen eine Liste von Minipools präsentiert, die die Kriterien für eine manuelle Einzahlung erfüllen:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Nach Auswahl des Minipools, den Sie retten möchten, werden Sie gefragt, welchen Betrag Sie manuell einzahlen möchten:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

Option 1 wird in den meisten Fällen verwendet. Dies ist der erforderliche Betrag, um Ihr Beaconchain-Guthaben auf die erforderlichen 32 ETH zu bringen. Die anderen Optionen werden für fortgeschrittene Anwendungsfälle bereitgestellt.

::: tip HINWEIS
Wenn Sie Ihr Beaconchain-Guthaben auf 32 ETH bringen, bedeutet dies, dass Ihr Validator aktiv an Ethereum-Validierungsaufgaben teilnehmen kann. Der Smartnode hat möglicherweise noch keine Gelegenheit gehabt, Ihren Validator seit der Auflösung neu zu starten. Daher ist es eine gute Idee, Ihren Validator manuell neu zu starten, um sicherzustellen, dass er Ihre Validator-Schlüssel geladen hat und Validierungsaufgaben ausführen kann, um Strafen während des Rettungsprozesses zu vermeiden.

Wenn Sie den Standard-Docker-Modus ausführen, kann dies mit `docker restart rocketpool_validator` durchgeführt werden.
:::

Sobald dieser Schritt abgeschlossen ist, wird Ihr Validator in die Entry-Queue eintreten und Sie müssen warten, bis die folgenden Ereignisse eintreten:

1. 2048 Execution-Layer-Blöcke müssen vergehen, damit Ihre Einzahlung akzeptiert wird (~8 Stunden)
2. Bis zu 32 Epochen müssen vergehen, damit Validatoren für Sie abstimmen (0,5 - 3,5 Stunden)
3. Eine variable Zeit in der Validator-Queue (6,4 Minuten pro 4 Validatoren in der Queue)
4. Mindestens 256 Epochen Validierung, bevor ein Exit erlaubt ist (27 Stunden)

### Beenden Ihres Validators

Sobald Ihr Validator mindestens 256 Epochen aktiv war, können Sie Ihren Minipool über denselben Prozess wie jeden anderen Minipool beenden, indem Sie dem [Beenden Ihres Validators](./withdraw#exiting-your-validator)-Leitfaden folgen.

Das vollständige 32 ETH-Guthaben wird an Ihren Minipool zurückgegeben und aufgelöste Minipools verteilen 100% ihres Guthabens an die Withdrawal-Adresse des Node Operators.
