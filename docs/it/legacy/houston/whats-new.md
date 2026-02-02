---
next:
  text: La Protocol DAO
  link: "/it/legacy/houston/pdao"
---

# L'Upgrade Houston

L'upgrade Houston è in gran parte orientato all'introduzione di una DAO completamente on-chain per governare il protocollo, nota come Protocol DAO o pDAO. È una DAO come nessun'altra e non richiede votazioni snapshot o altri strumenti di terze parti per funzionare, è veramente on-chain e unica nel suo genere, maggiori dettagli di seguito.

Questo upgrade introdurrà anche alcune altre funzionalità molto interessanti che permetteranno di costruire nuove integrazioni e piattaforme sul protocollo. Alcune di queste includono la possibilità di mettere in stake ETH per conto di un nodo (non solo dal nodo stesso) e una nuova funzionalità di indirizzo di prelievo RPL, che consente a una parte di fornire l'ETH per lo staking e un'altra parte di fornire l'RPL senza dare la custodia al node operator"

## Protocol DAO

La Protocol DAO di Rocket Pool (pDAO) è responsabile di plasmare la direzione del protocollo ed è gestita dalla governance RPL. I suoi membri e il loro potere di voto sono costituiti da node operator, grandi e piccoli, tutti direttamente coinvolti nel protocollo.

Tipicamente la governance DAO nel più ampio spazio crypto avviene tramite votazione ponderata sui token. Fondamentalmente, più token detieni per un protocollo/progetto, maggiore è il tuo potere di voto. Inoltre non è necessario partecipare attivamente al protocollo, è sufficiente detenere i token.

Questo stile di governance volevamo evitarlo. Se vuoi aiutare a dirigere e guidare il futuro di Rocket Pool, devi essere attivamente coinvolto, non solo conservare token in un cold wallet. Dai più grandi fondi di Venture Capital al tuo ragazzo comune che gestisce un singolo minipool, dovrai partecipare attivamente al protocollo per aiutare a governarlo.

Attualmente la protocol DAO ha il controllo su una varietà di impostazioni on-chain che vengono utilizzate nel protocollo. Nuove Rocket Pool Improvement Proposals (RPIP) possono essere create e votate da questi Node Operator all'interno di Rocket Pool. Puoi vedere il [**registro RPIP corrente qui**](https://rpips.rocketpool.net/). Se sei un maniaco dei dettagli, l'RPIP corrente per la protocol DAO on-chain discussa ora può essere trovata qui.

### Cosa può fare la pDAO?

La pDAO ha il controllo su molte impostazioni del protocollo, può spendere fondi del tesoro e nel nostro upgrade Houston, viene fornita di un nuovo security council per aiutare a reagire rapidamente in caso di potenziali problemi con il protocollo. Parliamo un po' di più di ciascuno di questi punti di seguito.

**Parametri del Protocollo:** Questi controllano determinati aspetti del protocollo come l'impostazione che controlla l'importo minimo di ETH che può essere depositato per rETH (attualmente 0.01 ETH) o persino il controllo della dimensione massima della deposit pool, ovvero la quantità massima di ETH che può essere depositata nel protocollo in attesa di essere assegnata ai node operator per lo staking. Puoi trovare una tabella completa di [queste impostazioni qui](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Fondi del Tesoro:** RPL ha un tasso di inflazione del 5% e una porzione di essa è allocata al tesoro della pDAO. La pDAO ha la capacità di spendere questo tesoro in una varietà di iniziative orientate al protocollo, dal finanziamento dello sviluppo diretto del protocollo, alla gestione di grant per finanziare miglioramenti e progetti di terze parti che utilizzano Rocket Pool e altro ancora. Il nostro upgrade Houston aggiunge una nuova capacità in cui questi pagamenti dal tesoro possono essere effettuati non solo in modo forfettario, ma in modo progressivo per aiutare a tracciare gli obiettivi in relazione al finanziamento continuo.

**Security Council:** Poiché l'upgrade Houston sposta la pDAO a un sistema completamente on-chain, è stata introdotta una nuova misura di sicurezza sotto forma di [security council](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council). Questi membri possono essere eletti dalla pDAO e hanno la capacità di mettere in pausa rapidamente il protocollo in caso di potenziali problemi. Il quorum deve essere raggiunto tra i membri affinché qualsiasi risposta di sicurezza possa essere eseguita. La pDAO ha anche il potere di rimuovere membri o sciogliere completamente il security council se necessario.

### Proposte e Votazioni

Affinché qualsiasi sistema di governance funzioni, devono esserci proposte e votazioni. Al momento, la votazione snapshot viene utilizzata per queste impostazioni e modifiche delle proposte, quindi è necessario un intervento manuale per eseguire le modifiche. Con l'introduzione dell'[upgrade Houston e RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33), questo viene spostato a un nuovo sistema di fraud-proof ottimistico che consente a qualsiasi node operator di sollevare, votare o contestare proposte, direttamente on-chain senza la necessità di strumenti di terze parti.

**Proporre:** Qualsiasi nodo con un potere di voto non nullo può sollevare una proposta in qualsiasi momento. Nel farlo devono bloccare un bond di proposta sotto forma di RPL per l'intero processo della proposta.

**Contestare:** Se un nodo che ha creato una proposta è stato trovato ad averlo fatto con dati incorretti richiesti, può essere contestato e il contestatore deve fornire un bond per la contestazione. Il nodo che effettua la contestazione può essere ricompensato con il bond del proponente effettuato quando ha creato la proposta se ha successo, tuttavia se ha effettuato una contestazione non valida, il proponente può raccogliere il loro bond di contestazione.

**Votare**: Se una proposta supera il periodo in cui può essere contestata, entra nei periodi di votazione. I node operator possono quindi scegliere di votare in uno dei seguenti modi:

1. Astensione: Il potere di voto del votante viene contribuito al quorum ma non è né a favore né contro la proposta.
2. A favore: Il votante vota a favore dell'esecuzione della proposta.
3. Contro: Il votante vota contro l'esecuzione della proposta.
4. Veto: Il votante vota contro la proposta indicando anche che ritiene la proposta come spam o dannosa. Se viene raggiunto il quorum di veto, la proposta viene immediatamente sconfitta e il proponente perde il suo bond. Questo serve a scoraggiare spam, proposte di bassa qualità o proposte che non hanno attraversato processi off-chain prima come la segnalazione tramite votazione snapshot.

Ci sono **due periodi di votazione**

- Periodo di Voto 1: Per i votanti o delegati che votano per conto di altri.
- Periodo di Voto 2: Per i votanti che hanno delegato il loro potere e vogliono annullare la decisione del loro delegato.

Una volta che entrambi i periodi di votazione sono passati e la proposta ha successo, la proposta può essere eseguita e la modifica viene applicata al protocollo Rocket Pool.

Dopo che la proposta ha superato i periodi di votazione, il proponente può sbloccare il suo bond RPL, a meno che la proposta non sia stata sconfitta da una contestazione o vetata.

## Mettere in Stake ETH per Conto di un Nodo

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) consente a un account di [mettere in stake ETH per conto](../houston/stake-eth-on-behalf.mdx) di un nodo Rocket Pool registrato nel protocollo. Questo supporta una varietà di situazioni in cui il node operator non fornisce direttamente l'ETH:

- Maggiore sicurezza per i node operator, poiché possono mettere in stake direttamente dal loro hardware wallet, eliminando la necessità di trasferire fondi al nodo in anticipo.
- Provider di Staking as a Service dove la custodia dei fondi è gestita da un custode affidabile.
- Integrazioni di protocollo dove la custodia dei fondi è gestita da smart contract.
- DAO o organizzazioni dove la custodia dei fondi è gestita da un tesoro.

Sebbene l'obiettivo principale di questa funzionalità sia facilitare scenari con un singolo depositante, vale la pena notare che anche più depositanti indipendenti possono sfruttare questa capacità creando smart contract stratificati sopra. Rocket Pool ha anche introdotto la capacità di mettere in stake RPL per conto di altri nel nostro precedente rilascio Atlas.

## Indirizzo di Prelievo RPL

Rocket Pool attualmente consente ai node operator di specificare un indirizzo di prelievo per il loro ETH e RPL. Questo potrebbe essere un hardware wallet esterno o qualcosa di similmente sicuro.

Con [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31), puoi impostare un indirizzo di prelievo per il tuo ETH e [uno nuovo per il tuo RPL](../houston/rpl-withdrawal-address) se lo desideri. L'indirizzo di prelievo RPL, se impostato, sarà in grado di attivare e richiedere RPL dalle ricompense di inflazione e non avrà alcun effetto sulle ricompense di consenso ETH o su qualsiasi cosa relativa all'ETH.

Questo crea alcune opportunità interessanti in cui l'RPL può essere fornito da un'entità a un node operator che non desidera avere esposizione all'RPL. Quell'entità può quindi richiedere ricompense RPL per aver fornito la garanzia assicurativa richiesta per il nodo.

## Submissioni di Saldo e Prezzo RPL Basate sul Tempo

I nodi Rocket Pool devono avere almeno il 10% di collaterale in RPL in stake per essere idonei alle ricompense, con il loro "effective stake" calcolato in base al rapporto ETH:RPL, che viene riportato dalla Oracle DAO alla fine di ogni intervallo di ricompense. In precedenza, questa "finestra di ricarica" (il tempo tra il rapporto finale RPL e la fine dell'intervallo) aveva una certa incertezza e fluttuava da intervallo a intervallo perché veniva specificata per numero di blocchi. Questo era valido pre-merge ma non teneva conto della variabilità e casualità nel modo in cui i blocchi vengono aggiunti.

Per affrontare questo problema, gli intervalli per le segnalazioni di prezzo e saldo saranno ora basati sui secondi anziché sui blocchi. Questo cambiamento garantisce prevedibilità e ha parità con il modo in cui gli intervalli di ricompense sono calcolati oggi. Se l'intervallo è impostato su `86400` secondi (numero di secondi in 24 ore), prezzi e saldi vengono riportati alla stessa ora ogni giorno.

Il protocollo ora ha una "finestra di ricarica" fissa e controllabile, rimuovendo le congetture e fornendo agli utenti una finestra coerente di 24 ore per ricaricare dopo l'aggiornamento finale del prezzo. Sentiti libero di leggere di più su questo cambiamento in [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Audit

In preparazione per l'Upgrade Houston, Rocket Pool ha collaborato con tre dei team di auditing più stimati nell'ecosistema Ethereum.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Fine novembre a metà dicembre 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Fine novembre 2023, poi un secondo round marzo 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Metà gennaio ad aprile 2024)

Per una cronologia completa degli audit più dettagli sul programma di bug bounty Immunefi, visita qui:
https://rocketpool.net/protocol/security
