::: danger 警告
Saturn 1の準備のため、現在minipoolのデポジットは無効になっています。
:::

# Solo ValidatorをMinipoolに変換する

Beacon Chainが最初にローンチされたとき、validatorは特別な暗号鍵のペア - **validator key**と**withdrawal key**で作成されました。

validator keyは「ホットキー」で、インターネットに接続されたアクティブなマシンに保存する必要があります。これはアテステーションと提案に署名するために使用されるキーであり、Beacon Chain上の「アドレス」（validatorを識別するための16進文字列）としても機能します。

一方、withdrawal keyは「コールドキー」で、インターネットに接続されたアクティブなマシンに保存*しない*（実際には*保存すべきではない*）ものです。
必要になるまでコールドストレージにロックして保管することを目的としています。
validator keyとは異なり、withdrawal keyは検証業務には一切関与しません。
代わりに、その唯一の役割は、Beacon Chain上のvalidatorの資金の引き出しを管理することです（引き出しが実装された後）。

この二重鍵システムは、Beacon Chainがローンチした当初のアーキテクチャでした。
当時、Mergeもwithdrawalsもまだ設計されていませんでしたが、このシステムは両方が実装されたときにプロトコルがどのような形をとっても対応できるほど堅牢であると考えられていました。

現在に至り、withdrawalsがどのように機能するかについてはるかに深い理解を得ています。
幸いなことに、古いwithdrawal key認証情報を使用しているBeacon Chain上の既存のソロステーキングvalidatorが、Beacon Chainからvalidatorを終了する必要なく、**Rocket Pool minipoolに直接変換**できるように実装されています！

このプロセスについて詳しく知りたい場合は、このガイドが役立ちます。
Ethereumでのwithdrawalsの動作をハイレベルで説明し、変換プロセスの仕組みを説明し、validatorをminipoolに変換する方法の詳細なウォークスルーで終わります。

## なぜ変換するのか？

技術的な詳細に入る前に、答えるべき非常に重要な質問は、そもそも*なぜ*ソロステーカーがこのプロセスを検討するのかということです。
minipoolへの変換はすべての人に適しているわけではありませんが、このセクションは、それがあなたが追求したいものかどうかについて情報に基づいた選択をするのに役立ちます。

Rocket Pool minipoolは、従来のソロステーキングvalidatorと比べていくつかの利点があります:

- プールステーカーから借りたETHの部分（24 ETH）に対して**コミッションを獲得**します。
- 既存の32 ETH bondを使用して、（すでに持っているものに加えて）**最大3つの追加validator**を作成できます。
- [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)への参加が可能で、すべてのExecution layer報酬（ブロック提案や[MEV報酬](./mev.mdx)からのものなど）をプールし、各報酬インターバル中に参加者間で公平に分配します。
- RPLをステーキングすると、ボーナスコミッションとRPLインフレーション報酬を獲得します（現在、ETHステーキング報酬よりも高いAPRを提供しています）。

とはいえ、強調すべき重要な違いがいくつかあります:

- **スマートコントラクトリスク**を受け入れる必要があります。プロトコルは一連のスマートコントラクトとして実装されているためです。
- 同様に、従来のノード運用は**Smartnodeスタック**を活用します。ノードにそのソフトウェアをインストールして実行することに関連するリスクを受け入れる必要があります。
- ノードオペレーターになることにはいくつかの新しい概念を学ぶことが含まれるため、**学習曲線**があります。
- Minipoolは報酬をプールステーカーと分割する必要があるため、validatorのwithdrawal addressは**あなたが制御するEOAではなく**、Execution layer上のスマートコントラクトになります。これは、Execution layer報酬の**fee recipient**にも適用され、報酬を公平に分割できるスマートコントラクトである必要があります。
- Rocket Poolの**Oracle DAO**は、Beacon ChainからExecution layerへの情報のシャトルと、プロトコルが強制できない違反（不正なfee recipientアドレスなど）の検出を担当しています。minipoolを実行するということは、Oracle DAOがその仕事を正しく行うことを信頼する必要があることを意味します。

