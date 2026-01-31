# Inicio Rápido de Houston

Ya seas un operador de nodo experimentado, titular de rETH o un observador curioso, esta página te ayudará a comenzar a explorar las nuevas características incluidas en Houston.

##

### Inicializando el Poder de Voto

Primero y ante todo, el paso más importante si eres **operador de nodo** es [inicializar el voto](../houston/participate#initializing-voting) para desbloquear tu poder de voto. Los nodos que han inicializado el voto se incluyen cuando se calcula el poder de voto total de la red.

En el génesis de Houston, el voto pDAO está deshabilitado hasta que un número suficiente de nodos hayan inicializado el voto. Esto es para prevenir que propuestas deshonestas pasen mientras el poder de voto total y el quórum sean bajos. Después de que suficientes nodos hayan inicializado el voto, se accionará un interruptor y el pDAO tendrá el timón.

Para inicializar el poder de voto, usa este comando en el smartnode:

```shell
rocketpool pdao initialize-voting
```

Solo necesitas hacer esto una vez. Inicializar el voto asegurará que el poder de voto de tu nodo se incluya en futuras propuestas on-chain y te permita votar en ellas.

### Configurando tu Dirección de Señalización de Snapshot

En segundo lugar, querrás configurar tu dirección de señalización de Snapshot. Esto permite a los operadores de nodo participar en votos de Snapshot en su navegador o dispositivo móvil sin tener que exponer sus claves de nodo a una billetera caliente.

Configurar esto implica un puñado de pasos, así que querrás seguir esta guía:
[Configurando tu Dirección de Señalización de Snapshot](../houston/participate#setting-your-snapshot-signalling-address).

### Delegando el Poder de Voto On-Chain

Si deseas delegar el poder de voto on-chain a un miembro de la comunidad de tu elección, haz clic [aquí](../houston/participate#delegating-voting-power) para aprender cómo.

##

# Guías

[Visión General Completa de Houston](../houston/whats-new) presenta el DAO de Protocolo completamente on-chain e introduce nuevas características como hacer staking de ETH en nombre de un nodo, configurar una dirección de retiro de RPL y envíos de balance y RPL basados en tiempo. Las auditorías de contratos inteligentes de Houston también se pueden encontrar aquí.

[El DAO de Protocolo](../houston/pdao) discute quién y cómo el pDAO gobierna Rocket Pool. Esta página te informará sobre cómo las tareas del pDAO como gastos del tesoro pueden ejecutarse on-chain, junto con el rol del nuevo Consejo de Seguridad. También te guiará a través del ciclo de vida de una propuesta pDAO y explicará algunas de las medidas tomadas para prevenir spam y eliminar propuestas maliciosas.

[Participando en Propuestas](../houston/participate) incluye una guía detallada paso a paso sobre cómo los operadores de nodo pueden participar en propuestas pDAO. Si estás interesado en elevar una propuesta on-chain, votar o delegar poder de voto, esta es la guía para ti.

[Hacer Staking de ETH en Nombre de un Nodo](../houston/stake-eth-on-behalf.mdx) repasa los pasos para hacer staking de ETH en nombre de un nodo. Es una nueva característica introducida en Houston para facilitar escenarios de depositante único. Te guiaremos a través de cómo hacer esto en una testnet si deseas probarlo antes de hacer staking de ETH real en mainnet.

[Dirección de Retiro de RPL](../houston/rpl-withdrawal-address) te muestra cómo configurar una dirección de retiro de RPL para tu nodo. Esto es útil si deseas habilitar a una entidad separada para suministrar el colateral de seguro RPL para un nodo.
