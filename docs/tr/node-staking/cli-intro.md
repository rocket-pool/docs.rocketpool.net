# Komut Satırı Arayüzüne Giriş

Bir düğüm operatörü olarak, CLI Rocket Pool ile etkileşim kurmanız için birincil aracınızdır.
Yeni minipool'lar oluşturmak, her şeyin durumunu kontrol etmek, düzenli RPL ödüllerini talep etmek, hazır olduğunuzda minipool'larınızdan çıkmak ve para çekmek ve bir dizi başka faaliyet için kullanacaksınız.

Execution ve Beacon zincirlerini senkronize etmeyi bitirdikten sonra, tüm komutlar kullanımınıza hazır olacaktır.
Bu bölümde, daha yaygın olanlardan bazılarına kısa bir tur ve CLI'nin yapabileceği diğer bazı püf noktalara göz atacağız.

## Komutlar Hakkında Bilgi Edinme

Mevcut tüm komutları listelemek için şunu yazın:

```shell
rocketpool help
```

Çıktı şu şekilde görünecektir:

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

## Servis Komutları

Servis grubu, smart node'un sizin için yönettiği çeşitli servisleri yönetmeyi içerir.

`rocketpool service help` çıktısı şunu gösterecektir:

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

Bu komut, Rocket Pool tarafından yönetilen her bir Docker konteynırının mevcut çalışma durumunu size gösterir.
Örneğin, varsayılan Docker kurulumunun çıktısı şu şekilde görünür:

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

Docker konteynırlarından herhangi birinin sorun yaşayıp yaşamadığını hızlıca kontrol etmek veya bir `start` veya `stop` komutunun doğru çalıştığından emin olmak için kullanabilirsiniz.

### `start` ve `stop`

Bu iki komutu zaten biliyorsunuz.
Basitçe tüm Rocket Pool konteynırlarını başlatırlar veya durdururlar.

::: tip
`pause` komutu `stop` ile aynı şeyi yapar.
Rocket Pool'un önceki sürümlerinden kalan eski bir komuttur.
:::

### `logs`

Bu, zaten görmüş olmanız gereken bir başka komuttur.
Her Docker konteynırının çıktı loglarına bakmak için kullanabilirsiniz.
Bu, sorun giderme veya onlardan daha ayrıntılı bir durum raporu almak için yararlı olabilir.

Başka bir argüman olmadan sadece `rocketpool service logs` yaparsanız, tüm logları bir araya toplayacak ve size bir seferde gösterecektir.

Bir konteynırın çıktısına odaklanmak istiyorsanız, konteynırı belirtmek için sona bir argüman ekleyebilirsiniz.
Geçerli değerler: `eth1`, `eth2`, `validator`, `api`, `node`, `watchtower`, `prometheus`, `grafana` ve `node-exporter`.

### `stats`

Bu komut, her bir konteynırdan bazı kaynak istatistiklerini gösterir; bunları her birinin donanım ve ağ tüketimini profillemek için kullanabilirsiniz.

Sisteminiz yavaş çalışmaya başlarsa veya RAM sorunları yaşarsa konteynırları izlemek için yararlı bulabilirsiniz.

İşte bazı örnek çıktılar:

```
CONTAINER ID   NAME                    CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O         PIDS
62314e5a0ecf   rocketpool_api          0.00%     18.89MiB / 62.78GiB   0.03%     50.6kB / 31.1kB   57.4MB / 0B       1
ac629c08c896   rocketpool_eth1         5.44%     18.13GiB / 62.78GiB   28.88%    1.63GB / 1.66GB   24.4GB / 37.7GB   27
4dfc7a2e939b   rocketpool_eth2         97.39%    2.369GiB / 62.78GiB   3.77%     1.79GB / 45MB     333MB / 24.1GB    2
a3c22f54eff0   rocketpool_node         0.00%     12.13MiB / 62.78GiB   0.02%     308kB / 504kB     0B / 0B           15
0d5818868ef6   rocketpool_validator    0.00%     936KiB / 62.78GiB     0.00%     12.1kB / 0B       4.57MB / 0B       2
88bea525fa89   rocketpool_watchtower   0.00%     12.05MiB / 62.78GiB   0.02%     304kB / 503kB     0B / 0B           16
```

::: tip NOT
Buradaki RAM istatistiği **toplam ayrılmış belleği** gösterir, bu da _sanal_ belleği içerir.
Ham _resident_ bellek tüketimini göstermez.

