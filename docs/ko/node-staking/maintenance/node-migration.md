# 한 노드에서 다른 노드로 이동하기

때때로 노드 머신이 더 이상 작업을 수행할 수 없어 다른 머신으로 이동해야 하는 경우가 있습니다.
이는 노드를 업그레이드하거나, 클라우드 기반 노드에서 전용 하드웨어에서 로컬로 호스팅되는 노드로 이동하거나, 노드 자체에 치명적인 하드웨어 장애가 발생하여 백업 머신에서 validator를 실행해야 하는 경우에 발생할 수 있습니다.
경우와 관계없이 이 가이드는 슬래싱되지 않고 한 노드에서 다른 노드로 지갑과 validator 키를 안전하게 마이그레이션하는 방법을 이해하는 데 도움이 됩니다.

## 슬래싱과 슬래싱 데이터베이스

한 머신에서 다른 머신으로 지갑을 이동하거나 다른 머신에서 지갑을 복구할 때 매우 주의하도록 권장하는 주된 이유는 **슬래싱**의 위험 때문입니다.
슬래싱은 하나 이상의 validator 키가 Beacon Chain의 규칙을 위반하고 네트워크를 공격하려는 것처럼 보이는 행위를 할 때 발생합니다.
이에 대응하여 체인은 validator를 강제로 종료하고 심각한 페널티를 부과합니다. 페널티의 크기는 자신의 슬래싱 후 2주 이내에 슬래싱된 다른 validator의 수에 따라 다르지만, 현재 최소 **1 ETH**이며 최대값은 없습니다.

"네트워크 공격"으로 해석될 수 있는 여러 조건이 있지만, 실제로 우연히 발생하는 유일한 것은 **이중 증명**(또는 **이중 제안**)입니다.
이는 validator가 다른 투표를 가진 동일한 슬롯에 대해 두 개의 증명(또는 두 개의 블록 제안)을 제출할 때 발생합니다(예: 특정 슬롯에 대해 하나를 선택하는 대신 두 개의 다른 후보 블록에 투표).

이에 대응하기 위해 Validator 클라이언트는 **슬래싱 데이터베이스**라는 것을 호스팅합니다.
슬래싱 데이터베이스는 단순히 validator의 투표 기록(즉, 각 투표의 슬롯과 해당 투표가 대상으로 한 블록의 해시)이므로 이미 투표한 것에 대해 다시 투표하지 않도록 합니다.

### 슬래싱 방지

모든 Validator 클라이언트는 노드가 절대 이중 증명하거나 이중 제안하지 않도록 슬래싱 데이터베이스를 유지합니다.
문제는 슬래싱 데이터베이스 **없이** 검증을 시작하여 validator가 이전에 투표한 내용에 대한 기록이 없는 상황에서 발생합니다.
이는 여러 상황에서 발생할 수 있습니다.

1. Consensus 클라이언트를 변경했고, 새 클라이언트가 이전 클라이언트에서 슬래싱 데이터베이스를 가져오지 않는 경우(Smartnode는 클라이언트 변경 중에 이를 수행하지 않습니다).
2. 한 머신에 지갑이 로드되어 있고 활발히 증명하고 있는 상태에서, _첫 번째 머신이 여전히 활발히 증명하는 동안_ 두 번째 머신에 지갑을 로드하는 경우.
3. 한 머신에서 검증을 중지하고 두 번째 머신에 지갑을 로드했지만, 현재 에포크가 최종화될 때까지 충분히 기다리지 않아 두 번째 머신이 validator가 이미 증명한 슬롯에 대해 증명하는 경우.

슬래싱을 방지하는 표준 방법은 **마지막으로 성공한 증명 후 최소 15분을 기다린 후** Validator 클라이언트를 시작하고 다시 증명하며, **validator 키가 단일 머신에만 존재하도록 하는 것**입니다.

보다 구체적으로, 계획은 validator가 의도적으로 증명을 놓칠 때까지 기다린 다음, **그 놓친 증명이 최종화될 때까지** 기다리는 것입니다.
최종성이 달성되면 validator는 더 이상 최종화된 에포크에 투표할 수 없으며 다시 증명을 시작하는 것이 안전합니다.

15분 대기는 정상적으로 작동할 때(예: 정상적인 합의가 있을 때) Beacon Chain이 에포크를 최종화하는 데 약 7분이 걸린다는 경험 법칙에서 비롯됩니다.
15분을 기다리면 최소 하나의 에포크를 놓치고, 해당 에포크가 최종화될 때까지 충분히 기다렸으며, 안전을 위한 작은 버퍼가 있음을 보장합니다.

## 노드 마이그레이션 체크리스트

위의 맥락을 염두에 두고, 노드를 마이그레이션할 때 슬래싱되지 않도록 따를 수 있는 유용한 체크리스트가 있습니다.
이는 최대 안전성을 위해 설계되었으므로 일부 단계가 불필요하다고 생각할 수 있지만, 모든 단계를 완료하도록 **강력히** 권장합니다.

