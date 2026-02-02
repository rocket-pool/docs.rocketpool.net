# FAQ (WIP)

### Rocket Pool로 minipool을 운영하는 것이 32 ETH 솔로 validator에 비해 어떤 이점이 있습니까?

단일 솔로 validator를 운영하면 32 ETH에 대해 100%의 보상을 받습니다.
16 ETH minipool 두 개를 운영하면 32 ETH에 대해 100%의 보상을 받으며 **추가로** Rocket Pool 프로토콜이 제공하는 32 ETH에 대한 보상의 14%를 받습니다.
8 ETH minipool 네 개를 운영하면 32 ETH에 대해 100%의 보상을 받으며 **추가로** Rocket Pool 프로토콜이 제공하는 96 ETH에 대한 보상의 14%를 받습니다.
또한 Rocket Pool의 [Smoothing Pool](./prepare-node.mdx#smoothing-pool) 기능을 사용할 수 있는 옵션도 있습니다.

### rETH의 가치를 어떻게 알 수 있습니까? 리베이스가 됩니까?

rETH 토큰은 리베이스되지 않습니다.
지갑의 토큰 수는 일정하게 유지되지만 시간이 지남에 따라 가치가 상승합니다.

### 노드 운영 중 기술적인 문제가 있는 경우 어디에서 도움을 받을 수 있습니까?

먼저 [Rocket Pool Support](https://rocketpool.support) 페이지를 확인하실 수 있습니다.
도움이 되지 않는 경우 [Discord 서버](https://discord.gg/rocketpool)의 Rocket Pool **#support** 채널에서 질문하실 수 있습니다.

### minipool을 생성하고 운영하는 실험을 위해 테스트 ETH를 어떻게 얻을 수 있습니까? faucet 채널에 메시지를 게시할 수 없습니다.

[Hoodi에서 테스트 ETH 받기](./testnet/overview#getting-test-eth-on-hoodi)를 참조하세요.

### 기기가 고장 나면 노드를 어떻게 복구합니까?

간단한 답변: 노드를 완전히 복구하는 데 필요한 것은 니모닉뿐입니다.
항상 안전하게 보관하시기 바랍니다.

새 기기에서 노드를 복구하려면 먼저 **이전 기기가 키를 사용할 수 있는 상태로 다시 온라인 상태가 되지 않도록 확인**하십시오. 동일한 키로 두 개의 노드를 실행하면 **슬래싱됩니다**.
새 기기에 Smartnode를 설치하는 [단계](./install-modes)를 따르십시오.
그런 다음 `rocketpool wallet recover` 명령을 실행하고 24단어 니모닉을 입력하여 노드 지갑과 validator 키를 복구하십시오.

### 클라이언트가 동기화되지 않는 이유는 무엇입니까? 피어 수가 적습니다.

클라이언트가 제대로 동기화되려면 충분한 수의 피어가 필요합니다.
[여기](https://www.yougetsignal.com/tools/open-ports/)에서 테스트를 실행하여 포트 30303과 9001이 열려 있는지 확인할 수 있습니다.
닫혀 있다면 라우터에서 포트 포워딩을 설정해야 합니다.
또한 노드가 새 주소를 받아 포트 포워딩이 중단되지 않도록 노드에 고정 로컬 IP 주소가 있는지 확인하십시오.

### 컨센서스 클라이언트가 동기화하는 데 너무 오래 걸립니다. 어떻게 해야 합니까?

[Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing)를 사용하여 동기화 프로세스를 시작하지 않은 경우 컨센서스 클라이언트는 동기화하는 데 오랜 시간이 걸릴 수 있습니다.
오랫동안 실행하더라도 일반적으로 체크포인트 동기화 URL을 구성하고 `rocketpool service resync-eth2`로 현재 동기화 데이터를 지우고 다시 시작하는 것이 더 빠릅니다.
클라이언트는 1분 이내에 동기화되어야 합니다.

### 이미 재부팅했습니다. Grafana가 여전히 재부팅이 필요하다고 표시하는 이유는 무엇입니까?

재부팅 정보는 캐시되며 몇 시간마다만 업데이트됩니다.
`sudo apt update`를 실행하면 강제로 업데이트됩니다.

### Execution Layer 및/또는 Beacon Chain 또는 Consensus Layer를 변경했습니다. 이전 데이터를 어떻게 정리합니까?

클라이언트를 변경하면 Rocketpool은 이전 볼륨을 삭제하지 않습니다. 이 데이터는 상당한 디스크 공간을 낭비할 수 있으므로 제거할 수 있습니다. 그렇게 하려면 볼륨을 찾아야 합니다. 기본 Rocketpool 설정을 사용하는 경우 docker 볼륨은 `/var/lib/docker/volumes/`에 저장됩니다. execution layer는 `rocketpool_eth1clientdata/_data/*`에 있고 consensus layer는 `rocketpool_eth2clientdata/_data/*`에 있습니다.

이러한 디렉토리에 액세스하려면 `sudo -i`를 사용하여 root로 sudo해야 할 수 있습니다. 그런 다음 `rm -rf <directory>`를 호출하여 디렉토리를 삭제할 수 있습니다. 예를 들어 모든 geth 데이터를 삭제하려면 `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`를 호출합니다.

root로 종료하려면 `exit`를 입력하십시오.
