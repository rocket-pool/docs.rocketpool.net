# A Atualização Redstone do Rocket Pool

A próxima grande atualização do Rocket Pool, intitulada **Redstone**, foi lançada para testes beta nas redes de teste Ropsten e Holesky.
Esta página descreve as principais mudanças que a Redstone traz, incluindo atualizações tanto para a stack do Smartnode quanto para o protocolo Rocket Pool em geral.

Por favor, leia esta página cuidadosamente para entender todas as diferenças entre a versão anterior do Rocket Pool e a Redstone.

::: tip ATENÇÃO
Para informações detalhadas sobre como preparar seu nó para a atualização e o que fazer após a atualização, consulte os seguintes guias:

- [Guia para Modo Docker](./docker-migration.mdx)
- [Guia para Modo Híbrido](./hybrid-migration.mdx)
- [Guia para Modo Nativo](./native-migration.mdx)

:::

## Mudanças nos Clientes e O Merge

Ropsten (e em breve, Holesky) passaram com sucesso por **O Merge das Camadas de Execução e Consenso**.
Não usa mais Proof-of-Work; em vez disso, os validadores no Ropsten agora são responsáveis por criar e propor blocos em ambas as cadeias.
Embora isso traga alguns benefícios financeiros empolgantes (que serão discutidos mais tarde), também traz algumas mudanças importantes na forma como os validadores operam.

Abaixo está um breve resumo das mudanças no comportamento do cliente como parte do Merge:

- Seu cliente de Execução agora usa três portas API:
  - Uma para acesso HTTP à sua API (**padrão 8545**)
  - Uma para acesso Websocket à sua API (**padrão 8546**)
  - Uma para a nova **Engine API** usada pelos clientes de Consenso após o Merge (**padrão 8551**)

- Os clientes de Execução agora requerem um cliente de Consenso para funcionar, e os clientes de Consenso agora requerem um cliente de Execução para funcionar.
  - **Nenhum dos dois pode mais operar isoladamente.**

- Um cliente de Execução deve estar vinculado a um, e apenas um, cliente de Consenso (e vice-versa).
  - Você não poderá vincular múltiplos clientes de Execução a um único cliente de Consenso, ou múltiplos clientes de Consenso a um único cliente de Execução.
  - Por causa disso, **clientes de execução de fallback não estão mais disponíveis** para operadores de nó do Rocket Pool.

- **Clientes de execução completos** são necessários.
  - Provedores remotos (como Infura e Pocket) não podem mais ser usados por validadores, Rocket Pool ou outros.

## Destinatários de Taxas e Seu Distribuidor

Como os validadores agora são responsáveis por criar blocos, isso significa que eles recebem as **taxas de prioridade** (também conhecidas como **tips**) anexadas a cada transação.
Essas taxas são pagas em ETH, e são fornecidas diretamente a você toda vez que um de seus validadores de minipool propõe um bloco.
Diferente do ETH bloqueado na Beacon Chain, **você não precisa esperar por retiradas para acessar suas taxas de prioridade**!
Elas são simplesmente concedidas a você como parte do processo de proposta de bloco.

Para saber para onde enviar as taxas, seu Validator Client requer um parâmetro extra conhecido como `fee recipient`.
Este é o endereço na Camada de Execução (ETH1) para onde todas as taxas de prioridade ganhas pelo seu nó durante propostas de bloco serão enviadas.

O Rocket Pool foi projetado para distribuir essas recompensas de forma justa, da mesma forma que distribui de forma justa suas recompensas da Beacon chain: metade de quaisquer taxas de prioridade que seus validadores de minipool ganhem irá para você (mais a comissão média de todos os seus minipools), e a outra metade irá para os stakers do pool (menos sua comissão média).

