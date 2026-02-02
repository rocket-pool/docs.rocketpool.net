::: danger WARNING
Les dépôts de minipool sont actuellement désactivés en préparation de Saturn 1.
:::

# Conversion d'un Validateur Solo en Minipool

Lorsque la Beacon Chain a été lancée pour la première fois, les validateurs ont été créés avec une paire spéciale de clés cryptographiques - la **clé de validateur** et la **clé de retrait**.

La clé de validateur est une "clé chaude", ce qui signifie qu'elle doit être stockée sur une machine active connectée à Internet ; c'est la clé utilisée pour signer vos attestations et propositions, et sert également d'adresse sur la Beacon Chain (la chaîne hexadécimale utilisée pour identifier votre validateur).

La clé de retrait, en revanche, est une "clé froide" ce qui signifie qu'elle ne doit _pas_ (et en fait, _ne devrait pas_) être stockée sur une machine active connectée à Internet.
Elle est destinée à être verrouillée dans un stockage froid pour qu'elle ne puisse pas être accessible jusqu'à ce qu'elle soit nécessaire.
Contrairement à la clé de validateur, la clé de retrait n'est pas du tout responsable des tâches de validation.
Au lieu de cela, son seul travail est de gérer le retrait des fonds de votre validateur sur la Beacon Chain (une fois que les retraits avaient été implémentés).

Ce système à double clé était l'architecture initiale avec laquelle la Beacon Chain a été lancée.
À l'époque, ni le Merge ni les retraits n'avaient été conçus, mais ce système était considéré comme suffisamment robuste pour gérer quelle que soit la forme que prendrait le protocole lorsque les deux seraient implémentés.

Avançons rapidement jusqu'à aujourd'hui, et maintenant nous avons une bien meilleure compréhension du fonctionnement des retraits.
Heureusement, ils ont été implémentés d'une manière qui permet à un validateur de staking solo existant sur la Beacon Chain (qui utilise les anciennes informations d'identification de clé de retrait) de se convertir **directement en minipool Rocket Pool** sans avoir besoin de sortir le validateur de la Beacon Chain !

Si vous souhaitez en savoir plus sur ce processus, ce guide est pour vous.
Nous expliquerons comment les retraits fonctionnent sur Ethereum à un niveau élevé, expliquerons comment fonctionne le processus de conversion, et terminerons par une procédure détaillée sur la façon de convertir votre validateur en minipool.

## Pourquoi Convertir ?

Avant d'entrer dans les détails techniques, une question très importante à laquelle répondre est _pourquoi_ un staker solo envisagerait ce processus en premier lieu.
La conversion en minipool n'est pas pour tout le monde, mais cette section vous aidera à faire un choix éclairé quant à savoir si c'est quelque chose que vous aimeriez poursuivre.

Les minipools Rocket Pool bénéficient de plusieurs avantages par rapport aux validateurs de staking solo conventionnels :

- Ils **gagnent une commission** sur la partie de l'ETH qu'ils empruntent aux stakers du pool (24 ETH).
- Votre caution existante de 32 ETH pourrait être utilisée pour créer jusqu'à **trois validateurs supplémentaires** (en plus de celui que vous avez déjà).
- Ils sont éligibles à la participation dans la [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) qui met en commun toutes les récompenses de la couche d'exécution (par exemple, des propositions de blocs et [récompenses MEV](./mev.mdx)) et les distribue équitablement entre les participants lors de chaque intervalle de récompenses.
- Si vous misez du RPL, ils gagneront une commission bonus et des récompenses d'inflation RPL (qui fournissent actuellement un APR plus élevé que les récompenses de staking ETH).

Cela étant dit, il y a quelques différences importantes à souligner :

