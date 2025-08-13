# How to Write Add-ons for Rocket Pool Smart Node

## Introduction

Rocket Pool Smart Node add-ons are extensions that provide additional features to the Smart Node stack. They can be implemented as Docker containers that integrate with the Ethereum clients or the Smart Node service. Add-ons can be enabled and configured through the Smart Node's terminal user interface (TUI) via the `rocketpool service config` command.

Add-on development can be based on two existing examples:
- **Graffiti Wall Writer**: Enables node operators to contribute to community drawings on the Beaconcha.in graffiti wall by dynamically setting block proposal graffiti. It uses a decentralized drawing tool to determine which pixels to "paint" with each proposal.
- **Rescue Node**: Provides a fallback beacon node service using credentials from the Rocket Rescue Node project. This helps prevent missed attestations during node maintenance, syncing, or outages by routing requests to a shared remote beacon node.

Add-ons are part of the Smart Node source code and must be contributed via pull request to the repository. They implement a standardized interface for configuration and integration.

## Prerequisites

- Familiarity with Go programming, as add-ons are written in Go.
- Understanding of Docker, as add-ons can run as containers.
- Knowledge of the Rocket Pool Smart Node architecture, including its Docker compose setup and configuration system.
- Access to the Smart Node repository for local development and testing.

## Steps to Create an Add-on

To create a new add-on, you will need to add code in specific locations within the Smart Node repository. The process involves implementing the add-on logic, configuring its UI, registering it, and handling integration with the Docker stack.

### 1. Implement the Add-on Logic

Create a new subdirectory in `addons/` named after your add-on (use snake_case, e.g., `my_addon`).

In this directory, create a Go file (e.g., `my_addon.go`) that defines the add-on struct and implements the `SmartnodeAddon` interface from `github.com/rocket-pool/smartnode/shared/types/addons`.

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

Key methods to implement:
- `GetName()`: Returns the display name of the add-on.
- `GetDescription()`: Returns a brief description.
- `GetConfig()`: Returns the configuration object with parameters (e.g., enabled flag, API keys, URLs).
- `GetEnabledParameter()`: Returns the parameter controlling whether the add-on is enabled.
- Methods for starting/stopping the add-on, generating Docker compose sections, or interacting with other services.

If the add-on runs a Docker container:
- Define the Docker image (e.g., a custom image or external one).
- Specify volumes, ports, or environment variables needed.

For example, the Graffiti Wall Writer add-on runs a container that periodically updates the validator client's graffiti file based on a JSON configuration for the image to draw.

The Rescue Node add-on configures the validator client to use a remote fallback beacon node via a proxy, requiring username and password parameters.

### 2. Create the Configuration UI

Add a file in `rocketpool-cli/service/config/` named `addon-myaddon.go`.

This file defines the TUI page for configuring the add-on using the `tview` library.

Key elements:
- Define a struct `AddonMyAddonPage` with fields for the layout, master config, and form items.
- Constructor `NewAddonMyAddonPage` that initializes the page and calls `createContent()`.
- `createContent()`: Sets up the form with checkboxes (e.g., enabled) and input fields for other parameters.
- Event handlers like `handleEnableChanged()` to show/hide parameters based on the enabled state.

Example snippet:

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

// The page wrapper for the add-on config
type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

// Creates a new page for the add-on settings
func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
	// ... (additional code for page setup)
}

// Creates the content for the settings page
func (configPage *AddonMyAddonPage) createContent() {
	// Setup layout and form items
	// ...
}
```

### 3. Register the Add-on

Update `addons/constructors.go` to include a constructor for your add-on.

This file contains functions to instantiate all add-ons.

Example: 
```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
``` 

Then add it to the list of available addons within the`NewRocketPoolConfig` in `shared/services/config/rocket-pool-config.go`.

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Integrate with Docker Compose

Add-ons often require modifications to the Docker compose files.

- Add templates in the `shared/services/rocketpool/assets/install/templates/addons` directory for your add-on's compose section (e.g., `my_addon.tmpl`).
- The add-on code generates the compose YAML when enabled, including services, volumes, and dependencies.

The `composeAddons` function inside the `services/rocketpool/client` folder is responsible for provisioning Docker Compose containers based on the Rocket Pool configuration, setting up runtime, template and override assets for the add-on. 

For installation:
- Update the installer script (`install.sh`) if the add-on needs files copied (e.g., default config files).

### 5. Optional Integrations

- **Node Status Command**: If the add-on has status info (e.g., credential expiration for Rescue Node), update `rocketpool-cli/node/status.go` to display it.
- **Metrics or Logs**: Integrate with Prometheus/Grafana if applicable.
- **External Dependencies**: If using an external repo (e.g., Rescue Node proxy), ensure it's documented.

### 6. Testing and Submission

- Build and test locally: Use the Makefile to build the Smart Node, install, and enable your add-on.
- Verify in the TUI, check Docker containers, and test functionality.
- Submit a pull request to https://github.com/rocket-pool/smartnode with your changes.

## Example: Graffiti Wall Writer

- **Purpose**: Draws community images on the Beaconcha.in graffiti wall using block proposals.
- **Implementation**: Runs a Docker container that fetches wall state and updates the validator's graffiti file.
- **Config**: Enabled flag and parameter for image JSON URL (default: Rocket Pool logo).
- **Integration**: The container mounts the validator's data directory to write the graffiti file. Enabled via TUI; contributes to decentralized drawing.

## Example: Rescue Node

- **Purpose**: Fallback beacon node to avoid penalties during downtime.
- **Implementation**: Configures the validator client to use a remote proxy with authentication.
- **Config**: Enabled flag, username, and password from Rescue Node website.
- **Integration**: Modifies validator config to point to the rescue proxy. Shows credential status in `rocketpool node status`.

For more details, review the source code in the repository or contribute to improve add-on development docs.