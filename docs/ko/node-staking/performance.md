# 노드 성능 모니터링

이제 노드가 실행 중이고 하나 이상의 minipool이 연결되어 있으므로 모든 것이 원활하게 실행되는지 확인하기 위해 주시해야 합니다.

다음 방법으로 머신을 추적할 수 있습니다:

1. 머신 메트릭을 활용하여 직접
2. 타사 도구를 사용하여 간접적으로

필요에 따라 둘의 조합을 사용하는 것이 좋습니다.

## 머신 상태 직접 추적

머신 상태와 관련하여 주시하고 싶을 몇 가지 유용한 메트릭이 있습니다:

- CPU 사용량
- 남은 여유 RAM
- 스왑 공간 사용량(활성화한 경우)
- 남은 여유 디스크 공간
- 네트워크 I/O(ISP가 데이터 제한을 부과하는 경우)

::: tip 참고
아래 섹션에서는 모니터링하는 몇 가지 방법을 보여주지만 머신의 터미널에 로그인해야 합니다.
[Grafana 웹 대시보드](./grafana.mdx)를 사용하는 더 나은, 훨씬 더 편리하고 훨씬 더 보기 좋은 방법이 있지만 아직 개발 중입니다.
해당 섹션의 완료를 기대하십시오!
:::

### CPU, RAM 및 Swap

처음 세 가지는 `htop` 프로그램으로 쉽게 볼 수 있습니다.
이것은 Raspberry Pi의 스크린샷에서 보여지는 것처럼 시스템 리소스에 대한 멋진 라이브 보기를 제공합니다:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

막대가 있는 상단 디스플레이에서 번호가 매겨진 막대는 각각 CPU 코어의 현재 사용량을 나타냅니다.

`Mem`은 현재 사용 중인 RAM의 양(이 스크린샷에서 1.75 GB)과 총 보유량(3.70 GB)을 보여줍니다.

`Swp`는 사용 중인 스왑 공간의 양(85.8 MB)과 총 보유량(12.0 GB)을 보여줍니다.

하단 테이블에서 각 행은 프로세스를 나타냅니다.
Execution 및 Consensus 클라이언트가 상단에 있을 가능성이 높습니다(이 경우 Geth 및 Nimbus). `Command`라는 레이블이 있는 맨 오른쪽 열에서 볼 수 있습니다.

`RES` 열은 각 프로세스가 사용하는 RAM의 양을 보여줍니다 - 이 스크린샷에서 Geth는 748 MB를 사용하고 Nimbus는 383 MB를 사용합니다.

`CPU%` 열은 각 프로세스가 소비하는 CPU 전력의 양을 보여줍니다.
100%는 단일 코어를 나타내므로 100%를 초과하면 여러 코어에서 많이 사용하고 있음을 의미합니다(여기서 Geth는 213%로 그렇습니다).

### 남은 여유 디스크 공간

여유 디스크 공간이 얼마나 있는지 주시하는 것은 다음 명령으로 쉽게 수행할 수 있습니다:

```
df -h
```

다음 예와 유사한 출력을 제공합니다:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

운영 체제와 Execution 및 Consensus 체인 데이터를 모두 저장하는 드라이브가 하나인 기존 설정의 경우 `Mounted on` 열에 `/`가 있는 항목만 보면 됩니다.
이것은 메인 디스크를 나타냅니다.
공간이 부족해 보이는 경우(예: 약 80% 사용) 정리를 시작해야 합니다.
예를 들어 Geth를 실행하는 경우 일부 공간을 확보하기 위해 [pruning하는 방법](./pruning)을 살펴볼 수 있습니다.

Execution 및 Consensus 체인 데이터를 별도의 드라이브에 저장하는 설정의 경우 `Mounted on` 열에 체인 데이터 폴더가 있는 행도 보고 싶을 것입니다.
이 예에서는 외부 SSD를 `/mnt/rpdata`에 마운트했으므로 너무 크지 않도록 주시해야 합니다.

