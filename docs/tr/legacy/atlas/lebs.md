# 8-ETH Teminatlı Minipool'lar

Rocket Pool ilk başlatıldığında iki tür minipool destekliyordu:

1. **16-ETH teminat**, node operatörü 16 ETH sağlar ve kalan 16 ETH, tam bir (32 ETH) validator oluşturmak için staking havuzundan gelirdi.
2. **32-ETH geçici teminat**, node operatörü tüm 32 ETH'yi sağlayarak başlatma sürecini atlayabilir ve hemen Beacon Chain'de doğrulama yapmaya başlayabilirdi, ardından deposit havuzu bunu karşılayacak kadar ETH olduğunda 16 ETH geri ödeme alırdı. Bu noktada normal bir 16-ETH teminatlı minipool'a dönüşürdü.

İkincisi, artık gerekli olmaması ve uzun geri ödeme gecikmelerine neden olması nedeniyle protokolün hayatının birkaç ay sonrasında bir topluluk oylamasıyla kaldırıldı.

İlki, protokolün en düşük teminat miktarını temsil ediyordu çünkü bir node operatörü Rocket Pool'u Ethereum protokolüne saldırmak için kullanır ve _tüm teminatı_ slashing'e uğrarsa, rETH staker'ları kadar kaybedeceklerini ve öne geçmeyeceklerini garanti ediyordu.

Rocket Pool'un lansmanından bu yana topluluk, bu teminatın sağladığı güvenlik üzerine [önemli araştırmalar](https://dao.rocketpool.net/t/leb8-discussion-thread/899) yaptı ve bunun çok muhafazakar olduğunu buldu.
Her açıdan, 16 ETH'lik bir slashing gerçekçi olmayan olarak kabul edildi ve 16-ETH teminat, yalnızca 8 ETH'lik bir teminatla (artı ek RPL gereksinimi) aynı güvenlik avantajlarını sağlıyordu.
Bu nedenle, bu araştırmayla desteklenen Atlas yükseltmesi listeye yeni bir minipool türü ekliyor: **8-ETH teminat**, Rocket Pool topluluğu tarafından "LEB8" (Lower ETH Bond - 8 ETH) olarak adlandırılıyor.

8-ETH minipool oluşturmak için node operatörünün yalnızca **kendi ETH'lerinden 8** sağlaması gerekir (artı teminat gereksinimini karşılayacak kadar RPL - bunun hakkında daha fazlası [RPL Teminatı](#rpl-teminatı) bölümünde).
Daha sonra validator'ı tamamlamak ve Beacon Chain'de çalışmaya başlamak için deposit havuzundan **24 ETH** çekecek.

Bu, **node çalıştırmak isteyen ancak tam olarak 16 ETH'si olmayan yeni potansiyel node operatörlerine kapıyı açıyor**.
Ayrıca, büyük node operatörlerinin **daha fazla pool staker ETH'sini** Beacon Chain'de ödüller kazanarak çalıştırmasına izin veriyor.
Bu, güvenlikten anlamlı bir taviz vermeden çalıştığı için herkes kazanıyor!

Bu kılavuzda üç konuyu ele alacağız:

- 8-ETH teminatlı minipool'ların gerçekte nasıl çalıştığı ve arkalarındaki ödül sayıları
- Yeni bir 8-ETH minipool nasıl oluşturulur
- _Mevcut_ bir 16-ETH minipool'un çıkmadan 8-ETH minipool'a nasıl geçirileceği

Her konu hakkında daha fazla bilgi edinmek için okumaya devam edin.

## 8-ETH Teminatlı Minipool'lar Nasıl Çalışır

