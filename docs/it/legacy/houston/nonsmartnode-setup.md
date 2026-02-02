# Configurazione del voto per utenti non-smartnode

Alcuni utenti (ad esempio, gli utenti di Allnodes) non utilizzano lo smartnode e potrebbero aver bisogno di configurare il voto tramite interazione diretta con i contratti.
Questa guida contiene sia una guida di configurazione minima che una completa per tali utenti.

::: tip
Il tuo indirizzo nodo dovrebbe essere caricato su un hardware wallet per questo.
:::

## Guida di configurazione minima

Questo permette al tuo delegato di votare per te on-chain e off-chain. Potrai sovrascrivere il tuo delegato on-chain, ma non off-chain.

- Usa etherscan per inizializzare il potere di voto ("Connect to Web3" con l'indirizzo nodo) con un delegato https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Puoi trovare i delegati su https://delegates.rocketpool.net/

## Guida di configurazione completa

Usa etherscan per inizializzare il potere di voto ("Connect to Web3" con l'indirizzo nodo)

- [consigliato per la maggior parte] Inizializza il voto con un nodo diverso come delegato https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Puoi trovare i delegati su https://delegates.rocketpool.net/
  - Ricorda che potrai sempre sovrascrivere i tuoi delegati
- Inizializza il voto con il tuo stesso nodo come delegato https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Qui sarai responsabile di votare ogni volta
  - Suggerirei principalmente questa opzione per coloro che desiderano essere delegati poiché _devono_ votare ogni volta.
- Se il tuo nodo è stato registrato dopo Houston:
  - Avrai già il tuo potere di voto inizializzato con il tuo stesso nodo come delegato
  - Puoi impostare un nuovo delegato con https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Imposta l'indirizzo di segnalazione snapshot:

- Vai su https://node.rocketpool.net/signalling-address e connetti il tuo indirizzo nodo
  - Inserisci l'indirizzo di segnalazione snapshot desiderato e firma il messaggio per ottenere gli argomenti r, s e v di cui avrai bisogno
  - Nota: il tuo indirizzo di segnalazione snapshot NON DEVE essere il tuo indirizzo nodo
- In una nuova scheda, vai su https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Connect to Web3" con l'indirizzo nodo
  - Compila gli argomenti con il tuo indirizzo di segnalazione e i parametri r, s, v forniti nel passaggio precedente
