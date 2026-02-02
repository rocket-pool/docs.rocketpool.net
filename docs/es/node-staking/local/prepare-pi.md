# Preparación de una Raspberry Pi

::: warning NOTA
Esta página se ha dejado aquí con fines de archivo. Ya no recomendamos ejecutar Rocket Pool en una Raspberry Pi debido a los
mayores requisitos de hardware y rendimiento de ejecutar un validador de Ethereum.
:::

Esta guía te mostrará cómo ejecutar un nodo de Rocket Pool utilizando una Raspberry Pi.
Aunque esto no se recomienda típicamente en la mayoría de las guías de staking, reconocemos que es atractivo porque es una opción mucho más asequible que configurar una PC completa.
Con ese fin, hemos trabajado arduamente para ajustar y optimizar una gran cantidad de configuraciones y hemos determinado una configuración que parece funcionar bien.

Esta configuración ejecutará **un nodo de Ejecución completo** y **un nodo de Consenso completo** en la Pi, haciendo que tu sistema contribuya a la salud de la red Ethereum mientras actúa simultáneamente como operador de nodo de Rocket Pool.

## Configuración Preliminar

Para ejecutar un nodo de Rocket Pool en una Raspberry Pi, primero necesitarás tener una Raspberry Pi funcionando.
Si ya tienes una en funcionamiento, ¡genial! Puedes saltar a la sección [Montaje del SSD](#montaje-del-ssd).
Solo asegúrate de tener **un ventilador conectado** antes de continuar.
Si estás empezando desde cero, entonces sigue leyendo.

### Lo que Necesitarás

Estos son los componentes recomendados que necesitarás comprar para ejecutar Rocket Pool en una Pi:

- Una **Raspberry Pi 4 Model B**, el **modelo de 8 GB**
  - Nota: aunque _puedes_ usar una de 4 GB con esta configuración, te recomendamos encarecidamente que optes por una de 8 GB para mayor tranquilidad... realmente no es mucho más cara.
- Una **fuente de alimentación USB-C** para la Pi. Quieres una que proporcione **al menos 3 amperios**.
- Una **tarjeta MicroSD**. No tiene que ser grande, 16 GB es suficiente y ahora son bastante baratas... pero debe ser al menos **Clase 10 (U1)**.
- Un **adaptador de MicroSD a USB** para tu PC. Esto es necesario para que puedas instalar el sistema operativo en la tarjeta antes de cargarla en la Pi.
  Si tu PC ya tiene un puerto SD, entonces no necesitas comprar uno nuevo.
- Algunos **disipadores de calor**. Vas a estar ejecutando la Pi bajo carga pesada 24/7, y se va a calentar.
  Los disipadores de calor ayudarán para que no se limite a sí misma. Idealmente quieres un conjunto de 3: uno para la CPU, uno para la RAM y uno para el controlador USB.
  [Aquí hay un buen ejemplo de un conjunto agradable](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Una **carcasa**. Hay dos formas de hacerlo: con ventilador y sin ventilador.
  - Con ventilador:
    - Un **ventilador** de 40mm. Al igual que lo anterior, el objetivo es mantener las cosas frescas mientras ejecutas tu nodo de Rocket Pool.
    - Una **carcasa con soporte para ventilador** para unir todo.
      También podrías conseguir una carcasa con ventiladores integrados [como esta](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) para no tener que comprar los ventiladores por separado.
  - Sin ventilador:
    - Una **carcasa sin ventilador** que actúe como un disipador de calor gigante, como [esta](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX).
      Esta es una buena opción ya que es silenciosa, pero tu Pi **se** calentará bastante, especialmente durante el proceso de sincronización inicial de blockchain.
      ¡Crédito al usuario de Discord Ken por señalarnos en esta dirección!
  - Como regla general, recomendamos ir **con un ventilador** porque vamos a hacer overclocking a la Pi significativamente.

Puedes obtener muchas de estas cosas juntas para mayor comodidad - por ejemplo, [Canakit ofrece un kit](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) con muchos componentes incluidos.
Sin embargo, podrías conseguirlo todo más barato si obtienes las partes por separado (y si tienes el equipo, puedes [imprimir en 3D tu propia carcasa Pi](https://www.thingiverse.com/thing:3793664).)

Otros componentes que necesitarás:

- Una **Unidad de Estado Sólido USB 3.0+**. La recomendación general es una **unidad de 2 TB**.
  - El [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) es un excelente ejemplo de uno que se sabe que funciona bien.
  - :warning: Usar un SSD SATA con un adaptador SATA-a-USB **no se recomienda** debido a [problemas como este](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931).
    Si sigues este camino, hemos incluido una prueba de rendimiento que puedes usar para verificar si funcionará o no en la sección [Prueba del Rendimiento del SSD](#prueba-del-rendimiento-del-ssd).
- Un **cable ethernet** para acceso a internet. Debe ser al menos **Cat 5e** clasificado.
  - Ejecutar un nodo por Wi-Fi **no se recomienda**, pero si no tienes otra opción, puedes hacerlo en lugar de usar un cable ethernet.
- Un **UPS** para actuar como fuente de energía si alguna vez pierdes electricidad.
  La Pi realmente no consume mucha energía, por lo que incluso un UPS pequeño durará un tiempo, pero generalmente cuanto más grande, mejor. Ve con el UPS más grande que puedas permitirte.
  Además, recomendamos que **conectes tu módem, enrutador y otros equipos de red** también, no tiene mucho sentido mantener tu Pi viva si tu enrutador muere.

Dependiendo de tu ubicación, ventas, tu elección de SSD y UPS, y cuántas de estas cosas ya tienes, probablemente terminarás gastando **alrededor de $200 a $500 USD** para una configuración completa.

### Hacer que el Ventilador Funcione Más Silenciosamente

Cuando obtengas el ventilador, por defecto probablemente se te indicará conectarlo al pin GPIO de 5v, como se muestra en la imagen de abajo.
El ventilador tendrá un conector con dos orificios; el negro debe ir a GND (pin 6), y el rojo debe ir a +5v (pin 4).
![](./images/pi/Pinout.png)

Sin embargo, en nuestra experiencia, esto hace que el ventilador funcione muy ruidoso y rápido, lo cual no es realmente necesario.
Si quieres hacerlo más silencioso mientras sigue funcionando fresco, intenta conectarlo al pin de 3.3v (Pin 1, el azul) en lugar del pin de 5v.
Esto significa que en tu ventilador, el punto negro irá a GND (pin 6) todavía, pero ahora el punto rojo irá a +3.3v (pin 1).

Si tu ventilador tiene un conector donde los dos orificios están uno al lado del otro y no puedes separarlos, puedes poner [algunos puentes como este](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) entre él y los pines GPIO en la Pi.

### Instalación del Sistema Operativo

Hay algunas variedades de sistema operativo Linux que soportan la Raspberry Pi.
Para esta guía, vamos a adherirnos a **Ubuntu 20.04**.
Ubuntu es un sistema operativo probado y verdadero que se usa en todo el mundo, y 20.04 es (al momento de escribir esto) la última de las versiones de Soporte a Largo Plazo (LTS), lo que significa que seguirá recibiendo parches de seguridad durante mucho tiempo.
Si prefieres quedarte con un sabor diferente de Linux como Raspbian, siéntete libre de seguir las guías de instalación existentes para eso - solo ten en cuenta que esta guía está construida para Ubuntu, por lo que no todas las instrucciones pueden coincidir con tu sistema operativo.

La buena gente de Canonical ha escrito [una guía maravillosa sobre cómo instalar la imagen de Ubuntu Server en una Pi](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview).

Sigue **los pasos 1 a 4** de la guía anterior para la configuración del servidor.
Para la imagen del sistema operativo, quieres seleccionar `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`.

Si decides que quieres una interfaz de usuario de escritorio (para que puedas usar un mouse y tener ventanas para arrastrar), necesitarás seguir el paso 5 también.
Sugerimos que no hagas esto y simplemente te quedes con la imagen del servidor, porque la interfaz de usuario de escritorio agregará algo de sobrecarga adicional y trabajo de procesamiento a tu Pi con relativamente poco beneficio.
Sin embargo, si estás decidido a ejecutar un escritorio, entonces recomendamos elegir la opción Xubuntu.
Es bastante ligera en recursos y muy fácil de usar.

Una vez que esto esté completo, estás listo para comenzar a preparar Ubuntu para ejecutar un nodo de Rocket Pool.
Puedes usar la terminal local en él, o puedes hacer SSH desde tu escritorio/portátil como sugiere la guía de instalación.
El proceso será el mismo de cualquier manera, así que haz lo que sea más conveniente para ti.

Si no estás familiarizado con `ssh`, echa un vistazo a la guía [Introducción a Secure Shell](../ssh).

::: warning NOTA
En este punto, deberías _considerar fuertemente_ configurar tu enrutador para hacer que la dirección IP de tu Pi sea **estática**.
Esto significa que tu Pi tendrá la misma dirección IP para siempre, por lo que siempre puedes hacer SSH en ella usando esa dirección IP.
De lo contrario, es posible que la IP de tu Pi pueda cambiar en algún momento, y el comando SSH anterior ya no funcionará.
Tendrás que entrar en la configuración de tu enrutador para averiguar cuál es la nueva dirección IP de tu Pi.

Cada enrutador es diferente, por lo que necesitarás consultar la documentación de tu enrutador para aprender cómo asignar una dirección IP estática.
:::

## Montaje del SSD

Como habrás deducido, después de seguir las instrucciones de instalación anteriores, el sistema operativo principal se ejecutará desde la tarjeta microSD.
Eso no es lo suficientemente grande ni lo suficientemente rápido para contener todos los datos de blockchain de Ejecución y Consenso, que es donde entra el SSD.
Para usarlo, tenemos que configurarlo con un sistema de archivos y montarlo en la Pi.

### Conexión del SSD a los Puertos USB 3.0

Comienza enchufando tu SSD en uno de los puertos USB 3.0 de la Pi. Estos son los puertos **azules**, no los negros:

![](./images/pi/USB.png)

Los negros son puertos USB 2.0 lentos; solo son buenos para accesorios como ratones y teclados.
Si tienes tu teclado enchufado en los puertos azules, sácalo y enchúfalo en los negros ahora.

### Formateo del SSD y Creación de una Nueva Partición

::: warning
Este proceso va a borrar todo en tu SSD.
Si ya tienes una partición con cosas en ella, OMITE ESTE PASO porque estás a punto de eliminarlo todo!
Si nunca has usado este SSD antes y está totalmente vacío, entonces sigue este paso.
:::

Ejecuta este comando para encontrar la ubicación de tu disco en la tabla de dispositivos:

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

Lo importante que necesitas es la porción `logical name: /dev/sda`, o más bien, la parte **`/dev/sda`** de ella.
Vamos a llamar a esto la **ubicación del dispositivo** de tu SSD.
Para esta guía, solo usaremos `/dev/sda` como la ubicación del dispositivo - la tuya probablemente será la misma, pero sustitúyela con lo que ese comando muestre para el resto de las instrucciones.

Ahora que conocemos la ubicación del dispositivo, formateémoslo y hagamos una nueva partición en él para que podamos usarlo realmente.
De nuevo, **estos comandos eliminarán lo que ya esté en el disco!**

Crea una nueva tabla de particiones:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Formatea la nueva partición con el sistema de archivos `ext4`:

```shell
sudo mkfs -t ext4 /dev/sda1
```

Agrégale una etiqueta (no tienes que hacer esto, pero es divertido):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Confirma que esto funcionó ejecutando el comando a continuación, que debería mostrar una salida como la que ves aquí:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Si ves todo eso, entonces estás bien. Toma la salida `UUID="..."` y ponla en algún lugar temporalmente, porque la vas a necesitar en un minuto.

### Optimización de la Nueva Partición

A continuación, ajustemos un poco el nuevo sistema de archivos para optimizarlo para la actividad del validador.

Por defecto, ext4 reservará el 5% de su espacio para procesos del sistema.
Como no necesitamos eso en el SSD porque solo almacena los datos de cadena de Ejecución y Consenso, podemos deshabilitarlo:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Montaje y Habilitación del Montaje Automático

Para usar la unidad, tienes que montarla en el sistema de archivos.
Crea un nuevo punto de montaje donde quieras (usaremos `/mnt/rpdata` aquí como ejemplo, siéntete libre de usar eso):

```shell
sudo mkdir /mnt/rpdata
```

Ahora, monta la nueva partición SSD en esa carpeta:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Después de esto, la carpeta `/mnt/rpdata` apuntará al SSD, por lo que cualquier cosa que escribas en esa carpeta vivirá en el SSD.
Aquí es donde vamos a almacenar los datos de cadena para Ejecución y Consenso.

Ahora, agreguémoslo a la tabla de montaje para que se monte automáticamente al inicio.
¿Recuerdas el `UUID` del comando `blkid` que usaste antes?
Aquí es donde será útil.

```shell
sudo nano /etc/fstab
```

Esto abrirá un editor de archivos interactivo, que se verá así para empezar:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

Usa las teclas de flecha para bajar a la línea inferior, y agrega esta línea al final:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

Reemplaza el valor en `UUID=...` con el de tu disco, luego presiona `Ctrl+O` y `Enter` para guardar, luego `Ctrl+X` y `Enter` para salir.
Ahora el SSD se montará automáticamente cuando reinicies. ¡Genial!

### Prueba del Rendimiento del SSD

Antes de continuar, debes probar la velocidad de lectura/escritura de tu SSD y cuántas solicitudes de I/O puede manejar por segundo (IOPS).
Si tu SSD es demasiado lento, entonces no funcionará bien para un nodo de Rocket Pool y vas a terminar perdiendo dinero con el tiempo.

Para probarlo, vamos a usar un programa llamado `fio`. Instálalo así:

```shell
sudo apt install fio
```

A continuación, muévete al punto de montaje de tu SSD:

```shell
cd /mnt/rpdata
```

Ahora, ejecuta este comando para probar el rendimiento del SSD:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

La salida debería verse así:

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

Lo que te importa son las líneas que comienzan con `read:` y `write:` bajo la línea `test:`.

- Tu **lectura** debe tener IOPS de al menos **15k** y ancho de banda (BW) de al menos **60 MiB/s**.
- Tu **escritura** debe tener IOPS de al menos **5000** y ancho de banda de al menos **20 MiB/s**.

Esas son las especificaciones del Samsung T5 que usamos, que funcionan muy bien.
También hemos probado un SSD más lento con IOPS de lectura de 5k e IOPS de escritura de 1k, y tiene muchos problemas para mantener el ritmo con la capa de consenso.
Si usas un SSD más lento que las especificaciones anteriores, solo prepárate para que puedas ver muchas atestaciones perdidas.
Si el tuyo cumple o supera estas especificaciones, entonces estás listo y puedes continuar.

::: tip NOTA
Si tu SSD no cumple con las especificaciones anteriores pero debería, es posible que puedas arreglarlo con una actualización de firmware.
Por ejemplo, esto ha sido experimentado por la comunidad de Rocket Pool con el Samsung T7.
Dos de ellos recién sacados de la caja solo mostraron 3.5K IOPS de lectura y 1.2K IOPS de escritura.
Después de aplicar todas las actualizaciones de firmware disponibles, el rendimiento volvió a los números mostrados en el ejemplo anterior.
Consulta con el sitio web de soporte de tu fabricante para obtener el firmware más reciente y asegúrate de que tu unidad esté actualizada - es posible que tengas que actualizar el firmware varias veces hasta que no haya más actualizaciones.
:::

Por último, pero no menos importante, elimina el archivo de prueba que acabas de crear:

```shell
sudo rm /mnt/rpdata/test
```

## Configuración del Espacio de Intercambio

La Pi tiene 8 GB (o 4 GB si seguiste ese camino) de RAM.
Para nuestra configuración, eso será suficiente.
Por otra parte, nunca está de más agregar un poco más.
Lo que vamos a hacer ahora es agregar lo que se llama **espacio de intercambio**.
Esencialmente, significa que vamos a usar el SSD como "RAM de respaldo" en caso de que algo salga horriblemente, horriblemente mal y la Pi se quede sin RAM normal.
El SSD no es tan rápido como la RAM normal, por lo que si llega al espacio de intercambio ralentizará las cosas, pero no se bloqueará completamente y romperá todo.
Piensa en esto como un seguro extra que (muy probablemente) nunca necesitarás.

### Creación de un Archivo de Intercambio

El primer paso es crear un nuevo archivo que actuará como tu espacio de intercambio.
Decide cuánto quieres usar - un comienzo razonable sería 8 GB, por lo que tienes 8 GB de RAM normal y 8 GB de "RAM de respaldo" para un total de 16 GB.
Para estar súper seguro, puedes hacer 24 GB para que tu sistema tenga 8 GB de RAM normal y 24 GB de "RAM de respaldo" para un total de 32 GB, pero esto probablemente sea excesivo.
Afortunadamente, dado que tu SSD tiene 1 o 2 TB de espacio, asignar 8 a 24 GB para un archivo de intercambio es insignificante.

Para este tutorial, elijamos un buen punto medio - digamos, 16 GB de espacio de intercambio para una RAM total de 24 GB.
Solo sustituye el número que quieras a medida que avanzamos.

Ingresa esto, que creará un nuevo archivo llamado `/mnt/rpdata/swapfile` y lo llenará con 16 GB de ceros.
Para cambiar la cantidad, solo cambia el número en `count=16` por lo que quieras. **Ten en cuenta que esto va a tomar mucho tiempo, pero está bien.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

A continuación, establece los permisos para que solo el usuario root pueda leer o escribir en él (por seguridad):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Ahora, márcalo como un archivo de intercambio:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Luego, habilítalo:

```shell
sudo swapon /mnt/rpdata/swapfile
```

Finalmente, agrégalo a la tabla de montaje para que se cargue automáticamente cuando tu Pi se reinicie:

```shell
sudo nano /etc/fstab
```

Agrega una nueva línea al final para que el archivo se vea así:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Presiona `Ctrl+O` y `Enter` para guardar, luego `Ctrl+X` y `Enter` para salir.

Para verificar que esté activo, ejecuta estos comandos:

```shell
sudo apt install htop
htop
```

Tu salida debería verse así en la parte superior:
![](./images/pi/Swap.png)

Si el segundo número en la última fila etiquetada como `Swp` (el que está después de `/`) no es cero, entonces estás listo.
Por ejemplo, si muestra `0K / 16.0G` entonces tu espacio de intercambio se activó con éxito.
Si muestra `0K / 0K` entonces no funcionó y tendrás que confirmar que ingresaste los pasos anteriores correctamente.

Presiona `q` o `F10` para salir de `htop` y volver a la terminal.

### Configuración de Swappiness y Cache Pressure

Por defecto, Linux usará ansiosamente mucho espacio de intercambio para aliviar algo de la presión de la RAM del sistema.
No queremos eso. Queremos que use toda la RAM hasta el último segundo antes de confiar en SWAP.
El siguiente paso es cambiar lo que se llama el "swappiness" del sistema, que es básicamente qué tan ansioso es para usar el espacio de intercambio.
Hay mucho debate sobre qué valor establecer para esto, pero hemos encontrado que un valor de 6 funciona bastante bien.

También queremos reducir la "cache pressure", que dicta qué tan rápido la Pi eliminará un caché de su sistema de archivos.
Dado que vamos a tener mucha RAM de sobra con nuestra configuración, podemos hacer esto "10", lo que dejará el caché en memoria por un tiempo, reduciendo la I/O del disco.

Para establecer estos, ejecuta estos comandos:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Ahora, ponlos en el archivo `sysctl.conf` para que se vuelvan a aplicar después de un reinicio:

```shell
sudo nano /etc/sysctl.conf
```

Agrega estas dos líneas al final:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Luego guarda y sal como lo has hecho antes (`Ctrl+O`, `Ctrl+X`).

## Overclocking de la Pi

Por defecto, el procesador de 1.5 GHz con el que viene la Pi es un pequeño dispositivo bastante capaz.
En su mayor parte, deberías poder validar con él bien.
Sin embargo, hemos notado que en raras ocasiones, tu cliente validador se atasca trabajando en algunas cosas y simplemente no tiene suficiente potencia para mantenerse al día con los deberes de atestación de tu validador.
Cuando eso sucede, verás algo como esto en el [explorador beaconcha.in](https://beaconcha.in) (descrito con más detalle en la guía [Monitoreo del Rendimiento de tu Nodo](../performance) más adelante):

![](./images/pi/Incl-Dist.png)

Esa distancia de inclusión de 8 significa que tomó mucho tiempo enviar esa atestación, y serás ligeramente penalizado por llegar tarde.
Idealmente, todas deberían ser 0.
Aunque raras, estas ocurren cuando se ejecuta en configuraciones de stock.

Sin embargo, hay una manera de mitigar esto: overclocking.
El overclocking es, con mucho, la forma más fácil de obtener algo de rendimiento extra del CPU de tu Pi y prevenir esas desagradables distancias de inclusión altas.
Francamente, el reloj de CPU predeterminado de 1.5 GHz está realmente falto de potencia.
Puedes acelerarlo bastante a través del overclocking, y dependiendo de qué tan lejos lo lleves, también puedes hacerlo de manera bastante segura.

El overclocking de la Pi es muy simple - solo implica cambiar algunos números en un archivo de texto.
Hay dos números que importan: el primero es el **reloj del núcleo**, que determina directamente qué tan rápido funciona el CPU ARM.
El segundo es el **sobrevoltaje**, que determina el voltaje que se alimenta al CPU ARM.
Las velocidades más altas generalmente requieren un voltaje más alto, pero el CPU de la Pi puede manejar bastante voltaje adicional sin ningún daño apreciable.
Puede desgastarse un poco más rápido, pero todavía estamos hablando del orden de años y la Pi 5 estará fuera para entonces, ¡así que no se hace ningún daño real!

Más bien, la preocupación real con el sobrevoltaje es que **los voltajes más altos conducen a temperaturas más altas**.
Esta sección te ayudará a ver qué tan caliente se pone tu Pi bajo una carga pesada, para que no la empujes demasiado lejos.

::: warning
Aunque el overclocking a los niveles que vamos a hacer es bastante seguro y confiable, estás a merced de lo que se llama la "lotería de silicio".
Cada CPU es ligeramente diferente de maneras microscópicas, y algunas de ellas simplemente pueden hacer overclocking mejor que otras.
Si haces overclocking demasiado lejos / demasiado fuerte, entonces tu sistema puede volverse **inestable**.
Las Pis inestables sufren de todo tipo de consecuencias, desde reinicios constantes hasta congelarse completamente.
**¡En el peor de los casos, podrías corromper tu tarjeta microSD y tener que reinstalar todo desde cero!**

**Al seguir la orientación aquí, tienes que aceptar el hecho de que estás corriendo ese riesgo.**
Si eso no vale la pena para ti, entonces omite el resto de esta sección.
:::

## Evaluación comparativa de la Configuración de Stock

Antes del overclocking, debes perfilar de qué es capaz tu Pi en su configuración de stock, recién comprada.
Hay tres cosas clave para observar:

1. **Rendimiento** (qué tan rápido tu Pi calcula las cosas)
2. **Temperatura** bajo carga (qué tan caliente se pone)
3. **Estabilidad** (cuánto tiempo funciona antes de bloquearse)

Vamos a obtener estadísticas sobre las tres a medida que avanzamos.

### Rendimiento

Para medir el rendimiento, puedes usar LINPACK.
Lo construiremos desde la fuente.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

Ahora ejecútalo así:

```shell
linpack
Enter array size (q to quit) [200]:
```

Solo presiona `enter` para dejarlo en el predeterminado de 200, y déjalo ejecutarse.
Cuando termine, la salida se verá así:

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

Lo que necesitas mirar es la última fila, en la columna `KFLOPS`.
Este número (1120277.186 en el ejemplo anterior) representa tu rendimiento de computación.
No significa nada por sí mismo, pero nos da una buena línea base para comparar el rendimiento de overclocking.
Llamemos a esto el **KFLOPS de stock**.

### Temperatura

A continuación, estresemos la Pi y observemos su temperatura bajo carga pesada.
Primero, instala este paquete, que proporcionará una herramienta llamada `vcgencmd` que puede imprimir detalles sobre la Pi:

```shell
sudo apt install libraspberrypi-bin
```

Una vez instalado esto, reinicia la Pi (esto es necesario para que algunos permisos nuevos se apliquen).
A continuación, instala un programa llamado **stressberry**.
Esta será nuestra herramienta de evaluación comparativa.
Instálalo así:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip NOTA
Si stressberry arroja un error sobre no poder leer la información de temperatura o no poder abrir la instancia `vchiq`, puedes solucionarlo con el siguiente comando:

```shell
sudo usermod -aG video $USER
```

Luego cierra sesión y vuelve a entrar, reinicia tu sesión SSH, o reinicia la máquina e inténtalo de nuevo.
:::

A continuación, ejecútalo así:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Esto ejecutará una nueva prueba de estrés llamada "Stock" durante 300 segundos (5 minutos) con 60 segundos de enfriamiento antes y después de la prueba, en los 4 núcleos de la Pi.
Puedes jugar con estos tiempos si quieres que se ejecute más tiempo o tenga más enfriamiento, pero esto funciona como una prueba de estrés rápida y sucia para mí.
Los resultados se guardarán en un archivo llamado `stock.out`.

Durante la fase principal de la prueba, la salida se verá así:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Esto básicamente te dice qué tan caliente se pondrá la Pi.
A 85°C, la Pi realmente comenzará a limitarse a sí misma y reducirá la velocidad del reloj para que no se sobrecaliente.
Afortunadamente, como agregaste un disipador de calor y un ventilador, ¡no deberías acercarte a esto!
Dicho esto, generalmente tratamos de mantener las temperaturas por debajo de 65°C por el bien de la salud general del sistema.

Si quieres monitorear la temperatura del sistema durante las operaciones normales de validación, puedes hacer esto con `vcgencmd`:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Estabilidad

Probar la estabilidad de un overclock implica responder estas tres preguntas:

- ¿La Pi se enciende y llega a un prompt de inicio de sesión / inicia el servidor SSH?
- ¿Se congela o reinicia aleatoriamente durante las operaciones normales?
- ¿Se congela o reinicia aleatoriamente durante carga pesada?

Para que un overclock sea verdaderamente estable, las respuestas deben ser **sí, no y no**.
Hay algunas formas de probar esto, pero la más fácil en este punto es simplemente ejecutar `stressberry` durante mucho tiempo.
Cuánto tiempo es completamente tu decisión - cuanto más tiempo dure, más seguro puedes estar de que el sistema es estable.
Algunas personas solo ejecutan la prueba de 5 minutos anterior y la consideran buena si sobrevive; otras la ejecutan durante media hora; otras la ejecutan durante 8 horas o incluso más.
Cuánto tiempo ejecutarla es una decisión personal que tendrás que tomar basándote en tu propia tolerancia al riesgo.

Para cambiar el tiempo de ejecución, solo modifica el parámetro `-d` con el número de segundos que quieres que se ejecute la prueba.
Por ejemplo, si decidiste que media hora es el camino a seguir, podrías hacer `-d 1800`.

## Tu Primer Overclocking - 1800 MHz (Ligero)

El primer overclocking que vamos a hacer es relativamente "ligero" y confiable, pero aún proporciona un buen impulso en potencia de cómputo.
Vamos a pasar del stock de 1500 MHz a 1800 MHz - ¡un aumento de velocidad del 20%!

Abre este archivo:

```shell
sudo nano /boot/firmware/usercfg.txt
```

Agrega estas dos líneas al final:

```shell
arm_freq=1800
over_voltage=3
```

Luego guarda el archivo y reinicia.

Estas configuraciones aumentarán el reloj del CPU en un 20%, y también aumentarán el voltaje del CPU de 0.88v a 0.93v (cada configuración `over_voltage` lo aumenta en 0.025v).
Esta configuración debería ser alcanzable por cualquier Pi 4B, por lo que tu sistema debería reiniciarse y proporcionar un prompt de inicio de sesión o acceso SSH en solo unos momentos.
Si no lo hace, y tu Pi deja de responder o entra en un bucle de arranque, tendrás que restablecerla - lee la siguiente sección para eso.

### Restablecimiento Después de un Overclocking Inestable

Si tu Pi deja de responder, o sigue reiniciándose una y otra vez, entonces necesitas reducir el overclocking.
Para hacer eso, sigue estos pasos:

1. Apaga la Pi.
2. Saca la tarjeta microSD.
3. Enchufa la tarjeta en otra computadora Linux con un adaptador microSD.
   \*NOTA: Esto **tiene que ser** otra computadora Linux. ¡No funcionará si la enchufas en una máquina Windows, porque Windows no puede leer el sistema de archivos `ext4` que usa la tarjeta SD!\*\*
4. Monta la tarjeta en la otra computadora.
5. Abre `<punto de montaje SD>/boot/firmware/usercfg.txt`.
6. Baja el valor `arm_freq`, o aumenta el valor `over_voltage`. _NOTA: **no vayas más alto que over_voltage=6.** Los valores más altos no están soportados por la garantía de la Pi, y corren el riesgo de degradar el CPU más rápido de lo que podrías sentirte cómodo._
7. Desmonta la tarjeta SD y retírala.
8. Vuelve a enchufar la tarjeta en la Pi y enciéndela.

Si la Pi funciona, ¡entonces genial! Continúa abajo.
Si no, repite todo el proceso con configuraciones aún más conservadoras.
En el peor de los casos, puedes simplemente eliminar las líneas `arm_freq` y `over_voltage` por completo para devolverla a la configuración de stock.

### Prueba de 1800 MHz

Una vez que hayas iniciado sesión, ejecuta `linpack` nuevamente para probar el nuevo rendimiento.
Aquí hay un ejemplo de nuestra Pi de prueba:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

De nuevo, toma la columna `KFLOPS` en la última fila.
Para compararla con la configuración de stock, simplemente divide los dos números:
`1337238.504 / 1120277.186 = 1.193668`

¡Muy bien! Ese es un aumento del 19.4% en el rendimiento, lo cual es de esperarse ya que estamos ejecutando un 20% más rápido.
Ahora verifiquemos las temperaturas con la nueva velocidad de reloj y configuraciones de voltaje:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Deberías ver una salida como esta:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

No está mal, alrededor de 6° más caliente que la configuración de stock pero aún muy por debajo del umbral donde personalmente nos detendríamos.

Puedes ejecutar una prueba de estabilidad más larga aquí si te sientes cómodo, o puedes seguir adelante para llevar las cosas aún más alto.

## Yendo a 2000 MHz (Medio)

El siguiente hito será 2000 MHz. Esto representa un aumento del 33.3% en la velocidad del reloj, lo cual es bastante significativo.
La mayoría de la gente considera que este es un gran equilibrio entre rendimiento y estabilidad, por lo que detienen el proceso aquí.

Nuestra recomendación para este nivel es comenzar con estas configuraciones:

```shell
arm_freq=2000
over_voltage=5
```

Esto aumentará el voltaje del núcleo a 1.005v.
Prueba esto con las pruebas de `linpack` y `stressberry`.
Si sobrevive a ellas, entonces estás listo. Si se congela o reinicia aleatoriamente, entonces debes aumentar el voltaje:

```shell
arm_freq=2000
over_voltage=6
```

Eso pone el voltaje del núcleo en 1.03v, que es tan alto como puedes ir antes de anular la garantía.
Eso usualmente funciona para la mayoría de las Pis.
Si no, en lugar de aumentar el voltaje aún más, **deberías reducir tu velocidad de reloj e intentar de nuevo.**

Para referencia, aquí están los números de nuestra ejecución de 2000:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

Eso es un aumento del 32.3% que está en línea con lo que esperaríamos. ¡No está mal!

Aquí están nuestras temperaturas:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

Un aumento de 7 grados más, pero aún bajo nuestro umbral de 65°C.

## Yendo a 2100 MHz (Pesado)

El siguiente paso representa un sólido **aumento del 40%** sobre la configuración de stock.

**NOTA: No todas las Pi son capaces de hacer esto mientras se mantienen en `over_voltage=6`.
Pruébalo, y si se rompe, vuelve a 2000 MHz.**

La configuración se verá así:

```shell
arm_freq=2100
over_voltage=6
```

Para referencia, aquí están nuestros resultados:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

¡Eso es un aumento del 39.4%!

Aquí están nuestras temperaturas:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

Justo por debajo de 60°C, por lo que hay mucho espacio.

## Yendo a 2250 MHz (Extremo)

Esta es la configuración en la que ejecutamos nuestras Pi, que ha sido estable durante más de un año al momento de escribir esto.
Aún así, **se advierte a los usuarios sobre el overclocking tan alto** - ¡asegúrate de hacer pruebas de estabilidad exhaustivas y tener mucho margen térmico antes de intentar hacer que esta sea la configuración de producción de tu nodo!

Nuestra configuración es:

```shell
arm_freq=2250
over_voltage=10
```

Aquí están nuestros resultados:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

¡Eso es un 46% más rápido que la configuración de stock!

OV10 es lo máximo que el firmware de stock permitirá que la Pi llegue, y 2250 MHz es lo más rápido que pudimos ejecutar de manera confiable en producción.

Las temperaturas en la prueba de estrés llegan tan alto:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Pero durante la validación real, tienden a permanecer por debajo de 60C, lo cual es aceptable para nosotros.

## Próximos Pasos

Y con eso, ¡tu Pi está en funcionamiento y lista para ejecutar Rocket Pool!
Pasa a la sección [Eligiendo tus Clientes ETH](../eth-clients).
