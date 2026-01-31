# Rocket Pool Smart Node用のアドオンの作成方法

## はじめに

Rocket Pool Smart Nodeアドオンは、Smart Nodeスタックに追加機能を提供する拡張機能です。EthereumクライアントまたはSmart Nodeサービスと統合するDockerコンテナとして実装できます。アドオンは、`rocketpool service config`コマンドを介してSmart Nodeのターミナルユーザーインターフェース（TUI）を通じて有効化および設定できます。

アドオンの開発は、2つの既存の例に基づいて行うことができます。

- **Graffiti Wall Writer**: ノードオペレーターがBeaconcha.inのgraffitiウォールでコミュニティの描画に貢献できるようにします。ブロック提案のgraffitiを動的に設定します。分散型描画ツールを使用して、各提案で「ペイント」するピクセルを決定します。
- **Rescue Node**: Rocket Rescue Nodeプロジェクトからの資格情報を使用して、フォールバックbeacon nodeサービスを提供します。これにより、ノードのメンテナンス、同期、または停止中に、共有リモートbeacon nodeにリクエストをルーティングすることで、見逃したアテステーションを防ぐことができます。

アドオンはSmart Nodeソースコードの一部であり、リポジトリへのプルリクエストを介して貢献する必要があります。標準化されたインターフェースを実装して、設定と統合を行います。

## 前提条件

- アドオンはGoで記述されているため、Goプログラミングに精通していること。
- アドオンはコンテナとして実行できるため、Dockerに関する理解。
- Docker composeのセットアップと設定システムを含む、Rocket Pool Smart Nodeアーキテクチャに関する知識。
- ローカル開発とテストのためのSmart Nodeリポジトリへのアクセス。

## アドオンを作成する手順

新しいアドオンを作成するには、Smart Nodeリポジトリ内の特定の場所にコードを追加する必要があります。このプロセスには、アドオンロジックの実装、UIの設定、登録、およびDockerスタックとの統合の処理が含まれます。

### 1. アドオンロジックの実装

`addons/`内にアドオンにちなんで名付けられた新しいサブディレクトリを作成します（snake_caseを使用、例：`my_addon`）。

このディレクトリに、アドオン構造体を定義し、`github.com/rocket-pool/smartnode/shared/types/addons`の`SmartnodeAddon`インターフェースを実装するGoファイル（例：`my_addon.go`）を作成します。

```
type MyAddon struct {
    cfg *MyAddonConfig `yaml:"config,omitempty"`
}

func NewMyAddon() addons.SmartnodeAddon {
    return &MyAddon{
        cfg: NewConfig(),
    }
}
```

実装する主なメソッド:

- `GetName()`: アドオンの表示名を返します。
- `GetDescription()`: 簡単な説明を返します。
- `GetConfig()`: パラメータ（有効フラグ、APIキー、URLなど）を持つ設定オブジェクトを返します。
- `GetEnabledParameter()`: アドオンが有効かどうかを制御するパラメータを返します。
- アドオンの起動/停止、Docker composeセクションの生成、または他のサービスとのやり取りのためのメソッド。

アドオンがDockerコンテナを実行する場合:

- Dockerイメージを定義します（カスタムイメージまたは外部イメージなど）。
- 必要なボリューム、ポート、または環境変数を指定します。

たとえば、Graffiti Wall Writerアドオンは、描画する画像のJSON設定に基づいてvalidatorクライアントのgraffitiファイルを定期的に更新するコンテナを実行します。

Rescue Nodeアドオンは、validatorクライアントを設定して、プロキシを介してリモートフォールバックbeacon nodeを使用します。ユーザー名とパスワードのパラメータが必要です。

### 2. 設定UIの作成

`rocketpool-cli/service/config/`に`addon-myaddon.go`という名前のファイルを追加します。

このファイルは、`tview`ライブラリを使用してアドオンを設定するためのTUIページを定義します。

