---
next:
  text: Réclamation des Récompenses d'Opérateur de Nœud
  link: "/fr/node-staking/rewards"
---

# Vue d'Ensemble

Cette section couvre comment accéder aux récompenses que votre nœud génère pendant la validation.

## Prérequis

Avant de configurer votre Smartnode, assurez-vous de :

- Avoir configuré une machine de nœud (ou machine virtuelle) et l'avoir sécurisée (via le guide [Sécurisation de votre Nœud](../securing-your-node))
- Avoir le Smartnode [installé](../installing/overview) et [configuré](../config/overview) dessus
- Avoir un portefeuille de nœud chargé sur votre Smartnode
- Synchronisé vos clients d'exécution et de consensus
- Provisionné votre nœud avec [une adresse de retrait](../prepare-node.mdx#setting-your-withdrawal-address), configuré vos [clients de secours](../fallback) (optionnel), opté pour le [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optionnel), et configuré [MEV](../mev.mdx)
- Créé au moins un [minipool](../create-validator.mdx)

## Guides

[Réclamation des Récompenses d'Opérateur de Nœud](../rewards) explique comment fonctionnent les récompenses RPL et les récompenses de la couche d'exécution, et comment y accéder.

[Distribution des Récompenses Écrémées](../skimming) couvre l'accès aux récompenses de la Beacon Chain qui sont périodiquement "écrémées" par le protocole et livrées à vos minipools.
