# Responsabilidades de un Operador de Nodo

## Cómo Funciona el Staking de Ethereum

Como recordatorio, el staking en Prueba de Participación se realiza a través de **validadores**.
Un validador es esencialmente una única dirección de la Beacon Chain a la que se depositaron 32 ETH en la capa de Ejecución.
Los validadores son responsables de mantener la consistencia y seguridad de la Beacon Chain.
Hacen esto escuchando las transacciones y las nuevas propuestas de bloques y **atestiguando** que el bloque propuesto contiene transacciones legales y válidas, realizando cálculos y verificaciones detrás de escena.
Ocasionalmente, pueden proponer nuevos bloques ellos mismos.

Los validadores reciben asignaciones de atestiguaciones y propuestas de bloques **según un calendario aleatorio**.
Esto es muy diferente del antiguo sistema de Prueba de Trabajo, donde todos intentaban constantemente competir entre sí para encontrar el siguiente bloque antes que los demás.
Esto significa que, a diferencia de la Prueba de Trabajo donde los mineros no tenían garantizado ganar una recompensa de bloque a menos que encontraran el siguiente bloque, los validadores de Prueba de Participación _sí_ tienen garantizado un ingreso lento y constante siempre que cumplan con sus deberes.
Si un validador está desconectado y pierde una atestiguación o una propuesta de bloque, será **ligeramente penalizado**.
Las penalizaciones son bastante pequeñas; como regla general, si un validador está desconectado durante X horas, recuperará todo su ETH perdido después de las mismas X horas de estar de vuelta en línea.

### Recompensas

Los validadores ganan recompensas de la capa de consenso por Atestiguaciones, Propuestas de Bloques, Comités de Sincronización (raros) y Recompensas por Slashing (extremadamente raras). También ganan recompensas de la capa de ejecución por Tarifas de Prioridad y MEV.

