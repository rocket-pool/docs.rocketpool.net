# Comment écrire des extensions pour Rocket Pool Smart Node

## Introduction

Les extensions Rocket Pool Smart Node sont des modules qui fournissent des fonctionnalités supplémentaires à la pile Smart Node. Elles peuvent être implémentées sous forme de conteneurs Docker qui s'intègrent aux clients Ethereum ou au service Smart Node. Les extensions peuvent être activées et configurées via l'interface utilisateur en terminal (TUI) du Smart Node via la commande `rocketpool service config`.

Le développement d'extensions peut se baser sur deux exemples existants :

- **Graffiti Wall Writer** : Permet aux opérateurs de nœud de contribuer aux dessins communautaires sur le mur de graffiti de Beaconcha.in en définissant dynamiquement le graffiti de proposition de bloc. Il utilise un outil de dessin décentralisé pour déterminer quels pixels "peindre" avec chaque proposition.
- **Rescue Node** : Fournit un service de nœud beacon de secours utilisant les identifiants du projet Rocket Rescue Node. Cela aide à prévenir les attestations manquées pendant la maintenance du nœud, la synchronisation ou les pannes en redirigeant les requêtes vers un nœud beacon distant partagé.

Les extensions font partie du code source du Smart Node et doivent être contribuées via une pull request au dépôt. Elles implémentent une interface standardisée pour la configuration et l'intégration.

## Prérequis

- Familiarité avec la programmation Go, car les extensions sont écrites en Go.
- Compréhension de Docker, car les extensions peuvent s'exécuter en tant que conteneurs.
- Connaissance de l'architecture Rocket Pool Smart Node, y compris sa configuration Docker compose et son système de configuration.
- Accès au dépôt Smart Node pour le développement et les tests locaux.

## Étapes pour créer une extension

Pour créer une nouvelle extension, vous devrez ajouter du code dans des emplacements spécifiques du dépôt Smart Node. Le processus implique l'implémentation de la logique de l'extension, la configuration de son interface utilisateur, son enregistrement et la gestion de l'intégration avec la pile Docker.

### 1. Implémenter la logique de l'extension

Créez un nouveau sous-répertoire dans `addons/` nommé d'après votre extension (utilisez snake_case, par ex. `my_addon`).

Dans ce répertoire, créez un fichier Go (par ex. `my_addon.go`) qui définit la structure de l'extension et implémente l'interface `SmartnodeAddon` de `github.com/rocket-pool/smartnode/shared/types/addons`.

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

Méthodes clés à implémenter :

- `GetName()` : Renvoie le nom d'affichage de l'extension.
- `GetDescription()` : Renvoie une brève description.
- `GetConfig()` : Renvoie l'objet de configuration avec les paramètres (par ex. flag activé, clés API, URLs).
- `GetEnabledParameter()` : Renvoie le paramètre contrôlant si l'extension est activée.
- Méthodes pour démarrer/arrêter l'extension, générer des sections Docker compose ou interagir avec d'autres services.

Si l'extension exécute un conteneur Docker :

- Définissez l'image Docker (par ex. une image personnalisée ou externe).
- Spécifiez les volumes, ports ou variables d'environnement nécessaires.

Par exemple, l'extension Graffiti Wall Writer exécute un conteneur qui met à jour périodiquement le fichier graffiti du client validateur en fonction d'une configuration JSON pour l'image à dessiner.

L'extension Rescue Node configure le client validateur pour utiliser un nœud beacon distant de secours via un proxy, nécessitant des paramètres de nom d'utilisateur et de mot de passe.

### 2. Créer l'interface utilisateur de configuration

Ajoutez un fichier dans `rocketpool-cli/service/config/` nommé `addon-myaddon.go`.

Ce fichier définit la page TUI pour configurer l'extension en utilisant la bibliothèque `tview`.

Éléments clés :

- Définissez une structure `AddonMyAddonPage` avec des champs pour la mise en page, la configuration maître et les éléments de formulaire.
- Constructeur `NewAddonMyAddonPage` qui initialise la page et appelle `createContent()`.
- `createContent()` : Configure le formulaire avec des cases à cocher (par ex. activé) et des champs de saisie pour d'autres paramètres.
- Gestionnaires d'événements comme `handleEnableChanged()` pour afficher/masquer les paramètres en fonction de l'état activé.

Exemple de snippet :

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

### 3. Enregistrer l'extension

Mettez à jour `addons/constructors.go` pour inclure un constructeur pour votre extension.

Ce fichier contient des fonctions pour instancier toutes les extensions.

Exemple :

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Ensuite, ajoutez-la à la liste des extensions disponibles dans `NewRocketPoolConfig` dans `shared/services/config/rocket-pool-config.go`.

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Intégrer avec Docker Compose

Les extensions nécessitent souvent des modifications aux fichiers Docker compose.

- Ajoutez des templates dans le répertoire `shared/services/rocketpool/assets/install/templates/addons` pour la section compose de votre extension (par ex. `my_addon.tmpl`).
- Le code de l'extension génère le YAML compose lorsqu'elle est activée, incluant les services, volumes et dépendances.

La fonction `composeAddons` dans le dossier `services/rocketpool/client` est responsable du provisionnement des conteneurs Docker Compose basés sur la configuration Rocket Pool, configurant le runtime, les templates et les actifs de remplacement pour l'extension.

Pour l'installation :

- Mettez à jour le script d'installation (`install.sh`) si l'extension nécessite la copie de fichiers (par ex. fichiers de configuration par défaut).

### 5. Intégrations optionnelles

- **Commande de statut du nœud** : Si l'extension a des informations de statut (par ex. expiration des identifiants pour Rescue Node), mettez à jour `rocketpool-cli/node/status.go` pour l'afficher.
- **Métriques ou logs** : Intégrez avec Prometheus/Grafana si applicable.
- **Dépendances externes** : Si vous utilisez un dépôt externe (par ex. proxy Rescue Node), assurez-vous qu'il est documenté.

### 6. Tests et soumission

- Construisez et testez localement : Utilisez le Makefile pour construire le Smart Node, installer et activer votre extension.
- Vérifiez dans la TUI, vérifiez les conteneurs Docker et testez la fonctionnalité.
- Soumettez une pull request à https://github.com/rocket-pool/smartnode avec vos modifications.

## Exemple : Graffiti Wall Writer

- **Objectif** : Dessine des images communautaires sur le mur de graffiti de Beaconcha.in en utilisant les propositions de blocs.
- **Implémentation** : Exécute un conteneur Docker qui récupère l'état du mur et met à jour le fichier graffiti du validateur.
- **Configuration** : Flag activé et paramètre pour l'URL JSON de l'image (par défaut : logo Rocket Pool).
- **Intégration** : Le conteneur monte le répertoire de données du validateur pour écrire le fichier graffiti. Activé via TUI ; contribue au dessin décentralisé.

## Exemple : Rescue Node

- **Objectif** : Nœud beacon de secours pour éviter les pénalités pendant les temps d'arrêt.
- **Implémentation** : Configure le client validateur pour utiliser un proxy distant avec authentification.
- **Configuration** : Flag activé, nom d'utilisateur et mot de passe depuis le site web Rescue Node.
- **Intégration** : Modifie la configuration du validateur pour pointer vers le proxy de secours. Affiche le statut des identifiants dans `rocketpool node status`.

Pour plus de détails, consultez le code source dans le dépôt ou contribuez à améliorer la documentation de développement des extensions.
