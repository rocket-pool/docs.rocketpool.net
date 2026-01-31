---
next:
  text: Monitoring your Node's Performance
  link: "/fr/node-staking/performance"
---

# Vue d'Ensemble

Dans cette section, vous apprendrez comment surveiller la santé de votre nœud et de vos validateurs, suivre vos gains et effectuer une maintenance périodique telle que les mises à jour.

## Prérequis

Avant de configurer votre Smartnode, assurez-vous d'avoir :

- Configuré une machine de nœud (ou machine virtuelle) et sécurisé celle-ci (via le guide [Sécuriser votre Nœud](../securing-your-node))
- [Installé](../installing/overview) et [configuré](../config/overview) le Smartnode dessus
- Chargé un portefeuille de nœud sur votre Smartnode
- Synchronisé vos clients Execution et Consensus
- Provisionné votre nœud avec [une adresse de retrait](../prepare-node.mdx#setting-your-withdrawal-address), configuré vos [clients de secours](../fallback) (optionnel), opté pour le [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optionnel), et configuré [MEV](../mev.mdx)
- Créé au moins un [minipool](../create-validator.mdx)

## Guides

[Surveiller les Performances de votre Nœud](../performance) fournit des outils et des tutoriels pour garder un œil sur la santé de votre nœud (du point de vue des ressources, comme la consommation de CPU et de RAM) et les performances de vos validateurs sur la Beacon Chain.
Il couvre beaucoup d'outils fondamentaux que vous utiliserez pendant votre mandat en tant que validateur Ethereum.

[Configuration du Tableau de Bord Grafana](../grafana.mdx) explique comment configurer le tracker de métriques de la stack Smartnode et le tableau de bord Grafana - un guichet unique pour surveiller tout ce qui concerne votre nœud et vos validateurs, et un incontournable dans l'arsenal de chaque opérateur de nœud.
Nous recommandons _fortement_ d'explorer le tableau de bord Grafana et de le consulter régulièrement.

[Notifications d'Alertes de la Stack Smartnode](./alerting.md) explique comment utiliser la fonctionnalité de notification d'alerte du Smartnode pour recevoir des notifications sur la santé et les événements importants de votre Rocket Pool Smartnode.

[Vérifier les Mises à Jour](../updates) couvre les processus cruciaux de mise à jour régulière de votre nœud avec de nouveaux correctifs de sécurité, comment mettre à jour le Smartnode après une nouvelle version, et comment mettre à jour manuellement les versions des clients si vos clients de choix publient une nouvelle version que la dernière version du Smartnode n'inclut pas encore.
Vous devriez vous familiariser avec toute cette section, car vous pourriez avoir besoin de vous y référer chaque fois qu'une mise à jour est publiée.

[Sauvegarder votre Nœud](../backups) est un guide optionnel qui décrit comment sauvegarder la configuration de votre nœud et ses données de chaîne en cas de panne matérielle.

[Élagage du Client Execution](../pruning) est **important** pour quiconque exécute un client Execution qui consomme progressivement tout l'espace disque de votre SSD et nécessite un élagage périodique (tel que Geth ou Nethermind) pour récupérer une partie de cet espace.
Si vous exécutez l'un de ces clients, vous devriez certainement vous familiariser avec le processus d'élagage.

[Changer de Clients Execution ou Consensus](../change-clients) est un guide utile ; il décrit le processus de changement de votre/vos choix de client(s) et ce à quoi on peut s'attendre pendant le processus.
C'est un autre bon guide avec lequel vous familiariser, au cas où vous auriez à changer de clients pour une raison quelconque à l'avenir.
