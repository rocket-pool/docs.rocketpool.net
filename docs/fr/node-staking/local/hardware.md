# Sélection du Matériel de Staking

Il n'existe pas de spécifications officielles pour faire fonctionner un nœud Rocket Pool.
Cette page offre quelques recommandations et exemples que vous pouvez utiliser pour sélectionner du matériel de staking.

Les exigences matérielles minimales de votre nœud dépendront des clients Consensus et Execution que vous choisirez.
Si, par exemple, vous avez l'intention de faire fonctionner votre nœud sur un appareil peu puissant, vous pourriez être limité à utiliser `Geth` comme client Execution et `Nimbus` comme client Consensus.
Si vous utilisez un NUC plus puissant avec 32+ Go de RAM, toutes les combinaisons de clients vous sont ouvertes.

Les recommandations ci-dessous supposent que vous souhaitez un niveau de matériel **confortable**, ce qui signifie que vous disposez d'une capacité excédentaire.
Si vous gardez ces recommandations à l'esprit, votre nœud aura amplement de ressources pour exécuter n'importe quelle combinaison de clients supportée par Rocket Pool.
Cela vous permettra de choisir une paire de clients `aléatoire`, ce qui est très important pour la diversité des clients sur le réseau Ethereum.

::: tip NOTE
Le staking Ethereum est très tolérant.
Si votre maison est inondée et que votre appareil de staking est grillé, il n'y a pas de grosse pénalité à prendre une semaine pour revenir en ligne (sauf si vous vous trouvez dans un comité de synchronisation, ce qui est un événement très rare).
Une défaillance de composant peut se produire à un moment donné, mais ne vous en inquiétez pas.
Les temps d'arrêt ne vous font pas slasher à moins que vous ne soyez hors ligne pendant une panne majeure de l'ensemble du réseau Ethereum.
:::

## Exigences Matérielles

Les validateurs Ethereum ne sont pas très coûteux en calcul, ce qui signifie qu'une fois vos clients Execution et Consensus en cours d'exécution, tout validateur supplémentaire utilisera **une très petite quantité de ressources supplémentaires**.
Cela augmente jusqu'à 64 validateurs, après quoi les ressources nécessaires pour ajouter un 65e validateur et au-delà sont négligeables.

D'après notre expérience, la plupart des configurations, y compris les mini-PC et les NUC, sont capables d'exécuter un nombre effectivement illimité de validateurs.

### Exigences CPU

**Recommandation : tout CPU moderne avec au moins 4 threads.**

Faire fonctionner un nœud Rocket Pool n'est pas très intensif en calcul.
Le plus grand impact du CPU est la vitesse à laquelle votre nœud peut initialement synchroniser l'état de la blockchain lorsque vous le créez pour la première fois (ou si vous changez de clients plus tard).
Après la synchronisation initiale, le CPU n'est pas aussi sollicité.

La dénomination des CPU peut être trompeuse ; un Intel Core i5 de 2010 est généralement **moins puissant** qu'un Core i3 de 2022.
De nombreux membres de la communauté utilisent des appareils Intel NUC en raison de leur petit facteur de forme, mais un ancien NUC i5 peut être un moins bon choix qu'un nouveau i3.
Pour cette raison, nous recommandons d'utiliser un CPU "moderne" qui a, au maximum, quelques années.
Plus précisément, **pour les CPU basés sur x64**, nous recommandons un CPU qui prend en charge l'extension [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) - vérifiez les spécifications du fabricant de votre CPU pour voir s'il est pris en charge.
Tous les CPU modernes ne prennent pas en charge cette extension ; par exemple, les CPU Celeron ont tendance à ne pas l'inclure.

Les CPU basés sur ARM (comme le Mac M1 ou M2, ou le Rock 5B) ne sont pas concernés par l'extension BMI2 ci-dessus.

::: tip NOTE
Si vous êtes intéressé par l'utilisation d'un NUC, vous pouvez déterminer l'ancienneté du NUC par son numéro de modèle.
Ils sont formatés comme `NUC` + `numéro de génération` + `modèle` + `type de CPU` + `suffixe`.
Par exemple, une unité `NUC11PAHi50Z` est une unité i5 de 11e génération.
Vous pouvez voir une liste de NUC [ici](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) sur le site Web d'Intel.

