# Préparation d'un Raspberry Pi

::: warning NOTE
Cette page a été laissée ici à des fins d'archivage. Nous ne recommandons plus l'exécution de Rocket Pool sur un Raspberry Pi en raison des exigences matérielles et de performance accrues pour l'exécution d'un validateur Ethereum.
:::

Ce guide vous guidera sur la façon d'exécuter un nœud Rocket Pool en utilisant un Raspberry Pi.
Bien que cela ne soit généralement pas recommandé dans la plupart des guides de staking, nous reconnaissons que c'est attrayant car c'est une option beaucoup plus abordable que de monter un PC entier.
À cette fin, nous avons travaillé dur pour ajuster et optimiser toute une série de paramètres et avons déterminé une configuration qui semble bien fonctionner.

Cette configuration exécutera **un nœud Execution complet** et **un nœud Consensus complet** sur le Pi, faisant en sorte que votre système contribue à la santé du réseau Ethereum tout en agissant simultanément en tant qu'opérateur de nœud Rocket Pool.

## Configuration Préliminaire

Pour exécuter un nœud Rocket Pool sur un Raspberry Pi, vous devrez d'abord avoir un Raspberry Pi fonctionnel.
Si vous en avez déjà un en cours d'exécution - génial ! Vous pouvez passer à la section [Montage du SSD](#montage-du-ssd).
Assurez-vous simplement d'avoir **un ventilateur attaché** avant de continuer.
Si vous partez de zéro, alors lisez la suite.

### Ce Dont Vous Aurez Besoin

Voici les composants recommandés que vous devrez acheter pour exécuter Rocket Pool sur un Pi :

- Un **Raspberry Pi 4 Model B**, le **modèle 8 Go**
  - Remarque : bien que vous _puissiez_ utiliser un 4 Go avec cette configuration, nous vous recommandons fortement d'opter pour un 8 Go pour la tranquillité d'esprit... ce n'est vraiment pas beaucoup plus cher.
- Une **alimentation USB-C** pour le Pi. Vous en voulez une qui fournit **au moins 3 ampères**.
- Une **carte MicroSD**. Elle n'a pas besoin d'être grande, 16 Go suffisent largement et elles sont assez bon marché maintenant... mais elle devrait être au moins de **Classe 10 (U1)**.
- Un **adaptateur MicroSD vers USB** pour votre PC. Ceci est nécessaire pour que vous puissiez installer le système d'exploitation sur la carte avant de la charger dans le Pi.
  Si votre PC a déjà un port SD, alors vous n'avez pas besoin d'en acheter un nouveau.
