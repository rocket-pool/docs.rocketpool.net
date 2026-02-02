# 8-ETH 保证金 Minipool

当 Rocket Pool 首次启动时,它支持两种类型的 minipool:

1. **16-ETH 保证金**,其中节点运营商提供 16 ETH,剩余的 16 ETH 将来自质押池,以创建一个完整的(32 ETH)验证器。
2. **32-ETH 临时保证金**,其中节点运营商提供所有 32 ETH,以便他们可以跳过初始化过程并立即开始在信标链上验证,然后在存款池有足够的 ETH 覆盖时获得 16 ETH 的退款。此时它将变成正常的 16-ETH 保证金 minipool。

后者在协议生命的几个月后通过社区投票被删除,因为它不再必要并导致长时间的退款延迟。

前者代表了协议的最低保证金金额,因为它保证如果节点运营商使用 Rocket Pool 攻击以太坊协议并且其_整个保证金_被罚没,他们将损失与 rETH 质押者一样多,并且不会获利。

自 Rocket Pool 启动以来,社区对这种保证金提供的安全性进行了[大量研究](https://dao.rocketpool.net/t/leb8-discussion-thread/899),发现它非常保守。
就所有意图和目的而言,16 ETH 的罚没被认为是不现实的,16-ETH 保证金有效地提供了与仅 8 ETH 保证金(加上补充 RPL 要求)相同的安全优势。
因此,在这项研究的支持下,Atlas 升级向列表中引入了一种新型 minipool:**8-ETH 保证金**,Rocket Pool 社区通俗地称为"LEB8"(Lower ETH Bond - 8 ETH)。

要创建 8-ETH minipool,节点运营商只需要提供**8 个自己的 ETH**(加上足够的 RPL 来满足抵押要求 - 有关详细信息,请参阅 [RPL 抵押品](#rpl-collateral))。
然后它将从存款池中提取 **24 ETH**,以完成验证器并在信标链上开始工作。

这**为想要运行节点但没有足够 16 ETH 的新的潜在节点运营商打开了大门**。
此外,它让更大的节点运营商**在信标链上投入更多池质押者的 ETH** 以赚取奖励。
由于这在不显著损害安全性的情况下运作,每个人都赢了!

在本指南中,我们将涵盖三个主题:

- 8-ETH 保证金 minipool 实际上如何工作,以及它们背后的奖励数字
- 如何创建新的 8-ETH minipool
- 如何在不退出的情况下将_现有的_ 16-ETH minipool 迁移到 8-ETH minipool

继续阅读以了解有关每个主题的更多信息。

## 8-ETH 保证金 Minipool 如何工作

从机制上讲,8-ETH 保证金 minipool 的行为与协议中的每个其他 minipool **完全相同**。
它们仍然"拥有"信标链上的验证器(它们代表该验证器的提款凭证),它们仍然带有佣金(尽管 Atlas 的佣金**将固定为所有新 minipool 的 14%**),并且它们提供 16-ETH 保证金 minipool 所做的所有相同功能。
区别完全在于数字。

### 奖励

从盈利能力的角度来看(纯粹看 ETH 奖励并忽略 RPL),佣金为 14% 的 8-ETH 保证金 minipool 为节点运营商提供_更多奖励_,甚至超过_佣金为 20% 的 16-ETH 保证金 minipool_(截至 Redstone,这是最高可能的奖励配置)。
同时,由于节点运营商更有效地利用 rETH 持有者的资本,它们也为 _rETH 持有者_提供更多奖励。

让我们通过一个简单的例子来说明。
假设我们是一个有 16 ETH 可供质押的节点运营商(加上所需的 RPL 保证金)。
假设我们在信标链上每个验证器赚取了 1 ETH 的奖励。
以下是佣金为 20% 的单个 16-ETH minipool 与佣金为 14% 的两个 8-ETH minipool 的数学计算方式:

```
1x 16 ETH Minipool @ 20%:
奖励: 1 ETH
节点份额 = (16/32) + (16/32 * 0.2)
          = 0.5 + (0.5 * 0.2)
          = 0.5 + 0.1
          = 0.6 ETH

rETH 份额 = 1 - 0.6
          = 0.4 ETH


2x 8 ETH Minipools @ 14%:
奖励: 2 ETH
节点份额 = ((8/32) + (24/32 * 0.14)) * 2
          = (0.25 + (0.75 * 0.14)) * 2
          = (0.25 + 0.105) * 2
          = 0.71 ETH

rETH 份额 = 2 - 0.71
          = 1.29 ETH
```

换句话说,节点运营商通过两个 8-ETH minipool 将赚取**比佣金为 20% 的单个 16-ETH minipool 多 18% 的 ETH**。

### RPL 抵押品

为了创建 8-ETH minipool,节点运营商仍然需要质押足够的 RPL 来满足其节点的最低抵押要求(考虑到所有保证金大小的所有 minipool)。

这些规则已在 Atlas 中澄清:

- 每个 minipool 的**最低 RPL** 是**_借入_金额的 10%**
- 每个 minipool 的**最高 RPL** 是**_保证金_金额的 150%**

对于 16-ETH minipool,这保持不变;最低为 1.6 ETH 价值的 RPL,最高为 24 ETH 价值的 RPL。

对于 8-ETH minipool,这变成了**最低 2.4 ETH 价值的 RPL**(借入金额的 10%,即 24 ETH)和**最高 12 ETH 价值的 RPL**(保证金金额的 150%)。

这些数字是由 Rocket Pool 社区[作为治理投票的一部分](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671)选择的。

## 创建新的 8-ETH Minipool

创建具有 8-ETH 保证金的新 minipool 的过程与创建 16-ETH minipool 的过程相同。

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
由于节点运营商有 8 ETH 的信用,创建这个 8-ETH minipool 是免费的!
:::

就是这样!
其余过程与[常规 minipool 创建说明](../../node-staking/create-validator.mdx)相同。
