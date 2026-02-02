# Minipools con depósito de 8 ETH

Cuando Rocket Pool se lanzó por primera vez, admitía dos tipos de minipools:

1. Un **depósito de 16 ETH**, donde el operador del nodo proporcionaba 16 ETH y los 16 ETH restantes provendrían del pool de staking para crear un validador completo (32 ETH).
2. Un **depósito temporal de 32 ETH**, donde el operador del nodo proporcionaría los 32 ETH completos para poder omitir el proceso de inicialización y comenzar a validar en la Beacon Chain de inmediato, y luego recibiría un reembolso de 16 ETH una vez que el pool de depósitos tuviera suficiente ETH para cubrirlo. En ese momento se convertiría en un minipool normal con depósito de 16 ETH.

Este último fue eliminado por un voto de la comunidad varios meses después del lanzamiento del protocolo debido a que ya no era necesario y resultaba en largos retrasos de reembolso.

El primero representaba el monto de depósito más bajo del protocolo porque garantizaba que si un operador de nodo usaba Rocket Pool para atacar el protocolo de Ethereum y tenía _todo su depósito_ recortado, perdería tanto como los stakers de rETH y no saldría ganando.

Desde el lanzamiento de Rocket Pool, la comunidad ha realizado [investigaciones significativas](https://dao.rocketpool.net/t/leb8-discussion-thread/899) sobre la seguridad proporcionada por este depósito y encontró que era muy conservadora.
Para todos los efectos prácticos, un recorte de 16 ETH se consideró poco realista y un depósito de 16 ETH proporcionaba efectivamente los mismos beneficios de seguridad que un depósito de solo 8 ETH (más el requisito de RPL suplementario).
Por lo tanto, respaldada por esta investigación, la actualización Atlas introduce un nuevo tipo de minipool a la lista: el **depósito de 8 ETH**, llamado coloquialmente por la comunidad de Rocket Pool como "LEB8" (Lower ETH Bond - 8 ETH).

Para crear un minipool de 8 ETH, el operador del nodo solo necesita proporcionar **8 de sus propios ETH** (más suficiente RPL para cubrir el requisito de colateral - más sobre esto en [Colateral RPL](#colateral-rpl)).
Luego tomará **24 ETH** del pool de depósitos para completar el validador y comenzar a trabajar en la Beacon Chain.

Esto **abre la puerta a nuevos operadores de nodos prospectivos** que quieren ejecutar un nodo pero no tienen 16 ETH completos.
Además, permite a los operadores de nodos más grandes **poner a trabajar más ETH de los stakers del pool** en la Beacon Chain ganando recompensas.
Como esto funciona sin comprometer significativamente la seguridad, ¡todos ganan!

En esta guía, cubriremos tres temas:

- Cómo funcionan realmente los minipools con depósito de 8 ETH y los números de recompensas detrás de ellos
- Cómo crear un nuevo minipool de 8 ETH
- Cómo migrar un minipool _existente_ de 16 ETH a un minipool de 8 ETH sin salir

Continúa leyendo para aprender más sobre cada tema.

## Cómo funcionan los minipools con depósito de 8 ETH

Mecánicamente, los minipools con depósito de 8 ETH se comportan **idénticamente** a cualquier otro minipool en el protocolo.
Todavía "poseen" un validador en la Beacon Chain (representan las credenciales de retiro de ese validador), todavía vienen con una comisión (aunque la comisión con Atlas **se fijará en 14%** para todos los nuevos minipools), y proporcionan toda la misma funcionalidad que un minipool con depósito de 16 ETH.
La diferencia radica enteramente en los números.

### Recompensas

Desde una perspectiva de rentabilidad (mirando _puramente_ las recompensas de ETH e ignorando RPL), los minipools con depósito de 8 ETH con una comisión del 14% proporcionan _más recompensas_ al operador del nodo que incluso los _minipools con depósito de 16 ETH al 20% de comisión_ (que, a partir de Redstone, es la configuración de recompensa más alta posible).
Al mismo tiempo, también proporcionan más recompensas a los _poseedores de rETH_ debido al hecho de que los operadores de nodos están poniendo a trabajar el capital de los poseedores de rETH de manera más eficiente.

Veamos un ejemplo simple para ilustrar.
Digamos que somos un operador de nodo con 16 ETH disponibles para stake (más el depósito de RPL requerido).
Digamos que hemos ganado 1 ETH de recompensas en la Beacon Chain por validador.
Así es como se desarrollan las matemáticas para un solo minipool de 16 ETH con una comisión del 20%, versus dos minipools de 8 ETH con una comisión del 14%:

```
1x Minipool de 16 ETH @ 20%:
Recompensas: 1 ETH
Parte del nodo = (16/32) + (16/32 * 0.2)
              = 0.5 + (0.5 * 0.2)
              = 0.5 + 0.1
              = 0.6 ETH

Parte de rETH = 1 - 0.6
              = 0.4 ETH


2x Minipools de 8 ETH @ 14%:
Recompensas: 2 ETH
Parte del nodo = ((8/32) + (24/32 * 0.14)) * 2
              = (0.25 + (0.75 * 0.14)) * 2
              = (0.25 + 0.105) * 2
              = 0.71 ETH

Parte de rETH = 2 - 0.71
              = 1.29 ETH
```

En otras palabras, un operador de nodo ganará **18% más ETH** a través de dos minipools de 8 ETH que con un solo minipool de 16 ETH con comisión del 20%.

### Colateral RPL

Para crear un minipool de 8 ETH, los operadores de nodos aún necesitan hacer stake de suficiente RPL para cubrir los requisitos mínimos de colateral para su nodo (contabilizando todos sus minipools de todos los tamaños de depósito).

Estas reglas se han aclarado con Atlas:

- El **RPL mínimo** por minipool es **10% del monto _prestado_**
- El **RPL máximo** por minipool es **150% del monto _depositado_**

Para un minipool de 16 ETH, esto permanece sin cambios; el mínimo es 1.6 ETH en valor de RPL, y el máximo es 24 ETH en valor de RPL.

Para un minipool de 8 ETH, esto se convierte en un **mínimo de 2.4 ETH en valor de RPL** (10% del monto prestado, que es 24 ETH) y un **máximo de 12 ETH en valor de RPL** (150% del monto depositado).

Estos números fueron seleccionados por la comunidad de Rocket Pool [como parte de una votación de gobernanza](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671).

## Creando un nuevo minipool de 8 ETH

El proceso para crear un nuevo minipool con un depósito de 8 ETH es idéntico al proceso para crear un minipool de 16 ETH.

Simplemente ejecuta el siguiente comando:

```shell
rocketpool node deposit
```

Cuando se te solicite el monto de tu depósito, selecciona `8 ETH`:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip NOTA
Este ejemplo también muestra el uso del [**nuevo Sistema de Crédito de Depósito**](../../node-staking/credit).
¡Dado que el operador del nodo tiene 8 ETH en crédito, crear este minipool de 8 ETH es gratis!
:::

¡Eso es todo!
El resto del proceso es el mismo que [las instrucciones habituales de creación de minipool](../../node-staking/create-validator.mdx).
