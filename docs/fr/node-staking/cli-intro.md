# Introduction à l'interface en ligne de commande

En tant qu'opérateur de nœud, la CLI est votre outil principal pour interagir avec Rocket Pool.
Vous l'utiliserez pour créer de nouveaux minipools, vérifier l'état de tout, réclamer les récompenses RPL périodiques, sortir et retirer de vos minipools quand vous êtes prêt, et une multitude d'autres activités.

Une fois que vous avez terminé la synchronisation des chaînes d'exécution et Beacon, toutes les commandes seront disponibles pour vous.
Dans cette section, nous allons parcourir brièvement certaines des plus courantes et quelques autres astuces que la CLI peut faire.

## Découvrir les commandes

Pour lister toutes les commandes disponibles, tapez :

```shell
rocketpool help
```

La sortie ressemblera à ceci :

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

## Commandes de service

Le groupe de services implique la gestion des différents services que le Smart Node gère pour vous.

Voici ce que la sortie de `rocketpool service help` affichera :

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

Cette commande vous montre l'état d'exécution actuel de chacun des conteneurs Docker gérés par Rocket Pool.
Par exemple, la sortie de l'installation Docker par défaut ressemble à ceci :

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

Vous pouvez l'utiliser pour vérifier rapidement si l'un des conteneurs Docker rencontre des problèmes, ou pour vous assurer qu'une commande `start` ou `stop` a fonctionné correctement.

### `start` et `stop`

Ces deux commandes vous sont déjà familières.
Elles démarrent simplement tous les conteneurs Rocket Pool, ou les arrêtent.

::: tip
La commande `pause` fait la même chose que `stop`.
Elle est simplement restée comme commande héritée des versions antérieures de Rocket Pool.
:::

### `logs`

Cette commande est une autre que vous devriez avoir déjà vue.
Vous pouvez l'utiliser pour consulter les journaux de sortie de chaque conteneur Docker.
Cela peut être utile pour le dépannage ou pour obtenir un rapport d'état plus détaillé de leur part.

Si vous faites simplement `rocketpool service logs` sans autre argument, cela agrégera tous les journaux ensemble et vous les montrera en une fois.

Si vous voulez vous concentrer sur la sortie d'un conteneur, vous pouvez ajouter un argument à la fin pour spécifier le conteneur.
Les valeurs valides sont `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` et `node-exporter`.

### `stats`

Cette commande vous montre quelques statistiques de ressources de chacun des conteneurs, que vous pouvez utiliser pour profiler la consommation matérielle et réseau de chacun.

Vous pourriez la trouver utile pour surveiller les conteneurs si votre système commence à ralentir ou a des problèmes de RAM.

Voici un exemple de sortie :

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip NOTE
La statistique RAM ici montre **la mémoire totale allouée**, qui inclut la mémoire _virtuelle_.
Elle ne montre pas la consommation de mémoire _résidente_ brute.

De même, l'utilisation du CPU montre la quantité totale de consommation CPU moyennée sur tous les cœurs CPU que le conteneur utilise.
Ici, le CPU pour ETH2 montre presque 100 % car il utilise Nimbus, qui est mono-thread.

Vous pourriez trouver qu'un programme comme `htop` ou `btop` offre une meilleure vision de la consommation réelle des ressources.
:::

### `config`

Cette commande exécute à nouveau l'interview de configuration.
Vous pouvez l'utiliser si vous voulez changer votre sélection de client d'exécution ou de consensus, ou changer certains des paramètres que vous avez initialement spécifiés lors de leur sélection (comme le message graffiti de votre validateur, le nombre maximal de pairs auxquels se connecter, etc.).

Vous pouvez appeler cette commande à tout moment, mais les modifications ne prendront effet qu'après avoir appelé `rocketpool service stop` et `rocketpool service start`.

### `terminate`

Cette commande arrêtera les conteneurs Docker, puis les supprimera, supprimera le réseau virtuel Rocket Pool et supprimera les volumes de données de chaîne ETH1 et ETH2.
Elle supprime essentiellement tous les éléments Rocket Pool de votre configuration Docker.
Utilisez-la lorsque vous voulez nettoyer cette partie de l'installation de Rocket Pool.

::: warning
Cela supprimera irréversiblement vos données de chaîne, ce qui signifie que vous devrez synchroniser à nouveau ETH1 et ETH2.

