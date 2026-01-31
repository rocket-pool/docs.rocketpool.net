# Введение в интерфейс командной строки

Как оператор узла, CLI является вашим основным инструментом для взаимодействия с Rocket Pool.
Вы будете использовать его для создания новых минипулов, проверки состояния всего, получения периодических вознаграждений RPL, выхода и вывода средств из ваших минипулов, когда вы будете готовы, и множества других действий.

После того, как вы завершите синхронизацию цепей Execution и Beacon, все команды будут доступны для использования.
В этом разделе мы пройдёмся по краткому обзору некоторых из наиболее распространённых и других трюков, которые может делать CLI.

## Изучение команд

Чтобы перечислить все доступные команды, введите:

```shell
rocketpool help
```

Вывод будет выглядеть так:

```
NAME:
   rocketpool - Rocket Pool CLI

USAGE:
   rocketpool [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   auction, a   Manage Rocket Pool RPL auctions
   minipool, m  Manage the node's minipools
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
   (c) 2025 Rocket Pool Pty Ltd
```

## Команды Service

Группа service включает управление различными сервисами, которыми управляет smart node для вас.

Вот что покажет вывод `rocketpool service help`:

```
NAME:
   rocketpool service - Manage Rocket Pool service

USAGE:
   rocketpool service [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   install, i                 Install the Rocket Pool service
   config, c                  Configure the Rocket Pool service
   status, u                  View the Rocket Pool service status
   start, s                   Start the Rocket Pool service
   pause, p                   Pause the Rocket Pool service
   stop, o                    Pause the Rocket Pool service (alias of 'rocketpool service pause')
   reset-docker, rd           Cleanup Docker resources, including stopped containers, unused images and networks. Stops and restarts Smartnode.
   prune-docker, pd           Cleanup unused Docker resources, including stopped containers, unused images, networks and volumes. Does not restart smartnode, so the running containers and the images and networks they reference will not be pruned.
   logs, l                    View the Rocket Pool service logs
   stats, a                   View the Rocket Pool service stats
   compose                    View the Rocket Pool service docker compose config
   version, v                 View the Rocket Pool service version information
   prune-eth1, n              Shuts down the main ETH1 client and prunes its database, freeing up disk space, then restarts it when it's done.
   install-update-tracker, d  Install the update tracker that provides the available system update count to the metrics dashboard
   get-config-yaml            Generate YAML that shows the current configuration schema, including all of the parameters and their descriptions
   resync-eth1                Deletes the main ETH1 client's chain data and resyncs it from scratch. Only use this as a last resort!
   resync-eth2                Deletes the ETH2 client's chain data and resyncs it from scratch. Only use this as a last resort!
   terminate, t               Deletes all of the Rocket Pool Docker containers and volumes, including your ETH1 and ETH2 chain data and your Prometheus database (if metrics are enabled). Also removes your entire `.rocketpool` configuration folder, including your wallet, password, and validator keys. Only use this if you are cleaning up the Smartnode and want to start over!

GLOBAL OPTIONS:
   --compose-file value, -f value  Optional compose files to override the standard Rocket Pool docker compose YAML files; this flag may be defined multiple times
   --help, -h                      show help
```

### `status`

Эта команда показывает вам текущий статус работы каждого из Docker-контейнеров, управляемых Rocket Pool.
Например, вывод установки Docker по умолчанию выглядит так:

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

Вы можете использовать её для быстрой проверки, есть ли у какого-либо из Docker-контейнеров проблемы, или чтобы убедиться, что команда `start` или `stop` сработала корректно.

### `start` и `stop`

Эти две команды вы уже знаете.
Они просто запускают все контейнеры Rocket Pool или останавливают их.

::: tip
Команда `pause` делает то же самое, что и `stop`.
Это просто устаревшая команда из более ранних версий Rocket Pool.
:::

### `logs`

Эту команду вы также уже должны были видеть.
Вы можете использовать её для просмотра журналов вывода каждого Docker-контейнера.
Это может быть полезно для устранения неполадок или получения более подробного отчёта о статусе от них.

Если вы просто выполните `rocketpool service logs` без каких-либо других аргументов, она объединит все журналы вместе и покажет их вам сразу.

Если вы хотите сосредоточиться на выводе одного контейнера, вы можете добавить аргумент в конец, чтобы указать контейнер.
Допустимые значения: `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` и `node-exporter`.

### `stats`

