# 解消されたMinipoolの救済

万が一、minipoolが解消ウィンドウ内にステーキングされない場合、oDAOによって「解消」され、
提供されたユーザー資金は別のminipoolで使用するためにdeposit poolに返されます。このシナリオでは、
ETHを取り戻し、RPLをアンロックしてアンステークできるようにするために、以下のプロセスを実行する必要があります。

## Minipool Delegateの更新

このプロセスを実行する際には、最新のminipool delegateを使用することを強くお勧めします。古いdelegateには
クローズ時に`selfdestruct`操作が含まれており、指定された順序でプロセスが正しく完了しない場合、
資金が永久にロックされる可能性があります。minipoolが最新のdelegateにあるかどうかを確認するには、
[Delegateのアップグレード](./minipools/delegates#upgrading-your-delegate)を試してください。アップグレード可能な
minipoolのリストにminipoolが表示されない場合は、以下に進むことができます。

## 未使用のDeposit Balanceの取得

::: tip 注記
minipoolがAtlas以前に解消された場合は、このステップをスキップして[Beaconchain Balanceを32 ETHに増やす](#increase-your-beaconchain-balance-to-32-eth)に直接進むことができます。
未使用のdeposit balanceを取得する必要はありません。なぜなら、Atlas以前には全体のbond金額がbeaconchainに
デポジットされていたためです。
:::

初期bond depositからの1 ETHは、validatorの
withdrawal credentialsを保護するためのbeaconchainへの初期デポジットとして使用されます。残りの金額は、
deposit poolからETHが割り当てられたときにminipoolにデポジットされます。

minipoolが解消されると、ユーザーETHはdeposit poolに返され、ETHはminipoolに残り、
返却の準備ができています。報酬の[手動配分](./skimming#manual-distribution)機能を使用して、この
ETHを取得し、次のステップでvalidatorをアクティブ化するために使用できます。

## Beaconchain Balanceを32 ETHに増やす

beaconchainでアクティブ化に必要な最小限の残高までvalidatorの残高を補充する必要があります。この
金額は**32 ETH**です。16 ETHボンドのminipoolがある場合は追加で16 ETHが必要で、8 ETHの
ボンドのminipoolがある場合はこのステップで追加で24 ETHが必要です。

必要な量のETHをノードアドレスにデポジットし、次のコマンドを発行してプロセスを開始します。

```shell
rocketpool minipool rescue-dissolved
```

手動デポジットの基準を満たすminipoolのリストが表示されます。

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

救済したいminipoolを選択すると、手動でデポジットする金額を尋ねられます。

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

オプション1はほとんどの状況で使用されます。これは、beaconchain残高を必要な
32 ETHに引き上げるために必要な金額です。他のオプションは高度なユースケース向けに提供されています。

::: tip 注記
beaconchain残高を32 ETHにすることで、validatorはEthereumの
検証義務に積極的に参加できるようになります。smartnodeは解消後にvalidatorを再起動する機会がなかったかもしれません。したがって、
validatorキーをロードして検証義務を実行できるように、validatorを手動で再起動することをお勧めします。
これにより、救済プロセス中のペナルティを回避できます。

標準のDockerモードを実行している場合は、`docker restart rocketpool_validator`で実行できます。
:::

このステップが完了すると、validatorはエントリーキューに入り、次のイベントが
発生するのを待つ必要があります。

1. デポジットが受け入れられるまでに2048 execution layer blocksが経過する必要があります（約8時間）
2. validatorが投票するまでに最大32 epochsが経過する必要があります（0.5 - 3.5時間）
3. validatorキュー内の可変時間（キュー内の4 validatorごとに6.4分）
4. 終了が許可されるまでに最低256 epochs検証する必要があります（27時間）

### Validatorの終了

validatorが最低256 epochs間アクティブになったら、他のminipoolと同じプロセスで、
[Validatorの終了](./withdraw#exiting-your-validator)ガイドに従ってminipoolを終了できます。

全32 ETH残高がminipoolに返され、解消されたminipoolは残高の100%を
Node Operatorのwithdrawal addressに配分します。
