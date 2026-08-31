# 从单独质押迁移到 Rocket Pool

::: danger 单独验证者转换已不再可行
[Saturn 1 升级](/zh/upgrades/saturn-1/whats-new)移除了将现有单独验证者直接转换为 Rocket Pool 验证者的功能。
Minipool-包括曾用于单独验证者转换的"空置（vacant）"minipool-已无法再创建，megapool 验证者只能通过全新的信标链存款来创建。

要将您的质押从单独质押迁移到 Rocket Pool，您现在需要**退出您的单独验证者**并**在 megapool 下创建新的验证者**。
本页将解释发生了哪些变化，并引导您完成新的迁移流程。
:::

## Saturn 1 带来了哪些变化

在 Saturn 1 之前，单独质押者可以在不退出信标链的情况下，将活跃的验证者转换为 Rocket Pool minipool。
该过程包括创建一个特殊的"空置（vacant）"minipool，将验证者的提款凭证从原始的 `0x00` BLS 凭证更改为该 minipool 的地址，通过 Oracle DAO 的审查检查（scrub check），最后晋升（promote）该 minipool。

Saturn 1 升级用 [megapool](/zh/node-staking/megapools/overview) 取代了 minipool 作为创建新验证者的方式，而单独验证者转换功能并未保留：

- **Minipool 的创建已在协议层面被禁用**，其中包括空置 minipool。不再存在可以将现有验证者提款凭证指向的 minipool 合约。
- **Megapool 验证者通过 Rocket Pool 存款队列创建**，需要全新的信标链存款：先进行 1 ETH 的预质押（prestake），在协议于链上验证该验证者的提款凭证后，再存入剩余的 31 ETH。
  已经处于活跃状态的验证者无法走这一流程，因此不存在将现有单独验证者吸收进 megapool 的机制。
- 用于转换的 Smartnode 命令（如 `rocketpool node create-vacant-minipool` 和 `rocketpool minipool promote`）已从 CLI 中移除。

简而言之：如今从单独质押迁移的唯一方式是**将您的验证者从信标链退出，并使用提取的 ETH 创建新的 megapool 验证者**。

## 为什么要迁移？

迁移并不适合所有人，但 Rocket Pool megapool 验证者相比传统的单独质押验证者具有多项优势：

