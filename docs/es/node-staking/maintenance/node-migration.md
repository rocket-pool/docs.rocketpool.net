# Migración de un nodo a otro

A veces, tu máquina de nodo ya no puede hacer su trabajo y necesitas migrar a otra.
Esto podría suceder si estás actualizando tu nodo por ejemplo, o si te estás mudando de un nodo basado en la nube a uno alojado localmente en hardware dedicado, o incluso si tu nodo mismo sufre una falla catastrófica de hardware y necesitas ejecutar tus validadores en una máquina de respaldo.
Independientemente del caso, esta guía te ayudará a entender cómo migrar de forma segura tu billetera y claves de validador de un nodo a otro sin ser penalizado.

## Penalización y la base de datos de penalización

La razón principal por la que te alentamos a ejercer tanta precaución al mover tu billetera de una máquina a otra, o recuperar tu billetera en otra máquina, es por el riesgo de **penalización** (slashing).
La penalización ocurre cuando una o más de tus claves de validador hace algo que viola las reglas de la Beacon Chain y parece como si estuvieras intentando atacar la red.
En respuesta, la cadena saldrá forzosamente de tu validador y aplicará una penalización severa: el tamaño de la penalización depende de cuántos validadores también son penalizados dentro de un período de dos semanas de tu propia penalización, pero actualmente el mínimo es **1 ETH** y no hay máximo.

Aunque hay varias condiciones que pueden interpretarse como "atacar la red", en realidad la única que sucede accidentalmente es la **atestación doble** (o **propuesta doble**).
Esto ocurre cuando tu validador envía dos atestaciones (o dos propuestas de bloque) para el mismo slot que tienen votos diferentes (por ejemplo, vota por dos bloques candidatos diferentes para un slot en particular en lugar de elegir uno).

Para combatir esto, tu cliente de validador aloja lo que se llama una **base de datos de penalización** (Slashing Database).
La base de datos de penalización es simplemente un registro de los votos de tu validador (es decir, el slot de cada voto y el hash del bloque para el que fue ese voto), para que sepa no votar por algo por lo que ya votó.

### Evitar ser penalizado

Cada cliente de validador mantiene una base de datos de penalización para asegurar que tu nodo nunca atestigüe doblemente o proponga doblemente.
El problema, entonces, proviene de situaciones en las que comienzas a validar **sin** una base de datos de penalización y, por lo tanto, no tienes registro de lo que tus validadores han votado previamente.
Esto puede suceder en varias situaciones:

1. Acabas de cambiar de clientes de Consenso, y el nuevo cliente no transfiere la base de datos de penalización del antiguo (lo cual el Smartnode no hace durante un cambio de cliente).
2. Tienes tu billetera cargada en una máquina y estás atestiguando activamente con ella, y luego cargas tu billetera en una segunda máquina _mientras la primera máquina todavía está atestiguando activamente_.
3. Dejas de validar en una máquina y cargas tu billetera en una segunda máquina, pero no has esperado lo suficiente para que la época actual se finalice, por lo que tu segunda máquina atestigua para slots para los que tus validadores ya han atestiguado.

La forma estándar de evitar ser penalizado es **esperar al menos 15 minutos después de tu última atestación exitosa** antes de iniciar tu cliente de validador y atestiguar de nuevo, y **asegurarte de que tus claves de validador solo estén presentes en una única máquina**.

Más específicamente, el plan es esperar hasta que tu validador haya perdido intencionalmente una atestación, **y que esa falta haya sido finalizada**.
Una vez que se logra la finalidad, tu validador ya no puede votar por la época finalizada y es seguro comenzar a atestiguar con él una vez más.

La espera de 15 minutos proviene de una regla empírica de que cuando opera normalmente (por ejemplo, con consenso normal), la Beacon Chain tarda aproximadamente 7 minutos en finalizar una época.
Esperar 15 minutos asegura que hayas perdido al menos una época y esperado lo suficiente para que esa época se finalice, con un pequeño margen solo por seguridad.

## Lista de verificación de migración de nodo

Con el contexto anterior en mente, aquí hay una lista de verificación útil que puedes seguir al migrar tu nodo para asegurar que no serás penalizado.
Esto está diseñado para máxima seguridad, por lo que aunque puedas pensar que algunos de los pasos son innecesarios, te **recomendamos enfáticamente** que los sigas todos hasta completarlos.

1. **Prepara el nuevo nodo** siguiendo estas guías, comenzando desde la sección "Preparar un nodo" y terminando una vez que tengas el Smartnode instalado y estés sincronizando un cliente de Ejecución y Consenso.
   - :warning: **NO** inicialices una nueva billetera o recuperes tu billetera antigua en el nodo. Permite que sincronice los clientes _sin una billetera presente_.

