---
next:
  text: El Protocol DAO
  link: "/es/legacy/houston/pdao"
---

# La Actualización Houston

La actualización Houston está dirigida en gran medida a introducir una DAO completamente en cadena para gobernar el protocolo, conocida como el Protocol DAO o pDAO. Es una DAO como ninguna otra y no requiere votación snapshot ni ninguna otra herramienta de terceros para funcionar, es verdaderamente en cadena y única en su tipo, más sobre eso a continuación.

Esta actualización también introducirá algunas otras características muy emocionantes que permitirán que se construyan nuevas integraciones y plataformas en el protocolo. Algunas de estas incluyen la capacidad de hacer staking de ETH en nombre de un nodo (no solo desde el nodo mismo) y una nueva función de dirección de retiro de RPL, que permite que una parte suministre el ETH para staking y otra parte proporcione el RPL sin dar custodia al operador del nodo"

## Protocol DAO

El Protocol DAO (pDAO) de Rocket Pool es responsable de dar forma a la dirección del protocolo y es administrado por la gobernanza de RPL. Sus miembros y su poder de voto están compuestos por operadores de nodos, grandes y pequeños, todos los cuales participan directamente en el protocolo.

Típicamente, la gobernanza de DAO en el espacio cripto más amplio se hace mediante votación ponderada por tokens. Básicamente, cuantos más tokens tengas para un protocolo/proyecto, mayor será tu poder de voto. Tampoco necesitas estar participando activamente en el protocolo, simplemente tener los tokens es suficiente.

Este estilo de gobernanza queríamos evitar. Si deseas ayudar a dirigir y guiar el futuro de Rocket Pool, necesitas estar activamente involucrado, no solo almacenando tokens en una billetera fría. Desde los fondos de capital de riesgo más grandes hasta tu tipo ordinario ejecutando un solo minipool, necesitarás estar participando activamente en el protocolo para ayudar a gobernarlo.

