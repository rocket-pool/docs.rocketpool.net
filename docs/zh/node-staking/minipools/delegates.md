::: danger 警告
Minipool 存款当前已禁用，正在为 Saturn 1 做准备。
:::

# Minipool 委托

您运行的每个验证者都有一个 **minipool** 合约作为其"所有者"。minipool 是专门分配给该验证者的唯一合约；它充当其**提款地址**。来自信标链的所有奖励和质押余额提款都将发送到 minipool 合约。

每个 minipool 都是唯一的，以确保您（节点运营者）对其拥有最终控制权。没有其他人控制它，没有其他人可以更改它；它完全由您掌控。

话虽如此，为了最大限度地降低节点存款期间的 gas 成本，minipool _本身_包含的实际功能非常少。它几乎可以做的所有事情都被推迟到**委托**合约。

minipool 委托合约是一个特殊的合约，包含 minipool 所需的大部分逻辑 - 例如在您和池质押者之间公平分配余额。与每个 minipool 都是唯一合约的 minipool 不同，委托是一个单一合约，许多 minipool 可以"转发"请求到它。

偶尔，Rocket Pool 开发团队会发布一个新的 minipool 委托，以添加新功能。例如，在 Atlas 更新中，我们引入了一个新的委托，支持分配略取的奖励而无需关闭 minipool。

Minipool 可以升级其委托以利用此新功能。委托升级是**选择加入**的，因此您可以决定是否以及何时使用它们。话虽如此，它们通常是利用网络升级引入的新功能所必需的。

### 升级您的委托

要将 minipool 升级到新的委托合约，只需运行以下命令：

```shell
rocketpool minipool delegate-upgrade
```

这将向您显示当前未使用最新委托且有资格升级的 minipool 列表：

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

通过输入 minipool 地址左侧的相应数字，从列表中选择要升级的 minipool。选择后，系统会提示您确认 gas 价格设置，之后将发送升级 minipool 的交易：

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

您可以使用 `rocketpool minipool status` 验证它是否正在使用最新的委托。任何_未_使用最新委托的 minipool 都会在其状态下方有一个黄色通知，让您知道它们可以升级：

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
