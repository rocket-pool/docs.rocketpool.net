<p align="center">
  <img src="https://raw.githubusercontent.com/rocket-pool/rocketpool/master/images/logo.png?raw=true" alt="Rocket Pool - Decentralised Ethereum Staking Protocol" />
</p>

# docs.rocketpool.net

Rocket Pool Documentation Hub - Features Guides, FAQs, API Reference and more. It is written in [Vitepress](https://vitepress.dev/guide/what-is-vitepress).

We welcome all contributions! Please refer to our [contribution guidelines](./contributing.md).

## Prerequisites

- Bun

Bun can be installed via:

```
curl -fsSL https://bun.sh/install | bash 
```

Just (rust based task runner) can be installed via:

```
brew/apt-get install just
```

See the Justfile for available commands.

## Local Testing

If you want to test this locally, follow the next few steps:

- Clone this repo eg: `git clone git@github.com:rocket-pool/docs.rocketpool.net.git`
- Move into the directory: `cd docs.rocketpool.net`
- Install dependencies using: `bun install` or `yarn install`
- Run the dev server which will create the site and update automatically when you make changes: `yarn dev` or `bun run dev`
- Go to `http://localhost:5173/` in your browser to view the site.
- Ensure that `bun run build` doesn't have any errors or dead links before creating a pull request

## Project Structure

Files under `docs/.vitepress` include components, style and configs.

To add new pages and have them appear in the side menu, add the links to the `sidebar` property in the `docs/.vitepress/config.ts` file for them to appear.
