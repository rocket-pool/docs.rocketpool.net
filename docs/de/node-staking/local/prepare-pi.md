# Einen Raspberry Pi vorbereiten

::: warning HINWEIS
Diese Seite wurde zu Archivzwecken belassen. Wir empfehlen nicht mehr, Rocket Pool auf einem Raspberry Pi zu betreiben, da die Hardware- und Leistungsanforderungen für den Betrieb eines Ethereum-Validators gestiegen sind.
:::

Dieser Leitfaden führt Sie durch den Betrieb eines Rocket Pool-Node mit einem Raspberry Pi.
Obwohl dies in den meisten Staking-Leitfäden normalerweise nicht empfohlen wird, erkennen wir an, dass es attraktiv ist, da es eine viel günstigere Option ist als die Einrichtung eines vollständigen PCs.
Aus diesem Grund haben wir hart daran gearbeitet, eine Vielzahl von Einstellungen zu optimieren und eine Konfiguration ermittelt, die gut zu funktionieren scheint.

Dieses Setup führt **einen vollständigen Execution-Node** und **einen vollständigen Consensus-Node** auf dem Pi aus und trägt so zur Gesundheit des Ethereum-Netzwerks bei, während es gleichzeitig als Rocket Pool Node Operator fungiert.

## Vorbereitende Einrichtung

