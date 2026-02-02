# Selecionando Hardware para Staking

Não existem especificações oficiais para executar um nó Rocket Pool.
Esta página oferece algumas diretrizes e exemplos que você pode usar para selecionar hardware para staking.

Os requisitos mínimos de hardware do seu nó dependerão dos clientes Consensus e Execution que você escolher.
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

### Servidor do Xer0

![](./images/Xer0.jpg)

O usuário do Discord **Xer0** está entre os muitos stakers que optaram por ir com um fator de forma de PC convencional para sua máquina de staking.
Eles queriam construir um equipamento que durasse anos e anos com manutenção e atualizações mínimas necessárias, enquanto ainda ofereciam personalização completa de cada componente.
Para esse fim, Xer0 projetou e construiu um servidor ATX completo - muito parecido com um PC de mesa tradicional, mas direcionado exclusivamente para staking em Ethereum.
Sua configuração inclui um Xeon Bronze 3204 de seis núcleos (1.9 GHz), 8 slots DDR4 e um slot M.2... embora, como isso é essencialmente uma construção de servidor doméstico, os componentes exatos são completamente escolhidos pelo usuário final.

Configuração do Xer0:

- Placa-mãe: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Case: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Cooler: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Total: $1680**

Aqui estão os comentários do Xer0 sobre por que eles escolheram esta configuração:

_Obviamente não há necessidade de construir uma monstruosidade simplesmente para fazer staking na rede Ethereum, mas eu tenho algumas razões pelas quais construí algo assim._

1. _Agora eu acredito que 1 ou mais validators no futuro valerão muito mais do que o que estamos vendo agora, então eu queria comprar algo que será capaz de suportar a rede por pelo menos os próximos 10-20 anos sem problemas._
1. _Ao criar uma máquina que tem tantos núcleos, também me dei muito mais espaço ao ponto de eu poder executar um agregador L2 em cima disso sem problemas (em relação ao hardware) e qualquer outra coisa que eu queira executar em um servidor._ :)
1. _Eu gosto de construir computadores, então eu construí..._
1. _Com uma construção de servidor, me dá muito mais flexibilidade com hardware e recursos que a maioria dos computadores não tem nativamente._
1. _Um pouco de prova de futuro (só por precaução)_ :wink:

### Prateleira do Darcius

![](./images/Darcius.jpg)

O fundador do Rocket Pool, David Rugendyke (conhecido no Discord como **darcius**), passou muito tempo aperfeiçoando seu nó.
Após algum debate, ele construiu um Mini-ITX que é pequeno e portátil, mas ainda tem uma enorme quantidade de poder de processamento.
Seu equipamento inclui um Ryzen 7 5800x de 8 núcleos (3.8 GHz), dois slots DDR4 e dois slots M.2 para SSDs NVMe.
É verdadeiramente um dos equipamentos de maior desempenho dos nós Rocket Pool, mas com boas razões: darcius executa um tipo especial de nó Rocket Pool chamado Oracle Node, que retransmite informações da Beacon chain de volta para a Execution chain sobre todos os validators Rocket Pool.
Com milhares de minipools Rocket Pool ativos para observar, esse trabalho requer muita potência... mas seu equipamento de prateleira está facilmente à altura da tarefa.

Configuração do Darcius:

- Placa-mãe: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Case: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Total: $1587**

### Build microATX do Yorick

![](./images/Yorick-stock.jpg)

