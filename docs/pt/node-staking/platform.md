# Requisitos do Node e Escolhendo uma Plataforma

Muito bem!
Então você decidiu tentar executar um node do Rocket Pool.
O primeiro passo do processo é decidir que tipo de plataforma você quer executar seu node.
Se você já tem uma em mente, ótimo!
Você pode pular para a próxima seção.
Se você ainda não tem certeza, então continue lendo para obter algumas informações sobre suas opções.

## Requisitos de Full Node

Um **full node** é aquele que executa tanto um Execution Client quanto um Consensus Client junto com a stack do Rocket Pool.
Agora que o Merge ocorreu, nodes do Rocket Pool são obrigados a executar esta configuração (embora os clientes Execution e Consensus possam ser gerenciados externamente para usuários que já executam uma configuração de solo-staking - cobriremos isso em mais detalhes mais tarde).

Aqui está um resumo simples do que é necessário para executar bem um full node do Rocket Pool:

- Uma **conexão de Internet estável**. Quanto mais tempo você ficar online, melhores serão suas recompensas. Uma conexão de Internet instável prejudicará seus retornos e, por extensão, o crescimento da proporção rETH.
- Pelo menos **10Mbps de largura de banda tanto para upload quanto download**. Um full node geralmente consome cerca de 8Mbps a 10Mbps de tráfego de rede para upload e download, dependendo da sua configuração e número de minipools.
- **Sem limite de dados** imposto pelo seu ISP. Executar um full node consumirá muitos dados - vimos relatos de mais de 2 TB por mês apenas em dados de blockchain. Isso pode ser mitigado um pouco com alguns ajustes nas configurações dos clientes ETH, mas como regra geral, não execute um full node se seu plano de Internet vem com um limite mensal de dados.
- **Eletricidade estável**. Pela mesma razão de precisar de uma conexão de Internet estável, você também quer ter energia confiável. Isso pode ser mitigado com um UPS grande (bateria de backup) para lidar com quedas de energia curtas.
- Um **computador** com especificações suficientes. Isso é bastante flexível porque _realmente_ depende de qual cliente Execution e Consensus você usa, e quais configurações você define. O computador pode ser uma máquina local, ou pode ser hospedado na nuvem. Leia abaixo para mais informações sobre essas duas opções, e como decidir qual é melhor para você.

O computador deve atender às [diretrizes de hardware](./local/hardware.md)

::: warning NOTA
Neste momento, apenas plataformas **Linux** e **macOS** são suportadas.
**Windows não é atualmente suportado** para operação do Smartnode.
:::

## Executando um Node Local

Se você tem eletricidade confiável e acesso à Internet sem limite de dados, e está disposto a construir (ou comprar pré-montado) e manter um computador, então executar um node local pode ser uma ótima escolha para você. Com esta opção, você configurará um computador dedicado como um node do Rocket Pool e o executará localmente em sua própria casa.

Vantagens:

- Sem taxas mensais, além de utilidades
- Controle completo sobre sua própria máquina e seus dados (incluindo a chave da sua carteira)
- Acesso para realizar manutenção e atualizações sempre que quiser
- Contribui para a descentralização do Execution e Consensus, e do Rocket Pool (e assim, sua segurança)

Desvantagens:

- Requer Internet estável e sem limite de dados e eletricidade
  - **Executar um node usa pelo menos 1,5 TB de dados por mês. Se você tem um limite de dados abaixo desta quantidade, pode ter problemas ao executar um node local!**
- Você é o único responsável pela segurança da rede e do computador
- Pode ser desafiador se você não tem experiência com manutenção de computadores
- Vulnerável a roubo

Se as vantagens parecem superar as desvantagens para você, então dê uma olhada em nosso [Guia do Operador de Node Local](./local/hardware.html).

## Executando em um Servidor

Se você não tem um plano de Internet confiável e sem limite de dados, ou simplesmente não quer lidar com a construção e manutenção de seu próprio computador físico, você pode querer considerar executar um servidor privado que você aluga de um provedor de hospedagem. Essencialmente, essas empresas criarão e executarão um servidor para você, por uma taxa mensal. Se você não se importa com essa taxa e quer executar um node do Rocket Pool, usar um servidor pode ser uma boa estratégia.

Vantagens:

- Sem manutenção, suporte geralmente está disponível para corrigir problemas
- Não afeta seu plano de Internet ou limite de dados
- Geralmente executado em um data center profissional, muito pouco tempo de inatividade
- Pode ser mais econômico do que comprar/construir seu próprio computador

Desvantagens:

- Torna o Execution e Consensus, e o Rocket Pool um pouco mais centralizados, o que enfraquece a segurança das redes
- Taxas mensais
- Servidores podem vir com limites de dados, ou ter taxas de I/O de rede caras
- Possível para os hosts examinarem o conteúdo da sua máquina e pegarem a chave da sua carteira se não estiver segura

Se essas vantagens parecem superar as desvantagens para você, então dê uma olhada em nosso [Guia do Operador de Node em Servidor](./vps/providers.html).
