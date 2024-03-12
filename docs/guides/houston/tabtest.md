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