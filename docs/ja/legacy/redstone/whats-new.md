# Rocket Pool Redstoneアップデート

Rocket Poolの次期メジャーアップデート**Redstone**が、RopstenおよびHoleskyテストネットワークでベータテスト用にリリースされました。
このページでは、Smartnodeスタックとプロトコル全般の両方への更新を含む、Redstoneによってもたらされる主な変更点について説明します。

以前のバージョンのRocket PoolとRedstoneの違いをすべて理解するために、このページを十分にお読みください。

::: tip 注意
アップグレードに向けてノードを準備する方法とアップグレード後に実施すべきことの詳細については、以下のガイドをご確認ください。

- [Dockerモード用ガイド](./docker-migration.mdx)
- [Hybridモード用ガイド](./hybrid-migration.mdx)
- [Nativeモード用ガイド](./native-migration.mdx)

:::

## クライアントの変更とThe Merge

Ropsten（まもなくHolesky）は**Execution LayerとConsensus LayerのMerge**に成功しました。
Proof-of-Workは使用されなくなり、代わりにRopsten上のバリデータが両チェーンのブロック作成と提案を担当するようになりました。
これには魅力的な財務的メリットがありますが（後述）、バリデータの運用方法に重要な変更も伴います。

以下は、Mergeの一環としてのクライアント動作の変更点の簡単なまとめです。

- Executionクライアントは現在3つのAPIポートを使用します。
  - API へのHTTPアクセス用（**デフォルト 8545**）
  - API へのWebsocketアクセス用（**デフォルト 8546**）
  - Merge後にConsensusクライアントが使用する新しい**Engine API**用（**デフォルト 8551**）

- Executionクライアントは機能するためにConsensusクライアントを必要とし、Consensusクライアントは機能するためにExecutionクライアントを必要とします。
  - **どちらも単独では動作できなくなりました。**

- 1つのExecutionクライアントは1つのConsensusクライアントにのみリンクする必要があります（逆も同様）。
  - 複数のExecutionクライアントを単一のConsensusクライアントにリンクすることも、複数のConsensusクライアントを単一のExecutionクライアントにリンクすることもできません。
  - このため、Rocket Pool node operatorには**フォールバックexecutionクライアントは利用できなくなりました**。

- **完全なexecutionクライアント**が必要です。
  - リモートプロバイダー（InfuraやPocketなど）は、Rocket Poolかどうかに関わらず、どのバリデータでも使用できなくなりました。

## Fee RecipientとDistributor

バリデータがブロック作成を担当するようになったことで、各トランザクションに付加される**priority fees**（**tips**とも呼ばれます）を受け取ることになります。
これらの手数料はETHで支払われ、minipoolバリデータがブロックを提案するたびに直接提供されます。
Beacon ChainにロックされたETHとは異なり、**priority feesにアクセスするために出金を待つ必要はありません**！
これらはブロック提案プロセスの一環として単純に報酬として付与されます。

手数料の送信先を知るために、Validator Clientには`fee recipient`という追加パラメータが必要です。
これはExecution Layer（ETH1）上のアドレスで、ブロック提案中にノードが獲得したすべてのpriority feesがここに送信されます。

Rocket Poolは、Beacon Chainの報酬を公平に分配するのと同じ方法で、これらの報酬を公平に分配するように設計されています。minipoolバリデータが獲得したpriority feesの半分があなたに行き（さらにすべてのminipoolの平均手数料を加算）、残りの半分はプールステーカーに行きます（平均手数料を差し引いた分）。

そのため、Smartnodeは自動的にValidator Clientの`fee recipient`を、ノードの**fee distributor**と呼ばれる特別なアドレスに設定します。
fee distributorは、Execution Layer上の**ノード固有の**ユニークなコントラクトです。
これは時間の経過とともに獲得したすべてのpriority feesを保持し、それらを公平に分配して配分するために必要なロジックを含んでいます。
この配布プロセスはあなた（node operator）によって制御され、いつでも実行できます。
時間制限はありません。

ノードのfee distributorのアドレスは、**ノードアドレスに基づいて決定論的に決定されます**。
つまり、fee distributorが作成される前から事前にわかっています。
**Smartnodeはこのアドレスをfee recipientとして使用します。**

::: tip 注
デフォルトでは、Smartnode v1.5.0をインストールすると、fee recipientは**rETHアドレス**に設定されます（Redstoneコントラクトのアップデートがまだデプロイされていない場合）。
RedstoneアップデートがデプロイされるとSmartnodeは自動的にこれをノードのfee distributorアドレスに更新します。

このルールの例外は、**Smoothing Pool**にオプトインしている場合です - 詳細については、このページの最後のセクションをご覧ください。
:::

