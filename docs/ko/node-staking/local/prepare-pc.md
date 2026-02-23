# PC, Mini-PC 또는 NUC 준비하기

Rocket Pool을 설치하기 전에 시스템이 호환되고 올바르게 작동하는지 확인하기 위해 몇 가지 확인해야 할 사항이 있습니다.

::: danger
Rocket Pool 노드를 실행하기 위한 전용 머신을 만드는 것을 강력히 권장합니다.
일상적인 업무용 데스크톱이나 게임용 컴퓨터와 같은 일반 용도의 머신에서 노드를 실행하면 지갑이 손상되고 코인이 도난당할 수 있는 추가적인 보안 위험이 발생합니다.

**최대한의 안전을 위해 노드 실행 전용으로만 사용되는 새로운 머신을 구축하십시오.**
:::

## 시스템 요구사항

다음은 Rocket Pool 노드가 필요로 하는 소프트웨어 및 하드웨어 요구사항에 대한 간단한 설명입니다.
이 가이드는 머신이 이미 물리적으로 구축되어 있고 운영 체제가 설치되어 있다고 가정합니다.

### 지원되는 운영 체제

Rocket Pool의 Smartnode 클라이언트는 현재 **Linux** 및 **macOS** 시스템을 지원합니다.

현재 **Windows**는 원격 Linux 또는 Mac 머신을 원격으로 관리하는 데 사용할 수 있지만, Smartnode 자체는 현재 Windows 시스템에서 실행할 수 없습니다. 그러나 Rocket Pool은 Windows 머신에서 호스팅되는 Linux [가상 머신](https://en.wikipedia.org/wiki/System_virtual_machine)에서 실행할 수 있습니다.
이 설정은 Linux를 호스트 운영 체제로 설치하는 것보다 권장되지 않지만 필요한 경우 작동합니다.
추가 리소스 오버헤드가 필요하고 자체적인 보안 위험이 있으므로 메인넷에서 실제 Ether를 스테이킹할 때 이 설정을 사용하는 것은 권장하지 않습니다.

Rocket Pool은 **AMD64 (x64)** 및 **arm64 (aarch64)** CPU 아키텍처와 기본적으로 호환됩니다.
다른 아키텍처의 경우 소스에서 smartnode 클라이언트를 컴파일해야 합니다.

Smartnode를 설치하려면 사용자가 **root / Administrator** 액세스 권한(또는 **sudo** 권한)을 가져야 합니다.

#### Linux 지원

Linux OS에는 많은 변형(배포판 또는 줄여서 **distro**라고 함)이 있습니다. 모든 최신 배포판에서 Rocket Pool을 실행할 수 있지만, Rocket Pool의 설치 프로그램은 [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/), [Fedora](https://docs.fedoraproject.org/en-US/project/)에서 전체 스택을 자동으로 설치할 수 있습니다.

::: warning 참고
Ubuntu를 사용할 계획이라면 24.04와 같은 **LTS** 릴리스를 사용하는 것을 강력히 권장합니다.
이러한 릴리스는 더 오랜 기간 동안 적극적으로 유지 관리되므로 노드의 보안과 안정성에 도움이 됩니다.
:::

다른 배포판에 설치하는 경우 Smartnode 설치 프로그램이 일부 시스템 종속성(예: `docker-compose`)을 자동으로 설치할 수 없습니다.
설치 중에 일부 수동 단계가 필요합니다.

`arm64` 시스템의 경우 Smartnode 설치 프로그램은 Debian 및 Ubuntu와 같은 Debian 기반 배포판만 기본적으로 지원합니다.
다른 배포판의 경우 설치 중에 수동 단계가 필요합니다.

## 운영 체제 설치하기

macOS를 사용하는 경우 운영 체제가 이미 설치되어 있을 가능성이 높으므로 이 단계를 건너뛸 수 있습니다.

Linux를 처음부터 설치하는 경우 위에 나열된 각 배포판에는 운영 체제를 처음부터 설치하는 데 도움이 되는 유용하고 자세한 튜토리얼이 제공됩니다.
예를 들어 **Debian Server**를 설치하고 준비하는 과정을 안내하겠습니다.
Debian은 **최대 안정성과 신뢰성**에 중점을 두기 때문에 노드 운영에 좋은 선택입니다. 두 가지 모두 24/7 실행되어야 하는 노드 머신에 매우 바람직합니다.

[다음은 스크린샷과 함께 제공되는 단계별 가이드입니다](https://itslinuxfoss.com/debian-11-bullseye-guide/). 이 가이드는 노드 머신에 Debian을 처음부터 설치하는 방법을 보여줍니다.

:::tip
위에 링크된 가이드에 대해 몇 가지 유용한 수정 사항이 있으므로 따르고 싶을 수 있습니다.

- **root 비밀번호**를 설정하라는 메시지가 표시되면 **비워** 두는 것이 좋습니다. 이렇게 하면 `root` 계정이 비활성화되고 대신 `sudo` 패키지가 설치되어 사용자가 비밀번호를 다시 입력하여 권한을 상승시켜 root 작업을 수행할 수 있습니다. 이는 Ubuntu Linux가 설정되는 방식과 유사하며 사용자에게 더 친숙할 수 있습니다.
- 마지막 부분의 **소프트웨어 선택** 화면에서 데스크톱 GUI를 설치하지 않을 수 있습니다.
  - 데스크톱 GUI는 노드에 거의 필요하지 않습니다. 추가 오버헤드를 추가하고 대부분의 경우 터미널을 통해 원격 제어하기 때문에 사용되지 않으므로 여기에서 **GNOME 및 Debian 데스크톱 환경 선택을 해제**하는 것을 선호합니다.
  - 노드에 데스크톱 UI를 원하는 경우 시스템 리소스에 더 가볍기 때문에 **GNOME 선택을 해제하고 대신 XFCE를 선택**하는 것이 좋습니다. 또한 브라우저나 Discord와 같은 추가 소프트웨어를 노드에서 실행하지 않는 것이 좋습니다. 이러한 소프트웨어는 보안을 약화시키고 시스템 리소스를 소비하기 때문입니다.
  - **웹 서버** 선택을 해제하되 **SSH 서버** 및 **표준 시스템 유틸리티**는 선택된 상태로 둡니다.
- iso에서 플래시 드라이브를 만든 경우 `apt`를 실행하기 위해 CD-ROM 저장소를 비활성화해야 할 수 있습니다.
  이 작업을 수행하는 방법에 대한 설명은 [여기](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/)에서 찾을 수 있습니다.
- 시스템이 기본적으로 절전/최대 절전 모드로 설정될 수 있습니다. 이러한 설정을 비활성화하려면 다음 명령을 실행할 수 있습니다.
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### `sudo` 설치하기

Rocket Pool의 설치 프로그램은 모든 종속성을 획득하기 위해 `sudo` 프로그램이 필요합니다.
이전 단계에서 **root 사용자 비밀번호를 비워** 두었다면 이미 이것이 있을 것입니다.
그렇지 않은 경우 다음 명령을 실행하여 지금 설치하십시오.

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

그런 다음 머신을 재시작합니다.
이제 `sudo apt update`와 같은 `sudo`를 통해 명령을 실행할 수 있어야 합니다.

### SSH 사용하기

서버가 설치되고 로그인할 수 있게 되면 IP 주소를 가져와야 합니다.
이를 수행하는 쉬운 방법은 'net-tools' 패키지에 내장된 `ifconfig`를 사용하는 것입니다.

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

여기에 여러 항목이 표시될 수 있지만 찾고자 하는 항목은 다음과 같습니다.

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

플래그는 `UP,BROADCAST,RUNNING,MULTICAST`라고 표시되어야 합니다.
`inet` 값(여기서는 `192.168.1.8`)은 머신의 로컬 IP 주소입니다.

다음으로 SSH를 설치합니다.

```shell
sudo apt install openssh-server
```

:::tip 참고
Debian 설치 중에 **SSH 서버** 상자를 선택한 경우 이미 설치되어 있어야 하므로 이 명령은 아무 작업도 수행하지 않습니다.
:::

이 작업이 완료되면 `ssh`를 사용하여 노트북이나 데스크톱에서 머신의 터미널에 원격으로 로그인할 수 있습니다.

`ssh`에 익숙하지 않은 경우 [Secure Shell 소개](../ssh) 가이드를 참조하십시오.

:::warning 참고
이 시점에서 라우터를 구성하여 노드의 IP 주소를 **정적**으로 만드는 것을 *강력히 고려*해야 합니다.
이는 노드가 영원히 동일한 IP 주소를 갖게 되어 항상 해당 IP 주소를 사용하여 SSH로 접속할 수 있음을 의미합니다.
그렇지 않으면 어느 시점에 노드의 IP가 변경될 수 있으며 위의 SSH 명령이 더 이상 작동하지 않습니다.
노드의 새 IP 주소가 무엇인지 확인하려면 라우터의 구성에 들어가야 합니다.

각 라우터는 다르므로 정적 IP 주소를 할당하는 방법을 알아보려면 라우터 설명서를 참조해야 합니다.
:::

## Swap 공간 설정하기

대부분의 경우 Execution 및 Consensus 클라이언트와 인스턴스 유형을 신중하게 선택하면 RAM이 부족하지 않아야 합니다.
그래도 조금 더 추가하는 것이 나쁠 것은 없습니다.
이제 우리가 할 일은 **swap 공간**이라고 하는 것을 추가하는 것입니다.
기본적으로 SSD를 "백업 RAM"으로 사용한다는 것을 의미합니다. 무언가가 끔찍하게 잘못되어 서버의 일반 RAM이 부족한 경우를 대비한 것입니다.
SSD는 일반 RAM만큼 빠르지 않으므로 swap 공간에 도달하면 속도가 느려지지만 완전히 충돌하여 모든 것을 망가뜨리지는 않습니다.
이것을 (아마도) 절대 필요하지 않을 추가 보험이라고 생각하십시오.

### Swap 파일 생성하기

첫 번째 단계는 swap 공간 역할을 할 새 파일을 만드는 것입니다.
얼마나 사용할지 결정하십시오. 합리적인 시작은 8GB이므로 일반 RAM 8GB와 "백업 RAM" 8GB로 총 16GB가 됩니다.
매우 안전하게 하려면 24GB로 만들어 시스템에 일반 RAM 8GB와 "백업 RAM" 24GB로 총 32GB를 확보할 수 있지만 이것은 아마도 과도할 것입니다.
다행히 SSD에 1TB 또는 2TB의 공간이 있으므로 스왑 파일에 8~24GB를 할당하는 것은 무시할 수 있습니다.

이 연습을 위해 좋은 중간 지점을 선택하겠습니다. 총 RAM 24GB를 위한 16GB의 swap 공간입니다.
진행하면서 원하는 숫자를 대체하십시오.

이것을 입력하면 `/swapfile`이라는 새 파일이 생성되고 16GB의 0으로 채워집니다.
양을 변경하려면 `count=16`의 숫자를 원하는 값으로 변경하십시오. **이 작업은 시간이 오래 걸리지만 괜찮습니다.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

다음으로 root 사용자만 읽거나 쓸 수 있도록 권한을 설정합니다(보안을 위해).

```shell
sudo chmod 600 /swapfile
```

이제 이것을 swap 파일로 표시합니다.

```shell
sudo mkswap /swapfile
```

다음으로 활성화합니다.

```shell
sudo swapon /swapfile
```

마지막으로 서버가 재부팅될 때 자동으로 로드되도록 마운트 테이블에 추가합니다.

```shell
sudo nano /etc/fstab
```

끝에 다음과 같은 새 줄을 추가합니다.

```
/swapfile                            none            swap    sw              0       0
```

저장하려면 `Ctrl+O`와 `Enter`를 누르고 종료하려면 `Ctrl+X`와 `Enter`를 누릅니다.

활성화되었는지 확인하려면 다음 명령을 실행합니다.

```shell
sudo apt install htop
htop
```

출력은 맨 위에 다음과 같이 표시되어야 합니다.
![](../local/images/pi/Swap.png)

`Swp` 레이블이 지정된 마지막 행(`/` 뒤의 행)의 두 번째 숫자가 0이 아니면 모두 설정된 것입니다.
예를 들어 `0K / 16.0G`로 표시되면 swap 공간이 성공적으로 활성화된 것입니다.
`0K / 0K`로 표시되면 작동하지 않았으며 이전 단계를 올바르게 입력했는지 확인해야 합니다.

`q` 또는 `F10`을 눌러 `htop`을 종료하고 터미널로 돌아갑니다.

### Swappiness 및 Cache Pressure 구성하기

기본적으로 Linux는 시스템의 RAM에 대한 압력을 덜기 위해 많은 swap 공간을 적극적으로 사용합니다.
우리는 그것을 원하지 않습니다. SWAP에 의존하기 전에 마지막 순간까지 모든 RAM을 사용하기를 원합니다.
다음 단계는 시스템의 "swappiness"를 변경하는 것입니다. 이는 기본적으로 swap 공간을 사용하려는 열망입니다.
이를 설정할 값에 대한 많은 논쟁이 있지만 우리는 6의 값이 충분히 잘 작동한다는 것을 발견했습니다.

또한 "cache pressure"를 낮추고 싶습니다. 이는 서버가 파일 시스템의 캐시를 얼마나 빨리 삭제하는지를 결정합니다.
우리 설정에는 여유 RAM이 많이 있으므로 이것을 "10"으로 만들 수 있습니다. 이렇게 하면 캐시가 메모리에 한동안 남아 디스크 I/O가 줄어듭니다.

이를 설정하려면 다음 명령을 실행합니다.

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

이제 재부팅 후 다시 적용되도록 `sysctl.conf` 파일에 넣습니다.

```shell
sudo nano /etc/sysctl.conf
```

끝에 다음 두 줄을 추가합니다.

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

그런 다음 이전에 했던 것처럼 저장하고 종료합니다(`Ctrl+O`, `Ctrl+X`).

### 설치 전 시스템 확인

Rocket Pool을 설치하기 전에 다음 체크리스트를 검토하십시오.

- 시스템이 완전히 구축되어 전원이 켜지고 운영 체제로 부팅할 수 있습니다.
- 인터넷 검색, 이메일 확인 또는 게임 플레이와 같은 다른 활동을 시스템에서 수행하지 않습니다.
- Linux 운영 체제가 설치되어 있습니다.
- 사용자 계정에 root / 관리자 권한이 있습니다.
- 성능 요구 사항을 충족하는 SSD가 있습니다.
- SSD가 파일 시스템에 마운트되어 있습니다.
- 초기 Execution 및 Consensus 동기화 프로세스를 위해 최소 1.5TB의 여유 디스크 공간이 있습니다.
- ISP가 데이터를 제한하는 경우 월 2TB 이상입니다.

이 모든 항목을 확인하고 확인했다면 Rocket Pool을 설치하고 노드 실행을 시작할 준비가 된 것입니다!
[ETH 클라이언트 선택](../eth-clients) 섹션으로 이동하십시오.
