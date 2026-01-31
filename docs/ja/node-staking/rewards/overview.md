---
next:
  text: Claiming Node Operator Rewards
  link: "/ja/node-staking/rewards"
---

# 概要

このセクションでは、検証中にノードが生成する報酬にアクセスする方法について説明します。

## 前提条件

Smartnodeを設定する前に、以下を確認してください。

- ノードマシン（または仮想マシン）をセットアップして保護している（[ノードのセキュリティ確保](../securing-your-node)ガイドを参照）
- Smartnodeが[インストール](../installing/overview)され、[設定](../config/overview)されている
- Smartnodeにノードウォレットがロードされている
- ExecutionクライアントとConsensusクライアントが同期されている
- [withdrawal address](../prepare-node.mdx#setting-your-withdrawal-address)でノードをプロビジョニングし、[fallbackクライアント](../fallback)を設定し（オプション）、[Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)にオプトイン（オプション）し、[MEV](../mev.mdx)を設定している
- 少なくとも1つの[minipool](../create-validator.mdx)を作成している

## ガイド

[Node Operator報酬の請求](../rewards)では、RPL報酬とExecution layer報酬の仕組みと、それらにアクセスする方法について説明します。

[Skimされた報酬の分配](../skimming)では、プロトコルによって定期的に「skimmed」され、minipoolに配信されるBeacon Chainからの報酬へのアクセスについて説明します。
