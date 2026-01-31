# Préparation d'un PC, Mini-PC ou NUC

Avant d'installer Rocket Pool, il y a quelques vérifications que vous devez effectuer pour vous assurer que votre système est compatible et fonctionnera correctement.

::: danger
Nous vous encourageons fortement à créer une machine dédiée pour faire fonctionner un nœud Rocket Pool.
Faire fonctionner un nœud sur une machine à usage général, comme votre bureau de travail quotidien ou une plateforme de jeu, présente des risques de sécurité supplémentaires qui peuvent compromettre votre portefeuille et entraîner le vol de vos pièces.

**Pour une sécurité maximale, veuillez construire une nouvelle machine qui est dédiée exclusivement à l'exécution d'un nœud.**
:::

## Configuration Système Requise

Vous trouverez ci-dessous une brève description des exigences logicielles et matérielles qu'un nœud Rocket Pool nécessite.
Ce guide suppose que vous avez déjà votre machine physiquement construite et le système d'exploitation installé.

### Systèmes d'Exploitation Pris en Charge

Le client Smartnode de Rocket Pool prend actuellement en charge les systèmes **Linux** et **macOS**.

À l'heure actuelle, **Windows** peut être utilisé pour gérer à distance une machine Linux ou Mac distante, mais le Smartnode lui-même ne peut actuellement pas fonctionner sur un système Windows. Cependant, Rocket Pool _peut_ être exécuté sur une [machine virtuelle](https://en.wikipedia.org/wiki/System_virtual_machine) Linux hébergée par une machine Windows.
Cette configuration n'est pas recommandée par rapport à l'installation simple de Linux comme système d'exploitation hôte, mais elle fonctionne si nécessaire.
Notez qu'elle nécessitera des ressources supplémentaires et comporte ses propres risques de sécurité, nous ne conseillons donc pas d'utiliser cette configuration lors du staking de véritable Ether sur le réseau principal.

Rocket Pool est nativement compatible avec les architectures de CPU **AMD64 (x64)** et **arm64 (aarch64)**.
Pour d'autres architectures, vous devrez compiler les clients smartnode à partir des sources.

Notez que l'utilisateur doit avoir un accès **root / Administrateur** (ou des privilèges **sudo**) pour installer le Smartnode.

#### Support Linux

