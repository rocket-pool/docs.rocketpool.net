# 스키밍된 보상 분배

Ethereum을 위한 validator를 운영하여 받는 ETH 보상은 "스키밍"이라고 하는 프로세스를 통해 정기적으로 minipool에 전송됩니다.
스키밍 빈도는 Beacon Chain의 활성 validator 수에 따라 달라집니다. 작성 당시 validator 수는 약
500,000개이며 이로 인해 약 2~3일마다 스키밍이 발생합니다.

스키밍된 보상은 "분배"할 때까지 각 minipool에 누적됩니다. 이 프로세스는 스키밍된 보상을 node operator인 귀하와 rETH 보유자 간에
수수료율 및 제공된 ETH와 공급된 ETH의 비율에 따라 분배합니다.

::: warning 참고
minipool의 잔액에 액세스하려면 먼저 [Atlas delegate](./minipools/delegates)로 업그레이드해야 합니다.
이전 Redstone delegate는 minipool의 잔액을 분배하는 데 사용할 수 없습니다.
:::

## 자동 분배

기본적으로 Smartnode는 개별 잔액이 **1 ETH**에 도달하면 minipool을 자동으로 분배하도록 구성되어 있습니다. 이
임계값은 아래 단계에 따라 TUI에서 구성할 수 있습니다.

다음을 실행합니다:

```shell
rocketpool service config
```

아래와 같이 `Smartnode and TX Fee Settings > Auto Distribute Threshold` 설정으로 이동합니다.

![](./images/tui-automatic-skimming.png)

이 설정을 변경하면 Smartnode가 minipool을 자동으로 분배하는 임계값이 조정됩니다.
매개변수를 0으로 설정하면 자동 분배가 비활성화됩니다.

::: warning 경고
자동 분배를 비활성화하기로 결정한 경우에도 정기적으로
수동 분배를 수행하는 것이 중요합니다. 수동 분배를 수행하는 방법에 대해서는 다음의 [수동 분배 섹션](#manual-distribution)을 참조하십시오.

장기간이 지나면 스키밍된 보상이 8 ETH를 초과할 수 있습니다. 이러한 상황이 발생하면 더 이상
분배할 수 없으며 누적된 보상에 액세스하려면 validator를 종료해야 합니다.

Rocket Pool은 장기간의 대기 기간 후 누구나 잔액이 8 ETH를 초과할 때 minipool을 분배할 수 있는
안전 장치 설계를 제공합니다. 자본을 보호하기 위해 Smartnode는 이러한 상황을 모니터링하고 발생할 경우
자동으로 minipool을 종료합니다.
:::

## 수동 분배

스키밍된 보상의 자동 분배를 비활성화한 경우 다음 프로세스를 통해
정기적으로 직접 분배해야 합니다.

위의 자동 프로세스를 기다리지 않고 언제든지 이 프로세스를 사용하여 보상을 수동으로 분배할 수도 있습니다.

minipool에 8 ETH 미만이 있는 경우 다음 명령을 사용하여 보상을 분배할 수 있습니다:

```shell
rocketpool minipool distribute-balance
```

이렇게 하면 분배 대상인 minipool, 보유한 ETH 양, 귀하(node operator)가 받을 ETH 양이 표시됩니다:

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

원래 출시 delegate를 사용하는 minipool은 시작 부분에 언급되며 delegate를 업그레이드할 때까지 `distribute-balance`를 호출할 수 없음을 알려줍니다.
이 delegate는 스키밍된 인출이 지정되기 전에 작성되었으므로 스키밍된 보상을 분배하는 방법이 없습니다.

적격 minipool의 경우 **환불 금액**도 표시됩니다.
이는 귀하에게 직접 지불되는 금액입니다(예: [16-ETH 본드에서 8-ETH 본드로 마이그레이션](./leb-migration.mdx)하기 전에 minipool에 잔액이 있었거나 [solo validator를 기존 보상이 있는 minipool로 변환](./solo-staker-migration)한 경우).
rETH 보유자와 공유되지 않습니다.

분배하려는 minipool의 번호를 입력합니다.
평소처럼 가스 가격 차트가 표시되고 결정을 확인하라는 메시지가 표시됩니다.
확인하면 minipool의 잔액이 분배됩니다:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

[트랜잭션](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9)에서 볼 수 있듯이 이것은 node의 withdrawal 주소에 보상의 node 몫(및 환불 금액)을 제공하고 나머지를 staking pool에 반환했습니다.
