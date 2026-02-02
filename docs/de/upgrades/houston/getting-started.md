# Houston Schnellstart

Ob Sie ein erfahrener Node Operator, rETH-Inhaber oder neugieriger Beobachter sind, diese Seite wird Ihnen helfen, mit der Erkundung der neuen Funktionen in Houston zu beginnen.

##

### Initialisierung der Stimmkraft

Zunächst und vor allem ist der wichtigste Schritt, wenn Sie **Node Operator** sind, [die Abstimmung zu initialisieren](../houston/participate#initializing-voting), um Ihre Stimmkraft freizuschalten. Knoten, die die Abstimmung initialisiert haben, werden einbezogen, wenn die gesamte Stimmkraft des Netzwerks berechnet wird.

Bei der Entstehung von Houston ist die pDAO-Abstimmung deaktiviert, bis eine ausreichende Anzahl von Knoten die Abstimmung initialisiert hat. Dies soll verhindern, dass betrügerische Vorschläge angenommen werden, während die gesamte Stimmkraft und das Quorum niedrig sind. Nachdem genügend Knoten die Abstimmung initialisiert haben, wird ein Schalter umgelegt und die pDAO übernimmt das Ruder.

Um die Stimmkraft zu initialisieren, verwenden Sie diesen Befehl im Smartnode:

```shell
rocketpool pdao initialize-voting
```

Sie müssen dies nur einmal tun. Die Initialisierung der Abstimmung stellt sicher, dass die Stimmkraft Ihres Knotens in zukünftige On-Chain-Vorschläge einbezogen wird und Sie über sie abstimmen können.

### Festlegen Ihrer Snapshot-Signalisierungsadresse

Zweitens möchten Sie Ihre Snapshot-Signalisierungsadresse festlegen. Dies ermöglicht Node Operators, an Snapshot-Abstimmungen in ihrem Browser oder mobilen Gerät teilzunehmen, ohne ihre Knotenschlüssel einem Hot Wallet aussetzen zu müssen.

Das Einrichten hiervon umfasst eine Handvoll Schritte, daher sollten Sie dieser Anleitung folgen:
[Festlegen Ihrer Snapshot-Signalisierungsadresse](../houston/participate#setting-your-snapshot-signalling-address).

### Delegierung der On-Chain-Stimmkraft

Wenn Sie die On-Chain-Stimmkraft an ein Community-Mitglied Ihrer Wahl delegieren möchten, klicken Sie [hier](../houston/participate#delegating-voting-power), um zu erfahren, wie.

##

# Anleitungen

[Vollständige Houston-Übersicht](../houston/whats-new) präsentiert die vollständig On-Chain-Protocol DAO und stellt neue Funktionen wie das Staken von ETH im Namen eines Knotens, das Festlegen einer RPL-Abhebungsadresse und zeitbasierte Balance- und RPL-Einreichungen vor. Houston Smart Contract Audits können hier ebenfalls gefunden werden.

[Die Protocol DAO](../houston/pdao) diskutiert, wer und wie die pDAO Rocket Pool regiert. Diese Seite wird Sie darüber informieren, wie pDAO-Aufgaben wie Treasury-Ausgaben on-chain ausgeführt werden können, zusammen mit der Rolle des brandneuen Security Council. Sie wird Sie auch durch den Lebenszyklus eines pDAO-Vorschlags führen und einige der Maßnahmen erklären, die ergriffen werden, um Spam zu verhindern und böswillige Vorschläge abzuschießen.

[Teilnahme an Vorschlägen](../houston/participate) enthält eine detaillierte Schritt-für-Schritt-Anleitung, wie Node Operators an pDAO-Vorschlägen teilnehmen können. Wenn Sie daran interessiert sind, einen On-Chain-Vorschlag zu erheben, abzustimmen oder Stimmkraft zu delegieren, ist dies die Anleitung für Sie.

[Stake Eth im Namen eines Knotens](../houston/stake-eth-on-behalf.mdx) geht die Schritte für das Staken von ETH im Namen eines Knotens durch. Es ist eine neue Funktion, die in Houston eingeführt wurde, um Single-Depositor-Szenarien zu erleichtern. Wir werden durchgehen, wie Sie dies in einem Testnet tun können, wenn Sie es ausprobieren möchten, bevor Sie echtes ETH im Mainnet staken.

[RPL-Abhebungsadresse](../houston/rpl-withdrawal-address) zeigt Ihnen, wie Sie eine RPL-Abhebungsadresse für Ihren Knoten festlegen. Dies ist nützlich, wenn Sie einer separaten Einheit ermöglichen möchten, die RPL-Versicherungssicherheit für einen Knoten bereitzustellen.
