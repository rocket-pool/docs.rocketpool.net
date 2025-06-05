import {defineConfig} from "rspress/config";
import path from "path";

export default defineConfig({
    globalStyles: path.join(__dirname, "styles/index.css"),
    root: "docs",
    lang: "en",
    title: "Rocket Pool Guides & Documentation",
    description: "Rocket Pool Guides & Documentation - Decentralised Ethereum Liquid Staking Protocol",
    route: {
        cleanUrls: true,
    },
    markdown: {
        checkDeadLinks: true,
    },
    head: [
        ["meta", {name: "theme-color", content: "#FF6E30"}],
        ["meta", {name: "mobile-web-app-capable", content: "yes"}],
        ["meta", {name: "apple-mobile-web-app-status-bar-style", content: "black"}],
        ["link", {rel: "icon", type: "image/svg+xml", href: "/images/logo.svg"}],
        ["link", {rel: "icon", type: "image/png", href: "/images/logo.png"}],
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
        locales: [
            {
                lang: "zh",
                label: "简体中文",
                editLink: {
                    docRepoBaseUrl:
                        "https://github.com/rocket-pool/docs.rocketpool.net/tree/main/docs",
                    text: '📝 在 GitHub 上编辑此页',
                },
            },
            {
                lang: "en",
                label: "English",
                editLink: {
                    docRepoBaseUrl:
                        "https://github.com/rocket-pool/docs.rocketpool.net/tree/main/docs",
                    text: '📝 Edit this page on GitHub',
                },
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
                text: "Website",
                link: "https://www.rocketpool.net",
            },
        ],
        sidebar: {
            "/overview/": overview(),
            "/guides/": guides(),
        },
    },
});

