# Testen Ihres Oracle DAO Nodes

Nachdem Ihr Node eingerichtet ist und Sie dem Oracle DAO beigetreten sind, sollten Sie ihn testen, um sicherzustellen, dass er seine Aufgaben ordnungsgemäß erfüllen kann.
Der beste Weg dazu ist, den Redstone-Rewards-Merkle-Tree mit dem `treegen`-Dienstprogramm von Rocket Pool zu erstellen.

### treegen

`treegen` ist ein Tool, das den gesamten Rewards-Merkle-Tree und die zugehörigen Artefakte für ein früheres Rewards-Intervall über Ihre Archive-Execution- und Consensus-Clients reproduzieren kann.
Es kann auch das aktuelle Intervall im "Dry-Run"-Modus durchführen, indem es so tut, als wäre es bei der zuletzt finalisierten Epoche (zum Zeitpunkt der Ausführung) beendet worden, und einen partiellen Tree vom Beginn des Intervalls bis zu diesem Zeitpunkt erstellt.

::: tip TIPP
Weitere Informationen zum Rewards-Tree selbst und den begleitenden Dateien finden Sie in [**der formalen Spezifikation**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` kann als eigenständiges Binary (derzeit nur für Linux-Systeme, x64 und arm64 erstellt) oder als Docker-Container verwendet werden.

Wenn Sie das eigenständige Binary herunterladen möchten, finden Sie es in den Releases hier: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Nutzungsanweisungen sind in der README dort enthalten, aber wir werden einige Beispiele unten behandeln.

Der Docker-Container-Tag dafür ist `rocketpool/treegen:latest`.

## Erstellen eines Dry-Run-Trees

Führen Sie für einen ersten Test `treegen` aus, um einen Dry-Run-Tree zu generieren, der den Tree vom Beginn des Rewards-Intervalls bis zum letzten (finalisierten) Slot berechnet.
Wir verwenden [das Skript](https://github.com/rocket-pool/treegen/blob/main/treegen.sh), das im Repository enthalten ist und den Docker-Container nutzt, um ihn der Einfachheit halber auf dem Node selbst auszuführen:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning HINWEIS
Beachten Sie, dass diese spezielle Konfiguration erfordert, dass Sie die Execution-Client- und Beacon-Node-APIs über die Docker-Konfiguration verfügbar machen - stellen Sie sicher, dass beide Optionen in der `rocketpool service config` TUI aktiviert sind.
:::

Dies testet die Fähigkeiten Ihrer Clients, rechtzeitig auf Anfragen zu antworten (wenn Sie beispielsweise einen Drittanbieterdienst verwenden, ist dies hilfreich, um zu beurteilen, ob dessen Anfragelimit unzureichend ist), **testet jedoch nicht deren Archive-Mode-Fähigkeiten**.
Es erzeugt eine Ausgabe wie die folgende:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

Wenn dies ohne Fehler ausgeführt wird, werden die Rewards-Tree-Artefakte generiert und als JSON-Dateien in Ihrem Arbeitsverzeichnis gespeichert.
Sie können diese gerne erkunden und sicherstellen, dass ihr Inhalt plausibel ist, aber da es sich um Dry-Run-Dateien handelt, werden sie nirgendwo kanonisch zum Vergleich gespeichert.

## Erstellen eines kanonischen Trees aus einem vergangenen Intervall

Dieser nächste Test besteht darin, einen der vollständigen Trees aus einem vergangenen Intervall zu replizieren.
Dies erfordert archivalen Zugriff sowohl auf der Execution Layer als auch auf der Consensus Layer, sodass es als guter Test für beide Fähigkeiten dient.

Zum Zeitpunkt des Schreibens ist **Intervall 2** eine ideale Wahl, da es weit in der Vergangenheit liegt und den Smoothing Pool umfasste (der die größte Rechenlast bei der Berechnung der Rewards für den Zeitraum ausmacht).

Führen Sie `treegen` mit dem folgenden Befehl aus:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

Beachten Sie, dass die **Execution-Client-URL** hier anders ist: Es _muss_ ein Archive-EC sein, da der Snapshot-Block für Intervall 2 weit in der Vergangenheit lag.

::: warning HINWEIS
Abhängig von Ihrer Client-Konfiguration kann das Erstellen dieses Trees _Stunden_ dauern.
Der Smartnode gibt Ihnen Statusindikatoren über seinen Fortschritt, wie Sie im Beispiel unten sehen können.
:::

Die Ausgabe sieht folgendermaßen aus (der Kürze halber gekürzt):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

Das Wichtigste, worauf Sie hier achten sollten, ist diese Nachricht am Ende:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Wenn Sie diese erhalten, kann Ihr Watchtower den Tree korrekt erstellen.

::: danger HINWEIS
Obwohl dies beweist, dass Sie den Tree erstellen können, _müssen_ Sie sicherstellen, dass Ihr Web3.Storage-API-Token in die Konfiguration des Smartnode eingegeben wurde, damit dieser den resultierenden Tree auf IPFS hochladen kann.
:::

### Nächste Schritte

Als Nächstes werden wir behandeln, wie Sie die Performance Ihres Nodes überwachen können.
