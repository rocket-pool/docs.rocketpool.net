# Selecionando um Provedor de Hospedagem

Se você chegou a esta seção, então gostaria de executar um nó Rocket Pool mas não pode configurar um localmente em sua casa; você precisa de um **servidor privado virtual (VPS)** hospedado na nuvem.
Existem vários serviços diferentes disponíveis que podem fornecer tal máquina, e eles vêm em dois sabores diferentes: provedores VPS e provedores de nuvem pública.

Escolher o correto pode ser difícil, e entender as diferenças entre eles é fundamental.
Neste guia, vamos lançar alguma luz sobre a distinção e listar alguns dos serviços que outros usuários do Rocket Pool aproveitaram no passado para ajudá-lo a navegar por suas opções.

## Hospedagem VPS Tradicional

Um servidor privado virtual é uma única instância de uma máquina virtual que reside em uma máquina física maior.
Eles são a opção mais barata, e são empregados com menos frequência do que as plataformas de nuvem onipresentes, então tendem a contribuir mais para a descentralização da rede Ethereum.

No entanto, eles raramente têm suporte de alta disponibilidade; se o servidor físico cair, é provável que seu VPS hospedado nele também caia.
Além disso, eles têm uma pegada de recursos fixa; geralmente não é possível aumentar ou diminuir recursos como CPU e RAM sob demanda.

A partir de 10/2024, uma opção com bom preço e desempenho era o RS 12000 G11 da [Netcup](https://www.netcup.eu/vserver/vps.php).
Uma palavra de advertência é que o armazenamento é compartilhado com outros, então IOPs de armazenamento são um gargalo potencial.

## Hospedagem de Servidor Dedicado

Ao contrário de um VPS, um servidor dedicado é um dispositivo físico inteiro que é alugado por você. Eles são uma opção relativamente acessível, e são empregados com menos frequência do que as plataformas de nuvem onipresentes, então tendem a contribuir mais para a descentralização da rede Ethereum.

A partir de 10/2024, duas opções com bom preço e desempenho eram os servidores bare-metal Rise e Advanced da [OVH](https://us.ovhcloud.com/). Há uma variedade destes que mudam ao longo do tempo, assim como vendas significativas. Você precisará verificar se as [diretrizes de hardware](../local/hardware.md) são atendidas.

## Hospedagem em Nuvem

Hospedagem em nuvem se refere a máquinas virtuais que são distribuídas em uma rede distribuída de vários servidores, em vez de serem hospedadas em uma única máquina física.
Se uma das máquinas hospedeiras falhar, as outras podem assumir perfeitamente para ela, então a disponibilidade e confiabilidade tendem a ser extremamente altas nessas plataformas.
Elas também tendem a oferecer opções de recursos flexíveis; é relativamente simples adicionar mais CPU, RAM ou espaço em disco sob demanda.

Devido a esses benefícios extras, servidores baseados em nuvem tendem a ser mais caros do que soluções VPS.
Eles também são plataformas muito populares, então usá-los geralmente reduz a descentralização geral da rede Ethereum.

Os 3 principais provedores de nuvem são [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/) e [Google Cloud Platform (GCP)](https://cloud.google.com/).
Não recomendamos usar hospedagem em nuvem devido a preocupações de preço e centralização.

## Considerações Principais

### Preço

Soluções de hospedagem em nuvem geralmente são uma escolha mais segura se o custo não for uma prioridade.
A seção abaixo tem um detalhamento mais detalhado das estimativas de custo, mas aqui está uma comparação geral entre uma opção VPS e uma opção em nuvem:

- Servidor Dedicado OVH: $90-160/mês
- VPS Netcup: $90/mês
