# Mudando de Um Nó para Outro

Às vezes, sua máquina de nó não é mais capaz de fazer seu trabalho e você precisa mudar para outra.
Isso pode acontecer se você está atualizando seu nó, por exemplo, ou se você está mudando de um nó baseado em nuvem para um hospedado localmente em hardware dedicado, ou mesmo se seu nó sofrer uma falha catastrófica de hardware e você precisar executar seus validators em uma máquina de backup.
Independentemente do caso, este guia ajudará você a entender como migrar com segurança sua carteira e validator keys de um nó para outro sem ser slashed.

## Slashing e a Slashing Database

A principal razão pela qual encorajamos você a exercer tanta cautela ao mover sua carteira de uma máquina para outra, ou recuperar sua carteira em outra máquina, é por causa do risco de **slashing**.
Slashing ocorre quando uma ou mais de suas validator keys faz algo que viola as regras da Beacon Chain e parece que você está tentando atacar a rede.
Em resposta, a chain forçará a saída do seu validator e aplicará uma penalidade severa - o tamanho da penalidade depende de quantos validators também são slashed dentro de um período de duas semanas do seu próprio, mas atualmente o mínimo é **1 ETH** e não há máximo.

Embora existam várias condições que podem ser interpretadas como "atacar a rede", realisticamente a única que acontece acidentalmente é a **double attestation** (ou **double proposal**).
Isso ocorre quando seu validator envia duas attestations (ou duas block proposals) para o mesmo slot que têm votos diferentes (por exemplo, ele vota em dois candidate blocks diferentes para um slot específico em vez de escolher um).

Para combater isso, seu Validator Client hospeda o que é chamado de **Slashing Database**.
A Slashing Database é simplesmente um registro dos votos do seu validator (ou seja, o slot de cada voto e o hash do block para o qual esse voto foi dado), para que ele saiba não votar em algo em que já votou.

### Evitando Ser Slashed

Todo Validator Client mantém uma Slashing Database para garantir que seu nó nunca faça double attest ou double propose.
O problema, então, vem de situações onde você começa a validar **sem** uma slashing database e, portanto, não tem registro do que seus validators votaram anteriormente.
Isso pode acontecer em várias situações:

1. Você acabou de mudar Consensus Clients, e o novo cliente não carrega a Slashing Database do antigo (o que o Smartnode não faz durante uma mudança de cliente).
2. Você tem sua carteira carregada em uma máquina e está ativamente atestando com ela, e então carrega sua carteira em uma segunda máquina _enquanto a primeira máquina ainda está ativamente atestando_.
3. Você para de validar em uma máquina e carrega sua carteira em uma segunda máquina, mas você não esperou tempo suficiente para a epoch atual ser finalizada então sua segunda máquina atesta para slots que seus validators já atestaram.

A maneira padrão de evitar ser slashed é **esperar pelo menos 15 minutos após sua última attestation bem-sucedida** antes de iniciar seu Validator Client e atestar novamente, e **garantir que suas validator keys estejam presentes em apenas uma única máquina**.

Mais especificamente, o plano é esperar até que seu validator tenha intencionalmente perdido uma attestation, **e que essa falta tenha sido finalizada**.
Uma vez que a finality é atingida, seu validator não pode mais votar para a epoch finalizada e é seguro começar a atestar com ele novamente.

A espera de 15 minutos vem de uma regra prática de que quando operando normalmente (por exemplo, com consenso normal), a Beacon Chain leva cerca de 7 minutos para finalizar uma epoch.
Esperar 15 minutos garante que você perdeu pelo menos uma epoch e esperou tempo suficiente para essa epoch ser finalizada, com um pequeno buffer apenas para segurança.

## Checklist de Migração de Nó

Com o contexto acima em mente, aqui está um checklist útil que você pode seguir ao migrar seu nó para garantir que não será slashed.
Isso é projetado para máxima segurança, então embora você possa pensar que algumas das etapas são desnecessárias, nós **fortemente** encorajamos você a seguir todas elas até a conclusão.

1. **Prepare o novo nó** seguindo estes guias, começando da seção "Preparing a Node" e terminando uma vez que você tenha o Smartnode instalado e esteja sincronizando um Execution e Consensus client.
   - :warning: **NÃO** inicialize uma nova carteira ou recupere sua carteira antiga no nó. Permita que ele sincronize os clientes _sem uma carteira presente_.

