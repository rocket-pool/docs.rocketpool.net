# A Atualização Atlas

::: tip NOTA
Atlas foi implantado em `18 de abril de 2023, 00:00 UTC`. Por favor visite [aqui](../houston/whats-new) para ler sobre Houston, a mais recente atualização de protocolo.
:::

Esta página descreve as principais mudanças que a próxima grande atualização do Rocket Pool, intitulada **Atlas**, traz ao protocolo incluindo atualizações tanto para a stack Smartnode quanto para o protocolo Rocket Pool em geral.

Por favor leia esta página completamente para entender todas as diferenças entre a versão anterior do Rocket Pool (Redstone) e Atlas.

## Novos Recursos do Protocolo

Atlas traz alguns novos recursos empolgantes que são baseados tanto no feedback da comunidade quanto em mudanças no próprio protocolo Ethereum.
Abaixo está uma breve lista dessas mudanças - clique em qualquer uma delas para aprender mais sobre ela.

### Shapella e Retiradas

O protocolo Ethereum está se preparando para passar por sua próxima grande atualização: **Shanghai** na camada de Execução, e **Capella** na camada de Consenso - já que estas estão agora interconectadas, ambas ocorrerão ao mesmo tempo.
Os usuários Ethereum carinhosamente passaram a chamar a atualização combinada de [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement) consequentemente.

Shapella introduz **retiradas** à Beacon Chain, significando que operadores de nó agora são capazes de acessar o ETH que está atualmente bloqueado na Beacon Chain.
Isso vem em dois sabores:

- Retiradas parciais (**skimming**), onde suas recompensas (seu saldo excedente da Beacon Chain acima de 32 ETH) são enviadas para seu minipool na Camada de Execução. Isso é feito _automaticamente pelo próprio protocolo_ de vez em quando (cerca de uma vez a cada quatro ou cinco dias na Mainnet).
- **Retiradas completas**, onde você sai seu validador da Beacon Chain e todo o seu saldo é enviado para seu minipool na Camada de Execução. Isso é feito _automaticamente pelo próprio protocolo_ uma vez que seu validador tenha saído da cadeia tempo suficiente.

Atlas introduz um novo contrato delegado para minipools que permite aos operadores de nó **distribuir** o saldo ETH do minipool, dividindo-o igualmente entre o operador de nó e os detentores de rETH (mais comissão, é claro) a qualquer momento.
Isso dá aos operadores de nó **acesso imediato** às suas recompensas da Beacon Chain!
Também coloca a parte dos detentores de rETH de volta no pool de depósito, então pode ser usado para desfazer o stake de rETH por ETH à taxa de câmbio do protocolo (ou para criar novos minipools).

### Minipools com Bond de 8-ETH

Uma das mudanças mais antecipadas feitas no Atlas é a introdução da capacidade de fornecer apenas 8 ETH para fazer um minipool em vez de 16 ETH.
Minipools com apenas 8 ETH vinculados por seu operador de nó proprietário são combinados com **24 ETH** do pool de staking (fornecido pelos detentores de rETH) para fazer um validador.
Isso reduz significativamente o requisito de capital para executar seu próprio validador _e_ resulta em maiores retornos tanto para o operador de nó quanto para os stakers de rETH!
Na verdade, executar dois minipools de 8-ETH em vez de um minipool de 16-ETH fornecerá **mais de 18% a mais de recompensas** - mesmo se o minipool de 16-ETH tiver uma taxa de comissão de 20%.

Criar um minipool de 8 ETH requer que você faça stake de um **mínimo de 2.4 ETH em valor de RPL** e um **máximo de 12 ETH em valor de RPL**.
Estes representam 10% do valor que você está _emprestando_ do protocolo, e 150% do valor que você está _vinculando_ (fazendo stake) você mesmo.

