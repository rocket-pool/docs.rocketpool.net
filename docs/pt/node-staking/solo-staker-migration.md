::: danger AVISO
Depósitos de minipool estão atualmente desabilitados em preparação para Saturn 1.
:::

# Convertendo um Validador Solo em um Minipool

Quando a Beacon Chain foi lançada pela primeira vez, os validadores foram criados com um par especial de chaves criptográficas - a **chave do validador** e a **chave de retirada**.

A chave do validador é uma "hot key", o que significa que precisa ser armazenada em uma máquina ativa conectada à Internet; esta é a chave usada para assinar suas atestações e propostas, e também serve como seu "endereço" na Beacon Chain (a string hexadecimal usada para identificar seu validador).

A chave de retirada, por outro lado, é uma "cold key", o que significa que _não_ (e, de fato, _não deveria_) ser armazenada em uma máquina ativa conectada à Internet.
É destinada a ser trancada em armazenamento frio para que não possa ser acessada até que seja necessária.
Ao contrário da chave do validador, a chave de retirada não é responsável por deveres de validação.
Em vez disso, seu único trabalho é gerenciar a retirada dos fundos do seu validador na Beacon Chain (uma vez que as retiradas fossem implementadas).

Este sistema de chave dupla foi a arquitetura inicial com a qual a Beacon Chain foi lançada.
Na época, nem o Merge nem as retiradas haviam sido projetados ainda, mas este sistema foi considerado robusto o suficiente para lidar com qualquer forma que o protocolo assumisse quando ambos fossem implementados.

Avançando para hoje, e agora temos uma compreensão muito melhor de como as retiradas funcionam.
Felizmente, elas foram implementadas de uma forma que torna possível para um validador existente de staking solo na Beacon Chain (que está usando as credenciais de chave de retirada antigas) converter **diretamente em um minipool Rocket Pool** sem precisar sair do validador da Beacon Chain!

Se você está interessado em aprender mais sobre este processo, então este guia é para você.
Vamos cobrir como as retiradas funcionam no Ethereum em alto nível, explicar como o processo de conversão funciona, e terminar com um passo a passo detalhado de como converter seu validador em um minipool.

## Por Que Eu Converteria?

Antes de entrar nos detalhes técnicos, uma pergunta muito importante a responder é _por que_ um solo staker consideraria este processo em primeiro lugar.
A conversão em um minipool não é para todos, mas esta seção ajudará você a fazer uma escolha informada sobre se é algo que você gostaria de buscar ou não.

Os minipools Rocket Pool desfrutam de várias vantagens sobre validadores convencionais de staking solo:

- Eles **ganham comissão** na porção de ETH que emprestam dos pool stakers (24 ETH).
- Seus 32 ETH de bond existentes poderiam ser usados para criar até **três validadores adicionais** (além do que você já tem).
- Eles são elegíveis para participação no [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) que agrupa todas as recompensas da camada de Execução (por exemplo, de propostas de bloco e [recompensas MEV](./mev.mdx)) e as distribui de forma justa entre os participantes durante cada intervalo de recompensas.
- Se você apostar RPL, eles ganharão comissão bônus e recompensas de inflação RPL (que atualmente fornecem um APR maior do que as recompensas de staking ETH).

Dito isso, existem algumas diferenças que são importantes destacar:

- Você terá que aceitar **risco de smart contract**, já que o protocolo é implementado como uma série de smart contracts.
- Da mesma forma, a operação de nó convencional aproveita a **stack Smartnode**; você terá que aceitar quaisquer riscos associados à instalação e execução desse software em seu nó.
- Ser um node operator envolve aprender alguns conceitos novos, então há uma **curva de aprendizado** associada a se tornar um.
- Os minipools são obrigados a dividir suas recompensas com os pool stakers, então o endereço de retirada do validador será um smart contract na camada de Execução, **não um EOA que você controla**. Isso também se aplica ao seu **fee recipient** para recompensas da camada de Execução, que também deve ser um smart contract que pode dividir suas recompensas de forma justa.
- O **Oracle DAO** da Rocket Pool é responsável por transportar informações da Beacon Chain para a camada de Execução, e por detectar violações que o protocolo não pode impor (como um endereço de fee recipient ilegal). Executar um minipool significa que você terá que confiar no Oracle DAO para fazer esse trabalho corretamente.