Um einen Rocket Pool-Node auf einem Raspberry Pi zu betreiben, benötigen Sie zunächst einen funktionierenden Raspberry Pi.
Wenn Sie bereits einen betriebsbereiten haben - großartig! Sie können zum Abschnitt [SSD montieren](#montieren-der-ssd) springen.
Stellen Sie nur sicher, dass Sie **einen Lüfter angebracht** haben, bevor Sie beginnen.
Wenn Sie von Grund auf neu beginnen, lesen Sie weiter.

### Was Sie benötigen

Dies sind die empfohlenen Komponenten, die Sie kaufen müssen, um Rocket Pool auf einem Pi zu betreiben:

- Ein **Raspberry Pi 4 Model B**, das **8 GB-Modell**
  - Hinweis: Obwohl Sie _können_ ein 4 GB mit diesem Setup verwenden, empfehlen wir dringend, sich für ein 8 GB zu entscheiden, um sicherzugehen... es ist wirklich nicht viel teurer.
- Ein **USB-C-Netzteil** für den Pi. Sie benötigen eines, das **mindestens 3 Ampere** liefert.
- Eine **MicroSD-Karte**. Sie muss nicht groß sein, 16 GB sind ausreichend und sie sind jetzt ziemlich günstig... aber sie sollte mindestens **Klasse 10 (U1)** sein.
- Ein **MicroSD-zu-USB-Adapter** für Ihren PC. Dies wird benötigt, damit Sie das Betriebssystem auf die Karte installieren können, bevor Sie sie in den Pi einlegen.
  Wenn Ihr PC bereits einen SD-Anschluss hat, müssen Sie keinen neuen kaufen.
- Einige **Kühlkörper**. Sie werden den Pi unter voller Last 24/7 betreiben, und er wird heiß werden.
  Kühlkörper helfen, damit er sich nicht selbst drosselt. Idealerweise möchten Sie ein Set von 3: einen für die CPU, einen für den RAM und einen für den USB-Controller.
  [Hier ist ein gutes Beispiel für ein schönes Set](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Ein **Gehäuse**. Es gibt hier zwei Möglichkeiten: mit Lüfter und lüfterlos.
  - Mit Lüfter:
    - Ein **40mm-Lüfter**. Wie oben ist das Ziel, die Dinge kühl zu halten, während Sie Ihren Rocket Pool-Node betreiben.
    - Ein **Gehäuse mit Lüfterhalterung**, um alles zusammenzubringen.
      Sie könnten auch ein Gehäuse mit integrierten Lüftern [wie dieses](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) bekommen, damit Sie die Lüfter nicht separat kaufen müssen.
  - Ohne Lüfter:
    - Ein **lüfterloses Gehäuse**, das als ein riesiger Kühlkörper fungiert, wie [dieses](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX).
      Dies ist eine schöne Option, da es lautlos ist, aber Ihr Pi **wird** ziemlich heiß werden - besonders während des anfänglichen Blockchain-Synchronisationsprozesses.
      Dank an Discord-Benutzer Ken, der uns in diese Richtung gewiesen hat!
  - Als allgemeine Regel empfehlen wir, **mit einem Lüfter** zu gehen, da wir den Pi erheblich übertakten werden.

Sie können viele dieser Dinge gebündelt zur Bequemlichkeit bekommen - zum Beispiel bietet [Canakit ein Kit](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) mit vielen enthaltenen Komponenten.
Sie könnten jedoch möglicherweise alles günstiger bekommen, wenn Sie die Teile separat kaufen (und wenn Sie die Ausrüstung haben, können Sie [Ihr eigenes Pi-Gehäuse in 3D drucken](https://www.thingiverse.com/thing:3793664).)

Weitere Komponenten, die Sie benötigen:

- Ein **USB 3.0+ Solid State Drive**. Die allgemeine Empfehlung ist ein **2 TB-Laufwerk**.
  - Das [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) ist ein hervorragendes Beispiel für eines, das bekanntermaßen gut funktioniert.
  - :warning: Die Verwendung einer SATA-SSD mit einem SATA-zu-USB-Adapter wird **nicht empfohlen** wegen [Problemen wie diesem](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931).
    Wenn Sie diesen Weg gehen, haben wir einen Leistungstest eingefügt, mit dem Sie überprüfen können, ob es funktioniert oder nicht im Abschnitt [Testen der SSD-Leistung](#testen-der-ssd-leistung).
- Ein **Ethernet-Kabel** für den Internetzugang. Es sollte mindestens **Cat 5e** bewertet sein.
  - Der Betrieb eines Node über Wi-Fi wird **nicht empfohlen**, aber wenn Sie keine andere Option haben, können Sie es anstelle eines Ethernet-Kabels verwenden.
- Eine **USV** als Stromquelle, falls Sie jemals Strom verlieren.
  Der Pi verbraucht wirklich nicht viel Strom, also hält selbst eine kleine USV eine Weile, aber im Allgemeinen gilt: je größer, desto besser. Gehen Sie mit der größten USV, die Sie sich leisten können.
  Außerdem empfehlen wir, dass Sie **auch Ihr Modem, Router und andere Netzwerkgeräte** daran anschließen - es hat nicht viel Sinn, Ihren Pi am Leben zu erhalten, wenn Ihr Router abstirbt.

Abhängig von Ihrem Standort, Verkäufen, Ihrer Wahl der SSD und USV und davon, wie viele dieser Dinge Sie bereits haben, werden Sie wahrscheinlich **etwa 200 bis 500 USD** für ein komplettes Setup ausgeben.

### Den Lüfter leiser laufen lassen

Wenn Sie den Lüfter bekommen, werden Sie wahrscheinlich standardmäßig angewiesen, ihn an den 5V-GPIO-Pin anzuschließen, wie im Bild unten gezeigt.
Der Lüfter hat einen Stecker mit zwei Löchern; das schwarze sollte an GND (Pin 6) gehen und das rote sollte an +5V (Pin 4) gehen.
![](./images/pi/Pinout.png)

Nach unserer Erfahrung läuft der Lüfter dadurch jedoch sehr laut und schnell, was nicht wirklich notwendig ist.
Wenn Sie ihn leiser machen möchten, während er immer noch kühl läuft, versuchen Sie, ihn stattdessen an den 3,3V-Pin (Pin 1, der blaue) anzuschließen anstelle des 5V-Pins.
Das bedeutet, dass bei Ihrem Lüfter der schwarze Punkt immer noch an GND (Pin 6) geht, aber jetzt geht der rote Punkt an +3,3V (Pin 1).

Wenn Ihr Lüfter einen Stecker hat, bei dem die beiden Löcher nebeneinander liegen und Sie sie nicht auseinander nehmen können, können Sie [einige Jumper wie diese](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) zwischen ihn und die GPIO-Pins am Pi setzen.

### Installation des Betriebssystems

Es gibt einige Varianten von Linux-Betriebssystemen, die den Raspberry Pi unterstützen.
Für diesen Leitfaden bleiben wir bei **Ubuntu 20.04**.
Ubuntu ist ein bewährtes Betriebssystem, das weltweit verwendet wird, und 20.04 ist (zum Zeitpunkt dieses Schreibens) die neueste der Long Term Support (LTS)-Versionen, was bedeutet, dass es sehr lange weiterhin Sicherheitspatches erhalten wird.
Wenn Sie lieber bei einer anderen Linux-Variante wie Raspbian bleiben möchten, folgen Sie gerne den vorhandenen Installationsanleitungen dafür - bedenken Sie nur, dass dieser Leitfaden für Ubuntu erstellt wurde, sodass nicht alle Anweisungen mit Ihrem Betriebssystem übereinstimmen könnten.

Die freundlichen Leute bei Canonical haben [einen wunderbaren Leitfaden zum Installieren des Ubuntu Server-Images auf einem Pi](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview) geschrieben.

Folgen Sie **Schritt 1 bis 4** des obigen Leitfadens für die Server-Einrichtung.
Für das Betriebssystem-Image wählen Sie `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`.

Wenn Sie sich entscheiden, dass Sie eine Desktop-Benutzeroberfläche möchten (damit Sie eine Maus verwenden und Fenster herumziehen können), müssen Sie auch Schritt 5 befolgen.
Wir empfehlen, dies nicht zu tun und einfach beim Server-Image zu bleiben, da die Desktop-Benutzeroberfläche Ihrem Pi mit relativ geringem Nutzen zusätzlichen Overhead und Verarbeitungsaufwand hinzufügt.
Wenn Sie jedoch entschlossen sind, einen Desktop zu betreiben, empfehlen wir die Xubuntu-Option.
Es ist ziemlich ressourcenschonend und sehr benutzerfreundlich.

Sobald das abgeschlossen ist, sind Sie bereit, Ubuntu für den Betrieb eines Rocket Pool-Node vorzubereiten.
Sie können das lokale Terminal darauf verwenden oder sich von Ihrem Desktop/Laptop aus per SSH anmelden, wie der Installationsleitfaden vorschlägt.
Der Prozess wird in beiden Fällen der gleiche sein, also tun Sie, was für Sie am bequemsten ist.

Wenn Sie nicht mit `ssh` vertraut sind, werfen Sie einen Blick auf den [Einführung in Secure Shell](../ssh)-Leitfaden.

::: warning HINWEIS
An diesem Punkt sollten Sie _dringend in Erwägung ziehen_, Ihren Router so zu konfigurieren, dass die IP-Adresse Ihres Pi **statisch** ist.
Das bedeutet, dass Ihr Pi für immer dieselbe IP-Adresse haben wird, sodass Sie sich mit dieser IP-Adresse immer per SSH anmelden können.
Andernfalls ist es möglich, dass sich die IP Ihres Pi irgendwann ändert und der obige SSH-Befehl nicht mehr funktioniert.
Sie müssen die Konfiguration Ihres Routers aufrufen, um herauszufinden, was die neue IP-Adresse Ihres Pi ist.

Jeder Router ist anders, daher müssen Sie die Dokumentation Ihres Routers konsultieren, um zu erfahren, wie Sie eine statische IP-Adresse zuweisen.
:::

## Montieren der SSD

Wie Sie vielleicht bemerkt haben, wird nach Befolgen der obigen Installationsanweisungen das Kern-Betriebssystem von der microSD-Karte ausgeführt.
Das ist bei weitem nicht groß oder schnell genug, um alle Execution- und Consensus-Blockchain-Daten zu speichern, und hier kommt die SSD ins Spiel.
Um sie zu verwenden, müssen wir sie mit einem Dateisystem einrichten und am Pi mounten.

### Anschließen der SSD an die USB 3.0-Anschlüsse

Schließen Sie zunächst Ihre SSD an einen der USB 3.0-Anschlüsse des Pi an. Dies sind die **blauen** Anschlüsse, nicht die schwarzen:

![](./images/pi/USB.png)

Die schwarzen sind langsame USB 2.0-Anschlüsse; sie sind nur für Zubehör wie Mäuse und Tastaturen geeignet.
Wenn Sie Ihre Tastatur an den blauen Anschlüssen angeschlossen haben, nehmen Sie sie heraus und stecken Sie sie jetzt in die schwarzen.

### Formatieren der SSD und Erstellen einer neuen Partition

::: warning
Dieser Vorgang wird alles auf Ihrer SSD löschen.
Wenn Sie bereits eine Partition mit Daten darauf haben, ÜBERSPRINGEN SIE DIESEN SCHRITT, da Sie alles löschen werden!
Wenn Sie diese SSD noch nie verwendet haben und sie völlig leer ist, befolgen Sie diesen Schritt.
:::

Führen Sie diesen Befehl aus, um den Speicherort Ihrer Festplatte in der Gerätetabelle zu finden:

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

Wichtig ist der Teil `logical name: /dev/sda`, oder vielmehr der **`/dev/sda`**-Teil davon.
Wir nennen dies den **Gerätestandort** Ihrer SSD.
Für diesen Leitfaden verwenden wir einfach `/dev/sda` als Gerätestandort - Ihrer wird wahrscheinlich der gleiche sein, aber ersetzen Sie ihn durch das, was dieser Befehl für die restlichen Anweisungen zeigt.

Jetzt, da wir den Gerätestandort kennen, formatieren wir ihn und erstellen eine neue Partition darauf, damit wir ihn tatsächlich verwenden können.
Noch einmal: **Diese Befehle löschen alles, was bereits auf der Festplatte ist!**

Erstellen Sie eine neue Partitionstabelle:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Formatieren Sie die neue Partition mit dem `ext4`-Dateisystem:

```shell
sudo mkfs -t ext4 /dev/sda1
```

Fügen Sie eine Bezeichnung hinzu (Sie müssen dies nicht tun, aber es macht Spaß):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Bestätigen Sie, dass dies funktioniert hat, indem Sie den folgenden Befehl ausführen, der Ausgaben wie hier gezeigt anzeigen sollte:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Wenn Sie all das sehen, sind Sie fertig. Holen Sie sich die `UUID="..."`-Ausgabe und speichern Sie sie vorübergehend irgendwo, denn Sie werden sie gleich benötigen.

### Optimierung der neuen Partition

Als Nächstes optimieren wir das neue Dateisystem ein wenig für Validator-Aktivitäten.

Standardmäßig reserviert ext4 5% seines Speicherplatzes für Systemprozesse.
Da wir das auf der SSD nicht benötigen, weil sie nur die Execution- und Consensus-Chain-Daten speichert, können wir es deaktivieren:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Mounten und automatisches Mounten aktivieren

Um das Laufwerk zu verwenden, müssen Sie es im Dateisystem mounten.
Erstellen Sie einen neuen Mountpunkt irgendwo, wo Sie möchten (wir verwenden hier `/mnt/rpdata` als Beispiel, Sie können das gerne verwenden):

```shell
sudo mkdir /mnt/rpdata
```

Jetzt mounten Sie die neue SSD-Partition zu diesem Ordner:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Danach zeigt der Ordner `/mnt/rpdata` auf die SSD, sodass alles, was Sie in diesen Ordner schreiben, auf der SSD gespeichert wird.
Hier werden wir die Chain-Daten für Execution und Consensus speichern.

Jetzt fügen wir es zur Mount-Tabelle hinzu, damit es beim Start automatisch gemountet wird.
Erinnern Sie sich an die `UUID` aus dem `blkid`-Befehl, den Sie zuvor verwendet haben?
Hier wird sie nützlich sein.

```shell
sudo nano /etc/fstab
```

Dies öffnet einen interaktiven Datei-Editor, der zunächst so aussieht:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

Verwenden Sie die Pfeiltasten, um nach unten zur untersten Zeile zu gehen, und fügen Sie diese Zeile am Ende hinzu:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

Ersetzen Sie den Wert in `UUID=...` mit dem von Ihrer Festplatte, drücken Sie dann `Ctrl+O` und `Enter` zum Speichern, dann `Ctrl+X` und `Enter` zum Beenden.
Jetzt wird die SSD beim Neustart automatisch gemountet. Schön!

### Testen der SSD-Leistung

Bevor Sie weitermachen, sollten Sie die Lese-/Schreibgeschwindigkeit Ihrer SSD testen und wie viele E/A-Anfragen sie pro Sekunde verarbeiten kann (IOPS).
Wenn Ihre SSD zu langsam ist, funktioniert sie nicht gut für einen Rocket Pool-Node und Sie werden im Laufe der Zeit Geld verlieren.

Um sie zu testen, verwenden wir ein Programm namens `fio`. Installieren Sie es so:

```shell
sudo apt install fio
```

Als Nächstes wechseln Sie zum Mountpunkt Ihrer SSD:

```shell
cd /mnt/rpdata
```

Führen Sie nun diesen Befehl aus, um die SSD-Leistung zu testen:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

Die Ausgabe sollte so aussehen:

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

Was Sie interessiert, sind die Zeilen, die mit `read:` und `write:` unter der Zeile `test:` beginnen.

- Ihr **read** sollte IOPS von mindestens **15k** und Bandbreite (BW) von mindestens **60 MiB/s** haben.
- Ihr **write** sollte IOPS von mindestens **5000** und Bandbreite von mindestens **20 MiB/s** haben.

Das sind die Spezifikationen des Samsung T5, das wir verwenden, das sehr gut funktioniert.
Wir haben auch eine langsamere SSD mit 5k Read-IOPS und 1k Write-IOPS getestet, und sie hat große Schwierigkeiten, mit der Consensus-Schicht Schritt zu halten.
Wenn Sie eine SSD verwenden, die langsamer als die obigen Spezifikationen ist, seien Sie darauf vorbereitet, dass Sie möglicherweise viele verpasste Attestierungen sehen.
Wenn Ihre sie erfüllt oder übertrifft, sind Sie fertig und können weitermachen.

::: tip HINWEIS
Wenn Ihre SSD die obigen Spezifikationen nicht erfüllt, es aber sollte, können Sie es möglicherweise mit einem Firmware-Update beheben.
Dies wurde beispielsweise von der Rocket Pool-Community mit dem Samsung T7 erlebt.
Zwei davon frisch aus der Verpackung zeigten nur 3,5K Read-IOPS und 1,2K Write-IOPS.
Nach Anwendung aller verfügbaren Firmware-Updates war die Leistung wieder auf den Zahlen im obigen Beispiel.
Überprüfen Sie die Support-Website Ihres Herstellers auf die neueste Firmware und stellen Sie sicher, dass Ihr Laufwerk auf dem neuesten Stand ist - Sie müssen die Firmware möglicherweise mehrmals aktualisieren, bis keine Updates mehr übrig sind.
:::

Zu guter Letzt entfernen Sie die Testdatei, die Sie gerade erstellt haben:

```shell
sudo rm /mnt/rpdata/test
```

## Einrichten des Swap-Speicherplatzes

Der Pi hat 8 GB (oder 4 GB, wenn Sie diesen Weg gegangen sind) RAM.
Für unsere Konfiguration wird das ausreichend sein.
Andererseits schadet es nie, ein wenig mehr hinzuzufügen.
Was wir jetzt tun werden, ist das Hinzufügen von sogenanntem **Swap-Speicherplatz**.
Im Wesentlichen bedeutet dies, dass wir die SSD als "Backup-RAM" verwenden werden, falls etwas schrecklich, schrecklich schief geht und der Pi den normalen RAM aufbraucht.
Die SSD ist bei weitem nicht so schnell wie der normale RAM, also wenn sie den Swap-Speicherplatz trifft, wird es die Dinge verlangsamen, aber es wird nicht vollständig abstürzen und alles kaputt machen.
Betrachten Sie dies als zusätzliche Versicherung, die Sie (höchstwahrscheinlich) nie brauchen werden.

### Erstellen einer Swap-Datei

Der erste Schritt besteht darin, eine neue Datei zu erstellen, die als Ihr Swap-Speicherplatz fungiert.
Entscheiden Sie, wie viel Sie verwenden möchten - ein vernünftiger Start wären 8 GB, sodass Sie 8 GB normalen RAM und 8 GB "Backup-RAM" für insgesamt 16 GB haben.
Um super sicher zu sein, können Sie 24 GB machen, sodass Ihr System 8 GB normalen RAM und 24 GB "Backup-RAM" für insgesamt 32 GB hat, aber das ist wahrscheinlich übertrieben.
Glücklicherweise ist es vernachlässigbar, da Ihre SSD 1 oder 2 TB Speicherplatz hat, 8 bis 24 GB für eine Swapfile zuzuweisen.

Nehmen wir für diese Anleitung einen schönen Mittelweg - sagen wir, 16 GB Swap-Speicherplatz für insgesamt 24 GB RAM.
Ersetzen Sie einfach die gewünschte Zahl, während wir fortfahren.

Geben Sie dies ein, wodurch eine neue Datei namens `/mnt/rpdata/swapfile` erstellt und mit 16 GB Nullen gefüllt wird.
Um die Menge zu ändern, ändern Sie einfach die Zahl in `count=16` zu der gewünschten. **Beachten Sie, dass dies lange dauern wird, aber das ist in Ordnung.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

Setzen Sie als Nächstes die Berechtigungen so, dass nur der Root-Benutzer darauf lesen oder schreiben kann (aus Sicherheitsgründen):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Markieren Sie es nun als Swap-Datei:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Aktivieren Sie es als Nächstes:

```shell
sudo swapon /mnt/rpdata/swapfile
```

Fügen Sie es schließlich zur Mount-Tabelle hinzu, damit es automatisch geladen wird, wenn Ihr Pi neu startet:

```shell
sudo nano /etc/fstab
```

Fügen Sie eine neue Zeile am Ende hinzu, sodass die Datei so aussieht:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Drücken Sie `Ctrl+O` und `Enter` zum Speichern, dann `Ctrl+X` und `Enter` zum Beenden.

Um zu überprüfen, ob es aktiv ist, führen Sie diese Befehle aus:

```shell
sudo apt install htop
htop
```

Ihre Ausgabe sollte oben so aussehen:
![](./images/pi/Swap.png)

Wenn die zweite Zahl in der letzten Zeile mit der Bezeichnung `Swp` (die nach dem `/`) nicht null ist, sind Sie fertig.
Zum Beispiel, wenn es `0K / 16.0G` zeigt, wurde Ihr Swap-Speicherplatz erfolgreich aktiviert.
Wenn es `0K / 0K` zeigt, hat es nicht funktioniert und Sie müssen bestätigen, dass Sie die vorherigen Schritte richtig eingegeben haben.

Drücken Sie `q` oder `F10`, um `htop` zu beenden und zurück zum Terminal zu gelangen.

### Konfigurieren von Swappiness und Cache-Druck

Standardmäßig wird Linux eifrig viel Swap-Speicherplatz verwenden, um etwas Druck vom RAM des Systems zu nehmen.
Das wollen wir nicht. Wir wollen, dass es den gesamten RAM bis zur letzten Sekunde nutzt, bevor es sich auf SWAP verlässt.
Der nächste Schritt besteht darin, die sogenannte "Swappiness" des Systems zu ändern, was im Grunde genommen ist, wie eifrig es ist, den Swap-Speicherplatz zu verwenden.
Es gibt viel Debatte darüber, auf welchen Wert dies eingestellt werden soll, aber wir haben festgestellt, dass ein Wert von 6 gut genug funktioniert.

Wir möchten auch den "Cache-Druck" senken, der bestimmt, wie schnell der Pi einen Cache seines Dateisystems löscht.
Da wir mit unserem Setup viel freien RAM haben werden, können wir dies auf "10" setzen, was den Cache für eine Weile im Speicher belässt und die Festplatten-E/A reduziert.

Um diese festzulegen, führen Sie diese Befehle aus:

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

## Übertakten des Pi

Standardmäßig ist der 1,5-GHz-Prozessor, mit dem der Pi kommt, ein ziemlich fähiges kleines Gerät.
Zum größten Teil sollten Sie damit gut validieren können.
Wir haben jedoch bemerkt, dass Ihr Validator-Client in seltenen Fällen bei einigen Dingen hängen bleibt und einfach nicht genug Rechenleistung hat, um mit den Attestierungspflichten Ihres Validators Schritt zu halten.
Wenn das passiert, sehen Sie etwas wie dies auf dem [beaconcha.in Explorer](https://beaconcha.in) (ausführlicher beschrieben im Leitfaden [Überwachung der Leistung Ihres Node](../performance) weiter unten):

![](./images/pi/Incl-Dist.png)

Diese Inclusion-Distanz von 8 bedeutet, dass es sehr lange gedauert hat, diese Attestierung zu senden, und Sie werden leicht dafür bestraft, dass Sie zu spät waren.
Idealerweise sollten alle 0 sein.
Obwohl selten, treten diese bei Ausführung mit Standardeinstellungen auf.

Es gibt jedoch eine Möglichkeit, diese zu mildern: Übertakten.
Übertakten ist bei weitem der einfachste Weg, um etwas zusätzliche Leistung aus der CPU Ihres Pi zu holen und diese unangenehmen hohen Inclusion-Distanzen zu verhindern.
Ehrlich gesagt ist die Standard-CPU-Taktrate von 1,5 GHz wirklich zu schwach.
Sie können sie durch Übertakten ziemlich beschleunigen, und je nachdem, wie weit Sie gehen, können Sie es auch ziemlich sicher tun.

Das Übertakten des Pi ist sehr einfach - es beinhaltet nur das Ändern einiger Zahlen in einer Textdatei.
Es gibt zwei Zahlen, die wichtig sind: die erste ist die **Kerntaktrate**, die direkt bestimmt, wie schnell die ARM-CPU läuft.
Die zweite ist **Überspannung**, die die Spannung bestimmt, die in die ARM-CPU eingespeist wird.
Höhere Geschwindigkeiten erfordern im Allgemeinen höhere Spannung, aber die CPU des Pi kann ziemlich viel zusätzliche Spannung ohne nennenswerte Schäden vertragen.
Sie könnte etwas schneller verschleißen, aber wir sprechen immer noch von Jahren und bis dahin wird der Pi 5 heraus sein, also kein wirklicher Schaden!

Vielmehr ist die eigentliche Sorge bei Überspannung, dass **höhere Spannungen zu höheren Temperaturen führen**.
Dieser Abschnitt hilft Ihnen zu sehen, wie heiß Ihr Pi unter schwerer Last wird, damit Sie ihn nicht zu weit treiben.

::: warning
Während das Übertakten auf den Ebenen, die wir tun werden, ziemlich sicher und zuverlässig ist, sind Sie der "Siliziumlotterie" ausgeliefert.
Jede CPU ist auf mikroskopische Weise leicht unterschiedlich, und einige von ihnen können einfach besser übertaktet werden als andere.
Wenn Sie zu weit/zu hart übertakten, kann Ihr System **instabil** werden.
Instabile Pis leiden unter allen möglichen Konsequenzen, von ständigen Neustarts bis zum vollständigen Einfrieren.
**Im schlimmsten Fall könnten Sie Ihre microSD-Karte beschädigen und alles von Grund auf neu installieren müssen!**

**Indem Sie der Anleitung hier folgen, müssen Sie die Tatsache akzeptieren, dass Sie dieses Risiko eingehen.**
Wenn das für Sie nicht lohnenswert ist, überspringen Sie den Rest dieses Abschnitts.
:::

## Benchmarking der Standardkonfiguration

Vor dem Übertakten sollten Sie profilieren, wozu Ihr Pi in seiner Standard-Konfiguration direkt aus dem Regal fähig ist.
Es gibt drei wichtige Dinge zu betrachten:

1. **Leistung** (wie schnell Ihr Pi Dinge berechnet)
2. **Temperatur** unter Last (wie heiß es wird)
3. **Stabilität** (wie lange es läuft, bevor es abstürzt)

Wir werden Statistiken zu allen dreien erhalten, während wir fortfahren.

### Leistung

Zur Messung der Leistung können Sie LINPACK verwenden.
Wir werden es aus dem Quellcode erstellen.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

Führen Sie es nun so aus:

```shell
linpack
Enter array size (q to quit) [200]:
```

Drücken Sie einfach `enter`, um es bei der Standardeinstellung von 200 zu belassen, und lassen Sie es laufen.
Wenn es fertig ist, sieht die Ausgabe so aus:

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

Was Sie betrachten müssen, ist die letzte Zeile in der Spalte `KFLOPS`.
Diese Zahl (1120277.186 im obigen Beispiel) repräsentiert Ihre Rechenleistung.
Sie bedeutet für sich allein nichts, aber sie gibt uns eine gute Basislinie, um die übertaktete Leistung damit zu vergleichen.
Nennen wir dies die **Standard-KFLOPS**.

### Temperatur

Als Nächstes belasten wir den Pi und beobachten seine Temperatur unter schwerer Last.
Installieren Sie zunächst dieses Paket, das ein Tool namens `vcgencmd` bereitstellt, das Details über den Pi ausgeben kann:

```shell
sudo apt install libraspberrypi-bin
```

Sobald dies installiert ist, starten Sie den Pi neu (dies ist erforderlich, damit einige neue Berechtigungen angewendet werden).
Installieren Sie als Nächstes ein Programm namens **stressberry**.
Dies wird unser Benchmarking-Tool sein.
Installieren Sie es so:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip HINWEIS
Wenn stressberry einen Fehler über das Nicht-Lesen-Können von Temperaturinformationen oder das Nicht-Öffnen-Können der `vchiq`-Instanz wirft, können Sie es mit dem folgenden Befehl beheben:

```shell
sudo usermod -aG video $USER
```

Melden Sie sich dann ab und wieder an, starten Sie Ihre SSH-Sitzung neu oder starten Sie die Maschine neu und versuchen Sie es erneut.
:::

Führen Sie es als Nächstes so aus:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Dies führt einen neuen Stresstest namens "Stock" für 300 Sekunden (5 Minuten) mit 60 Sekunden Abkühlzeit vor und nach dem Test auf allen 4 Kernen des Pi aus.
Sie können mit diesen Zeitangaben spielen, wenn Sie möchten, dass es länger läuft oder mehr Abkühlung hat, aber dies funktioniert für mich als schneller und schmutziger Stresstest.
Die Ergebnisse werden in einer Datei namens `stock.out` gespeichert.

Während der Hauptphase des Tests sieht die Ausgabe so aus:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Dies sagt Ihnen im Grunde, wie heiß der Pi wird.
Bei 85°C wird der Pi sich tatsächlich zu drosseln beginnen und die Taktrate senken, damit er nicht überhitzt.
Glücklicherweise sollten Sie wegen des Kühlkörpers und des Lüfters, die Sie hinzugefügt haben, nicht annähernd in diese Nähe kommen!
Davon abgesehen versuchen wir im Allgemeinen, die Temperaturen unter 65°C zu halten, um der allgemeinen Gesundheit des Systems willen.

Wenn Sie die Systemtemperatur während normaler Validierungsoperationen überwachen möchten, können Sie dies mit `vcgencmd` tun:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Stabilität

Das Testen der Stabilität einer Übertaktung beinhaltet die Beantwortung dieser drei Fragen:

- Schaltet sich der Pi ein und erreicht eine Login-Eingabeaufforderung/startet den SSH-Server?
- Friert er während normaler Operationen zufällig ein oder startet neu?
- Friert er während schwerer Last zufällig ein oder startet neu?

Damit eine Übertaktung wirklich stabil ist, müssen die Antworten **ja, nein und nein** lauten.
Es gibt einige Möglichkeiten, dies zu testen, aber am einfachsten ist es an diesem Punkt, einfach `stressberry` für eine wirklich lange Zeit laufen zu lassen.
Wie lange ist ganz Ihnen überlassen - je länger es läuft, desto sicherer können Sie sein, dass das System stabil ist.
Einige Leute führen einfach den 5-Minuten-Test oben aus und nennen das gut, wenn es überlebt; andere führen es für eine halbe Stunde aus; andere führen es für 8 Stunden oder sogar mehr aus.
Wie lange es ausgeführt werden soll, ist eine persönliche Entscheidung, die Sie basierend auf Ihrer eigenen Risikotoleranz treffen müssen.

Um die Laufzeit zu ändern, ändern Sie einfach den Parameter `-d` mit der Anzahl der Sekunden, die der Test laufen soll.
Wenn Sie beispielsweise entschieden haben, dass eine halbe Stunde der richtige Weg ist, könnten Sie `-d 1800` machen.

## Ihre erste Übertaktung - 1800 MHz (Leicht)

Die erste Übertaktung, die wir vornehmen werden, ist relativ "leicht" und zuverlässig, bietet aber dennoch einen schönen Leistungsschub.
Wir werden von den standardmäßigen 1500 MHz auf 1800 MHz gehen - eine Beschleunigung um 20%!

Öffnen Sie diese Datei:

```shell
sudo nano /boot/firmware/usercfg.txt
```

Fügen Sie diese beiden Zeilen am Ende hinzu:

```shell
arm_freq=1800
over_voltage=3
```

Speichern Sie dann die Datei und starten Sie neu.

Diese Einstellungen erhöhen die CPU-Taktrate um 20% und erhöhen auch die CPU-Spannung von 0,88V auf 0,93V (jede `over_voltage`-Einstellung erhöht sie um 0,025V).
Diese Einstellung sollte von jedem Pi 4B erreichbar sein, sodass Ihr System neu starten und in wenigen Augenblicken eine Login-Eingabeaufforderung oder SSH-Zugriff bereitstellen sollte.
Wenn nicht und Ihr Pi nicht mehr reagiert oder in eine Boot-Schleife eintritt, müssen Sie ihn zurücksetzen - lesen Sie dazu den nächsten Abschnitt.

### Zurücksetzen nach einer instabilen Übertaktung

Wenn Ihr Pi nicht mehr reagiert oder sich immer wieder neu startet, müssen Sie die Übertaktung senken.
Befolgen Sie dazu diese Schritte:

1. Schalten Sie den Pi aus.
2. Ziehen Sie die microSD-Karte heraus.
3. Stecken Sie die Karte mit einem microSD-Adapter in einen anderen Linux-Computer.
   \*HINWEIS: Dies **muss** ein anderer Linux-Computer sein. Es funktioniert nicht, wenn Sie sie in eine Windows-Maschine stecken, da Windows das `ext4`-Dateisystem, das die SD-Karte verwendet, nicht lesen kann!\*\*
4. Mounten Sie die Karte auf dem anderen Computer.
5. Öffnen Sie `<SD-Mountpunkt>/boot/firmware/usercfg.txt`.
6. Senken Sie den `arm_freq`-Wert oder erhöhen Sie den `over_voltage`-Wert. _HINWEIS: **gehen Sie nicht höher als over_voltage=6.** Höhere Werte werden von der Garantie des Pi nicht unterstützt und bergen das Risiko, die CPU schneller zu degradieren, als Ihnen vielleicht lieb ist._
7. Unmounten Sie die SD-Karte und entfernen Sie sie.
8. Stecken Sie die Karte wieder in den Pi und schalten Sie ihn ein.

Wenn der Pi funktioniert, großartig! Fahren Sie unten fort.
Wenn nicht, wiederholen Sie den gesamten Vorgang mit noch konservativeren Einstellungen.
Im schlimmsten Fall können Sie einfach die Zeilen `arm_freq` und `over_voltage` vollständig entfernen, um zu den Standardeinstellungen zurückzukehren.

### Testen von 1800 MHz

Sobald Sie angemeldet sind, führen Sie `linpack` erneut aus, um die neue Leistung zu testen.
Hier ist ein Beispiel von unserem Test-Pi:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

Holen Sie sich wieder die Spalte `KFLOPS` in der letzten Zeile.
Um sie mit der Standardkonfiguration zu vergleichen, teilen Sie einfach die beiden Zahlen:
`1337238.504 / 1120277.186 = 1.193668`

Gut! Das ist ein Leistungsschub von 19,4%, was zu erwarten ist, da wir 20% schneller laufen.
Jetzt überprüfen wir die Temperaturen mit den neuen Taktgeschwindigkeits- und Spannungseinstellungen:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Sie sollten Ausgaben wie diese sehen:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

Nicht schlecht, etwa 6° heißer als die Standardeinstellungen, aber immer noch weit unter der Schwelle, bei der wir persönlich aufhören würden.

Sie können hier einen längeren Stabilitätstest ausführen, wenn Sie sich wohlfühlen, oder Sie können fortfahren, um die Dinge noch höher zu treiben.

## Zu 2000 MHz gehen (Mittel)

Der nächste Meilenstein wird 2000 MHz sein. Dies stellt eine Taktratenerhöhung um 33,3% dar, was ziemlich signifikant ist.
Die meisten Leute betrachten dies als eine großartige Balance zwischen Leistung und Stabilität, sodass sie den Prozess hier stoppen.

Unsere Empfehlung für diese Stufe ist, mit diesen Einstellungen zu beginnen:

```shell
arm_freq=2000
over_voltage=5
```

Dies erhöht die Kernspannung auf 1,005V.
Probieren Sie dies mit den `linpack`- und `stressberry`-Tests aus.
Wenn es sie überlebt, sind Sie fertig. Wenn es einfriert oder zufällig neu startet, sollten Sie die Spannung erhöhen:

```shell
arm_freq=2000
over_voltage=6
```

Das setzt die Kernspannung auf 1,03V, was so hoch ist, wie Sie gehen können, bevor Sie die Garantie ungültig machen.
Das funktioniert normalerweise für die meisten Pis.
Wenn nicht, sollten Sie **Ihre Taktgeschwindigkeit senken und es erneut versuchen**, anstatt die Spannung weiter zu erhöhen.

Als Referenz sind hier die Zahlen von unserem 2000-Lauf:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

Das ist eine Beschleunigung um 32,3%, was mit dem übereinstimmt, was wir erwarten würden. Nicht schlecht!

Hier sind unsere Temperaturen:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

Eine Erhöhung um 7 weitere Grad, aber immer noch unter unserer Schwelle von 65°C.

## Zu 2100 MHz gehen (Schwer)

Der nächste Schritt stellt eine solide **Beschleunigung um 40%** gegenüber der Standardkonfiguration dar.

**HINWEIS: Nicht alle Pis sind in der Lage, dies zu tun, während sie bei `over_voltage=6` bleiben.
Versuchen Sie es, und wenn es kaputt geht, gehen Sie zurück zu 2000 MHz.**

Die Konfiguration sieht so aus:

```shell
arm_freq=2100
over_voltage=6
```

Als Referenz sind hier unsere Ergebnisse:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

Das ist eine Beschleunigung um 39,4%!

Hier sind unsere Temperaturen:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

Knapp unter 60°C, also gibt es viel Spielraum.

## Zu 2250 MHz gehen (Extrem)

Dies ist die Einstellung, mit der wir unsere Pis betreiben, die seit über einem Jahr zum Zeitpunkt dieses Schreibens stabil ist.
Dennoch wird **Benutzern davon abgeraten, so hoch zu übertakten** - stellen Sie sicher, dass Sie gründliche Stabilitätstests durchführen und viel thermischen Spielraum haben, bevor Sie versuchen, dies zur Produktionskonfiguration Ihres Node zu machen!

Unsere Konfiguration ist:

```shell
arm_freq=2250
over_voltage=10
```

Hier sind unsere Ergebnisse:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

Das ist 46% schneller als die Standardkonfiguration!

OV10 ist so weit, wie die Standard-Firmware den Pi gehen lässt, und 2250 MHz ist das Schnellste, das wir zuverlässig in der Produktion betreiben konnten.

Die Temperaturen im Stresstest werden so hoch:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Aber während der tatsächlichen Validierung neigen sie dazu, unter 60°C zu bleiben, was für uns akzeptabel ist.

## Nächste Schritte

Und damit ist Ihr Pi betriebsbereit und bereit, Rocket Pool zu betreiben!
Fahren Sie mit dem Abschnitt [Auswahl Ihrer ETH-Clients](../eth-clients) fort.
