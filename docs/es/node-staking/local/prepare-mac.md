# Preparando una Mac

Antes de instalar Rocket Pool, hay algunas comprobaciones que debes hacer para asegurarte de que tu sistema es compatible y funcionará correctamente.

::: danger
Te recomendamos encarecidamente que crees una máquina dedicada para ejecutar un nodo de Rocket Pool.
Ejecutar un nodo en una máquina de uso general, como tu escritorio de trabajo diario, presenta riesgos de seguridad adicionales que pueden comprometer tu billetera y resultar en el robo de tus monedas.

**Para máxima seguridad, por favor construye una nueva máquina que esté dedicada exclusivamente a ejecutar un nodo.**
:::

## Requisitos del Sistema

A continuación se presenta una breve descripción de los requisitos de software y hardware que requiere un nodo de Rocket Pool.
Esta guía asume que ya tienes tu máquina físicamente construida y el sistema operativo instalado.

### Sistemas Operativos Soportados

Rocket Pool recomienda que uses la última versión de macOS para tu hardware.

### Soporte para macOS

Necesitarás instalar los siguientes prerequisitos:

Recomendamos encarecidamente usar [Homebrew](https://brew.sh) como tu gestor de paquetes para Mac. Te permite instalar paquetes fácilmente usando el comando `brew`.

Puedes instalarlo mediante

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Debería instalar algunos prerequisitos por ti, como XCode Command Line Tools. Si no lo hace, puedes instalarlos manualmente usando

```shell
xcode-select --install
```

Una vez instalado, asegúrate de que todo funcione correctamente usando

```shell
brew doctor
```

Una vez que todo esté instalado y funcionando, Homebrew te permitirá instalar paquetes usando el comando `brew`.

Por ejemplo, para instalar `wget` usando Homebrew ejecuta el siguiente comando en la Terminal:

```shell
brew install wget
```

Ahora que tenemos Homebrew instalado, podemos instalar nuestro cliente Docker, [Orbstack](https://orbstack.dev).

```shell
brew install --cask orbstack
```

Orbstack se instalará en tu carpeta de Aplicaciones. Ejecútalo desde ahí y se inicializará. Si estás migrando desde Docker Desktop, debería detectar tu instalación existente de Docker y migrar tus imágenes y contenedores.

Es posible que necesites ajustar tu configuración de Orbstack dependiendo de tu hardware.

Si previamente has instalado Docker Desktop, necesitarás desinstalarlo primero. Docker Desktop solía ser el Cliente Docker recomendado, sin embargo en el último año se han lanzado algunos nuevos clientes que proporcionan mucha mejor estabilidad.

Por favor asegúrate de que tu Firewall (Configuración del Sistema -> Red -> Firewall) esté activado y que Orbstack esté agregado a la lista de aplicaciones que permiten conexiones entrantes. (Orbstack debería hacer esto por ti)

![](../local/images/mac/firewall.png)

### Instalando y Usando SSH

SSH ya debería estar instalado con macOS.

### Comprobaciones del Sistema Pre-instalación

Antes de instalar Rocket Pool, por favor revisa la siguiente lista de verificación:

- Tu sistema está completamente construido, enciende, y puede arrancar en el sistema operativo.
- No realizarás ninguna otra actividad en el sistema, como navegar por Internet, revisar correo electrónico o jugar juegos.
- Tienes un sistema operativo macOS instalado.
- Tu cuenta de usuario tiene privilegios de root / administrador.
- Tienes un SSD que cumple con los requisitos de rendimiento.
- Tu SSD está montado en tu sistema de archivos.
- Tienes al menos 1.5TB de espacio libre para el proceso inicial de sincronización de Ejecución y Consenso.
- Si tu ISP limita tus datos, es más de 2 TB por mes.

Si has verificado y confirmado todos estos elementos, entonces estás listo para instalar Rocket Pool y comenzar a ejecutar un nodo.
Continúa a la sección [Eligiendo tus Clientes ETH](../eth-clients).
