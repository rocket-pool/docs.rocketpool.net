# DRAFT 
this page will probably be moved to here: http://localhost:5173/guides/node/provisioning/overview before testnet goes live 

TODO: 

add a section in: http://localhost:5173/guides/staking/overview for staking on behalf of a Node 

# Stake ETH on behalf of node 

RPIP-32 allows an account to [stake ETH on behalf](https://rpips.rocketpool.net/RPIPs/RPIP-32) of a Rocket Pool node that is registered in the protocol. This supports a variety of situations where the node operator is not directly providing the ETH:

- Enhanced security for node operators, as they can stake directly from their hardware wallet, eliminating the need to transfer funds to the node beforehand.
- Staking as a Service providers where custody of funds are managed by a trusted custodian.
- Protocol integrations where custody of funds are managed by smart contracts.
- DAOs or organisations where custody of funds are managed by a treasury.

While the primary aim of this feature is to facilitate single depositor scenarios, it’s worth noting that multiple independent depositors can also leverage this capability by creating smart contracts layered on top. Rocket Pool also introduced the ability to stake RPL on behalf of back in our previous Atlas release.

