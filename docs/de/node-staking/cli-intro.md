# Einführung in die Befehlszeilenschnittstelle

Als Knotenbetreiber ist die CLI Ihr primäres Werkzeug für die Interaktion mit Rocket Pool.
Sie werden sie verwenden, um neue Minipools zu erstellen, den Status von allem zu überprüfen, periodische RPL-Belohnungen zu beanspruchen, aus Ihren Minipools auszusteigen und abzuheben, wenn Sie bereit sind, und eine Vielzahl anderer Aktivitäten durchzuführen.

Sobald Sie die Synchronisierung der Execution- und Beacon-Chains abgeschlossen haben, stehen Ihnen alle Befehle zur Verfügung.
In diesem Abschnitt geben wir Ihnen einen kurzen Überblick über einige der gängigeren Befehle und einige andere Tricks, die die CLI kann.

## Informationen über die Befehle

Um alle verfügbaren Befehle aufzulisten, geben Sie ein:

```shell
rocketpool help
```

Die Ausgabe sieht so aus:

```

______           _        _    ______           _
| ___ \         | |      | |   | ___ \         | |
| |_/ /___   ___| | _____| |_  | |_/ /__   ___ | |
|    // _ \ / __| |/ / _ \ __| |  __/ _ \ / _ \| |
| |\ \ (_) | (__|   <  __/ |_  | | | (_) | (_) | |
\_| \_\___/ \___|_|\_\___|\__| \_|  \___/ \___/|_|

Authored by the Rocket Pool Core Team
A special thanks to the Rocket Pool community for all their contributions.

NAME:
   rocketpool - Rocket Pool CLI

USAGE:
   rocketpoolcli [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   auction, a   Manage Rocket Pool RPL auctions
   claims, l    View and claim all available rewards and credits across the node
   minipool, m  Manage the node's minipools
   megapool, g  Manage the node's megapool
   network, e   Manage Rocket Pool network parameters
   node, n      Manage the node
   odao, o      Manage the Rocket Pool oracle DAO
   pdao, p      Manage the Rocket Pool Protocol DAO
   queue, q     Manage the Rocket Pool deposit queue
   security, c  Manage the Rocket Pool security council
   service, s   Manage Rocket Pool service
   wallet, w    Manage the node wallet
   help, h      Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --allow-root, -r              Allow rocketpool to be run as the root user
   --config-path path, -c path   Rocket Pool config asset path (default: "~/.rocketpool")
   --daemon-path path, -d path   Interact with a Rocket Pool service daemon at a path on the host OS, running outside of docker
   --maxFee value, -f value      The max fee (including the priority fee) you want a transaction to cost, in gwei (default: 0)
   --maxPrioFee value, -i value  The max priority fee you want a transaction to use, in gwei (default: 0)
   --gasLimit value, -l value    [DEPRECATED] Desired gas limit (default: 0)
   --nonce value                 Use this flag to explicitly specify the nonce that this transaction should use, so it can override an existing 'stuck' transaction
   --debug                       Enable debug printing of API commands
   --secure-session, -s          Some commands may print sensitive information to your terminal. Use this flag when nobody can see your screen to allow sensitive data to be printed without prompting
   --help, -h                    show help
   --version, -v                 print the version

COPYRIGHT:
   (c) 2026 Rocket Pool Pty Ltd
```

## Service-Befehle

Die Service-Gruppe umfasst die Verwaltung der verschiedenen Dienste, die der Smart Node für Sie verwaltet.

Dies zeigt die Ausgabe von `rocketpool service help`:

```
NAME:
   rocketpool service - Manage Rocket Pool service

USAGE:
   rocketpool service [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   install, i                 Install the Rocket Pool service
   config, c                  Configure the Rocket Pool service
   status, u                  View the Rocket Pool service status
   start, s                   Start the Rocket Pool service
   pause, p                   Pause the Rocket Pool service
   stop, o                    Pause the Rocket Pool service (alias of 'rocketpool service pause')
   reset-docker, rd           Cleanup Docker resources, including stopped containers, unused images and networks. Stops and restarts Smart Node.
   prune-docker, pd           Cleanup unused Docker resources, including stopped containers, unused images, networks and volumes. Does not restart smartnode, so the running containers and the images and networks they reference will not be pruned.
   logs, l                    View the Rocket Pool service logs
   stats, a                   (DEPRECATED) No longer supported. Use 'docker stats -a' instead
   compose                    View the Rocket Pool service docker compose config
   version, v                 View the Rocket Pool service version information
   prune-eth1, n              Shuts down the main ETH1 client and prunes its database, freeing up disk space, then restarts it when it's done.
   install-update-tracker, d  Install the update tracker that provides the available system update count to the metrics dashboard
   get-config-yaml            Generate YAML that shows the current configuration schema, including all of the parameters and their descriptions
   resync-eth1                Deletes the main ETH1 client's chain data and resyncs it from scratch. Only use this as a last resort!
   resync-eth2                Deletes the ETH2 client's chain data and resyncs it from scratch. Only use this as a last resort!
   terminate, t               Deletes all of the Rocket Pool Docker containers and volumes, including your ETH1 and ETH2 chain data and your Prometheus database (if metrics are enabled). Also removes your entire `.rocketpool` configuration folder, including your wallet, password, and validator keys. Only use this if you are cleaning up the Smart Node and want to start over!

GLOBAL OPTIONS:
   --compose-file value, -f value  Optional compose files to override the standard Rocket Pool docker compose YAML files; this flag may be defined multiple times
   --help, -h                      show help
```