### 네트워크 I/O 및 데이터 사용량

시간이 지남에 따라 시스템이 사용하는 네트워크 I/O의 양을 추적하려면 `vnstat`라는 멋진 유틸리티를 설치할 수 있습니다.
다음은 Ubuntu / Debian 시스템에 설치하는 예입니다:

```shell
sudo apt install vnstat
```

이를 실행하려면 다음을 수행하십시오(인터넷 연결에 사용하는 네트워크 인터페이스의 이름이 `eth0`이라고 가정):

```
vnstat -i eth0
```

시스템에 대한 데이터를 수집하는 데 시간이 필요하기 때문에 즉시 작동하지 않지만, 며칠과 몇 주가 지나면 다음과 같이 보일 것입니다:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

이를 통해 총 네트워크 사용량을 추적할 수 있으며, ISP가 데이터 제한을 부과하는 경우 유용할 수 있습니다.

대부분의 최신 시스템은 eth0이 아닌 eno0 및 enp0s31f6와 같은 다른 네트워크 인터페이스를 더 일반적으로 사용합니다.
네트워크 인터페이스를 확인해야 하는 경우 다음 명령을 실행하십시오:

```shell
ls /sys/class/net
```

이더넷(유선) 장치는 일반적으로 위의 예와 같이 `e`로 시작합니다.
무선 장치는 일반적으로 `w`로 시작합니다.

## Smartnode 알림 알림

[알림 알림으로 Smartnode 스택 모니터링](./maintenance/alerting.md)은 Rocket Pool Smartnode의 건강과 중요한 이벤트에 대한 알림을 받기 위해 Smartnode 알림 알림 기능을 사용하는 방법을 안내합니다.

## 타사 성능 모니터링

최상의 모니터링은 스위스 치즈 모델을 사용합니다: 모든 도구에는 구멍이 있지만 서로 위에 쌓으면 무언가가 빠져나가 놀라게 할 가능성이 줄어듭니다.

이러한 타사 도구는 Rocket Pool 커뮤니티에서 사용하지만 Rocket Pool 팀이 공식적으로 승인하거나 지원하지 않습니다.
도구 제안이 있거나 도구 소유자인 경우 도구에 대한 세부 정보가 포함된 풀 리퀘스트를 추가하는 것을 환영합니다.

### Beaconcha.in 웹사이트: Beacon Chain을 메트릭 소스로 사용

