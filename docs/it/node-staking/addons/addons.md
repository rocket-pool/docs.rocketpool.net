# Come Scrivere Add-on per Rocket Pool Smart Node

## Introduzione

Gli add-on di Rocket Pool Smart Node sono estensioni che forniscono funzionalità aggiuntive allo stack Smart Node. Possono essere implementati come container Docker che si integrano con i client Ethereum o il servizio Smart Node. Gli add-on possono essere abilitati e configurati tramite l'interfaccia utente terminale (TUI) dello Smart Node tramite il comando `rocketpool service config`.

Lo sviluppo di add-on può essere basato su due esempi esistenti:

- **Graffiti Wall Writer**: Consente ai node operator di contribuire ai disegni della community sul graffiti wall di Beaconcha.in impostando dinamicamente il graffiti delle proposte di blocco. Utilizza uno strumento di disegno decentralizzato per determinare quali pixel "dipingere" con ogni proposta.
- **Rescue Node**: Fornisce un servizio di fallback beacon node utilizzando credenziali del progetto Rocket Rescue Node. Questo aiuta a prevenire attestazioni mancate durante la manutenzione del nodo, la sincronizzazione o interruzioni instradando le richieste a un beacon node remoto condiviso.

Gli add-on fanno parte del codice sorgente dello Smart Node e devono essere contribuiti tramite pull request al repository. Implementano un'interfaccia standardizzata per la configurazione e l'integrazione.

## Prerequisiti

- Familiarità con la programmazione Go, poiché gli add-on sono scritti in Go.
- Comprensione di Docker, poiché gli add-on possono essere eseguiti come container.
- Conoscenza dell'architettura di Rocket Pool Smart Node, inclusa la configurazione Docker compose e il sistema di configurazione.
- Accesso al repository Smart Node per lo sviluppo e il testing locali.

## Passaggi per Creare un Add-on

Per creare un nuovo add-on, sarà necessario aggiungere codice in posizioni specifiche all'interno del repository Smart Node. Il processo prevede l'implementazione della logica dell'add-on, la configurazione della sua UI, la registrazione e la gestione dell'integrazione con lo stack Docker.

### 1. Implementare la Logica dell'Add-on

Creare una nuova sottodirectory in `addons/` denominata in base al proprio add-on (utilizzare snake_case, ad esempio `my_addon`).

In questa directory, creare un file Go (ad esempio, `my_addon.go`) che definisce la struct dell'add-on e implementa l'interfaccia `SmartnodeAddon` da `github.com/rocket-pool/smartnode/shared/types/addons`.

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

Metodi chiave da implementare:

- `GetName()`: Restituisce il nome visualizzato dell'add-on.
- `GetDescription()`: Restituisce una breve descrizione.
- `GetConfig()`: Restituisce l'oggetto di configurazione con parametri (ad esempio, flag enabled, chiavi API, URL).
- `GetEnabledParameter()`: Restituisce il parametro che controlla se l'add-on è abilitato.
- Metodi per avviare/arrestare l'add-on, generare sezioni Docker compose o interagire con altri servizi.

Se l'add-on esegue un container Docker:

- Definire l'immagine Docker (ad esempio, un'immagine personalizzata o esterna).
- Specificare volumi, porte o variabili d'ambiente necessari.

Ad esempio, l'add-on Graffiti Wall Writer esegue un container che aggiorna periodicamente il file graffiti del validator client in base a una configurazione JSON per l'immagine da disegnare.

L'add-on Rescue Node configura il validator client per utilizzare un beacon node di fallback remoto tramite un proxy, richiedendo parametri di username e password.

### 2. Creare l'UI di Configurazione

Aggiungere un file in `rocketpool-cli/service/config/` denominato `addon-myaddon.go`.

Questo file definisce la pagina TUI per configurare l'add-on utilizzando la libreria `tview`.

Elementi chiave:

- Definire una struct `AddonMyAddonPage` con campi per il layout, la configurazione master e gli elementi del form.
- Constructor `NewAddonMyAddonPage` che inizializza la pagina e chiama `createContent()`.
- `createContent()`: Configura il form con checkbox (ad esempio, enabled) e campi di input per altri parametri.
- Event handler come `handleEnableChanged()` per mostrare/nascondere parametri in base allo stato enabled.

Esempio di snippet:

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

### 3. Registrare l'Add-on

Aggiornare `addons/constructors.go` per includere un constructor per il proprio add-on.

Questo file contiene funzioni per istanziare tutti gli add-on.

Esempio:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Quindi aggiungerlo all'elenco degli addon disponibili all'interno di `NewRocketPoolConfig` in `shared/services/config/rocket-pool-config.go`.

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Integrare con Docker Compose

Gli add-on spesso richiedono modifiche ai file Docker compose.

- Aggiungere template nella directory `shared/services/rocketpool/assets/install/templates/addons` per la sezione compose del proprio add-on (ad esempio, `my_addon.tmpl`).
- Il codice dell'add-on genera il YAML compose quando abilitato, includendo servizi, volumi e dipendenze.

La funzione `composeAddons` all'interno della cartella `services/rocketpool/client` è responsabile del provisioning dei container Docker Compose in base alla configurazione di Rocket Pool, configurando runtime, template e asset di override per l'add-on.

Per l'installazione:

- Aggiornare lo script di installazione (`install.sh`) se l'add-on necessita di file copiati (ad esempio, file di configurazione predefiniti).

### 5. Integrazioni Opzionali

- **Comando Node Status**: Se l'add-on ha informazioni sullo stato (ad esempio, scadenza credenziali per Rescue Node), aggiornare `rocketpool-cli/node/status.go` per visualizzarle.
- **Metriche o Log**: Integrare con Prometheus/Grafana se applicabile.
- **Dipendenze Esterne**: Se si utilizza un repository esterno (ad esempio, proxy Rescue Node), assicurarsi che sia documentato.

### 6. Testing e Invio

- Build e test locali: Utilizzare il Makefile per compilare lo Smart Node, installare e abilitare il proprio add-on.
- Verificare nella TUI, controllare i container Docker e testare la funzionalità.
- Inviare una pull request a https://github.com/rocket-pool/smartnode con le proprie modifiche.

## Esempio: Graffiti Wall Writer

- **Scopo**: Disegna immagini della community sul graffiti wall di Beaconcha.in utilizzando le proposte di blocco.
- **Implementazione**: Esegue un container Docker che recupera lo stato del wall e aggiorna il file graffiti del validator.
- **Configurazione**: Flag enabled e parametro per l'URL JSON dell'immagine (predefinito: logo Rocket Pool).
- **Integrazione**: Il container monta la directory dati del validator per scrivere il file graffiti. Abilitato tramite TUI; contribuisce al disegno decentralizzato.

## Esempio: Rescue Node

- **Scopo**: Beacon node di fallback per evitare penalità durante i downtime.
- **Implementazione**: Configura il validator client per utilizzare un proxy remoto con autenticazione.
- **Configurazione**: Flag enabled, username e password dal sito web Rescue Node.
- **Integrazione**: Modifica la configurazione del validator per puntare al proxy di rescue. Mostra lo stato delle credenziali in `rocketpool node status`.

Per ulteriori dettagli, consultare il codice sorgente nel repository o contribuire a migliorare la documentazione per lo sviluppo di add-on.
