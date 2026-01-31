# Auswahl eines Rocket Pool Modus

Der Smartnode-Stack von Rocket Pool ist sehr flexibel; es gibt mehrere verschiedene Möglichkeiten, ihn zu betreiben.
Er kann einen vollständigen Full Node von Grund auf aufbauen, er kann sich in bestehende Execution- oder Consensus-Client-Deployments integrieren, und er kann sogar nativ als eine Reihe von Systemdiensten laufen.
In diesem Abschnitt werden wir die typischen Möglichkeiten der Konfiguration und Verwendung des Smartnode-Stacks behandeln.

## Die Standard-Docker-basierte Konfiguration

Der Standardmodus, und die gebräuchlichste Art, einen Smartnode zu betreiben, besteht darin, dass er eine vollständige Full-Node-Instanz auf Ihrer lokalen Maschine erstellt, die Rocket Pool verwaltet.

Um dies zu erreichen, verwendet der Smartnode [Docker-Container](https://www.docker.com/resources/what-container).
Im Wesentlichen ist ein Docker-Container eine kleine Sandbox, die mit einem Programm, all seinen Abhängigkeiten und der gesamten Konfiguration vorkonfiguriert ist, die für die korrekte Ausführung erforderlich ist.
Wenn er nicht mehr benötigt wird, kann er einfach weggeworfen werden.
Es ist ein schönes kleines eigenständiges Paket, das Dinge funktionieren lässt, ohne ein Durcheinander in Ihrem tatsächlichen Dateisystem oder anderen Programmen zu verursachen.

Dieser Modus ist das, was der Smartnode-Installer für Sie bereitstellen wird.
Er verwendet die folgenden Docker-Container:

- `rocketpool_api` - Dies enthält die tatsächliche Funktionalität, die der Smartnode bereitstellt, wenn Sie über die Befehlszeilenschnittstelle (CLI) von Rocket Pool mit ihm interagieren.
- `rocketpool_node` - Dies ist ein Hintergrundprozess, der regelmäßig nach RPL-Belohnungen nach einem Belohnungs-Checkpoint sucht und diese beansprucht (wenn Sie Auto-Claim aktiviert haben, mehr dazu später), und ist dafür verantwortlich, tatsächlich neue Validatoren zu staken, wenn Sie einen Minipool erstellen.
- `rocketpool_watchtower` - Dies wird von Oracle Nodes verwendet, um orakelbezogene Aufgaben auszuführen. Für reguläre Node-Betreiber bleibt dies einfach inaktiv.
- `rocketpool_eth1` - Dies wird Ihr Execution-Client sein.
- `rocketpool_eth2` - Dies wird Ihr Consensus-Beacon-Node-Client sein.
- `rocketpool_validator` - Dies wird Ihr Validator-Client sein, der für Ihre Validator-Aufgaben verantwortlich ist (wie das Bestätigen von Blöcken oder das Vorschlagen neuer Blöcke).

In den meisten Situationen ist dies eine gute Option, wenn Sie einen neuen Node von Grund auf erstellen.
Es ist das schnellste, praktischste Verfahren.
Es wird auch Updates für die Execution- und Consensus-Clients mit jedem neuen Smartnode-Release handhaben, sodass Sie sich keine Sorgen um sie machen müssen (obwohl Sie sie jederzeit manuell aktualisieren können, wenn Sie möchten).

::: warning HINWEIS
Derzeit müssen einige der Docker-Container als `root`-Benutzer ausgeführt werden, um korrekt zu funktionieren.
Obwohl Docker-Container im Allgemeinen sehr gut darin sind, zu verhindern, dass ein Benutzer in Ihr Haupt-Betriebssystem entkommt, sind Sie möglicherweise aus Sicherheitsgründen mit dieser Anforderung nicht zufrieden.
In diesem Fall empfehlen wir Ihnen, den unten aufgeführten Native-Konfigurationsmodus zu verwenden.
:::

Wenn Sie diesen Modus verwenden möchten, fahren Sie mit dem Abschnitt [Konfiguration eines Standard-Rocket Pool Nodes mit Docker](./docker) fort.

## Die Hybrid-Konfiguration mit externen Clients

Die Hybrid-Konfiguration ist gut geeignet für Benutzer, die daran interessiert sind, einen Rocket Pool Node zu betreiben, aber bereits ihre eigenen Execution- und/oder Consensus-Clients für andere Zwecke betreiben (zum Beispiel, weil sie bereits Solo-Staking betreiben).

In diesem Modus wird Rocket Pool Docker-Container für seine eigenen Prozesse und für einen Validator-Client bereitstellen, den es verwaltet, aber die Execution-Client- und Beacon-Node-Container für die externen Clients ignorieren, die Sie bereits betreiben und warten.
**Da Rocket Pool neue Validator-Schlüssel für jeden Minipool Ihres Nodes erstellt und verwaltet, ist es wichtig, dass es seinen eigenen Validator-Client betreibt.**

Bei Verwendung dieser Konfiguration verwendet der Smartnode die folgenden Docker-Container (die oben beschrieben wurden):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

Die Container `rocketpool_eth1` und `rocketpool_eth2` werden entweder eingeschlossen oder ausgeschlossen, abhängig davon, welche Clients Sie bereits extern betreiben.

Wenn Sie diesen Modus verwenden möchten, fahren Sie mit dem Abschnitt [Konfiguration eines Standard-Rocket Pool Nodes mit Docker](./docker) fort.
Wenn Sie aufgefordert werden, einen Verwaltungsmodus für Ihre Execution- und/oder Consensus-Clients auszuwählen, wählen Sie die Option **Externally Managed**, die in diesem Abschnitt ausführlich beschrieben wird.

## Die Native-Konfiguration ohne Docker

Diese Konfiguration umgeht Docker vollständig.
Anstatt den Smartnode-Stack über Docker auszuführen, wird jeder Prozess als lokaler Systemdienst installiert (z. B. über `systemd`).
Dies umfasst die Prozesse `node`, `watchtower`, `eth1`, `eth2` und `validator`.

Diese Konfiguration bietet die größte Flexibilität, da sie es Ihnen ermöglicht, die Parameter von Rocket Pool feinabzustimmen (wie seine Sicherheitslage, wo die Execution- und Consensus-Clients leben, wo die Chain-Daten leben, wo Ihre Schlüssel leben und so weiter).
Sie ist auch am schwierigsten einzurichten und zu warten.

In diesem Modus ist der Smartnode-Installer nicht mehr relevant.
Sie sind dafür verantwortlich, die Smartnode-Infrastruktur, die ETH-Clients und die Validator-Clients manuell zu instanziieren, zu warten und zu aktualisieren.

::: danger WARNUNG
Während wir einige Beispieldokumentation bereitstellen, wie man dies tut, empfehlen wir, dass dieser Modus nur von **erfahrenen Systemadministratoren** verwendet werden sollte.
:::

Wenn Sie diesen Modus verwenden möchten, fahren Sie mit dem Abschnitt [Konfiguration eines nativen Rocket Pool Nodes ohne Docker](./native.mdx) fort.
