---
title: BuilderNet v1.3
description: We are excited to announce BuilderNet v1.3!
image: /img/buildernet-cover-photo-m.jpg
hide_table_of_contents: false
---

We are thrilled to announce the release of BuilderNet v1.3, an update that introduces significant enhancements including an upgraded `eth_sendBundle` API, improved monitoring, initial support local devnet environment, and advanced operational features that empower operators with greater control and deployment flexibility.

<!-- truncate -->

This release also introduces crucial operational features like an rbuilder on/off switch for safer deployments, multi-endpoint Prometheus metrics support, extended rate limiting capabilities, and configurable merging algorithms.

## Improvements

### Upgraded `eth_sendBundle` API

BuilderNet v1.3 provides an upgraded `eth_sendBundle` API, which includes new fields for backrun OFAs that are widely supported by other block builders. This allows backrun OFAs to submit directly to BuilderNet with better performance and customization.

Specifically, these new (optional) fields were added:

| Field              | Description                                                                                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `droppingTxHashes` | A list of transaction hashes contained in the bundle, that are allowed to be removed from the bundle (but not allowed to revert). This feature is typically used to allow the builder to merge multiple OFA backruns together.                                                                         |
| `refundPercent`    | An integer between 1-99, which indicates much of the total priority fee + coinbase payment to refund. A payout transaction transferring the refund amount will be appended immediately following the bundle in the same block. The cost of the payout transaction is deducted from the overall refund. |
| `refundRecipient`  | An address that the funds from `refundPercent` will be transferred to in the payout transaction. If not specified, they will be sent to the `from` address of the first transaction.                                                                                                                   |


BuilderNet now also supports bundle cancellations with `eth_sendBundle`, by sending a bundle with the same `replacementUuid` and an empty list of transactions. This allows you to cancel bundles that are no longer needed.

:::info

