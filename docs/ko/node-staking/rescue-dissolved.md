# Dissolved Minipool 복구하기

minipool이 dissolution 기간 내에 stake하지 않는 드문 경우에 oDAO에 의해 "dissolved"되고
제공된 사용자 자금은 다른 minipool에서 사용하기 위해 예치 풀로 반환됩니다. 이 시나리오에서는
ETH를 회수하고 RPL 잠금을 해제하여 unstake할 수 있도록 아래 프로세스를 수행해야 합니다.

## Minipool Delegate 업데이트하기

이 프로세스를 수행할 때 최신 minipool delegate를 사용하는 것이 좋습니다. 이전 delegate에는
닫힐 때 `selfdestruct` 작업이 포함되어 있어 프로세스가 지정된 순서대로 올바르게 완료되지 않으면
자금이 영원히 잠길 수 있습니다. [Delegate 업그레이드](./minipools/delegates#upgrading-your-delegate)를 시도하여
minipool이 최신 delegate에 있는지 확인할 수 있습니다. minipool이 업그레이드할 수 있는 minipool 목록에 나타나지 않으면
아래로 계속 진행할 수 있습니다.

## 사용하지 않은 예치 잔액 회수하기

::: tip 참고
minipool이 Atlas 이전에 dissolved된 경우 이 단계를 건너뛰고 [Beaconchain 잔액을 32 ETH로 늘리기](#increase-your-beaconchain-balance-to-32-eth)로 바로 이동할 수 있습니다.
Atlas 이전에는 전체 본드 금액이 beaconchain에 예치되었기 때문에 사용하지 않은 예치 잔액을 회수할 필요가 없습니다.
:::

초기 본드 예치에서 1 ETH는 validator의 출금 자격 증명을 보호하기 위해 beaconchain에 초기 예치로 사용됩니다.
나머지 금액은 예치 풀에서 ETH가 할당될 때 minipool에 예치됩니다.

minipool이 dissolved되면 사용자 ETH는 예치 풀로 반환되고 ETH는 귀하에게 반환될 준비가 된 minipool에 남아 있습니다.
[수동 분배](./skimming#manual-distribution) 보상 기능을 사용하여 이 ETH를 회수한 다음 다음 단계에서 validator를 활성화하는 데 사용할 수 있습니다.

## Beaconchain 잔액을 32 ETH로 늘리기

beaconchain에서 활성화하는 데 필요한 최소값까지 validator의 잔액을 늘려야 합니다. 이 금액은 **32 ETH**입니다.
16 ETH 본드 minipool이 있는 경우 추가로 16 ETH가 필요하고 8 ETH 본드 minipool이 있는 경우 이 단계에서 추가로 24 ETH가 필요합니다.

필요한 양의 ETH를 노드 주소에 예치한 다음 다음 명령을 실행하여 프로세스를 시작합니다:

```shell
rocketpool minipool rescue-dissolved
```

수동 예치 기준을 충족하는 minipool 목록이 표시됩니다:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

복구하려는 minipool을 선택한 후 수동으로 예치할 금액을 묻는 메시지가 표시됩니다:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

대부분의 경우 옵션 1이 사용됩니다. 이는 beaconchain 잔액을 필요한 32 ETH로 늘리는 데 필요한 금액입니다.
다른 옵션은 고급 사용 사례를 위해 제공됩니다.

::: tip 참고
beaconchain 잔액을 32 ETH로 늘리면 validator가 Ethereum 검증 임무에 적극적으로 참여할 수 있습니다.
smartnode는 dissolution 이후 validator를 다시 시작할 기회가 없었을 수 있습니다. 따라서
validator를 수동으로 다시 시작하여 validator 키를 로드하고 복구 프로세스 중에 페널티를 피하기 위해
검증 임무를 수행할 수 있도록 하는 것이 좋습니다.

표준 Docker mode를 실행하는 경우 `docker restart rocketpool_validator`로 수행할 수 있습니다.
:::

이 단계가 완료되면 validator가 진입 대기열에 들어가고 다음 이벤트가 발생할 때까지 기다려야 합니다:

1. 예치가 승인되려면 2048개의 execution layer 블록이 통과해야 합니다(~8시간)
2. validator가 투표하려면 최대 32 epoch이 통과해야 합니다(0.5 - 3.5시간)
3. validator 대기열에서 가변적인 시간(대기열의 4개 validator당 6.4분)
4. 출구가 허용되기 전에 최소 256 epoch 검증(27시간)

### Validator 종료하기

validator가 최소 256 epoch 동안 활성화되면 [Validator 종료](./withdraw#exiting-your-validator) 가이드를 따라
다른 minipool과 동일한 프로세스를 통해 minipool을 종료할 수 있습니다.

전체 32 ETH 잔액이 minipool로 반환되고 dissolved된 minipool은 잔액의 100%를 node operator의 출금 주소에 분배합니다.
