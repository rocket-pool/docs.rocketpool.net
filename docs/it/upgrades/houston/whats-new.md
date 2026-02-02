---
next:
  text: The Protocol DAO
  link: "/it/legacy/houston/pdao"
---

# L'Aggiornamento Houston

L'aggiornamento Houston è in gran parte mirato a introdurre una DAO completamente on-chain per governare il protocollo, conosciuta come Protocol DAO o pDAO. È una DAO come nessun'altra e non richiede votazioni snapshot o altri strumenti di terze parti per funzionare, è veramente on-chain e unica nel suo genere, più su questo qui sotto.

Questo aggiornamento introdurrà anche altre funzionalità molto interessanti che permetteranno la costruzione di nuove integrazioni e piattaforme sul protocollo. Alcune di queste includono la capacità di fare staking di ETH per conto del nodo (non solo dal nodo stesso) e una nuova funzionalità di indirizzo di prelievo RPL, che consente a una parte di fornire gli ETH per lo staking e a un'altra parte di fornire l'RPL senza dare la custodia al node operator.

## Protocol DAO

La Rocket Pool Protocol DAO (pDAO) è responsabile di dare forma alla direzione del protocollo ed è gestita dalla governance RPL. I suoi membri e il loro potere di voto sono composti da node operator, grandi e piccoli, tutti i quali partecipano direttamente al protocollo.

Tipicamente la governance DAO nello spazio crypto più ampio viene fatta attraverso votazioni ponderate per token. Fondamentalmente, più token detieni per un protocollo/progetto, maggiore è il tuo potere di voto. Inoltre non hai bisogno di partecipare attivamente al protocollo, semplicemente detenere i token è sufficiente.

Questo stile di governance volevamo evitarlo. Se vuoi aiutare a dirigere e guidare il futuro di Rocket Pool, devi essere attivamente coinvolto, non solo conservare token in un cold wallet. Dal più grande fondo Venture Capitalist al tuo normale tizio che gestisce un singolo minipool, dovrai partecipare attivamente al protocollo per aiutare a governarlo.

Attualmente la protocol DAO ha il controllo su una varietà di impostazioni on-chain che vengono utilizzate nel protocollo. Nuove Rocket Pool Improvement Proposal (RPIP) possono essere fatte e votate da questi Node Operator all'interno di Rocket Pool. Puoi vedere il [**registro RPIP corrente qui**](https://rpips.rocketpool.net/). Se sei un diavolo per i dettagli, l'attuale RPIP per la protocol DAO on-chain di cui si parla ora può essere trovata qui.

### Cosa può fare la pDAO?

La pDAO ha il controllo su molte impostazioni del protocollo, può spendere fondi della tesoreria e nel nostro aggiornamento Houston, viene fornita con un nuovo consiglio di sicurezza per aiutare a reagire rapidamente in caso di potenziali problemi con il protocollo. Parliamo un po' di più di ciascuno di questi qui sotto.

**Parametri del Protocollo:** Questi controllano certe sfaccettature del protocollo come l'impostazione che controlla l'importo minimo di ETH che può essere depositato per rETH (attualmente 0,01 ETH) o anche controllare la dimensione massima del pool di deposito, questo è la quantità massima di ETH che può essere depositata nel protocollo mentre aspetta di essere assegnata ai node operator per lo staking. Puoi trovare una tabella completa di [queste impostazioni qui](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Fondi della Tesoreria:** L'RPL ha un tasso di inflazione del 5% e una parte di questo è allocata alla tesoreria pDAO. La pDAO ha la capacità di spendere questa tesoreria in una varietà di sforzi orientati al protocollo, dal finanziamento dello sviluppo del protocollo direttamente, gestione di sovvenzioni per finanziare miglioramenti di terze parti e progetti che fanno uso di Rocket Pool e altro. Il nostro aggiornamento Houston aggiunge una nuova capacità dove questi pagamenti dalla tesoreria possono essere fatti non solo in modo forfettario, ma in modo progressivo per aiutare a tracciare gli obiettivi in relazione al finanziamento in corso.

**Consiglio di Sicurezza:** Poiché l'aggiornamento Houston sposta la pDAO a un sistema completamente on-chain, è stata introdotta una nuova misura di sicurezza sotto forma di [consiglio di sicurezza](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council). Questi membri possono essere eletti dalla pDAO e hanno la capacità di mettere in pausa il protocollo rapidamente in caso si verifichino potenziali problemi. Il quorum deve essere raggiunto tra i membri per qualsiasi risposta di sicurezza da eseguire. La pDAO ha anche il potere di rimuovere membri o sciogliere completamente il consiglio di sicurezza se necessario.

### Proposte e Votazioni

Perché qualsiasi sistema di governance funzioni, devono esserci proposte e votazioni. Al momento, la votazione snapshot viene utilizzata per queste impostazioni e modifiche delle proposte, poi è necessario un intervento manuale per eseguire le modifiche. Con l'introduzione dell'[aggiornamento Houston e RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33), questo viene spostato a un nuovo sistema ottimistico di fraud-proof che consente a qualsiasi node operator di sollevare, votare o contestare proposte, direttamente on-chain senza la necessità di strumenti di terze parti.

**Proporre:** Qualsiasi nodo con un potere di voto non zero può sollevare una proposta in qualsiasi momento. Quando lo fa deve bloccare un bond di proposta sotto forma di RPL per l'intero processo di proposta.

**Contestare:** Se un nodo che ha creato una proposta è stato trovato ad averlo fatto con dati errati richiesti, può essere contestato e il contestatore deve fornire un bond per la contestazione. Il nodo che fa la contestazione può essere ricompensato con il bond del proponente fatto quando ha creato la proposta se ha successo, tuttavia se ha fatto una contestazione non valida, il proponente può raccogliere il loro bond di contestazione.

**Votare:** Se una proposta supera il periodo in cui può essere contestata, entra nei periodi di votazione. I node operator possono quindi scegliere di votare in uno dei seguenti modi:

1. Astenersi: Il potere di voto del votante contribuisce al quorum ma non è né a favore né contro la proposta.
2. A favore: Il votante vota a favore dell'esecuzione della proposta.
3. Contro: Il votante vota contro l'esecuzione della proposta.
4. Veto: Il votante vota contro la proposta e indica anche che ritiene la proposta spam o maliziosa. Se il quorum di veto è raggiunto, la proposta viene immediatamente sconfitta e il proponente perde il loro bond. Questo è per scoraggiare spam, proposte di bassa qualità o proposte che non hanno attraversato processi off-chain prima come la segnalazione tramite votazione snapshot.

Ci sono **due periodi di votazione**

- Periodo di Voto 1: Per i votanti o delegati che votano per conto di altri.
- Periodo di Voto 2: Per i votanti che hanno delegato il loro potere e vogliono ribaltare la decisione del loro delegato.

Una volta che entrambi i periodi di votazione sono passati e la proposta ha successo, la proposta può essere eseguita e la modifica viene applicata al protocollo Rocket Pool.

Dopo che la proposta ha superato i periodi di votazione, il proponente può sbloccare il loro bond RPL, a meno che la proposta non sia stata sconfitta da una contestazione o messa in veto.

## Stake ETH per conto di un nodo

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) consente a un account di [fare staking di ETH per conto](../houston/stake-eth-on-behalf.mdx) di un nodo Rocket Pool registrato nel protocollo. Questo supporta una varietà di situazioni in cui il node operator non fornisce direttamente gli ETH:

- Sicurezza migliorata per i node operator, poiché possono fare staking direttamente dal loro hardware wallet, eliminando la necessità di trasferire fondi al nodo in anticipo.
- Provider Staking as a Service dove la custodia dei fondi è gestita da un custode fidato.
- Integrazioni di protocollo dove la custodia dei fondi è gestita da smart contract.
- DAO o organizzazioni dove la custodia dei fondi è gestita da una tesoreria.

Sebbene l'obiettivo principale di questa funzionalità sia facilitare scenari con un singolo depositante, vale la pena notare che più depositanti indipendenti possono anche sfruttare questa capacità creando smart contract stratificati sopra. Rocket Pool ha anche introdotto la capacità di fare staking di RPL per conto di già nel nostro precedente rilascio Atlas.

## Indirizzo di Prelievo RPL

Rocket Pool attualmente consente ai node operator di specificare un indirizzo di prelievo per i loro ETH e RPL. Questo potrebbe essere un hardware wallet esterno o qualcosa di simile sicuro.

Con [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31), puoi impostare un indirizzo di prelievo per i tuoi ETH e [uno nuovo per il tuo RPL](../houston/rpl-withdrawal-address) se lo desideri. L'indirizzo di prelievo RPL se impostato sarà in grado di attivare e rivendicare RPL dalle ricompense di inflazione e non avrà effetto sulle ricompense di consenso ETH o su qualsiasi cosa relativa a ETH.

Questo crea alcune opportunità interessanti dove l'RPL può essere fornito da un'entità a un node operator che non desidera avere esposizione all'RPL. Quell'entità può quindi rivendicare le ricompense RPL per aver messo il collaterale assicurativo richiesto per il nodo.

## Submission di Saldi e Prezzi RPL Basate sul Tempo

I nodi Rocket Pool devono avere almeno il 10% di collaterale in RPL in staking per essere idonei alle ricompense, con il loro "stake effettivo" calcolato in base al rapporto ETH:RPL, che viene riportato dall'Oracle DAO alla fine di ogni intervallo di ricompense. In precedenza, questa "finestra di ricarica" (il tempo tra il rapporto RPL finale e la fine dell'intervallo) aveva una certa incertezza e fluttuava da intervallo a intervallo perché veniva specificata in numero di blocchi. Questo era valido pre-merge ma non teneva conto della variabilità e casualità nel modo in cui i blocchi vengono aggiunti.

Per affrontare questo, gli intervalli per la segnalazione dei prezzi e dei saldi saranno ora basati sui secondi anziché sui blocchi. Questo cambiamento garantisce prevedibilità e ha parità con il modo in cui gli intervalli di ricompense vengono calcolati oggi. Se l'intervallo è impostato su `86400` secondi (numero di secondi in 24 ore), prezzi e saldi vengono riportati alla stessa ora ogni giorno.

Il protocollo ora ha una "finestra di ricarica" fissa e controllabile, rimuovendo le congetture e fornendo agli utenti una finestra costante di 24 ore per ricaricare dopo l'aggiornamento finale del prezzo. Sentiti libero di leggere di più su questo cambiamento in [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Audit

In preparazione per l'Aggiornamento Houston, Rocket Pool si è impegnato con tre dei team di audit più stimati nell'ecosistema Ethereum.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Fine novembre a metà dicembre 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Fine novembre 2023, poi un secondo round marzo 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Metà gennaio ad aprile 2024)

Per una cronologia completa degli audit più dettagli sul programma bug bounty Immunefi, visita qui:
https://rocketpool.net/protocol/security
