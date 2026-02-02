# Configuration de vote pour les utilisateurs non-smartnode

Certains utilisateurs (par exemple, les utilisateurs Allnodes) n'utilisent pas le smartnode et peuvent avoir besoin de configurer le vote en utilisant l'interaction directe avec les contrats.
Ce guide contient à la fois un guide de configuration minimal et un guide de configuration complet pour ces utilisateurs.

::: tip
Votre adresse de nœud devrait être chargée sur un portefeuille matériel pour cela.
:::

## Guide de configuration minimal

Cela permet à votre délégué de voter pour vous on-chain et off-chain. Vous pourrez remplacer votre délégué on-chain, mais pas off-chain.

- Utilisez etherscan pour initialiser le pouvoir de vote ("Connect to Web3" avec l'adresse du nœud) avec un délégué https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Vous pouvez trouver des délégués sur https://delegates.rocketpool.net/

## Guide de configuration complet

Utilisez etherscan pour initialiser le pouvoir de vote ("Connect to Web3" avec l'adresse du nœud)

- [recommandé pour la plupart] Initialisez le vote avec un nœud différent comme délégué https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Vous pouvez trouver des délégués sur https://delegates.rocketpool.net/
  - N'oubliez pas que vous pourrez toujours remplacer vos délégués
- Initialisez le vote avec votre propre nœud comme délégué https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Ici, vous serez responsable de voter à chaque fois
  - Je suggérerais principalement cette option pour les personnes qui souhaitent être des délégués car elles _doivent_ voter à chaque fois.
- Si votre nœud a été enregistré après Houston :
  - Vous aurez déjà votre pouvoir de vote initialisé avec votre propre nœud comme délégué
  - Vous pouvez définir un nouveau délégué avec https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Définir l'adresse de signalement Snapshot :

- Allez sur https://node.rocketpool.net/signalling-address et connectez votre adresse de nœud
  - Entrez votre adresse de signalement Snapshot souhaitée et signez le message pour obtenir les arguments r, s et v dont vous aurez besoin
  - Note : votre adresse de signalement Snapshot NE DOIT PAS être votre adresse de nœud
- Dans un nouvel onglet, allez sur https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Connect to Web3" avec l'adresse du nœud
  - Remplissez les arguments avec votre adresse de signalement et les paramètres r, s, v donnés à l'étape précédente
