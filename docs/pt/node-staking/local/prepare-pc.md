# Preparando um PC, Mini-PC ou NUC

Antes de instalar o Rocket Pool, há algumas verificações que você deve fazer para garantir que seu sistema é compatível e funcionará corretamente.

::: danger
Recomendamos fortemente que você crie uma máquina dedicada para executar um node Rocket Pool.
Executar um node em uma máquina de uso geral, como seu desktop de trabalho diário ou um PC para jogos, apresenta riscos de segurança extras que podem comprometer sua carteira e resultar no roubo de suas moedas.

**Para máxima segurança, por favor construa uma nova máquina que seja dedicada exclusivamente à execução de um node.**
:::

## Requisitos do Sistema

Abaixo está uma breve descrição dos requisitos de software e hardware que um node Rocket Pool requer.
Este guia assume que você já tem sua máquina fisicamente construída e o sistema operacional instalado.

### Sistemas Operacionais Suportados

O cliente Smartnode do Rocket Pool atualmente suporta sistemas **Linux** e **macOS**.

Neste momento, **Windows** pode ser usado para gerenciar remotamente uma máquina Linux ou Mac remota, mas o Smartnode em si não pode atualmente ser executado em um sistema Windows. No entanto, o Rocket Pool _pode_ ser executado em uma [máquina virtual](https://en.wikipedia.org/wiki/System_virtual_machine) Linux hospedada por uma máquina Windows.
Esta configuração não é recomendada em relação a simplesmente instalar Linux como o sistema operacional host, mas funciona se necessário.
Note que isso exigirá sobrecarga extra de recursos e vem com seu próprio conjunto de riscos de segurança, então não aconselhamos usar esta configuração ao fazer staking de Ether real na rede principal.

O Rocket Pool é nativamente compatível com arquiteturas de CPU **AMD64 (x64)** e **arm64 (aarch64)**.
Para outras arquiteturas, você precisará compilar os clientes smartnode a partir do código-fonte.

Note que o usuário deve ter acesso **root / Administrador** (ou privilégios **sudo**) para instalar o Smartnode.

#### Suporte Linux

Existem muitas variantes do SO Linux (chamadas distribuições, ou **distros** para abreviar). Embora você possa executar o Rocket Pool de qualquer distro moderna, o instalador do Rocket Pool pode instalar automaticamente toda a stack no [Ubuntu](https://ubuntu.com/about), [Debian](https://www.debian.org/intro/why_debian), [CentOS](https://www.centos.org/about/), e [Fedora](https://docs.fedoraproject.org/en-US/project/).

::: warning NOTA
Se você planeja usar Ubuntu, recomendamos fortemente usar uma versão **LTS** como 24.04.
Essas versões são mantidas ativamente por períodos mais longos, o que ajuda com a segurança e estabilidade do seu node.
:::

Para instalação em outras distros, o instalador Smartnode não será capaz de instalar automaticamente algumas dependências do sistema (como `docker-compose`).
Alguns passos manuais serão necessários durante a instalação.

Para sistemas `arm64`, o instalador Smartnode suporta nativamente apenas Debian e distros baseadas em Debian como Ubuntu.
Para outras distros, passos manuais serão necessários durante a instalação.

## Instalando o Sistema Operacional

Se você está usando macOS, é altamente provável que você já tenha o Sistema Operacional instalado e possa pular esta etapa.

Se você está instalando Linux do zero, cada uma das distribuições listadas acima vem com tutoriais úteis e detalhados para instalar o Sistema Operacional do zero.
Como exemplo, vamos orientá-lo pelo processo de instalação e preparação do **Debian Server**.
Debian é uma boa escolha para operação de node porque foca em **máxima estabilidade e confiabilidade** - ambas altamente desejáveis para máquinas node que devem estar rodando 24/7.

[Aqui está um bom guia passo a passo](https://itslinuxfoss.com/debian-11-bullseye-guide/) com capturas de tela que mostra como instalar Debian na sua máquina node do zero.

:::tip
Temos algumas emendas úteis ao guia linkado acima, que você pode querer seguir:

- Quando solicitado a configurar uma **senha root**, recomendamos deixá-la **em branco**. Isso desabilitará a conta `root` e em vez disso instalará o pacote `sudo`, permitindo que seu usuário execute operações root digitando novamente sua senha para elevar suas permissões. Isso é análogo à forma como o Ubuntu Linux é configurado, o que pode ser mais familiar aos usuários.
- Na tela de **Seleção de software** no final, você pode não querer ter uma GUI desktop instalada.
  - GUIs desktop são em grande parte desnecessárias para um node; elas adicionam sobrecarga extra e na maioria das vezes não serão usadas, já que você estará controlando-o remotamente via terminal de qualquer forma, então preferimos **desmarcar GNOME e ambiente desktop Debian** aqui.
  - Se você _quer_ uma UI desktop no seu node, recomendamos que você **desmarque GNOME e marque XFCE**, pois é mais leve em recursos do sistema. Também recomendamos não executar software adicional no node, como navegadores ou Discord, pois eles diminuem a segurança e consomem recursos do sistema.
  - Desmarque **web server**, mas deixe **SSH server** e **standard system utilities** marcados.
- Se você criou um flash drive a partir de um iso, você pode precisar desabilitar o repositório CD-ROM para executar `apt`.
  Você pode encontrar uma explicação de como fazer isso [aqui](https://www.linuxtechi.com/things-to-do-after-installing-debian-11/).
- Seu sistema pode ser configurado para dormir/hibernar por padrão. Para desabilitar essas configurações, você pode executar o seguinte comando:
  `sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`

:::

### Instalando `sudo`

O instalador do Rocket Pool requer o programa `sudo` para adquirir todas as suas dependências.
Se você deixou a **senha do usuário root em branco** na etapa anterior, você já terá isso.
Se não, por favor instale-o agora executando os seguintes comandos:

```shell
apt update
```

```shell
apt install sudo
```

```shell
usermod -aG sudo $USER
```

Depois reinicie a máquina.
Você deve agora ser capaz de executar comandos via `sudo` como `sudo apt update`.

### Usando SSH

Uma vez que o servidor esteja instalado e você seja capaz de fazer login, você precisa obter seu endereço IP.
Uma maneira fácil de fazer isso é com `ifconfig` que está incluído no pacote 'net-tools':

```shell
sudo apt update
```

```shell
sudo apt install net-tools
```

```shell
sudo ifconfig
```

Você pode ver várias entradas aqui, mas a que você quer procurar vai se parecer com isso:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
      inet 192.168.1.8  netmask 255.255.255.0  broadcast 192.168.1.255
      inet6 fe80::96f2:bf29:e269:1097  prefixlen 64  scopeid 0x20<link>
      ether <mac address>  txqueuelen 1000  (Ethernet)
      ...
```

As flags devem dizer `UP,BROADCAST,RUNNING,MULTICAST`.
O valor `inet` (aqui `192.168.1.8`) é o endereço IP local da sua máquina.

Em seguida, instale SSH:

```shell
sudo apt install openssh-server
```

:::tip NOTA
Se você tinha a caixa **SSH server** marcada durante a instalação do Debian, você já deve ter isso instalado então este comando não fará nada.
:::

Depois disso, você pode fazer login no terminal da máquina remotamente do seu laptop ou desktop usando `ssh`.

Se você não está familiarizado com `ssh`, dê uma olhada no guia [Introdução ao Secure Shell](../ssh).

:::warning NOTA
Neste ponto, você deve _considerar fortemente_ configurar seu roteador para tornar o endereço IP do seu node **estático**.
Isso significa que seu node terá o mesmo endereço IP para sempre, então você pode sempre fazer SSH nele usando aquele endereço IP.
Caso contrário, é possível que o IP do seu node mude em algum momento, e o comando SSH acima não funcionará mais.
Você terá que entrar na configuração do seu roteador para descobrir qual é o novo endereço IP do seu node.

Cada roteador é diferente, então você precisará consultar a documentação do seu roteador para aprender como atribuir um endereço IP estático.
:::

## Configurando Espaço de Swap

Na maioria dos casos, se você escolher seus clientes de Execution e Consensus e seu tipo de instância cuidadosamente, você não deve ficar sem RAM.
Por outro lado, nunca faz mal adicionar um pouco mais.
O que vamos fazer agora é adicionar o que é chamado de **espaço de swap**.
Essencialmente, significa que vamos usar o SSD como "RAM de backup" caso algo dê terrivelmente errado e seu servidor fique sem RAM regular.
O SSD não é nem de perto tão rápido quanto a RAM regular, então se ele usar o espaço de swap vai deixar as coisas mais lentas, mas não vai travar completamente e quebrar tudo.
Pense nisso como seguro extra que você (provavelmente) nunca precisará.

### Criando um Arquivo de Swap

O primeiro passo é fazer um novo arquivo que atuará como seu espaço de swap.
Decida quanto você quer usar - um começo razoável seria 8 GB, então você tem 8 GB de RAM normal e 8 GB de "RAM de backup" para um total de 16 GB.
Para ser super seguro, você pode fazer 24 GB para que seu sistema tenha 8 GB de RAM normal e 24 GB de "RAM de backup" para um total de 32 GB, mas isso é provavelmente exagero.
Felizmente, como seu SSD tem 1 ou 2 TB de espaço, alocar 8 a 24 GB para um swapfile é negligenciável.

Para fins deste passo a passo, vamos escolher um meio termo - digamos, 16 GB de espaço de swap para um total de RAM de 24 GB.
Apenas substitua pelo número que você quiser conforme prosseguimos.

Digite isso, o que criará um novo arquivo chamado `/swapfile` e o preencherá com 16 GB de zeros.
Para mudar a quantidade, apenas mude o número em `count=16` para o que você quiser. **Note que isso vai levar muito tempo, mas está ok.**

```shell
sudo dd if=/dev/zero of=/swapfile bs=1G count=16 status=progress
```

Em seguida, defina as permissões para que apenas o usuário root possa ler ou escrever nele (por segurança):

```shell
sudo chmod 600 /swapfile
```

Agora, marque-o como um arquivo de swap:

```shell
sudo mkswap /swapfile
```

Em seguida, habilite-o:

```shell
sudo swapon /swapfile
```

Finalmente, adicione-o à tabela de montagem para que ele carregue automaticamente quando seu servidor reiniciar:

```shell
sudo nano /etc/fstab
```

Adicione uma nova linha no final que se pareça com isso:

```
/swapfile                            none            swap    sw              0       0
```

Pressione `Ctrl+O` e `Enter` para salvar, depois `Ctrl+X` e `Enter` para sair.

Para verificar que está ativo, execute estes comandos:

```shell
sudo apt install htop
htop
```

Sua saída deve se parecer com isso no topo:
![](../local/images/pi/Swap.png)

Se o segundo número na última linha rotulada como `Swp` (o que vem depois do `/`) for diferente de zero, então você está pronto.
Por exemplo, se mostrar `0K / 16.0G` então seu espaço de swap foi ativado com sucesso.
Se mostrar `0K / 0K` então não funcionou e você terá que confirmar que inseriu os passos anteriores corretamente.

Pressione `q` ou `F10` para sair do `htop` e voltar ao terminal.

### Configurando Swappiness e Cache Pressure

Por padrão, Linux usará ansiosamente muito espaço de swap para tirar um pouco da pressão da RAM do sistema.
Não queremos isso. Queremos que ele use toda a RAM até o último segundo antes de depender do SWAP.
O próximo passo é mudar o que é chamado de "swappiness" do sistema, que é basicamente quão ansioso ele está para usar o espaço de swap.
Há muito debate sobre qual valor definir para isso, mas descobrimos que um valor de 6 funciona bem o suficiente.

Também queremos reduzir a "cache pressure", que dita quão rapidamente o servidor deletará um cache de seu sistema de arquivos.
Já que vamos ter muita RAM sobrando com nossa configuração, podemos fazer isso "10" o que deixará o cache na memória por um tempo, reduzindo I/O de disco.

Para definir estes, execute estes comandos:

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

Depois salve e saia como você fez antes (`Ctrl+O`, `Ctrl+X`).

### Verificações do Sistema Pré-instalação

Antes de instalar o Rocket Pool, por favor revise a seguinte lista de verificação:

- Seu sistema está totalmente construído, liga e pode inicializar no sistema operacional.
- Você não fará nenhuma outra atividade no sistema, como navegar na Internet, verificar email ou jogar jogos.
- Você tem um sistema operacional Linux instalado.
- Sua conta de usuário tem privilégios root / administrador.
- Você tem um SSD que atende aos requisitos de desempenho.
- Seu SSD está montado no seu sistema de arquivos.
- Você tem pelo menos 1.5 TB de espaço em disco livre para o processo inicial de sincronização de Execution e Consensus.
- Se seu provedor de internet limita seus dados, é mais de 2 TB por mês.

Se você verificou e confirmou todos estes itens, então você está pronto para instalar o Rocket Pool e começar a executar um node!
Prossiga para a seção [Escolhendo seus Clientes ETH](../eth-clients).
