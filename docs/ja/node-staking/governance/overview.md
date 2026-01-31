---
next:
  text: The Protocol DAO
  link: "/ja/legacy/houston/pdao#the-protocol-dao-pdao"
---

# 概要

このセクションでは、オンチェーンおよびスナップショット提案に参加するためのノードのセットアップのプロセスを概説します。内容が多いため、[Houston Upgrade](/ja/legacy/houston/whats-new)の概要を読むことを強くお勧めします。これにより、オンチェーンガバナンスを可能にする最新機能と、プロトコルの形成にどのように参加できるかを理解できます。

## 前提条件

Smartnodeを設定する前に、次のことを確認してください。

- ノードマシン（または仮想マシン）をセットアップし、セキュリティを確保していること（[ノードの保護](../securing-your-node)ガイドを参照）
- Smartnodeが[インストール](../installing/overview)され、[設定](../config/overview)されていること
- Smartnodeにノードウォレットが読み込まれていること
- ExecutionとConsensusクライアントが同期されていること
- [withdrawal address](../prepare-node#setting-your-withdrawal-address)でノードをプロビジョニングし、[フォールバッククライアント](../fallback)をセットアップし（オプション）、[Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)にオプトインし（オプション）、[MEV](../mev)を設定していること
- 少なくとも1つの[minipool](../create-validator)を作成していること

## 投票に関与する3つのアドレスがあります

- pDAO Signalling Address — Snapshotアドレスとして使用されます。直接投票したい場合、またはdelegateのSnapshot投票を上書きしたい場合に使用します。このアドレスはSnapshotにのみ使用され、オンチェーン投票には使用されません。

- pDAO Delegate Node — 投票を委任することを選択した場合。これをdelegateのノードアドレスに設定します。delegateを選択すると、彼らはSnapshotとオンチェーン提案の両方であなたのために投票します。

- Node Address — 投票を委任していない場合、またはdelegateのオンチェーン投票を上書きしたい場合、ノードからこれを行うことができます。

## ガイド

[The Protocol DAO](/ja/legacy/houston/pdao#the-protocol-dao-pdao)では、誰がどのようにpDAOがRocket Poolを統治するかについて説明します。このページでは、財務支出などのpDAOの職務をオンチェーンで実行する方法と、まったく新しいSecurity Councilの役割について説明します。また、pDAO提案のライフサイクルを説明し、スパムを防止し、悪意のある提案を撃退するために取られたいくつかの措置を説明します。

[非smartnodeユーザーの投票セットアップ](/ja/legacy/houston/nonsmartnode-setup)は、非smartnodeユーザー（Allnodesユーザーなど）が投票をセットアップする方法を示します。

[投票権の初期化](/ja/legacy/houston/participate#initializing-voting)は、ノードの投票権を初期化する方法を示します。このステップは、Houston Upgrade前にノードが登録された場合にのみ必要です。

[Snapshot Signalling Addressの設定](/ja/legacy/houston/participate#setting-your-snapshot-signalling-address)は、Signalling Addressを設定する手順を説明します。ノードの秘密鍵をホットウォレットに読み込まずに、ノードの投票権を使用してSnapshotで投票できるようになります。Smartnode CLIを準備し、このガイド用にアドレス（ノードウォレットではないもの）を準備してください。

[投票権の委任](/ja/legacy/houston/participate#delegating-voting-power)は、提案に直接投票する代わりに投票権を委任するために使用できる簡単なコマンドです。

[提案の状態の表示](/ja/legacy/houston/participate#viewing-the-state-of-a-proposal)は、過去および進行中のオンチェーン提案のリストを表示する方法に関するガイドです。任意のオンチェーン提案の状態を確認し、詳細を読むことができます。

[提案への投票](/ja/legacy/houston/participate#voting-on-a-proposal)は、オンチェーン提案に投票する方法を示します。このガイドでは、4つのオプション（**Abstain**、**For**、**Against**、**Veto**）についても説明します。

[提案の作成](/ja/legacy/houston/participate#creating-a-proposal)は、オンチェーン提案を提起するための要件と手順を説明します。

[成功した提案の実行](/ja/legacy/houston/participate#executing-a-successful-proposal)は、成功した提案の効果をRocket Poolプロトコルに適用する方法を示します。

[BondとRewardsの請求](/ja/legacy/houston/participate#claiming-bonds-and-rewards)は、ProposerまたはChallengerがbondまたは報酬を請求できる条件について説明します。

[定期的な財務支出の作成と請求](/ja/legacy/houston/participate#creating-a-recurring-treasury-spend)は、pDAOに定期的な支払いの追加、変更、削除を完全に制御する機能を提供します。
