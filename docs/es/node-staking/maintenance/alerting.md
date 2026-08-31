# Monitoreo de tu stack Smartnode con notificaciones de alerta

La funcionalidad de notificación de alertas del Smartnode te permite recibir notificaciones sobre la salud y eventos importantes de tu Rocket Pool Smartnode.

## Descripción general del sistema de alertas

La funcionalidad de notificación utiliza [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) para entregar alertas. Las alertas requieren que ya hayas seguido la guía [Configuración del panel de Grafana](../grafana.mdx) que recorre la configuración del rastreador de métricas del stack Smartnode. Las alertas se activan cuando métricas importantes de tu Smartnode exceden ciertos umbrales o cuando ocurren eventos particulares, como cuando se cambia el destinatario de tarifas de tu nodo.

## Configuración de notificaciones de Discord

Actualmente, las notificaciones se pueden enviar a canales de Discord y chats de Telegram. Puedes configurar uno o ambos destinos dentro de la interfaz de usuario de texto (TUI) de Rocket Pool en la página "Monitoring / Alerting".

### Agregar una URL de webhook de Discord:

1. Navega a tu canal de Discord deseado y abre su configuración.
2. En "Integrations", localiza y haz clic en "Webhooks".
3. Haz clic en "Create Webhook".
4. Dale a tu webhook un nombre y elige un canal para enviar las alertas.
5. Copia la URL de webhook proporcionada.
6. Dentro de la TUI de Rocket Pool, navega a la página "Monitoring / Alerting".
7. Pega la URL de webhook copiada en el campo designado y guarda la configuración.

## Configuración de notificaciones de Telegram

Puedes configurar las notificaciones de Telegram dentro de la interfaz de usuario de texto (TUI) de Rocket Pool en la página "Monitoring / Alerting". Las notificaciones de Telegram se envían a través de la API de Bots de Telegram. Se requieren tanto un token de bot como un ID de chat numérico; completar solo uno no hace nada.

### Agregar un token de bot y un ID de chat de Telegram:

1. Abre [@BotFather](https://t.me/BotFather) en Telegram y crea un nuevo bot.
2. Copia el token de bot que proporciona BotFather (solo el token — no incluyas el prefijo `bot`).
3. Decide si las alertas deben ir a un chat privado (DM) contigo, a un grupo o a un canal.
4. Si quieres alertas en un DM, primero envía `/start` a tu bot. Luego abre `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` en un navegador (reemplaza `<YOUR_BOT_TOKEN>` con el token del paso 2) y busca el objeto `"chat"`:

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

El valor de `"id"` es el ID de chat que debes establecer en el campo Telegram Chat ID.

5. Si quieres alertas en un grupo o canal, agrega el bot como miembro (el bot debe ser administrador en los canales). Los ID de grupos y canales son negativos (normalmente comienzan con `-100`). Una vez que el bot pueda ver el chat, usa la misma URL `getUpdates` para encontrar el ID de chat numérico. Los nombres de usuario como `@mychannel` no funcionarán.
6. Dentro de la TUI de Rocket Pool, navega a la página "Monitoring / Alerting".
7. Pega el token del bot y el ID de chat numérico en los campos designados y guarda la configuración.

::: tip CONSEJO
¿Falta tu notificación favorita? El equipo de Rocket Pool está buscando activamente comentarios de la comunidad sobre destinos de notificación adicionales. Siéntete libre de sugerir nuevos destinos de notificación en https://github.com/rocket-pool/smartnode/issues.
:::

## Deshabilitar y habilitar alertas

La TUI de Rocket Pool proporciona una interfaz fácil de usar para administrar tus alertas. Puedes acceder a esta funcionalidad a través de la página "Monitoring / Alerting". Esta interfaz te permite ver una lista de todas las alertas configuradas y habilitar o deshabilitar alertas individuales según tu preferencia.

## Configuración avanzada

::: warning NOTA
Esta sección es para usuarios avanzados que tienen experiencia con Prometheus y modificación de archivos YAML.
:::

Para una configuración más avanzada de alertas, puedes agregar las tuyas propias basadas en cualquier métrica que esté disponible en el contenedor Prometheus administrado por el stack Smartnode. Agrega tu propio archivo yaml que contenga [reglas de alerta de Prometheus](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) en el directorio `~/.rocketpool/alerting/rules/` y esas reglas y reinicia el contenedor Prometheus con `docker stop rocketpool_prometheus` seguido de `docker start rocketpool_prometheus`. Luego ejecuta `docker logs rocketpool_prometheus` para confirmar que Prometheus cargó tu archivo de configuración exitosamente (quieres ver una línea con _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ y no _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
