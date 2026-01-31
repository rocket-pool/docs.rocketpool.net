# Requisitos del Nodo y Elección de una Plataforma

¡Muy bien!
Así que has decidido probar tu habilidad ejecutando un nodo de Rocket Pool.
El primer paso del proceso es decidir qué tipo de plataforma quieres usar para ejecutar tu nodo.
Si ya tienes una en mente, ¡genial!
Puedes saltar a la siguiente sección.
Si aún no estás seguro, entonces sigue leyendo para obtener información sobre tus opciones.

## Requisitos de un Nodo Completo

Un **nodo completo** es aquel que ejecuta tanto un Cliente de Ejecución como un Cliente de Consenso junto con el stack de Rocket Pool.
Ahora que ha ocurrido la Fusión, los nodos de Rocket Pool están obligados a ejecutar esta configuración (aunque los clientes de Ejecución y Consenso pueden ser gestionados externamente para usuarios que ya ejecutan una configuración de staking en solitario; cubriremos esto con más detalle más adelante).

Aquí hay un desglose simple de lo que se requiere para ejecutar bien un nodo completo de Rocket Pool:

- Una **conexión a Internet estable**. Cuanto más tiempo permanezcas en línea, mejores serán tus recompensas. Una conexión a Internet irregular perjudicará tus retornos y, por extensión, el crecimiento de la proporción de rETH.
- Al menos **10Mbps de ancho de banda tanto de subida como de bajada**. Un nodo completo generalmente requiere alrededor de 8Mbps a 10Mbps de tráfico de red de subida y bajada, dependiendo de tu configuración y número de minipools.
- **Sin límite de datos** impuesto por tu ISP. Ejecutar un nodo completo consumirá muchos datos: hemos visto informes de más de 2 TB por mes solo en datos de cadena. Esto puede mitigarse un poco con algunos ajustes de configuración en los clientes de ETH, pero como regla general, no ejecutes un nodo completo si tu plan de Internet viene con un límite de datos mensual.
- **Electricidad estable**. Por la misma razón que necesitas una conexión a Internet estable, también quieres tener energía confiable. Esto puede mitigarse con un UPS grande (batería de respaldo) para lidiar con apagones cortos.
- Una **computadora** con especificaciones suficientes. Esto es bastante flexible porque _realmente_ depende de qué clientes de Ejecución y Consenso uses, y qué configuraciones los configures. La computadora puede ser una máquina local, o puede estar alojada en la nube. Lee a continuación para obtener más información sobre esas dos opciones, y cómo decidir cuál es mejor para ti.

La computadora debe cumplir con las [directrices de hardware](./local/hardware.md)

::: warning NOTA
En este momento, solo se soportan plataformas **Linux** y **macOS**.
**Windows no está actualmente soportado** para la operación de Smartnode.
:::

## Ejecutar un Nodo Local

Si tienes electricidad confiable y acceso a Internet sin límite, y estás dispuesto a construir (o comprar preensamblada) y mantener una computadora, entonces ejecutar un nodo local podría ser una excelente opción para ti. Con esta opción, configurarás una computadora dedicada como nodo de Rocket Pool y la ejecutarás localmente en tu propio hogar.

Ventajas:

- Sin tarifas mensuales, aparte de servicios públicos
- Control completo sobre tu propia máquina y sus datos (incluyendo la clave de tu billetera)
- Acceso para realizar mantenimiento y actualizaciones cuando quieras
- Contribuye a la descentralización de Ejecución y Consenso, y de Rocket Pool (y por lo tanto, a su seguridad)

Desventajas:

- Requiere Internet y electricidad estables y sin límite
  - **Ejecutar un nodo usa al menos 1.5 TB de datos por mes. ¡Si tienes un límite de datos por debajo de esta cantidad, puedes tener problemas al ejecutar un nodo local!**
- Eres el único responsable de la seguridad de la red y la computadora
- Puede ser desafiante si no tienes experiencia con el mantenimiento de computadoras
- Vulnerable al robo

Si las ventajas suenan como si superaran las desventajas para ti, entonces echa un vistazo a nuestra [Guía de Operador de Nodo Local](./local/hardware.html).

## Ejecutar en un Servidor

Si no tienes un plan de Internet confiable sin límite, o simplemente no quieres lidiar con construir y mantener tu propia computadora física, puedes considerar ejecutar un servidor privado que alquilas de un proveedor de alojamiento. Esencialmente, estas compañías crearán y ejecutarán un servidor para ti con gusto, por una tarifa mensual. Si no te importa esa tarifa y quieres ejecutar un nodo de Rocket Pool, usar un servidor puede ser una buena estrategia.

Ventajas:

- Sin mantenimiento, el soporte generalmente está disponible para solucionar problemas
- No afecta tu plan de Internet ni tu límite de datos
- Generalmente se ejecutan en un centro de datos profesional, muy poco tiempo de inactividad
- Puede ser más rentable que comprar/construir tu propia computadora

Desventajas:

- Hace que Ejecución y Consenso, y Rocket Pool sean algo más centralizados, lo que debilita la seguridad de las redes
- Tarifas mensuales
- Los servidores pueden venir con límites de datos o tener tarifas de entrada/salida de red costosas
- Es posible que los hosts examinen el contenido de tu máquina y tomen la clave de tu billetera si no está asegurada

Si esas ventajas suenan como si superaran las desventajas para ti, entonces echa un vistazo a nuestra [Guía de Operador de Nodo en Servidor](./vps/providers.html).
