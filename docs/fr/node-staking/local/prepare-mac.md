# Préparation d'un Mac

Avant d'installer Rocket Pool, il y a quelques vérifications que vous devez effectuer pour vous assurer que votre système est compatible et fonctionnera correctement.

::: danger
Nous vous encourageons fortement à créer une machine dédiée pour faire fonctionner un nœud Rocket Pool.
Faire fonctionner un nœud sur une machine à usage général, comme votre bureau de travail quotidien, présente des risques de sécurité supplémentaires qui peuvent compromettre votre portefeuille et entraîner le vol de vos pièces.

**Pour une sécurité maximale, veuillez construire une nouvelle machine qui est dédiée exclusivement à l'exécution d'un nœud.**
:::

## Configuration Système Requise

Vous trouverez ci-dessous une brève description des exigences logicielles et matérielles qu'un nœud Rocket Pool nécessite.
Ce guide suppose que vous avez déjà votre machine physiquement construite et le système d'exploitation installé.

### Systèmes d'Exploitation Pris en Charge

Rocket Pool vous recommande d'utiliser la dernière version de macOS pour votre matériel.

### Support macOS

Vous devrez installer les prérequis suivants :

Nous recommandons vivement d'utiliser [Homebrew](https://brew.sh) comme gestionnaire de paquets pour Mac. Il vous permet d'installer facilement des paquets en utilisant la commande `brew`.

Vous pouvez l'installer via

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Il devrait installer certains prérequis pour vous, comme XCode Command Line Tools. Si ce n'est pas le cas, vous pouvez les installer manuellement en utilisant

```shell
xcode-select --install
```

Une fois installé, assurez-vous que tout fonctionne correctement en utilisant

```shell
brew doctor
```

Une fois que tout est installé et fonctionne, Homebrew vous permettra d'installer des paquets en utilisant la commande `brew`.

Par exemple, pour installer `wget` en utilisant Homebrew, exécutez la commande suivante dans le Terminal :

```shell
brew install wget
```

Maintenant que nous avons installé Homebrew, nous pouvons installer notre client Docker, [Orbstack](https://orbstack.dev).

```shell
brew install --cask orbstack
```

Orbstack sera installé dans votre dossier Applications. Lancez-le à partir de là et il s'initialisera. Si vous migrez depuis Docker Desktop, il devrait détecter votre installation Docker existante et migrer vos images et conteneurs.

Vous devrez peut-être ajuster vos paramètres Orbstack en fonction de votre matériel.

Si vous avez précédemment installé Docker Desktop, vous devrez d'abord le désinstaller. Docker Desktop était autrefois le client Docker recommandé, mais au cours de la dernière année, quelques nouveaux clients ont été publiés qui offrent une stabilité bien meilleure.

Veuillez vous assurer que votre pare-feu (Réglages Système -> Réseau -> Pare-feu) est activé et qu'Orbstack est ajouté à la liste des applications autorisant les connexions entrantes. (Orbstack devrait le faire pour vous)

![](../local/images/mac/firewall.png)

### Installation et Utilisation de SSH

SSH devrait déjà être installé avec macOS.

### Vérifications Système de Pré-installation

Avant d'installer Rocket Pool, veuillez passer en revue la liste de contrôle suivante :

- Votre système est entièrement construit, s'allume et peut démarrer dans le système d'exploitation.
- Vous ne ferez aucune autre activité sur le système, comme naviguer sur Internet, consulter vos e-mails ou jouer à des jeux.
- Vous avez un système d'exploitation macOS installé.
- Votre compte utilisateur dispose de privilèges root / administrateur.
- Vous avez un SSD qui répond aux exigences de performance.
- Votre SSD est monté sur votre système de fichiers.
- Vous avez au moins 1,5 To d'espace libre pour le processus initial de synchronisation Execution et Consensus.
- Si votre FAI plafonne vos données, c'est plus de 2 To par mois.

Si vous avez vérifié et confirmé tous ces éléments, alors vous êtes prêt à installer Rocket Pool et à commencer à faire fonctionner un nœud !
Passez à la section [Choisir vos Clients ETH](../eth-clients).
