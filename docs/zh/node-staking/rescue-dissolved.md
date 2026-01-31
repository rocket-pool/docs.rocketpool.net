# 挽救已解散的 Minipool

在不太可能发生的情况下,如果您的 minipool 在解散窗口内未能质押,它将被 oDAO"解散",提供的用户资金将返回到存款池供另一个 minipool 使用。在这种情况下,您需要执行以下过程来取回您的 ETH 并解锁您的 RPL 以便取消质押。

## 更新您的 Minipool 委托

强烈建议您在执行此过程时使用最新的 minipool 委托。较旧的委托在关闭时包含 `selfdestruct` 操作,这意味着如果过程未按指定顺序正确完成,资金可能会永远锁定。您可以通过尝试[升级您的委托](./minipools/delegates#upgrading-your-delegate)来检查您的 minipool 是否使用最新的委托。如果您的 minipool 未出现在可以升级的 minipool 列表中,那么您可以继续执行以下步骤。

## 取回您未使用的存款余额

::: tip 注意
如果您的 minipool 在 Atlas 之前被解散,您可以跳过此步骤并直接前往[将您的信标链余额增加到 32 ETH](#increase-your-beaconchain-balance-to-32-eth)。
您不需要取回未使用的存款余额,因为在 Atlas 之前整个保证金金额已存入信标链。
:::

您初始保证金存款中的 1 ETH 用作信标链的初始存款,以确保您的验证器的提款凭证。剩余金额在您的 minipool 从存款池分配到 ETH 时存入您的 minipool。

当您的 minipool 被解散时,用户 ETH 返回到存款池,您的 ETH 保留在 minipool 中准备返回给您。使用奖励的[手动分配](./skimming#manual-distribution)功能来取回此 ETH,然后可以在下一步中使用它来激活您的验证器。

## 将您的信标链余额增加到 32 ETH

您必须将验证器的余额充值到信标链上激活所需的最低限度。此金额为 **32 ETH**。如果您有 16 ETH 保证金的 minipool,您将需要额外的 16 ETH,如果您有 8 ETH 保证金的 minipool,在此步骤中您将需要额外的 24 ETH。

将所需金额的 ETH 存入您的节点地址,然后发出以下命令开始该过程:

```shell
rocketpool minipool rescue-dissolved
```

您将看到符合手动存款条件的 minipool 列表:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

选择要挽救的 minipool 后,系统会询问您要手动存入多少:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

在大多数情况下将使用选项 1。这是将您的信标链余额提高到所需的 32 ETH 金额所需的数量。其他选项用于高级用例。

::: tip 注意
将您的信标链余额提高到 32 ETH 意味着您的验证器将能够积极参与 Ethereum 验证任务。自解散以来,smartnode 可能还没有机会重启您的验证器。因此,手动重启您的验证器以确保它已加载您的验证器密钥并可以执行验证任务以避免在挽救过程中受到任何惩罚是一个好主意。

如果您运行标准 Docker 模式,可以使用 `docker restart rocketpool_validator` 完成此操作。
:::

完成此步骤后,您的验证器将进入入口队列,您需要等待以下事件发生:

1. 需要经过 2048 个执行层区块才能接受您的存款(约 8 小时)
2. 最多需要 32 个 epoch 让验证器投票让您进入(0.5 - 3.5 小时)
3. 在验证器队列中的可变时间(队列中每 4 个验证器 6.4 分钟)
4. 允许退出前至少验证 256 个 epoch(27 小时)

### 退出您的验证器

一旦您的验证器已活跃至少 256 个 epoch,您可以通过与任何其他 minipool 相同的过程退出您的 minipool,方法是遵循[退出您的验证器](./withdraw#exiting-your-validator)指南。

完整的 32 ETH 余额将返回到您的 minipool,已解散的 minipool 将其 100% 余额分配给节点运营商的提款地址。
