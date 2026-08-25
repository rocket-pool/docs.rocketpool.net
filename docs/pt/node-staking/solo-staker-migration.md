# Migrando de Solo Staking para o Rocket Pool

::: danger A CONVERSÃO DE VALIDATORS SOLO NÃO É MAIS POSSÍVEL
A [atualização Saturn 1](/pt/upgrades/saturn-1/whats-new) removeu a possibilidade de converter um validator solo existente diretamente em um validator do Rocket Pool.
Minipools - incluindo os minipools "vacantes" que viabilizavam a conversão de validators solo - não podem mais ser criados, e validators de megapool só podem ser criados por meio de um novo depósito na Beacon Chain.

Para mover seu stake de solo staking para o Rocket Pool, agora você precisa **sair do seu validator solo** e **criar novos validators sob um megapool**.
Esta página explica o que mudou e orienta você pelo novo processo.
:::

## O que mudou no Saturn 1

Antes do Saturn 1, um solo staker podia converter um validator ativo em um minipool do Rocket Pool sem sair da Beacon Chain.
O processo envolvia criar um minipool "vacante" especial, alterar as credenciais de saque do validator das credenciais BLS `0x00` originais para o endereço do minipool, passar pelo scrub check do Oracle DAO e, por fim, promover o minipool.

A atualização Saturn 1 substituiu os minipools pelos [megapools](/pt/node-staking/megapools/overview) como a forma de criar novos validators, e a conversão de validators solo não foi mantida:

- **A criação de minipools está desabilitada no nível do protocolo**, o que inclui os minipools vacantes. Não existe mais um contrato de minipool para o qual você possa apontar as credenciais de saque de um validator existente.
- **Validators de megapool são criados através da fila de depósitos do Rocket Pool** com um novo depósito na Beacon Chain: um prestake de 1 ETH, seguido dos 31 ETH restantes assim que o protocolo verificar on-chain as credenciais de saque do validator.
  Um validator já ativo não pode passar por esse fluxo, portanto não existe mecanismo para absorver um validator solo existente em um megapool.
- Os comandos do Smartnode usados para a conversão (como `rocketpool node create-vacant-minipool` e `rocketpool minipool promote`) foram removidos da CLI.

Em resumo: hoje, a única forma de migrar do solo staking é **sair do seu validator da Beacon Chain e usar o ETH sacado para criar novos validators de megapool**.

## Por que eu migraria?

A migração não é para todos, mas os validators de megapool do Rocket Pool têm várias vantagens sobre os validators de solo staking convencionais:

