---
next:
  text: A DAO do Protocolo
  link: "/pt/pdao/pdao"
---

# Visão Geral

Esta seção descreve o processo de configuração do seu nó para participar em propostas on-chain e snapshot. Há muito para absorver, por isso recomendamos fortemente a leitura de uma visão geral da [Atualização Houston](/pt/legacy/houston/whats-new). Isso irá ajudá-lo a entender os recursos mais recentes que permitem a governança on-chain e como você pode participar na definição do protocolo.

## Pré-requisitos

Antes de configurar o seu Smartnode, certifique-se de que você:

- Configurou uma máquina de nó (ou máquina virtual) e a protegeu (através do guia [Protegendo o seu Nó](/pt/node-staking/securing-your-node))
- Tem o Smartnode [instalado](/pt/node-staking/installing/overview) e [configurado](/pt/node-staking/config/overview) nele
- Tem uma carteira de nó carregada no seu Smartnode
- Sincronizou os seus clientes de Execução e Consenso
- Provisionou o seu nó com [um endereço de retirada](/pt/node-staking/prepare-node#setting-your-withdrawal-address), configurou os seus [clientes de fallback](/pt/node-staking/fallback) (opcional), optou pelo [Smoothing Pool](/pt/node-staking/fee-distrib-sp#the-smoothing-pool) (opcional), e configurou [MEV](/pt/node-staking/mev)
- Criou pelo menos um [minipool](/pt/node-staking/create-validator)

## Existem três endereços envolvidos na votação

- Endereço de Sinalização pDAO — será usado como o seu endereço Snapshot, se você quiser votar diretamente ou se quiser sobrepor o voto Snapshot do seu delegado. Este endereço é usado apenas para Snapshot, não para votação on-chain.

- Nó Delegado pDAO — se você optar por delegar o seu voto. Você irá configurá-lo para o endereço do nó do seu delegado. Se você escolher um delegado, ele votará por você no Snapshot e em propostas on-chain.

- Endereço do Nó — se você não delegou o seu voto ou se desejar sobrepor o voto on-chain do seu delegado, você pode fazer isso a partir do seu nó.

## Guias

[A DAO do Protocolo](/pt/pdao/pdao) discute quem e como a pDAO governa o Rocket Pool. Esta página irá informá-lo sobre como as responsabilidades da pDAO, tais como gastos do tesouro, podem ser executadas on-chain, juntamente com o papel do totalmente novo Conselho de Segurança. Também o guiará através do ciclo de vida de uma proposta pDAO e explicará algumas das medidas tomadas para prevenir spam e derrubar propostas maliciosas.

[Configuração de votação para usuários não-smartnode](/pt/legacy/houston/nonsmartnode-setup) mostra aos usuários não-smartnode (como usuários Allnodes) como configurar a votação.

[Inicializando o Poder de Voto](/pt/pdao/participate#initializing-voting) mostra como inicializar o poder de voto do seu nó. Este passo é necessário apenas se o seu nó foi registrado antes da Atualização Houston.

[Definindo o seu Endereço de Sinalização Snapshot](/pt/pdao/participate#setting-your-snapshot-signalling-address) irá guiá-lo através dos passos para definir um Endereço de Sinalização. Isso permitirá que você vote no Snapshot usando o poder de voto do seu nó sem precisar carregar a chave privada do seu nó em uma carteira quente. Certifique-se de ter o CLI do seu Smartnode à mão e prepare um endereço (que não seja a carteira do seu nó) para este guia.

[Delegando o Poder de Voto](/pt/pdao/participate#delegating-voting-power) é um comando rápido que você pode usar para delegar o poder de voto em vez de votar diretamente nas propostas.

[Visualizando o Estado de uma Proposta](/pt/pdao/participate#viewing-the-state-of-a-proposal) é um guia sobre como você pode visualizar uma lista de propostas on-chain passadas e em andamento. Você poderá verificar o estado e ler os detalhes de qualquer proposta on-chain.

[Votando em uma Proposta](/pt/pdao/participate#voting-on-a-proposal) mostra como votar em uma proposta on-chain. Este guia também aborda as quatro opções: **Abstenção**, **A Favor**, **Contra**, e **Veto**.

[Criando uma Proposta](/pt/pdao/participate#creating-a-proposal) o guia através dos requisitos e passos para levantar uma proposta on-chain.

[Executando uma proposta bem-sucedida](/pt/pdao/participate#executing-a-successful-proposal) irá mostrar como aplicar os efeitos de uma proposta bem-sucedida ao Protocolo Rocket Pool.

[Reivindicando Garantias e Recompensas](/pt/pdao/participate#claiming-bonds-and-rewards) discute as condições nas quais garantias ou recompensas podem ser reivindicadas por um Proponente ou Desafiante.

[Criando e Reivindicando um gasto recorrente do tesouro](/pt/pdao/participate#creating-a-recurring-treasury-spend) é um recurso que dá à pDAO controle total sobre adicionar, modificar e remover pagamentos recorrentes.
