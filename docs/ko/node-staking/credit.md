::: danger 경고
Saturn 1 준비를 위해 Minipool 예치가 현재 비활성화되어 있습니다.
:::

# 예치 크레딧 시스템

예치 크레딧 시스템은 Node Operator가 이전에 본드했지만 더 이상 필요하지 않은 ETH를 추적하고 다시 사용할 수 있도록 하는 메커니즘입니다.
이 크레딧의 출처는 두 곳에서 나옵니다.

- [기존 16-ETH 본드 minipool을 8-ETH 본드 minipool로 마이그레이션](./leb-migration.mdx) (Node Operator의 크레딧 잔액에 8 ETH를 추가합니다)
- [기존 solo validator를 마이그레이션](./solo-staker-migration)하여 minipool로 변환 (마이그레이션 중에 생성하는 minipool 유형에 따라 Node Operator의 크레딧 잔액에 16 또는 24 ETH를 추가합니다)

모든 Node Operator는 **0 ETH**의 크레딧 잔액으로 시작합니다.
이 두 가지 작업 중 하나가 해당 잔액을 그에 따라 증가시킵니다.

이 ETH는 유동화되어 Node Operator에게 반환되지 _않습니다_. 대신 Node Operator로부터 ETH가 필요 없이 **추가 minipool을 생성**하는 데 사용될 수 있습니다.

크레딧 시스템은 Node Operator에게 **투명합니다**. 가능한 경우 `rocketpool node deposit` 또는 `rocketpool node create-vacant-minipool` 작업 중에 자동으로 사용됩니다(사용될 것임을 설명하는 Smartnode CLI의 알림과 함께).
사용할 _수 없는_ 경우 Smartnode는 사용자에게 사용할 수 없음을 알리고 두 작업 중 하나에서 일반 ETH 본드가 필요할 것입니다.

자세한 내용은 아래 [크레딧 가용성](#크레딧-가용성) 섹션을 참조하십시오.

## 예제

크레딧 잔액이 0 ETH이고 16-ETH 본드가 있는 단일 minipool이 있다고 가정해 보겠습니다.
그런 다음 [해당 minipool을 8-ETH 본드로 마이그레이션](./leb-migration.mdx)할 수 있습니다.
이렇게 하면 더 이상 본드되지 않은 **8 ETH**가 생성됩니다.
해당 8 ETH는 **크레딧 잔액**에 배치됩니다.

이제 _두 번째_ 8-ETH minipool을 생성하려고 한다고 가정해 보겠습니다.
평소와 같이 `rocketpool node deposit`를 실행하고 본드 금액으로 8-ETH를 선택합니다.
이것은 일반적으로 minipool을 위해 자신의 8 ETH를 제공해야 합니다.
그러나 8 ETH의 크레딧 잔액이 있기 때문에 Rocket Pool은 **대신 자동으로 이를 사용합니다**.

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

여기서 두 번째 줄 세트가 관련이 있습니다. 이 예치를 커버할 수 있는 충분한 ETH가 크레딧 잔액에 있고 _사용 가능하다는_ 것을 알려주므로 잔액을 자동으로 사용하고 노드 지갑에서 추가 ETH가 필요하지 않습니다.

크레딧 잔액 가용성에 대한 자세한 내용은 [아래 가용성 섹션](#크레딧-가용성)을 참조하십시오.

## 현재 크레딧 잔액 확인하기

현재 크레딧 잔액을 확인하려면 다음 명령을 실행하기만 하면 됩니다.

```shell
rocketpool node status
```

이것은 맨 위의 크레딧 잔액을 포함하여 노드에 대한 세부 정보의 포괄적인 목록을 생성합니다.

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## 크레딧 가용성

일부 상황에서는 노드에 크레딧 잔액이 있을 수 있지만 현재 추가 minipool을 배포하는 데 사용할 수 없습니다.

크레딧 잔액에 대한 ETH는 **deposit pool**에서 가져옵니다.
따라서 8 ETH의 크레딧을 사용하여 새 8-ETH minipool을 생성하려는 경우 해당 minipool의 **전체 32 ETH**를 deposit pool에서 가져오고 귀하로부터는 아무것도 필요하지 않게 됩니다.
이 때문에 deposit pool에 사전 예치 값(현재 1 ETH로 설정)을 커버할 충분한 ETH가 없으면 **잔액을 사용할 수 없습니다**.

이 상황에서 Smartnode는 `rocketpool node deposit` 작업 중에 크레딧 잔액을 사용할 **수 없으며** 본드를 완료하기 위해 노드 지갑의 ETH를 대신 사용해야 한다고 알려줍니다.
이렇게 하면 크레딧 잔액이 소비되지 **않습니다**. 그대로 남아 있으며 나중에 deposit pool에 이를 커버할 충분한 잔액이 있을 때 사용할 수 있습니다.
