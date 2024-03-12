import { defineConfig } from "vitepress";
import { tabsPlugin } from "./plugins/tabs/markdownPlugin";
import { nestedTabsPlugin } from "./plugins/nestedTabs/markdownPlugin";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "Rocket Pool",
  description: "Rocket Pool Guides & Documentation - Decentralised Ethereum Liquid Staking Protocol",
  cleanUrls: true,
  head: [
    ["meta", { name: "theme-color", content: "#FF6E30" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/images/logo.png' }],
  ],
  markdown: {
    config(md) {
      md.use(nestedTabsPlugin);
      md.use(tabsPlugin);
    },
  },
  themeConfig: {
    logo: { src: "/images/logo.png", alt: "Rocket Pool Guides & Documentation - Decentralised Ethereum Liquid Staking Protocol" },
    search: {
      provider: "algolia",
      options: {
        apiKey: "55cef043a9a4342516d9f70a0fcd42ef",
        indexName: "rocketpool",
        appId: "V3ID5G8G80",
      },
    },
    editLink: {
      pattern: "https://github.com/rocket-pool/docs.rocketpool.net/edit/main/docs/:path",
      text: "Suggest changes to this page",
    },
    socialLinks: [
      {
        icon: "discord",
        link: "https://discord.gg/rocketpool",
      },
      {
        icon: "github",
        link: "https://github.com/rocket-pool/docs.rocketpool.net",
      },
    ],
    nav: [
      {
        text: "Overview",
        link: "/overview/",
      },
      {
        text: "Guides",
        link: "/guides/",
      },
      {
        text: "For Developers",
        link: "/developers/",
      },
      {
        text: "Website",
        link: "https://www.rocketpool.net",
      },
    ],
    sidebar: {
      "/overview/": overview(),
      "/guides/": guides(),
      "/developers/": developers(),
    },
  },
});

function overview() {
  return [
    {
      text: "Overview",
      collapsed: false,
      items: [
        { text: "Overview", link: "/overview/" },
        { text: "Explainer Series", link: "/overview/explainer-series" },
        { text: "Frequently Asked Questions", link: "/overview/faq" },
        { text: "Contracts & Integrations", link: "/overview/contracts-integrations" },
        { text: "Glossary", link: "/overview/glossary" },
      ],
    },
  ];
}

