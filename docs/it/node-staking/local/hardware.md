# Selezione dell'Hardware per lo Staking

Non esistono specifiche ufficiali per l'esecuzione di un nodo Rocket Pool.
Questa pagina offre alcune linee guida ed esempi che puoi utilizzare per selezionare l'hardware per lo staking.

I requisiti hardware minimi del tuo nodo dipenderanno dai client Consensus ed Execution che sceglierai.
Se, ad esempio, intendi eseguire il tuo nodo su un dispositivo a basso consumo, potresti essere limitato all'utilizzo di `Geth` come client Execution e `Nimbus` come client Consensus.
Se stai utilizzando un NUC più potente con 32+ GB di RAM, tutte le combinazioni di client sono disponibili per te.

Le linee guida seguenti presuppongono che tu voglia un livello di hardware **confortevole**, il che significa che hai capacità in eccesso.
Se tieni a mente queste linee guida, il tuo nodo avrà risorse sufficienti per eseguire qualsiasi combinazione di client supportata da Rocket Pool.
Questo ti permetterà di scegliere una coppia di client `random`, che è molto importante per la diversità dei client sulla rete Ethereum.

::: tip NOTA
Lo staking su Ethereum è molto indulgente.
Se la tua casa viene allagata e il tuo dispositivo di staking si frigge, non c'è una grande penalità per impiegare una settimana per tornare operativo (a meno che tu non sia in un sync committee, che è un evento molto raro).
Il guasto di un componente potrebbe verificarsi ad un certo punto, ma non stressarti per questo.
Il tempo di inattività non ti fa slasciare a meno che tu non sia offline durante un'interruzione importante dell'intera rete Ethereum.
:::

## Requisiti Hardware

I validatori Ethereum non sono molto costosi dal punto di vista computazionale, il che significa che una volta che i tuoi client Execution e Consensus sono in esecuzione, ogni validatore aggiuntivo utilizzerà **una quantità molto ridotta di risorse aggiuntive**.
Questo cresce fino a 64 validatori, a quel punto le risorse richieste per aggiungere un 65° validatore e oltre sono trascurabili.

Nella nostra esperienza, la maggior parte delle configurazioni, inclusi mini-PC e NUC, sono in grado di eseguire un numero effettivamente illimitato di validatori.

### Requisiti CPU

**Linea guida: qualsiasi CPU moderna con almeno 4 thread.**

L'esecuzione di un nodo Rocket Pool non è molto intensiva dal punto di vista computazionale.
L'impatto maggiore della CPU è la velocità con cui il tuo nodo può sincronizzare inizialmente lo stato della blockchain quando lo crei per la prima volta (o se cambi client in seguito).
Dopo la sincronizzazione iniziale, la CPU non viene utilizzata in modo così intenso.

La denominazione delle CPU può essere ingannevole; un Intel Core i5 del 2010 è solitamente **meno potente** di un core i3 del 2022.
Molti membri della comunità utilizzano dispositivi Intel NUC per il loro fattore di forma ridotto, ma un vecchio i5 NUC potrebbe essere una scelta peggiore rispetto a un nuovo i3.
Per questo motivo, consigliamo di utilizzare una CPU "moderna" che abbia al massimo qualche anno.
Più specificamente, **per CPU basate su x64**, consigliamo una CPU che supporti l'estensione [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) - controlla le specifiche del produttore per la tua CPU per vedere se è supportata.
Non tutte le CPU moderne la supportano; ad esempio, le CPU Celeron tendono a non includerla.

Le CPU basate su ARM (come i Mac M1 o M2, o il Rock 5B) non si applicano all'estensione BMI2 sopra citata.

::: tip NOTA
Se sei interessato a utilizzare un NUC, puoi capire quanto è moderno il NUC dal suo numero di modello.
Sono formattati come `NUC` + `numero di generazione` + `modello` + `tipo di CPU` + `suffisso`.
Ad esempio, un'unità `NUC11PAHi50Z` è un'unità i5 di 11a generazione.
Puoi vedere un elenco di NUC [qui](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) sul sito web Intel.

