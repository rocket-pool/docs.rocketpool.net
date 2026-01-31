# Selecting Staking Hardware

Rocket Pool 노드를 실행하기 위한 공식 사양은 없습니다.
이 페이지는 staking 하드웨어를 선택하는 데 사용할 수 있는 몇 가지 가이드라인과 예시를 제공합니다.

노드의 최소 하드웨어 요구사항은 선택하는 Consensus 및 Execution 클라이언트에 따라 달라집니다.
예를 들어 저전력 장치에서 노드를 실행하려는 경우 Execution 클라이언트로 `Geth`를, Consensus 클라이언트로 `Nimbus`를 사용하는 것으로 제한될 수 있습니다.
32GB 이상의 RAM을 갖춘 더 강력한 NUC를 사용하는 경우 모든 클라이언트 조합을 선택할 수 있습니다.

아래 가이드라인은 **여유 있는** 하드웨어 수준을 원한다고 가정합니다. 즉, 여유 용량이 있다는 의미입니다.
이러한 가이드라인을 염두에 두면 노드는 Rocket Pool이 지원하는 모든 클라이언트 조합을 실행할 수 있는 충분한 리소스를 갖게 됩니다.
이를 통해 `random` 클라이언트 쌍을 선택할 수 있으며, 이는 Ethereum 네트워크의 클라이언트 다양성에 매우 중요합니다.

::: tip NOTE
Ethereum staking은 매우 관대합니다.
집이 침수되어 staking 장치가 고장 나더라도 다시 실행하는 데 일주일이 걸린다고 해도 큰 페널티는 없습니다(동기화 위원회에 속해 있지 않는 한, 이는 매우 드문 이벤트입니다).
구성 요소 고장은 어느 시점에 발생할 수 있지만 스트레스 받지 마십시오.
다운타임은 전체 Ethereum 네트워크의 주요 중단 중에 오프라인 상태가 아니면 슬래싱되지 않습니다.
:::

## Hardware Requirements

Ethereum validator는 계산 집약적이지 않습니다. 즉, Execution 및 Consensus 클라이언트가 실행되면 추가 validator는 **매우 적은 양의 추가 리소스**를 사용합니다.
이는 64개의 validator까지 증가하며, 그 시점에서 65번째 validator 이상을 추가하는 데 필요한 리소스는 무시할 수 있습니다.

우리의 경험상 미니 PC 및 NUC를 포함한 대부분의 설정은 사실상 무제한의 validator를 실행할 수 있습니다.

### CPU Requirements

**가이드라인: 최소 4개의 스레드를 가진 최신 CPU.**

Rocket Pool 노드 실행은 계산 집약적이지 않습니다.
CPU의 가장 큰 영향은 노드를 처음 생성할 때(또는 나중에 클라이언트를 변경하는 경우) 블록체인 상태를 초기 동기화하는 속도입니다.
초기 동기화 후에는 CPU가 많이 사용되지 않습니다.

CPU 명명은 오해의 소지가 있을 수 있습니다. 2010년의 Intel Core i5는 일반적으로 2022년의 core i3보다 **성능이 낮습니다**.
많은 커뮤니티 구성원들은 작은 폼 팩터 때문에 Intel NUC 장치를 사용하지만, 오래된 i5 NUC는 새 i3보다 나쁜 선택일 수 있습니다.
이러한 이유로 기껏해야 몇 년 된 "최신" CPU를 사용하는 것이 좋습니다.
더 구체적으로 **x64 기반 CPU의 경우** [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) 확장을 지원하는 CPU를 권장합니다. CPU 제조업체 사양을 확인하여 지원되는지 확인하십시오.
모든 최신 CPU가 이를 지원하는 것은 아닙니다. 예를 들어 Celeron CPU는 포함하지 않는 경향이 있습니다.

ARM 기반 CPU(Mac M1 또는 M2, Rock 5B 등)는 위의 BMI2 확장에 적용되지 않습니다.