Эта команда показывает вам некоторую статистику использования ресурсов каждым из контейнеров, которую вы можете использовать для профилирования аппаратного и сетевого потребления каждого из них.

Вы можете найти её полезной для мониторинга контейнеров, если ваша система начинает работать медленно или имеет проблемы с RAM.

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
Статистика RAM здесь показывает **общую выделенную память**, которая включает _виртуальную_ память.
Она не показывает сырое потребление _резидентной_ памяти.

Аналогично, использование CPU показывает общее количество потребления CPU, усреднённое по всем ядрам CPU, которые использует контейнер.
Здесь CPU для ETH2 показывает почти 100%, потому что использует Nimbus, который является однопоточным.

Вы можете обнаружить, что программа вроде `htop` или `btop` предлагает лучшее представление о фактическом потреблении ресурсов.
:::

### `config`

Эта команда снова запускает интервью конфигурации.
Вы можете использовать её, если хотите изменить свой выбор клиента Execution или Consensus, или изменить некоторые параметры, которые вы изначально указали при их выборе (такие как сообщение граффити вашего валидатора, максимальное количество пиров для подключения и так далее).

Вы можете вызывать эту команду в любое время, но изменения не вступят в силу, пока вы не вызовете `rocketpool service stop` и `rocketpool service start`.

### `terminate`

Эта команда остановит Docker-контейнеры, затем удалит их, удалит виртуальную сеть Rocket Pool и удалит тома данных цепей ETH1 и ETH2.
Она по сути удаляет все элементы Rocket Pool из вашей установки Docker.
Используйте её, когда хотите очистить эту часть установки Rocket Pool.

::: warning
Это необратимо удалит ваши данные цепи, что означает, что вам нужно будет снова синхронизировать ETH1 и ETH2.

Это **не** удалит ваши файлы кошелька и пароля, ваши настроенные параметры или ваши ключи валидатора.
Чтобы удалить их, вам нужно будет удалить папку `~/.rocketpool/data` в режиме Docker или Hybrid Mode, или соответствующий каталог в Native Mode.
:::

## Команды Node

Группа `node` включает операции с вашим узлом Rocket Pool.
Мы рассмотрим их более подробно в следующем разделе, где мы создаём минипул, но может быть полезно увидеть их все сразу.

Вот что покажет вывод `rocketpool node help`:

```
NAME:
   rocketpool node - Manage the node

USAGE:
   rocketpool node [global options] command [command options] [arguments...]

VERSION:
   1.17.2

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
   deposit, d                                    Make a deposit and create a minipool
   create-vacant-minipool, cvm                   Create an empty minipool, which can be used to migrate an existing solo staking validator as part of the 0x00 to 0x01 withdrawal credentials upgrade
   send, n                                       Send ETH or tokens from the node account to an address. ENS names supported. <token> can be 'rpl', 'eth', 'fsrpl' (for the old RPL v1 token), 'reth', or the address of an arbitrary token you want to send (including the 0x prefix).
   set-voting-delegate, sv                       (DEPRECATED) Use `rocketpool pdao set-signalling-address` instead
   clear-voting-delegate, cv                     (DEPRECATED) Use `rocketpool pdao clear-signalling-address` instead
   initialize-fee-distributor, z                 Create the fee distributor contract for your node, so you can withdraw priority fees and MEV rewards after the merge
   distribute-fees, b                            Distribute the priority fee and MEV rewards from your fee distributor to your withdrawal address and the rETH contract (based on your node's average commission)
   join-smoothing-pool, js                       Opt your node into the Smoothing Pool
   leave-smoothing-pool, ls                      Leave the Smoothing Pool
   sign-message, sm                              Sign an arbitrary message with the node's private key
   send-message                                  Send a zero-ETH transaction to the target address (or ENS) with the provided hex-encoded message as the data payload

GLOBAL OPTIONS:
   --help, -h  show help
```

Ниже приведена сводка некоторых команд, которые вам обычно понадобятся во время типичной работы узла.

### `status`

Эта команда даст вам общий обзор всего вашего узла с первого взгляда.
Она включает в себя, сколько ETH и RPL у вас застейкано, сколько у вас минипулов и их статусы, ваш коэффициент обеспечения RPL и многое другое.

Это пример того, что показывает `rocketpool node status`, когда у вас уже зарегистрирован узел и настроены некоторые минипулы:

