# Selecionando Hardware para Staking

Não existem especificações oficiais para executar um node Rocket Pool.
Esta página oferece algumas diretrizes e exemplos que você pode usar para selecionar hardware para staking.

Os requisitos mínimos de hardware do seu node dependerão dos clientes de Consensus e Execution que você escolher.
Se, por exemplo, você pretende executar seu node em um dispositivo de baixa potência, você pode estar limitado a usar `Geth` como seu cliente de Execution e `Nimbus` como seu cliente de Consensus.
Se você está usando um NUC mais poderoso com 32+ GB de RAM, todas as combinações de clientes estão abertas para você.

As diretrizes abaixo assumem que você quer um nível **confortável** de hardware, o que significa que você tem capacidade excedente.
Se você manter essas diretrizes em mente, seu node terá recursos abundantes para executar qualquer uma das combinações de clientes suportadas pelo Rocket Pool.
Isso permitirá que você escolha um par de clientes `random`, o que é muito importante para a diversidade de clientes na rede Ethereum.

::: tip NOTA
Staking em Ethereum é muito tolerante.
Se sua casa inundar e seu dispositivo de staking queimar, não há grande penalidade por levar uma semana para voltar a funcionar (a menos que você esteja em um comitê de sincronização, o que é um evento muito raro).
Falha de componentes pode acontecer em algum momento, mas não se estresse com isso.
Tempo de inatividade não faz você ser slashed a menos que você esteja offline durante uma grande interrupção de toda a rede Ethereum.
:::

## Requisitos de Hardware

Validadores Ethereum não são muito caros computacionalmente, o que quer dizer que uma vez que seus clientes de Execution e Consensus estão rodando, qualquer validador adicional usará **uma quantidade muito pequena de recursos adicionais**.
Isso aumenta até 64 validadores, ponto em que os recursos necessários para adicionar um 65º validador e além são negligenciáveis.

Na nossa experiência, a maioria das configurações, incluindo mini-PCs e NUCs, são capazes de executar um número efetivamente ilimitado de validadores.

### Requisitos de CPU

**Diretriz: qualquer CPU moderna com pelo menos 4 threads.**

Executar um node Rocket Pool não é muito intensivo computacionalmente.
O maior impacto da CPU é quão rápido seu node pode sincronizar inicialmente o estado da blockchain quando você o cria pela primeira vez (ou se você mudar de clientes mais tarde).
Após a sincronização inicial, a CPU não é usada tão intensamente.

A nomenclatura de CPU pode ser enganosa; um Intel Core i5 de 2010 é geralmente **menos poderoso** que um core i3 de 2022.
Muitos membros da comunidade usam dispositivos Intel NUC por causa de seu fator de forma pequeno, mas um NUC i5 antigo pode ser uma escolha pior que um i3 novo.
Por essa razão, recomendamos usar uma CPU "moderna" que tenha, no máximo, alguns anos.
Mais especificamente, **para CPUs baseadas em x64**, recomendamos uma CPU que suporte a extensão [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) - verifique as especificações do fabricante para sua CPU para ver se é suportada.
Nem todas as CPUs modernas suportam isso; por exemplo, CPUs Celeron tendem a não incluí-la.

CPUs baseadas em ARM (como o Mac M1 ou M2, ou o Rock 5B) não se aplicam à extensão BMI2 acima.

::: tip NOTA
Se você está interessado em usar um NUC, você pode dizer quão moderno o NUC é pelo seu número de modelo.
Eles são formatados como `NUC` + `número de geração` + `modelo` + `tipo de CPU` + `sufixo`.
Por exemplo, uma unidade `NUC11PAHi50Z` é uma unidade i5 de 11ª geração.
Você pode ver uma lista de NUCs [aqui](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) no site da Intel.

Outros mini-PCs, como o Asus PN50 ou PN51, não seguem essa convenção, mas informações sobre qual CPU é usada por eles devem estar incluídas nas páginas de seus produtos.
:::

A quantidade de núcleos em uma CPU é menos relevante que seu **número de threads**.
Recomendamos um **mínimo de 4 threads** para operação de node Rocket Pool.
Uma CPU de 2 núcleos com 4 threads funcionará sem problemas.
É raro encontrar uma CPU com apenas 2 threads.

### Requisitos de RAM

**Diretriz: pelo menos 16 GB de RAM, 32 GB preferível, DDR4 preferível**

