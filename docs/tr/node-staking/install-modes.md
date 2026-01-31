# Bir Rocket Pool Modu Seçimi

Rocket Pool'un Smartnode stack'i oldukça esnektir; çalıştırmanın birkaç farklı yolu vardır.
Sıfırdan tam bir node örneği oluşturabilir, mevcut Execution veya Consensus client dağıtımlarıyla entegre olabilir ve hatta bir sistem hizmetleri seti olarak yerel olarak çalışabilir.
Bu bölümde, Smartnode stack'ini yapılandırmanın ve kullanmanın tipik yollarını ele alacağız.

## Varsayılan Docker Tabanlı Konfigürasyon

Varsayılan mod ve bir Smartnode çalıştırmanın en yaygın yolu, Rocket Pool'un yönettiği yerel makinenizde tam bir node örneği oluşturmasını sağlamaktır.

Bunu başarmak için Smartnode, [Docker containerları](https://www.docker.com/resources/what-container) kullanır.
Esasen, bir Docker containerı, bir program, tüm bağımlılıkları ve doğru çalışması için gereken tüm konfigürasyonla önceden yapılandırılmış küçük bir korumalı alandır.
Artık gerekli olmadığında, basitçe atılabilir.
Gerçek dosya sisteminizi veya diğer programları karıştırmadan işlerin çalışmasını sağlayan güzel, küçük, bağımsız bir pakettir.

Bu mod, Smartnode Installer'ın sizin için dağıtacağı şeydir.
Aşağıdaki Docker containerlarını kullanır:

- `rocketpool_api` - Bu, Rocket Pool'un komut satırı arayüzü (CLI) aracılığıyla onunla etkileşime girdiğinizde Smartnode'un sağladığı gerçek işlevselliği tutar.
- `rocketpool_node` - Bu, bir ödül kontrol noktasından sonra RPL ödüllerini periyodik olarak kontrol edecek ve talep edecek bir arka plan işlemidir (otomatik talep etkinse, bununla ilgili daha fazlası daha sonra) ve bir minipool oluşturduğunuzda yeni validatorleri gerçekten stake etmekten sorumludur.
- `rocketpool_watchtower` - Bu, Oracle Node'ları tarafından oracle ile ilgili görevleri yerine getirmek için kullanılır. Normal node operatorleri için bu basitçe boşta kalacaktır.
- `rocketpool_eth1` - Bu sizin Execution clientınız olacaktır.
- `rocketpool_eth2` - Bu sizin Consensus beacon node clientınız olacaktır.
- `rocketpool_validator` - Bu sizin Validator clientınız olacaktır, bu da validator görevlerinizden (bloklara onay vermek veya yeni bloklar önermek gibi) sorumludur.

Çoğu durumda, sıfırdan yeni bir node oluştururken seçilecek iyi bir seçenektir.
En hızlı, en az müdahale gerektiren prosedürdür.
Ayrıca her yeni Smartnode sürümünde Execution ve Consensus clientlarına yapılan güncellemeleri de yönetecektir, bu nedenle onlar hakkında endişelenmenize gerek kalmaz (istediğiniz zaman manuel olarak yükseltebilirsiniz).

::: warning NOT
Şu anda, Docker containerlarından bazılarının doğru çalışması için `root` kullanıcısı olarak çalışması gerekir.
Docker containerları genellikle bir kullanıcının ana İşletim Sisteminize kaçmasını önlemede oldukça iyidir, ancak güvenlik nedenleriyle bu gereksinimden rahatsız olabilirsiniz.
Bu durumda, aşağıda listelenen Native konfigürasyon modunu kullanmanızı öneririz.
:::

Bu modu kullanmak istiyorsanız, [Docker ile Standart Bir Rocket Pool Node'unu Yapılandırma](./docker) bölümüne geçin.

## Harici Clientlar ile Hibrit Konfigürasyon

Hibrit konfigürasyon, bir Rocket Pool node'u çalıştırmakla ilgilenen, ancak diğer amaçlar için (örneğin, zaten solo-staking yaptıkları için) kendi Execution ve/veya Consensus clientlarını zaten çalıştıran kullanıcılar için uygundur.

Bu modda, Rocket Pool kendi işlemleri ve yönettiği bir Validator client için Docker containerları dağıtacaktır, ancak zaten çalıştırdığınız ve bakımını yaptığınız harici clientlar için Execution client ve Beacon Node containerlarını görmezden gelecektir.
**Rocket Pool node'unuzun her bir minipoolü için yeni validator anahtarları oluşturacağı ve bunları koruyacağı için, kendi Validator clientını çalıştırması önemlidir.**

Bu konfigürasyonu kullanırken, Smartnode aşağıdaki Docker containerlarını kullanacaktır (yukarıda açıklanmıştır):

- `rocketpool_api`
- `rocketpool_node`
- `rocketpool_watchtower`
- `rocketpool_validator`

`rocketpool_eth1` ve `rocketpool_eth2` containerları, harici olarak çalıştırdığınız clientlara bağlı olarak dahil edilecek veya hariç tutulacaktır.

Bu modu kullanmak istiyorsanız, [Docker ile Standart Bir Rocket Pool Node'unu Yapılandırma](./docker) bölümüne geçin.
Execution ve/veya Consensus clientlarınız için bir yönetim modu seçmeniz istendiğinde, o bölümde ayrıntılı olarak açıklanan **Externally Managed** seçeneğini seçin.

## Docker Olmadan Native Konfigürasyon

Bu konfigürasyon Docker'ı tamamen atlar.
Smartnode stack'ini Docker aracılığıyla çalıştırmak yerine, her işlem yerel bir sistem hizmeti olarak kurulacaktır (örneğin `systemd` aracılığıyla).
Bu, `node`, `watchtower`, `eth1`, `eth2` ve `validator` işlemlerini içerir.

Bu konfigürasyon en fazla esnekliği sunar çünkü Rocket Pool'un parametrelerini (güvenlik duruşu, Execution ve Consensus clientların nerede yaşadığı, zincir verilerinin nerede yaşadığı, anahtarlarınızın nerede yaşadığı vb. gibi) ince ayar yapmanıza olanak tanır.
Aynı zamanda kurmak ve bakımını yapmak en zor olanıdır.

Bu modda, Smartnode Installer artık alakalı değildir.
Smartnode altyapısını, ETH clientlarını ve validator clientlarını manuel olarak başlatmaktan, bakımını yapmaktan ve yükseltmekten siz sorumlusunuz.

::: danger UYARI
Bunu nasıl yapacağınıza dair bazı örnek belgeler sağlasak da, bu modun yalnızca **deneyimli sistem yöneticileri** tarafından kullanılması gerektiğini öneririz.
:::

Bu modu kullanmak istiyorsanız, [Docker Olmadan Native Bir Rocket Pool Node'unu Yapılandırma](./native.mdx) bölümüne geçin.
