import { defineConfig } from "@rspress/core";

const navTranslations: Record<string, { overview: string; liquidStaking: string; nodeStaking: string; website: string }> = {
  en: { overview: "Overview", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Website" },
  zh: { overview: "概述", liquidStaking: "流动性质押", nodeStaking: "节点质押", website: "网站" },
  es: { overview: "Descripción general", liquidStaking: "Staking Líquido", nodeStaking: "Staking de Nodo", website: "Sitio web" },
  fr: { overview: "Aperçu", liquidStaking: "Staking Liquide", nodeStaking: "Staking de Nœud", website: "Site web" },
  de: { overview: "Übersicht", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Webseite" },
  ja: { overview: "概要", liquidStaking: "リキッドステーキング", nodeStaking: "ノードステーキング", website: "ウェブサイト" },
  ko: { overview: "개요", liquidStaking: "리퀴드 스테이킹", nodeStaking: "노드 스테이킹", website: "웹사이트" },
  pt: { overview: "Visão geral", liquidStaking: "Staking Líquido", nodeStaking: "Staking de Nó", website: "Site" },
  ru: { overview: "Обзор", liquidStaking: "Ликвидный стейкинг", nodeStaking: "Стейкинг ноды", website: "Сайт" },
  it: { overview: "Panoramica", liquidStaking: "Liquid Staking", nodeStaking: "Node Staking", website: "Sito web" },
  tr: { overview: "Genel Bakış", liquidStaking: "Likit Staking", nodeStaking: "Node Staking", website: "Web sitesi" },
};

function localeNav(lang: string) {
  const t = navTranslations[lang];
  const prefix = lang === "en" ? "" : `/${lang}`;
  return [
    { text: t.overview, link: `${prefix}/overview/` },
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

function overview(prefix: string) {
  return [
    {
      text: "Overview",
      collapsed: false,
      items: [
        { text: "Overview", link: `${prefix}/overview/` },
        { text: "Explainer Series", link: `${prefix}/overview/explainer-series` },
        { text: "Frequently Asked Questions", link: `${prefix}/overview/faq` },
        { text: "Contracts & Integrations", link: `${prefix}/overview/contracts-integrations` },
        { text: "Glossary", link: `${prefix}/overview/glossary` },
      ],
    },
  ];
}

function liquidStaking(prefix: string) {
  return [
    {
      text: "Liquid Staking (rETH)",
      collapsed: false,
      items: [
        { text: "Overview", link: `${prefix}/liquid-staking/overview` },
        { text: "Staking directly via Rocket Pool", link: `${prefix}/liquid-staking/via-rp` },
        { text: "Staking via a DEX on Layer 1", link: `${prefix}/liquid-staking/via-l1` },
        { text: "Staking via a DEX on Layer 2", link: `${prefix}/liquid-staking/via-l2` },
        { text: "Staking on behalf of a node", link: `${prefix}/legacy/houston/stake-eth-on-behalf` },
      ],
    },
  ];
}

function nodeStaking(prefix: string) {
  return [
    {
      text: "Node Operator Guide",
      items: [
        { text: "A Node Operator's Responsibilities", link: `${prefix}/node-staking/responsibilities` },
        { text: "Node Requirements & Choosing a Platform", link: `${prefix}/node-staking/platform` },
        {
          text: "Preparing a Local Node",
          link: `${prefix}/node-staking/local/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/local/overview` },
            { text: "Selecting Staking Hardware", link: `${prefix}/node-staking/local/hardware` },
            { text: "Preparing a PC, Mini-PC or NUC", link: `${prefix}/node-staking/local/prepare-pc` },
            { text: "Preparing a Mac", link: `${prefix}/node-staking/local/prepare-mac` },
            { text: "Intro to Secure Shell (SSH)", link: `${prefix}/node-staking/ssh` },
          ],
        },
        {
          text: "Preparing a Server Node",
          link: `${prefix}/node-staking/vps/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/vps/overview` },
            { text: "Selecting a Hosting Provider", link: `${prefix}/node-staking/vps/providers` },
            { text: "Preparing the Operating System", link: `${prefix}/node-staking/vps/os` },
          ],
        },
        {
          text: "Securing Your Node",
          link: `${prefix}/node-staking/securing-your-node`,
          collapsed: true,
          items: [
            { text: "Securing Your Node", link: `${prefix}/node-staking/securing-your-node` },
            { text: "Tailscale", link: `${prefix}/node-staking/tailscale` },
          ],
        },
        {
          text: "Installing Rocket Pool",
          link: `${prefix}/node-staking/installing/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/installing/overview` },
            { text: "Choosing your ETH Clients", link: `${prefix}/node-staking/eth-clients` },
            { text: "Selecting a Rocket Pool Mode", link: `${prefix}/node-staking/install-modes` },
            { text: "Creating a Standard Rocket Pool Node with Docker", link: `${prefix}/node-staking/docker` },
            { text: "Creating a Native Rocket Pool Node without Docker", link: `${prefix}/node-staking/native` },
          ],
        },
        {
          text: "Configuring Rocket Pool",
          link: `${prefix}/node-staking/config/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/config/overview` },
            { text: "Configuring the Smartnode Stack (Docker/hybrid mode)", link: `${prefix}/node-staking/config-docker` },
            { text: "Configuring the Smartnode Stack (native)", link: `${prefix}/node-staking/config-native` },
            { text: "Advanced Smartnode Configuration for Docker Mode", link: `${prefix}/node-staking/advanced-config` },
          ],
        },
        {
          text: "Provisioning your Node",
          link: `${prefix}/node-staking/provisioning/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/provisioning/overview` },
            { text: "Starting Rocket Pool", link: `${prefix}/node-staking/starting-rp` },
            { text: "Creating a New Wallet", link: `${prefix}/node-staking/wallet-init` },
            { text: "Importing/Recovering an Existing Wallet", link: `${prefix}/node-staking/recovering-rp` },
            { text: "Preparing your Node for Operation", link: `${prefix}/node-staking/prepare-node` },
            { text: "Intro to the Command Line Interface", link: `${prefix}/node-staking/cli-intro` },
            { text: "Specifying a Fallback Node", link: `${prefix}/node-staking/fallback` },
            { text: "Fee Distributors and the Smoothing Pool", link: `${prefix}/node-staking/fee-distrib-sp` },
            { text: "MEV, MEV-Boost & MEV Rewards", link: `${prefix}/node-staking/mev` },
          ],
        },
        {
          text: "Creating or Migrating Minipools",
          link: `${prefix}/node-staking/minipools/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/minipools/overview` },
            { text: "Creating a new Minipool (Validator)", link: `${prefix}/node-staking/create-validator` },
            { text: "The Minipool Delegate", link: `${prefix}/node-staking/minipools/delegates` },
            { text: "Converting a Solo Validator into a Minipool", link: `${prefix}/node-staking/solo-staker-migration` },
            { text: "Migrating a 16-ETH Minipool to 8-ETH", link: `${prefix}/node-staking/leb-migration` },
            { text: "The Deposit Credit System", link: `${prefix}/node-staking/credit` },
          ],
        },
        {
          text: "Monitoring & Maintenance",
          link: `${prefix}/node-staking/maintenance/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/maintenance/overview` },
            { text: "Monitoring your Node's Performance", link: `${prefix}/node-staking/performance` },
            { text: "Setting up the Grafana Dashboard", link: `${prefix}/node-staking/grafana` },
            { text: "Smartnode Stack Alert Notifications", link: `${prefix}/node-staking/maintenance/alerting` },
            { text: "Checking for Updates", link: `${prefix}/node-staking/updates` },
            { text: "Backing Up Your Node", link: `${prefix}/node-staking/backups` },
            { text: "Masquerading as Another Node Address", link: `${prefix}/node-staking/masquerade` },
            { text: "Expiring Pre-Merge History", link: `${prefix}/node-staking/maintenance/history-expiry` },
            { text: "Pruning the Execution Client", link: `${prefix}/node-staking/pruning` },
            { text: "Changing Execution or Consensus Clients", link: `${prefix}/node-staking/change-clients` },
            { text: "Moving from One Node to Another", link: `${prefix}/node-staking/maintenance/node-migration` },
          ],
        },
        {
          text: "Claiming Rewards",
          link: `${prefix}/node-staking/rewards/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/rewards/overview` },
            { text: "Claiming Node Operator Rewards", link: `${prefix}/node-staking/rewards` },
            { text: "Distributing Skimmed Rewards", link: `${prefix}/node-staking/skimming` },
          ],
        },
        {
          text: "Participating in pDAO Governance",
          link: `${prefix}/node-staking/governance/overview`,
          collapsed: true,
          items: [
            { text: "Overview", link: `${prefix}/node-staking/governance/overview` },
            { text: "The Protocol DAO", link: `${prefix}/legacy/houston/pdao#the-protocol-dao-pdao` },
            { text: "Participating in on-chain pDAO Proposals", link: `${prefix}/legacy/houston/participate#participating-in-on-chain-pdao-proposals` },
            { text: "Setting your Snapshot Signalling Address", link: `${prefix}/legacy/houston/participate#setting-your-snapshot-signalling-address` },
            { text: "Delegating Voting Power", link: `${prefix}/legacy/houston/participate#delegating-voting-power` },
            { text: "Viewing the State of a Proposal", link: `${prefix}/legacy/houston/participate#viewing-the-state-of-a-proposal` },
            { text: "Voting on a Proposal", link: `${prefix}/legacy/houston/participate#voting-on-a-proposal` },
            { text: "Creating a Proposal", link: `${prefix}/legacy/houston/participate#creating-a-proposal` },
            { text: "Executing a successful proposal", link: `${prefix}/legacy/houston/participate#executing-a-successful-proposal` },
            { text: "Claiming Bonds and Rewards", link: `${prefix}/legacy/houston/participate#claiming-bonds-and-rewards` },
            { text: "Creating and Claiming a recurring treasury spend", link: `${prefix}/legacy/houston/participate#creating-a-recurring-treasury-spend` },
          ],
        },
        {
          text: "Exiting your Minipools",
          link: `${prefix}/node-staking/withdraw`,
          collapsed: true,
          items: [
            { text: "Shut Down a Minipool", link: `${prefix}/node-staking/withdraw` },
            { text: "Rescuing a Dissolved Minipool", link: `${prefix}/node-staking/rescue-dissolved` },
          ],
        },
        { text: "FAQ (WIP)", link: `${prefix}/node-staking/faq` },
      ],
    },
  ];
}

