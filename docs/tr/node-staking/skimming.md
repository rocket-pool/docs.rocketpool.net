# Skimmed Ödüllerin Dağıtımı

Ethereum için bir validator çalıştırdığınızda aldığınız ETH ödülleri, "skimming" olarak adlandırılan bir süreçte rutin olarak minipool'larınıza gönderilir.
Skim'lerin sıklığı, Beacon Chain'deki aktif validator sayısına bağlıdır. Bu yazının yazıldığı sırada validator sayısı yaklaşık
500.000 civarında olup, bu da yaklaşık her 2-3 günde bir skim gerçekleşmesine neden olmaktadır.

Skimmed ödüller, siz bunları "dağıtana" kadar her minipool'unuzda birikecektir. Bu süreç, skimmed ödülleri sizin (node operatörü olarak) ve rETH sahipleri arasında
komisyon oranınıza ve sağlanan ile tedarik edilen ETH oranına göre dağıtır.

::: warning NOT
Minipool'unuzun bakiyesine erişmek için önce [Atlas delegate](./minipools/delegates) sürümüne yükseltme yapmanız gerekecektir.
Eski Redstone delegate, minipool'un bakiyesini dağıtmak için kullanılamaz.
:::

## Otomatik Dağıtım

Varsayılan olarak, Smartnode, minipool'larınızdan herhangi birinin bireysel bakiyeleri **1 ETH**'ye ulaştığında bunları otomatik olarak dağıtacak şekilde yapılandırılmıştır. Bu
eşik, aşağıdaki adımları izleyerek TUI'de yapılandırılabilir.

Şunu çalıştırın:

```shell
rocketpool service config
```

Aşağıda gösterilen `Smartnode and TX Fee Settings > Auto Distribute Threshold` ayarına gidin.

![](./images/tui-automatic-skimming.png)

Bu ayarı değiştirmek, Smartnode'un minipool'larınızı otomatik olarak dağıtacağı eşiği ayarlayacaktır.
Parametreyi 0'a ayarlamak otomatik dağıtımları devre dışı bırakacaktır.

::: warning UYARI
Otomatik dağıtımı devre dışı bırakmaya karar verirseniz, yine de düzenli olarak manuel dağıtım yapmanız önemlidir.
Bunu nasıl yapacağınızı öğrenmek için takip eden [manuel dağıtım bölümünü](#manuel-dagitim) okuyun.

Uzun bir süre sonra skimmed ödülleriniz 8 ETH'yi aşabilir. Bu durum gerçekleşirse, artık bunları
dağıtamayacaksınız ve birikmiş ödüllerinize erişmek için validator'ınızdan çıkış yapmanız gerekecektir.

Rocket Pool, uzun bir bekleme süresinden sonra, bakiyesi 8 ETH'yi aştığında herhangi birinin minipool'unuzu dağıtmasına izin veren
bir güvenlik önlemi tasarımına sahiptir. Sermayenizi korumak için, Smartnode bu durumu izler ve gerçekleşirse
minipool'unuzdan otomatik olarak çıkış yapacaktır.
:::

## Manuel Dağıtım

Skimmed ödüllerin otomatik dağıtımını devre dışı bıraktıysanız, bunları aşağıdaki süreçle
kendiniz düzenli olarak dağıtmanız gerekecektir.

Ayrıca yukarıdaki otomatik süreci beklemeden herhangi bir zamanda bu süreci kullanarak ödüllerinizi manuel olarak dağıtabilirsiniz.

Minipool'unuzda 8 ETH'den az varsa, ödüllerinizi aşağıdaki komutla dağıtabilirsiniz:

```shell
rocketpool minipool distribute-balance
```

Bu, dağıtım için uygun olan minipool'larınızı, ne kadar ETH'ye sahip olduklarını ve sizin (node operatörü olarak) ne kadar ETH alacağınızı gösterecektir:

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

Orijinal başlatma delegate'ini kullanan tüm minipool'lar başlangıçta belirtilecek ve delegate'lerini yükseltene kadar bunlar üzerinde `distribute-balance` çağrısı yapamayacağınızı size bildirecektir.
Bu delegate, skimmed çekimler belirlenmeden önce yazılmıştır ve bu nedenle skimmed ödülleri dağıtmanın bir yolunu içermez.

Uygun minipool'lar için **iade miktarının** da gösterildiğine dikkat edin.
Bu, doğrudan size ait olan bir miktardır (örneğin, [16-ETH bond'dan 8-ETH bond'a geçiş yapmadan](./leb-migration.mdx) önce minipool'unuzda bir bakiyeniz vardıysa veya mevcut ödüllere sahip [bir solo validator'ı minipool'a dönüştürdüyseniz](./solo-staker-migration)).
Bu, rETH sahipleriyle paylaşılmayacaktır.

Dağıtmak istediğiniz minipool'un numarasını girin.
Her zamanki gibi gaz fiyat tablosu ile karşılaşacaksınız ve kararınızı onaylamanız istenecektir.
Onayladığınızda, minipool'unuzun bakiyesi dağıtılacaktır:

```
Using a max fee of 2.00 gwei and a priority fee of 2.00 gwei.
Are you sure you want to distribute the ETH balance of 1 minipools? [y/n]
y

Distributing balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC...
Transaction has been submitted with hash 0xb883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9.
Waiting for the transaction to be included in a block... you may wait here for it, or press CTRL+C to exit and return to the terminal.

Successfully distributed the ETH balance of minipool 0x7E5700bcd65B1770bA68abB288D3f53814d376aC.
```

[İşlemden](https://zhejiang.beaconcha.in/tx/b883eab903d9688b40d291c5c2030084f9bce19135837ebf96a5c1e8871cfbf9) görebileceğiniz gibi, bu, node'un çekim adresine node'un ödül payını (artı iade miktarını) sağladı ve geri kalanını staking havuzuna geri gönderdi.
