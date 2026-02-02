# Minipools avec caution de 8 ETH

Lors du lancement initial de Rocket Pool, il supportait deux types de minipools :

1. Une **caution de 16 ETH**, où l'opérateur de nœud fournissait 16 ETH et les 16 ETH restants provenaient du pool de staking pour créer un validateur complet (32 ETH).
2. Une **caution temporaire de 32 ETH**, où l'opérateur de nœud fournissait les 32 ETH complets afin de pouvoir sauter le processus d'initialisation et commencer à valider sur la Beacon Chain immédiatement, puis recevoir un remboursement de 16 ETH une fois que le pool de dépôt avait suffisamment d'ETH pour le couvrir. À ce moment-là, il se transformait en minipool normal avec caution de 16 ETH.

Ce dernier a été supprimé par un vote communautaire plusieurs mois après le lancement du protocole, car il n'était plus nécessaire et entraînait de longs délais de remboursement.

Le premier représentait le montant de caution le plus bas du protocole car il garantissait que si un opérateur de nœud utilisait Rocket Pool pour attaquer le protocole Ethereum et voyait sa _caution entière_ slashée, il perdrait autant que les stakers rETH et n'en sortirait pas gagnant.

Depuis le lancement de Rocket Pool, la communauté a effectué [des recherches significatives](https://dao.rocketpool.net/t/leb8-discussion-thread/899) sur la sécurité fournie par cette caution et a constaté qu'elle était très conservatrice.
À tous égards pratiques, un slashing de 16 ETH a été jugé irréaliste et une caution de 16 ETH offrait effectivement les mêmes avantages de sécurité qu'une caution de seulement 8 ETH (plus l'exigence supplémentaire de RPL).
Ainsi, soutenue par cette recherche, la mise à niveau Atlas introduit un nouveau type de minipool dans la liste : la **caution de 8 ETH**, familièrement appelée "LEB8" (Lower ETH Bond - 8 ETH) par la communauté Rocket Pool.

Pour créer un minipool de 8 ETH, l'opérateur de nœud n'a besoin de fournir que **8 de ses propres ETH** (plus suffisamment de RPL pour couvrir l'exigence de collatéral - plus de détails dans [Collatéral RPL](#collatéral-rpl)).
Il puisera ensuite **24 ETH** du pool de dépôt afin de compléter le validateur et de commencer à travailler sur la Beacon Chain.

Cela **ouvre la porte à de nouveaux opérateurs de nœuds potentiels** qui souhaitent gérer un nœud mais n'ont pas tout à fait 16 ETH.
De plus, cela permet aux opérateurs de nœuds plus importants de **mettre davantage d'ETH des pool stakers au travail** sur la Beacon Chain pour gagner des récompenses.
Comme cela fonctionne sans compromettre significativement la sécurité, tout le monde y gagne !

Dans ce guide, nous couvrirons trois sujets :

- Comment fonctionnent réellement les minipools avec caution de 8 ETH, et les chiffres de récompense associés
- Comment créer un nouveau minipool de 8 ETH
- Comment migrer un minipool _existant_ de 16 ETH vers un minipool de 8 ETH sans sortir

Lisez la suite pour en savoir plus sur chaque sujet.

## Comment fonctionnent les minipools avec caution de 8 ETH

Mécaniquement, les minipools avec caution de 8 ETH se comportent **de manière identique** à tous les autres minipools du protocole.
Ils "possèdent" toujours un validateur sur la Beacon Chain (ils représentent les identifiants de retrait de ce validateur), ils sont toujours accompagnés d'une commission (bien que la commission avec Atlas **sera fixée à 14%** pour tous les nouveaux minipools), et ils offrent toutes les mêmes fonctionnalités qu'un minipool avec caution de 16 ETH.
La différence réside entièrement dans les chiffres.

### Récompenses

Du point de vue de la rentabilité (en considérant _purement_ les récompenses ETH et en ignorant RPL), les minipools avec caution de 8 ETH avec une commission de 14% offrent _plus de récompenses_ à l'opérateur de nœud que même _les minipools avec caution de 16 ETH à 20% de commission_ (qui, depuis Redstone, est la configuration de récompense la plus élevée possible).
En même temps, ils offrent également plus de récompenses aux _détenteurs de rETH_ en raison du fait que les opérateurs de nœuds mettent plus efficacement le capital des détenteurs de rETH au travail.

Parcourons un exemple simple pour illustrer.
Supposons que nous soyons un opérateur de nœud avec 16 ETH disponibles pour staker (plus la caution RPL requise).
Supposons que nous ayons gagné 1 ETH de récompenses sur la Beacon Chain par validateur.
Voici comment les calculs fonctionnent pour un seul minipool de 16 ETH avec une commission de 20%, par rapport à deux minipools de 8 ETH à 14% de commission :

```
1x Minipool 16 ETH @ 20% :
Récompenses : 1 ETH
Part du nœud = (16/32) + (16/32 * 0.2)
              = 0.5 + (0.5 * 0.2)
              = 0.5 + 0.1
              = 0.6 ETH

Part rETH = 1 - 0.6
          = 0.4 ETH


2x Minipools 8 ETH @ 14% :
Récompenses : 2 ETH
Part du nœud = ((8/32) + (24/32 * 0.14)) * 2
              = (0.25 + (0.75 * 0.14)) * 2
              = (0.25 + 0.105) * 2
              = 0.71 ETH

Part rETH = 2 - 0.71
          = 1.29 ETH
```

En d'autres termes, un opérateur de nœud gagnera **18% d'ETH en plus** via deux minipools de 8 ETH qu'avec un seul minipool de 16 ETH à 20% de commission.

### Collatéral RPL

Pour créer un minipool de 8 ETH, les opérateurs de nœuds doivent toujours staker suffisamment de RPL pour couvrir les exigences minimales de collatéral pour leur nœud (en tenant compte de tous ses minipools de toutes tailles de caution).

Ces règles ont été clarifiées avec Atlas :

- Le **RPL minimum** par minipool est **10% du montant _emprunté_**
- Le **RPL maximum** par minipool est **150% du montant _cautionné_**

Pour un minipool de 16 ETH, cela reste inchangé ; le minimum est 1.6 ETH de RPL, et le maximum est 24 ETH de RPL.

Pour un minipool de 8 ETH, cela devient un **minimum de 2.4 ETH de RPL** (10% du montant emprunté, qui est de 24 ETH) et un **maximum de 12 ETH de RPL** (150% du montant cautionné).

Ces chiffres ont été sélectionnés par la communauté Rocket Pool [dans le cadre d'un vote de gouvernance](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671).

## Création d'un nouveau minipool de 8 ETH

Le processus pour créer un nouveau minipool avec une caution de 8 ETH est identique au processus de création d'un minipool de 16 ETH.

Exécutez simplement la commande suivante :

```shell
rocketpool node deposit
```

Lorsque vous êtes invité à choisir votre montant de caution, sélectionnez `8 ETH` :

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip NOTE
Cet exemple montre également l'utilisation du [**nouveau système de crédit de dépôt**](../../node-staking/credit).
Comme l'opérateur de nœud a 8 ETH en crédit, la création de ce minipool de 8 ETH est gratuite !
:::

C'est tout ce qu'il y a à faire !
Le reste du processus est identique aux [instructions habituelles de création de minipool](../../node-staking/create-validator.mdx).
