# A Node Operator's Responsibilities

## How Ethereum Staking Works

As a reminder, staking in Proof of Stake is done via **validators**.
A validator is essentially a single Beacon Chain address to which 32 ETH was deposited on the Execution layer.
Validators are responsible for maintaining the consistency and security of the Beacon Chain.
They do this by listening for transactions and new block proposals and **attesting** that the proposed block contains legal, valid transactions by doing some number crunching and verification behind the scenes.
Occasionally, they get to propose new blocks themselves.

Validators are assigned attestations and block proposals **on a randomized schedule**.
This is very different from the old Proof of Work system, where everyone was constantly trying to race each other and come up with the next block before everyone else.
This means that unlike Proof of Work where miners weren't guaranteed to earn a block reward unless they found the next block, Proof of Stake validators _are_ guaranteed to have slow, steady income as long as they perform their duties.
If a validator is offline and misses an attestation or a block proposal, it will be **slightly penalized**.
The penalties are quite small though; as a rule of thumb, if a validator is offline for X hours, it will make all of its lost ETH back after the same X hours of being back online.

### Rewards

Validators earn consensus layer rewards from Attestation, Block Proposals, Sync Committees (rare), and Slashing Rewards (vanishingly rare). They also earn execution layer rewards from Priority Fees and MEV.

As of 5/2026, overall APR is ~2.84%, with 2.63% being consensus layer APR, and 0.22% being execution layer APR. One place to find this info is the [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Penalties

Validators are penalized for small amounts of ETH if they are offline and fail to perform their assigned duties.
This is called **leaking**.
If a validator violates one of the core rules of the Beacon chain and appears to be attacking the network, it may get **slashed**.
Slashing is a forceful exit of your validator without your permission, accompanied by a relatively large fine that removes some of your validator's ETH balance.

Realistically, the only condition that can cause a slashing is if you run your validator's keys on two nodes at the same time (such as a failover / redundancy setup, where your backup node accidentally turns on while your main node is still running).
Don't let this happen, and **you won't get slashed**.
Slashing _cannot occur_ from being offline for maintenance.

Below is a table that shows the penalties that can happen to a validator:

| Type                  | Layer     | Amount                                                                            |
| --------------------- | --------- | --------------------------------------------------------------------------------- |
| Missed Attestation    | Consensus | -0.000011 ETH\* per attestation (-9/10 the value of a normal attestation reward)  |
| Missed Proposal       | Consensus | 0                                                                                 |
| Missed Sync Committee | Consensus | -0.00047 ETH\* per epoch (-0.1 ETH total if offline for the whole sync committee) |
| Slashing              | Consensus | At least 1/32 of your balance, up to your entire balance in extreme circumstances |

\*_Varies based on the total number of validators in the network.
Approximated for 435,000 active validators._

::: tip TIP
As a rule of thumb, if you're offline for X hours (and you aren't in a sync committee), then you'll make all of your leaked ETH back after X hours once you're back online and attesting.
:::

## How Rocket Pool Nodes Work

Unlike solo stakers, who are required to put 32 ETH up for deposit to create a new validator, Rocket Pool nodes only need to deposit 4 ETH per validator (called "bonded ETH").
This will be coupled with 28 ETH from the staking pool (called "borrowed ETH", which comes from liquid staker deposits in exchange for rETH) to create a new megapool validator.

To the Beacon chain, a megapool validator looks exactly the same as a normal validator.
It has the same responsibilities, same rules it must follow, same rewards, and so on.
The only difference is in how the megapool validator was created on the execution layer, and how withdrawals work when the node operator decides to voluntarily exit the megapool validator.
All of the creation, withdrawing, and rewards delegation is handled by Rocket Pool's **smart contracts** on the Ethereum chain.
This makes it completely decentralized.

A Rocket Pool **Node** is a single computer with an Ethereum wallet that was registered with Rocket Pool's smart contracts.
The node can then create as many megapool validators as it can afford, all running happily on the same machine together.
**A single Rocket Pool node can run many, many megapool validators.**
Each megapool validator has a negligible impact on overall system performance; some people have been able to run hundreds of them on a single node.

A megapool validator's upfront cost is 4 ETH. In addition, a node operator may optionally stake RPL to their node to qualify for additional rewards and to gain voting power within the protocol DAO.

## Rocket Pool Node Operators

**Node operators** are the heart and soul of Rocket Pool.
They are the individuals that run Rocket Pool nodes.

### Responsibilities

They put ETH from the staking pool to work by running megapool validators with it, which earn staking rewards for the Rocket Pool protocol (and thus, increase rETH's value).
Their job is straightforward, but crucially important: _run validators with the highest quality possible, and maximize staking rewards_.

Node operators are responsible for:

- Setting up a computer (either physical or virtual)
- Configuring it correctly, including their home network if applicable
- Installing Rocket Pool on it and setting up validators to perform validation
- Securing it, both from outside and inside threats
- Maintaining it for the life of their validators

It's a big responsibility, and not a simple set-it-and-forget-it kind of job; you need to care for your node for as long as it's staking.
With great responsibility, however, comes great rewards.

### Rewards

Here are the major benefits of running a Rocket Pool node:

- You earn your portion of each validator's ETH rewards, plus commission.
  - You run a validator with only 4 ETH of your own capital, with the remaining 28 ETH sourced from liquid stakers.
  - Each megapool validator earns 5% commission on rewards generated from the 28 protocol ETH. This comes to 35% more than solo staking (`(4 bonded + 28 borrowed * 0.05) / 4 = 1.35`).
  - By joining the [Smoothing Pool](fee-distrib-sp#the-smoothing-pool), you share execution layer rewards (priority fees and MEV) with other participants, providing more consistent returns instead of relying on the luck of block proposals.
- Staking RPL earns you additional rewards.
  - RPL stakers earn a [share of protocol commission](megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (paid in ETH) proportional to their staked RPL.
  - You also earn issuance rewards (paid in RPL) on the RPL you stake.
    - At the end of a period (every 28 days), there's a snapshot of your RPL.
    - You can earn max yield on RPL **up to 15%** of the value of your total borrowed ETH.
    - You will earn yield on RPL beyond 15%, at a decreasing level.
  - You will get vote power based on the square root of your staked RPL, up to 150% of your bonded ETH.

### Limitations

There are some limitations that come along with the rewards above:

- If your node performs poorly and you actually end up losing ETH by the time you decide to exit your megapool validator, all of the lost ETH is coming out of your share.
  - For example: if you exit with a balance of 31 ETH, then your megapool validator lost 1 ETH from its initial 32 ETH deposit. You will receive 3 ETH, and 28 ETH will be returned to the staking pool.
- Your staked RPL will be less liquid:
  - There's no limit on how much megapool staked RPL you can unstake, but you must wait 28 days after initiating unstaking before withdrawal. This prevents users from gaming the rewards system by staking RPL just in time for the 28-day rewards period, then withdrawing it immediately after the period. 

### You've got this

If you're fairly new to using the command line or computer maintenance, this can seem like a scary challenge.
Luckily, one of Rocket Pool's most core principles is _decentralization_ - the fact that anyone, anywhere, can run a node if they have the determination and knowledge.
While we can't help with determination, we _can_ help with knowledge.
This section is packed with guides, walkthroughs, and information that will help you understand how to run a great Rocket Pool node.
