# Selezione di un provider di hosting

Se sei arrivato a questa sezione, allora vorresti eseguire un nodo Rocket Pool ma non puoi configurarne uno localmente a casa tua; hai bisogno di un **server privato virtuale (VPS)** ospitato sul cloud.
Ci sono diversi servizi disponibili che possono fornire una tale macchina, e sono disponibili in due gusti diversi: provider VPS e provider di cloud pubblico.

Scegliere quello corretto può essere difficile e comprendere le differenze tra loro è fondamentale.
In questa guida, faremo luce sulla distinzione e elencheremo alcuni dei servizi che altri utenti Rocket Pool hanno utilizzato in passato per aiutarti a navigare tra le tue opzioni.

## Hosting VPS tradizionale

Un server privato virtuale è una singola istanza di una macchina virtuale che risiede su una macchina fisica più grande.
Sono l'opzione più economica e sono meno frequentemente impiegati rispetto alle onnipresenti piattaforme cloud, quindi tendono a contribuire maggiormente alla decentralizzazione della rete Ethereum.

Tuttavia, raramente hanno supporto ad alta disponibilità; se il server fisico si guasta, è probabile che anche il tuo VPS ospitato su di esso si guasti.
Inoltre, hanno un'impronta di risorse fissa; di solito non è possibile aumentare o diminuire risorse come CPU e RAM su richiesta.

A partire da 10/2024, un'opzione performante e dal buon prezzo era il RS 12000 G11 di [Netcup](https://www.netcup.eu/vserver/vps.php).
Una parola di avvertimento è che lo storage è condiviso con altri, quindi gli IOPS dello storage sono un potenziale collo di bottiglia.

## Hosting di server dedicati

A differenza di un VPS, un server dedicato è un intero dispositivo fisico che viene affittato da te. Sono un'opzione relativamente accessibile e sono meno frequentemente impiegati rispetto alle onnipresenti piattaforme cloud, quindi tendono a contribuire maggiormente alla decentralizzazione della rete Ethereum.

A partire da 10/2024 due opzioni performanti e dal buon prezzo erano i server bare-metal Rise e Advanced di [OVH](https://us.ovhcloud.com/). Ce ne sono una varietà che cambiano nel tempo, così come vendite significative. Dovrai verificare che le [linee guida hardware](../local/hardware.md) siano soddisfatte.

## Hosting cloud

L'hosting cloud si riferisce a macchine virtuali che sono distribuite su una rete distribuita di più server, anziché essere ospitate su una singola macchina fisica.
Se una delle macchine di hosting si guasta, le altre possono prendere il controllo senza problemi, quindi la disponibilità e l'affidabilità tendono ad essere estremamente elevate su queste piattaforme.
Tendono anche ad offrire opzioni di risorse flessibili; è relativamente semplice aggiungere più CPU, RAM o spazio su disco su richiesta.

A causa di questi vantaggi extra, i server basati su cloud tendono ad essere più costosi delle soluzioni VPS.
Sono anche piattaforme molto popolari, quindi utilizzarle generalmente riduce la decentralizzazione complessiva della rete Ethereum.

I 3 principali provider cloud sono [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/) e [Google Cloud Platform (GCP)](https://cloud.google.com/).
Non consigliamo di utilizzare l'hosting cloud a causa di problemi di prezzo e centralizzazione.

## Considerazioni chiave

### Prezzo

Le soluzioni di hosting cloud sono solitamente una scelta più sicura se il costo non è una priorità.
La sezione seguente ha una ripartizione più dettagliata delle stime dei costi ma ecco un confronto generale tra un'opzione VPS e un'opzione cloud:

- Server dedicato OVH: $90-160/mese
- VPS Netcup: $90/mese
