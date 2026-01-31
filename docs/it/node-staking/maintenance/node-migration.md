# Spostamento da un Nodo all'Altro

A volte, la vostra macchina nodo non è più in grado di svolgere il suo lavoro e dovete spostarvi su un'altra.
Questo potrebbe accadere se state aggiornando il vostro nodo ad esempio, o se vi state spostando da un nodo basato su cloud a uno ospitato localmente su hardware dedicato, o anche se il vostro nodo stesso subisce un guasto hardware catastrofico e dovete eseguire i vostri validatori su una macchina di backup.
Indipendentemente dal caso, questa guida vi aiuterà a capire come migrare in sicurezza il vostro portafoglio e le chiavi del validatore da un nodo all'altro senza essere slashati.

## Slashing e Database di Slashing

Il motivo principale per cui vi incoraggiamo a esercitare tanta cautela quando spostate il vostro portafoglio da una macchina all'altra, o recuperate il vostro portafoglio su un'altra macchina, è a causa del rischio di **slashing**.
Lo slashing si verifica quando una o più delle vostre chiavi validatore fanno qualcosa che viola le regole della Beacon Chain e sembra che stiate tentando di attaccare la rete.
In risposta, la catena farà uscire forzatamente il vostro validatore e applicherà una penalità severa - la dimensione della penalità dipende da quanti validatori vengono anche slashati entro un periodo di due settimane dal vostro, ma attualmente il minimo è **1 ETH** e non c'è massimo.

Sebbene ci siano diverse condizioni che possono essere interpretate come "attacco alla rete", realisticamente l'unica che accade accidentalmente è la **doppia attestazione** (o **doppia proposta**).
Questo si verifica quando il vostro validatore invia due attestazioni (o due proposte di blocco) per lo stesso slot che hanno voti diversi (ad esempio, vota su due blocchi candidati diversi per un particolare slot invece di sceglierne uno).

