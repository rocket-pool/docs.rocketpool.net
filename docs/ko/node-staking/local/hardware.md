# Staking 하드웨어 선택

Rocket Pool 노드를 실행하기 위한 공식 사양은 없습니다.
이 페이지는 staking 하드웨어를 선택하는 데 사용할 수 있는 몇 가지 가이드라인과 예제를 제공합니다.

노드의 최소 하드웨어 요구 사항은 선택한 Consensus 및 Execution 클라이언트에 따라 다릅니다.
예를 들어, 저전력 장치에서 노드를 실행하려는 경우 Execution 클라이언트로 `Geth`를, Consensus 클라이언트로 `Nimbus`를 사용하는 것으로 제한될 수 있습니다.
32GB 이상의 RAM을 갖춘 더 강력한 NUC를 사용하는 경우 모든 클라이언트 조합을 사용할 수 있습니다.

아래 가이드라인은 **편안한** 수준의 하드웨어를 원한다고 가정합니다. 즉, 초과 용량이 있습니다.
이러한 가이드라인을 염두에 두면 노드에 Rocket Pool이 지원하는 모든 클라이언트 조합을 실행할 수 있는 충분한 리소스가 있습니다.
이를 통해 Ethereum 네트워크의 클라이언트 다양성에 매우 중요한 `random` 클라이언트 쌍을 선택할 수 있습니다.

::: tip 참고
Ethereum staking은 매우 관대합니다.
집이 침수되고 staking 장치가 고장 나더라도 다시 실행하는 데 일주일이 걸리는 것에 대한 큰 페널티는 없습니다(sync committee에 있지 않는 한, 이는 매우 드문 이벤트입니다).
구성 요소 고장은 언젠가 발생할 수 있지만 스트레스를 받지 마십시오.
다운타임은 전체 Ethereum 네트워크의 주요 중단 중에 오프라인 상태가 아니면 슬래시되지 않습니다.
:::

## 하드웨어 요구 사항

Ethereum validator는 계산 집약적이지 않습니다. 즉, Execution 및 Consensus 클라이언트가 실행되면 추가 validator는 **매우 적은 양의 추가 리소스**를 사용합니다.
이는 64개의 validator까지 증가하며, 그 시점에서 65번째 이상의 validator를 추가하는 데 필요한 리소스는 무시할 수 있습니다.

우리의 경험상 mini-PC 및 NUC를 포함한 대부분의 설정은 사실상 무제한의 validator를 실행할 수 있습니다.

### CPU 요구 사항

**가이드라인: 최소 4개 스레드가 있는 최신 CPU.**

Rocket Pool 노드를 실행하는 것은 계산 집약적이지 않습니다.
CPU의 가장 큰 영향은 노드를 처음 생성할 때(또는 나중에 클라이언트를 변경하는 경우) 블록체인 상태를 초기 동기화하는 속도입니다.
초기 동기화 후에는 CPU가 그다지 많이 사용되지 않습니다.

CPU 이름은 기만적일 수 있습니다. 2010년의 Intel Core i5는 일반적으로 2022년의 core i3보다 **덜 강력합니다**.
많은 커뮤니티 구성원은 작은 폼 팩터 때문에 Intel NUC 장치를 사용하지만 오래된 i5 NUC는 새로운 i3보다 나쁜 선택일 수 있습니다.
이러한 이유로 기껏해야 몇 년 된 "최신" CPU를 사용하는 것이 좋습니다.
보다 구체적으로, **x64 기반 CPU의 경우** [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) 확장을 지원하는 CPU를 권장합니다. CPU 제조업체의 사양을 확인하여 지원되는지 확인하십시오.
모든 최신 CPU가 이를 지원하는 것은 아닙니다. 예를 들어 Celeron CPU는 포함하지 않는 경향이 있습니다.

ARM 기반 CPU(Mac M1 또는 M2, Rock 5B 등)는 위의 BMI2 확장에 적용되지 않습니다.

::: tip 참고
NUC를 사용하는 데 관심이 있는 경우 모델 번호로 NUC가 얼마나 최신인지 알 수 있습니다.
`NUC` + `세대 번호` + `모델` + `CPU 유형` + `접미사` 형식입니다.
예를 들어, `NUC11PAHi50Z` 장치는 11세대 i5 장치입니다.
Intel 웹사이트에서 NUC 목록을 [여기](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html)에서 볼 수 있습니다.

