---
title: Introducing BuilderNet
description: BuilderNet is a decentralized block building network for Ethereum that runs on TEEs and shares MEV with the community.
image: /img/buildernet-cover-photo.jpg
hide_table_of_contents: false
slug: introducing-buildernet
---

Introducing BuilderNet — A decentralized block building network for Ethereum that runs on TEEs and shares MEV with the community.

![Cover image](/img/buildernet-cover-photo.jpg)

<!-- truncate -->

Two parties build 90% of blocks on Ethereum today. This centralization of power and its impact on the application and protocol layer directly threatens Ethereum’s resilience and neutrality.

BuilderNet is a decentralized path forward. It aims to **neutralize exclusive orderflow deals, enhance Ethereum’s censorship resistance, and accelerate decentralization across rollups and apps.**

The first release of BuilderNet is jointly operated by [Flashbots](https://www.flashbots.net/), [Beaverbuild](https://beaverbuild.org/), and [Nethermind](https://www.nethermind.io/). To accelerate decentralization in block building, **Beaverbuild and Flashbots will integrate their centralized block builders with BuilderNet** in the coming months. In the future, BuilderNet will also be available as a drop-in solution for decentralized sequencing on L2s through [Rollup-Boost](https://writings.flashbots.net/introducing-rollup-boost).

The first release of BuilderNet is one step in a larger plan to decentralize block building across Ethereum. We’re sharing our progress and goals in the open to invite the community to join us.

## Why decentralize block building

Public blockchains like Ethereum promise to be the best global platform for finance and innovation. They provide a highly resilient ledger that can be permissionlessly updated by any user or app. In order to add new blocks to this ledger, they need a way to fairly resolve competition and optimize for complex coincidences of wants across the world. Over time it has become clear that the best way to handle this task is to outsource it to a sophisticated external party — the block builder.

**Block builders extend Ethereum with a more performant and feature-rich platform for apps.** They introduce private mempools that [improve prices in DeFi](https://0x.org/post/measuring-the-impact-of-hidden-dex-costs), offer tools to reduce transaction costs, and can be programmed off-chain to support a wide range of intents. Today these features power everything from whitehat rescues via [Flashbots](https://noteforms.com/forms/flashbots-whitehat-intake-form?notionforms=1) to gasless transactions in [Bitget](https://www.bitget.com/) wallet to revenue sharing in oracle feeds like [Oval](https://uma.xyz/oval). And they drive a [4x increase in execution layer rewards](https://ethresear.ch/t/is-it-worth-using-mev-boost/19753) for validators in [90% of Ethereum blocks](https://mevboost.pics/).

Block builders benefit the protocol as well. By handling complex tasks off-chain and making the best block freely available, they relieve the pressure for validators to perform sophisticated tasks and keep the core protocol [decentralized](https://ethcc.io/archives/a-keynote-with-vitalik-buterin) and lightweight. They also provide Ethereum with a sophisticated external market to execute its roadmap — from protecting validators from MEV, to helping rollups scale through [larger blobs](https://ethereum.org/en/roadmap/danksharding/), to supporting coprocessing, [statelessness](https://ethereum.org/en/roadmap/statelessness/), and real-time proving in the future.

But outsourcing sophisticated tasks to a separate market does not address the root issue of centralization within those roles, nor does it fully maximize the productive benefits that block builders can bring to Ethereum. We must proactively design new structures that coordinate between sophisticated off-chain actors, and effectively leverage their inherent economies of scale, to create the most robust and efficient system for advancing public blockchains. In other words, **we must decentralize block building itself.**

Decentralizing block building will make Ethereum the strongest foundation for apps like DeFi that need a neutral platform to coordinate financial activities around the world. By distributing the monolithic process of block building across a large network, we can prevent systemic [chokepoints](https://bitcoinmagazine.com/print/operation-choke-point-2-0-how-u-s-regulators-fight-bitcoin-with-financial-censorship-) that invite censorship and rent extraction from users. This in turn will make it possible for more parties around the world to coordinate instead of competing with each other, creating more emergent value that can be internalized as better prices for users, or support the apps and wallets that onboard people to crypto.

## Why now

90% of blocks on Ethereum are [built](https://www.relayscan.io/) by just two parties today. Concentration in the block building market has tripled since 2022, when Flashbots first introduced a vision to decentralize block building with [SUAVE](https://writings.flashbots.net/the-future-of-mev-is-suave). This trend has accelerated in the past year as major orderflow providers made **exclusive orderflow deals with block builders** to internalize their MEV. These opaque off-chain agreements have entrenched a duopoly in the builder market and created an unequal playing field for apps and users who do not have access to the same [preferential treatment](https://www.binance.com/en/square/post/11663492262641) — eroding the overall neutrality, censorship resistance, and resilience of Ethereum. **It is abundantly clear that the future of block building will be centralized, unless we act now.**

In anticipation of these challenges, Flashbots and collaborators have spent the past 2 years experimenting with different ways to decentralize block building — from programmable privacy (e.g. [MEV-Share](https://docs.flashbots.net/flashbots-mev-share/introduction) and [TEE searching](https://collective.flashbots.net/t/searching-in-tdx/3902)), to distributed block building (e.g. [MEVM](https://writings.flashbots.net/mevm-suave-centauri-and-beyond)), to secure hardware and cryptography (e.g. [TEE block builders](https://writings.flashbots.net/block-building-inside-sgx), [TEE relays](https://collective.flashbots.net/t/tee-boost/3741), [MPC](https://writings.flashbots.net/backrunning-private-txs-MPC) and [FHE](https://writings.flashbots.net/blind-arbitrage-fhe) backrunning). Recent improvements in the performance and application of secure hardware in MEV show that **it is now possible to implement a decentralized block builder that is sufficiently performant and secure**.

This is a unique window of opportunity. As Ethereum considers [changing the protocol to increase its censorship resistance](https://vitalik.eth.limo/general/2024/10/20/futures3.html), we believe it must also invest in decentralizing the power structures in block building that affect those properties. Addressing this challenge from both angles will complement proposer-level changes like inclusion lists and add more defense in depth.

## Introducing BuilderNet

**Today we are excited to introduce a new step in this journey to decentralize block building — BuilderNet.**

BuilderNet is a new way for many parties to collaborate in building blocks. It creates an open and neutral alternative to negative-sum orderflow games, and handles complex boilerplate activities that make it difficult and expensive to participate in block building today. This frees builders, searchers, and apps to focus on driving efficiency, finding new alpha, and innovating on user value at the edges. We believe **this will transform the block building market into a positive-sum game that opens the door to new kinds of innovation and collaboration on Ethereum.**

To advance these goals, the first release of BuilderNet introduces a “multioperator” system where many parties can operate the same block builder for the first time. Each operator runs an instance of an [open source builder](https://github.com/flashbots/rbuilder) in a Trusted Execution Environment (TEE), which orderflow providers (like apps, wallets, users, and searchers) can verify and send encrypted orderflow to. Each instance shares the orderflow it receives with other instances in the network and submits blocks to MEV-Boost relays as usual. After a BuilderNet instance wins a block, refunds are calculated and distributed back to orderflow providers based on the value they added to the block.

**A full description and technical documentation is [here](https://buildernet.github.io/docs).** The first release of BuilderNet is operated by Flashbots, Beaverbuild, and Nethermind.

![Multioperator release](/img/multioperator-release.jpg)

## BuilderNet for users, wallets, and apps

Apps and wallets want to internalize their MEV and give their users a cheap, easy way to transact. Today it is common for apps and wallets to make deals with builders or aggregators that reclaim fees on their behalf. BuilderNet can meet these needs in a way that is more transparent, permissionless, and democratic than the opaque custom orderflow deals in the market today.

To this end, the first release of BuilderNet uses an open source [refund rule](https://docs.flashbots.net/flashbots-auction/advanced/gas-fee-refunds#how-are-refunds-calculated) to compensate all users for their contribution to its blocks. In the future we intend to upgrade this rule to ensure it accommodates each use case, make all aspects of calculating and receiving refunds fully permissionless, and ensure all participants in the network (e.g. TEE operators) are appropriately compensated for their contributions as well.

→ Users, wallets, and apps can access refunds by sending transactions to [Protect](https://protect.flashbots.net/). More data is available [here](https://dune.com/flashbots/flashbots-protect).

## BuilderNet for searchers and solvers

It is impossible to land a bundle on Ethereum today without trusting a third party or running your own block builder. BuilderNet changes this. The network runs in Trusted Execution Environments (TEEs) to prevent operators from leaking data or tampering with their code. It also provides refunds to every searcher that contributes to its blocks. **Together these features create an even playing field where independent searchers can receive the same financial outcomes and privacy that integrated searcher-builders do today.**

Ultimately we believe that the most efficient block builder will be a distributed process where many specialized agents participate and coordinate off-chain. BuilderNet is designed to accelerate this future by solving the core challenges of aggregating orderflow and creating a safe platform for coordination — so that searchers, solvers, and other off-chain agents can focus on their strategies and alpha.

→ Searchers can get refunds and privacy by [sending](https://buildernet.org/docs/how-to-participate) bundles to BuilderNet today. For more, read the [FAQ](https://collective.flashbots.net/t/refund-rule-wat-dis-how-to-and-faq/4049), search your refunds in the [dashboard](https://app.hex.tech/9eb1e790-53f7-4c16-be76-4a22c1aa7d17/app/0c2d34ef-1304-481a-b3d6-b773ce9e0e19/latest), and join other experiments [here](https://collective.flashbots.net/t/searching-in-tdx/3902).

## BuilderNet for validators

Block builders do not pay the full value of their blocks to validators today. They minimize their bids to capture a profit and pay for access to exclusive orderflow — retaining close to [1,000 ETH per week](https://www.relayscan.io/builder-profit?t=7d), almost all of which is refunded to exclusive orderflow providers. Given that this value is already withheld from validators, **we do not expect that BuilderNet will significantly impact their economics at launch**.

Over time, we do expect that BuilderNet will accelerate the transition to a new equilibrium where orderflow providers retain a greater percentage of the MEV they produce. We believe that this transition towards a simpler, cheaper gas market is both inevitable and essential to making Ethereum the best place to transact. We also believe it must be handled with maximum transparency and collaboration between all affected parties — through a decentralized, open source, community builder. We intend to monitor these dynamics and will collaborate with validators to ensure BuilderNet remains fair and balanced over time.

→ Validators can read more about the current refund rule [here](https://buildernet.org/docs/refunds) and share thoughts [here](https://collective.flashbots.net/). Teams working on BuilderNet are also actively collaborating with teams working on features like preconfirmations that may be of interest to validators.

## BuilderNet for L2s

A decentralized block builder can accelerate the Ethereum roadmap in many ways — not only on L1, but also on L2s. We believe it’s essential for BuilderNet to support the needs of rollups as users and financial activity increasingly migrate to those new domains, and we’ve designed it with this goal from the start.

**Outsourcing block building to BuilderNet provides rollups with a highly available and resilient sequencer and accelerates their decentralization roadmap without major protocol changes on L1 or L2**. In doing so, rollups can offer a more fair, global platform for DeFi and other apps that require strong censorship resistance properties. BuilderNet also gives rollups a straightforward way to redistribute MEV or enforce [verifiable ordering rules](https://docs.unichain.org/whitepaper.pdf), which can improve the economics and UX of their apps.

BuilderNet launches on L1 today. In the future we’re excited to bring these benefits and more to L2s through [Rollup-Boost](https://writings.flashbots.net/introducing-rollup-boost).

## BuilderNet for block builders

In addition to supporting BuilderNet as operators, **Beaverbuild and Flashbots will integrate their centralized builders with BuilderNet in the coming months.** This includes merging their software, infrastructure, and orderflow with the decentralized network.

Today, Beaverbuild is beginning this process by running instances of their builder in TEEs. This will allow Beaverbuild to incrementally adopt TEEs and join the decentralized network with minimal disruption for its users. It also can provide a model to progressively decentralize and integrate other block builders with BuilderNet in the future.

Tomorrow we believe that there will no longer be a discrete entity known as a “block builder” but rather a distributed process that produces blocks. The core boilerplate of block building will become a public utility which supports this decentralized network — involving today’s builders, searchers, and orderflow providers as well as new types of programs entirely. We invite each of these parties to join us in accelerating this future.

## Roadmap

The first release of BuilderNet is **just one step in a larger plan** to decentralize block building across Ethereum. We want to be clear about both the guarantees it offers today and its path to upgrade these guarantees over time.

### Censorship resistance

Each operator in BuilderNet chooses their own compliance policy. While they share all orderflow equally with other operators, they can choose to exclude transactions from certain addresses in their own blocks. This is an important step towards censorship resistance in block building because one operator can include transactions in their block even if another does not.

At launch, BuilderNet is operated by multiple different parties with different compliance policies. This means that **its overall censorship resistance is greater than any individual centralized builder today, which strictly improves censorship resistance within the MEV-Boost market.**

In the future, we intend to distribute the block building process in BuilderNet so that operators can extend each others’ blocks. In this model only one non-censoring operator would need to contribute to a block in order to prevent transactions from being censored even *within that block*. **This will make BuilderNet significantly more censorship resistant than the current MEV-Boost market is, or likely ever can be** — as each block will reflect the aggregate economic activity across the network, rather than the preferences or limitations of a single operator.

### Architectural decentralization

All block builders today are operated by centralized teams, which can be a point of failure, limitation, and control. BuilderNet makes it possible for many teams to operate instances of the same block builder.

At launch, all orderflow sent to Flashbots will be shared with BuilderNet. This will strictly increase the number of teams that participate in building blocks for Flashbots users. As other teams like Beaverbuild follow suit, BuilderNet will similarly increase the number of teams that participate in building blocks for their users.

But while BuilderNet can help increase architectural decentralization in certain aspects of the market today, the network itself is not fully decentralized at launch. Like all existing builders, BuilderNet relies on centralized infrastructure for functions like transaction ingress and data storage, and Operators currently need permission to join the network. **In future releases, we intend to remove these dependencies, make all roles permissionless, and decentralize technical governance of BuilderNet.**

Finally, architectural decentralization in BuilderNet will allow it to generate more value than centralized builders are today. We intend to let operators [outsource](https://collective.flashbots.net/t/searching-in-tdx/3902) computations to private searching and bundle merging programs, which can permissionlessly yet confidentially execute strategies that improve the value of its blocks and capture MEV.

![Roadmap](/img/buildernet-roadmap.jpg)

This is an ambitious roadmap. We believe it is theoretically possible, practically tractable, and essential to build now.

Learn more about BuilderNet and participate [here](https://buildernet.org/docs/). You can also reach out on Telegram (@sketsdever).

*Thank you to Vitalik, Viktor Bunin, Jon Charbonneau, and Barnabe Monnot for their feedback on this post.*