function overview() {
    return [
        {
            text: "Overview",
            collapsed: false,
            items: [
                {text: "Overview", link: "/overview/"},
                {text: "Explainer Series", link: "/overview/explainer-series"},
                {text: "Frequently Asked Questions", link: "/overview/faq"},
                {text: "Contracts & Integrations", link: "/overview/contracts-integrations"},
                {text: "Glossary", link: "/overview/glossary"},
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
                    text: "The Saturn 0 Upgrade",
                    link: "/guides/saturn-0/whats-new",
                },
                {
                    text: "rETH Staker Guide",
                    collapsed: true,
                    link: "/guides/staking/overview",
                    items: [
                        {text: "Overview", link: "/guides/staking/overview"},
                        {text: "Staking directly via Rocket Pool ", link: "/guides/staking/via-rp"},
                        {
                            text: "Staking via a Decentralised Exchange on the Ethereum Network (Layer 1) ",
                            link: "/guides/staking/via-l1"
                        },
                        {text: "Staking via a Decentralised Exchange on Layer 2 ", link: "/guides/staking/via-l2"},
                        {text: "Staking on behalf of a node ", link: "/guides/houston/stake-eth-on-behalf"},
                    ],
                },
                {
                    text: "Node Operator Guide",
                    collapsed: true,
                    items: [
                        {text: "A Node Operator's Responsibilities", link: "/guides/node/responsibilities"},
                        {text: "Node Requirements & Choosing a Platform", link: "/guides/node/platform"},
                        {
                            text: "Preparing a Local Node",
                            link: "/guides/node/local/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/local/overview"},
                                {text: "Selecting Staking Hardware", link: "/guides/node/local/hardware"},
                                {text: "Preparing a PC, Mini-PC or NUC", link: "/guides/node/local/prepare-pc"},
                                {text: "Preparing a Mac", link: "/guides/node/local/prepare-mac"},
                                {text: "Intro to Secure Shell (SSH)", link: "/guides/node/ssh"},
                            ],
                        },
                        {
                            text: "Preparing a Server Node",
                            link: "/guides/node/vps/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/vps/overview"},
                                {text: "Selecting a Hosting Provider", link: "/guides/node/vps/providers"},
                                {text: "Preparing the Operating System", link: "/guides/node/vps/os"},
                            ],
                        },
                        {
                            text: "Securing Your Node",
                            link: "/guides/node/securing-your-node",
                            collapsed: true,
                            items: [
                                {text: "Securing Your Node", link: "/guides/node/securing-your-node"},
                                {text: "Tailscale", link: "/guides/node/tailscale"},
                            ],
                        },
                        {
                            text: "Installing Rocket Pool",
                            link: "/guides/node/installing/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/installing/overview"},
                                {text: "Choosing your ETH Clients", link: "/guides/node/eth-clients"},
                                {text: "Selecting a Rocket Pool Mode", link: "/guides/node/install-modes"},
                                {text: "Creating a Standard Rocket Pool Node with Docker", link: "/guides/node/docker"},
                                {
                                    text: "Creating a Native Rocket Pool Node without Docker",
                                    link: "/guides/node/native"
                                },
                            ],
                        },
                        {
                            text: "Configuring Rocket Pool",
                            link: "/guides/node/config/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/config/overview"},
                                {
                                    text: "Configuring the Smartnode Stack (Docker/hybrid mode)",
                                    link: "/guides/node/config-docker"
                                },
                                {text: "Configuring the Smartnode Stack (native)", link: "/guides/node/config-native"},
                                {
                                    text: "Advanced Smartnode Configuration for Docker Mode",
                                    link: "/guides/node/advanced-config"
                                },
                            ],
                        },
                        {
                            text: "Provisioning your Node",
                            link: "/guides/node/provisioning/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/provisioning/overview"},
                                {text: "Starting Rocket Pool", link: "/guides/node/starting-rp"},
                                {text: "Creating a New Wallet", link: "/guides/node/wallet-init"},
                                {text: "Importing/Recovering an Existing Wallet", link: "/guides/node/recovering-rp"},
                                {text: "Preparing your Node for Operation", link: "/guides/node/prepare-node"},
                                {text: "Intro to the Command Line Interface", link: "/guides/node/cli-intro"},
                                {text: "Specifying a Fallback Node", link: "/guides/node/fallback"},
                                {text: "Fee Distributors and the Smoothing Pool", link: "/guides/node/fee-distrib-sp"},
                                {text: "MEV, MEV-Boost & MEV Rewards", link: "/guides/node/mev"},
                            ],
                        },
                        {
                            text: "Creating or Migrating Minipools",
                            link: "/guides/node/minipools/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/minipools/overview"},
                                {text: "Creating a new Minipool (Validator)", link: "/guides/node/create-validator"},
                                {text: "The Minipool Delegate", link: "/guides/node/minipools/delegates"},
                                {
                                    text: "Converting a Solo Validator into a Minipool",
                                    link: "/guides/node/solo-staker-migration"
                                },
                                {text: "Migrating a 16-ETH Minipool to 8-ETH", link: "/guides/node/leb-migration"},
                                {text: "The Deposit Credit System", link: "/guides/node/credit"},
                            ],
                        },
                        {
                            text: "Monitoring & Maintenance",
                            link: "/guides/node/maintenance/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/maintenance/overview"},
                                {text: "Monitoring your Node's Performance", link: "/guides/node/performance"},
                                {text: "Setting up the Grafana Dashboard", link: "/guides/node/grafana"},
                                {
                                    text: "Smartnode Stack Alert Notifications ",
                                    link: "/guides/node/maintenance/alerting"
                                },
                                {text: "Checking for Updates", link: "/guides/node/updates"},
                                {text: "Backing Up Your Node", link: "/guides/node/backups"},
                                {text: "Pruning the Execution Client", link: "/guides/node/pruning"},
                                {text: "Changing Execution or Consensus Clients", link: "/guides/node/change-clients"},
                                {
                                    text: "Moving from One Node to Another",
                                    link: "/guides/node/maintenance/node-migration"
                                },
                            ],
                        },
                        {
                            text: "Claiming Rewards",
                            link: "/guides/node/rewards/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/rewards/overview"},
                                {text: "Claiming Node Operator Rewards", link: "/guides/node/rewards"},
                                {text: "Distributing Skimmed Rewards", link: "/guides/node/skimming"},
                            ],
                        },
                        {
                            text: "Participating in pDAO governance",
                            link: "/guides/node/governance/overview",
                            collapsed: true,
                            items: [
                                {text: "Overview", link: "/guides/node/governance/overview"},
                                {text: "The Protocol DAO", link: "/guides/houston/pdao#the-protocol-dao-pdao"},
                                {
                                    text: "Participating in on-chain pDAO Proposals",
                                    link: "guides/houston/participate#participating-in-on-chain-pdao-proposals"
                                },
                                {
                                    text: "Setting your Snapshot Signalling Address",
                                    link: "/guides/houston/participate#setting-your-snapshot-signalling-address"
                                },
                                {
                                    text: "Delegating Voting Power",
                                    link: "guides/houston/participate#delegating-voting-power"
                                },
                                {
                                    text: "Viewing the State of a Proposal",
                                    link: "/guides/houston/participate#viewing-the-state-of-a-proposal"
                                },
                                {
                                    text: "Voting on a Proposal",
                                    link: "/guides/houston/participate#voting-on-a-proposal"
                                },
                                {text: "Creating a Proposal", link: "guides/houston/participate#creating-a-proposal"},
                                {
                                    text: "Executing a successsful proposal",
                                    link: "guides/houston/participate#executing-a-successful-proposal"
                                },
                                {
                                    text: "Claiming Bonds and Rewards",
                                    link: "guides/houston/participate#claiming-bonds-and-rewards"
                                },
                                {
                                    text: "Creating and Claiming a recurring treasury spend",
                                    link: "guides/houston/participate#creating-a-recurring-treasury-spend"
                                },
                            ],
                        },
                        {
                            text: "Exiting your Minipools",
                            link: "/guides/node/withdraw",
                            collapsed: true,
                            items: [
                                {text: "Shut Down a Minipool", link: "/guides/node/withdraw"},
                                {text: "Rescuing a Dissolved Minipool", link: "/guides/node/rescue-dissolved"},
                            ],
                        },
                        {text: "FAQ (WIP)", link: "/guides/node/faq"},
                    ],
                },
                {
                    text: "Testing Rocket Pool with the Hoodi Test Network",
                    link: "/guides/testnet/overview",
                    collapsed: true,
                    items: [
                        {text: "Practicing with the Test Network", link: "/guides/testnet/overview"},
                        {text: "Migrating from the Test Network to Mainnet", link: "/guides/testnet/mainnet"},
                    ],
                },
                {
                    text: "Running an Oracle DAO Node",
                    collapsed: true,
                    items: [
                        {text: "The Rocket Pool Oracle DAO", link: "/guides/odao/overview"},
                        {text: "Setting up an Oracle DAO Node", link: "/guides/odao/setup"},
                        {text: "Testing your Oracle DAO Node", link: "/guides/odao/testing"},
                        {text: "Monitoring your Oracle DAO Node", link: "/guides/odao/monitoring"},
                        {text: "Oracle DAO Proposals", link: "/guides/odao/proposals"},],
                },
                {
                    text: "Legacy Guides",
                    collapsed: true,
                    items: [
                        {text: "Upgrading to Smartnode v1.3.x", link: "/guides/legacy/v1.3-update"},
                        {text: "Migrating the Smartnode from Previous Beta Tests", link: "/guides/legacy/upgrading"},
                        {text: "The Atlas Update", link: "/guides/atlas/whats-new"},
                        {text: "Lower ETH Bond Minipools", link: "/guides/atlas/lebs"},
                        {
                            text: "Redstone & The Merge",
                            link: "/guides/redstone/whats-new",
                            collapsed: true,
                            items: [
                                {text: "The Rocket Pool Redstone Update", link: "/guides/redstone/whats-new"},
                                {
                                    text: "[Docker Mode] Guide to the Redstone Update and the Merge",
                                    link: "/guides/redstone/docker-migration"
                                },
                                {
                                    text: "[Hybrid Mode] Guide to the Redstone Update and the Merge",
                                    link: "/guides/redstone/hybrid-migration"
                                },
                                {
                                    text: "[Native Mode] Guide to the Redstone Update and the Merge",
                                    link: "/guides/redstone/native-migration"
                                },
                            ],
                        },
                        {
                            text: "The Houston Upgrade",
                            collapsed: true,
                            link: "/guides/houston/whats-new",
                            items: [
                                {text: "Overview", link: "/guides/houston/whats-new"},
                                {text: "Getting Started with Houston", link: "/guides/houston/getting-started"},
                                {text: "The Protocol DAO", link: "/guides/houston/pdao"},
                                {text: "Participating in Proposals", link: "/guides/houston/participate"},
                                {text: "Stake ETH on Behalf of Node", link: "/guides/houston/stake-eth-on-behalf"},
                                {text: "RPL Withdrawal Address", link: "/guides/houston/rpl-withdrawal-address"},
                            ],
                        },
                        {text: "Preparing a Raspberry Pi", link: "/guides/node/local/prepare-pi"},
                    ],
                },
            ],
        },
    ];
}
