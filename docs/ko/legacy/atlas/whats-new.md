# Atlas 업데이트

::: tip 참고
Atlas는 `2023년 4월 18일 00:00 UTC`에 배포되었습니다. 최신 프로토콜 업그레이드인 Houston에 대해 읽으려면 [여기](../houston/whats-new)를 방문하세요.
:::

이 페이지는 **Atlas**라는 Rocket Pool의 다음 주요 업데이트가 프로토콜에 가져오는 주요 변경 사항을 설명합니다. 여기에는 Smartnode 스택과 Rocket Pool 프로토콜 전반에 대한 업데이트가 포함됩니다.

이전 버전의 Rocket Pool(Redstone)과 Atlas 간의 모든 차이점을 이해하기 위해 이 페이지를 철저히 읽어주세요.

## 새로운 프로토콜 기능

Atlas는 커뮤니티 피드백과 Ethereum 프로토콜 자체의 변경 사항을 기반으로 한 몇 가지 흥미로운 새로운 기능을 제공합니다.
다음은 이러한 변경 사항의 간략한 목록입니다 - 자세한 내용을 보려면 항목을 클릭하세요.

### Shapella와 출금

Ethereum 프로토콜은 다음 주요 업그레이드를 준비하고 있습니다: 실행 레이어의 **Shanghai**와 합의 레이어의 **Capella** - 이 둘이 이제 상호 연결되어 있기 때문에 동시에 발생합니다.
Ethereum 사용자들은 이 결합된 업그레이드를 애정을 담아 [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement)라고 부르게 되었습니다.

Shapella는 Beacon Chain에 **출금**을 도입하여 노드 운영자가 현재 Beacon Chain에 잠겨 있는 ETH에 접근할 수 있게 됩니다.
이것은 두 가지 형태로 제공됩니다:

- 부분 출금 (**스키밍**), 보상(32 ETH를 초과하는 Beacon Chain 잔액)이 실행 레이어의 minipool로 전송됩니다. 이것은 주기적으로(메인넷에서 약 4~5일마다) _프로토콜 자체에 의해 자동으로_ 수행됩니다.
- **전체 출금**, validator를 Beacon Chain에서 종료하고 전체 잔액이 실행 레이어의 minipool로 전송됩니다. 이것은 validator가 체인에서 충분히 오래 종료된 후 _프로토콜 자체에 의해 자동으로_ 수행됩니다.

Atlas는 노드 운영자가 언제든지 minipool의 ETH 잔액을 **분배**하여 노드 운영자와 rETH 보유자 사이에 균등하게 분할할 수 있는(물론 수수료 포함) 새로운 minipool용 위임 계약을 도입합니다.
이를 통해 노드 운영자는 Beacon Chain 보상에 **즉시 접근**할 수 있습니다!
또한 rETH 보유자의 몫을 예금 풀로 되돌려 프로토콜의 환율로 rETH를 ETH로 언스테이킹하거나 새로운 minipool을 만드는 데 사용할 수 있습니다.

### 8-ETH 본딩 Minipool

Atlas에서 가장 기대되는 변경 사항 중 하나는 16 ETH 대신 8 ETH만 제공하여 minipool을 만들 수 있는 기능의 도입입니다.
소유한 노드 운영자가 8 ETH만 본딩한 Minipool은 스테이킹 풀(rETH 보유자가 제공)에서 **24 ETH**와 매칭되어 validator를 만듭니다.
이는 자신의 validator를 실행하는 데 필요한 자본 요구 사항을 크게 줄이고 _노드 운영자와 rETH 스테이커 모두에게 더 큰 수익을 제공합니다_!
실제로 16-ETH minipool 하나 대신 8-ETH minipool 두 개를 실행하면 **18% 이상의 보상을 더** 제공합니다 - 16-ETH minipool의 수수료율이 20%인 경우에도 마찬가지입니다.

8 ETH minipool을 만들려면 **최소 2.4 ETH 상당의 RPL**과 **최대 12 ETH 상당의 RPL**을 스테이킹해야 합니다.
이는 프로토콜에서 _빌리는_ 금액의 10%와 자신이 _본딩_(스테이킹)하는 금액의 150%를 나타냅니다.

새로운 minipool은 8 ETH 또는 16 ETH로 생성할 수 있습니다.
16 ETH minipool은 현재 작동하는 방식과 변경되지 않았으며 RPL 토큰에 대한 노출을 최소화하려는 사용자를 위해 사용할 수 있습니다.

