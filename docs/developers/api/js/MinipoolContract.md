# Class: MinipoolContract

Rocket Pool Minipool Contract Instance Wrapper

## Constructors

### constructor

• **new MinipoolContract**(`web3`, `address`, `contract`)

Create a new Minipool Contract instance.

#### Parameters

| Name       | Type       | Description           |
| :--------- | :--------- | :-------------------- |
| `web3`     | `default`  | A valid Web3 instance |
| `address`  | `string`   | -                     |
| `contract` | `Contract` | -                     |

#### Defined in

rocketpool/minipool/minipool-contract.ts:43

## Properties

### address

• `Readonly` **address**: `string`

---

### contract

• `Readonly` **contract**: `Contract`

## Methods

### getStatusDetails

▸ **getStatusDetails**(): `Promise`<`StatusDetails`\>

Get status details

**`example`** using Typescript

```ts
const statusDetails = minipool.getStatusDetails().then((val: StatusDetails) => { val };
```

#### Returns

`Promise`<`StatusDetails`\>

a Promise<StatusDetails\> that resolves to a StatusDetails object (status, block, time)

#### Defined in

rocketpool/minipool/minipool-contract.ts:54

---

### getStatus

▸ **getStatus**(): `Promise`<`number`\>

Get status of a minipool

**`example`** using Typescript

```ts
const status = minipool.getStatus().then((val: number) => { val };
```

#### Returns

`Promise`<`number`\>

a Promise<number\> that resolves to a number representing the minipool status

#### Defined in

rocketpool/minipool/minipool-contract.ts:73

---

### getStatusBlock

▸ **getStatusBlock**(): `Promise`<`number`\>

Get status block of a minipool

**`example`** using Typescript

```ts
const statusBlock = minipool.getStatusBlock().then((val: number) => { val };
```

#### Returns

`Promise`<`number`\>

a Promise<number\> that resolves to a number representing the status block of a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:86

---

### getStatusTime

▸ **getStatusTime**(): `Promise`<`Date`\>

Get status timestamp of a minipool

**`example`** using Typescript

```ts
const statusTime = minipool.getStatusBlock().then((val: Date) => { val };
```

#### Returns

`Promise`<`Date`\>

a Promise<Date\> that resolves to a Date representing the timestamp a minipool status

#### Defined in

rocketpool/minipool/minipool-contract.ts:102

---

### getDepositType

▸ **getDepositType**(): `Promise`<`number`\>

Get the deposit type

**`example`** using Typescript

```ts
const depositType = minipool.getDepositType().then((val: number) => { val };
```

#### Returns

`Promise`<`number`\>

a Promise<number\> that resolves to a number representing the deposit type

#### Defined in

rocketpool/minipool/minipool-contract.ts:118

---

### getNodeDetails

▸ **getNodeDetails**(): `Promise`<`NodeDetails`\>

Get the node details of a minipool

**`example`** using Typescript

```ts
const nodeDetails = minipool.getNodeDetails().then((val: NodeDetails) => { val };
```

#### Returns

`Promise`<`NodeDetails`\>

a Promise<NodeDetails\> that resolves to a NodeDetails object representing details about the minipool's nodes

#### Defined in

rocketpool/minipool/minipool-contract.ts:131

---

### getNodeAddress

▸ **getNodeAddress**(): `Promise`<`string`\>

Get the node address of a minipool

**`example`** using Typescript

