# 노드 백업하기

::: tip 참고
이 문서는 현재 **Docker 모드** 설치를 기준으로 작성되었습니다.
Hybrid 또는 Native 사용자의 경우 일부 위치가 다를 수 있습니다.
:::

일반적으로 Smartnode를 통해 노드 지갑과 minipool을 생성한 경우, 완전한 장애로부터 노드를 복구하기 위해 실제로 필요한 것은 **노드 지갑의 니모닉**뿐입니다.
나머지는 모두 니모닉으로부터 쉽게 복구할 수 있습니다.

외부에서 생성된 validator 키가 있는 minipool이 있는 경우(예: **Allnodes**에서 자체 호스팅 노드로 마이그레이션한 경우), validator의 개인 keystore 파일도 필요합니다. 이러한 키는 노드 지갑에서 복구할 수 없기 때문입니다.

그러나 Merge가 발생한 후에는 Execution 레이어 체인을 재동기화해야 할 경우 라이트 Execution 클라이언트(예: Pocket 또는 Infura)를 대체 수단으로 사용할 수 없게 됩니다.
또한 올바르게 증명하려면 활성화되고 정상적인 Execution 클라이언트가 필요합니다.
Execution 클라이언트 장애(손상된 데이터베이스, SSD 오작동 또는 손상/도난당한 하드웨어 등)로부터 빠르고 안정적으로 복구하는 방법을 갖추는 것은 매우 중요합니다. 처음부터 동기화하는 데 몇 시간 또는 며칠이 걸릴 수 있기 때문입니다.

이 가이드에서는 노드의 복원력을 개선하고 불필요한 다운타임을 최소화하기 위해 이러한 항목들을 백업하는 방법을 보여드리겠습니다.

::: warning 참고
이 가이드는 Smartnode를 기본 디렉토리(`~/.rocketpool`)에 설치했다고 가정합니다.
다른 설치 디렉토리를 지정한 경우, 아래 지침에서 해당 디렉토리로 적절히 대체하십시오.
:::

## 백업 가능한 항목

### Smartnode 설정

Smartnode의 설정은 `~/.rocketpool/user-settings.yml`에 저장됩니다.
이 파일을 저장하고 교체하여 모든 Smartnode 설정(즉, `rocketpool service config`에서 지정한 항목들)을 복원할 수 있습니다.

### Execution 클라이언트 / ETH1 클라이언트 체인 데이터

Execution 클라이언트의 체인 데이터는 백업해야 할 가장 중요한 항목입니다.
언급했듯이 EC 체인 데이터를 재동기화하는 데 며칠이 걸릴 수 있습니다.
Merge 이후에는 이것이 몇 시간에서 며칠간의 다운타임과 수익 손실을 의미합니다!

체인 데이터는 `rocketpool_eth1clientdata` Docker 볼륨 내에 저장되며, 기본적으로 `/var/lib/docker/volumes/rocketpool_eth1clientdata`에 위치합니다.
이 폴더는 일반적으로 권한 없는 사용자 계정에서 액세스할 수 없으므로 `root` 사용자로 전환해야 합니다.

::: tip 참고
초기 Smartnode 설치 중에 Docker 저장 위치를 변경한 경우(두 번째 SSD에 Docker를 실행하는 사용자 등), `/<외부 마운트 지점>/docker/volumes/rocketpool_eth1clientdata`에서 볼륨을 찾을 수 있습니다.

어떤 설치 경로를 사용하는지 기억나지 않는다면 `/etc/docker/daemon.json`에서 위치를 확인할 수 있습니다.
파일이 존재하지 않으면 기본 위치를 사용하는 것입니다.
:::

