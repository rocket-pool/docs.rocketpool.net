# El Oracle DAO de Rocket Pool

::: warning NOTA
Esta documentación solo aplica a los miembros del Oracle DAO de Rocket Pool.
Si no has sido invitado explícitamente al Oracle DAO y solo tienes la intención de ejecutar un nodo regular de Rocket Pool, esta sección de la guía no aplica para ti.
Puedes ignorarla de forma segura, pero eres bienvenido a leerla si estás interesado.
:::

El **Oracle DAO** es el grupo de nodos especiales de Rocket Pool que son responsables de las tareas administrativas requeridas por el protocolo que no pueden lograrse mediante contratos inteligentes debido a limitaciones técnicas.
Son esencialmente iguales a los nodos normales de Rocket Pool; usan las mismas herramientas, pueden configurarse con los mismos métodos e incluso pueden ejecutar minipools regulares, pero vienen con tareas suplementarias que realizan.
Esto incluye cosas como:

- Transportar información de la Beacon Chain a la capa de ejecución, incluyendo el estado y balances del validador
- Asegurar que los minipools se crean usando claves públicas de validador que no están ya en uso, y [tienen las credenciales de retiro adecuadas](https://github.com/rocket-pool/rocketpool-research/blob/master/Reports/withdrawal-creds-exploit) para que el protocolo pueda financiarlos de forma segura
- Construir el árbol de Merkle de recompensas al final de cada período de recompensas y subirlo a IPFS para que otros operadores de nodos puedan acceder a él
- Monitorear propuestas para el cumplimiento de los [requisitos de destinatario de comisiones](../node-staking/mev.mdx) de Rocket Pool
- Proponer y votar sobre modificaciones al protocolo central, incluyendo cambiar parámetros y aprobar actualizaciones de contratos
- Proponer y votar sobre la lista del Oracle DAO, incluyendo invitar y remover otros miembros del Oracle DAO

Como recompensa por cumplir con estos deberes, el Oracle DAO recibe colectivamente un [pequeño porcentaje](https://rpips.rocketpool.net/RPIPs/RPIP-25) de la inflación total de RPL producida en cada período de recompensas, dividido equitativamente entre sus miembros.

A diferencia de los nodos normales de Rocket Pool, que pueden ser creados y ejecutados sin permisos por cualquiera, la membresía en el Oracle DAO es **solo por invitación** de los miembros existentes.
Si recientemente has sido invitado a unirte al Oracle DAO, esta sección de la guía te ayudará a entender tu rol, configurar tu nodo y asegurar que se mantenga saludable.

## Requisitos

Para ejecutar un nodo del Oracle DAO, necesitarás lo siguiente:

- Acceso al **endpoint RPC de un cliente de ejecución**. Este puede ser un cliente ejecutado localmente, como es el caso con la mayoría de los nodos de Rocket Pool, o puede enlazar a clientes externos que tú o tu organización mantengan independientemente.
- Acceso a un **cliente de ejecución en modo archivo**, que puede actuar como tu cliente principal o como un cliente suplementario (fallback). Solo se usará en circunstancias raras donde las tareas requieren que tu nodo recuerde un estado de la capa de ejecución que ha sido podado de tu cliente de ejecución. Sin embargo, es **crítico** que tengas acceso a un nodo de archivo durante estos períodos para asegurar que tus tareas puedan cumplirse con éxito.
  - **Fuertemente** recomendamos que uses un nodo de archivo local para esto, ya que servicios como [Infura](https://infura.io/pricing) o [Alchemy](https://www.alchemy.com/pricing) han mostrado algunas dificultades para mantenerse al día con la demanda durante períodos críticos como la construcción del árbol de recompensas.
- Acceso al **endpoint de API REST de un nodo Beacon en modo archivo** (vía HTTP). Este puede ser un cliente ejecutado localmente, como es el caso con la mayoría de los nodos de Rocket Pool, o puede enlazar a clientes externos que tú o tu organización mantengan independientemente.
- El CLI estándar de Smartnode.
- El daemon de Smartnode está configurado y ejecutándose en modo `watchtower` (esto está incluido con el paquete estándar de Smartnode para todos los usuarios, pero solo realiza tareas activamente para nodos del Oracle DAO).
  - Esto puede ejecutarse en un contenedor Docker (configuración estándar) o como un simple servicio `systemd` (modo "nativo").
- Suficiente ETH para pagar los costos de gas de tus tareas (discutido más adelante).

::: warning NOTA
Si simplemente no puedes ejecutar un nodo de archivo local y _debes_ confiar en un servicio de terceros, considera lo siguiente:

Si planeas usar **Infura** para tu fallback de modo archivo, debes tener al menos el plan **Team**.
El nivel gratuito y el nivel Developer no son suficientes.

Si planeas usar **Alchemy**, debes tener al menos el plan **Growth**.
El nivel gratuito no es suficiente.
:::

## Actividades

Las tareas del Oracle DAO se dividen en dos partes.

1. **Tareas automatizadas**: estas son tareas relacionadas con la operación rutinaria de Rocket Pool, como transportar información de la capa de consenso a la capa de ejecución, calcular varios aspectos del protocolo fuera de la cadena y enviarlas como actualizaciones a los contratos inteligentes. Cada una de estas se realiza automáticamente por el proceso daemon `watchtower` y no requieren intervención manual siempre y cuando tus clientes de ejecución y consenso, y tu daemon `watchtower`, estén operando normalmente.
2. **Tareas manuales**: estas son tareas que requieren tu propia toma de decisiones y comunicación fuera de banda con el resto del Oracle DAO para realizar. Incluyen cosas como votar sobre actualizaciones de contratos, cambiar parámetros e invitar o expulsar miembros al/del Oracle DAO. Todas estas pueden hacerse a través del CLI estándar de Smartnode.

Lee la siguiente sección para aprender cómo configurar tu nodo del Oracle DAO.
