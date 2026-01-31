# Preparazione di un Mac

Prima di installare Rocket Pool, ci sono alcuni controlli che dovresti fare per assicurarti che il tuo sistema sia compatibile e funzioni correttamente.

::: danger
Ti incoraggiamo vivamente a creare una macchina dedicata per l'esecuzione di un nodo Rocket Pool.
L'esecuzione di un nodo su una macchina di uso generale, come il tuo desktop di lavoro quotidiano, presenta rischi di sicurezza extra che potrebbero compromettere il tuo wallet e risultare nel furto delle tue monete.

**Per la massima sicurezza, costruisci una nuova macchina dedicata esclusivamente all'esecuzione di un nodo.**
:::

## Requisiti di Sistema

Di seguito è riportata una breve descrizione dei requisiti software e hardware che un nodo Rocket Pool richiede.
Questa guida presuppone che tu abbia già la tua macchina fisicamente costruita e il sistema operativo installato.

### Sistemi Operativi Supportati

Rocket Pool raccomanda di utilizzare l'ultima versione di macOS per il tuo hardware.

### Supporto macOS

Dovrai installare i seguenti prerequisiti:

Ti consigliamo vivamente di utilizzare [Homebrew](https://brew.sh) come gestore di pacchetti per Mac. Ti permette di installare facilmente i pacchetti usando il comando `brew`.

Puoi installarlo tramite

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Dovrebbe installare alcuni prerequisiti per te, come XCode Command Line Tools. Se non lo fa, puoi installarli manualmente usando

```shell
xcode-select --install
```

Una volta installato, assicurati che tutto funzioni correttamente usando

```shell
brew doctor
```

Una volta che tutto è installato e funzionante, Homebrew ti permetterà di installare pacchetti usando il comando `brew`.

Ad esempio, per installare `wget` usando Homebrew esegui il seguente comando nel Terminale:

```shell
brew install wget
```

Ora che abbiamo Homebrew installato, possiamo installare il nostro client Docker, [Orbstack](https://orbstack.dev).

```shell
brew install --cask orbstack
```

Orbstack verrà installato nella tua cartella Applicazioni. Avvialo da lì e si inizializzerà. Se stai migrando da Docker Desktop, dovrebbe rilevare la tua installazione Docker esistente e migrare le tue immagini e container.

Potresti dover regolare le impostazioni di Orbstack a seconda del tuo hardware.

Se hai precedentemente installato Docker Desktop, dovrai prima disinstallarlo. Docker Desktop era il client Docker consigliato, tuttavia nell'ultimo anno sono stati rilasciati alcuni nuovi client che offrono una stabilità molto migliore.

Assicurati che il tuo Firewall (Impostazioni di Sistema -> Rete -> Firewall) sia attivato e che Orbstack sia aggiunto all'elenco delle applicazioni che consentono connessioni in entrata. (Orbstack dovrebbe farlo per te)

![](../local/images/mac/firewall.png)

### Installazione e Utilizzo di SSH

SSH dovrebbe già essere installato con macOS.

### Controlli del Sistema Pre-installazione

Prima di installare Rocket Pool, rivedi la seguente checklist:

- Il tuo sistema è completamente costruito, si accende e può avviarsi nel sistema operativo.
- Non farai nessun'altra attività sul sistema, come navigare su Internet, controllare la posta elettronica o giocare.
- Hai un sistema operativo macOS installato.
- Il tuo account utente ha privilegi root / amministratore.
- Hai un SSD che soddisfa i requisiti di prestazioni.
- Il tuo SSD è montato sul tuo file system.
- Hai almeno 1,5TB di spazio libero per il processo di sincronizzazione iniziale di Execution e Consensus.
- Se il tuo ISP limita i tuoi dati, è più di 2 TB al mese.

Se hai controllato e confermato tutti questi elementi, allora sei pronto per installare Rocket Pool e iniziare a eseguire un nodo!
Passa alla sezione [Scelta dei tuoi Client ETH](../eth-clients).
