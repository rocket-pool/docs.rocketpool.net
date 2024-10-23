# Selecting a Hosting Provider

If you've arrived at this section, then you would like to run a Rocket Pool node but can't set one up locally at your home; you require a **virtual private server (VPS)** hosted on the cloud.
There are several different services available that can provide such a machine, and they come in two different flavors: VPS providers and public cloud providers.

Choosing the correct one can be difficult, and understanding the differences between them is key.
In this guide, we'll shine some light onto the distinction and list a few of the services that other Rocket Pool users have leveraged in the past to help you navigate through your options.

## Traditional VPS Hosting

A virtual private server is a single instance of a virtual machine that resides on a larger physical machine.
They are the cheapest option, and they are less-frequently employed than the ubiquitous cloud platforms so they tend to contribute more towards the Ethereum network's decentralization.

However, they rarely have high-availability support; if the physical server goes down, it's likely that your VPS hosted on it will go down as well.
Also, they have a fixed resource footprint; it's usually not possible to increase or decrease resources like CPU and RAM on demand. 

As of 10/2024, one well-priced and performant option was the RS 12000 G11 from [Netcup](https://www.netcup.eu/vserver/vps.php).
One word of warning is that storage is shared with others, so storage IOPs are a potential bottleneck.

## Dedicated Server Hosting

Unlike a VPS, a dedicated server is an entire physical device that is rented by you. They are a relatively affordable option, and they are less-frequently employed than the ubiquitous cloud platforms so they tend to contribute more towards the Ethereum network's decentralization.

As of 10/2024 two well-priced and performant options were the Rise and Advanced bare-metal servers from [OVH](https://us.ovhcloud.com/). There are a variety of these that change over time, as well as significant sales. You'll need to check that the [hardware guidelines](../local/hardware.md) are met.


## Cloud Hosting

Cloud hosting refers to virtual machines that are split across on a distributed network of multiple servers, rather than being hosted on a single physical machine.
If one of the hosting machines fails, the others can seamlessly take over for it so availability and reliability tend to be extremely high on these platforms.
They also tend to offer flexible resource options; it's relatively simple to add more CPU, RAM, or disk space on demand.

Due to these extra benefits, cloud-based servers tend to be more expensive than VPS solutions.
They're also very popular platforms, so using them generally reduces the overall decentralization of the Ethereum network.

The 3 primary cloud providers are [Amazon Web Services (AWS)](https://aws.amazon.com/), [Microsoft Azure](https://azure.microsoft.com/en-us/), and [Google Cloud Platform (GCP)](https://cloud.google.com/).
We do not recommend using cloud hosting due to price and centralization concerns.

## Key Considerations

### Price

Cloud hosting solutions are usually a safer choice if cost is not a priority.
The section below has a more detailed breakdown of cost estimates but here is a general comparison between a VPS option and a cloud option:

- OVH Dedicated Server: $90-160/mo
- Netcup VPS: $90/mo
