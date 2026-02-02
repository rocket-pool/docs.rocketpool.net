# Minipools com 8 ETH de Garantia

Quando o Rocket Pool foi lançado, ele suportava dois tipos de minipools:

1. Uma **garantia de 16 ETH**, onde o operador de nó fornecia 16 ETH e os 16 ETH restantes viriam do pool de staking para criar um validador completo (32 ETH).
2. Uma **garantia temporária de 32 ETH**, onde o operador de nó forneceria todos os 32 ETH para poder pular o processo de inicialização e começar a validar na Beacon Chain imediatamente, e então receber um reembolso de 16 ETH assim que o pool de depósito tivesse ETH suficiente para cobri-lo. Nesse ponto, ele se transformaria em um minipool normal com garantia de 16 ETH.

O último foi removido por votação da comunidade vários meses após o início do protocolo, pois não era mais necessário e resultava em longos atrasos de reembolso.

O primeiro representava o menor valor de garantia do protocolo porque garantia que, se um operador de nó usasse o Rocket Pool para atacar o protocolo Ethereum e tivesse sua _garantia inteira_ cortada, ele perderia tanto quanto os stakers de rETH e não sairia ganhando.

Desde o lançamento do Rocket Pool, a comunidade realizou [pesquisas significativas](https://dao.rocketpool.net/t/leb8-discussion-thread/899) sobre a segurança fornecida por essa garantia e descobriu que ela era muito conservadora.
Para todos os efeitos, um corte de 16 ETH foi considerado irrealista e uma garantia de 16 ETH efetivamente fornecia os mesmos benefícios de segurança que uma garantia de apenas 8 ETH (mais o requisito suplementar de RPL).
Assim, respaldado por essa pesquisa, a atualização Atlas introduz um novo tipo de minipool à lista: a **garantia de 8 ETH**, coloquialmente chamada pela comunidade Rocket Pool de "LEB8" (Lower ETH Bond - 8 ETH).

Para criar um minipool de 8 ETH, o operador de nó precisa fornecer apenas **8 ETH próprios** (mais RPL suficiente para cobrir o requisito de colateral - mais sobre isso em [Colateral RPL](#colateral-rpl)).
Ele então puxará **24 ETH** do pool de depósito para completar o validador e começar a trabalhar na Beacon Chain.

Isso **abre as portas para novos operadores de nó em potencial** que querem executar um nó, mas não têm exatamente 16 ETH.
Além disso, permite que operadores de nó maiores **coloquem mais ETH de stakers do pool para trabalhar** na Beacon Chain ganhando recompensas.
Como isso funciona sem comprometer significativamente a segurança, todos ganham!

Neste guia, abordaremos três tópicos:

- Como os minipools com garantia de 8 ETH realmente funcionam e os números de recompensa por trás deles
- Como criar um novo minipool de 8 ETH
- Como migrar um minipool de 16 ETH _existente_ para um minipool de 8 ETH sem sair

Continue lendo para saber mais sobre cada tópico.

## Como Funcionam os Minipools com Garantia de 8 ETH

Mecanicamente, os minipools com garantia de 8 ETH se comportam **identicamente** a todos os outros minipools no protocolo.
Eles ainda "possuem" um validador na Beacon Chain (representam as credenciais de saque desse validador), ainda vêm com uma comissão (embora a comissão com Atlas **será fixada em 14%** para todos os novos minipools), e fornecem toda a mesma funcionalidade que um minipool com garantia de 16 ETH oferece.
A diferença está inteiramente nos números.

### Recompensas

De uma perspectiva de lucratividade (olhando _puramente_ para recompensas em ETH e ignorando RPL), minipools com garantia de 8 ETH com uma comissão de 14% fornecem _mais recompensas_ ao operador de nó do que até mesmo _minipools com garantia de 16 ETH a 20% de comissão_ (que, a partir de Redstone, é a configuração de recompensa mais alta possível).
Ao mesmo tempo, eles também fornecem mais recompensas aos _detentores de rETH_, devido ao fato de que os operadores de nó estão colocando o capital dos detentores de rETH para trabalhar de forma mais eficiente.

Vamos percorrer um exemplo simples para ilustrar.
Digamos que somos um operador de nó com 16 ETH disponíveis para stake (mais o vínculo de RPL necessário).
Digamos que ganhamos 1 ETH de recompensas na Beacon Chain por validador.
Aqui está como a matemática funciona para um único minipool de 16 ETH com comissão de 20%, versus dois minipools de 8 ETH com comissão de 14%:

```
1x Minipool de 16 ETH @ 20%:
Recompensas: 1 ETH
Parte do Nó = (16/32) + (16/32 * 0.2)
           = 0.5 + (0.5 * 0.2)
           = 0.5 + 0.1
           = 0.6 ETH

Parte do rETH = 1 - 0.6
           = 0.4 ETH


2x Minipools de 8 ETH @ 14%:
Recompensas: 2 ETH
Parte do Nó = ((8/32) + (24/32 * 0.14)) * 2
           = (0.25 + (0.75 * 0.14)) * 2
           = (0.25 + 0.105) * 2
           = 0.71 ETH

Parte do rETH = 2 - 0.71
           = 1.29 ETH
```

Em outras palavras, um operador de nó ganhará **18% mais ETH** por meio de dois minipools de 8 ETH do que ganharia com um único minipool de 16 ETH com comissão de 20%.

### Colateral RPL

Para criar um minipool de 8 ETH, os operadores de nó ainda precisam fazer stake de RPL suficiente para cobrir os requisitos mínimos de colateral para seu nó (contabilizando todos os seus minipools de todos os tamanhos de garantia).

Essas regras foram esclarecidas com Atlas:

- O **RPL mínimo** por minipool é **10% do valor _emprestado_**
- O **RPL máximo** por minipool é **150% do valor _vinculado_**

Para um minipool de 16 ETH, isso permanece inalterado; o mínimo é 1.6 ETH em valor de RPL, e o máximo é 24 ETH em valor de RPL.

Para um minipool de 8 ETH, isso se torna um **mínimo de 2.4 ETH em valor de RPL** (10% do valor emprestado, que é 24 ETH) e um **máximo de 12 ETH em valor de RPL** (150% do valor vinculado).

Esses números foram selecionados pela comunidade Rocket Pool [como parte de uma votação de governança](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671).

## Criando um Novo Minipool de 8 ETH

O processo para criar um novo minipool com uma garantia de 8 ETH é idêntico ao processo para criar um minipool de 16 ETH.

Simplesmente execute o seguinte comando:

```shell
rocketpool node deposit
```

Quando solicitado o valor da garantia, selecione `8 ETH`:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip NOTA
Este exemplo também mostra o uso do [**novo Sistema de Crédito de Depósito**](../../node-staking/credit).
Como o operador de nó tem 8 ETH em crédito, criar este minipool de 8 ETH é gratuito!
:::

É só isso!
O resto do processo é o mesmo das [instruções usuais de criação de minipool](../../node-staking/create-validator.mdx).
