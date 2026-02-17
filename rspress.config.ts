import { defineConfig } from "@rspress/core";

const navTranslations: Record<string, { protocol: string; liquidStaking: string; nodeStaking: string; website: string }> = {
  en: { protocol: "Protocol", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Website" },
  zh: { protocol: "协议", liquidStaking: "流动性质押", nodeStaking: "节点质押", website: "网站" },
  es: { protocol: "Protocolo", liquidStaking: "Staking Líquido", nodeStaking: "Staking de Nodo", website: "Sitio web" },
  fr: { protocol: "Protocole", liquidStaking: "Staking Liquide", nodeStaking: "Staking de Nœud", website: "Site web" },
  de: { protocol: "Protokoll", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Webseite" },
  ja: { protocol: "プロトコル", liquidStaking: "リキッドステーキング", nodeStaking: "ノードステーキング", website: "ウェブサイト" },
  ko: { protocol: "프로토콜", liquidStaking: "리퀴드 스테이킹", nodeStaking: "노드 스테이킹", website: "웹사이트" },
  pt: { protocol: "Protocolo", liquidStaking: "Staking Líquido", nodeStaking: "Staking de Nó", website: "Site" },
  ru: { protocol: "Протокол", liquidStaking: "Ликвидный стейкинг", nodeStaking: "Стейкинг ноды", website: "Сайт" },
  it: { protocol: "Protocollo", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Sito web" },
  tr: { protocol: "Protokol", liquidStaking: "Likit Staking", nodeStaking: "Node Staking", website: "Web sitesi" },
};

type SidebarTranslation = {
  protocol: { title: string; overview: string; explainerSeries: string; faq: string; contracts: string; glossary: string };
  liquidStaking: { title: string; overview: string; viaRp: string; viaL1: string; viaL2: string; onBehalf: string };
  nodeStaking: {
    title: string;
    responsibilities: string;
    platform: string;
    localNode: string;
    localOverview: string;
    hardware: string;
    preparePC: string;
    prepareMac: string;
    ssh: string;
    serverNode: string;
    serverOverview: string;
    providers: string;
    serverOS: string;
    securing: string;
    tailscale: string;
    installing: string;
    installOverview: string;
    ethClients: string;
    installModes: string;
    docker: string;
    native: string;
    configuring: string;
    configOverview: string;
    configDocker: string;
    configNative: string;
    advancedConfig: string;
    provisioning: string;
    provisioningOverview: string;
    startingRp: string;
    walletInit: string;
    recovering: string;
    prepareNode: string;
    cliIntro: string;
    fallback: string;
    feeDistrib: string;
    mev: string;
    megapools: string;
    megapoolsOverview: string;
    createMegapoolValidator: string;
    stakingAndClaimingRewards: string;
    credit: string;
    exitMegapoolValidator: string;
    stakeOnBehalf: string;
    maintenance: string;
    maintenanceOverview: string;
    performance: string;
    grafana: string;
    alerting: string;
    updates: string;
    backups: string;
    masquerade: string;
    historyExpiry: string;
    pruning: string;
    changeClients: string;
    nodeMigration: string;
    rewards: string;
    rewardsOverview: string;
    claimingRewards: string;
    skimming: string;
    exiting: string;
    shutdown: string;
    faq: string;
  };
  odao: { title: string; overview: string; setup: string; testing: string; monitoring: string; proposals: string };
  pdao: { title: string; overview: string; pdao: string; participating: string };
  upgrades: { title: string; saturn1: string; saturn0: string; houston: string; houstonOverview: string; houstonGettingStarted: string; houstonPdao: string; atlas: string; lebs: string; redstone: string; redstoneWhatsNew: string; redstoneDocker: string; redstoneHybrid: string; redstoneNative: string };
  testnet: { title: string; overview: string; mainnet: string };
  legacy: {
    title: string;
    v13Update: string;
    migrating: string;
    atlas: string;
    lebs: string;
    redstone: string;
    redstoneWhatsNew: string;
    redstoneDocker: string;
    redstoneHybrid: string;
    redstoneNative: string;
    houston: string;
    houstonOverview: string;
    houstonGettingStarted: string;
    houstonPdao: string;
    houstonParticipate: string;
    houstonStakeOnBehalf: string;
    houstonRplWithdrawal: string;
    preparePi: string;
  };
};

const sidebarTranslations: Record<string, SidebarTranslation> = {
  en: {
    protocol: { title: "Overview", overview: "Overview", explainerSeries: "Explainer Series", faq: "Frequently Asked Questions", contracts: "Contracts & Integrations", glossary: "Glossary" },
    liquidStaking: { title: "Liquid Staking (rETH)", overview: "Overview", viaRp: "Staking directly via Rocket Pool", viaL1: "Staking via a DEX on Layer 1", viaL2: "Staking via a DEX on Layer 2", onBehalf: "Staking on behalf of a node" },
    nodeStaking: { title: "Node Operator Guide", responsibilities: "A Node Operator's Responsibilities", platform: "Node Requirements & Choosing a Platform", localNode: "Preparing a Local Node", localOverview: "Overview", hardware: "Selecting Staking Hardware", preparePC: "Preparing a PC, Mini-PC or NUC", prepareMac: "Preparing a Mac", ssh: "Intro to Secure Shell (SSH)", serverNode: "Preparing a Server Node", serverOverview: "Overview", providers: "Selecting a Hosting Provider", serverOS: "Preparing the Operating System", securing: "Securing Your Node", tailscale: "Tailscale", installing: "Installing Rocket Pool", installOverview: "Overview", ethClients: "Choosing your ETH Clients", installModes: "Selecting a Rocket Pool Mode", docker: "Creating a Standard Rocket Pool Node with Docker", native: "Creating a Native Rocket Pool Node without Docker", configuring: "Configuring Rocket Pool", configOverview: "Overview", configDocker: "Configuring the Smartnode Stack (Docker/hybrid mode)", configNative: "Configuring the Smartnode Stack (native)", advancedConfig: "Advanced Smartnode Configuration for Docker Mode", provisioning: "Provisioning your Node", provisioningOverview: "Overview", startingRp: "Starting Rocket Pool", walletInit: "Creating a New Wallet", recovering: "Importing/Recovering an Existing Wallet", prepareNode: "Preparing your Node for Operation", cliIntro: "Intro to the Command Line Interface", fallback: "Specifying a Fallback Node", feeDistrib: "Fee Distributors and the Smoothing Pool", mev: "MEV, MEV-Boost & MEV Rewards", megapools: "Creating a Megapool Validator", megapoolsOverview: "Overview", createMegapoolValidator: "Creating a new Megapool (Validator)", stakingAndClaimingRewards: "RPL staking and Claiming Rewards", stakeOnBehalf: "Stake ETH on Behalf of Node", credit: "The Deposit Credit System", exitMegapoolValidator: "Exiting a Megapool Validator", maintenance: "Monitoring & Maintenance", maintenanceOverview: "Overview", performance: "Monitoring your Node's Performance", grafana: "Setting up the Grafana Dashboard", alerting: "Smartnode Stack Alert Notifications", updates: "Checking for Updates", backups: "Backing Up Your Node", masquerade: "Masquerading as Another Node Address", historyExpiry: "Expiring Pre-Merge History", pruning: "Pruning the Execution Client", changeClients: "Changing Execution or Consensus Clients", nodeMigration: "Moving from One Node to Another", rewards: "Claiming Rewards", rewardsOverview: "Overview", claimingRewards: "Claiming Node Operator Rewards", skimming: "Distributing Skimmed Minipool Rewards", exiting: "Exiting your Minipools", shutdown: "Shut Down a Minipool", faq: "FAQ (WIP)" },
    odao: { title: "Oracle DAO", overview: "The Rocket Pool Oracle DAO", setup: "Setting up an Oracle DAO Node", testing: "Testing your Oracle DAO Node", monitoring: "Monitoring your Oracle DAO Node", proposals: "Oracle DAO Proposals" },
    pdao: { title: "Protocol DAO", overview: "Overview", pdao: "The Protocol DAO", participating: "Participating in Proposals" },
    upgrades: { title: "Protocol Upgrades", saturn1: "The Saturn 1 Upgrade", saturn0: "The Saturn 0 Upgrade", houston: "The Houston Upgrade", houstonOverview: "Overview", houstonGettingStarted: "Getting Started with Houston", houstonPdao: "The Protocol DAO", atlas: "The Atlas Update", lebs: "Lower ETH Bond Minipools", redstone: "Redstone & The Merge", redstoneWhatsNew: "The Rocket Pool Redstone Update", redstoneDocker: "[Docker Mode] Guide to the Redstone Update and the Merge", redstoneHybrid: "[Hybrid Mode] Guide to the Redstone Update and the Merge", redstoneNative: "[Native Mode] Guide to the Redstone Update and the Merge" },
    testnet: { title: "Testnet", overview: "Practicing with the Test Network", mainnet: "Migrating from the Test Network to Mainnet" },
    legacy: { title: "Legacy Guides", v13Update: "Upgrading to Smartnode v1.3.x", migrating: "Migrating the Smartnode from Previous Beta Tests", atlas: "The Atlas Update", lebs: "Lower ETH Bond Minipools", redstone: "Redstone & The Merge", redstoneWhatsNew: "The Rocket Pool Redstone Update", redstoneDocker: "[Docker Mode] Guide to the Redstone Update and the Merge", redstoneHybrid: "[Hybrid Mode] Guide to the Redstone Update and the Merge", redstoneNative: "[Native Mode] Guide to the Redstone Update and the Merge", houston: "The Houston Upgrade", houstonOverview: "Overview", houstonGettingStarted: "Getting Started with Houston", houstonPdao: "The Protocol DAO", houstonParticipate: "Participating in Proposals", houstonStakeOnBehalf: "Stake ETH on Behalf of Node", houstonRplWithdrawal: "RPL Withdrawal Address", preparePi: "Preparing a Raspberry Pi" },
  },
  zh: {
    protocol: { title: "概述", overview: "概述", explainerSeries: "解释系列", faq: "常见问题", contracts: "合约与集成", glossary: "术语表" },
    liquidStaking: { title: "流动性质押 (rETH)", overview: "概述", viaRp: "通过 Rocket Pool 直接质押", viaL1: "通过 Layer 1 DEX 质押", viaL2: "通过 Layer 2 DEX 质押", onBehalf: "代表节点质押" },
    nodeStaking: { title: "节点运营指南", responsibilities: "节点运营者的责任", platform: "节点要求与平台选择", localNode: "准备本地节点", localOverview: "概述", hardware: "选择质押硬件", preparePC: "准备 PC、迷你 PC 或 NUC", prepareMac: "准备 Mac", ssh: "SSH 安全外壳简介", serverNode: "准备服务器节点", serverOverview: "概述", providers: "选择托管服务商", serverOS: "准备操作系统", securing: "保护您的节点", tailscale: "Tailscale", installing: "安装 Rocket Pool", installOverview: "概述", ethClients: "选择 ETH 客户端", installModes: "选择 Rocket Pool 模式", docker: "使用 Docker 创建标准 Rocket Pool 节点", native: "不使用 Docker 创建原生 Rocket Pool 节点", configuring: "配置 Rocket Pool", configOverview: "概述", configDocker: "配置 Smartnode 栈 (Docker/混合模式)", configNative: "配置 Smartnode 栈 (原生模式)", advancedConfig: "Docker 模式高级 Smartnode 配置", provisioning: "配置您的节点", provisioningOverview: "概述", startingRp: "启动 Rocket Pool", walletInit: "创建新钱包", recovering: "导入/恢复现有钱包", prepareNode: "准备节点运行", cliIntro: "命令行界面简介", fallback: "指定备用节点", feeDistrib: "费用分配器和平滑池", mev: "MEV、MEV-Boost 和 MEV 奖励", megapools: "创建或迁移 Minipools", megapoolsOverview: "概述", createMegapoolValidator: "创建新的 Minipool (验证器)", credit: "存款信用系统", stakeOnBehalf: "代表节点质押 ETH", maintenance: "监控与维护", maintenanceOverview: "概述", performance: "监控节点性能", grafana: "设置 Grafana 仪表板", alerting: "Smartnode 栈警报通知", updates: "检查更新", backups: "备份您的节点", masquerade: "伪装为其他节点地址", historyExpiry: "过期合并前历史", pruning: "修剪执行客户端", changeClients: "更改执行或共识客户端", nodeMigration: "从一个节点迁移到另一个", rewards: "领取奖励", rewardsOverview: "概述", claimingRewards: "领取节点运营者奖励", skimming: "分配撇取奖励", exiting: "退出您的 Minipools", shutdown: "关闭 Minipool", faq: "常见问题 (进行中)" },
    odao: { title: "Oracle DAO", overview: "Rocket Pool Oracle DAO", setup: "设置 Oracle DAO 节点", testing: "测试您的 Oracle DAO 节点", monitoring: "监控您的 Oracle DAO 节点", proposals: "Oracle DAO 提案" },
    pdao: { title: "协议 DAO", overview: "概述", pdao: "协议 DAO", participating: "参与提案" },
    upgrades: { title: "协议升级", saturn1: "Saturn 1 升级", saturn0: "Saturn 0 升级", houston: "Houston 升级", houstonOverview: "概述", houstonGettingStarted: "Houston 入门", houstonPdao: "协议 DAO", atlas: "Atlas 更新", lebs: "低 ETH 保证金 Minipools", redstone: "Redstone 与合并", redstoneWhatsNew: "Rocket Pool Redstone 更新", redstoneDocker: "[Docker 模式] Redstone 更新和合并指南", redstoneHybrid: "[混合模式] Redstone 更新和合并指南", redstoneNative: "[原生模式] Redstone 更新和合并指南" },
    testnet: { title: "测试网", overview: "在测试网络上练习", mainnet: "从测试网络迁移到主网" },
    legacy: { title: "旧版指南", v13Update: "升级到 Smartnode v1.3.x", migrating: "从之前的 Beta 测试迁移 Smartnode", atlas: "Atlas 更新", lebs: "低 ETH 保证金 Minipools", redstone: "Redstone 与合并", redstoneWhatsNew: "Rocket Pool Redstone 更新", redstoneDocker: "[Docker 模式] Redstone 更新和合并指南", redstoneHybrid: "[混合模式] Redstone 更新和合并指南", redstoneNative: "[原生模式] Redstone 更新和合并指南", houston: "Houston 升级", houstonOverview: "概述", houstonGettingStarted: "Houston 入门", houstonPdao: "协议 DAO", houstonParticipate: "参与提案", houstonStakeOnBehalf: "代表节点质押 ETH", houstonRplWithdrawal: "RPL 提款地址", preparePi: "准备树莓派" },
  },
  es: {
    protocol: { title: "Descripción general", overview: "Descripción general", explainerSeries: "Serie Explicativa", faq: "Preguntas Frecuentes", contracts: "Contratos e Integraciones", glossary: "Glosario" },
    liquidStaking: { title: "Staking Líquido (rETH)", overview: "Descripción general", viaRp: "Staking directo vía Rocket Pool", viaL1: "Staking vía DEX en Layer 1", viaL2: "Staking vía DEX en Layer 2", onBehalf: "Staking en nombre de un nodo" },
    nodeStaking: { title: "Guía del Operador de Nodo", responsibilities: "Responsabilidades del Operador de Nodo", platform: "Requisitos del Nodo y Elección de Plataforma", localNode: "Preparando un Nodo Local", localOverview: "Descripción general", hardware: "Seleccionando Hardware para Staking", preparePC: "Preparando un PC, Mini-PC o NUC", prepareMac: "Preparando un Mac", ssh: "Introducción a Secure Shell (SSH)", serverNode: "Preparando un Nodo en Servidor", serverOverview: "Descripción general", providers: "Seleccionando un Proveedor de Hosting", serverOS: "Preparando el Sistema Operativo", securing: "Asegurando tu Nodo", tailscale: "Tailscale", installing: "Instalando Rocket Pool", installOverview: "Descripción general", ethClients: "Eligiendo tus Clientes ETH", installModes: "Seleccionando un Modo de Rocket Pool", docker: "Creando un Nodo Rocket Pool Estándar con Docker", native: "Creando un Nodo Rocket Pool Nativo sin Docker", configuring: "Configurando Rocket Pool", configOverview: "Descripción general", configDocker: "Configurando el Stack Smartnode (modo Docker/híbrido)", configNative: "Configurando el Stack Smartnode (nativo)", advancedConfig: "Configuración Avanzada de Smartnode para Modo Docker", provisioning: "Aprovisionando tu Nodo", provisioningOverview: "Descripción general", startingRp: "Iniciando Rocket Pool", walletInit: "Creando una Nueva Billetera", recovering: "Importando/Recuperando una Billetera Existente", prepareNode: "Preparando tu Nodo para Operación", cliIntro: "Introducción a la Interfaz de Línea de Comandos", fallback: "Especificando un Nodo de Respaldo", feeDistrib: "Distribuidores de Tarifas y el Smoothing Pool", mev: "MEV, MEV-Boost y Recompensas MEV", megapools: "Creando o Migrando Minipools", megapoolsOverview: "Descripción general", createMegapoolValidator: "Creando un nuevo Minipool (Validador)", credit: "El Sistema de Crédito de Depósito", stakeOnBehalf: "Stake ETH en Nombre del Nodo", maintenance: "Monitoreo y Mantenimiento", maintenanceOverview: "Descripción general", performance: "Monitoreando el Rendimiento de tu Nodo", grafana: "Configurando el Panel de Grafana", alerting: "Notificaciones de Alerta del Stack Smartnode", updates: "Verificando Actualizaciones", backups: "Respaldando tu Nodo", masquerade: "Enmascarándose como Otra Dirección de Nodo", historyExpiry: "Expirando Historial Pre-Merge", pruning: "Podando el Cliente de Ejecución", changeClients: "Cambiando Clientes de Ejecución o Consenso", nodeMigration: "Moviendo de un Nodo a Otro", rewards: "Reclamando Recompensas", rewardsOverview: "Descripción general", claimingRewards: "Reclamando Recompensas de Operador de Nodo", skimming: "Distribuyendo Recompensas Desnatadas", exiting: "Saliendo de tus Minipools", shutdown: "Cerrar un Minipool", faq: "FAQ (En progreso)" },
    odao: { title: "Oracle DAO", overview: "El Oracle DAO de Rocket Pool", setup: "Configurando un Nodo Oracle DAO", testing: "Probando tu Nodo Oracle DAO", monitoring: "Monitoreando tu Nodo Oracle DAO", proposals: "Propuestas del Oracle DAO" },
    pdao: { title: "Protocolo DAO", overview: "Descripción general", pdao: "El Protocolo DAO", participating: "Participando en Propuestas" },
    upgrades: { title: "Actualizaciones del Protocolo", saturn1: "La Actualización Saturn 1", saturn0: "La Actualización Saturn 0", houston: "La Actualización Houston", houstonOverview: "Descripción general", houstonGettingStarted: "Comenzando con Houston", houstonPdao: "El Protocolo DAO", atlas: "La Actualización Atlas", lebs: "Minipools de Bajo ETH Bond", redstone: "Redstone y The Merge", redstoneWhatsNew: "La Actualización Rocket Pool Redstone", redstoneDocker: "[Modo Docker] Guía de la Actualización Redstone y The Merge", redstoneHybrid: "[Modo Híbrido] Guía de la Actualización Redstone y The Merge", redstoneNative: "[Modo Nativo] Guía de la Actualización Redstone y The Merge" },
    testnet: { title: "Testnet", overview: "Practicando con la Red de Prueba", mainnet: "Migrando de la Red de Prueba a Mainnet" },
    legacy: { title: "Guías Antiguas", v13Update: "Actualizando a Smartnode v1.3.x", migrating: "Migrando el Smartnode desde Pruebas Beta Anteriores", atlas: "La Actualización Atlas", lebs: "Minipools con Menor Bono ETH", redstone: "Redstone y The Merge", redstoneWhatsNew: "La Actualización Redstone de Rocket Pool", redstoneDocker: "[Modo Docker] Guía de Actualización Redstone y The Merge", redstoneHybrid: "[Modo Híbrido] Guía de Actualización Redstone y The Merge", redstoneNative: "[Modo Nativo] Guía de Actualización Redstone y The Merge", houston: "La Actualización Houston", houstonOverview: "Descripción general", houstonGettingStarted: "Comenzando con Houston", houstonPdao: "El Protocolo DAO", houstonParticipate: "Participando en Propuestas", houstonStakeOnBehalf: "Hacer Stake de ETH en Nombre del Nodo", houstonRplWithdrawal: "Dirección de Retiro de RPL", preparePi: "Preparando una Raspberry Pi" },
  },
  fr: {
    protocol: { title: "Aperçu", overview: "Aperçu", explainerSeries: "Série Explicative", faq: "Questions Fréquentes", contracts: "Contrats et Intégrations", glossary: "Glossaire" },
    liquidStaking: { title: "Staking Liquide (rETH)", overview: "Aperçu", viaRp: "Staking direct via Rocket Pool", viaL1: "Staking via un DEX sur Layer 1", viaL2: "Staking via un DEX sur Layer 2", onBehalf: "Staking au nom d'un nœud" },
    nodeStaking: { title: "Guide de l'Opérateur de Nœud", responsibilities: "Responsabilités d'un Opérateur de Nœud", platform: "Exigences du Nœud et Choix de Plateforme", localNode: "Préparer un Nœud Local", localOverview: "Aperçu", hardware: "Sélectionner le Matériel de Staking", preparePC: "Préparer un PC, Mini-PC ou NUC", prepareMac: "Préparer un Mac", ssh: "Introduction à Secure Shell (SSH)", serverNode: "Préparer un Nœud Serveur", serverOverview: "Aperçu", providers: "Sélectionner un Fournisseur d'Hébergement", serverOS: "Préparer le Système d'Exploitation", securing: "Sécuriser Votre Nœud", tailscale: "Tailscale", installing: "Installer Rocket Pool", installOverview: "Aperçu", ethClients: "Choisir vos Clients ETH", installModes: "Sélectionner un Mode Rocket Pool", docker: "Créer un Nœud Rocket Pool Standard avec Docker", native: "Créer un Nœud Rocket Pool Natif sans Docker", configuring: "Configurer Rocket Pool", configOverview: "Aperçu", configDocker: "Configurer la Stack Smartnode (mode Docker/hybride)", configNative: "Configurer la Stack Smartnode (natif)", advancedConfig: "Configuration Avancée Smartnode pour Mode Docker", provisioning: "Provisionner Votre Nœud", provisioningOverview: "Aperçu", startingRp: "Démarrer Rocket Pool", walletInit: "Créer un Nouveau Portefeuille", recovering: "Importer/Récupérer un Portefeuille Existant", prepareNode: "Préparer Votre Nœud pour l'Opération", cliIntro: "Introduction à l'Interface en Ligne de Commande", fallback: "Spécifier un Nœud de Secours", feeDistrib: "Distributeurs de Frais et le Smoothing Pool", mev: "MEV, MEV-Boost et Récompenses MEV", megapools: "Créer ou Migrer des Minipools", megapoolsOverview: "Aperçu", createMegapoolValidator: "Créer un nouveau Minipool (Validateur)", credit: "Le Système de Crédit de Dépôt", stakeOnBehalf: "Staker ETH au Nom du Nœud", maintenance: "Surveillance et Maintenance", maintenanceOverview: "Aperçu", performance: "Surveiller les Performances de Votre Nœud", grafana: "Configurer le Tableau de Bord Grafana", alerting: "Notifications d'Alerte de la Stack Smartnode", updates: "Vérifier les Mises à Jour", backups: "Sauvegarder Votre Nœud", masquerade: "Se Faire Passer pour une Autre Adresse de Nœud", historyExpiry: "Expiration de l'Historique Pré-Merge", pruning: "Élaguer le Client d'Exécution", changeClients: "Changer les Clients d'Exécution ou de Consensus", nodeMigration: "Passer d'un Nœud à un Autre", rewards: "Réclamer les Récompenses", rewardsOverview: "Aperçu", claimingRewards: "Réclamer les Récompenses d'Opérateur de Nœud", skimming: "Distribuer les Récompenses Écrémées", exiting: "Quitter vos Minipools", shutdown: "Fermer un Minipool", faq: "FAQ (En cours)" },
    odao: { title: "Oracle DAO", overview: "L'Oracle DAO de Rocket Pool", setup: "Configurer un Nœud Oracle DAO", testing: "Tester Votre Nœud Oracle DAO", monitoring: "Surveiller Votre Nœud Oracle DAO", proposals: "Propositions de l'Oracle DAO" },
    pdao: { title: "Protocole DAO", overview: "Aperçu", pdao: "Le Protocole DAO", participating: "Participer aux Propositions" },
    upgrades: { title: "Mises à Jour du Protocole", saturn1: "La Mise à Jour Saturn 1", saturn0: "La Mise à Jour Saturn 0", houston: "La Mise à Jour Houston", houstonOverview: "Aperçu", houstonGettingStarted: "Démarrer avec Houston", houstonPdao: "Le Protocole DAO", atlas: "La Mise à Jour Atlas", lebs: "Minipools à Faible ETH Bond", redstone: "Redstone et The Merge", redstoneWhatsNew: "La Mise à Jour Rocket Pool Redstone", redstoneDocker: "[Mode Docker] Guide de la Mise à Jour Redstone et The Merge", redstoneHybrid: "[Mode Hybride] Guide de la Mise à Jour Redstone et The Merge", redstoneNative: "[Mode Natif] Guide de la Mise à Jour Redstone et The Merge" },
    testnet: { title: "Testnet", overview: "S'entraîner avec le Réseau de Test", mainnet: "Migrer du Réseau de Test vers Mainnet" },
    legacy: { title: "Guides Anciens", v13Update: "Mise à niveau vers Smartnode v1.3.x", migrating: "Migration du Smartnode depuis les Tests Bêta Précédents", atlas: "La Mise à Jour Atlas", lebs: "Minipools à Caution ETH Réduite", redstone: "Redstone et The Merge", redstoneWhatsNew: "La Mise à Jour Redstone de Rocket Pool", redstoneDocker: "[Mode Docker] Guide de Mise à Jour Redstone et The Merge", redstoneHybrid: "[Mode Hybride] Guide de Mise à Jour Redstone et The Merge", redstoneNative: "[Mode Natif] Guide de Mise à Jour Redstone et The Merge", houston: "La Mise à Jour Houston", houstonOverview: "Aperçu", houstonGettingStarted: "Démarrer avec Houston", houstonPdao: "Le Protocole DAO", houstonParticipate: "Participer aux Propositions", houstonStakeOnBehalf: "Staker ETH au Nom du Nœud", houstonRplWithdrawal: "Adresse de Retrait RPL", preparePi: "Préparer un Raspberry Pi" },
  },
  de: {
    protocol: { title: "Übersicht", overview: "Übersicht", explainerSeries: "Erklärungsreihe", faq: "Häufig gestellte Fragen", contracts: "Verträge & Integrationen", glossary: "Glossar" },
    liquidStaking: { title: "Liquid Staking (rETH)", overview: "Übersicht", viaRp: "Direkt über Rocket Pool staken", viaL1: "Staking über einen DEX auf Layer 1", viaL2: "Staking über einen DEX auf Layer 2", onBehalf: "Im Namen eines Nodes staken" },
    nodeStaking: { title: "Node-Betreiber-Anleitung", responsibilities: "Verantwortlichkeiten eines Node-Betreibers", platform: "Node-Anforderungen & Plattformwahl", localNode: "Einen lokalen Node vorbereiten", localOverview: "Übersicht", hardware: "Staking-Hardware auswählen", preparePC: "Einen PC, Mini-PC oder NUC vorbereiten", prepareMac: "Einen Mac vorbereiten", ssh: "Einführung in Secure Shell (SSH)", serverNode: "Einen Server-Node vorbereiten", serverOverview: "Übersicht", providers: "Einen Hosting-Anbieter auswählen", serverOS: "Das Betriebssystem vorbereiten", securing: "Ihren Node absichern", tailscale: "Tailscale", installing: "Rocket Pool installieren", installOverview: "Übersicht", ethClients: "ETH-Clients auswählen", installModes: "Einen Rocket Pool-Modus auswählen", docker: "Einen Standard Rocket Pool Node mit Docker erstellen", native: "Einen nativen Rocket Pool Node ohne Docker erstellen", configuring: "Rocket Pool konfigurieren", configOverview: "Übersicht", configDocker: "Den Smartnode-Stack konfigurieren (Docker/Hybrid-Modus)", configNative: "Den Smartnode-Stack konfigurieren (nativ)", advancedConfig: "Erweiterte Smartnode-Konfiguration für Docker-Modus", provisioning: "Ihren Node bereitstellen", provisioningOverview: "Übersicht", startingRp: "Rocket Pool starten", walletInit: "Eine neue Wallet erstellen", recovering: "Eine bestehende Wallet importieren/wiederherstellen", prepareNode: "Ihren Node für den Betrieb vorbereiten", cliIntro: "Einführung in die Befehlszeile", fallback: "Einen Fallback-Node angeben", feeDistrib: "Gebührenverteiler und der Smoothing Pool", mev: "MEV, MEV-Boost & MEV-Belohnungen", megapools: "Minipools erstellen oder migrieren", megapoolsOverview: "Übersicht", createMegapoolValidator: "Einen neuen Minipool (Validator) erstellen", credit: "Das Einzahlungskreditsystem", stakeOnBehalf: "ETH im Namen des Nodes staken", maintenance: "Überwachung & Wartung", maintenanceOverview: "Übersicht", performance: "Die Leistung Ihres Nodes überwachen", grafana: "Das Grafana-Dashboard einrichten", alerting: "Smartnode-Stack-Benachrichtigungen", updates: "Nach Updates suchen", backups: "Ihren Node sichern", masquerade: "Als andere Node-Adresse maskieren", historyExpiry: "Pre-Merge-Verlauf ablaufen lassen", pruning: "Den Execution-Client beschneiden", changeClients: "Execution- oder Consensus-Clients wechseln", nodeMigration: "Von einem Node zu einem anderen wechseln", rewards: "Belohnungen einfordern", rewardsOverview: "Übersicht", claimingRewards: "Node-Betreiber-Belohnungen einfordern", skimming: "Abgeschöpfte Belohnungen verteilen", exiting: "Ihre Minipools verlassen", shutdown: "Einen Minipool schließen", faq: "FAQ (In Arbeit)" },
    odao: { title: "Oracle DAO", overview: "Das Rocket Pool Oracle DAO", setup: "Einen Oracle DAO Node einrichten", testing: "Ihren Oracle DAO Node testen", monitoring: "Ihren Oracle DAO Node überwachen", proposals: "Oracle DAO Vorschläge" },
    pdao: { title: "Protokoll DAO", overview: "Übersicht", pdao: "Das Protokoll DAO", participating: "An Vorschlägen teilnehmen" },
    upgrades: { title: "Protokoll-Upgrades", saturn1: "Das Saturn 1 Upgrade", saturn0: "Das Saturn 0 Upgrade", houston: "Das Houston Upgrade", houstonOverview: "Übersicht", houstonGettingStarted: "Erste Schritte mit Houston", houstonPdao: "Das Protokoll DAO", atlas: "Das Atlas Update", lebs: "Minipools mit niedrigem ETH Bond", redstone: "Redstone & The Merge", redstoneWhatsNew: "Das Rocket Pool Redstone Update", redstoneDocker: "[Docker-Modus] Leitfaden zum Redstone Update und The Merge", redstoneHybrid: "[Hybrid-Modus] Leitfaden zum Redstone Update und The Merge", redstoneNative: "[Native-Modus] Leitfaden zum Redstone Update und The Merge" },
    testnet: { title: "Testnet", overview: "Mit dem Testnetzwerk üben", mainnet: "Vom Testnetzwerk zum Mainnet migrieren" },
    legacy: { title: "Alte Anleitungen", v13Update: "Upgrade auf Smartnode v1.3.x", migrating: "Smartnode von früheren Beta-Tests migrieren", atlas: "Das Atlas-Update", lebs: "Minipools mit niedrigerem ETH-Bond", redstone: "Redstone & The Merge", redstoneWhatsNew: "Das Rocket Pool Redstone Update", redstoneDocker: "[Docker-Modus] Anleitung zum Redstone-Update und The Merge", redstoneHybrid: "[Hybrid-Modus] Anleitung zum Redstone-Update und The Merge", redstoneNative: "[Native-Modus] Anleitung zum Redstone-Update und The Merge", houston: "Das Houston-Upgrade", houstonOverview: "Übersicht", houstonGettingStarted: "Erste Schritte mit Houston", houstonPdao: "Das Protokoll-DAO", houstonParticipate: "An Vorschlägen teilnehmen", houstonStakeOnBehalf: "ETH im Namen des Nodes staken", houstonRplWithdrawal: "RPL-Auszahlungsadresse", preparePi: "Einen Raspberry Pi vorbereiten" },
  },
  ja: {
    protocol: { title: "概要", overview: "概要", explainerSeries: "解説シリーズ", faq: "よくある質問", contracts: "コントラクトと統合", glossary: "用語集" },
    liquidStaking: { title: "リキッドステーキング (rETH)", overview: "概要", viaRp: "Rocket Pool経由で直接ステーキング", viaL1: "Layer 1のDEX経由でステーキング", viaL2: "Layer 2のDEX経由でステーキング", onBehalf: "ノードの代理でステーキング" },
    nodeStaking: { title: "ノードオペレーターガイド", responsibilities: "ノードオペレーターの責任", platform: "ノード要件とプラットフォームの選択", localNode: "ローカルノードの準備", localOverview: "概要", hardware: "ステーキングハードウェアの選択", preparePC: "PC、ミニPC、NUCの準備", prepareMac: "Macの準備", ssh: "Secure Shell (SSH) 入門", serverNode: "サーバーノードの準備", serverOverview: "概要", providers: "ホスティングプロバイダーの選択", serverOS: "オペレーティングシステムの準備", securing: "ノードのセキュリティ確保", tailscale: "Tailscale", installing: "Rocket Poolのインストール", installOverview: "概要", ethClients: "ETHクライアントの選択", installModes: "Rocket Poolモードの選択", docker: "Dockerで標準Rocket Poolノードを作成", native: "Dockerなしでネイティブ Rocket Poolノードを作成", configuring: "Rocket Poolの設定", configOverview: "概要", configDocker: "Smartnodeスタックの設定 (Docker/ハイブリッドモード)", configNative: "Smartnodeスタックの設定 (ネイティブ)", advancedConfig: "Dockerモード用高度なSmartnode設定", provisioning: "ノードのプロビジョニング", provisioningOverview: "概要", startingRp: "Rocket Poolの起動", walletInit: "新規ウォレットの作成", recovering: "既存ウォレットのインポート/復元", prepareNode: "運用のためのノード準備", cliIntro: "コマンドラインインターフェース入門", fallback: "フォールバックノードの指定", feeDistrib: "手数料分配とスムージングプール", mev: "MEV、MEV-Boost、MEV報酬", megapools: "Minipoolの作成または移行", megapoolsOverview: "概要", createMegapoolValidator: "新しいMinipool (バリデーター) の作成", credit: "デポジットクレジットシステム", stakeOnBehalf: "ノードの代わりにETHをステーク", maintenance: "監視とメンテナンス", maintenanceOverview: "概要", performance: "ノードパフォーマンスの監視", grafana: "Grafanaダッシュボードの設定", alerting: "Smartnodeスタックアラート通知", updates: "アップデートの確認", backups: "ノードのバックアップ", masquerade: "別のノードアドレスとして偽装", historyExpiry: "マージ前履歴の期限切れ", pruning: "実行クライアントのプルーニング", changeClients: "実行またはコンセンサスクライアントの変更", nodeMigration: "ノード間の移行", rewards: "報酬の請求", rewardsOverview: "概要", claimingRewards: "ノードオペレーター報酬の請求", skimming: "スキミング報酬の分配", exiting: "Minipoolからの退出", shutdown: "Minipoolのシャットダウン", faq: "FAQ (作成中)" },
    odao: { title: "Oracle DAO", overview: "Rocket Pool Oracle DAO", setup: "Oracle DAOノードの設定", testing: "Oracle DAOノードのテスト", monitoring: "Oracle DAOノードの監視", proposals: "Oracle DAO提案" },
    pdao: { title: "プロトコルDAO", overview: "概要", pdao: "プロトコルDAO", participating: "提案への参加" },
    upgrades: { title: "プロトコルアップグレード", saturn1: "Saturn 1アップグレード", saturn0: "Saturn 0アップグレード", houston: "Houstonアップグレード", houstonOverview: "概要", houstonGettingStarted: "Houstonを始める", houstonPdao: "プロトコルDAO", atlas: "Atlasアップデート", lebs: "低ETHボンドMinipools", redstone: "Redstoneとマージ", redstoneWhatsNew: "Rocket Pool Redstoneアップデート", redstoneDocker: "[Dockerモード] Redstoneアップデートとマージガイド", redstoneHybrid: "[ハイブリッドモード] Redstoneアップデートとマージガイド", redstoneNative: "[ネイティブモード] Redstoneアップデートとマージガイド" },
    testnet: { title: "テストネット", overview: "テストネットワークで練習", mainnet: "テストネットワークからメインネットへの移行" },
    legacy: { title: "レガシーガイド", v13Update: "Smartnode v1.3.xへのアップグレード", migrating: "以前のベータテストからのSmartnode移行", atlas: "Atlasアップデート", lebs: "低ETHボンドMinipool", redstone: "Redstoneとマージ", redstoneWhatsNew: "Rocket Pool Redstoneアップデート", redstoneDocker: "[Dockerモード] Redstoneアップデートとマージガイド", redstoneHybrid: "[ハイブリッドモード] Redstoneアップデートとマージガイド", redstoneNative: "[ネイティブモード] Redstoneアップデートとマージガイド", houston: "Houstonアップグレード", houstonOverview: "概要", houstonGettingStarted: "Houstonを始める", houstonPdao: "プロトコルDAO", houstonParticipate: "提案への参加", houstonStakeOnBehalf: "ノードの代理でETHをステーク", houstonRplWithdrawal: "RPL引き出しアドレス", preparePi: "Raspberry Piの準備" },
  },
  ko: {
    protocol: { title: "개요", overview: "개요", explainerSeries: "설명 시리즈", faq: "자주 묻는 질문", contracts: "컨트랙트 및 통합", glossary: "용어집" },
    liquidStaking: { title: "리퀴드 스테이킹 (rETH)", overview: "개요", viaRp: "Rocket Pool을 통한 직접 스테이킹", viaL1: "Layer 1 DEX를 통한 스테이킹", viaL2: "Layer 2 DEX를 통한 스테이킹", onBehalf: "노드를 대신하여 스테이킹" },
    nodeStaking: { title: "노드 운영자 가이드", responsibilities: "노드 운영자의 책임", platform: "노드 요구 사항 및 플랫폼 선택", localNode: "로컬 노드 준비", localOverview: "개요", hardware: "스테이킹 하드웨어 선택", preparePC: "PC, 미니 PC 또는 NUC 준비", prepareMac: "Mac 준비", ssh: "Secure Shell (SSH) 소개", serverNode: "서버 노드 준비", serverOverview: "개요", providers: "호스팅 제공업체 선택", serverOS: "운영 체제 준비", securing: "노드 보안", tailscale: "Tailscale", installing: "Rocket Pool 설치", installOverview: "개요", ethClients: "ETH 클라이언트 선택", installModes: "Rocket Pool 모드 선택", docker: "Docker로 표준 Rocket Pool 노드 생성", native: "Docker 없이 네이티브 Rocket Pool 노드 생성", configuring: "Rocket Pool 구성", configOverview: "개요", configDocker: "Smartnode 스택 구성 (Docker/하이브리드 모드)", configNative: "Smartnode 스택 구성 (네이티브)", advancedConfig: "Docker 모드용 고급 Smartnode 구성", provisioning: "노드 프로비저닝", provisioningOverview: "개요", startingRp: "Rocket Pool 시작", walletInit: "새 지갑 생성", recovering: "기존 지갑 가져오기/복구", prepareNode: "운영을 위한 노드 준비", cliIntro: "명령줄 인터페이스 소개", fallback: "폴백 노드 지정", feeDistrib: "수수료 분배기와 스무딩 풀", mev: "MEV, MEV-Boost 및 MEV 보상", megapools: "Minipool 생성 또는 마이그레이션", megapoolsOverview: "개요", createMegapoolValidator: "새 Minipool (검증자) 생성", credit: "예치금 크레딧 시스템", stakeOnBehalf: "노드 대신 ETH 스테이킹", maintenance: "모니터링 및 유지 관리", maintenanceOverview: "개요", performance: "노드 성능 모니터링", grafana: "Grafana 대시보드 설정", alerting: "Smartnode 스택 알림", updates: "업데이트 확인", backups: "노드 백업", masquerade: "다른 노드 주소로 위장", historyExpiry: "머지 이전 기록 만료", pruning: "실행 클라이언트 프루닝", changeClients: "실행 또는 합의 클라이언트 변경", nodeMigration: "노드 간 이동", rewards: "보상 청구", rewardsOverview: "개요", claimingRewards: "노드 운영자 보상 청구", skimming: "스키밍 보상 분배", exiting: "Minipool 종료", shutdown: "Minipool 종료", faq: "FAQ (진행 중)" },
    odao: { title: "Oracle DAO", overview: "Rocket Pool Oracle DAO", setup: "Oracle DAO 노드 설정", testing: "Oracle DAO 노드 테스트", monitoring: "Oracle DAO 노드 모니터링", proposals: "Oracle DAO 제안" },
    pdao: { title: "프로토콜 DAO", overview: "개요", pdao: "프로토콜 DAO", participating: "제안 참여" },
    upgrades: { title: "프로토콜 업그레이드", saturn1: "Saturn 1 업그레이드", saturn0: "Saturn 0 업그레이드", houston: "Houston 업그레이드", houstonOverview: "개요", houstonGettingStarted: "Houston 시작하기", houstonPdao: "프로토콜 DAO", atlas: "Atlas 업데이트", lebs: "낮은 ETH 본드 Minipools", redstone: "Redstone과 머지", redstoneWhatsNew: "Rocket Pool Redstone 업데이트", redstoneDocker: "[Docker 모드] Redstone 업데이트 및 머지 가이드", redstoneHybrid: "[하이브리드 모드] Redstone 업데이트 및 머지 가이드", redstoneNative: "[네이티브 모드] Redstone 업데이트 및 머지 가이드" },
    testnet: { title: "테스트넷", overview: "테스트 네트워크로 연습", mainnet: "테스트 네트워크에서 메인넷으로 마이그레이션" },
    legacy: { title: "레거시 가이드", v13Update: "Smartnode v1.3.x로 업그레이드", migrating: "이전 베타 테스트에서 Smartnode 마이그레이션", atlas: "Atlas 업데이트", lebs: "낮은 ETH 본드 Minipool", redstone: "Redstone 및 머지", redstoneWhatsNew: "Rocket Pool Redstone 업데이트", redstoneDocker: "[Docker 모드] Redstone 업데이트 및 머지 가이드", redstoneHybrid: "[하이브리드 모드] Redstone 업데이트 및 머지 가이드", redstoneNative: "[네이티브 모드] Redstone 업데이트 및 머지 가이드", houston: "Houston 업그레이드", houstonOverview: "개요", houstonGettingStarted: "Houston 시작하기", houstonPdao: "프로토콜 DAO", houstonParticipate: "제안 참여", houstonStakeOnBehalf: "노드를 대신하여 ETH 스테이크", houstonRplWithdrawal: "RPL 출금 주소", preparePi: "Raspberry Pi 준비" },
  },
  pt: {
    protocol: { title: "Visão Geral", overview: "Visão Geral", explainerSeries: "Série Explicativa", faq: "Perguntas Frequentes", contracts: "Contratos e Integrações", glossary: "Glossário" },
    liquidStaking: { title: "Staking Líquido (rETH)", overview: "Visão Geral", viaRp: "Staking direto via Rocket Pool", viaL1: "Staking via DEX na Layer 1", viaL2: "Staking via DEX na Layer 2", onBehalf: "Staking em nome de um nó" },
    nodeStaking: { title: "Guia do Operador de Nó", responsibilities: "Responsabilidades do Operador de Nó", platform: "Requisitos do Nó e Escolha de Plataforma", localNode: "Preparando um Nó Local", localOverview: "Visão Geral", hardware: "Selecionando Hardware para Staking", preparePC: "Preparando um PC, Mini-PC ou NUC", prepareMac: "Preparando um Mac", ssh: "Introdução ao Secure Shell (SSH)", serverNode: "Preparando um Nó em Servidor", serverOverview: "Visão Geral", providers: "Selecionando um Provedor de Hospedagem", serverOS: "Preparando o Sistema Operacional", securing: "Protegendo Seu Nó", tailscale: "Tailscale", installing: "Instalando o Rocket Pool", installOverview: "Visão Geral", ethClients: "Escolhendo seus Clientes ETH", installModes: "Selecionando um Modo Rocket Pool", docker: "Criando um Nó Rocket Pool Padrão com Docker", native: "Criando um Nó Rocket Pool Nativo sem Docker", configuring: "Configurando o Rocket Pool", configOverview: "Visão Geral", configDocker: "Configurando a Stack Smartnode (modo Docker/híbrido)", configNative: "Configurando a Stack Smartnode (nativo)", advancedConfig: "Configuração Avançada do Smartnode para Modo Docker", provisioning: "Provisionando Seu Nó", provisioningOverview: "Visão Geral", startingRp: "Iniciando o Rocket Pool", walletInit: "Criando uma Nova Carteira", recovering: "Importando/Recuperando uma Carteira Existente", prepareNode: "Preparando Seu Nó para Operação", cliIntro: "Introdução à Interface de Linha de Comando", fallback: "Especificando um Nó de Fallback", feeDistrib: "Distribuidores de Taxas e o Smoothing Pool", mev: "MEV, MEV-Boost e Recompensas MEV", megapools: "Criando ou Migrando Minipools", megapoolsOverview: "Visão Geral", createMegapoolValidator: "Criando um novo Minipool (Validador)", credit: "O Sistema de Crédito de Depósito", stakeOnBehalf: "Staking de ETH em Nome do Nó", maintenance: "Monitoramento e Manutenção", maintenanceOverview: "Visão Geral", performance: "Monitorando o Desempenho do Seu Nó", grafana: "Configurando o Painel Grafana", alerting: "Notificações de Alerta da Stack Smartnode", updates: "Verificando Atualizações", backups: "Fazendo Backup do Seu Nó", masquerade: "Mascarando como Outro Endereço de Nó", historyExpiry: "Expirando Histórico Pré-Merge", pruning: "Podando o Cliente de Execução", changeClients: "Alterando Clientes de Execução ou Consenso", nodeMigration: "Movendo de um Nó para Outro", rewards: "Reivindicando Recompensas", rewardsOverview: "Visão Geral", claimingRewards: "Reivindicando Recompensas de Operador de Nó", skimming: "Distribuindo Recompensas Desnatadas", exiting: "Saindo dos Seus Minipools", shutdown: "Encerrar um Minipool", faq: "FAQ (Em andamento)" },
    odao: { title: "Oracle DAO", overview: "O Oracle DAO do Rocket Pool", setup: "Configurando um Nó Oracle DAO", testing: "Testando seu Nó Oracle DAO", monitoring: "Monitorando seu Nó Oracle DAO", proposals: "Propostas do Oracle DAO" },
    pdao: { title: "Protocolo DAO", overview: "Visão Geral", pdao: "O Protocolo DAO", participating: "Participando de Propostas" },
    upgrades: { title: "Atualizações do Protocolo", saturn1: "A Atualização Saturn 1", saturn0: "A Atualização Saturn 0", houston: "A Atualização Houston", houstonOverview: "Visão Geral", houstonGettingStarted: "Começando com Houston", houstonPdao: "O Protocolo DAO", atlas: "A Atualização Atlas", lebs: "Minipools de Baixo ETH Bond", redstone: "Redstone e The Merge", redstoneWhatsNew: "A Atualização Rocket Pool Redstone", redstoneDocker: "[Modo Docker] Guia da Atualização Redstone e The Merge", redstoneHybrid: "[Modo Híbrido] Guia da Atualização Redstone e The Merge", redstoneNative: "[Modo Nativo] Guia da Atualização Redstone e The Merge" },
    testnet: { title: "Testnet", overview: "Praticando com a Rede de Teste", mainnet: "Migrando da Rede de Teste para a Mainnet" },
    legacy: { title: "Guias Antigos", v13Update: "Atualizando para Smartnode v1.3.x", migrating: "Migrando o Smartnode de Testes Beta Anteriores", atlas: "A Atualização Atlas", lebs: "Minipools com Menor Garantia ETH", redstone: "Redstone e The Merge", redstoneWhatsNew: "A Atualização Redstone do Rocket Pool", redstoneDocker: "[Modo Docker] Guia da Atualização Redstone e The Merge", redstoneHybrid: "[Modo Híbrido] Guia da Atualização Redstone e The Merge", redstoneNative: "[Modo Nativo] Guia da Atualização Redstone e The Merge", houston: "A Atualização Houston", houstonOverview: "Visão Geral", houstonGettingStarted: "Começando com Houston", houstonPdao: "O Protocolo DAO", houstonParticipate: "Participando de Propostas", houstonStakeOnBehalf: "Fazer Stake de ETH em Nome do Nó", houstonRplWithdrawal: "Endereço de Saque de RPL", preparePi: "Preparando um Raspberry Pi" },
  },
  ru: {
    protocol: { title: "Обзор", overview: "Обзор", explainerSeries: "Серия объяснений", faq: "Часто задаваемые вопросы", contracts: "Контракты и интеграции", glossary: "Глоссарий" },
    liquidStaking: { title: "Ликвидный стейкинг (rETH)", overview: "Обзор", viaRp: "Стейкинг напрямую через Rocket Pool", viaL1: "Стейкинг через DEX на Layer 1", viaL2: "Стейкинг через DEX на Layer 2", onBehalf: "Стейкинг от имени ноды" },
    nodeStaking: { title: "Руководство оператора ноды", responsibilities: "Обязанности оператора ноды", platform: "Требования к ноде и выбор платформы", localNode: "Подготовка локальной ноды", localOverview: "Обзор", hardware: "Выбор оборудования для стейкинга", preparePC: "Подготовка ПК, мини-ПК или NUC", prepareMac: "Подготовка Mac", ssh: "Введение в Secure Shell (SSH)", serverNode: "Подготовка серверной ноды", serverOverview: "Обзор", providers: "Выбор хостинг-провайдера", serverOS: "Подготовка операционной системы", securing: "Защита вашей ноды", tailscale: "Tailscale", installing: "Установка Rocket Pool", installOverview: "Обзор", ethClients: "Выбор ETH-клиентов", installModes: "Выбор режима Rocket Pool", docker: "Создание стандартной ноды Rocket Pool с Docker", native: "Создание нативной ноды Rocket Pool без Docker", configuring: "Настройка Rocket Pool", configOverview: "Обзор", configDocker: "Настройка стека Smartnode (режим Docker/гибридный)", configNative: "Настройка стека Smartnode (нативный)", advancedConfig: "Расширенная настройка Smartnode для режима Docker", provisioning: "Подготовка вашей ноды", provisioningOverview: "Обзор", startingRp: "Запуск Rocket Pool", walletInit: "Создание нового кошелька", recovering: "Импорт/восстановление существующего кошелька", prepareNode: "Подготовка ноды к работе", cliIntro: "Введение в командную строку", fallback: "Указание резервной ноды", feeDistrib: "Распределители комиссий и Smoothing Pool", mev: "MEV, MEV-Boost и вознаграждения MEV", megapools: "Создание или миграция Minipool", megapoolsOverview: "Обзор", createMegapoolValidator: "Создание нового Minipool (валидатора)", credit: "Система депозитных кредитов", stakeOnBehalf: "Стейкинг ETH от имени ноды", maintenance: "Мониторинг и обслуживание", maintenanceOverview: "Обзор", performance: "Мониторинг производительности ноды", grafana: "Настройка панели Grafana", alerting: "Уведомления стека Smartnode", updates: "Проверка обновлений", backups: "Резервное копирование ноды", masquerade: "Маскировка под другой адрес ноды", historyExpiry: "Истечение истории до слияния", pruning: "Обрезка клиента исполнения", changeClients: "Смена клиентов исполнения или консенсуса", nodeMigration: "Переход с одной ноды на другую", rewards: "Получение вознаграждений", rewardsOverview: "Обзор", claimingRewards: "Получение вознаграждений оператора ноды", skimming: "Распределение снятых вознаграждений", exiting: "Выход из Minipool", shutdown: "Закрытие Minipool", faq: "FAQ (В процессе)" },
    odao: { title: "Oracle DAO", overview: "Rocket Pool Oracle DAO", setup: "Настройка ноды Oracle DAO", testing: "Тестирование ноды Oracle DAO", monitoring: "Мониторинг ноды Oracle DAO", proposals: "Предложения Oracle DAO" },
    pdao: { title: "Протокол DAO", overview: "Обзор", pdao: "Протокол DAO", participating: "Участие в предложениях" },
    upgrades: { title: "Обновления протокола", saturn1: "Обновление Saturn 1", saturn0: "Обновление Saturn 0", houston: "Обновление Houston", houstonOverview: "Обзор", houstonGettingStarted: "Начало работы с Houston", houstonPdao: "Протокол DAO", atlas: "Обновление Atlas", lebs: "Minipools с низким залогом ETH", redstone: "Redstone и слияние", redstoneWhatsNew: "Обновление Rocket Pool Redstone", redstoneDocker: "[Режим Docker] Руководство по обновлению Redstone и слиянию", redstoneHybrid: "[Гибридный режим] Руководство по обновлению Redstone и слиянию", redstoneNative: "[Нативный режим] Руководство по обновлению Redstone и слиянию" },
    testnet: { title: "Тестнет", overview: "Практика в тестовой сети", mainnet: "Миграция из тестовой сети в мейннет" },
    legacy: { title: "Устаревшие руководства", v13Update: "Обновление до Smartnode v1.3.x", migrating: "Миграция Smartnode с предыдущих бета-тестов", atlas: "Обновление Atlas", lebs: "Minipool с низким залогом ETH", redstone: "Redstone и слияние", redstoneWhatsNew: "Обновление Rocket Pool Redstone", redstoneDocker: "[Режим Docker] Руководство по обновлению Redstone и слиянию", redstoneHybrid: "[Гибридный режим] Руководство по обновлению Redstone и слиянию", redstoneNative: "[Нативный режим] Руководство по обновлению Redstone и слиянию", houston: "Обновление Houston", houstonOverview: "Обзор", houstonGettingStarted: "Начало работы с Houston", houstonPdao: "Протокол DAO", houstonParticipate: "Участие в предложениях", houstonStakeOnBehalf: "Стейкинг ETH от имени ноды", houstonRplWithdrawal: "Адрес вывода RPL", preparePi: "Подготовка Raspberry Pi" },
  },
  it: {
    protocol: { title: "Panoramica", overview: "Panoramica", explainerSeries: "Serie Esplicativa", faq: "Domande Frequenti", contracts: "Contratti e Integrazioni", glossary: "Glossario" },
    liquidStaking: { title: "Liquid Staking (rETH)", overview: "Panoramica", viaRp: "Staking diretto via Rocket Pool", viaL1: "Staking via DEX su Layer 1", viaL2: "Staking via DEX su Layer 2", onBehalf: "Staking per conto di un nodo" },
    nodeStaking: { title: "Guida dell'Operatore di Nodo", responsibilities: "Responsabilità dell'Operatore di Nodo", platform: "Requisiti del Nodo e Scelta della Piattaforma", localNode: "Preparare un Nodo Locale", localOverview: "Panoramica", hardware: "Selezione dell'Hardware per lo Staking", preparePC: "Preparare un PC, Mini-PC o NUC", prepareMac: "Preparare un Mac", ssh: "Introduzione a Secure Shell (SSH)", serverNode: "Preparare un Nodo Server", serverOverview: "Panoramica", providers: "Selezione di un Provider di Hosting", serverOS: "Preparazione del Sistema Operativo", securing: "Proteggere il Tuo Nodo", tailscale: "Tailscale", installing: "Installazione di Rocket Pool", installOverview: "Panoramica", ethClients: "Scelta dei Client ETH", installModes: "Selezione di una Modalità Rocket Pool", docker: "Creazione di un Nodo Rocket Pool Standard con Docker", native: "Creazione di un Nodo Rocket Pool Nativo senza Docker", configuring: "Configurazione di Rocket Pool", configOverview: "Panoramica", configDocker: "Configurazione dello Stack Smartnode (modalità Docker/ibrida)", configNative: "Configurazione dello Stack Smartnode (nativo)", advancedConfig: "Configurazione Avanzata Smartnode per Modalità Docker", provisioning: "Provisioning del Tuo Nodo", provisioningOverview: "Panoramica", startingRp: "Avvio di Rocket Pool", walletInit: "Creazione di un Nuovo Portafoglio", recovering: "Importazione/Recupero di un Portafoglio Esistente", prepareNode: "Preparazione del Nodo per l'Operazione", cliIntro: "Introduzione all'Interfaccia a Riga di Comando", fallback: "Specifica di un Nodo di Fallback", feeDistrib: "Distributori di Commissioni e lo Smoothing Pool", mev: "MEV, MEV-Boost e Ricompense MEV", megapools: "Creazione o Migrazione di Minipool", megapoolsOverview: "Panoramica", createMegapoolValidator: "Creazione di un nuovo Minipool (Validatore)", credit: "Il Sistema di Credito per Depositi", stakeOnBehalf: "Stake ETH per Conto del Nodo", maintenance: "Monitoraggio e Manutenzione", maintenanceOverview: "Panoramica", performance: "Monitoraggio delle Prestazioni del Nodo", grafana: "Configurazione della Dashboard Grafana", alerting: "Notifiche di Avviso dello Stack Smartnode", updates: "Verifica degli Aggiornamenti", backups: "Backup del Tuo Nodo", masquerade: "Mascheramento come Altro Indirizzo di Nodo", historyExpiry: "Scadenza della Cronologia Pre-Merge", pruning: "Potatura del Client di Esecuzione", changeClients: "Cambio dei Client di Esecuzione o Consenso", nodeMigration: "Passaggio da un Nodo all'Altro", rewards: "Richiesta delle Ricompense", rewardsOverview: "Panoramica", claimingRewards: "Richiesta delle Ricompense dell'Operatore di Nodo", skimming: "Distribuzione delle Ricompense Scremate", exiting: "Uscita dai Tuoi Minipool", shutdown: "Chiusura di un Minipool", faq: "FAQ (In corso)" },
    odao: { title: "Oracle DAO", overview: "L'Oracle DAO di Rocket Pool", setup: "Configurazione di un Nodo Oracle DAO", testing: "Test del Tuo Nodo Oracle DAO", monitoring: "Monitoraggio del Tuo Nodo Oracle DAO", proposals: "Proposte dell'Oracle DAO" },
    pdao: { title: "Protocollo DAO", overview: "Panoramica", pdao: "Il Protocollo DAO", participating: "Partecipazione alle Proposte" },
    upgrades: { title: "Aggiornamenti del Protocollo", saturn1: "L'Aggiornamento Saturn 1", saturn0: "L'Aggiornamento Saturn 0", houston: "L'Aggiornamento Houston", houstonOverview: "Panoramica", houstonGettingStarted: "Iniziare con Houston", houstonPdao: "Il Protocollo DAO", atlas: "L'Aggiornamento Atlas", lebs: "Minipools a Basso ETH Bond", redstone: "Redstone e The Merge", redstoneWhatsNew: "L'Aggiornamento Rocket Pool Redstone", redstoneDocker: "[Modalità Docker] Guida all'Aggiornamento Redstone e The Merge", redstoneHybrid: "[Modalità Ibrida] Guida all'Aggiornamento Redstone e The Merge", redstoneNative: "[Modalità Nativa] Guida all'Aggiornamento Redstone e The Merge" },
    testnet: { title: "Testnet", overview: "Pratica con la Rete di Test", mainnet: "Migrazione dalla Rete di Test alla Mainnet" },
    legacy: { title: "Guide Legacy", v13Update: "Aggiornamento a Smartnode v1.3.x", migrating: "Migrazione dello Smartnode dai Test Beta Precedenti", atlas: "L'Aggiornamento Atlas", lebs: "Minipool con Garanzia ETH Inferiore", redstone: "Redstone e The Merge", redstoneWhatsNew: "L'Aggiornamento Redstone di Rocket Pool", redstoneDocker: "[Modalità Docker] Guida all'Aggiornamento Redstone e The Merge", redstoneHybrid: "[Modalità Ibrida] Guida all'Aggiornamento Redstone e The Merge", redstoneNative: "[Modalità Nativa] Guida all'Aggiornamento Redstone e The Merge", houston: "L'Aggiornamento Houston", houstonOverview: "Panoramica", houstonGettingStarted: "Iniziare con Houston", houstonPdao: "Il Protocollo DAO", houstonParticipate: "Partecipazione alle Proposte", houstonStakeOnBehalf: "Stake di ETH per Conto del Nodo", houstonRplWithdrawal: "Indirizzo di Prelievo RPL", preparePi: "Preparazione di un Raspberry Pi" },
  },
  tr: {
    protocol: { title: "Genel Bakış", overview: "Genel Bakış", explainerSeries: "Açıklama Serisi", faq: "Sık Sorulan Sorular", contracts: "Sözleşmeler ve Entegrasyonlar", glossary: "Sözlük" },
    liquidStaking: { title: "Likit Staking (rETH)", overview: "Genel Bakış", viaRp: "Rocket Pool üzerinden doğrudan staking", viaL1: "Layer 1'de DEX üzerinden staking", viaL2: "Layer 2'de DEX üzerinden staking", onBehalf: "Bir düğüm adına staking" },
    nodeStaking: { title: "Düğüm Operatörü Kılavuzu", responsibilities: "Düğüm Operatörünün Sorumlulukları", platform: "Düğüm Gereksinimleri ve Platform Seçimi", localNode: "Yerel Düğüm Hazırlama", localOverview: "Genel Bakış", hardware: "Staking Donanımı Seçimi", preparePC: "PC, Mini-PC veya NUC Hazırlama", prepareMac: "Mac Hazırlama", ssh: "Secure Shell (SSH) Girişi", serverNode: "Sunucu Düğümü Hazırlama", serverOverview: "Genel Bakış", providers: "Barındırma Sağlayıcısı Seçimi", serverOS: "İşletim Sistemini Hazırlama", securing: "Düğümünüzü Güvence Altına Alma", tailscale: "Tailscale", installing: "Rocket Pool Kurulumu", installOverview: "Genel Bakış", ethClients: "ETH İstemcilerinizi Seçme", installModes: "Rocket Pool Modu Seçimi", docker: "Docker ile Standart Rocket Pool Düğümü Oluşturma", native: "Docker Olmadan Native Rocket Pool Düğümü Oluşturma", configuring: "Rocket Pool Yapılandırması", configOverview: "Genel Bakış", configDocker: "Smartnode Stack Yapılandırması (Docker/hibrit mod)", configNative: "Smartnode Stack Yapılandırması (native)", advancedConfig: "Docker Modu için Gelişmiş Smartnode Yapılandırması", provisioning: "Düğümünüzü Hazırlama", provisioningOverview: "Genel Bakış", startingRp: "Rocket Pool'u Başlatma", walletInit: "Yeni Cüzdan Oluşturma", recovering: "Mevcut Cüzdanı İçe Aktarma/Kurtarma", prepareNode: "Düğümünüzü Operasyona Hazırlama", cliIntro: "Komut Satırı Arayüzüne Giriş", fallback: "Yedek Düğüm Belirleme", feeDistrib: "Ücret Dağıtıcıları ve Smoothing Pool", mev: "MEV, MEV-Boost ve MEV Ödülleri", megapools: "Minipool Oluşturma veya Taşıma", megapoolsOverview: "Genel Bakış", createMegapoolValidator: "Yeni Minipool (Doğrulayıcı) Oluşturma", credit: "Depozito Kredi Sistemi", stakeOnBehalf: "Düğüm Adına ETH Stake Etme", maintenance: "İzleme ve Bakım", maintenanceOverview: "Genel Bakış", performance: "Düğüm Performansını İzleme", grafana: "Grafana Panelini Kurma", alerting: "Smartnode Stack Uyarı Bildirimleri", updates: "Güncellemeleri Kontrol Etme", backups: "Düğümünüzü Yedekleme", masquerade: "Başka Düğüm Adresi Olarak Maskeleme", historyExpiry: "Merge Öncesi Geçmişi Sona Erdirme", pruning: "Execution Client Budama", changeClients: "Execution veya Consensus Client Değiştirme", nodeMigration: "Bir Düğümden Diğerine Taşıma", rewards: "Ödül Talep Etme", rewardsOverview: "Genel Bakış", claimingRewards: "Düğüm Operatörü Ödüllerini Talep Etme", skimming: "Alınan Ödülleri Dağıtma", exiting: "Minipool'larınızdan Çıkış", shutdown: "Minipool Kapatma", faq: "SSS (Devam Ediyor)" },
    odao: { title: "Oracle DAO", overview: "Rocket Pool Oracle DAO", setup: "Oracle DAO Düğümü Kurulumu", testing: "Oracle DAO Düğümünüzü Test Etme", monitoring: "Oracle DAO Düğümünüzü İzleme", proposals: "Oracle DAO Önerileri" },
    pdao: { title: "Protokol DAO", overview: "Genel Bakış", pdao: "Protokol DAO", participating: "Önerilere Katılım" },
    upgrades: { title: "Protokol Güncellemeleri", saturn1: "Saturn 1 Güncellemesi", saturn0: "Saturn 0 Güncellemesi", houston: "Houston Güncellemesi", houstonOverview: "Genel Bakış", houstonGettingStarted: "Houston'a Başlarken", houstonPdao: "Protokol DAO", atlas: "Atlas Güncellemesi", lebs: "Düşük ETH Bond Minipools", redstone: "Redstone ve Birleşme", redstoneWhatsNew: "Rocket Pool Redstone Güncellemesi", redstoneDocker: "[Docker Modu] Redstone Güncellemesi ve Birleşme Kılavuzu", redstoneHybrid: "[Hibrit Mod] Redstone Güncellemesi ve Birleşme Kılavuzu", redstoneNative: "[Yerel Mod] Redstone Güncellemesi ve Birleşme Kılavuzu" },
    testnet: { title: "Testnet", overview: "Test Ağında Pratik Yapma", mainnet: "Test Ağından Mainnet'e Geçiş" },
    legacy: { title: "Eski Kılavuzlar", v13Update: "Smartnode v1.3.x'e Yükseltme", migrating: "Önceki Beta Testlerinden Smartnode Taşıma", atlas: "Atlas Güncellemesi", lebs: "Düşük ETH Teminatlı Minipool'lar", redstone: "Redstone ve The Merge", redstoneWhatsNew: "Rocket Pool Redstone Güncellemesi", redstoneDocker: "[Docker Modu] Redstone Güncellemesi ve The Merge Kılavuzu", redstoneHybrid: "[Hibrit Modu] Redstone Güncellemesi ve The Merge Kılavuzu", redstoneNative: "[Native Modu] Redstone Güncellemesi ve The Merge Kılavuzu", houston: "Houston Güncellemesi", houstonOverview: "Genel Bakış", houstonGettingStarted: "Houston ile Başlarken", houstonPdao: "Protokol DAO", houstonParticipate: "Önerilere Katılım", houstonStakeOnBehalf: "Düğüm Adına ETH Stake Etme", houstonRplWithdrawal: "RPL Çekim Adresi", preparePi: "Raspberry Pi Hazırlama" },
  },
};

function localeNav(lang: string) {
  const t = navTranslations[lang];
  const prefix = lang === "en" ? "" : `/${lang}`;
  return [
    { text: t.protocol, link: `${prefix}/protocol/` },
    { text: t.liquidStaking, link: `${prefix}/liquid-staking/overview` },
    { text: t.nodeStaking, link: `${prefix}/node-staking/responsibilities` },
    { text: t.website, link: "https://www.rocketpool.net" },
  ];
}

const locales = [
  { lang: "en", label: "English", title: "Rocket Pool Guides & Documentation", description: "Rocket Pool Guides & Documentation - Decentralised Ethereum Liquid Staking Protocol" },
  { lang: "zh", label: "简体中文", title: "Rocket Pool 指南与文档", description: "Rocket Pool 指南与文档 - 去中心化以太坊流动性质押协议" },
  { lang: "es", label: "Español", title: "Guías y Documentación de Rocket Pool", description: "Guías y Documentación de Rocket Pool - Protocolo de Staking Líquido Descentralizado de Ethereum" },
  { lang: "fr", label: "Français", title: "Guides et Documentation Rocket Pool", description: "Guides et Documentation Rocket Pool - Protocole de Staking Liquide Décentralisé Ethereum" },
  { lang: "de", label: "Deutsch", title: "Rocket Pool Anleitungen & Dokumentation", description: "Rocket Pool Anleitungen & Dokumentation - Dezentrales Ethereum Liquid Staking Protokoll" },
  { lang: "ja", label: "日本語", title: "Rocket Pool ガイド＆ドキュメント", description: "Rocket Pool ガイド＆ドキュメント - 分散型イーサリアムリキッドステーキングプロトコル" },
  { lang: "ko", label: "한국어", title: "Rocket Pool 가이드 및 문서", description: "Rocket Pool 가이드 및 문서 - 탈중앙화 이더리움 리퀴드 스테이킹 프로토콜" },
  { lang: "pt", label: "Português", title: "Guias e Documentação Rocket Pool", description: "Guias e Documentação Rocket Pool - Protocolo de Staking Líquido Descentralizado Ethereum" },
  { lang: "ru", label: "Русский", title: "Руководства и документация Rocket Pool", description: "Руководства и документация Rocket Pool - Децентрализованный протокол ликвидного стейкинга Ethereum" },
  { lang: "it", label: "Italiano", title: "Guide e Documentazione Rocket Pool", description: "Guide e Documentazione Rocket Pool - Protocollo di Liquid Staking Ethereum Decentralizzato" },
  { lang: "tr", label: "Türkçe", title: "Rocket Pool Kılavuzları ve Dokümantasyon", description: "Rocket Pool Kılavuzları ve Dokümantasyon - Merkeziyetsiz Ethereum Likit Staking Protokolü" },
];

export default defineConfig({
  root: "docs",
  lang: "en",
  title: "Rocket Pool Guides & Documentation",
  description: "Rocket Pool Guides & Documentation - Decentralised Ethereum Liquid Staking Protocol",
  locales,
  route: {
    cleanUrls: true,
  },
  markdown: {
    checkDeadLinks: true,
  },
  head: [
    ["meta", { name: "theme-color", content: "#FF6E30" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/images/logo.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/images/logo.png" }],
  ],
  logoText: "Rocket Pool",
  mediumZoom: {
    selector: ".zoom",
  },
  themeConfig: {
    enableContentAnimation: false,
    enableAppearanceAnimation: false,
    hideNavbar: "auto",
    socialLinks: [
      {
        icon: "discord",
        mode: "link",
        content: "https://discord.gg/rocketpool",
      },
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/rocket-pool/docs.rocketpool.net",
      },
    ],
    editLink: {
      docRepoBaseUrl: "https://github.com/rocket-pool/docs.rocketpool.net/tree/main/docs",
      text: "📝 Edit this page on GitHub",
    },
    locales: locales.map(({ lang }) => ({
      lang,
      nav: localeNav(lang),
    })),
    sidebar: {
      ...localeSidebars(),
    },
  },
});

function protocol(prefix: string, lang: string) {
  const t = sidebarTranslations[lang].protocol;
  return [
    {
      text: t.title,
      collapsed: false,
      items: [
        { text: t.overview, link: `${prefix}/protocol/` },
        { text: t.explainerSeries, link: `${prefix}/protocol/explainer-series` },
        { text: t.faq, link: `${prefix}/protocol/faq` },
        { text: t.contracts, link: `${prefix}/protocol/contracts-integrations` },
        { text: t.glossary, link: `${prefix}/protocol/glossary` },
      ],
    },
  ];
}

function liquidStaking(prefix: string, lang: string) {
  const t = sidebarTranslations[lang].liquidStaking;
  return [
    {
      text: t.title,
      collapsed: false,
      items: [
        { text: t.overview, link: `${prefix}/liquid-staking/overview` },
        { text: t.viaRp, link: `${prefix}/liquid-staking/via-rp` },
        { text: t.viaL1, link: `${prefix}/liquid-staking/via-l1` },
        { text: t.viaL2, link: `${prefix}/liquid-staking/via-l2` },
        { text: t.onBehalf, link: `${prefix}/legacy/houston/stake-eth-on-behalf` },
      ],
    },
  ];
}

function nodeStaking(prefix: string, lang: string) {
  const t = sidebarTranslations[lang].nodeStaking;
  return [
    {
      text: t.title,
      items: [
        { text: t.responsibilities, link: `${prefix}/node-staking/responsibilities` },
        { text: t.platform, link: `${prefix}/node-staking/platform` },
        {
          text: t.localNode,
          link: `${prefix}/node-staking/local/overview`,
          collapsed: true,
          items: [
            { text: t.localOverview, link: `${prefix}/node-staking/local/overview` },
            { text: t.hardware, link: `${prefix}/node-staking/local/hardware` },
            { text: t.preparePC, link: `${prefix}/node-staking/local/prepare-pc` },
            { text: t.prepareMac, link: `${prefix}/node-staking/local/prepare-mac` },
            { text: t.ssh, link: `${prefix}/node-staking/ssh` },
          ],
        },
        {
          text: t.serverNode,
          link: `${prefix}/node-staking/vps/overview`,
          collapsed: true,
          items: [
            { text: t.serverOverview, link: `${prefix}/node-staking/vps/overview` },
            { text: t.providers, link: `${prefix}/node-staking/vps/providers` },
            { text: t.serverOS, link: `${prefix}/node-staking/vps/os` },
          ],
        },
        {
          text: t.securing,
          link: `${prefix}/node-staking/securing-your-node`,
          collapsed: true,
          items: [
            { text: t.securing, link: `${prefix}/node-staking/securing-your-node` },
            { text: t.tailscale, link: `${prefix}/node-staking/tailscale` },
          ],
        },
        {
          text: t.installing,
          link: `${prefix}/node-staking/installing/overview`,
          collapsed: true,
          items: [
            { text: t.installOverview, link: `${prefix}/node-staking/installing/overview` },
            { text: t.ethClients, link: `${prefix}/node-staking/eth-clients` },
            { text: t.installModes, link: `${prefix}/node-staking/install-modes` },
            { text: t.docker, link: `${prefix}/node-staking/docker` },
            { text: t.native, link: `${prefix}/node-staking/native` },
          ],
        },
        {
          text: t.configuring,
          link: `${prefix}/node-staking/config/overview`,
          collapsed: true,
          items: [
            { text: t.configOverview, link: `${prefix}/node-staking/config/overview` },
            { text: t.configDocker, link: `${prefix}/node-staking/config-docker` },
            { text: t.configNative, link: `${prefix}/node-staking/config-native` },
            { text: t.advancedConfig, link: `${prefix}/node-staking/advanced-config` },
          ],
        },
        {
          text: t.provisioning,
          link: `${prefix}/node-staking/provisioning/overview`,
          collapsed: true,
          items: [
            { text: t.provisioningOverview, link: `${prefix}/node-staking/provisioning/overview` },
            { text: t.startingRp, link: `${prefix}/node-staking/starting-rp` },
            { text: t.walletInit, link: `${prefix}/node-staking/wallet-init` },
            { text: t.recovering, link: `${prefix}/node-staking/recovering-rp` },
            { text: t.prepareNode, link: `${prefix}/node-staking/prepare-node` },
            { text: t.cliIntro, link: `${prefix}/node-staking/cli-intro` },
            { text: t.fallback, link: `${prefix}/node-staking/fallback` },
            { text: t.feeDistrib, link: `${prefix}/node-staking/fee-distrib-sp` },
            { text: t.mev, link: `${prefix}/node-staking/mev` },
          ],
        },
        {
          text: t.megapools,
          link: `${prefix}/node-staking/megapools/overview`,
          collapsed: true,
          items: [
            { text: t.megapoolsOverview, link: `${prefix}/node-staking/megapools/overview` },
            { text: t.createMegapoolValidator, link: `${prefix}/node-staking/megapools/create-megapool-validator` },
            { text: t.stakingAndClaimingRewards, link: `${prefix}/node-staking/megapools/staking-and-claiming-rewards` },
            { text: t.stakeOnBehalf, link: `${prefix}/upgrades/houston/stake-eth-on-behalf` },
            { text: t.credit, link: `${prefix}/node-staking/megapools/credit` },
            { text: t.exitMegapoolValidator, link: `${prefix}/node-staking/megapools/exit-megapool-validator` },

          ],
        },
        {
          text: t.maintenance,
          link: `${prefix}/node-staking/maintenance/overview`,
          collapsed: true,
          items: [
            { text: t.maintenanceOverview, link: `${prefix}/node-staking/maintenance/overview` },
            { text: t.performance, link: `${prefix}/node-staking/performance` },
            { text: t.grafana, link: `${prefix}/node-staking/grafana` },
            { text: t.alerting, link: `${prefix}/node-staking/maintenance/alerting` },
            { text: t.updates, link: `${prefix}/node-staking/updates` },
            { text: t.backups, link: `${prefix}/node-staking/backups` },
            { text: t.masquerade, link: `${prefix}/node-staking/masquerade` },
            { text: t.historyExpiry, link: `${prefix}/node-staking/maintenance/history-expiry` },
            { text: t.pruning, link: `${prefix}/node-staking/pruning` },
            { text: t.changeClients, link: `${prefix}/node-staking/change-clients` },
            { text: t.nodeMigration, link: `${prefix}/node-staking/maintenance/node-migration` },
          ],
        },
        {
          text: t.rewards,
          link: `${prefix}/node-staking/rewards/overview`,
          collapsed: true,
          items: [
            { text: t.rewardsOverview, link: `${prefix}/node-staking/rewards/overview` },
            { text: t.claimingRewards, link: `${prefix}/node-staking/rewards` },
            { text: t.skimming, link: `${prefix}/node-staking/skimming` },
          ],
        },
        {
          text: t.exiting,
          link: `${prefix}/node-staking/withdraw`,
          collapsed: true,
          items: [
            { text: t.shutdown, link: `${prefix}/node-staking/withdraw` },
          ],
        },
        { text: t.faq, link: `${prefix}/node-staking/faq` },
      ],
    },
    {
      text: sidebarTranslations[lang].odao.title,
      collapsed: true,
      items: [
        { text: sidebarTranslations[lang].odao.overview, link: `${prefix}/odao/overview` },
        { text: sidebarTranslations[lang].odao.setup, link: `${prefix}/odao/setup` },
        { text: sidebarTranslations[lang].odao.testing, link: `${prefix}/odao/testing` },
        { text: sidebarTranslations[lang].odao.monitoring, link: `${prefix}/odao/monitoring` },
        { text: sidebarTranslations[lang].odao.proposals, link: `${prefix}/odao/proposals` },
      ],
    },
    {
      text: sidebarTranslations[lang].pdao.title,
      collapsed: true,
      items: [
        { text: sidebarTranslations[lang].pdao.overview, link: `${prefix}/pdao/overview` },
        { text: sidebarTranslations[lang].pdao.pdao, link: `${prefix}/pdao/pdao` },
        { text: sidebarTranslations[lang].pdao.participating, link: `${prefix}/pdao/participate` },
      ],
    },
    {
      text: sidebarTranslations[lang].upgrades.title,
      collapsed: true,
      items: [
        { text: sidebarTranslations[lang].upgrades.saturn1, link: `${prefix}/upgrades/saturn-1/whats-new` },
        { text: sidebarTranslations[lang].upgrades.saturn0, link: `${prefix}/upgrades/saturn-0/whats-new` },
        {
          text: sidebarTranslations[lang].upgrades.houston,
          link: `${prefix}/upgrades/houston/whats-new`,
          collapsed: true,
          items: [
            { text: sidebarTranslations[lang].upgrades.houstonOverview, link: `${prefix}/upgrades/houston/whats-new` },
            { text: sidebarTranslations[lang].upgrades.houstonGettingStarted, link: `${prefix}/upgrades/houston/getting-started` },
            { text: sidebarTranslations[lang].upgrades.houstonPdao, link: `${prefix}/upgrades/houston/pdao` },
          ],
        },
        {
          text: sidebarTranslations[lang].upgrades.atlas,
          link: `${prefix}/upgrades/atlas/whats-new`,
          collapsed: true,
          items: [
            { text: sidebarTranslations[lang].upgrades.lebs, link: `${prefix}/upgrades/atlas/lebs` },
          ],
        },
        {
          text: sidebarTranslations[lang].upgrades.redstone,
          link: `${prefix}/upgrades/redstone/whats-new`,
          collapsed: true,
          items: [
            { text: sidebarTranslations[lang].upgrades.redstoneWhatsNew, link: `${prefix}/upgrades/redstone/whats-new` },
            { text: sidebarTranslations[lang].upgrades.redstoneDocker, link: `${prefix}/upgrades/redstone/docker-migration` },
            { text: sidebarTranslations[lang].upgrades.redstoneHybrid, link: `${prefix}/upgrades/redstone/hybrid-migration` },
            { text: sidebarTranslations[lang].upgrades.redstoneNative, link: `${prefix}/upgrades/redstone/native-migration` },
          ],
        },
      ],
    },
    {
      text: sidebarTranslations[lang].testnet.title,
      collapsed: true,
      items: [
        { text: sidebarTranslations[lang].testnet.overview, link: `${prefix}/node-staking/testnet/overview` },
        { text: sidebarTranslations[lang].testnet.mainnet, link: `${prefix}/node-staking/testnet/mainnet` },
      ],
    },
  ];
}

function localeSidebars() {
  const sidebar: Record<string, unknown> = {};
  for (const { lang } of locales) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    const nodeStakingSidebar = nodeStaking(prefix, lang);
    sidebar[`${prefix}/protocol`] = protocol(prefix, lang);
    sidebar[`${prefix}/liquid-staking`] = liquidStaking(prefix, lang);
    sidebar[`${prefix}/node-staking`] = nodeStakingSidebar;
    sidebar[`${prefix}/odao`] = nodeStakingSidebar;
    sidebar[`${prefix}/pdao`] = nodeStakingSidebar;
    sidebar[`${prefix}/upgrades`] = nodeStakingSidebar;
    sidebar[`${prefix}/testnet`] = nodeStakingSidebar;
    sidebar[`${prefix}/legacy`] = nodeStakingSidebar;
  }
  return sidebar;
}