### `status`

Dieser Befehl zeigt Ihnen den aktuellen Ausführungsstatus jedes der von Rocket Pool verwalteten Docker-Container.
Zum Beispiel sieht die Ausgabe der Standard-Docker-Installation so aus:

```
        Name                       Command              State                                                       Ports
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
rocketpool_api          /bin/sleep infinity             Up
rocketpool_eth1         sh /setup/start-node.sh         Up      0.0.0.0:30303->30303/tcp,:::30303->30303/tcp, 0.0.0.0:30303->30303/udp,:::30303->30303/udp, 8545/tcp, 8546/tcp
rocketpool_eth2         sh /setup/start-beacon.sh       Up      0.0.0.0:9001->9001/tcp,:::9001->9001/tcp, 0.0.0.0:9001->9001/udp,:::9001->9001/udp
rocketpool_node         /go/bin/rocketpool node         Up
rocketpool_validator    sh /setup/start-validator.sh    Up
rocketpool_watchtower   /go/bin/rocketpool watchtower   Up
```

Sie können ihn verwenden, um schnell zu überprüfen, ob einer der Docker-Container Probleme hat, oder um sicherzustellen, dass ein `start`- oder `stop`-Befehl korrekt funktioniert hat.

### `start` und `stop`

Diese beiden Befehle kennen Sie bereits.
Sie starten einfach alle Rocket Pool-Container oder stoppen sie.

::: tip
Der `pause`-Befehl macht dasselbe wie `stop`.
Er ist nur als Legacy-Befehl aus früheren Versionen von Rocket Pool übrig geblieben.
:::

### `logs`

Dieser Befehl ist ein weiterer, den Sie bereits gesehen haben sollten.
Sie können ihn verwenden, um die Ausgabeprotokolle jedes Docker-Containers anzuzeigen.
Dies kann bei der Fehlersuche oder zum Abrufen eines detaillierteren Statusberichts nützlich sein.

Wenn Sie einfach `rocketpool service logs` ohne weitere Argumente ausführen, werden alle Protokolle zusammengefasst und Ihnen auf einmal angezeigt.

Wenn Sie sich auf die Ausgabe eines Containers konzentrieren möchten, können Sie am Ende ein Argument hinzufügen, um den Container anzugeben.
Gültige Werte sind `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` und `node-exporter`.

### `stats`

Dieser Befehl zeigt Ihnen einige Ressourcenstatistiken von jedem der Container an, mit denen Sie den Hardware- und Netzwerkverbrauch jedes einzelnen profilieren können.

Sie könnten ihn nützlich finden, um die Container zu überwachen, wenn Ihr System langsam läuft oder RAM-Probleme hat.

Hier ist eine Beispielausgabe:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip HINWEIS
Die RAM-Statistik hier zeigt **insgesamt zugewiesenen Speicher**, der _virtuellen_ Speicher einschließt.
Sie zeigt nicht den reinen _residenten_ Speicherverbrauch an.

Ebenso zeigt die CPU-Nutzung die Gesamtmenge an CPU-Verbrauch, gemittelt über alle CPU-Kerne, die der Container verwendet.
Hier zeigt die CPU für ETH2 fast 100%, da sie Nimbus verwendet, das single-threaded ist.

Möglicherweise finden Sie, dass ein Programm wie `htop` oder `btop` besseren Einblick in den tatsächlichen Ressourcenverbrauch bietet.
:::

### `config`

Dieser Befehl führt das Konfigurationsinterview erneut durch.
Sie können ihn verwenden, wenn Sie Ihre Auswahl an Execution- oder Consensus-Client ändern möchten oder einige der Parameter ändern möchten, die Sie bei der Auswahl anfänglich angegeben haben (wie die Graffiti-Nachricht Ihres Validators, die maximale Anzahl von Peers, zu denen eine Verbindung hergestellt werden soll, usw.).

Sie können diesen Befehl jederzeit aufrufen, aber die Änderungen werden erst wirksam, wenn Sie `rocketpool service stop` und `rocketpool service start` aufrufen.

### `terminate`

Dieser Befehl fährt die Docker-Container herunter, löscht sie dann, löscht das virtuelle Netzwerk von Rocket Pool und löscht die ETH1- und ETH2-Chain-Daten-Volumes.
Er entfernt im Wesentlichen alle Rocket Pool-Elemente aus Ihrer Docker-Einrichtung.
Verwenden Sie ihn, wenn Sie diesen Teil der Rocket Pool-Installation bereinigen möchten.

::: warning
Dies wird Ihre Chain-Daten unwiderruflich entfernen, was bedeutet, dass Sie ETH1 und ETH2 erneut synchronisieren müssen.

Dies wird Ihre Wallet- und Passwortdateien, Ihre konfigurierten Einstellungen oder Ihre Validator-Schlüssel **nicht** entfernen.
Um diese zu entfernen, müssen Sie den `~/.rocketpool/data`-Ordner im Docker- oder Hybrid-Modus oder das entsprechende Verzeichnis im Native-Modus löschen.
:::

## Knoten-Befehle

Die `node`-Gruppe umfasst Operationen auf Ihrem Rocket Pool-Knoten.
Wir werden diese im nächsten Abschnitt, in dem wir einen Minipool erstellen, ausführlicher behandeln, aber es kann hilfreich sein, sie alle auf einen Blick zu sehen.

Dies zeigt die Ausgabe von `rocketpool node help`:

