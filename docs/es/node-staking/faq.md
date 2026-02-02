# FAQ (WIP)

### ¿Cuáles son los beneficios de ejecutar minipools con Rocket Pool en comparación con un validador solo de 32 ETH?

Al ejecutar un solo validador en solitario, recibirías recompensas del 100% sobre tus 32 ETH.
Al ejecutar dos minipools de 16 ETH, recibirías recompensas del 100% sobre tus 32 ETH **más** el 14% de las recompensas sobre 32 ETH proporcionados por el protocolo Rocket Pool.
Al ejecutar cuatro minipools de 8 ETH, recibirías recompensas del 100% sobre tus 32 ETH **más** el 14% de las recompensas sobre 96 ETH proporcionados por el protocolo Rocket Pool.
También tendrías la opción de usar la función [Smoothing Pool](./prepare-node.mdx#smoothing-pool) de Rocket Pool.

### ¿Cómo sé cuánto vale mi rETH? ¿Hace rebase?

El token rETH no hará rebase.
El número de tokens en tu billetera permanecerá constante, pero se aprecian en valor con el tiempo.

### Tengo un problema técnico ejecutando mi nodo, ¿cómo obtengo ayuda?

Puedes comenzar verificando la página de [Soporte de Rocket Pool](https://rocketpool.support).
Si eso no ayuda, puedes hacer tu pregunta en el canal **#support** de Rocket Pool en [el servidor de Discord](https://discord.gg/rocketpool).

### ¿Cómo puedo obtener ETH de prueba para experimentar con la creación y ejecución de un minipool? No puedo publicar mensajes en el canal del faucet.

Consulta [Obtener ETH de prueba en Hoodi](./testnet/overview#getting-test-eth-on-hoodi).

### ¿Cómo recupero mi nodo si mi máquina se rompe?

Respuesta corta: tu mnemónico es todo lo que necesitas para recuperar completamente tu nodo.
Siempre asegúrate de mantenerlo seguro.

Para recuperar tu nodo en una nueva máquina, comienza asegurándote de que **tu máquina anterior no volverá a estar en línea** con las claves disponibles, ya que dos nodos ejecutándose con las mismas claves **te harán slashing**.
Sigue los [pasos](./install-modes) para instalar el Smartnode en una nueva máquina.
Luego, recupera tu billetera de nodo y claves de validador ejecutando el comando `rocketpool wallet recover` e inserta tu mnemónico de 24 palabras.

### ¿Por qué mis clientes no están sincronizando? Tengo una cantidad baja de peers.

Los clientes necesitan tener un número saludable de peers para poder sincronizar adecuadamente.
Puedes comenzar ejecutando la prueba [aquí](https://www.yougetsignal.com/tools/open-ports/), verificando si los puertos 30303 y 9001 están abiertos.
Si están cerrados, necesitarás configurar el reenvío de puertos en tu enrutador.
Además, asegúrate de que tu nodo tenga una dirección IP local estática para que el reenvío de puertos no se rompa debido a que tu nodo obtenga una nueva dirección.

### Mi cliente de consenso está tardando demasiado en sincronizar. ¿Qué debo hacer?

Los clientes de consenso pueden tardar mucho tiempo en sincronizar si no comenzaste el proceso de sincronización usando [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Incluso si lo has estado ejecutando durante mucho tiempo, generalmente es más rápido configurar la URL de sincronización de checkpoint, borrar los datos de sincronización actuales con `rocketpool service resync-eth2` y comenzar de nuevo.
Tu cliente debería estar sincronizado en menos de un minuto.

### Ya reinicié. ¿Por qué Grafana dice que todavía necesito reiniciar?

La información de reinicio está en caché y solo se actualiza cada pocas horas.
Ejecutar `sudo apt update` forzará una actualización.

### Cambié mi Capa de Ejecución y/o mi Beacon Chain o Capa de Consenso. ¿Cómo limpio los datos antiguos?

Si cambias de clientes, Rocketpool no elimina los volúmenes antiguos. Estos datos podrían estar desperdiciando un espacio significativo en disco y es posible que desees eliminarlos. Para hacerlo, necesitas encontrar los volúmenes. Si estás usando la configuración predeterminada de Rocketpool, los volúmenes de docker se almacenan en `/var/lib/docker/volumes/`. La capa de ejecución está en `rocketpool_eth1clientdata/_data/*` y la capa de consenso está en `rocketpool_eth2clientdata/_data/*`.

Para acceder a estos directorios, es posible que necesites sudo como root usando `sudo -i`. Luego puedes eliminar un directorio llamando a `rm -rf <directory>`. Por ejemplo, si quisieras eliminar todos los datos de geth, llamarías a `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`.

Para salir como root, escribe `exit`.