Nodes Rocket Pool podem operar com apenas 16 GB de RAM.
Geralmente recomendamos ter um pouco mais para oferecer alguma margem e suporte completo para clientes pesados em RAM como Teku.
Um benefício adicional de mais RAM é que você pode fornecer um tamanho de cache maior para o cliente de Execution, o que tende a desacelerar a taxa de uso do seu espaço em disco.

### Requisitos de SSD

**Diretriz: um SSD de 2+ TB que tenha TLC ou melhor, com cache DRAM. NVMe preferível.**

Este elemento é mais importante do que a maioria das pessoas espera.
O cliente de Execution depende muito de IOPS, ou "operações por segundo"; recomendamos 15k Read IOPS e 5k Write IOPS
Na prática, isso significa que:

- Discos HDD (prato giratório) não funcionarão
- SSDs SATA ou USB 3.0+ externos _podem_ funcionar
- Discos SSD NVMe são preferidos

Se você já tem um SSD que quer usar e quer ter certeza de que ele tem desempenho suficiente para operação de node.

_\* Se você não tem certeza se seu disco atende a esses requisitos de desempenho, `fio` é uma boa maneira de testá-los.
Veja [aqui](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/) para instruções Linux,
e [aqui](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) para instruções MacOS._

:::tip NOTA
A seleção de SSD pode ser uma escolha complexa!

O método que os SSDs usam para armazenar dados em seus chips flash tem um impacto perceptível na velocidade e longevidade.
Ao comprar um SSD, você pode notar rótulos como `QLC`, `TLC` ou `SLC`.
Estes representam a quantidade de dados contidos em uma única célula do chip flash: `Q` para "quad" significa 4, `T` para "triple" significa 3, `M` para "multi" significa 2, e `S` para "single" significa 1.

Recomendamos discos **TLC, MLC ou SLC**.
**Não recomendamos discos QLC** devido ao seu desempenho mais lento e menor confiabilidade total.

SSDs vêm com ou sem DRAM, que é um elemento de hardware que torna o acesso a dados no SSD mais eficiente.
Aqueles com DRAM são mais rápidos, mas aqueles sem DRAM são mais baratos.
No entanto, DRAM é bastante importante para fornecer operação suave do node.

Recomendamos um disco com cache **DRAM**.
**Não recomendamos discos sem DRAM**.
:::

A consideração final é o tamanho do disco.
A partir de 10/2024, o tamanho do banco de dados do cliente de execution `geth` requer cerca de 1.2TB de espaço após concluir sua sincronização inicial (ou após você ter acabado de fazer o prune dele).
Isso crescerá constantemente ao longo do tempo, e embora o pruning possa recuperar parte desse espaço, o estado recém-limpo _cresce_ ao longo do tempo.
Você terá paz de espírito com um disco maior.

### Acessórios Comuns

Muitos operadores de node melhoram suas configurações além dos requisitos mínimos.
Algumas adições comuns incluem:

- Dissipadores de calor para SSD para estender a vida útil do disco
- Fontes de alimentação ininterruptas (UPS) em caso de quedas de energia
- Um node de backup para ter um backup caso algo falhe

Todos estes são convenientes de ter, mas não são necessários para executar um node Rocket Pool.

## Exemplos de Configurações

Nesta seção, mostraremos alguns dos vários builds que a comunidade do Rocket Pool criou para si mesma.
Eles são exemplos do que as pessoas estão usando, não recomendações de como você deve executar sua configuração.
Note que muitos estão um pouco desatualizados e, por exemplo, usam SSDs que agora são muito pequenos.

### Xer0's Server

![](./images/Xer0.jpg)

Discord user **Xer0** is among the many stakers that opted to go with a conventional PC form factor for their staking machine.
They wanted to build a rig that would last for years and years to come with minimal maintenance and upgrading required, while still offering complete customization of every component.
To that end, Xer0 devised and built a full ATX server - much like a traditional desktop PC, but targeted exclusively at staking on Ethereum.
Their setup includes a six-core Xeon Bronze 3204 (1.9 GHz), 8 DDR4 slots, and an M.2 slot... though since this is essentially a home server build, the exact components are completely up to the end user.

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

Rocket Pool's founder David Rugendyke (known on Discord as **darcius**) spent a long time perfecting his node.
After some debate, he built a Mini-ITX that's small and portable, but still packs an enormous amount of processing power.
His rig includes an 8-core Ryzen 7 5800x (3.8 GHz), two DDR4 slots, and two M.2 slots for NVMe SSDs.
It is truly one of the most high-performance rigs of the Rocket Pool nodes, but with good reason: darcius runs a special type of Rocket Pool node called an Oracle Node, which relays information from the Beacon chain back to the Execution chain about all of the Rocket Pool validators.
With thousands of Rocket Pool minipools active to watch, that job takes a lot of horsepower... but his shelf rig is easily up to the task.

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

