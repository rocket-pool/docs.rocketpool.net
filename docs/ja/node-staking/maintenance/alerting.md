# アラート通知によるSmartnodeスタックの監視

Smartnodeアラート通知機能により、Rocket Pool Smartnodeの健全性と重要なイベントに関する通知を受け取ることができます。

## アラートシステムの概要

通知機能は[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)を利用してアラートを配信します。アラート機能を使用するには、Smartnodeスタックのメトリックトラッカーの設定方法を説明している[Grafanaダッシュボードの設定](../grafana.mdx)に既に従っている必要があります。アラートは、Smartnodeの重要なメトリックが特定のしきい値を超えた場合、またはノードの手数料受取人が変更されたときなどの特定のイベントが発生した場合にトリガーされます。

## Discord通知の設定

現在、通知はDiscordチャンネルとTelegramチャットに送信できます。Rocket Poolテキストユーザーインターフェース(TUI)の「Monitoring / Alerting」ページで、いずれか一方または両方の送信先を設定できます。

### Discord Webhook URLの追加:

1. 目的のDiscordチャンネルに移動し、その設定を開きます。
2. 「統合」の下で、「Webhook」を見つけてクリックします。
3. 「Webhookを作成」をクリックします。
4. webhookに名前を付け、アラートを送信するチャンネルを選択します。
5. 提供されたWebhook URLをコピーします。
6. Rocket Pool TUI内で、「Monitoring / Alerting」ページに移動します。
7. コピーしたWebhook URLを指定されたフィールドに貼り付けて、設定を保存します。

## Telegram通知の設定

Telegram通知は、Rocket Poolテキストユーザーインターフェース(TUI)の「Monitoring / Alerting」ページ内で設定できます。Telegram通知はTelegram Bot API経由で送信されます。ボットトークンと数値のチャットIDの両方が必要で、一方だけを入力しても機能しません。

### TelegramボットトークンとチャットIDの追加:

1. Telegramで [@BotFather](https://t.me/BotFather) を開き、新しいボットを作成します。
2. BotFatherが提供するボットトークンをコピーします(トークンのみ — `bot` プレフィックスは含めないでください)。
3. アラートの送信先を、自分とのプライベートチャット(DM)、グループ、チャンネルのいずれにするかを決めます。
4. DMでアラートを受け取りたい場合は、まずボットに `/start` を送信します。次にブラウザで `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` を開き(`<YOUR_BOT_TOKEN>` はステップ2のトークンに置き換えてください)、`"chat"` オブジェクトを探します:

```json
"chat": {
  "id": 123456789,
  "type": "private"
}
```

`"id"` の値が、Telegram Chat IDフィールドに設定すべきチャットIDです。

5. グループまたはチャンネルでアラートを受け取りたい場合は、ボットをメンバーとして追加します(チャンネルの場合、ボットは管理者である必要があります)。グループおよびチャンネルのIDは負の値で、通常 `-100` で始まります。ボットがそのチャットを認識できるようになったら、同じ `getUpdates` URLを使用して数値のチャットIDを確認します。`@mychannel` のようなユーザー名は機能しません。
6. Rocket Pool TUIで「Monitoring / Alerting」ページに移動します。
7. ボットトークンと数値のチャットIDを指定されたフィールドに貼り付け、設定を保存します。

::: tip ヒント
お気に入りの通知方法が見つかりませんか? Rocket Poolチームは、追加の通知先に関するコミュニティからのフィードバックを積極的に求めています。https://github.com/rocket-pool/smartnode/issuesで新しい通知先を提案してください。
:::

## アラートの無効化と有効化

Rocket Pool TUIは、アラートを管理するためのユーザーフレンドリーなインターフェースを提供します。この機能には、「Monitoring / Alerting」ページからアクセスできます。このインターフェースでは、設定されたすべてのアラートのリストを表示し、好みに応じて個々のアラートを有効または無効にすることができます。

## 高度な設定

::: warning 注意
このセクションは、Prometheusの経験があり、YAMLファイルの変更に慣れている上級ユーザー向けです。
:::

アラートのより高度な設定を行う場合、Smartnodeスタックによって管理されるPrometheusコンテナで利用可能な任意のメトリックに基づいて独自のアラートを追加できます。[Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)を含む独自のyamlファイルを`~/.rocketpool/alerting/rules/`ディレクトリに追加し、`docker stop rocketpool_prometheus`に続いて`docker start rocketpool_prometheus`でPrometheusコンテナを再起動します。次に、`docker logs rocketpool_prometheus`を実行して、Prometheusが設定ファイルを正常にロードしたことを確認します(*msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml*という行が表示され、*err="error loading config from \"/etc/prometheus/prometheus.yml\"...*が表示されないことを確認します)。
