# 选择质押硬件

目前没有运行 Rocket Pool 节点的官方规格要求。
本页面提供了一些指南和示例，可以帮助您选择质押硬件。

您的节点的最低硬件要求将取决于您选择的共识客户端和执行客户端。
例如，如果您打算在低功耗设备上运行节点，您可能会被限制使用 `Geth` 作为执行客户端，使用 `Nimbus` 作为共识客户端。
如果您使用的是配备 32+ GB RAM 的更强大的 NUC，则所有客户端组合都可供您选择。

以下指南假设您希望获得**舒适**的硬件水平，这意味着您有足够的容量。
如果您遵循这些指南，您的节点将有足够的资源来运行任何 Rocket Pool 支持的客户端组合。
这将允许您选择`随机`客户端对，这对于 Ethereum 网络的客户端多样性非常重要。

::: tip 注意
Ethereum 质押非常宽容。
如果您的房子被淹，质押设备被烧毁，花一周时间恢复运行不会有太大的惩罚（除非您恰好在同步委员会中，这是非常罕见的事件）。
组件故障可能会在某个时候发生，但不要为此感到压力。
停机时间不会导致罚没，除非您在整个 Ethereum 网络发生重大故障期间离线。
:::

## 硬件要求

Ethereum 验证器的计算要求并不高，也就是说，一旦您的执行客户端和共识客户端运行起来，任何额外的验证器将使用**非常少量的额外资源**。
这会增长到 64 个验证器，在这一点上，添加第 65 个及以后的验证器所需的资源可以忽略不计。

根据我们的经验，大多数设置，包括迷你电脑和 NUC，都能够运行实际上无限数量的验证器。

### CPU 要求

**指南：任何至少具有 4 个线程的现代 CPU。**

运行 Rocket Pool 节点的计算密集度不高。
CPU 的最大影响是您首次创建节点时（或以后更改客户端时）节点可以多快地初始同步区块链状态。
初始同步后，CPU 的使用就不那么繁重了。

CPU 命名可能具有欺骗性；2010 年的 Intel Core i5 通常**不如** 2022 年的 core i3 强大。
许多社区成员使用 Intel NUC 设备是因为它们的小巧外形，但旧的 i5 NUC 可能不如新的 i3。
因此，我们建议使用"现代" CPU，最多只有几年的历史。
更具体地说，**对于基于 x64 的 CPU**，我们建议使用支持 [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) 扩展的 CPU - 检查您的 CPU 制造商规格以查看是否支持。
并非所有现代 CPU 都支持此功能；例如，Celeron CPU 往往不包括它。

基于 ARM 的 CPU（例如 Mac M1 或 M2，或 Rock 5B）不适用于上述 BMI2 扩展。

::: tip 注意
如果您有兴趣使用 NUC，您可以通过其型号了解 NUC 的现代程度。
它们的格式为 `NUC` + `代数` + `型号` + `CPU 类型` + `后缀`。
例如，`NUC11PAHi50Z` 单元是第 11 代 i5 单元。
您可以在 Intel 网站上[此处](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html)查看 NUC 列表。

其他迷你电脑，例如 Asus PN50 或 PN51，不遵循此约定，但它们使用的 CPU 信息应包含在其产品页面中。
:::

CPU 上的核心数量不如其**线程数**相关。
我们建议 Rocket Pool 节点操作至少需要 **4 个线程**。
一个具有 4 个线程的 2 核 CPU 可以正常工作。
很少能找到只有 2 个线程的 CPU。

### RAM 要求

**指南：至少 16 GB RAM，首选 32 GB，首选 DDR4**

Rocket Pool 节点可以在仅 16 GB RAM 的情况下运行。
我们通常建议有稍多一些的空间，以提供一些余地并完全支持像 Teku 这样的 RAM 密集型客户端。
更多 RAM 的另一个好处是您可以为执行客户端提供更大的缓存大小，这往往会减慢磁盘空间使用率。

### SSD 要求

**指南：2+ TB SSD，具有 TLC 或更高，带有 DRAM 缓存。首选 NVMe。**