```
=== Account and Balances ===
The node <node address> has a balance of 2.682258 ETH and 1881.677523 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new minipools.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit /ru/legacy/houston/participate#setting-your-snapshot-signalling-address.
Rocket Pool has no Snapshot governance proposals being voted on.

=== Onchain Voting ===
The node has been initialized for onchain voting.
The node doesn't have a delegate, which means it can vote directly on onchain proposals. You can have another node represent you by running `rocketpool p svd <address>`.
The node is allowed to lock RPL to create governance proposals/challenges.
The node currently has 300.000000 RPL locked.

=== Primary Withdrawal Address ===
The node's primary withdrawal address has not been changed, so ETH rewards and minipool withdrawals will be sent to the node itself.
Consider changing this to a cold wallet address that you control using the `set-withdrawal-address` command.

=== RPL Withdrawal Address ===
The node's RPL withdrawal address has not been set. All RPL rewards will be sent to the primary withdrawal address.

=== Fee Distributor and Smoothing Pool ===
The node's fee distributor <fee distributer contract address> has a balance of 0.000000 ETH.
The node is currently opted into the Smoothing Pool <smoothing pool contract address>.

=== RPL Stake ===
NOTE: The following figures take *any pending bond reductions* into account.

The node has a total stake of 588.950796 RPL.
This is currently 4.01% of its borrowed ETH and 12.04% of its bonded ETH.

=== Minipools ===
The node has a total of 1 active minipool(s):
- 1 staking
```

### `sync`

Эта команда покажет вам текущий статус синхронизации ваших клиентов Execution и Consensus.
Вы, вероятно, будете часто использовать её, когда впервые настраиваете узел, а затем больше никогда не понадобится (если только вы не измените или не сбросите свои клиенты).

Вывод `rocketpool node sync` будет выглядеть так:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Обратите внимание, что **Prysm** в настоящее время не предоставляет процент завершения — вам нужно будет посмотреть в журналы `eth2`, если вы его используете.

### `stake-rpl`

Эту команду вы будете использовать, когда захотите добавить больше обеспечения RPL к вашему узлу.
Это увеличит ваш коэффициент обеспечения, что увеличит ваши вознаграждения RPL на каждой контрольной точке (подробнее об этом позже).

В отличие от других команд, эта фактически _интерактивная_, потому что она запустит транзакцию — она не просто информационная.

Сначала она спросит вас, сколько RPL вы хотите застейкать, с некоторыми предопределёнными опциями для удобства или возможностью указать пользовательскую сумму:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Как только вы выберете опцию, вам будет показана некоторая информация о предлагаемой цене газа и расчётной сумме, которая будет использована, вместе с диалогом подтверждения. Если это ваш первый раз стейкинга RPL на узле, вам нужно будет дать контракту стейкинга разрешение взаимодействовать с вашим RPL:

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

