::: danger 警告
Saturn 1の準備のため、現在minipoolの入金は無効になっています。
:::

# Minipool Delegate

実行する各validatorには、その「所有者」として**minipool**コントラクトがあります。
minipoolは、そのvalidatorに特別に割り当てられた一意のコントラクトで、その**出金アドレス**として機能します。
Beacon Chainからのすべての報酬とステーキング残高の出金は、minipoolコントラクトに送信されます。

各minipoolは、ノードオペレーターであるあなたが最終的な制御権を持つことを保証するために一意です。
他の誰もそれを制御せず、他の誰もそれを変更できません。完全にあなたの指示に従います。

とはいえ、ノードデポジット時のガスコストを最小限に抑えるため、minipool自体には実際の機能がほとんど含まれていません。
できることのほぼすべてが**delegate**コントラクトに委任されています。

minipool delegateコントラクトは、minipoolに必要なロジックの大部分を含む特別なコントラクトです。たとえば、あなたとプールステーカーの間で残高を公平に分配することなどです。
各minipoolが一意のコントラクトであるのとは異なり、delegateは多くのminipoolが「転送」できる単一のコントラクトです。

時折、Rocket Pool開発チームは新機能を追加した新しいminipool delegateを公開します。
たとえば、Atlasアップデートでは、minipoolを閉じることなくスキミングされた報酬を分配するサポートを持つ新しいdelegateを導入しました。

Minipoolは、この新機能を利用するためにdelegateをアップグレードできます。
Delegateのアップグレードは**オプトイン**なので、使用するかどうか、いつ使用するかを決定できます。
とはいえ、ネットワークアップグレードが導入する新機能を利用するためには、通常これらが必要になります。

### Delegateのアップグレード

minipoolを新しいdelegateコントラクトにアップグレードするには、次のコマンドを実行するだけです。

```shell
rocketpool minipool delegate-upgrade
```

これにより、現在最新のdelegateを使用しておらず、アップグレード可能なminipoolのリストが表示されます。

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

minipoolアドレスの左側にある対応する番号を入力して、リストからアップグレードしたいものを選択します。
選択後、ガス価格設定の確認を求められ、その後minipoolをアップグレードするトランザクションが送信されます。

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

`rocketpool minipool status`で最新のdelegateを使用していることを確認できます。
最新のdelegateを使用していないminipoolには、アップグレード可能であることを知らせる黄色の通知がステータスの下に表示されます。

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