function guides() {
  return [
    {
      text: "Guides",
      items: [
        {
          text: "Overview",
          link: "/guides/",
        },
        {
          text: "The Houston Update",
          collapsed: true,
          link: "/guides/houston/whats-new",
          items: [
            { text: "Overview", link: "/guides/houston/whats-new" },
            { text: "Participating in pDAO voting", link: "/guides/houston/pdao-voting" },
            { text: "ETH and RPL withdrawal Addresses", link: "/guides/houston/seperation-eth-rpl"},
            { text: "tab test", link: "/guides/houston/tabtest"}
          ],
        },
        {
          text: "The Atlas Update",
          link: "/guides/atlas/whats-new",
        },
        {
          text: "Staking with Rocket Pool",
          collapsed: true,
          link: "/guides/staking/overview",
          items: [
            { text: "Overview", link: "/guides/staking/overview" },
            { text: "Staking directly via Rocket Pool ", link: "/guides/staking/via-rp" },
            { text: "Staking via a Decentralised Exchange on the Ethereum Network (Layer 1) ", link: "/guides/staking/via-l1" },
            { text: "Staking via a Decentralised Exchange on Layer 2 ", link: "/guides/staking/via-l2" },
          ],
        },
        {
          text: "Running a Rocket Pool Node",
          collapsed: true,
          items: [
            { text: "A Node Operator's Responsibilities", link: "/guides/node/responsibilities" },
            { text: "Node Requirements & Choosing a Platform", link: "/guides/node/platform" },
            {
              text: "Preparing a Local Node",
              link: "/guides/node/local/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/local/overview" },
                { text: "Selecting Staking Hardware", link: "/guides/node/local/hardware" },
                { text: "Preparing a PC, Mini-PC or NUC", link: "/guides/node/local/prepare-pc" },
                { text: "Preparing a Mac", link: "/guides/node/local/prepare-mac" },
                { text: "Intro to Secure Shell (SSH)", link: "/guides/node/ssh" },
              ],
            },
            {
              text: "Preparing a Cloud (VPS) Node",
              link: "/guides/node/vps/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/vps/overview" },
                { text: "Selecting a Hosting Provider", link: "/guides/node/vps/providers" },
                { text: "Preparing the Operating System", link: "/guides/node/vps/os" },
              ],
            },
            {
              text: "Securing Your Node",
              link: "/guides/node/securing-your-node",
              collapsed: true,
              items: [
                { text: "Securing Your Node", link: "/guides/node/securing-your-node" },
                { text: "Tailscale", link: "/guides/node/tailscale" },
              ],
            },
            {
              text: "Installing Rocket Pool",
              link: "/guides/node/installing/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/installing/overview" },
                { text: "Choosing your ETH Clients", link: "/guides/node/eth-clients" },
                { text: "Selecting a Rocket Pool Mode", link: "/guides/node/install-modes" },
                { text: "Creating a Standard Rocket Pool Node with Docker", link: "/guides/node/docker" },
                { text: "Creating a Native Rocket Pool Node without Docker", link: "/guides/node/native" },
              ],
            },
            {
              text: "Configuring Rocket Pool",
              link: "/guides/node/config/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/config/overview" },
                { text: "Configuring the Smartnode Stack (Docker/hybrid mode)", link: "/guides/node/config-docker" },
                { text: "Configuring the Smartnode Stack (native)", link: "/guides/node/config-native" },
                { text: "Advanced Smartnode Configuration for Docker Mode", link: "/guides/node/advanced-config" },
              ],
            },
            {
              text: "Provisioning your Node",
              link: "/guides/node/provisioning/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/provisioning/overview" },
                { text: "Starting Rocket Pool", link: "/guides/node/starting-rp" },
                { text: "Creating a New Wallet", link: "/guides/node/wallet-init" },
                { text: "Importing/Recovering an Existing Wallet", link: "/guides/node/recovering-rp" },
                { text: "Preparing your Node for Operation", link: "/guides/node/prepare-node" },
                { text: "Intro to the Command Line Interface", link: "/guides/node/cli-intro" },
                { text: "Specifying a Fallback Node", link: "/guides/node/fallback" },
                { text: "Fee Distributors and the Smoothing Pool", link: "/guides/node/fee-distrib-sp" },
                { text: "MEV, MEV-Boost & MEV Rewards", link: "/guides/node/mev" },
              ],
            },
            {
              text: "Creating or Migrating Minipools",
              link: "/guides/node/minipools/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/minipools/overview" },
                { text: "Creating a new Minipool (Validator)", link: "/guides/node/create-validator" },
                { text: "The Minipool Delegate", link: "/guides/node/minipools/delegates" },
                { text: "Converting a Solo Validator into a Minipool", link: "/guides/node/solo-staker-migration" },
                { text: "Migrating a 16-ETH Minipool to 8-ETH", link: "/guides/node/leb-migration" },
                { text: "The Deposit Credit System", link: "/guides/node/credit" },
              ],
            },
            {
              text: "Monitoring & Maintenance",
              link: "/guides/node/maintenance/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/maintenance/overview" },
                { text: "Monitoring your Node's Performance", link: "/guides/node/performance" },
                { text: "Setting up the Grafana Dashboard", link: "/guides/node/grafana" },
                { text: "Checking for Updates", link: "/guides/node/updates" },
                { text: "Backing Up Your Node", link: "/guides/node/backups" },
                { text: "Pruning the Execution Client", link: "/guides/node/pruning" },
                { text: "Changing Execution or Consensus Clients", link: "/guides/node/change-clients" },
                { text: "Moving from One Node to Another", link: "/guides/node/maintenance/node-migration" },
              ],
            },
            {
              text: "Claiming Rewards",
              link: "/guides/node/rewards/overview",
              collapsed: true,
              items: [
                { text: "Overview", link: "/guides/node/rewards/overview" },
                { text: "Claiming Node Operator Rewards", link: "/guides/node/rewards" },
                { text: "Distributing Skimmed Rewards", link: "/guides/node/skimming" },
              ],
            },
            {
              text: "Exiting your Minipools",
              link: "/guides/node/withdraw",
              collapsed: true,
              items: [
                { text: "Shut Down a Minipool", link: "/guides/node/withdraw" },
                { text: "Rescuing a Dissolved Minipool", link: "/guides/node/rescue-dissolved" },
              ],
            },
            { text: "NYI Troubleshooting your Node", link: "/guides/node/troubleshooting" },
            { text: "FAQ (WIP)", link: "/guides/node/faq" },
          ],
        },
        {
          text: "Testing Rocket Pool with the Holesky Test Network",
          link: "/guides/testnet/overview",
          collapsed: true,
          items: [
            { text: "Practicing with the Test Network", link: "/guides/testnet/overview" },
            { text: "Migrating from the Test Network to Mainnet", link: "/guides/testnet/mainnet" },
          ],
        },
        {
          text: "Running an Oracle DAO Node",
          collapsed: true,
          items: [
            { text: "The Rocket Pool Oracle DAO", link: "/guides/odao/overview" },
            { text: "Setting up an Oracle DAO Node", link: "/guides/odao/setup" },
            { text: "Testing your Oracle DAO Node", link: "/guides/odao/testing" },
            { text: "Monitoring your Oracle DAO Node", link: "/guides/odao/monitoring" },
            { text: "Oracle DAO Proposals", link: "/guides/odao/proposals" },
          ],
        },
        {
          text: "Legacy Guides",
          collapsed: true,
          items: [
            { text: "Upgrading to Smartnode v1.3.x", link: "/guides/legacy/v1.3-update" },
            { text: "Migrating the Smartnode from Previous Beta Tests", link: "/guides/legacy/upgrading" },
            { text: "Atlas & Withdrawals", link: "/guides/atlas/lebs" },
            {
              text: "Redstone & The Merge",
              link: "/guides/redstone/whats-new",
              collapsed: true,
              items: [
                { text: "The Rocket Pool Redstone Update", link: "/guides/redstone/whats-new" },
                { text: "[Docker Mode] Guide to the Redstone Update and the Merge", link: "/guides/redstone/docker-migration" },
                { text: "[Hybrid Mode] Guide to the Redstone Update and the Merge", link: "/guides/redstone/hybrid-migration" },
                { text: "[Native Mode] Guide to the Redstone Update and the Merge", link: "/guides/redstone/native-migration" },
              ],
            },
            { text: "Preparing a Raspberry Pi", link: "/guides/node/local/prepare-pi" },
          ],
        },
      ],
    },
  ];
}

