# 스마트노드 미사용자를 위한 투표 설정

일부 사용자(예: Allnodes 사용자)는 스마트노드를 사용하지 않으며 직접 컨트랙트 상호작용을 통해 투표를 설정해야 할 수 있습니다.
이 가이드는 그러한 사용자를 위한 최소 설정 가이드와 완전한 설정 가이드를 모두 포함합니다.

::: tip
이를 위해 노드 주소를 하드웨어 지갑에 로드해야 합니다.
:::

## 최소 설정 가이드

이를 통해 위임자가 온체인 및 오프체인으로 대신 투표할 수 있습니다. 온체인에서는 위임자를 재정의할 수 있지만 오프체인에서는 불가능합니다.

- Etherscan을 사용하여 위임자와 함께 투표권을 초기화합니다("Connect to Web3"를 노드 주소로 사용) https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- 위임자 목록은 https://delegates.rocketpool.net/에서 찾을 수 있습니다

## 전체 설정 가이드

Etherscan을 사용하여 투표권을 초기화합니다("Connect to Web3"를 노드 주소로 사용)

- [대부분에게 권장] 다른 노드를 위임자로 하여 투표 초기화 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - 위임자 목록은 https://delegates.rocketpool.net/에서 찾을 수 있습니다
  - 언제든지 위임자를 재정의할 수 있다는 점을 기억하세요
- 자신의 노드를 위임자로 하여 투표 초기화 https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - 여기서는 매번 직접 투표해야 합니다
  - 이 옵션은 주로 위임자가 되고자 하는 분들에게 제안합니다. 왜냐하면 그들은 매번 투표해야 하기 때문입니다.
- Houston 이후에 노드가 등록된 경우:
  - 자신의 노드를 위임자로 하여 투표권이 이미 초기화되어 있습니다
  - https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3를 사용하여 새 위임자를 설정할 수 있습니다

스냅샷 시그널링 주소 설정:

- https://node.rocketpool.net/signalling-address로 이동하여 노드 주소를 연결합니다
  - 원하는 스냅샷 시그널링 주소를 입력하고 메시지에 서명하여 필요한 r, s, v 인수를 얻습니다
  - 참고: 스냅샷 시그널링 주소는 노드 주소가 아니어야 합니다
- 새 탭에서 https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2로 이동합니다
  - 노드 주소로 "Connect to Web3"를 실행합니다
  - 이전 단계에서 제공된 시그널링 주소와 r, s, v 매개변수로 인수를 채웁니다
