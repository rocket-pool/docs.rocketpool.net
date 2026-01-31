# La mise à jour Redstone de Rocket Pool

La prochaine mise à jour majeure de Rocket Pool, intitulée **Redstone**, a été publiée pour des tests bêta sur les réseaux de test Ropsten et Holesky.
Cette page décrit les changements majeurs apportés par Redstone, incluant les mises à jour de la pile Smartnode et du protocole Rocket Pool en général.

Veuillez lire attentivement cette page pour comprendre toutes les différences entre la version précédente de Rocket Pool et Redstone.

::: tip ATTENTION
Pour des informations détaillées sur la façon de préparer votre nœud pour la mise à jour et que faire après la mise à jour, veuillez consulter les guides suivants :

- [Guide pour le mode Docker](./docker-migration.mdx)
- [Guide pour le mode Hybride](./hybrid-migration.mdx)
- [Guide pour le mode Natif](./native-migration.mdx)

:::

## Changements des clients et The Merge

Ropsten (et bientôt, Holesky) a réussi **The Merge des couches d'exécution et de consensus**.
Il n'utilise plus la preuve de travail ; à la place, les validateurs sur Ropsten sont maintenant responsables de créer et proposer des blocs sur les deux chaînes.
Bien que cela apporte des avantages financiers intéressants (qui seront discutés plus tard), cela s'accompagne également de changements importants dans la façon dont les validateurs opèrent.

Voici un bref résumé des changements de comportement des clients dans le cadre de The Merge :

- Votre client d'exécution utilise maintenant trois ports API :
  - Un pour l'accès HTTP à son API (**défaut 8545**)
  - Un pour l'accès Websocket à son API (**défaut 8546**)
  - Un pour la nouvelle **Engine API** utilisée par les clients de consensus après The Merge (**défaut 8551**)

- Les clients d'exécution nécessitent maintenant un client de consensus pour fonctionner, et les clients de consensus nécessitent maintenant un client d'exécution pour fonctionner.
  - **Aucun des deux ne peut plus fonctionner de manière isolée.**

- Un client d'exécution doit être lié à un, et un seul, client de consensus (et vice versa).
  - Vous ne pourrez pas lier plusieurs clients d'exécution à un seul client de consensus, ou plusieurs clients de consensus à un seul client d'exécution.
  - En raison de cela, **les clients d'exécution de secours ne sont plus disponibles** pour les opérateurs de nœuds Rocket Pool.

- **Des clients d'exécution complets** sont requis.
  - Les fournisseurs distants (comme Infura et Pocket) ne peuvent plus être utilisés par aucun validateur, Rocket Pool ou autre.

## Destinataires de frais et votre distributeur

Étant donné que les validateurs sont maintenant responsables de la création de blocs, cela signifie qu'ils reçoivent les **frais prioritaires** (également appelés **tips**) attachés à chaque transaction.
Ces frais sont payés en ETH, et ils vous sont fournis directement chaque fois qu'un de vos validateurs de minipool propose un bloc.
Contrairement à l'ETH verrouillé sur la Beacon Chain, **vous n'avez pas à attendre les retraits pour accéder à vos frais prioritaires** !
Ils vous sont simplement attribués dans le cadre du processus de proposition de bloc.

Pour savoir où envoyer les frais, votre client de validation nécessite un paramètre supplémentaire appelé `fee recipient`.
Il s'agit de l'adresse sur la couche d'exécution (ETH1) où tous les frais prioritaires gagnés par votre nœud lors des propositions de blocs seront envoyés.

Rocket Pool est conçu pour distribuer équitablement ces récompenses, de la même manière qu'il distribue équitablement vos récompenses de la Beacon Chain : la moitié de tous les frais prioritaires que vos validateurs de minipool gagnent ira à vous (plus la commission moyenne de tous vos minipools), et l'autre moitié ira aux stakers du pool (moins votre commission moyenne).