2. **ESPERA** hasta que tus clientes estén completamente sincronizados en el nuevo nodo.
3. Confirma que has registrado tu mnemónico correctamente ejecutando `rocketpool wallet test-recovery` en tu nueva máquina. Esto _simulará_ la recuperación de claves para confirmar que tu billetera de nodo y todas las claves de validador de tus minipools se pueden recuperar correctamente, pero no las _recuperará realmente_ y las guardará en disco, por lo que no hay riesgo de penalización.
   1. Si el Smartnode no puede recuperar tu billetera de nodo usando el mnemónico que proporcionaste, entonces tu mnemónico puede ser inválido. **DETÉN** este proceso; eliminar las claves de tu nodo antiguo significa que podrían **perderse para siempre**.
   2. En esta situación, recomendamos salir de tus validadores y retirar tu capital lo antes posible, para que puedas comenzar de nuevo con un nuevo nodo del que tengas el mnemónico funcional.
4. **Deja de validar** en tu nodo antiguo (por ejemplo, usando `rocketpool service stop` para apagar el cliente de validador).
5. **Elimina tus claves** de tu nodo antiguo (por ejemplo, usando `rocketpool wallet purge`).
   1. **VERIFICA** que las claves se hayan eliminado mirando si la carpeta `data` de tu nodo (la predeterminada es `~/.rocketpool/data/validators/`) - cada cliente de Consenso tendrá su propia carpeta bajo esa carpeta de datos con su propia copia de las claves.
   2. Por favor, consulta la sección [Verificación de la eliminación de claves](#verificación-de-la-eliminación-de-claves) a continuación para obtener instrucciones sobre cómo hacer esto.
   3. Asegúrate de que **todas** hayan sido eliminadas.

6. **Apaga** tu nodo antiguo y desconéctalo de Internet, retirando el cable Ethernet o el módulo Wi-Fi.

7. **Borra el SSD** de tu nodo antiguo, usando uno de los siguientes métodos:
   1. Usa una unidad USB de arranque con una instalación de Linux (como el popular [GParted](https://gparted.org/download.php)) y úsala para borrar la unidad.
   2. **Retíralo físicamente** de tu nodo antiguo, conéctalo a otra máquina usando un convertidor USB y usa una herramienta como [GParted](https://installati.one/debian/11/gparted/) para borrar la unidad.
   3. **Retíralo físicamente** de tu nodo antiguo y golpéalo con un martillo para romperlo y asegurar que nunca se use de nuevo.

8. **ESPERA** al menos 15 minutos antes de continuar. Usa un explorador de bloques como [https://beaconcha.in](https://beaconcha.in) para ver el registro de atestación de tu validador. Espera hasta que al menos una atestación se haya registrado como faltante _y la época correspondiente haya sido finalizada_.
   1. NOTA: si tienes múltiples minipools, debes asegurar que _todos ellos_ hayan perdido al menos una atestación que haya sido finalizada.

9. **Recupera tu billetera de nodo** en la nueva máquina siguiendo las instrucciones en [Importar / Recuperar una billetera existente](../recovering-rp.mdx).

10. **Reinicia tu cliente de validador** para asegurar que tus claves de validador estén cargadas (por ejemplo, con `docker restart rocketpool_validator`).

Tus claves de validador ahora estarán cargadas en tu nuevo nodo, y puedes comenzar a atestiguar de forma segura con él.

## Verificación de la eliminación de claves

Las claves de validador se almacenan en tu disco en forma de archivos `json`.
Se mantienen dentro de la carpeta `data` de tu nodo.
De forma predeterminada, puedes encontrarlas aquí:

```shell
~/.rocketpool/data/validators/
```

::: warning NOTA
Si cambiaste tu directorio `data` usando la TUI `service config` (por ejemplo, estás usando una clave Aegis y la configuraste como tu carpeta `data`, la ruta anterior debe cambiarse a `<tu carpeta data>/validators`.)
:::

Cada cliente tendrá su propia copia de las claves, ya que cada cliente las espera en un formato o configuración diferente.

Para **encontrar** las claves en disco, ejecuta el siguiente comando:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Por ejemplo, en una máquina con dos minipools, la salida se vería así:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

Esto muestra un ejemplo donde las claves **no** se han eliminado todavía y todavía están en el sistema de archivos.

Si tus claves **han sido eliminadas**, no deberías ver _ninguna_ de las cadenas hexadecimales (las cadenas largas que comienzan con `0x`) en ninguna de las carpetas para ninguno de los clientes dentro de la salida de ese comando.
