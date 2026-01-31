# Sauvegarde de Votre Nœud

::: tip NOTE
Ceci est actuellement écrit pour les installations en **Mode Docker**.
Certains emplacements peuvent varier pour les utilisateurs Hybrid ou Native.
:::

En général, si vous avez créé votre wallet de nœud et vos minipools via le Smartnode, la seule chose dont vous avez vraiment besoin pour récupérer votre nœud après une défaillance complète est le **mnémonique de votre wallet de nœud**
Tout le reste peut être récupéré à partir de cela assez facilement.

Si vous avez des minipools avec des clés de validator générées en externe (par exemple, vous avez migré d'**Allnodes** vers votre propre nœud auto-hébergé), vous aurez également besoin des fichiers keystore privés de vos validators car ils ne peuvent pas être récupérés à partir du wallet de nœud.

Cela dit, une fois que le Merge aura eu lieu, vous ne pourrez plus utiliser un client Execution léger (par exemple, Pocket ou Infura) comme solution de repli si vous devez resynchroniser la chaîne de la couche Execution.
De plus, vous devrez avoir un client Execution actif et sain pour attester correctement.
Avoir un moyen rapide et fiable de récupérer d'une défaillance du client Execution (comme une base de données corrompue, un dysfonctionnement du SSD ou du matériel compromis / volé) sera essentiel, car cela peut prendre des heures voire des jours pour se synchroniser depuis zéro.

Dans ce guide, nous vous montrerons comment sauvegarder certaines de ces choses pour améliorer la résilience de votre nœud et minimiser les temps d'arrêt inutiles.

::: warning NOTE
Ce guide suppose que vous avez installé le Smartnode dans le répertoire par défaut (`~/.rocketpool`).
Si vous avez spécifié un répertoire d'installation différent, remplacez-le en conséquence dans les instructions ci-dessous.
:::

## Éléments Pouvant Être Sauvegardés

### Configuration du Smartnode

La configuration du Smartnode est stockée dans `~/.rocketpool/user-settings.yml`.
Vous pouvez l'enregistrer et la remplacer pour restaurer tous vos paramètres de Smartnode (c'est-à-dire les éléments que vous avez spécifiés dans `rocketpool service config`).

### Données de Chaîne du Client Execution / Client ETH1

Les données de chaîne du client Execution sont probablement la chose la plus importante à sauvegarder.
Comme mentionné, cela peut prendre plusieurs jours pour resynchroniser vos données de chaîne EC.
Après le Merge, cela signifie des heures à des jours d'arrêt et de profits perdus !

Les données de chaîne sont stockées dans le volume Docker `rocketpool_eth1clientdata`, qui est par défaut situé à `/var/lib/docker/volumes/rocketpool_eth1clientdata`.
Notez que ce dossier n'est généralement pas accessible par les comptes utilisateurs non privilégiés ; vous devrez vous élever au niveau de l'utilisateur `root` pour le voir.

::: tip NOTE
Si vous avez modifié l'emplacement de stockage de Docker lors de l'installation initiale de Smartnode (comme les personnes qui exécutent Docker sur un second SSD), vous trouverez le volume dans `/<votre point de montage externe>/docker/volumes/rocketpool_eth1clientdata`

Si vous ne vous souvenez pas du chemin d'installation que vous utilisez, vous pouvez vérifier `/etc/docker/daemon.json` pour son emplacement. Si le fichier n'existe pas, vous utilisez l'emplacement par défaut.
:::

