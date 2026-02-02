# La DAO Oracle de Rocket Pool

::: warning REMARQUE
Cette documentation ne s'applique qu'aux membres de la DAO Oracle de Rocket Pool.
Si vous n'avez pas été explicitement invité à la DAO Oracle et avez simplement l'intention d'exécuter un nœud Rocket Pool régulier, cette section du guide ne s'applique pas à vous.
Vous pouvez l'ignorer en toute sécurité, mais vous êtes invité à la lire si cela vous intéresse.
:::

La **DAO Oracle** est le groupe de nœuds spéciaux Rocket Pool responsables des tâches administratives requises par le protocole qui ne peuvent pas être réalisées par les contrats intelligents en raison de limitations techniques.
Ils sont essentiellement identiques aux nœuds Rocket Pool normaux ; ils utilisent les mêmes outils, peuvent être configurés avec les mêmes méthodes et peuvent même exécuter des minipools réguliers, mais ils sont accompagnés de tâches supplémentaires qu'ils effectuent.
Cela inclut des choses telles que :

- Transférer des informations de la Beacon Chain vers la couche d'exécution, y compris le statut et les soldes des validateurs
- Garantir que les minipools sont créés en utilisant des clés publiques de validateur qui ne sont pas déjà utilisées, et [ont les bonnes informations d'identification de retrait](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit) afin que le protocole puisse les financer en toute sécurité
- Construire l'arbre Merkle des récompenses à la fin de chaque période de récompenses et le télécharger sur IPFS pour que d'autres opérateurs de nœuds puissent y accéder
- Surveiller les propositions pour la conformité avec les [exigences de destinataire de frais](../node-staking/mev.mdx) de Rocket Pool
- Proposer et voter sur les modifications du protocole principal, y compris la modification des paramètres et l'approbation des mises à niveau de contrats
- Proposer et voter sur la liste de la DAO Oracle, y compris l'invitation et la suppression d'autres membres de la DAO Oracle

En récompense de l'accomplissement de ces tâches, la DAO Oracle reçoit collectivement un [petit pourcentage](https://rpips.rocketpool.net/RPIPs/RPIP-25) de l'inflation totale de RPL produite à chaque période de récompenses, divisé équitablement entre ses membres.

Contrairement aux nœuds Rocket Pool normaux, qui peuvent être créés et exécutés sans autorisation par n'importe qui, l'adhésion à la DAO Oracle est **sur invitation uniquement** par les membres existants.
Si vous avez récemment été invité à rejoindre la DAO Oracle, cette section du guide vous aidera à comprendre votre rôle, à configurer votre nœud et à vous assurer qu'il reste en bonne santé.

## Exigences

Pour exécuter un nœud de la DAO Oracle, vous aurez besoin de ce qui suit :

- Accès au **point de terminaison RPC d'un client d'exécution**. Il peut s'agir d'un client exécuté localement, comme c'est le cas avec la plupart des nœuds Rocket Pool, ou il peut se connecter à des clients externes que vous ou votre organisation maintenez indépendamment.
- Accès à un **client d'exécution en mode archive**, qui peut agir comme votre client principal ou un client supplémentaire (de secours). Il ne sera utilisé que dans de rares circonstances où les tâches nécessitent que votre nœud rappelle un état de la couche d'exécution qui a été élagué de votre client d'exécution. Néanmoins, il est **critique** que vous ayez accès à un nœud d'archive pendant ces périodes pour vous assurer que vos tâches peuvent être accomplies avec succès.
  - Nous **recommandons fortement** d'utiliser un nœud d'archive sur site pour cela, car des services tels que [Infura](https://infura.io/pricing) ou [Alchemy](https://www.alchemy.com/pricing) ont montré quelques difficultés à suivre la demande pendant les périodes critiques telles que la construction de l'arbre de récompenses.
- Accès au **point de terminaison de l'API REST d'un nœud Beacon en mode archive** (via HTTP). Il peut s'agir d'un client exécuté localement, comme c'est le cas avec la plupart des nœuds Rocket Pool, ou il peut se connecter à des clients externes que vous ou votre organisation maintenez indépendamment.
- La CLI Smartnode standard.
- Le démon Smartnode est configuré et fonctionne en mode `watchtower` (ceci est inclus avec le bundle Smartnode standard pour tous les utilisateurs, mais n'effectue activement des tâches que pour les nœuds de la DAO Oracle).
  - Cela peut être exécuté dans un conteneur Docker (configuration standard) ou comme un simple service `systemd` (mode "Natif").
- Suffisamment d'ETH pour payer les coûts de gaz de vos tâches (discuté plus tard).

::: warning REMARQUE
Si vous ne pouvez tout simplement pas exécuter un nœud d'archive sur site et _devez_ vous fier à un service tiers, considérez ce qui suit :

Si vous prévoyez d'utiliser **Infura** pour votre solution de secours en mode archive, vous devez avoir au moins le forfait **Team**.
Le niveau gratuit et le niveau Developer ne sont pas suffisants.

Si vous prévoyez d'utiliser **Alchemy**, vous devez avoir au moins le forfait **Growth**.
Le niveau gratuit n'est pas suffisant.
:::

## Activités

Les tâches de la DAO Oracle sont divisées en deux parties.

1. **Tâches automatisées** : ce sont des tâches liées au fonctionnement routinier de Rocket Pool, telles que le transfert d'informations de la couche de consensus vers la couche d'exécution, le calcul de divers aspects du protocole hors chaîne et leur soumission en tant que mises à jour aux contrats intelligents. Chacune d'elles est effectuée automatiquement par le processus démon `watchtower` et ne nécessite pas d'intervention manuelle tant que vos clients d'exécution et de consensus, et votre démon `watchtower`, fonctionnent tous normalement.
2. **Tâches manuelles** : ce sont des tâches qui nécessitent votre propre prise de décision et une communication hors bande avec le reste de la DAO Oracle pour être effectuées. Elles incluent des choses telles que voter sur les mises à niveau de contrats, modifier les paramètres et inviter ou expulser des membres vers/de la DAO Oracle. Tout cela peut être fait via la CLI Smartnode standard.

Lisez la section suivante pour apprendre à configurer votre nœud de la DAO Oracle.
