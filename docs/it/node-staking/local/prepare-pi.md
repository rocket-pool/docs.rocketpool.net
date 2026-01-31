# Preparazione di un Raspberry Pi

::: warning NOTA
Questa pagina è stata lasciata qui per scopi di archivio. Non raccomandiamo più di eseguire Rocket Pool su un Raspberry Pi a causa dei
maggiori requisiti hardware e di prestazioni per eseguire un validatore Ethereum.
:::

Questa guida ti accompagnerà nell'esecuzione di un nodo Rocket Pool utilizzando un Raspberry Pi.
Sebbene ciò non sia tipicamente raccomandato nella maggior parte delle guide di staking, riconosciamo che sia attraente perché rappresenta un'opzione molto più accessibile rispetto all'utilizzo di un PC completo.
A tal fine, abbiamo lavorato duramente per ottimizzare e modificare un'ampia gamma di impostazioni e abbiamo determinato una configurazione che sembra funzionare bene.

Questa configurazione eseguirà **un nodo Execution completo** e **un nodo Consensus completo** sul Pi, facendo sì che il tuo sistema contribuisca alla salute della rete Ethereum fungendo contemporaneamente da operatore di nodo Rocket Pool.

## Configurazione preliminare

Per eseguire un nodo Rocket Pool su un Raspberry Pi, dovrai prima avere un Raspberry Pi funzionante.
Se ne hai già uno attivo e funzionante - ottimo! Puoi passare alla sezione [Montaggio dell'SSD](#montaggio-dell-ssd).
Assicurati solo di avere **una ventola collegata** prima di procedere.
Se stai partendo da zero, continua a leggere.

### Cosa ti servirà

Questi sono i componenti consigliati che dovrai acquistare per eseguire Rocket Pool su un Pi:

- Un **Raspberry Pi 4 Model B**, il **modello da 8 GB**
  - Nota: mentre _puoi_ utilizzare un modello da 4 GB con questa configurazione, ti consigliamo vivamente di optare per uno da 8 GB per maggiore tranquillità... non costa molto di più.
- Un **alimentatore USB-C** per il Pi. Ne vuoi uno che fornisca **almeno 3 ampere**.
- Una **scheda MicroSD**. Non deve essere grande, 16 GB sono sufficienti e ora costano poco... ma dovrebbe essere almeno una **Classe 10 (U1)**.
- Un **adattatore da MicroSD a USB** per il tuo PC. Questo è necessario per installare il sistema operativo sulla scheda prima di caricarla nel Pi.
  Se il tuo PC ha già una porta SD, non è necessario acquistarne uno nuovo.
- Alcuni **dissipatori di calore**. Eseguirai il Pi sotto carico pesante 24/7 e si surriscalderà.
  I dissipatori di calore aiuteranno a evitare che si auto-limiti. Idealmente ne vuoi un set di 3: uno per la CPU, uno per la RAM e uno per il controller USB.
  [Ecco un buon esempio di un bel set](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Una **custodia**. Ci sono due opzioni qui: con ventola e senza ventola.
  - Con ventola:
    - Una **ventola** da 40mm. Come sopra, l'obiettivo è mantenere le cose fresche mentre esegui il tuo nodo Rocket Pool.
    - Una **custodia con supporto per ventola** per legare tutto insieme.
      Potresti anche ottenere una custodia con ventole integrate [come questa](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) in modo da non dover acquistare le ventole separatamente.
  - Senza ventola:
    - Una **custodia senza ventola** che funge da un unico grande dissipatore di calore, come [questa](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX).
      Questa è una bella opzione poiché è silenziosa, ma il tuo Pi **si** surriscalderà parecchio - specialmente durante il processo di sincronizzazione iniziale della blockchain.
      Credito all'utente Discord Ken per averci indicato questa direzione!
  - Come regola generale, consigliamo di optare **per una ventola** perché faremo un overclock significativo del Pi.

Puoi ottenere molte di queste cose in un bundle per comodità - ad esempio, [Canakit offre un kit](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) con molti componenti inclusi.
Tuttavia, potresti riuscire ad ottenerlo tutto a un prezzo inferiore se acquisti le parti separatamente (e se hai l'attrezzatura, puoi [stampare in 3D la tua custodia per Pi](https://www.thingiverse.com/thing:3793664).)

Altri componenti di cui avrai bisogno:

- Un **disco a stato solido USB 3.0+**. La raccomandazione generale è per un **disco da 2 TB**.
  - Il [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) è un eccellente esempio di uno che funziona bene.
  - :warning: L'utilizzo di un SSD SATA con un adattatore SATA-USB **non è raccomandato** a causa di [problemi come questo](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931).
    Se segui questa strada, abbiamo incluso un test di prestazioni che puoi utilizzare per verificare se funzionerà o meno nella sezione [Test delle prestazioni dell'SSD](#test-delle-prestazioni-dell-ssd).
- Un **cavo ethernet** per l'accesso a Internet. Dovrebbe essere almeno di categoria **Cat 5e**.
  - Eseguire un nodo tramite Wi-Fi **non è raccomandato**, ma se non hai altre opzioni, puoi farlo invece di utilizzare un cavo ethernet.
- Un **UPS** per fungere da fonte di alimentazione se mai perdi l'elettricità.
  Il Pi davvero non consuma molta energia, quindi anche un piccolo UPS durerà a lungo, ma in generale più grande è, meglio è. Scegli un UPS il più grande che puoi permetterti.
  Inoltre, consigliamo di **collegare anche il tuo modem, router e altre apparecchiature di rete** ad esso - non ha molto senso mantenere il tuo Pi in vita se il tuo router muore.

A seconda della tua posizione, delle offerte, della tua scelta di SSD e UPS e di quanti di questi elementi possiedi già, probabilmente spenderai **circa $200-$500 USD** per una configurazione completa.

### Rendere la ventola più silenziosa

Quando ricevi la ventola, per impostazione predefinita probabilmente ti verrà chiesto di collegarla al pin GPIO da 5v, come mostrato nell'immagine sottostante.
La ventola avrà un connettore con due fori; quello nero dovrebbe andare a GND (pin 6) e quello rosso dovrebbe andare a +5v (pin 4).
![](./images/pi/Pinout.png)

Tuttavia, nella nostra esperienza, questo fa sì che la ventola funzioni molto forte e veloce, il che non è davvero necessario.
Se vuoi renderla più silenziosa pur mantenendola fresca, prova a collegarla al pin da 3.3v (Pin 1, quello blu) invece del pin da 5v.
Ciò significa che sulla tua ventola, il punto nero andrà ancora a GND (pin 6), ma ora il punto rosso andrà a +3.3v (pin 1).

Se la tua ventola ha un connettore in cui i due fori sono affiancati e non puoi separarli, puoi mettere [dei jumper come questo](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) tra essa e i pin GPIO sul Pi.

### Installazione del sistema operativo

Ci sono diverse varietà di SO Linux che supportano il Raspberry Pi.
Per questa guida, ci atterremo a **Ubuntu 20.04**.
Ubuntu è un SO collaudato e utilizzato in tutto il mondo, e 20.04 è (al momento di questa scrittura) l'ultima delle versioni Long Term Support (LTS), il che significa che continuerà a ricevere patch di sicurezza per molto tempo.
Se preferisci attenerti a un diverso tipo di Linux come Raspbian, sentiti libero di seguire le guide di installazione esistenti per quello - tieni solo presente che questa guida è stata creata per Ubuntu, quindi non tutte le istruzioni potrebbero corrispondere al tuo SO.

Le brave persone di Canonical hanno scritto [una meravigliosa guida su come installare l'immagine Ubuntu Server su un Pi](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview).

Segui **i passaggi da 1 a 4** della guida sopra per la configurazione del Server.
Per l'immagine del sistema operativo, vuoi selezionare `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`.

Se decidi di voler un'interfaccia utente desktop (in modo da poter utilizzare un mouse e avere finestre da trascinare), dovrai seguire anche il passaggio 5.
Ti suggeriamo di non farlo e di attenerti all'immagine del server, perché l'interfaccia utente desktop aggiungerà un po' di overhead e lavoro di elaborazione aggiuntivi sul tuo Pi con relativamente poco vantaggio.
Tuttavia, se sei determinato a eseguire un desktop, allora ti consigliamo di scegliere l'opzione Xubuntu.
È piuttosto leggera in termini di risorse e molto user-friendly.

Una volta completato, sei pronto per iniziare a preparare Ubuntu per eseguire un nodo Rocket Pool.
Puoi utilizzare il terminale locale su di esso, oppure puoi accedere tramite SSH dal tuo desktop/laptop come suggerisce la guida di installazione.
Il processo sarà lo stesso in entrambi i casi, quindi fai ciò che è più conveniente per te.

Se non hai familiarità con `ssh`, dai un'occhiata alla guida [Introduzione a Secure Shell](../ssh).

::: warning NOTA
A questo punto, dovresti _fortemente considerare_ di configurare il tuo router per rendere l'indirizzo IP del tuo Pi **statico**.
Ciò significa che il tuo Pi avrà sempre lo stesso indirizzo IP, quindi potrai sempre accedervi tramite SSH utilizzando quell'indirizzo IP.
Altrimenti, è possibile che l'IP del tuo Pi possa cambiare a un certo punto e il comando SSH sopra non funzionerà più.
Dovrai accedere alla configurazione del tuo router per scoprire qual è il nuovo indirizzo IP del tuo Pi.

Ogni router è diverso, quindi dovrai consultare la documentazione del tuo router per imparare come assegnare un indirizzo IP statico.
:::

## Montaggio dell'SSD

Come avrai capito, dopo aver seguito le istruzioni di installazione sopra, il sistema operativo principale verrà eseguito dalla scheda microSD.
Non è abbastanza grande né abbastanza veloce per contenere tutti i dati della blockchain Execution e Consensus, ed è qui che entra in gioco l'SSD.
Per utilizzarlo, dobbiamo configurarlo con un file system e montarlo sul Pi.

### Collegamento dell'SSD alle porte USB 3.0

Inizia collegando il tuo SSD a una delle porte USB 3.0 del Pi. Queste sono le porte **blu**, non quelle nere:

![](./images/pi/USB.png)

Quelle nere sono lente porte USB 2.0; sono buone solo per accessori come mouse e tastiere.
Se hai la tua tastiera collegata alle porte blu, toglila e collegala a quelle nere ora.

### Formattazione dell'SSD e creazione di una nuova partizione

::: warning
Questo processo cancellerà tutto sul tuo SSD.
Se hai già una partizione con dei dati, SALTA QUESTO PASSAGGIO perché stai per eliminare tutto!
Se non hai mai usato questo SSD prima ed è completamente vuoto, allora segui questo passaggio.
:::

Esegui questo comando per trovare la posizione del tuo disco nella tabella dei dispositivi:

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

La cosa importante di cui hai bisogno è la porzione `logical name: /dev/sda`, o meglio, la parte **`/dev/sda`** di essa.
Chiameremo questa la **posizione del dispositivo** del tuo SSD.
Per questa guida, useremo semplicemente `/dev/sda` come posizione del dispositivo - la tua sarà probabilmente la stessa, ma sostituiscila con qualunque cosa mostri quel comando per il resto delle istruzioni.

Ora che conosciamo la posizione del dispositivo, formattiamolo e creiamo una nuova partizione su di esso in modo da poterlo effettivamente utilizzare.
Ancora una volta, **questi comandi elimineranno qualunque cosa sia già sul disco!**

Crea una nuova tabella delle partizioni:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Formatta la nuova partizione con il file system `ext4`:

```shell
sudo mkfs -t ext4 /dev/sda1
```

Aggiungi un'etichetta (non devi farlo, ma è divertente):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Conferma che questo abbia funzionato eseguendo il comando qui sotto, che dovrebbe mostrare un output come quello che vedi qui:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Se vedi tutto questo, allora sei a posto. Prendi l'output `UUID="..."` e mettilo da qualche parte temporaneamente, perché ne avrai bisogno tra un minuto.

### Ottimizzazione della nuova partizione

Successivamente, ottimizziamo un po' il nuovo filesystem per ottimizzarlo per l'attività di validazione.

Per impostazione predefinita, ext4 riserverà il 5% del suo spazio per i processi di sistema.
Poiché non ne abbiamo bisogno sull'SSD perché memorizza solo i dati della chain Execution e Consensus, possiamo disabilitarlo:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Montaggio e abilitazione del montaggio automatico

Per utilizzare l'unità, devi montarla sul file system.
Crea un nuovo punto di montaggio ovunque tu voglia (useremo `/mnt/rpdata` qui come esempio, sentiti libero di usarlo):

```shell
sudo mkdir /mnt/rpdata
```

Ora, monta la nuova partizione SSD su quella cartella:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Dopo questo, la cartella `/mnt/rpdata` punterà all'SSD, quindi qualsiasi cosa tu scriva in quella cartella vivrà sull'SSD.
Qui è dove memorizzeremo i dati della chain per Execution e Consensus.

Ora, aggiungiamolo alla tabella di montaggio in modo che si monti automaticamente all'avvio.
Ricordi l'`UUID` dal comando `blkid` che hai usato prima?
Questo è dove tornerà utile.

```shell
sudo nano /etc/fstab
```

Questo aprirà un editor di file interattivo, che inizialmente avrà questo aspetto:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

Usa i tasti freccia per andare in fondo all'ultima riga e aggiungi questa riga alla fine:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

Sostituisci il valore in `UUID=...` con quello del tuo disco, quindi premi `Ctrl+O` e `Invio` per salvare, poi `Ctrl+X` e `Invio` per uscire.
Ora l'SSD verrà montato automaticamente quando riavvii. Bello!

### Test delle prestazioni dell'SSD

Prima di andare oltre, dovresti testare la velocità di lettura/scrittura del tuo SSD e quante richieste I/O può gestire al secondo (IOPS).
Se il tuo SSD è troppo lento, non funzionerà bene per un nodo Rocket Pool e finirai per perdere denaro nel tempo.

Per testarlo, useremo un programma chiamato `fio`. Installalo così:

```shell
sudo apt install fio
```

Successivamente, spostati sul punto di montaggio del tuo SSD:

```shell
cd /mnt/rpdata
```

Ora, esegui questo comando per testare le prestazioni dell'SSD:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

L'output dovrebbe assomigliare a questo:

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

Ciò che ti interessa sono le righe che iniziano con `read:` e `write:` sotto la riga `test:`.

- La tua **lettura** dovrebbe avere IOPS di almeno **15k** e larghezza di banda (BW) di almeno **60 MiB/s**.
- La tua **scrittura** dovrebbe avere IOPS di almeno **5000** e larghezza di banda di almeno **20 MiB/s**.

Queste sono le specifiche del Samsung T5 che utilizziamo, che funziona molto bene.
Abbiamo anche testato un SSD più lento con IOPS di lettura di 5k e IOPS di scrittura di 1k, e ha molte difficoltà a tenere il passo con il livello consensus.
Se usi un SSD più lento delle specifiche sopra, preparati al fatto che potresti vedere molte attestazioni mancate.
Se il tuo soddisfa o supera queste specifiche, allora sei a posto e puoi andare avanti.

::: tip NOTA
Se il tuo SSD non soddisfa le specifiche sopra ma dovrebbe, potresti essere in grado di risolverlo con un aggiornamento del firmware.
Ad esempio, questo è stato sperimentato dalla comunità Rocket Pool con il Samsung T7.
Due di essi appena tolti dalla scatola mostravano solo 3.5K IOPS di lettura e 1.2K IOPS di scrittura.
Dopo aver applicato tutti gli aggiornamenti firmware disponibili, le prestazioni sono tornate ai numeri mostrati nell'esempio sopra.
Controlla con il sito di supporto del tuo produttore per l'ultimo firmware e assicurati che il tuo disco sia aggiornato - potresti dover aggiornare il firmware più volte fino a quando non ci sono più aggiornamenti disponibili.
:::

Ultimo ma non meno importante, rimuovi il file di test che hai appena creato:

```shell
sudo rm /mnt/rpdata/test
```

## Configurazione dello spazio di swap

Il Pi ha 8 GB (o 4 GB se hai scelto quella strada) di RAM.
Per la nostra configurazione, sarà sufficiente.
D'altra parte, non fa mai male aggiungerne un po' di più.
Quello che faremo ora è aggiungere quello che viene chiamato **spazio di swap**.
Essenzialmente, significa che useremo l'SSD come "RAM di backup" nel caso in cui qualcosa vada terribilmente, terribilmente storto e il Pi esaurisca la RAM normale.
L'SSD non è veloce quanto la RAM normale, quindi se raggiunge lo spazio di swap rallenterà le cose, ma non si bloccherà completamente e non romperà tutto.
Pensa a questo come un'assicurazione extra che (molto probabilmente) non avrai mai bisogno.

### Creazione di un file di swap

Il primo passo è creare un nuovo file che fungerà da spazio di swap.
Decidi quanto vuoi usare - un inizio ragionevole sarebbe 8 GB, quindi hai 8 GB di RAM normale e 8 GB di "RAM di backup" per un totale di 16 GB.
Per essere super sicuri, puoi farlo di 24 GB in modo che il tuo sistema abbia 8 GB di RAM normale e 24 GB di "RAM di backup" per un totale di 32 GB, ma questo è probabilmente eccessivo.
Fortunatamente, poiché il tuo SSD ha 1 o 2 TB di spazio, allocare da 8 a 24 GB per un file di swap è trascurabile.

Per questa procedura, scegliamo una bella via di mezzo - diciamo, 16 GB di spazio di swap per una RAM totale di 24 GB.
Sostituisci semplicemente qualsiasi numero tu voglia mentre procediamo.

Inserisci questo, che creerà un nuovo file chiamato `/mnt/rpdata/swapfile` e lo riempirà con 16 GB di zeri.
Per cambiare la quantità, cambia semplicemente il numero in `count=16` con quello che vuoi. **Nota che questo impiegherà molto tempo, ma va bene.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

Successivamente, imposta le autorizzazioni in modo che solo l'utente root possa leggere o scrivere su di esso (per sicurezza):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Ora, contrassegnalo come file di swap:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Successivamente, abilitalo:

```shell
sudo swapon /mnt/rpdata/swapfile
```

Infine, aggiungilo alla tabella di montaggio in modo che si carichi automaticamente quando il tuo Pi si riavvia:

```shell
sudo nano /etc/fstab
```

Aggiungi una nuova riga alla fine in modo che il file abbia questo aspetto:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Premi `Ctrl+O` e `Invio` per salvare, poi `Ctrl+X` e `Invio` per uscire.

Per verificare che sia attivo, esegui questi comandi:

```shell
sudo apt install htop
htop
```

Il tuo output dovrebbe assomigliare a questo in alto:
![](./images/pi/Swap.png)

Se il secondo numero nell'ultima riga etichettata `Swp` (quello dopo la `/`) è diverso da zero, allora sei a posto.
Ad esempio, se mostra `0K / 16.0G` allora il tuo spazio di swap è stato attivato con successo.
Se mostra `0K / 0K` allora non ha funzionato e dovrai confermare di aver inserito correttamente i passaggi precedenti.

Premi `q` o `F10` per uscire da `htop` e tornare al terminale.

### Configurazione di Swappiness e Cache Pressure

Per impostazione predefinita, Linux userà volentieri molto spazio di swap per togliere un po' di pressione dalla RAM del sistema.
Non vogliamo questo. Vogliamo che usi tutta la RAM fino all'ultimo secondo prima di affidarsi allo SWAP.
Il prossimo passo è cambiare quella che viene chiamata la "swappiness" del sistema, che è fondamentalmente quanto è ansioso di usare lo spazio di swap.
C'è molto dibattito su quale valore impostare, ma abbiamo trovato che un valore di 6 funziona abbastanza bene.

Vogliamo anche abbassare la "cache pressure", che determina quanto rapidamente il Pi eliminerà una cache del suo filesystem.
Poiché avremo molta RAM di riserva con la nostra configurazione, possiamo fare "10" che lascerà la cache in memoria per un po', riducendo l'I/O del disco.

Per impostarli, esegui questi comandi:

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

## Overclock del Pi

Per impostazione predefinita, il processore da 1.5 GHz con cui viene fornito il Pi è un piccolo dispositivo piuttosto capace.
Per la maggior parte, dovresti essere in grado di validare con esso senza problemi.
Tuttavia, abbiamo notato che in rare occasioni, il tuo client validatore si blocca a lavorare su alcune cose e semplicemente non ha abbastanza potenza per tenere il passo con i compiti di attestazione del tuo validatore.
Quando ciò accade, vedrai qualcosa del genere sull'[explorer beaconcha.in](https://beaconcha.in) (descritto in modo più dettagliato nella guida [Monitoraggio delle prestazioni del tuo nodo](../performance) più avanti):

![](./images/pi/Incl-Dist.png)

Quella distanza di inclusione di 8 significa che ci è voluto molto tempo per inviare quell'attestazione, e sarai leggermente penalizzato per essere in ritardo.
Idealmente, tutti dovrebbero essere 0.
Sebbene rari, questi si verificano quando si esegue alle impostazioni predefinite.

C'è un modo per mitigare questi, tuttavia: l'overclock.
L'overclock è di gran lunga il modo più semplice per ottenere prestazioni extra dalla CPU del tuo Pi e prevenire quelle fastidiose alte distanze di inclusione.
Francamente, il clock predefinito della CPU di 1.5 GHz è davvero insufficiente.
Puoi velocizzarlo parecchio tramite l'overclock e, a seconda di quanto vai lontano, puoi farlo in modo abbastanza sicuro.

L'overclock del Pi è molto semplice - comporta solo la modifica di alcuni numeri in un file di testo.
Ci sono due numeri che contano: il primo è il **core clock**, che determina direttamente quanto velocemente funziona la CPU ARM.
Il secondo è **overvoltage**, che determina la tensione che viene alimentata nella CPU ARM.
Velocità più elevate generalmente richiedono tensioni più elevate, ma la CPU del Pi può gestire parecchia tensione extra senza alcun danno apprezzabile.
Potrebbe logorarsi un po' più velocemente, ma stiamo ancora parlando nell'ordine di anni e il Pi 5 sarà fuori entro allora, quindi nessun danno reale!

Piuttosto, la vera preoccupazione con l'overvoltage è che **tensioni più elevate portano a temperature più elevate**.
Questa sezione ti aiuterà a vedere quanto si scalda il tuo Pi sotto un carico pesante, in modo da non spingerlo troppo oltre.

::: warning
Mentre l'overclock ai livelli che faremo è abbastanza sicuro e affidabile, sei alla mercé di quello che viene chiamato il "silicon lottery".
Ogni CPU è leggermente diversa in modi microscopici, e alcune di esse possono semplicemente eseguire l'overclock meglio di altre.
Se esegui l'overclock troppo lontano/troppo forte, il tuo sistema potrebbe diventare **instabile**.
I Pi instabili soffrono di tutti i tipi di conseguenze, dai riavvii costanti al congelamento completo.
**Nel peggiore dei casi, potresti corrompere la tua scheda microSD e dover reinstallare tutto da zero!**

**Seguendo le indicazioni qui, devi accettare il fatto che stai correndo quel rischio.**
Se non ne vale la pena per te, salta il resto di questa sezione.
:::

## Benchmark della configurazione predefinita

Prima dell'overclock, dovresti profilare di cosa è capace il tuo Pi nella sua configurazione predefinita, pronta all'uso.
Ci sono tre cose chiave da guardare:

1. **Prestazioni** (quanto velocemente il tuo Pi calcola le cose)
2. **Temperatura** sotto carico (quanto si scalda)
3. **Stabilità** (quanto tempo funziona prima di bloccarsi)

Otterremo statistiche su tutte e tre mentre procediamo.

### Prestazioni

Per misurare le prestazioni, puoi usare LINPACK.
Lo costruiremo dal sorgente.

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

Ora eseguilo così:

```shell
linpack
Enter array size (q to quit) [200]:
```

Premi semplicemente `invio` per lasciarlo al valore predefinito di 200 e lascialo eseguire.
Quando ha finito, l'output assomiglierà a questo:

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

Ciò che devi guardare è l'ultima riga, nella colonna `KFLOPS`.
Questo numero (1120277.186 nell'esempio sopra) rappresenta le tue prestazioni di calcolo.
Non significa nulla di per sé, ma ci dà una buona base per confrontare le prestazioni overclockata.
Chiamiamolo **KFLOPS predefinito**.

### Temperatura

Successivamente, stressiamo il Pi e osserviamo la sua temperatura sotto carico pesante.
Per prima cosa, installa questo pacchetto, che fornirà uno strumento chiamato `vcgencmd` che può stampare dettagli sul Pi:

```shell
sudo apt install libraspberrypi-bin
```

Una volta installato, riavvia il Pi (questo è necessario per applicare alcune nuove autorizzazioni).
Successivamente, installa un programma chiamato **stressberry**.
Questo sarà il nostro strumento di benchmarking.
Installalo così:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip NOTA
Se stressberry genera un errore sul non essere in grado di leggere le informazioni sulla temperatura o non essere in grado di aprire l'istanza `vchiq`, puoi risolverlo con il seguente comando:

```shell
sudo usermod -aG video $USER
```

Quindi disconnettiti e riconnettiti, riavvia la tua sessione SSH o riavvia la macchina e riprova.
:::

Successivamente, eseguilo così:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Questo eseguirà un nuovo stress test denominato "Stock" per 300 secondi (5 minuti) con 60 secondi di raffreddamento prima e dopo il test, su tutti e 4 i core del Pi.
Puoi giocare con questi tempi se vuoi che venga eseguito più a lungo o abbia più raffreddamento, ma questo funziona come un rapido stress test per me.
I risultati verranno salvati in un file denominato `stock.out`.

Durante la fase principale del test, l'output assomiglierà a questo:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Questo fondamentalmente ti dice quanto si scalderà il Pi.
A 85­°C, il Pi inizierà effettivamente a limitarsi e abbassare la velocità del clock in modo da non surriscaldarsi.
Fortunatamente, poiché hai aggiunto un dissipatore di calore e una ventola, non dovresti avvicinarti minimamente a questo!
Detto questo, generalmente cerchiamo di mantenere le temperature al di sotto di 65°C per il bene della salute generale del sistema.

Se vuoi monitorare la temperatura del sistema durante le normali operazioni di validazione, puoi farlo con `vcgencmd`:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Stabilità

Testare la stabilità di un overclock comporta rispondere a queste tre domande:

- Il Pi si accende e arriva a un prompt di login/avvia il server SSH?
- Si blocca o si riavvia casualmente durante le normali operazioni?
- Si blocca o si riavvia casualmente sotto carico pesante?

Perché un overclock sia veramente stabile, le risposte devono essere **sì, no e no**.
Ci sono alcuni modi per testare questo, ma il più semplice a questo punto è semplicemente eseguire `stressberry` per molto tempo.
Quanto tempo dipende interamente da te - più a lungo va, più puoi essere sicuro che il sistema sia stabile.
Alcune persone eseguono solo il test di 5 minuti sopra e lo chiamano buono se sopravvive; altri lo eseguono per mezz'ora; altri lo eseguono per 8 ore o anche di più.
Quanto tempo eseguirlo è una decisione personale che dovrai prendere in base alla tua tolleranza al rischio.

Per modificare il runtime, modifica semplicemente il parametro `-d` con il numero di secondi che vuoi che il test venga eseguito.
Ad esempio, se hai deciso che mezz'ora è la via da seguire, potresti fare `-d 1800`.

## Il tuo primo overclock - 1800 MHz (Leggero)

Il primo overclock che faremo è relativamente "leggero" e affidabile, ma fornisce comunque un bel aumento di potenza di calcolo.
Passeremo da 1500 MHz predefiniti a 1800 MHz - un aumento della velocità del 20%!

Apri questo file:

```shell
sudo nano /boot/firmware/usercfg.txt
```

Aggiungi queste due righe alla fine:

```shell
arm_freq=1800
over_voltage=3
```

Quindi salva il file e riavvia.

Queste impostazioni aumenteranno il clock della CPU del 20% e aumenteranno anche la tensione della CPU da 0.88v a 0.93v (ogni impostazione `over_voltage` la aumenta di 0.025v).
Questa impostazione dovrebbe essere raggiungibile da qualsiasi Pi 4B, quindi il tuo sistema dovrebbe riavviarsi e fornire un prompt di login o accesso SSH in pochi istanti.
Se non lo fa e il tuo Pi smette di rispondere o entra in un ciclo di avvio, dovrai resettarlo - leggi la sezione successiva per quello.

### Reset dopo un overclock instabile

Se il tuo Pi smette di rispondere o continua a riavviarsi continuamente, allora devi abbassare l'overclock.
Per farlo, segui questi passaggi:

1. Spegni il Pi.
2. Estrai la scheda microSD.
3. Collega la scheda a un altro computer Linux con un adattatore microSD.
   \*NOTA: Questo **deve essere** un altro computer Linux. Non funzionerà se lo colleghi a una macchina Windows, perché Windows non può leggere il filesystem `ext4` che usa la scheda SD!\*\*
4. Monta la scheda sull'altro computer.
5. Apri `<punto di montaggio SD>/boot/firmware/usercfg.txt`.
6. Abbassa il valore `arm_freq` o aumenta il valore `over_voltage`. _NOTA: **non andare oltre over_voltage=6.** Valori più alti non sono supportati dalla garanzia del Pi e corrono il rischio di degradare la CPU più velocemente di quanto potresti sentirti a tuo agio._
7. Smonta la scheda SD e rimuovila.
8. Ricollega la scheda nel Pi e accendilo.

Se il Pi funziona, allora ottimo! Continua qui sotto.
Se no, ripeti l'intero processo con impostazioni ancora più conservative.
Nel peggiore dei casi puoi semplicemente rimuovere completamente le righe `arm_freq` e `over_voltage` per riportarlo alle impostazioni predefinite.

### Test di 1800 MHz

Una volta effettuato l'accesso, esegui di nuovo `linpack` per testare le nuove prestazioni.
Ecco un esempio dal nostro Pi di test:

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

Ancora una volta, prendi la colonna `KFLOPS` nell'ultima riga.
Per confrontarla con la configurazione predefinita, dividi semplicemente i due numeri:
`1337238.504 / 1120277.186 = 1.193668`

Fantastico! Questo è un aumento delle prestazioni del 19.4%, che è quello che ci si aspetta poiché stiamo eseguendo il 20% più veloce.
Ora controlliamo le temperature con le nuove impostazioni di velocità del clock e tensione:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Dovresti vedere un output del genere:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

Non male, circa 6° più caldo delle impostazioni predefinite ma ancora ben al di sotto della soglia in cui personalmente ci fermeremmo.

Puoi eseguire un test di stabilità più lungo qui se ti senti a tuo agio, oppure puoi andare avanti per portare le cose ancora più in alto.

## Passaggio a 2000 MHz (Medio)

Il prossimo traguardo sarà 2000 MHz. Questo rappresenta un aumento della velocità del clock del 33.3%, che è piuttosto significativo.
La maggior parte delle persone considera questo un ottimo equilibrio tra prestazioni e stabilità, quindi ferma il processo qui.

Il nostro consiglio per questo livello è di iniziare con queste impostazioni:

```shell
arm_freq=2000
over_voltage=5
```

Questo aumenterà la tensione del core a 1.005v.
Provalo con i test `linpack` e `stressberry`.
Se li sopravvive, allora sei a posto. Se si blocca o si riavvia casualmente, dovresti aumentare la tensione:

```shell
arm_freq=2000
over_voltage=6
```

Questo porta la tensione del core a 1.03v, che è il massimo che puoi andare prima di invalidare la garanzia.
Questo di solito funziona per la maggior parte dei Pi.
Se non funziona, invece di aumentare ulteriormente la tensione, **dovresti abbassare la velocità del clock e riprovare.**

Per riferimento, ecco i numeri dalla nostra esecuzione a 2000:

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

Questo è un aumento della velocità del 32.3% che è in linea con ciò che ci aspetteremmo. Non male!

Ecco le nostre temperature:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

Un aumento di altri 7 gradi, ma ancora sotto la nostra soglia di 65°C.

## Passaggio a 2100 MHz (Pesante)

Il prossimo passo rappresenta un solido **aumento della velocità del 40%** rispetto alla configurazione predefinita.

**NOTA: Non tutti i Pi sono in grado di farlo rimanendo a `over_voltage=6`.
Provalo e se si rompe, torna a 2000 MHz.**

La configurazione sarà così:

```shell
arm_freq=2100
over_voltage=6
```

Per riferimento, ecco i nostri risultati:

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

Questo è un aumento della velocità del 39.4%!

Ecco le nostre temperature:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

Appena sotto i 60°C, quindi c'è molto margine.

## Passaggio a 2250 MHz (Estremo)

Questa è l'impostazione con cui eseguiamo i nostri Pi, che è stata stabile per oltre un anno al momento della scrittura.
Tuttavia, **gli utenti sono avvertiti nell'overclock così alto** - assicurati di fare test di stabilità approfonditi e avere molto margine termico prima di tentare di rendere questa la configurazione di produzione del tuo nodo!

La nostra configurazione è:

```shell
arm_freq=2250
over_voltage=10
```

Ecco i nostri risultati:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

Questo è il 46% più veloce della configurazione predefinita!

OV10 è il massimo che il firmware predefinito lascerà andare il Pi, e 2250 MHz è il più veloce che potremmo eseguire in modo affidabile in produzione.

Le temperature nello stress test arrivano così alte:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Ma durante la validazione effettiva, tendono a rimanere al di sotto di 60C che è accettabile per noi.

## Prossimi passi

E con questo, il tuo Pi è attivo e funzionante e pronto per eseguire Rocket Pool!
Passa alla sezione [Scelta dei tuoi client ETH](../eth-clients).