function developers() {
  return [
    {
      text: "For Developers",
      collapsed: false,
      items: [
        {
          collapsed: false,
          items: [
            { text: "Smart Contracts", link: "/developers/usage/contracts/contracts" },
            { text: "Go Library", link: "/developers/usage/go/go" },
            { text: "Javascript", link: "/developers/usage/js/js" },
          ],
        },
      ],
    },
    {
      text: "API Reference",
      collapsed: false,
      items: [
        {
          text: "Go",
          collapsed: true,
          items: [
            { text: "Auction", link: "/developers/api/go/auction" },
            { text: "Contracts", link: "/developers/api/go/contracts" },
            {
              title: "DAO",
              items: [
                { text: "DAO", link: "/developers/api/go/dao" },
                { text: "DAO Protocol", link: "/developers/api/go/dao-protocol" },
                { text: "DAO Trusted Node", link: "/developers/api/go/dao-trustednode" },
              ],
            },
            { text: "Deposit", link: "/developers/api/go/deposit" },
            { text: "Minipool", link: "/developers/api/go/minipool" },
            { text: "Network", link: "/developers/api/go/network" },
            { text: "Node", link: "/developers/api/go/node" },
            { text: "Rewards", link: "/developers/api/go/rewards" },
            { text: "Rocket Pool", link: "/developers/api/go/rocketpool" },
            {
              title: "Settings",
              collapsable: true,
              items: [
                { text: "Settings Protocol", link: "/developers/api/go/settings-protocol" },
                { text: "Settings Trusted Node", link: "/developers/api/go/settings-trustednode" },
              ],
            },
            { text: "Storage", link: "/developers/api/go/storage" },
            { text: "Tokens", link: "/developers/api/go/tokens" },
            { text: "Types", link: "/developers/api/go/types" },
            {
              title: "Utils",
              items: [
                { text: "Utils", link: "/developers/api/go/utils" },
                { text: "ETH", link: "/developers/api/go/utils-eth" },
                { text: "Strings", link: "/developers/api/go/utils-strings" },
              ],
            },
          ],
        },
        {
          text: "Javascript",
          collapsed: true,
          items: [
            { text: "Auction", link: "/developers/api/js/Auction" },
            { text: "Contracts", link: "/developers/api/js/Contracts" },
            {
              text: "DAO",
              collapsable: true,
              items: [
                { text: "Class: DAONodeTrusted", link: "/developers/api/js/DAONodeTrusted" },
                { text: "Class: DAONodeTrustedActions", link: "/developers/api/js/DAONodeTrustedActions" },
                { text: "Class: DAONodeTrustedProposals", link: "/developers/api/js/DAONodeTrustedProposals" },
                { text: "Class: DAONodeTrustedSettings", link: "/developers/api/js/DAONodeTrustedSettings" },
                { text: "Class: DAOProposal", link: "/developers/api/js/DAOProposal" },
              ],
            },
            {
              text: "Class: Deposit",
              items: ["/developers/api/js/Deposit"],
            },
            {
              text: "Minipool",
              collapsable: true,
              items: [
                { text: "Class: Minipool", link: "/developers/api/js/Minipool" },
                { text: "Class: MinipoolContract", link: "/developers/api/js/MinipoolContract" },
              ],
            },
            {
              text: "Class: Network",
              link: "/developers/api/js/Network",
            },
            {
              text: "Class: Node",
              link: "/developers/api/js/Node",
            },
            {
              text: "Rewards",
              collapsable: true,
              items: [
                { text: "Class: Rewards", link: "/developers/api/js/Rewards" },
                { text: "Class: Pool", link: "/developers/api/js/Pool" },
              ],
            },
            {
              text: "Settings",
              collapsable: true,
              items: [
                { text: "Class: AuctionSettings", link: "/developers/api/js/AuctionSettings" },
                { text: "Class: DepositSettings", link: "/developers/api/js/DepositSettings" },
                { text: "Class: MinipoolSettings", link: "/developers/api/js/MinipoolSettings" },
                { text: "Class: NetworkSettings", link: "/developers/api/js/NetworkSettings" },
                { text: "Class: NodeSettings", link: "/developers/api/js/NodeSettings" },
              ],
            },
            {
              text: "Tokens",
              collapsable: true,
              items: [
                { text: "Class: ERC20", link: "/developers/api/js/ERC20" },
                { text: "Class: LegacyRPL", link: "/developers/api/js/LegacyRPL" },
                { text: "Class: RETH", link: "/developers/api/js/RETH" },
                { text: "Class: RPL", link: "/developers/api/js/RPL" },
              ],
            },
            {
              text: "Class: Vault",
              link: "/developers/api/js/Vault",
            },
            {
              text: "Class: Rocketpool",
              link: "/developers/api/js/RocketPool",
            },
          ],
        },
        {
          text: "Subgraph",
          collapsed: true,
          items: [
            { text: "Subgraph Data Introduction", link: "/developers/api/subgraph/subgraph-data" },
            { text: "Entities", link: "/developers/api/subgraph/entities" },
            { text: "Queries", link: "/developers/api/subgraph/queries" },
            { text: "Additional Resources", link: "/developers/api/subgraph/additional-resources" },
          ],
        },
      ],
    },
  ];
}
