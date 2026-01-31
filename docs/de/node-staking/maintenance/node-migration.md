# Von einem Node zu einem anderen umziehen

Manchmal ist Ihre Node-Maschine nicht mehr in der Lage, ihre Aufgabe zu erfüllen, und Sie müssen zu einer anderen wechseln.
Dies kann passieren, wenn Sie beispielsweise Ihren Node aufrüsten, oder wenn Sie von einem Cloud-basierten Node zu einem lokal auf dedizierter Hardware gehosteten wechseln, oder sogar wenn Ihr Node selbst einen katastrophalen Hardwareausfall erleidet und Sie Ihre Validatoren auf einer Backup-Maschine ausführen müssen.
Unabhängig vom Fall hilft Ihnen diese Anleitung zu verstehen, wie Sie Ihre Wallet und Validator-Schlüssel sicher von einem Node zu einem anderen migrieren können, ohne geslasht zu werden.

## Slashing und die Slashing-Datenbank

Der Hauptgrund, warum wir Sie dazu ermutigen, so viel Vorsicht walten zu lassen, wenn Sie Ihre Wallet von einer Maschine zu einer anderen verschieben oder Ihre Wallet auf einer anderen Maschine wiederherstellen, ist das Risiko von **Slashing**.
Slashing tritt auf, wenn einer oder mehrere Ihrer Validator-Schlüssel etwas tun, das gegen die Regeln der Beacon Chain verstößt und so aussieht, als würden Sie versuchen, das Netzwerk anzugreifen.
Als Reaktion darauf wird die Chain Ihren Validator zwangsweise beenden und eine schwere Strafe verhängen - die Höhe der Strafe hängt davon ab, wie viele Validatoren innerhalb eines Zeitraums von zwei Wochen nach Ihrem eigenen ebenfalls geslasht werden, aber derzeit beträgt das Minimum **1 ETH** und es gibt kein Maximum.

Obwohl es mehrere Bedingungen gibt, die als "Angriff auf das Netzwerk" interpretiert werden können, passiert realistischerweise nur eine versehentlich: die **Double Attestation** (oder **Double Proposal**).
Dies tritt auf, wenn Ihr Validator zwei Attestierungen (oder zwei Block-Vorschläge) für denselben Slot einreicht, die unterschiedliche Stimmen haben (z.B. stimmt er für zwei verschiedene Kandidatenblöcke für einen bestimmten Slot, anstatt einen auszuwählen).

Um dies zu bekämpfen, hostet Ihr Validator Client eine sogenannte **Slashing-Datenbank**.
Die Slashing-Datenbank ist einfach ein Protokoll der Stimmen Ihres Validators (d.h. der Slot jeder Stimme und der Hash des Blocks, für den diese Stimme war), sodass er weiß, nicht für etwas zu stimmen, für das er bereits gestimmt hat.

### Vermeidung von Slashing

Jeder Validator Client führt eine Slashing-Datenbank, um sicherzustellen, dass Ihr Node niemals doppelt attestiert oder doppelt vorschlägt.
Das Problem tritt dann in Situationen auf, in denen Sie mit der Validierung **ohne** eine Slashing-Datenbank beginnen und somit keine Aufzeichnung darüber haben, wofür Ihre Validatoren zuvor gestimmt haben.
Dies kann in mehreren Situationen passieren:

1. Sie haben gerade die Consensus Clients gewechselt, und der neue Client übernimmt die Slashing-Datenbank nicht vom alten (was der Smartnode bei einem Client-Wechsel nicht tut).
2. Sie haben Ihre Wallet auf einer Maschine geladen und attestieren aktiv damit, und laden dann Ihre Wallet auf eine zweite Maschine, _während die erste Maschine noch aktiv attestiert_.
3. Sie hören auf, auf einer Maschine zu validieren, und laden Ihre Wallet in eine zweite Maschine, aber Sie haben nicht lange genug gewartet, bis die aktuelle Epoche finalisiert ist, sodass Ihre zweite Maschine für Slots attestiert, für die Ihre Validatoren bereits attestiert haben.

