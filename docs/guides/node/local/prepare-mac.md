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

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

It should install some pre-requisites for you, such as XCode Command Line Tools. If it doesn't, you can install them manually using

```shell
xcode-select --install
```

Once installed, ensure everything is working correctly by using

```shell
brew doctor
```

Once everything is installed & working, Homebrew will allow you to install packages using the `brew` command.

For example, to install `wget` using Homebrew execute the following command in the Terminal:

```shell
brew install wget
```

Now that we have Homebrew installed, we can install our Docker client, [Orbstack](https://orbstack.dev).

```shell
brew install --cask orbstack
```

Orbstack will be installed to your Applications folder. Launch it from there and it will initialise. If you are migrating from Docker Desktop, it should detect your existing Docker installation and migrate your images and containers.

You may need to adjust your Orbstack settings depending on your hardware.

If you have previously installed Docker Desktop, you will need to uninstall it first. Docker Desktop used to be the recommended Docker Client however in the last year a few new clients have been released that provide much better stability.

Please ensure your Firewall (System Settings -> Network -> Firewall) is turned on and Orbstack is added to the list of applications allowing incoming connections. (Orbstack should do this for you)

![](../local/images/mac/firewall.png)

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
- If your ISP caps your data, it is more than 2 TB per month.

If you have checked and confirmed all of these items, then you are ready to install Rocket Pool and begin running a node!
Move on to the [Choosing your ETH Clients](../eth-clients) section.
