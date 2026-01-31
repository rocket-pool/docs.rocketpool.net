# Início Rápido Houston

Seja você um Node Operator experiente, detentor de rETH ou um observador curioso, esta página ajudará você a começar a explorar os novos recursos incluídos no Houston.

##

### Inicializando o Poder de Voto

Primeiro e acima de tudo, o passo mais importante se você é **Node Operator** é [inicializar o voto](../houston/participate#initializing-voting) para desbloquear seu poder de voto. Os nós que inicializaram o voto são incluídos quando o poder de voto total da rede é calculado.

Na gênese do Houston, a votação do pDAO está desabilitada até que um número suficiente de nós tenha inicializado o voto. Isso é para evitar que propostas desonestas sejam aprovadas enquanto o poder de voto total e o quórum estão baixos. Depois que nós suficientes tiverem inicializado o voto, um interruptor será acionado e o pDAO terá o comando.

Para inicializar o poder de voto, use este comando no smartnode:

```shell
rocketpool pdao initialize-voting
```

Você só precisa fazer isso uma vez. Inicializar o voto garantirá que o poder de voto do seu nó seja incluído em futuras propostas on-chain e permitirá que você vote nelas.

### Definindo seu Endereço de Sinalização Snapshot

Em segundo lugar, você vai querer definir seu endereço de sinalização Snapshot. Isso permite que os Node Operators participem de votações Snapshot em seu navegador ou dispositivo móvel sem ter que expor suas chaves de nó a uma carteira quente.

Configurar isso envolve alguns passos, então você vai querer seguir este guia:
[Definindo seu Endereço de Sinalização Snapshot](../houston/participate#setting-your-snapshot-signalling-address).

### Delegando Poder de Voto On-Chain

Se você deseja delegar poder de voto on-chain para um membro da comunidade de sua escolha, clique [aqui](../houston/participate#delegating-voting-power) para aprender como.

##

# Guias

[Visão Geral Completa do Houston](../houston/whats-new) apresenta o Protocol DAO totalmente on-chain e introduz novos recursos como fazer staking de ETH em nome de um nó, definir um endereço de saque de RPL e submissões de saldo e RPL baseadas em tempo. As auditorias dos contratos inteligentes do Houston também podem ser encontradas aqui.

[O Protocol DAO](../houston/pdao) discute quem e como o pDAO governa o Rocket Pool. Esta página informará você sobre como as tarefas do pDAO, como gastos do tesouro, podem ser executadas on-chain, juntamente com o papel do novíssimo Conselho de Segurança. Também guiará você pelo ciclo de vida de uma proposta do pDAO e explicará algumas das medidas tomadas para prevenir spam e derrubar propostas maliciosas.

[Participando em Propostas](../houston/participate) inclui um guia passo a passo detalhado sobre como os Node Operators podem participar de propostas do pDAO. Se você está interessado em levantar uma proposta on-chain, votar ou delegar poder de voto, este é o guia para você.

[Fazer Staking de ETH em Nome de um Nó](../houston/stake-eth-on-behalf.mdx) aborda os passos para fazer staking de ETH em nome de um nó. É um novo recurso introduzido no Houston para facilitar cenários de depositante único. Vamos percorrer como fazer isso em uma testnet se você quiser experimentar antes de fazer staking de ETH real na mainnet.

[Endereço de Saque de RPL](../houston/rpl-withdrawal-address) mostra como definir um endereço de saque de RPL para o seu nó. Isso é útil se você deseja permitir que uma entidade separada forneça o colateral de seguro RPL para um nó.
