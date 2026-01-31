# Fee Distributor와 Smoothing Pool

이제 [Merge](https://ethereum.org/en/upgrades/merge/)가 통과되면서 노드 운영자는 Ethereum 체인에 제안하는 블록에 포함된 트랜잭션에서 **우선 수수료**(**팁**)를 받습니다.
이러한 수수료는 Execution 레이어에서 발생하고 그곳에 남아 있습니다.

Consensus 레이어에서 생성되고 자동으로 주기적으로 출금되는 대부분의 검증 보상과 달리, 이러한 수수료는 _즉시 유동화_됩니다.
일반적으로 우선 수수료는 Beacon Chain 보상만큼 거의 많은 ETH를 제공하므로 Merge의 매우 좋은 혜택입니다.

::: tip 참고
빠른 알림으로 다양한 유형의 보상과 어느 레이어에서 제공되는지에 대한 분석은 다음과 같습니다:

- Consensus 레이어: 증명, 블록 제안, 동기화 위원회, 슬래싱 보고
- Execution 레이어: 블록 제안의 우선 수수료 및 MEV(다음 섹션에서 논의)

:::

## Fee Recipient

Ethereum 체인에 블록을 제안할 때 프로토콜은 블록에 포함된 각 트랜잭션의 팁을 어디로 보낼지 알아야 합니다.
검증자의 주소로 보낼 수 없는데, 이는 Consensus 레이어에 있기 때문입니다 - Execution 레이어가 아닙니다.
미니풀 주소로도 보낼 수 없는데, 솔로 스테이커에게도 작동해야 하며 솔로 스테이커는 Rocket Pool처럼 검증자에 연결된 Execution 레이어의 주소를 가지고 있지 않기 때문입니다.

대신 작동 방식은 상당히 간단합니다: Rocket Pool이 Validator 클라이언트를 시작할 때 **fee recipient**라는 인수를 전달합니다.
fee recipient는 단순히 팁을 보내려는 Execution 레이어의 주소입니다.

Rocket Pool은 Beacon 체인 보상을 공정하게 분배하는 것과 같은 방식으로 귀하와 rETH 풀 스테이커 간에 이러한 보상을 공정하게 분배하도록 설계되었습니다: 미니풀 검증자가 얻는 모든 우선 수수료 중 귀하의 몫은 귀하에게 갑니다(모든 미니풀의 평균 수수료 포함), 나머지 부분은 풀 스테이커에게 갑니다(평균 수수료 제외).
정확한 비율은 보유한 8 ETH 본딩 미니풀과 16 ETH 본딩 미니풀의 수에 따라 달라집니다.

이를 위해 Smartnode는 자동으로 노드의 `fee recipient`를 다음 특수 계약 중 하나로 설정합니다:

- 노드 자체의 개인 **Fee Distributor** (기본값)
- **Smoothing Pool** (선택 사항)

간단히 말해서 **Fee Distributor**는 우선 수수료를 수집하고 귀하와 rETH 스테이커 간에 공정하게 분할하는 노드에 연결된 고유한 계약입니다.
우선 수수료를 위한 개인 금고와 같습니다.
누구나(귀하 포함) 언제든지 잔액을 분배하여 보상이 항상 rETH 스테이커에게 제공되도록 할 수 있습니다.

**Smoothing Pool**은 참여하는 모든 노드 운영자가 우선 수수료를 함께 집계하고 풀링할 수 있도록 하는 특별한 선택 가입 계약이며, 각 Rocket Pool 보상 간격(현재 28일마다) 동안 참여자와 rETH 풀 스테이커 간에 공정하게 분배합니다.
이는 높은 우선 수수료를 가진 블록 제안을 받는 것과 관련된 운 요인에 대해 걱정하고 싶지 않고, 대신 좋은, 규칙적이고 일관된 월별 수익을 선호하는 노드 운영자에게 매우 매력적인 기능입니다.

아래에서 이 두 가지를 모두 다루어 차이점과 Smoothing Pool에 가입할지 여부를 이해할 수 있도록 하겠습니다.

::: tip 참고
2024-10-28 이후에 생성된 미니풀의 경우 보너스 수수료를 분배하는 데 사용되므로 Smoothing Pool이 강력히 권장됩니다. Smoothing Pool을 선택 해제하면 이러한 미니풀은 총 5% 수수료를 받습니다. Smoothing Pool을 선택하면 이러한 미니풀은 10%(RPL 스테이킹 없음)에서 14%(RPL 스테이크가 차용된 ETH의 10% 이상으로 평가됨) 사이의 수수료를 받습니다.
:::

## 귀하의 Fee Distributor

귀하의 Fee Distributor는 **귀하의 노드에 특정한** Execution 레이어의 고유한 계약입니다.
시간이 지남에 따라 획득한 모든 우선 수수료를 보유하며, rETH 풀 스테이커와 출금 주소에 공정하게 분할하고 분배하는 데 필요한 로직을 포함합니다.
이 분배 프로세스는 **누구나**(rETH 스테이커 포함) **언제든지** 호출할 수 있습니다.
보상이 만료되기 전의 시간 제한이 없습니다.

노드의 Fee Distributor 주소는 **노드 주소를 기반으로 결정론적으로** 결정됩니다.
즉, Fee Distributor가 생성되기 전에 미리 알려져 있습니다.

새로운 Rocket Pool 노드는 등록 시 노드의 Fee Distributor 계약을 자동으로 생성(초기화)합니다.
Redstone 업그레이드 이전에 생성된 노드는 이 프로세스를 수동으로 수행해야 합니다.
이것은 한 번만 실행하면 됩니다.

이로 인한 흥미로운 결과 중 하나는 Fee Distributor 계약을 초기화하기 **전에** Distributor의 주소가 잔액을 누적하기 시작할 수 있다는 것입니다.
이는 괜찮은데, Distributor를 초기화하자마자 기존 잔액 전체에 대한 액세스 권한을 얻기 때문입니다.

**기본적으로 노드는 검증자의 fee recipient로 Fee Distributor를 사용합니다.**

### 주소 및 잔액 보기

다음의 일부로 fee distributor의 주소와 잔액을 볼 수 있습니다:

```shell
rocketpool node status
```

출력은 다음과 같습니다:

![](../node-staking/images/status-fee-distributor.png)

### Fee Distributor 초기화하기

노드의 distributor를 초기화하려면 이 새 명령을 실행하기만 하면 됩니다:

```shell
rocketpool node initialize-fee-distributor
```

::: warning 참고
Redstone 업데이트 이전에 노드를 생성한 경우 `rocketpool node deposit`으로 새 미니풀을 생성하기 전에 이 함수를 한 번 호출해야 합니다.
:::

distributor가 초기화되면 다음 명령을 사용하여 전체 잔액을 청구하고 분배할 수 있습니다:

```shell
rocketpool node distribute-fees
```

이렇게 하면 보상의 귀하 몫이 **출금 주소**로 전송됩니다.

::: warning 과세 사건에 대한 참고 사항
새 미니풀을 생성할 때마다 Rocket Pool은 자동으로 `distribute-fees`를 호출합니다.
이는 새 미니풀을 생성할 때 변경될 수 있는 노드의 평균 수수료를 사용하여 누적된 수수료를 분배하기 위한 것입니다.

또한 누구나 fee distributor에서 `distribute-fees`를 호출할 수 있다는 점에 유의하세요(rETH 보상을 인질로 잡는 것을 방지하기 위해).
이 메서드가 호출될 때마다 과세 사건이 발생할 수 있습니다.

Smoothing Pool 사용 여부를 결정할 때 이러한 조건을 염두에 두세요(아래에서 논의).
:::

### 패널티 시스템

노드 운영자가 Validator 클라이언트에서 사용되는 fee recipient를 수동으로 수정하여 "부정행위"를 하지 않도록 하기 위해 Rocket Pool은 패널티 시스템을 사용합니다.

Oracle DAO는 Rocket Pool 노드 운영자가 생성한 각 블록을 지속적으로 모니터링합니다.

노드가 Smoothing Pool을 _선택 해제_한 경우 다음 주소가 유효한 fee recipient로 간주됩니다:

- rETH 주소
- Smoothing Pool 주소
- 노드의 fee distributor 계약

노드가 Smoothing Pool을 _선택_한 경우 다음 주소가 유효한 fee recipient로 간주됩니다:

- Smoothing Pool 주소

위의 유효한 주소 중 하나가 아닌 fee recipient는 **유효하지 않은** 것으로 간주됩니다.

**유효하지 않은** fee recipient로 블록을 제안한 미니풀은 **스트라이크**를 받습니다.
세 번째 스트라이크에서 미니풀은 **위반**을 받기 시작합니다 - 각 위반은 **ETH 수익을 포함한 총 Beacon Chain 잔액의 10%**를 차감하고 미니풀에서 자금을 출금할 때 rETH 풀 스테이커에게 보냅니다.

위반은 **노드** 수준이 아닌 **미니풀** 수준입니다.

Smartnode 소프트웨어는 정직한 사용자가 패널티를 받지 않도록 설계되었으며, 이를 위해 Validator 클라이언트를 오프라인으로 전환해야 하는 경우에도 그렇게 합니다.
이 경우 증명을 중지하고 Smartnode가 fee recipient를 올바르게 설정할 수 없는 이유에 대한 오류 메시지가 로그 파일에 표시됩니다.

## Smoothing Pool

**Smoothing Pool**은 노드 운영자에게 제공되는 Rocket Pool 네트워크의 고유한 선택 가입 기능입니다.
기본적으로 선택하는 모든 노드 운영자의 fee recipient가 되어 해당 노드 운영자가 제안한 블록의 우선 수수료를 하나의 큰 풀로 집합적으로 누적합니다. Rocket Pool 보상 체크포인트(RPL 보상을 분배하는 데 사용되는 것과 동일) 동안 풀의 총 ETH 잔액은 풀 스테이커와 선택한 노드 운영자에게 공정하게 분배됩니다.

본질적으로 Smoothing Pool은 블록 제안이 선택되는 것과 관련된 무작위성을 효과적으로 제거하는 방법입니다.
운이 나빠서 몇 달 동안 제안이 없거나 블록 제안에 낮은 우선 수수료만 있는 경우 Smoothing Pool이 매우 흥미로울 수 있습니다.

수학을 이해하기 쉽게 하기 위해 커뮤니티 구성원 Ken Smith가 Smoothing Pool과 Fee Distributor의 수익성을 비교하는 [대규모 분석](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf)을 작성했으며, 이는 다음 차트로 잘 요약되어 있습니다:

![](../node-staking/images/sp-chart.png)

간단히 말해서 Smoothing Pool에 귀하보다 더 많은 미니풀이 있는 한 가입하면 앞서 나갈 가능성이 더 높습니다.

### 규칙

Smoothing Pool은 다음 규칙을 사용합니다:

- Smoothing Pool의 잔액이 분배되는 Rocket Pool 보상 체크포인트 동안 계약의 총 ETH 잔액은 둘로 나뉩니다.
  - rETH 스테이커는 1/2(16 ETH 본드의 경우) 또는 3/4(8 ETH 본드 즉 LEB8의 경우)를 받습니다. 선택한 모든 노드 운영자의 **평균 수수료**를 뺀 금액입니다
  - 나머지는 선택한 노드 운영자에게 갑니다.

- Smoothing Pool 선택은 **노드 수준**에서 수행됩니다. 선택하면 모든 미니풀이 선택됩니다.

- 누구나 언제든지 선택할 수 있습니다. 시스템을 조작하는 것을 방지하기 위해 선택 해제하기 전에 전체 보상 간격(Hoodi에서 3일, Mainnet에서 28일)을 기다려야 합니다(예: 블록을 제안하도록 선택된 직후 SP를 떠나는 것).
  - 선택 해제한 후에는 다시 선택하려면 다른 전체 간격을 기다려야 합니다.

- Smoothing Pool은 선택한 각 노드가 소유한 각 미니풀의 "몫"(간격 동안 풀의 ETH 부분)을 계산합니다.
  - 몫은 간격 동안 미니풀의 성능(Beacon Chain에서 보낸 증명 수와 놓친 증명 수를 확인하여 계산)과 미니풀의 수수료율의 함수입니다.

- 노드의 총 몫은 미니풀 몫의 합계입니다.

- 노드의 총 몫은 선택한 시간에 따라 조정됩니다.
  - 전체 간격 동안 선택한 경우 전체 몫을 받습니다.
  - 간격의 30% 동안 선택한 경우 전체 몫의 30%를 받습니다.

Smoothing Pool 보상 계산의 완전한 기술 세부 사항에 관심이 있는 경우 [여기에서 전체 사양을 검토](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards)하세요.

### Smoothing Pool 가입 및 탈퇴

Smoothing Pool을 선택하려면 다음 명령을 실행합니다:

```shell
rocketpool node join-smoothing-pool
```

이렇게 하면 Rocket Pool 계약에서 선택한 것으로 기록되고 Validator 클라이언트의 `fee recipient`가 노드의 distributor 계약에서 Smoothing Pool 계약으로 자동으로 변경됩니다.

풀을 떠나려면 다음 명령을 실행합니다:

```shell
rocketpool node leave-smoothing-pool
```

이렇게 하면 Rocket Pool 계약에서 선택 해제한 것으로 기록되고, 짧은 지연이 지나면 Validator 클라이언트의 `fee recipient`가 Smoothing Pool 계약에서 노드의 Fee Distributor 계약으로 자동으로 변경됩니다.

### Smoothing Pool에서 보상 청구하기

Smoothing Pool의 보상은 Redstone 보상 시스템을 사용하여 각 보상 간격 끝에 RPL과 함께 번들로 제공됩니다.
청구는 다음을 실행하는 것만큼 간단합니다:

```shell
rocketpool node claim-rewards
```

Smoothing Pool을 선택한 경우 각 간격에 대해 받는 ETH 양이 0보다 많다는 것을 알 수 있습니다:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

여기서 간격 1의 Smoothing Pool 보상은 노드가 해당 간격 동안 선택했으며 그에 따라 보상을 받았음을 나타냅니다.

가이드 후반부의 [보상 청구](./rewards) 섹션에서 RPL 및 Smoothing Pool 보상 청구에 대해 더 자세히 다룰 것입니다.

## 다음 단계

Smoothing Pool에 가입할지 여부를 결정했으면 MEV 및 MEV 보상에 대한 다음 섹션을 살펴보세요.
