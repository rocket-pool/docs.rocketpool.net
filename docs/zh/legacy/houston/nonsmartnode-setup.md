# 非智能节点用户的投票设置

某些用户(例如 Allnodes 用户)不使用智能节点,可能需要通过直接合约交互来设置投票。
本指南包含此类用户的最小设置指南和完整设置指南。

::: tip
您的节点地址应该加载到硬件钱包中进行此操作。
:::

## 最小设置指南

这允许您的委托人代表您在链上和链下投票。您将能够在链上覆盖委托人的投票,但无法在链下覆盖。

- 使用 etherscan 初始化投票权("使用节点地址连接到 Web3")并指定委托人 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- 您可以在 https://delegates.rocketpool.net/ 找到委托人

## 完整设置指南

使用 etherscan 初始化投票权("使用节点地址连接到 Web3")

- [推荐给大多数人] 使用不同节点作为委托人初始化投票 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - 您可以在 https://delegates.rocketpool.net/ 找到委托人
  - 请记住,您始终能够覆盖委托人的投票
- 使用您自己的节点作为委托人初始化投票 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - 在这种情况下,您需要每次都负责投票
  - 我主要建议希望成为委托人的人选择此选项,因为他们确实需要每次都投票。
- 如果您的节点在 Houston 升级后注册:
  - 您的投票权将已经以您自己的节点作为委托人进行了初始化
  - 您可以使用 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 设置新的委托人

设置 snapshot 信号地址:

- 访问 https://node.rocketpool.net/signalling-address 并连接您的节点地址
  - 输入您想要的 snapshot 信号地址并签署消息以获取您需要的 r、s 和 v 参数
  - 注意:您的 snapshot 信号地址不能是您的节点地址
- 在新标签页中,访问 https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - 使用节点地址"连接到 Web3"
  - 使用您的信号地址以及上一步中给出的 r、s、v 参数填写参数
