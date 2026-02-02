# Configuração de votação para usuários que não usam o smartnode

Alguns usuários (por exemplo, usuários do Allnodes) não usam o smartnode e podem precisar configurar a votação usando interação direta com contratos.
Este guia contém um guia de configuração mínimo e completo para esses usuários.

::: tip
Seu endereço de nó deve ser carregado em uma carteira de hardware para isso.
:::

## Guia de configuração mínima

Isso permite que seu delegado vote por você on-chain e off-chain. Você poderá substituir seu delegado on-chain, mas não off-chain.

- Use o etherscan para inicializar o poder de voto ("Connect to Web3" com o endereço do nó) com um delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Você pode encontrar delegados em https://delegates.rocketpool.net/

## Guia de configuração completa

Use o etherscan para inicializar o poder de voto ("Connect to Web3" com o endereço do nó)

- [recomendado para a maioria] Inicializar votação com um nó diferente como delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Você pode encontrar delegados em https://delegates.rocketpool.net/
  - Lembre-se de que você sempre poderá substituir seus delegados
- Inicializar votação com seu próprio nó como delegado https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Aqui você será responsável por votar todas as vezes
  - Eu sugeriria principalmente essa opção para pessoas que desejam ser delegadas, pois elas _precisam_ votar todas as vezes.
- Se o seu nó foi registrado após Houston:
  - Você já terá seu poder de voto inicializado com seu próprio nó como delegado
  - Você pode definir um novo delegado com https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Definir endereço de sinalização do snapshot:

- Vá para https://node.rocketpool.net/signalling-address e conecte seu endereço de nó
  - Insira o endereço de sinalização de snapshot desejado e assine a mensagem para obter os argumentos r, s e v que você precisará
  - Nota: seu endereço de sinalização de snapshot NÃO DEVE ser seu endereço de nó
- Em uma nova aba, vá para https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
  - "Connect to Web3" com o endereço do nó
  - Preencha os argumentos com seu endereço de sinalização e os parâmetros r, s, v fornecidos na etapa anterior
