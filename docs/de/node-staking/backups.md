# Sicherung Ihres Nodes

::: tip HINWEIS
Dies ist derzeit für **Docker Mode** Installationen geschrieben.
Einige Speicherorte können für Hybrid- oder Native-Benutzer variieren.
:::

Im Allgemeinen ist das einzige, was Sie wirklich zur Hand haben müssen, um Ihren Node nach einem kompletten Ausfall wiederherzustellen, die **Mnemonic für Ihr Node-Wallet**, wenn Sie Ihr Node-Wallet und Minipools über die Smartnode erstellt haben.
Alles andere kann daraus ziemlich einfach wiederhergestellt werden.

Wenn Sie Minipools haben, die extern generierte validator-Schlüssel haben (z.B. Sie sind von **Allnodes** zu Ihrem eigenen selbst gehosteten Node migriert), benötigen Sie auch die privaten Keystore-Dateien für Ihre validators, da diese nicht vom Node-Wallet wiederhergestellt werden können.

Allerdings werden Sie nach dem Merge nicht mehr in der Lage sein, einen leichten Execution-Client (z.B. Pocket oder Infura) als Fallback zu verwenden, wenn Sie jemals die Execution-Layer-Chain neu synchronisieren müssen.
Darüber hinaus werden Sie einen aktiven und gesunden Execution-Client benötigen, um korrekt zu attestieren.
Ein schneller, zuverlässiger Weg zur Wiederherstellung nach einem Execution-Client-Ausfall (wie eine beschädigte Datenbank, SSD-Fehlfunktion oder kompromittierte / gestohlene Hardware) wird kritisch sein, da es Stunden oder sogar Tage dauern kann, von Grund auf neu zu synchronisieren.

In diesem Leitfaden zeigen wir Ihnen, wie Sie einige dieser Dinge sichern können, um die Widerstandsfähigkeit Ihres Nodes zu verbessern und unnötige Ausfallzeiten zu minimieren.

::: warning HINWEIS
Dieser Leitfaden geht davon aus, dass Sie die Smartnode im Standardverzeichnis (`~/.rocketpool`) installiert haben.
Wenn Sie ein anderes Installationsverzeichnis angegeben haben, ersetzen Sie es entsprechend in den Anweisungen unten.
:::

## Elemente, die gesichert werden können

### Smartnode-Konfiguration

Die Konfiguration der Smartnode ist in `~/.rocketpool/user-settings.yml` gespeichert.
Sie können diese speichern und ersetzen, um alle Ihre Smartnode-Einstellungen wiederherzustellen (d.h. die Dinge, die Sie in `rocketpool service config` angegeben haben).

### Execution-Client / ETH1-Client Chain-Daten

Die Chain-Daten des Execution-Clients sind wahrscheinlich das Wichtigste zum Sichern.
Wie erwähnt, kann es mehrere Tage dauern, Ihre EC-Chain-Daten neu zu synchronisieren.
Nach dem Merge bedeutet dies Stunden bis Tage Ausfallzeit und verlorene Gewinne!

Die Chain-Daten sind innerhalb des `rocketpool_eth1clientdata` Docker-Volumes gespeichert, das standardmäßig unter `/var/lib/docker/volumes/rocketpool_eth1clientdata` liegt.
Beachten Sie, dass dieser Ordner normalerweise nicht von unprivilegierten Benutzerkonten zugänglich ist; Sie müssen zum `root`-Benutzer wechseln, um ihn zu sehen.

::: tip HINWEIS
Wenn Sie während der initialen Smartnode-Installation den Docker-Speicherort geändert haben (wie Personen, die Docker auf einer zweiten SSD ausführen), finden Sie das Volume in `/<Ihr externer Mountpoint>/docker/volumes/rocketpool_eth1clientdata`

Wenn Sie sich nicht erinnern, welchen Installationspfad Sie verwenden, können Sie `/etc/docker/daemon.json` auf dessen Speicherort überprüfen.
Wenn die Datei nicht existiert, verwenden Sie den Standardspeicherort.
:::

