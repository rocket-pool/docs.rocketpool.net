---
next:
  text: Die Protocol DAO
  link: "/de/legacy/houston/pdao"
---

# Das Houston-Upgrade

Das Houston-Upgrade zielt hauptsächlich darauf ab, eine vollständig On-Chain-DAO zur Verwaltung des Protokolls einzuführen, bekannt als Protocol DAO oder pDAO. Es ist eine DAO wie keine andere und benötigt keine Snapshot-Abstimmungen oder andere Drittanbieter-Tools, um zu funktionieren. Sie ist wirklich On-Chain und einzigartig – mehr dazu weiter unten.

Dieses Upgrade wird auch einige andere sehr spannende Funktionen einführen, die neue Integrationen und Plattformen ermöglichen, die auf dem Protokoll aufgebaut werden können. Einige davon beinhalten die Möglichkeit, ETH im Namen eines Node zu staken (nicht nur vom Node selbst) und eine neue RPL-Auszahlungsadress-Funktion, die es einer Partei ermöglicht, das ETH zum Staking bereitzustellen, während eine andere Partei das RPL bereitstellt, ohne dem Node-Betreiber die Verwahrung zu übertragen.

## Protocol DAO

Die Rocket Pool Protocol DAO (pDAO) ist verantwortlich für die Gestaltung der Richtung des Protokolls und wird durch RPL-Governance betrieben. Ihre Mitglieder und deren Stimmrecht setzen sich aus Node-Betreibern zusammen, groß und klein, die alle direkt am Protokoll teilnehmen.

Typischerweise wird DAO-Governance im weiteren Krypto-Bereich durch Token-gewichtete Abstimmungen durchgeführt. Im Grunde gilt: Je mehr Token Sie für ein Protokoll/Projekt halten, desto größer ist Ihre Stimmkraft. Sie müssen auch nicht aktiv am Protokoll teilnehmen, es reicht aus, die Token zu halten.

Diesen Governance-Stil wollten wir vermeiden. Wenn Sie helfen möchten, die Zukunft von Rocket Pool zu lenken und zu gestalten, müssen Sie aktiv beteiligt sein, nicht nur Token in einer Cold Wallet aufbewahren. Vom größten Venture-Capital-Fonds bis zum normalen Menschen, der einen einzelnen Minipool betreibt – Sie müssen aktiv am Protokoll teilnehmen, um es mitzugestalten.

