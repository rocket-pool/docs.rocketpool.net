# smartnodeを使用しないユーザー向けの投票設定

一部のユーザー（例：Allnodesユーザー）はsmartnodeを使用しておらず、直接コントラクトのやり取りを使用して投票を設定する必要がある場合があります。
このガイドには、そのようなユーザー向けの最小限のセットアップガイドと完全なセットアップガイドの両方が含まれています。

::: tip
これには、ノードアドレスをハードウェアウォレットにロードする必要があります。
:::

## 最小限のセットアップガイド

これにより、委任者があなたの代わりにオンチェーンとオフチェーンで投票できるようになります。オンチェーンでは委任者を上書きできますが、オフチェーンではできません。

- etherscanを使用して、委任者との投票権を初期化します（ノードアドレスで「Connect to Web3」） https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- 委任者は https://delegates.rocketpool.net/ で見つけることができます

## 完全なセットアップガイド

etherscanを使用して投票権を初期化します（ノードアドレスで「Connect to Web3」）

- [ほとんどの人に推奨] 委任者として別のノードを使用して投票を初期化 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - 委任者は https://delegates.rocketpool.net/ で見つけることができます
  - 常に委任者を上書きできることを覚えておいてください
- 委任者として自分のノードを使用して投票を初期化 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - ここでは毎回投票する責任があります
  - 主に委任者になりたい人にこのオプションを提案します。なぜなら、彼らは*毎回*投票する必要があるからです。
- Houston後にノードが登録された場合:
  - すでに委任者として自分のノード使用して投票権が初期化されています
  - https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 で新しい委任者を設定できます

スナップショットシグナリングアドレスを設定:

- https://node.rocketpool.net/signalling-address にアクセスして、ノードアドレスを接続します
  - 希望するスナップショットシグナリングアドレスを入力し、メッセージに署名して必要なr、s、およびv引数を取得します
  - 注意: スナップショットシグナリングアドレスはノードアドレスであってはなりません
- 新しいタブで、https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2 にアクセスします
  - ノードアドレスで「Connect to Web3」
  - 前のステップで提供されたシグナリングアドレスとr、s、vパラメーターを使用して引数を入力します
