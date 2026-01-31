# Wie man Add-ons für Rocket Pool Smart Node schreibt

## Einführung

Rocket Pool Smart Node Add-ons sind Erweiterungen, die zusätzliche Funktionen für den Smart Node Stack bereitstellen. Sie können als Docker-Container implementiert werden, die mit den Ethereum-Clients oder dem Smart Node Service integriert werden. Add-ons können über die Terminal-Benutzeroberfläche (TUI) des Smart Node durch den Befehl `rocketpool service config` aktiviert und konfiguriert werden.

Die Add-on-Entwicklung kann auf zwei vorhandenen Beispielen basieren:

- **Graffiti Wall Writer**: Ermöglicht Node Operators, zu Community-Zeichnungen auf der Beaconcha.in Graffiti Wall beizutragen, indem das Block-Proposal-Graffiti dynamisch gesetzt wird. Es verwendet ein dezentrales Zeichenwerkzeug, um zu bestimmen, welche Pixel mit jedem Proposal "gemalt" werden sollen.
- **Rescue Node**: Bietet einen Fallback Beacon Node Service unter Verwendung von Anmeldedaten aus dem Rocket Rescue Node Projekt. Dies hilft, verpasste Attestierungen während Node-Wartung, Synchronisierung oder Ausfällen zu verhindern, indem Anfragen an einen gemeinsam genutzten Remote Beacon Node weitergeleitet werden.

Add-ons sind Teil des Smart Node Quellcodes und müssen über einen Pull Request zum Repository beigetragen werden. Sie implementieren eine standardisierte Schnittstelle für Konfiguration und Integration.

## Voraussetzungen

- Vertrautheit mit Go-Programmierung, da Add-ons in Go geschrieben werden.
- Verständnis von Docker, da Add-ons als Container laufen können.
- Kenntnisse der Rocket Pool Smart Node Architektur, einschließlich seines Docker Compose-Setups und Konfigurationssystems.
- Zugang zum Smart Node Repository für lokale Entwicklung und Tests.

## Schritte zum Erstellen eines Add-ons

Um ein neues Add-on zu erstellen, müssen Sie Code an bestimmten Stellen im Smart Node Repository hinzufügen. Der Prozess umfasst die Implementierung der Add-on-Logik, die Konfiguration seiner Benutzeroberfläche, die Registrierung und die Handhabung der Integration mit dem Docker Stack.

### 1. Implementierung der Add-on-Logik

Erstellen Sie ein neues Unterverzeichnis in `addons/`, benannt nach Ihrem Add-on (verwenden Sie snake_case, z.B. `my_addon`).

Erstellen Sie in diesem Verzeichnis eine Go-Datei (z.B. `my_addon.go`), die die Add-on-Struktur definiert und die `SmartnodeAddon`-Schnittstelle aus `github.com/rocket-pool/smartnode/shared/types/addons` implementiert.

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

Wichtige zu implementierende Methoden:

- `GetName()`: Gibt den Anzeigenamen des Add-ons zurück.
- `GetDescription()`: Gibt eine kurze Beschreibung zurück.
- `GetConfig()`: Gibt das Konfigurationsobjekt mit Parametern zurück (z.B. aktiviertes Flag, API-Schlüssel, URLs).
- `GetEnabledParameter()`: Gibt den Parameter zurück, der steuert, ob das Add-on aktiviert ist.
- Methoden zum Starten/Stoppen des Add-ons, Generieren von Docker Compose-Abschnitten oder Interaktion mit anderen Diensten.

Wenn das Add-on einen Docker-Container ausführt:

- Definieren Sie das Docker-Image (z.B. ein benutzerdefiniertes Image oder ein externes).
- Geben Sie Volumes, Ports oder Umgebungsvariablen an, die benötigt werden.

Zum Beispiel führt das Graffiti Wall Writer Add-on einen Container aus, der regelmäßig die Graffiti-Datei des Validator Clients basierend auf einer JSON-Konfiguration für das zu zeichnende Bild aktualisiert.

Das Rescue Node Add-on konfiguriert den Validator Client so, dass er über einen Proxy einen Remote-Fallback Beacon Node verwendet, wobei Benutzername- und Passwort-Parameter erforderlich sind.

### 2. Erstellen der Konfigurations-UI

Fügen Sie eine Datei in `rocketpool-cli/service/config/` mit dem Namen `addon-myaddon.go` hinzu.

