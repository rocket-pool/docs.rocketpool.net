---
next:
  text: La DAO de Protocole
  link: "/fr/pdao/pdao"
---

# Vue d'ensemble

Cette section décrit le processus de configuration de votre nœud pour participer aux propositions on-chain et snapshot. Il y a beaucoup à déballer, nous recommandons donc fortement de lire un aperçu de la [Mise à niveau Houston](/fr/legacy/houston/whats-new). Cela vous aidera à comprendre les dernières fonctionnalités qui permettent la gouvernance on-chain et comment vous pouvez participer à façonner le protocole.

## Prérequis

Avant de configurer votre Smartnode, assurez-vous d'avoir :

- Configuré une machine de nœud (ou machine virtuelle) et sécurisé celle-ci (via le guide [Sécuriser votre nœud](/fr/node-staking/securing-your-node))
- [Installé](/fr/node-staking/installing/overview) et [configuré](/fr/node-staking/config/overview) le Smartnode dessus
- Chargé un portefeuille de nœud sur votre Smartnode
- Synchronisé vos clients Execution et Consensus
- Provisionné votre nœud avec [une adresse de retrait](/fr/node-staking/prepare-node#setting-your-withdrawal-address), configuré vos [clients de secours](/fr/node-staking/fallback) (optionnel), opté pour le [Smoothing Pool](/fr/node-staking/fee-distrib-sp#the-smoothing-pool) (optionnel), et configuré [MEV](/fr/node-staking/mev)
- Créé au moins un [minipool](/fr/node-staking/create-validator)

## Il y a trois adresses impliquées dans le vote

- Adresse de signalisation pDAO — sera utilisée comme votre adresse snapshot, si vous souhaitez voter directement ou si vous souhaitez remplacer le vote snapshot de votre délégué. Cette adresse est uniquement utilisée pour snapshot et non pour le vote on-chain.

- Nœud délégué pDAO — si vous choisissez de déléguer votre vote. Vous définirez ceci à l'adresse de nœud de votre délégué. Si vous choisissez un délégué, il votera pour vous sur snapshot et pour les propositions on-chain.

- Adresse de nœud — si vous n'avez pas délégué votre vote ou si vous souhaitez remplacer le vote on-chain de votre délégué, vous pouvez le faire depuis votre nœud.

## Guides

[La DAO de Protocole](/fr/pdao/pdao) discute de qui et comment la pDAO gouverne Rocket Pool. Cette page vous informera sur la façon dont les tâches de la pDAO telles que les dépenses du trésor peuvent être exécutées on-chain, ainsi que le rôle du tout nouveau Conseil de Sécurité. Elle vous guidera également à travers le cycle de vie d'une proposition pDAO et expliquera certaines des mesures prises pour prévenir le spam et éliminer les propositions malveillantes.

[Configuration du vote pour les utilisateurs non-smartnode](/fr/legacy/houston/nonsmartnode-setup) montre aux utilisateurs non-smartnode (tels que les utilisateurs Allnodes) comment configurer le vote.

[Initialiser le pouvoir de vote](/fr/pdao/participate#initializing-voting) vous montre comment initialiser le pouvoir de vote de votre nœud. Cette étape n'est requise que si votre nœud a été enregistré avant la mise à niveau Houston.

[Définir votre adresse de signalisation snapshot](/fr/pdao/participate#setting-your-snapshot-signalling-address) vous guidera à travers les étapes pour définir une adresse de signalisation. Cela vous permettra de voter sur snapshot en utilisant le pouvoir de vote de votre nœud sans avoir besoin de charger la clé privée de votre nœud sur un portefeuille actif. Assurez-vous d'avoir votre CLI Smartnode à portée de main et préparez une adresse (qui n'est pas votre portefeuille de nœud) pour ce guide.

[Déléguer le pouvoir de vote](/fr/pdao/participate#delegating-voting-power) est une commande rapide que vous pouvez utiliser pour déléguer le pouvoir de vote au lieu de voter directement sur les propositions.

[Voir l'état d'une proposition](/fr/pdao/participate#viewing-the-state-of-a-proposal) est un guide sur la façon dont vous pouvez voir une liste des propositions on-chain passées et en cours. Vous pourrez vérifier l'état et lire les détails de toute proposition on-chain donnée.

[Voter sur une proposition](/fr/pdao/participate#voting-on-a-proposal) vous montre comment voter sur une proposition on-chain. Ce guide couvre également les quatre options : **Abstention**, **Pour**, **Contre**, et **Veto**.

[Créer une proposition](/fr/pdao/participate#creating-a-proposal) vous guide à travers les exigences et les étapes pour créer une proposition on-chain.

[Exécuter une proposition réussie](/fr/pdao/participate#executing-a-successful-proposal) vous montrera comment appliquer les effets d'une proposition réussie au protocole Rocket Pool.

[Réclamer les cautions et récompenses](/fr/pdao/participate#claiming-bonds-and-rewards) discute des conditions dans lesquelles les cautions ou récompenses peuvent être réclamées par un proposeur ou un contestataire.

[Créer et réclamer une dépense récurrente du trésor](/fr/pdao/participate#creating-a-recurring-treasury-spend) est une fonctionnalité qui donne à la pDAO un contrôle total sur l'ajout, la modification et la suppression de paiements récurrents.
