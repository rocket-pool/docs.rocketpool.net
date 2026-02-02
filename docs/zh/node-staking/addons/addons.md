# 如何为 Rocket Pool Smart Node 编写插件

## 简介

Rocket Pool Smart Node 插件是为 Smart Node 堆栈提供附加功能的扩展。它们可以实现为与 Ethereum 客户端或 Smart Node 服务集成的 Docker 容器。插件可以通过 Smart Node 的终端用户界面（TUI）使用 `rocketpool service config` 命令启用和配置。

插件开发可以基于两个现有示例：

- **Graffiti Wall Writer**：使节点运营者能够通过动态设置区块提议涂鸦来为 Beaconcha.in 涂鸦墙上的社区绘画做出贡献。它使用去中心化绘图工具来确定每个提议要"绘制"哪些像素。
- **Rescue Node**：使用 Rocket Rescue Node 项目的凭证提供备用信标节点服务。这有助于在节点维护、同步或停机期间通过将请求路由到共享的远程信标节点来防止错过证明。

插件是 Smart Node 源代码的一部分，必须通过 pull request 向存储库提交。它们实现了用于配置和集成的标准化接口。

## 前提条件

- 熟悉 Go 编程，因为插件是用 Go 编写的。
- 了解 Docker，因为插件可以作为容器运行。
- 了解 Rocket Pool Smart Node 架构，包括其 Docker compose 设置和配置系统。
- 访问 Smart Node 存储库进行本地开发和测试。

## 创建插件的步骤

要创建新插件，您需要在 Smart Node 存储库中的特定位置添加代码。该过程涉及实现插件逻辑、配置其 UI、注册它以及处理与 Docker 堆栈的集成。

### 1. 实现插件逻辑

在 `addons/` 中创建一个以插件命名的新子目录（使用 snake_case，例如 `my_addon`）。

在此目录中，创建一个 Go 文件（例如 `my_addon.go`），定义插件结构并实现来自 `github.com/rocket-pool/smartnode/shared/types/addons` 的 `SmartnodeAddon` 接口。

```
type MyAddon struct {
    cfg *MyAddonConfig `yaml:"config,omitempty"`
}

func NewMyAddon() addons.SmartnodeAddon {
    return &MyAddon{
        cfg: NewConfig(),
    }
}
```

需要实现的关键方法：

- `GetName()`：返回插件的显示名称。
- `GetDescription()`：返回简要说明。
- `GetConfig()`：返回带有参数的配置对象（例如启用标志、API 密钥、URL）。
- `GetEnabledParameter()`：返回控制插件是否启用的参数。
- 用于启动/停止插件、生成 Docker compose 部分或与其他服务交互的方法。

如果插件运行 Docker 容器：

- 定义 Docker 镜像（例如自定义镜像或外部镜像）。
- 指定所需的卷、端口或环境变量。

例如，Graffiti Wall Writer 插件运行一个容器，该容器根据要绘制的图像的 JSON 配置定期更新验证器客户端的涂鸦文件。

Rescue Node 插件将验证器客户端配置为通过代理使用远程备用信标节点，需要用户名和密码参数。

### 2. 创建配置 UI

在 `rocketpool-cli/service/config/` 中添加一个名为 `addon-myaddon.go` 的文件。

此文件使用 `tview` 库定义用于配置插件的 TUI 页面。

关键元素：

- 定义一个结构体 `AddonMyAddonPage`，其中包含布局、主配置和表单项的字段。
- 构造函数 `NewAddonMyAddonPage`，初始化页面并调用 `createContent()`。
- `createContent()`：使用复选框（例如启用）和其他参数的输入字段设置表单。
- 事件处理程序，如 `handleEnableChanged()`，根据启用状态显示/隐藏参数。

示例代码片段：

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
}

func (configPage *AddonMyAddonPage) createContent() {
}
```

### 3. 注册插件

更新 `addons/constructors.go` 以包含插件的构造函数。

此文件包含用于实例化所有插件的函数。

示例：

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

然后将其添加到 `shared/services/config/rocket-pool-config.go` 中 `NewRocketPoolConfig` 内的可用插件列表中。

```
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. 与 Docker Compose 集成

插件通常需要修改 Docker compose 文件。

- 在 `shared/services/rocketpool/assets/install/templates/addons` 目录中为插件的 compose 部分添加模板（例如 `my_addon.tmpl`）。
- 插件代码在启用时生成 compose YAML，包括服务、卷和依赖项。

`services/rocketpool/client` 文件夹中的 `composeAddons` 函数负责基于 Rocket Pool 配置配置 Docker Compose 容器，为插件设置运行时、模板和覆盖资源。

对于安装：

- 如果插件需要复制文件（例如默认配置文件），请更新安装程序脚本（`install.sh`）。

### 5. 可选集成

- **节点状态命令**：如果插件有状态信息（例如 Rescue Node 的凭证过期），请更新 `rocketpool-cli/node/status.go` 以显示它。
- **指标或日志**：如果适用，与 Prometheus/Grafana 集成。
- **外部依赖**：如果使用外部存储库（例如 Rescue Node 代理），请确保对其进行记录。

### 6. 测试和提交

- 本地构建和测试：使用 Makefile 构建 Smart Node，安装并启用您的插件。
- 在 TUI 中验证，检查 Docker 容器并测试功能。
- 向 https://github.com/rocket-pool/smartnode 提交 pull request，包含您的更改。

## 示例：Graffiti Wall Writer

- **目的**：使用区块提议在 Beaconcha.in 涂鸦墙上绘制社区图像。
- **实现**：运行一个 Docker 容器，获取墙状态并更新验证器的涂鸦文件。
- **配置**：启用标志和图像 JSON URL 参数（默认：Rocket Pool 徽标）。
- **集成**：容器挂载验证器的数据目录以写入涂鸦文件。通过 TUI 启用；为去中心化绘图做出贡献。

## 示例：Rescue Node

- **目的**：备用信标节点以避免停机期间的处罚。
- **实现**：将验证器客户端配置为使用带身份验证的远程代理。
- **配置**：启用标志，来自 Rescue Node 网站的用户名和密码。
- **集成**：修改验证器配置以指向救援代理。在 `rocketpool node status` 中显示凭证状态。

有关更多详细信息，请查看存储库中的源代码或为改进插件开发文档做出贡献。
