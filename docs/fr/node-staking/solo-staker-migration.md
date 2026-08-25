# Migrer du Solo Staking vers Rocket Pool

::: danger LA CONVERSION DE VALIDATEURS SOLO N'EST PLUS POSSIBLE
La [mise à niveau Saturn 1](/fr/upgrades/saturn-1/whats-new) a supprimé la possibilité de convertir directement un validateur solo existant en validateur Rocket Pool.
Les minipools - y compris les minipools « vacants » qui permettaient la conversion des validateurs solo - ne peuvent plus être créés, et les validateurs megapool ne peuvent être créés que par un nouveau dépôt sur la Beacon Chain.

Pour déplacer votre stake du solo staking vers Rocket Pool, vous devez désormais **sortir votre validateur solo** et **créer de nouveaux validateurs sous un megapool**.
Cette page explique ce qui a changé et vous guide à travers le nouveau processus.
:::

## Ce qui a changé avec Saturn 1

Avant Saturn 1, un solo staker pouvait convertir un validateur actif en minipool Rocket Pool sans le sortir de la Beacon Chain.
Le processus consistait à créer un minipool « vacant » spécial, à changer les identifiants de retrait du validateur des identifiants BLS `0x00` d'origine vers l'adresse du minipool, à passer le scrub check de l'Oracle DAO, puis à promouvoir le minipool.

La mise à niveau Saturn 1 a remplacé les minipools par les [megapools](/fr/node-staking/megapools/overview) comme mode de création des nouveaux validateurs, et la conversion des validateurs solo n'a pas été conservée :

- **La création de minipools est désactivée au niveau du protocole**, y compris les minipools vacants. Il n'existe plus de contrat minipool vers lequel pointer les identifiants de retrait d'un validateur existant.
- **Les validateurs megapool sont créés via la file d'attente de dépôt Rocket Pool** avec un nouveau dépôt sur la Beacon Chain : un prestake de 1 ETH, suivi des 31 ETH restants une fois que le protocole a vérifié on-chain les identifiants de retrait du validateur.
  Un validateur déjà actif ne peut pas passer par ce flux, il n'existe donc aucun mécanisme permettant d'absorber un validateur solo existant dans un megapool.
- Les commandes du Smartnode utilisées pour la conversion (comme `rocketpool node create-vacant-minipool` et `rocketpool minipool promote`) ont été retirées de la CLI.

En bref : aujourd'hui, la seule façon de migrer depuis le solo staking est de **sortir votre validateur de la Beacon Chain et d'utiliser l'ETH retiré pour créer de nouveaux validateurs megapool**.

## Pourquoi migrer ?

La migration n'est pas faite pour tout le monde, mais les validateurs megapool de Rocket Pool bénéficient de plusieurs avantages par rapport aux validateurs de solo staking classiques :

