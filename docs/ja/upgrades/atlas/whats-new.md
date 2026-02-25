# Atlas アップデート

::: tip 注意
Atlas は `2023年4月18日 00:00 UTC` にデプロイされました。最新のプロトコルアップグレードである Houston については、[こちら](../houston/whats-new)をご覧ください。
:::

このページでは、Rocket Pool の次の主要なアップデート、**Atlas** がプロトコルにもたらす主要な変更について説明します。これには、Smartnode スタックと Rocket Pool プロトコル全般の両方のアップデートが含まれます。

Rocket Pool の以前のバージョン (Redstone) と Atlas の間のすべての違いを理解するために、このページを十分に読んでください。

## 新しいプロトコル機能

Atlas は、コミュニティのフィードバックと Ethereum プロトコル自体の変更の両方に基づいた、いくつかのエキサイティングな新機能をもたらします。
以下は、これらの変更の簡単なリストです。いずれかをクリックして詳細を確認してください。

### Shapella と出金

Ethereum プロトコルは、次の主要なアップグレードの準備を進めています: Execution レイヤーでは **Shanghai**、Consensus レイヤーでは **Capella** です。これらは現在相互接続されているため、両方が同時に発生します。
Ethereum ユーザーは、それに応じて、組み合わされたアップグレードを [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) と呼んでいます。

Shapella は、Beacon Chain に**出金**を導入します。つまり、ノードオペレーターは、現在 Beacon Chain にロックされている ETH にアクセスできるようになります。
これには 2 つのフレーバーがあります。

- 部分出金 (**スキミング**)。報酬 (32 ETH を超える Beacon Chain 残高の超過分) が Execution Layer の minipool に送信されます。これは、**プロトコル自体によって自動的に**数日ごとに行われます (Mainnet では約 4 日または 5 日に 1 回)。
- **完全出金**。validator を Beacon Chain から退出させ、その残高全体が Execution Layer の minipool に送信されます。これは、validator がチェーンから十分に長く退出した後、**プロトコル自体によって自動的に**行われます。

Atlas は、minipool 用の新しいデリゲートコントラクトを導入し、ノードオペレーターが minipool の ETH 残高を**分配**し、いつでもノードオペレーターと rETH 保有者の間で均等に分割できるようにします (もちろん手数料も含む)。
これにより、ノードオペレーターは Beacon Chain の報酬に**即座にアクセス**できます!
また、rETH 保有者のシェアをデポジットプールに戻すため、プロトコルの為替レートで rETH を ETH にアンステークしたり、新しい minipool を作成したりするために使用できます。

### 8-ETH ボンド minipool

Atlas で最も期待されている変更の 1 つは、16 ETH ではなく 8 ETH のみを提供して minipool を作成できる機能の導入です。
所有するノードオペレーターが 8 ETH のみをボンドした minipool は、validator を作成するために staking pool から **24 ETH** (rETH 保有者によって提供される) と照合されます。
これにより、独自の validator を実行するための資本要件が大幅に削減され、ノードオペレーターと rETH ステーカーの両方にとってより大きなリターンが得られます!
実際、16-ETH minipool が 20% の手数料率を持っていても、1 つの 16-ETH minipool の代わりに 2 つの 8-ETH minipool を実行すると、**18% 以上多くの報酬**が得られます。

8 ETH minipool を作成するには、**最低 2.4 ETH 相当の RPL** と **最大 12 ETH 相当の RPL** をステークする必要があります。
これらは、プロトコルから*借りている*金額の 10%、および自分で*ボンドしている* (ステークしている) 金額の 150% を表しています。

新しい minipool は、8 ETH または 16 ETH のいずれかで作成できます。
16 ETH minipool は現在の動作方法から変更されておらず、RPL トークンへの露出を最小限に抑えたいユーザーが利用できます。

8 ETH ボンドを使用して新しい minipool を作成する方法については、[minipool 作成ガイド](../../node-staking/create-validator.mdx)をご覧ください。

また、Atlas が適用されると、ノードオペレーターは**既存の 16-ETH minipool を退出せずに直接 8-ETH minipool に移行できます**。
これにより、8 ETH が[デポジットクレジット](../../node-staking/credit)として返され、**無料で新しい 8-ETH minipool を作成**するために使用できます!

8-ETH ボンド minipool の詳細については、[ボンド削減ガイド](../../node-staking/leb-migration.mdx)をご覧ください。

### ソロ validator の変換

