# Monitorando o Desempenho do seu Node

Agora que seu node está em funcionamento e você tem um ou mais minipools conectados, você precisará ficar de olho em tudo para garantir que está funcionando corretamente.

Você pode rastrear sua máquina tanto:

1. Diretamente acessando as métricas da sua máquina
2. Indiretamente através do uso de ferramentas de terceiros

É recomendado usar uma combinação de ambos, dependendo das suas necessidades.

## Rastreando Diretamente o Status da sua Máquina

Com relação ao status da sua máquina, existem algumas métricas úteis que você provavelmente vai querer acompanhar:

- Uso de CPU
- RAM livre restante
- Uso de espaço de swap (se você o habilitou)
- Espaço livre em disco restante
- I/O de rede (se seu provedor de internet impõe um limite de dados)

::: tip NOTA
As seções abaixo mostram algumas maneiras de monitorar as coisas, mas elas exigem que você esteja logado no terminal da sua máquina.
Existe um método melhor, muito mais conveniente e muito mais atraente visualmente que usa um [painel web Grafana](./grafana.mdx), mas ainda está em desenvolvimento.
Fique atento para a conclusão dessa seção!
:::

### CPU, RAM e Swap

Os três primeiros podem ser facilmente visualizados com o programa `htop`.
Isso lhe dará uma visualização ao vivo dos recursos do seu sistema, como mostrado nesta captura de tela de um Raspberry Pi:

```
htop
```

![Htop screenshot on raspberry pi](./local/images/pi/Htop.png)

Na exibição superior com as barras, as barras numeradas se referem ao uso atual de cada núcleo da CPU.

`Mem` mostra quanto RAM você está usando atualmente (nesta captura de tela, 1.75 GB) e quanto você tem no total (3.70 GB).

`Swp` mostra quanto espaço de swap você está usando (85.8 MB) e quanto você tem no total (12.0 GB).

Na tabela inferior, cada linha representa um processo.
Seus clientes de Execution e Consensus provavelmente estarão no topo (neste caso, Geth e Nimbus), que você pode ver na coluna da direita rotulada como `Command`.

A coluna `RES` mostra quanto RAM cada processo está usando - nesta captura de tela, Geth está usando 748 MB e Nimbus está usando 383 MB.

A coluna `CPU%` mostra quanto poder de CPU cada processo está consumindo.
100% representa um único núcleo, então se estiver acima de 100%, significa que está usando muito de múltiplos núcleos (como Geth está aqui, com 213%).

### Espaço Livre em Disco Restante

Ficar de olho em quanto espaço em disco você tem livre é fácil de fazer com o seguinte comando:

```
df -h
```

Isso fornecerá uma saída semelhante ao exemplo a seguir:

```
Filesystem        Size  Used Avail Use% Mounted on
...
/dev/mmcblk0p2     30G   12G   16G  43% /
...
/dev/sda1         1.8T  852G  981G  47% /mnt/rpdata
...
```

Para configurações convencionais onde você tem uma unidade que armazena tanto seu Sistema Operacional quanto seus dados da cadeia de Execution e Consensus, você só precisa olhar para a entrada que tem `/` na coluna `Mounted on`.
Isso representa seu disco principal.
Se isso parecer estar ficando sem espaço (digamos, 80% usado ou mais), então você precisa começar a pensar em fazer alguma limpeza.
Por exemplo, se você estiver executando Geth, você pode querer ver [como fazer o prune dele](./pruning) para liberar algum espaço.

Para configurações que armazenam os dados da cadeia de Execution e Consensus em uma unidade separada, você também vai querer olhar para a linha que tem sua pasta de dados da cadeia na coluna `Mounted on`.
Neste exemplo, montamos um SSD externo em `/mnt/rpdata`, então teremos que ficar de olho nele para garantir que não cresça muito também.

### I/O de Rede e Uso de Dados

Se você quiser rastrear quanto I/O de rede seu sistema usa ao longo do tempo, você pode instalar um utilitário legal chamado `vnstat`.
Aqui está um exemplo de como instalá-lo em um sistema Ubuntu / Debian:

```shell
sudo apt install vnstat
```

Para executá-lo, faça isso (assumindo que `eth0` é o nome da interface de rede que você usa para sua conexão à Internet):

```
vnstat -i eth0
```