[Beaconcha.in](https://beaconcha.in) 블록 탐색기 웹사이트 및 앱은 온체인 활동을 보고 validator의 성능을 추적하는 방법을 제공합니다.
또한 다운타임과 같은 중요한 이벤트에 대한 [이메일 알림](https://beaconcha.in/user/notifications)을 받을 수 있는 옵션이 있습니다.
사이트로 이동하여 화면 상단의 검색 상자에 validator의 공개 키를 입력하십시오.

::: tip
validator의 공개 키를 잊어버린 경우 `rocketpool minipool status` 명령으로 쉽게 검색할 수 있습니다.
:::

모든 것이 올바르게 설정되면 다음과 같은 것을 볼 수 있습니다:
![](./local/images/pi/Beaconchain.png)

::: tip 참고
위 링크는 Beaconcha.in의 **mainnet** 버전입니다.
Hoodi Testnet에서 실행 중인 경우 [이 링크를 대신 사용하십시오](https://hoodi.beaconcha.in)!
:::

이것은 validator의 모든 Beacon Chain 활동 기록입니다.
이를 사용하여 Beacon Chain에서 validator의 잔액을 확인하여 시간이 지남에 따라 증가하는 것을 보고 APY를 계산할 수 있습니다.

또한 validator가 살아 있고 올바르게 실행되고 있는지 빠르게 측정하는 데 사용할 수 있습니다.
그렇다면 모든 증명은 **Status**에 대해 `Attested`라고 말해야 하며 이상적으로 모든 **Opt. Incl. Dist.**는 0이어야 합니다(가끔 1 또는 2는 괜찮습니다).

`Missed`라고 표시된 블록이 많으면 validator가 제대로 작동하지 않는 것입니다.
Docker 또는 하이브리드 모드를 사용하는 경우(또는 Native 모드를 사용하는 경우 해당 로그 스크립트) `rocketpool service logs ...`로 `eth1`, `eth2` 및 `validator` 서비스의 로그를 확인하여 문제를 찾아야 합니다.

**이 탭을 고정하거나 북마크를 생성하여 빠르게 이동하여 validator의 상태를 확인할 수 있어야 합니다.**

#### Beaconcha.in을 사용하여 여러 Minipool 모니터링

Beaconcha.in에는 한 번에 여러 validator 또는 minipool을 모니터링할 수 있는 [대시보드 보기](https://beaconcha.in/dashboard)가 있습니다.
validator 인덱스를 한 번에 하나씩 추가하기만 하면 됩니다. minipool이 많으면 다음을 실행할 수 있습니다:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

쉼표로 구분된 목록을 가져와서 다음과 같이 URL 표시줄에 배치합니다: `https://beaconcha.in/dashboard?validators=123456,123457`

### Beaconcha.in 앱: Validator 개요 및 푸시 알림

Beaconcha.in 웹사이트는 메트릭을 보고 이메일 알림을 설정하는 좋은 방법입니다.
모바일 앱은 더 "한눈에" 성격을 가지고 있습니다.
또한 다음과 같은 유용한 알림을 포함하는 푸시 알림 서비스가 있습니다:

1. 놓친 증명과 같은 문제 알림
2. Rocket Pool 보상 라운드 알림
3. 노드의 RPL의 과다/부족 담보

앱에는 무료 버전과 홈 화면 위젯과 같은 편의 기능이 있는 유료 옵션이 있습니다.

### Beaconcha.in에서 Validator 이름 바꾸기

Beaconcha.in 웹사이트에는 사용자가 validator의 이름을 바꿀 수 있는 기능이 있어 식별/검색이 더 쉽습니다.

이 기능을 사용하려면 노드 지갑의 개인 키를 사용하여 메시지에 서명해야 해당 validator를 제어하는 사람임을 증명할 수 있습니다.

Smartnode v1.5.1에는 `rocketpool node sign-message` 명령을 사용한 다음 서명하려는 메시지를 제공하여 노드 지갑의 개인 키로 메시지에 서명하는 기능이 포함되어 있습니다.
validator의 이름을 바꾸는 데 사용하려면 'beaconcha.in'이라는 용어가 포함되어야 합니다.

![](../node-staking/images/sign-message.png)

Beaconcha.in에서 validator 페이지를 열고 `Edit validator name` 버튼을 클릭하십시오.

![](../node-staking/images/edit-validator-name.png)

sign-message 명령의 결과를 복사하여 "Signature" 필드에 붙여넣으십시오.
원하는 닉네임을 입력하고 `Save changes` 버튼을 클릭하십시오.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: 가동 시간을 위한 포트 스캔

[Uptimerobot](https://uptimerobot.com/) 서비스는 열린 포트에 대해 IP 주소를 스캔하는 간단한 서비스입니다.
지정한 포트에서 머신을 사용할 수 없게 되면 Uptimerobot이 문제가 있다는 알림을 보낼 수 있습니다.
이 서비스에는 이메일, 푸시 알림, SMS, 전화 통화 및 웹훅을 포함한 다양한 알림 옵션이 있습니다.

설정 화면은 다음과 같습니다:

![](./local/images/uptimerobot.png)

모니터링할 IP는 노드의 외부 IP이며, `ssh`로 노드에 로그인하거나 물리적으로 로그인하고 브라우저에서 [icanhazip.com](https://icanhazip.com/)을 열거나 터미널에서 다음 명령을 실행하여 찾을 수 있습니다:

```shell
curl icanhazip.com
```

모니터링할 포트는 노드 설정에 따라 다릅니다. 일반적인 Smartnode 설치를 실행하는 사용자는 Execution 및 Consensus 클라이언트에 대해 각각 포트 30303 및 9001을 전달했을 가능성이 높으므로 가동 시간 모니터링에 좋은 선택입니다.

### Rocketpool Metrics 대시보드

Rocket Pool 네트워크 전체뿐만 아니라 노드 성능 개요를 제공하기 위한 여러 커뮤니티 주도 이니셔티브가 있습니다.

### Pushover로 스크립팅(고급)

::: tip 참고
[알림 알림으로 Smartnode 스택 모니터링](./maintenance/alerting.md)은 노드에 사용 가능한 업데이트가 있을 때 알림을 포함하는 Smartnode 알림 알림 기능을 사용하는 방법을 안내합니다.
:::

[Pushover](https://pushover.net/) 서비스를 사용하면 푸시 알림을 보낼 수 있습니다.

::: warning 참고
이것은 수행할 고급 활동입니다.
셸 스크립팅에 익숙하다면 도움이 될 수 있지만 셸 환경에 익숙하지 않다면 권장하지 않습니다.
:::

Pushover를 시작하려면:

1. [pushover.net](https://pushover.net/)에서 계정 생성
1. [API 토큰 생성](https://pushover.net/apps/build)
1. Pushover 모바일 앱 및/또는 브라우저 확장 프로그램 설치
1. 관심 있는 모든 작업에 대해 Pushover API 호출

푸시 알림을 보내기 위해 Pushover API를 호출하는 것은 다음과 같이 구조화된 `curl` 호출을 통해 수행됩니다:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### 예: 업데이트 사용 가능 시 푸시 알림

`unattended-upgrades` 및 `update-nofifier` 패키지를 사용하여 자동 업데이트를 설정한 경우 노드에 사용 가능한 업데이트가 있을 때 푸시 알림을 받고 싶을 수 있습니다.
이를 수행하는 잠재적인 방법은 `~/update-notifier.sh`에 스크립트를 생성하고 `crontab`을 사용하여 매일 9:00에 트리거하는 것입니다.

이를 수행하려면 먼저 다음을 실행하여 스크립트를 생성하십시오:

```shell
nano ~/update-notifier.sh
```

그런 다음 다음 스크립트를 붙여넣으십시오:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

다음으로 다음 명령을 실행하여 스크립트를 실행 가능으로 표시하십시오:

```shell
chmod u+x ~/update-notifier.sh
```

이제 다음 명령을 실행하여 crontab을 여십시오:

```shell
crontab -e
```

그런 다음 화살표 키를 사용하여 아래로 스크롤하고 `* 9 * * * ~/update-notifier.sh` 줄을 추가하여 파일이 다음과 같이 보이도록 합니다:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

그런 다음 `control+x`를 눌러 종료하고 변경 사항을 저장할지 묻는 메시지가 표시되면 `Y`를 누르십시오.

이제 업데이트가 있는 경우 현지 시간 09:00에 알림을 받아야 합니다.
터미널에 다음을 입력하여 스크립트를 수동으로 실행할 수 있습니다:

```shell
~/update-notifier.sh
```

#### 예: APC UPS 데몬이 활성화되면 알림 받기

일부 홈 staker는 전원이 꺼질 때 노드가 정상적으로 종료되도록 `apcupsd` 유틸리티와 함께 무정전 전원 공급 장치를 사용하고 있습니다.

`apcupsd` 유틸리티는 `apccontrol` 스크립트를 사용하여 로직을 관리하므로 `/etc/apcupsd/apccontrol` 파일을 편집하여 이 데몬의 활동을 모니터링할 수 있습니다.
이를 수행하려면 다음을 실행하십시오:

```shell
sudo nano /etc/apcupsd/apccontrol
```

그런 다음 줄의 상단에 다음 코드를 추가하여 파일이 다음과 같이 보이도록 합니다:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

이렇게 하면 주기적인 "자체 테스트" 기능을 포함하여 UPS 데몬이 조치를 취할 때마다 푸시 알림이 전송됩니다.
