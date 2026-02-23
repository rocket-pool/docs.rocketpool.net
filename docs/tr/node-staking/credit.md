::: danger UYARI
Saturn 1'e hazırlık kapsamında minipool mevduatları şu anda devre dışı bırakılmıştır.
:::

# Depozito Kredi Sistemi

Depozito kredi sistemi, node operatörleri tarafından daha önce bağlanmış ancak artık gerekli olmayan ETH'yi takip eden ve tekrar kullanılabilir hale getiren bir mekanizmadır.
Bu kredinin kaynağı iki yerden gelir:

- [Mevcut 16-ETH bağlı bir minipool'u 8-ETH bağlı bir minipool'a geçirmek](./leb-migration.mdx) (bu, node operatörünün kredi bakiyesine 8 ETH ekler)
- [Mevcut bir solo validator'ı](./solo-staker-migration) bir minipool'a geçirmek (bu, geçiş sırasında oluşturdukları minipool türüne bağlı olarak node operatörünün kredi bakiyesine 16 veya 24 ETH ekler)

Her node operatörü **0 ETH** kredi bakiyesi ile başlar.
Bu iki işlemden herhangi biri bu bakiyeyi buna göre artıracaktır.

Bu ETH likit hale _getirilmez_ ve node operatörüne iade edilmez; bunun yerine, node operatöründen herhangi bir ETH gerektirmeden **ek minipool'lar oluşturmak** için kullanılabilir.

Kredi sistemi node operatörü için **şeffaftır**; mümkünse `rocketpool node deposit` veya `rocketpool node create-vacant-minipool` işlemleri sırasında otomatik olarak kullanılacaktır (Smartnode CLI'da kullanılacağını açıklayan bildirimlerle).
Eğer kullanıla*mazsa*, Smartnode kullanıcıya kullanılamayacağını bildirecek ve her iki işlem için de normal bir ETH bağı gerektirecektir.

Daha fazla ayrıntı için aşağıdaki [Kredi Kullanılabilirliği](#kredi-kullanilabilirligi) bölümüne bakın.

## Bir Örnek

Diyelim ki 0 ETH kredi bakiyeniz var ve 16-ETH bağlı tek bir minipool'unuz var.
Daha sonra [bu minipool'u 8-ETH bağına geçirebilirsiniz](./leb-migration.mdx).
Bu, artık bağlı olmayan **8 ETH** ile sonuçlanacaktır.
Bu 8 ETH, **kredi bakiyenize** yerleştirilecektir.

Şimdi, _ikinci_ bir 8-ETH minipool oluşturmak istediğinizi varsayalım.
Her zamanki gibi `rocketpool node deposit` komutunu çalıştırırsınız ve bağ miktarı olarak 8-ETH'yi seçersiniz.
Bu normalde minipool için kendi 8 ETH'nizi sağlamanızı gerektirir.
Ancak, 8 ETH kredi bakiyeniz olduğu için Rocket Pool **bunun yerine otomatik olarak onu kullanacaktır**:

```
Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.

Your consensus client is synced, you may safely create a minipool.
```

Buradaki ikinci satır seti ilgili olandır: bu depoziti karşılamak için kredi bakiyenizde yeterli ETH'ye sahip olduğunuzu _ve kullanılabilir olduğunu_ söyler, bu nedenle bakiyeyi otomatik olarak kullanacak ve node cüzdanınızdan herhangi bir ek ETH gerektirmeyecektir.

Kredi bakiyesi kullanılabilirliği hakkında ayrıntılar için [aşağıdaki kullanılabilirlik bölümüne](#kredi-kullanilabilirligi) bakın.

## Mevcut Kredi Bakiyenizi Görüntüleme

Mevcut kredi bakiyenizi görüntülemek için şu komutu çalıştırmanız yeterlidir:

```shell
rocketpool node status
```

Bu, node'unuz hakkında, en üstte kredi bakiyesi de dahil olmak üzere kapsamlı bir ayrıntı listesi üretir:

```
Your Smartnode is currently using the Zhejiang Test Network.

=== Account and Balances ===
The node 0x9BA1401Eb7D779eC51f910B066e9C4351cD28911 has a balance of 347.796908 ETH and 16799.835547 RPL.
The node has 8.000000 ETH in its credit balance, which can be used to make new minipools.
...
```

## Kredi Kullanılabilirliği

Bazı durumlarda, node'unuzda kullanılabilir bir kredi bakiyesi olabilir ancak şu anda ek minipool'lar dağıtmak için kullanamayabilir.

Kredi bakiyeniz için ETH, **deposit pool**'dan alınır.
Bu nedenle, yeni bir 8-ETH minipool oluşturmak için kredide 8 ETH kullanmak istiyorsanız, bu minipool için **tüm 32 ETH**'yi deposit pool'dan alacak ve sizden hiçbiri gerekmeyecektir.
Bu nedenle, deposit pool'da ön depozito değerini karşılamak için yeterli ETH yoksa (şu anda 1 ETH olarak ayarlanmıştır), **bakiye kullanılabilir olmayacaktır**.

Bu durumda, Smartnode bir `rocketpool node deposit` işlemi sırasında kredi bakiyenizi **kullanamayacağını** ve bunun yerine bağı tamamlamak için node cüzdanınızdan ETH kullanması gerektiğini size bildirecektir.
Bunu yapmak kredi bakiyenizi **tüketmeyecektir**; olduğu gibi bırakılacak ve deposit pool'da onu karşılayacak yeterli bakiye olduğunda daha sonra kullanılabilir olacaktır.
