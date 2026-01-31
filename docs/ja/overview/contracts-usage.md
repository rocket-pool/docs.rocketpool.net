# Smart Contracts

## はじめに

Rocket Pool [Smart Contracts](https://www.ethereum.org/learn/#smart-contracts)は、Rocket Poolプロトコルの基盤を形成します。これらは、ネットワークの他のすべての要素、Smart Nodeソフトウェアスタック、およびすべてのwebまたはアプリケーションインターフェースが構築される基盤となるインフラストラクチャ層です。

コントラクトとの直接的な対話は通常は必要なく、他のソフトウェアの使用を通じて容易になります。このセクションでは、コントラクトの設計の詳細な説明と、Rocket Poolを拡張したい開発者向けにRocket Poolの上に構築する方法に関する情報を提供します。すべてのコード例はSolidity `v0.7.6`として提供されています。

### Contract Design

Rocket Poolネットワークコントラクトは、ハブアンドスポークアーキテクチャを使用してアップグレード可能性を念頭に置いて構築されています。ネットワークの中央ハブは`RocketStorage`コントラクトで、プロトコル全体の状態を保存する責任があります。これは、キーバリューストレージのマップの使用と、キーの値を読み書きするためのgetterメソッドとsetterメソッドによって実装されています。

`RocketStorage`コントラクトは、他のすべてのネットワークコントラクトのアドレス（名前でキー化）も保存し、それらのコントラクトのみにデータ変更を制限します。このアーキテクチャを使用すると、既存のコントラクトの新しいバージョンをデプロイし、ストレージ内のアドレスを更新することでプロトコルをアップグレードできます。これにより、Rocket Poolはバグを修正したり、プロトコルを改善するための新機能を実装したりするために必要な柔軟性が得られます。

### Interacting With Rocket Pool

Rocket Poolネットワークとの対話を開始するには、まず[interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol)を使用して`RocketStorage`コントラクトのインスタンスを作成します。

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

上記のコンストラクタは、適切なネットワーク上の`RocketStorage`コントラクトのアドレスで呼び出す必要があります。

Rocket Poolのアーキテクチャのため、他のコントラクトのアドレスは直接使用するのではなく、使用前にブロックチェーンから取得する必要があります。以前の対話以降にネットワークのアップグレードが発生し、アドレスが古くなっている可能性があります。`RocketStorage`はアドレスを変更することはできないため、参照を保存しても安全です。

他のコントラクトインスタンスは、[Rocket Poolリポジトリ](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface)から取得した適切なインターフェースを使用して作成できます。例：

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
    }

}
```

`RocketStorage`で定義されているRocket Poolコントラクトは以下の通りです。

- `rocketVault` - ネットワークコントラクトが保持するETHを保存します（内部、アップグレード不可）
- `rocketAuctionManager` - node operatorのstakeからslashされたRPLのオークションを処理します
- `rocketDepositPool` - ユーザーが預けたETHを受け入れ、minipoolへの割り当てを処理します
- `rocketSmoothingPool` - priority feeとMEVを受け取ります
- `rocketMinipoolBase` - minipoolの初期化とdelegate upgradeロジックを含みます
- `rocketMinipoolBondReducer` - bondの削減ウィンドウとtrusted nodeのキャンセルを処理します
- `rocketMinipoolFactory` - minipoolコントラクトの作成を処理します
- `rocketMinipoolDelegate` - Minipoolユーティリティコントラクト（内部）
- `rocketMinipoolManager` - ネットワーク内のすべてのminipoolを作成および管理します
- `rocketMinipoolQueue` - minipoolをETH割り当てのキューに整理します
- `rocketMinipoolStatus` - watchtower nodeからのminipoolステータスの更新を処理します
- `rocketMinipoolPenalty` - oDAOによってnode operatorに適用されたペナルティを保存します
- `rocketNetworkBalances` - watchtower nodeからのネットワークバランスの更新を処理します
- `rocketNetworkFees` - ネットワークnode需要に基づいてnodeの手数料率を計算します
- `rocketNetworkPrices` - watchtower nodeからのRPL価格と有効なstakeの更新を処理します
- `rocketNetworkWithdrawal` - beacon chain validatorのwithdrawalの処理を処理します
- `rocketNetworkPenalties` - minipoolペナルティを処理します
- `rocketRewardsPool` - 各報酬コントラクトへの報酬の配分を処理します
- `rocketClaimDAO` - pDAOの報酬の請求を処理します
- `rocketNodeDeposit` - minipool作成のためのnodeデポジットを処理します
- `rocketMerkleDistributorMainnet` - RPLとETH報酬の配分を処理します
- `rocketNodeDistributorDelegate` - RocketNodeDistributorsのロジックを含みます
- `rocketNodeDistributorFactory` - RocketNodeDistributorコントラクトの作成を処理します
- `rocketNodeManager` - ネットワーク内のすべてのnodeを登録および管理します
- `rocketNodeStaking` - nodeのstakingとunstakingを処理します
- `rocketDAOProposal` - oDAOとpDAOの共通機能を含みます
- `rocketDAONodeTrusted` - oDAO関連の提案を処理します
- `rocketDAONodeTrustedProposals` - oDAO提案機能を含みます（内部）
- `rocketDAONodeTrustedActions` - oDAOアクション機能を含みます（内部）
- `rocketDAONodeTrustedUpgrade` - oDAOコントラクトのアップグレード機能を処理します（内部）
- `rocketDAONodeTrustedSettingsMembers` - trusted memberに関する設定を処理します
- `rocketDAONodeTrustedSettingsProposals` - 提案に関する設定を処理します
- `rocketDAONodeTrustedSettingsMinipool` - minipoolに関する設定を処理します
- `rocketDAONodeTrustedSettingsRewards` - 報酬に関する設定を処理します
- `rocketDAOProtocol` - pDAO関連の提案を処理します
- `rocketDAOProtocolProposals` - pDAO提案機能を処理します（内部）
- `rocketDAOProtocolActions` - pDAOアクション機能を処理します（内部）
- `rocketDAOProtocolSettingsInflation` - インフレーションに関する設定を処理します
- `rocketDAOProtocolSettingsRewards` - 報酬に関する設定を処理します
- `rocketDAOProtocolSettingsAuction` - オークションシステムに関する設定を処理します
- `rocketDAOProtocolSettingsNode` - node operatorに関する設定を処理します
- `rocketDAOProtocolSettingsNetwork` - ネットワークに関する設定を処理します
- `rocketDAOProtocolSettingsDeposit` - デポジットに関する設定を処理します
- `rocketDAOProtocolSettingsMinipool` - minipoolに関する設定を処理します
- `rocketTokenRETH` - rETHトークンコントラクト（アップグレード不可）
- `rocketTokenRPL` - RPLトークンコントラクト（アップグレード不可）
- `rocketUpgradeOneDotOne` - Rocket Pool protocol Redstoneアップグレードを処理しました
- `rocketUpgradeOneDotTwo` - Rocket Pool protocol Atlasアップグレードを処理しました
- `addressQueueStorage` - ユーティリティコントラクト（内部）
- `addressSetStorage` - ユーティリティコントラクト（内部）

初期デプロイ以降に`RocketStorage`から削除されたレガシーRocket Poolコントラクトは以下の通りです。

- `rocketClaimNode` - node operatorの報酬の請求を処理しました
- `rocketClaimTrustedNode` - oDAOの報酬の請求を処理しました

「内部」とマークされたコントラクトは、一般公開されているメソッドを提供しないため、拡張には通常役に立ちません。特定のコントラクトメソッドの情報については、[Rocket Poolリポジトリ](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface)のインターフェースを参照してください。

## Deposits

Rocket Poolネットワークを拡張する主な理由は、deposit poolにユーザーのデポジットを導くカスタムデポジットロジックを実装することです。たとえば、ファンドマネージャーは、独自のスマートコントラクトを介してユーザーのETHをRocket Poolにステークし、Rocket Poolの使用自体をユーザーから抽象化したい場合があります。

注：`RocketDepositPool`コントラクトアドレスは、コントラクトにハードコードするのではなく、`RocketStorage`から動的に取得する必要があります。詳細については、[Interacting With Rocket Pool](#interacting-with-rocket-pool)を参照してください。

### Implementation

以下は、預けられたETHをRocket Poolに転送し、鋳造されたrETHを呼び出し元に戻す基本的なサンプルコントラクトについて説明しています。

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
        require(msg.value > 0, "Invalid deposit amount");
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
