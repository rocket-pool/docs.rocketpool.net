# Surveiller les performances de votre nœud

Maintenant que votre nœud est opérationnel et que vous avez un ou plusieurs minipools attachés, vous devrez surveiller tout pour vous assurer que tout fonctionne correctement.

Vous pouvez suivre votre machine de deux manières :

1. Directement en exploitant les métriques de votre machine
2. Indirectement via l'utilisation d'outils tiers

Il est recommandé d'utiliser une combinaison des deux selon vos besoins.

## Suivi direct de l'état de votre machine

En ce qui concerne l'état de votre machine, il existe quelques métriques utiles que vous voudrez probablement surveiller :

- Utilisation du CPU
- RAM libre restante
- Utilisation de l'espace d'échange (si vous l'avez activé)
- Espace disque libre restant
- E/S réseau (si votre FAI impose un plafond de données)

::: tip NOTE
Les sections ci-dessous vous montrent quelques façons de surveiller les choses, mais elles nécessitent que vous soyez connecté au terminal de votre machine.
Il existe une méthode meilleure, beaucoup plus pratique et beaucoup plus élégante qui utilise un [tableau de bord web Grafana](./grafana.mdx) mais elle est encore en développement.
Restez à l'écoute pour la fin de cette section !
:::

### CPU, RAM et Swap

Les trois premiers peuvent être facilement visualisés avec le programme `htop`.
Cela vous donnera une belle vue en direct de vos ressources système, comme le montre cette capture d'écran d'un Raspberry Pi :

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

Sur l'affichage du haut avec les barres, les barres numérotées font chacune référence à l'utilisation actuelle d'un cœur CPU.

`Mem` vous montre combien de RAM vous utilisez actuellement (dans cette capture d'écran, 1,75 Go) et combien vous avez au total (3,70 Go).

`Swp` vous montre combien d'espace d'échange vous utilisez (85,8 Mo) et combien vous avez au total (12,0 Go).

Dans le tableau du bas, chaque ligne représente un processus.
Vos clients d'exécution et de consensus seront probablement en haut (dans ce cas, Geth et Nimbus) que vous pouvez voir dans la colonne la plus à droite intitulée `Command`.

La colonne `RES` vous montre combien de RAM chaque processus utilise - dans cette capture d'écran, Geth utilise 748 Mo et Nimbus utilise 383 Mo.

La colonne `CPU%` vous montre combien de puissance CPU chaque processus consomme.
100 % représente un seul cœur, donc s'il dépasse 100 %, cela signifie qu'il utilise beaucoup de plusieurs cœurs (comme Geth ici, avec 213 %).

### Espace disque libre restant

Garder un œil sur la quantité d'espace disque libre que vous avez est facile à faire avec la commande suivante :

```
df -h
```

Cela fournira une sortie similaire à l'exemple suivant :

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Pour les configurations conventionnelles où vous avez un lecteur qui stocke à la fois votre système d'exploitation et vos données de chaîne d'exécution et de consensus, vous devez simplement regarder l'entrée qui a `/` dans la colonne `Mounted on`.
Cela représente votre disque principal.
Si cela semble manquer d'espace (disons, 80 % utilisé environ), alors vous devez commencer à penser à faire un peu de nettoyage.
Par exemple, si vous utilisez Geth, vous voudrez peut-être regarder [comment l'élaguer](./pruning) pour libérer de l'espace.

Pour les configurations qui stockent les données de chaîne d'exécution et de consensus sur un lecteur séparé, vous voudrez également regarder la ligne qui a votre dossier de données de chaîne dans la colonne `Mounted on`.
Dans cet exemple, nous avons monté un SSD externe sur `/mnt/rpdata`, donc nous devrons le surveiller pour nous assurer qu'il ne devient pas trop volumineux non plus.

### E/S réseau et utilisation des données

Si vous voulez suivre combien d'E/S réseau votre système utilise au fil du temps, vous pouvez installer un utilitaire pratique appelé `vnstat`.
Voici un exemple d'installation sur un système Ubuntu / Debian :

```shell
sudo apt install vnstat
```

Pour l'exécuter, faites ceci (en supposant que `eth0` est le nom de l'interface réseau que vous utilisez pour votre connexion Internet) :

```
vnstat -i eth0
```

Cela ne fonctionnera pas tout de suite car il a besoin de temps pour collecter des données sur votre système, mais au fil des jours et des semaines, cela finira par ressembler à ceci :

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

Cela vous permettra de garder un œil sur votre utilisation totale du réseau, ce qui pourrait être utile si votre FAI impose un plafond de données.

Notez que la plupart des systèmes modernes utilisent plus couramment d'autres interfaces réseau comme eno0 et enp0s31f6 et non eth0.
Si vous devez vérifier votre interface réseau, exécutez la commande suivante :

```shell
ls /sys/class/net
```

Les périphériques Ethernet (câble dur) commencent généralement par `e`, comme dans les exemples ci-dessus.
Les périphériques sans fil commencent généralement par `w`.

## Notifications d'alerte Smartnode

[Surveillance de votre pile Smartnode avec des notifications d'alerte](./maintenance/alerting.md) explique comment utiliser la fonctionnalité de notification d'alerte Smartnode pour recevoir des notifications sur la santé et les événements importants de votre Smartnode Rocket Pool.

## Surveillance des performances par des tiers

La meilleure surveillance utilise un modèle de fromage suisse : chaque outil a des trous, mais si vous les empilez les uns sur les autres, il y a moins de chances que quelque chose passe à travers et vous prenne par surprise.

Veuillez noter que ces outils tiers sont utilisés par la communauté Rocket Pool, mais ne sont pas officiellement approuvés ou pris en charge par l'équipe Rocket Pool.
Si vous avez une suggestion d'outil, ou si vous êtes propriétaire d'un outil, vous êtes les bienvenus pour ajouter une pull request avec des détails sur votre outil.

### Site Web Beaconcha.in : Utiliser la Beacon Chain comme source de métriques

Le site Web et l'application de l'explorateur de blocs [Beaconcha.in](https://beaconcha.in) offrent un moyen de suivre les performances de votre validateur en examinant son activité on-chain.
Ils offrent également la possibilité de recevoir des [notifications par e-mail](https://beaconcha.in/user/notifications) pour des événements importants comme les temps d'arrêt.
Accédez à leur site et entrez la clé publique de votre validateur dans la zone de recherche en haut de l'écran.

::: tip
Si vous avez oublié la clé publique de votre validateur, vous pouvez facilement la récupérer avec la commande `rocketpool minipool status`.
:::

Si tout est configuré correctement, vous devriez voir quelque chose comme ceci :
![](./local/images/pi/Beaconchain.png)

::: tip NOTE
Le lien ci-dessus est pour la version **mainnet** de Beaconcha.in.
Si vous utilisez le réseau de test Hoodi, utilisez [ce lien à la place](https://hoodi.beaconcha.in) !
:::

C'est un enregistrement de toute l'activité de la Beacon Chain pour votre validateur.
Vous pouvez l'utiliser pour vérifier le solde de votre validateur sur la Beacon Chain pour le voir croître au fil du temps et calculer votre APY.

Vous pouvez également l'utiliser pour évaluer rapidement si votre validateur est vivant et fonctionne correctement.
S'il l'est, toutes les attestations devraient dire `Attested` pour leur **Status**, et idéalement toutes les **Opt. Incl. Dist.** devraient être 0 (bien qu'un 1 ou 2 occasionnel soit acceptable).

S'il y a beaucoup de blocs qui disent `Missed`, alors votre validateur ne fonctionne pas correctement.
Vous devriez vérifier les journaux des services `eth1`, `eth2` et `validator` avec `rocketpool service logs ...` si vous utilisez le mode Docker ou Hybride (ou les scripts de journaux correspondants si vous utilisez le mode Natif) pour chercher des problèmes.

**Vous devriez épingler cet onglet ou créer un marque-page avec pour pouvoir y accéder rapidement et vérifier l'état de votre validateur.**

#### Utiliser Beaconcha.in pour surveiller plusieurs Minipools

Beaconcha.in dispose d'une [vue tableau de bord](https://beaconcha.in/dashboard) qui vous permet de surveiller plusieurs validateurs ou minipools en même temps.
Ajoutez simplement vos indices de validateur un par un. Si vous avez beaucoup de minipools, vous pouvez exécuter :

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

pour obtenir une liste séparée par des virgules, et la placer dans la barre d'URL comme ceci : `https://beaconcha.in/dashboard?validators=123456,123457`

### Application Beaconcha.in : Aperçu du validateur et notifications push

Le site Web Beaconcha.in est un excellent moyen de visualiser les métriques et de configurer des alertes par e-mail.
Leur application mobile a une nature plus "d'un coup d'œil".
Elle propose également un service de notification push qui inclut des alertes utiles comme :

1. Notifications de problèmes comme les attestations manquées
2. Notifications des cycles de récompenses Rocket Pool
3. Sur/sous-collatéralisation du RPL sur votre nœud

Notez que l'application a une version gratuite et des options payantes avec des fonctionnalités pratiques comme des widgets d'écran d'accueil.

### Renommer vos validateurs sur Beaconcha.in

Le site Web Beaconcha.in a une fonctionnalité qui permet aux utilisateurs de renommer leurs validateurs, les rendant plus faciles à identifier/rechercher.

Pour pouvoir utiliser cette fonctionnalité, vous devez signer un message en utilisant la clé privée de votre portefeuille de nœud, afin de prouver que vous êtes la personne qui contrôle ce validateur.

Le Smartnode v1.5.1 inclut la possibilité de signer des messages avec la clé privée de votre portefeuille de nœud en utilisant la commande `rocketpool node sign-message`, puis en fournissant le message que vous souhaitez signer.
Il doit contenir le terme 'beaconcha.in' pour être utilisé pour renommer vos validateurs.

![](../node-staking/images/sign-message.png)

Ouvrez votre page de validateur sur Beaconcha.in et cliquez sur le bouton `Edit validator name`.

![](../node-staking/images/edit-validator-name.png)

Copiez le résultat de la commande sign-message et collez-le dans le champ "Signature".
Remplissez le surnom souhaité et cliquez sur le bouton `Save changes`.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot : Analyse de port pour la disponibilité

Le service [Uptimerobot](https://uptimerobot.com/) est un service simple qui analyse une adresse IP pour un port ouvert.
Si votre machine devient indisponible sur le port que vous avez spécifié, Uptimerobot peut vous envoyer une notification qu'il y a un problème.
Le service offre une grande variété d'options de notification, y compris l'e-mail, la notification push, les SMS, l'appel téléphonique et les webhooks.

L'écran de configuration ressemble à ceci :

![](./local/images/uptimerobot.png)

L'IP à surveiller est l'IP externe de votre nœud, que vous pouvez trouver en vous connectant à votre nœud par `ssh` ou physiquement, et en ouvrant [icanhazip.com](https://icanhazip.com/) dans un navigateur ou en exécutant la commande suivante dans votre terminal :

```shell
curl icanhazip.com
```

Le port à surveiller dépend de la configuration de votre nœud ; les utilisateurs exécutant l'installation Smartnode typique auront probablement transféré les ports 30303 et 9001 pour les clients d'exécution et de consensus respectivement, ce sont donc de bons choix pour la surveillance de la disponibilité.

### Tableaux de bord des métriques Rocketpool

Il existe plusieurs initiatives menées par la communauté pour fournir un aperçu des performances de votre nœud, ainsi que du réseau Rocket Pool dans son ensemble.

### Script avec Pushover (avancé)

::: tip NOTE
[Surveillance de votre pile Smartnode avec des notifications d'alerte](./maintenance/alerting.md) explique comment utiliser la fonctionnalité de notification d'alerte Smartnode qui inclut une notification lorsqu'il y a des mises à jour disponibles pour votre nœud.
:::

Le service [Pushover](https://pushover.net/) vous permet de vous envoyer des notifications push.

::: warning NOTE
Il s'agit d'une activité avancée à entreprendre.
Elle peut être utile si vous êtes familier avec les scripts shell, mais n'est pas recommandée si vous n'êtes pas à l'aise dans un environnement shell.
:::

Pour commencer avec Pushover :

1. Créez un compte sur [pushover.net](https://pushover.net/)
1. [Créez un jeton API](https://pushover.net/apps/build)
1. Installez l'application mobile Pushover et/ou l'extension de navigateur
1. Appelez l'API Pushover pour toute action qui vous intéresse

Appeler l'API Pushover pour vous envoyer une notification push se fait via un appel `curl` structuré comme suit :

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Exemple : Notification push sur les mises à jour disponibles

Si vous configurez les mises à jour automatiques en utilisant les packages `unattended-upgrades` et `update-nofifier`, vous voudrez peut-être recevoir une notification push lorsqu'il y a des mises à jour disponibles pour votre nœud.
Une façon potentielle de le faire est de créer un script dans `~/update-notifier.sh` et de le déclencher quotidiennement à 9h00 en utilisant `crontab`.

Pour ce faire, créez d'abord le script en exécutant :

```shell
nano ~/update-notifier.sh
```

Ensuite, collez le script suivant :

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

Ensuite, exécutez la commande suivante pour marquer le script comme exécutable :

```shell
chmod u+x ~/update-notifier.sh
```

Maintenant, exécutez la commande suivante pour ouvrir votre crontab :

```shell
crontab -e
```

Ensuite, utilisez les touches fléchées pour faire défiler vers le bas et ajoutez la ligne `* 9 * * * ~/update-notifier.sh` pour que le fichier ressemble à ceci :

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

Appuyez ensuite sur `control+x` pour quitter et appuyez sur `Y` lorsqu'on vous demande si vous voulez enregistrer vos modifications.

Vous devriez maintenant recevoir une notification à 09h00 heure locale si vous avez des mises à jour.
Vous pouvez exécuter manuellement le script en tapant ceci dans votre terminal :

```shell
~/update-notifier.sh
```

#### Exemple : Être notifié lorsque votre démon APC UPS s'active

Certains stakers domestiques utilisent une alimentation sans interruption avec l'utilitaire `apcupsd` pour s'assurer que leur nœud s'arrête correctement en cas de panne de courant.

L'utilitaire `apcupsd` utilise le script `apccontrol` pour gérer sa logique, il est donc possible de surveiller l'activité de ce démon en modifiant le fichier `/etc/apcupsd/apccontrol`.
Pour ce faire, exécutez :

```shell
sudo nano /etc/apcupsd/apccontrol
```

Ensuite, en haut de la ligne, ajoutez le code suivant pour que le fichier ressemble à ceci :

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

Cela vous enverra une notification push chaque fois que votre démon UPS prend des mesures, y compris la fonctionnalité périodique d'"auto-test".