Veteran hardware enthusiast **YorickDowne** has a lot of experience building and maintaining servers.
Using that knowledge, he has settled on a flexible microATX setup.
His machine is considerably smaller than a typical PC, but still manages to fit in server-grade technology that maximizes resilience and uptime - key metrics when running a Rocket Pool node.
He has recommendations for both Intel and AMD setups, which you can find [on his website](https://eth-docker.net/docs/Usage/Hardware).
The Intel version uses a quad core i3-9100F (3.6 GHz) or a Xeon CPU, and the AMD version suggests any Ryzen CPU that supports ECC memory.
For both configurations, he suggests 16 GB of ECC RAM, and a 1 TB NVMe SSD.

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

Sometimes, shelling out for new hardware just doesn't make sense.
In Discord user **Drez**'s case, running a Rocket Pool node is one of those times.
Drez happened to have a spare laptop lying around, and they turned it into a node with ease.
Their machine comes with a quad core i7-4710HQ (2.5 GHz), two DDR3 slots, and a 2.5" SATA slot.
Being a laptop, it also comes with its own battery (which offsets the need for a UPS).
They added some additional upgrades over time, giving the laptop even more power for extra peace of mind.

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

Running a Rocket Pool node doesn't necessarily require a complete build-it-yourself desktop.
In fact, one of the most popular setups among stakers is the illustrious NUC.
A NUC (Next Unit of Computing) is essentially a small, self-contained computer that is designed around very low power usage and maximum efficiency.
NUCs are great for most stakers that only run a few validators because of their low maintenance, low monthly running costs, and ease of setup.
Unlike PCs, NUCs come preassembled in a case; all you need to do is add some RAM, add an SSD, and you're up and running!
Below are a few examples of NUC setups that some Rocket Pool veterans use and recommend.

::: tip NOTE
**Ethernet Adaptor Compatibility**

If you're planning to buy an Intel® NUC 11th or 12th Generation you can encounter connectivity issues with the ethernet adaptor, specifically if the adaptor is identified as **I225-LM** (Check intel especifications before buying).
If you already have one, there are steps you can take to address this concern.
The I225-LM adaptor has been associated with certain compatibility challenges that may lead to **system freezes** and unexpected kernel behavior, particularly when using Linux kernels.

To determine if your NUC employs the problematic I225-LM ethernet adaptor, you can use the following command in the terminal:

```shell
sudo lshw -class network | grep 225
```

If the output confirms the presence of the I225-LM adaptor, you might experience the mentioned issues. However, there are _remedies_ you can apply to mitigate these problems:

**USB-C to Ethernet Adaptor**: A viable solution involves acquiring a USB-C to Ethernet adaptor and connecting your internet cable through this external adaptor. While this approach requires additional hardware and configuration, it has proven effective in resolving the compatibility conflicts. This allows you to utilize the latest available Linux kernels without encountering the freezing or kernel-related anomalies associated with the I225-LM adaptor.**This is the recommended solution (for now) if you already have one NUC with the I225-LM** _Keep in mind that opting for an adaptor may introduce a trade-off in terms of potential latency or reduced internet velocity. To mitigate this impact, it's advisable to select an adaptor with at least 1GB/s portability, thereby helping maintain optimal data transfer rates._

**Driver and Software Updates**: Consider updating your drivers, firmware, and BIOS by referring to the official Intel® support page for your NUC model [here](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). This might include using the latest available support driver from Intel's website or applying BIOS updates that address compatibility concerns.

**Intel's Patch (Windows)**: Intel has released a patch to address a similar issue on Windows systems. While the patch itself **may not directly apply to Linux environments**, it highlights the recognition of the problem by Intel and their efforts to provide solutions. You can find more details about the patch in this [link](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3).

Keep in mind that technology evolves, and solutions might change over time. Always stay updated with the latest resources provided by Intel for your specific NUC model on their official Downloads [page](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads]).

By following these steps, you can address the compatibility challenges associated with the I225-LM ethernet adaptor on Intel® NUC 11th and 12th Generation Products, ensuring a smoother and more reliable experience with your server deployment. _While a subset of NUC users with this adaptor have reported experiencing no issues, it's important to note that the **majority of users**, particularly after a kernel upgrade, have encountered problems. Notably, the 5.15.+ kernels have proven to be the most stable option for those using the I225-LM adaptor. If the idea of using a USB-C adaptor isn't appealing and you're willing to take the risk of potential random freezes, it's advisable to **remain on a kernel version that has demonstrated greater stability**._
:::

