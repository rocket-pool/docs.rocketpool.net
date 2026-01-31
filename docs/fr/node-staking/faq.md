# FAQ (WIP)

### Quels sont les avantages d'exécuter des minipools avec Rocket Pool par rapport à un validateur solo de 32 ETH ?

En exécutant un seul validateur solo, vous recevriez 100 % des récompenses sur vos 32 ETH.
En exécutant deux minipools de 16 ETH, vous recevriez 100 % des récompenses sur vos 32 ETH **plus** 14 % des récompenses sur 32 ETH fournis par le protocole Rocket Pool.
En exécutant quatre minipools de 8 ETH, vous recevriez 100 % des récompenses sur vos 32 ETH **plus** 14 % des récompenses sur 96 ETH fournis par le protocole Rocket Pool.
Vous auriez également la possibilité d'utiliser la fonctionnalité [Smoothing Pool](./prepare-node.mdx#smoothing-pool) de Rocket Pool.

### Comment savoir combien vaut mon rETH ? Est-ce qu'il rebase ?

Le jeton rETH ne rebase pas.
Le nombre de jetons sur votre portefeuille restera constant mais ils prennent de la valeur au fil du temps.

### J'ai un problème technique lors de l'exécution de mon nœud, comment obtenir de l'aide ?

Vous pouvez commencer par consulter la page [Rocket Pool Support](https://rocketpool.support).
Si cela ne vous aide pas, vous pouvez poser votre question sur le canal **#support** de Rocket Pool sur [le serveur Discord](https://discord.gg/rocketpool).

### Comment puis-je obtenir de l'ETH de test pour expérimenter la création et l'exécution d'un minipool ? Je ne peux pas publier de messages sur le canal faucet.

Voir [Obtenir de l'ETH de test sur Hoodi](../testnet/overview#getting-test-eth-on-hoodi).

### Comment récupérer mon nœud si ma machine tombe en panne ?

Réponse courte : votre mnémonique est tout ce dont vous avez besoin pour récupérer entièrement votre nœud.
Assurez-vous toujours de le garder en sécurité.

Pour récupérer votre nœud sur une nouvelle machine, commencez par vous assurer que **votre machine précédente ne sera plus en ligne** avec les clés disponibles, car deux nœuds fonctionnant avec les mêmes clés **vous feront slasher**.
Suivez les [étapes](./install-modes) pour installer le Smartnode sur une nouvelle machine.
Ensuite, récupérez votre portefeuille de nœud et vos clés de validateur en exécutant la commande `rocketpool wallet recover` et insérez votre mnémonique de 24 mots.

### Pourquoi mes clients ne se synchronisent-ils pas ? J'ai un faible nombre de pairs.

Les clients ont besoin d'un nombre sain de pairs pour pouvoir se synchroniser correctement.
Vous pouvez commencer par exécuter le test [ici](https://www.yougetsignal.com/tools/open-ports/), en vérifiant si les ports 30303 et 9001 sont ouverts.
S'ils sont fermés, vous devrez configurer le transfert de port sur votre routeur.
Assurez-vous également que votre nœud a une adresse IP locale statique afin que le transfert de port ne se casse pas en raison de l'obtention d'une nouvelle adresse par votre nœud.

### Mon client de consensus met trop de temps à se synchroniser. Que dois-je faire ?

Les clients de consensus peuvent prendre beaucoup de temps à se synchroniser si vous n'avez pas démarré le processus de synchronisation en utilisant [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Même si vous l'exécutez depuis longtemps, il est généralement plus rapide de configurer l'URL de synchronisation de checkpoint, d'effacer les données de synchronisation actuelles avec `rocketpool service resync-eth2` et de recommencer.
Votre client devrait être synchronisé en moins d'une minute.

### J'ai déjà redémarré. Pourquoi Grafana dit-il que je dois encore redémarrer ?

Les informations de redémarrage sont mises en cache et ne se mettent à jour que toutes les quelques heures.
L'exécution de `sudo apt update` forcera une mise à jour.

### J'ai changé ma couche d'exécution et/ou ma Beacon Chain ou couche de consensus. Comment nettoyer les anciennes données ?

Si vous changez de clients, Rocketpool ne supprime pas les anciens volumes. Ces données pourraient gaspiller un espace disque important et vous voudrez peut-être les supprimer. Pour ce faire, vous devez trouver les volumes. Si vous utilisez les paramètres Rocketpool par défaut, les volumes docker sont stockés à `/var/lib/docker/volumes/`. La couche d'exécution est dans `rocketpool_eth1clientdata/_data/*` et la couche de consensus est dans `rocketpool_eth2clientdata/_data/*`.

Pour accéder à ces répertoires, vous devrez peut-être vous connecter en tant que root en utilisant `sudo -i`. Ensuite, vous pouvez supprimer un répertoire en appelant `rm -rf <directory>`. Par exemple, si vous vouliez supprimer toutes les données geth, vous appelleriez `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`.

Pour quitter en tant que root, tapez `exit`.
