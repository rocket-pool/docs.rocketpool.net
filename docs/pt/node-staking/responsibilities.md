# Responsabilidades de um Node Operator

## Como Funciona o Staking no Ethereum

Como lembrete, staking em Proof of Stake é feito via **validators**.
Um validator é essencialmente um único endereço da Beacon Chain para o qual 32 ETH foi depositado na camada de Execution.
Validators são responsáveis por manter a consistência e segurança da Beacon Chain.
Eles fazem isso ouvindo transações e propostas de novos blocos e **atestando** que o bloco proposto contém transações legais e válidas, fazendo alguns cálculos e verificações nos bastidores.
Ocasionalmente, eles podem propor novos blocos eles mesmos.

Validators recebem atestações e propostas de blocos **em uma programação randomizada**.
Isso é muito diferente do antigo sistema Proof of Work, onde todos estavam constantemente tentando competir uns com os outros e encontrar o próximo bloco antes de todos.
Isso significa que, diferente do Proof of Work onde os mineradores não tinham garantia de ganhar uma recompensa de bloco a menos que encontrassem o próximo bloco, validators Proof of Stake _têm_ garantia de ter uma renda lenta e constante desde que desempenhem suas funções.
Se um validator estiver offline e perder uma atestação ou proposta de bloco, ele será **levemente penalizado**.
As penalidades são bem pequenas; como regra geral, se um validator estiver offline por X horas, ele recuperará todo o ETH perdido após as mesmas X horas de estar de volta online.

### Recompensas

Validators ganham recompensas na camada de consenso através de Atestação, Propostas de Blocos, Sync Committees (raro), e Recompensas de Slashing (extremamente raro). Eles também ganham recompensas na camada de execução através de Priority Fees e MEV.

