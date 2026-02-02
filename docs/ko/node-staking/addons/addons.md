# Rocket Pool Smart Node용 Add-on 작성 방법

## 소개

Rocket Pool Smart Node add-on은 Smart Node 스택에 추가 기능을 제공하는 확장 프로그램입니다. Ethereum 클라이언트 또는 Smart Node 서비스와 통합되는 Docker 컨테이너로 구현할 수 있습니다. Add-on은 `rocketpool service config` 명령을 통해 Smart Node의 터미널 사용자 인터페이스(TUI)에서 활성화하고 구성할 수 있습니다.

Add-on 개발은 두 가지 기존 예제를 기반으로 할 수 있습니다:

- **Graffiti Wall Writer**: Node Operator가 블록 제안 graffiti를 동적으로 설정하여 Beaconcha.in graffiti wall의 커뮤니티 그림에 기여할 수 있게 합니다. 분산형 그림 도구를 사용하여 각 제안에서 어떤 픽셀을 "그릴지" 결정합니다.
- **Rescue Node**: Rocket Rescue Node 프로젝트의 자격 증명을 사용하여 대체 beacon node 서비스를 제공합니다. 노드 유지 관리, 동기화 또는 중단 중에 요청을 공유 원격 beacon node로 라우팅하여 누락된 attestation을 방지하는 데 도움이 됩니다.

Add-on은 Smart Node 소스 코드의 일부이며 리포지토리에 pull request를 통해 기여해야 합니다. 구성 및 통합을 위한 표준화된 인터페이스를 구현합니다.

## 전제 조건

- Add-on은 Go로 작성되므로 Go 프로그래밍에 대한 친숙함.
- Add-on이 컨테이너로 실행될 수 있으므로 Docker에 대한 이해.
- Docker compose 설정 및 구성 시스템을 포함한 Rocket Pool Smart Node 아키텍처에 대한 지식.
- 로컬 개발 및 테스트를 위한 Smart Node 리포지토리에 대한 액세스.

## Add-on 생성 단계

새 add-on을 생성하려면 Smart Node 리포지토리 내의 특정 위치에 코드를 추가해야 합니다. 이 프로세스에는 add-on 로직 구현, UI 구성, 등록 및 Docker 스택과의 통합 처리가 포함됩니다.

### 1. Add-on 로직 구현

`addons/`에 add-on 이름을 딴 새 하위 디렉토리를 만듭니다(snake_case 사용, 예: `my_addon`).

이 디렉토리에 add-on 구조체를 정의하고 `github.com/rocket-pool/smartnode/shared/types/addons`의 `SmartnodeAddon` 인터페이스를 구현하는 Go 파일(예: `my_addon.go`)을 만듭니다.

```
type MyAddon struct {
    cfg *MyAddonConfig `yaml:"config,omitempty"`
}

func NewMyAddon() addons.SmartnodeAddon {
    return &MyAddon{
        cfg: NewConfig(),
    }
}
```

구현할 주요 메서드:

- `GetName()`: add-on의 표시 이름을 반환합니다.
- `GetDescription()`: 간단한 설명을 반환합니다.
- `GetConfig()`: 매개변수(예: 활성화 플래그, API 키, URL)가 있는 구성 객체를 반환합니다.
- `GetEnabledParameter()`: add-on이 활성화되었는지 여부를 제어하는 매개변수를 반환합니다.
- add-on 시작/중지, Docker compose 섹션 생성 또는 다른 서비스와의 상호 작용을 위한 메서드.

add-on이 Docker 컨테이너를 실행하는 경우:

- Docker 이미지(예: 사용자 지정 이미지 또는 외부 이미지)를 정의합니다.
- 필요한 볼륨, 포트 또는 환경 변수를 지정합니다.

예를 들어, Graffiti Wall Writer add-on은 그릴 이미지에 대한 JSON 구성을 기반으로 validator 클라이언트의 graffiti 파일을 주기적으로 업데이트하는 컨테이너를 실행합니다.

Rescue Node add-on은 validator 클라이언트가 프록시를 통해 원격 대체 beacon node를 사용하도록 구성하며, 사용자 이름과 비밀번호 매개변수가 필요합니다.

### 2. 구성 UI 생성

`rocketpool-cli/service/config/`에 `addon-myaddon.go`라는 파일을 추가합니다.

