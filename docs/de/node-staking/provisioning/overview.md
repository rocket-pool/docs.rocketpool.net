---
next:
  text: Starting Rocketpool
  link: "/de/node-staking/starting-rp"
---

# Übersicht

Dieser Abschnitt behandelt die Details, wie Sie Ihren Node für das Staking mit Rocket Pool bereitstellen, nachdem Sie den Smartnode installiert und konfiguriert haben.
Es ist ein langer Abschnitt, da es viele Informationen rund um das Staking zu behandeln gibt, also **lesen Sie bitte jeden Leitfaden durch, bevor Sie Ihren ersten Minipool erstellen!**

## Voraussetzungen

Bevor Sie Ihren Node für das Staking bereitstellen, stellen Sie bitte sicher, dass Sie Folgendes getan haben:

- Richten Sie eine Node-Maschine (oder virtuelle Maschine) ein und sichern Sie sie (über den [Securing your Node](../securing-your-node) Leitfaden)
- Lassen Sie den Smartnode darauf [installiert](../installing/overview) und [konfiguriert](../config/overview)

## Leitfäden

[Starting Rocket Pool](../starting-rp) zeigt Ihnen, wie Sie die Smartnode-Services für jeden Modus starten und wie Sie den Synchronisationsfortschritt Ihrer Execution- und Consensus-Clients überprüfen.

[Creating a New Wallet](../wallet-init) führt Sie durch den Prozess der Erstellung eines brandneuen Wallets mit dem Smartnode, wenn Sie zum ersten Mal einen Node einrichten.

[Importing / Recovering an Existing Wallet](../recovering-rp.mdx) ist eine Alternative zur Erstellung eines neuen Wallets.
Verwenden Sie diesen Leitfaden, wenn Sie bereits ein Node-Wallet haben, das Sie auf Ihrem Node wiederherstellen möchten (oder wenn Sie von einem Dienst wie Allnodes auf Ihre eigene Hardware migrieren).

[Preparing your Node for Operation](../prepare-node.mdx) behandelt einige wichtige erste Schritte, die Sie unternehmen sollten, sobald Sie ein Wallet auf Ihrem Node geladen haben, lange bevor Sie es mit ETH oder RPL finanzieren (außer einem kleinen Betrag an ETH für Gaskosten natürlich).

[Specifying a Fallback Node](../fallback) führt Sie durch den optionalen Prozess, Ihren Node auf ein zweites (extern verwaltetes) Paar von Execution- und Consensus-Clients zu verweisen, die als Backup für Ihre primären Clients fungieren können, falls diese jemals ausfallen, damit Ihr Node weiter validieren kann, während Sie Wartungsarbeiten an ihnen durchführen.

[Fee Distributors and the Smoothing Pool](../fee-distrib-sp) diskutieren die Art und Weise, wie Execution Layer-Belohnungen Ihrem Node jedes Mal bereitgestellt werden, wenn einer Ihrer Validatoren einen Block vorschlägt, wie Sie diese Belohnungen sammeln können, und beschreiben Rocket Pools **Smoothing Pool** - eine beliebte Funktion, die Execution Layer-Belohnungen von allen kombiniert und sie während der regulären Belohnungsintervalle von Rocket Pool gleichmäßig verteilt.

[MEV, MEV-Boost, and MEV Rewards](../mev.mdx) erklärt **Maximum-Extractable Value** (MEV), seine Rolle im Staking-Ökosystem und wie Sie es nach Ihren Wünschen mit dem Smartnode konfigurieren können.
