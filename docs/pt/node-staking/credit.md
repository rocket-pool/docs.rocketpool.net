::: danger AVISO
Depósitos de minipool estão atualmente desabilitados em preparação para o Saturn 1.
:::

# O Sistema de Crédito de Depósito

O sistema de crédito de depósito é um mecanismo para rastrear ETH que foi previamente vinculado por operadores de nó mas que não é mais necessário e torná-lo disponível para uso novamente.
A origem deste crédito vem de dois lugares:

- [Migrar um minipool existente com vínculo de 16 ETH para um minipool com vínculo de 8 ETH](./leb-migration.mdx) (o que adiciona 8 ETH ao saldo de crédito do operador de nó)
- [Migrar um validador solo existente](./solo-staker-migration) para um minipool (o que adiciona 16 ou 24 ETH ao saldo de crédito do operador de nó, dependendo de qual tipo de minipool eles criam durante a migração)

Todo operador de nó começa com um saldo de crédito de **0 ETH**.
Qualquer uma dessas duas ações aumentará esse saldo de acordo.

Este ETH _não_ se torna líquido e não é devolvido ao operador de nó; em vez disso, pode ser usado para **criar minipools adicionais** sem exigir qualquer ETH do operador de nó.

O sistema de crédito é **transparente** para o operador de nó; ele será usado automaticamente (com notificações na CLI do Smartnode explicando que será usado) durante operações de `rocketpool node deposit` ou `rocketpool node create-vacant-minipool` se possível.
Se _não puder_ ser usado, o Smartnode alertará o usuário de que não pode ser usado e exigirá um vínculo normal de ETH durante qualquer uma das operações.

Veja a seção [Disponibilidade de Crédito](#disponibilidade-de-crédito) abaixo para mais detalhes.

## Um Exemplo

Digamos que você tenha um saldo de crédito de 0 ETH e um único minipool com vínculo de 16 ETH.
Você pode então [migrar esse minipool para um vínculo de 8 ETH](./leb-migration.mdx).
Isso resultará em **8 ETH** que não está mais vinculado.
Esses 8 ETH serão colocados em seu **saldo de crédito**.

Agora, digamos que você queira criar um _segundo_ minipool de 8 ETH.
Você executa `rocketpool node deposit` como de costume e seleciona 8 ETH como o valor do vínculo.
Isso normalmente requer que você forneça 8 dos seus próprios ETH para o minipool.
No entanto, como você tem um saldo de crédito de 8 ETH, a Rocket Pool **usará automaticamente isso em vez disso**:

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

O segundo conjunto de linhas aqui é o relevante: elas informam que você tem ETH suficiente no seu saldo de crédito para cobrir este depósito _e que está disponível para uso_, então usará o saldo automaticamente e não exigirá nenhum ETH suplementar da sua carteira de nó.

Veja [a seção de disponibilidade abaixo](#disponibilidade-de-crédito) para detalhes sobre a disponibilidade do saldo de crédito.

## Visualizando seu Saldo de Crédito Atual

Para visualizar seu saldo de crédito atual, simplesmente execute o seguinte comando:

```shell
rocketpool node status
```

Isso produz uma lista abrangente de detalhes sobre seu nó, incluindo seu saldo de crédito logo no topo:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Disponibilidade de Crédito

Em algumas situações, seu nó pode ter um saldo de crédito disponível mas não pode usá-lo atualmente para implantar minipools adicionais.

O ETH para seu saldo de crédito é retirado do **pool de depósito**.
Assim, se você quiser usar 8 ETH em crédito para criar um novo minipool de 8 ETH, acabará retirando **todos os 32 ETH para esse minipool** do pool de depósito e não exigirá nenhum de você.
Por causa disso, se o pool de depósito não tiver ETH suficiente para cobrir o valor de pré-depósito (atualmente definido em 1 ETH), **o saldo não estará disponível**.

Nessa situação, o Smartnode alertará você durante uma operação `rocketpool node deposit` de que **não pode** usar seu saldo de crédito e deve, em vez disso, usar ETH da sua carteira de nó para completar o vínculo.
Fazer isso **não** consumirá seu saldo de crédito; ele será deixado como está e disponível para uso posterior assim que o pool de depósito tiver saldo suficiente para cobri-lo.
