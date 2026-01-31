# 准备 PC、迷你电脑或 NUC

在安装 Rocket Pool 之前，您应该进行一些检查，以确保您的系统兼容并能正常工作。

::: danger
我们强烈建议您创建一个专用于运行 Rocket Pool 节点的专用机器。
在通用机器上运行节点，例如您的日常工作台式机或游戏设备，会带来额外的安全风险，可能会危及您的钱包并导致您的币被盗。

**为了最大限度地提高安全性，请构建一台专门用于运行节点的新机器。**
:::

## 系统要求

以下是 Rocket Pool 节点所需的软件和硬件要求的简要说明。
本指南假设您已经物理构建了您的机器，并安装了操作系统。

### 支持的操作系统

Rocket Pool 的 Smartnode 客户端目前支持 **Linux** 和 **macOS** 系统。

目前，**Windows** 可用于远程管理远程 Linux 或 Mac 机器，但 Smartnode 本身目前无法在 Windows 系统上运行。但是，Rocket Pool _可以_在 Windows 机器托管的 Linux [虚拟机](https://en.wikipedia.org/wiki/System_virtual_machine)上运行。
不建议使用此设置而不是简单地将 Linux 安装为主机操作系统，但如果必要，它确实可以工作。
请注意，它将需要额外的资源开销，并带有自己的一套安全风险，因此我们不建议在主网上质押真实以太币时使用此设置。

Rocket Pool 原生兼容 **AMD64 (x64)** 和 **arm64 (aarch64)** CPU 架构。
对于其他架构，您需要从源代码编译 smartnode 客户端。

请注意，用户必须具有 **root / 管理员**访问权限（或 **sudo** 权限）才能安装 Smartnode。

#### Linux 支持

Linux 操作系统有许多变体（称为发行版或简称 **distro**）。虽然您可以从任何现代发行版运行 Rocket Pool，但 Rocket Pool 的安装程序可以在 [Ubuntu](https://ubuntu.com/about)、[Debian](https://www.debian.org/intro/why_debian)、[CentOS](https://www.centos.org/about/) 和 [Fedora](https://docs.fedoraproject.org/en-US/project/) 上自动安装整个堆栈。

::: warning 注意
如果您计划使用 Ubuntu，我们强烈建议使用 **LTS** 版本，例如 24.04。
这些版本会被积极维护更长的时间，这有助于节点的安全性和稳定性。
:::

对于在其他发行版上的安装，Smartnode 安装程序将无法自动安装某些系统依赖项（例如 `docker-compose`）。
安装过程中将需要一些手动步骤。

对于 `arm64` 系统，Smartnode 安装程序仅原生支持 Debian 和基于 Debian 的发行版，例如 Ubuntu。
对于其他发行版，安装过程中将需要手动步骤。

## 安装操作系统

如果您使用的是 macOS，很可能您已经安装了操作系统，可以跳过此步骤。

如果您从头开始安装 Linux，上面列出的每个发行版都附带有用且详细的教程，用于从头开始安装操作系统。
但作为示例，我们将引导您完成安装和准备 **Debian Server** 的过程。
Debian 是节点操作的一个很好的选择，因为它专注于**最大的稳定性和可靠性** - 这两者对于必须 24/7 运行的节点机器都非常理想。

[这是一个很好的分步指南](https://itslinuxfoss.com/debian-11-bullseye-guide/)，带有屏幕截图，向您展示如何从头开始在节点机器上安装 Debian。

:::tip
我们对上面链接的指南有一些有用的修正，您可能希望遵循：

- 当提示设置 **root 密码**时，我们建议将其留空**空白**。这将禁用 `root` 账户，而是安装 `sudo` 包，允许您的用户通过重新输入其密码来执行 root 操作以提升其权限。这类似于 Ubuntu Linux 的设置方式，对于用户来说可能更熟悉。
- 在最后的 **软件选择**屏幕中，您可能不希望安装桌面 GUI。
  - 桌面 GUI 对于节点来说基本上是不必要的；它们增加了额外的开销，并且大多数时候不会被使用，因为您无论如何都将通过终端远程控制它，因此我们更喜欢在这里**取消选中 GNOME 和 Debian 桌面环境**。
  - 如果您_确实_想要在节点上使用桌面 UI，我们建议您**取消选中 GNOME 并选中 XFCE**，因为它对系统资源的消耗较少。我们还建议不要在节点上运行任何其他软件，例如浏览器或 Discord，因为它们会降低安全性并消耗系统资源。
  - 取消选中 **web 服务器**，但保留 **SSH 服务器**和**标准系统实用程序**选中。
- 如果您从 iso 创建了闪存驱动器，您可能需要禁用 CD-ROM 存储库才能运行 `apt`。
  您可以在[此处](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/)找到有关如何执行此操作的说明。
- 您的系统可能默认设置为睡眠/休眠。要禁用这些设置，您可以运行以下命令：
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### 安装 `sudo`

Rocket Pool 的安装程序需要 `sudo` 程序来获取其所有依赖项。
如果您在上一步中将 **root 用户密码留空**，您将已经拥有此功能。
如果没有，请立即通过运行以下命令安装它：

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

然后重启机器。
您现在应该能够通过 `sudo` 运行命令，例如 `sudo apt update`。

### 使用 SSH

安装服务器后，您可以登录，您需要获取其 IP 地址。
一个简单的方法是使用 `ifconfig`，它内置在 'net-tools' 包中：

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

您可能会在这里看到几个条目，但您要查找的条目看起来像这样：

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

标志应该显示 `UP,BROADCAST,RUNNING,MULTICAST`。
`inet` 值（此处为 `192.168.1.8`）是您的机器的本地 IP 地址。

接下来，安装 SSH：

```shell
sudo apt install openssh-server
```

:::tip 注意
如果您在 Debian 安装期间选中了 **SSH 服务器**框，您应该已经安装了此功能，因此此命令不会执行任何操作。
:::

完成此操作后，您可以使用 `ssh` 从笔记本电脑或台式机远程登录到机器的终端。

如果您不熟悉 `ssh`，请查看[安全外壳简介](../ssh)指南。

:::warning 注意
此时，您应该_强烈考虑_配置路由器以使节点的 IP 地址**静态**。
这意味着您的节点将永远拥有相同的 IP 地址，因此您始终可以使用该 IP 地址通过 SSH 登录。
否则，您的节点的 IP 可能会在某个时候更改，并且上面的 SSH 命令将不再有效。
您必须进入路由器的配置以找出节点的新 IP 地址是什么。

每个路由器都不同，因此您需要查阅路由器的文档以了解如何分配静态 IP 地址。
:::

## 设置交换空间

在大多数情况下，如果您仔细选择执行客户端和共识客户端以及实例类型，则不应耗尽 RAM。
话虽如此，增加一点额外的内存也无妨。
我们现在要做的是添加所谓的**交换空间**。
从本质上讲，这意味着我们将使用 SSD 作为"备用 RAM"，以防发生可怕的事情并且您的服务器耗尽了常规 RAM。
SSD 的速度不如常规 RAM 快，因此如果它达到交换空间，它会减慢速度，但它不会完全崩溃并破坏所有内容。
将此视为您（很可能）永远不需要的额外保险。

### 创建交换文件

第一步是创建一个新文件，该文件将充当您的交换空间。
决定您想要使用多少 - 一个合理的起点是 8 GB，因此您有 8 GB 的普通 RAM 和 8 GB 的"备用 RAM"，总共 16 GB。
为了超级安全，您可以将其设置为 24 GB，这样您的系统就有 8 GB 的普通 RAM 和 24 GB 的"备用 RAM"，总共 32 GB，但这可能是过度的。
幸运的是，由于您的 SSD 有 1 或 2 TB 的空间，因此为交换文件分配 8 到 24 GB 可以忽略不计。

为了本演练的目的，让我们选择一个不错的中间地带 - 比如说，16 GB 的交换空间，总 RAM 为 24 GB。
在我们进行时，只需替换您想要的任何数字。

输入此命令，它将创建一个名为 `/swapfile` 的新文件，并用 16 GB 的零填充它。
要更改数量，只需将 `count=16` 中的数字更改为您想要的任何数字。**请注意，这将花费很长时间，但这没关系。**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

接下来，设置权限，以便只有 root 用户可以读取或写入它（出于安全考虑）：

```shell
sudo chmod 600 /swapfile
```

现在，将其标记为交换文件：

```shell
sudo mkswap /swapfile
```

接下来，启用它：

```shell
sudo swapon /swapfile
```

最后，将其添加到挂载表中，以便在服务器重新启动时自动加载：

```shell
sudo nano /etc/fstab
```

在末尾添加一个新行，如下所示：

```
/swapfile                            none            swap    sw              0       0
```

按 `Ctrl+O` 和 `Enter` 保存，然后按 `Ctrl+X` 和 `Enter` 退出。

要验证它是否处于活动状态，请运行以下命令：

```shell
sudo apt install htop
htop
```

您的输出应该在顶部看起来像这样：
![](../local/images/pi/Swap.png)

如果标记为 `Swp` 的最后一行中的第二个数字（`/` 后面的数字）不为零，则您已准备就绪。
例如，如果显示 `0K / 16.0G`，则您的交换空间已成功激活。
如果显示 `0K / 0K`，则它不起作用，您必须确认您正确输入了前面的步骤。

按 `q` 或 `F10` 退出 `htop` 并返回终端。

### 配置交换性和缓存压力

默认情况下，Linux 会急切地使用大量交换空间来减轻系统 RAM 的一些压力。
我们不想那样。我们希望它在依赖 SWAP 之前使用所有 RAM 直到最后一秒。
下一步是更改系统的所谓"交换性"，这基本上是它使用交换空间的渴望程度。
关于将此值设置为多少存在很多争论，但我们发现值为 6 效果很好。

我们还想降低"缓存压力"，它决定了服务器删除其文件系统缓存的速度。
由于我们的设置将有大量备用 RAM，我们可以将其设置为"10"，这将在内存中保留缓存一段时间，从而减少磁盘 I/O。

要设置这些，请运行以下命令：

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

现在，将它们放入 `sysctl.conf` 文件中，以便在重新启动后重新应用它们：

```shell
sudo nano /etc/sysctl.conf
```

在末尾添加这两行：

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

然后像以前一样保存并退出（`Ctrl+O`，`Ctrl+X`）。

### 安装前系统检查

在安装 Rocket Pool 之前，请查看以下清单：

- 您的系统已完全构建，可以开机，并可以启动到操作系统。
- 您不会在系统上进行任何其他活动，例如浏览互联网、检查电子邮件或玩游戏。
- 您已安装 Linux 操作系统。
- 您的用户帐户具有 root / 管理员权限。
- 您有一个满足性能要求的 SSD。
- 您的 SSD 已挂载在文件系统上。
- 您至少有 1.5 TB 的可用磁盘空间用于初始执行和共识同步过程。
- 如果您的 ISP 限制了您的数据，则每月超过 2 TB。

如果您已检查并确认所有这些项目，那么您已准备好安装 Rocket Pool 并开始运行节点！
继续到[选择您的 ETH 客户端](../eth-clients)部分。
