# Selección de Hardware de Staking

No hay especificaciones oficiales para ejecutar un nodo de Rocket Pool.
Esta página ofrece algunas pautas y ejemplos que puedes usar para seleccionar hardware de staking.

Los requisitos mínimos de hardware de tu nodo dependerán de los clientes de Consenso y Ejecución que elijas.
Si, por ejemplo, tienes la intención de ejecutar tu nodo en un dispositivo de baja potencia, es posible que estés limitado a usar `Geth` como tu cliente de Ejecución y `Nimbus` como tu cliente de Consenso.
Si estás usando un NUC más potente con 32+ GB de RAM, todas las combinaciones de clientes están abiertas para ti.

Las pautas a continuación asumen que deseas un nivel **cómodo** de hardware, lo que significa que tienes capacidad en exceso.
Si tienes en cuenta estas pautas, tu nodo tendrá muchos recursos para ejecutar cualquiera de las combinaciones de clientes admitidas por Rocket Pool.
Esto te permitirá elegir un par de clientes `random`, lo cual es muy importante para la diversidad de clientes en la red Ethereum.

::: tip NOTA
El staking de Ethereum es muy indulgente.
Si tu casa se inunda y tu dispositivo de staking se fríe, no hay una gran penalización por tomarte una semana para volver a funcionar (a menos que estés en un comité de sincronización, lo cual es un evento muy raro).
La falla de componentes puede ocurrir en algún momento, pero no te estreses por eso.
El tiempo de inactividad no te hace recortar a menos que estés fuera de línea durante una interrupción importante de toda la red Ethereum.
:::

## Requisitos de Hardware

Los validadores de Ethereum no son muy costosos computacionalmente, es decir, una vez que tus clientes de Ejecución y Consenso estén en funcionamiento, cualquier validador adicional usará **una cantidad muy pequeña de recursos adicionales**.
Esto crece hasta 64 validadores, momento en el cual los recursos requeridos para agregar un 65º validador y más allá son insignificantes.

En nuestra experiencia, la mayoría de las configuraciones, incluidas las mini-PC y NUC, son capaces de ejecutar un número efectivamente ilimitado de validadores.

### Requisitos de CPU

**Pauta: cualquier CPU moderna con al menos 4 hilos.**

Ejecutar un nodo de Rocket Pool no es muy intensivo computacionalmente.
El mayor impacto de la CPU es qué tan rápido tu nodo puede sincronizar inicialmente el estado de la blockchain cuando lo creas por primera vez (o si alguna vez cambias de cliente más tarde).
Después de la sincronización inicial, la CPU no se usa con tanta intensidad.

