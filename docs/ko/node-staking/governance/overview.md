---
next:
  text: The Protocol DAO
  link: "/ko/legacy/houston/pdao#the-protocol-dao-pdao"
---

# 개요

이 섹션에서는 온체인 및 스냅샷 제안에 참여하기 위한 노드 설정 프로세스를 설명합니다. 다룰 내용이 많으므로 [Houston 업그레이드](/ko/legacy/houston/whats-new) 개요를 읽어보는 것을 강력히 권장합니다. 이를 통해 온체인 거버넌스를 가능하게 하는 최신 기능과 프로토콜 형성에 참여할 수 있는 방법을 이해하는 데 도움이 됩니다.

## 전제 조건

Smartnode를 구성하기 전에 다음 사항을 확인하세요:

- 노드 머신(또는 가상 머신)을 설정하고 보안을 설정했습니다([노드 보안](../securing-your-node) 가이드를 통해)
- Smartnode를 [설치](../installing/overview)하고 [구성](../config/overview)했습니다
- Smartnode에 노드 지갑이 로드되어 있습니다
- Execution 및 Consensus 클라이언트를 동기화했습니다
- [출금 주소](../prepare-node#setting-your-withdrawal-address)로 노드를 프로비저닝하고, [백업 클라이언트](../fallback)를 설정했으며(선택 사항), [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)을 선택했고(선택 사항), [MEV](../mev)를 구성했습니다
- 최소 하나의 [미니풀](../create-validator)을 생성했습니다

## 투표와 관련된 세 가지 주소가 있습니다

- pDAO Signalling 주소 — 직접 투표하거나 대리인의 스냅샷 투표를 재정의하려는 경우 스냅샷 주소로 사용됩니다. 이 주소는 온체인 투표가 아닌 스냅샷에만 사용됩니다.

- pDAO 대리 노드 — 투표를 위임하기로 선택한 경우. 이것을 대리인의 노드 주소로 설정합니다. 대리인을 선택하면 그들이 스냅샷과 온체인 제안에서 대신 투표합니다.

- 노드 주소 — 투표를 위임하지 않았거나 대리인의 온체인 투표를 재정의하려는 경우 노드에서 이 작업을 수행할 수 있습니다.

## 가이드

[Protocol DAO](/ko/legacy/houston/pdao#the-protocol-dao-pdao)는 pDAO가 Rocket Pool을 어떻게 관리하는지 논의합니다. 이 페이지는 재무 지출과 같은 pDAO 의무가 온체인에서 어떻게 실행될 수 있는지, 그리고 완전히 새로운 Security Council의 역할에 대해 알려줍니다. 또한 pDAO 제안의 수명 주기를 안내하고 스팸을 방지하고 악의적인 제안을 차단하기 위해 취한 일부 조치를 설명합니다.

[비 Smartnode 사용자를 위한 투표 설정](/ko/legacy/houston/nonsmartnode-setup)은 비 Smartnode 사용자(예: Allnodes 사용자)에게 투표 설정 방법을 보여줍니다.

[투표권 초기화](/ko/legacy/houston/participate#initializing-voting)는 노드의 투표권을 초기화하는 방법을 보여줍니다. 이 단계는 Houston 업그레이드 이전에 노드가 등록된 경우에만 필요합니다.

[스냅샷 시그널링 주소 설정](/ko/legacy/houston/participate#setting-your-snapshot-signalling-address)은 시그널링 주소를 설정하는 단계를 안내합니다. 노드의 개인 키를 핫 지갑에 로드할 필요 없이 노드의 투표권을 사용하여 스냅샷에서 투표할 수 있습니다. Smartnode CLI를 준비하고 이 가이드를 위해 노드 지갑이 아닌 주소를 준비하세요.

[투표권 위임](/ko/legacy/houston/participate#delegating-voting-power)은 제안에 직접 투표하는 대신 투표권을 위임하는 데 사용할 수 있는 빠른 명령입니다.

[제안 상태 보기](/ko/legacy/houston/participate#viewing-the-state-of-a-proposal)는 과거 및 진행 중인 온체인 제안 목록을 보는 방법에 대한 가이드입니다. 상태를 확인하고 주어진 온체인 제안의 세부 사항을 읽을 수 있습니다.

[제안 투표](/ko/legacy/houston/participate#voting-on-a-proposal)는 온체인 제안에 투표하는 방법을 보여줍니다. 이 가이드는 네 가지 옵션: **기권**, **찬성**, **반대** 및 **거부**에 대해서도 다룹니다.

[제안 생성](/ko/legacy/houston/participate#creating-a-proposal)은 온체인 제안을 제기하기 위한 요구 사항과 단계를 안내합니다.

[성공적인 제안 실행](/ko/legacy/houston/participate#executing-a-successful-proposal)은 성공적인 제안의 효과를 Rocket Pool 프로토콜에 적용하는 방법을 보여줍니다.

[본드 및 보상 청구](/ko/legacy/houston/participate#claiming-bonds-and-rewards)는 제안자 또는 챌린저가 본드 또는 보상을 청구할 수 있는 조건에 대해 논의합니다.

[반복적인 재무 지출 생성 및 청구](/ko/legacy/houston/participate#creating-a-recurring-treasury-spend)는 pDAO에 반복 지불을 추가, 수정 및 제거할 수 있는 완전한 제어권을 제공하는 기능입니다.
