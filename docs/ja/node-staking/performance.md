# ノードのパフォーマンスの監視

ノードが稼働し、1つ以上のminipoolが接続されたら、すべてがスムーズに実行されていることを確認するために監視する必要があります。

マシンを追跡する方法は次の2つです:

1. マシンのメトリクスに直接アクセスして追跡する
2. サードパーティツールを使用して間接的に追跡する

ニーズに応じて両方を組み合わせて使用することをお勧めします。

## マシンのステータスを直接追跡する

マシンのステータスに関して、監視したいと思われる便利なメトリクスがいくつかあります:

- CPU使用率
- 残りの空きRAM
- スワップスペース使用量(有効にしている場合)
- 残りの空きディスク容量
- ネットワークI/O(ISPがデータキャップを課している場合)

::: tip 注意
以下のセクションでは、いくつかの監視方法を示していますが、マシンのターミナルにログインする必要があります。
[Grafana webダッシュボード](./grafana.mdx)を使用する、より良く、はるかに便利で、はるかに見栄えの良い方法がありますが、まだ開発中です。
そのセクションの完成をお楽しみに!
:::

### CPU、RAM、およびスワップ

最初の3つは、`htop`プログラムで簡単に表示できます。
これにより、システムリソースへのナイスなライブビューが提供されます。Raspberry Piからのこのスクリーンショットに示されています:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

バーのある上部ディスプレイでは、番号付きのバーはそれぞれCPUコアの現在の使用状況を示します。

`Mem`は、現在使用しているRAMの量(このスクリーンショットでは1.75 GB)と、合計で持っている量(3.70 GB)を示します。

`Swp`は、使用しているスワップスペースの量(85.8 MB)と、合計で持っている量(12.0 GB)を示します。

下部のテーブルでは、各行がプロセスを表します。
ExecutionクライアントとConsensusクライアントは、おそらく上部にあります(この場合、GethとNimbus)。これは、`Command`というラベルの付いた右端の列で確認できます。

`RES`列は、各プロセスが使用しているRAMの量を示します。このスクリーンショットでは、Gethが748 MBを、Nimbusが383 MBを使用しています。

`CPU%`列は、各プロセスが消費しているCPUパワーの量を示します。
100%は単一のコアを表すため、100%を超える場合は、複数のコアから多くを使用していることを意味します(ここではGethのように213%)。

### 残りの空きディスク容量

使用可能な空きディスク容量を監視することは、次のコマンドで簡単に行えます:

```
df -h
```

これにより、次の例のような出力が提供されます:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

オペレーティングシステムとExecutionおよびConsensusチェーンデータの両方を保存する1つのドライブがある従来のセットアップの場合、`Mounted on`列に`/`があるエントリを確認するだけです。
これはメインディスクを表します。
もしスペースが不足しているように見える場合(たとえば、80%使用されているなど)、クリーンアップを開始する必要があります。
例えば、Gethを実行している場合は、スペースをクリアするために[剪定方法](./pruning)を確認することをお勧めします。

ExecutionおよびConsensusチェーンデータを別のドライブに保存するセットアップの場合は、`Mounted on`列にチェーンデータフォルダーがある行も確認する必要があります。
この例では、外部SSDを`/mnt/rpdata`にマウントしたので、それが大きくなりすぎないように監視する必要があります。

### ネットワークI/Oとデータ使用量

システムが時間の経過とともに使用するネットワークI/Oを追跡したい場合は、`vnstat`と呼ばれる便利なユーティリティをインストールできます。
Ubuntu / Debianシステムにインストールする例を次に示します:

```shell
sudo apt install vnstat
```

実行するには、次のようにします(インターネット接続に使用するネットワークインターフェースの名前が`eth0`であると仮定します):

```
vnstat -i eth0
```

これはすぐには機能しません。システムに関するデータを収集するのに時間がかかるためですが、日数と週数が経過すると、次のようになります:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

これにより、合計ネットワーク使用量を追跡できます。ISPがデータキャップを課している場合に役立つ可能性があります。

ほとんどの最新システムは、eth0ではなく、eno0やenp0s31f6のような他のネットワークインターフェースをより一般的に使用することに注意してください。
ネットワークインターフェースを確認する必要がある場合は、次のコマンドを実行します:

```shell
ls /sys/class/net
```

イーサネット(有線)デバイスは通常、上記の例のように`e`で始まります。
ワイヤレスデバイスは通常`w`で始まります。

## Smartnodeアラート通知

