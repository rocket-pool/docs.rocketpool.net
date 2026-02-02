# Rocket Pool Redstone 업데이트

**Redstone**이라는 제목의 Rocket Pool의 다음 주요 업데이트가 Ropsten 및 Holesky 테스트 네트워크에서 베타 테스트를 위해 출시되었습니다.
이 페이지에서는 Smartnode 스택 및 Rocket Pool 프로토콜 전반에 대한 업데이트를 포함하여 Redstone이 가져오는 주요 변경 사항을 설명합니다.

Rocket Pool의 이전 버전과 Redstone 간의 모든 차이점을 이해하려면 이 페이지를 철저히 읽어보십시오.

::: tip 주의
업그레이드를 위해 노드를 준비하는 방법 및 업그레이드 후 수행할 작업에 대한 자세한 정보는 다음 가이드를 참조하십시오:

- [Docker Mode 가이드](./docker-migration.mdx)
- [Hybrid Mode 가이드](./hybrid-migration.mdx)
- [Native Mode 가이드](./native-migration.mdx)

:::

## 클라이언트 변경 사항 및 The Merge

Ropsten (그리고 곧 Holesky)은 **Execution 및 Consensus Layer의 병합**을 성공적으로 수행했습니다.
더 이상 Proof-of-Work를 사용하지 않습니다. 대신 Ropsten의 validator는 이제 두 체인 모두에서 블록을 생성하고 제안할 책임이 있습니다.
이것은 흥미로운 재정적 이점 (나중에 논의될 것입니다)과 함께 오지만 validator 운영 방식에 몇 가지 중요한 변경 사항도 있습니다.

아래는 The Merge의 일부로 클라이언트 동작 변경 사항에 대한 간략한 요약입니다:

- Execution 클라이언트는 이제 세 개의 API 포트를 사용합니다:
  - API에 대한 HTTP 액세스용 (**기본값 8545**)
  - API에 대한 Websocket 액세스용 (**기본값 8546**)
  - The Merge 이후 Consensus 클라이언트가 사용하는 새로운 **Engine API**용 (**기본값 8551**)

- Execution 클라이언트는 이제 Consensus 클라이언트가 필요하고, Consensus 클라이언트는 이제 Execution 클라이언트가 필요합니다.
  - **더 이상 둘 중 하나를 단독으로 운영할 수 없습니다.**

- 하나의 Execution 클라이언트는 하나의, 오직 하나의 Consensus 클라이언트에 연결되어야 합니다 (그 반대도 마찬가지입니다).
  - 여러 Execution 클라이언트를 단일 Consensus 클라이언트에 연결하거나 여러 Consensus 클라이언트를 단일 Execution 클라이언트에 연결할 수 없습니다.
  - 이 때문에 **폴백 execution 클라이언트는 더 이상 사용할 수 없습니다** Rocket Pool 노드 운영자의 경우.

- **전체 execution 클라이언트**가 필요합니다.
  - 원격 제공자 (Infura 및 Pocket과 같은)는 더 이상 Rocket Pool 또는 기타 validator가 사용할 수 없습니다.

## Fee Recipients 및 Distributor

validator가 이제 블록 생성을 담당하므로 각 트랜잭션에 첨부된 **우선 수수료** (**팁**이라고도 함)를 받습니다.
이러한 수수료는 ETH로 지불되며 minipool validator 중 하나가 블록을 제안할 때마다 직접 제공됩니다.
Beacon Chain에 잠긴 ETH와 달리 **우선 수수료에 액세스하기 위해 출금을 기다릴 필요가 없습니다**!
단순히 블록 제안 프로세스의 일부로 수여됩니다.

수수료를 어디로 보낼지 알기 위해 Validator Client는 `fee recipient`라는 추가 매개변수가 필요합니다.
이것은 블록 제안 중에 노드가 얻은 모든 우선 수수료가 전송될 Execution Layer (ETH1)의 주소입니다.

Rocket Pool은 Beacon 체인 보상을 공정하게 분배하는 것과 같은 방식으로 이러한 보상을 공정하게 분배하도록 설계되었습니다: minipool validator가 얻은 우선 수수료의 절반은 귀하에게 (모든 minipool의 평균 커미션 포함) 전달되고 나머지 절반은 pool staker에게 (평균 커미션을 뺀) 전달됩니다.