Cela ne supprimera **pas** vos fichiers de portefeuille et de mot de passe, vos paramètres configurés ou vos clés de validateur.
Pour les supprimer, vous devrez supprimer le dossier `~/.rocketpool/data` en mode Docker ou Hybride, ou le répertoire correspondant en mode Natif.
:::

## Commandes de nœud

Le groupe `node` implique des opérations sur votre nœud Rocket Pool.
Nous les couvrirons plus en profondeur dans la section suivante où nous créons un minipool, mais il peut être utile de les voir tous d'un coup d'œil.

Voici ce que la sortie de `rocketpool node help` affichera :

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

Voici un résumé de certaines des commandes dont vous aurez tendance à avoir besoin lors de l'exploitation typique d'un nœud.

### `status`

Cette commande vous donnera une vue d'ensemble de votre nœud entier d'un coup d'œil.
Elle inclut combien d'ETH et de RPL vous avez staké, combien de minipools vous avez et leurs statuts, votre ratio de collatéral RPL, et plus encore.

Voici un exemple de ce que `rocketpool node status` affiche une fois que vous avez votre nœud enregistré et quelques minipools configurés :

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

Cette commande vous montrera l'état de synchronisation actuel de vos clients d'exécution et de consensus.
Vous l'utiliserez probablement beaucoup lorsque vous configurerez le nœud pour la première fois, puis vous n'en aurez plus jamais besoin (sauf si vous changez ou réinitialisez vos clients).

La sortie de `rocketpool node sync` ressemblera à ceci :

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Notez que **Prysm** ne fournit actuellement pas son pourcentage de complétion - vous devrez regarder dans les journaux `eth2` si vous l'utilisez.

### `stake-rpl`

