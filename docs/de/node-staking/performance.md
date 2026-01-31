# Überwachung der Leistung Ihres Nodes

Jetzt, da Ihr Node läuft und Sie einen oder mehrere Minipools angeschlossen haben, müssen Sie alles im Auge behalten, um sicherzustellen, dass es reibungslos funktioniert.

Sie können Ihre Maschine auf zwei Arten verfolgen:

1. Direkt durch Zugriff auf Ihre Maschinenmetriken
2. Indirekt durch die Verwendung von Drittanbieter-Tools

Es wird empfohlen, je nach Ihren Bedürfnissen eine Kombination aus beidem zu verwenden.

## Direkte Verfolgung des Maschinenstatus

In Bezug auf den Status Ihrer Maschine gibt es einige nützliche Metriken, die Sie wahrscheinlich im Auge behalten möchten:

- CPU-Auslastung
- Verbleibender freier RAM
- Swap-Space-Nutzung (falls aktiviert)
- Verbleibender freier Speicherplatz
- Netzwerk-I/O (wenn Ihr ISP eine Datenobergrenze hat)

::: tip HINWEIS
Die folgenden Abschnitte zeigen Ihnen einige Möglichkeiten zur Überwachung, erfordern jedoch, dass Sie im Terminal Ihrer Maschine angemeldet sind.
Es gibt eine bessere, viel bequemere und viel schöner aussehende Methode, die ein [Grafana-Web-Dashboard](./grafana.mdx) verwendet, aber es befindet sich noch in der Entwicklung.
Bleiben Sie dran für die Fertigstellung dieses Abschnitts!
:::

### CPU, RAM und Swap

Die ersten drei können mit dem Programm `htop` einfach angezeigt werden.
Dies gibt Ihnen eine schöne Live-Ansicht Ihrer Systemressourcen, wie dieser Screenshot von einem Raspberry Pi zeigt:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

Auf der oberen Anzeige mit den Balken bezieht sich jeder nummerierte Balken auf die aktuelle Auslastung eines CPU-Kerns.

`Mem` zeigt Ihnen, wie viel RAM Sie derzeit verwenden (in diesem Screenshot 1,75 GB) und wie viel Sie insgesamt haben (3,70 GB).

`Swp` zeigt Ihnen, wie viel Swap-Space Sie verwenden (85,8 MB) und wie viel Sie insgesamt haben (12,0 GB).

In der unteren Tabelle stellt jede Zeile einen Prozess dar.
Ihre Execution- und Consensus-Clients werden wahrscheinlich ganz oben sein (in diesem Fall Geth und Nimbus), die Sie in der ganz rechten Spalte mit der Bezeichnung `Command` sehen können.

Die Spalte `RES` zeigt Ihnen, wie viel RAM jeder Prozess verbraucht - in diesem Screenshot verbraucht Geth 748 MB und Nimbus 383 MB.

Die Spalte `CPU%` zeigt Ihnen, wie viel CPU-Leistung jeder Prozess verbraucht.
100% repräsentiert einen einzelnen Kern, wenn es also über 100% liegt, bedeutet das, dass es viel von mehreren Kernen verwendet (wie Geth hier mit 213%).

### Verbleibender freier Speicherplatz

Die Überwachung des verfügbaren Speicherplatzes ist mit folgendem Befehl einfach:

```
df -h
```

Dies liefert eine Ausgabe ähnlich dem folgenden Beispiel:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Bei herkömmlichen Setups, bei denen Sie eine Festplatte haben, die sowohl Ihr Betriebssystem als auch Ihre Execution- und Consensus-Chain-Daten speichert, müssen Sie nur den Eintrag betrachten, der `/` in der Spalte `Mounted on` hat.
Dies repräsentiert Ihre Hauptfestplatte.
Wenn es jemals so aussieht, als würde der Speicherplatz knapp (sagen wir etwa 80% belegt oder so), dann müssen Sie anfangen, über eine Bereinigung nachzudenken.
Wenn Sie zum Beispiel Geth verwenden, möchten Sie sich vielleicht ansehen, [wie man es pruned](./pruning), um etwas Platz freizugeben.

Bei Setups, die die Execution- und Consensus-Chain-Daten auf einer separaten Festplatte speichern, sollten Sie auch die Zeile betrachten, die Ihren Chain-Daten-Ordner in der Spalte `Mounted on` hat.
In diesem Beispiel haben wir eine externe SSD an `/mnt/rpdata` gemountet, also müssen wir sie im Auge behalten, um sicherzustellen, dass sie nicht zu groß wird.

