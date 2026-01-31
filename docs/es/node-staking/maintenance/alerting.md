# Monitoreo de tu stack Smartnode con notificaciones de alerta

La funcionalidad de notificación de alertas del Smartnode te permite recibir notificaciones sobre la salud y eventos importantes de tu Rocket Pool Smartnode.

## Descripción general del sistema de alertas

La funcionalidad de notificación utiliza [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) para entregar alertas. Las alertas requieren que ya hayas seguido la guía [Configuración del panel de Grafana](../grafana.mdx) que recorre la configuración del rastreador de métricas del stack Smartnode. Las alertas se activan cuando métricas importantes de tu Smartnode exceden ciertos umbrales o cuando ocurren eventos particulares, como cuando se cambia el destinatario de tarifas de tu nodo.

## Configuración de notificaciones de Discord

Actualmente, las notificaciones se pueden enviar a canales de Discord. Puedes configurar notificaciones de Discord dentro de la interfaz de usuario de texto (TUI) de Rocket Pool en la página "Monitoring / Alerting".

### Agregar una URL de webhook de Discord:

1. Navega a tu canal de Discord deseado y abre su configuración.
2. En "Integrations", localiza y haz clic en "Webhooks".
3. Haz clic en "Create Webhook".
4. Dale a tu webhook un nombre y elige un canal para enviar las alertas.
5. Copia la URL de webhook proporcionada.
6. Dentro de la TUI de Rocket Pool, navega a la página "Monitoring / Alerting".
7. Pega la URL de webhook copiada en el campo designado y guarda la configuración.

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
