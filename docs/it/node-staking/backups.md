# Backup del tuo Nodo

::: tip NOTA
Questo è attualmente scritto per le installazioni in **modalità Docker**.
Alcune posizioni potrebbero variare per gli utenti Hybrid o Native.
:::

In generale, se hai creato il tuo wallet del nodo e i minipool tramite lo Smartnode, l'unica cosa di cui hai davvero bisogno per recuperare il tuo nodo da un guasto completo è il **mnemonico del tuo wallet del nodo**.
Tutto il resto può essere recuperato da quello abbastanza facilmente.

Se hai minipool con chiavi di validatore generate esternamente (ad esempio hai migrato da **Allnodes** al tuo nodo self-hosted), avrai bisogno anche dei file keystore privati per i tuoi validatori poiché non possono essere recuperati dal wallet del nodo.

Detto questo, una volta avvenuto il Merge, non sarai più in grado di utilizzare un Execution client leggero (ad esempio Pocket o Infura) come ripiego se mai avessi bisogno di risincronizzare la chain dell'Execution layer.
Inoltre, ti sarà richiesto di avere un Execution client attivo e sano per attestare correttamente.
Avere un modo veloce e affidabile per recuperare da un guasto dell'Execution client (come un database corrotto, malfunzionamento dell'SSD o hardware compromesso/rubato) sarà fondamentale, poiché può richiedere ore o addirittura giorni per sincronizzare da zero.

In questa guida, ti mostreremo come eseguire il backup di alcune di queste cose per aiutare a migliorare la resilienza del tuo nodo e ridurre al minimo i tempi di inattività non necessari.

::: warning NOTA
Questa guida presume che tu abbia installato lo Smartnode nella directory predefinita (`~/.rocketpool`).
Se hai specificato una directory di installazione diversa, sostituiscila di conseguenza nelle istruzioni seguenti.
:::

## Elementi che possono essere sottoposti a Backup

### Configurazione dello Smartnode

La configurazione dello Smartnode è archiviata in `~/.rocketpool/user-settings.yml`.
Puoi salvarlo e sostituirlo per ripristinare tutte le impostazioni dello Smartnode (cioè le cose che hai specificato in `rocketpool service config`).

### Dati della Chain dell'Execution Client / ETH1 Client

I dati della chain dell'Execution client sono probabilmente la cosa più importante di cui eseguire il backup.
Come accennato, possono essere necessari diversi giorni per risincronizzare i dati della chain EC.
Dopo il Merge, questo significa ore o giorni di inattività e profitti persi!

I dati della chain sono archiviati all'interno del volume Docker `rocketpool_eth1clientdata`, che per impostazione predefinita si trova in `/var/lib/docker/volumes/rocketpool_eth1clientdata`.
Nota che questa cartella in genere non è accessibile dagli account utente non privilegiati; dovrai elevare all'utente `root` per vederla.

::: tip NOTA
Se hai modificato la posizione di archiviazione di Docker durante l'installazione iniziale dello Smartnode (come le persone che eseguono Docker su un secondo SSD), troverai il volume in `/<il tuo punto di montaggio esterno>/docker/volumes/rocketpool_eth1clientdata`

Se non ricordi quale percorso di installazione utilizzi, puoi controllare `/etc/docker/daemon.json` per la sua posizione.
Se il file non esiste, utilizzi la posizione predefinita.
:::

