# スキミング報酬の分配

EthereumのValidatorを運用することで受け取るETH報酬は、「スキミング」と呼ばれるプロセスで定期的にminipoolに送信されます。
スキムの頻度は、Beacon Chain上のアクティブなvalidatorの数によって異なります。執筆時点では、validatorの数は約500,000であり、
約2〜3日ごとにスキムが発生します。

スキミングされた報酬は、「分配」するまで各minipoolに蓄積されます。このプロセスは、あなたの手数料率と提供されたETHと供給されたETHの比率に基づいて、
ノードオペレーターであるあなたとrETH保有者の間でスキミングされた報酬を分配します。

::: warning NOTE
minipoolの残高にアクセスするには、最初に[Atlas delegate](./minipools/delegates)にアップグレードする必要があります。
古いRedstone delegateは、minipoolの残高を分配するために使用できません。
:::

## 自動分配

デフォルトでは、Smartnodeは個々の残高が**1 ETH**に達したときに、minipoolのいずれかを自動的に分配するように構成されています。
この閾値は、以下の手順に従ってTUIで構成できます。

実行:

```shell
rocketpool service config
```

以下に示す`Smartnode and TX Fee Settings > Auto Distribute Threshold`設定に移動します。

![](./images/tui-automatic-skimming.png)

この設定を変更すると、Smartnodeがminipoolを自動的に分配する閾値が調整されます。
パラメータを0に設定すると、自動分配が無効になります。

::: warning WARNING
自動分配を無効にすることにした場合、定期的に手動分配を実行することが重要です。
これを行う方法については、続く[手動分配セクション](#manual-distribution)を読んでください。

長期間の後、スキミングされた報酬が8 ETHを超える可能性があります。この状況が発生すると、それらを分配できなくなり、
蓄積された報酬にアクセスするにはvalidatorを終了する必要があります。

Rocket Poolには、長い待機期間の後、誰でも残高が8 ETHを超えたときにminipoolを分配できるフェイルセーフ設計が備わっています。
資本を保護するために、Smartnodeはこの状況を監視し、発生した場合に自動的にminipoolを終了します。
:::

## 手動分配

スキミングされた報酬の自動分配を無効にした場合、次のプロセスで定期的に自分で分配する必要があります。

上記の自動プロセスを待たずに、いつでもこのプロセスを使用して報酬を手動で分配することもできます。

minipoolに8 ETH未満がある場合、次のコマンドを使用して報酬を分配できます。

```shell
rocketpool minipool distribute-balance
```

これにより、分配の対象となるminipool、保有するETHの量、および(ノードオペレーターとしての)あなたが受け取るETHの量が表示されます。

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

元のローンチdelegateを使用しているminipoolは最初に言及され、delegateをアップグレードするまで`distribute-balance`を呼び出すことができないことが通知されます。
このdelegateは、スキミング引き出しが指定される前に書かれたため、スキミングされた報酬を分配する方法がありません。

対象となるminipoolについては、**払い戻し額**も表示されることに注意してください。
これは、あなたに直接支払われる金額です(例えば、[16-ETHボンドから8-ETHボンドへの移行](./leb-migration.mdx)前にminipoolに残高があったため、または既存の報酬を持つ[ソロvalidatorをminipoolに変換](./solo-staker-migration)したため)。
rETH保有者と共有されません。

分配したいminipoolの番号を入力します。
通常どおりガス価格チャートが表示され、決定の確認を求められます。
確認すると、minipoolの残高が分配されます。

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

[トランザクションから](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9)わかるように、これによりノードの引き出しアドレスにノードの報酬シェア(払い戻し額を含む)が提供され、残りがステーキングプールに返されました。
