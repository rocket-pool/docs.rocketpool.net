<picture>
  <img alt="Rocket Pool - Decentralised Ethereum Staking Protocol" src="https://raw.githubusercontent.com/rocket-pool/.github/main/assets/logo.svg" width="auto" height="120">
</picture>

# docs.rocketpool.net

Rocket Pool Documentation Hub - Features Guides, FAQs, API Reference and more. It is written in [Rspress](https://rspress.dev/).

We welcome all contributions! Please refer to our [contribution guidelines](./contributing.md).

## Using the nix flake

- Install Nix

```
curl -L https://nixos.org/nix/install | sh && mkdir -p ~/.config/nix && echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
```

Then start the environment

```
nix develop
```

Your environment should be setup & the server should be started so you can make changes easily.

See the Justfile for available commands.

## Project Structure

To add new pages and have them appear in the side menu, add the links to the `sidebar` property in the `rspress.config.ts` file for them to appear.