Shapella アップグレードの一部には、ソロ validator が [validator の出金クレデンシャルを変更](https://notes.ethereum.org/@launchpad/withdrawals-faq)する機能が含まれます。元の (現在は使用されていない) BLS ベースの出金キーから Execution レイヤーのアドレスに変更します。
このアドレスは、その validator のすべての報酬と、Beacon Chain を退出した後の完全な ETH 残高の受取人になります。

通常の Rocket Pool ノードオペレーターは、プロトコルが minipool を作成したときにこれを自動的に設定するため、これについて心配する必要はありません。
_ただし_、ソロ validator のこの新しい要件の一部として、Atlas はエキサイティングな機会をもたらします。**既存のソロ validator** の出金アドレスになる**特別な minipool を作成**する機能です。

言い換えれば、これにより、**ソロ validator を退出せずに Rocket Pool minipool に直接変換**できます!

これは、Rocket Pool minipool のすべての利点を得ることができることを意味します。

- 1 つの validator (32 ETH ボンド付き) を **4 つの minipool** (それぞれ 8 ETH ボンド付き) に変換する機能。Beacon Chain での存在を効果的に **4 倍**にします
- rETH ステーカーによって提供される minipool の部分に対する手数料
- ブロック提案と MEV からの報酬をプールして均等に分配する Rocket Pool の [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) へのアクセス

ソロ validator を minipool に変換する方法の詳細については、[ソロ validator を minipool に変換する](../../node-staking/solo-staker-migration)ガイドをご覧ください。

## 新しい Smartnode 機能

Rocket Pool プロトコルへのコアの変更に加えて、Atlas は、v1.9.0 に存在する Smartnode スタック自体にいくつかのエキサイティングなアップグレードももたらします。

### 自動報酬分配

すでにアクティブな Rocket Pool ノードオペレーターである場合、特定の自動化されたプロセスを処理する `rocketpool_node` プロセスに精通しているかもしれません。
例えば、正しい手数料受取人を確保し、`prelaunch` minipool が 12 時間のスクラブチェックに合格した後、2 番目の `stake` トランザクションを自動的に実行します。

Atlas から始めて、`node` には新しい義務があります。**minipool 報酬の自動分配!**
これは、[Shapella アップグレードの動作方法](../../node-staking/skimming)により、数日ごとに Beacon Chain から minipool に報酬をスキミングします。

minipool の 1 つがユーザー指定のしきい値 (デフォルトは 1 ETH) よりも大きい残高に達すると、ノードは自動的にそれに対して `distribute-balance` を実行します。
これにより、報酬のあなたの部分が出金アドレスに送信され、プールステーカーの部分がデポジットプールに返されます。

しきい値の変更は、`service config` TUI の `Smartnode and TX Fees` セクションの `Auto-Distribute Threshold` 設定で行うことができます。

### 統合された Grafana ダッシュボード

要望に応えて、ノードオペレーターがノードのステータス、進行状況、および全体的な健全性を追跡および評価するのに役立つ新しい [**Grafana ダッシュボード**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/)を作成しました。

![](../../node-staking/images/grafana-1.3.jpg)

次の要望の多かった機能が付属しています。

- 単一のダッシュボードですべての Execution および Consensus クライアントをサポート。使用しているクライアントに基づいてダッシュボードを変更する必要はありません!
- CPU と RAM の使用量、ピア数を含む Execution クライアント統計
- 前のエポックの attestation がどれほど「正しい」かを追跡する attestation 精度追跡。最適な報酬からどれだけ離れているかがわかります
- Smoothing Pool の残高の追跡
- Smoothing Pool からの ETH を含む、請求済みおよび未請求の報酬の追跡
- Rocket Pool の Snapshot ベースのガバナンス投票に関する統計
- OS 用と別のチェーンデータ用に 2 つ目の SSD がある場合、その使用スペースと温度を追跡する余地
- その他多数!

公式の Grafana サービスから ID `21863` を使用して、[Grafana ガイド](../../node-staking/grafana.mdx)に従って新しいダッシュボードをインポートできます。

この新しいダッシュボードは、コミュニティメンバー **0xFornax** の広範な協力を含む愛の労作でした。すべてのハードワークをありがとうございます!

### Nimbus の変更

Smartnode v1.9.0 は、Nimbus の **split mode サポート**を導入します!
単一のプロセス/コンテナ内で Beacon Node と Validator Client を実行する代わりに、Smartnode は他のクライアントと同様に、別々のコンテナでそれらを実行するようになります。これには次の利点があります。

- Nimbus が **fallback クライアント** (プライマリクライアントがメンテナンスのためにダウンしているときに Nimbus の Validator Client が接続できるセカンダリ Execution クライアントと Beacon Node) をサポートするようになりました。
- Nimbus が **Externally-Managed (Hybrid) Mode** でサポートされるようになり、Smartnode が管理する Validator Client を、自分で維持する外部 Beacon Node に結合できます。
- 新しい minipool の追加後に Beacon Node を再起動する必要がなくなり、ピアに再接続している間に attestation を失うことがなくなります。

### Lodestar サポート

[Lodestar](https://chainsafe.github.io/lodestar/) が、選択した Consensus Client のオプションとしてサポートされるようになりました!
これは、[Ethereum の Launchpad](https://launchpad.ethereum.org/en/lodestar) に正式に受け入れられた最新の追加であり、検証の準備ができています。
Lodestar は、Doppelganger Detection、MEV-Boost、externally-managed クライアント (Hybrid Mode) など、他のクライアントから愛されている多くの優れた機能をサポートしています!

### 新しいネットワークスナップショットシステム

やや技術的な注意点として、v1.9.0 は、Execution と Consensus の両方のレイヤーで**ノードに関するすべて**の状態のスナップショットを迅速にキャプチャするための全く新しいシステムを導入します。
内部では、このシステムは [MakerDAO の multicall コントラクト](https://github.com/makerdao/multicall)と Will O'Beirne の [Ethereum Balance Checker コントラクト](https://github.com/wbobeirne/eth-balance-checker)を活用して、何千もの個別の Execution クライアントクエリを単一のリクエストにバッチ処理します。

これにより、多数の validator を持つノードオペレーターにとって、`node` プロセスが Execution クライアントに与える負担がはるかに少なくなり、CPU 負荷が大幅に削減され、attestation と全体的な報酬が改善されます。

この新しいシステムは、まだ CLI 自体には組み込まれていないため、そこで実行するコマンド (`rocketpool minipool status` など) は、古い単一クエリ設定を引き続き使用します。
時間の経過とともに、CLI にも導入され、すべてのコマンドが非常に高速になります (_トランザクションの検証を待つことを除いて、それにはまだ時間がかかります_)。
