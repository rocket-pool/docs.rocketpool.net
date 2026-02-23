::: danger 警告
目前为准备 Saturn 1 升级，minipool 存款功能已暂时禁用。
:::

# 存款信用系统

存款信用系统是一种机制，用于追踪节点运营者之前质押但不再需要的 ETH，并使其可供再次使用。
这些信用来自两个来源：

- [将现有的 16-ETH 质押 minipool 迁移至 8-ETH 质押 minipool](./leb-migration.mdx)（这将为节点运营者的信用余额增加 8 ETH）
- [将现有的独立验证者迁移](./solo-staker-migration)到 minipool（根据迁移时创建的 minipool 类型，这将为节点运营者的信用余额增加 16 或 24 ETH）

每个节点运营者的初始信用余额为 **0 ETH**。
执行这两种操作中的任何一种都会相应增加余额。

这些 ETH 不会被流动化并返还给节点运营者；相反，它可以用于**创建额外的 minipool**，而无需节点运营者提供任何 ETH。

信用系统对节点运营者是**透明的**；在执行 `rocketpool node deposit` 或 `rocketpool node create-vacant-minipool` 操作时，如果可能的话，系统会自动使用信用（Smartnode CLI 会通知将使用信用）。
如果无法使用，Smartnode 会提醒用户无法使用信用，并且在执行任一操作时需要正常的 ETH 质押。

更多详情请参阅下面的[信用可用性](#credit-availability)部分。

## 示例

假设您的信用余额为 0 ETH，并且有一个 16-ETH 质押的 minipool。
然后您可以[将该 minipool 迁移至 8-ETH 质押](./leb-migration.mdx)。
这将产生 **8 ETH** 不再被质押。
这 8 ETH 将被放入您的**信用余额**中。

现在，假设您想要创建第二个 8-ETH 的 minipool。
您照常运行 `rocketpool node deposit`，并选择 8-ETH 作为质押金额。
这通常需要您为 minipool 提供 8 ETH。
但是，由于您有 8 ETH 的信用余额，Rocket Pool 将**自动使用该余额**：

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

第二组提示是相关的：它们告诉您在信用余额中有足够的 ETH 来支付此次存款*并且可以使用*，因此系统会自动使用余额，不需要从您的节点钱包中提供任何额外的 ETH。

有关信用余额可用性的详细信息，请参阅[下面的可用性部分](#credit-availability)。

## 查看您当前的信用余额

要查看您当前的信用余额，只需运行以下命令：

```shell
rocketpool node status
```

这会生成关于您节点的详细信息列表，包括顶部显示的信用余额：

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## 信用可用性

在某些情况下，您的节点可能有可用的信用余额，但目前无法使用它来部署额外的 minipool。

您的信用余额的 ETH 来自**存款池**。
因此，如果您想使用 8 ETH 信用来创建一个新的 8-ETH minipool，最终将从存款池中取出该 minipool 的**全部 32 ETH**，而不需要您提供任何 ETH。
因此，如果存款池中没有足够的 ETH 来覆盖预存款值（目前设置为 1 ETH），**余额将不可用**。

在这种情况下，Smartnode 会在 `rocketpool node deposit` 操作期间提醒您**无法**使用您的信用余额，必须使用节点钱包中的 ETH 来完成质押。
这样做**不会**消耗您的信用余额；它将保持原样，并在存款池有足够余额后可供使用。
