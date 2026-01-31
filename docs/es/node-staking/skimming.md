# Distribuyendo Recompensas Skimmed

Las recompensas de ETH que recibes por ejecutar un validador para Ethereum se envían rutinariamente a tus minipools en un proceso denominado "skimming".
La frecuencia de los skims depende del número de validadores activos en la Beacon Chain. Al momento de escribir esto, el número de validadores es de alrededor de
500,000, lo que resulta en un skim que ocurre aproximadamente cada 2-3 días.

Las recompensas skimmed se acumularán en cada uno de tus minipools hasta que las "distribuyas". Este proceso distribuye las recompensas skimmed entre ti, como Node Operator, y los holders de rETH
según tu tasa de comisión y la proporción de ETH suministrado y proporcionado.

::: warning NOTA
Para acceder al saldo de tu minipool, primero deberás actualizar al [Atlas delegate](./minipools/delegates).
El antiguo delegate de Redstone no puede usarse para distribuir el saldo del minipool.
:::

## Distribución Automática

Por defecto, el Smartnode está configurado para distribuir automáticamente cualquiera de tus minipools cuando sus saldos individuales alcancen **1 ETH**. Este
umbral se puede configurar en la TUI siguiendo los pasos a continuación.

Ejecuta:

```shell
rocketpool service config
```

Navega a la configuración `Smartnode and TX Fee Settings > Auto Distribute Threshold` que se muestra a continuación.

![](./images/tui-automatic-skimming.png)

Cambiar esta configuración ajustará el umbral en el que el Smartnode distribuirá automáticamente tus minipools.
Establecer el parámetro en 0 deshabilitará las distribuciones automáticas.

::: warning ADVERTENCIA
Si decides deshabilitar la distribución automática, es importante que aún realices una distribución manual de manera regular.
Lee la [sección de distribución manual](#manual-distribution) que sigue sobre cómo hacer esto.

Después de un largo período de tiempo, tus recompensas skimmed pueden exceder 8 ETH. Si ocurre esta situación, ya no podrás
distribuirlas y necesitarás salir de tu validador para acceder a tus recompensas acumuladas.

Rocket Pool cuenta con un diseño a prueba de fallos que permite a cualquiera, después de un largo período de espera, distribuir tu minipool cuando
su saldo exceda 8 ETH. Para proteger tu capital, el Smartnode monitorea esta situación y saldrá automáticamente de
tu minipool si esto ocurre.
:::

## Distribución Manual

Si has deshabilitado la distribución automática de recompensas skimmed, necesitarás distribuirlas rutinariamente tú mismo
con el siguiente proceso.

También puedes distribuir tus recompensas manualmente usando este proceso en cualquier momento sin esperar el proceso automático anterior.

Si tu minipool tiene menos de 8 ETH, puedes distribuir tus recompensas usando el siguiente comando:

```shell
rocketpool minipool distribute-balance
```

Esto te mostrará los minipools que tienes que son elegibles para distribución, cuánto ETH tienen y cuánto ETH recibirás tú (el Node Operator):

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

Cualquier minipool que use el delegate de lanzamiento original se mencionará al inicio, informándote que no puedes llamar a `distribute-balance` en ellos hasta que actualices sus delegates.
Este delegate fue escrito antes de que se especificaran los retiros skimmed y, como tal, no incluye una forma de distribuir recompensas skimmed.

Ten en cuenta que para los minipools elegibles, también se muestra la **cantidad de reembolso**.
Esta es una cantidad que se te debe directamente (por ejemplo, porque tenías un saldo en tu minipool antes de [migrar de un bono de 16 ETH a uno de 8 ETH](./leb-migration.mdx) o [convertiste un validador solo en un minipool](./solo-staker-migration) con recompensas existentes).
No se compartirá con los holders de rETH.

Ingresa el número del minipool que deseas distribuir.
Se te pedirá el gráfico de precio de gas como de costumbre y que confirmes tu decisión.
Una vez que lo hagas, el saldo de tu minipool se distribuirá:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

Como puedes ver [en la transacción](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9), esto proporcionó a la dirección de retiro del nodo su parte de las recompensas (más la cantidad de reembolso) y devolvió el resto al staking pool.