Para esse fim, o Smartnode definirá automaticamente o `fee recipient` do seu Validator Client para um endereço especial conhecido como **distribuidor de taxas** do seu nó.
Seu distribuidor de taxas é um contrato único na Camada de Execução que é **específico para o seu nó**.
Ele guardará todas as taxas de prioridade que você ganhou ao longo do tempo, e contém a lógica necessária para dividi-las e distribuí-las de forma justa.
Este processo de distribuição é controlado por você (o operador do nó), e pode ser feito quando você quiser.
Não tem limite de tempo.

O endereço do distribuidor de taxas do seu nó é **deterministicamente baseado no endereço do seu nó**.
Isso significa que é conhecido antecipadamente, antes mesmo de o distribuidor de taxas ser criado.
**O Smartnode usará este endereço como seu fee recipient.**

::: tip NOTA
Por padrão, seu fee recipient será definido para o **endereço rETH** quando você instalar o Smartnode v1.5.0 (se as atualizações do contrato Redstone ainda não tiverem sido implantadas).
O Smartnode atualizará automaticamente isso para o endereço do distribuidor de taxas do seu nó assim que a atualização Redstone for implantada.

Uma exceção a esta regra é se você optou pelo **Smoothing Pool** - veja a seção no final desta página para mais informações sobre isso.
:::

Novos nós do Rocket Pool inicializarão automaticamente o contrato distribuidor do seu nó no registro.
Nós existentes precisarão fazer esse processo manualmente.
Isso só precisa ser executado uma vez.

Uma ramificação interessante disso é que o endereço do seu distribuidor pode começar a acumular um saldo **antes** de você ter inicializado seu contrato distribuidor de nó.
Isso está ok, porque seu distribuidor terá acesso a todo esse saldo existente assim que você inicializá-lo.

Você pode visualizar o saldo do seu distribuidor de taxas como parte de:

```shell
rocketpool node status
```

A saída ficará assim:

![](../../node-staking/images/status-fee-distributor.png)

Para inicializar o distribuidor do seu nó, simplesmente execute este novo comando:

```shell
rocketpool node initialize-fee-distributor
```

::: warning NOTA
Após a atualização Redstone, você deve chamar esta função antes de poder criar quaisquer novos minipools com `rocketpool node deposit`.
:::

Quando seu distribuidor tiver sido inicializado, você pode reivindicar e distribuir todo o seu saldo usando o seguinte comando:

```shell
rocketpool node distribute-fees
```

Isso enviará sua parte das recompensas para seu **endereço de retirada**.

## Mudanças no Protocolo Rocket Pool

Além das mudanças nos clientes de Execução e Consenso e das novas taxas de prioridade, o próprio protocolo Rocket Pool passou por algumas mudanças importantes das quais você deve estar ciente.

### Novo Sistema de Recompensas

Uma das mudanças mais significativas introduzidas com a atualização Redstone é o **novo sistema de recompensas**.
Esta é uma revisão completa da forma como os operadores de nó recebem suas recompensas RPL (e ETH do Smoothing Pool - discutido mais tarde).

O _antigo_ sistema de recompensas tinha as seguintes desvantagens:

- Reivindicar custava aproximadamente 400k de gas, o que é bastante caro.
- Os operadores de nó tinham que reivindicar as recompensas em cada intervalo (a cada 28 dias), ou as perderiam. Isso significava que os custos de gas poderiam se tornar proibitivamente caros para operadores de nó com pequenas quantidades de RPL.
- As recompensas eram determinadas no momento da _reivindicação_, não no momento do checkpoint. Se um usuário fizesse stake de uma quantidade significativa de RPL entre o checkpoint e sua reivindicação, suas recompensas poderiam ser diluídas e você receberia menos RPL do que esperava.

O _novo_ sistema de reivindicações resolve todos esses problemas.

