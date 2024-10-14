---
next:
  text: The Protocol DAO
  link: "/guides/houston/pdao#the-protocol-dao-pdao"
---

# Overview

This section outlines the process of setting up your node to participate in on-chain and snapshot proposals. There's a lot to unpack, so we highly recommend reading through an overview of the [Houston Upgrade](/guides/houston/whats-new). This will help you understand the latest features that enable on-chain governance and how you can participate in shaping the protocol.


## Prerequisites

Before configuring your Smartnode, please make sure you:

- Have set up a node machine (or virtual machine) and secured it (via the [Securing your Node](../securing-your-node) guide)
- Have the Smartnode [installed](../installing/overview) and [configured](../config/overview) on it
- Have a node wallet loaded on your Smartnode
- Synced your Execution and Consensus clients
- Provisioned your node with [a withdrawal address](../prepare-node#setting-your-withdrawal-address), set up your [fallback clients](../fallback) (optional), opted into the [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optional), and configured [MEV](../mev)
- Created at least one [minipool](../create-validator)

## Guides

[The Protocol DAO](/guides/houston/pdao#the-protocol-dao-pdao) discusses who and how the pDAO governs Rocket Pool. This page will fill you in on how pDAO duties such as treasury spends can be executed on-chain, along with the role of the all new Security Council. It'll also walk you through the lifecycle of a pDAO proposal and explain some of the measures taken to prevent spam and gun down malicious proposals.


## There are three addresses involved in voting:

- pDAO Signalling Address — will be used as your Snapshot address, if you want to vote directly or if you want to override your delegate’s Snapshot vote. This address is only used for Snapshot not on-chain voting. 

- pDAO Delegate Node — if you choose to delegate your vote. You will set this to your delegate’s node address. If you choose a delegate they will vote for you on Snapshot and for on-chain proposals.

- Node Address — if you have not delegated your vote or if you wish to override your delegate’s on-chain vote you can do this from your node. 

[Setting your Snapshot Signalling Address](/guides/houston/participate#setting-your-snapshot-signalling-address) will walk you through the steps for setting a Signalling Address. It'll allow you to vote on Snapshot using your node's voting power without needing to load your node's private key onto a hot wallet. Make sure you have your Smartnode CLI handy and prepare a address (that isn't your node wallet) for this guide. 

[Delegating Voting Power](/guides/houston/participate#delegating-voting-power) is a quick command you can use to delegate voting power instead of voting directly on proposals.

[Viewing the State of a Proposal](/guides/houston/participate#viewing-the-state-of-a-proposal) is a guide on how you can view a list of past and ongoing on-chain proposals. You'll be able to check the state and read up on the details of any given on-chain proposal.

[Voting on a Proposal](/guides/houston/participate#voting-on-a-proposal) shows you how cast a vote on an on-chain proposals. This guide also goes over the four options: **Abstain**, **For**, **Against**, and **Veto**.

