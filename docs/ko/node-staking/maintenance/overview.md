---
next:
  text: 노드 성능 모니터링
  link: "/ko/node-staking/performance"
---

# 개요

이 섹션에서는 노드와 validator의 상태를 모니터링하고, 수익을 추적하며, 업데이트와 같은 정기적인 유지보수를 수행하는 방법을 배우게 됩니다.

## 사전 요구사항

Smartnode를 구성하기 전에 다음을 확인하십시오.

- 노드 머신(또는 가상 머신)을 설정하고 보안을 강화했습니다([노드 보안](../securing-your-node) 가이드 참조)
- Smartnode를 [설치](../installing/overview)하고 [구성](../config/overview)했습니다
- Smartnode에 노드 지갑이 로드되어 있습니다
- Execution 및 Consensus 클라이언트를 동기화했습니다
- 노드에 [출금 주소](../prepare-node.mdx#setting-your-withdrawal-address)를 프로비저닝하고, [대체 클라이언트](../fallback)를 설정했으며(선택 사항), [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)에 참여했고(선택 사항), [MEV](../mev.mdx)를 구성했습니다
- 최소 하나의 [minipool](../create-validator.mdx)을 생성했습니다

## 가이드

[노드 성능 모니터링](../performance)은 노드의 상태(CPU 및 RAM 소비와 같은 리소스 관점)와 Beacon Chain에서의 validator 성능을 추적하기 위한 몇 가지 도구와 튜토리얼을 제공합니다.
Ethereum validator로서의 활동 기간 동안 사용하게 될 많은 기본 도구를 다룹니다.

[Grafana 대시보드 설정](../grafana.mdx)은 Smartnode 스택의 메트릭 추적기와 Grafana 대시보드 설정을 안내합니다. Grafana 대시보드는 노드와 validator에 대한 모든 것을 모니터링하는 원스톱 솔루션이며, 모든 노드 운영자의 필수 도구입니다.
Grafana 대시보드를 탐색하고 정기적으로 확인하는 것을 _강력히_ 권장합니다.

[Smartnode 스택 알림 통지](./alerting.md)는 Smartnode 알림 통지 기능을 사용하여 Rocket Pool Smartnode의 상태 및 중요한 이벤트에 대한 알림을 받는 방법을 안내합니다.

[업데이트 확인](../updates)은 새로운 보안 패치로 노드를 정기적으로 업데이트하는 중요한 프로세스, 새 릴리스 후 Smartnode를 업데이트하는 방법, 그리고 선택한 클라이언트가 Smartnode의 최신 릴리스에 아직 포함되지 않은 새 버전을 릴리스한 경우 클라이언트 버전을 수동으로 업데이트하는 방법을 다룹니다.
업데이트가 릴리스될 때마다 참조해야 할 수 있으므로 이 섹션 전체를 숙지해야 합니다.

[노드 백업](../backups)은 하드웨어 장애 시 노드의 구성과 체인 데이터를 백업하는 방법을 설명하는 선택적 가이드입니다.

[Execution 클라이언트 가지치기](../pruning)는 SSD 디스크 공간을 점진적으로 소비하고 정기적인 가지치기(예: Geth 또는 Nethermind)가 필요한 Execution 클라이언트를 실행하는 모든 사람에게 **중요**합니다.
이러한 클라이언트 중 하나를 실행하는 경우 가지치기 프로세스를 반드시 숙지해야 합니다.

[Execution 또는 Consensus 클라이언트 변경](../change-clients)은 유용한 가이드입니다. 클라이언트 선택을 변경하는 프로세스와 프로세스 중 예상할 수 있는 사항을 설명합니다.
향후 어떤 이유로든 클라이언트를 전환해야 할 경우를 대비하여 이 가이드도 숙지하는 것이 좋습니다.
