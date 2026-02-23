# Fee DistributorとSmoothing Pool

ノードオペレーターはEthereumチェーンに提案するブロックに含めるトランザクションから**priority fees**（**チップ**）を受け取ります。
これらの手数料はExecutionレイヤーから来て、Executionレイヤーに留まります。

Consensusレイヤーで生成され、定期的に自動的に引き出されるほとんどの検証報酬とは異なり、これらの手数料は*即座に流動的*です。
一般的に、priority feesはBeacon Chain報酬とほぼ同じ量のETHを提供するため、Mergeの非常に良い利点です。

::: tip 注記
簡単に復習すると、さまざまな種類の報酬とそれらが提供されるレイヤーの内訳は次のとおりです。

- Consensusレイヤー: attestations、block proposals、sync committees、slashing reports
- Executionレイヤー: block proposalsからのpriority feesとMEV（次のセクションで説明）

:::

## Fee Recipients

Ethereumチェーンでブロックを提案するとき、プロトコルはブロックに含まれる各トランザクションのチップをどこに送信するかを知る必要があります。
validatorのアドレスには送信できません。それはConsensusレイヤーにあり、Executionレイヤーにはないからです。
minipoolアドレスにも送信できません。ソロステーカーにも機能する必要があり、ソロステーカーはRocket Poolのようにvalidatorに接続されたExecutionレイヤーのアドレスを持っていないからです。

代わりに、その仕組みはかなり単純です。Rocket PoolがValidator Clientを起動すると、**fee recipient**と呼ばれる引数を渡します。
fee recipientは単に、チップを送信したいExecutionレイヤーのアドレスです。

ノードの`fee recipient`は次のいずれかの特別なコントラクトに設定できます:

- ノード独自の個人的な**Fee Distributor**
- ノードのmegapoolコントラクト
- **Smoothing Pool**（オプトイン）

Smart Nodeは、設定に基づいて正しいfee recipientを自動的に設定します:

| Smoothing Poolの状態 | Megapool Validatorの有無 | Minipoolの有無 | Fee Recipient                                                                                                                                                                                                      |
| -------------------- | ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| オプトイン           | なし                     | あり           | Smoothing Poolアドレス                                                                                                                                                                                             |
| オプトイン           | あり                     | なし           | Smoothing Poolアドレス                                                                                                                                                                                             |
| オプトイン           | あり                     | あり           | Smoothing Poolアドレス（全validator）                                                                                                                                                                              |
| オプトアウト         | なし                     | あり           | Fee Distributorコントラクトアドレス                                                                                                                                                                                |
| オプトアウト         | あり                     | なし           | Megapoolコントラクトアドレス                                                                                                                                                                                       |
| オプトアウト         | あり                     | あり           | Megapool validators → Megapoolアドレス<br>Minipool validators → Fee Distributorアドレス<br>（[keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient)でvalidatorごとに設定） |

Rocket Poolは、Beacon chain報酬を公平に分配するのと同じ方法で、これらの報酬をあなたとrETHプールステーカーの間で公平に分配するように設計されています。minipoolのvalidatorが獲得したpriority feesのあなたの部分はあなたに行き（すべてのminipoolの平均手数料を加えたもの）、残りの部分はプールステーカーに行きます（あなたの平均手数料を差し引いたもの）。
正確な部分は、8 ETHボンドと16 ETHボンドのminipool、および4 ETHボンドのmegapool validatorの数によって異なります。

簡単に言うと、**Fee Distributor**はノードに接続されたユニークなコントラクトで、priority feesを収集してあなたとrETHステーカーの間で公平に分割します。
これはpriority fees用の個人的な金庫のようなものです。
誰でも（あなたを含む）いつでもその残高を分配して、報酬が常にrETHステーカーに利用可能であることを保証できます。

**Smoothing Pool**は、参加しているすべてのノードオペレーターがpriority feesを集約してプールし、各Rocket Pool報酬インターバル（現在28日ごと）中に参加者とrETHプールステーカーの間で均等に分配する特別なオプトインコントラクトです。
これは、高いpriority feesを持つblock proposalsを取得することに関連する運の要素を心配したくなく、むしろ良い、規則的で一貫した月次収益を得たいノードオペレーターにとって非常に魅力的な機能です。

以下では、違いとSmoothing Poolに参加するかどうかを理解できるように、両方について説明します。

