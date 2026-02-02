# Feshedilmiş Bir Minipool'u Kurtarma

Minipool'unuzun fesih penceresi içinde stake etmemesi gibi olası olmayan bir durumda, oDAO tarafından "feshedilir" ve sağlanan kullanıcı fonları başka bir minipool tarafından kullanılmak üzere deposit pool'a iade edilir. Bu senaryoda, ETH'nizi geri almak ve RPL'nizi stake edilmemiş olarak kilidini açmak için aşağıdaki işlemi gerçekleştirmeniz gerekecektir.

## Minipool Delegate'inizi Güncelleyin

Bu işlemi gerçekleştirirken en son minipool delegate'ini kullanmanız şiddetle tavsiye edilir. Eski delegate'ler kapatıldıklarında bir `selfdestruct` operasyonu içerir, bu da işlem belirtilen sırayla doğru şekilde tamamlanmazsa fonların sonsuza kadar kilitlenebileceği anlamına gelir. Minipool'unuzun en son delegate üzerinde olup olmadığını [Delegate'inizi Yükseltme](./minipools/delegates#upgrading-your-delegate) işlemini deneyerek kontrol edebilirsiniz. Minipool'unuz yükseltilebilecek minipool'lar listesinde görünmüyorsa, aşağıya devam edebilirsiniz.

## Kullanılmayan Deposit Bakiyenizi Alın

::: tip NOT
Minipool'unuz Atlas'tan önce feshedildiyse, bu adımı atlayabilir ve doğrudan [Beaconchain Bakiyenizi 32 ETH'ye Yükseltin](#increase-your-beaconchain-balance-to-32-eth) bölümüne geçebilirsiniz.
Kullanılmayan deposit bakiyenizi almanız gerekmez çünkü Atlas'tan önce tüm bond miktarı beaconchain'e yatırılmıştı.
:::

İlk bond yatırımınızdan 1 ETH, validator'ünüzün çekim kimlik bilgilerini güvence altına almak için beaconchain'e ilk depozito olarak kullanılır. Kalan miktar, deposit pool'dan ETH atandığında minipool'unuza yatırılır.

Minipool'unuz feshedildiğinde, kullanıcı ETH'si deposit pool'a iade edilir ve ETH'niz size iade edilmeye hazır olarak minipool'da kalır. Bu ETH'yi almak için [Manuel Dağıtım](./skimming#manual-distribution) ödül özelliğini kullanın, böylece validator'ünüzü etkinleştirmek için bir sonraki adımda kullanılabilir.

## Beaconchain Bakiyenizi 32 ETH'ye Yükseltin

Validator'ünüzün bakiyesini beaconchain'de aktivasyon için gereken minimum seviyeye getirmelisiniz. Bu miktar **32 ETH**'dir. 16 ETH bond'lu bir minipool'unuz varsa, ek 16 ETH'ye ihtiyacınız olacak ve 8 ETH bond'lu bir minipool'unuz varsa bu adım sırasında ek 24 ETH'ye ihtiyacınız olacaktır.

Gerekli miktarda ETH'yi node adresinize yatırın ve ardından işlemi başlatmak için aşağıdaki komutu verin:

```shell
rocketpool minipool rescue-dissolved
```

Manuel depozito için kriterleri karşılayan minipool'ların bir listesi sunulacaktır:

```
Please select a minipool to rescue:
1: All available minipools
2: 0x7E5700bcd65B1770bA68abB288D3f53814d376aC (dissolved since 2023-02-08, 06:33 +0000 UTC)
3: 0x7E570195026dC29f4B2DfF08B56c3b5D0FF988Ef (dissolved since 2023-02-08, 06:33 +0000 UTC)
```

Kurtarmak istediğiniz minipool'u seçtikten sonra, ne kadar manuel olarak yatırmak istediğiniz sorulacaktır:

```
1. All 16.000000 ETH required to rescue it
2. 1 ETH
3. A custom amount
```

Seçenek 1 çoğu durumda kullanılacaktır. Beaconchain bakiyenizi gerekli 32 ETH miktarına getirmek için gereken miktardır. Diğer seçenekler gelişmiş kullanım durumları için sağlanmıştır.

::: tip NOT
Beaconchain bakiyenizi 32 ETH'ye getirmek, validator'ünüzün Ethereum doğrulama görevlerine aktif olarak katılabileceği anlamına gelir. Smartnode, fesihten bu yana validator'ünüzü yeniden başlatma şansı bulamayabilir. Bu nedenle, validator'ınızın validator anahtarlarınızı yüklediğinden ve kurtarma işlemi sırasında herhangi bir cezayı önlemek için doğrulama görevlerini yerine getirebileceğinden emin olmak için validator'ünüzü manuel olarak yeniden başlatmak iyi bir fikirdir.

Standart Docker modunu çalıştırıyorsanız, bu `docker restart rocketpool_validator` ile yapılabilir.
:::

Bu adım tamamlandıktan sonra, validator'ünüz giriş kuyruğuna girecek ve aşağıdaki olayların gerçekleşmesini beklemeniz gerekecektir:

1. Yatırımınızın kabul edilmesi için 2048 execution layer bloğunun geçmesi gerekir (~8 saat)
2. Validator'ların sizi onaylaması için 32 epoch'a kadar geçmesi gerekir (0.5 - 3.5 saat)
3. Validator kuyruğunda değişken bir süre (kuyruktaki her 4 validator için 6.4 dakika)
4. Çıkışa izin verilmeden önce minimum 256 epoch doğrulama (27 saat)

### Validator'ünüzden Çıkış

Validator'ünüz minimum 256 epoch boyunca aktif olduktan sonra, [Validator'ünüzden Çıkış](./withdraw#exiting-your-validator) kılavuzunu izleyerek herhangi bir minipool ile aynı işlemle minipool'unuzdan çıkabilirsiniz.

Tam 32 ETH bakiyesi minipool'unuza iade edilecek ve feshedilmiş minipool'lar bakiyelerinin %100'ünü node operatörünün çekim adresine dağıtacaktır.