- 它们可以就从质押池借入的 ETH 部分（每个验证者 28 ETH）**赚取佣金**。
- 您现有的 32 ETH 质押最多可用于创建**八个 megapool 验证者**（按当前每个 4 ETH 的质押金额计算），从而就最多 224 ETH 的借入 ETH 赚取佣金。
- 它们有资格参与 [Smoothing Pool（平滑池）](/zh/node-staking/fee-distrib-sp#平滑池)，该池汇集所有执行层奖励（例如来自区块提议和 [MEV 奖励](/zh/node-staking/mev)），并在每个奖励周期内公平地分配给参与者。
- 如果您在 megapool 上质押 RPL，除了 RPL 通胀奖励外，您还将获得[投票份额奖励](/zh/node-staking/megapools/staking-and-claiming-rewards#选民份额如何分配给-megapool-rpl-质押者)（协议 ETH 收益的一部分），并在 [pDAO 治理](/zh/pdao/overview)中获得投票权。RPL 质押完全是可选的。

话虽如此，也有一些重要的差异需要强调：

- 您必须接受**智能合约风险**，因为该协议是由一系列智能合约实现的。
- 传统的节点运营依赖 **Smartnode 软件栈**；您必须接受在节点上安装和运行该软件所带来的任何风险。
- 成为节点运营者需要学习一些新概念，因此存在一定的**学习曲线**。
- Megapool 验证者需要与质押池分享奖励，因此您验证者的提款地址将是执行层上的 megapool 合约，**而不是您控制的外部账户（EOA）**。这同样适用于您执行层奖励的**费用接收地址（fee recipient）**。
- **您的资金在转移期间不会产生任何收益。** 从退出单独验证者到 megapool 验证者激活之间，您不会获得任何奖励。新的 megapool 验证者必须先通过 Rocket Pool 存款队列*和*信标链队列才能开始证明工作，因此在退出任何验证者之前，请先阅读下面的[时机考量](#时机考量)部分。

我们建议您在决定迁移之前仔细权衡这些利弊。
如果您想继续此过程，下面将介绍具体步骤。

## 第 1 步：退出您的单独验证者

第一步是将您的单独验证者从信标链退出并提取其余额：

1. 如果您的验证者仍使用 `0x00` BLS 提款凭证，您必须先将其[更新为指向您控制的地址的执行层提款凭证](https://launchpad.ethereum.org/en/withdrawals)。否则，退出后您的 ETH 将无法提取。
1. 为该验证者提交**自愿退出（voluntary exit）**。您可以通过共识/验证者客户端来完成；具体操作请查阅您所用客户端的文档。
1. 等待验证者通过信标链退出队列，并等待其全部余额被转移到您的提款地址。

::: warning 警告
自愿退出是**不可逆的**。验证者一旦退出，就永远无法再次进行验证-唯一的出路是创建新的验证者。
在退出之前，请确保您已阅读完本页全部内容（尤其是下面的[时机考量](#时机考量)部分）。
:::

[validatorqueue.com](https://www.validatorqueue.com/) 是查看当前信标链退出队列长度的实用网站。

## 第 2 步：设置 Rocket Pool 节点

在等待退出处理期间，您可以着手准备您的 Rocket Pool 节点。

如果您是 Rocket Pool 节点运营的新手，请从[节点运营者指南](/zh/node-staking/responsibilities)开始，其中涵盖了从硬件选择到[安装 Smartnode 软件栈](/zh/node-staking/installing/overview)以及[注册节点](/zh/node-staking/prepare-node)的所有内容。
由于您一直在运行自己的验证者，其中大部分内容会让您感到熟悉-如果您已经在运行自己的执行和共识客户端，您可能会对[使用外部客户端的混合配置](/zh/node-staking/install-modes#使用外部客户端的混合配置)感兴趣。

## 第 3 步：创建您的 megapool 验证者

一旦提取的 ETH 到账，您就可以使用 `rocketpool megapool deposit` 创建 megapool 验证者了。
目前每个验证者需要 **4 ETH 的质押金额**，并从质押池借入 **28 ETH**，因此您提取的 32 ETH 质押最多可支持**八个 megapool 验证者**。
您的 megapool 合约会在您首次进行验证者存款时自动部署，此后您创建的每个验证者都由同一个 megapool 管理。

[创建 Megapool（验证者）](/zh/node-staking/megapools/create-megapool-validator)指南将分步引导您完成整个过程，包括存款队列的运作方式以及如何确认质押成功。

::: tip 注意
与旧的转换流程不同，您的新验证者将使用从您的 Smartnode 钱包生成的**新验证者密钥**。
您旧的单独验证者密钥不会被重复使用，Smartnode 的验证者客户端将为您管理新密钥-不再需要密钥导入步骤。
:::

## 时机考量

旧的转换流程没有停机时间：您的验证者在整个过程中持续进行证明工作。
新的迁移路径则会涉及停机时间，因此在退出单独验证者之前，有必要了解所涉及的各个队列：

1. **信标链退出队列**，决定您的单独验证者能多快退出并提款。
1. **Rocket Pool 存款队列**，决定您的新验证者何时与存款池中借入的 ETH 匹配。快速队列票券（express queue tickets）是根据旧版 minipool 中质押的 ETH 分发给现有节点运营者的；新节点目前不会获得票券，因此前单独质押者的验证者将进入**标准队列**。
1. **信标链存款队列**，megapool 验证者需要通过它**两次**：一次是 1 ETH 的预质押，另一次是在协议验证该验证者的提款凭证后存入剩余的 31 ETH。

从单独验证者退出到 megapool 验证者激活期间，您不会获得任何奖励，因此在做出决定前请先查看队列状态。

::: tip 实用链接
[validatorqueue.com](https://www.validatorqueue.com/) 是查看信标链队列长度的实用网站。该队列取决于进出信标链的 ETH 数量。
:::

如果存款队列比您预期的更长，您可以在验证者被分配 ETH 之前随时[将其退出 Rocket Pool 存款队列](/zh/node-staking/megapools/create-megapool-validator#从-rocket-pool-存款队列中退出验证者)，并以[存款信用](/zh/node-staking/megapools/credit)的形式取回您的质押金额，该信用可兑换为 rETH。

## 另一种选择：无需运行节点的质押

如果在权衡利弊之后，您不想运行节点，您可以直接将提取的 ETH 质押为 [rETH](/zh/liquid-staking/overview)-Rocket Pool 的流动性质押代币-无需任何硬件、维护或排队即可赚取质押奖励。
