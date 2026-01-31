# Sélection d'un Mode Rocket Pool

La stack Smartnode de Rocket Pool est assez flexible ; il existe plusieurs façons différentes de l'exécuter.
Elle peut créer un full node complet à partir de zéro, elle peut s'intégrer avec des déploiements existants de clients Execution ou Consensus, et elle peut même s'exécuter nativement en tant qu'ensemble de services système.
Dans cette section, nous couvrirons les façons typiques de configurer et d'utiliser la stack Smartnode.

## La Configuration Docker par Défaut

Le mode par défaut, et la façon la plus courante d'exécuter un Smartnode, est de lui faire créer une instance de full node complète sur votre machine locale que Rocket Pool gère.

Pour y parvenir, le Smartnode utilise des [conteneurs Docker](https://www.docker.com/resources/what-container).
En essence, un conteneur Docker est un petit bac à sable qui est préconfiguré avec un programme, toutes ses dépendances et toute la configuration nécessaire pour fonctionner correctement.
Quand il n'est plus nécessaire, il peut simplement être jeté.
C'est un petit paquet autonome pratique qui permet aux choses de fonctionner sans faire de désordre dans votre système de fichiers réel ou dans d'autres programmes.

Ce mode est ce que l'Installateur Smartnode déploiera pour vous.
Il utilise les conteneurs Docker suivants :

- `rocketpool_api` - Cela contient la fonctionnalité réelle que le Smartnode fournit lorsque vous interagissez avec lui via l'interface en ligne de commande (CLI) de Rocket Pool.
- `rocketpool_node` - C'est un processus d'arrière-plan qui vérifiera périodiquement et revendiquera les récompenses RPL après un point de contrôle de récompense (si vous avez activé la réclamation automatique, nous en parlerons plus tard), et est responsable du staking réel de nouveaux validators lorsque vous créez un minipool.
- `rocketpool_watchtower` - Ceci est utilisé par les Oracle Nodes pour effectuer des tâches liées à l'oracle. Pour les node operators réguliers, cela restera simplement inactif.
- `rocketpool_eth1` - Ce sera votre client Execution.
- `rocketpool_eth2` - Ce sera votre client Consensus beacon node.
- `rocketpool_validator` - Ce sera votre client Validator, qui est responsable de vos devoirs de validator (comme attester des blocs ou proposer de nouveaux blocs).

Dans la plupart des situations, c'est une bonne option à choisir lors de la création d'un nouveau node à partir de zéro.
C'est la procédure la plus rapide et la plus automatisée.
Elle gérera également les mises à jour des clients Execution et Consensus avec chaque nouvelle version du Smartnode, vous n'avez donc pas à vous en soucier (bien que vous puissiez les mettre à niveau manuellement à tout moment si vous le souhaitez).

::: warning NOTE
Actuellement, certains des conteneurs Docker doivent s'exécuter en tant qu'utilisateur `root` pour fonctionner correctement.
Bien que les conteneurs Docker soient généralement très bons pour empêcher un utilisateur de s'échapper vers votre système d'exploitation principal, vous pourriez ne pas être à l'aise avec cette exigence pour des raisons de sécurité.
Dans ce cas, nous vous suggérons d'utiliser le mode de configuration Native listé ci-dessous.
:::

Si vous souhaitez utiliser ce mode, passez à la section [Configuration d'un Node Rocket Pool Standard avec Docker](./docker).

## La Configuration Hybride avec des Clients Externes

La configuration hybride convient bien aux utilisateurs qui souhaitent exécuter un node Rocket Pool, mais ont déjà leurs propres clients Execution et/ou Consensus en cours d'exécution à d'autres fins (par exemple, parce qu'ils font déjà du solo-staking).

Dans ce mode, Rocket Pool déploiera des conteneurs Docker pour ses propres processus et pour un client Validator qu'il gère, mais ignorera les conteneurs de client Execution et de Beacon Node pour les clients externes que vous exécutez et maintenez déjà.
**Comme Rocket Pool créera et maintiendra de nouvelles clés de validator pour chacun des minipools de votre node, il est important qu'il exécute son propre client Validator.**

Lors de l'utilisation de cette configuration, le Smartnode utilisera les conteneurs Docker suivants (qui ont été décrits ci-dessus) :

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

Les conteneurs `rocketpool_eth1` et `rocketpool_eth2` seront soit inclus soit exclus, selon les clients que vous avez déjà en cours d'exécution de manière externe.

Si vous souhaitez utiliser ce mode, passez à la section [Configuration d'un Node Rocket Pool Standard avec Docker](./docker).
Lorsqu'on vous demandera de choisir un mode de gestion pour vos clients Execution et/ou Consensus, choisissez l'option **Externally Managed** qui est décrite en détail dans cette section.

## La Configuration Native sans Docker

Cette configuration contourne Docker entièrement.
Au lieu d'exécuter la stack Smartnode via Docker, chaque processus sera installé en tant que service système local (par exemple via `systemd`).
Cela inclut les processus `node`, `watchtower`, `eth1`, `eth2` et `validator`.

Cette configuration offre le plus de flexibilité car elle vous permet d'affiner les paramètres de Rocket Pool (tels que sa posture de sécurité, où vivent les clients Execution et Consensus, où vivent les données de chaîne, où vivent vos clés, etc.).
C'est aussi la plus difficile à configurer et à maintenir.

Dans ce mode, l'Installateur Smartnode n'est plus pertinent.
Vous êtes responsable de l'instanciation, de la maintenance et de la mise à niveau manuelles de l'infrastructure Smartnode, des clients ETH et des clients validator.

::: danger WARNING
Bien que nous fournissions une documentation d'exemple sur la façon de le faire, nous suggérons que ce mode ne devrait être utilisé que par des **administrateurs système expérimentés**.
:::

Si vous souhaitez utiliser ce mode, passez à la section [Configuration d'un Node Rocket Pool Natif sans Docker](./native.mdx).
