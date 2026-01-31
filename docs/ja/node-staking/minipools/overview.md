---
next:
  text: 新しいMinipoolの作成（Validator）
  link: "/ja/node-staking/create-validator"
---

::: danger 警告
Saturn 1の準備のため、現在minipoolの入金は無効になっています。
:::

# 概要

このセクションでは、minipoolの作成と移行プロセス（Rocket Pool validator）について説明します。
ここでは、Ethereumネットワークの検証を開始し、報酬を獲得する方法を学びます。

## 前提条件

minipoolを実行する前に、以下を確認してください。

- ノードマシン（または仮想マシン）をセットアップし、セキュリティを確保していること（[ノードのセキュリティ確保](../securing-your-node)ガイドを参照）
- Smartnodeを[インストール](../installing/overview)し、[設定](../config/overview)していること
- Smartnodeにノードウォレットをロードしていること
- ExecutionクライアントとConsensusクライアントを同期していること
- ノードに[出金アドレス](../prepare-node.mdx#setting-your-withdrawal-address)をプロビジョニングし、[フォールバッククライアント](../fallback)を設定し（オプション）、[Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)にオプトインし（オプション）、[MEV](../mev.mdx)を設定していること

## ガイド

[新しいMinipoolの作成（Validator）](../create-validator.mdx)では、新しいRocket Pool minipoolと対応するBeacon Chain上のvalidatorを作成するプロセスを説明します。
初めてのminipoolを作成する場合でも、既にいくつか持っていて別のものを作成したい場合でも、このガイドがステップバイステップで説明します。

[Minipool Delegate](./delegates)では、minipoolコントラクトとは何か、そしてその機能のほとんどを含む**delegate**コントラクトについて説明します。
また、ネットワークアップグレード後に新機能を利用するため、minipoolのdelegateを更新する方法も示します。

[Solo ValidatorをMinipoolに変換する](../solo-staker-migration)では、Rocket Pool外の既存のvalidator（ソロステーキングに使用しているものなど）をBeacon Chainから退出せずに、新しいminipoolを作成することなく直接Rocket Pool minipoolに変換するプロセスを説明します。
この機能を利用したいソロステーカーの方は、このガイドをご覧ください！

[16-ETH Minipoolを8-ETHに移行する](../leb-migration.mdx)では、minipoolのボンドされたETH量を16 ETHから8 ETHに削減する方法を示します。これにより、無料で新しいminipoolを作成するために使用できる8 ETHのクレジットが得られます（ただし、ガス代は必要です）。

[デポジットクレジットシステム](../credit)では、上記の移行のいずれかを実行した後、ETHボンドを支払うことなく新しいminipoolを作成できる「ETH Credit」システムについて説明します。
