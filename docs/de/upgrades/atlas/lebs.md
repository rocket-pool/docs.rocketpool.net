# 8-ETH Bonded Minipools

Als Rocket Pool zum ersten Mal gestartet wurde, unterstützte es zwei Arten von Minipools:

1. Eine **16-ETH-Bond**, bei der der Node-Betreiber 16 ETH bereitstellte und die verbleibenden 16 ETH aus dem Staking-Pool kamen, um einen vollständigen (32 ETH) Validator zu erstellen.
2. Eine **temporäre 32-ETH-Bond**, bei der der Node-Betreiber alle 32 ETH bereitstellte, um den Initialisierungsprozess zu überspringen und sofort mit der Validierung auf der Beacon Chain zu beginnen, und dann eine Rückerstattung von 16 ETH erhielt, sobald der Einzahlungspool genug ETH hatte, um dies zu decken. An diesem Punkt würde es sich in einen normalen 16-ETH-bonded Minipool verwandeln.

Letzterer wurde durch eine Community-Abstimmung einige Monate nach dem Start des Protokolls entfernt, da er nicht mehr notwendig war und zu langen Rückerstattungsverzögerungen führte.

Ersterer stellte die niedrigste Bond-Menge des Protokolls dar, weil es garantierte, dass wenn ein Node-Betreiber Rocket Pool nutzte, um das Ethereum-Protokoll anzugreifen und seine _gesamte Bond_ geslasht wurde, er genauso viel verlieren würde wie die rETH-Staker und nicht besser dastehen würde.

