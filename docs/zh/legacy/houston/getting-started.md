# Houston Quick-Start

Whether you're a seasoned Node Operator, rETH holder or curious onlooker, this page will help you get started with exploring the new features included in Houston.

##

### Initializing Voting Power

First and foremost, the most important step if you are **Node Operator** is to [initialize voting](../houston/participate#initializing-voting) to unlock your voting power. Nodes who've initialized voting are included when the network's total voting power is calculated.

At the genesis of Houston, pDAO voting is disabled until a sufficient number of nodes have initialized voting. This is to prevent rogue proposals from passing while total voting power and quorum is low. After enough nodes have initialized voting, a switch will be flipped and pDAO will have the helm.

To initialize voting power, use this command in the smartnode:

```shell
rocketpool pdao initialize-voting
```

You only need to do this once. Initializing voting will ensure that your node's voting power is included in future on-chain proposals and allow you to vote on them.

### Setting your Snapshot Signalling Address

Secondly, you'll want to set your snapshot signalling address. This allows node operators to participate in Snapshot votes in their browser or mobile device without having to expose their node keys to a hot wallet.

Setting this up involves a handful of steps, so you'll want to follow this guide:
[Setting your Snapshot Signalling Address](../houston/participate#setting-your-snapshot-signalling-address).

### Delegating on-chain Voting Power

If you want to delegate on-chain voting power to a community member of your choosing, click [here](../houston/participate#delegating-voting-power) to learn how.

##

# Guides

[Full Houston Overview](../houston/whats-new) presents the fully on-chain Protocol DAO and introduces new features such as staking ETH on behalf of a node, setting an RPL withdrawal address, and time based balance and RPL submissions. Houston smart contract audits can be found here as well.

[The Protocol DAO](../houston/pdao) discusses who and how the pDAO governs Rocket Pool. This page will fill you in on how pDAO duties such as treasury spends can be executed on-chain, along with the role of the all new Security Council. It'll also walk you through the lifecycle of a pDAO proposal and explain some of the measures taken to prevent spam and gun down malicious proposals.

[Participating in Proposals](../houston/participate) includes a detailed step-by-step guide on how Node Operators can participate in pDAO proposals. If you're keen on raising an on-chain proposal, voting or delegating voting power, this is the guide for you.

[Stake Eth on Behalf of a Node](../houston/stake-eth-on-behalf.mdx) goes over the steps for staking ETH on behalf of a node. It's a new feature introduced in Houston to facilitate single depositor scenarios. We'll walk through how to do this on a testnet if you want to try it out before staking real ETH on mainnet.

[RPL Withdrawal Address](../houston/rpl-withdrawal-address) shows you how to set an RPL withdrawal address for your node. This is useful if you want to enable a separate entity to supply the RPL insurance collateral for a node.
