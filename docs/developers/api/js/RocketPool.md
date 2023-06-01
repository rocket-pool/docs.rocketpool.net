# Class: RocketPool

RocketPool

## Constructors

### constructor

• **new RocketPool**(`web3`, `RocketStorage`)

Create a new Rocket Pool instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `web3` | `default` | A Web3 instance |
| `RocketStorage` | `string` \| `ContractArtifact` | a RocketStorage address as a string or ContractArtifact (JSON ABI file) |

#### Defined in

rocketpool/rocketpool.ts:87

## Properties

### contracts

• `Readonly` **contracts**: [`Contracts`](Contracts)

#### Defined in

rocketpool/rocketpool.ts:33

___

### auction

• `Readonly` **auction**: [`Auction`](Auction)

#### Defined in

rocketpool/rocketpool.ts:34

___

### dao

• `Readonly` **dao**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `node` | `Object` |
| `node.trusted` | `Object` |
| `node.trusted.actions` | [`DAONodeTrustedActions`](DAONodeTrustedActions) |
| `node.trusted.node` | [`DAONodeTrusted`](DAONodeTrusted) |
| `node.trusted.proposals` | [`DAONodeTrustedProposals`](DAONodeTrustedProposals) |
| `node.trusted.settings` | [`DAONodeTrustedSettings`](DAONodeTrustedSettings) |
| `proposals` | [`DAOProposal`](DAOProposal) |

#### Defined in

rocketpool/rocketpool.ts:35

___

### deposit

• `Readonly` **deposit**: [`Deposit`](Deposit)

#### Defined in

rocketpool/rocketpool.ts:46

___

### minipool

• `Readonly` **minipool**: [`Minipool`](Minipool)

#### Defined in

rocketpool/rocketpool.ts:47

___

### network

• `Readonly` **network**: [`Network`](Network)

#### Defined in

rocketpool/rocketpool.ts:48

___

### node

• `Readonly` **node**: [`Node`](Node)

#### Defined in

rocketpool/rocketpool.ts:49

___

### settings

• `Readonly` **settings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `auction` | [`AuctionSettings`](AuctionSettings) |
| `deposit` | [`DepositSettings`](DepositSettings) |
| `minipool` | [`MinipoolSettings`](MinipoolSettings) |
| `network` | [`NetworkSettings`](NetworkSettings) |
| `node` | [`NodeSettings`](NodeSettings) |

#### Defined in

rocketpool/rocketpool.ts:50

___

### tokens

• `Readonly` **tokens**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `reth` | [`RETH`](RETH) |
| `rpl` | [`RPL`](RPL) |
| `legacyrpl` | [`LegacyRPL`](LegacyRPL) |

#### Defined in

rocketpool/rocketpool.ts:57

___

### rewards

• `Readonly` **rewards**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pool` | [`Pool`](Pool) |
| `claimNode` | [`Rewards`](Rewards) |
| `claimDAO` | [`Rewards`](Rewards) |
| `claimTrustedNode` | [`Rewards`](Rewards) |

#### Defined in

rocketpool/rocketpool.ts:58

___

### vault

• `Readonly` **vault**: [`Vault`](Vault)

#### Defined in

rocketpool/rocketpool.ts:64

___

### web3

• `Readonly` **web3**: `default`

___

### RocketStorage

• `Readonly` **RocketStorage**: `string` \| `ContractArtifact`