```
NAME:
   rocketpool node - Manage the node

USAGE:
   rocketpool node command [command options] [arguments...]

COMMANDS:
   status, s                                     Get the node's status
   sync, y                                       Get the sync progress of the eth1 and eth2 clients
   register, r                                   Register the node with Rocket Pool
   rewards, e                                    Get the time and your expected RPL rewards of the next checkpoint
   set-primary-withdrawal-address, w             Set the node's primary withdrawal address, which will receive all ETH rewards (and RPL if the RPL withdrawal address is not set)
   confirm-primary-withdrawal-address, f         Confirm the node's pending primary withdrawal address if it has been set back to the node's address itself
   set-rpl-withdrawal-address, srwa              Set the node's RPL withdrawal address, which will receive all RPL rewards and staked RPL withdrawals
   confirm-rpl-withdrawal-address, crwa          Confirm the node's pending rpl withdrawal address if it has been set back to the node's address itself
   allow-rpl-locking, arl                        Allow the node to lock RPL when creating governance proposals/challenges
   deny-rpl-locking, drl                         Do not allow the node to lock RPL when creating governance proposals/challenges
   set-timezone, t                               Set the node's timezone location
   swap-rpl, p                                   Swap old RPL for new RPL
   stake-rpl, k                                  Stake RPL against the node
   add-address-to-stake-rpl-whitelist, asw       Adds an address to your node's RPL staking whitelist, so it can stake RPL on behalf of your node.
   remove-address-from-stake-rpl-whitelist, rsw  Removes an address from your node's RPL staking whitelist, so it can no longer stake RPL on behalf of your node.
   claim-rewards, c                              Claim available RPL and ETH rewards for any checkpoint you haven't claimed yet
   withdraw-rpl, i                               Withdraw RPL staked against the node
   withdraw-eth, h                               Withdraw ETH staked on behalf of the node
   withdraw-credit, wc                           (Saturn) Withdraw ETH credit from the node as rETH
   deposit, d                                    Make a deposit and create a minipool
   create-vacant-minipool, cvm                   Create an empty minipool, which can be used to migrate an existing solo staking validator as part of the 0x00 to 0x01 withdrawal credentials upgrade
   send, n                                       Send ETH or tokens from the node account to an address. ENS names supported. Use 'all' as the amount to send the entire balance. <token> can be 'rpl', 'eth', 'fsrpl' (for the old RPL v1 token), 'reth', or the address of an arbitrary token you want to send (including the 0x prefix).
   set-voting-delegate, sv                       (DEPRECATED) Use `rocketpool pdao set-signalling-address` instead
   clear-voting-delegate, cv                     (DEPRECATED) Use `rocketpool pdao clear-signalling-address` instead
   initialize-fee-distributor, z                 Create the fee distributor contract for your node, so you can withdraw priority fees and MEV rewards after the merge
   distribute-fees, b                            Distribute the priority fee and MEV rewards from your fee distributor to your withdrawal address and the rETH contract (based on your node's average commission)
   join-smoothing-pool, js                       Opt your node into the Smoothing Pool
   leave-smoothing-pool, ls                      Leave the Smoothing Pool
   sign-message, sm                              Sign an arbitrary message with the node's private key
   send-message                                  Send a zero-ETH transaction to the target address (or ENS) with the provided hex-encoded message as the data payload
   claim-unclaimed-rewards, cur                  Sends any unclaimed rewards to the node's withdrawal address
   provision-express-tickets, pet                Provision the node's express tickets

OPTIONS:
   --help, -h  show help
```

Im Folgenden finden Sie eine Zusammenfassung einiger Befehle, die Sie während des typischen Knotenbetriebs benötigen werden.

### `status`

Dieser Befehl gibt Ihnen einen Überblick über Ihren gesamten Knoten auf einen Blick.
Er zeigt, wie viel ETH und RPL Sie gestaked haben, wie viele Minipools Sie haben und deren Status, Ihr RPL-Collateral-Verhältnis und mehr.

Dies ist ein Beispiel dafür, was `rocketpool node status` zeigt, sobald Sie Ihren Knoten registriert und einige Minipools eingerichtet haben:

```
=== Account and Balances ===
The node 0x4d19DE4A5a1B1B36EBaB3D5c32C01061fbDE328d has a balance of 49.402553 ETH and 0.000000 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new validators.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Megapool ===
The node has a megapool deployed at 0xCf3576c5A6e5a25AC00C9adb6751924BAe1680B1.
The megapool has 9 validators.
The node has 0 express queue ticket(s).

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit https://docs.rocketpool.net/pdao/participate#setting-your-snapshot-signalling-address.
Rocket Pool has no Snapshot governance proposals being voted on.

=== Onchain Voting ===
The node doesn't have a delegate, which means it can vote directly on onchain proposals. You can have another node represent you by running `rocketpool p svd <address>`.
The node is NOT allowed to lock RPL to create governance proposals/challenges.

=== Primary Withdrawal Address ===
The node's primary withdrawal address has not been changed, so ETH rewards and minipool withdrawals will be sent to the node itself.
Consider changing this to a cold wallet address that you control using the `set-withdrawal-address` command.

=== RPL Withdrawal Address ===
The node's RPL withdrawal address has not been set. All RPL rewards will be sent to the primary withdrawal address.

=== Fee Distributor and Smoothing Pool ===
The node's fee distributor 0x84c1f488CDecb2E335c40901E3Fe58925f4cC9A7 has a balance of 0.004897 ETH.
NOTE: You are in Native Mode; you MUST ensure that your Validator Client is using this address as its fee recipient!
The node is not opted into the Smoothing Pool.
To learn more about the Smoothing Pool, please visit https://docs.rocketpool.net/upgrades/redstone/whats-new#smoothing-pool.
You have 3 minipools that would earn extra commission if you opted into the smoothing pool!
See https://rpips.rocketpool.net/RPIPs/RPIP-62 for more information about bonus commission, or run `rocketpool node join-smoothing-pool` to opt in.

=== RPL Stake ===
NOTE: The following figures take *any pending bond reductions* into account.

The node has a total stake of 20000.000000 RPL.
This is currently 3.74% of its borrowed ETH and 30.06% of its bonded ETH.
The node has 0.000000 megapool staked RPL.
The node has 20000.000000 legacy staked RPL.
The node has a total stake (legacy minipool RPL plus megapool RPL) of 20000.000000 RPL.
You have 0.000000 RPL staked on your megapool and can request to unstake up to 0.000000 RPL

=== Minipools ===
The node has a total of 3 active minipool(s):
- 3 staking
```

