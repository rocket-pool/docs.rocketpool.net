# Fazendo Backup do Seu Nó

::: tip NOTA
Isso está atualmente escrito para instalações em **Modo Docker**.
Alguns locais podem variar para usuários Hybrid ou Native.
:::

Em geral, se você criou sua carteira de nó e minipools através do Smartnode, a única coisa que você realmente precisa ter em mãos para recuperar seu nó de uma falha completa é o **mnemônico da sua carteira de nó**
Todo o resto pode ser recuperado a partir dele com bastante facilidade.

Se você tiver minipools que possuem chaves de validador geradas externamente (por exemplo, você migrou do **Allnodes** para seu próprio nó auto-hospedado), você precisará dos arquivos keystore privados para seus validadores também, já que eles não podem ser recuperados da carteira do nó.

Dito isso, uma vez que o Merge ocorra, você não poderá mais usar um cliente Execution leve (por exemplo, Pocket ou Infura) como fallback se precisar ressincronizar a cadeia da camada Execution.
Além disso, você será obrigado a ter um cliente Execution ativo e saudável para atestar corretamente.
Ter uma maneira rápida e confiável de se recuperar de uma falha do cliente Execution (como um banco de dados corrompido, mau funcionamento de SSD ou hardware comprometido/roubado) será crítico, pois pode levar horas ou até dias para sincronizar do zero.

Neste guia, mostraremos como fazer backup de algumas dessas coisas para ajudar a melhorar a resiliência do seu nó e minimizar o tempo de inatividade desnecessário.

::: warning NOTA
Este guia assume que você instalou o Smartnode no diretório padrão (`~/.rocketpool`).
Se você especificou um diretório de instalação diferente, substitua-o adequadamente nas instruções abaixo.
:::

## Itens Que Podem Ser Copiados em Backup

### Configuração do Smartnode

A configuração do Smartnode é armazenada em `~/.rocketpool/user-settings.yml`.
Você pode salvá-la e substituí-la para restaurar todas as suas configurações do Smartnode (ou seja, as coisas que você especificou em `rocketpool service config`).

### Dados da Cadeia do Cliente Execution / Cliente ETH1

Os dados da cadeia do cliente Execution são provavelmente a coisa mais importante para fazer backup.
Como mencionado, pode levar vários dias para ressincronizar os dados da cadeia do seu cliente Execution.
Após o Merge, isso significa horas a dias de tempo de inatividade e lucros perdidos!

Os dados da cadeia são armazenados dentro do volume Docker `rocketpool_eth1clientdata`, que por padrão está localizado em `/var/lib/docker/volumes/rocketpool_eth1clientdata`.
Observe que esta pasta normalmente não é acessível por contas de usuário sem privilégios; você precisará elevar para o usuário `root` para vê-la.

::: tip NOTA
Se você alterou o local de armazenamento do Docker durante a instalação inicial do Smartnode (como pessoas que executam Docker em um segundo SSD), você encontrará o volume em `/<seu ponto de montagem externo>/docker/volumes/rocketpool_eth1clientdata`

Se você não se lembra de qual caminho de instalação você usa, você pode verificar `/etc/docker/daemon.json` para sua localização.
Se o arquivo não existir, você usa o local padrão.
:::

