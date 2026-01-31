# Node-Anforderungen und Auswahl einer Plattform

In Ordnung!
Sie haben sich also entschieden, einen Rocket Pool Node zu betreiben.
Der erste Schritt des Prozesses besteht darin, zu entscheiden, auf welcher Art von Plattform Sie Ihren Node betreiben möchten.
Wenn Sie bereits eine im Kopf haben, großartig!
Sie können zum nächsten Abschnitt springen.
Wenn Sie sich noch nicht sicher sind, dann lesen Sie weiter für einige Informationen über Ihre Optionen.

## Full Node Anforderungen

Ein **Full Node** ist einer, der sowohl einen Execution Client als auch einen Consensus Client zusammen mit dem Rocket Pool Stack ausführt.
Jetzt, da der Merge stattgefunden hat, müssen Rocket Pool Nodes diese Konfiguration ausführen (obwohl die Execution- und Consensus-Clients extern verwaltet werden können für Benutzer, die bereits ein Solo-Staking-Setup betreiben - wir werden dies später ausführlicher behandeln).

Hier ist eine einfache Aufschlüsselung dessen, was erforderlich ist, um einen Full Rocket Pool Node gut zu betreiben:

- Eine **stabile Internetverbindung**. Je länger Sie online bleiben, desto besser Ihre Belohnungen. Eine lückenhafte Internetverbindung wird Ihre Erträge beeinträchtigen und damit das Wachstum des rETH-Verhältnisses.
- Mindestens **10 Mbps Bandbreite sowohl für Upload als auch Download**. Ein Full Node benötigt normalerweise etwa 8 Mbps bis 10 Mbps Upload & Download an Netzwerkverkehr, abhängig von Ihrer Konfiguration und Anzahl der Minipools.
- **Keine Datenobergrenze**, die von Ihrem ISP auferlegt wird. Der Betrieb eines Full Nodes benötigt viele Daten - wir haben Berichte von über 2 TB pro Monat allein an Chain-Daten gesehen. Dies kann etwas mit einigen Einstellungsanpassungen an den ETH-Clients gemildert werden, aber als Faustregel gilt: Betreiben Sie keinen Full Node, wenn Ihr Internetplan mit einer monatlichen Datenobergrenze kommt.
- **Stabile Stromversorgung**. Aus demselben Grund wie die Notwendigkeit einer stabilen Internetverbindung möchten Sie auch zuverlässige Energie haben. Dies kann mit einer großen USV (Backup-Batterie) gemildert werden, um mit kurzen Stromausfällen umzugehen.
- Ein **Computer** mit ausreichenden Spezifikationen. Dies ist ziemlich flexibel, da es _wirklich_ davon abhängt, welchen Execution- und Consensus-Client Sie verwenden und mit welchen Einstellungen Sie sie konfigurieren. Der Computer kann eine lokale Maschine sein, oder er kann in der Cloud gehostet werden. Lesen Sie unten für weitere Informationen zu diesen beiden Optionen und wie Sie entscheiden, welche für Sie am besten ist.

Der Computer muss die [Hardware-Richtlinien](./local/hardware.md) erfüllen

::: warning HINWEIS
Zu diesem Zeitpunkt werden nur **Linux**- und **macOS**-Plattformen unterstützt.
**Windows wird derzeit nicht unterstützt** für den Smartnode-Betrieb.
:::

## Betrieb eines lokalen Nodes

Wenn Sie zuverlässigen Strom und unbegrenzten Internetzugang haben und bereit sind, einen Computer zu bauen (oder vorgefertigt zu kaufen) und zu warten, dann könnte der Betrieb eines lokalen Nodes eine großartige Wahl für Sie sein. Mit dieser Option richten Sie einen dedizierten Computer als Rocket Pool Node ein und betreiben ihn lokal in Ihrem eigenen Zuhause.

Vorteile:

- Keine monatlichen Gebühren, außer Nebenkosten
- Vollständige Kontrolle über Ihre eigene Maschine und ihre Daten (einschließlich des Schlüssels Ihrer Wallet)
- Zugang zur Durchführung von Wartung und Upgrades, wann immer Sie möchten
- Trägt zur Dezentralisierung von Execution und Consensus und Rocket Pool bei (und damit zu ihrer Sicherheit)

Nachteile:

- Erfordert stabiles, unbegrenztes Internet und Strom
  - **Der Betrieb eines Nodes verwendet mindestens 1,5 TB Daten pro Monat. Wenn Sie eine Datenobergrenze unter diesem Betrag haben, können Sie beim Betrieb eines lokalen Nodes auf Probleme stoßen!**
- Sie sind allein verantwortlich für Netzwerk- und Computersicherheit
- Kann herausfordernd sein, wenn Sie nicht erfahren in der Computerwartung sind
- Anfällig für Diebstahl

Wenn die Vorteile für Sie die Nachteile überwiegen, dann werfen Sie einen Blick auf unseren [Leitfaden für lokale Node-Betreiber](./local/hardware.html).

## Betrieb auf einem Server

Wenn Sie keinen zuverlässigen unbegrenzten Internetplan haben oder einfach nicht mit dem Bau und der Wartung Ihres eigenen physischen Computers umgehen möchten, möchten Sie vielleicht einen privaten Server in Betracht ziehen, den Sie von einem Hosting-Anbieter mieten. Im Wesentlichen werden diese Unternehmen gerne einen Server für Sie erstellen und betreiben, gegen eine monatliche Gebühr. Wenn Ihnen diese Gebühr nichts ausmacht und Sie einen Rocket Pool Node betreiben möchten, kann die Verwendung eines Servers eine gute Strategie sein.

Vorteile:

- Keine Wartung, Support ist normalerweise verfügbar, um Probleme zu beheben
- Beeinflusst nicht Ihren Internetplan oder Ihre Datenobergrenze
- Wird normalerweise in einem professionellen Rechenzentrum betrieben, sehr wenig Ausfallzeit
- Kann kostengünstiger sein als der Kauf / Bau Ihres eigenen Computers

Nachteile:

- Macht Execution und Consensus und Rocket Pool etwas zentralisierter, was die Sicherheit der Netzwerke schwächt
- Monatliche Gebühren
- Server können mit Datenobergrenzen kommen oder teure Netzwerk-I/O-Raten haben
- Möglich für Hosts, den Inhalt Ihrer Maschine zu untersuchen und den Schlüssel Ihrer Wallet zu nehmen, wenn nicht gesichert

Wenn diese Vorteile für Sie die Nachteile überwiegen, dann werfen Sie einen Blick auf unseren [Server-Node-Betreiber-Leitfaden](./vps/providers.html).
