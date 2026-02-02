# Oracle DAO Node'unuzu Test Etme

Node'unuz kurulduktan ve Oracle DAO'ya katıldıktan sonra, görevlerini düzgün bir şekilde yerine getirebilmesini sağlamak için test etmelisiniz.
Bunu yapmanın en iyi yolu, Rocket Pool'un `treegen` yardımcı programını kullanarak Redstone ödülleri Merkle ağacını oluşturmaktır.

### treegen

`treegen`, önceki bir ödül aralığı için tam ödüller Merkle ağacını ve beraberindeki eserleri arşiv Execution ve Consensus istemcileriniz aracılığıyla yeniden oluşturabilen bir araçtır.
Ayrıca, mevcut aralığın (çalıştırma anında) en son sonlandırılmış epoch'ta sona ermiş gibi davranarak ve aralığın başlangıcından o noktaya kadar kısmi bir ağaç üreterek "kuru çalıştırma" yapabilir.

::: tip İPUCU
Ödül ağacının kendisi ve beraberindeki dosyalar hakkında daha fazla bilgi için lütfen [**resmi spesifikasyonu**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec) ziyaret edin.
:::

`treegen`, bağımsız bir binary olarak (şu anda yalnızca Linux sistemleri, x64 ve arm64 için derlenmiştir) veya bir Docker container'ı olarak kullanılabilir.

Bağımsız binary'yi indirmek isterseniz, buradaki sürümlerde bulabilirsiniz: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Kullanım talimatları oradaki README'de yer almaktadır, ancak aşağıda bazı örnekleri de ele alacağız.

Docker container tag'i `rocketpool/treegen:latest` şeklindedir.

## Kuru Çalıştırma Ağacı Oluşturma

İlk test için, ödül aralığının başlangıcından en son (sonlandırılmış) slot'a kadar ağacı hesaplayan kuru çalıştırma ağacı oluşturmak üzere `treegen` çalıştırın.
Basitlik için, Docker container'ını kullanarak node makinesinin kendisinde çalıştıran repository'deki [script'i](https://github.com/rocket-pool/treegen/blob/main/treegen.sh) kullanacağız:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning NOT
Bu özel yapılandırmanın, Docker yapılandırması üzerinden Execution Client ve Beacon Node API'lerini açığa çıkarmanızı gerektirdiğini unutmayın - `rocketpool service config` TUI'de her iki seçeneğin de etkin olduğundan emin olun.
:::

Bu, istemcilerinizin sorgulara zamanında yanıt verme yeteneklerini test edecektir (örneğin, üçüncü taraf bir hizmet kullanıyorsanız, bu, sorgu hız sınırının yetersiz olup olmadığını değerlendirmek için yararlı olacaktır), ancak **Arşiv Modu yeteneklerini test etmeyecektir**.
Aşağıdaki gibi bir çıktı üretecektir:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

Bu hatasız çalışırsa, ödül ağacı eserlerini oluşturacak ve bunları çalışma dizininizde JSON dosyaları olarak kaydedecektir.
İçeriklerini keşfetmekte ve mantıklı olduklarından emin olmakta özgürsünüz, ancak bunlar kuru çalıştırma dosyaları olduğundan, karşılaştırma için herhangi bir yerde kanonik olarak saklanmazlar.

## Geçmiş Bir Aralıktan Kanonik Ağaç Oluşturma

Bu sonraki test, geçmiş bir aralıktan tam ağaçlardan birini çoğaltmaktır.
Bu, hem Execution Layer hem de Consensus Layer üzerinde arşiv erişimi gerektirecektir, bu nedenle her iki yeteneğin de iyi bir testi olarak hizmet edecektir.

Bu yazının yazıldığı tarih itibarıyla, **Interval 2** ideal bir seçimdir çünkü geçmişte çok uzaktadır ve Smoothing Pool'u içeriyordu (bu, dönem için ödülleri hesaplarken en büyük hesaplama yükünü oluşturur).

Aşağıdaki komutu kullanarak `treegen` çalıştırın:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

Burada **Execution Client URL**'sinin farklı olduğuna dikkat edin: Interval 2 için snapshot bloğu geçmişte çok uzakta olduğundan, bir Arşiv EC _olmalıdır_.

::: warning NOT
İstemci yapılandırmanıza bağlı olarak, bu ağacı oluşturmak _saatler_ sürebilir.
Smartnode, aşağıdaki örnekte görebileceğiniz gibi, yol boyunca ilerleme hakkında durum göstergeleri verecektir.
:::

Çıktı şöyle görünecektir (kısalık için kesilmiştir):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

Burada dikkat edilmesi gereken önemli şey, sondaki bu mesajdır:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Bunu alırsanız, watchtower'ınız ağacı doğru şekilde oluşturabilir demektir.

::: danger NOT
Bu, ağacı oluşturabileceğinizi kanıtlarken, sonuç ağacını IPFS'ye yükleyebilmesi için Web3.Storage API token'ınızın Smartnode yapılandırmasına girilmiş olduğundan emin olmalısınız.
:::

### Sonraki Adımlar

Sonra, node'unuzun performansını nasıl izleyeceğinizi ele alacağız.