O entusiasta de hardware veterano **YorickDowne** tem muita experiência construindo e mantendo servidores.
Usando esse conhecimento, ele se estabeleceu em uma configuração microATX flexível.
Sua máquina é consideravelmente menor do que um PC típico, mas ainda consegue acomodar tecnologia de nível de servidor que maximiza resiliência e tempo de atividade - métricas-chave ao executar um nó Rocket Pool.
Ele tem recomendações para configurações Intel e AMD, que você pode encontrar [em seu site](https://eth-docker.net/docs/Usage/Hardware).
A versão Intel usa um i3-9100F quad core (3.6 GHz) ou uma CPU Xeon, e a versão AMD sugere qualquer CPU Ryzen que suporte memória ECC.
Para ambas as configurações, ele sugere 16 GB de RAM ECC e um SSD NVMe de 1 TB.

Configuração do Yorick:

- Placa-mãe: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Case: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Qualquer (exemplo: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Ventiladores do case: Qualquer
- **Total: Cerca de $886**

Aqui estão os comentários do Yorick sobre por que ele escolheu esta configuração:

- _Está no mesmo custo ou inferior a alguns NUCs_
- _Tem RAM ECC, o que significa que se a memória falhar - o que acontece de vez em quando - eu saberei, porque o sistema me dirá. Não tenho que executar memtest87 por 4-5 dias para descobrir se meu problema com instabilidade é mesmo relacionado à memória. Eu protejo meu tempo ferozmente para que eu possa gastá-lo pontificando no Discord em vez de resolver problemas de hardware_
- _Tem IPMI, que é gerenciamento remoto via Ethernet/navegador de toda a máquina, incluindo UEFI e ciclo de energia. Devo ter permissão para ir em férias prolongadas e ainda ter acesso remoto completo._
- _Se eu quiser armazenamento redundante para que eventual falha de SSD seja um não-evento, eu posso fazer isso_
- _Permite grande flexibilidade nas escolhas de construção. Posso escolher quanta RAM e computação eu quero; posso optar por executar um NAS com tecnologia de virtualização como TrueNAS Scale e executar o nó lá junto com algumas outras coisas de servidor doméstico._

### Laptop do Drez

![](./images/Drez.jpg)

Às vezes, gastar em novo hardware simplesmente não faz sentido.
No caso do usuário do Discord **Drez**, executar um nó Rocket Pool é um desses momentos.
Drez tinha um laptop sobressalente por aí e o transformou em um nó com facilidade.
Sua máquina vem com um i7-4710HQ quad core (2.5 GHz), dois slots DDR3 e um slot SATA de 2.5".
Sendo um laptop, também vem com sua própria bateria (o que compensa a necessidade de um UPS).
Eles adicionaram algumas atualizações adicionais ao longo do tempo, dando ao laptop ainda mais potência para tranquilidade extra.

Configuração do Drez:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Incluído)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Total: $1910**

Aqui estão os comentários do Drez sobre por que eles escolheram esta configuração:

_A principal razão pela qual vou fazer staking neste laptop é porque eu já tinha um sobressalente e não preciso gastar dinheiro extra em um novo servidor.
Gosto de sua mobilidade, compacticidade, tela embutida para monitoramento fácil.
Em caso de superaquecimento, comprei uma base de resfriamento para laptop e cooler de CPU sobressalente, só por precaução, também recomendo trocar a pasta térmica, especialmente se você vai executar em uma máquina mais antiga_

## NUCs (Next Unit of Computing) e Mini-PCs

Executar um nó Rocket Pool não requer necessariamente um desktop completo que você constrói.
Na verdade, uma das configurações mais populares entre os stakers é o ilustre NUC.
Um NUC (Next Unit of Computing) é essencialmente um computador pequeno e autocontido que é projetado em torno de uso muito baixo de energia e máxima eficiência.
NUCs são ótimos para a maioria dos stakers que executam apenas alguns validators por causa de sua baixa manutenção, baixos custos mensais de funcionamento e facilidade de configuração.
Ao contrário dos PCs, NUCs vêm pré-montados em um case; tudo o que você precisa fazer é adicionar alguma RAM, adicionar um SSD e você está pronto!
Abaixo estão alguns exemplos de configurações de NUC que alguns veteranos do Rocket Pool usam e recomendam.

::: tip NOTA
**Compatibilidade do Adaptador Ethernet**

Se você está planejando comprar um Intel® NUC 11ª ou 12ª Geração, pode encontrar problemas de conectividade com o adaptador ethernet, especificamente se o adaptador for identificado como **I225-LM** (Verifique as especificações da Intel antes de comprar).
Se você já tem um, há etapas que você pode tomar para resolver essa preocupação.
O adaptador I225-LM tem sido associado a certos desafios de compatibilidade que podem levar a **congelamentos do sistema** e comportamento inesperado do kernel, particularmente ao usar kernels Linux.

Para determinar se seu NUC emprega o adaptador ethernet I225-LM problemático, você pode usar o seguinte comando no terminal:

```shell
sudo lshw -class network | grep 225
```

Se a saída confirmar a presença do adaptador I225-LM, você pode experimentar os problemas mencionados. No entanto, existem _remédios_ que você pode aplicar para mitigar esses problemas:

**Adaptador USB-C para Ethernet**: Uma solução viável envolve adquirir um adaptador USB-C para Ethernet e conectar seu cabo de internet através deste adaptador externo. Embora essa abordagem exija hardware e configuração adicionais, ela provou ser eficaz na resolução dos conflitos de compatibilidade. Isso permite que você utilize os kernels Linux mais recentes disponíveis sem encontrar os congelamentos ou anomalias relacionadas ao kernel associadas ao adaptador I225-LM.**Esta é a solução recomendada (por enquanto) se você já tem um NUC com o I225-LM** _Tenha em mente que optar por um adaptador pode introduzir uma compensação em termos de latência potencial ou velocidade de internet reduzida. Para mitigar esse impacto, é aconselhável selecionar um adaptador com pelo menos 1GB/s de portabilidade, ajudando assim a manter taxas ideais de transferência de dados._

**Atualizações de Driver e Software**: Considere atualizar seus drivers, firmware e BIOS consultando a página oficial de suporte da Intel® para seu modelo de NUC [aqui](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). Isso pode incluir o uso do driver de suporte mais recente disponível no site da Intel ou aplicação de atualizações de BIOS que abordam preocupações de compatibilidade.

**Patch da Intel (Windows)**: A Intel lançou um patch para resolver um problema semelhante em sistemas Windows. Embora o patch em si **possa não se aplicar diretamente a ambientes Linux**, ele destaca o reconhecimento do problema pela Intel e seus esforços para fornecer soluções. Você pode encontrar mais detalhes sobre o patch neste [link](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3).

Tenha em mente que a tecnologia evolui e as soluções podem mudar ao longo do tempo. Sempre fique atualizado com os recursos mais recentes fornecidos pela Intel para seu modelo NUC específico em sua página oficial de Downloads [aqui](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads]).

