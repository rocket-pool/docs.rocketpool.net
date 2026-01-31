# Migration d'un nœud vers un autre

Parfois, votre machine de nœud n'est plus en mesure de remplir sa fonction et vous devez migrer vers une autre.
Cela peut se produire si vous mettez à niveau votre nœud par exemple, ou si vous passez d'un nœud dans le cloud à un nœud hébergé localement sur du matériel dédié, ou même si votre nœud lui-même subit une panne matérielle catastrophique et que vous devez exécuter vos validateurs sur une machine de secours.
Quel que soit le cas, ce guide vous aidera à comprendre comment migrer en toute sécurité votre portefeuille et vos clés de validateur d'un nœud à un autre sans être slashé.

## Le slashing et la base de données de slashing

La raison principale pour laquelle nous vous encourageons à faire preuve de tant de prudence lorsque vous déplacez votre portefeuille d'une machine à une autre, ou que vous récupérez votre portefeuille sur une autre machine, est le risque de **slashing**.
Le slashing se produit lorsqu'une ou plusieurs de vos clés de validateur font quelque chose qui viole les règles de la Beacon Chain et semble indiquer que vous tentez d'attaquer le réseau.
En réponse, la chaîne forcera la sortie de votre validateur et infligera une pénalité sévère - la taille de la pénalité dépend du nombre de validateurs également slashés dans une période de deux semaines autour du vôtre, mais actuellement le minimum est de **1 ETH** et il n'y a pas de maximum.

Bien qu'il existe plusieurs conditions qui peuvent être interprétées comme "attaquer le réseau", en réalité, la seule qui se produit accidentellement est la **double attestation** (ou **double proposition**).
Cela se produit lorsque votre validateur soumet deux attestations (ou deux propositions de bloc) pour le même slot qui ont des votes différents (par exemple, il vote pour deux blocs candidats différents pour un slot particulier au lieu d'en choisir un).

Pour lutter contre cela, votre client de validateur héberge ce qu'on appelle une **base de données de slashing**.
La base de données de slashing est simplement un enregistrement des votes de votre validateur (c'est-à-dire le slot de chaque vote et le hash du bloc pour lequel ce vote a été émis), afin qu'il sache ne pas voter pour quelque chose pour lequel il a déjà voté.

### Éviter d'être slashé

Chaque client de validateur maintient une base de données de slashing pour garantir que votre nœud n'effectue jamais de double attestation ou de double proposition.
Le problème, alors, vient des situations où vous commencez à valider **sans** base de données de slashing et n'avez donc aucun enregistrement de ce pour quoi vos validateurs ont précédemment voté.
Cela peut se produire dans plusieurs situations :

1. Vous venez de changer de client de consensus, et le nouveau client ne transfère pas la base de données de slashing de l'ancien (ce que le Smartnode ne fait pas lors d'un changement de client).
2. Vous avez votre portefeuille chargé sur une machine et attestez activement avec lui, puis vous chargez votre portefeuille sur une deuxième machine _pendant que la première machine atteste toujours activement_.
3. Vous arrêtez de valider sur une machine et chargez votre portefeuille sur une deuxième machine, mais vous n'avez pas attendu assez longtemps pour que l'epoch actuel soit finalisé, donc votre deuxième machine atteste pour des slots pour lesquels vos validateurs ont déjà attesté.

La méthode standard pour éviter d'être slashé est d'**attendre au moins 15 minutes après votre dernière attestation réussie** avant de démarrer votre client de validateur et d'attester à nouveau, et **vous assurer que vos clés de validateur ne sont présentes que sur une seule machine**.

Plus précisément, le plan consiste à attendre que votre validateur ait intentionnellement manqué une attestation, **et que ce manquement ait été finalisé**.
Une fois la finalité atteinte, votre validateur ne peut plus voter pour l'epoch finalisé et il est sûr de recommencer à attester avec lui.

L'attente de 15 minutes vient d'une règle empirique selon laquelle, lorsqu'elle fonctionne normalement (c'est-à-dire avec un consensus normal), la Beacon Chain met environ 7 minutes à finaliser un epoch.
Attendre 15 minutes garantit que vous avez manqué au moins un epoch et attendu suffisamment longtemps pour que cet epoch soit finalisé, avec une petite marge de sécurité.

## Liste de vérification pour la migration de nœud

Avec le contexte ci-dessus à l'esprit, voici une liste de vérification utile que vous pouvez suivre lors de la migration de votre nœud pour vous assurer de ne pas être slashé.
Elle est conçue pour une sécurité maximale, donc même si vous pensez que certaines étapes sont inutiles, nous vous **encourageons fortement** à toutes les suivre jusqu'à la fin.

1. **Préparez le nouveau nœud** en suivant ces guides, en commençant par la section "Préparer un nœud" et en terminant une fois que vous avez installé le Smartnode et que vous synchronisez un client d'exécution et de consensus.
   - :warning: **NE PAS** initialiser un nouveau portefeuille ou récupérer votre ancien portefeuille sur le nœud. Laissez-le synchroniser les clients _sans portefeuille présent_.