이를 위해 Smartnode는 Validator Client의 `fee recipient`를 노드의 **fee distributor**라는 특수 주소로 자동 설정합니다.
fee distributor는 **노드에 특정한** Execution Layer의 고유한 계약입니다.
시간이 지남에 따라 얻은 모든 우선 수수료를 보유하며 이를 공정하게 분할하고 분배하는 데 필요한 로직을 포함합니다.
이 분배 프로세스는 귀하 (노드 운영자)가 제어하며 원하는 때 수행할 수 있습니다.
시간 제한이 없습니다.

노드의 fee distributor 주소는 **노드 주소를 기반으로 결정론적으로 결정됩니다**.
즉, fee distributor가 생성되기 전에 미리 알려져 있습니다.
**Smartnode는 이 주소를 fee recipient로 사용합니다.**

::: tip 참고
기본적으로 fee recipient는 Smartnode v1.5.0을 설치할 때 **rETH 주소**로 설정됩니다 (Redstone 계약 업데이트가 아직 배포되지 않은 경우).
Smartnode는 Redstone 업데이트가 배포되면 이를 노드의 fee distributor 주소로 자동 업데이트합니다.

이 규칙의 한 가지 예외는 **Smoothing Pool**에 참여한 경우입니다 - 자세한 내용은 이 페이지의 끝 부분에 있는 섹션을 참조하십시오.
:::

새로운 Rocket Pool 노드는 등록 시 노드의 distributor 계약을 자동으로 초기화합니다.
기존 노드는 이 프로세스를 수동으로 수행해야 합니다.
이것은 한 번만 실행하면 됩니다.

이것의 한 가지 흥미로운 결과는 distributor의 주소가 노드 distributor 계약을 초기화하기 **전에** 잔액을 누적하기 시작할 수 있다는 것입니다.
이것은 괜찮습니다. distributor는 초기화하자마자 기존 잔액 전체에 액세스할 수 있기 때문입니다.

fee distributor의 잔액을 다음의 일부로 볼 수 있습니다:

```shell
rocketpool node status
```

출력은 다음과 같습니다:

![](../../node-staking/images/status-fee-distributor.png)

노드의 distributor를 초기화하려면 이 새 명령어를 실행하십시오:

```shell
rocketpool node initialize-fee-distributor
```

::: warning 참고
Redstone 업데이트 후에는 `rocketpool node deposit`을 사용하여 새 minipool을 생성하기 전에 이 함수를 호출해야 합니다.
:::

distributor가 초기화되면 다음 명령어를 사용하여 전체 잔액을 청구하고 분배할 수 있습니다:

```shell
rocketpool node distribute-fees
```

이렇게 하면 보상의 몫이 **출금 주소**로 전송됩니다.

## Rocket Pool 프로토콜 변경 사항

Execution 및 Consensus 클라이언트 변경 사항 및 새로운 우선 수수료 외에도 Rocket Pool 프로토콜 자체에 알아야 할 몇 가지 중요한 변경 사항이 있습니다.

### 새로운 보상 시스템

Redstone 업데이트와 함께 도입된 가장 중요한 변경 사항 중 하나는 **새로운 보상 시스템**입니다.
이것은 노드 운영자가 RPL 보상 (및 Smoothing Pool의 ETH - 나중에 논의됨)을 받는 방식을 완전히 재정비한 것입니다.

_기존_ 보상 시스템에는 다음과 같은 단점이 있었습니다:

- 청구 비용이 약 400k 가스로 상당히 비쌌습니다.
- 노드 운영자는 각 기간 (28일마다)에 보상을 청구해야 했으며 그렇지 않으면 몰수되었습니다. 이는 소량의 RPL을 가진 노드 운영자에게 가스 비용이 엄청나게 비쌀 수 있음을 의미했습니다.
- 보상은 체크포인트 시점이 아닌 _청구_ 시점에 결정되었습니다. 사용자가 체크포인트와 청구 사이에 상당한 양의 RPL을 스테이킹한 경우 보상이 희석되어 예상보다 적은 RPL을 받을 수 있었습니다.

_새로운_ 청구 시스템은 이러한 모든 문제를 해결합니다.

모든 기간마다 Oracle DAO는 Rocket Pool 네트워크의 노드 운영자 상태에 대한 **실제 스냅샷**을 집단적으로 생성하며, 여기에는 모든 유효 스테이크 양이 포함됩니다.
이 정보는 [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)로 컴파일됩니다 - 모든 세부 정보를 스마트 컨트랙트에서 사용할 수 있도록 하는 매우 효율적인 방법입니다.
Merkle Tree는 JSON 파일로 구축되어 [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System)에 호스팅되며 Merkle Tree의 루트가 계약에 제출됩니다.

