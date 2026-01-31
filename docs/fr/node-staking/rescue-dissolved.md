# Sauvetage d'un Minipool Dissous

Dans le cas peu probable où votre minipool ne stake pas dans la fenêtre de dissolution, il sera "dissous" par l'oDAO et
les fonds d'utilisateurs fournis seront retournés au pool de dépôt pour être utilisés par un autre minipool. Dans ce scénario, vous devrez
effectuer le processus ci-dessous pour récupérer votre ETH et déverrouiller votre RPL pour être désengagé.

## Mettre à Jour le Délégué de votre Minipool

Il est fortement recommandé d'utiliser le dernier délégué de minipool lors de l'exécution de ce processus. Les anciens délégués contiennent
une opération `selfdestruct` lorsqu'ils sont fermés, ce qui signifie que si le processus n'est pas terminé correctement dans
l'ordre spécifié, les fonds peuvent être verrouillés pour toujours. Vous pouvez vérifier que votre minipool utilise le dernier délégué en tentant
de [Mettre à Niveau votre Délégué](./minipools/delegates#upgrading-your-delegate). Si votre minipool n'apparaît pas dans la
liste des minipools qui peuvent être mis à niveau, vous pouvez continuer ci-dessous.

## Récupérer Votre Solde de Dépôt Non Utilisé

::: tip NOTE
Si votre minipool a été dissous avant Atlas, vous pouvez ignorer cette étape et aller directement à [Augmenter Votre Solde Beaconchain à 32 ETH](#increase-your-beaconchain-balance-to-32-eth).
Vous n'avez pas besoin de récupérer votre solde de dépôt non utilisé car le montant total de la caution a été déposé sur la beaconchain
avant Atlas.
:::

1 ETH de votre dépôt de caution initial est utilisé comme dépôt initial sur la beaconchain pour sécuriser les
informations d'identification de retrait de votre validateur. Le montant restant est déposé dans votre minipool lorsqu'il se voit attribuer de l'ETH du
pool de dépôt.

Lorsque votre minipool est dissous, l'ETH de l'utilisateur est retourné au pool de dépôt et votre ETH reste dans le minipool prêt
à vous être retourné. Utilisez la fonction [Distribution Manuelle](./skimming#manual-distribution) des récompenses pour récupérer cet
ETH qui peut ensuite être utilisé dans la prochaine étape pour activer votre validateur.

## Augmenter Votre Solde Beaconchain à 32 ETH

Vous devez compléter le solde de votre validateur au minimum requis pour l'activation sur la beaconchain. Ce
montant est de **32 ETH**. Si vous avez un minipool cautionné à 16 ETH, vous aurez besoin de 16 ETH supplémentaires et si vous avez un minipool cautionné à 8 ETH
vous aurez besoin de 24 ETH supplémentaires pendant cette étape.

Déposez le montant requis d'ETH dans l'adresse de votre nœud puis lancez la commande suivante pour commencer le processus :

```shell
rocketpool minipool rescue-dissolved
```

On vous présentera une liste de minipools qui répondent aux critères d'un dépôt manuel :

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Après avoir sélectionné le minipool que vous souhaitez sauver, on vous demandera quel montant vous souhaitez déposer manuellement :

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

L'option 1 sera utilisée dans la plupart des cas. C'est le montant requis pour amener votre solde beaconchain à
32 ETH requis. Les autres options sont fournies pour des cas d'utilisation avancés.

::: tip NOTE
Porter votre solde beaconchain à 32 ETH signifie que votre validateur pourra participer activement aux
devoirs de validation Ethereum. Le smartnode peut ne pas avoir eu l'occasion de redémarrer votre validateur depuis la dissolution. Par conséquent,
il est judicieux de redémarrer manuellement votre validateur pour vous assurer qu'il a chargé vos clés de validateur et peut effectuer
les devoirs de validation pour éviter toute pénalité pendant le processus de sauvetage.

Si vous exécutez le mode Docker standard, cela peut être fait avec `docker restart rocketpool_validator`.
:::

Une fois cette étape terminée, votre validateur entrera dans la file d'attente d'entrée et vous devrez attendre que les événements
suivants se produisent :

1. 2048 blocs de la couche d'exécution doivent passer pour que votre dépôt soit accepté (~8 heures)
2. Jusqu'à 32 époques doivent passer pour que les validateurs vous votent (~0,5 - 3,5 heures)
3. Un temps variable dans la file d'attente des validateurs (6,4 minutes par 4 validateurs dans la file d'attente)
4. 256 époques minimum de validation avant qu'une sortie ne soit autorisée (27 heures)

### Sortie de votre Validateur

Une fois que votre validateur a été actif pendant au moins 256 époques, vous pouvez sortir votre minipool via le même processus que
tout autre minipool en suivant le guide [Sortie de votre Validateur](./withdraw#exiting-your-validator).

Le solde complet de 32 ETH sera retourné à votre minipool et les minipools dissous distribuent 100 % de leur solde à
l'adresse de retrait de l'opérateur de nœud.