1. "노드 준비" 섹션부터 시작하여 Smartnode가 설치되고 Execution 및 Consensus 클라이언트가 동기화될 때까지 이 가이드를 따라 **새 노드를 준비**합니다.
   - :warning: **절대로** 새 지갑을 초기화하거나 이전 지갑을 노드에서 복구하지 마십시오. 클라이언트가 _지갑 없이_ 동기화되도록 허용하십시오.

2. 새 노드에서 클라이언트가 완전히 동기화될 때까지 **기다립니다**.
3. 새 머신에서 `rocketpool wallet test-recovery`를 실행하여 니모닉을 올바르게 기록했는지 확인합니다. 이것은 노드 지갑과 모든 minipool의 validator 키를 올바르게 복구할 수 있는지 _시뮬레이션_하지만, 실제로 복구하여 디스크에 저장하지는 않으므로 슬래싱 위험이 없습니다.
   1. Smartnode가 제공한 니모닉을 사용하여 노드 지갑을 복구하지 못하면 니모닉이 유효하지 않을 수 있습니다. 이 프로세스를 진행하는 것을 **중지**하십시오. 이전 노드에서 키를 제거하면 키가 **영원히 손실될** 수 있습니다.
   2. 이 상황에서는 validator를 종료하고 가능한 한 빨리 자본을 인출하여 작동하는 니모닉이 있는 새 노드로 다시 시작하는 것을 권장합니다.
4. 이전 노드에서 **검증을 중지**합니다(예: `rocketpool service stop`을 사용하여 validator 클라이언트를 종료).
5. 이전 노드에서 **키를 삭제**합니다(예: `rocketpool wallet purge` 사용).
   1. 노드의 `data` 폴더(기본값은 `~/.rocketpool/data/validators/`)를 확인하여 키가 제거되었는지 **확인**하십시오. 각 Consensus 클라이언트는 해당 데이터 폴더 아래에 자체 키 복사본이 있는 자체 폴더를 갖습니다.
   2. 이를 수행하는 방법에 대한 지침은 아래의 [키 제거 확인](#verifying-key-removal) 섹션을 참조하십시오.
   3. **모든** 키가 삭제되었는지 확인하십시오.

6. 이전 노드의 **전원을 끄고** 이더넷 케이블 또는 Wi-Fi 모듈을 제거하여 인터넷에서 연결을 해제합니다.

7. 다음 방법 중 하나를 사용하여 이전 노드에서 **SSD를 초기화**합니다.
   1. Linux 설치가 포함된 부팅 가능한 USB 드라이브(예: 인기 있는 [GParted](https://gparted.org/download.php))를 사용하여 드라이브를 지웁니다.
   2. 이전 노드에서 **물리적으로 제거**하고, USB 변환기를 사용하여 다른 머신에 연결하고, [GParted](https://installati.one/debian/11/gparted/)와 같은 도구를 사용하여 드라이브를 지웁니다.
   3. 이전 노드에서 **물리적으로 제거**하고 망치로 쳐서 부수고 다시는 사용되지 않도록 합니다.

8. 계속 진행하기 전에 최소 15분 동안 **기다립니다**. [https://beaconcha.in](https://beaconcha.in)과 같은 블록 탐색기를 사용하여 validator의 증명 기록을 확인합니다. 최소 하나의 증명이 누락된 것으로 기록되고 _해당 에포크가 최종화될 때까지_ 기다립니다.
   1. 참고: 여러 minipool이 있는 경우 _모두_ 최소 하나의 최종화된 증명을 놓쳤는지 확인해야 합니다.

9. [기존 지갑 가져오기/복구](../recovering-rp.mdx)의 지침에 따라 새 머신에서 **노드 지갑을 복구**합니다.

10. validator 키가 로드되었는지 확인하기 위해 **Validator 클라이언트를 재시작**합니다(예: `docker restart rocketpool_validator` 사용).

이제 validator 키가 새 노드에 로드되며, 안전하게 증명을 시작할 수 있습니다.

## 키 제거 확인

Validator 키는 `json` 파일 형태로 디스크에 저장됩니다.
노드의 `data` 폴더 안에 보관됩니다.
기본적으로 여기에서 찾을 수 있습니다.

```shell
~/.rocketpool/data/validators/
```

::: warning 참고
`service config` TUI를 사용하여 `data` 디렉토리를 변경한 경우(예: Aegis 키를 사용하고 이를 `data` 폴더로 설정한 경우), 위의 경로를 `<your data folder>/validators`로 변경해야 합니다.
:::

각 클라이언트는 키의 자체 복사본을 가지고 있습니다. 각 클라이언트는 다른 형식이나 구성으로 키를 예상하기 때문입니다.

디스크에서 키를 **찾으려면** 다음 명령을 실행하십시오.

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

예를 들어, 두 개의 minipool이 있는 머신에서 출력은 다음과 같습니다.

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

이는 키가 아직 삭제되지 **않았고** 여전히 파일 시스템에 있는 예를 보여줍니다.

키가 삭제된 **경우**, 해당 명령의 출력에서 모든 클라이언트의 폴더에 있는 16진수 문자열(`0x`로 시작하는 큰 문자열)이 표시되지 _않아야_ 합니다.