Asus PN50 또는 PN51과 같은 다른 mini-PC는 이 규칙을 따르지 않지만 사용하는 CPU에 대한 정보는 제품 페이지에 포함되어야 합니다.
:::

CPU의 코어 수는 **스레드 수**보다 관련성이 낮습니다.
Rocket Pool 노드 작동을 위해 **최소 4개의 스레드**를 권장합니다.
4개의 스레드가 있는 2코어 CPU는 문제없이 작동합니다.
스레드가 2개만 있는 CPU를 찾는 것은 드뭅니다.

### RAM 요구 사항

**가이드라인: 최소 16GB의 RAM, 32GB 선호, DDR4 선호**

Rocket Pool 노드는 최소 16GB의 RAM으로 작동할 수 있습니다.
일반적으로 약간의 여유 공간을 제공하고 Teku와 같은 RAM 집약적인 클라이언트를 완전히 지원하기 위해 조금 더 많은 것을 권장합니다.
더 많은 RAM의 추가 이점은 Execution 클라이언트에 더 큰 캐시 크기를 제공할 수 있다는 것이며, 이는 디스크 공간 사용 속도를 늦추는 경향이 있습니다.

### SSD 요구 사항

**가이드라인: DRAM 캐시가 있는 TLC 이상의 2TB 이상 SSD. NVMe 선호.**

이 요소는 대부분의 사람들이 예상하는 것보다 더 중요합니다.
Execution 클라이언트는 IOPS, 즉 "초당 작업 수"에 크게 의존합니다. 15k Read IOPS 및 5k Write IOPS를 권장합니다.
실제로 이는 다음을 의미합니다:

- HDD(스피닝 플래터) 드라이브는 작동하지 않습니다
- SATA 또는 외부 USB 3.0+ SSD는 _작동할 수 있습니다_
- NVMe SSD 드라이브가 선호됩니다

이미 사용하려는 SSD가 있고 노드 작동에 충분한 성능이 있는지 확인하려면.

_\* 디스크가 이러한 성능 요구 사항을 충족하는지 확실하지 않은 경우 `fio`는 테스트하는 좋은 방법입니다.
Linux 지침은 [여기](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/)를,
MacOS 지침은 [여기](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/)를 참조하십시오._

:::tip 참고
SSD 선택은 복잡한 선택이 될 수 있습니다!

SSD가 플래시 칩에 데이터를 저장하는 데 사용하는 방법은 속도와 수명에 눈에 띄는 영향을 미칩니다.
SSD를 구매할 때 `QLC`, `TLC` 또는 `SLC`와 같은 레이블을 볼 수 있습니다.
이는 플래시 칩의 단일 셀에 포함된 데이터의 양을 나타냅니다: `Q`는 "quad"를 의미하며 4, `T`는 "triple"을 의미하며 3, `M`은 "multi"를 의미하며 2, `S`는 "single"을 의미하며 1입니다.

**TLC, MLC 또는 SLC** 드라이브를 권장합니다.
느린 성능과 낮은 전체 신뢰성으로 인해 **QLC 드라이브는 권장하지 않습니다**.

SSD에는 DRAM이 있거나 없으며, 이는 SSD의 데이터에 더 효율적으로 액세스할 수 있게 하는 하드웨어 요소입니다.
DRAM이 있는 것은 더 빠르지만 DRAM이 없는 것은 더 저렴합니다.
그러나 DRAM은 원활한 노드 작동을 제공하는 데 매우 중요합니다.

**DRAM** 캐시가 있는 드라이브를 권장합니다.
**DRAM이 없는 드라이브는 권장하지 않습니다**.
:::

최종 고려 사항은 드라이브 크기입니다.
2024년 10월 현재 `geth` execution 클라이언트 데이터베이스 크기는 초기 동기화를 완료한 후(또는 방금 가지치기를 완료한 후) 약 1.2TB의 공간이 필요합니다.
이는 시간이 지남에 따라 꾸준히 증가할 것이며 가지치기로 일부 공간을 회복할 수 있지만 새로 가지치기된 상태는 시간이 지남에 따라 _증가합니다_.
더 큰 드라이브를 사용하면 마음의 평화를 얻을 수 있습니다.

### 일반적인 액세서리

많은 Node Operator는 최소 요구 사항을 넘어 설정을 개선합니다.
일반적인 추가 사항은 다음과 같습니다:

