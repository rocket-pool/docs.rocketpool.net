::: danger ADVERTENCIA
Los depósitos de minipool están actualmente deshabilitados en preparación para Saturn 1.
:::

# El Sistema de Crédito de Depósito

El sistema de crédito de depósito es un mecanismo para rastrear ETH que fue previamente vinculado por los operadores de nodos pero que ya no es requerido y hacer que esté disponible para su uso nuevamente.
La fuente de este crédito proviene de dos lugares:

- [Migrar un minipool existente vinculado de 16 ETH a uno vinculado de 8 ETH](./leb-migration.mdx) (que añade 8 ETH al saldo de crédito del operador del nodo)
- [Migrar un validador solo existente](./solo-staker-migration) a un minipool (que añade 16 o 24 ETH al saldo de crédito del operador del nodo, dependiendo del tipo de minipool que creen durante la migración)

Cada operador de nodo comienza con un saldo de crédito de **0 ETH**.
Cualquiera de estas dos acciones aumentará ese saldo en consecuencia.

Este ETH _no_ se hace líquido y se devuelve al operador del nodo; en su lugar, puede ser usado para **crear minipools adicionales** sin requerir ningún ETH del operador del nodo.

El sistema de crédito es **transparente** para el operador del nodo; se usará automáticamente (con notificaciones en la CLI de Smartnode explicando que se usará) durante las operaciones de `rocketpool node deposit` o `rocketpool node create-vacant-minipool` si es posible.
Si _no_ puede ser usado, el Smartnode alertará al usuario que no puede ser usado y requerirá un bono normal de ETH durante cualquiera de las operaciones.

Consulte la sección [Disponibilidad de Crédito](#credit-availability) a continuación para más detalles.

## Un Ejemplo

Supongamos que tiene un saldo de crédito de 0 ETH, y un solo minipool con un bono de 16 ETH.
Luego puede [migrar ese minipool a un bono de 8 ETH](./leb-migration.mdx).
Esto resultará en **8 ETH** que ya no está vinculado.
Esos 8 ETH se colocarán en su **saldo de crédito**.

Ahora, suponga que desea crear un _segundo_ minipool de 8 ETH.
Ejecuta `rocketpool node deposit` como de costumbre, y selecciona 8 ETH como el monto del bono.
Esto normalmente requiere que proporcione 8 de sus propios ETH para el minipool.
Sin embargo, debido a que tiene un saldo de crédito de 8 ETH, Rocket Pool **automáticamente usará eso en su lugar**:

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

El segundo conjunto de líneas aquí es el relevante: le dicen que tiene suficiente ETH en su saldo de crédito para cubrir este depósito _y que está disponible para su uso_, por lo que usará el saldo automáticamente y no requerirá ningún ETH suplementario de su billetera de nodo.

Consulte [la sección de disponibilidad a continuación](#credit-availability) para detalles sobre la disponibilidad del saldo de crédito.

## Ver su Saldo de Crédito Actual

Para ver su saldo de crédito actual, simplemente ejecute el siguiente comando:

```shell
rocketpool node status
```

Esto produce una lista completa de detalles sobre su nodo, incluido su saldo de crédito justo al principio:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Disponibilidad de Crédito

En algunas situaciones, su nodo podría tener un saldo de crédito disponible pero actualmente no puede usarlo para implementar minipools adicionales.

El ETH para su saldo de crédito se toma del **deposit pool**.
Por lo tanto, si desea usar 8 ETH en crédito para crear un nuevo minipool de 8 ETH, terminará tomando **los 32 ETH completos para ese minipool** del deposit pool y no requerirá ninguno de usted.
Debido a esto, si el deposit pool no tiene suficiente ETH en él para cubrir el valor de pre-depósito (actualmente establecido en 1 ETH), **el saldo no estará disponible**.

En esta situación, el Smartnode le alertará durante una operación de `rocketpool node deposit` que **no puede** usar su saldo de crédito, y en su lugar debe usar ETH de su billetera de nodo para completar el bono.
Hacerlo **no** consumirá su saldo de crédito; se dejará tal como está y disponible para su uso más adelante una vez que el deposit pool tenga suficiente saldo para cubrirlo.