这个元素比大多数人预期的更重要。
执行客户端严重依赖 IOPS，或"每秒操作数"；我们建议 15k 读取 IOPS 和 5k 写入 IOPS
在实践中，这意味着：

- HDD（旋转盘片）驱动器将无法工作
- SATA 或外部 USB 3.0+ SSD *可以*工作
- 首选 NVMe SSD 驱动器

如果您已经有一个想要使用的 SSD，并且想确定它是否具有足够的性能来进行节点操作。

_\* 如果您不确定您的磁盘是否满足这些性能要求，`fio` 是测试它们的好方法。
请参阅[此处](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/)了解 Linux 说明，
以及[此处](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/)了解 MacOS 说明。_

:::tip 注意
SSD 选择可能是一个复杂的选择！

SSD 用于在闪存芯片上存储数据的方法对速度和寿命有明显的影响。
在购买 SSD 时，您可能会注意到像 `QLC`、`TLC` 或 `SLC` 这样的标签。
这些代表闪存芯片的单个单元中包含的数据量：`Q` 代表"四"表示 4，`T` 代表"三"表示 3，`M` 代表"多"表示 2，`S` 代表"单"表示 1。

我们推荐 **TLC、MLC 或 SLC** 驱动器。
我们**不推荐 QLC 驱动器**，因为它们的性能较慢，总体可靠性较低。

SSD 有带或不带 DRAM 的版本，这是一个硬件元素，使访问 SSD 上的数据更加高效。
带 DRAM 的速度更快，但不带 DRAM 的更便宜。
但是，DRAM 对于提供流畅的节点操作非常重要。

我们推荐带有 **DRAM** 缓存的驱动器。
我们**不推荐无 DRAM 驱动器**。
:::

最后的考虑是驱动器大小。
截至 2024 年 10 月，`geth` 执行客户端数据库在完成初始同步（或刚刚完成修剪）后需要大约 1.2TB 的空间。
这将随着时间的推移稳步增长，虽然修剪可以恢复一些空间，但新修剪的状态*确实*会随着时间的推移而增长。
拥有更大的驱动器会让您安心。

### 常见配件

许多节点运营商改进了他们的设置，超出了最低要求。
一些常见的添加包括：

- SSD 散热片以延长驱动器寿命
- 不间断电源（UPS）以防断电
- 备用节点以在出现故障时进行备份

这些都很方便，但运行 Rocket Pool 节点不是必需的。

## 示例设置

在本节中，我们将展示 Rocket Pool 社区为自己创建的一些不同的构建。
它们是人们正在使用的示例，而不是您应该如何运行设置的建议。
请注意，许多设置已经有些过时，例如，使用的 SSD 现在太小了。

### Xer0 的服务器

![](./images/Xer0.jpg)

Discord 用户 **Xer0** 是众多选择为其质押机器采用传统 PC 外形的质押者之一。
他们想要构建一个能够持续多年且维护和升级需求最少的设备，同时仍然提供每个组件的完全定制。
为此，Xer0 设计并构建了一个完整的 ATX 服务器 - 很像传统的台式 PC，但专门针对 Ethereum 上的质押。
他们的设置包括一个六核 Xeon Bronze 3204（1.9 GHz），8 个 DDR4 插槽和一个 M.2 插槽……不过由于这本质上是一个家庭服务器构建，具体组件完全取决于最终用户。

Xer0 的设置：

- 主板：[Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153)（$440）
- CPU：[Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ)（$248）
- RAM：[NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV)（$359）
- SSD：[Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007)（$250）
- 机箱：[SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0)（$172）
- PSU：[EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094)（$111）
- 散热器：[Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J)（$100）
- **总计：$1680**

以下是 Xer0 关于为什么选择此设置的评论：

_显然，没有必要仅仅为了在 Ethereum 网络上质押而构建一个庞然大物，但我有几个原因构建了这样的东西。_

