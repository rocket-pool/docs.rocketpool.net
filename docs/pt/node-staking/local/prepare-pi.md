# Preparando um Raspberry Pi

::: warning NOTA
Esta página foi deixada aqui para fins de arquivo. Não recomendamos mais executar o Rocket Pool em um Raspberry Pi devido aos
requisitos aumentados de hardware e desempenho de executar um validador Ethereum.
:::

Este guia irá orientá-lo sobre como executar um node Rocket Pool usando um Raspberry Pi.
Embora isso não seja normalmente recomendado na maioria dos guias de staking, reconhecemos que é atraente porque é uma opção muito mais acessível do que montar um PC completo.
Para isso, trabalhamos arduamente para ajustar e otimizar uma série de configurações e determinamos uma configuração que parece funcionar bem.

Esta configuração executará **um node Execution completo** e **um node Consensus completo** no Pi, fazendo com que seu sistema contribua para a saúde da rede Ethereum enquanto simultaneamente atua como um operador de node Rocket Pool.

## Configuração Preliminar

Para executar um node Rocket Pool em um Raspberry Pi, você precisará primeiro ter um Raspberry Pi funcionando.
Se você já tem um funcionando - ótimo! Você pode pular para a seção [Montando o SSD](#montando-o-ssd).
Apenas certifique-se de ter **um ventilador conectado** antes de continuar.
Se você está começando do zero, então continue lendo.

### O Que Você Vai Precisar

Estes são os componentes recomendados que você precisará comprar para executar o Rocket Pool em um Pi:

- Um **Raspberry Pi 4 Model B**, o **modelo de 8 GB**
  - Nota: embora você _possa_ usar um de 4 GB com esta configuração, recomendamos fortemente que você use um de 8 GB para tranquilidade... não é muito mais caro.
- Uma **fonte de alimentação USB-C** para o Pi. Você quer uma que forneça **pelo menos 3 amperes**.
- Um **cartão MicroSD**. Não precisa ser grande, 16 GB é suficiente e são bem baratos agora... mas deve ser pelo menos **Classe 10 (U1)**.
- Um **adaptador MicroSD para USB** para seu PC. Isso é necessário para que você possa instalar o Sistema Operacional no cartão antes de carregá-lo no Pi.
  Se o seu PC já tem uma porta SD, então você não precisa comprar uma nova.
- Alguns **dissipadores de calor**. Você vai executar o Pi sob carga pesada 24/7, e ele vai esquentar.
  Dissipadores de calor ajudarão para que ele não se limite. Você idealmente quer um conjunto de 3: um para a CPU, um para a RAM e um para o controlador USB.
  [Aqui está um bom exemplo de um conjunto](https://www.canakit.com/raspberry-pi-4-heat-sinks.html).
- Um **case**. Existem duas maneiras de fazer isso: com ventilador e sem ventilador.
  - Com ventilador:
    - Um **ventilador** de 40mm. Assim como o anterior, o objetivo é manter as coisas frias enquanto executa seu node Rocket Pool.
    - Um **case com suporte para ventilador** para juntar tudo.
      Você também pode conseguir um case com ventiladores integrados [como este](https://www.amazon.com/Raspberry-Armor-Metal-Aluminium-Heatsink/dp/B07VWM4J4L) para não ter que comprar os ventiladores separadamente.
  - Sem ventilador:
    - Um **case sem ventilador** que atua como um grande dissipador de calor, como [este](https://www.amazon.com/Akasa-RA08-M1B-Raspberry-case-Aluminium/dp/B081VYVNTX).
      Esta é uma boa opção já que é silenciosa, mas seu Pi **vai** ficar bem quente - especialmente durante o processo de sincronização inicial da blockchain.
      Crédito ao usuário do Discord Ken por nos apontar nesta direção!
  - Como regra geral, recomendamos ir **com ventilador** porque vamos fazer um overclock significativo no Pi.

Você pode obter muito disso junto para conveniência - por exemplo, [Canakit oferece um kit](https://www.amazon.com/CanaKit-Raspberry-8GB-Starter-Kit/dp/B08956GVXN) com muitos componentes incluídos.
No entanto, você pode conseguir tudo mais barato se comprar as peças separadamente (e se você tiver o equipamento, pode [imprimir em 3D seu próprio case para Pi](https://www.thingiverse.com/thing:3793664).)

Outros componentes que você precisará:

- Um **SSD USB 3.0+**. A recomendação geral é para um **drive de 2 TB**.
  - O [Samsung T5](https://www.amazon.com/Samsung-T5-Portable-SSD-MU-PA2T0B/dp/B073H4GPLQ) é um excelente exemplo de um que funciona bem.
  - :warning: Usar um SSD SATA com um adaptador SATA-para-USB **não é recomendado** devido a [problemas como este](https://www.raspberrypi.org/forums/viewtopic.php?f=28&t=245931).
    Se você seguir este caminho, incluímos um teste de desempenho que você pode usar para verificar se funcionará ou não na seção [Testando o Desempenho do SSD](#testando-o-desempenho-do-ssd).
- Um **cabo ethernet** para acesso à internet. Deve ser pelo menos classificado como **Cat 5e**.
  - Executar um node via Wi-Fi **não é recomendado**, mas se você não tiver outra opção, pode fazer isso em vez de usar um cabo ethernet.
- Um **nobreak (UPS)** para atuar como fonte de energia se você perder eletricidade.
  O Pi realmente não consome muita energia, então mesmo um UPS pequeno durará um tempo, mas geralmente quanto maior, melhor. Vá com um UPS tão grande quanto puder pagar.
  Além disso, recomendamos que você **conecte seu modem, roteador e outros equipamentos de rede** a ele também - não adianta muito manter seu Pi vivo se seu roteador morrer.

Dependendo da sua localização, promoções, sua escolha de SSD e UPS, e quantas dessas coisas você já tem, você provavelmente acabará gastando **cerca de $200 a $500 USD** para uma configuração completa.

### Fazendo o Ventilador Funcionar Mais Silenciosamente

Quando você receber o ventilador, por padrão você provavelmente será instruído a conectá-lo ao pino GPIO de 5v, como mostrado na imagem abaixo.
O ventilador terá um conector com dois orifícios; o preto deve ir para GND (pino 6), e o vermelho deve ir para +5v (pino 4).
![](./images/pi/Pinout.png)

No entanto, em nossa experiência, isso faz o ventilador funcionar muito alto e rápido, o que não é realmente necessário.
Se você quiser torná-lo mais silencioso enquanto ainda mantém a refrigeração, tente conectá-lo ao pino de 3.3v (Pino 1, o azul) em vez do pino de 5v.
Isso significa que no seu ventilador, o ponto preto ainda irá para GND (pino 6), mas agora o ponto vermelho irá para +3.3v (pino 1).

Se o seu ventilador tiver um conector onde os dois orifícios estão lado a lado e você não pode separá-los, você pode colocar [alguns jumpers como este](https://www.amazon.com/GenBasic-Female-Solderless-Breadboard-Prototyping/dp/B077N7J6C4) entre ele e os pinos GPIO no Pi.

### Instalando o Sistema Operacional

Existem algumas variedades de SO Linux que suportam o Raspberry Pi.
Para este guia, vamos usar o **Ubuntu 20.04**.
Ubuntu é um SO testado e comprovado que é usado em todo o mundo, e 20.04 é (no momento desta escrita) a versão mais recente do Suporte de Longo Prazo (LTS), o que significa que continuará recebendo patches de segurança por muito tempo.
Se você preferir usar um sabor diferente de Linux como Raspbian, sinta-se à vontade para seguir os guias de instalação existentes para isso - apenas tenha em mente que este guia foi feito para Ubuntu, então nem todas as instruções podem corresponder ao seu SO.

O pessoal da Canonical escreveu [um guia maravilhoso sobre como instalar a imagem do Ubuntu Server em um Pi](https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview).

Siga **os passos 1 a 4** do guia acima para a configuração do Server.
Para a imagem do Sistema Operacional, você quer selecionar `Ubuntu Server 20.04.2 LTS (RPi 3/4/400) 64-bit server OS with long-term support for arm64 architectures`.

Se você decidir que quer uma interface de desktop (para poder usar um mouse e ter janelas para arrastar), você precisará seguir o passo 5 também.
Sugerimos que você não faça isso e apenas use a imagem do servidor, porque a interface de desktop adicionará alguma sobrecarga adicional e trabalho de processamento no seu Pi com relativamente pouco benefício.
No entanto, se você está determinado a executar um desktop, então recomendamos escolher a opção Xubuntu.
É bem leve em recursos e muito fácil de usar.

Uma vez que isso esteja completo, você está pronto para começar a preparar o Ubuntu para executar um node Rocket Pool.
Você pode usar o terminal local nele, ou pode fazer SSH de seu desktop / laptop como o guia de instalação sugere.
O processo será o mesmo de qualquer maneira, então faça o que for mais conveniente para você.

Se você não está familiarizado com `ssh`, dê uma olhada no guia [Introdução ao Secure Shell](../ssh).

::: warning NOTA
Neste ponto, você deve _fortemente considerar_ configurar seu roteador para tornar o endereço IP do seu Pi **estático**.
Isso significa que seu Pi terá o mesmo endereço IP para sempre, então você sempre pode fazer SSH nele usando esse endereço IP.
Caso contrário, é possível que o IP do seu Pi possa mudar em algum momento, e o comando SSH acima não funcionará mais.
Você terá que entrar na configuração do seu roteador para descobrir qual é o novo endereço IP do seu Pi.

Cada roteador é diferente, então você precisará consultar a documentação do seu roteador para aprender como atribuir um endereço IP estático.
:::

## Montando o SSD

Como você pode ter deduzido, após seguir as instruções de instalação acima, o SO principal estará executando no cartão microSD.
Isso não é nem grande o suficiente nem rápido o suficiente para conter todos os dados da blockchain Execution e Consensus, que é onde o SSD entra.
Para usá-lo, temos que configurá-lo com um sistema de arquivos e montá-lo no Pi.

### Conectando o SSD às Portas USB 3.0

Comece conectando seu SSD em uma das portas USB 3.0 do Pi. Estas são as portas **azuis**, não as pretas:

![](./images/pi/USB.png)

As pretas são portas USB 2.0 lentas; elas são boas apenas para acessórios como mouses e teclados.
Se você tem seu teclado conectado nas portas azuis, tire-o e conecte-o nas pretas agora.

### Formatando o SSD e Criando uma Nova Partição

::: warning
Este processo vai apagar tudo no seu SSD.
Se você já tem uma partição com coisas nela, PULE ESTE PASSO porque você está prestes a deletar tudo!
Se você nunca usou este SSD antes e está totalmente vazio, então siga este passo.
:::

Execute este comando para encontrar a localização do seu disco na tabela de dispositivos:

```shell
sudo lshw -C disk
  *-disk
       description: SCSI Disk
       product: Portable SSD T5
       vendor: Samsung
       physical id: 0.0.0
       bus info: scsi@0:0.0.0
       logical name: /dev/sda
       ...
```

A coisa importante que você precisa é a parte `logical name: /dev/sda`, ou melhor, a parte **`/dev/sda`**.
Vamos chamar isso de **localização do dispositivo** do seu SSD.
Para este guia, vamos usar `/dev/sda` como a localização do dispositivo - a sua provavelmente será a mesma, mas substitua pelo que esse comando mostrar para o resto das instruções.

Agora que sabemos a localização do dispositivo, vamos formatá-lo e fazer uma nova partição nele para que possamos realmente usá-lo.
Novamente, **estes comandos vão deletar o que já estiver no disco!**

Crie uma nova tabela de partição:

```shell
sudo parted -s /dev/sda mklabel gpt unit GB mkpart primary ext4 0 100%
```

Formate a nova partição com o sistema de arquivos `ext4`:

```shell
sudo mkfs -t ext4 /dev/sda1
```

Adicione um rótulo a ela (você não precisa fazer isso, mas é divertido):

```shell
sudo e2label /dev/sda1 "Rocket Drive"
```

Confirme que isso funcionou executando o comando abaixo, que deve mostrar uma saída como a que você vê aqui:

```shell
sudo blkid
...
/dev/sda1: LABEL="Rocket Drive" UUID="1ade40fd-1ea4-4c6e-99ea-ebb804d86266" TYPE="ext4" PARTLABEL="primary" PARTUUID="288bf76b-792c-4e6a-a049-cb6a4d23abc0"
```

Se você vê tudo isso, então está tudo certo. Pegue a saída `UUID="..."` e coloque-a em algum lugar temporariamente, porque você vai precisar dela daqui a pouco.

### Otimizando a Nova Partição

Em seguida, vamos ajustar o novo sistema de arquivos um pouco para otimizá-lo para atividade de validador.

Por padrão, ext4 reservará 5% de seu espaço para processos do sistema.
Como não precisamos disso no SSD porque ele apenas armazena os dados da chain Execution e Consensus, podemos desabilitá-lo:

```shell
sudo tune2fs -m 0 /dev/sda1
```

### Montando e Habilitando Montagem Automática

Para usar o drive, você tem que montá-lo no sistema de arquivos.
Crie um novo ponto de montagem onde quiser (vamos usar `/mnt/rpdata` aqui como exemplo, sinta-se à vontade para usar isso):

```shell
sudo mkdir /mnt/rpdata
```

Agora, monte a nova partição SSD nessa pasta:

```shell
sudo mount /dev/sda1 /mnt/rpdata
```

Depois disso, a pasta `/mnt/rpdata` apontará para o SSD, então qualquer coisa que você escrever nessa pasta viverá no SSD.
É aqui que vamos armazenar os dados da chain para Execution e Consensus.

Agora, vamos adicioná-lo à tabela de montagem para que seja montado automaticamente na inicialização.
Lembra do `UUID` do comando `blkid` que você usou anteriormente?
É aqui que ele será útil.

```shell
sudo nano /etc/fstab
```

Isso abrirá um editor de arquivo interativo, que será parecido com isso no início:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
```

Use as teclas de seta para ir até a linha inferior e adicione esta linha no final:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
```

Substitua o valor em `UUID=...` pelo do seu disco, então pressione `Ctrl+O` e `Enter` para salvar, depois `Ctrl+X` e `Enter` para sair.
Agora o SSD será montado automaticamente quando você reiniciar. Legal!

### Testando o Desempenho do SSD

Antes de ir mais longe, você deve testar a velocidade de leitura/gravação do seu SSD e quantas requisições de I/O ele pode lidar por segundo (IOPS).
Se o seu SSD for muito lento, então não funcionará bem para um node Rocket Pool e você acabará perdendo dinheiro ao longo do tempo.

Para testá-lo, vamos usar um programa chamado `fio`. Instale-o assim:

```shell
sudo apt install fio
```

Em seguida, vá para o ponto de montagem do seu SSD:

```shell
cd /mnt/rpdata
```

Agora, execute este comando para testar o desempenho do SSD:

```shell
sudo fio --randrepeat=1 --ioengine=libaio --direct=1 --gtod_reduce=1 --name=test --filename=test --bs=4k --iodepth=64 --size=4G --readwrite=randrw --rwmixread=75
```

A saída deve parecer com isso:

```
test: (g=0): rw=randrw, bs=(R) 4096B-4096B, (W) 4096B-4096B, (T) 4096B-4096B, ioengine=libaio, iodepth=64
fio-3.16
Starting 1 process
test: Laying out IO file (1 file / 4096MiB)
Jobs: 1 (f=1): [m(1)][100.0%][r=63.9MiB/s,w=20.8MiB/s][r=16.4k,w=5329 IOPS][eta 00m:00s]
test: (groupid=0, jobs=1): err= 0: pid=205075: Mon Feb 15 04:06:35 2021
  read: IOPS=15.7k, BW=61.5MiB/s (64.5MB/s)(3070MiB/49937msec)
   bw (  KiB/s): min=53288, max=66784, per=99.94%, avg=62912.34, stdev=2254.36, samples=99
   iops        : min=13322, max=16696, avg=15728.08, stdev=563.59, samples=99
  write: IOPS=5259, BW=20.5MiB/s (21.5MB/s)(1026MiB/49937msec); 0 zone resets
...
```

O que você se importa são as linhas começando com `read:` e `write:` sob a linha `test:`.

- Sua **leitura** deve ter IOPS de pelo menos **15k** e largura de banda (BW) de pelo menos **60 MiB/s**.
- Sua **gravação** deve ter IOPS de pelo menos **5000** e largura de banda de pelo menos **20 MiB/s**.

Essas são as especificações do Samsung T5 que usamos, que funciona muito bem.
Também testamos um SSD mais lento com IOPS de leitura de 5k e IOPS de gravação de 1k, e ele tem muita dificuldade em acompanhar a camada de consenso.
Se você usar um SSD mais lento do que as especificações acima, apenas esteja preparado para que possa ver muitas atestações perdidas.
Se o seu atende ou excede elas, então você está pronto e pode seguir em frente.

::: tip NOTA
Se o seu SSD não atende às especificações acima mas deveria, você pode ser capaz de corrigir isso com uma atualização de firmware.
Por exemplo, isso foi experimentado pela comunidade Rocket Pool com o Samsung T7.
Dois deles direto da caixa mostraram apenas 3.5K IOPS de leitura e 1.2K IOPS de gravação.
Depois de aplicar todas as atualizações de firmware disponíveis, o desempenho estava de volta aos números mostrados no exemplo acima.
Verifique com o site de suporte do fabricante o firmware mais recente e certifique-se de que seu drive está atualizado - você pode ter que atualizar o firmware várias vezes até não haver mais atualizações restantes.
:::

Por último, mas não menos importante, remova o arquivo de teste que você acabou de criar:

```shell
sudo rm /mnt/rpdata/test
```

## Configurando Espaço de Swap

O Pi tem 8 GB (ou 4 GB se você foi por esse caminho) de RAM.
Para nossa configuração, isso será suficiente.
Por outro lado, nunca faz mal adicionar um pouco mais.
O que vamos fazer agora é adicionar o que é chamado de **espaço de swap**.
Essencialmente, significa que vamos usar o SSD como "RAM de backup" caso algo horrível aconteça e o Pi fique sem RAM regular.
O SSD não é nem de longe tão rápido quanto a RAM regular, então se atingir o espaço de swap vai desacelerar as coisas, mas não vai travar e quebrar completamente tudo.
Pense nisso como um seguro extra que você (muito provavelmente) nunca precisará.

### Criando um Arquivo de Swap

O primeiro passo é fazer um novo arquivo que atuará como seu espaço de swap.
Decida quanto você quer usar - um começo razoável seria 8 GB, então você tem 8 GB de RAM normal e 8 GB de "RAM de backup" para um total de 16 GB.
Para ser super seguro, você pode fazer 24 GB para que seu sistema tenha 8 GB de RAM normal e 24 GB de "RAM de backup" para um total de 32 GB, mas isso é provavelmente exagero.
Felizmente, já que seu SSD tem 1 ou 2 TB de espaço, alocar 8 a 24 GB para um swapfile é insignificante.

Para o bem deste tutorial, vamos escolher um meio termo agradável - digamos, 16 GB de espaço de swap para um total de RAM de 24 GB.
Apenas substitua qualquer número que você queira conforme avançamos.

Digite isso, que criará um novo arquivo chamado `/mnt/rpdata/swapfile` e o preencherá com 16 GB de zeros.
Para mudar a quantidade, apenas mude o número em `count=16` para o que você quiser. **Note que isso vai levar muito tempo, mas está tudo bem.**

```shell
sudo dd if=/dev/zero of=/mnt/rpdata/swapfile bs=1G count=16 status=progress
```

Em seguida, defina as permissões para que apenas o usuário root possa ler ou escrever nele (para segurança):

```shell
sudo chmod 600 /mnt/rpdata/swapfile
```

Agora, marque-o como um arquivo de swap:

```shell
sudo mkswap /mnt/rpdata/swapfile
```

Em seguida, habilite-o:

```shell
sudo swapon /mnt/rpdata/swapfile
```

Finalmente, adicione-o à tabela de montagem para que seja carregado automaticamente quando seu Pi reiniciar:

```shell
sudo nano /etc/fstab
```

Adicione uma nova linha no final para que o arquivo fique assim:

```
LABEL=writable  /        ext4   defaults        0 0
LABEL=system-boot       /boot/firmware  vfat    defaults        0       1
UUID=1ade40fd-1ea4-4c6e-99ea-ebb804d86266       /mnt/rpdata     ext4    defaults        0       0
/mnt/rpdata/swapfile                            none            swap    sw              0       0
```

Pressione `Ctrl+O` e `Enter` para salvar, depois `Ctrl+X` e `Enter` para sair.

Para verificar que está ativo, execute estes comandos:

```shell
sudo apt install htop
htop
```

Sua saída deve parecer com isso no topo:
![](./images/pi/Swap.png)

Se o segundo número na última linha rotulada `Swp` (o depois da `/`) for diferente de zero, então você está pronto.
Por exemplo, se mostrar `0K / 16.0G` então seu espaço de swap foi ativado com sucesso.
Se mostrar `0K / 0K` então não funcionou e você terá que confirmar que inseriu os passos anteriores corretamente.

Pressione `q` ou `F10` para sair do `htop` e voltar ao terminal.

### Configurando Swappiness e Cache Pressure

Por padrão, o Linux usará ansiosamente muito espaço de swap para tirar um pouco da pressão da RAM do sistema.
Não queremos isso. Queremos que use toda a RAM até o último segundo antes de depender do SWAP.
O próximo passo é mudar o que é chamado de "swappiness" do sistema, que é basicamente quão ansioso ele está para usar o espaço de swap.
Há muito debate sobre qual valor definir para isso, mas descobrimos que um valor de 6 funciona bem o suficiente.

Também queremos diminuir a "cache pressure", que dita quão rapidamente o Pi deletará um cache de seu sistema de arquivos.
Como vamos ter muita RAM sobrando com nossa configuração, podemos tornar isso "10" o que deixará o cache na memória por um tempo, reduzindo I/O de disco.

Para definir esses, execute estes comandos:

```shell
sudo sysctl vm.swappiness=6
sudo sysctl vm.vfs_cache_pressure=10
```

Agora, coloque-os no arquivo `sysctl.conf` para que sejam reaplicados após uma reinicialização:

```shell
sudo nano /etc/sysctl.conf
```

Adicione estas duas linhas no final:

```shell
vm.swappiness=6
vm.vfs_cache_pressure=10
```

Então salve e saia como você fez antes (`Ctrl+O`, `Ctrl+X`).

## Fazendo Overclock no Pi

Por padrão, o processador de 1.5 GHz que vem com o Pi é um dispositivo bem capaz.
Na maior parte, você deve conseguir validar com ele perfeitamente.
No entanto, notamos que em raras ocasiões, seu cliente validador fica preso trabalhando em algumas coisas e simplesmente não tem potência suficiente para acompanhar as tarefas de atestação do seu validador.
Quando isso acontece, você verá algo assim no [explorador beaconcha.in](https://beaconcha.in) (descrito em mais detalhes no guia [Monitorando o Desempenho do Seu Node](../performance) mais adiante):

![](./images/pi/Incl-Dist.png)

Aquela distância de inclusão de 8 significa que levou muito tempo para enviar aquela atestação, e você será levemente penalizado por estar atrasado.
Idealmente, todos eles devem ser 0.
Embora raros, esses ocorrem quando executando nas configurações padrão.

Há uma maneira de mitigar isso, no entanto: overclock.
Overclock é de longe a maneira mais fácil de obter um pouco de desempenho extra da CPU do seu Pi e prevenir aquelas distâncias de inclusão altas desagradáveis.
Francamente, o clock padrão da CPU de 1.5 GHz é realmente fraco.
Você pode acelerá-lo bastante via overclock, e dependendo de quão longe você leva, você pode fazê-lo de forma bastante segura também.

Fazer overclock no Pi é muito simples - apenas envolve mudar alguns números em um arquivo de texto.
Existem dois números que importam: o primeiro é o **core clock**, que determina diretamente quão rápido a CPU ARM funciona.
O segundo é **overvoltage**, que determina a voltagem que é alimentada na CPU ARM.
Velocidades mais altas geralmente requerem voltagem mais alta, mas a CPU do Pi pode lidar com bastante voltagem extra sem nenhum dano apreciável.
Pode se desgastar um pouco mais rápido, mas ainda estamos falando na ordem de anos e o Pi 5 estará fora até lá, então sem dano real!

Em vez disso, a preocupação real com overvoltage é que **voltagens mais altas levam a temperaturas mais altas**.
Esta seção ajudará você a ver quão quente seu Pi fica sob carga pesada, para que você não o force demais.

::: warning
Embora fazer overclock nos níveis que vamos fazer seja bastante seguro e confiável, você está à mercê do que é chamado de "loteria do silício".
Cada CPU é ligeiramente diferente de maneiras microscópicas, e algumas delas podem simplesmente fazer overclock melhor do que outras.
Se você fizer overclock demais / muito forte, então seu sistema pode se tornar **instável**.
Pis instáveis sofrem de todos os tipos de consequências, desde reinicializações constantes até congelamento completo.
**No pior caso, você pode corromper seu cartão microSD e ter que reinstalar tudo do zero!**

**Ao seguir a orientação aqui, você tem que aceitar o fato de que está correndo esse risco.**
Se isso não vale a pena para você, então pule o resto desta seção.
:::

## Benchmarking da Configuração Padrão

Antes de fazer overclock, você deve perfilar o que seu Pi é capaz em sua configuração padrão, pronta para uso.
Existem três coisas principais para observar:

1. **Desempenho** (quão rápido seu Pi calcula coisas)
2. **Temperatura** sob carga (quão quente ele fica)
3. **Estabilidade** (quanto tempo ele funciona antes de travar)

Vamos obter estatísticas sobre todos os três conforme avançamos.

### Desempenho

Para medir desempenho, você pode usar LINPACK.
Vamos construí-lo a partir do código-fonte.

```shell
cd ~
sudo apt install gcc
wget http://www.netlib.org/benchmark/linpackc.new -O linpack.c
...
cc -O3 -o linpack linpack.c -lm
...
sudo mv linpack /usr/local/bin
rm linpack.c
```

Agora execute assim:

```shell
linpack
Enter array size (q to quit) [200]:
```

Apenas pressione `enter` para deixar no padrão de 200, e deixe executar.
Quando terminar, a saída parecerá com isso:

```
Memory required:  315K.


LINPACK benchmark, Double precision.
Machine precision:  15 digits.
Array size 200 X 200.
Average rolled and unrolled performance:

    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.70  85.64%   3.76%  10.60%  1120802.516
    1024   1.40  85.70%   3.74%  10.56%  1120134.749
    2048   2.81  85.71%   3.73%  10.56%  1120441.752
    4096   5.62  85.69%   3.74%  10.57%  1120114.452
    8192  11.23  85.67%   3.74%  10.59%  1120277.186
```

O que você precisa olhar é a última linha, na coluna `KFLOPS`.
Este número (1120277.186 no exemplo acima) representa seu desempenho computacional.
Não significa nada por si só, mas nos dá uma boa base para comparar o desempenho com overclock.
Vamos chamar isso de **KFLOPS padrão**.

### Temperatura

Em seguida, vamos estressar o Pi e observar sua temperatura sob carga pesada.
Primeiro, instale este pacote, que fornecerá uma ferramenta chamada `vcgencmd` que pode imprimir detalhes sobre o Pi:

```shell
sudo apt install libraspberrypi-bin
```

Uma vez instalado, reinicie o Pi (isso é necessário para que algumas novas permissões sejam aplicadas).
Em seguida, instale um programa chamado **stressberry**.
Esta será nossa ferramenta de benchmarking.
Instale assim:

```shell
sudo apt install stress python3-pip
pip3 install stressberry
source ~/.profile
```

::: tip NOTA
Se stressberry lançar um erro sobre não conseguir ler informações de temperatura ou não conseguir abrir a instância `vchiq`, você pode corrigi-lo com o seguinte comando:

```shell
sudo usermod -aG video $USER
```

Então saia e entre novamente, reinicie sua sessão SSH, ou reinicie a máquina e tente novamente.
:::

Em seguida, execute assim:

```shell
stressberry-run -n "Stock" -d 300 -i 60 -c 4 stock.out
```

Isso executará um novo teste de estresse chamado "Stock" por 300 segundos (5 minutos) com 60 segundos de resfriamento antes e depois do teste, em todos os 4 núcleos do Pi.
Você pode brincar com esses tempos se quiser que execute por mais tempo ou tenha mais resfriamento, mas isso funciona como um teste de estresse rápido para mim.
Os resultados serão salvos em um arquivo chamado `stock.out`.

Durante a fase principal do teste, a saída parecerá com isso:

```
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.3°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
Current temperature: 40.9°C - Frequency: 1500MHz
Current temperature: 41.8°C - Frequency: 1500MHz
```

Isso basicamente diz a você quão quente o Pi ficará.
A 85°C, o Pi realmente começará a se limitar e reduzirá a velocidade do clock para não superaquecer.
Felizmente, porque você adicionou um dissipador de calor e um ventilador, você não deve chegar nem perto disso!
Dito isso, geralmente tentamos manter as temperaturas abaixo de 65°C pelo bem da saúde geral do sistema.

Se você quiser monitorar a temperatura do sistema durante operações normais de validação, você pode fazer isso com `vcgencmd`:

```shell
vcgencmd measure_temp
temp=34.0'C
```

### Estabilidade

Testar a estabilidade de um overclock envolve responder a estas três perguntas:

- O Pi liga e chega a um prompt de login / inicia o servidor SSH?
- Ele congela ou reinicia aleatoriamente durante operações normais?
- Ele congela ou reinicia aleatoriamente durante carga pesada?

Para um overclock ser verdadeiramente estável, as respostas devem ser **sim, não e não**.
Existem algumas maneiras de testar isso, mas a mais fácil neste ponto é apenas executar `stressberry` por muito tempo.
Quanto tempo é inteiramente com você - quanto mais tempo for, mais certo você pode estar de que o sistema é estável.
Algumas pessoas apenas executam o teste de 5 minutos acima e chamam isso de bom se sobreviver; outros executam por meia hora; outros executam por 8 horas ou até mais.
Quanto tempo executá-lo é uma decisão pessoal que você terá que tomar com base em sua própria tolerância ao risco.

Para mudar o tempo de execução, apenas modifique o parâmetro `-d` com o número de segundos que você quer que o teste execute.
Por exemplo, se você decidiu que meia hora é o caminho a seguir, você poderia fazer `-d 1800`.

## Seu Primeiro Overclock - 1800 MHz (Leve)

O primeiro overclock que vamos fazer é relativamente "leve" e confiável, mas ainda fornece um bom aumento no poder de computação.
Vamos passar dos 1500 MHz padrão para 1800 MHz - um aumento de velocidade de 20%!

Abra este arquivo:

```shell
sudo nano /boot/firmware/usercfg.txt
```

Adicione estas duas linhas no final:

```shell
arm_freq=1800
over_voltage=3
```

Então salve o arquivo e reinicie.

Essas configurações aumentarão o clock da CPU em 20%, e também aumentarão a voltagem da CPU de 0.88v para 0.93v (cada configuração `over_voltage` aumenta em 0.025v).
Esta configuração deve ser atingível por qualquer Pi 4B, então seu sistema deve reiniciar e fornecer um prompt de login ou acesso SSH em apenas alguns momentos.
Se não, e seu Pi parar de responder ou entrar em um loop de boot, você terá que resetá-lo - leia a próxima seção para isso.

### Resetando Após um Overclock Instável

Se o seu Pi parar de responder, ou continuar reiniciando repetidamente, então você precisa diminuir o overclock.
Para fazer isso, siga estes passos:

1. Desligue o Pi.
2. Retire o cartão microSD.
3. Conecte o cartão em outro computador Linux com um adaptador microSD.
   \*NOTA: Isso **tem que ser** outro computador Linux. Não funcionará se você conectá-lo em uma máquina Windows, porque o Windows não pode ler o sistema de arquivos `ext4` que o cartão SD usa!\*\*
4. Monte o cartão no outro computador.
5. Abra `<ponto de montagem SD>/boot/firmware/usercfg.txt`.
6. Abaixe o valor `arm_freq`, ou aumente o valor `over_voltage`. _NOTA: **não vá mais alto que over_voltage=6.** Valores mais altos não são suportados pela garantia do Pi, e correm o risco de degradar a CPU mais rápido do que você pode estar confortável._
7. Desmonte o cartão SD e remova-o.
8. Conecte o cartão de volta no Pi e ligue-o.

Se o Pi funcionar, então ótimo! Continue abaixo.
Se não, repita todo o processo com configurações ainda mais conservadoras.
No pior caso você pode apenas remover as linhas `arm_freq` e `over_voltage` inteiramente para retorná-lo às configurações padrão.

### Testando 1800 MHz

Uma vez que você esteja logado, execute `linpack` novamente para testar o novo desempenho.
Aqui está um exemplo do nosso Pi de teste:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.59  85.72%   3.75%  10.53%  1338253.832
    1024   1.18  85.72%   3.75%  10.53%  1337667.003
    2048   2.35  85.72%   3.75%  10.53%  1337682.272
    4096   4.70  85.73%   3.75%  10.53%  1337902.437
    8192   9.40  85.71%   3.76%  10.53%  1337302.722
   16384  18.80  85.72%   3.75%  10.52%  1337238.504
```

Novamente, pegue a coluna `KFLOPS` na última linha.
Para compará-la à configuração padrão, simplesmente divida os dois números:
`1337238.504 / 1120277.186 = 1.193668`

Muito bem! Isso é um aumento de 19.4% no desempenho, o que é esperado já que estamos executando 20% mais rápido.
Agora vamos verificar as temperaturas com a nova velocidade de clock e configurações de voltagem:

```shell
stressberry-run -n "1800_ov3" -d 300 -i 60 -c 4 1800_ov3.out
```

Você deve ver uma saída assim:

```
Current temperature: 47.2°C - Frequency: 1800MHz
Current temperature: 48.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
Current temperature: 47.7°C - Frequency: 1800MHz
```

Nada mal, cerca de 6° mais quente que as configurações padrão mas ainda bem abaixo do limite onde pessoalmente pararíamos.

Você pode executar um teste de estabilidade mais longo aqui se estiver confortável, ou pode prosseguir para levar as coisas ainda mais alto.

## Indo para 2000 MHz (Médio)

O próximo marco será 2000 MHz. Isso representa um aumento de 33.3% na velocidade do clock, o que é bastante significativo.
A maioria das pessoas considera isso um ótimo equilíbrio entre desempenho e estabilidade, então param o processo aqui.

Nossa recomendação para este nível é começar com estas configurações:

```shell
arm_freq=2000
over_voltage=5
```

Isso aumentará a voltagem do núcleo para 1.005v.
Experimente isso com os testes `linpack` e `stressberry`.
Se sobreviver a eles, então você está pronto. Se congelar ou reiniciar aleatoriamente, então você deve aumentar a voltagem:

```shell
arm_freq=2000
over_voltage=6
```

Isso coloca a voltagem do núcleo em 1.03v, que é o máximo que você pode ir antes de anular a garantia.
Isso geralmente funciona para a maioria dos Pis.
Se não funcionar, em vez de aumentar a voltagem ainda mais, **você deve diminuir sua velocidade de clock e tentar novamente.**

Para referência, aqui estão os números da nossa execução de 2000:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.53  85.76%   3.73%  10.51%  1482043.543
    1024   1.06  85.74%   3.73%  10.53%  1481743.724
    2048   2.12  85.74%   3.72%  10.54%  1482835.055
    4096   4.24  85.73%   3.74%  10.53%  1482189.202
    8192   8.48  85.74%   3.73%  10.53%  1482560.117
   16384  16.96  85.74%   3.73%  10.53%  1482441.146
```

Isso é um aumento de velocidade de 32.3% o que está de acordo com o que esperaríamos. Nada mal!

Aqui estão nossas temperaturas:

```
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 54.0°C - Frequency: 2000MHz
Current temperature: 54.5°C - Frequency: 2000MHz
Current temperature: 55.5°C - Frequency: 2000MHz
```

Um aumento de 7 graus a mais, mas ainda abaixo do nosso limite de 65°C.

## Indo para 2100 MHz (Pesado)

O próximo passo representa um sólido **aumento de velocidade de 40%** sobre a configuração padrão.

**NOTA: Nem todos os Pi's são capazes de fazer isso enquanto permanecem em `over_voltage=6`.
Tente, e se quebrar, volte para 2000 MHz.**

A configuração ficará assim:

```shell
arm_freq=2100
over_voltage=6
```

Para referência, aqui estão nossos resultados:

```
linpack
Enter array size (q to quit) [200]:
...
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
     512   0.50  85.68%   3.76%  10.56%  1560952.508
    1024   1.01  85.68%   3.76%  10.56%  1554858.509
    2048   2.01  85.70%   3.74%  10.56%  1561524.482
    4096   4.03  85.72%   3.73%  10.55%  1560152.447
    8192   8.06  85.72%   3.73%  10.54%  1561078.999
   16384  16.11  85.73%   3.73%  10.54%  1561448.736
```

Isso é um aumento de velocidade de 39.4%!

Aqui estão nossas temperaturas:

```
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
Current temperature: 58.4°C - Frequency: 2100MHz
Current temperature: 59.4°C - Frequency: 2100MHz
Current temperature: 58.9°C - Frequency: 2100MHz
```

Perto de 60°C, então há muito espaço.

## Indo para 2250 MHz (Extremo)

Esta é a configuração em que executamos nossos Pi's, que tem sido estável por mais de um ano no momento desta escrita.
Ainda assim, **usuários são alertados sobre fazer overclock tão alto** - certifique-se de fazer testes de estabilidade completos e ter muito espaço térmico antes de tentar fazer desta a configuração de produção do seu node!

Nossa configuração é:

```shell
arm_freq=2250
over_voltage=10
```

Aqui estão nossos resultados:

```
    Reps Time(s) DGEFA   DGESL  OVERHEAD    KFLOPS
----------------------------------------------------
    1024   0.95  85.69%   3.85%  10.47%  1650081.294
    2048   1.91  85.64%   3.91%  10.45%  1646779.068
    4096   3.84  85.41%   4.15%  10.44%  1637706.598
    8192   7.75  85.50%   4.03%  10.46%  1620589.096
   16384  15.34  85.43%   4.13%  10.44%  1638067.854
```

Isso é 46% mais rápido que a configuração padrão!

OV10 é o máximo que o firmware padrão permitirá que o Pi vá, e 2250 MHz é o mais rápido que pudemos executar de forma confiável em produção.

As temperaturas no teste de estresse ficam assim:

```
Current temperature: 70.6°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
Current temperature: 71.1°C - Frequency: 2251MHz
```

Mas durante a validação real, elas tendem a ficar abaixo de 60C o que é aceitável para nós.

## Próximos Passos

E com isso, seu Pi está funcionando e pronto para executar o Rocket Pool!
Passe para a seção [Escolhendo seus Clientes ETH](../eth-clients).
