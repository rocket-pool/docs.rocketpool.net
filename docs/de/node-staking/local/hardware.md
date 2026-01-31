# Auswahl der Staking-Hardware

Es gibt keine offiziellen Spezifikationen für den Betrieb eines Rocket Pool Nodes.
Diese Seite bietet einige Richtlinien und Beispiele, die Sie bei der Auswahl der Staking-Hardware verwenden können.

Die minimalen Hardwareanforderungen Ihres Nodes hängen von den Consensus- und Execution-Clients ab, die Sie wählen.
Wenn Sie beispielsweise beabsichtigen, Ihren Node auf einem leistungsschwachen Gerät zu betreiben, sind Sie möglicherweise auf die Verwendung von `Geth` als Execution-Client und `Nimbus` als Consensus-Client beschränkt.
Wenn Sie einen leistungsstärkeren NUC mit 32+ GB RAM verwenden, stehen Ihnen alle Client-Kombinationen offen.

Die nachstehenden Richtlinien gehen davon aus, dass Sie ein **komfortables** Hardware-Niveau wünschen, was bedeutet, dass Sie über Überkapazität verfügen.
Wenn Sie diese Richtlinien beachten, wird Ihr Node über ausreichend Ressourcen verfügen, um alle von Rocket Pool unterstützten Client-Kombinationen auszuführen.
Dies ermöglicht es Ihnen, ein `random` Client-Paar zu wählen, was sehr wichtig für die Client-Diversität im Ethereum-Netzwerk ist.

::: tip HINWEIS
Ethereum-Staking ist sehr nachsichtig.
Wenn Ihr Haus überflutet wird und Ihr Staking-Gerät zerstört wird, gibt es keine große Strafe dafür, dass Sie eine Woche brauchen, um wieder betriebsbereit zu sein (es sei denn, Sie befinden sich zufällig in einem Sync-Komitee, was ein sehr seltenes Ereignis ist).
Komponentenausfälle können irgendwann passieren, aber machen Sie sich keine Sorgen darüber.
Ausfallzeiten führen nicht zu Slashing, es sei denn, Sie sind während eines größeren Ausfalls des gesamten Ethereum-Netzwerks offline.
:::

## Hardwareanforderungen

Ethereum-Validatoren sind nicht sehr rechenintensiv, was bedeutet, dass jeder zusätzliche Validator **sehr wenig zusätzliche Ressourcen** verbraucht, sobald Ihre Execution- und Consensus-Clients laufen.
Dies gilt bis zu 64 Validatoren, danach sind die für einen 65. Validator und darüber hinaus erforderlichen Ressourcen vernachlässigbar.

Nach unserer Erfahrung sind die meisten Setups, einschließlich Mini-PCs und NUCs, in der Lage, eine praktisch unbegrenzte Anzahl von Validatoren auszuführen.

### CPU-Anforderungen

**Richtlinie: jede moderne CPU mit mindestens 4 Threads.**

Der Betrieb eines Rocket Pool Nodes ist nicht sehr rechenintensiv.
Der größte Einfluss der CPU besteht darin, wie schnell Ihr Node den Zustand der Blockchain initial synchronisieren kann, wenn Sie ihn zum ersten Mal erstellen (oder wenn Sie später Clients wechseln).
Nach der initialen Synchronisierung wird die CPU nicht mehr so stark beansprucht.

CPU-Bezeichnungen können täuschend sein; ein Intel Core i5 von 2010 ist normalerweise **weniger leistungsstark** als ein Core i3 von 2022.
Viele Community-Mitglieder verwenden Intel NUC-Geräte wegen ihres kleinen Formfaktors, aber ein alter i5 NUC kann eine schlechtere Wahl sein als ein neuer i3.
Aus diesem Grund empfehlen wir die Verwendung einer "modernen" CPU, die höchstens ein paar Jahre alt ist.
Genauer gesagt, **für x64-basierte CPUs** empfehlen wir eine CPU, die die [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>)-Erweiterung unterstützt - überprüfen Sie die Herstellerspezifikationen Ihrer CPU, um zu sehen, ob sie unterstützt wird.
Nicht alle modernen CPUs unterstützen dies; Celeron-CPUs zum Beispiel enthalten es in der Regel nicht.

