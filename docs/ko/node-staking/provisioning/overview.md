---
next:
  text: Starting Rocketpool
  link: "/ko/node-staking/starting-rp"
---

# 개요

이 섹션에서는 Smartnode를 설치하고 구성한 후 Rocket Pool로 staking하기 위해 노드를 프로비저닝하는 방법에 대한 세부 사항을 다룹니다.
다룰 staking에 대한 정보가 많기 때문에 긴 섹션입니다. **첫 번째 minipool을 생성하기 전에 각 가이드를 읽어주십시오!**

## 전제 조건

staking을 위해 노드를 프로비저닝하기 전에 다음을 수행했는지 확인하십시오:

- 노드 머신(또는 가상 머신)을 설정하고 보안을 유지했습니다([노드 보안](../securing-your-node) 가이드를 통해)
- Smartnode를 [설치](../installing/overview)하고 [구성](../config/overview)했습니다

## 가이드

[Starting Rocket Pool](../starting-rp)은 각 모드에 대한 Smartnode 서비스를 시작하는 방법과 Execution 및 Consensus client의 동기화 진행 상황을 확인하는 방법을 보여줍니다.

[Creating a New Wallet](../wallet-init)은 노드를 처음 설정하는 경우 Smartnode로 새 wallet을 생성하는 프로세스를 안내합니다.

[Importing / Recovering an Existing Wallet](../recovering-rp.mdx)은 새 wallet 생성의 대안입니다.
이미 노드에 복구하려는 node wallet이 있는 경우(또는 Allnodes와 같은 서비스에서 자체 하드웨어로 마이그레이션하는 경우) 이 가이드를 사용하십시오.

[Preparing your Node for Operation](../prepare-node.mdx)은 wallet이 노드에 로드된 후, ETH 또는 RPL(물론 가스 비용을 위한 소량의 ETH 제외)로 자금을 지원하기 훨씬 전에 수행하려는 몇 가지 중요한 첫 단계를 다룹니다.

[Specifying a Fallback Node](../fallback)는 노드가 두 번째(외부 관리) Execution 및 Consensus client 쌍을 가리키는 선택적 프로세스를 안내합니다. 이는 기본 client가 다운될 경우 백업 역할을 하여 유지 관리를 수행하는 동안 노드가 계속 검증할 수 있도록 합니다.

[Fee Distributors and the Smoothing Pool](../fee-distrib-sp)은 validator 중 하나가 블록을 제안할 때마다 Execution layer 보상이 노드에 제공되는 방식, 해당 보상을 수집하는 방법에 대해 논의하고 Rocket Pool의 **Smoothing Pool**을 설명합니다 - 모든 사람의 Execution layer 보상을 결합하고 Rocket Pool의 정기 보상 간격 동안 균등하게 분배하는 인기 있는 기능입니다.

[MEV, MEV-Boost, and MEV Rewards](../mev.mdx)는 **최대 추출 가능 가치(Maximum-Extractable Value)** (MEV), staking 생태계에서의 역할 및 Smartnode를 사용하여 원하는 대로 구성하는 방법을 설명합니다.
