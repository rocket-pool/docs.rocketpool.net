# Voting-Einrichtung für Nicht-Smartnode-Benutzer

Einige Benutzer (z.B. Allnodes-Benutzer) verwenden die Smartnode nicht und müssen möglicherweise das Voting über direkte Contract-Interaktion einrichten.
Dieser Leitfaden enthält sowohl eine minimale als auch eine vollständige Einrichtungsanleitung für solche Benutzer.

::: tip
Ihre Node-Adresse sollte dafür auf eine Hardware-Wallet geladen sein.
:::

## Minimale Einrichtungsanleitung

Dies ermöglicht es Ihrem Delegierten, für Sie on-chain und off-chain abzustimmen. Sie können Ihren Delegierten on-chain überschreiben, aber nicht off-chain.

- Verwenden Sie Etherscan, um die Vote Power zu initialisieren ("Mit Web3 verbinden" mit Node-Adresse) mit einem Delegierten https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Sie finden Delegierte unter https://delegates.rocketpool.net/

## Vollständige Einrichtungsanleitung

Verwenden Sie Etherscan, um die Vote Power zu initialisieren ("Mit Web3 verbinden" mit Node-Adresse)

- [für die meisten empfohlen] Initialisieren Sie das Voting mit einem anderen Node als Delegierten https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Sie finden Delegierte unter https://delegates.rocketpool.net/
  - Denken Sie daran, dass Sie Ihre Delegierten immer überschreiben können
- Initialisieren Sie das Voting mit Ihrem eigenen Node als Delegierten https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Hier sind Sie dafür verantwortlich, jedes Mal abzustimmen
  - Ich würde diese Option hauptsächlich für Leute vorschlagen, die Delegierte sein möchten, da sie _tatsächlich_ jedes Mal abstimmen müssen.
- Wenn Ihr Node nach Houston registriert wurde:
  - Sie haben Ihre Vote Power bereits mit Ihrem eigenen Node als Delegierten initialisiert
  - Sie können einen neuen Delegierten mit https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 festlegen

Snapshot-Signalisierungsadresse festlegen:

- Gehen Sie zu https://node.rocketpool.net/signalling-address und verbinden Sie Ihre Node-Adresse
  - Geben Sie Ihre gewünschte Snapshot-Signalisierungsadresse ein und signieren Sie die Nachricht, um die r-, s- und v-Argumente zu erhalten, die Sie benötigen
  - Hinweis: Ihre Snapshot-Signalisierungsadresse DARF NICHT Ihre Node-Adresse sein
- Gehen Sie in einem neuen Tab zu https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Mit Web3 verbinden" mit Node-Adresse
  - Füllen Sie die Argumente mit Ihrer Signalisierungsadresse und den r-, s-, v-Parametern aus dem vorherigen Schritt aus
