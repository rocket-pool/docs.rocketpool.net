# Rocket Pool Oracle DAO

::: warning 注意
このドキュメントは、Rocket PoolのOracle DAOのメンバーにのみ適用されます。
Oracle DAOに明示的に招待されておらず、通常のRocket Poolノードを実行するつもりである場合、このセクションのガイドは適用されません。
無視していただいて構いませんが、興味がある場合は読んでいただいても構いません。
:::

**Oracle DAO**は、技術的な制限によりSmart Contractでは実現できない、プロトコルに必要な管理業務を担当する特別なRocket Poolノードのグループです。
基本的には通常のRocket Poolノードと同じで、同じツールを使用し、同じ方法で設定でき、通常のminipoolを実行することもできますが、実行する補足的なタスクが付属しています。
これには次のようなものが含まれます。

- validatorのステータスと残高を含む、Beacon ChainからExecution Layerへの情報の移動
- 既に使用されていないvalidatorの公開鍵を使用してminipoolが作成され、[適切なwithdrawal credentialsがある](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit)ことを確認して、プロトコルが安全に資金を提供できるようにする
- 各報酬期間の終わりにrewards Merkle treeを構築し、他のノードオペレーターがアクセスできるようにIPFSにアップロードする
- Rocket Poolの[fee recipient requirements](../node-staking/mev.mdx)への準拠について提案を監視する
- パラメータの変更やコントラクトのアップグレードの承認を含む、コアプロトコルへの変更を提案および投票する
- Oracle DAOの名簿について提案および投票する。他のOracle DAOメンバーの招待と削除を含む

これらの任務を遂行することへの報酬として、Oracle DAOには、各報酬期間に生成される合計RPLインフレーションの[小さな割合](https://rpips.rocketpool.net/RPIPs/RPIP-25)が集合的に与えられ、メンバー間で均等に分割されます。

誰でもパーミッションレスで作成および実行できる通常のRocket Poolノードとは異なり、Oracle DAOのメンバーシップは既存のメンバーによる**招待のみ**です。
最近Oracle DAOに参加するよう招待された場合、このセクションのガイドは、役割を理解し、ノードをセットアップし、健全な状態を維持するのに役立ちます。

## 要件

Oracle DAOノードを実行するには、次のものが必要です。

- **Execution ClientのRPCエンドポイント**へのアクセス。これは、ほとんどのRocket Poolノードの場合と同様にローカルで実行されるクライアントであるか、あなたまたはあなたの組織が独立して維持する外部クライアントにリンクできます。
- **アーカイブモードのExecution Client**へのアクセス。これは、プライマリクライアントまたは補足（フォールバック）クライアントとして機能できます。これは、タスクがExecution ClientからプルーニングされたExecution Layer状態を呼び出す必要があるまれな状況でのみ使用されます。ただし、これらの期間中にタスクを正常に実行できるようにするために、アーカイブノードへのアクセスが**重要**です。
  - **強く**推奨するのは、この目的のためにオンプレミスのアーカイブノードを使用することです。[Infura](https://infura.io/pricing)や[Alchemy](https://www.alchemy.com/pricing)などのサービスは、報酬ツリーの構築などの重要な期間中に需要に追いつくことに困難を示しています。
- **アーカイブモードのBeacon NodeのREST APIエンドポイント**へのアクセス（HTTP経由）。これは、ほとんどのRocket Poolノードの場合と同様にローカルで実行されるクライアントであるか、あなたまたはあなたの組織が独立して維持する外部クライアントにリンクできます。
- 標準のSmartnode CLI。
- Smartnodeデーモンが`watchtower`モードで設定および実行されている（これはすべてのユーザーの標準のSmartnodeバンドルに含まれていますが、Oracle DAOノードに対してのみアクティブにタスクを実行します）。
  - これは、Dockerコンテナ（標準セットアップ）または単純な`systemd`サービス（「Native」モード）として実行できます。
- タスクのガスコストを支払うのに十分なETH（後述）。

::: warning 注意
オンプレミスのアーカイブノードを実行できず、サードパーティサービスに_依存する必要がある_場合は、次のことを考慮してください。

アーカイブモードフォールバックに**Infura**を使用する予定の場合、少なくとも**Team**プランが必要です。
無料ティアとDeveloperティアでは不十分です。

**Alchemy**を使用する予定の場合、少なくとも**Growth**プランが必要です。
無料ティアでは不十分です。
:::

## 活動

Oracle DAOの任務は2つの部分に分かれています。

1. **自動化された任務**: これらは、Consensus LayerからExecution Layerへの情報の移動、プロトコルのさまざまな側面のオフチェーン計算、およびSmart Contractへの更新としての提出など、日常的なRocket Pool運用に関連する任務です。これらのそれぞれは、`watchtower`デーモンプロセスによって自動的に実行され、Execution ClientとConsensus Client、および`watchtower`デーモンがすべて正常に動作している限り、手動による介入は必要ありません。
2. **手動の任務**: これらは、独自の意思決定とOracle DAOの残りのメンバーとの帯域外の通信を必要とする任務です。これには、コントラクトのアップグレードへの投票、パラメータの変更、およびOracle DAOへのメンバーの招待またはキックなどが含まれます。これらはすべて、標準のSmartnode CLIを介して実行できます。

次のセクションを読んで、Oracle DAOノードのセットアップ方法を学んでください。
