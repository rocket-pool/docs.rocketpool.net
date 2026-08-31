# Surveillance de votre stack Smartnode avec des notifications d'alerte

La fonctionnalité de notification d'alerte du Smartnode vous permet de recevoir des notifications sur la santé et les événements importants de votre Smartnode Rocket Pool.

## Aperçu du système d'alerte

La fonctionnalité de notification utilise [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) pour livrer les alertes. L'alerte nécessite que vous ayez déjà suivi le guide [Configuration du tableau de bord Grafana](../grafana.mdx) qui explique comment configurer le traqueur de métriques de la stack Smartnode. Les alertes sont déclenchées lorsque des métriques importantes de votre Smartnode dépassent certains seuils ou lorsque des événements particuliers se produisent, comme lorsque le destinataire des frais de votre nœud est modifié.

## Configuration des notifications Discord

Actuellement, les notifications peuvent être envoyées vers des canaux Discord et des conversations Telegram. Vous pouvez configurer l'une ou les deux destinations dans l'interface utilisateur texte (TUI) de Rocket Pool sur la page "Monitoring / Alerting".

### Ajout d'une URL de Webhook Discord :

1. Accédez au canal Discord souhaité et ouvrez ses paramètres.
2. Sous "Intégrations", localisez et cliquez sur "Webhooks".
3. Cliquez sur "Créer un Webhook".
4. Donnez un nom à votre webhook et choisissez un canal pour envoyer les alertes.
5. Copiez l'URL de Webhook fournie.
6. Dans le TUI de Rocket Pool, accédez à la page "Monitoring / Alerting".
7. Collez l'URL de Webhook copiée dans le champ désigné et enregistrez la configuration.

## Configuration des notifications Telegram

Vous pouvez configurer les notifications Telegram dans l'interface utilisateur texte (TUI) de Rocket Pool sur la page "Monitoring / Alerting". Les notifications Telegram sont envoyées via l'API Bot de Telegram. Un jeton de bot et un identifiant de conversation numérique sont tous deux requis ; n'en renseigner qu'un seul n'a aucun effet.

### Ajout d'un jeton de bot et d'un identifiant de conversation Telegram :

1. Ouvrez [@BotFather](https://t.me/BotFather) dans Telegram et créez un nouveau bot.
2. Copiez le jeton de bot fourni par BotFather (le jeton uniquement — n'incluez pas le préfixe `bot`).
3. Déterminez si les alertes doivent être envoyées vers une conversation privée (DM) avec vous, un groupe ou un canal.
4. Si vous souhaitez recevoir les alertes en DM, envoyez d'abord `/start` à votre bot. Ouvrez ensuite `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` dans un navigateur (remplacez `<YOUR_BOT_TOKEN>` par le jeton de l'étape 2) et recherchez l'objet `"chat"` :

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

La valeur `"id"` correspond à l'identifiant de conversation que vous devez renseigner dans le champ Telegram Chat ID.

5. Si vous souhaitez recevoir les alertes dans un groupe ou un canal, ajoutez le bot en tant que membre (le bot doit être administrateur pour les canaux). Les identifiants de groupes et de canaux sont négatifs (ils commencent généralement par `-100`). Une fois que le bot peut voir la conversation, utilisez la même URL `getUpdates` pour trouver l'identifiant numérique. Les noms d'utilisateur tels que `@mychannel` ne fonctionneront pas.
6. Dans la TUI de Rocket Pool, accédez à la page "Monitoring / Alerting".
7. Collez le jeton du bot et l'identifiant de conversation numérique dans les champs désignés et enregistrez la configuration.

::: tip ASTUCE
Votre notification préférée est-elle manquante ? L'équipe Rocket Pool recherche activement les retours de la communauté concernant des destinations de notification supplémentaires. N'hésitez pas à suggérer de nouvelles destinations de notification sur https://github.com/rocket-pool/smartnode/issues.
:::

## Désactivation et activation des alertes

Le TUI de Rocket Pool fournit une interface conviviale pour gérer vos alertes. Vous pouvez accéder à cette fonctionnalité via la page "Monitoring / Alerting". Cette interface vous permet de visualiser une liste de toutes les alertes configurées et d'activer ou de désactiver les alertes individuelles selon vos préférences.

## Configuration avancée

::: warning REMARQUE
Cette section est destinée aux utilisateurs avancés qui ont de l'expérience avec Prometheus et la modification de fichiers YAML.
:::

Pour une configuration plus avancée des alertes, vous pouvez ajouter vos propres alertes basées sur n'importe quelle métrique disponible dans le conteneur Prometheus géré par la stack Smartnode. Ajoutez votre propre fichier yaml contenant des [règles d'alerte Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) dans le répertoire `~/.rocketpool/alerting/rules/` et redémarrez le conteneur Prometheus avec `docker stop rocketpool_prometheus` suivi de `docker start rocketpool_prometheus`. Ensuite, exécutez `docker logs rocketpool_prometheus` pour confirmer que Prometheus a chargé votre fichier de configuration avec succès (vous voulez voir une ligne avec _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ et non _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
