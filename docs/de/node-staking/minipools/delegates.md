::: danger WARNUNG
Minipool-Einzahlungen sind derzeit in Vorbereitung auf Saturn 1 deaktiviert.
:::

# Der Minipool Delegate

Jeder validator, den Sie betreiben, hat einen **Minipool**-Vertrag als seinen "Eigentümer", sozusagen.
Der Minipool ist ein einzigartiger Vertrag, der speziell diesem validator zugewiesen ist; er fungiert als seine **Auszahlungsadresse**.
Alle Belohnungs- und Staking-Guthaben-Auszahlungen von der Beacon Chain werden an den Minipool-Vertrag gesendet.

Jeder Minipool ist einzigartig, um sicherzustellen, dass Sie (der Node-Betreiber) die ultimative Kontrolle darüber haben.
Niemand sonst kontrolliert ihn, niemand sonst kann ihn ändern; er steht vollständig unter Ihrem Kommando.

Allerdings enthält der Minipool _selbst_ sehr wenig tatsächliche Funktionalität, um die Gaskosten während Node-Einzahlungen zu minimieren.
Fast alles, was er tun kann, wird an einen **Delegate**-Vertrag delegiert.

Der Minipool Delegate-Vertrag ist ein spezieller Vertrag, der den Großteil der von Minipools benötigten Logik enthält - Dinge wie die faire Verteilung des Guthabens zwischen Ihnen und den Pool-Stakern zum Beispiel.
Im Gegensatz zu Minipools, wo jeder Minipool ein einzigartiger Vertrag ist, ist der Delegate ein einzelner Vertrag, an den viele Minipools Anfragen "weiterleiten" können.

Gelegentlich wird das Rocket Pool Entwicklungsteam einen neuen Minipool Delegate veröffentlichen, der neue Funktionalität hinzufügt.
Zum Beispiel haben wir im Atlas-Update einen neuen Delegate eingeführt, der die Verteilung von skimmed Belohnungen unterstützt, ohne den Minipool schließen zu müssen.

Minipools können ihre Delegates aktualisieren, um diese neue Funktionalität zu nutzen.
Delegate-Upgrades sind **opt-in**, sodass Sie entscheiden können, ob und wann Sie sie verwenden möchten.
Allerdings sind sie normalerweise erforderlich, um neue Funktionalität zu nutzen, die Netzwerk-Upgrades einführen.

### Upgrade Ihres Delegate

Um einen Minipool auf einen neuen Delegate-Vertrag zu aktualisieren, führen Sie einfach den folgenden Befehl aus:

```shell
rocketpool minipool delegate-upgrade
```

Dies wird Ihnen eine Liste Ihrer Minipools präsentieren, die derzeit nicht den neuesten Delegate verwenden und für ein Upgrade berechtigt sind:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Wählen Sie denjenigen/diejenigen aus der Liste aus, den/die Sie aktualisieren möchten, indem Sie die entsprechende Nummer links von der Minipool-Adresse eingeben.
Nach der Auswahl werden Sie aufgefordert, Ihre Gaspreiseinstellungen zu bestätigen, und danach wird eine Transaktion zum Upgrade des Minipools gesendet:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

Sie können mit `rocketpool minipool status` überprüfen, ob er den neuesten Delegate verwendet.
Alle Minipools, die _nicht_ den neuesten Delegate verwenden, haben unter ihrem Status eine gelbe Benachrichtigung, die Sie darüber informiert, dass sie aktualisiert werden können:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
