# Vorbereitung eines PCs, Mini-PCs oder NUCs

Bevor Sie Rocket Pool installieren, sollten Sie einige Überprüfungen durchführen, um sicherzustellen, dass Ihr System kompatibel ist und korrekt funktioniert.

::: danger
Wir empfehlen dringend, eine dedizierte Maschine für den Betrieb eines Rocket Pool-Nodes zu erstellen.
Das Betreiben eines Nodes auf einer Allzweckmaschine, wie Ihrem täglichen Arbeitsdesktop oder einem Gaming-Rig, birgt zusätzliche Sicherheitsrisiken, die Ihre Wallet kompromittieren und zum Diebstahl Ihrer Coins führen können.

**Für maximale Sicherheit bauen Sie bitte eine neue Maschine, die ausschließlich für den Betrieb eines Nodes vorgesehen ist.**
:::

## Systemanforderungen

Nachfolgend finden Sie eine kurze Beschreibung der Software- und Hardwareanforderungen, die ein Rocket Pool-Node benötigt.
Diese Anleitung geht davon aus, dass Sie Ihre Maschine bereits physisch aufgebaut haben und das Betriebssystem installiert ist.

### Unterstützte Betriebssysteme

Der Smartnode-Client von Rocket Pool unterstützt derzeit **Linux**- und **macOS**-Systeme.