2. **ESPERE** até que seus clientes estejam totalmente sincronizados no novo nó.
3. Confirme que você registrou seu mnemonic corretamente executando `rocketpool wallet test-recovery` em sua nova máquina. Isso _simulará_ a recuperação de keys para confirmar que sua node wallet e todas as validator keys dos seus minipools podem ser recuperadas corretamente, mas não _realmente_ as recuperará e salvará no disco então não há risco de slashing.
   1. Se o Smartnode falhar em recuperar sua node wallet usando o mnemonic que você forneceu, então seu mnemonic pode ser inválido. **PARE** de passar por este processo; remover as keys do seu nó antigo significa que elas poderiam ser **perdidas para sempre**.
   2. Nesta situação recomendamos sair de seus validators e retirar seu capital o mais rápido possível, para que você possa começar de novo com um novo nó para o qual você tem o mnemonic funcionando.
4. **Pare de validar** em seu nó antigo (por exemplo, usando `rocketpool service stop` para desligar o validator client).
5. **Delete suas keys** do seu nó antigo (por exemplo, usando `rocketpool wallet purge`).
   1. **VERIFIQUE** se as keys foram removidas olhando a pasta `data` do seu nó (padrão é `~/.rocketpool/data/validators/`) - cada Consensus Client terá sua própria pasta sob essa pasta de dados com sua própria cópia das keys.
   2. Por favor veja a seção [Verifying Key Removal](#verificando-remocao-de-chaves) abaixo para instruções sobre como fazer isso.
   3. Garanta que **todas elas** foram deletadas.

6. **Desligue** seu nó antigo e desconecte-o da Internet, removendo o cabo Ethernet ou módulo Wi-Fi.

7. **Limpe o SSD** do seu nó antigo, usando um dos seguintes métodos:
   1. Use um drive USB inicializável com uma instalação Linux (como o popular [GParted](https://gparted.org/download.php)) e use-o para apagar o drive.
   2. **Remova-o fisicamente** do seu nó antigo, conecte-o a outra máquina usando um conversor USB, e use uma ferramenta como [GParted](https://installati.one/debian/11/gparted/) para apagar o drive.
   3. **Remova-o fisicamente** do seu nó antigo e bata nele com um martelo para quebrá-lo e garantir que nunca será usado novamente.

8. **ESPERE** por pelo menos 15 minutos antes de prosseguir. Use um block explorer como [https://beaconcha.in](https://beaconcha.in) para olhar o registro de attestation do seu validator. Espere até que pelo menos uma attestation tenha sido registrada como ausente _e a epoch correspondente tenha sido finalizada_.
   1. NOTA: se você tiver vários minipools, você deve garantir que _todos eles_ perderam pelo menos uma attestation que foi finalizada.

9. **Recupere sua node wallet** na nova máquina seguindo as instruções em [Importing / Recovering an Existing Wallet](../recovering-rp.mdx).

10. **Reinicie seu Validator Client** para garantir que suas validator keys sejam carregadas (por exemplo, com `docker restart rocketpool_validator`).

Suas validator keys agora estarão carregadas em seu novo nó, e você pode começar a atestar com segurança com ele.

## Verificando Remoção de Chaves

Validator keys são armazenadas em seu disco na forma de arquivos `json`.
Elas são mantidas dentro da pasta `data` do seu nó.
Por padrão, você pode encontrá-las aqui:

```shell
~/.rocketpool/data/validators/
```

::: warning NOTA
Se você mudou seu diretório `data` usando a TUI `service config` (por exemplo, você está usando uma key Aegis e definiu isso como sua pasta `data`, o caminho acima deve ser alterado para `<sua pasta de dados>/validators`.)
:::

Cada cliente terá sua própria cópia das keys, já que cada cliente as espera em um formato ou configuração diferente.

Para **encontrar** as keys no disco, execute o seguinte comando:

```shell
sudo find ~/.rocketpool/data/validators -type f -name "*.json"
```

Por exemplo, em uma máquina com dois minipools, a saída se pareceria com isto:

```shell
/home/joe/.rocketpool/data/validators/teku/keys/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b.json
/home/joe/.rocketpool/data/validators/teku/keys/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lighthouse/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/keystore.json
/home/joe/.rocketpool/data/validators/nimbus/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json
/home/joe/.rocketpool/data/validators/prysm-non-hd/direct/keymanageropts.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x831862d79685079037dbba67acfa1faf13a5863b94c1c39126e9a52155d32b7733ba65a56ba172e0fcb2b7d77e8a125b/voting-keystore.json
/home/joe/.rocketpool/data/validators/lodestar/validators/0x900189d6bf7b0635ce1d81046c0d882d52ccf05e3f4fb29e7b9db4c9fb72c6587256fd41a785f103e15a253f3d24a610/voting-keystore.json
```

Isso mostra um exemplo onde as keys **não** foram deletadas ainda e ainda estão no filesystem.

Se suas keys **foram** deletadas, você não deve ver _nenhuma_ das hex strings (as strings grandes começando com `0x`) em nenhuma das pastas para nenhum dos clientes dentro da saída desse comando.
