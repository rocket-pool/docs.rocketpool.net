---
next: 
  text: Claiming Node Operator Rewards 
  link: "/guides/node/rewards"
---

# Overview

This section covers how to access the rewards your node generates while validating.

## Prerequisites

Before configuring your Smartnode, please make sure you:

- Have set up a node machine (or virtual machine) and secured it (via the [Securing your Node](../securing-your-node) guide)
- Have the Smartnode [installed](../installing/overview) and [configured](../config/overview) on it
- Have a node wallet loaded on your Smartnode
- Synced your Execution and Consensus clients
- Provisioned your node with [a withdrawal address](../prepare-node#setting-your-withdrawal-address), set up your [fallback clients](../fallback) (optional), opted into the [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (optional), and configured [MEV](../mev)
- Created at least one [minipool](../create-validator)

## Guides

[Claiming Node Operator Rewards](../rewards) explains how RPL rewards and Execution-layer rewards work, and how to access them.

[Distributing Skimmed Rewards](../skimming) covers accessing rewards from the Beacon Chain that periodically get "skimmed" by the protocol and delivered to your minipools.
