::: danger 경고
Saturn 1 준비를 위해 Minipool 예금이 현재 비활성화되어 있습니다.
:::

# Solo Validator를 Minipool로 변환

Beacon Chain이 처음 출시되었을 때 validator는 특별한 암호화 키 쌍인 **validator key**와 **withdrawal key**로 생성되었습니다.

validator key는 "핫 키"로, 인터넷에 연결된 활성 시스템에 저장되어야 합니다. 이 키는 귀하의 attestation 및 proposal에 서명하는 데 사용되며 Beacon Chain에서 귀하의 "주소"(validator를 식별하는 데 사용되는 16진수 문자열) 역할을 합니다.

반면에 withdrawal key는 "콜드 키"로, 인터넷에 연결된 활성 시스템에 저장되어서는 _안 됩니다_.
필요할 때까지 액세스할 수 없도록 냉장 보관해야 합니다.
validator key와 달리 withdrawal key는 검증 업무에 전혀 책임이 없습니다.
대신 유일한 역할은 Beacon Chain에서 validator의 자금 인출을 관리하는 것입니다(인출이 구현된 후).

이 이중 키 시스템은 Beacon Chain이 출시된 초기 아키텍처였습니다.
당시에는 Merge도 인출도 설계되지 않았지만 이 시스템은 둘 다 구현될 때 프로토콜이 취하는 형태를 처리할 수 있을 만큼 견고하다고 여겨졌습니다.

오늘날로 돌아와서 이제 인출이 어떻게 작동하는지 훨씬 더 잘 이해하게 되었습니다.
다행히도 Beacon Chain의 기존 solo staking validator(이전 withdrawal key 자격 증명을 사용하는)가 Beacon Chain에서 validator를 종료할 필요 없이 **Rocket Pool minipool로 직접 변환**할 수 있는 방식으로 구현되었습니다!

이 프로세스에 대해 자세히 알고 싶다면 이 가이드가 도움이 될 것입니다.
Ethereum에서 인출이 어떻게 작동하는지 개괄적으로 다루고, 변환 프로세스가 어떻게 작동하는지 설명하며, validator를 minipool로 변환하는 방법에 대한 자세한 안내로 마무리합니다.

## 왜 변환해야 할까요?

기술적 세부 사항을 다루기 전에 대답해야 할 매우 중요한 질문은 solo staker가 애초에 이 프로세스를 고려하는 _이유_입니다.
minipool로의 변환은 모든 사람을 위한 것이 아니지만 이 섹션은 귀하가 그것을 추구할 것인지 여부에 대해 정보에 입각한 선택을 하는 데 도움이 될 것입니다.

Rocket Pool minipool은 기존 solo staking validator에 비해 몇 가지 장점을 누립니다:

- pool staker로부터 빌린 ETH 부분(24 ETH)에 대해 **수수료를 받습니다**.
- 기존 32 ETH 본드를 사용하여 **최대 3개의 추가 validator**(이미 보유한 validator 외에)를 생성할 수 있습니다.
- 모든 Execution layer 보상(예: 블록 제안 및 [MEV 보상](./mev.mdx)에서)을 풀링하고 각 보상 간격 동안 참가자에게 공정하게 분배하는 [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)에 참여할 자격이 있습니다.
- RPL을 스테이킹하면 보너스 수수료와 RPL 인플레이션 보상을 받게 됩니다(현재 ETH staking 보상보다 높은 APR을 제공합니다).

그렇긴 하지만 강조해야 할 몇 가지 차이점이 있습니다:

- 프로토콜이 일련의 스마트 컨트랙트로 구현되므로 **스마트 컨트랙트 위험**을 감수해야 합니다.
- 마찬가지로 기존 node 운영은 **Smartnode stack**을 활용합니다. node에 해당 소프트웨어를 설치하고 실행하는 것과 관련된 모든 위험을 감수해야 합니다.
- node operator가 되려면 몇 가지 새로운 개념을 배워야 하므로 **학습 곡선**이 있습니다.
- Minipool은 보상을 pool staker와 공유해야 하므로 validator의 withdrawal 주소는 Execution layer의 스마트 컨트랙트이며 **귀하가 제어하는 EOA가 아닙니다**. 이것은 보상을 공정하게 분할할 수 있는 스마트 컨트랙트여야 하는 Execution layer 보상에 대한 **fee recipient**에도 적용됩니다.
- Rocket Pool의 **Oracle DAO**는 Beacon Chain에서 Execution layer로 정보를 셔틀링하고 프로토콜이 시행할 수 없는 위반(예: 불법 fee recipient 주소)을 감지할 책임이 있습니다. minipool을 실행한다는 것은 Oracle DAO가 해당 작업을 올바르게 수행할 것을 신뢰해야 함을 의미합니다.

