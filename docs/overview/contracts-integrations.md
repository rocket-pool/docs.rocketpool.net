---
permalink: /overview/contracts-integrations
---

# :handshake: Contracts & Integrations

Do you love RPL and rETH? Us too! So we put together a list of integrations and services, as well as official contract deployments, to help you discover new places these assets can be used!

If you would like to contribute by helping integrate Rocket Pool into more services and protocols, reach out on [Discord](https://discord.gg/MYrazaZZC4)!

## Key Protocol Contracts

| Chain     | Contract | Address                                                                                                                      |
|-----------| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Mainnet   | Deposit  | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://etherscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)        |
| &nbsp;    | Storage  | [0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46](https://etherscan.io/address/0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46)        |
| Goerli\*  | Deposit  | [0xa9A6A14A3643690D0286574976F45abBDAD8f505](https://goerli.etherscan.io/address/0xa9A6A14A3643690D0286574976F45abBDAD8f505) |
| &nbsp;    | Storage  | [0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3](https://goerli.etherscan.io/address/0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3) |
| Holesky\* | Deposit  | [0x320f3aAB9405e38b955178BBe75c477dECBA0C27](https://holesky.etherscan.io/address/0x320f3aAB9405e38b955178BBe75c477dECBA0C27) |
| &nbsp;    | Storage  | [0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1](https://holesky.etherscan.io/address/0x594Fb75D3dc2DFa0150Ad03F99F97817747dd4E1) |

Within the protocol, the Storage contract is used to find all the other deployed contract addresses as needed (see this [example](https://docs.rocketpool.net/developers/usage/contracts/contracts.html#interacting-with-rocket-pool)).
See [All Active Deployed Protocol Contracts](#all-active-deployed-protocol-contracts) below for a full list of addresses.

<small>\* Testnet</small>

## Token Contracts

| Chain             | Asset | Address                                                                                                                               |
|-------------------| ----- |---------------------------------------------------------------------------------------------------------------------------------------|
| Mainnet           | RPL   | [0xD33526068D116cE69F19A9ee46F0bd304F21A51f](https://etherscan.io/token/0xd33526068d116ce69f19a9ee46f0bd304f21a51f)                   |
| &nbsp;            | rETH  | [0xae78736Cd615f374D3085123A210448E74Fc6393](https://etherscan.io/token/0xae78736cd615f374d3085123a210448e74fc6393)                   |
| Arbitrum          | RPL   | [0xb766039cc6db368759c1e56b79affe831d0cc507](https://arbiscan.io/token/0xb766039cc6db368759c1e56b79affe831d0cc507)                    |
| &nbsp;            | rETH  | [0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8](https://arbiscan.io/token/0xec70dcb4a1efa46b8f2d97c310c9c4790ba5ffa8)                    |
| Optimism          | RPL   | [0xc81d1f0eb955b0c020e5d5b264e1ff72c14d1401](https://optimistic.etherscan.io/token/0xc81d1f0eb955b0c020e5d5b264e1ff72c14d1401)        |
| &nbsp;            | rETH  | [0x9bcef72be871e61ed4fbbc7630889bee758eb81d](https://optimistic.etherscan.io/token/0x9bcef72be871e61ed4fbbc7630889bee758eb81d)        |
| zkSync Era        | RPL   | [0x1CF8553Da5a75C20cdC33532cb19Ef7E3bFFf5BC](https://explorer.zksync.io/address/0x1CF8553Da5a75C20cdC33532cb19Ef7E3bFFf5BC)           |
| &nbsp;            | rETH  | [0x32Fd44bB869620C0EF993754c8a00Be67C464806](https://explorer.zksync.io/address/0x32Fd44bB869620C0EF993754c8a00Be67C464806)           |
| Polygon           | RPL   | [0x7205705771547cf79201111b4bd8aaf29467b9ec](https://polygonscan.com/token/0x7205705771547cf79201111b4bd8aaf29467b9ec)                |
| &nbsp;            | rETH  | [0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1](https://polygonscan.com/token/0x0266F4F08D82372CF0FcbCCc0Ff74309089c74d1)                |
| Polygon (zkEVM)   | RPL   | [0x70d35152fBf63FB312709b11a9Bac87519de0019](https://zkevm.polygonscan.com/address/0x70d35152fBf63FB312709b11a9Bac87519de0019)        | 
| &nbsp;            | rETH  | [0xb23C20EFcE6e24Acca0Cef9B7B7aA196b84EC942](https://zkevm.polygonscan.com/address/0xb23C20EFcE6e24Acca0Cef9B7B7aA196b84EC942)        | 
| Goerli\*          | RPL   | [0x5e932688e81a182e3de211db6544f98b8e4f89c7](https://goerli.etherscan.io/address/0x5e932688e81a182e3de211db6544f98b8e4f89c7)          |
| &nbsp;            | rETH  | [0x178E141a0E3b34152f73Ff610437A7bf9B83267A](https://goerli.etherscan.io/address/0x178E141a0E3b34152f73Ff610437A7bf9B83267A)          |
| Holesky\*         | RPL   | [0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0](https://goerli.etherscan.io/address/0x5e932688e81a182e3de211db6544f98b8e4f89c7)          |
| &nbsp;            | rETH  | [0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1](https://goerli.etherscan.io/address/0x178E141a0E3b34152f73Ff610437A7bf9B83267A)          |
| Optimism Goerli\* | RPL   | [0xa00E3A3511aAC35cA78530c85007AFCd31753819](https://goerli-optimism.etherscan.io/address/0xa00E3A3511aAC35cA78530c85007AFCd31753819) |
| &nbsp;            | rETH  | [0x1010824414d822cd2167f9ad73a2a99bd2e0e4ae](https://goerli-optimism.etherscan.io/address/0x1010824414d822cd2167f9ad73a2a99bd2e0e4ae) |
| Base              | RPL   | [0x1f73EAf55d696BFFA9b0EA16fa987B93b0f4d302](https://basescan.org/address/0x1f73EAf55d696BFFA9b0EA16fa987B93b0f4d302)                 |
| &nbsp;            | rETH  | [0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c](https://basescan.org/address/0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c)                 |

<small>\* Testnet</small>

## Deposit Pool Contract Version History

| Chain     | RP Version      | Address                                                                                                                      |
|-----------| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Mainnet   | v1.2 (Atlas)    | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://etherscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)        |
| &nbsp;    | v1.1 (Redstone) | [0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4](https://etherscan.io/address/0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4)        |
| &nbsp;    | v1.0            | [0x4D05E3d48a938db4b7a9A59A802D5b45011BDe58](https://etherscan.io/address/0x4D05E3d48a938db4b7a9A59A802D5b45011BDe58)        |
| Goerli\*  | v1.2 (Atlas)    | [0xa9A6A14A3643690D0286574976F45abBDAD8f505](https://goerli.etherscan.io/address/0xa9A6A14A3643690D0286574976F45abBDAD8f505) |
| &nbsp;    | v1.1 (Redstone) | [0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4](https://goerli.etherscan.io/address/0x2cac916b2A963Bf162f076C0a8a4a8200BCFBfb4) |
| &nbsp;    | v1.0            | [0x923Ed282Cda8952910B71B5efcA7CDa09e39c633](https://goerli.etherscan.io/address/0x923Ed282Cda8952910B71B5efcA7CDa09e39c633) |
| Holesky\* | v1.2 (Atlas)    | [0x320f3aab9405e38b955178bbe75c477decba0c27](https://goerli.etherscan.io/address/0xa9A6A14A3643690D0286574976F45abBDAD8f505) |

<small>\* Testnet</small>

## Integrations

| Category         | Service                       | Link                                                                                                                                     | Link                                                                                                                                                                         |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data Feeds       | Subgraph                      | [RPL](https://github.com/Data-Nexus/rocket-pool-mainnet)                                                                                 | [rETH](https://github.com/Data-Nexus/rocket-pool-mainnet)                                                                                                                    |
| Exchanges        | 1inch (Mainnet)               | -                                                                                                                                        | [ETH/rETH](https://app.1inch.io/#/1/unified/swap/ETH/rETH)                                                                                                                   |
| &nbsp;           | Aura Finance (Mainnet)        | [rETH/RPL](https://app.aura.finance/#/)                                                                                                  | [wETH/rETH](https://app.aura.finance/#/)                                                                                                                                     |
| &nbsp;           | Balancer (Mainnet)            | [rETH/RPL](https://app.balancer.fi/#/ethereum/pool/0x9f9d900462492d4c21e9523ca95a7cd86142f298000200000000000000000462)                   | [ETH/rETH](https://app.balancer.fi/#/ethereum/pool/0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112)                                                       |
| &nbsp;           | Bancor (Mainnet)              | [ETH/RPL](https://app.bancor.network/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xD33526068D116cE69F19A9ee46F0bd304F21A51f) | [ETH/rETH](https://app.bancor.network/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xae78736Cd615f374D3085123A210448E74Fc6393)                                    |
| &nbsp;           | Curve (Mainnet)               | -                                                                                                                                        | [wstETH/rETH](https://curve.fi/factory-crypto/14)                                                                                                                            |
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
| Wallets          | Coinbase Wallet (Mainnet)     | -                                                                                                                                        | [rETH](https://www.coinbase.com/wallet)                                                                                                                                      |
| &nbsp;           | Trust Wallet (Mainnet)        | -                                                                                                                                        | [rETH](https://trustwallet.com/)                                                                                                                                             |

<small>\*\* Likely not profitable</small>

<!-- Staged Integrations -->
<!--
- RPL ZigZag listing (waiting for MM)
&nbsp;          | Zigzag (zkSync)     | [RPL](https://trade.zigzag.exchange/?market=RPL-ETH&network=zksync) | [rETH](https://trade.zigzag.exchange/?market=rETH-ETH&network=zksync)
 -->


## Management Committee Wallets
| Chain        | Committee | Address                                                                                                                        |
|--------------|-----------|--------------------------------------------------------------------------------------------------------------------------------|
| Mainnet      | GMC       | [0x6efD08303F42EDb68F2D6464BCdCA0824e1C813a](https://app.safe.global/home?safe=eth:0x6efD08303F42EDb68F2D6464BCdCA0824e1C813a) |
| &nbsp;       | IMC       | [0xb867EA3bBC909954d737019FEf5AB25dFDb38CB9](https://app.safe.global/home?safe=eth:0xb867EA3bBC909954d737019FEf5AB25dFDb38CB9) |
| Arbitrum     | IMC       | [0xd7102A3744c302f167c53621453516345bC460d7](https://app.safe.global/home?safe=arb1:0xd7102A3744c302f167c53621453516345bC460d7) | 


## All Active Deployed Protocol Contracts

| Chain   | Contract Name                         | Address                                                                                                                       |
|---------| ------------------------------------- |-------------------------------------------------------------------------------------------------------------------------------|
| Mainnet | addressQueueStorage                   | [0x44E31944E1A6F3b8F805E105B130F8bdb7E2EBd8](https://etherscan.io/address/0x44E31944E1A6F3b8F805E105B130F8bdb7E2EBd8)         |
| &nbsp;  | addressSetStorage                     | [0xD4ae2511dF21F367792bA4D67c6eb032171c6a16](https://etherscan.io/address/0xD4ae2511dF21F367792bA4D67c6eb032171c6a16)         |
| &nbsp;  | rocketAuctionManager                  | [0x1a2F00D187C9388fDa3Bf2dc46a6b4740849EcCE](https://etherscan.io/address/0x1a2F00D187C9388fDa3Bf2dc46a6b4740849EcCE)         |
| &nbsp;  | rocketClaimDAO                        | [0x4a625C617a44E60F74E3fe3bf6d6333b63766e91](https://etherscan.io/address/0x4a625C617a44E60F74E3fe3bf6d6333b63766e91)         |
| &nbsp;  | rocketDAONodeTrusted                  | [0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9](https://etherscan.io/address/0xb8e783882b11Ff4f6Cef3C501EA0f4b960152cc9)         |
| &nbsp;  | rocketDAONodeTrustedActions           | [0x029d946F28F93399a5b0D09c879FC8c94E596AEb](https://etherscan.io/address/0x029d946F28F93399a5b0D09c879FC8c94E596AEb)         |
| &nbsp;  | rocketDAONodeTrustedProposals         | [0xb0ec3F657ef43A615aB480FA8D5A53BF2c2f05d5](https://etherscan.io/address/0xb0ec3F657ef43A615aB480FA8D5A53BF2c2f05d5)         |
| &nbsp;  | rocketDAONodeTrustedSettingsMembers   | [0xdA1AB39e62E0A5297AF44C7064E501b0613f0D01](https://etherscan.io/address/0xdA1AB39e62E0A5297AF44C7064E501b0613f0D01)         |
| &nbsp;  | rocketDAONodeTrustedSettingsMinipool  | [0xE535fA45e12d748393C117C6D8EEBe1a7D124d95](https://etherscan.io/address/0xE535fA45e12d748393C117C6D8EEBe1a7D124d95)         |
| &nbsp;  | rocketDAONodeTrustedSettingsProposals | [0xAD038f8994a6bd51C8A72D3721CEd83401D4d2b0](https://etherscan.io/address/0xAD038f8994a6bd51C8A72D3721CEd83401D4d2b0)         |
| &nbsp;  | rocketDAONodeTrustedSettingsRewards   | [0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1](https://etherscan.io/address/0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1)         |
| &nbsp;  | rocketDAONodeTrustedUpgrade           | [0x952999Ec97248547D810Fd6464fDb78855b022aB](https://etherscan.io/address/0x952999Ec97248547D810Fd6464fDb78855b022aB)         |
| &nbsp;  | rocketDAOProposal                     | [0x37714D3a9D3b3091220D68184e3AFEC4Ec911368](https://etherscan.io/address/0x37714D3a9D3b3091220D68184e3AFEC4Ec911368)         |
| &nbsp;  | rocketDAOProtocol                     | [0x0429Cdd8cEACe24d4dC2B97Ce22A780a407dF0e1](https://etherscan.io/address/0x0429Cdd8cEACe24d4dC2B97Ce22A780a407dF0e1)         |
| &nbsp;  | rocketDAOProtocolActions              | [0xB50d513de40eE70A662c39207b4382a693f9e08D](https://etherscan.io/address/0xB50d513de40eE70A662c39207b4382a693f9e08D)         |
| &nbsp;  | rocketDAOProtocolProposals            | [0x42EC642eAa86091059569d8De8aeccf7F2F9B1a2](https://etherscan.io/address/0x42EC642eAa86091059569d8De8aeccf7F2F9B1a2)         |
| &nbsp;  | rocketDAOProtocolSettingsAuction      | [0x87c41E0a44826745b398071025e306Ce03bebeCf](https://etherscan.io/address/0x87c41E0a44826745b398071025e306Ce03bebeCf)         |
| &nbsp;  | rocketDAOProtocolSettingsDeposit      | [0xac2245BE4C2C1E9752499Bcd34861B761d62fC27](https://etherscan.io/address/0xac2245BE4C2C1E9752499Bcd34861B761d62fC27)         |
| &nbsp;  | rocketDAOProtocolSettingsInflation    | [0xEDD568281929a9a276F4cBEd80DEB208f11Ba3Bb](https://etherscan.io/address/0xEDD568281929a9a276F4cBEd80DEB208f11Ba3Bb)         |
| &nbsp;  | rocketDAOProtocolSettingsMinipool     | [0x42d4e4B59220dA435A0bd6b5892B90fF50e1D8D4](https://etherscan.io/address/0x42d4e4B59220dA435A0bd6b5892B90fF50e1D8D4)         |
| &nbsp;  | rocketDAOProtocolSettingsNetwork      | [0x320f3aAB9405e38b955178BBe75c477dECBA0C27](https://etherscan.io/address/0x320f3aAB9405e38b955178BBe75c477dECBA0C27)         |
| &nbsp;  | rocketDAOProtocolSettingsNode         | [0x17Cf2c5d69E4F222bcaDD86d210FE9dc8BadA60B](https://etherscan.io/address/0x17Cf2c5d69E4F222bcaDD86d210FE9dc8BadA60B)         |
| &nbsp;  | rocketDAOProtocolSettingsRewards      | [0xCDb681AF33C60f4D659d12E309b6C57fA4A97673](https://etherscan.io/address/0xCDb681AF33C60f4D659d12E309b6C57fA4A97673)         |
| &nbsp;  | rocketDepositPool                     | [0xDD3f50F8A6CafbE9b31a427582963f465E745AF8](https://etherscan.io/address/0xDD3f50F8A6CafbE9b31a427582963f465E745AF8)         |
| &nbsp;  | rocketMerkleDistributorMainnet        | [0x7EcCBbd05830EdF593d30005B8F69E965AF4D59f](https://etherscan.io/address/0x7EcCBbd05830EdF593d30005B8F69E965AF4D59f)         |
| &nbsp;  | rocketMinipoolBase                    | [0x560656C8947564363497E9C78A8BDEff8d3EFF33](https://etherscan.io/address/0x560656C8947564363497E9C78A8BDEff8d3EFF33)         |
| &nbsp;  | rocketMinipoolBondReducer             | [0xf7aB34C74c02407ed653Ac9128731947187575C0](https://etherscan.io/address/0xf7aB34C74c02407ed653Ac9128731947187575C0)         |
| &nbsp;  | rocketMinipoolDelegate                | [0xA347C391bc8f740CAbA37672157c8aAcD08Ac567](https://etherscan.io/address/0xA347C391bc8f740CAbA37672157c8aAcD08Ac567)         |
| &nbsp;  | rocketMinipoolFactory                 | [0x7B8c48256CaF462670f84c7e849cab216922B8D3](https://etherscan.io/address/0x7B8c48256CaF462670f84c7e849cab216922B8D3)         |
| &nbsp;  | rocketMinipoolManager                 | [0x6d010C43d4e96D74C422f2e27370AF48711B49bF](https://etherscan.io/address/0x6d010C43d4e96D74C422f2e27370AF48711B49bF)         |
| &nbsp;  | rocketMinipoolPenalty                 | [0xE64AC47b6e2FEcfCDEA35147Fe61af9894A06ba6](https://etherscan.io/address/0xE64AC47b6e2FEcfCDEA35147Fe61af9894A06ba6)         |
| &nbsp;  | rocketMinipoolQueue                   | [0x9e966733e3E9BFA56aF95f762921859417cF6FaA](https://etherscan.io/address/0x9e966733e3E9BFA56aF95f762921859417cF6FaA)         |
| &nbsp;  | rocketMinipoolStatus                  | [0xa52451b9d25EEf02BE42B3A8161A18f947F8A6a5](https://etherscan.io/address/0xa52451b9d25EEf02BE42B3A8161A18f947F8A6a5)         |
| &nbsp;  | rocketNetworkBalances                 | [0x07FCaBCbe4ff0d80c2b1eb42855C0131b6cba2F4](https://etherscan.io/address/0x07FCaBCbe4ff0d80c2b1eb42855C0131b6cba2F4)         |
| &nbsp;  | rocketNetworkFees                     | [0xf824e2d69dc7e7c073162C2bdE87dA4746d27a0f](https://etherscan.io/address/0xf824e2d69dc7e7c073162C2bdE87dA4746d27a0f)         |
| &nbsp;  | rocketNetworkPenalties                | [0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8](https://etherscan.io/address/0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8)         |
| &nbsp;  | rocketNetworkPrices                   | [0x751826b107672360b764327631cC5764515fFC37](https://etherscan.io/address/0x751826b107672360b764327631cC5764515fFC37)         |
| &nbsp;  | rocketNodeDeposit                     | [0x2FB42FfE2d7dF8381853e96304300c6a5E846905](https://etherscan.io/address/0x2FB42FfE2d7dF8381853e96304300c6a5E846905)         |
| &nbsp;  | rocketNodeDistributorDelegate         | [0x32778D6bf5b93B89177D328556EeeB35c09f472b](https://etherscan.io/address/0x32778D6bf5b93B89177D328556EeeB35c09f472b)         |
| &nbsp;  | rocketNodeDistributorFactory          | [0xe228017f77B3E0785e794e4c0a8A6b935bB4037C](https://etherscan.io/address/0xe228017f77B3E0785e794e4c0a8A6b935bB4037C)         |
| &nbsp;  | rocketNodeManager                     | [0x89F478E6Cc24f052103628f36598D4C14Da3D287](https://etherscan.io/address/0x89F478E6Cc24f052103628f36598D4C14Da3D287)         |
| &nbsp;  | rocketNodeStaking                     | [0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec](https://etherscan.io/address/0x0d8D8f8541B12A0e1194B7CC4b6D954b90AB82ec)         |
| &nbsp;  | rocketRewardsPool                     | [0xA805d68b61956BC92d556F2bE6d18747adAeEe82](https://etherscan.io/address/0xA805d68b61956BC92d556F2bE6d18747adAeEe82)         |
| &nbsp;  | rocketSmoothingPool                   | [0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7](https://etherscan.io/address/0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7)         |
| &nbsp;  | rocketStorage                         | [0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46](https://etherscan.io/address/0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46)         |
| &nbsp;  | rocketTokenRETH                       | [0xae78736Cd615f374D3085123A210448E74Fc6393](https://etherscan.io/address/0xae78736Cd615f374D3085123A210448E74Fc6393)         |
| &nbsp;  | rocketTokenRPL                        | [0xD33526068D116cE69F19A9ee46F0bd304F21A51f](https://etherscan.io/address/0xD33526068D116cE69F19A9ee46F0bd304F21A51f)         |
| &nbsp;  | rocketUpgradeOneDotOne                | [0xC680a22b4F03977f69b51A09f3Dbe922eb77C8FE](https://etherscan.io/address/0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe)         |
| &nbsp;  | rocketUpgradeOneDotTwo                | [0x9a0b5d3101d111EA0edD573d45ef2208CC97984a](https://etherscan.io/address/0x9a0b5d3101d111EA0edD573d45ef2208CC97984a)         |
| &nbsp;  | rocketVault                           | [0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6](https://etherscan.io/address/0x3bDC69C4E5e13E52A65f5583c23EFB9636b469d6)         |
| Holesky\* | addressQueueStorage                   | [0x0d8d8f8541b12a0e1194b7cc4b6d954b90ab82ec](https://holesky.etherscan.io/address/0x0d8d8f8541b12a0e1194b7cc4b6d954b90ab82ec) |
| &nbsp;  | addressSetStorage                     | [0x32778d6bf5b93b89177d328556eeeb35c09f472b](https://holesky.etherscan.io/address/0x32778d6bf5b93b89177d328556eeeb35c09f472b) |
| &nbsp;  | rocketAuctionManager                  | [0x84d11b65e026f7aa08f5497dd3593fb083410b71](https://holesky.etherscan.io/address/0x84d11b65e026f7aa08f5497dd3593fb083410b71) |
| &nbsp;  | rocketClaimDAO                        | [0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe](https://holesky.etherscan.io/address/0xc680a22b4f03977f69b51a09f3dbe922eb77c8fe) |
| &nbsp;  | rocketDAONodeTrusted                  | [0x56cd23baaf2e7cb7056968d85e5efe343b0e1dc2](https://holesky.etherscan.io/address/0x56cd23baaf2e7cb7056968d85e5efe343b0e1dc2) |
| &nbsp;  | rocketDAONodeTrustedActions           | [0xa0f327589b08ceb824c21cde8ead5a3e6ca9edf7](https://holesky.etherscan.io/address/0xa0f327589b08ceb824c21cde8ead5a3e6ca9edf7) |
| &nbsp;  | rocketDAONodeTrustedProposals         | [0x2d3142a05bdd16a3223b585a7a48132867da6480](https://holesky.etherscan.io/address/0x2d3142a05bdd16a3223b585a7a48132867da6480) |
| &nbsp;  | rocketDAONodeTrustedSettingsMembers   | [0x5c2d33a015d132d4f590f00df807bb1052531ab9](https://holesky.etherscan.io/address/0x5c2d33a015d132d4f590f00df807bb1052531ab9) |
| &nbsp;  | rocketDAONodeTrustedSettingsMinipool  | [0x5ffe8bd3165e80d51ce834b32a6b6c02233494bf](https://holesky.etherscan.io/address/0x5ffe8bd3165e80d51ce834b32a6b6c02233494bf) |
| &nbsp;  | rocketDAONodeTrustedSettingsProposals | [0xe4c3ec6a20be31296032f968ceadee9e9aa76535](https://holesky.etherscan.io/address/0xe4c3ec6a20be31296032f968ceadee9e9aa76535) |
| &nbsp;  | rocketDAONodeTrustedSettingsRewards   | [0x2fb42ffe2d7df8381853e96304300c6a5e846905](https://holesky.etherscan.io/address/0x2fb42ffe2d7df8381853e96304300c6a5e846905) |
| &nbsp;  | rocketDAONodeTrustedUpgrade           | [0x4640b8610f3efdeb8d44834adb3228d0e79eaa09](https://holesky.etherscan.io/address/0x4640b8610f3efdeb8d44834adb3228d0e79eaa09) |
| &nbsp;  | rocketDAOProposal                     | [0xeffb0c7350f1293a997112b3c2594cdc34b36f18](https://holesky.etherscan.io/address/0xeffb0c7350f1293a997112b3c2594cdc34b36f18) |
| &nbsp;  | rocketDAOProtocol                     | [0xbd1e62aebfa1e60797484916685e2b9e62adbf7b](https://holesky.etherscan.io/address/0xbd1e62aebfa1e60797484916685e2b9e62adbf7b) |
| &nbsp;  | rocketDAOProtocolActions              | [0x1aa4544ce0fd51596b6d51d0f55a40e409b8bad4](https://holesky.etherscan.io/address/0x1aa4544ce0fd51596b6d51d0f55a40e409b8bad4) |
| &nbsp;  | rocketDAOProtocolProposals            | [0x762e79b27fee0c0975f9cabea9e9976006a7ad98](https://holesky.etherscan.io/address/0x762e79b27fee0c0975f9cabea9e9976006a7ad98) |
| &nbsp;  | rocketDAOProtocolSettingsAuction      | [0xd9d9202661de12aaaa478a704ea319b3f24ae711](https://holesky.etherscan.io/address/0xd9d9202661de12aaaa478a704ea319b3f24ae711) |
| &nbsp;  | rocketDAOProtocolSettingsDeposit      | [0x47b600d9127a473e45b693a7badd9f4d929d5b76](https://holesky.etherscan.io/address/0x47b600d9127a473e45b693a7badd9f4d929d5b76) |
| &nbsp;  | rocketDAOProtocolSettingsInflation    | [0xb1029ac2be4e08516697093e2afec435057f3511](https://holesky.etherscan.io/address/0xb1029ac2be4e08516697093e2afec435057f3511) |
| &nbsp;  | rocketDAOProtocolSettingsMinipool     | [0x83b7bea05c2aa38b659847ab21f4039277b8a0b9](https://holesky.etherscan.io/address/0x83b7bea05c2aa38b659847ab21f4039277b8a0b9) |
| &nbsp;  | rocketDAOProtocolSettingsNetwork      | [0x05330300f829ad3fc8f33838bc88cfc4093bad53](https://holesky.etherscan.io/address/0x05330300f829ad3fc8f33838bc88cfc4093bad53) |
| &nbsp;  | rocketDAOProtocolSettingsNode         | [0x710e405b60e5dd6c96cfe926f490c5ede17d1ecc](https://holesky.etherscan.io/address/0x710e405b60e5dd6c96cfe926f490c5ede17d1ecc) |
| &nbsp;  | rocketDAOProtocolSettingsRewards      | [0x614a5be866a0ec908ca9ae0d7d3eb100492a9f4e](https://holesky.etherscan.io/address/0x614a5be866a0ec908ca9ae0d7d3eb100492a9f4e) |
| &nbsp;  | rocketDepositPool                     | [0x320f3aab9405e38b955178bbe75c477decba0c27](https://holesky.etherscan.io/address/0x320f3aab9405e38b955178bbe75c477decba0c27) |
| &nbsp;  | rocketMerkleDistributorMainnet        | [0xfd33e53d0400f52c486b6d1484f1827ad2341405](https://holesky.etherscan.io/address/0xfd33e53d0400f52c486b6d1484f1827ad2341405) |
| &nbsp;  | rocketMinipoolBase                    | [0xac2245be4c2c1e9752499bcd34861b761d62fc27](https://holesky.etherscan.io/address/0xac2245be4c2c1e9752499bcd34861b761d62fc27) |
| &nbsp;  | rocketMinipoolBondReducer             | [0x6d010c43d4e96d74c422f2e27370af48711b49bf](https://holesky.etherscan.io/address/0x6d010c43d4e96d74c422f2e27370af48711b49bf) |
| &nbsp;  | rocketMinipoolDelegate                | [0xddb6e648d6cbeab31a34a21ca5229db3ff16c9b6](https://holesky.etherscan.io/address/0xddb6e648d6cbeab31a34a21ca5229db3ff16c9b6) |
| &nbsp;  | rocketMinipoolFactory                 | [0xdd3f50f8a6cafbe9b31a427582963f465e745af8](https://holesky.etherscan.io/address/0xdd3f50f8a6cafbe9b31a427582963f465e745af8) |
| &nbsp;  | rocketMinipoolManager                 | [0xe228017f77b3e0785e794e4c0a8a6b935bb4037c](https://holesky.etherscan.io/address/0xe228017f77b3e0785e794e4c0a8a6b935bb4037c) |
| &nbsp;  | rocketMinipoolPenalty                 | [0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788](https://holesky.etherscan.io/address/0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788) |
| &nbsp;  | rocketMinipoolQueue                   | [0x4220eecd69b2e1e70a7001637cc3d839ee2e97f5](https://holesky.etherscan.io/address/0x4220eecd69b2e1e70a7001637cc3d839ee2e97f5) |
| &nbsp;  | rocketMinipoolStatus                  | [0x0000000000000000000000000000000000000000](https://holesky.etherscan.io/address/0x0000000000000000000000000000000000000000) |
| &nbsp;  | rocketNetworkBalances                 | [0x9294fc6f03c64cc217f5be8697ea3ed2de77e2f8](https://holesky.etherscan.io/address/0x9294fc6f03c64cc217f5be8697ea3ed2de77e2f8) |
| &nbsp;  | rocketNetworkFees                     | [0x2cac916b2a963bf162f076c0a8a4a8200bcfbfb4](https://holesky.etherscan.io/address/0x2cac916b2a963bf162f076c0a8a4a8200bcfbfb4) |
| &nbsp;  | rocketNetworkPenalties                | [0xcc82c913b9f3a207b332d216b101970e39e59db3](https://holesky.etherscan.io/address/0xcc82c913b9f3a207b332d216b101970e39e59db3) |
| &nbsp;  | rocketNetworkPrices                   | [0x029d946f28f93399a5b0d09c879fc8c94e596aeb](https://holesky.etherscan.io/address/0x029d946f28f93399a5b0d09c879fc8c94e596aeb) |
| &nbsp;  | rocketNodeDeposit                     | [0x8e7dce7c58c13230041f6f51ca017c6cc232e938](https://holesky.etherscan.io/address/0x8e7dce7c58c13230041f6f51ca017c6cc232e938) |
| &nbsp;  | rocketNodeDistributorDelegate         | [0x9e966733e3e9bfa56af95f762921859417cf6faa](https://holesky.etherscan.io/address/0x9e966733e3e9bfa56af95f762921859417cf6faa) |
| &nbsp;  | rocketNodeDistributorFactory          | [0x42d4e4b59220da435a0bd6b5892b90ff50e1d8d4](https://holesky.etherscan.io/address/0x42d4e4b59220da435a0bd6b5892b90ff50e1d8d4) |
| &nbsp;  | rocketNodeManager                     | [0x1d174fb276ed27451097b5a31d3dc1f316491c0b](https://holesky.etherscan.io/address/0x1d174fb276ed27451097b5a31d3dc1f316491c0b) |
| &nbsp;  | rocketNodeStaking                     | [0xbacb8241421b83d8724cd57c0df0056c13cffdaa](https://holesky.etherscan.io/address/0xbacb8241421b83d8724cd57c0df0056c13cffdaa) |
| &nbsp;  | rocketRewardsPool                     | [0x4a625c617a44e60f74e3fe3bf6d6333b63766e91](https://holesky.etherscan.io/address/0x4a625c617a44e60f74e3fe3bf6d6333b63766e91) |
| &nbsp;  | rocketSmoothingPool                   | [0xa347c391bc8f740caba37672157c8aacd08ac567](https://holesky.etherscan.io/address/0xa347c391bc8f740caba37672157c8aacd08ac567) |
| &nbsp;  | rocketStorage                         | [0x594fb75d3dc2dfa0150ad03f99f97817747dd4e1](https://holesky.etherscan.io/address/0x594fb75d3dc2dfa0150ad03f99f97817747dd4e1) |
| &nbsp;  | rocketTokenRETH                       | [0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1](https://holesky.etherscan.io/address/0x7322c24752f79c05ffd1e2a6fcb97020c1c264f1) |
| &nbsp;  | rocketTokenRPL                        | [0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0](https://holesky.etherscan.io/address/0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0) |
| &nbsp;  | rocketUpgradeOneDotTwo                | [0x0000000000000000000000000000000000000000](https://holesky.etherscan.io/address/0x0000000000000000000000000000000000000000) |
| &nbsp;  | rocketVault                           | [0x67cde7af920682a29fcfea1a179ef0f30f48df3e](https://holesky.etherscan.io/address/0x67cde7af920682a29fcfea1a179ef0f30f48df3e) |
| Goerli | addressQueueStorage                   | [0xF7d23f90c96D998e3E809acD923F856B5b337879](https://goerli.etherscan.io/address/0xF7d23f90c96D998e3E809acD923F856B5b337879)  |
| &nbsp; | addressSetStorage                     | [0x102A9E8a1ca531468378e03eEF9D7773F4630Df3](https://goerli.etherscan.io/address/0x102A9E8a1ca531468378e03eEF9D7773F4630Df3)  |
| &nbsp; | rocketAuctionManager                  | [0x46CB66F1f680B4bb0c94404baB387769E96B240f](https://goerli.etherscan.io/address/0x46CB66F1f680B4bb0c94404baB387769E96B240f)  |
| &nbsp; | rocketClaimDAO                        | [0x4a625C617a44E60F74E3fe3bf6d6333b63766e91](https://goerli.etherscan.io/address/0x4a625C617a44E60F74E3fe3bf6d6333b63766e91)  |
| &nbsp; | rocketDAONodeTrusted                  | [0x8486d86481CCda0Bc3A148361Fd1E1582b0c30c7](https://goerli.etherscan.io/address/0x8486d86481CCda0Bc3A148361Fd1E1582b0c30c7)  |
| &nbsp; | rocketDAONodeTrustedActions           | [0x029d946F28F93399a5b0D09c879FC8c94E596AEb](https://goerli.etherscan.io/address/0x029d946F28F93399a5b0D09c879FC8c94E596AEb)  |
| &nbsp; | rocketDAONodeTrustedProposals         | [0xda28CAc28D61d337073A5C1B12cF2e159Cf0aeDc](https://goerli.etherscan.io/address/0xda28CAc28D61d337073A5C1B12cF2e159Cf0aeDc)  |
| &nbsp; | rocketDAONodeTrustedSettingsMembers   | [0x401e2207c117bCed8a47864ac3e45335eDA23dA3](https://goerli.etherscan.io/address/0x401e2207c117bCed8a47864ac3e45335eDA23dA3)  |
| &nbsp; | rocketDAONodeTrustedSettingsMinipool  | [0xC0e092d042cB205164C10C182Ba91309cCd4db02](https://goerli.etherscan.io/address/0xC0e092d042cB205164C10C182Ba91309cCd4db02)  |
| &nbsp; | rocketDAONodeTrustedSettingsProposals | [0x4D65276777a25300A7e533a635B6dc3ece9553FB](https://goerli.etherscan.io/address/0x4D65276777a25300A7e533a635B6dc3ece9553FB)  |
| &nbsp; | rocketDAONodeTrustedSettingsRewards   | [0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1](https://goerli.etherscan.io/address/0x7322c24752f79c05FFD1E2a6FCB97020C1C264F1)  |
| &nbsp; | rocketDAONodeTrustedUpgrade           | [0xE2247Aa78ce01b3fD43B0a1fd2cf37E7162192Fd](https://goerli.etherscan.io/address/0xE2247Aa78ce01b3fD43B0a1fd2cf37E7162192Fd)  |
| &nbsp; | rocketDAOProposal                     | [0x9c14ef142fE1D5Ae01FF5d69309b736cF397BE04](https://goerli.etherscan.io/address/0x9c14ef142fE1D5Ae01FF5d69309b736cF397BE04)  |
| &nbsp; | rocketDAOProtocol                     | [0x9C8484cbADa71318FEeBd74Cc68DC10DF7594e04](https://goerli.etherscan.io/address/0x9C8484cbADa71318FEeBd74Cc68DC10DF7594e04)  |
| &nbsp; | rocketDAOProtocolActions              | [0x865738b84455167c18Cb68854B38ECC93272ca6E](https://goerli.etherscan.io/address/0x865738b84455167c18Cb68854B38ECC93272ca6E)  |
| &nbsp; | rocketDAOProtocolProposals            | [0x01f5C4Dc5709824525102f708AafE7c6C4C3c39c](https://goerli.etherscan.io/address/0x01f5C4Dc5709824525102f708AafE7c6C4C3c39c)  |
| &nbsp; | rocketDAOProtocolSettingsAuction      | [0x6C96D0e5267E756c4DF28DD75f227200F6720A34](https://goerli.etherscan.io/address/0x6C96D0e5267E756c4DF28DD75f227200F6720A34)  |
| &nbsp; | rocketDAOProtocolSettingsDeposit      | [0xcB48514A11c642d34677C6dD1F9CF12bf5aeDcb5](https://goerli.etherscan.io/address/0xcB48514A11c642d34677C6dD1F9CF12bf5aeDcb5)  |
| &nbsp; | rocketDAOProtocolSettingsInflation    | [0x44c33430b6a46dc176F6CFa3B25B9d852aF4C626](https://goerli.etherscan.io/address/0x44c33430b6a46dc176F6CFa3B25B9d852aF4C626)  |
| &nbsp; | rocketDAOProtocolSettingsMinipool     | [0xb3fa2e86064A89ABDb011C3c81C574f78059549a](https://goerli.etherscan.io/address/0xb3fa2e86064A89ABDb011C3c81C574f78059549a)  |
| &nbsp; | rocketDAOProtocolSettingsNetwork      | [0x320f3aAB9405e38b955178BBe75c477dECBA0C27](https://goerli.etherscan.io/address/0x320f3aAB9405e38b955178BBe75c477dECBA0C27)  |
| &nbsp; | rocketDAOProtocolSettingsNode         | [0x5D762bE86F582cfDe63359b2978E79f60223f504](https://goerli.etherscan.io/address/0x5D762bE86F582cfDe63359b2978E79f60223f504)  |
| &nbsp; | rocketDAOProtocolSettingsRewards      | [0x0CB29674078F0Ad3dD23f8DD29c5481EE011e1D9](https://goerli.etherscan.io/address/0x0CB29674078F0Ad3dD23f8DD29c5481EE011e1D9)  |
| &nbsp; | rocketDepositPool                     | [0xa9A6A14A3643690D0286574976F45abBDAD8f505](https://goerli.etherscan.io/address/0xa9A6A14A3643690D0286574976F45abBDAD8f505)  |
| &nbsp; | rocketMerkleDistributorMainnet        | [0x7EcCBbd05830EdF593d30005B8F69E965AF4D59f](https://goerli.etherscan.io/address/0x7EcCBbd05830EdF593d30005B8F69E965AF4D59f)  |
| &nbsp; | rocketMinipoolBase                    | [0xcbD9243c9e284DFd65928617c821F411741AdE12](https://goerli.etherscan.io/address/0xcbD9243c9e284DFd65928617c821F411741AdE12)  |
| &nbsp; | rocketMinipoolBondReducer             | [0x68802A05C4a0AFB0EB943271Bb984cdD6257f7ad](https://goerli.etherscan.io/address/0x68802A05C4a0AFB0EB943271Bb984cdD6257f7ad)  |
| &nbsp; | rocketMinipoolDelegate                | [0xba6A1F8E1af8B3Ee43bb8d4e10DC1F6e2970613d](https://goerli.etherscan.io/address/0xba6A1F8E1af8B3Ee43bb8d4e10DC1F6e2970613d)  |
| &nbsp; | rocketMinipoolFactory                 | [0x02D96593696BB46F3Cb042A767C07B213bDF7eF5](https://goerli.etherscan.io/address/0x02D96593696BB46F3Cb042A767C07B213bDF7eF5)  |
| &nbsp; | rocketMinipoolManager                 | [0xbA3baaC020F05c074bd29e9a69aE2EA2E73787b0](https://goerli.etherscan.io/address/0xbA3baaC020F05c074bd29e9a69aE2EA2E73787b0)  |
| &nbsp; | rocketMinipoolPenalty                 | [0x0f666CfA664547DC03043829130293F422c1682D](https://goerli.etherscan.io/address/0x0f666CfA664547DC03043829130293F422c1682D)  |
| &nbsp; | rocketMinipoolQueue                   | [0xCDe694Cf7b13BA65bA664d63ED674e740c8323f3](https://goerli.etherscan.io/address/0xCDe694Cf7b13BA65bA664d63ED674e740c8323f3)  |
| &nbsp; | rocketMinipoolStatus                  | [0x024B38eC4173FFd485876F11dF408310120Cab69](https://goerli.etherscan.io/address/0x024B38eC4173FFd485876F11dF408310120Cab69)  |
| &nbsp; | rocketNetworkBalances                 | [0xF8Ae16d9F6C0f5545911E19C4C1A5593Bb87340E](https://goerli.etherscan.io/address/0xF8Ae16d9F6C0f5545911E19C4C1A5593Bb87340E)  |
| &nbsp; | rocketNetworkFees                     | [0x3091787188e3eB8e379dE5f5395bC955393233A1](https://goerli.etherscan.io/address/0x3091787188e3eB8e379dE5f5395bC955393233A1)  |
| &nbsp; | rocketNetworkPenalties                | [0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8](https://goerli.etherscan.io/address/0x9294Fc6F03c64Cc217f5BE8697EA3Ed2De77e2F8)  |
| &nbsp; | rocketNetworkPrices                   | [0x003C2133a9cfe824d94Cc30705A20aDCb4583Ed8](https://goerli.etherscan.io/address/0x003C2133a9cfe824d94Cc30705A20aDCb4583Ed8)  |
| &nbsp; | rocketNodeDeposit                     | [0x1473a10Fc1af0C0ceD52180aC80B26ee83c79cE4](https://goerli.etherscan.io/address/0x1473a10Fc1af0C0ceD52180aC80B26ee83c79cE4)  |
| &nbsp; | rocketNodeDistributorDelegate         | [0xB72d0388b8a4b87095D234Aa982071F39f2Aa852](https://goerli.etherscan.io/address/0xB72d0388b8a4b87095D234Aa982071F39f2Aa852)  |
| &nbsp; | rocketNodeDistributorFactory          | [0xe228017f77B3E0785e794e4c0a8A6b935bB4037C](https://goerli.etherscan.io/address/0xe228017f77B3E0785e794e4c0a8A6b935bB4037C)  |
| &nbsp; | rocketNodeManager                     | [0x0493A9c109Abac41e8Cb89D818B6825DA51a1274](https://goerli.etherscan.io/address/0x0493A9c109Abac41e8Cb89D818B6825DA51a1274)  |
| &nbsp; | rocketNodeStaking                     | [0x8D89A4F721BfBD363Eed4d42A607069d6C2023D1](https://goerli.etherscan.io/address/0x8D89A4F721BfBD363Eed4d42A607069d6C2023D1)  |
| &nbsp; | rocketRewardsPool                     | [0x3d8acD619fF0Eb890FbA744B20288a99452dd4B8](https://goerli.etherscan.io/address/0x3d8acD619fF0Eb890FbA744B20288a99452dd4B8)  |
| &nbsp; | rocketSmoothingPool                   | [0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7](https://goerli.etherscan.io/address/0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7)  |
| &nbsp; | rocketStorage                         | [0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3](https://goerli.etherscan.io/address/0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3)  |
| &nbsp; | rocketTokenRETH                       | [0x178E141a0E3b34152f73Ff610437A7bf9B83267A](https://goerli.etherscan.io/address/0x178E141a0E3b34152f73Ff610437A7bf9B83267A)  |
| &nbsp; | rocketTokenRPL                        | [0x5e932688E81a182e3dE211dB6544F98b8e4f89C7](https://goerli.etherscan.io/address/0x5e932688E81a182e3dE211dB6544F98b8e4f89C7)  |
| &nbsp; | rocketUpgradeOneDotOne                | [0xC680a22b4F03977f69b51A09f3Dbe922eb77C8FE](https://goerli.etherscan.io/address/0xC680a22b4F03977f69b51A09f3Dbe922eb77C8FE)  |
| &nbsp; | rocketUpgradeOneDotTwo                | [0xdBe62d3d56BE50eCf5D022178C5C6b2D9805E1aF](https://goerli.etherscan.io/address/0xdBe62d3d56BE50eCf5D022178C5C6b2D9805E1aF)  |
| &nbsp; | rocketVault                           | [0xD2B9d26f5f17856658f87600409e7F59FE0bcc00](https://goerli.etherscan.io/address/0xD2B9d26f5f17856658f87600409e7F59FE0bcc00)  |

<small>\* Testnet</small>

This list was updated 10/12/2023

The addresses can be queried on chain as shown in this [example](https://docs.rocketpool.net/developers/usage/contracts/contracts.html#interacting-with-rocket-pool).