이 새로운 시스템의 특징은 다음과 같습니다:

- 이제 원하는 만큼 오랫동안 **보상을 누적**할 수 있습니다. 청구해야 하는 시간 제한이 더 이상 없습니다.
- **여러 기간을** 한 번에 청구할 수 있습니다.
- 첫 번째 청구 트랜잭션은 약 85k 가스를 사용합니다. 각 후속 청구 트랜잭션은 약 55k 가스를 사용합니다.
  - 한 번에 여러 기간을 청구하는 경우 각 추가 기간은 **6k 가스**를 사용하므로 가능한 한 많이 한 번에 청구하는 것이 가장 비용 효율적입니다.
- RPL 보상은 **더 이상 희석되지 않습니다** - RPL 보상은 스냅샷 시점에 고정되며 항상 해당 금액을 받을 자격이 있습니다.
- 청구 트랜잭션의 일부로 **RPL 보상의 일부(또는 전부)를 재스테이킹**할 수 있어 현재보다 가스 요구 사항이 더욱 줄어듭니다.
- 현재 **모든 청구는 Mainnet에서 이루어져야 하지만** 나중에 Layer 2 네트워크에서 청구할 수 있는 기능을 구축할 인프라를 갖추고 있습니다.

노드가 새로운 보상 체크포인트를 감지하면 해당 기간의 JSON 파일을 자동으로 다운로드합니다.
그런 다음 다음 명령어를 사용하여 보상을 확인할 수 있습니다:

```shell
rocketpool node claim-rewards
```

기간이 지나고 보상이 누적되면 출력은 다음과 같습니다:

![](../../node-staking/images/claim-rewards-gb.png)

여기에서 각 기간에 얻은 보상을 빠르게 확인하고 청구할 항목을 결정할 수 있습니다.
**Ropsten의 기간 시간은 테스트를 용이하게 하기 위해 1일로 설정되어 있습니다.**

또한 이 청구 중에 재스테이킹하려는 금액을 지정할 수도 있습니다:

![](../../node-staking/images/autostake.png)

이를 통해 한 번의 트랜잭션으로 RPL 보상을 복리화할 수 있어 현재 사용해야 하는 것보다 훨씬 적은 가스를 사용합니다.

::: tip 참고
Oracle DAO가 생성한 것을 다운로드하는 대신 보상 체크포인트를 수동으로 구축하는 것을 선호하는 경우 TUI에서 이 설정을 `Download`에서 `Generate`로 변경할 수 있습니다:

![](../../node-staking/images/tui-generate-tree.png)

팁이 암시하는 것처럼 이를 수행하려면 아카이브 노드에 액세스해야 합니다.
로컬 Execution 클라이언트가 아카이브 노드가 아닌 경우 아래의 `Archive-Mode EC URL` 상자에 별도의 아카이브 노드 (Infura 또는 Alchemy와 같은)를 지정할 수 있습니다.
이 URL은 Merkle 트리를 생성할 때만 사용됩니다. 검증 작업에는 사용되지 않습니다.
:::

::: danger 경고
_스냅샷 시점에_ 10% RPL 담보 미만인 경우 해당 스냅샷에 대한 보상을 받을 자격이 없습니다.
현재 시스템과 달리 청구하기 전에 "보충"하여 다시 자격을 얻을 수 있는 것이 아니라 해당 스냅샷에서 영구적으로 잠기며 **해당 기간에 대한 보상을 받을 수 없습니다**.
해당 기간에 대한 보상을 받으려면 스냅샷 시점에 10% 담보 이상이어야 **합니다**.
:::

### Smoothing Pool

Redstone 업데이트의 마지막 흥미로운 새 기능은 **Smoothing Pool**입니다.
Smoothing Pool은 참여한 모든 멤버의 우선 수수료를 집단적으로 풀링하는 **옵트인 기능**입니다.
보상 체크포인트 동안 풀의 총 ETH 잔액은 pool staker 부분과 노드 운영자 부분으로 나뉩니다.
노드 운영자 부분의 모든 보상은 **풀의 모든 멤버에게 공정하게 분배됩니다**.

