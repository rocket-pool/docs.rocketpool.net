---
next:
  text: The Protocol DAO
  link: "/pt/legacy/houston/pdao"
---

# A Atualização Houston

A atualização Houston é amplamente voltada para a introdução de uma DAO totalmente on-chain para governar o protocolo, conhecida como Protocol DAO ou pDAO. É uma DAO como nenhuma outra e não requer votação de snapshot ou quaisquer outras ferramentas de terceiros para funcionar, é verdadeiramente on-chain e única, mais sobre isso abaixo.

Esta atualização também estará introduzindo alguns outros recursos muito emocionantes que permitirão que novas integrações e plataformas sejam construídas no protocolo. Alguns deles incluem a capacidade de fazer staking de ETH em nome do nó (não apenas do próprio nó) e um novo recurso de endereço de retirada de RPL, que permite que uma parte forneça o ETH para staking e outra parte forneça o RPL sem dar custódia ao operador do nó"

## Protocol DAO

O Rocket Pool Protocol DAO (pDAO) é responsável por moldar a direção do protocolo e é executado pela governança RPL. Seus membros e seu poder de voto são compostos por operadores de nós, grandes e pequenos, todos os quais estão participando diretamente no protocolo.

Normalmente, a governança DAO no espaço cripto mais amplo é feita por votação ponderada por token. Basicamente, quanto mais tokens você possui de um protocolo/projeto, maior é o seu poder de voto. Você também não precisa estar participando ativamente no protocolo, simplesmente manter os tokens é suficiente.

Este estilo de governança que queríamos evitar. Se você quiser ajudar a direcionar e guiar o futuro da Rocket Pool, você precisa estar ativamente envolvido, não apenas armazenando tokens em uma carteira fria. Dos maiores fundos de capital de risco ao cara comum executando um único minipool, você precisará estar participando ativamente no protocolo para ajudar a governá-lo.