Il existe de nombreuses variantes du système d'exploitation Linux (appelées distributions, ou **distros** en abrégé). Bien que vous puissiez exécuter Rocket Pool à partir de n'importe quelle distro moderne, l'installateur de Rocket Pool peut automatiquement installer l'ensemble de la pile sur [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/), et [Fedora](https://docs.fedoraproject.org/en-US/project/).

::: warning NOTE
Si vous prévoyez d'utiliser Ubuntu, nous recommandons fortement d'utiliser une version **LTS** telle que 24.04.
Ces versions sont activement maintenues pendant de plus longues périodes, ce qui aide à la sécurité et à la stabilité de votre nœud.
:::

Pour l'installation sur d'autres distros, l'installateur Smartnode ne pourra pas installer automatiquement certaines dépendances système (telles que `docker-compose`).
Certaines étapes manuelles seront nécessaires pendant l'installation.

Pour les systèmes `arm64`, l'installateur Smartnode ne prend en charge nativement que Debian et les distros basées sur Debian comme Ubuntu.
Pour d'autres distros, des étapes manuelles seront nécessaires pendant l'installation.

## Installation du Système d'Exploitation

Si vous utilisez macOS, il est fort probable que vous ayez déjà le système d'exploitation installé et que vous puissiez sauter cette étape.

Si vous installez Linux à partir de zéro, chacune des distributions énumérées ci-dessus est accompagnée de tutoriels utiles et détaillés pour installer le système d'exploitation à partir de zéro.
À titre d'exemple cependant, nous vous guiderons à travers le processus d'installation et de préparation de **Debian Server**.
Debian est un bon choix pour l'exploitation de nœuds car il se concentre sur **la stabilité et la fiabilité maximales** - deux éléments très souhaitables pour les machines de nœuds qui doivent fonctionner 24h/24 et 7j/7.

[Voici un bon guide étape par étape](https://itslinuxfoss.com/debian-11-bullseye-guide/) avec des captures d'écran qui vous montre comment installer Debian sur votre machine de nœud à partir de zéro.

:::tip
Nous avons quelques amendements utiles au guide lié ci-dessus, que vous voudrez peut-être suivre :

- Lorsque vous êtes invité à configurer un **mot de passe root**, nous recommandons de le laisser **vide**. Cela désactivera le compte `root` et installera à la place le package `sudo`, permettant à votre utilisateur d'effectuer des opérations root en saisissant à nouveau son mot de passe pour élever ses permissions. C'est analogue à la façon dont Ubuntu Linux est configuré, ce qui peut être plus familier aux utilisateurs.
- Dans l'écran **Sélection de logiciels** vers la fin, vous pourriez ne pas vouloir avoir une interface graphique de bureau installée.
  - Les interfaces graphiques de bureau sont largement inutiles pour un nœud ; elles ajoutent une surcharge supplémentaire et la plupart du temps ne seront pas utilisées puisque vous le contrôlerez à distance via le terminal de toute façon, nous préférons donc **décocher GNOME et l'environnement de bureau Debian** ici.
  - Si vous _voulez_ une interface de bureau sur votre nœud, nous recommandons de **décocher GNOME et cocher XFCE** à la place, car il est plus léger sur les ressources système. Nous recommandons également de ne pas exécuter de logiciel supplémentaire sur le nœud, comme des navigateurs ou Discord, car ils diminuent la sécurité et consomment des ressources système.
  - Décochez **serveur Web**, mais laissez **serveur SSH** et **utilitaires système standard** cochés.
- Si vous avez créé une clé USB à partir d'une iso, vous devrez peut-être désactiver le référentiel CD-ROM pour pouvoir exécuter `apt`.
  Vous pouvez trouver une explication de la façon de le faire [ici](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/).
- Votre système peut être configuré pour se mettre en veille/hiberner par défaut. Pour désactiver ces paramètres, vous pouvez exécuter la commande suivante :
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### Installation de `sudo`

L'installateur de Rocket Pool nécessite le programme `sudo` pour acquérir toutes ses dépendances.
Si vous avez laissé le **mot de passe de l'utilisateur root vide** à l'étape précédente, vous l'aurez déjà.
Sinon, veuillez l'installer maintenant en exécutant les commandes suivantes :

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Ensuite, redémarrez la machine.
Vous devriez maintenant pouvoir exécuter des commandes via `sudo` telles que `sudo apt update`.

### Utilisation de SSH

Une fois le serveur installé et que vous pouvez vous connecter, vous devez obtenir son adresse IP.
Un moyen facile de le faire est avec `ifconfig` qui est intégré dans le package 'net-tools' :

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Vous pouvez voir plusieurs entrées ici, mais celle que vous voulez rechercher va ressembler à quelque chose comme ceci :

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

Les drapeaux devraient dire `UP,BROADCAST,RUNNING,MULTICAST`.
La valeur `inet` (ici `192.168.1.8`) est l'adresse IP locale de votre machine.

Ensuite, installez SSH :

```shell
sudo apt install openssh-server
```

:::tip NOTE
Si vous aviez la case **serveur SSH** cochée pendant l'installation de Debian, vous devriez déjà avoir cela installé, donc cette commande ne fera rien.
:::

Une fois cela fait, vous pouvez vous connecter au terminal de la machine à distance depuis votre ordinateur portable ou de bureau en utilisant `ssh`.

Si vous n'êtes pas familier avec `ssh`, jetez un œil au guide [Introduction à Secure Shell](../ssh).

:::warning NOTE
À ce stade, vous devriez _fortement envisager_ de configurer votre routeur pour rendre l'adresse IP de votre nœud **statique**.
Cela signifie que votre nœud aura la même adresse IP pour toujours, vous pourrez donc toujours vous connecter en SSH en utilisant cette adresse IP.
Sinon, il est possible que l'IP de votre nœud puisse changer à un moment donné, et la commande SSH ci-dessus ne fonctionnera plus.
Vous devrez entrer dans la configuration de votre routeur pour découvrir quelle est la nouvelle adresse IP de votre nœud.

Chaque routeur est différent, vous devrez donc consulter la documentation de votre routeur pour apprendre comment attribuer une adresse IP statique.
:::

## Configuration de l'Espace d'Échange

Dans la plupart des cas, si vous choisissez vos clients Execution et Consensus et votre type d'instance avec soin, vous ne devriez pas manquer de RAM.
D'un autre côté, cela ne fait jamais de mal d'en ajouter un peu plus.
Ce que nous allons faire maintenant, c'est ajouter ce qu'on appelle **l'espace d'échange**.
Essentiellement, cela signifie que nous allons utiliser le SSD comme "RAM de secours" au cas où quelque chose se passerait horriblement mal et que votre serveur manquerait de RAM normale.
Le SSD n'est pas aussi rapide que la RAM normale, donc s'il atteint l'espace d'échange, cela ralentira les choses, mais il ne plantera pas complètement et ne cassera pas tout.
Considérez cela comme une assurance supplémentaire dont vous n'aurez (très probablement) jamais besoin.

### Création d'un Fichier d'Échange

La première étape consiste à créer un nouveau fichier qui servira d'espace d'échange.
Décidez de la quantité que vous voulez utiliser - un bon départ serait 8 Go, vous avez donc 8 Go de RAM normale et 8 Go de "RAM de secours" pour un total de 16 Go.
Pour être super sûr, vous pouvez le rendre de 24 Go afin que votre système ait 8 Go de RAM normale et 24 Go de "RAM de secours" pour un total de 32 Go, mais c'est probablement excessif.
Heureusement, puisque votre SSD a 1 ou 2 To d'espace, allouer 8 à 24 Go pour un fichier d'échange est négligeable.

Pour les besoins de cette procédure, choisissons un juste milieu - disons, 16 Go d'espace d'échange pour une RAM totale de 24 Go.
Remplacez simplement le nombre que vous voulez au fur et à mesure.

Entrez ceci, qui créera un nouveau fichier appelé `/swapfile` et le remplira avec 16 Go de zéros.
Pour changer la quantité, changez simplement le nombre dans `count=16` par ce que vous voulez. **Notez que cela va prendre beaucoup de temps, mais c'est normal.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

Ensuite, définissez les permissions pour que seul l'utilisateur root puisse lire ou écrire dedans (pour la sécurité) :

```shell
sudo chmod 600 /swapfile
```

Maintenant, marquez-le comme un fichier d'échange :

```shell
sudo mkswap /swapfile
```

Ensuite, activez-le :

```shell
sudo swapon /swapfile
```

Enfin, ajoutez-le à la table de montage pour qu'il se charge automatiquement lorsque votre serveur redémarre :

```shell
sudo nano /etc/fstab
```

Ajoutez une nouvelle ligne à la fin qui ressemble à ceci :

```
/swapfile                            none            swap    sw              0       0
```

Appuyez sur `Ctrl+O` et `Entrée` pour enregistrer, puis `Ctrl+X` et `Entrée` pour quitter.

Pour vérifier qu'il est actif, exécutez ces commandes :

```shell
sudo apt install htop
htop
```

Votre sortie devrait ressembler à ceci en haut :
![](../local/images/pi/Swap.png)

Si le deuxième nombre dans la dernière ligne étiquetée `Swp` (celui après le `/`) est non nul, alors tout est en ordre.
Par exemple, s'il affiche `0K / 16.0G` alors votre espace d'échange a été activé avec succès.
S'il affiche `0K / 0K` alors cela n'a pas fonctionné et vous devrez confirmer que vous avez entré les étapes précédentes correctement.

Appuyez sur `q` ou `F10` pour quitter `htop` et revenir au terminal.

### Configuration de la Swappiness et de la Pression du Cache

Par défaut, Linux utilisera volontiers beaucoup d'espace d'échange pour soulager un peu la pression de la RAM du système.
Nous ne voulons pas cela. Nous voulons qu'il utilise toute la RAM jusqu'à la toute dernière seconde avant de s'appuyer sur l'ÉCHANGE.
L'étape suivante consiste à modifier ce qu'on appelle la "swappiness" du système, qui est essentiellement à quel point il est désireux d'utiliser l'espace d'échange.
Il y a beaucoup de débat sur la valeur à définir pour cela, mais nous avons trouvé qu'une valeur de 6 fonctionne assez bien.

Nous voulons également réduire la "pression du cache", qui dicte à quelle vitesse le serveur supprimera un cache de son système de fichiers.
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

### Vérifications Système de Pré-installation

Avant d'installer Rocket Pool, veuillez passer en revue la liste de contrôle suivante :

- Votre système est entièrement construit, s'allume et peut démarrer dans le système d'exploitation.
- Vous ne ferez aucune autre activité sur le système, comme naviguer sur Internet, consulter vos e-mails ou jouer à des jeux.
- Vous avez un système d'exploitation Linux installé.
- Votre compte utilisateur dispose de privilèges root / administrateur.
- Vous avez un SSD qui répond aux exigences de performance.
- Votre SSD est monté sur votre système de fichiers.
- Vous avez au moins 1,5 To d'espace disque libre pour le processus initial de synchronisation Execution et Consensus.
- Si votre FAI plafonne vos données, c'est plus de 2 To par mois.

Si vous avez vérifié et confirmé tous ces éléments, alors vous êtes prêt à installer Rocket Pool et à commencer à faire fonctionner un nœud !
Passez à la section [Choisir vos Clients ETH](../eth-clients).