Altri mini-PC, come l'Asus PN50 o PN51, non seguono questa convenzione ma le informazioni su quale CPU utilizzano dovrebbero essere incluse nelle loro pagine prodotto.
:::

La quantità di core su una CPU è meno rilevante del suo **numero di thread**.
Consigliamo un **minimo di 4 thread** per il funzionamento del nodo Rocket Pool.
Una CPU a 2 core con 4 thread funzionerà senza problemi.
È raro trovare una CPU con solo 2 thread.

### Requisiti RAM

**Linea guida: almeno 16 GB di RAM, 32 GB preferibili, DDR4 preferibile**

I nodi Rocket Pool possono funzionare con solo 16 GB di RAM.
Generalmente consigliamo di averne un po' di più per offrire un margine e supporto completo per client pesanti in termini di RAM come Teku.
Un ulteriore vantaggio di avere più RAM è che puoi fornire una dimensione di cache maggiore al client Execution, che tende a rallentare il tasso di utilizzo dello spazio su disco.

### Requisiti SSD

**Linea guida: un SSD da 2+ TB che abbia TLC o superiore, con cache DRAM. NVMe preferito.**

Questo elemento è più importante di quanto la maggior parte delle persone si aspetti.
Il client Execution si basa molto sugli IOPS, o "operazioni al secondo"; consigliamo 15k IOPS in lettura e 5k IOPS in scrittura.
In pratica, questo significa che:

- Le unità HDD (piatti rotanti) non funzioneranno
- Gli SSD SATA o USB 3.0+ esterni _possono_ funzionare
- Le unità SSD NVMe sono preferite

Se hai già un SSD che vuoi utilizzare e vuoi essere sicuro che abbia prestazioni sufficienti per il funzionamento del nodo.

_\* Se non sei sicuro che il tuo disco soddisfi questi requisiti di prestazioni, `fio` è un buon modo per testarli.
Vedi [qui](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/) per le istruzioni Linux,
e [qui](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) per le istruzioni MacOS._

:::tip NOTA
La selezione dell'SSD può essere una scelta complessa!

Il metodo che gli SSD utilizzano per memorizzare i dati sui loro chip flash ha un impatto notevole sulla velocità e sulla longevità.
Quando acquisti un SSD potresti notare etichette come `QLC`, `TLC` o `SLC`.
Queste rappresentano la quantità di dati contenuti in una singola cella del chip flash: `Q` per "quad" significa 4, `T` per "triple" significa 3, `M` per "multi" significa 2 e `S` per "single" significa 1.

Consigliamo unità **TLC, MLC o SLC**.
**Non consigliamo unità QLC** a causa delle loro prestazioni più lente e della minore affidabilità totale.

Gli SSD sono disponibili con o senza DRAM, che è un elemento hardware che rende più efficiente l'accesso ai dati sull'SSD.
Quelli con DRAM sono più veloci ma quelli senza DRAM sono più economici.
Tuttavia, la DRAM è molto importante per fornire un funzionamento fluido del nodo.

Consigliamo un'unità con cache **DRAM**.
**Non consigliamo unità senza DRAM**.
:::

La considerazione finale è la dimensione dell'unità.
A partire da 10/2024, la dimensione del database del client execution `geth` richiede circa 1,2TB di spazio dopo aver completato la sincronizzazione iniziale (o dopo aver appena finito di eseguire il pruning).
Questo crescerà costantemente nel tempo e, sebbene il pruning possa recuperare parte di quello spazio, lo stato appena potato _cresce_ nel tempo.
Avrai tranquillità con un'unità più grande.

### Accessori Comuni

Molti operatori di nodi migliorano le loro configurazioni oltre i requisiti minimi.
Alcune aggiunte comuni includono:

- Dissipatori di calore per SSD per estendere la durata dell'unità
- Gruppi di continuità (UPS) in caso di interruzioni di corrente
- Un nodo di fallback per avere un backup in caso qualcosa si guasti

Questi sono tutti convenienti da avere, ma non sono necessari per eseguire un nodo Rocket Pool.