D'autres mini-PC, comme l'Asus PN50 ou PN51, ne suivent pas cette convention, mais les informations sur le CPU qu'ils utilisent devraient être incluses dans leurs pages produits.
:::

Le nombre de cœurs d'un CPU est moins pertinent que son **nombre de threads**.
Nous recommandons un **minimum de 4 threads** pour le fonctionnement d'un nœud Rocket Pool.
Un CPU à 2 cœurs avec 4 threads fonctionnera sans problème.
Il est rare de trouver un CPU avec seulement 2 threads.

### Exigences RAM

**Recommandation : au moins 16 Go de RAM, 32 Go préférable, DDR4 préférable**

Les nœuds Rocket Pool peuvent fonctionner avec aussi peu que 16 Go de RAM.
Nous recommandons généralement d'avoir un peu plus pour offrir une marge de manœuvre et un support complet pour les clients gourmands en RAM comme Teku.
Un avantage supplémentaire d'avoir plus de RAM est que vous pouvez fournir une taille de cache plus importante au client Execution, ce qui tend à ralentir le taux d'utilisation de votre espace disque.

### Exigences SSD

**Recommandation : un SSD de 2+ To avec TLC ou mieux, avec un cache DRAM. NVMe préférable.**

Cet élément est plus important que la plupart des gens ne le pensent.
Le client Execution dépend fortement des IOPS, ou "opérations par seconde" ; nous recommandons 15k IOPS en lecture et 5k IOPS en écriture.
En pratique, cela signifie que :

- Les disques HDD (à plateau rotatif) ne fonctionneront pas
- Les SSD SATA ou USB 3.0+ externes _peuvent_ fonctionner
- Les disques SSD NVMe sont préférables

Si vous avez déjà un SSD que vous souhaitez utiliser et que vous voulez vous assurer qu'il a des performances suffisantes pour le fonctionnement du nœud.

_\* Si vous n'êtes pas sûr que votre disque réponde à ces exigences de performance, `fio` est un bon moyen de les tester.
Voir [ici](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/) pour les instructions Linux,
et [ici](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) pour les instructions MacOS._

:::tip NOTE
La sélection d'un SSD peut être un choix complexe !

La méthode utilisée par les SSD pour stocker des données sur leurs puces flash a un impact notable sur la vitesse et la longévité.
Lors de l'achat d'un SSD, vous pourriez remarquer des étiquettes comme `QLC`, `TLC` ou `SLC`.
Celles-ci représentent la quantité de données contenues dans une seule cellule de la puce flash : `Q` pour "quad" signifie 4, `T` pour "triple" signifie 3, `M` pour "multi" signifie 2, et `S` pour "single" signifie 1.

Nous recommandons des disques **TLC, MLC ou SLC**.
Nous **ne recommandons pas les disques QLC** en raison de leurs performances plus lentes et de leur fiabilité totale inférieure.

Les SSD sont disponibles avec ou sans DRAM, qui est un élément matériel qui rend l'accès aux données sur le SSD plus efficace.
Ceux avec DRAM sont plus rapides, mais ceux sans DRAM sont moins chers.
Cependant, la DRAM est très importante pour fournir un fonctionnement fluide du nœud.

Nous recommandons un disque avec un cache **DRAM**.
Nous **ne recommandons pas les disques sans DRAM**.
:::

