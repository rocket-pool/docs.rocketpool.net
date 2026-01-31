# Houston 빠른 시작

숙련된 노드 운영자이든, rETH 보유자이든, 호기심 많은 관찰자이든, 이 페이지는 Houston에 포함된 새로운 기능을 탐색하는 데 도움이 될 것입니다.

##

### 투표권 초기화

무엇보다도, **노드 운영자**라면 가장 중요한 단계는 투표권을 잠금 해제하기 위해 [투표 초기화](../houston/participate#initializing-voting)를 하는 것입니다. 투표를 초기화한 노드는 네트워크의 총 투표권을 계산할 때 포함됩니다.

Houston의 시작 시점에서는 충분한 수의 노드가 투표를 초기화할 때까지 pDAO 투표가 비활성화됩니다. 이는 총 투표권과 정족수가 낮을 때 악의적인 제안이 통과되는 것을 방지하기 위함입니다. 충분한 노드가 투표를 초기화한 후에는 스위치가 전환되어 pDAO가 주도권을 갖게 됩니다.

투표권을 초기화하려면 smartnode에서 다음 명령을 사용하세요:

```shell
rocketpool pdao initialize-voting
```

이 작업은 한 번만 수행하면 됩니다. 투표를 초기화하면 노드의 투표권이 향후 온체인 제안에 포함되고 투표할 수 있게 됩니다.

### Snapshot 신호 주소 설정

둘째로, Snapshot 신호 주소를 설정해야 합니다. 이를 통해 노드 운영자는 노드 키를 핫 월렛에 노출하지 않고도 브라우저나 모바일 기기에서 Snapshot 투표에 참여할 수 있습니다.

이 설정에는 몇 가지 단계가 포함되므로 다음 가이드를 따르세요:
[Snapshot 신호 주소 설정](../houston/participate#setting-your-snapshot-signalling-address).

### 온체인 투표권 위임

선택한 커뮤니티 구성원에게 온체인 투표권을 위임하려면 [여기](../houston/participate#delegating-voting-power)를 클릭하여 방법을 알아보세요.

##

# 가이드

[전체 Houston 개요](../houston/whats-new)는 완전한 온체인 Protocol DAO를 제시하고 노드를 대신한 ETH staking, RPL 출금 주소 설정, 시간 기반 잔액 및 RPL 제출과 같은 새로운 기능을 소개합니다. Houston 스마트 컨트랙트 감사도 여기에서 찾을 수 있습니다.

[Protocol DAO](../houston/pdao)는 pDAO가 Rocket Pool을 누가 어떻게 관리하는지에 대해 논의합니다. 이 페이지에서는 재무 지출과 같은 pDAO 의무가 온체인에서 어떻게 실행될 수 있는지, 그리고 완전히 새로운 보안 위원회의 역할에 대해 알아볼 수 있습니다. 또한 pDAO 제안의 수명 주기를 안내하고 스팸을 방지하고 악의적인 제안을 차단하기 위해 취한 조치 중 일부를 설명합니다.

[제안 참여](../houston/participate)에는 노드 운영자가 pDAO 제안에 참여하는 방법에 대한 자세한 단계별 가이드가 포함되어 있습니다. 온체인 제안을 제기하거나 투표하거나 투표권을 위임하려는 경우 이 가이드를 참조하세요.

[노드를 대신한 ETH Stake](../houston/stake-eth-on-behalf.mdx)는 노드를 대신하여 ETH를 staking하는 단계를 안내합니다. 이는 단일 예금자 시나리오를 용이하게 하기 위해 Houston에 도입된 새로운 기능입니다. 메인넷에서 실제 ETH를 staking하기 전에 테스트넷에서 시도해 보고 싶다면 이 방법을 안내합니다.

[RPL 출금 주소](../houston/rpl-withdrawal-address)는 노드에 대한 RPL 출금 주소를 설정하는 방법을 보여줍니다. 이는 별도의 엔티티가 노드에 대한 RPL 보험 담보를 공급할 수 있도록 하려는 경우에 유용합니다.
