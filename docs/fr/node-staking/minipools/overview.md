---
next:
  text: Créer un nouveau minipool (validateur)
  link: "/fr/node-staking/create-validator"
---

::: danger AVERTISSEMENT
Les dépôts de minipool sont actuellement désactivés en préparation de Saturn 1.
:::

# Vue d'ensemble

Cette section couvre les processus de création et de migration des minipools (validateurs Rocket Pool).
C'est ici que vous apprendrez comment commencer à valider le réseau Ethereum et gagner des récompenses.

## Prérequis

Avant d'exécuter des minipools, assurez-vous de :

- Avoir configuré une machine nœud (ou machine virtuelle) et l'avoir sécurisée (via le guide [Sécuriser votre nœud](../securing-your-node))
- Avoir [installé](../installing/overview) et [configuré](../config/overview) le Smartnode dessus
- Avoir un portefeuille de nœud chargé sur votre Smartnode
- Avoir synchronisé vos clients d'exécution et de consensus
- Avoir provisionné votre nœud avec [une adresse de retrait](../prepare-node.mdx#setting-your-withdrawal-address), configuré vos [clients de secours](../fallback) (optionnel), opté pour le [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optionnel), et configuré [MEV](../mev.mdx)

## Guides

[Créer un nouveau minipool (validateur)](../create-validator.mdx) explique le processus de création d'un nouveau minipool Rocket Pool et du validateur correspondant sur la Beacon Chain.
Que vous créiez votre tout premier minipool ou que vous en ayez déjà et souhaitiez en créer un autre, ce guide vous guidera étape par étape.

[Le délégué de minipool](./delegates) explique ce qu'est le contrat de minipool et introduit le contrat **délégué** qui contient la majeure partie de ses fonctionnalités.
Il montre également comment mettre à jour le délégué pour vos minipools après une mise à niveau du réseau pour profiter de nouvelles fonctionnalités.

[Convertir un validateur solo en minipool](../solo-staker-migration) décrit le processus de conversion d'un validateur existant en dehors de Rocket Pool (comme celui utilisé pour le staking solo) directement en minipool Rocket Pool sans avoir besoin de quitter la Beacon Chain et créer un nouveau minipool.
Si vous êtes un staker solo qui souhaite profiter de cette capacité, c'est le guide qu'il vous faut !

[Migrer un minipool de 16 ETH à 8 ETH](../leb-migration.mdx) montre comment réduire le montant d'ETH cautionné pour un minipool de 16 ETH à 8 ETH, vous donnant 8 ETH de crédit qui peuvent être utilisés pour créer un nouveau minipool gratuitement (bien qu'il en coûte toujours de l'ETH pour le gas, bien sûr).

[Le système de crédit de dépôt](../credit) couvre le système de "crédit ETH" qui vous permet de créer de nouveaux minipools sans avoir à payer pour leurs cautions ETH après avoir effectué l'une des migrations ci-dessus.
