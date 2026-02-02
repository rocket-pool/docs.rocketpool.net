# Requisiti del Nodo e Scelta della Piattaforma

Bene!
Quindi hai deciso di provare a eseguire un nodo Rocket Pool.
Il primo passo del processo è decidere che tipo di piattaforma vuoi utilizzare per eseguire il tuo nodo.
Se ne hai già una in mente, ottimo!
Puoi passare alla sezione successiva.
Se non sei ancora sicuro, continua a leggere per informazioni sulle tue opzioni.

## Requisiti del Nodo Completo

Un **nodo completo** è uno che esegue sia un client Execution che un client Consensus insieme allo stack Rocket Pool.
Ora che è avvenuto il Merge, i nodi Rocket Pool devono eseguire questa configurazione (anche se i client Execution e Consensus possono essere gestiti esternamente per gli utenti che già eseguono una configurazione di solo staking - tratteremo questo in maggiore dettaglio più avanti).

Ecco una semplice suddivisione di ciò che è necessario per eseguire bene un nodo Rocket Pool completo:

- Una **connessione Internet stabile**. Più a lungo rimani online, migliori sono le tue ricompense. Una connessione Internet instabile danneggerà i tuoi rendimenti e, di conseguenza, la crescita del rapporto rETH.
- Almeno **10Mbps di larghezza di banda sia in upload che in download**. Un nodo completo di solito utilizza circa 8Mbps a 10Mbps di traffico di rete in upload e download, a seconda della tua configurazione e del numero di minipool.
- **Nessun limite di dati** imposto dal tuo ISP. L'esecuzione di un nodo completo richiederà molti dati - abbiamo visto rapporti di oltre 2 TB al mese solo per i dati della catena. Questo può essere mitigato in qualche modo con alcune modifiche alle impostazioni dei client ETH, ma come regola generale, non eseguire un nodo completo se il tuo piano Internet ha un limite di dati mensile.
- **Elettricità stabile**. Per lo stesso motivo per cui è necessaria una connessione Internet stabile, vuoi anche avere energia affidabile. Questo può essere mitigato con un UPS grande (batteria di backup) per affrontare brevi blackout.
- Un **computer** con specifiche sufficienti. Questo è abbastanza flessibile perché dipende _davvero_ da quale client Execution e Consensus usi e con quali impostazioni li configuri. Il computer può essere una macchina locale o può essere ospitato nel cloud. Leggi qui sotto per ulteriori informazioni su queste due opzioni e su come decidere quale è meglio per te.

Il computer deve soddisfare le [linee guida hardware](./local/hardware.md)

::: warning NOTA
Al momento, sono supportate solo le piattaforme **Linux** e **macOS**.
**Windows non è attualmente supportato** per il funzionamento di Smartnode.
:::

## Esecuzione di un Nodo Locale

Se hai elettricità affidabile e accesso a Internet senza limiti di dati, e sei disposto a costruire (o acquistare già pronto) e mantenere un computer, allora eseguire un nodo locale potrebbe essere un'ottima scelta per te. Con questa opzione, configurerai un computer dedicato come nodo Rocket Pool e lo eseguirai localmente nella tua casa.

Vantaggi:

- Nessun costo mensile, a parte le utenze
- Controllo completo sulla tua macchina e sui suoi dati (inclusa la chiave del tuo wallet)
- Accesso per eseguire manutenzione e aggiornamenti quando vuoi
- Contribuisce alla decentralizzazione di Execution e Consensus, e di Rocket Pool (e quindi, alla loro sicurezza)

Svantaggi:

- Richiede Internet ed elettricità stabili e senza limiti di dati
  - **L'esecuzione di un nodo utilizza almeno 1,5 TB di dati al mese. Se hai un limite di dati inferiore a questo importo, potresti riscontrare problemi durante l'esecuzione di un nodo locale!**
- Sei l'unico responsabile della sicurezza della rete e del computer
- Può essere impegnativo se non hai esperienza con la manutenzione del computer
- Vulnerabile al furto

Se i vantaggi sembrano superare gli svantaggi per te, dai un'occhiata alla nostra [Guida per Operatori di Nodi Locali](./local/hardware.html).

## Esecuzione su un Server

Se non hai un piano Internet affidabile e senza limiti di dati, o semplicemente non vuoi occuparti della costruzione e manutenzione del tuo computer fisico, potresti voler considerare l'esecuzione di un server privato che affitti da un provider di hosting. Essenzialmente, queste aziende creeranno ed eseguiranno volentieri un server per te, a fronte di un costo mensile. Se non ti dispiace quel costo e vuoi eseguire un nodo Rocket Pool, l'utilizzo di un server può essere una buona strategia.

Vantaggi:

- Nessuna manutenzione, il supporto è solitamente disponibile per risolvere i problemi
- Non influisce sul tuo piano Internet o sul limite di dati
- Solitamente eseguiti in un data center professionale, molto poco tempo di inattività
- Può essere più conveniente rispetto all'acquisto/costruzione del tuo computer

Svantaggi:

- Rende Execution e Consensus, e Rocket Pool in qualche modo più centralizzati, il che indebolisce la sicurezza delle reti
- Costi mensili
- I server possono avere limiti di dati o tariffe di I/O di rete costose
- Possibilità per gli host di esaminare i contenuti della tua macchina e prendere la chiave del tuo wallet se non protetti

Se questi vantaggi sembrano superare gli svantaggi per te, dai un'occhiata alla nostra [Guida per Operatori di Nodi Server](./vps/providers.html).