본질적으로 Smoothing Pool은 Beacon Chain의 블록 제안과 관련된 무작위성을 효과적으로 제거하는 방법입니다.
불운의 연속을 겪고 몇 달 동안 제안을 받지 못한 적이 있다면 Smoothing Pool이 매우 흥미로울 수 있습니다.

::: tip 참고
Smoothing Pool 보상은 RPL 보상에 사용되는 Merkle Tree에 내장되어 있으므로 `rocketpool node claim-rewards`를 사용하여 RPL을 청구할 때 동시에 청구합니다.
:::

세부 사항을 명확히 하기 위해 Smoothing Pool은 다음 규칙을 사용합니다:

- Smoothing Pool에 참여하는 것은 **노드 수준**에서 수행됩니다. 참여하면 모든 minipool이 참여합니다.

- 노드 운영자의 총 몫은 Smoothing Pool에 참여한 모든 노드의 모든 minipool의 평균 커미션에 의해 결정됩니다.

- 누구나 언제든지 참여할 수 있습니다. 시스템 악용을 방지하기 위해 옵트아웃하기 전에 전체 보상 기간 (Ropsten에서 1일, Mainnet에서 28일)을 기다려야 합니다.
  - 옵트아웃하면 다시 참여하려면 또 다른 전체 기간을 기다려야 합니다.

- Smoothing Pool은 참여한 각 노드가 소유한 각 minipool의 "몫" (기간 동안 풀의 ETH 부분)을 계산합니다.
  - 몫은 기간 동안 minipool의 성능 (Beacon Chain에서 보낸 증명 수와 놓친 증명 수를 보고 계산됨) 및 minipool의 커미션 비율의 함수입니다.

- 노드의 총 몫은 minipool 몫의 합계입니다.

- 노드의 총 몫은 참여한 시간에 비례하여 조정됩니다.
  - 전체 기간 동안 참여한 경우 전체 몫을 받습니다.
  - 기간의 30% 동안 참여한 경우 전체 몫의 30%를 받습니다.

Smoothing Pool에 참여하려면 다음 명령어를 실행하십시오:

```shell
rocketpool node join-smoothing-pool
```

이렇게 하면 Rocket Pool 계약에 참여한 것으로 기록되고 Validator Client의 `fee recipient`가 노드의 distributor 계약에서 Smoothing Pool 계약으로 자동 변경됩니다.

풀을 떠나려면 이 명령어를 실행하십시오:

```shell
rocketpool node leave-smoothing-pool
```

### 페널티 시스템

노드 운영자가 Validator Client에 사용된 fee recipient를 수동으로 수정하여 "속임수"를 쓰지 못하도록 Rocket Pool은 페널티 시스템을 사용합니다.

Oracle DAO는 Rocket Pool 노드 운영자가 생성한 각 블록을 지속적으로 모니터링합니다.
다음 주소 중 하나가 아닌 fee recipient가 있는 블록은 **무효**로 간주됩니다:

- rETH 주소
- Smoothing Pool 주소
- 노드의 fee distributor 계약 (Smoothing Pool에서 옵트아웃한 경우)

**무효** fee recipient로 블록을 제안한 minipool은 **스트라이크**를 받게 됩니다.
세 번째 스트라이크에서 minipool은 **위반**을 받기 시작합니다 - 각 위반은 **총 Beacon Chain 잔액의 10% (ETH 수익 포함)**를 공제하고 minipool에서 자금을 인출할 때 rETH pool staker에게 보냅니다.

위반은 **노드** 수준이 아닌 **minipool** 수준입니다.

Smartnode 소프트웨어는 정직한 사용자가 페널티를 받지 않도록 설계되었습니다. 그렇게 하기 위해 Validator Client를 오프라인으로 전환해야 하는 경우에도 마찬가지입니다.
이런 일이 발생하면 증명을 중지하고 Smartnode가 fee recipient를 올바르게 설정할 수 없는 이유에 대한 오류 메시지가 로그 파일에 표시됩니다.

## 업그레이드 전후 가이드

업그레이드를 위해 노드를 준비하는 방법 및 업그레이드 후 수행할 작업에 대한 자세한 정보는 다음 가이드를 참조하십시오:

- [Docker Mode 가이드](./docker-migration.mdx)
- [Hybrid Mode 가이드](./hybrid-migration.mdx)
- [Native Mode 가이드](./native-migration.mdx)