- 드라이브 수명을 연장하기 위한 SSD 히트싱크
- 정전 시 무정전 전원 공급 장치(UPS)
- 무언가 실패할 경우 백업을 위한 대체 노드

이들은 모두 편리하게 가지고 있지만 Rocket Pool 노드를 실행하는 데 필요하지 않습니다.

## 예제 설정

이 섹션에서는 Rocket Pool 커뮤니티가 자신들을 위해 만든 다양한 빌드 중 일부를 소개합니다.
이들은 사람들이 사용하는 것의 예이지 설정을 실행하는 방법에 대한 권장 사항이 아닙니다.
많은 것들이 다소 오래되었으며 예를 들어 너무 작은 SSD를 사용합니다.

### Xer0의 서버

![](./images/Xer0.jpg)

Discord 사용자 **Xer0**는 staking 머신에 기존 PC 폼 팩터를 선택한 많은 staker 중 하나입니다.
그들은 최소한의 유지 관리 및 업그레이드가 필요하면서도 모든 구성 요소의 완전한 사용자 지정을 제공하는 수년간 지속될 장비를 구축하고자 했습니다.
이를 위해 Xer0는 전체 ATX 서버를 설계하고 구축했습니다. 기존 데스크톱 PC와 매우 유사하지만 Ethereum에서 staking하는 데만 전념합니다.
그들의 설정에는 6코어 Xeon Bronze 3204(1.9GHz), 8개의 DDR4 슬롯 및 M.2 슬롯이 포함됩니다... 이것은 본질적으로 홈 서버 빌드이므로 정확한 구성 요소는 완전히 최종 사용자에게 달려 있습니다.

Xer0의 설정:

- Motherboard: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Cooler: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Total: $1680**

Xer0가 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

_분명히 Ethereum 네트워크에서 단순히 staking하기 위해 괴물을 만들 필요는 없지만 이와 같은 것을 만든 몇 가지 이유가 있습니다._

1. _이제 미래에 하나 이상의 validator가 지금 보고 있는 것보다 훨씬 더 가치가 있을 것이라고 믿기 때문에 적어도 향후 10-20년 동안 문제없이 네트워크를 지원할 수 있는 것을 구매하고 싶었습니다._
1. _이만큼 많은 코어가 있는 머신을 만들면서 하드웨어와 관련하여 문제없이 이 위에 L2 aggregator를 실행할 수 있을 정도로 훨씬 더 많은 여유 공간을 제공했습니다. 그리고 서버에서 실행하고 싶은 다른 모든 것._ :)
1. _컴퓨터를 만드는 것을 좋아하기 때문에 만들었습니다..._
1. _서버 빌드를 사용하면 대부분의 컴퓨터가 기본적으로 가지고 있지 않은 하드웨어 및 기능에 대해 훨씬 더 많은 유연성을 제공합니다._
1. _약간의 미래 보장(만약을 대비하여)_ :wink:

### Darcius의 선반 장비

![](./images/Darcius.jpg)

Rocket Pool의 설립자 David Rugendyke(Discord에서 **darcius**로 알려짐)는 노드를 완성하는 데 오랜 시간을 보냈습니다.
약간의 논쟁 끝에 그는 작고 휴대 가능하지만 여전히 엄청난 양의 처리 능력을 제공하는 Mini-ITX를 만들었습니다.
그의 장비에는 8코어 Ryzen 7 5800x(3.8GHz), 2개의 DDR4 슬롯 및 NVMe SSD용 2개의 M.2 슬롯이 포함되어 있습니다.
이것은 Rocket Pool 노드 중에서 가장 고성능 장비 중 하나이지만 그럴 만한 이유가 있습니다: darcius는 Beacon chain에서 Execution chain으로 모든 Rocket Pool validator에 대한 정보를 중계하는 Oracle Node라는 특수한 유형의 Rocket Pool 노드를 실행합니다.
수천 개의 Rocket Pool minipool이 활성화되어 있어 감시해야 하므로 그 작업에는 많은 마력이 필요합니다... 하지만 그의 선반 장비는 작업을 쉽게 처리할 수 있습니다.

Darcius의 설정:

- Motherboard: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Total: $1587**

### Yorick의 microATX 빌드

![](./images/Yorick-stock.jpg)

