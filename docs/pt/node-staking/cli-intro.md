# Introdução à Interface de Linha de Comando

Como operador de nó, a CLI é sua ferramenta principal para interagir com o Rocket Pool.
Você a usará para criar novos minipools, verificar o status de tudo, reivindicar recompensas periódicas de RPL, sair e retirar de seus minipools quando estiver pronto, e uma série de outras atividades.

Depois de terminar de sincronizar as cadeias Execution e Beacon, todos os comandos estarão disponíveis para você usar.
Nesta seção, faremos um breve tour de alguns dos mais comuns e alguns outros truques que a CLI pode fazer.

## Aprendendo Sobre os Comandos

Para listar todos os comandos disponíveis, digite:

```shell
rocketpool help
```

A saída será assim:

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

## Comandos de Serviço

O grupo de serviço envolve gerenciar os vários serviços que o smart node gerencia para você.

Aqui está o que a saída de `rocketpool service help` mostrará:

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

Este comando mostra o status de execução atual de cada um dos contêineres Docker gerenciados pelo Rocket Pool.
Por exemplo, a saída da instalação padrão do Docker se parece com isto:

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

Você pode usá-lo para verificar rapidamente se algum dos contêineres Docker está com problemas, ou para garantir que um comando `start` ou `stop` funcionou corretamente.

### `start` e `stop`

Estes dois comandos você já conhece.
Eles simplesmente iniciam todos os contêineres do Rocket Pool, ou os param.

::: tip
O comando `pause` faz a mesma coisa que `stop`.
É apenas um comando legado de versões anteriores do Rocket Pool.
:::

### `logs`

Este é outro comando que você já deve ter visto.
Você pode usá-lo para ver os logs de saída de cada contêiner Docker.
Isso pode ser útil para solucionar problemas ou obter um relatório de status mais detalhado deles.

Se você simplesmente fizer `rocketpool service logs` sem outros argumentos, ele agregará todos os logs juntos e os mostrará de uma vez.

Se você quiser focar na saída de um contêiner, pode adicionar um argumento no final para especificar o contêiner.
Valores válidos são `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` e `node-exporter`.

### `stats`

Este comando mostra algumas estatísticas de recursos de cada um dos contêineres, que você pode usar para perfilar o consumo de hardware e rede de cada um.

Você pode achá-lo útil para monitorar os contêineres se seu sistema começar a ficar lento ou tiver problemas de RAM.

Aqui está um exemplo de saída:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip NOTA
A estatística de RAM aqui mostra **memória total alocada**, que inclui memória _virtual_.
Não mostra o consumo de memória _residente_ bruto.

Da mesma forma, o uso de CPU mostra a quantidade total de consumo de CPU em média em todos os núcleos de CPU que o contêiner usa.
Aqui, a CPU para ETH2 mostra quase 100% porque está usando Nimbus, que é single-threaded.

Você pode descobrir que um programa como `htop` ou `btop` oferece melhor visão do consumo real de recursos.
:::

### `config`

Este comando executa a entrevista de configuração novamente.
Você pode usá-lo se quiser alterar sua seleção de cliente Execution ou Consensus, ou alterar alguns dos parâmetros que você especificou inicialmente quando os selecionou (como a mensagem de graffiti do seu validador, o número máximo de peers para se conectar e assim por diante).

Você pode chamar este comando a qualquer momento, mas as alterações não terão efeito até que você chame `rocketpool service stop` e `rocketpool service start`.

### `terminate`

Este comando desligará os contêineres Docker, depois os excluirá, excluirá a rede virtual do Rocket Pool e excluirá os volumes de dados da cadeia ETH1 e ETH2.
Essencialmente remove todos os itens do Rocket Pool da sua configuração Docker.
Use-o quando quiser limpar essa parte da instalação do Rocket Pool.

::: warning
Isso removerá irreversivelmente seus dados de cadeia, o que significa que você precisará sincronizar ETH1 e ETH2 novamente.

