# FAQ (WIP)

### Was sind die Vorteile des Betriebs von Minipools mit Rocket Pool im Vergleich zu einem 32 ETH Solo-Validator?

Indem Sie einen einzelnen Solo-Validator betreiben, würden Sie 100% der Belohnungen auf Ihre 32 ETH erhalten.
Indem Sie zwei 16 ETH Minipools betreiben, würden Sie 100% der Belohnungen auf Ihre 32 ETH **plus** 14% der Belohnungen auf 32 ETH erhalten, die vom Rocket Pool-Protokoll bereitgestellt werden.
Indem Sie vier 8 ETH Minipools betreiben, würden Sie 100% der Belohnungen auf Ihre 32 ETH **plus** 14% der Belohnungen auf 96 ETH erhalten, die vom Rocket Pool-Protokoll bereitgestellt werden.
Sie hätten auch die Möglichkeit, die [Smoothing Pool](./prepare-node.mdx#smoothing-pool)-Funktion von Rocket Pool zu nutzen.

### Wie weiß ich, wie viel mein rETH wert ist? Macht es ein Rebase?

Der rETH-Token wird kein Rebase durchführen.
Die Anzahl der Token in Ihrer Wallet bleibt konstant, aber sie gewinnen im Laufe der Zeit an Wert.

### Ich habe ein technisches Problem beim Betrieb meines Nodes, wie bekomme ich Hilfe?

Sie können zunächst die [Rocket Pool Support](https://rocketpool.support)-Seite überprüfen.
Wenn das nicht hilft, können Sie Ihre Frage im **#support**-Kanal von Rocket Pool [im Discord-Server](https://discord.gg/rocketpool) stellen.

### Wie kann ich Test-ETH bekommen, um mit der Erstellung und dem Betrieb eines Minipools zu experimentieren? Ich kann keine Nachrichten im Faucet-Kanal posten.

Siehe [Test-ETH auf Hoodi erhalten](./testnet/overview#getting-test-eth-on-hoodi).

### Wie kann ich meinen Node wiederherstellen, wenn meine Maschine kaputt geht?

Kurze Antwort: Ihre Mnemonic ist alles, was Sie benötigen, um Ihren Node vollständig wiederherzustellen.
Stellen Sie immer sicher, dass Sie sie sicher aufbewahren.

Um Ihren Node auf einer neuen Maschine wiederherzustellen, stellen Sie zunächst sicher, dass **Ihre vorherige Maschine nicht wieder online sein wird** mit den verfügbaren Schlüsseln, da zwei Nodes, die mit denselben Schlüsseln laufen, **Sie geslasht werden**.
Folgen Sie den [Schritten](./install-modes), um den Smartnode auf einer neuen Maschine zu installieren.
Stellen Sie dann Ihre Node-Wallet und Validator-Schlüssel wieder her, indem Sie den Befehl `rocketpool wallet recover` ausführen und Ihre 24-Wort-Mnemonic eingeben.

### Warum synchronisieren meine Clients nicht? Ich habe eine geringe Anzahl von Peers.

Clients benötigen eine gesunde Anzahl von Peers, um ordnungsgemäß synchronisieren zu können.
Sie können zunächst den Test [hier](https://www.yougetsignal.com/tools/open-ports/) durchführen und überprüfen, ob die Ports 30303 und 9001 geöffnet sind.
Wenn sie geschlossen sind, müssen Sie die Portweiterleitung auf Ihrem Router einrichten.
Stellen Sie außerdem sicher, dass Ihr Node eine statische lokale IP-Adresse hat, damit die Portweiterleitung nicht abbricht, weil Ihr Node eine neue Adresse erhält.

### Mein Consensus-Client braucht zu lange zum Synchronisieren. Was soll ich tun?

Consensus-Clients können lange zum Synchronisieren brauchen, wenn Sie den Synchronisierungsprozess nicht mit [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing) gestartet haben.
Selbst wenn Sie ihn schon lange laufen lassen, ist es normalerweise schneller, die Checkpoint-Sync-URL zu konfigurieren, die aktuellen Synchronisierungsdaten mit `rocketpool service resync-eth2` zu löschen und von vorne zu beginnen.
Ihr Client sollte in weniger als einer Minute synchronisiert sein.

### Ich habe bereits neu gestartet. Warum sagt Grafana, dass ich immer noch neu starten muss?

Die Neustart-Informationen werden zwischengespeichert und aktualisieren sich nur alle paar Stunden.
Das Ausführen von `sudo apt update` erzwingt ein Update.

### Ich habe meine Execution Layer und/oder meine Beacon Chain oder Consensus Layer geändert. Wie lösche ich die alten Daten?

Wenn Sie Clients wechseln, löscht Rocketpool die alten Volumes nicht. Diese Daten könnten erheblichen Speicherplatz verschwenden, und Sie möchten sie möglicherweise entfernen. Dazu müssen Sie die Volumes finden. Wenn Sie die Standard-Rocketpool-Einstellungen verwenden, werden die Docker-Volumes unter `/var/lib/docker/volumes/` gespeichert. Die Execution Layer befindet sich in `rocketpool_eth1clientdata/_data/*` und die Consensus Layer in `rocketpool_eth2clientdata/_data/*`.

Um auf diese Verzeichnisse zuzugreifen, müssen Sie möglicherweise mit `sudo -i` als Root sudo werden. Dann können Sie ein Verzeichnis löschen, indem Sie `rm -rf <directory>` aufrufen. Wenn Sie beispielsweise alle Geth-Daten löschen möchten, würden Sie `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/` aufrufen.

Um als Root zu beenden, geben Sie `exit` ein.
