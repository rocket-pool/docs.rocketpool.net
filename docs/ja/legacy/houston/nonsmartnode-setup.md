# 非smartnodeユーザー向けの投票設定

一部のユーザー(例: Allnodesのユーザー)はsmartnodeを使用せず、直接コントラクトとのやり取りによって投票を設定する必要がある場合があります。
このガイドには、そのようなユーザー向けの最小限のセットアップガイドと完全なセットアップガイドの両方が含まれています。

::: tip
ノードアドレスはハードウェアウォレットに読み込んでおく必要があります。
:::

## 最小限のセットアップガイド

これにより、デリゲートがオンチェーンとオフチェーンであなたの代わりに投票できるようになります。オンチェーンではデリゲートを上書きできますが、オフチェーンでは上書きできません。

- Etherscanを使用して、デリゲートを指定して投票権を初期化します(ノードアドレスで「Connect to Web3」) https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- デリゲートは https://delegates.rocketpool.net/ で見つけることができます

## 完全なセットアップガイド

Etherscanを使用して投票権を初期化します(ノードアドレスで「Connect to Web3」)

- [ほとんどの人に推奨] 別のノードをデリゲートとして投票を初期化 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - デリゲートは https://delegates.rocketpool.net/ で見つけることができます
  - デリゲートはいつでも上書きできることを覚えておいてください
- 自分のノードをデリゲートとして投票を初期化 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - ここでは毎回投票する責任があります
  - このオプションは主に、毎回投票する必要があるデリゲートになりたい人に提案します
- ノードがHouston後に登録された場合:
  - 投票権は既に自分のノードをデリゲートとして初期化されています
  - https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 で新しいデリゲートを設定できます

Snapshotシグナリングアドレスを設定:

- https://node.rocketpool.net/signalling-address にアクセスし、ノードアドレスを接続します
  - 希望するSnapshotシグナリングアドレスを入力し、メッセージに署名して、必要なr、s、v引数を取得します
  - 注意: Snapshotシグナリングアドレスはノードアドレスであってはなりません
- 新しいタブで https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2 にアクセスします
  - ノードアドレスで「Connect to Web3」
  - シグナリングアドレスと前のステップで取得したr、s、vパラメータを使用して引数を入力します
