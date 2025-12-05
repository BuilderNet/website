---
title: BuilderNet v1.6
description: BuilderNet v1.6 focuses on consolidation, performance, and protocol readiness.
hide_table_of_contents: false
---

BuilderNet v1.6 is a major release focused on consolidation, performance, and protocol readiness. This update brings a ground-up rewrite of our orderflow ingestion layer, merges rbuilder-operator into the main rbuilder codebase, and adds full support for the upcoming Fusaka hardfork.

<!-- truncate -->

## Highlights

- **[FlowProxy](https://collective.flashbots.net/t/introducing-flowproxy/5341/1)** — Our new orderflow ingress and multiplexing system, completely rewritten in Rust. Faster, more reliable handling of incoming transactions and bundles.

- **Fusaka-ready** — Full support for the upcoming hardfork, including proper handling of system transactions. Required for mainnet compatibility when Fusaka activates.

- **Optimistic v3** — New optimistic submission types for lower latency block submissions, helping you stay competitive in the bidding race.

- **Simplified stack** — The rbuilder-operator repository has been merged into rbuilder. One less component to deploy and maintain.

- **Rebalancer service** — Automates ETH movement between addresses, simplifying treasury management.

- **Delay refunds** (out of block payment) - Support for payments outside the main block.

- **Performance improvements** — Faster proof generation, improved bidding latency, and more efficient transaction ordering.

- **DNS caching with DNSMASQ** — Reduces latency and improves resilience by caching DNS lookups locally.

- **Clickhouse on-disk backups** — Buffers data locally to prevent loss during network issues or Clickhouse downtime.

## Versions

The build toolchain for BuilderNet v1.6 is based on [yocto-manifests v1.6.0 (commit `68962ce`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.6.0):

### Updated services

| Project                                                | New Version                                                             | Commit                                                                                                                                          | Previous Version                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [rbuilder](https://github.com/flashbots/rbuilder/tags) | [`v1.2.28`](https://github.com/flashbots/rbuilder/releases/tag/v1.2.28) | [`9a82891 `](https://github.com/flashbots/rbuilder/commit/9a82891d84874570bd0abcb0496a4e222f50ebaa)                                             | [`v1.2.6`](https://github.com/flashbots/rbuilder/releases/tag/v1.2.6) |
| [Reth](https://github.com/paradigmxyz/reth)            | [`v1.9.3`](https://github.com/paradigmxyz/reth/releases/tag/v1.9.3)     | [`27a8c0f`](https://github.com/paradigmxyz/reth/commit/27a8c0f5a6dfb27dea84c5751776ecabdd069646)                                                | [`v1.4.8`](https://github.com/paradigmxyz/reth/releases/tag/v1.4.8)   |
| [Lighthouse](https://github.com/sigp/lighthouse)       | [`v8.0.1`](https://github.com/sigp/lighthouse/releases/v8.0.1)          | [`ced49dd`](https://github.com/sigp/lighthouse/commit/ced49dd265e01ecbf02b12073bbfde3873058abe)                                                 | [`v7.0.1`](https://github.com/sigp/lighthouse/releases/v7.0.1)        |
| [FlowProxy](https://github.com/buildernet/flowproxy)   | [`v1.2.1`](https://github.com/BuilderNet/FlowProxy/releases/tag/v1.2.1) | [`3326911`](https://github.com/BuilderNet/FlowProxy/commit/33269118f4bdaf4239c4be5c7abdc4e5a6d4a7b0)                                            | -                                                                     |
| [HAProxy](https://github.com/haproxy/haproxy)          | [`3.2.8`](https://hub.docker.com/_/haproxy/tags?name=3.2.8)             | [`9f4f467`](https://hub.docker.com/layers/library/haproxy/3.2.8/images/sha256-9f4f467bef28ee4f18a109e3678e8ae233410837adaa1cc53d8fac9d619b1927) | [`3.0.6`](https://hub.docker.com/_/haproxy/tags?name=3.0.6)           |


### Not updated services

| Project                                                     | Version                                                                                                            | Commit                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [CVM Proxy](https://github.com/flashbots/cvm-reverse-proxy) | [`v0.1.6`](https://github.com/flashbots/cvm-reverse-proxy/releases/tag/v0.1.6)                                     | [`8e5c9a1`](https://github.com/flashbots/cvm-reverse-proxy/commit/8e5c9a13278f4864d05a6f1e7493e99f98053cea) |
| [Operator API](https://github.com/flashbots/system-api)     | [`v0.7.0`](https://github.com/flashbots/system-api/releases/tag/v0.7.0)                                            | [`a8296e4`](https://github.com/flashbots/system-api/commit/a8296e4ccd355f5fac805828ad8e474381a6c5a2)        |
| [acme.sh](https://github.com/acmesh-official/acme.sh)       | [`3.1.1-25-g42bbd1b4`](https://github.com/acmesh-official/acme.sh/commit/42bbd1b44af48a5accce07fa51740644b1c5f0a0) | [`42bbd1b4`](https://github.com/acmesh-official/acme.sh/commit/42bbd1b44af48a5accce07fa51740644b1c5f0a0)    |


### Changes & Pull Requests

| Project    | Changes                                                                                      |
| ---------- | -------------------------------------------------------------------------------------------- |
| rbuilder   | [v1.2.6...v1.2.28](https://github.com/flashbots/rbuilder/compare/v1.2.6...v1.2.28) (139 PRs) |
| Reth       | [v1.4.8...v1.9.3](https://github.com/paradigmxyz/reth/compare/v1.4.8...v1.9.3) (1570 PRs)    |
| Lighthouse | [v7.0.1...v8.0.1](https://github.com/sigp/lighthouse/compare/v7.0.1...v8.0.1) (414 PRs)      |

### Services Configuration

| Service                                                                                                                                                                           | Configuration                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Operator API](https://github.com/flashbots/meta-confidential-compute/blob/06de303f2076991da9110a9c8a1c73b80df1d420/recipes-core/system-api/files/systemapi-config.toml.mustache) | [meta-confidential-compute@06de303](https://github.com/flashbots/meta-confidential-compute/blob/d8bcb394310f896f98f8b83b29732678792d101e/recipes-core/system-api/files/systemapi-config.toml.mustache) |
| [HAProxy](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/haproxy/haproxy.cfg.mustache)                                         | [meta-evm@fb265a0](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/haproxy/haproxy.cfg.mustache)                                                     |
| [Lighthouse](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/lighthouse/init#L37-L57)                                           | [meta-evm@fb265a0](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/lighthouse/init#L37-L57)                                                          |
| [FlowProxy](https://github.com/flashbots/meta-evm/tree/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/flowproxy)                                                          | [meta-evm@fb265a0](https://github.com/flashbots/meta-evm/tree/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/flowproxy)                                                                        |
| [Rbuilder](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/rbuilder/config.mustache)                                            | [meta-evm@fb265a0](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/rbuilder/config.mustache)                                                         |
| [Reth](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/reth/init#L41-L60)                                                       | [meta-evm@fb265a0](https://github.com/flashbots/meta-evm/blob/fb265a0ca11e95048d023f7edaf7a555a71d7c8c/recipes-nodes/reth/init#L41-L60)                                                                |

## Artifacts

Signed artifacts are stored at https://downloads.buildernet.org/buildernet-images/.

The specific TDX VM image for the BuilderNet v1.6 release is located at [`/v1.6.0/buildernet-1.6.0-azure-tdx.wic.vhd`](https://downloads.buildernet.org/buildernet-images/v1.6.0/buildernet-1.6.0-azure-tdx.wic.vhd)

## Measurements

These are the new [live](https://measurements.buildernet.org/) measurements for BuilderNet v1.6:

```json
{
    "measurement_id": "buildernet-v1.6.0-azure-tdx.wic.vhd",
    "attestation_type": "azure-tdx",
    "measurements": {
        "4": {
            "expected": "bd5c5c469a57fdeae9a88ca8ef6682248f7aec1ba68173b6c09236d8dffbd8ae"
        },
        "9": {
            "expected": "b6d80052b6d6b655677ab464ef6485b47c139c4f2056665969b105398ae191c6"
        },
        "11": {
            "expected": "65711301762c58bbca51cfadd9b3b18cf662e5f38882a7150217fec4d7564663"
        }
    }
}
```

## Reproducible Builds

BuilderNet v1.6 supports fully reproducible TDX image builds. The image you build will produce the exact same TDX measurements as our reference builds.

The main entry point for the image builds is the [flashbots/yocto-manifests](https://github.com/flashbots/yocto-manifests) repository, and for this release specifically the [yocto-manifests v1.6.0 (commit `68962ce`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.6.0).

To reproducibly build it, clone the repository, check out the tag and build it with Docker/Podman:

```bash
git clone https://github.com/flashbots/yocto-manifests.git
cd yocto-manifests
git checkout v1.6.0
make image-buildernet
```

You can confirm that the hash of your build matches the [expected](https://measurements.buildernet.org/) one:

```bash
make measurements-buildernet
```

Build host specs:

- Ubuntu 22.04 x64 (Linux kernel 6.8.0-49-generic), fully updated system
- Intel Xeon Gold 6312U, 48vCPUs, 512GB memory

---

Join the conversation [on the BuilderNet forum](https://collective.flashbots.net/c/buildernet/31) and the [BuilderNet Telegram group](https://t.me/buildernet_general)!
