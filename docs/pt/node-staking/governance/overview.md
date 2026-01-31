---
next:
  text: A Protocol DAO
  link: "/pt/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Visão Geral

Esta seção descreve o processo de configuração do seu nó para participar de propostas on-chain e snapshot. Há muito para desempacotar, então recomendamos fortemente ler uma visão geral da [Atualização Houston](/pt/legacy/houston/whats-new). Isso ajudará você a entender os recursos mais recentes que habilitam a governança on-chain e como você pode participar na formação do protocolo.

## Pré-requisitos

Antes de configurar seu Smartnode, certifique-se de:

- Ter configurado uma máquina de nó (ou máquina virtual) e protegido-a (através do guia [Protegendo seu Nó](../securing-your-node))
- Ter o Smartnode [instalado](../installing/overview) e [configurado](../config/overview) nela
- Ter uma carteira de nó carregada no seu Smartnode
- Sincronizado seus clientes de Execução e Consenso
- Provisionado seu nó com [um endereço de saque](../prepare-node#setting-your-withdrawal-address), configurado seus [clientes de fallback](../fallback) (opcional), optado pelo [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional), e configurado [MEV](../mev)
- Criado pelo menos um [minipool](../create-validator)

## Existem três endereços envolvidos na votação

- Endereço de Sinalização da pDAO — será usado como seu endereço Snapshot, se você quiser votar diretamente ou se quiser sobrescrever o voto Snapshot do seu delegado. Este endereço é usado apenas para Snapshot, não para votação on-chain.

- Nó Delegado da pDAO — se você escolher delegar seu voto. Você irá configurá-lo para o endereço do nó do seu delegado. Se você escolher um delegado, ele votará por você no Snapshot e para propostas on-chain.

- Endereço do Nó — se você não delegou seu voto ou se desejar sobrescrever o voto on-chain do seu delegado, você pode fazer isso a partir do seu nó.

## Guias

[A Protocol DAO](/pt/legacy/houston/pdao#the-protocol-dao-pdao) discute quem e como a pDAO governa Rocket Pool. Esta página irá informá-lo sobre como deveres da pDAO, como gastos do tesouro, podem ser executados on-chain, juntamente com o papel do novo Conselho de Segurança. Também orientará você através do ciclo de vida de uma proposta da pDAO e explicará algumas das medidas tomadas para evitar spam e derrubar propostas maliciosas.

[Configuração de votação para usuários que não usam smartnode](/pt/legacy/houston/nonsmartnode-setup) mostra aos usuários que não usam smartnode (como usuários Allnodes) como configurar a votação.

[Inicializando Poder de Voto](/pt/legacy/houston/participate#initializing-voting) mostra como inicializar o poder de voto do seu nó. Esta etapa é necessária apenas se seu nó foi registrado antes da Atualização Houston.

[Configurando seu Endereço de Sinalização Snapshot](/pt/legacy/houston/participate#setting-your-snapshot-signalling-address) orientará você pelas etapas para configurar um Endereço de Sinalização. Isso permitirá que você vote no Snapshot usando o poder de voto do seu nó sem precisar carregar a chave privada do seu nó em uma carteira quente. Certifique-se de ter seu CLI do Smartnode à mão e prepare um endereço (que não seja sua carteira de nó) para este guia.

[Delegando Poder de Voto](/pt/legacy/houston/participate#delegating-voting-power) é um comando rápido que você pode usar para delegar poder de voto em vez de votar diretamente nas propostas.

[Visualizando o Estado de uma Proposta](/pt/legacy/houston/participate#viewing-the-state-of-a-proposal) é um guia sobre como você pode visualizar uma lista de propostas on-chain passadas e em andamento. Você poderá verificar o estado e ler os detalhes de qualquer proposta on-chain.

[Votando em uma Proposta](/pt/legacy/houston/participate#voting-on-a-proposal) mostra como votar em uma proposta on-chain. Este guia também aborda as quatro opções: **Abstenção**, **A Favor**, **Contra** e **Veto**.

[Criando uma Proposta](/pt/legacy/houston/participate#creating-a-proposal) orienta você pelos requisitos e etapas para levantar uma proposta on-chain.

[Executando uma proposta bem-sucedida](/pt/legacy/houston/participate#executing-a-successful-proposal) mostrará como aplicar os efeitos de uma proposta bem-sucedida ao Protocolo Rocket Pool.

[Reivindicando Caução e Recompensas](/pt/legacy/houston/participate#claiming-bonds-and-rewards) discute as condições nas quais caução ou recompensas podem ser reivindicadas por um Proponente ou Desafiante.

[Criando e Reivindicando um gasto recorrente do tesouro](/pt/legacy/houston/participate#creating-a-recurring-treasury-spend) é um recurso que dá à pDAO controle total sobre adicionar, modificar e remover pagamentos recorrentes.