Per combattere questo, il vostro Validator Client ospita quello che viene chiamato un **Database di Slashing**.
Il Database di Slashing è semplicemente un record dei voti del vostro validatore (ovvero, lo slot di ogni voto e l'hash del blocco per cui quel voto era), quindi sa di non votare su qualcosa su cui ha già votato.

### Evitare di Essere Slashato

Ogni Validator Client mantiene un Database di Slashing per garantire che il vostro nodo non attesti mai due volte o proponga due volte.
Il problema, quindi, deriva da situazioni in cui iniziate a validare **senza** un database di slashing e quindi non avete alcun record di ciò su cui i vostri validatori hanno precedentemente votato.
Questo può accadere in diverse situazioni:

1. Avete appena cambiato client di consenso e il nuovo client non trasferisce il Database di Slashing dal vecchio (cosa che lo Smartnode non fa durante un cambio di client).
2. Avete il vostro portafoglio caricato su una macchina e state attestando attivamente con esso, e poi caricate il vostro portafoglio su una seconda macchina _mentre la prima macchina sta ancora attestando attivamente_.
3. Smettete di validare su una macchina e caricate il vostro portafoglio in una seconda macchina, ma non avete aspettato abbastanza a lungo affinché l'epoca corrente venga finalizzata, quindi la vostra seconda macchina attesta per slot per cui i vostri validatori hanno già attestato.

Il modo standard per evitare di essere slashati è **attendere almeno 15 minuti dopo la vostra ultima attestazione riuscita** prima di avviare il vostro Validator Client e attestare di nuovo, e **assicurarvi che le vostre chiavi validatore siano presenti solo su una singola macchina**.

Più specificamente, il piano è attendere fino a quando il vostro validatore ha intenzionalmente perso un'attestazione, **e quella mancanza è stata finalizzata**.
Una volta raggiunta la finalità, il vostro validatore non può più votare per l'epoca finalizzata ed è sicuro iniziare ad attestare nuovamente con esso.

L'attesa di 15 minuti deriva da una regola pratica secondo cui quando opera normalmente (ad es. con consenso normale), la Beacon Chain impiega circa 7 minuti per finalizzare un'epoca.
Attendere 15 minuti garantisce che abbiate perso almeno un'epoca e che abbiate aspettato abbastanza a lungo affinché quell'epoca venga finalizzata, con un piccolo buffer solo per sicurezza.

## Checklist di Migrazione del Nodo

Con il contesto di cui sopra in mente, ecco una checklist utile che potete seguire quando migrate il vostro nodo per assicurarvi di non essere slashati.
Questo è progettato per la massima sicurezza, quindi mentre potreste pensare che alcuni dei passaggi siano inutili, vi **incoraggiamo vivamente** a seguirli tutti fino al completamento.

1. **Preparate il nuovo nodo** seguendo queste guide, partendo dalla sezione "Preparazione di un Nodo" e terminando una volta installato lo Smartnode e sincronizzati un client di esecuzione e consenso.
   - :warning: **NON** inizializzare un nuovo portafoglio o recuperare il vostro vecchio portafoglio sul nodo. Consentite la sincronizzazione dei client _senza un portafoglio presente_.

2. **ATTENDETE** fino a quando i vostri client sono completamente sincronizzati sul nuovo nodo.
3. Confermate di aver registrato correttamente il vostro mnemonico eseguendo `rocketpool wallet test-recovery` sulla vostra nuova macchina. Questo _simulerà_ il recupero delle chiavi per confermare che il portafoglio del vostro nodo e tutte le chiavi validatore dei vostri minipool possono essere recuperate correttamente, ma non le _recupererà effettivamente_ e non le salverà su disco, quindi non c'è rischio di slashing.
   1. Se lo Smartnode non riesce a recuperare il portafoglio del vostro nodo utilizzando il mnemonico che avete fornito, allora il vostro mnemonico potrebbe essere non valido. **INTERROMPETE** questo processo; rimuovere le chiavi dal vostro vecchio nodo significa che potrebbero essere **perse per sempre**.
   2. In questa situazione consigliamo di uscire dai vostri validatori e prelevare il vostro capitale il prima possibile, in modo da poter ricominciare con un nuovo nodo per il quale avete il mnemonico funzionante.
4. **Interrompete la validazione** sul vostro vecchio nodo (ad esempio, utilizzando `rocketpool service stop` per arrestare il Validator Client).
5. **Eliminate le vostre chiavi** dal vostro vecchio nodo (ad esempio, utilizzando `rocketpool wallet purge`).
   1. **VERIFICATE** che le chiavi siano state rimosse controllando la cartella `data` del vostro nodo (il predefinito è `~/.rocketpool/data/validators/`) - ogni client di consenso avrà la propria cartella sotto quella cartella dati con la propria copia delle chiavi.
   2. Consultate la sezione [Verifica della Rimozione delle Chiavi](#verifying-key-removal) di seguito per le istruzioni su come farlo.
   3. Assicuratevi che **tutte** siano state eliminate.

6. **Spegnete** il vostro vecchio nodo e disconnettetelo da Internet, rimuovendo il cavo Ethernet o il modulo Wi-Fi.

7. **Cancellate l'SSD** dal vostro vecchio nodo, utilizzando uno dei seguenti metodi:
   1. Usate un'unità USB avviabile con un'installazione Linux (come il popolare [GParted](https://gparted.org/download.php)) e usatela per cancellare l'unità.
   2. **Rimuovetelo fisicamente** dal vostro vecchio nodo, collegatelo a un'altra macchina utilizzando un convertitore USB e usate uno strumento come [GParted](https://installati.one/debian/11/gparted/) per cancellare l'unità.
   3. **Rimuovetelo fisicamente** dal vostro vecchio nodo e colpitelo con un martello per romperlo e assicurarvi che non venga mai più utilizzato.

8. **ATTENDETE** almeno 15 minuti prima di procedere. Usate un block explorer come [https://beaconcha.in](https://beaconcha.in) per guardare il record di attestazione del vostro validatore. Attendete fino a quando almeno un'attestazione è stata registrata come mancante _e l'epoca corrispondente è stata finalizzata_.
   1. NOTA: se avete più minipool, dovete assicurarvi che _tutti_ abbiano perso almeno un'attestazione che è stata finalizzata.

9. **Recuperate il portafoglio del vostro nodo** sulla nuova macchina seguendo le istruzioni in [Importazione / Recupero di un Portafoglio Esistente](../recovering-rp.mdx).

10. **Riavviate il vostro Validator Client** per assicurarvi che le vostre chiavi validatore siano caricate (ad es., con `docker restart rocketpool_validator`).

Le vostre chiavi validatore saranno ora caricate sul vostro nuovo nodo e potrete iniziare ad attestare in sicurezza con esso.

## Verifica della Rimozione delle Chiavi

Le chiavi validatore sono memorizzate sul vostro disco sotto forma di file `json`.
Sono conservate all'interno della cartella `data` del vostro nodo.
Per impostazione predefinita, potete trovarle qui:

```shell
~/.rocketpool/data/validators/
```

::: warning NOTA
Se avete modificato la vostra directory `data` utilizzando la TUI `service config` (ad es., state usando una chiave Aegis e l'avete impostata come cartella `data`, il percorso sopra dovrebbe essere cambiato in `<your data folder>/validators`.)
:::

Ogni client avrà la propria copia delle chiavi, poiché ogni client le prevede in un formato o configurazione diversa.

Per **trovare** le chiavi sul disco, eseguite il seguente comando:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Ad esempio, su una macchina con due minipool, l'output sarebbe simile a questo:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

Questo mostra un esempio in cui le chiavi **non** sono state ancora eliminate e sono ancora sul filesystem.

Se le vostre chiavi **sono state** eliminate, non dovreste vedere _nessuna_ delle stringhe esadecimali (le grandi stringhe che iniziano con `0x`) in nessuna delle cartelle per nessuno dei client nell'output di quel comando.