Pour des instructions détaillées sur la façon de sauvegarder efficacement vos données de chaîne Execution, veuillez consulter la section [Sauvegarde de Vos Données de Chaîne Execution](#sauvegarde-de-vos-données-de-chaîne-execution) ci-dessous.

### Données de Surveillance et Métriques

Ces données sont stockées dans le volume Docker `rocketpool_grafana-storage`, qui se trouve par défaut à `/var/lib/docker/volumes/rocketpool_grafana-storage` (ou `/<votre point de montage externe>/docker/volumes/rocketpool_prometheus-data` si vous avez personnalisé votre emplacement de stockage Docker).

## Éléments Qui Ne Devraient **Pas** Être Sauvegardés

### Clés Privées et Mots de Passe

La clé privée de votre wallet de nœud et le fichier de mot de passe utilisé pour la chiffrer sont stockés respectivement dans `~/.rocketpool/data/wallet` et `~/.rocketpool/data/password`.
Ces fichiers n'ont généralement pas besoin d'être sauvegardés, car ils peuvent être récupérés à partir de votre mnémonique en utilisant `rocketpool wallet recover`.

Si, pour une raison quelconque, vous _décidez_ de sauvegarder ces fichiers, vous devrez être **extrêmement prudent** quant à la façon dont vous les stockez.
Quiconque accède à ces fichiers accédera à votre wallet de nœud, ses validators et tous les fonds que vous y avez stockés pour des choses comme le gas.

Nous **recommandons vivement** de ne pas sauvegarder ces fichiers et d'utiliser simplement votre mnémonique de wallet pour les récupérer si nécessaire.

### Données de Chaîne du Client Consensus

Contrairement aux données de la couche Execution, les données de la couche Consensus ne sont pas aussi importantes pour votre nœud grâce à [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing). Les clients Consensus peuvent facilement utiliser cette technique pour se resynchroniser immédiatement à la tête de la Beacon chain et reprendre les tâches de validation.

## Sauvegarde de Vos Données de Chaîne Execution

Le Smartnode est livré avec la capacité de sauvegarder vos données de chaîne Execution via la commande `rocketpool service export-eth1-data`.
Sous le capot, cela utilise `rsync`, un outil de sauvegarde/copie puissant dans Linux.

`rsync` compare les fichiers dans le répertoire source (votre volume Docker) et le répertoire cible (votre emplacement de sauvegarde).
Si un fichier source n'existe pas dans le répertoire cible, il sera copié entièrement.
Cependant, s'il _existe_, `rsync` ne copiera que les _modifications_ entre les deux fichiers.

Cela signifie que la première sauvegarde prendra beaucoup de temps car elle doit copier toutes les données initialement.
Les sauvegardes ultérieures ne copieront que les modifications entre votre sauvegarde précédente et maintenant, rendant le processus beaucoup plus rapide.

Dans le cadre d'une stratégie de sauvegarde, vous voudrez peut-être prévoir d'exécuter `export-eth1-data` régulièrement.
Pour garantir l'intégrité des données de chaîne, l'exécution de cette commande **arrêtera en toute sécurité le client Execution avant de sauvegarder ses données**.
Si vous choisissez de le planifier chaque semaine, votre client Execution ne sera hors service que quelques minutes pendant la mise à jour de la sauvegarde.
C'est certainement mieux que les jours qu'il faudrait pour resynchroniser les données depuis zéro.

Pour déclencher une sauvegarde, commencez par **monter le support de stockage sur lequel vous souhaitez exporter les données**.
Par exemple, cela pourrait être un disque dur externe.

::: tip ASTUCE
Si vous ne savez pas comment monter des périphériques externes sur Linux, c'est facile !
Branchez le périphérique sur votre nœud et suivez [un guide comme celui-ci](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/) pour apprendre à le monter.
:::

Une fois que vous l'avez monté, notez son chemin de montage.
Pour cet exemple, supposons que nous voulons stocker les données de chaîne dans un dossier appelé `/mnt/external-drive` sur lequel le périphérique externe est monté.
Remplacez cela par votre chemin de montage réel partout où vous le voyez ci-dessous.

Maintenant, exécutez la commande suivante :

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Cela vérifiera que votre dossier cible est accessible et dispose de suffisamment d'espace libre pour stocker les données de chaîne.
La sortie ressemblera à ceci :

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Comme vous pouvez le voir, les données de chaîne feront moins de 100 Go (pour le testnet Hoodi ; le mainnet Ethereum sera d'un ordre de grandeur plus grand) et le dossier externe dispose de 287 Gio libres, donc l'exportation peut continuer.

Lorsque vous êtes prêt, saisissez `y` ici et appuyez sur `Entrée`.
Cela arrêtera votre client Execution et commencera à copier ses données de chaîne vers votre dossier cible.
Vous verrez la progression de chaque fichier individuel défiler à l'écran pendant son exécution.

::: warning NOTE
Il est important que vous ne _quittiez pas_ le terminal pendant son exécution.
Si vous le faites, la copie continuera à s'exécuter en arrière-plan mais vous ne pourrez pas suivre sa progression !
:::

Une fois terminé, il redémarrera automatiquement votre conteneur de client Execution.

**Notez que vos données de chaîne existantes ne sont pas supprimées de votre nœud une fois l'exportation terminée !**

### Restauration de Vos Données de Chaîne Execution

Si vous devez restaurer vos données de chaîne sauvegardées, exécutez simplement la commande suivante.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger AVERTISSEMENT
Cela supprimera automatiquement toutes les données existantes du client Execution dans votre volume `rocketpool_eth1clientdata` !
:::

Une fois terminé, votre client Execution sera prêt à fonctionner.
