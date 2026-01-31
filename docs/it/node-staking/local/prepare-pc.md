# Preparazione di un PC, Mini-PC o NUC

Prima di installare Rocket Pool, ci sono alcuni controlli che dovresti fare per assicurarti che il tuo sistema sia compatibile e funzioni correttamente.

::: danger
Ti incoraggiamo vivamente a creare una macchina dedicata per l'esecuzione di un nodo Rocket Pool.
L'esecuzione di un nodo su una macchina di uso generale, come il tuo desktop di lavoro quotidiano o un rig da gaming, presenta rischi di sicurezza extra che potrebbero compromettere il tuo wallet e risultare nel furto delle tue monete.

**Per la massima sicurezza, costruisci una nuova macchina dedicata esclusivamente all'esecuzione di un nodo.**
:::

## Requisiti di Sistema

Di seguito è riportata una breve descrizione dei requisiti software e hardware che un nodo Rocket Pool richiede.
Questa guida presuppone che tu abbia già la tua macchina fisicamente costruita e il sistema operativo installato.

### Sistemi Operativi Supportati

Il client Smartnode di Rocket Pool supporta attualmente i sistemi **Linux** e **macOS**.

Al momento, **Windows** può essere utilizzato per gestire remotamente una macchina Linux o Mac remota, ma lo Smartnode stesso non può attualmente essere eseguito su un sistema Windows. Tuttavia, Rocket Pool _può_ essere eseguito su una [macchina virtuale](https://en.wikipedia.org/wiki/System_virtual_machine) Linux ospitata da una macchina Windows.
Questa configurazione non è consigliata rispetto alla semplice installazione di Linux come sistema operativo host, ma funziona se necessario.
Nota che richiederà overhead di risorse extra e viene fornito con i propri rischi di sicurezza, quindi sconsigliamo di utilizzare questa configurazione quando si fa staking di Ether reale sulla rete principale.

Rocket Pool è nativamente compatibile con le architetture CPU **AMD64 (x64)** e **arm64 (aarch64)**.
Per altre architetture, dovrai compilare i client smartnode dal codice sorgente.

Nota che l'utente deve avere accesso **root / Amministratore** (o privilegi **sudo**) per installare lo Smartnode.

#### Supporto Linux

Ci sono molte varianti del sistema operativo Linux (chiamate distribuzioni, o **distro** in breve). Sebbene tu possa eseguire Rocket Pool da qualsiasi distro moderna, l'installer di Rocket Pool può installare automaticamente l'intero stack su [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/), e [Fedora](https://docs.fedoraproject.org/en-US/project/).

::: warning NOTA
Se prevedi di utilizzare Ubuntu, ti consigliamo vivamente di utilizzare una versione **LTS** come la 24.04.
Queste versioni sono attivamente mantenute per periodi di tempo più lunghi, il che aiuta con la sicurezza e la stabilità del tuo nodo.
:::

Per l'installazione su altre distro, l'installer Smartnode non sarà in grado di installare automaticamente alcune dipendenze di sistema (come `docker-compose`).
Saranno necessari alcuni passaggi manuali durante l'installazione.

Per i sistemi `arm64`, l'installer Smartnode supporta nativamente solo Debian e distro basate su Debian come Ubuntu.
Per altre distro, saranno necessari passaggi manuali durante l'installazione.

## Installazione del Sistema Operativo

Se stai utilizzando macOS, è molto probabile che tu abbia già il sistema operativo installato e puoi saltare questo passaggio.

Se stai installando Linux da zero, ciascuna delle distribuzioni elencate sopra viene fornita con tutorial utili e dettagliati per l'installazione del sistema operativo da zero.
Come esempio, tuttavia, ti guideremo attraverso il processo di installazione e preparazione di **Debian Server**.
Debian è una buona scelta per il funzionamento del nodo perché si concentra su **massima stabilità e affidabilità** - entrambe altamente desiderabili per macchine nodo che devono essere in esecuzione 24/7.

[Ecco una buona guida passo-passo](https://itslinuxfoss.com/debian-11-bullseye-guide/) con screenshot che ti mostra come installare Debian sulla tua macchina nodo da zero.

:::tip
Abbiamo alcuni utili emendamenti alla guida collegata sopra, che potresti voler seguire:

- Quando viene richiesto di impostare una **password di root**, consigliamo di lasciarla **vuota**. Questo disabiliterà l'account `root` e installerà invece il pacchetto `sudo`, consentendo al tuo utente di eseguire operazioni root reinserendo la sua password per elevare i suoi permessi. Questo è analogo al modo in cui è configurato Ubuntu Linux, che potrebbe essere più familiare agli utenti.
- Nella schermata **Selezione software** verso la fine, potresti non voler avere una GUI desktop installata.
  - Le GUI desktop sono in gran parte non necessarie per un nodo; aggiungono overhead extra e la maggior parte delle volte non verranno utilizzate poiché lo controllerai comunque remotamente tramite terminale, quindi preferiamo **deselezionare GNOME e l'ambiente desktop Debian** qui.
  - Se _vuoi_ un'interfaccia utente desktop sul tuo nodo, ti consigliamo di **deselezionare GNOME e selezionare XFCE** invece, poiché è più leggera sulle risorse di sistema. Consigliamo anche di non eseguire software aggiuntivo sul nodo, come browser o Discord, poiché diminuiscono la sicurezza e consumano risorse di sistema.
  - Deseleziona **server web**, ma lascia **server SSH** e **utilità di sistema standard** selezionati.
- Se hai creato un'unità flash da un iso, potresti dover disabilitare il repository CD-ROM per eseguire `apt`.
  Puoi trovare una spiegazione su come farlo [qui](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/).
- Il tuo sistema potrebbe essere configurato per andare in sospensione/ibernazione per impostazione predefinita. Per disabilitare queste impostazioni, puoi eseguire il seguente comando:
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### Installazione di `sudo`

L'installer di Rocket Pool richiede il programma `sudo` per acquisire tutte le sue dipendenze.
Se hai lasciato **vuota la password dell'utente root** nel passaggio precedente, avrai già questo.
In caso contrario, installalo ora eseguendo i seguenti comandi:

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Quindi riavvia la macchina.
Ora dovresti essere in grado di eseguire comandi tramite `sudo` come `sudo apt update`.

### Utilizzo di SSH

Una volta installato il server e sei in grado di accedere, devi ottenere il suo indirizzo IP.
Un modo semplice per farlo è con `ifconfig` che è integrato nel pacchetto 'net-tools':

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Potresti vedere diverse voci qui, ma quella che vuoi cercare sarà simile a questa:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

I flag dovrebbero dire `UP,BROADCAST,RUNNING,MULTICAST`.
Il valore `inet` (qui `192.168.1.8`) è l'indirizzo IP locale della tua macchina.

Successivamente, installa SSH:

```shell
sudo apt install openssh-server
```

:::tip NOTA
Se avevi la casella **server SSH** selezionata durante l'installazione di Debian, dovresti già avere questo installato quindi questo comando non farà nulla.
:::

Una volta fatto questo, puoi accedere al terminale della macchina remotamente dal tuo laptop o desktop usando `ssh`.

Se non hai familiarità con `ssh`, dai un'occhiata alla guida [Introduzione a Secure Shell](../ssh).

:::warning NOTA
A questo punto, dovresti _fortemente considerare_ di configurare il tuo router per rendere l'indirizzo IP del tuo nodo **statico**.
Questo significa che il tuo nodo avrà sempre lo stesso indirizzo IP, così potrai sempre accedere tramite SSH usando quell'indirizzo IP.
Altrimenti, è possibile che l'IP del tuo nodo cambi ad un certo punto e il comando SSH sopra non funzionerà più.
Dovrai entrare nella configurazione del tuo router per scoprire qual è il nuovo indirizzo IP del tuo nodo.

Ogni router è diverso, quindi dovrai consultare la documentazione del tuo router per imparare come assegnare un indirizzo IP statico.
:::

## Configurazione dello Spazio Swap

Nella maggior parte dei casi, se scegli attentamente i tuoi client Execution e Consensus e il tipo di istanza, non dovresti rimanere senza RAM.
D'altra parte, non fa mai male aggiungerne un po' di più.
Quello che faremo ora è aggiungere quello che viene chiamato **spazio swap**.
Essenzialmente, significa che useremo l'SSD come "RAM di backup" nel caso qualcosa vada terribilmente, terribilmente male e il tuo server finisca la RAM normale.
L'SSD non è quasi veloce quanto la RAM normale, quindi se raggiunge lo spazio swap rallenterà le cose, ma non si bloccherà completamente e romperà tutto.
Pensa a questo come un'assicurazione extra che (molto probabilmente) non avrai mai bisogno.

### Creazione di un File Swap

Il primo passo è creare un nuovo file che fungerà da spazio swap.
Decidi quanto vuoi utilizzare - un inizio ragionevole sarebbe 8 GB, così hai 8 GB di RAM normale e 8 GB di "RAM di backup" per un totale di 16 GB.
Per essere super sicuri, puoi farlo da 24 GB così il tuo sistema ha 8 GB di RAM normale e 24 GB di "RAM di backup" per un totale di 32 GB, ma questo è probabilmente eccessivo.
Fortunatamente, poiché il tuo SSD ha 1 o 2 TB di spazio, allocare da 8 a 24 GB per un file swap è trascurabile.

Per il bene di questa guida, scegliamo una via di mezzo - diciamo, 16 GB di spazio swap per una RAM totale di 24 GB.
Sostituisci semplicemente qualsiasi numero tu voglia man mano che andiamo avanti.

Inserisci questo, che creerà un nuovo file chiamato `/swapfile` e lo riempirà con 16 GB di zeri.
Per cambiare la quantità, cambia semplicemente il numero in `count=16` con quello che vuoi. **Nota che questo richiederà molto tempo, ma va bene.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

Successivamente, imposta i permessi in modo che solo l'utente root possa leggere o scrivere su di esso (per sicurezza):

```shell
sudo chmod 600 /swapfile
```

Ora, contrassegnalo come file swap:

```shell
sudo mkswap /swapfile
```

Successivamente, abilitalo:

```shell
sudo swapon /swapfile
```

Infine, aggiungilo alla tabella di mount in modo che si carichi automaticamente quando il tuo server si riavvia:

```shell
sudo nano /etc/fstab
```

Aggiungi una nuova riga alla fine che assomigli a questa:

```
/swapfile                            none            swap    sw              0       0
```

Premi `Ctrl+O` ed `Enter` per salvare, poi `Ctrl+X` ed `Enter` per uscire.

Per verificare che sia attivo, esegui questi comandi:

```shell
sudo apt install htop
htop
```

Il tuo output dovrebbe assomigliare a questo in alto:
![](../local/images/pi/Swap.png)

Se il secondo numero nell'ultima riga etichettata `Swp` (quello dopo il `/`) è diverso da zero, allora sei a posto.
Ad esempio, se mostra `0K / 16.0G` allora il tuo spazio swap è stato attivato con successo.
Se mostra `0K / 0K` allora non ha funzionato e dovrai confermare di aver inserito correttamente i passaggi precedenti.

Premi `q` o `F10` per uscire da `htop` e tornare al terminale.

### Configurazione di Swappiness e Cache Pressure

Per impostazione predefinita, Linux utilizzerà volentieri molto spazio swap per togliere un po' di pressione alla RAM del sistema.
Non vogliamo questo. Vogliamo che utilizzi tutta la RAM fino all'ultimo secondo prima di affidarsi allo SWAP.
Il passo successivo è cambiare quella che viene chiamata "swappiness" del sistema, che è fondamentalmente quanto è ansioso di utilizzare lo spazio swap.
C'è molto dibattito su quale valore impostare, ma abbiamo scoperto che un valore di 6 funziona abbastanza bene.

Vogliamo anche abbassare la "cache pressure", che determina quanto rapidamente il server eliminerà una cache del suo filesystem.
Poiché avremo molta RAM di riserva con la nostra configurazione, possiamo renderlo "10" che lascerà la cache in memoria per un po', riducendo l'I/O del disco.

Per impostare questi, esegui questi comandi:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Ora, inseriscili nel file `sysctl.conf` in modo che vengano riapplicati dopo un riavvio:

```shell
sudo nano /etc/sysctl.conf
```

Aggiungi queste due righe alla fine:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Quindi salva ed esci come hai fatto prima (`Ctrl+O`, `Ctrl+X`).

### Controlli del Sistema Pre-installazione

Prima di installare Rocket Pool, rivedi la seguente checklist:

- Il tuo sistema è completamente costruito, si accende e può avviarsi nel sistema operativo.
- Non farai nessun'altra attività sul sistema, come navigare su Internet, controllare la posta elettronica o giocare.
- Hai un sistema operativo Linux installato.
- Il tuo account utente ha privilegi root / amministratore.
- Hai un SSD che soddisfa i requisiti di prestazioni.
- Il tuo SSD è montato sul tuo file system.
- Hai almeno 1,5 TB di spazio su disco libero per il processo di sincronizzazione iniziale di Execution e Consensus.
- Se il tuo ISP limita i tuoi dati, è più di 2 TB al mese.

Se hai controllato e confermato tutti questi elementi, allora sei pronto per installare Rocket Pool e iniziare a eseguire un nodo!
Passa alla sezione [Scelta dei tuoi Client ETH](../eth-clients).