主な要素:

- レイアウト、マスター設定、およびフォームアイテムのフィールドを持つ構造体`AddonMyAddonPage`を定義します。
- ページを初期化し、`createContent()`を呼び出すコンストラクタ`NewAddonMyAddonPage`。
- `createContent()`: チェックボックス（有効など）と他のパラメータの入力フィールドを持つフォームを設定します。
- `handleEnableChanged()`のようなイベントハンドラーは、有効状態に基づいてパラメータを表示/非表示にします。

スニペットの例:

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

// The page wrapper for the add-on config
type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

// Creates a new page for the add-on settings
func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
	// ... (additional code for page setup)
}

// Creates the content for the settings page
func (configPage *AddonMyAddonPage) createContent() {
	// Setup layout and form items
	// ...
}
```

### 3. アドオンの登録

`addons/constructors.go`を更新して、アドオンのコンストラクタを含めます。

このファイルには、すべてのアドオンをインスタンス化する関数が含まれています。

例:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

次に、`shared/services/config/rocket-pool-config.go`の`NewRocketPoolConfig`内の利用可能なアドオンのリストに追加します。

```
// Addons
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Docker Composeとの統合

アドオンは、多くの場合Docker composeファイルの変更を必要とします。

- アドオンのcomposeセクション用のテンプレートを`shared/services/rocketpool/assets/install/templates/addons`ディレクトリに追加します（例：`my_addon.tmpl`）。
- アドオンコードは、有効にすると、サービス、ボリューム、および依存関係を含むcompose YAMLを生成します。

`services/rocketpool/client`フォルダー内の`composeAddons`関数は、Rocket Pool設定に基づいてDocker Composeコンテナをプロビジョニングし、アドオンのランタイム、テンプレート、およびオーバーライドアセットをセットアップする責任があります。

インストールの場合:

- アドオンがファイルのコピーを必要とする場合は、インストーラースクリプト（`install.sh`）を更新します（例：デフォルトの設定ファイル）。

### 5. オプションの統合

- **Node Status Command**: アドオンにステータス情報がある場合（例：Rescue Nodeの資格情報の有効期限）、`rocketpool-cli/node/status.go`を更新して表示します。
- **MetricsまたはLogs**: 該当する場合は、Prometheus/Grafanaと統合します。
- **External Dependencies**: 外部リポジトリを使用している場合（例：Rescue Nodeプロキシ）、必ずドキュメント化してください。

### 6. テストと提出

- ローカルでビルドしてテストします: Makefileを使用してSmart Nodeをビルド、インストールし、アドオンを有効にします。
- TUIで確認し、Dockerコンテナを確認し、機能をテストします。
- https://github.com/rocket-pool/smartnode に変更を含むプルリクエストを提出します。

## 例: Graffiti Wall Writer

- **目的**: ブロック提案を使用してBeaconcha.inのgraffitiウォールにコミュニティ画像を描画します。
- **実装**: ウォール状態を取得し、validatorのgraffitiファイルを更新するDockerコンテナを実行します。
- **設定**: 有効フラグと画像JSONのURLのパラメータ（デフォルト: Rocket Poolロゴ）。
- **統合**: コンテナはvalidatorのデータディレクトリをマウントしてgraffitiファイルを書き込みます。TUIを介して有効化; 分散型描画に貢献します。

## 例: Rescue Node

- **目的**: ダウンタイム中のペナルティを回避するためのフォールバックbeacon node。
- **実装**: validatorクライアントを設定して、認証付きのリモートプロキシを使用します。
- **設定**: 有効フラグ、Rescue Nodeウェブサイトからのユーザー名とパスワード。
- **統合**: validatorの設定を変更してrescueプロキシを指すようにします。`rocketpool node status`に資格情報のステータスを表示します。

詳細については、リポジトリのソースコードを確認するか、アドオン開発ドキュメントの改善に貢献してください。