Diese Datei definiert die TUI-Seite zum Konfigurieren des Add-ons mithilfe der `tview`-Bibliothek.

Wichtige Elemente:

- Definieren Sie eine Struktur `AddonMyAddonPage` mit Feldern für das Layout, die Master-Konfiguration und Formularelemente.
- Konstruktor `NewAddonMyAddonPage`, der die Seite initialisiert und `createContent()` aufruft.
- `createContent()`: Richtet das Formular mit Checkboxen (z.B. aktiviert) und Eingabefeldern für andere Parameter ein.
- Event-Handler wie `handleEnableChanged()`, um Parameter basierend auf dem aktivierten Status anzuzeigen/auszublenden.

Beispiel-Snippet:

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

### 3. Registrierung des Add-ons

Aktualisieren Sie `addons/constructors.go`, um einen Konstruktor für Ihr Add-on einzuschließen.

Diese Datei enthält Funktionen zum Instanziieren aller Add-ons.

Beispiel:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Fügen Sie es dann zur Liste der verfügbaren Add-ons innerhalb von `NewRocketPoolConfig` in `shared/services/config/rocket-pool-config.go` hinzu.

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Integration mit Docker Compose

Add-ons erfordern oft Änderungen an den Docker Compose-Dateien.

- Fügen Sie Templates im Verzeichnis `shared/services/rocketpool/assets/install/templates/addons` für den Compose-Abschnitt Ihres Add-ons hinzu (z.B. `my_addon.tmpl`).
- Der Add-on-Code generiert das Compose YAML, wenn es aktiviert ist, einschließlich Diensten, Volumes und Abhängigkeiten.

Die Funktion `composeAddons` im Ordner `services/rocketpool/client` ist für die Bereitstellung von Docker Compose-Containern basierend auf der Rocket Pool Konfiguration verantwortlich und richtet Laufzeit-, Template- und Override-Assets für das Add-on ein.

Für die Installation:

- Aktualisieren Sie das Installer-Skript (`install.sh`), wenn das Add-on das Kopieren von Dateien benötigt (z.B. Standard-Konfigurationsdateien).

### 5. Optionale Integrationen

- **Node Status Command**: Wenn das Add-on Statusinformationen hat (z.B. Ablauf von Anmeldedaten für Rescue Node), aktualisieren Sie `rocketpool-cli/node/status.go`, um diese anzuzeigen.
- **Metriken oder Logs**: Integrieren Sie mit Prometheus/Grafana, falls zutreffend.
- **Externe Abhängigkeiten**: Wenn ein externes Repo verwendet wird (z.B. Rescue Node Proxy), stellen Sie sicher, dass es dokumentiert ist.

### 6. Testen und Einreichung

- Lokal bauen und testen: Verwenden Sie das Makefile, um den Smart Node zu bauen, zu installieren und Ihr Add-on zu aktivieren.
- Überprüfen Sie in der TUI, prüfen Sie Docker-Container und testen Sie die Funktionalität.
- Reichen Sie einen Pull Request an https://github.com/rocket-pool/smartnode mit Ihren Änderungen ein.

## Beispiel: Graffiti Wall Writer

- **Zweck**: Zeichnet Community-Bilder auf der Beaconcha.in Graffiti Wall unter Verwendung von Block-Proposals.
- **Implementierung**: Führt einen Docker-Container aus, der den Wall-Status abruft und die Graffiti-Datei des Validators aktualisiert.
- **Konfiguration**: Aktiviertes Flag und Parameter für Bild-JSON-URL (Standard: Rocket Pool Logo).
- **Integration**: Der Container mountet das Datenverzeichnis des Validators, um die Graffiti-Datei zu schreiben. Wird über TUI aktiviert; trägt zur dezentralen Zeichnung bei.

## Beispiel: Rescue Node

- **Zweck**: Fallback Beacon Node, um Strafen während Ausfallzeiten zu vermeiden.
- **Implementierung**: Konfiguriert den Validator Client so, dass er einen Remote-Proxy mit Authentifizierung verwendet.
- **Konfiguration**: Aktiviertes Flag, Benutzername und Passwort von der Rescue Node Website.
- **Integration**: Ändert die Validator-Konfiguration, um auf den Rescue-Proxy zu verweisen. Zeigt Anmeldedatenstatus in `rocketpool node status` an.

Für weitere Details überprüfen Sie den Quellcode im Repository oder tragen Sie zur Verbesserung der Add-on-Entwicklungsdokumentation bei.
