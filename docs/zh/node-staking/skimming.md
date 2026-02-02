# 分配 Skimmed 奖励

您因为为 Ethereum 运行验证者而获得的 ETH 奖励会定期通过一个称为"skimming"的过程发送到您的 minipool。
skim 的频率取决于信标链上活跃验证者的数量。在撰写本文时，验证者的数量约为
500,000，这导致 skim 大约每 2-3 天发生一次。

Skimmed 奖励将累积在您的每个 minipool 中，直到您"分配"它们。此过程根据您的佣金率和提供和提供的 ETH 比率在您（节点运营商）和 rETH 持有者之间分配 skimmed 奖励。

::: warning 注意
为了访问您的 minipool 余额，您需要先升级到 [Atlas delegate](./minipools/delegates)。
旧的 Redstone delegate 无法用于分配 minipool 的余额。
:::

## 自动分配

默认情况下，Smartnode 配置为在任何 minipool 的单个余额达到 **1 ETH** 时自动分配它们。此
阈值可以通过以下步骤在 TUI 中配置。

运行：

```shell
rocketpool service config
```

导航到设置 `Smartnode and TX Fee Settings > Auto Distribute Threshold`，如下所示。

![](./images/tui-automatic-skimming.png)

更改此设置将调整 Smartnode 自动分配 minipool 的阈值。
将参数设置为 0 将禁用自动分配。

::: warning 警告
如果您决定禁用自动分配，重要的是您仍然定期执行手动分配。
阅读下面的[手动分配部分](#手动分配)以了解如何执行此操作。

在很长一段时间后，您的 skimmed 奖励可能会超过 8 ETH。如果发生这种情况，您将无法再
分配它们，并且需要退出验证者才能访问您累积的奖励。

Rocket Pool 具有一项故障安全设计，允许任何人在长时间等待后，当
minipool 余额超过 8 ETH 时分配您的 minipool。为了保护您的资本，Smartnode 监控这种情况，并将在发生时自动退出
您的 minipool。
:::

## 手动分配

如果您禁用了 skimmed 奖励的自动分配，您需要使用以下过程定期自行分配它们。

您还可以使用此过程随时手动分配奖励，而无需等待上述自动过程。

如果您的 minipool 中少于 8 ETH，您可以使用以下命令分配奖励：

```shell
rocketpool minipool distribute-balance
```

这将显示您有资格分配的 minipool、它们有多少 ETH，以及您（节点运营商）将收到多少 ETH：

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

使用原始启动 delegate 的任何 minipool 将在开始时提及，让您知道在升级其 delegate 之前无法对它们调用 `distribute-balance`。
此 delegate 是在指定 skimmed 提款之前编写的，因此不具有分配 skimmed 奖励的方法。

请注意，对于符合条件的 minipool，您还会看到**退款金额**。
这是直接欠您的金额（例如，因为您在[从 16-ETH 绑定迁移到 8-ETH 绑定](./leb-migration.mdx)之前在 minipool 中有余额，或者您[将单独验证者转换为 minipool](./solo-staker-migration)并带有现有奖励）。
它不会与 rETH 持有者共享。

输入您要分配的 minipool 的编号。
您将像往常一样看到燃气价格图表，并被要求确认您的决定。
一旦您确认，您的 minipool 余额将被分配：

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

正如您从[交易](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9)中看到的，这为节点的提款地址提供了节点的奖励份额（加上退款金额），并将其余部分返还给质押池。