Isso não funcionará imediatamente porque precisa de tempo para coletar dados sobre seu sistema, mas conforme os dias e semanas passam, ele vai acabar parecendo assim:

```
$ vnstat -i eth0
Database updated: 2021-06-28 22:00:00

   eth0 since 2021-01-29

          rx:  3.33 TiB      tx:  4.25 TiB      total:  7.58 TiB

   monthly
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
       2021-05    550.19 GiB |  855.34 GiB |    1.37 TiB |    4.51 Mbit/s
       2021-06    498.13 GiB |  784.43 GiB |    1.25 TiB |    4.57 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated    535.31 GiB |  842.97 GiB |    1.35 TiB |

   daily
                     rx      |     tx      |    total    |   avg. rate
     ------------------------+-------------+-------------+---------------
     yesterday     18.35 GiB |   32.00 GiB |   50.36 GiB |    5.01 Mbit/s
         today     18.26 GiB |   30.52 GiB |   48.78 GiB |    5.29 Mbit/s
     ------------------------+-------------+-------------+---------------
     estimated     19.92 GiB |   33.30 GiB |   53.22 GiB |
```

Isso permitirá que você acompanhe seu uso total de rede, o que pode ser útil se seu provedor de internet impõe um limite de dados.

Note que a maioria dos sistemas modernos usa mais comumente outras interfaces de rede como eno0 e enp0s31f6 e não eth0.
Se você precisar verificar sua interface de rede, execute o seguinte comando:

```shell
ls /sys/class/net
```

Dispositivos Ethernet (cabo) geralmente começam com `e`, como os exemplos acima.
Dispositivos sem fio geralmente começam com `w`.

## Notificações de Alerta do Smartnode

[Monitorando sua Stack Smartnode com Notificações de Alerta](./maintenance/alerting.md) explica como usar a funcionalidade de notificação de alerta do Smartnode para receber notificações sobre a saúde e eventos importantes do seu Rocket Pool Smartnode.

## Monitoramento de Desempenho de Terceiros

O melhor monitoramento usa um modelo de queijo suíço: toda ferramenta tem buracos, mas se você as empilha umas sobre as outras, há menos chance de algo passar despercebido e te pegar de surpresa.

Por favor, note que essas ferramentas de terceiros são usadas pela comunidade Rocket Pool, mas não são oficialmente endossadas ou suportadas pela equipe Rocket Pool.
Se você tem uma sugestão de ferramenta, ou é um proprietário de ferramenta, você é muito bem-vindo para adicionar um pull request com detalhes sobre sua ferramenta.

### Site Beaconcha.in: Usando a Beacon Chain como Fonte de Métricas

