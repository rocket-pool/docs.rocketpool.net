# Testando seu Node Oracle DAO

Uma vez que seu node esteja configurado e você tenha entrado no Oracle DAO, você deve testá-lo para garantir que é capaz de realizar suas tarefas adequadamente.
A melhor maneira de fazer isso é fazê-lo construir a árvore Merkle de recompensas Redstone usando o utilitário `treegen` do Rocket Pool.

### treegen

`treegen` é uma ferramenta que pode reproduzir a árvore Merkle de recompensas completa e artefatos acompanhantes para um intervalo de recompensas anterior via seus clientes Execution e Consensus de arquivo.
Também pode fazer uma "execução seca" do intervalo atual fingindo que terminou na última época finalizada (no momento de executá-lo) e produzindo uma árvore parcial desde o início do intervalo até aquele ponto.

::: tip DICA
Para mais informações sobre a própria árvore de recompensas e arquivos acompanhantes, visite [**a especificação formal**](https://github.com/rocket-pool/rocketpool-research/blob/master/Merkle%20Rewards%20System/merkle-tree-spec).
:::

`treegen` pode ser usado como um binário standalone (atualmente construído apenas para sistemas Linux, x64 e arm64) ou como um container Docker.

Se você gostaria de baixar o binário standalone, pode encontrá-lo nos releases aqui: [https://github.com/rocket-pool/treegen](https://github.com/rocket-pool/treegen).
As instruções de uso estão incluídas no README lá, mas vamos cobrir alguns exemplos abaixo também.

A tag do container Docker para ele é `rocketpool/treegen:latest`.

## Construindo uma Árvore de Execução Seca

Para um primeiro teste, execute `treegen` para gerar uma árvore de execução seca que calcula a árvore desde o início do intervalo de recompensas até o último slot (finalizado).
Vamos usar [o script](https://github.com/rocket-pool/treegen/blob/main/treegen.sh) incluído no repositório que aproveita o container Docker para executá-lo na própria máquina do node para simplicidade:

```shell
./treegen.sh -e http://localhost:8545 -b http://localhost:5052
```

::: warning NOTA
Note que esta configuração particular requer que você exponha as APIs do Execution Client e Beacon Node através da configuração Docker - certifique-se de ter ambas as opções habilitadas na TUI `rocketpool service config`.
:::

Isso testará as capacidades dos seus clientes de responder a consultas de maneira oportuna (por exemplo, se você está usando um serviço de terceiros, isso será útil para avaliar se o limite de taxa de consulta dele é insuficiente ou não), mas **não testará suas capacidades de Modo de Arquivo**.
Ele produzirá saída como a seguinte:

```
2022/11/06 12:11:37 Beacon node is configured for Mainnet.
2022/11/06 12:11:37 Generating a dry-run tree for the current interval (3)
2022/11/06 12:11:37 Snapshot Beacon block = 5077503, EL block = 15912334, running from 2022-10-27 01:35:39 -0400 EDT to 2022-11-06 12:11:37.672755513 -0500 EST m=+0.049901525

2022/11/06 12:11:38  Creating tree for 1684 nodes
2022/11/06 12:11:38  Pending RPL rewards: 27807066876373932561121 (27807.067)
2022/11/06 12:11:38  Total collateral RPL rewards: 19464946813461752792784 (19464.947)
2022/11/06 12:11:47  Calculated rewards:           19464946813461752792026 (error = 758 wei)
2022/11/06 12:11:47  Total Oracle DAO RPL rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Calculated rewards:           4171060031456089884168 (error = 0 wei)
2022/11/06 12:11:47  Expected Protocol DAO rewards: 4171060031456089884168 (4171.060)
2022/11/06 12:11:47  Actual Protocol DAO rewards:   4171060031456089884927 to account for truncation
2022/11/06 12:11:47  Smoothing Pool Balance: 62781809204406327225 (62.782)
2022/11/06 12:11:55  1229 / 1684 nodes were eligible for Smoothing Pool rewards
2022/11/06 12:12:03  Checking participation of 4364 minipools for epochs 156315 to 158671
2022/11/06 12:12:03  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/06 12:13:48  On Epoch 156415 of 158671 (4.24%)... (1m44.577189073s so far)

...

2022/11/06 12:49:55  On Epoch 158615 of 158671 (97.62%)... (37m51.785456663s so far)
2022/11/06 12:50:51  Finished participation check (total time = 38m47.979633935s)
2022/11/06 12:50:51  Pool staker ETH:    26638263090669169632 (26.638)
2022/11/06 12:50:51  Node Op ETH:        36143546113737157593 (36.144)
2022/11/06 12:50:51  Calculated NO ETH:  36143546113737155125 (error = 2468 wei)
2022/11/06 12:50:51  Adjusting pool staker ETH to 26638263090669172100 to account for truncation
2022/11/06 12:50:52 Saved minipool performance file to rp-minipool-performance-mainnet-3.json
2022/11/06 12:50:52 Generation complete! Saving tree...
2022/11/06 12:50:52 Saved rewards snapshot file to rp-rewards-mainnet-3.json
2022/11/06 12:50:52 Successfully generated rewards snapshot for interval 3.
```

Se isso executar sem erro, ele gerará os artefatos da árvore de recompensas e os salvará como arquivos JSON em seu diretório de trabalho.
Você é livre para explorá-los e garantir que seus conteúdos sejam sensatos, mas como são arquivos de execução seca, eles não são armazenados canonicamente em nenhum lugar para comparação.

## Construindo uma Árvore Canônica de um Intervalo Passado

Este próximo teste é para replicar uma das árvores completas de um intervalo passado.
Isso exigirá acesso de arquivo tanto na Camada de Execution quanto na Camada de Consensus, então servirá como um bom teste de ambas as capacidades.

No momento desta escrita, **Intervalo 2** é uma escolha ideal, pois está distante no passado e envolveu o Smoothing Pool (que representa a maior carga computacional ao calcular as recompensas para o período).

Execute `treegen` usando o seguinte comando:

```shell
./treegen.sh -e http://<sua url archive EC> -b http://localhost:5052 -i 2
```

Note que a **URL do Execution Client** é diferente aqui: _deve ser_ um EC de Arquivo, pois o bloco de snapshot para o Intervalo 2 estava distante no passado.

::: warning NOTA
Dependendo da configuração do seu cliente, construir esta árvore pode levar _horas_.
O Smartnode fornecerá indicadores de status sobre seu progresso ao longo do caminho, como você pode ver no exemplo abaixo.
:::

A saída parecerá com isso (truncada por brevidade):

```
2022/11/07 23:44:34 Beacon node is configured for Mainnet.
2022/11/07 23:44:36 Found rewards submission event: Beacon block 5002079, execution block 15837359
2022/11/07 23:46:25  Creating tree for 1659 nodes
2022/11/07 23:46:26  Pending RPL rewards: 70597400644162994104151 (70597.401)
2022/11/07 23:46:26  Approx. total collateral RPL rewards: 49418180450914095872905 (49418.180)
2022/11/07 23:46:26  Calculating true total collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:47:06  On Node 100 of 1659 (6.03%)... (40.134456319s so far)
...
2022/11/07 23:57:41  On Node 1600 of 1659 (96.44%)... (11m14.880994468s so far)
2022/11/07 23:58:03  Calculating individual collateral rewards (progress is reported every 100 nodes)
2022/11/07 23:58:14  On Node 100 of 1659 (6.03%)... (11.421791885s so far)
...
2022/11/08 00:01:20  On Node 1600 of 1659 (96.44%)... (3m16.598462676s so far)
2022/11/08 00:01:26  Calculated rewards:           49418180450914095872087 (error = 818 wei)
2022/11/08 00:01:26  Total Oracle DAO RPL rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Calculated rewards:           10589610096624449115610 (error = 12 wei)
2022/11/08 00:01:30  Expected Protocol DAO rewards: 10589610096624449115622 (10589.610)
2022/11/08 00:01:30  Actual Protocol DAO rewards:   10589610096624449116454 to account for truncation
2022/11/08 00:01:30  Smoothing Pool Balance: 209598268075128756591 (209.598)
2022/11/08 00:04:20  On Node 104 of 1659 (6.27%)... (2m49.443336528s so far)
...
2022/11/08 00:27:33  On Node 1664 of 1659 (99.70%)... (27m28.373343345s so far)
2022/11/07 16:40:36  1197 / 1659 nodes were eligible for Smoothing Pool rewards
2022/11/07 16:45:45  Checking participation of 4308 minipools for epochs 150015 to 156314
2022/11/07 16:45:45  NOTE: this will take a long time, progress is reported every 100 epochs
2022/11/07 16:47:24  On Epoch 150115 of 156314 (1.59%)... (1m38.552513232s so far)
...
2022/11/07 18:24:31  On Epoch 156215 of 156314 (98.43%)... (1h38m46.325518238s so far)
2022/11/07 18:26:10  Finished participation check (total time = 1h40m24.47206731s)
2022/11/07 18:26:10  Pool staker ETH:    88931841842952006598 (88.932)
2022/11/07 18:26:10  Node Op ETH:        120666426232176749993 (120.666)
2022/11/07 18:26:10  Calculated NO ETH:  120666426232176747457 (error = 2536 wei)
2022/11/07 18:26:10  Adjusting pool staker ETH to 88931841842952009134 to account for truncation
2022/11/07 18:26:10 Finished in 2h36m3.709234237s
2022/11/07 18:26:10 Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
2022/11/07 18:26:10 Saving JSON files...
2022/11/07 18:26:10 Saved minipool performance file to rp-minipool-performance-mainnet-2.json
2022/11/07 18:26:10 Saved rewards snapshot file to rp-rewards-mainnet-2.json
2022/11/07 18:26:10 Successfully generated rewards snapshot for interval 2.
```

A coisa principal a procurar aqui é esta mensagem no final:

```
Your Merkle tree's root of 0x278fd75797e2a9eddc128c0199b448877e30d1196c12306bdc95fb731647c18f matches the canonical root! You will be able to use this file for claiming rewards.
```

Se você receber isso, então sua watchtower pode construir a árvore corretamente.

::: danger NOTA
Embora isso prove que você pode construir a árvore, você _deve_ garantir que seu token da API Web3.Storage foi inserido na configuração do Smartnode para que possa fazer upload da árvore resultante para IPFS.
:::

### Próximos Passos

Em seguida, vamos cobrir como monitorar o desempenho do seu node.
