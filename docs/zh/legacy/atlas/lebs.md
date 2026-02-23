# 8-ETH 保证金迷你矿池

当 Rocket Pool 首次启动时,它支持两种类型的迷你矿池:

1. **16-ETH 保证金**,节点运营者提供 16 ETH,剩余的 16 ETH 将来自质押池,以创建一个完整的(32 ETH)验证者。
2. **32-ETH 临时保证金**,节点运营者提供全部 32 ETH,以便可以跳过初始化过程并立即在信标链上开始验证,然后在存款池有足够的 ETH 覆盖时获得 16 ETH 的退款。此时它将变成普通的 16-ETH 保证金迷你矿池。

后者在协议运行几个月后被社区投票移除,因为它不再必要并导致退款延迟。

前者代表了协议的最低保证金数额,因为它保证了如果节点运营者使用 Rocket Pool 攻击以太坊协议并被削减*全部保证金*,他们的损失将与 rETH 质押者一样多,不会获利。

自 Rocket Pool 启动以来,社区对此保证金提供的安全性进行了[大量研究](https://dao.rocketpool.net/t/leb8-discussion-thread/899),并发现它非常保守。
从各方面来看,16 ETH 的削减被认为是不现实的,16-ETH 保证金实际上提供了与仅 8 ETH 保证金(加上补充的 RPL 要求)相同的安全优势。
因此,在此研究的支持下,Atlas 升级引入了一种新的迷你矿池类型:**8-ETH 保证金**,Rocket Pool 社区通俗地称为"LEB8"(Lower ETH Bond - 8 ETH)。

要创建 8-ETH 迷你矿池,节点运营者只需提供**他们自己的 8 ETH**(加上足够的 RPL 以满足抵押品要求 - 有关更多信息,请参阅 [RPL 抵押品](#rpl-抵押品))。
然后它将从存款池中提取**24 ETH**,以完成验证者并在信标链上开始工作。

这为想要运行节点但没有 16 ETH 的新节点运营者**打开了大门**。
此外,它让更大的节点运营者**让更多的池质押者 ETH 在信标链上工作**,赚取奖励。
由于这在不显著降低安全性的情况下运作,每个人都是赢家!

在本指南中,我们将涵盖三个主题:

- 8-ETH 保证金迷你矿池的实际工作原理以及背后的奖励数字
- 如何创建新的 8-ETH 迷你矿池
- 如何在不退出的情况下将*现有的* 16-ETH 迷你矿池迁移到 8-ETH 迷你矿池

继续阅读以了解每个主题的更多信息。

## 8-ETH 保证金迷你矿池的工作原理

从机制上讲,8-ETH 保证金迷你矿池与协议中的其他迷你矿池**完全相同**。
它们仍然"拥有"信标链上的验证者(它们代表该验证者的提款凭证),它们仍然带有佣金(尽管 Atlas 的佣金**将固定为 14%** 用于所有新迷你矿池),并且它们提供与 16-ETH 保证金迷你矿池相同的功能。
区别完全在于数字。

### 奖励

从盈利能力的角度来看(*纯粹*从 ETH 奖励的角度看,忽略 RPL),具有 14% 佣金的 8-ETH 保证金迷你矿池为节点运营者提供的奖励*甚至比* *20% 佣金的 16-ETH 保证金迷你矿池*更多(截至 Redstone,这是最高的奖励配置)。
同时,由于节点运营者更有效地利用 rETH 持有者的资本,它们也为 *rETH 持有者*提供更多的奖励。

让我们通过一个简单的例子来说明。
假设我们是一个有 16 ETH 可用于质押的节点运营者(加上所需的 RPL 保证金)。
假设我们在信标链上每个验证者赚取了 1 ETH 的奖励。
以下是单个 16-ETH 迷你矿池在 20% 佣金下的计算,与两个 14% 佣金的 8-ETH 迷你矿池相比的数学:

```
1x 16 ETH 迷你矿池 @ 20%:
奖励: 1 ETH
节点份额 = (16/32) + (16/32 * 0.2)
         = 0.5 + (0.5 * 0.2)
         = 0.5 + 0.1
         = 0.6 ETH

rETH 份额 = 1 - 0.6
          = 0.4 ETH


2x 8 ETH 迷你矿池 @ 14%:
奖励: 2 ETH
节点份额 = ((8/32) + (24/32 * 0.14)) * 2
         = (0.25 + (0.75 * 0.14)) * 2
         = (0.25 + 0.105) * 2
         = 0.71 ETH

rETH 份额 = 2 - 0.71
          = 1.29 ETH
```

换句话说,节点运营者通过两个 8-ETH 迷你矿池将比单个 20% 佣金的 16-ETH 迷你矿池多赚取 **18% 的 ETH**。

### RPL 抵押品

为了创建 8-ETH 迷你矿池,节点运营者仍然需要质押足够的 RPL 以满足其节点的最低抵押品要求(考虑其所有不同保证金规模的迷你矿池)。

这些规则在 Atlas 中已经明确:

- 每个迷你矿池的**最低 RPL** 是***借入*金额的 10%**
- 每个迷你矿池的**最高 RPL** 是***保证金*金额的 150%**

对于 16-ETH 迷你矿池,这保持不变;最低为 1.6 ETH 价值的 RPL,最高为 24 ETH 价值的 RPL。

对于 8-ETH 迷你矿池,这变成了**最低 2.4 ETH 价值的 RPL**(借入金额的 10%,即 24 ETH)和**最高 12 ETH 价值的 RPL**(保证金金额的 150%)。

这些数字是由 Rocket Pool 社区[作为治理投票的一部分](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671)选择的。

## 创建新的 8-ETH 迷你矿池

使用 8-ETH 保证金创建新迷你矿池的过程与创建 16-ETH 迷你矿池的过程相同。

只需运行以下命令:

```shell
rocketpool node deposit
```

当提示您输入保证金金额时,选择 `8 ETH`:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip 注意
此示例还展示了[**新存款信用系统**](../../node-staking/credit)的使用。
由于节点运营者有 8 ETH 的信用,创建这个 8-ETH 迷你矿池是免费的!
:::

就是这样!
其余过程与[常规迷你矿池创建说明](../../node-staking/create-validator.mdx)相同。
