# Node Operatorの責任

## Ethereumステーキングの仕組み

念のため、Proof of Stakeでのステーキングは**validator**を介して行われます。
validatorは本質的に、Execution layerで32 ETHが預けられた単一のBeacon Chainアドレスです。
validatorは、Beacon Chainの一貫性とセキュリティを維持する責任があります。
これは、トランザクションや新しいブロック提案をリッスンし、提案されたブロックに合法的で有効なトランザクションが含まれていることを、裏で数値計算と検証を行うことで**attestation**することによって行われます。
時には、自分で新しいブロックを提案することもあります。

validatorには、**ランダムなスケジュール**でattestationとブロック提案が割り当てられます。
これは、すべての人が常に互いに競争して他の全員よりも先に次のブロックを見つけようとしていた古いProof of Workシステムとは大きく異なります。
つまり、マイナーが次のブロックを見つけない限りブロック報酬を得ることが保証されていなかったProof of Workとは異なり、Proof of Stakeのvalidatorは、職務を果たしている限り、ゆっくりと安定した収入を得ることが*保証されています*。
validatorがオフラインになってattestationやブロック提案を逃すと、**わずかにペナルティを受けます**。
ただし、ペナルティは非常に小さいです。経験則として、validatorがX時間オフラインの場合、オンラインに戻ってattestationを行った後、同じX時間で失ったETHをすべて取り戻します。

### 報酬

validatorは、Attestation、Block Proposals、Sync Committees(まれ)、Slashing Rewards(非常にまれ)からコンセンサスレイヤー報酬を獲得します。また、Priority FeesとMEVから実行レイヤー報酬も獲得します。

2026年5月時点では、全体のAPRは約2.634%で、コンセンサスレイヤーAPRが2.8%、実行レイヤーAPRが0.22%です。この情報を見つける場所の1つは、[rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake)です。

### ペナルティ

validatorがオフラインになり、割り当てられた職務を実行できない場合、少額のETHのペナルティを受けます。
これは**leaking**と呼ばれます。
validatorがBeacon chainの中核ルールの1つに違反し、ネットワークを攻撃しているように見える場合、**slashing**される可能性があります。
Slashingは、許可なくvalidatorが強制的に終了され、validatorのETH残高の一部が削除される比較的大きな罰金が伴います。

現実的には、slashingを引き起こす可能性がある唯一の条件は、validatorのキーを2つのノードで同時に実行する場合です(バックアップノードがメインノードがまだ実行中に誤ってオンになるフェイルオーバー/冗長性設定など)。
これが起こらないようにすれば、**slashingされることはありません**。
メンテナンスのためにオフラインになることからslashingが発生することは*ありません*。

以下は、validatorに発生する可能性のあるペナルティを示す表です。

| タイプ                | レイヤー  | 量                                                                                |
| --------------------- | --------- | --------------------------------------------------------------------------------- |
| Missed Attestation    | Consensus | -0.000011 ETH\* per attestation (-9/10 the value of a normal attestation reward)  |
| Missed Proposal       | Consensus | 0                                                                                 |
| Missed Sync Committee | Consensus | -0.00047 ETH\* per epoch (-0.1 ETH total if offline for the whole sync committee) |
| Slashing              | Consensus | At least 1/32 of your balance, up to your entire balance in extreme circumstances |

\*_ネットワーク内のvalidatorの総数に基づいて変動します。
435,000のアクティブなvalidatorに対する概算値です。_

::: tip ヒント
経験則として、X時間オフラインになった場合(sync committeeに参加していない場合)、オンラインに戻ってattestationを行った後、X時間後にリークしたETHをすべて取り戻すことができます。
:::

## Rocket Pool Nodeの仕組み

新しいvalidatorを作成するために32 ETHを預ける必要があるsolo stakerとは異なり、Rocket Pool nodeはvalidatorごとに4 ETH（「bonded ETH」と呼ばれます）を預けるだけで済みます。
これは、staking poolからの28 ETH（「borrowed ETH」と呼ばれ、liquid stakerがrETHと引き換えに預けた資金に由来します）と組み合わされて、新しいMegapoolバリデーターを作成します。

Beacon chainにとって、Megapoolバリデーターは通常のvalidatorとまったく同じように見えます。
同じ責任、従わなければならない同じルール、同じ報酬などがあります。
唯一の違いは、Megapoolバリデーターがexecution layer上でどのように作成されたか、そしてnode operatorが自発的にMegapoolバリデーターを終了するときにwithdrawalがどのように機能するかです。
作成、出金、報酬委任のすべては、EthereumチェーンのRocket Poolの**smart contracts**によって処理されます。
これにより、完全に分散化されます。