solo validator를 변환하기로 결정하기 전에 이러한 장단점을 신중하게 검토하는 것이 좋습니다.
프로세스를 계속하려면 다음 섹션을 읽으십시오.

## 전제 조건

변환 프로세스를 시작하려면 다음 기준을 충족해야 합니다:

1. 새 minipool을 호스팅하려면 [Rocket Pool 네트워크에 등록된 node](./prepare-node.mdx)가 있어야 합니다.
1. 마이그레이션하려는 validator는 Beacon chain에서 **활성** 상태여야 합니다. 보류 중이거나, 슬래시되거나, 종료 중이거나 종료되었거나, 인출된 상태일 수 없습니다.
1. validator는 Beacon chain에서 **최소 32 ETH**의 잔액을 가지고 있어야 합니다.
1. validator는 [BLS key withdrawal 자격 증명](https://launchpad.ethereum.org/en/withdrawals)(`0x00` 자격 증명)을 가지고 있어야 합니다. 이미 다른 Execution layer withdrawal 자격 증명(`0x01` 자격 증명)으로 마이그레이션한 validator에서는 변환을 수행할 수 **없습니다**.
1. (선택 사항) Smartnode가 withdrawal 자격 증명을 자동으로 마이그레이션하도록 하려면 **니모닉 구문을 준비**해야 합니다.

이러한 조건 중 어느 것도 차단 요소가 아니라면 validator 변환을 시작할 자격이 있습니다.

## 프로세스 개요

첫 번째 단계는 **새로운 "비어 있는" minipool 생성**입니다.
생성 중에 새 validator를 만드는 기존 minipool과 달리, 비어 있는 minipool은 _기존_ validator를 관리하도록 설계된 특수 minipool입니다.
결과적으로 비어 있는 minipool은 `prelaunch` 단계에서 기존 minipool과 약간 다르게 작동합니다.
초기화가 완료되고 `staking` 단계에 들어가면 기존 minipool이 됩니다.

비어 있는 minipool 생성 중에 Smartnode가 자동으로 **validator의 withdrawal 자격 증명을 변경**하도록 선택할 수 있습니다(이전 BLS withdrawal key에서 새 비어 있는 minipool 주소로).
지금 이 작업을 수행하지 않으려면 나중에 전용 명령으로 Smartnode가 수행하도록 하거나 타사 도구를 사용하여 직접 수행할 수 있습니다.
minipool 주소로 validator의 withdrawal 자격 증명을 변경하는 것은 변환에 **필수**이므로 어떤 방식으로 하든 프로세스를 성공적으로 완료하려면 이 작업을 수행해야 합니다.

withdrawal 자격 증명이 변경되면 **validator의 개인 키를 가져올** 수 있는 옵션이 제공됩니다. Smartnode가 관리하는 Validator Client로 가져옵니다.
Smartnode가 validator를 유지 관리하여 직접 관리할 필요가 없도록 하려면 이것이 매력적인 옵션입니다.
자체 Validator Client를 유지 관리하고 거기에 키를 보관하려면 그렇게 할 수 있습니다.

이 시점에서 새 minipool은 **scrub check** 기간에 들어갑니다. 여기서 Oracle DAO는 Beacon Chain에서 validator의 정보를 지속적으로 분석하여 합법적인지 확인합니다.
여기에는 다음이 포함됩니다:

- withdrawal 자격 증명이 아직 마이그레이션되지 않았거나(여전히 원래 `0x00` BLS key 자격 증명) minipool 주소로 마이그레이션되었습니다. 다른 Execution layer 주소로 마이그레이션하면 pool이 스크럽됩니다.
  - scrub check 기간이 끝날 때까지 withdrawal 자격 증명이 여전히 원래 `0x00` BLS key 자격 증명인 경우 pool이 스크럽됩니다.
- validator는 검사 기간 동안 활발하게 스테이킹 상태에 있습니다. 슬래시, 종료 또는 인출 상태로 전환되면 pool이 스크럽됩니다.

::: tip 참고
**스크럽된** 비어 있는 minipool은 Rocket Pool 네트워크의 일부가 아니지만 CLI의 일반적인 토큰 검색 방법을 통해 (node operator인) 귀하가 모든 자금에 액세스할 수 있습니다.
비어 있는 minipool이 스크럽되어도 자금이 **손실되지 않습니다**.
스크럽된 minipool, 그 파급 효과 및 사용 방법에 대한 자세한 내용은 이 가이드의 뒷부분에 포함되어 있습니다.
:::

scrub check를 통과하면 비어 있는 minipool을 **프로모션**할 수 있습니다.
이렇게 하면 변환이 완료되고 비어 있는 minipool에서 일반 minipool로 변경됩니다.
이 시점에서 minipool은 네트워크의 다른 모든 minipool처럼 작동하며 solo validator가 공식적으로 Rocket Pool validator로 변환됩니다!

프로세스의 일부로 네트워크는 Beacon chain의 총 보상(및 scrub check 중에 스키밍되는 경우 새 minipool 내)을 스냅샷합니다.
모든 보상이 귀하에게 속하며 staking pool과 공유해서는 안 된다는 것을 인식하므로 프로모션이 완료되면 언제든지 청구할 수 있는 **환불**로 모두 제공합니다.

다음은 각 단계에 대한 지침을 포함하여 변환 프로세스에 대한 자세한 안내입니다.

## 1단계: 비어 있는 Minipool 생성

변환 프로세스를 시작하려면 Smartnode CLI를 사용하여 다음 명령을 실행합니다:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

예를 들어 pubkey가 `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`인 solo validator를 변환하려면 다음을 실행합니다:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

프로세스 중에 예상되는 사항에 대한 간단한 요약이 표시된 다음 이 minipool을 생성할 때 사용할 본드 금액을 묻는 메시지가 표시됩니다:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

**8 ETH**를 선택하면 validator를 8-ETH 본드 minipool로 변환합니다.
원래 32 ETH 예금은 8 ETH 예금으로 변환되며 pool staker로부터 24 ETH를 빌립니다.
변환 프로세스가 완료되면 더 많은 minipool을 생성하는 데 사용할 수 있는 [**24 ETH의 credit 잔액**](./credit)을 갖게 됩니다.

옵션을 선택하면 Smartnode는 몇 가지 검사를 실행하여 입력한 validator와 node가 모두 위에 나열된 전제 조건 요구 사항을 통과하는지 확인합니다.
그런 다음 가스 가격을 확인한 다음 새 비어 있는 minipool을 생성하는 트랜잭션을 제출하도록 요청합니다.
생성 시 minipool의 주소가 표시됩니다:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

이것은 validator의 withdrawal 자격 증명을 변경할 때 사용할 주소입니다.

이 시점에서 Smartnode는 Smartnode가 이를 자동으로 수행할지 여부를 묻습니다(나중에 논의되는 Smartnode가 관리하는 Validator Client로 validator의 개인 키 가져오기와 함께):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

이 질문에 `y`로 대답하면 Smartnode가 2단계와 3단계를 자동으로 수행합니다. 아래의 [자동 Withdrawal 자격 증명 변경 및 키 가져오기](#automatic-withdrawal-credential-change-and-key-import) 섹션을 참조하십시오.

이 질문에 `n`으로 대답하면 명령이 종료되고 1단계를 완료한 것입니다.
다음으로 [2단계](#step-2-changing-the-validators-withdrawal-credentials) 섹션으로 이동하십시오.

::: tip 참고
지금 이 프로세스를 거부하면 나중에 CLI를 사용하여 다시 시작할 수 있습니다.
이를 수행하는 방법을 알아보려면 아래의 [**2단계**](#step-2-changing-the-validators-withdrawal-credentials) 및 [**3단계**](#optional-step-3-import-the-validator-key) 섹션을 읽으십시오.
:::

### 자동 Withdrawal 자격 증명 변경 및 키 가져오기

::: danger 경고
Smartnode가 withdrawal 자격 증명을 자동으로 변경하고 validator의 개인 키를 가져오도록 선택하는 경우 직접 관리하는 이전 Validator Client에서 validator key를 제거하고 **이전 Validator Client를 종료**하여 메모리에 키가 여전히 로드되지 않도록 하는 것이 **필수적**입니다.

또한 **의도적으로 최소 2개의 attestation을 놓쳤는지** 확인하기 위해 그렇게 한 후 **최소 15분** 동안 기다려야 합니다.
[https://beaconcha.in](https://beaconcha.in)과 같은 체인 탐색기를 보고 이를 확인할 수 있습니다.

최소 15분 동안 기다리지 않으면 Smartnode의 Validator Client가 validator의 키로 attestation하기 시작할 때 validator가 **슬래시됩니다**!

슬래싱 위험으로부터 가능한 한 안전하게 보호하기 위해 Smartnode 구성에서 **doppelganger detection**을 활성화하는 것이 좋습니다.
:::

validator key를 자동으로 가져오고 withdrawal 자격 증명을 minipool 주소로 변경하도록 선택하면 Smartnode는 먼저 validator의 BLS 개인 키와 해당 원래 withdrawal key를 생성하는 데 사용된 니모닉을 요청합니다:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

입력하면 Smartnode는 니모닉과 validator의 pubkey를 사용하여 이전 BLS 기반 withdrawal key를 파생합니다.
그런 다음 withdrawal key로 서명된 메시지를 Beacon Chain에 제출하여 withdrawal 자격 증명을 이전 BLS withdrawal key에서 새 minipool 주소로 변경하려고 함을 나타냅니다:

```
Changing withdrawal credentials to the minipool address... done!
```

마지막으로 validator의 키를 Smartnode의 Validator Client로 가져오고 해당 키로 검증을 시작하도록 지금 다시 시작할지 묻습니다:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

이것으로 2단계와 3단계가 완료되었습니다.
[https://beaconcha.in](https://beaconcha.in)과 같은 체인 탐색기를 사용하여 withdrawal 자격 증명이 올바르게 변경되었고 키가 활발하게 검증되고 있는지 확인할 수 있습니다.

scrub check에 대해 알아보려면 [4단계](#step-4-waiting-for-the-scrub-check) 섹션으로 이동하십시오.

## 2단계: Validator의 Withdrawal 자격 증명 변경

새 비어 있는 minipool을 생성한 후 다음 단계는 validator의 withdrawal 자격 증명을 이전 `0x00` BLS-key 자격 증명에서 새 minipool 주소를 포함하는 새 `0x01` 자격 증명으로 변경하는 것입니다.

이를 수행하는 두 가지 방법이 있습니다:

1. Smartnode CLI를 사용하여 `rocketpool minipool set-withdrawal-creds` 명령을 통해.
1. [ethdo](https://github.com/wealdtech/ethdo)와 같은 외부 타사 도구를 사용하여.

이 가이드에서는 방법 1(Smartnode)을 사용하는 방법을 안내합니다.
방법 2에 대한 자세한 내용은 사용하려는 도구의 문서를 참조하십시오.

다음 명령을 실행하여 시작합니다:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

예를 들어 새 비어 있는 minipool 주소가 `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`인 경우 다음을 실행합니다:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

그러면 Smartnode는 validator의 키와 해당 withdrawal key를 생성하는 데 사용된 니모닉을 요청합니다:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

그런 다음 validator의 withdrawal 자격 증명을 변경할 수 있는지 확인하기 위해 몇 가지 안전 검사를 수행합니다.
성공하면 withdrawal key로 서명된 메시지를 Beacon Chain에 제출하여 withdrawal 자격 증명을 이전 BLS withdrawal key에서 새 minipool 주소로 변경하려고 함을 나타냅니다:

```
Changing withdrawal credentials to the minipool address... done!
```

끝났습니다!
[https://beaconcha.in](https://beaconcha.in)과 같은 체인 탐색기를 사용하여 withdrawal 자격 증명이 올바르게 변경되었는지 확인할 수 있습니다.

## (선택 사항) 3단계: Validator Key 가져오기

validator를 minipool로 변환한 후에는 현재 직접 관리하는 대신 Smartnode의 Validator Client가 실행하도록 할 수 있습니다.
여기에는 몇 가지 장점이 있습니다:

- 조직적 관점에서 "깔끔합니다"(Smartnode는 minipool을 관리하고 외부에서 관리하는 Validator Client는 solo staking validator를 관리합니다).
- `rocketpool minipool exit`와 같은 명령(메시지 서명을 위해 validator key가 필요한 명령)이 작동합니다.

그러나 이를 수행하기 전에 이해해야 할 **매우 중요한 고려 사항**이 있습니다:

- 자체 Validator Client에서 validator의 키가 제거되었는지 **확인해야** 하며, Smartnode로 가져오기 전에 제거한 후 최소 15분 동안 기다려야 합니다. 아래의 경고 상자를 참조하십시오.
- Smartnode wallet의 니모닉에서 파생되지 않았기 때문에 `rocketpool wallet recover` 및 `rocketpool wallet rebuild`와 같은 명령이 백업 없이 재생성할 수 **없으므로** validator keystore _및 비밀번호 파일_을 백업했는지 **확인해야** 합니다.

validator key를 Smartnode로 가져오려면 아래를 계속 읽으십시오.

::: danger 경고
Smartnode가 validator의 개인 키를 가져오도록 선택하는 경우 직접 관리하는 이전 Validator Client에서 validator key를 제거하고 **이전 Validator Client를 종료**하여 메모리에 키가 여전히 로드되지 않도록 하는 것이 **필수적**입니다.

또한 **의도적으로 최소 2개의 attestation을 놓쳤는지** 확인하기 위해 그렇게 한 후 **최소 15분** 동안 기다려야 합니다.
[https://beaconcha.in](https://beaconcha.in)과 같은 체인 탐색기를 보고 이를 확인할 수 있습니다.

최소 15분 동안 기다리지 않으면 Smartnode의 Validator Client가 validator의 키로 attestation하기 시작할 때 validator가 **슬래시됩니다**!

슬래싱 위험으로부터 가능한 한 안전하게 보호하기 위해 Smartnode 구성에서 **doppelganger detection**을 활성화하는 것이 좋습니다.
:::

다음 명령을 실행하여 시작합니다:

```
rocketpool minipool import-key <minipool address>
```

예를 들어 새 비어 있는 minipool 주소가 `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`인 경우 다음을 실행합니다:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

그러면 Smartnode는 validator의 키를 생성하는 데 사용된 니모닉을 요청합니다:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

그런 다음 해당 니모닉에서 생성된 다양한 키를 순환하여 validator의 공개 키를 찾을 때까지 반복합니다.
그런 다음 가져오고 Smartnode의 Validator Client를 다시 시작하여 키를 로드할지 묻습니다:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

이것으로 validator key가 이제 Smartnode로 가져와졌으며 attestation하기 시작하는 것을 볼 수 있습니다.
다음 명령으로 Validator Client의 로그를 따라 확인할 수 있습니다:

```
rocketpool service logs validator
```

또한 [https://beaconcha.in](https://beaconcha.in)과 같은 체인 탐색기가 Validator Client가 validator의 키로 attestation하는 것을 볼 수 있는지 확인할 수도 있습니다.

## 4단계: 올바른 Fee Recipient 할당

마이그레이션 프로세스를 시작한 후에는 [fee recipient](./fee-distrib-sp#fee-recipients)가 올바르게 설정되어 있는지 확인하는 것이 **필수적**입니다(node의 [fee distributor](./fee-distrib-sp#your-fee-distributor) 또는 옵트인한 경우 [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool)로).
이를 수행하지 않고 solo validator용 fee recipient에 그대로 두면 페널티를 받고 손실을 보상하기 위해 Beacon Chain 스테이크의 일부가 공제됩니다.

::: tip 참고
**이 단계는 validator key를 자체 외부에서 관리하는 Validator Client에 그대로 두는 경우에만 필요합니다.**

자체 VC에서 제거하고 Rocket Pool에서 관리하는 VC로 가져오면 `node` 프로세스에서 자동으로 fee recipient가 올바른 주소로 할당됩니다.
:::

fee distributor 또는 Smoothing Pool로 설정하지 _않으려는_ 다른 solo-staking key를 VC에 보유할 수 있으므로 이를 수행하는 유일한 방법은 VC 구성 파일을 사용하여 마이그레이션되는 validator의 fee recipient를 수동으로 설정하는 것입니다.

이 프로세스는 사용하는 Consensus Client에 따라 다릅니다. 자세한 내용은 문서를 참조하되 다음은 몇 가지 유용한 링크입니다:

[Lighthouse: `validator_definitions.yml`을 통해](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar**는 현재 validator별 fee recipient 설정을 지원하지 않습니다. 마이그레이션되지 않는 다른 solo key가 있는 외부에서 관리하는 VC에 키를 보관하는 경우 Lodestar를 사용하지 마십시오.

[Nimbus: keymanager API를 통해](https://nimbus.guide/keymanager-api.html)

[Prysm: `proposer-settings-file`을 통해](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: `validators-proposer-config`를 통해](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

eth-docker를 사용하는 경우 문서에 설명된 대로 [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) 명령을 사용하여 사용 중인 각 키에 대한 개별 recipient를 설정할 수 있습니다.

## 5단계: Scrub Check 대기

이 시점에서 1단계와 2단계(비어 있는 minipool 생성 및 validator의 withdrawal 자격 증명 변경)와 선택적으로 3단계(Smartnode로 키 가져오기)를 완료했어야 합니다.
다음 단계는 **scrub check**가 완료될 때까지 기다리는 것입니다.
이것은 Oracle DAO가 다음을 확인하기 위해 수행하는 프로세스입니다:

1. Beacon Chain의 validator 잔액(및 Execution layer의 minipool 잔액)은 비어 있는 minipool을 처음 생성했을 때 validator가 가진 잔액에 **최소** 0.01 ETH의 작은 버퍼를 뺀 값 이상이어야 합니다. 유지 관리 중에 실수로 놓친 attestation을 설명합니다.

- 예를 들어 1단계를 수행했을 때 validator에 35 ETH의 Beacon Chain 잔액이 있었다면 scrub check 전체 기간 동안 Beacon Chain과 minipool 잔액을 합한 값이 **최소** 34.99 ETH여야 합니다.

2. validator는 전체 scrub check 동안 **활발하게 스테이킹** 상태를 유지해야 합니다. 슬래시, 종료 또는 인출될 수 없습니다.
3. validator의 withdrawal 자격 증명은 **원래 BLS 기반 withdrawal key 자격 증명** 또는 **minipool 주소를 사용하는 새 0x01 자격 증명**이어야 합니다. 다른 자격 증명은 minipool이 스크럽되도록 합니다.

- withdrawal 자격 증명 변경을 수행하는 데 **약 2일 반**의 유예 기간이 주어집니다(scrub 기간의 3일 기간의 85%).

scrub check는 일시적입니다. 이 시간 동안 validator를 온라인 상태로 유지하고 잘 수행하는 것 외에는 아무것도 할 필요가 없습니다.

scrub check에 남은 시간을 모니터링하려면 다음 명령으로 `node` 로그를 볼 수 있습니다:

```
rocketpool service logs node
```

관련 줄은 다음과 같습니다:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

**3일** 동안 지속되며 통과한 후 [6단계](#step-6-promoting-the-minipool)로 진행하여 비어 있는 minipool을 전체 minipool로 프로모션할 수 있습니다.

### 스크럽된 Minipool 작업

불행히도 minipool이 scrub check에 실패하고 해제되더라도 걱정하지 마십시오. 자본이 손실되지 않습니다.
해제된 비어 있는 minipool은 기본적으로 단순화된 withdrawal 주소 역할을 합니다:

- 기술적으로 Rocket Pool 네트워크의 일부가 아닙니다.
- minipool에 예치된 자본은 _전적으로_ node operator에게 속합니다. pool staker와 분할되지 _않습니다_.
- minipool을 생성한 것에 대한 예금 credit이 수여되지 않습니다.

다음 명령으로 언제든지 minipool의 잔액에 액세스할 수 있습니다:

```shell
rocketpool minipool distribute-balance
```

이렇게 하면 minipool의 전체 잔액이 node의 withdrawal 주소로 전송됩니다.

Beacon Chain에서 validator를 종료하고 전체 잔액이 minipool로 전송되면 다음 명령으로 검색하고 minipool을 닫을 수 있습니다:

```shell
rocketpool minipool close
```

다시 한 번 이렇게 하면 minipool의 전체 잔액이 node의 withdrawal 주소로 전송됩니다.

## 6단계: Minipool 프로모션

scrub check가 성공적으로 통과되면 비어 있는 minipool을 전체 minipool로 프로모션할 수 있습니다.
이것은 두 가지 방법으로 수행할 수 있습니다:

1. scrub check가 끝나는 즉시 `node` 프로세스가 자동으로 처리하도록 합니다.
1. CLI를 사용하여 수동으로 수행합니다.

첫 번째 방법은 `node` 프로세스/컨테이너가 실행 중이고 네트워크의 가스 비용이 Smartnode 구성 프로세스에서 지정한 자동화된 트랜잭션 임계값(기본값 150) 미만인 경우 minipool을 자동으로 프로모션합니다.
`node` 로그에서 다음과 같은 출력을 볼 수 있습니다:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

`node` 프로세스가 비활성화된 경우 다음 명령을 통해 두 번째 방법을 사용할 수 있습니다:

```shell
rocketpool minipool promote
```

여기에서 프로모션 대상 minipool 목록에서 비어 있는 minipool을 선택하고 트랜잭션을 제출하기만 하면 됩니다.

## 원래 변환 전 보상 청구

프로모션 시 minipool은 `staking` 상태가 되고 공식적으로 일반 Rocket Pool minipool이 되었습니다.
이 명령으로 세부 정보를 검토할 수 있습니다:

```shell
rocketpool minipool status
```

이렇게 하면 새 minipool의 상태, 잔액, 환불 등이 표시됩니다.
예를 들어:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

여기서 다음과 같은 중요한 정보를 볼 수 있습니다:

- `Node deposit`은 이 minipool의 일부로 개인적으로 본드한 ETH의 양을 보여줍니다(이 경우 8 ETH).
- `RP deposit`은 minipool을 생성하기 위해 pool staker로부터 빌린 ETH의 양을 보여줍니다(이 경우 24 ETH).
- `Available refund`는 minipool의 잔액 중 귀하에게 직접 가는 양을 보여줍니다(pool staker와 공유되지 _않습니다_). 이것은 비어 있는 minipool을 생성할 때 Beacon Chain의 모든 보상에 해당합니다.
- `Minipool Balance (EL)`은 minipool 컨트랙트의 총 잔액을 보여줍니다.
- `Your portion (EL)`은 minipool의 잔액에서 환불을 뺀 후 귀하에게 속하는 잔액의 양을 보여줍니다. 즉, 비어 있는 minipool을 생성한 _후_ 얻은 보상의 몫입니다.
- `Total EL rewards`는 귀하의 환불과 변환 후 보상입니다.

환불을 청구하려면 다음 명령을 실행합니다:

```shell
rocketpool minipool refund
```

목록에서 minipool을 선택하고 트랜잭션을 승인하기만 하면 환불이 node의 withdrawal 주소로 전송됩니다.

## Node Credit 사용

이제 활성 프로모션된 minipool이 있으므로 `rocketpool node status`를 실행하면 node에 credit 잔액이 있음을 알 수 있습니다:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

이 예에서는 원래 32 ETH validator 본드를 8-ETH minipool로 변환했으므로 [**24 ETH의 credit**](./credit)를 받았습니다.
이 credit을 사용하여 새로운 minipool과 validator를 무료로 생성할 수 있습니다!

`rocketpool node deposit` 명령을 실행하고 사용할 본드 금액을 선택하기만 하면 됩니다.
본드를 충당할 수 있는 충분한 ETH가 credit 잔액에 있는 경우 자동으로 사용되며 추가 ETH를 스테이킹할 필요가 없습니다(가스는 여전히 지불해야 함).

::: warning 참고
credit 잔액에 사용된 ETH는 staking pool에서 나옵니다.
staking pool에 credit 잔액을 충당할 수 있는 충분한 ETH가 없으면 더 많은 ETH가 예치될 때까지 사용할 수 없습니다.
:::
