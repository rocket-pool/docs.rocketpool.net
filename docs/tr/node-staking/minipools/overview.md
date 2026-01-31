---
next:
  text: Yeni Bir Minipool (Validator) Oluşturma
  link: "/tr/node-staking/create-validator"
---

::: danger UYARI
Minipool yatırmaları şu anda Saturn 1 hazırlığı nedeniyle devre dışı bırakılmıştır.
:::

# Genel Bakış

Bu bölüm minipool'ları (Rocket Pool validator'ları) oluşturma ve taşıma süreçlerini kapsamaktadır.
Burada Ethereum ağını doğrulamaya nasıl başlayacağınızı ve bunun için ödüller kazanacağınızı öğreneceksiniz.

## Ön Koşullar

Minipool'ları çalıştırmadan önce lütfen şunlardan emin olun:

- Bir düğüm makinesi (veya sanal makine) kurdunuz ve güvenliğini sağladınız ([Düğümünüzü Güvence Altına Alma](../securing-your-node) kılavuzu ile)
- Smartnode'u üzerine [kurdunuz](../installing/overview) ve [yapılandırdınız](../config/overview)
- Smartnode'unuzda yüklenmiş bir düğüm cüzdanınız var
- Execution ve Consensus istemcilerinizi senkronize ettiniz
- Düğümünüzü [bir çekim adresiyle](../prepare-node.mdx#setting-your-withdrawal-address) sağladınız, [yedek istemcilerinizi](../fallback) kurdunuz (isteğe bağlı), [Smoothing Pool'a](../fee-distrib-sp#the-smoothing-pool) katıldınız (isteğe bağlı) ve [MEV](../mev.mdx)'yi yapılandırdınız

## Kılavuzlar

[Yeni Bir Minipool (Validator) Oluşturma](../create-validator.mdx) yeni bir Rocket Pool minipool'u ve Beacon Chain'de karşılık gelen validator oluşturma sürecini açıklar.
İster ilk minipool'unuzu oluşturuyor olun ister zaten bazılarına sahip olup bir tane daha yapmak istiyor olun, bu kılavuz sizi adım adım yönlendirecektir.

[Minipool Delegate](./delegates) minipool kontratının ne olduğunu biraz açıklar ve işlevselliğinin çoğunu içeren **delegate** kontratını tanıtır.
Ayrıca yeni özelliklerden yararlanmak için bir ağ yükseltmesinden sonra minipool'larınız için delegate'i nasıl güncelleyeceğinizi gösterir.

[Solo Validator'ı Minipool'a Dönüştürme](../solo-staker-migration) Rocket Pool dışındaki mevcut bir validator'ı (solo staking için kullandığınız gibi) Beacon Chain'den çıkmaya ve yeni bir minipool oluşturmaya gerek kalmadan doğrudan Rocket Pool minipool'una dönüştürme sürecini anlatır.
Bu özellikten yararlanmak isteyen bir solo staker iseniz, bu sizin için kılavuzdur!

[16-ETH Minipool'u 8-ETH'ye Taşıma](../leb-migration.mdx) bir minipool için bağlanmış ETH miktarının 16 ETH'den 8 ETH'ye nasıl düşürüleceğini gösterir, size ücretsiz olarak yeni bir minipool oluşturmak için kullanılabilecek 8 ETH kredi verir (elbette gas için hala ETH'ye mal olur).

[Yatırma Kredisi Sistemi](../credit) yukarıdaki taşıma işlemlerinden birini gerçekleştirdikten sonra ETH tahvilleri için ödeme yapmak zorunda kalmadan yeni minipool'lar oluşturmanıza olanak tanıyan "ETH Kredisi" sistemini kapsar.
