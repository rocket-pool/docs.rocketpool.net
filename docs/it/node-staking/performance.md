# Monitoraggio delle Prestazioni del Tuo Nodo

Ora che il tuo nodo è attivo e funzionante e hai uno o più minipool collegati, dovrai tenere d'occhio tutto per assicurarti che funzioni senza intoppi.

Puoi monitorare la tua macchina in due modi:

1. Direttamente, accedendo alle metriche della macchina
2. Indirettamente, attraverso l'uso di strumenti di terze parti

Si consiglia di utilizzare una combinazione di entrambi a seconda delle tue esigenze.

## Monitoraggio Diretto dello Stato della Tua Macchina

Per quanto riguarda lo stato della tua macchina, ci sono alcune metriche utili che probabilmente vorrai tenere d'occhio:

- Utilizzo CPU
- RAM libera rimanente
- Utilizzo dello spazio swap (se l'hai abilitato)
- Spazio disco libero rimanente
- I/O di rete (se il tuo ISP impone un limite di dati)

::: tip NOTA
Le sezioni seguenti mostrano alcuni modi per monitorare le cose, ma richiedono che tu sia collegato al terminale della tua macchina.
C'è un metodo migliore, molto più comodo e molto più bello che utilizza una [dashboard web Grafana](./grafana.mdx) ma è ancora in fase di sviluppo.
Resta sintonizzato per il completamento di quella sezione!
:::

### CPU, RAM e Swap

I primi tre possono essere facilmente visualizzati con il programma `htop`.
Questo ti darà una bella vista in tempo reale delle risorse del tuo sistema, come mostrato da questo screenshot da un Raspberry Pi:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

Sul display superiore con le barre, le barre numerate si riferiscono ciascuna all'utilizzo corrente di un core della CPU.

`Mem` ti mostra quanta RAM stai attualmente utilizzando (in questo screenshot, 1.75 GB) e quanta ne hai in totale (3.70 GB).

`Swp` ti mostra quanto spazio swap stai usando (85.8 MB) e quanto ne hai in totale (12.0 GB).

Nella tabella in basso, ogni riga rappresenta un processo.
I tuoi client Execution e Consensus saranno probabilmente in alto (in questo caso, Geth e Nimbus) che puoi vedere nella colonna più a destra etichettata `Command`.

La colonna `RES` ti mostra quanta RAM sta usando ogni processo - in questo screenshot, Geth sta usando 748 MB e Nimbus sta usando 383 MB.

La colonna `CPU%` ti mostra quanta potenza CPU sta consumando ogni processo.
Il 100% rappresenta un singolo core, quindi se è oltre il 100%, significa che sta usando molto da più core (come Geth qui, con il 213%).

### Spazio Disco Libero Rimanente

Tenere d'occhio quanto spazio disco hai libero è facile da fare con il seguente comando:

```
df -h
```

Questo fornirà un output simile al seguente esempio:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Per le configurazioni convenzionali in cui hai un'unità che memorizza sia il tuo sistema operativo che i dati delle catene Execution e Consensus, devi solo guardare la voce che ha `/` nella colonna `Mounted on`.
Questo rappresenta il tuo disco principale.
Se sembra che stia esaurendo lo spazio (diciamo, l'80% utilizzato o giù di lì), allora devi iniziare a pensare di fare un po' di pulizia.
Ad esempio, se stai usando Geth, potresti voler guardare [come potarlo](./pruning) per liberare un po' di spazio.

Per le configurazioni che memorizzano i dati delle catene Execution e Consensus su un'unità separata, vorrai anche guardare la riga che ha la tua cartella dei dati della catena nella colonna `Mounted on`.
In questo esempio abbiamo montato un SSD esterno su `/mnt/rpdata`, quindi dovremo tenere d'occhio anche quello per assicurarci che non cresca troppo.

### I/O di Rete e Utilizzo dei Dati

Se vuoi monitorare quanto I/O di rete usa il tuo sistema nel tempo, puoi installare una bella utility chiamata `vnstat`.
Ecco un esempio di installazione su un sistema Ubuntu / Debian:

```shell
sudo apt install vnstat
```

Per eseguirlo, fai questo (supponendo che `eth0` sia il nome dell'interfaccia di rete che usi per la tua connessione Internet):

```
vnstat -i eth0
```

Questo non funzionerà subito perché ha bisogno di tempo per raccogliere dati sul tuo sistema, ma man mano che passano giorni e settimane, finirà per apparire così:

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

Questo ti permetterà di tenere sotto controllo il tuo utilizzo totale della rete, il che potrebbe essere utile se il tuo ISP impone un limite di dati.

Nota che la maggior parte dei sistemi moderni utilizza più comunemente altre interfacce di rete come eno0 ed enp0s31f6 e non eth0.
Se devi controllare la tua interfaccia di rete, esegui il seguente comando:

```shell
ls /sys/class/net
```

I dispositivi Ethernet (cablati) di solito iniziano con `e`, come negli esempi sopra.
I dispositivi wireless di solito iniziano con `w`.

## Notifiche di Allerta dello Smartnode

[Monitoraggio del tuo Stack Smartnode con Notifiche di Allerta](./maintenance/alerting.md) illustra l'utilizzo della funzionalità di notifica di allerta dello Smartnode per ricevere notifiche sulla salute e sugli eventi importanti del tuo Smartnode Rocket Pool.

## Monitoraggio delle Prestazioni di Terze Parti

Il miglior monitoraggio utilizza un modello "a fette di formaggio svizzero": ogni strumento ha dei buchi, ma se li impili uno sopra l'altro c'è meno possibilità che qualcosa cada attraverso e ti sorprenda.

Nota che questi strumenti di terze parti sono utilizzati dalla comunità Rocket Pool, ma non sono ufficialmente approvati o supportati dal team Rocket Pool.
Se hai un suggerimento per uno strumento, o sei il proprietario di uno strumento, sei molto benvenuto ad aggiungere una pull request con i dettagli sul tuo strumento.

### Sito Web Beaconcha.in: Utilizzo della Beacon Chain come Fonte di Metriche

Il sito web e l'app block explorer [Beaconcha.in](https://beaconcha.in) forniscono un modo per monitorare le prestazioni del tuo validator guardando la sua attività on-chain.
Hanno anche l'opzione di ricevere [notifiche via email](https://beaconcha.in/user/notifications) per eventi significativi come il downtime.
Naviga al loro sito e inserisci la chiave pubblica del tuo validator nella casella di ricerca in cima allo schermo.

::: tip
Se hai dimenticato la chiave pubblica del tuo validator, puoi recuperarla facilmente con il comando `rocketpool minipool status`.
:::

Se tutto è configurato correttamente, dovresti vedere qualcosa del genere:
![](./local/images/pi/Beaconchain.png)

::: tip NOTA
Il link sopra è per la versione **mainnet** di Beaconcha.in.
Se stai usando la Hoodi Testnet, usa [questo link invece](https://hoodi.beaconcha.in)!
:::

Questo è un registro di tutta l'attività della Beacon Chain per il tuo validator.
Puoi usarlo per controllare il saldo del tuo validator sulla Beacon Chain per vederlo crescere nel tempo e calcolare il tuo APY.

Puoi anche usarlo per valutare rapidamente se il tuo validator è vivo e funziona correttamente.
Se lo è, tutte le attestazioni dovrebbero dire `Attested` per il loro **Status**, e idealmente tutte le **Opt. Incl. Dist.** dovrebbero essere 0 (anche se un occasionale 1 o 2 va bene).

Se ci sono molti blocchi che dicono `Missed` su di essi, allora il tuo validator non sta funzionando correttamente.
Dovresti controllare i log dei servizi `eth1`, `eth2` e `validator` con `rocketpool service logs ...` se stai usando la modalità Docker o Hybrid (o gli script di log corrispondenti se stai usando la modalità Native) per cercare problemi.

**Dovresti fissare questa scheda o creare un segnalibro con essa così puoi passarci rapidamente e controllare lo stato del tuo validator.**

#### Utilizzo di Beaconcha.in per Monitorare Più Minipool

Beaconcha.in ha una [vista dashboard](https://beaconcha.in/dashboard) che ti permette di monitorare più validator o minipool contemporaneamente.
Aggiungi semplicemente i tuoi indici validator uno alla volta. Se hai molti minipool, puoi eseguire:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

per ottenere un elenco separato da virgole, e inserirlo nella barra URL così: `https://beaconcha.in/dashboard?validators=123456,123457`

### App Beaconcha.in: Panoramica Validator e Notifiche Push

Il sito web Beaconcha.in è un ottimo modo per visualizzare le metriche e impostare avvisi via email.
La loro app mobile ha una natura più "a colpo d'occhio".
Include anche un servizio di notifiche push che include alcuni avvisi utili come:

1. Notifiche di problemi come attestazioni mancate
2. Notifiche dei round di ricompense Rocket Pool
3. Sovra/sotto-collateralizzazione dell'RPL sul tuo nodo

Nota che l'app ha una versione gratuita e opzioni a pagamento con funzionalità di convenienza come widget della schermata principale.

### Rinominare i tuoi Validator su Beaconcha.in

Il sito web Beaconcha.in ha una funzionalità che permette agli utenti di rinominare i loro validator, rendendoli più facili da identificare/cercare.

Per poter utilizzare questa funzionalità devi firmare un messaggio usando la chiave privata del wallet del tuo nodo, per provare che sei la persona che controlla quel validator.

Lo Smartnode v1.5.1 include la possibilità di firmare messaggi con la chiave privata del wallet del tuo nodo usando il comando `rocketpool node sign-message`, quindi fornendo il messaggio che vuoi firmare.
Deve contenere il termine 'beaconcha.in' per essere usato per rinominare i tuoi validator.

![](../node-staking/images/sign-message.png)

Apri la pagina del tuo validator su Beaconcha.in e clicca sul pulsante `Edit validator name`.

![](../node-staking/images/edit-validator-name.png)

Copia il risultato dal comando sign-message e incollalo nel campo "Signature".
Inserisci il tuo nickname desiderato e clicca sul pulsante `Save changes`.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: Scansione delle Porte per l'Uptime

Il servizio [Uptimerobot](https://uptimerobot.com/) è un servizio semplice che scansiona un indirizzo IP per una porta aperta.
Se la tua macchina diventa non disponibile sulla porta che hai specificato, Uptimerobot può inviarti una notifica che c'è un problema.
Il servizio offre un'ampia varietà di opzioni di notifica tra cui email, notifica push, SMS, chiamata telefonica e webhook.

La schermata di configurazione appare così:

![](./local/images/uptimerobot.png)

L'IP da monitorare è l'IP esterno del tuo nodo, che puoi trovare accedendo al tuo nodo tramite `ssh` o fisicamente, e aprendo [icanhazip.com](https://icanhazip.com/) in un browser o eseguendo il seguente comando nel tuo terminale:

```shell
curl icanhazip.com
```

La porta da monitorare dipende dalla configurazione del tuo nodo; gli utenti che eseguono l'installazione tipica dello Smartnode avranno probabilmente inoltrato le porte 30303 e 9001 rispettivamente per i client Execution e Consensus, quindi queste sono buone scelte per il monitoraggio dell'uptime.

### Dashboard Metriche Rocketpool

Ci sono diverse iniziative guidate dalla comunità per fornire una panoramica delle prestazioni del tuo nodo, così come della rete Rocket Pool nel suo complesso.

### Scripting con Pushover (avanzato)

::: tip NOTA
[Monitoraggio del tuo Stack Smartnode con Notifiche di Allerta](./maintenance/alerting.md) illustra l'utilizzo della funzionalità di notifica di allerta dello Smartnode che include una notifica quando sono disponibili aggiornamenti per il tuo nodo.
:::

Il servizio [Pushover](https://pushover.net/) ti permette di inviare a te stesso notifiche push.

::: warning NOTA
Questa è un'attività avanzata da intraprendere.
Può essere utile se hai familiarità con lo scripting shell, ma non è consigliata se non ti senti a tuo agio in un ambiente shell.
:::

Per iniziare con Pushover:

1. Crea un account su [pushover.net](https://pushover.net/)
1. [Crea un token API](https://pushover.net/apps/build)
1. Installa l'app mobile Pushover e/o l'estensione del browser
1. Chiama l'API Pushover per qualsiasi azione che ti interessa

Chiamare l'API Pushover per inviarti una notifica push viene fatto attraverso una chiamata `curl` strutturata così:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Esempio: Notifica Push sugli Aggiornamenti Disponibili

Se configuri gli aggiornamenti automatici usando i pacchetti `unattended-upgrades` e `update-nofifier`, potresti voler ricevere una notifica push quando sono disponibili aggiornamenti per il tuo nodo.
Un modo potenziale per farlo è creare uno script in `~/update-notifier.sh` e attivarlo quotidianamente alle 9:00 usando `crontab`.

Per farlo, prima crea lo script eseguendo:

```shell
nano ~/update-notifier.sh
```

Quindi incolla il seguente script:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

Successivamente, esegui il seguente comando per contrassegnare lo script come eseguibile:

```shell
chmod u+x ~/update-notifier.sh
```

Ora esegui il seguente comando per aprire il tuo crontab:

```shell
crontab -e
```

Quindi usa i tasti freccia per scorrere verso il basso e aggiungi la riga `* 9 * * * ~/update-notifier.sh` in modo che il file appaia così:

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

Quindi premi `control+x` per uscire e premi `Y` quando ti viene chiesto se vuoi salvare le modifiche.

Dovresti ora ricevere una notifica alle 09:00 ora locale se hai aggiornamenti.
Puoi eseguire manualmente lo script digitando questo nel tuo terminale:

```shell
~/update-notifier.sh
```

#### Esempio: Ricevi Notifica quando si Attiva il tuo Daemon APC UPS

Alcuni staker domestici stanno usando un gruppo di continuità con l'utility `apcupsd` per assicurarsi che il loro nodo si spenga correttamente se va via la corrente.

L'utility `apcupsd` usa lo script `apccontrol` per gestire la sua logica, quindi è possibile monitorare l'attività di questo daemon modificando il file `/etc/apcupsd/apccontrol`.
Per farlo, esegui:

```shell
sudo nano /etc/apcupsd/apccontrol
```

Quindi in cima alla riga aggiungi il seguente codice in modo che il file appaia così:

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

Questo ti invierà una notifica push ogni volta che il tuo daemon UPS compie un'azione, inclusa la funzionalità periodica di "auto-test".
