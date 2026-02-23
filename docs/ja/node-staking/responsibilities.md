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

2024年10月時点では、全体のAPRは約3.5%で、コンセンサスレイヤーAPRが2.8%、実行レイヤーAPRが0.7%です。この情報を見つける場所の1つは、[rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake)です。

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

新しいvalidatorを作成するために32 ETHを預ける必要があるソロステーカーとは異なり、Rocket Pool nodeはvalidatorごとに8 ETHのみを預ける必要があります(「bond ETH」と呼ばれます)。
これは、ステーキングプールからの24 ETH(「borrowed ETH」と呼ばれ、rETHと引き換えにliquid stakerの預金から得られます)と組み合わせて、新しいvalidatorを作成します。
この新しいvalidatorは**minipool**に属します。

Beacon chainにとって、minipoolは通常のvalidatorとまったく同じに見えます。
同じ責任、従わなければならない同じルール、同じ報酬などがあります。
唯一の違いは、minipoolが実行レイヤーでどのように作成されたか、およびNode Operatorが自発的にminipoolを終了することを決定したときに出金がどのように機能するかです。
作成、出金、報酬委任のすべては、EthereumチェーンのRocket Poolの**smart contracts**によって処理されます。
これにより、完全に分散化されます。

Rocket Pool **Node**は、Rocket Poolのスマートコントラクトに登録されたEthereumウォレットを持つ単一のコンピューターです。
nodeは、同じマシン上で一緒に実行できる限り、多くのminipoolを作成できます。
**単一のRocket Pool nodeは、多数のminipoolを実行できます。**
各minipoolは、全体的なシステムパフォーマンスにほとんど影響を与えません。単一のノードで数百のminipoolを実行できた人もいます。

minipoolの初期コストは8 ETHです。さらに、Node Operatorは、追加報酬の資格を得るため、およびプロトコルDAO内で投票権を獲得するために、nodeにRPLをステーキングできます。

## Rocket Pool Node Operators

**Node operators**は、Rocket Poolの心と魂です。
彼らは、Rocket Pool nodeを実行する個人です。

### 責任

彼らは、ステーキングプールからのETHをminipoolで実行することで活用し、Rocket Poolプロトコルのステーキング報酬を獲得します(したがって、rETHの価値を高めます)。
彼らの仕事は簡単ですが、非常に重要です。_可能な限り最高品質でvalidatorを実行し、ステーキング報酬を最大化すること_。

Node operatorは以下の責任があります。

- コンピューター(物理または仮想)のセットアップ
- ホームネットワークを含めて正しく設定すること(該当する場合)
- Rocket Poolをインストールし、検証を実行するためのminipoolをセットアップすること
- 外部と内部の脅威から保護すること
- validatorの寿命の間、メンテナンスを行うこと

これは大きな責任であり、単純に設定して忘れるような仕事ではありません。ステーキングしている限り、nodeの世話をする必要があります。
しかし、大きな責任には大きな報酬が伴います。

### 報酬

Rocket Pool nodeを実行する主なメリットは次のとおりです。

- 各validatorのETH報酬のあなたの部分と手数料を獲得します。
  - ステーキングされたRPLがない8 ETH-bonded minipoolの場合、これはソロステーキングよりも30%多くなります(`(8+24*.1)/8 = 1.3`)
  - RPLをステーキングすると、手数料がブーストされます。総borrowed ETHの10%以上の価値があるRPLステークの場合、ETH報酬はソロステーキングよりも42%多くなります(`(8+24*.14)/8 = 1.42`)
  - **注意:** smoothing poolに参加しない場合、代わりにソロステーキングよりも15%多く受け取ります(`(8+24*.05)/8 = 1.15`) -- 2024-10-28以降に作成されたminipoolを持つユーザーは、smoothing poolにオプトインすることを強くお勧めします。
- ステーキングしたRPLの発行報酬も獲得します。
  - 期間の終わり(28日ごと)に、RPLのスナップショットがあります。
  - 総borrowed ETHの価値の**最大15%まで**のRPLで最大利回りを獲得できます。
    - それを超えるRPLで利回りを獲得しますが、減少レベルで。
  - ステーキングされたRPLの平方根に基づいて投票権を獲得します。

### 制限事項

上記の報酬には、いくつかの制限事項があります。

- nodeのパフォーマンスが悪く、minipoolを終了することを決定するまでに実際にETHを失った場合、失われたETHはすべてあなたのシェアから出ます。
  - 例:30 ETHの残高で終了した場合、minipoolは最初の32 ETHの預金から2 ETHを失いました。あなたは6 ETHを受け取り、24 ETHがステーキングプールに返されます。
- ステーキングされたRPLは流動性が低くなります
  - bonded ETHの60%の価値を超えるRPLステークのみを引き出すことができます。
  - 過去28日間にステーキングした場合、RPLを引き出すことはできません

### あなたならできます

コマンドラインやコンピューターのメンテナンスを使用するのが初めての場合、これは怖い挑戦のように思えるかもしれません。
幸いなことに、Rocket Poolの最も中核的な原則の1つは*分散化*です。つまり、決意と知識があれば、誰でも、どこでもnodeを実行できるという事実です。
決意については手助けできませんが、知識については手助けできます。
このセクションには、素晴らしいRocket Pool nodeを実行する方法を理解するのに役立つガイド、ウォークスルー、情報が満載です。