1. _现在我相信，未来 1 个或更多验证器的价值将远远超过我们现在看到的，所以我想购买一些能够在未来至少 10-20 年内毫无问题地支持网络的东西。_
1. _通过创建一台拥有这么多核心的机器，我也为自己提供了更多的余地，以至于我可以在上面运行 L2 聚合器而不会遇到任何问题（关于硬件）以及我想在服务器上运行的任何其他东西。_ :)
1. _我喜欢组装电脑，所以我就组装了……_
1. _使用服务器构建，它为我提供了更多的硬件和功能灵活性，而大多数计算机本身没有这些功能。_
1. _一点未来保障（以防万一）_ :wink:

### Darcius 的架子设备

![](./images/Darcius.jpg)

Rocket Pool 的创始人 David Rugendyke（在 Discord 上被称为 **darcius**）花了很长时间完善他的节点。
经过一番辩论，他构建了一个小巧便携的 Mini-ITX，但仍然拥有巨大的处理能力。
他的设备包括一个 8 核 Ryzen 7 5800x（3.8 GHz），两个 DDR4 插槽和两个 M.2 插槽用于 NVMe SSD。
它确实是 Rocket Pool 节点中性能最高的设备之一，但有充分的理由：darcius 运行一种称为 Oracle Node 的特殊类型的 Rocket Pool 节点，该节点将信息从 Beacon 链中继回执行链，涉及所有 Rocket Pool 验证器。
有数千个活跃的 Rocket Pool minipool 需要监视，这项工作需要大量的马力……但他的架子设备很容易胜任这项任务。

Darcius 的设置：

- 主板：[MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323)（$200）
- CPU：[AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665)（$490）
- RAM：[Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5)（$390）
- SSD：[Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744)（$315）
- 机箱：[SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB)（$52）
- PSU：[SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154)（$140）
- **总计：$1587**

### Yorick 的 microATX 构建

![](./images/Yorick-stock.jpg)

