# Preparing a Mac

Before installing Rocket Pool, there are a few checks you should do to make sure your system is compatible and will work correctly.

::: danger
We strongly encourage you to create a dedicated machine for running a Rocket Pool node.
Running a node on a general-use machine, such as your daily work desktop, presents extra security risks that may compromise your wallet and result in the theft of your coins.

**For maximum safety, please build a new machine that is dedicated exclusively to running a node.**
:::

## System Requirements

Below is a brief description of the software and hardware requirements that a Rocket Pool node requires.
This guide assumes that you already have your machine physically built, and the operating system installed.

### Supported Operating Systems

Rocket Pool recommends you use the latest version of macOS for your hardware.

### macOS Support

You will need to install the following pre-requisites:

We highly recommend using [Homebrew](https://brew.sh) as your package manager for Mac. It allows you to install packages easily using the `brew` command.

You can install it via

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It should install some pre-requisites for you, such as XCode Command Line Tools. If it doesn't, you can install them manually using

```
xcode-select --install
```

Once installed, ensure everything is working correctly by using

```
brew doctor
```

Once everything is installed & working, Homebrew will allow you to install packages using the `brew` command.

For example, to install `wget` using Homebrew execute the following command in the Terminal:

```
brew install wget
```

Now that we have Homebrew installed, we can install our Docker client, [Orbstack](https://orbstack.dev).

```
brew install --cask orbstack
```

Orbstack will be installed to your Applications folder. Launch it from there and it will initialise. If you are migrating from Docker Desktop, it should detect your existing Docker installation and migrate your images and containers.

You may need to adjust your Orbstack settings depending on your hardware.

If you have previously installed Docker Desktop, you will need to uninstall it first. Docker Desktop used to be the recommended Docker Client however in the last year a few new clients have been released that provide much better stability.

Please ensure your Firewall (System Settings -> Network -> Firewall) is turned on and Orbstack is added to the list of applications allowing incoming connections. (Orbstack should do this for you)

![](../local/images/mac/firewall.png)

### Hardware Requirements

The hardware requirements for a node depend largely on which Execution and Consensus clients you decide to run.
As shown in [the hardware guide](./hardware), there is a wide range of possible configurations that work well.
However, for the sake of completeness, we have assembled the following hardware profiles:

#### Low-Power Full Node

- CPU: Quad-core 1.6+ GHz Intel, Apple M Series (M1, M2, M3)
- RAM: 16 GB DDR4 2400 MHz
- SSD: 2 TB, 15k Read IOPS, 5k Write IOPS\*\*
- Network: 10+ Mbps, 1.5+ TB monthly data cap
- Execution Client: Geth (in low-cache mode), Besu
- Consensus Client: Nimbus, Lighthouse, Prysm

#### Typical Full Node

- CPU: Quad-core, 2.6+ GHz Intel, Apple M Series (M1, M2, M3)
- RAM: 16 GB DDR4 3200 MHz
- SSD: 2 TB, 15k Read IOPS, 5k Write IOPS\*\*
- Network: 25+ Mbps, 1.5+ TB monthly data cap
- Execution Client: Any
- Consensus Client: Any

\*\*
The Execution blockchain [grows quickly](https://ycharts.com/indicators/ethereum_chain_full_sync_data_size), so 2 TB will offer some future-proofing.
The larger your storage, the longer you can go between needing to reclaim space by pruning

### Installing and Using SSH

SSH should already be installed with macOS.

### Pre-installation System Checks

Before installing Rocket Pool, please review the following checklist:

- Your system is fully built, powers on, and can boot into the operating system.
- You will not do any other activity on the system, such as browsing the Internet, checking email, or playing games.
- You have a macOS operating system installed.
- Your user account has root / administrator privileges.
- You have an SSD that meets the performance requirements.
- Your SSD is mounted on your file system.
- You have at least 1.5TB of space free for the initial Execution and Consensus syncing process.
- If your ISP caps your data, it is more than 1.5 TB per month.

If you have checked and confirmed all of these items, then you are ready to install Rocket Pool and begin running a node!
Move on to the [Choosing your ETH Clients](../eth-clients) section.
