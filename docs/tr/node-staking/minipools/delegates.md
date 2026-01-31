::: danger UYARI
Minipool yatırmaları şu anda Saturn 1 hazırlığı nedeniyle devre dışı bırakılmıştır.
:::

# Minipool Delegate

Çalıştırdığınız her validator'ın "sahibi" olarak bir **minipool** kontratı vardır.
Minipool, o validator'a özel olarak atanmış benzersiz bir kontrattır; onun **çekim adresi** olarak görev yapar.
Beacon Chain'den gelen tüm ödül ve staking bakiyesi çekimleri minipool kontratına gönderilecektir.

Her minipool, sizin (düğüm operatörü) üzerinde nihai kontrole sahip olmanızı sağlamak için benzersizdir.
Başka hiç kimse onu kontrol edemez, başka hiç kimse onu değiştiremez; tamamen sizin komutunuzdadır.

Bununla birlikte, düğüm yatırmaları sırasında gas maliyetlerini en aza indirmek için minipool'un _kendisi_ çok az gerçek işlevsellik içerir.
Yapabileceği hemen hemen her şey bir **delegate** kontratına ertelenir.

Minipool delegate kontratı, minipool'lar tarafından gereken mantığın büyük kısmını içeren özel bir kontrattır - örneğin bakiyeyi sizinle pool staker'ları arasında adil bir şekilde dağıtmak gibi şeyler.
Her minipool'un benzersiz bir kontrat olduğu minipool'ların aksine, delegate birçok minipool'un istekleri "iletebileceği" tek bir kontrattır.

Bazen Rocket Pool geliştirme ekibi yeni işlevsellik ekleyen yeni bir minipool delegate yayınlayacaktır.
Örneğin, Atlas güncellemesinde minipool'u kapatmaya gerek kalmadan skimmed ödülleri dağıtma desteğine sahip yeni bir delegate tanıttık.

Minipool'lar bu yeni işlevsellikten yararlanmak için delegate'lerini yükseltebilir.
Delegate yükseltmeleri **isteğe bağlıdır**, bu nedenle onları kullanıp kullanmayacağınıza ve ne zaman kullanacağınıza karar verebilirsiniz.
Bununla birlikte, genellikle ağ yükseltmelerinin sunduğu yeni işlevselliklerden yararlanmak için gereklidirler.

### Delegate'inizi Yükseltme

Bir minipool'u yeni bir delegate kontratına yükseltmek için basitçe şu komutu çalıştırın:

```shell
rocketpool minipool delegate-upgrade
```

Bu size şu anda en son delegate'i kullanmayan ve yükseltme için uygun olan minipool'larınızın bir listesini sunacaktır:

```
Please select a minipool to upgrade:
1: All available minipools
2: 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
3: 0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
4: 0x7E5704aD2a63eb90880426Dcd4a3811246dF3cB0 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
5: 0x7E5705c149D11efc951fFc20349D7A96bc6b819C (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
6: 0x7E570625cE8F586c90ACa7fe8792EeAA79751778 (using delegate 0x5c2D33A015D132D4f590f00df807Bb1052531ab9)
7: 0x7E5700c82E38434C6c72890bb82f5B5305f4328a (using delegate 0x6aCEA7f89574Dd8BC6ffDfDca1965A3d756d5B20)
```

Minipool adresinin solundaki ilgili numarayı girerek listeden yükseltmek istediğinizi seçin.
Seçildikten sonra gas fiyatı ayarlarınızı onaylamanız istenecek ve ardından minipool'u yükseltmek için bir işlem gönderilecektir:

```
Using a max fee of 26.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to upgrade 1 minipools? [y/n]
y

Upgrading minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40...
Transaction has been submitted with hash 0xcd91c9a38f3438c3d8a45bb5f439014e5935dcb50b0704f3c5077f54174e99bb.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully upgraded minipool 0x7e5702a2cE66B5B35E59B9Ac00eEAAa547881e40.
```

`rocketpool minipool status` ile en son delegate'i kullanıp kullanmadığını doğrulayabilirsiniz.
En son delegate'i _kullanmayan_ herhangi bir minipool, durumlarının altında yükseltilebileceklerini bildiren sarı bir bildirime sahip olacaktır:

```
Address:              0x7E5703fdA638CD86c316B9EbAF76927fF695ADC5
Penalties:            0
...
Delegate address:      0x5c2D33A015D132D4f590f00df807Bb1052531ab9
Rollback delegate:     <none>
Effective delegate:    0x5c2D33A015D132D4f590f00df807Bb1052531ab9
*Minipool can be upgraded to delegate 0x149aE025fFC7E7bbcCc8d373d56797D637bF5D33!
```
