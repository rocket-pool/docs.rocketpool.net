# Fee Distributors and the Smoothing Pool

Node operators receive **priority fees** (**tips**) from the transactions they include in any blocks that they propose to the Ethereum chain.
These fees come from and stay on the Execution layer.

Unlike most validation rewards which are generated on the Consensus layer and automatically withdrawn periodically, these fees are _immediately liquid_.
In general, priority fees provide almost as much ETH to you as Beacon Chain rewards do, so they are a very nice benefit of the Merge.

::: tip NOTE
As a quick reminder here's a breakdown of the different types of rewards and which layer they're provided on:

- Consensus Layer: attestations, block proposals, sync committees, slashing reports
- Execution Layer: priority fees and MEV (discussed in the next section) from block proposals

:::

## Fee Recipients

When you propose a block on the Ethereum chain, the protocol needs to know where to send the tips from each transaction included in your block.
It can't send them to your validator's address, because that's on the Consensus layer - not the Execution layer.
It can't send them to your minipool address, because it has to work for solo stakers too and solo stakers don't have an address on the Execution layer attached to their validators the way Rocket Pool does.

Instead, the way it works is fairly straightforward: when Rocket Pool starts up your Validator Client, it passes in an argument called the **fee recipient**.
The fee recipient is simply an address on the Execution layer where you want the tips to go.

Your node's `fee recipient` can be one of the following special contracts:

- Your node's own personal **Fee Distributor**
- Your node's megapool contract
- The **Smoothing Pool** (opt-in)

The Smart Node will automatically set the correct fee recipient based on your configuration:

| Smoothing Pool Status | Has Megapool Validators | Has Minipools | Fee Recipient                                                                                                                                                                                                     |
| --------------------- | ----------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Opted In              | No                      | Yes           | Smoothing Pool address                                                                                                                                                                                            |
| Opted In              | Yes                     | No            | Smoothing Pool address                                                                                                                                                                                            |
| Opted In              | Yes                     | Yes           | Smoothing Pool address (all validators)                                                                                                                                                                           |
| Opted Out             | No                      | Yes           | Fee Distributor contract address                                                                                                                                                                                  |
| Opted Out             | Yes                     | No            | Megapool contract address                                                                                                                                                                                         |
| Opted Out             | Yes                     | Yes           | Megapool validators → Megapool address<br>Minipool validators → Fee Distributor address<br>(Set per validator via [keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient)) |

Rocket Pool is designed to fairly distribute these rewards between you and the rETH pool stakers, the same way it fairly distributes your Beacon chain rewards: your portion of any priority fees your minipool validators earn will go to you (plus the average commission of all of your minipools), and the remaining portion will go to the pool stakers (minus your average commission).
The exact portion depends on the number of 8 ETH-bonded, 16 ETH-bonded minipools, and 4 ETH-bonded megapool validators you have.

In brief, the **Fee Distributor** is a unique contract attached to your node that collects and fairly splits your priority fees between you and the rETH stakers.
It's like your own personal vault for priority fees.
Anyone (including you) can distribute its balance at any time to ensure that the rewards are always available to rETH stakers.

The **Smoothing Pool** is a special opt-in contract that allows all participating node operators to aggregate and pool their priority fees together, and distributes them evenly among the participants during each Rocket Pool rewards interval (currently every 28 days) and the rETH pool stakers.
This is a very compelling feature for node operators that don't want to worry about the luck factor involved in getting block proposals with high priority fees, and would rather have a nice, regular, consistent set of monthly earnings.

We'll cover both of these below so you understand the difference and whether or not you want to join the Smoothing Pool.

::: tip NOTE
For minipools created after 2024-10-28, the smoothing pool is STRONGLY recommended, as it is used to distribute bonus commission. If you opt out of the smoothing pool, these minipools will get 5% commission total. If you opt into the smoothing pool, these minipools will get between 10% (no RPL staked) and 14% (RPL stake is valued at 10% of borrowed ETH or more) commission.
:::

## Your Fee Distributor

Your Fee Distributor is a unique contract on the Execution Layer that's **specific to your node**.
It will hold all of the priority fees you've earned over time, and it contains the logic required to fairly split and distribute them to the rETH pool stakers and your withdrawal address.
This distribution process **can be called by anyone** (including rETH stakers), and can be done **at any time**.
It does not have a time limit before rewards expire.

The address for your node's Fee Distributor is **deterministically based on your node address**.
That means it is known ahead of time, before the Fee Distributor is even created.

New Rocket Pool nodes will automatically create (initialize) their node's Fee Distributor contract upon registration.
This only needs to be run once.

One interesting ramification of this is that your Distributor's address may start accruing a balance **before** you've initialized your Fee Distributor contract.
This is okay, because your Distributor will gain access to all of this existing balance as soon as you initialize it.

### Viewing its Address and Balance

You can view your fee distributor's address and balance as part of:

```shell
rocketpool node status
```

The output will look like this:

![](../node-staking/images/status-fee-distributor.png)

### Claiming fees from your Fee Distributor

You can claim and distribute the entire balance of your fee distributor using the following command:

```shell
rocketpool node distribute-fees
```

This will send your share of the rewards to your **withdrawal address**.

