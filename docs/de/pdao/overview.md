---
next:
  text: Die Protocol DAO
  link: "/de/pdao/pdao"
---

# Übersicht

Dieser Abschnitt beschreibt den Prozess zur Einrichtung Ihres Knotens, um an on-chain und snapshot Vorschlägen teilzunehmen. Es gibt viel zu entpacken, daher empfehlen wir dringend, eine Übersicht über das [Houston Upgrade](/de/legacy/houston/whats-new) zu lesen. Dies wird Ihnen helfen, die neuesten Funktionen zu verstehen, die on-chain Governance ermöglichen und wie Sie an der Gestaltung des Protokolls teilnehmen können.

## Voraussetzungen

Bevor Sie Ihren Smartnode konfigurieren, stellen Sie bitte sicher, dass Sie:

- Eine Knotenmaschine (oder virtuelle Maschine) eingerichtet und gesichert haben (über den [Absichern Ihres Knotens](/de/node-staking/securing-your-node) Leitfaden)
- Den Smartnode darauf [installiert](/de/node-staking/installing/overview) und [konfiguriert](/de/node-staking/config/overview) haben
- Eine Knoten-Wallet auf Ihrem Smartnode geladen haben
- Ihre Execution und Consensus Clients synchronisiert haben
- Ihren Knoten mit [einer Auszahlungsadresse](/de/node-staking/prepare-node#setting-your-withdrawal-address) ausgestattet haben, Ihre [Fallback-Clients](/de/node-staking/fallback) eingerichtet haben (optional), sich für den [Smoothing Pool](/de/node-staking/fee-distrib-sp#the-smoothing-pool) entschieden haben (optional) und [MEV](/de/node-staking/mev) konfiguriert haben
- Mindestens einen [minipool](/de/node-staking/create-validator) erstellt haben

## Es gibt drei Adressen, die am Abstimmen beteiligt sind

- pDAO Signalling Address — wird als Ihre snapshot Adresse verwendet, wenn Sie direkt abstimmen möchten oder wenn Sie die snapshot Abstimmung Ihres Delegierten überschreiben möchten. Diese Adresse wird nur für snapshot verwendet, nicht für on-chain Abstimmungen.

- pDAO Delegate Node — wenn Sie Ihre Stimme delegieren möchten. Sie werden dies auf die Knotenadresse Ihres Delegierten setzen. Wenn Sie einen Delegierten wählen, wird dieser für Sie auf snapshot und für on-chain Vorschläge abstimmen.

- Node Address — wenn Sie Ihre Stimme nicht delegiert haben oder wenn Sie die on-chain Abstimmung Ihres Delegierten überschreiben möchten, können Sie dies von Ihrem Knoten aus tun.

## Leitfäden

[Die Protocol DAO](/de/pdao/pdao) diskutiert wer und wie die pDAO Rocket Pool regiert. Diese Seite wird Sie darüber informieren, wie pDAO Aufgaben wie Treasury-Ausgaben on-chain ausgeführt werden können, zusammen mit der Rolle des brandneuen Security Council. Sie führt Sie auch durch den Lebenszyklus eines pDAO Vorschlags und erklärt einige der Maßnahmen, die ergriffen wurden, um Spam zu verhindern und böswillige Vorschläge niederzuschlagen.

[Abstimmungseinrichtung für Nicht-Smartnode-Benutzer](/de/legacy/houston/nonsmartnode-setup) zeigt Nicht-Smartnode-Benutzern (wie Allnodes-Benutzern), wie sie die Abstimmung einrichten.

[Initialisierung der Stimmkraft](/de/pdao/participate#initializing-voting) zeigt Ihnen, wie Sie die Stimmkraft Ihres Knotens initialisieren. Dieser Schritt ist nur erforderlich, wenn Ihr Knoten vor dem Houston Upgrade registriert wurde.

[Festlegen Ihrer Snapshot Signalling Address](/de/pdao/participate#setting-your-snapshot-signalling-address) führt Sie durch die Schritte zum Festlegen einer Signalling Address. Es ermöglicht Ihnen, auf snapshot mit der Stimmkraft Ihres Knotens abzustimmen, ohne den privaten Schlüssel Ihres Knotens in eine Hot Wallet laden zu müssen. Stellen Sie sicher, dass Sie Ihre Smartnode CLI zur Hand haben und bereiten Sie eine Adresse (die nicht Ihre Knoten-Wallet ist) für diesen Leitfaden vor.

[Delegierung der Stimmkraft](/de/pdao/participate#delegating-voting-power) ist ein schneller Befehl, den Sie verwenden können, um Stimmkraft zu delegieren, anstatt direkt über Vorschläge abzustimmen.

[Anzeigen des Status eines Vorschlags](/de/pdao/participate#viewing-the-state-of-a-proposal) ist ein Leitfaden, wie Sie eine Liste vergangener und laufender on-chain Vorschläge anzeigen können. Sie können den Status überprüfen und sich über die Details eines beliebigen on-chain Vorschlags informieren.

[Abstimmen über einen Vorschlag](/de/pdao/participate#voting-on-a-proposal) zeigt Ihnen, wie Sie über einen on-chain Vorschlag abstimmen. Dieser Leitfaden behandelt auch die vier Optionen: **Abstain**, **For**, **Against** und **Veto**.

[Erstellen eines Vorschlags](/de/pdao/participate#creating-a-proposal) führt Sie durch die Anforderungen und Schritte zur Einreichung eines on-chain Vorschlags.

[Ausführen eines erfolgreichen Vorschlags](/de/pdao/participate#executing-a-successful-proposal) zeigt Ihnen, wie Sie die Auswirkungen eines erfolgreichen Vorschlags auf das Rocket Pool Protokoll anwenden.

[Anfordern von Bonds und Belohnungen](/de/pdao/participate#claiming-bonds-and-rewards) diskutiert die Bedingungen, unter denen Bonds oder Belohnungen von einem Proposer oder Challenger angefordert werden können.

[Erstellen und Anfordern einer wiederkehrenden Treasury-Ausgabe](/de/pdao/participate#creating-a-recurring-treasury-spend) ist eine Funktion, die der pDAO die volle Kontrolle über das Hinzufügen, Ändern und Entfernen wiederkehrender Zahlungen gibt.
