# Oracle DAO 노드 테스트

노드가 설정되고 Oracle DAO에 가입한 후, 임무를 제대로 수행할 수 있는지 테스트해야 합니다.
이를 수행하는 가장 좋은 방법은 Rocket Pool의 `treegen` 유틸리티를 사용하여 Redstone 보상 Merkle 트리를 빌드하는 것입니다.

### treegen

`treegen`은 archive Execution 및 Consensus 클라이언트를 통해 이전 보상 간격에 대한 전체 보상 Merkle 트리 및 관련 아티팩트를 재현할 수 있는 도구입니다.
또한 실행 시점의 최신 확정된 에포크에서 끝난 것처럼 가정하고 간격 시작부터 해당 시점까지의 부분 트리를 생성하여 현재 간격을 "드라이 런"할 수도 있습니다.

::: tip 팁
보상 트리 자체 및 관련 파일에 대한 자세한 내용은 [**공식 사양**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec)을 참조하십시오.
:::

`treegen`은 독립 실행형 바이너리(현재 Linux 시스템, x64 및 arm64 전용으로만 빌드됨) 또는 Docker 컨테이너로 사용할 수 있습니다.

독립 실행형 바이너리를 다운로드하려면 여기의 릴리스에서 찾을 수 있습니다: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
사용 지침은 거기의 README에 포함되어 있지만 아래에서도 몇 가지 예를 다룹니다.

Docker 컨테이너 태그는 `rocketpool/treegen:latest`입니다.

## 드라이 런 트리 빌드

첫 번째 테스트로, 보상 간격 시작부터 최신(확정된) 슬롯까지 트리를 계산하는 드라이 런 트리를 생성하도록 `treegen`을 실행합니다.
간단함을 위해 노드 머신 자체에서 Docker 컨테이너를 활용하는 리포지토리에 포함된 [스크립트](https://github.com/rocket-pool/treegen/blob/main/treegen.sh)를 사용합니다:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning 참고
이 특정 구성은 Docker 구성을 통해 Execution Client 및 Beacon Node API를 노출해야 합니다. `rocketpool service config` TUI에서 두 옵션이 모두 활성화되어 있는지 확인하십시오.
:::

이렇게 하면 클라이언트가 적시에 쿼리에 응답하는 능력을 테스트합니다(예: 타사 서비스를 사용하는 경우, 쿼리 속도 제한이 불충분한지 평가하는 데 도움이 됩니다). 그러나 **Archive Mode 기능은 테스트하지 않습니다**.
다음과 같은 출력을 생성합니다:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

오류 없이 실행되면 보상 트리 아티팩트를 생성하고 작업 디렉토리에 JSON 파일로 저장합니다.
내용을 자유롭게 탐색하고 건전한지 확인할 수 있지만 드라이 런 파일이므로 비교를 위해 정식으로 저장된 곳은 없습니다.

## 과거 간격에서 정식 트리 빌드

다음 테스트는 과거 간격의 완전한 트리 중 하나를 복제하는 것입니다.
이를 위해서는 Execution Layer 및 Consensus Layer 모두에 대한 아카이브 액세스가 필요하므로 두 기능 모두에 대한 좋은 테스트가 됩니다.

현재 시점에서 **간격 2**는 과거에 멀리 있고 Smoothing Pool(기간 동안 보상을 계산할 때 가장 큰 계산 부하를 차지함)이 포함되어 있으므로 이상적인 선택입니다.

다음 명령을 사용하여 `treegen`을 실행합니다:

```shell
./treegen.sh -e http://<your archive EC url> -b http://localhost:5052 -i 2
```

여기서 **Execution Client URL**이 다릅니다. 간격 2의 스냅샷 블록이 과거에 멀리 있었으므로 Archive EC여야 _합니다_.

::: warning 참고
클라이언트 구성에 따라 이 트리를 빌드하는 데 *몇 시간*이 걸릴 수 있습니다.
Smartnode는 아래 예에서 볼 수 있듯이 진행 상황에 대한 상태 표시기를 제공합니다.
:::

출력은 다음과 같습니다(간결성을 위해 잘림):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

여기서 찾아야 할 핵심 사항은 마지막에 있는 이 메시지입니다:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

이를 받으면 watchtower가 트리를 올바르게 빌드할 수 있습니다.

::: danger 참고
이것이 트리를 빌드할 수 있음을 증명하지만, 결과 트리를 IPFS에 업로드할 수 있도록 Web3.Storage API 토큰이 Smartnode의 구성에 입력되었는지 _확인해야_ 합니다.
:::

### 다음 단계

다음으로, 노드의 성능을 모니터링하는 방법을 다룹니다.