::: tip 注記
2024-10-28以降に作成されたminipoolについては、Smoothing poolが強く推奨されます。ボーナス手数料の分配に使用されるためです。Smoothing poolをオプトアウトすると、これらのminipoolは合計5%の手数料を取得します。Smoothing poolにオプトインすると、これらのminipoolは10%（RPLステーキングなし）から14%（RPLステークが借りたETHの10%以上の価値がある）の手数料を取得します。
:::

## あなたのFee Distributor

Fee DistributorはExecutionレイヤーのユニークなコントラクトで、**ノードに固有**です。
時間の経過とともに獲得したすべてのpriority feesを保持し、rETHプールステーカーとwithdrawal addressに公平に分割して分配するために必要なロジックが含まれています。
この分配プロセスは**誰でも呼び出すことができ**（rETHステーカーを含む）、**いつでも**実行できます。
報酬が期限切れになる前の時間制限はありません。

ノードのFee Distributorのアドレスは、**ノードアドレスに基づいて決定論的**です。
つまり、Fee Distributorが作成される前から、事前に知られています。

新しいRocket Poolノードは、登録時にノードのFee Distributorコントラクトを自動的に作成（初期化）します。
これは一度だけ実行する必要があります。

これの興味深い結果の1つは、Distributorのアドレスが、Fee Distributorコントラクトを初期化する**前に**残高を蓄積し始める可能性があることです。
これは問題ありません。Distributorを初期化するとすぐに、この既存の残高すべてにアクセスできるようになるためです。

### アドレスと残高の表示

fee distributorのアドレスと残高は次の一部として表示できます。

```shell
rocketpool node status
```

出力は次のようになります。

![](../node-staking/images/status-fee-distributor.png)

### Fee Distributorからの手数料請求

次のコマンドを使用して、fee distributorの残高全体を請求して分配できます:

```shell
rocketpool node distribute-fees
```

これにより、報酬のあなたの取り分が**withdrawal address**に送信されます。

::: warning 課税イベントに関する注記
新しいminipoolを作成するたびに、Rocket Poolは自動的に`distribute-fees`を呼び出します。
これは、蓄積された手数料が、新しいminipoolを作成すると変わる可能性のあるノードの平均手数料を使用して分配されることを保証するためです。これはmegapool validatorの作成には適用されません。

また、誰でもfee distributorで`distribute-fees`を呼び出すことができます（rETH報酬を人質にすることを防ぐため）。
このメソッドが呼び出されるたびに課税イベントが発生する可能性があります。

Smoothing Pool（以下で説明）を使用するかどうかを決定する際は、これらの条件を念頭に置いてください。
:::

### ペナルティシステム

ノードオペレーターがValidator Clientで使用されるfee recipientを手動で変更して「不正」を行わないようにするため、Rocket Poolはペナルティシステムを採用しています。

Oracle DAOは、プロトコルルールに従わないノードオペレーターにペナルティを科すことができます。

ノードがSmoothing Poolから*オプトアウト*している場合、次のアドレスが有効なfee recipientsと見なされます。

- rETHアドレス
- Smoothing Poolアドレス
- ノードのfee distributorコントラクト
- ノードのmegapoolコントラクト

ノードがSmoothing Poolに*オプトイン*している場合、次のアドレスが有効なfee recipientと見なされます。

- Smoothing Poolアドレス

上記の有効なアドレス以外のfee recipientは**無効**と見なされます。