ARM-basierte CPUs (wie der Mac M1 oder M2 oder der Rock 5B) fallen nicht unter die obige BMI2-Erweiterung.

::: tip HINWEIS
Wenn Sie an einem NUC interessiert sind, können Sie anhand seiner Modellnummer erkennen, wie modern der NUC ist.
Sie sind formatiert als `NUC` + `Generationsnummer` + `Modell` + `CPU-Typ` + `Suffix`.
Zum Beispiel ist ein `NUC11PAHi50Z`-Gerät ein i5-Gerät der 11. Generation.
Sie können eine Liste von NUCs [hier](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) auf der Intel-Website sehen.

Andere Mini-PCs, wie der Asus PN50 oder PN51, folgen nicht dieser Konvention, aber Informationen darüber, welche CPU von ihnen verwendet wird, sollten auf ihren Produktseiten enthalten sein.
:::

Die Anzahl der Kerne einer CPU ist weniger relevant als ihre **Anzahl an Threads**.
Wir empfehlen ein **Minimum von 4 Threads** für den Betrieb eines Rocket Pool Nodes.
Eine 2-Kern-CPU mit 4 Threads wird problemlos funktionieren.
Es ist selten, eine CPU mit nur 2 Threads zu finden.

### RAM-Anforderungen

**Richtlinie: mindestens 16 GB RAM, 32 GB bevorzugt, DDR4 bevorzugt**

Rocket Pool Nodes können mit nur 16 GB RAM betrieben werden.
Wir empfehlen im Allgemeinen, etwas mehr zu haben, um etwas Spielraum zu bieten und volle Unterstützung für RAM-intensive Clients wie Teku zu gewährleisten.
Ein zusätzlicher Vorteil von mehr RAM ist, dass Sie dem Execution-Client eine größere Cache-Größe zur Verfügung stellen können, was dazu neigt, die Rate der Speicherplatznutzung zu verlangsamen.

### SSD-Anforderungen

**Richtlinie: eine 2+ TB SSD mit TLC oder besser, mit DRAM-Cache. NVMe bevorzugt.**

Dieses Element ist wichtiger als die meisten Menschen erwarten.
Der Execution-Client ist stark auf IOPS oder "Operationen pro Sekunde" angewiesen; wir empfehlen 15k Lese-IOPS und 5k Schreib-IOPS.
In der Praxis bedeutet dies:

- HDD (Festplatten mit rotierenden Scheiben) funktionieren nicht
- SATA- oder externe USB 3.0+ SSDs _können_ funktionieren
- NVMe SSD-Laufwerke werden bevorzugt

Wenn Sie bereits eine SSD haben, die Sie verwenden möchten, und sicherstellen möchten, dass sie ausreichende Leistung für den Node-Betrieb hat.

_\* Wenn Sie sich nicht sicher sind, ob Ihre Festplatte diese Leistungsanforderungen erfüllt, ist `fio` eine gute Möglichkeit, sie zu testen.
Siehe [hier](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/) für Linux-Anweisungen,
und [hier](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) für MacOS-Anweisungen._

:::tip HINWEIS
Die SSD-Auswahl kann eine komplexe Entscheidung sein!

Die Methode, mit der SSDs Daten auf ihren Flash-Chips speichern, hat einen merklichen Einfluss auf Geschwindigkeit und Langlebigkeit.
Beim Kauf einer SSD werden Sie möglicherweise Bezeichnungen wie `QLC`, `TLC` oder `SLC` bemerken.
Diese stehen für die Menge an Daten, die in einer einzelnen Zelle des Flash-Chips enthalten sind: `Q` für "quad" bedeutet 4, `T` für "triple" bedeutet 3, `M` für "multi" bedeutet 2 und `S` für "single" bedeutet 1.

Wir empfehlen **TLC-, MLC- oder SLC**-Laufwerke.
Wir **empfehlen keine QLC-Laufwerke** aufgrund ihrer langsameren Leistung und geringeren Gesamtzuverlässigkeit.

SSDs sind mit oder ohne DRAM erhältlich, einem Hardware-Element, das den Zugriff auf Daten auf der SSD effizienter macht.
Die mit DRAM sind schneller, aber die ohne DRAM sind billiger.
DRAM ist jedoch sehr wichtig für einen reibungslosen Node-Betrieb.

