# Atlasアップデート

::: tip 注意
Atlasは`2023年4月18日00:00 UTC`にデプロイされました。最新のプロトコルアップグレードであるHoustonについて読むには[こちら](../houston/whats-new)をご覧ください。
:::

このページでは、Rocket Poolの次期メジャーアップデートである**Atlas**がプロトコルにもたらす主要な変更について説明します。これには、Smartnodeスタックと一般的なRocket Poolプロトコルの両方のアップデートが含まれます。

このページをよく読んで、Rocket Poolの以前のバージョン（Redstone）とAtlasの違いをすべて理解してください。

## 新しいプロトコル機能

Atlasは、コミュニティのフィードバックとEthereumプロトコル自体の変更の両方に基づいた、いくつかのエキサイティングな新機能をもたらします。
以下はこれらの変更の簡単なリストです。これらのいずれかをクリックして詳細を確認してください。

### Shapellaと出金

Ethereumプロトコルは次のメジャーアップグレードの準備を進めています：Execution層での**Shanghai**、Consensus層での**Capella**です。これらは現在相互接続されているため、両方が同時に発生します。
Ethereumユーザーは、統合されたアップグレードを愛情を込めて[**「Shapella」**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement)と呼んでいます。

Shapellaは、Beacon Chainに**出金**を導入します。つまり、ノードオペレーターは現在Beacon ChainにロックされているETHにアクセスできるようになります。
これには2つのフレーバーがあります：

- 部分出金（**スキミング**）：報酬（32 ETHを超えるBeacon Chainの残高）がExecution層のminipoolに送信されます。これは、数日ごと（Mainnetでは約4〜5日に1回）に_プロトコル自体によって自動的に_行われます。
- **完全出金**：validatorをBeacon Chainから退出させ、その全残高がExecution層のminipoolに送信されます。これは、validatorがチェーンから十分に長く退出した後、_プロトコル自体によって自動的に_行われます。

Atlasは、minipoolの新しい委任契約を導入し、ノードオペレーターがいつでもminipoolのETH残高を**配分**し、ノードオペレーターとrETH保有者の間で均等に分割する（もちろん手数料も含む）ことを可能にします。
これにより、ノードオペレーターはBeacon Chainの報酬に**即座にアクセス**できます！
また、rETH保有者のシェアをデポジットプールに戻すため、プロトコルの為替レートでrETHをETHにアンステークするため（または新しいminipoolを作成するため）に使用できます。

### 8-ETHボンドminipool

Atlasで最も期待されている変更の1つは、16 ETHの代わりに8 ETHのみを提供してminipoolを作成する能力の導入です。
所有するノードオペレーターによって8 ETHのみがボンドされたminipoolは、validatorを作成するために（rETH保有者によって提供される）staking poolからの**24 ETH**とマッチングされます。
これにより、独自のvalidatorを実行するための資本要件が大幅に削減され_、_ノードオペレーターとrETHステーカーの両方により大きなリターンをもたらします！
実際、1つの16-ETH minipoolではなく2つの8-ETH minipoolを実行すると、16-ETH minipoolの手数料率が20%であっても、**18%以上多い報酬**が提供されます。

8 ETH minipoolを作成するには、**最低2.4 ETH相当のRPL**と**最大12 ETH相当のRPL**をステークする必要があります。
これらは、プロトコルから_借りている_金額の10%と、自分で_ボンド_（ステーク）している金額の150%を表します。

新しいminipoolは8 ETHまたは16 ETHのいずれかで作成できます。
16 ETH minipoolは今日の動作から変更されておらず、RPLトークンへのエクスポージャーを最小限に抑えたいユーザーが利用できます。

8 ETHボンドを使用して新しいminipoolを作成する方法については、[minipool作成ガイド](../../node-staking/create-validator.mdx)をご覧ください。

また、Atlasが適用されると、ノードオペレーターは**既存の16-ETH minipoolを退出することなく直接8-ETH minipoolに移行**できます。
これにより、8 ETHが[デポジットクレジット](../../node-staking/credit)として戻され、**無料で新しい8-ETH minipoolを作成**するために使用できます！

8-ETHボンドminipoolの詳細については、[ボンド削減ガイド](../../node-staking/leb-migration.mdx)をご覧ください。

### ソロvalidatorの変換

