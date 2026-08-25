# Migrar de Solo Staking a Rocket Pool

::: danger LA CONVERSIÓN DE VALIDADORES SOLO YA NO ES POSIBLE
La [actualización Saturn 1](/es/upgrades/saturn-1/whats-new) eliminó la posibilidad de convertir un validador solo existente directamente en un validador de Rocket Pool.
Los minipools - incluidos los minipools "vacantes" que hacían posible la conversión de validadores solo - ya no se pueden crear, y los validadores megapool solo se pueden crear mediante un depósito nuevo en la Beacon Chain.

Para mover tu stake de solo staking a Rocket Pool, ahora debes **salir de tu validador solo** y **crear nuevos validadores bajo un megapool**.
Esta página explica qué cambió y te guía a través del nuevo proceso.
:::

## Qué cambió en Saturn 1

Antes de Saturn 1, un solo staker podía convertir un validador activo en un minipool de Rocket Pool sin salir de la Beacon Chain.
El proceso consistía en crear un minipool "vacante" especial, cambiar las credenciales de retiro del validador de las credenciales BLS `0x00` originales a la dirección del minipool, pasar el scrub check del Oracle DAO y, finalmente, promover el minipool.

La actualización Saturn 1 reemplazó los minipools por los [megapools](/es/node-staking/megapools/overview) como la forma de crear nuevos validadores, y la conversión de validadores solo no se mantuvo:

- **La creación de minipools está deshabilitada a nivel de protocolo**, y eso incluye los minipools vacantes. Ya no existe un contrato de minipool al que puedas apuntar las credenciales de retiro de un validador existente.
- **Los validadores megapool se crean a través de la cola de depósitos de Rocket Pool** con un depósito nuevo en la Beacon Chain: un prestake de 1 ETH, seguido de los 31 ETH restantes una vez que el protocolo ha verificado on-chain las credenciales de retiro del validador.
  Un validador ya activo no puede pasar por este flujo, por lo que no existe ningún mecanismo para absorber un validador solo existente en un megapool.
- Los comandos del Smartnode que se usaban para la conversión (como `rocketpool node create-vacant-minipool` y `rocketpool minipool promote`) han sido eliminados de la CLI.

En resumen: hoy en día la única forma de migrar desde solo staking es **salir de tu validador de la Beacon Chain y usar el ETH retirado para crear nuevos validadores megapool**.

## ¿Por qué migrar?

La migración no es para todos, pero los validadores megapool de Rocket Pool disfrutan de varias ventajas sobre los validadores de solo staking convencionales:

- **Ganan comisión** sobre la porción de ETH que toman prestada de los stakers del pool (28 ETH por validador).
- Tu stake existente de 32 ETH podría usarse para crear hasta **ocho validadores megapool** (con el bono actual de 4 ETH cada uno), ganando comisión sobre hasta 224 ETH de ETH prestado.
- Son elegibles para participar en el [Smoothing Pool](/es/node-staking/fee-distrib-sp#the-smoothing-pool), que agrupa todas las recompensas de la capa de ejecución (por ejemplo, de propuestas de bloques y [recompensas MEV](/es/node-staking/mev)) y las distribuye de forma justa entre los participantes durante cada intervalo de recompensas.
- Si stakeas RPL en tu megapool, ganarás [recompensas de voter share](/es/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (una parte de los ingresos de ETH del protocolo) además de las recompensas de inflación de RPL, junto con poder de voto en la [gobernanza del pDAO](/es/pdao/overview). El staking de RPL es totalmente opcional.

Dicho esto, hay algunas diferencias importantes que conviene destacar:

- Tendrás que aceptar el **riesgo de contratos inteligentes**, ya que el protocolo está implementado como una serie de smart contracts.
- La operación de nodo convencional utiliza el **stack Smartnode**; tendrás que aceptar los riesgos asociados con instalar y ejecutar ese software en tu nodo.
- Ser operador de nodo implica aprender algunos conceptos nuevos, por lo que existe una **curva de aprendizaje** asociada.
- Los validadores megapool comparten sus recompensas con los stakers del pool, por lo que la dirección de retiro de tus validadores será tu contrato megapool en la capa de ejecución, **no una EOA que tú controles**. Esto también aplica a tu **fee recipient** para las recompensas de la capa de ejecución.
- **Tu capital no genera nada mientras está en tránsito.** Entre la salida de tu validador solo y la activación de tus validadores megapool no ganarás recompensas. Los nuevos validadores megapool deben pasar por la cola de depósitos de Rocket Pool _y_ por la cola de la Beacon Chain antes de comenzar a atestiguar, así que lee la sección **Consideraciones de tiempo** más abajo antes de salir de nada.

Te animamos a revisar cuidadosamente estos pros y contras antes de decidirte a migrar.
Si deseas continuar con el proceso, los pasos se describen a continuación.

## Paso 1: Sal de tu validador solo

El primer paso es salir de tu validador solo de la Beacon Chain y retirar su saldo:

1. Si tu validador todavía tiene credenciales de retiro BLS `0x00`, primero debes [actualizarlas a credenciales de retiro de la capa de ejecución](https://launchpad.ethereum.org/en/withdrawals) que apunten a una dirección que controles. Sin esto, tu ETH no podrá retirarse después de la salida.
1. Envía una **salida voluntaria (voluntary exit)** para el validador. Puedes hacerlo con tu cliente de Consenso / Validador; consulta la documentación de tu cliente para los detalles.
1. Espera a que el validador pase por la cola de salida de la Beacon Chain y a que su saldo completo sea barrido a tu dirección de retiro.

::: warning ADVERTENCIA
Una salida voluntaria es **irreversible**. Una vez que tu validador ha salido, no podrá volver a validar nunca - el único camino de regreso es crear un validador nuevo.
Asegúrate de haber leído esta página completa (especialmente la sección **Consideraciones de tiempo**) antes de salir.
:::

[validatorqueue.com](https://www.validatorqueue.com/) es un sitio útil para consultar la longitud actual de la cola de salida de la Beacon Chain.

## Paso 2: Configura un nodo de Rocket Pool

Mientras esperas a que se procese tu salida, puedes ir preparando tu nodo de Rocket Pool.

Si eres nuevo en la operación de nodos de Rocket Pool, comienza con la [guía del Operador de Nodo](/es/node-staking/responsibilities), que cubre todo, desde la selección de hardware hasta la [instalación del stack Smartnode](/es/node-staking/installing/overview) y el [registro de tu nodo](/es/node-staking/prepare-node).
Como has estado ejecutando tu propio validador, gran parte de esto te resultará familiar - y si ya ejecutas tus propios clientes de Ejecución y Consenso, puede interesarte la [configuración híbrida con clientes externos](/es/node-staking/install-modes#the-hybrid-configuration-with-external-clients).

## Paso 3: Crea tus validadores megapool

Una vez que tengas el ETH retirado en tu poder, estás listo para crear validadores megapool usando `rocketpool megapool deposit`.
Actualmente cada validador requiere un **bono de 4 ETH** y toma prestados **28 ETH** del pool de staking, por lo que tus 32 ETH de stake retirado podrían financiar hasta **ocho validadores megapool**.
Tu contrato megapool se despliega automáticamente con el depósito de tu primer validador, y todos los validadores que crees después son gestionados por ese mismo megapool.

La guía [Creando un Megapool (Validador)](/es/node-staking/megapools/create-megapool-validator) te acompaña paso a paso por todo el proceso, incluyendo cómo funciona la cola de depósitos y cómo confirmar un stake exitoso.

::: tip NOTA
A diferencia del antiguo proceso de conversión, tus nuevos validadores usarán **nuevas claves de validador** generadas desde tu wallet del Smartnode.
Tus antiguas claves de validador solo no se reutilizan, y el Validator Client del Smartnode gestionará las nuevas claves por ti - ya no hay un paso de importación de claves.
:::

## Consideraciones de tiempo

El antiguo proceso de conversión no tenía tiempo de inactividad: tu validador seguía atestiguando durante todo el proceso.
El nuevo camino de migración sí implica inactividad, así que vale la pena entender las colas involucradas antes de salir de tu validador solo:

1. **La cola de salida de la Beacon Chain**, que determina qué tan rápido tu validador solo puede salir y ser retirado.
1. **La cola de depósitos de Rocket Pool**, que determina cuándo tus nuevos validadores son emparejados con ETH prestado del pool de depósitos. Los tickets de la cola express se distribuyeron a los operadores de nodo existentes en función del ETH en bond en minipools legacy; los nodos nuevos actualmente no reciben ninguno, por lo que los validadores de un antiguo solo staker entrarán en la **cola estándar**.
1. **La cola de depósitos de la Beacon Chain**, por la que los validadores megapool pasan **dos veces**: una para el prestake de 1 ETH y otra para el stake de los 31 ETH restantes después de que el protocolo verifique las credenciales de retiro del validador.

No ganas recompensas desde el momento en que tu validador solo sale hasta que tus validadores megapool se activan, así que revisa las colas antes de comprometerte.

::: tip Enlaces útiles
[validatorqueue.com](https://www.validatorqueue.com/) es un sitio útil para consultar la longitud de la cola de la Beacon Chain. Esta cola depende de la cantidad de ETH que entra y sale de la Beacon Chain.
:::

Si la cola de depósitos resulta ser más larga de lo que te gustaría, puedes [sacar un validador de la cola de depósitos de Rocket Pool](/es/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) en cualquier momento antes de que se le asigne ETH y recibir tu bono de vuelta como [crédito de depósito](/es/node-staking/megapools/credit), canjeable por rETH.

## Alternativa: hacer staking sin operar un nodo

Si, después de sopesar los pros y contras, prefieres no operar un nodo, puedes simplemente stakear tu ETH retirado con [rETH](/es/liquid-staking/overview) - el token de staking líquido de Rocket Pool - y ganar recompensas de staking sin hardware, mantenimiento ni colas de tu lado.
