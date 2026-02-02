# 8-ETH 본드 미니풀

Rocket Pool이 처음 출시되었을 때 두 가지 유형의 미니풀을 지원했습니다:

1. **16-ETH 본드**: 노드 운영자가 16 ETH를 제공하고 나머지 16 ETH는 스테이킹 풀에서 가져와 완전한(32 ETH) 검증자를 만듭니다.
2. **32-ETH 임시 본드**: 노드 운영자가 32 ETH를 모두 제공하여 초기화 프로세스를 건너뛰고 비콘 체인에서 즉시 검증을 시작한 다음, 예치 풀에 이를 충당할 수 있는 충분한 ETH가 있으면 16 ETH의 환불을 받습니다. 이 시점에서 일반 16-ETH 본드 미니풀로 전환됩니다.

후자는 더 이상 필요하지 않고 긴 환불 지연을 초래하여 프로토콜 출시 몇 개월 후 커뮤니티 투표에 의해 제거되었습니다.

전자는 노드 운영자가 Rocket Pool을 사용하여 이더리움 프로토콜을 공격하고 _전체 본드_가 슬래싱 당했을 때 rETH 스테이커만큼 손실을 입고 이익을 얻지 못하도록 보장했기 때문에 프로토콜의 최저 본드 금액을 나타냈습니다.