Em 10/2024, o APR geral é ~3.5%, com 2.8% sendo APR da camada de consenso, e 0.7% sendo APR da camada de execução. Um lugar para encontrar esta informação é o [rated explorer](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Penalidades

Validators são penalizados com pequenas quantidades de ETH se estiverem offline e falharem em desempenhar suas funções atribuídas.
Isso é chamado de **leaking**.
Se um validator violar uma das regras centrais da Beacon chain e parecer estar atacando a rede, ele pode ser **slashed**.
Slashing é uma saída forçada de seu validator sem sua permissão, acompanhada de uma multa relativamente grande que remove parte do saldo de ETH do seu validator.

Realisticamente, a única condição que pode causar um slashing é se você executar as chaves do seu validator em dois nodes ao mesmo tempo (como uma configuração de failover/redundância, onde seu node de backup acidentalmente liga enquanto seu node principal ainda está executando).
Não deixe isso acontecer, e **você não será slashed**.
Slashing _não pode ocorrer_ por estar offline para manutenção.

Abaixo está uma tabela que mostra as penalidades que podem acontecer a um validator:

| Tipo                   | Camada   | Quantidade                                                                           |
| ---------------------- | -------- | ------------------------------------------------------------------------------------ |
| Atestação Perdida      | Consenso | -0.000011 ETH\* por atestação (-9/10 do valor de uma recompensa de atestação normal) |
| Proposta Perdida       | Consenso | 0                                                                                    |
| Sync Committee Perdido | Consenso | -0.00047 ETH\* por época (-0.1 ETH total se offline por todo o sync committee)       |
| Slashing               | Consenso | Pelo menos 1/32 do seu saldo, até seu saldo inteiro em circunstâncias extremas       |

\*_Varia com base no número total de validators na rede.
Aproximado para 435.000 validators ativos._

::: tip DICA
Como regra geral, se você estiver offline por X horas (e não estiver em um sync committee), então você recuperará todo o seu ETH perdido após X horas uma vez que estiver de volta online e atestando.
:::

## Como Funcionam os Nodes do Rocket Pool

Diferente dos solo stakers, que são obrigados a depositar 32 ETH para criar um novo validator, nodes do Rocket Pool precisam apenas depositar 8 ETH por validator (chamado de "bond ETH").
Isso será combinado com 24 ETH do staking pool (chamado de "borrowed ETH", que vem de depósitos de liquid stakers em troca de rETH) para criar um novo validator.
Este novo validator pertence a um **minipool**.

Para a Beacon chain, um minipool parece exatamente o mesmo que um validator normal.
Ele tem as mesmas responsabilidades, mesmas regras que deve seguir, mesmas recompensas, e assim por diante.
A única diferença está em como o minipool foi criado na camada de execução, e como as retiradas funcionam quando o node operator decide voluntariamente sair do minipool.
Toda a criação, retirada e delegação de recompensas é gerenciada pelos **smart contracts** do Rocket Pool na blockchain Ethereum.
Isso o torna completamente descentralizado.

Um **Node** do Rocket Pool é um único computador com uma carteira Ethereum que foi registrada com os smart contracts do Rocket Pool.
O node pode então criar tantos minipools quanto puder pagar, todos executando felizmente na mesma máquina juntos.
**Um único node do Rocket Pool pode executar muitos, muitos minipools.**
Cada minipool tem um impacto insignificante no desempenho geral do sistema; algumas pessoas conseguiram executar centenas deles em um único node.

O custo inicial de um minipool é 8 ETH. Além disso, um node operator pode fazer staking de RPL em seu node para se qualificar para recompensas adicionais e para ganhar poder de voto dentro do DAO do protocolo.

## Node Operators do Rocket Pool

**Node operators** são o coração e a alma do Rocket Pool.
Eles são os indivíduos que executam nodes do Rocket Pool.

### Responsabilidades

Eles colocam ETH do staking pool para trabalhar executando minipools com ele, que ganham recompensas de staking para o protocolo Rocket Pool (e assim, aumentam o valor do rETH).
Seu trabalho é direto, mas crucialmente importante: _executar validators com a mais alta qualidade possível, e maximizar recompensas de staking_.

Node operators são responsáveis por:

- Configurar um computador (físico ou virtual)
- Configurá-lo corretamente, incluindo sua rede doméstica se aplicável
- Instalar o Rocket Pool nele e configurar minipools para executar validação
- Protegê-lo, tanto de ameaças externas quanto internas
- Mantê-lo durante a vida de seus validators

É uma grande responsabilidade, e não é um tipo de trabalho simples de configurar e esquecer; você precisa cuidar do seu node enquanto ele estiver fazendo staking.
Com grande responsabilidade, porém, vêm grandes recompensas.

### Recompensas

Aqui estão os principais benefícios de executar um node do Rocket Pool:

- Você ganha sua porção das recompensas de ETH de cada validator, mais comissão.
  - Para minipools com bond de 8 ETH sem RPL em staking, isso resulta em 30% a mais do que solo staking (`(8+24*.1)/8 = 1.3`)
  - Fazer staking de RPL fornece comissão aumentada. Com stake de RPL avaliado em 10% ou mais do seu total de ETH emprestado, as recompensas de ETH chegam a 42% a mais do que solo staking (`(8+24*.14)/8 = 1.42`)
  - **Nota:** se você não participar do smoothing pool, você receberá 15% a mais do que solo staking (`(8+24*.05)/8 = 1.15`) -- é altamente recomendado que usuários com minipools criados em/após 28/10/2024 participem do smoothing pool.
- Você também ganha recompensas de emissão no RPL que você faz staking.
  - No final de um período (a cada 28 dias), há um snapshot do seu RPL.
  - Você pode ganhar rendimento máximo em RPL **até 15%** do valor do seu total de ETH emprestado.
    - Você ganhará rendimento em RPL além disso, a um nível decrescente.
  - Você obterá poder de voto baseado na raiz quadrada do seu RPL em staking.

### Limitações

Existem algumas limitações que vêm junto com as recompensas acima:

- Se seu node tiver um desempenho ruim e você acabar perdendo ETH no momento em que decidir sair do seu minipool, todo o ETH perdido virá da sua parte.
  - Por exemplo: se você sair com um saldo de 30 ETH, então seu minipool perdeu 2 ETH de seu depósito inicial de 32 ETH. Você receberá 6 ETH, e 24 ETH serão devolvidos ao staking pool.
- Seu RPL em staking será menos líquido
  - Você só pode retirar stake de RPL além daquele avaliado em 60% do seu ETH em bond.
  - Você não pode retirar RPL se fez staking nos últimos 28 dias

### Você consegue

Se você é relativamente novo em usar a linha de comando ou manutenção de computadores, isso pode parecer um desafio assustador.
Felizmente, um dos princípios mais fundamentais do Rocket Pool é a _descentralização_ - o fato de que qualquer pessoa, em qualquer lugar, pode executar um node se tiver determinação e conhecimento.
Embora não possamos ajudar com determinação, nós _podemos_ ajudar com conhecimento.
Esta seção está repleta de guias, tutoriais e informações que ajudarão você a entender como executar um ótimo node do Rocket Pool.