- Ils **perçoivent une commission** sur la portion d'ETH empruntée aux stakers du pool (28 ETH par validateur).
- Votre stake existant de 32 ETH pourrait servir à créer jusqu'à **huit validateurs megapool** (au bond actuel de 4 ETH chacun), percevant une commission sur jusqu'à 224 ETH d'ETH emprunté.
- Ils sont éligibles à la participation au [Smoothing Pool](/fr/node-staking/fee-distrib-sp#the-smoothing-pool), qui mutualise toutes les récompenses de la couche d'exécution (par exemple issues des propositions de blocs et des [récompenses MEV](/fr/node-staking/mev)) et les distribue équitablement entre les participants à chaque intervalle de récompenses.
- Si vous stakez du RPL sur votre megapool, vous gagnerez des [récompenses de voter share](/fr/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (une part des revenus ETH du protocole) en plus des récompenses d'inflation RPL, ainsi qu'un pouvoir de vote dans la [gouvernance du pDAO](/fr/pdao/overview). Le staking de RPL est entièrement optionnel.

Cela dit, il y a des différences importantes à souligner :

- Vous devrez accepter le **risque lié aux smart contracts**, le protocole étant implémenté sous forme d'une série de smart contracts.
- L'opération de nœud classique s'appuie sur la **pile logicielle Smartnode** ; vous devrez accepter les risques liés à l'installation et à l'exécution de ce logiciel sur votre nœud.
- Être opérateur de nœud implique d'apprendre de nouveaux concepts, il y a donc une **courbe d'apprentissage**.
- Les validateurs megapool partagent leurs récompenses avec les stakers du pool : l'adresse de retrait de vos validateurs sera donc votre contrat megapool sur la couche d'exécution, **et non une EOA que vous contrôlez**. Cela s'applique aussi à votre **fee recipient** pour les récompenses de la couche d'exécution.
- **Votre capital ne rapporte rien pendant la transition.** Entre la sortie de votre validateur solo et l'activation de vos validateurs megapool, vous ne percevrez aucune récompense. Les nouveaux validateurs megapool doivent passer par la file d'attente de dépôt Rocket Pool _et_ par la file d'attente de la Beacon Chain avant de commencer à attester ; lisez donc la section **Considérations de timing** ci-dessous avant toute sortie.

Nous vous encourageons à peser soigneusement ces avantages et inconvénients avant de décider de migrer.
Si vous souhaitez poursuivre le processus, les étapes sont décrites ci-dessous.

## Étape 1 : Sortez votre validateur solo

La première étape consiste à sortir votre validateur solo de la Beacon Chain et à retirer son solde :

1. Si votre validateur possède encore des identifiants de retrait BLS `0x00`, vous devez d'abord [les mettre à jour vers des identifiants de retrait de la couche d'exécution](https://launchpad.ethereum.org/en/withdrawals) pointant vers une adresse que vous contrôlez. Sans cela, votre ETH ne pourra pas être retiré après la sortie.
1. Soumettez une **sortie volontaire (voluntary exit)** pour le validateur. Vous pouvez le faire avec votre client de Consensus / Validateur ; consultez la documentation de votre client pour les détails.
1. Attendez que le validateur passe par la file d'attente de sortie de la Beacon Chain et que son solde complet soit balayé vers votre adresse de retrait.

::: warning AVERTISSEMENT
Une sortie volontaire est **irréversible**. Une fois votre validateur sorti, il ne pourra plus jamais valider - le seul retour possible est de créer un nouveau validateur.
Assurez-vous d'avoir lu cette page en entier (en particulier la section **Considérations de timing**) avant de sortir.
:::

[validatorqueue.com](https://www.validatorqueue.com/) est un site utile pour vérifier la longueur actuelle de la file d'attente de sortie de la Beacon Chain.

## Étape 2 : Mettez en place un nœud Rocket Pool

Pendant que vous attendez le traitement de votre sortie, vous pouvez préparer votre nœud Rocket Pool.

Si vous débutez dans l'opération de nœuds Rocket Pool, commencez par le [guide de l'Opérateur de Nœud](/fr/node-staking/responsibilities), qui couvre tout, du choix du matériel à [l'installation de la pile Smartnode](/fr/node-staking/installing/overview) et à [l'enregistrement de votre nœud](/fr/node-staking/prepare-node).
Comme vous exploitiez déjà votre propre validateur, une grande partie vous sera familière - et si vous exécutez déjà vos propres clients d'Exécution et de Consensus, la [configuration hybride avec clients externes](/fr/node-staking/install-modes#the-hybrid-configuration-with-external-clients) pourrait vous intéresser.

## Étape 3 : Créez vos validateurs megapool

Une fois votre ETH retiré en main, vous êtes prêt à créer des validateurs megapool avec `rocketpool megapool deposit`.
Chaque validateur nécessite actuellement un **bond de 4 ETH** et emprunte **28 ETH** au pool de staking : vos 32 ETH de stake retirés pourraient donc financer jusqu'à **huit validateurs megapool**.
Votre contrat megapool est déployé automatiquement lors du dépôt de votre premier validateur, et chaque validateur créé ensuite est géré par ce même megapool.

Le guide [Créer un Megapool (Validateur)](/fr/node-staking/megapools/create-megapool-validator) vous accompagne pas à pas dans tout le processus, y compris le fonctionnement de la file d'attente de dépôt et la confirmation d'un stake réussi.

::: tip NOTE
Contrairement à l'ancien processus de conversion, vos nouveaux validateurs utiliseront de **nouvelles clés de validateur** générées à partir de votre portefeuille Smartnode.
Vos anciennes clés de validateur solo ne sont pas réutilisées, et le Validator Client du Smartnode gérera les nouvelles clés pour vous - il n'y a plus d'étape d'import de clés.
:::

## Considérations de timing

L'ancien processus de conversion n'entraînait aucune interruption : votre validateur continuait d'attester tout du long.
Le nouveau chemin de migration implique, lui, une période d'inactivité ; il vaut donc la peine de comprendre les files d'attente concernées avant de sortir votre validateur solo :

1. **La file d'attente de sortie de la Beacon Chain**, qui détermine la rapidité avec laquelle votre validateur solo peut sortir et être retiré.
1. **La file d'attente de dépôt Rocket Pool**, qui détermine quand vos nouveaux validateurs sont appariés avec l'ETH emprunté du pool de dépôt. Les tickets de la file express ont été distribués aux opérateurs de nœud existants en fonction de l'ETH en bond dans les minipools legacy ; les nouveaux nœuds n'en reçoivent actuellement aucun, donc les validateurs d'un ancien solo staker rejoindront la **file standard**.
1. **La file d'attente de dépôt de la Beacon Chain**, que les validateurs megapool traversent **deux fois** : une fois pour le prestake de 1 ETH, et une seconde fois pour le stake des 31 ETH restants après que le protocole a vérifié les identifiants de retrait du validateur.

Vous ne percevez aucune récompense entre la sortie de votre validateur solo et l'activation de vos validateurs megapool ; vérifiez donc les files d'attente avant de vous engager.

::: tip Liens utiles
[validatorqueue.com](https://www.validatorqueue.com/) est un site utile pour vérifier la longueur de la file d'attente de la Beacon Chain. Cette file dépend de la quantité d'ETH entrant et sortant de la Beacon Chain.
:::

Si la file de dépôt s'avère plus longue que souhaité, vous pouvez [retirer un validateur de la file d'attente de dépôt Rocket Pool](/fr/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) à tout moment avant qu'il ne soit assigné en ETH, et récupérer votre bond sous forme de [crédit de dépôt](/fr/node-staking/megapools/credit), échangeable contre du rETH.

## Alternative : staker sans exploiter de nœud

Si, après avoir pesé le pour et le contre, vous préférez ne pas exploiter de nœud, vous pouvez simplement staker votre ETH retiré avec le [rETH](/fr/liquid-staking/overview) - le jeton de staking liquide de Rocket Pool - et percevoir des récompenses de staking sans matériel, maintenance ni files d'attente de votre côté.