### Netzwerk-I/O und Datennutzung

Wenn Sie verfolgen möchten, wie viel Netzwerk-I/O Ihr System im Laufe der Zeit verwendet, können Sie ein nettes Dienstprogramm namens `vnstat` installieren.
Hier ist ein Beispiel für die Installation auf einem Ubuntu/Debian-System:

```shell
sudo apt install vnstat
```

Um es auszuführen, machen Sie Folgendes (unter der Annahme, dass `eth0` der Name der Netzwerkschnittstelle ist, die Sie für Ihre Internetverbindung verwenden):

```
vnstat -i eth0
```

Dies funktioniert nicht sofort, da es Zeit benötigt, um Daten über Ihr System zu sammeln, aber im Laufe der Tage und Wochen wird es am Ende so aussehen:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

Dies ermöglicht es Ihnen, Ihre gesamte Netzwerknutzung im Auge zu behalten, was hilfreich sein kann, wenn Ihr ISP eine Datenobergrenze auferlegt.

Beachten Sie, dass die meisten modernen Systeme häufiger andere Netzwerkschnittstellen wie eno0 und enp0s31f6 verwenden und nicht eth0.
Wenn Sie Ihre Netzwerkschnittstelle überprüfen müssen, führen Sie folgenden Befehl aus:

```shell
ls /sys/class/net
```

Ethernet-(Kabel-)Geräte beginnen normalerweise mit `e`, wie die obigen Beispiele.
Wireless-Geräte beginnen normalerweise mit `w`.

## Smartnode-Alarmbenachrichtigungen

[Überwachung Ihres Smartnode-Stacks mit Alarmbenachrichtigungen](./maintenance/alerting.md) führt Sie durch die Verwendung der Smartnode-Alarmbenachrichtigungsfunktion, um Benachrichtigungen über die Gesundheit und wichtige Ereignisse Ihres Rocket Pool Smartnode zu erhalten.

## Drittanbieter-Leistungsüberwachung

Die beste Überwachung verwendet ein Schweizer-Käse-Modell: Jedes Tool hat Löcher, aber wenn Sie sie übereinanderstapeln, ist die Wahrscheinlichkeit geringer, dass etwas durchfällt und Sie überrascht.

Bitte beachten Sie, dass diese Drittanbieter-Tools von der Rocket Pool-Community verwendet werden, aber nicht offiziell vom Rocket Pool-Team unterstützt oder empfohlen werden.
Wenn Sie einen Tool-Vorschlag haben oder ein Tool-Besitzer sind, sind Sie herzlich eingeladen, einen Pull-Request mit Details zu Ihrem Tool einzureichen.

### Beaconcha.in-Website: Verwendung der Beacon Chain als Metrikquelle

