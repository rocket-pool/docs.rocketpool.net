# Monitoraggio del tuo Nodo Oracle DAO

Una volta che il tuo nodo è attivo e funzionante, è importante monitorarne regolarmente lo stato di salute per assicurarsi che stia eseguendo correttamente i propri compiti automatizzati.
Questo comporta le seguenti attività:

- Monitorare lo stato di salute del tuo sistema fisico (o virtuale) a livello di sistema operativo
- Monitorare lo stato di salute dei tuoi client Execution e/o Consensus (se esegui client locali)
- Assicurarti che il tuo nodo stia regolarmente inviando le transazioni richieste alla blockchain per gli aggiornamenti di stato
- Assicurarti di avere un saldo ETH sufficiente nel wallet del tuo nodo per eseguire quelle transazioni
- Applicare regolarmente gli aggiornamenti allo Smartnode, ai tuoi client (se applicabile) e al tuo sistema operativo
- Monitorare lo stato di salute degli altri membri dell'Oracle DAO e comunicare con loro se ritieni che i loro nodi non stiano funzionando correttamente

In questa sezione, descriveremo alcuni esempi di come fare ciò tramite il supporto integrato di [Grafana](https://grafana.com/) dello Smartnode.

## La Dashboard Standard di Rocket Pool

Lo Smartnode fornisce una dashboard conveniente che consente di monitorare molte delle metriche elencate sopra.
C'è una dashboard per ogni client Consensus.
Di seguito è riportato un esempio della dashboard per Nimbus:

![](../node-staking/images/nimbus-dashboard.png)

- Lo stato di salute dell'hardware della tua macchina è visualizzato nel quadrante in alto a sinistra.
- Il tuo client Execution funziona correttamente se le statistiche di rete nel quadrante in basso a sinistra vengono popolate.
- Il tuo client Consensus funziona correttamente se il conteggio dei peer nel quadrante in alto a destra si aggiorna con un numero diverso da zero; il numero esatto dipende dalla scelta del client e dalla configurazione di rete.
- Il saldo ETH del tuo nodo è visualizzato nella tabella in basso a destra.
- Eventuali aggiornamenti del sistema operativo o dello Smartnode sono presentati nella casella `Available Updates` nel pannello centrale superiore.

::: tip NOTA
Gli aggiornamenti del sistema operativo e dello Smartnode richiedono l'update tracker, che puoi installare tramite `rocketpool service install-update-tracker`.
:::

Per informazioni su come preparare il sistema delle metriche e la dashboard dello Smartnode, visita le pagine [Monitoring your Node's Performance](../node-staking/performance) e [Setting up the Grafana Dashboard](../node-staking/grafana.mdx) della documentazione dello Smartnode.

## La Dashboard dell'Oracle DAO

Abbiamo anche costruito una semplice dashboard specificamente progettata per i membri dell'Oracle DAO:

![](../odao/images/odao-dashboard.png)

Questa dashboard tiene traccia di quanto segue:

- Lo stato delle proposte dell'Oracle DAO su cui è necessario votare o da eseguire (maggiori dettagli su questi nella prossima sezione)
- La cronologia degli invii per gli aggiornamenti di prezzo e saldo\*
- I saldi ETH di ciascun nodo Oracle DAO

\*_Nota che l'invio di aggiornamenti di prezzo e saldo richiede attualmente un quorum del 51% dei nodi per concordare su ciascuno, dopo di che l'invio viene canonizzato. Gli invii di altri membri verranno ripristinati poiché non sono più richiesti, quindi se il tuo nodo non invia per un dato intervallo, non significa che sia offline. Dovresti preoccuparti se perdi più di 5 intervalli consecutivi di seguito e dovresti controllare i log del daemon `watchtower` per verificare che non ci siano problemi._

L'abilitazione di questa dashboard è un processo in due passaggi.

Innanzitutto, abilita le metriche dell'Oracle DAO nella sezione `Metrics` dell'editor `rocketpool service config`:

![](../odao/images/tui-odao-metrics.png)

Se stai eseguendo in modalità Docker o Hybrid, questo riavvierà il tuo daemon `node` per applicare le modifiche.
Se stai eseguendo in modalità Native, riavvia manualmente il servizio `node`.

In secondo luogo, importa la [dashboard Oracle DAO](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) da Grafana Labs (ID `15003`) nel server Grafana locale del tuo nodo.

## Controllo dei Log

Se tu o uno degli altri membri dell'Oracle DAO hai espresso preoccupazione riguardo al tuo nodo, la prima linea di difesa è esaminare i log del daemon `watchtower` utilizzando (per le modalità Docker e Hybrid) il seguente comando:

```shell
rocketpool service logs watchtower
```

Questo mostrerà i log `docker` per il container watchtower, troncando alle ultime cento righe circa.

Per andare più indietro, puoi usare il flag `-t` per indicare il numero di righe.
Ad esempio:

```shell
rocketpool service logs watchtower -t 2000
```

mostrerà le ultime 2000 righe.
Poiché questo diventerà molto disordinato rapidamente, potresti voler reindirizzare questo output in un'utilità come `less` in modo che sia scorrevole.

## Passaggi Successivi

Nella prossima sezione, copriremo i compiti che devi eseguire manualmente come membro dell'Oracle DAO.