Encorajamos você a passar cuidadosamente por esses prós e contras antes de decidir converter seu validador solo.
Se você gostaria de continuar com o processo, por favor leia as próximas seções.

## Pré-requisitos

Para começar o processo de conversão, você precisará atender aos seguintes critérios:

1. Você deve ter [um nó registrado na rede Rocket Pool](./prepare-node.mdx) para hospedar o novo minipool.
1. O validador que você deseja migrar deve estar **ativo** na Beacon chain. Ele não pode estar pendente, slashed, saindo / saiu, ou retirado.
1. O validador deve ter um saldo de **pelo menos 32 ETH** na Beacon chain.
1. O validador deve ter [credenciais de retirada de chave BLS](https://launchpad.ethereum.org/pt/withdrawals) (credenciais `0x00`). A conversão **não pode** ser feita em validadores que já migraram para outras credenciais de retirada da camada de Execução (credenciais `0x01`).
1. (Opcional) Se você pretende que o Smartnode migre as credenciais de retirada para você automaticamente, você deve ter sua **frase mnemônica em mãos**.

Se nenhuma dessas condições for um impedimento para você, então você é elegível para começar a conversão do validador.

## Visão Geral do Processo

O primeiro passo é **criar um novo minipool "vacant"**.
Ao contrário dos minipools convencionais, que fazem um novo validador durante sua criação, minipools vacant são minipools especiais projetados para gerenciar validadores _existentes_.
Como consequência, os minipools vacant se comportam de forma ligeiramente diferente dos minipools convencionais durante o estágio `prelaunch`.
Uma vez que a inicialização é finalizada e eles entram no estágio `staking`, eles se tornam minipools convencionais.

Durante a criação do minipool vacant, você terá a opção de fazer com que o Smartnode **altere automaticamente as credenciais de retirada do seu validador** da antiga chave de retirada BLS para o novo endereço do minipool vacant.
Se você não quiser fazer isso agora, pode fazer com que o Smartnode faça isso mais tarde com um comando dedicado, ou pode fazer você mesmo com uma ferramenta de terceiros.
Note que alterar as credenciais de retirada do validador para o endereço do minipool é **obrigatório** para conversão, então, independentemente de como você faça isso, precisará ser feito para que o processo seja concluído com sucesso.

Uma vez que as credenciais de retirada foram alteradas, você terá a opção de **importar a chave privada do validador** para o Validator Client gerenciado pelo Smartnode.
Se você quiser que o Smartnode mantenha o validador para que você não tenha que gerenciar o seu próprio, esta é uma opção atraente.
Se você preferir manter seu próprio Validator Client e manter as chaves lá, você é bem-vindo para fazer isso.

Neste ponto, seu novo minipool entrará no período de **verificação de scrub**, onde o Oracle DAO analisará continuamente as informações do seu validador na Beacon Chain para confirmar que ele permanece legal.
Isso inclui:

- As credenciais de retirada ainda não foram migradas (ainda são as credenciais de chave BLS `0x00` originais) ou foram migradas para o endereço do minipool. Migrá-las para qualquer outro endereço da camada de Execução fará com que o pool seja scrubbed.
  - Se as credenciais de retirada ainda forem as credenciais de chave BLS `0x00` originais quando o período de verificação de scrub terminar, o pool será scrubbed.
- O validador está no estado de staking ativo durante a duração da verificação. Se ele transitar para os estados slashed, exited ou withdrawn, o pool será scrubbed.

::: tip NOTA
Um minipool vacant **scrubbed** significa que ele não faz parte da rede Rocket Pool, mas ainda dará a você (o node operator) acesso a todos os seus fundos através dos métodos típicos de recuperação de tokens no CLI.
Os fundos **não são perdidos** se os minipools vacant forem scrubbed.
Mais informações sobre minipools scrubbed, suas ramificações e como usá-los estão incluídas mais adiante neste guia.
:::

Após a verificação de scrub passar, você poderá **promover** seu minipool vacant.
Isso finalizará a conversão e o transformará de um minipool vacant em um regular.
Neste ponto, o minipool agirá como qualquer outro minipool na rede, e seu validador solo será oficialmente convertido em um validador Rocket Pool!

Como parte do processo, a rede capturará um snapshot do total de suas recompensas na Beacon chain (e dentro do seu novo minipool, se você for skimmed durante a verificação de scrub).
Ela reconhecerá que todas essas recompensas pertencem a você e não devem ser compartilhadas com o staking pool, então ela fornecerá todas elas como um **reembolso** que você pode reivindicar a qualquer momento após a promoção ser concluída.

Abaixo está um passo a passo detalhado do processo de conversão, incluindo instruções para cada etapa.

## Etapa 1: Criando um Minipool Vacant

Para começar o processo de conversão, execute o seguinte comando com o CLI Smartnode:

```
rocketpool node create-vacant-minipool <validator pubkey>
```

Por exemplo, se você quisesse converter um validador solo com pubkey `0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661`, você executaria:

```
rocketpool node create-vacant-minipool 0xb82ccba6093747559361a5495c7e2c607e76ea3543d556319355ce80289bb819fd787f715f60615cdd358c0476b40661
```

Você verá um breve resumo sobre o que esperar durante o processo, então será solicitado para qual valor de bond você gostaria de usar ao criar este minipool:

```
Please choose an amount of ETH you want to use as your deposit for the new minipool (this will become your share of the balance, and the remainder will become the pool stakers' share):

1. 8 ETH
```

Uma vez que você selecionar **8 ETH**, você converterá seu validador em um minipool com bond de 8 ETH.
Seu depósito original de 32 ETH será convertido em um depósito de 8 ETH, com 24 ETH emprestados dos pool stakers.
Uma vez que o processo de conversão esteja completo, você terá um [saldo de crédito](./credit) de 24 ETH que você pode usar para criar mais minipools.

Uma vez que você selecione uma opção, o Smartnode executará algumas verificações para confirmar que o validador que você inseriu e seu nó passam em todos os requisitos prévios listados acima.
Depois disso, ele pedirá que você confirme seu preço de gás e então envie a transação para criar o novo minipool vacant.
Na criação, você receberá o endereço do minipool:

```
Your minipool was made successfully!
Your new minipool's address is: 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

Este é o endereço que você usará ao alterar as credenciais de retirada do seu validador.

Neste ponto, o Smartnode perguntará se você gostaria que o Smartnode fizesse isso automaticamente (junto com a importação da chave privada do validador para o Validator Client gerenciado pelo Smartnode, que é discutido mais tarde):

```
You have the option of importing your validator's private key into the Smartnode's Validator Client instead of running your own Validator Client separately. In doing so, the Smartnode will also automatically migrate your validator's withdrawal credentials from your BLS private key to the minipool you just created.

Would you like to import your key and automatically migrate your withdrawal credentials? [y/n]
```

Se você responder `y` a esta pergunta, o Smartnode fará as Etapas 2 e 3 automaticamente; por favor veja a seção [Alteração Automática de Credenciais de Retirada e Importação de Chave](#alteração-automática-de-credenciais-de-retirada-e-importação-de-chave) abaixo.

Se você responder `n` a esta pergunta, o comando terminará e você terá terminado a Etapa 1.
Por favor, vá para a seção [Etapa 2](#etapa-2-alterando-as-credenciais-de-retirada-do-validador) em seguida.

::: tip NOTA
Se você recusar este processo agora, pode retomá-lo posteriormente usando o CLI.
Leia as seções [**Etapa 2**](#etapa-2-alterando-as-credenciais-de-retirada-do-validador) e [**Etapa 3**](#opcional-etapa-3-importar-a-chave-do-validador) abaixo para aprender como fazer isso.
:::

### Alteração Automática de Credenciais de Retirada e Importação de Chave

::: danger AVISO
Se você optar por fazer com que o Smartnode altere automaticamente suas credenciais de retirada e importe a chave privada do seu validador, é **essencial** que você remova a chave do validador do seu antigo Validator Client que você gerencia por conta própria, e **desligue o antigo Validator Client** para garantir que ele não tenha a chave carregada na memória ainda.

Você também deve esperar **pelo menos 15 minutos** depois de fazer isso para garantir que ele **intencionalmente perdeu pelo menos duas atestações**.
Você pode verificar isso olhando em um chain explorer como [https://beaconcha.in](https://beaconcha.in).

Se você não esperar pelo menos 15 minutos, seu validador **SERÁ SLASHED** quando o Validator Client do Smartnode começar a atestar com a chave do seu validador!

Recomendamos fortemente que você habilite a **detecção de doppelganger** na configuração do Smartnode também, para estar o mais seguro possível contra o risco de slashing.
:::

Se você escolher importar automaticamente a chave do validador e alterar as credenciais de retirada para o endereço do minipool, o Smartnode primeiro pedirá o mnemônico usado para gerar tanto a chave privada BLS do seu validador quanto sua chave de retirada original correspondente:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Ao inserir, o Smartnode derivará sua antiga chave de retirada baseada em BLS usando o mnemônico e a pubkey do validador.
Ele então enviará uma mensagem para a Beacon Chain, assinada por sua chave de retirada, indicando que você deseja alterar as credenciais de retirada da antiga chave de retirada BLS para o novo endereço do minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

Finalmente, ele importará a chave do seu validador para o Validator Client do Smartnode e perguntará se você gostaria de reiniciá-lo, para que ele comece a validar com essa chave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Com isso, as etapas 2 e 3 foram concluídas.
Você pode verificar que as credenciais de retirada foram alteradas corretamente e que a chave está validando ativamente usando um chain explorer como [https://beaconcha.in](https://beaconcha.in)

Vá para a seção [Etapa 4](#etapa-4-atribuir-o-fee-recipient-correto) para aprender sobre como atribuir o fee recipient correto.

## Etapa 2: Alterando as Credenciais de Retirada do Validador

Quando você criou o novo minipool vacant, o próximo passo é alterar as credenciais de retirada do seu validador das antigas credenciais de chave BLS `0x00` para as novas credenciais `0x01` que contêm o novo endereço do minipool.

Existem duas maneiras de fazer isso:

1. Usando o CLI Smartnode, através do comando `rocketpool minipool set-withdrawal-creds`.
1. Usando uma ferramenta externa de terceiros como [ethdo](https://github.com/wealdtech/ethdo).

Neste guia, vamos mostrar como usar o método 1 (o Smartnode).
Para mais informações sobre o método 2, consulte a documentação da ferramenta que você gostaria de usar.

Comece executando o seguinte comando:

```
rocketpool minipool set-withdrawal-creds <minipool address>
```

Por exemplo, se o novo endereço do minipool vacant fosse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, você executaria isso:

```
rocketpool minipool set-withdrawal-creds 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

O Smartnode então pedirá o mnemônico usado para gerar tanto a chave do seu validador quanto sua chave de retirada correspondente:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Depois disso, ele executará algumas verificações de segurança para garantir que as credenciais de retirada do seu validador possam ser alteradas.
Se for bem-sucedido, ele então enviará uma mensagem para a Beacon Chain, assinada por sua chave de retirada, indicando que você deseja alterar as credenciais de retirada da antiga chave de retirada BLS para o novo endereço do minipool:

```
Changing withdrawal credentials to the minipool address... done!
```

É isso!
Você pode verificar que as credenciais de retirada foram alteradas corretamente usando um chain explorer como [https://beaconcha.in](https://beaconcha.in).

## (Opcional) Etapa 3: Importar a Chave do Validador

Uma vez que você converta seu validador em um minipool, você pode querer que o Validator Client do Smartnode o execute em vez daquele que você gerencia atualmente por conta própria.
Isso tem algumas vantagens:

- É "mais limpo" de um ponto de vista organizacional (o Smartnode gerencia seus minipools, seu Validator Client gerenciado externamente gerencia seus validadores de staking solo).
- Ele permite que comandos como `rocketpool minipool exit` (comandos que requerem sua chave de validador para assinar mensagens) funcionem.

No entanto, existem algumas **considerações muito importantes** para entender antes de fazer isso:

- Você **deve garantir** que a chave do seu validador foi removida do seu próprio Validator Client, e que você esperou pelo menos 15 minutos depois de removê-la antes de importá-la para o Smartnode. Veja a caixa de aviso abaixo.
- Você **deve garantir** que você tem seu keystore do validador _e seu arquivo de senha_ com backup, porque comandos como `rocketpool wallet recover` e `rocketpool wallet rebuild` **não podem** regenerá-los sem um backup, já que eles não foram derivados do mnemônico da carteira do Smartnode.

Se você gostaria de importar sua chave de validador para o Smartnode, continue lendo abaixo.

::: danger AVISO
Se você optar por fazer com que o Smartnode importe a chave privada do seu validador, é **essencial** que você remova a chave do validador do seu antigo Validator Client que você gerencia por conta própria, e **desligue o antigo Validator Client** para garantir que ele não tenha a chave carregada na memória ainda.

Você também deve esperar **pelo menos 15 minutos** depois de fazer isso para garantir que ele **intencionalmente perdeu pelo menos duas atestações**.
Você pode verificar isso olhando em um chain explorer como [https://beaconcha.in](https://beaconcha.in).

Se você não esperar pelo menos 15 minutos, seu validador **SERÁ SLASHED** quando o Validator Client do Smartnode começar a atestar com a chave do seu validador!

Recomendamos fortemente que você habilite a **detecção de doppelganger** na configuração do Smartnode também, para estar o mais seguro possível contra o risco de slashing.
:::

Comece executando o seguinte comando:

```
rocketpool minipool import-key <minipool address>
```

Por exemplo, se o novo endereço do minipool vacant fosse `0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C`, você executaria isso:

```
rocketpool minipool import-key 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
```

O Smartnode então pedirá o mnemônico usado para gerar a chave do seu validador:

```
Please enter the number of words in your mnemonic phrase (24 by default):
24

Enter Word Number 1 of your mnemonic:
...

Enter Word Number 24 of your mnemonic:
```

Depois disso, ele percorrerá as diferentes chaves geradas a partir desse mnemônico até encontrar a chave pública do seu validador.
Ele então a importará, e perguntará se você gostaria de reiniciar o Validator Client do Smartnode para que ele carregue sua chave:

```
Importing validator key... done!
Would you like to restart the Smartnode's Validator Client now so it loads your validator's key? [y/n]
y
Restarting Validator Client... done!
```

Com isso, sua chave de validador agora está importada no Smartnode e você deve vê-la começar a atestar.
Você pode confirmar seguindo os logs do Validator Client com este comando:

```
rocketpool service logs validator
```

Você também pode verificar que um chain explorer como [https://beaconcha.in](https://beaconcha.in) pode ver seu Validator Client atestando com a chave do seu validador.

## Etapa 4: Atribuir o Fee Recipient Correto

Uma vez que você tenha iniciado o processo de migração, é **imperativo** que você garanta que seu [fee recipient](./fee-distrib-sp#fee-recipients) esteja configurado corretamente (seja para o [fee distributor](./fee-distrib-sp#your-fee-distributor) do seu nó ou para o [Smoothing Pool](./fee-distrib-sp#the-smoothing-pool) se você optou por ele).
Se você não fizer isso e deixar no fee recipient para seus validadores solo, você será penalizado e uma porção do seu stake na Beacon Chain será deduzida para compensar a perda.

::: tip NOTA
**Esta etapa só é necessária se você deixar sua chave de validador em seu próprio Validator Client gerenciado externamente.**

Se você removê-la do seu próprio VC e importá-la para o VC gerenciado pelo Rocket Pool, seu fee recipient será atribuído ao endereço correto automaticamente pelo processo `node`.
:::

Como você pode reter outras chaves de solo-staking em seu VC que você _não_ deseja configurar para o fee distributor ou Smoothing Pool, a única maneira de fazer isso é usar um arquivo de configuração do VC para definir manualmente o fee recipient para o validador sendo migrado.

Este processo depende de qual Consensus Client você usa; consulte a documentação para os detalhes específicos, mas aqui estão alguns links úteis:

[Lighthouse: via `validator_definitions.yml`](https://lighthouse-book.sigmaprime.io/suggested-fee-recipient.html#1-setting-the-fee-recipient-in-the-validator_definitionsyml)

**Lodestar** atualmente não suporta definir fee recipients específicos por validador. Por favor, não use Lodestar se você estiver mantendo a chave em seu VC gerenciado externamente com outras chaves solo que não estão sendo migradas.

[Nimbus: via keymanager API](https://nimbus.guide/keymanager-api.html)

[Prysm: via `proposer-settings-file`](https://docs.prylabs.network/docs/execution-node/fee-recipient#configure-fee-recipient-via-jsonyaml-validator-only)

[Teku: via `validators-proposer-config`](https://docs.teku.consensys.net/how-to/configure/use-proposer-config-file)

Se você está usando eth-docker, pode usar o comando [`./ethd keys set-recipient`](https://eth-docker.net/Support/AddValidator#set-individual-fee-recipient) para definir recipients individuais para cada chave que você está usando conforme descrito em sua documentação.

## Etapa 5: Aguardando a Verificação de Scrub

Até este momento, você deve ter concluído as etapas 1 e 2 (criando o minipool vacant e alterando as credenciais de retirada do seu validador) e opcionalmente a etapa 3 (importando a chave para o Smartnode).
O próximo passo é esperar que a **verificação de scrub** seja concluída.
Este é um processo realizado pelo Oracle DAO para verificar o seguinte:

1. O saldo do seu validador na Beacon Chain (e o saldo do seu minipool na camada de Execução) devem somar **pelo menos** o saldo que seu validador tinha quando você criou pela primeira vez o minipool vacant, menos um pequeno buffer de 0,01 ETH para contabilizar quaisquer atestações perdidas acidentalmente durante a manutenção.

- Por exemplo, se seu validador tinha um saldo de Beacon Chain de 35 ETH quando você executou a etapa 1, os saldos combinados da Beacon Chain e do minipool devem ser **pelo menos** 34,99 ETH durante toda a duração da verificação de scrub.

2. Seu validador deve permanecer no status **ativamente staking** durante toda a verificação de scrub - ele não pode ser slashed, exited ou withdrawn.
3. As credenciais de retirada do seu validador devem ser as **credenciais de chave de retirada baseadas em BLS originais**, ou as **novas credenciais 0x01 usando o endereço do minipool**. Quaisquer outras credenciais farão com que o minipool seja scrubbed.

- Você recebe um período de carência de **aproximadamente 2 dias e meio** para executar a alteração de credenciais de retirada (85% da duração do período de scrub de 3 dias).

A verificação de scrub é transitória; você não precisa fazer nada durante este tempo além de manter seu validador online e com bom desempenho.

Para monitorar quanto tempo resta na verificação de scrub, você pode olhar os logs do `node` com o seguinte comando:

```
rocketpool service logs node
```

As linhas relevantes se parecerão com isto:

```
rocketpool_node  | 2023/03/06 04:51:32 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 04:51:32 Minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C has 44m0s left until it can be promoted.
```

Durará **3 dias**, após os quais você passou e pode prosseguir para [Etapa 6](#etapa-6-promovendo-o-minipool) para promover o minipool vacant para um completo.

### Trabalhando com Minipools Scrubbed

Se seu minipool infelizmente falhar na verificação de scrub e for dissolvido, não se preocupe - seu capital não está perdido.
Minipools vacant dissolvidos essencialmente atuam como endereços de retirada simplificados:

- Eles não são tecnicamente parte da rede Rocket Pool.
- Qualquer capital depositado no minipool pertence _exclusivamente_ ao node operator. Ele _não_ é dividido com os pool stakers.
- Você não recebe um crédito de depósito por criar o minipool.

Você pode acessar o saldo do minipool a qualquer momento com o seguinte comando:

```shell
rocketpool minipool distribute-balance
```

Isso enviará todo o saldo do minipool para o endereço de retirada do seu nó.

Quando você sair do seu validador da Beacon Chain e seu saldo completo for enviado para o minipool, você pode recuperá-lo e fechar o minipool com o seguinte comando:

```shell
rocketpool minipool close
```

Mais uma vez, isso enviará todo o saldo do minipool para o endereço de retirada do seu nó.

## Etapa 6: Promovendo o Minipool

Quando a verificação de scrub for aprovada com sucesso, você pode promover o minipool vacant para um minipool completo.
Isso pode ser feito de duas maneiras:

1. Deixe o processo `node` lidar com isso automaticamente assim que a verificação de scrub terminar.
1. Faça isso manualmente usando o CLI.

O primeiro método promoverá o minipool para você automaticamente, assumindo que você tenha o processo / container `node` em execução e o custo de gás da rede esteja abaixo do limite de transação automatizada que você especificou no processo de configuração do Smartnode (padrão de 150).
Nos logs do `node`, você verá uma saída como a seguinte:

```
rocketpool_node  | 2023/03/06 05:37:00 Checking for minipools to promote...
rocketpool_node  | 2023/03/06 05:37:00 1 minipool(s) are ready for promotion...
rocketpool_node  | 2023/03/06 05:37:00 Promoting minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C...
rocketpool_node  | 2023/03/06 05:37:01 This transaction will use a max fee of 34.736742 Gwei, for a total of up to 0.009597 - 0.014396 ETH.
rocketpool_node  | 2023/03/06 05:37:01 Transaction has been submitted with hash 0x93c2662def6097da28e01b9145259736575ffc43b539b002b27e547065e66d7e.
rocketpool_node  | 2023/03/06 05:37:01 Waiting for the transaction to be validated...
rocketpool_node  | 2023/03/06 05:37:13 Successfully promoted minipool 0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C.
```

Se seu processo `node` estiver desabilitado, você pode usar o segundo método através do seguinte comando:

```shell
rocketpool minipool promote
```

A partir daqui, simplesmente selecione seu minipool vacant da lista de minipools elegíveis para promoção e envie a transação.

## Reivindicando suas Recompensas Originais Pré-Conversão

Após a promoção, seu minipool entrará no status `staking` e se tornou oficialmente um minipool regular Rocket Pool.
Você pode revisar os detalhes com este comando:

```shell
rocketpool minipool status
```

Isso mostrará o status do seu novo minipool, seus saldos, seu reembolso, e assim por diante.
Por exemplo:

```
Address:              0x8F3F149e4416a94e0ee909dE32f8A11C2F3e211C
Penalties:            0
Status updated:       2023-03-06, 05:37 +0000 UTC
Node fee:             14.000000%
Node deposit:         8.000000 ETH
RP ETH assigned:       2023-03-06, 05:37 +0000 UTC
RP deposit:            24.000000 ETH
Minipool Balance (EL): 0.090012 ETH
Your portion:          0.001779 ETH
Available refund:      0.085000 ETH
Total EL rewards:      0.086779 ETH
...
```

Aqui você pode ver as seguintes informações importantes:

- `Node deposit` mostra quanto ETH você pessoalmente depositou como parte deste minipool (neste caso, 8 ETH).
- `RP deposit` mostra quanto ETH você emprestou dos pool stakers para criar o minipool (neste caso, 24 ETH).
- `Available refund` mostra quanto do saldo do minipool vai diretamente para você (não é compartilhado com os pool stakers). Isso equivale a todas as suas recompensas na Beacon Chain no momento em que você criou o minipool vacant.
- `Minipool Balance (EL)` mostra o saldo total do contrato do minipool.
- `Your portion (EL)` mostra quanto do saldo pertence a você _após_ subtrair o reembolso do saldo do minipool. Em outras palavras, esta é sua parte das recompensas que você ganhou _após_ criar o minipool vacant.
- `Total EL rewards` é seu reembolso mais suas recompensas pós-conversão.

Para reivindicar seu reembolso, execute o seguinte comando:

```shell
rocketpool minipool refund
```

Simplesmente selecione seu minipool da lista, aprove a transação, e seu reembolso será enviado para o endereço de retirada do seu nó.

## Usando seu Node Credit

Agora que você tem um minipool promovido ativo, você notará que seu nó tem um saldo de crédito quando você executar `rocketpool node status`:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 355.785269 ETH and 16679.835547 RPL.
The node has 24.000000 ETH in its credit balance, which can be used to make new minipools.
```

Neste exemplo, já que convertemos o bond original do validador de 32 ETH em um minipool de 8 ETH, recebemos [**24 ETH em crédito**](./credit).
Este crédito pode ser usado para criar novos minipools e validadores gratuitamente!

Simplesmente execute o comando `rocketpool node deposit`, e selecione qual valor de bond você gostaria de usar.
Se houver ETH suficiente em seu saldo de crédito para cobrir o bond, ele será usado automaticamente e você não terá que apostar nenhum ETH adicional (embora você ainda tenha que pagar pelo gás).

::: warning NOTA
O ETH usado para seu saldo de crédito vem do staking pool.
Se o staking pool não tiver ETH suficiente para cobrir seu saldo de crédito, você não poderá usá-lo até que mais ETH seja depositado.
:::
