# La Actualización Redstone de Rocket Pool

La siguiente actualización importante de Rocket Pool, titulada **Redstone**, ha sido lanzada para pruebas beta en las redes de prueba Ropsten y Holesky.
Esta página describe los cambios importantes que trae Redstone, incluyendo actualizaciones tanto al stack de Smartnode como al protocolo de Rocket Pool en general.

Por favor, lee esta página detenidamente para comprender todas las diferencias entre la versión anterior de Rocket Pool y Redstone.

::: tip ATENCIÓN
Para información detallada sobre cómo preparar tu nodo para la actualización y qué hacer después de la actualización, consulta las siguientes guías:

- [Guía para Modo Docker](./docker-migration.mdx)
- [Guía para Modo Híbrido](./hybrid-migration.mdx)
- [Guía para Modo Nativo](./native-migration.mdx)

:::

## Cambios en los Clientes y The Merge

Ropsten (y próximamente, Holesky) han completado exitosamente **The Merge de las Capas de Ejecución y Consenso**.
Ya no utiliza Proof-of-Work; en su lugar, los validadores en Ropsten ahora son responsables de crear y proponer bloques en ambas cadenas.
Si bien esto trae algunos beneficios financieros emocionantes (que se discutirán más adelante), también viene con algunos cambios importantes en la forma en que operan los validadores.

A continuación, un breve resumen de los cambios en el comportamiento de los clientes como parte de The Merge:

- Tu cliente de Ejecución ahora usa tres puertos API:
  - Uno para acceso HTTP a su API (**predeterminado 8545**)
  - Uno para acceso Websocket a su API (**predeterminado 8546**)
  - Uno para la nueva **Engine API** utilizada por los clientes de Consenso después de The Merge (**predeterminado 8551**)

- Los clientes de Ejecución ahora requieren un cliente de Consenso para funcionar, y los clientes de Consenso ahora requieren un cliente de Ejecución para funcionar.
  - **Ninguno puede operar de forma aislada por más tiempo.**

- Un cliente de Ejecución debe estar vinculado a uno, y solo uno, cliente de Consenso (y viceversa).
  - No podrás vincular múltiples clientes de Ejecución a un solo cliente de Consenso, o múltiples clientes de Consenso a un solo cliente de Ejecución.
  - Debido a esto, **los clientes de ejecución de respaldo ya no están disponibles** para los operadores de nodos de Rocket Pool.

- Se requieren **clientes de ejecución completos**.
  - Los proveedores remotos (como Infura y Pocket) ya no pueden ser utilizados por ningún validador, Rocket Pool o de otro tipo.

## Destinatarios de Tarifas y Tu Distribuidor

Como los validadores ahora son responsables de crear bloques, eso significa que reciben las **tarifas de prioridad** (también conocidas como **propinas**) adjuntas a cada transacción.
Estas tarifas se pagan en ETH, y se te proporcionan directamente cada vez que uno de tus validadores de minipool propone un bloque.
A diferencia del ETH bloqueado en la Beacon Chain, **¡no tienes que esperar retiros para acceder a tus tarifas de prioridad!**
Simplemente se te otorgan como parte del proceso de propuesta de bloques.

Para saber a dónde enviar las tarifas, tu Cliente Validador requiere un parámetro adicional conocido como el `fee recipient`.
Esta es la dirección en la Capa de Ejecución (ETH1) a la que se enviarán todas las tarifas de prioridad ganadas por tu nodo durante las propuestas de bloques.

Rocket Pool está diseñado para distribuir estas recompensas de manera justa, de la misma manera que distribuye tus recompensas de Beacon chain: la mitad de las tarifas de prioridad que ganen tus validadores de minipool irán para ti (más la comisión promedio de todos tus minipools), y la otra mitad irá a los stakers del pool (menos tu comisión promedio).

