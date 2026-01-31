# ノードのバックアップ

::: tip 注記
これは現在**Dockerモード**インストール向けに書かれています。
HybridまたはNativeユーザーの場合、一部の場所が異なる可能性があります。
:::

一般的に、Smartnode経由でノードウォレットとminipoolを作成した場合、完全な障害からノードを回復するために本当に必要なのは**ノードウォレットのニーモニック**だけです。
それ以外のすべては、そこから簡単に回復できます。

外部生成されたvalidatorキーを持つminipool（例：**Allnodes**から自己ホスト型ノードに移行した場合）がある場合は、ノードウォレットから回復できないため、validatorのプライベートキーストアファイルも必要になります。

とはいえ、Merge後は、Executionレイヤーチェーンを再同期する必要がある場合に、軽量Executionクライアント（例：PocketまたはInfura）をフォールバックとして使用できなくなります。
さらに、正しく証明するためには、アクティブで健全なExecutionクライアントが必要になります。
Executionクライアントの障害（データベースの破損、SSDの故障、ハードウェアの侵害/盗難など）から迅速で信頼性の高い回復方法を持つことは、ゼロから同期するのに数時間から数日かかる可能性があるため、非常に重要です。

このガイドでは、ノードの回復力を向上させ、不要なダウンタイムを最小限に抑えるために、これらのいくつかをバックアップする方法を示します。

::: warning 注記
このガイドは、Smartnodeをデフォルトディレクトリ（`~/.rocketpool`）にインストールしていることを前提としています。
別のインストールディレクトリを指定した場合は、以下の手順で適宜置き換えてください。
:::

## バックアップ可能なアイテム

### Smartnode設定

Smartnodeの設定は`~/.rocketpool/user-settings.yml`に保存されています。
これを保存して置き換えることで、すべてのSmartnode設定（つまり、`rocketpool service config`で指定したもの）を復元できます。

### Executionクライアント / ETH1クライアントチェーンデータ

Executionクライアントのチェーンデータは、おそらく最も重要なバックアップ項目です。
前述のように、ECチェーンデータの再同期には数日かかる可能性があります。
Merge後、これは数時間から数日のダウンタイムと利益の損失を意味します！

チェーンデータは`rocketpool_eth1clientdata` Dockerボリューム内に保存されており、デフォルトでは`/var/lib/docker/volumes/rocketpool_eth1clientdata`にあります。
このフォルダは通常、権限のないユーザーアカウントではアクセスできないことに注意してください。表示するには`root`ユーザーに昇格する必要があります。

::: tip 注記
初期Smartnodeインストール時にDockerのストレージ場所を変更した場合（2番目のSSDでDockerを実行している人など）、ボリュームは`/<外部マウントポイント>/docker/volumes/rocketpool_eth1clientdata`にあります。

使用しているインストールパスがわからない場合は、`/etc/docker/daemon.json`でその場所を確認できます。
ファイルが存在しない場合は、デフォルトの場所を使用しています。
:::

