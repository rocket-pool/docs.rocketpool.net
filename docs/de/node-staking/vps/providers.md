# Auswahl eines Hosting-Anbieters

Wenn Sie zu diesem Abschnitt gelangt sind, möchten Sie einen Rocket Pool-Node betreiben, können aber keinen lokal zu Hause einrichten; Sie benötigen einen **virtuellen privaten Server (VPS)**, der in der Cloud gehostet wird.
Es gibt mehrere verschiedene Dienste, die eine solche Maschine bereitstellen können, und sie kommen in zwei verschiedenen Varianten: VPS-Anbieter und öffentliche Cloud-Anbieter.

Die Wahl des richtigen kann schwierig sein, und das Verständnis der Unterschiede zwischen ihnen ist entscheidend.
In diesem Leitfaden werden wir etwas Licht auf die Unterscheidung werfen und einige der Dienste auflisten, die andere Rocket Pool-Benutzer in der Vergangenheit genutzt haben, um Ihnen bei der Navigation durch Ihre Optionen zu helfen.

## Traditionelles VPS-Hosting

Ein virtueller privater Server ist eine einzelne Instanz einer virtuellen Maschine, die auf einer größeren physischen Maschine residiert.
Sie sind die günstigste Option und werden weniger häufig eingesetzt als die allgegenwärtigen Cloud-Plattformen, sodass sie tendenziell mehr zur Dezentralisierung des Ethereum-Netzwerks beitragen.

Sie haben jedoch selten Hochverfügbarkeitsunterstützung; wenn der physische Server ausfällt, ist es wahrscheinlich, dass Ihr darauf gehosteter VPS ebenfalls ausfällt.
Außerdem haben sie einen festen Ressourcen-Fußabdruck; es ist normalerweise nicht möglich, Ressourcen wie CPU und RAM auf Abruf zu erhöhen oder zu verringern.

Ab 10/2024 war eine gut bepreiste und leistungsstarke Option der RS 12000 G11 von [Netcup](https://www.netcup.eu/vserver/vps.php).
Eine Warnung ist, dass der Speicher mit anderen geteilt wird, sodass Speicher-IOPs ein potenzieller Engpass sind.

## Dediziertes Server-Hosting

Im Gegensatz zu einem VPS ist ein dedizierter Server ein vollständiges physisches Gerät, das von Ihnen gemietet wird. Sie sind eine relativ erschwingliche Option und werden weniger häufig eingesetzt als die allgegenwärtigen Cloud-Plattformen, sodass sie tendenziell mehr zur Dezentralisierung des Ethereum-Netzwerks beitragen.

Ab 10/2024 waren zwei gut bepreiste und leistungsstarke Optionen die Rise- und Advanced-Bare-Metal-Server von [OVH](https://us.ovhcloud.com/). Es gibt eine Vielzahl davon, die sich im Laufe der Zeit ändern, sowie erhebliche Verkäufe. Sie müssen überprüfen, ob die [Hardware-Richtlinien](../local/hardware.md) erfüllt sind.

## Cloud-Hosting

Cloud-Hosting bezieht sich auf virtuelle Maschinen, die auf einem verteilten Netzwerk mehrerer Server aufgeteilt sind, anstatt auf einer einzelnen physischen Maschine gehostet zu werden.
Wenn eine der Hosting-Maschinen ausfällt, können die anderen nahtlos für sie übernehmen, sodass Verfügbarkeit und Zuverlässigkeit auf diesen Plattformen tendenziell extrem hoch sind.
Sie neigen auch dazu, flexible Ressourcenoptionen anzubieten; es ist relativ einfach, bei Bedarf mehr CPU, RAM oder Festplattenspeicher hinzuzufügen.

Aufgrund dieser zusätzlichen Vorteile sind Cloud-basierte Server tendenziell teurer als VPS-Lösungen.
Sie sind auch sehr beliebte Plattformen, sodass ihre Verwendung im Allgemeinen die Gesamtdezentralisierung des Ethereum-Netzwerks verringert.

Die 3 primären Cloud-Anbieter sind [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/) und [Google Cloud Platform (GCP)](https://cloud.google.com/).
Wir empfehlen nicht, Cloud-Hosting aufgrund von Preis- und Zentralisierungsbedenken zu verwenden.

## Wichtige Überlegungen

### Preis

Cloud-Hosting-Lösungen sind normalerweise eine sicherere Wahl, wenn Kosten keine Priorität sind.
Der folgende Abschnitt enthält eine detailliertere Aufschlüsselung der Kostenschätzungen, aber hier ist ein allgemeiner Vergleich zwischen einer VPS-Option und einer Cloud-Option:

- OVH Dedicated Server: $90-160/Monat
- Netcup VPS: $90/Monat
