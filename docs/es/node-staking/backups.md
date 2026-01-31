# Respaldo de tu Nodo

::: tip NOTA
Esto está escrito actualmente para instalaciones en **Modo Docker**.
Algunas ubicaciones pueden variar para usuarios de Hybrid o Native.
:::

En general, si creaste tu wallet de nodo y minipools a través del Smartnode, lo único que realmente necesitas tener a mano para recuperar tu nodo de una falla completa es el **mnemónico de tu wallet de nodo**.
Todo lo demás puede recuperarse de eso con bastante facilidad.

Si tienes minipools con claves de validador generadas externamente (por ejemplo, migraste de **Allnodes** a tu propio nodo auto-hospedado), necesitarás los archivos de keystore privados para tus validadores también, ya que no pueden recuperarse del wallet de nodo.

Dicho esto, una vez que ocurra el Merge, ya no podrás usar un cliente de Execution ligero (por ejemplo, Pocket o Infura) como respaldo si alguna vez necesitas resincronizar la cadena de la capa de Execution.
Además, se te requerirá tener un cliente de Execution activo y saludable para atestar correctamente.
Tener una forma rápida y confiable de recuperarse de una falla del cliente de Execution (como una base de datos corrupta, mal funcionamiento del SSD, o hardware comprometido/robado) será crítico, ya que puede tomar horas o incluso días sincronizar desde cero.

En esta guía, te mostraremos cómo respaldar algunas de estas cosas para ayudar a mejorar la resiliencia de tu nodo y minimizar el tiempo de inactividad innecesario.

::: warning NOTA
Esta guía asume que has instalado el Smartnode en el directorio predeterminado (`~/.rocketpool`).
Si especificaste un directorio de instalación diferente, sustitúyelo según corresponda en las instrucciones a continuación.
:::

## Elementos que Pueden Respaldarse

### Configuración del Smartnode

La configuración del Smartnode se almacena en `~/.rocketpool/user-settings.yml`.
Puedes guardar esto y reemplazarlo para restaurar todos tus ajustes del Smartnode (es decir, las cosas que especificaste en `rocketpool service config`).

### Datos de Cadena del Cliente de Execution / Cliente ETH1

Los datos de cadena del cliente de Execution son probablemente lo más importante para respaldar.
Como se mencionó, puede tomar varios días re-sincronizar los datos de cadena de tu EC.
Después del Merge, esto significa horas a días de tiempo de inactividad y ganancias perdidas.

Los datos de cadena se almacenan dentro del volumen de Docker `rocketpool_eth1clientdata`, que por defecto se encuentra en `/var/lib/docker/volumes/rocketpool_eth1clientdata`.
Nota que esta carpeta típicamente no es accesible por cuentas de usuario sin privilegios; necesitarás elevar al usuario `root` para verla.

::: tip NOTA
Si cambiaste la ubicación de almacenamiento de Docker durante la instalación inicial del Smartnode (como personas que ejecutan Docker en un segundo SSD), encontrarás el volumen en `/<tu punto de montaje externo>/docker/volumes/rocketpool_eth1clientdata`

Si no recuerdas qué ruta de instalación usas, puedes verificar `/etc/docker/daemon.json` para su ubicación.
Si el archivo no existe, usas la ubicación predeterminada.
:::

