---
next:
  text: Creando un Nuevo Minipool (Validator)
  link: "/es/node-staking/create-validator"
---

::: danger ADVERTENCIA
Los depósitos de minipool están actualmente deshabilitados en preparación para Saturn 1.
:::

# Resumen

Esta sección cubre los procesos de creación y migración de minipools (validators de Rocket Pool).
Aquí aprenderás cómo comenzar a validar la red Ethereum y ganar recompensas por ello.

## Prerrequisitos

Antes de ejecutar minipools, asegúrate de:

- Haber configurado una máquina de nodo (o máquina virtual) y haberla asegurado (a través de la guía [Asegurando tu Nodo](../securing-your-node))
- Tener el Smartnode [instalado](../installing/overview) y [configurado](../config/overview) en ella
- Tener una wallet de nodo cargada en tu Smartnode
- Sincronizado tus clientes de Ejecución y Consenso
- Provisionado tu nodo con [una dirección de retiro](../prepare-node.mdx#setting-your-withdrawal-address), configurado tus [clientes de respaldo](../fallback) (opcional), optado por el [Smoothing Pool](../fee-distrib-sp#the-smoothing-pool) (opcional), y configurado [MEV](../mev.mdx)

## Guías

[Creando un Nuevo Minipool (Validator)](../create-validator.mdx) explica el proceso de crear un nuevo minipool de Rocket Pool y el validator correspondiente en la Beacon Chain.
Ya sea que estés creando tu primer minipool o ya tengas algunos y quieras crear otro, esta guía te guiará paso a paso.

[El Delegate del Minipool](./delegates) explica un poco sobre qué es el contrato del minipool, e introduce el contrato **delegate** que contiene la mayor parte de su funcionalidad.
También demuestra cómo actualizar el delegate para tus minipools después de una actualización de red para aprovechar las nuevas características.

[Convirtiendo un Validator Solo en un Minipool](../solo-staker-migration) recorre el proceso de convertir un validator existente fuera de Rocket Pool (como uno que uses para solo staking) directamente en un minipool de Rocket Pool sin necesidad de salir de la Beacon Chain y crear un nuevo minipool.
Si eres un solo staker que quiere aprovechar esta capacidad, ¡esta es la guía para ti!

[Migrando un Minipool de 16-ETH a 8-ETH](../leb-migration.mdx) muestra cómo reducir la cantidad de ETH vinculado para un minipool de 16 ETH a 8 ETH, dándote 8 ETH en crédito que puede usarse para crear un nuevo minipool gratis (aunque todavía cuesta ETH para gas, por supuesto).

[El Sistema de Crédito de Depósito](../credit) cubre el sistema de "Crédito ETH" que te permite crear nuevos minipools sin tener que pagar por sus bonos de ETH después de realizar una de las migraciones anteriores.
