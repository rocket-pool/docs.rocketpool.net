::: danger ADVERTENCIA
Los depósitos de minipool están actualmente deshabilitados en preparación para Saturn 1.
:::

# Convirtiendo un Validador Solo en un Minipool

Cuando se lanzó por primera vez la Beacon Chain, los validadores se crearon con un par especial de claves criptográficas: la **clave del validador** y la **clave de retiro**.

La clave del validador es una "clave caliente", lo que significa que debe almacenarse en una máquina activa conectada a Internet; esta es la clave utilizada para firmar tus atestaciones y propuestas, y también sirve como tu "dirección" en la Beacon Chain (la cadena hexadecimal utilizada para identificar tu validador).

La clave de retiro, por otro lado, es una "clave fría", lo que significa que _no_ (y de hecho, _no debería_) almacenarse en una máquina activa conectada a Internet.
Está destinada a ser guardada en almacenamiento en frío para que no pueda ser accedida hasta que sea necesaria.
A diferencia de la clave del validador, la clave de retiro no es responsable de las tareas de validación en absoluto.
En su lugar, su único trabajo es gestionar el retiro de los fondos de tu validador en la Beacon Chain (una vez que se implementaron los retiros).

Este sistema de doble clave fue la arquitectura inicial con la que se lanzó la Beacon Chain.
En ese momento, ni el Merge ni los retiros habían sido diseñados todavía, pero se consideró que este sistema era lo suficientemente robusto como para manejar cualquier forma que tomara el protocolo cuando ambos se implementaran.

Avanzando hasta hoy, ahora tenemos una comprensión mucho mejor de cómo funcionan los retiros.
Afortunadamente, se han implementado de una manera que hace posible que un validador de staking solo existente en la Beacon Chain (que está usando las credenciales antiguas de clave de retiro) se convierta **directamente en un minipool de Rocket Pool** sin necesidad de salir del validador de la Beacon Chain.

Si estás interesado en aprender más sobre este proceso, entonces esta guía es para ti.
Cubriremos cómo funcionan los retiros en Ethereum a alto nivel, explicaremos cómo funciona el proceso de conversión y terminaremos con un tutorial detallado de cómo convertir tu validador en un minipool.

## ¿Por Qué Convertiría?

Antes de entrar en los detalles técnicos, una pregunta muy importante a responder es _por qué_ un staker solo consideraría este proceso en primer lugar.
La conversión en un minipool no es para todos, pero esta sección te ayudará a tomar una decisión informada sobre si es algo que te gustaría seguir o no.

Los minipools de Rocket Pool disfrutan de varias ventajas sobre los validadores de staking solo convencionales:

- **Ganan comisión** sobre la porción de ETH que toman prestada de los pool stakers (24 ETH).
- Tu bono existente de 32 ETH podría usarse para crear hasta **tres validadores adicionales** (además del que ya tienes).
- Son elegibles para participar en el [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) que agrupa todas las recompensas de la capa de ejecución (por ejemplo, de propuestas de bloques y [recompensas MEV](./mev.mdx)) y las distribuye equitativamente entre los participantes durante cada intervalo de recompensas.
- Si stakeas RPL, ganarán comisión adicional y recompensas de inflación de RPL (que actualmente proporcionan un APR más alto que las recompensas de staking de ETH).

Dicho esto, hay algunas diferencias importantes a destacar:

- Tendrás que aceptar **riesgo de smart contract**, ya que el protocolo está implementado como una serie de smart contracts.
- Del mismo modo, la operación de nodo convencional aprovecha el **stack de Smartnode**; tendrás que aceptar cualquier riesgo asociado con la instalación y ejecución de ese software en tu nodo.
- Ser un Node Operator implica aprender algunos conceptos nuevos, por lo que hay una **curva de aprendizaje** asociada con convertirse en uno.
- Los minipools están obligados a dividir sus recompensas con los pool stakers, por lo que la dirección de retiro del validador será un smart contract en la capa de ejecución, **no una EOA que controles**. Esto también se aplica a tu **fee recipient** para las recompensas de la capa de ejecución, que también debe ser un smart contract que pueda dividir equitativamente tus recompensas.
- El **Oracle DAO** de Rocket Pool es responsable de transportar información de la Beacon Chain a la capa de ejecución, y de detectar violaciones que el protocolo no puede hacer cumplir (como una dirección de fee recipient ilegal). Ejecutar un minipool significa que tendrás que confiar en el Oracle DAO para hacer ese trabajo correctamente.

