---
next:
  text: ノードのパフォーマンスの監視
  link: "/ja/node-staking/performance"
---

# 概要

このセクションでは、ノードとvalidatorの健全性を監視し、収益を追跡し、更新などの定期的なメンテナンスを実行する方法について学習します。

## 前提条件

Smartnodeを設定する前に、次のことを確認してください。

- ノードマシン(または仮想マシン)をセットアップし、保護している([ノードの保護](../securing-your-node)ガイドを参照)
- Smartnodeが[インストール](../installing/overview)され、[設定](../config/overview)されている
- Smartnodeにノードウォレットがロードされている
- Execution ClientとConsensus Clientが同期されている
- ノードに[出金アドレス](../prepare-node.mdx#setting-your-withdrawal-address)が準備され、[フォールバッククライアント](../fallback)がセットアップされ(オプション)、[Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)にオプトインし(オプション)、[MEV](../mev.mdx)が設定されている
- 少なくとも1つの[minipool](../create-validator.mdx)を作成している

## ガイド

[ノードのパフォーマンスの監視](../performance)では、ノードの健全性(CPUやRAM消費などのリソースの観点から)とBeacon Chain上のvalidatorのパフォーマンスを監視するためのツールとチュートリアルをいくつか提供しています。
Ethereum validatorとしての在任中に使用する多くの基本的なツールをカバーしています。

[Grafanaダッシュボードのセットアップ](../grafana.mdx)では、SmartnodeスタックのメトリクストラッカーとGrafanaダッシュボードのセットアップについて説明します。これは、ノードとvalidatorに関するすべてを監視するためのワンストップショップであり、各Node Operatorの武器庫の定番です。
Grafanaダッシュボードを探索し、定期的にチェックすることを*強く*お勧めします。

[Smartnodeスタックアラート通知](./alerting.md)では、Smartnodeアラート通知機能を使用して、Rocket Pool Smartnodeの健全性と重要なイベントに関する通知を受信する方法について説明します。

[更新の確認](../updates)では、新しいセキュリティパッチでノードを定期的に更新する重要なプロセス、新しいリリース後にSmartnodeを更新する方法、および選択したクライアントが新しいバージョンをリリースした場合にSmartnodeの最新リリースにまだ含まれていない場合にクライアントバージョンを手動で更新する方法について説明します。
更新がリリースされるたびに参照する必要がある場合があるため、このセクション全体をよく理解しておく必要があります。

[ノードのバックアップ](../backups)は、ハードウェア障害が発生した場合に備えて、ノードの設定とチェーンデータをバックアップする方法を説明するオプションのガイドです。

[Execution Clientのプルーニング](../pruning)は、SSDのディスクスペースを徐々に消費し、定期的なプルーニング(GethやNethermindなど)を必要とするExecution Clientを実行している人にとって**重要**です。
これらのクライアントのいずれかを実行している場合は、プルーニングプロセスをよく理解しておく必要があります。

[ExecutionまたはConsensus Clientの変更](../change-clients)は便利なガイドです。クライアントの選択を変更するプロセスと、プロセス中に期待できることについて説明します。
これは、将来何らかの理由でクライアントを切り替える必要がある場合に備えて、よく理解しておくとよいガイドです。
