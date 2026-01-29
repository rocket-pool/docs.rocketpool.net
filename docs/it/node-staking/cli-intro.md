# Intro to the Command Line Interface

As a node operator, the CLI is your primary tool for interacting with Rocket Pool.
You will use it to create new minipools, check on the status of everything, claim periodic RPL rewards, exit and withdraw from your minipools when you're ready, and a host of other activities.

Once you've finished syncing the Execution and Beacon chains, all of the commands will be available for you to use.
In this section, we'll go over a brief tour of some of the more common ones and some other tricks that the CLI can do.

## Learning About the Commands

To list all of the available commands, type:

```shell
rocketpool help
```

The output will look like this:

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

## Service Commands

The service group involves managing the various services the smart node manages for you.

Here is what the `rocketpool service help` output will show:

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

This command shows you the current running status of each of the Docker containers managed by Rocket Pool.
For example, the default Docker install's output looks like this:

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

You can use it to quickly check if any of the Docker containers are having trouble, or to make sure that a `start` or `stop` command worked correctly.

### `start` and `stop`

These two commands you are already familiar with.
They simply start all of the Rocket Pool containers, or stop them.

::: tip
The `pause` command does the same thing as `stop`.
It's just left over as a legacy command from earlier versions of Rocket Pool.
:::

### `logs`

This command is another one you should have already seen.
You can use it to look at the output logs of each Docker container.
This can be useful for troubleshooting or getting a more detailed status report from them.

If you simply do `rocketpool service logs` without any other arguments, it will aggregate all of the logs together and show them to you at once.

If you want to focus on one container's output, you can add an argument to the end to specify the container.
Valid values are `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana`, and `node-exporter`.

### `stats`

This command shows you some resource stats from each of the containers, which you can use to profile each one's hardware and network consumption.

You might find it useful for monitoring the containers if your system starts running slow or has RAM problems.

Here is some example output:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip NOTE
The RAM statistic here shows **total allocated memory**, which includes _virtual_ memory.
It does not show the raw _resident_ memory consumption.

Similarly, the CPU usage shows the total amount of CPU consumption averaged over all of the CPU cores that the container uses.
Here, the CPU for ETH2 shows almost 100% because it is using Nimbus, which is single-threaded.

You may find that a program like `htop` or `btop` offers better insight into actual resource consumption.
:::

### `config`

