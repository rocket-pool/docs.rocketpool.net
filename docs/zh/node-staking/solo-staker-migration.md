::: danger 警告
Minipool存款当前已禁用,为Saturn 1做准备。
:::

# 将Solo验证者转换为Minipool

当信标链首次启动时,验证者使用一对特殊的加密密钥创建 - **验证者密钥**和**提款密钥**。

验证者密钥是"热密钥",这意味着它需要存储在连接到互联网的活动机器上;这是用于签署您的证明和提案的密钥,也作为您在信标链上的"地址"(用于标识您的验证者的十六进制字符串)。

另一方面,提款密钥是"冷密钥",这意味着它不需要(实际上不应该)存储在连接到互联网的活动机器上。
它旨在锁定在冷存储中,以便在需要之前无法访问。
与验证者密钥不同,提款密钥根本不负责验证职责。
相反,它的唯一工作是管理您的验证者在信标链上的资金提取(一旦实现提款)。

这种双密钥系统是信标链启动时的初始架构。
当时,合并和提款都还没有被设计,但这个系统被认为足够强大,可以处理两者实现时协议采取的任何形式。

快进到今天,现在我们对提款的工作方式有了更好的理解。
幸运的是,它们的实现方式使得信标链上现有的solo质押验证者(使用旧的提款密钥凭证)可以**直接转换为Rocket Pool minipool**,而无需从信标链退出验证者!

如果您有兴趣了解更多关于此过程的信息,那么本指南适合您。
我们将在高层次上介绍以太坊上的提款如何工作,解释转换过程的工作原理,并以详细的演练结束,说明如何将您的验证者转换为minipool。

## 为什么要转换?

在深入技术细节之前,一个非常重要的问题是\_为什么\_solo质押者首先要考虑这个过程。
转换为minipool并不适合所有人,但本节将帮助您就是否愿意追求它做出明智的选择。

Rocket Pool minipool享有以下几个优于传统solo质押验证者的优势:

