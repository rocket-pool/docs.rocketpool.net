# Введение в интерфейс командной строки

Как оператор ноды, CLI является вашим основным инструментом для взаимодействия с Rocket Pool.
Вы будете использовать его для создания новых minipool, проверки статуса всех компонентов, получения периодических вознаграждений RPL, выхода и вывода средств из ваших minipool, когда будете готовы, и множества других действий.

После того как вы завершите синхронизацию Execution и Beacon блокчейнов, все команды будут доступны для использования.
В этом разделе мы кратко рассмотрим некоторые из наиболее распространенных команд и другие возможности, которые предоставляет CLI.

## Изучение команд

Чтобы просмотреть список всех доступных команд, введите:

```shell
rocketpool help
```

Вывод будет выглядеть следующим образом:

```

______           _        _    ______           _
| ___ \         | |      | |   | ___ \         | |
| |_/ /___   ___| | _____| |_  | |_/ /__   ___ | |
|    // _ \ / __| |/ / _ \ __| |  __/ _ \ / _ \| |
| |\ \ (_) | (__|   <  __/ |_  | | | (_) | (_) | |
\_| \_\___/ \___|_|\_\___|\__| \_|  \___/ \___/|_|

Authored by the Rocket Pool Core Team
A special thanks to the Rocket Pool community for all their contributions.

NAME:
   rocketpool - Rocket Pool CLI

USAGE:
   rocketpoolcli [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   auction, a   Manage Rocket Pool RPL auctions
   claims, l    View and claim all available rewards and credits across the node
   minipool, m  Manage the node's minipools
   megapool, g  Manage the node's megapool
   network, e   Manage Rocket Pool network parameters
   node, n      Manage the node
   odao, o      Manage the Rocket Pool oracle DAO
   pdao, p      Manage the Rocket Pool Protocol DAO
   queue, q     Manage the Rocket Pool deposit queue
   security, c  Manage the Rocket Pool security council
   service, s   Manage Rocket Pool service
   wallet, w    Manage the node wallet
   help, h      Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --allow-root, -r              Allow rocketpool to be run as the root user
   --config-path path, -c path   Rocket Pool config asset path (default: "~/.rocketpool")
   --daemon-path path, -d path   Interact with a Rocket Pool service daemon at a path on the host OS, running outside of docker
   --maxFee value, -f value      The max fee (including the priority fee) you want a transaction to cost, in gwei (default: 0)
   --maxPrioFee value, -i value  The max priority fee you want a transaction to use, in gwei (default: 0)
   --gasLimit value, -l value    [DEPRECATED] Desired gas limit (default: 0)
   --nonce value                 Use this flag to explicitly specify the nonce that this transaction should use, so it can override an existing 'stuck' transaction
   --debug                       Enable debug printing of API commands
   --secure-session, -s          Some commands may print sensitive information to your terminal. Use this flag when nobody can see your screen to allow sensitive data to be printed without prompting
   --help, -h                    show help
   --version, -v                 print the version

COPYRIGHT:
   (c) 2026 Rocket Pool Pty Ltd
```

## Команды сервиса

Группа команд сервиса управляет различными службами, которые управляются smart node.

Вот что покажет вывод `rocketpool service help`:

```
NAME:
   rocketpool service - Manage Rocket Pool service

USAGE:
   rocketpool service [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   install, i                 Install the Rocket Pool service
   config, c                  Configure the Rocket Pool service
   status, u                  View the Rocket Pool service status
   start, s                   Start the Rocket Pool service
   pause, p                   Pause the Rocket Pool service
   stop, o                    Pause the Rocket Pool service (alias of 'rocketpool service pause')
   reset-docker, rd           Cleanup Docker resources, including stopped containers, unused images and networks. Stops and restarts Smart Node.
   prune-docker, pd           Cleanup unused Docker resources, including stopped containers, unused images, networks and volumes. Does not restart smartnode, so the running containers and the images and networks they reference will not be pruned.
   logs, l                    View the Rocket Pool service logs
   stats, a                   (DEPRECATED) No longer supported. Use 'docker stats -a' instead
   compose                    View the Rocket Pool service docker compose config
   version, v                 View the Rocket Pool service version information
   prune-eth1, n              Shuts down the main ETH1 client and prunes its database, freeing up disk space, then restarts it when it's done.
   install-update-tracker, d  Install the update tracker that provides the available system update count to the metrics dashboard
   get-config-yaml            Generate YAML that shows the current configuration schema, including all of the parameters and their descriptions
   resync-eth1                Deletes the main ETH1 client's chain data and resyncs it from scratch. Only use this as a last resort!
   resync-eth2                Deletes the ETH2 client's chain data and resyncs it from scratch. Only use this as a last resort!
   terminate, t               Deletes all of the Rocket Pool Docker containers and volumes, including your ETH1 and ETH2 chain data and your Prometheus database (if metrics are enabled). Also removes your entire `.rocketpool` configuration folder, including your wallet, password, and validator keys. Only use this if you are cleaning up the Smart Node and want to start over!

GLOBAL OPTIONS:
   --compose-file value, -f value  Optional compose files to override the standard Rocket Pool docker compose YAML files; this flag may be defined multiple times
   --help, -h                      show help
```

