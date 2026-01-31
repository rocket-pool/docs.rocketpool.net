---
next:
  text: Iniciando o Rocketpool
  link: "/pt/node-staking/starting-rp"
---

# Visão Geral

Esta seção cobre os detalhes de como provisionar seu nó para staking com Rocket Pool depois de ter instalado e configurado o Smartnode.
É uma seção longa porque há muita informação sobre staking para cobrir, então **por favor leia cada guia antes de criar seu primeiro minipool!**

## Pré-requisitos

Antes de provisionar seu nó para staking, por favor certifique-se de que fez o seguinte:

- Configurou uma máquina de nó (ou máquina virtual) e a protegeu (através do guia [Protegendo seu Nó](../securing-your-node))
- Tem o Smartnode [instalado](../installing/overview) e [configurado](../config/overview) nela

## Guias

[Iniciando o Rocket Pool](../starting-rp) mostrará como iniciar os serviços do Smartnode para cada modo e como verificar o progresso de sincronização dos seus clientes Execution e Consensus.

[Criando uma Nova Carteira](../wallet-init) apresenta o processo de criar uma carteira completamente nova com o Smartnode se esta for sua primeira vez configurando um nó.

[Importando / Recuperando uma Carteira Existente](../recovering-rp.mdx) é uma alternativa para criar uma nova carteira.
Use este guia se você já tem uma carteira de nó que deseja recuperar no seu nó (ou se está migrando de um serviço como Allnodes para seu próprio hardware).

[Preparando seu Nó para Operação](../prepare-node.mdx) cobre alguns primeiros passos importantes que você vai querer fazer uma vez que tenha uma carteira carregada no seu nó, bem antes de financiá-la com qualquer ETH ou RPL (além de uma pequena quantia de ETH para custos de gas, é claro).

[Especificando um Nó de Fallback](../fallback) guia você através do processo opcional de apontar seu nó para um segundo par (gerenciado externamente) de clientes Execution e Consensus que podem agir como backup para seus clientes primários se eles caírem, para que seu nó possa continuar validando enquanto você realiza manutenção neles.

[Distribuidores de Taxa e a Smoothing Pool](../fee-distrib-sp) discutem a forma como as recompensas da camada Execution são fornecidas ao seu nó toda vez que um de seus validadores propõe um bloco, como coletar essas recompensas, e descreve a **Smoothing Pool** do Rocket Pool - um recurso popular que combina recompensas da camada Execution de todos e as distribui uniformemente durante os intervalos de recompensas regulares do Rocket Pool.

[MEV, MEV-Boost e Recompensas MEV](../mev.mdx) explica **Maximum-Extractable Value** (MEV), seu papel no ecossistema de staking, e como você pode configurá-lo ao seu gosto usando o Smartnode.