Shapellaアップグレードの一部には、ソロvalidatorが[validatorの出金資格情報を変更](https://notes.ethereum.org/@launchpad/withdrawals-faq)する能力が含まれており、元の（現在は未使用の）BLSベースの出金キーからExecution層のアドレスに変更できます。
このアドレスは、validatorのすべての報酬とBeacon Chainから退出した後の全ETH残高の受取人になります。

通常のRocket Poolノードオペレーターは、minipoolを作成したときにプロトコルがこれを自動的に設定したため、これについて心配する必要はありません。
_ただし_、ソロvalidatorに対するこの新しい要件の一部として、Atlasはエキサイティングな機会をもたらします：**既存のソロvalidator**の出金アドレスになる**特別なminipoolを作成**する能力です。

言い換えれば、これにより**退出する必要なくソロvalidatorをRocket Pool minipoolに直接変換**できます！

これは、次のようなRocket Pool minipoolのすべての利点が得られることを意味します：

- 1つのvalidator（32 ETHボンド）を**4つのminipool**（それぞれ8 ETHボンド）に変換し、Beacon Chain上のプレゼンスを効果的に**4倍**にする能力
- rETHステーカーによって提供されるこれらのminipoolの部分に対する手数料
- ブロック提案とMEVからの報酬をプールし均等に配分するRocket Poolの[Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool)へのアクセス

ソロvalidatorをminipoolに変換する方法の詳細については、[ソロvalidatorをminipoolに変換する](../../node-staking/solo-staker-migration)ガイドをご覧ください。

## 新しいSmartnode機能

Rocket Poolプロトコルのコア変更に加えて、Atlasはv1.9.0に存在するSmartnodeスタック自体にいくつかのエキサイティングなアップグレードももたらします。

### 自動報酬配分

すでにアクティブなRocket Poolノードオペレーターである場合、特定の自動化されたプロセスを処理する`rocketpool_node`プロセスに精通しているかもしれません。
たとえば、正しいfee recipientを持っていることを確認し、`prelaunch` minipoolが12時間のスクラブチェックを通過した後、2番目の`stake`トランザクションを自動的に実行します。

Atlasから、`node`には新しい義務があります：**minipoolの報酬の自動配分！**
これは、[Shapellaアップグレードの動作方法](../../node-staking/skimming)により、数日ごとにBeacon ChainからminipoolにRewardsをスキミングします。

minipoolのいずれかがユーザー指定のしきい値（デフォルトは1 ETH）よりも大きい残高に達すると、ノードは自動的に`distribute-balance`を実行します。
これにより、報酬のあなたの部分があなたの出金アドレスに送信され、プールステーカーの部分がデポジットプールに戻されます。

しきい値の変更は、`service config` TUIの`Smartnode and TX Fees`セクションの`Auto-Distribute Threshold`設定で行うことができます。

### 統合Grafanaダッシュボード

人気の要望により、ノードオペレーターがノードのステータス、進捗、全体的な健全性を追跡および評価するのに役立つ新しい[**Grafanaダッシュボード**](https://grafana.com/grafana/dashboards/21863)を作成しました：

![](../../node-staking/images/grafana-1.3.jpg)

次の非常に要求された機能が付属しています：

- 単一のダッシュボードですべてのExecutionおよびConsensusクライアントをサポート - 使用しているクライアントに基づいてダッシュボードを変更する必要がなくなりました！
- CPUとRAMの使用状況、ピア数を含むExecutionクライアントの統計
- 前のエポックのattestationがどの程度「正確」だったかを追跡するattestation精度追跡。最適な報酬からどれだけ離れているかがわかります
- Smoothing Poolの残高の追跡
- Smoothing PoolからのETHを含む、請求済みおよび未請求の報酬の追跡
- Rocket PoolのSnapshotベースのガバナンス投票に関する統計
- OSとチェーンデータ用に別のSSDがある場合、2番目のSSDの使用済みスペースと温度を追跡するための余地
- その他多数！

[Grafanaガイド](../../node-staking/grafana.mdx)に従って、ID `21863`を使用して公式Grafanaサービスから新しいダッシュボードをインポートできます。

この新しいダッシュボードは、コミュニティメンバー**0xFornax**からの広範な支援を含む愛の労作でした。すべてのハードワークに感謝します！

### Nimbusの変更

Smartnode v1.9.0は、Nimbusの**スプリットモードサポート**を導入します！
単一のプロセス/コンテナ内でBeacon NodeとValidator Clientを実行する代わりに、Smartnodeは他のクライアントと同様に別々のコンテナでそれらを実行します。これには次の利点があります：

- Nimbusは**フォールバッククライアント**をサポートするようになりました（プライマリクライアントがメンテナンスのためダウンしている場合に、NimbusのValidator Clientが接続できるセカンダリExecutionクライアントとBeacon Node。例えば再同期など）。
- Nimbusは**外部管理（ハイブリッド）モード**でサポートされるようになり、Smartnodeが管理するValidator Clientを、自分で独自に維持する外部Beacon Nodeと結合できるようになります。
- 新しいminipoolの追加後にBeacon Nodeを再起動する必要がなくなり、ピアに再接続している間にattestationを失うことがなくなります。

### Lodestarサポート

[Lodestar](https://chainsafe.github.io/lodestar/)は、Consensus Clientの選択肢として公式にサポートされるようになりました！
これは、[EthereumのLaunchpad](https://launchpad.ethereum.org/en/lodestar)に正式に受け入れられた最新の追加であり、validationの準備ができています。
Lodestarは、Doppelganger Detection、MEV-Boost、外部管理クライアント（ハイブリッドモード）など、他のクライアントから愛されてきた多くの優れた機能をサポートしています！

### 新しいネットワークスナップショットシステム

やや技術的な注意点として、v1.9.0は、ExecutionとConsensus層の両方で**ノードに関するすべて**の状態のスナップショットをすばやくキャプチャするための真新しいシステムを導入します。
内部的には、このシステムは[MakerDAOのmulticall契約](https://github.com/makerdao/multicall)とWill O'Beirneの[Ethereum Balance Checker契約](https://github.com/wbobeirne/eth-balance-checker)を活用して、数千の個別のExecutionクライアントクエリを単一のリクエストにバッチ処理します。

これにより、多数のvalidatorを持つノードオペレーターにとって、`node`プロセスがExecutionクライアントに対してはるかに負担が少なくなり、CPU負荷が大幅に削減され、attestationと全体的な報酬が改善されます。

この新しいシステムはまだCLI自体には導入されていないため、そこで実行するコマンド（`rocketpool minipool status`など）は依然として古い単一クエリ設定を使用します。
時間の経過とともにCLIにも導入され、すべてのコマンドが超高速になります（_トランザクションが検証されるのを待つのを除いて、それはまだ時間がかかります_）。
