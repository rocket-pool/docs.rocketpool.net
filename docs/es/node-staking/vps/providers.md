# Seleccionar un Proveedor de Alojamiento

Si has llegado a esta sección, entonces deseas ejecutar un nodo de Rocket Pool pero no puedes configurar uno localmente en tu hogar; necesitas un **servidor privado virtual (VPS)** alojado en la nube.
Hay varios servicios diferentes disponibles que pueden proporcionar tal máquina, y vienen en dos tipos diferentes: proveedores de VPS y proveedores de nube pública.

Elegir el correcto puede ser difícil, y comprender las diferencias entre ellos es clave.
En esta guía, arrojaremos algo de luz sobre la distinción y enumeraremos algunos de los servicios que otros usuarios de Rocket Pool han aprovechado en el pasado para ayudarte a navegar a través de tus opciones.

## Alojamiento VPS Tradicional

Un servidor privado virtual es una única instancia de una máquina virtual que reside en una máquina física más grande.
Son la opción más económica, y se emplean con menos frecuencia que las ubicuas plataformas en la nube, por lo que tienden a contribuir más a la descentralización de la red Ethereum.

Sin embargo, rara vez tienen soporte de alta disponibilidad; si el servidor físico falla, es probable que tu VPS alojado en él también falle.
Además, tienen una huella de recursos fija; generalmente no es posible aumentar o disminuir recursos como CPU y RAM bajo demanda.

A partir de 10/2024, una opción de buen precio y rendimiento fue el RS 12000 G11 de [Netcup](https://www.netcup.eu/vserver/vps.php).
Una advertencia es que el almacenamiento se comparte con otros, por lo que los IOPs de almacenamiento son un posible cuello de botella.

## Alojamiento de Servidor Dedicado

A diferencia de un VPS, un servidor dedicado es un dispositivo físico completo que es alquilado por ti. Son una opción relativamente asequible, y se emplean con menos frecuencia que las ubicuas plataformas en la nube, por lo que tienden a contribuir más a la descentralización de la red Ethereum.

A partir de 10/2024, dos opciones de buen precio y rendimiento fueron los servidores bare-metal Rise y Advanced de [OVH](https://us.ovhcloud.com/). Hay una variedad de estos que cambian con el tiempo, así como ventas significativas. Necesitarás verificar que se cumplan las [directrices de hardware](../local/hardware.md).

## Alojamiento en la Nube

El alojamiento en la nube se refiere a máquinas virtuales que están divididas entre una red distribuida de múltiples servidores, en lugar de estar alojadas en una sola máquina física.
Si una de las máquinas de alojamiento falla, las otras pueden tomar el relevo sin problemas, por lo que la disponibilidad y confiabilidad tienden a ser extremadamente altas en estas plataformas.
También tienden a ofrecer opciones de recursos flexibles; es relativamente simple agregar más CPU, RAM o espacio en disco bajo demanda.

Debido a estos beneficios adicionales, los servidores basados en la nube tienden a ser más costosos que las soluciones VPS.
También son plataformas muy populares, por lo que usarlas generalmente reduce la descentralización general de la red Ethereum.

Los 3 principales proveedores de nube son [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/), y [Google Cloud Platform (GCP)](https://cloud.google.com/).
No recomendamos usar alojamiento en la nube debido a preocupaciones de precio y centralización.

## Consideraciones Clave

### Precio

Las soluciones de alojamiento en la nube suelen ser una opción más segura si el costo no es una prioridad.
La sección a continuación tiene un desglose más detallado de las estimaciones de costos, pero aquí hay una comparación general entre una opción VPS y una opción en la nube:

- OVH Servidor Dedicado: $90-160/mes
- Netcup VPS: $90/mes