Die [Beaconcha.in](https://beaconcha.in)-Blockexplorer-Website und -App bieten eine Möglichkeit, die Leistung Ihres Validators zu verfolgen, indem Sie seine On-Chain-Aktivität betrachten.
Sie haben auch die Option, [E-Mail-Benachrichtigungen](https://beaconcha.in/user/notifications) für wichtige Ereignisse wie Ausfallzeiten zu erhalten.
Navigieren Sie zu ihrer Website und geben Sie den öffentlichen Schlüssel Ihres Validators in das Suchfeld oben auf dem Bildschirm ein.

::: tip
Wenn Sie den öffentlichen Schlüssel Ihres Validators vergessen haben, können Sie ihn einfach mit dem Befehl `rocketpool minipool status` abrufen.
:::

Wenn alles richtig eingerichtet ist, sollten Sie so etwas sehen:
![](./local/images/pi/Beaconchain.png)

::: tip HINWEIS
Der obige Link ist für die **Mainnet**-Version von Beaconcha.in.
Wenn Sie auf dem Hoodi Testnet laufen, verwenden Sie [diesen Link stattdessen](https://hoodi.beaconcha.in)!
:::

Dies ist eine Aufzeichnung aller Beacon Chain-Aktivitäten für Ihren Validator.
Sie können es verwenden, um das Guthaben Ihres Validators auf der Beacon Chain zu überprüfen, es im Laufe der Zeit wachsen zu sehen und Ihre APY zu berechnen.

Sie können es auch verwenden, um schnell zu beurteilen, ob Ihr Validator aktiv ist und korrekt läuft.
Wenn dies der Fall ist, sollten alle Attestierungen `Attested` für ihren **Status** anzeigen, und idealerweise sollte der gesamte **Opt. Incl. Dist.** 0 sein (obwohl gelegentlich 1 oder 2 in Ordnung sind).

Wenn es viele Blöcke gibt, auf denen `Missed` steht, dann funktioniert Ihr Validator nicht ordnungsgemäß.
Sie sollten die Logs der `eth1`-, `eth2`- und `validator`-Dienste mit `rocketpool service logs ...` überprüfen, wenn Sie den Docker- oder Hybrid-Modus verwenden (oder die entsprechenden Log-Skripte, wenn Sie den Native-Modus verwenden), um nach Problemen zu suchen.

**Sie sollten diesen Tab anheften oder ein Lesezeichen erstellen, damit Sie schnell darauf zugreifen und den Status Ihres Validators überprüfen können.**

#### Verwendung von Beaconcha.in zur Überwachung mehrerer Minipools

Beaconcha.in hat eine [Dashboard-Ansicht](https://beaconcha.in/dashboard), mit der Sie mehrere Validators oder Minipools gleichzeitig überwachen können.
Fügen Sie einfach Ihre Validator-Indizes einzeln hinzu. Wenn Sie viele Minipools haben, können Sie ausführen:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

um eine durch Kommas getrennte Liste zu erhalten und sie in die URL-Leiste wie folgt einzufügen: `https://beaconcha.in/dashboard?validators=123456,123457`

### Beaconcha.in-App: Validator-Übersicht und Push-Benachrichtigungen

Die Beaconcha.in-Website ist eine großartige Möglichkeit, Metriken anzuzeigen und E-Mail-Benachrichtigungen einzurichten.
Ihre mobile App hat eine eher "auf einen Blick"-Natur.
Sie bietet auch einen Push-Benachrichtigungsdienst, der einige nützliche Warnungen enthält wie:

1. Benachrichtigungen über Probleme wie verpasste Attestierungen
2. Benachrichtigungen über Rocket Pool-Belohnungsrunden
3. Über-/Unterbesicherung des RPL auf Ihrem Node

Beachten Sie, dass die App eine kostenlose Version und kostenpflichtige Optionen mit praktischen Funktionen wie Homescreen-Widgets hat.

### Umbenennen Ihrer Validators auf Beaconcha.in

Die Beaconcha.in-Website hat eine Funktion, mit der Benutzer ihre Validators umbenennen können, um sie leichter zu identifizieren/zu suchen.

Um diese Funktion nutzen zu können, müssen Sie eine Nachricht mit dem privaten Schlüssel Ihrer Node-Wallet signieren, um zu beweisen, dass Sie die Person sind, die diesen Validator kontrolliert.

Der Smartnode v1.5.1 enthält die Möglichkeit, Nachrichten mit dem privaten Schlüssel Ihrer Node-Wallet zu signieren, indem Sie den Befehl `rocketpool node sign-message` verwenden und dann die Nachricht angeben, die Sie signieren möchten.
Sie muss den Begriff 'beaconcha.in' enthalten, um zum Umbenennen Ihrer Validators verwendet zu werden.

![](../node-staking/images/sign-message.png)

Öffnen Sie Ihre Validator-Seite auf Beaconcha.in und klicken Sie auf die Schaltfläche `Edit validator name`.

![](../node-staking/images/edit-validator-name.png)

Kopieren Sie das Ergebnis des sign-message-Befehls und fügen Sie es in das Feld "Signature" ein.
Geben Sie Ihren gewünschten Spitznamen ein und klicken Sie auf die Schaltfläche `Save changes`.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: Port-Scanning für Uptime

Der [Uptimerobot](https://uptimerobot.com/)-Dienst ist ein einfacher Dienst, der eine IP-Adresse auf einen offenen Port scannt.
Wenn Ihre Maschine auf dem von Ihnen angegebenen Port nicht verfügbar wird, kann Uptimerobot Ihnen eine Benachrichtigung senden, dass es ein Problem gibt.
Der Dienst verfügt über eine breite Palette von Benachrichtigungsoptionen, einschließlich E-Mail, Push-Benachrichtigung, SMS, Telefonanruf und Webhooks.

Der Einrichtungsbildschirm sieht etwa so aus:

![](./local/images/uptimerobot.png)

Die zu überwachende IP ist die externe IP Ihres Nodes, die Sie finden können, indem Sie sich per `ssh` bei Ihrem Node anmelden oder physisch anmelden und [icanhazip.com](https://icanhazip.com/) in einem Browser öffnen oder den folgenden Befehl in Ihrem Terminal ausführen:

```shell
curl icanhazip.com
```

Der zu überwachende Port hängt von Ihrem Node-Setup ab; Benutzer, die die typische Smartnode-Installation ausführen, haben wahrscheinlich die Ports 30303 und 9001 für die Execution- bzw. Consensus-Clients weitergeleitet, daher sind dies gute Optionen für die Uptime-Überwachung.

### Rocketpool Metrics Dashboards

Es gibt mehrere von der Community geführte Initiativen, um einen Überblick über Ihre Node-Leistung sowie das Rocket Pool-Netzwerk als Ganzes zu bieten.

### Skripting mit Pushover (erweitert)

::: tip HINWEIS
[Überwachung Ihres Smartnode-Stacks mit Alarmbenachrichtigungen](./maintenance/alerting.md) führt Sie durch die Verwendung der Smartnode-Alarmbenachrichtigungsfunktion, die eine Benachrichtigung enthält, wenn Updates für Ihren Node verfügbar sind.
:::

Der [Pushover](https://pushover.net/)-Dienst ermöglicht es Ihnen, sich selbst Push-Benachrichtigungen zu senden.

::: warning HINWEIS
Dies ist eine fortgeschrittene Aktivität.
Es kann hilfreich sein, wenn Sie mit Shell-Skripting vertraut sind, wird aber nicht empfohlen, wenn Sie sich in einer Shell-Umgebung nicht wohl fühlen.
:::

Um mit Pushover zu beginnen:

1. Erstellen Sie ein Konto bei [pushover.net](https://pushover.net/)
1. [Erstellen Sie ein API-Token](https://pushover.net/apps/build)
1. Installieren Sie die Pushover-Mobile-App und/oder Browser-Erweiterung
1. Rufen Sie die Pushover-API für jede Aktion auf, die Sie interessiert

Der Aufruf der Pushover-API zum Senden einer Push-Benachrichtigung erfolgt über einen `curl`-Aufruf, der wie folgt strukturiert ist:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Beispiel: Push-Benachrichtigung bei verfügbaren Updates

Wenn Sie automatische Updates mit den Paketen `unattended-upgrades` und `update-nofifier` einrichten, möchten Sie möglicherweise eine Push-Benachrichtigung erhalten, wenn Updates für Ihren Node verfügbar sind.
Eine mögliche Vorgehensweise besteht darin, ein Skript in `~/update-notifier.sh` zu erstellen und es täglich um 9:00 Uhr mit `crontab` auszulösen.

Erstellen Sie dazu zunächst das Skript, indem Sie Folgendes ausführen:

```shell
nano ~/update-notifier.sh
```

Fügen Sie dann das folgende Skript ein:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

Führen Sie als Nächstes den folgenden Befehl aus, um das Skript als ausführbar zu markieren:

```shell
chmod u+x ~/update-notifier.sh
```

Führen Sie nun den folgenden Befehl aus, um Ihren crontab zu öffnen:

```shell
crontab -e
```

Verwenden Sie dann die Pfeiltasten, um nach unten zu scrollen, und fügen Sie die Zeile `* 9 * * * ~/update-notifier.sh` hinzu, sodass die Datei so aussieht:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

Drücken Sie dann `control+x`, um zu beenden, und drücken Sie `Y`, wenn Sie gefragt werden, ob Sie Ihre Änderungen speichern möchten.

Sie sollten nun um 09:00 Uhr Ortszeit eine Benachrichtigung erhalten, wenn Sie Updates haben.
Sie können das Skript manuell ausführen, indem Sie dies in Ihr Terminal eingeben:

```shell
~/update-notifier.sh
```

#### Beispiel: Benachrichtigung erhalten, wenn Ihr APC UPS Daemon aktiviert wird

Einige Home-Staker verwenden eine unterbrechungsfreie Stromversorgung mit dem `apcupsd`-Dienstprogramm, um sicherzustellen, dass ihr Node ordnungsgemäß herunterfährt, wenn der Strom ausfällt.

Das `apcupsd`-Dienstprogramm verwendet das `apccontrol`-Skript zur Verwaltung seiner Logik, daher ist es möglich, die Aktivität dieses Daemons zu überwachen, indem Sie die Datei `/etc/apcupsd/apccontrol` bearbeiten.
Um dies zu tun, führen Sie aus:

```shell
sudo nano /etc/apcupsd/apccontrol
```

Fügen Sie dann am Anfang der Zeile den folgenden Code hinzu, sodass die Datei so aussieht:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

Dies sendet Ihnen eine Push-Benachrichtigung, wann immer Ihr UPS-Daemon Maßnahmen ergreift, einschließlich periodischer "Selbsttest"-Funktionalität.