资深硬件爱好者 **YorickDowne** 拥有丰富的服务器构建和维护经验。
利用这些知识，他选择了灵活的 microATX 设置。
他的机器比典型的 PC 小得多，但仍然设法容纳了服务器级技术，最大化了弹性和正常运行时间 - 这是运行 Rocket Pool 节点时的关键指标。
他对 Intel 和 AMD 设置都有建议，您可以在[他的网站](https://eth-docker.net/docs/Usage/Hardware)上找到。
Intel 版本使用四核 i3-9100F（3.6 GHz）或 Xeon CPU，AMD 版本建议任何支持 ECC 内存的 Ryzen CPU。
对于这两种配置，他建议使用 16 GB 的 ECC RAM 和 1 TB NVMe SSD。

Yorick 的设置：

- 主板：[SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671)（$200）
- CPU：[Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072)（$150）
- RAM：[Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080)（$100）
- SSD：[Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743)（$165）
- 机箱：[SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/)（$110）
- PSU：任意（示例：[Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)）（$161）
- 机箱风扇：任意
- **总计：约 $886**

以下是 Yorick 关于为什么选择此设置的评论：

- _它的成本与某些 NUC 相同或更低_
- _它有 ECC RAM，这意味着如果内存出现故障 - 偶尔会发生 - 我会知道，因为系统会告诉我。我不必运行 memtest87 4-5 天来弄清楚我的不稳定问题是否与内存有关。我非常珍惜我的时间，所以我可以在 Discord 上夸夸其谈，而不是对硬件进行故障排除_
- _它有 IPMI，这是通过以太网/浏览器对整个机器的远程管理，包括 UEFI 和电源循环。我应该被允许进行长期度假，同时仍然拥有完全的远程访问权限。_
- _如果我想要冗余存储，以便最终的 SSD 故障不是问题，我可以做到_
- _它允许在构建选择方面具有很大的灵活性。我可以选择我想要的 RAM 和计算量；我可以选择运行像 TrueNAS Scale 这样的带有虚拟化技术的 NAS，并在那里运行节点以及一些其他家庭服务器的东西。_

### Drez 的笔记本电脑

![](./images/Drez.jpg)

有时，购买新硬件并没有意义。
在 Discord 用户 **Drez** 的情况下，运行 Rocket Pool 节点就是其中之一。
Drez 碰巧有一台备用笔记本电脑，他们轻松地将其变成了一个节点。
他们的机器配备了四核 i7-4710HQ（2.5 GHz），两个 DDR3 插槽和一个 2.5" SATA 插槽。
作为一台笔记本电脑，它还配备了自己的电池（这抵消了对 UPS 的需求）。
随着时间的推移，他们增加了一些额外的升级，为笔记本电脑提供了更多的电力以获得额外的安心。

Drez 的设置：

- 笔记本电脑：[MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification)（$1800）
- RAM：2x8GB DDR3 1333Mhz（包含）
- SSD：[Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T)（$110）
- **总计：$1910**

以下是 Drez 关于为什么选择此设置的评论：

_我将在这台笔记本电脑上进行质押的主要原因是因为我已经有一台备用笔记本电脑，不需要在新服务器上花费额外的钱。
我喜欢它的移动性、紧凑性、内置屏幕便于监控。
如果过热，我买了一个笔记本电脑散热垫和备用 CPU 散热器以防万一，我还建议更换导热膏，特别是如果您要在较旧的机器上运行_

## NUC（下一代计算单元）和迷你电脑

运行 Rocket Pool 节点不一定需要一个完整的自己动手的台式机。
事实上，质押者中最受欢迎的设置之一是杰出的 NUC。
NUC（下一代计算单元）本质上是一个小型、独立的计算机，专为极低的功耗和最高效率而设计。
NUC 非常适合大多数只运行少数验证器的质押者，因为它们的维护成本低、每月运行成本低且易于设置。
与 PC 不同，NUC 在机箱中预先组装好；您需要做的就是添加一些 RAM，添加一个 SSD，然后就可以运行了！
以下是一些 Rocket Pool 资深人士使用并推荐的 NUC 设置示例。

::: tip 注意
**以太网适配器兼容性**

如果您计划购买 Intel® NUC 第 11 代或第 12 代，您可能会遇到以太网适配器的连接问题，特别是如果适配器被识别为 **I225-LM**（购买前检查 Intel 规格）。
如果您已经拥有一个，您可以采取一些步骤来解决此问题。
I225-LM 适配器与某些兼容性挑战相关联，可能导致**系统冻结**和意外的内核行为，特别是在使用 Linux 内核时。

要确定您的 NUC 是否使用有问题的 I225-LM 以太网适配器，您可以在终端中使用以下命令：

```shell
sudo lshw -class network | grep 225
```

如果输出确认存在 I225-LM 适配器，您可能会遇到上述问题。但是，您可以应用*补救措施*来缓解这些问题：

**USB-C 转以太网适配器**：一个可行的解决方案是获取 USB-C 转以太网适配器，并通过此外部适配器连接您的互联网电缆。虽然这种方法需要额外的硬件和配置，但它已被证明可以有效解决兼容性冲突。这允许您使用最新的 Linux 内核，而不会遇到与 I225-LM 适配器相关的冻结或内核相关异常。**如果您已经拥有带有 I225-LM 的 NUC，这是推荐的解决方案（目前）** _请记住，选择适配器可能会在潜在延迟或降低的互联网速度方面引入权衡。为了减轻这种影响，建议选择至少具有 1GB/s 传输能力的适配器，从而帮助保持最佳数据传输速率。_

**驱动程序和软件更新**：考虑通过参考 Intel® 官方支持页面更新您的驱动程序、固件和 BIOS，请访问[此处](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads)。这可能包括使用 Intel 网站上的最新可用支持驱动程序或应用解决兼容性问题的 BIOS 更新。

**Intel 的补丁（Windows）**：Intel 已发布补丁来解决 Windows 系统上的类似问题。虽然补丁本身**可能不直接适用于 Linux 环境**，但它强调了 Intel 对问题的认可以及他们提供解决方案的努力。您可以在此[链接](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3)中找到有关补丁的更多详细信息。

请记住，技术在不断发展，解决方案可能会随着时间的推移而改变。始终在其官方下载[页面](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads)上关注 Intel 为您的特定 NUC 型号提供的最新资源。

通过遵循这些步骤，您可以解决 Intel® NUC 第 11 代和第 12 代产品上与 I225-LM 以太网适配器相关的兼容性挑战，确保您的服务器部署更流畅、更可靠。_虽然使用此适配器的 NUC 用户子集报告没有遇到任何问题，但重要的是要注意**大多数用户**，特别是在内核升级后，都遇到了问题。值得注意的是，5.15.+ 内核已被证明是使用 I225-LM 适配器的用户的最稳定选项。如果使用 USB-C 适配器的想法不吸引人，并且您愿意承担潜在随机冻结的风险，建议**保持在已证明具有更高稳定性的内核版本上**。_
:::

### Ken 的 NUC8i5BEK

![](./images/Ken.jpg)

NUC8i5BEK 是 Intel 自己的 NUC 之一，配备第 8 代处理器。
该型号于 2018 年发布，配备四核 i5-8259U CPU（2.30 GHz），两个 DDR4 插槽，一个用于 SSD 的 M.2 插槽和 USB 3.1 端口。
它通常消耗约 20 瓦，但 Discord 用户 **Ken** 已经能够在正常验证期间将其优化到 9 瓦。
它能够处理任何执行客户端和任何共识客户端，使其成为轻量级、高效节点机器的绝佳选择。

Ken 的设置：

- 基础：[Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM)（$349）
- RAM：[Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory)（$112）
- SSD：[ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5)（$230）
- 无风扇机箱（可选）：[AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY)（$134）
- **总计：$691 到 $825**

以下是 Ken 关于为什么选择此设置的评论：

- _体积小，占地面积小，电源是电源线上的砖块（像笔记本电脑一样），单板计算机，x86 架构，低购买价格点，低功耗（~10W），3 年保修，以及活跃的制造产品线（Intel）。_
- _第 8 代速度足够快，价格点低于最新一代芯片。_
- _我升级到了无风扇（被动冷却）机箱，因此 NUC 绝对安静（0 dB），因为我将其留在家庭办公室（库存 NUC 已经几乎无声）。_
- _此外，风扇轴承上没有机械磨损。_
- _如果我决定退役此硬件平台作为我的 RP 节点，则具有转售或重新用途价值 - NUC 可以成为出色的工作站计算机。_

### GreyWizard 的 NUC10i7FNH

![](./images/GreyWizard.jpg)

NUC10i7FNH 是 Intel 自己的另一个 NUC。
这款配备第 10 代处理器，于 2019 年发布。
它配备六核 i7-10710U CPU（1.10 GHz，提升到 4.7 GHz），两个 DDR4 插槽，一个 M.2 插槽和一个 2.5" 插槽用于 SSD，以及 USB 3.1 端口。
它消耗约 20 瓦的功率。
考虑到其功耗和尺寸，它是一台功能极其强大的机器。
Discord 用户 **GreyWizard** 使用此 NUC 作为他的节点 - 额外的功率使他安心，知道无论 Ethereum 2.0 链的未来如何，他的机器都能够处理它。

GreyWizard 的设置：

- 基础：[Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227)（$445）
- RAM：2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156)（每个 $154）
- SSD：[Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744)（$315）
- **总计：$1068**

