::: danger AVISO
Depósitos de minipool estão atualmente desabilitados em preparação para Saturn 1.
:::

# O Delegate do Minipool

Cada validador que você executa possui um contrato de **minipool** como seu "proprietário", por assim dizer.
O minipool é um contrato único especificamente atribuído àquele validador; ele atua como seu **endereço de retirada**.
Todas as recompensas e retiradas de saldo de staking da Beacon Chain serão enviadas para o contrato do minipool.

Cada minipool é único para garantir que você (o operador de nó) tenha controle absoluto sobre ele.
Ninguém mais o controla, ninguém mais pode alterá-lo; ele está completamente sob seu comando.

Dito isso, para minimizar os custos de gas durante os depósitos de nós, o minipool _em si_ contém muito pouca funcionalidade real.
Quase tudo o que ele pode fazer é delegado a um contrato **delegate**.

O contrato delegate do minipool é um contrato especial que contém a maior parte da lógica necessária pelos minipools - coisas como distribuir justamente o saldo entre você e os stakers da pool, por exemplo.
Ao contrário dos minipools, onde cada minipool é um contrato único, o delegate é um contrato único para o qual muitos minipools podem "encaminhar" solicitações.

Ocasionalmente, a equipe de desenvolvimento da Rocket Pool publicará um novo delegate de minipool que adiciona novas funcionalidades.
Por exemplo, na atualização Atlas, introduzimos um novo delegate que tinha suporte para distribuir recompensas skimmed sem precisar fechar o minipool.

Minipools podem ter seus delegates atualizados para aproveitar essas novas funcionalidades.
As atualizações de delegate são **opcionais**, então você pode decidir se e quando deseja usá-las.
Dito isso, elas geralmente são necessárias para aproveitar as novas funcionalidades que as atualizações de rede introduzem.

### Atualizando seu Delegate

Para atualizar um minipool para um novo contrato delegate, simplesmente execute o seguinte comando:

```shell
rocketpool minipool delegate-upgrade
```

Isso apresentará uma lista de seus minipools que não estão usando o delegate mais recente e são elegíveis para atualização:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Selecione aquele(s) que você gostaria de atualizar da lista inserindo o número correspondente à esquerda do endereço do minipool.
Uma vez selecionado, você será solicitado a confirmar suas configurações de preço de gas e, depois disso, uma transação para atualizar o minipool será enviada:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

Você pode verificar se ele está usando o delegate mais recente com `rocketpool minipool status`.
Quaisquer minipools que _não_ estejam usando o delegate mais recente terão uma notificação amarela sob seu status informando que podem ser atualizados:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
