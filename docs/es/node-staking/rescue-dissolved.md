# Rescatar un Minipool Disuelto

En el improbable caso de que tu minipool no haga staking dentro de la ventana de disolución, será "disuelto" por la oDAO y los fondos de usuario proporcionados serán devueltos al deposit pool para uso de otro minipool. En este escenario, necesitarás realizar el proceso siguiente para recuperar tu ETH y desbloquear tu RPL para poder quitarlo del staking.

## Actualiza tu Delegate del Minipool

Es altamente recomendable que uses el último delegate del minipool al realizar este proceso. Los delegates más antiguos contienen una operación `selfdestruct` cuando se cierran, lo que significa que, si el proceso no se completa correctamente en el orden especificado, los fondos podrían quedar bloqueados para siempre. Puedes verificar que tu minipool esté en el último delegate intentando [Actualizar tu Delegate](./minipools/delegates#upgrading-your-delegate). Si tu minipool no aparece en la lista de minipools que pueden ser actualizados, entonces puedes continuar abajo.

## Recupera tu Saldo de Depósito No Utilizado

::: tip NOTA
Si tu minipool fue disuelto antes de Atlas, puedes omitir este paso e ir directamente a [Incrementa tu Saldo en Beaconchain a 32 ETH](#increase-your-beaconchain-balance-to-32-eth).
No necesitas recuperar tu saldo de depósito no utilizado porque el monto completo del bond fue depositado en la beaconchain antes de Atlas.
:::

1 ETH de tu depósito inicial de bond se usa como depósito inicial en la beaconchain para asegurar las credenciales de retiro de tu validador. El monto restante se deposita en tu minipool cuando se le asigna ETH del deposit pool.

Cuando tu minipool se disuelve, el ETH del usuario se devuelve al deposit pool y tu ETH permanece en el minipool listo para ser devuelto a ti. Usa la función de [Distribución Manual](./skimming#manual-distribution) de recompensas para recuperar este ETH que luego puede ser usado en el siguiente paso para activar tu validador.

## Incrementa tu Saldo en Beaconchain a 32 ETH

Debes completar el saldo de tu validador hasta el mínimo requerido para activación en la beaconchain. Este monto es **32 ETH**. Si tienes un minipool con bond de 16 ETH, necesitarás 16 ETH adicionales y si tienes un minipool con bond de 8 ETH necesitarás 24 ETH adicionales durante este paso.

Deposita el monto requerido de ETH en la dirección de tu nodo y luego ejecuta el siguiente comando para comenzar el proceso:

```shell
rocketpool minipool rescue-dissolved
```

Se te presentará una lista de minipools que cumplen con los criterios para un depósito manual:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Después de seleccionar el minipool que quieres rescatar, se te preguntará qué monto quieres depositar manualmente:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

La opción 1 se usará en la mayoría de las circunstancias. Es el monto requerido para llevar tu saldo en beaconchain hasta los 32 ETH requeridos. Las otras opciones se proporcionan para casos de uso avanzados.

::: tip NOTA
Llevar tu saldo en beaconchain hasta 32 ETH significa que tu validador podrá participar activamente en las tareas de validación de Ethereum. Es posible que el smartnode no haya tenido oportunidad de reiniciar tu validador desde la disolución. Por lo tanto, es una buena idea reiniciar manualmente tu validador para asegurar que haya cargado tus claves de validador y pueda realizar tareas de validación para evitar penalizaciones durante el proceso de rescate.

Si estás ejecutando el modo Docker estándar, esto se puede hacer con `docker restart rocketpool_validator`.
:::

Una vez que este paso esté completo, tu validador entrará en la cola de entrada y necesitarás esperar a que ocurran los siguientes eventos:

1. Deben pasar 2048 bloques de la capa de ejecución para que tu depósito sea aceptado (~8 horas)
2. Hasta 32 epochs deben pasar para que los validadores voten tu entrada (0.5 - 3.5 horas)
3. Una cantidad variable de tiempo en la cola de validadores (6.4 minutos por cada 4 validadores en la cola)
4. Mínimo 256 epochs validando antes de que se permita una salida (27 horas)

### Salir de tu Validador

Una vez que tu validador haya estado activo durante un mínimo de 256 epochs, puedes salir de tu minipool mediante el mismo proceso que cualquier otro minipool siguiendo la guía [Salir de tu Validador](./withdraw#exiting-your-validator).

El saldo completo de 32 ETH será devuelto a tu minipool y los minipools disueltos distribuyen el 100% de su saldo a la dirección de retiro del node operator.