À cette fin, le Smartnode définira automatiquement le `fee recipient` de votre client de validation à une adresse spéciale appelée votre **distributeur de frais** de nœud.
Votre distributeur de frais est un contrat unique sur la couche d'exécution qui est **spécifique à votre nœud**.
Il contiendra tous les frais prioritaires que vous avez gagnés au fil du temps, et contient la logique nécessaire pour les diviser et les distribuer équitablement.
Ce processus de distribution est contrôlé par vous (l'opérateur de nœud), et peut être effectué quand vous le souhaitez.
Il n'y a pas de limite de temps.

L'adresse du distributeur de frais de votre nœud est **déterminée de manière déterministe en fonction de l'adresse de votre nœud**.
Cela signifie qu'elle est connue à l'avance, avant même que le distributeur de frais ne soit créé.
**Le Smartnode utilisera cette adresse comme votre destinataire de frais.**

::: tip NOTE
Par défaut, votre destinataire de frais sera défini sur l'**adresse rETH** lorsque vous installez Smartnode v1.5.0 (si les mises à jour du contrat Redstone n'ont pas encore été déployées).
Le Smartnode mettra automatiquement à jour cela vers l'adresse du distributeur de frais de votre nœud une fois que la mise à jour Redstone aura été déployée.

Une exception à cette règle est si vous avez adhéré au **Smoothing Pool** - voir la section à la fin de cette page pour plus d'informations à ce sujet.
:::

Les nouveaux nœuds Rocket Pool initialiseront automatiquement le contrat de distributeur de leur nœud lors de l'enregistrement.
Les nœuds existants devront effectuer ce processus manuellement.
Cela ne doit être exécuté qu'une seule fois.

Une ramification intéressante de cela est que l'adresse de votre distributeur peut commencer à accumuler un solde **avant** que vous n'ayez initialisé votre contrat de distributeur de nœud.
C'est normal, car votre distributeur aura accès à tout ce solde existant dès que vous l'initialiserez.

Vous pouvez voir le solde de votre distributeur de frais dans :

```shell
rocketpool node status
```

La sortie ressemblera à ceci :

![](../../node-staking/images/status-fee-distributor.png)

Pour initialiser le distributeur de votre nœud, exécutez simplement cette nouvelle commande :

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTE
Après la mise à jour Redstone, vous devez appeler cette fonction avant de pouvoir créer de nouveaux minipools avec `rocketpool node deposit`.
:::

Lorsque votre distributeur a été initialisé, vous pouvez réclamer et distribuer la totalité de son solde en utilisant la commande suivante :

```shell
rocketpool node distribute-fees
```

Cela enverra votre part des récompenses à votre **adresse de retrait**.

## Changements du protocole Rocket Pool

En plus des changements des clients d'exécution et de consensus et des nouveaux frais prioritaires, le protocole Rocket Pool lui-même a subi des changements importants dont vous devriez être au courant.

### Nouveau système de récompenses

L'un des changements les plus significatifs introduits avec la mise à jour Redstone est le **nouveau système de récompenses**.
Il s'agit d'une refonte complète de la façon dont les opérateurs de nœuds reçoivent leurs récompenses RPL (et ETH du Smoothing Pool - discuté plus tard).

L'_ancien_ système de récompenses présentait les inconvénients suivants :

- La réclamation coûtait environ 400k de gas, ce qui est assez cher.
- Les opérateurs de nœuds devaient réclamer les récompenses à chaque intervalle (tous les 28 jours), ou les perdaient. Cela signifiait que les coûts de gas pouvaient devenir prohibitifs pour les opérateurs de nœuds avec de petites quantités de RPL.
- Les récompenses étaient déterminées au moment de la _réclamation_, et non au moment du point de contrôle. Si un utilisateur stakait une quantité importante de RPL entre le point de contrôle et votre réclamation, vos récompenses pouvaient être diluées et vous receviez moins de RPL que prévu.

Le _nouveau_ système de réclamation résout tous ces problèmes.

À chaque intervalle, l'Oracle DAO créera collectivement un **véritable instantané** de l'état des opérateurs de nœuds dans le réseau Rocket Pool, incluant tous leurs montants de stake effectifs.
Ces informations sont compilées dans un [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) - une manière extrêmement efficace de rendre tous les détails disponibles aux contrats intelligents.
Le Merkle Tree est construit dans un fichier JSON et hébergé sur le [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System), et la racine du Merkle Tree est soumise aux contrats.

