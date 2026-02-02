# La Actualización Redstone de Rocket Pool

La próxima actualización importante de Rocket Pool, titulada **Redstone**, ha sido lanzada para pruebas beta en las redes de prueba Ropsten y Holesky.
Esta página describe los principales cambios que Redstone trae, incluyendo actualizaciones tanto a la pila del Smartnode como al protocolo Rocket Pool en general.

Por favor lee esta página detenidamente para entender todas las diferencias entre la versión anterior de Rocket Pool y Redstone.

::: tip ATENCIÓN
Para información detallada sobre cómo preparar tu nodo para la actualización y qué hacer después de la actualización, por favor consulta las siguientes guías:

- [Guía para Modo Docker](./docker-migration.mdx)
- [Guía para Modo Híbrido](./hybrid-migration.mdx)
- [Guía para Modo Nativo](./native-migration.mdx)

:::

## Cambios de Cliente y The Merge

Ropsten (y próximamente, Holesky) ha completado exitosamente **The Merge de las Capas de Ejecución y Consenso**.
Ya no usa Proof-of-Work; en cambio, los validadores en Ropsten ahora son responsables de crear y proponer bloques en ambas cadenas.
Aunque esto viene con algunos beneficios financieros emocionantes (que se discutirán más adelante), también viene con algunos cambios importantes en la forma en que operan los validadores.

A continuación se presenta un breve resumen de los cambios en el comportamiento del cliente como parte de The Merge:

- Tu cliente de Ejecución ahora usa tres puertos API:
  - Uno para acceso HTTP a su API (**predeterminado 8545**)
  - Uno para acceso Websocket a su API (**predeterminado 8546**)
  - Uno para la nueva **Engine API** usada por clientes de Consenso después de The Merge (**predeterminado 8551**)

- Los clientes de Ejecución ahora requieren un cliente de Consenso para funcionar, y los clientes de Consenso ahora requieren un cliente de Ejecución para funcionar.
  - **Ninguno puede operar de forma aislada ya.**

- Un cliente de Ejecución debe estar vinculado a uno, y solo uno, cliente de Consenso (y viceversa).
  - No podrás vincular múltiples clientes de Ejecución a un solo cliente de Consenso, o múltiples clientes de Consenso a un solo cliente de Ejecución.
  - Debido a esto, **los clientes de ejecución de respaldo ya no están disponibles** para operadores de nodos de Rocket Pool.

- Se requieren **clientes de ejecución completos**.
  - Los proveedores remotos (como Infura y Pocket) ya no pueden ser usados por ningún validador, de Rocket Pool o de otro tipo.

## Destinatarios de Tarifas y Tu Distribuidor

Como los validadores ahora son responsables de crear bloques, eso significa que reciben las **tarifas de prioridad** (también conocidas como **propinas**) adjuntas a cada transacción.
Estas tarifas se pagan en ETH, y se proporcionan directamente a ti cada vez que uno de tus validadores de minipool propone un bloque.
A diferencia del ETH bloqueado en la Beacon Chain, **no tienes que esperar a los retiros para acceder a tus tarifas de prioridad**.
Simplemente se te otorgan como parte del proceso de propuesta de bloques.

Para saber dónde enviar las tarifas, tu cliente Validator requiere un parámetro adicional conocido como el `fee recipient`.
Esta es la dirección en la Capa de Ejecución (ETH1) a la que se enviarán todas las tarifas de prioridad ganadas por tu nodo durante las propuestas de bloques.

Rocket Pool está diseñado para distribuir estas recompensas de manera justa, de la misma manera que distribuye de manera justa tus recompensas de la Beacon chain: la mitad de cualquier tarifa de prioridad que tus validadores de minipool ganen irá para ti (más la comisión promedio de todos tus minipools), y la otra mitad irá a los stakers del pool (menos tu comisión promedio).

