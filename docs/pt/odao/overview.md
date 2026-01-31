# O Oracle DAO do Rocket Pool

::: warning NOTA
Esta documentação aplica-se apenas a membros do Oracle DAO do Rocket Pool.
Se você não foi explicitamente convidado para o Oracle DAO e pretende apenas executar um nó Rocket Pool regular, esta seção do guia não se aplica a você.
Você pode ignorá-la com segurança, mas é bem-vindo para lê-la se estiver interessado.
:::

O **Oracle DAO** é o grupo de nós especiais do Rocket Pool que são responsáveis pelas tarefas administrativas exigidas pelo protocolo que não podem ser alcançadas por Smart Contracts devido a limitações técnicas.
Eles são essencialmente os mesmos que nós Rocket Pool normais; usam as mesmas ferramentas, podem ser configurados com os mesmos métodos, e podem até executar minipools regulares, mas vêm com tarefas suplementares que realizam.
Isso inclui coisas como:

- Transportar informações da Beacon Chain para a Execution Layer, incluindo status e saldos de validators
- Garantir que minipools sejam criados usando chaves públicas de validators que ainda não estão em uso, e [tenham as credenciais de retirada adequadas](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit) para que o protocolo possa financiá-los com segurança
- Construir a árvore Merkle de recompensas no final de cada período de recompensas e fazer upload para IPFS para que outros Node Operators acessem
- Monitorar propostas para conformidade com os [requisitos de destinatário de taxas](../node-staking/mev.mdx) do Rocket Pool
- Propor e votar em modificações no protocolo central, incluindo mudança de parâmetros e aprovação de atualizações de contratos
- Propor e votar no quadro do Oracle DAO, incluindo convidar e remover outros membros do Oracle DAO

Como recompensa por cumprir essas tarefas, o Oracle DAO recebe coletivamente uma [pequena porcentagem](https://rpips.rocketpool.net/RPIPs/RPIP-25) da inflação total de RPL produzida em cada período de recompensas, dividida igualmente entre seus membros.

Ao contrário de nós Rocket Pool normais, que podem ser criados e executados sem permissão por qualquer pessoa, a associação no Oracle DAO é **apenas por convite** de membros existentes.
Se você foi recentemente convidado para se juntar ao Oracle DAO, esta seção do guia irá ajudá-lo a entender seu papel, configurar seu nó e garantir que ele permaneça saudável.

## Requisitos

Para executar um nó Oracle DAO, você precisará do seguinte:

- Acesso a um **endpoint RPC de Execution Client**. Este pode ser um cliente executado localmente, como é o caso com a maioria dos nós Rocket Pool, ou pode se conectar a clientes externos que você ou sua organização mantém independentemente.
- Acesso a um **Execution Client em Modo Archive**, que pode atuar como seu cliente primário ou como um cliente suplementar (fallback). Ele será usado apenas em raras circunstâncias em que as tarefas exigem que seu nó recupere um estado da Execution Layer que foi podado do seu Execution Client. No entanto, é **crítico** que você tenha acesso a um Archive Node durante esses períodos para garantir que suas tarefas possam ser cumpridas com sucesso.
  - **Recomendamos fortemente** que você use um archive node local para isso, pois serviços como [Infura](https://infura.io/pricing) ou [Alchemy](https://www.alchemy.com/pricing) mostraram alguma dificuldade em acompanhar a demanda durante períodos críticos, como a construção da árvore de recompensas.
- Acesso ao **endpoint da API REST de um Beacon Node em Modo Archive** (via HTTP). Este pode ser um cliente executado localmente, como é o caso com a maioria dos nós Rocket Pool, ou pode se conectar a clientes externos que você ou sua organização mantém independentemente.
- O CLI padrão do Smartnode.
- O daemon do Smartnode está configurado e executando no modo `watchtower` (isso está incluído no bundle padrão do Smartnode para todos os usuários, mas executa tarefas ativamente apenas para nós Oracle DAO).
  - Isso pode ser executado em um container Docker (configuração padrão) ou como um simples serviço `systemd` (modo "Nativo").
- ETH suficiente para pagar pelos custos de gas de suas tarefas (discutido mais tarde).

::: warning NOTA
Se você simplesmente não pode executar um archive node local e _deve_ depender de um serviço de terceiros, considere o seguinte:

Se você planeja usar **Infura** para seu fallback em Modo Archive, você deve ter pelo menos o plano **Team**.
O tier gratuito e o tier Developer não são suficientes.

Se você planeja usar **Alchemy**, você deve ter pelo menos o plano **Growth**.
O tier gratuito não é suficiente.
:::

## Atividades

As tarefas do Oracle DAO são divididas em duas partes.

1. **Tarefas automatizadas**: essas são tarefas relacionadas à operação rotineira do Rocket Pool, como transportar informações da Consensus Layer para a Execution Layer, calcular vários aspectos do protocolo off-chain e submetê-los como atualizações para os Smart Contracts. Cada uma delas é realizada automaticamente pelo processo daemon `watchtower` e não requer intervenção manual, desde que seus clientes Execution e Consensus, e seu daemon `watchtower`, estejam todos operando normalmente.
2. **Tarefas manuais**: essas são tarefas que requerem sua própria tomada de decisão e comunicação fora da banda com o resto do Oracle DAO para executar. Elas incluem coisas como votar em atualizações de contratos, mudar parâmetros e convidar ou expulsar membros para/do Oracle DAO. Todas essas podem ser feitas via CLI padrão do Smartnode.

Leia a próxima seção para aprender como configurar seu nó Oracle DAO.
