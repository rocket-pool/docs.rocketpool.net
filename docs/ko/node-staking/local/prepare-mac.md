# Mac 준비하기

Rocket Pool을 설치하기 전에 시스템이 호환되는지 그리고 올바르게 작동하는지 확인하기 위해 몇 가지 확인 사항이 있습니다.

::: danger
Rocket Pool 노드 실행을 위한 전용 기기를 만들 것을 강력히 권장합니다.
일상적인 업무용 데스크톱과 같은 범용 기기에서 노드를 실행하면 지갑이 손상되고 코인이 도난당할 수 있는 추가 보안 위험이 발생합니다.

**최대한의 안전을 위해 노드 실행만을 위해 전용으로 사용되는 새 기기를 구축하십시오.**
:::

## 시스템 요구 사항

다음은 Rocket Pool 노드가 요구하는 소프트웨어 및 하드웨어 요구 사항에 대한 간략한 설명입니다.
이 가이드는 이미 기기를 물리적으로 구축하고 운영 체제를 설치했다고 가정합니다.

### 지원되는 운영 체제

Rocket Pool은 하드웨어에 맞는 최신 버전의 macOS를 사용할 것을 권장합니다.

### macOS 지원

다음 필수 요구 사항을 설치해야 합니다.

Mac용 패키지 관리자로 [Homebrew](https://brew.sh)를 사용하는 것을 강력히 권장합니다. `brew` 명령을 사용하여 패키지를 쉽게 설치할 수 있습니다.

다음을 통해 설치할 수 있습니다.

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

XCode Command Line Tools와 같은 일부 필수 요구 사항을 자동으로 설치해야 합니다. 그렇지 않으면 다음을 사용하여 수동으로 설치할 수 있습니다.

```shell
xcode-select --install
```

설치가 완료되면 다음을 사용하여 모든 것이 올바르게 작동하는지 확인하십시오.

```shell
brew doctor
```

모든 것이 설치되고 작동하면 Homebrew를 사용하여 `brew` 명령으로 패키지를 설치할 수 있습니다.

예를 들어 Homebrew를 사용하여 `wget`을 설치하려면 터미널에서 다음 명령을 실행하십시오.

```shell
brew install wget
```

이제 Homebrew가 설치되었으므로 Docker 클라이언트인 [Orbstack](https://orbstack.dev)을 설치할 수 있습니다.

```shell
brew install --cask orbstack
```

Orbstack이 Applications 폴더에 설치됩니다. 거기에서 실행하면 초기화됩니다. Docker Desktop에서 마이그레이션하는 경우 기존 Docker 설치를 감지하고 이미지와 컨테이너를 마이그레이션해야 합니다.

하드웨어에 따라 Orbstack 설정을 조정해야 할 수 있습니다.

이전에 Docker Desktop을 설치한 경우 먼저 제거해야 합니다. Docker Desktop은 예전에 권장되는 Docker 클라이언트였지만 작년에 훨씬 더 나은 안정성을 제공하는 몇 가지 새로운 클라이언트가 출시되었습니다.

방화벽(시스템 설정 -> 네트워크 -> 방화벽)이 켜져 있고 Orbstack이 수신 연결을 허용하는 애플리케이션 목록에 추가되어 있는지 확인하십시오. (Orbstack이 자동으로 수행해야 함)

![](../local/images/mac/firewall.png)

### SSH 설치 및 사용

SSH는 이미 macOS에 설치되어 있어야 합니다.

### 설치 전 시스템 확인

Rocket Pool을 설치하기 전에 다음 체크리스트를 검토하십시오.

- 시스템이 완전히 구축되어 전원이 켜지고 운영 체제로 부팅할 수 있습니다.
- 인터넷 검색, 이메일 확인 또는 게임과 같은 다른 활동을 시스템에서 수행하지 않습니다.
- macOS 운영 체제가 설치되어 있습니다.
- 사용자 계정에 root / 관리자 권한이 있습니다.
- 성능 요구 사항을 충족하는 SSD가 있습니다.
- SSD가 파일 시스템에 마운트되어 있습니다.
- 초기 Execution 및 Consensus 동기화 프로세스를 위해 최소 1.5TB의 여유 공간이 있습니다.
- ISP가 데이터를 제한하는 경우 월 2TB 이상입니다.

이 모든 항목을 확인하고 확인했다면 Rocket Pool을 설치하고 노드 실행을 시작할 준비가 된 것입니다!
[ETH 클라이언트 선택](../eth-clients) 섹션으로 이동하십시오.