Atualmente, o protocol DAO tem controle sobre uma variedade de configurações on-chain que são usadas no protocolo. Novas Rocket Pool Improvement Proposals (RPIP) podem ser feitas e votadas por esses Operadores de Nó dentro da Rocket Pool. Você pode ver o [**registro atual de RPIP aqui**](https://rpips.rocketpool.net/). Se você é um demônio para detalhes, a RPIP atual para o protocol DAO on-chain discutido agora pode ser encontrada aqui.

### O que o pDAO pode fazer?

O pDAO tem controle sobre muitas configurações do protocolo, pode gastar fundos do tesouro e, em nossa atualização Houston, vem com um novo conselho de segurança para ajudar a reagir rapidamente no caso de quaisquer problemas potenciais com o protocolo. Vamos falar um pouco mais sobre cada um deles abaixo.

**Parâmetros do Protocolo:** Estes controlam certos aspectos do protocolo, como a configuração que controla o valor mínimo de ETH que pode ser depositado para rETH (atualmente 0,01 ETH) ou até mesmo controlar o tamanho máximo do pool de depósito, que é quanto ETH máximo pode ser depositado no protocolo enquanto aguarda ser atribuído aos operadores de nós para staking. Você pode encontrar uma tabela completa [dessas configurações aqui](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Fundos do Tesouro:** O RPL tem uma taxa de inflação de 5% e uma parte disso é alocada para o tesouro do pDAO. O pDAO tem a capacidade de gastar esse tesouro em uma variedade de empreendimentos orientados ao protocolo, desde financiar o desenvolvimento do protocolo diretamente, gerenciamento de concessões para financiar melhorias de terceiros e projetos que fazem uso da Rocket Pool e muito mais. Nossa atualização Houston adiciona uma nova capacidade onde esses pagamentos do tesouro podem ser feitos não apenas de maneira única, mas de maneira progressiva para ajudar a acompanhar metas em relação ao financiamento contínuo.

**Conselho de Segurança:** À medida que a atualização Houston move o pDAO para um sistema totalmente on-chain, uma nova medida de segurança foi introduzida na forma do [conselho de segurança](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council). Esses membros podem ser eleitos pelo pDAO e têm a capacidade de pausar o protocolo rapidamente no caso de quaisquer problemas potenciais ocorrerem. O quórum deve ser alcançado entre os membros para que qualquer resposta de segurança seja executada. O pDAO também tem o poder de remover membros ou dissolver o conselho de segurança inteiramente, se necessário.

### Propostas e Votação

Para que qualquer sistema de governança funcione, é necessário haver propostas e votação. No momento, a votação de snapshot é usada para essas configurações e mudanças de proposta, então alguma intervenção manual é necessária para executar as mudanças. Com a introdução da [atualização Houston e RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33), isso é movido para um novo sistema otimista de prova de fraude que permite que qualquer operador de nó levante, vote ou desafie propostas, diretamente on-chain sem a necessidade de ferramentas de terceiros.

**Propondo:** Qualquer nó com poder de voto diferente de zero pode levantar uma proposta a qualquer momento. Ao fazer isso, eles devem bloquear um vínculo de proposta na forma de RPL para todo o processo de proposta.

**Desafiando:** Se um nó que criou uma proposta for encontrado tendo feito isso com dados incorretos necessários, eles podem ser desafiados e o desafiador deve fornecer um vínculo para o desafio. O nó que faz o desafio pode ser recompensado com o vínculo do proponente feito ao criar a proposta se bem-sucedido, no entanto, se eles fizeram um desafio inválido, o proponente pode coletar seu vínculo de desafio.

**Votação**: Se uma proposta passa o período em que pode ser desafiada, ela entra nos períodos de votação. Os operadores de nós podem então escolher votar em um dos seguintes sabores:

1. Abstenção: O poder de voto do eleitor é contribuído para o quórum, mas não é nem a favor nem contra a proposta.
2. A favor: O eleitor vota a favor da execução da proposta.
3. Contra: O eleitor vota contra a execução da proposta.
4. Veto: O eleitor vota contra a proposta, bem como indica que considera a proposta como spam ou maliciosa. Se o quórum de veto for alcançado, a proposta é imediatamente derrotada e o proponente perde seu vínculo. Isso é para dissuadir spam, propostas de baixa qualidade ou propostas que não passaram por processos off-chain primeiro, como sinalização por votação de snapshot.

Existem **dois períodos de votação**

- Período de Votação 1: Para eleitores ou delegados votando em nome de outros.
- Período de Votação 2: Para eleitores que delegaram seu poder e querem reverter a decisão de seu delegado.

Uma vez que ambos os períodos de votação tenham passado e a proposta seja bem-sucedida, a proposta pode ser executada e a mudança é aplicada ao protocolo Rocket Pool.

Após a proposta ter passado pelos períodos de votação, o proponente pode desbloquear seu vínculo RPL, a menos que a proposta tenha sido derrotada por um desafio ou vetada.

## Stake de ETH em Nome de um Nó

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) permite que uma conta [faça staking de ETH em nome](../houston/stake-eth-on-behalf.mdx) de um nó Rocket Pool que está registrado no protocolo. Isso suporta uma variedade de situações em que o operador do nó não está fornecendo diretamente o ETH:

- Segurança aprimorada para operadores de nós, pois eles podem fazer staking diretamente de sua carteira de hardware, eliminando a necessidade de transferir fundos para o nó com antecedência.
- Provedores de Staking as a Service, onde a custódia dos fundos é gerenciada por um custodiante confiável.
- Integrações de protocolo, onde a custódia dos fundos é gerenciada por contratos inteligentes.
- DAOs ou organizações, onde a custódia dos fundos é gerenciada por um tesouro.

Embora o objetivo principal deste recurso seja facilitar cenários de depositante único, vale a pena notar que vários depositantes independentes também podem aproveitar essa capacidade criando contratos inteligentes em camadas em cima. A Rocket Pool também introduziu a capacidade de fazer staking de RPL em nome de volta em nosso lançamento Atlas anterior.

## Endereço de Retirada de RPL

A Rocket Pool atualmente permite que os operadores de nós especifiquem um endereço de retirada para seu ETH e RPL. Isso pode ser uma carteira de hardware externa ou algo igualmente seguro.

Com [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31), você pode definir um endereço de retirada para seu ETH e [um novo para seu RPL](../houston/rpl-withdrawal-address) se desejar. O endereço de retirada de RPL, se definido, poderá acionar e reivindicar RPL de recompensas de inflação e não terá efeito nas recompensas de consenso de ETH ou qualquer coisa relacionada ao ETH.

Isso cria algumas oportunidades interessantes em que o RPL pode ser fornecido por uma entidade a um operador de nó que não deseja ter exposição ao RPL. Essa entidade pode então reivindicar recompensas de RPL por fornecer a garantia de seguro necessária para o nó.

## Envios de Saldo e Preço de RPL Baseados em Tempo

Os nós Rocket Pool precisam ter pelo menos 10% de garantia em RPL em staking para serem elegíveis para recompensas, com seu "stake efetivo" calculado com base na proporção ETH:RPL, que é relatada pelo Oracle DAO no final de cada intervalo de recompensas. Anteriormente, essa "janela de recarga" (o tempo entre o relatório final de RPL e o final do intervalo) tinha alguma incerteza e flutuava de intervalo para intervalo porque estava sendo especificada por número de blocos. Isso era válido antes da fusão, mas não considerava a variabilidade e aleatoriedade na forma como os blocos são adicionados.

Para resolver isso, os intervalos para relatórios de preço e saldo agora serão baseados em segundos em vez de blocos. Essa mudança garante previsibilidade e tem paridade com a forma como os intervalos de recompensas são calculados hoje. Se o intervalo for definido como `86400` segundos (número de segundos em 24 horas), preços e saldos são relatados no mesmo horário todos os dias.

O protocolo agora tem uma "janela de recarga" fixa e controlável, removendo suposições e fornecendo aos usuários uma janela consistente de 24 horas para recarregar após a atualização final de preço. Sinta-se à vontade para ler mais sobre essa mudança em [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Auditorias

Em preparação para a Atualização Houston, a Rocket Pool se envolveu com três das equipes de auditoria mais estimadas no ecossistema Ethereum.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Final de novembro a meados de dezembro de 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Final de novembro de 2023, depois uma segunda rodada em março de 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Meados de janeiro a abril de 2024)

Para um histórico completo de auditorias, além de detalhes sobre o programa de recompensas de bugs do Immunefi, visite aqui:
https://rocketpool.net/protocol/security