- Vous devrez accepter le **risque de contrat intelligent**, car le protocole est implémenté sous forme d'une série de contrats intelligents.
- De même, l'exploitation de nœud conventionnelle exploite la **pile Smartnode** ; vous devrez accepter tous les risques associés à l'installation et à l'exécution de ce logiciel sur votre nœud.
- Être un opérateur de nœud implique d'apprendre de nouveaux concepts, il y a donc une **courbe d'apprentissage** associée à en devenir un.
- Les minipools sont tenus de partager leurs récompenses avec les stakers du pool, donc l'adresse de retrait du validateur sera un contrat intelligent sur la couche d'exécution, **pas une EOA que vous contrôlez**. Cela s'applique également à votre **destinataire de frais** pour les récompenses de la couche d'exécution, qui doit également être un contrat intelligent pouvant partager équitablement vos récompenses.
- L'**Oracle DAO** de Rocket Pool est responsable du transfert d'informations de la Beacon Chain vers la couche d'exécution, et de la détection des violations que le protocole ne peut pas appliquer (comme une adresse de destinataire de frais illégale). Exécuter un minipool signifie que vous devrez faire confiance à l'Oracle DAO pour faire ce travail correctement.

Nous vous encourageons à examiner attentivement ces avantages et inconvénients avant de décider de convertir votre validateur solo.
Si vous souhaitez poursuivre le processus, veuillez lire les sections suivantes.

## Prérequis

Pour commencer le processus de conversion, vous devrez répondre aux critères suivants :

1. Vous devez avoir [un nœud enregistré sur le réseau Rocket Pool](./prepare-node.mdx) pour héberger le nouveau minipool.
1. Le validateur que vous souhaitez migrer doit être **actif** sur la Beacon Chain. Il ne peut pas être en attente, slashé, en sortie / sorti, ou retiré.
1. Le validateur doit avoir un solde d'**au moins 32 ETH** sur la Beacon Chain.
1. Le validateur doit avoir [des informations d'identification de retrait de clé BLS](https://launchpad.ethereum.org/en/withdrawals) (informations d'identification `0x00`). La conversion **ne peut pas** être effectuée sur des validateurs qui ont déjà migré vers d'autres informations d'identification de retrait de la couche d'exécution (informations d'identification `0x01`).
1. (Facultatif) Si vous avez l'intention que le Smartnode migre automatiquement les informations d'identification de retrait pour vous, vous devez avoir votre **phrase mnémonique à portée de main**.

Si aucune de ces conditions ne vous bloque, vous êtes éligible pour commencer la conversion de validateur.

## Aperçu du Processus

La première étape consiste à **créer un nouveau minipool "vacant"**.
Contrairement aux minipools conventionnels, qui créent un nouveau validateur lors de leur création, les minipools vacants sont des minipools spéciaux conçus pour gérer des validateurs _existants_.
En conséquence, les minipools vacants se comportent légèrement différemment des minipools conventionnels pendant la phase `prelaunch`.
Une fois l'initialisation terminée et qu'ils entrent dans la phase `staking`, ils deviennent des minipools conventionnels.

Lors de la création du minipool vacant, vous aurez la possibilité de faire en sorte que le Smartnode **modifie automatiquement les informations d'identification de retrait de votre validateur** de l'ancienne clé de retrait BLS vers la nouvelle adresse de minipool vacant.
Si vous ne voulez pas le faire maintenant, vous pouvez faire en sorte que le Smartnode le fasse plus tard avec une commande dédiée, ou vous pouvez le faire vous-même avec un outil tiers.
Notez que la modification des informations d'identification de retrait du validateur vers l'adresse du minipool est **requise** pour la conversion, donc quelle que soit la façon dont vous le faites, cela devra être fait pour que le processus se termine avec succès.

Une fois que les informations d'identification de retrait ont été modifiées, vous aurez la possibilité d'**importer la clé privée du validateur** dans le client validateur géré par le Smartnode.
Si vous souhaitez que le Smartnode maintienne le validateur pour que vous n'ayez pas à gérer le vôtre, c'est une option attractive.
Si vous préférez maintenir votre propre client validateur et garder les clés là-bas, vous êtes libre de le faire.

À ce stade, votre nouveau minipool entrera dans la période de **vérification de nettoyage**, où l'Oracle DAO analysera continuellement les informations de votre validateur sur la Beacon Chain pour confirmer qu'il reste légal.
Cela inclut :