以下是 GreyWizard 关于为什么选择此设置的评论：

_我选择 i7 NUC 主要是因为它感觉像是相对于整体尺寸和开销的出色性能的最佳组合。
我还考虑了其他选择，比如构建一个 Micro ATX 尺寸的机器。
在为我想要的规格定价后，这个 Intel NUC 最终的价格差不多，而且外形尺寸真的很难被超越。
我喜欢拥有额外的性能/安心的余地，我承认这几乎肯定是过度的。
我认为质押是一项严肃的投资，我不想担心我的硬件是否足够。_

_给其他考虑此选项的人的提示……_

- _NUC 确实运行得相当热，温度与笔记本电脑相似。如果您担心 CPU 温度并且想要功能强大的东西，那么您应该考虑像 Micro ATX 这样的小型台式机设置。_
- _您需要确保 NUC 周围有足够的空间用于气流。计划定期清洁该区域以防止灰尘堆积。_
- _确保检查 RAM 卡的兼容性。不同的 NUC 支持不同程度的总 RAM、RAM 速度等。_
- _如果您选择 NUC，我建议您在选择 RAM 时为自己留出增长空间……例如，多花一点钱购买一张 32gb RAM 卡而不是 2x16，这样您以后可以扩展（假设您的 NUC 在此示例中支持 64gb）_
- _如果您想讨论，请随时在 Discord 上与我联系。_