function odao(prefix: string) {
  return [
    {
      text: "Oracle DAO",
      collapsed: false,
      items: [
        { text: "The Rocket Pool Oracle DAO", link: `${prefix}/odao/overview` },
        { text: "Setting up an Oracle DAO Node", link: `${prefix}/odao/setup` },
        { text: "Testing your Oracle DAO Node", link: `${prefix}/odao/testing` },
        { text: "Monitoring your Oracle DAO Node", link: `${prefix}/odao/monitoring` },
        { text: "Oracle DAO Proposals", link: `${prefix}/odao/proposals` },
      ],
    },
  ];
}

function upgrades(prefix: string) {
  return [
    {
      text: "Protocol Upgrades",
      collapsed: false,
      items: [{ text: "The Saturn 0 Upgrade", link: `${prefix}/upgrades/saturn-0/whats-new` }],
    },
  ];
}

function testnet(prefix: string) {
  return [
    {
      text: "Testnet",
      collapsed: false,
      items: [
        { text: "Practicing with the Test Network", link: `${prefix}/testnet/overview` },
        { text: "Migrating from the Test Network to Mainnet", link: `${prefix}/testnet/mainnet` },
      ],
    },
  ];
}

function legacy(prefix: string) {
  return [
    {
      text: "Legacy Guides",
      collapsed: false,
      items: [
        { text: "Upgrading to Smartnode v1.3.x", link: `${prefix}/legacy/v1.3-update` },
        { text: "Migrating the Smartnode from Previous Beta Tests", link: `${prefix}/legacy/upgrading` },
        { text: "The Atlas Update", link: `${prefix}/legacy/atlas/whats-new` },
        { text: "Lower ETH Bond Minipools", link: `${prefix}/legacy/atlas/lebs` },
        {
          text: "Redstone & The Merge",
          link: `${prefix}/legacy/redstone/whats-new`,
          collapsed: true,
          items: [
            { text: "The Rocket Pool Redstone Update", link: `${prefix}/legacy/redstone/whats-new` },
            { text: "[Docker Mode] Guide to the Redstone Update and the Merge", link: `${prefix}/legacy/redstone/docker-migration` },
            { text: "[Hybrid Mode] Guide to the Redstone Update and the Merge", link: `${prefix}/legacy/redstone/hybrid-migration` },
            { text: "[Native Mode] Guide to the Redstone Update and the Merge", link: `${prefix}/legacy/redstone/native-migration` },
          ],
        },
        {
          text: "The Houston Upgrade",
          collapsed: true,
          link: `${prefix}/legacy/houston/whats-new`,
          items: [
            { text: "Overview", link: `${prefix}/legacy/houston/whats-new` },
            { text: "Getting Started with Houston", link: `${prefix}/legacy/houston/getting-started` },
            { text: "The Protocol DAO", link: `${prefix}/legacy/houston/pdao` },
            { text: "Participating in Proposals", link: `${prefix}/legacy/houston/participate` },
            { text: "Stake ETH on Behalf of Node", link: `${prefix}/legacy/houston/stake-eth-on-behalf` },
            { text: "RPL Withdrawal Address", link: `${prefix}/legacy/houston/rpl-withdrawal-address` },
          ],
        },
        { text: "Preparing a Raspberry Pi", link: `${prefix}/node-staking/local/prepare-pi` },
      ],
    },
  ];
}

function localeSidebars() {
  const sidebar: Record<string, unknown> = {};
  for (const { lang } of locales) {
    const prefix = lang === "en" ? "" : `/${lang}`;
    sidebar[`${prefix}/overview`] = overview(prefix);
    sidebar[`${prefix}/liquid-staking`] = liquidStaking(prefix);
    sidebar[`${prefix}/node-staking`] = nodeStaking(prefix);
    sidebar[`${prefix}/odao`] = odao(prefix);
    sidebar[`${prefix}/upgrades`] = upgrades(prefix);
    sidebar[`${prefix}/testnet`] = testnet(prefix);
    sidebar[`${prefix}/legacy`] = legacy(prefix);
  }
  return sidebar;
}
