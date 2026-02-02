# Akıllı Sözleşmeler

## Giriş

Rocket Pool [Akıllı Sözleşmeleri](https://www.ethereum.org/learn/#smart-contracts), Rocket Pool protokolünün temelini oluşturur. Ağın diğer tüm unsurlarının, Smart Node yazılım yığınının ve tüm web veya uygulama arayüzlerinin üzerine inşa edildiği temel altyapı katmanıdırlar.

Sözleşmelerle doğrudan etkileşim genellikle gerekli değildir ve başka yazılımların kullanımı ile kolaylaştırılır. Bu bölüm, sözleşme tasarımının detaylı bir açıklamasını ve Rocket Pool'u genişletmek isteyen geliştiriciler için üzerine nasıl inşa edileceğine dair bilgiler sağlar. Tüm kod örnekleri Solidity `v0.7.6` olarak verilmiştir.

### Sözleşme Tasarımı

Rocket Pool ağ sözleşmeleri, yükseltme düşünülerek hub-and-spoke mimarisi kullanılarak oluşturulmuştur. Ağın merkezi hub'ı, tüm protokolün durumunu depolamaktan sorumlu olan `RocketStorage` sözleşmesidir. Bu, anahtar-değer depolama için map'ler ve bir anahtar için değerleri okuma ve yazma için getter ve setter yöntemleri kullanılarak uygulanır.

`RocketStorage` sözleşmesi ayrıca diğer tüm ağ sözleşmelerinin adreslerini (isme göre anahtarlanmış) depolar ve veri değişikliğini yalnızca bu sözleşmelerle sınırlar. Bu mimari kullanılarak, protokol mevcut bir sözleşmenin yeni sürümlerini dağıtarak ve adresini depolamada güncelleyerek yükseltilebilir. Bu, Rocket Pool'a hataları düzeltmek veya protokolü geliştirmek için yeni özellikler uygulamak için gerekli esnekliği sağlar.

### Rocket Pool ile Etkileşim

Rocket Pool ağı ile etkileşime başlamak için önce [arayüzünü](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol) kullanarak `RocketStorage` sözleşmesinin bir örneğini oluşturun:

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

Yukarıdaki constructor, uygun ağdaki `RocketStorage` sözleşmesinin adresiyle çağrılmalıdır.

Rocket Pool'un mimarisi nedeniyle, diğer sözleşmelerin adresleri doğrudan kullanılmamalı, kullanmadan önce blokzincirden alınmalıdır. Önceki etkileşimden bu yana ağ yükseltmeleri gerçekleşmiş olabilir ve bu da güncel olmayan adreslere yol açabilir. `RocketStorage` asla adres değiştiremez, bu nedenle ona bir referans saklamak güvenlidir.

Diğer sözleşme örnekleri, [Rocket Pool deposundan](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface) alınan uygun arayüz kullanılarak oluşturulabilir, örneğin:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        // RocketStorage'a referans saklamak güvenlidir
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        // Diğer tüm sözleşmeler her kullanıldıklarında sorgulanmalıdır
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        // ...
    }

}
```

`RocketStorage`'da tanımlandığı şekliyle Rocket Pool sözleşmeleri şunlardır:

- `rocketVault` - Ağ sözleşmeleri tarafından tutulan ETH'yi depolar (dahili, yükseltilemez)
- `rocketAuctionManager` - Node operatörlerinin stake'inden kesilmiş RPL'in açık artırmasını yönetir
- `rocketDepositPool` - Kullanıcı tarafından yatırılan ETH'yi kabul eder ve minipool'lara atamasını yönetir
- `rocketSmoothingPool` - Öncelik ücretlerini ve MEV'i alır
- `rocketMinipoolBase` - Minipool'lar için başlatma ve delege yükseltme mantığını içerir
- `rocketMinipoolBondReducer` - Bond azaltma penceresini ve güvenilir node iptali yönetir
- `rocketMinipoolFactory` - Minipool sözleşmelerinin oluşturulmasını yönetir
- `rocketMinipoolDelegate` - Minipool yardımcı sözleşmesi (dahili)
- `rocketMinipoolManager` - Ağdaki tüm minipool'ları oluşturur ve yönetir
- `rocketMinipoolQueue` - Minipool'ları ETH ataması için bir kuyruğa organize eder
- `rocketMinipoolStatus` - Watchtower node'larından minipool durum güncellemelerini yönetir
- `rocketMinipoolPenalty` - oDAO tarafından node operatörlerine uygulanan cezaları depolar
- `rocketNetworkBalances` - Watchtower node'larından ağ bakiyesi güncellemelerini yönetir
- `rocketNetworkFees` - Ağ node talebine dayalı node komisyon oranlarını hesaplar
- `rocketNetworkPrices` - Watchtower node'larından RPL fiyatı ve efektif stake güncellemelerini yönetir
- `rocketNetworkWithdrawal` - Beacon chain validatör çekimlerinin işlenmesini yönetir
- `rocketNetworkPenalties` - Minipool cezalarını yönetir
- `rocketRewardsPool` - Her ödül sözleşmesine ödüllerin dağıtımını yönetir
- `rocketClaimDAO` - pDAO için ödüllerin talep edilmesini yönetir
- `rocketNodeDeposit` - Minipool oluşturma için node depozitolarını yönetir
- `rocketMerkleDistributorMainnet` - RPL ve ETH ödüllerinin dağıtımını yönetir
- `rocketNodeDistributorDelegate` - RocketNodeDistributor'lar için mantığı içerir
- `rocketNodeDistributorFactory` - RocketNodeDistributor sözleşmelerinin oluşturulmasını yönetir
- `rocketNodeManager` - Ağdaki tüm node'ları kaydeder ve yönetir
- `rocketNodeStaking` - Node stake etme ve stake çözmeyi yönetir
- `rocketDAOProposal` - Ortak oDAO ve pDAO işlevselliğini içerir
- `rocketDAONodeTrusted` - oDAO ile ilgili teklifleri yönetir
- `rocketDAONodeTrustedProposals` - oDAO teklif işlevselliğini içerir (dahili)
- `rocketDAONodeTrustedActions` - oDAO eylem işlevselliğini içerir (dahili)
- `rocketDAONodeTrustedUpgrade` - oDAO sözleşme yükseltme işlevselliğini yönetir (dahili)
- `rocketDAONodeTrustedSettingsMembers` - Güvenilir üyelerle ilgili ayarları yönetir
- `rocketDAONodeTrustedSettingsProposals` - Tekliflerle ilgili ayarları yönetir
- `rocketDAONodeTrustedSettingsMinipool` - Minipool'larla ilgili ayarları yönetir
- `rocketDAONodeTrustedSettingsRewards` - Ödüllerle ilgili ayarları yönetir
- `rocketDAOProtocol` - pDAO ile ilgili teklifleri yönetir
- `rocketDAOProtocolProposals` - pDAO teklif işlevselliğini yönetir (dahili)
- `rocketDAOProtocolActions` - pDAO eylem işlevselliğini yönetir (dahili)
- `rocketDAOProtocolSettingsInflation` - Enflasyonla ilgili ayarları yönetir
- `rocketDAOProtocolSettingsRewards` - Ödüllerle ilgili ayarları yönetir
- `rocketDAOProtocolSettingsAuction` - Açık artırma sistemiyle ilgili ayarları yönetir
- `rocketDAOProtocolSettingsNode` - Node operatörleriyle ilgili ayarları yönetir
- `rocketDAOProtocolSettingsNetwork` - Ağ ile ilgili ayarları yönetir
- `rocketDAOProtocolSettingsDeposit` - Depozitolarla ilgili ayarları yönetir
- `rocketDAOProtocolSettingsMinipool` - Minipool'larla ilgili ayarları yönetir
- `rocketTokenRETH` - rETH token sözleşmesi (yükseltilemez)
- `rocketTokenRPL` - RPL token sözleşmesi (yükseltilemez)
- `rocketUpgradeOneDotOne` - Rocket Pool protokolü Redstone yükseltmesini yönetti.
- `rocketUpgradeOneDotTwo` - Rocket Pool protokolü Atlas yükseltmesini yönetti
- `addressQueueStorage` - Bir yardımcı sözleşme (dahili)
- `addressSetStorage` - Bir yardımcı sözleşme (dahili)

İlk dağıtımdan bu yana `RocketStorage`'dan kaldırılmış olan eski Rocket Pool sözleşmeleri şunlardır:

- `rocketClaimNode` - Node operatörleri için ödüllerin talep edilmesini yönetti
- `rocketClaimTrustedNode` - oDAO için ödüllerin talep edilmesini yönetti

"Dahili" olarak işaretlenmiş sözleşmeler, genel halka erişilebilir yöntemler sağlamazlar ve bu nedenle genellikle genişletme için yararlı değildirler. Belirli sözleşme yöntemleri hakkında bilgi için, [Rocket Pool deposundaki](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface) arayüzlerine başvurun.

## Depozitolar

Rocket Pool ağını genişletmenin ana nedeni, kullanıcı depozitolarını depozito havuzuna aktaran özel depozito mantığını uygulamaktır. Örneğin, bir fon yöneticisi kullanıcılarının ETH'sini kendi akıllı sözleşmeleri aracılığıyla Rocket Pool'da stake etmek ve Rocket Pool'un kendisinin kullanımını kullanıcılarından soyutlamak isteyebilir.

Not: `RocketDepositPool` sözleşme adresi sözleşmelerinizde sabit kodlanmamalı, `RocketStorage`'dan dinamik olarak alınmalıdır. Daha fazla ayrıntı için [Rocket Pool ile Etkileşim](#rocket-pool-ile-etkileşim) bölümüne bakın.

### Uygulama

Aşağıda, yatırılan ETH'yi Rocket Pool'a ileten ve basılmış rETH'yi çağırana geri gönderen temel bir örnek sözleşme açıklanmaktadır:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";
import "RocketTokenRETHInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));
    mapping(address => uint256) balances;

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function deposit() external payable {
        // Depozito miktarını kontrol et
        require(msg.value > 0, "Invalid deposit amount");
        // Sözleşmeleri yükle
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Depozitoyu RP'ye ilet ve basılan rETH miktarını al
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        // Kullanıcının bakiyesini güncelle
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        // Sözleşmeleri yükle
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // rETH'yi çağırana transfer et
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