Novos minipools podem ser criados com 8 ETH ou 16 ETH.
Minipools de 16 ETH não mudaram em relação a como funcionam hoje, e estão disponíveis para usuários que querem minimizar sua exposição ao token RPL.

Para aprender como fazer novos minipools usando um bond de 8 ETH, por favor visite o [guia de criação de minipool](../../node-staking/create-validator.mdx).

Além disso, uma vez que Atlas tenha sido aplicado, operadores de nó podem **migrar minipools de 16-ETH existentes diretamente para minipools de 8-ETH sem precisar sair**.
Isso lhes devolverá 8 ETH em [crédito de depósito](../../node-staking/credit), que pode ser usado para criar um **novo minipool de 8-ETH gratuitamente**!

Para aprender mais sobre minipools com bond de 8-ETH, por favor visite o [guia de redução de bond](../../node-staking/leb-migration.mdx).

### Conversão de Validador Solo

Parte da atualização Shapella envolve a capacidade de validadores solo [mudarem as credenciais de retirada de seus validadores](https://notes.ethereum.org/@launchpad/withdrawals-faq) da chave de retirada original (agora não usada) baseada em BLS para um endereço na camada de Execução.
Este endereço será o destinatário de todas as recompensas daquele validador e seu saldo ETH completo uma vez que ele saia da Beacon Chain.

Operadores de nó regulares do Rocket Pool não precisam se preocupar com nada disso, pois o protocolo configurou isso automaticamente para seus minipools quando você os criou.
_No entanto_, como parte deste novo requisito para validadores solo, Atlas traz uma oportunidade empolgante: a capacidade de **criar um minipool especial** que se tornará o endereço de retirada para seu **validador solo existente**.

Em outras palavras, isso permitirá que você **converta diretamente um validador solo em um minipool Rocket Pool sem precisar sair dele!**

Isso significa que você obterá todos os benefícios dos minipools Rocket Pool, incluindo:

- A capacidade de converter seu validador único (com um bond de 32 ETH) em **quatro minipools** (cada um com um bond de 8 ETH), efetivamente **quadruplicando** sua presença na Beacon Chain
- Comissão sobre a porção desses minipools fornecida pelos stakers de rETH
- Acesso ao [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) do Rocket Pool para agrupar e distribuir uniformemente recompensas de propostas de bloco e MEV

Para aprender mais sobre converter um validador solo em um minipool, por favor visite o guia [Convertendo um Validador Solo em um Minipool](../../node-staking/solo-staker-migration).

## Novos Recursos do Smartnode

Além de mudanças principais no protocolo Rocket Pool, Atlas também traz algumas atualizações empolgantes para a própria stack Smartnode que estão presentes na v1.9.0.

### Distribuições Automáticas de Recompensas

Se você já é um operador de nó Rocket Pool ativo, você pode estar familiarizado com o processo `rocketpool_node` que lida com certos processos automatizados.
Por exemplo, ele garante que você tenha o destinatário de taxas correto e executa automaticamente a segunda transação `stake` para você após minipools `prelaunch` passarem pela verificação de scrub de 12 horas.

Começando com Atlas, o `node` tem um novo dever: **distribuição automática de recompensas de minipool!**
Isso é devido à maneira como [a atualização Shapella funciona](../../node-staking/skimming), retirando suas recompensas da Beacon Chain para seu minipool a cada poucos dias.

Sempre que um de seus minipools atingir um saldo maior que um limite especificado pelo usuário (padrão de 1 ETH), o nó executará automaticamente `distribute-balance` nele.
Isso enviará sua porção das recompensas para seu endereço de retirada, e a porção do staker do pool de volta para o pool de depósito.

Mudar o limite pode ser feito na seção `Smartnode and TX Fees` da TUI `service config`, sob a configuração `Auto-Distribute Threshold`.

### Painel Grafana Unificado

Por demanda popular, criamos um novo [**painel Grafana**](https://grafana.com/grafana/dashboards/24900-rocket-pool-dashboard-v1-4-0/) para ajudar operadores de nó a rastrear e avaliar o status, progresso e saúde geral de seus nós:

![](../../node-staking/images/grafana-1.3.jpg)

Ele vem com os seguintes recursos altamente solicitados:

- Suporte para todos os clientes de Execução e Consenso em um único painel - não é mais necessário mudar painéis com base em quais clientes você está usando!
- Estatísticas do cliente de Execução, incluindo uso de CPU e RAM, e contagem de peers
- Rastreamento de precisão de atestação que acompanha quão "corretos" seus atestados foram para a época anterior, então você sabe quão longe das recompensas ótimas você está chegando
- Rastreamento do saldo do Smoothing Pool
- Rastreamento de recompensas reivindicadas e não reivindicadas, agora incluindo ETH do Smoothing Pool
- Estatísticas sobre votos de governança baseados em Snapshot do Rocket Pool
- Espaço para rastrear o espaço usado e temperatura de um segundo SSD se você tiver um para seu SO e um diferente para seus dados de cadeia
- E mais!

Você pode importar o novo painel do serviço oficial Grafana usando o ID `21863` seguindo nosso [guia Grafana](../../node-staking/grafana.mdx).

Este novo painel foi um trabalho de amor que envolveu ajuda extensiva do membro da comunidade **0xFornax** - obrigado por todo o seu trabalho árduo!

### Mudanças no Nimbus

Smartnode v1.9.0 introduz **suporte de modo dividido** para Nimbus!
Em vez de executar o Beacon Node e Validator Client dentro de um único processo / container, o Smartnode agora os executará em containers separados como os outros clientes. Isso tem os seguintes benefícios:

- Nimbus agora suporta **clientes de fallback** (um cliente de Execução secundário e Beacon Node aos quais o Validator Client do Nimbus pode se conectar quando seus clientes primários estiverem offline para manutenção, como ressincronização).
- Nimbus agora é suportado no **Modo Gerenciado Externamente (Híbrido)**, então você pode acoplar o Validator Client que o Smartnode gerencia a um Beacon Node externo que você mantém por conta própria.
- O Beacon Node não precisa mais ser reiniciado após a adição de novos minipools, significando que você não perde atestados enquanto ele se reconecta aos seus peers.

### Suporte ao Lodestar

[Lodestar](https://chainsafe.github.io/lodestar/) agora é suportado como uma opção para seu Cliente de Consenso de escolha!
Esta é a adição mais nova a ser oficialmente aceita no [Launchpad do Ethereum](https://launchpad.ethereum.org/en/lodestar), e está pronta para validação.
Lodestar suporta muitos dos ótimos recursos que você passou a amar dos outros clientes, incluindo Doppelganger Detection, MEV-Boost, clientes gerenciados externamente (Modo Híbrido), e mais!

### Novo Sistema de Snapshot de Rede

Em uma nota um pouco mais técnica, v1.9.0 introduz um sistema totalmente novo para capturar rapidamente um snapshot do estado de **tudo sobre seu nó** tanto nas camadas de Execução quanto de Consenso.
Por baixo dos panos, este sistema aproveita [o contrato multicall da MakerDAO](https://github.com/makerdao/multicall) e o [contrato Ethereum Balance Checker de Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) para agrupar milhares de consultas individuais do cliente de Execução em uma única solicitação.

Isso torna o processo `node` muito menos exigente no cliente de Execução para operadores de nó com um grande número de validadores, e deve reduzir significativamente sua carga de CPU o que melhorará atestados e recompensas gerais.

Este novo sistema ainda não chegou ao próprio CLI, então quaisquer comandos que você executar lá (como `rocketpool minipool status`) ainda usarão a configuração antiga de consulta única.
Ao longo do tempo, introduziremos isso no CLI também, o que tornará todos os seus comandos extremamente rápidos (_exceto por esperar que as transações sejam validadas, isso ainda leva um tempo_).
