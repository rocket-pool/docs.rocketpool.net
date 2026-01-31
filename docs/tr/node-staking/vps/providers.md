# Barındırma Sağlayıcısı Seçimi

Bu bölüme geldiyseniz, Rocket Pool node'u çalıştırmak istiyorsunuz ancak evinizde yerel olarak bir kurulum yapamıyorsunuz; bulutta barındırılan bir **sanal özel sunucuya (VPS)** ihtiyacınız var.
Böyle bir makine sağlayabilen birçok farklı hizmet bulunmaktadır ve bunlar iki farklı kategoriye ayrılır: VPS sağlayıcıları ve genel bulut sağlayıcıları.

Doğru olanı seçmek zor olabilir ve aralarındaki farkları anlamak çok önemlidir.
Bu kılavuzda, ayrıma biraz ışık tutacağız ve seçenekleriniz arasında gezinmenize yardımcı olmak için geçmişte diğer Rocket Pool kullanıcılarının kullandığı hizmetlerden bazılarını listeleyeceğiz.

## Geleneksel VPS Barındırma

Sanal özel sunucu, daha büyük bir fiziksel makinede bulunan bir sanal makinenin tek örneğidir.
En ucuz seçenektir ve her yerde kullanılan bulut platformlarından daha az sıklıkla kullanılırlar, bu nedenle Ethereum ağının merkeziyetsizliğine daha fazla katkıda bulunma eğilimindedirler.

Ancak, nadiren yüksek erişilebilirlik desteğine sahiptirler; fiziksel sunucu çökerse, üzerinde barındırılan VPS'nizin de çökmesi muhtemeldir.
Ayrıca, sabit bir kaynak ayak izine sahiptirler; genellikle CPU ve RAM gibi kaynakları talep üzerine artırmak veya azaltmak mümkün değildir.

10/2024 itibarıyla, iyi fiyatlı ve performanslı bir seçenek [Netcup](https://www.netcup.eu/vserver/vps.php)'tan RS 12000 G11 idi.
Bir uyarı, depolamanın başkalarıyla paylaşılmasıdır, bu nedenle depolama IOPs potansiyel bir darboğazdır.

## Özel Sunucu Barındırma

VPS'den farklı olarak, özel sunucu sizin tarafınızdan kiralanan tam bir fiziksel cihazdır. Nispeten uygun fiyatlı bir seçenektir ve her yerde kullanılan bulut platformlarından daha az sıklıkla kullanılırlar, bu nedenle Ethereum ağının merkeziyetsizliğine daha fazla katkıda bulunma eğilimindedirler.

10/2024 itibarıyla, iyi fiyatlı ve performanslı iki seçenek [OVH](https://us.ovhcloud.com/)'den Rise ve Advanced bare-metal sunuculardı. Zaman içinde değişen bunlardan çeşitli olanları ve önemli indirimler bulunmaktadır. [Donanım yönergelerinin](../local/hardware.md) karşılandığını kontrol etmeniz gerekir.

## Bulut Barındırma

Bulut barındırma, tek bir fiziksel makinede barındırılmak yerine birden fazla sunucunun dağıtılmış ağında bölünen sanal makineleri ifade eder.
Barındırma makinelerinden biri arızalanırsa, diğerleri sorunsuz bir şekilde onun yerine geçebilir, bu nedenle bu platformlarda kullanılabilirlik ve güvenilirlik son derece yüksek olma eğilimindedir.
Ayrıca esnek kaynak seçenekleri sunma eğilimindedirler; talep üzerine daha fazla CPU, RAM veya disk alanı eklemek nispeten basittir.

Bu ekstra faydalar nedeniyle, bulut tabanlı sunucular VPS çözümlerinden daha pahalı olma eğilimindedir.
Ayrıca çok popüler platformlardır, bu nedenle bunları kullanmak genellikle Ethereum ağının genel merkeziyetsizliğini azaltır.

3 ana bulut sağlayıcısı [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/) ve [Google Cloud Platform (GCP)](https://cloud.google.com/)'dur.
Fiyat ve merkezileşme endişeleri nedeniyle bulut barındırma kullanılmasını önermiyoruz.

## Önemli Hususlar

### Fiyat

Maliyet bir öncelik değilse, bulut barındırma çözümleri genellikle daha güvenli bir seçimdir.
Aşağıdaki bölümde maliyet tahminlerinin daha detaylı bir dökümü bulunmaktadır ancak burada bir VPS seçeneği ile bir bulut seçeneği arasında genel bir karşılaştırma bulunmaktadır:

- OVH Özel Sunucu: $90-160/ay
- Netcup VPS: $90/ay
