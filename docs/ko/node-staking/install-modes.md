# Rocket Pool 모드 선택

Rocket Pool의 Smartnode 스택은 매우 유연합니다. 실행 방법이 여러 가지 있습니다.
처음부터 전체 full node를 설정할 수 있고, 기존 Execution 또는 Consensus 클라이언트 배포와 통합할 수 있으며, 시스템 서비스 세트로 natively 실행할 수도 있습니다.
이 섹션에서는 Smartnode 스택을 구성하고 사용하는 일반적인 방법들을 다룹니다.

## 기본 Docker 기반 구성

기본 모드이자 Smartnode를 실행하는 가장 일반적인 방법은 Rocket Pool이 관리하는 전체 full node 인스턴스를 로컬 머신에 생성하는 것입니다.

이를 위해 Smartnode는 [Docker 컨테이너](https://www.docker.com/resources/what-container)를 사용합니다.
Docker 컨테이너는 기본적으로 프로그램, 모든 종속성 및 올바르게 실행하는 데 필요한 모든 구성이 미리 설정된 작은 샌드박스입니다.
더 이상 필요하지 않으면 간단히 삭제할 수 있습니다.
실제 파일 시스템이나 다른 프로그램을 지저분하게 만들지 않고 작동하는 멋진 독립적인 번들입니다.

이 모드는 Smartnode Installer가 배포하는 방식입니다.
다음 Docker 컨테이너를 사용합니다:

- `rocketpool_api` - Rocket Pool의 command-line interface (CLI)를 통해 상호 작용할 때 Smartnode가 제공하는 실제 기능을 보유합니다.
- `rocketpool_node` - reward checkpoint 이후 RPL 보상을 주기적으로 확인하고 청구하는 백그라운드 프로세스입니다 (auto-claim을 활성화한 경우, 나중에 자세히 설명). minipool을 생성할 때 새 validator를 실제로 staking하는 역할을 합니다.
- `rocketpool_watchtower` - Oracle Node가 oracle 관련 작업을 수행하는 데 사용됩니다. 일반 node operator의 경우 유휴 상태로 유지됩니다.
- `rocketpool_eth1` - Execution 클라이언트입니다.
- `rocketpool_eth2` - Consensus beacon node 클라이언트입니다.
- `rocketpool_validator` - validator 의무를 담당하는 Validator 클라이언트입니다 (블록 증명 또는 새 블록 제안 등).

대부분의 상황에서 처음부터 새 노드를 만들 때 선택하기 좋은 옵션입니다.
가장 빠르고 손이 덜 가는 절차입니다.
또한 Smartnode의 모든 새 릴리스마다 Execution 및 Consensus 클라이언트 업데이트를 처리하므로 걱정할 필요가 없습니다 (원하는 경우 언제든지 수동으로 업그레이드할 수 있습니다).

::: warning NOTE
현재 일부 Docker 컨테이너는 올바르게 작동하려면 `root` 사용자로 실행해야 합니다.
Docker 컨테이너는 일반적으로 사용자가 메인 운영 체제로 탈출하는 것을 방지하는 데 매우 뛰어나지만, 보안상의 이유로 이 요구 사항이 불편할 수 있습니다.
이 경우 아래 나열된 Native 구성 모드를 사용하는 것이 좋습니다.
:::

이 모드를 사용하려면 [Docker를 사용한 표준 Rocket Pool 노드 구성](./docker) 섹션으로 진행하십시오.

## 외부 클라이언트를 사용한 하이브리드 구성

하이브리드 구성은 Rocket Pool 노드를 실행하는 데 관심이 있지만 이미 다른 목적으로 자체 Execution 및/또는 Consensus 클라이언트를 실행하고 있는 사용자에게 적합합니다 (예: 이미 solo-staking을 하고 있는 경우).

이 모드에서 Rocket Pool은 자체 프로세스와 관리하는 Validator 클라이언트용 Docker 컨테이너를 배포하지만, 이미 실행하고 유지 관리하는 외부 클라이언트의 Execution 클라이언트 및 Beacon Node 컨테이너는 무시합니다.
**Rocket Pool이 노드의 각 minipool에 대한 새 validator 키를 생성하고 유지 관리하므로 자체 Validator 클라이언트를 실행하는 것이 중요합니다.**

이 구성을 사용할 때 Smartnode는 다음 Docker 컨테이너를 사용합니다(위에서 설명한 것):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

`rocketpool_eth1` 및 `rocketpool_eth2` 컨테이너는 이미 외부에서 실행 중인 클라이언트에 따라 포함되거나 제외됩니다.

이 모드를 사용하려면 [Docker를 사용한 표준 Rocket Pool 노드 구성](./docker) 섹션으로 진행하십시오.
Execution 및/또는 Consensus 클라이언트의 관리 모드를 선택하라는 메시지가 표시되면 해당 섹션에서 자세히 설명하는 **Externally Managed** 옵션을 선택하십시오.

## Docker 없이 Native 구성

이 구성은 Docker를 완전히 우회합니다.
Docker를 통해 Smartnode 스택을 실행하는 대신 각 프로세스가 로컬 시스템 서비스로 설치됩니다 (예: `systemd`를 통해).
여기에는 `node`, `watchtower`, `eth1`, `eth2` 및 `validator` 프로세스가 포함됩니다.

이 구성은 Rocket Pool의 매개변수 (보안 상태, Execution 및 Consensus 클라이언트 위치, 체인 데이터 위치, 키 위치 등)를 미세 조정할 수 있으므로 가장 유연합니다.
그러나 설정 및 유지 관리가 가장 어렵습니다.

이 모드에서는 Smartnode Installer가 더 이상 관련이 없습니다.
Smartnode 인프라, ETH 클라이언트 및 validator 클라이언트를 수동으로 인스턴스화, 유지 관리 및 업그레이드해야 합니다.

::: danger WARNING
이를 수행하는 방법에 대한 예제 문서를 제공하지만 이 모드는 **숙련된 시스템 관리자**만 사용해야 합니다.
:::

이 모드를 사용하려면 [Docker 없이 Native Rocket Pool 노드 구성](./native.mdx) 섹션으로 진행하십시오.
