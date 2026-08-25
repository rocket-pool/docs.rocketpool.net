# Migrating from Solo Staking to Rocket Pool

::: danger SOLO VALIDATOR CONVERSION IS NO LONGER POSSIBLE
The [Saturn 1 upgrade](/upgrades/saturn-1/whats-new) removed the ability to convert an existing solo validator directly into a Rocket Pool validator.
Minipools - including the "vacant" minipools that powered solo validator conversion - can no longer be created, and megapool validators can only be created through a fresh Beacon Chain deposit.

To move your stake from solo staking to Rocket Pool, you now **exit your solo validator** and **create new validators under a megapool**.
This page explains what changed and walks you through the new process.
:::

## What Changed in Saturn 1

Before Saturn 1, a solo staker could convert an active validator into a Rocket Pool minipool without exiting it from the Beacon Chain.
The process involved creating a special "vacant" minipool, changing the validator's withdrawal credentials from the original `0x00` BLS credentials to the minipool's address, passing an Oracle DAO scrub check, and finally promoting the minipool.

The Saturn 1 upgrade replaced minipools with [megapools](/node-staking/megapools/overview) as the way new validators are created, and solo validator conversion did not carry over:

- **Minipool creation is disabled at the protocol level**, and that includes vacant minipools. There is no longer a minipool contract you can point an existing validator's withdrawal credentials at.
- **Megapool validators are created through the Rocket Pool deposit queue** with a fresh Beacon Chain deposit: a 1 ETH prestake, followed by the remaining 31 ETH once the protocol has verified the validator's withdrawal credentials on-chain.
  An already-active validator cannot go through this flow, so there is no mechanism for absorbing an existing solo validator into a megapool.
- The Smartnode commands used for conversion (such as `rocketpool node create-vacant-minipool` and `rocketpool minipool promote`) have been removed from the CLI.

In short: the only way to migrate from solo staking today is to **exit your validator from the Beacon Chain and use the withdrawn ETH to create new megapool validators**.

## Why Would I Migrate?

Migration is not for everyone, but Rocket Pool megapool validators enjoy several advantages over conventional solo staking validators:

