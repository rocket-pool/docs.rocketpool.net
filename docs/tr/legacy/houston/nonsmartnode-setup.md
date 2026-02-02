# Smartnode kullanmayan kullanıcılar için oylama kurulumu

Bazı kullanıcılar (örn. Allnodes kullanıcıları) smartnode kullanmaz ve doğrudan sözleşme etkileşimi kullanarak oylama kurulumu yapmaları gerekebilir.
Bu kılavuz, bu tür kullanıcılar için hem minimum hem de tam kurulum kılavuzunu içerir.

::: tip
Node adresiniz bunun için bir donanım cüzdanına yüklenmiş olmalıdır.
:::

## Minimum kurulum kılavuzu

Bu, temsilcinizin sizin adınıza zincir üzerinde ve zincir dışında oy kullanmasına izin verir. Zincir üzerinde temsilcinizi geçersiz kılabileceksiniz, ancak zincir dışında değil.

- Bir temsilci ile oy gücünü başlatmak için etherscan kullanın (node adresiyle "Connect to Web3") https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Temsilcileri şu adreste bulabilirsiniz https://delegates.rocketpool.net/

## Tam kurulum kılavuzu

Oy gücünü başlatmak için etherscan kullanın (node adresiyle "Connect to Web3")

- [çoğu için önerilen] Temsilci olarak farklı bir node ile oylama başlat https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Temsilcileri şu adreste bulabilirsiniz https://delegates.rocketpool.net/
  - Temsilcilerinizi her zaman geçersiz kılabileceğinizi unutmayın
- Temsilci olarak kendi node'unuz ile oylama başlat https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Burada her seferinde oy vermekten sorumlu olacaksınız
  - Bu seçeneği çoğunlukla temsilci olmak isteyen kişilere öneriyorum çünkü onların her seferinde oy vermesi _gerekiyor_.
- Node'unuz Houston'dan sonra kaydedildiyse:
  - Oy gücünüz zaten kendi node'unuz temsilci olarak başlatılmış olacaktır
  - Yeni bir temsilci ayarlamak için https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 kullanabilirsiniz

Snapshot sinyal adresini ayarlayın:

- https://node.rocketpool.net/signalling-address adresine gidin ve node adresinizi bağlayın
  - İstediğiniz snapshot sinyal adresini girin ve ihtiyaç duyacağınız r, s ve v argümanlarını almak için mesajı imzalayın
  - Not: snapshot sinyal adresiniz node adresiniz OLMAMALIDIR
- Yeni bir sekmede https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2 adresine gidin
  - Node adresiyle "Connect to Web3"
  - Argümanları sinyal adresiniz ve önceki adımda verilen r, s, v parametreleri ile doldurun