Execution 체인 데이터를 효율적으로 백업하는 방법에 대한 자세한 지침은 아래 [Execution 체인 데이터 백업하기](#execution-체인-데이터-백업하기) 섹션을 참조하십시오.

### 모니터링 및 메트릭 데이터

이 데이터는 `rocketpool_grafana-storage` Docker 볼륨 내에 저장되며, 기본적으로 `/var/lib/docker/volumes/rocketpool_grafana-storage`에 위치합니다(Docker 저장 위치를 사용자 지정한 경우 `/<외부 마운트 지점>/docker/volumes/rocketpool_prometheus-data`).

## 백업**하지 말아야** 할 항목

### 개인 키 및 비밀번호

노드 지갑의 개인 키와 이를 암호화하는 데 사용되는 비밀번호 파일은 각각 `~/.rocketpool/data/wallet`와 `~/.rocketpool/data/password`에 저장됩니다.
이러한 파일은 `rocketpool wallet recover`를 사용하여 니모닉에서 복구할 수 있으므로 일반적으로 백업할 필요가 없습니다.

어떤 이유로든 이러한 파일을 백업하기로 결정한 경우, 저장 방법에 대해 **매우 주의해야** 합니다.
이러한 파일에 액세스하는 사람은 누구나 노드 지갑, validator 및 가스 등에 저장된 모든 자금에 액세스할 수 있습니다.

이러한 파일을 백업하지 말고 필요한 경우 지갑 니모닉을 사용하여 복구할 것을 **강력히 권장합니다**.

### Consensus 클라이언트 체인 데이터

Execution 레이어 데이터와 달리 Consensus 레이어 데이터는 [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing) 덕분에 노드에 그다지 중요하지 않습니다.
Consensus 클라이언트는 이 기술을 사용하여 Beacon 체인의 헤드로 즉시 재동기화하고 검증 작업을 재개할 수 있습니다.

## Execution 체인 데이터 백업하기

Smartnode는 `rocketpool service export-eth1-data` 명령을 통해 Execution 체인 데이터를 백업할 수 있는 기능을 제공합니다.
내부적으로 이것은 Linux의 강력한 백업/복사 도구인 `rsync`를 활용합니다.

`rsync`는 소스 디렉토리(Docker 볼륨)와 대상 디렉토리(백업 위치)의 파일을 비교합니다.
소스 파일이 대상 디렉토리에 없으면 전체가 복사됩니다.
그러나 파일이 _존재하는_ 경우 `rsync`는 두 파일 간의 _변경 사항_만 복사합니다.

이는 첫 번째 백업이 모든 데이터를 처음에 복사해야 하므로 상당한 시간이 걸린다는 것을 의미합니다.
후속 백업은 이전 백업과 현재 사이의 변경 사항만 복사하므로 프로세스가 훨씬 빠릅니다.

백업 전략의 일환으로 정기적으로 `export-eth1-data`를 실행하도록 계획할 수 있습니다.
체인 데이터의 무결성을 보장하기 위해 이 명령을 실행하면 **데이터를 백업하기 전에 Execution 클라이언트를 안전하게 종료합니다**.
매주 예약하기로 선택한 경우 Execution 클라이언트는 백업을 업데이트하는 동안 몇 분만 다운됩니다.
이것은 처음부터 데이터를 재동기화하는 데 걸리는 며칠보다 확실히 낫습니다.

백업을 트리거하려면 먼저 **데이터를 내보낼 저장 매체를 마운트**하십시오.
예를 들어, 외장 하드 드라이브일 수 있습니다.

::: tip 힌트
Linux에서 외부 장치를 마운트하는 방법을 모르는 경우 쉽습니다!
장치를 노드에 연결하고 [이와 같은 가이드](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/)를 따라 마운트하는 방법을 배우십시오.
:::

마운트한 후 마운트 경로를 기록하십시오.
이 예제에서는 외부 장치가 마운트된 `/mnt/external-drive`라는 폴더에 체인 데이터를 저장한다고 가정하겠습니다.
아래에서 이 경로가 나타나는 모든 곳에서 실제 마운트 경로로 교체하십시오.

이제 다음 명령을 실행하십시오.

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

이것은 대상 폴더에 도달할 수 있고 체인 데이터를 저장할 충분한 여유 공간이 있는지 확인합니다.
출력은 다음과 같습니다.

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

보시다시피 체인 데이터는 100 GB 미만(Hoodi 테스트넷의 경우; Ethereum 메인넷은 한 자릿수 더 클 것입니다)이고 외부 폴더는 287 GiB의 여유 공간이 있으므로 내보내기를 계속할 수 있습니다.

준비가 되면 여기에 `y`를 입력하고 `Enter`를 누르십시오.
이것은 Execution 클라이언트를 중지하고 체인 데이터를 대상 폴더로 복사하기 시작합니다.
실행되는 동안 각 개별 파일의 진행 상황이 화면에 표시됩니다.

::: warning 참고
실행 중에 터미널을 종료_하지 마십시오_.
종료하면 복사가 백그라운드에서 계속 실행되지만 진행 상황을 따라갈 수 없습니다!
:::

완료되면 Execution 클라이언트 컨테이너가 자동으로 재시작됩니다.

**내보내기가 완료된 후 노드에서 기존 체인 데이터가 삭제되지 않습니다!**

### Execution 체인 데이터 복원하기

백업한 체인 데이터를 복원해야 하는 경우 다음 명령을 실행하기만 하면 됩니다.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger 경고
이것은 `rocketpool_eth1clientdata` 볼륨의 기존 Execution 클라이언트 데이터를 자동으로 삭제합니다!
:::

완료되면 Execution 클라이언트를 사용할 준비가 됩니다.