베테랑 하드웨어 애호가 **YorickDowne**은 서버 구축 및 유지 관리에 대한 많은 경험이 있습니다.
그 지식을 사용하여 그는 유연한 microATX 설정에 정착했습니다.
그의 머신은 일반적인 PC보다 상당히 작지만 여전히 Rocket Pool 노드를 실행할 때 주요 메트릭인 복원력과 가동 시간을 최대화하는 서버급 기술을 탑재하고 있습니다.
그는 Intel 및 AMD 설정 모두에 대한 권장 사항을 가지고 있으며 [그의 웹사이트](https://eth-docker.net/docs/Usage/Hardware)에서 찾을 수 있습니다.
Intel 버전은 쿼드 코어 i3-9100F(3.6GHz) 또는 Xeon CPU를 사용하고 AMD 버전은 ECC 메모리를 지원하는 모든 Ryzen CPU를 제안합니다.
두 구성 모두에 대해 그는 16GB의 ECC RAM과 1TB NVMe SSD를 제안합니다.

Yorick의 설정:

- Motherboard: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Any (example: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Case fans: Any
- **Total: 약 $886**

Yorick이 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

- _일부 NUC와 동일하거나 더 낮은 비용입니다_
- _ECC RAM이 있어 메모리가 실패하면 - 때때로 발생합니다 - 시스템이 알려주기 때문에 알 수 있습니다. 불안정성 문제가 메모리와 관련이 있는지 알아내기 위해 4-5일 동안 memtest87을 실행할 필요가 없습니다. 저는 Discord에서 허풍을 떨 수 있도록 시간을 아끼기 위해 시간을 소중히 여깁니다_
- _IPMI가 있어 Ethernet/브라우저를 통해 UEFI 및 전원 사이클을 포함한 전체 머신을 원격 관리할 수 있습니다. 장기 휴가를 가면서도 여전히 완전한 원격 액세스가 가능해야 합니다._
- _최종 SSD 고장이 이벤트가 아니도록 중복 스토리지를 원하면 할 수 있습니다_
- _빌드 선택에서 뛰어난 유연성을 제공합니다. 원하는 만큼의 RAM과 계산을 선택할 수 있습니다. TrueNAS Scale과 같은 가상화 기술로 NAS를 실행하고 다른 홈 서버 관련 작업과 함께 노드를 실행할 수 있습니다._

### Drez의 노트북

![](./images/Drez.jpg)

때때로 새 하드웨어에 돈을 쓰는 것은 말이 되지 않습니다.
Discord 사용자 **Drez**의 경우 Rocket Pool 노드를 실행하는 것은 그러한 시기 중 하나입니다.
Drez는 우연히 여분의 노트북이 있었고 쉽게 노드로 바꾸었습니다.
그들의 머신에는 쿼드 코어 i7-4710HQ(2.5GHz), 2개의 DDR3 슬롯 및 2.5" SATA 슬롯이 함께 제공됩니다.
노트북이므로 자체 배터리도 함께 제공됩니다(UPS의 필요성을 상쇄합니다).
그들은 시간이 지남에 따라 몇 가지 추가 업그레이드를 추가하여 노트북에 더욱 마음의 평화를 제공했습니다.

Drez의 설정:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (포함)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Total: $1910**

Drez가 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

_이 노트북에서 stake하려는 주된 이유는 이미 여분이 있었고 새 서버에 추가 비용을 지출할 필요가 없기 때문입니다.
저는 이동성, 컴팩트함, 쉬운 모니터링을 위한 내장 화면을 좋아합니다.
과열의 경우 노트북 쿨링 패드와 예비 CPU 쿨러를 구입했으며, 특히 오래된 머신에서 실행하는 경우 열 컴파운드 페이스트를 교체하는 것이 좋습니다_

## NUC(Next Unit of Computing) 및 Mini-PC

Rocket Pool 노드를 실행하는 데 반드시 완전한 직접 제작 데스크톱이 필요한 것은 아닙니다.
실제로 staker 중 가장 인기 있는 설정 중 하나는 훌륭한 NUC입니다.
NUC(Next Unit of Computing)는 본질적으로 매우 낮은 전력 사용량과 최대 효율성을 위해 설계된 작고 독립된 컴퓨터입니다.
NUC는 낮은 유지 관리, 낮은 월간 운영 비용 및 쉬운 설정으로 인해 몇 개의 validator만 실행하는 대부분의 staker에게 훌륭합니다.
PC와 달리 NUC는 케이스에 사전 조립되어 제공됩니다. RAM을 추가하고 SSD를 추가하기만 하면 실행할 수 있습니다!
다음은 일부 Rocket Pool 베테랑이 사용하고 권장하는 몇 가지 NUC 설정의 예입니다.

::: tip 참고
**Ethernet 어댑터 호환성**

Intel® NUC 11세대 또는 12세대를 구매할 계획이라면 ethernet 어댑터, 특히 어댑터가 **I225-LM**으로 식별되는 경우 연결 문제가 발생할 수 있습니다(구매하기 전에 Intel 사양 확인).
이미 하나가 있는 경우 이 문제를 해결하기 위해 취할 수 있는 단계가 있습니다.
I225-LM 어댑터는 특히 Linux 커널을 사용할 때 **시스템 동결** 및 예기치 않은 커널 동작으로 이어질 수 있는 특정 호환성 문제와 관련이 있습니다.

NUC가 문제가 있는 I225-LM ethernet 어댑터를 사용하는지 확인하려면 터미널에서 다음 명령을 사용할 수 있습니다:

```shell
sudo lshw -class network | grep 225
```

출력이 I225-LM 어댑터의 존재를 확인하면 언급된 문제가 발생할 수 있습니다. 그러나 이러한 문제를 완화하기 위해 적용할 수 있는 *해결책*이 있습니다:

**USB-C to Ethernet 어댑터**: 실행 가능한 솔루션은 USB-C to Ethernet 어댑터를 구입하고 이 외부 어댑터를 통해 인터넷 케이블을 연결하는 것입니다. 이 접근 방식은 추가 하드웨어 및 구성이 필요하지만 호환성 충돌을 해결하는 데 효과적인 것으로 입증되었습니다. 이를 통해 I225-LM 어댑터와 관련된 동결 또는 커널 관련 이상 현상을 겪지 않고 사용 가능한 최신 Linux 커널을 활용할 수 있습니다.**이미 I225-LM이 있는 NUC가 하나 있는 경우 권장되는 솔루션입니다(현재로서는)** _어댑터를 선택하면 잠재적인 대기 시간 또는 인터넷 속도 감소 측면에서 트레이드오프가 발생할 수 있습니다. 이 영향을 완화하려면 최소 1GB/s 이식성이 있는 어댑터를 선택하여 최적의 데이터 전송 속도를 유지하는 데 도움이 되도록 하는 것이 좋습니다._

**드라이버 및 소프트웨어 업데이트**: NUC 모델에 대한 공식 Intel® 지원 페이지를 참조하여 드라이버, 펌웨어 및 BIOS를 업데이트하는 것을 고려하십시오[여기](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). 여기에는 Intel 웹사이트의 최신 사용 가능한 지원 드라이버를 사용하거나 호환성 문제를 해결하는 BIOS 업데이트를 적용하는 것이 포함될 수 있습니다.

**Intel의 패치(Windows)**: Intel은 Windows 시스템에서 유사한 문제를 해결하기 위한 패치를 출시했습니다. 패치 자체는 **Linux 환경에 직접 적용되지 않을 수 있지만** Intel의 문제 인식과 솔루션 제공 노력을 강조합니다. 패치에 대한 자세한 내용은 이 [링크](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3)에서 찾을 수 있습니다.

기술은 발전하며 솔루션은 시간이 지남에 따라 변경될 수 있습니다. 특정 NUC 모델에 대해 Intel이 제공하는 최신 리소스를 공식 다운로드 [페이지](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads])에서 항상 최신 상태로 유지하십시오.

이러한 단계를 따르면 Intel® NUC 11세대 및 12세대 제품의 I225-LM ethernet 어댑터와 관련된 호환성 문제를 해결하여 서버 배포에서 더 원활하고 안정적인 경험을 보장할 수 있습니다. _이 어댑터를 사용하는 NUC 사용자의 일부는 문제가 발생하지 않았다고 보고했지만 특히 커널 업그레이드 후 **대다수의 사용자**가 문제를 겪었습니다. 특히 5.15.+ 커널은 I225-LM 어댑터를 사용하는 사람들에게 가장 안정적인 옵션으로 입증되었습니다. USB-C 어댑터를 사용하는 아이디어가 매력적이지 않고 무작위 동결의 위험을 감수할 의향이 있다면 더 큰 안정성을 입증한 **커널 버전을 유지**하는 것이 좋습니다._
:::

### Ken의 NUC8i5BEK

![](./images/Ken.jpg)

NUC8i5BEK는 8세대 프로세서가 탑재된 Intel 자체 NUC 중 하나입니다.
2018년에 출시된 이 모델은 쿼드 코어 i5-8259U CPU(2.30GHz), 2개의 DDR4 슬롯, SSD용 M.2 슬롯 및 USB 3.1 포트와 함께 제공됩니다.
일반적으로 약 20와트를 소비하지만 Discord 사용자 **Ken**은 정상 검증 중에 9와트로 최적화할 수 있었습니다.
모든 Execution 및 모든 Consensus 클라이언트를 처리할 수 있어 가볍고 효율적인 노드 머신에 탁월한 선택입니다.

Ken의 설정:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Fanless Case (optional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Total: $691 ~ $825**

Ken이 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

- _작은 크기와 공간, 전원 공급 장치는 전원 코드의 벽돌(노트북과 같음), 단일 보드 컴퓨터, x86 아키텍처, 낮은 구매 가격대, 낮은 전력 소비(~10W), 3년 보증 및 활성 제조 제품 라인(Intel)._
- _8세대는 충분히 빠르고 최신 세대 칩보다 낮은 가격대입니다._
- _팬이 없는(수동 냉각) 케이스로 업그레이드하여 NUC가 홈 오피스에 두기 때문에 완전히 조용합니다(0dB)(스톡 NUC는 이미 거의 조용합니다)._
- _게다가 팬 베어링의 기계적 마모가 없습니다._
- _이 하드웨어 플랫폼을 RP 노드로 사용하지 않기로 결정하면 재판매 또는 용도 변경 가치 - NUC는 훌륭한 워크스테이션 컴퓨터를 만듭니다._

### GreyWizard의 NUC10i7FNH

![](./images/GreyWizard.jpg)

NUC10i7FNH는 Intel 자체 NUC 중 또 다른 하나입니다.
이것은 10세대 프로세서를 자랑하며 2019년에 출시되었습니다.
6코어 i7-10710U CPU(1.10GHz, 4.7GHz로 부스트), 2개의 DDR4 슬롯, M.2 슬롯 및 SSD용 2.5" 슬롯, USB 3.1 포트와 함께 제공됩니다.
약 20와트의 전력을 소비합니다.
전력 소비와 크기를 고려할 때 엄청나게 강력한 머신입니다.
Discord 사용자 **GreyWizard**는 노드에 이 NUC를 사용합니다. 추가 전력은 Ethereum 2.0 체인의 미래가 무엇을 가져오든 그의 머신이 처리할 수 있다는 것을 알고 있는 마음의 평화를 제공합니다.

GreyWizard의 설정:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 ea.)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1068**

GreyWizard가 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

_저는 전체 크기와 오버헤드에 비해 뛰어난 성능의 최상의 조합처럼 느껴지기 때문에 i7 NUC를 선택했습니다.
Micro ATX 크기의 머신을 만드는 것과 같은 다른 옵션도 살펴봤습니다.
제가 찾고 있던 사양으로 가격을 책정한 후 이 Intel NUC는 거의 같은 가격이었고 폼 팩터는 정말 이기기 어렵습니다.
성능/마음의 평화를 위한 추가 여유 공간을 갖는 것을 좋아하며 이것이 거의 확실히 과도하다는 것을 인정합니다.
저는 staking을 심각한 투자로 간주하며 하드웨어가 충분한지 걱정하고 싶지 않습니다._

_이것을 옵션으로 고려하는 다른 사람들을 위한 팁..._

- _NUC는 노트북과 비슷한 온도로 꽤 따뜻하게 실행됩니다. CPU 온도가 걱정되고 강력한 것을 원한다면 Micro ATX와 같은 작은 데스크톱 설정을 살펴봐야 합니다._
- _공기 흐름을 위해 NUC 주변에 충분한 공간이 있는지 확인해야 합니다. 먼지 축적을 방지하기 위해 영역을 정기적으로 청소할 계획을 세우십시오._
- _RAM 카드의 호환성을 확인하십시오. 다른 NUC는 총 RAM, RAM 속도 등의 다양한 정도를 지원합니다._
- _NUC를 사용하는 경우 RAM을 선택할 때 성장할 수 있는 여지를 제공하는 것이 좋습니다... 예를 들어, 나중에 확장하고 싶다면 약간의 추가 비용을 지불하고 2x16 대신 단일 32gb RAM 카드를 구입하십시오(이 예에서 NUC가 64gb를 지원한다고 가정)_
- _논의하고 싶다면 Discord에서 저에게 연락하십시오._

### ArtDemocrat의 NUC10i5FNHN 빌드 프로세스 비디오

Greywizard의 설정 설명 및 팁을 보완하기 위해 ArtDemocrat은 NUC10 설정을 돕는 추가 도움 리소스로 이 빌드 프로세스 비디오를 만들었습니다(이 경우 NUC10i5FNHN이지만 빌드 프로세스는 NUC10i7FNH와 유사해야 합니다):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat의 설정:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17의 PN50

![](./images/PN50-actioncj17.jpg)

ASUS PN50은 Intel의 NUC 제품군과 많은 공통점이 있는 mini-PC입니다.
매우 작은 폼 팩터를 가지고 있지만 전체 PC의 모든 구성 요소와 기능을 갖추고 있습니다.
성능과 비용 사이의 균형을 맞출 수 있도록 AMD CPU를 선택할 수 있습니다(최대 8코어 Ryzen R7-4700U, 2.0GHz), 2개의 DDR4 슬롯, M.2 슬롯 및 SSD용 2.5" 슬롯, USB 3.1 포트와 함께 제공됩니다.
또한 90와트 전원 공급 장치와 함께 제공되지만 실제로 Rocket Pool 노드로 작동하는 동안 그만큼의 전력이 필요하지 않습니다.
Discord 사용자 **actioncj17**은 여러 가지 다른 설정을 시도했지만 PN50을 모든 것보다 선호합니다... 하지만 그들은 Rocket Pool 노드를 실행하는 데 과도하다는 것을 기꺼이 인정합니다.

Actioncj17의 설정:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1118**

actioncj17이 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

_Asus PN50을 선택한 이유에 대한 대답은 매우 간단합니다.
AMD의 Ryzen 7 4700U가 얼마나 멋진지 보고 싶었습니다.
실망하지 않았다고 말하겠습니다.
실제로 Intel NUC10FNK로 시작했습니다.
nuc에 32gb의 램과 1tb 970 evo plus nvme m.2를 넣었고 매우 빠릅니다.
nuc에 대한 불만이 없고 잘 작동하지만 PN50에서 더 많은 것을 얻습니다.
Rocketpool에서 staking하기 위해 두 설정 모두 과도하다고 말하지만 약간의 미래 보장은 해가 되지 않습니다.
둘 다 작은 공간을 차지하며 nuc는 팬이 없기 때문에 실제로 훨씬 조용합니다.
전반적으로 PN50은 손에 넣을 수 있다면 가격 대비 더 나은 가치입니다._

### Moralcompass의 Mini-PC

![](./images/moralcompass-minipc.jpg)

Discord 사용자 **moralcompass**는 actioncj17과 유사한 경로를 선택하여 mini-PC를 선택했지만 Intel CPU를 선호합니다.
그들은 쿼드 코어 i5 8250U(1.6GHz, 최대 3.4GHz로 부스트), 하나의 DDR4 슬롯, M.2 슬롯 및 SSD용 2.5" 슬롯, USB 3.0 포트를 자랑하는 mini PC를 사용합니다.
Moralcompass는 벽에서 약 10와트만 소비한다고 주장하며, 이는 이와 같은 mini PC가 매우 효율적임을 보여줍니다.
이 선택에 대한 흥미로운 점은 완전히 수동 냉각된다는 것입니다. 팬을 찾을 수 없습니다!
팬이 없는 mini PC의 많은 변형이 있지만 moralcompass는 자신에게 맞는 것을 찾았고 그것을 고수했습니다.

Moralcompass의 설정:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Total: $655**

moralcompass가 이 설정을 선택한 이유에 대한 의견은 다음과 같습니다:

- _움직이는 부품이 없고 소음이 없습니다._
- _듀얼 intel NIC(언젠가 이것을 라우터로 용도 변경하기로 결정하는 경우)_
- _NVME + SATA 슬롯(속도를 위해 NVME를 선호하고 더 높은 TBW 내구성 옵션. SATA는 HDD 또는 SSD 옵션을 제공합니다. M.SATA 인터페이스는 이러한 SSD가 레거시로 전환되는 것처럼 보이기 때문에 피했습니다)_
- _UPS의 정상적인 종료 신호를 위해 사용 가능한 USB 및 직렬 포트_