Con ese fin, el Smartnode establecerá automáticamente el `fee recipient` de tu Cliente Validador a una dirección especial conocida como el **distribuidor de tarifas** de tu nodo.
Tu distribuidor de tarifas es un contrato único en la Capa de Ejecución que es **específico de tu nodo**.
Contendrá todas las tarifas de prioridad que hayas ganado con el tiempo, y contiene la lógica necesaria para dividirlas y distribuirlas de manera justa.
Este proceso de distribución es controlado por ti (el operador del nodo), y se puede hacer cuando lo desees.
No tiene un límite de tiempo.

La dirección del distribuidor de tarifas de tu nodo se basa **determinísticamente en la dirección de tu nodo**.
Eso significa que se conoce de antemano, antes de que el distribuidor de tarifas sea creado.
**El Smartnode usará esta dirección como tu destinatario de tarifas.**

::: tip NOTA
Por defecto, tu destinatario de tarifas se establecerá en la **dirección de rETH** cuando instales Smartnode v1.5.0 (si las actualizaciones del contrato Redstone aún no se han implementado).
El Smartnode actualizará automáticamente esto a la dirección del distribuidor de tarifas de tu nodo una vez que se haya implementado la actualización Redstone.

Una excepción a esta regla es si has optado por el **Smoothing Pool** - consulta la sección al final de esta página para obtener más información al respecto.
:::

Los nuevos nodos de Rocket Pool inicializarán automáticamente el contrato distribuidor de su nodo al momento del registro.
Los nodos existentes deberán hacer este proceso manualmente.
Esto solo debe ejecutarse una vez.

Una ramificación interesante de esto es que la dirección de tu distribuidor puede comenzar a acumular un saldo **antes** de que hayas inicializado el contrato distribuidor de tu nodo.
Esto está bien, porque tu distribuidor obtendrá acceso a todo este saldo existente tan pronto como lo inicialices.

Puedes ver el saldo del distribuidor de tarifas como parte de:

```shell
rocketpool node status
```

La salida se verá así:

![](../../node-staking/images/status-fee-distributor.png)

Para inicializar el distribuidor de tu nodo, simplemente ejecuta este nuevo comando:

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTA
Después de la actualización Redstone, debes llamar a esta función antes de poder crear nuevos minipools con `rocketpool node deposit`.
:::

Cuando tu distribuidor haya sido inicializado, puedes reclamar y distribuir su saldo completo usando el siguiente comando:

```shell
rocketpool node distribute-fees
```

Esto enviará tu parte de las recompensas a tu **dirección de retiro**.

## Cambios del Protocolo Rocket Pool

Además de los cambios en los clientes de Ejecución y Consenso y las nuevas tarifas de prioridad, el protocolo de Rocket Pool en sí ha experimentado algunos cambios importantes que debes conocer.

### Nuevo Sistema de Recompensas

Uno de los cambios más significativos introducidos con la actualización Redstone es el **nuevo sistema de recompensas**.
Esta es una revisión completa de la forma en que los operadores de nodos reciben sus recompensas de RPL (y ETH del Smoothing Pool - discutido más adelante).

El _antiguo_ sistema de recompensas tenía las siguientes desventajas:

- Reclamar costaba aproximadamente 400k gas, lo cual es bastante costoso.
- Los operadores de nodos tenían que reclamar las recompensas en cada intervalo (cada 28 días), o las perderían. Esto significaba que los costos de gas podían volverse prohibitivamente caros para operadores de nodos con pequeñas cantidades de RPL.
- Las recompensas se determinaban al momento de la _reclamación_, no al momento del checkpoint. Si un usuario stakeaba una cantidad significativa de RPL entre el checkpoint y tu reclamación, tus recompensas podían diluirse y recibirías menos RPL del que esperabas.

El _nuevo_ sistema de reclamaciones resuelve todos estos problemas.

En cada intervalo, el Oracle DAO creará colectivamente una **instantánea verdadera** del estado de los operadores de nodos en la red de Rocket Pool, incluyendo todas sus cantidades de stake efectivo.
Esta información se compila en un [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) - una forma extremadamente eficiente de hacer que todos los detalles estén disponibles para los contratos inteligentes.
El Merkle Tree se construye en un archivo JSON y se aloja en el [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System), y la raíz del Merkle Tree se envía a los contratos.