This command runs through the configuration interview again.
You can use it if you want to change your selection of Execution or Consensus client, or change some of the parameters that you initially specified when you selected them (such as your validator's graffiti message, the max number of peers to connect to, and so on).

You can call this command at any time, but the changes won't take effect until you call `rocketpool service stop` and `rocketpool service start`.

### `terminate`

This command will shut down the Docker containers, then delete them, delete the Rocket Pool virtual network, and delete the ETH1 and ETH2 chain data volumes.
It essentially removes all of the Rocket Pool items from your Docker setup.
Use it when you want to clean up that portion of the Rocket Pool installation.

::: warning
This will irreversibly remove your chain data, which means you'll need to sync ETH1 and ETH2 again.

This will **not** remove your wallet and password files, your configured settings, or your validator keys.
To remove those, you will need to delete the `~/.rocketpool/data` folder in Docker or Hybrid Mode, or the corresponding directory in Native Mode.
:::

## Node Commands

The `node` group involves operations on your Rocket Pool node.
We'll cover these more in-depth in the next section where we create a minipool, but it may be helpful to see them all at a glance.

Here is what the `rocketpool node help` output will show:

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

Below is a summary of some of the commands you'll tend to need during typical node operation.

### `status`

This command will give you a high-level view of your entire node at a glance.
It includes how much ETH and RPL you have staked, how many minipools you have and their statuses, your RPL collateral ratio, and more.

This is an example of what `rocketpool node status` shows once you have your node registered and some minipools set up:

```
=== Account and Balances ===
The node <node address> has a balance of 2.682258 ETH and 1881.677523 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new minipools.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit /en/legacy/houston/participate#setting-your-snapshot-signalling-address.
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

This command will show you the current sync status of your Execution and Consensus clients.
You'll probably use it a lot when you first set the node up, then never need it again (unless you change or reset your clients).

The output of `rocketpool node sync` will look like this:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

Note that **Prysm** currently doesn't provide its completion percent - you'll need to look in the `eth2` logs if you use it.

### `stake-rpl`

This command is what you'll use when you want to add more RPL collateral to your node.
Doing so will increase your collateral ratio, which will increase your RPL rewards at each checkpoint (more on this later).

Unlike the other commands so far, this one is actually _interactive_ because it will trigger a transaction - it isn't simply informational.

It will first ask you how much RPL you'd like to stake, with some pre-defined options for convenience or the ability to specify a custom amount:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Once you select an option, you will be shown some information about the suggested gas price and estimated amount to be used, along with a confirmation dialog. If it's your first time staking RPL on the node, you'll need to give the staking contract approval to interact with your RPL:

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

If you confirm, you will be shown the transaction hash and given a link to [Etherscan](https://etherscan.io) so you can follow its progress:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

Most operations only require one transaction, so the CLI will wait until it has been included in a block and then exit. However, stake-rpl is one of the few commands that requires two transactions, so this dialog will appear twice.

### `deposit`

This command will let you deposit ETH and create a new minipool (a new Ethereum validator).

You will be prompted with the expected gas cost for the transaction and one final confirmation dialog.
If you accept, your ETH deposit will be processed and you will create a new minipool (and a corresponding Ethereum validator).

(For more information, see the next section on [Creating a Minipool](./create-validator.mdx)).

### `claim-rewards`

When your node detects a new rewards checkpoint, it will automatically download the rewards tree file with the information for that interval (if you're using the default of Download Mode - see below for information on generating your own trees instead of downloading them).
You can then review your rewards using the following command:

```
rocketpool node claim-rewards
```

As intervals go by and you accumulate rewards, the output will look like this:

![](../node-staking/images/claim-rewards-gb.png)

Here you can quickly see how many rewards you've earned at each interval, and can decide which ones you want to claim.

You can also specify an amount you want to restake during this claim:

![](../node-staking/images/autostake.png)

This will let you compound your RPL rewards in one transaction, using substantially less gas than you currently needed to use with the legacy claim system.

::: tip NOTE
If you prefer to build the rewards checkpoint manually instead of downloading the one created by the Oracle DAO, you can change this setting from `Download` to `Generate` in the TUI:

![](../node-staking/images/tui-generate-tree.png)

As the tip implies, you will need access to an Execution client archive node to do this.
If your local Execution client is not an archive node, you can specify a separate one (such as Infura or Alchemy) in the `Archive-Mode EC URL` further down in the same menu.
This URL will only be used when generating Merkle trees; it will not be used for validation duties.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

This will record you as opted-in in the Rocket Pool contracts and automatically change your Validator Client's `fee recipient` from your node's distributor contract to the Smoothing Pool contract.

Note that once you opt in, there is a **28 day cooldown** (one full rewards interval length) until you can opt out.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

This will opt you out of the Smoothing Pool if you're currently opted in, and have waited at least 28 days after opting in.
Once **the next epoch after the current epoch** is finalized, it will automatically change your node's `fee recipient` from the Smoothing Pool back to your node's distributor contract.
This is to ensure you don't get penalized for front-running the exit process when you see that you have a proposal coming up.

### `initialize-fee-distributor`

To initialize your node's distributor, simply run this new command:

```shell
rocketpool node initialize-fee-distributor
```

### `distribute-fees`

When your distributor has been initialized, you can claim and distribute its entire balance using the following command:

```shell
rocketpool node distribute-fees
```

This will send your share of the rewards to your **withdrawal address**.

### `send`

This command lets you send ETH, RPL, or other Rocket Pool-related tokens from the node wallet to a different address.
This might be useful if you want to move your funds on the wallet elsewhere.

The syntax for using the `send` command is like this:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

The arguments are as follows:

- `<amount>` is the amount of the token to send.
- `<token>` is the token to send - this can be `eth`, `rpl`, `fsrpl` (the old legacy RPL token), or `reth`.
- `<address or ENS name>` is the Ethereum address (or ENS name) to send the tokens to.

For example:

```shell
rocketpool node send 1 eth <my friend's address>
```

would send 1 ETH to my friend.

## Minipool Commands

The `minipool` group involves commands that affect your minipools.
As with the `node` group, we'll cover these more in-depth in the next section but it may be helpful to see them all now.

Here is what the `rocketpool minipool help` output will show:

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

Below is a summary of the commands that you'll typically use.

### `status`

This command simply provides a summary of each of your minipools.
This includes its current status, the eth1 address of the minipool, the commission on it (called the `node fee`), the public key of the corresponding ETH2 validator, and some other things:

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

This command lets you pull 16 ETH back from a minipool if you deposited 32 ETH to create one, once Rocket Pool was able to contribute 16 ETH from the rETH staking pool.

### `exit`

This command submits a voluntary exit for your validator on the Beacon Chain.
Use this when you want to close a validator and withdraw its final ETH balance.
Note that **this cannot be undone** - once you trigger an exit, the validator will shut down permanently.

## Useful Flags

There are some useful global flags that you can add to some of the above commands, which you may want to take advantage of.

### Setting a Custom Max Fee or Priority Fee (Gas Price)

Starting with [the London ETH1 hardfork](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) in July of 2021, Ethereum transactions no longer use a single gas price for their transactions.
Instead, modern Ethereum transactions use two values:

- The **max fee**, which describes the absolute maximum gas price you're willing to accept on a transaction
- The **max priority fee**, which describes the maximum amount you're willing to "tip" the miner for including your transaction in a block

::: tip TIP
The way these two values work can be a bit convoluted, so here are some simple examples.

Let's say the current network fee, called the **base fee**, is at 50 gwei.
You submit a transaction with an **80 gwei** max fee, and a priority fee of **2 gwei**.

Because the network's base fee is lower than your max fee, this transaction could get picked up in the current block.
It would cost you **50 gwei** for the base fee and **2 gwei** for the priority fee; even though you set your max fee to 80, **it would only cost you 52 gwei total**.

As another example, say you have that same transaction, but now the network's base fee is **100 gwei**.
Since 100 gwei is larger than your 80 gwei max fee, your transaction **will not** be included in this block.
Instead, it will simply sit in the transaction pool until the base fee is low enough to include it.

Now, let's say the current base fee is **50 gwei** again, and your transaction has a max fee of **80** gwei and a priority fee of **4 gwei**.
It would execute with a total cost of **54 gwei**.
The 4 gwei priority fee would ensure that it was included in front of all of the transactions with a lower priority fee.

If you **really** want the transaction to go through at all costs, you can set the priority fee to be the same as the max fee.
This emulates the legacy gas behavior, so your transaction will use all of the gas you give it - regardless of whether or not the network's base fee is lower than your max fee or not.
:::

By default, Rocket Pool will use an oracle to look at the current transaction pool and suggest a reasonable max fee for any transactions you trigger.
It uses [EtherChain](https://etherchain.org/tools/gasnow) for its primary suggestion oracle, and [Etherscan](https://etherscan.io/gastracker) as a backup.

If you prefer, you can set a custom max fee (in gwei) you'd be willing to pay with the `-f` flag.
You can also set a custom priority fee with the `-i` flag.

To do this, add them after `rocketpool` and before the other command information.

For example, calling `node set-timezone` with this flag would provide the following output:

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

This shows that regardless of what max fee the network recommends, it will use your custom max fee of 10 gwei (and priority fee if you specify it) instead when submitting this transaction.

::: warning NOTE
If you set a manual max fee, we strongly encourage you to use a third-party gas price oracle such as [EtherChain](https://etherchain.org/tools/gasnow) to determine if that fee is high enough for the current network conditions before submitting the transaction.
:::

### Canceling / Overwriting a Stuck Transaction

Sometimes, you might run into a scenario where you sent a transaction to the network but you used a gas price that is far too low for the network conditions, and it will take a prohibitively long time to execute.
Since all of your subsequent transactions will wait until that one goes through, that transaction essentially blocks all of the operations on your Rocket Pool node.
To deal with this situation, we've added a global flag that lets you "cancel" such a transaction by replacing it with something else.

Every Ethereum wallet, including your node wallet, sends transactions sequentially.
Each transaction you send has a number called a `nonce` that identifies where it lives in that sequence.
The very first transaction you send will have a `nonce` of 0, the next one you send will have a `nonce` of 1, and so on.

This overwriting technique involves sending a _new_ transaction that uses the same `nonce` as your existing _stuck_ transaction, but will ideally include a higher gas price than the stuck one.
This means that the new one will be mined first.
As soon as it's mined into a block, the old one will be discarded from the network as though it was never sent in the first place.

To use this flag, you first need to find the `nonce` of your stuck transaction:

1. Go to an ETH1 block explorer like [https://etherscan.io](https://etherscan.io).
1. Navigate to the address of your wallet, and look at the list of transactions.
1. Go through them, starting with the most recent, until you find the furthest one down the list that has the `Pending` state.
1. Mark the `nonce` of that transaction. That's what you'll need.

Once you have it, simply call any transaction with the CLI using the `--nonce <value> -i 2.2` flags after `rocketpool` and before the rest of the command.

::: warning NOTE
You **must** include the `-i` (priority fee) flag in order to overwrite a previous transaction.
This number must be at least 10% higher than whatever priority fee your old transaction used.
The Smartnode uses a priority fee of 2 gwei by default, so a value of `2.2` is usually sufficient for an override.

If your old transaction used a custom fee (say, 10 gwei), you will need to set it at least 10% higher in the overriding transaction (so in this example, 11 gwei).
:::

As an example, say I submitted a transaction with a `nonce` of 10 and a max fee of 20 gwei, but the current network fee is 100 gwei so my transaction is stuck.
To fix it, I will submit a transaction where I send a small amount of ETH from myself back to myself with a higher max fee (say, 150 gwei) and a higher priority fee.
I'll burn a little gas doing it, but it will unstick the broken transaction:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

The Smartnode stack will automatically check to make sure that the `nonce` you have provided is valid (it refers to a pending transaction) before sending it and wasting your gas accidentally.
If not, it will return an error message.
Otherwise, it will go through and provide you with the transaction details so you can monitor it to confirm that it did, in fact, overwrite your old stuck transaction.

That's it for the common CLI commands.
In the next section, we'll walk through how to create a minipool and start validating on the Beacon Chain.