Per istruzioni dettagliate su come eseguire il backup dei dati della chain Execution in modo efficiente, consulta la sezione [Backup dei dati della Chain Execution](#backup-dei-dati-della-chain-execution) di seguito.

### Dati di Monitoraggio e Metriche

Questi dati sono archiviati all'interno del volume Docker `rocketpool_grafana-storage`, che per impostazione predefinita si trova in `/var/lib/docker/volumes/rocketpool_grafana-storage` (o `/<il tuo punto di montaggio esterno>/docker/volumes/rocketpool_prometheus-data` se hai personalizzato la posizione di archiviazione di Docker).

## Elementi che **Non** dovrebbero essere sottoposti a Backup

### Chiavi Private e Password

La chiave privata del wallet del tuo nodo e il file della password utilizzato per crittografarla sono archiviati rispettivamente in `~/.rocketpool/data/wallet` e `~/.rocketpool/data/password`.
Questi file in genere non hanno bisogno di essere sottoposti a backup, poiché possono essere recuperati dal tuo mnemonico utilizzando `rocketpool wallet recover`.

Se, per qualche motivo, _decidi_ di eseguire il backup di questi file, dovrai essere **estremamente attento** su come li archivi.
Chiunque ottenga accesso a questi file otterrà accesso al tuo wallet del nodo, ai suoi validatori e a qualsiasi fondo che hai archiviato su di esso per cose come il gas.

**Raccomandiamo vivamente** di non eseguire il backup di questi file e di utilizzare semplicemente il mnemonico del wallet per recuperarli se necessario.

### Dati della Chain del Consensus Client

A differenza dei dati dell'Execution layer, i dati del Consensus layer non sono così importanti per il tuo nodo grazie alla [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
I Consensus client possono facilmente utilizzare questa tecnica per risincronizzarsi immediatamente all'head della Beacon chain e riprendere i compiti di validazione.

## Backup dei dati della Chain Execution

Lo Smartnode viene fornito con la possibilità di eseguire il backup dei dati della chain Execution tramite il comando `rocketpool service export-eth1-data`.
Sotto il cofano, questo utilizza `rsync`, un potente strumento di backup/copia all'interno di Linux.

`rsync` confronta i file nella directory di origine (il tuo volume Docker) e nella directory di destinazione (la tua posizione di backup).
Se un file di origine non esiste nella directory di destinazione, verrà copiato interamente.
Tuttavia, se _esiste_, `rsync` copierà solo le _modifiche_ tra i due file.

Questo significa che il primo backup richiederà una buona quantità di tempo poiché deve copiare tutti i dati inizialmente.
I backup successivi copieranno solo le modifiche tra il backup precedente e ora, rendendo il processo molto più veloce.

Come parte di una strategia di backup, potresti voler pianificare di eseguire `export-eth1-data` su base regolare.
Per garantire l'integrità dei dati della chain, l'esecuzione di questo comando **arresterà in sicurezza l'Execution client prima di eseguire il backup dei suoi dati**.
Se scegli di pianificarlo ogni settimana, il tuo Execution client sarà inattivo solo per pochi minuti mentre aggiorna il backup.
Questo è certamente meglio dei giorni che richiederebbe risincronizzare i dati da zero.

Per attivare un backup, inizia **montando il supporto di archiviazione su cui desideri esportare i dati**.
Per esempio, questo potrebbe essere un hard drive esterno.

::: tip SUGGERIMENTO
Se non sai come montare dispositivi esterni su Linux, è facile!
Collega il dispositivo al tuo nodo e segui [una guida come questa](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/) per imparare come montarlo.
:::

Una volta montato, annota il suo percorso di montaggio.
Per questo esempio, assumiamo di voler archiviare i dati della chain in una cartella chiamata `/mnt/external-drive` su cui è montato il dispositivo esterno.
Sostituisci questo con il tuo percorso di montaggio effettivo ovunque lo vedi di seguito.

Ora, eseguite il seguente comando:

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Questo verificherà che la tua cartella di destinazione sia raggiungibile e abbia abbastanza spazio libero per archiviare i dati della chain.
L'output sarà simile a questo:

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Come puoi vedere, i dati della chain saranno sotto i 100 GB (per la testnet Hoodi; la mainnet di Ethereum sarà un ordine di grandezza maggiore) e la cartella esterna ha 287 GiB liberi quindi l'esportazione può continuare.

Quando sei pronto, inserisci `y` qui e premi `Enter`.
Questo fermerà il tuo Execution client e inizierà a copiare i suoi dati della chain nella tua cartella di destinazione.
Vedrai il progresso di ogni singolo file scorrere sullo schermo mentre viene eseguito.

::: warning NOTA
È importante che _non_ esci dal terminale mentre questo è in esecuzione.
Se lo fai, la copia continuerà a essere eseguita in background ma non sarai in grado di seguirne il progresso!
:::

Una volta terminato, riavvierà automaticamente il tuo container Execution client.

**Nota che i tuoi dati della chain esistenti non vengono eliminati dal tuo nodo dopo il completamento dell'esportazione!**

### Ripristinare i tuoi Dati della Chain Execution

Se mai dovessi ripristinare i dati della chain di cui hai eseguito il backup, esegui semplicemente il seguente comando.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger ATTENZIONE
Questo eliminerà automaticamente tutti i dati esistenti dell'Execution client nel tuo volume `rocketpool_eth1clientdata`!
:::

Una volta completato, il tuo Execution client sarà pronto per partire.