Te animamos a revisar cuidadosamente estos pros y contras antes de decidir convertir tu validador solo.
Si deseas continuar con el proceso, lee las siguientes secciones.

## Requisitos Previos

Para comenzar el proceso de conversión, deberás cumplir con los siguientes criterios:

1. Debes tener [un nodo registrado con la red de Rocket Pool](./prepare-node.mdx) para alojar el nuevo minipool.
1. El validador que deseas migrar debe estar **activo** en la Beacon chain. No puede estar pendiente, slashed, saliendo / salido o retirado.
1. El validador debe tener un saldo de **al menos 32 ETH** en la Beacon chain.
1. El validador debe tener [credenciales de retiro de clave BLS](https://launchpad.ethereum.org/en/withdrawals) (credenciales `0x00`). La conversión **no puede** realizarse en validadores que ya han migrado a otras credenciales de retiro de la capa de ejecución (credenciales `0x01`).
1. (Opcional) Si tienes la intención de que el Smartnode migre automáticamente las credenciales de retiro por ti, debes tener tu **frase mnemónica a mano**.

Si ninguna de estas condiciones es un obstáculo para ti, entonces eres elegible para comenzar la conversión del validador.

## Descripción General del Proceso

El primer paso es **crear un nuevo "minipool vacante"**.
A diferencia de los minipools convencionales, que crean un nuevo validador durante su creación, los minipools vacantes son minipools especiales diseñados para gestionar validadores _existentes_.
Como consecuencia, los minipools vacantes se comportan ligeramente diferente a los minipools convencionales durante la etapa `prelaunch`.
Una vez que finaliza la inicialización y entran en la etapa `staking`, se convierten en minipools convencionales.

Durante la creación del minipool vacante, se te dará la opción de que el Smartnode **cambie automáticamente las credenciales de retiro de tu validador** de la antigua clave de retiro BLS a la nueva dirección del minipool vacante.
Si no quieres hacer esto ahora, puedes hacer que el Smartnode lo haga más tarde con un comando dedicado, o puedes hacerlo tú mismo con una herramienta de terceros.
Ten en cuenta que cambiar las credenciales de retiro del validador a la dirección del minipool es **requerido** para la conversión, por lo que independientemente de cómo lo hagas, deberá hacerse para que el proceso se complete con éxito.

Una vez que se hayan cambiado las credenciales de retiro, tendrás la opción de **importar la clave privada del validador** en el Validator Client gestionado por el Smartnode.
Si deseas que el Smartnode mantenga el validador para que no tengas que administrar el tuyo propio, esta es una opción atractiva.
Si prefieres mantener tu propio Validator Client y mantener las claves allí, puedes hacerlo.

En este punto, tu nuevo minipool entrará en el período de **scrub check**, donde el Oracle DAO analizará continuamente la información de tu validador en la Beacon Chain para confirmar que permanece legal.
Esto incluye:

- Las credenciales de retiro aún no han sido migradas (siguen siendo las credenciales de clave BLS originales `0x00`) o han sido migradas a la dirección del minipool. Migrarlas a cualquier otra dirección de la capa de ejecución causará que el pool sea scrubbed.
  - Si las credenciales de retiro siguen siendo las credenciales de clave BLS originales `0x00` cuando termina el período de scrub check, el pool será scrubbed.
- El validador está en el estado de staking activo durante la duración de la verificación. Si transiciona a los estados slashed, exited o withdrawn, el pool será scrubbed.

::: tip NOTA
Un minipool vacante **scrubbed** significa que no es parte de la red de Rocket Pool, pero aún te dará (al Node Operator) acceso a todos tus fondos a través de los métodos típicos de recuperación de tokens en la CLI.
Los fondos **no se pierden** si los minipools vacantes son scrubbed.
Más información sobre minipools scrubbed, sus ramificaciones y cómo usarlos se incluye más adelante en esta guía.
:::

Después de que pase el scrub check, podrás **promover** tu minipool vacante.
Esto finalizará la conversión y lo cambiará de un minipool vacante a uno regular.
En este punto, el minipool actuará como cualquier otro minipool en la red, y tu validador solo se habrá convertido oficialmente en un validador de Rocket Pool.

Como parte del proceso, la red tomará una instantánea de tus recompensas totales en la Beacon chain (y dentro de tu nuevo minipool, si recibes un skim durante el scrub check).
Reconocerá que todas esas recompensas te pertenecen y no deben compartirse con el staking pool, por lo que las proporcionará todas como un **reembolso** que puedes reclamar en cualquier momento una vez que se complete la promoción.

A continuación se muestra un tutorial detallado del proceso de conversión, que incluye instrucciones para cada paso.

## Paso 1: Crear un Minipool Vacante

Para comenzar el proceso de conversión, ejecuta el siguiente comando con la CLI de Smartnode:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Por ejemplo, si deseas convertir un validador solo con pubkey `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`, ejecutarías:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Verás un breve resumen sobre qué esperar durante el proceso, luego se te pedirá qué cantidad de bono te gustaría usar al crear este minipool:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

Una vez que selecciones **8 ETH**, convertirás tu validador en un minipool con bono de 8 ETH.
Tu depósito original de 32 ETH se convertirá en un depósito de 8 ETH, con 24 ETH prestados de los pool stakers.
Una vez que se complete el proceso de conversión, tendrás un [saldo de crédito](./credit) de 24 ETH que puedes usar para crear más minipools.

Una vez que selecciones una opción, el Smartnode ejecutará algunas verificaciones para confirmar que tanto el validador que ingresaste como tu nodo cumplan con todos los requisitos previos enumerados anteriormente.
Después de eso, te pedirá que confirmes tu precio de gas y luego envíe la transacción para crear el nuevo minipool vacante.
Al crearlo, se te presentará la dirección del minipool:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Esta es la dirección que usarás al cambiar las credenciales de retiro de tu validador.

En este punto, el Smartnode te preguntará si deseas que el Smartnode lo haga automáticamente (junto con importar la clave privada del validador en el Validator Client gestionado por el Smartnode, que se discute más adelante):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Si respondes `y` a esta pregunta, el Smartnode hará los pasos 2 y 3 automáticamente; consulta la sección [Cambio Automático de Credenciales de Retiro e Importación de Clave](#automatic-withdrawal-credential-change-and-key-import) a continuación.

Si respondes `n` a esta pregunta, el comando finalizará y habrás terminado el Paso 1.
Por favor ve a la sección [Paso 2](#step-2-changing-the-validators-withdrawal-credentials) siguiente.

::: tip NOTA
Si rechazas este proceso ahora, puedes reanudarlo en un momento posterior usando la CLI.
Lee las secciones [**Paso 2**](#step-2-changing-the-validators-withdrawal-credentials) y [**Paso 3**](#optional-step-3-import-the-validator-key) a continuación para aprender cómo hacer esto.
:::

### Cambio Automático de Credenciales de Retiro e Importación de Clave

::: danger ADVERTENCIA
Si eliges que el Smartnode cambie automáticamente tus credenciales de retiro e importe la clave privada de tu validador, es **esencial** que elimines la clave del validador de tu antiguo Validator Client que gestionas por tu cuenta, y **apagues el antiguo Validator Client** para asegurarte de que no tenga la clave cargada en la memoria aún.

También debes esperar **al menos 15 minutos** después de hacerlo para asegurarte de que haya **perdido intencionalmente al menos dos atestaciones**.
Puedes verificar esto mirando un explorador de cadena como [https://beaconcha.in](https://beaconcha.in).

Si no esperas al menos 15 minutos, tu validador **SERÁ SLASHED** cuando el Validator Client del Smartnode comience a atestar con la clave de tu validador.

Recomendamos encarecidamente que habilites la **detección de doppelganger** en la configuración de Smartnode también, para estar lo más seguro posible contra el riesgo de slashing.
:::

Si eliges importar automáticamente la clave del validador y cambiar las credenciales de retiro a la dirección del minipool, el Smartnode primero te pedirá el mnemónico utilizado para generar tanto la clave privada BLS de tu validador como su clave de retiro original correspondiente:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Al ingresarlo, el Smartnode derivará tu antigua clave de retiro basada en BLS usando el mnemónico y la pubkey del validador.
Luego enviará un mensaje a la Beacon Chain, firmado por tu clave de retiro, indicando que deseas cambiar las credenciales de retiro de la antigua clave de retiro BLS a la nueva dirección del minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

Finalmente, importará la clave de tu validador en el Validator Client del Smartnode y te preguntará si deseas reiniciarlo, para que comience a validar con esa clave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Con eso, los pasos 2 y 3 se han completado.
Puedes verificar que las credenciales de retiro se hayan cambiado correctamente y que la clave esté validando activamente usando un explorador de cadena como [https://beaconcha.in](https://beaconcha.in)

Ve a la sección [Paso 4](#step-4-waiting-for-the-scrub-check) para aprender sobre el scrub check.

## Paso 2: Cambiar las Credenciales de Retiro del Validador

Cuando hayas creado el nuevo minipool vacante, el siguiente paso es cambiar las credenciales de retiro de tu validador de las antiguas credenciales de clave BLS `0x00` a las nuevas credenciales `0x01` que contienen la nueva dirección del minipool.

Hay dos formas de hacer esto:

1. Usando la CLI de Smartnode, a través del comando `rocketpool minipool set-withdrawal-creds`.
1. Usando una herramienta externa de terceros como [ethdo](https://github.com/wealdtech/ethdo).

En esta guía, veremos cómo usar el método 1 (el Smartnode).
Para más información sobre el método 2, consulta la documentación de la herramienta que desees usar.

Comienza ejecutando el siguiente comando:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Por ejemplo, si la dirección del nuevo minipool vacante era `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, ejecutarías esto:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

El Smartnode entonces te pedirá el mnemónico utilizado para generar tanto la clave de tu validador como su clave de retiro correspondiente:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Después de esto, realizará algunas verificaciones de seguridad para asegurarse de que las credenciales de retiro de tu validador puedan cambiarse.
Si tiene éxito, entonces enviará un mensaje a la Beacon Chain, firmado por tu clave de retiro, indicando que deseas cambiar las credenciales de retiro de la antigua clave de retiro BLS a la nueva dirección del minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

¡Eso es todo!
Puedes verificar que las credenciales de retiro se hayan cambiado correctamente usando un explorador de cadena como [https://beaconcha.in](https://beaconcha.in).

## (Opcional) Paso 3: Importar la Clave del Validador

Una vez que conviertas tu validador en un minipool, es posible que desees que el Validator Client del Smartnode lo ejecute en lugar del que actualmente gestionas por tu cuenta.
Esto tiene algunas ventajas:

- Es "más limpio" desde un punto de vista organizacional (el Smartnode gestiona tus minipools, tu Validator Client gestionado externamente gestiona tus validadores de staking solo).
- Permite que comandos como `rocketpool minipool exit` (comandos que requieren tu clave de validador para firmar mensajes) funcionen.

Sin embargo, hay algunas **consideraciones muy importantes** que debes entender antes de hacer esto:

- **Debes asegurarte** de que la clave de tu validador haya sido eliminada de tu propio Validator Client, y que hayas esperado al menos 15 minutos después de eliminarla antes de importarla al Smartnode. Consulta el cuadro de advertencia a continuación.
- **Debes asegurarte** de que tengas tu keystore del validador _y su archivo de contraseña_ respaldados, porque comandos como `rocketpool wallet recover` y `rocketpool wallet rebuild` **no pueden** regenerarlos sin un respaldo ya que no fueron derivados del mnemónico de la billetera del Smartnode.

Si deseas importar la clave de tu validador al Smartnode, continúa leyendo a continuación.

::: danger ADVERTENCIA
Si eliges que el Smartnode importe la clave privada de tu validador, es **esencial** que elimines la clave del validador de tu antiguo Validator Client que gestionas por tu cuenta, y **apagues el antiguo Validator Client** para asegurarte de que no tenga la clave cargada en la memoria aún.

También debes esperar **al menos 15 minutos** después de hacerlo para asegurarte de que haya **perdido intencionalmente al menos dos atestaciones**.
Puedes verificar esto mirando un explorador de cadena como [https://beaconcha.in](https://beaconcha.in).

Si no esperas al menos 15 minutos, tu validador **SERÁ SLASHED** cuando el Validator Client del Smartnode comience a atestar con la clave de tu validador.

Recomendamos encarecidamente que habilites la **detección de doppelganger** en la configuración de Smartnode también, para estar lo más seguro posible contra el riesgo de slashing.
:::

Comienza ejecutando el siguiente comando:

```
rocketpool minipool import-key <minipool address>
```

Por ejemplo, si la dirección del nuevo minipool vacante era `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, ejecutarías esto:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

El Smartnode entonces te pedirá el mnemónico utilizado para generar la clave de tu validador:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Después de esto, recorrerá las diferentes claves generadas a partir de ese mnemónico hasta que encuentre la clave pública de tu validador.
Luego la importará y te preguntará si deseas reiniciar el Validator Client del Smartnode para que cargue tu clave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Con eso, la clave de tu validador ahora está importada en el Smartnode y deberías verla comenzar a atestar.
Puedes confirmar siguiendo los logs del Validator Client con este comando:

```
rocketpool service logs validator
```

También puedes verificar que un explorador de cadena como [https://beaconcha.in](https://beaconcha.in) pueda ver tu Validator Client atestando con la clave de tu validador.

## Paso 4: Asignar el Fee Recipient Correcto

Una vez que hayas iniciado el proceso de migración, es **imperativo** que te asegures de que tu [fee recipient](./fee-distrib-sp#fee-recipients) esté configurado correctamente (ya sea a tu [fee distributor](./fee-distrib-sp#your-fee-distributor) del nodo o al [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) si te has registrado en él).
Si no haces esto y lo dejas en el fee recipient para tus validadores solo, serás penalizado y se deducirá una porción de tu stake en la Beacon Chain para compensar la pérdida.

::: tip NOTA
**Este paso solo es necesario si dejas la clave de tu validador en tu propio Validator Client gestionado externamente.**

Si lo eliminas de tu propio VC y lo importas al VC gestionado por Rocket Pool, tu fee recipient se asignará a la dirección correcta automáticamente por el proceso `node`.
:::

Como puedes retener otras claves de staking solo en tu VC que _no_ deseas establecer en el fee distributor o Smoothing Pool, la única forma de lograr esto es usar un archivo de configuración de VC para establecer manualmente el fee recipient para el validador que se está migrando.

Este proceso depende de qué Consensus Client uses; consulta la documentación para los detalles específicos, pero aquí hay algunos enlaces útiles:

[Lighthouse: a través de `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** actualmente no admite configurar fee recipients específicos del validador. No uses Lodestar si estás manteniendo la clave en tu VC gestionado externamente con otras claves solo que no se están migrando.

[Nimbus: a través de la API keymanager](https://nimbus.guide/keymanager-api.html)

[Prysm: a través de `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: a través de `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Si estás usando eth-docker, puedes usar el comando [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) para establecer recipients individuales para cada clave que estés usando como se describe en su documentación.

## Paso 5: Esperar el Scrub Check

A esta altura, deberías haber completado los pasos 1 y 2 (crear el minipool vacante y cambiar las credenciales de retiro de tu validador) y opcionalmente el paso 3 (importar la clave al Smartnode).
El siguiente paso es esperar a que se complete el **scrub check**.
Este es un proceso llevado a cabo por el Oracle DAO para verificar lo siguiente:

1. El saldo de tu validador en la Beacon Chain (y el saldo de tu minipool en la capa de ejecución) deben sumar **al menos** el saldo que tenía tu validador cuando creaste por primera vez el minipool vacante, menos un pequeño buffer de 0.01 ETH para tener en cuenta cualquier atestación perdida accidentalmente durante el mantenimiento.

- Por ejemplo, si tu validador tenía un saldo de Beacon Chain de 35 ETH cuando realizaste el paso 1, los saldos combinados de Beacon Chain y minipool deben ser **al menos** 34.99 ETH durante toda la duración del scrub check.

2. Tu validador debe permanecer en el estado de **staking activo** durante todo el scrub check: no puede estar slashed, exited o withdrawn.
3. Las credenciales de retiro de tu validador deben ser las **credenciales originales de clave de retiro basadas en BLS**, o las **nuevas credenciales 0x01 usando la dirección del minipool**. Cualquier otra credencial causará que el minipool sea scrubbed.

- Se te da un período de gracia de **aproximadamente 2 días y medio** para realizar el cambio de credenciales de retiro (85% de la duración del período de scrub de 3 días).

El scrub check es transitorio; no tienes que hacer nada durante este tiempo aparte de mantener tu validador en línea y funcionando bien.

Para monitorear cuánto tiempo queda en el scrub check, puedes ver los logs del `node` con el siguiente comando:

```
rocketpool service logs node
```

Las líneas relevantes se verán así:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

Durará **3 días**, después de los cuales habrás pasado y puedes proceder al [Paso 6](#step-6-promoting-the-minipool) para promover el minipool vacante a uno completo.

### Trabajando con Minipools Scrubbed

Si tu minipool desafortunadamente falla el scrub check y es disuelto, no te preocupes: tu capital no se pierde.
Los minipools vacantes disueltos esencialmente actúan como direcciones de retiro simplificadas:

- Técnicamente no son parte de la red de Rocket Pool.
- Cualquier capital depositado en el minipool pertenece _únicamente_ al Node Operator. _No_ se divide con los pool stakers.
- No se te otorga un crédito de depósito por crear el minipool.

Puedes acceder al saldo del minipool en cualquier momento con el siguiente comando:

```shell
rocketpool minipool distribute-balance
```

Esto enviará el saldo completo del minipool a la dirección de retiro de tu nodo.

Cuando hayas salido de tu validador de la Beacon Chain y su saldo completo se haya enviado al minipool, puedes recuperarlo y cerrar el minipool con el siguiente comando:

```shell
rocketpool minipool close
```

Una vez más, esto enviará el saldo completo del minipool a la dirección de retiro de tu nodo.

## Paso 6: Promover el Minipool

Cuando el scrub check se haya pasado exitosamente, puedes promover el minipool vacante a un minipool completo.
Esto se puede hacer de dos maneras:

1. Deja que el proceso `node` lo maneje automáticamente tan pronto como termine el scrub check.
1. Hazlo manualmente usando la CLI.

El primer método promoverá el minipool por ti automáticamente, asumiendo que tienes el proceso / contenedor `node` ejecutándose y el costo de gas de la red está por debajo del umbral de transacción automatizada que especificaste en el proceso de configuración del Smartnode (predeterminado de 150).
En los logs del `node`, verás una salida como la siguiente:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

Si tu proceso `node` está deshabilitado, puedes usar el segundo método a través del siguiente comando:

```shell
rocketpool minipool promote
```

Desde aquí, simplemente selecciona tu minipool vacante de la lista de minipools elegibles para promoción y envía la transacción.

## Reclamando tus Recompensas Originales Pre-Conversión

Al promocionar, tu minipool entrará en el estado `staking` y oficialmente se ha convertido en un minipool regular de Rocket Pool.
Puedes revisar los detalles con este comando:

```shell
rocketpool minipool status
```

Esto te mostrará el estado de tu nuevo minipool, sus saldos, su reembolso, etc.
Por ejemplo:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Aquí puedes ver la siguiente información importante:

- `Node deposit` muestra cuánto ETH bondeaste personalmente como parte de este minipool (en este caso, 8 ETH).
- `RP deposit` muestra cuánto ETH tomaste prestado de los pool stakers para crear el minipool (en este caso, 24 ETH).
- `Available refund` muestra cuánto del saldo del minipool va directamente a ti (no se comparte con los pool stakers. Esto equivale a todas tus recompensas en la Beacon Chain en el momento en que creaste el minipool vacante.
- `Minipool Balance (EL)` muestra el saldo total del contrato del minipool.
- `Your portion (EL)` muestra cuánto del saldo te pertenece _después_ de restar el reembolso del saldo del minipool. En otras palabras, esta es tu parte de las recompensas que has ganado _después_ de crear el minipool vacante.
- `Total EL rewards` es tu reembolso más tus recompensas post-conversión.

Para reclamar tu reembolso, ejecuta el siguiente comando:

```shell
rocketpool minipool refund
```

Simplemente selecciona tu minipool de la lista, aprueba la transacción y tu reembolso se enviará a la dirección de retiro de tu nodo.

## Usando tu Crédito de Nodo

Ahora que tienes un minipool promovido activo, notarás que tu nodo tiene un saldo de crédito cuando ejecutes `rocketpool node status`:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

En este ejemplo, dado que convertimos el bono de validador original de 32 ETH en un minipool de 8 ETH, hemos recibido [**24 ETH en crédito**](./credit).
¡Este crédito se puede usar para crear nuevos minipools y validadores gratis!

Simplemente ejecuta el comando `rocketpool node deposit` y selecciona qué cantidad de bono te gustaría usar.
Si hay suficiente ETH en tu saldo de crédito para cubrir el bono, se usará automáticamente y no tendrás que stakear ningún ETH adicional (aunque aún tienes que pagar por gas.

::: warning NOTA
El ETH utilizado para tu saldo de crédito proviene del staking pool.
Si el staking pool no tiene suficiente ETH para cubrir tu saldo de crédito, no podrás usarlo hasta que se haya depositado más ETH.
:::
