# Les Responsabilités d'un Node Operator

## Comment Fonctionne le Staking Ethereum

Pour rappel, le staking en Proof of Stake se fait via des **validators**.
Un validator est essentiellement une seule adresse Beacon Chain sur laquelle 32 ETH ont été déposés sur la couche Execution.
Les validators sont responsables du maintien de la cohérence et de la sécurité de la Beacon Chain.
Ils le font en écoutant les transactions et les nouvelles propositions de blocs et en **attestant** que le bloc proposé contient des transactions légales et valides en effectuant des calculs et des vérifications en coulisses.
Occasionnellement, ils ont l'opportunité de proposer de nouveaux blocs eux-mêmes.

Les validators se voient attribuer des attestations et des propositions de blocs **selon un calendrier aléatoire**.
C'est très différent de l'ancien système Proof of Work, où tout le monde essayait constamment de faire la course et de proposer le prochain bloc avant tout le monde.
Cela signifie que contrairement au Proof of Work où les mineurs n'étaient pas garantis de gagner une récompense de bloc à moins qu'ils ne trouvent le prochain bloc, les validators Proof of Stake _sont_ garantis d'avoir un revenu lent et régulier tant qu'ils accomplissent leurs devoirs.
Si un validator est hors ligne et manque une attestation ou une proposition de bloc, il sera **légèrement pénalisé**.
Les pénalités sont assez faibles cependant ; en règle générale, si un validator est hors ligne pendant X heures, il récupérera tout l'ETH perdu après les mêmes X heures d'être de nouveau en ligne.

### Récompenses

Les validators gagnent des récompenses de la couche consensus grâce aux Attestations, Propositions de Blocs, Sync Committees (rares) et Slashing Rewards (extrêmement rares). Ils gagnent également des récompenses de la couche execution grâce aux Priority Fees et au MEV.

Depuis octobre 2024, l'APR global est d'environ 3,5%, avec 2,8% d'APR sur la couche consensus et 0,7% d'APR sur la couche execution. Un endroit pour trouver ces informations est l'[explorateur rated](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Pénalités

Les validators sont pénalisés de petites quantités d'ETH s'ils sont hors ligne et ne parviennent pas à accomplir leurs devoirs assignés.
C'est ce qu'on appelle le **leaking**.
Si un validator viole l'une des règles fondamentales de la Beacon chain et semble attaquer le réseau, il peut être **slashé**.
Le slashing est une sortie forcée de votre validator sans votre permission, accompagnée d'une amende relativement importante qui retire une partie du solde ETH de votre validator.