::: tip NOTE
NUC를 사용하는 데 관심이 있는 경우 모델 번호로 NUC가 얼마나 최신인지 알 수 있습니다.
`NUC` + `세대 번호` + `모델` + `CPU 유형` + `접미사` 형식입니다.
예를 들어 `NUC11PAHi50Z` 장치는 11세대 i5 장치입니다.
Intel 웹사이트에서 NUC 목록을 [여기](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html)에서 볼 수 있습니다.

Asus PN50 또는 PN51과 같은 다른 미니 PC는 이 규칙을 따르지 않지만 사용하는 CPU에 대한 정보는 제품 페이지에 포함되어야 합니다.
:::

CPU의 코어 수는 **스레드 수**보다 덜 관련이 있습니다.
Rocket Pool 노드 운영을 위해 **최소 4개의 스레드**를 권장합니다.
4개의 스레드를 가진 2코어 CPU는 문제없이 작동합니다.
2개의 스레드만 있는 CPU를 찾는 것은 드뭅니다.

### RAM Requirements

**가이드라인: 최소 16GB RAM, 32GB 권장, DDR4 권장**

Rocket Pool 노드는 16GB RAM만으로도 작동할 수 있습니다.
일반적으로 약간 더 많은 여유 공간을 제공하고 Teku와 같은 RAM 집약적인 클라이언트를 완전히 지원하기 위해 약간 더 많은 것을 권장합니다.
더 많은 RAM의 추가 이점은 Execution 클라이언트에 더 큰 캐시 크기를 제공할 수 있다는 것입니다. 이는 디스크 공간 사용 속도를 늦추는 경향이 있습니다.

### SSD Requirements

**가이드라인: TLC 이상의 2TB 이상 SSD, DRAM 캐시 포함. NVMe 권장.**

이 요소는 대부분의 사람들이 예상하는 것보다 더 중요합니다.
Execution 클라이언트는 IOPS 또는 "초당 작업 수"에 크게 의존합니다. 15k Read IOPS 및 5k Write IOPS를 권장합니다.
실제로 이것은 다음을 의미합니다:

- HDD(회전 플래터) 드라이브는 작동하지 않습니다
- SATA 또는 외장 USB 3.0+ SSD는 _작동할 수 있습니다_
- NVMe SSD 드라이브가 권장됩니다

이미 사용하려는 SSD가 있고 노드 운영에 충분한 성능이 있는지 확인하고 싶은 경우.

_\* 디스크가 이러한 성능 요구 사항을 충족하는지 확실하지 않은 경우 `fio`가 테스트하는 좋은 방법입니다.
Linux 지침은 [여기](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/)를,
MacOS 지침은 [여기](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/)를 참조하십시오._

:::tip NOTE
SSD 선택은 복잡한 선택이 될 수 있습니다!

SSD가 플래시 칩에 데이터를 저장하는 데 사용하는 방법은 속도와 수명에 눈에 띄는 영향을 미칩니다.
SSD를 쇼핑할 때 `QLC`, `TLC` 또는 `SLC`와 같은 레이블을 볼 수 있습니다.
이는 플래시 칩의 단일 셀에 포함된 데이터의 양을 나타냅니다: "쿼드"의 경우 `Q`는 4를, "트리플"의 경우 `T`는 3을, "멀티"의 경우 `M`은 2를, "싱글"의 경우 `S`는 1을 의미합니다.

**TLC, MLC 또는 SLC** 드라이브를 권장합니다.
성능이 느리고 전체 안정성이 낮기 때문에 **QLC 드라이브는 권장하지 않습니다**.

SSD는 DRAM이 있거나 없이 제공되며, 이는 SSD의 데이터에 더 효율적으로 액세스할 수 있게 하는 하드웨어 요소입니다.
DRAM이 있는 것은 더 빠르지만 DRAM이 없는 것은 더 저렴합니다.
그러나 DRAM은 원활한 노드 운영을 제공하는 데 매우 중요합니다.

**DRAM** 캐시가 있는 드라이브를 권장합니다.
**DRAM이 없는 드라이브는 권장하지 않습니다**.
:::

