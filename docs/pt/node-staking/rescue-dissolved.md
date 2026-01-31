# Resgatando um Minipool Dissolvido

No improvável evento de seu minipool não fazer staking dentro da janela de dissolução, ele será "dissolvido" pelo oDAO e os fundos dos usuários fornecidos serão devolvidos ao deposit pool para uso por outro minipool. Neste cenário, você precisará executar o processo abaixo para recuperar seu ETH e desbloquear seu RPL para ser retirado.

## Atualize seu Minipool Delegate

É altamente recomendável que você use o minipool delegate mais recente ao executar este processo. Delegates mais antigos contêm uma operação `selfdestruct` quando são fechados, o que significa que, se o processo não for concluído corretamente na ordem especificada, os fundos podem ficar bloqueados para sempre. Você pode verificar se seu minipool está no delegate mais recente tentando [Atualizar seu Delegate](./minipools/delegates#upgrading-your-delegate). Se seu minipool não aparecer na lista de minipools que podem ser atualizados, você pode continuar abaixo.

## Recupere seu Saldo de Depósito Não Utilizado

::: tip NOTA
Se seu minipool foi dissolvido antes do Atlas, você pode pular esta etapa e ir direto para [Aumentar seu Saldo na Beaconchain para 32 ETH](#increase-your-beaconchain-balance-to-32-eth). Você não precisa recuperar seu saldo de depósito não utilizado porque o valor total do bond foi depositado na beaconchain antes do Atlas.
:::

1 ETH do seu depósito de bond inicial é usado como depósito inicial na beaconchain para garantir as credenciais de retirada do seu validator. O valor restante é depositado em seu minipool quando ele recebe ETH do deposit pool.

Quando seu minipool é dissolvido, o ETH do usuário é devolvido ao deposit pool e seu ETH permanece no minipool pronto para ser devolvido a você. Use o recurso [Distribuição Manual](./skimming#manual-distribution) de recompensas para recuperar este ETH que pode então ser usado na próxima etapa para ativar seu validator.

## Aumentar seu Saldo na Beaconchain para 32 ETH

Você deve completar o saldo do seu validator até o mínimo necessário para ativação na beaconchain. Este valor é **32 ETH**. Se você tem um minipool com bond de 16 ETH, precisará de 16 ETH adicionais e se você tem um minipool com bond de 8 ETH, precisará de 24 ETH adicionais durante esta etapa.

Deposite o valor necessário de ETH no endereço do seu node e então execute o seguinte comando para iniciar o processo:

```shell
rocketpool minipool rescue-dissolved
```

Você será apresentado com uma lista de minipools que atendem aos critérios para um depósito manual:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Após selecionar o minipool que você deseja resgatar, será perguntado qual valor você quer depositar manualmente:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

A opção 1 será usada na maioria das circunstâncias. É o valor necessário para elevar seu saldo na beaconchain até o valor necessário de 32 ETH. As outras opções são fornecidas para casos de uso avançados.

::: tip NOTA
Elevar seu saldo na beaconchain para 32 ETH significa que seu validator poderá participar ativamente das tarefas de validação do Ethereum. O smartnode pode não ter tido a chance de reiniciar seu validator desde a dissolução. Portanto, é uma boa ideia reiniciar manualmente seu validator para garantir que ele carregou suas chaves de validator e pode executar tarefas de validação para evitar penalidades durante o processo de resgate.

Se você estiver executando o modo Docker padrão, isso pode ser feito com `docker restart rocketpool_validator`.
:::

Uma vez que esta etapa esteja completa, seu validator entrará na fila de entrada e você precisará esperar pelos seguintes eventos:

1. 2048 blocos da execution layer precisam passar para seu depósito ser aceito (~8 horas)
2. Até 32 epochs precisam passar para os validators votarem você (~0.5 - 3.5 horas)
3. Um tempo variável na fila de validators (6.4 minutos por 4 validators na fila)
4. 256 epochs mínimos validando antes de uma saída ser permitida (27 horas)

### Saindo do seu Validator

Uma vez que seu validator tenha estado ativo por um mínimo de 256 epochs, você pode sair do seu minipool através do mesmo processo que qualquer outro minipool seguindo o guia [Saindo do seu Validator](./withdraw#exiting-your-validator).

O saldo completo de 32 ETH será devolvido ao seu minipool e minipools dissolvidos distribuem 100% de seu saldo para o endereço de retirada do node operator.
