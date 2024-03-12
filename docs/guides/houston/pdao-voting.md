# WIP:


# Participating in the pDAO voting process

The Houston Upgrade introduces an on-chain replacement for the pDAO governance system's execution process. It uses an optimistic fraud-proof system that allows any node operator to raise proposals and vote on proposals to adjust "pDAO protocol parameters" and spend treasury funds.


Please read through this page thoroughly to understand the pDAO's proposal and voting system. 

Any node with a non-zero voting power may raise a proposal at any time. Proposals can be one of the following types:

- Changing pDAO settings
- One-time treasury spends
- Repeat treasury spends (management committes)
- Security council membership

Click [here](../houston/whats-new.md#protocol-dao) for an overview. 

For greater detail and rationale, refer to [proposal types](https://rpips.rocketpool.net/RPIPs/RPIP-33#proposal-types).

A comprehensive table of pDAO controllable parameters can be found [here](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

## Allowing RPL Locking

RPL locking is a prerequisite for participation. By default, locking RPL for any purpose, will be disabled. Node operator's will opt-in to performing governance activities by enabling the locking of RPL from their node or primary withdrawal address. You can do so using this command in the Smartnode: 

``` 
rocketpool node allow-rpl-locking
```
This will prompt you to allow the locking of RPL when creating or challenging governance proposals. Conversely you can use the following command to opt-out of RPL locking: 
```
rocketpool node deny-rpl-locking
```

::: tip NOTE
In order to be eligible to propose, node MUST have an RPL stake (minus any already locked RPL) greater than the proposal bond. Locked RPL SHALL act the same way as regular staked RPL for the purposes of rewards, voting and collateral requirements. Locked RPL SHALL NOT be counted towards thresholds for withdrawing RPL.
:::

## Lifecycle of a pDAO proposal 

![](./images/pDAO_Proposals_-_Timeline2.png){ style="display: block; margin: 0 auto" }

A proposal should be forcasted by the governance process before it ends up on chain. It consists of 4 Periods, all of which are pDAO controllable parameters:

- Vote Delay Period: `proposal.challenge.period`
- Vote Phase 1: `proposal.vote.phase1.time`
- Vote Phase 2: `proposal.vote.phase2.time`
- Execution: `proposal.execute.time	`

### Vote Delay Period

In order to decide the outcome of a proposal, the protocol must know the quorum required. A proposer calculates this value off-chain and submits it alongside their proposal. The value is optimistically accepted, but in the case of fraud, verifiers can perform a challenge/response process to prove the value is incorrect. Invalid proposals are then discarded.

A few reasons why pDAO participants are required to lock RPL. 

- `proposal.bond` incentivizes valid proposals and disincentivizes spam. 
- `proposal.challenge.bond` incentivizes the takedown of invalid proposals.

Challengers who participated in defeating the challenge are paid a proportional amount of the proposer's bond if they submit an index proven to be incorrect. All other challengers receive their bond back only. Upon conclusion of a proposal, Proposers and Challengers may claim bonds using the following command: 

```
rocketpool pdao claim-bonds
``` 

If a proposal is not defeated after `proposal.vote.delay.time` has passed, the proposal enters the voting stages.

### Vote Period 1




