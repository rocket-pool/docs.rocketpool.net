# Distributeurs de frais et la Smoothing Pool

Les opérateurs de nœuds reçoivent des **frais de priorité** (**pourboires**) des transactions qu'ils incluent dans les blocs qu'ils proposent à la chaîne Ethereum.
Ces frais proviennent et restent sur la couche d'exécution.

Contrairement à la plupart des récompenses de validation qui sont générées sur la couche de consensus et retirées automatiquement périodiquement, ces frais sont _immédiatement liquides_.
En général, les frais de priorité vous fournissent presque autant d'ETH que les récompenses de la Beacon Chain, ils constituent donc un avantage très appréciable de la Fusion.

::: tip NOTE
Pour rappel, voici une répartition des différents types de récompenses et la couche sur laquelle elles sont fournies :

- Couche de consensus : attestations, propositions de blocs, comités de synchronisation, rapports de slashing
- Couche d'exécution : frais de priorité et MEV (abordés dans la section suivante) issus des propositions de blocs

:::

## Destinataires des frais

Lorsque vous proposez un bloc sur la chaîne Ethereum, le protocole doit savoir où envoyer les pourboires de chaque transaction incluse dans votre bloc.
Il ne peut pas les envoyer à l'adresse de votre validateur, car celle-ci se trouve sur la couche de consensus - pas sur la couche d'exécution.
Il ne peut pas les envoyer à l'adresse de votre minipool, car cela doit fonctionner pour les stakers solo également et les stakers solo n'ont pas d'adresse sur la couche d'exécution attachée à leurs validateurs comme le fait Rocket Pool.

Au lieu de cela, le fonctionnement est assez simple : lorsque Rocket Pool démarre votre Validator Client, il passe un argument appelé **destinataire des frais**.
Le destinataire des frais est simplement une adresse sur la couche d'exécution où vous souhaitez que les pourboires soient envoyés.

Le `fee recipient` de votre nœud peut être l'un des contrats spéciaux suivants :

- Le **distributeur de frais** personnel de votre nœud
- Le contrat megapool de votre nœud
- La **Smoothing Pool** (sur inscription volontaire)

Le Smart Node définira automatiquement le destinataire des frais correct en fonction de votre configuration :

| Statut Smoothing Pool | A des validateurs Megapool | A des Minipools | Destinataire des frais                                                                                                                                                                                                        |
| --------------------- | -------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inscrit               | Non                        | Oui             | Adresse Smoothing Pool                                                                                                                                                                                                        |
| Inscrit               | Oui                        | Non             | Adresse Smoothing Pool                                                                                                                                                                                                        |
| Inscrit               | Oui                        | Oui             | Adresse Smoothing Pool (tous les validateurs)                                                                                                                                                                                 |
| Non inscrit           | Non                        | Oui             | Adresse du contrat distributeur de frais                                                                                                                                                                                      |
| Non inscrit           | Oui                        | Non             | Adresse du contrat megapool                                                                                                                                                                                                   |
| Non inscrit           | Oui                        | Oui             | Validateurs megapool → adresse megapool<br>Validateurs minipool → adresse distributeur de frais<br>(Défini par validateur via [keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient)) |

Rocket Pool est conçu pour distribuer équitablement ces récompenses entre vous et les stakers du pool rETH, de la même manière qu'il distribue équitablement vos récompenses de la Beacon Chain : votre part des frais de priorité que vos validateurs minipool gagnent ira à vous (plus la commission moyenne de tous vos minipools), et la part restante ira aux stakers du pool (moins votre commission moyenne).
La part exacte dépend du nombre de minipools liés à 8 ETH, de minipools liés à 16 ETH, et de validateurs megapool liés à 4 ETH que vous possédez.

En bref, le **distributeur de frais** est un contrat unique attaché à votre nœud qui collecte et répartit équitablement vos frais de priorité entre vous et les stakers rETH.
C'est comme votre coffre-fort personnel pour les frais de priorité.
N'importe qui (y compris vous) peut distribuer son solde à tout moment pour garantir que les récompenses soient toujours disponibles pour les stakers rETH.