La dernière considération est la taille du disque.
En octobre 2024, la taille de la base de données du client d'exécution `geth` nécessite environ 1,2 To d'espace après avoir terminé sa synchronisation initiale (ou après avoir terminé l'élagage).
Cela augmentera régulièrement au fil du temps, et bien que l'élagage puisse récupérer une partie de cet espace, l'état fraîchement élagué _augmente_ au fil du temps.
Vous aurez la tranquillité d'esprit avec un disque plus grand.

### Accessoires Communs

De nombreux opérateurs de nœuds améliorent leurs configurations au-delà des exigences minimales.
Certains ajouts courants incluent :

- Des dissipateurs thermiques SSD pour prolonger la durée de vie du disque
- Des alimentations sans interruption (UPS) en cas de pannes de courant
- Un nœud de secours pour avoir une sauvegarde en cas de défaillance

Tous ces éléments sont pratiques à avoir, mais ne sont pas nécessaires pour faire fonctionner un nœud Rocket Pool.

## Exemples de Configurations

Dans cette section, nous présenterons quelques-unes des diverses configurations que la communauté de Rocket Pool a créées pour elle-même.
Ce sont des exemples de ce que les gens utilisent, pas des recommandations sur la façon dont vous devriez gérer votre configuration.
Notez que beaucoup sont quelque peu obsolètes et, par exemple, utilisent des SSD qui sont maintenant trop petits.

### Le Serveur de Xer0

![](./images/Xer0.jpg)

L'utilisateur Discord **Xer0** fait partie des nombreux stakers qui ont opté pour un facteur de forme PC conventionnel pour leur machine de staking.
Ils voulaient construire une plateforme qui durerait des années et des années avec un minimum d'entretien et de mises à niveau nécessaires, tout en offrant une personnalisation complète de chaque composant.
À cette fin, Xer0 a conçu et construit un serveur ATX complet - un peu comme un PC de bureau traditionnel, mais ciblé exclusivement sur le staking sur Ethereum.
Leur configuration comprend un Xeon Bronze 3204 à six cœurs (1,9 GHz), 8 emplacements DDR4 et un emplacement M.2... bien que puisqu'il s'agit essentiellement d'une construction de serveur domestique, les composants exacts dépendent entièrement de l'utilisateur final.

Configuration de Xer0 :

- Carte mère : [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) (440 $)
- CPU : [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) (248 $)
- RAM : [NEMIX 2x32 Go DDR4 ECC 2933 MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) (359 $)
- SSD : [Sabrent 2 To Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) (250 $)
- Boîtier : [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) (172 $)
- PSU : [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) (111 $)
- Refroidisseur : [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) (100 $)
- **Total : 1 680 $**

Voici les commentaires de Xer0 sur les raisons pour lesquelles ils ont choisi cette configuration :

_Évidemment, il n'est pas nécessaire de construire une monstruosité pour simplement staker sur le réseau Ethereum, mais j'ai quelques raisons pour lesquelles j'ai construit quelque chose comme ça._

1. _Maintenant, je crois qu'à l'avenir, 1 validateur ou plus vaudra beaucoup plus que ce que nous voyons actuellement, donc je voulais acheter quelque chose qui pourra supporter le réseau pendant au moins les 10 à 20 prochaines années sans problème._
1. _En créant une machine avec autant de cœurs, je me suis également donné beaucoup plus de marge de manœuvre au point que je pourrais faire fonctionner un agrégateur L2 en plus de cela sans aucun problème (concernant le matériel) et tout ce que je voudrais faire fonctionner sur un serveur._ :)
1. _J'aime construire des ordinateurs, alors je l'ai construit..._
1. _Avec une construction de serveur, cela me donne beaucoup plus de flexibilité avec le matériel et les fonctionnalités que la plupart des ordinateurs n'ont pas nativement._
1. _Un peu d'évolutivité future (au cas où)_ :wink:

### La Configuration en Étagère de Darcius

![](./images/Darcius.jpg)

Le fondateur de Rocket Pool, David Rugendyke (connu sur Discord sous le nom de **darcius**), a passé beaucoup de temps à perfectionner son nœud.
Après quelques débats, il a construit un Mini-ITX qui est petit et portable, mais qui reste très puissant en termes de traitement.
Sa plateforme comprend un Ryzen 7 5800x à 8 cœurs (3,8 GHz), deux emplacements DDR4 et deux emplacements M.2 pour les SSD NVMe.
C'est vraiment l'une des plateformes les plus performantes des nœuds Rocket Pool, mais pour une bonne raison : darcius fait fonctionner un type spécial de nœud Rocket Pool appelé Oracle Node, qui relaie des informations de la chaîne Beacon vers la chaîne Execution sur tous les validateurs Rocket Pool.
Avec des milliers de minipools Rocket Pool actifs à surveiller, ce travail nécessite beaucoup de puissance... mais sa plateforme en étagère est facilement à la hauteur de la tâche.

