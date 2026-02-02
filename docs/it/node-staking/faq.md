# FAQ (WIP)

### Quali sono i vantaggi di gestire minipool con Rocket Pool rispetto a un validator solo da 32 ETH?

Gestendo un singolo validator solo, riceveresti il 100% delle ricompense sui tuoi 32 ETH.
Gestendo due minipool da 16 ETH, riceveresti il 100% delle ricompense sui tuoi 32 ETH **più** il 14% delle ricompense sui 32 ETH forniti dal protocollo Rocket Pool.
Gestendo quattro minipool da 8 ETH, riceveresti il 100% delle ricompense sui tuoi 32 ETH **più** il 14% delle ricompense sui 96 ETH forniti dal protocollo Rocket Pool.
Avresti anche l'opzione di utilizzare la funzionalità [Smoothing Pool](./prepare-node.mdx#smoothing-pool) di Rocket Pool.

### Come faccio a sapere quanto vale il mio rETH? Fa rebase?

Il token rETH non farà rebase.
Il numero di token nel tuo wallet rimarrà costante ma si apprezzeranno di valore nel tempo.

### Ho un problema tecnico nell'esecuzione del mio nodo, come posso ottenere aiuto?

Puoi iniziare controllando la pagina [Rocket Pool Support](https://rocketpool.support).
Se questo non aiuta, puoi fare la tua domanda sul canale **#support** di Rocket Pool nel [server Discord](https://discord.gg/rocketpool).

### Come posso ottenere ETH di test per sperimentare con la creazione e l'esecuzione di un minipool? Non posso pubblicare messaggi sul canale faucet.

Vedi [Ottenere ETH di test su Hoodi](./testnet/overview#getting-test-eth-on-hoodi).

### Come recupero il mio nodo se la mia macchina si rompe?

Risposta breve: il tuo mnemonico è tutto ciò di cui hai bisogno per recuperare completamente il tuo nodo.
Assicurati sempre di tenerlo al sicuro.

Per recuperare il tuo nodo su una nuova macchina, inizia assicurandoti che **la tua macchina precedente non sarà online di nuovo** con le chiavi disponibili, poiché due nodi in esecuzione con le stesse chiavi **ti faranno slashare**.
Segui i [passaggi](./install-modes) per installare lo Smartnode su una nuova macchina.
Quindi, recupera il tuo wallet del nodo e le chiavi validator eseguendo il comando `rocketpool wallet recover` e inserendo il tuo mnemonico di 24 parole.

### Perché i miei client non si sincronizzano? Ho un numero basso di peer.

I client devono avere un numero sano di peer per potersi sincronizzare correttamente.
Puoi iniziare eseguendo il test [qui](https://www.yougetsignal.com/tools/open-ports/), controllando se le porte 30303 e 9001 sono aperte.
Se sono chiuse, dovrai configurare l'inoltro delle porte sul tuo router.
Inoltre, assicurati che il tuo nodo abbia un indirizzo IP locale statico in modo che l'inoltro delle porte non si interrompa a causa del fatto che il tuo nodo ottiene un nuovo indirizzo.

### Il mio client consensus sta impiegando troppo tempo per sincronizzarsi. Cosa dovrei fare?

I client consensus possono impiegare molto tempo per sincronizzarsi se non hai avviato il processo di sincronizzazione usando [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Anche se lo stai eseguendo da molto tempo, di solito è più veloce configurare l'URL di checkpoint sync, cancellare i dati di sincronizzazione correnti con `rocketpool service resync-eth2` e ricominciare.
Il tuo client dovrebbe essere sincronizzato in meno di un minuto.

### Ho già riavviato. Perché Grafana dice che devo ancora riavviare?

Le informazioni sul riavvio sono memorizzate nella cache e si aggiornano solo ogni poche ore.
Eseguire `sudo apt update` forzerà un aggiornamento.

### Ho cambiato il mio Execution Layer e/o la mia Beacon Chain o Consensus Layer. Come pulisco i vecchi dati?

Se cambi client, Rocketpool non elimina i vecchi volumi. Questi dati potrebbero sprecare spazio disco significativo e potresti volerli rimuovere. Per farlo, devi trovare i volumi. Se stai usando le impostazioni predefinite di Rocketpool, i volumi docker sono memorizzati in `/var/lib/docker/volumes/`. L'execution layer è in `rocketpool_eth1clientdata/_data/*` e il consensus layer è in `rocketpool_eth2clientdata/_data/*`.

Per accedere a queste directory, potresti dover fare sudo come root usando `sudo -i`. Quindi puoi eliminare una directory chiamando `rm -rf <directory>`. Ad esempio, se volessi eliminare tutti i dati geth, chiameresti `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`.

Per uscire come root, digita `exit`.
