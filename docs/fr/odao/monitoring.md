# Surveiller votre nœud Oracle DAO

Une fois votre nœud opérationnel, il est important de surveiller régulièrement sa santé pour vous assurer qu'il effectue correctement ses tâches automatisées.
Cela implique les éléments suivants :

- Surveiller la santé de votre système physique (ou virtuel) au niveau du système d'exploitation
- Surveiller la santé de vos clients d'exécution et/ou de consensus (si vous exécutez des clients locaux)
- S'assurer que votre nœud soumet régulièrement les transactions requises à la chaîne pour les mises à jour de statut
- S'assurer que vous disposez d'un solde ETH suffisant dans votre portefeuille de nœud pour exécuter ces transactions
- Appliquer régulièrement les mises à jour du Smartnode, de vos clients (le cas échéant) et de votre système d'exploitation
- Surveiller la santé des autres membres de l'Oracle DAO et communiquer avec eux si vous pensez que leur(s) nœud(s) ne fonctionne(nt) pas correctement

Dans cette section, nous décrirons quelques exemples de la façon de procéder via le support intégré de [Grafana](https://grafana.com/) du Smartnode.

## Le tableau de bord standard Rocket Pool

Le Smartnode fournit un tableau de bord pratique qui vous permet de surveiller de nombreuses métriques listées ci-dessus.
Il existe un tableau de bord pour chaque client de consensus.
Voici un exemple du tableau de bord pour Nimbus :

![](../node-staking/images/nimbus-dashboard.png)

- La santé matérielle de votre machine est capturée dans le quadrant supérieur gauche.
- Votre client d'exécution fonctionne correctement si les statistiques réseau dans le quadrant inférieur gauche sont renseignées.
- Votre client de consensus fonctionne correctement si le nombre de pairs dans le quadrant supérieur droit se met à jour avec un nombre non nul ; le nombre exact dépend de votre choix de client et de votre configuration réseau.
- Le solde ETH de votre nœud est affiché dans le tableau en bas à droite.
- Toute mise à jour du système d'exploitation ou du Smartnode est présentée dans la boîte `Available Updates` dans le panneau central supérieur.

::: tip NOTE
Les mises à jour du système d'exploitation et du Smartnode nécessitent le tracker de mise à jour, que vous pouvez installer via `rocketpool service install-update-tracker`.
:::

Pour plus d'informations sur la façon de préparer le système de métriques et le tableau de bord Smartnode, veuillez consulter les pages [Surveiller les performances de votre nœud](../node-staking/performance) et [Configuration du tableau de bord Grafana](../node-staking/grafana.mdx) de la documentation Smartnode.

## Le tableau de bord Oracle DAO

Nous avons également construit un tableau de bord simple spécialement conçu pour les membres de l'Oracle DAO :

![](../odao/images/odao-dashboard.png)

Ce tableau de bord suit les éléments suivants :

- Le statut des propositions de l'Oracle DAO sur lesquelles il faut voter ou qui doivent être exécutées (plus de détails à ce sujet dans la section suivante)
- L'historique des soumissions pour les mises à jour de prix et de solde\*
- Les soldes ETH de chaque nœud Oracle DAO

\*_Notez que la soumission de prix et de solde nécessite actuellement un quorum de 51 % de nœuds pour s'accorder sur chacune, moment auquel la soumission est canonisée. Les soumissions d'autres membres seront annulées car elles ne sont plus nécessaires, donc si votre nœud ne soumet pas pour un intervalle donné, cela ne signifie pas qu'il est hors ligne. Vous devriez vous inquiéter si vous manquez plus de 5 intervalles consécutifs, et devriez vérifier vos logs du démon `watchtower` pour vérifier qu'il n'y a pas de problèmes._

L'activation de ce tableau de bord est un processus en deux étapes.

Tout d'abord, activez les métriques Oracle DAO dans la section `Metrics` de l'éditeur `rocketpool service config` :

![](../odao/images/tui-odao-metrics.png)

Si vous exécutez en mode Docker ou Hybrid, cela redémarrera votre démon `node` pour appliquer les modifications.
Si vous exécutez en mode Native, veuillez redémarrer le service `node` manuellement.

Deuxièmement, importez le [tableau de bord Oracle DAO](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) depuis Grafana Labs (ID `15003`) dans le serveur Grafana local de votre nœud.

## Vérifier les logs

Si vous ou l'un des autres membres de l'Oracle DAO avez exprimé des inquiétudes concernant votre nœud, la première ligne de défense consiste à consulter les logs du démon `watchtower` en utilisant (pour les modes Docker et Hybrid) la commande suivante :

```shell
rocketpool service logs watchtower
```

Cela affichera les logs `docker` du conteneur watchtower, tronqués aux cent dernières lignes environ.

Pour remonter plus loin, vous pouvez utiliser le flag `-t` pour indiquer le nombre de lignes.
Par exemple :

```shell
rocketpool service logs watchtower -t 2000
```

affichera les 2000 dernières lignes.
Comme cela deviendra rapidement encombré, vous voudrez peut-être rediriger cela vers un utilitaire comme `less` pour pouvoir le faire défiler.

## Prochaines étapes

Dans la section suivante, nous couvrirons les tâches que vous devez effectuer manuellement en tant que membre de l'Oracle DAO.