ソロvalidatorを変換することを決定する前に、これらの長所と短所を慎重に検討することをお勧めします。
プロセスを続けたい場合は、次のセクションをお読みください。

## 前提条件

変換プロセスを開始するには、次の基準を満たす必要があります:

1. 新しいminipoolをホストするために[Rocket Poolネットワークに登録されたノード](./prepare-node.mdx)が必要です。
1. 移行したいvalidatorはBeacon chain上で**アクティブ**である必要があります。pending、slashed、exiting / exited、またはwithdrawであってはなりません。
1. validatorはBeacon chain上で**少なくとも32 ETH**の残高が必要です。
1. validatorは[BLS key withdrawal credentials](https://launchpad.ethereum.org/en/withdrawals)（`0x00`認証情報）を持っている必要があります。すでに他のExecution layer withdrawal credentials（`0x01`認証情報）に移行されているvalidatorでは変換**できません**。
1. （オプション）Smartnodeにwithdrawal credentialsを自動的に移行させたい場合は、**mnemonic phraseを手元に用意する**必要があります。

これらの条件のいずれもブロッカーでない場合は、validator変換を開始する資格があります。

## プロセス概要

最初のステップは、**新しい「vacant」minipoolを作成する**ことです。
作成時に新しいvalidatorを作成する従来のminipoolとは異なり、vacant minipoolは\_既存の\_validatorを管理するために設計された特別なminipoolです。
その結果、vacant minipoolは`prelaunch`ステージ中に従来のminipoolとは若干異なる動作をします。
初期化が完了して`staking`ステージに入ると、従来のminipoolになります。

vacant minipool作成中に、Smartnodeが自動的に**validatorのwithdrawal credentialsを変更する**オプションが与えられます。古いBLS withdrawal keyから新しいvacant minipoolアドレスへ変更します。
今すぐこれをしたくない場合は、専用のコマンドでSmartnodeに後で実行させるか、サードパーティのツールで自分で実行できます。
validatorのwithdrawal credentialsをminipoolアドレスに変更することは変換に**必要**であるため、どのように行うにしても、プロセスを正常に完了するためにこれを行う必要があります。

withdrawal credentialsが変更されたら、**validatorの秘密鍵をインポート**するオプションがあります。Smartnodeが管理するValidator Clientにインポートします。
Smartnodeにvalidatorを維持させて、自分で管理する必要がない場合、これは魅力的なオプションです。
自分のValidator Clientを維持してそこにキーを保持したい場合は、そうすることを歓迎します。

この時点で、新しいminipoolは**scrub check**期間に入ります。Oracle DAOは、validatorのBeacon Chain上の情報を継続的に分析して、それが合法であることを確認します。
これには以下が含まれます:

- withdrawal credentialsがまだ移行されていない（まだ元の`0x00` BLS key認証情報である）か、minipoolのアドレスに移行されている。他のExecution layerアドレスに移行すると、プールがscrubされます。
  - scrub check期間が終了するまでにwithdrawal credentialsがまだ元の`0x00` BLS key認証情報である場合、プールはscrubされます。
- validatorがチェック期間中ずっとアクティブステーキング状態にある。slashed、exited、またはwithdrawステートに移行すると、プールはscrubされます。

::: tip 注意
**scrubされた**vacant minipoolは、Rocket Poolネットワークの一部ではなくなりますが、CLIの典型的なトークン取得メソッドを介してすべての資金にアクセスできます。
vacant minipoolがscrubされても、資金は**失われません**。
scrubされたminipool、その影響、および使用方法に関する詳細は、このガイドの後半に含まれています。
:::

scrub checkが合格した後、vacant minipoolを**プロモート**できます。
これにより変換が完了し、vacant minipoolから通常のminipoolに変更されます。
この時点で、minipoolはネットワーク上の他のすべてのminipoolと同様に動作し、ソロvalidatorは正式にRocket Pool validatorに変換されます！

プロセスの一部として、ネットワークはBeacon chain上の総報酬（およびscrub check中にskimされた場合は新しいminipool内）のスナップショットを取得します。
それらの報酬がすべてあなたに属し、ステーキングプールと共有すべきではないことを認識するため、プロモーション完了後にいつでも請求できる**refund**として提供します。

以下は、各ステップの手順を含む変換プロセスの詳細なウォークスルーです。

## ステップ1: Vacant Minipoolの作成

変換プロセスを開始するには、Smartnode CLIで次のコマンドを実行します:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

例えば、pubkey `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`のソロvalidatorを変換したい場合は、次を実行します:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

プロセス中に何を期待するかについての簡単な要約が表示され、次にこのminipoolを作成する際に使用したいbond金額のプロンプトが表示されます:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

**8 ETH**を選択すると、validatorを8-ETH bondedのminipoolに変換します。
元の32 ETHデポジットは8 ETHデポジットに変換され、24 ETHがプールステーカーから借りられます。
変換プロセスが完了すると、24 ETHの[credit balance](./credit)が得られ、これを使用してさらにminipoolを作成できます。

オプションを選択すると、Smartnodeはいくつかのチェックを実行して、入力したvalidatorとノードの両方が上記のすべての前提条件に合格していることを確認します。
その後、ガス価格を確認してから、新しいvacant minipoolを作成するトランザクションを送信するよう求められます。
作成時に、minipoolのアドレスが表示されます:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

これは、validatorのwithdrawal credentialsを変更する際に使用するアドレスです。

この時点で、Smartnodeは自動的にこれを実行するかどうかを尋ねます（後で説明するSmartnodeが管理するValidator Clientにvalidatorの秘密鍵をインポートすることとともに）:

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

この質問に`y`と答えると、Smartnodeは自動的にステップ2と3を実行します。以下の[Automatic Withdrawal Credential Change and Key Import](#automatic-withdrawal-credential-change-and-key-import)セクションを参照してください。

この質問に`n`と答えると、コマンドは終了し、ステップ1が完了します。
次に[ステップ2](#step-2-changing-the-validators-withdrawal-credentials)セクションに進んでください。

::: tip 注意
今すぐこのプロセスを辞退した場合でも、CLIを使用して後で再開できます。
これを行う方法については、以下の[**ステップ2**](#step-2-changing-the-validators-withdrawal-credentials)および[**ステップ3**](#optional-step-3-import-the-validator-key)セクションをお読みください。
:::

### Automatic Withdrawal Credential Change and Key Import

::: danger 警告
Smartnodeに自動的にwithdrawal credentialsを変更してvalidatorの秘密鍵をインポートさせることを選択した場合、古い自分で管理するValidator Clientからvalidator keyを削除し、**古いValidator Clientをシャットダウン**して、まだメモリにキーがロードされていないことを確認することが**不可欠**です。

また、これを行った後**少なくとも15分**待って、**意図的に少なくとも2つのアテステーションを逃した**ことを確認する必要があります。
これは、[https://beaconcha.in](https://beaconcha.in)などのチェーンエクスプローラーを見て確認できます。

少なくとも15分待たない場合、SmartnodeのValidator Clientがvalidatorのキーでアテステーションを開始すると、validatorは**スラッシュされます**！

また、スラッシングのリスクに対して可能な限り安全であるために、Smartnode設定で**doppelganger detection**を有効にすることを強くお勧めします。
:::

validator keyを自動的にインポートし、withdrawal credentialsをminipoolアドレスに変更することを選択した場合、Smartnodeはまず、validatorのBLS秘密鍵とそれに対応する元のwithdrawal keyの両方を生成するために使用されたmnemonicを要求します:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

入力すると、Smartnodeはmnemonicとvalidatorのpubkeyを使用して古いBLSベースのwithdrawal keyを導出します。
次に、withdrawal credentialsを古いBLS withdrawal keyから新しいminipoolアドレスに変更したいことを示す、withdrawal keyによって署名されたメッセージをBeacon Chainに送信します:

```
Changing withdrawal credentials to the minipool address... done!
```

最後に、validatorのキーをSmartnodeのValidator Clientにインポートし、そのキーで検証を開始するためにValidator Clientを再起動するかどうかを尋ねます:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

これでステップ2と3が完了しました。
withdrawal credentialsが適切に変更され、キーがアクティブに検証されていることを、[https://beaconcha.in](https://beaconcha.in)などのチェーンエクスプローラーを使用して確認できます

[ステップ4](#step-4-assign-the-correct-fee-recipient)セクションに進んで、scrub checkについて学習してください。

## ステップ2: ValidatorのWithdrawal Credentialsの変更

新しいvacant minipoolを作成したら、次のステップは、validatorのwithdrawal credentialsを古い`0x00` BLS-key認証情報から新しいminipoolアドレスを含む新しい`0x01`認証情報に変更することです。

これを行うには2つの方法があります:

1. Smartnode CLIを使用して、`rocketpool minipool set-withdrawal-creds`コマンド経由。
1. [ethdo](https://github.com/wealdtech/ethdo)などの外部サードパーティツールを使用。

このガイドでは、方法1（Smartnode）の使用方法を説明します。
方法2の詳細については、使用したいツールのドキュメントを参照してください。

まず、次のコマンドを実行します:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

例えば、新しいvacant minipoolアドレスが`0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`の場合、次を実行します:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Smartnodeは、validatorのキーとそれに対応するwithdrawal keyの両方を生成するために使用されたmnemonicを要求します:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

この後、validatorのwithdrawal credentialsを変更できることを確認するためのいくつかの安全チェックを実行します。
成功すると、withdrawal credentialsを古いBLS withdrawal keyから新しいminipoolアドレスに変更したいことを示す、withdrawal keyによって署名されたメッセージをBeacon Chainに送信します:

```
Changing withdrawal credentials to the minipool address... done!
```

これで完了です！
withdrawal credentialsが適切に変更されたことを、[https://beaconcha.in](https://beaconcha.in)などのチェーンエクスプローラーを使用して確認できます。

## （オプション）ステップ3: Validator Keyのインポート

validatorをminipoolに変換したら、自分で管理しているものの代わりに、SmartnodeのValidator Clientで実行したい場合があります。
これにはいくつかの利点があります:

- 組織的な観点から「きれいです」（Smartnodeはminipoolsを管理し、外部管理のValidator Clientはソロステーキングvalidatorを管理します）。
- `rocketpool minipool exit`のようなコマンド（メッセージに署名するためにvalidator keyを必要とするコマンド）が機能するようになります。

ただし、これを行う前に理解すべき**非常に重要な考慮事項**がいくつかあります:

- 自分のValidator Clientからvalidatorのキーが削除されていることを**確認する**必要があり、Smartnodeにインポートする前に削除後少なくとも15分待つ必要があります。以下の警告ボックスを参照してください。
- validator keystoreとそのパスワードファイルをバックアップしていることを**確認する**必要があります。`rocketpool wallet recover`や`rocketpool wallet rebuild`のようなコマンドは、Smartnodeウォレットのmnemonicから導出されていないため、バックアップなしでは再生成**できません**。

validator keyをSmartnodeにインポートしたい場合は、以下を続けてお読みください。

::: danger 警告
Smartnodeにvalidatorの秘密鍵をインポートさせることを選択した場合、自分で管理する古いValidator Clientからvalidator keyを削除し、**古いValidator Clientをシャットダウン**して、まだメモリにキーがロードされていないことを確認することが**不可欠**です。

また、これを行った後**少なくとも15分**待って、**意図的に少なくとも2つのアテステーションを逃した**ことを確認する必要があります。
これは、[https://beaconcha.in](https://beaconcha.in)などのチェーンエクスプローラーを見て確認できます。

少なくとも15分待たない場合、SmartnodeのValidator Clientがvalidatorのキーでアテステーションを開始すると、validatorは**スラッシュされます**！

また、スラッシングのリスクに対して可能な限り安全であるために、Smartnode設定で**doppelganger detection**を有効にすることを強くお勧めします。
:::

まず、次のコマンドを実行します:

```
rocketpool minipool import-key <minipool address>
```

例えば、新しいvacant minipoolアドレスが`0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`の場合、次を実行します:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Smartnodeは、validatorのキーを生成するために使用されたmnemonicを要求します:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

この後、そのmnemonicから生成されたさまざまなキーをサイクルして、validatorの公開鍵を見つけます。
次にそれをインポートし、SmartnodeのValidator Clientを再起動してキーをロードするかどうかを尋ねます:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

これで、validator keyがSmartnodeにインポートされ、アテステーションを開始するはずです。
次のコマンドでValidator Clientのログをフォローして確認できます:

```
rocketpool service logs validator
```

また、[https://beaconcha.in](https://beaconcha.in)などのチェーンエクスプローラーで、Validator ClientがvalidatorのキーでアテステーションしていることをVCが確認できることも確認できます。

## ステップ4: 正しいFee Recipientの割り当て

移行プロセスを開始したら、[fee recipient](./fee-distrib-sp#fee-recipients)が適切に設定されていることを確認することが**不可欠**です（ノードの[fee distributor](./fee-distrib-sp#your-fee-distributor)または[Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)にオプトインしている場合はSmoothing Poolのいずれか）。
これを行わず、ソロvalidatorのfee recipientのままにしておくと、ペナルティが科され、損失を補償するためにBeacon Chainステークの一部が差し引かれます。

::: tip 注意
**このステップは、自分の外部管理のValidator Clientにvalidator keyを残す場合にのみ必要です。**

自分のVCからキーを削除し、Rocket Poolが管理するVCにインポートすると、fee recipientは`node`プロセスによって自動的に正しいアドレスに割り当てられます。
:::

VCに他のソロステーキングキーを保持していて、fee distributorやSmoothing Poolに設定*したくない*場合、これを達成する唯一の方法は、VC設定ファイルを使用して、移行されるvalidatorのfee recipientを手動で設定することです。

このプロセスは、使用しているConsensus Clientによって異なります。詳細についてはドキュメントを参照してください。以下にいくつかの役立つリンクがあります:

[Lighthouse: via `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar**は現在、validator固有のfee recipientの設定をサポートしていません。移行されていない他のソロキーで外部管理のVCにキーを保持している場合は、Lodestarを使用しないでください。

[Nimbus: via the keymanager API](https://nimbus.guide/keymanager-api.html)

[Prysm: via `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: via `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

eth-dockerを使用している場合は、ドキュメントに記載されているように[`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient)コマンドを使用して、使用している各キーに個別のrecipientを設定できます。

## ステップ5: Scrub Checkの待機

この時点で、ステップ1と2（vacant minipoolの作成とvalidatorのwithdrawal credentialsの変更）、およびオプションでステップ3（Smartnodeへのキーのインポート）を完了しているはずです。
次のステップは、**scrub check**が完了するのを待つことです。
これは、Oracle DAOによって実行されるプロセスで、次のことを確認します:

1. Beacon Chain上のvalidatorの残高（およびExecution layer上のminipoolの残高）は、最初にvacant minipoolを作成したときのvalidatorの残高**以上**である必要があります。メンテナンス中の偶発的なアテステーションミスを考慮して0.01 ETHの小さなバッファを差し引いたものです。

- 例えば、ステップ1を実行したときにvalidatorのBeacon Chain残高が35 ETHだった場合、scrub check全体を通じてBeacon ChainとMinipoolの残高を合わせて**少なくとも**34.99 ETHである必要があります。

2. validatorは、scrub check全体を通じて**アクティブステーキング**ステータスのままである必要があります - スラッシュ、終了、または引き出しすることはできません。
3. validatorのwithdrawal credentialsは、**元のBLSベースのwithdrawal key認証情報**、または**minipoolのアドレスを使用した新しい0x01認証情報**のいずれかである必要があります。他の認証情報はminipoolをscrubします。

- withdrawal credentialsの変更を実行するために**約2日半**の猶予期間が与えられます（scrub期間の3日間の85%）。

scrub checkは一時的なものです。この間、validatorをオンラインに保ち、良好なパフォーマンスを維持する以外に何もする必要はありません。

scrub checkの残り時間を監視するには、次のコマンドで`node`ログを確認できます:

```
rocketpool service logs node
```

関連する行は次のようになります:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

これは**3日間**続き、その後合格してvacant minipoolを完全なものにプロモートするために[ステップ6](#step-6-promoting-the-minipool)に進むことができます。

### Scrubbed Minipoolsの操作

残念ながらminipoolがscrub checkに失敗して解散した場合でも、心配する必要はありません - 資金は失われていません。
解散したvacant minipoolは基本的に簡素化されたwithdrawal addressとして機能します:

- 技術的にはRocket Poolネットワークの一部ではありません。
- minipoolに預けられた資金は*ノードオペレーターのみ*に属します。プールステーカーと分割*されません*。
- minipoolを作成してもdeposit creditは付与されません。

次のコマンドでいつでもminipoolの残高にアクセスできます:

```shell
rocketpool minipool distribute-balance
```

これにより、minipoolの全残高がノードのwithdrawal addressに送信されます。

Beacon ChainからValidatorを終了し、全残高がminipoolに送信されたら、次のコマンドで取得してminipoolを閉じることができます:

```shell
rocketpool minipool close
```

繰り返しますが、これによりminipoolの全残高がノードのwithdrawal addressに送信されます。

## ステップ6: Minipoolのプロモート

scrub checkが正常に合格したら、vacant minipoolを完全なminipoolにプロモートできます。
これは2つの方法で実行できます:

1. scrub checkが終了したらすぐに`node`プロセスが自動的に処理します。
1. CLIを使用して手動で実行します。

最初の方法は、`node`プロセス/コンテナが実行されており、ネットワークのガスコストがSmartnode設定プロセスで指定した自動トランザクション閾値（デフォルト150）を下回っている場合、自動的にminipoolをプロモートします。
`node`ログには、次のような出力が表示されます:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

`node`プロセスが無効になっている場合は、次のコマンドを使用して2番目の方法を使用できます:

```shell
rocketpool minipool promote
```

ここから、プロモーション対象のminipoolのリストから空のminipoolを選択し、トランザクションを送信するだけです。

## 元の変換前報酬の請求

プロモーション時に、minipoolは`staking`ステータスに入り、正式に通常のRocket Pool minipoolになりました。
次のコマンドで詳細を確認できます:

```shell
rocketpool minipool status
```

これにより、新しいminipoolのステータス、残高、refundなどが表示されます。
例えば:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

ここでは次の重要な情報を確認できます:

- `Node deposit`は、このminipoolの一部として個人的にbondしたETHの量を示しています（この場合、8 ETH）。
- `RP deposit`は、minipoolを作成するためにプールステーカーから借りたETHの量を示しています（この場合、24 ETH）。
- `Available refund`は、minipoolの残高のうち、直接あなたに属する部分（プールステーカーと共有*されない*）を示しています。これは、vacant minipoolを作成した時点でのBeacon Chain上のすべての報酬に相当します。
- `Minipool Balance (EL)`は、minipoolコントラクトの総残高を示しています。
- `Your portion (EL)`は、minipoolの残高からrefundを差し引いた後にあなたに属する残高を示しています。言い換えれば、これはvacant minipoolを作成*した後*に獲得した報酬のあなたのシェアです。
- `Total EL rewards`は、refundと変換後の報酬を合わせたものです。

refundを請求するには、次のコマンドを実行します:

```shell
rocketpool minipool refund
```

リストからminipoolを選択し、トランザクションを承認すると、refundがノードのwithdrawal addressに送信されます。

## Node Creditの使用

アクティブなプロモートされたminipoolができたので、`rocketpool node status`を実行すると、ノードにcredit残高があることがわかります:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

この例では、元の32 ETH validator bondを8-ETH minipoolに変換したため、[**24 ETHのcredit**](./credit)を受け取りました。
このcreditは、新しいminipoolとvalidatorを無料で作成するために使用できます！

`rocketpool node deposit`コマンドを実行し、使用したいbond金額を選択するだけです。
credit残高にbondをカバーするのに十分なETHがある場合、自動的に使用され、追加のETHをステーキングする必要はありません（ただし、ガスの支払いは必要です）。

::: warning 注意
credit残高に使用されるETHは、ステーキングプールから来ています。
ステーキングプールにcredit残高をカバーするのに十分なETHがない場合、さらにETHが預けられるまで使用できません。
:::
