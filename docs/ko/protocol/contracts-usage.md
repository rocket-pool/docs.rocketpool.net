# Smart Contracts

## 소개

Rocket Pool [Smart Contracts](https://www.ethereum.org/learn/#smart-contracts)는 Rocket Pool 프로토콜의 기반을 형성합니다. 이는 네트워크의 다른 모든 요소, Smart Node 소프트웨어 스택 및 모든 웹 또는 애플리케이션 인터페이스가 구축되는 인프라의 기본 계층입니다.

컨트랙트와의 직접적인 상호작용은 일반적으로 필요하지 않으며 다른 소프트웨어를 사용하여 용이하게 이루어집니다. 이 섹션에서는 컨트랙트 설계에 대한 자세한 설명과 Rocket Pool을 확장하려는 개발자를 위한 정보를 제공합니다. 모든 코드 예제는 Solidity `v0.7.6`으로 작성되었습니다.

### 컨트랙트 설계

Rocket Pool 네트워크 컨트랙트는 업그레이드 가능성을 염두에 두고 허브 앤 스포크 아키텍처를 사용하여 구축되었습니다. 네트워크의 중앙 허브는 `RocketStorage` 컨트랙트로, 전체 프로토콜의 상태를 저장하는 역할을 합니다. 이는 키-값 저장을 위한 맵 사용과 키에 대한 값을 읽고 쓰는 getter 및 setter 메서드를 통해 구현됩니다.

`RocketStorage` 컨트랙트는 또한 모든 다른 네트워크 컨트랙트의 주소를 (이름으로 키가 지정되어) 저장하며, 데이터 수정을 해당 컨트랙트로만 제한합니다. 이 아키텍처를 사용하여 기존 컨트랙트의 새 버전을 배포하고 스토리지에서 주소를 업데이트함으로써 프로토콜을 업그레이드할 수 있습니다. 이를 통해 Rocket Pool은 버그를 수정하거나 프로토콜을 개선하기 위한 새로운 기능을 구현하는 데 필요한 유연성을 얻습니다.

### Interacting With Rocket Pool

Rocket Pool 네트워크와 상호작용을 시작하려면 먼저 [interface](https://github.com/rocket-pool/rocketpool/blob/master/contracts/interface/RocketStorageInterface.sol)를 사용하여 `RocketStorage` 컨트랙트의 인스턴스를 생성합니다.

```solidity
import "RocketStorageInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(0);

    constructor(address _rocketStorageAddress) public {
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

}
```

위 생성자는 적절한 네트워크의 `RocketStorage` 컨트랙트 주소로 호출되어야 합니다.

Rocket Pool의 아키텍처 때문에 다른 컨트랙트의 주소는 직접 사용되어서는 안 되며 사용 전에 블록체인에서 가져와야 합니다. 이전 상호작용 이후 네트워크 업그레이드가 발생하여 주소가 오래되었을 수 있습니다. `RocketStorage`는 절대 주소를 변경할 수 없으므로 참조를 저장하는 것이 안전합니다.

다른 컨트랙트 인스턴스는 [Rocket Pool repository](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface)에서 가져온 적절한 인터페이스를 사용하여 생성할 수 있습니다. 예를 들어:

```solidity
import "RocketStorageInterface.sol";
import "RocketDepositPoolInterface.sol";

contract Example {

    RocketStorageInterface rocketStorage = RocketStorageInterface(address(0));

    constructor(address _rocketStorageAddress) public {
        // It is safe to store reference to RocketStorage
        rocketStorage = RocketStorageInterface(_rocketStorageAddress);
    }

    function exampleMethod() public {
        // All other contracts should be queried each time they are used
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        // ...
    }

}
```

`RocketStorage`에 정의된 Rocket Pool 컨트랙트는 다음과 같습니다:

- `rocketVault` - 네트워크 컨트랙트가 보유한 ETH 저장 (internal, 업그레이드 불가)
- `rocketAuctionManager` - Node Operator의 stake에서 슬래시된 RPL 경매 처리
- `rocketDepositPool` - 사용자가 예치한 ETH를 받고 minipool에 할당 처리
- `rocketSmoothingPool` - 우선 수수료와 MEV 수신
- `rocketMinipoolBase` - minipool의 초기화 및 delegate 업그레이드 로직 포함
- `rocketMinipoolBondReducer` - 본드 감소 기간 및 신뢰할 수 있는 노드 취소 처리
- `rocketMinipoolFactory` - minipool 컨트랙트 생성 처리
- `rocketMinipoolDelegate` - Minipool 유틸리티 컨트랙트 (internal)
- `rocketMinipoolManager` - 네트워크의 모든 minipool 생성 및 관리
- `rocketMinipoolQueue` - ETH 할당을 위해 minipool을 큐로 구성
- `rocketMinipoolStatus` - watchtower 노드로부터 minipool 상태 업데이트 처리
- `rocketMinipoolPenalty` - oDAO가 Node Operator에게 적용한 페널티 저장
- `rocketNetworkBalances` - watchtower 노드로부터 네트워크 잔액 업데이트 처리
- `rocketNetworkFees` - 네트워크 노드 수요에 따라 노드 커미션 비율 계산
- `rocketNetworkPrices` - watchtower 노드로부터 RPL 가격 및 유효 stake 업데이트 처리
- `rocketNetworkWithdrawal` - Beacon Chain validator 출금 처리
- `rocketNetworkPenalties` - minipool 페널티 처리
- `rocketRewardsPool` - 각 보상 컨트랙트에 보상 분배 처리
- `rocketClaimDAO` - pDAO에 대한 보상 청구 처리
- `rocketNodeDeposit` - minipool 생성을 위한 노드 예치 처리
- `rocketMerkleDistributorMainnet` - RPL 및 ETH 보상 분배 처리
- `rocketNodeDistributorDelegate` - RocketNodeDistributors에 대한 로직 포함
- `rocketNodeDistributorFactory` - RocketNodeDistributor 컨트랙트 생성 처리
- `rocketNodeManager` - 네트워크의 모든 노드 등록 및 관리
- `rocketNodeStaking` - 노드 staking 및 unstaking 처리
- `rocketDAOProposal` - oDAO 및 pDAO 공통 기능 포함
- `rocketDAONodeTrusted` - oDAO 관련 제안 처리
- `rocketDAONodeTrustedProposals` - oDAO 제안 기능 포함 (internal)
- `rocketDAONodeTrustedActions` - oDAO 작업 기능 포함 (internal)
- `rocketDAONodeTrustedUpgrade` - oDAO 컨트랙트 업그레이드 기능 처리 (internal)
- `rocketDAONodeTrustedSettingsMembers` - 신뢰할 수 있는 멤버 관련 설정 처리
- `rocketDAONodeTrustedSettingsProposals` - 제안 관련 설정 처리
- `rocketDAONodeTrustedSettingsMinipool` - minipool 관련 설정 처리
- `rocketDAONodeTrustedSettingsRewards` - 보상 관련 설정 처리
- `rocketDAOProtocol` - pDAO 관련 제안 처리
- `rocketDAOProtocolProposals` - pDAO 제안 기능 처리 (internal)
- `rocketDAOProtocolActions` - pDAO 작업 기능 처리 (internal)
- `rocketDAOProtocolSettingsInflation` - 인플레이션 관련 설정 처리
- `rocketDAOProtocolSettingsRewards` - 보상 관련 설정 처리
- `rocketDAOProtocolSettingsAuction` - 경매 시스템 관련 설정 처리
- `rocketDAOProtocolSettingsNode` - Node Operator 관련 설정 처리
- `rocketDAOProtocolSettingsNetwork` - 네트워크 관련 설정 처리
- `rocketDAOProtocolSettingsDeposit` - 예치 관련 설정 처리
- `rocketDAOProtocolSettingsMinipool` - minipool 관련 설정 처리
- `rocketTokenRETH` - rETH 토큰 컨트랙트 (업그레이드 불가)
- `rocketTokenRPL` - RPL 토큰 컨트랙트 (업그레이드 불가)
- `rocketUpgradeOneDotOne` - Rocket Pool 프로토콜 Redstone 업그레이드 처리
- `rocketUpgradeOneDotTwo` - Rocket Pool 프로토콜 Atlas 업그레이드 처리
- `addressQueueStorage` - 유틸리티 컨트랙트 (internal)
- `addressSetStorage` - 유틸리티 컨트랙트 (internal)

초기 배포 이후 `RocketStorage`에서 제거된 레거시 Rocket Pool 컨트랙트는 다음과 같습니다:

- `rocketClaimNode` - Node Operator에 대한 보상 청구 처리
- `rocketClaimTrustedNode` - oDAO에 대한 보상 청구 처리

"internal"로 표시된 컨트랙트는 일반 대중이 액세스할 수 있는 메서드를 제공하지 않으므로 일반적으로 확장에 유용하지 않습니다. 특정 컨트랙트 메서드에 대한 정보는 [Rocket Pool repository](https://github.com/rocket-pool/rocketpool/tree/master/contracts/interface)의 인터페이스를 참조하세요.

## Deposits

Rocket Pool 네트워크를 확장하는 주요 이유는 사용자 예치를 Deposit Pool로 유입시키는 맞춤형 예치 로직을 구현하기 위함입니다. 예를 들어, 펀드 매니저는 자신의 smart contracts를 통해 사용자의 ETH를 Rocket Pool에 stake하고 Rocket Pool 사용 자체를 사용자로부터 추상화하고자 할 수 있습니다.

참고: `RocketDepositPool` 컨트랙트 주소는 컨트랙트에 하드코딩되어서는 안 되며 `RocketStorage`에서 동적으로 가져와야 합니다. 자세한 내용은 [Interacting With Rocket Pool](#interacting-with-rocket-pool)을 참조하세요.

### Implementation

다음은 예치된 ETH를 Rocket Pool로 전달하고 발행된 rETH를 호출자에게 돌려주는 기본 예제 컨트랙트입니다:

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
        // Check deposit amount
        require(msg.value > 0, "Invalid deposit amount");
        // Load contracts
        address rocketDepositPoolAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketDepositPool")));
        RocketDepositPoolInterface rocketDepositPool = RocketDepositPoolInterface(rocketDepositPoolAddress);
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Forward deposit to RP & get amount of rETH minted
        uint256 rethBalance1 = rocketTokenRETH.balanceOf(address(this));
        rocketDepositPool.deposit{value: msg.value}();
        uint256 rethBalance2 = rocketTokenRETH.balanceOf(address(this));
        require(rethBalance2 > rethBalance1, "No rETH was minted");
        uint256 rethMinted = rethBalance2 - rethBalance1;
        // Update user's balance
        balances[msg.sender] += rethMinted;
    }

    function withdraw() external {
        // Load contracts
        address rocketTokenRETHAddress = rocketStorage.getAddress(keccak256(abi.encodePacked("contract.address", "rocketTokenRETH")));
        RocketTokenRETHInterface rocketTokenRETH = RocketTokenRETHInterface(rocketTokenRETHAddress);
        // Transfer rETH to caller
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        require(rocketTokenRETH.transfer(msg.sender, balance), "rETH was not transferred to caller");
    }

}
```