Mekanik olarak, 8-ETH teminatlı minipool'lar protokoldeki diğer tüm minipool'larla **aynı şekilde** davranır.
Hala Beacon Chain'de bir validator'a "sahip" olurlar (o validator'ın çekim kimlik bilgilerini temsil ederler), hala bir komisyonla gelirler (ancak Atlas ile komisyon **tüm yeni minipool'lar için %14'te sabitlenecektir**) ve 16-ETH teminatlı bir minipool'un sağladığı tüm işlevselliği sağlarlar.
Fark tamamen sayılarda yatıyor.

### Ödüller

Karlılık perspektifinden (_sadece_ ETH ödüllerine bakarak ve RPL'yi göz ardı ederek), %14 komisyonlu 8-ETH teminatlı minipool'lar node operatörüne _16-ETH teminatlı %20 komisyonlu minipool'lardan_ bile (Redstone itibariyle mümkün olan en yüksek ödül konfigürasyonu) _daha fazla ödül_ sağlar.
Aynı zamanda, node operatörleri rETH sahiplerinin sermayesini daha verimli bir şekilde çalıştırdığı için _rETH sahiplerine_ de daha fazla ödül sağlarlar.

Açıklamak için basit bir örnekle ilerleyelim.
Diyelim ki stake etmek için 16 ETH'miz var (artı gerekli RPL teminatı).
Diyelim ki Beacon Chain'de validator başına 1 ETH ödül kazandık.
%20 komisyonlu tek bir 16-ETH minipool ile %14 komisyonlu iki 8-ETH minipool için matematik şu şekilde çalışır:

```
1x 16 ETH Minipool @ 20%:
Ödüller: 1 ETH
Node Payı = (16/32) + (16/32 * 0.2)
          = 0.5 + (0.5 * 0.2)
          = 0.5 + 0.1
          = 0.6 ETH

rETH Payı = 1 - 0.6
          = 0.4 ETH


2x 8 ETH Minipool @ 14%:
Ödüller: 2 ETH
Node Payı = ((8/32) + (24/32 * 0.14)) * 2
          = (0.25 + (0.75 * 0.14)) * 2
          = (0.25 + 0.105) * 2
          = 0.71 ETH

rETH Payı = 2 - 0.71
          = 1.29 ETH
```

Başka bir deyişle, bir node operatörü iki 8-ETH minipool ile %20 komisyonlu tek bir 16-ETH minipool'dan **%18 daha fazla ETH** kazanacaktır.

### RPL Teminatı

8-ETH minipool oluşturmak için node operatörlerinin hala node'ları için minimum teminat gereksinimlerini karşılayacak kadar RPL stake etmeleri gerekir (tüm minipool'larını ve tüm teminat boyutlarını hesaba katarak).

Bu kurallar Atlas ile netleştirildi:

- Minipool başına **minimum RPL**, **_ödünç alınan_ miktarın %10'udur**
- Minipool başına **maksimum RPL**, **_teminat_ miktarın %150'sidir**

16-ETH minipool için bu değişmeden kalır; minimum 1.6 ETH değerinde RPL, maksimum 24 ETH değerinde RPL'dir.

8-ETH minipool için bu, **minimum 2.4 ETH değerinde RPL** (ödünç alınan miktarın %10'u, yani 24 ETH) ve **maksimum 12 ETH değerinde RPL** (teminat miktarının %150'si) olur.

Bu sayılar Rocket Pool topluluğu tarafından [bir yönetişim oylamasının parçası olarak](https://vote.rocketpool.net/#/proposal/0x7426469ae1f7c6de482ab4c2929c3e29054991601c95f24f4f4056d424f9f671) seçildi.

## Yeni Bir 8-ETH Minipool Oluşturma

8-ETH teminatlı yeni bir minipool oluşturma süreci, 16-ETH minipool oluşturma süreciyle aynıdır.

Sadece aşağıdaki komutu çalıştırın:

```shell
rocketpool node deposit
```

Teminat miktarınız sorulduğunda `8 ETH` seçin:

```
Your eth2 client is on the correct network.

NOTE: by creating a new minipool, your node will automatically claim and distribute any balance you have in your fee distributor contract. If you don't want to claim your balance at this time, you should not create a new minipool.
Would you like to continue? [y/n]
y

Please choose an amount of ETH to deposit:
1: 8 ETH
2: 16 ETH
1

Your minipool will use the current fixed commission rate of 14.00%.
You currently have 8.00 ETH in your credit balance.
This deposit will use 8.000000 ETH from your credit balance and will not require any ETH from your node.
...
```

::: tip NOT
Bu örnek ayrıca [**yeni Deposit Credit Sisteminin**](../../node-staking/credit) kullanımını gösterir.
Node operatörünün kredi bakiyesinde 8 ETH olduğundan, bu 8-ETH minipool'u oluşturmak ücretsizdir!
:::

İşte bu kadar!
Sürecin geri kalanı [olağan minipool oluşturma talimatlarıyla](../../node-staking/create-validator.mdx) aynıdır.