新しいRocket Poolノードは、登録時に自動的にノードのdistributorコントラクトを初期化します。
既存のノードは、このプロセスを手動で行う必要があります。
これは一度だけ実行する必要があります。

これの興味深い影響の1つは、ノードのdistributorコントラクトを初期化する**前に**、distributorのアドレスが残高を蓄積し始める可能性があることです。
これは問題ありません。初期化するとすぐに、distributorはこの既存の残高すべてにアクセスできるようになります。

fee distributorの残高は次のコマンドで確認できます。

```shell
rocketpool node status
```

出力は次のようになります。

![](../../node-staking/images/status-fee-distributor.png)

ノードのdistributorを初期化するには、次の新しいコマンドを実行します。

```shell
rocketpool node initialize-fee-distributor
```

::: warning 注
Redstoneアップデート後、`rocketpool node deposit`で新しいminipoolを作成する前に、この関数を呼び出す必要があります。
:::

distributorが初期化されたら、次のコマンドを使用してその全残高を請求して分配できます。

```shell
rocketpool node distribute-fees
```

これにより、報酬のあなたの分が**withdrawal address**に送信されます。

## Rocket Poolプロトコルの変更

Execution ClientとConsensus Clientの変更および新しいpriority feesに加えて、Rocket Poolプロトコル自体も認識すべきいくつかの重要な変更を受けています。

### 新しい報酬システム

Redstoneアップデートで導入された最も重要な変更の1つは、**新しい報酬システム**です。
これは、node operatorがRPL報酬（および後述のSmoothing PoolからのETH）を受け取る方法の完全な見直しです。

_旧_報酬システムには以下の欠点がありました。

- 請求には約400kガスがかかり、非常に高額でした。
- Node Operatorは各インターバル（28日ごと）に報酬を請求する必要があり、請求しないと報酬を失います。つまり、少量のRPLを持つnode operatorにとってガス代が法外に高くなる可能性がありました。
- 報酬はチェックポイント時ではなく_請求時_に決定されました。ユーザーがチェックポイントと請求の間に大量のRPLをステークした場合、報酬が希薄化され、予想よりも少ないRPLを受け取る可能性がありました。

_新しい_請求システムはこれらすべての問題を解決します。

すべてのインターバルで、Oracle DAOは、すべての有効なステーク量を含む、Rocket Poolネットワーク内のnode operatorの状態の**真のスナップショット**を集合的に作成します。
この情報は[Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)にコンパイルされます - スマートコントラクトですべての詳細を利用可能にするための非常に効率的な方法です。
Merkle TreeはJSONファイルに構築され、[InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System)にホストされ、Merkle Treeのルートがコントラクトに送信されます。

この新しいシステムには以下の機能があります。

- **報酬を好きなだけ蓄積**できるようになりました。請求時期に時間制限がなくなりました。
- **複数のインターバル**を一度に請求できます。
- 最初の請求トランザクションは約85kガスを使用します。その後の各請求トランザクションは約55kガスかかります。
  - 複数のインターバルを一度に請求する場合、各追加インターバルは**6kガス**かかるため、できるだけ多くを一度に請求することが最もコスト効率的です。
- RPL報酬が**希薄化されなくなりました** - RPL報酬はスナップショット時に固定され、常にその金額の資格があります。
- 請求トランザクションの一部として**RPL報酬の一部（またはすべて）を再ステーク**でき、現在と比較してガス要件がさらに削減されます。
- 現在、**すべての請求はMainnetで行う必要があります**が、将来的にLayer 2ネットワークで請求する機能を構築するインフラストラクチャが整っています。

ノードが新しい報酬チェックポイントを検出すると、そのインターバルのJSONファイルを自動的にダウンロードします。
次のコマンドを使用して報酬を確認できます。

```shell
rocketpool node claim-rewards
```

インターバルが経過して報酬が蓄積されると、出力は次のようになります。

![](../../node-staking/images/claim-rewards-gb.png)

ここで、各インターバルで獲得した報酬の数を素早く確認でき、どれを請求するかを決定できます。
**Ropstenのインターバル時間はテストを容易にするために1日に設定されています。**

この請求中に再ステークしたい金額を指定することもできます。

![](../../node-staking/images/autostake.png)

これにより、1つのトランザクションでRPL報酬を複利運用でき、現在必要とされるよりもはるかに少ないガスを使用できます。

::: tip 注
Oracle DAOが作成したものをダウンロードする代わりに手動で報酬チェックポイントを構築したい場合は、TUIでこの設定を`Download`から`Generate`に変更できます。

![](../../node-staking/images/tui-generate-tree.png)

ヒントが示すように、これを行うにはアーカイブノードへのアクセスが必要です。
ローカルのExecution Clientがアーカイブノードでない場合は、その下の`Archive-Mode EC URL`ボックスに別のもの（InfuraやAlchemyなど）を指定できます。
このURLはMerkle Treeの生成時にのみ使用され、検証業務には使用されません。
:::