Para ese fin, el Smartnode configurará automáticamente el `fee recipient` de tu cliente Validator a una dirección especial conocida como el **distribuidor de tarifas** de tu nodo.
Tu distribuidor de tarifas es un contrato único en la Capa de Ejecución que es **específico para tu nodo**.
Mantendrá todas las tarifas de prioridad que hayas ganado con el tiempo, y contiene la lógica necesaria para dividirlas y distribuirlas de manera justa.
Este proceso de distribución es controlado por ti (el operador del nodo), y se puede hacer cuando gustes.
No tiene un límite de tiempo.

La dirección para el distribuidor de tarifas de tu nodo está **determinísticamente basada en tu dirección de nodo**.
Eso significa que se conoce de antemano, antes de que se cree el distribuidor de tarifas.
**El Smartnode usará esta dirección como tu destinatario de tarifas.**

::: tip NOTA
Por defecto, tu destinatario de tarifas se establecerá en la **dirección de rETH** cuando instales Smartnode v1.5.0 (si las actualizaciones del contrato Redstone aún no se han implementado).
El Smartnode actualizará automáticamente esto a la dirección del distribuidor de tarifas de tu nodo una vez que se haya implementado la actualización Redstone.

Una excepción a esta regla es si has optado por el **Smoothing Pool** - consulta la sección al final de esta página para más información al respecto.
:::

Los nuevos nodos de Rocket Pool inicializarán automáticamente el contrato distribuidor de su nodo al registrarse.
Los nodos existentes necesitarán hacer este proceso manualmente.
Esto solo necesita ejecutarse una vez.

Una ramificación interesante de esto es que la dirección de tu distribuidor puede comenzar a acumular un saldo **antes** de que hayas inicializado el contrato distribuidor de tu nodo.
Esto está bien, porque tu distribuidor obtendrá acceso a todo este saldo existente tan pronto como lo inicialices.

Puedes ver el saldo del distribuidor de tarifas de tu nodo como parte de:

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

Cuando tu distribuidor haya sido inicializado, puedes reclamar y distribuir todo su saldo usando el siguiente comando:

```shell
rocketpool node distribute-fees
```

Esto enviará tu parte de las recompensas a tu **dirección de retiro**.

## Cambios en el Protocolo Rocket Pool

Además de los cambios en los clientes de Ejecución y Consenso y las nuevas tarifas de prioridad, el protocolo Rocket Pool en sí ha experimentado algunos cambios importantes que debes conocer.

### Nuevo Sistema de Recompensas

Uno de los cambios más significativos introducidos con la actualización Redstone es el **nuevo sistema de recompensas**.
Esta es una revisión completa de la forma en que los operadores de nodos reciben sus recompensas RPL (y ETH del Smoothing Pool - discutido más adelante).

El sistema de recompensas _antiguo_ tenía las siguientes desventajas:

- Reclamar costaba aproximadamente 400k gas, lo cual es bastante costoso.
- Los operadores de nodos tenían que reclamar las recompensas en cada intervalo (cada 28 días), o las perderían. Esto significaba que los costos de gas podían volverse prohibitivamente caros para operadores de nodos con pequeñas cantidades de RPL.
- Las recompensas se determinaban en el momento de la _reclamación_, no en el momento del punto de control. Si un usuario hacía stake de una cantidad significativa de RPL entre el punto de control y tu reclamación, tus recompensas podrían diluirse y recibirías menos RPL de lo esperado.

El _nuevo_ sistema de reclamaciones resuelve todos estos problemas.

En cada intervalo, el Oracle DAO creará colectivamente una **instantánea verdadera** del estado de los operadores de nodos en la red de Rocket Pool, incluyendo todas sus cantidades de stake efectivas.
Esta información se compila en un [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) - una forma extremadamente eficiente de hacer que todos los detalles estén disponibles para los contratos inteligentes.
El Merkle Tree se construye en un archivo JSON y se aloja en el [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System), y la raíz del Merkle Tree se envía a los contratos.

