---
next:
  text: Starting Rocketpool
  link: "/tr/node-staking/starting-rp"
---

# Genel Bakış

Bu bölüm, Smartnode'u kurduktan ve yapılandırdıktan sonra düğümünüzü Rocket Pool ile staking için nasıl hazırlayacağınızın ayrıntılarını kapsar.
Staking ile ilgili kapsanacak çok fazla bilgi olduğu için uzun bir bölümdür, bu nedenle **lütfen ilk minipool'unuzu oluşturmadan önce her kılavuzu okuyun!**

## Ön Koşullar

Düğümünüzü staking için hazırlamadan önce, lütfen aşağıdakileri yaptığınızdan emin olun:

- Bir düğüm makinesi (veya sanal makine) kurun ve güvenliğini sağlayın ([Securing your Node](/tr/node-staking/securing-your-node) kılavuzu aracılığıyla)
- Smartnode'u üzerine [kurduğunuzdan](../installing/overview) ve [yapılandırdığınızdan](../config/overview) emin olun

## Kılavuzlar

[Starting Rocket Pool](../starting-rp) size her mod için Smartnode hizmetlerini nasıl başlatacağınızı ve Execution ve Consensus istemcilerinizin senkronizasyon ilerlemesini nasıl kontrol edeceğinizi gösterecektir.

[Creating a New Wallet](../wallet-init) eğer ilk kez bir düğüm kuruyorsanız Smartnode ile yepyeni bir cüzdan oluşturma sürecini anlatır.

[Importing / Recovering an Existing Wallet](../recovering-rp.mdx) yeni bir cüzdan oluşturmaya alternatiftir.
Halihazırda düğümünüze kurtarmak istediğiniz bir düğüm cüzdanınız varsa (veya Allnodes gibi bir hizmetten kendi donanımınıza geçiş yapıyorsanız) bu kılavuzu kullanın.

[Preparing your Node for Operation](../prepare-node.mdx) düğümünüze bir cüzdan yüklediğinizde, herhangi bir ETH veya RPL ile fonlamadan (tabii ki gaz maliyetleri için küçük miktarda ETH hariç) çok önce atmak isteyeceğiniz bazı önemli ilk adımları kapsar.

[Specifying a Fallback Node](../fallback) düğümünüzü, birincil istemcileriniz herhangi bir zamanda çökerse yedek olarak hareket edebilecek ikinci bir (harici olarak yönetilen) Execution ve Consensus istemci çiftine yönlendirme isteğe bağlı sürecini anlatır, böylece onlar üzerinde bakım yaparken düğümünüz doğrulamaya devam edebilir.

[Fee Distributors and the Smoothing Pool](../fee-distrib-sp) doğrulayıcılarınızdan biri bir blok önerdiği her seferde Execution katmanı ödüllerinin düğümünüze nasıl sağlandığını, bu ödülleri nasıl toplayacağınızı tartışır ve Rocket Pool'un **Smoothing Pool**'unu açıklar - herkesten Execution katmanı ödüllerini birleştiren ve Rocket Pool'un düzenli ödül aralıklarında eşit olarak dağıtan popüler bir özellik.

[MEV, MEV-Boost, and MEV Rewards](../mev.mdx) **Maximum-Extractable Value** (MEV), staking ekosistemindeki rolünü ve Smartnode kullanarak bunu istediğiniz gibi nasıl yapılandırabileceğinizi açıklar.