Smart Nodeソフトウェアは、設定に基づいて正しいfee recipientを自動的に設定します（Smoothing Poolにオプトインしているかどうか、megapool validatorがあるか、minipoolがあるか、またはその両方）。オプトアウト状態でmegapool validatorとminipoolの両方を持つノードの場合、keymanager APIを使用してvalidatorごとにfee recipientが設定されます。条件の完全なリストは[こちら](/ja/node-staking/fee-distrib-sp#fee-recipients)にまとめられています。

Smartnodeソフトウェアは、正直なユーザーがペナルティを受けないように設計されており、そのためにValidator Clientをオフラインにする必要がある場合でもそうします。
これが発生すると、attestationを停止し、Smartnodeがfee recipientを正しく設定できない理由についてのエラーメッセージがログファイルに表示されます。

## Smoothing Pool

**Smoothing Pool**は、Rocket Poolネットワークのユニークなオプトイン機能で、ノードオペレーターが利用できます。
基本的には、オプトインしたすべてのノードオペレーターのfee recipientになり、それらのノードオペレーターによって提案されたブロックからのpriority feesを1つの大きなプールに集約します。Rocket Pool報酬チェックポイント（RPL報酬の配布に使用されるものと同じ）中に、プールの総ETH残高はプールステーカーとオプトインしたノードオペレーターに公平に分配されます。

本質的に、Smoothing Poolはblock proposalsに選ばれることに関連するランダム性を効果的に排除する方法です。
運が悪くて数ヶ月もproposalがなかった場合、またはblock proposalsに低いpriority feesしかない場合、Smoothing Poolは非常にエキサイティングに感じるかもしれません。

数学を理解しやすくするため、コミュニティメンバーのKen Smithは、Smoothing PoolとFee Distributorの収益性を比較する[大規模な分析](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf)をまとめています。これは次のチャートで適切に要約されています。

![](../node-staking/images/sp-chart.png)

要するに、Smoothing Poolにあなたよりも多くのminipoolがある限り、参加することで利益を得る可能性が高くなります。

### ルール

Smoothing Poolは次のルールを使用します。

- Smoothing Poolの残高がノードオペレーター（手数料を考慮）、RPLステーキングノードオペレーター、rETHステーカー、および場合によってはRocket Pool DAOの間で分配されるRocket Pool報酬チェックポイント中。正確なパーセンテージはRocket Pool [Protocol DAO (pDAO)ガバナンス](/ja/pdao/overview)によって決定されます。

- Smoothing Poolへのオプトインは**ノードレベル**で行われます。オプトインすると、すべてのminipoolとmegapool validatorがオプトインされます。

- 誰でもいつでもオプトインできます。システムを悪用するのを防ぐため（例：ブロック提案に選ばれた直後にSPを離れる）、オプトアウトする前に完全な報酬インターバル（Hoodiで3日、Mainnetで28日）待つ必要があります。
  - オプトアウトしたら、再度オプトインするには別の完全なインターバルを待つ必要があります。

- Smoothing Poolは、オプトインした各ノードが所有する各validator（インターバル中のプールのETHの部分）の「シェア」を計算します。
  - シェアは、インターバル中のvalidatorのパフォーマンス（Beacon Chainで送信したattestationsの数と見逃した数を調べて計算）と手数料率の関数です。

- ノードの総シェアは、validatorシェアの合計です。

- ノードの総シェアは、オプトインしていた時間の量によってスケーリングされます。
  - 完全なインターバル中オプトインしていた場合、完全なシェアを受け取ります。
  - インターバルの30%の間オプトインしていた場合、完全なシェアの30%を受け取ります。

Smoothing Pool報酬計算の完全な技術詳細に興味がある場合は、[こちらの完全な仕様をご確認ください](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards)。

### Smoothing Poolへの参加と離脱

Smoothing Poolにオプトインするには、次のコマンドを実行します。

```shell
rocketpool node join-smoothing-pool
```

これにより、Rocket Poolコントラクトでオプトインとして記録され、Validator Clientの`fee recipient`がノードのdistributorコントラクトからSmoothing Poolコントラクトに自動的に変更されます。

プールを離れるには、次のコマンドを実行します。

```shell
rocketpool node leave-smoothing-pool
```

これにより、Rocket Poolコントラクトでオプトアウトとして記録され、短い遅延が経過すると、Validator Clientの`fee recipient`がSmoothing PoolコントラクトからノードのFee Distributorコントラクトに自動的に変更されます。

### Smoothing Poolからの報酬請求

Smoothing Poolからの報酬は、Redstone報酬システムを使用して各報酬インターバルの終わりにRPLと一緒にバンドルされます。
請求は次のコマンドを実行するだけです。

```shell
rocketpool node claim-rewards
```

Smoothing Poolにオプトインしている場合、各インターバルで受け取るETHの量がゼロより多いことに気付くでしょう。

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

ここのInterval 1のSmoothing Pool報酬は、そのインターバル中にノードがオプトインしていて、それに応じて報酬を受け取ったことを示しています。

RPLとSmoothing Pool報酬の請求については、ガイドの後半の[報酬の請求](./rewards)セクションで詳しく説明します。

## 次のステップ

Smoothing Poolに参加するかどうかを決めたら、MEVとMEV報酬に関する次のセクションをご覧ください。