2. **ATTENDEZ** jusqu'à ce que vos clients soient entièrement synchronisés sur le nouveau nœud.
3. Confirmez que vous avez correctement enregistré votre mnémonique en exécutant `rocketpool wallet test-recovery` sur votre nouvelle machine. Cela va _simuler_ la récupération des clés pour confirmer que le portefeuille de votre nœud et toutes les clés de validateur de vos minipools peuvent être récupérés correctement, mais ne les _récupérera pas réellement_ et ne les enregistrera pas sur le disque, il n'y a donc aucun risque de slashing.
   1. Si le Smartnode ne parvient pas à récupérer le portefeuille de votre nœud en utilisant le mnémonique que vous avez fourni, alors votre mnémonique peut être invalide. **ARRÊTEZ** de suivre ce processus ; retirer les clés de votre ancien nœud signifie qu'elles pourraient être **perdues pour toujours**.
   2. Dans cette situation, nous vous recommandons de faire sortir vos validateurs et de retirer votre capital dès que possible, afin que vous puissiez recommencer avec un nouveau nœud pour lequel vous avez le mnémonique fonctionnel.
4. **Arrêtez de valider** sur votre ancien nœud (par exemple, en utilisant `rocketpool service stop` pour arrêter le client de validateur).
5. **Supprimez vos clés** de votre ancien nœud (par exemple, en utilisant `rocketpool wallet purge`).
   1. **VÉRIFIEZ** que les clés ont été supprimées en regardant si le dossier `data` de votre nœud (par défaut `~/.rocketpool/data/validators/`) - chaque client de consensus aura son propre dossier sous ce dossier de données avec sa propre copie des clés.
   2. Veuillez consulter la section [Vérification de la suppression des clés](#vérification-de-la-suppression-des-clés) ci-dessous pour obtenir des instructions sur la façon de procéder.
   3. Assurez-vous que **toutes** ont été supprimées.

6. **Éteignez** votre ancien nœud et déconnectez-le d'Internet, en retirant le câble Ethernet ou le module Wi-Fi.

7. **Effacez le SSD** de votre ancien nœud, en utilisant l'une des méthodes suivantes :
   1. Utilisez une clé USB amorçable avec une installation Linux (comme le populaire [GParted](https://gparted.org/download.php)) et utilisez-la pour effacer le disque.
   2. **Retirez-le physiquement** de votre ancien nœud, attachez-le à une autre machine à l'aide d'un convertisseur USB, et utilisez un outil tel que [GParted](https://installati.one/debian/11/gparted/) pour effacer le disque.
   3. **Retirez-le physiquement** de votre ancien nœud et frappez-le avec un marteau pour le casser et vous assurer qu'il ne sera plus jamais utilisé.

8. **ATTENDEZ** au moins 15 minutes avant de continuer. Utilisez un explorateur de blocs comme [https://beaconcha.in](https://beaconcha.in) pour consulter l'enregistrement des attestations de votre validateur. Attendez qu'au moins une attestation ait été enregistrée comme manquante _et que l'epoch correspondant ait été finalisé_.
   1. REMARQUE : si vous avez plusieurs minipools, vous devez vous assurer que _tous_ ont manqué au moins une attestation qui a été finalisée.

9. **Récupérez le portefeuille de votre nœud** sur la nouvelle machine en suivant les instructions dans [Importer / Récupérer un portefeuille existant](../recovering-rp.mdx).

10. **Redémarrez votre client de validateur** pour vous assurer que vos clés de validateur sont chargées (par exemple, avec `docker restart rocketpool_validator`).

Vos clés de validateur seront maintenant chargées sur votre nouveau nœud, et vous pourrez commencer à attester en toute sécurité avec lui.

## Vérification de la suppression des clés

Les clés de validateur sont stockées sur votre disque sous forme de fichiers `json`.
Elles sont conservées dans le dossier `data` de votre nœud.
Par défaut, vous pouvez les trouver ici :

```shell
~/.rocketpool/data/validators/
```

::: warning REMARQUE
Si vous avez modifié votre répertoire `data` à l'aide du TUI `service config` (par exemple, vous utilisez une clé Aegis et l'avez définie comme votre dossier `data`, le chemin ci-dessus doit être modifié en `<votre dossier de données>/validators`.)
:::

Chaque client aura sa propre copie des clés, car chaque client les attend dans un format ou une configuration différent.

Pour **trouver** les clés sur le disque, exécutez la commande suivante :

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Par exemple, sur une machine avec deux minipools, la sortie ressemblerait à ceci :

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

Cela montre un exemple où les clés n'ont **pas** encore été supprimées et sont toujours sur le système de fichiers.

Si vos clés **ont** été supprimées, vous ne devriez voir _aucune_ des chaînes hexadécimales (les grandes chaînes commençant par `0x`) dans aucun des dossiers pour aucun des clients dans la sortie de cette commande.
