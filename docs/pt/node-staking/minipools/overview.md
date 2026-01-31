---
next:
  text: Criando um Novo Minipool (Validator)
  link: "/pt/node-staking/create-validator"
---

::: danger AVISO
Depósitos de minipool estão atualmente desabilitados em preparação para Saturn 1.
:::

# Visão Geral

Esta seção cobre os processos de criação e migração de minipools (validators do Rocket Pool).
É aqui que você aprenderá como começar a validar a rede Ethereum e ganhar recompensas por isso.

## Pré-requisitos

Antes de executar minipools, certifique-se de que você:

- Configurou uma máquina de node (ou máquina virtual) e a protegeu (através do guia [Protegendo seu Node](../securing-your-node))
- Instalou o Smartnode [instalado](../installing/overview) e [configurado](../config/overview) nela
- Tem uma carteira de node carregada no seu Smartnode
- Sincronizou seus clientes de Execution e Consensus
- Provisionou seu node com [um endereço de retirada](../prepare-node.mdx#setting-your-withdrawal-address), configurou seus [clientes de fallback](../fallback) (opcional), optou pelo [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional) e configurou [MEV](../mev.mdx)

## Guias

[Criando um Novo Minipool (Validator)](../create-validator.mdx) explica o processo de criação de um novo minipool do Rocket Pool e o validator correspondente na Beacon Chain.
Seja fazendo seu primeiro minipool ou já tendo alguns e gostaria de fazer outro, este guia orientará você passo a passo.

[O Delegate do Minipool](./delegates) explica um pouco sobre o que é o contrato de minipool e apresenta o contrato **delegate** que contém a maior parte de sua funcionalidade.
Também demonstra como atualizar o delegate dos seus minipools após uma atualização de rede para aproveitar novos recursos.

[Convertendo um Solo Validator em um Minipool](../solo-staker-migration) orienta o processo de conversão de um validator existente fora do Rocket Pool (como um que você usa para solo staking) diretamente em um minipool do Rocket Pool sem a necessidade de sair da Beacon Chain e criar um novo minipool.
Se você é um solo staker que deseja aproveitar esta capacidade, este é o guia para você!

[Migrando um Minipool de 16-ETH para 8-ETH](../leb-migration.mdx) mostra como reduzir a quantidade vinculada de ETH para um minipool de 16 ETH para 8 ETH, dando a você 8 ETH em crédito que pode ser usado para criar um novo minipool gratuitamente (embora ainda custe ETH para gas, é claro).

[O Sistema de Crédito de Depósito](../credit) cobre o sistema "ETH Credit" que permite criar novos minipools sem ter que pagar pelos seus bonds de ETH depois de realizar uma das migrações acima.
