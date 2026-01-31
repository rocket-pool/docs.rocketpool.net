::: danger AVERTISSEMENT
Les dépôts de minipool sont actuellement désactivés en préparation de Saturn 1.
:::

# Le Delegate du Minipool

Chaque validator que vous exécutez possède un contrat **minipool** comme son "propriétaire" pour ainsi dire.
Le minipool est un contrat unique spécifiquement assigné à ce validator ; il agit comme son **adresse de retrait**.
Tous les retraits de récompenses et de solde de staking de la Beacon Chain seront envoyés au contrat minipool.

Chaque minipool est unique pour garantir que vous (l'opérateur de nœud) en ayez le contrôle ultime.
Personne d'autre ne le contrôle, personne d'autre ne peut le modifier ; il est entièrement sous votre commandement.

Cela dit, afin de minimiser les coûts de gas lors des dépôts de nœuds, le minipool _lui-même_ contient très peu de fonctionnalités réelles.
Presque tout ce qu'il peut faire est délégué à un contrat **delegate**.

Le contrat delegate de minipool est un contrat spécial qui contient la majeure partie de la logique requise par les minipools - comme la distribution équitable du solde entre vous et les stakers du pool, par exemple.
Contrairement aux minipools, où chaque minipool est un contrat unique, le delegate est un seul contrat auquel de nombreux minipools peuvent "transférer" des requêtes.

Occasionnellement, l'équipe de développement de Rocket Pool publiera un nouveau delegate de minipool qui ajoute de nouvelles fonctionnalités.
Par exemple, dans la mise à jour Atlas, nous avons introduit un nouveau delegate qui prenait en charge la distribution des récompenses skimmées sans avoir besoin de fermer le minipool.

Les minipools peuvent voir leurs delegates mis à niveau pour profiter de ces nouvelles fonctionnalités.
Les mises à niveau de delegate sont **opt-in**, vous pouvez donc décider si et quand vous souhaitez les utiliser.
Cela dit, elles sont généralement requises pour profiter des nouvelles fonctionnalités que les mises à niveau du réseau introduisent.

### Mise à Niveau de Votre Delegate

Pour mettre à niveau un minipool vers un nouveau contrat delegate, exécutez simplement la commande suivante :

```shell
rocketpool minipool delegate-upgrade
```

Cela vous présentera une liste de vos minipools qui n'utilisent pas actuellement le dernier delegate et sont éligibles à la mise à niveau :

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Sélectionnez celui (ceux) que vous souhaitez mettre à niveau dans la liste en saisissant le numéro correspondant à gauche de l'adresse du minipool.
Une fois sélectionné, vous serez invité à confirmer vos paramètres de prix du gas, et après cela, une transaction pour mettre à niveau le minipool sera envoyée :

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

Vous pouvez vérifier qu'il utilise le dernier delegate avec `rocketpool minipool status`.
Tous les minipools qui n'utilisent _pas_ le dernier delegate auront une notification jaune sous leur statut vous informant qu'ils peuvent être mis à niveau :

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