- They **earn commission** on the portion of ETH they borrow from the pool stakers (28 ETH per validator).
- Your existing 32 ETH stake could be used to create up to **eight megapool validators** (at the current bond of 4 ETH each), earning commission on up to 224 ETH of borrowed ETH.
- They are eligible for participation in the [Smoothing Pool](/node-staking/fee-distrib-sp#the-smoothing-pool), which pools all Execution layer rewards (e.g., from block proposals and [MEV rewards](/node-staking/mev)) and fairly distributes them among participants during each rewards interval.
- If you stake RPL on your megapool, you will earn [voter share rewards](/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (a share of protocol ETH revenue) in addition to RPL inflation rewards, along with voting power in [pDAO governance](/pdao/overview). RPL staking is entirely optional.

That being said, there are some differences that are important to highlight:

- You will have to accept **smart contract risk**, as the protocol is implemented as a series of smart contracts.
- Conventional node operation leverages the **Smartnode stack**; you will have to accept any risks associated with installing and running that software on your node.
- Being a node operator does involve learning some new concepts, so there is a **learning curve** associated with becoming one.
- Megapool validators split their rewards with the pool stakers, so your validators' withdrawal address will be your megapool contract on the Execution layer, **not an EOA that you control**. This also applies to your **fee recipient** for Execution layer rewards.
- **Your capital earns nothing while it is in transit.** Between exiting your solo validator and your megapool validators activating, you will earn no rewards. New megapool validators must pass through the Rocket Pool deposit queue _and_ the Beacon Chain queue before they begin attesting, so read the [Timing Considerations](#timing-considerations) section below before you exit anything.

We encourage you to carefully go through these pros and cons before deciding to migrate.
If you would like to continue with the process, the steps are described below.

## Step 1: Exit Your Solo Validator

The first step is to exit your solo validator from the Beacon Chain and withdraw its balance:

1. If your validator still has `0x00` BLS withdrawal credentials, you must first [update them to Execution layer withdrawal credentials](https://launchpad.ethereum.org/en/withdrawals) that point to an address you control. Without this, your ETH cannot be withdrawn after the exit.
1. Submit a **voluntary exit** for the validator. You can do this with your Consensus / Validator client; consult the documentation for your client for specifics.
1. Wait for the validator to pass through the Beacon Chain exit queue and for its full balance to be swept to your withdrawal address.

::: warning WARNING
A voluntary exit is **irreversible**. Once your validator has exited, it can never validate again - the only way back is to create a new validator.
Make sure you have read this entire page (especially the [Timing Considerations](#timing-considerations) section) before exiting.
:::

[validatorqueue.com](https://www.validatorqueue.com/) is a helpful site for checking the current length of the Beacon Chain exit queue.

## Step 2: Set Up a Rocket Pool Node

While you wait for your exit to process, you can prepare your Rocket Pool node.

If you are new to Rocket Pool node operation, start with the [Node Operator's guide](/node-staking/responsibilities), which covers everything from hardware selection to [installing the Smartnode stack](/node-staking/installing/overview) and [registering your node](/node-staking/prepare-node).
Since you have been running your own validator, much of this will feel familiar - and if you already run your own Execution and Consensus clients, you may be interested in the [Hybrid configuration with external clients](/node-staking/install-modes#the-hybrid-configuration-with-external-clients).

## Step 3: Create Your Megapool Validators

Once your withdrawn ETH is in hand, you're ready to create megapool validators using `rocketpool megapool deposit`.
Each validator currently requires a **4 ETH bond** and borrows **28 ETH** from the staking pool, so your 32 ETH of withdrawn stake could fund up to **eight megapool validators**.
Your megapool contract is deployed automatically with your first validator deposit, and every validator you create afterwards is managed by that same megapool.

The [Creating a Megapool (Validator)](/node-staking/megapools/create-megapool-validator) guide walks you through the whole process step-by-step, including how the deposit queue works and how to confirm a successful stake.

::: tip NOTE
Unlike the old conversion process, your new validators will use **new validator keys** generated from your Smartnode wallet.
Your old solo validator keys are not reused, and the Smartnode's Validator Client will manage the new keys for you - there is no key import step.
:::

## Timing Considerations

The old conversion process had no downtime: your validator kept attesting throughout.
The new migration path does involve downtime, so it pays to understand the queues involved before you exit your solo validator:

1. **The Beacon Chain exit queue**, which determines how quickly your solo validator can exit and be withdrawn.
1. **The Rocket Pool deposit queue**, which determines when your new validators are matched with borrowed ETH from the deposit pool. Express queue tickets were distributed to existing node operators based on ETH bonded in legacy minipools; new nodes currently receive none, so a former solo staker's validators will join the **standard queue**.
1. **The Beacon Chain deposit queue**, which megapool validators pass through **twice**: once for the 1 ETH prestake, and again for the remaining 31 ETH stake after the protocol verifies the validator's withdrawal credentials.

You earn no rewards from the moment your solo validator exits until your megapool validators are activated, so check the queues before committing.

::: tip Useful Links
[validatorqueue.com](https://www.validatorqueue.com/) is a helpful site for checking the length of the Beacon Chain queue. This queue is contingent on the amount of ETH entering and leaving the Beacon Chain.
:::

If the deposit queue turns out to be longer than you'd like, you can [exit a validator from the Rocket Pool deposit queue](/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) at any time before it is assigned ETH and receive your bond back as [deposit credit](/node-staking/megapools/credit), which is redeemable for rETH.

## Alternative: Staking Without Running a Node

If, after weighing the trade-offs, you'd rather not run a node at all, you can simply stake your withdrawn ETH with [rETH](/liquid-staking/overview) - Rocket Pool's liquid staking token - and earn staking rewards without any hardware, maintenance, or queues on your end.