- Eles **ganham comissão** sobre a porção de ETH emprestada dos stakers do pool (28 ETH por validator).
- Seu stake existente de 32 ETH poderia ser usado para criar até **oito validators de megapool** (com o bond atual de 4 ETH cada), ganhando comissão sobre até 224 ETH de ETH emprestado.
- Eles são elegíveis para participar do [Smoothing Pool](/pt/node-staking/fee-distrib-sp#the-smoothing-pool), que agrupa todas as recompensas da camada de execução (por exemplo, de propostas de blocos e [recompensas MEV](/pt/node-staking/mev)) e as distribui de forma justa entre os participantes a cada intervalo de recompensas.
- Se você stakear RPL no seu megapool, ganhará [recompensas de voter share](/pt/node-staking/megapools/staking-and-claiming-rewards#how-voter-share-is-distributed-to-megapool-rpl-stakers) (uma parte da receita de ETH do protocolo) além das recompensas de inflação de RPL, junto com poder de voto na [governança do pDAO](/pt/pdao/overview). O staking de RPL é totalmente opcional.

Dito isso, há algumas diferenças importantes a destacar:

- Você terá que aceitar o **risco de smart contracts**, já que o protocolo é implementado como uma série de smart contracts.
- A operação de nó convencional utiliza o **stack Smartnode**; você terá que aceitar os riscos associados a instalar e executar esse software no seu nó.
- Ser um operador de nó envolve aprender alguns conceitos novos, então há uma **curva de aprendizado** associada.
- Validators de megapool dividem suas recompensas com os stakers do pool, então o endereço de saque dos seus validators será o seu contrato megapool na camada de execução, **não uma EOA que você controla**. Isso também se aplica ao seu **fee recipient** para as recompensas da camada de execução.
- **Seu capital não rende nada enquanto está em trânsito.** Entre a saída do seu validator solo e a ativação dos seus validators de megapool, você não ganhará recompensas. Novos validators de megapool precisam passar pela fila de depósitos do Rocket Pool _e_ pela fila da Beacon Chain antes de começarem a atestar, então leia a seção **Considerações de tempo** abaixo antes de sair de qualquer coisa.

Recomendamos que você analise cuidadosamente esses prós e contras antes de decidir migrar.
Se quiser continuar com o processo, os passos estão descritos abaixo.

## Passo 1: Saia do seu validator solo

O primeiro passo é sair do seu validator solo da Beacon Chain e sacar seu saldo:

1. Se o seu validator ainda tem credenciais de saque BLS `0x00`, você deve primeiro [atualizá-las para credenciais de saque da camada de execução](https://launchpad.ethereum.org/en/withdrawals) que apontem para um endereço que você controla. Sem isso, seu ETH não poderá ser sacado após a saída.
1. Envie uma **saída voluntária (voluntary exit)** para o validator. Você pode fazer isso com seu cliente de Consenso / Validator; consulte a documentação do seu cliente para os detalhes.
1. Aguarde o validator passar pela fila de saída da Beacon Chain e o saldo completo ser varrido para o seu endereço de saque.

::: warning AVISO
Uma saída voluntária é **irreversível**. Depois que seu validator sai, ele nunca mais poderá validar - o único caminho de volta é criar um novo validator.
Certifique-se de ter lido esta página inteira (especialmente a seção **Considerações de tempo**) antes de sair.
:::

[validatorqueue.com](https://www.validatorqueue.com/) é um site útil para verificar o comprimento atual da fila de saída da Beacon Chain.

## Passo 2: Configure um nó do Rocket Pool

Enquanto espera sua saída ser processada, você pode preparar o seu nó do Rocket Pool.

Se você é novo na operação de nós do Rocket Pool, comece pelo [guia do Operador de Nó](/pt/node-staking/responsibilities), que cobre tudo, desde a seleção de hardware até a [instalação do stack Smartnode](/pt/node-staking/installing/overview) e o [registro do seu nó](/pt/node-staking/prepare-node).
Como você já vinha executando seu próprio validator, muito disso parecerá familiar - e se você já executa seus próprios clientes de Execução e Consenso, pode se interessar pela [configuração híbrida com clientes externos](/pt/node-staking/install-modes#the-hybrid-configuration-with-external-clients).

## Passo 3: Crie seus validators de megapool

Assim que o ETH sacado estiver em mãos, você está pronto para criar validators de megapool usando `rocketpool megapool deposit`.
Atualmente, cada validator requer um **bond de 4 ETH** e toma emprestados **28 ETH** do pool de staking, então seus 32 ETH de stake sacado poderiam financiar até **oito validators de megapool**.
Seu contrato megapool é implantado automaticamente com o depósito do seu primeiro validator, e cada validator criado depois é gerenciado por esse mesmo megapool.

O guia [Criando um Megapool (Validator)](/pt/node-staking/megapools/create-megapool-validator) acompanha você passo a passo por todo o processo, incluindo como a fila de depósitos funciona e como confirmar um stake bem-sucedido.

::: tip NOTA
Diferente do antigo processo de conversão, seus novos validators usarão **novas chaves de validator** geradas a partir da sua wallet do Smartnode.
Suas antigas chaves de validator solo não são reutilizadas, e o Validator Client do Smartnode gerenciará as novas chaves para você - não há mais uma etapa de importação de chaves.
:::

## Considerações de tempo

O antigo processo de conversão não tinha tempo de inatividade: seu validator continuava atestando durante todo o processo.
O novo caminho de migração envolve, sim, inatividade, então vale a pena entender as filas envolvidas antes de sair do seu validator solo:

1. **A fila de saída da Beacon Chain**, que determina a rapidez com que seu validator solo pode sair e ser sacado.
1. **A fila de depósitos do Rocket Pool**, que determina quando seus novos validators são pareados com ETH emprestado do pool de depósitos. Os tickets da fila expressa foram distribuídos aos operadores de nó existentes com base no ETH em bond em minipools legados; nós novos atualmente não recebem nenhum, então os validators de um ex-solo staker entrarão na **fila padrão**.
1. **A fila de depósitos da Beacon Chain**, pela qual os validators de megapool passam **duas vezes**: uma para o prestake de 1 ETH e outra para o stake dos 31 ETH restantes, depois que o protocolo verificar as credenciais de saque do validator.

Você não ganha recompensas desde o momento em que seu validator solo sai até que seus validators de megapool sejam ativados, então verifique as filas antes de se comprometer.

::: tip Links úteis
[validatorqueue.com](https://www.validatorqueue.com/) é um site útil para verificar o comprimento da fila da Beacon Chain. Essa fila depende da quantidade de ETH entrando e saindo da Beacon Chain.
:::

Se a fila de depósitos acabar sendo mais longa do que você gostaria, você pode [remover um validator da fila de depósitos do Rocket Pool](/pt/node-staking/megapools/create-megapool-validator#exit-a-validator-from-the-rocket-pool-deposit-queue) a qualquer momento antes de ele receber ETH e recuperar seu bond como [crédito de depósito](/pt/node-staking/megapools/credit), resgatável em rETH.

## Alternativa: fazer staking sem operar um nó

Se, depois de pesar os prós e contras, você preferir não operar um nó, pode simplesmente stakear seu ETH sacado com o [rETH](/pt/liquid-staking/overview) - o token de liquid staking do Rocket Pool - e ganhar recompensas de staking sem hardware, manutenção ou filas do seu lado.