Zu diesem Zeitpunkt kann **Windows** verwendet werden, um eine entfernte Linux- oder Mac-Maschine remote zu verwalten, aber der Smartnode selbst kann derzeit nicht auf einem Windows-System ausgeführt werden. Rocket Pool _kann_ jedoch auf einer Linux-[virtuellen Maschine](https://de.wikipedia.org/wiki/Virtuelle_Maschine), die von einer Windows-Maschine gehostet wird, ausgeführt werden.
Dieses Setup wird gegenüber der einfachen Installation von Linux als Host-Betriebssystem nicht empfohlen, funktioniert aber bei Bedarf.
Beachten Sie, dass es zusätzlichen Ressourcen-Overhead erfordert und mit eigenen Sicherheitsrisiken verbunden ist, daher raten wir nicht dazu, dieses Setup beim Staking von echtem Ether im Mainnet zu verwenden.

Rocket Pool ist nativ kompatibel mit **AMD64 (x64)**- und **arm64 (aarch64)**-CPU-Architekturen.
Für andere Architekturen müssen Sie die Smartnode-Clients aus dem Quellcode kompilieren.

Beachten Sie, dass der Benutzer **root / Administrator**-Zugriff (oder **sudo**-Berechtigungen) haben muss, um den Smartnode zu installieren.

#### Linux-Unterstützung

Es gibt viele Varianten des Linux-Betriebssystems (genannt Distributionen oder kurz **Distros**). Während Sie Rocket Pool von jeder modernen Distro aus ausführen können, kann das Installationsprogramm von Rocket Pool den gesamten Stack automatisch auf [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/) und [Fedora](https://docs.fedoraproject.org/en-US/project/) installieren.

::: warning HINWEIS
Wenn Sie planen, Ubuntu zu verwenden, empfehlen wir dringend die Verwendung eines **LTS**-Releases wie 24.04.
Diese Releases werden für längere Zeiträume aktiv gewartet, was der Sicherheit und Stabilität Ihres Nodes hilft.
:::

Für die Installation auf anderen Distros kann das Smartnode-Installationsprogramm einige System-Abhängigkeiten (wie `docker-compose`) nicht automatisch installieren.
Einige manuelle Schritte werden während der Installation erforderlich sein.

Für `arm64`-Systeme unterstützt das Smartnode-Installationsprogramm nur nativ Debian und Debian-basierte Distros wie Ubuntu.
Für andere Distros sind während der Installation manuelle Schritte erforderlich.

## Installation des Betriebssystems

Wenn Sie macOS verwenden, ist es sehr wahrscheinlich, dass Sie das Betriebssystem bereits installiert haben und diesen Schritt überspringen können.

Wenn Sie Linux von Grund auf neu installieren, verfügen alle oben aufgeführten Distributionen über hilfreiche und detaillierte Tutorials für die Installation des Betriebssystems von Grund auf.
Als Beispiel führen wir Sie jedoch durch den Prozess der Installation und Vorbereitung von **Debian Server**.
Debian ist eine gute Wahl für den Node-Betrieb, da es sich auf **maximale Stabilität und Zuverlässigkeit** konzentriert - beides ist für Node-Maschinen, die 24/7 laufen müssen, sehr wünschenswert.

[Hier ist eine gute Schritt-für-Schritt-Anleitung](https://itslinuxfoss.com/debian-11-bullseye-guide/) mit Screenshots, die Ihnen zeigt, wie Sie Debian auf Ihrer Node-Maschine von Grund auf neu installieren.

:::tip
Wir haben ein paar hilfreiche Ergänzungen zur oben verlinkten Anleitung, die Sie möglicherweise befolgen möchten:

- Wenn Sie aufgefordert werden, ein **Root-Passwort** festzulegen, empfehlen wir, es **leer zu lassen**. Dies deaktiviert das `root`-Konto und installiert stattdessen das `sudo`-Paket, wodurch Ihr Benutzer Root-Operationen durchführen kann, indem er sein Passwort erneut eingibt, um seine Berechtigungen zu erhöhen. Dies ist analog zur Art und Weise, wie Ubuntu Linux eingerichtet ist, was für Benutzer möglicherweise vertrauter ist.
- Im **Softwareauswahl**-Bildschirm gegen Ende möchten Sie möglicherweise keine Desktop-GUI installiert haben.
  - Desktop-GUIs sind für einen Node weitgehend unnötig; sie fügen zusätzlichen Overhead hinzu und werden die meiste Zeit nicht verwendet, da Sie ihn sowieso über das Terminal fernsteuern werden, daher ziehen wir es vor, **GNOME und Debian-Desktop-Umgebung hier abzuwählen**.
  - Wenn Sie _doch_ eine Desktop-UI auf Ihrem Node wünschen, empfehlen wir, **GNOME abzuwählen und stattdessen XFCE anzuwählen**, da es leichter auf Systemressourcen ist. Wir empfehlen auch, keine zusätzliche Software auf dem Node auszuführen, wie Browser oder Discord, da sie die Sicherheit verringern und Systemressourcen verbrauchen.
  - Wählen Sie **Webserver** ab, aber lassen Sie **SSH-Server** und **Standard-System-Utilities** angewählt.
- Wenn Sie ein Flash-Laufwerk von einer ISO erstellt haben, müssen Sie möglicherweise das CD-ROM-Repository deaktivieren, um `apt` auszuführen.
  Sie finden eine Erklärung, wie das geht, [hier](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/).
- Ihr System ist möglicherweise standardmäßig so eingestellt, dass es in den Schlaf-/Ruhezustand versetzt wird. Um diese Einstellungen zu deaktivieren, können Sie den folgenden Befehl ausführen:
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### Installation von `sudo`

Das Installationsprogramm von Rocket Pool benötigt das `sudo`-Programm, um alle seine Abhängigkeiten zu erhalten.
Wenn Sie im vorherigen Schritt **das Root-Benutzer-Passwort leer gelassen haben**, haben Sie dies bereits.
Wenn nicht, installieren Sie es bitte jetzt, indem Sie die folgenden Befehle ausführen:

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Starten Sie dann die Maschine neu.
Sie sollten jetzt in der Lage sein, Befehle über `sudo` auszuführen, wie z. B. `sudo apt update`.

### Verwendung von SSH

Sobald der Server installiert ist und Sie sich anmelden können, müssen Sie seine IP-Adresse abrufen.
Eine einfache Möglichkeit, dies zu tun, ist mit `ifconfig`, das im 'net-tools'-Paket enthalten ist:

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Sie sehen möglicherweise mehrere Einträge hier, aber der, den Sie suchen, wird ungefähr so aussehen:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

Die Flags sollten `UP,BROADCAST,RUNNING,MULTICAST` sagen.
Der `inet`-Wert (hier `192.168.1.8`) ist die lokale IP-Adresse Ihrer Maschine.

Als Nächstes installieren Sie SSH:

```shell
sudo apt install openssh-server
```

:::tip HINWEIS
Wenn Sie während der Installation von Debian das Kästchen **SSH-Server** angekreuzt hatten, sollten Sie dies bereits installiert haben, sodass dieser Befehl nichts bewirkt.
:::

Sobald dies erledigt ist, können Sie sich mit `ssh` von Ihrem Laptop oder Desktop aus über das Terminal in die Maschine einloggen.

Wenn Sie mit `ssh` nicht vertraut sind, werfen Sie einen Blick auf die [Einführung in Secure Shell](../ssh)-Anleitung.

:::warning HINWEIS
An diesem Punkt sollten Sie _dringend erwägen_, Ihren Router so zu konfigurieren, dass die IP-Adresse Ihres Nodes **statisch** ist.
Dies bedeutet, dass Ihr Node für immer die gleiche IP-Adresse haben wird, sodass Sie sich immer mit dieser IP-Adresse über SSH einloggen können.
Andernfalls ist es möglich, dass sich die IP Ihres Nodes irgendwann ändert und der obige SSH-Befehl nicht mehr funktioniert.
Sie müssen dann in die Konfiguration Ihres Routers eintreten, um herauszufinden, was die neue IP-Adresse Ihres Nodes ist.

Jeder Router ist anders, daher müssen Sie die Dokumentation Ihres Routers konsultieren, um zu erfahren, wie Sie eine statische IP-Adresse zuweisen.
:::

## Einrichten des Swap-Space

In den meisten Fällen, wenn Sie Ihre Execution- und Consensus-Clients und Ihren Instanztyp sorgfältig auswählen, sollte Ihnen der RAM nicht ausgehen.
Andererseits schadet es nie, ein bisschen mehr hinzuzufügen.
Was wir jetzt tun werden, ist etwas hinzuzufügen, das als **Swap-Space** bezeichnet wird.
Im Wesentlichen bedeutet dies, dass wir die SSD als "Backup-RAM" verwenden werden, falls etwas schrecklich, schrecklich schief geht und Ihrem Server der normale RAM ausgeht.
Die SSD ist bei weitem nicht so schnell wie der normale RAM, daher wird es die Dinge verlangsamen, wenn sie den Swap-Space trifft, aber sie wird nicht vollständig abstürzen und alles kaputt machen.
Betrachten Sie dies als zusätzliche Versicherung, die Sie (höchstwahrscheinlich) nie benötigen werden.

### Erstellen einer Swap-Datei

Der erste Schritt besteht darin, eine neue Datei zu erstellen, die als Ihr Swap-Space dienen wird.
Entscheiden Sie, wie viel Sie verwenden möchten - ein vernünftiger Start wären 8 GB, sodass Sie 8 GB normalen RAM und 8 GB "Backup-RAM" für insgesamt 16 GB haben.
Um super sicher zu sein, können Sie 24 GB erstellen, sodass Ihr System 8 GB normalen RAM und 24 GB "Backup-RAM" für insgesamt 32 GB hat, aber dies ist wahrscheinlich übertrieben.
Zum Glück ist es vernachlässigbar, 8 bis 24 GB für eine Swapfile zuzuweisen, da Ihre SSD 1 oder 2 TB Speicherplatz hat.

Für diese Anleitung wählen wir einen schönen Mittelweg - sagen wir 16 GB Swap-Space für insgesamt 24 GB RAM.
Ersetzen Sie einfach die gewünschte Zahl, während wir fortfahren.

Geben Sie dies ein, wodurch eine neue Datei namens `/swapfile` erstellt und mit 16 GB Nullen gefüllt wird.
Um die Menge zu ändern, ändern Sie einfach die Zahl in `count=16` auf die gewünschte. **Beachten Sie, dass dies lange dauern wird, aber das ist ok.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

Als Nächstes setzen Sie die Berechtigungen, damit nur der Root-Benutzer sie lesen oder schreiben kann (aus Sicherheitsgründen):

```shell
sudo chmod 600 /swapfile
```

Markieren Sie sie nun als Swap-Datei:

```shell
sudo mkswap /swapfile
```

Als Nächstes aktivieren Sie sie:

```shell
sudo swapon /swapfile
```

Fügen Sie sie schließlich zur Mount-Tabelle hinzu, damit sie automatisch geladen wird, wenn Ihr Server neu startet:

```shell
sudo nano /etc/fstab
```

Fügen Sie am Ende eine neue Zeile hinzu, die so aussieht:

```
/swapfile                            none            swap    sw              0       0
```

Drücken Sie `Ctrl+O` und `Enter` zum Speichern, dann `Ctrl+X` und `Enter` zum Beenden.

Um zu überprüfen, ob sie aktiv ist, führen Sie diese Befehle aus:

```shell
sudo apt install htop
htop
```

Ihre Ausgabe sollte oben so aussehen:
![](../local/images/pi/Swap.png)

Wenn die zweite Zahl in der letzten Zeile mit der Bezeichnung `Swp` (die nach dem `/`) nicht Null ist, dann sind Sie fertig.
Zum Beispiel, wenn sie `0K / 16.0G` zeigt, dann wurde Ihr Swap-Space erfolgreich aktiviert.
Wenn sie `0K / 0K` zeigt, dann hat es nicht funktioniert und Sie müssen bestätigen, dass Sie die vorherigen Schritte ordnungsgemäß eingegeben haben.

Drücken Sie `q` oder `F10`, um aus `htop` zu beenden und zum Terminal zurückzukehren.

### Konfigurieren von Swappiness und Cache Pressure

Standardmäßig wird Linux eifrig viel Swap-Space verwenden, um etwas Druck vom RAM des Systems zu nehmen.
Das wollen wir nicht. Wir möchten, dass es den gesamten RAM bis zur letzten Sekunde nutzt, bevor es auf SWAP zurückgreift.
Der nächste Schritt besteht darin, die sogenannte "Swappiness" des Systems zu ändern, was im Grunde ist, wie eifrig es ist, den Swap-Space zu verwenden.
Es gibt viel Debatte darüber, auf welchen Wert dies eingestellt werden sollte, aber wir haben festgestellt, dass ein Wert von 6 gut genug funktioniert.

Wir möchten auch den "Cache Pressure" heruntersetzen, der bestimmt, wie schnell der Server einen Cache seines Dateisystems löscht.
Da wir viel freien RAM mit unserem Setup haben werden, können wir dies auf "10" setzen, was den Cache für eine Weile im Speicher belässt und die Disk-I/O reduziert.

Um diese zu setzen, führen Sie diese Befehle aus:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Fügen Sie sie nun in die `sysctl.conf`-Datei ein, damit sie nach einem Neustart erneut angewendet werden:

```shell
sudo nano /etc/sysctl.conf
```

Fügen Sie diese beiden Zeilen am Ende hinzu:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Dann speichern und beenden Sie wie zuvor (`Ctrl+O`, `Ctrl+X`).

### System-Checks vor der Installation

Bevor Sie Rocket Pool installieren, überprüfen Sie bitte die folgende Checkliste:

- Ihr System ist vollständig aufgebaut, schaltet sich ein und kann in das Betriebssystem booten.
- Sie werden keine andere Aktivität auf dem System durchführen, wie z. B. im Internet surfen, E-Mails abrufen oder Spiele spielen.
- Sie haben ein Linux-Betriebssystem installiert.
- Ihr Benutzerkonto hat Root-/Administrator-Rechte.
- Sie haben eine SSD, die die Leistungsanforderungen erfüllt.
- Ihre SSD ist auf Ihrem Dateisystem gemountet.
- Sie haben mindestens 1,5 TB freien Speicherplatz für die initiale Execution- und Consensus-Synchronisierung.
- Wenn Ihr ISP Ihre Daten begrenzt, sind es mehr als 2 TB pro Monat.

Wenn Sie all diese Punkte überprüft und bestätigt haben, dann sind Sie bereit, Rocket Pool zu installieren und mit dem Betrieb eines Nodes zu beginnen!
Fahren Sie mit dem Abschnitt [Auswahl Ihrer ETH Clients](../eth-clients) fort.