- 它们在从池质押者那里借入的ETH部分(24 ETH)上**赚取佣金**。
- 您现有的32 ETH保证金可用于创建最多**三个额外的验证者**(在您已有的基础上)。
- 它们有资格参与[Smoothing Pool](./fee-distrib-sp#the-smoothing-pool),该池汇集所有执行层奖励(例如,来自区块提案和[MEV奖励](./mev.mdx)),并在每个奖励间隔期间在参与者之间公平分配它们。
- 如果您质押RPL,它们将获得额外的佣金和RPL通胀奖励(目前提供比ETH质押奖励更高的APR)。

话虽如此,有一些重要的区别需要强调:

- 您将不得不接受**智能合约风险**,因为该协议是作为一系列智能合约实现的。
- 同样,传统节点操作利用**Smartnode堆栈**;您将不得不接受在节点上安装和运行该软件相关的任何风险。
- 成为节点运营商确实涉及学习一些新概念,因此成为节点运营商有一个**学习曲线**。
- Minipool需要与池质押者分享他们的奖励,因此验证者的提款地址将是执行层上的智能合约,**而不是您控制的EOA**。这也适用于执行层奖励的**费用接收者**,它也必须是能够公平分配您的奖励的智能合约。
- Rocket Pool的**Oracle DAO**负责将信息从信标链传送到执行层,并检测协议无法强制执行的违规行为(例如非法的费用接收者地址)。运行minipool意味着您必须信任Oracle DAO正确完成该工作。

我们鼓励您在决定转换您的solo验证者之前仔细审查这些优缺点。
如果您想继续该过程,请阅读下一节。

## 先决条件

为了开始转换过程,您需要满足以下条件:

1. 您必须有[在Rocket Pool网络上注册的节点](./prepare-node.mdx)来托管新的minipool。
1. 您想要迁移的验证者必须在信标链上**处于活动状态**。它不能处于待定、被削减、退出/已退出或已提款状态。
1. 验证者必须在信标链上的余额**至少为32 ETH**。
1. 验证者必须具有[BLS密钥提款凭证](https://launchpad.ethereum.org/en/withdrawals)(`0x00`凭证)。转换**不能**在已经迁移到其他执行层提款凭证(`0x01`凭证)的验证者上完成。
1. (可选)如果您打算让Smartnode自动为您迁移提款凭证,您必须手头有您的**助记词**。

如果这些条件都不是您的障碍,那么您有资格开始验证者转换。

## 流程概述

第一步是**创建一个新的"空缺"minipool**。
与在创建期间创建新验证者的传统minipool不同,空缺minipool是专门设计用于管理*现有*验证者的特殊minipool。
因此,空缺minipool在`prelaunch`阶段的行为与传统minipool略有不同。
一旦初始化完成并进入`staking`阶段,它们就会成为传统的minipool。

在创建空缺minipool期间,您将有机会让Smartnode自动**将您的验证者的提款凭证**从旧的BLS提款密钥更改为新的空缺minipool地址。
如果您现在不想这样做,您可以稍后使用专用命令让Smartnode执行此操作,或者您可以使用第三方工具自己完成。
请注意,将验证者的提款凭证更改为minipool地址是转换**所必需的**,因此无论您如何执行此操作,都需要完成此操作才能成功完成该过程。

一旦提款凭证被更改,您将有机会**导入验证者的私钥**到由Smartnode管理的验证者客户端。
如果您希望Smartnode维护验证者,这样您就不必自己管理,这是一个有吸引力的选项。
如果您更喜欢维护自己的验证者客户端并将密钥保存在那里,您可以这样做。

此时,您的新minipool将进入**scrub检查**期,Oracle DAO将持续分析信标链上验证者的信息以确认其保持合法。
这包括:

- 提款凭证要么尚未迁移(仍然是原始的`0x00` BLS密钥凭证),要么已迁移到minipool的地址。将它们迁移到任何其他执行层地址将导致池被scrub。
  - 如果在scrub检查期结束时提款凭证仍然是原始的`0x00` BLS密钥凭证,则该池将被scrub。
- 在检查期间,验证者处于活跃质押状态。如果它转换到被削减、已退出或已提款状态,该池将被scrub。

::: tip 注意
**被scrub的**空缺minipool意味着它不是Rocket Pool网络的一部分,但它仍然会通过CLI中的典型代币检索方法为您(节点运营商)提供对所有资金的访问权限。
如果空缺minipool被scrub,资金**不会丢失**。
本指南稍后会包含有关被scrub的minipool、其后果以及如何使用它们的更多信息。
:::

在scrub检查通过后,您将能够**提升**您的空缺minipool。
这将完成转换并将其从空缺minipool更改为常规minipool。
此时,minipool将像网络上的其他所有minipool一样运行,您的solo验证者将正式转换为Rocket Pool验证者!

作为该过程的一部分,网络将快照您在信标链上的总奖励(以及您的新minipool内的奖励,如果您在scrub检查期间被skimmed)。
它将识别所有这些奖励都属于您,不应与质押池共享,因此它将提供所有这些奖励作为**退款**,您可以在提升完成后随时领取。

以下是转换过程的详细演练,包括每个步骤的说明。

## 步骤1:创建空缺Minipool

要开始转换过程,请使用Smartnode CLI运行以下命令:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

例如,如果您想转换公钥为`0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`的solo验证者,您将运行:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

您将看到有关该过程中预期内容的简要摘要,然后会提示您选择在创建此minipool时要使用的保证金金额:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

一旦您选择**8 ETH**,您将把您的验证者转换为8-ETH绑定的minipool。
您原来的32 ETH存款将转换为8 ETH存款,从池质押者那里借入24 ETH。
一旦转换过程完成,您将拥有24 ETH的[信用余额](./credit),您可以使用它来创建更多的minipool。

一旦您选择一个选项,Smartnode将运行一些检查,以确认您输入的验证者和您的节点都通过了上面列出的所有先决条件要求。
之后,它将要求您确认您的gas价格,然后提交交易以创建新的空缺minipool。
创建后,您将看到minipool的地址:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

这是您在更改验证者的提款凭证时将使用的地址。

此时,Smartnode将询问您是否希望让Smartnode自动执行此操作(以及将验证者的私钥导入到由Smartnode管理的验证者客户端,稍后讨论):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

如果您对此问题回答`y`,Smartnode将自动执行步骤2和3;请参阅下面的[自动提款凭证更改和密钥导入](#automatic-withdrawal-credential-change-and-key-import)部分。

如果您对此问题回答`n`,命令将结束,您将完成步骤1。
请接下来转到[步骤2](#step-2-changing-the-validators-withdrawal-credentials)部分。

::: tip 注意
如果您现在拒绝此过程,您可以稍后使用CLI恢复它。
阅读下面的[**步骤2**](#step-2-changing-the-validators-withdrawal-credentials)和[**步骤3**](#optional-step-3-import-the-validator-key)部分,了解如何执行此操作。
:::

### 自动提款凭证更改和密钥导入

::: danger 警告
如果您选择让Smartnode自动更改您的提款凭证并导入您的验证者的私钥,**至关重要的是**您从您自己管理的旧验证者客户端中删除验证者密钥,并**关闭旧验证者客户端**以确保它没有将密钥加载到内存中。

您还必须在执行此操作后**至少等待15分钟**,以确保它**故意错过了至少两次证明**。
您可以通过查看链浏览器(如[https://beaconcha.in](https://beaconcha.in))来验证这一点。

如果您不等待至少15分钟,当Smartnode的验证者客户端开始使用您的验证者密钥进行证明时,您的验证者**将被削减**!

我们强烈建议您在Smartnode配置中也启用**doppelganger检测**,以尽可能安全地防止被削减的风险。
:::

如果您选择自动导入验证者密钥并将提款凭证更改为minipool地址,Smartnode将首先要求提供用于生成验证者的BLS私钥及其相应原始提款密钥的助记词:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

输入后,Smartnode将使用助记词和验证者的公钥派生您的旧基于BLS的提款密钥。
然后,它将向信标链提交一条由您的提款密钥签名的消息,表明您想将提款凭证从旧的BLS提款密钥更改为新的minipool地址:

```
Changing withdrawal credentials to the minipool address... done!
```

最后,它将把您的验证者密钥导入到Smartnode的验证者客户端,并询问您是否想现在重启它,以便它开始使用该密钥进行验证:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

完成后,步骤2和3就完成了。
您可以使用链浏览器(如[https://beaconcha.in](https://beaconcha.in))验证提款凭证是否已正确更改以及密钥是否正在主动验证

转到[步骤4](#step-4-waiting-for-the-scrub-check)部分以了解scrub检查。

## 步骤2:更改验证者的提款凭证

当您创建了新的空缺minipool后,下一步是将您的验证者的提款凭证从旧的`0x00` BLS密钥凭证更改为包含新minipool地址的新`0x01`凭证。

有两种方法可以做到这一点:

1. 使用Smartnode CLI,通过`rocketpool minipool set-withdrawal-creds`命令。
1. 使用外部第三方工具,如[ethdo](https://github.com/wealdtech/ethdo)。

在本指南中,我们将介绍如何使用方法1(Smartnode)。
有关方法2的更多信息,请查阅您想使用的工具的文档。

首先运行以下命令:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

例如,如果新的空缺minipool地址是`0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`,您将运行:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

然后Smartnode将要求提供用于生成验证者密钥及其相应提款密钥的助记词:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

之后,它将执行一些安全检查,以确保可以更改您的验证者的提款凭证。
如果成功,它将向信标链提交一条由您的提款密钥签名的消息,表明您想将提款凭证从旧的BLS提款密钥更改为新的minipool地址:

```
Changing withdrawal credentials to the minipool address... done!
```

就是这样!
您可以使用链浏览器(如[https://beaconcha.in](https://beaconcha.in))验证提款凭证是否已正确更改。

## (可选)步骤3:导入验证者密钥

一旦您将验证者转换为minipool,您可能希望让Smartnode的验证者客户端运行它,而不是您当前自己管理的验证者客户端。
这有几个优点:

- 从组织的角度来看,它更"干净"(Smartnode管理您的minipool,您的外部管理的验证者客户端管理您的solo质押验证者)。
- 它允许像`rocketpool minipool exit`这样的命令(需要您的验证者密钥来签署消息的命令)正常工作。

但是,在执行此操作之前,有一些**非常重要的注意事项**需要理解:

- 您**必须确保**您的验证者密钥已从您自己的验证者客户端中删除,并且您在将其导入Smartnode之前已经等待至少15分钟。请参阅下面的警告框。
- 您**必须确保**您已备份验证者密钥存储*及其密码文件*,因为像`rocketpool wallet recover`和`rocketpool wallet rebuild`这样的命令**无法**在没有备份的情况下重新生成它们,因为它们不是从Smartnode钱包的助记词派生的。

如果您想将验证者密钥导入Smartnode,请继续阅读下面的内容。

::: danger 警告
如果您选择让Smartnode导入您的验证者的私钥,**至关重要的是**您从您自己管理的旧验证者客户端中删除验证者密钥,并**关闭旧验证者客户端**以确保它没有将密钥加载到内存中。

您还必须在执行此操作后**至少等待15分钟**,以确保它**故意错过了至少两次证明**。
您可以通过查看链浏览器(如[https://beaconcha.in](https://beaconcha.in))来验证这一点。

如果您不等待至少15分钟,当Smartnode的验证者客户端开始使用您的验证者密钥进行证明时,您的验证者**将被削减**!

我们强烈建议您在Smartnode配置中也启用**doppelganger检测**,以尽可能安全地防止被削减的风险。
:::

首先运行以下命令:

```
rocketpool minipool import-key <minipool address>
```

例如,如果新的空缺minipool地址是`0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`,您将运行:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

然后Smartnode将要求提供用于生成您的验证者密钥的助记词:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

之后,它将循环遍历从该助记词生成的不同密钥,直到找到您的验证者的公钥。
然后它将导入它,并询问您是否想重启Smartnode的验证者客户端,以便它加载您的密钥:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

完成后,您的验证者密钥现在已导入到Smartnode中,您应该看到它开始进行证明。
您可以使用以下命令跟踪验证者客户端的日志来确认:

```
rocketpool service logs validator
```

您还可以验证链浏览器(如[https://beaconcha.in](https://beaconcha.in))可以看到您的验证者客户端使用您的验证者密钥进行证明。

## 步骤4:分配正确的费用接收者

一旦您开始迁移过程,**必须**确保您的[费用接收者](./fee-distrib-sp#fee-recipients)设置正确(设置为您节点的[费用分配器](./fee-distrib-sp#your-fee-distributor),或者如果您已选择加入,则设置为[Smoothing Pool](./fee-distrib-sp#the-smoothing-pool))。
如果您不这样做并将其保留在solo验证者的费用接收者上,您将受到惩罚,并且您的信标链质押的一部分将被扣除以补偿损失。

::: tip 注意
**只有当您将验证者密钥保留在自己的外部管理的验证者客户端中时,才需要此步骤。**

如果您从自己的VC中删除它并将其导入到Rocket Pool管理的VC中,您的费用接收者将由`node`进程自动分配到正确的地址。
:::

由于您可能在VC中保留其他solo质押密钥,而您*不*想将其设置为费用分配器或Smoothing Pool,因此实现这一目标的唯一方法是使用VC配置文件手动为正在迁移的验证者设置费用接收者。

此过程取决于您使用的共识客户端;有关具体信息,请查阅文档,但这里有一些有用的链接:

[Lighthouse:通过`validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar**目前不支持设置验证者特定的费用接收者。如果您在外部管理的VC中保留密钥和其他未迁移的solo密钥,请不要使用Lodestar。

[Nimbus:通过keymanager API](https://nimbus.guide/keymanager-api.html)

[Prysm:通过`proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku:通过`validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

如果您使用的是eth-docker,您可以使用[`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient)命令为您使用的每个密钥设置单独的接收者,如其文档中所述。

## 步骤5:等待Scrub检查

到此时,您应该已经完成了步骤1和2(创建空缺minipool并更改您的验证者的提款凭证),并且可选地完成了步骤3(将密钥导入Smartnode)。
下一步是等待**scrub检查**完成。
这是Oracle DAO执行的过程,用于验证以下内容:

1. 您的验证者在信标链上的余额(以及您的minipool在执行层上的余额)必须至少等于您首次创建空缺minipool时验证者的余额,减去0.01 ETH的小缓冲区,以考虑维护期间任何意外错过的证明。

- 例如,如果您的验证者在执行步骤1时在信标链上的余额为35 ETH,则在整个scrub检查期间,信标链和minipool余额的总和必须**至少为**34.99 ETH。

2. 您的验证者必须在整个scrub检查期间保持**活跃质押**状态 - 它不能被削减、退出或提款。
3. 您的验证者的提款凭证必须是**原始的基于BLS的提款密钥凭证**,或者是**使用minipool地址的新0x01凭证**。任何其他凭证都将导致minipool被scrub。

- 您有**大约2.5天**的宽限期来执行提款凭证更改(scrub期3天期限的85%)。

scrub检查是暂时的;在此期间,您不必做任何事情,只需保持验证者在线并表现良好。

要监控scrub检查还剩多少时间,您可以使用以下命令查看`node`日志:

```
rocketpool service logs node
```

相关行将如下所示:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

它将持续**3天**,之后您就通过了,可以继续进行[步骤6](#step-6-promoting-the-minipool),将空缺minipool提升为完整minipool。

### 处理被Scrub的Minipool

如果您的minipool不幸未通过scrub检查并被解散,请不要担心 - 您的资金没有丢失。
被解散的空缺minipool本质上充当简化的提款地址:

- 它们在技术上不是Rocket Pool网络的一部分。
- 存入minipool的任何资金*仅*属于节点运营商。它*不会*与池质押者分享。
- 您不会因创建minipool而获得存款信用。

您可以随时使用以下命令访问minipool的余额:

```shell
rocketpool minipool distribute-balance
```

这将把minipool的全部余额发送到您节点的提款地址。

当您从信标链退出验证者并且其全部余额已发送到minipool时,您可以检索它并使用以下命令关闭minipool:

```shell
rocketpool minipool close
```

再次,这将把minipool的全部余额发送到您节点的提款地址。

## 步骤6:提升Minipool

当scrub检查成功通过后,您可以将空缺minipool提升为完整minipool。
这可以通过两种方式完成:

1. 让`node`进程在scrub检查结束后立即自动处理。
1. 使用CLI手动完成。

第一种方法将自动为您提升minipool,假设您运行了`node`进程/容器,并且网络的gas成本低于您在Smartnode配置过程中指定的自动交易阈值(默认为150)。
在`node`日志中,您将看到如下输出:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

如果您的`node`进程被禁用,您可以使用以下命令通过第二种方法:

```shell
rocketpool minipool promote
```

从这里,只需从符合提升条件的minipool列表中选择您的空缺minipool并提交交易。

## 领取您原始的转换前奖励

提升后,您的minipool将进入`staking`状态,并正式成为常规的Rocket Pool minipool。
您可以使用以下命令查看详细信息:

```shell
rocketpool minipool status
```

这将向您显示新minipool的状态、其余额、其退款等。
例如:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

在这里您可以看到以下重要信息:

- `Node deposit`显示您作为此minipool的一部分个人绑定了多少ETH(在本例中为8 ETH)。
- `RP deposit`显示您从池质押者那里借入了多少ETH来创建minipool(在本例中为24 ETH)。
- `Available refund`显示minipool余额中有多少直接归您所有(不与池质押者共享)。这相当于您在创建空缺minipool时在信标链上的所有奖励。
- `Minipool Balance (EL)`显示minipool合约的总余额。
- `Your portion (EL)`显示从minipool余额中减去退款后有多少余额属于您。换句话说,这是您在创建空缺minipool*之后*赚取的奖励份额。
- `Total EL rewards`是您的退款加上您转换后的奖励。

要领取您的退款,请运行以下命令:

```shell
rocketpool minipool refund
```

只需从列表中选择您的minipool,批准交易,您的退款将被发送到您节点的提款地址。

## 使用您的节点信用

现在您有了一个活跃的已提升minipool,当您运行`rocketpool node status`时,您会注意到您的节点有信用余额:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

在这个例子中,由于我们将原来的32 ETH验证者保证金转换为8-ETH minipool,我们收到了[**24 ETH的信用**](./credit)。
这个信用可以免费用于创建新的minipool和验证者!

只需运行`rocketpool node deposit`命令,并选择您想使用的保证金金额。
如果您的信用余额中有足够的ETH来支付保证金,它将自动使用,您不必质押任何额外的ETH(尽管您仍然需要支付gas费用)。

::: warning 注意
用于您信用余额的ETH来自质押池。
如果质押池没有足够的ETH来支付您的信用余额,您将无法使用它,直到存入更多ETH。
:::
