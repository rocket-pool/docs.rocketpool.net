# Tester votre nœud Oracle DAO

Une fois votre nœud configuré et que vous avez rejoint l'Oracle DAO, vous devez le tester pour vous assurer qu'il est capable d'effectuer ses tâches correctement.
La meilleure façon de le faire est de lui faire construire l'arbre de Merkle des récompenses Redstone en utilisant l'utilitaire `treegen` de Rocket Pool.

### treegen

`treegen` est un outil qui peut reproduire l'intégralité de l'arbre de Merkle des récompenses et les artefacts associés pour un intervalle de récompenses précédent via vos clients d'Execution et de Consensus en mode archive.
Il peut également effectuer un "essai à blanc" de l'intervalle actuel en prétendant qu'il s'est terminé à la dernière époque finalisée (au moment de l'exécution) et en produisant un arbre partiel du début de l'intervalle jusqu'à ce point.

::: tip ASTUCE
Pour plus d'informations sur l'arbre de récompenses lui-même et les fichiers associés, veuillez consulter [**la spécification formelle**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` peut être utilisé comme un binaire autonome (actuellement construit uniquement pour les systèmes Linux, x64 et arm64) ou comme un conteneur Docker.

Si vous souhaitez télécharger le binaire autonome, vous pouvez le trouver dans les versions ici : [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Les instructions d'utilisation sont incluses dans le README là-bas, mais nous couvrirons également quelques exemples ci-dessous.

Le tag du conteneur Docker pour celui-ci est `rocketpool/treegen:latest`.

## Construire un arbre d'essai à blanc

Pour un premier test, exécutez `treegen` pour générer un arbre d'essai à blanc qui calcule l'arbre depuis le début de l'intervalle de récompenses jusqu'au dernier slot (finalisé).
Nous utiliserons [le script](https://github.com/rocket-pool/treegen/blob/main/treegen.sh) inclus dans le dépôt qui exploite le conteneur Docker pour l'exécuter sur la machine du nœud elle-même par simplicité :

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning NOTE
Notez que cette configuration particulière nécessite que vous exposiez les API du client d'Execution et du nœud Beacon via la configuration Docker - assurez-vous d'avoir activé les deux options dans le TUI `rocketpool service config`.
:::

Cela testera les capacités de vos clients à répondre aux requêtes en temps opportun (par exemple, si vous utilisez un service tiers, cela sera utile pour évaluer si sa limite de débit de requêtes est insuffisante), mais **ne testera pas leurs capacités en mode Archive**.
Il produira une sortie comme celle-ci :

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

Si cela s'exécute sans erreur, il générera les artefacts de l'arbre de récompenses et les enregistrera sous forme de fichiers JSON dans votre répertoire de travail.
Vous êtes libre de les explorer et de vous assurer que leur contenu est cohérent, mais comme ce sont des fichiers d'essai à blanc, ils ne sont pas stockés de manière canonique quelque part pour comparaison.

## Construire un arbre canonique à partir d'un intervalle passé

Ce prochain test consiste à répliquer l'un des arbres complets d'un intervalle passé.
Cela nécessitera un accès en mode archive à la fois sur la couche d'Execution et sur la couche de Consensus, donc cela servira de bon test des deux capacités.

Au moment de la rédaction, **l'intervalle 2** est un choix idéal car il est loin dans le passé et implique le Smoothing Pool (qui représente la charge de calcul la plus importante lors du calcul des récompenses pour la période).

Exécutez `treegen` en utilisant la commande suivante :

```shell
./treegen.sh -e http://<votre url EC archive> -b http://localhost:5052 -i 2
```

Notez que **l'URL du client d'Execution** est différente ici : elle _doit être_ un EC en mode archive car le bloc instantané pour l'intervalle 2 était loin dans le passé.

::: warning NOTE
Selon la configuration de votre client, la construction de cet arbre peut prendre _des heures_.
Le Smartnode vous donnera des indicateurs de statut sur sa progression tout au long du processus, comme vous pouvez le voir dans l'exemple ci-dessous.
:::

La sortie ressemblera à ceci (tronquée pour la brièveté) :

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

L'élément clé à rechercher ici est ce message à la fin :

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Si vous recevez ceci, alors votre watchtower peut construire l'arbre correctement.

::: danger NOTE
Bien que cela prouve que vous pouvez construire l'arbre, vous _devez_ vous assurer que votre jeton API Web3.Storage a été entré dans la configuration du Smartnode afin qu'il puisse télécharger l'arbre résultant vers IPFS.
:::

### Prochaines étapes

Ensuite, nous verrons comment surveiller les performances de votre nœud.