Seit dem Start von Rocket Pool hat die Community [umfangreiche Forschung](https://dao.rocketpool.net/t/leb8-discussion-thread/899) über die Sicherheit dieser Bond durchgeführt und festgestellt, dass sie sehr konservativ war.
Für alle praktischen Zwecke wurde ein Slashing von 16 ETH als unrealistisch eingestuft und eine 16-ETH-Bond bot effektiv die gleichen Sicherheitsvorteile wie eine Bond von nur 8 ETH (plus der zusätzlichen RPL-Anforderung).
Daher führt das Atlas-Upgrade, gestützt auf diese Forschung, einen neuen Minipool-Typ in die Liste ein: die **8-ETH-Bond**, umgangssprachlich von der Rocket Pool Community als "LEB8" (Lower ETH Bond - 8 ETH) bezeichnet.

Um einen 8-ETH-Minipool zu erstellen, muss der Node-Betreiber nur **8 seiner eigenen ETH** bereitstellen (plus genug RPL, um die Sicherheitenanforderung zu decken - mehr dazu unter [RPL-Sicherheit](#rpl-collateral)).
Er wird dann **24 ETH** aus dem Einzahlungspool ziehen, um den Validator zu vervollständigen und auf der Beacon Chain zu arbeiten.

Dies **öffnet die Tür für neue potenzielle Node-Betreiber**, die einen Node betreiben möchten, aber nicht ganz 16 ETH haben.
Darüber hinaus ermöglicht es größeren Node-Betreibern, **mehr Pool-Staker-ETH** auf der Beacon Chain einzusetzen, um Belohnungen zu verdienen.
Da dies funktioniert, ohne die Sicherheit wesentlich zu beeinträchtigen, gewinnen alle!

In diesem Leitfaden behandeln wir drei Themen:

- Wie 8-ETH-bonded Minipools tatsächlich funktionieren und die dahinter stehenden Belohnungszahlen
- Wie man einen neuen 8-ETH-Minipool erstellt
- Wie man einen _bestehenden_ 16-ETH-Minipool auf einen 8-ETH-Minipool herunterstuft, ohne zu beenden

Lesen Sie weiter, um mehr über jedes Thema zu erfahren.

## Wie 8-ETH-Bonded Minipools funktionieren

Mechanisch verhalten sich 8-ETH-bonded Minipools **identisch** wie jeder andere Minipool im Protokoll.
Sie "besitzen" immer noch einen Validator auf der Beacon Chain (sie repräsentieren die Withdrawal-Anmeldedaten dieses Validators), sie kommen immer noch mit einer Provision (obwohl die Provision mit Atlas **bei 14% für alle neuen Minipools festgelegt wird**), und sie bieten alle die gleiche Funktionalität, die ein 16-ETH-bonded Minipool bietet.
Der Unterschied liegt ausschließlich in den Zahlen.

### Belohnungen

Aus Rentabilitätssicht (wenn man _rein_ auf ETH-Belohnungen schaut und RPL ignoriert) bieten 8-ETH-bonded Minipools mit 14% Provision _mehr Belohnungen_ für den Node-Betreiber als sogar _16-ETH-bonded Minipools mit 20% Provision_ (was ab Redstone die höchstmögliche Belohnungskonfiguration ist).
Gleichzeitig bieten sie auch mehr Belohnungen für die _rETH-Inhaber_, da die Node-Betreiber das Kapital der rETH-Inhaber effizienter einsetzen.

Gehen wir ein einfaches Beispiel durch, um dies zu veranschaulichen.
Angenommen, wir sind ein Node-Betreiber mit 16 ETH, die zum Staken verfügbar sind (plus der erforderlichen RPL-Bond).
Angenommen, wir haben 1 ETH an Belohnungen auf der Beacon Chain pro Validator verdient.
So sieht die Rechnung für einen einzelnen 16-ETH-Minipool mit 20% Provision im Vergleich zu zwei 8-ETH-Minipools mit 14% Provision aus:

```
1x 16 ETH Minipool @ 20%:
Belohnungen: 1 ETH
Node-Anteil = (16/32) + (16/32 * 0,2)
           = 0,5 + (0,5 * 0,2)
           = 0,5 + 0,1
           = 0,6 ETH

rETH-Anteil = 1 - 0,6
           = 0,4 ETH


2x 8 ETH Minipools @ 14%:
Belohnungen: 2 ETH
Node-Anteil = ((8/32) + (24/32 * 0,14)) * 2
           = (0,25 + (0,75 * 0,14)) * 2
           = (0,25 + 0,105) * 2
           = 0,71 ETH

rETH-Anteil = 2 - 0,71
           = 1,29 ETH
```

Mit anderen Worten, ein Node-Betreiber wird **18% mehr ETH** über zwei 8-ETH-Minipools verdienen, als er mit einem einzelnen 16-ETH-Minipool mit 20% Provision verdienen würde.

### RPL-Sicherheit

Um einen 8-ETH-Minipool zu erstellen, müssen Node-Betreiber immer noch genug RPL staken, um die minimalen Sicherheitenanforderungen für ihren Node zu decken (unter Berücksichtigung aller seiner Minipools aller Bond-Größen).

Diese Regeln wurden mit Atlas klargestellt:

- Das **minimale RPL** pro Minipool beträgt **10% des _geliehenen_ Betrags**
- Das **maximale RPL** pro Minipool beträgt **150% des _gebondeten_ Betrags**

Für einen 16-ETH-Minipool bleibt dies unverändert; das Minimum beträgt 1,6 ETH im Wert von RPL, und das Maximum beträgt 24 ETH im Wert von RPL.

Für einen 8-ETH-Minipool wird dies zu einem **Minimum von 2,4 ETH im Wert von RPL** (10% des geliehenen Betrags, der 24 ETH beträgt) und einem **Maximum von 12 ETH im Wert von RPL** (150% des gebondeten Betrags).

Diese Zahlen wurden von der Rocket Pool Community [als Teil einer Governance-Abstimmung](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671) ausgewählt.

## Erstellen eines neuen 8-ETH-Minipools

Der Prozess zur Erstellung eines neuen Minipools mit einer 8-ETH-Bond ist identisch mit dem Prozess zur Erstellung eines 16-ETH-Minipools.

Führen Sie einfach den folgenden Befehl aus:

```shell
rocketpool node deposit
```

Wenn Sie nach Ihrem Bond-Betrag gefragt werden, wählen Sie `8 ETH`:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip HINWEIS
Dieses Beispiel zeigt auch die Verwendung des [**neuen Deposit-Credit-Systems**](../../node-staking/credit).
Da der Node-Betreiber 8 ETH als Guthaben hat, ist die Erstellung dieses 8-ETH-Minipools kostenlos!
:::

Das ist alles!
Der Rest des Prozesses ist derselbe wie bei den [üblichen Anweisungen zur Minipool-Erstellung](../../node-staking/create-validator.mdx).
