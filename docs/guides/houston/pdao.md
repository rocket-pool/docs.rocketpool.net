# The Protocol DAO (pDAO)

The Rocket Pool Protocol DAO (pDAO) is responsible for shaping the direction of the protocol and is run by RPL governance. Its members and their voting power are made up of node operators, big and small, all of which are directly participating in the protocol. It serves the Rocket Pool community at large, including rETH holders, Node Operators, and RPL holders. The pDAO prioritizes the safety of the Rocket Pool protocol and the health of the Ethereum Network. For an explicit definition of who and what the pDAO is, feel free to take a look at the [pDAO charter](https://rpips.rocketpool.net/RPIPs/RPIP-23).

## New pDAO features in Houston

### On-chain execution of pDAO responsibilities

The Houston Upgrade introduces an on-chain replacement for the pDAO governance system's execution process. It uses an optimistic fraud-proof system that allows any node operator to raise proposals and vote on proposals to adjust "pDAO protocol parameters" and spend treasury funds. To see a comprehensive list of pDAO controllable parameters, click [here](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).
Pre-Houston, the core team was responsible for executing pDAO duties at the behest of the community governance process. For example, the team carries out the monthly IMC and GMC payments as per the governance voted payment schedules. The plan was for this power to reside with the team temporarily until a new power structure is set up to take over these responsibilities. Houston removes this dependency on the team, making the protocol more decentralized and trustless.

### Security Council

The Houston upgrade also includes a new security council to help react quickly in the event of any potential issues with the protocol. These members can be elected by the pDAO and have the ability to propose and execute changes without delay. The pDAO has the power to elect and remove members from the security council. It's a serious role and the pDAO should develop strong entry requirements and processes for flushing stale members. The pDAO guardian will be the security council's sole member at the start of Houston.

### Recurring Treasury Spends

RPL has a 5% inflation rate. 22% of this inflation is directed towards the pDAO as defined in [RPIP-25](https://rpips.rocketpool.net/RPIPs/RPIP-25). The pDAO can use these funds for a variety of purposes. For example, incentives such as liquidity provider (LP) bonuses, grants and bounties for 3rd party improvements and projects, and funding the development of the Rocket Pool protocol. The Houston upgrade also introduces a new feature that enables recurring treasury payments made to a specified beneficiary each rewards period.

## Protocol DAO (pDAO) proposals

Any node with a non-zero voting power may raise or participate in a pDAO proposal at any time. Proposals can be one of the following types:

- Changing pDAO settings
- One-time treasury spends
- Repeat treasury spends (management committees)
- Security council membership

For greater detail and rationale, refer to [proposal types](https://rpips.rocketpool.net/RPIPs/RPIP-33#proposal-types). It's important to understand that a pDAO proposal is an on-chain entity that exists to execute changes at the protocol level.

## Lifecycle of a pDAO proposal

A proposal should be forecasted by the [governance process](../houston/participate#governance-process) before it ends up on-chain. It consists of 4 Periods, all of which are pDAO [controllable parameters](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table):

- Vote Delay Period: `proposal.vote.delay.time`
- Vote Phase 1: `proposal.vote.phase1.time`
- Vote Phase 2: `proposal.vote.phase2.time`
- Execution: `proposal.execute.time	`

![](./images/proposal_diagram.png){ style="display: block; margin: 0 auto" }

### Vote Delay Period

In order to decide the outcome of a proposal, the protocol must know the quorum required. A proposer calculates this value off-chain and submits it alongside their proposal. The value is optimistically accepted, but in the case of fraud, verifiers can perform a challenge/response process to prove the value is incorrect. Invalid proposals are then discarded.

A few reasons why proposers and challengers are required to lock RPL.

- `proposal.bond` incentivizes valid proposals and disincentivizes spam.
- `proposal.challenge.bond` incentivizes the takedown of invalid/malicious proposals.

Challengers supply an index into the Merkle-sum tree that they are alleging is incorrect. Any node operator can participate in challenging fraudulent proposals (and earn a reward in doing so). Feel free to read about the [pDAO Challenge Process](../houston/pdao#challenge-process) if you're interested in opting in. A proposal not defeated in a challenge by the end of the vote delay period will enter voting stages.

::: tip NOTE
When `proposal.vote.delay.time` expires, the proposal is no longer able to be challenged or defeated.
:::

### Vote Period 1

During a voting period, Node Operators and Delegates can cast a vote with one of four options:

```
1. Abstain: The voter's voting power is contributed to quorum but is neither for nor against the proposal.
2. For: The voter votes in favor of the proposal being executed.
3. Against: The voter votes against the proposal being executed.
4. Veto: The voter votes against the proposal as well as indicating they deem the proposal as spam or malicious.
```

Their voting power will be included in the option of their choosing.

This can be done using the command:

```shell
rocketpool pdao proposals vote
```

If the veto quorum (as defined by the `proposal.veto.quorum` parameter) is met, the proposal is immediately defeated and the proposer loses their bond. This is to dissuade spam, low quality proposals, or proposals that have not gone through off-chain processes first. The smartnode command `rocketpool pdao proposals finalize` is used to finalize a vetoed proposal by burning the proposer's locked RPL bond.

The duration of period 1 is determined by the `proposal.vote.phase1.time` parameter. The proposal will transition to phase 2 regardless of whether `proposal.quorum` is reached or not.

### Vote Period 2

Delegates can vote during vote period 2, but only their vote is only worth their **local voting power**. Voters who didn't vote in period 1 will still be able to cast a vote during period 2. Node operators who disagree with their delegate's choice will have the opportunity to overturn their delegate's vote.

The process of overturning a vote is pretty simple, just call `rocketpool pdao proposals vote` during vote period 2 and follow the prompts. The delegate's voting power will be overturned by the delegatee's voting power.

The result of a proposal is concluded when vote period 2 is over. In order for a result to be determined (and executed), `proposal.quorum` total voting power must be reached by the end of `proposal.vote.phase2.time`. If quorum is met and consensus is reached, the proposal will pass the voting periods and be marked as successful.

::: tip NOTE
No further actions can be taken in the event that `proposal.quorum` is not met. A proposal is considered concluded and final if quorum is not met.
:::

### Execution

Once both voting periods have passed and the proposal is successful, the proposal can be executed and the change (defined by the payload) is applied to the Rocket Pool protocol. To execute a proposal, use the command:

```shell
rocketpool pdao proposals execute
```

You will be prompted to select a proposal to execute, the proposal will be applied to the protocol after this step!

After the proposal has passed the voting periods, the proposer may [claim](../houston/participate#claiming-bonds-and-rewards) their locked RPL bond, unless the proposal was defeated by a challenge or vetoed.

::: tip NOTE
There is a window `proposal.execute.time` where a proposal can be executed. A proposal will expire if this timer reaches its end.
:::

And that's it! Keep in mind that all of the variables mentioned above are pDAO controllable parameters. Click [here](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table) for a comprehensive list of every parameter the pDAO has authority to change using on-chain proposals.

## Challenge Process

The complete network voting power tree is stored off-chain due to gas limits. When a user submits a new proposal, they are responsible for constructing the network voting tree at target block number. This tree is generated off-chain but verifiable via Merkle roots that are submitted on-chain. The protocol relies on **verifiers** to check the details submitted by the proposer.

Any node can participate in tracking and verifying the correctness of proposals. To opt into this responsibility, use the command `rocketpool service config`, navigate to the **Smartnode and TX Fee Settings** menu, and check the box `Enable PDAO Proposal Checker`.

![](./images/proposal_checker.png){ style="display: block; margin: 0 auto" }

When this setting is enabled, the node will check for new proposals, verify their correctness, and submit challenges to invalid proposals. The only prerequisite is that [RPL Locking](../houston/participate#allowing-rpl-locking) is enabled.

This check runs every 5 minutes in conjunction with a few other node related duties. We'll run through an example of what challenging a fraudulent proposal looks like. We can use the smartnode command `rocketpool service logs node` to monitor the progress:

```
rocketpool_node  | 2024/04/05 02:19:16 Checking for Protocol DAO proposal challenges to defend...
rocketpool_node  | 2024/04/05 02:19:26 Checking for Protocol DAO proposals to challenge...
rocketpool_node  | 2024/04/05 02:19:26 [Network Tree] Couldn't load network tree for block 1283202 from disk, so it must be regenerated.
rocketpool_node  | 2024/04/05 02:19:26 [PDAO Proposals] Network tree for block 1283202 didn't exist, creating one.
rocketpool_node  | 2024/04/05 02:19:26 [Voting Info Snapshot] Couldn't load network tree for block 1283202 from disk, so it must be regenerated.
rocketpool_node  | 2024/04/05 02:19:26 [PDAO Proposals] Voting info snapshot for block 1283202 didn't exist, creating one.
rocketpool_node  | 2024/04/05 02:19:26 Proposal 177 does not match the local tree artifacts and must be challenged.
rocketpool_node  | 2024/04/05 02:19:26 [Voting Info Snapshot] Loaded file [vi-1283202.json.zst].
rocketpool_node  | 2024/04/05 02:19:26 [Network Tree] Loaded file [network-tree-1283202.json.zst].
rocketpool_node  | 2024/04/05 02:19:26 Submitting challenge against proposal 177, index 5...
rocketpool_node  | 2024/04/05 02:19:26 This transaction will use a max fee of 16.067134 Gwei, for a total of up to 0.003252 - 0.004878 ETH.
rocketpool_node  | 2024/04/05 02:19:26 Transaction has been submitted with hash 0x327e59e398bf2141a0d9273947d1da5c255606c45afaca428ab092186300eac2.
rocketpool_node  | 2024/04/05 02:19:26 You may follow its progress by visiting:
rocketpool_node  | 2024/04/05 02:19:26 https://holesky.etherscan.io/tx/0x327e59e398bf2141a0d9273947d1da5c255606c45afaca428ab092186300eac2

```

We can see that our node has caught a fraudulent proposal and started the process of challenging it. Block `1283202` is the block in which proposal 177 was raised, which means voting power for this proposal will be calculated at block `1283202`. If you're interested in seeing what these **Voting Info Snapshots** look like, you can locate them in this directory: `~/.rocketpool/data/voting`

Because the proposer was caught submitting incorrect voting info, our node makes a contract call `Function: createChallenge` on proposal 177 at index 5 and waits for the proposer to respond to the challenge.

```
rocketpool3_node  | 2024/04/05 02:56:51 Checking for Protocol DAO proposal challenges to defend...
rocketpool3_node  | 2024/04/05 02:57:01 Checking for Protocol DAO proposals to challenge...
rocketpool3_node  | 2024/04/05 02:57:01 [Network Tree] Loaded file [network-tree-1283202.json.zst].
rocketpool3_node  | 2024/04/05 02:57:01 Proposal 177 does not match the local tree artifacts and must be challenged.
rocketpool3_node  | 2024/04/05 02:57:01 [Voting Info Snapshot] Loaded file [vi-1283202.json.zst].
rocketpool3_node  | 2024/04/05 02:57:01 [Network Tree] Loaded file [network-tree-1283202.json.zst].
rocketpool3_node  | 2024/04/05 02:57:01 Proposal 177 has been defeated with node index 20, submitting defeat...
rocketpool3_node  | 2024/04/05 02:57:01 This transaction will use a max fee of 19.078965 Gwei, for a total of up to 0.002061 - 0.003091 ETH.
rocketpool3_node  | 2024/04/05 02:57:01 Transaction has been submitted with hash 0x8cc01dff37205dc98e53f4e9fae7f3c802ecc1c69a01f53e734115a73401287e.
rocketpool3_node  | 2024/04/05 02:57:01 You may follow its progress by visiting:
rocketpool3_node  | 2024/04/05 02:57:01 https://holesky.etherscan.io/tx/0x8cc01dff37205dc98e53f4e9fae7f3c802ecc1c69a01f53e734115a73401287e
rocketpool3_node  |
rocketpool3_node  | 2024/04/05 02:57:01 Waiting for the transaction to be validated...
rocketpool3_node  | 2024/04/05 02:57:13 Successfully defeated proposal.
```

Since the proposer's voting info is incorrect, the won't be able to respond to the challenge in time (determined by `proposal.challenge.period`). The proposal is considered defeated at this point. When the proposal is defeated, our node automatically makes the contract call `defeatProposal` on proposal 177 at index 5 to end the proposal.

::: tip NOTE
Challengers who participate in defeating the proposal are paid a proportional amount of the proposer's bond if they submit an index proven to be incorrect. All other challengers receive their bond back only.
:::

Now that the proposal is defeated, our node (the challenger) can [claim](../houston/participate#claiming-bonds-and-rewards) their original RPL bond as well as the proposer's RPL bond as a reward for defeating a fraudulent proposal.

If you're curious to dig into the details of the pDAO proposal and challenge system, take a look at the [technical specifications](https://github.com/rocket-pool/rocketpool-research/blob/houston/Protocol%20DAO/pdao-prop-challenge-spec.md#draft-protocol-dao-proposal-challenge-system-specification). Feel free to skip to this section on the [challenge process](https://github.com/rocket-pool/rocketpool-research/blob/houston/Protocol%20DAO/pdao-prop-challenge-spec.md#challenge-process) if you're interested in studying an example that goes into low level details.
