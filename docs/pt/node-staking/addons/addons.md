# Como Escrever Add-ons para Rocket Pool Smart Node

## Introdução

Add-ons do Rocket Pool Smart Node são extensões que fornecem recursos adicionais ao Smart Node stack. Eles podem ser implementados como containers Docker que se integram com os clientes Ethereum ou com o serviço Smart Node. Add-ons podem ser habilitados e configurados através da interface de usuário em terminal (TUI) do Smart Node via comando `rocketpool service config`.

O desenvolvimento de add-ons pode ser baseado em dois exemplos existentes:

- **Graffiti Wall Writer**: Permite que Node Operators contribuam para desenhos comunitários no muro de graffiti Beaconcha.in, definindo dinamicamente o graffiti de propostas de blocos. Ele usa uma ferramenta de desenho descentralizada para determinar quais pixels "pintar" com cada proposta.
- **Rescue Node**: Fornece um serviço de beacon node de fallback usando credenciais do projeto Rocket Rescue Node. Isso ajuda a prevenir atestações perdidas durante manutenção de nó, sincronização ou interrupções ao rotear solicitações para um beacon node remoto compartilhado.

Add-ons fazem parte do código-fonte do Smart Node e devem ser contribuídos via pull request para o repositório. Eles implementam uma interface padronizada para configuração e integração.

## Pré-requisitos

- Familiaridade com programação Go, pois add-ons são escritos em Go.
- Compreensão de Docker, pois add-ons podem executar como containers.
- Conhecimento da arquitetura Rocket Pool Smart Node, incluindo sua configuração Docker compose e sistema de configuração.
- Acesso ao repositório Smart Node para desenvolvimento e testes locais.

## Passos para Criar um Add-on

Para criar um novo add-on, você precisará adicionar código em locais específicos dentro do repositório Smart Node. O processo envolve implementar a lógica do add-on, configurar sua UI, registrá-lo e lidar com a integração com o Docker stack.

### 1. Implementar a Lógica do Add-on

Crie um novo subdiretório em `addons/` nomeado conforme seu add-on (use snake_case, por exemplo, `my_addon`).

Neste diretório, crie um arquivo Go (por exemplo, `my_addon.go`) que define a struct do add-on e implementa a interface `SmartnodeAddon` de `github.com/rocket-pool/smartnode/shared/types/addons`.

```
type MyAddon struct {
    cfg *MyAddonConfig `yaml:"config,omitempty"`
}

func NewMyAddon() addons.SmartnodeAddon {
    return &MyAddon{
        cfg: NewConfig(),
    }
}
```

Métodos principais a implementar:

- `GetName()`: Retorna o nome de exibição do add-on.
- `GetDescription()`: Retorna uma breve descrição.
- `GetConfig()`: Retorna o objeto de configuração com parâmetros (por exemplo, flag habilitado, chaves de API, URLs).
- `GetEnabledParameter()`: Retorna o parâmetro que controla se o add-on está habilitado.
- Métodos para iniciar/parar o add-on, gerar seções Docker compose, ou interagir com outros serviços.

Se o add-on executa um container Docker:

- Defina a imagem Docker (por exemplo, uma imagem personalizada ou externa).
- Especifique volumes, portas ou variáveis de ambiente necessárias.

Por exemplo, o add-on Graffiti Wall Writer executa um container que atualiza periodicamente o arquivo de graffiti do validator client com base em uma configuração JSON para a imagem a ser desenhada.

O add-on Rescue Node configura o validator client para usar um beacon node remoto de fallback via proxy, requerendo parâmetros de nome de usuário e senha.

### 2. Criar a UI de Configuração

Adicione um arquivo em `rocketpool-cli/service/config/` nomeado `addon-myaddon.go`.

Este arquivo define a página TUI para configurar o add-on usando a biblioteca `tview`.

Elementos principais:

- Defina uma struct `AddonMyAddonPage` com campos para o layout, configuração mestre e itens do formulário.
- Construtor `NewAddonMyAddonPage` que inicializa a página e chama `createContent()`.
- `createContent()`: Configura o formulário com caixas de seleção (por exemplo, habilitado) e campos de entrada para outros parâmetros.
- Manipuladores de eventos como `handleEnableChanged()` para mostrar/ocultar parâmetros com base no estado habilitado.

