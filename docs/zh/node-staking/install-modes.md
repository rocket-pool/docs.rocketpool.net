# 选择 Rocket Pool 模式

Rocket Pool 的 Smartnode 堆栈非常灵活;有几种不同的运行方式。
它可以从头开始建立整个完整节点,可以与现有的执行客户端或共识客户端部署集成,甚至可以作为一组系统服务本地运行。
在本节中,我们将介绍配置和使用 Smartnode 堆栈的典型方式。

## 默认基于 Docker 的配置

默认模式,也是运行 Smartnode 最常见的方式,是让它在您的本地机器上创建一个由 Rocket Pool 管理的完整节点实例。

为了实现这一点,Smartnode 使用 [Docker 容器](https://www.docker.com/resources/what-container)。
本质上,Docker 容器是一个小型沙箱,预先配置了程序、其所有依赖项以及正确运行所需的所有配置。
当不再需要时,它可以简单地被丢弃。
这是一个很好的小型自包含捆绑包,可以让事情正常工作,而不会弄乱您的实际文件系统或其他程序。

这种模式是 Smartnode 安装程序将为您部署的。
它使用以下 Docker 容器:

- `rocketpool_api` - 这包含当您通过 Rocket Pool 的命令行界面(CLI)与其交互时 Smartnode 提供的实际功能。
- `rocketpool_node` - 这是一个后台进程,将定期检查并在奖励检查点后领取 RPL 奖励(如果您启用了自动领取,稍后会详细介绍),并负责在您创建 minipool 时实际 staking 新的 validators。
- `rocketpool_watchtower` - Oracle Nodes 使用此功能执行与 oracle 相关的职责。对于普通 node operators,这将保持空闲状态。
- `rocketpool_eth1` - 这将是您的执行客户端。
- `rocketpool_eth2` - 这将是您的共识信标节点客户端。
- `rocketpool_validator` - 这将是您的 Validator 客户端,负责您的 validator 职责(例如证明区块或提出新区块)。

在大多数情况下,从头开始创建新节点时,这是一个不错的选择。
这是最快、最省心的过程。
它还将在每个新的 Smartnode 版本中处理执行客户端和共识客户端的更新,因此您不必担心它们(尽管如果您愿意,可以随时手动升级它们)。

::: warning 注意
目前,某些 Docker 容器需要以 `root` 用户身份运行才能正常运行。
虽然 Docker 容器通常非常擅长防止用户逃逸到您的主操作系统中,但出于安全原因,您可能对此要求感到不舒服。
在这种情况下,我们建议您使用下面列出的 Native 配置模式。
:::

如果您想使用此模式,请继续[使用 Docker 配置标准 Rocket Pool 节点](./docker)部分。

## 使用外部客户端的混合配置

混合配置非常适合有兴趣运行 Rocket Pool 节点,但已经为其他目的运行自己的执行客户端和/或共识客户端的用户(例如,因为他们已经在单独 staking)。

在此模式下,Rocket Pool 将为其自己的进程和它管理的 Validator 客户端部署 Docker 容器,但将忽略您已经运行和维护的外部客户端的执行客户端和 Beacon Node 容器。
**由于 Rocket Pool 将为您节点的每个 minipool 创建和维护新的 validator 密钥,因此它运行自己的 Validator 客户端非常重要。**

使用此配置时,Smartnode 将使用以下 Docker 容器(上面已描述):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

`rocketpool_eth1` 和 `rocketpool_eth2` 容器将包含或排除,具体取决于您已经在外部运行哪些客户端。

如果您想使用此模式,请继续[使用 Docker 配置标准 Rocket Pool 节点](./docker)部分。
当提示您为执行客户端和/或共识客户端选择管理模式时,选择**外部管理**选项,该选项在该部分中有详细描述。

## 不使用 Docker 的 Native 配置

此配置完全绕过 Docker。
不是通过 Docker 运行 Smartnode 堆栈,而是将每个进程作为本地系统服务(例如通过 `systemd`)安装。
这包括 `node`、`watchtower`、`eth1`、`eth2` 和 `validator` 进程。

此配置提供最大的灵活性,因为它允许您微调 Rocket Pool 的参数(例如其安全态势、执行客户端和共识客户端所在的位置、链数据所在的位置、密钥所在的位置等)。
这也是最难设置和维护的。

在此模式下,Smartnode 安装程序不再相关。
您负责手动实例化、维护和升级 Smartnode 基础设施、ETH 客户端和 validator 客户端。

::: danger 警告
虽然我们提供了一些关于如何执行此操作的示例文档,但我们建议此模式仅由**经验丰富的系统管理员**使用。
:::

如果您想使用此模式,请继续[不使用 Docker 配置 Native Rocket Pool 节点](./native.mdx)部分。
