---
next:
  text: La DAO du protocole
  link: "/fr/legacy/houston/pdao"
---

# La mise à niveau Houston

La mise à niveau Houston vise principalement à introduire une DAO entièrement on-chain pour gouverner le protocole, connue sous le nom de Protocol DAO ou pDAO. C'est une DAO comme aucune autre et elle ne nécessite pas de vote snapshot ou d'autres outils tiers pour fonctionner, elle est vraiment on-chain et unique en son genre, plus de détails ci-dessous.

Cette mise à niveau introduira également d'autres fonctionnalités très excitantes qui permettront de nouvelles intégrations et plateformes à construire sur le protocole. Certaines d'entre elles incluent la possibilité de staker de l'ETH au nom d'un nœud (pas seulement depuis le nœud lui-même) et une nouvelle fonctionnalité d'adresse de retrait RPL, qui permet à une partie de fournir l'ETH pour le staking et à une autre partie de fournir le RPL sans donner la garde à l'opérateur de nœud.

## Protocol DAO

La Protocol DAO de Rocket Pool (pDAO) est responsable de façonner la direction du protocole et est gérée par la gouvernance RPL. Ses membres et leur pouvoir de vote sont composés d'opérateurs de nœud, grands et petits, qui participent tous directement au protocole.

Typiquement, la gouvernance DAO dans l'espace crypto plus large se fait par vote pondéré par tokens. Fondamentalement, plus vous détenez de tokens pour un protocole/projet, plus votre pouvoir de vote est important. Vous n'avez pas non plus besoin de participer activement au protocole, simplement détenir les tokens suffit.

C'est ce style de gouvernance que nous voulions éviter. Si vous voulez aider à diriger et guider l'avenir de Rocket Pool, vous devez être activement impliqué, pas seulement stocker des tokens dans un portefeuille froid. Du plus grand fonds de capital-risque à votre gars ordinaire qui exécute un seul minipool, vous devrez participer activement au protocole pour l'aider à gouverner.

