# 费用分配器和平滑池

现在[合并](https://ethereum.org/en/upgrades/merge/)已经完成,节点运营者从他们向Ethereum链提议的任何区块中包含的交易中获得**优先费**(**小费**)。
这些费用来自并停留在Execution层。

与大多数在Consensus层生成并定期自动提取的验证奖励不同,这些费用是_立即可用的_。
通常,优先费为您提供的ETH几乎与Beacon Chain奖励一样多,因此它们是合并后非常好的福利。

::: tip 注意
快速提醒一下,这里是不同类型奖励及其提供层的细分:

- Consensus层:证明、区块提议、同步委员会、惩罚报告
- Execution层:来自区块提议的优先费和MEV(将在下一节讨论)

:::

## 费用接收者

当您在Ethereum链上提议区块时,协议需要知道将区块中包含的每笔交易的小费发送到哪里。
它不能将它们发送到您验证者的地址,因为那是在Consensus层上 - 不是Execution层。
它不能将它们发送到您的minipool地址,因为它必须适用于solo质押者,而solo质押者在Execution层上没有附加到他们验证者的地址,就像Rocket Pool那样。

相反,它的工作方式相当直接:当Rocket Pool启动您的Validator客户端时,它会传入一个称为**费用接收者**的参数。
费用接收者只是Execution层上您想要小费发送到的地址。

Rocket Pool旨在公平地在您和rETH池质押者之间分配这些奖励,就像它公平分配您的Beacon链奖励一样:您的minipool验证者赚取的任何优先费的一部分将归您所有(加上所有minipool的平均佣金),剩余部分将归池质押者所有(减去您的平均佣金)。
确切的比例取决于您拥有的8 ETH保证金与16 ETH保证金minipool的数量。

为此,Smartnode将自动将您节点的`费用接收者`设置为以下特殊合约之一:

- 您节点自己的个人**费用分配器**(默认)
- **平滑池**(选择加入)

简而言之,**费用分配器**是附加到您节点的唯一合约,它收集并公平地在您和rETH质押者之间拆分您的优先费。
它就像您自己的优先费个人金库。
任何人(包括您)都可以随时分配其余额,以确保奖励始终对rETH质押者可用。

**平滑池**是一个特殊的选择加入合约,它允许所有参与的节点运营者聚合和汇集他们的优先费,并在每个Rocket Pool奖励间隔(目前每28天)期间在参与者和rETH池质押者之间平均分配它们。
对于不想担心获得高优先费区块提议所涉及的运气因素,而宁愿拥有良好、规律、一致的每月收入的节点运营者来说,这是一个非常引人注目的功能。

我们将在下面介绍这两者,以便您了解差异以及您是否想加入平滑池。

::: tip 注意
对于2024-10-28之后创建的minipool,强烈建议使用平滑池,因为它用于分配奖励佣金。如果您退出平滑池,这些minipool将总共获得5%的佣金。如果您选择加入平滑池,这些minipool将获得10%(未质押RPL)到14%(RPL质押价值为借入ETH的10%或更多)的佣金。
:::

## 您的费用分配器

您的费用分配器是Execution层上**特定于您节点**的唯一合约。
它将保存您随时间累积的所有优先费,并包含公平拆分和分配给rETH池质押者和您的提款地址所需的逻辑。
这个分配过程**可以由任何人调用**(包括rETH质押者),并且可以**随时**完成。
它没有奖励到期之前的时间限制。

您节点费用分配器的地址**根据您的节点地址确定性地确定**。
这意味着它是提前知道的,甚至在费用分配器创建之前。

新的Rocket Pool节点将在注册时自动创建(初始化)其节点的费用分配器合约。
在Redstone升级之前创建的节点需要手动完成此过程。
这只需要运行一次。

这样做的一个有趣后果是,您的分配器地址可能在您**初始化**费用分配器合约**之前**就开始累积余额。
这没关系,因为您的分配器一旦初始化就会获得所有现有余额的访问权限。

**默认情况下,您的节点将使用其费用分配器作为验证者的费用接收者。**

### 查看其地址和余额

您可以查看费用分配器的地址和余额作为以下内容的一部分:

```shell
rocketpool node status
```

输出将如下所示:

![](../node-staking/images/status-fee-distributor.png)

### 初始化费用分配器

要初始化您节点的分配器,只需运行此新命令:

```shell
rocketpool node initialize-fee-distributor
```

::: warning 注意
如果您在Redstone更新之前创建了节点,则必须在使用`rocketpool node deposit`创建任何新minipool之前调用此函数一次。
:::

当您的分配器已初始化时,您可以使用以下命令声明和分配其全部余额:

```shell
rocketpool node distribute-fees
```

这将把您的奖励份额发送到您的**提款地址**。

::: warning 关于应税事件的注意事项
每当您创建新的minipool时,Rocket Pool将自动调用`distribute-fees`。
这是为了确保您累积的任何费用都使用您节点的平均佣金分配,这在您创建新minipool时可能会改变。

另外,请注意任何人都可以在您的费用分配器上调用`distribute-fees`(以防止您扣留rETH奖励)。
每当调用此方法时,您可能会产生应税事件。

在决定是否使用平滑池(下文讨论)时,请记住这些条件。
:::

### 惩罚系统

为了确保节点运营者不会通过手动修改其Validator客户端中使用的费用接收者来"作弊",Rocket Pool采用了惩罚系统。

Oracle DAO不断监控Rocket Pool节点运营者产生的每个区块。

如果节点_退出_平滑池,以下地址被视为有效的费用接收者:

- rETH地址
- 平滑池地址
- 节点的费用分配器合约

如果节点_加入_平滑池,以下地址被视为有效的费用接收者:

- 平滑池地址

除上述有效地址之外的费用接收者被视为**无效**。

使用**无效**费用接收者提议区块的minipool将被**发出警告**。
在第三次警告后,minipool将开始接收**违规** - 每次违规将扣除**其总Beacon Chain余额的10%,包括ETH收益**,并在从minipool提取资金时将其发送给rETH池质押者。

违规是在**minipool**级别,而不是**节点**级别。

Smartnode软件旨在确保诚实的用户永远不会受到惩罚,即使它必须使Validator客户端离线才能做到这一点。
如果发生这种情况,您将停止证明,并在日志文件中看到关于Smartnode无法正确设置费用接收者的错误消息。

## 平滑池

**平滑池**是Rocket Pool网络为我们的节点运营者提供的独特选择加入功能。
本质上,它成为每个选择加入的节点运营者的费用接收者,并将这些节点运营者提议的区块的优先费集体累积到一个大池中。在Rocket Pool奖励检查点(与用于分配RPL奖励的检查点相同)期间,池的总ETH余额在池质押者和选择加入的节点运营者之间公平分配。

从本质上讲,平滑池是一种有效消除与被选中进行区块提议相关的随机性的方法。
如果您曾经有过运气不佳的经历,几个月没有提议,或者您的区块提议只有低优先费,您可能会觉得平滑池非常令人兴奋。

为了使数学易于理解,社区成员Ken Smith整理了一份[大规模分析](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf),比较了平滑池和费用分配器的盈利能力,用这张图表很好地总结了:

![](../node-staking/images/sp-chart.png)

简而言之,只要平滑池拥有的minipool比您多,您加入它就更有可能获得更好的收益。

### 规则

平滑池使用以下规则:

- 在分配平滑池余额的Rocket Pool奖励检查点期间,合约的总ETH余额被分成两部分。
  - rETH质押者获得1/2(对于16 ETH保证金)或3/4(对于8 ETH保证金,即LEB8),减去所有选择加入节点运营者的**平均佣金**
  - 剩余部分归选择加入的节点运营者所有。

- 加入平滑池是在**节点级别**完成的。如果您选择加入,您的所有minipool都选择加入。

- 任何人都可以随时选择加入。他们必须等待完整的奖励间隔(Hoodi上为3天,主网上为28天)才能退出,以防止操纵系统(例如在被选中提议区块后立即离开SP)。
  - 一旦退出,他们必须再等待一个完整的间隔才能重新加入。

- 平滑池计算每个选择加入的节点拥有的每个minipool的"份额"(间隔期间池ETH的部分)。
  - 份额是您的minipool在间隔期间表现的函数(通过查看您在Beacon Chain上发送了多少证明以及错过了多少证明来计算),以及您minipool的佣金率。

- 您节点的总份额是您的minipool份额的总和。

- 您节点的总份额按您选择加入的时间进行缩放。
  - 如果您在整个间隔期间都选择加入,您将获得全额份额。
  - 如果您在间隔的30%时间选择加入,您将获得全额份额的30%。

如果您对平滑池奖励计算的完整技术细节感兴趣,请查看[此处的完整规范](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards)。

### 加入和离开平滑池

要选择加入平滑池,运行以下命令:

```shell
rocketpool node join-smoothing-pool
```

这将在Rocket Pool合约中记录您为选择加入,并自动将您的Validator客户端的`费用接收者`从您节点的分配器合约更改为平滑池合约。

要离开池,运行此命令:

```shell
rocketpool node leave-smoothing-pool
```

这将在Rocket Pool合约中记录您为退出,并且在经过短暂延迟后,将自动将您的Validator客户端的`费用接收者`从平滑池合约更改回您节点的费用分配器合约。

### 从平滑池声明奖励

来自平滑池的奖励在每个奖励间隔结束时使用Redstone奖励系统与RPL捆绑在一起。
声明它们就像运行以下命令一样简单:

```shell
rocketpool node claim-rewards
```

如果选择加入平滑池,您会注意到每个间隔获得的ETH数量大于零:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

请注意,此处间隔1中的平滑池奖励表明该节点在该间隔期间选择加入并相应地获得了奖励。

我们将在指南的后面,在[声明奖励](./rewards)部分中更多地介绍声明RPL和平滑池奖励。

## 下一步

一旦您决定是否要加入平滑池,请查看下一节关于MEV和MEV奖励的内容。
