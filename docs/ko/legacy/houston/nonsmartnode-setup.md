# 비스마트노드 사용자를 위한 투표 설정

일부 사용자(예: Allnodes 사용자)는 스마트노드를 사용하지 않으며 직접 컨트랙트 상호작용을 통해 투표를 설정해야 할 수 있습니다.
이 가이드에는 이러한 사용자를 위한 최소 설정 가이드와 전체 설정 가이드가 모두 포함되어 있습니다.

::: tip
이를 위해 노드 주소를 하드웨어 지갑에 로드해야 합니다.
:::

## 최소 설정 가이드

이를 통해 위임자가 온체인 및 오프체인에서 귀하를 대신하여 투표할 수 있습니다. 온체인에서는 위임자를 재정의할 수 있지만 오프체인에서는 불가능합니다.

- Etherscan을 사용하여 위임자와 함께 투표권을 초기화합니다("노드 주소로 Web3에 연결") https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- 위임자는 https://delegates.rocketpool.net/ 에서 찾을 수 있습니다

## 전체 설정 가이드

Etherscan을 사용하여 투표권을 초기화합니다("노드 주소로 Web3에 연결")

- [대부분에게 권장] 다른 노드를 위임자로 하여 투표를 초기화합니다 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - 위임자는 https://delegates.rocketpool.net/ 에서 찾을 수 있습니다
  - 언제든지 위임자를 재정의할 수 있다는 점을 기억하세요
- 자신의 노드를 위임자로 하여 투표를 초기화합니다 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - 여기서는 매번 직접 투표해야 합니다
  - 매번 투표해야 하므로 위임자가 되고자 하는 분들에게 이 옵션을 주로 제안합니다.
- Houston 이후에 노드가 등록된 경우:
  - 이미 자신의 노드를 위임자로 하여 투표권이 초기화되어 있습니다
  - https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 에서 새 위임자를 설정할 수 있습니다

Snapshot 신호 주소 설정:

- https://node.rocketpool.net/signalling-address 로 이동하여 노드 주소를 연결합니다
  - 원하는 Snapshot 신호 주소를 입력하고 메시지에 서명하여 필요한 r, s, v 인수를 받습니다
  - 참고: Snapshot 신호 주소는 노드 주소와 달라야 합니다
- 새 탭에서 https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2 로 이동합니다
  - 노드 주소로 "Web3에 연결"합니다
  - 이전 단계에서 제공된 신호 주소와 r, s, v 매개변수로 인수를 입력합니다
