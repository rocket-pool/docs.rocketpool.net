# FAQ (WIP)

### Quais são os benefícios de executar minipools com Rocket Pool comparado a um validador solo de 32 ETH?

Ao executar um único validador solo, você receberia 100% das recompensas nos seus 32 ETH.
Ao executar dois minipools de 16 ETH, você receberia 100% das recompensas nos seus 32 ETH **mais** 14% das recompensas em 32 ETH fornecidos pelo protocolo Rocket Pool.
Ao executar quatro minipools de 8 ETH, você receberia 100% das recompensas nos seus 32 ETH **mais** 14% das recompensas em 96 ETH fornecidos pelo protocolo Rocket Pool.
Você também teria a opção de usar o recurso [Smoothing Pool](./prepare-node.mdx#smoothing-pool) do Rocket Pool.

### Como eu sei quanto meu rETH vale? Ele faz rebase?

O token rETH não fará rebase.
O número de tokens na sua carteira permanecerá constante, mas eles se valorizam ao longo do tempo.

### Tenho um problema técnico executando meu node, como obtenho ajuda?

Você pode começar verificando a página [Rocket Pool Support](https://rocketpool.support).
Se isso não ajudar, você pode fazer sua pergunta no canal **#support** do Rocket Pool no [servidor Discord](https://discord.gg/rocketpool).

### Como posso obter ETH de teste para experimentar criar e executar um minipool? Não consigo postar mensagens no canal de faucet.

Veja [Obtendo ETH de teste no Hoodi](../testnet/overview#getting-test-eth-on-hoodi).

### Como recupero meu node se minha máquina quebrar?

Resposta curta: seu mnemônico é tudo que você precisa para recuperar totalmente seu node.
Sempre certifique-se de mantê-lo seguro.

Para recuperar seu node em uma nova máquina, comece certificando-se de que **sua máquina anterior não ficará online novamente** com as chaves disponíveis, pois dois nodes executando com as mesmas chaves **farão você ser slashed**.
Siga os [passos](./install-modes) para instalar o Smartnode em uma nova máquina.
Depois, recupere sua carteira de node e chaves de validador executando o comando `rocketpool wallet recover` e insira seu mnemônico de 24 palavras.

### Por que meus clientes não estão sincronizando? Tenho um número baixo de peers.

Os clientes precisam ter um número saudável de peers para serem capazes de sincronizar adequadamente.
Você pode começar executando o teste [aqui](https://www.yougetsignal.com/tools/open-ports/), verificando se as portas 30303 e 9001 estão abertas.
Se estiverem fechadas, você precisará configurar o encaminhamento de porta no seu roteador.
Além disso, certifique-se de que seu node tem um endereço IP local estático para que o encaminhamento de porta não quebre devido ao seu node receber um novo endereço.

### Meu cliente de consenso está demorando muito para sincronizar. O que devo fazer?

Os clientes de consenso podem levar muito tempo para sincronizar se você não iniciou o processo de sincronização usando [Checkpoint Sync](./config-docker#beacon-chain-checkpoint-syncing).
Mesmo se você estiver executando por muito tempo, geralmente é mais rápido configurar a URL de checkpoint sync, limpar os dados de sincronização atuais com `rocketpool service resync-eth2` e começar de novo.
Seu cliente deve estar sincronizado em menos de um minuto.

### Já reiniciei. Por que o Grafana diz que ainda preciso reiniciar?

As informações de reinicialização são armazenadas em cache e só atualizam a cada poucas horas.
Executar `sudo apt update` forçará uma atualização.

### Mudei minha Execution Layer e/ou minha Beacon Chain ou Consensus Layer. Como limpo os dados antigos?

Se você mudar de clientes, o Rocketpool não exclui os volumes antigos. Esses dados podem estar desperdiçando espaço significativo em disco e você pode querer removê-los. Para fazer isso, você precisa encontrar os volumes. Se você está usando as configurações padrão do Rocketpool, os volumes docker são armazenados em `/var/lib/docker/volumes/`. A execution layer está em `rocketpool_eth1clientdata/_data/*` e a consensus layer está em `rocketpool_eth2clientdata/_data/*`.

Para acessar esses diretórios, você pode precisar fazer sudo como root usando `sudo -i`. Depois você pode deletar um diretório chamando `rm -rf <diretório>`. Por exemplo, se você quisesse deletar todos os dados do geth, você chamaria `rm -rf /var/lib/docker/volumes/rocketpool_eth1clientdata/_data/geth/`.

Para sair como root, digite `exit`.
