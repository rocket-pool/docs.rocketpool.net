# La Actualización Atlas

::: tip NOTA
Atlas fue desplegado el `18 de abril de 2023, 00:00 UTC`. Por favor visita [aquí](../houston/whats-new) para leer sobre Houston, la última actualización del protocolo.
:::

Esta página describe los principales cambios que la próxima actualización importante de Rocket Pool, titulada **Atlas**, trae al protocolo incluyendo actualizaciones tanto a la pila Smartnode como al protocolo Rocket Pool en general.

Por favor lee esta página detenidamente para entender todas las diferencias entre la versión anterior de Rocket Pool (Redstone) y Atlas.

## Nuevas Características del Protocolo

Atlas trae algunas características nuevas emocionantes que se basan tanto en la retroalimentación de la comunidad como en cambios al protocolo Ethereum mismo.
A continuación hay una breve lista de estos cambios - haz clic en cualquiera de ellos para aprender más al respecto.

### Shapella y Retiros

El protocolo Ethereum se está preparando para someterse a su próxima actualización importante: **Shanghai** en la capa de Ejecución, y **Capella** en la capa de Consenso - ya que estos ahora están interconectados, ambos ocurrirán al mismo tiempo.
Los usuarios de Ethereum han llegado a llamar cariñosamente a la actualización combinada [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) en consecuencia.

Shapella introduce **retiros** a la Beacon Chain, lo que significa que los operadores de nodos ahora pueden acceder al ETH que actualmente está bloqueado en la Beacon Chain.
Esto viene en dos sabores:

- Retiros parciales (**skimming**), donde tus recompensas (tu saldo excedente de la Beacon Chain sobre 32 ETH) se envían a tu minipool en la Capa de Ejecución. Esto se hace _automáticamente por el protocolo mismo_ cada cierto tiempo (aproximadamente una vez cada cuatro o cinco días en Mainnet).
- **Retiros completos**, donde retiras tu validador de la Beacon Chain y todo su saldo se envía a tu minipool en la Capa de Ejecución. Esto se hace _automáticamente por el protocolo mismo_ una vez que tu validador ha sido retirado de la cadena durante suficiente tiempo.

Atlas introduce un nuevo contrato delegado para minipools que permite a los operadores de nodos **distribuir** el saldo ETH del minipool, dividiéndolo equitativamente entre el operador del nodo y los titulares de rETH (más la comisión, por supuesto) en cualquier momento.
¡Esto da a los operadores de nodos **acceso inmediato** a sus recompensas de la Beacon Chain!
También pone la parte de los titulares de rETH de vuelta en el pool de depósitos, por lo que puede usarse para deshacer el stake de rETH por ETH a la tasa de cambio del protocolo (o para crear nuevos minipools).

### Minipools con Bono de 8-ETH

Uno de los cambios más anticipados hechos en Atlas es la introducción de la capacidad de proporcionar solo 8 ETH para hacer un minipool en lugar de 16 ETH.
Los minipools con solo 8 ETH vinculados por su operador de nodo propietario se emparejan con **24 ETH** del pool de staking (proporcionado por los titulares de rETH) para hacer un validador.
Esto reduce significativamente el requisito de capital para ejecutar tu propio validador _y_ resulta en mayores retornos tanto para el operador del nodo como para los stakers de rETH!
De hecho, ejecutar dos minipools de 8-ETH en lugar de un minipool de 16-ETH proporcionará **más de 18% más de recompensas** - incluso si el minipool de 16-ETH tiene una tasa de comisión del 20%.

Crear un minipool de 8 ETH requiere que hagas stake de un **mínimo de 2.4 ETH en valor de RPL** y un **máximo de 12 ETH en valor de RPL**.
Estos representan el 10% de la cantidad que estás _tomando prestada_ del protocolo, y el 150% de la cantidad que estás _vinculando_ (staking) tú mismo.

Los nuevos minipools se pueden crear con 8 ETH o 16 ETH.
Los minipools de 16 ETH no han cambiado de cómo funcionan hoy, y están disponibles para usuarios que quieren minimizar su exposición al token RPL.