Ce nouveau système présente les caractéristiques suivantes :

- Vous pouvez maintenant **laisser les récompenses s'accumuler** aussi longtemps que vous le souhaitez. Plus de limite de temps pour réclamer.
- Vous pouvez réclamer **plusieurs intervalles** en une seule fois.
- Votre première transaction de réclamation utilise environ 85k de gas. Chaque transaction de réclamation ultérieure coûte environ 55k de gas.
  - Si vous réclamez plusieurs intervalles à la fois, chaque intervalle supplémentaire coûte **6k de gas**, il est donc plus rentable de réclamer autant d'intervalles que possible en une seule fois.
- Vos récompenses RPL **ne sont plus diluées** - vos récompenses RPL sont fixées au moment de l'instantané, et vous êtes toujours éligible pour ce montant.
- Vous pouvez **re-staker une partie (ou la totalité) de vos récompenses RPL** dans le cadre de la transaction de réclamation, ce qui réduit encore les exigences en gas par rapport à aujourd'hui.
- Actuellement, **toutes vos réclamations doivent être sur Mainnet** mais nous avons l'infrastructure en place pour construire la capacité de réclamer sur les réseaux de couche 2 à une date ultérieure.

Lorsque votre nœud détecte un nouveau point de contrôle de récompenses, il téléchargera automatiquement le fichier JSON pour cet intervalle.
Vous pouvez ensuite examiner vos récompenses en utilisant la commande suivante :

```shell
rocketpool node claim-rewards
```

Au fil des intervalles et de l'accumulation de récompenses, la sortie ressemblera à ceci :

![](../../node-staking/images/claim-rewards-gb.png)

Ici, vous pouvez rapidement voir combien de récompenses vous avez gagnées à chaque intervalle, et pouvez décider lesquelles vous voulez réclamer.
Notez que **le temps d'intervalle de Ropsten est fixé à 1 jour pour faciliter les tests.**

Vous pouvez également spécifier un montant que vous souhaitez re-staker lors de cette réclamation :

![](../../node-staking/images/autostake.png)

Cela vous permettra de composer vos récompenses RPL en une seule transaction, en utilisant beaucoup moins de gas qu'actuellement.

::: tip NOTE
Si vous préférez construire le point de contrôle de récompenses manuellement au lieu de télécharger celui créé par l'Oracle DAO, vous pouvez changer ce paramètre de `Download` à `Generate` dans le TUI :

![](../../node-staking/images/tui-generate-tree.png)

Comme l'indique l'astuce, vous aurez besoin d'un accès à un nœud d'archive pour cela.
Si votre client d'exécution local n'est pas un nœud d'archive, vous pouvez en spécifier un séparé (comme Infura ou Alchemy) dans la case `Archive-Mode EC URL` en dessous.
Cette URL ne sera utilisée que lors de la génération d'arbres Merkle ; elle ne sera pas utilisée pour les tâches de validation.
:::

::: danger WARNING
Si vous êtes en dessous de 10% de collatéral RPL _au moment de l'instantané_, vous ne serez pas éligible aux récompenses pour cet instantané.
Contrairement au système actuel, où vous pouvez simplement "compléter" avant de réclamer pour redevenir éligible, cela sera verrouillé dans cet instantané pour toujours et **vous ne recevrez jamais de récompenses pour cette période**.
Vous **devez** être au-dessus de 10% de collatéral au moment d'un instantané pour recevoir des récompenses pour cette période.
:::

### Smoothing Pool

Une dernière nouvelle fonctionnalité passionnante de la mise à jour Redstone est le **Smoothing Pool**.
Le Smoothing Pool est **une fonctionnalité optionnelle** qui mettra collectivement en commun les frais prioritaires de chaque membre qui y a adhéré.
Lors d'un point de contrôle de récompenses, le solde total ETH du pool est divisé en une portion pour les stakers du pool et une portion pour les opérateurs de nœuds.
Toutes les récompenses de la portion opérateur de nœud sont **distribuées équitablement à chaque membre du pool**.

