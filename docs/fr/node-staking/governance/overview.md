---
next:
  text: La DAO de protocole
  link: "/fr/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Vue d'ensemble

Cette section décrit le processus de configuration de votre nœud pour participer aux propositions on-chain et Snapshot. Il y a beaucoup à assimiler, nous vous recommandons donc vivement de lire une vue d'ensemble de la [mise à niveau Houston](/fr/legacy/houston/whats-new). Cela vous aidera à comprendre les dernières fonctionnalités qui permettent la gouvernance on-chain et comment vous pouvez participer à façonner le protocole.

## Prérequis

Avant de configurer votre Smartnode, assurez-vous de :

- Avoir configuré une machine nœud (ou machine virtuelle) et l'avoir sécurisée (via le guide [Sécuriser votre nœud](../securing-your-node))
- Avoir [installé](../installing/overview) et [configuré](../config/overview) le Smartnode dessus
- Avoir un portefeuille de nœud chargé sur votre Smartnode
- Avoir synchronisé vos clients d'exécution et de consensus
- Avoir provisionné votre nœud avec [une adresse de retrait](../prepare-node#setting-your-withdrawal-address), configuré vos [clients de secours](../fallback) (optionnel), opté pour le [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optionnel), et configuré [MEV](../mev)
- Avoir créé au moins un [minipool](../create-validator)

## Trois adresses sont impliquées dans le vote

- Adresse de signalement pDAO — sera utilisée comme votre adresse Snapshot, si vous souhaitez voter directement ou remplacer le vote Snapshot de votre délégué. Cette adresse est uniquement utilisée pour Snapshot, pas pour le vote on-chain.

- Nœud délégué pDAO — si vous choisissez de déléguer votre vote. Vous le définirez sur l'adresse de nœud de votre délégué. Si vous choisissez un délégué, il votera pour vous sur Snapshot et pour les propositions on-chain.

- Adresse de nœud — si vous n'avez pas délégué votre vote ou si vous souhaitez remplacer le vote on-chain de votre délégué, vous pouvez le faire depuis votre nœud.

## Guides

[La Protocol DAO](/fr/legacy/houston/pdao#the-protocol-dao-pdao) explique qui gouverne Rocket Pool et comment la pDAO fonctionne. Cette page vous informera sur la façon dont les tâches pDAO telles que les dépenses de trésorerie peuvent être exécutées on-chain, ainsi que sur le rôle du tout nouveau Security Council. Elle vous guidera également à travers le cycle de vie d'une proposition pDAO et expliquera certaines des mesures prises pour empêcher le spam et bloquer les propositions malveillantes.

[Configuration du vote pour les utilisateurs non-Smartnode](/fr/legacy/houston/nonsmartnode-setup) montre aux utilisateurs non-Smartnode (tels que les utilisateurs Allnodes) comment configurer le vote.

[Initialiser le pouvoir de vote](/fr/legacy/houston/participate#initializing-voting) vous montre comment initialiser le pouvoir de vote de votre nœud. Cette étape n'est requise que si votre nœud a été enregistré avant la mise à niveau Houston.

[Définir votre adresse de signalement Snapshot](/fr/legacy/houston/participate#setting-your-snapshot-signalling-address) vous guidera à travers les étapes pour définir une adresse de signalement. Cela vous permettra de voter sur Snapshot en utilisant le pouvoir de vote de votre nœud sans avoir besoin de charger la clé privée de votre nœud sur un portefeuille chaud. Assurez-vous d'avoir votre CLI Smartnode à portée de main et préparez une adresse (qui n'est pas votre portefeuille de nœud) pour ce guide.

[Déléguer le pouvoir de vote](/fr/legacy/houston/participate#delegating-voting-power) est une commande rapide que vous pouvez utiliser pour déléguer le pouvoir de vote au lieu de voter directement sur les propositions.

[Consulter l'état d'une proposition](/fr/legacy/houston/participate#viewing-the-state-of-a-proposal) est un guide sur la façon de consulter une liste des propositions on-chain passées et en cours. Vous pourrez vérifier l'état et lire les détails de toute proposition on-chain donnée.

[Voter sur une proposition](/fr/legacy/houston/participate#voting-on-a-proposal) vous montre comment voter sur une proposition on-chain. Ce guide passe également en revue les quatre options : **Abstention**, **Pour**, **Contre** et **Veto**.

[Créer une proposition](/fr/legacy/houston/participate#creating-a-proposal) vous guide à travers les exigences et les étapes pour soumettre une proposition on-chain.

[Exécuter une proposition réussie](/fr/legacy/houston/participate#executing-a-successful-proposal) vous montrera comment appliquer les effets d'une proposition réussie au protocole Rocket Pool.

[Réclamer les cautions et récompenses](/fr/legacy/houston/participate#claiming-bonds-and-rewards) discute des conditions dans lesquelles les cautions ou récompenses peuvent être réclamées par un proposant ou un contestataire.

[Créer et réclamer une dépense récurrente de trésorerie](/fr/legacy/houston/participate#creating-a-recurring-treasury-spend) est une fonctionnalité qui donne à la pDAO un contrôle total sur l'ajout, la modification et la suppression des paiements récurrents.