Benzer şekilde, CPU kullanımı, konteynırın kullandığı tüm CPU çekirdekleri üzerinden ortalama alınan toplam CPU tüketim miktarını gösterir.
Burada, ETH2 için CPU neredeyse %100 gösteriyor çünkü tek iş parçacıklı olan Nimbus kullanıyor.

`htop` veya `btop` gibi bir programın gerçek kaynak tüketimine daha iyi içgörü sunduğunu görebilirsiniz.
:::

### `config`

Bu komut yapılandırma görüşmesini yeniden çalıştırır.
Execution veya Consensus istemci seçiminizi değiştirmek istiyorsanız veya onları seçtiğinizde başlangıçta belirttiğiniz bazı parametreleri değiştirmek istiyorsanız (validatörünüzün graffiti mesajı, bağlanılacak maksimum eş sayısı vb. gibi) kullanabilirsiniz.

Bu komutu istediğiniz zaman çağırabilirsiniz, ancak değişiklikler `rocketpool service stop` ve `rocketpool service start` çağrılana kadar yürürlüğe girmeyecektir.

### `terminate`

Bu komut Docker konteynırlarını kapatacak, ardından onları silecek, Rocket Pool sanal ağını silecek ve ETH1 ve ETH2 zincir veri hacimlerini silecektir.
Temelde Docker kurulumunuzdan tüm Rocket Pool öğelerini kaldırır.
Rocket Pool kurulumunun bu bölümünü temizlemek istediğinizde kullanın.

::: warning
Bu, zincir verilerinizi geri alınamaz şekilde kaldıracaktır, yani ETH1 ve ETH2'yi tekrar senkronize etmeniz gerekecektir.

Bu, cüzdan ve şifre dosyalarınızı, yapılandırılmış ayarlarınızı veya validatör anahtarlarınızı **kaldırmayacaktır**.
Bunları kaldırmak için Docker veya Hibrit Modda `~/.rocketpool/data` klasörünü veya Native Modda karşılık gelen dizini silmeniz gerekecektir.
:::

## Düğüm Komutları

`node` grubu, Rocket Pool düğümünüz üzerindeki işlemleri içerir.
Bunları bir minipool oluşturduğumuz bir sonraki bölümde daha derinlemesine ele alacağız, ancak hepsini bir bakışta görmek yararlı olabilir.

`rocketpool node help` çıktısı şunu gösterecektir:

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

Aşağıda, tipik düğüm işlemi sırasında ihtiyaç duyacağınız bazı komutların özeti bulunmaktadır.

### `status`

Bu komut, tüm düğümünüzün bir bakışta üst düzey bir görünümünü verecektir.
Ne kadar ETH ve RPL stake ettiğinizi, kaç minipool'unuzun olduğunu ve durumlarını, RPL teminat oranınızı ve daha fazlasını içerir.

Düğümünüzü kaydettikten ve bazı minipool'lar kurduktan sonra `rocketpool node status`'un gösterdiklerine bir örnek:

```
=== Account and Balances ===
The node <node address> has a balance of 2.682258 ETH and 1881.677523 RPL.
The node has 0.000000 ETH in its credit balance and 0.000000 ETH staked on its behalf. 0.000000 can be used to make new minipools.
The node is registered with Rocket Pool with a timezone location of America/Los_Angeles.

=== Penalty Status ===
The node does not have any penalties for cheating with an invalid fee recipient.

=== Signalling on Snapshot ===
The node does not currently have a snapshot signalling address set.
To learn more about snapshot signalling, please visit /tr/legacy/houston/participate#setting-your-snapshot-signalling-address.
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

Bu komut, Execution ve Consensus istemcilerinizin mevcut senkronizasyon durumunu gösterecektir.
Muhtemelen düğümü ilk kurduğunuzda çok kullanacaksınız, sonra bir daha ihtiyacınız olmayacak (istemcilerinizi değiştirmediğiniz veya sıfırlamadığınız sürece).

`rocketpool node sync` çıktısı şu şekilde görünecektir:

```
Your Smartnode is currently using the Hoodi Test Network.

Your eth1 client hasn't synced enough to determine if your eth1 and eth2 clients are on the same network.
To run this safety check, try again later when eth1 has made more sync progress.

