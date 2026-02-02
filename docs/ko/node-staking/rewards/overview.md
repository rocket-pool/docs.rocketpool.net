---
next:
  text: Node Operator 보상 청구
  link: "/ko/node-staking/rewards"
---

# 개요

이 섹션에서는 검증하는 동안 노드가 생성하는 보상에 액세스하는 방법을 다룹니다.

## 전제 조건

Smartnode를 구성하기 전에 다음을 확인하십시오:

- 노드 머신(또는 가상 머신)을 설정하고 보안을 유지했습니다([노드 보안](../securing-your-node) 가이드를 통해)
- Smartnode가 [설치](../installing/overview)되고 [구성](../config/overview)되었습니다
- Smartnode에 노드 지갑이 로드되어 있습니다
- Execution 및 Consensus 클라이언트가 동기화되었습니다
- [출금 주소](../prepare-node.mdx#setting-your-withdrawal-address)로 노드를 프로비저닝하고, [대체 클라이언트](../fallback)를 설정했으며(선택 사항), [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)에 참여했으며(선택 사항), [MEV](../mev.mdx)를 구성했습니다
- 최소 하나의 [minipool](../create-validator.mdx)을 생성했습니다

## 가이드

[Node Operator 보상 청구](../rewards)는 RPL 보상 및 Execution 레이어 보상이 작동하는 방식과 이에 액세스하는 방법을 설명합니다.

[Skimmed 보상 분배](../skimming)는 프로토콜에 의해 주기적으로 "skimmed"되어 minipool에 전달되는 Beacon Chain의 보상에 액세스하는 방법을 다룹니다.