Este nuevo sistema tiene las siguientes características:

- Ahora puedes **dejar que las recompensas se acumulen** durante el tiempo que quieras. No hay más límite de tiempo sobre cuándo necesitas reclamar.
- Puedes reclamar **múltiples intervalos** todos a la vez.
- Tu primera transacción de reclamación usa alrededor de 85k gas. Cada transacción de reclamación subsecuente cuesta alrededor de 55k gas.
  - Si estás reclamando múltiples intervalos a la vez, cada intervalo suplementario cuesta **6k gas** por lo que es más rentable reclamar tantos como sea posible a la vez.
- Tus recompensas RPL **ya no se diluyen** - tus recompensas RPL se fijan en el momento de la instantánea, y siempre eres elegible para esa cantidad.
- Puedes **restakear algo (o todo) de tus recompensas RPL** como parte de la transacción de reclamación, lo que reduce aún más los requisitos de gas en comparación con hoy.
- Actualmente, **todas tus reclamaciones deben ser en Mainnet** pero tenemos la infraestructura en su lugar para construir la capacidad de reclamar en redes de Capa 2 en una fecha posterior.

Cuando tu nodo detecte un nuevo punto de control de recompensas, descargará automáticamente el archivo JSON para ese intervalo.
Luego puedes revisar tus recompensas usando el siguiente comando:

```shell
rocketpool node claim-rewards
```

A medida que pasan los intervalos y acumulas recompensas, la salida se verá así:

![](../../node-staking/images/claim-rewards-gb.png)

Aquí puedes ver rápidamente cuántas recompensas has ganado en cada intervalo, y puedes decidir cuáles quieres reclamar.
Ten en cuenta que **el tiempo de intervalo de Ropsten está establecido en 1 día para facilitar las pruebas.**

También puedes especificar una cantidad que quieras restakear durante esta reclamación:

![](../../node-staking/images/autostake.png)

Esto te permitirá componer tus recompensas RPL en una transacción, usando sustancialmente menos gas del que actualmente necesitas usar hoy.

::: tip NOTA
Si prefieres construir el punto de control de recompensas manualmente en lugar de descargar el creado por el Oracle DAO, puedes cambiar esta configuración de `Download` a `Generate` en la TUI:

![](../../node-staking/images/tui-generate-tree.png)

Como implica el consejo, necesitarás acceso a un nodo archivo para hacer esto.
Si tu cliente de Ejecución local no es un nodo archivo, puedes especificar uno separado (como Infura o Alchemy) en el cuadro `Archive-Mode EC URL` debajo de él.
Esta URL solo se usará al generar Merkle trees; no se usará para deberes de validación.
:::

::: danger ADVERTENCIA
Si estás por debajo del 10% de colateral RPL _en el momento de la instantánea_, no serás elegible para recompensas para esa instantánea.
A diferencia del sistema actual, donde simplemente puedes "completar" antes de reclamar para volver a ser elegible, esto quedará bloqueado en esa instantánea para siempre y **nunca recibirás recompensas para ese período**.
**Debes** estar por encima del 10% de colateral en el momento de una instantánea para recibir recompensas para ese período.
:::

### Smoothing Pool

Una última característica nueva emocionante de la actualización Redstone es el **Smoothing Pool**.
El Smoothing Pool es **una característica opcional** que agrupará colectivamente las tarifas de prioridad de cada miembro que opte por ella.
Durante un punto de control de recompensas, el saldo total de ETH del pool se divide en una porción para stakers del pool y una porción para operadores de nodos.
Todas las recompensas en la porción del operador de nodos se **distribuyen de manera justa a cada miembro del pool**.

En esencia, el Smoothing Pool es una forma de eliminar efectivamente la aleatoriedad asociada con las propuestas de bloques en la Beacon Chain.
Si alguna vez has tenido una racha de mala suerte y pasaste meses sin una propuesta, puedes encontrar el Smoothing Pool bastante emocionante.

