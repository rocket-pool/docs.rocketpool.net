# Sélectionner un fournisseur d'hébergement

Si vous êtes arrivé à cette section, c'est que vous souhaitez exécuter un nœud Rocket Pool mais que vous ne pouvez pas en configurer un localement chez vous ; vous avez besoin d'un **serveur privé virtuel (VPS)** hébergé sur le cloud.
Plusieurs services différents peuvent fournir une telle machine, et ils se déclinent en deux types : les fournisseurs VPS et les fournisseurs de cloud public.

Choisir le bon peut être difficile, et comprendre les différences entre eux est essentiel.
Dans ce guide, nous allons éclaircir cette distinction et répertorier quelques-uns des services que d'autres utilisateurs de Rocket Pool ont utilisés par le passé pour vous aider à naviguer parmi vos options.

## Hébergement VPS traditionnel

Un serveur privé virtuel est une instance unique d'une machine virtuelle qui réside sur une machine physique plus grande.
Ce sont les options les moins chères, et elles sont moins fréquemment utilisées que les plateformes cloud omniprésentes, ce qui contribue davantage à la décentralisation du réseau Ethereum.

Cependant, elles offrent rarement une haute disponibilité ; si le serveur physique tombe en panne, il est probable que votre VPS hébergé dessus tombe également en panne.
De plus, elles ont une empreinte de ressources fixe ; il n'est généralement pas possible d'augmenter ou de diminuer les ressources comme le CPU et la RAM à la demande.

En octobre 2024, une option bien tarifée et performante était le RS 12000 G11 de [Netcup](https://www.netcup.eu/vserver/vps.php).
Attention cependant : le stockage est partagé avec d'autres, les IOPS de stockage peuvent donc constituer un goulot d'étranglement potentiel.

## Hébergement de serveur dédié

Contrairement à un VPS, un serveur dédié est un appareil physique entier que vous louez. C'est une option relativement abordable, et ces serveurs sont moins fréquemment utilisés que les plateformes cloud omniprésentes, ce qui contribue davantage à la décentralisation du réseau Ethereum.

En octobre 2024, deux options bien tarifées et performantes étaient les serveurs bare-metal Rise et Advanced de [OVH](https://us.ovhcloud.com/). Il existe une variété de ces serveurs qui changent au fil du temps, ainsi que des soldes importantes. Vous devrez vérifier que les [directives matérielles](../local/hardware.md) sont respectées.

## Hébergement cloud

L'hébergement cloud fait référence à des machines virtuelles réparties sur un réseau distribué de plusieurs serveurs, plutôt que d'être hébergées sur une seule machine physique.
Si l'une des machines d'hébergement échoue, les autres peuvent prendre le relais de manière transparente, de sorte que la disponibilité et la fiabilité ont tendance à être extrêmement élevées sur ces plateformes.
Elles ont également tendance à offrir des options de ressources flexibles ; il est relativement simple d'ajouter plus de CPU, de RAM ou d'espace disque à la demande.

En raison de ces avantages supplémentaires, les serveurs basés sur le cloud ont tendance à être plus coûteux que les solutions VPS.
Ce sont également des plateformes très populaires, donc leur utilisation réduit généralement la décentralisation globale du réseau Ethereum.

Les 3 principaux fournisseurs de cloud sont [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/fr-fr/) et [Google Cloud Platform (GCP)](https://cloud.google.com/).
Nous ne recommandons pas l'utilisation de l'hébergement cloud en raison de préoccupations liées au prix et à la centralisation.

## Considérations clés

### Prix

Les solutions d'hébergement cloud sont généralement un choix plus sûr si le coût n'est pas une priorité.
La section ci-dessous présente une répartition plus détaillée des estimations de coûts, mais voici une comparaison générale entre une option VPS et une option cloud :

- Serveur dédié OVH : 90-160 $/mois
- VPS Netcup : 90 $/mois