Isso **não** removerá seus arquivos de carteira e senha, suas configurações definidas ou suas chaves de validador.
Para removê-los, você precisará excluir a pasta `~/.rocketpool/data` no modo Docker ou Híbrido, ou o diretório correspondente no modo Nativo.
:::

## Comandos do Nó

O grupo `node` envolve operações em seu nó Rocket Pool.
Cobriremos isso com mais profundidade na próxima seção onde criamos um minipool, mas pode ser útil vê-los todos de relance.

Aqui está o que a saída de `rocketpool node help` mostrará:

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

Abaixo está um resumo de alguns dos comandos que você tenderá a precisar durante a operação típica do nó.

### `status`

Este comando lhe dará uma visão de alto nível de todo o seu nó de relance.
Ele inclui quanto ETH e RPL você tem em staking, quantos minipools você tem e seus status, sua taxa de colateral RPL e muito mais.

Este é um exemplo do que `rocketpool node status` mostra depois que você tem seu nó registrado e alguns minipools configurados:

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

Este comando mostrará o status de sincronização atual de seus clientes Execution e Consensus.
Você provavelmente o usará muito quando configurar o nó pela primeira vez, e então nunca precisará dele novamente (a menos que você altere ou redefina seus clientes).

A saída de `rocketpool node sync` será assim:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Observe que **Prysm** atualmente não fornece sua porcentagem de conclusão - você precisará olhar nos logs `eth2` se usá-lo.

### `stake-rpl`

Este é o comando que você usará quando quiser adicionar mais colateral RPL ao seu nó.
Fazer isso aumentará sua taxa de colateral, o que aumentará suas recompensas RPL em cada checkpoint (mais sobre isso depois).

Ao contrário dos outros comandos até agora, este é realmente _interativo_ porque ele acionará uma transação - não é simplesmente informativo.

Ele primeiro perguntará quanto RPL você gostaria de fazer stake, com algumas opções pré-definidas para conveniência ou a capacidade de especificar uma quantidade personalizada:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Depois de selecionar uma opção, você verá algumas informações sobre o preço de gas sugerido e a quantidade estimada a ser usada, junto com um diálogo de confirmação. Se for a primeira vez que você faz stake de RPL no nó, precisará dar aprovação ao contrato de staking para interagir com seu RPL:

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