### `sync`

Dieser Befehl zeigt Ihnen den aktuellen Synchronisationsstatus Ihrer Execution- und Consensus-Clients.
Sie werden ihn wahrscheinlich viel verwenden, wenn Sie den Knoten zum ersten Mal einrichten, und ihn dann nie wieder benötigen (es sei denn, Sie ändern oder setzen Ihre Clients zurück).

Die Ausgabe von `rocketpool node sync` sieht so aus:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Beachten Sie, dass **Prysm** derzeit keine Prozentangabe zur Fertigstellung bereitstellt - Sie müssen in die `eth2`-Protokolle schauen, wenn Sie es verwenden.

### `stake-rpl`

Dieser Befehl ist das, was Sie verwenden, wenn Sie mehr RPL-Collateral zu Ihrem Knoten hinzufügen möchten.
Dadurch erhöht sich Ihr Collateral-Verhältnis, was Ihre RPL-Belohnungen bei jedem Checkpoint erhöht (mehr dazu später).

Im Gegensatz zu den bisherigen Befehlen ist dieser tatsächlich _interaktiv_, da er eine Transaktion auslöst - er ist nicht nur informativ.

Er fragt Sie zunächst, wie viel RPL Sie staken möchten, mit einigen vordefinierten Optionen zur Bequemlichkeit oder der Möglichkeit, einen benutzerdefinierten Betrag anzugeben:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Sobald Sie eine Option ausgewählt haben, werden Ihnen einige Informationen über den vorgeschlagenen Gaspreis und den geschätzten zu verwendenden Betrag sowie ein Bestätigungsdialog angezeigt. Wenn Sie zum ersten Mal RPL auf dem Knoten staken, müssen Sie dem Staking-Vertrag die Genehmigung erteilen, mit Ihrem RPL zu interagieren:

```
Before staking RPL, you must first give the staking contract approval to interact with your RPL.
This only needs to be done once for your node.
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0001 to 0.0001 ETH |
| 1 Minute      | 4 gwei    | 0.0001 to 0.0001 ETH |
| 3 Minutes     | 4 gwei    | 0.0001 to 0.0001 ETH |
| >10 Minutes   | 4 gwei    | 0.0001 to 0.0001 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Do you want to let the staking contract interact with your RPL? [y/n]
y

Approving RPL for staking...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully approved staking access to RPL.
RPL Stake Gas Info:
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0005 to 0.0007 ETH |
| 1 Minute      | 4 gwei    | 0.0005 to 0.0007 ETH |
| 3 Minutes     | 4 gwei    | 0.0005 to 0.0007 ETH |
| >10 Minutes   | 4 gwei    | 0.0005 to 0.0007 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to stake 733.993925 RPL? You will not be able to unstake this RPL until you exit your validators and close your minipools, or reach 2201.981777 staked RPL (15% of bonded eth)! [y/n]
```

