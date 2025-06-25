---
title: BuilderNet v1.4
description: BuilderNet v1.4 is the Pectra-ready version of BuilderNet.
hide_table_of_contents: false
---

BuilderNet v1.4 is the Pectra-ready version of BuilderNet. This release includes newer versions of Reth and Lighthouse, as well as a few minor bug fixes and improvements.

One notable improvement is that TLS certificates for BuilderNet nodes are now persistent, where previously they were rotated on each service restart. This change is part of the ongoing effort to improve the user experience and security of the network.

<!-- truncate -->

## Versions

The build toolchain for BuilderNet v1.4 is based on [yocto-manifests@v1.4.0 (commit `170d166`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.4.0):

### Updated services

| Project                                                                  | New Version                                                                             | Commit                                                                                                               | Previous Version |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------- |
| [Reth](https://github.com/paradigmxyz/reth)                              | `v1.3.12`                                                                               | [`6f8e725`](https://github.com/paradigmxyz/reth/commit/6f8e7258f4733279080e4bd8345ce50538a40d6e)                     | `v1.0.8`         |
| [Lighthouse](https://github.com/sigp/lighthouse)                         | `v7.0.1`                                                                                | [`e42406d`](https://github.com/sigp/lighthouse/commit/e42406d7b79a85ad4622f3a7440ff6468ac4c9e1)                      | `v5.3.0`         |
| [rbuilder-operator](https://github.com/flashbots/rbuilder-operator/tags) | [`v1.1.0`](https://github.com/flashbots/rbuilder-operator/releases/tag/v1.1.0)          | [`4f4d1f2`](https://github.com/flashbots/rbuilder-operator/commit/4f4d1f231ea133cd37a2e490fa34eda97d52541b)          | `v1.0.1`         |
| [orderflow-proxy](https://github.com/flashbots/orderflow-proxy)          | [`v0.3.5`](https://github.com/flashbots/buildernet-orderflow-proxy/releases/tag/v0.3.5) | [`6fd93f8`](https://github.com/flashbots/buildernet-orderflow-proxy/commit/6fd93f883e453e1e15d97bd455bb3f66cd085aeb) | `v0.3.3`         |

### Not updated services

| Project                                                     | Version                                                                        | Commit                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [CVM Proxy](https://github.com/flashbots/cvm-reverse-proxy) | [`v0.1.6`](https://github.com/flashbots/cvm-reverse-proxy/releases/tag/v0.1.6) | [`8e5c9a1`](https://github.com/flashbots/cvm-reverse-proxy/commit/8e5c9a13278f4864d05a6f1e7493e99f98053cea) | `v0.1.0` |
| [Operator API](https://github.com/flashbots/system-api)     | [`v0.7.0`](https://github.com/flashbots/system-api/releases/tag/v0.7.0)        | [`a8296e4`](https://github.com/flashbots/system-api/commit/a8296e4ccd355f5fac805828ad8e474381a6c5a2)        | `v0.7.0` |
| [HAProxy](https://github.com/haproxy/haproxy)               | `v3.0.6`                                                                       |


### Changes & Pull Requests

| Project                      | Changes                                                                                                    |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| reth                         | [v1.0.8...v1.3.12](https://github.com/paradigmxyz/reth/compare/v1.0.8...v1.3.12) (2711 PRs)                |
| lighthouse                   | [v5.3.0...v7.0.1](https://github.com/sigp/lighthouse/compare/v5.3.0...v7.0.1) (339 PRs)                    |
| rbuilder / rbuilder-operator | [v1.0.1...v1.1.0](https://github.com/flashbots/rbuilder/compare/v1.0.1...v1.1.0) (42 PRs)                  |
| orderflow-proxy              | [v0.3.3...v0.3.5](https://github.com/flashbots/buildernet-orderflow-proxy/compare/v0.3.3...v0.3.5) (5 PRs) |

### Services Configuration

| Service                                                                                                                                                                           | Configuration                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Operator API](https://github.com/flashbots/meta-confidential-compute/blob/d8bcb394310f896f98f8b83b29732678792d101e/recipes-core/system-api/files/systemapi-config.toml.mustache) | [meta-confidential-compute@d8bcb39](https://github.com/flashbots/meta-confidential-compute/blob/d8bcb394310f896f98f8b83b29732678792d101e/recipes-core/system-api/files/systemapi-config.toml.mustache) |
| [HAProxy](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/haproxy/haproxy.cfg.mustache)                                         | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/haproxy/haproxy.cfg.mustache)                                                     |
| [Lighthouse](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/lighthouse/init#L37-L57)                                           | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/lighthouse/init#L37-L57)                                                          |
| [Orderflow Proxy](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/orderflow-proxy/files/orderflow-proxy.conf.mustache)          | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/orderflow-proxy/files/orderflow-proxy.conf.mustache)                              |
| [Rbuilder](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/rbuilder/config.mustache)                                            | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/rbuilder/config.mustache)                                                         |
| [Reth](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/reth/init#L41-L59)                                                       | [meta-evm@bd51f7e](https://github.com/flashbots/meta-evm/blob/1a40c40ed08c2ff27450f398ac040ff2902fbcf7/recipes-nodes/reth/init#L41-L59)                                                                |

## Artifacts

Signed artifacts are stored at https://downloads.buildernet.org/buildernet-images/.

The specific TDX VM image for the BuilderNet v1.4 release is `buildernet-v1.4.0-azure-tdx-5344f8aff0ed6753015d8ac6d157a7f8485aa22de4201cb233805ab9af3f37c7`

## Measurements

These are the new [live](https://measurements.buildernet.org/) measurements for BuilderNet v1.4:

```json
{
    "measurement_id": "buildernet-v1.4.0-azure-tdx-5344f8aff0ed6753015d8ac6d157a7f8485aa22de4201cb233805ab9af3f37c7.wic.vhd",
    "attestation_type": "azure-tdx",
    "measurements": {
        "4": {
            "expected": "4b73de8d71d6342ae3cfb5ce4e5601ec7e9dc49127a76916c8f0b4a8463b5d14"
        },
        "9": {
            "expected": "aeb9899553dba20e05cb5673930d609c2ce6e0ceb920e1a01baf21a155a2df04"
        },
        "11": {
            "expected": "7585ce8ec39ed48f7db95ee435870010ec8151b2ab3716cb9876e976a75cb31a"
        }
    }
}
```

## Reproducible Builds

BuilderNet v1.4 supports fully reproducible TDX image builds. The image you build will produce the exact same TDX measurements as our reference builds.

The main entry point for the image builds is the [flashbots/yocto-manifests](https://github.com/flashbots/yocto-manifests) repository, and for this release specifically the [yocto-manifests@v1.4.0 (commit `170d166`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.4.0).

To reproducibly build it, clone the repository, check out the tag and build it with Docker/Podman:

```bash
git clone https://github.com/flashbots/yocto-manifests.git
cd yocto-manifests
git checkout v1.4.0
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
