# Distributeurs de frais et la Smoothing Pool

Maintenant que [la Fusion](https://ethereum.org/fr/upgrades/merge/) est passée, les opérateurs de nœuds reçoivent des **frais de priorité** (**pourboires**) des transactions qu'ils incluent dans les blocs qu'ils proposent à la chaîne Ethereum.
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

Rocket Pool est conçu pour distribuer équitablement ces récompenses entre vous et les stakers du pool rETH, de la même manière qu'il distribue équitablement vos récompenses de la Beacon Chain : votre part des frais de priorité que vos validateurs minipool gagnent ira à vous (plus la commission moyenne de tous vos minipools), et la part restante ira aux stakers du pool (moins votre commission moyenne).
La part exacte dépend du nombre de minipools liés à 8 ETH par rapport aux minipools liés à 16 ETH que vous possédez.

À cette fin, le Smartnode définira automatiquement le `destinataire des frais` de votre nœud sur l'un de ces contrats spéciaux :

- Le **distributeur de frais** personnel de votre nœud (par défaut)
- La **Smoothing Pool** (sur inscription volontaire)

En bref, le **distributeur de frais** est un contrat unique attaché à votre nœud qui collecte et répartit équitablement vos frais de priorité entre vous et les stakers rETH.
C'est comme votre coffre-fort personnel pour les frais de priorité.
N'importe qui (y compris vous) peut distribuer son solde à tout moment pour garantir que les récompenses soient toujours disponibles pour les stakers rETH.

La **Smoothing Pool** est un contrat spécial sur inscription volontaire qui permet à tous les opérateurs de nœuds participants d'agréger et de mettre en commun leurs frais de priorité ensemble, et de les distribuer équitablement entre les participants lors de chaque intervalle de récompenses Rocket Pool (actuellement tous les 28 jours) et les stakers du pool rETH.
Il s'agit d'une fonctionnalité très intéressante pour les opérateurs de nœuds qui ne veulent pas s'inquiéter du facteur chance lié à l'obtention de propositions de blocs avec des frais de priorité élevés, et qui préfèrent avoir un ensemble régulier et constant de revenus mensuels.

Nous allons couvrir ces deux options ci-dessous afin que vous compreniez la différence et si vous souhaitez ou non rejoindre la Smoothing Pool.

::: tip NOTE
Pour les minipools créés après le 28/10/2024, la Smoothing Pool est FORTEMENT recommandée, car elle est utilisée pour distribuer des commissions bonus. Si vous refusez la Smoothing Pool, ces minipools obtiendront une commission totale de 5%. Si vous acceptez la Smoothing Pool, ces minipools obtiendront entre 10% (aucun RPL staké) et 14% (le stake RPL est évalué à 10% de l'ETH emprunté ou plus) de commission.
:::

## Votre distributeur de frais

Votre distributeur de frais est un contrat unique sur la couche d'exécution qui est **spécifique à votre nœud**.
Il contiendra tous les frais de priorité que vous avez gagnés au fil du temps, et il contient la logique requise pour les répartir et les distribuer équitablement aux stakers du pool rETH et à votre adresse de retrait.
Ce processus de distribution **peut être appelé par n'importe qui** (y compris les stakers rETH), et peut être effectué **à tout moment**.
Il n'a pas de limite de temps avant l'expiration des récompenses.

L'adresse du distributeur de frais de votre nœud est **déterminée de manière déterministe en fonction de l'adresse de votre nœud**.
Cela signifie qu'elle est connue à l'avance, avant même que le distributeur de frais ne soit créé.

Les nouveaux nœuds Rocket Pool créeront (initialiseront) automatiquement le contrat de distributeur de frais de leur nœud lors de l'enregistrement.
Les nœuds qui ont été créés avant la mise à niveau Redstone devront effectuer ce processus manuellement.
Cela ne doit être exécuté qu'une seule fois.

Une ramification intéressante de cela est que l'adresse de votre distributeur peut commencer à accumuler un solde **avant** que vous n'ayez initialisé votre contrat de distributeur de frais.
Ce n'est pas grave, car votre distributeur aura accès à tout ce solde existant dès que vous l'initialiserez.

**Par défaut, votre nœud utilisera son distributeur de frais comme destinataire des frais pour vos validateurs.**

### Afficher son adresse et son solde

Vous pouvez afficher l'adresse et le solde de votre distributeur de frais dans :

```shell
rocketpool node status
```

La sortie ressemblera à ceci :

![](../node-staking/images/status-fee-distributor.png)

### Initialiser le distributeur de frais

Pour initialiser le distributeur de votre nœud, exécutez simplement cette nouvelle commande :

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTE
Si vous avez créé votre nœud avant la mise à jour Redstone, vous devez appeler cette fonction une fois avant de pouvoir créer de nouveaux minipools avec `rocketpool node deposit`.
:::

Lorsque votre distributeur a été initialisé, vous pouvez réclamer et distribuer l'intégralité de son solde en utilisant la commande suivante :

```shell
rocketpool node distribute-fees
```

Cela enverra votre part des récompenses à votre **adresse de retrait**.

::: warning NOTE SUR LES ÉVÉNEMENTS IMPOSABLES
Chaque fois que vous créez un nouveau minipool, Rocket Pool appellera automatiquement `distribute-fees`.
Cela permet de garantir que les frais que vous aviez accumulés sont distribués en utilisant la commission moyenne de votre nœud, qui pourrait changer lorsque vous créez le nouveau minipool.

De plus, notez que n'importe qui peut appeler `distribute-fees` sur votre distributeur de frais (pour vous empêcher de retenir les récompenses rETH en otage).
Vous pourriez avoir un événement imposable chaque fois que cette méthode est appelée.

Veuillez garder ces conditions à l'esprit lorsque vous décidez d'utiliser ou non la Smoothing Pool (abordée ci-dessous).
:::

### Le système de pénalités

Pour garantir que les opérateurs de nœuds ne "trichent" pas en modifiant manuellement le destinataire des frais utilisé dans leur client validateur, Rocket Pool emploie un système de pénalités.

L'Oracle DAO surveille en permanence chaque bloc produit par les opérateurs de nœuds Rocket Pool.

Si un nœud a _refusé_ la Smoothing Pool, les adresses suivantes sont considérées comme des destinataires de frais valides :

- L'adresse rETH
- L'adresse de la Smoothing Pool
- Le contrat de distributeur de frais du nœud

Si un nœud a _accepté_ la Smoothing Pool, l'adresse suivante est considérée comme un destinataire de frais valide :

- L'adresse de la Smoothing Pool

Un destinataire de frais autre qu'une des adresses valides ci-dessus est considéré comme **invalide**.

Un minipool qui a proposé un bloc avec un destinataire de frais **invalide** recevra **un avertissement**.
Au troisième avertissement, le minipool commencera à recevoir des **infractions** - chaque infraction déduira **10% de son solde total de la Beacon Chain, y compris les gains ETH** et les enverra aux stakers du pool rETH lors du retrait des fonds du minipool.

Les infractions sont au niveau du **minipool**, pas au niveau du **nœud**.

Le logiciel Smartnode est conçu pour garantir que les utilisateurs honnêtes ne seront jamais pénalisés, même s'il doit mettre le Validator Client hors ligne pour ce faire.
Si cela se produit, vous arrêterez d'attester et verrez des messages d'erreur dans vos fichiers de logs expliquant pourquoi le Smartnode ne peut pas définir correctement votre destinataire de frais.

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

- Lors d'un point de contrôle des récompenses Rocket Pool lorsque le solde de la Smoothing Pool est distribué, le solde ETH total du contrat est divisé en deux.
  - Les stakers rETH reçoivent 1/2 (pour les obligations de 16 ETH) ou 3/4 (pour les obligations de 8 ETH alias LEB8), moins la **commission moyenne** de tous les opérateurs de nœuds ayant adhéré
  - Le reste va aux opérateurs de nœuds qui ont adhéré.

- L'adhésion à la Smoothing Pool se fait au **niveau du nœud**. Si vous adhérez, tous vos minipools adhèrent.

- N'importe qui peut adhérer à tout moment. Ils doivent attendre un intervalle de récompenses complet (3 jours sur Hoodi, 28 jours sur le réseau principal) avant de se retirer pour empêcher de jouer avec le système (par exemple, quitter la SP juste après avoir été sélectionné pour proposer un bloc).
  - Une fois retirés, ils doivent attendre un autre intervalle complet pour adhérer à nouveau.

- La Smoothing Pool calcule la "part" de chaque minipool (portion de l'ETH du pool pour l'intervalle) détenue par chaque nœud ayant adhéré.
  - La part est une fonction de la performance de votre minipool pendant l'intervalle (calculée en examinant combien d'attestations vous avez envoyées sur la Beacon Chain et combien vous en avez manquées), et du taux de commission de votre minipool.

- La part totale de votre nœud est la somme de vos parts de minipool.

- La part totale de votre nœud est mise à l'échelle en fonction du temps pendant lequel vous avez adhéré.
  - Si vous avez adhéré pour l'intervalle complet, vous recevez votre part complète.
  - Si vous avez adhéré pendant 30% d'un intervalle, vous recevez 30% de votre part complète.

Si vous êtes intéressé par les détails techniques complets du calcul des récompenses de la Smoothing Pool, veuillez consulter [la spécification complète ici](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Rejoindre et quitter la Smoothing Pool

Pour adhérer à la Smoothing Pool, exécutez la commande suivante :

```shell
rocketpool node join-smoothing-pool
```

Cela vous enregistrera comme ayant adhéré dans les contrats Rocket Pool et changera automatiquement le `destinataire des frais` de votre client validateur de votre contrat de distributeur de nœud au contrat de la Smoothing Pool.

Pour quitter le pool, exécutez cette commande :

```shell
rocketpool node leave-smoothing-pool
```

Cela vous enregistrera comme ayant refusé dans les contrats Rocket Pool, et une fois qu'un court délai sera passé, changera automatiquement le `destinataire des frais` de votre client validateur du contrat de la Smoothing Pool vers votre contrat de distributeur de frais de nœud.

### Réclamer les récompenses de la Smoothing Pool

Les récompenses de la Smoothing Pool sont regroupées avec le RPL à la fin de chaque intervalle de récompenses en utilisant le système de récompenses Redstone.
Les réclamer est aussi simple que d'exécuter :

```shell
rocketpool node claim-rewards
```

Si vous avez adhéré à la Smoothing Pool, vous remarquerez que la quantité d'ETH que vous recevez pour chaque intervalle est supérieure à zéro :

```
Bienvenue dans le nouveau système de récompenses !
Vous n'avez plus besoin de réclamer les récompenses à chaque intervalle - vous pouvez simplement les laisser s'accumuler et les réclamer quand vous voulez.
Ici, vous pouvez voir quels intervalles vous n'avez pas encore réclamés et combien de récompenses vous avez gagnées pendant chacun.

Récompenses pour l'intervalle 0 (2022-08-04 01:35:39 -0400 EDT à 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Récompenses pour l'intervalle 1 (2022-09-01 01:35:39 -0400 EDT à 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total des récompenses en attente:
	91.489018 RPL
	0.096200 ETH

Quels intervalles souhaitez-vous réclamer ? Utilisez une liste séparée par des virgules (telle que '1,2,3') ou laissez vide pour réclamer tous les intervalles à la fois.
```

Notez que les récompenses de la Smoothing Pool dans l'intervalle 1 ici indiquent que le nœud a adhéré pendant cet intervalle et a reçu des récompenses en conséquence.

Nous en dirons plus sur la réclamation des récompenses RPL et de la Smoothing Pool plus tard dans le guide, dans la section [Réclamer les récompenses](./rewards).

## Prochaines étapes

Une fois que vous avez décidé si vous souhaitez ou non rejoindre la Smoothing Pool, consultez la section suivante sur le MEV et les récompenses MEV.