### `status`

Эта команда показывает текущий статус работы каждого из Docker-контейнеров, управляемых Rocket Pool.
Например, вывод стандартной Docker-установки выглядит следующим образом:

```
        Name                       Command              State                                                       Ports
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
rocketpool_api          /bin/sleep infinity             Up
rocketpool_eth1         sh /setup/start-node.sh         Up      0.0.0.0:30303->30303/tcp,:::30303->30303/tcp, 0.0.0.0:30303->30303/udp,:::30303->30303/udp, 8545/tcp, 8546/tcp
rocketpool_eth2         sh /setup/start-beacon.sh       Up      0.0.0.0:9001->9001/tcp,:::9001->9001/tcp, 0.0.0.0:9001->9001/udp,:::9001->9001/udp
rocketpool_node         /go/bin/rocketpool node         Up
rocketpool_validator    sh /setup/start-validator.sh    Up
rocketpool_watchtower   /go/bin/rocketpool watchtower   Up
```

Вы можете использовать эту команду для быстрой проверки состояния Docker-контейнеров или для подтверждения правильности выполнения команд `start` или `stop`.

### `start` и `stop`

С этими двумя командами вы уже знакомы.
Они просто запускают все контейнеры Rocket Pool или останавливают их.

::: tip
Команда `pause` делает то же самое, что и `stop`.
Она осталась как устаревшая команда из ранних версий Rocket Pool.
:::

### `logs`

Это еще одна команда, которую вы уже должны были видеть.
Вы можете использовать ее для просмотра выходных логов каждого Docker-контейнера.
Это может быть полезно для устранения неполадок или получения более подробного отчета о их работе.

Если вы просто выполните `rocketpool service logs` без каких-либо других аргументов, логи всех контейнеров будут объединены и показаны вместе.

Если вы хотите сфокусироваться на выводе одного контейнера, вы можете добавить аргумент в конце команды, чтобы указать контейнер.
Допустимые значения: `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` и `node-exporter`.

### `stats`

Эта команда показывает статистику использования ресурсов для каждого контейнера, которую вы можете использовать для профилирования аппаратного и сетевого потребления каждого из них.

Вы можете найти ее полезной для мониторинга контейнеров, если ваша система начинает работать медленно или имеет проблемы с оперативной памятью.

Вот пример вывода:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip ПРИМЕЧАНИЕ
Статистика оперативной памяти здесь показывает **общую выделенную память**, которая включает _виртуальную_ память.
Она не показывает реальное потребление _резидентной_ памяти.

Аналогично, использование процессора показывает общий объем потребления CPU, усредненный по всем ядрам процессора, которые использует контейнер.
Здесь процессор для ETH2 показывает почти 100%, потому что используется Nimbus, который является однопоточным.

Вы можете обнаружить, что программа типа `htop` или `btop` предоставляет лучшее понимание фактического потребления ресурсов.
:::

### `config`

Эта команда повторно запускает процесс настройки конфигурации.
Вы можете использовать ее, если хотите изменить выбор Execution или Consensus клиента, или изменить некоторые параметры, которые вы изначально указали при их выборе (например, сообщение граффити вашего валидатора, максимальное количество подключений и так далее).

Вы можете вызывать эту команду в любое время, но изменения вступят в силу только после вызова `rocketpool service stop` и `rocketpool service start`.

### `terminate`

Эта команда остановит Docker-контейнеры, затем удалит их, удалит виртуальную сеть Rocket Pool и удалит тома с данными блокчейна ETH1 и ETH2.
По сути, она удаляет все элементы Rocket Pool из вашей установки Docker.
Используйте ее, когда хотите очистить эту часть установки Rocket Pool.

::: warning
Это безвозвратно удалит ваши данные блокчейна, что означает, что вам придется снова синхронизировать ETH1 и ETH2.

Это **не** удалит ваши файлы кошелька и пароля, настроенные параметры или ключи валидаторов.
Чтобы удалить их, вам нужно будет удалить папку `~/.rocketpool/data` в Docker или Hybrid Mode, или соответствующую директорию в Native Mode.
:::

## Команды ноды

Группа команд `node` управляет операциями вашей ноды Rocket Pool.
Мы рассмотрим их более подробно в следующем разделе, где создадим minipool, но полезно увидеть их все сразу.

Вот что покажет вывод `rocketpool node help`:

```
NAME:
   rocketpool node - Manage the node

USAGE:
   rocketpool node command [command options] [arguments...]

COMMANDS:
   status, s                                     Get the node's status
   sync, y                                       Get the sync progress of the eth1 and eth2 clients
   register, r                                   Register the node with Rocket Pool
   rewards, e                                    Get the time and your expected RPL rewards of the next checkpoint
   set-primary-withdrawal-address, w             Set the node's primary withdrawal address, which will receive all ETH rewards (and RPL if the RPL withdrawal address is not set)
   confirm-primary-withdrawal-address, f         Confirm the node's pending primary withdrawal address if it has been set back to the node's address itself
   set-rpl-withdrawal-address, srwa              Set the node's RPL withdrawal address, which will receive all RPL rewards and staked RPL withdrawals
   confirm-rpl-withdrawal-address, crwa          Confirm the node's pending rpl withdrawal address if it has been set back to the node's address itself
   allow-rpl-locking, arl                        Allow the node to lock RPL when creating governance proposals/challenges
   deny-rpl-locking, drl                         Do not allow the node to lock RPL when creating governance proposals/challenges
   set-timezone, t                               Set the node's timezone location
   swap-rpl, p                                   Swap old RPL for new RPL
   stake-rpl, k                                  Stake RPL against the node
   add-address-to-stake-rpl-whitelist, asw       Adds an address to your node's RPL staking whitelist, so it can stake RPL on behalf of your node.
   remove-address-from-stake-rpl-whitelist, rsw  Removes an address from your node's RPL staking whitelist, so it can no longer stake RPL on behalf of your node.
   claim-rewards, c                              Claim available RPL and ETH rewards for any checkpoint you haven't claimed yet
   withdraw-rpl, i                               Withdraw RPL staked against the node
   withdraw-eth, h                               Withdraw ETH staked on behalf of the node
   withdraw-credit, wc                           (Saturn) Withdraw ETH credit from the node as rETH
   deposit, d                                    Make a deposit and create a minipool
   create-vacant-minipool, cvm                   Create an empty minipool, which can be used to migrate an existing solo staking validator as part of the 0x00 to 0x01 withdrawal credentials upgrade
   send, n                                       Send ETH or tokens from the node account to an address. ENS names supported. Use 'all' as the amount to send the entire balance. <token> can be 'rpl', 'eth', 'fsrpl' (for the old RPL v1 token), 'reth', or the address of an arbitrary token you want to send (including the 0x prefix).
   set-voting-delegate, sv                       (DEPRECATED) Use `rocketpool pdao set-signalling-address` instead
   clear-voting-delegate, cv                     (DEPRECATED) Use `rocketpool pdao clear-signalling-address` instead
   initialize-fee-distributor, z                 Create the fee distributor contract for your node, so you can withdraw priority fees and MEV rewards after the merge
   distribute-fees, b                            Distribute the priority fee and MEV rewards from your fee distributor to your withdrawal address and the rETH contract (based on your node's average commission)
   join-smoothing-pool, js                       Opt your node into the Smoothing Pool
   leave-smoothing-pool, ls                      Leave the Smoothing Pool
   sign-message, sm                              Sign an arbitrary message with the node's private key
   send-message                                  Send a zero-ETH transaction to the target address (or ENS) with the provided hex-encoded message as the data payload
   claim-unclaimed-rewards, cur                  Sends any unclaimed rewards to the node's withdrawal address
   provision-express-tickets, pet                Provision the node's express tickets

OPTIONS:
   --help, -h  show help
```

Ниже приведено краткое описание некоторых команд, которые вам понадобятся во время обычной работы ноды.

### `status`

Эта команда даст вам общий обзор всей вашей ноды с первого взгляда.
Она включает информацию о том, сколько ETH и RPL вы застейкали, сколько у вас minipool и их статусы, ваш коэффициент обеспечения RPL и многое другое.

Вот пример того, что показывает `rocketpool node status` после регистрации вашей ноды и настройки некоторых minipool:

```
=== Account and Balances ===
The node 0x4d19DE4A5a1B1B36EBaB3D5c32C01061fbDE328d has a balance of 49.402553 ETH and 0.000000 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new validators.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Megapool ===
The node has a megapool deployed at 0xCf3576c5A6e5a25AC00C9adb6751924BAe1680B1.
The megapool has 9 validators.
The node has 0 express queue ticket(s).

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit https://docs.rocketpool.net/pdao/participate#setting-your-snapshot-signalling-address.
Rocket Pool has no Snapshot governance proposals being voted on.

=== Onchain Voting ===
The node doesn't have a delegate, which means it can vote directly on onchain proposals. You can have another node represent you by running `rocketpool p svd <address>`.
The node is NOT allowed to lock RPL to create governance proposals/challenges.

=== Primary Withdrawal Address ===
The node's primary withdrawal address has not been changed, so ETH rewards and minipool withdrawals will be sent to the node itself.
Consider changing this to a cold wallet address that you control using the `set-withdrawal-address` command.

=== RPL Withdrawal Address ===
The node's RPL withdrawal address has not been set. All RPL rewards will be sent to the primary withdrawal address.

=== Fee Distributor and Smoothing Pool ===
The node's fee distributor 0x84c1f488CDecb2E335c40901E3Fe58925f4cC9A7 has a balance of 0.004897 ETH.
NOTE: You are in Native Mode; you MUST ensure that your Validator Client is using this address as its fee recipient!
The node is not opted into the Smoothing Pool.
To learn more about the Smoothing Pool, please visit https://docs.rocketpool.net/upgrades/redstone/whats-new#smoothing-pool.
You have 3 minipools that would earn extra commission if you opted into the smoothing pool!
See https://rpips.rocketpool.net/RPIPs/RPIP-62 for more information about bonus commission, or run `rocketpool node join-smoothing-pool` to opt in.

=== RPL Stake ===
NOTE: The following figures take *any pending bond reductions* into account.

The node has a total stake of 20000.000000 RPL.
This is currently 3.74% of its borrowed ETH and 30.06% of its bonded ETH.
The node has 0.000000 megapool staked RPL.
The node has 20000.000000 legacy staked RPL.
The node has a total stake (legacy minipool RPL plus megapool RPL) of 20000.000000 RPL.
You have 0.000000 RPL staked on your megapool and can request to unstake up to 0.000000 RPL

=== Minipools ===
The node has a total of 3 active minipool(s):
- 3 staking
```

### `sync`

Эта команда покажет вам текущий статус синхронизации ваших Execution и Consensus клиентов.
Вы, вероятно, будете использовать ее часто, когда впервые настраиваете ноду, а затем больше не будете нуждаться в ней (если только не измените или не сбросите свои клиенты).

Вывод `rocketpool node sync` будет выглядеть следующим образом:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Обратите внимание, что **Prysm** в настоящее время не предоставляет процент завершения — вам нужно будет посмотреть логи `eth2`, если вы его используете.

### `stake-rpl`

Эта команда используется, когда вы хотите добавить больше RPL в качестве обеспечения для вашей ноды.
Это увеличит ваш коэффициент обеспечения, что увеличит ваши вознаграждения RPL на каждом контрольном пункте (об этом подробнее позже).

В отличие от других команд, эта является _интерактивной_, потому что она запустит транзакцию — она не просто информационная.

Сначала она спросит, сколько RPL вы хотите застейкать, с несколькими предопределенными вариантами для удобства или возможностью указать пользовательскую сумму:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

После выбора варианта вам будет показана информация о рекомендуемой цене газа и предполагаемой сумме, которая будет использована, вместе с диалогом подтверждения. Если это ваш первый раз стейкинга RPL на ноде, вам нужно будет дать контракту стейкинга разрешение на взаимодействие с вашим RPL:

```
Before staking RPL, you must first give the staking contract approval to interact with your RPL.
This only needs to be done once for your node.
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0001 to 0.0001 ETH |
| 1 Minute      | 4 gwei    | 0.0001 to 0.0001 ETH |
| 3 Minutes     | 4 gwei    | 0.0001 to 0.0001 ETH |
| >10 Minutes   | 4 gwei    | 0.0001 to 0.0001 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Do you want to let the staking contract interact with your RPL? [y/n]
y

Approving RPL for staking...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully approved staking access to RPL.
RPL Stake Gas Info:
+============== Suggested Gas Prices ==============+
| Avg Wait Time |  Max Fee  |    Total Gas Cost    |
| 15 Seconds    | 4 gwei    | 0.0005 to 0.0007 ETH |
| 1 Minute      | 4 gwei    | 0.0005 to 0.0007 ETH |
| 3 Minutes     | 4 gwei    | 0.0005 to 0.0007 ETH |
| >10 Minutes   | 4 gwei    | 0.0005 to 0.0007 ETH |
+==================================================+

These prices include a maximum priority fee of 2.00 gwei.
Please enter your max fee (including the priority fee) or leave blank for the default of 4 gwei:

Using a max fee of 4.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to stake 733.993925 RPL? You will not be able to unstake this RPL until you exit your validators and close your minipools, or reach 2201.981777 staked RPL (15% of bonded eth)! [y/n]
```

