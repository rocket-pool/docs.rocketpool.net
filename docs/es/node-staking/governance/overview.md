---
next:
  text: The Protocol DAO
  link: "/es/legacy/houston/pdao#the-protocol-dao-pdao"
---

# Resumen

Esta sección describe el proceso de configurar su nodo para participar en propuestas on-chain y de snapshot. Hay mucho que desempacar, por lo que recomendamos encarecidamente leer un resumen de la [Actualización Houston](/es/legacy/houston/whats-new). Esto le ayudará a comprender las últimas características que habilitan la gobernanza on-chain y cómo puede participar en dar forma al protocolo.

## Requisitos Previos

Antes de configurar su Smartnode, asegúrese de:

- Haber configurado una máquina de nodo (o máquina virtual) y asegurarla (a través de la guía [Asegurando su Nodo](../securing-your-node))
- Tener el Smartnode [instalado](../installing/overview) y [configurado](../config/overview) en él
- Tener una billetera de nodo cargada en su Smartnode
- Haber sincronizado sus clientes de Execution y Consensus
- Haber aprovisionado su nodo con [una dirección de retiro](../prepare-node#setting-your-withdrawal-address), configurado sus [clientes de respaldo](../fallback) (opcional), optado por participar en el [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional), y configurado [MEV](../mev)
- Haber creado al menos un [minipool](../create-validator)

## Hay tres direcciones involucradas en la votación

- Dirección de Señalización pDAO — se usará como su dirección de Snapshot, si desea votar directamente o si desea anular el voto de Snapshot de su delegado. Esta dirección solo se usa para Snapshot, no para votación on-chain.

- Nodo Delegado pDAO — si elige delegar su voto. Establecerá esto en la dirección de nodo de su delegado. Si elige un delegado, votarán por usted en Snapshot y para propuestas on-chain.

- Dirección de Nodo — si no ha delegado su voto o si desea anular el voto on-chain de su delegado, puede hacer esto desde su nodo.

## Guías

[The Protocol DAO](/es/legacy/houston/pdao#the-protocol-dao-pdao) discute quién y cómo el pDAO gobierna Rocket Pool. Esta página le informará sobre cómo se pueden ejecutar deberes del pDAO como gastos del tesoro on-chain, junto con el rol del completamente nuevo Security Council. También le guiará a través del ciclo de vida de una propuesta del pDAO y explicará algunas de las medidas tomadas para prevenir spam y eliminar propuestas maliciosas.

[Configuración de votación para usuarios sin smartnode](/es/legacy/houston/nonsmartnode-setup) muestra a los usuarios sin smartnode (como usuarios de Allnodes) cómo configurar la votación.

[Inicializando el Poder de Voto](/es/legacy/houston/participate#initializing-voting) le muestra cómo inicializar el poder de voto de su nodo. Este paso solo es necesario si su nodo fue registrado antes de la Actualización Houston.

[Establecer su Dirección de Señalización de Snapshot](/es/legacy/houston/participate#setting-your-snapshot-signalling-address) le guiará a través de los pasos para establecer una Dirección de Señalización. Le permitirá votar en Snapshot usando el poder de voto de su nodo sin necesidad de cargar la clave privada de su nodo en una billetera caliente. Asegúrese de tener su CLI de Smartnode a mano y prepare una dirección (que no sea su billetera de nodo) para esta guía.

[Delegar Poder de Voto](/es/legacy/houston/participate#delegating-voting-power) es un comando rápido que puede usar para delegar poder de voto en lugar de votar directamente en propuestas.

[Ver el Estado de una Propuesta](/es/legacy/houston/participate#viewing-the-state-of-a-proposal) es una guía sobre cómo puede ver una lista de propuestas on-chain pasadas y en curso. Podrá verificar el estado y leer los detalles de cualquier propuesta on-chain dada.

[Votar en una Propuesta](/es/legacy/houston/participate#voting-on-a-proposal) le muestra cómo emitir un voto en una propuesta on-chain. Esta guía también repasa las cuatro opciones: **Abstain**, **For**, **Against**, y **Veto**.

[Crear una Propuesta](/es/legacy/houston/participate#creating-a-proposal) le guía a través de los requisitos y pasos para plantear una propuesta on-chain.

[Ejecutar una propuesta exitosa](/es/legacy/houston/participate#executing-a-successful-proposal) le mostrará cómo aplicar los efectos de una propuesta exitosa al Protocolo de Rocket Pool.

[Reclamar Bonos y Recompensas](/es/legacy/houston/participate#claiming-bonds-and-rewards) discute las condiciones bajo las cuales los bonos o recompensas pueden ser reclamados por un Proponente o Retador.

[Crear y Reclamar un gasto recurrente del tesoro](/es/legacy/houston/participate#creating-a-recurring-treasury-spend) es una característica que le da al pDAO control total sobre agregar, modificar y eliminar pagos recurrentes.