Seguindo essas etapas, você pode resolver os desafios de compatibilidade associados ao adaptador ethernet I225-LM em produtos Intel® NUC 11ª e 12ª Geração, garantindo uma experiência mais suave e confiável com sua implantação de servidor. _Embora um subconjunto de usuários de NUC com este adaptador tenha relatado não ter problemas, é importante notar que a **maioria dos usuários**, particularmente após uma atualização de kernel, encontraram problemas. Notavelmente, os kernels 5.15.+ provaram ser a opção mais estável para aqueles que usam o adaptador I225-LM. Se a ideia de usar um adaptador USB-C não é atraente e você está disposto a correr o risco de congelamentos aleatórios potenciais, é aconselhável **permanecer em uma versão de kernel que demonstrou maior estabilidade**._
:::

### NUC8i5BEK do Ken

![](./images/Ken.jpg)

O NUC8i5BEK é um dos próprios NUCs da Intel com um processador de 8ª geração.
Lançado em 2018, este modelo vem com uma CPU i5-8259U quad-core (2.30 GHz), dois slots DDR4, um slot M.2 para SSDs e portas USB 3.1.
Normalmente consome cerca de 20 watts, mas o usuário do Discord **Ken** conseguiu otimizá-lo para 9 watts durante a validação normal.
É mais do que capaz de lidar com qualquer cliente Execution e qualquer cliente Consensus, tornando-o uma excelente escolha para uma máquina de nó leve e eficiente.

Configuração do Ken:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Case sem ventilador (opcional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Total: $691 a $825**

Aqui estão os comentários do Ken sobre por que ele escolheu esta configuração:

- _Tamanho e pegada pequenos, a fonte de alimentação é um tijolo no cabo de energia (como um laptop), computador de placa única, arquitetura x86, ponto de preço de compra baixo, baixo consumo de energia (~10W), garantia de 3 anos e uma linha de produtos de fabricação ativa (Intel)._
- _As 8ª gerações são muito rápidas e a um preço mais baixo do que os chips de geração mais recentes._
- _Eu atualizei para um case sem ventilador (refrigerado passivamente), então o NUC é absolutamente silencioso (0 dB) já que estou deixando em meu escritório doméstico (um NUC padrão já é quase silencioso)._
- _Além disso, sem desgaste mecânico nos rolamentos do ventilador._
- _Valor de revenda ou reutilização se eu decidir aposentar esta plataforma de hardware como meu nó RP - NUCs fazem um ótimo computador de estação de trabalho._

### NUC10i7FNH do GreyWizard

![](./images/GreyWizard.jpg)

O NUC10i7FNH é outro dos próprios NUCs da Intel.
Este apresenta um processador de 10ª geração e foi lançado em 2019.
Vem com uma CPU i7-10710U de seis núcleos (1.10 GHz, boost para 4.7 GHz), dois slots DDR4, um slot M.2 e um slot de 2.5" para SSDs e portas USB 3.1.
Consome cerca de 20 watts de energia.
É uma máquina incrivelmente poderosa, dado seu consumo de energia e tamanho.
O usuário do Discord **GreyWizard** usa este NUC para seu nó - a potência extra lhe dá tranquilidade sabendo que não importa o que o futuro da cadeia Ethereum 2.0 reserve, sua máquina será capaz de lidar com isso.

Configuração do GreyWizard:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 cada)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1068**

Aqui estão os comentários do GreyWizard sobre por que ele escolheu esta configuração:

_Eu fui com o NUC i7 principalmente porque parecia a melhor combinação de desempenho excepcional em relação ao tamanho geral e sobrecarga.
Também olhei para outras opções como construir uma máquina de tamanho Micro ATX.
Depois de precificar uma com as especificações que eu estava procurando, este Intel NUC acabou sendo aproximadamente o mesmo preço, e o fator de forma é realmente difícil de superar.
Gosto de ter espaço extra para desempenho/tranquilidade, e reconheço que isso é quase certamente exagero.
Considero staking como um investimento sério e não quero me preocupar se meu hardware será suficiente._