Your primary execution client is still syncing (67.12%).
You do not have a fallback execution client enabled.
Your primary consensus client is still syncing (99.94%).
You do not have a fallback consensus client enabled.
```

**Prysm**'in şu anda tamamlanma yüzdesini sağlamadığını unutmayın - kullanıyorsanız `eth2` loglarına bakmanız gerekecektir.

### `stake-rpl`

Bu komut, düğümünüze daha fazla RPL teminatı eklemek istediğinizde kullanacağınız komuttur.
Bunu yapmak teminat oranınızı artıracak ve her kontrol noktasında RPL ödüllerinizi artıracaktır (daha fazlası daha sonra).

Şimdiye kadarki diğer komutların aksine, bu gerçekten _etkileşimlidir_ çünkü bir işlem tetikleyecektir - sadece bilgilendirici değildir.

İlk olarak size ne kadar RPL stake etmek istediğinizi soracak, kolaylık için bazı önceden tanımlanmış seçenekler veya özel bir miktar belirtme yeteneği sunacaktır:

```
NOTE: By staking RPL, you become a member of the Rocket Pool pDAO. Stay informed on governance proposals by joining the Rocket Pool Discord.

Please choose an amount of RPL to stake:
1: 5% of borrowed ETH (733.993926 RPL) for one validator?
2: 10% of borrowed ETH (1467.987852 RPL) for one validator?
3: 15% of borrowed ETH (2201.981778 RPL) for one validator?
4: Your entire RPL balance (20000.000000 RPL)?
5: A custom amount
```

Bir seçenek seçtikten sonra, önerilen gaz fiyatı ve kullanılacak tahmini miktar hakkında bazı bilgiler ve bir onay diyalogu gösterilecektir. Düğümde ilk kez RPL stake ediyorsanız, RPL'nizle etkileşime girmesi için staking sözleşmesine onay vermeniz gerekecektir:

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

Onaylarsanız, işlem hash'i gösterilecek ve ilerlemesini takip edebilmeniz için [Etherscan](https://etherscan.io) bağlantısı verilecektir:

```
Staking RPL...
Transaction has been submitted with hash <transaction hash>.
You may follow its progress by visiting:
https://hoodi.etherscan.io/tx/<transaction hash>

Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully staked 733.993925 RPL.
```

Çoğu işlem yalnızca bir işlem gerektirir, bu nedenle CLI bir bloğa dahil edilene kadar bekleyecek ve ardından çıkacaktır. Ancak, stake-rpl iki işlem gerektiren birkaç komuttan biridir, bu nedenle bu diyalog iki kez görünecektir.

### `deposit`

Bu komut ETH yatırmanıza ve yeni bir minipool (yeni bir Ethereum validatörü) oluşturmanıza olanak tanır.

İşlem için beklenen gaz maliyeti ve bir son onay diyalogu ile karşılaşacaksınız.
Kabul ederseniz, ETH yatırmanız işlenecek ve yeni bir minipool (ve karşılık gelen bir Ethereum validatörü) oluşturacaksınız.

(Daha fazla bilgi için, [Minipool Oluşturma](./create-validator.mdx) konusundaki bir sonraki bölüme bakın).

### `claim-rewards`

Düğümünüz yeni bir ödül kontrol noktası algıladığında, o aralık için bilgileri içeren ödül ağacı dosyasını otomatik olarak indirecektir (varsayılan İndirme Modunu kullanıyorsanız - Oracle DAO tarafından oluşturulanı indirmek yerine kendi ağaçlarınızı oluşturma hakkında bilgi için aşağıya bakın).
Ardından ödüllerinizi aşağıdaki komutu kullanarak gözden geçirebilirsiniz:

```
rocketpool node claim-rewards
```

Aralıklar geçtikçe ve ödüller biriktikçe, çıktı şu şekilde görünecektir:

![](../node-staking/images/claim-rewards-gb.png)

Burada her aralıkta kaç ödül kazandığınızı hızlıca görebilir ve hangilerini talep etmek istediğinize karar verebilirsiniz.

Ayrıca bu talep sırasında yeniden stake etmek istediğiniz bir miktar belirtebilirsiniz:

![](../node-staking/images/autostake.png)

Bu, RPL ödüllerinizi tek bir işlemde bileşiklendirmenize olanak tanır; eski talep sistemiyle kullanmanız gereken gaz miktarından önemli ölçüde daha az gaz kullanarak.

::: tip NOT
Oracle DAO tarafından oluşturulanı indirmek yerine ödül kontrol noktasını manuel olarak oluşturmayı tercih ederseniz, bu ayarı TUI'de `Download`'dan `Generate`'e değiştirebilirsiniz:

![](../node-staking/images/tui-generate-tree.png)

İpucunun ima ettiği gibi, bunu yapmak için bir Execution istemci arşiv düğümüne erişiminiz olması gerekecektir.
Yerel Execution istemciniz bir arşiv düğümü değilse, aynı menüde daha aşağıdaki `Archive-Mode EC URL`'de ayrı bir tane (Infura veya Alchemy gibi) belirtebilirsiniz.
Bu URL yalnızca Merkle ağaçları oluştururken kullanılacaktır; doğrulama görevleri için kullanılmayacaktır.
:::

### `join-smoothing-pool`

```shell
rocketpool node join-smoothing-pool
```

Bu, sizi Rocket Pool sözleşmelerinde katılım olarak kaydedecek ve Validator Client'ınızın `fee recipient`'ini düğümünüzün dağıtıcı sözleşmesinden Smoothing Pool sözleşmesine otomatik olarak değiştirecektir.

Katıldıktan sonra, çıkabilmeniz için **28 günlük bir bekleme süresi** (bir tam ödül aralığı uzunluğu) olduğunu unutmayın.

### `leave-smoothing-pool`

```shell
rocketpool node leave-smoothing-pool
```

Bu, şu anda katıldıysanız ve katıldıktan sonra en az 28 gün beklediyseniz sizi Smoothing Pool'dan çıkaracaktır.
**Mevcut epoch'tan sonraki bir sonraki epoch** tamamlandığında, düğümünüzün `fee recipient`'ini Smoothing Pool'dan düğümünüzün dağıtıcı sözleşmesine otomatik olarak değiştirecektir.
Bu, bir teklif geldiğini gördüğünüzde çıkış sürecini öne almaktan ceza almayacağınızdan emin olmak içindir.

### `initialize-fee-distributor`

Düğümünüzün dağıtıcısını başlatmak için bu yeni komutu çalıştırmanız yeterlidir:

```shell
rocketpool node initialize-fee-distributor
```

### `distribute-fees`

Dağıtıcınız başlatıldıktan sonra, tüm bakiyesini aşağıdaki komutu kullanarak talep edebilir ve dağıtabilirsiniz:

```shell
rocketpool node distribute-fees
```

Bu, ödüllerin sizin payınızı **withdrawal address**'inize gönderecektir.

### `send`

Bu komut, düğüm cüzdanından farklı bir adrese ETH, RPL veya diğer Rocket Pool ile ilgili token'ları göndermenize olanak tanır.
Cüzdanınızdaki fonlarınızı başka bir yere taşımak istiyorsanız bu yararlı olabilir.

`send` komutunu kullanma sözdizimi şu şekildedir:

```shell
rocketpool node send <amount> <token> <address or ENS name>
```

Argümanlar şunlardır:

- `<amount>` gönderilecek token miktarıdır.
- `<token>` gönderilecek token'dır - bu `eth`, `rpl`, `fsrpl` (eski RPL v1 token'ı) veya `reth` olabilir.
- `<address or ENS name>` token'ların gönderileceği Ethereum adresi (veya ENS adı)'dir.

Örneğin:

```shell
rocketpool node send 1 eth <my friend's address>
```

arkadaşıma 1 ETH gönderir.

## Minipool Komutları

`minipool` grubu, minipool'larınızı etkileyen komutları içerir.
`node` grubunda olduğu gibi, bunları bir sonraki bölümde daha derinlemesine ele alacağız, ancak hepsini şimdi görmek yararlı olabilir.

`rocketpool minipool help` çıktısı şunu gösterecektir:

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

Aşağıda tipik olarak kullanacağınız komutların özeti bulunmaktadır.

### `status`

Bu komut basitçe her minipool'unuzun bir özetini sağlar.
Bu, mevcut durumunu, minipool'un eth1 adresini, üzerindeki komisyonu (`node fee` olarak adlandırılır), karşılık gelen ETH2 validatörünün genel anahtarını ve diğer bazı şeyleri içerir:

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

Bu komut, bir minipool oluşturmak için 32 ETH yatırdıysanız, Rocket Pool rETH staking havuzundan 16 ETH katkıda bulunabildiğinde 16 ETH'yi geri çekmenize olanak tanır.

### `exit`

Bu komut, Beacon Chain'deki validatörünüz için gönüllü bir çıkış gönderir.
Bir validatörü kapatmak ve son ETH bakiyesini çekmek istediğinizde bunu kullanın.
Bunun **geri alınamayacağını** unutmayın - bir çıkışı tetiklediğinizde, validatör kalıcı olarak kapanacaktır.

## Yararlı Bayraklar

Yukarıdaki komutlardan bazılarına ekleyebileceğiniz ve yararlanmak isteyebileceğiniz bazı yararlı genel bayraklar vardır.

### Özel Maksimum Ücret veya Öncelik Ücreti Ayarlama (Gaz Fiyatı)

Temmuz 2021'deki [London ETH1 hardfork](https://coinquora.com/ethereum-london-hard-fork-all-you-need-to-know/) ile başlayarak, Ethereum işlemleri artık işlemleri için tek bir gaz fiyatı kullanmıyor.
Bunun yerine, modern Ethereum işlemleri iki değer kullanır:

- **Max fee**, bir işlemde kabul etmeye hazır olduğunuz mutlak maksimum gaz fiyatını tanımlar
- **Max priority fee**, işleminizi bir bloğa dahil etmesi için madenciye "bahşiş" olarak vermeye hazır olduğunuz maksimum miktarı tanımlar

::: tip İPUCU
Bu iki değerin nasıl çalıştığı biraz karmaşık olabilir, bu yüzden işte bazı basit örnekler.

Diyelim ki **base fee** olarak adlandırılan mevcut ağ ücreti 50 gwei'de.
**80 gwei** maksimum ücret ve **2 gwei** öncelik ücreti ile bir işlem gönderiyorsunuz.

Ağın base fee'si maksimum ücretinizden düşük olduğu için, bu işlem mevcut bloğa alınabilir.
Base fee için **50 gwei** ve öncelik ücreti için **2 gwei** maliyetiniz olacaktır; maksimum ücretinizi 80'e ayarlamanıza rağmen, **size toplamda sadece 52 gwei mal olacaktır**.

Başka bir örnek olarak, aynı işleminiz var diyelim, ancak şimdi ağın base fee'si **100 gwei**.
100 gwei, 80 gwei maksimum ücretinizden daha büyük olduğu için, işleminiz bu bloğa **dahil edilmeyecektir**.
Bunun yerine, base fee dahil edilmesine yetecek kadar düşük olana kadar işlem havuzunda bekleyecektir.

Şimdi, mevcut base fee'nin yine **50 gwei** olduğunu ve işleminizin **80** gwei maksimum ücret ve **4 gwei** öncelik ücretine sahip olduğunu varsayalım.
Toplam **54 gwei** maliyetle yürütülecektir.
4 gwei öncelik ücreti, daha düşük öncelik ücretine sahip tüm işlemlerin önünde dahil edilmesini sağlayacaktır.

İşlemin **her ne pahasına olursa olsun** geçmesini istiyorsanız, öncelik ücretini maksimum ücretle aynı olacak şekilde ayarlayabilirsiniz.
Bu, eski gaz davranışını taklit eder, bu nedenle işleminiz verdiğiniz tüm gazı kullanacaktır - ağın base fee'sinin maksimum ücretinizden düşük olup olmadığına bakılmaksızın.
:::

Varsayılan olarak, Rocket Pool tetiklediğiniz tüm işlemler için mevcut işlem havuzuna bakmak ve makul bir maksimum ücret önermek için bir oracle kullanacaktır.
Birincil öneri oracle'ı olarak [EtherChain](https://etherchain.org/tools/gasnow)'i ve yedek olarak [Etherscan](https://etherscan.io/gastracker)'ı kullanır.

Tercih ederseniz, `-f` bayrağı ile ödemeye hazır olduğunuz özel bir maksimum ücret (gwei cinsinden) ayarlayabilirsiniz.
Ayrıca `-i` bayrağı ile özel bir öncelik ücreti ayarlayabilirsiniz.

Bunu yapmak için, bunları `rocketpool`'dan sonra ve diğer komut bilgilerinden önce ekleyin.

Örneğin, `node set-timezone`'u bu bayrakla çağırmak aşağıdaki çıktıyı sağlayacaktır:

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

Bu, ağın hangi maksimum ücreti önerdiğine bakılmaksızın, bu işlemi gönderirken özel 10 gwei maksimum ücretinizi (ve belirtirseniz öncelik ücretinizi) kullanacağını gösterir.

::: warning NOT
Manuel bir maksimum ücret ayarlarsanız, işlemi göndermeden önce bu ücretin mevcut ağ koşulları için yeterince yüksek olup olmadığını belirlemek için [EtherChain](https://etherchain.org/tools/gasnow) gibi üçüncü taraf bir gaz fiyatı oracle'ı kullanmanızı şiddetle tavsiye ederiz.
:::

### Takılı Bir İşlemi İptal Etme / Üzerine Yazma

Bazen, ağa bir işlem gönderdiğiniz ancak ağ koşulları için çok düşük bir gaz fiyatı kullandığınız ve yürütülmesinin engelleyici derecede uzun süreceği bir senaryoyla karşılaşabilirsiniz.
Sonraki tüm işlemleriniz bu işlemin geçmesini bekleyeceğinden, bu işlem temelde Rocket Pool düğümünüzdeki tüm işlemleri bloke eder.
Bu durumla başa çıkmak için, böyle bir işlemi başka bir şeyle değiştirerek "iptal etmenizi" sağlayan bir genel bayrak ekledik.

Düğüm cüzdanınız dahil her Ethereum cüzdanı, işlemleri sırayla gönderir.
Gönderdiğiniz her işlemin, o dizide nerede bulunduğunu tanımlayan `nonce` adında bir numarası vardır.
Gönderdiğiniz ilk işlem `nonce` 0'a sahip olacak, sonraki `nonce` 1'e sahip olacak ve böyle devam edecektir.

Bu üzerine yazma tekniği, mevcut _takılı_ işleminizle aynı `nonce`'u kullanan ancak ideal olarak takılı olandan daha yüksek bir gaz fiyatı içerecek _yeni_ bir işlem göndermeyi içerir.
Bu, yeni olanın önce madencilik yapılacağı anlamına gelir.
Bir bloğa eklendiği anda, eski olan ağdan hiç gönderilmemiş gibi atılacaktır.

Bu bayrağı kullanmak için, önce takılı işleminizin `nonce`'unu bulmanız gerekir:

1. [https://etherscan.io](https://etherscan.io) gibi bir ETH1 blok gezginine gidin.
1. Cüzdanınızın adresine gidin ve işlem listesine bakın.
1. En yeniden başlayarak, `Pending` durumuna sahip olan listedeki en uzaktaki işlemi bulana kadar işlemleri inceleyin.
1. O işlemin `nonce`'unu işaretleyin. İhtiyacınız olan budur.

Onu aldıktan sonra, CLI ile `rocketpool`'dan sonra ve komutun geri kalanından önce `--nonce <value> -i 2.2` bayraklarını kullanarak herhangi bir işlemi çağırmanız yeterlidir.

::: warning NOT
Önceki bir işlemin üzerine yazmak için `-i` (öncelik ücreti) bayrağını **dahil etmelisiniz**.
Bu sayı, eski işleminizin kullandığı öncelik ücretinden en az %10 daha yüksek olmalıdır.
Smartnode varsayılan olarak 2 gwei öncelik ücreti kullanır, bu nedenle geçersiz kılma için `2.2` değeri genellikle yeterlidir.

Eski işleminiz özel bir ücret kullandıysa (örneğin 10 gwei), geçersiz kılan işlemde en az %10 daha yüksek ayarlamanız gerekecektir (bu örnekte 11 gwei).
:::

Örnek olarak, `nonce` 10 ve maksimum ücret 20 gwei olan bir işlem gönderdim, ancak mevcut ağ ücreti 100 gwei olduğu için işlemim takıldı.
Bunu düzeltmek için, kendimden kendime küçük bir miktarda ETH gönderdiğim, daha yüksek bir maksimum ücret (örneğin 150 gwei) ve daha yüksek bir öncelik ücreti ile bir işlem göndereceğim.
Bunu yaparken biraz gaz yakacağım, ancak takılı işlemi çözecektir:

```
$ rocketpool --nonce 10 -f 150 -i 2.2 node send 0.0001 eth <node wallet address>

Using the requested max fee of 150.00 gwei (including a max priority fee of 2.20 gwei).
Total cost: 0.0032 to 0.0032 ETH
Are you sure you want to send 0.000100 eth to <node wallet address>? This action cannot be undone! [y/n]
```

Smartnode yığını, sağladığınız `nonce`'un geçerli olduğundan (bekleyen bir işleme atıfta bulunduğundan) emin olmak için göndermeden ve yanlışlıkla gazınızı boşa harcamadan önce otomatik olarak kontrol edecektir.
Değilse, bir hata mesajı döndürecektir.
Aksi takdirde, devam edecek ve eski takılı işleminizi gerçekten geçersiz kıldığını doğrulayabilmeniz için işlem ayrıntılarını size sağlayacaktır.

Yaygın CLI komutları için bu kadar.
Bir sonraki bölümde, bir minipool oluşturmayı ve Beacon Chain'de doğrulamaya başlamayı inceleyeceğiz.