Detaillierte Anweisungen zur effizienten Sicherung Ihrer Execution-Chain-Daten finden Sie im Abschnitt [Sicherung Ihrer Execution-Chain-Daten](#sicherung-ihrer-execution-chain-daten) unten.

### Überwachungs- und Metrik-Daten

Diese Daten sind innerhalb des `rocketpool_grafana-storage` Docker-Volumes gespeichert, das standardmäßig unter `/var/lib/docker/volumes/rocketpool_grafana-storage` liegt (oder `/<Ihr externer Mountpoint>/docker/volumes/rocketpool_prometheus-data`, wenn Sie Ihren Docker-Speicherort angepasst haben).

## Elemente, die **nicht** gesichert werden sollten

### Private Schlüssel und Passwörter

Der private Schlüssel Ihres Node-Wallets und die Passwortdatei, die zum Verschlüsseln verwendet wird, sind in `~/.rocketpool/data/wallet` bzw. `~/.rocketpool/data/password` gespeichert.
Diese Dateien müssen im Allgemeinen nicht gesichert werden, da sie von Ihrer Mnemonic mit `rocketpool wallet recover` wiederhergestellt werden können.

Wenn Sie aus irgendeinem Grund _doch_ beschließen, diese Dateien zu sichern, müssen Sie **extrem vorsichtig** sein, wie Sie sie speichern.
Jeder, der Zugang zu diesen Dateien erhält, erhält Zugang zu Ihrem Node-Wallet, seinen validators und allen Geldern, die Sie darauf für Dinge wie Gas gespeichert haben.

Wir **empfehlen dringend**, dass Sie diese Dateien nicht sichern und einfach Ihre Wallet-Mnemonic verwenden, um sie bei Bedarf wiederherzustellen.

### Consensus-Client Chain-Daten

Im Gegensatz zu den Execution-Layer-Daten sind die Consensus-Layer-Daten nicht annähernd so wichtig für Ihren Node dank [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Consensus-Clients können diese Technik leicht verwenden, um sofort mit dem Head der Beacon Chain zu synchronisieren und Validierungsaufgaben fortzusetzen.

## Sicherung Ihrer Execution-Chain-Daten

Die Smartnode kommt mit der Fähigkeit, Ihre Execution-Chain-Daten über den Befehl `rocketpool service export-eth1-data` zu sichern.
Unter der Haube nutzt dies `rsync`, ein leistungsstarkes Backup/Kopier-Tool innerhalb von Linux.

`rsync` vergleicht die Dateien im Quellverzeichnis (Ihr Docker-Volume) und dem Zielverzeichnis (Ihr Backup-Speicherort).
Wenn eine Quelldatei im Zielverzeichnis nicht existiert, wird sie vollständig kopiert.
Wenn sie jedoch _existiert_, kopiert `rsync` nur die _Änderungen_ zwischen den beiden Dateien.

Dies bedeutet, dass das erste Backup eine gute Menge Zeit in Anspruch nimmt, da es zunächst alle Daten kopieren muss.
Nachfolgende Backups kopieren nur die Änderungen zwischen Ihrem vorherigen Backup und jetzt, wodurch der Prozess viel schneller wird.

Als Teil einer Backup-Strategie möchten Sie möglicherweise planen, `export-eth1-data` regelmäßig auszuführen.
Um die Integrität der Chain-Daten sicherzustellen, wird die Ausführung dieses Befehls **den Execution-Client sicher herunterfahren, bevor seine Daten gesichert werden**.
Wenn Sie sich dafür entscheiden, es jede Woche zu planen, wird Ihr Execution-Client nur für ein paar Minuten ausgeschaltet sein, während er das Backup aktualisiert.
Dies ist sicherlich besser als die Tage, die es dauern würde, die Daten von Grund auf neu zu synchronisieren.

Um ein Backup auszulösen, beginnen Sie damit, **das Speichermedium zu mounten, auf das Sie die Daten exportieren möchten**.
Zum Beispiel könnte dies eine externe Festplatte sein.

::: tip HINWEIS
Wenn Sie nicht wissen, wie man externe Geräte unter Linux mountet, ist es einfach!
Schließen Sie das Gerät an Ihren Node an und folgen Sie [einem Leitfaden wie diesem](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/), um zu lernen, wie man es mountet.
:::

Sobald Sie es gemountet haben, notieren Sie sich seinen Mountpfad.
Für dieses Beispiel nehmen wir an, dass wir die Chain-Daten in einem Ordner namens `/mnt/external-drive` speichern möchten, auf den das externe Gerät gemountet ist.
Ersetzen Sie dies durch Ihren tatsächlichen Mountpfad, wo immer Sie ihn unten sehen.

Führen Sie nun den folgenden Befehl aus:

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Dies überprüft, ob Ihr Zielordner erreichbar ist und genügend freien Speicherplatz hat, um die Chain-Daten zu speichern.
Die Ausgabe wird wie folgt aussehen:

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Wie Sie sehen können, werden die Chain-Daten unter 100 GB sein (für das Hoodi-Testnet; das Ethereum-Mainnet wird eine Größenordnung größer sein) und der externe Ordner hat 287 GiB frei, sodass der Export fortgesetzt werden kann.

Wenn Sie bereit sind, geben Sie hier `y` ein und drücken Sie `Enter`.
Dies stoppt Ihren Execution-Client und beginnt, seine Chain-Daten in Ihren Zielordner zu kopieren.
Sie werden sehen, wie der Fortschritt jeder einzelnen Datei über den Bildschirm läuft.

::: warning HINWEIS
Es ist wichtig, dass Sie das Terminal _nicht_ verlassen, während dies läuft.
Wenn Sie dies tun, wird das Kopieren im Hintergrund fortgesetzt, aber Sie können seinen Fortschritt nicht verfolgen!
:::

Sobald es fertig ist, wird es automatisch Ihren Execution-Client-Container neu starten.

**Beachten Sie, dass Ihre vorhandenen Chain-Daten nicht von Ihrem Node gelöscht werden, nachdem der Export abgeschlossen ist!**

### Wiederherstellung Ihrer Execution-Chain-Daten

Wenn Sie jemals Ihre gesicherten Chain-Daten wiederherstellen müssen, führen Sie einfach den folgenden Befehl aus.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger WARNUNG
Dies wird automatisch alle vorhandenen Execution-Client-Daten in Ihrem `rocketpool_eth1clientdata` Volume löschen!
:::

Sobald es fertig ist, ist Ihr Execution-Client bereit zu starten.