Wenn Sie bestätigen, werden Ihnen der Transaktionshash angezeigt und ein Link zu [Etherscan](https://etherscan.io) gegeben, damit Sie den Fortschritt verfolgen können:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

Die meisten Operationen erfordern nur eine Transaktion, sodass die CLI wartet, bis sie in einem Block enthalten ist, und dann beendet wird. stake-rpl ist jedoch einer der wenigen Befehle, die zwei Transaktionen erfordern, sodass dieser Dialog zweimal erscheint.

### `claim-rewards`

Wenn Ihr Knoten einen neuen Belohnungs-Checkpoint erkennt, lädt er automatisch die Belohnungsbaum-Datei mit den Informationen für dieses Intervall herunter (wenn Sie die Standardeinstellung Download-Modus verwenden - siehe unten für Informationen zum Generieren Ihrer eigenen Bäume anstelle des Herunterladens).
Sie können dann Ihre Belohnungen mit folgendem Befehl überprüfen:

```
rocketpool node claim-rewards
```

Während die Intervalle vergehen und Sie Belohnungen ansammeln, sieht die Ausgabe so aus:

![](../node-staking/images/claim-rewards-gb.png)

Hier können Sie schnell sehen, wie viele Belohnungen Sie bei jedem Intervall verdient haben, und entscheiden, welche Sie beanspruchen möchten.

Sie können auch einen Betrag angeben, den Sie während dieser Beanspruchung re-staken möchten:

![](../node-staking/images/autostake.png)

Dadurch können Sie Ihre RPL-Belohnungen in einer Transaktion aufzinsen und erheblich weniger Gas verwenden, als Sie derzeit mit dem Legacy-Beanspruchungssystem verwenden mussten.

::: tip HINWEIS
Wenn Sie den Belohnungs-Checkpoint lieber manuell erstellen möchten, anstatt den vom Oracle DAO erstellten herunterzuladen, können Sie diese Einstellung in der TUI von `Download` auf `Generate` ändern:

![](../node-staking/images/tui-generate-tree.png)

Wie der Tipp andeutet, benötigen Sie dazu Zugriff auf einen Archive-Knoten des Execution-Clients.
Wenn Ihr lokaler Execution-Client kein Archive-Knoten ist, können Sie im selben Menü weiter unten unter `Archive-Mode EC URL` einen separaten angeben (z. B. Infura oder Alchemy).
Diese URL wird nur beim Generieren von Merkle-Bäumen verwendet; sie wird nicht für Validierungsaufgaben verwendet.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Dies zeichnet Sie als eingetragen in den Rocket Pool-Verträgen auf und ändert automatisch den `Fee Recipient` Ihres Validator-Clients von Ihrem Knoten-Distributor-Vertrag zum Smoothing Pool-Vertrag.

Beachten Sie, dass es nach der Anmeldung eine **28-tägige Abkühlzeit** (eine volle Belohnungsintervall-Länge) gibt, bis Sie sich abmelden können.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Dies meldet Sie vom Smoothing Pool ab, wenn Sie derzeit angemeldet sind und mindestens 28 Tage nach der Anmeldung gewartet haben.
Sobald **die nächste Epoche nach der aktuellen Epoche** finalisiert ist, wird automatisch der `Fee Recipient` Ihres Knotens vom Smoothing Pool zurück zum Distributor-Vertrag Ihres Knotens geändert.
Dies soll sicherstellen, dass Sie nicht für Front-Running des Exit-Prozesses bestraft werden, wenn Sie sehen, dass Sie einen Vorschlag haben.


### `distribute-fees`

Sobald Sie Belohnungen auf Ihrem Fee Distributor angesammelt haben, können Sie dessen gesamtes Guthaben mit folgendem Befehl beanspruchen und verteilen:

```shell
rocketpool node distribute-fees
```

Dies sendet Ihren Anteil der Belohnungen an Ihre **Withdrawal-Adresse**.

### `send`

Dieser Befehl ermöglicht es Ihnen, ETH, RPL oder andere Rocket Pool-bezogene Token von der Knoten-Wallet an eine andere Adresse zu senden.
Dies könnte nützlich sein, wenn Sie Ihre Mittel auf der Wallet an einen anderen Ort verschieben möchten.

Die Syntax für die Verwendung des `send`-Befehls sieht so aus:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Die Argumente sind wie folgt:

- `<amount>` ist die Menge des zu sendenden Tokens.
- `<token>` ist das zu sendende Token - dies kann `eth`, `rpl`, `fsrpl` (das alte Legacy-RPL-Token) oder `reth` sein.
- `<address or ENS name>` ist die Ethereum-Adresse (oder ENS-Name), an die die Token gesendet werden sollen.

Zum Beispiel:

```shell
rocketpool node send 1 eth <my friend's address>
```

würde 1 ETH an meinen Freund senden.

## Megapool-Befehle
Die `megapool`-Gruppe ist der Ort, an dem Sie auf alle Befehle zur Verwaltung Ihres Megapools und der Megapool-Validatoren zugreifen können.

Hier sehen Sie, was `rocketpool megapool help` anzeigt:

```
NAME:
   rocketpool megapool - Manage the node's megapool

USAGE:
   rocketpool megapool [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   deposit, d                Make a deposit and create a new validator on the megapool. Optionally specify count to make multiple deposits.
   status, s                 Get the node's megapool status
   validators, v             Get a list of the megapool's validators
   repay-debt, r             Repay megapool debt
   reduce-bond, e            Reduce the megapool bond
   claim, c                  Claim any megapool rewards that were distributed but not yet claimed
   stake, k                  Stake a megapool validator
   exit-queue, x             Exit the megapool queue
   dissolve-validator, i     Dissolve a megapool validator
   exit-validator, t         Request to exit a megapool validator
   notify-validator-exit, n  Notify that a validator exit is in progress
   notify-final-balance, f   Notify that a validator exit has completed and the final balance has been withdrawn
   distribute, b             Distribute any accrued execution layer rewards sent to this megapool

GLOBAL OPTIONS:
   --help, -h  show help
```

Im Folgenden finden Sie eine Zusammenfassung der Befehle, die Sie typischerweise im normalen Betrieb verwenden werden:

### `deposit`
Dieser Befehl ermöglicht es Ihnen, neue Validatoren auf Ihrem Megapool zu erstellen. Wir werden später ausführlicher darauf eingehen. Springen Sie gerne schon jetzt zu [Erstellen eines Megapool-Validators](/node-staking/megapools/create-megapool-validator.mdx) für eine Vorschau.

### `status`
Dieser Befehl gibt Ihnen Informationen über den Zustand Ihres Megapools und der von Ihrem Megapool verwalteten Validatoren. Sie können die Adresse Ihres Megapools, die Anzahl der Express-Queue-Tickets, die Delegate-Adresse Ihres Megapools, den ETH-Saldo auf der Execution- und Consensus-Layer und viele andere nützliche Informationen einsehen. Hier ist ein Beispiel der `rocketpool megapool status`-Ausgabe:

```
=== Megapool ===
The node has a megapool deployed at 0xCf3576c5A6e5a25AC00C9adb6751924BAe1680B1
The node has 0 express ticket(s).
The megapool has 9 validators.

=== Megapool Delegate ===
The megapool is using the latest delegate.
The megapool's effective delegate address is 0x138602A95956995280f1146aA9477d6B4E481B3c
The megapool has automatic delegate upgrades disabled. You can toggle this setting using 'rocketpool megapool set-use-latest-delegate'.

=== Megapool Balance ===
The megapool has 4.000000 node bonded ETH.
The megapool has 28.000000 RP ETH for a total of 32.000000 bonded ETH.
Megapool balance (EL): 32.051883 ETH
The megapool has 1 validators exiting. You'll be able to see claimable rewards once the exit process is completed.
Beacon balance (CL): 0.000000 ETH
Your portion: 0.000000 ETH
Current network commission: 5.000000%
```

### `validators`
Der Befehl `rocketpool megapool validators` zeigt Ihnen den Status jedes einzelnen Validators, der vom Megapool Ihres Knotens verwaltet wird. Sie können Informationen wie die Validator-Pubkeys, den Beacon-Chain-Status und die Warteposition von Validatoren im Prestake-Zustand einsehen:
```
There are 8 validator(s) on the express queue.
There are 2 validator(s) on the standard queue.
The express queue rate is 2.

1 Staking validator(s):

Megapool Validator ID:        1
Validator pubkey:             <pubkey>
Validator active:             no
Validator index:              <index>
Beacon status:                pending_queued
Express Ticket Used:          no


1 Initialized validator(s):

--------------------

Megapool Validator ID:        2
Expected pubkey:              <pubkey>
Validator active:             no
Validator Queue Position:     10
Express Ticket Used:          no


1 Exiting validator(s):

--------------------

Megapool Validator ID:        0
Validator pubkey:             <pubkey>
Validator active:             no
Validator index:              <index>
Beacon status:                withdrawal_done
Express Ticket Used:          yes

```

### `exit-validator`

Dieser Befehl ermöglicht es Ihnen, einen Validator für den freiwilligen Austritt auf der Beacon Chain auszuwählen. Verwenden Sie ihn, wenn Sie einen Validator schließen und sein endgültiges ETH-Guthaben abheben möchten. Beachten Sie, dass dies nicht rückgängig gemacht werden kann - sobald Sie einen Austritt auslösen, wird der Validator dauerhaft heruntergefahren.


## Minipool-Befehle

Die `minipool`-Gruppe umfasst Befehle, die Ihre Minipools betreffen.
Wie bei der `node`-Gruppe werden wir diese im nächsten Abschnitt ausführlicher behandeln, aber es kann hilfreich sein, sie alle jetzt zu sehen.

Dies zeigt die Ausgabe von `rocketpool minipool help`:

```
NAME:
   rocketpool minipool - Manage the node's minipools

USAGE:
   rocketpool minipool command [command options] [arguments...]

COMMANDS:
   status, s                  Get a list of the node's minipools
   stake, t                   Stake a minipool after the scrub check, moving it from prelaunch to staking.
   set-withdrawal-creds, swc  Convert the withdrawal credentials for a migrated solo validator from the old 0x00 value to the minipool address. Required to complete the migration process.
   import-key, ik             Import the externally-derived key for a minipool that was previously a solo validator, so the Smart Node's VC manages it instead of your externally-managed VC.
   promote, p                 Promote a vacant minipool after the scrub check, completing a solo validator migration.
   refund, r                  Refund ETH belonging to the node from minipools
   begin-bond-reduction, bbr  Begins the ETH bond reduction process for a minipool, taking it from 16 ETH down to 8 ETH (begins conversion of a 16 ETH minipool to an LEB8)
   reduce-bond, rb            Manually completes the ETH bond reduction process for a minipool from 16 ETH down to 8 ETH once it is eligible. Please run `begin-bond-reduction` first to start this process.
   distribute-balance, d      Distribute a minipool's ETH balance between your withdrawal address and the rETH holders.
   exit, e                    Exit staking minipools from the beacon chain
   close, c                   Withdraw any remaining balance from a minipool and close it
   delegate-upgrade, u        Upgrade a minipool's delegate contract to the latest version
   find-vanity-address, v     Search for a custom vanity minipool address
   rescue-dissolved, rd       Manually deposit ETH into the Beacon deposit contract for a dissolved minipool, activating it on the Beacon Chain so it can be exited.

OPTIONS:
   --help, -h  show help
```

Im Folgenden finden Sie eine Zusammenfassung der Befehle, die Sie typischerweise verwenden werden.

### `status`

Dieser Befehl bietet einfach eine Zusammenfassung jedes Ihrer Minipools.
Dies umfasst den aktuellen Status, die eth1-Adresse des Minipools, die Provision darauf (genannt `node fee`), den öffentlichen Schlüssel des entsprechenden ETH2-Validators und einige andere Dinge:

```
$ rocketpool minipool status

1 Staking minipool(s):

--------------------

Address:                <minipool eth1 address>
Penalties:             0
Status updated:        2025-07-15, 08:31 +0000 UTC
Node fee:              5.000000%
Node deposit:          8.000000 ETH
RP ETH assigned:       2025-07-14, 20:26 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.064202 ETH
Your portion:          0.018458 ETH
Available refund:      0.000000 ETH
Total EL rewards:      0.018458 ETH
Validator pubkey:      <validator eth2 address>
Validator index:       <validator eth2 index>
Validator active:      yes
Beacon balance (CL):   32.000347 ETH
Your portion:          8.000099 ETH
Use latest delegate:   no
Delegate address:      0x56903694d881282D33ed0643EAe14263880Dd47F
Rollback delegate:     <none>
Effective delegate:    0x56903694d881282D33ed0643EAe14263880Dd47F
```

### `refund`

Dieser Befehl ermöglicht es Ihnen, 16 ETH von einem Minipool zurückzuziehen, wenn Sie 32 ETH eingezahlt haben, um einen zu erstellen, sobald Rocket Pool 16 ETH aus dem rETH-Staking-Pool beisteuern konnte.

### `exit`

Dieser Befehl reicht einen freiwilligen Austritt für Ihren Validator auf der Beacon Chain ein.
Verwenden Sie dies, wenn Sie einen Validator schließen und sein endgültiges ETH-Guthaben abheben möchten.
Beachten Sie, dass **dies nicht rückgängig gemacht werden kann** - sobald Sie einen Austritt auslösen, wird der Validator dauerhaft heruntergefahren.

## Nützliche Flags

Es gibt einige nützliche globale Flags, die Sie zu einigen der oben genannten Befehle hinzufügen können, die Sie möglicherweise nutzen möchten.

### Festlegen einer benutzerdefinierten Max Fee oder Priority Fee (Gaspreis)

Ab dem [London ETH1-Hardfork](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) im Juli 2021 verwenden Ethereum-Transaktionen keinen einzelnen Gaspreis mehr für ihre Transaktionen.
Stattdessen verwenden moderne Ethereum-Transaktionen zwei Werte:

- Die **max fee**, die den absoluten maximalen Gaspreis beschreibt, den Sie für eine Transaktion zu akzeptieren bereit sind
- Die **max priority fee**, die den maximalen Betrag beschreibt, den Sie bereit sind, den Miner für die Aufnahme Ihrer Transaktion in einen Block zu "tippen"

::: tip TIPP
Die Art und Weise, wie diese beiden Werte funktionieren, kann etwas verwirrend sein, hier sind also einige einfache Beispiele.

Nehmen wir an, die aktuelle Netzwerkgebühr, genannt **base fee**, beträgt 50 gwei.
Sie senden eine Transaktion mit einer **80 gwei** max fee und einer Priority Fee von **2 gwei**.

Da die Base Fee des Netzwerks niedriger ist als Ihre Max Fee, könnte diese Transaktion im aktuellen Block aufgenommen werden.
Es würde Sie **50 gwei** für die Base Fee und **2 gwei** für die Priority Fee kosten; obwohl Sie Ihre Max Fee auf 80 gesetzt haben, **würde es Sie nur insgesamt 52 gwei kosten**.

Als weiteres Beispiel, nehmen wir an, Sie haben dieselbe Transaktion, aber jetzt beträgt die Base Fee des Netzwerks **100 gwei**.
Da 100 gwei größer ist als Ihre 80 gwei Max Fee, wird Ihre Transaktion **nicht** in diesem Block enthalten sein.
Stattdessen wird sie einfach im Transaktionspool bleiben, bis die Base Fee niedrig genug ist, um sie aufzunehmen.

Nehmen wir nun an, die aktuelle Base Fee beträgt wieder **50 gwei**, und Ihre Transaktion hat eine Max Fee von **80** gwei und eine Priority Fee von **4 gwei**.
Sie würde mit Gesamtkosten von **54 gwei** ausgeführt.
Die 4 gwei Priority Fee würde sicherstellen, dass sie vor allen Transaktionen mit einer niedrigeren Priority Fee aufgenommen wird.

Wenn Sie **wirklich** wollen, dass die Transaktion auf jeden Fall durchgeht, können Sie die Priority Fee auf denselben Wert wie die Max Fee setzen.
Dies emuliert das Legacy-Gasverhalten, sodass Ihre Transaktion das gesamte Gas verwenden wird, das Sie ihr geben - unabhängig davon, ob die Base Fee des Netzwerks niedriger ist als Ihre Max Fee oder nicht.
:::

Standardmäßig verwendet Rocket Pool ein Oracle, um sich den aktuellen Transaktionspool anzusehen und eine vernünftige Max Fee für alle von Ihnen ausgelösten Transaktionen vorzuschlagen.
Es verwendet [EtherChain](https://etherchain.org/tools/gasnow) für sein primäres Vorschlags-Oracle und [Etherscan](https://etherscan.io/gastracker) als Backup.

Wenn Sie es vorziehen, können Sie eine benutzerdefinierte Max Fee (in gwei) festlegen, die Sie zu zahlen bereit sind, mit dem `-f`-Flag.
Sie können auch eine benutzerdefinierte Priority Fee mit dem `-i`-Flag festlegen.

Dazu fügen Sie diese nach `rocketpool` und vor den anderen Befehlsinformationen hinzu.

Zum Beispiel würde der Aufruf von `node set-timezone` mit diesem Flag die folgende Ausgabe liefern:

```
$ rocketpool -f 10 node set-timezone

Would you like to detect your timezone automatically? [y/n]
n

Please enter a timezone to register with in the format 'Country/City':
Australia/Brisbane

You have chosen to register with the timezone 'Australia/Brisbane', is this correct? [y/n]
y

Using the requested max fee of 10.00 gwei (including a max priority fee of 2.00 gwei).
Total cost: 0.0005 to 0.0007 ETH
Are you sure you want to set your timezone? [y/n]
```

Dies zeigt, dass unabhängig davon, welche Max Fee das Netzwerk empfiehlt, Ihre benutzerdefinierte Max Fee von 10 gwei (und Priority Fee, falls Sie sie angeben) beim Senden dieser Transaktion verwendet wird.

::: warning HINWEIS
Wenn Sie eine manuelle Max Fee festlegen, empfehlen wir Ihnen dringend, ein Drittanbieter-Gaspreis-Oracle wie [EtherChain](https://etherchain.org/tools/gasnow) zu verwenden, um festzustellen, ob diese Gebühr für die aktuellen Netzwerkbedingungen hoch genug ist, bevor Sie die Transaktion senden.
:::

### Abbrechen / Überschreiben einer festsitzenden Transaktion

Manchmal können Sie auf ein Szenario stoßen, bei dem Sie eine Transaktion an das Netzwerk gesendet haben, aber Sie haben einen Gaspreis verwendet, der für die Netzwerkbedingungen viel zu niedrig ist, und es wird unannehmbar lange dauern, bis sie ausgeführt wird.
Da alle Ihre nachfolgenden Transaktionen warten, bis diese durchgeht, blockiert diese Transaktion im Wesentlichen alle Operationen auf Ihrem Rocket Pool-Knoten.
Um mit dieser Situation umzugehen, haben wir ein globales Flag hinzugefügt, mit dem Sie eine solche Transaktion "abbrechen" können, indem Sie sie durch etwas anderes ersetzen.

Jede Ethereum-Wallet, einschließlich Ihrer Knoten-Wallet, sendet Transaktionen sequenziell.
Jede Transaktion, die Sie senden, hat eine Nummer namens `nonce`, die identifiziert, wo sie in dieser Sequenz lebt.
Die allererste Transaktion, die Sie senden, hat eine `nonce` von 0, die nächste, die Sie senden, hat eine `nonce` von 1, und so weiter.

Diese Überschreibungstechnik beinhaltet das Senden einer _neuen_ Transaktion, die dieselbe `nonce` wie Ihre bestehende _festsitzende_ Transaktion verwendet, aber idealerweise einen höheren Gaspreis als die festsitzende enthält.
Dies bedeutet, dass die neue zuerst gemint wird.
Sobald sie in einem Block gemint ist, wird die alte aus dem Netzwerk verworfen, als wäre sie nie gesendet worden.

Um dieses Flag zu verwenden, müssen Sie zuerst die `nonce` Ihrer festsitzenden Transaktion finden:

1. Gehen Sie zu einem ETH1-Block-Explorer wie [https://etherscan.io](https://etherscan.io).
1. Navigieren Sie zur Adresse Ihrer Wallet und schauen Sie sich die Liste der Transaktionen an.
1. Gehen Sie sie durch, beginnend mit der neuesten, bis Sie die am weitesten unten in der Liste finden, die den `Pending`-Status hat.
1. Markieren Sie die `nonce` dieser Transaktion. Das ist, was Sie brauchen.

Sobald Sie sie haben, rufen Sie einfach eine beliebige Transaktion mit der CLI unter Verwendung der `--nonce <value> -i 2.2`-Flags nach `rocketpool` und vor dem Rest des Befehls auf.

::: warning HINWEIS
Sie **müssen** das `-i` (Priority Fee)-Flag einschließen, um eine vorherige Transaktion zu überschreiben.
Diese Zahl muss mindestens 10% höher sein als die Priority Fee, die Ihre alte Transaktion verwendet hat.
Der Smartnode verwendet standardmäßig eine Priority Fee von 2 gwei, sodass ein Wert von `2.2` normalerweise für eine Überschreibung ausreichend ist.

Wenn Ihre alte Transaktion eine benutzerdefinierte Gebühr verwendet hat (z. B. 10 gwei), müssen Sie sie in der überschreibenden Transaktion mindestens 10% höher festlegen (in diesem Beispiel also 11 gwei).
:::

Als Beispiel, nehmen wir an, ich habe eine Transaktion mit einer `nonce` von 10 und einer Max Fee von 20 gwei gesendet, aber die aktuelle Netzwerkgebühr beträgt 100 gwei, sodass meine Transaktion festsitzt.
Um dies zu beheben, werde ich eine Transaktion senden, bei der ich einen kleinen Betrag ETH von mir selbst zurück an mich selbst mit einer höheren Max Fee (z. B. 150 gwei) und einer höheren Priority Fee sende.
Ich werde ein wenig Gas verbrennen, aber es wird die kaputte Transaktion freigeben:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

Der Smartnode-Stack wird automatisch überprüfen, ob die von Ihnen angegebene `nonce` gültig ist (sie bezieht sich auf eine ausstehende Transaktion), bevor er sie sendet und Ihr Gas versehentlich verschwendet.
Wenn nicht, wird eine Fehlermeldung zurückgegeben.
Andernfalls wird sie durchgehen und Ihnen die Transaktionsdetails zur Verfügung stellen, damit Sie sie überwachen können, um zu bestätigen, dass sie tatsächlich Ihre alte festsitzende Transaktion überschrieben hat.

Das war's für die gängigen CLI-Befehle.
Im nächsten Abschnitt werden wir durchgehen, wie man einen Minipool erstellt und mit der Validierung auf der Beacon Chain beginnt.
