# Distribuindo Recompensas Skimmed

As recompensas ETH que você recebe por executar um validador para Ethereum são enviadas rotineiramente para seus minipools em um processo chamado de "skimming".
A frequência dos skims depende do número de validadores ativos na Beacon Chain. No momento da redação, o número de validadores está em torno de
500.000, o que resulta em um skim ocorrendo aproximadamente a cada 2-3 dias.

As recompensas skimmed acumularão em cada um de seus minipools até você "distribuí-las". Este processo distribui as recompensas skimmed entre você, como operador de nó, e os detentores de rETH
com base na sua taxa de comissão e proporção de ETH fornecido e provido.

::: warning NOTA
Para acessar o saldo do seu minipool, você precisará atualizar para o [delegate Atlas](./minipools/delegates) primeiro.
O antigo delegate Redstone não pode ser usado para distribuir o saldo do minipool.
:::

## Distribuição Automática

Por padrão, o Smartnode está configurado para distribuir automaticamente qualquer um dos seus minipools quando seus saldos individuais atingirem **1 ETH**. Este
limite pode ser configurado na TUI seguindo os passos abaixo.

Execute:

```shell
rocketpool service config
```

Navegue até a configuração `Smartnode and TX Fee Settings > Auto Distribute Threshold` mostrada abaixo.

![](./images/tui-automatic-skimming.png)

Alterar esta configuração ajustará o limite no qual o Smartnode distribuirá automaticamente seus minipools.
Definir o parâmetro como 0 desabilitará as distribuições automáticas.

::: warning AVISO
Se você decidir desabilitar a distribuição automática, é importante que você ainda realize uma distribuição manual regularmente.
Leia a [seção de distribuição manual](#distribuicao-manual) que segue sobre como fazer isso.

Após um longo período de tempo, suas recompensas skimmed podem exceder 8 ETH. Se esta situação ocorrer, você não poderá mais
distribuí-las e precisará sair do seu validador para acessar suas recompensas acumuladas.

Rocket Pool apresenta um design à prova de falhas que permite que qualquer pessoa, após um longo período de espera, distribua seu minipool quando
seu saldo exceder 8 ETH. Para proteger seu capital, o Smartnode monitora esta situação e sairá automaticamente do
seu minipool se isso ocorrer.
:::

## Distribuição Manual

Se você desabilitou a distribuição automática de recompensas skimmed, precisará distribuí-las rotineiramente você mesmo
com o seguinte processo.

Você também pode distribuir manualmente suas recompensas usando este processo a qualquer momento sem esperar pelo processo automático acima.

Se seu minipool tiver menos de 8 ETH, você pode distribuir suas recompensas usando o seguinte comando:

```shell
rocketpool minipool distribute-balance
```

Isso mostrará os minipools que você tem que são elegíveis para distribuição, quanto ETH eles têm e quanto ETH você (o operador de nó) receberá:

```
WARNING: The following minipools are using an old delegate and cannot have their rewards safely distributed:
	0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
	0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0
	0x7E5705c149D11efc951fFc20349D7A96bc6b819C
	0x7E570625cE8F586c90ACa7fe8792EeAA79751778

Please upgrade the delegate for these minipools using `rocketpool minipool delegate-upgrade` in order to distribute their ETH balances.

Please select a minipool to distribute the balance of:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (0.112307 ETH available, 0.031200 ETH goes to you plus a refund of 0.024419 ETH)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (0.070754 ETH available, 0.000481 ETH goes to you plus a refund of 0.069399 ETH)
4: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (0.122064 ETH available, 0.070187 ETH goes to you plus a refund of 0.000000 ETH)
5: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (0.102739 ETH available, 0.000000 ETH goes to you plus a refund of 0.000000 ETH)
6: 0xffCAB546539b55756b1F85678f229dd707328A2F (0.070989 ETH available, 0.025201 ETH goes to you plus a refund of 0.000000 ETH)
```

Quaisquer minipools usando o delegate de lançamento original serão mencionados no início, informando que você não pode chamar `distribute-balance` neles até atualizar seus delegates.
Este delegate foi escrito antes das retiradas skimmed serem especificadas e, como tal, não apresenta uma maneira de distribuir recompensas skimmed.

Note que para minipools elegíveis, você também vê o **valor de reembolso**.
Este é um valor devido diretamente a você (por exemplo, porque você tinha um saldo em seu minipool antes de [migrar de um bond de 16 ETH para um bond de 8 ETH](./leb-migration.mdx) ou você [converteu um validador solo em um minipool](./solo-staker-migration) com recompensas existentes).
Ele não será compartilhado com os detentores de rETH.

Digite o número do minipool que você deseja distribuir.
Você será solicitado com o gráfico de preço de gas como de costume e será solicitado a confirmar sua decisão.
Uma vez que você confirme, o saldo do seu minipool será distribuído:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

Como você pode ver [pela transação](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9), isso forneceu ao endereço de retirada do nó a parte das recompensas do nó (mais o valor de reembolso) e devolveu o resto para o staking pool.