Wir empfehlen ein Laufwerk mit **DRAM**-Cache.
Wir **empfehlen keine DRAM-losen Laufwerke**.
:::

Die letzte Überlegung ist die Laufwerksgröße.
Ab 10/2024 benötigt die `geth` Execution-Client-Datenbank nach Abschluss der initialen Synchronisierung (oder nachdem Sie das Pruning gerade abgeschlossen haben) etwa 1,2 TB Speicherplatz.
Dies wird im Laufe der Zeit stetig wachsen, und obwohl Pruning einen Teil dieses Speicherplatzes zurückgewinnen kann, _wächst_ der frisch beschnittene Zustand im Laufe der Zeit.
Sie werden mit einem größeren Laufwerk mehr Sicherheit haben.

### Häufiges Zubehör

Viele Node-Betreiber verbessern ihre Setups über die Mindestanforderungen hinaus.
Einige häufige Ergänzungen umfassen:

- SSD-Kühlkörper zur Verlängerung der Laufwerkslebensdauer
- Unterbrechungsfreie Stromversorgungen (USV) bei Stromausfällen
- Ein Fallback-Node als Backup für den Fall, dass etwas ausfällt

Diese sind alle praktisch zu haben, aber nicht erforderlich, um einen Rocket Pool Node zu betreiben.

## Beispiel-Setups

In diesem Abschnitt zeigen wir einige der verschiedenen Builds, die die Rocket Pool-Community für sich selbst erstellt hat.
Sie sind Beispiele dafür, was die Leute verwenden, keine Empfehlungen dafür, wie Sie Ihr Setup betreiben sollten.
Beachten Sie, dass viele etwas veraltet sind und z.B. SSDs verwenden, die jetzt zu klein sind.

### Xer0's Server

![](./images/Xer0.jpg)

Discord-Benutzer **Xer0** gehört zu den vielen Stakern, die sich für einen konventionellen PC-Formfaktor für ihre Staking-Maschine entschieden haben.
Sie wollten ein Rig bauen, das jahrelang halten würde, ohne dass viel Wartung und Aufrüstung erforderlich wäre, und gleichzeitig eine vollständige Anpassung jeder Komponente ermöglichte.
Zu diesem Zweck entwarf und baute Xer0 einen vollständigen ATX-Server - ähnlich wie ein traditioneller Desktop-PC, aber ausschließlich für das Staking auf Ethereum ausgelegt.
Ihr Setup umfasst einen Sechskern-Xeon Bronze 3204 (1,9 GHz), 8 DDR4-Slots und einen M.2-Slot... da dies im Wesentlichen ein Home-Server-Build ist, liegen die genauen Komponenten vollständig beim Endbenutzer.

Xer0's Setup:

- Motherboard: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Kühler: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Gesamt: $1680**

Hier sind Xer0's Kommentare, warum sie dieses Setup gewählt haben:

_Offensichtlich ist es nicht notwendig, ein Monster zu bauen, um einfach im Ethereum-Netzwerk zu staken, aber ich habe einige Gründe, warum ich so etwas gebaut habe._

1. _Ich glaube, dass 1 oder mehr Validatoren in der Zukunft viel mehr wert sein werden als das, was wir gerade sehen, also wollte ich etwas kaufen, das in der Lage sein wird, das Netzwerk für mindestens die nächsten 10-20 Jahre ohne Probleme zu unterstützen._
1. _Durch die Erstellung einer Maschine mit so vielen Kernen habe ich mir auch viel mehr Spielraum gegeben bis zu dem Punkt, dass ich einen L2-Aggregator darauf laufen lassen könnte, ohne Probleme (bezüglich Hardware) und alles andere, was ich auf einem Server laufen lassen möchte._ :)
1. _Ich baue gerne Computer, also habe ich es gebaut…_
1. _Mit einem Server-Build gibt es mir viel mehr Flexibilität mit Hardware und Funktionen, die die meisten Computer nicht nativ haben._
1. _Ein bisschen zukunftssicher (nur für den Fall)_ :wink:

### Darcius's Shelf Rig

![](./images/Darcius.jpg)

