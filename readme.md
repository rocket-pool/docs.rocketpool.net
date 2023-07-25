<p align="center">
  <img src="https://raw.githubusercontent.com/rocket-pool/rocketpool/master/images/logo.png?raw=true" alt="Rocket Pool - Next Generation Decentralised Ethereum Proof-of-Stake (PoS) Infrastructure Service and Pool" width="250" />
</p>

# docs.rocketpool.net

Rocket Pool Documentation Hub - Features Guides, FAQs, API Reference and more. It is written in [Vitepress](https://vitepress.dev/guide/what-is-vitepress).

We welcome all contributions! Please refer to our [contribution guidelines](./contributing.md).

## Prerequisites

- Node v20.0.0
- Pnpm 8.6.10

Strongly recommend using [asdf](https://asdf-vm.com/#/) to manage your toolchain versions.

```
asdf install nodejs 20.0.0
```

Pnpm can be installed via:

```
npm install -g pnpm
```

Just (rust based task runner) can be installed via:

```
brew/apt-get install just
```

See the Justfile for available commands.

## Local Testing

If you want to test this locally, follow the next few steps:

- Clone this repo eg: `git clone git@github.com:rocket-pool/docs.rocketpool.net.git ./rpdocs`
- Move into the directory: `cd rpdocs`
- Install dependencies using: `pnpm install` or `yarn install`
- Run the dev server which will create the site and update automatically when you make changes: `yarn dev` or `pnpm run dev`
- Go to `http://localhost:5173/` in your browser to view the site.
- Ensure that `pnpm run build` doesn't have any errors or dead links before creating a pull request

## Project Structure

Files under `docs/.vitepress` include components, style and configs.

To add new pages and have them appear in the side menu, add the links to the `sidebar` property in the `docs/.vitepress/config.js` file for them to appear.
