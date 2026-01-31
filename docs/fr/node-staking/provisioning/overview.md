---
next:
  text: Starting Rocketpool
  link: "/fr/node-staking/starting-rp"
---

# Vue d'ensemble

Cette section couvre les détails de la façon de provisionner votre nœud pour le staking avec Rocket Pool une fois que vous avez installé et configuré le Smartnode.
C'est une section longue car il y a beaucoup d'informations sur le staking à couvrir, donc **veuillez lire chaque guide avant de créer votre premier minipool !**

## Prérequis

Avant de provisionner votre nœud pour le staking, veuillez vous assurer que vous avez fait ce qui suit :

- Configuré une machine de nœud (ou machine virtuelle) et l'avoir sécurisée (via le guide [Securing your Node](../securing-your-node))
- Avoir le Smartnode [installé](../installing/overview) et [configuré](../config/overview) dessus

## Guides

[Starting Rocket Pool](../starting-rp) vous montrera comment démarrer les services du Smartnode pour chaque mode et comment vérifier la progression de synchronisation de vos clients d'exécution et de consensus.

[Creating a New Wallet](../wallet-init) vous guide à travers le processus de création d'un tout nouveau portefeuille avec le Smartnode si c'est la première fois que vous configurez un nœud.

[Importing / Recovering an Existing Wallet](../recovering-rp.mdx) est une alternative à la création d'un nouveau portefeuille.
Utilisez ce guide si vous avez déjà un portefeuille de nœud que vous souhaitez récupérer sur votre nœud (ou si vous migrez d'un service comme Allnodes vers votre propre matériel).

[Preparing your Node for Operation](../prepare-node.mdx) couvre quelques premières étapes importantes que vous voudrez suivre une fois que vous avez un portefeuille chargé sur votre nœud, bien avant de le financer avec de l'ETH ou du RPL (autre qu'une petite quantité d'ETH pour les frais de gas, bien sûr).

[Specifying a Fallback Node](../fallback) vous guide à travers le processus optionnel de pointer votre nœud vers une deuxième paire de clients d'exécution et de consensus (gérée en externe) qui peut agir comme une sauvegarde pour vos clients principaux s'ils tombent en panne, afin que votre nœud puisse continuer à valider pendant que vous effectuez la maintenance sur eux.

[Fee Distributors and the Smoothing Pool](../fee-distrib-sp) discutent de la façon dont les récompenses de la couche d'exécution sont fournies à votre nœud chaque fois qu'un de vos validateurs propose un bloc, comment collecter ces récompenses, et décrit la **Smoothing Pool** de Rocket Pool - une fonctionnalité populaire qui combine les récompenses de la couche d'exécution de tout le monde et les distribue uniformément lors des intervalles de récompenses réguliers de Rocket Pool.

[MEV, MEV-Boost, and MEV Rewards](../mev.mdx) explique la **Maximum-Extractable Value** (MEV), son rôle dans l'écosystème de staking, et comment vous pouvez la configurer à votre goût en utilisant le Smartnode.
