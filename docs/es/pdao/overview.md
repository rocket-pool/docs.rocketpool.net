---
next:
  text: El DAO del Protocolo
  link: "/es/pdao/pdao"
---

# Resumen

Esta sección describe el proceso de configuración de tu nodo para participar en propuestas on-chain y de Snapshot. Hay mucho que desempacar, por lo que recomendamos encarecidamente leer un resumen de la [Actualización Houston](/es/legacy/houston/whats-new). Esto te ayudará a comprender las últimas características que habilitan la gobernanza on-chain y cómo puedes participar en dar forma al protocolo.

## Requisitos previos

Antes de configurar tu Smartnode, asegúrate de:

- Haber configurado una máquina de nodo (o máquina virtual) y haberla asegurado (mediante la guía [Asegurando tu nodo](/es/node-staking/securing-your-node))
- Tener el Smartnode [instalado](/es/node-staking/installing/overview) y [configurado](/es/node-staking/config/overview) en él
- Tener una billetera de nodo cargada en tu Smartnode
- Haber sincronizado tus clientes de Ejecución y Consenso
- Haber provisionado tu nodo con [una dirección de retiro](/es/node-staking/prepare-node#setting-your-withdrawal-address), configurado tus [clientes de respaldo](/es/node-staking/fallback) (opcional), optado por el [Smoothing Pool](/es/node-staking/fee-distrib-sp#the-smoothing-pool) (opcional), y configurado [MEV](/es/node-staking/mev)
- Haber creado al menos un [minipool](/es/node-staking/create-validator)

## Hay tres direcciones involucradas en la votación

- Dirección de señalización del pDAO — se utilizará como tu dirección de Snapshot, si deseas votar directamente o si deseas anular el voto de Snapshot de tu delegado. Esta dirección solo se usa para Snapshot, no para votación on-chain.

- Nodo delegado del pDAO — si eliges delegar tu voto. Configurarás esto a la dirección de nodo de tu delegado. Si eliges un delegado, votará por ti en Snapshot y en propuestas on-chain.

- Dirección de nodo — si no has delegado tu voto o si deseas anular el voto on-chain de tu delegado, puedes hacerlo desde tu nodo.

## Guías

[El DAO del Protocolo](/es/pdao/pdao) discute quién y cómo el pDAO gobierna Rocket Pool. Esta página te informará sobre cómo las tareas del pDAO, como los gastos del tesoro, pueden ejecutarse on-chain, junto con el papel del nuevo Consejo de Seguridad. También te guiará a través del ciclo de vida de una propuesta del pDAO y explicará algunas de las medidas tomadas para prevenir spam y rechazar propuestas maliciosas.

[Configuración de votación para usuarios que no usan smartnode](/es/legacy/houston/nonsmartnode-setup) muestra a los usuarios que no usan smartnode (como usuarios de Allnodes) cómo configurar la votación.

[Inicializando el poder de voto](/es/pdao/participate#initializing-voting) te muestra cómo inicializar el poder de voto de tu nodo. Este paso solo es necesario si tu nodo fue registrado antes de la Actualización Houston.

[Configurando tu dirección de señalización de Snapshot](/es/pdao/participate#setting-your-snapshot-signalling-address) te guiará a través de los pasos para configurar una dirección de señalización. Te permitirá votar en Snapshot usando el poder de voto de tu nodo sin necesidad de cargar la clave privada de tu nodo en una billetera caliente. Asegúrate de tener tu CLI de Smartnode a mano y prepara una dirección (que no sea tu billetera de nodo) para esta guía.

[Delegando el poder de voto](/es/pdao/participate#delegating-voting-power) es un comando rápido que puedes usar para delegar el poder de voto en lugar de votar directamente en propuestas.

[Viendo el estado de una propuesta](/es/pdao/participate#viewing-the-state-of-a-proposal) es una guía sobre cómo puedes ver una lista de propuestas on-chain pasadas y en curso. Podrás verificar el estado y leer los detalles de cualquier propuesta on-chain dada.

[Votando en una propuesta](/es/pdao/participate#voting-on-a-proposal) te muestra cómo emitir un voto en una propuesta on-chain. Esta guía también repasa las cuatro opciones: **Abstención**, **A favor**, **En contra** y **Veto**.

[Creando una propuesta](/es/pdao/participate#creating-a-proposal) te guía a través de los requisitos y pasos para presentar una propuesta on-chain.

[Ejecutando una propuesta exitosa](/es/pdao/participate#executing-a-successful-proposal) te mostrará cómo aplicar los efectos de una propuesta exitosa al Protocolo Rocket Pool.

[Reclamando bonos y recompensas](/es/pdao/participate#claiming-bonds-and-rewards) discute las condiciones bajo las cuales los bonos o recompensas pueden ser reclamados por un proponente o retador.

[Creando y reclamando un gasto recurrente del tesoro](/es/pdao/participate#creating-a-recurring-treasury-spend) es una característica que otorga al pDAO control total sobre agregar, modificar y eliminar pagos recurrentes.