Die Standardmethode zur Vermeidung von Slashing besteht darin, **mindestens 15 Minuten nach Ihrer letzten erfolgreichen Attestierung zu warten**, bevor Sie Ihren Validator Client starten und erneut attestieren, und **sicherzustellen, dass Ihre Validator-Schlüssel nur auf einer einzigen Maschine vorhanden sind**.

Genauer gesagt besteht der Plan darin, zu warten, bis Ihr Validator absichtlich eine Attestierung verpasst hat, **und dieser Fehlschlag finalisiert wurde**.
Sobald die Finalität erreicht ist, kann Ihr Validator nicht mehr für die finalisierte Epoche stimmen, und es ist sicher, wieder mit der Attestierung zu beginnen.

Die 15-Minuten-Wartezeit stammt von einer Faustregel, dass die Beacon Chain bei normalem Betrieb (d.h. bei normalem Konsens) etwa 7 Minuten benötigt, um eine Epoche zu finalisieren.
Das Warten von 15 Minuten stellt sicher, dass Sie mindestens eine Epoche verpasst haben und lange genug gewartet haben, bis diese Epoche finalisiert wurde, mit einem kleinen Puffer zur Sicherheit.

## Node-Migrations-Checkliste

Mit dem obigen Kontext im Hinterkopf finden Sie hier eine hilfreiche Checkliste, die Sie bei der Migration Ihres Nodes befolgen können, um sicherzustellen, dass Sie nicht geslasht werden.
Diese ist auf maximale Sicherheit ausgelegt, sodass Sie zwar einige Schritte für unnötig halten mögen, wir jedoch **dringend** empfehlen, sie alle bis zum Abschluss zu befolgen.

1. **Bereiten Sie den neuen Node vor**, indem Sie diese Anleitungen befolgen, beginnend mit dem Abschnitt "Vorbereitung eines Nodes" und endend, sobald Sie den Smartnode installiert haben und einen Execution und Consensus Client synchronisieren.
   - :warning: **INITIALISIEREN SIE KEINE** neue Wallet oder stellen Sie Ihre alte Wallet auf dem Node wieder her. Lassen Sie ihn die Clients _ohne vorhandene Wallet_ synchronisieren.

2. **WARTEN SIE**, bis Ihre Clients auf dem neuen Node vollständig synchronisiert sind.
3. Bestätigen Sie, dass Sie Ihre Mnemonic korrekt aufgezeichnet haben, indem Sie `rocketpool wallet test-recovery` auf Ihrer neuen Maschine ausführen. Dies wird die Schlüsselwiederherstellung _simulieren_, um zu bestätigen, dass Ihre Node Wallet und alle Validator-Schlüssel Ihrer Minipools korrekt wiederhergestellt werden können, wird sie aber nicht _tatsächlich_ wiederherstellen und auf der Festplatte speichern, sodass kein Risiko von Slashing besteht.
   1. Wenn der Smartnode Ihre Node Wallet nicht mit der von Ihnen bereitgestellten Mnemonic wiederherstellen kann, ist Ihre Mnemonic möglicherweise ungültig. **STOPPEN SIE** diesen Prozess; das Entfernen der Schlüssel von Ihrem alten Node bedeutet, dass sie **für immer verloren** sein könnten.
   2. In dieser Situation empfehlen wir, Ihre Validatoren zu beenden und Ihr Kapital so schnell wie möglich abzuheben, damit Sie mit einem neuen Node neu beginnen können, für den Sie die funktionierende Mnemonic haben.
