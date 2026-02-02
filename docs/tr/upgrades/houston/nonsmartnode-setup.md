# Smartnode olmayan kullanıcılar için oylama kurulumu

Bazı kullanıcılar (örneğin Allnodes kullanıcıları) smartnode kullanmazlar ve doğrudan sözleşme etkileşimi kullanarak oylama kurmaya ihtiyaç duyabilirler.
Bu kılavuz, bu tür kullanıcılar için hem minimal hem de eksiksiz bir kurulum kılavuzu içerir.

::: tip
Node adresiniz bunun için bir donanım cüzdanına yüklenmiş olmalıdır.
:::

## Minimal kurulum kılavuzu

Bu, delegenizin sizin adınıza on-chain ve off-chain oy kullanmasına izin verir. Delegenizi on-chain'de geçersiz kılabileceksiniz, ancak off-chain'de geçersiz kılamayacaksınız.

- Bir delege ile oy gücünü başlatmak için etherscan kullanın (node adresi ile "Connect to Web3") https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- Delegeleri https://delegates.rocketpool.net/ adresinde bulabilirsiniz

## Tam kurulum kılavuzu

Oy gücünü başlatmak için etherscan kullanın (node adresi ile "Connect to Web3")

- [çoğu için önerilir] Delege olarak farklı bir node ile oylamayı başlatın https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
  - Delegeleri https://delegates.rocketpool.net/ adresinde bulabilirsiniz
  - Delegelerinizi her zaman geçersiz kılabileceğinizi unutmayın
- Delege olarak kendi node'unuzla oylamayı başlatın https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
  - Burada her seferinde oy vermekten siz sorumlu olacaksınız
  - Bu seçeneği çoğunlukla delege olmak isteyen kişiler için önerirdim çünkü gerçekten her seferinde oy vermeleri _gerekiyor_.
- Node'unuz Houston sonrasında kaydedildiyse:
  - Oy gücünüz zaten kendi node'unuz delege olarak başlatılmış olacaktır
  - https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3 ile yeni bir delege belirleyebilirsiniz

Snapshot sinyalleme adresini ayarlayın:

- https://node.rocketpool.net/signalling-address adresine gidin ve node adresinizi bağlayın
  - İstediğiniz snapshot sinyalleme adresini girin ve ihtiyacınız olacak r, s ve v argümanlarını almak için mesajı imzalayın
  - Not: snapshot sinyalleme adresiniz node adresiniz OLMAMALIDIR
- Yeni bir sekmede, https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2 adresine gidin
  - Node adresi ile "Connect to Web3"
  - Argümanları sinyalleme adresiniz ve önceki adımda verilen r, s, v parametreleri ile doldurun
