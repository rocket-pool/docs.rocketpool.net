::: danger ADVERTENCIA
Los depósitos de minipool están actualmente deshabilitados en preparación para Saturn 1.
:::

# El Minipool Delegate

Cada validator que ejecutas tiene un contrato de **minipool** como su "propietario" por así decirlo.
El minipool es un contrato único asignado específicamente a ese validator; actúa como su **dirección de retiro**.
Todos los retiros de recompensas y saldo de staking de la Beacon Chain serán enviados al contrato del minipool.

Cada minipool es único para asegurar que tú (el Node Operator) tengas el control absoluto sobre él.
Nadie más lo controla, nadie más puede cambiarlo; está completamente bajo tu mando.

Dicho esto, para minimizar los costos de gas durante los depósitos del nodo, el minipool _mismo_ contiene muy poca funcionalidad real.
Casi todo lo que puede hacer es diferido a un contrato **delegate**.

El contrato delegate del minipool es un contrato especial que contiene la mayor parte de la lógica requerida por los minipools - cosas como distribuir equitativamente el saldo entre tú y los pool stakers, por ejemplo.
A diferencia de los minipools, donde cada minipool es un contrato único, el delegate es un solo contrato al que muchos minipools pueden "reenviar" solicitudes.

Ocasionalmente, el equipo de desarrollo de Rocket Pool publicará un nuevo minipool delegate que agrega nueva funcionalidad.
Por ejemplo, en la actualización Atlas, introdujimos un nuevo delegate que tenía soporte para distribuir recompensas skimmed sin necesidad de cerrar el minipool.

Los minipool pueden tener sus delegates actualizados para aprovechar esta nueva funcionalidad.
Las actualizaciones de delegate son **opt-in**, así que puedes decidir si y cuándo quieres usarlas.
Dicho esto, usualmente se requieren para aprovechar la nueva funcionalidad que introducen las actualizaciones de red.

### Actualizando tu Delegate

Para actualizar un minipool a un nuevo contrato delegate, simplemente ejecuta el siguiente comando:

```shell
rocketpool minipool delegate-upgrade
```

Esto te presentará una lista de tus minipools que actualmente no están usando el delegate más reciente y son elegibles para actualización:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Selecciona el o los que deseas actualizar de la lista ingresando el número correspondiente en el lado izquierdo de la dirección del minipool.
Una vez seleccionado, se te pedirá confirmar tu configuración de precio de gas, y después de eso se enviará una transacción para actualizar el minipool:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

Puedes verificar que esté usando el último delegate con `rocketpool minipool status`.
Cualquier minipool que _no_ esté usando el último delegate tendrá una notificación amarilla bajo su estado informándote que puede ser actualizado:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
