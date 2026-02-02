# Cómo Escribir Add-ons para Rocket Pool Smart Node

## Introducción

Los add-ons de Rocket Pool Smart Node son extensiones que proporcionan características adicionales al stack de Smart Node. Pueden implementarse como contenedores Docker que se integran con los clientes de Ethereum o el servicio Smart Node. Los add-ons se pueden habilitar y configurar a través de la interfaz de usuario de terminal (TUI) del Smart Node mediante el comando `rocketpool service config`.

El desarrollo de add-ons puede basarse en dos ejemplos existentes:

- **Graffiti Wall Writer**: Permite a los operadores de nodos contribuir a dibujos comunitarios en el muro de graffiti de Beaconcha.in estableciendo dinámicamente el graffiti de las propuestas de bloques. Utiliza una herramienta de dibujo descentralizada para determinar qué píxeles "pintar" con cada propuesta.
- **Rescue Node**: Proporciona un servicio de nodo beacon de respaldo utilizando credenciales del proyecto Rocket Rescue Node. Esto ayuda a prevenir attestations perdidas durante el mantenimiento del nodo, la sincronización o interrupciones al enrutar solicitudes a un nodo beacon remoto compartido.

Los add-ons son parte del código fuente de Smart Node y deben contribuirse mediante pull request al repositorio. Implementan una interfaz estandarizada para configuración e integración.

## Requisitos Previos

- Familiaridad con la programación en Go, ya que los add-ons están escritos en Go.
- Comprensión de Docker, ya que los add-ons pueden ejecutarse como contenedores.
- Conocimiento de la arquitectura de Rocket Pool Smart Node, incluida su configuración de Docker compose y sistema de configuración.
- Acceso al repositorio de Smart Node para desarrollo y pruebas locales.

## Pasos para Crear un Add-on

Para crear un nuevo add-on, necesitarás agregar código en ubicaciones específicas dentro del repositorio de Smart Node. El proceso implica implementar la lógica del add-on, configurar su UI, registrarlo y manejar la integración con el stack de Docker.

### 1. Implementar la Lógica del Add-on

Crea un nuevo subdirectorio en `addons/` nombrado según tu add-on (usa snake_case, por ejemplo, `my_addon`).

En este directorio, crea un archivo Go (por ejemplo, `my_addon.go`) que defina la estructura del add-on e implemente la interfaz `SmartnodeAddon` de `github.com/rocket-pool/smartnode/shared/types/addons`.

```
type MyAddon struct {
    cfg *MyAddonConfig `yaml:"config,omitempty"`
}

func NewMyAddon() addons.SmartnodeAddon {
    return &MyAddon{
        cfg: NewConfig(),
    }
}
```

Métodos clave a implementar:

- `GetName()`: Devuelve el nombre para mostrar del add-on.
- `GetDescription()`: Devuelve una breve descripción.
- `GetConfig()`: Devuelve el objeto de configuración con parámetros (por ejemplo, bandera habilitada, claves API, URLs).
- `GetEnabledParameter()`: Devuelve el parámetro que controla si el add-on está habilitado.
- Métodos para iniciar/detener el add-on, generar secciones de Docker compose o interactuar con otros servicios.

Si el add-on ejecuta un contenedor Docker:

- Define la imagen de Docker (por ejemplo, una imagen personalizada o externa).
- Especifica volúmenes, puertos o variables de entorno necesarias.

Por ejemplo, el add-on Graffiti Wall Writer ejecuta un contenedor que actualiza periódicamente el archivo de graffiti del cliente validador según una configuración JSON para la imagen a dibujar.

El add-on Rescue Node configura el cliente validador para usar un nodo beacon remoto de respaldo a través de un proxy, requiriendo parámetros de nombre de usuario y contraseña.

### 2. Crear la UI de Configuración

Agrega un archivo en `rocketpool-cli/service/config/` nombrado `addon-myaddon.go`.