Rocket Pool **Node**は、Rocket Poolのスマートコントラクトに登録されたEthereumウォレットを持つ単一のコンピューターです。
nodeは、同じマシン上で一緒に実行できる限り、多くのMegapoolバリデーターを作成できます。
**単一のRocket Pool nodeは、多数のMegapoolバリデーターを実行できます。**
各Megapoolバリデーターは、全体的なシステムパフォーマンスにほとんど影響を与えません。単一のノードで数百を実行できた人もいます。

Megapoolバリデーターの初期コストは4 ETHです。さらに、Node Operatorは、追加報酬の資格を得るため、およびプロトコルDAO内で投票権を獲得するために、任意でnodeにRPLをステーキングできます。

## Rocket Pool Node Operators

**Node operators**は、Rocket Poolの心と魂です。
彼らは、Rocket Pool nodeを実行する個人です。

### 責任

彼らは、ステーキングプールからのETHをMegapoolバリデーターで運用し、Rocket Poolプロトコルのステーキング報酬を獲得します(したがって、rETHの価値を高めます)。
彼らの仕事は簡単ですが、非常に重要です。_可能な限り最高品質でvalidatorを実行し、ステーキング報酬を最大化すること_。

Node operatorは以下の責任があります。

- コンピューター(物理または仮想)のセットアップ
- ホームネットワークを含めて正しく設定すること(該当する場合)
- Rocket Poolをインストールし、検証を実行するためのvalidatorをセットアップすること
- 外部と内部の脅威から保護すること
- validatorの寿命の間、メンテナンスを行うこと

これは大きな責任であり、単純に設定して忘れるような仕事ではありません。ステーキングしている限り、nodeの世話をする必要があります。
しかし、大きな責任には大きな報酬が伴います。

### 報酬

Rocket Pool nodeを実行する主なメリットは次のとおりです。

- 各validatorのETH報酬のあなたの部分と手数料を獲得します。
  - 自己資金はわずか4 ETHでvalidatorを運用でき、残りの28 ETHはliquid stakerから調達されます。
  - 各Megapoolバリデーターは、28 ETHのプロトコル資金から生じた報酬に対して5%の手数料を獲得します。これはsolo stakingより35%多い計算になります(`(4 bonded + 28 borrowed * 0.05) / 4 = 1.35`)。
  - [Smoothing Pool](fee-distrib-sp#smoothing-pool)に参加すると、execution layerの報酬(priority feeとMEV)を他の参加者と分け合うことになり、ブロック提案の運に頼るのではなく、より安定したリターンが得られます。
- RPLをステーキングすると、追加の報酬が得られます。
  - RPLステーカーは、ステーキングしたRPLに比例して[プロトコル手数料の分配分](megapools/staking-and-claiming-rewards#voter-shareがmegapool-rplステーカーにどのように分配されるか)(ETHで支払われます)を獲得します。
  - また、ステーキングしたRPLに対して発行報酬(RPLで支払われます)も獲得できます。
    - 期間の終わり(28日ごと)に、あなたのRPLのスナップショットが取得されます。
    - 借入ETH総額の**15%まで**のRPLに対して最大利回りを獲得できます。
    - 15%を超える分についても利回りは得られますが、逓減します。
  - ステーキングしたRPLの平方根に基づいて、bonded ETHの150%を上限とする投票権が得られます。

### 制限事項

上記の報酬には、いくつかの制限事項があります。

- nodeのパフォーマンスが悪く、Megapoolバリデーターを終了することを決定するまでに実際にETHを失った場合、失われたETHはすべてあなたのシェアから出ます。
  - 例:31 ETHの残高で終了した場合、Megapoolバリデーターは当初の32 ETHのデポジットから1 ETHを失ったことになります。あなたは3 ETHを受け取り、28 ETHがステーキングプールに返還されます。
- ステーキングされたRPLは流動性が低くなります:
  - MegapoolでステーキングしたRPLのアンステーク量に上限はありませんが、アンステークを開始してから引き出しまでに28日待つ必要があります。これにより、28日間の報酬期間に間に合うようにRPLをステーキングし、期間終了直後に引き出すことで報酬システムを悪用することを防ぎます。

### あなたならできます

コマンドラインやコンピューターのメンテナンスを使用するのが初めての場合、これは怖い挑戦のように思えるかもしれません。
幸いなことに、Rocket Poolの最も中核的な原則の1つは*分散化*です。つまり、決意と知識があれば、誰でも、どこでもnodeを実行できるという事実です。
決意については手助けできませんが、知識については手助けできます。
このセクションには、素晴らしいRocket Pool nodeを実行する方法を理解するのに役立つガイド、ウォークスルー、情報が満載です。