Rocket Pool이 출시된 이후 커뮤니티는 이 본드가 제공하는 보안에 대해 [상당한 연구](https://dao.rocketpool.net/t/leb8-discussion-thread/899)를 수행했으며 매우 보수적이라는 것을 발견했습니다.
모든 의도와 목적을 위해 16 ETH의 슬래싱은 비현실적인 것으로 간주되었으며 16-ETH 본드는 8 ETH(추가 RPL 요구 사항 포함)만의 본드와 동일한 보안 이점을 효과적으로 제공합니다.
따라서 이 연구를 바탕으로 Atlas 업그레이드는 목록에 새로운 유형의 미니풀을 도입합니다: Rocket Pool 커뮤니티에서 "LEB8"(Lower ETH Bond - 8 ETH)로 통칭되는 **8-ETH 본드**입니다.

8-ETH 미니풀을 만들려면 노드 운영자는 **자신의 ETH 8개**만 제공하면 됩니다(담보 요구 사항을 충당하기에 충분한 RPL 포함 - [RPL 담보](#rpl-collateral)에서 자세히 설명).
그런 다음 검증자를 완성하고 비콘 체인에서 작업을 시작하기 위해 예치 풀에서 **24 ETH**를 가져옵니다.

이는 노드를 실행하고 싶지만 16 ETH가 충분하지 않은 **새로운 잠재적 노드 운영자에게 문을 엽니다**.
또한 더 큰 노드 운영자가 비콘 체인에서 보상을 얻기 위해 **더 많은 풀 스테이커 ETH를 작업에 투입**할 수 있게 합니다.
이것은 보안을 의미 있게 손상시키지 않고 작동하므로 모두가 승리합니다!

이 가이드에서는 세 가지 주제를 다룹니다:

- 8-ETH 본드 미니풀이 실제로 어떻게 작동하는지, 그리고 그 뒤에 있는 보상 숫자
- 새로운 8-ETH 미니풀을 만드는 방법
- 종료하지 않고 _기존_ 16-ETH 미니풀을 8-ETH 미니풀로 마이그레이션하는 방법

각 주제에 대해 자세히 알아보려면 계속 읽으십시오.

## 8-ETH 본드 미니풀 작동 방식

기계적으로 8-ETH 본드 미니풀은 프로토콜의 다른 모든 미니풀과 **동일하게** 작동합니다.
여전히 비콘 체인에서 검증자를 "소유"하며(해당 검증자의 출금 자격 증명을 나타냄), 여전히 커미션과 함께 제공되며(Atlas에서는 모든 새 미니풀에 대해 **커미션이 14%로 고정**됩니다), 16-ETH 본드 미니풀이 제공하는 모든 동일한 기능을 제공합니다.
차이점은 전적으로 숫자에 있습니다.

### 보상

수익성 관점에서(순수하게 ETH 보상만 보고 RPL은 무시) 14% 커미션의 8-ETH 본드 미니풀은 _20% 커미션의 16-ETH 본드 미니풀_(Redstone 기준으로 가능한 최고 보상 구성)보다도 노드 운영자에게 _더 많은 보상_을 제공합니다.
동시에 노드 운영자가 rETH 보유자의 자본을 더 효율적으로 작업에 투입하기 때문에 _rETH 보유자_에게도 더 많은 보상을 제공합니다.

이를 설명하기 위해 간단한 예를 살펴보겠습니다.
스테이킹에 사용할 수 있는 16 ETH가 있는 노드 운영자라고 가정하겠습니다(필요한 RPL 본드 포함).
검증자당 비콘 체인에서 1 ETH의 보상을 받았다고 가정하겠습니다.
20% 커미션의 단일 16-ETH 미니풀과 14% 커미션의 두 개의 8-ETH 미니풀에 대해 수학이 어떻게 작동하는지는 다음과 같습니다:

```
1x 16 ETH Minipool @ 20%:
Rewards: 1 ETH
Node Share = (16/32) + (16/32 * 0.2)
           = 0.5 + (0.5 * 0.2)
           = 0.5 + 0.1
           = 0.6 ETH

rETH Share = 1 - 0.6
           = 0.4 ETH


2x 8 ETH Minipools @ 14%:
Rewards: 2 ETH
Node Share = ((8/32) + (24/32 * 0.14)) * 2
           = (0.25 + (0.75 * 0.14)) * 2
           = (0.25 + 0.105) * 2
           = 0.71 ETH

rETH Share = 2 - 0.71
           = 1.29 ETH
```

즉, 노드 운영자는 두 개의 8-ETH 미니풀을 통해 20% 커미션의 단일 16-ETH 미니풀보다 **18% 더 많은 ETH**를 얻을 수 있습니다.

### RPL 담보

8-ETH 미니풀을 만들려면 노드 운영자는 여전히 노드(모든 본드 크기의 모든 미니풀을 고려)에 대한 최소 담보 요구 사항을 충당하기에 충분한 RPL을 스테이킹해야 합니다.

이러한 규칙은 Atlas에서 명확해졌습니다:

- 미니풀당 **최소 RPL**은 **_차입_ 금액의 10%**입니다
- 미니풀당 **최대 RPL**은 **_본드_ 금액의 150%**입니다

16-ETH 미니풀의 경우 이는 변경되지 않았습니다. 최소값은 1.6 ETH 상당의 RPL이고 최대값은 24 ETH 상당의 RPL입니다.

8-ETH 미니풀의 경우 **최소 2.4 ETH 상당의 RPL**(차입 금액의 10%, 즉 24 ETH) 및 **최대 12 ETH 상당의 RPL**(본드 금액의 150%)이 됩니다.

이 숫자는 Rocket Pool 커뮤니티가 [거버넌스 투표의 일부로](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671) 선택했습니다.

## 새 8-ETH 미니풀 생성

8-ETH 본드로 새 미니풀을 만드는 프로세스는 16-ETH 미니풀을 만드는 프로세스와 동일합니다.

다음 명령을 실행하기만 하면 됩니다:

```shell
rocketpool node deposit
```

본드 금액을 묻는 메시지가 표시되면 `8 ETH`를 선택하십시오:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip 참고
이 예제는 [**새로운 예치 크레딧 시스템**](../../node-staking/credit)의 사용도 보여줍니다.
노드 운영자가 크레딧으로 8 ETH를 가지고 있으므로 이 8-ETH 미니풀을 만드는 것은 무료입니다!
:::

이것이 전부입니다!
나머지 프로세스는 [일반적인 미니풀 생성 지침](../../node-staking/create-validator.mdx)과 동일합니다.