Este nuevo sistema tiene las siguientes características:

- Ahora puedes **dejar acumular recompensas** durante el tiempo que desees. Ya no hay límite de tiempo sobre cuándo necesitas reclamar.
- Puedes reclamar **múltiples intervalos** todos a la vez.
- Tu primera transacción de reclamación usa aproximadamente 85k gas. Cada transacción de reclamación posterior cuesta aproximadamente 55k gas.
  - Si estás reclamando múltiples intervalos a la vez, cada intervalo suplementario cuesta **6k gas** por lo que es más rentable reclamar tantos de ellos a la vez como sea posible.
- Tus recompensas de RPL **ya no se diluyen** - tus recompensas de RPL se fijan al momento de la instantánea, y siempre eres elegible para esa cantidad.
- Puedes **restakear parte (o toda) de tus recompensas de RPL** como parte de la transacción de reclamación, lo que reduce aún más los requisitos de gas en comparación con hoy.
- Actualmente, **todas tus reclamaciones deben ser en Mainnet** pero tenemos la infraestructura para construir la capacidad de reclamar en redes de Capa 2 en una fecha posterior.

Cuando tu nodo detecte un nuevo checkpoint de recompensas, descargará automáticamente el archivo JSON para ese intervalo.
Luego puedes revisar tus recompensas usando el siguiente comando:

```shell
rocketpool node claim-rewards
```

A medida que pasen los intervalos y acumules recompensas, la salida se verá así:

![](../../node-staking/images/claim-rewards-gb.png)

Aquí puedes ver rápidamente cuántas recompensas has ganado en cada intervalo, y puedes decidir cuáles deseas reclamar.
Ten en cuenta que **el tiempo de intervalo de Ropsten está configurado en 1 día para facilitar las pruebas.**

También puedes especificar una cantidad que deseas restakear durante esta reclamación:

![](../../node-staking/images/autostake.png)

Esto te permitirá componer tus recompensas de RPL en una transacción, usando sustancialmente menos gas del que actualmente necesitas usar hoy.

::: tip NOTA
Si prefieres construir el checkpoint de recompensas manualmente en lugar de descargar el creado por el Oracle DAO, puedes cambiar esta configuración de `Download` a `Generate` en el TUI:

![](../../node-staking/images/tui-generate-tree.png)

Como implica la sugerencia, necesitarás acceso a un nodo de archivo para hacer esto.
Si tu cliente de Ejecución local no es un nodo de archivo, puedes especificar uno separado (como Infura o Alchemy) en la casilla `Archive-Mode EC URL` debajo.
Esta URL solo se usará al generar árboles Merkle; no se usará para tareas de validación.
:::

::: danger ADVERTENCIA
Si estás por debajo del 10% de colateral RPL _al momento de la instantánea_, no serás elegible para recompensas para esa instantánea.
A diferencia del sistema actual, donde simplemente puedes "completar" antes de reclamar para volver a ser elegible, esto quedará bloqueado en esa instantánea para siempre y **nunca recibirás recompensas para ese período**.
**Debes** estar por encima del 10% de colateral al momento de una instantánea para recibir recompensas para ese período.
:::

### Smoothing Pool

Una última característica nueva y emocionante de la actualización Redstone es el **Smoothing Pool**.
El Smoothing Pool es **una característica opcional** que agrupará colectivamente las tarifas de prioridad de cada miembro que haya optado por participar.
Durante un checkpoint de recompensas, el saldo total de ETH del pool se divide en una porción para los stakers del pool y una porción para los operadores de nodos.
Todas las recompensas en la porción del operador de nodos se **distribuyen equitativamente a cada miembro del pool**.