En substance, le Smoothing Pool est un moyen d'éliminer efficacement le caractère aléatoire associé aux propositions de blocs sur la Beacon Chain.
Si vous avez déjà eu une série de malchance et passé des mois sans proposition, vous pourriez trouver le Smoothing Pool très intéressant.

::: tip NOTE
Les récompenses du Smoothing Pool sont intégrées dans le Merkle Tree utilisé pour les récompenses RPL, vous les réclamez donc en même temps que vous réclamez RPL en utilisant `rocketpool node claim-rewards`.
:::

Pour clarifier les détails, le Smoothing Pool utilise les règles suivantes :

- L'adhésion au Smoothing Pool se fait au **niveau du nœud**. Si vous adhérez, tous vos minipools sont inscrits.

- La part totale de l'opérateur de nœud est déterminée par la commission moyenne de chaque minipool dans chaque nœud inscrit au Smoothing Pool.

- N'importe qui peut adhérer à tout moment. Ils doivent attendre un intervalle de récompenses complet (1 jour sur Ropsten, 28 jours sur Mainnet) avant de se désinscrire pour éviter de jouer avec le système.
  - Une fois désinscrit, vous devez attendre un autre intervalle complet pour vous réinscrire.

- Le Smoothing Pool calcule la "part" de chaque minipool (portion de l'ETH du pool pour l'intervalle) détenue par chaque nœud inscrit.
  - La part est une fonction de la performance de votre minipool pendant l'intervalle (calculée en examinant combien d'attestations vous avez envoyées sur la Beacon Chain, et combien vous avez manquées), et du taux de commission de votre minipool.

- La part totale de votre nœud est la somme de vos parts de minipool.

- La part totale de votre nœud est mise à l'échelle par le temps où vous étiez inscrit.
  - Si vous étiez inscrit pour l'intervalle complet, vous recevez votre part complète.
  - Si vous étiez inscrit pour 30% d'un intervalle, vous recevez 30% de votre part complète.

Pour adhérer au Smoothing Pool, exécutez la commande suivante :

```shell
rocketpool node join-smoothing-pool
```

Cela vous enregistrera comme inscrit dans les contrats Rocket Pool et changera automatiquement le `fee recipient` de votre client de validation du contrat de distributeur de votre nœud au contrat Smoothing Pool.

Pour quitter le pool, exécutez cette commande :

```shell
rocketpool node leave-smoothing-pool
```

### Le système de pénalités

Pour s'assurer que les opérateurs de nœuds ne "trichent" pas en modifiant manuellement le destinataire de frais utilisé dans leur client de validation, Rocket Pool emploie un système de pénalités.

L'Oracle DAO surveille en permanence chaque bloc produit par les opérateurs de nœuds Rocket Pool.
Tout bloc qui a un destinataire de frais autre que l'une des adresses suivantes est considéré comme **invalide** :

- L'adresse rETH
- L'adresse Smoothing Pool
- Le contrat de distributeur de frais du nœud (si désinscrit du Smoothing Pool)

Un minipool qui propose un bloc avec un destinataire de frais **invalide** recevra **un avertissement**.
Au troisième avertissement, le minipool commencera à recevoir des **infractions** - chaque infraction retirera **10% de son solde total de Beacon Chain, incluant les gains ETH** et les enverra aux stakers du pool rETH lors du retrait des fonds du minipool.

Les infractions sont au niveau du **minipool**, et non au niveau du **nœud**.

Le logiciel Smartnode est conçu pour s'assurer que les utilisateurs honnêtes ne seront jamais pénalisés, même s'il doit mettre le client de validation hors ligne pour le faire.
Si cela se produit, vous cesserez d'attester et verrez des messages d'erreur dans vos fichiers journaux expliquant pourquoi le Smartnode ne peut pas définir correctement votre destinataire de frais.

## Guides pour avant et après la mise à jour

Pour des informations détaillées sur la façon de préparer votre nœud pour la mise à jour et que faire après la mise à jour, veuillez consulter les guides suivants :

- [Guide pour le mode Docker](./docker-migration.mdx)
- [Guide pour le mode Hybride](./hybrid-migration.mdx)
- [Guide pour le mode Natif](./native-migration.mdx)