Rocket Pool-Gründer David Rugendyke (bekannt auf Discord als **darcius**) verbrachte lange Zeit damit, seinen Node zu perfektionieren.
Nach einigen Überlegungen baute er einen Mini-ITX, der klein und tragbar ist, aber dennoch eine enorme Rechenleistung bietet.
Sein Rig umfasst einen 8-Kern Ryzen 7 5800x (3,8 GHz), zwei DDR4-Slots und zwei M.2-Slots für NVMe SSDs.
Es ist wirklich eines der leistungsstärksten Rigs der Rocket Pool Nodes, aber aus gutem Grund: darcius betreibt eine spezielle Art von Rocket Pool Node, einen Oracle Node genannt, der Informationen von der Beacon Chain zurück zur Execution Chain über alle Rocket Pool Validatoren weiterleitet.
Mit Tausenden aktiven Rocket Pool Minipools, die überwacht werden müssen, erfordert dieser Job viel Leistung... aber sein Shelf Rig ist der Aufgabe problemlos gewachsen.

Darcius's Setup:

- Motherboard: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Gesamt: $1587**

### Yorick's microATX Build

![](./images/Yorick-stock.jpg)

Erfahrener Hardware-Enthusiast **YorickDowne** hat viel Erfahrung beim Bau und der Wartung von Servern.
Mit diesem Wissen hat er sich auf ein flexibles microATX-Setup festgelegt.
Seine Maschine ist erheblich kleiner als ein typischer PC, schafft es aber dennoch, Server-Grade-Technologie unterzubringen, die Widerstandsfähigkeit und Betriebszeit maximiert - Schlüsselmetriken beim Betrieb eines Rocket Pool Nodes.
Er hat Empfehlungen sowohl für Intel- als auch für AMD-Setups, die Sie [auf seiner Website](https://eth-docker.net/docs/Usage/Hardware) finden können.
Die Intel-Version verwendet einen Quad-Core i3-9100F (3,6 GHz) oder eine Xeon-CPU, und die AMD-Version schlägt jede Ryzen-CPU vor, die ECC-Speicher unterstützt.
Für beide Konfigurationen schlägt er 16 GB ECC-RAM und eine 1 TB NVMe SSD vor.

Yorick's Setup:

- Motherboard: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Beliebig (Beispiel: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Gehäuselüfter: Beliebig
- **Gesamt: Etwa $886**

Hier sind Yorick's Kommentare, warum er dieses Setup gewählt hat:

- _Es ist zu den gleichen oder niedrigeren Kosten als einige NUCs_
- _Es hat ECC-RAM, was bedeutet, dass wenn der Speicher ausfällt - was von Zeit zu Zeit passiert - ich es wissen werde, weil das System es mir sagt. Ich muss nicht memtest87 für 4-5 Tage laufen lassen, um herauszufinden, ob mein Problem mit Instabilität überhaupt speicherbezogen ist. Ich schütze meine Zeit energisch, damit ich sie damit verbringen kann, auf Discord zu schwadronieren, anstatt Hardware zu debuggen_
- _Es hat IPMI, was Remote-Verwaltung über Ethernet/Browser der gesamten Maschine ist, einschließlich UEFI und Power-Cycle. Ich sollte in der Lage sein, in einen längeren Urlaub zu gehen und trotzdem vollen Fernzugriff zu haben._
- _Wenn ich redundante Speicherung möchte, damit ein eventueller SSD-Ausfall ein Nicht-Ereignis ist, kann ich das tun_
- _Es ermöglicht große Flexibilität bei Build-Auswahlen. Ich kann wählen, wie viel RAM und Rechenleistung ich möchte; ich kann wählen, ein NAS mit Virtualisierungstechnologie wie TrueNAS Scale zu betreiben und den Node dort zusammen mit anderen Home-Server-Sachen laufen zu lassen._

### Drez's Laptop

![](./images/Drez.jpg)

Manchmal macht es einfach keinen Sinn, Geld für neue Hardware auszugeben.
Im Fall von Discord-Benutzer **Drez** ist der Betrieb eines Rocket Pool Nodes eines dieser Male.
Drez hatte zufällig einen Ersatz-Laptop herumliegen, und sie verwandelten ihn mit Leichtigkeit in einen Node.
Ihre Maschine kommt mit einem Quad-Core i7-4710HQ (2,5 GHz), zwei DDR3-Slots und einem 2,5" SATA-Slot.
Als Laptop kommt er auch mit seiner eigenen Batterie (was die Notwendigkeit einer USV kompensiert).
Sie fügten im Laufe der Zeit einige zusätzliche Upgrades hinzu, was dem Laptop noch mehr Leistung für zusätzliche Sicherheit gab.

Drez's Setup:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Enthalten)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Gesamt: $1910**

Hier sind Drez's Kommentare, warum sie dieses Setup gewählt haben:

_Der Hauptgrund, warum ich auf diesem Laptop staken werde, ist, dass ich bereits einen Ersatz-Laptop hatte und kein zusätzliches Geld für einen neuen Server ausgeben muss.
Ich mag seine Mobilität, Kompaktheit, den eingebauten Bildschirm für einfache Überwachung.
Im Falle von Überhitzung habe ich ein Laptop-Kühlpad und einen Ersatz-CPU-Kühler gekauft, nur für den Fall, ich empfehle auch, die Wärmeleitpaste zu wechseln, besonders wenn Sie auf einer älteren Maschine laufen werden_

## NUCs (Next Unit of Computing) und Mini-PCs

Der Betrieb eines Rocket Pool Nodes erfordert nicht unbedingt einen komplett selbstgebauten Desktop.
Tatsächlich ist eines der beliebtesten Setups unter Stakern der illustre NUC.
Ein NUC (Next Unit of Computing) ist im Wesentlichen ein kleiner, in sich geschlossener Computer, der auf sehr niedrigen Stromverbrauch und maximale Effizienz ausgelegt ist.
NUCs sind großartig für die meisten Staker, die nur wenige Validatoren betreiben, aufgrund ihrer geringen Wartung, niedrigen monatlichen Betriebskosten und einfachen Einrichtung.
Im Gegensatz zu PCs kommen NUCs vormontiert in einem Gehäuse; alles, was Sie tun müssen, ist etwas RAM hinzuzufügen, eine SSD hinzuzufügen, und schon sind Sie einsatzbereit!
Im Folgenden finden Sie einige Beispiele für NUC-Setups, die einige Rocket Pool Veteranen verwenden und empfehlen.

::: tip HINWEIS
**Ethernet-Adapter-Kompatibilität**

Wenn Sie planen, einen Intel® NUC der 11. oder 12. Generation zu kaufen, können Sie auf Konnektivitätsprobleme mit dem Ethernet-Adapter stoßen, insbesondere wenn der Adapter als **I225-LM** identifiziert wird (Überprüfen Sie die Intel-Spezifikationen vor dem Kauf).
Wenn Sie bereits einen haben, gibt es Schritte, die Sie unternehmen können, um dieses Problem anzugehen.
Der I225-LM-Adapter wurde mit bestimmten Kompatibilitätsherausforderungen in Verbindung gebracht, die zu **System-Freezes** und unerwartetem Kernel-Verhalten führen können, insbesondere bei der Verwendung von Linux-Kerneln.

Um festzustellen, ob Ihr NUC den problematischen I225-LM Ethernet-Adapter verwendet, können Sie den folgenden Befehl im Terminal verwenden:

```shell
sudo lshw -class network | grep 225
```

Wenn die Ausgabe das Vorhandensein des I225-LM-Adapters bestätigt, können Sie die genannten Probleme erleben. Es gibt jedoch _Abhilfen_, die Sie anwenden können, um diese Probleme zu mildern:

**USB-C zu Ethernet-Adapter**: Eine praktikable Lösung besteht darin, einen USB-C zu Ethernet-Adapter zu erwerben und Ihr Internetkabel über diesen externen Adapter anzuschließen. Obwohl dieser Ansatz zusätzliche Hardware und Konfiguration erfordert, hat er sich als effektiv bei der Lösung der Kompatibilitätskonflikte erwiesen. Dies ermöglicht es Ihnen, die neuesten verfügbaren Linux-Kernel zu verwenden, ohne auf die Freeze- oder Kernel-bezogenen Anomalien zu stoßen, die mit dem I225-LM-Adapter verbunden sind.**Dies ist die empfohlene Lösung (vorerst), wenn Sie bereits einen NUC mit dem I225-LM haben** _Beachten Sie, dass die Entscheidung für einen Adapter einen Kompromiss in Bezug auf potenzielle Latenz oder reduzierte Internetgeschwindigkeit darstellen kann. Um diese Auswirkung zu mildern, ist es ratsam, einen Adapter mit mindestens 1 GB/s Portabilität zu wählen, wodurch optimale Datenübertragungsraten aufrechterhalten werden._

**Treiber- und Software-Updates**: Erwägen Sie die Aktualisierung Ihrer Treiber, Firmware und BIOS, indem Sie sich auf die offizielle Intel® Support-Seite für Ihr NUC-Modell [hier](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads) beziehen. Dies könnte die Verwendung des neuesten verfügbaren Support-Treibers von Intels Website oder die Anwendung von BIOS-Updates beinhalten, die Kompatibilitätsbedenken ansprechen.

**Intel's Patch (Windows)**: Intel hat einen Patch veröffentlicht, um ein ähnliches Problem auf Windows-Systemen zu beheben. Obwohl der Patch selbst **möglicherweise nicht direkt auf Linux-Umgebungen anwendbar ist**, zeigt er die Anerkennung des Problems durch Intel und ihre Bemühungen, Lösungen bereitzustellen. Sie können weitere Details zum Patch in diesem [Link](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3) finden.

Denken Sie daran, dass sich die Technologie weiterentwickelt und sich Lösungen im Laufe der Zeit ändern können. Bleiben Sie immer mit den neuesten Ressourcen von Intel für Ihr spezifisches NUC-Modell auf ihrer offiziellen Downloads-[Seite](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads) auf dem Laufenden.

Durch Befolgen dieser Schritte können Sie die Kompatibilitätsherausforderungen im Zusammenhang mit dem I225-LM Ethernet-Adapter bei Intel® NUC-Produkten der 11. und 12. Generation angehen und eine reibungslosere und zuverlässigere Erfahrung mit Ihrer Server-Bereitstellung gewährleisten. _Während eine Teilmenge von NUC-Benutzern mit diesem Adapter berichtet hat, keine Probleme zu haben, ist es wichtig zu beachten, dass die **Mehrheit der Benutzer**, insbesondere nach einem Kernel-Upgrade, auf Probleme gestoßen ist. Insbesondere haben sich die 5.15.+ Kernel als die stabilste Option für diejenigen erwiesen, die den I225-LM-Adapter verwenden. Wenn die Idee, einen USB-C-Adapter zu verwenden, nicht ansprechend ist und Sie bereit sind, das Risiko potenzieller zufälliger Freezes einzugehen, ist es ratsam, **bei einer Kernel-Version zu bleiben, die größere Stabilität gezeigt hat**._
:::

### Ken's NUC8i5BEK

![](./images/Ken.jpg)

Der NUC8i5BEK ist einer von Intels eigenen NUCs mit einem Prozessor der 8. Generation.
Dieses Modell wurde 2018 veröffentlicht und kommt mit einer Quad-Core i5-8259U CPU (2,30 GHz), zwei DDR4-Slots, einem M.2-Slot für SSDs und USB 3.1-Ports.
Er zieht normalerweise etwa 20 Watt, aber Discord-Benutzer **Ken** konnte ihn während der normalen Validierung auf 9 Watt optimieren.
Er ist mehr als in der Lage, jeden Execution- und jeden Consensus-Client zu handhaben, was ihn zu einer ausgezeichneten Wahl für eine leichte, effiziente Node-Maschine macht.

Ken's Setup:

- Basis: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Lüfterloses Gehäuse (optional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Gesamt: $691 bis $825**

Hier sind Ken's Kommentare, warum er dieses Setup gewählt hat:

- _Kleine Größe und Stellfläche, das Netzteil ist ein Ziegel am Stromkabel (wie bei einem Laptop), Single-Board-Computer, x86-Architektur, niedriger Kaufpreis, geringer Stromverbrauch (~10W), 3-Jahres-Garantie und eine aktive Produktlinie des Herstellers (Intel)._
- _8. Generationen sind reichlich schnell und zu einem niedrigeren Preispunkt als die neuesten Generationschips._
- _Ich habe auf ein lüfterloses (passiv gekühltes) Gehäuse aufgerüstet, sodass der NUC absolut lautlos ist (0 dB), da ich ihn in meinem Home-Office lasse (ein Standard-NUC ist bereits fast lautlos)._
- _Plus kein mechanischer Verschleiß an den Lüfterlagern._
- _Wiederverkaufs- oder Wiederverwendungswert, wenn ich mich entscheide, diese Hardware-Plattform als meinen RP-Node auszumustern - NUCs sind großartige Workstation-Computer._

### GreyWizard's NUC10i7FNH

![](./images/GreyWizard.jpg)

Der NUC10i7FNH ist ein weiterer von Intels eigenen NUCs.
Dieser verfügt über einen Prozessor der 10. Generation und wurde 2019 veröffentlicht.
Er kommt mit einer Sechs-Kern i7-10710U CPU (1,10 GHz, boostet auf 4,7 GHz), zwei DDR4-Slots, einem M.2-Slot und einem 2,5"-Slot für SSDs und USB 3.1-Ports.
Er zieht etwa 20 Watt Strom.
Es ist eine unglaublich leistungsstarke Maschine, angesichts ihres Stromverbrauchs und ihrer Größe.
Discord-Benutzer **GreyWizard** verwendet diesen NUC für seinen Node - die zusätzliche Leistung gibt ihm die Gewissheit, dass egal, was die Zukunft der Ethereum 2.0-Chain bereithält, seine Maschine damit umgehen kann.

GreyWizard's Setup:

- Basis: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 ea.)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Gesamt: $1068**

Hier sind GreyWizard's Kommentare, warum er dieses Setup gewählt hat:

_Ich habe mich für den i7 NUC entschieden, hauptsächlich weil er sich wie die beste Kombination aus herausragender Leistung im Verhältnis zur Gesamtgröße und zum Overhead anfühlte.
Ich habe mir auch andere Optionen wie den Bau einer Micro ATX-Maschine angesehen.
Nach der Preisgestaltung einer mit den Spezifikationen, die ich suchte, endete dieser Intel NUC ungefähr zum gleichen Preis, und der Formfaktor ist wirklich schwer zu schlagen.
Ich mag es, den zusätzlichen Spielraum für Leistung/Sicherheit zu haben, und ich erkenne an, dass dies mit ziemlicher Sicherheit viel zu viel ist.
Ich betrachte Staking als eine ernsthafte Investition und ich möchte mir keine Sorgen machen, ob meine Hardware ausreichend sein wird._

_Tipps für andere Leute, die dies als Option in Betracht ziehen..._

- _Der NUC läuft ziemlich warm, ähnliche Temperaturen wie ein Laptop. Wenn Sie sich Sorgen über die CPU-Temperatur machen und Sie etwas Leistungsstarkes wollen, dann sollten Sie sich kleine Desktop-Setups wie Micro ATX ansehen._
- _Sie sollten sicherstellen, dass um Ihren NUC herum viel Platz für den Luftstrom ist. Planen Sie, den Bereich regelmäßig zu reinigen, um Staubansammlungen zu verhindern._
- _Stellen Sie sicher, dass Sie die Kompatibilität für Ihre RAM-Karten überprüfen. Die verschiedenen NUCs unterstützen unterschiedliche Grade von Gesamt-RAM, RAM-Geschwindigkeiten usw._
- _Wenn Sie sich für den NUC entscheiden, würde ich vorschlagen, dass Sie sich beim Auswahl von RAM Raum zum Wachsen geben... Zum Beispiel geben Sie ein bisschen mehr aus und holen Sie sich eine einzelne 32-GB-RAM-Karte anstelle von 2x16, damit Sie später erweitern können, wenn Sie möchten (vorausgesetzt, Ihr NUC unterstützt 64 GB in diesem Beispiel)_
- _Zögern Sie nicht, mich auf Discord zu kontaktieren, wenn Sie diskutieren möchten._

### ArtDemocrat's NUC10i5FNHN Build Process Video

Um Greywizard's Setup-Beschreibungen und Tipps zu ergänzen, erstellte ArtDemocrat dieses Build-Prozess-Video als zusätzliche Hilfsressource, um einen NUC10 einzurichten (in diesem Fall ein NUC10i5FNHN, aber der Build-Prozess sollte für einen NUC10i7FNH ähnlich sein):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat's Setup:

- Basis: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17's PN50

![](./images/PN50-actioncj17.jpg)

Der ASUS PN50 ist ein Mini-PC, der viel mit Intels NUC-Familie gemeinsam hat.
Er hat einen sehr kleinen Formfaktor, verfügt aber über alle Komponenten und Funktionen eines vollständigen PCs.
Er kommt mit Ihrer Wahl der AMD-CPU, sodass Sie zwischen Leistung und Kosten abwägen können (bis zu einem 8-Kern Ryzen R7-4700U bei 2,0 GHz), zwei DDR4-Slots, einem M.2-Slot und einem 2,5"-Slot für SSDs und USB 3.1-Ports.
Er kommt auch mit einem 90-Watt-Netzteil, obwohl er in der Praxis nicht so viel Strom benötigt, während er als Rocket Pool Node fungiert.
Discord-Benutzer **actioncj17** hat mehrere verschiedene Setups ausprobiert, bevorzugt aber den PN50 gegenüber allem... obwohl sie fröhlich zugeben, dass es übertrieben ist, einen Rocket Pool Node zu betreiben.

Actioncj17's Setup:

- Basis: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Gesamt: $1118**

Hier sind actioncj17's Kommentare, warum sie dieses Setup gewählt haben:

_Meine Antwort, warum ich den Asus PN50 gewählt habe, ist ganz einfach.
Ich wollte sehen, wie großartig AMDs Ryzen 7 4700U war.
Sagen wir einfach, ich bin nicht enttäuscht.
Ich habe eigentlich mit dem Intel NUC10FNK angefangen.
Ich habe 32 GB RAM und 1 TB 970 evo plus nvme m.2 in den NUC gesteckt, und er läuft hervorragend.
Ich habe keine Beschwerden über den NUC und er funktioniert gut, aber ich bekomme mehr aus meinem PN50 heraus.
Ich würde sagen, beide Setups sind übertrieben für das Staking auf Rocketpool, aber ein wenig Zukunftssicherheit schadet nicht.
Beide haben kleine Stellflächen und der NUC ist tatsächlich viel leiser, da er lüfterlos ist.
Alles in allem ist der PN50 ein besseres Preis-Leistungs-Verhältnis, wenn Sie einen bekommen können._

### Moralcompass's Mini-PC

![](./images/moralcompass-minipc.jpg)

Discord-Benutzer **moralcompass** ging einen ähnlichen Weg wie actioncj17, indem er einen Mini-PC wählte, aber ihre Präferenz gilt einer Intel-CPU.
Sie verwenden einen Mini-PC, der über einen Quad-Core i5 8250U (1,6 GHz, Boost bis zu 3,4 GHz), einen DDR4-Slot, einen M.2-Slot und einen 2,5"-Slot für SSDs und USB 3.0-Ports verfügt.
Moralcompass behauptet, dass er nur etwa 10 Watt aus der Wand zieht, was zeigt, dass Mini-PCs wie dieser sehr effizient sind.
Das Interessante an dieser Wahl ist, dass sie vollständig passiv gekühlt ist - keine Lüfter zu finden!
Während es viele Variationen von lüfterlosen Mini-PCs gibt, fand moralcompass einen, der für sie funktionierte, und blieb dabei.

Moralcompass's Setup:

- Basis: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Gesamt: $655**

Hier sind moralcompass's Kommentare, warum sie dieses Setup gewählt haben:

- _Keine beweglichen Teile, kein Geräusch._
- _Dual Intel NIC (falls ich mich entscheide, dies eines Tages als meinen Router umzufunktionieren)_
- _NVME + SATA-Slots (bevorzuge NVME für Geschwindigkeit und Optionen mit höherer TBW-Ausdauer. SATA gibt die Option von HDD oder SSD. Ich habe M.SATA-Schnittstellen vermieden, weil diese SSDs veraltet zu werden scheinen)_
- _USB- und serielle Ports verfügbar für das sanfte Herunterfahrsignal von der USV_