En esencia, el Smoothing Pool es una forma de eliminar efectivamente la aleatoriedad asociada con las propuestas de bloques en la Beacon Chain.
Si alguna vez has tenido una racha de mala suerte y has pasado meses sin una propuesta, puedes encontrar el Smoothing Pool bastante emocionante.

::: tip NOTA
Las recompensas del Smoothing Pool se incorporan al Merkle Tree utilizado para recompensas de RPL, por lo que las reclamas al mismo tiempo que reclamas RPL usando `rocketpool node claim-rewards`.
:::

Para ayudar a aclarar los detalles, el Smoothing Pool utiliza las siguientes reglas:

- Optar por el Smoothing Pool se hace a **nivel de nodo**. Si optas por participar, todos tus minipools participan.

- La participación total del operador de nodos se determina por la comisión promedio de cada minipool en cada nodo que haya optado por el Smoothing Pool.

- Cualquiera puede optar por participar en cualquier momento. Deben esperar un intervalo completo de recompensas (1 día en Ropsten, 28 días en Mainnet) antes de optar por salir para evitar manipular el sistema.
  - Una vez que hayas optado por salir, debes esperar otro intervalo completo para volver a optar por participar.

- El Smoothing Pool calcula la "participación" de cada minipool (porción del ETH del pool para el intervalo) propiedad de cada nodo que haya optado por participar.
  - La participación es una función del rendimiento de tu minipool durante el intervalo (calculado mirando cuántas atestaciones enviaste en la Beacon Chain, y cuántas perdiste), y la tasa de comisión de tu minipool.

- La participación total de tu nodo es la suma de las participaciones de tus minipools.

- La participación total de tu nodo se escala por la cantidad de tiempo que estuviste participando.
  - Si estuviste participando durante el intervalo completo, recibes tu participación completa.
  - Si estuviste participando durante el 30% de un intervalo, recibes el 30% de tu participación completa.

Para optar por el Smoothing Pool, ejecuta el siguiente comando:

```shell
rocketpool node join-smoothing-pool
```

Esto te registrará como participante en los contratos de Rocket Pool y cambiará automáticamente el `fee recipient` de tu Cliente Validador del contrato distribuidor de tu nodo al contrato del Smoothing Pool.

Para salir del pool, ejecuta este comando:

```shell
rocketpool node leave-smoothing-pool
```

### El Sistema de Penalización

Para garantizar que los operadores de nodos no "hagan trampa" modificando manualmente el destinatario de tarifas utilizado en su Cliente Validador, Rocket Pool emplea un sistema de penalización.

El Oracle DAO monitorea constantemente cada bloque producido por los operadores de nodos de Rocket Pool.
Cualquier bloque que tenga un destinatario de tarifas diferente a una de las siguientes direcciones se considera **inválido**:

- La dirección de rETH
- La dirección del Smoothing Pool
- El contrato distribuidor de tarifas del nodo (si no ha optado por el Smoothing Pool)

Un minipool que propuso un bloque con un destinatario de tarifas **inválido** recibirá **una falta**.
En la tercera falta, el minipool comenzará a recibir **infracciones** - cada infracción descontará **el 10% de su saldo total de Beacon Chain, incluidas las ganancias de ETH** y las enviará a los stakers del pool de rETH al retirar fondos del minipool.

Las infracciones están a nivel de **minipool**, no a nivel de **nodo**.

El software Smartnode está diseñado para garantizar que los usuarios honestos nunca sean penalizados, incluso si debe desconectar el Cliente Validador para hacerlo.
Si esto sucede, dejarás de atestar y verás mensajes de error en tus archivos de registro sobre por qué el Smartnode no puede establecer correctamente tu destinatario de tarifas.

## Guías para Pre y Post-Actualización

Para información detallada sobre cómo preparar tu nodo para la actualización y qué hacer después de la actualización, consulta las siguientes guías:

- [Guía para Modo Docker](./docker-migration.mdx)
- [Guía para Modo Híbrido](./hybrid-migration.mdx)
- [Guía para Modo Nativo](./native-migration.mdx)
