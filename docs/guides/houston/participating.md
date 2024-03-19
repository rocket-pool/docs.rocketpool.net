# Participating in on-chain pDAO Proposals 
Any node with a non-zero voting power may raise or participate in a pDAO proposal at any time. Proposals can be one of the following types:

- Changing pDAO settings
- One-time treasury spends
- Repeat treasury spends (management committes)
- Security council membership

For greater detail and rationale, refer to [proposal types](https://rpips.rocketpool.net/RPIPs/RPIP-33#proposal-types). It's important to understand that a pDAO proposal is an on-chain entity that exists to execute changes at the protocol level.  

## Prerequisite

Please read about the [lifecycle of a proposal](../houston/pdao#lifecycle-of-a-pdao-proposal) before proceeding. 

This guide will walk you though the steps required for participating in on-chain pDAO proposals. 

## Initializing Voting 

If you are a node operator who registered before the Houston upgrade, you need to initialize voting to unlock voting power. 
```
rocketpool network initialize-voting
```
You only need to do this once. It configures the initial snapshot information for a node. After you initialize voting, every action taken will update your node's snapshot information. 
**TODO** get the terminal output and show it here! 

## Allowing RPL Locking

You may ignore this step if you are only interested in voting on a proposal, not proposing or challenging. 

RPL locking is a required for proposing and challenging. By default, locking RPL for any purpose, will be disabled. Node operator's will opt-in to performing governance activities by enabling the locking of RPL from their node or primary withdrawal address. You can do so using this command in the Smartnode: 

``` 
rocketpool node allow-rpl-locking
```
This will prompt you to allow the locking of RPL when creating or challenging governance proposals. Conversely you can use the following command to opt-out of RPL locking: 
```
rocketpool node deny-rpl-locking
```

## Delegating Voting Power 

A Node Operator can elect to delegate their voting power to another Node Operator. This can be done using the following command: 
```
rocketpool network set-voting-delegate <address>
```
For example, if you wanted to delegate your voting power to `0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145`, you would run:
```
rocketpool network set-voting-delegate 0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145
```
::: tip NOTE
By default, every node has their voting power delgated to itself. So if you've delegated your voting power to another node operator, you can reset this by setting the voting delegate to your own node's address. 
:::

- During phase 1 of a proposal: Delegates may cast their vote on a proposal. 
- During phase 2 of a proposal: Node operators who have delegated their vote get the opportunity to override their Delegate's vote, if they disagree.

## Creating a Proposal 

In order to be eligible to propose, a node must meet a few requirements: 
- Included in snapshotting (either by [initializing voting](../houston/pdao#initializing-voting) or by registering post Houston)
- Has non-zero voting power.
- Has an RPL stake (minus any already locked RPL) greater than the proposal bond
- Has allowed RPL locking

::: tip NOTE
Locked RPL acts the same way as regular staked RPL for the purposes of rewards, voting, and collateral requirements. Locked RPL is not counted towards thresholds for withdrawing RPL.
:::

Use the command `rocketpool pdao propose` to bring up a menu of optons
```
COMMANDS:
   rewards-percentages, rp      Propose updating the RPL rewards allocation percentages for node operators, the Oracle DAO, and the Protocol DAO
   one-time-spend, ots          Propose a one-time spend of the Protocol DAO's treasury
   recurring-spend, rs          Propose a recurring spend of the Protocol DAO's treasury
   recurring-spend-update, rsu  Propose an update to an existing recurring spend plan
   security-council, sc         Modify the security council
   setting, s                   Make a Protocol DAO setting proposal
```
Each of these commands will prompt you with a list of inputs to create your desired proposal. For example, if you wanted to invite a node to the security council, you would run `rocketpool pdao propose security-council invite`, prompting you to enter an ID and member address. 
```
thomaspanf@debian:~$ rocketpool pdao propose security-council invite

Please enter an ID for the member you'd like to invite: (no spaces)
1324

Please enter the member's address:
0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145

... gas estimations ... 

Are you sure you want to propose inviting 1324 (0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145) to the security council? [y/n]
```
After this is executed, a pDAO proposal will be created! The proposal will enter the [vote delay period](../houston/pdao#vote-delay-period) upon creation.

## Viewing the State of a Proposal



:::::: tabs
::::: tab Viewing List of Proposals

After a proposal is created, you can view it using `rocketpool pdao proposals list`. This will display proposal `ID 71` along with the following information: 
```
thomaspanf@debian:~$ rocketpool pdao proposals list

1 Pending proposal(s):

71: invite test-member (0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145) to the security council - Proposed by: 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D

Succeeded proposal(s):

Executed proposal(s):

Destroyed proposal(s):

Quorum not Met proposal(s):

Defeated proposal(s):

Expired proposal(s):

```
::: tip NOTE
After executing `rocketpool pdao proposals list`, the state of all existing and previous proposals will be listed. For demonstration purposes, many are omitted in this example. 
:::


::::: tab Viewing Status of Proposal 

Now that you have the proposal ID, you can view the status of your proposal using `rocketpool pdao proposals details <proposal-id>`
```
thomaspanf@debian:~$ rocketpool pdao proposals details 71

Proposal ID:            71
Message:                invite test-member (0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145) to the security council
Payload:                proposalSecurityInvite(test-member,0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145)
Payload (bytes):        f944c19f0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000bdbcb42dd8e39323a395b2b72d2c8e7039f1f145000000000000000000000000000000000000000000000000000000000000000b746573742d6d656d626572000000000000000000000000000000000000000000
Proposed by:            0x681B8BBf08708e64694005c7Dc307b381b4D1A7D
Created at:             12 Mar 24 06:15 UTC
State:                  Pending
Voting start:           12 Mar 24 06:20 UTC
Challenge window:       30m0s
Voting power required:  90943818825
Voting power for:       0
Voting power against:   0
Voting power abstained: 0
Voting power against:   0
Node has voted:         no
```
::: tip NOTE
The state of this sample proposal is `Pending`. This indicates that the proposal can be challenged, before moving onto `Active (Phase 1)`

^^^ The wording here should be changed. 'Pending' is synonomous with 'challenge period' and 'vote delay period' or 'proposal.challenge.period'
:::

::::::

## Voting on a Proposal

During a voting period, Node Operators and Delegates can cast a vote with one of four options:
```
1. Abstain: The voter's voting power is contributed to quorum but is neither for nor against the proposal.
2. For: The voter votes in favour of the proposal being executed.
3. Against: The voter votes against the proposal being executed.
4. Veto: The voter votes against the proposal as well as indicating they deem the proposal as spam or malicious.
```
Their voting power will be included in the option of their choosing. Voting power is a function of "effective RPL stake." A more detailed reading can be found in the [rocketpool-research repo](https://github.com/rocket-pool/rocketpool-research/blob/master/pDAO%20Replacement/pDAO.md#overview-of-on-chain-voting).

Use this command to cast a vote:
```
rocketpool pdao proposals vote
```
You'll be prompted to select a proposal to vote on if these conditions are met:
- There is at least one proposal in active voting phases
- If you're a delegate, the proposal(s) is in vote phase 1
- You haven't already voted on such proposal(s) 

The menu should look something like this: 
```
thomaspanf@debian:~$ rp2 p o v

1: proposal 79 (message: 'one-time spend for invoice test', payload: proposalTreasuryOneTimeSpend(test,0x681B8BBf08708e64694005c7Dc307b381b4D1A7D,100000000000000000000), phase 1 end: 14 Mar 24 05:40 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D)
2: proposal 80 (message: 'replace langers-not-his-eoa (0xaC1396c21Eaf6630113516C69d63b7CB59B98b3E) on the security council with tpan (0x6E9E4Cc0A8172349E049128574E1fb85B8D3CE9E)', payload: proposalSecurityReplace(0xaC1396c21Eaf6630113516C69d63b7CB59B98b3E,tpan,0x6E9E4Cc0A8172349E049128574E1fb85B8D3CE9E), phase 1 end: 14 Mar 24 05:40 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0xe2fC31d61E28BB16c0857D4682AB3616FA7A793d)
3: proposal 81 (message: 'set proposal.vote.delay.time', payload: proposalSettingUint(rocketDAOProtocolSettingsProposals,proposal.vote.delay.time,60), phase 1 end: 14 Mar 24 05:41 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D)
```
After selecting an option, you'll be asked how you want to cast your vote: 
```
How would you like to vote on the proposal?
1: Abstain
2: In Favor
3: Against
4: Veto
```
Selecting an option will then display your voting power, and then prompt you to send the transaction:
```
Your current voting power: 20123617964

+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 76 gwei   | 0.0176 to 0.0265 ETH |
| 1 Minute      | 56 gwei   | 0.0127 to 0.0190 ETH |
| 3 Minutes     | 56 gwei   | 0.0127 to 0.0190 ETH |
| >10 Minutes   | 56 gwei   | 0.0127 to 0.0190 ETH |
+==================================================+
These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 56 gwei:
```