## Esempi di Configurazioni

In questa sezione, mostreremo alcune delle varie build che la comunità di Rocket Pool ha creato per sé stessa.
Sono esempi di ciò che le persone stanno usando, non raccomandazioni su come dovresti eseguire la tua configurazione.
Nota che molti sono un po' datati e, ad esempio, utilizzano SSD che ora sono troppo piccoli.

### Server di Xer0

![](./images/Xer0.jpg)

L'utente Discord **Xer0** è tra i molti staker che hanno optato per un fattore di forma PC convenzionale per la loro macchina di staking.
Volevano costruire un rig che durasse per anni e anni a venire con manutenzione e aggiornamenti minimi richiesti, offrendo al contempo una personalizzazione completa di ogni componente.
A tal fine, Xer0 ha ideato e costruito un server ATX completo - molto simile a un PC desktop tradizionale, ma mirato esclusivamente allo staking su Ethereum.
La loro configurazione include un Xeon Bronze 3204 a sei core (1,9 GHz), 8 slot DDR4 e uno slot M.2... anche se, poiché si tratta essenzialmente di una build per home server, i componenti esatti dipendono completamente dall'utente finale.

Configurazione di Xer0:

- Scheda madre: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- Alimentatore: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Dissipatore: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Totale: $1680**

Ecco i commenti di Xer0 sul perché hanno scelto questa configurazione:

_Ovviamente non c'è bisogno di costruire una mostruosità semplicemente per lo staking sulla rete Ethereum, ma ho alcuni motivi per cui ho costruito qualcosa del genere._

