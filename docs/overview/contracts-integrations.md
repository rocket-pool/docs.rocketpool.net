---
permalink: /overview/contracts-integrations
---

# 🤝 Contracts & Integrations

Do you love RPL and rETH? Us too! So we put together a list of integrations and services, as well as official contract deployments, to help you discover new places these assets can be used!

If you would like to contribute by helping integrate Rocket Pool into more services and protocols, reach out on [Discord](https://discord.gg/MYrazaZZC4)!

## Key Protocol Contracts

| Chain     | Contract | Address                                                                                                                       |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Mainnet   | Deposit  | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://etherscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)         |
| &nbsp;    | Storage  | [0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46](https://etherscan.io/address/0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46)         |
| Holesky\* | Deposit  | [0x320f3aAB9405e38b955178BBe75c477dECBA0C27](https://holesky.etherscan.io/address/0x320f3aAB9405e38b955178BBe75c477dECBA0C27) |
| &nbsp;    | Storage  | [0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1](https://holesky.etherscan.io/address/0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1) |

Within the protocol, the Storage contract is used to find all the other deployed contract addresses as needed (see this [example](https://docs.rocketpool.net/developers/usage/contracts/contracts.html#interacting-with-rocket-pool)).
See [All Active Deployed Protocol Contracts](#all-active-deployed-protocol-contracts) below for a full list of addresses.

<small>\* Testnet</small>

## Token Contracts

| Chain             | Asset | Address                                                                                                                                                             |
| ----------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mainnet           | RPL   | [0xD33526068D116cE69F19A9ee46F0bd304F21A51f](https://etherscan.io/token/0xd33526068d116ce69f19a9ee46f0bd304f21a51f)                                                 |
| &nbsp;            | rETH  | [0xae78736Cd615f374D3085123A210448E74Fc6393](https://etherscan.io/token/0xae78736cd615f374d3085123a210448e74fc6393)                                                 |
| Arbitrum          | RPL   | [0xb766039cc6db368759c1e56b79affe831d0cc507](https://arbiscan.io/token/0xb766039cc6db368759c1e56b79affe831d0cc507)                                                  |
| &nbsp;            | rETH  | [0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8](https://arbiscan.io/token/0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8)                                                  |
| Optimism          | RPL   | [0xc81d1f0eb955b0c020e5d5b264e1ff72c14d1401](https://optimistic.etherscan.io/token/0xc81d1f0eb955b0c020e5d5b264e1ff72c14d1401)                                      |
| &nbsp;            | rETH  | [0x9bcef72be871e61ed4fbbc7630889bee758eb81d](https://optimistic.etherscan.io/token/0x9bcef72be871e61ed4fbbc7630889bee758eb81d)                                      |
| zkSync Era        | RPL   | [0x1CF8553Da5a75C20cdC33532cb19Ef7E3bFFf5BC](https://explorer.zksync.io/address/0x1CF8553Da5a75C20cdC33532cb19Ef7E3bFFf5BC)                                         |
| &nbsp;            | rETH  | [0x32Fd44bB869620C0EF993754c8a00Be67C464806](https://explorer.zksync.io/address/0x32Fd44bB869620C0EF993754c8a00Be67C464806)                                         |
| Polygon           | RPL   | [0x7205705771547cf79201111b4bd8aaf29467b9ec](https://polygonscan.com/token/0x7205705771547cf79201111b4bd8aaf29467b9ec)                                              |
| &nbsp;            | rETH  | [0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1](https://polygonscan.com/token/0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1)                                              |
| Polygon (zkEVM)   | RPL   | [0x70d35152fBf63FB312709b11a9Bac87519de0019](https://zkevm.polygonscan.com/address/0x70d35152fBf63FB312709b11a9Bac87519de0019)                                      |
| &nbsp;            | rETH  | [0xb23C20EFcE6e24Acca0Cef9B7B7aA196b84EC942](https://zkevm.polygonscan.com/address/0xb23C20EFcE6e24Acca0Cef9B7B7aA196b84EC942)                                      |
| Holesky\*         | RPL   | [0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0](https://holesky.etherscan.io/address/0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0)                                       |
| &nbsp;            | rETH  | [0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1](https://holesky.etherscan.io/address/0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1)                                       |
| Base              | RPL   | [0x1f73EAf55d696BFFA9b0EA16fa987B93b0f4d302](https://basescan.org/address/0x1f73EAf55d696BFFA9b0EA16fa987B93b0f4d302)                                               |
| &nbsp;            | rETH  | [0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c](https://basescan.org/address/0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c)                                               |
| Scroll            | rETH  | [0x53878B874283351D26d206FA512aEcE1Bef6C0dD](https://scrollscan.com/address/0x53878b874283351d26d206fa512aece1bef6c0dd)                                             |
| Starknet          | rETH  | [0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610](https://starkscan.co/token/0x0319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610) |

<small>\* Testnet</small>

## Deposit Pool Contract Version History

| Chain     | RP Version      | Address                                                                                                                       |
| --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Mainnet   | v1.2 (Atlas)    | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://e`therscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)         |
| &nbsp;    | v1.1 (Redstone) | [0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4](https://etherscan.io/address/0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4)         |
| &nbsp;    | v1.0            | [0x4D05E3d48a938db4b7a9A59A802D5b45011BDe58](https://etherscan.io/address/0x4D05E3d48a938db4b7a9A59A802D5b45011BDe58)         |
| Holesky\* | v1.2 (Atlas)    | [0x320f3aab9405e38b955178bbe75c477decba0c27](https://holesky.etherscan.io/address/0x320f3aab9405e38b955178bbe75c477decba0c27) |

<small>\* Testnet</small>

## Integrations

| Category         | Service                       | Link                                                                                                                                     | Link                                                                                                                                                                         |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exchanges        | 1inch (Mainnet)               | -                                                                                                                                        | [ETH/rETH](https://app.1inch.io/#/1/unified/swap/ETH/rETH)                                                                                                                   |
| &nbsp;           | Aura Finance (Mainnet)        | [rETH/RPL](https://app.aura.finance/#/)                                                                                                  | [wETH/rETH](https://app.aura.finance/#/)                                                                                                                                     |
| &nbsp;           | Balancer (Mainnet)            | [rETH/RPL](https://app.balancer.fi/#/ethereum/pool/0x9f9d900462492d4c21e9523ca95a7cd86142f298000200000000000000000462)                   | [ETH/rETH](https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112)                                                       |
| &nbsp;           | Bancor (Mainnet)              | [ETH/RPL](https://app.bancor.network/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xD33526068D116cE69F19A9ee46F0bd304F21A51f) | [ETH/rETH](https://app.bancor.network/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xae78736Cd615f374D3085123A210448E74Fc6393)                                    |
| &nbsp;           | Curve (Mainnet)               | -                                                                                                                                        | [wstETH/rETH](https://curve.fi/factory-crypto/14)                                                                                                                            |
| &nbsp;           | ShapeShift (Multichain)       | [ETH/RPL](https://app.shapeshift.com/)                                                                                                   | [ETH/rETH](https://app.shapeshift.com/)                                                                                                                                      |
| &nbsp;           | Uniswap (Mainnet)             | [ETH/RPL](https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xd33526068d116ce69f19a9ee46f0bd304f21a51f&chainId=1)          | [ETH/rETH](https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xae78736Cd615f374D3085123A210448E74Fc6393&chainId=1)                                             |
| &nbsp;           | Uniswap (Arbitrum)            | [ETH/RPL](https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xb766039cc6db368759c1e56b79affe831d0cc507&chain=arbitrum)     | [ETH/rETH](https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8&chain=arbitrum)                                        |
| &nbsp;           | Uniswap (Optimism)            | -                                                                                                                                        | [ETH/rETH](https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x9bcef72be871e61ed4fbbc7630889bee758eb81d&chain=optimism)                                        |
| &nbsp;           | Uniswap (Polygon)             | -                                                                                                                                        | [wETH/rETH](https://app.uniswap.org/#/swap?inputCurrency=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&outputCurrency=0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1&chain=polygon) |
| &nbsp;           | Zigzag (zkSync)               | -                                                                                                                                        | [ETH/rETH](https://trade.zigzag.exchange/?market=rETH-ETH&network=zksync)                                                                                                    |
| Lending          | Alchemix (Mainnet)            | -                                                                                                                                        | [wETH/rETH](https://alchemix.fi/vaults)                                                                                                                                      |
| &nbsp;           | Interest Protocol (Mainnet)   | -                                                                                                                                        | [USDC/rETH](https://interestprotocol.io/#/)                                                                                                                                  |
| &nbsp;           | Maker (Mainnet)               | -                                                                                                                                        | [DAI/rETH](https://app.defisaver.com/)                                                                                                                                       |
| &nbsp;           | MYSO Finance (Mainnet)        | -                                                                                                                                        | [wETH/rETH](https://app.myso.finance/)                                                                                                                                       |
| &nbsp;           | Vendor Finance (Arbitrum)     | -                                                                                                                                        | [DAI/rETH](https://vendor.finance/)                                                                                                                                          |
| Oracles (NAV)    | RP oDAO Rate (Mainnet)        | -                                                                                                                                        | [rETH/ETH](https://etherscan.io/address/0xae78736cd615f374d3085123a210448e74fc6393#readContract#F6)                                                                          |
| &nbsp;           | RP Rate Provider (Optimism)   | -                                                                                                                                        | [rETH/ETH](https://github.com/rocket-pool/rocketpool-ovm-oracle)                                                                                                             |
| &nbsp;           | RP Rate Provider (Arbitrum)   | -                                                                                                                                        | [rETH/ETH](https://github.com/rocket-pool/rocketpool-arbitrum-oracle)                                                                                                        |
| &nbsp;           | RP Rate Provider (Polygon)    | -                                                                                                                                        | [rETH/ETH](https://github.com/rocket-pool/rocketpool-polygon-oracle)                                                                                                         |
| &nbsp;           | RP Rate Provider (zksync era) | -                                                                                                                                        | [rETH/ETH](https://github.com/rocket-pool/rocketpool-zksync-oracle)                                                                                                          |
| &nbsp;           | Chainlink (Arbitrum)          | -                                                                                                                                        | [rETH/ETH](https://data.chain.link/arbitrum/mainnet/crypto-eth/reth-eth-exchange-rate)                                                                                       |
| Oracles (Market) | RP oDAO Rate (Mainnet)        | [ETH/RPL](https://etherscan.io/address/0x751826b107672360b764327631cC5764515fFC37#readContract#F3)                                       | -                                                                                                                                                                            |
| &nbsp;           | Chainlink (Mainnet)           | -                                                                                                                                        | [rETH/ETH](https://data.chain.link/ethereum/mainnet/crypto-eth/reth-eth)                                                                                                     |
| &nbsp;           | Maker (Mainnet)               | -                                                                                                                                        | [rETH/USD](https://etherscan.io/address/0xee7f0b350aa119b3d05dc733a4621a81972f7d47)                                                                                          |
| Trackers         | DefiLlama                     | [RPL](https://defillama.com/protocol/rocket-pool)                                                                                        | -                                                                                                                                                                            |
| &nbsp;           | Delta                         | -                                                                                                                                        | [rETH](https://delta.app/)                                                                                                                                                   |
| &nbsp;           | RocketScan                    | [RPL](https://rocketscan.io/rpl)                                                                                                         | [rETH](https://rocketscan.io/reth)                                                                                                                                           |
| Vaults           | Convex (Mainnet)              | -                                                                                                                                        | [Curve-rETHwstETH](https://www.convexfinance.com/stake)                                                                                                                      |
| &nbsp;           | Ribbon (Mainnet)              | -                                                                                                                                        | [rETH](https://app.ribbon.finance/v2/theta-vault/T-rETH-C)                                                                                                                   |
| &nbsp;           | Yearn\*\* (Mainnet)           | -                                                                                                                                        | [Curve-rETHwstETH](https://yearn.finance/#/vault/0xBfedbcbe27171C418CDabC2477042554b1904857)                                                                                 |

<small>\*\* Likely not profitable</small>

<!-- Staged Integrations -->
<!--
- RPL ZigZag listing (waiting for MM)
&nbsp;          | Zigzag (zkSync)     | [RPL](https://trade.zigzag.exchange/?market=RPL-ETH&network=zksync) | [rETH](https://trade.zigzag.exchange/?market=rETH-ETH&network=zksync)
 -->

## Management Committee Wallets

| Chain    | Committee | Address                                                                                                                         |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Mainnet  | GMC       | [0x6efD08303F42EDb68F2D6464BCdCA0824e1C813a](https://app.safe.global/home?safe=eth:0x6efD08303F42EDb68F2D6464BCdCA0824e1C813a)  |
| &nbsp;   | IMC       | [0xb867EA3bBC909954d737019FEf5AB25dFDb38CB9](https://app.safe.global/home?safe=eth:0xb867EA3bBC909954d737019FEf5AB25dFDb38CB9)  |
| Arbitrum | IMC       | [0xd7102A3744c302f167c53621453516345bC460d7](https://app.safe.global/home?safe=arb1:0xd7102A3744c302f167c53621453516345bC460d7) |

## All Active Deployed Protocol Contracts

| Chain     | Contract Name                         | Address                                                                                                                       |
| --------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Mainnet   | addressQueueStorage                   | [0x44E31944E1A6F3b8F805E105B130F8bdb7E2EBd8](https://etherscan.io/address/0x44E31944E1A6F3b8F805E105B130F8bdb7E2EBd8)         |
| &nbsp;    | addressSetStorage                     | [0xD4ae2511dF21F367792bA4D67c6eb032171c6a16](https://etherscan.io/address/0xD4ae2511dF21F367792bA4D67c6eb032171c6a16)         |
| &nbsp;    | rocketAuctionManager                  | [0x1a2F00D187C9388fDa3Bf2dc46a6b4740849EcCE](https://etherscan.io/address/0x1a2F00D187C9388fDa3Bf2dc46a6b4740849EcCE)         |
| &nbsp;    | rocketClaimDAO                        | [0xFe6Db0ce3F61a4aE04c0A3E62F775a6f511C9aaC](https://etherscan.io/address/0xFe6Db0ce3F61a4aE04c0A3E62F775a6f511C9aaC)         |
| &nbsp;    | rocketDAONodeTrusted                  | [0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9](https://etherscan.io/address/0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9)         |
| &nbsp;    | rocketDAONodeTrustedActions           | [0x029d946F28F93399a5b0D09c879FC8c94E596AEb](https://etherscan.io/address/0x029d946F28F93399a5b0D09c879FC8c94E596AEb)         |
| &nbsp;    | rocketDAONodeTrustedProposals         | [0xb0ec3F657ef43A615aB480FA8D5A53BF2c2f05d5](https://etherscan.io/address/0xb0ec3F657ef43A615aB480FA8D5A53BF2c2f05d5)         |
| &nbsp;    | rocketDAONodeTrustedSettingsMembers   | [0xdA1AB39e62E0A5297AF44C7064E501b0613f0D01](https://etherscan.io/address/0xdA1AB39e62E0A5297AF44C7064E501b0613f0D01)         |
| &nbsp;    | rocketDAONodeTrustedSettingsMinipool  | [0xE535fA45e12d748393C117C6D8EEBe1a7D124d95](https://etherscan.io/address/0xE535fA45e12d748393C117C6D8EEBe1a7D124d95)         |
| &nbsp;    | rocketDAONodeTrustedSettingsProposals | [0xAD038f8994a6bd51C8A72D3721CEd83401D4d2b0](https://etherscan.io/address/0xAD038f8994a6bd51C8A72D3721CEd83401D4d2b0)         |
| &nbsp;    | rocketDAONodeTrustedSettingsRewards   | [0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1](https://etherscan.io/address/0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1)         |
| &nbsp;    | rocketDAONodeTrustedUpgrade           | [0x952999Ec97248547D810Fd6464fDb78855b022aB](https://etherscan.io/address/0x952999Ec97248547D810Fd6464fDb78855b022aB)         |
| &nbsp;    | rocketDAOProposal                     | [0x37714D3a9D3b3091220D68184e3AFEC4Ec911368](https://etherscan.io/address/0x37714D3a9D3b3091220D68184e3AFEC4Ec911368)         |
| &nbsp;    | rocketDAOProtocol                     | [0x1b714ed0ce30A8BeDC5b4253DaAa08c84CA5BFcb](https://etherscan.io/address/0x1b714ed0ce30A8BeDC5b4253DaAa08c84CA5BFcb)         |
| &nbsp;    | rocketDAOProtocolActions              | [0xB50d513de40eE70A662c39207b4382a693f9e08D](https://etherscan.io/address/0xB50d513de40eE70A662c39207b4382a693f9e08D)         |
| &nbsp;    | rocketDAOProtocolProposals            | [0x6D736da1dC2562DBeA9998385A0A27d8c2B2793e](https://etherscan.io/address/0x6D736da1dC2562DBeA9998385A0A27d8c2B2793e)         |
| &nbsp;    | rocketDAOProtocolSettingsAuction      | [0xEF75e83633E686D3085b3a988b937D021e2fA628](https://etherscan.io/address/0xEF75e83633E686D3085b3a988b937D021e2fA628)         |
| &nbsp;    | rocketDAOProtocolSettingsDeposit      | [0xD846AA34caEf083DC4797d75096F60b6E08B7418](https://etherscan.io/address/0xD846AA34caEf083DC4797d75096F60b6E08B7418)         |
| &nbsp;    | rocketDAOProtocolSettingsInflation    | [0x1d4AAEaE7C8b75a8e5ab589a84516853DBDdd735](https://etherscan.io/address/0x1d4AAEaE7C8b75a8e5ab589a84516853DBDdd735)         |
| &nbsp;    | rocketDAOProtocolSettingsMinipool     | [0xA416A7a07925d60F794E20532bc730749611A220](https://etherscan.io/address/0xA416A7a07925d60F794E20532bc730749611A220)         |
| &nbsp;    | rocketDAOProtocolSettingsNetwork      | [0x89682e5F9bf69C909FC5E21a06495ac35E3671Ab](https://etherscan.io/address/0x89682e5F9bf69C909FC5E21a06495ac35E3671Ab)         |
| &nbsp;    | rocketDAOProtocolSettingsNode         | [0x448DA008c7EB2501165c9Aa62DfFEeC4405bC660](https://etherscan.io/address/0x448DA008c7EB2501165c9Aa62DfFEeC4405bC660)         |
| &nbsp;    | rocketDAOProtocolSettingsRewards      | [0x8857610Ba0A7caFD4dBE1120bfF03E9c74fc4124](https://etherscan.io/address/0x8857610Ba0A7caFD4dBE1120bfF03E9c74fc4124)         |
| &nbsp;    | rocketDepositPool                     | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://etherscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)         |
| &nbsp;    | rocketMerkleDistributorMainnet        | [0x5cE71E603B138F7e65029Cc1918C0566ed0dBD4B](https://etherscan.io/address/0x5cE71E603B138F7e65029Cc1918C0566ed0dBD4B)         |
| &nbsp;    | rocketMinipoolBase                    | [0x560656C8947564363497E9C78A8BDEff8d3EFF33](https://etherscan.io/address/0x560656C8947564363497E9C78A8BDEff8d3EFF33)         |
| &nbsp;    | rocketMinipoolBondReducer             | [0xf7aB34C74c02407ed653Ac9128731947187575C0](https://etherscan.io/address/0xf7aB34C74c02407ed653Ac9128731947187575C0)         |
| &nbsp;    | rocketMinipoolDelegate                | [0xA347C391bc8f740CAbA37672157c8aAcD08Ac567](https://etherscan.io/address/0xA347C391bc8f740CAbA37672157c8aAcD08Ac567)         |
| &nbsp;    | rocketMinipoolFactory                 | [0x7B8c48256CaF462670f84c7e849cab216922B8D3](https://etherscan.io/address/0x7B8c48256CaF462670f84c7e849cab216922B8D3)         |
| &nbsp;    | rocketMinipoolManager                 | [0x09fbCE43e4021a3F69C4599FF00362b83edA501E](https://etherscan.io/address/0x09fbCE43e4021a3F69C4599FF00362b83edA501E)         |
| &nbsp;    | rocketMinipoolPenalty                 | [0xE64AC47b6e2FEcfCDEA35147Fe61af9894A06ba6](https://etherscan.io/address/0xE64AC47b6e2FEcfCDEA35147Fe61af9894A06ba6)         |
| &nbsp;    | rocketMinipoolQueue                   | [0x9e966733e3E9BFA56aF95f762921859417cF6FaA](https://etherscan.io/address/0x9e966733e3E9BFA56aF95f762921859417cF6FaA)         |
| &nbsp;    | rocketMinipoolStatus                  | [0xa52451b9d25EEf02BE42B3A8161A18f947F8A6a5](https://etherscan.io/address/0xa52451b9d25EEf02BE42B3A8161A18f947F8A6a5)         |
| &nbsp;    | rocketNetworkBalances                 | [0x6Cc65bF618F55ce2433f9D8d827Fc44117D81399](https://etherscan.io/address/0x6Cc65bF618F55ce2433f9D8d827Fc44117D81399)         |
| &nbsp;    | rocketNetworkFees                     | [0xf824e2d69dc7e7c073162C2bdE87dA4746d27a0f](https://etherscan.io/address/0xf824e2d69dc7e7c073162C2bdE87dA4746d27a0f)         |
| &nbsp;    | rocketNetworkPenalties                | [0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8](https://etherscan.io/address/0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8)         |
| &nbsp;    | rocketNetworkPrices                   | [0x25E54Bf48369b8FB25bB79d3a3Ff7F3BA448E382](https://etherscan.io/address/0x25E54Bf48369b8FB25bB79d3a3Ff7F3BA448E382)         |
| &nbsp;    | rocketNodeDeposit                     | [0x9304B4ebFbE68932Cf9Af8De4d21D7e7621f701a](https://etherscan.io/address/0x9304B4ebFbE68932Cf9Af8De4d21D7e7621f701a)         |
| &nbsp;    | rocketNodeDistributorDelegate         | [0x32778D6bf5b93B89177D328556EeeB35c09f472b](https://etherscan.io/address/0x32778D6bf5b93B89177D328556EeeB35c09f472b)         |
| &nbsp;    | rocketNodeDistributorFactory          | [0xe228017f77B3E0785e794e4c0a8A6b935bB4037C](https://etherscan.io/address/0xe228017f77B3E0785e794e4c0a8A6b935bB4037C)         |
| &nbsp;    | rocketNodeManager                     | [0x2b52479F6ea009907e46fc43e91064D1b92Fdc86](https://etherscan.io/address/0x2b52479F6ea009907e46fc43e91064D1b92Fdc86)         |
| &nbsp;    | rocketNodeStaking                     | [0x0e29BA1155cE103A07118c8912dA44B0507A982D](https://etherscan.io/address/0x0e29BA1155cE103A07118c8912dA44B0507A982D)         |
| &nbsp;    | rocketRewardsPool                     | [0xEE4d2A71cF479e0D3d0c3c2C923dbfEB57E73111](https://etherscan.io/address/0xEE4d2A71cF479e0D3d0c3c2C923dbfEB57E73111)         |
| &nbsp;    | rocketSmoothingPool                   | [0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7](https://etherscan.io/address/0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7)         |
| &nbsp;    | rocketStorage                         | [0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46](https://etherscan.io/address/0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46)         |
| &nbsp;    | rocketTokenRETH                       | [0xae78736Cd615f374D3085123A210448E74Fc6393](https://etherscan.io/address/0xae78736Cd615f374D3085123A210448E74Fc6393)         |
| &nbsp;    | rocketTokenRPL                        | [0xD33526068D116cE69F19A9ee46F0bd304F21A51f](https://etherscan.io/address/0xD33526068D116cE69F19A9ee46F0bd304F21A51f)         |
| &nbsp;    | rocketUpgradeOneDotOne                | [0xC680a22b4F03977f69b51A09f3Dbe922eb77C8FE](https://etherscan.io/address/0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe)         |
| &nbsp;    | rocketUpgradeOneDotTwo                | [0x9a0b5d3101d111EA0edD573d45ef2208CC97984a](https://etherscan.io/address/0x9a0b5d3101d111EA0edD573d45ef2208CC97984a)         |
| &nbsp;    | rocketUpgradeOneDotThree              | [0x5dC69083B68CDb5c9ca492A0A5eC581e529fb73C](https://etherscan.io/address/0x5dC69083B68CDb5c9ca492A0A5eC581e529fb73C)         |
| &nbsp;    | rocketVault                           | [0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6](https://etherscan.io/address/0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6)         |
| &nbsp;    | rocketNetworkSnapshots                | [0x7603352f1C4752Ac07AAC94e48632b65FDF1D35c](https://etherscan.io/address/0x7603352f1C4752Ac07AAC94e48632b65FDF1D35c)         |
| &nbsp;    | rocketNetworkVoting                   | [0xA9d27E1952f742d659143a544d3e535fFf3Eebe1](https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1)         |
| &nbsp;    | rocketDAOProtocolSettingsProposals    | [0x5f24E4a1A1f134a5a6952A9965721E6344898497](https://etherscan.io/address/0x5f24E4a1A1f134a5a6952A9965721E6344898497)         |
| &nbsp;    | rocketDAOProtocolVerifier             | [0x25F41Cd11d95DBEC0919A0440343698cf1472a33](https://etherscan.io/address/0x25F41Cd11d95DBEC0919A0440343698cf1472a33)         |
| &nbsp;    | rocketDAOSecurity                     | [0x84aE6D61Df5c6ba7196b5C76Bcb112B8a689aD37](https://etherscan.io/address/0x84aE6D61Df5c6ba7196b5C76Bcb112B8a689aD37)         |
| &nbsp;    | rocketDAOSecurityActions              | [0xeaa442dF4Bb5394c66C8024eFb4979bEc89Eb59a](https://etherscan.io/address/0xeaa442dF4Bb5394c66C8024eFb4979bEc89Eb59a)         |
| &nbsp;    | rocketDAOSecurityProposals            | [0x6004Fa90a27dB9971aDD200d1A3BB34444db9Fb7](https://etherscan.io/address/0x6004Fa90a27dB9971aDD200d1A3BB34444db9Fb7)         |
| &nbsp;    | rocketDAOProtocolSettingsSecurity     | [0x1ec364CDD9697F56B8CB17a745B98C2b862CBE29](https://etherscan.io/address/0x1ec364CDD9697F56B8CB17a745B98C2b862CBE29)         |
| &nbsp;    | rocketDAOProtocolProposal             | [0x7cee91F49001B08f8D562d58510C76bcEcD61FA0](https://etherscan.io/address/0x7cee91F49001B08f8D562d58510C76bcEcD61FA0)         |
| Holesky\* | addressQueueStorage                   | [0x0d8d8f8541b12a0e1194b7cc4b6d954b90ab82ec](https://holesky.etherscan.io/address/0x0d8d8f8541b12a0e1194b7cc4b6d954b90ab82ec) |
| &nbsp;    | addressSetStorage                     | [0x32778d6bf5b93b89177d328556eeeb35c09f472b](https://holesky.etherscan.io/address/0x32778d6bf5b93b89177d328556eeeb35c09f472b) |
| &nbsp;    | rocketAuctionManager                  | [0x84d11b65e026f7aa08f5497dd3593fb083410b71](https://holesky.etherscan.io/address/0x84d11b65e026f7aa08f5497dd3593fb083410b71) |
| &nbsp;    | rocketClaimDAO                        | [0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe](https://holesky.etherscan.io/address/0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe) |
| &nbsp;    | rocketDAONodeTrusted                  | [0x56cd23baaf2e7cb7056968d85e5efe343b0e1dc2](https://holesky.etherscan.io/address/0x56cd23baaf2e7cb7056968d85e5efe343b0e1dc2) |
| &nbsp;    | rocketDAONodeTrustedActions           | [0xa0f327589b08ceb824c21cde8ead5a3e6ca9edf7](https://holesky.etherscan.io/address/0xa0f327589b08ceb824c21cde8ead5a3e6ca9edf7) |
| &nbsp;    | rocketDAONodeTrustedProposals         | [0x2d3142a05bdd16a3223b585a7a48132867da6480](https://holesky.etherscan.io/address/0x2d3142a05bdd16a3223b585a7a48132867da6480) |
| &nbsp;    | rocketDAONodeTrustedSettingsMembers   | [0x5c2d33a015d132d4f590f00df807bb1052531ab9](https://holesky.etherscan.io/address/0x5c2d33a015d132d4f590f00df807bb1052531ab9) |
| &nbsp;    | rocketDAONodeTrustedSettingsMinipool  | [0x5ffe8bd3165e80d51ce834b32a6b6c02233494bf](https://holesky.etherscan.io/address/0x5ffe8bd3165e80d51ce834b32a6b6c02233494bf) |
| &nbsp;    | rocketDAONodeTrustedSettingsProposals | [0xe4c3ec6a20be31296032f968ceadee9e9aa76535](https://holesky.etherscan.io/address/0xe4c3ec6a20be31296032f968ceadee9e9aa76535) |
| &nbsp;    | rocketDAONodeTrustedSettingsRewards   | [0x2fb42ffe2d7df8381853e96304300c6a5e846905](https://holesky.etherscan.io/address/0x2fb42ffe2d7df8381853e96304300c6a5e846905) |
| &nbsp;    | rocketDAONodeTrustedUpgrade           | [0x4640b8610f3efdeb8d44834adb3228d0e79eaa09](https://holesky.etherscan.io/address/0x4640b8610f3efdeb8d44834adb3228d0e79eaa09) |
| &nbsp;    | rocketDAOProposal                     | [0xeb4377AA1333e6331c5F3428Bdd737DF1640790C](https://holesky.etherscan.io/address/0xeb4377AA1333e6331c5F3428Bdd737DF1640790C) |
| &nbsp;    | rocketDAOProtocol                     | [0xbd1e62aebfa1e60797484916685e2b9e62adbf7b](https://holesky.etherscan.io/address/0xbd1e62aebfa1e60797484916685e2b9e62adbf7b) |
| &nbsp;    | rocketDAOProtocolActions              | [0x1aa4544ce0fd51596b6d51d0f55a40e409b8bad4](https://holesky.etherscan.io/address/0x1aa4544ce0fd51596b6d51d0f55a40e409b8bad4) |
| &nbsp;    | rocketDAOProtocolProposals            | [0x762e79b27fee0c0975f9cabea9e9976006a7ad98](https://holesky.etherscan.io/address/0x762e79b27fee0c0975f9cabea9e9976006a7ad98) |
| &nbsp;    | RocketDAOProtocolProposal             | [0x971D901776bBA081493A8584183754C8E09B534C](https://holesky.etherscan.io/address/0x971D901776bBA081493A8584183754C8E09B534C) |
| &nbsp;    | rocketDAOProtocolSettingsAuction      | [0x387CCc7b41B0aAc2C7611131543c79DE9d0d1C63](https://holesky.etherscan.io/address/0x387CCc7b41B0aAc2C7611131543c79DE9d0d1C63) |
| &nbsp;    | rocketDAOProtocolSettingsDeposit      | [0x47b600d9127a473e45b693a7badd9f4d929d5b76](https://holesky.etherscan.io/address/0x47b600d9127a473e45b693a7badd9f4d929d5b76) |
| &nbsp;    | rocketDAOProtocolSettingsInflation    | [0x0b615FfC5e169d4516277F1F0F94F92AEd7D4b8a](https://holesky.etherscan.io/address/0x0b615FfC5e169d4516277F1F0F94F92AEd7D4b8a) |
| &nbsp;    | rocketDAOProtocolSettingsMinipool     | [0x12b8E08383aA5C990dF73efC115C93F37975a60a](https://holesky.etherscan.io/address/0x12b8E08383aA5C990dF73efC115C93F37975a60a) |
| &nbsp;    | rocketDAOProtocolSettingsNetwork      | [0x335A3C387262Da18DffcfcD9540691F7885272e0](https://holesky.etherscan.io/address/0x335A3C387262Da18DffcfcD9540691F7885272e0) |
| &nbsp;    | rocketDAOProtocolSettingsNode         | [0x6f737E2A3af0FAF566521774c7Fe771Dc5f0B93d](https://holesky.etherscan.io/address/0x6f737E2A3af0FAF566521774c7Fe771Dc5f0B93d) |
| &nbsp;    | rocketDAOProtocolSettingsRewards      | [0x3B0Bc730a6C8e241C2151316D6B40eB550de6Fa0](https://holesky.etherscan.io/address/0x3B0Bc730a6C8e241C2151316D6B40eB550de6Fa0) |
| &nbsp;    | rocketDepositPool                     | [0x320f3aab9405e38b955178bbe75c477decba0c27](https://holesky.etherscan.io/address/0x320f3aab9405e38b955178bbe75c477decba0c27) |
| &nbsp;    | rocketMerkleDistributorMainnet        | [0x7158DBa76E651b1EB17931533812fc8c528f3D9B](https://holesky.etherscan.io/address/0x7158DBa76E651b1EB17931533812fc8c528f3D9B) |
| &nbsp;    | rocketMinipoolBase                    | [0xac2245be4c2c1e9752499bcd34861b761d62fc27](https://holesky.etherscan.io/address/0xac2245be4c2c1e9752499bcd34861b761d62fc27) |
| &nbsp;    | rocketMinipoolBondReducer             | [0x6d010c43d4e96d74c422f2e27370af48711b49bf](https://holesky.etherscan.io/address/0x6d010c43d4e96d74c422f2e27370af48711b49bf) |
| &nbsp;    | rocketMinipoolDelegate                | [0x830111EA19Af1401FBB02Af910C4c6D49a87911B](https://holesky.etherscan.io/address/0x830111EA19Af1401FBB02Af910C4c6D49a87911B) |
| &nbsp;    | rocketMinipoolFactory                 | [0xdd3f50f8a6cafbe9b31a427582963f465e745af8](https://holesky.etherscan.io/address/0xdd3f50f8a6cafbe9b31a427582963f465e745af8) |
| &nbsp;    | rocketMinipoolManager                 | [0x04b87C2C9F64CA304B9479279cd8e3051f8cAF1E](https://holesky.etherscan.io/address/0x04b87C2C9F64CA304B9479279cd8e3051f8cAF1E) |
| &nbsp;    | rocketMinipoolPenalty                 | [0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788](https://holesky.etherscan.io/address/0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788) |
| &nbsp;    | rocketMinipoolQueue                   | [0x4220eecd69b2e1e70a7001637cc3d839ee2e97f5](https://holesky.etherscan.io/address/0x4220eecd69b2e1e70a7001637cc3d839ee2e97f5) |
| &nbsp;    | rocketMinipoolStatus                  | [0x0000000000000000000000000000000000000000](https://holesky.etherscan.io/address/0x0000000000000000000000000000000000000000) |
| &nbsp;    | rocketNetworkBalances                 | [0xD7149C166A83D25fE1EaFc8263Ec5A3B9cb29DD1](https://holesky.etherscan.io/address/0xD7149C166A83D25fE1EaFc8263Ec5A3B9cb29DD1) |
| &nbsp;    | rocketNetworkFees                     | [0x2cac916b2a963bf162f076c0a8a4a8200bcfbfb4](https://holesky.etherscan.io/address/0x2cac916b2a963bf162f076c0a8a4a8200bcfbfb4) |
| &nbsp;    | rocketNetworkPenalties                | [0xcc82c913b9f3a207b332d216b101970e39e59db3](https://holesky.etherscan.io/address/0xcc82c913b9f3a207b332d216b101970e39e59db3) |
| &nbsp;    | rocketNetworkPrices                   | [0x5EC7281249f6F18120361c564767a0b4D191Fd7C](https://holesky.etherscan.io/address/0x5EC7281249f6F18120361c564767a0b4D191Fd7C) |
| &nbsp;    | rocketNodeDeposit                     | [0x307eb333e754995f23bf13F27169Acd97dE743B5](https://holesky.etherscan.io/address/0x307eb333e754995f23bf13F27169Acd97dE743B5) |
| &nbsp;    | rocketNodeDistributorDelegate         | [0x9e966733e3e9bfa56af95f762921859417cf6faa](https://holesky.etherscan.io/address/0x9e966733e3e9bfa56af95f762921859417cf6faa) |
| &nbsp;    | rocketNodeDistributorFactory          | [0x42d4e4b59220da435a0bd6b5892b90ff50e1d8d4](https://holesky.etherscan.io/address/0x42d4e4b59220da435a0bd6b5892b90ff50e1d8d4) |
| &nbsp;    | rocketNodeManager                     | [0xFfd183D60766FaF57097733408c8014169CeDCE0](https://holesky.etherscan.io/address/0xFfd183D60766FaF57097733408c8014169CeDCE0) |
| &nbsp;    | rocketNodeStaking                     | [0x2C905c262cE02f582276fa1717ecc6611E82A952](https://holesky.etherscan.io/address/0x2C905c262cE02f582276fa1717ecc6611E82A952) |
| &nbsp;    | rocketRewardsPool                     | [0x9D210F9169bc6Cf49152F21A57A446bCcaA87b33](https://holesky.etherscan.io/address/0x9D210F9169bc6Cf49152F21A57A446bCcaA87b33) |
| &nbsp;    | rocketSmoothingPool                   | [0xa347c391bc8f740caba37672157c8aacd08ac567](https://holesky.etherscan.io/address/0xa347c391bc8f740caba37672157c8aacd08ac567) |
| &nbsp;    | rocketStorage                         | [0x594fb75d3dc2dfa0150ad03f99f97817747dd4e1](https://holesky.etherscan.io/address/0x594fb75d3dc2dfa0150ad03f99f97817747dd4e1) |
| &nbsp;    | rocketTokenRETH                       | [0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1](https://holesky.etherscan.io/address/0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1) |
| &nbsp;    | rocketTokenRPL                        | [0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0](https://holesky.etherscan.io/address/0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0) |
| &nbsp;    | rocketUpgradeOneDotThree              | [0xa38f23783358e6Ce576441525bE0Ad6Dab5B0eF4](https://holesky.etherscan.io/address/0xa38f23783358e6Ce576441525bE0Ad6Dab5B0eF4) |
| &nbsp;    | RocketUpgradeOneDotThreeHotfix        | [0xe068629fe7bf0242387f238Ab1AD66D6C3277f6F](https://holesky.etherscan.io/address/0xe068629fe7bf0242387f238Ab1AD66D6C3277f6F) |
| &nbsp;    | RocketUpgradeOneDotThreeDotOne        | [0xC5bc3adEB85657EB82FB692Ef814760799d9Ab0A](https://holesky.etherscan.io/address/0xC5bc3adEB85657EB82FB692Ef814760799d9Ab0A)         |
| &nbsp;    | rocketVault                           | [0x67cde7af920682a29fcfea1a179ef0f30f48df3e](https://holesky.etherscan.io/address/0x67cde7af920682a29fcfea1a179ef0f30f48df3e) |
| &nbsp;    | rocketNetworkSnapshots                | [0xBE680b191F35AC8FD3147b8DE219FB2D8635b716](https://holesky.etherscan.io/address/0xBE680b191F35AC8FD3147b8DE219FB2D8635b716) |
| &nbsp;    | rocketNetworkVoting                   | [0x325e4624D606Bd40a1Cf74831cE9724B0Ed68138](https://holesky.etherscan.io/address/0x325e4624D606Bd40a1Cf74831cE9724B0Ed68138) |
| &nbsp;    | rocketDAOProtocolSettingsProposals    | [0xd087282cD1EE469d7E6184570b5f3419dF39DB00](https://holesky.etherscan.io/address/0xd087282cD1EE469d7E6184570b5f3419dF39DB00) |
| &nbsp;    | rocketDAOProtocolVerifier             | [0x4e9f08969cfcA212f4Ea10500c57891338dFec69](https://holesky.etherscan.io/address/0x4e9f08969cfcA212f4Ea10500c57891338dFec69) |
| &nbsp;    | rocketDAOSecurity                     | [0x611593515d456c1C2e2455883DdbC1687130F5C9](https://holesky.etherscan.io/address/0x611593515d456c1C2e2455883DdbC1687130F5C9) |
| &nbsp;    | rocketDAOSecurityActions              | [0x9171b230020d11A8798E30e905A1bDFf6006EcCa](https://holesky.etherscan.io/address/0x9171b230020d11A8798E30e905A1bDFf6006EcCa) |
| &nbsp;    | rocketDAOSecurityProposals            | [0x21Cf501e760226070385fd43206A26908aee5Dd6](https://holesky.etherscan.io/address/0x21Cf501e760226070385fd43206A26908aee5Dd6) |
| &nbsp;    | rocketDAOProtocolSettingsSecurity     | [0xc6d2625fd792821778213D181C68930aAAe28777](https://holesky.etherscan.io/address/0xc6d2625fd792821778213D181C68930aAAe28777) |
| &nbsp;    | rocketDAOProtocolProposal             | [0x35D41dc9dcC0Ace45CAD571A8B451Bf2dE5DbAa8](https://holesky.etherscan.io/address/0x35D41dc9dcC0Ace45CAD571A8B451Bf2dE5DbAa8) |

<small>\* Testnet</small>

This list was updated 10/8/2024

The addresses can be queried on chain as shown in this [example](https://docs.rocketpool.net/developers/usage/contracts/contracts.html#interacting-with-rocket-pool).