La **Smoothing Pool** est un contrat spécial sur inscription volontaire qui permet à tous les opérateurs de nœuds participants d'agréger et de mettre en commun leurs frais de priorité ensemble, et de les distribuer équitablement entre les participants lors de chaque intervalle de récompenses Rocket Pool (actuellement tous les 28 jours) et les stakers du pool rETH.
Il s'agit d'une fonctionnalité très intéressante pour les opérateurs de nœuds qui ne veulent pas s'inquiéter du facteur chance lié à l'obtention de propositions de blocs avec des frais de priorité élevés, et qui préfèrent avoir un ensemble régulier et constant de revenus mensuels.

Nous allons couvrir ces deux options ci-dessous afin que vous compreniez la différence et si vous souhaitez ou non rejoindre la Smoothing Pool.

::: tip NOTE
Les minipools créés après le 28/10/2024 recevaient auparavant une commission bonus (jusqu'à 14 % au total) via la Smoothing Pool. Comme défini dans [RPIP-62](https://rpips.rocketpool.net/RPIPs/RPIP-62), le bonus a pris fin quatre intervalles de récompenses après Saturn 1 (le dernier a été versé en juin 2026). Ces minipools reçoivent désormais leur commission de contrat de 5 %, que vous soyez ou non dans la Smoothing Pool.
:::

## Votre distributeur de frais

Votre distributeur de frais est un contrat unique sur la couche d'exécution qui est **spécifique à votre nœud**.
Il contiendra tous les frais de priorité que vous avez gagnés au fil du temps, et il contient la logique requise pour les répartir et les distribuer équitablement aux stakers du pool rETH et à votre adresse de retrait.
Ce processus de distribution **peut être appelé par n'importe qui** (y compris les stakers rETH), et peut être effectué **à tout moment**.
Si quelqu'un d'autre que vous le distribue, votre part est conservée sous forme de [récompenses non réclamées](#claiming-unclaimed-rewards) jusqu'à ce que vous la réclamiez.
Il n'a pas de limite de temps avant l'expiration des récompenses.

L'adresse du distributeur de frais de votre nœud est **déterminée de manière déterministe en fonction de l'adresse de votre nœud**.
Cela signifie qu'elle est connue à l'avance, avant même que le distributeur de frais ne soit créé.

Les nouveaux nœuds Rocket Pool créeront (initialiseront) automatiquement le contrat de distributeur de frais de leur nœud lors de l'enregistrement.
Cela ne doit être exécuté qu'une seule fois.

Une ramification intéressante de cela est que l'adresse de votre distributeur peut commencer à accumuler un solde **avant** que vous n'ayez initialisé votre contrat de distributeur de frais.
Ce n'est pas grave, car votre distributeur aura accès à tout ce solde existant dès que vous l'initialiserez.

### Afficher son adresse et son solde

Vous pouvez afficher l'adresse et le solde de votre distributeur de frais dans :

```shell
rocketpool node status
```

La sortie ressemblera à ceci :

![](../node-staking/images/status-fee-distributor.png)

### Réclamer les frais de votre distributeur de frais

Vous pouvez réclamer et distribuer l'intégralité du solde de votre distributeur de frais en utilisant la commande suivante :

```shell
rocketpool node distribute-fees
```

Cela enverra votre part des récompenses à votre **adresse de retrait**.

::: warning NOTE SUR LES ÉVÉNEMENTS IMPOSABLES
N'importe qui peut distribuer votre fee distributor (pour vous empêcher de garder les récompenses rETH en otage).
Rocket Pool le distribue aussi automatiquement chaque fois qu'un de vos minipools est fermé, afin que les frais accumulés soient répartis avec la commission moyenne de votre nœud avant qu'elle ne change.
Vous pouvez avoir un événement imposable chaque fois que votre fee distributor est distribué.

Veuillez garder ces conditions à l'esprit lorsque vous décidez d'utiliser ou non la Smoothing Pool (abordée ci-dessous).
:::

<span id="claiming-unclaimed-rewards"></span>

### Réclamer les récompenses non réclamées

Votre part va directement à votre adresse de retrait uniquement lorsque le fee distributor est distribué par l'adresse de votre nœud ou votre adresse de retrait, par exemple avec `rocketpool node distribute-fees`.
Depuis la mise à niveau Saturn 1, lorsque quelqu'un d'autre le distribue (y compris Rocket Pool lui-même lorsque vous fermez un minipool), votre part est mise de côté sous forme de **récompenses non réclamées**.
Les récompenses non réclamées n'expirent pas, et seule l'adresse de votre nœud ou votre adresse de retrait peut les réclamer.

Pour vérifier et réclamer vos récompenses non réclamées, exécutez :

```shell
rocketpool node claim-unclaimed-rewards
```

S'il y en a, la commande affiche le montant avant de vous demander de confirmer la réclamation :

```
The node's withdrawal address is 0x4ACb4E5E5A9a5EfB1f4D3eE2f6E5A13bB0E8f0a7
You have 0.012345 ETH in unclaimed rewards.
Your node 0xE8325F5f4486c2FF2AC7B522Fbc9eB249d46C936 has rewards that were distributed to its unclaimed rewards balance instead of its withdrawal address. This happens whenever your fee distributor is distributed by anyone other than your node or withdrawal address.
Claiming will send them to your current withdrawal address.
```

Les récompenses sont envoyées à votre adresse de retrait **actuelle**.

### Le système de pénalités

Pour garantir que les opérateurs de nœuds ne "trichent" pas en modifiant manuellement le destinataire des frais utilisé dans leur client validateur, Rocket Pool emploie un système de pénalités.

L'Oracle DAO est en mesure de pénaliser les opérateurs de nœuds qui ne respectent pas les règles du protocole.

Si un nœud a _refusé_ la Smoothing Pool, les adresses suivantes sont considérées comme des destinataires de frais valides :

- L'adresse rETH
- L'adresse de la Smoothing Pool
- Le contrat de distributeur de frais du nœud
- Le contrat megapool du nœud

Si un nœud a _accepté_ la Smoothing Pool, l'adresse suivante est considérée comme un destinataire de frais valide :

- L'adresse de la Smoothing Pool

Un destinataire de frais autre qu'une des adresses valides ci-dessus est considéré comme **invalide**.

Le logiciel Smart Node définit automatiquement le bon destinataire des frais en fonction de votre configuration (que vous soyez inscrit à la Smoothing Pool ou non, et que vous ayez des validateurs megapool, des minipools ou les deux). Pour les nœuds ayant à la fois des validateurs megapool et des minipools tout en étant non inscrits, le destinataire des frais est défini par validateur via l'API keymanager. La liste complète des conditions est résumée [ici](/fr/node-staking/fee-distrib-sp#destinataires-des-frais).

Le logiciel Smart Node est conçu pour garantir que les utilisateurs honnêtes ne seront jamais pénalisés, même s'il doit mettre le Validator Client hors ligne pour ce faire.
Si cela se produit, vous arrêterez d'attester et verrez des messages d'erreur dans vos fichiers de logs expliquant pourquoi le Smart Node ne peut pas définir correctement votre destinataire de frais.

## La Smoothing Pool

La **Smoothing Pool** est une fonctionnalité unique sur inscription volontaire du réseau Rocket Pool qui est disponible pour nos opérateurs de nœuds.
Essentiellement, elle devient le destinataire des frais pour chaque opérateur de nœud qui y adhère et accumule collectivement les frais de priorité des blocs proposés par ces opérateurs de nœuds dans un grand pool. Lors d'un point de contrôle des récompenses Rocket Pool (les mêmes que ceux utilisés pour distribuer les récompenses RPL), le solde ETH total du pool est distribué équitablement aux stakers du pool et aux opérateurs de nœuds qui y ont adhéré.

En substance, la Smoothing Pool est un moyen d'éliminer efficacement l'aléatoire associé à la sélection pour les propositions de blocs.
Si vous avez déjà eu une période de malchance et êtes resté des mois sans proposition, ou si vos propositions de blocs n'ont eu que de faibles frais de priorité, vous pourriez trouver la Smoothing Pool très intéressante.

Pour faciliter la compréhension des mathématiques, le membre de la communauté Ken Smith a réalisé une [analyse massive](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) comparant la rentabilité de la Smoothing Pool et du distributeur de frais, qui est bien résumée par ce graphique :

![](../node-staking/images/sp-chart.png)

En bref, tant que la Smoothing Pool a plus de minipools que vous, il est plus probable que vous en sortiez gagnant en la rejoignant.

### Les règles

La Smoothing Pool utilise les règles suivantes :

- Lors d'un point de contrôle des récompenses Rocket Pool lorsque le solde de la Smoothing Pool est distribué entre les opérateurs de nœuds (en tenant compte de leur commission), les opérateurs de nœuds qui stakent du RPL, les stakers rETH et potentiellement le DAO Rocket Pool. Les pourcentages exacts sont déterminés par la [gouvernance du Protocol DAO (pDAO) de Rocket Pool](/fr/pdao/overview)

- L'adhésion à la Smoothing Pool se fait au **niveau du nœud**. Si vous adhérez, tous vos minipools et validateurs megapool adhèrent.

- N'importe qui peut adhérer à tout moment. Ils doivent attendre un intervalle de récompenses complet (3 jours sur Hoodi, 28 jours sur le réseau principal) avant de se retirer pour empêcher de jouer avec le système (par exemple, quitter la SP juste après avoir été sélectionné pour proposer un bloc).
  - Une fois retirés, ils doivent attendre un autre intervalle complet pour adhérer à nouveau.

- La Smoothing Pool calcule la "part" de chaque validateur (portion de l'ETH du pool pour l'intervalle) détenue par chaque nœud ayant adhéré.
  - La part est une fonction de la performance de votre validateur pendant l'intervalle (calculée en examinant combien d'attestations vous avez envoyées sur la Beacon Chain et combien vous en avez manquées), et de votre taux de commission.

- La part totale de votre nœud est la somme de vos parts de validateurs.

- La part totale de votre nœud est mise à l'échelle en fonction du temps pendant lequel vous avez adhéré.
  - Si vous avez adhéré pour l'intervalle complet, vous recevez votre part complète.
  - Si vous avez adhéré pendant 30% d'un intervalle, vous recevez 30% de votre part complète.

Si vous êtes intéressé par les détails techniques complets du calcul des récompenses de la Smoothing Pool, veuillez consulter [la spécification complète ici](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Rejoindre et quitter la Smoothing Pool

Pour adhérer à la Smoothing Pool, exécutez la commande suivante :

```shell
rocketpool node join-smoothing-pool
```

Cela vous enregistrera comme ayant adhéré dans les contrats Rocket Pool et changera automatiquement le `fee recipient` de votre client validateur de votre contrat de distributeur de nœud au contrat de la Smoothing Pool.

Pour quitter le pool, exécutez cette commande :

```shell
rocketpool node leave-smoothing-pool
```

Cela vous enregistrera comme ayant refusé dans les contrats Rocket Pool, et une fois qu'un court délai sera passé, changera automatiquement le `fee recipient` de votre client validateur du contrat de la Smoothing Pool vers votre contrat de distributeur de frais de nœud.

### Réclamer les récompenses de la Smoothing Pool

Les récompenses de la Smoothing Pool sont regroupées avec le RPL à la fin de chaque intervalle de récompenses en utilisant le système de récompenses Redstone.
Les réclamer est aussi simple que d'exécuter :

```shell
rocketpool node claim-rewards
```

Si vous avez adhéré à la Smoothing Pool, vous remarquerez que la quantité d'ETH que vous recevez pour chaque intervalle est supérieure à zéro :

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Notez que les récompenses de la Smoothing Pool dans l'intervalle 1 ici indiquent que le nœud a adhéré pendant cet intervalle et a reçu des récompenses en conséquence.

Nous en dirons plus sur la réclamation des récompenses RPL et de la Smoothing Pool plus tard dans le guide, dans la section [Réclamer les récompenses](./rewards).

## Prochaines étapes

Une fois que vous avez décidé si vous souhaitez ou non rejoindre la Smoothing Pool, consultez la section suivante sur le MEV et les récompenses MEV.