Exemplo de trecho:

```go
package config

import (
	"fmt"

	"github.com/rivo/tview"
	"github.com/rocket-pool/smartnode/shared/services/config"
	"github.com/rocket-pool/smartnode/shared/types/addons"
	cfgtypes "github.com/rocket-pool/smartnode/shared/types/config"
)

type AddonMyAddonPage struct {
	addonsPage   *AddonsPage
	page         *page
	layout       *standardLayout
	masterConfig *config.RocketPoolConfig
	addon        addons.SmartnodeAddon
	enabledBox   *parameterizedFormItem
	otherParams  []*parameterizedFormItem
}

func NewAddonMyAddonPage(addonsPage *AddonsPage, addon addons.SmartnodeAddon) *AddonMyAddonPage {
	configPage := &AddonMyAddonPage{
		addonsPage:   addonsPage,
		masterConfig: addonsPage.home.md.Config,
		addon:        addon,
	}
	configPage.createContent()
}

func (configPage *AddonMyAddonPage) createContent() {
}
```

### 3. Registrar o Add-on

Atualize `addons/constructors.go` para incluir um construtor para o seu add-on.

Este arquivo contém funções para instanciar todos os add-ons.

Exemplo:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Então adicione-o à lista de addons disponíveis dentro de `NewRocketPoolConfig` em `shared/services/config/rocket-pool-config.go`.

```
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Integrar com Docker Compose

Add-ons frequentemente requerem modificações nos arquivos Docker compose.

- Adicione templates no diretório `shared/services/rocketpool/assets/install/templates/addons` para a seção compose do seu add-on (por exemplo, `my_addon.tmpl`).
- O código do add-on gera o YAML do compose quando habilitado, incluindo serviços, volumes e dependências.

A função `composeAddons` dentro da pasta `services/rocketpool/client` é responsável por provisionar containers Docker Compose com base na configuração Rocket Pool, configurando runtime, template e assets de override para o add-on.

Para instalação:

- Atualize o script do instalador (`install.sh`) se o add-on precisar de arquivos copiados (por exemplo, arquivos de configuração padrão).

### 5. Integrações Opcionais

- **Comando Node Status**: Se o add-on tem informações de status (por exemplo, expiração de credenciais para Rescue Node), atualize `rocketpool-cli/node/status.go` para exibi-las.
- **Métricas ou Logs**: Integre com Prometheus/Grafana se aplicável.
- **Dependências Externas**: Se usar um repositório externo (por exemplo, proxy Rescue Node), certifique-se de que está documentado.

### 6. Testes e Submissão

- Construa e teste localmente: Use o Makefile para construir o Smart Node, instalar e habilitar seu add-on.
- Verifique na TUI, cheque containers Docker e teste a funcionalidade.
- Submeta um pull request para https://github.com/rocket-pool/smartnode com suas alterações.

## Exemplo: Graffiti Wall Writer

- **Propósito**: Desenha imagens comunitárias no muro de graffiti Beaconcha.in usando propostas de blocos.
- **Implementação**: Executa um container Docker que busca o estado do muro e atualiza o arquivo de graffiti do validator.
- **Config**: Flag habilitado e parâmetro para URL JSON da imagem (padrão: logo Rocket Pool).
- **Integração**: O container monta o diretório de dados do validator para escrever o arquivo de graffiti. Habilitado via TUI; contribui para desenho descentralizado.

## Exemplo: Rescue Node

- **Propósito**: Beacon node de fallback para evitar penalidades durante tempo de inatividade.
- **Implementação**: Configura o validator client para usar um proxy remoto com autenticação.
- **Config**: Flag habilitado, nome de usuário e senha do site Rescue Node.
- **Integração**: Modifica a configuração do validator para apontar para o proxy rescue. Mostra status de credenciais em `rocketpool node status`.

Para mais detalhes, revise o código-fonte no repositório ou contribua para melhorar a documentação de desenvolvimento de add-ons.
