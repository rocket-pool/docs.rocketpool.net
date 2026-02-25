# La mise à jour Atlas

::: tip REMARQUE
Atlas a été déployé le `18 avril 2023, 00:00 UTC`. Veuillez visiter [ici](../houston/whats-new) pour en savoir plus sur Houston, la dernière mise à niveau du protocole.
:::

Cette page décrit les changements majeurs que la prochaine mise à jour importante de Rocket Pool, intitulée **Atlas**, apporte au protocole, y compris les mises à jour de la stack Smartnode et du protocole Rocket Pool en général.

Veuillez lire attentivement cette page pour comprendre toutes les différences entre la version précédente de Rocket Pool (Redstone) et Atlas.

## Nouvelles fonctionnalités du protocole

Atlas apporte de nouvelles fonctionnalités passionnantes basées à la fois sur les retours de la communauté et sur les changements du protocole Ethereum lui-même.
Voici une brève liste de ces changements - cliquez sur l'un d'eux pour en savoir plus.

### Shapella et les retraits

Le protocole Ethereum se prépare à subir sa prochaine mise à niveau majeure : **Shanghai** sur la couche Execution, et **Capella** sur la couche Consensus - puisque celles-ci sont maintenant interconnectées, les deux se produiront en même temps.
Les utilisateurs d'Ethereum ont affectueusement appelé la mise à niveau combinée [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) en conséquence.

Shapella introduit les **retraits** sur la Beacon Chain, ce qui signifie que les Node Operators peuvent maintenant accéder à l'ETH actuellement verrouillé sur la Beacon Chain.
Cela se présente sous deux formes :

- Les retraits partiels (**skimming**), où vos récompenses (votre solde excédentaire de la Beacon Chain au-dessus de 32 ETH) sont envoyées à votre minipool sur la couche Execution. Ceci est effectué _automatiquement par le protocole lui-même_ de temps en temps (environ une fois tous les quatre ou cinq jours sur le Mainnet).
- Les **retraits complets**, où vous sortez votre validateur de la Beacon Chain et son solde entier est envoyé à votre minipool sur la couche Execution. Ceci est effectué _automatiquement par le protocole lui-même_ une fois que votre validateur a été sorti de la chaîne suffisamment longtemps.

Atlas introduit un nouveau contrat délégué pour les minipools qui permet aux Node Operators de **distribuer** le solde ETH du minipool, en le divisant de manière égale entre le Node Operator et les détenteurs de rETH (plus la commission, bien sûr) à tout moment.
Cela donne aux Node Operators un **accès immédiat** à leurs récompenses de la Beacon Chain !
Cela remet également la part des détenteurs de rETH dans le pool de dépôt, afin qu'elle puisse être utilisée pour unstaker du rETH contre de l'ETH au taux de change du protocole (ou pour créer de nouveaux minipools).

### Minipools avec caution de 8 ETH

L'un des changements les plus attendus apportés par Atlas est l'introduction de la capacité de ne fournir que 8 ETH pour créer un minipool au lieu de 16 ETH.
Les minipools avec seulement 8 ETH cautionnés par leur Node Operator propriétaire sont associés à **24 ETH** du pool de staking (fourni par les détenteurs de rETH) afin de créer un validateur.
Cela réduit considérablement les exigences en capital pour exécuter votre propre validateur _et_ entraîne des rendements plus élevés pour le Node Operator et les stakers rETH !
En fait, exécuter deux minipools de 8 ETH au lieu d'un minipool de 16 ETH fournira **plus de 18% de récompenses supplémentaires** - même si le minipool de 16 ETH a un taux de commission de 20%.

La création d'un minipool de 8 ETH nécessite que vous stakiez un **minimum de 2,4 ETH en valeur de RPL** et un **maximum de 12 ETH en valeur de RPL**.
Ceux-ci représentent 10% du montant que vous _empruntez_ au protocole, et 150% du montant que vous _cautionnez_ (stakez) vous-même.

Les nouveaux minipools peuvent être créés avec soit 8 ETH soit 16 ETH.
Les minipools de 16 ETH sont inchangés par rapport à leur fonctionnement actuel et sont disponibles pour les utilisateurs qui souhaitent minimiser leur exposition au jeton RPL.

