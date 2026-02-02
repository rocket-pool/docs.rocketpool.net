# Monitorando seu Nó Oracle DAO

Uma vez que seu nó esteja funcionando, é importante que você monitore regularmente sua saúde para garantir que esteja executando corretamente suas tarefas automatizadas.
Fazer isso envolve o seguinte:

- Monitorar a saúde do seu sistema físico (ou virtual) no nível do sistema operacional
- Monitorar a saúde dos seus clientes de Execução e/ou Consenso (se você executar clientes locais)
- Garantir que seu nó está enviando regularmente as transações necessárias para a chain para atualizações de status
- Garantir que você tem um saldo de ETH suficiente na sua carteira do nó para executar essas transações
- Aplicar rotineiramente atualizações ao Smartnode, seus clientes (se aplicável) e seu Sistema Operacional
- Monitorar a saúde dos outros membros do Oracle DAO, e se comunicar com eles se você acreditar que seus nó(s) não estão funcionando adequadamente

Nesta seção, descreveremos alguns exemplos de como fazer isso via o suporte integrado do Smartnode ao [Grafana](https://grafana.com/).

## O Painel Padrão do Rocket Pool

O Smartnode fornece um painel conveniente que permite monitorar muitas das métricas listadas acima.
Há um painel para cada Cliente de Consenso.
Abaixo está um exemplo do painel para Nimbus:

![](../node-staking/images/nimbus-dashboard.png)

- A saúde do hardware da sua máquina é capturada no quadrante superior esquerdo.
- Seu cliente de Execução está funcionando adequadamente se as Estatísticas de Rede no quadrante inferior esquerdo estiverem sendo populadas.
- Seu cliente de Consenso está funcionando adequadamente se a contagem de pares no quadrante superior direito estiver atualizando com um número diferente de zero; o número exato depende da sua escolha de cliente e sua configuração de rede.
- O saldo de ETH do seu nó é exibido na tabela no canto inferior direito.
- Quaisquer atualizações do Sistema Operacional ou do Smartnode são apresentadas na caixa `Available Updates` no painel superior central.

::: tip NOTA
Atualizações do Sistema Operacional e do Smartnode requerem o rastreador de atualizações, que você pode instalar via `rocketpool service install-update-tracker`.
:::

Para informações sobre como preparar o sistema de métricas e o painel do Smartnode, visite as páginas [Monitorando o Desempenho do seu Nó](../node-staking/performance) e [Configurando o Painel Grafana](../node-staking/grafana.mdx) da documentação do Smartnode.

## O Painel Oracle DAO

Nós também construímos um painel simples especificamente adaptado para membros do Oracle DAO:

![](../odao/images/odao-dashboard.png)

Este painel rastreia o seguinte:

- O status das propostas do Oracle DAO que precisam ser votadas ou executadas (mais detalhes sobre isso na próxima seção)
- O histórico de submissões para atualizações de preço e saldo\*
- Os saldos de ETH de cada nó Oracle DAO

\*_Note que a submissão de preço e saldo atualmente requer um quórum de 51% dos nós para concordar em cada um, ponto em que a submissão é canonizada. Submissões de outros membros serão revertidas pois não são mais necessárias, então se seu nó não enviar para um determinado intervalo, isso não significa que esteja offline. Você deve se preocupar se perder mais de 5 intervalos consecutivos seguidos, e deve verificar seus logs do daemon `watchtower` para verificar se não há problemas._

Habilitar este painel é um processo de duas etapas.

Primeiro, habilite as métricas do Oracle DAO na seção `Metrics` do editor `rocketpool service config`:

![](../odao/images/tui-odao-metrics.png)

Se você estiver executando em modo Docker ou Híbrido, isso reiniciará seu daemon `node` para aplicar as mudanças.
Se você estiver executando em modo Nativo, por favor reinicie o serviço `node` manualmente.

Segundo, importe o [painel Oracle DAO](https://grafana.com/grafana/dashboards/15003-odao-member-dashboard/) do Grafana Labs (ID `15003`) no servidor Grafana local do seu nó.

## Verificando os Logs

Se você ou um dos outros membros do Oracle DAO expressou preocupação com seu nó, a primeira linha de defesa é olhar os logs do daemon `watchtower` usando (para modo Docker e Híbrido) o seguinte comando:

```shell
rocketpool service logs watchtower
```

Isso mostrará os logs do `docker` para o container watchtower, truncando para as últimas cem linhas ou mais.

Para voltar mais atrás, você pode usar a flag `-t` para indicar o número de linhas.
Por exemplo:

```shell
rocketpool service logs watchtower -t 2000
```

mostrará as últimas 2000 linhas.
Como isso ficará confuso muito rápido, você pode querer canalizar isso para um utilitário como `less` para que seja rolável.

## Próximos Passos

Na próxima seção, cobriremos as tarefas que você deve executar manualmente como membro do Oracle DAO.