Se você confirmar, verá o hash da transação e receberá um link para o [Etherscan](https://etherscan.io) para que possa acompanhar seu progresso:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

A maioria das operações requer apenas uma transação, então a CLI esperará até que ela seja incluída em um bloco e então sairá. No entanto, stake-rpl é um dos poucos comandos que requer duas transações, então esse diálogo aparecerá duas vezes.

### `claim-rewards`

Quando seu nó detecta um novo checkpoint de recompensas, ele baixará automaticamente o arquivo da árvore de recompensas com as informações desse intervalo (se você estiver usando o padrão do modo Download - veja abaixo para informações sobre como gerar suas próprias árvores em vez de baixá-las).
Você pode então revisar suas recompensas usando o seguinte comando:

```
rocketpool node claim-rewards
```

Conforme os intervalos passam e você acumula recompensas, a saída será assim:

![](../node-staking/images/claim-rewards-gb.png)

Aqui você pode ver rapidamente quantas recompensas você ganhou em cada intervalo e pode decidir quais deseja reivindicar.

Você também pode especificar uma quantidade que deseja restakear durante esta reivindicação:

![](../node-staking/images/autostake.png)

Isso permitirá que você componha suas recompensas RPL em uma transação, usando substancialmente menos gas do que você precisava usar atualmente com o sistema de reivindicação legado.

::: tip NOTA
Se você preferir construir o checkpoint de recompensas manualmente em vez de baixar o criado pelo Oracle DAO, você pode alterar essa configuração de `Download` para `Generate` na TUI:

![](../node-staking/images/tui-generate-tree.png)

Como a dica implica, você precisará de acesso a um nó de arquivo do cliente Execution para fazer isso.
Se seu cliente Execution local não for um nó de arquivo, você pode especificar um separado (como Infura ou Alchemy) na `Archive-Mode EC URL` mais abaixo no mesmo menu.
Esta URL só será usada ao gerar árvores Merkle; não será usada para deveres de validação.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Isso registrará você como opt-in nos contratos do Rocket Pool e automaticamente mudará o `fee recipient` do seu Validator Client do contrato distribuidor do seu nó para o contrato do Smoothing Pool.

Observe que depois de optar por participar, há um **período de espera de 28 dias** (um comprimento de intervalo de recompensas completo) até que você possa optar por sair.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Isso fará com que você saia do Smoothing Pool se você estiver atualmente participando e tiver esperado pelo menos 28 dias após optar por participar.
Assim que **a próxima época após a época atual** for finalizada, ele automaticamente mudará o `fee recipient` do seu nó do Smoothing Pool de volta para o contrato distribuidor do seu nó.
Isso é para garantir que você não seja penalizado por fazer front-running do processo de saída quando vir que tem uma proposta chegando.

### `distribute-fees`

Quando você tiver ganho recompensas em seu distribuidor de taxas, pode reivindicar e distribuir todo o seu saldo usando o seguinte comando:

```shell
rocketpool node distribute-fees
```

Isso enviará sua parte das recompensas para seu **endereço de retirada**.

### `send`

Este comando permite que você envie ETH, RPL ou outros tokens relacionados ao Rocket Pool da carteira do nó para um endereço diferente.
Isso pode ser útil se você quiser mover seus fundos na carteira para outro lugar.

A sintaxe para usar o comando `send` é assim:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Os argumentos são os seguintes:

- `<amount>` é a quantidade do token a enviar.
- `<token>` é o token a enviar - pode ser `eth`, `rpl`, `fsrpl` (o token RPL legado antigo) ou `reth`.
- `<address or ENS name>` é o endereço Ethereum (ou nome ENS) para o qual enviar os tokens.

Por exemplo:

```shell
rocketpool node send 1 eth <my friend's address>
```

enviaria 1 ETH para meu amigo.

## Comandos do Megapool

O grupo `megapool` é onde você pode acessar todos os comandos usados para gerenciar seu megapool e os validadores do megapool.

Aqui está o que `rocketpool megapool help` mostrará:

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

Abaixo está um resumo dos comandos que você normalmente usará durante a operação normal:

### `deposit`

Este comando permite que você crie novos validadores em seu megapool. Entraremos em mais detalhes sobre isso depois. Sinta-se à vontade para avançar para [Criando um Validador de Megapool](/pt/node-staking/megapools/create-megapool-validator.mdx) se quiser uma prévia.

### `status`

Este comando fornece algumas informações sobre o estado do seu megapool e os validadores gerenciados pelo seu megapool. Você poderá ver o endereço do seu megapool, o número de tickets da fila expressa, o endereço do delegado do seu megapool, o saldo de ETH na camada de execução e consenso, e muitas outras informações úteis. Aqui está um exemplo da saída de `rocketpool megapool status`:

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

O comando `rocketpool megapool validators` mostrará o status de cada validador gerenciado pelo megapool do seu nó. Você poderá ver informações como as chaves públicas dos validadores, o estado da Beacon Chain e a posição na fila dos validadores em prestake:

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

Este comando permite que você selecione um validador para sair voluntariamente da Beacon Chain. Use isso quando quiser fechar um validador e retirar seu saldo final de ETH. Observe que isso não pode ser desfeito - uma vez que você aciona uma saída, o validador será desligado permanentemente.

## Comandos do Minipool

O grupo `minipool` envolve comandos que afetam seus minipools.
Assim como o grupo `node`, cobriremos isso com mais profundidade na próxima seção, mas pode ser útil vê-los todos agora.

Aqui está o que a saída de `rocketpool minipool help` mostrará:

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

Abaixo está um resumo dos comandos que você normalmente usará.

### `status`

Este comando simplesmente fornece um resumo de cada um de seus minipools.
Isso inclui seu status atual, o endereço eth1 do minipool, a comissão sobre ele (chamada de `node fee`), a chave pública do validador ETH2 correspondente e algumas outras coisas:

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

Este comando permite que você puxe 16 ETH de volta de um minipool se você depositou 32 ETH para criar um, uma vez que o Rocket Pool pôde contribuir com 16 ETH do pool de staking rETH.

### `exit`

Este comando envia uma saída voluntária para seu validador na Beacon Chain.
Use isso quando quiser fechar um validador e retirar seu saldo final de ETH.
Observe que **isso não pode ser desfeito** - uma vez que você aciona uma saída, o validador será desligado permanentemente.

## Sinalizadores Úteis

Existem alguns sinalizadores globais úteis que você pode adicionar a alguns dos comandos acima, dos quais você pode querer tirar proveito.

### Definindo uma Taxa Máxima Personalizada ou Taxa de Prioridade (Preço do Gas)

Começando com [o hardfork ETH1 de Londres](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) em julho de 2021, as transações Ethereum não usam mais um único preço de gas para suas transações.
Em vez disso, as transações Ethereum modernas usam dois valores:

- A **taxa máxima**, que descreve o preço máximo absoluto de gas que você está disposto a aceitar em uma transação
- A **taxa de prioridade máxima**, que descreve a quantidade máxima que você está disposto a dar de "gorjeta" ao minerador por incluir sua transação em um bloco

::: tip DICA
A maneira como esses dois valores funcionam pode ser um pouco confusa, então aqui estão alguns exemplos simples.

Digamos que a taxa de rede atual, chamada de **taxa base**, está em 50 gwei.
Você envia uma transação com uma taxa máxima de **80 gwei** e uma taxa de prioridade de **2 gwei**.

Como a taxa base da rede é menor que sua taxa máxima, esta transação poderia ser incluída no bloco atual.
Custaria **50 gwei** para a taxa base e **2 gwei** para a taxa de prioridade; mesmo que você tenha definido sua taxa máxima para 80, **custaria apenas 52 gwei no total**.

Como outro exemplo, digamos que você tenha essa mesma transação, mas agora a taxa base da rede é **100 gwei**.
Como 100 gwei é maior que sua taxa máxima de 80 gwei, sua transação **não** será incluída neste bloco.
Em vez disso, ela simplesmente ficará no pool de transações até que a taxa base seja baixa o suficiente para incluí-la.

Agora, digamos que a taxa base atual seja **50 gwei** novamente, e sua transação tenha uma taxa máxima de **80** gwei e uma taxa de prioridade de **4 gwei**.
Ela seria executada com um custo total de **54 gwei**.
A taxa de prioridade de 4 gwei garantiria que ela fosse incluída na frente de todas as transações com uma taxa de prioridade menor.

Se você **realmente** quer que a transação passe a qualquer custo, você pode definir a taxa de prioridade para ser a mesma que a taxa máxima.
Isso emula o comportamento legado de gas, então sua transação usará todo o gas que você der a ela - independentemente de a taxa base da rede ser menor que sua taxa máxima ou não.
:::

Por padrão, o Rocket Pool usará um oráculo para ver o pool de transações atual e sugerir uma taxa máxima razoável para quaisquer transações que você acionar.
Ele usa [EtherChain](https://etherchain.org/tools/gasnow) para seu oráculo de sugestão primário e [Etherscan](https://etherscan.io/gastracker) como backup.

Se você preferir, pode definir uma taxa máxima personalizada (em gwei) que estaria disposto a pagar com o sinalizador `-f`.
Você também pode definir uma taxa de prioridade personalizada com o sinalizador `-i`.

Para fazer isso, adicione-os após `rocketpool` e antes das outras informações do comando.

Por exemplo, chamar `node set-timezone` com este sinalizador forneceria a seguinte saída:

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

Isso mostra que, independentemente da taxa máxima que a rede recomende, ela usará sua taxa máxima personalizada de 10 gwei (e taxa de prioridade se você especificá-la) ao enviar esta transação.

::: warning NOTA
Se você definir uma taxa máxima manual, recomendamos fortemente que use um oráculo de preço de gas de terceiros, como [EtherChain](https://etherchain.org/tools/gasnow), para determinar se essa taxa é alta o suficiente para as condições atuais da rede antes de enviar a transação.
:::

### Cancelando / Sobrescrevendo uma Transação Travada

Às vezes, você pode encontrar um cenário em que enviou uma transação para a rede, mas usou um preço de gas muito baixo para as condições da rede, e levará um tempo proibitivamente longo para executar.
Como todas as suas transações subsequentes esperarão até que essa seja processada, essa transação essencialmente bloqueia todas as operações em seu nó Rocket Pool.
Para lidar com essa situação, adicionamos um sinalizador global que permite "cancelar" tal transação substituindo-a por outra coisa.

Toda carteira Ethereum, incluindo sua carteira de nó, envia transações sequencialmente.
Cada transação que você envia tem um número chamado `nonce` que identifica onde ela está nessa sequência.
A primeira transação que você enviar terá um `nonce` de 0, a próxima que você enviar terá um `nonce` de 1 e assim por diante.

Esta técnica de sobrescrita envolve enviar uma transação _nova_ que use o mesmo `nonce` que sua transação _travada_ existente, mas idealmente incluirá um preço de gas maior que a travada.
Isso significa que a nova será minerada primeiro.
Assim que for minerada em um bloco, a antiga será descartada da rede como se nunca tivesse sido enviada.

Para usar este sinalizador, você primeiro precisa encontrar o `nonce` de sua transação travada:

1. Vá para um explorador de blocos ETH1 como [https://etherscan.io](https://etherscan.io).
1. Navegue até o endereço de sua carteira e veja a lista de transações.
1. Percorra-as, começando pela mais recente, até encontrar a mais distante na lista que tenha o estado `Pending`.
1. Marque o `nonce` dessa transação. É isso que você precisará.

Depois de tê-lo, simplesmente chame qualquer transação com a CLI usando os sinalizadores `--nonce <value> -i 2.2` após `rocketpool` e antes do resto do comando.

::: warning NOTA
Você **deve** incluir o sinalizador `-i` (taxa de prioridade) para sobrescrever uma transação anterior.
Este número deve ser pelo menos 10% maior que a taxa de prioridade que sua transação antiga usou.
O Smartnode usa uma taxa de prioridade de 2 gwei por padrão, então um valor de `2.2` geralmente é suficiente para uma substituição.

Se sua transação antiga usou uma taxa personalizada (digamos, 10 gwei), você precisará defini-la pelo menos 10% maior na transação de substituição (então, neste exemplo, 11 gwei).
:::

Como exemplo, digamos que enviei uma transação com um `nonce` de 10 e uma taxa máxima de 20 gwei, mas a taxa de rede atual é de 100 gwei, então minha transação está travada.
Para corrigi-la, enviarei uma transação onde envio uma pequena quantidade de ETH de mim mesmo de volta para mim mesmo com uma taxa máxima maior (digamos, 150 gwei) e uma taxa de prioridade maior.
Vou queimar um pouco de gas fazendo isso, mas vai destravar a transação quebrada:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

A pilha Smartnode verificará automaticamente para garantir que o `nonce` que você forneceu seja válido (ele se refere a uma transação pendente) antes de enviá-lo e desperdiçar seu gas acidentalmente.
Caso contrário, retornará uma mensagem de erro.
Caso contrário, ele passará e fornecerá os detalhes da transação para que você possa monitorá-la e confirmar que ela, de fato, sobrescreveu sua antiga transação travada.

Isso é tudo para os comandos CLI comuns.
Na próxima seção, mostraremos como criar um minipool e começar a validar na Beacon Chain.