O site explorador de blocos [Beaconcha.in](https://beaconcha.in) e o app fornecem uma maneira de rastrear o desempenho do seu validador observando sua atividade on-chain.
Eles também têm a opção de receber [notificações por email](https://beaconcha.in/user/notifications) para eventos significativos como tempo de inatividade.
Navegue até o site deles e insira a chave pública do seu validador na caixa de pesquisa no topo da tela.

::: tip
Se você esqueceu a chave pública do seu validador, você pode facilmente recuperá-la com o comando `rocketpool minipool status`.
:::

Se tudo estiver configurado corretamente, você deverá ver algo assim:
![](./local/images/pi/Beaconchain.png)

::: tip NOTA
O link acima é para a versão **mainnet** do Beaconcha.in.
Se você está rodando no Hoodi Testnet, use [este link](https://hoodi.beaconcha.in)!
:::

Este é um registro de toda a atividade da Beacon Chain para seu validador.
Você pode usá-lo para verificar o saldo do seu validador na Beacon Chain para vê-lo crescer ao longo do tempo e calcular seu APY.

Você também pode usá-lo para avaliar rapidamente se seu validador está vivo e funcionando corretamente.
Se estiver, todas as atestações devem dizer `Attested` para seu **Status**, e idealmente todos os **Opt. Incl. Dist.** devem ser 0 (embora um 1 ou 2 ocasional esteja ok).

Se houver muitos blocos que dizem `Missed` neles, então seu validador não está funcionando corretamente.
Você deve verificar os logs dos serviços `eth1`, `eth2` e `validator` com `rocketpool service logs ...` se você estiver usando o modo Docker ou Hybrid (ou os scripts de log correspondentes se você estiver usando o modo Native) para procurar problemas.

**Você deve fixar esta aba ou criar um marcador com ela para que possa rapidamente acessá-la e verificar o status do seu validador.**

#### Usando Beaconcha.in para Monitorar Múltiplos Minipools

Beaconcha.in tem uma [visualização de painel](https://beaconcha.in/dashboard) que permite que você monitore múltiplos validadores ou minipools de uma vez.
Simplesmente adicione seus índices de validador um de cada vez. Se você tem muitos minipools, você pode executar:

```shell
rocketpool minipool status | grep Validator.index | awk -F " " '{print $3}' | paste -s -d, -
```

para obter uma lista separada por vírgulas, e colocá-la na barra de URL assim: `https://beaconcha.in/dashboard?validators=123456,123457`

### App Beaconcha.in: Visão Geral do Validador e Notificações Push

O site Beaconcha.in é uma ótima maneira de visualizar métricas e configurar alertas por email.
O app móvel deles tem uma natureza mais "de relance".
Ele também apresenta um serviço de notificação push que inclui alguns alertas úteis como:

1. Notificações de problemas como atestações perdidas
2. Notificações de rodadas de recompensa do Rocket Pool
3. Sobre/sub-colateralização do RPL no seu node

Note que o app tem uma versão gratuita e opções pagas com recursos de conveniência como widgets na tela inicial.

### Renomeando seus Validadores no Beaconcha.in

O site Beaconcha.in tem um recurso que permite aos usuários renomear seus validadores, tornando-os mais fáceis de identificar/pesquisar.

Para poder usar este recurso você precisa assinar uma mensagem usando a chave privada da carteira do seu node, para provar que você é a pessoa que controla aquele validador.

O Smartnode v1.5.1 inclui a capacidade de assinar mensagens com a chave privada da carteira do seu node usando o comando `rocketpool node sign-message`, depois fornecendo a mensagem que você deseja assinar.
Ela deve conter o termo 'beaconcha.in' para ser usada para renomear seus validadores.

![](../node-staking/images/sign-message.png)

Abra sua página de validador no Beaconcha.in e clique no botão `Edit validator name`.

![](../node-staking/images/edit-validator-name.png)

Copie o resultado do comando sign-message e cole no campo "Signature".
Preencha seu apelido desejado e clique no botão `Save changes`.

![](../node-staking/images/paste-signed-message.png)

### Uptimerobot: Escaneamento de Porta para Tempo de Atividade

O serviço [Uptimerobot](https://uptimerobot.com/) é um serviço simples que escaneia um endereço IP para uma porta aberta.
Se sua máquina ficar indisponível na porta que você especificou, o Uptimerobot pode enviar uma notificação de que há um problema.
O serviço tem uma ampla variedade de opções de notificação incluindo email, notificação push, SMS, chamada telefônica e webhooks.

A tela de configuração se parece com isso:

![](./local/images/uptimerobot.png)

O IP a monitorar é o IP externo do seu node, que você pode encontrar fazendo login no seu node via `ssh` ou fisicamente, e abrindo [icanhazip.com](https://icanhazip.com/) em um navegador ou executando o seguinte comando no seu terminal:

```shell
curl icanhazip.com
```

A porta a monitorar depende da configuração do seu node; usuários executando a instalação típica do Smartnode provavelmente encaminharam as portas 30303 e 9001 para os clientes de Execution e Consensus respectivamente, então essas são boas escolhas para monitoramento de tempo de atividade.

### Painéis de Métricas do Rocketpool

Existem múltiplas iniciativas lideradas pela comunidade para fornecer uma visão geral do desempenho do seu node, bem como da rede Rocket Pool como um todo.

### Scripting com Pushover (avançado)

::: tip NOTA
[Monitorando sua Stack Smartnode com Notificações de Alerta](./maintenance/alerting.md) explica como usar a funcionalidade de notificação de alerta do Smartnode que inclui uma notificação quando há atualizações disponíveis para seu node.
:::

O serviço [Pushover](https://pushover.net/) permite que você envie notificações push para si mesmo.

::: warning NOTA
Esta é uma atividade avançada para realizar.
Pode ser útil se você está familiarizado com shell scripting, mas não é recomendado se você não se sente confortável em um ambiente de shell.
:::

Para começar com Pushover:

1. Crie uma conta em [pushover.net](https://pushover.net/)
1. [Crie um token de API](https://pushover.net/apps/build)
1. Instale o app móvel Pushover e/ou extensão do navegador
1. Chame a API Pushover para qualquer ação que você se importe

Chamar a API Pushover para enviar uma notificação push é feito através de uma chamada `curl` estruturada assim:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE=
MESSAGE_CONTENT=
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json
```

#### Exemplo: Notificação Push quando Atualizações Estão Disponíveis

Se você configurar atualizações automáticas usando os pacotes `unattended-upgrades` e `update-nofifier`, você pode querer receber uma notificação push quando há atualizações disponíveis para seu node.
Uma maneira potencial de fazer isso é criar um script em `~/update-notifier.sh` e acioná-lo diariamente às 9:00 usando `crontab`.

Para fazer isso, primeiro crie o script executando:

```shell
nano ~/update-notifier.sh
```

Depois cole o seguinte script:

```shell
#!/bin/bash

PUSHOVER_USER=
PUSHOVER_TOKEN=
NODE_ADDRESS="$(rocketpool node status | grep -Po "(?<=The node )(0x[A-Za-z0-9]{40})")"
EXPLORER_URL=https://beaconcha.in/validators/deposits?q=
#EXPLORER_URL=https://www.rp-metrics-dashboard.com/dashboard/MAINNET/
NOTIFICATION_URL="$EXPLORER_URL$NODE_ADDRESS"

# Check if the update-notifier file is showing updates available
if cat /var/lib/update-notifier/updates-available | grep -Pq '^(?!0)[0-9]* updates can be applied'; then


   MESSAGE_TITLE="⚠️ Rocket Pool node system updates available"
   MESSAGE_CONTENT="$( cat /var/lib/update-notifier/updates-available | grep -P '^(?!0)[0-9]* updates can be applied' )"

else

   MESSAGE_TITLE="✅ Rocket Pool node system up to date"
   MESSAGE_CONTENT="No system updates available"

fi

curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=$NOTIFICATION_URL&priority=0" https://api.pushover.net/1/messages.json

```

Em seguida, execute o seguinte comando para marcar o script como executável:

```shell
chmod u+x ~/update-notifier.sh
```

Agora execute o seguinte comando para abrir seu crontab:

```shell
crontab -e
```

Depois use as teclas de seta para rolar para baixo, e adicione a linha `* 9 * * * ~/update-notifier.sh` para que o arquivo fique assim:

```shell
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').
#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command

# This like triggers at 9 AM local time
# to configure your own times, refer to https://crontab.guru/
0 9 * * * ~/update-notifier.sh
```

Depois pressione `control+x` para sair e pressione `Y` quando perguntado se você quer salvar suas alterações.

Você deve agora receber uma notificação às 09:00 hora local se você tiver atualizações.
Você pode executar manualmente o script digitando isso no seu terminal:

```shell
~/update-notifier.sh
```

#### Exemplo: Seja Notificado quando seu APC UPS Daemon Ativar

Alguns home stakers estão usando uma fonte de alimentação ininterrupta com o utilitário `apcupsd` para garantir que seu node desligue graciosamente se a energia acabar.

O utilitário `apcupsd` usa o script `apccontrol` para gerenciar sua lógica, portanto é possível monitorar a atividade desse daemon editando o arquivo `/etc/apcupsd/apccontrol`.
Para fazer isso, execute:

```shell
sudo nano /etc/apcupsd/apccontrol
```

Depois no topo da linha adicione o seguinte código para que o arquivo fique assim:

```shell
PUSHOVER_USER=
PUSHOVER_TOKEN=
MESSAGE_TITLE="UPS Daemon called"
MESSAGE_CONTENT="called with: $1"
curl -f -X POST -d "token=$PUSHOVER_TOKEN&user=$PUSHOVER_USER&title=$MESSAGE_TITLE&message=$MESSAGE_CONTENT&url=&priority=0" https://api.pushover.net/1/messages.json

#
# Copyright (C) 1999-2002 Riccardo Facchetti <riccardo@master.oasi.gpa.it>
#
# platforms/apccontrol.  Generated from apccontrol.in by configure.
```

Isso enviará uma notificação push sempre que seu daemon UPS tomar uma ação, incluindo funcionalidade periódica de "auto teste".
