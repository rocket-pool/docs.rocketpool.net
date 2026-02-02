# Abstimmungseinrichtung für Nutzer ohne Smartnode

Einige Nutzer (z.B. Allnodes-Nutzer) verwenden den Smartnode nicht und müssen die Abstimmung möglicherweise über direkte Vertragsinteraktion einrichten.
Dieser Leitfaden enthält sowohl eine minimale als auch eine vollständige Einrichtungsanleitung für solche Nutzer.

::: tip
Ihre Node-Adresse sollte hierfür auf ein Hardware-Wallet geladen werden.
:::

## Minimale Einrichtungsanleitung

Dies ermöglicht Ihrem Delegierten, für Sie on-chain und off-chain abzustimmen. Sie können Ihren Delegierten on-chain überstimmen, aber nicht off-chain.

- Nutzen Sie Etherscan, um die Abstimmungskraft zu initialisieren ("Connect to Web3" mit Node-Adresse) mit einem Delegierten https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Delegierte finden Sie unter https://delegates.rocketpool.net/

## Vollständige Einrichtungsanleitung

Nutzen Sie Etherscan, um die Abstimmungskraft zu initialisieren ("Connect to Web3" mit Node-Adresse)

- [für die meisten empfohlen] Abstimmung mit einer anderen Node als Delegierten initialisieren https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Delegierte finden Sie unter https://delegates.rocketpool.net/
  - Denken Sie daran, dass Sie Ihre Delegierten immer überstimmen können
- Abstimmung mit Ihrer eigenen Node als Delegierten initialisieren https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Hier sind Sie dafür verantwortlich, jedes Mal abzustimmen
  - Ich würde diese Option hauptsächlich für Leute vorschlagen, die Delegierte werden möchten, da sie _jedes Mal_ abstimmen müssen.
- Wenn Ihre Node nach Houston registriert wurde:
  - Ihre Abstimmungskraft ist bereits mit Ihrer eigenen Node als Delegierten initialisiert
  - Sie können einen neuen Delegierten festlegen mit https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Snapshot-Signalisierungsadresse festlegen:

- Gehen Sie zu https://node.rocketpool.net/signalling-address und verbinden Sie Ihre Node-Adresse
  - Geben Sie Ihre gewünschte Snapshot-Signalisierungsadresse ein und signieren Sie die Nachricht, um die r-, s- und v-Argumente zu erhalten, die Sie benötigen
  - Hinweis: Ihre Snapshot-Signalisierungsadresse darf NICHT Ihre Node-Adresse sein
- Gehen Sie in einem neuen Tab zu https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Connect to Web3" mit Node-Adresse
  - Füllen Sie die Argumente mit Ihrer Signalisierungsadresse und den r-, s-, v-Parametern aus dem vorherigen Schritt aus
