---
next:
  text: Starting Rocketpool
  link: "/ja/node-staking/starting-rp"
---

# 概要

このセクションでは、Smartnodeをインストールして設定した後、Rocket Poolでステーキングするためにノードをプロビジョニングする方法の詳細について説明します。
ステーキングに関する多くの情報があるため長い内容となっていますが、**最初のminipoolを作成する前に各ガイドをよくお読みください！**

## 前提条件

ステーキング用にノードをプロビジョニングする前に、以下を完了していることを確認してください。

- ノードマシン（または仮想マシン）をセットアップして保護している（[ノードのセキュリティ確保](../securing-your-node)ガイドを参照）
- Smartnodeが[インストール](../installing/overview)され、[設定](../config/overview)されている

## ガイド

[Rocket Poolの起動](../starting-rp)では、各モードでSmartnodeサービスを起動する方法と、ExecutionクライアントとConsensusクライアントの同期進行状況を確認する方法を説明します。

[新しいウォレットの作成](../wallet-init)では、初めてノードをセットアップする場合にSmartnodeで新しいウォレットを作成するプロセスを説明します。

[既存のウォレットのインポート/復元](../recovering-rp.mdx)は、新しいウォレットを作成する代わりの方法です。
既に復元したいノードウォレットがある場合（またはAllnodesのようなサービスから自分のハードウェアに移行する場合）は、このガイドを使用してください。

[ノードの運用準備](../prepare-node.mdx)では、ウォレットをノードにロードした後、ETHやRPLで資金を供給する前（もちろんガス代のための少額のETHを除く）に実行したい重要な最初のステップについて説明します。

[フォールバックノードの指定](../fallback)では、プライマリクライアントがダウンした場合にバックアップとして機能できるように、外部管理されたExecutionクライアントとConsensusクライアントのペアをノードに指定するオプションのプロセスを説明します。これにより、メンテナンス中もノードは検証を続けることができます。

[Fee DistributorsとSmoothing Pool](../fee-distrib-sp)では、validatorがブロックを提案するたびにノードにExecution layerの報酬が提供される方法、それらの報酬を収集する方法、そしてRocket Poolの**Smoothing Pool**について説明します。これは、全員からのExecution layer報酬を組み合わせて、Rocket Poolの定期的な報酬インターバル中に均等に分配する人気の機能です。

[MEV、MEV-Boost、MEV報酬](../mev.mdx)では、**Maximum-Extractable Value**（MEV）、ステーキングエコシステムにおけるその役割、そしてSmartnodeを使用してお好みに応じて設定する方法について説明します。