::: warning NOTE ON TAXABLE EVENTS
Whenever you create a new minipool, Rocket Pool will automatically call `distribute-fees`.
This is to ensure that whatever fees you had accumulated are distributed using your node's average commission, which could change when you create the new minipool. This does not apply to megapool validator creation.

Also, note that anyone can call `distribute-fees` on your fee distributor (to prevent you from holding rETH rewards hostage).
You may have a taxable event whenever this method is called.

Please keep these conditions in mind when deciding whether or not to use the Smoothing Pool (discussed below).
:::

### The Penalty System

To ensure that node operators don't "cheat" by manually modifying the fee recipient used in their Validator Client, Rocket Pool employs a penalty system.

The Oracle DAO are able to penalise node operators that do not follow the protocol rules.

If a node is _opted out_ of the Smoothing Pool, the following addresses are considered valid fee recipients:

- The rETH address
- The Smoothing Pool address
- The node's fee distributor contract
- The node's megapool contract

If a node is _opted in_ to the Smoothing Pool, the following address is considered a valid fee recipient:

- The Smoothing Pool address

A fee recipient other than one of the valid addresses above is considered to be **invalid**.

The Smart Node software automatically sets the correct fee recipient based on your configuration (whether you're opted into the Smoothing Pool, and whether you have megapool validators, minipools, or both). For nodes with both megapool validators and minipools while opted out, the fee recipient is set per validator using the keymanager API. The full list of conditions are summarized [here](/node-staking/fee-distrib-sp#fee-recipients).

The Smartnode software is designed to ensure honest users will never get penalized, even if it must take the Validator Client offline to do so.
If this happens, you will stop attesting and will see error messages in your log files about why the Smartnode can't correctly set your fee recipient.

## The Smoothing Pool

The **Smoothing Pool** is a unique opt-in feature of the Rocket Pool network that is available to our node operators.
Essentially, it becomes the fee recipient for every node operator that opts into it and collectively accumulates the priority fees from blocks proposed by those node operators into one large pool. During a Rocket Pool rewards checkpoint (the same ones used to distribute RPL rewards), the total ETH balance of the pool is distributed fairly to the pool stakers and the node operators that opted into it.

In essence, the Smoothing Pool is a way to effectively eliminate the randomness associated with being selected for block proposals.
If you've ever had a streak of bad luck and gone months without a proposal, or if your block proposals only have low priority fees, you may find the Smoothing Pool quite exciting.

To make the math easy to understand, community member Ken Smith has put together a [massive analysis](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) comparing the profitability of the Smoothing Pool and the Fee Distributor, which is summarized nicely with this chart:

![](../node-staking/images/sp-chart.png)

In short, as long as the Smoothing Pool has more minipools than you do, it's more likely that you'll come out ahead by joining it.

### The Rules

The Smoothing Pool uses the following rules:

- During a Rocket Pool rewards checkpoint when the Smoothing Pool's balance is distributed between node operators (factoring in their commission), RPL staking node operators, rETH stakers, and potentially the Rocket Pool DAO. The exact percentages are determined by Rocket Pool [Protocol Dao (pDAO) governance](/pdao/overview)

- Opting into the Smoothing Pool is done on a **node level**. If you opt in, all of your minipools and megapool validators are opted in.

- Anyone can opt in at any time. They must wait a full rewards interval (3 days on Hoodi, 28 days on Mainnet) before opting out to prevent gaming the system (e.g. leaving the SP right after being selected to propose a block).
  - Once opted out, they must wait another full interval to opt back in.

- The Smoothing Pool calculates the "share" of each validator (portion of the pool's ETH for the interval) owned by each node opted in.
  - The share is a function of your validator's performance during the interval (calculated by looking at how many attestations you sent on the Beacon Chain, and how many you missed), and your commission rate.

- Your node's total share is the sum of your validator shares.

- Your node's total share is scaled by the amount of time you were opted in.
  - If you were opted in for the full interval, you receive your full share.
  - If you were opted in for 30% of an interval, you receive 30% of your full share.

If you are interested in the complete technical details of Smoothing Pool rewards calculation, please review the [full specification here](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Joining and Leaving the Smoothing Pool

To opt into the Smoothing Pool, run the following command:

```shell
rocketpool node join-smoothing-pool
```

This will record you as opted-in in the Rocket Pool contracts and automatically change your Validator Client's `fee recipient` from your node's distributor contract to the Smoothing Pool contract.

To leave the pool, run this command:

```shell
rocketpool node leave-smoothing-pool
```

This will record you as opted-out in the Rocket Pool contracts, and once a small delay has passed, will automatically change your Validator Client's `fee recipient` from the Smoothing Pool contract back to your node's Fee Distributor contract.

### Claiming Rewards from the Smoothing Pool

Rewards from the Smoothing Pool are bundled together with RPL at the end of each rewards interval using the Redstone rewards system.
Claiming them is as simple as running:

```shell
rocketpool node claim-rewards
```

If opted into the Smoothing Pool, you will notice that the amount of ETH you receive for each interval is more than zero:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Note that the Smoothing Pool rewards in Interval 1 here indicate that the node was opted in during that interval and received rewards accordingly.

We'll cover more about claiming RPL and Smoothing Pool rewards later in the guide, in the [Claiming Rewards](./rewards) section.

## Next Steps

Once you've decided on whether or not you want to join the Smoothing Pool, take a look at the next section on MEV and MEV rewards.