Derzeit hat die Protocol DAO Kontrolle über verschiedene On-Chain-Einstellungen, die im Protokoll verwendet werden. Neue Rocket Pool Improvement Proposals (RPIP) können von diesen Node-Betreibern innerhalb von Rocket Pool erstellt und abgestimmt werden. Sie können die [**aktuelle RPIP-Registrierung hier**](https://rpips.rocketpool.net/) einsehen. Wenn Sie es ganz genau wissen wollen, finden Sie das aktuelle RPIP für die On-Chain-Protocol-DAO, über die jetzt gesprochen wird, hier.

### Was kann die pDAO tun?

Die pDAO hat Kontrolle über viele Einstellungen des Protokolls, kann Treasury-Mittel ausgeben und kommt mit unserem Houston-Upgrade mit einem neuen Security Council, um schnell auf potenzielle Probleme mit dem Protokoll reagieren zu können. Lassen Sie uns unten etwas mehr über jedes dieser Themen sprechen.

**Protokollparameter:** Diese steuern bestimmte Facetten des Protokolls, wie die Einstellung, die den minimalen ETH-Betrag kontrolliert, der für rETH eingezahlt werden kann (derzeit 0,01 ETH), oder sogar die maximale Größe des Deposit-Pools, also wie viel ETH maximal in das Protokoll eingezahlt werden kann, während es darauf wartet, Node-Betreibern zum Staking zugewiesen zu werden. Eine vollständige Tabelle [dieser Einstellungen finden Sie hier](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Treasury-Mittel:** RPL hat eine Inflationsrate von 5 % und ein Teil davon wird dem pDAO-Treasury zugewiesen. Die pDAO hat die Möglichkeit, dieses Treasury für verschiedene protokollorientierte Unternehmungen auszugeben, von der direkten Finanzierung der Protokollentwicklung über Zuschussverwaltung für die Finanzierung von Drittanbieter-Verbesserungen und Projekten, die Rocket Pool nutzen, und mehr. Unser Houston-Upgrade fügt eine neue Funktion hinzu, bei der diese Zahlungen aus dem Treasury nicht nur als Pauschalbetrag, sondern auch schrittweise erfolgen können, um Ziele im Zusammenhang mit laufender Finanzierung zu verfolgen.

**Security Council:** Da das Houston-Upgrade die pDAO zu einem vollständig On-Chain-System macht, wurde eine neue Sicherheitsmaßnahme in Form des [Security Council](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council) eingeführt. Diese Mitglieder können von der pDAO gewählt werden und haben die Möglichkeit, das Protokoll schnell zu pausieren, falls potenzielle Probleme auftreten. Ein Quorum muss unter den Mitgliedern erreicht werden, damit eine Sicherheitsreaktion ausgeführt werden kann. Die pDAO hat auch die Macht, Mitglieder zu entfernen oder den Security Council vollständig aufzulösen, falls erforderlich.

### Vorschläge und Abstimmungen

Damit ein Governance-System funktioniert, braucht es Vorschläge und Abstimmungen. Im Moment werden Snapshot-Abstimmungen für diese Einstellungen und Vorschlagsänderungen verwendet, dann ist ein manuelles Eingreifen erforderlich, um die Änderungen auszuführen. Mit der Einführung des [Houston-Upgrades und RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33) wird dies zu einem neuen optimistischen Fraud-Proof-System verschoben, das jedem Node-Betreiber ermöglicht, Vorschläge zu erstellen, abzustimmen oder anzufechten, direkt On-Chain ohne die Notwendigkeit von Drittanbieter-Tools.

**Vorschläge erstellen:** Jeder Node mit einer Stimmkraft ungleich Null kann jederzeit einen Vorschlag einreichen. Dabei muss er für den gesamten Vorschlagsprozess eine Vorschlagskaution in Form von RPL hinterlegen.

**Anfechten:** Wenn festgestellt wird, dass ein Node, der einen Vorschlag erstellt hat, dies mit fehlerhaften erforderlichen Daten getan hat, kann er angefochten werden, und der Anfechtende muss eine Kaution für die Anfechtung stellen. Der Node, der die Anfechtung vornimmt, kann im Erfolgsfall mit der Kaution des Vorschlagenden belohnt werden, die dieser beim Erstellen des Vorschlags hinterlegt hat. Wenn er jedoch eine ungültige Anfechtung vorgenommen hat, kann der Vorschlagende dessen Anfechtungskaution einziehen.

**Abstimmung**: Wenn ein Vorschlag die Periode überstanden hat, in der er angefochten werden kann, tritt er in die Abstimmungsperioden ein. Node-Betreiber können dann wählen, in einer der folgenden Varianten abzustimmen:

1. Enthaltung: Die Stimmkraft des Wählers trägt zum Quorum bei, ist aber weder für noch gegen den Vorschlag.
2. Dafür: Der Wähler stimmt für die Ausführung des Vorschlags.
3. Dagegen: Der Wähler stimmt gegen die Ausführung des Vorschlags.
4. Veto: Der Wähler stimmt gegen den Vorschlag und zeigt an, dass er den Vorschlag als Spam oder bösartig betrachtet. Wenn das Veto-Quorum erreicht wird, wird der Vorschlag sofort abgelehnt und der Vorschlagende verliert seine Kaution. Dies soll Spam, qualitativ minderwertige Vorschläge oder Vorschläge abschrecken, die nicht zuerst durch Off-Chain-Prozesse wie Signalisierung durch Snapshot-Abstimmungen gegangen sind.

Es gibt **zwei Abstimmungsperioden**

- Abstimmungsperiode 1: Für Wähler oder Delegierte, die im Namen anderer abstimmen.
- Abstimmungsperiode 2: Für Wähler, die ihre Macht delegiert haben und die Entscheidung ihres Delegierten rückgängig machen möchten.

Sobald beide Abstimmungsperioden abgelaufen sind und der Vorschlag erfolgreich ist, kann der Vorschlag ausgeführt werden und die Änderung wird auf das Rocket Pool-Protokoll angewendet.

Nachdem der Vorschlag die Abstimmungsperioden bestanden hat, kann der Vorschlagende seine RPL-Kaution entsperren, es sei denn, der Vorschlag wurde durch eine Anfechtung abgelehnt oder ein Veto eingelegt.

## ETH im Namen eines Node staken

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) ermöglicht es einem Konto, [ETH im Namen](../houston/stake-eth-on-behalf.mdx) eines Rocket Pool-Node zu staken, der im Protokoll registriert ist. Dies unterstützt verschiedene Situationen, in denen der Node-Betreiber das ETH nicht direkt bereitstellt:

- Erhöhte Sicherheit für Node-Betreiber, da sie direkt von ihrem Hardware-Wallet aus staken können, ohne vorher Mittel auf den Node übertragen zu müssen.
- Staking-as-a-Service-Anbieter, bei denen die Verwahrung von Geldern von einem vertrauenswürdigen Verwalter verwaltet wird.
- Protokollintegrationen, bei denen die Verwahrung von Geldern durch Smart Contracts verwaltet wird.
- DAOs oder Organisationen, bei denen die Verwahrung von Geldern durch eine Treasury verwaltet wird.

Während das Hauptziel dieser Funktion darin besteht, Einzeleinleger-Szenarien zu ermöglichen, ist erwähnenswert, dass mehrere unabhängige Einleger diese Funktion auch nutzen können, indem sie Smart Contracts darüber schichten. Rocket Pool hat auch die Möglichkeit eingeführt, RPL im Namen von jemandem zu staken, bereits in unserem vorherigen Atlas-Release.

## RPL-Auszahlungsadresse

Rocket Pool ermöglicht Node-Betreibern derzeit, eine Auszahlungsadresse für ihr ETH und RPL anzugeben. Dies könnte ein externes Hardware-Wallet oder etwas ähnlich Sicheres sein.

Mit [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31) können Sie eine Auszahlungsadresse für Ihr ETH und [eine neue für Ihr RPL](../houston/rpl-withdrawal-address) festlegen, wenn Sie möchten. Die RPL-Auszahlungsadresse kann, wenn sie festgelegt ist, RPL aus Inflationsbelohnungen auslösen und beanspruchen und hat keine Auswirkungen auf ETH-Konsensbelohnungen oder irgendetwas mit ETH zu tun.

Dies schafft interessante Möglichkeiten, bei denen RPL von einer Entität einem Node-Betreiber bereitgestellt werden kann, der kein Exposure zu RPL wünscht. Diese Entität kann dann RPL-Belohnungen für die Bereitstellung der erforderlichen Versicherungssicherheit für den Node beanspruchen.

## Zeitbasierte Balance- und RPL-Preismeldungen

Rocket Pool-Nodes müssen mindestens 10 % Sicherheit in gestaktem RPL haben, um für Belohnungen berechtigt zu sein, wobei ihr "effektiver Stake" basierend auf dem ETH:RPL-Verhältnis berechnet wird, das von der Oracle DAO am Ende jedes Belohnungsintervalls gemeldet wird. Zuvor hatte dieses "Top-Up-Fenster" (die Zeit zwischen dem finalen RPL-Bericht und dem Ende des Intervalls) eine gewisse Unsicherheit und schwankte von Intervall zu Intervall, da es durch die Anzahl der Blöcke spezifiziert wurde. Dies war Pre-Merge gültig, berücksichtigte aber nicht die Variabilität und Zufälligkeit in der Art und Weise, wie Blöcke hinzugefügt werden.

Um dies zu beheben, basieren die Intervalle für Preis- und Balance-Meldungen nun auf Sekunden statt auf Blöcken. Diese Änderung gewährleistet Vorhersagbarkeit und hat Parität mit der Art und Weise, wie Belohnungsintervalle heute berechnet werden. Wenn das Intervall auf `86400` Sekunden (Anzahl der Sekunden in 24 Stunden) gesetzt ist, werden Preise und Balances jeden Tag zur gleichen Zeit gemeldet.

Das Protokoll hat jetzt ein festes und kontrollierbares "Top-Up-Fenster", das Rätselraten beseitigt und Benutzern ein konsistentes 24-Stunden-Fenster zum Aufstocken nach dem finalen Preis-Update bietet. Lesen Sie gerne mehr über diese Änderung in [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Audits

In Vorbereitung auf das Houston-Upgrade hat Rocket Pool mit drei der angesehensten Audit-Teams im Ethereum-Ökosystem zusammengearbeitet.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Ende November bis Mitte Dezember 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Ende November 2023, dann eine zweite Runde im März 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Mitte Januar bis April 2024)

Für eine vollständige Historie der Audits sowie Details zum Immunefi-Bug-Bounty-Programm besuchen Sie:
https://rocketpool.net/protocol/security