El nombramiento de CPU puede ser engañoso; un Intel Core i5 de 2010 suele ser **menos potente** que un core i3 de 2022.
Muchos miembros de la comunidad usan dispositivos Intel NUC debido a su pequeño factor de forma, pero un i5 NUC antiguo puede ser una peor opción que un i3 nuevo.
Por esta razón, recomendamos usar una CPU "moderna" que tenga, como máximo, unos pocos años de antigüedad.
Más específicamente, **para CPUs basadas en x64**, recomendamos una CPU que admita la extensión [BMI2](<https://en.wikipedia.org/wiki/X86_Bit_manipulation_instruction_set#BMI2_(Bit_Manipulation_Instruction_Set_2)>) - verifica las especificaciones del fabricante de tu CPU para ver si es compatible.
No todas las CPUs modernas la admiten; por ejemplo, las CPUs Celeron tienden a no incluirla.

Las CPUs basadas en ARM (como la Mac M1 o M2, o la Rock 5B) no aplican a la extensión BMI2 anterior.

::: tip NOTA
Si estás interesado en usar un NUC, puedes saber qué tan moderno es el NUC por su número de modelo.
Tienen el formato `NUC` + `número de generación` + `modelo` + `tipo de CPU` + `sufijo`.
Por ejemplo, una unidad `NUC11PAHi50Z` es una unidad i5 de 11ª generación.
Puedes ver una lista de NUCs [aquí](https://www.intel.com/content/www/us/en/products/details/nuc/kits/products.html) en el sitio web de Intel.

Otras mini-PC, como la Asus PN50 o PN51, no siguen esta convención, pero la información sobre qué CPU usan debe incluirse en sus páginas de producto.
:::

La cantidad de núcleos en una CPU es menos relevante que su **número de hilos**.
Recomendamos un **mínimo de 4 hilos** para la operación de nodo de Rocket Pool.
Una CPU de 2 núcleos con 4 hilos funcionará sin problemas.
Es raro encontrar una CPU con solo 2 hilos.

### Requisitos de RAM

**Pauta: al menos 16 GB de RAM, 32 GB preferido, DDR4 preferido**

Los nodos de Rocket Pool pueden operar con tan solo 16 GB de RAM.
Generalmente recomendamos tener un poco más para ofrecer algo de margen y soporte completo para clientes pesados en RAM como Teku.
Un beneficio adicional de más RAM es que puedes proporcionar un tamaño de caché más grande al cliente de Ejecución, lo que tiende a ralentizar la tasa de uso de tu espacio en disco.

### Requisitos de SSD

**Pauta: un SSD de 2+ TB que tenga TLC o mejor, con caché DRAM. NVMe preferido.**

Este elemento es más importante de lo que la mayoría de la gente espera.
El cliente de Ejecución depende en gran medida de IOPS, u "operaciones por segundo"; recomendamos 15k Read IOPS y 5k Write IOPS
En la práctica, esto significa que:

- Las unidades HDD (disco giratorio) no funcionarán
- Los SSD SATA o USB 3.0+ externos _pueden_ funcionar
- Las unidades SSD NVMe son preferidas

Si ya tienes un SSD que deseas usar y quieres asegurarte de que tenga un rendimiento suficiente para la operación del nodo.

_\* Si no estás seguro de si tu disco cumple con estos requisitos de rendimiento, `fio` es una buena manera de probarlos.
Consulta [aquí](https://arstech.net/how-to-measure-disk-performance-iops-with-fio-in-linux/) para instrucciones de Linux,
y [aquí](https://www.nivas.hr/blog/2017/09/19/measuring-disk-io-performance-macos/) para instrucciones de MacOS._

:::tip NOTA
¡La selección de SSD puede ser una elección compleja!

El método que usan los SSD para almacenar datos en sus chips flash tiene un impacto notable en la velocidad y longevidad.
Al comprar un SSD, es posible que notes etiquetas como `QLC`, `TLC` o `SLC`.
Estas representan la cantidad de datos contenidos dentro de una sola celda del chip flash: `Q` de "quad" significa 4, `T` de "triple" significa 3, `M` de "multi" significa 2, y `S` de "single" significa 1.

Recomendamos unidades **TLC, MLC o SLC**.
**No recomendamos unidades QLC** debido a su rendimiento más lento y menor confiabilidad total.

Los SSD vienen con o sin DRAM, que es un elemento de hardware que hace que acceder a los datos en el SSD sea más eficiente.
Aquellos con DRAM son más rápidos, pero aquellos sin DRAM son más baratos.
Sin embargo, DRAM es bastante importante para proporcionar una operación de nodo fluida.

Recomendamos una unidad con caché **DRAM**.
**No recomendamos unidades sin DRAM**.
:::

La consideración final es el tamaño de la unidad.
A partir de 10/2024, el tamaño de la base de datos del cliente de ejecución `geth` requiere aproximadamente 1.2TB de espacio después de terminar su sincronización inicial (o después de que acabas de terminar de podarlo).
Esto crecerá constantemente con el tiempo, y aunque la poda puede recuperar algo de ese espacio, el estado recién podado _sí_ crece con el tiempo.
Tendrás tranquilidad con una unidad más grande.

### Accesorios Comunes

Muchos operadores de nodo mejoran sus configuraciones más allá de los requisitos mínimos.
Algunas adiciones comunes incluyen:

- Disipadores de calor para SSD para extender la vida útil de la unidad
- Fuentes de alimentación ininterrumpida (UPS) en caso de cortes de energía
- Un nodo de respaldo para tener un backup en caso de que algo falle

Todos estos son convenientes de tener, pero no son necesarios para ejecutar un nodo de Rocket Pool.

## Configuraciones de Ejemplo

En esta sección, mostraremos algunas de las construcciones variadas que la comunidad de Rocket Pool ha creado para sí mismos.
Son ejemplos de lo que la gente está usando, no recomendaciones de cómo debes ejecutar tu configuración.
Ten en cuenta que muchos están algo desactualizados y, por ejemplo, usan SSD que ahora son demasiado pequeños.

### Servidor de Xer0

![](./images/Xer0.jpg)

El usuario de Discord **Xer0** está entre los muchos stakers que optaron por un factor de forma de PC convencional para su máquina de staking.
Querían construir un equipo que dure años y años sin requerir mantenimiento ni actualizaciones mínimas, al tiempo que ofrece una personalización completa de cada componente.
Con ese fin, Xer0 diseñó y construyó un servidor ATX completo - muy parecido a una PC de escritorio tradicional, pero dirigido exclusivamente al staking en Ethereum.
Su configuración incluye un Xeon Bronze 3204 de seis núcleos (1.9 GHz), 8 ranuras DDR4 y una ranura M.2... aunque dado que esto es esencialmente una construcción de servidor doméstico, los componentes exactos dependen completamente del usuario final.

Configuración de Xer0:

- Placa base: [Supermicro X11SPI-TF](https://www.newegg.com/supermicro-mbd-x11spi-tf-o-intel-xeon-scalable-processors-single-socket-p-supported-cpu-tdp-suppor/p/1B4-005W-00153) ($440)
- CPU: [Xeon Bronze 3204](https://www.amazon.com/Intel-BX806954216-Bronze-1-9GHz-FC-LGA14B/dp/B07RTBMWVJ) ($248)
- RAM: [NEMIX 2x32GB DDR4 ECC 2933MHz](https://www.amazon.com/2x32GB-DDR4-2933-PC4-23400-Registered-Memory/dp/B07V1YG2VV) ($359)
- SSD: [Sabrent 2TB Rocket M.2 2280 SSD](https://www.newegg.com/sabrent-rocket-2tb/p/14R-00X6-00007) ($250)
- Caja: [SilverStone HTPC ATX GD07B](https://www.amazon.com/dp/B007X8TQW0) ($172)
- PSU: [EVGA SuperNova 650 G3, 80+ Gold](https://www.newegg.com/evga-supernova-g3-series-220-g3-0650-y1-650w/p/N82E16817438094) ($111)
- Enfriador: [Noctua NH-D9 DX-3647 4U](https://www.amazon.com/Noctua-NH-D9-DX-3647-4U-Premium/dp/B07DPQJH5J) ($100)
- **Total: $1680**

Estos son los comentarios de Xer0 sobre por qué eligieron esta configuración:

_Obviamente no hay necesidad de construir una monstruosidad simplemente para hacer staking en la red Ethereum, pero tengo algunas razones por las que construí algo así._

1. _Ahora creo que 1 o más validadores en el futuro valdrán mucho más de lo que estamos viendo ahora mismo, así que quería comprar algo que pueda soportar la red durante al menos los próximos 10-20 años sin problemas._
1. _Al crear una máquina que tiene tantos núcleos, también me he dado mucho más margen hasta el punto de que podría ejecutar un agregador L2 encima de esto sin ningún problema (con respecto al hardware) y cualquier otra cosa que quiera ejecutar en un servidor._ :)
1. _Me gusta construir computadoras, y así que la construí…_
1. _Con una construcción de servidor, me da mucha más flexibilidad con hardware y características que la mayoría de las computadoras no tienen de forma nativa._
1. _Un poco a prueba de futuro (por si acaso)_ :wink:

### Estante de Darcius

![](./images/Darcius.jpg)

El fundador de Rocket Pool, David Rugendyke (conocido en Discord como **darcius**), pasó mucho tiempo perfeccionando su nodo.
Después de cierto debate, construyó un Mini-ITX que es pequeño y portátil, pero aún tiene una enorme cantidad de potencia de procesamiento.
Su equipo incluye un Ryzen 7 5800x de 8 núcleos (3.8 GHz), dos ranuras DDR4 y dos ranuras M.2 para SSD NVMe.
Es verdaderamente uno de los equipos de más alto rendimiento de los nodos de Rocket Pool, pero con buena razón: darcius ejecuta un tipo especial de nodo de Rocket Pool llamado Nodo Oracle, que transmite información de la Beacon chain de vuelta a la cadena de Ejecución sobre todos los validadores de Rocket Pool.
Con miles de minipools de Rocket Pool activos para monitorear, ese trabajo requiere mucha potencia... pero su equipo de estante está fácilmente a la altura de la tarea.

Configuración de Darcius:

- Placa base: [MSI MPG B550I Mini-ITX AMD](https://www.newegg.com/msi-mpg-b550i-gaming-edge-wifi/p/N82E16813144323) ($200)
- CPU: [AMD Ryzen 7 5800x](https://www.newegg.com/amd-ryzen-7-5800x/p/N82E16819113665) ($490)
- RAM: [Corsair Vengeance RGB Pro 2x16GB DDR4 3600MHz](https://www.newegg.com/p/0RN-00P8-000A5) ($390)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- Caja: [SilverStone SST-SG13B Mini-ITX](https://www.amazon.com/SilverStone-Technology-Mini-ITX-Computer-SST-SG13WB-USA/dp/B07MNC3JCB) ($52)
- PSU: [SilverStone Strider Platinum 550W](https://www.newegg.com/silverstone-strider-platinum-series-ps-st55f-pt-550w/p/N82E16817256154) ($140)
- **Total: $1587**

### Construcción microATX de Yorick

![](./images/Yorick-stock.jpg)

El entusiasta veterano de hardware **YorickDowne** tiene mucha experiencia construyendo y manteniendo servidores.
Usando ese conocimiento, se ha decidido por una configuración microATX flexible.
Su máquina es considerablemente más pequeña que una PC típica, pero aún logra incorporar tecnología de grado servidor que maximiza la resistencia y el tiempo de actividad - métricas clave al ejecutar un nodo de Rocket Pool.
Tiene recomendaciones tanto para configuraciones Intel como AMD, que puedes encontrar [en su sitio web](https://eth-docker.net/docs/Usage/Hardware).
La versión Intel usa un i3-9100F de cuatro núcleos (3.6 GHz) o una CPU Xeon, y la versión AMD sugiere cualquier CPU Ryzen que admita memoria ECC.
Para ambas configuraciones, sugiere 16 GB de RAM ECC y un SSD NVMe de 1 TB.

Configuración de Yorick:

- Placa base: [SuperMicro X11SCL-F-O](https://www.newegg.com/supermicro-mbd-x11scl-f-o-8th-generation-intel-core-i3-pentium-celeron-processor-intel-xeon-pro/p/N82E16813183671) ($200)
- CPU: [Intel i3-9100F](https://www.newegg.com/intel-core-i3-9th-gen-core-i3-9100f/p/N82E16819118072) ($150)
- RAM: [Samsung 1x16GB DDR4 ECC UDIMM 2400MHz](https://www.newegg.com/samsung-16gb-288-pin-ddr4-sdram/p/1WK-002G-00080) ($100)
- SSD: [Samsung 970 EVO Plus 1TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-1tb/p/N82E16820147743?Item=N82E16820147743) ($165)
- Caja: [SilverStone Micro ATX HTPC Case ML04B-USA](https://www.amazon.com/Silverstone-Technology-Aluminum-Center-ML04B-USA/dp/B07PD8CL7P/) ($110)
- PSU: Cualquiera (ejemplo: [Seasonic PRIME Fanless PX-500 Platinum 500W](https://www.newegg.com/seasonic-prime-fanless-px-500-500w/p/N82E16817151234)) ($161)
- Ventiladores de caja: Cualquiera
- **Total: Alrededor de $886**

Estos son los comentarios de Yorick sobre por qué eligió esta configuración:

- _Está al mismo precio o más bajo que algunos NUCs_
- _Tiene RAM ECC, lo que significa que si la memoria falla - lo cual sucede de vez en cuando - lo sabré, porque el sistema me lo dirá. No tengo que ejecutar memtest87 durante 4-5 días para averiguar si mi problema con la inestabilidad está relacionado con la memoria. Protejo mi tiempo ferozmente para poder pasarlo pontificando en Discord en lugar de solucionando problemas de hardware_
- _Tiene IPMI, que es gestión remota vía Ethernet/navegador de toda la máquina, incluida UEFI y ciclo de energía. Se me debe permitir ir de vacaciones extendidas y aún tener acceso remoto completo._
- _Si quiero almacenamiento redundante para que la eventual falla del SSD sea un no-evento, puedo hacerlo_
- _Permite una gran flexibilidad en las opciones de construcción. Puedo elegir la cantidad de RAM y computación que quiero; puedo elegir ejecutar un NAS con tecnología de virtualización como TrueNAS Scale y ejecutar el nodo allí junto con algunas otras cosas de servidor doméstico._

### Laptop de Drez

![](./images/Drez.jpg)

A veces, gastar en hardware nuevo simplemente no tiene sentido.
En el caso del usuario de Discord **Drez**, ejecutar un nodo de Rocket Pool es uno de esos momentos.
Drez tenía una laptop de repuesto por ahí, y la convirtió en un nodo con facilidad.
Su máquina viene con un i7-4710HQ de cuatro núcleos (2.5 GHz), dos ranuras DDR3 y una ranura SATA de 2.5".
Al ser una laptop, también viene con su propia batería (lo que compensa la necesidad de un UPS).
Agregaron algunas actualizaciones adicionales con el tiempo, dando a la laptop aún más potencia para mayor tranquilidad.

Configuración de Drez:

- Laptop: [MSI GE70 2PE Apache Pro](https://www.msi.com/Laptop/GE70-2PE-Apache-Pro/Specification) ($1800)
- RAM: 2x8GB DDR3 1333Mhz (Incluida)
- SSD: [Samsung 860 EVO 1TB 2.5" SATA](https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T) ($110)
- **Total: $1910**

Estos son los comentarios de Drez sobre por qué eligieron esta configuración:

_La razón principal por la que voy a hacer staking en esta laptop es porque ya tenía una de repuesto y no necesito gastar dinero extra en un servidor nuevo.
Me gusta su movilidad, compacidad, pantalla integrada para un monitoreo fácil.
En caso de sobrecalentamiento compré una base de enfriamiento para laptop y un enfriador de CPU de repuesto por si acaso, también recomiendo cambiar la pasta térmica especialmente si vas a ejecutarlo en una máquina más antigua_

## NUCs (Next Unit of Computing) y Mini-PCs

Ejecutar un nodo de Rocket Pool no requiere necesariamente un escritorio completo de construcción propia.
De hecho, una de las configuraciones más populares entre los stakers es el ilustre NUC.
Un NUC (Next Unit of Computing) es esencialmente una computadora pequeña y autónoma que está diseñada para un consumo de energía muy bajo y máxima eficiencia.
Los NUCs son excelentes para la mayoría de los stakers que solo ejecutan algunos validadores debido a su bajo mantenimiento, bajos costos de funcionamiento mensuales y facilidad de configuración.
A diferencia de las PC, los NUCs vienen preensamblados en una caja; ¡todo lo que necesitas hacer es agregar RAM, agregar un SSD y estás listo!
A continuación hay algunos ejemplos de configuraciones de NUC que algunos veteranos de Rocket Pool usan y recomiendan.

::: tip NOTA
**Compatibilidad del Adaptador Ethernet**

Si planeas comprar un Intel® NUC de 11ª o 12ª Generación, puedes encontrar problemas de conectividad con el adaptador ethernet, específicamente si el adaptador se identifica como **I225-LM** (Verifica las especificaciones de Intel antes de comprar).
Si ya tienes uno, hay pasos que puedes tomar para abordar esta preocupación.
El adaptador I225-LM ha sido asociado con ciertos desafíos de compatibilidad que pueden llevar a **congelamientos del sistema** y comportamiento inesperado del kernel, particularmente cuando se usan kernels de Linux.

Para determinar si tu NUC emplea el problemático adaptador ethernet I225-LM, puedes usar el siguiente comando en la terminal:

```shell
sudo lshw -class network | grep 225
```

Si la salida confirma la presencia del adaptador I225-LM, es posible que experimentes los problemas mencionados. Sin embargo, hay _remedios_ que puedes aplicar para mitigar estos problemas:

**Adaptador USB-C a Ethernet**: Una solución viable implica adquirir un adaptador USB-C a Ethernet y conectar tu cable de internet a través de este adaptador externo. Si bien este enfoque requiere hardware y configuración adicionales, ha demostrado ser efectivo para resolver los conflictos de compatibilidad. Esto te permite utilizar los últimos kernels de Linux disponibles sin encontrar los congelamientos o anomalías relacionadas con el kernel asociadas con el adaptador I225-LM.**Esta es la solución recomendada (por ahora) si ya tienes un NUC con el I225-LM** _Ten en cuenta que optar por un adaptador puede introducir una compensación en términos de latencia potencial o velocidad de internet reducida. Para mitigar este impacto, es aconsejable seleccionar un adaptador con al menos 1GB/s de portabilidad, ayudando así a mantener tasas de transferencia de datos óptimas._

**Actualizaciones de Driver y Software**: Considera actualizar tus drivers, firmware y BIOS consultando la página oficial de soporte de Intel® para tu modelo de NUC [aquí](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads). Esto podría incluir usar el último driver de soporte disponible del sitio web de Intel o aplicar actualizaciones de BIOS que aborden preocupaciones de compatibilidad.

**Parche de Intel (Windows)**: Intel ha lanzado un parche para abordar un problema similar en sistemas Windows. Si bien el parche en sí **puede no aplicarse directamente a entornos Linux**, destaca el reconocimiento del problema por parte de Intel y sus esfuerzos para proporcionar soluciones. Puedes encontrar más detalles sobre el parche en este [enlace](https://www.intel.com/content/www/us/en/download/705968/patch-for-a-modern-standby-lan-issue-on-intel-nuc-11th-12th-generation-products.html?wapkw=nuc11tnhi3).

Ten en cuenta que la tecnología evoluciona, y las soluciones pueden cambiar con el tiempo. Mantente siempre actualizado con los últimos recursos proporcionados por Intel para tu modelo específico de NUC en su página oficial de Descargas [aquí](https://www.intel.com/content/www/us/en/search.html?ws=text#sort=relevancy&f:@tabfilter=[Downloads]).

Al seguir estos pasos, puedes abordar los desafíos de compatibilidad asociados con el adaptador ethernet I225-LM en productos Intel® NUC de 11ª y 12ª Generación, asegurando una experiencia más fluida y confiable con tu implementación de servidor. _Si bien un subconjunto de usuarios de NUC con este adaptador ha informado no experimentar problemas, es importante tener en cuenta que la **mayoría de los usuarios**, particularmente después de una actualización de kernel, han encontrado problemas. Notablemente, los kernels 5.15.+ han demostrado ser la opción más estable para aquellos que usan el adaptador I225-LM. Si la idea de usar un adaptador USB-C no es atractiva y estás dispuesto a asumir el riesgo de posibles congelamientos aleatorios, es aconsejable **permanecer en una versión de kernel que haya demostrado mayor estabilidad**._
:::

### NUC8i5BEK de Ken

![](./images/Ken.jpg)

El NUC8i5BEK es uno de los NUCs propios de Intel con un procesador de 8ª generación.
Lanzado en 2018, este modelo viene con una CPU i5-8259U de cuatro núcleos (2.30 GHz), dos ranuras DDR4, una ranura M.2 para SSD y puertos USB 3.1.
Normalmente consume alrededor de 20 vatios, pero el usuario de Discord **Ken** ha podido optimizarlo hasta 9 vatios durante la validación normal.
Es más que capaz de manejar cualquier cliente de Ejecución y cualquier cliente de Consenso, convirtiéndolo en una excelente opción para una máquina de nodo ligera y eficiente.

Configuración de Ken:

- Base: [Intel NUC8i5BEK](https://www.amazon.com/Intel-NUC-Mainstream-Kit-NUC8i5BEK/dp/B07GX67SBM) ($349)
- RAM: [Dell Memory Upgrade - 1x16GB DDR4 SODIMM 3200MHz](https://www.dell.com/en-us/shop/dell-memory-upgrade-16gb-1rx8-ddr4-sodimm-3200mhz/apd/ab371022/memory) ($112)
- SSD: [ADATA XPG S7 Series 2TB M.2 2280 NVMe SSD](https://www.amazon.com/XPG-S7-Gen3x4-Solid-State/dp/B08BDZQJP5) ($230)
- Caja sin ventilador (opcional): [AKASA Turing Fanless case](https://www.amazon.com/Akasa-Compact-fanless-Generation-NUC45-M1B/dp/B07RTBF1SY) ($134)
- **Total: $691 a $825**

Estos son los comentarios de Ken sobre por qué eligió esta configuración:

- _Tamaño pequeño y huella, la fuente de alimentación es un ladrillo en el cable de alimentación (como una laptop), computadora de una sola placa, arquitectura x86, bajo precio de compra, bajo consumo de energía (~10W), garantía de 3 años y una línea de productos de fabricación activa (Intel)._
- _Las generaciones 8 son lo suficientemente rápidas y a un punto de precio más bajo que los chips de última generación._
- _Actualicé a una caja sin ventilador (enfriada pasivamente), por lo que el NUC es absolutamente silencioso (0 dB) ya que lo dejo en mi oficina en casa (un NUC de fábrica ya está casi silencioso)._
- _Además, no hay desgaste mecánico en los rodamientos del ventilador._
- _Valor de reventa o reutilización si decido retirar esta plataforma de hardware como mi nodo RP - los NUC son excelentes como computadora de estación de trabajo._

### NUC10i7FNH de GreyWizard

![](./images/GreyWizard.jpg)

El NUC10i7FNH es otro de los NUCs propios de Intel.
Este tiene un procesador de 10ª generación y fue lanzado en 2019.
Viene con una CPU i7-10710U de seis núcleos (1.10 GHz, aumenta hasta 4.7 GHz), dos ranuras DDR4, una ranura M.2 y una ranura de 2.5" para SSD, y puertos USB 3.1.
Consume alrededor de 20 vatios de potencia.
Es una máquina increíblemente poderosa, dado su consumo de energía y tamaño.
El usuario de Discord **GreyWizard** usa este NUC para su nodo - la potencia extra le da tranquilidad sabiendo que sin importar lo que depare el futuro de la cadena Ethereum 2.0, su máquina podrá manejarlo.

Configuración de GreyWizard:

- Base: [Intel BXNUC10I7FNH1](https://www.newegg.com/intel-bxnuc10i7fnh1/p/N82E16856102227) ($445)
- RAM: 2x [Samsung M471A4G43MB1 32GB DDR4 SODIMM 2666 MHz](https://www.newegg.com/samsung-32gb-260-pin-ddr4-so-dimm/p/0RM-002H-00156) ($154 cada uno)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1068**

Estos son los comentarios de GreyWizard sobre por qué eligió esta configuración:

_Fui con el NUC i7 principalmente porque sentí que era la mejor combinación de rendimiento destacado en relación con el tamaño general y los gastos generales.
También miré otras opciones como construir una máquina de tamaño Micro ATX.
Después de evaluar el precio de una con las especificaciones que estaba buscando, este NUC de Intel terminó siendo aproximadamente el mismo precio, y el factor de forma es realmente difícil de superar.
Me gusta tener el margen extra de rendimiento/tranquilidad, y reconozco que esto es casi con seguridad exagerado.
Considero el staking como una inversión seria y no quiero preocuparme si mi hardware será suficiente._

_Consejos para otras personas que consideran esto como una opción..._

- _El NUC funciona bastante caliente, temperaturas similares a una laptop. Si te preocupa la temperatura de la CPU y quieres algo potente, entonces deberías mirar configuraciones de escritorio pequeñas como Micro ATX._
- _Querrás asegurarte de que haya mucho espacio alrededor de tu NUC para el flujo de aire. Planea limpiar el área regularmente para evitar la acumulación de polvo._
- _Asegúrate de verificar la compatibilidad de tus tarjetas de RAM. Los diferentes NUC admiten diferentes grados de RAM total, velocidades de RAM, etc._
- _Si vas con el NUC, sugeriría que te des espacio para crecer al seleccionar RAM... Por ejemplo, gasta un poco más y obtén una sola tarjeta de RAM de 32gb en lugar de 2x16 para que puedas expandirte más tarde si quieres (asumiendo que tu NUC admita 64gb en este ejemplo)_
- _No dudes en comunicarte conmigo en Discord si deseas discutir._

### Video del Proceso de Construcción del NUC10i5FNHN de ArtDemocrat

Para complementar las descripciones de configuración y consejos de Greywizard, ArtDemocrat creó este video del proceso de construcción como un recurso de ayuda adicional para configurar un NUC10 (en este caso un NUC10i5FNHN, pero el proceso de construcción debería ser similar para un NUC10i7FNH):

<video controls="controls" src="https://cdn-rocketpool.s3.us-west-2.amazonaws.com/NUC_Staking_Setup_-_ArtDemocrat.mp4" />

Configuración de ArtDemocrat:

- Base: [Intel NUC NUC10i5FNHN (Barebone)](https://www.jacob.de/produkte/intel-nuc-nuc10i5fnhn-bxnuc10i5fnhn-artnr-7103179.html) ($300)
- RAM: 1x [Crucial 32GB DDR4-3200 SODIMM](https://www.amazon.de/dp/B07ZLC7VNH) ($65)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.amazon.de/dp/B07MLJD32L) ($107)

### PN50 de Actioncj17

![](./images/PN50-actioncj17.jpg)

El ASUS PN50 es una mini-PC, que comparte mucho en común con la familia NUC de Intel.
Tiene un factor de forma muy pequeño pero tiene todos los componentes y características de una PC completa.
Viene con tu elección de CPU AMD para que puedas equilibrar entre rendimiento y costo (hasta un Ryzen R7-4700U de 8 núcleos a 2.0 GHz), dos ranuras DDR4, una ranura M.2 y una ranura de 2.5" para SSD, y puertos USB 3.1.
También viene con una fuente de alimentación de 90 vatios, aunque en la práctica no requiere tanta potencia mientras actúa como un nodo de Rocket Pool.
El usuario de Discord **actioncj17** ha probado varias configuraciones diferentes, pero prefiere el PN50 sobre todo... aunque admiten felizmente que es exagerado para ejecutar un nodo de Rocket Pool.

Configuración de Actioncj17:

- Base: [ASUS PN50 4700u](https://www.newegg.com/asus-pn50-bbr066md/p/N82E16856110206) ($583)
- RAM: [HyperX Impact 2x16GB DDR4 SODIMM 3200MHz](https://www.newegg.com/hyperx-32gb-260-pin-ddr4-so-dimm/p/N82E16820104836) ($220)
- SSD: [Samsung 970 EVO Plus 2TB M.2 2280 NVMe SSD](https://www.newegg.com/samsung-970-evo-plus-2tb/p/N82E16820147744) ($315)
- **Total: $1118**

Estos son los comentarios de actioncj17 sobre por qué eligieron esta configuración:

_Mi respuesta a por qué elegí el Asus PN50 es bastante simple.
Quería ver qué tan increíble era el Ryzen 7 4700U de AMD.
Digamos que no estoy decepcionado.
De hecho, comencé con el Intel NUC10FNK.
Puse 32gb de RAM y 1tb 970 evo plus nvme m.2 en el nuc y funciona increíble.
No tengo quejas con el nuc y funciona bien, pero obtengo más de mi PN50.
Diría que ambas configuraciones son exageradas para hacer staking en Rocketpool, pero un poco de protección contra el futuro no hace daño.
Ambos tienen huellas pequeñas y el nuc es en realidad mucho más silencioso ya que no tiene ventilador.
En general, el PN50 tiene mejor relación calidad-precio si puedes conseguir uno._

### Mini-PC de Moralcompass

![](./images/moralcompass-minipc.jpg)

El usuario de Discord **moralcompass** fue por una ruta similar a actioncj17 al seleccionar una mini-PC, pero su preferencia es por una CPU Intel.
Usan una mini PC que tiene un i5 8250U de cuatro núcleos (1.6 GHz, aumenta hasta 3.4 GHz), una ranura DDR4, una ranura M.2 y una ranura de 2.5" para SSD, y puertos USB 3.0.
Moralcompass afirma que solo consume alrededor de 10 vatios de la pared, lo que demuestra que las mini PC como esta son muy eficientes.
Lo interesante de esta elección es que está completamente enfriada pasivamente - ¡no hay ventiladores!
Si bien hay muchas variaciones de mini PC sin ventilador, moralcompass encontró una que funcionó para ellos y se ha mantenido con ella.

Configuración de Moralcompass:

- Base: [Partaker Fanless Mini PC - i5 8250U](https://www.aliexpress.com/item/1005001867740130.html?spm=a2g0s.9042311.0.0.66e94c4d0ORiVh) ($387)
- RAM: [Crucial 1x32GB DDR4 SODIMM 2666MHz](https://www.newegg.com/crucial-32gb-260-pin-ddr4-so-dimm/p/N82E16820156239) ($153)
- SSD: [Silicon Power 1TB M.2 2280 NVMe SSD](https://www.amazon.com/Silicon-Power-Gen3x4-000MB-SU001TBP34A80M28AB/dp/B07L6GF81L) ($115)
- **Total: $655**

Estos son los comentarios de moralcompass sobre por qué eligieron esta configuración:

- _Sin partes móviles, sin ruido._
- _NIC Intel dual (en caso de que decida reutilizar esto como mi router algún día)_
- _Ranuras NVME + SATA (prefiero NVME por velocidad y opciones con mayor resistencia TBW. SATA brinda la opción de HDD o SSD. Evité las interfaces M.SATA porque estos SSD parecen estar volviéndose obsoletos)_
- _Puertos USB y serial disponibles para señal de apagado elegante desde UPS_
