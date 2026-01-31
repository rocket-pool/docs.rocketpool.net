---
next:
  text: 새로운 Minipool(Validator) 생성
  link: "/ko/node-staking/create-validator"
---

::: danger 경고
Saturn 1 준비를 위해 minipool 예치가 현재 비활성화되어 있습니다.
:::

# 개요

이 섹션에서는 minipool(Rocket Pool validator) 생성 및 마이그레이션 프로세스를 다룹니다.
여기에서 Ethereum 네트워크 검증을 시작하고 이에 대한 보상을 받는 방법을 배우게 됩니다.

## 전제 조건

minipool을 실행하기 전에 다음을 확인하십시오:

- 노드 머신(또는 가상 머신)을 설정하고 보안을 유지했습니다([노드 보안](../securing-your-node) 가이드를 통해)
- Smartnode가 [설치](../installing/overview)되고 [구성](../config/overview)되어 있습니다
- Smartnode에 노드 지갑이 로드되어 있습니다
- Execution 및 Consensus 클라이언트가 동기화되었습니다
- [출금 주소](../prepare-node.mdx#setting-your-withdrawal-address)로 노드를 프로비저닝하고, [fallback 클라이언트](../fallback)를 설정했으며(선택 사항), [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)에 옵트인했으며(선택 사항), [MEV](../mev.mdx)를 구성했습니다

## 가이드

[새로운 Minipool(Validator) 생성](../create-validator.mdx)은 새로운 Rocket Pool minipool과 Beacon Chain의 해당 validator를 생성하는 프로세스를 설명합니다.
첫 번째 minipool을 만들든 이미 일부가 있고 다른 minipool을 만들고 싶든 이 가이드는 단계별로 안내합니다.

[Minipool Delegate](./delegates)는 minipool 계약이 무엇인지 약간 설명하고 대부분의 기능을 포함하는 **delegate** 계약을 소개합니다.
또한 네트워크 업그레이드 후 새로운 기능을 활용하기 위해 minipool의 delegate를 업데이트하는 방법을 보여줍니다.

[Solo Validator를 Minipool로 변환](../solo-staker-migration)은 Rocket Pool 외부의 기존 validator(예: solo staking에 사용하는 validator)를 Beacon Chain을 종료하고 새로운 minipool을 생성할 필요 없이 직접 Rocket Pool minipool로 변환하는 프로세스를 안내합니다.
이 기능을 활용하려는 solo staker라면 이것이 바로 당신을 위한 가이드입니다!

[16-ETH Minipool을 8-ETH로 마이그레이션](../leb-migration.mdx)은 minipool의 담보 ETH 양을 16 ETH에서 8 ETH로 줄이는 방법을 보여주며, 무료로 새로운 minipool을 생성하는 데 사용할 수 있는 8 ETH의 크레딧을 제공합니다(물론 가스에는 여전히 ETH가 필요합니다).

[예치 크레딧 시스템](../credit)은 위의 마이그레이션 중 하나를 수행한 후 ETH 담보금을 지불하지 않고도 새로운 minipool을 생성할 수 있는 "ETH Credit" 시스템을 다룹니다.
