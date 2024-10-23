Some users (eg, Allnodes users) don't use the smartnode and may need to set up voting using direct contract interaction.
This guide contains both a minimal and a complete setup guide for such users.

::: tip
Your node address should be loaded onto a hardware wallet for this.
:::

## Minimal setup guide
This allows your delegate to vote for you on-chain and offchain. You'll be able to override your delegate on-chain, but not off-chain. 

- Use etherscan to initialize vote power ("Connect to Web3" with node address) with a delegate https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
- You can find delegates at https://delegates.rocketpool.net/

## Full setup guide
Use etherscan to initialize vote power ("Connect to Web3" with node address)
- [recommended for most] Initialize voting with a different node as the delegate https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F2
    - You can find delegates at https://delegates.rocketpool.net/
    - Remember you will always be able to override your delegates
- Initialize voting with your own node as the delegate https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F1
    - Here you'll be responsible for voting every time
    - I would mostly suggest this option for folks that wish to be delegates since they _do_ need to vote every time.
- If your node was registered after Houston:
    - You will already have your vote power initialized with your own node as the delegate
    - You can set a new delegate with https://etherscan.io/address/0xA9d27E1952f742d659143a544d3e535fFf3Eebe1#writeContract#F3

Set snapshot signalling address:
- Go to https://stake.rocketpool.net/manage/signalling-address and connect your node address
    - Put in your desired snapshot signalling address and sign the message to get the r, s, and v arguments you'll need
    - Note: your snapshot signalling address MUST NOT be your node address
- In a new tab, go to https://etherscan.io/address/0xc1062617d10Ae99E09D941b60746182A87eAB38F#writeContract#F2
    - "Connect to Web3" with node address
    - Fill in the arguments with your signalling address and the r, s, v parameters given in the previous step