A partir de 5/2026, el APR general es ~2.634%, con 2.8% siendo el APR de la capa de consenso y 0.22% siendo el APR de la capa de ejecución. Un lugar para encontrar esta información es el [explorador rated](https://explorer.rated.network/network?network=mainnet&timeWindow=30d&rewardsMetric=average&geoDistType=all&hostDistType=all&soloProDist=stake).

### Penalizaciones

Los validadores son penalizados con pequeñas cantidades de ETH si están desconectados y no logran realizar sus deberes asignados.
Esto se llama **filtración** (leaking).
Si un validador viola una de las reglas centrales de la Beacon Chain y parece estar atacando la red, puede ser **penalizado con slashing**.
El slashing es una salida forzosa de tu validador sin tu permiso, acompañada de una multa relativamente grande que elimina parte del saldo de ETH de tu validador.

Realísticamente, la única condición que puede causar un slashing es si ejecutas las claves de tu validador en dos nodos al mismo tiempo (como una configuración de failover/redundancia, donde tu nodo de respaldo se enciende accidentalmente mientras tu nodo principal todavía está funcionando).
No dejes que esto suceda, y **no serás penalizado con slashing**.
El slashing _no puede ocurrir_ por estar desconectado para mantenimiento.

A continuación hay una tabla que muestra las penalizaciones que pueden ocurrirle a un validador:

| Tipo                             | Capa     | Cantidad                                                                                                |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| Atestiguación Perdida            | Consenso | -0.000011 ETH\* por atestiguación (-9/10 del valor de una recompensa de atestiguación normal)           |
| Propuesta Perdida                | Consenso | 0                                                                                                       |
| Comité de Sincronización Perdido | Consenso | -0.00047 ETH\* por época (-0.1 ETH total si está desconectado durante todo el comité de sincronización) |
| Slashing                         | Consenso | Al menos 1/32 de tu saldo, hasta tu saldo completo en circunstancias extremas                           |

\*_Varía según el número total de validadores en la red.
Aproximado para 435,000 validadores activos._

::: tip CONSEJO
Como regla general, si estás desconectado durante X horas (y no estás en un comité de sincronización), entonces recuperarás todo tu ETH filtrado después de X horas una vez que estés de vuelta en línea y atestiguando.
:::

## Cómo Funcionan los Nodos de Rocket Pool

A diferencia de los stakers en solitario, que deben depositar 32 ETH para crear un nuevo validador, los nodos de Rocket Pool solo necesitan depositar 4 ETH por validador (llamado "bonded ETH").
Esto se combinará con 28 ETH del pool de staking (llamado "borrowed ETH", que proviene de los depósitos de los liquid stakers a cambio de rETH) para crear un nuevo validador megapool.

Para la Beacon chain, un validador megapool se ve exactamente igual que un validador normal.
Tiene las mismas responsabilidades, mismas reglas que debe seguir, mismas recompensas, y así sucesivamente.
La única diferencia está en cómo se creó el validador megapool en la capa de ejecución y cómo funcionan los retiros cuando el operador del nodo decide salir voluntariamente del validador megapool.
Toda la creación, retiros y delegación de recompensas se maneja mediante los **contratos inteligentes** de Rocket Pool en la cadena de Ethereum.
Esto lo hace completamente descentralizado.

Un **Nodo** de Rocket Pool es una única computadora con una billetera de Ethereum que se registró en los contratos inteligentes de Rocket Pool.
El nodo puede entonces crear tantos validadores megapool como pueda pagar, todos funcionando felizmente en la misma máquina juntos.
**Un solo nodo de Rocket Pool puede ejecutar muchos, muchos validadores megapool.**
Cada validador megapool tiene un impacto insignificante en el rendimiento general del sistema; algunas personas han podido ejecutar cientos de ellos en un solo nodo.

El costo inicial de un validador megapool es de 4 ETH. Además, un operador de nodo puede opcionalmente hacer staking de RPL en su nodo para calificar para recompensas adicionales y obtener poder de voto dentro del DAO del protocolo.

## Operadores de Nodo de Rocket Pool

Los **operadores de nodo** son el corazón y el alma de Rocket Pool.
Son los individuos que ejecutan nodos de Rocket Pool.

### Responsabilidades

Ponen a trabajar el ETH del pool de staking ejecutando validadores megapool con él, que ganan recompensas de staking para el protocolo de Rocket Pool (y por lo tanto, aumentan el valor de rETH).
Su trabajo es sencillo, pero crucialmente importante: _ejecutar validadores con la más alta calidad posible y maximizar las recompensas de staking_.

Los operadores de nodo son responsables de:

- Configurar una computadora (ya sea física o virtual)
- Configurarla correctamente, incluyendo su red doméstica si es aplicable
- Instalar Rocket Pool en ella y configurar validadores para realizar validación
- Asegurarla, tanto de amenazas externas como internas
- Mantenerla durante la vida de sus validadores

Es una gran responsabilidad, y no es un trabajo simple de configurar y olvidar; necesitas cuidar tu nodo mientras esté haciendo staking.
Con gran responsabilidad, sin embargo, vienen grandes recompensas.

### Recompensas

Aquí están los principales beneficios de ejecutar un nodo de Rocket Pool:

- Ganas tu porción de las recompensas de ETH de cada validador, más comisión.
  - Ejecutas un validador con solo 4 ETH de tu propio capital, y los 28 ETH restantes provienen de los liquid stakers.
  - Cada validador megapool gana un 5% de comisión sobre las recompensas generadas por los 28 ETH del protocolo. Esto equivale a un 35% más que hacer staking en solitario (`(4 bonded + 28 borrowed * 0.05) / 4 = 1.35`).
  - Al unirte al [Smoothing Pool](fee-distrib-sp#el-smoothing-pool), compartes las recompensas de la capa de ejecución (tarifas de prioridad y MEV) con otros participantes, lo que proporciona retornos más consistentes en lugar de depender de la suerte en las propuestas de bloques.
- Hacer staking de RPL te genera recompensas adicionales.
  - Los stakers de RPL ganan una [parte de la comisión del protocolo](megapools/staking-and-claiming-rewards#cómo-se-distribuye-el-voter-share-a-los-stakers-de-rpl-del-megapool) (pagada en ETH) proporcional a su RPL en staking.
  - También ganas recompensas de emisión (pagadas en RPL) sobre el RPL que haces staking.
    - Al final de un período (cada 28 días), hay una instantánea de tu RPL.
    - Puedes ganar rendimiento máximo en RPL **hasta el 15%** del valor de tu total de ETH prestado.
    - Ganarás rendimiento en RPL más allá del 15%, a un nivel decreciente.
  - Obtendrás poder de voto basado en la raíz cuadrada de tu RPL en staking, hasta el 150% de tu ETH vinculado.

### Limitaciones

Hay algunas limitaciones que vienen junto con las recompensas anteriores:

- Si tu nodo funciona mal y realmente terminas perdiendo ETH para el momento en que decides salir de tu validador megapool, todo el ETH perdido saldrá de tu parte.
  - Por ejemplo: si sales con un saldo de 31 ETH, entonces tu validador megapool perdió 1 ETH de su depósito inicial de 32 ETH. Recibirás 3 ETH, y 28 ETH se devolverán al pool de staking.
- Tu RPL en staking será menos líquido:
  - No hay límite sobre cuánto RPL en staking de megapool puedes retirar del stake, pero debes esperar 28 días después de iniciar el unstaking antes de poder retirarlo. Esto evita que los usuarios manipulen el sistema de recompensas haciendo staking de RPL justo a tiempo para el período de recompensas de 28 días y retirándolo inmediatamente después del período.

### Tú puedes hacerlo

Si eres bastante nuevo en el uso de la línea de comandos o el mantenimiento de computadoras, esto puede parecer un desafío aterrador.
Por suerte, uno de los principios más fundamentales de Rocket Pool es la _descentralización_: el hecho de que cualquier persona, en cualquier lugar, puede ejecutar un nodo si tiene la determinación y el conocimiento.
Aunque no podemos ayudar con la determinación, _sí_ podemos ayudar con el conocimiento.
Esta sección está llena de guías, tutoriales e información que te ayudarán a entender cómo ejecutar un gran nodo de Rocket Pool.
