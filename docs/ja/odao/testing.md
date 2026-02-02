# Oracle DAO Nodeのテスト

ノードのセットアップが完了しOracle DAOに参加したら、ノードが適切に役割を果たせることを確認するためにテストする必要があります。
最適な方法は、Rocket Poolの`treegen`ユーティリティを使用してRedstone報酬Merkleツリーを構築することです。

### treegen

`treegen`は、アーカイブExecution ClientとConsensus Clientを介して、以前の報酬インターバルの完全な報酬Merkleツリーと関連するアーティファクトを再現できるツールです。
また、最新のファイナライズされたエポック(実行時点)でインターバルが終了したと仮定し、インターバルの開始からその時点までの部分ツリーを生成することで、現在のインターバルを「ドライラン」することもできます。

::: tip ヒント
報酬ツリー自体と関連ファイルの詳細については、[**正式な仕様**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec)をご覧ください。
:::

`treegen`は、スタンドアロンバイナリ(現在はLinuxシステム、x64およびarm64用のみビルド)として、またはDockerコンテナとして使用できます。

スタンドアロンバイナリをダウンロードしたい場合は、こちらのリリースで見つけることができます:[https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen)。
使用方法はそこのREADMEに含まれていますが、以下でもいくつかの例を紹介します。

Dockerコンテナのタグは`rocketpool/treegen:latest`です。

## ドライランツリーの構築

最初のテストとして、`treegen`を実行して、報酬インターバルの開始から最新の(ファイナライズされた)スロットまでのツリーを計算するドライランツリーを生成します。
簡単にするために、ノードマシン自体でDockerコンテナを活用してそれを実行するリポジトリに含まれる[スクリプト](https://github.com/rocket-pool/treegen/blob/main/treegen.sh)を使用します:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning 注意
この特定の設定では、Docker設定を介してExecution ClientとBeacon Node APIを公開する必要があります。`rocketpool service config` TUIで両方のオプションが有効になっていることを確認してください。
:::

これにより、クライアントがタイムリーにクエリに応答する能力がテストされます(例えば、サードパーティのサービスを使用している場合、クエリレート制限が不十分かどうかを評価するのに役立ちます)が、**Archive Mode機能はテストされません**。
次のような出力が生成されます:

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

これがエラーなく実行されると、報酬ツリーのアーティファクトが生成され、作業ディレクトリにJSONファイルとして保存されます。
自由に探索して、内容が正常であることを確認できますが、ドライランファイルであるため、比較のために正式に保存される場所はどこにもありません。

## 過去のインターバルから正規ツリーの構築

次のテストは、過去のインターバルから完全なツリーの1つを複製することです。
これには、Execution LayerとConsensus Layerの両方でアーカイブアクセスが必要なため、両方の機能の良好なテストになります。

この記事の執筆時点では、**インターバル2**が理想的な選択です。これははるか過去のものであり、Smoothing Poolを含んでいたため(期間の報酬を計算する際の最大の計算負荷を占めます)。

次のコマンドを使用して`treegen`を実行します:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

ここで**Execution Client URL**が異なることに注意してください:インターバル2のスナップショットブロックははるか過去にあったため、_Archive ECでなければなりません_。

::: warning 注意
クライアント設定によっては、このツリーの構築に_数時間_かかる場合があります。
Smartnodeは、以下の例に示すように、進行状況に関するステータスインジケータを提供します。
:::

出力は次のようになります(簡潔にするために切り捨てられています):

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

ここで確認すべき重要な点は、最後に表示されるこのメッセージです:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

これを受け取った場合、watchtowerはツリーを正しく構築できます。

::: danger 注意
これによりツリーを構築できることが証明されますが、結果のツリーをIPFSにアップロードできるように、Web3.Storage APIトークンがSmartnodeの設定に入力されていることを_確認する必要があります_。
:::

### 次のステップ

次は、ノードのパフォーマンスを監視する方法について説明します。