Если вы подтвердите, вам будет показан хэш транзакции и предоставлена ссылка на [Etherscan](https://etherscan.io), чтобы вы могли следить за ее прогрессом:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

Большинство операций требует только одной транзакции, поэтому CLI будет ждать, пока она не будет включена в блок, а затем завершится. Однако stake-rpl — это одна из немногих команд, которая требует двух транзакций, поэтому этот диалог появится дважды.

### `claim-rewards`

Когда ваша нода обнаружит новый контрольный пункт вознаграждений, она автоматически загрузит файл дерева вознаграждений с информацией для этого интервала (если вы используете режим загрузки по умолчанию — см. ниже информацию о генерации собственных деревьев вместо их загрузки).
Затем вы можете просмотреть свои вознаграждения с помощью следующей команды:

```
rocketpool node claim-rewards
```

По мере того как проходят интервалы и вы накапливаете вознаграждения, вывод будет выглядеть следующим образом:

![](../node-staking/images/claim-rewards-gb.png)

Здесь вы можете быстро увидеть, сколько вознаграждений вы заработали на каждом интервале, и решить, какие из них вы хотите забрать.

Вы также можете указать сумму, которую хотите перестейкать во время этого получения:

![](../node-staking/images/autostake.png)

Это позволит вам объединить ваши вознаграждения RPL в одной транзакции, используя значительно меньше газа, чем вам в настоящее время требовалось использовать с устаревшей системой получения.

::: tip ПРИМЕЧАНИЕ
Если вы предпочитаете создавать контрольный пункт вознаграждений вручную вместо загрузки того, который создан Oracle DAO, вы можете изменить эту настройку с `Download` на `Generate` в TUI:

![](../node-staking/images/tui-generate-tree.png)

Как подразумевает подсказка, вам понадобится доступ к архивной ноде Execution клиента, чтобы сделать это.
Если ваш локальный Execution клиент не является архивной нодой, вы можете указать отдельную (например, Infura или Alchemy) в `Archive-Mode EC URL` ниже в том же меню.
Этот URL будет использоваться только при генерации деревьев Merkle; он не будет использоваться для обязанностей валидации.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Это зарегистрирует вас как участника в контрактах Rocket Pool и автоматически изменит `fee recipient` вашего Validator Client с контракта-дистрибьютора вашей ноды на контракт Smoothing Pool.

Обратите внимание, что после регистрации есть **28-дневный период ожидания** (длина одного полного интервала вознаграждений), прежде чем вы сможете выйти.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Это выведет вас из Smoothing Pool, если вы в настоящее время зарегистрированы и подождали не менее 28 дней после регистрации.
После того как **следующая эпоха после текущей эпохи** будет завершена, это автоматически изменит `fee recipient` вашей ноды из Smoothing Pool обратно на контракт-дистрибьютор вашей ноды.
Это сделано для того, чтобы вы не получили штраф за опережение процесса выхода, когда увидите, что у вас предстоит предложение.

### `distribute-fees`

Когда ваш дистрибьютор инициализирован, вы можете забрать и распределить весь его баланс с помощью следующей команды:

```shell
rocketpool node distribute-fees
```

Это отправит вашу долю вознаграждений на ваш **адрес вывода средств**.

### `send`

Эта команда позволяет отправить ETH, RPL или другие токены, связанные с Rocket Pool, с кошелька ноды на другой адрес.
Это может быть полезно, если вы хотите переместить свои средства в кошельке в другое место.

Синтаксис использования команды `send` следующий:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Аргументы следующие:

- `<amount>` — количество токенов для отправки.
- `<token>` — токен для отправки — это может быть `eth`, `rpl`, `fsrpl` (старый устаревший токен RPL) или `reth`.
- `<address or ENS name>` — адрес Ethereum (или имя ENS), на который нужно отправить токены.

Например:

```shell
rocketpool node send 1 eth <my friend's address>
```

отправит 1 ETH моему другу.

## Команды Megapool

Группа команд `megapool` предоставляет доступ ко всем командам для управления вашим megapool и валидаторами megapool.

Вот что покажет `rocketpool megapool help`:

```
NAME:
   rocketpool megapool - Manage the node's megapool

USAGE:
   rocketpool megapool [global options] command [command options] [arguments...]

VERSION:
   1.19.1

COMMANDS:
   deposit, d                Make a deposit and create a new validator on the megapool. Optionally specify count to make multiple deposits.
   status, s                 Get the node's megapool status
   validators, v             Get a list of the megapool's validators
   repay-debt, r             Repay megapool debt
   reduce-bond, e            Reduce the megapool bond
   claim, c                  Claim any megapool rewards that were distributed but not yet claimed
   stake, k                  Stake a megapool validator
   exit-queue, x             Exit the megapool queue
   dissolve-validator, i     Dissolve a megapool validator
   exit-validator, t         Request to exit a megapool validator
   notify-validator-exit, n  Notify that a validator exit is in progress
   notify-final-balance, f   Notify that a validator exit has completed and the final balance has been withdrawn
   distribute, b             Distribute any accrued execution layer rewards sent to this megapool

GLOBAL OPTIONS:
   --help, -h  show help
```

Ниже приведено краткое описание команд, которые вы обычно будете использовать во время нормальной работы:

### `deposit`

Эта команда позволяет создавать новые валидаторы в вашем megapool. Мы рассмотрим ее подробнее позже. Вы можете сразу перейти к разделу [Создание валидатора Megapool](/node-staking/megapools/create-megapool-validator.mdx), если хотите предварительный просмотр.

### `status`

Эта команда предоставляет информацию о состоянии вашего megapool и валидаторов, управляемых вашим megapool. Вы сможете увидеть адрес вашего megapool, количество экспресс-билетов очереди, адрес делегата megapool, баланс ETH на уровне Execution и Consensus и много другой полезной информации. Вот пример вывода `rocketpool megapool status`:

```
=== Megapool ===
The node has a megapool deployed at 0xCf3576c5A6e5a25AC00C9adb6751924BAe1680B1
The node has 0 express ticket(s).
The megapool has 9 validators.

=== Megapool Delegate ===
The megapool is using the latest delegate.
The megapool's effective delegate address is 0x138602A95956995280f1146aA9477d6B4E481B3c
The megapool has automatic delegate upgrades disabled. You can toggle this setting using 'rocketpool megapool set-use-latest-delegate'.

=== Megapool Balance ===
The megapool has 4.000000 node bonded ETH.
The megapool has 28.000000 RP ETH for a total of 32.000000 bonded ETH.
Megapool balance (EL): 32.051883 ETH
The megapool has 1 validators exiting. You'll be able to see claimable rewards once the exit process is completed.
Beacon balance (CL): 0.000000 ETH
Your portion: 0.000000 ETH
Current network commission: 5.000000%
```

### `validators`

Команда `rocketpool megapool validators` покажет вам статус каждого валидатора, управляемого megapool вашей ноды. Вы сможете увидеть информацию, такую как публичные ключи валидаторов, состояние в Beacon Chain и позицию в очереди для валидаторов в состоянии предварительного стейкинга:

```
There are 8 validator(s) on the express queue.
There are 2 validator(s) on the standard queue.
The express queue rate is 2.

1 Staking validator(s):

Megapool Validator ID:        1
Validator pubkey:             <pubkey>
Validator active:             no
Validator index:              <index>
Beacon status:                pending_queued
Express Ticket Used:          no


1 Initialized validator(s):

--------------------

Megapool Validator ID:        2
Expected pubkey:              <pubkey>
Validator active:             no
Validator Queue Position:     10
Express Ticket Used:          no


1 Exiting validator(s):

--------------------

Megapool Validator ID:        0
Validator pubkey:             <pubkey>
Validator active:             no
Validator index:              <index>
Beacon status:                withdrawal_done
Express Ticket Used:          yes

```

### `exit-validator`

Эта команда позволяет выбрать валидатор для добровольного выхода из Beacon Chain. Используйте ее, когда хотите закрыть валидатор и вывести его окончательный баланс ETH. Обратите внимание, что это нельзя отменить — как только вы запустите выход, валидатор будет остановлен навсегда.

## Команды Minipool

Группа команд `minipool` управляет операциями ваших minipool.
Как и в случае с группой `node`, мы рассмотрим их более подробно в следующем разделе, но полезно увидеть их все сейчас.

Вот что покажет вывод `rocketpool minipool help`:

```
NAME:
   rocketpool minipool - Manage the node's minipools

USAGE:
   rocketpool minipool command [command options] [arguments...]

COMMANDS:
   status, s                  Get a list of the node's minipools
   stake, t                   Stake a minipool after the scrub check, moving it from prelaunch to staking.
   set-withdrawal-creds, swc  Convert the withdrawal credentials for a migrated solo validator from the old 0x00 value to the minipool address. Required to complete the migration process.
   import-key, ik             Import the externally-derived key for a minipool that was previously a solo validator, so the Smart Node's VC manages it instead of your externally-managed VC.
   promote, p                 Promote a vacant minipool after the scrub check, completing a solo validator migration.
   refund, r                  Refund ETH belonging to the node from minipools
   begin-bond-reduction, bbr  Begins the ETH bond reduction process for a minipool, taking it from 16 ETH down to 8 ETH (begins conversion of a 16 ETH minipool to an LEB8)
   reduce-bond, rb            Manually completes the ETH bond reduction process for a minipool from 16 ETH down to 8 ETH once it is eligible. Please run `begin-bond-reduction` first to start this process.
   distribute-balance, d      Distribute a minipool's ETH balance between your withdrawal address and the rETH holders.
   exit, e                    Exit staking minipools from the beacon chain
   close, c                   Withdraw any remaining balance from a minipool and close it
   delegate-upgrade, u        Upgrade a minipool's delegate contract to the latest version
   find-vanity-address, v     Search for a custom vanity minipool address
   rescue-dissolved, rd       Manually deposit ETH into the Beacon deposit contract for a dissolved minipool, activating it on the Beacon Chain so it can be exited.

OPTIONS:
   --help, -h  show help
```

Ниже приведено краткое описание команд, которые вы обычно будете использовать.

### `status`

Эта команда просто предоставляет сводку каждого из ваших minipool.
Она включает его текущий статус, адрес eth1 minipool, комиссию на нем (называемую `node fee`), публичный ключ соответствующего валидатора ETH2 и некоторые другие вещи:

```
$ rocketpool minipool status

1 Staking minipool(s):

--------------------

Address:                <minipool eth1 address>
Penalties:             0
Status updated:        2025-07-15, 08:31 +0000 UTC
Node fee:              5.000000%
Node deposit:          8.000000 ETH
RP ETH assigned:       2025-07-14, 20:26 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.064202 ETH
Your portion:          0.018458 ETH
Available refund:      0.000000 ETH
Total EL rewards:      0.018458 ETH
Validator pubkey:      <validator eth2 address>
Validator index:       <validator eth2 index>
Validator active:      yes
Beacon balance (CL):   32.000347 ETH
Your portion:          8.000099 ETH
Use latest delegate:   no
Delegate address:      0x56903694d881282D33ed0643EAe14263880Dd47F
Rollback delegate:     <none>
Effective delegate:    0x56903694d881282D33ed0643EAe14263880Dd47F
```

### `refund`

Эта команда позволяет вернуть 16 ETH из minipool, если вы внесли 32 ETH для его создания, как только Rocket Pool сможет внести 16 ETH из пула стейкинга rETH.

### `exit`

Эта команда подает добровольный выход для вашего валидатора в Beacon Chain.
Используйте это, когда хотите закрыть валидатор и вывести его окончательный баланс ETH.
Обратите внимание, что **это нельзя отменить** — как только вы запустите выход, валидатор будет остановлен навсегда.

## Полезные флаги

Есть несколько полезных глобальных флагов, которые вы можете добавить к некоторым из вышеуказанных команд, которыми вы можете воспользоваться.

### Установка пользовательской максимальной комиссии или приоритетной комиссии (цены газа)

Начиная с [лондонского хардфорка ETH1](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) в июле 2021 года, транзакции Ethereum больше не используют единую цену газа для своих транзакций.
Вместо этого современные транзакции Ethereum используют два значения:

- **Максимальная комиссия**, которая описывает абсолютную максимальную цену газа, которую вы готовы принять для транзакции
- **Максимальная приоритетная комиссия**, которая описывает максимальную сумму, которую вы готовы «дать на чай» майнеру за включение вашей транзакции в блок

::: tip СОВЕТ
Способ работы этих двух значений может быть несколько запутанным, поэтому вот несколько простых примеров.

Допустим, текущая комиссия сети, называемая **базовой комиссией**, составляет 50 gwei.
Вы отправляете транзакцию с **максимальной комиссией 80 gwei** и приоритетной комиссией **2 gwei**.

Поскольку базовая комиссия сети ниже вашей максимальной комиссии, эта транзакция может быть включена в текущий блок.
Она будет стоить вам **50 gwei** за базовую комиссию и **2 gwei** за приоритетную комиссию; хотя вы установили максимальную комиссию 80, **это будет стоить вам всего 52 gwei**.

В качестве другого примера, скажем, у вас есть та же транзакция, но теперь базовая комиссия сети составляет **100 gwei**.
Поскольку 100 gwei больше вашей максимальной комиссии 80 gwei, ваша транзакция **не будет** включена в этот блок.
Вместо этого она просто будет находиться в пуле транзакций, пока базовая комиссия не станет достаточно низкой, чтобы ее включить.

Теперь предположим, что текущая базовая комиссия снова составляет **50 gwei**, а ваша транзакция имеет максимальную комиссию **80** gwei и приоритетную комиссию **4 gwei**.
Она будет выполнена с общей стоимостью **54 gwei**.
Приоритетная комиссия в 4 gwei гарантирует, что она будет включена раньше всех транзакций с более низкой приоритетной комиссией.

Если вы **действительно** хотите, чтобы транзакция прошла любой ценой, вы можете установить приоритетную комиссию равной максимальной комиссии.
Это эмулирует устаревшее поведение газа, поэтому ваша транзакция будет использовать весь газ, который вы ей дадите — независимо от того, ниже ли базовая комиссия сети вашей максимальной комиссии или нет.
:::

По умолчанию Rocket Pool будет использовать оракул для просмотра текущего пула транзакций и предложения разумной максимальной комиссии для любых транзакций, которые вы запускаете.
Он использует [EtherChain](https://etherchain.org/tools/gasnow) в качестве основного предложения оракула и [Etherscan](https://etherscan.io/gastracker) в качестве резервного.

Если вы предпочитаете, вы можете установить пользовательскую максимальную комиссию (в gwei), которую вы готовы заплатить, с помощью флага `-f`.
Вы также можете установить пользовательскую приоритетную комиссию с помощью флага `-i`.

Для этого добавьте их после `rocketpool` и перед другой информацией команды.

Например, вызов `node set-timezone` с этим флагом предоставит следующий вывод:

```
$ rocketpool -f 10 node set-timezone

Would you like to detect your timezone automatically? [y/n]
n

Please enter a timezone to register with in the format 'Country/City':
Australia/Brisbane

You have chosen to register with the timezone 'Australia/Brisbane', is this correct? [y/n]
y

Using the requested max fee of 10.00 gwei (including a max priority fee of 2.00 gwei).
Total cost: 0.0005 to 0.0007 ETH
Are you sure you want to set your timezone? [y/n]
```

Это показывает, что независимо от того, какую максимальную комиссию рекомендует сеть, она будет использовать вашу пользовательскую максимальную комиссию в 10 gwei (и приоритетную комиссию, если вы ее укажете) при отправке этой транзакции.

::: warning ПРИМЕЧАНИЕ
Если вы устанавливаете ручную максимальную комиссию, мы настоятельно рекомендуем вам использовать сторонний оракул цен на газ, такой как [EtherChain](https://etherchain.org/tools/gasnow), чтобы определить, достаточно ли высока эта комиссия для текущих условий сети, прежде чем отправлять транзакцию.
:::

### Отмена / перезапись застрявшей транзакции

Иногда вы можете столкнуться со сценарием, когда вы отправили транзакцию в сеть, но использовали цену газа, которая слишком низка для условий сети, и она будет выполняться непомерно долго.
Поскольку все ваши последующие транзакции будут ждать, пока эта пройдет, эта транзакция фактически блокирует все операции на вашей ноде Rocket Pool.
Чтобы справиться с этой ситуацией, мы добавили глобальный флаг, который позволяет вам «отменить» такую транзакцию, заменив ее чем-то другим.

Каждый кошелек Ethereum, включая кошелек вашей ноды, отправляет транзакции последовательно.
Каждая транзакция, которую вы отправляете, имеет номер, называемый `nonce`, который определяет, где она находится в этой последовательности.
Самая первая транзакция, которую вы отправите, будет иметь `nonce` 0, следующая, которую вы отправите, будет иметь `nonce` 1, и так далее.

Эта техника перезаписи включает отправку _новой_ транзакции, которая использует тот же `nonce`, что и ваша существующая _застрявшая_ транзакция, но в идеале будет включать более высокую цену газа, чем застрявшая.
Это означает, что новая будет добыта первой.
Как только она будет добыта в блок, старая будет отброшена из сети, как будто ее никогда не отправляли.

Чтобы использовать этот флаг, вам сначала нужно найти `nonce` вашей застрявшей транзакции:

1. Перейдите в обозреватель блоков ETH1, такой как [https://etherscan.io](https://etherscan.io).
1. Перейдите к адресу вашего кошелька и посмотрите на список транзакций.
1. Пройдите по ним, начиная с самой последней, пока не найдете самую нижнюю в списке, которая имеет состояние `Pending`.
1. Отметьте `nonce` этой транзакции. Это то, что вам понадобится.

Получив его, просто вызовите любую транзакцию с CLI, используя флаги `--nonce <value> -i 2.2` после `rocketpool` и перед остальной частью команды.

::: warning ПРИМЕЧАНИЕ
Вы **должны** включить флаг `-i` (приоритетная комиссия), чтобы перезаписать предыдущую транзакцию.
Это число должно быть как минимум на 10% выше, чем любая приоритетная комиссия, использованная вашей старой транзакцией.
Smartnode использует приоритетную комиссию 2 gwei по умолчанию, поэтому значения `2.2` обычно достаточно для переопределения.

Если ваша старая транзакция использовала пользовательскую комиссию (скажем, 10 gwei), вам нужно будет установить ее как минимум на 10% выше в переопределяющей транзакции (в этом примере 11 gwei).
:::

Например, скажем, я отправил транзакцию с `nonce` 10 и максимальной комиссией 20 gwei, но текущая комиссия сети составляет 100 gwei, поэтому моя транзакция застряла.
Чтобы исправить это, я отправлю транзакцию, в которой отправлю небольшое количество ETH от себя обратно себе с более высокой максимальной комиссией (скажем, 150 gwei) и более высокой приоритетной комиссией.
Я потрачу немного газа, делая это, но это разблокирует сломанную транзакцию:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

Стек Smartnode автоматически проверит, что предоставленный вами `nonce` действителен (он относится к ожидающей транзакции), прежде чем отправлять его и случайно тратить ваш газ.
Если нет, он вернет сообщение об ошибке.
В противном случае он пройдет и предоставит вам детали транзакции, чтобы вы могли отслеживать ее, чтобы подтвердить, что она действительно перезаписала вашу старую застрявшую транзакцию.

Вот и все для общих команд CLI.
В следующем разделе мы пройдем через процесс создания minipool и начало валидации в Beacon Chain.