```ts
const nodeAddress = minipool.getNodeAddress().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the node address of the minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:158

---

### getNodeFee

▸ **getNodeFee**(): `Promise`<`number`\>

Get the node fee of a minipool

**`example`** using Typescript

```ts
const nodeFee = minipool.getNodeFee().then((val: number) => { val };
```

#### Returns

`Promise`<`number`\>

a Promise<number\> that resolves to a number representing the node fee of the minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:171

---

### getNodeDepositBalance

▸ **getNodeDepositBalance**(): `Promise`<`string`\>

Get the node deposit balance of a minipool

**`example`** using Typescript

```ts
const nodeBalanceDeposit = minipool.getNodeDepositBalance().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the node deposit balance of a minipool in Wei

#### Defined in

rocketpool/minipool/minipool-contract.ts:184

---

### getNodeRefundBalance

▸ **getNodeRefundBalance**(): `Promise`<`string`\>

Get the node refund balance of a minipool

**`example`** using Typescript

```ts
const nodeRefundDeposit = minipool.getNodeRefundBalance().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the node refund balance of a minipool in Wei

#### Defined in

rocketpool/minipool/minipool-contract.ts:197

---

### getNodeDepositAssigned

▸ **getNodeDepositAssigned**(): `Promise`<`boolean`\>

Get if a node deposit has been assigned for a minipool

**`example`** using Typescript

```ts
const nodeDepositAssigned = minipool.getNodeDepositAssigned().then((val: boolean) => { val };
```

#### Returns

`Promise`<`boolean`\>

a Promise<boolean\> that resolves to a boolean representing if a node deposit has been assigned for a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:210

---

### getScrubVoted

▸ **getScrubVoted**(): `Promise`<`boolean`\>

Get if a minipool has had scrub votes

**`example`** using Typescript

```ts
const scrubVoted = minipool.getScrubVoted().then((val: boolean) => { val };
```

#### Returns

`Promise`<`boolean`\>

a Promise<boolean\> that resolves to a boolean representing if a minipool has had scrub votes

#### Defined in

rocketpool/minipool/minipool-contract.ts:223

---

### getTotalScrubVotes

▸ **getTotalScrubVotes**(): `Promise`<`number`\>

Get the total scrub votes for a minipool

**`example`** using Typescript

```ts
const totalScrubVotes = minipool.getTotalScrubVotes().then((val: number) => { val };
```

#### Returns

`Promise`<`number`\>

a Promise<number\> that resolves to a number representing the total number of scrub votes a minipool has

#### Defined in

rocketpool/minipool/minipool-contract.ts:236

---

### getUserDetails

▸ **getUserDetails**(): `Promise`<`UserDetails`\>

Get user deposit details

**`example`** using Typescript

```ts
const userDetails = minipool.getUserDetails().then((val: UserDetails) => { val };
```

#### Returns

`Promise`<`UserDetails`\>

a Promise<UserDetails\> that resolves to a UserDetails object representing the user details (depositBalance, depositAssigned, depositAssignedTime) for a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:249

---

### getUserDepositBalance

▸ **getUserDepositBalance**(): `Promise`<`string`\>

Get user deposit balance

**`example`** using Typescript

```ts
const userDepositBalance = minipool.getUserDepositBalance().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the user deposit balance for a minipool in Wei

#### Defined in

rocketpool/minipool/minipool-contract.ts:268

---

### getUserDepositAssigned

▸ **getUserDepositAssigned**(): `Promise`<`boolean`\>

Get user deposit assigned

**`example`** using Typescript

```ts
const userDepositAssigned = minipool.getUserDepositAssigned().then((val: boolean) => { val };
```

#### Returns

`Promise`<`boolean`\>

a Promise<boolean\> that resolves to a boolean representing if the user deposit has been assigned

#### Defined in

rocketpool/minipool/minipool-contract.ts:281

---

### getUserDepositAssignedTime

▸ **getUserDepositAssignedTime**(): `Promise`<`Date`\>

Get a timestamp for when the user deposit was assigned for the minipool

**`example`** using Typescript

```ts
const userDepositAssignedTime = minipool.getUserDepositAssignedTime().then((val: boolean) => { val };
```

#### Returns

`Promise`<`Date`\>

a Promise<Date\> that resolves to a Date representing the timestamp the user deposit was assigned for the minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:294

---

### getStakingDetails

▸ **getStakingDetails**(): `Promise`<`StakingDetails`\>

Get a staking details for a minipool

**`example`** using Typescript

```ts
const stakingDetails = minipool.getStakingDetails().then((val: StakingDetails) => { val };
```

#### Returns

`Promise`<`StakingDetails`\>

a Promise<StakingDetails\> that resolves to a StakingDetails object representing staking details (start & end balance) for a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:310

---

### getStakingStartBalance

▸ **getStakingStartBalance**(): `Promise`<`string`\>

Get a staking start balance for a minipool

**`example`** using Typescript

```ts
const stakingStartBalance = minipool.getStakingStartBalance().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the staking start balance for a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:328

---

### getStakingEndBalance

▸ **getStakingEndBalance**(): `Promise`<`string`\>

Get a staking end balance for a minipool

**`example`** using Typescript

```ts
const stakingEndBalance = minipool.getStakingEndBalance().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the staking end balance for a minipool

#### Defined in

rocketpool/minipool/minipool-contract.ts:341

---

### getWithdrawalCredentials

▸ **getWithdrawalCredentials**(): `Promise`<`string`\>

Get a minipool's withdrawal credentials

**`example`** using Typescript

```ts
const withdrawalCredentials = minipool.getWithdrawalCredentials().then((val: string) => { val };
```

#### Returns

`Promise`<`string`\>

a Promise<string\> that resolves to a string representing the minipool's withdrawal credentials

#### Defined in

rocketpool/minipool/minipool-contract.ts:354

---

### getNodeWithdrawn

▸ **getNodeWithdrawn**(): `Promise`<`boolean`\>

Check if a minipool's node is withdrawn

**`example`** using Typescript

```ts
const nodeWithdrawn = minipool.getNodeWithdrawn().then((val: boolean) => { val };
```

#### Returns

`Promise`<`boolean`\>

a Promise<boolean\> that resolves to a boolean representing if the minipool's node is withdrawn

#### Defined in

rocketpool/minipool/minipool-contract.ts:367

---

### dissolve

▸ **dissolve**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Dissolve the minipool

**`example`** using Typescript

```ts
const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
const options = {
		from: node,
		gas: 1000000
};
const txReceipt = minipool.dissolve(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:387

---

### slash

▸ **slash**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Slash the minipool

**`example`** using Typescript

```ts
const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
const options = {
		from: node,
		gas: 1000000
};
const txReceipt = minipool.slash(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:407

---

### refund

▸ **refund**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Refund node ETH refinanced from user deposited ETH

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.refund(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:427

---

### stake

▸ **stake**(`validatorSignature`, `depositDataRoot`, `options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Progress the minipool to staking, sending its ETH deposit to the VRC
Only accepts calls from the minipool owner (node) while in prelaunch and once scrub period has ended

**`example`** using Typescript

```ts
const validatorSignature = <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23>;
const depositDataRoot = <Buffer 48 ad 0b 82 2c d6 81 f9 c9 8b 06 a1 8b 93 4b df 7f 40 76 80 fb 7a 3b 5c cd 2c 92 a6 4a 58 e9 05>;
const owner = "0x8B0EF9f1932A2e44c3D27bE4C70C3BC07A6A27B3"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.stake(validatorSignature, depositDataRoot, options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name                 | Type                  | Description                                         |
| :------------------- | :-------------------- | :-------------------------------------------------- |
| `validatorSignature` | `Buffer`              | A buffer containing the validator signature         |
| `depositDataRoot`    | `Buffer`              | A buffer containing the deposit data                |
| `options?`           | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?`    | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:452

---

### finalise

▸ **finalise**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Finalise and unlock their RPL stake

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.finalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:472

---

### withdraw

▸ **withdraw**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Withdraw node balances & rewards from the minipool and close it

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.withdraw(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:492

---

### distributeBalanceAndFinalise

▸ **distributeBalanceAndFinalise**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Distributes the contract's balance and finalises the pool

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.distributeBalanceAndFinalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:512

---

### distributeBalance

▸ **distributeBalance**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Distributes the contract's balance
When called during staking status, requires 16 ether in the pool
When called by non-owner with less than 16 ether, requires 14 days to have passed since being made withdrawable

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.distributeBalance(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:534

---

### voteScrub

▸ **voteScrub**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Mark a minipool as scrub, we don't want no scrubs

**`example`** using Typescript

```ts
const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // can only be called by a DAO member
const options = {
		from: daoMember,
		gas: 1000000
};
const txReceipt = minipool.voteScrub(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:554

---

### close

▸ **close**(`options?`, `onConfirmation?`): `Promise`<`TransactionReceipt`\>

Withdraw node balances from the minipool and close it

**`example`** using Typescript

```ts
const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
const options = {
		from: owner,
		gas: 1000000
};
const txReceipt = minipool.close(options).then((txReceipt: TransactionReceipt) => { txReceipt };
```

#### Parameters

| Name              | Type                  | Description                                         |
| :---------------- | :-------------------- | :-------------------------------------------------- |
| `options?`        | `SendOptions`         | An optional object of web3.eth.Contract SendOptions |
| `onConfirmation?` | `ConfirmationHandler` | An optional confirmation handler object             |

#### Returns

`Promise`<`TransactionReceipt`\>

a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction

#### Defined in

rocketpool/minipool/minipool-contract.ts:574
