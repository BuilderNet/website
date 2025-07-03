---
title: BuilderNet v1.5
description: BuilderNet v1.5 the July 2025 release of BuilderNet, which includes new features and significant performance improvements.
hide_table_of_contents: false
---

BuilderNet v1.5 the July 2025 release of BuilderNet, which includes new features (i.e. trusted TLS certificates) and significant performance improvements.

<!-- truncate -->


## Main changes

- [Even faster root hash](https://github.com/flashbots/rbuilder/pull/634)
- [EVM caching](https://github.com/flashbots/rbuilder/pull/573)
- [Trusted TLS certificates (using Let’s Encrypt, TLS termination now by HAProxy)](https://github.com/flashbots/meta-evm/pull/83)
- [Reth upgrade, fixing possible root-hash issue](https://github.com/paradigmxyz/reth/releases/tag/v1.4.8)
- Subsidy auto-update
- Orderflow-proxy bugfixes and performance improvements
- `/readyz` and `/livez` endpoints
- Detection of coinbase fund transfer
- Discard mempool transactions when calculating profit

## Versions

The build toolchain for BuilderNet v1.5 is based on [yocto-manifests@v1.5.0 (commit `TODO`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.5.0):

### Updated services

| Project                                                                  | New Version                                                                             | Commit                                                                                                               | Previous Version                                                                        |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Reth](https://github.com/paradigmxyz/reth)                              | [`v1.4.8`](https://github.com/paradigmxyz/reth/releases/tag/v1.4.8)                     | [`127595e`](https://github.com/paradigmxyz/reth/commit/127595e23079de2c494048d0821ea1f1107eb624)                     | [`v1.3.12`](https://github.com/paradigmxyz/reth/releases/tag/v1.3.12)                   |
| [rbuilder-operator](https://github.com/flashbots/rbuilder-operator/tags) | [`v1.2.5`](https://github.com/flashbots/rbuilder-operator/releases/tag/v1.2.5)          | [`7cbbd4b`](https://github.com/flashbots/rbuilder-operator/commit/7cbbd4b15d66ce9ab2ac6f88215170879357903d)          | [`v1.1.0`](https://github.com/flashbots/rbuilder-operator/releases/tag/v1.1.0)          |
| [orderflow-proxy](https://github.com/flashbots/orderflow-proxy)          | [`v0.5.3`](https://github.com/flashbots/buildernet-orderflow-proxy/releases/tag/v0.5.3) | [`5e83b7e`](https://github.com/flashbots/buildernet-orderflow-proxy/commit/5e83b7e35add0e7d6554f88c4e09614acd317c2b) | [`v0.3.5`](https://github.com/flashbots/buildernet-orderflow-proxy/releases/tag/v0.3.5) |
| [acme.sh](https://github.com/acmesh-official/acme.sh)                    | `3.1.1-25-g42bbd1b4`                                                                    | [`42bbd1b`](https://github.com/acmesh-official/acme.sh/commit/42bbd1b44af48a5accce07fa51740644b1c5f0a0)              | -                                                                                       |

### Not updated services

| Project                                                     | Version                                                                        | Commit                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| [Lighthouse](https://github.com/sigp/lighthouse)            | `v7.0.1`                                                                       | [`e42406d`](https://github.com/sigp/lighthouse/commit/e42406d7b79a85ad4622f3a7440ff6468ac4c9e1)             |
| [CVM Proxy](https://github.com/flashbots/cvm-reverse-proxy) | [`v0.1.6`](https://github.com/flashbots/cvm-reverse-proxy/releases/tag/v0.1.6) | [`8e5c9a1`](https://github.com/flashbots/cvm-reverse-proxy/commit/8e5c9a13278f4864d05a6f1e7493e99f98053cea) |
| [Operator API](https://github.com/flashbots/system-api)     | [`v0.7.0`](https://github.com/flashbots/system-api/releases/tag/v0.7.0)        | [`a8296e4`](https://github.com/flashbots/system-api/commit/a8296e4ccd355f5fac805828ad8e474381a6c5a2)        |
| [HAProxy](https://github.com/haproxy/haproxy)               | `v3.0.6`                                                                       |


### Changes & Pull Requests

| Project                      | Changes                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| reth                         | [v1.3.12...v1.4.8](https://github.com/paradigmxyz/reth/compare/v1.3.12...v1.4.8) (513 PRs)                  |
| rbuilder / rbuilder-operator | [v1.1.0...v1.2.5](https://github.com/flashbots/rbuilder/compare/v1.1.0...v1.2.5) (34 PRs)                   |
| orderflow-proxy              | [v0.3.5...v0.5.3](https://github.com/flashbots/buildernet-orderflow-proxy/compare/v0.3.5...v0.5.3) (10 PRs) |

### Services Configuration

TODO

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

The specific TDX VM image for the BuilderNet v1.5 release is `TODO`

## Measurements

These are the new [live](https://measurements.buildernet.org/) measurements for BuilderNet v1.5:

```json
TODO
```

## Reproducible Builds

BuilderNet v1.5 supports fully reproducible TDX image builds. The image you build will produce the exact same TDX measurements as our reference builds.

The main entry point for the image builds is the [flashbots/yocto-manifests](https://github.com/flashbots/yocto-manifests) repository, and for this release specifically the [yocto-manifests@v1.5.0 (commit `TODO`)](https://github.com/flashbots/yocto-manifests/releases/tag/v1.5.0).

To reproducibly build it, clone the repository, check out the tag and build it with Docker/Podman:

```bash
git clone https://github.com/flashbots/yocto-manifests.git
cd yocto-manifests
git checkout v1.5.0
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
