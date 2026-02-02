---
next:
  text: The Protocol DAO
  link: "/ko/pdao/pdao"
---

# 개요

이 섹션은 온체인 및 snapshot 제안에 참여하기 위해 노드를 설정하는 과정을 설명합니다. 다루어야 할 내용이 많으므로 [Houston 업그레이드](/ko/legacy/houston/whats-new) 개요를 먼저 읽어보실 것을 강력히 권장합니다. 이를 통해 온체인 거버넌스를 가능하게 하는 최신 기능과 프로토콜 형성에 참여하는 방법을 이해할 수 있습니다.

## 전제 조건

Smartnode를 구성하기 전에 다음을 확인해주세요:

- 노드 머신(또는 가상 머신)을 설정하고 보안을 설정했는지 확인([노드 보안](/ko/node-staking/securing-your-node) 가이드를 통해)
- Smartnode를 [설치](/ko/node-staking/installing/overview)하고 [구성](/ko/node-staking/config/overview)했는지 확인
- Smartnode에 노드 지갑을 로드했는지 확인
- Execution 및 Consensus 클라이언트를 동기화했는지 확인
- [출금 주소](/ko/node-staking/prepare-node#setting-your-withdrawal-address)로 노드를 프로비저닝하고, [폴백 클라이언트](/ko/node-staking/fallback) 설정(선택 사항), [Smoothing Pool](/ko/node-staking/fee-distrib-sp#the-smoothing-pool) 가입(선택 사항), [MEV](/ko/node-staking/mev) 구성을 완료했는지 확인
- 최소 하나의 [minipool](/ko/node-staking/create-validator)을 생성했는지 확인

## 투표에 관련된 세 가지 주소

- pDAO Signalling Address — 직접 투표하거나 위임자의 Snapshot 투표를 재정의하려는 경우 Snapshot 주소로 사용됩니다. 이 주소는 Snapshot에만 사용되며 온체인 투표에는 사용되지 않습니다.

- pDAO Delegate Node — 투표를 위임하기로 선택한 경우, 위임자의 노드 주소로 설정합니다. 위임자를 선택하면 해당 위임자가 Snapshot 및 온체인 제안에 대해 투표합니다.

- Node Address — 투표를 위임하지 않았거나 위임자의 온체인 투표를 재정의하려는 경우 노드에서 직접 수행할 수 있습니다.

## 가이드

[The Protocol DAO](/ko/pdao/pdao)는 pDAO가 누구이며 Rocket Pool을 어떻게 관리하는지 설명합니다. 이 페이지는 재무 지출과 같은 pDAO 업무가 온체인에서 어떻게 실행되는지, 그리고 완전히 새로운 Security Council의 역할을 알려줍니다. 또한 pDAO 제안의 라이프사이클을 안내하고 스팸을 방지하고 악의적인 제안을 차단하기 위한 조치를 설명합니다.

[Voting setup for non-smartnode users](/ko/legacy/houston/nonsmartnode-setup)는 Smartnode를 사용하지 않는 사용자(예: Allnodes 사용자)가 투표를 설정하는 방법을 보여줍니다.

[Initializing Voting Power](/ko/pdao/participate#initializing-voting)는 노드의 투표권을 초기화하는 방법을 보여줍니다. 이 단계는 Houston 업그레이드 이전에 노드를 등록한 경우에만 필요합니다.

[Setting your Snapshot Signalling Address](/ko/pdao/participate#setting-your-snapshot-signalling-address)는 Signalling Address를 설정하는 단계를 안내합니다. 이를 통해 노드의 개인 키를 핫 월렛에 로드하지 않고도 노드의 투표권을 사용하여 Snapshot에서 투표할 수 있습니다. Smartnode CLI를 준비하고 이 가이드를 위해 노드 지갑이 아닌 주소를 준비하세요.

[Delegating Voting Power](/ko/pdao/participate#delegating-voting-power)는 제안에 직접 투표하는 대신 투표권을 위임하는 데 사용할 수 있는 빠른 명령입니다.

[Viewing the State of a Proposal](/ko/pdao/participate#viewing-the-state-of-a-proposal)은 과거 및 진행 중인 온체인 제안 목록을 보는 방법에 대한 가이드입니다. 주어진 온체인 제안의 상태를 확인하고 세부 정보를 읽을 수 있습니다.

[Voting on a Proposal](/ko/pdao/participate#voting-on-a-proposal)은 온체인 제안에 투표하는 방법을 보여줍니다. 이 가이드는 **Abstain**, **For**, **Against**, **Veto**의 네 가지 옵션도 다룹니다.

[Creating a Proposal](/ko/pdao/participate#creating-a-proposal)은 온체인 제안을 제기하기 위한 요구 사항과 단계를 안내합니다.

[Executing a successful proposal](/ko/pdao/participate#executing-a-successful-proposal)은 성공한 제안의 효과를 Rocket Pool 프로토콜에 적용하는 방법을 보여줍니다.

[Claiming Bonds and Rewards](/ko/pdao/participate#claiming-bonds-and-rewards)는 제안자 또는 도전자가 보증금이나 보상을 청구할 수 있는 조건을 설명합니다.

[Creating and Claiming a recurring treasury spend](/ko/pdao/participate#creating-a-recurring-treasury-spend)는 pDAO가 반복적인 지급을 추가, 수정 및 제거하는 데 대한 완전한 제어권을 제공하는 기능입니다.
