# Rocket Pool Smart Node için Add-on Yazma

## Giriş

Rocket Pool Smart Node add-on'ları, Smart Node yığınına ek özellikler sağlayan uzantılardır. Ethereum istemcileri veya Smart Node servisi ile entegre olan Docker container'ları olarak uygulanabilirler. Add-on'lar, `rocketpool service config` komutu aracılığıyla Smart Node'un terminal kullanıcı arayüzü (TUI) üzerinden etkinleştirilebilir ve yapılandırılabilir.

Add-on geliştirme, mevcut iki örneğe dayanabilir:

- **Graffiti Wall Writer**: Node operatörlerinin blok teklifi graffitisini dinamik olarak ayarlayarak Beaconcha.in graffiti duvarındaki topluluk çizimlerine katkıda bulunmalarını sağlar. Her teklifle hangi pikselleri "boyayacağını" belirlemek için merkezi olmayan bir çizim aracı kullanır.
- **Rescue Node**: Rocket Rescue Node projesinden kimlik bilgilerini kullanarak bir yedek beacon node servisi sağlar. Bu, node bakımı, senkronizasyon veya kesintiler sırasında istekleri paylaşılan bir uzak beacon node'a yönlendirerek kaçırılan onayları önlemeye yardımcı olur.

Add-on'lar Smart Node kaynak kodunun bir parçasıdır ve repository'ye pull request aracılığıyla katkıda bulunulmalıdır. Yapılandırma ve entegrasyon için standartlaştırılmış bir arayüz uygularlar.

## Ön Koşullar

- Add-on'lar Go'da yazıldığı için Go programlama diline aşinalık.
- Add-on'lar container olarak çalışabildiği için Docker anlayışı.
- Docker compose kurulumu ve yapılandırma sistemi dahil olmak üzere Rocket Pool Smart Node mimarisine ilişkin bilgi.
- Yerel geliştirme ve test için Smart Node repository'sine erişim.

## Add-on Oluşturma Adımları

Yeni bir add-on oluşturmak için, Smart Node repository'si içindeki belirli konumlara kod eklemeniz gerekecektir. Süreç, add-on mantığını uygulamayı, kullanıcı arayüzünü yapılandırmayı, kaydetmeyi ve Docker yığınıyla entegrasyonu işlemeyi içerir.

### 1. Add-on Mantığını Uygulama

`addons/` içinde add-on'unuzun adını taşıyan yeni bir alt dizin oluşturun (snake_case kullanın, örneğin, `my_addon`).

Bu dizinde, add-on struct'ını tanımlayan ve `github.com/rocket-pool/smartnode/shared/types/addons`'dan `SmartnodeAddon` arayüzünü uygulayan bir Go dosyası oluşturun (örneğin, `my_addon.go`).

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

Uygulanması gereken ana metotlar:

- `GetName()`: Add-on'un görünen adını döndürür.
- `GetDescription()`: Kısa bir açıklama döndürür.
- `GetConfig()`: Parametrelerle birlikte yapılandırma nesnesini döndürür (örneğin, etkin bayrağı, API anahtarları, URL'ler).
- `GetEnabledParameter()`: Add-on'un etkin olup olmadığını kontrol eden parametreyi döndürür.
- Add-on'u başlatma/durdurma, Docker compose bölümleri oluşturma veya diğer servislerle etkileşim kurma metotları.

Add-on bir Docker container'ı çalıştırıyorsa:

- Docker imajını tanımlayın (örneğin, özel bir imaj veya harici bir imaj).
- Gerekli volume'leri, portları veya ortam değişkenlerini belirtin.

Örneğin, Graffiti Wall Writer add-on'u, çizilecek imaj için bir JSON yapılandırmasına dayalı olarak validator istemcisinin graffiti dosyasını periyodik olarak güncelleyen bir container çalıştırır.

Rescue Node add-on'u, validator istemcisini bir proxy aracılığıyla uzak bir yedek beacon node kullanacak şekilde yapılandırır, kullanıcı adı ve şifre parametreleri gerektirir.

### 2. Yapılandırma Kullanıcı Arayüzünü Oluşturma

`rocketpool-cli/service/config/` içinde `addon-myaddon.go` adlı bir dosya ekleyin.

Bu dosya, `tview` kütüphanesini kullanarak add-on'u yapılandırmak için TUI sayfasını tanımlar.

Ana öğeler:

- Layout, master config ve form öğeleri için alanlarla bir `AddonMyAddonPage` struct'ı tanımlayın.
- Sayfayı başlatan ve `createContent()` çağıran `NewAddonMyAddonPage` constructor'ı.
- `createContent()`: Checkbox'lar (örneğin, etkin) ve diğer parametreler için giriş alanları ile formu kurar.
- Etkin duruma göre parametreleri göstermek/gizlemek için `handleEnableChanged()` gibi olay işleyicileri.

Örnek parçacık:

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

### 3. Add-on'u Kaydetme

Add-on'unuz için bir constructor içermek üzere `addons/constructors.go`'yu güncelleyin.

Bu dosya tüm add-on'ları başlatmak için fonksiyonlar içerir.

Örnek:

```
func NewMyAddon() addons.SmartnodeAddon {
    return my_addon.NewMyAddon()
}
```

Ardından `shared/services/config/rocket-pool-config.go` içindeki `NewRocketPoolConfig` içindeki mevcut addon'lar listesine ekleyin.

```
cfg.GraffitiWallWriter = addons.NewGraffitiWallWriter()
cfg.RescueNode = addons.NewRescueNode()
cfg.MyAddon = addons.MyAddon()
```

### 4. Docker Compose ile Entegrasyon

Add-on'lar genellikle Docker compose dosyalarında değişiklik gerektirir.

- Add-on'unuzun compose bölümü için `shared/services/rocketpool/assets/install/templates/addons` dizinine şablonlar ekleyin (örneğin, `my_addon.tmpl`).
- Add-on kodu etkinleştirildiğinde, servisler, volume'ler ve bağımlılıklar dahil olmak üzere compose YAML'ını oluşturur.

`services/rocketpool/client` klasörü içindeki `composeAddons` fonksiyonu, Rocket Pool yapılandırmasına dayalı olarak Docker Compose container'larını sağlamaktan, add-on için runtime, template ve override varlıklarını kurmaktan sorumludur.

Kurulum için:

- Add-on'un dosya kopyalanmasını gerektiriyorsa (örneğin, varsayılan yapılandırma dosyaları), installer script'ini (`install.sh`) güncelleyin.

### 5. İsteğe Bağlı Entegrasyonlar

- **Node Status Komutu**: Add-on'un durum bilgisi varsa (örneğin, Rescue Node için kimlik bilgisi süresi), bunu görüntülemek için `rocketpool-cli/node/status.go`'yu güncelleyin.
- **Metrikler veya Loglar**: Uygulanabilirse Prometheus/Grafana ile entegre edin.
- **Harici Bağımlılıklar**: Harici bir repo kullanıyorsanız (örneğin, Rescue Node proxy), bunun belgelendiğinden emin olun.

### 6. Test ve Gönderim

- Yerel olarak oluşturun ve test edin: Smart Node'u oluşturmak, kurmak ve add-on'unuzu etkinleştirmek için Makefile'ı kullanın.
- TUI'de doğrulayın, Docker container'larını kontrol edin ve işlevselliği test edin.
- Değişikliklerinizle https://github.com/rocket-pool/smartnode adresine bir pull request gönderin.

## Örnek: Graffiti Wall Writer

- **Amaç**: Blok teklifleri kullanarak Beaconcha.in graffiti duvarında topluluk imajları çizer.
- **Uygulama**: Duvar durumunu getiren ve validator'ın graffiti dosyasını güncelleyen bir Docker container çalıştırır.
- **Config**: Etkin bayrağı ve imaj JSON URL'si için parametre (varsayılan: Rocket Pool logosu).
- **Entegrasyon**: Container, graffiti dosyasını yazmak için validator'ın veri dizinini mount eder. TUI aracılığıyla etkinleştirilir; merkezi olmayan çizime katkıda bulunur.

## Örnek: Rescue Node

- **Amaç**: Kesinti sırasında cezalardan kaçınmak için yedek beacon node.
- **Uygulama**: Validator istemcisini kimlik doğrulaması olan uzak bir proxy kullanacak şekilde yapılandırır.
- **Config**: Etkin bayrağı, Rescue Node web sitesinden kullanıcı adı ve şifre.
- **Entegrasyon**: Validator yapılandırmasını rescue proxy'sine işaret edecek şekilde değiştirir. `rocketpool node status` içinde kimlik bilgisi durumunu gösterir.

Daha fazla ayrıntı için, repository'deki kaynak kodu inceleyin veya add-on geliştirme belgelerini geliştirmeye katkıda bulunun.