- Les informations d'identification de retrait n'ont pas encore été migrées (sont toujours les informations d'identification de clé BLS originales `0x00`) ou ont été migrées vers l'adresse du minipool. Les migrer vers toute autre adresse de la couche d'exécution entraînera le nettoyage du pool.
  - Si les informations d'identification de retrait sont toujours les informations d'identification de clé BLS originales `0x00` au moment où la période de vérification de nettoyage se termine, le pool sera nettoyé.
- Le validateur est dans l'état de staking actif pendant toute la durée de la vérification. S'il passe à l'état slashé, sorti ou retiré, le pool sera nettoyé.

::: tip NOTE
Un minipool vacant **nettoyé** signifie qu'il ne fait pas partie du réseau Rocket Pool, mais il vous donnera toujours (l'opérateur de nœud) accès à tous vos fonds via les méthodes typiques de récupération de jetons dans la CLI.
Les fonds **ne sont pas perdus** si les minipools vacants sont nettoyés.
Plus d'informations sur les minipools nettoyés, leurs ramifications et comment les utiliser sont incluses plus loin dans ce guide.
:::

Après le passage de la vérification de nettoyage, vous pourrez **promouvoir** votre minipool vacant.
Cela terminera la conversion et le changera d'un minipool vacant en un minipool normal.
À ce stade, le minipool agira comme tous les autres minipools sur le réseau, et votre validateur solo sera officiellement converti en validateur Rocket Pool !

Dans le cadre du processus, le réseau prendra un instantané de vos récompenses totales sur la Beacon Chain (et dans votre nouveau minipool, si vous êtes écrémé pendant la vérification de nettoyage).
Il reconnaîtra que toutes ces récompenses vous appartiennent et ne devraient pas être partagées avec le pool de staking, il les fournira donc toutes sous forme de **remboursement** que vous pouvez réclamer à tout moment une fois la promotion terminée.

Ci-dessous se trouve une procédure détaillée du processus de conversion, y compris des instructions pour chaque étape.

## Étape 1 : Création d'un Minipool Vacant

Pour commencer le processus de conversion, exécutez la commande suivante avec la CLI Smartnode :

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Par exemple, si vous vouliez convertir un validateur solo avec la clé publique `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`, vous exécuteriez :

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Vous verrez un bref résumé de ce à quoi vous attendre pendant le processus, puis vous serez invité à choisir le montant de caution que vous souhaitez utiliser lors de la création de ce minipool :

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

Une fois que vous sélectionnez **8 ETH**, vous convertirez votre validateur en minipool avec une caution de 8 ETH.
Votre dépôt original de 32 ETH sera converti en un dépôt de 8 ETH, avec 24 ETH empruntés aux stakers du pool.
Une fois le processus de conversion terminé, vous aurez un [solde de crédit](./credit) de 24 ETH que vous pourrez utiliser pour créer plus de minipools.

Une fois que vous sélectionnez une option, le Smartnode effectuera quelques vérifications pour confirmer que le validateur que vous avez entré et votre nœud répondent tous deux à toutes les exigences préalables énumérées ci-dessus.
Après cela, il vous demandera de confirmer votre prix du gaz puis de soumettre la transaction pour créer le nouveau minipool vacant.
Lors de la création, vous recevrez l'adresse du minipool :

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

C'est l'adresse que vous utiliserez lors de la modification des informations d'identification de retrait de votre validateur.