Pour apprendre comment créer de nouveaux minipools en utilisant une caution de 8 ETH, veuillez visiter le [guide de création de minipool](../../node-staking/create-validator.mdx).

De plus, une fois qu'Atlas a été appliqué, les Node Operators peuvent **migrer les minipools existants de 16 ETH directement en minipools de 8 ETH sans avoir besoin de sortir**.
Cela leur rendra 8 ETH sous forme de [crédit de dépôt](../../node-staking/credit), qui peut être utilisé pour créer un **nouveau minipool de 8 ETH gratuitement** !

Pour en savoir plus sur les minipools avec caution de 8 ETH, veuillez visiter le [guide de réduction de caution](../../node-staking/leb-migration.mdx).

### Conversion de validateur solo

Une partie de la mise à niveau Shapella implique la capacité pour les validateurs solo de [changer les identifiants de retrait de leurs validateurs](https://notes.ethereum.org/@launchpad/withdrawals-faq) de la clé de retrait BLS d'origine (maintenant inutilisée) vers une adresse sur la couche Execution.
Cette adresse sera le destinataire de toutes les récompenses de ce validateur et de son solde ETH complet une fois qu'il sort de la Beacon Chain.

Les Node Operators réguliers de Rocket Pool n'ont pas à se soucier de tout cela, car le protocole a automatiquement configuré cela pour vos minipools lorsque vous les avez créés.
_Cependant_, dans le cadre de cette nouvelle exigence pour les validateurs solo, Atlas apporte une opportunité passionnante : la capacité de **créer un minipool spécial** qui deviendra l'adresse de retrait de votre **validateur solo existant**.

En d'autres termes, cela vous permettra de **convertir directement un validateur solo en minipool Rocket Pool sans avoir besoin de le sortir !**

Cela signifie que vous obtiendrez tous les avantages des minipools Rocket Pool, notamment :

- La capacité de convertir votre validateur unique (avec une caution de 32 ETH) en **quatre minipools** (chacun avec une caution de 8 ETH), **quadruplant** efficacement votre présence sur la Beacon Chain
- Une commission sur la portion de ces minipools fournie par les stakers rETH
- Accès au [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) de Rocket Pool pour mettre en commun et distribuer équitablement les récompenses des propositions de blocs et MEV

Pour en savoir plus sur la conversion d'un validateur solo en minipool, veuillez visiter le guide [Conversion d'un validateur solo en minipool](../../node-staking/solo-staker-migration).

## Nouvelles fonctionnalités du Smartnode

En plus des changements fondamentaux au protocole Rocket Pool, Atlas apporte également des mises à niveau passionnantes à la stack Smartnode elle-même, qui sont présentes dans la v1.9.0.

### Distributions automatiques de récompenses

Si vous êtes déjà un Node Operator actif de Rocket Pool, vous connaissez peut-être le processus `rocketpool_node` qui gère certains processus automatisés.
Par exemple, il garantit que vous avez le bon destinataire de frais et exécute automatiquement la deuxième transaction `stake` pour vous après que les minipools `prelaunch` passent la vérification de nettoyage de 12 heures.

À partir d'Atlas, le `node` a un nouveau devoir : **distribution automatique des récompenses de minipool !**
Ceci est dû à la façon dont [la mise à niveau Shapella fonctionne](../../node-staking/skimming), en écrémant vos récompenses de la Beacon Chain dans votre minipool tous les quelques jours.

Chaque fois que l'un de vos minipools atteint un solde supérieur à un seuil spécifié par l'utilisateur (par défaut 1 ETH), le nœud exécutera automatiquement `distribute-balance` dessus.
Cela enverra votre portion des récompenses à votre adresse de retrait, et la portion du staker de pool retournera au pool de dépôt.

Le changement du seuil peut être effectué dans la section `Smartnode and TX Fees` du TUI `service config`, sous le paramètre `Auto-Distribute Threshold`.

### Tableau de bord Grafana unifié

Suite à une demande populaire, nous avons créé un nouveau [**tableau de bord Grafana**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) pour aider les Node Operators à suivre et évaluer l'état, la progression et la santé globale de leurs nœuds :

