# Тестирование вашей ноды Oracle DAO

После настройки вашей ноды и присоединения к Oracle DAO вам следует протестировать её, чтобы убедиться, что она способна правильно выполнять свои обязанности.
Лучший способ сделать это - построить дерево Merkle для вознаграждений Redstone, используя утилиту Rocket Pool `treegen`.

### treegen

`treegen` - это инструмент, который может воспроизвести полное дерево Merkle вознаграждений и сопутствующие артефакты для предыдущего интервала вознаграждений через ваши архивные клиенты Execution и Consensus.
Он также может выполнить "пробный прогон" текущего интервала, притворяясь, что он закончился на последней финализированной эпохе (на момент запуска), и создав частичное дерево от начала интервала до этого момента.

::: tip СОВЕТ
Для получения дополнительной информации о самом дереве вознаграждений и сопутствующих файлах посетите [**формальную спецификацию**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` можно использовать как отдельный бинарный файл (в настоящее время собран только для систем Linux, x64 и arm64) или как Docker-контейнер.

Если вы хотите загрузить отдельный бинарный файл, вы можете найти его в релизах здесь: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
Инструкции по использованию включены в README там, но мы также рассмотрим некоторые примеры ниже.

Тег Docker-контейнера для него: `rocketpool/treegen:latest`.

## Построение пробного дерева

Для первого теста запустите `treegen` для генерации пробного дерева, которое вычисляет дерево от начала интервала вознаграждений до последнего (финализированного) слота.
Мы будем использовать [скрипт](https://github.com/rocket-pool/treegen/blob/main/treegen.sh), включённый в репозиторий, который использует Docker-контейнер для запуска на самой машине ноды для простоты:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning ПРИМЕЧАНИЕ
Обратите внимание, что эта конкретная конфигурация требует, чтобы вы открыли API Execution Client и Beacon Node через конфигурацию Docker - убедитесь, что у вас включены обе опции в TUI `rocketpool service config`.
:::

Это проверит способность ваших клиентов своевременно отвечать на запросы (например, если вы используете сторонний сервис, это будет полезно для оценки того, недостаточен ли его лимит скорости запросов), но **не будет проверять их возможности режима архива**.
Он выдаст вывод, подобный следующему:

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

Если это выполнится без ошибок, он сгенерирует артефакты дерева вознаграждений и сохранит их как JSON-файлы в вашем рабочем каталоге.
Вы можете изучить их и убедиться, что их содержимое разумно, но поскольку это пробные файлы, они нигде не хранятся канонически для сравнения.

## Построение канонического дерева из прошлого интервала

Следующий тест - воспроизвести одно из полных деревьев из прошлого интервала.
Это потребует архивного доступа как на уровне Execution, так и на уровне Consensus, поэтому это послужит хорошим тестом обеих возможностей.

На момент написания **Интервал 2** является идеальным выбором, так как он находится далеко в прошлом и включал Smoothing Pool (который составляет наибольшую вычислительную нагрузку при расчёте вознаграждений за период).

Запустите `treegen` используя следующую команду:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

Обратите внимание, что **URL Execution Client** здесь другой: он _должен быть_ архивным EC, так как блок снимка для Интервала 2 был далеко в прошлом.

::: warning ПРИМЕЧАНИЕ
В зависимости от конфигурации вашего клиента построение этого дерева может занять _часы_.
Smartnode будет предоставлять вам индикаторы состояния о своём прогрессе по ходу дела, как вы можете видеть в примере ниже.
:::

Вывод будет выглядеть так (сокращённо для краткости):

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

Ключевой момент, на который следует обратить внимание здесь, - это сообщение в конце:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Если вы получили это, то ваша сторожевая башня может правильно построить дерево.

::: danger ПРИМЕЧАНИЕ
Хотя это доказывает, что вы можете построить дерево, вы _должны_ убедиться, что ваш токен API Web3.Storage был введён в конфигурацию Smartnode, чтобы он мог загрузить результирующее дерево в IPFS.
:::

### Следующие шаги

Далее мы расскажем, как отслеживать производительность вашей ноды.
