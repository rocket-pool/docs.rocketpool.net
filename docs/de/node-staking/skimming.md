# Verteilung von Skimmed-Belohnungen

Die ETH-Belohnungen, die Sie für den Betrieb eines Validators für Ethereum erhalten, werden routinemäßig an Ihre Minipools gesendet in einem Prozess, der als "Skimming" bezeichnet wird.
Die Häufigkeit von Skims hängt von der Anzahl der aktiven Validatoren auf der Beacon Chain ab. Zum Zeitpunkt des Schreibens liegt die Anzahl der Validatoren bei etwa 500.000, was dazu führt, dass ein Skim etwa alle 2-3 Tage auftritt.

Skimmed-Belohnungen sammeln sich in jedem Ihrer Minipools an, bis Sie sie "verteilen". Dieser Prozess verteilt die skimmed-Belohnungen zwischen Ihnen als Node-Betreiber und rETH-Inhabern basierend auf Ihrer Provisionsrate und dem Verhältnis von bereitgestelltem und zur Verfügung gestelltem ETH.

::: warning HINWEIS
Um auf das Guthaben Ihres Minipools zuzugreifen, müssen Sie zuerst auf den [Atlas-Delegaten](./minipools/delegates) aktualisieren.
Der alte Redstone-Delegat kann nicht verwendet werden, um das Guthaben des Minipools zu verteilen.
:::

## Automatische Verteilung

Standardmäßig ist der Smartnode so konfiguriert, dass er automatisch alle Ihre Minipools verteilt, wenn deren individuelle Guthaben **1 ETH** erreichen. Diese Schwelle kann in der TUI konfiguriert werden, indem Sie die folgenden Schritte ausführen.

Führen Sie aus:

```shell
rocketpool service config
```

Navigieren Sie zur Einstellung `Smartnode and TX Fee Settings > Auto Distribute Threshold`, die unten angezeigt wird.

![](./images/tui-automatic-skimming.png)

Das Ändern dieser Einstellung passt die Schwelle an, bei der der Smartnode Ihre Minipools automatisch verteilt.
Wenn Sie den Parameter auf 0 setzen, wird die automatische Verteilung deaktiviert.

::: warning WARNUNG
Wenn Sie sich entscheiden, die automatische Verteilung zu deaktivieren, ist es wichtig, dass Sie dennoch regelmäßig eine manuelle Verteilung durchführen.
Lesen Sie den Abschnitt [manuelle Verteilung](#manual-distribution), der folgt, um zu erfahren, wie dies funktioniert.

Nach einer langen Zeit können Ihre skimmed-Belohnungen 8 ETH überschreiten. Wenn diese Situation eintritt, können Sie sie nicht mehr verteilen und müssen Ihren Validator beenden, um auf Ihre angesammelten Belohnungen zuzugreifen.

Rocket Pool verfügt über ein Failsafe-Design, das es jedem nach einer langen Wartezeit ermöglicht, Ihren Minipool zu verteilen, wenn sein Guthaben 8 ETH überschreitet. Um Ihr Kapital zu schützen, überwacht der Smartnode diese Situation und wird Ihren Minipool automatisch beenden, wenn sie auftritt.
:::

## Manuelle Verteilung

Wenn Sie die automatische Verteilung von skimmed-Belohnungen deaktiviert haben, müssen Sie sie routinemäßig selbst mit dem folgenden Prozess verteilen.

Sie können Ihre Belohnungen auch jederzeit manuell mit diesem Prozess verteilen, ohne auf den automatischen Prozess oben zu warten.

Wenn Ihr Minipool weniger als 8 ETH darin hat, können Sie Ihre Belohnungen mit folgendem Befehl verteilen:

```shell
rocketpool minipool distribute-balance
```

Dies zeigt Ihnen die Minipools, die Sie für die Verteilung in Frage kommen, wie viel ETH sie haben und wie viel ETH Sie (der Node-Betreiber) erhalten werden:

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

Alle Minipools, die den ursprünglichen Launch-Delegaten verwenden, werden am Anfang erwähnt und informieren Sie darüber, dass Sie `distribute-balance` für sie nicht aufrufen können, bis Sie ihre Delegaten aktualisieren.
Dieser Delegat wurde geschrieben, bevor skimmed-Auszahlungen spezifiziert wurden, und verfügt daher nicht über eine Möglichkeit, skimmed-Belohnungen zu verteilen.

Beachten Sie, dass Sie bei geeigneten Minipools auch den **Rückerstattungsbetrag** angezeigt bekommen.
Dies ist ein Betrag, der direkt an Sie geschuldet wird (z.B. weil Sie ein Guthaben in Ihrem Minipool hatten, bevor Sie [von einem 16-ETH-Bond auf einen 8-ETH-Bond migriert haben](./leb-migration.mdx) oder Sie [einen Solo-Validator in einen Minipool umgewandelt haben](./solo-staker-migration) mit bestehenden Belohnungen).
Es wird nicht mit den rETH-Inhabern geteilt.

Geben Sie die Nummer des Minipools ein, den Sie verteilen möchten.
Sie werden wie üblich mit der Gaspreistabelle aufgefordert und gebeten, Ihre Entscheidung zu bestätigen.
Sobald Sie dies getan haben, wird das Guthaben Ihres Minipools verteilt:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

Wie Sie [aus der Transaktion](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9) sehen können, wurde der Auszahlungsadresse des Nodes der Anteil des Nodes an den Belohnungen (plus dem Rückerstattungsbetrag) bereitgestellt und der Rest wurde an den Staking-Pool zurückgegeben.
