# Monitoring your Smartnode Stack with Alert Notifications

The Smartnode alert notification functionality allows you to receive notifications about the health and important events of your Rocket Pool Smartnode.

## Alerting System Overview

The notification functionality utilizes [Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) to deliver alerts. Alerting requires that you have already followed the [Setting up the Grafana Dashboard](../grafana) which walks through setting up the Smartnode stack's metrics tracker. The alerts are triggered when important metrics from your Smartnode exceed certain thresholds or when particular events occur like when your node's fee recipient is changed.

## Setting up Discord Notifications

Currently, notifications can be sent to Discord channels. You can configure Discord notifications within the Rocket Pool Text User Interface (TUI) on the "Monitoring / Alerting" page.

### Adding a Discord Webhook URL:

1. Navigate to your desired Discord channel and open its settings.
2. Under "Integrations," locate and click on "Webhooks."
3. Click "Create Webhook."
4. Give your webhook a name and choose a channel to send the alerts to.
5. Copy the provided Webhook URL.
6. Within the Rocket Pool TUI, navigate to the "Monitoring / Alerting" page.
7. Paste the copied Webhook URL into the designated field and save the configuration.

::: tip TIP
Is your favorite notification missing? The Rocket Pool team is actively looking for feedback from the community regarding additional notification destinations. Feel free to suggest new notification destinations at https://github.com/rocket-pool/smartnode/issues.
:::

## Disabling and Enabling Alerts

The Rocket Pool TUI provides a user-friendly interface for managing your alerts. You can access this functionality through the "Monitoring / Alerting" page. This interface allows you to View a list of all configured alerts and Enable or disable individual alerts based on your preference.

## Advanced Configuration

::: warning NOTE
This section is for advanced users who are experienced with Prometheus and modifying YAML files.
:::

For more advanced configuration of alerts you can add your own based on any metric that is available in the Prometheus container managed by the Smartnode Stack. Add your own yaml file containing [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/) into the `~/.rocketpool/alerting/rules/` directory and those rules and restart the Prometheus container with `docker stop rocketpool_prometheus` followed by `docker start rocketpool_prometheus`. Then run `docker logs rocketpool_prometheus` to confirm that Prometheus loaded your configuration file successfully (you want to see a line with _msg="Completed loading of configuration file" filename=/etc/prometheus/prometheus.yml_ and not _err="error loading config from \"/etc/prometheus/prometheus.yml\"..._)