Este archivo define la página TUI para configurar el add-on usando la biblioteca `tview`.

Elementos clave:

- Define una estructura `AddonMyAddonPage` con campos para el diseño, configuración maestra y elementos de formulario.
- Constructor `NewAddonMyAddonPage` que inicializa la página y llama a `createContent()`.
- `createContent()`: Configura el formulario con casillas de verificación (por ejemplo, habilitado) y campos de entrada para otros parámetros.
- Manejadores de eventos como `handleEnableChanged()` para mostrar/ocultar parámetros según el estado habilitado.

Ejemplo de fragmento:

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
	// ... (código adicional para configuración de página)
}

func (configPage *AddonMyAddonPage) createContent() {
	// Configurar diseño y elementos de formulario
	// ...
}
```

### 3. Registrar el Add-on

Actualiza `addons/constructors.go` para incluir un constructor para tu add-on.

Este archivo contiene funciones para instanciar todos los add-ons.

Ejemplo:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Luego agrégalo a la lista de addons disponibles dentro de `NewRocketPoolConfig` en `shared/services/config/rocket-pool-config.go`.

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Integrar con Docker Compose

Los add-ons a menudo requieren modificaciones a los archivos de Docker compose.

- Agrega plantillas en el directorio `shared/services/rocketpool/assets/install/templates/addons` para la sección compose de tu add-on (por ejemplo, `my_addon.tmpl`).
- El código del add-on genera el YAML de compose cuando está habilitado, incluidos servicios, volúmenes y dependencias.

La función `composeAddons` dentro de la carpeta `services/rocketpool/client` es responsable de aprovisionar contenedores Docker Compose basados en la configuración de Rocket Pool, configurando activos de runtime, plantilla y override para el add-on.

Para instalación:

- Actualiza el script de instalación (`install.sh`) si el add-on necesita archivos copiados (por ejemplo, archivos de configuración predeterminados).

### 5. Integraciones Opcionales

- **Comando de Estado del Nodo**: Si el add-on tiene información de estado (por ejemplo, vencimiento de credenciales para Rescue Node), actualiza `rocketpool-cli/node/status.go` para mostrarlo.
- **Métricas o Logs**: Integra con Prometheus/Grafana si es aplicable.
- **Dependencias Externas**: Si usas un repositorio externo (por ejemplo, proxy de Rescue Node), asegúrate de que esté documentado.

### 6. Pruebas y Envío

- Construye y prueba localmente: Usa el Makefile para construir el Smart Node, instalar y habilitar tu add-on.
- Verifica en el TUI, revisa los contenedores Docker y prueba la funcionalidad.
- Envía un pull request a https://github.com/rocket-pool/smartnode con tus cambios.

## Ejemplo: Graffiti Wall Writer

- **Propósito**: Dibuja imágenes comunitarias en el muro de graffiti de Beaconcha.in usando propuestas de bloques.
- **Implementación**: Ejecuta un contenedor Docker que obtiene el estado del muro y actualiza el archivo de graffiti del validador.
- **Configuración**: Bandera habilitada y parámetro para URL JSON de imagen (predeterminado: logotipo de Rocket Pool).
- **Integración**: El contenedor monta el directorio de datos del validador para escribir el archivo de graffiti. Habilitado vía TUI; contribuye al dibujo descentralizado.

## Ejemplo: Rescue Node

- **Propósito**: Nodo beacon de respaldo para evitar penalizaciones durante el tiempo de inactividad.
- **Implementación**: Configura el cliente validador para usar un proxy remoto con autenticación.
- **Configuración**: Bandera habilitada, nombre de usuario y contraseña del sitio web de Rescue Node.
- **Integración**: Modifica la configuración del validador para apuntar al proxy de rescate. Muestra el estado de credenciales en `rocketpool node status`.

Para más detalles, revisa el código fuente en el repositorio o contribuye a mejorar la documentación de desarrollo de add-ons.
