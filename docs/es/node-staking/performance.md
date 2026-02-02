# Monitoreo del Rendimiento de tu Nodo

Ahora que tu nodo está en funcionamiento y tienes uno o más minipools conectados, necesitarás vigilar todo para asegurarte de que funcione sin problemas.

Puedes rastrear tu máquina de dos formas:

1. Directamente accediendo a las métricas de tu máquina
2. Indirectamente mediante el uso de herramientas de terceros

Se recomienda usar una combinación de ambos según tus necesidades.

## Rastreo Directo del Estado de tu Máquina

Con respecto al estado de tu máquina, hay algunas métricas útiles que probablemente querrás vigilar:

- Uso de CPU
- RAM libre restante
- Uso del espacio Swap (si lo habilitaste)
- Espacio libre restante en disco
- E/S de red (si tu ISP impone un límite de datos)

::: tip NOTA
Las secciones a continuación te muestran algunas formas de monitorear las cosas, pero requieren que hayas iniciado sesión en la terminal de tu máquina.
Existe un método mejor, mucho más conveniente y con mejor aspecto que utiliza un [panel web de Grafana](./grafana.mdx), pero todavía está en desarrollo.
¡Mantente atento a la finalización de esa sección!
:::

### CPU, RAM y Swap

Las primeras tres se pueden ver fácilmente con el programa `htop`.
Esto te dará una vista en vivo de los recursos de tu sistema, como se muestra en esta captura de pantalla de una Raspberry Pi:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

En la pantalla superior con las barras, cada barra numerada se refiere al uso actual de un núcleo de CPU.

`Mem` te muestra cuánta RAM estás usando actualmente (en esta captura de pantalla, 1.75 GB) y cuánta tienes en total (3.70 GB).

`Swp` te muestra cuánto espacio swap estás usando (85.8 MB) y cuánto tienes en total (12.0 GB).

En la tabla inferior, cada fila representa un proceso.
Tus clientes de Ejecución y Consenso probablemente estarán en la parte superior (en este caso, Geth y Nimbus), que puedes ver en la columna más a la derecha etiquetada como `Command`.

La columna `RES` te muestra cuánta RAM está usando cada proceso - en esta captura de pantalla, Geth está usando 748 MB y Nimbus está usando 383 MB.

La columna `CPU%` te muestra cuánta potencia de CPU está consumiendo cada proceso.
100% representa un solo núcleo, así que si es superior al 100%, eso significa que está usando mucho de múltiples núcleos (como Geth aquí, con 213%).

### Espacio Libre Restante en Disco

Vigilar cuánto espacio libre en disco tienes es fácil de hacer con el siguiente comando:

```
df -h
```

Esto proporcionará una salida similar al siguiente ejemplo:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Para configuraciones convencionales donde tienes una unidad que almacena tanto tu Sistema Operativo como los datos de la cadena de Ejecución y Consenso, solo necesitas mirar la entrada que tiene `/` en la columna `Mounted on`.
Esto representa tu disco principal.
Si alguna vez parece que se está quedando sin espacio (digamos, un 80% usado o más), entonces necesitas empezar a pensar en hacer algo de limpieza.
Por ejemplo, si estás ejecutando Geth, es posible que desees ver [cómo podarlo](./pruning) para liberar algo de espacio.

Para configuraciones que almacenan los datos de la cadena de Ejecución y Consenso en una unidad separada, también querrás mirar la fila que tiene tu carpeta de datos de la cadena en la columna `Mounted on`.
En este ejemplo montamos un SSD externo en `/mnt/rpdata`, así que tendremos que vigilarlo para asegurarnos de que no crezca demasiado.

### E/S de Red y Uso de Datos

Si deseas rastrear cuánta E/S de red usa tu sistema con el tiempo, puedes instalar una utilidad útil llamada `vnstat`.
Aquí hay un ejemplo de cómo instalarla en un sistema Ubuntu / Debian:

```shell
sudo apt install vnstat
```

Para ejecutarla, haz esto (suponiendo que `eth0` es el nombre de la interfaz de red que usas para tu conexión a Internet):

```
vnstat -i eth0
```

Esto no funcionará de inmediato porque necesita tiempo para recopilar datos sobre tu sistema, pero a medida que pasen los días y semanas, terminará luciendo así:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

Esto te permitirá vigilar tu uso total de red, lo que podría ser útil si tu ISP impone un límite de datos.

Ten en cuenta que la mayoría de los sistemas modernos utilizan más comúnmente otras interfaces de red como eno0 y enp0s31f6 y no eth0.
Si necesitas verificar tu interfaz de red, ejecuta el siguiente comando:

```shell
ls /sys/class/net
```

Los dispositivos Ethernet (cableados) generalmente comienzan con `e`, como los ejemplos anteriores.
Los dispositivos inalámbricos generalmente comienzan con `w`.