### ArtDemocrat 的 NUC10i5FNHN 构建过程视频

为了补充 Greywizard 的设置描述和提示，ArtDemocrat 创建了此构建过程视频作为设置 NUC10 的额外帮助资源（在本例中为 NUC10i5FNHN，但构建过程应该与 NUC10i7FNH 相似）：

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat 的设置：

- 基础：[Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html)（$300）
- RAM：1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH)（$65）
- SSD：[Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L)（$107）

### Actioncj17 的 PN50

![](./images/PN50-actioncj17.jpg)

ASUS PN50 是一款迷你电脑，与 Intel 的 NUC 系列有很多共同点。
它的外形非常小，但拥有完整 PC 的所有组件和功能。
它配备您选择的 AMD CPU，因此您可以在性能和成本之间取得平衡（最多 8 核 Ryzen R7-4700U，2.0 GHz），两个 DDR4 插槽，一个 M.2 插槽和一个 2.5" 插槽用于 SSD，以及 USB 3.1 端口。
它还配备了 90 瓦的电源，尽管在实践中作为 Rocket Pool 节点时并不需要那么多功率。
Discord 用户 **actioncj17** 尝试了几种不同的设置，但更喜欢 PN50 而不是所有其他设置……尽管他们很高兴地承认，对于运行 Rocket Pool 节点来说，这是过度的。

Actioncj17 的设置：

- 基础：[ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206)（$583）
- RAM：[HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836)（$220）
- SSD：[Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744)（$315）
- **总计：$1118**

以下是 actioncj17 关于为什么选择此设置的评论：

_我选择 Asus PN50 的答案很简单。
我想看看 AMD 的 Ryzen 7 4700U 有多厉害。
我只能说我没有失望。
我实际上从 Intel NUC10FNK 开始。
我在 NUC 中安装了 32gb RAM 和 1tb 970 evo plus NVMe m.2，它速度很快。
我对 NUC 没有任何抱怨，它工作得很好，但我从 PN50 中获得了更多。
我会说这两种设置对于在 Rocketpool 上质押来说都是过度的，但一点未来保障不会有坏处。
它们都占地面积小，NUC 实际上更安静，因为它是无风扇的。
总而言之，如果您能拿到一个，PN50 的性价比更高。_

### Moralcompass 的迷你电脑

![](./images/moralcompass-minipc.jpg)

Discord 用户 **moralcompass** 通过选择迷你电脑走了与 actioncj17 类似的路线，但他们更喜欢 Intel CPU。
他们使用的迷你电脑配备四核 i5 8250U（1.6 GHz，提升至 3.4 GHz），一个 DDR4 插槽，一个 M.2 插槽和一个 2.5" 插槽用于 SSD，以及 USB 3.0 端口。
Moralcompass 声称它只从墙上拉取约 10 瓦，这表明像这样的迷你电脑非常高效。
这个选择有趣的是它完全被动冷却 - 找不到风扇！
虽然有许多无风扇迷你电脑的变体，但 moralcompass 找到了一个适合他们的，并一直坚持使用。

Moralcompass 的设置：

- 基础：[Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh)（$387）
- RAM：[Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239)（$153）
- SSD：[Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L)（$115）
- **总计：$655**

以下是 moralcompass 关于为什么选择此设置的评论：

- _无移动部件，无噪音。_
- _双 Intel NIC（以防我决定有一天将其重新用作我的路由器）_
- _NVME + SATA 插槽（更喜欢 NVME 的速度和具有更高 TBW 耐久性的选项。SATA 提供 HDD 或 SSD 的选项。我避免使用 M.SATA 接口，因为这些 SSD 似乎正在变成遗留产品）_
- _USB 和串行端口可用于 UPS 的优雅关机信号_
