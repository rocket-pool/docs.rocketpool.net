# A Atualização Atlas

::: tip NOTA
O Atlas foi implantado em `18 de abril de 2023, 00:00 UTC`. Visite [aqui](../houston/whats-new) para ler sobre o Houston, a atualização de protocolo mais recente.
:::

Esta página descreve as principais mudanças que a próxima atualização importante do Rocket Pool, intitulada **Atlas**, traz para o protocolo, incluindo atualizações tanto para o stack Smartnode quanto para o protocolo Rocket Pool em geral.

Por favor, leia esta página completamente para entender todas as diferenças entre a versão anterior do Rocket Pool (Redstone) e o Atlas.

## Novos Recursos do Protocolo

O Atlas traz alguns novos recursos empolgantes que são baseados tanto no feedback da comunidade quanto em mudanças no próprio protocolo Ethereum.
Abaixo está uma breve lista dessas mudanças - clique em qualquer uma delas para saber mais sobre ela.

### Shapella e Saques

O protocolo Ethereum está se preparando para passar por sua próxima grande atualização: **Shanghai** na camada de Execução e **Capella** na camada de Consenso - como estes agora estão interconectados, ambos ocorrerão ao mesmo tempo.
Os usuários do Ethereum passaram a chamar carinhosamente a atualização combinada de [**"Shapella"**](https://blog.ethereum.org/2023/02/21/sepolia-shapella-announcement).

O Shapella introduz **saques** à Beacon Chain, o que significa que os operadores de nós agora podem acessar o ETH que está atualmente bloqueado na Beacon Chain.
Isso vem em dois tipos:

- Saques parciais (**skimming**), onde suas recompensas (seu excesso de saldo da Beacon Chain acima de 32 ETH) são enviadas para seu minipool na Camada de Execução. Isso é feito _automaticamente pelo próprio protocolo_ de tempos em tempos (cerca de uma vez a cada quatro ou cinco dias na Mainnet).
- **Saques completos**, onde você sai de seu validador da Beacon Chain e seu saldo inteiro é enviado para seu minipool na Camada de Execução. Isso é feito _automaticamente pelo próprio protocolo_ uma vez que seu validador tenha saído da cadeia tempo suficiente.

O Atlas introduz um novo contrato de delegado para minipools que permite aos operadores de nós **distribuir** o saldo de ETH do minipool, dividindo-o uniformemente entre o operador do nó e os detentores de rETH (mais a comissão, é claro) a qualquer momento.
Isso dá aos operadores de nós **acesso imediato** às suas recompensas da Beacon Chain!
Também coloca a parte dos detentores de rETH de volta no pool de depósito, para que possa ser usada para desbloquear rETH por ETH à taxa de câmbio do protocolo (ou para criar novos minipools).

### Minipools com Vínculo de 8 ETH

Uma das mudanças mais aguardadas feitas no Atlas é a introdução da capacidade de fornecer apenas 8 ETH para fazer um minipool em vez de 16 ETH.
Minipools com apenas 8 ETH vinculados por seu operador de nó proprietário são combinados com **24 ETH** do pool de staking (fornecido pelos detentores de rETH) para fazer um validador.
Isso reduz significativamente o requisito de capital para executar seu próprio validador _e_ resulta em maiores retornos tanto para o operador do nó quanto para os stakers de rETH!
Na verdade, executar dois minipools de 8 ETH em vez de um minipool de 16 ETH fornecerá **mais de 18% mais recompensas** - mesmo se o minipool de 16 ETH tiver uma taxa de comissão de 20%.

Criar um minipool de 8 ETH requer que você faça stake de **no mínimo 2,4 ETH em valor de RPL** e **no máximo 12 ETH em valor de RPL**.
Estes representam 10% do valor que você está _emprestando_ do protocolo e 150% do valor que você está _vinculando_ (fazendo stake) você mesmo.

Novos minipools podem ser criados com 8 ETH ou 16 ETH.
Minipools de 16 ETH não mudaram em relação a como funcionam hoje e estão disponíveis para usuários que desejam minimizar sua exposição ao token RPL.

Para aprender como fazer novos minipools usando um vínculo de 8 ETH, visite o [guia de criação de minipool](../../node-staking/create-validator.mdx).

Além disso, uma vez que o Atlas foi aplicado, os operadores de nós podem **migrar minipools existentes de 16 ETH diretamente para minipools de 8 ETH sem precisar sair**.
Isso lhes dará 8 ETH de volta em [crédito de depósito](../../node-staking/credit), que pode ser usado para criar um **novo minipool de 8 ETH gratuitamente**!

Para saber mais sobre minipools com vínculo de 8 ETH, visite o [guia de redução de vínculo](../../node-staking/leb-migration.mdx).

### Conversão de Validador Solo

Parte da atualização Shapella envolve a capacidade de validadores solo [alterarem as credenciais de saque de seus validadores](https://notes.ethereum.org/@launchpad/withdrawals-faq) da chave de saque baseada em BLS original (agora não utilizada) para um endereço na camada de Execução.
Este endereço será o destinatário de todas as recompensas desse validador e de seu saldo total de ETH uma vez que saia da Beacon Chain.

Operadores de nós regulares do Rocket Pool não precisam se preocupar com nada disso, pois o protocolo configurou isso automaticamente para seus minipools quando você os criou.
_No entanto_, como parte deste novo requisito para validadores solo, o Atlas traz uma oportunidade empolgante: a capacidade de **criar um minipool especial** que se tornará o endereço de saque para seu **validador solo existente**.

Em outras palavras, isso permitirá que você **converta diretamente um validador solo em um minipool do Rocket Pool sem precisar sair dele!**

Isso significa que você obterá todos os benefícios dos minipools do Rocket Pool, incluindo:

- A capacidade de converter seu único validador (com um vínculo de 32 ETH) em **quatro minipools** (cada um com um vínculo de 8 ETH), efetivamente **quadruplicando** sua presença na Beacon Chain
- Comissão sobre a porção desses minipools fornecida pelos stakers de rETH
- Acesso ao [Smoothing Pool](../../node-staking/fee-distrib-sp#the-smoothing-pool) do Rocket Pool para agrupar e distribuir uniformemente as recompensas de propostas de blocos e MEV

Para saber mais sobre como converter um validador solo em um minipool, visite o guia [Convertendo um Validador Solo em um Minipool](../../node-staking/solo-staker-migration).

## Novos Recursos do Smartnode

Além das mudanças principais no protocolo Rocket Pool, o Atlas também traz algumas atualizações empolgantes para o próprio stack Smartnode, que estão presentes na v1.9.0.

### Distribuições Automáticas de Recompensas

Se você já é um operador de nó ativo do Rocket Pool, pode estar familiarizado com o processo `rocketpool_node` que lida com certos processos automatizados.
Por exemplo, ele garante que você tenha o destinatário de taxa correto e executa automaticamente a segunda transação `stake` para você após minipools `prelaunch` passarem na verificação de scrub de 12 horas.

A partir do Atlas, o `node` tem um novo dever: **distribuição automática de recompensas de minipool!**
Isso se deve à forma como [a atualização Shapella funciona](../../node-staking/skimming), retirando suas recompensas da Beacon Chain para seu minipool a cada poucos dias.

Sempre que um de seus minipools atinge um saldo maior que um limite especificado pelo usuário (padrão de 1 ETH), o nó executará automaticamente `distribute-balance` nele.
Isso enviará sua porção das recompensas para seu endereço de saque e a porção do staker do pool de volta ao pool de depósito.

A alteração do limite pode ser feita na seção `Smartnode and TX Fees` do TUI `service config`, na configuração `Auto-Distribute Threshold`.

### Dashboard Grafana Unificado

Por demanda popular, criamos um novo [**dashboard Grafana**](https://grafana.com/grafana/dashboards/21863) para ajudar os operadores de nós a rastrear e avaliar o status, progresso e saúde geral de seus nós:

![](../../node-staking/images/grafana-1.3.jpg)

Ele vem com os seguintes recursos altamente solicitados:

- Suporte para todos os clientes de Execução e Consenso em um único dashboard - não é mais necessário mudar de dashboards com base em quais clientes você está usando!
- Estatísticas do cliente de Execução, incluindo uso de CPU e RAM e contagem de peers
- Rastreamento de precisão de atestação que acompanha quão "corretos" foram seus atestados para a época anterior, para que você saiba o quão longe das recompensas ideais você está obtendo
- Rastreamento do saldo do Smoothing Pool
- Rastreamento de recompensas reivindicadas e não reivindicadas, agora incluindo ETH do Smoothing Pool
- Estatísticas sobre votos de governança baseados em Snapshot do Rocket Pool
- Espaço para rastrear o espaço usado e a temperatura de um segundo SSD, se você tiver um para seu SO e outro diferente para seus dados de cadeia
- E mais!

Você pode importar o novo dashboard do serviço oficial Grafana usando o ID `21863` seguindo nosso [guia Grafana](../../node-staking/grafana.mdx).

Este novo dashboard foi um trabalho de amor que envolveu ajuda extensa do membro da comunidade **0xFornax** - obrigado por todo o seu trabalho árduo!

### Mudanças no Nimbus

O Smartnode v1.9.0 introduz **suporte ao modo dividido** para o Nimbus!
Em vez de executar o Beacon Node e o Validator Client dentro de um único processo/contêiner, o Smartnode agora os executará em contêineres separados como os outros clientes. Isso tem os seguintes benefícios:

- O Nimbus agora suporta **clientes de fallback** (um cliente de Execução secundário e Beacon Node aos quais o Validator Client do Nimbus pode se conectar quando seus clientes primários estão inativos para manutenção, como ressincronização).
- O Nimbus agora é suportado em **Modo Gerenciado Externamente (Híbrido)**, para que você possa acoplar o Validator Client que o Smartnode gerencia a um Beacon Node externo que você mantém por conta própria.
- O Beacon Node não precisa mais ser reiniciado após a adição de novos minipools, o que significa que você não perde atestados enquanto ele se reconecta aos seus peers.

### Suporte ao Lodestar

[Lodestar](https://chainsafe.github.io/lodestar/) agora é suportado como uma opção para seu Cliente de Consenso de escolha!
Esta é a adição mais recente a ser oficialmente aceita no [Launchpad do Ethereum](https://launchpad.ethereum.org/en/lodestar), e está pronta para validação.
O Lodestar suporta muitos dos grandes recursos que você passou a amar dos outros clientes, incluindo Detecção de Doppelganger, MEV-Boost, clientes gerenciados externamente (Modo Híbrido) e muito mais!

### Novo Sistema de Snapshot de Rede

Em uma nota um pouco mais técnica, a v1.9.0 introduz um sistema totalmente novo para capturar rapidamente um snapshot do estado de **tudo sobre seu nó** tanto nas camadas de Execução quanto de Consenso.
Nos bastidores, este sistema aproveita [o contrato multicall do MakerDAO](https://github.com/makerdao/multicall) e o [contrato Ethereum Balance Checker de Will O'Beirne](https://github.com/wbobeirne/eth-balance-checker) para agrupar milhares de consultas individuais do cliente de Execução em uma única solicitação.

Isso torna o processo `node` muito menos exigente no cliente de Execução para operadores de nós com um grande número de validadores, e deve reduzir significativamente sua carga de CPU, o que melhorará os atestados e as recompensas gerais.

Este novo sistema ainda não chegou à própria CLI, então quaisquer comandos que você executar lá (como `rocketpool minipool status`) ainda usarão a configuração antiga de consulta única.
Com o tempo, o introduziremos na CLI também, o que tornará todos os seus comandos extremamente rápidos (_exceto esperar que as transações sejam validadas, isso ainda leva um tempo_).