- Des **dissipateurs thermiques**. Vous allez faire fonctionner le Pi sous une charge lourde 24h/24 et 7j/7, et il va chauffer.
  Les dissipateurs thermiques aideront pour qu'il ne s'étrangle pas. Vous voulez idéalement un ensemble de 3 : un pour le CPU, un pour la RAM et un pour le contrôleur USB.
  [Voici un bon exemple d'un bel ensemble](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Un **boîtier**. Il y a deux façons de procéder ici : avec un ventilateur, et sans ventilateur.
  - Avec un ventilateur :
    - Un **ventilateur** de 40 mm. Même chose que ci-dessus, l'objectif est de garder les choses au frais pendant l'exécution de votre nœud Rocket Pool.
    - Un **boîtier avec un support de ventilateur** pour tout rassembler.
      Vous pourriez également obtenir un boîtier avec des ventilateurs intégrés [comme celui-ci](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) pour ne pas avoir à acheter les ventilateurs séparément.
  - Sans ventilateur :
    - Un **boîtier sans ventilateur** qui agit comme un dissipateur thermique géant, comme [celui-ci](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX).
      C'est une belle option car c'est silencieux, mais votre Pi **va** devenir assez chaud - surtout pendant le processus initial de synchronisation de la blockchain.
      Crédit à l'utilisateur Discord Ken pour nous avoir orientés dans cette direction !
  - En règle générale, nous recommandons d'aller **avec un ventilateur** car nous allons overclocker le Pi de manière significative.

Vous pouvez obtenir beaucoup de ces éléments regroupés ensemble pour plus de commodité - par exemple, [Canakit propose un kit](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) avec de nombreux composants inclus.
Cependant, vous pourriez être en mesure de tout obtenir moins cher si vous obtenez les pièces séparément (et si vous avez l'équipement, vous pouvez [imprimer en 3D votre propre boîtier Pi](https://www.thingiverse.com/thing:3793664).)

Autres composants dont vous aurez besoin :

- Un **disque SSD USB 3.0+**. La recommandation générale est pour un **disque de 2 To**.
  - Le [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) est un excellent exemple de disque connu pour bien fonctionner.
  - :warning: L'utilisation d'un SSD SATA avec un adaptateur SATA vers USB n'est **pas recommandée** en raison de [problèmes comme celui-ci](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931).
    Si vous empruntez cette voie, nous avons inclus un test de performance que vous pouvez utiliser pour vérifier s'il fonctionnera ou non dans la section [Test de la Performance du SSD](#testing-the-ssd-s-performance).
- Un **câble ethernet** pour l'accès Internet. Il doit être au moins de catégorie **Cat 5e**.
  - Exécuter un nœud via Wi-Fi n'est **pas recommandé**, mais si vous n'avez pas d'autre option, vous pouvez le faire au lieu d'utiliser un câble ethernet.
- Un **UPS** pour servir de source d'alimentation si vous perdez de l'électricité.
  Le Pi ne consomme vraiment pas beaucoup d'énergie, donc même un petit UPS durera un certain temps, mais généralement plus c'est gros, mieux c'est. Optez pour un UPS aussi grand que vous pouvez vous le permettre.
  De plus, nous vous recommandons d'**y attacher également votre modem, routeur et autre équipement réseau** - cela ne sert pas à grand-chose de garder votre Pi en vie si votre routeur meurt.

Selon votre emplacement, les ventes, votre choix de SSD et d'UPS, et combien de ces choses vous avez déjà, vous allez probablement finir par dépenser **environ 200 $ à 500 $ USD** pour une configuration complète.

### Faire Fonctionner le Ventilateur Plus Silencieusement

Lorsque vous obtenez le ventilateur, par défaut, vous serez probablement invité à le connecter à la broche GPIO 5v, comme indiqué dans l'image ci-dessous.
Le ventilateur aura un connecteur avec deux trous ; le noir devrait aller au GND (broche 6), et le rouge devrait aller au +5v (broche 4).
![](./images/pi/Pinout.png)

Cependant, d'après notre expérience, cela fait fonctionner le ventilateur très bruyamment et rapidement, ce qui n'est pas vraiment nécessaire.
Si vous voulez le rendre plus silencieux tout en restant frais, essayez de le connecter à la broche 3,3v (Broche 1, la bleue) au lieu de la broche 5v.
Cela signifie que sur votre ventilateur, le point noir ira toujours au GND (broche 6), mais maintenant le point rouge ira au +3,3v (broche 1).

Si votre ventilateur a un connecteur où les deux trous sont côte à côte et que vous ne pouvez pas les séparer, vous pouvez mettre [des cavaliers comme ceci](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) entre lui et les broches GPIO sur le Pi.

### Installation du Système d'Exploitation

Il existe quelques variétés de système d'exploitation Linux qui prennent en charge le Raspberry Pi.
Pour ce guide, nous allons nous en tenir à **Ubuntu 20.04**.
Ubuntu est un système d'exploitation éprouvé qui est utilisé dans le monde entier, et 20.04 est (au moment de la rédaction) la dernière des versions de support à long terme (LTS), ce qui signifie qu'il continuera à recevoir des correctifs de sécurité pendant très longtemps.
Si vous préférez vous en tenir à une saveur différente de Linux comme Raspbian, n'hésitez pas à suivre les guides d'installation existants pour cela - gardez simplement à l'esprit que ce guide est conçu pour Ubuntu, donc toutes les instructions peuvent ne pas correspondre à votre système d'exploitation.

Les braves gens de Canonical ont rédigé [un merveilleux guide sur la façon d'installer l'image Ubuntu Server sur un Pi](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview).

Suivez **les étapes 1 à 4** du guide ci-dessus pour la configuration du serveur.
Pour l'image du système d'exploitation, vous voulez sélectionner `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`.

Si vous décidez que vous voulez une interface de bureau (pour pouvoir utiliser une souris et avoir des fenêtres à faire glisser), vous devrez suivre l'étape 5 également.
Nous vous suggérons de ne pas le faire et de vous en tenir simplement à l'image du serveur, car l'interface de bureau ajoutera une certaine surcharge supplémentaire et un travail de traitement sur votre Pi avec relativement peu d'avantages.
Cependant, si vous êtes déterminé à exécuter un bureau, nous recommandons de choisir l'option Xubuntu.
C'est assez léger en ressources et très convivial.

Une fois cela terminé, vous êtes prêt à commencer à préparer Ubuntu pour exécuter un nœud Rocket Pool.
Vous pouvez utiliser le terminal local dessus, ou vous pouvez vous connecter en SSH depuis votre bureau / ordinateur portable comme le suggère le guide d'installation.
Le processus sera le même de toute façon, alors faites ce qui est le plus pratique pour vous.

Si vous n'êtes pas familier avec `ssh`, jetez un œil au guide [Introduction à Secure Shell](../ssh).

::: warning NOTE
À ce stade, vous devriez _fortement envisager_ de configurer votre routeur pour rendre l'adresse IP de votre Pi **statique**.
Cela signifie que votre Pi aura la même adresse IP pour toujours, vous pourrez donc toujours vous connecter en SSH en utilisant cette adresse IP.
Sinon, il est possible que l'IP de votre Pi puisse changer à un moment donné, et la commande SSH ci-dessus ne fonctionnera plus.
Vous devrez entrer dans la configuration de votre routeur pour découvrir quelle est la nouvelle adresse IP de votre Pi.

Chaque routeur est différent, vous devrez donc consulter la documentation de votre routeur pour apprendre comment attribuer une adresse IP statique.
:::

## Montage du SSD

Comme vous l'avez peut-être deviné, après avoir suivi les instructions d'installation ci-dessus, le système d'exploitation principal fonctionnera sur la carte microSD.
Ce n'est pas assez grand ou assez rapide pour contenir toutes les données de la blockchain Execution et Consensus, c'est là que le SSD entre en jeu.
Pour l'utiliser, nous devons le configurer avec un système de fichiers et le monter sur le Pi.

### Connexion du SSD aux Ports USB 3.0

Commencez par brancher votre SSD dans l'un des ports USB 3.0 du Pi. Ce sont les ports **bleus**, pas les noirs :

![](./images/pi/USB.png)

Les noirs sont des ports USB 2.0 lents ; ils ne sont bons que pour des accessoires comme des souris et des claviers.
Si vous avez votre clavier branché dans les ports bleus, retirez-le et branchez-le dans les noirs maintenant.

### Formatage du SSD et Création d'une Nouvelle Partition

::: warning
Ce processus va effacer tout ce qui se trouve sur votre SSD.
Si vous avez déjà une partition avec des choses dessus, SAUTEZ CETTE ÉTAPE car vous êtes sur le point de tout supprimer !
Si vous n'avez jamais utilisé ce SSD auparavant et qu'il est totalement vide, alors suivez cette étape.
:::

Exécutez cette commande pour trouver l'emplacement de votre disque dans la table des appareils :

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

La chose importante dont vous avez besoin est la partie `logical name: /dev/sda`, ou plutôt, la partie **`/dev/sda`**.
Nous allons appeler cela l'**emplacement de l'appareil** de votre SSD.
Pour ce guide, nous utiliserons simplement `/dev/sda` comme emplacement de l'appareil - le vôtre sera probablement le même, mais substituez-le par ce que cette commande montre pour le reste des instructions.

Maintenant que nous connaissons l'emplacement de l'appareil, formatons-le et créons une nouvelle partition dessus pour pouvoir l'utiliser réellement.
Encore une fois, **ces commandes supprimeront tout ce qui est déjà sur le disque !**

Créez une nouvelle table de partition :

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Formatez la nouvelle partition avec le système de fichiers `ext4` :

```shell
sudo mkfs -t ext4 /dev/sda1
```

Ajoutez-lui une étiquette (vous n'êtes pas obligé de le faire, mais c'est amusant) :

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Confirmez que cela a fonctionné en exécutant la commande ci-dessous, qui devrait afficher une sortie comme ce que vous voyez ici :

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Si vous voyez tout cela, alors vous êtes prêt. Prenez la sortie `UUID="..."` et mettez-la quelque part temporairement, car vous en aurez besoin dans une minute.

### Optimisation de la Nouvelle Partition

Ensuite, optimisons un peu le nouveau système de fichiers pour l'activité des validateurs.

Par défaut, ext4 réservera 5% de son espace pour les processus système.
Puisque nous n'en avons pas besoin sur le SSD car il stocke juste les données de la chaîne Execution et Consensus, nous pouvons le désactiver :

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Montage et Activation du Montage Automatique

Pour utiliser le disque, vous devez le monter sur le système de fichiers.
Créez un nouveau point de montage où vous le souhaitez (nous utiliserons `/mnt/rpdata` ici comme exemple, n'hésitez pas à utiliser cela) :

```shell
sudo mkdir /mnt/rpdata
```

Maintenant, montez la nouvelle partition SSD sur ce dossier :

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Après cela, le dossier `/mnt/rpdata` pointera vers le SSD, donc tout ce que vous écrivez dans ce dossier sera sur le SSD.
C'est là que nous allons stocker les données de la chaîne pour Execution et Consensus.

Maintenant, ajoutons-le à la table de montage pour qu'il se monte automatiquement au démarrage.
Vous vous souvenez du `UUID` de la commande `blkid` que vous avez utilisée plus tôt ?
C'est là que cela sera utile.

```shell
sudo nano /etc/fstab
```

Cela ouvrira un éditeur de fichier interactif, qui ressemblera à ceci au début :

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

Utilisez les touches fléchées pour descendre jusqu'à la ligne du bas, et ajoutez cette ligne à la fin :

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

Remplacez la valeur dans `UUID=...` par celle de votre disque, puis appuyez sur `Ctrl+O` et `Entrée` pour enregistrer, puis `Ctrl+X` et `Entrée` pour quitter.
Maintenant, le SSD sera automatiquement monté lorsque vous redémarrerez. Super !

### Test de la Performance du SSD

Avant d'aller plus loin, vous devriez tester la vitesse de lecture/écriture de votre SSD et combien de requêtes d'E/S il peut gérer par seconde (IOPS).
Si votre SSD est trop lent, il ne fonctionnera pas bien pour un nœud Rocket Pool et vous finirez par perdre de l'argent au fil du temps.

Pour le tester, nous allons utiliser un programme appelé `fio`. Installez-le comme ceci :

```shell
sudo apt install fio
```

Ensuite, déplacez-vous vers le point de montage de votre SSD :

```shell
cd /mnt/rpdata
```

Maintenant, exécutez cette commande pour tester la performance du SSD :

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

La sortie devrait ressembler à ceci :

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

Ce qui vous intéresse, ce sont les lignes commençant par `read:` et `write:` sous la ligne `test:`.

- Votre **lecture** devrait avoir des IOPS d'au moins **15k** et une bande passante (BW) d'au moins **60 MiB/s**.
- Votre **écriture** devrait avoir des IOPS d'au moins **5000** et une bande passante d'au moins **20 MiB/s**.

Ce sont les spécifications du Samsung T5 que nous utilisons, qui fonctionne très bien.
Nous avons également testé un SSD plus lent avec des IOPS de lecture de 5k et des IOPS d'écriture de 1k, et il a beaucoup de mal à suivre la couche consensus.
Si vous utilisez un SSD plus lent que les spécifications ci-dessus, soyez simplement prêt à voir beaucoup d'attestations manquées.
Si le vôtre les atteint ou les dépasse, alors vous êtes prêt et pouvez continuer.

::: tip NOTE
Si votre SSD ne répond pas aux spécifications ci-dessus mais qu'il le devrait, vous pourriez être en mesure de le réparer avec une mise à jour du firmware.
Par exemple, cela a été vécu par la communauté Rocket Pool avec le Samsung T7.
Deux d'entre eux fraîchement sortis de la boîte n'ont montré que 3,5K d'IOPS en lecture et 1,2K d'IOPS en écriture.
Après avoir appliqué toutes les mises à jour du firmware disponibles, les performances sont revenues aux chiffres montrés dans l'exemple ci-dessus.
Vérifiez auprès du site de support de votre fabricant pour le dernier firmware et assurez-vous que votre disque est à jour - vous devrez peut-être mettre à jour le firmware plusieurs fois jusqu'à ce qu'il n'y ait plus de mises à jour restantes.
:::

Enfin, supprimez le fichier de test que vous venez de créer :

```shell
sudo rm /mnt/rpdata/test
```

## Configuration de l'Espace d'Échange

Le Pi a 8 Go (ou 4 Go si vous avez opté pour cette voie) de RAM.
Pour notre configuration, cela sera suffisant.
D'un autre côté, cela ne fait jamais de mal d'en ajouter un peu plus.
Ce que nous allons faire maintenant, c'est ajouter ce qu'on appelle **l'espace d'échange**.
Essentiellement, cela signifie que nous allons utiliser le SSD comme "RAM de secours" au cas où quelque chose se passerait horriblement mal et que le Pi manquerait de RAM normale.
Le SSD n'est pas aussi rapide que la RAM normale, donc s'il atteint l'espace d'échange, cela ralentira les choses, mais il ne plantera pas complètement et ne cassera pas tout.
Considérez cela comme une assurance supplémentaire dont vous n'aurez (très probablement) jamais besoin.

### Création d'un Fichier d'Échange

La première étape consiste à créer un nouveau fichier qui servira d'espace d'échange.
Décidez de la quantité que vous voulez utiliser - un bon départ serait 8 Go, vous avez donc 8 Go de RAM normale et 8 Go de "RAM de secours" pour un total de 16 Go.
Pour être super sûr, vous pouvez le rendre de 24 Go afin que votre système ait 8 Go de RAM normale et 24 Go de "RAM de secours" pour un total de 32 Go, mais c'est probablement excessif.
Heureusement, puisque votre SSD a 1 ou 2 To d'espace, allouer 8 à 24 Go pour un fichier d'échange est négligeable.

Pour les besoins de cette procédure, choisissons un juste milieu - disons, 16 Go d'espace d'échange pour une RAM totale de 24 Go.
Remplacez simplement le nombre que vous voulez au fur et à mesure.

Entrez ceci, qui créera un nouveau fichier appelé `/mnt/rpdata/swapfile` et le remplira avec 16 Go de zéros.
Pour changer la quantité, changez simplement le nombre dans `count=16` par ce que vous voulez. **Notez que cela va prendre beaucoup de temps, mais c'est normal.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

Ensuite, définissez les permissions pour que seul l'utilisateur root puisse lire ou écrire dedans (pour la sécurité) :

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Maintenant, marquez-le comme un fichier d'échange :

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Ensuite, activez-le :

```shell
sudo swapon /mnt/rpdata/swapfile
```

Enfin, ajoutez-le à la table de montage pour qu'il se charge automatiquement lorsque votre Pi redémarre :

```shell
sudo nano /etc/fstab
```

Ajoutez une nouvelle ligne à la fin pour que le fichier ressemble à ceci :

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Appuyez sur `Ctrl+O` et `Entrée` pour enregistrer, puis `Ctrl+X` et `Entrée` pour quitter.

Pour vérifier qu'il est actif, exécutez ces commandes :

```shell
sudo apt install htop
htop
```

Votre sortie devrait ressembler à ceci en haut :
![](./images/pi/Swap.png)

Si le deuxième nombre dans la dernière ligne étiquetée `Swp` (celui après le `/`) est non nul, alors tout est en ordre.
Par exemple, s'il affiche `0K / 16.0G` alors votre espace d'échange a été activé avec succès.
S'il affiche `0K / 0K` alors cela n'a pas fonctionné et vous devrez confirmer que vous avez entré les étapes précédentes correctement.

Appuyez sur `q` ou `F10` pour quitter `htop` et revenir au terminal.

### Configuration de la Swappiness et de la Pression du Cache

Par défaut, Linux utilisera volontiers beaucoup d'espace d'échange pour soulager un peu la pression de la RAM du système.
Nous ne voulons pas cela. Nous voulons qu'il utilise toute la RAM jusqu'à la toute dernière seconde avant de s'appuyer sur l'ÉCHANGE.
L'étape suivante consiste à modifier ce qu'on appelle la "swappiness" du système, qui est essentiellement à quel point il est désireux d'utiliser l'espace d'échange.
Il y a beaucoup de débat sur la valeur à définir pour cela, mais nous avons trouvé qu'une valeur de 6 fonctionne assez bien.

Nous voulons également réduire la "pression du cache", qui dicte à quelle vitesse le Pi supprimera un cache de son système de fichiers.
Puisque nous allons avoir beaucoup de RAM de rechange avec notre configuration, nous pouvons faire cela "10" ce qui laissera le cache en mémoire pendant un certain temps, réduisant les E/S disque.

Pour définir ces paramètres, exécutez ces commandes :

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Maintenant, mettez-les dans le fichier `sysctl.conf` afin qu'ils soient réappliqués après un redémarrage :

```shell
sudo nano /etc/sysctl.conf
```

Ajoutez ces deux lignes à la fin :

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Ensuite, enregistrez et quittez comme vous l'avez fait auparavant (`Ctrl+O`, `Ctrl+X`).

## Overclocking du Pi

Par défaut, le processeur de 1,5 GHz avec lequel le Pi est livré est un petit appareil assez capable.
Pour la plupart, vous devriez pouvoir valider avec lui sans problème.
Cependant, nous avons remarqué qu'en de rares occasions, votre client validateur reste coincé à travailler sur certaines choses et il n'a tout simplement pas assez de puissance pour suivre vos fonctions d'attestation de validateur.
Lorsque cela se produit, vous verrez quelque chose comme ceci sur [l'explorateur beaconcha.in](https://beaconcha.in) (décrit plus en détail dans le guide [Surveillance des Performances de Votre Nœud](../performance) plus tard) :

![](./images/pi/Incl-Dist.png)

Cette distance d'inclusion de 8 signifie qu'il a fallu beaucoup de temps pour envoyer cette attestation, et vous serez légèrement pénalisé pour être en retard.
Idéalement, ils devraient tous être 0.
Bien que rares, ceux-ci se produisent lors de l'exécution avec les paramètres d'origine.

Il existe cependant un moyen d'atténuer cela : l'overclocking.
L'overclocking est de loin le moyen le plus simple d'obtenir des performances supplémentaires de votre CPU Pi et d'éviter ces distances d'inclusion élevées désagréables.
Franchement, l'horloge CPU par défaut de 1,5 GHz est vraiment sous-alimentée.
Vous pouvez l'accélérer pas mal via l'overclocking, et selon jusqu'où vous allez, vous pouvez le faire assez en toute sécurité aussi.

L'overclocking du Pi est très simple - il suffit de changer quelques chiffres dans un fichier texte.
Il y a deux chiffres qui comptent : le premier est l'**horloge du cœur**, qui détermine directement la vitesse à laquelle le CPU ARM fonctionne.
Le second est la **surtension**, qui détermine la tension qui est alimentée dans le CPU ARM.
Des vitesses plus élevées nécessitent généralement une tension plus élevée, mais le CPU du Pi peut gérer pas mal de tension supplémentaire sans aucun dommage appréciable.
Il pourrait s'user un peu plus vite, mais nous parlons encore de l'ordre de plusieurs années et le Pi 5 sortira d'ici là, donc pas de réel dommage !

Au contraire, la véritable préoccupation avec la surtension est que **des tensions plus élevées entraînent des températures plus élevées**.
Cette section vous aidera à voir à quel point votre Pi chauffe sous une charge lourde, pour que vous ne le poussiez pas trop loin.

::: warning
Bien que l'overclocking aux niveaux que nous allons faire soit assez sûr et fiable, vous êtes à la merci de ce qu'on appelle la "loterie du silicium".
Chaque CPU est légèrement différent de manière microscopique, et certains d'entre eux peuvent simplement être overclockés mieux que d'autres.
Si vous overclocke trop loin / trop fort, votre système peut devenir **instable**.
Les Pi instables souffrent de toutes sortes de conséquences, des redémarrages constants au gel complet.
**Dans le pire des cas, vous pourriez corrompre votre carte microSD et devoir tout réinstaller à partir de zéro !**

**En suivant les conseils ici, vous devez accepter le fait que vous courez ce risque.**
Si ce n'est pas la peine pour vous, alors sautez le reste de cette section.
:::

## Benchmarking de la Configuration d'Origine

Avant d'overclocker, vous devez profiler ce dont votre Pi est capable dans sa configuration d'origine, prête à l'emploi.
Il y a trois choses clés à examiner :

1. **Performance** (à quelle vitesse votre Pi calcule les choses)
2. **Température** sous charge (à quel point il chauffe)
3. **Stabilité** (combien de temps il fonctionne avant de planter)

Nous allons obtenir des statistiques sur les trois au fur et à mesure.

### Performance

Pour mesurer les performances, vous pouvez utiliser LINPACK.
Nous allons le construire à partir des sources.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

Maintenant exécutez-le comme ceci :

```shell
linpack
Enter array size (q to quit) [200]:
```

Appuyez simplement sur `entrée` pour le laisser à la valeur par défaut de 200, et laissez-le fonctionner.
Quand c'est fait, la sortie ressemblera à ceci :

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

Ce dont vous avez besoin de regarder est la dernière ligne, dans la colonne `KFLOPS`.
Ce nombre (1120277.186 dans l'exemple ci-dessus) représente vos performances de calcul.
Il ne signifie rien en soi, mais il nous donne une bonne base de référence pour comparer les performances overclockées.
Appelons cela les **KFLOPS d'origine**.

### Température

Ensuite, stressons le Pi et regardons sa température sous une charge lourde.
Tout d'abord, installez ce package, qui fournira un outil appelé `vcgencmd` qui peut imprimer des détails sur le Pi :

```shell
sudo apt install libraspberrypi-bin
```

Une fois cela installé, redémarrez le Pi (cela est nécessaire pour que certaines nouvelles permissions soient appliquées).
Ensuite, installez un programme appelé **stressberry**.
Ce sera notre outil de benchmarking.
Installez-le comme ceci :

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip NOTE
Si stressberry génère une erreur concernant l'impossibilité de lire les informations de température ou l'impossibilité d'ouvrir l'instance `vchiq`, vous pouvez le corriger avec la commande suivante :

```shell
sudo usermod -aG video $USER
```

Ensuite, déconnectez-vous et reconnectez-vous, redémarrez votre session SSH ou redémarrez la machine et réessayez.
:::

Ensuite, exécutez-le comme ceci :

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Cela exécutera un nouveau test de stress nommé "Stock" pendant 300 secondes (5 minutes) avec 60 secondes de refroidissement avant et après le test, sur les 4 cœurs du Pi.
Vous pouvez jouer avec ces horaires si vous voulez qu'il fonctionne plus longtemps ou ait plus de refroidissement, mais cela fonctionne comme un test de stress rapide et sale pour moi.
Les résultats seront enregistrés dans un fichier nommé `stock.out`.

Pendant la phase principale du test, la sortie ressemblera à ceci :

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Cela vous indique essentiellement à quel point le Pi va chauffer.
À 85°C, le Pi commencera en fait à s'étouffer et à baisser la vitesse d'horloge pour qu'il ne surchauffe pas.
Heureusement, parce que vous avez ajouté un dissipateur thermique et un ventilateur, vous ne devriez pas vous rapprocher de ça !
Cela dit, nous essayons généralement de maintenir les températures en dessous de 65°C pour le bien de la santé globale du système.

Si vous voulez surveiller la température du système pendant les opérations de validation normales, vous pouvez le faire avec `vcgencmd` :

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Stabilité

Tester la stabilité d'un overclock implique de répondre à ces trois questions :

- Est-ce que le Pi s'allume et arrive à une invite de connexion / démarre le serveur SSH ?
- Se fige-t-il ou redémarre-t-il de manière aléatoire pendant les opérations normales ?
- Se fige-t-il ou redémarre-t-il de manière aléatoire sous une charge lourde ?

Pour qu'un overclock soit vraiment stable, les réponses doivent être **oui, non et non**.
Il y a plusieurs façons de tester cela, mais la plus facile à ce stade est simplement d'exécuter `stressberry` pendant très longtemps.
Combien de temps est entièrement à vous de décider - plus il dure longtemps, plus vous pouvez être sûr que le système est stable.
Certaines personnes exécutent simplement le test de 5 minutes ci-dessus et l'appellent bon s'il survit ; d'autres l'exécutent pendant une demi-heure ; d'autres l'exécutent pendant 8 heures ou même plus.
Combien de temps l'exécuter est une décision personnelle que vous devrez prendre en fonction de votre propre tolérance au risque.

Pour changer la durée d'exécution, modifiez simplement le paramètre `-d` avec le nombre de secondes que vous voulez que le test dure.
Par exemple, si vous décidiez qu'une demi-heure est la solution, vous pourriez faire `-d 1800`.

## Votre Premier Overclock - 1800 MHz (Léger)

Le premier overclock que nous allons faire est relativement "léger" et fiable, mais offre toujours un bon boost en puissance de calcul.
Nous allons passer de 1500 MHz d'origine à 1800 MHz - une accélération de 20% !

Ouvrez ce fichier :

```shell
sudo nano /boot/firmware/usercfg.txt
```

Ajoutez ces deux lignes à la fin :

```shell
arm_freq=1800
over_voltage=3
```

Ensuite, enregistrez le fichier et redémarrez.

Ces paramètres augmenteront l'horloge du CPU de 20%, et cela augmentera également la tension du CPU de 0,88v à 0,93v (chaque paramètre `over_voltage` l'augmente de 0,025v).
Ce paramètre devrait être atteignable par n'importe quel Pi 4B, donc votre système devrait redémarrer et fournir une invite de connexion ou un accès SSH en quelques instants.
Si ce n'est pas le cas, et que votre Pi cesse de répondre ou entre dans une boucle de démarrage, vous devrez le réinitialiser - lisez la section suivante pour cela.

### Réinitialisation Après un Overclock Instable

Si votre Pi cesse de répondre, ou continue de redémarrer encore et encore, alors vous devez baisser l'overclock.
Pour ce faire, suivez ces étapes :

1. Éteignez le Pi.
2. Retirez la carte microSD.
3. Branchez la carte dans un autre ordinateur Linux avec un adaptateur microSD.
   \*NOTE : Cela **doit être** un autre ordinateur Linux. Cela ne fonctionnera pas si vous le branchez dans une machine Windows, car Windows ne peut pas lire le système de fichiers `ext4` que la carte SD utilise !\*\*
4. Montez la carte sur l'autre ordinateur.
5. Ouvrez `<point de montage SD>/boot/firmware/usercfg.txt`.
6. Baissez la valeur `arm_freq`, ou augmentez la valeur `over_voltage`. _NOTE : **ne dépassez pas over_voltage=6.** Des valeurs plus élevées ne sont pas supportées par la garantie du Pi, et elles risquent de dégrader le CPU plus rapidement que vous ne seriez à l'aise._
7. Démontez la carte SD et retirez-la.
8. Rebranchez la carte dans le Pi et allumez-le.

Si le Pi fonctionne, alors génial ! Continuez ci-dessous.
Sinon, répétez tout le processus avec des paramètres encore plus conservateurs.
Dans le pire des cas, vous pouvez simplement supprimer les lignes `arm_freq` et `over_voltage` entièrement pour le ramener aux paramètres d'origine.

### Test de 1800 MHz

Une fois que vous êtes connecté, exécutez à nouveau `linpack` pour tester les nouvelles performances.
Voici un exemple de notre Pi de test :

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

Encore une fois, prenez la colonne `KFLOPS` dans la dernière ligne.
Pour le comparer à la configuration d'origine, divisez simplement les deux nombres :
`1337238.504 / 1120277.186 = 1.193668`

Très bien ! C'est une augmentation de performance de 19,4%, ce qui est attendu puisque nous fonctionnons 20% plus vite.
Maintenant, vérifions les températures avec les nouveaux paramètres de vitesse d'horloge et de tension :

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Vous devriez voir une sortie comme ceci :

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

Pas mal, environ 6° plus chaud que les paramètres d'origine mais toujours bien en dessous du seuil où nous nous arrêterions personnellement.

Vous pouvez exécuter un test de stabilité plus long ici si vous êtes à l'aise, ou vous pouvez continuer pour pousser les choses encore plus haut.

## Aller à 2000 MHz (Moyen)

Le prochain jalon sera 2000 MHz. Cela représente une augmentation de vitesse d'horloge de 33,3%, ce qui est assez important.
La plupart des gens considèrent cela comme un excellent équilibre entre performance et stabilité, donc ils s'arrêtent ici.

Notre recommandation pour ce niveau est de commencer avec ces paramètres :

```shell
arm_freq=2000
over_voltage=5
```

Cela augmentera la tension du cœur à 1,005v.
Essayez cela avec les tests `linpack` et `stressberry`.
S'il les survit, alors vous êtes prêt. S'il se fige ou redémarre de manière aléatoire, alors vous devriez augmenter la tension :

```shell
arm_freq=2000
over_voltage=6
```

Cela met la tension du cœur à 1,03v, ce qui est aussi haut que vous pouvez aller avant d'annuler la garantie.
Cela fonctionne généralement pour la plupart des Pi.
Si ce n'est pas le cas, au lieu d'augmenter la tension davantage, **vous devriez baisser votre vitesse d'horloge et réessayer.**

Pour référence, voici les chiffres de notre course à 2000 :

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

C'est une accélération de 32,3% ce qui est conforme à ce que nous attendions. Pas mal !

Voici nos températures :

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

Une augmentation de 7 degrés supplémentaires, mais toujours sous notre seuil de 65°C.

## Aller à 2100 MHz (Lourd)

L'étape suivante représente une solide **accélération de 40%** par rapport à la configuration d'origine.

**NOTE : Tous les Pi ne sont pas capables de faire cela tout en restant à `over_voltage=6`.
Essayez-le, et s'il casse, revenez à 2000 MHz.**

La configuration ressemblera à ceci :

```shell
arm_freq=2100
over_voltage=6
```

Pour référence, voici nos résultats :

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

C'est une accélération de 39,4% !

Voici nos températures :

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

Juste en dessous de 60°C, donc il y a beaucoup de marge.

## Aller à 2250 MHz (Extrême)

C'est le réglage que nous utilisons pour nos Pi, qui a été stable pendant plus d'un an au moment de la rédaction.
Néanmoins, **les utilisateurs sont avertis de l'overclocking aussi élevé** - assurez-vous de faire des tests de stabilité approfondis et d'avoir beaucoup de marge thermique avant de tenter de faire de cela la configuration de production de votre nœud !

Notre configuration est :

```shell
arm_freq=2250
over_voltage=10
```

Voici nos résultats :

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

C'est 46% plus rapide que la configuration d'origine !

OV10 est aussi loin que le firmware d'origine laissera le Pi aller, et 2250 MHz est le plus rapide que nous pouvions exécuter de manière fiable en production.

Les températures dans le test de stress montent aussi haut :

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Mais pendant la validation réelle, elles ont tendance à rester en dessous de 60C ce qui est acceptable pour nous.

## Prochaines Étapes

Et avec cela, votre Pi est opérationnel et prêt à exécuter Rocket Pool !
Passez à la section [Choisir vos Clients ETH](../eth-clients).
