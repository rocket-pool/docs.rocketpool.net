# Houston Quick-Start

Whether you're a seasoned Node Operator, rETH holder or curious onlooker, this page will help you get started with exploring the new features included in Houston.


## Initializing Voting Power:

First and foremost, the most important step if you are **Node Operator** is to [initialize voting](../houston/participate#initializing-voting) to unlock your voting power. Nodes who've initialized voting are included when the network's total voting power is calculated. 

At the genesis of Houston, pDAO voting is disabled until a sufficient number of nodes have initialized voting. This is to prevent rogue proposals from passing while total voting power and quorum is low. After enough nodes have initialized voting, a switch will be flipped and pDAO will have the helm. 

To initialize voting power, use this command in the smartnode: 
```shell
rocketpool pdao initialize-voting
```
You only need to do this once. Initializing voting will ensure that your node's voting power is included in future on-chain proposals and allow you to vote on them.


## Guides

[Full Houston Overview](../houston/whats-new) presents the fully on-chain Protocol DAO and introduces new features such as staking ETH on behalf of a node, setting an RPL withdrawal address, and time based balance and RPL submissions. Houston smart contract audits can be found here as well. 

[The Protocol DAO](../houston/pdao) discusses who and how the pDAO governs Rocket Pool. This page will fill you in on how pDAO duties such as treasury spends can be executed on-chain and the role of the all new Security Council. It'll also walk you through the lifecycle of a pDAO proposal and go over the challenge process for Node Operators who are interested in contributing to gunning down malicious proposals.

[Participating in Proposals](../houston/participate) includes a detailed step-by-step guide on how Node Operators can participate in pDAO proposals. If you're keen on raising an on-chain proposal, voting or delgating voting power, this is the guide for you. If you just want to delegate your voting power, click [here](../houston/participate#delegating-voting-power).

[Stake Eth on Behalf of a Node](../houston/stake-eth-on-behalf) goes over the steps for staking ETH on behalf of a node. It's a new feature introduced in Houston to facilitate single depositor scenarios. We'll walk through how to do this a testnet if you want to try it out before risking real ETH

[RPL Withdrawal Address](../houston/rpl-withdrawal-address) shows you how to set an RPL withdrawal address for your node. This is useful if you want to enable a seperate entity to supply the RPL insurance collateral for a node.