::: tip NOTA
Las recompensas del Smoothing Pool están integradas en el Merkle Tree usado para recompensas RPL, por lo que las reclamas al mismo tiempo que reclamas RPL usando `rocketpool node claim-rewards`.
:::

Para ayudar a aclarar los detalles, el Smoothing Pool usa las siguientes reglas:

- Optar por el Smoothing Pool se hace a **nivel de nodo**. Si optas, todos tus minipools están incluidos.

- La participación total del operador de nodos se determina por la comisión promedio de cada minipool en cada nodo que ha optado por el Smoothing Pool.

- Cualquiera puede optar en cualquier momento. Deben esperar un intervalo completo de recompensas (1 día en Ropsten, 28 días en Mainnet) antes de optar por salir para evitar manipular el sistema.
  - Una vez que hayas optado por salir, debes esperar otro intervalo completo para volver a optar.

- El Smoothing Pool calcula la "participación" de cada minipool (porción del ETH del pool para el intervalo) propiedad de cada nodo que ha optado.
  - La participación es una función del rendimiento de tu minipool durante el intervalo (calculado mirando cuántas atestaciones enviaste en la Beacon Chain, y cuántas perdiste), y la tasa de comisión de tu minipool.

- La participación total de tu nodo es la suma de las participaciones de tus minipools.

- La participación total de tu nodo se escala por la cantidad de tiempo que estuviste incluido.
  - Si estuviste incluido durante el intervalo completo, recibes tu participación completa.
  - Si estuviste incluido durante el 30% de un intervalo, recibes el 30% de tu participación completa.

Para optar por el Smoothing Pool, ejecuta el siguiente comando:

```shell
rocketpool node join-smoothing-pool
```

Esto te registrará como incluido en los contratos de Rocket Pool y cambiará automáticamente el `fee recipient` de tu cliente Validator de tu contrato distribuidor de nodo al contrato del Smoothing Pool.

Para salir del pool, ejecuta este comando:

```shell
rocketpool node leave-smoothing-pool
```

### El Sistema de Penalizaciones

Para asegurar que los operadores de nodos no "hagan trampa" modificando manualmente el destinatario de tarifas usado en su cliente Validator, Rocket Pool emplea un sistema de penalizaciones.

El Oracle DAO monitorea constantemente cada bloque producido por operadores de nodos de Rocket Pool.
Cualquier bloque que tenga un destinatario de tarifas diferente a una de las siguientes direcciones se considera **inválido**:

- La dirección de rETH
- La dirección del Smoothing Pool
- El contrato distribuidor de tarifas del nodo (si ha optado por salir del Smoothing Pool)

Un minipool que propuso un bloque con un destinatario de tarifas **inválido** recibirá **una advertencia**.
En la tercera advertencia, el minipool comenzará a recibir **infracciones** - cada infracción descontará **10% de su saldo total de Beacon Chain, incluyendo ganancias de ETH** y las enviará a los stakers del pool rETH al retirar fondos del minipool.

Las infracciones están a nivel de **minipool**, no a nivel de **nodo**.

El software Smartnode está diseñado para asegurar que los usuarios honestos nunca sean penalizados, incluso si debe desconectar el cliente Validator para hacerlo.
Si esto sucede, dejarás de atestiguar y verás mensajes de error en tus archivos de registro sobre por qué el Smartnode no puede configurar correctamente tu destinatario de tarifas.

## Guías para Pre y Post-Actualización

Para información detallada sobre cómo preparar tu nodo para la actualización y qué hacer después de la actualización, por favor consulta las siguientes guías:

- [Guía para Modo Docker](./docker-migration.mdx)
- [Guía para Modo Híbrido](./hybrid-migration.mdx)
- [Guía para Modo Nativo](./native-migration.mdx)
