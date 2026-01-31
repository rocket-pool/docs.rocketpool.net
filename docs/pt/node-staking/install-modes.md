# Selecionando um Modo do Rocket Pool

A stack Smartnode do Rocket Pool é bastante flexível; existem várias maneiras diferentes de executá-la.
Ela pode configurar um full node inteiro do zero, pode se integrar com deployments existentes de clientes Execution ou Consensus, e pode até executar nativamente como um conjunto de serviços do sistema.
Nesta seção, cobriremos as maneiras típicas de configurar e usar a stack Smartnode.

## A Configuração Padrão Baseada em Docker

O modo padrão, e a maneira mais comum de executar um Smartnode, é fazê-lo criar uma instância completa de full node em sua máquina local que o Rocket Pool gerencia.

Para realizar isso, o Smartnode usa [Docker containers](https://www.docker.com/resources/what-container).
Em essência, um container Docker é uma pequena sandbox que vem pré-configurada com um programa, todas as suas dependências, e toda a configuração necessária para executar corretamente.
Quando não é mais necessário, pode simplesmente ser descartado.
É um pequeno pacote autocontido que permite que as coisas funcionem sem bagunçar seu sistema de arquivos real ou outros programas.

Este modo é o que o Smartnode Installer implantará para você.
Ele usa os seguintes containers Docker:

- `rocketpool_api` - Isso contém a funcionalidade real que o Smartnode fornece quando você interage com ele via interface de linha de comando (CLI) do Rocket Pool.
- `rocketpool_node` - Este é um processo em segundo plano que verificará periodicamente e reivindicará recompensas de RPL após um checkpoint de recompensa (se você tiver auto-claim habilitado, mais sobre isso depois), e é responsável por realmente fazer staking de novos validators quando você cria um minipool.
- `rocketpool_watchtower` - Isso é usado por Oracle Nodes para executar funções relacionadas ao oracle. Para node operators regulares, isso simplesmente ficará ocioso.
- `rocketpool_eth1` - Este será seu cliente Execution.
- `rocketpool_eth2` - Este será seu cliente Consensus beacon node.
- `rocketpool_validator` - Este será seu cliente Validator, que é responsável pelas funções do seu validator (como atestar blocos ou propor novos blocos).

Na maioria das situações, esta é uma boa opção para escolher ao criar um novo node do zero.
É o procedimento mais rápido e com menos intervenção manual.
Também lidará com atualizações dos clientes Execution e Consensus com cada novo lançamento do Smartnode, então você não precisa se preocupar com eles (embora você possa atualizá-los manualmente a qualquer momento se desejar).

::: warning NOTA
Atualmente, alguns dos containers Docker precisam executar como usuário `root` para funcionar corretamente.
Embora os containers Docker sejam geralmente muito bons em prevenir que um usuário escape para seu Sistema Operacional principal, você pode não se sentir confortável com este requisito por razões de segurança.
Neste caso, sugerimos que você use o modo de configuração Nativa listado abaixo.
:::

Se você gostaria de usar este modo, prossiga para a seção [Configurando um Node Padrão do Rocket Pool com Docker](./docker).

## A Configuração Híbrida com Clientes Externos

A configuração híbrida é adequada para usuários que estão interessados em executar um node do Rocket Pool, mas já têm seus próprios clientes Execution e/ou Consensus executando para outros propósitos (por exemplo, porque já estão fazendo solo-staking).

Neste modo, o Rocket Pool implantará containers Docker para seus próprios processos e para um cliente Validator que ele gerencia, mas ignorará os containers do cliente Execution e Beacon Node para quaisquer clientes externos que você já executa e mantém.
**Como o Rocket Pool estará criando e mantendo novas chaves de validator para cada minipool do seu node, é importante que ele execute seu próprio cliente Validator.**

Ao usar esta configuração, o Smartnode usará os seguintes containers Docker (que foram descritos acima):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

Os containers `rocketpool_eth1` e `rocketpool_eth2` serão incluídos ou excluídos, dependendo de quais clientes você já tem executando externamente.

Se você gostaria de usar este modo, prossiga para a seção [Configurando um Node Padrão do Rocket Pool com Docker](./docker).
Quando solicitado a escolher um modo de gerenciamento para seus clientes Execution e/ou Consensus, escolha a opção **Externally Managed** que é descrita em detalhes dentro dessa seção.

## A Configuração Nativa sem Docker

Esta configuração ignora completamente o Docker.
Em vez de executar a stack Smartnode via Docker, cada processo será instalado como um serviço do sistema local (por exemplo, via `systemd`).
Isso inclui os processos `node`, `watchtower`, `eth1`, `eth2`, e `validator`.

Esta configuração oferece a maior flexibilidade porque permite que você ajuste finamente os parâmetros do Rocket Pool (como sua postura de segurança, onde os clientes Execution e Consensus residem, onde os dados da blockchain residem, onde suas chaves residem, e assim por diante).
Também é a mais difícil de configurar e manter.

Neste modo, o Smartnode Installer não é mais relevante.
Você é responsável por instanciar, manter e atualizar manualmente a infraestrutura do Smartnode, os clientes ETH e os clientes validator.

::: danger AVISO
Embora fornecemos alguma documentação de exemplo sobre como fazer isso, sugerimos que este modo deve ser usado apenas por **administradores de sistema experientes**.
:::

Se você gostaria de usar este modo, prossiga para a seção [Configurando um Node Nativo do Rocket Pool sem Docker](./native.mdx).
