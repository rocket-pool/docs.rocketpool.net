# Preparando una PC, Mini-PC o NUC

Antes de instalar Rocket Pool, hay algunas comprobaciones que debes hacer para asegurarte de que tu sistema es compatible y funcionará correctamente.

::: danger
Te recomendamos encarecidamente que crees una máquina dedicada para ejecutar un nodo de Rocket Pool.
Ejecutar un nodo en una máquina de uso general, como tu escritorio de trabajo diario o un equipo de juegos, presenta riesgos de seguridad adicionales que pueden comprometer tu billetera y resultar en el robo de tus monedas.

**Para máxima seguridad, por favor construye una nueva máquina que esté dedicada exclusivamente a ejecutar un nodo.**
:::

## Requisitos del Sistema

A continuación se presenta una breve descripción de los requisitos de software y hardware que requiere un nodo de Rocket Pool.
Esta guía asume que ya tienes tu máquina físicamente construida y el sistema operativo instalado.

### Sistemas Operativos Soportados

El cliente Smartnode de Rocket Pool actualmente soporta sistemas **Linux** y **macOS**.

En este momento, **Windows** puede ser usado para gestionar remotamente una máquina Linux o Mac remota, pero el Smartnode en sí no puede ejecutarse actualmente en un sistema Windows. Sin embargo, Rocket Pool _puede_ ejecutarse en una [máquina virtual](https://en.wikipedia.org/wiki/System_virtual_machine) de Linux alojada por una máquina Windows.
Esta configuración no es recomendada sobre simplemente instalar Linux como el sistema operativo host, pero funciona si es necesario.
Ten en cuenta que requerirá recursos adicionales y viene con su propio conjunto de riesgos de seguridad, por lo que no aconsejamos usar esta configuración cuando hagas staking con Ether real en la red principal.

Rocket Pool es nativamente compatible con las arquitecturas de CPU **AMD64 (x64)** y **arm64 (aarch64)**.
Para otras arquitecturas, necesitarás compilar los clientes smartnode desde el código fuente.

Ten en cuenta que el usuario debe tener acceso de **root / Administrador** (o privilegios **sudo**) para instalar el Smartnode.

#### Soporte para Linux

Hay muchas variantes del sistema operativo Linux (llamadas distribuciones, o **distros** para abreviar). Aunque puedes ejecutar Rocket Pool desde cualquier distro moderna, el instalador de Rocket Pool puede instalar automáticamente la pila completa en [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/), y [Fedora](https://docs.fedoraproject.org/en-US/project/).

::: warning NOTA
Si planeas usar Ubuntu, te recomendamos encarecidamente usar una versión **LTS** como 24.04.
Estas versiones reciben mantenimiento activo durante períodos más largos, lo que ayuda con la seguridad y estabilidad de tu nodo.
:::

Para instalación en otras distros, el instalador del Smartnode no podrá instalar automáticamente algunas dependencias del sistema (como `docker-compose`).
Se requerirán algunos pasos manuales durante la instalación.

Para sistemas `arm64`, el instalador del Smartnode solo soporta nativamente Debian y distros basadas en Debian como Ubuntu.
Para otras distros, se requerirán pasos manuales durante la instalación.

## Instalando el Sistema Operativo

Si estás usando macOS, es muy probable que ya tengas el Sistema Operativo instalado y puedas saltarte este paso.

Si estás instalando Linux desde cero, cada una de las distribuciones listadas arriba viene con tutoriales útiles y detallados para instalar el Sistema Operativo desde cero.
Como ejemplo, sin embargo, te guiaremos a través del proceso de instalar y preparar **Debian Server**.
Debian es una buena elección para la operación de nodos porque se enfoca en **máxima estabilidad y confiabilidad** - ambas son altamente deseables para máquinas de nodos que deben estar funcionando 24/7.

[Aquí hay una buena guía paso a paso](https://itslinuxfoss.com/debian-11-bullseye-guide/) con capturas de pantalla que te muestra cómo instalar Debian en tu máquina de nodo desde cero.

:::tip
Tenemos algunas enmiendas útiles a la guía enlazada arriba, que quizás quieras seguir:

- Cuando se te solicite configurar una **contraseña de root**, recomendamos dejarla **en blanco**. Esto deshabilitará la cuenta `root` y en su lugar instalará el paquete `sudo`, permitiendo a tu usuario realizar operaciones de root reingresando su contraseña para elevar sus permisos. Esto es análogo a la forma en que se configura Ubuntu Linux, que puede ser más familiar para los usuarios.
- En la pantalla de **Selección de software** hacia el final, es posible que no quieras tener una GUI de escritorio instalada.
  - Las GUI de escritorio son en gran medida innecesarias para un nodo; añaden sobrecarga extra y la mayor parte del tiempo no se usarán ya que estarás controlándolo remotamente a través de la terminal de todos modos, por lo que preferimos **desmarcar GNOME y el entorno de escritorio Debian** aquí.
  - Si _sí_ quieres una UI de escritorio en tu nodo, recomendamos que **desmarques GNOME y marques XFCE** en su lugar, ya que es más ligero en recursos del sistema. También recomendamos no ejecutar software adicional en el nodo, como navegadores o Discord, ya que disminuyen la seguridad y consumen recursos del sistema.
  - Desmarca **servidor web**, pero deja marcados **servidor SSH** y **utilidades estándar del sistema**.
- Si has creado una unidad flash desde un iso, es posible que necesites deshabilitar el repositorio de CD-ROM para poder ejecutar `apt`.
  Puedes encontrar una explicación de cómo hacer esto [aquí](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/).
- Tu sistema puede estar configurado para dormir/hibernar por defecto. Para deshabilitar estas configuraciones, puedes ejecutar el siguiente comando:
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### Instalando `sudo`

El instalador de Rocket Pool requiere el programa `sudo` para adquirir todas sus dependencias.
Si dejaste la **contraseña de usuario root en blanco** en el paso anterior, ya tendrás esto.
Si no, por favor instálalo ahora ejecutando los siguientes comandos:

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Luego reinicia la máquina.
Ahora deberías poder ejecutar comandos mediante `sudo` como `sudo apt update`.

### Usando SSH

Una vez que el servidor esté instalado y puedas iniciar sesión, necesitas obtener su dirección IP.
Una forma fácil de hacer esto es con `ifconfig` que está integrado en el paquete 'net-tools':

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Puedes ver varias entradas aquí, pero la que quieres buscar se verá algo así:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

Los flags deben decir `UP,BROADCAST,RUNNING,MULTICAST`.
El valor `inet` (aquí `192.168.1.8`) es la dirección IP local de tu máquina.

A continuación, instala SSH:

```shell
sudo apt install openssh-server
```

:::tip NOTA
Si tenías la casilla **servidor SSH** marcada durante la instalación de Debian, ya deberías tener esto instalado, así que este comando no hará nada.
:::

Una vez hecho esto, puedes iniciar sesión en la terminal de la máquina remotamente desde tu laptop o escritorio usando `ssh`.

Si no estás familiarizado con `ssh`, echa un vistazo a la guía [Introducción a Secure Shell](../ssh).

:::warning NOTA
En este punto, deberías _considerar seriamente_ configurar tu router para hacer que la dirección IP de tu nodo sea **estática**.
Esto significa que tu nodo tendrá la misma dirección IP para siempre, así que siempre podrás acceder por SSH usando esa dirección IP.
De lo contrario, es posible que la IP de tu nodo cambie en algún momento, y el comando SSH anterior ya no funcionará.
Tendrás que entrar en la configuración de tu router para averiguar cuál es la nueva dirección IP de tu nodo.

Cada router es diferente, por lo que necesitarás consultar la documentación de tu router para aprender cómo asignar una dirección IP estática.
:::

## Configurando Espacio de Swap

En la mayoría de los casos, si eliges tus clientes de Ejecución y Consenso y tu tipo de instancia cuidadosamente, no deberías quedarte sin RAM.
Por otro lado, nunca está de más agregar un poco más.
Lo que vamos a hacer ahora es agregar lo que se llama **espacio de swap**.
Esencialmente, significa que vamos a usar el SSD como "RAM de respaldo" en caso de que algo salga horriblemente mal y tu servidor se quede sin RAM regular.
El SSD no es ni cerca tan rápido como la RAM regular, así que si llega al espacio de swap ralentizará las cosas, pero no se bloqueará completamente ni romperá todo.
Piensa en esto como un seguro extra que (muy probablemente) nunca necesitarás.

### Creando un Archivo de Swap

El primer paso es hacer un nuevo archivo que actuará como tu espacio de swap.
Decide cuánto quieres usar - un inicio razonable sería 8 GB, así que tendrías 8 GB de RAM normal y 8 GB de "RAM de respaldo" para un total de 16 GB.
Para estar súper seguro, puedes hacerlo de 24 GB para que tu sistema tenga 8 GB de RAM normal y 24 GB de "RAM de respaldo" para un total de 32 GB, pero esto es probablemente excesivo.
Por suerte, como tu SSD tiene 1 o 2 TB de espacio, asignar 8 a 24 GB para un archivo de swap es insignificante.

Para el propósito de este tutorial, elijamos un punto medio agradable - digamos, 16 GB de espacio de swap para una RAM total de 24 GB.
Solo sustituye el número que quieras a medida que avanzamos.

Ingresa esto, lo cual creará un nuevo archivo llamado `/swapfile` y lo llenará con 16 GB de ceros.
Para cambiar la cantidad, solo cambia el número en `count=16` a lo que quieras. **Ten en cuenta que esto va a tomar mucho tiempo, pero está bien.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

A continuación, establece los permisos para que solo el usuario root pueda leer o escribir en él (por seguridad):

```shell
sudo chmod 600 /swapfile
```

Ahora, márcalo como un archivo de swap:

```shell
sudo mkswap /swapfile
```

Luego, habilítalo:

```shell
sudo swapon /swapfile
```

Finalmente, agrégalo a la tabla de montaje para que se cargue automáticamente cuando tu servidor se reinicie:

```shell
sudo nano /etc/fstab
```

Agrega una nueva línea al final que se vea así:

```
/swapfile                            none            swap    sw              0       0
```

Presiona `Ctrl+O` y `Enter` para guardar, luego `Ctrl+X` y `Enter` para salir.

Para verificar que está activo, ejecuta estos comandos:

```shell
sudo apt install htop
htop
```

Tu salida debería verse así en la parte superior:
![](../local/images/pi/Swap.png)

Si el segundo número en la última fila etiquetada `Swp` (el que está después de `/`) es distinto de cero, entonces estás listo.
Por ejemplo, si muestra `0K / 16.0G` entonces tu espacio de swap se activó exitosamente.
Si muestra `0K / 0K` entonces no funcionó y tendrás que confirmar que ingresaste los pasos anteriores correctamente.

Presiona `q` o `F10` para salir de `htop` y volver a la terminal.

### Configurando Swappiness y Presión de Caché

Por defecto, Linux usará ansiosamente mucho espacio de swap para quitar algo de presión de la RAM del sistema.
No queremos eso. Queremos que use toda la RAM hasta el último segundo antes de depender del SWAP.
El siguiente paso es cambiar lo que se llama el "swappiness" del sistema, que es básicamente qué tan ansioso está de usar el espacio de swap.
Hay mucho debate sobre qué valor establecer para esto, pero hemos encontrado que un valor de 6 funciona bastante bien.

También queremos reducir la "presión de caché", que dicta qué tan rápido el servidor eliminará el caché de su sistema de archivos.
Como vamos a tener mucha RAM de sobra con nuestra configuración, podemos hacer esto "10" lo que dejará el caché en memoria por un tiempo, reduciendo la E/S del disco.

Para establecer esto, ejecuta estos comandos:

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

### Comprobaciones del Sistema Pre-instalación

Antes de instalar Rocket Pool, por favor revisa la siguiente lista de verificación:

- Tu sistema está completamente construido, enciende, y puede arrancar en el sistema operativo.
- No realizarás ninguna otra actividad en el sistema, como navegar por Internet, revisar correo electrónico o jugar juegos.
- Tienes un sistema operativo Linux instalado.
- Tu cuenta de usuario tiene privilegios de root / administrador.
- Tienes un SSD que cumple con los requisitos de rendimiento.
- Tu SSD está montado en tu sistema de archivos.
- Tienes al menos 1.5 TB de espacio en disco libre para el proceso inicial de sincronización de Ejecución y Consenso.
- Si tu ISP limita tus datos, es más de 2 TB por mes.

Si has verificado y confirmado todos estos elementos, entonces estás listo para instalar Rocket Pool y comenzar a ejecutar un nodo.
Continúa a la sección [Eligiendo tus Clientes ETH](../eth-clients).