Em cada intervalo, o Oracle DAO criará coletivamente um **snapshot verdadeiro** do estado dos operadores de nó na rede Rocket Pool, incluindo todas as suas quantidades de stake efetivas.
Essa informação é compilada em uma [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree) - uma maneira extremamente eficiente de disponibilizar todos os detalhes para contratos inteligentes.
A Merkle Tree é construída em um arquivo JSON e hospedada no [InterPlanetary File System (IPFS)](https://en.wikipedia.org/wiki/InterPlanetary_File_System), e a raiz da Merkle Tree é submetida aos contratos.

Este novo sistema tem as seguintes características:

- Você agora pode **deixar as recompensas acumularem** pelo tempo que quiser. Não há mais limite de tempo para quando você precisa reivindicar.
- Você pode reivindicar **múltiplos intervalos** de uma só vez.
- Sua primeira transação de reivindicação usa cerca de 85k de gas. Cada transação de reivindicação subsequente custa cerca de 55k de gas.
  - Se você estiver reivindicando múltiplos intervalos de uma vez, cada intervalo suplementar custa **6k de gas**, então é mais econômico reivindicar o máximo deles de uma vez que for possível.
- Suas recompensas RPL **não são mais diluídas** - suas recompensas RPL são fixadas no momento do snapshot, e você sempre é elegível para essa quantidade.
- Você pode **refazer stake de parte (ou todo) das suas recompensas RPL** como parte da transação de reivindicação, o que reduz ainda mais os requisitos de gas em comparação com hoje.
- Atualmente, **todas as suas reivindicações devem ser na Mainnet** mas temos a infraestrutura em vigor para construir a capacidade de reivindicar em redes Layer 2 em uma data posterior.

Quando seu nó detecta um novo checkpoint de recompensas, ele baixará automaticamente o arquivo JSON para esse intervalo.
Você pode então revisar suas recompensas usando o seguinte comando:

```shell
rocketpool node claim-rewards
```

À medida que os intervalos passam e você acumula recompensas, a saída ficará assim:

![](../../node-staking/images/claim-rewards-gb.png)

Aqui você pode ver rapidamente quantas recompensas você ganhou em cada intervalo, e pode decidir quais você quer reivindicar.
Note que **o tempo de intervalo do Ropsten está definido para 1 dia para facilitar os testes.**

Você também pode especificar uma quantidade que deseja refazer stake durante esta reivindicação:

![](../../node-staking/images/autostake.png)

Isso permitirá que você componha suas recompensas RPL em uma transação, usando substancialmente menos gas do que você precisa usar hoje.

::: tip NOTA
Se você preferir construir o checkpoint de recompensas manualmente em vez de baixar o criado pelo Oracle DAO, você pode alterar esta configuração de `Download` para `Generate` na TUI:

![](../../node-staking/images/tui-generate-tree.png)

Como a dica implica, você precisará de acesso a um nó archive para fazer isso.
Se seu cliente de Execução local não for um nó archive, você pode especificar um separado (como Infura ou Alchemy) na caixa `Archive-Mode EC URL` abaixo dele.
Esta URL só será usada ao gerar Merkle trees; não será usada para tarefas de validação.
:::

::: danger AVISO
Se você estiver abaixo de 10% de colateral RPL _no momento do snapshot_, você não será elegível para recompensas para esse snapshot.
Diferentemente do sistema atual, onde você pode simplesmente "completar" antes de reivindicar para se tornar elegível novamente, isso ficará travado nesse snapshot para sempre e **você nunca receberá recompensas para esse período**.
Você **deve** estar acima de 10% de colateral no momento de um snapshot para receber recompensas para esse período.
:::

### Smoothing Pool

Uma última característica empolgante nova da atualização Redstone é o **Smoothing Pool**.
O Smoothing Pool é **uma característica opcional** que agrupará coletivamente as taxas de prioridade de cada membro que optou por ele.
Durante um checkpoint de recompensas, o saldo total de ETH do pool é dividido em uma porção para stakers do pool e uma porção para operadores de nó.
Todas as recompensas na porção do operador de nó são **distribuídas de forma justa a cada membro do pool**.

Em essência, o Smoothing Pool é uma maneira de efetivamente eliminar a aleatoriedade associada a propostas de bloco na Beacon Chain.
Se você já teve uma sequência de má sorte e ficou meses sem uma proposta, você pode achar o Smoothing Pool bastante empolgante.

::: tip NOTA
As recompensas do Smoothing Pool são construídas na Merkle Tree usada para recompensas RPL, então você as reivindica ao mesmo tempo que reivindica RPL usando `rocketpool node claim-rewards`.
:::

Para ajudar a esclarecer os detalhes, o Smoothing Pool usa as seguintes regras:

- Optar pelo Smoothing Pool é feito em um **nível de nó**. Se você optar, todos os seus minipools são incluídos.

- A parte total do operador de nó é determinada pela comissão média de cada minipool em cada nó que optou pelo Smoothing Pool.

- Qualquer um pode optar a qualquer momento. Eles devem esperar um intervalo completo de recompensas (1 dia no Ropsten, 28 dias na Mainnet) antes de sair para evitar manipulação do sistema.
  - Uma vez que saiu, você deve esperar outro intervalo completo para optar novamente.

- O Smoothing Pool calcula a "parte" de cada minipool (porção do ETH do pool para o intervalo) de propriedade de cada nó que optou.
  - A parte é uma função do desempenho do seu minipool durante o intervalo (calculado observando quantos atestados você enviou na Beacon Chain, e quantos você perdeu), e da taxa de comissão do seu minipool.

- A parte total do seu nó é a soma das partes dos seus minipools.

- A parte total do seu nó é escalonada pela quantidade de tempo que você optou.
  - Se você optou pelo intervalo completo, você recebe sua parte completa.
  - Se você optou por 30% de um intervalo, você recebe 30% da sua parte completa.

Para optar pelo Smoothing Pool, execute o seguinte comando:

```shell
rocketpool node join-smoothing-pool
```

Isso registrará você como tendo optado nos contratos do Rocket Pool e alterará automaticamente o `fee recipient` do seu Validator Client do contrato distribuidor do seu nó para o contrato do Smoothing Pool.

Para sair do pool, execute este comando:

```shell
rocketpool node leave-smoothing-pool
```

### O Sistema de Penalidades

Para garantir que os operadores de nó não "trapaceiem" modificando manualmente o fee recipient usado em seu Validator Client, o Rocket Pool emprega um sistema de penalidades.

O Oracle DAO monitora constantemente cada bloco produzido pelos operadores de nó do Rocket Pool.
Qualquer bloco que tenha um fee recipient diferente de um dos seguintes endereços é considerado **inválido**:

- O endereço rETH
- O endereço do Smoothing Pool
- O contrato distribuidor de taxas do nó (se não optou pelo Smoothing Pool)

Um minipool que propôs um bloco com um fee recipient **inválido** receberá **uma falta**.
Na terceira falta, o minipool começará a receber **infrações** - cada infração descontará **10% do seu saldo total da Beacon Chain, incluindo ganhos de ETH** e os enviará para os stakers do pool rETH ao retirar fundos do minipool.

As infrações são em nível de **minipool**, não em nível de **nó**.

O software Smartnode foi projetado para garantir que usuários honestos nunca sejam penalizados, mesmo que tenha que colocar o Validator Client offline para fazer isso.
Se isso acontecer, você parará de atestar e verá mensagens de erro em seus arquivos de log sobre por que o Smartnode não pode definir corretamente seu fee recipient.

## Guias para Pré e Pós-Atualização

Para informações detalhadas sobre como preparar seu nó para a atualização e o que fazer após a atualização, consulte os seguintes guias:

- [Guia para Modo Docker](./docker-migration.mdx)
- [Guia para Modo Híbrido](./hybrid-migration.mdx)
- [Guia para Modo Nativo](./native-migration.mdx)
