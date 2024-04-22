# DRAFT

# Participating in on-chain pDAO Proposals 
Any node with a non-zero voting power may raise or participate in a pDAO proposal at any time. Proposals can be one of the following types:

- Changing pDAO settings
- One-time treasury spends
- Repeat treasury spends (management committees)
- Security council membership

For greater detail and rationale, refer to [proposal types](https://rpips.rocketpool.net/RPIPs/RPIP-33#proposal-types). It's important to understand that a pDAO proposal is an on-chain entity that exists to execute changes at the protocol level.

## Governance Process

A proposal should be forecasted by the governance process before it ends up on chain. 

Changes to the Rocket Pool protocol and proposed, voted, and executed using a strict, yet transparent governance process. The process begins with an informal discussion of an idea within the Discord community. This idea then progresses to formal discussions in the [#governance](https://discordapp.com/channels/405159462932971535/774497904559783947) channel on Discord and the [DAO Forum](https://dao.rocketpool.net/), where it undergoes thorough research, modeling, and scrutiny in preparation for a [Rocket Pool Improvement Proposal (RPIP)](https://rpips.rocketpool.net/). Following this, a draft RPIP is prepared and reviewed by designated RPIP reviewers to ensure its quality and readiness for presentation to the DAO. The draft proposal is then presented to the DAO on the forum for further review, feedback, and incorporation of any necessary changes. Once the proposal has been refined based on community input, a poll is raised on the DAO forum to gauge readiness for finalizing the RPIP text. If the poll passes, indicating community approval, the RPIP is marked final and ready for a Protocol DAO vote, which is conducted via Snapshot to determine whether the proposal should be implemented.

From here, the Oracle DAO will raise an on chain proposal. There is a window in which the Protocol DAO, Oracle DAO and community can review the proposal. If consensus is reached, the proposal is executed and changes are applied to the protocol. 

A handy dandy visual representation of this process can be found on the [Rocket Pool website](https://rocketpool.net/governance/process).







## Prerequisite

Please read the [lifecycle of a proposal](../houston/pdao#lifecycle-of-a-pdao-proposal) before proceeding. It'll explain the differences between all the voting periods and the actions that can be taken during each period. 

This rest of this page will walk you though the steps required for participating in on-chain pDAO proposals. 

## Initializing Voting 

If you are a node operator who registered before the Houston upgrade, you need to initialize voting to unlock voting power. 
```
rocketpool network initialize-voting
```
You only need to do this once. It configures the initial snapshot information for a node. After you initialize voting, every action taken will update your node's snapshot information. 

## Allowing RPL Locking

You may ignore this step if you are only interested in voting on a proposal. Allowing RPL locking is only required for those who wish to propose or challenge a proposal.

RPL locking is required for proposing and challenging. By default, locking RPL for any purpose, will be disabled. Node operator's will opt-in to performing governance activities by enabling the locking of RPL from their node or primary withdrawal address. You can do so using this command in the Smartnode: 

``` 
rocketpool node allow-rpl-locking
```
This will prompt you to allow the locking of RPL when creating or challenging governance proposals. Conversely you can use the following command to opt-out of RPL locking: 
```
rocketpool node deny-rpl-locking
```
::: tip NOTE
Locked RPL acts the same way as regular staked RPL for the purposes of rewards, voting, and collateral requirements. Locked RPL is not counted towards thresholds for withdrawing RPL.
:::
## Delegating Voting Power 

A node operator can elect to delegate their voting power to another Node Operator. This can be done using the following command: 
```
rocketpool network set-voting-delegate <address>
```
For example, if you wanted to delegate your voting power to `0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145`, you would run:
```
rocketpool network set-voting-delegate 0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145
```
::: tip NOTE
By default, every node has their voting power delegated to itself. So if you've delegated your voting power to another node operator, you can reset this by setting the voting delegate to your own node's address. 
:::

- During phase 1 of a proposal: Delegates may cast their vote on a proposal. 
- During phase 2 of a proposal: Node operators who have delegated their vote get the opportunity to override their Delegate's vote, if they disagree.

If you are a node operator with delegated voting power, you must vote during voting phase 1 for the delegated voting power to count towards the proposal. Your vote in phase 1 will be worth your **local voting power + delegated voting power**. Your vote in phase 2 is worth your **local voting power** only. 

## Creating a Proposal 

In order to be eligible to propose, a node must meet a few requirements: 
- Included in snapshotting (either by [initializing voting](../houston/pdao#initializing-voting) or by registering post Houston)
- Has non-zero voting power.
- Has an RPL stake (minus any already locked RPL) greater than the proposal bond
- Has allowed RPL locking

Proposals exist to change parameters at the protocol level! There should be discussion and consensus through the [governance](../houston/participate#governance-process) process before a proposal is created on chain. 

Use the command `rocketpool pdao propose` to bring up a menu of options
```
COMMANDS:
   rewards-percentages, rp      Propose updating the RPL rewards allocation percentages for node operators, the Oracle DAO, and the Protocol DAO
   one-time-spend, ots          Propose a one-time spend of the Protocol DAO's treasury
   recurring-spend, rs          Propose a recurring spend of the Protocol DAO's treasury
   recurring-spend-update, rsu  Propose an update to an existing recurring spend plan
   security-council, sc         Modify the security council
   setting, s                   Make a Protocol DAO setting proposal
```
Each of these commands will prompt you with a list of inputs to create your desired proposal. In this guide, we'll invite a node to the security council to serve as an example. To raise a proposal to invite a node to the security council, you would run `rocketpool pdao propose security-council invite`. Keep in mind that this step will have some slight variation depending on the type of proposal. This particular command will prompt you to enter an ID followed by a member address. 
```
thomaspanf@debian:~$ rocketpool pdao propose security-council invite

Please enter an ID for the member you'd like to invite: (no spaces)
test-member

Please enter the member's address:
0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145

... gas estimations ... 

Are you sure you want to propose inviting test-member (0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145) to the security council? [y/n]
```
After this is executed, a pDAO proposal will be created! The proposal will enter the [vote delay period](../houston/pdao#vote-delay-period) upon creation.

## Viewing the State of a Proposal

Every proposal is assigned a `proposalID`. In this case, our proposal to invite `0xBdbc...` to the security council is represented as `ID 71`. There are a few ways to view the state of the proposal. One method will display a list of every pdao proposal along with their state (pending, succeeded, executed, etc). The second method displays in-depth details about a specific proposal. 

:::::: tabs
::::: tab Viewing a List of Proposals

After a proposal is created, you can view it using `rocketpool pdao proposals list`. Here we can see that our proposal `invite test-member` has an ID of 71 and is in the pending state. In this state, challengers can dispute the validity of the merkle pollard (used to calculate voting power) supplied by the proposer. When `proposal.vote.delay.time` ends, the proposal will transition into active voting phases. Feel free to review [lifecycle of a proposal](../houston/pdao#lifecycle-of-a-pdao-proposal) for a refresher. 
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


::::: tab Viewing Proposal Details 

Now that you have the proposal ID, you can view the status of your proposal using `rocketpool pdao proposals details <proposal-id>` This is where you can view all the information in regards to a proposal. For example, execution payload, what phase the proposal is in, and vote direction. 
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
The state of this sample proposal is `Pending`. This indicates that the proposal can be challenged, before moving onto `Active (Phase 1)`. No voting can take place during the `Pending` state.
:::

::::::



## Voting on a Proposal

During a voting period, Node Operators and Delegates can cast a vote with one of four options:
```
1. Abstain: The voter's voting power is contributed to quorum but is neither for nor against the proposal.
2. For: The voter votes in favor of the proposal being executed.
3. Against: The voter votes against the proposal being executed.
4. Veto: The voter votes against the proposal as well as indicating they deem the proposal as spam or malicious.
```
Their voting power will be applied to the option of their choosing. Voting power is a function of "effective RPL stake." A more detailed reading can be found in the [rocketpool-research repo](https://github.com/rocket-pool/rocketpool-research/blob/master/pDAO%20Replacement/pDAO.md#overview-of-on-chain-voting).


::: tip NOTE
If you are a node operator with delegated voting power, you must vote during voting phase 1 for the delegated voting power to count towards the proposal. Your vote in phase 1 will be worth your local voting power + delegated voting power. Your vote in phase 2 is worth your local voting power only. Please keep in mind that a node may vote once and only once on a proposal, so choose carefully
:::

Use this command to cast a vote:
```
rocketpool pdao proposals vote
```
You'll be prompted to select a proposal to vote on if there is at least one proposal in an active voting phase.
The menu should display all of the proposal your node is eligible to vote on: 
```
thomaspanf@debian:~$ rocketpool pdao proposals vote

1: proposal 71 (message: 'invite test-member', payload: proposalSecurityInvite(test-member,0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145), phase 1 end: 14 Mar 24 05:40 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D)
2: proposal 72 (message: 'replace langers-not-his-eoa (0xaC1396c21Eaf6630113516C69d63b7CB59B98b3E) on the security council with tpan (0x6E9E4Cc0A8172349E049128574E1fb85B8D3CE9E)', payload: proposalSecurityReplace(0xaC1396c21Eaf6630113516C69d63b7CB59B98b3E,tpan,0x6E9E4Cc0A8172349E049128574E1fb85B8D3CE9E), phase 1 end: 14 Mar 24 05:40 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0xe2fC31d61E28BB16c0857D4682AB3616FA7A793d)
3: proposal 73 (message: 'set proposal.vote.delay.time', payload: proposalSettingUint(rocketDAOProtocolSettingsProposals,proposal.vote.delay.time,60), phase 1 end: 14 Mar 24 05:41 UTC, vp required: 0.00, for: 0.00, against: 0.00, abstained: 0.00, veto: 0.00, proposed by: 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D)
```

After selecting an option, you'll be asked how you want to cast your vote. 
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
You've successfully voted on the proposal once the transaction is included in the block! At this point, you may use `rocketpool pdao proposal details <proposal-id>` to view the state of the proposal. A proposal needs to reach `proposal.quorum` **voting power required** and a majority **voting power for** for it to be successful. 
```
Voting power required:  140970562215
Voting power for:       197980809837
Voting power against:   0
Voting power abstained: 0
Voting power against:   0
Node has voted:         In Favor
```
For the example above to pass, the voting power needs to exceed a quorum of `140970562215` voting power. There is `197980809837` voting power in favor and no votes against or abstained. The proposal is poised for success and ready for execution by the end of `proposal.vote.phase2.time`.

## Executing a Successful Proposal

Congrats! Your proposal has passed! Now all that's left to do is to execute the proposal. Keep in mind that anybody can be the executor to a proposal. To execute a successful proposal, use `rocketpool pdao execute`: 
```
tpan@tpan-meerkat:~$ rocketpool pdao execute

Please select a proposal to execute:
1: All available proposals
2: proposal 71 (invite test-member (0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145) to the security council)', proposalSecurityInvite(test-member,0xBdbcb42DD8E39323a395B2B72d2c8E7039f1F145)
```
Selecting an option will prompt you to send a transaction. Once this transaction is included in a block, the change will be applied to the Rocket Pool protocol! 


## Claiming Bonds and Rewards

Proposers or Challengers may claim their bonds upon conclusion of a proposal. Depending on the outcome of a proposal, a Proposer or Challenger may or may not be able to claim their `proposal.bond` and `proposal.challenge.bond`.

Here are some rules that dictate the conditions in which bonds can be claimed:
- If a proposal is defeated, the proposer forfeits their bond which is divided proportionally amongst the challengers who contributed to the proposal's defeat. All other challengers receive their bond back only. 
- Contributing to the defeat of a proposal means a challenger submitted an index which was later proven to be incorrect by the proposers inability to reply to a challenge. It is possible that there are multiple incorrect indices but only those that resulted in the defeat of the proposal share the reward. All other challengers receive their bond back only.
- If a challenger challenges a node, the proposer responds, and the proposal does not get defeated. The proposer can claim the challenge bonds from the invalid challenges.
- If a proposal is defeated, the proposer forfeits their bond which is divided proportionally amongst the challengers who contributed to the proposal's defeat.

use the command `rocketpool pdao claim-bonds` to claim bonds: 
```
tpan@tpan-meerkat:~$ rp3 p cb

Please select a proposal to unlock bonds / claim rewards from:
1: All available proposals
2: Proposal 42 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
3: Proposal 43 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
4: Proposal 44 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
5: Proposal 46 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
6: Proposal 47 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
7: Proposal 48 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
8: Proposal 49 (proposer: true, unlockable: 21.00 RPL, rewards: 0.00 RPL)
```
This will display every proposal you're eligible to claim bonds from. You can either claim bonds from a specified proposal, or you can claim bonds and rewards from all eligible proposals. 
```
1

+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 26 gwei   | 0.1591 to 0.2387 ETH |
| 1 Minute      | 21 gwei   | 0.1261 to 0.1891 ETH |
| 3 Minutes     | 21 gwei   | 0.1261 to 0.1891 ETH |
| >10 Minutes   | 21 gwei   | 0.1261 to 0.1891 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 21 gwei:


Using a max fee of 21.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to claim bonds and rewards from 7 proposals? [y/n]
```

## Creating a Recurring Treasury Spend

You'll need to prepare a few inputs to create a recurring treasury spend:
- A contract name
- The recipient's address
- Amount of RPL to send per period
- The start time for the recurring payment (as a UNIX timestamp)
- The length of each payment period in hours / minutes / seconds (e.g., 168h0m0s)
- Number of payment periods

::: tip INFO
The recipient will need to keep note of the contract name in order to claim payments. Don't worry though, as this information is stored and can be retrieved using the command `rocketpool pdao proposals details <proposal-id>`
:::

To raise a proposal to set up a recurring treasury spend, use the following smartnode command and follow the prompts:

```
rocketpool pdao propose recurring-spend
```

Here's what it looks like all together:

```
tpan@tpan-meerkat:~$ rocketpool pdao propose recurring-spend

Please enter a contract name for this recurring payment:
test-recurring-spend

Please enter a recipient address for this recurring payment:
0x681B8BBf08708e64694005c7Dc307b381b4D1A7D

Please enter an amount of RPL to send to 0x681B8BBf08708e64694005c7Dc307b381b4D1A7D per period:
1

Your value will be multiplied by 10^18 to be used in the contracts, which results in:

	[1000000000000000000]

Please make sure this is what you want and does not have any floating-point errors.

Is this result correct? [y/n]
y

Please enter the time that the recurring payment will start (as a UNIX timestamp):
1717935233

The provided timestamp corresponds to 2024-06-09 12:13:53 +0000 UTC - is this correct? [y/n]
y

Please enter the length of each payment period in hours / minutes / seconds (e.g., 168h0m0s):
720h

Please enter the total number of payment periods:
24
```
Once you've entered all the required inputs, a proposal to create a recurring payment will be raised. When the pDAO passes and executes this proposal, the recipient is allocated `1 RPL` starting at `2024-06-09 12:13:53 +0000 UTC` every `720 hours` for a total of `24 payments`. 

## Claiming a Recurring Treasury Spend 

Claiming recurring payments should be pretty simple! Navigate to our frontend tool [here](https://stake.rocketpool.net/manage/claim-recurring-payments) to do so. If you're trying this out on Holesky testnet, use [this](https://testnet.rocketpool.net/manage/stake-rpl-on-behalf-of-node) link instead. 

Once you're on the site, click the **connect wallet** button. Please read through and accept the Terms of Service & Privacy Policy, this will enable different ways to connect, then click connect **metamask**. 

MetaMask will prompt you to select an account to connect to the website. After you've signed in, you'll need to enter the **contract name**. Doing so will display all the relevant details. Make sure you double check the recipient's address. Anybody can call the claim function, but each payment contract will have a designated recipient to disperse RPL towards. 

![](./images/claim_recurring1.png){ style="display: block; margin: 0 auto" }

You can claim your payments at any time, you'll just get the total unclaimed RPL up until the most recent period. Alternatively you can wait until all periods have passed to collect all at once and save on gas.

Just hit the big orange claim button when you're ready and review the transaction in metamask (or your preferred wallet). Once that's done, you're all set!