최종 고려 사항은 드라이브 크기입니다.
2024년 10월 현재 `geth` execution 클라이언트 데이터베이스 크기는 초기 동기화를 완료한 후(또는 방금 정리를 완료한 후) 약 1.2TB의 공간이 필요합니다.
이것은 시간이 지남에 따라 꾸준히 증가하며, 정리를 통해 일부 공간을 되찾을 수 있지만 새로 정리된 상태는 시간이 지남에 따라 _증가합니다_.
더 큰 드라이브로 마음의 평화를 얻을 수 있습니다.

### Common Accessories

많은 노드 운영자들은 최소 요구 사항을 넘어서 설정을 개선합니다.
일부 일반적인 추가 사항은 다음과 같습니다:

- 드라이브 수명을 연장하기 위한 SSD 히트싱크
- 정전 시를 대비한 무정전 전원 공급 장치(UPS)
- 무언가 고장 날 경우를 대비한 백업 노드

이러한 모든 것은 편리하지만 Rocket Pool 노드를 실행하는 데 필요하지는 않습니다.

## Example Setups

이 섹션에서는 Rocket Pool 커뮤니티가 직접 만든 다양한 빌드 중 몇 가지를 보여드리겠습니다.
이는 사람들이 사용하고 있는 예시이며 설정을 실행하는 방법에 대한 권장 사항이 아닙니다.
많은 것이 다소 구식이며 예를 들어 현재 너무 작은 SSD를 사용합니다.

### Xer0's Server

![](./images/Xer0.jpg)

Discord 사용자 **Xer0**는 staking 기기로 기존 PC 폼 팩터를 선택한 많은 staker 중 한 명입니다.
그들은 최소한의 유지 관리와 업그레이드가 필요하면서도 모든 구성 요소의 완전한 사용자 지정을 제공하면서 수년 동안 지속될 장비를 구축하고 싶었습니다.
이를 위해 Xer0는 전통적인 데스크톱 PC와 매우 유사하지만 Ethereum에서의 staking을 전적으로 목표로 하는 전체 ATX 서버를 고안하고 구축했습니다.
그들의 설정에는 6코어 Xeon Bronze 3204(1.9GHz), 8개의 DDR4 슬롯 및 M.2 슬롯이 포함됩니다... 하지만 이것은 본질적으로 홈 서버 빌드이므로 정확한 구성 요소는 최종 사용자에게 달려 있습니다.

Xer0's setup:

- Motherboard: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Cooler: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Total: $1680**

Here are Xer0's comments on why they chose this setup:

_Obviously there is no need to build a monstrosity for simply staking on the Ethereum network, but I do have a few reasons why I built something like this._

1. _Now I believe that 1 or more validators in the future will be worth much more than what we are seeing right now, so I wanted to buy something that will be able to support the network for at least the next 10-20 years without a hiccup._
1. _By creating a machine that has at this many cores I've also given myself a lot more headroom to the point of I could run an L2 aggregator on top of this without any problems (regarding hardware) and anything else that I'd want to run on a server._ :)
1. _I like building computers, and so I built it…_
1. _With a server build, It gives me a lot more flexibility with hardware and features that most computers don't have natively._
1. _A bit of future proof (just in-case)_ :wink:

### Darcius's Shelf Rig

![](./images/Darcius.jpg)

Rocket Pool의 설립자 David Rugendyke(Discord에서 **darcius**로 알려짐)는 노드를 완벽하게 만드는 데 오랜 시간을 보냈습니다.
약간의 논의 끝에 그는 작고 휴대 가능하지만 엄청난 양의 처리 능력을 제공하는 Mini-ITX를 구축했습니다.
그의 장비에는 8코어 Ryzen 7 5800x(3.8GHz), 2개의 DDR4 슬롯 및 NVMe SSD용 2개의 M.2 슬롯이 포함됩니다.
이것은 정말로 Rocket Pool 노드 중 가장 고성능 장비 중 하나이지만 정당한 이유가 있습니다: darcius는 모든 Rocket Pool validator에 대해 Beacon 체인에서 Execution 체인으로 정보를 중계하는 Oracle Node라는 특별한 유형의 Rocket Pool 노드를 실행합니다.
수천 개의 Rocket Pool minipool이 활성화되어 있어 지켜봐야 할 작업에는 많은 성능이 필요합니다... 하지만 그의 선반 장비는 작업을 쉽게 수행할 수 있습니다.

