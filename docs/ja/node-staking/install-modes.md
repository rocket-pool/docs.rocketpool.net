# Rocket Poolモードの選択

Rocket PoolのSmartnodeスタックは非常に柔軟です。実行方法はいくつかあります。
ゼロから完全なfull nodeを立ち上げることができ、既存のExecution ClientまたはConsensus Clientのデプロイメントと統合することができ、さらにシステムサービスのセットとしてネイティブに実行することもできます。
このセクションでは、Smartnodeスタックの構成と使用の典型的な方法について説明します。

## デフォルトのDockerベースの構成

デフォルトモードで、Smartnodeを実行する最も一般的な方法は、Rocket Poolが管理するローカルマシン上に完全なfull nodeインスタンス全体を作成することです。

これを実現するために、Smartnodeは[Dockerコンテナ](https://www.docker.com/resources/what-container)を使用します。
本質的に、Dockerコンテナは、プログラム、そのすべての依存関係、および正しく実行するために必要なすべての構成が事前に構成された小さなサンドボックスです。
不要になったら、単純に破棄できます。
これは、実際のファイルシステムや他のプログラムを乱すことなく、物事を機能させる素晴らしい自己完結型のバンドルです。

このモードは、Smartnode Installerがデプロイするものです。
次のDockerコンテナを使用します。

- `rocketpool_api` - これは、Rocket Poolのコマンドラインインターフェース(CLI)を介してSmartnodeと対話するときにSmartnodeが提供する実際の機能を保持します。
- `rocketpool_node` - これは、報酬チェックポイント後にRPL報酬を定期的にチェックして請求するバックグラウンドプロセスです(自動請求が有効になっている場合、これについては後で詳しく説明します)。また、minipoolを作成するときに実際に新しいvalidatorをステーキングする責任があります。
- `rocketpool_watchtower` - これは、Oracle Nodesがオラクル関連の職務を実行するために使用されます。通常のNode Operatorの場合、これは単にアイドル状態のままになります。
- `rocketpool_eth1` - これはExecution clientです。
- `rocketpool_eth2` - これはConsensus beacon node clientです。
- `rocketpool_validator` - これはValidator clientで、validatorの職務(ブロックへのattestationや新しいブロックの提案など)を担当します。

ほとんどの状況では、ゼロから新しいnodeを作成するときに選択するのに適したオプションです。
最速で、最も手間のかからない手順です。
また、新しいSmartnodeリリースごとにExecution ClientとConsensus Clientへの更新を処理するため、心配する必要はありません(ただし、必要に応じていつでも手動でアップグレードできます)。

::: warning 注意
現在、一部のDockerコンテナは正しく機能するために`root`ユーザーとして実行する必要があります。
Dockerコンテナは一般的に、ユーザーがメインのオペレーティングシステムに侵入するのを防ぐのに非常に優れていますが、セキュリティ上の理由でこの要件に満足できない場合があります。
この場合、以下にリストされているNative構成モードを使用することをお勧めします。
:::

このモードを使用したい場合は、[Configuring a Standard Rocket Pool Node with Docker](./docker)セクションに進んでください。

## 外部クライアントを使用したハイブリッド構成

ハイブリッド構成は、Rocket Pool nodeの実行に興味があるが、他の目的(たとえば、すでにソロステーキングを行っているため)で独自のExecution ClientまたはConsensus Clientを実行しているユーザーに適しています。

このモードでは、Rocket Poolは独自のプロセスと管理するValidator clientのDockerコンテナをデプロイしますが、すでに実行および維持している外部クライアントのExecution clientとBeacon Nodeコンテナは無視します。
**Rocket Poolはnodeの各minipoolの新しいvalidatorキーを作成および維持するため、独自のValidator clientを実行することが重要です。**

この構成を使用する場合、Smartnodeは次のDockerコンテナを使用します(上記で説明しました)。

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

`rocketpool_eth1`と`rocketpool_eth2`コンテナは、すでに外部で実行しているクライアントに応じて、含まれるか除外されます。

このモードを使用したい場合は、[Configuring a Standard Rocket Pool Node with Docker](./docker)セクションに進んでください。
Execution ClientまたはConsensus Clientの管理モードを選択するように求められたら、そのセクション内で詳しく説明されている**Externally Managed**オプションを選択してください。

## Dockerを使用しないネイティブ構成

この構成は、Dockerを完全にバイパスします。
Docker経由でSmartnodeスタックを実行する代わりに、各プロセスはローカルシステムサービス(`systemd`経由など)としてインストールされます。
これには、`node`、`watchtower`、`eth1`、`eth2`、および`validator`プロセスが含まれます。

この構成は、Rocket Poolのパラメーター(セキュリティの姿勢、Execution ClientとConsensus Clientの場所、チェーンデータの場所、キーの場所など)を微調整できるため、最も柔軟性があります。
また、セットアップとメンテナンスが最も困難です。

このモードでは、Smartnode Installerはもはや関連しません。
Smartnodeインフラストラクチャ、ETHクライアント、およびvalidatorクライアントを手動でインスタンス化、メンテナンス、アップグレードする責任があります。

::: danger 警告
これを行う方法に関するいくつかのサンプルドキュメントを提供していますが、このモードは**経験豊富なシステム管理者**のみが使用することをお勧めします。
:::

このモードを使用したい場合は、[Configuring a Native Rocket Pool Node without Docker](./native.mdx)セクションに進んでください。