## Notificaciones de Alerta del Smartnode

[Monitoreo de tu Stack Smartnode con Notificaciones de Alerta](./maintenance/alerting.md) te guía a través del uso de la funcionalidad de notificación de alertas del Smartnode para recibir notificaciones sobre la salud y eventos importantes de tu Rocket Pool Smartnode.

## Monitoreo de Rendimiento de Terceros

El mejor monitoreo utiliza un modelo de queso suizo: cada herramienta tiene agujeros, pero si las apilas una encima de otra, hay menos posibilidades de que algo se escape y te sorprenda.

Ten en cuenta que estas herramientas de terceros son utilizadas por la comunidad de Rocket Pool, pero no están respaldadas ni soportadas oficialmente por el equipo de Rocket Pool.
Si tienes una sugerencia de herramienta, o eres propietario de una herramienta, eres muy bienvenido a agregar una solicitud de extracción con detalles sobre tu herramienta.

### Sitio Web Beaconcha.in: Uso de la Beacon Chain como Fuente de Métricas

El sitio web y la aplicación del explorador de bloques [Beaconcha.in](https://beaconcha.in) proporcionan una forma de rastrear el rendimiento de tu validador observando su actividad en la cadena.
También tienen la opción de recibir [notificaciones por correo electrónico](https://beaconcha.in/user/notifications) para eventos significativos como tiempo de inactividad.
Navega a su sitio e ingresa la clave pública de tu validador en el cuadro de búsqueda en la parte superior de la pantalla.

::: tip
Si olvidaste la clave pública de tu validador, puedes recuperarla fácilmente con el comando `rocketpool minipool status`.
:::

Si todo está configurado correctamente, deberías ver algo como esto:
![](./local/images/pi/Beaconchain.png)

::: tip NOTA
El enlace anterior es para la versión de **mainnet** de Beaconcha.in.
Si estás ejecutando en la Testnet Hoodi, ¡usa [este enlace en su lugar](https://hoodi.beaconcha.in)!
:::

Este es un registro de toda la actividad de Beacon Chain para tu validador.
Puedes usarlo para verificar el saldo de tu validador en la Beacon Chain para verlo crecer con el tiempo y calcular tu APY.

También puedes usarlo para evaluar rápidamente si tu validador está vivo y funcionando correctamente.
Si lo está, todas las atestaciones deberían decir `Attested` para su **Status**, e idealmente todas las **Opt. Incl. Dist.** deberían ser 0 (aunque un 1 o 2 ocasional está bien).

Si hay muchos bloques que dicen `Missed`, entonces tu validador no está funcionando correctamente.
Debes verificar los registros de los servicios `eth1`, `eth2` y `validator` con `rocketpool service logs ...` si estás usando el modo Docker o Híbrido (o los scripts de registro correspondientes si estás usando el modo Nativo) para buscar problemas.

**Deberías marcar esta pestaña o crear un marcador para poder acceder rápidamente a ella y verificar el estado de tu validador.**

#### Uso de Beaconcha.in para Monitorear Múltiples Minipools

Beaconcha.in tiene una [vista de panel](https://beaconcha.in/dashboard) que te permite monitorear múltiples validadores o minipools a la vez.
Simplemente agrega tus índices de validador uno a la vez. Si tienes muchos minipools, puedes ejecutar:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

para obtener una lista separada por comas, y colocarla en la barra de URL así: `https://beaconcha.in/dashboard?validators=123456,123457`

### Aplicación Beaconcha.in: Resumen de Validadores y Notificaciones Push

El sitio web de Beaconcha.in es una excelente manera de ver métricas y configurar alertas por correo electrónico.
Su aplicación móvil tiene una naturaleza más de "vistazo rápido".
También cuenta con un servicio de notificación push que incluye algunas alertas útiles como:

1. Notificaciones de problemas como atestaciones perdidas
2. Notificaciones de rondas de recompensa de Rocket Pool
3. Sobre/sub-colateralización del RPL en tu nodo

Ten en cuenta que la aplicación tiene una versión gratuita y opciones de pago con características de conveniencia como widgets de pantalla de inicio.

### Renombrar tus Validadores en Beaconcha.in

El sitio web de Beaconcha.in tiene una función que permite a los usuarios renombrar sus validadores, haciéndolos más fáciles de identificar/buscar.

Para poder usar esta función, necesitas firmar un mensaje usando la clave privada de la billetera de tu nodo, para demostrar que eres la persona que controla ese validador.

El Smartnode v1.5.1 incluye la capacidad de firmar mensajes con la clave privada de tu billetera de nodo usando el comando `rocketpool node sign-message`, luego proporcionando el mensaje que deseas firmar.
Debe contener el término 'beaconcha.in' para poder usarlo para renombrar tus validadores.

![](../node-staking/images/sign-message.png)

Abre tu página de validador en Beaconcha.in y haz clic en el botón `Edit validator name`.

![](../node-staking/images/edit-validator-name.png)

Copia el resultado del comando sign-message y pégalo en el campo "Signature".
Completa tu apodo deseado y haz clic en el botón `Save changes`.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: Escaneo de Puertos para Tiempo de Actividad

El servicio [Uptimerobot](https://uptimerobot.com/) es un servicio simple que escanea una dirección IP en busca de un puerto abierto.
Si tu máquina deja de estar disponible en el puerto que especificaste, Uptimerobot puede enviarte una notificación de que hay un problema.
El servicio tiene una amplia variedad de opciones de notificación que incluyen correo electrónico, notificación push, SMS, llamada telefónica y webhooks.

La pantalla de configuración se ve algo así:

![](./local/images/uptimerobot.png)

La IP a monitorear es la IP externa de tu nodo, que puedes encontrar iniciando sesión en tu nodo por `ssh` o físicamente, y abriendo [icanhazip.com](https://icanhazip.com/) en un navegador o ejecutando el siguiente comando en tu terminal:

```shell
curl icanhazip.com
```

El puerto a monitorear depende de la configuración de tu nodo; los usuarios que ejecutan la instalación típica del Smartnode probablemente hayan reenviado los puertos 30303 y 9001 para los clientes de Ejecución y Consenso respectivamente, por lo que estas son buenas opciones para el monitoreo del tiempo de actividad.

### Paneles de Métricas de Rocketpool

Hay múltiples iniciativas lideradas por la comunidad para proporcionar una descripción general del rendimiento de tu nodo, así como de la red de Rocket Pool en su conjunto.

### Scripting con Pushover (avanzado)

::: tip NOTA
[Monitoreo de tu Stack Smartnode con Notificaciones de Alerta](./maintenance/alerting.md) te guía a través del uso de la funcionalidad de notificación de alertas del Smartnode que incluye una notificación cuando hay actualizaciones disponibles para tu nodo.
:::

El servicio [Pushover](https://pushover.net/) te permite enviarte notificaciones push.

::: warning NOTA
Esta es una actividad avanzada para emprender.
Puede ser útil si estás familiarizado con el scripting de shell, pero no se recomienda si no te sientes cómodo en un entorno de shell.
:::

Para comenzar con Pushover:

1. Crea una cuenta en [pushover.net](https://pushover.net/)
1. [Crea un token API](https://pushover.net/apps/build)
1. Instala la aplicación móvil Pushover y/o la extensión del navegador
1. Llama a la API de Pushover para cualquier acción que te importe

Llamar a la API de Pushover para enviarte una notificación push se hace a través de una llamada `curl` estructurada así:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Ejemplo: Notificación Push sobre Actualizaciones Disponibles

Si configuras actualizaciones automáticas usando los paquetes `unattended-upgrades` y `update-nofifier`, es posible que desees recibir una notificación push cuando haya actualizaciones disponibles para tu nodo.
Una forma potencial de hacer esto es crear un script en `~/update-notifier.sh` y activarlo diariamente a las 9:00 usando `crontab`.

Para hacer esto, primero crea el script ejecutando:

```shell
nano ~/update-notifier.sh
```

Luego pega el siguiente script:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

A continuación, ejecuta el siguiente comando para marcar el script como ejecutable:

```shell
chmod u+x ~/update-notifier.sh
```

Ahora ejecuta el siguiente comando para abrir tu crontab:

```shell
crontab -e
```

Luego usa las teclas de flecha para desplazarte hacia abajo y agrega la línea `* 9 * * * ~/update-notifier.sh` para que el archivo se vea así:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

Luego presiona `control+x` para salir y presiona `Y` cuando se te pregunte si deseas guardar tus cambios.

Ahora deberías recibir una notificación a las 09:00 hora local si tienes actualizaciones.
Puedes ejecutar el script manualmente escribiendo esto en tu terminal:

```shell
~/update-notifier.sh
```

#### Ejemplo: Recibe Notificaciones cuando tu Daemon UPS APC se Active

Algunos stakers domésticos están usando una fuente de alimentación ininterrumpible con la utilidad `apcupsd` para asegurarse de que su nodo se apague correctamente si se va la luz.

La utilidad `apcupsd` usa el script `apccontrol` para administrar su lógica, por lo tanto, es posible monitorear la actividad de este daemon editando el archivo `/etc/apcupsd/apccontrol`.
Para hacer esto, ejecuta:

```shell
sudo nano /etc/apcupsd/apccontrol
```

Luego, en la parte superior de la línea, agrega el siguiente código para que el archivo se vea así:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

Esto te enviará una notificación push cada vez que tu daemon UPS tome acción, incluida la funcionalidad periódica de "autoprueba".
