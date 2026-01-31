---
next:
  text: Starting Rocketpool
  link: "/es/node-staking/starting-rp"
---

# Resumen

Esta sección cubre los detalles de cómo aprovisionar tu nodo para hacer staking con Rocket Pool una vez que hayas instalado y configurado el Smartnode.
Es larga porque hay mucha información sobre staking que cubrir, ¡así que **por favor lee cada guía antes de crear tu primer minipool!**

## Prerrequisitos

Antes de aprovisionar tu nodo para hacer staking, asegúrate de haber hecho lo siguiente:

- Configurar una máquina de nodo (o máquina virtual) y asegurarla (a través de la guía [Securing your Node](../securing-your-node))
- Tener el Smartnode [instalado](../installing/overview) y [configurado](../config/overview) en ella

## Guías

[Starting Rocket Pool](../starting-rp) te mostrará cómo iniciar los servicios del Smartnode para cada modo y cómo verificar el progreso de sincronización de tus clientes de Ejecución y Consenso.

[Creating a New Wallet](../wallet-init) recorre el proceso de crear una nueva wallet con el Smartnode si esta es tu primera vez configurando un nodo.

[Importing / Recovering an Existing Wallet](../recovering-rp.mdx) es una alternativa a crear una nueva wallet.
Usa esta guía si ya tienes una wallet de nodo que deseas recuperar en tu nodo (o si estás migrando desde un servicio como Allnodes a tu propio hardware).

[Preparing your Node for Operation](../prepare-node.mdx) cubre algunos primeros pasos importantes que querrás dar una vez que tengas una wallet cargada en tu nodo, mucho antes de que la fondees con ETH o RPL (aparte de una pequeña cantidad de ETH para costos de gas, por supuesto).

[Specifying a Fallback Node](../fallback) te guía a través del proceso opcional de apuntar tu nodo a un segundo par de clientes de Ejecución y Consenso (gestionados externamente) que pueden actuar como respaldo para tus clientes primarios si alguna vez se caen, para que tu nodo pueda seguir validando mientras realizas mantenimiento en ellos.

[Fee Distributors and the Smoothing Pool](../fee-distrib-sp) discuten la forma en que las recompensas de la capa de Ejecución se proporcionan a tu nodo cada vez que uno de tus validadores propone un bloque, cómo cobrar esas recompensas y describe el **Smoothing Pool** de Rocket Pool - una característica popular que combina las recompensas de la capa de Ejecución de todos y las distribuye uniformemente durante los intervalos regulares de recompensas de Rocket Pool.

[MEV, MEV-Boost, and MEV Rewards](../mev.mdx) explica **Maximum-Extractable Value** (MEV), su papel en el ecosistema de staking y cómo puedes configurarlo a tu gusto usando el Smartnode.
