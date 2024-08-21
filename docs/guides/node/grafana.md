# Setting up the Grafana Dashboard

Now that you have your node up and running, you'll probably want to have a convenient way to monitor everything about it at a glance to make sure it's functioning correctly (and what kind of earnings it's generating for you).

There are many tools out there that do this job.
One of the most popular is called [Grafana](https://grafana.com/) - an easy-to-use, general-purpose dashboard system that you can access with a browser.

Rocket Pool comes out-of-the-box with support for Grafana and its dependencies; it even comes with a pre-built dashboard for each of the Consensus clients.
For example, here is a snapshot of what the dashboard looks like on the Holesky test network:

![](./images/grafana-1.3.jpg)

The standard dashboard includes the following information all in a convenient format:

- **Top left:** some important statistics about your machine's health and performance, and any pending system updates
- **Top right:** the activity and performance of your validators on the Beacon Chain, along with some Execution and Consensus client stats
- **Bottom left:** details about the entire Rocket Pool network, for reference
- **Bottom right:** details about your staking rewards, both ETH and RPL

In this guide, we'll show you how to enable Rocket Pool's metrics system so you can use this dashboard - or even build your own!

## Overview of the Rocket Pool Metrics Stack

If you choose to enable metrics during the Smartnode configuration process, your node will add the following processes:

- [Prometheus](https://prometheus.io/) - a data collection, storage, and reporting system that captures all of the metrics you see above (any many more) and stores them, so they can be looked at over time
- The Prometheus [Node Exporter](https://github.com/prometheus/node_exporter) - a service that collects information about your machine's health (such as CPU usage, RAM usage, free disk space and swap space, etc.) and reports it to Prometheus
- Grafana, the tool that exposes Prometheus's data through a convenient website hosted on your node
- An optional custom set of scripts that will report any available Operating System updates to Prometheus, so you know if your system needs to be patched

The default configuration will create Docker containers with all of these services that live alongside the rest of the Smartnode's Docker containers.
It will open up a port on your node machine for Grafana, so you can access its dashboard from any machine on your local network with a browser.

## Enabling the Metrics Server

:::::: tabs
::::: tab Docker
Enabling metrics in Docker mode is the easiest of all.

Start by running the Smartnode configuration command again:

```shell
rocketpool service config
```

Go to the `Monitoring / Metrics` section and check the `Enable Metrics` checkbox.

For those who prefer to fine-tune their port settings, you may do so here.
Note that all of these ports are restricted to Docker's internal network with the exception of the Grafana port - that will be opened on your machine (so you can access it via a browser from other machines, such as your desktop or phone) so you may want to change that if the default port conflicts with something you already have.

Save and exit, and smartnode will start the Prometheus, Node Exporter, and Grafana Docker containers for you.

It will also modify your Consensus and Validator clients so they expose their own metrics to Prometheus.

The Operating System and Rocket Pool update tracker is **not installed by default** for maximum flexibility, but the process is simple.
If you would like to install it so your dashboard shows you how many updates are available for your system, you can do it with this command:

```shell
rocketpool service install-update-tracker
```

Under the hood, this will install a service that hooks into your Operating System's package manager, periodically checks for updates, and sends that information to Prometheus.
This service is different for every Operating System, but it has been confirmed to work on the following:

- Ubuntu 20.04+
- Debian 9 and 10
- CentOS 7 and 8
- Fedora 34

::: warning NOTE
Enabling the service automatically is incompatible with SELinux.
If your system has SELinux enabled by default (as is the case with CentOS and Fedora), the installation command will get you _most of the way there_ but will also give you instructions on how to finish the process manually at the end.
:::

During this check, it will also compare your installed Rocket Pool Smartnode version with the latest release, and inform you if there's a new release available.

If you enabled the update tracker, then the last step is to restart the Node Exporter with the following command:

```shell
docker restart rocketpool_exporter
```

After that, you should be all set.

::::: tab Hybrid

Hybrid Mode works similar to Docker Mode; the only difference is that you must manually add the proper command-line flags for enabling metrics to your Execution and Consensus Client service definition.

First, we will update your Execution Client.
Open the `systemd` unit file you created when you installed your Execution Client and make sure it has the correct flags, based on which client you are running:

^^^^^^ nestedTabs
::::nestedTab Geth

```
--metrics --metrics.addr 0.0.0.0 --metrics.port 9105
```

::::nestedTab Nethermind

```
--Metrics.Enabled true --Metrics.ExposePort 9105
```

::::nestedTab Besu

```
--metrics-enabled --metrics-host=0.0.0.0 --metrics-port=9105
```

^^^^^^

Next, we will update your Consensus Client.
Open the `systemd` unit file you created when you installed your Consensus Client and make sure it has the correct flags, based on which client you are running:

^^^^^^ nestedTabs
::::nestedTab Lighthouse

```
--metrics --metrics-address 0.0.0.0 --metrics-port 9100 --validator-monitor-auto
```

::::nestedTab Lodestar

```
--metrics --metrics.address 0.0.0.0 --metrics.port 9100
```

::::nestedTab Nimbus

```
--metrics --metrics-address=0.0.0.0 --metrics-port=9100
```

::::nestedTab Prysm

```
--monitoring-host 0.0.0.0 --monitoring-port 9100
```

If you see the flag `--disable-monitoring`, remove it.

::::nestedTab Teku

```
--metrics-enabled=true --metrics-interface=0.0.0.0 --metrics-port=9100 --metrics-host-allowlist=*
```

^^^^^^

If you already have these flags set and are using different ports for your solo validator monitoring, leave them as-is and make note of which ports you're using.

Now, scroll up and follow the directions in the `Docker` tab of this section to finish the process - keeping in mind that you must replace the ports listed there with any custom ports you use when you run `rocketpool service config`.

::::: tab Native

Native installation of Grafana and Prometheus is recommended for advanced users only. It requires Linux administration skills like `systemd`, file permissions, users and network management.

First, make sure your Execution Client and Consensus Client have metrics enabled. Refer to 'Hybrid' tab for details.

Next, check prebuilt prometheus and node_exporter packages on [the offical download page](https://prometheus.io/download/).
Choose packages with proper architecture for your platform (amd64 or arm64).
Most recent LTS (Long Time Support) version of Prometheus is recomended.

For example to download prometheus v2.45.3 LTS and node_exporter v1.7.0 for Linux amd64 with `wget` do:

```shell
wget https://github.com/prometheus/prometheus/releases/download/v2.45.3/prometheus-2.45.3.linux-amd64.tar.gz
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
wget https://github.com/prometheus/alertmanager/releases/download/v0.26.0/alertmanager-0.26.0.linux-amd64.tar.gz
```

Extract prometheus and node_exporter executables from downloaded archives.

```shell
sudo tar -zxvf prometheus-2.45.3.linux-amd64.tar.gz -C /usr/local/bin --wildcards '*/prometheus' --strip-components=1
sudo tar -zxvf node_exporter-1.7.0.linux-amd64.tar.gz -C /usr/local/bin --wildcards '*/node_exporter' --strip-components=1
sudo tar -zxvf alertmanager-0.26.0.linux-amd64.tar.gz -C /usr/local/bin --wildcards '*/alertmanager' --strip-components=1
```

Create directories for prometheus & alertmanager configs.

```shell
sudo mkdir /etc/prometheus
sudo mkdir /etc/alertmanager
sudo mkdir /var/lib/prometheus
sudo mkdir /var/lib/alertmanager
```

Create file `/etc/prometheus/prometheus.yml` with following content:

```yaml
global:
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  scrape_timeout: 12s # Timeout must be shorter than the interval
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9091"]

  - job_name: "node"
    static_configs:
      - targets: ["localhost:9103"]
  #     - targets: ['localhost:9103', 'node_hostname:9103']
  - job_name: "eth1"
    static_configs:
      - targets: ["localhost:9105"]
    # Uncomment the line below if you are using geth as Execution Client
    #metrics_path: /debug/metrics/prometheus

  - job_name: "eth2"
    static_configs:
      - targets: ["localhost:9100"]

  - job_name: "validator"
    static_configs:
      - targets: ["validator:9101"]

  - job_name: "rocketpool"
    scrape_interval: 5m
    scrape_timeout: 5m
    static_configs:
      - targets: ["node:9102"]

  - job_name: "watchtower"
    scrape_interval: 5m
    scrape_timeout: 5m
    static_configs:
      - targets: ["watchtower:9104"]

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["localhost:9093"]
```

::: warning NOTE
Change the port numbers for the Execution Client and Consensus Client if required.

You may be running your node on a different host than the host running prometheus change. In that case
install node_exporter on your rocketpool node host and update `targets` of the `node` job to include all machines you want to monitor.
Also adjust `metrics_path` if your Execution Client is geth - it exposes non-standard endpoint for metrics.
:::

Create the `/etc/alertmanager/alertmanager.yml` with the following content:

```yaml
global:
  # ResolveTimeout is the default value used by alertmanager if the alert does
  # not include EndsAt, after this time passes it can declare the alert as resolved if it has not been updated.
  # This has no impact on alerts from Prometheus, as they always include EndsAt.
  # default = 5m
  resolve_timeout: 5m

route:
  # The labels by which incoming alerts are grouped together.
  group_by: ["alertname"]
  # How long to initially wait to send a notification for a group
  # of alerts. Allows to wait for an inhibiting alert to arrive or collect
  # more initial alerts for the same group.
  group_wait: 30s
  # How long to wait before sending a notification about new alerts that
  # are added to a group of alerts for which an initial notification has
  # already been sent. (Usually ~5m or more.)
  group_interval: 5m
  # How long to wait before sending a notification again if it has already been sent successfully for an alert.
  repeat_interval: 4h
  routes:
    # severity=info: Don't send the follow-up resolved notification.
    - match:
        severity: info
      continue: false
      # The notification destination
      receiver: "node_operator_no_resolved"
    # all other alerts get sent notifications for the initial firing _and_ resolved notifications.
    - receiver: "node_operator_default"
      #match: We want this to match all alerts (severity=info is first though so it will stop)

  # The notification destination
  receiver: "node_operator_default"

receivers:
  - name: "node_operator_default"
    discord_configs:
      - webhook_url: "https://discord.com/api/webhooks/1206697259694170212/_Pk1eVVgXFLdwU1k0rfwehSvNLiAQJytVV_Ze8QYOhupHnhiB5c8awPBTfuw41lN9GJk"

  - name: "node_operator_no_resolved"
    discord_configs:
      - webhook_url: "https://discord.com/api/webhooks/1206697259694170212/_Pk1eVVgXFLdwU1k0rfwehSvNLiAQJytVV_Ze8QYOhupHnhiB5c8awPBTfuw41lN9GJk"
        send_resolved: false

inhibit_rules:
  # Inhibit rules mute a new alert (target) that matches an existing alert (source).
  - source_match:
      # if the existing alert (source) is severity=critical
      severity: "critical"
    target_match:
      # and the new alert (target) is severity=warning
      severity: "warning"
      # and the alertname, job, and instance labels have the same value
    equal: ["alertname", "job", "instance"]
```

Create system user for prometheus and alertmanager.

```shell
sudo useradd -r -s /sbin/nologin prometheus
sudo useradd -r -s /sbin/nologin alertmanager
```

Change prometheus/alertmanager files ownership and permissions.

```shell
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown alertmanager:alertmanager /usr/local/bin/alertmanager
sudo chown prometheus:prometheus /usr/local/bin/node_exporter
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R alertmanager:alertmanager /etc/alertmanager
sudo chown -R prometheus:prometheus /var/lib/prometheus
sudo chown -R alertmanager:alertmanager /var/lib/alertmanager
sudo chmod u+sx,g+sx,o-wx /usr/local/bin/prometheus
sudo chmod u+sx,g+sx,o-wx /usr/local/bin/alertmanager
sudo chmod u+sx,g+sx,o-wx /usr/local/bin/node_exporter
```

Create file `/lib/systemd/system/node-exporter.service` for node_exporter service configuration.

```
[Unit]
Description=Node metrics exporter for Prometheus
Documentation=https://prometheus.io/docs/introduction/overview
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
WorkingDirectory=/var/lib/prometheus
RuntimeDirectory=node-exporter
RuntimeDirectoryMode=0750
ExecStart=/usr/local/bin/node_exporter --web.listen-address=:9103

[Install]
WantedBy=multi-user.target
```

::: warning NOTE
If you want to change the port on which node_exporter is running, modify command at `ExecStart` parameter. Default port is 9100.
:::

Create file `/lib/systemd/system/prometheus.service` for prometheus service configuration.

```
[Unit]
Description=Prometheus instance
Documentation=https://prometheus.io/docs/introduction/overview
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
WorkingDirectory=/var/lib/prometheus
RuntimeDirectory=prometheus
RuntimeDirectoryMode=0750
ExecStart=/usr/local/bin/prometheus --config.file /etc/prometheus/prometheus.yml --web.listen-address=:9091

[Install]
WantedBy=multi-user.target
```

::: warning NOTE
If you want to change the port on which prometheus is running, modify command at `ExecStart` parameter. Default port is 9090.
:::

Create file `/lib/systemd/system/alertmanager.service` for the alertmanager service configuration.

```
[Unit]
Description=Alertmanager instance
Documentation=https://prometheus.io/docs/alerting/latest/alertmanager/
Wants=network-online.target
After=network-online.target

[Service]
User=alertmanager
Group=alertmanager
Type=simple
Restart=on-failure
WorkingDirectory=/var/lib/alertmanager
RuntimeDirectory=alertmanager
RuntimeDirectoryMode=0750
ExecStart=/usr/local/bin/alertmanager --config.file /etc/alertmanager/alertmanager.yml --web.listen-address=:9093

[Install]
WantedBy=multi-user.target
```

::: warning NOTE
If you want to change the port on which alertmanager is running, modify command at `ExecStart` parameter. Default port is 9093.
:::

Let `systemd` know about new services.

```shell
sudo systemctl daemon-reload
```

Enable and start node-exporter service.

```shell
sudo systemctl enable node-exporter
sudo systemctl start node-exporter
```

Check the service status to make sure it's running.

```shell
sudo systemctl status node-exporter
```

Enable and start prometheus service.

```shell
sudo systemctl enable prometheus
sudo systemctl start prometheus
```

Enable and start alertmanager service.

```shell
sudo systemctl enable alertmanager
sudo systemctl start alertmanager
```

Check the service status to make sure it's running.

```shell
sudo systemctl status prometheus
sudo systemctl status alertmanager
```

Setup package repository for Grafana.

```shell
sudo apt-get update
sudo apt-get install -y apt-transport-https software-properties-common
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
```

Install Grafana.

```shell
sudo apt-get update
sudo apt-get install grafana
```

Verify settings in `/etc/grafana/grafana.ini`. Change the `http_port` to 3100 to be in line with the other sections provided in this document.

Configure datasource to visualise metrics from Prometheus in Grafana. Create file `/etc/grafana/provisioning/datasources/prometheus.yml`.

```yaml
apiVersion: 1

deleteDatasources:
  - name: Prometheus
    orgId: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    orgId: 1
    url: http://localhost:9091
    basicAuth: false
    isDefault: true
    version: 1
    editable: true
```

::: warning NOTE
Edit `url` if you have changed Prometheus listening port.
:::

Enable and start service for Grafana.

```shell
sudo systemctl daemon-reload
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

Check if Grafana is up and running.

```shell
sudo systemctl status grafana-server
```

This is pretty much it.

:::::::

## Configure firewall to allow connections for monitoring

::: warning NOTE
If you have UFW enabled as referenced in the [Securing your Node](./securing-your-node) section, you will need to open a few ports in order to allow local connections between the Prometheus and your Execution/Consensus Clients. Follow the steps below.
:::

:::::: tabs
::::: tab Docker

First run:

```shell
docker inspect rocketpool_monitor-net | grep -Po "(?<=\"Subnet\": \")[0-9./]+"
```

This will return an ip in CIDR notation that looks like `172.23.0.0/16`.

Then run the following, but replace `172.23.0.0/16` with the output of the previous command, and replace the ports as needed:

```shell
sudo ufw allow from 172.23.0.0/16 to any port 9105 comment "Allow Prometheus access to Execution Client"
sudo ufw allow from 172.23.0.0/16 to any port 9100 comment "Allow Prometheus access to Consensus Client"
sudo ufw allow from 172.23.0.0/16 to any port 9103 comment "Allow Prometheus access to Exporter"
```

::::: tab Native

If your RocketPool node and Prometheus resides on different hosts you need to configure firewall on your node host to allow incomming trafic
from Prometheus host IP to the node monitoring ports.
You also need to configure UFW on the Prometheus machine to allow for outgoing traffic from the Prometheus host to the RocketPool node host.

Having node host IP `192.168.1.5` and Prometheus host IP `192.168.1.6` the UFW rules for the node will be:

```shell
sudo ufw allow from 192.168.1.6 to any port 9100:9105 proto tcp comment 'Allow Prometheus host to scrape metrics of this host'
```

And for Prometheus host:

```shell
sudo ufw allow out from any to 192.168.1.5 port 9100:9105 proto tcp comment 'Allow this host to scrape node metrics'
```

Assuming your Grafana listening port is 3100, continue reading to find out how to expose Grafana in your network.

::::::

You can then open the firewall to allow external devices access to your Grafana dashboard.

:::::: tabs
::::: tab Network
Use this if you want to access Grafana from any machine inside your local network, but deny access everywhere else.
This will be the most common use case.

Please check whether your local network uses the `192.168.1.xxx` structure first.
You may have to change the command below to match your local network's configuration if it uses a different address structure (e.g. `192.168.99.xxx`).

```shell
# This assumes your local IP structure is 192.168.1.xxx
sudo ufw allow from 192.168.1.0/24 proto tcp to any port 3100 comment 'Allow grafana from local network'
```

::::: tab Subnet
Use this if your Rocket Pool node is not connected to the same subnet as the device from which you are viewing Grafana. This may happen when your node is connected directly to your ISP's modem and the device you use to view Grafana is connected to a secondary router.

Please check whether your local network uses the `192.168.1.xxx` structure first.
You may have to change the command below to match your local network's configuration if it uses a different address structure (e.g. `192.168.99.xxx`).

```shell
# To allow any devices in the broader subnet
# for example allowing 192.168.2.20 to access
# grafana on 192.168.1.20
sudo ufw allow from 192.168.1.0/16 proto tcp to any port 3100 comment 'Allow grafana from local subnets'
```

::::: tab Anywhere
This will let you access Grafana from anywhere.
If you want to access it from outside your local network, you will still need to forward the Grafana port (default 3100) in your router settings.

```shell
# Allow any IP to connect to Grafana
sudo ufw allow 3100/tcp comment 'Allow grafana from anywhere'
```

::::::

## Setting up Grafana

Now that the metrics server is ready, you can access it with any browser on your local network.

Refer to the tabs below for your Smartnode installation mode.

Navigate to the following URL, substituting the variables with your setup as necessary:

```
http://<your node IP>:<grafana port>
```

For example, if you node's IP was `192.168.1.5` and you used the default Grafana port of `3100`, then you would go to this URL in your browser:

```
http://192.168.1.5:3100
```

You will see a login screen like this:

![](./images/grafana-login.png)

The default Grafana information is:

```
Username: admin
Password: admin
```

You will then be prompted to change the default password for the `admin` account.
Pick something strong and don't forget it!

::: tip Tip
If you lose the admin password, you can reset it using the following command on your node:

^^^^^^ nestedTabs
::::nestedTab Docker and Hybrid Mode

```shell
docker exec -it rocketpool_grafana grafana-cli admin reset-admin-password admin
```

::::nestedTab Native

```shell
sudo grafana-cli admin reset-admin-password admin
```

^^^^^^

You will be able to log into Grafana using the default `admin` credentials once again, and then you will be prompted to change the password for the `admin` account.
:::

Thanks to community member **tedsteen**'s work, Grafana will automatically connect to your Prometheus instance so it has access to the metrics that it collects.
All you need to do is grab the dashboard!

## Importing the Rocket Pool Dashboard

Now that you have Grafana attached to Prometheus, you can import the standard dashboard (or build your own using the metrics that it provides, if you are familiar with that process).

Start by going to the **Create** menu (the plus icon on the right-side bar) and click on **Import**:

![](./images/grafana-import.png)

When prompted for the dashboard ID in the **Import via grafana.com** box, enter `21047` or use the full URL ([(https://grafana.com/grafana/dashboards/21047](https://grafana.com/grafana/dashboards/21047)) and press the **Load** button.

You will be prompted with some information about the dashboard here, such as its name and where you'd like to store it (the default **General** folder is fine unless you use a lot of dashboards and want to organize them).

Under the **Prometheus** drop-down at the bottom, you should only have a single option labeled **Prometheus (default)**.
Select this option.

Your screen should look like this:

![](./images/grafana-import2.png)

If yours matches, click the **Import** button and you will be immediately taken to your new dashboard.

At first glance, you should see lots of information about your node and your validators.
Each box comes with a handy tooltip on the top left corner (the `i` icon) that you can hover over to learn more about it.
For example, here is the tooltip for the **Your Validator Share** box:

![](./images/tooltip.png)

However, we aren't done setting things up yet - there is still a little more configuration to do.

::: warning NOTE
Some of the boxes (notably the APR ones) have been temporarily disabled due to the way Shapella provides skimmed rewards.

They will be enabled again in a future version of the Smartnode that can track historical rewards properly.
:::

## Tailoring the Hardware Monitor to your System

Now that the dashboard is up, you might notice that a few boxes are empty such as **SSD Latency** and **Network Usage**.
We have to tailor the dashboard to your specific hardware so it knows how to capture these things.

### CPU Temp

To update your CPU temperature gauge, click the title of the **CPU Temp** box and select **Edit** from the drop down.
Your screen will now look something like this:

![](./images/cpu-temp.png)

This is Grafana's edit mode, where you can change what is displayed and how it looks.
We're interested in the query box highlighted in red, to the right of the **Metrics browser** button.

By default, that box has this in it:

```
node_hwmon_temp_celsius{job="node", chip="", sensor=""}
```

There are two fields in this text that are currently blank: `chip` and `sensor`.
These are unique to each machine, so you'll have to fill them in based on what your machine provides.

To do this, follow these steps:

1. Remove the `, sensor=""` portion so it ends with `chip=""}`. For clarity, the whole thing should now be `node_hwmon_temp_celsius{job="node", chip=""}`.
2. Put your cursor in-between the quote marks of `chip=""` and press `Ctrl+Spacebar`. This will bring up an auto-complete box with the available options, which looks like this:

![](./images/grafana-autocomplete.png)

3. Select the option that corresponds to your system's CPU.
4. Once that's selected, add `, sensor=""` back into the string. Place your cursor in-between the quote marks of `sensor=""` and press `Ctrl+Spacebar` to get another auto-complete menu. Select the sensor you want to monitor.

::: tip Tip
If you don't know which `chip` or `sensor` is correct, you'll have to try all of them until you find the one that looks right. To help with this, install the `lm-sensors` package (for example, `sudo apt install lm-sensors` on Debian / Ubuntu) and run the `sensors -u` command to provide what sensors your computer has. You can try to correlate a chip ID from Grafana's list with what you see here based on their names and IDs.

For example, this is one of the outputs of our `sensors -u` command:

```
k10temp-pci-00c3
Tctl:
  temp1_input: 33.500
Tdie:
  temp2_input: 33.500
```

In our case, the corresponding chip in Grafana is `pci0000:00_0000:00:18_3` and the corresponding sensor is `temp1`.
:::

Once you're happy with your selections, click the blue **Apply** button in the top right corner of the screen to save the settings.

::: warning NOTE
Not all system expose CPU temperature info - notably virtual machines or cloud-based systems.
If yours doesn't have anything in the auto-complete field for `chip`, this is probably the case and you won't be able to monitor your CPU temperature.
:::

### SSD Latency

The **SSD Latency** chart tracks how long it takes for read/write operations to take.
This is helpful in gauging how fast your SSD is, so you know if it becomes a bottleneck if your validator suffers from poor performance.
To update the SSD you want to track in the chart, click on the **SSD Latency** title and select **Edit**.

This chart has four query fields (four textboxes) with eight `device=""` portions in total.
You'll need to update the first four of these portions with the device you want to track.

Simply place your cursor in-between the quote marks and press `Ctrl+Spacebar` to get Grafana's auto-complete list, and select the correct option from there for each of the `device=""` portions.
**You want to start from the leftmost empty setting first, or the auto-complete list may not appear.**

::: tip Tip
If you don't know which device to track, run the following command:

```
lsblk
```

This will output a tree showing your device and partition list, for example:

```
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
...
loop25        7:25   0   132K  1 loop /snap/gtk2-common-themes/9
loop26        7:26   0  65,1M  1 loop /snap/gtk-common-themes/1515
nvme0n1     259:0    0 238,5G  0 disk
├─nvme0n1p1 259:1    0   512M  0 part /boot/efi
├─nvme0n1p2 259:2    0 150,1G  0 part /
├─nvme0n1p3 259:3    0  87,4G  0 part
└─nvme0n1p4 259:4    0   527M  0 part
```

If you didn't change Docker's default location to a different drive during your Smartnode installation, then the disk you want to track will be the one that your Operating System is installed on.
Look in the `MOUNTPOINT` column for an entry simply labeled `/`, then follow that back up to its parent device (the one with `disk` in the `TYPE` column).

Typically this will be `sda` for SATA drives or `nvme0n1` for NVMe drives.

If you _did_ change Docker's default location to a different drive, or if you're running a hybrid / native setup, you should be able to use the same technique of "following the mount point" to determine which device your chain data resides on.
:::

Optionally, you can also track latency of a second disk on your system.
This is aimed at people that keep their Operating System and chain data on separate drives.
To set this up, simply follow the instructions above for the last two query fields, substituting `device=""` portion values with those of the disk you want to track.

Once you're happy with your selections, click the blue **Apply** button in the top right corner of the screen to save the settings.

### Network Usage

This chart tracks how much data you're sending and receiving over a particular network connection.
As you might expect, the dashboard needs to know which network you want it to track.

To change it, click on the **Network Usage** title and select **Edit**.

This chart has two query fields with two `device=""` portions in total.
You'll need to update these with the network you want to track.

Place your cursor in-between the quote marks and press `Ctrl+Spacebar` to get Grafana's auto-complete list, and select the correct option from there for each of the `device=""` portions.

::: tip Tip
If you don't know which device to track, run the following command:

```
sudo route
```

The output will look something like this:

```
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0
192.168.1.0     0.0.0.0         255.255.255.0   U     0      0        0 eth0
192.168.1.1     0.0.0.0         255.255.255.255 UH    100    0        0 eth0
```

Look at the `Destination` column for the row with the value if `default`.
Follow that row all the way to the `Iface` column.
The device listed there is the one you want to use - in this example, `eth0`.
:::

Once you're happy with your selections, click the blue **Apply** button in the top right corner of the screen to save the settings.

### Total Net I/O

This tracks the total amount of data you've sent and received.
You might find it useful to watch if, for example, your ISP limits you to a certain amount of data per month.

The setup is identical to the **Network Usage** box above, so simply follow those instructions for this box too.

### Disk Space Used

This keeps tabs on how full your Operating System disk is getting, so you know when it's time to clean up (and if your chain data lives on the same drive, time to [prune Geth or Nethermind](./pruning)).

The steps are the same as the **SSD Latency** box above, so simply follow those instructions for this box too.
As a reminder, you want the drive that houses the partition which has `/` in the `MOUNTPOINT` column for this one because that will be your Operating System drive.
Fill this into the first query field.

Optionally, you can also track the free space of a second disk on your system.
This is aimed at people that keep their Operating System and chain data on separate drives.
Set this up by following the same process, but instead of looking at which partition has `/` in the `MOUNTPOINT` column, you want to look for the one that has whatever your second drive's mount point is.
Update the second query field with the disk associated with that partition.

### Disk Temp

This tracks the current temperature of your Operating System disk. The steps are the same as the **CPU Temp** box above, so simply follow those instructions for this box too, substituting CPU chip and sensor values with those of your Operating System disk. Fill these values into the first query field.

Optionally, you can also track the current temperature of a second disk on your system. Set this up by following the same process, substituting the chip and sensor values with those of your second drive. Fill these values into the second query field.

## Customizing the Dashboard

While the standard dashboard tries to do a good job capturing everything you'd want to see at a glance, it's quite easy to customize a Grafana dashboard however you want.
You can add new graphs, change the way graphs look, move things around, and much more!

Take a look at [Grafana's Tutorials](https://grafana.com/tutorials/) page to learn how to play with it and set it up to your liking.

## Customizing the Metrics Stack

The tools used in the Rocket Pool Metrics Stack offer a wide array of configuration options beyond what is included in the default Rocket Pool installation. This section includes configuration examples for different use cases.

In general, [Grafana configuration options](https://grafana.com/docs/grafana/latest/administration/configuration/) should be passed through using environment variables in `override/grafana.yml`. Any config option can be converted to an environment variable using the following syntax:

```
GF_<SectionName>_<KeyName>
```

### Grafana SMTP Settings for Sending Emails

To send emails from Grafana, e.g. for alerts or to invite other users, SMTP settings need to be configured in the Rocket Pool Metrics Stack.
See the [Grafana SMTP configuration](https://grafana.com/docs/grafana/latest/administration/configuration/#smtp) page for reference.

:::::: tabs
::::: tab Docker and Hybrid Mode
Open `~/.rocketpool/override/grafana.yml` in a text editor.
Add an `environment` section below the `x-rp-comment: Add your customizations below this line` line, replacing the values below with those for your SMTP provider.

```yaml
version: "3.7"
services:
  grafana:
    x-rp-comment: Add your customizations below this line
    environment:
      ## SMTP settings start, replace values with those of your SMTP provider
      - GF_SMTP_ENABLED=true
      - GF_SMTP_HOST=mail.example.com:<port> # Gmail users should use smtp.gmail.com:587
      - GF_SMTP_USER=admin@example.com
      - GF_SMTP_PASSWORD=password
      - GF_SMTP_FROM_ADDRESS=admin@example.com
      - GF_SMTP_FROM_NAME="Rocketpool Grafana Admin"
      ## SMTP server settings end
```

::::: tab Native

Open `/etc/grafana/grafana.ini` in a text editor. Look for `[smtp]` section and update it, replacing the values below with those for your SMTP provider.

```
[smtp]
enabled = true
host = mail.example.com:<port> # Gmail users should use smtp.gmail.com:587
user = admin@example.com
# If the password contains # or ; you have to wrap it with triple quotes. Ex """#password;"""
password = """passw0rd"""
from_address = admin@example.com
from_name = "Rocketpool Grafana Admin"
```

::::::

::: tip Tip
If using Gmail and [2-Step Verification](https://support.google.com/accounts/answer/185839) is enabled, create an [App Password](https://support.google.com/mail/answer/185833?hl=en) for this service.
:::

After making these modifications, **run the following to apply the changes**:

:::::: tabs
::::: tab Docker and Hybrid Mode

```shell
docker stop rocketpool_grafana

rocketpool service start
```

::::: tab Native

```shell
sudo systemctl restart grafana-server
```

::::::

To test the SMTP settings, go to the **Alerting** menu and click **Contact points**.

![](./images/grafana-contact-points.png){ style="display: block; margin: 0 auto" }

Click **New contact point** and select **Email** as the Contact point type.
Enter an email address in the **Addresses** section and click **Test**.

![](./images/grafana-new-contact-point.png){ style="display: block; margin: 0 auto" }

Check to see that the test email was received.
Click **Save contact point\*** when finished.
