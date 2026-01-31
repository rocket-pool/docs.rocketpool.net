# SSS (Devam Ediyor)

### Rocket Pool ile minipool çalıştırmanın 32 ETH solo validatöre kıyasla faydaları nelerdir?

Tek bir solo validatör çalıştırarak, 32 ETH'niz üzerinde %100 ödül alırsınız.
İki adet 16 ETH minipool çalıştırarak, 32 ETH'niz üzerinde %100 ödül **artı** Rocket Pool protokolü tarafından sağlanan 32 ETH üzerindeki ödüllerin %14'ünü alırsınız.
Dört adet 8 ETH minipool çalıştırarak, 32 ETH'niz üzerinde %100 ödül **artı** Rocket Pool protokolü tarafından sağlanan 96 ETH üzerindeki ödüllerin %14'ünü alırsınız.
Ayrıca Rocket Pool'un [Smoothing Pool](./prepare-node.mdx#smoothing-pool) özelliğini kullanma seçeneğiniz de olacaktır.

### rETH'imin ne kadar değerli olduğunu nasıl anlarım? Rebase yapıyor mu?

rETH token'ı rebase yapmayacaktır.
Cüzdanınızdaki token sayısı sabit kalacak ancak zamanla değer kazanacaktır.

### Düğümümü çalıştırırken teknik bir sorunum var, nasıl yardım alabilirim?

[Rocket Pool Support](https://rocketpool.support) sayfasını kontrol ederek başlayabilirsiniz.
Bu yardımcı olmazsa, sorunuzu [Discord sunucusundaki](https://discord.gg/rocketpool) Rocket Pool **#support** kanalında sorabilirsiniz.

### Bir minipool oluşturma ve çalıştırma konusunda denemeler yapmak için test ETH'sini nasıl alabilirim? Faucet kanalına mesaj gönderemiyorum.

[Hoodi'de test ETH alma](../testnet/overview#getting-test-eth-on-hoodi) bölümüne bakın.

### Makinem bozulursa düğümümü nasıl kurtarırım?

Kısa cevap: düğümünüzü tamamen kurtarmak için ihtiyacınız olan tek şey mnemonic'inizdir.
Her zaman güvende tuttuğunuzdan emin olun.

Düğümünüzü yeni bir makinede kurtarmak için, **önceki makinenizin anahtarlarla tekrar çevrimiçi olmayacağından** emin olarak başlayın, çünkü aynı anahtarlarla çalışan iki düğüm **sizi slashing'e uğratacaktır**.
Yeni bir makineye Smartnode'u yüklemek için [adımları](./install-modes) izleyin.
Ardından, `rocketpool wallet recover` komutunu çalıştırarak ve 24 kelimelik mnemonic'inizi girerek düğüm cüzdanınızı ve validatör anahtarlarınızı kurtarın.

### İstemcilerim neden senkronize olmuyor? Düşük sayıda eş var.

İstemcilerin düzgün senkronize olabilmesi için sağlıklı sayıda eşe sahip olması gerekir.
[Buradaki](https://www.yougetsignal.com/tools/open-ports/) testi çalıştırarak, 30303 ve 9001 portlarının açık olup olmadığını kontrol ederek başlayabilirsiniz.
Kapalıysa, yönlendiricinizde port yönlendirmesi kurmanız gerekecektir.
Ayrıca, düğümünüzün statik bir yerel IP adresine sahip olduğundan emin olun, böylece düğümünüz yeni bir adres aldığında port yönlendirmesi bozulmaz.

### Consensus istemcimin senkronizasyonu çok uzun sürüyor. Ne yapmalıyım?

[Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing) kullanarak senkronizasyon sürecini başlatmadıysanız, Consensus istemcileri senkronize olmak için uzun zaman alabilir.
Uzun süredir çalıştırıyor olsanız bile, genellikle checkpoint sync URL'sini yapılandırmak, mevcut senkronizasyon verilerini `rocketpool service resync-eth2` ile temizlemek ve baştan başlamak daha hızlıdır.
İstemciniz bir dakikadan kısa sürede senkronize olmalıdır.

### Zaten yeniden başlattım. Grafana neden hala yeniden başlatmam gerektiğini söylüyor?

Yeniden başlatma bilgisi önbelleğe alınır ve yalnızca birkaç saatte bir güncellenir.
`sudo apt update` çalıştırmak bir güncellemeyi zorlayacaktır.

### Execution Layer'ımı ve/veya Beacon Chain veya Consensus Layer'ımı değiştirdim. Eski verileri nasıl temizlerim?

İstemcileri değiştirirseniz, Rocketpool eski hacimleri silmez. Bu veriler önemli disk alanı israf edebilir ve kaldırmak isteyebilirsiniz. Bunu yapmak için hacimleri bulmanız gerekir. Varsayılan Rocketpool ayarlarını kullanıyorsanız, docker hacimleri `/var/lib/docker/volumes/` dizininde saklanır. execution layer `rocketpool_eth1clientdata/_data/*` içindedir ve consensus layer `rocketpool_eth2clientdata/_data/*` içindedir.

Bu dizinlere erişmek için `sudo -i` kullanarak root olarak sudo yapmanız gerekebilir. Ardından `rm -rf <directory>` çağırarak bir dizini silebilirsiniz. Örneğin, tüm geth verilerini silmek isterseniz, `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/` çağırırsınız.

Root'tan çıkmak için `exit` yazın.