1. _Ora credo che 1 o più validatori in futuro varranno molto più di quello che stiamo vedendo ora, quindi volevo comprare qualcosa che sarà in grado di supportare la rete per almeno i prossimi 10-20 anni senza problemi._
1. _Creando una macchina con così tanti core mi sono anche dato molto più margine al punto che potrei eseguire un aggregatore L2 sopra questo senza problemi (riguardo all'hardware) e qualsiasi altra cosa che vorrei eseguire su un server._ :)
1. _Mi piace costruire computer, quindi l'ho costruito..._
1. _Con una build per server, mi dà molta più flessibilità con hardware e funzionalità che la maggior parte dei computer non ha nativamente._
1. _Un po' di protezione futura (giusto per sicurezza)_ :wink:

### Rig a Scaffale di Darcius

![](./images/Darcius.jpg)

Il fondatore di Rocket Pool David Rugendyke (conosciuto su Discord come **darcius**) ha trascorso molto tempo a perfezionare il suo nodo.
Dopo un po' di dibattito, ha costruito un Mini-ITX piccolo e portatile, ma che racchiude comunque un'enorme quantità di potenza di elaborazione.
Il suo rig include un Ryzen 7 5800x a 8 core (3,8 GHz), due slot DDR4 e due slot M.2 per SSD NVMe.
È davvero uno dei rig più performanti dei nodi Rocket Pool, ma per una buona ragione: darcius esegue un tipo speciale di nodo Rocket Pool chiamato Oracle Node, che trasmette informazioni dalla Beacon chain alla chain Execution su tutti i validatori Rocket Pool.
Con migliaia di minipool Rocket Pool attivi da monitorare, quel lavoro richiede molta potenza... ma il suo rig a scaffale è facilmente all'altezza del compito.

Configurazione di Darcius:

- Scheda madre: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- Alimentatore: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Totale: $1587**

### Build microATX di Yorick

![](./images/Yorick-stock.jpg)

L'appassionato di hardware veterano **YorickDowne** ha molta esperienza nella costruzione e manutenzione di server.
Utilizzando quella conoscenza, si è stabilito su una configurazione microATX flessibile.
La sua macchina è considerevolmente più piccola di un PC tipico, ma riesce comunque a inserire tecnologia di livello server che massimizza resilienza e uptime - metriche chiave quando si esegue un nodo Rocket Pool.
Ha raccomandazioni sia per configurazioni Intel che AMD, che puoi trovare [sul suo sito web](https://eth-docker.net/docs/Usage/Hardware).
La versione Intel utilizza un i3-9100F quad core (3,6 GHz) o una CPU Xeon, e la versione AMD suggerisce qualsiasi CPU Ryzen che supporti la memoria ECC.
Per entrambe le configurazioni, suggerisce 16 GB di RAM ECC e un SSD NVMe da 1 TB.

Configurazione di Yorick:

- Scheda madre: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- Alimentatore: Qualsiasi (esempio: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Ventole del case: Qualsiasi
- **Totale: Circa $886**

Ecco i commenti di Yorick sul perché ha scelto questa configurazione:

- _Ha lo stesso costo o un costo inferiore rispetto ad alcuni NUC_
- _Ha RAM ECC, il che significa che se la memoria si guasta - cosa che accade di tanto in tanto - lo saprò, perché il sistema me lo dirà. Non devo eseguire memtest87 per 4-5 giorni per capire se il mio problema di instabilità è anche correlato alla memoria. Proteggo ferocemente il mio tempo così posso spenderlo a blaterare su Discord invece di risolvere problemi hardware_
- _Ha IPMI, che è la gestione remota tramite Ethernet/browser dell'intera macchina, incluso UEFI e il ciclo di alimentazione. Dovrei essere autorizzato ad andare in vacanza prolungata e avere comunque pieno accesso remoto._
- _Se voglio storage ridondante in modo che l'eventuale guasto dell'SSD sia un non-evento, posso farlo_
- _Permette una grande flessibilità nelle scelte di build. Posso scegliere quanta RAM e capacità di calcolo voglio; posso scegliere di eseguire un NAS con tecnologia di virtualizzazione come TrueNAS Scale ed eseguire il nodo lì insieme ad altre cose da home-server._

### Laptop di Drez

![](./images/Drez.jpg)

A volte, spendere per nuovo hardware semplicemente non ha senso.
Nel caso dell'utente Discord **Drez**, eseguire un nodo Rocket Pool è uno di quei casi.
Drez aveva un laptop di riserva in giro e lo hanno trasformato in un nodo con facilità.
La loro macchina viene fornita con un i7-4710HQ quad core (2,5 GHz), due slot DDR3 e uno slot SATA da 2,5".
Essendo un laptop, viene anche fornito con la propria batteria (che compensa la necessità di un UPS).
Hanno aggiunto alcuni aggiornamenti aggiuntivi nel tempo, dando al laptop ancora più potenza per maggiore tranquillità.

Configurazione di Drez:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Inclusa)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Totale: $1910**

Ecco i commenti di Drez sul perché hanno scelto questa configurazione:

_Il motivo principale per cui farò staking su questo laptop è perché ne avevo già uno di riserva e non ho bisogno di spendere soldi extra per un nuovo server.
Mi piace la sua mobilità, compattezza, schermo integrato per un monitoraggio facile.
In caso di surriscaldamento ho comprato un pad di raffreddamento per laptop e un dissipatore di CPU di riserva per ogni evenienza, raccomando anche di cambiare la pasta termica soprattutto se hai intenzione di eseguire su una macchina più vecchia_

## NUC (Next Unit of Computing) e Mini-PC

L'esecuzione di un nodo Rocket Pool non richiede necessariamente un desktop completo da costruire da soli.
Infatti, una delle configurazioni più popolari tra gli staker è l'illustre NUC.
Un NUC (Next Unit of Computing) è essenzialmente un piccolo computer autonomo progettato per un consumo energetico molto basso e massima efficienza.
I NUC sono ottimi per la maggior parte degli staker che eseguono solo pochi validatori per la loro bassa manutenzione, bassi costi di funzionamento mensili e facilità di configurazione.
A differenza dei PC, i NUC vengono pre-assemblati in un case; tutto quello che devi fare è aggiungere un po' di RAM, aggiungere un SSD e sei pronto!
Di seguito sono riportati alcuni esempi di configurazioni NUC che alcuni veterani di Rocket Pool utilizzano e consigliano.

::: tip NOTA
**Compatibilità Adattatore Ethernet**

Se stai pianificando di acquistare un Intel® NUC di 11a o 12a generazione puoi incontrare problemi di connettività con l'adattatore ethernet, specificamente se l'adattatore è identificato come **I225-LM** (Controlla le specifiche Intel prima di acquistare).
Se ne hai già uno, ci sono passaggi che puoi intraprendere per affrontare questa preoccupazione.
L'adattatore I225-LM è stato associato a determinate sfide di compatibilità che possono portare a **blocchi del sistema** e comportamenti del kernel inaspettati, in particolare quando si utilizzano kernel Linux.

Per determinare se il tuo NUC impiega l'adattatore ethernet problematico I225-LM, puoi utilizzare il seguente comando nel terminale:

```shell
sudo lshw -class network | grep 225
```

Se l'output conferma la presenza dell'adattatore I225-LM, potresti riscontrare i problemi menzionati. Tuttavia, ci sono _rimedi_ che puoi applicare per mitigare questi problemi:

**Adattatore USB-C a Ethernet**: Una soluzione praticabile prevede l'acquisizione di un adattatore USB-C a Ethernet e il collegamento del cavo internet tramite questo adattatore esterno. Sebbene questo approccio richieda hardware e configurazione aggiuntivi, si è dimostrato efficace nella risoluzione dei conflitti di compatibilità. Questo ti consente di utilizzare gli ultimi kernel Linux disponibili senza incontrare le anomalie di congelamento o relative al kernel associate all'adattatore I225-LM.**Questa è la soluzione consigliata (per ora) se hai già un NUC con l'I225-LM** _Tieni presente che optare per un adattatore può introdurre un compromesso in termini di potenziale latenza o velocità internet ridotta. Per mitigare questo impatto, è consigliabile selezionare un adattatore con almeno 1GB/s di portabilità, contribuendo così a mantenere tassi di trasferimento dati ottimali._

**Aggiornamenti Driver e Software**: Considera di aggiornare i tuoi driver, firmware e BIOS consultando la pagina di supporto ufficiale Intel® per il tuo modello NUC [qui](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). Questo potrebbe includere l'utilizzo dell'ultimo driver di supporto disponibile dal sito web di Intel o l'applicazione di aggiornamenti BIOS che affrontano problemi di compatibilità.

**Patch di Intel (Windows)**: Intel ha rilasciato una patch per affrontare un problema simile sui sistemi Windows. Sebbene la patch stessa **potrebbe non applicarsi direttamente agli ambienti Linux**, evidenzia il riconoscimento del problema da parte di Intel e i loro sforzi per fornire soluzioni. Puoi trovare maggiori dettagli sulla patch in questo [link](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3).

Tieni presente che la tecnologia evolve e le soluzioni potrebbero cambiare nel tempo. Rimani sempre aggiornato con le ultime risorse fornite da Intel per il tuo specifico modello NUC sulla loro pagina ufficiale dei Download [page](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads]).

Seguendo questi passaggi, puoi affrontare le sfide di compatibilità associate all'adattatore ethernet I225-LM sui prodotti Intel® NUC di 11a e 12a generazione, garantendo un'esperienza più fluida e affidabile con la distribuzione del tuo server. _Sebbene un sottoinsieme di utenti NUC con questo adattatore abbia riferito di non aver riscontrato problemi, è importante notare che la **maggioranza degli utenti**, in particolare dopo un aggiornamento del kernel, ha riscontrato problemi. In particolare, i kernel 5.15.+ si sono dimostrati l'opzione più stabile per coloro che utilizzano l'adattatore I225-LM. Se l'idea di utilizzare un adattatore USB-C non ti piace e sei disposto a correre il rischio di potenziali blocchi casuali, è consigliabile **rimanere su una versione del kernel che ha dimostrato maggiore stabilità**._
:::

### NUC8i5BEK di Ken

![](./images/Ken.jpg)

Il NUC8i5BEK è uno dei NUC di Intel con processore di 8a generazione.
Rilasciato nel 2018, questo modello viene fornito con una CPU i5-8259U quad-core (2,30 GHz), due slot DDR4, uno slot M.2 per SSD e porte USB 3.1.
Normalmente consuma circa 20 watt, ma l'utente Discord **Ken** è stato in grado di ottimizzarlo fino a 9 watt durante la validazione normale.
È più che capace di gestire qualsiasi client Execution e qualsiasi client Consensus, rendendolo una scelta eccellente per una macchina nodo leggera ed efficiente.

Configurazione di Ken:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Case senza ventole (opzionale): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Totale: da $691 a $825**

Ecco i commenti di Ken sul perché ha scelto questa configurazione:

- _Dimensioni e ingombro ridotti, l'alimentatore è un mattone sul cavo di alimentazione (come un laptop), computer a scheda singola, architettura x86, punto di prezzo di acquisto basso, basso consumo energetico (~10W), garanzia di 3 anni e una linea di prodotti attiva (Intel)._
- _Le 8e generazioni sono abbastanza veloci e a un punto di prezzo inferiore rispetto ai chip di ultima generazione._
- _Ho aggiornato a un case senza ventole (raffreddato passivamente), quindi il NUC è assolutamente silenzioso (0 dB) poiché lo lascio nel mio ufficio a casa (un NUC standard è già quasi silenzioso)._
- _Inoltre nessuna usura meccanica sui cuscinetti della ventola._
- _Valore di rivendita o riutilizzo se decido di ritirare questa piattaforma hardware come mio nodo RP - i NUC sono un ottimo computer da lavoro._

### NUC10i7FNH di GreyWizard

![](./images/GreyWizard.jpg)

Il NUC10i7FNH è un altro dei NUC di Intel.
Questo sfoggia un processore di 10a generazione ed è stato rilasciato nel 2019.
Viene fornito con una CPU i7-10710U a sei core (1,10 GHz, boost fino a 4,7 GHz), due slot DDR4, uno slot M.2 e uno slot da 2,5" per SSD e porte USB 3.1.
Consuma circa 20 watt di potenza.
È una macchina incredibilmente potente, dato il suo consumo energetico e le sue dimensioni.
L'utente Discord **GreyWizard** utilizza questo NUC per il suo nodo - la potenza extra gli dà tranquillità sapendo che, qualunque cosa riservi il futuro della chain Ethereum 2.0, la sua macchina sarà in grado di gestirla.

Configurazione di GreyWizard:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 ea.)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Totale: $1068**