![](../../node-staking/images/grafana-1.3.jpg)

Il est livré avec les fonctionnalités très demandées suivantes :

- Prise en charge de tous les clients Execution et Consensus dans un seul tableau de bord - plus besoin de changer de tableau de bord en fonction des clients que vous utilisez !
- Statistiques du client Execution, y compris l'utilisation du CPU et de la RAM, et le nombre de pairs
- Suivi de la précision des attestations qui suit à quel point vos attestations étaient "correctes" pour l'époque précédente, afin que vous sachiez à quelle distance vous êtes des récompenses optimales
- Suivi du solde du Smoothing Pool
- Suivi des récompenses réclamées et non réclamées, y compris maintenant l'ETH du Smoothing Pool
- Statistiques sur les votes de gouvernance basés sur Snapshot de Rocket Pool
- Espace pour suivre l'espace utilisé et la température d'un deuxième SSD si vous en avez un pour votre système d'exploitation et un autre pour vos données de chaîne
- Et plus encore !

Vous pouvez importer le nouveau tableau de bord depuis le service officiel Grafana en utilisant l'ID `21863` en suivant notre [guide Grafana](../../node-staking/grafana.mdx).

Ce nouveau tableau de bord a été un travail d'amour qui a impliqué l'aide considérable du membre de la communauté **0xFornax** - merci pour tout votre travail acharné !

### Changements Nimbus

Smartnode v1.9.0 introduit le **support du mode split** pour Nimbus !
Au lieu d'exécuter le Beacon Node et le Validator Client à l'intérieur d'un seul processus / conteneur, le Smartnode les exécutera maintenant dans des conteneurs séparés comme les autres clients. Cela présente les avantages suivants :

- Nimbus prend désormais en charge les **clients de secours** (un client Execution secondaire et un Beacon Node auxquels le Validator Client de Nimbus peut se connecter lorsque vos clients principaux sont en panne pour maintenance, comme la resynchronisation).
- Nimbus est maintenant pris en charge en **mode géré en externe (hybride)**, vous pouvez donc coupler le Validator Client que le Smartnode gère à un Beacon Node externe que vous maintenez vous-même.
- Le Beacon Node n'a plus besoin d'être redémarré après l'ajout de nouveaux minipools, ce qui signifie que vous ne perdez pas d'attestations pendant qu'il se reconnecte à ses pairs.

### Support Lodestar

[Lodestar](https://chainsafe.github.io/lodestar/) est maintenant pris en charge comme option pour votre client Consensus de choix !
C'est le nouvel ajout à être officiellement accepté sur [le Launchpad d'Ethereum](https://launchpad.ethereum.org/en/lodestar), et il est prêt pour la validation.
Lodestar prend en charge de nombreuses fonctionnalités formidables que vous avez apprises à aimer des autres clients, y compris la détection de Doppelganger, MEV-Boost, les clients gérés en externe (mode hybride), et plus encore !

### Nouveau système d'instantané du réseau

Sur une note légèrement plus technique, la v1.9.0 introduit un tout nouveau système pour capturer rapidement un instantané de l'état de **tout ce qui concerne votre nœud** sur les couches Execution et Consensus.
Sous le capot, ce système exploite [le contrat multicall de MakerDAO](https://github.com/makerdao/multicall) et [le contrat Ethereum Balance Checker de Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) pour regrouper des milliers de requêtes individuelles de client Execution en une seule requête.

Cela rend le processus `node` beaucoup moins exigeant sur le client Execution pour les Node Operators avec un grand nombre de validateurs, et devrait réduire considérablement sa charge CPU, ce qui améliorera les attestations et les récompenses globales.

Ce nouveau système n'a pas encore été intégré dans le CLI lui-même, donc toutes les commandes que vous y exécutez (telles que `rocketpool minipool status`) utiliseront toujours l'ancienne configuration à requête unique.
Au fil du temps, nous l'introduirons également dans le CLI, ce qui rendra toutes ses commandes ultra-rapides (_sauf pour attendre que les transactions soient validées, cela prend encore du temps_).
