# Probando tu Nodo Oracle DAO

Una vez que tu nodo esté configurado y te hayas unido al Oracle DAO, debes probarlo para asegurarte de que puede realizar sus funciones correctamente.
La mejor manera de hacer esto es hacer que construya el árbol Merkle de recompensas de Redstone utilizando la utilidad `treegen` de Rocket Pool.

### treegen

`treegen` es una herramienta que puede reproducir el árbol Merkle de recompensas completo y los artefactos adjuntos para un intervalo de recompensas anterior a través de tus clientes de Ejecución y Consenso de archivo.
También puede "ejecutar en seco" el intervalo actual fingiendo que terminó en la última época finalizada (en el momento de ejecutarlo) y produciendo un árbol parcial desde el inicio del intervalo hasta ese punto.

::: tip CONSEJO
Para obtener más información sobre el árbol de recompensas en sí y los archivos adjuntos, visita [**la especificación formal**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` se puede usar como un binario independiente (actualmente solo compilado para sistemas Linux, x64 y arm64) o como un contenedor Docker.

Si deseas descargar el binario independiente, puedes encontrarlo en los lanzamientos aquí: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Las instrucciones de uso están incluidas en el README allí, pero cubriremos algunos ejemplos a continuación también.

La etiqueta del contenedor Docker para esto es `rocketpool/treegen:latest`.

## Construyendo un Árbol de Ejecución en Seco

Para una primera prueba, ejecuta `treegen` para generar un árbol de ejecución en seco que calcule el árbol desde el inicio del intervalo de recompensas hasta el último slot (finalizado).
Usaremos [el script](https://github.com/rocket-pool/treegen/blob/main/treegen.sh) incluido en el repositorio que aprovecha el contenedor Docker para ejecutarlo en la máquina del nodo en sí por simplicidad:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning NOTA
Ten en cuenta que esta configuración particular requiere que expongas las APIs del Cliente de Ejecución y el Nodo Beacon a través de la configuración de Docker - asegúrate de tener ambas opciones habilitadas en el TUI de `rocketpool service config`.
:::

Esto probará las capacidades de tus clientes para responder a consultas de manera oportuna (por ejemplo, si estás usando un servicio de terceros, esto será útil para evaluar si su límite de tasa de consultas es insuficiente), pero **no probará sus capacidades de Modo Archivo**.
Producirá una salida como la siguiente:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

Si esto se ejecuta sin errores, generará los artefactos del árbol de recompensas y los guardará como archivos JSON en tu directorio de trabajo.
Eres libre de explorarlos y asegurarte de que su contenido sea razonable, pero como son archivos de ejecución en seco, no se almacenan canónicamente en ninguna parte para comparación.

## Construyendo un Árbol Canónico de un Intervalo Pasado

Esta siguiente prueba consiste en replicar uno de los árboles completos de un intervalo pasado.
Esto requerirá acceso de archivo tanto en la Capa de Ejecución como en la Capa de Consenso, por lo que servirá como una buena prueba de ambas capacidades.

Al momento de escribir esto, **el Intervalo 2** es una opción ideal ya que está muy en el pasado () e involucró el Smoothing Pool (que representa la mayor carga computacional al calcular las recompensas para el período).

Ejecuta `treegen` usando el siguiente comando:

```shell
./treegen.sh -e http://<tu url EC de archivo> -b http://localhost:5052 -i 2
```

Ten en cuenta que la **URL del Cliente de Ejecución** es diferente aquí: _debe ser_ un EC de Archivo ya que el bloque de instantánea para el Intervalo 2 estaba muy en el pasado.

::: warning NOTA
Dependiendo de la configuración de tu cliente, construir este árbol puede llevar _horas_.
El Smartnode te dará indicadores de estado sobre su progreso a lo largo del camino, como puedes ver en el ejemplo a continuación.
:::

La salida se verá así (truncada por brevedad):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

Lo clave a buscar aquí es este mensaje al final:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Si recibes esto, entonces tu watchtower puede construir el árbol correctamente.

::: danger NOTA
Si bien esto prueba que puedes construir el árbol, _debes_ asegurarte de que tu token API de Web3.Storage se haya ingresado en la configuración del Smartnode para que pueda cargar el árbol resultante a IPFS.
:::

### Siguientes Pasos

A continuación, cubriremos cómo monitorear el rendimiento de tu nodo.