See also the [BuilderNet API Reference](https://buildernet.org/docs/api) for more information and details, as well as the API docs
for [Beaver Builder](https://beaverbuild.org/docs.html) and [Titan](https://docs.titanbuilder.xyz/api/eth_sendbundle).

:::

### Additional end-to-end latency metrics

rbuilder now includes additional e2e latency Prometheus metrics.

Here’s an screenshot of p99 e2e latency over a couple of days:

![e2e p99 metrics](/img/post-bnet13/e2ep99.jpg)

### Prometheus metrics can be sent to multiple endpoints

The v1.3 release supports multi-endpoint support for Prometheus metrics, allowing builder nodes to send monitoring data to multiple destinations simultaneously.

### rbuilder on/off switch to simplify deployments

The rbuilder on/off switch feature introduces a new configuration option that allows operators to safely control the builder's participation in block building. This switch can be toggled without requiring a full restart, making it particularly useful during maintenance windows, upgrades, or when troubleshooting issues.

When turned off, the rbuilder gracefully stops accepting new bundles and participating in block building, while maintaining its connection to the network. This enables smooth transitions during deployments and provides an additional safety mechanism for operators.

### Configurable merging algorithms

This release enables the dynamic configuration of merging algorithms, instead of requiring a new BuilderNet version release to change them.


### Local devnet environment support

BuilderNet release images are now capable of running in a local devnet mode. This allows developers to test and develop locally without needing to deploy on the main BuilderNet network. Specifially noteworthy improvements include:

- [BuilderNet playground](https://github.com/flashbots/buildernet-playground/) codebase which integrates BuilderNet images with [Builder Playground](https://github.com/flashbots/builder-playground/) (this is an alpha state and work-in-progress)
- TDX VM images in [qcow2 format](https://docs.redhat.com/en/documentation/red_hat_virtualization/4.3/html/technical_reference/qcow2), which can be used to run locally in QEMU.
- Configurable [BuilderHub](https://github.com/flashbots/builder-hub/) URL for image builds.

The local devnet is based on this [Builder Playground](https://github.com/flashbots/builder-playground) PR: https://github.com/flashbots/builder-playground/pull/101

We are actively working on the local devnet and expect to have more news around this soon.

---

## Versions

The reproducible build toolchain for BuilderNet v1.3 is based on [yocto-manifests@v1.3.0 (commit `05638f3`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.3.0).

| Project                                                                  | New Version                                                                                             | Commit                                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [rbuilder-operator](https://github.com/flashbots/rbuilder-operator/tags) | [`v1.0.1`](https://github.com/flashbots/rbuilder-operator/releases/tag/v1.0.1)  (prev `v0.1.5`)         | [43b7902](https://github.com/flashbots/rbuilder-operator/commit/43b7902925316c1fcadff67c4b2f6e078e064194)          |
| [orderflow-proxy](https://github.com/flashbots/orderflow-proxy)          | [`v0.3.3`](https://github.com/flashbots/buildernet-orderflow-proxy/releases/tag/v0.3.3) (prev `v0.2.6`) | [7c84264](https://github.com/flashbots/buildernet-orderflow-proxy/commit/7c8426426083f829e88947c7222be626c8de1f21) |
| [CVM Proxy](https://github.com/flashbots/cvm-reverse-proxy)              | [`v0.1.6`](https://github.com/flashbots/cvm-reverse-proxy/releases/tag/v0.1.6) (prev: `v0.1.0`)         | [8e5c9a1](https://github.com/flashbots/cvm-reverse-proxy/commit/8e5c9a13278f4864d05a6f1e7493e99f98053cea)          |
| [Operator API](https://github.com/flashbots/system-api)                  | no change, still [`v0.7.0`](https://github.com/flashbots/system-api/releases/tag/v0.7.0)                | [a8296e4](https://github.com/flashbots/system-api/commit/a8296e4ccd355f5fac805828ad8e474381a6c5a2)                 |
| Reth                                                                     | no change, still `v1.0.8`                                                                               |                                                                                                                    |
| Lighthouse                                                               | no change, still `v5.3.0`                                                                               |                                                                                                                    |
| HAProxy                                                                  | no change, still `v3.0.6`                                                                               |                                                                                                                    |

### Changes & Pull Requests

| Project                      | Changes                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| rbuilder / rbuilder-operator | [v0.1.5...v1.0.1](https://github.com/flashbots/rbuilder/compare/v0.1.5...v1.0.1) (83 PRs)                   |
| orderflow-proxy              | [v0.2.6...v0.3.3](https://github.com/flashbots/buildernet-orderflow-proxy/compare/v0.2.6...v0.3.3) (24 PRs) |
| cvm-reverse-proxy            | [v0.1.0...v0.1.6](https://github.com/flashbots/cvm-reverse-proxy/compare/v0.1.0...v0.1.6) (13 PRs)          |

### Services Configuration

| Service                                                                                                                                                                           | Configuration                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Operator API](https://github.com/flashbots/meta-confidential-compute/blob/d8bcb394310f896f98f8b83b29732678792d101e/recipes-core/system-api/files/systemapi-config.toml.mustache) | [meta-confidential-compute@d8bcb39](https://github.com/flashbots/meta-confidential-compute/blob/d8bcb394310f896f98f8b83b29732678792d101e/recipes-core/system-api/files/systemapi-config.toml.mustache) |
| [HAProxy](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/haproxy/haproxy.cfg.mustache)                                         | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/haproxy/haproxy.cfg.mustache)                                                     |
| [Lighthouse](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/lighthouse/init#L37-L57)                                           | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/lighthouse/init#L37-L57)                                                          |
| [Orderflow Proxy](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/orderflow-proxy/files/orderflow-proxy.conf.mustache)          | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/orderflow-proxy/files/orderflow-proxy.conf.mustache)                              |
| [Rbuilder](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/rbuilder/config.mustache)                                            | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/rbuilder/config.mustache)                                                         |
| [Reth](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/reth/init#L41-L59)                                                       | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/bd51f7e9e7271970651d05282a000acf933b106c/recipes-nodes/reth/init#L41-L59)                                                                |

## Artifacts

Signed artifacts are stored at https://builder-artifacts.flashbots.net/buildernet-images/.

The specific TDX VM image for the BuilderNet v1.3 release is `buildernet-v1.3.0-azure-tdx-d17a02695c1acc0800aff80e86efbe0e5919843184e6562d8d572894ab43d149`

## Measurements

These are the new [live](https://measurements.builder.flashbots.net/) measurements for BuilderNet v1.3.0:

```json
{
    "measurement_id": "buildernet-v1.3.0-azure-tdx-d17a02695c1acc0800aff80e86efbe0e5919843184e6562d8d572894ab43d149.wic.vhd",
    "attestation_type": "azure-tdx",
    "measurements": {
        "4": {
            "expected": "966f0aa4b6f6952e601712cfe78f71a6ae61467a425a92d0800c754e98933d78"
        },
        "9": {
            "expected": "af03ec5b7f02f5b9779f04bc837b8cbbf85d5b0386d5f387d8b99e8f0d9a1fa4"
        },
        "11": {
            "expected": "3aede0e78b33f4197175b73468be54f168a46719c063b7c4f27c10984e614b38"
        }
    }
}
```

## Reproducible Builds

BuilderNet v1.3 supports fully reproducible TDX image builds. The image you build will produce the exact same TDX measurements as our reference builds.

The main entry point for the image builds is the [flashbots/yocto-manifests](https://github.com/flashbots/yocto-manifests) repository, and for this release specifically the [yocto-manifests@v1.3.0 (commit `05638f3`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.3.0).

To reproducibly build it, clone the repository, check out the tag and build it with Docker/Podman:

```bash
git clone https://github.com/flashbots/yocto-manifests.git
cd yocto-manifests
git checkout v1.3.0
make image-buildernet
```

You can confirm that the hash of your build matches the [expected](https://measurements.builder.flashbots.net/) one:

```bash
make measurements-buildernet
```

Build host specs:

- Ubuntu 22.04 x64 (Linux kernel 6.8.0-49-generic), fully updated system
- Intel Xeon Gold 6312U, 48vCPUs, 512GB memory

---

Join the conversation [on the BuilderNet forum](https://collective.flashbots.net/c/buildernet/31) and the [BuilderNet Telegram group](https://t.me/buildernet_general)!