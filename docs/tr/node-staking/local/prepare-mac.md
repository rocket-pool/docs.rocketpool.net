# Mac Hazırlama

Rocket Pool'u kurmadan önce, sisteminizin uyumlu olduğundan ve doğru çalışacağından emin olmak için yapmanız gereken birkaç kontrol vardır.

::: danger
Rocket Pool node'u çalıştırmak için özel bir makine oluşturmanızı şiddetle tavsiye ediyoruz.
Günlük masaüstü gibi genel kullanımlı bir makinede node çalıştırmak, cüzdanınızı tehlikeye atabilecek ve coin'lerinizin çalınmasına neden olabilecek ekstra güvenlik riskleri sunar.

**Maksimum güvenlik için, lütfen yalnızca node çalıştırmaya ayrılmış yeni bir makine kurun.**
:::

## Sistem Gereksinimleri

Aşağıda bir Rocket Pool node'unun gerektirdiği yazılım ve donanım gereksinimlerinin kısa bir açıklaması bulunmaktadır.
Bu kılavuz, makinenizi fiziksel olarak kurduğunuzu ve işletim sistemini kurduğunuzu varsayar.

### Desteklenen İşletim Sistemleri

Rocket Pool, donanımınız için en son macOS sürümünü kullanmanızı önerir.

### macOS Desteği

Aşağıdaki ön koşulları kurmanız gerekecektir:

Mac için paket yöneticisi olarak [Homebrew](https://brew.sh) kullanmanızı şiddetle tavsiye ediyoruz. `brew` komutunu kullanarak paketleri kolayca kurmanıza olanak tanır.

Şu şekilde kurabilirsiniz:

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Sizin için XCode Komut Satırı Araçları gibi bazı ön koşulları kurmalıdır. Kurmazsa, bunları manuel olarak şu şekilde kurabilirsiniz:

```shell
xcode-select --install
```

Kurulduktan sonra, her şeyin doğru çalıştığından emin olmak için şunu kullanın:

```shell
brew doctor
```

Her şey kurulup çalıştığında, Homebrew `brew` komutunu kullanarak paketleri kurmanıza izin verecektir.

Örneğin, Homebrew kullanarak `wget` kurmak için Terminal'de aşağıdaki komutu çalıştırın:

```shell
brew install wget
```

Artık Homebrew kurulu olduğuna göre, Docker istemcimiz olan [Orbstack](https://orbstack.dev)'i kurabiliriz.

```shell
brew install --cask orbstack
```

Orbstack, Uygulamalar klasörünüze kurulacaktır. Oradan başlatın ve başlatılacaktır. Docker Desktop'tan taşıyorsanız, mevcut Docker kurulumunuzu algılamalı ve image'lerinizi ve container'larınızı taşımalıdır.

Donanımınıza bağlı olarak Orbstack ayarlarınızı düzenlemeniz gerekebilir.

Daha önce Docker Desktop kurduysanız, önce onu kaldırmanız gerekecektir. Docker Desktop eskiden önerilen Docker İstemcisiydi, ancak geçen yıl çok daha iyi kararlılık sağlayan birkaç yeni istemci yayınlandı.

Lütfen Güvenlik Duvarınızın (Sistem Ayarları -> Ağ -> Güvenlik Duvarı) açık olduğundan ve Orbstack'in gelen bağlantılara izin veren uygulamalar listesine eklendiğinden emin olun. (Orbstack bunu sizin için yapmalıdır)

![](../local/images/mac/firewall.png)

### SSH Kurulumu ve Kullanımı

SSH zaten macOS ile kurulu olmalıdır.

### Kurulum Öncesi Sistem Kontrolleri

Rocket Pool'u kurmadan önce, lütfen aşağıdaki kontrol listesini gözden geçirin:

- Sisteminiz tamamen kurulmuştur, açılır ve işletim sistemine başlatılabilir.
- Sistem üzerinde İnternet'te gezinme, e-posta kontrol etme veya oyun oynama gibi başka hiçbir etkinlik yapmayacaksınız.
- Bir macOS işletim sistemi yüklüdür.
- Kullanıcı hesabınızın root / yönetici ayrıcalıkları vardır.
- Performans gereksinimlerini karşılayan bir SSD'niz var.
- SSD'niz dosya sisteminize mount edilmiştir.
- İlk Execution ve Consensus senkronizasyon işlemi için en az 1.5TB boş alanınız var.
- ISS'nizin verilerinizi sınırlandırması durumunda, ayda 2 TB'den fazladır.

Tüm bu öğeleri kontrol edip onayladıysanız, Rocket Pool'u kurmaya ve bir node çalıştırmaya başlamaya hazırsınız!
[ETH İstemcilerinizi Seçme](../eth-clients) bölümüne geçin.
