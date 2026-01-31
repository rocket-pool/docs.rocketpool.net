::: danger AVERTISSEMENT
Les dépôts de minipool sont actuellement désactivés en préparation de Saturn 1.
:::

# Le système de crédit de dépôt

Le système de crédit de dépôt est un mécanisme permettant de suivre l'ETH qui était précédemment lié par les Node Operators mais qui n'est plus requis et de le rendre à nouveau disponible pour utilisation.
La source de ce crédit provient de deux endroits :

- [Migrer un minipool existant avec caution de 16 ETH vers un minipool avec caution de 8 ETH](./leb-migration.mdx) (ce qui ajoute 8 ETH au solde de crédit du Node Operator)
- [Migrer un validateur solo existant](./solo-staker-migration) vers un minipool (ce qui ajoute soit 16 soit 24 ETH au solde de crédit du Node Operator, selon le type de minipool créé lors de la migration)

Chaque Node Operator commence avec un solde de crédit de **0 ETH**.
L'une ou l'autre de ces deux actions augmentera ce solde en conséquence.

Cet ETH n'est _pas_ rendu liquide et retourné au Node Operator ; au lieu de cela, il peut être utilisé pour **créer des minipools supplémentaires** sans nécessiter d'ETH de la part du Node Operator.

Le système de crédit est **transparent** pour le Node Operator ; il sera automatiquement utilisé (avec des notifications dans la CLI Smartnode expliquant qu'il sera utilisé) lors des opérations `rocketpool node deposit` ou `rocketpool node create-vacant-minipool` si possible.
S'il _ne peut pas_ être utilisé, le Smartnode alertera l'utilisateur qu'il ne peut pas être utilisé et nécessitera une caution ETH normale lors de l'une ou l'autre opération.

Consultez la section [Disponibilité du crédit](#credit-availability) ci-dessous pour plus de détails.

## Un exemple

Disons que vous avez un solde de crédit de 0 ETH, et un seul minipool avec une caution de 16 ETH.
Vous pouvez alors [migrer ce minipool vers une caution de 8 ETH](./leb-migration.mdx).
Cela entraînera **8 ETH** qui ne sont plus liés.
Ces 8 ETH seront placés dans votre **solde de crédit**.

Maintenant, disons que vous voulez créer un _deuxième_ minipool de 8 ETH.
Vous exécutez `rocketpool node deposit` comme d'habitude, et sélectionnez 8 ETH comme montant de caution.
Cela nécessite normalement que vous fournissiez 8 de vos propres ETH pour le minipool.
Cependant, comme vous avez un solde de crédit de 8 ETH, Rocket Pool **l'utilisera automatiquement à la place** :

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

Le deuxième ensemble de lignes ici est pertinent : elles vous indiquent que vous avez suffisamment d'ETH dans votre solde de crédit pour couvrir ce dépôt _et qu'il est disponible pour utilisation_, il utilisera donc automatiquement le solde et ne nécessitera aucun ETH supplémentaire de votre portefeuille de nœud.

Consultez [la section disponibilité ci-dessous](#credit-availability) pour plus de détails sur la disponibilité du solde de crédit.

## Voir votre solde de crédit actuel

Pour voir votre solde de crédit actuel, exécutez simplement la commande suivante :

```shell
rocketpool node status
```

Cela produit une liste complète de détails sur votre nœud, y compris son solde de crédit tout en haut :

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Disponibilité du crédit

Dans certaines situations, votre nœud peut avoir un solde de crédit disponible mais ne peut pas actuellement l'utiliser pour déployer des minipools supplémentaires.

L'ETH pour votre solde de crédit est prélevé sur le **deposit pool**.
Ainsi, si vous voulez utiliser 8 ETH en crédit pour créer un nouveau minipool de 8 ETH, cela finira par prendre **les 32 ETH pour ce minipool** du deposit pool et n'en nécessitera aucun de votre part.
Pour cette raison, si le deposit pool n'a pas assez d'ETH pour couvrir la valeur de pré-dépôt (actuellement fixée à 1 ETH), **le solde ne sera pas disponible**.

Dans cette situation, le Smartnode vous alertera lors d'une opération `rocketpool node deposit` qu'il **ne peut pas** utiliser votre solde de crédit, et doit plutôt utiliser l'ETH de votre portefeuille de nœud pour compléter la caution.
Cela **ne consommera pas** votre solde de crédit ; il restera tel quel et sera disponible pour utilisation ultérieure une fois que le deposit pool aura suffisamment de solde pour le couvrir.
