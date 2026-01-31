---
next:
  text: Monitoreo del rendimiento de tu nodo
  link: "/es/node-staking/performance"
---

# Descripción general

En esta sección, aprenderás cómo monitorear la salud de tu nodo y tus validadores, rastrear tus ganancias y realizar mantenimiento periódico como actualizaciones.

## Requisitos previos

Antes de configurar tu Smartnode, asegúrate de:

- Haber configurado una máquina de nodo (o máquina virtual) y asegurado (mediante la guía [Asegurar tu nodo](../securing-your-node))
- Tener el Smartnode [instalado](../installing/overview) y [configurado](../config/overview) en ella
- Tener una billetera de nodo cargada en tu Smartnode
- Sincronizar tus clientes de Ejecución y Consenso
- Aprovisionar tu nodo con [una dirección de retiro](../prepare-node.mdx#setting-your-withdrawal-address), configurar tus [clientes de respaldo](../fallback) (opcional), optar por el [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional) y configurar [MEV](../mev.mdx)
- Crear al menos un [minipool](../create-validator.mdx)

## Guías

[Monitoreo del rendimiento de tu nodo](../performance) proporciona algunas herramientas y tutoriales para vigilar la salud de tu nodo (desde una perspectiva de recursos, como el consumo de CPU y RAM) y el rendimiento de tus validadores en la Beacon Chain.
Cubre muchas herramientas fundamentales que usarás durante tu período como validador de Ethereum.

[Configuración del panel de Grafana](../grafana.mdx) recorre la configuración del rastreador de métricas del stack Smartnode y el panel de Grafana: una ventanilla única para monitorear todo sobre tu nodo y validadores, y un elemento básico en el arsenal de cada operador de nodo.
Recomendamos _enfáticamente_ explorar el panel de Grafana y revisarlo regularmente.

[Notificaciones de alerta del stack Smartnode](./alerting.md) recorre el uso de la funcionalidad de notificación de alertas del Smartnode para recibir notificaciones sobre la salud y eventos importantes de tu Rocket Pool Smartnode.

[Verificación de actualizaciones](../updates) cubre los procesos cruciales de actualizar regularmente tu nodo con nuevos parches de seguridad, cómo actualizar el Smartnode después de un nuevo lanzamiento y cómo actualizar manualmente las versiones del cliente si tus clientes elegidos lanzan una nueva versión que la última versión del Smartnode aún no incluye.
Debes familiarizarte con toda esta sección, ya que es posible que necesites consultarla cada vez que se lance una actualización.

[Realizar copias de seguridad de tu nodo](../backups) es una guía opcional que describe cómo hacer copias de seguridad de la configuración de tu nodo y sus datos de cadena en caso de una falla de hardware.

[Poda del cliente de Ejecución](../pruning) es **importante** para cualquiera que ejecute un cliente de Ejecución que consuma gradualmente todo el espacio en disco de tu SSD y requiera poda periódica (como Geth o Nethermind) para recuperar parte de ese espacio.
Si estás ejecutando uno de esos clientes, definitivamente debes familiarizarte con el proceso de poda.

[Cambio de clientes de Ejecución o Consenso](../change-clients) es una guía útil; repasa el proceso de cambiar tu elección de cliente(s) y qué se puede esperar durante el proceso.
Esta es otra buena guía para familiarizarte, en caso de que alguna vez tengas que cambiar de cliente por cualquier motivo.
