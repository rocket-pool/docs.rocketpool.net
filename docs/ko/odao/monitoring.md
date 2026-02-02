# Oracle DAO 노드 모니터링

노드가 가동되어 실행 중이면 자동화된 작업을 올바르게 수행하고 있는지 정기적으로 상태를 모니터링하는 것이 중요합니다.
이를 위해서는 다음이 포함됩니다:

- OS 수준에서 물리적(또는 가상) 시스템의 상태 모니터링
- 실행 및/또는 합의 클라이언트의 상태 모니터링(로컬 클라이언트를 실행하는 경우)
- 노드가 상태 업데이트를 위해 필요한 트랜잭션을 체인에 정기적으로 제출하는지 확인
- 해당 트랜잭션을 실행하기 위해 노드 지갑에 충분한 ETH 잔액이 있는지 확인
- Smartnode, 클라이언트(해당하는 경우) 및 운영 체제에 대한 업데이트를 정기적으로 적용
- 다른 Oracle DAO 구성원의 상태를 모니터링하고 노드가 제대로 작동하지 않는다고 생각되면 그들과 소통

이 섹션에서는 Smartnode의 내장 [Grafana](https://grafana.com/) 지원을 통해 이를 수행하는 몇 가지 예를 설명합니다.

## 표준 Rocket Pool 대시보드

Smartnode는 위에 나열된 많은 메트릭을 모니터링할 수 있는 편리한 대시보드를 제공합니다.
각 합의 클라이언트에 대한 대시보드가 하나씩 있습니다.
다음은 Nimbus용 대시보드의 예입니다:

![](../node-staking/images/nimbus-dashboard.png)

- 머신의 하드웨어 상태는 왼쪽 상단 사분면에 표시됩니다.
- 왼쪽 하단 사분면의 네트워크 통계가 채워지면 실행 클라이언트가 제대로 작동합니다.
- 오른쪽 상단 사분면의 피어 수가 0이 아닌 숫자로 업데이트되면 합의 클라이언트가 제대로 작동합니다. 정확한 숫자는 클라이언트 선택과 네트워크 구성에 따라 다릅니다.
- 노드의 ETH 잔액은 오른쪽 하단의 표에 표시됩니다.
- 운영 체제 업데이트 또는 Smartnode 업데이트는 상단 중간 패널의 `Available Updates` 상자에 표시됩니다.

::: tip 참고
운영 체제 및 Smartnode 업데이트에는 `rocketpool service install-update-tracker`를 통해 설치할 수 있는 업데이트 추적기가 필요합니다.
:::

메트릭 시스템 및 Smartnode 대시보드를 준비하는 방법에 대한 자세한 내용은 Smartnode 문서의 [노드 성능 모니터링](../node-staking/performance) 및 [Grafana 대시보드 설정](../node-staking/grafana.mdx) 페이지를 참조하세요.

## Oracle DAO 대시보드

또한 Oracle DAO 구성원을 위해 특별히 맞춤화된 간단한 대시보드를 구축했습니다:

![](../odao/images/odao-dashboard.png)

이 대시보드는 다음을 추적합니다:

- 투표하거나 실행해야 하는 Oracle DAO 제안의 상태(다음 섹션에서 자세히 설명)
- 가격 및 잔액 업데이트 제출 이력\*
- 각 Oracle DAO 노드의 ETH 잔액

\*_현재 가격 및 잔액 제출에는 노드의 51%가 각각에 동의해야 하며, 그 시점에 제출이 정식화됩니다. 다른 구성원의 제출은 더 이상 필요하지 않으므로 되돌아갑니다. 노드가 특정 간격에 제출하지 않는다고 해서 오프라인인 것은 아닙니다. 연속으로 5개 이상의 간격을 놓친 경우 걱정해야 하며 `watchtower` 데몬 로그를 확인하여 문제가 없는지 확인해야 합니다._

이 대시보드를 활성화하는 것은 두 단계 프로세스입니다.

먼저 `rocketpool service config` 편집기의 `Metrics` 섹션에서 Oracle DAO 메트릭을 활성화하세요:

![](../odao/images/tui-odao-metrics.png)

Docker 또는 하이브리드 모드에서 실행하는 경우 변경 사항을 적용하기 위해 `node` 데몬이 다시 시작됩니다.
네이티브 모드에서 실행하는 경우 수동으로 `node` 서비스를 다시 시작하세요.

두 번째로 Grafana Labs의 [Oracle DAO 대시보드](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/)(ID `15003`)를 노드의 로컬 Grafana 서버로 가져오세요.

## 로그 확인

귀하 또는 다른 Oracle DAO 구성원 중 하나가 노드에 대해 우려를 표명한 경우 첫 번째 방어선은 다음 명령을 사용하여 `watchtower` 데몬 로그를 확인하는 것입니다(Docker 및 하이브리드 모드의 경우):

```shell
rocketpool service logs watchtower
```

이것은 watchtower 컨테이너에 대한 `docker` 로그를 표시하며 마지막 100줄 정도로 잘립니다.

더 뒤로 가려면 `-t` 플래그를 사용하여 줄 수를 나타낼 수 있습니다.
예를 들어:

```shell
rocketpool service logs watchtower -t 2000
```

마지막 2000줄을 표시합니다.
이것은 매우 빠르게 복잡해질 수 있으므로 스크롤 가능하도록 `less`와 같은 유틸리티로 파이프하는 것이 좋습니다.

## 다음 단계

다음 섹션에서는 Oracle DAO 구성원으로서 수동으로 수행해야 하는 작업을 다룹니다.
