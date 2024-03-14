# DRAFT:


# The Protocol DAO (pDAO) 
The Rocket Pool Protocol DAO (pDAO) is responsible for shaping the direction of the protocol and is run by RPL governance. Its members and their voting power are made up of node operators, big and small, all of which are directly participating in the protocol. It serves the Rocket Pool community at large, including rETH holders, Node Operators, and RPL holders. The pDAO prioritizes the safety of the Rocket Pool protocol and the health of the Ethereum Network. For an explicit definition of who and what the pDAO is, feel free to take a look at the [pDAO charter](https://rpips.rocketpool.net/RPIPs/RPIP-23).

## New pDAO features in Houston

### On-chain execution of pDAO responsibilities   
The Houston Upgrade introduces an on-chain replacement for the pDAO governance system's execution process. It uses an optimistic fraud-proof system that allows any node operator to raise proposals and vote on proposals to adjust "pDAO protocol parameters" and spend treasury funds. To see a comprehensive list of pDAO controllable parameters, click [here](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table). 
Pre-houston, the core team was responsible for executing pDAO duties at the behest of the community governance process. For example, the team carries out the monthly IMC and GMC payments as per the governance voted payment schedules. The plan was for this power to reside with the team temporarily until a new power structure is set up to take over these responsibilities. Houston removes this dependency on the team, making the protocol more decentralised and trustless.


### Security Council
The Houston upgrade also includes a new security council to help react quickly in the event of any potential issues with the protocol. These members can be elected by the pDAO and they have the ability propose and execute changes without delay. The pDAO has the power to elect and remove members from the security council. It's a serious role and the pDAO should develop strong entry requirements and processes for flushing stale members. The pDAO guardian will be the security council's sole member at the start of Houston. 

### Recurring Treasury Spends
RPL has a 5% inflation rate. 22% of this inflation is directed towards the pDAO as defined in [RPIP-25](https://rpips.rocketpool.net/RPIPs/RPIP-25). The pDAO can use these funds for a variety of purposes. For example, incentives such as liquidity provider (LP) bonuses, grants and bounties for 3rd party improvements and projects, and funding the development of the Rocket Pool protocol. The Houston upgrade also introduces a new feature that enables recurring treasury payments made to a specified beneficiary each rewards period. 


## Protocol DAO (pDAO) proposals
Any node with a non-zero voting power may raise or participate in a pDAO proposal at any time. Proposals can be one of the following types:

- Changing pDAO settings
- One-time treasury spends
- Repeat treasury spends (management committes)
- Security council membership

For greater detail and rationale, refer to [proposal types](https://rpips.rocketpool.net/RPIPs/RPIP-33#proposal-types). It's important to understand that a pDAO proposal is an on-chain entity that exists to execute changes at the protocol level.  

## Lifecycle of a pDAO proposal 

** TODO Q: should this blurb read in first person or should it be neutral? You do xyz vs. node operator does xyz**

A proposal should be forecasted by the governance process before it ends up on chain. It consists of 4 Periods, all of which are pDAO [controllable parameters](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table):

- Vote Delay Period: `proposal.challenge.period`
- Vote Phase 1: `proposal.vote.phase1.time`
- Vote Phase 2: `proposal.vote.phase2.time`
- Execution: `proposal.execute.time	`

![](./images/pDAO_Proposals_-_Timeline2.png){ style="display: block; margin: 0 auto" }

### Vote Delay Period

In order to decide the outcome of a proposal, the protocol must know the quorum required. A proposer calculates this value off-chain and submits it alongside their proposal. The value is optimistically accepted, but in the case of fraud, verifiers can perform a challenge/response process to prove the value is incorrect. Invalid proposals are then discarded.

A few reasons why proposers and challengers are required to lock RPL. 

- `proposal.bond` incentivizes valid proposals and disincentivizes spam. 
- `proposal.challenge.bond` incentivizes the takedown of invalid/malicious proposals.

Challengers supply an index into the Merkle-sum tree that they are alleging is incorrect.

Challengers who participated in defeating the challenge are paid a proportional amount of the proposer's bond if they submit an index proven to be incorrect. All other challengers receive their bond back only. Upon conclusion of a proposal, Proposers and Challengers may claim bonds using the following command: 

```
rocketpool pdao claim-bonds
``` 

If a proposal is not defeated after `proposal.vote.delay.time` has passed, the proposal enters the voting stages.

### Vote Period 1

During a voting period, Node Operators and Delegates can cast a vote with one of four options:
```
1. Abstain: The voter's voting power is contributed to quorum but is neither for nor against the proposal.
2. For: The voter votes in favour of the proposal being executed.
3. Against: The voter votes against the proposal being executed.
4. Veto: The voter votes against the proposal as well as indicating they deem the proposal as spam or malicious.
```
Their voting power will be included in the option of their choosing.

This can be done using the command:
```
rocketpool pdao proposals vote
```
You'll be prompted to select a proposal to vote on, if such proposal is available. After selecting a proposal, you'll be able to select one of the above four options. 

If the veto quorum (as defined by the `proposal.veto.quorum` parameter) is met, the proposal is immediately defeated and the proposer loses their bond. This is to dissuade spam, low quality proposals, or proposals that have not gone through off-chain processes first.

The duration of period 1 is determined by the `proposal.vote.phase1.time` parameter. The proposal will transition to phase 2 reguardless of if `proposal.quorum` is reached. 

### Vote Period 2

During vote period 2, delegates aren't allowed to vote. Node operators who didn't vote in period 1 will still be able to cast a vote during period 2. Node operators who disagree with their delegate's choice will have the opportunity to overturn their delegate's vote.

The process of overturning a vote is pretty simple, just call `rocketpool pdao proposals vote` and follow the prompts. Your voting power will be applied to the proposal, and your delegate's voting power will be deducted. 

**TODO** create a test example in devnet to show the terminal output of what it looks like to overturn a vote. 

The result of a proposal is concluded when `proposal.vote.phase2.time` is over. In order for a result to be determined (and executed), `proposal.quorum` total voting power must be reached by the end of `proposal.vote.phase2.time`. If quorum is met and conclusion is reached, the proposal will be pass the voting periods and be marked as successful. 

::: tip NOTE
No further actions can be taken in the event that `proposal.quorum` is not met
:::

### Execution 

Once both voting periods have passed and the proposal is successful, the proposal can be executed and the change (defined by the payload) is applied to the Rocket Pool protocol. To execute a proposal, use the command: 
```
rocketpool pdao proposals execute
```
You will be prompted to select a proposal to execute, the proposal will be applied to the protocol after this step! 

After the proposal has passed the voting periods, the proposer MAY unlock their RPL bond, unless the proposal was defeated by a challenge or vetoed.

::: tip NOTE
There is a window `proposal.execute.time` where a proposal can be executed. A proposal will expire if this timer reaches it's end. 
:::

