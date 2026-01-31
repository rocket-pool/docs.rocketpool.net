# Monitoreo de tu Nodo Oracle DAO

Una vez que tu nodo esté en funcionamiento, es importante que monitorees regularmente su estado para asegurarte de que esté realizando correctamente sus tareas automatizadas.
Hacer esto implica lo siguiente:

- Monitorear el estado de tu sistema físico (o virtual) a nivel del sistema operativo
- Monitorear el estado de tus clientes de Ejecución y/o Consenso (si ejecutas clientes locales)
- Asegurarte de que tu nodo envíe regularmente las transacciones requeridas a la cadena para actualizaciones de estado
- Asegurarte de tener un saldo suficiente de ETH en tu wallet del nodo para ejecutar esas transacciones
- Aplicar rutinariamente actualizaciones al Smartnode, tus clientes (si corresponde) y tu Sistema Operativo
- Monitorear el estado de los otros miembros del Oracle DAO, y comunicarte con ellos si crees que su(s) nodo(s) no están funcionando correctamente

En esta sección, describiremos algunos ejemplos de cómo hacer esto a través del soporte integrado de [Grafana](https://grafana.com/) del Smartnode.

## El Dashboard Estándar de Rocket Pool

El Smartnode proporciona un dashboard conveniente que te permite monitorear muchas de las métricas listadas anteriormente.
Hay un dashboard para cada Cliente de Consenso.
A continuación se muestra un ejemplo del dashboard para Nimbus:

![](../node-staking/images/nimbus-dashboard.png)

- El estado del hardware de tu máquina se captura en el cuadrante superior izquierdo.
- Tu cliente de Ejecución está funcionando correctamente si las Estadísticas de Red en el cuadrante inferior izquierdo se están poblando.
- Tu cliente de Consenso está funcionando correctamente si el conteo de pares en el cuadrante superior derecho se actualiza con un número distinto de cero; el número exacto depende de tu elección de cliente y tu configuración de red.
- El saldo de ETH de tu nodo se muestra en la tabla en la parte inferior derecha.
- Cualquier actualización del Sistema Operativo o del Smartnode se presenta en el cuadro `Available Updates` en el panel superior central.

::: tip NOTA
Las actualizaciones del Sistema Operativo y del Smartnode requieren el rastreador de actualizaciones, que puedes instalar mediante `rocketpool service install-update-tracker`.
:::

Para obtener información sobre cómo preparar el sistema de métricas y el dashboard del Smartnode, visita las páginas [Monitoreo del Rendimiento de tu Nodo](../node-staking/performance) y [Configuración del Dashboard de Grafana](../node-staking/grafana.mdx) de la documentación del Smartnode.

## El Dashboard del Oracle DAO

También hemos construido un dashboard simple específicamente diseñado para miembros del Oracle DAO:

![](../odao/images/odao-dashboard.png)

Este dashboard rastrea lo siguiente:

- El estado de las propuestas del Oracle DAO que necesitan ser votadas o ejecutadas (más detalles sobre estas en la siguiente sección)
- El historial de envíos para actualizaciones de precios y balances\*
- Los saldos de ETH de cada nodo del Oracle DAO

\*_Ten en cuenta que el envío de precios y balances actualmente requiere un quórum del 51% de los nodos para acordar cada uno, momento en el cual el envío se canoniza. Los envíos de otros miembros se revertirán ya que ya no son necesarios, por lo que si tu nodo no envía para un intervalo dado, no significa que esté fuera de línea. Deberías preocuparte si pierdes más de 5 intervalos consecutivos seguidos, y deberías revisar los registros del daemon `watchtower` para verificar que no haya ningún problema._

Habilitar este dashboard es un proceso de dos pasos.

Primero, habilita las métricas del Oracle DAO en la sección `Metrics` del editor `rocketpool service config`:

![](../odao/images/tui-odao-metrics.png)

Si estás ejecutando en modo Docker o Hybrid, esto reiniciará tu daemon `node` para aplicar los cambios.
Si estás ejecutando en modo Native, por favor reinicia el servicio `node` manualmente.

Segundo, importa el [dashboard del Oracle DAO](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) desde Grafana Labs (ID `15003`) a tu servidor local de Grafana del nodo.

## Revisión de los Registros

Si tú o uno de los otros miembros del Oracle DAO ha expresado preocupación con tu nodo, la primera línea de defensa es revisar los registros del daemon `watchtower` usando (para modo Docker e Hybrid) el siguiente comando:

```shell
rocketpool service logs watchtower
```

Esto mostrará los registros de `docker` para el contenedor de watchtower, truncando a las últimas cien líneas aproximadamente.

Para ir más atrás, puedes usar la bandera `-t` para indicar el número de líneas.
Por ejemplo:

```shell
rocketpool service logs watchtower -t 2000
```

mostrará las últimas 2000 líneas.
Como esto se desordenará muy rápido, es posible que desees canalizar esto a una utilidad como `less` para que sea desplazable.

## Próximos Pasos

En la siguiente sección, cubriremos las tareas que debes realizar manualmente como miembro del Oracle DAO.