_Dicas para outras pessoas considerando isso como uma opção..._

- _O NUC funciona muito quente, temperaturas semelhantes a um laptop. Se você se preocupa com a temperatura da CPU e quer algo poderoso, então você deve olhar para configurações de desktop pequenas como Micro ATX._
- _Você vai querer ter certeza de que há muito espaço ao redor do seu NUC para fluxo de ar. Planeje limpar a área regularmente para evitar acúmulo de poeira._
- _Certifique-se de verificar a compatibilidade para seus cartões de RAM. Os diferentes NUCs suportam graus variados de RAM total, velocidades de RAM, etc._
- _Se você for com o NUC, eu sugeriria que você se dê espaço para crescer ao selecionar RAM... Por exemplo, gaste um pouco mais e obtenha um único cartão de RAM de 32gb em vez de 2x16 para que você possa expandir mais tarde se quiser (assumindo que seu NUC suportará 64gb neste exemplo)_
- _Sinta-se à vontade para entrar em contato comigo no Discord se quiser discutir._

### Vídeo do Processo de Construção do NUC10i5FNHN do ArtDemocrat

Para complementar as descrições e dicas de configuração do Greywizard, ArtDemocrat criou este vídeo do processo de construção como um recurso de ajuda adicional para configurar um NUC10 (neste caso um NUC10i5FNHN, mas o processo de construção deve ser semelhante para um NUC10i7FNH):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

Configuração do ArtDemocrat:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### PN50 do Actioncj17

![](./images/PN50-actioncj17.jpg)

O ASUS PN50 é um mini-PC, que compartilha muito em comum com a família NUC da Intel.
Tem um fator de forma muito pequeno, mas tem todos os componentes e recursos de um PC completo.
Vem com sua escolha de CPU AMD para que você possa equilibrar entre desempenho e custo (até um Ryzen R7-4700U de 8 núcleos a 2.0 GHz), dois slots DDR4, um slot M.2 e um slot de 2.5" para SSDs e portas USB 3.1.
Também vem com uma fonte de alimentação de 90 watts, embora na prática não exija tanta energia enquanto atua como um nó Rocket Pool.
O usuário do Discord **actioncj17** tentou várias configurações diferentes, mas prefere o PN50 acima de tudo... embora eles admitam felizmente que é exagero para executar um nó Rocket Pool.

Configuração do Actioncj17:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1118**

Aqui estão os comentários do actioncj17 sobre por que eles escolheram esta configuração:

_Minha resposta para por que escolhi o Asus PN50 é bastante simples.
Eu queria ver quão incrível o Ryzen 7 4700U da AMD era.
Vamos apenas dizer que não estou desapontado.
Na verdade, comecei com o Intel NUC10FNK.
Coloquei 32gb de ram e 1tb 970 evo plus nvme m.2 no nuc e ele é rápido.
Não tenho reclamações do nuc e funciona bem, mas obtenho mais do meu PN50.
Eu diria que ambas as configurações são exagero para staking no Rocketpool, mas um pouco de prova de futuro não machuca.
Ambos têm pegadas pequenas e o nuc é na verdade muito mais silencioso, pois não tem ventilador.
No geral, o PN50 é um melhor custo-benefício se você puder colocar as mãos em um._

### Mini-PC do Moralcompass

![](./images/moralcompass-minipc.jpg)

O usuário do Discord **moralcompass** seguiu um caminho semelhante ao actioncj17 ao selecionar um mini-PC, mas sua preferência é por uma CPU Intel.
Eles usam um mini PC que apresenta um i5 8250U quad core (1.6 GHz, boost até 3.4 GHz), um slot DDR4, um slot M.2 e um slot de 2.5" para SSDs e portas USB 3.0.
Moralcompass afirma que consome apenas cerca de 10 watts da tomada, o que demonstra que mini PCs como este são muito eficientes.
A coisa interessante sobre esta escolha é que é completamente refrigerado passivamente - sem ventiladores!
Embora existam muitas variações de mini PCs sem ventilador, moralcompass encontrou um que funcionou para eles e permaneceu com ele.

Configuração do Moralcompass:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Total: $655**

Aqui estão os comentários do moralcompass sobre por que eles escolheram esta configuração:

- _Sem partes móveis, sem ruído._
- _NIC Intel dupla (caso eu decida realocar isso como meu roteador um dia)_
- _Slots NVME + SATA (prefiro NVME pela velocidade e opções com maior resistência TBW. SATA dá opção de HDD ou SSD. Evitei interfaces M.SATA porque esses SSDs parecem estar se tornando legados)_
- _Portas USB e serial disponíveis para sinal de desligamento gracioso do UPS_
