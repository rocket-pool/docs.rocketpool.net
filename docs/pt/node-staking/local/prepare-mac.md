# Preparando um Mac

Antes de instalar o Rocket Pool, há algumas verificações que você deve fazer para garantir que seu sistema seja compatível e funcione corretamente.

::: danger
Recomendamos fortemente que você crie uma máquina dedicada para executar um nó Rocket Pool.
Executar um nó em uma máquina de uso geral, como seu desktop de trabalho diário, apresenta riscos de segurança extras que podem comprometer sua carteira e resultar no roubo de suas moedas.

**Para máxima segurança, por favor construa uma nova máquina dedicada exclusivamente à execução de um nó.**
:::

## Requisitos do Sistema

Abaixo está uma breve descrição dos requisitos de software e hardware que um nó Rocket Pool requer.
Este guia assume que você já tem sua máquina fisicamente construída e o sistema operacional instalado.

### Sistemas Operacionais Suportados

O Rocket Pool recomenda que você use a versão mais recente do macOS para seu hardware.

### Suporte ao macOS

Você precisará instalar os seguintes pré-requisitos:

Recomendamos fortemente usar o [Homebrew](https://brew.sh) como seu gerenciador de pacotes para Mac. Ele permite que você instale pacotes facilmente usando o comando `brew`.

Você pode instalá-lo via

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Ele deve instalar alguns pré-requisitos para você, como XCode Command Line Tools. Se não instalar, você pode instalá-los manualmente usando

```shell
xcode-select --install
```

Uma vez instalado, certifique-se de que tudo está funcionando corretamente usando

```shell
brew doctor
```

Uma vez que tudo esteja instalado e funcionando, o Homebrew permitirá que você instale pacotes usando o comando `brew`.

Por exemplo, para instalar `wget` usando o Homebrew, execute o seguinte comando no Terminal:

```shell
brew install wget
```

Agora que temos o Homebrew instalado, podemos instalar nosso cliente Docker, [Orbstack](https://orbstack.dev).

```shell
brew install --cask orbstack
```

O Orbstack será instalado na sua pasta Applications. Inicie-o de lá e ele será inicializado. Se você está migrando do Docker Desktop, ele deve detectar sua instalação Docker existente e migrar suas imagens e contêineres.

Você pode precisar ajustar as configurações do Orbstack dependendo do seu hardware.

Se você instalou anteriormente o Docker Desktop, precisará desinstalá-lo primeiro. O Docker Desktop costumava ser o cliente Docker recomendado, mas no último ano alguns novos clientes foram lançados que fornecem muito melhor estabilidade.

Por favor, certifique-se de que seu Firewall (Configurações do Sistema -> Rede -> Firewall) está ativado e o Orbstack está adicionado à lista de aplicativos que permitem conexões de entrada. (O Orbstack deve fazer isso para você)

![](../local/images/mac/firewall.png)

### Instalando e Usando SSH

SSH já deve estar instalado com o macOS.

### Verificações do Sistema Pré-Instalação

Antes de instalar o Rocket Pool, revise a seguinte lista de verificação:

- Seu sistema está totalmente construído, liga, e pode inicializar no sistema operacional.
- Você não fará nenhuma outra atividade no sistema, como navegar na Internet, verificar e-mails ou jogar.
- Você tem um sistema operacional macOS instalado.
- Sua conta de usuário tem privilégios de root / administrador.
- Você tem um SSD que atende aos requisitos de desempenho.
- Seu SSD está montado no seu sistema de arquivos.
- Você tem pelo menos 1,5 TB de espaço livre para o processo inicial de sincronização do Execution e Consensus.
- Se seu ISP limita seus dados, é mais de 2 TB por mês.

Se você verificou e confirmou todos esses itens, então está pronto para instalar o Rocket Pool e começar a executar um nó!
Prossiga para a seção [Escolhendo seus Clientes ETH](../eth-clients).
