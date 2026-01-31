# Selección de un Modo de Rocket Pool

El stack Smartnode de Rocket Pool es bastante flexible; hay varias formas diferentes de ejecutarlo.
Puede crear un nodo completo desde cero, puede integrarse con implementaciones existentes de clientes de Ejecución o Consenso, e incluso puede ejecutarse de forma nativa como un conjunto de servicios del sistema.
En esta sección, cubriremos las formas típicas de configurar y usar el stack Smartnode.

## La Configuración Predeterminada Basada en Docker

El modo predeterminado, y la forma más común de ejecutar un Smartnode, es hacer que cree una instancia de nodo completo en su máquina local que Rocket Pool administra.

Para lograr esto, el Smartnode usa [contenedores Docker](https://www.docker.com/resources/what-container).
En esencia, un contenedor Docker es un sandbox pequeño que viene preconfigurado con un programa, todas sus dependencias y toda la configuración necesaria para funcionar correctamente.
Cuando ya no es necesario, simplemente puede desecharse.
Es un pequeño paquete autocontenido que permite que las cosas funcionen sin ensuciar su sistema de archivos real o otros programas.

Este modo es lo que el instalador de Smartnode desplegará para usted.
Utiliza los siguientes contenedores Docker:

- `rocketpool_api` - Esto contiene la funcionalidad real que proporciona el Smartnode cuando interactúa con él a través de la interfaz de línea de comandos (CLI) de Rocket Pool.
- `rocketpool_node` - Este es un proceso en segundo plano que verificará periódicamente y reclamará recompensas RPL después de un checkpoint de recompensas (si tiene habilitada la reclamación automática, más sobre esto más adelante), y es responsable de hacer staking de nuevos validadores cuando crea un minipool.
- `rocketpool_watchtower` - Esto es usado por los Nodos Oracle para realizar tareas relacionadas con oráculos. Para operadores de nodos regulares, esto simplemente permanecerá inactivo.
- `rocketpool_eth1` - Este será su cliente de Ejecución.
- `rocketpool_eth2` - Este será su cliente de nodo beacon de Consenso.
- `rocketpool_validator` - Este será su cliente Validador, que es responsable de sus deberes de validador (como atestiguar bloques o proponer nuevos bloques).

En la mayoría de las situaciones, esta es una buena opción para elegir al crear un nuevo nodo desde cero.
Es el procedimiento más rápido y con menos intervención manual.
También manejará actualizaciones de los clientes de Ejecución y Consenso con cada nuevo lanzamiento de Smartnode, por lo que no tiene que preocuparse por ellos (aunque puede actualizarlos manualmente en cualquier momento si lo desea).

::: warning NOTA
Actualmente, algunos de los contenedores Docker necesitan ejecutarse como el usuario `root` para funcionar correctamente.
Si bien los contenedores Docker generalmente son bastante buenos para evitar que un usuario escape a su sistema operativo principal, es posible que no se sienta cómodo con este requisito por razones de seguridad.
En este caso, le sugerimos que use el modo de configuración Nativo que se enumera a continuación.
:::

Si desea usar este modo, continúe con la sección [Configuración de un Nodo Rocket Pool Estándar con Docker](./docker).

## La Configuración Híbrida con Clientes Externos

La configuración híbrida es adecuada para usuarios que están interesados en ejecutar un nodo Rocket Pool, pero que ya tienen sus propios clientes de Ejecución y/o Consenso ejecutándose para otros propósitos (por ejemplo, porque ya están haciendo staking en solitario).

En este modo, Rocket Pool desplegará contenedores Docker para sus propios procesos y para un cliente Validador que administra, pero ignorará los contenedores del cliente de Ejecución y del Nodo Beacon para cualquier cliente externo que ya ejecute y mantenga.
**Como Rocket Pool creará y mantendrá nuevas claves de validador para cada uno de los minipools de su nodo, es importante que ejecute su propio cliente Validador.**

Al usar esta configuración, el Smartnode utilizará los siguientes contenedores Docker (que se describieron anteriormente):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

Los contenedores `rocketpool_eth1` y `rocketpool_eth2` se incluirán o excluirán, dependiendo de qué clientes ya tenga ejecutándose externamente.

Si desea usar este modo, continúe con la sección [Configuración de un Nodo Rocket Pool Estándar con Docker](./docker).
Cuando se le solicite elegir un modo de gestión para sus clientes de Ejecución y/o Consenso, elija la opción **Administrado Externamente** que se describe en detalle dentro de esa sección.

## La Configuración Nativa sin Docker

Esta configuración omite Docker por completo.
En lugar de ejecutar el stack Smartnode a través de Docker, cada proceso se instalará como un servicio del sistema local (por ejemplo, a través de `systemd`).
Esto incluye los procesos `node`, `watchtower`, `eth1`, `eth2` y `validator`.

Esta configuración ofrece la mayor flexibilidad porque le permite ajustar finamente los parámetros de Rocket Pool (como su postura de seguridad, dónde viven los clientes de Ejecución y Consenso, dónde viven los datos de la cadena, dónde viven sus claves, etc.).
También es la más difícil de configurar y mantener.

En este modo, el instalador de Smartnode ya no es relevante.
Usted es responsable de instanciar, mantener y actualizar manualmente la infraestructura de Smartnode, los clientes ETH y los clientes validadores.

::: danger ADVERTENCIA
Si bien proporcionamos documentación de ejemplo sobre cómo hacer esto, sugerimos que este modo solo debe ser utilizado por **administradores de sistemas experimentados**.
:::

Si desea usar este modo, continúe con la sección [Configuración de un Nodo Rocket Pool Nativo sin Docker](./native.mdx).