Para instrucciones detalladas sobre cómo respaldar eficientemente tus datos de cadena de Execution, consulta la sección [Respaldo de tus Datos de Cadena de Execution](#respaldo-de-tus-datos-de-cadena-de-execution) más abajo.

### Datos de Monitoreo y Métricas

Estos datos se almacenan dentro del volumen de Docker `rocketpool_grafana-storage`, que por defecto se encuentra en `/var/lib/docker/volumes/rocketpool_grafana-storage` (o `/<tu punto de montaje externo>/docker/volumes/rocketpool_prometheus-data` si personalizaste tu ubicación de almacenamiento de Docker).

## Elementos que **No** Deben Respaldarse

### Claves Privadas y Contraseñas

La clave privada de tu wallet de nodo y el archivo de contraseña usado para cifrarla se almacenan en `~/.rocketpool/data/wallet` y `~/.rocketpool/data/password` respectivamente.
Estos archivos generalmente no necesitan respaldarse, ya que pueden recuperarse de tu mnemónico usando `rocketpool wallet recover`.

Si, por alguna razón, _decides_ respaldar estos archivos, necesitarás ser **extremadamente cuidadoso** sobre cómo los almacenas.
Cualquiera que obtenga acceso a estos archivos obtendrá acceso a tu wallet de nodo, sus validadores, y cualquier fondo que tengas almacenado en él para cosas como gas.

**Recomendamos fuertemente** que no respaldes estos archivos y simplemente uses tu mnemónico de wallet para recuperarlos si es necesario.

### Datos de Cadena del Cliente de Consensus

A diferencia de los datos de la capa de Execution, los datos de la capa de Consensus no son tan importantes para tu nodo gracias al [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Los clientes de Consensus pueden usar fácilmente esta técnica para resincronizar inmediatamente a la cabeza de la cadena Beacon y reanudar las tareas de validación.

## Respaldo de tus Datos de Cadena de Execution

El Smartnode viene con la capacidad de respaldar tus datos de cadena de Execution a través del comando `rocketpool service export-eth1-data`.
Bajo el capó, esto utiliza `rsync`, una poderosa herramienta de respaldo/copia dentro de Linux.

`rsync` compara los archivos en el directorio de origen (tu volumen de Docker) y el directorio de destino (tu ubicación de respaldo).
Si un archivo de origen no existe en el directorio de destino, se copiará completamente.
Sin embargo, si _existe_, `rsync` solo copiará los _cambios_ entre los dos archivos.

Esto significa que el primer respaldo tomará una buena cantidad de tiempo ya que debe copiar todos los datos inicialmente.
Los respaldos subsecuentes solo copiarán los cambios entre tu respaldo anterior y ahora, haciendo el proceso mucho más rápido.

Como parte de una estrategia de respaldo, es posible que desees planear ejecutar `export-eth1-data` regularmente.
Para asegurar la integridad de los datos de cadena, ejecutar este comando **apagará de forma segura el cliente de Execution antes de respaldar sus datos**.
Si eliges programarlo cada semana, tu cliente de Execution solo estará inactivo por unos minutos mientras actualiza el respaldo.
Esto es ciertamente mejor que los días que tomaría resincronizar los datos desde cero.

Para activar un respaldo, comienza **montando el medio de almacenamiento al que deseas exportar los datos**.
Por ejemplo, esto podría ser un disco duro externo.

::: tip CONSEJO
Si no sabes cómo montar dispositivos externos en Linux, es fácil.
Conecta el dispositivo a tu nodo, y sigue [una guía como esta](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/) para aprender cómo montarlo.
:::

Una vez que lo tengas montado, anota su ruta de montaje.
Para este ejemplo, asumamos que queremos almacenar los datos de cadena en una carpeta llamada `/mnt/external-drive` a la cual el dispositivo externo está montado.
Reemplaza esto con tu ruta de montaje real donde la veas a continuación.

Ahora, ejecuta el siguiente comando:

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Esto verificará que tu carpeta de destino sea alcanzable y tenga suficiente espacio libre para almacenar los datos de cadena.
La salida se verá así:

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Como puedes ver, los datos de cadena estarán por debajo de 100 GB (para la testnet Hoodi; la mainnet de Ethereum será un orden de magnitud mayor) y la carpeta externa tiene 287 GiB libres, así que la exportación puede continuar.

Cuando estés listo, ingresa `y` aquí y presiona `Enter`.
Esto detendrá tu cliente de Execution y comenzará a copiar sus datos de cadena a tu carpeta de destino.
Verás el progreso de cada archivo individual pasar por la pantalla mientras se ejecuta.

::: warning NOTA
Es importante que _no_ salgas de la terminal mientras esto se ejecuta.
Si lo haces, la copia continuará ejecutándose en segundo plano pero no podrás seguir su progreso.
:::

Una vez que termine, reiniciará automáticamente tu contenedor del cliente de Execution.

**Nota que tus datos de cadena existentes no se eliminan de tu nodo después de que se complete la exportación.**

### Restauración de tus Datos de Cadena de Execution

Si alguna vez necesitas restaurar tus datos de cadena respaldados, simplemente ejecuta el siguiente comando.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger ADVERTENCIA
Esto eliminará automáticamente cualquier dato de cliente de Execution existente en tu volumen `rocketpool_eth1clientdata`.
:::

Una vez que termine, tu cliente de Execution estará listo para funcionar.
