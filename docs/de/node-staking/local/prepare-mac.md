# Vorbereitung eines Mac

Vor der Installation von Rocket Pool sollten Sie einige Überprüfungen durchführen, um sicherzustellen, dass Ihr System kompatibel ist und korrekt funktioniert.

::: danger
Wir empfehlen dringend, eine dedizierte Maschine für den Betrieb eines Rocket Pool Nodes zu erstellen.
Der Betrieb eines Nodes auf einer allgemein genutzten Maschine, wie Ihrem täglichen Arbeitsdesktop, birgt zusätzliche Sicherheitsrisiken, die Ihre Wallet gefährden und zum Diebstahl Ihrer Coins führen können.

**Für maximale Sicherheit bauen Sie bitte eine neue Maschine, die ausschließlich dem Betrieb eines Nodes gewidmet ist.**
:::

## Systemanforderungen

Im Folgenden finden Sie eine kurze Beschreibung der Software- und Hardwareanforderungen, die ein Rocket Pool Node benötigt.
Diese Anleitung geht davon aus, dass Sie Ihre Maschine bereits physisch aufgebaut haben und das Betriebssystem installiert ist.

### Unterstützte Betriebssysteme

Rocket Pool empfiehlt, die neueste Version von macOS für Ihre Hardware zu verwenden.

### macOS-Unterstützung

Sie müssen folgende Voraussetzungen installieren:

Wir empfehlen dringend die Verwendung von [Homebrew](https://brew.sh) als Paketmanager für Mac. Es ermöglicht Ihnen, Pakete einfach mit dem Befehl `brew` zu installieren.

Sie können es installieren mit

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Es sollte einige Voraussetzungen für Sie installieren, wie XCode Command Line Tools. Falls nicht, können Sie diese manuell installieren mit

```shell
xcode-select --install
```

Sobald die Installation abgeschlossen ist, stellen Sie sicher, dass alles korrekt funktioniert mit

```shell
brew doctor
```

Sobald alles installiert ist und funktioniert, ermöglicht Ihnen Homebrew, Pakete mit dem Befehl `brew` zu installieren.

Um beispielsweise `wget` mit Homebrew zu installieren, führen Sie den folgenden Befehl im Terminal aus:

```shell
brew install wget
```

Nachdem wir Homebrew installiert haben, können wir unseren Docker-Client [Orbstack](https://orbstack.dev) installieren.

```shell
brew install --cask orbstack
```

Orbstack wird in Ihrem Anwendungsordner installiert. Starten Sie es von dort und es wird initialisiert. Wenn Sie von Docker Desktop migrieren, sollte es Ihre bestehende Docker-Installation erkennen und Ihre Images und Container migrieren.

Möglicherweise müssen Sie Ihre Orbstack-Einstellungen je nach Hardware anpassen.

Wenn Sie zuvor Docker Desktop installiert haben, müssen Sie es zuerst deinstallieren. Docker Desktop war früher der empfohlene Docker-Client, jedoch wurden im letzten Jahr einige neue Clients veröffentlicht, die viel bessere Stabilität bieten.

Bitte stellen Sie sicher, dass Ihre Firewall (Systemeinstellungen -> Netzwerk -> Firewall) eingeschaltet ist und Orbstack zur Liste der Anwendungen hinzugefügt wurde, die eingehende Verbindungen zulassen. (Orbstack sollte dies für Sie tun)

![](../local/images/mac/firewall.png)

### Installation und Verwendung von SSH

SSH sollte bereits mit macOS installiert sein.

### Überprüfungen des Systems vor der Installation

Bevor Sie Rocket Pool installieren, überprüfen Sie bitte die folgende Checkliste:

- Ihr System ist vollständig aufgebaut, schaltet sich ein und kann in das Betriebssystem booten.
- Sie werden keine anderen Aktivitäten auf dem System ausführen, wie im Internet surfen, E-Mails abrufen oder Spiele spielen.
- Sie haben ein macOS-Betriebssystem installiert.
- Ihr Benutzerkonto hat Root-/Administratorrechte.
- Sie haben eine SSD, die die Leistungsanforderungen erfüllt.
- Ihre SSD ist in Ihrem Dateisystem eingebunden.
- Sie haben mindestens 1,5 TB freien Speicherplatz für den initialen Execution- und Consensus-Synchronisierungsprozess.
- Wenn Ihr ISP Ihre Daten begrenzt, ist es mehr als 2 TB pro Monat.

Wenn Sie alle diese Punkte überprüft und bestätigt haben, sind Sie bereit, Rocket Pool zu installieren und mit dem Betrieb eines Nodes zu beginnen!
Fahren Sie fort mit dem Abschnitt [Auswahl Ihrer ETH-Clients](../eth-clients).