Ecco i commenti di GreyWizard sul perché ha scelto questa configurazione:

_Sono andato con il NUC i7 principalmente perché sembrava la migliore combinazione di prestazioni eccezionali rispetto alle dimensioni complessive e al sovraccarico.
Ho anche esaminato altre opzioni come costruire una macchina di dimensioni Micro ATX.
Dopo aver valutato una con le specifiche che stavo cercando, questo NUC Intel è finito per costare circa lo stesso prezzo, e il fattore di forma è davvero difficile da battere.
Mi piace avere il margine extra per prestazioni/tranquillità, e riconosco che questo è quasi certamente eccessivo.
Considero lo staking come un investimento serio e non voglio preoccuparmi se il mio hardware sarà sufficiente._

_Consigli per altre persone che stanno considerando questa opzione..._

- _Il NUC funziona piuttosto caldo, temperature simili a un laptop. Se ti preoccupi della temperatura della CPU e vuoi qualcosa di potente, allora dovresti guardare configurazioni desktop piccole come Micro ATX._
- _Vorrai assicurarti che ci sia molto spazio intorno al tuo NUC per il flusso d'aria. Pianifica di pulire l'area regolarmente per prevenire l'accumulo di polvere._
- _Assicurati di controllare la compatibilità per le tue schede RAM. I diversi NUC supportano vari gradi di RAM totale, velocità RAM, ecc._
- _Se vai con il NUC, ti suggerirei di darti spazio per crescere quando selezioni la RAM... Ad esempio, spendi un po' di più e ottieni una singola scheda RAM da 32gb piuttosto che 2x16 così puoi espandere in seguito se vuoi (supponendo che il tuo NUC supporterà 64gb in questo esempio)_
- _Sentiti libero di contattarmi su Discord se vuoi discutere._

