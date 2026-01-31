::: danger AVVISO
I depositi dei minipool sono attualmente disabilitati in preparazione di Saturn 1.
:::

# Il Sistema di Credito per i Depositi

Il sistema di credito per i depositi è un meccanismo per tracciare l'ETH che era stato precedentemente depositato dai Node Operator ma non è più richiesto e renderlo nuovamente disponibile per l'uso.
La fonte di questo credito proviene da due fonti:

- [Migrare un minipool esistente con bond da 16 ETH a un minipool con bond da 8 ETH](./leb-migration.mdx) (che aggiunge 8 ETH al saldo di credito del Node Operator)
- [Migrare un validator solo esistente](./solo-staker-migration) in un minipool (che aggiunge 16 o 24 ETH al saldo di credito del Node Operator, a seconda del tipo di minipool che creano durante la migrazione)

Ogni Node Operator inizia con un saldo di credito di **0 ETH**.
Una di queste due azioni aumenterà quel saldo di conseguenza.

Questo ETH _non_ viene reso liquido e restituito al Node Operator; invece, può essere utilizzato per **creare minipool aggiuntivi** senza richiedere alcun ETH dal Node Operator.

Il sistema di credito è **trasparente** per il Node Operator; verrà utilizzato automaticamente (con notifiche nella CLI dello Smartnode che spiegano che verrà utilizzato) durante le operazioni `rocketpool node deposit` o `rocketpool node create-vacant-minipool` se possibile.
Se _non può_ essere utilizzato, lo Smartnode avviserà l'utente che non può essere utilizzato e richiederà un normale bond in ETH durante entrambe le operazioni.

Vedi la sezione [Disponibilità del Credito](#disponibilità-del-credito) qui sotto per maggiori dettagli.

## Un Esempio

Supponiamo che tu abbia un saldo di credito di 0 ETH e un singolo minipool con un bond di 16 ETH.
Puoi quindi [migrare quel minipool a un bond di 8 ETH](./leb-migration.mdx).
Questo risulterà in **8 ETH** che non sono più depositati.
Quegli 8 ETH verranno inseriti nel tuo **saldo di credito**.

Ora, supponiamo che tu voglia creare un _secondo_ minipool da 8 ETH.
Esegui `rocketpool node deposit` come al solito e selezioni 8 ETH come importo del bond.
Questo normalmente richiede di fornire 8 dei tuoi ETH per il minipool.
Tuttavia, poiché hai un saldo di credito di 8 ETH, Rocket Pool **lo userà automaticamente al suo posto**:

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

Il secondo gruppo di righe qui è quello rilevante: ti dicono che hai abbastanza ETH nel tuo saldo di credito per coprire questo deposito _e che è disponibile per l'uso_, quindi utilizzerà automaticamente il saldo e non richiederà alcun ETH supplementare dal tuo wallet del nodo.

Vedi [la sezione disponibilità qui sotto](#disponibilità-del-credito) per i dettagli sulla disponibilità del saldo di credito.

## Visualizzare il Tuo Saldo di Credito Corrente

Per visualizzare il tuo saldo di credito corrente, esegui semplicemente il seguente comando:

```shell
rocketpool node status
```

Questo produce un elenco completo di dettagli sul tuo nodo, incluso il suo saldo di credito proprio all'inizio:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Disponibilità del Credito

In alcune situazioni, il tuo nodo potrebbe avere un saldo di credito disponibile ma non può attualmente utilizzarlo per distribuire minipool aggiuntivi.

L'ETH per il tuo saldo di credito è preso dal **deposit pool**.
Quindi, se vuoi utilizzare 8 ETH in credito per creare un nuovo minipool da 8 ETH, finirà per prendere **tutti i 32 ETH per quel minipool** dal deposit pool e non ne richiederà nessuno da te.
Per questo motivo, se il deposit pool non ha abbastanza ETH per coprire il valore di pre-deposito (attualmente impostato a 1 ETH), **il saldo non sarà disponibile**.

In questa situazione, lo Smartnode ti avviserà durante un'operazione `rocketpool node deposit` che **non può** utilizzare il tuo saldo di credito e deve invece utilizzare ETH dal tuo wallet del nodo per completare il bond.
Farlo **non** consumerà il tuo saldo di credito; verrà lasciato così com'è e disponibile per l'uso successivo una volta che il deposit pool avrà abbastanza saldo per coprirlo.