Darcius's setup:

- Motherboard: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Total: $1587**

### Yorick's microATX Build

![](./images/Yorick-stock.jpg)

베테랑 하드웨어 애호가 **YorickDowne**는 서버 구축 및 유지 관리에 대한 많은 경험을 가지고 있습니다.
그 지식을 사용하여 그는 유연한 microATX 설정에 정착했습니다.
그의 기기는 일반적인 PC보다 훨씬 작지만 Rocket Pool 노드를 실행할 때 핵심 지표인 복원력과 가동 시간을 최대화하는 서버급 기술을 장착하고 있습니다.
그는 Intel 및 AMD 설정 모두에 대한 권장 사항을 가지고 있으며 [그의 웹사이트](https://eth-docker.net/docs/Usage/Hardware)에서 찾을 수 있습니다.
Intel 버전은 쿼드 코어 i3-9100F(3.6GHz) 또는 Xeon CPU를 사용하고 AMD 버전은 ECC 메모리를 지원하는 모든 Ryzen CPU를 제안합니다.
두 구성 모두에 대해 그는 16GB ECC RAM과 1TB NVMe SSD를 제안합니다.

Yorick's Setup:

- Motherboard: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Any (example: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Case fans: Any
- **Total: About $886**

Here are Yorick's comments on why he chose this setup:

- _It is at the same or lower cost as some NUCs_
- _It has ECC RAM, which means that if memory fails - which it does now and then - I will know, because the system will tell me. I do not have to run memtest87 for 4-5 days to figure out whether my problem with instability is even memory-related. I protect my time fiercely so I can spend it bloviating on Discord instead of troubleshooting hardware_
- _It has IPMI, which is remote management via Ethernet/browser of the entire machine, including UEFI and power-cycle. I should be allowed to go on an extended vacation and still have full remote access._
- _If I want redundant storage so eventual SSD failure is a non-event, I can do that_
- _It allows for great flexibility in build choices. I can choose however much RAM and compute I want; I can choose to run a NAS with virtualization tech like TrueNAS Scale and run the node on there alongside some other home-servery stuff._

### Drez's Laptop

![](./images/Drez.jpg)

때로는 새 하드웨어에 돈을 쓰는 것이 의미가 없습니다.
Discord 사용자 **Drez**의 경우 Rocket Pool 노드를 실행하는 것이 그러한 경우 중 하나입니다.
Drez는 우연히 여분의 노트북이 있었고 쉽게 노드로 바꿨습니다.
그들의 기기에는 쿼드 코어 i7-4710HQ(2.5GHz), 2개의 DDR3 슬롯 및 2.5" SATA 슬롯이 포함됩니다.
노트북이기 때문에 자체 배터리도 함께 제공됩니다(UPS의 필요성을 상쇄합니다).
그들은 시간이 지남에 따라 추가 업그레이드를 추가하여 노트북에 추가 성능을 제공하여 마음의 평화를 얻었습니다.

Drez's setup:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Included)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Total: $1910**

Here are Drez's comments on why they chose this setup:

_Main reason i am gonna stake on this laptop is because i already had spare one and dont need to spend extra money on a new server.
I like its mobility, compactness, built-in screen for easy monitoring.
In case of overheating i bought a laptop cooling pad and spare CPU cooler just in case, i also recommend to change thermal compound paste especially if you're gonna run on an older machine_

## NUCs (Next Unit of Computing) and Mini-PCs

Rocket Pool 노드를 실행하는 데 반드시 완전한 DIY 데스크톱이 필요한 것은 아닙니다.
사실, staker들 사이에서 가장 인기 있는 설정 중 하나는 뛰어난 NUC입니다.
NUC(Next Unit of Computing)는 본질적으로 매우 낮은 전력 사용과 최대 효율성을 중심으로 설계된 작고 독립적인 컴퓨터입니다.
NUC는 유지 관리가 적고 월간 실행 비용이 낮으며 설정이 쉽기 때문에 몇 개의 validator만 실행하는 대부분의 staker에게 훌륭합니다.
PC와 달리 NUC는 케이스에 사전 조립되어 제공됩니다. RAM을 추가하고 SSD를 추가하기만 하면 실행할 수 있습니다!
다음은 일부 Rocket Pool 베테랑들이 사용하고 권장하는 NUC 설정의 몇 가지 예입니다.

::: tip NOTE
**Ethernet Adaptor Compatibility**

Intel® NUC 11세대 또는 12세대를 구매할 계획이라면 이더넷 어댑터와 연결 문제가 발생할 수 있습니다. 특히 어댑터가 **I225-LM**으로 식별되는 경우입니다(구매하기 전에 Intel 사양을 확인하십시오).
이미 가지고 있다면 이 문제를 해결하기 위해 취할 수 있는 조치가 있습니다.
I225-LM 어댑터는 특히 Linux 커널을 사용할 때 **시스템 정지** 및 예기치 않은 커널 동작으로 이어질 수 있는 특정 호환성 문제와 관련이 있습니다.

NUC가 문제가 있는 I225-LM 이더넷 어댑터를 사용하는지 확인하려면 터미널에서 다음 명령을 사용할 수 있습니다:

```shell
sudo lshw -class network | grep 225
```

출력이 I225-LM 어댑터의 존재를 확인하면 언급된 문제가 발생할 수 있습니다. 그러나 이러한 문제를 완화하기 위해 적용할 수 있는 _해결책_이 있습니다:

**USB-C to Ethernet Adaptor**: 실행 가능한 솔루션은 USB-C to Ethernet 어댑터를 구입하고 이 외부 어댑터를 통해 인터넷 케이블을 연결하는 것입니다. 이 접근 방식에는 추가 하드웨어 및 구성이 필요하지만 호환성 충돌을 해결하는 데 효과적인 것으로 입증되었습니다. 이를 통해 I225-LM 어댑터와 관련된 정지 또는 커널 관련 이상 현상이 발생하지 않고 사용 가능한 최신 Linux 커널을 활용할 수 있습니다.**이것은 I225-LM이 있는 NUC가 이미 있는 경우 권장되는 솔루션입니다(현재로서는)** _어댑터를 선택하면 잠재적인 대기 시간 또는 인터넷 속도 감소 측면에서 트레이드오프가 발생할 수 있다는 점을 명심하십시오. 이 영향을 완화하려면 최소 1GB/s 이식성이 있는 어댑터를 선택하여 최적의 데이터 전송 속도를 유지하는 것이 좋습니다._

**Driver and Software Updates**: NUC 모델의 공식 Intel® 지원 페이지를 참조하여 드라이버, 펌웨어 및 BIOS를 업데이트하는 것을 고려하십시오[여기](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). 여기에는 Intel 웹사이트의 최신 사용 가능한 지원 드라이버를 사용하거나 호환성 문제를 해결하는 BIOS 업데이트를 적용하는 것이 포함될 수 있습니다.

**Intel's Patch (Windows)**: Intel은 Windows 시스템에서 유사한 문제를 해결하기 위해 패치를 발표했습니다. 패치 자체가 **Linux 환경에 직접 적용되지 않을 수 있지만** Intel이 문제를 인식하고 솔루션을 제공하려는 노력을 강조합니다. 이 [링크](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3)에서 패치에 대한 자세한 내용을 찾을 수 있습니다.

기술은 진화하며 솔루션은 시간이 지남에 따라 변경될 수 있습니다. 항상 공식 다운로드 [페이지](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads])에서 특정 NUC 모델에 대해 Intel이 제공하는 최신 리소스로 업데이트하십시오.

이러한 단계를 따르면 Intel® NUC 11세대 및 12세대 제품의 I225-LM 이더넷 어댑터와 관련된 호환성 문제를 해결하여 서버 배포로 더 원활하고 안정적인 경험을 보장할 수 있습니다. _이 어댑터를 사용하는 NUC 사용자의 일부는 문제가 없다고 보고했지만 커널 업그레이드 후 특히 **대다수 사용자**가 문제를 겪었다는 점에 유의하는 것이 중요합니다. 특히 5.15.+ 커널은 I225-LM 어댑터를 사용하는 사람들에게 가장 안정적인 옵션으로 입증되었습니다. USB-C 어댑터를 사용하는 아이디어가 매력적이지 않고 잠재적인 무작위 정지의 위험을 감수할 의향이 있다면 **더 큰 안정성을 보여준 커널 버전에 남아 있는 것이 좋습니다**._
:::

### Ken's NUC8i5BEK

![](./images/Ken.jpg)

NUC8i5BEK는 8세대 프로세서를 탑재한 Intel 자체 NUC 중 하나입니다.
2018년에 출시된 이 모델에는 쿼드 코어 i5-8259U CPU(2.30GHz), 2개의 DDR4 슬롯, SSD용 M.2 슬롯 및 USB 3.1 포트가 포함됩니다.
일반적으로 약 20와트를 소비하지만 Discord 사용자 **Ken**은 일반 검증 중에 9와트로 최적화할 수 있었습니다.
모든 Execution 및 모든 Consensus 클라이언트를 처리할 수 있으므로 가볍고 효율적인 노드 기기에 탁월한 선택입니다.

Ken's Setup:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Fanless Case (optional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Total: $691 to $825**

Here are Ken's comments on why he chose this setup:

- _Small size and footprint, the power supply is a brick on the power cord (like a laptop), single-board computer, x86 architecture, low purchase price point, low power consumption (~10W), 3-year warranty, and an active manufacture product line (Intel)._
- _8th generations are plenty fast and at a lower price point than the latest generation chips._
- _I upgraded to a fan-less (passively cooled) case, so the NUC is absolutely silent (0 dB) as I'm leaving it my home office (a stock NUC is near silent already)._
- _Plus no mechanical wear on the fan bearings._
- _Resale or re-purpose value if I decide to retire this hardware platform as my RP node - NUC's make a great workstation computer._

### GreyWizard's NUC10i7FNH

![](./images/GreyWizard.jpg)

NUC10i7FNH는 Intel 자체 NUC 중 또 다른 하나입니다.
이것은 10세대 프로세서를 자랑하며 2019년에 출시되었습니다.
6코어 i7-10710U CPU(1.10GHz, 4.7GHz까지 부스트), 2개의 DDR4 슬롯, SSD용 M.2 슬롯 및 2.5" 슬롯, USB 3.1 포트가 포함됩니다.
약 20와트의 전력을 소비합니다.
전력 소비와 크기를 고려하면 믿을 수 없을 정도로 강력한 기계입니다.
Discord 사용자 **GreyWizard**는 자신의 노드에 이 NUC를 사용합니다. 추가 성능은 Ethereum 2.0 체인의 미래가 무엇을 갖고 있든 그의 기계가 그것을 처리할 수 있다는 것을 알고 마음의 평화를 제공합니다.

GreyWizard's Setup:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 ea.)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1068**

Here are GreyWizard's comments on why he chose this setup:

_I went with the i7 NUC mostly because it felt like the best combination of outstanding performance relative to overall size and overhead.
I also looked at other options like building a Micro ATX-sized machine.
After pricing one with the specs I was looking for, this Intel NUC ended up being about the same price, and the form factor is really tough to beat.
I like having the extra headroom for performance/peace of mind, and I acknowledge that this is almost certainly way overkill.
I consider staking as a serious investment and I don't want to worry if my hardware will be sufficient._

_Tips for other people considering this as an option..._

- _The NUC does run pretty warm, similar temps to a laptop. If you worry about CPU temp and you want something powerful, then you should look at small desktop setups like Micro ATX._
- _You will want to make sure there is plenty of room around your NUC for airflow. Plan to clean the area regularly to prevent dust buildup._
- _Make sure to check compatibility for your RAM cards. The different NUCs support varying degrees of total RAM, RAM speeds, etc._
- _If you go with the NUC, I'd suggest you give yourself room to grow when selecting RAM... For example, spend a bit extra and get a single 32gb RAM card rather than 2x16 so you can expand later if you want (assuming your NUC will support 64gb in this example)_
- _Feel free to reach out to me on Discord if you would like to discuss._

### ArtDemocrat's NUC10i5FNHN Build Process Video

Greywizard의 설정 설명과 팁을 보완하기 위해 ArtDemocrat는 NUC10(이 경우 NUC10i5FNHN이지만 빌드 프로세스는 NUC10i7FNH와 유사해야 함)을 설정하기 위한 추가 도움 리소스로 이 빌드 프로세스 비디오를 만들었습니다:

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat's Setup:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17's PN50

![](./images/PN50-actioncj17.jpg)

ASUS PN50은 Intel의 NUC 제품군과 많은 공통점을 공유하는 미니 PC입니다.
매우 작은 폼 팩터를 가지고 있지만 전체 PC의 모든 구성 요소와 기능을 가지고 있습니다.
성능과 비용 사이의 균형을 맞출 수 있도록 선택한 AMD CPU(최대 2.0GHz에서 8코어 Ryzen R7-4700U)와 함께 제공되며 2개의 DDR4 슬롯, SSD용 M.2 슬롯 및 2.5" 슬롯, USB 3.1 포트가 포함됩니다.
또한 90와트 전원 공급 장치와 함께 제공되지만 실제로 Rocket Pool 노드 역할을 하는 동안 그만큼의 전력이 필요하지 않습니다.
Discord 사용자 **actioncj17**은 여러 다른 설정을 시도했지만 모든 것보다 PN50을 선호합니다... 그러나 그들은 Rocket Pool 노드를 실행하는 데 과도하다는 것을 기꺼이 인정합니다.

Actioncj17's Setup:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1118**

Here are actioncj17's comments on why they chose this setup:

_My answer to why I chose the Asus PN50 is quite simple.
I wanted to see how badass AMD's Ryzen 7 4700U was.
Let's just say I'm not disappointed.
I actually started with the Intel NUC10FNK.
I put 32gb of ram and 1tb 970 evo plus nvme m.2 in the nuc and it blazes.
I have no complaints with the nuc and it works fine but I get more out of my PN50.
I'd say both setups are overkill for staking on Rocketpool but a little future proofing doesn't hurt.
They both have small footprints and the nuc is actually much quieter since it is fanless.
All in all the PN50 is a better bang for your buck if you can get your hands on one._

### Moralcompass's Mini-PC

![](./images/moralcompass-minipc.jpg)

Discord 사용자 **moralcompass**는 actioncj17과 비슷한 경로로 미니 PC를 선택했지만 Intel CPU를 선호합니다.
그들은 쿼드 코어 i5 8250U(1.6GHz, 최대 3.4GHz로 부스트), 1개의 DDR4 슬롯, SSD용 M.2 슬롯 및 2.5" 슬롯, USB 3.0 포트를 자랑하는 미니 PC를 사용합니다.
Moralcompass는 벽에서 약 10와트만 끌어 당긴다고 주장하며, 이는 이와 같은 미니 PC가 매우 효율적이라는 것을 보여줍니다.
이 선택의 흥미로운 점은 완전히 수동 냉각된다는 것입니다. 팬이 없습니다!
팬리스 미니 PC에는 많은 변형이 있지만 moralcompass는 자신에게 맞는 것을 찾아 고수하고 있습니다.

Moralcompass's Setup:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Total: $655**

Here are moralcompass's comments on why they chose this setup:

- _No moving parts, no noise._
- _Dual intel NIC (in case I decide to repurpose this as my router one day)_
- _NVME + SATA slots (prefer NVME for speed and options with higher TBW endurance. SATA gives option of HDD or SSD. I avoided M.SATA interfaces because these SSDs seem to be turning legacy)_
- _USB and serial ports available for graceful shutdown signal from UPS_