Executionチェーンデータを効率的にバックアップする方法の詳細な手順については、以下の[Executionチェーンデータのバックアップ](#backing-up-your-execution-chain-data)セクションをご覧ください。

### モニタリングとメトリクスデータ

このデータは`rocketpool_grafana-storage` Dockerボリューム内に保存されており、デフォルトでは`/var/lib/docker/volumes/rocketpool_grafana-storage`にあります（Dockerストレージの場所をカスタマイズした場合は`/<外部マウントポイント>/docker/volumes/rocketpool_prometheus-data`）。

## バックアップ**すべきでない**アイテム

### プライベートキーとパスワード

ノードウォレットのプライベートキーとそれを暗号化するために使用されるパスワードファイルは、それぞれ`~/.rocketpool/data/wallet`と`~/.rocketpool/data/password`に保存されています。
これらのファイルは、`rocketpool wallet recover`を使用してニーモニックから回復できるため、通常バックアップする必要はありません。

何らかの理由でこれらのファイルをバックアップすることを決定した場合は、保存方法について**非常に注意**する必要があります。
これらのファイルにアクセスできる人は誰でも、ノードウォレット、そのvalidator、およびガスなどのために保存されている資金にアクセスできるようになります。

これらのファイルをバックアップせず、必要に応じてウォレットのニーモニックを使用して回復することを**強くお勧め**します。

### Consensusクライアントチェーンデータ

Executionレイヤーデータとは異なり、Consensusレイヤーデータは[チェックポイント同期](./config-docker#beacon-chain-checkpoint-syncing)のおかげで、ノードにとってそれほど重要ではありません。
Consensusクライアントは、このテクニックを使用してBeacon chainの先頭にすぐに再同期し、検証業務を再開できます。

## Executionチェーンデータのバックアップ

Smartnodeには、`rocketpool service export-eth1-data`コマンドを使用してExecutionチェーンデータをバックアップする機能が付属しています。
内部的には、Linux内の強力なバックアップ/コピーツールである`rsync`を利用しています。

`rsync`は、ソースディレクトリ（Dockerボリューム）とターゲットディレクトリ（バックアップ場所）のファイルを比較します。
ソースファイルがターゲットディレクトリに存在しない場合、完全にコピーされます。
ただし、存在する場合、`rsync`は2つのファイル間の変更のみをコピーします。

これは、最初のバックアップが、すべてのデータを最初にコピーする必要があるため、かなりの時間がかかることを意味します。
その後のバックアップは、前回のバックアップと現在の間の変更のみをコピーするため、プロセスははるかに高速になります。

バックアップ戦略の一環として、定期的に`export-eth1-data`を実行することを計画したい場合があります。
チェーンデータの整合性を確保するため、このコマンドを実行すると**データをバックアップする前にExecutionクライアントを安全にシャットダウン**します。
毎週スケジュールすることを選択した場合、Executionクライアントはバックアップを更新する間、数分間のみダウンします。
これは、データをゼロから再同期するのにかかる日数よりも確実に優れています。

バックアップをトリガーするには、まず**データをエクスポートするストレージメディアをマウント**します。
たとえば、これは外付けハードドライブである可能性があります。

::: tip ヒント
Linuxで外部デバイスをマウントする方法がわからない場合は、簡単です！
デバイスをノードに接続し、[このようなガイド](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/)に従ってマウント方法を学んでください。
:::

マウントしたら、そのマウントパスをメモしてください。
この例では、外部デバイスがマウントされている`/mnt/external-drive`というフォルダにチェーンデータを保存したいと仮定しましょう。
以下のどこに表示されても、実際のマウントパスに置き換えてください。

次に、以下のコマンドを実行します。

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

これにより、ターゲットフォルダが到達可能で、チェーンデータを保存するのに十分な空き容量があることが確認されます。
出力は次のようになります。

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

ご覧のとおり、チェーンデータは100 GB未満（Hoodiテストネットの場合。Ethereumメインネットは桁違いに大きくなります）で、外部フォルダには287 GiBの空き容量があるため、エクスポートを続行できます。

準備ができたら、ここで`y`を入力して`Enter`を押します。
これにより、Executionクライアントが停止し、チェーンデータのターゲットフォルダへのコピーが開始されます。
実行中、画面上に各個別ファイルの進行状況が表示されます。

::: warning 注記
実行中にターミナルを終了しないことが重要です。
終了すると、コピーはバックグラウンドで実行され続けますが、進行状況を追跡できなくなります！
:::

完了すると、自動的にExecutionクライアントコンテナが再起動されます。

**エクスポート完了後、ノードから既存のチェーンデータは削除されません！**

### Executionチェーンデータの復元

バックアップしたチェーンデータを復元する必要がある場合は、次のコマンドを実行するだけです。

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger 警告
これにより、`rocketpool_eth1clientdata`ボリューム内の既存のExecutionクライアントデータが自動的に削除されます！
:::

完了すると、Executionクライアントは使用できる状態になります。
