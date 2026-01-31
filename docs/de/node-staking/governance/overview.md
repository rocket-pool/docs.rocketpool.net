---
next:
  text: Die Protocol DAO
  link: "/de/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Übersicht

Dieser Abschnitt beschreibt den Prozess zur Einrichtung Ihres Nodes für die Teilnahme an On-Chain- und Snapshot-Vorschlägen. Es gibt viel zu verstehen, daher empfehlen wir dringend, eine Übersicht über das [Houston Upgrade](/de/legacy/houston/whats-new) zu lesen. Dies hilft Ihnen, die neuesten Funktionen zu verstehen, die On-Chain-Governance ermöglichen und wie Sie an der Gestaltung des Protokolls teilnehmen können.

## Voraussetzungen

Bevor Sie Ihre Smartnode konfigurieren, stellen Sie bitte sicher, dass Sie:

- Eine Node-Maschine (oder virtuelle Maschine) eingerichtet und gesichert haben (via den [Sichern Ihres Nodes](../securing-your-node) Leitfaden)
- Die Smartnode [installiert](../installing/overview) und [konfiguriert](../config/overview) auf ihr haben
- Ein Node-Wallet auf Ihrer Smartnode geladen haben
- Ihre Execution und Consensus Clients synchronisiert haben
- Ihren Node mit [einer Abhebungsadresse](../prepare-node#setting-your-withdrawal-address) bereitgestellt, Ihre [Fallback-Clients](../fallback) eingerichtet (optional), sich für den [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) entschieden (optional) und [MEV](../mev) konfiguriert haben
- Mindestens einen [Minipool](../create-validator) erstellt haben

## Es sind drei Adressen am Voting beteiligt

- pDAO Signalling Address — wird als Ihre Snapshot-Adresse verwendet, wenn Sie direkt abstimmen möchten oder wenn Sie die Snapshot-Abstimmung Ihres Delegierten überschreiben möchten. Diese Adresse wird nur für Snapshot verwendet, nicht für On-Chain-Abstimmungen.

- pDAO Delegate Node — wenn Sie Ihre Stimme delegieren möchten. Sie setzen dies auf die Node-Adresse Ihres Delegierten. Wenn Sie einen Delegierten wählen, wird dieser für Sie auf Snapshot und für On-Chain-Vorschläge abstimmen.

- Node Address — wenn Sie Ihre Stimme nicht delegiert haben oder wenn Sie die On-Chain-Abstimmung Ihres Delegierten überschreiben möchten, können Sie dies von Ihrem Node aus tun.

## Leitfäden

[Die Protocol DAO](/de/legacy/houston/pdao#the-protocol-dao-pdao) diskutiert, wer und wie die pDAO Rocket Pool verwaltet. Diese Seite informiert Sie darüber, wie pDAO-Aufgaben wie Treasury-Ausgaben On-Chain ausgeführt werden können, zusammen mit der Rolle des brandneuen Security Council. Sie führt Sie auch durch den Lebenszyklus eines pDAO-Vorschlags und erklärt einige der Maßnahmen, die ergriffen wurden, um Spam zu verhindern und bösartige Vorschläge niederzuschlagen.

[Voting-Einrichtung für Nicht-Smartnode-Benutzer](/de/legacy/houston/nonsmartnode-setup) zeigt Nicht-Smartnode-Benutzern (wie Allnodes-Benutzern), wie sie das Voting einrichten.

[Initialisieren der Voting Power](/de/legacy/houston/participate#initializing-voting) zeigt Ihnen, wie Sie die Voting Power Ihres Nodes initialisieren. Dieser Schritt ist nur erforderlich, wenn Ihr Node vor dem Houston Upgrade registriert wurde.

[Setzen Ihrer Snapshot Signalling Address](/de/legacy/houston/participate#setting-your-snapshot-signalling-address) führt Sie durch die Schritte zum Setzen einer Signalling Address. Es ermöglicht Ihnen, auf Snapshot mit der Voting Power Ihres Nodes abzustimmen, ohne den privaten Schlüssel Ihres Nodes in ein Hot Wallet laden zu müssen. Stellen Sie sicher, dass Sie Ihre Smartnode CLI zur Hand haben und bereiten Sie eine Adresse (die nicht Ihr Node-Wallet ist) für diesen Leitfaden vor.

[Delegieren der Voting Power](/de/legacy/houston/participate#delegating-voting-power) ist ein schneller Befehl, den Sie verwenden können, um Voting Power zu delegieren, anstatt direkt über Vorschläge abzustimmen.

[Anzeigen des Status eines Vorschlags](/de/legacy/houston/participate#viewing-the-state-of-a-proposal) ist ein Leitfaden, wie Sie eine Liste vergangener und laufender On-Chain-Vorschläge anzeigen können. Sie können den Status überprüfen und die Details eines bestimmten On-Chain-Vorschlags nachlesen.

[Abstimmen über einen Vorschlag](/de/legacy/houston/participate#voting-on-a-proposal) zeigt Ihnen, wie Sie eine Stimme für einen On-Chain-Vorschlag abgeben. Dieser Leitfaden behandelt auch die vier Optionen: **Abstain**, **For**, **Against** und **Veto**.

[Erstellen eines Vorschlags](/de/legacy/houston/participate#creating-a-proposal) führt Sie durch die Anforderungen und Schritte zur Einreichung eines On-Chain-Vorschlags.

[Ausführen eines erfolgreichen Vorschlags](/de/legacy/houston/participate#executing-a-successful-proposal) zeigt Ihnen, wie Sie die Auswirkungen eines erfolgreichen Vorschlags auf das Rocket Pool Protokoll anwenden.

[Beanspruchen von Bonds und Belohnungen](/de/legacy/houston/participate#claiming-bonds-and-rewards) diskutiert die Bedingungen, unter denen Bonds oder Belohnungen von einem Proposer oder Challenger beansprucht werden können.

[Erstellen und Beanspruchen einer wiederkehrenden Treasury-Ausgabe](/de/legacy/houston/participate#creating-a-recurring-treasury-spend) ist eine Funktion, die der pDAO volle Kontrolle über das Hinzufügen, Ändern und Entfernen wiederkehrender Zahlungen gibt.