Если вы подтвердите, вам будет показан хеш транзакции и дана ссылка на [Etherscan](https://etherscan.io), чтобы вы могли следить за её прогрессом:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

Большинство операций требуют только одну транзакцию, поэтому CLI будет ждать, пока она не будет включена в блок, а затем выйдет. Однако stake-rpl — одна из немногих команд, которая требует две транзакции, поэтому этот диалог появится дважды.

### `deposit`

Эта команда позволит вам внести ETH и создать новый минипул (новый валидатор Ethereum).

Вам будет показана ожидаемая стоимость газа для транзакции и один последний диалог подтверждения.
Если вы примете, ваш депозит ETH будет обработан, и вы создадите новый минипул (и соответствующий валидатор Ethereum).

(Для получения дополнительной информации см. следующий раздел о [Создании минипула](./create-validator.mdx)).

### `claim-rewards`

Когда ваш узел обнаруживает новую контрольную точку вознаграждений, он автоматически загружает файл дерева вознаграждений с информацией для этого интервала (если вы используете режим загрузки по умолчанию — см. ниже информацию о генерации собственных деревьев вместо их загрузки).
Затем вы можете просмотреть свои вознаграждения с помощью следующей команды:

```
rocketpool node claim-rewards
```

По мере прохождения интервалов и накопления вознаграждений вывод будет выглядеть так:

![](../node-staking/images/claim-rewards-gb.png)

Здесь вы можете быстро увидеть, сколько вознаграждений вы заработали в каждом интервале, и решить, какие из них вы хотите получить.

Вы также можете указать сумму, которую вы хотите рестейкать во время этого получения:

![](../node-staking/images/autostake.png)

Это позволит вам увеличить ваши вознаграждения RPL в одной транзакции, используя существенно меньше газа, чем вам в настоящее время нужно было использовать с устаревшей системой получения.

::: tip ПРИМЕЧАНИЕ
Если вы предпочитаете создавать контрольную точку вознаграждений вручную вместо загрузки той, которая создана Oracle DAO, вы можете изменить эту настройку с `Download` на `Generate` в TUI:

![](../node-staking/images/tui-generate-tree.png)

Как подразумевает подсказка, вам понадобится доступ к архивному узлу клиента Execution для этого.
Если ваш локальный клиент Execution не является архивным узлом, вы можете указать отдельный (например, Infura или Alchemy) в `Archive-Mode EC URL` далее в том же меню.
Этот URL будет использоваться только при генерации деревьев Merkle; он не будет использоваться для обязанностей валидации.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Это запишет вас как согласившегося в контрактах Rocket Pool и автоматически изменит `fee recipient` вашего Validator Client с контракта дистрибьютора вашего узла на контракт Smoothing Pool.

Обратите внимание, что после того, как вы согласитесь, есть **28-дневный период ожидания** (одна полная длина интервала вознаграждений), пока вы не сможете отказаться.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Это отключит вас от Smoothing Pool, если вы в настоящее время в нём и прошло не менее 28 дней после присоединения.
После того, как **следующая эпоха после текущей эпохи** будет финализирована, это автоматически изменит `fee recipient` вашего узла с Smoothing Pool обратно на контракт дистрибьютора вашего узла.
Это сделано для того, чтобы вы не получили штраф за опережение процесса выхода, когда видите, что у вас предстоит предложение.

### `initialize-fee-distributor`

Чтобы инициализировать дистрибьютор вашего узла, просто выполните эту новую команду:

```shell
rocketpool node initialize-fee-distributor
```

### `distribute-fees`

Когда ваш дистрибьютор был инициализирован, вы можете получить и распределить весь его баланс с помощью следующей команды:

```shell
rocketpool node distribute-fees
```

Это отправит вашу долю вознаграждений на ваш **адрес вывода**.

### `send`

Эта команда позволяет вам отправить ETH, RPL или другие токены, связанные с Rocket Pool, из кошелька узла на другой адрес.
Это может быть полезно, если вы хотите переместить свои средства в кошельке в другое место.

Синтаксис использования команды `send` выглядит так:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Аргументы следующие:

- `<amount>` — это количество токена для отправки.
- `<token>` — это токен для отправки — это может быть `eth`, `rpl`, `fsrpl` (старый устаревший токен RPL) или `reth`.
- `<address or ENS name>` — это адрес Ethereum (или имя ENS) для отправки токенов.

Например:

```shell
rocketpool node send 1 eth <my friend's address>
```

отправит 1 ETH моему другу.

## Команды Minipool

Группа `minipool` включает команды, которые влияют на ваши минипулы.
Как и с группой `node`, мы рассмотрим их более подробно в следующем разделе, но может быть полезно увидеть их все сейчас.

Вот что покажет вывод `rocketpool minipool help`:

```
NAME:
   rocketpool minipool - Manage the node's minipools

USAGE:
   rocketpool minipool [global options] command [command options] [arguments...]

VERSION:
   1.17.2

COMMANDS:
   status, s                   Get a list of the node's minipools
   stake, t                    Stake a minipool after the scrub check, moving it from prelaunch to staking.
   set-withdrawal-creds, swc   Convert the withdrawal credentials for a migrated solo validator from the old 0x00 value to the minipool address. Required to complete the migration process.
   import-key, ik              Import the externally-derived key for a minipool that was previously a solo validator, so the Smartnode's VC manages it instead of your externally-managed VC.
   promote, p                  Promote a vacant minipool after the scrub check, completing a solo validator migration.
   refund, r                   Refund ETH belonging to the node from minipools
   begin-bond-reduction, bbr   Begins the ETH bond reduction process for a minipool, taking it from 16 ETH down to 8 ETH (begins conversion of a 16 ETH minipool to an LEB8)
   reduce-bond, rb             Manually completes the ETH bond reduction process for a minipool from 16 ETH down to 8 ETH once it is eligible. Please run `begin-bond-reduction` first to start this process.
   distribute-balance, d       Distribute a minipool's ETH balance between your withdrawal address and the rETH holders.
   exit, e                     Exit staking minipools from the beacon chain
   close, c                    Withdraw any remaining balance from a minipool and close it
   delegate-upgrade, u         Upgrade a minipool's delegate contract to the latest version
   delegate-rollback, b        Roll a minipool's delegate contract back to its previous version
   set-use-latest-delegate, l  Use this to enable or disable the "use-latest-delegate" flag on one or more minipools. If enabled, the minipool will ignore its current delegate contract and always use whatever the latest delegate is.
   find-vanity-address, v      Search for a custom vanity minipool address
   rescue-dissolved, rd        Manually deposit ETH into the Beacon deposit contract for a dissolved minipool, activating it on the Beacon Chain so it can be exited.

GLOBAL OPTIONS:
   --help, -h  show help
```

Ниже приведена сводка команд, которые вы обычно будете использовать.

### `status`

Эта команда просто предоставляет сводку по каждому из ваших минипулов.
Это включает его текущий статус, адрес eth1 минипула, комиссию на нём (называемую `node fee`), публичный ключ соответствующего валидатора ETH2 и некоторые другие вещи:

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

Эта команда позволяет вам вернуть 16 ETH из минипула, если вы внесли 32 ETH для его создания, после того как Rocket Pool смог внести 16 ETH из пула стейкинга rETH.

### `exit`

Эта команда отправляет добровольный выход для вашего валидатора на Beacon Chain.
Используйте её, когда хотите закрыть валидатор и вывести его окончательный баланс ETH.
Обратите внимание, что **это нельзя отменить** — как только вы запустите выход, валидатор остановится навсегда.

## Полезные флаги

Есть некоторые полезные глобальные флаги, которые вы можете добавить к некоторым из вышеупомянутых команд, которыми вы можете захотеть воспользоваться.

### Установка пользовательской максимальной комиссии или приоритетной комиссии (цены газа)

Начиная с [хардфорка London ETH1](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) в июле 2021 года, транзакции Ethereum больше не используют единую цену газа для своих транзакций.
Вместо этого современные транзакции Ethereum используют два значения:

- **max fee**, которая описывает абсолютную максимальную цену газа, которую вы готовы принять для транзакции
- **max priority fee**, которая описывает максимальную сумму, которую вы готовы «дать чаевые» майнеру за включение вашей транзакции в блок

::: tip СОВЕТ
То, как работают эти два значения, может быть несколько запутанным, поэтому вот несколько простых примеров.

Допустим, текущая сетевая комиссия, называемая **base fee**, составляет 50 gwei.
Вы отправляете транзакцию с максимальной комиссией **80 gwei** и приоритетной комиссией **2 gwei**.

Поскольку базовая комиссия сети ниже вашей максимальной комиссии, эта транзакция может быть подобрана в текущем блоке.
Она будет стоить вам **50 gwei** за базовую комиссию и **2 gwei** за приоритетную комиссию; даже если вы установили максимальную комиссию в 80, **она будет стоить вам всего 52 gwei в общей сложности**.

В качестве другого примера, скажем, у вас есть та же транзакция, но теперь базовая комиссия сети составляет **100 gwei**.
Поскольку 100 gwei больше, чем ваши 80 gwei максимальной комиссии, ваша транзакция **не будет** включена в этот блок.
Вместо этого она просто останется в пуле транзакций до тех пор, пока базовая комиссия не станет достаточно низкой, чтобы включить её.

Теперь, допустим, текущая базовая комиссия снова **50 gwei**, а ваша транзакция имеет максимальную комиссию **80** gwei и приоритетную комиссию **4 gwei**.
Она будет выполнена с общей стоимостью **54 gwei**.
Приоритетная комиссия в 4 gwei гарантирует, что она будет включена перед всеми транзакциями с более низкой приоритетной комиссией.

Если вы **действительно** хотите, чтобы транзакция прошла любой ценой, вы можете установить приоритетную комиссию равной максимальной комиссии.
Это имитирует устаревшее поведение газа, поэтому ваша транзакция будет использовать весь газ, который вы ей дали — независимо от того, ниже ли базовая комиссия сети вашей максимальной комиссии или нет.
:::

По умолчанию Rocket Pool будет использовать оракул для просмотра текущего пула транзакций и предложения разумной максимальной комиссии для любых транзакций, которые вы запускаете.
Он использует [EtherChain](https://etherchain.org/tools/gasnow) для своего основного предложения оракула и [Etherscan](https://etherscan.io/gastracker) в качестве резервного.

Если хотите, вы можете установить пользовательскую максимальную комиссию (в gwei), которую вы готовы заплатить, с флагом `-f`.
Вы также можете установить пользовательскую приоритетную комиссию с флагом `-i`.

Для этого добавьте их после `rocketpool` и перед другой информацией команды.

Например, вызов `node set-timezone` с этим флагом даст следующий вывод:

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

Это показывает, что независимо от того, какую максимальную комиссию рекомендует сеть, вместо этого она будет использовать вашу пользовательскую максимальную комиссию 10 gwei (и приоритетную комиссию, если вы её укажете) при отправке этой транзакции.

::: warning ПРИМЕЧАНИЕ
Если вы устанавливаете ручную максимальную комиссию, мы настоятельно рекомендуем вам использовать сторонний оракул цен газа, такой как [EtherChain](https://etherchain.org/tools/gasnow), чтобы определить, достаточно ли высока эта комиссия для текущих условий сети, прежде чем отправлять транзакцию.
:::

### Отмена / Перезапись застрявшей транзакции

Иногда вы можете столкнуться со сценарием, когда вы отправили транзакцию в сеть, но использовали цену газа, которая слишком низка для условий сети, и потребуется непомерно много времени для выполнения.
Поскольку все ваши последующие транзакции будут ждать, пока эта не пройдёт, эта транзакция по сути блокирует все операции на вашем узле Rocket Pool.
Для решения этой ситуации мы добавили глобальный флаг, который позволяет вам «отменить» такую транзакцию, заменив её чем-то другим.

Каждый кошелёк Ethereum, включая кошелёк вашего узла, отправляет транзакции последовательно.
Каждая отправляемая вами транзакция имеет число, называемое `nonce`, которое идентифицирует, где она находится в этой последовательности.
Самая первая транзакция, которую вы отправите, будет иметь `nonce` 0, следующая, которую вы отправите, будет иметь `nonce` 1, и так далее.

Эта техника перезаписи включает отправку _новой_ транзакции, которая использует тот же `nonce`, что и ваша существующая _застрявшая_ транзакция, но в идеале будет включать более высокую цену газа, чем застрявшая.
Это означает, что новая будет добыта первой.
Как только она будет добыта в блок, старая будет отброшена из сети, как если бы она никогда не была отправлена.

Чтобы использовать этот флаг, вам сначала нужно найти `nonce` вашей застрявшей транзакции:

1. Перейдите в обозреватель блоков ETH1, например [https://etherscan.io](https://etherscan.io).
1. Перейдите к адресу вашего кошелька и посмотрите на список транзакций.
1. Просмотрите их, начиная с самой последней, пока не найдёте самую дальнюю вниз по списку, которая имеет состояние `Pending`.
1. Отметьте `nonce` этой транзакции. Это то, что вам понадобится.

Как только вы его получите, просто вызовите любую транзакцию с CLI, используя флаги `--nonce <value> -i 2.2` после `rocketpool` и перед остальной частью команды.

::: warning ПРИМЕЧАНИЕ
Вы **должны** включить флаг `-i` (приоритетная комиссия), чтобы перезаписать предыдущую транзакцию.
Это число должно быть не менее чем на 10% выше, чем любая приоритетная комиссия, которую использовала ваша старая транзакция.
Smartnode использует приоритетную комиссию 2 gwei по умолчанию, поэтому значения `2.2` обычно достаточно для переопределения.

Если ваша старая транзакция использовала пользовательскую комиссию (скажем, 10 gwei), вам нужно будет установить её не менее чем на 10% выше в переопределяющей транзакции (так что в этом примере 11 gwei).
:::

В качестве примера, скажем, я отправил транзакцию с `nonce` 10 и максимальной комиссией 20 gwei, но текущая сетевая комиссия составляет 100 gwei, поэтому моя транзакция застряла.
Чтобы исправить это, я отправлю транзакцию, где я отправлю небольшую сумму ETH с себя обратно себе с более высокой максимальной комиссией (скажем, 150 gwei) и более высокой приоритетной комиссией.
Я сожгу немного газа, делая это, но это разблокирует сломанную транзакцию:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

Стек Smartnode автоматически проверит, что предоставленный вами `nonce` действителен (он относится к ожидающей транзакции), прежде чем отправить его и случайно не потратить ваш газ.
Если нет, он вернёт сообщение об ошибке.
В противном случае он пройдёт и предоставит вам детали транзакции, чтобы вы могли отслеживать её, чтобы подтвердить, что она действительно перезаписала вашу старую застрявшую транзакцию.

Вот и всё для общих команд CLI.
В следующем разделе мы пройдём через то, как создать минипул и начать валидацию на Beacon Chain.