Actualmente, el protocol DAO tiene control sobre una variedad de configuraciones en cadena que se utilizan en el protocolo. Se pueden hacer nuevas Propuestas de Mejora de Rocket Pool (RPIP) y votar sobre ellas por estos Operadores de Nodos dentro de Rocket Pool. Puedes ver el [**registro actual de RPIP aquí**](https://rpips.rocketpool.net/). Si eres un diablo por los detalles, el RPIP actual para el protocol DAO en cadena del que se habla ahora se puede encontrar aquí.

### ¿Qué puede hacer el pDAO?

El pDAO tiene control sobre muchas configuraciones del protocolo, puede gastar fondos del tesoro y en nuestra actualización Houston, viene con un nuevo consejo de seguridad para ayudar a reaccionar rápidamente en caso de cualquier problema potencial con el protocolo. Hablemos un poco más sobre cada uno de esos a continuación.

**Parámetros del Protocolo:** Estos controlan ciertas facetas del protocolo, como la configuración que controla la cantidad mínima de ETH que se puede depositar para rETH (actualmente 0.01 ETH) o incluso controlar el tamaño máximo del deposit pool, que es la cantidad máxima de ETH que se puede depositar en el protocolo mientras espera ser asignada a los operadores de nodos para staking. Puedes encontrar una tabla completa de [estas configuraciones aquí](https://rpips.rocketpool.net/RPIPs/RPIP-33#parameter-table).

**Fondos del Tesoro:** RPL tiene una tasa de inflación del 5% y una porción de eso se asigna al tesoro del pDAO. El pDAO tiene la capacidad de gastar este tesoro en una variedad de esfuerzos orientados al protocolo, desde financiar el desarrollo del protocolo directamente, gestión de subvenciones para financiar mejoras y proyectos de terceros que hacen uso de Rocket Pool y más. Nuestra actualización Houston agrega una nueva capacidad donde estos pagos del tesoro se pueden hacer no solo de manera de suma global, sino de manera progresiva para ayudar a rastrear objetivos en relación con la financiación continua.

**Consejo de Seguridad:** A medida que la actualización Houston mueve el pDAO a un sistema completamente en cadena, se introdujo una nueva medida de seguridad en forma del [consejo de seguridad](https://rpips.rocketpool.net/RPIPs/RPIP-33#security-council). Estos miembros pueden ser elegidos por el pDAO y tienen la capacidad de pausar el protocolo rápidamente en caso de que ocurra cualquier problema potencial. Se debe alcanzar el quórum entre los miembros para que se ejecute cualquier respuesta de seguridad. El pDAO también tiene el poder de eliminar miembros o disolver el consejo de seguridad por completo si lo necesita.

### Propuestas y Votación

Para que cualquier sistema de gobernanza funcione, debe haber propuestas y votación. En este momento, se usa votación snapshot para estas configuraciones y cambios de propuestas, luego se necesita cierta intervención manual para ejecutar los cambios. Con la introducción de [la actualización Houston y RPIP-33](https://rpips.rocketpool.net/RPIPs/RPIP-33), esto se traslada a un nuevo sistema optimista de prueba de fraude que permite a cualquier operador de nodo plantear, votar o desafiar propuestas, directamente en cadena sin necesidad de herramientas de terceros.

**Proponer:** Cualquier nodo con un poder de voto no nulo puede plantear una propuesta en cualquier momento. Al hacerlo, deben bloquear un bono de propuesta en forma de RPL durante todo el proceso de propuesta.

**Desafiar:** Si se descubre que un nodo que creó una propuesta lo hizo con datos incorrectos requeridos, puede ser desafiado y el desafiante debe proporcionar un bono para el desafío. El nodo que hace el desafío puede ser recompensado con el bono de los proponentes hecho al crear la propuesta si tiene éxito, sin embargo, si han hecho un desafío inválido, el proponente puede cobrar su bono de desafío.

**Votación**: Si una propuesta pasa el período en el que puede ser desafiada, entra en los períodos de votación. Los operadores de nodos pueden entonces elegir votar en uno de los siguientes sabores:

1. Abstención: El poder de voto del votante se contribuye al quórum pero no está ni a favor ni en contra de la propuesta.
2. A favor: El votante vota a favor de que se ejecute la propuesta.
3. En contra: El votante vota en contra de que se ejecute la propuesta.
4. Veto: El votante vota en contra de la propuesta, así como indica que considera la propuesta como spam o maliciosa. Si se alcanza el quórum de veto, la propuesta se derrota inmediatamente y el proponente pierde su bono. Esto es para disuadir el spam, propuestas de baja calidad o propuestas que no han pasado primero por procesos fuera de cadena como señalización mediante votación snapshot.

Hay **dos períodos de votación**

- Período de Votación 1: Para votantes o delegados que votan en nombre de otros.
- Período de Votación 2: Para votantes que delegaron su poder y quieren anular la decisión de su delegado.

Una vez que ambos períodos de votación han pasado y la propuesta es exitosa, la propuesta puede ser ejecutada y el cambio se aplica al protocolo Rocket Pool.

Después de que la propuesta haya pasado los períodos de votación, el proponente puede desbloquear su bono de RPL, a menos que la propuesta haya sido derrotada por un desafío o vetada.

## Hacer Staking de ETH en Nombre de un Nodo

[RPIP-32](https://rpips.rocketpool.net/RPIPs/RPIP-32) permite que una cuenta [haga staking de ETH en nombre](../houston/stake-eth-on-behalf.mdx) de un nodo de Rocket Pool que está registrado en el protocolo. Esto admite una variedad de situaciones donde el operador del nodo no está proporcionando directamente el ETH:

- Seguridad mejorada para los operadores de nodos, ya que pueden hacer staking directamente desde su billetera de hardware, eliminando la necesidad de transferir fondos al nodo de antemano.
- Proveedores de Staking como Servicio donde la custodia de los fondos es administrada por un custodio de confianza.
- Integraciones de protocolo donde la custodia de los fondos es administrada por contratos inteligentes.
- DAOs u organizaciones donde la custodia de los fondos es administrada por un tesoro.

Si bien el objetivo principal de esta función es facilitar escenarios de depositante único, vale la pena señalar que múltiples depositantes independientes también pueden aprovechar esta capacidad creando contratos inteligentes en capas encima. Rocket Pool también introdujo la capacidad de hacer staking de RPL en nombre de un nodo en nuestro lanzamiento anterior de Atlas.

## Dirección de Retiro de RPL

Rocket Pool actualmente permite a los operadores de nodos especificar una dirección de retiro para su ETH y RPL. Esta podría ser una billetera de hardware externa o algo igualmente seguro.

Con [RPIP-31](https://rpips.rocketpool.net/RPIPs/RPIP-31), puedes establecer una dirección de retiro para tu ETH y [una nueva para tu RPL](../houston/rpl-withdrawal-address) si lo deseas. La dirección de retiro de RPL, si se establece, podrá activar y reclamar RPL de las recompensas de inflación y no tendrá efecto en las recompensas de consenso de ETH ni en nada relacionado con ETH.

Esto crea algunas oportunidades interesantes donde RPL puede ser suministrado por una entidad a un operador de nodo que no desea tener exposición a RPL. Esa entidad puede entonces reclamar recompensas de RPL por poner el colateral de seguro requerido para el nodo.

## Envíos de Saldo y Precio de RPL Basados en Tiempo

Los nodos de Rocket Pool necesitan tener al menos un 10% de colateral en RPL en staking para ser elegibles para recompensas, con su "stake efectivo" calculado en función de la relación ETH:RPL, que es reportada por el Oracle DAO al final de cada intervalo de recompensas. Anteriormente, esta "ventana de recarga" (el tiempo entre el informe final de RPL y el final del intervalo) tenía cierta incertidumbre y fluctuaba de intervalo a intervalo porque se especificaba por número de bloques. Esto era válido antes de la fusión pero no tenía en cuenta la variabilidad y aleatoriedad en la forma en que se agregan los bloques.

Para abordar esto, los intervalos para informes de precios y saldos ahora se basarán en segundos en lugar de bloques. Este cambio asegura previsibilidad y tiene paridad con la forma en que se calculan los intervalos de recompensas hoy. Si el intervalo se establece en `86400` segundos (número de segundos en 24 horas), los precios y saldos se reportan a la misma hora todos los días.

El protocolo ahora tiene una "ventana de recarga" fija y controlable, eliminando conjeturas y proporcionando a los usuarios una ventana consistente de 24 horas para recargar después de la actualización de precio final. Siéntete libre de leer más sobre este cambio en [RPIP-35](https://rpips.rocketpool.net/RPIPs/RPIP-35).

## Auditorías

En preparación para la Actualización Houston, Rocket Pool se comprometió con tres de los equipos de auditoría más estimados en el ecosistema Ethereum.

- [Consensys Diligence](https://consensys.io/diligence/audits/2023/12/rocket-pool-houston/) (Finales de Noviembre a Mediados de Diciembre 2023)
- [Sigma Prime](https://rocketpool.net/files/audits/sigma-prime-audit-houston.pdf) x2 (Finales de Noviembre 2023, luego una segunda ronda Marzo 2024)
- [Chainsafe](https://rocketpool.net/files/audits/chainsafe-audit-houston.pdf) (Mediados de Enero a Abril 2024)

Para un historial completo de auditorías más detalles sobre el programa de recompensas de bugs de Immunefi, visita aquí:
https://rocketpool.net/protocol/security