8 ETH 본드를 사용하여 새로운 minipool을 만드는 방법을 알아보려면 [minipool 생성 가이드](../../node-staking/create-validator.mdx)를 방문하세요.

또한 Atlas가 적용되면 노드 운영자는 **종료할 필요 없이 기존 16-ETH minipool을 8-ETH minipool로 직접 마이그레이션**할 수 있습니다.
이를 통해 [예금 크레딧](../../node-staking/credit)으로 8 ETH를 돌려받을 수 있으며, 이를 사용하여 **새로운 8-ETH minipool을 무료로 생성**할 수 있습니다!

8-ETH 본드 minipool에 대해 자세히 알아보려면 [본드 감소 가이드](../../node-staking/leb-migration.mdx)를 방문하세요.

### 솔로 Validator 변환

Shapella 업그레이드의 일부는 솔로 validator가 원래(현재 사용되지 않음) BLS 기반 출금 키에서 실행 레이어의 주소로 [validator의 출금 자격 증명을 변경](https://notes.ethereum.org/@launchpad/withdrawals-faq)할 수 있는 기능을 포함합니다.
이 주소는 해당 validator의 모든 보상과 Beacon Chain에서 종료된 후 전체 ETH 잔액의 수신자가 됩니다.

일반 Rocket Pool 노드 운영자는 minipool을 생성할 때 프로토콜이 자동으로 설정했기 때문에 이에 대해 걱정할 필요가 없습니다.
_그러나_ 솔로 validator에 대한 이 새로운 요구 사항의 일부로 Atlas는 흥미로운 기회를 제공합니다: **기존 솔로 validator**의 출금 주소가 될 **특수 minipool을 생성**할 수 있는 기능입니다.

즉, 이를 통해 **종료할 필요 없이 솔로 validator를 Rocket Pool minipool로 직접 변환**할 수 있습니다!

이는 다음을 포함한 Rocket Pool minipool의 모든 이점을 얻을 수 있음을 의미합니다:

- 하나의 validator(32 ETH 본드 포함)를 **네 개의 minipool**(각각 8 ETH 본드 포함)로 변환하여 Beacon Chain에서의 존재를 효과적으로 **4배로 늘릴** 수 있는 능력
- rETH 스테이커가 제공하는 해당 minipool 부분에 대한 수수료
- 블록 제안 및 MEV의 보상을 풀링하고 균등하게 분배하기 위한 Rocket Pool의 [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool)에 대한 액세스

솔로 validator를 minipool로 변환하는 방법에 대해 자세히 알아보려면 [솔로 Validator를 Minipool로 변환](../../node-staking/solo-staker-migration) 가이드를 방문하세요.

## 새로운 Smartnode 기능

Rocket Pool 프로토콜에 대한 핵심 변경 사항 외에도 Atlas는 v1.9.0에 있는 Smartnode 스택 자체에 대한 몇 가지 흥미로운 업그레이드를 제공합니다.

### 자동 보상 배분

이미 활성 Rocket Pool 노드 운영자라면 특정 자동화된 프로세스를 처리하는 `rocketpool_node` 프로세스에 익숙할 것입니다.
예를 들어, 올바른 수수료 수신자가 있는지 확인하고 `prelaunch` minipool이 12시간 스크럽 확인을 통과한 후 자동으로 두 번째 `stake` 트랜잭션을 실행합니다.

Atlas부터 `node`는 새로운 임무를 갖습니다: **minipool 보상의 자동 배분!**
이는 [Shapella 업그레이드가 작동하는 방식](../../node-staking/skimming) 때문이며, 며칠마다 Beacon Chain에서 minipool로 보상을 스키밍합니다.

minipool 중 하나가 사용자 지정 임계값(기본값 1 ETH)보다 큰 잔액에 도달하면 노드가 자동으로 `distribute-balance`를 실행합니다.
이렇게 하면 보상의 일부가 출금 주소로 전송되고 풀 스테이커의 몫은 예금 풀로 돌아갑니다.

임계값 변경은 `service config` TUI의 `Smartnode and TX Fees` 섹션에 있는 `Auto-Distribute Threshold` 설정에서 수행할 수 있습니다.

### 통합 Grafana 대시보드

많은 요청에 따라 노드 운영자가 노드의 상태, 진행 상황 및 전반적인 상태를 추적하고 평가하는 데 도움이 되는 새로운 [**Grafana 대시보드**](https://grafana.com/grafana/dashboards/21863)를 만들었습니다:

![](../../node-staking/images/grafana-1.3.jpg)

다음과 같은 많은 요청 기능이 제공됩니다:

- 단일 대시보드에서 모든 실행 및 합의 클라이언트 지원 - 더 이상 사용 중인 클라이언트에 따라 대시보드를 변경할 필요가 없습니다!
- CPU 및 RAM 사용량, 피어 수를 포함한 실행 클라이언트 통계
- 이전 에포크에 대한 증명이 얼마나 "정확"했는지 추적하는 증명 정확도 추적으로, 최적의 보상에서 얼마나 떨어져 있는지 알 수 있습니다
- Smoothing Pool 잔액 추적
- Smoothing Pool의 ETH를 포함한 청구 및 미청구 보상 추적
- Rocket Pool의 Snapshot 기반 거버넌스 투표에 대한 통계
- OS용 하나와 체인 데이터용 다른 하나가 있는 경우 두 번째 SSD의 사용된 공간 및 온도를 추적할 수 있는 공간
- 그리고 더 많은 것!

[Grafana 가이드](../../node-staking/grafana.mdx)를 따라 ID `21863`를 사용하여 공식 Grafana 서비스에서 새 대시보드를 가져올 수 있습니다.

이 새 대시보드는 커뮤니티 회원인 **0xFornax**의 광범위한 도움을 포함한 사랑의 노동이었습니다 - 모든 노고에 감사드립니다!

### Nimbus 변경 사항

Smartnode v1.9.0은 Nimbus에 대한 **분할 모드 지원**을 도입합니다!
단일 프로세스/컨테이너 내에서 Beacon Node와 Validator Client를 실행하는 대신 Smartnode는 이제 다른 클라이언트처럼 별도의 컨테이너에서 실행합니다. 이것은 다음과 같은 이점이 있습니다:

- Nimbus는 이제 **대체 클라이언트**를 지원합니다(기본 클라이언트가 다시 동기화와 같은 유지 관리를 위해 다운되었을 때 Nimbus의 Validator Client가 연결할 수 있는 보조 실행 클라이언트 및 Beacon Node).
- Nimbus는 이제 **외부 관리(하이브리드) 모드**에서 지원되므로 Smartnode가 관리하는 Validator Client를 직접 유지 관리하는 외부 Beacon Node와 결합할 수 있습니다.
- 새로운 minipool을 추가한 후 Beacon Node를 다시 시작할 필요가 없으므로 피어에 다시 연결하는 동안 증명을 잃지 않습니다.

### Lodestar 지원

[Lodestar](https://chainsafe.github.io/lodestar/)는 이제 선택한 합의 클라이언트의 옵션으로 지원됩니다!
이것은 [Ethereum의 Launchpad](https://launchpad.ethereum.org/en/lodestar)에 공식적으로 수락된 최신 추가 사항이며 검증할 준비가 되었습니다.
Lodestar는 Doppelganger Detection, MEV-Boost, 외부 관리 클라이언트(하이브리드 모드) 등을 포함하여 다른 클라이언트에서 사랑받아온 많은 훌륭한 기능을 지원합니다!

### 새로운 네트워크 스냅샷 시스템

약간 더 기술적인 측면에서 v1.9.0은 실행 및 합의 레이어 모두에서 **노드에 대한 모든 것**의 상태 스냅샷을 빠르게 캡처하는 새로운 시스템을 도입합니다.
내부적으로 이 시스템은 [MakerDAO의 multicall 계약](https://github.com/makerdao/multicall)과 Will O'Beirne의 [Ethereum Balance Checker 계약](https://github.com/wbobeirne/eth-balance-checker)을 활용하여 수천 개의 개별 실행 클라이언트 쿼리를 단일 요청으로 일괄 처리합니다.

이를 통해 `node` 프로세스가 많은 수의 validator를 가진 노드 운영자의 실행 클라이언트에 훨씬 덜 부담이 되며 CPU 부하를 크게 줄여 증명 및 전반적인 보상을 개선할 수 있습니다.

이 새로운 시스템은 아직 CLI 자체에 적용되지 않았으므로 거기에서 실행하는 명령(예: `rocketpool minipool status`)은 여전히 이전 단일 쿼리 설정을 사용합니다.
시간이 지남에 따라 CLI에도 도입할 것이며, 이를 통해 모든 명령이 매우 빠르게 실행됩니다(_트랜잭션 검증을 기다리는 것은 제외하며, 여전히 시간이 걸립니다_).