### Video del Processo di Build NUC10i5FNHN di ArtDemocrat

Per integrare le descrizioni e i consigli sulla configurazione di Greywizard, ArtDemocrat ha creato questo video del processo di build come risorsa di aiuto aggiuntiva per configurare un NUC10 (in questo caso un NUC10i5FNHN, ma il processo di build dovrebbe essere simile per un NUC10i7FNH):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

Configurazione di ArtDemocrat:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### PN50 di Actioncj17

![](./images/PN50-actioncj17.jpg)

L'ASUS PN50 è un mini-PC, che condivide molto in comune con la famiglia NUC di Intel.
Ha un fattore di forma molto piccolo ma ha tutti i componenti e le caratteristiche di un PC completo.
Viene fornito con la tua scelta di CPU AMD così puoi bilanciare tra prestazioni e costo (fino a un Ryzen R7-4700U a 8 core a 2,0 GHz), due slot DDR4, uno slot M.2 e uno slot da 2,5" per SSD e porte USB 3.1.
Viene anche fornito con un alimentatore da 90 watt, anche se in pratica non richiede così tanta potenza mentre funge da nodo Rocket Pool.
L'utente Discord **actioncj17** ha provato diverse configurazioni diverse, ma preferisce il PN50 su tutto... anche se ammettono felicemente che è eccessivo per eseguire un nodo Rocket Pool.