Concrètement, la seule condition qui peut causer un slashing est si vous exécutez les clés de votre validator sur deux nœuds en même temps (comme une configuration de basculement / redondance, où votre nœud de sauvegarde s'allume accidentellement pendant que votre nœud principal fonctionne encore).
Ne laissez pas cela se produire, et **vous ne serez pas slashé**.
Le slashing _ne peut pas survenir_ en étant hors ligne pour maintenance.

Ci-dessous se trouve un tableau qui montre les pénalités qui peuvent arriver à un validator :

| Type                  | Couche    | Montant                                                                                     |
| --------------------- | --------- | ------------------------------------------------------------------------------------------- |
| Missed Attestation    | Consensus | -0,000011 ETH\* par attestation (-9/10 de la valeur d'une récompense d'attestation normale) |
| Missed Proposal       | Consensus | 0                                                                                           |
| Missed Sync Committee | Consensus | -0,00047 ETH\* par epoch (-0,1 ETH au total si hors ligne pour tout le sync committee)      |
| Slashing              | Consensus | Au moins 1/32 de votre solde, jusqu'à votre solde entier dans des circonstances extrêmes    |

\*_Varie en fonction du nombre total de validators dans le réseau.
Approximé pour 435 000 validators actifs._

::: tip TIP
En règle générale, si vous êtes hors ligne pendant X heures (et que vous n'êtes pas dans un sync committee), alors vous récupérerez tout votre ETH perdu après X heures une fois que vous serez de nouveau en ligne et attesterez.
:::

## Comment Fonctionnent les Nodes Rocket Pool

Contrairement aux solo stakers, qui doivent déposer 32 ETH pour créer un nouveau validator, les nodes Rocket Pool n'ont besoin de déposer que 8 ETH par validator (appelés "bond ETH").
Ceci sera couplé avec 24 ETH du staking pool (appelés "borrowed ETH", qui proviennent des dépôts de liquid stakers en échange de rETH) pour créer un nouveau validator.
Ce nouveau validator appartient à un **minipool**.

Pour la Beacon chain, un minipool ressemble exactement à un validator normal.
Il a les mêmes responsabilités, les mêmes règles à suivre, les mêmes récompenses, etc.
La seule différence réside dans la façon dont le minipool a été créé sur la couche execution, et comment fonctionnent les retraits lorsque le node operator décide de sortir volontairement le minipool.
Toute la création, le retrait et la délégation des récompenses sont gérés par les **smart contracts** de Rocket Pool sur la blockchain Ethereum.
Cela le rend complètement décentralisé.

Un **Node** Rocket Pool est un seul ordinateur avec un portefeuille Ethereum qui a été enregistré auprès des smart contracts de Rocket Pool.
Le node peut ensuite créer autant de minipools qu'il peut se permettre, tous fonctionnant ensemble sur la même machine.
**Un seul node Rocket Pool peut exécuter de nombreux minipools.**
Chaque minipool a un impact négligeable sur les performances globales du système ; certaines personnes ont pu en exécuter des centaines sur un seul node.

Le coût initial d'un minipool est de 8 ETH. De plus, un node operator peut staker des RPL sur son node pour se qualifier pour des récompenses supplémentaires et gagner un pouvoir de vote au sein du protocole DAO.

## Node Operators Rocket Pool

Les **node operators** sont le cœur et l'âme de Rocket Pool.
Ce sont les individus qui gèrent les nodes Rocket Pool.

### Responsabilités

Ils mettent l'ETH du staking pool au travail en exécutant des minipools avec, ce qui génère des récompenses de staking pour le protocole Rocket Pool (et donc, augmente la valeur de rETH).
Leur travail est simple, mais d'une importance cruciale : _exécuter des validators avec la plus haute qualité possible et maximiser les récompenses de staking_.

Les node operators sont responsables de :

- Configurer un ordinateur (physique ou virtuel)
- Le configurer correctement, y compris leur réseau domestique si applicable
- Installer Rocket Pool dessus et configurer des minipools pour effectuer la validation
- Le sécuriser, contre les menaces extérieures et intérieures
- Le maintenir pendant toute la durée de vie de leurs validators

C'est une grande responsabilité, et ce n'est pas un simple travail du type "configure-le-et-oublie-le" ; vous devez prendre soin de votre node aussi longtemps qu'il stake.
Avec une grande responsabilité, cependant, viennent de grandes récompenses.

### Récompenses

Voici les principaux avantages de gérer un node Rocket Pool :

- Vous gagnez votre portion des récompenses ETH de chaque validator, plus une commission.
  - Pour les minipools avec 8 ETH de bond et sans RPL staké, cela revient à 30% de plus que le solo staking (`(8+24*.1)/8 = 1.3`)
  - Staker des RPL fournit une commission boostée. Avec un stake de RPL valorisé à 10% ou plus de votre total d'ETH emprunté, les récompenses ETH s'élèvent à 42% de plus que le solo staking (`(8+24*.14)/8 = 1.42`)
  - **Note :** si vous ne participez pas au smoothing pool, vous recevrez plutôt 15% de plus que le solo staking (`(8+24*.05)/8 = 1.15`) -- il est fortement recommandé que les utilisateurs avec des minipools créés le ou après le 28/10/2024 optent pour le smoothing pool.
- Vous gagnez également des récompenses d'émission sur les RPL que vous stakez.
  - À la fin d'une période (tous les 28 jours), il y a un instantané de vos RPL.
  - Vous pouvez gagner un rendement maximal sur les RPL **jusqu'à 15%** de la valeur de votre total d'ETH emprunté.
    - Vous gagnerez un rendement sur les RPL au-delà de cela, à un niveau décroissant.
  - Vous obtiendrez un pouvoir de vote basé sur la racine carrée de vos RPL stakés.

### Limitations

Il existe certaines limitations qui accompagnent les récompenses ci-dessus :

- Si votre node performe mal et que vous finissez par perdre de l'ETH au moment où vous décidez de sortir votre minipool, tout l'ETH perdu proviendra de votre part.
  - Par exemple : si vous sortez avec un solde de 30 ETH, alors votre minipool a perdu 2 ETH de son dépôt initial de 32 ETH. Vous recevrez 6 ETH, et 24 ETH seront retournés au staking pool.
- Vos RPL stakés seront moins liquides
  - Vous ne pouvez retirer du stake RPL qu'au-delà de ce qui est valorisé à 60% de votre ETH bondé.
  - Vous ne pouvez pas retirer de RPL si vous avez staké au cours des 28 derniers jours

### Vous pouvez le faire

Si vous êtes assez nouveau dans l'utilisation de la ligne de commande ou la maintenance informatique, cela peut sembler être un défi effrayant.
Heureusement, l'un des principes les plus fondamentaux de Rocket Pool est la _décentralisation_ - le fait que n'importe qui, n'importe où, peut gérer un node s'il a la détermination et les connaissances.
Bien que nous ne puissions pas aider avec la détermination, nous _pouvons_ aider avec les connaissances.
Cette section regorge de guides, de tutoriels et d'informations qui vous aideront à comprendre comment gérer un excellent node Rocket Pool.
