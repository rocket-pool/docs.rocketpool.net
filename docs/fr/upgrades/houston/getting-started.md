# Démarrage rapide Houston

Que vous soyez un opérateur de nœud chevronné, un détenteur de rETH ou un observateur curieux, cette page vous aidera à commencer à explorer les nouvelles fonctionnalités incluses dans Houston.

##

### Initialisation du pouvoir de vote

Tout d'abord et avant tout, l'étape la plus importante si vous êtes **opérateur de nœud** est d'[initialiser le vote](../houston/participate#initializing-voting) pour déverrouiller votre pouvoir de vote. Les nœuds qui ont initialisé le vote sont inclus lors du calcul du pouvoir de vote total du réseau.

À la genèse de Houston, le vote pDAO est désactivé jusqu'à ce qu'un nombre suffisant de nœuds aient initialisé le vote. Ceci afin d'empêcher des propositions malveillantes de passer alors que le pouvoir de vote total et le quorum sont faibles. Après qu'assez de nœuds aient initialisé le vote, un interrupteur sera activé et pDAO aura la barre.

Pour initialiser le pouvoir de vote, utilisez cette commande dans le smartnode :

```shell
rocketpool pdao initialize-voting
```

Vous n'avez besoin de le faire qu'une seule fois. L'initialisation du vote garantira que le pouvoir de vote de votre nœud est inclus dans les futures propositions on-chain et vous permettra de voter sur celles-ci.

### Définir votre adresse de signalisation Snapshot

Deuxièmement, vous voudrez définir votre adresse de signalisation Snapshot. Cela permet aux opérateurs de nœuds de participer aux votes Snapshot dans leur navigateur ou appareil mobile sans avoir à exposer leurs clés de nœud à un portefeuille chaud.

La configuration implique quelques étapes, vous voudrez donc suivre ce guide :
[Définir votre adresse de signalisation Snapshot](../houston/participate#setting-your-snapshot-signalling-address).

### Déléguer le pouvoir de vote on-chain

Si vous souhaitez déléguer le pouvoir de vote on-chain à un membre de la communauté de votre choix, cliquez [ici](../houston/participate#delegating-voting-power) pour apprendre comment.

##

# Guides

[Aperçu complet de Houston](../houston/whats-new) présente le Protocol DAO entièrement on-chain et introduit de nouvelles fonctionnalités telles que le staking ETH au nom d'un nœud, la définition d'une adresse de retrait RPL et les soumissions de solde et RPL basées sur le temps. Les audits des contrats intelligents Houston peuvent également être trouvés ici.

[Le Protocol DAO](../houston/pdao) discute de qui et comment le pDAO gouverne Rocket Pool. Cette page vous informera sur la façon dont les tâches pDAO telles que les dépenses du trésor peuvent être exécutées on-chain, ainsi que sur le rôle du tout nouveau Security Council. Elle vous guidera également à travers le cycle de vie d'une proposition pDAO et expliquera certaines des mesures prises pour prévenir le spam et abattre les propositions malveillantes.

[Participer aux propositions](../houston/participate) inclut un guide détaillé étape par étape sur la façon dont les opérateurs de nœuds peuvent participer aux propositions pDAO. Si vous souhaitez soumettre une proposition on-chain, voter ou déléguer le pouvoir de vote, c'est le guide qu'il vous faut.

[Staker de l'ETH au nom d'un nœud](../houston/stake-eth-on-behalf.mdx) passe en revue les étapes pour staker de l'ETH au nom d'un nœud. C'est une nouvelle fonctionnalité introduite dans Houston pour faciliter les scénarios de dépositaire unique. Nous vous guiderons sur la façon de le faire sur un testnet si vous voulez l'essayer avant de staker de l'ETH réel sur le mainnet.

[Adresse de retrait RPL](../houston/rpl-withdrawal-address) vous montre comment définir une adresse de retrait RPL pour votre nœud. Ceci est utile si vous souhaitez permettre à une entité séparée de fournir la garantie d'assurance RPL pour un nœud.