Cette commande est celle que vous utiliserez lorsque vous voudrez ajouter plus de collatéral RPL à votre nœud.
Cela augmentera votre ratio de collatéral, ce qui augmentera vos récompenses RPL à chaque checkpoint (plus d'informations à ce sujet plus tard).

Contrairement aux autres commandes jusqu'à présent, celle-ci est en fait _interactive_ car elle déclenchera une transaction - ce n'est pas simplement informatif.

Elle vous demandera d'abord combien de RPL vous souhaitez staker, avec quelques options prédéfinies pour plus de commodité ou la possibilité de spécifier un montant personnalisé :

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Une fois que vous sélectionnez une option, vous verrez des informations sur le prix du gaz suggéré et le montant estimé à utiliser, ainsi qu'une boîte de dialogue de confirmation. Si c'est la première fois que vous stakez du RPL sur le nœud, vous devrez donner au contrat de staking l'autorisation d'interagir avec votre RPL :

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

Si vous confirmez, vous verrez le hash de la transaction et obtiendrez un lien vers [Etherscan](https://etherscan.io) pour pouvoir suivre sa progression :

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

La plupart des opérations ne nécessitent qu'une seule transaction, donc la CLI attendra qu'elle soit incluse dans un bloc puis se fermera. Cependant, stake-rpl est l'une des rares commandes qui nécessite deux transactions, donc cette boîte de dialogue apparaîtra deux fois.

### `claim-rewards`

Lorsque votre nœud détecte un nouveau checkpoint de récompenses, il téléchargera automatiquement le fichier d'arbre de récompenses avec les informations pour cet intervalle (si vous utilisez le mode de téléchargement par défaut - voir ci-dessous pour des informations sur la génération de vos propres arbres au lieu de les télécharger).
Vous pouvez ensuite consulter vos récompenses en utilisant la commande suivante :

```
rocketpool node claim-rewards
```

Au fur et à mesure que les intervalles passent et que vous accumulez des récompenses, la sortie ressemblera à ceci :

![](../node-staking/images/claim-rewards-gb.png)

Ici, vous pouvez voir rapidement combien de récompenses vous avez gagnées à chaque intervalle et décider lesquelles vous voulez réclamer.

Vous pouvez également spécifier un montant que vous voulez restaker lors de cette réclamation :

![](../node-staking/images/autostake.png)

Cela vous permettra de composer vos récompenses RPL en une seule transaction, en utilisant beaucoup moins de gaz que ce que vous deviez utiliser avec le système de réclamation hérité.

::: tip NOTE
Si vous préférez construire le checkpoint de récompenses manuellement au lieu de télécharger celui créé par l'Oracle DAO, vous pouvez changer ce paramètre de `Download` à `Generate` dans la TUI :

![](../node-staking/images/tui-generate-tree.png)

Comme le conseil l'implique, vous aurez besoin d'accéder à un nœud d'archive de client d'exécution pour le faire.
Si votre client d'exécution local n'est pas un nœud d'archive, vous pouvez en spécifier un séparé (comme Infura ou Alchemy) dans l'`Archive-Mode EC URL` plus bas dans le même menu.
Cette URL ne sera utilisée que lors de la génération d'arbres Merkle ; elle ne sera pas utilisée pour les tâches de validation.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Cela vous enregistrera comme participant dans les contrats Rocket Pool et changera automatiquement le `fee recipient` de votre client validateur du contrat distributeur de votre nœud au contrat Smoothing Pool.

Notez qu'une fois que vous participez, il y a un **délai de carence de 28 jours** (une durée complète d'intervalle de récompenses) jusqu'à ce que vous puissiez vous retirer.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Cela vous retirera du Smoothing Pool si vous y participez actuellement et avez attendu au moins 28 jours après y avoir participé.
Une fois **la prochaine époque après l'époque actuelle** finalisée, cela changera automatiquement le `fee recipient` de votre nœud du Smoothing Pool vers le contrat distributeur de votre nœud.
C'est pour s'assurer que vous n'êtes pas pénalisé pour avoir devancé le processus de sortie lorsque vous voyez que vous avez une proposition à venir.


### `distribute-fees`

Une fois que vous avez gagné des récompenses sur votre distributeur de frais, vous pouvez réclamer et distribuer l'intégralité de son solde en utilisant la commande suivante :

```shell
rocketpool node distribute-fees
```

Cela enverra votre part des récompenses à votre **adresse de retrait**.

### `send`

Cette commande vous permet d'envoyer de l'ETH, du RPL ou d'autres jetons liés à Rocket Pool du portefeuille du nœud vers une adresse différente.
Cela pourrait être utile si vous voulez déplacer vos fonds du portefeuille ailleurs.

La syntaxe pour utiliser la commande `send` est comme ceci :

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Les arguments sont les suivants :

- `<amount>` est le montant du jeton à envoyer.
- `<token>` est le jeton à envoyer - cela peut être `eth`, `rpl`, `fsrpl` (l'ancien jeton RPL hérité) ou `reth`.
- `<address or ENS name>` est l'adresse Ethereum (ou nom ENS) à laquelle envoyer les jetons.

Par exemple :

```shell
rocketpool node send 1 eth <my friend's address>
```

enverrait 1 ETH à mon ami.

## Commandes Megapool
Le groupe `megapool` est l'endroit où vous pouvez accéder à toutes les commandes utilisées pour gérer votre megapool et les validateurs du megapool.

Voici ce que `rocketpool megapool help` affichera :

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

Voici un résumé des commandes que vous utiliserez généralement lors du fonctionnement normal :

### `deposit`
Cette commande vous permet de créer de nouveaux validateurs sur votre megapool. Nous y reviendrons plus en détail par la suite. N'hésitez pas à passer directement à [Créer un validateur Megapool](/node-staking/megapools/create-megapool-validator.mdx) si vous souhaitez un aperçu.

### `status`
Cette commande vous donne des informations sur l'état de votre megapool et des validateurs gérés par votre megapool. Vous pourrez voir l'adresse de votre megapool, le nombre de billets de file d'attente express, l'adresse délégué de votre megapool, le solde ETH sur les couches d'exécution et de consensus, et de nombreuses autres informations utiles. Voici un exemple de la sortie de `rocketpool megapool status` :

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
La commande `rocketpool megapool validators` vous montrera l'état de chaque validateur géré par le megapool de votre nœud. Vous pourrez voir des informations telles que les clés publiques des validateurs, l'état sur la Beacon Chain, et la position dans la file d'attente des validateurs en prestaking :
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

Cette commande vous permet de sélectionner un validateur pour effectuer une sortie volontaire sur la Beacon Chain. Utilisez-la lorsque vous souhaitez fermer un validateur et retirer son solde ETH final. Notez que cela ne peut pas être annulé - une fois que vous déclenchez une sortie, le validateur s'arrêtera définitivement.


## Commandes Minipool

Le groupe `minipool` implique des commandes qui affectent vos minipools.
Comme pour le groupe `node`, nous les couvrirons plus en profondeur dans la section suivante, mais il peut être utile de les voir tous maintenant.

Voici ce que la sortie de `rocketpool minipool help` affichera :

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

Voici un résumé des commandes que vous utiliserez généralement.

### `status`

Cette commande fournit simplement un résumé de chacun de vos minipools.
Cela inclut son statut actuel, l'adresse eth1 du minipool, la commission dessus (appelée le `node fee`), la clé publique du validateur ETH2 correspondant et quelques autres choses :

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

Cette commande vous permet de récupérer 16 ETH d'un minipool si vous avez déposé 32 ETH pour en créer un, une fois que Rocket Pool a pu contribuer 16 ETH depuis le pool de staking rETH.

### `exit`

Cette commande soumet une sortie volontaire pour votre validateur sur la Beacon Chain.
Utilisez-la lorsque vous voulez fermer un validateur et retirer son solde ETH final.
Notez que **cela ne peut pas être annulé** - une fois que vous déclenchez une sortie, le validateur s'arrêtera définitivement.

## Indicateurs utiles

Il existe des indicateurs globaux utiles que vous pouvez ajouter à certaines des commandes ci-dessus, dont vous voudrez peut-être profiter.

### Définir des frais maximum ou prioritaires personnalisés (prix du gaz)

À partir du [hardfork ETH1 de Londres](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) en juillet 2021, les transactions Ethereum n'utilisent plus un seul prix de gaz pour leurs transactions.
Au lieu de cela, les transactions Ethereum modernes utilisent deux valeurs :

- Les **frais maximum**, qui décrivent le prix de gaz maximum absolu que vous êtes prêt à accepter pour une transaction
- Les **frais prioritaires maximum**, qui décrivent le montant maximum que vous êtes prêt à "donner en pourboire" au mineur pour inclure votre transaction dans un bloc

::: tip TIP
La façon dont ces deux valeurs fonctionnent peut être un peu compliquée, voici donc quelques exemples simples.

Disons que les frais réseau actuels, appelés les **frais de base**, sont à 50 gwei.
Vous soumettez une transaction avec des frais maximum de **80 gwei** et des frais prioritaires de **2 gwei**.

Parce que les frais de base du réseau sont inférieurs à vos frais maximum, cette transaction pourrait être récupérée dans le bloc actuel.
Cela vous coûterait **50 gwei** pour les frais de base et **2 gwei** pour les frais prioritaires ; même si vous avez fixé vos frais maximum à 80, **cela ne vous coûterait que 52 gwei au total**.

Comme autre exemple, disons que vous avez cette même transaction, mais maintenant les frais de base du réseau sont de **100 gwei**.
Puisque 100 gwei est supérieur à vos frais maximum de 80 gwei, votre transaction **ne sera pas** incluse dans ce bloc.
Au lieu de cela, elle restera simplement dans le pool de transactions jusqu'à ce que les frais de base soient suffisamment bas pour l'inclure.

Maintenant, disons que les frais de base actuels sont à nouveau de **50 gwei** et que votre transaction a des frais maximum de **80** gwei et des frais prioritaires de **4 gwei**.
Elle s'exécuterait avec un coût total de **54 gwei**.
Les 4 gwei de frais prioritaires garantiraient qu'elle soit incluse devant toutes les transactions avec des frais prioritaires inférieurs.

Si vous voulez **vraiment** que la transaction passe à tout prix, vous pouvez définir les frais prioritaires pour qu'ils soient les mêmes que les frais maximum.
Cela émule le comportement de gaz hérité, donc votre transaction utilisera tout le gaz que vous lui donnez - que les frais de base du réseau soient inférieurs à vos frais maximum ou non.
:::

Par défaut, Rocket Pool utilisera un oracle pour examiner le pool de transactions actuel et suggérer des frais maximum raisonnables pour toutes les transactions que vous déclenchez.
Il utilise [EtherChain](https://etherchain.org/tools/gasnow) pour son oracle de suggestion principal, et [Etherscan](https://etherscan.io/gastracker) comme sauvegarde.

Si vous préférez, vous pouvez définir des frais maximum personnalisés (en gwei) que vous seriez prêt à payer avec l'indicateur `-f`.
Vous pouvez également définir des frais prioritaires personnalisés avec l'indicateur `-i`.

Pour ce faire, ajoutez-les après `rocketpool` et avant les autres informations de commande.

Par exemple, appeler `node set-timezone` avec cet indicateur fournirait la sortie suivante :

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

Cela montre que quel que soit les frais maximum recommandés par le réseau, il utilisera vos frais maximum personnalisés de 10 gwei (et frais prioritaires si vous les spécifiez) à la place lors de la soumission de cette transaction.

::: warning NOTE
Si vous définissez des frais maximum manuels, nous vous encourageons vivement à utiliser un oracle de prix de gaz tiers tel que [EtherChain](https://etherchain.org/tools/gasnow) pour déterminer si ces frais sont suffisamment élevés pour les conditions réseau actuelles avant de soumettre la transaction.
:::

### Annuler / Écraser une transaction bloquée

Parfois, vous pourriez rencontrer un scénario où vous avez envoyé une transaction au réseau mais vous avez utilisé un prix de gaz qui est bien trop bas pour les conditions réseau, et cela prendra un temps prohibitif pour s'exécuter.
Puisque toutes vos transactions suivantes attendront que celle-ci passe, cette transaction bloque essentiellement toutes les opérations sur votre nœud Rocket Pool.
Pour gérer cette situation, nous avons ajouté un indicateur global qui vous permet d'"annuler" une telle transaction en la remplaçant par autre chose.

Chaque portefeuille Ethereum, y compris votre portefeuille de nœud, envoie des transactions de manière séquentielle.
Chaque transaction que vous envoyez a un numéro appelé `nonce` qui identifie où elle se trouve dans cette séquence.
La toute première transaction que vous envoyez aura un `nonce` de 0, la suivante que vous envoyez aura un `nonce` de 1, et ainsi de suite.

Cette technique d'écrasement implique d'envoyer une _nouvelle_ transaction qui utilise le même `nonce` que votre transaction _bloquée_ existante, mais qui inclura idéalement un prix de gaz plus élevé que celle bloquée.
Cela signifie que la nouvelle sera minée en premier.
Dès qu'elle est minée dans un bloc, l'ancienne sera rejetée du réseau comme si elle n'avait jamais été envoyée.

Pour utiliser cet indicateur, vous devez d'abord trouver le `nonce` de votre transaction bloquée :

1. Allez sur un explorateur de blocs ETH1 comme [https://etherscan.io](https://etherscan.io).
1. Naviguez vers l'adresse de votre portefeuille et regardez la liste des transactions.
1. Parcourez-les, en commençant par la plus récente, jusqu'à ce que vous trouviez la plus éloignée dans la liste qui a l'état `Pending`.
1. Notez le `nonce` de cette transaction. C'est ce dont vous aurez besoin.

Une fois que vous l'avez, appelez simplement n'importe quelle transaction avec la CLI en utilisant les indicateurs `--nonce <value> -i 2.2` après `rocketpool` et avant le reste de la commande.

::: warning NOTE
Vous **devez** inclure l'indicateur `-i` (frais prioritaires) pour écraser une transaction précédente.
Ce nombre doit être au moins 10 % plus élevé que les frais prioritaires utilisés par votre ancienne transaction.
Le Smartnode utilise des frais prioritaires de 2 gwei par défaut, donc une valeur de `2.2` est généralement suffisante pour un remplacement.

Si votre ancienne transaction a utilisé des frais personnalisés (disons, 10 gwei), vous devrez les définir au moins 10 % plus haut dans la transaction de remplacement (donc dans cet exemple, 11 gwei).
:::

Par exemple, disons que j'ai soumis une transaction avec un `nonce` de 10 et des frais maximum de 20 gwei, mais les frais réseau actuels sont de 100 gwei donc ma transaction est bloquée.
Pour le corriger, je vais soumettre une transaction où j'envoie une petite quantité d'ETH de moi-même vers moi-même avec des frais maximum plus élevés (disons, 150 gwei) et des frais prioritaires plus élevés.
Je brûlerai un peu de gaz en le faisant, mais cela débloquera la transaction cassée :

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

La pile Smartnode vérifiera automatiquement pour s'assurer que le `nonce` que vous avez fourni est valide (il fait référence à une transaction en attente) avant de l'envoyer et de gaspiller accidentellement votre gaz.
Sinon, elle renverra un message d'erreur.
Sinon, elle passera et vous fournira les détails de la transaction afin que vous puissiez la surveiller pour confirmer qu'elle a, en fait, écrasé votre ancienne transaction bloquée.

C'est tout pour les commandes CLI courantes.
Dans la section suivante, nous verrons comment créer un minipool et commencer à valider sur la Beacon Chain.