이 파일은 `tview` 라이브러리를 사용하여 add-on 구성을 위한 TUI 페이지를 정의합니다.

주요 요소:

- 레이아웃, 마스터 구성 및 양식 항목에 대한 필드가 있는 구조체 `AddonMyAddonPage`를 정의합니다.
- 페이지를 초기화하고 `createContent()`를 호출하는 생성자 `NewAddonMyAddonPage`.
- `createContent()`: 체크박스(예: 활성화됨) 및 기타 매개변수에 대한 입력 필드로 양식을 설정합니다.
- 활성화 상태에 따라 매개변수를 표시/숨기기 위한 `handleEnableChanged()`와 같은 이벤트 핸들러.

예제 스니펫:

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
}

func (configPage *AddonMyAddonPage) createContent() {
}
```

### 3. Add-on 등록

`addons/constructors.go`를 업데이트하여 add-on에 대한 생성자를 포함합니다.

이 파일에는 모든 add-on을 인스턴스화하는 함수가 포함되어 있습니다.

예제:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

그런 다음 `shared/services/config/rocket-pool-config.go`의 `NewRocketPoolConfig` 내에서 사용 가능한 addon 목록에 추가합니다.

```
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Docker Compose와 통합

Add-on은 종종 Docker compose 파일을 수정해야 합니다.

- add-on의 compose 섹션에 대한 `shared/services/rocketpool/assets/install/templates/addons` 디렉토리에 템플릿을 추가합니다(예: `my_addon.tmpl`).
- add-on 코드는 활성화될 때 서비스, 볼륨 및 종속성을 포함하여 compose YAML을 생성합니다.

`services/rocketpool/client` 폴더 내의 `composeAddons` 함수는 Rocket Pool 구성을 기반으로 Docker Compose 컨테이너를 프로비저닝하고 add-on에 대한 런타임, 템플릿 및 재정의 자산을 설정하는 역할을 담당합니다.

설치의 경우:

- add-on에 복사해야 하는 파일(예: 기본 구성 파일)이 필요한 경우 설치 스크립트(`install.sh`)를 업데이트합니다.

### 5. 선택적 통합

- **Node Status Command**: add-on에 상태 정보(예: Rescue Node에 대한 자격 증명 만료)가 있는 경우 `rocketpool-cli/node/status.go`를 업데이트하여 표시합니다.
- **메트릭 또는 로그**: 해당되는 경우 Prometheus/Grafana와 통합합니다.
- **외부 종속성**: 외부 리포지토리(예: Rescue Node 프록시)를 사용하는 경우 문서화되어 있는지 확인합니다.

### 6. 테스트 및 제출

- 로컬로 빌드 및 테스트: Makefile을 사용하여 Smart Node를 빌드, 설치 및 add-on을 활성화합니다.
- TUI에서 확인하고 Docker 컨테이너를 확인하며 기능을 테스트합니다.
- https://github.com/rocket-pool/smartnode에 변경 사항이 포함된 pull request를 제출합니다.

## 예제: Graffiti Wall Writer

- **목적**: 블록 제안을 사용하여 Beaconcha.in graffiti wall에 커뮤니티 이미지를 그립니다.
- **구현**: wall 상태를 가져오고 validator의 graffiti 파일을 업데이트하는 Docker 컨테이너를 실행합니다.
- **구성**: 활성화 플래그 및 이미지 JSON URL에 대한 매개변수(기본값: Rocket Pool 로고).
- **통합**: 컨테이너는 validator의 데이터 디렉토리를 마운트하여 graffiti 파일을 작성합니다. TUI를 통해 활성화됨; 분산형 그리기에 기여합니다.

## 예제: Rescue Node

- **목적**: 다운타임 중 페널티를 피하기 위한 대체 beacon node.
- **구현**: validator 클라이언트가 인증을 통해 원격 프록시를 사용하도록 구성합니다.
- **구성**: 활성화 플래그, Rescue Node 웹사이트의 사용자 이름 및 비밀번호.
- **통합**: validator 구성을 수정하여 rescue 프록시를 가리킵니다. `rocketpool node status`에 자격 증명 상태를 표시합니다.

자세한 내용은 리포지토리의 소스 코드를 검토하거나 add-on 개발 문서 개선에 기여하십시오.