4. **Stoppen Sie die Validierung** auf Ihrem alten Node (zum Beispiel mit `rocketpool service stop`, um den Validator Client herunterzufahren).
5. **Löschen Sie Ihre Schlüssel** von Ihrem alten Node (zum Beispiel mit `rocketpool wallet purge`).
   1. **ÜBERPRÜFEN SIE**, dass die Schlüssel entfernt wurden, indem Sie den `data`-Ordner Ihres Nodes (Standard ist `~/.rocketpool/data/validators/`) überprüfen - jeder Consensus Client hat seinen eigenen Ordner unter diesem Datenordner mit seiner eigenen Kopie der Schlüssel.
   2. Bitte sehen Sie sich den Abschnitt [Überprüfung der Schlüsselentfernung](#überprüfung-der-schlüsselentfernung) unten an, um Anweisungen zu erhalten, wie dies zu tun ist.
   3. Stellen Sie sicher, dass **alle** gelöscht wurden.

6. **Schalten Sie** Ihren alten Node aus und trennen Sie ihn vom Internet, indem Sie das Ethernet-Kabel oder das Wi-Fi-Modul entfernen.

7. **Löschen Sie die SSD** Ihres alten Nodes mit einer der folgenden Methoden:
   1. Verwenden Sie einen bootfähigen USB-Stick mit einer Linux-Installation (wie das beliebte [GParted](https://gparted.org/download.php)) und verwenden Sie ihn, um das Laufwerk zu löschen.
   2. **Entfernen Sie es physisch** aus Ihrem alten Node, schließen Sie es mit einem USB-Konverter an eine andere Maschine an und verwenden Sie ein Tool wie [GParted](https://installati.one/debian/11/gparted/), um das Laufwerk zu löschen.
   3. **Entfernen Sie es physisch** aus Ihrem alten Node und schlagen Sie mit einem Hammer darauf, um es zu zerbrechen und sicherzustellen, dass es nie wieder verwendet wird.

8. **WARTEN SIE** mindestens 15 Minuten, bevor Sie fortfahren. Verwenden Sie einen Block-Explorer wie [https://beaconcha.in](https://beaconcha.in), um das Attestierungsprotokoll Ihres Validators zu überprüfen. Warten Sie, bis mindestens eine Attestierung als fehlend aufgezeichnet wurde _und die entsprechende Epoche finalisiert wurde_.
   1. HINWEIS: Wenn Sie mehrere Minipools haben, müssen Sie sicherstellen, dass _alle_ mindestens eine finalisierte verpasste Attestierung haben.

9. **Stellen Sie Ihre Node Wallet** auf der neuen Maschine wieder her, indem Sie den Anweisungen in [Importieren / Wiederherstellen einer bestehenden Wallet](../recovering-rp.mdx) folgen.

10. **Starten Sie Ihren Validator Client neu**, um sicherzustellen, dass Ihre Validator-Schlüssel geladen werden (z.B. mit `docker restart rocketpool_validator`).

Ihre Validator-Schlüssel werden nun auf Ihrem neuen Node geladen sein, und Sie können sicher damit attestieren beginnen.

## Überprüfung der Schlüsselentfernung

Validator-Schlüssel werden auf Ihrer Festplatte in Form von `json`-Dateien gespeichert.
Sie werden im `data`-Ordner Ihres Nodes aufbewahrt.
Standardmäßig finden Sie sie hier:

```shell
~/.rocketpool/data/validators/
```

::: warning HINWEIS
Wenn Sie Ihr `data`-Verzeichnis mithilfe der `service config` TUI geändert haben (z.B. Sie verwenden einen Aegis-Schlüssel und haben ihn als Ihren `data`-Ordner festgelegt, sollte der obige Pfad in `<Ihr Datenordner>/validators` geändert werden.)
:::

Jeder Client hat seine eigene Kopie der Schlüssel, da jeder Client sie in einem anderen Format oder einer anderen Konfiguration erwartet.

Um die Schlüssel auf der Festplatte zu **finden**, führen Sie den folgenden Befehl aus:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Zum Beispiel würde die Ausgabe auf einer Maschine mit zwei Minipools so aussehen:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

Dies zeigt ein Beispiel, bei dem die Schlüssel **noch nicht** gelöscht wurden und sich noch im Dateisystem befinden.

Wenn Ihre Schlüssel **gelöscht wurden**, sollten Sie _keine_ der Hex-Strings (die langen Strings, die mit `0x` beginnen) in irgendeinem der Ordner für irgendeinen der Clients in der Ausgabe dieses Befehls sehen.
