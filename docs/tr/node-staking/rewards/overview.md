---
next:
  text: Claiming Node Operator Rewards
  link: "/tr/node-staking/rewards"
---

# Genel Bakış

Bu bölüm, node'unuzun doğrulama yaparken ürettiği ödüllere nasıl erişeceğinizi kapsar.

## Ön Koşullar

Smartnode'unuzu yapılandırmadan önce, lütfen aşağıdakileri yaptığınızdan emin olun:

- Bir node makinesi (veya sanal makine) kurdunuz ve güvenliğini sağladınız ([Securing your Node](../securing-your-node) kılavuzu aracılığıyla)
- Üzerine Smartnode'u [kurdunuz](../installing/overview) ve [yapılandırdınız](../config/overview)
- Smartnode'unuza bir node wallet yüklediniz
- Execution ve Consensus istemcilerinizi senkronize ettiniz
- Node'unuzu [bir withdrawal adresi](../prepare-node.mdx#setting-your-withdrawal-address) ile sağladınız, [yedek istemcilerinizi](../fallback) kurdunuz (isteğe bağlı), [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool)'a katıldınız (isteğe bağlı) ve [MEV](../mev.mdx)'yi yapılandırdınız
- En az bir [minipool](../create-validator.mdx) oluşturdunuz

## Kılavuzlar

[Claiming Node Operator Rewards](../rewards), RPL ödüllerinin ve Execution-layer ödüllerinin nasıl çalıştığını ve bunlara nasıl erişeceğinizi açıklar.

[Distributing Skimmed Rewards](../skimming), protokol tarafından periyodik olarak "skimmed" edilen ve minipool'larınıza teslim edilen Beacon Chain'den ödüllere erişmeyi kapsar.
