# 非 smartnode 用户的投票设置

一些用户(例如 Allnodes 用户)不使用 smartnode,可能需要通过直接合约交互来设置投票。
本指南包含此类用户的最小设置指南和完整设置指南。

::: tip
您的节点地址应加载到硬件钱包上。
:::

## 最小设置指南

这允许您的委托人在链上和链下为您投票。您将能够在链上覆盖您的委托人,但不能在链下覆盖。

- 使用 etherscan 初始化投票权(使用节点地址"Connect to Web3")与委托人 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- 您可以在 https://delegates.rocketpool.net/ 找到委托人

## 完整设置指南

使用 etherscan 初始化投票权(使用节点地址"Connect to Web3")

- [大多数人推荐] 使用不同节点作为委托人初始化投票 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - 您可以在 https://delegates.rocketpool.net/ 找到委托人
  - 请记住,您始终可以覆盖您的委托人
- 使用您自己的节点作为委托人初始化投票 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - 在这里,您将负责每次投票
  - 我主要建议希望成为委托人的人使用此选项,因为他们_确实_需要每次投票。
- 如果您的节点是在 Houston 之后注册的:
  - 您的投票权将已经初始化,您自己的节点作为委托人
  - 您可以使用 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 设置新的委托人

设置 snapshot 信号地址:

- 转到 https://node.rocketpool.net/signalling-address 并连接您的节点地址
  - 输入您想要的 snapshot 信号地址并签署消息以获取您需要的 r、s 和 v 参数
  - 注意:您的 snapshot 信号地址**必须不是**您的节点地址
- 在新选项卡中,转到 https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - 使用节点地址"Connect to Web3"
  - 使用您的信号地址和上一步中给出的 r、s、v 参数填写参数
