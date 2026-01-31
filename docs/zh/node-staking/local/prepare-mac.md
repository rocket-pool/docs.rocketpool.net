# 准备 Mac

在安装 Rocket Pool 之前，您应该进行一些检查，以确保您的系统兼容并能正常工作。

::: danger
我们强烈建议您创建一个专用于运行 Rocket Pool 节点的专用机器。
在通用机器上运行节点，例如您的日常工作台式机，会带来额外的安全风险，可能会危及您的钱包并导致您的币被盗。

**为了最大限度地提高安全性，请构建一台专门用于运行节点的新机器。**
:::

## 系统要求

以下是 Rocket Pool 节点所需的软件和硬件要求的简要说明。
本指南假设您已经物理构建了您的机器，并安装了操作系统。

### 支持的操作系统

Rocket Pool 建议您为您的硬件使用最新版本的 macOS。

### macOS 支持

您需要安装以下先决条件：

我们强烈建议使用 [Homebrew](https://brew.sh) 作为您的 Mac 包管理器。它允许您使用 `brew` 命令轻松安装包。

您可以通过以下方式安装它

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

它应该为您安装一些先决条件，例如 XCode 命令行工具。如果没有，您可以使用以下命令手动安装它们

```shell
xcode-select --install
```

安装后,使用以下命令确保一切正常工作

```shell
brew doctor
```

安装并正常工作后，Homebrew 将允许您使用 `brew` 命令安装包。

例如，要使用 Homebrew 安装 `wget`，请在终端中执行以下命令：

```shell
brew install wget
```

现在我们已经安装了 Homebrew，我们可以安装我们的 Docker 客户端，[Orbstack](https://orbstack.dev)。

```shell
brew install --cask orbstack
```

Orbstack 将安装到您的应用程序文件夹。从那里启动它，它将初始化。如果您从 Docker Desktop 迁移，它应该检测到您现有的 Docker 安装并迁移您的映像和容器。

您可能需要根据硬件调整 Orbstack 设置。

如果您之前安装了 Docker Desktop，则需要先将其卸载。Docker Desktop 曾经是推荐的 Docker 客户端，但在去年发布了一些新客户端，提供了更好的稳定性。

请确保您的防火墙（系统设置 -> 网络 -> 防火墙）已打开，并且 Orbstack 已添加到允许传入连接的应用程序列表中。（Orbstack 应该为您执行此操作）

![](../local/images/mac/firewall.png)

### 安装和使用 SSH

SSH 应该已经随 macOS 一起安装。

### 安装前系统检查

在安装 Rocket Pool 之前，请查看以下清单：

- 您的系统已完全构建，可以开机，并可以启动到操作系统。
- 您不会在系统上进行任何其他活动，例如浏览互联网、检查电子邮件或玩游戏。
- 您已安装 macOS 操作系统。
- 您的用户帐户具有 root / 管理员权限。
- 您有一个满足性能要求的 SSD。
- 您的 SSD 已挂载在文件系统上。
- 您至少有 1.5TB 的可用空间用于初始执行和共识同步过程。
- 如果您的 ISP 限制了您的数据，则每月超过 2 TB。

如果您已检查并确认所有这些项目，那么您已准备好安装 Rocket Pool 并开始运行节点！
继续到[选择您的 ETH 客户端](../eth-clients)部分。