::: danger 警告
_スナップショット時_に10%未満のRPL担保である場合、そのスナップショットの報酬を受け取る資格がありません。
請求前に「補充」するだけで再び資格を得られる現在のシステムとは異なり、これはそのスナップショットに永久にロックされ、**その期間の報酬を受け取ることは二度とできません**。
その期間の報酬を受け取るには、スナップショット時に10%を超える担保を持っている**必要があります**。
:::

### Smoothing Pool

Redstoneアップデートの最後のエキサイティングな新機能は**Smoothing Pool**です。
Smoothing Poolは、オプトインしたすべてのメンバーのpriority feesを集合的にプールする**オプトイン機能**です。
報酬チェックポイント中に、プールの合計ETH残高はプールステーカー部分とnode operator部分に分割されます。
node operator部分のすべての報酬は、**プールのすべてのメンバーに公平に分配されます**。

本質的に、Smoothing Poolは、Beacon Chain上のブロック提案に関連するランダム性を効果的に排除する方法です。
運が悪くて数か月間提案がなかった経験がある場合、Smoothing Poolは非常にエキサイティングかもしれません。

::: tip 注
Smoothing Pool報酬はRPL報酬に使用されるMerkle Treeに組み込まれているため、`rocketpool node claim-rewards`を使用してRPLを請求するのと同時に請求します。
:::

詳細を明確にするために、Smoothing Poolは以下のルールを使用します。

- Smoothing Poolへのオプトインは**ノードレベル**で行われます。オプトインすると、すべてのminipoolがオプトインされます。

- node operatorの合計シェアは、Smoothing Poolにオプトインしたすべてのノードのすべてのminipoolの平均手数料によって決定されます。

- 誰でもいつでもオプトインできます。システムの悪用を防ぐために、オプトアウトする前に完全な報酬インターバル（Ropstenでは1日、Mainnetでは28日）を待つ必要があります。
  - オプトアウトしたら、再度オプトインするために別の完全なインターバルを待つ必要があります。

- Smoothing Poolは、オプトインした各ノードが所有する各minipool（インターバルのプールのETHの部分）の「シェア」を計算します。
  - シェアは、インターバル中のminipoolのパフォーマンス（Beacon Chain上で送信したアテステーションの数と見逃した数を見て計算）とminipoolの手数料率の関数です。

- ノードの合計シェアはminipoolシェアの合計です。

- ノードの合計シェアは、オプトインしていた時間の量によってスケーリングされます。
  - 完全なインターバルの間オプトインしていた場合、完全なシェアを受け取ります。
  - インターバルの30%の間オプトインしていた場合、完全なシェアの30%を受け取ります。

Smoothing Poolにオプトインするには、次のコマンドを実行します。

```shell
rocketpool node join-smoothing-pool
```

これにより、Rocket Poolコントラクトにオプトインとして記録され、Validator Clientの`fee recipient`がノードのdistributorコントラクトからSmoothing Poolコントラクトに自動的に変更されます。

プールから離れるには、次のコマンドを実行します。

```shell
rocketpool node leave-smoothing-pool
```

### ペナルティシステム

node operatorがValidator Clientで使用されるfee recipientを手動で変更して「チート」しないようにするために、Rocket Poolはペナルティシステムを採用しています。

Oracle DAOは、Rocket Pool node operatorによって生成された各ブロックを常に監視しています。
以下のアドレスのいずれか以外のfee recipientを持つブロックは**無効**と見なされます。

- rETHアドレス
- Smoothing Poolアドレス
- ノードのfee distributorコントラクト（Smoothing Poolからオプトアウトしている場合）

**無効な**fee recipientでブロックを提案したminipoolには**ストライク**が発行されます。
3回目のストライクで、minipoolは**インフラクション**を受け始めます - 各インフラクションは、**ETH収益を含む合計Beacon Chain残高の10%**を没収し、minipoolから資金を出金する際にrETHプールステーカーに送信します。

インフラクションは**ノード**レベルではなく、**minipool**レベルです。

Smartnodeソフトウェアは、正直なユーザーがペナルティを受けないように設計されています。たとえそのためにValidator Clientをオフラインにする必要があるとしてもです。
これが発生した場合、アテステーションを停止し、SmartnodeがなぜあなたのFee recipientを正しく設定できないかについてのエラーメッセージがログファイルに表示されます。

## アップグレードの前後のガイド

アップグレードに向けてノードを準備する方法とアップグレード後に実施すべきことの詳細については、以下のガイドをご確認ください。

- [Dockerモード用ガイド](./docker-migration.mdx)
- [Hybridモード用ガイド](./hybrid-migration.mdx)
- [Nativeモード用ガイド](./native-migration.mdx)