Actuellement, la protocol DAO contrôle une variété de paramètres on-chain utilisés dans le protocole. De nouvelles Rocket Pool Improvement Proposals (RPIP) peuvent être faites et votées par ces opérateurs de nœud au sein de Rocket Pool. Vous pouvez voir le [**registre RPIP actuel ici**](https://rpips.rocketpool.net/). Si vous êtes un fanatique des détails, le RPIP actuel pour la protocol DAO on-chain dont nous parlons maintenant peut être trouvé ici.

### Que peut faire la pDAO ?

La pDAO contrôle de nombreux paramètres du protocole, elle peut dépenser les fonds du trésor et dans notre mise à niveau Houston, elle est accompagnée d'un nouveau conseil de sécurité pour aider à réagir rapidement en cas de problèmes potentiels avec le protocole. Parlons un peu plus de chacun de ces éléments ci-dessous.

**Paramètres du protocole :** Ceux-ci contrôlent certaines facettes du protocole telles que le paramètre qui contrôle le montant ETH minimum pouvant être déposé pour rETH (actuellement 0,01 ETH) ou même contrôlant la taille maximale du pool de dépôt, c'est-à-dire le montant maximum d'ETH pouvant être déposé dans le protocole en attendant d'être assigné aux opérateurs de nœud pour le staking. Vous pouvez trouver un tableau complet de [ces paramètres ici](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Fonds du trésor :** Le RPL a un taux d'inflation de 5 % et une partie de celui-ci est allouée au trésor de la pDAO. La pDAO a la capacité de dépenser ce trésor pour une variété d'efforts orientés vers le protocole, du financement du développement du protocole directement, à la gestion de subventions pour financer des améliorations tierces et des projets qui utilisent Rocket Pool et plus encore. Notre mise à niveau Houston ajoute une nouvelle capacité où ces paiements du trésor peuvent être effectués non seulement de manière forfaitaire, mais de manière progressive pour aider à suivre les objectifs en relation avec le financement continu.

**Conseil de sécurité :** Comme la mise à niveau Houston déplace la pDAO vers un système entièrement on-chain, une nouvelle mesure de sécurité a été introduite sous la forme du [conseil de sécurité](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council). Ces membres peuvent être élus par la pDAO et ils ont la capacité de mettre en pause le protocole rapidement en cas de problèmes potentiels. Le quorum doit être atteint parmi les membres pour qu'une réponse de sécurité soit exécutée. La pDAO a également le pouvoir de retirer des membres ou de dissoudre entièrement le conseil de sécurité si nécessaire.

### Propositions et votes

Pour qu'un système de gouvernance fonctionne, il faut des propositions et des votes. Pour le moment, le vote snapshot est utilisé pour ces paramètres et modifications de propositions, puis une intervention manuelle est nécessaire pour exécuter les changements. Avec l'introduction de la [mise à niveau Houston et du RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33), cela est déplacé vers un nouveau système optimiste de preuve de fraude qui permet à tout opérateur de nœud de soulever, voter ou contester des propositions, directement on-chain sans besoin d'outils tiers.

**Proposer :** Tout nœud avec un pouvoir de vote non nul peut soulever une proposition à tout moment. Ce faisant, ils doivent verrouiller une caution de proposition sous forme de RPL pour tout le processus de proposition.

**Contester :** Si un nœud qui a créé une proposition l'a fait avec des données incorrectes requises, il peut être contesté et le contestataire doit fournir une caution pour la contestation. Le nœud qui fait la contestation peut être récompensé avec la caution du proposant faite lors de la création de la proposition en cas de succès, cependant s'il a fait une contestation invalide, le proposant peut collecter sa caution de contestation.

**Voter** : Si une proposition passe la période où elle peut être contestée, elle entre dans les périodes de vote. Les opérateurs de nœud peuvent alors choisir de voter selon l'une des saveurs suivantes :

1. Abstention : Le pouvoir de vote de l'électeur contribue au quorum mais n'est ni pour ni contre la proposition.
2. Pour : L'électeur vote en faveur de l'exécution de la proposition.
3. Contre : L'électeur vote contre l'exécution de la proposition.
4. Veto : L'électeur vote contre la proposition tout en indiquant qu'il considère la proposition comme spam ou malveillante. Si le quorum de veto est atteint, la proposition est immédiatement rejetée et le proposant perd sa caution. Ceci est pour dissuader le spam, les propositions de faible qualité ou les propositions qui n'ont pas traversé les processus hors chaîne d'abord, comme la signalisation par vote snapshot.

Il y a **deux périodes de vote**

- Période de vote 1 : Pour les électeurs ou délégués votant au nom d'autres.
- Période de vote 2 : Pour les électeurs qui ont délégué leur pouvoir et veulent renverser la décision de leur délégué.

Une fois que les deux périodes de vote sont passées et que la proposition est réussie, la proposition peut être exécutée et le changement est appliqué au protocole Rocket Pool.

Après que la proposition a passé les périodes de vote, le proposant peut débloquer sa caution RPL, sauf si la proposition a été rejetée par une contestation ou vetotée.

## Staker de l'ETH au nom d'un nœud

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) permet à un compte de [staker de l'ETH au nom](../houston/stake-eth-on-behalf.mdx) d'un nœud Rocket Pool enregistré dans le protocole. Cela prend en charge une variété de situations où l'opérateur de nœud ne fournit pas directement l'ETH :

- Sécurité améliorée pour les opérateurs de nœud, car ils peuvent staker directement depuis leur portefeuille matériel, éliminant le besoin de transférer des fonds au nœud au préalable.
- Fournisseurs de staking en tant que service où la garde des fonds est gérée par un dépositaire de confiance.
- Intégrations de protocole où la garde des fonds est gérée par des smart contracts.
- DAOs ou organisations où la garde des fonds est gérée par un trésor.

Bien que l'objectif principal de cette fonctionnalité soit de faciliter les scénarios à déposant unique, il convient de noter que plusieurs déposants indépendants peuvent également tirer parti de cette capacité en créant des smart contracts superposés. Rocket Pool a également introduit la possibilité de staker du RPL au nom de lors de notre précédente version Atlas.

## Adresse de retrait RPL

Rocket Pool permet actuellement aux opérateurs de nœud de spécifier une adresse de retrait pour leur ETH et RPL. Cela pourrait être un portefeuille matériel externe ou quelque chose de similairement sécurisé.

Avec [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31), vous pouvez définir une adresse de retrait pour votre ETH et [une nouvelle pour votre RPL](../houston/rpl-withdrawal-address) si vous le souhaitez. L'adresse de retrait RPL si définie pourra déclencher et réclamer le RPL des récompenses d'inflation et n'aura aucun effet sur les récompenses de consensus ETH ou quoi que ce soit lié à l'ETH.

Cela crée des opportunités intéressantes où le RPL peut être fourni par une entité à un opérateur de nœud qui ne souhaite pas avoir d'exposition au RPL. Cette entité peut alors réclamer les récompenses RPL pour avoir mis en place la garantie d'assurance requise pour le nœud.

## Soumissions de solde et de prix RPL basées sur le temps

Les nœuds Rocket Pool doivent avoir au moins 10 % de garantie en RPL staké pour être éligibles aux récompenses, leur "stake effectif" étant calculé en fonction du ratio ETH:RPL, qui est rapporté par l'Oracle DAO à la fin de chaque intervalle de récompenses. Auparavant, cette "fenêtre de rechargement" (le temps entre le dernier rapport RPL et la fin de l'intervalle) avait une certaine incertitude et fluctuait d'un intervalle à l'autre car elle était spécifiée par nombre de blocs. Cela était valide avant la fusion mais ne prenait pas en compte la variabilité et le caractère aléatoire de la façon dont les blocs sont ajoutés.

Pour résoudre ce problème, les intervalles pour les rapports de prix et de solde seront désormais basés sur les secondes plutôt que sur les blocs. Ce changement garantit la prévisibilité et a la parité avec la façon dont les intervalles de récompenses sont calculés aujourd'hui. Si l'intervalle est défini sur `86400` secondes (nombre de secondes dans 24 heures), les prix et les soldes sont rapportés à la même heure chaque jour.

Le protocole a maintenant une "fenêtre de rechargement" fixe et contrôlable, supprimant les conjectures et fournissant aux utilisateurs une fenêtre cohérente de 24 heures pour recharger après la mise à jour finale des prix. N'hésitez pas à en savoir plus sur ce changement dans [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Audits

En préparation de la mise à niveau Houston, Rocket Pool s'est engagé avec trois des équipes d'audit les plus estimées de l'écosystème Ethereum.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Fin novembre à mi-décembre 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Fin novembre 2023, puis un deuxième tour en mars 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Mi-janvier à avril 2024)

Pour un historique complet des audits plus des détails sur le programme de bug bounty Immunefi, visitez ici :
https://rocketpool.net/protocol/security
