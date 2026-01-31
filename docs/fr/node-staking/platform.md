# Exigences du Node et Choix d'une Plateforme

Très bien !
Vous avez donc décidé de tenter votre chance en gérant un node Rocket Pool.
La première étape du processus consiste à décider quel type de plateforme vous souhaitez utiliser pour exécuter votre node.
Si vous en avez déjà une en tête, parfait !
Vous pouvez passer à la section suivante.
Si vous n'êtes pas encore sûr, alors lisez ce qui suit pour obtenir quelques informations sur vos options.

## Exigences pour un Full Node

Un **full node** est celui qui exécute à la fois un Execution Client et un Consensus Client avec la stack Rocket Pool.
Maintenant que le Merge a eu lieu, les nodes Rocket Pool sont tenus d'exécuter cette configuration (bien que les clients Execution et Consensus puissent être gérés de manière externe pour les utilisateurs qui exécutent déjà une configuration de solo-staking - nous couvrirons cela plus en détail plus tard).

Voici une ventilation simple de ce qui est nécessaire pour bien gérer un full node Rocket Pool :

- Une **connexion Internet stable**. Plus vous restez en ligne longtemps, meilleures sont vos récompenses. Une connexion Internet instable nuira à vos rendements, et par extension, à la croissance du ratio rETH.
- Au moins **10 Mbps de bande passante en montée et en descente**. Un full node utilise généralement environ 8 Mbps à 10 Mbps en montée et en descente de trafic réseau, selon votre configuration et le nombre de minipools.
- **Aucun plafond de données** imposé par votre FAI. L'exécution d'un full node prendra beaucoup de données - nous avons vu des rapports de plus de 2 To par mois sur les seules données de chaîne. Cela peut être atténué quelque peu avec quelques ajustements de paramètres des clients ETH, mais en règle générale, n'exécutez pas un full node si votre forfait Internet comporte un plafond de données mensuel.
- **Électricité stable**. Pour la même raison que le besoin d'une connexion Internet stable, vous voulez également avoir une alimentation électrique fiable. Cela peut être atténué avec un grand UPS (batterie de secours) pour faire face aux courtes pannes.
- Un **ordinateur** avec des spécifications suffisantes. Ceci est assez flexible car cela dépend _vraiment_ du client Execution et Consensus que vous utilisez, et des paramètres que vous leur configurez. L'ordinateur peut être une machine locale, ou il peut être hébergé dans le cloud. Lisez ci-dessous pour plus d'informations sur ces deux options, et comment décider laquelle vous convient le mieux.

L'ordinateur doit répondre aux [directives matérielles](./local/hardware.md)

::: warning NOTE
À l'heure actuelle, seules les plateformes **Linux** et **macOS** sont prises en charge.
**Windows n'est actuellement pas pris en charge** pour l'exploitation du Smartnode.
:::

## Exécuter un Node Local

Si vous avez une électricité fiable et un accès Internet sans plafond, et que vous êtes prêt à construire (ou acheter préfabriqué) et maintenir un ordinateur, alors l'exécution d'un node local pourrait être un excellent choix pour vous. Avec cette option, vous configurerez un ordinateur dédié en tant que node Rocket Pool et l'exécuterez localement dans votre propre maison.

Avantages :

- Pas de frais mensuels, autres que les services publics
- Contrôle total sur votre propre machine et ses données (y compris la clé de votre portefeuille)
- Accès pour effectuer la maintenance et les mises à niveau quand vous le souhaitez
- Contribue à la décentralisation d'Execution et Consensus, et de Rocket Pool (et donc, à leur sécurité)

Inconvénients :

- Nécessite une connexion Internet et une électricité stables et sans plafond
  - **L'exécution d'un node utilise au moins 1,5 To de données par mois. Si vous avez un plafond de données inférieur à ce montant, vous pourriez rencontrer des problèmes lors de l'exécution d'un node local !**
- Vous êtes seul responsable de la sécurité du réseau et de l'ordinateur
- Peut être difficile si vous n'êtes pas expérimenté en maintenance informatique
- Vulnérable au vol

Si les avantages semblent l'emporter sur les inconvénients pour vous, alors jetez un œil à notre [Guide de l'Opérateur de Node Local](./local/hardware.html).

## Exécuter sur un Serveur

Si vous n'avez pas un forfait Internet fiable sans plafond, ou si vous ne voulez tout simplement pas vous occuper de la construction et de la maintenance de votre propre ordinateur physique, vous voudrez peut-être envisager d'exécuter un serveur privé que vous louez auprès d'un fournisseur d'hébergement. Essentiellement, ces entreprises créeront et exécuteront volontiers un serveur pour vous, moyennant des frais mensuels. Si ces frais ne vous dérangent pas et que vous voulez exécuter un node Rocket Pool, l'utilisation d'un serveur peut être une bonne stratégie.

Avantages :

- Pas de maintenance, le support est généralement disponible pour résoudre les problèmes
- N'affecte pas votre forfait Internet ou votre plafond de données
- Généralement exécuté dans un centre de données professionnel, très peu de temps d'arrêt
- Peut être plus rentable que d'acheter / construire votre propre ordinateur

Inconvénients :

- Rend Execution et Consensus, et Rocket Pool un peu plus centralisés, ce qui affaiblit la sécurité des réseaux
- Frais mensuels
- Les serveurs peuvent avoir des plafonds de données ou des tarifs d'E/S réseau coûteux
- Il est possible que les hébergeurs examinent le contenu de votre machine et prennent la clé de votre portefeuille si elle n'est pas sécurisée

Si ces avantages semblent l'emporter sur les inconvénients pour vous, alors jetez un œil à notre [Guide de l'Opérateur de Node Serveur](./vps/providers.html).