À ce stade, le Smartnode vous demandera si vous souhaitez que le Smartnode le fasse automatiquement (ainsi que d'importer la clé privée du validateur dans le client validateur géré par le Smartnode, ce qui est discuté plus tard) :

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Si vous répondez `y` à cette question, le Smartnode effectuera automatiquement les étapes 2 et 3 ; veuillez consulter la section [Modification Automatique des Informations d'Identification de Retrait et Import de Clé](#automatic-withdrawal-credential-change-and-key-import) ci-dessous.

Si vous répondez `n` à cette question, la commande se terminera et vous aurez terminé l'étape 1.
Veuillez passer à la section [Étape 2](#step-2-changing-the-validators-withdrawal-credentials) suivante.

::: tip NOTE
Si vous refusez ce processus maintenant, vous pouvez le reprendre ultérieurement en utilisant la CLI.
Lisez les sections [**Étape 2**](#step-2-changing-the-validators-withdrawal-credentials) et [**Étape 3**](#optional-step-3-import-the-validator-key) ci-dessous pour apprendre comment faire cela.
:::

### Modification Automatique des Informations d'Identification de Retrait et Import de Clé

::: danger WARNING
Si vous choisissez de faire en sorte que le Smartnode modifie automatiquement vos informations d'identification de retrait et importe la clé privée de votre validateur, il est **essentiel** que vous supprimiez la clé de validateur de votre ancien client validateur que vous gérez vous-même, et **arrêtiez l'ancien client validateur** pour vous assurer qu'il n'a plus la clé chargée en mémoire.

Vous devez également attendre **au moins 15 minutes** après cela pour vous assurer qu'il a **intentionnellement manqué au moins deux attestations**.
Vous pouvez vérifier cela en consultant un explorateur de chaîne tel que [https://beaconcha.in](https://beaconcha.in).

Si vous n'attendez pas au moins 15 minutes, votre validateur **SERA SLASHÉ** lorsque le client validateur du Smartnode commencera à attester avec la clé de votre validateur !

Nous vous recommandons fortement d'activer **la détection de doppelganger** dans la configuration du Smartnode également, pour être aussi en sécurité que possible contre le risque de slashing.
:::

Si vous choisissez d'importer automatiquement la clé de validateur et de modifier les informations d'identification de retrait vers l'adresse du minipool, le Smartnode vous demandera d'abord le mnémonique utilisé pour générer à la fois la clé privée BLS de votre validateur et sa clé de retrait originale correspondante :

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Après l'avoir entré, le Smartnode dérivera votre ancienne clé de retrait basée sur BLS en utilisant le mnémonique et la clé publique du validateur.
Il soumettra ensuite un message à la Beacon Chain, signé par votre clé de retrait, indiquant que vous souhaitez modifier les informations d'identification de retrait de l'ancienne clé de retrait BLS vers la nouvelle adresse de minipool :

```
Changing withdrawal credentials to the minipool address... done!
```

Enfin, il importera la clé de votre validateur dans le client validateur du Smartnode et vous demandera si vous souhaitez le redémarrer, afin qu'il commence à valider avec cette clé :

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Avec cela, les étapes 2 et 3 ont été terminées.
Vous pouvez vérifier que les informations d'identification de retrait ont été correctement modifiées et que la clé valide activement en utilisant un explorateur de chaîne tel que [https://beaconcha.in](https://beaconcha.in)

Passez à la section [Étape 4](#step-4-waiting-for-the-scrub-check) pour en savoir plus sur la vérification de nettoyage.

## Étape 2 : Modification des Informations d'Identification de Retrait du Validateur

Lorsque vous avez créé le nouveau minipool vacant, l'étape suivante consiste à modifier les informations d'identification de retrait de votre validateur des anciennes informations d'identification de clé BLS `0x00` vers les nouvelles informations d'identification `0x01` qui contiennent la nouvelle adresse de minipool.

Il existe deux façons de faire cela :

1. En utilisant la CLI Smartnode, via la commande `rocketpool minipool set-withdrawal-creds`.
1. En utilisant un outil tiers externe tel que [ethdo](https://github.com/wealdtech/ethdo).

Dans ce guide, nous allons parcourir comment utiliser la méthode 1 (le Smartnode).
Pour plus d'informations sur la méthode 2, veuillez consulter la documentation de l'outil que vous souhaitez utiliser.

Commencez par exécuter la commande suivante :

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Par exemple, si la nouvelle adresse de minipool vacant était `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, vous exécuteriez ceci :

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Le Smartnode vous demandera ensuite le mnémonique utilisé pour générer à la fois la clé de votre validateur et sa clé de retrait correspondante :

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Après cela, il effectuera quelques vérifications de sécurité pour s'assurer que les informations d'identification de retrait de votre validateur peuvent être modifiées.
Si cela réussit, il soumettra ensuite un message à la Beacon Chain, signé par votre clé de retrait, indiquant que vous souhaitez modifier les informations d'identification de retrait de l'ancienne clé de retrait BLS vers la nouvelle adresse de minipool :

```
Changing withdrawal credentials to the minipool address... done!
```

C'est tout !
Vous pouvez vérifier que les informations d'identification de retrait ont été correctement modifiées en utilisant un explorateur de chaîne tel que [https://beaconcha.in](https://beaconcha.in).

## (Facultatif) Étape 3 : Importer la Clé de Validateur

Une fois que vous convertissez votre validateur en minipool, vous voudrez peut-être que le client validateur du Smartnode l'exécute au lieu de celui que vous gérez actuellement vous-même.
Cela présente quelques avantages :

- C'est "plus propre" d'un point de vue organisationnel (le Smartnode gère vos minipools, votre client validateur géré en externe gère vos validateurs de staking solo).
- Cela permet aux commandes comme `rocketpool minipool exit` (commandes qui nécessitent votre clé de validateur pour signer des messages) de fonctionner.

Cependant, il y a quelques **considérations très importantes** à comprendre avant de faire cela :

- Vous **devez vous assurer** que la clé de votre validateur a été supprimée de votre propre client validateur, et que vous avez attendu au moins 15 minutes après l'avoir supprimée avant de l'importer dans le Smartnode. Voir l'encadré d'avertissement ci-dessous.
- Vous **devez vous assurer** que vous avez votre keystore de validateur _et son fichier de mot de passe_ sauvegardés, car des commandes comme `rocketpool wallet recover` et `rocketpool wallet rebuild` **ne peuvent pas** les régénérer sans sauvegarde car ils n'ont pas été dérivés du mnémonique du portefeuille Smartnode.

Si vous souhaitez importer votre clé de validateur dans le Smartnode, continuez la lecture ci-dessous.

::: danger WARNING
Si vous choisissez de faire importer la clé privée de votre validateur par le Smartnode, il est **essentiel** que vous supprimiez la clé de validateur de votre ancien client validateur que vous gérez vous-même, et **arrêtiez l'ancien client validateur** pour vous assurer qu'il n'a plus la clé chargée en mémoire.

Vous devez également attendre **au moins 15 minutes** après cela pour vous assurer qu'il a **intentionnellement manqué au moins deux attestations**.
Vous pouvez vérifier cela en consultant un explorateur de chaîne tel que [https://beaconcha.in](https://beaconcha.in).

Si vous n'attendez pas au moins 15 minutes, votre validateur **SERA SLASHÉ** lorsque le client validateur du Smartnode commencera à attester avec la clé de votre validateur !

Nous vous recommandons fortement d'activer **la détection de doppelganger** dans la configuration du Smartnode également, pour être aussi en sécurité que possible contre le risque de slashing.
:::

Commencez par exécuter la commande suivante :

```
rocketpool minipool import-key <minipool address>
```

Par exemple, si la nouvelle adresse de minipool vacant était `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, vous exécuteriez ceci :

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Le Smartnode vous demandera ensuite le mnémonique utilisé pour générer la clé de votre validateur :

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Après cela, il parcourra les différentes clés générées à partir de ce mnémonique jusqu'à ce qu'il trouve la clé publique de votre validateur.
Il l'importera ensuite et vous demandera si vous souhaitez redémarrer le client validateur du Smartnode afin qu'il charge votre clé :

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Avec cela, votre clé de validateur est maintenant importée dans le Smartnode et vous devriez la voir commencer à attester.
Vous pouvez confirmer en suivant les journaux du client validateur avec cette commande :

```
rocketpool service logs validator
```

Vous pouvez également vérifier qu'un explorateur de chaîne tel que [https://beaconcha.in](https://beaconcha.in) peut voir votre client validateur attester avec la clé de votre validateur.

## Étape 4 : Attribuer le Bon Destinataire de Frais

Une fois que vous avez commencé le processus de migration, il est **impératif** que vous vous assuriez que votre [destinataire de frais](./fee-distrib-sp#fee-recipients) est défini correctement (soit sur le [distributeur de frais](./fee-distrib-sp#your-fee-distributor) de votre nœud ou sur la [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) si vous y avez opté).
Si vous ne le faites pas et le laissez sur le destinataire de frais pour vos validateurs solo, vous serez pénalisé et une partie de votre mise Beacon Chain sera déduite pour compenser la perte.

::: tip NOTE
**Cette étape est uniquement requise si vous laissez votre clé de validateur dans votre propre client validateur géré en externe.**

Si vous la supprimez de votre propre VC et l'importez dans le VC géré par Rocket Pool, votre destinataire de frais sera automatiquement attribué à la bonne adresse par le processus `node`.
:::

Comme vous pouvez conserver d'autres clés de staking solo dans votre VC que vous ne voulez _pas_ définir sur le distributeur de frais ou la Smoothing Pool, le seul moyen d'accomplir cela est d'utiliser un fichier de configuration VC pour définir manuellement le destinataire de frais pour le validateur en cours de migration.

Ce processus dépend du client de consensus que vous utilisez ; consultez la documentation pour les détails spécifiques mais voici quelques liens utiles :

[Lighthouse : via `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** ne prend actuellement pas en charge la définition de destinataires de frais spécifiques à un validateur. Veuillez ne pas utiliser Lodestar si vous conservez la clé dans votre VC géré en externe avec d'autres clés solo qui ne sont pas migrées.

[Nimbus : via l'API keymanager](https://nimbus.guide/keymanager-api.html)

[Prysm : via `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku : via `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Si vous utilisez eth-docker, vous pouvez utiliser la commande [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) pour définir des destinataires individuels pour chaque clé que vous utilisez comme décrit dans leur documentation.

## Étape 5 : Attente de la Vérification de Nettoyage

À ce moment, vous devriez avoir terminé les étapes 1 et 2 (création du minipool vacant et modification des informations d'identification de retrait de votre validateur) et optionnellement l'étape 3 (import de la clé dans le Smartnode).
L'étape suivante consiste à attendre que la **vérification de nettoyage** se termine.
Il s'agit d'un processus effectué par l'Oracle DAO pour vérifier ce qui suit :

1. Le solde de votre validateur sur la Beacon Chain (et le solde de votre minipool sur la couche d'exécution) doit totaliser **au moins** le solde que votre validateur avait lorsque vous avez d'abord créé le minipool vacant, moins un petit tampon de 0,01 ETH pour tenir compte de toutes attestations manquées accidentelles pendant la maintenance.

- Par exemple, si votre validateur avait un solde Beacon Chain de 35 ETH lorsque vous avez effectué l'étape 1, les soldes combinés Beacon Chain et minipool doivent être **au moins** 34,99 ETH pendant toute la durée de la vérification de nettoyage.

2. Votre validateur doit rester dans le statut de **staking actif** pendant toute la vérification de nettoyage - il ne peut pas être slashé, sorti ou retiré.
3. Les informations d'identification de retrait de votre validateur doivent être soit les **informations d'identification de clé de retrait basées sur BLS originales**, soit les **nouvelles informations d'identification 0x01 utilisant l'adresse du minipool**. Toutes autres informations d'identification entraîneront le nettoyage du minipool.

- Vous disposez d'un délai de grâce d'**environ 2 jours et demi** pour effectuer la modification des informations d'identification de retrait (85% de la durée de 3 jours de la période de nettoyage).

La vérification de nettoyage est transitoire ; vous n'avez rien à faire pendant ce temps autre que de garder votre validateur en ligne et performant bien.

Pour surveiller combien de temps il reste dans la vérification de nettoyage, vous pouvez consulter les journaux du `node` avec la commande suivante :

```
rocketpool service logs node
```

Les lignes pertinentes ressembleront à ceci :

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

Cela durera **3 jours**, après quoi vous aurez réussi et pourrez passer à [Étape 6](#step-6-promoting-the-minipool) pour promouvoir le minipool vacant en un minipool complet.

### Travailler avec des Minipools Nettoyés

Si votre minipool échoue malheureusement à la vérification de nettoyage et est dissous, ne vous inquiétez pas - votre capital n'est pas perdu.
Les minipools vacants dissous agissent essentiellement comme des adresses de retrait simplifiées :

- Ils ne font techniquement pas partie du réseau Rocket Pool.
- Tout capital déposé dans le minipool appartient _uniquement_ à l'opérateur de nœud. Il ne se partage _pas_ avec les stakers du pool.
- Vous ne recevez pas de crédit de dépôt pour la création du minipool.

Vous pouvez accéder au solde du minipool à tout moment avec la commande suivante :

```shell
rocketpool minipool distribute-balance
```

Cela enverra le solde entier du minipool à l'adresse de retrait de votre nœud.

Lorsque vous avez fait sortir votre validateur de la Beacon Chain et que son solde complet a été envoyé au minipool, vous pouvez le récupérer et fermer le minipool avec la commande suivante :

```shell
rocketpool minipool close
```

Une fois de plus, cela enverra le solde complet du minipool à l'adresse de retrait de votre nœud.

## Étape 6 : Promotion du Minipool

Lorsque la vérification de nettoyage a été passée avec succès, vous pouvez promouvoir le minipool vacant en minipool complet.
Cela peut être fait de deux façons :

1. Laisser le processus `node` le gérer automatiquement dès que la vérification de nettoyage se termine.
1. Le faire manuellement en utilisant la CLI.

La première méthode promouvra le minipool pour vous automatiquement, en supposant que vous avez le processus / conteneur `node` en cours d'exécution et que le coût du gaz du réseau est inférieur au seuil de transaction automatisée que vous avez spécifié dans le processus de configuration Smartnode (par défaut de 150).
Dans les journaux du `node`, vous verrez une sortie comme la suivante :

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

Si votre processus `node` est désactivé, vous pouvez utiliser la deuxième méthode via la commande suivante :

```shell
rocketpool minipool promote
```

À partir de là, sélectionnez simplement votre minipool vacant dans la liste des minipools éligibles à la promotion et soumettez la transaction.

## Réclamation de vos Récompenses Originales Pré-Conversion

Lors de la promotion, votre minipool entrera dans le statut `staking` et est officiellement devenu un minipool Rocket Pool normal.
Vous pouvez consulter les détails avec cette commande :

```shell
rocketpool minipool status
```

Cela vous montrera le statut de votre nouveau minipool, ses soldes, son remboursement, etc.
Par exemple :

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Ici, vous pouvez voir les informations importantes suivantes :

- `Node deposit` montre combien d'ETH vous avez personnellement cautionné dans le cadre de ce minipool (dans ce cas, 8 ETH).
- `RP deposit` montre combien d'ETH vous avez emprunté aux stakers du pool pour créer le minipool (dans ce cas, 24 ETH).
- `Available refund` montre combien du solde du minipool vous revient directement (n'est _pas_ partagé avec les stakers du pool. Cela correspond à toutes vos récompenses sur la Beacon Chain au moment où vous avez créé le minipool vacant.
- `Minipool Balance (EL)` montre le solde total du contrat minipool.
- `Your portion (EL)` montre combien du solde vous appartient _après_ avoir soustrait le remboursement du solde du minipool. En d'autres termes, c'est votre part des récompenses que vous avez gagnées _après_ avoir créé le minipool vacant.
- `Total EL rewards` est votre remboursement plus vos récompenses post-conversion.

Pour réclamer votre remboursement, exécutez la commande suivante :

```shell
rocketpool minipool refund
```

Sélectionnez simplement votre minipool dans la liste, approuvez la transaction, et votre remboursement sera envoyé à l'adresse de retrait de votre nœud.

## Utilisation de votre Crédit de Nœud

Maintenant que vous avez un minipool promu actif, vous remarquerez que votre nœud a un solde de crédit lorsque vous exécutez `rocketpool node status` :

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

Dans cet exemple, puisque nous avons converti la caution de validateur originale de 32 ETH en minipool de 8 ETH, nous avons reçu [**24 ETH en crédit**](./credit).
Ce crédit peut être utilisé pour créer de nouveaux minipools et validateurs gratuitement !

Exécutez simplement la commande `rocketpool node deposit`, et sélectionnez le montant de caution que vous souhaitez utiliser.
S'il y a assez d'ETH dans votre solde de crédit pour couvrir la caution, il sera utilisé automatiquement et vous n'aurez pas à miser d'ETH supplémentaire (bien que vous deviez toujours payer le gaz).

::: warning NOTE
L'ETH utilisé pour votre solde de crédit provient du pool de staking.
Si le pool de staking n'a pas assez d'ETH pour couvrir votre solde de crédit, vous ne pourrez pas l'utiliser jusqu'à ce que plus d'ETH ait été déposé.
:::
