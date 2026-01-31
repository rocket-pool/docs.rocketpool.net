# FAQ (WIP)

### 32 ETHのソロvalidatorと比較して、Rocket Poolでminipoolを実行することの利点は何ですか?

単一のソロvalidatorを実行することで、32 ETHに対して100%の報酬を受け取ることができます。
2つの16 ETH minipoolを実行することで、32 ETHに対して100%の報酬**プラス**Rocket Poolプロトコルによって提供される32 ETHの報酬の14%を受け取ることができます。
4つの8 ETH minipoolを実行することで、32 ETHに対して100%の報酬**プラス**Rocket Poolプロトコルによって提供される96 ETHの報酬の14%を受け取ることができます。
Rocket Poolの[Smoothing Pool](./prepare-node.mdx#smoothing-pool)機能を使用するオプションもあります。

### rETHの価値はどのようにわかりますか? リベースしますか?

rETHトークンはリベースしません。
ウォレット上のトークン数は一定のままですが、時間の経過とともに価値が上昇します。

### ノードの実行で技術的な問題がある場合、どのようにサポートを受けられますか?

[Rocket Pool Support](https://rocketpool.support)ページを確認することから始められます。
それが役に立たない場合は、[Discordサーバー](https://discord.gg/rocketpool)のRocket Pool **#support**チャンネルで質問できます。

### minipoolの作成と実行を試すために、テストETHを取得するにはどうすればよいですか? faucetチャンネルにメッセージを投稿できません。

[HoodiでテストETHを取得する](../testnet/overview#getting-test-eth-on-hoodi)を参照してください。

### マシンが壊れた場合、ノードを復旧するにはどうすればよいですか?

簡単な答え: ニーモニックは、ノードを完全に復旧するために必要なすべてです。
常に安全に保管してください。

新しいマシンでノードを復旧するには、まず**以前のマシンが再びオンラインにならないようにする**ことを確認してください。キーが利用可能な状態で、同じキーで2つのノードを実行すると、**スラッシングされます**。
新しいマシンにSmartnodeをインストールするための[手順](./install-modes)に従います。
次に、`rocketpool wallet recover`コマンドを実行し、24語のニーモニックを挿入して、ノードウォレットとvalidatorキーを復旧します。

### クライアントが同期していません。ピア数が少ないです。

クライアントが適切に同期するには、健全な数のピアが必要です。
[ここ](https://www.yougetsignal.com/tools/open-ports/)でテストを実行し、ポート30303と9001が開いているか確認することから始められます。
閉じている場合は、ルーターでポート転送を設定する必要があります。
また、ノードが新しいアドレスを取得してポート転送が壊れないように、ノードに静的なローカルIPアドレスがあることを確認してください。

### Consensus clientの同期に時間がかかりすぎます。どうすればよいですか?

[Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing)を使用して同期プロセスを開始しなかった場合、Consensus clientの同期には長時間かかる可能性があります。
長時間実行していても、通常はcheckpoint sync URLを設定し、`rocketpool service resync-eth2`で現在の同期データをクリアして最初からやり直す方が速いです。
クライアントは1分以内に同期されるはずです。

### 既に再起動しました。なぜGrafanaはまだ再起動する必要があると言うのですか?

再起動情報はキャッシュされ、数時間ごとにのみ更新されます。
`sudo apt update`を実行すると、更新が強制されます。

### Execution LayerおよびBeacon ChainまたはConsensus Layerを変更しました。古いデータをクリーンアップするにはどうすればよいですか?

クライアントを変更した場合、Rocketpoolは古いボリュームを削除しません。このデータは、かなりのディスク容量を無駄にしている可能性があり、削除したい場合があります。そのためには、ボリュームを見つける必要があります。デフォルトのRocketpool設定を使用している場合、dockerボリュームは`/var/lib/docker/volumes/`に保存されます。Execution layerは`rocketpool_eth1clientdata/_data/*`に、consensus layerは`rocketpool_eth2clientdata/_data/*`にあります。

これらのディレクトリにアクセスするには、`sudo -i`を使用してrootとしてsudoする必要がある場合があります。次に、`rm -rf <directory>`を呼び出してディレクトリを削除できます。例えば、すべてのgethデータを削除したい場合は、`rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`を呼び出します。

rootを終了するには、`exit`と入力します。