Para aprender cómo hacer nuevos minipools usando un bono de 8 ETH, por favor visita la [guía de creación de minipool](../../node-staking/create-validator.mdx).

Además, una vez que Atlas haya sido aplicado, los operadores de nodos pueden **migrar minipools existentes de 16-ETH directamente a minipools de 8-ETH sin necesidad de salir**.
¡Esto les dará 8 ETH de vuelta en [crédito de depósito](../../node-staking/credit), que puede usarse para crear un **nuevo minipool de 8-ETH gratis**!

Para aprender más sobre minipools con bono de 8-ETH, por favor visita la [guía de reducción de bono](../../node-staking/leb-migration.mdx).

### Conversión de Validador Solo

Parte de la actualización Shapella implica la capacidad para que los validadores solos [cambien las credenciales de retiro de sus validadores](https://notes.ethereum.org/@launchpad/withdrawals-faq) de la clave de retiro original (ahora sin usar) basada en BLS a una dirección en la capa de Ejecución.
Esta dirección será la destinataria de todas las recompensas de ese validador y su saldo completo de ETH una vez que salga de la Beacon Chain.

Los operadores de nodos regulares de Rocket Pool no necesitan preocuparse por nada de esto, ya que el protocolo configuró esto automáticamente para tus minipools cuando los creaste.
_Sin embargo_, como parte de este nuevo requisito para validadores solos, Atlas trae una oportunidad emocionante: la capacidad de **crear un minipool especial** que se convertirá en la dirección de retiro para tu **validador solo existente**.

En otras palabras, ¡esto te permitirá **convertir directamente un validador solo en un minipool de Rocket Pool sin necesidad de salir**!

Esto significa que obtendrás todos los beneficios de los minipools de Rocket Pool, incluyendo:

- La capacidad de convertir tu un validador (con un bono de 32 ETH) en **cuatro minipools** (cada uno con un bono de 8 ETH), efectivamente **cuadruplicando** tu presencia en la Beacon Chain
- Comisión sobre la porción de esos minipools proporcionada por los stakers de rETH
- Acceso al [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) de Rocket Pool para agrupar y distribuir equitativamente las recompensas de las propuestas de bloques y MEV

Para aprender más sobre convertir un validador solo en un minipool, por favor visita la guía [Convirtiendo un Validador Solo en un Minipool](../../node-staking/solo-staker-migration).

## Nuevas Características del Smartnode

Además de los cambios centrales al protocolo Rocket Pool, Atlas también trae algunas actualizaciones emocionantes a la pila Smartnode misma que están presentes en v1.9.0.

### Distribuciones Automáticas de Recompensas

Si ya eres un operador de nodo activo de Rocket Pool, puedes estar familiarizado con el proceso `rocketpool_node` que maneja ciertos procesos automatizados.
Por ejemplo, asegura que tengas el destinatario de tarifas correcto y ejecuta automáticamente la segunda transacción `stake` para ti después de que los minipools `prelaunch` pasen la verificación de limpieza de 12 horas.

Comenzando con Atlas, el `node` tiene un nuevo deber: **¡distribución automática de recompensas de minipool!**
Esto se debe a la forma en que [funciona la actualización Shapella](../../node-staking/skimming), al recolectar tus recompensas de la Beacon Chain a tu minipool cada pocos días.

Cada vez que uno de tus minipools alcance un saldo mayor que un umbral especificado por el usuario (por defecto 1 ETH), el nodo ejecutará automáticamente `distribute-balance` en él.
Esto enviará tu porción de las recompensas a tu dirección de retiro, y la porción del staker del pool de vuelta al pool de depósitos.

Cambiar el umbral se puede hacer en la sección `Smartnode and TX Fees` del TUI de `service config`, bajo la configuración `Auto-Distribute Threshold`.

### Panel de Grafana Unificado

Por demanda popular, hemos creado un nuevo [**panel de Grafana**](https://grafana.com/grafana/dashboards/21863) para ayudar a los operadores de nodos a rastrear y evaluar el estado, progreso y salud general de sus nodos:

![](../../node-staking/images/grafana-1.3.jpg)

Viene con las siguientes características muy solicitadas:

- Soporte para todos los clientes de Ejecución y Consenso en un solo panel - ¡ya no más cambiar de paneles basándose en qué clientes estás usando!
- Estadísticas del cliente de Ejecución, incluyendo uso de CPU y RAM, y conteo de peers
- Seguimiento de precisión de atestiguación que sigue qué tan "correctas" fueron tus atestiguaciones para la época anterior, para que sepas qué tan lejos estás de las recompensas óptimas
- Seguimiento del saldo del Smoothing Pool
- Seguimiento de recompensas reclamadas y no reclamadas, ahora incluyendo ETH del Smoothing Pool
- Estadísticas sobre los votos de gobernanza basados en Snapshot de Rocket Pool
- Espacio para rastrear el espacio usado y temperatura de un segundo SSD si tienes uno para tu SO y otro diferente para tus datos de cadena
- ¡Y más!

Puedes importar el nuevo panel desde el servicio oficial de Grafana usando el ID `21863` siguiendo nuestra [guía de Grafana](../../node-staking/grafana.mdx).

¡Este nuevo panel fue un trabajo de amor que involucró ayuda extensa del miembro de la comunidad **0xFornax** - gracias por todo tu arduo trabajo!

### Cambios en Nimbus

¡Smartnode v1.9.0 introduce soporte de **modo dividido** para Nimbus!
En lugar de ejecutar el Beacon Node y el Cliente Validador dentro de un solo proceso / contenedor, el Smartnode ahora los ejecutará en contenedores separados como los otros clientes. Esto tiene los siguientes beneficios:

- Nimbus ahora soporta **clientes de respaldo** (un cliente de Ejecución secundario y Beacon Node al que el Cliente Validador de Nimbus puede conectarse cuando tus clientes primarios están caídos por mantenimiento, como resincronización).
- Nimbus ahora es soportado en **Modo Gestionado Externamente (Híbrido)**, por lo que puedes acoplar el Cliente Validador que el Smartnode gestiona a un Beacon Node externo que mantienes por tu cuenta.
- El Beacon Node ya no necesita ser reiniciado después de la adición de nuevos minipools, lo que significa que no pierdes atestiguaciones mientras se reconecta a sus peers.

### Soporte para Lodestar

¡[Lodestar](https://chainsafe.github.io/lodestar/) ahora es soportado como una opción para tu Cliente de Consenso de elección!
Esta es la incorporación más reciente para ser oficialmente aceptada en el [Launchpad de Ethereum](https://launchpad.ethereum.org/en/lodestar), y está lista para validación.
Lodestar soporta muchas de las grandes características que has llegado a amar de los otros clientes, incluyendo Detección de Doppelganger, MEV-Boost, clientes gestionados externamente (Modo Híbrido), ¡y más!

### Nuevo Sistema de Snapshot de Red

En una nota un poco más técnica, v1.9.0 introduce un sistema completamente nuevo para capturar rápidamente un snapshot del estado de **todo sobre tu nodo** tanto en las capas de Ejecución como de Consenso.
Bajo el capó, este sistema aprovecha [el contrato multicall de MakerDAO](https://github.com/makerdao/multicall) y el [contrato Ethereum Balance Checker de Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) para agrupar miles de consultas individuales del cliente de Ejecución en una sola solicitud.

Esto hace que el proceso `node` sea mucho menos exigente en el cliente de Ejecución para operadores de nodos con un gran número de validadores, y debería reducir significativamente su carga de CPU lo que mejorará las atestiguaciones y las recompensas generales.

Este nuevo sistema aún no ha llegado al CLI mismo, por lo que cualquier comando que ejecutes allí (como `rocketpool minipool status`) todavía usará la configuración antigua de consulta única.
Con el tiempo lo introduciremos en el CLI también, lo que hará que todos sus comandos sean ultrarrápidos (_excepto por esperar a que las transacciones sean validadas, eso todavía toma un tiempo_).
