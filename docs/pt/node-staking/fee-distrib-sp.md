# Distribuidores de Taxas e o Smoothing Pool

Os operadores de nó recebem **taxas de prioridade** (**tips**) das transações que incluem em qualquer bloco que propõem à cadeia Ethereum.
Essas taxas vêm e permanecem na camada de Execução.

Ao contrário da maioria das recompensas de validação que são geradas na camada de Consenso e automaticamente sacadas periodicamente, essas taxas são _imediatamente líquidas_.
Em geral, as taxas de prioridade fornecem quase tanto ETH quanto as recompensas da Beacon Chain, então são um benefício muito bom do Merge.

::: tip NOTA
Como um lembrete rápido, aqui está uma divisão dos diferentes tipos de recompensas e em qual camada elas são fornecidas:

- Camada de Consenso: atestações, propostas de blocos, comitês de sincronização, relatórios de slashing
- Camada de Execução: taxas de prioridade e MEV (discutido na próxima seção) de propostas de blocos

:::

## Destinatários de Taxas

Quando você propõe um bloco na cadeia Ethereum, o protocolo precisa saber para onde enviar as tips de cada transação incluída no seu bloco.
Ele não pode enviá-las para o endereço do seu validador, porque isso está na camada de Consenso - não na camada de Execução.
Ele não pode enviá-las para o endereço do seu minipool, porque precisa funcionar para stakers solo também e stakers solo não têm um endereço na camada de Execução anexado aos seus validadores da maneira que Rocket Pool tem.

Em vez disso, a maneira como funciona é bastante direta: quando Rocket Pool inicia seu Cliente Validador, ele passa um argumento chamado **destinatário de taxa**.
O destinatário de taxa é simplesmente um endereço na camada de Execução para onde você quer que as tips vão.

O `destinatário de taxa` do seu nó pode ser um dos seguintes contratos especiais:

- O **Distribuidor de Taxas** pessoal do seu próprio nó
- O contrato de megapool do seu nó
- O **Smoothing Pool** (opt-in)

O Smart Node definirá automaticamente o destinatário de taxa correto com base na sua configuração:

| Status no Smoothing Pool | Tem Validadores de Megapool | Tem Minipools | Destinatário de Taxa                                                                                                                                                                                                                         |
| ------------------------ | --------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Participando             | Não                         | Sim           | Endereço do Smoothing Pool                                                                                                                                                                                                                   |
| Participando             | Sim                         | Não           | Endereço do Smoothing Pool                                                                                                                                                                                                                   |
| Participando             | Sim                         | Sim           | Endereço do Smoothing Pool (todos os validadores)                                                                                                                                                                                            |
| Fora                     | Não                         | Sim           | Endereço do contrato do Distribuidor de Taxas                                                                                                                                                                                                |
| Fora                     | Sim                         | Não           | Endereço do contrato do Megapool                                                                                                                                                                                                             |
| Fora                     | Sim                         | Sim           | Validadores do Megapool → Endereço do Megapool<br>Validadores do Minipool → Endereço do Distribuidor de Taxas<br>(Definido por validador via [keymanager API](https://ethereum.github.io/keymanager-APIs/#/Fee%20Recipient/setFeeRecipient)) |

Rocket Pool é projetado para distribuir essas recompensas de forma justa entre você e os stakers do pool rETH, da mesma forma que distribui de forma justa suas recompensas da Beacon chain: sua parte de quaisquer taxas de prioridade que seus validadores de minipool ganhem irá para você (mais a comissão média de todos os seus minipools), e a parte restante irá para os stakers do pool (menos sua comissão média).
A proporção exata depende do número de minipools com vínculo de 8 ETH, 16 ETH e validadores de megapool com vínculo de 4 ETH que você possui.

Em resumo, o **Distribuidor de Taxas** é um contrato único anexado ao seu nó que coleta e divide de forma justa suas taxas de prioridade entre você e os stakers do rETH.
É como seu cofre pessoal para taxas de prioridade.
Qualquer pessoa (incluindo você) pode distribuir seu saldo a qualquer momento para garantir que as recompensas estejam sempre disponíveis para os stakers do rETH.

O **Smoothing Pool** é um contrato especial opt-in que permite que todos os operadores de nó participantes agreguem e agrupem suas taxas de prioridade juntas, e as distribuam uniformemente entre os participantes durante cada intervalo de recompensas do Rocket Pool (atualmente a cada 28 dias) e os stakers do pool rETH.
Este é um recurso muito atraente para operadores de nó que não querem se preocupar com o fator sorte envolvido em obter propostas de blocos com taxas de prioridade altas, e prefeririam ter um conjunto de ganhos mensais agradável, regular e consistente.

Cobriremos ambos abaixo para que você entenda a diferença e se deseja ou não entrar no Smoothing Pool.

::: tip NOTA
Para minipools criados após 28-10-2024, o smoothing pool é FORTEMENTE recomendado, pois é usado para distribuir comissão bônus. Se você optar por não participar do smoothing pool, esses minipools receberão 5% de comissão total. Se você optar por participar do smoothing pool, esses minipools receberão entre 10% (sem RPL em stake) e 14% (stake de RPL é avaliado em 10% do ETH emprestado ou mais) de comissão.
:::

## Seu Distribuidor de Taxas

Seu Distribuidor de Taxas é um contrato único na Camada de Execução que é **específico para o seu nó**.
Ele manterá todas as taxas de prioridade que você ganhou ao longo do tempo, e contém a lógica necessária para dividi-las de forma justa e distribuí-las para os stakers do pool rETH e seu endereço de saque.
Este processo de distribuição **pode ser chamado por qualquer pessoa** (incluindo stakers do rETH), e pode ser feito **a qualquer momento**.
Ele não tem um limite de tempo antes que as recompensas expirem.

O endereço para o Distribuidor de Taxas do seu nó é **deterministicamente baseado no endereço do seu nó**.
Isso significa que é conhecido antecipadamente, antes mesmo do Distribuidor de Taxas ser criado.

Novos nós Rocket Pool criarão automaticamente (inicializarão) o contrato do Distribuidor de Taxas do seu nó após o registro.
Isso só precisa ser executado uma vez.

Uma ramificação interessante disso é que o endereço do seu Distribuidor pode começar a acumular um saldo **antes** de você ter inicializado seu contrato do Distribuidor de Taxas.
Isso é aceitável, porque seu Distribuidor ganhará acesso a todo esse saldo existente assim que você o inicializar.

### Visualizando seu Endereço e Saldo

Você pode visualizar o endereço e o saldo do seu distribuidor de taxas como parte de:

```shell
rocketpool node status
```

A saída ficará assim:

![](../node-staking/images/status-fee-distributor.png)

### Reivindicando taxas do seu Distribuidor de Taxas

Você pode reivindicar e distribuir todo o saldo do seu distribuidor de taxas usando o seguinte comando:

```shell
rocketpool node distribute-fees
```

Isso enviará sua parte das recompensas para seu **endereço de saque**.

::: warning NOTA SOBRE EVENTOS TRIBUTÁVEIS
Sempre que você criar um novo minipool, Rocket Pool chamará automaticamente `distribute-fees`.
Isso é para garantir que quaisquer taxas que você acumulou sejam distribuídas usando a comissão média do seu nó, que pode mudar quando você criar o novo minipool. Isso não se aplica à criação de validadores de megapool.

Além disso, observe que qualquer pessoa pode chamar `distribute-fees` no seu distribuidor de taxas (para evitar que você mantenha recompensas do rETH como refém).
Você pode ter um evento tributável sempre que este método for chamado.

Por favor, mantenha essas condições em mente ao decidir se deve ou não usar o Smoothing Pool (discutido abaixo).
:::

### O Sistema de Penalidades

Para garantir que os operadores de nó não "trapaceiem" modificando manualmente o destinatário de taxa usado em seu Cliente Validador, Rocket Pool emprega um sistema de penalidades.

O Oracle DAO é capaz de penalizar operadores de nó que não seguem as regras do protocolo.

Se um nó está _fora_ do Smoothing Pool, os seguintes endereços são considerados destinatários de taxa válidos:

- O endereço do rETH
- O endereço do Smoothing Pool
- O contrato do distribuidor de taxas do nó
- O contrato de megapool do nó

Se um nó está _dentro_ do Smoothing Pool, o seguinte endereço é considerado um destinatário de taxa válido:

- O endereço do Smoothing Pool

Um destinatário de taxa diferente de um dos endereços válidos acima é considerado **inválido**.

O software Smart Node define automaticamente o destinatário de taxa correto com base na sua configuração (se você está participando do Smoothing Pool, e se você tem validadores de megapool, minipools, ou ambos). Para nós com validadores de megapool e minipools enquanto estão fora, o destinatário de taxa é definido por validador usando a keymanager API. A lista completa de condições está resumida [aqui](/pt/node-staking/fee-distrib-sp#destinatários-de-taxas).

O software Smartnode é projetado para garantir que usuários honestos nunca sejam penalizados, mesmo que precise colocar o Cliente Validador offline para fazer isso.
Se isso acontecer, você parará de atestar e verá mensagens de erro em seus arquivos de log sobre por que o Smartnode não pode definir corretamente seu destinatário de taxa.

## O Smoothing Pool

O **Smoothing Pool** é um recurso exclusivo opt-in da rede Rocket Pool que está disponível para nossos operadores de nó.
Essencialmente, ele se torna o destinatário de taxa para cada operador de nó que participa dele e acumula coletivamente as taxas de prioridade de blocos propostos por esses operadores de nó em um grande pool. Durante um ponto de verificação de recompensas do Rocket Pool (os mesmos usados para distribuir recompensas de RPL), o saldo total de ETH do pool é distribuído de forma justa para os stakers do pool e os operadores de nó que participaram dele.

Em essência, o Smoothing Pool é uma maneira de eliminar efetivamente a aleatoriedade associada a ser selecionado para propostas de blocos.
Se você já teve uma sequência de má sorte e passou meses sem uma proposta, ou se suas propostas de blocos só tiveram taxas de prioridade baixas, você pode achar o Smoothing Pool bastante emocionante.

Para facilitar a compreensão da matemática, o membro da comunidade Ken Smith montou uma [análise massiva](https://raw.githubusercontent.com/htimsk/SPanalysis/main/report/Analysis%20of%20the%20Smoothing%20Pool.pdf) comparando a lucratividade do Smoothing Pool e do Distribuidor de Taxas, que é bem resumida com este gráfico:

![](../node-staking/images/sp-chart.png)

Em suma, contanto que o Smoothing Pool tenha mais minipools do que você, é mais provável que você saia na frente ao entrar nele.

### As Regras

O Smoothing Pool usa as seguintes regras:

- Durante um ponto de verificação de recompensas do Rocket Pool quando o saldo do Smoothing Pool é distribuído entre operadores de nó (levando em conta sua comissão), operadores de nó com stake de RPL, stakers de rETH e potencialmente o Rocket Pool DAO. As porcentagens exatas são determinadas pela [governança do Protocol Dao (pDAO) do Rocket Pool](/pt/pdao/overview)

- Optar por participar do Smoothing Pool é feito em **nível de nó**. Se você optar por participar, todos os seus minipools e validadores de megapool participarão.

- Qualquer pessoa pode optar por participar a qualquer momento. Eles devem esperar um intervalo completo de recompensas (3 dias no Hoodi, 28 dias na Mainnet) antes de optar por sair para evitar manipular o sistema (por exemplo, sair do SP logo após ser selecionado para propor um bloco).
  - Uma vez fora, eles devem esperar outro intervalo completo para optar por entrar novamente.

- O Smoothing Pool calcula a "parte" de cada validador (porção do ETH do pool para o intervalo) de propriedade de cada nó participante.
  - A parte é uma função do desempenho do seu validador durante o intervalo (calculado observando quantas atestações você enviou na Beacon Chain e quantas você perdeu), e a taxa de comissão.

- A parte total do seu nó é a soma das suas partes de validador.

- A parte total do seu nó é escalonada pela quantidade de tempo que você participou.
  - Se você participou durante todo o intervalo, você recebe sua parte completa.
  - Se você participou por 30% de um intervalo, você recebe 30% da sua parte completa.

Se você estiver interessado nos detalhes técnicos completos do cálculo de recompensas do Smoothing Pool, revise a [especificação completa aqui](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/rewards-calculation-spec.md#smoothing-pool-rewards).

### Entrando e Saindo do Smoothing Pool

Para optar por participar do Smoothing Pool, execute o seguinte comando:

```shell
rocketpool node join-smoothing-pool
```

Isso registrará você como participante nos contratos do Rocket Pool e mudará automaticamente o `destinatário de taxa` do seu Cliente Validador do contrato distribuidor do seu nó para o contrato do Smoothing Pool.

Para sair do pool, execute este comando:

```shell
rocketpool node leave-smoothing-pool
```

Isso registrará você como não participante nos contratos do Rocket Pool e, uma vez que um pequeno atraso tenha passado, mudará automaticamente o `destinatário de taxa` do seu Cliente Validador do contrato do Smoothing Pool de volta para o contrato do Distribuidor de Taxas do seu nó.

### Reivindicando Recompensas do Smoothing Pool

As recompensas do Smoothing Pool são agrupadas com RPL no final de cada intervalo de recompensas usando o sistema de recompensas Redstone.
Reivindicá-las é tão simples quanto executar:

```shell
rocketpool node claim-rewards
```

Se participou do Smoothing Pool, você notará que a quantidade de ETH que recebe para cada intervalo é maior que zero:

```
Welcome to the new rewards system!
You no longer need to claim rewards at each interval - you can simply let them accumulate and claim them whenever you want.
Here you can see which intervals you haven't claimed yet, and how many rewards you earned during each one.

Rewards for Interval 0 (2022-08-04 01:35:39 -0400 EDT to 2022-09-01 01:35:39 -0400 EDT):
	Staking:        50.820133 RPL
	Smoothing Pool: 0.000000 ETH

Rewards for Interval 1 (2022-09-01 01:35:39 -0400 EDT to 2022-09-29 01:35:39 -0400 EDT):
	Staking:        40.668885 RPL
	Smoothing Pool: 0.096200 ETH

Total Pending Rewards:
	91.489018 RPL
	0.096200 ETH

Which intervals would you like to claim? Use a comma separated list (such as '1,2,3') or leave it blank to claim all intervals at once.
```

Observe que as recompensas do Smoothing Pool no Intervalo 1 aqui indicam que o nó participou durante esse intervalo e recebeu recompensas de acordo.

Cobriremos mais sobre reivindicar recompensas de RPL e Smoothing Pool mais tarde no guia, na seção [Reivindicando Recompensas](./rewards).

## Próximos Passos

Depois de ter decidido se deseja ou não entrar no Smoothing Pool, dê uma olhada na próxima seção sobre MEV e recompensas de MEV.