Configurazione di Actioncj17:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Totale: $1118**

Ecco i commenti di actioncj17 sul perché hanno scelto questa configurazione:

_La mia risposta sul perché ho scelto l'Asus PN50 è abbastanza semplice.
Volevo vedere quanto fosse potente il Ryzen 7 4700U di AMD.
Diciamo solo che non sono deluso.
In realtà ho iniziato con l'Intel NUC10FNK.
Ho messo 32gb di ram e 1tb 970 evo plus nvme m.2 nel nuc e sfreccia.
Non ho lamentele con il nuc e funziona bene ma ottengo di più dal mio PN50.
Direi che entrambe le configurazioni sono eccessive per lo staking su Rocketpool ma un po' di protezione futura non guasta.
Entrambi hanno ingombri ridotti e il nuc è in realtà molto più silenzioso poiché è senza ventole.
Tutto sommato il PN50 è un miglior rapporto qualità-prezzo se riesci a metterci le mani sopra._

### Mini-PC di Moralcompass

![](./images/moralcompass-minipc.jpg)

L'utente Discord **moralcompass** ha seguito una strada simile a actioncj17 selezionando un mini-PC, ma la loro preferenza è per una CPU Intel.
Utilizzano un mini PC che sfoggia un i5 8250U quad core (1,6 GHz, boost fino a 3,4 GHz), uno slot DDR4, uno slot M.2 e uno slot da 2,5" per SSD e porte USB 3.0.
Moralcompass afferma che consuma solo circa 10 watt dalla presa, il che dimostra che i mini PC come questo sono molto efficienti.
La cosa interessante di questa scelta è che è completamente raffreddato passivamente - nessuna ventola da trovare!
Sebbene ci siano molte variazioni di mini PC senza ventole, moralcompass ha trovato quello che funzionava per loro e ci è rimasto fedele.

Configurazione di Moralcompass:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Totale: $655**

Ecco i commenti di moralcompass sul perché hanno scelto questa configurazione:

- _Nessuna parte mobile, nessun rumore._
- _Doppia NIC Intel (nel caso decidessi di riutilizzarlo come mio router un giorno)_
- _Slot NVME + SATA (preferisco NVME per velocità e opzioni con resistenza TBW più elevata. SATA offre l'opzione di HDD o SSD. Ho evitato le interfacce M.SATA perché questi SSD sembrano diventare legacy)_
- _Porte USB e seriali disponibili per segnale di spegnimento controllato dall'UPS_