Configuration de Darcius :

- Carte mère : [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) (200 $)
- CPU : [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) (490 $)
- RAM : [Corsair Vengeance RGB Pro 2x16 Go DDR4 3600 MHz](https://www.newegg.com/p/0RN-00P8-000A5) (390 $)
- SSD : [Samsung 970 EVO Plus 2 To M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) (315 $)
- Boîtier : [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) (52 $)
- PSU : [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) (140 $)
- **Total : 1 587 $**

### La Construction microATX de Yorick

![](./images/Yorick-stock.jpg)

L'enthousiaste matériel vétéran **YorickDowne** a beaucoup d'expérience dans la construction et la maintenance de serveurs.
En utilisant ces connaissances, il a opté pour une configuration microATX flexible.
Sa machine est considérablement plus petite qu'un PC typique, mais parvient toujours à intégrer une technologie de qualité serveur qui maximise la résilience et la disponibilité - des indicateurs clés lors de l'exécution d'un nœud Rocket Pool.
Il a des recommandations à la fois pour les configurations Intel et AMD, que vous pouvez trouver [sur son site Web](https://eth-docker.net/docs/Usage/Hardware).
La version Intel utilise un i3-9100F quad-core (3,6 GHz) ou un CPU Xeon, et la version AMD suggère n'importe quel CPU Ryzen qui prend en charge la mémoire ECC.
Pour les deux configurations, il suggère 16 Go de RAM ECC et un SSD NVMe de 1 To.

Configuration de Yorick :

- Carte mère : [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) (200 $)
- CPU : [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) (150 $)
- RAM : [Samsung 1x16 Go DDR4 ECC UDIMM 2400 MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) (100 $)
- SSD : [Samsung 970 EVO Plus 1 To M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) (165 $)
- Boîtier : [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) (110 $)
- PSU : N'importe lequel (exemple : [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) (161 $)
- Ventilateurs de boîtier : N'importe lesquels
- **Total : Environ 886 $**

Voici les commentaires de Yorick sur les raisons pour lesquelles il a choisi cette configuration :

- _C'est au même prix ou moins cher que certains NUC_
- _Il a de la RAM ECC, ce qui signifie que si la mémoire échoue - ce qui arrive de temps en temps - je le saurai, car le système me le dira. Je n'ai pas à exécuter memtest87 pendant 4 à 5 jours pour déterminer si mon problème d'instabilité est même lié à la mémoire. Je protège mon temps farouchement pour pouvoir le passer à discourir sur Discord au lieu de dépanner le matériel_
- _Il a IPMI, qui est une gestion à distance via Ethernet/navigateur de toute la machine, y compris l'UEFI et le cycle d'alimentation. Je devrais être autorisé à partir en vacances prolongées et avoir toujours un accès à distance complet._
- _Si je veux un stockage redondant pour que la défaillance éventuelle du SSD soit un non-événement, je peux le faire_
- _Il permet une grande flexibilité dans les choix de construction. Je peux choisir la quantité de RAM et de puissance de calcul que je veux ; je peux choisir d'exécuter un NAS avec une technologie de virtualisation comme TrueNAS Scale et d'exécuter le nœud dessus aux côtés d'autres choses de type serveur domestique._

### L'Ordinateur Portable de Drez

![](./images/Drez.jpg)

Parfois, dépenser de l'argent pour du nouveau matériel n'a tout simplement pas de sens.
Dans le cas de l'utilisateur Discord **Drez**, faire fonctionner un nœud Rocket Pool est l'un de ces moments.
Drez avait un ordinateur portable de rechange qui traînait, et ils l'ont transformé en nœud avec facilité.
Leur machine est livrée avec un i7-4710HQ quad-core (2,5 GHz), deux emplacements DDR3 et un emplacement SATA 2,5".
Étant un ordinateur portable, il est également livré avec sa propre batterie (ce qui compense le besoin d'un UPS).
Ils ont ajouté quelques mises à niveau supplémentaires au fil du temps, donnant à l'ordinateur portable encore plus de puissance pour une tranquillité d'esprit supplémentaire.

Configuration de Drez :

- Ordinateur portable : [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) (1 800 $)
- RAM : 2x8 Go DDR3 1333 MHz (Inclus)
- SSD : [Samsung 860 EVO 1 To 2,5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) (110 $)
- **Total : 1 910 $**

Voici les commentaires de Drez sur les raisons pour lesquelles ils ont choisi cette configuration :

_La principale raison pour laquelle je vais staker sur cet ordinateur portable est que j'en avais déjà un de rechange et que je n'ai pas besoin de dépenser de l'argent supplémentaire pour un nouveau serveur.
J'aime sa mobilité, sa compacité, son écran intégré pour une surveillance facile.
En cas de surchauffe, j'ai acheté un pad de refroidissement pour ordinateur portable et un refroidisseur de CPU de rechange au cas où, je recommande également de changer la pâte thermique, surtout si vous allez l'exécuter sur une machine plus ancienne_

## NUC (Next Unit of Computing) et Mini-PC

Faire fonctionner un nœud Rocket Pool ne nécessite pas nécessairement un ordinateur de bureau complet à construire soi-même.
En fait, l'une des configurations les plus populaires parmi les stakers est l'illustre NUC.
Un NUC (Next Unit of Computing) est essentiellement un petit ordinateur autonome conçu pour une consommation d'énergie très faible et une efficacité maximale.
Les NUC sont excellents pour la plupart des stakers qui n'exécutent que quelques validateurs en raison de leur faible maintenance, de leurs faibles coûts de fonctionnement mensuels et de leur facilité de configuration.
Contrairement aux PC, les NUC sont livrés pré-assemblés dans un boîtier ; tout ce que vous avez à faire est d'ajouter de la RAM, d'ajouter un SSD, et vous êtes prêt à fonctionner !
Vous trouverez ci-dessous quelques exemples de configurations NUC que certains vétérans de Rocket Pool utilisent et recommandent.

::: tip NOTE
**Compatibilité de l'Adaptateur Ethernet**

Si vous prévoyez d'acheter un Intel® NUC de 11e ou 12e génération, vous pouvez rencontrer des problèmes de connectivité avec l'adaptateur ethernet, en particulier si l'adaptateur est identifié comme **I225-LM** (Vérifiez les spécifications Intel avant d'acheter).
Si vous en avez déjà un, vous pouvez prendre des mesures pour résoudre ce problème.
L'adaptateur I225-LM a été associé à certains défis de compatibilité qui peuvent entraîner des **blocages du système** et un comportement de noyau inattendu, en particulier lors de l'utilisation de noyaux Linux.

Pour déterminer si votre NUC utilise l'adaptateur ethernet I225-LM problématique, vous pouvez utiliser la commande suivante dans le terminal :

```shell
sudo lshw -class network | grep 225
```

Si la sortie confirme la présence de l'adaptateur I225-LM, vous pourriez rencontrer les problèmes mentionnés. Cependant, il existe des _remèdes_ que vous pouvez appliquer pour atténuer ces problèmes :

**Adaptateur USB-C vers Ethernet** : Une solution viable consiste à acquérir un adaptateur USB-C vers Ethernet et à connecter votre câble Internet via cet adaptateur externe. Bien que cette approche nécessite du matériel et une configuration supplémentaires, elle s'est avérée efficace pour résoudre les conflits de compatibilité. Cela vous permet d'utiliser les derniers noyaux Linux disponibles sans rencontrer les anomalies de blocage ou liées au noyau associées à l'adaptateur I225-LM.**C'est la solution recommandée (pour l'instant) si vous avez déjà un NUC avec l'I225-LM** _Gardez à l'esprit que le choix d'un adaptateur peut introduire un compromis en termes de latence potentielle ou de vélocité Internet réduite. Pour atténuer cet impact, il est conseillé de sélectionner un adaptateur avec au moins 1 Go/s de portabilité, aidant ainsi à maintenir des taux de transfert de données optimaux._

**Mises à jour de pilotes et de logiciels** : Envisagez de mettre à jour vos pilotes, firmware et BIOS en vous référant à la page de support officielle Intel® pour votre modèle de NUC [ici](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). Cela peut inclure l'utilisation du dernier pilote de support disponible sur le site Web d'Intel ou l'application de mises à jour du BIOS qui traitent les problèmes de compatibilité.

**Correctif d'Intel (Windows)** : Intel a publié un correctif pour résoudre un problème similaire sur les systèmes Windows. Bien que le correctif lui-même **ne s'applique pas directement aux environnements Linux**, il met en évidence la reconnaissance du problème par Intel et leurs efforts pour fournir des solutions. Vous pouvez trouver plus de détails sur le correctif dans ce [lien](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3).

Gardez à l'esprit que la technologie évolue et que les solutions peuvent changer avec le temps. Restez toujours à jour avec les dernières ressources fournies par Intel pour votre modèle de NUC spécifique sur leur page officielle de Téléchargements [page](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads]).

En suivant ces étapes, vous pouvez résoudre les défis de compatibilité associés à l'adaptateur ethernet I225-LM sur les produits Intel® NUC de 11e et 12e génération, garantissant une expérience plus fluide et plus fiable avec votre déploiement de serveur. _Bien qu'un sous-ensemble d'utilisateurs de NUC avec cet adaptateur ait signalé n'avoir rencontré aucun problème, il est important de noter que la **majorité des utilisateurs**, en particulier après une mise à niveau du noyau, ont rencontré des problèmes. Notamment, les noyaux 5.15.+ se sont avérés être l'option la plus stable pour ceux qui utilisent l'adaptateur I225-LM. Si l'idée d'utiliser un adaptateur USB-C n'est pas attrayante et que vous êtes prêt à prendre le risque de blocages aléatoires potentiels, il est conseillé de **rester sur une version de noyau qui a démontré une plus grande stabilité**._
:::

### NUC8i5BEK de Ken

![](./images/Ken.jpg)

Le NUC8i5BEK est l'un des propres NUC d'Intel avec un processeur de 8e génération.
Sorti en 2018, ce modèle est livré avec un CPU i5-8259U quad-core (2,30 GHz), deux emplacements DDR4, un emplacement M.2 pour les SSD et des ports USB 3.1.
Il consomme normalement environ 20 watts, mais l'utilisateur Discord **Ken** a pu l'optimiser jusqu'à 9 watts pendant la validation normale.
Il est plus que capable de gérer n'importe quel client Execution et n'importe quel client Consensus, ce qui en fait un excellent choix pour une machine de nœud légère et efficace.

Configuration de Ken :

- Base : [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) (349 $)
- RAM : [Dell Memory Upgrade - 1x16 Go DDR4 SODIMM 3200 MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) (112 $)
- SSD : [ADATA XPG S7 Series 2 To M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) (230 $)
- Boîtier sans ventilateur (facultatif) : [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) (134 $)
- **Total : 691 $ à 825 $**

Voici les commentaires de Ken sur les raisons pour lesquelles il a choisi cette configuration :

- _Petite taille et empreinte, l'alimentation est un bloc sur le cordon d'alimentation (comme un ordinateur portable), ordinateur monocarte, architecture x86, point de prix d'achat bas, faible consommation d'énergie (~10W), garantie de 3 ans et une gamme de produits de fabrication active (Intel)._
- _Les 8e générations sont très rapides et à un prix inférieur aux puces de dernière génération._
- _J'ai amélioré vers un boîtier sans ventilateur (refroidi passivement), donc le NUC est absolument silencieux (0 dB) car je le laisse dans mon bureau à domicile (un NUC de base est déjà presque silencieux)._
- _De plus, aucune usure mécanique sur les roulements du ventilateur._
- _Valeur de revente ou de réaffectation si je décide de retirer cette plateforme matérielle en tant que nœud RP - les NUC font un excellent ordinateur de travail._

### NUC10i7FNH de GreyWizard

![](./images/GreyWizard.jpg)

Le NUC10i7FNH est un autre des propres NUC d'Intel.
Celui-ci arbore un processeur de 10e génération et a été lancé en 2019.
Il est livré avec un CPU i7-10710U à six cœurs (1,10 GHz, booste jusqu'à 4,7 GHz), deux emplacements DDR4, un emplacement M.2 et un emplacement 2,5" pour les SSD, et des ports USB 3.1.
Il consomme environ 20 watts de puissance.
C'est une machine incroyablement puissante, compte tenu de sa consommation d'énergie et de sa taille.
L'utilisateur Discord **GreyWizard** utilise ce NUC pour son nœud - la puissance supplémentaire lui donne la tranquillité d'esprit en sachant que, peu importe ce que l'avenir de la chaîne Ethereum 2.0 réserve, sa machine sera en mesure de le gérer.

Configuration de GreyWizard :

- Base : [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) (445 $)
- RAM : 2x [Samsung M471A4G43MB1 32 Go DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) (154 $ chacun)
- SSD : [Samsung 970 EVO Plus 2 To M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) (315 $)
- **Total : 1 068 $**

Voici les commentaires de GreyWizard sur les raisons pour lesquelles il a choisi cette configuration :

_Je suis allé avec le NUC i7 principalement parce qu'il semblait être la meilleure combinaison de performances exceptionnelles par rapport à la taille globale et à la surcharge.
J'ai également examiné d'autres options comme la construction d'une machine de taille Micro ATX.
Après avoir fixé le prix d'une avec les spécifications que je recherchais, ce NUC Intel a fini par avoir à peu près le même prix, et le facteur de forme est vraiment difficile à battre.
J'aime avoir la marge de manœuvre supplémentaire pour les performances/tranquillité d'esprit, et je reconnais que c'est presque certainement exagéré.
Je considère le staking comme un investissement sérieux et je ne veux pas m'inquiéter si mon matériel sera suffisant._

_Conseils pour d'autres personnes envisageant cela comme une option..._

- _Le NUC fonctionne assez chaud, des températures similaires à celles d'un ordinateur portable. Si vous vous inquiétez de la température du CPU et que vous voulez quelque chose de puissant, vous devriez regarder les configurations de bureau petites comme Micro ATX._
- _Vous voudrez vous assurer qu'il y a beaucoup d'espace autour de votre NUC pour la circulation de l'air. Prévoyez de nettoyer la zone régulièrement pour éviter l'accumulation de poussière._
- _Assurez-vous de vérifier la compatibilité de vos cartes RAM. Les différents NUC prennent en charge différents degrés de RAM totale, de vitesses de RAM, etc._
- _Si vous optez pour le NUC, je suggère de vous donner de la place pour grandir lors de la sélection de la RAM... Par exemple, dépensez un peu plus et obtenez une seule carte RAM de 32 Go plutôt que 2x16 afin de pouvoir vous développer plus tard si vous le souhaitez (en supposant que votre NUC prendra en charge 64 Go dans cet exemple)_
- _N'hésitez pas à me contacter sur Discord si vous souhaitez en discuter._

### Vidéo du Processus de Construction NUC10i5FNHN d'ArtDemocrat

Pour compléter les descriptions de configuration et les conseils de Greywizard, ArtDemocrat a créé cette vidéo du processus de construction comme ressource d'aide supplémentaire pour configurer un NUC10 (dans ce cas un NUC10i5FNHN, mais le processus de construction devrait être similaire pour un NUC10i7FNH) :

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

Configuration d'ArtDemocrat :

- Base : [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) (300 $)
- RAM : 1x [Crucial 32 Go DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) (65 $)
- SSD : [Samsung 970 EVO Plus 2 To M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) (107 $)

### PN50 d'Actioncj17

![](./images/PN50-actioncj17.jpg)

L'ASUS PN50 est un mini-PC, qui partage beaucoup en commun avec la famille NUC d'Intel.
Il a un facteur de forme très petit mais possède tous les composants et fonctionnalités d'un PC complet.
Il est livré avec votre choix de CPU AMD afin que vous puissiez équilibrer entre performance et coût (jusqu'à un Ryzen R7-4700U à 8 cœurs à 2,0 GHz), deux emplacements DDR4, un emplacement M.2 et un emplacement 2,5" pour les SSD, et des ports USB 3.1.
Il est également livré avec une alimentation de 90 watts, bien qu'en pratique il n'ait pas besoin de tant de puissance lorsqu'il agit en tant que nœud Rocket Pool.
L'utilisateur Discord **actioncj17** a essayé plusieurs configurations différentes, mais préfère le PN50 à tout... bien qu'ils admettent volontiers que c'est exagéré pour exécuter un nœud Rocket Pool.

Configuration d'Actioncj17 :

- Base : [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) (583 $)
- RAM : [HyperX Impact 2x16 Go DDR4 SODIMM 3200 MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) (220 $)
- SSD : [Samsung 970 EVO Plus 2 To M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) (315 $)
- **Total : 1 118 $**

Voici les commentaires d'actioncj17 sur les raisons pour lesquelles ils ont choisi cette configuration :

_Ma réponse à pourquoi j'ai choisi l'Asus PN50 est assez simple.
Je voulais voir à quel point le Ryzen 7 4700U d'AMD était impressionnant.
Disons simplement que je ne suis pas déçu.
J'ai en fait commencé avec l'Intel NUC10FNK.
J'ai mis 32 Go de RAM et 1 To de 970 evo plus nvme m.2 dans le NUC et il fonctionne à merveille.
Je n'ai aucune plainte avec le NUC et il fonctionne bien, mais j'obtiens plus de mon PN50.
Je dirais que les deux configurations sont exagérées pour le staking sur Rocketpool, mais un peu d'évolutivité ne fait pas de mal.
Ils ont tous les deux de petites empreintes et le NUC est en fait beaucoup plus silencieux car il est sans ventilateur.
Dans l'ensemble, le PN50 est un meilleur rapport qualité-prix si vous pouvez en obtenir un._

### Mini-PC de Moralcompass

![](./images/moralcompass-minipc.jpg)

L'utilisateur Discord **moralcompass** a emprunté une voie similaire à actioncj17 en sélectionnant un mini-PC, mais sa préférence va à un CPU Intel.
Ils utilisent un mini-PC qui arbore un i5 8250U quad-core (1,6 GHz, boost jusqu'à 3,4 GHz), un emplacement DDR4, un emplacement M.2 et un emplacement 2,5" pour les SSD, et des ports USB 3.0.
Moralcompass affirme qu'il ne tire qu'environ 10 watts du mur, ce qui démontre que les mini-PC comme celui-ci sont très efficaces.
La chose intéressante à propos de ce choix est qu'il est complètement refroidi passivement - pas de ventilateurs à trouver !
Bien qu'il existe de nombreuses variantes de mini-PC sans ventilateur, moralcompass en a trouvé un qui lui convenait et s'y est tenu.

Configuration de Moralcompass :

- Base : [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) (387 $)
- RAM : [Crucial 1x32 Go DDR4 SODIMM 2666 MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) (153 $)
- SSD : [Silicon Power 1 To M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) (115 $)
- **Total : 655 $**

Voici les commentaires de moralcompass sur les raisons pour lesquelles ils ont choisi cette configuration :

- _Pas de pièces mobiles, pas de bruit._
- _Double NIC Intel (au cas où je décide de réaffecter cela comme mon routeur un jour)_
- _Emplacements NVME + SATA (je préfère NVME pour la vitesse et les options avec une endurance TBW plus élevée. SATA donne l'option de HDD ou SSD. J'ai évité les interfaces M.SATA car ces SSD semblent devenir obsolètes)_
- _Ports USB et série disponibles pour le signal d'arrêt gracieux de l'UPS_
