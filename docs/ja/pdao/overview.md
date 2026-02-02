---
next:
  text: The Protocol DAO
  link: "/ja/pdao/pdao"
---

# 概要

このセクションでは、オンチェーンおよびsnapshotプロポーザルに参加するためのノード設定プロセスを説明します。理解すべき内容が多いため、[Houston Upgrade](/ja/legacy/houston/whats-new)の概要を読むことを強くお勧めします。これにより、オンチェーンガバナンスを可能にする最新機能と、プロトコルの形成にどのように参加できるかを理解できます。

## 前提条件

Smartnodeを設定する前に、以下を確認してください:

- ノードマシン(または仮想マシン)をセットアップし、セキュリティ保護を完了している([ノードのセキュリティ保護](/ja/node-staking/securing-your-node)ガイドを参照)
- Smartnodeを[インストール](/ja/node-staking/installing/overview)し、[設定](/ja/node-staking/config/overview)している
- Smartnodeにノードウォレットを読み込んでいる
- ExecutionクライアントとConsensusクライアントを同期している
- ノードに[出金アドレス](/ja/node-staking/prepare-node#setting-your-withdrawal-address)を設定し、[フォールバッククライアント](/ja/node-staking/fallback)を設定し(オプション)、[Smoothing Pool](/ja/node-staking/fee-distrib-sp#the-smoothing-pool)にオプトイン(オプション)し、[MEV](/ja/node-staking/mev)を設定している
- 少なくとも1つの[minipool](/ja/node-staking/create-validator)を作成している

## 投票に関わる3つのアドレス

- pDAO Signalling Address — 直接投票したい場合、または委任先のsnapshot投票を上書きしたい場合に、snapshotアドレスとして使用されます。このアドレスはsnapshotでのみ使用され、オンチェーン投票には使用されません。

- pDAO Delegate Node — 投票を委任する場合に使用します。委任先のノードアドレスを設定します。委任先を選択すると、その委任先がsnapshotおよびオンチェーンプロポーザルであなたの代わりに投票します。

- Node Address — 投票を委任していない場合、または委任先のオンチェーン投票を上書きしたい場合、ノードから投票できます。

## ガイド

[The Protocol DAO](/ja/pdao/pdao)では、pDAOが誰でどのようにRocket Poolを統治しているかを説明します。このページでは、財務支出などのpDAOの任務をオンチェーンで実行する方法と、まったく新しいSecurity Councilの役割について説明します。また、pDAOプロポーザルのライフサイクルを説明し、スパムを防止し、悪意のあるプロポーザルを阻止するために講じられている措置についても説明します。

[Voting setup for non-smartnode users](/ja/legacy/houston/nonsmartnode-setup)では、非smartnodeユーザー(Allnodesユーザーなど)が投票を設定する方法を説明します。

[Initializing Voting Power](/ja/pdao/participate#initializing-voting)では、ノードの投票権を初期化する方法を説明します。このステップは、Houston Upgradeの前にノードを登録した場合にのみ必要です。

[Setting your Snapshot Signalling Address](/ja/pdao/participate#setting-your-snapshot-signalling-address)では、Signalling Addressを設定する手順を説明します。これにより、ノードの秘密鍵をホットウォレットに読み込むことなく、ノードの投票権を使用してsnapshotで投票できるようになります。このガイドには、Smartnode CLIと、ノードウォレットではないアドレスを準備してください。

[Delegating Voting Power](/ja/pdao/participate#delegating-voting-power)は、プロポーザルに直接投票する代わりに投票権を委任するために使用できる簡単なコマンドです。

[Viewing the State of a Proposal](/ja/pdao/participate#viewing-the-state-of-a-proposal)では、過去および進行中のオンチェーンプロポーザルのリストを表示する方法を説明します。特定のオンチェーンプロポーザルの状態を確認し、詳細を読むことができます。

[Voting on a Proposal](/ja/pdao/participate#voting-on-a-proposal)では、オンチェーンプロポーザルに投票する方法を説明します。このガイドでは、4つのオプション:**Abstain**、**For**、**Against**、**Veto**についても説明します。

[Creating a Proposal](/ja/pdao/participate#creating-a-proposal)では、オンチェーンプロポーザルを提起するための要件と手順を説明します。

[Executing a successful proposal](/ja/pdao/participate#executing-a-successful-proposal)では、成功したプロポーザルの効果をRocket Poolプロトコルに適用する方法を説明します。

[Claiming Bonds and Rewards](/ja/pdao/participate#claiming-bonds-and-rewards)では、提案者またはチャレンジャーがボンドまたは報酬を請求できる条件について説明します。

[Creating and Claiming a recurring treasury spend](/ja/pdao/participate#creating-a-recurring-treasury-spend)は、pDAOが定期支払いの追加、変更、削除を完全に制御できる機能です。