### Ken's NUC8i5BEK

![](./images/Ken.jpg)

The NUC8i5BEK is one of Intel's own NUCs with an 8th-generation processor.
Released in 2018, this model comes with a quad-core i5-8259U CPU (2.30 GHz), two DDR4 slots, an M.2 slot for SSDs, and USB 3.1 ports.
It normally draws about 20 watts, but Discord user **Ken** has been able to optimize it down to 9 watts during normal validation.
It is more than capable of handling any Execution and any Consensus client, making it an excellent choice for a lightweight, efficient node machine.

Ken's Setup:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Fanless Case (optional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Total: $691 to $825**

Here are Ken's comments on why he chose this setup:

- _Small size and footprint, the power supply is a brick on the power cord (like a laptop), single-board computer, x86 architecture, low purchase price point, low power consumption (~10W), 3-year warranty, and an active manufacture product line (Intel)._
- _8th generations are plenty fast and at a lower price point than the latest generation chips._
- _I upgraded to a fan-less (passively cooled) case, so the NUC is absolutely silent (0 dB) as I’m leaving it my home office (a stock NUC is near silent already)._
- _Plus no mechanical wear on the fan bearings._
- _Resale or re-purpose value if I decide to retire this hardware platform as my RP node - NUC’s make a great workstation computer._

### GreyWizard's NUC10i7FNH

![](./images/GreyWizard.jpg)

The NUC10i7FNH is another one of Intel's own NUCs.
This one sports a 10th-generation processor, and was released in 2019.
It comes with a six core i7-10710U CPU (1.10 GHz, boosts to 4.7 GHz), two DDR4 slots, an M.2 slot and a 2.5" slot for SSDs, and USB 3.1 ports.
It draws about 20 watts of power.
It is an incredibly powerful machine, given its power consumption and size.
Discord user **GreyWizard** uses this NUC for his node - the extra power gives him peace of mind knowing that no matter what the future of the Ethereum 2.0 chain holds, his machine will be able to handle it.

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

To complement Greywizard's setup descriptions and tips, ArtDemocrat created this build process video as an additional help resource to set up a NUC10 (in this case a NUC10i5FNHN, but the build process should be similar for a NUC10i7FNH):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

ArtDemocrat's Setup:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### Actioncj17's PN50

![](./images/PN50-actioncj17.jpg)

The ASUS PN50 is a mini-PC, which shares a lot in common with Intel's NUC family.
It has a very small form factor but has all the components and features of a full PC.
It comes with your choice of AMD CPU so you can balance between performance and cost (up to an 8-core Ryzen R7-4700U at 2.0 GHz), two DDR4 slots, an M.2 slot and a 2.5" slot for SSDs, and USB 3.1 ports.
It also comes with a 90 watt power supply, though in practice it doesn't require that much power while acting as a Rocket Pool node.
Discord user **actioncj17** has tried several different setups, but prefers the PN50 over everything... though they happily admit that it's overkill for running a Rocket Pool node.

Actioncj17's Setup:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1118**

Here are actioncj17's comments on why they chose this setup:

_My answer to why I chose the Asus PN50 is quite simple.
I wanted to see how badass AMD's Ryzen 7 4700U was.
Let’s just say I’m not disappointed.
I actually started with the Intel NUC10FNK.
I put 32gb of ram and 1tb 970 evo plus nvme m.2 in the nuc and it blazes.
I have no complaints with the nuc and it works fine but I get more out of my PN50.
I’d say both setups are overkill for staking on Rocketpool but a little future proofing doesn’t hurt.
They both have small footprints and the nuc is actually much quieter since it is fanless.
All in all the PN50 is a better bang for your buck if you can get your hands on one._

### Moralcompass's Mini-PC

![](./images/moralcompass-minipc.jpg)

Discord user **moralcompass** went a similar route to actioncj17 by selecting a mini-PC, but their preference is for an Intel CPU.
They use a mini PC that sports a quad core i5 8250U (1.6 GHz, boost up to 3.4 GHz), one DDR4 slot, an M.2 slot and a 2.5" slot for SSDs, and USB 3.0 ports.
Moralcompass claims that it only pulls about 10 watts from the wall, which demonstrates that mini PCs like this are very efficient.
The interesting thing about this choice is that it is completely passively cooled - no fans to be found!
While there are many variations of fanless mini PCs, moralcompass found one that worked for them and has stuck with it.

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
