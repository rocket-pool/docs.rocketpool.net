# Distribuidores de Tarifas y el Smoothing Pool

Ahora que [la Fusión](https://ethereum.org/es/upgrades/merge/) ha pasado, los operadores de nodos reciben **priority fees** (**propinas**) de las transacciones que incluyen en cualquier bloque que proponen a la cadena de Ethereum.
Estas tarifas provienen y permanecen en la capa de Execution.

A diferencia de la mayoría de las recompensas de validación que se generan en la capa de Consensus y se retiran automáticamente periódicamente, estas tarifas son _inmediatamente líquidas_.
En general, las priority fees proporcionan casi tanto ETH como las recompensas de Beacon Chain, por lo que son un muy buen beneficio de la Fusión.

::: tip NOTA
Como un recordatorio rápido, aquí hay un desglose de los diferentes tipos de recompensas y en qué capa se proporcionan:

- Capa de Consensus: attestations, propuestas de bloques, comités de sincronización, reportes de slashing
- Capa de Execution: priority fees y MEV (discutido en la siguiente sección) de propuestas de bloques

:::

## Destinatarios de Tarifas

Cuando propone un bloque en la cadena de Ethereum, el protocolo necesita saber dónde enviar las propinas de cada transacción incluida en su bloque.
No puede enviarlas a la dirección de su validador, porque esa está en la capa de Consensus - no en la capa de Execution.
No puede enviarlas a la dirección de su minipool, porque tiene que funcionar también para stakers solo y los stakers solo no tienen una dirección en la capa de Execution adjunta a sus validadores de la manera en que lo hace Rocket Pool.

En su lugar, la forma en que funciona es bastante directa: cuando Rocket Pool inicia su cliente Validator, pasa un argumento llamado **fee recipient**.
El fee recipient es simplemente una dirección en la capa de Execution donde desea que vayan las propinas.

Rocket Pool está diseñado para distribuir equitativamente estas recompensas entre usted y los stakers del pool de rETH, de la misma manera que distribuye equitativamente sus recompensas de Beacon chain: su porción de cualquier priority fee que ganen sus validadores de minipool irá a usted (más la comisión promedio de todos sus minipools), y la porción restante irá a los stakers del pool (menos su comisión promedio).
La porción exacta depende del número de minipools vinculados de 8 ETH versus 16 ETH que tenga.

Para ese fin, el Smartnode establecerá automáticamente el `fee recipient` de su nodo en cualquiera de estos contratos especiales:

- El **Fee Distributor** personal de su nodo (predeterminado)
- El **Smoothing Pool** (opt-in)

En resumen, el **Fee Distributor** es un contrato único adjunto a su nodo que recopila y divide equitativamente sus priority fees entre usted y los stakers de rETH.
Es como su propia bóveda personal para priority fees.
Cualquiera (incluido usted) puede distribuir su saldo en cualquier momento para asegurar que las recompensas siempre estén disponibles para los stakers de rETH.

El **Smoothing Pool** es un contrato especial de opt-in que permite a todos los operadores de nodos participantes agregar y agrupar sus priority fees juntas, y las distribuye equitativamente entre los participantes durante cada intervalo de recompensas de Rocket Pool (actualmente cada 28 días) y los stakers del pool de rETH.
Esta es una característica muy atractiva para los operadores de nodos que no quieren preocuparse por el factor de suerte involucrado en obtener propuestas de bloques con priority fees altas, y preferirían tener un conjunto agradable, regular y consistente de ganancias mensuales.

Cubriremos ambos a continuación para que entienda la diferencia y si desea unirse o no al Smoothing Pool.

::: tip NOTA
Para minipools creados después del 2024-10-28, se recomienda FUERTEMENTE el smoothing pool, ya que se usa para distribuir comisión de bonificación. Si opta por no participar en el smoothing pool, estos minipools obtendrán una comisión total del 5%. Si opta por participar en el smoothing pool, estos minipools obtendrán entre 10% (sin RPL en stake) y 14% (el stake de RPL tiene un valor del 10% del ETH prestado o más) de comisión.
:::

## Su Fee Distributor

Su Fee Distributor es un contrato único en la capa de Execution que es **específico para su nodo**.
Contendrá todas las priority fees que ha ganado con el tiempo, y contiene la lógica requerida para dividirlas y distribuirlas equitativamente a los stakers del pool de rETH y su dirección de retiro.
Este proceso de distribución **puede ser llamado por cualquiera** (incluidos los stakers de rETH), y puede hacerse **en cualquier momento**.
No tiene un límite de tiempo antes de que las recompensas expiren.

La dirección de su Fee Distributor de nodo es **determinísticamente basada en su dirección de nodo**.
Eso significa que se conoce de antemano, antes de que el Fee Distributor sea siquiera creado.

Los nuevos nodos de Rocket Pool crearán (inicializarán) automáticamente el contrato Fee Distributor de su nodo al registrarse.
Los nodos que fueron creados antes de la actualización de Redstone necesitarán hacer este proceso manualmente.
Esto solo necesita ejecutarse una vez.

Una ramificación interesante de esto es que la dirección de su Distributor puede comenzar a acumular un saldo **antes** de que haya inicializado su contrato Fee Distributor.
Esto está bien, porque su Distributor obtendrá acceso a todo este saldo existente tan pronto como lo inicialice.

**Por defecto, su nodo usará su Fee Distributor como el fee recipient para sus validadores.**

### Ver su Dirección y Saldo

Puede ver la dirección y saldo de su fee distributor como parte de:

```shell
rocketpool node status
```

La salida se verá así:

![](../node-staking/images/status-fee-distributor.png)

### Inicializar el Fee Distributor

Para inicializar el distributor de su nodo, simplemente ejecute este nuevo comando:

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTA
Si creó su nodo antes de la actualización de Redstone, debe llamar a esta función una vez antes de poder crear cualquier minipool nuevo con `rocketpool node deposit`.
:::

Cuando su distributor haya sido inicializado, puede reclamar y distribuir todo su saldo usando el siguiente comando:

```shell
rocketpool node distribute-fees
```

Esto enviará su parte de las recompensas a su **dirección de retiro**.

::: warning NOTA SOBRE EVENTOS IMPONIBLES
Siempre que cree un nuevo minipool, Rocket Pool llamará automáticamente a `distribute-fees`.
Esto es para asegurar que cualquier tarifa que haya acumulado se distribuya usando la comisión promedio de su nodo, que podría cambiar cuando cree el nuevo minipool.

Además, tenga en cuenta que cualquiera puede llamar a `distribute-fees` en su fee distributor (para evitar que usted retenga las recompensas de rETH como rehén).
Puede tener un evento imponible siempre que se llame a este método.

Por favor, tenga en cuenta estas condiciones al decidir si usar o no el Smoothing Pool (discutido a continuación).
:::

### El Sistema de Penalización

Para asegurar que los operadores de nodos no "hagan trampa" al modificar manualmente el fee recipient usado en su cliente Validator, Rocket Pool emplea un sistema de penalización.

El Oracle DAO monitorea constantemente cada bloque producido por los operadores de nodos de Rocket Pool.

Si un nodo está _opted out_ del Smoothing Pool, las siguientes direcciones se consideran fee recipients válidos:

- La dirección de rETH
- La dirección del Smoothing Pool
- El contrato fee distributor del nodo

Si un nodo está _opted in_ al Smoothing Pool, la siguiente dirección se considera un fee recipient válido:

- La dirección del Smoothing Pool

Un fee recipient diferente a una de las direcciones válidas anteriores se considera **inválido**.

Un minipool que propuso un bloque con un fee recipient **inválido** recibirá **una falta**.
En la tercera falta, el minipool comenzará a recibir **infracciones** - cada infracción descontará **10% de su saldo total de Beacon Chain, incluidas las ganancias de ETH** y las enviará a los stakers del pool de rETH al retirar fondos del minipool.

Las infracciones están a nivel de **minipool**, no a nivel de **nodo**.

El software Smartnode está diseñado para asegurar que los usuarios honestos nunca sean penalizados, incluso si debe desconectar el cliente Validator para hacerlo.
Si esto sucede, dejará de atestiguar y verá mensajes de error en sus archivos de registro sobre por qué el Smartnode no puede configurar correctamente su fee recipient.

## El Smoothing Pool

El **Smoothing Pool** es una característica única de opt-in de la red de Rocket Pool que está disponible para nuestros operadores de nodos.
Esencialmente, se convierte en el fee recipient para cada operador de nodo que opta por participar y acumula colectivamente las priority fees de los bloques propuestos por esos operadores de nodos en un gran pool. Durante un checkpoint de recompensas de Rocket Pool (los mismos utilizados para distribuir recompensas de RPL), el saldo total de ETH del pool se distribuye equitativamente a los stakers del pool y los operadores de nodos que optaron por participar.

En esencia, el Smoothing Pool es una forma de eliminar efectivamente la aleatoriedad asociada con ser seleccionado para propuestas de bloques.
Si alguna vez ha tenido una racha de mala suerte y pasó meses sin una propuesta, o si sus propuestas de bloques solo tienen priority fees bajas, puede encontrar el Smoothing Pool muy emocionante.

Para facilitar la comprensión de las matemáticas, el miembro de la comunidad Ken Smith ha elaborado un [análisis masivo](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) comparando la rentabilidad del Smoothing Pool y el Fee Distributor, que se resume muy bien con este gráfico:

![](../node-staking/images/sp-chart.png)

En resumen, mientras el Smoothing Pool tenga más minipools que usted, es más probable que salga beneficiado al unirse.

### Las Reglas

El Smoothing Pool usa las siguientes reglas:

- Durante un checkpoint de recompensas de Rocket Pool cuando se distribuye el saldo del Smoothing Pool, el saldo total de ETH del contrato se divide en dos.
  - Los stakers de rETH reciben 1/2 (para bonos de 16 ETH) o 3/4 (para bonos de 8 ETH también conocidos como LEB8), menos la **comisión promedio** de todos los operadores de nodos que optaron por participar
  - El resto va a los operadores de nodos que optaron por participar.

- Optar por participar en el Smoothing Pool se hace a **nivel de nodo**. Si opta por participar, todos sus minipools están incluidos.

- Cualquiera puede optar por participar en cualquier momento. Deben esperar un intervalo de recompensas completo (3 días en Hoodi, 28 días en Mainnet) antes de optar por salir para evitar jugar con el sistema (por ejemplo, salir del SP justo después de ser seleccionado para proponer un bloque).
  - Una vez que optan por salir, deben esperar otro intervalo completo para volver a optar por participar.

- El Smoothing Pool calcula la "participación" de cada minipool (porción del ETH del pool para el intervalo) propiedad de cada nodo que optó por participar.
  - La participación es una función del rendimiento de su minipool durante el intervalo (calculado mirando cuántas attestations envió en la Beacon Chain, y cuántas perdió), y la tasa de comisión de su minipool.

- La participación total de su nodo es la suma de las participaciones de sus minipools.

- La participación total de su nodo se escala según la cantidad de tiempo que optó por participar.
  - Si optó por participar durante el intervalo completo, recibe su participación completa.
  - Si optó por participar durante el 30% de un intervalo, recibe el 30% de su participación completa.

Si está interesado en los detalles técnicos completos del cálculo de recompensas del Smoothing Pool, por favor revise [la especificación completa aquí](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Unirse y Salir del Smoothing Pool

Para optar por participar en el Smoothing Pool, ejecute el siguiente comando:

```shell
rocketpool node join-smoothing-pool
```

Esto lo registrará como opt-in en los contratos de Rocket Pool y cambiará automáticamente el `fee recipient` de su cliente Validator del contrato distributor de su nodo al contrato del Smoothing Pool.

Para salir del pool, ejecute este comando:

```shell
rocketpool node leave-smoothing-pool
```

Esto lo registrará como opted-out en los contratos de Rocket Pool, y una vez que haya pasado un pequeño retraso, cambiará automáticamente el `fee recipient` de su cliente Validator del contrato del Smoothing Pool de nuevo al contrato Fee Distributor de su nodo.

### Reclamar Recompensas del Smoothing Pool

Las recompensas del Smoothing Pool se agrupan junto con RPL al final de cada intervalo de recompensas usando el sistema de recompensas de Redstone.
Reclamarlas es tan simple como ejecutar:

```shell
rocketpool node claim-rewards
```

Si optó por participar en el Smoothing Pool, notará que la cantidad de ETH que recibe por cada intervalo es mayor que cero:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Tenga en cuenta que las recompensas del Smoothing Pool en el Intervalo 1 aquí indican que el nodo optó por participar durante ese intervalo y recibió recompensas en consecuencia.

Cubriremos más sobre la reclamación de recompensas de RPL y Smoothing Pool más adelante en la guía, en la sección [Reclamar Recompensas](./rewards).

## Próximos Pasos

Una vez que haya decidido si desea unirse o no al Smoothing Pool, eche un vistazo a la siguiente sección sobre MEV y recompensas de MEV.
