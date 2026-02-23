# Raspberry Pi 준비하기

::: warning 참고
이 페이지는 보관 목적으로 남겨두었습니다. Ethereum validator를 실행하는 데 필요한 하드웨어 및 성능 요구 사항이 증가함에 따라 더 이상 Raspberry Pi에서 Rocket Pool을 실행하는 것을 권장하지 않습니다.
:::

이 가이드는 Raspberry Pi를 사용하여 Rocket Pool 노드를 실행하는 방법을 안내합니다.
대부분의 staking 가이드에서는 일반적으로 권장하지 않지만, 전체 PC를 구축하는 것보다 훨씬 저렴한 옵션이라는 점에서 매력적이라는 것을 인정합니다.
이를 위해 우리는 다양한 설정을 조정하고 최적화하기 위해 열심히 노력했으며 잘 작동하는 것으로 보이는 구성을 결정했습니다.

이 설정은 **전체 Execution 노드**와 **전체 Consensus 노드**를 Pi에서 실행하여 Rocket Pool 노드 운영자로 활동하는 동시에 시스템이 Ethereum 네트워크의 건강에 기여하도록 합니다.

## 사전 설정

Raspberry Pi에서 Rocket Pool 노드를 실행하려면 먼저 작동하는 Raspberry Pi가 있어야 합니다.
이미 실행 중인 Pi가 있다면 좋습니다! [SSD 마운트하기](#mounting-the-ssd) 섹션으로 건너뛸 수 있습니다.
진행하기 전에 **팬이 부착되어 있는지** 확인하십시오.
처음부터 시작하는 경우 계속 읽으십시오.

### 필요한 것

Raspberry Pi에서 Rocket Pool을 실행하기 위해 구매해야 하는 권장 구성 요소는 다음과 같습니다:

- **Raspberry Pi 4 Model B**, **8 GB 모델**
  - 참고: 이 설정에서 4 GB를 _사용할 수는 있지만_, 안심할 수 있도록 8 GB를 사용하는 것을 강력히 권장합니다... 실제로 그다지 비싸지 않습니다.
- Pi용 **USB-C 전원 공급 장치**. **최소 3암페어**를 제공하는 것이 필요합니다.
- **MicroSD 카드**. 크기가 클 필요는 없으며 16 GB면 충분하고 이제 꽤 저렴합니다... 하지만 최소한 **Class 10 (U1)**이어야 합니다.
- PC용 **MicroSD to USB** 어댑터. Pi에 로드하기 전에 카드에 운영 체제를 설치하는 데 필요합니다.
  PC에 이미 SD 포트가 있다면 새로 구입할 필요가 없습니다.
- **히트싱크**. Pi를 24시간 내내 무거운 부하로 실행할 것이므로 뜨거워질 것입니다.
  히트싱크는 스로틀링을 방지하는 데 도움이 됩니다. 이상적으로는 3개 세트를 원합니다: CPU용 하나, RAM용 하나, USB 컨트롤러용 하나.
  [좋은 세트의 예는 다음과 같습니다](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- **케이스**. 여기에는 팬이 있는 경우와 팬이 없는 경우 두 가지 방법이 있습니다.
  - 팬이 있는 경우:
    - 40mm **팬**. 위와 마찬가지로 목표는 Rocket Pool 노드를 실행하는 동안 시원하게 유지하는 것입니다.
    - 모든 것을 함께 묶을 수 있는 **팬 마운트가 있는 케이스**.
      [이것과 같이](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) 통합 팬이 있는 케이스를 구입하여 팬을 별도로 구입할 필요가 없도록 할 수도 있습니다.
  - 팬이 없는 경우:
    - [이것과 같이](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX) 하나의 거대한 히트싱크 역할을 하는 **팬리스 케이스**.
      이것은 조용하기 때문에 좋은 옵션이지만 Pi가 **매우** 뜨거워질 것입니다 - 특히 초기 블록체인 동기화 프로세스 중에.
      Discord 사용자 Ken이 우리를 이 방향으로 안내해 준 것에 감사드립니다!
  - 일반적으로 Pi를 크게 오버클럭할 예정이므로 **팬과 함께** 사용하는 것을 권장합니다.

편의를 위해 이러한 것들의 많은 부분을 함께 묶어서 구입할 수 있습니다 - 예를 들어, [Canakit은 많은 구성 요소가 포함된 키트를 제공합니다](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN).
그러나 부품을 개별적으로 구입하면 더 저렴하게 구입할 수 있으며 (장비가 있다면 [자신만의 Pi 케이스를 3D 프린트](https://www.thingiverse.com/thing:3793664)할 수도 있습니다.)

필요한 다른 구성 요소:

- **USB 3.0+ 솔리드 스테이트 드라이브**. 일반적으로 **2 TB 드라이브**를 권장합니다.
  - [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ)는 잘 작동하는 것으로 알려진 훌륭한 예입니다.
  - :warning: SATA-to-USB 어댑터가 있는 SATA SSD를 사용하는 것은 [이와 같은 문제](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931) 때문에 **권장하지 않습니다**.
    이 경로를 선택하는 경우 [SSD 성능 테스트](#testing-the-ssd-s-performance) 섹션에서 작동하는지 여부를 확인하는 데 사용할 수 있는 성능 테스트가 포함되어 있습니다.
- 인터넷 액세스를 위한 **이더넷 케이블**. 최소한 **Cat 5e** 등급이어야 합니다.
  - Wi-Fi를 통해 노드를 실행하는 것은 **권장하지 않지만**, 다른 옵션이 없다면 이더넷 케이블 대신 사용할 수 있습니다.
- 전기가 끊길 경우 전원으로 작동할 **UPS**입니다.
  Pi는 실제로 많은 전력을 소비하지 않으므로 작은 UPS도 오래 지속되지만 일반적으로 클수록 좋습니다. 감당할 수 있는 만큼 큰 UPS를 선택하십시오.
  또한 **모뎀, 라우터 및 기타 네트워크 장비도** 연결하는 것이 좋습니다 - 라우터가 죽으면 Pi를 살리는 것은 별 의미가 없습니다.

위치, 판매, SSD 및 UPS 선택, 이미 가지고 있는 것의 수에 따라 전체 설정에 **약 $200 ~ $500 USD**를 지출하게 될 것입니다.

### 팬을 더 조용하게 만들기

팬을 구입하면 기본적으로 아래 그림과 같이 5v GPIO 핀에 연결하도록 지시받을 것입니다.
팬에는 두 개의 구멍이 있는 커넥터가 있습니다. 검은색은 GND (핀 6)에 연결하고 빨간색은 +5v (핀 4)에 연결해야 합니다.
![](./images/pi/Pinout.png)

그러나 우리의 경험에 따르면 이렇게 하면 팬이 매우 시끄럽고 빠르게 작동하는데 실제로 필요하지 않습니다.
더 조용하게 만들면서도 시원하게 유지하려면 5v 핀 대신 3.3v 핀 (핀 1, 파란색)에 연결해 보십시오.
즉, 팬에서 검은색 포인트는 여전히 GND (핀 6)에 연결되지만 이제 빨간색 포인트는 +3.3v (핀 1)에 연결됩니다.

팬에 두 구멍이 나란히 있는 커넥터가 있고 분리할 수 없는 경우 [이와 같은 점퍼](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4)를 Pi의 GPIO 핀과 사이에 넣을 수 있습니다.

### 운영 체제 설치

Raspberry Pi를 지원하는 Linux OS에는 몇 가지 종류가 있습니다.
이 가이드에서는 **Ubuntu 20.04**를 고수하겠습니다.
Ubuntu는 전 세계적으로 사용되는 검증된 OS이며 20.04는 (이 글을 쓰는 시점에서) 장기 지원 (LTS) 버전 중 최신 버전으로, 매우 오랫동안 보안 패치를 계속 받게 됩니다.
Raspbian과 같은 다른 Linux를 고수하고 싶다면 해당 기존 설치 가이드를 따르십시오 - 이 가이드는 Ubuntu용으로 제작되었으므로 모든 지침이 OS와 일치하지 않을 수 있습니다.

Canonical의 훌륭한 사람들은 [Pi에 Ubuntu Server 이미지를 설치하는 방법에 대한 훌륭한 가이드](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview)를 작성했습니다.

Server 설정을 위해 위 가이드의 **1단계부터 4단계까지** 따르십시오.
운영 체제 이미지의 경우 `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`를 선택하십시오.

데스크톱 UI를 원하는 경우 (마우스를 사용하고 창을 드래그할 수 있도록) 5단계도 따라야 합니다.
데스크톱 UI가 상대적으로 적은 이점으로 Pi에 추가 오버헤드와 처리 작업을 추가하므로 이렇게 하지 말고 서버 이미지를 고수하는 것이 좋습니다.
그러나 데스크톱을 실행하기로 결정했다면 Xubuntu 옵션을 선택하는 것이 좋습니다.
리소스가 상당히 가볍고 사용자 친화적입니다.

완료되면 Rocket Pool 노드를 실행하기 위해 Ubuntu를 준비할 준비가 된 것입니다.
로컬 터미널을 사용하거나 설치 가이드에서 제안하는 대로 데스크톱/노트북에서 SSH를 통해 연결할 수 있습니다.
프로세스는 어느 쪽이든 동일하므로 가장 편리한 방법을 사용하십시오.

`ssh`에 익숙하지 않다면 [Secure Shell 소개](../ssh) 가이드를 살펴보십시오.

::: warning 참고
이 시점에서 라우터를 구성하여 Pi의 IP 주소를 **정적**으로 만드는 것을 *강력히 고려*해야 합니다.
이는 Pi가 영원히 동일한 IP 주소를 갖게 되므로 항상 해당 IP 주소를 사용하여 SSH로 연결할 수 있음을 의미합니다.
그렇지 않으면 Pi의 IP가 어느 시점에서 변경될 수 있으며 위의 SSH 명령이 더 이상 작동하지 않습니다.
라우터의 구성에 들어가 Pi의 새 IP 주소가 무엇인지 찾아야 합니다.

각 라우터마다 다르므로 라우터 설명서를 참조하여 정적 IP 주소를 할당하는 방법을 알아야 합니다.
:::

## SSD 마운트하기

위의 설치 지침을 따른 후 알 수 있듯이 핵심 OS는 microSD 카드에서 실행됩니다.
Execution 및 Consensus 블록체인 데이터를 모두 보관하기에는 충분히 크거나 빠르지 않으므로 SSD가 필요합니다.
사용하려면 파일 시스템으로 설정하고 Pi에 마운트해야 합니다.

### USB 3.0 포트에 SSD 연결

SSD를 Pi의 USB 3.0 포트 중 하나에 연결하는 것으로 시작합니다. 검은색 포트가 아닌 **파란색** 포트입니다:

![](./images/pi/USB.png)

검은색 포트는 느린 USB 2.0 포트입니다. 마우스와 키보드와 같은 액세서리에만 적합합니다.
키보드가 파란색 포트에 연결되어 있으면 빼서 지금 검은색 포트에 연결하십시오.

### SSD 포맷 및 새 파티션 생성

::: warning
이 프로세스는 SSD의 모든 것을 지웁니다.
이미 파티션에 내용이 있는 경우 모두 삭제하려고 하므로 이 단계를 건너뛰십시오!
이전에 이 SSD를 사용한 적이 없고 완전히 비어 있다면 이 단계를 따르십시오.
:::

이 명령을 실행하여 장치 테이블에서 디스크 위치를 찾습니다:

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

중요한 것은 `logical name: /dev/sda` 부분 또는 오히려 **`/dev/sda`** 부분입니다.
이것을 SSD의 **장치 위치**라고 합니다.
이 가이드에서는 `/dev/sda`를 장치 위치로 사용합니다 - 귀하의 것도 아마 같을 것이지만 나머지 지침에 대해 해당 명령이 표시하는 것으로 대체하십시오.

이제 장치 위치를 알았으므로 포맷하고 새 파티션을 만들어 실제로 사용할 수 있도록 하겠습니다.
다시 말하지만 **이 명령은 디스크에 이미 있는 것을 삭제합니다!**

새 파티션 테이블 생성:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

새 파티션을 `ext4` 파일 시스템으로 포맷:

```shell
sudo mkfs -t ext4 /dev/sda1
```

레이블 추가 (할 필요는 없지만 재미있습니다):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

아래 명령을 실행하여 작동했는지 확인합니다. 여기에 표시된 것과 같은 출력이 표시되어야 합니다:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

이 모든 것이 표시되면 준비가 된 것입니다. `UUID="..."` 출력을 가져와 잠시 어딘가에 보관하십시오. 곧 필요할 것입니다.

### 새 파티션 최적화

다음으로 새 파일 시스템을 validator 활동에 최적화하기 위해 조정하겠습니다.

기본적으로 ext4는 시스템 프로세스를 위해 공간의 5%를 예약합니다.
SSD는 Execution 및 Consensus 체인 데이터만 저장하므로 필요하지 않으므로 비활성화할 수 있습니다:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### 마운트 및 자동 마운트 활성화

드라이브를 사용하려면 파일 시스템에 마운트해야 합니다.
원하는 곳에 새 마운트 포인트를 생성합니다 (여기에서는 `/mnt/rpdata`를 예로 사용하겠습니다):

```shell
sudo mkdir /mnt/rpdata
```

이제 새 SSD 파티션을 해당 폴더에 마운트합니다:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

이 후 `/mnt/rpdata` 폴더는 SSD를 가리키므로 해당 폴더에 쓰는 모든 것이 SSD에 저장됩니다.
여기에 Execution 및 Consensus에 대한 체인 데이터를 저장할 것입니다.

이제 시작 시 자동으로 마운트되도록 마운팅 테이블에 추가하겠습니다.
이전에 사용한 `blkid` 명령의 `UUID`를 기억하십니까?
여기에서 유용하게 사용됩니다.

```shell
sudo nano /etc/fstab
```

다음과 같이 시작되는 대화형 파일 편집기가 열립니다:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

화살표 키를 사용하여 맨 아래 줄로 이동하고 끝에 이 줄을 추가합니다:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

`UUID=...`의 값을 디스크의 값으로 바꾼 다음 `Ctrl+O` 및 `Enter`를 눌러 저장한 다음 `Ctrl+X` 및 `Enter`를 눌러 종료합니다.
이제 재부팅할 때 SSD가 자동으로 마운트됩니다. 좋습니다!

### SSD 성능 테스트

더 진행하기 전에 SSD의 읽기/쓰기 속도와 초당 처리할 수 있는 I/O 요청 수 (IOPS)를 테스트해야 합니다.
SSD가 너무 느리면 Rocket Pool 노드에 잘 작동하지 않으며 시간이 지남에 따라 돈을 잃게 됩니다.

테스트하려면 `fio`라는 프로그램을 사용합니다. 다음과 같이 설치합니다:

```shell
sudo apt install fio
```

다음으로 SSD의 마운트 포인트로 이동합니다:

```shell
cd /mnt/rpdata
```

이제 이 명령을 실행하여 SSD 성능을 테스트합니다:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

출력은 다음과 같아야 합니다:

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

관심을 가져야 할 것은 `test:` 줄 아래에서 시작하는 `read:` 및 `write:` 줄입니다.

- **읽기**는 IOPS가 최소 **15k**이고 대역폭 (BW)이 최소 **60 MiB/s**여야 합니다.
- **쓰기**는 IOPS가 최소 **5000**이고 대역폭이 최소 **20 MiB/s**여야 합니다.

이는 우리가 사용하는 Samsung T5의 사양으로 매우 잘 작동합니다.
읽기 IOPS가 5k이고 쓰기 IOPS가 1k인 더 느린 SSD도 테스트했으며 consensus layer를 따라가는 데 매우 어려움을 겪습니다.
위의 사양보다 느린 SSD를 사용하는 경우 많은 누락된 증명을 볼 수 있다는 점을 준비하십시오.
귀하의 것이 충족하거나 초과하면 모두 설정된 것이며 계속 진행할 수 있습니다.

::: tip 참고
SSD가 위의 사양을 충족하지 않지만 충족해야 하는 경우 펌웨어 업데이트로 해결할 수 있습니다.
예를 들어, Rocket Pool 커뮤니티에서 Samsung T7로 이것을 경험했습니다.
박스에서 바로 나온 두 개는 읽기 IOPS가 3.5K이고 쓰기 IOPS가 1.2K만 표시되었습니다.
사용 가능한 모든 펌웨어 업데이트를 적용한 후 성능이 위의 예에 표시된 숫자로 다시 올라갔습니다.
최신 펌웨어에 대해 제조업체의 지원 웹사이트를 확인하고 드라이브가 최신 상태인지 확인하십시오 - 더 이상 업데이트가 남아 있지 않을 때까지 펌웨어를 여러 번 업데이트해야 할 수도 있습니다.
:::

마지막으로 방금 만든 테스트 파일을 제거합니다:

```shell
sudo rm /mnt/rpdata/test
```

## 스왑 공간 설정

Pi에는 8 GB (또는 해당 경로를 선택한 경우 4 GB)의 RAM이 있습니다.
우리 구성의 경우 충분할 것입니다.
그렇긴 하지만 조금 더 추가해도 나쁠 것은 없습니다.
지금 할 일은 **스왑 공간**이라고 하는 것을 추가하는 것입니다.
기본적으로 무언가가 끔찍하게 잘못되어 Pi가 일반 RAM을 다 쓰는 경우 SSD를 "백업 RAM"으로 사용할 것입니다.
SSD는 일반 RAM만큼 빠르지 않으므로 스왑 공간에 도달하면 속도가 느려지지만 완전히 충돌하고 모든 것을 손상시키지는 않습니다.
이것을 (대부분) 필요하지 않을 추가 보험이라고 생각하십시오.

### 스왑 파일 생성

첫 번째 단계는 스왑 공간으로 작동할 새 파일을 만드는 것입니다.
얼마나 사용할지 결정하십시오 - 합리적인 시작은 8 GB로 총 16 GB의 경우 8 GB의 일반 RAM과 8 GB의 "백업 RAM"이 있습니다.
매우 안전하려면 24 GB로 만들어 시스템에 8 GB의 일반 RAM과 24 GB의 "백업 RAM"이 총 32 GB가 되도록 할 수 있지만 이것은 아마도 과도할 것입니다.
다행히 SSD에 1 또는 2 TB의 공간이 있으므로 스왑 파일에 8 ~ 24 GB를 할당하는 것은 무시할 수 있습니다.

이 연습을 위해 좋은 중간 지점을 선택하겠습니다 - 총 RAM 24 GB에 대해 16 GB의 스왑 공간.
진행하면서 원하는 숫자로 대체하십시오.

이것을 입력하면 `/mnt/rpdata/swapfile`이라는 새 파일이 생성되고 16 GB의 0으로 채워집니다.
양을 변경하려면 `count=16`의 숫자를 원하는 것으로 변경하십시오. **이것은 오랜 시간이 걸리지만 괜찮습니다.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

다음으로 루트 사용자만 읽거나 쓸 수 있도록 권한을 설정합니다 (보안을 위해):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

이제 스왑 파일로 표시합니다:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

다음으로 활성화합니다:

```shell
sudo swapon /mnt/rpdata/swapfile
```

마지막으로 Pi가 재부팅될 때 자동으로 로드되도록 마운트 테이블에 추가합니다:

```shell
sudo nano /etc/fstab
```

끝에 새 줄을 추가하여 파일이 다음과 같이 보이도록 합니다:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

`Ctrl+O` 및 `Enter`를 눌러 저장한 다음 `Ctrl+X` 및 `Enter`를 눌러 종료합니다.

활성 상태인지 확인하려면 다음 명령을 실행합니다:

```shell
sudo apt install htop
htop
```

출력은 상단에서 다음과 같아야 합니다:
![](./images/pi/Swap.png)

`Swp` 레이블이 지정된 마지막 행의 두 번째 숫자 (`/` 다음)가 0이 아니면 모두 설정된 것입니다.
예를 들어 `0K / 16.0G`가 표시되면 스왑 공간이 성공적으로 활성화된 것입니다.
`0K / 0K`가 표시되면 작동하지 않았으며 이전 단계를 올바르게 입력했는지 확인해야 합니다.

`q` 또는 `F10`을 눌러 `htop`에서 종료하고 터미널로 돌아갑니다.

### Swappiness 및 Cache Pressure 구성

기본적으로 Linux는 시스템의 RAM에서 일부 압력을 제거하기 위해 많은 스왑 공간을 열심히 사용합니다.
우리는 그것을 원하지 않습니다. 스왑에 의존하기 전에 마지막 순간까지 모든 RAM을 사용하기를 원합니다.
다음 단계는 시스템의 "swappiness"라고 하는 것을 변경하는 것입니다. 기본적으로 스왑 공간을 사용하는 데 얼마나 열성적인지입니다.
이것을 어떤 값으로 설정할지에 대한 많은 논쟁이 있지만 6의 값이 충분히 잘 작동한다는 것을 발견했습니다.

또한 Pi가 파일 시스템의 캐시를 삭제하는 속도를 지시하는 "cache pressure"를 줄이려고 합니다.
설정으로 여유 RAM이 많을 것이므로 캐시를 메모리에 오랫동안 남겨 디스크 I/O를 줄이는 "10"으로 만들 수 있습니다.

이를 설정하려면 다음 명령을 실행합니다:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

이제 재부팅 후 다시 적용되도록 `sysctl.conf` 파일에 넣습니다:

```shell
sudo nano /etc/sysctl.conf
```

끝에 다음 두 줄을 추가합니다:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

그런 다음 이전에 했던 것처럼 저장하고 종료합니다 (`Ctrl+O`, `Ctrl+X`).

## Pi 오버클럭

기본적으로 Pi와 함께 제공되는 1.5 GHz 프로세서는 꽤 유능한 작은 장치입니다.
대부분의 경우 잘 검증할 수 있어야 합니다.
그러나 드물게 validator 클라이언트가 일부 작업에 갇혀 validator의 증명 의무를 따라갈 만큼 충분한 마력이 없는 것을 발견했습니다.
그런 일이 발생하면 [beaconcha.in explorer](https://beaconcha.in)에서 다음과 같은 것을 볼 수 있습니다 (나중에 [노드 성능 모니터링](../performance) 가이드에서 더 자세히 설명됨):

![](./images/pi/Incl-Dist.png)

8의 inclusion distance는 해당 증명을 보내는 데 정말 오랜 시간이 걸렸음을 의미하며 늦었다는 이유로 약간 페널티를 받게 됩니다.
이상적으로는 모두 0이어야 합니다.
드물지만 스톡 설정에서 실행할 때 발생합니다.

그러나 이를 완화하는 방법이 있습니다: 오버클럭.
오버클럭은 Pi의 CPU에서 추가 성능을 얻는 가장 쉬운 방법이며 그 불쾌한 높은 inclusion distance를 방지합니다.
솔직히 1.5 GHz의 기본 CPU 클럭은 정말 성능이 부족합니다.
오버클럭을 통해 상당히 가속화할 수 있으며 얼마나 멀리 가느냐에 따라 매우 안전하게 할 수도 있습니다.

Pi를 오버클럭하는 것은 매우 간단합니다 - 텍스트 파일에서 일부 숫자를 변경하는 것만 포함됩니다.
중요한 두 가지 숫자가 있습니다: 첫 번째는 ARM CPU가 얼마나 빠르게 실행되는지 직접 결정하는 **코어 클럭**입니다.
두 번째는 ARM CPU에 공급되는 전압을 결정하는 **overvoltage**입니다.
더 높은 속도는 일반적으로 더 높은 전압을 필요로 하지만 Pi의 CPU는 눈에 띄는 손상 없이 상당히 많은 추가 전압을 처리할 수 있습니다.
조금 더 빨리 마모될 수 있지만 여전히 수년 단위로 이야기하고 있으며 그때까지 Pi 5가 나올 것이므로 실제 피해는 없습니다!

오히려 overvoltage의 실제 문제는 **더 높은 전압이 더 높은 온도로 이어진다**는 것입니다.
이 섹션은 Pi가 무거운 부하에서 얼마나 뜨거워지는지 확인하는 데 도움이 되므로 너무 멀리 밀어붙이지 않습니다.

::: warning
우리가 할 수준에서 오버클럭하는 것은 꽤 안전하고 신뢰할 수 있지만 "실리콘 복권"이라는 것의 자비에 있습니다.
모든 CPU는 미시적 방식으로 약간 다르며 일부는 다른 것보다 더 잘 오버클럭할 수 있습니다.
너무 멀리 / 너무 세게 오버클럭하면 시스템이 **불안정**해질 수 있습니다.
불안정한 Pi는 지속적인 재시작에서 완전히 정지까지 모든 종류의 결과를 겪습니다.
**최악의 경우 microSD 카드가 손상되어 처음부터 모든 것을 다시 설치해야 할 수도 있습니다!**

**여기의 지침을 따름으로써 해당 위험을 감수한다는 사실을 받아들여야 합니다.**
그것이 당신에게 가치가 없다면 이 섹션의 나머지 부분을 건너뛰십시오.
:::

## 스톡 구성 벤치마킹

오버클럭하기 전에 Pi가 스톡, 기성품 구성에서 무엇을 할 수 있는지 프로파일링해야 합니다.
살펴볼 세 가지 주요 사항이 있습니다:

1. **성능** (Pi가 얼마나 빨리 계산하는지)
2. 부하 상태의 **온도** (얼마나 뜨거워지는지)
3. **안정성** (충돌하기 전에 얼마나 오래 실행되는지)

진행하면서 세 가지 모두에 대한 통계를 얻을 것입니다.

### 성능

성능 측정을 위해 LINPACK을 사용할 수 있습니다.
소스에서 빌드하겠습니다.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

이제 다음과 같이 실행합니다:

```shell
linpack
Enter array size (q to quit) [200]:
```

기본값인 200에 두려면 `enter`를 누르고 실행하도록 하십시오.
완료되면 출력이 다음과 같이 보일 것입니다:

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

살펴봐야 할 것은 `KFLOPS` 열의 마지막 행입니다.
이 숫자 (위 예에서 1120277.186)는 컴퓨팅 성능을 나타냅니다.
그 자체로는 아무 의미가 없지만 오버클럭된 성능과 비교할 좋은 기준선을 제공합니다.
이것을 **스톡 KFLOPS**라고 하겠습니다.

### 온도

다음으로 Pi를 스트레스 테스트하고 무거운 부하에서 온도를 관찰하겠습니다.
먼저 Pi에 대한 세부 정보를 인쇄할 수 있는 `vcgencmd`라는 도구를 제공하는 이 패키지를 설치합니다:

```shell
sudo apt install libraspberrypi-bin
```

설치되면 Pi를 재부팅합니다 (일부 새 권한이 적용되려면 필요합니다).
다음으로 **stressberry**라는 프로그램을 설치합니다.
이것이 벤치마킹 도구가 될 것입니다.
다음과 같이 설치합니다:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip 참고
stressberry가 온도 정보를 읽을 수 없거나 `vchiq` 인스턴스를 열 수 없다는 오류를 던지면 다음 명령으로 해결할 수 있습니다:

```shell
sudo usermod -aG video $USER
```

그런 다음 로그아웃했다가 다시 로그인하거나 SSH 세션을 다시 시작하거나 컴퓨터를 다시 시작하고 다시 시도하십시오.
:::

다음으로 다음과 같이 실행합니다:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

이것은 Pi의 4개 코어 모두에서 테스트 전후에 60초의 쿨다운으로 300초 (5분) 동안 "Stock"이라는 새 스트레스 테스트를 실행합니다.
더 오래 실행하거나 더 많은 쿨다운을 원하면 이러한 타이밍을 조정할 수 있지만 이것은 저에게 빠르고 더러운 스트레스 테스트로 작동합니다.
결과는 `stock.out`이라는 파일에 저장됩니다.

테스트의 주요 단계 동안 출력은 다음과 같이 보일 것입니다:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

이것은 기본적으로 Pi가 얼마나 뜨거워질지 알려줍니다.
85°C에서 Pi는 실제로 스로틀링을 시작하고 과열되지 않도록 클럭 속도를 낮춥니다.
다행히 히트싱크와 팬을 추가했기 때문에 이에 가까이 갈 수 없어야 합니다!
그렇긴 하지만 일반적으로 시스템의 전반적인 건강을 위해 온도를 65°C 이하로 유지하려고 합니다.

정상 validating 작업 중 시스템 온도를 모니터링하려면 `vcgencmd`로 이 작업을 수행할 수 있습니다:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### 안정성

오버클럭의 안정성을 테스트하는 것은 다음 세 가지 질문에 답하는 것을 포함합니다:

- Pi가 켜지고 로그인 프롬프트에 도달하거나 SSH 서버를 시작합니까?
- 정상 작동 중에 무작위로 정지하거나 재시작됩니까?
- 무거운 부하 중에 무작위로 정지하거나 재시작됩니까?

오버클럭이 진정으로 안정적이려면 답이 **예, 아니오, 아니오**여야 합니다.
이를 테스트하는 몇 가지 방법이 있지만 이 시점에서 가장 쉬운 방법은 정말 오랫동안 `stressberry`를 실행하는 것입니다.
얼마나 오래는 전적으로 귀하에게 달려 있습니다 - 더 오래 갈수록 시스템이 안정적이라고 더 확신할 수 있습니다.
일부 사람들은 위의 5분 테스트를 실행하고 살아남으면 충분하다고 합니다. 다른 사람들은 30분 동안 실행합니다. 다른 사람들은 8시간 이상 실행합니다.
얼마나 오래 실행할지는 자신의 위험 허용 범위에 따라 내려야 할 개인적인 결정입니다.

런타임을 변경하려면 실행하려는 테스트의 초 수로 `-d` 매개변수를 수정하십시오.
예를 들어 30분이 방법이라고 결정했다면 `-d 1800`을 수행할 수 있습니다.

## 첫 번째 오버클럭 - 1800 MHz (Light)

우리가 할 첫 번째 오버클럭은 비교적 "가볍고" 신뢰할 수 있지만 여전히 컴퓨팅 능력에서 좋은 향상을 제공합니다.
스톡 1500 MHz에서 1800 MHz로 올라갈 것입니다 - 20% 속도 향상입니다!

이 파일을 엽니다:

```shell
sudo nano /boot/firmware/usercfg.txt
```

끝에 다음 두 줄을 추가합니다:

```shell
arm_freq=1800
over_voltage=3
```

그런 다음 파일을 저장하고 재부팅합니다.

이러한 설정은 CPU 클럭을 20% 증가시키고 CPU 전압을 0.88v에서 0.93v로 올립니다 (각 `over_voltage` 설정은 0.025v씩 증가시킵니다).
이 설정은 모든 Pi 4B에서 달성할 수 있어야 하므로 시스템이 재시작되고 몇 분 안에 로그인 프롬프트 또는 SSH 액세스를 제공해야 합니다.
그렇지 않고 Pi가 응답을 중지하거나 부팅 루프에 들어가면 재설정해야 합니다 - 다음 섹션을 읽으십시오.

### 불안정한 오버클럭 후 재설정

Pi가 응답을 중지하거나 계속 재시작되면 오버클럭을 낮춰야 합니다.
그렇게 하려면 다음 단계를 따르십시오:

1. Pi를 끕니다.
2. microSD 카드를 빼냅니다.
3. microSD 어댑터를 사용하여 카드를 다른 Linux 컴퓨터에 연결합니다. \*참고: **다른 Linux 컴퓨터여야 합니다**. Windows는 SD 카드가 사용하는 `ext4` 파일 시스템을 읽을 수 없으므로 Windows 컴퓨터에 연결해도 작동하지 않습니다!\*\*
4. 다른 컴퓨터에 카드를 마운트합니다.
5. `<SD mount point>/boot/firmware/usercfg.txt`를 엽니다.
6. `arm_freq` 값을 낮추거나 `over_voltage` 값을 증가시킵니다. _참고: **over_voltage=6보다 높게 가지 마십시오.** 더 높은 값은 Pi의 보증에서 지원되지 않으며 귀하가 편안하게 생각하는 것보다 빨리 CPU를 저하시킬 위험이 있습니다._
7. SD 카드를 마운트 해제하고 제거합니다.
8. 카드를 Pi에 다시 연결하고 켭니다.

Pi가 작동하면 좋습니다! 아래로 계속 진행합니다.
그렇지 않으면 더욱 보수적인 설정으로 전체 프로세스를 반복합니다.
최악의 경우 `arm_freq` 및 `over_voltage` 줄을 완전히 제거하여 스톡 설정으로 되돌릴 수 있습니다.

### 1800 MHz 테스트

로그인하면 `linpack`을 다시 실행하여 새 성능을 테스트합니다.
다음은 테스트 Pi의 예입니다:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

다시 마지막 행의 `KFLOPS` 열을 가져옵니다.
스톡 구성과 비교하려면 두 숫자를 나누기만 하면 됩니다:
`1337238.504 / 1120277.186 = 1.193668`

좋습니다! 이것은 19.4%의 성능 향상이며 20% 더 빠르게 실행되므로 예상되는 것입니다.
이제 새 클럭 속도 및 전압 설정으로 온도를 확인하겠습니다:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

다음과 같은 출력이 표시되어야 합니다:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

나쁘지 않습니다. 스톡 설정보다 약 6° 더 뜨겁지만 여전히 개인적으로 중지할 임계값보다 훨씬 낮습니다.

여기에서 더 긴 안정성 테스트를 실행하거나 더 높이 올리기 위해 계속 진행할 수 있습니다.

## 2000 MHz로 가기 (Medium)

다음 이정표는 2000 MHz입니다. 이것은 클럭 속도에서 33.3% 증가를 나타내며 상당히 중요합니다.
대부분의 사람들은 이것이 성능과 안정성 사이의 훌륭한 균형이라고 생각하므로 여기에서 프로세스를 중지합니다.

이 수준에 대한 권장 사항은 다음 설정으로 시작하는 것입니다:

```shell
arm_freq=2000
over_voltage=5
```

이것은 코어 전압을 1.005v로 올립니다.
`linpack` 및 `stressberry` 테스트로 시도해 보십시오.
살아남으면 모두 설정된 것입니다. 정지하거나 무작위로 재시작되면 전압을 증가시켜야 합니다:

```shell
arm_freq=2000
over_voltage=6
```

그것은 코어 전압을 1.03v에 놓으며 이것은 보증을 무효화하기 전에 갈 수 있는 한 높은 것입니다.
그것은 일반적으로 대부분의 Pi에서 작동합니다.
그렇지 않으면 전압을 더 높이는 대신 **클럭 속도를 낮추고 다시 시도해야 합니다.**

참고로 2000 실행의 숫자는 다음과 같습니다:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

이것은 예상대로 32.3% 속도 향상입니다. 나쁘지 않습니다!

온도는 다음과 같습니다:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

7도 더 증가했지만 여전히 65°C 임계값 아래입니다.

## 2100 MHz로 가기 (Heavy)

다음 단계는 스톡 구성에 비해 확실한 **40% 속도 향상**을 나타냅니다.

**참고: 모든 Pi가 `over_voltage=6`에 머무르면서 이 작업을 수행할 수 있는 것은 아닙니다.
시도해 보고 손상되면 2000 MHz로 돌아가십시오.**

구성은 다음과 같이 보일 것입니다:

```shell
arm_freq=2100
over_voltage=6
```

참고로 결과는 다음과 같습니다:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

이것은 39.4% 속도 향상입니다!

온도는 다음과 같습니다:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

60°C에 조금 못 미치므로 충분한 공간이 있습니다.

## 2250 MHz로 가기 (Extreme)

이것은 우리가 Pi를 실행하는 설정으로 이 글을 쓰는 시점에서 1년 이상 안정적이었습니다.
그럼에도 불구하고 **사용자는 이렇게 높게 오버클럭하는 데 주의를 기울여야 합니다** - 이를 노드의 프로덕션 구성으로 만들기 전에 철저한 안정성 테스트를 수행하고 충분한 열 여유가 있는지 확인하십시오!

구성은 다음과 같습니다:

```shell
arm_freq=2250
over_voltage=10
```

결과는 다음과 같습니다:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

이것은 스톡 구성보다 46% 빠릅니다!

OV10은 스톡 펌웨어가 Pi를 갈 수 있는 한 높은 것이며 2250 MHz는 프로덕션에서 안정적으로 실행할 수 있는 가장 빠른 속도였습니다.

스트레스 테스트의 온도는 이렇게 높아집니다:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

그러나 실제 validation 중에는 60°C 이하로 유지되는 경향이 있으며 이는 우리에게 허용됩니다.

## 다음 단계

이제 Pi가 실행되고 Rocket Pool을 실행할 준비가 되었습니다!
[ETH 클라이언트 선택](../eth-clients) 섹션으로 이동하십시오.