[アラート通知でSmartnodeスタックを監視する](./maintenance/alerting.md)では、Smartnodeアラート通知機能を使用して、Rocket Pool Smartnodeの健全性と重要なイベントに関する通知を受け取る方法について説明します。

## サードパーティパフォーマンス監視

最適な監視では、スイスチーズモデルを使用します。すべてのツールには穴がありますが、それらを互いに重ねると、何かが落ちて驚かされる可能性が低くなります。

これらのサードパーティツールはRocket Poolコミュニティで使用されていますが、Rocket Poolチームによって正式に承認またはサポートされているわけではないことに注意してください。
ツールの提案がある場合、またはツールの所有者の場合は、ツールの詳細を含むプルリクエストを追加することを歓迎します。

### Beaconcha.in Website: Beacon Chainをメトリクスソースとして使用する

[Beaconcha.in](https://beaconcha.in)ブロックエクスプローラーのウェブサイトとアプリは、オンチェーンアクティビティを確認することで、validatorのパフォーマンスを追跡する方法を提供します。
また、ダウンタイムなどの重要なイベントに対して[メール通知](https://beaconcha.in/user/notifications)を受け取るオプションもあります。
サイトに移動し、画面上部の検索ボックスにvalidatorの公開鍵を入力します。

::: tip
validatorの公開鍵を忘れた場合は、`rocketpool minipool status`コマンドで簡単に取得できます。
:::

すべてが正しくセットアップされている場合、次のようなものが表示されます:
![](./local/images/pi/Beaconchain.png)

::: tip 注意
上記のリンクは、Beaconcha.inの**mainnet**バージョン用です。
Hoodi Testnetで実行している場合は、[代わりにこのリンクを使用してください](https://hoodi.beaconcha.in)!
:::

これは、validatorのすべてのBeacon Chainアクティビティの記録です。
Beacon Chain上のvalidatorの残高を確認して、時間の経過とともに成長するのを見守り、APYを計算できます。

また、validatorが稼働して正しく実行されているかどうかを迅速に判断するためにも使用できます。
そうである場合、すべてのアテステーションは**Status**に`Attested`と表示され、理想的にはすべての**Opt. Incl. Dist.**が0である必要があります(ただし、時々1または2は問題ありません)。

`Missed`と表示されているブロックが多数ある場合、validatorは正しく機能していません。
DockerまたはHybridモードを使用している場合は、`rocketpool service logs ...`で`eth1`、`eth2`、および`validator`サービスのログを確認する必要があります(Native modeを使用している場合は、対応するログスクリプト)。

**このタブをピン留めするか、ブックマークを作成して、validatorのステータスをすばやく確認できるようにする必要があります。**

#### Beaconcha.inを使用して複数のMinipoolを監視する

Beaconcha.inには、複数のvalidatorまたはminipoolを一度に監視できる[ダッシュボードビュー](https://beaconcha.in/dashboard)があります。
validatorインデックスを1つずつ追加するだけです。多数のminipoolがある場合は、次を実行できます:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

カンマ区切りのリストを取得し、次のようにURLバーに配置します: `https://beaconcha.in/dashboard?validators=123456,123457`

### Beaconcha.in App: Validator概要とプッシュ通知

Beaconcha.inウェブサイトは、メトリクスを表示し、メールアラートを設定する優れた方法です。
モバイルアプリは、より「一目でわかる」性質を持っています。
また、次のような便利なアラートを含むプッシュ通知サービスも備えています:

1. アテステーションの欠落などの問題の通知
2. Rocket Pool報酬ラウンドの通知
3. ノード上のRPLの過剰/過小担保の通知

アプリには無料版があり、ホームスクリーンウィジェットなどの便利な機能を備えた有料オプションもあることに注意してください。

### Beaconcha.inでValidatorの名前を変更する

Beaconcha.inウェブサイトには、ユーザーがvalidatorの名前を変更して、識別/検索を容易にする機能があります。

この機能を使用するには、そのvalidatorを制御している人物であることを証明するために、ノードウォレットの秘密鍵を使用してメッセージに署名する必要があります。

Smartnode v1.5.1には、`rocketpool node sign-message`コマンドを使用してノードウォレットの秘密鍵でメッセージに署名する機能が含まれています。次に、署名したいメッセージを提供します。
validatorの名前を変更するために使用するには、「beaconcha.in」という用語を含める必要があります。

![](../node-staking/images/sign-message.png)

Beaconcha.inでvalidatorページを開き、`Edit validator name`ボタンをクリックします。

![](../node-staking/images/edit-validator-name.png)

sign-messageコマンドの結果をコピーして、"Signature"フィールドに貼り付けます。
希望のニックネームを入力し、`Save changes`ボタンをクリックします。

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: アップタイムのためのポートスキャン

[Uptimerobot](https://uptimerobot.com/)サービスは、IPアドレスをスキャンしてオープンポートを探すシンプルなサービスです。
指定したポートでマシンが利用できなくなった場合、Uptimerobotは問題があることを通知できます。
このサービスには、メール、プッシュ通知、SMS、電話、webhookなど、さまざまな通知オプションがあります。

セットアップ画面は次のようになります:

![](./local/images/uptimerobot.png)

監視するIPは、ノードの外部IPです。これは、`ssh`で、または物理的にノードにログインし、ブラウザで[icanhazip.com](https://icanhazip.com/)を開くか、ターミナルで次のコマンドを実行することで見つけることができます:

```shell
curl icanhazip.com
```

監視するポートは、ノードのセットアップによって異なります。一般的なSmartnodeインストールを実行しているユーザーは、ExecutionクライアントとConsensusクライアント用にそれぞれポート30303と9001を転送している可能性があるため、これらはアップタイム監視に適した選択肢です。

### Rocketpool Metrics Dashboards

ノードのパフォーマンスの概要とRocket Poolネットワーク全体を提供する、コミュニティ主導の複数のイニシアチブがあります。

### Pushoverを使用したスクリプト(上級)

::: tip 注意
[アラート通知でSmartnodeスタックを監視する](./maintenance/alerting.md)では、ノードのアップデートが利用可能な場合の通知を含む、Smartnodeアラート通知機能の使用方法について説明します。
:::

[Pushover](https://pushover.net/)サービスを使用すると、自分自身にプッシュ通知を送信できます。

::: warning 注意
これは取り組むべき高度なアクティビティです。
シェルスクリプトに精通している場合は役立ちますが、シェル環境に慣れていない場合は推奨されません。
:::

Pushoverを開始するには:

1. [pushover.net](https://pushover.net/)でアカウントを作成します
1. [APIトークンを作成します](https://pushover.net/apps/build)
1. Pushoverモバイルアプリおよび/またはブラウザ拡張機能をインストールします
1. 気になるアクションに対してPushover APIを呼び出します

プッシュ通知を送信するためにPushover APIを呼び出すには、次のように構造化された`curl`呼び出しを使用します:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### 例: アップデートが利用可能な場合のプッシュ通知

`unattended-upgrades`と`update-nofifier`パッケージを使用して自動更新を設定した場合、ノードのアップデートが利用可能な場合にプッシュ通知を受け取りたい場合があります。
これを行う潜在的な方法の1つは、`~/update-notifier.sh`にスクリプトを作成し、`crontab`を使用して毎日9:00にトリガーすることです。

これを行うには、まず次を実行してスクリプトを作成します:

```shell
nano ~/update-notifier.sh
```

次に、次のスクリプトを貼り付けます:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

次に、次のコマンドを実行して、スクリプトを実行可能としてマークします:

```shell
chmod u+x ~/update-notifier.sh
```

次に、次のコマンドを実行してcrontabを開きます:

```shell
crontab -e
```

次に、矢印キーを使用してスクロールダウンし、ファイルが次のようになるように`* 9 * * * ~/update-notifier.sh`という行を追加します:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

次に、`control+x`を押して終了し、変更を保存するかどうか尋ねられたら`Y`を押します。

アップデートがある場合、現地時間の09:00に通知を受け取るようになります。
ターミナルで次のように入力することで、スクリプトを手動で実行できます:

```shell
~/update-notifier.sh
```

#### 例: APC UPS Daemonがアクティブ化されたときに通知を受け取る

一部のホームステーカーは、電源が切れた場合にノードが適切にシャットダウンするように、`apcupsd`ユーティリティを備えた無停電電源装置を使用しています。

`apcupsd`ユーティリティは、`apccontrol`スクリプトを使用してロジックを管理するため、`/etc/apcupsd/apccontrol`ファイルを編集することで、このデーモンのアクティビティを監視できます。
これを行うには、次を実行します:

```shell
sudo nano /etc/apcupsd/apccontrol
```

次に、ファイルが次のようになるように、行の上部に次のコードを追加します:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

これにより、定期的な「セルフテスト」機能を含む、UPSデーモンがアクションを起こすたびにプッシュ通知が送信されます。
