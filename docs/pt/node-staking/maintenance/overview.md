---
next:
  text: Monitorando o Desempenho do Seu Nó
  link: "/pt/node-staking/performance"
---

# Visão Geral

Nesta seção, você aprenderá como monitorar a saúde do seu nó e de seus validators, acompanhar seus ganhos e realizar manutenção periódica, como atualizações.

## Pré-requisitos

Antes de configurar seu Smartnode, certifique-se de:

- Ter configurado uma máquina de nó (ou máquina virtual) e protegido ela (via guia [Securing your Node](../securing-your-node))
- Ter o Smartnode [instalado](../installing/overview) e [configurado](../config/overview) nela
- Ter uma carteira de nó carregada no seu Smartnode
- Ter sincronizado seus clientes Execution e Consensus
- Ter provisionado seu nó com [um withdrawal address](../prepare-node.mdx#setting-your-withdrawal-address), configurado seus [fallback clients](../fallback) (opcional), optado pelo [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional), e configurado [MEV](../mev.mdx)
- Ter criado pelo menos um [minipool](../create-validator.mdx)

## Guias

[Monitoring your Node's Performance](../performance) fornece algumas ferramentas e tutoriais para acompanhar a saúde do seu nó (de uma perspectiva de recursos, como consumo de CPU e RAM) e o desempenho dos seus validators na Beacon Chain.
Cobre muitas ferramentas fundamentais que você usará durante seu tempo como um validator Ethereum.

[Setting up the Grafana Dashboard](../grafana.mdx) explica como configurar o rastreador de métricas da stack do Smartnode e o dashboard Grafana - uma solução completa para monitorar tudo sobre seu nó e validators, e um item básico no arsenal de cada node operator.
Nós _fortemente_ recomendamos explorar o dashboard Grafana e verificá-lo regularmente.

[Smartnode Stack Alert Notifications](./alerting.md) explica como usar a funcionalidade de notificação de alerta do Smartnode para receber notificações sobre a saúde e eventos importantes do seu Rocket Pool Smartnode.

[Checking for Updates](../updates) cobre os processos cruciais de atualizar regularmente seu nó com novos patches de segurança, como atualizar o Smartnode após um novo lançamento, e como atualizar manualmente versões de clientes se seus clientes escolhidos lançarem uma nova versão que o último lançamento do Smartnode ainda não inclui.
Você deve se familiarizar com toda esta seção, pois pode precisar consultá-la sempre que uma atualização for lançada.

[Backing Up Your Node](../backups) é um guia opcional que descreve como fazer backup da configuração do seu nó e seus dados de cadeia no caso de uma falha de hardware.

[Pruning the Execution Client](../pruning) é **importante** para qualquer pessoa executando um Execution client que gradualmente consome todo o espaço em disco do seu SSD e requer pruning periódico (como Geth ou Nethermind) para recuperar parte desse espaço.
Se você está executando um desses clientes, você definitivamente deve se familiarizar com o processo de pruning.

[Changing Execution or Consensus Clients](../change-clients) é um guia útil; ele passa pelo processo de mudar sua(s) escolha(s) de cliente e o que pode ser esperado durante o processo.
Este é outro bom guia para se familiarizar, apenas no caso de você precisar mudar clientes por qualquer motivo no futuro.
