::: danger 警告
Saturn 1の準備のため、現在minipoolのデポジットは無効になっています。
:::

# デポジットクレジットシステム

デポジットクレジットシステムは、以前にノードオペレーターによって担保されていたものの、もはや必要とされないETHを追跡し、再び利用可能にする仕組みです。
このクレジットの発生源は2つあります。

- [既存の16-ETH担保のminipoolを8-ETH担保のminipoolにマイグレーションする](./leb-migration.mdx)(これにより、ノードオペレーターのクレジット残高に8 ETHが追加されます)
- [既存のソロバリデーターをminipoolにマイグレーションする](./solo-staker-migration)(これにより、マイグレーション中に作成するminipoolのタイプに応じて、ノードオペレーターのクレジット残高に16または24 ETHが追加されます)

すべてのノードオペレーターは**0 ETH**のクレジット残高から始まります。
これら2つのアクションのいずれかにより、その残高が相応に増加します。

このETHは流動化されてノードオペレーターに返還されるわけではありません。代わりに、ノードオペレーターからのETHを必要とせずに**追加のminipoolを作成する**ために使用できます。

クレジットシステムはノードオペレーターに対して**透明**です。`rocketpool node deposit`または`rocketpool node create-vacant-minipool`の操作中に可能であれば自動的に使用されます(使用されることをSmartnodeトノードCLIで通知します)。
使用_できない_場合、Smartnodeはユーザーに使用できないことを警告し、どちらの操作でも通常のETH担保が必要になります。

詳細については、以下の[クレジットの利用可能性](#credit-availability)セクションを参照してください。

## 例

クレジット残高が0 ETHで、16-ETH担保のminipoolが1つあるとします。
その後、[そのminipoolを8-ETH担保にマイグレーション](./leb-migration.mdx)できます。
これにより、もはや担保されていない**8 ETH**が発生します。
その8 ETHは**クレジット残高**に配置されます。

次に、_2つ目_の8-ETH minipoolを作成したいとします。
通常通り`rocketpool node deposit`を実行し、担保額として8-ETHを選択します。
これには通常、minipool用に自分のETHを8提供する必要があります。
しかし、クレジット残高が8 ETHあるため、Rocket Poolは**代わりにそれを自動的に使用します**。

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

ここで2番目の行が重要です。クレジット残高にこのデポジットをカバーするのに十分なETHがあり、_それが使用可能である_ことが示されているため、残高が自動的に使用され、ノードウォレットから追加のETHは必要ありません。

クレジット残高の利用可能性の詳細については、[以下の利用可能性セクション](#credit-availability)を参照してください。

## 現在のクレジット残高を確認する

現在のクレジット残高を確認するには、次のコマンドを実行するだけです。

```shell
rocketpool node status
```

これにより、ノードに関する詳細の包括的なリストが生成され、上部にクレジット残高が表示されます。

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## クレジットの利用可能性

状況によっては、ノードにクレジット残高があっても、現在それを使用して追加のminipoolをデプロイできない場合があります。

クレジット残高のETHは**デポジットプール**から取得されます。
したがって、新しい8-ETH minipoolを作成するために8 ETHのクレジットを使用したい場合、そのminipoolの**全32 ETH**がデポジットプールから取得され、自分からは何も必要ありません。
このため、デポジットプールにプリデポジット値(現在1 ETHに設定)をカバーするのに十分なETHがない場合、**残高は利用できません**。

この状況では、`rocketpool node deposit`操作中にSmartnodeがクレジット残高を使用**できない**ことを警告し、代わりにノードウォレットからのETHを使用して担保を完了する必要があります。
これを行っても、クレジット残高は**消費されません**。そのまま残され、デポジットプールに十分な残高がある場合に後で使用できるようになります。
