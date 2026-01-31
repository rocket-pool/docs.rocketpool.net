::: danger 경고
Saturn 1 준비를 위해 minipool 예치가 현재 비활성화되어 있습니다.
:::

# Minipool Delegate

실행하는 각 validator에는 소유자 역할을 하는 **minipool** 계약이 있습니다.
minipool은 해당 validator에 특별히 할당된 고유한 계약입니다. **출금 주소** 역할을 합니다.
Beacon Chain에서 오는 모든 보상 및 staking 잔액 출금은 minipool 계약으로 전송됩니다.

각 minipool은 귀하(노드 운영자)가 궁극적인 제어권을 가지도록 고유합니다.
다른 누구도 이를 제어할 수 없으며 다른 누구도 변경할 수 없습니다. 전적으로 귀하의 명령에 따릅니다.

즉, 노드 예치 중 가스 비용을 최소화하기 위해 minipool _자체_에는 실제 기능이 거의 포함되어 있지 않습니다.
수행할 수 있는 거의 모든 것이 **delegate** 계약으로 이연됩니다.

minipool delegate 계약은 minipool에 필요한 대부분의 로직을 포함하는 특수 계약입니다. 예를 들어 귀하와 pool staker 간의 잔액을 공정하게 분배하는 것과 같은 것입니다.
각 minipool이 고유한 계약인 minipool과 달리 delegate는 많은 minipool이 요청을 "전달"할 수 있는 단일 계약입니다.

때때로 Rocket Pool 개발 팀은 새로운 기능을 추가하는 새로운 minipool delegate를 게시합니다.
예를 들어 Atlas 업데이트에서 minipool을 닫을 필요 없이 스키밍된 보상을 분배할 수 있는 지원을 제공하는 새로운 delegate를 도입했습니다.

Minipool은 이 새로운 기능을 활용하기 위해 delegate를 업그레이드할 수 있습니다.
Delegate 업그레이드는 **옵트인**이므로 사용할지 여부와 시기를 결정할 수 있습니다.
즉, 일반적으로 네트워크 업그레이드가 도입하는 새로운 기능을 활용하려면 필요합니다.

### Delegate 업그레이드

minipool을 새로운 delegate 계약으로 업그레이드하려면 다음 명령을 실행하십시오:

```shell
rocketpool minipool delegate-upgrade
```

그러면 현재 최신 delegate를 사용하지 않고 업그레이드할 수 있는 minipool 목록이 표시됩니다:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

minipool 주소 왼쪽의 해당 번호를 입력하여 목록에서 업그레이드할 항목을 선택합니다.
선택하면 가스 가격 설정을 확인하라는 메시지가 표시되며, 그 후 minipool을 업그레이드하는 트랜잭션이 전송됩니다:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

`rocketpool minipool status`를 사용하여 최신 delegate를 사용하고 있는지 확인할 수 있습니다.
최신 delegate를 사용하지 _않는_ minipool에는 업그레이드할 수 있음을 알려주는 노란색 알림이 상태 아래에 표시됩니다:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