Para instruções detalhadas sobre como fazer backup eficiente dos dados da cadeia Execution, consulte a seção [Fazendo Backup dos Seus Dados da Cadeia Execution](#fazendo-backup-dos-seus-dados-da-cadeia-execution) abaixo.

### Dados de Monitoramento e Métricas

Estes dados são armazenados dentro do volume Docker `rocketpool_grafana-storage`, que por padrão está localizado em `/var/lib/docker/volumes/rocketpool_grafana-storage` (ou `/<seu ponto de montagem externo>/docker/volumes/rocketpool_prometheus-data` se você personalizou sua localização de armazenamento do Docker).

## Itens Que **Não** Devem Ser Copiados em Backup

### Chaves Privadas e Senhas

A chave privada da carteira do seu nó e o arquivo de senha usado para criptografá-la são armazenados em `~/.rocketpool/data/wallet` e `~/.rocketpool/data/password` respectivamente.
Esses arquivos geralmente não precisam ser copiados em backup, pois podem ser recuperados do seu mnemônico usando `rocketpool wallet recover`.

Se, por algum motivo, você _decidir_ fazer backup desses arquivos, você precisará ser **extremamente cuidadoso** sobre como os armazena.
Qualquer pessoa que tenha acesso a esses arquivos terá acesso à sua carteira de nó, seus validadores e quaisquer fundos que você tenha armazenado nela para coisas como gas.

Nós **recomendamos fortemente** que você não faça backup desses arquivos e apenas use o mnemônico da sua carteira para recuperá-los se necessário.

### Dados da Cadeia do Cliente Consensus

Ao contrário dos dados da camada Execution, os dados da camada Consensus não são tão importantes para o seu nó graças ao [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Clientes Consensus podem facilmente usar essa técnica para ressincronizar imediatamente com a cabeça da Beacon chain e retomar os deveres de validação.

## Fazendo Backup dos Seus Dados da Cadeia Execution

O Smartnode vem com a capacidade de fazer backup dos seus dados da cadeia Execution através do comando `rocketpool service export-eth1-data`.
Por baixo dos panos, isso utiliza `rsync`, uma poderosa ferramenta de backup/cópia dentro do Linux.

`rsync` compara os arquivos no diretório de origem (seu volume Docker) e o diretório de destino (sua localização de backup).
Se um arquivo de origem não existir no diretório de destino, ele será copiado inteiramente.
No entanto, se ele _existir_, `rsync` copiará apenas as _mudanças_ entre os dois arquivos.

Isso significa que o primeiro backup levará um bom tempo, pois deve copiar todos os dados inicialmente.
Backups subsequentes copiarão apenas as mudanças entre seu backup anterior e agora, tornando o processo muito mais rápido.

Como parte de uma estratégia de backup, você pode querer planejar executar `export-eth1-data` regularmente.
Para garantir a integridade dos dados da cadeia, executar este comando irá **desligar com segurança o cliente Execution antes de fazer backup de seus dados**.
Se você optar por agendá-lo toda semana, seu cliente Execution ficará inativo por apenas alguns minutos enquanto atualiza o backup.
Isso certamente é melhor do que os dias que levaria para ressincronizar os dados do zero.

Para acionar um backup, comece **montando a mídia de armazenamento para a qual você deseja exportar os dados**.
Por exemplo, isso pode ser um disco rígido externo.

::: tip DICA
Se você não sabe como montar dispositivos externos no Linux, é fácil!
Conecte o dispositivo ao seu nó e siga [um guia como este](https://www.addictivetips.com/ubuntu-linux-tips/mount-external-hard-drives-in-linux/) para aprender como montá-lo.
:::

Depois de montá-lo, anote seu caminho de montagem.
Para este exemplo, vamos assumir que queremos armazenar os dados da cadeia em uma pasta chamada `/mnt/external-drive` na qual o dispositivo externo está montado.
Substitua isso pelo seu caminho de montagem real onde quer que você o veja abaixo.

Agora, execute o seguinte comando:

```shell
rocketpool service export-eth1-data /mnt/external-drive
```

Isso verificará se sua pasta de destino está acessível e tem espaço livre suficiente para armazenar os dados da cadeia.
A saída ficará assim:

```
This will export your execution client's chain data to an external directory, such as a portable hard drive.
If your execution client is running, it will be shut down.
Once the export is complete, your execution client will restart automatically.

You have a fallback execution client configured (http://<some address>:8545).
Rocket Pool (and your consensus client) will use that while the main client is offline.

Chain data size:       87 GiB
Target dir free space: 287 GiB
Your target directory has enough space to store the chain data.

NOTE: Once started, this process *will not stop* until the export is complete - even if you exit the command with Ctrl+C.
Please do not exit until it finishes so you can watch its progress.

Are you sure you want to export your execution layer chain data? [y/n]
```

Como você pode ver, os dados da cadeia estarão abaixo de 100 GB (para a testnet Hoodi; a mainnet Ethereum será uma ordem de magnitude maior) e a pasta externa tem 287 GiB livres, então a exportação pode continuar.

Quando estiver pronto, digite `y` aqui e pressione `Enter`.
Isso interromperá seu cliente Execution e começará a copiar seus dados da cadeia para sua pasta de destino.
Você verá o progresso de cada arquivo individual passar pela tela enquanto ele é executado.

::: warning NOTA
É importante que você _não_ saia do terminal enquanto isso está sendo executado.
Se você fizer isso, a cópia continuará a ser executada em segundo plano, mas você não poderá acompanhar seu progresso!
:::

Depois de terminar, ele reiniciará automaticamente o container do seu cliente Execution.

**Observe que seus dados da cadeia existentes não são excluídos do seu nó após a exportação ser concluída!**

### Restaurando Seus Dados da Cadeia Execution

Se você precisar restaurar os dados da cadeia com backup, simplesmente execute o seguinte comando.

```shell
rocketpool service import-eth1-data /mnt/external-drive
```

::: danger AVISO
Isso excluirá automaticamente quaisquer dados existentes do cliente Execution no seu volume `rocketpool_eth1clientdata`!
:::

Depois de terminar, seu cliente Execution estará pronto para funcionar.
