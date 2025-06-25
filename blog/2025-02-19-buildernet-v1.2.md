---
title: BuilderNet v1.2
description: We are excited to release BuilderNet v1.2, a significant upgrade that streamlines operator onboarding and enhances the security and performance of the BuilderNet infrastructure.
image: /img/buildernet-cover-photo-m.jpg
hide_table_of_contents: false
---

We are excited to release BuilderNet v1.2, a significant upgrade that streamlines operator onboarding and enhances the security and performance of the BuilderNet infrastructure.

<!-- truncate -->

This release introduces fully automatic node bootstrapping, improved system management capabilities and authentication, and lays the groundwork for a more flexible, container-based architecture.

BuilderNet v1.2 represents an important step towards our goal of performant, decentralized and permissionless block building, while maintaining the highest standards of security and reliability.

## Improvements

### Enhanced performance

BuilderNet v1.2 significantly improves performance compared to BuilderNet v1.1. This is particularly noticeable in the key block-building metrics of root-hash calculation and block finalization time, which we were able to reduce by about 30-50% (see also metrics at the end of this post).

The improvements are due to a combination of software updates as well as infrastructure optimizations (most notably disk type and caching settings). These setting are automatically applied when creating the infrastructure with our new Terraform module!

### Terraform module for infrastructure automation

We are happy to release an [open-source Terraform module](https://github.com/flashbots/terraform-module-azure-confidential-vm/) to automatically setup the optimal cloud infrastructure for running a BuilderNet node.

For now, only Azure deployments are possible. Bare-metal support is planned for the next release!

### Fully automatic bootstrapping

BuilderNet v1.2 TDX image automatically bootstraps using configuration from [BuilderHub](https://github.com/flashbots/builder-hub). The process is completely automated, with no manual intervention needed from either the operator or Flashbots.

### System API updates

Inside the VM, we run a component called [System API](https://github.com/flashbots/system-api). It is capable of executing predefined commands, upload files to predefined locations, and exposes system events over HTTP.

We added a few new actions:

- Refresh configuration (pulled from BuilderHub)
- Restart selected services
- Reboot the instance
- Toggle debug SSH access (SSH is disabled by default, operators can choose to enable it)

Additionally:

- Requests are now encrypted with TLS
- We’ve added support for HTTP “Basic” authentication

Here’s the full system-api configuration for BuilderNet v1.2.1: [systemapi-config.toml.mustache](https://github.com/flashbots/meta-confidential-compute/blob/f1b1770d80946ea8d879632a8d572dacadb3edc4/recipes-core/system-api/files/systemapi-config.toml.mustache)

### Minimal base image

Our goal is to make the VM image usable for other use-cases besides running services for BuilderNet. One such example is [Bottom of Block arbitrage](https://collective.flashbots.net/t/searching-in-tdx/3902) which also runs in TEEs.

We plan to create a base image that can be extended with the services suited for a particular scenario. Actual services will be configured as [OCI containers](https://opencontainers.org/) (Docker/Podman).

As a step towards this direction in this iteration we replaced two services (private bidding logic and HAProxy) with Podman containers pulled in runtime. We’ll continue replacing baked in binaries with container definitions.

### Bug fixes and quality of life improvements

- Refactor disk encryption init script to wait for the disk to appear. The disk is attached after the VM is started and needs some time to appear in the system.
- Add Azure complete provisioning script that acknowledges Azure the VM is started in the absence of Azure agent inside the VM. Without it provisioning VM using Azure API (e.g., with Terraform) never completes and VM reports not ready status in the Azure dashboard.
- Bind SSH to a non-standard port (40192)
- Update checkpoint sync URL for Lighthouse
- Refactor `reth-sync` script: keep the main sync process running in background, run a monitor in foreground that continuously reports the download progress to System API. Once the main reth-sync PID is gone the foreground monitor shuts down continuing the rest of the boot sequence.
- Add [Orderflow Proxy](https://github.com/flashbots/buildernet-orderflow-proxy) metrics
- Fix broken system reboots
- Avoid costly Reth DB snapshot sync when directory is not empty
- Allow puling the disk encryption key from BuilderHub, while we are exploring further privacy-preserving key-management solutions.
- Fix time synchronization. Instead of syncing the time once a minute run an NTP daemon
- Fix shipping logs from containers

## Reproducible builds

BuilderNet v1.2 supports fully reproducible TDX image builds, which lets you arrive at the exact same measurements as our reference builds. Previously there were some non-deterministic parts in the build process of [Podman](https://github.com/containers/podman), which we have now fixed [[1]](https://github.com/flashbots/meta-custom-podman/commit/bc9c4735461f591cbcd4bff8f12b67e98cd32d06) [[2]](https://github.com/flashbots/meta-custom-podman/commit/a48177738b6216f4ef828f0fa7ab7a41081bb186).

The main entry point for the image builds is the [flashbots/yocto-manifests](https://github.com/flashbots/yocto-manifests) repository, and for this release specifically the [v1.2.1 tag](https://github.com/flashbots/yocto-manifests/releases/tag/v1.2.1) ([commit `da661d4`](https://github.com/flashbots/yocto-manifests/commit/da661d4ade92bc282d73f35289adacc0f381e2e8)).

To reproducibly build it, clone the repository, check out the tag and build it with Docker/Podman:

```bash
git clone https://github.com/flashbots/yocto-manifests.git
cd yocto-manifests
git checkout v1.2.1
make image-buildernet
```

The first time, building takes a long time (~1h). Subsequent runs are faster because some of the build artifacts will then be cached.

You can confirm that the hash of your build matches the [expected](https://measurements.buildernet.org) one:

```bash
make measurements-buildernet
```

Build host specs:

- Ubuntu 22.04 x64 (Linux kernel 6.8.0-49-generic), fully updated system
- Intel Xeon Gold 6312U, 48vCPUs, 512GB memory

## Performance & Metrics

We also wanted to share some key performance insights (data for four days, between Feb 15 and Feb 19, 2025).

**Root Hash Time:** Time spent calculating root hash of the final block. p50 does typically not require any disk access, and is mostly io/cpu/keccak calculation

![Root Hash Metrics](/img/post-bnet12/root-hash-1.png)

![Root Hash Metrics](/img/post-bnet12/root-hash-2.png)

**Finalize Time (aka Block Sealing):** Time spent finalizing blocks in milliseconds. Its applying withdrawals, doing the post block call and calculating state root hash of the block. p50 does typically not require any disk access, and is mostly io/cpu/keccak calculation

![Finalize Time Metrics](/img/post-bnet12/finalize-time-1.png)

## Version Details

BuilderNet is based on [v1.2.1](https://github.com/flashbots/yocto-manifests/releases/tag/v1.2.1) tag ([commit `da661d4`](https://github.com/flashbots/yocto-manifests/commit/da661d4ade92bc282d73f35289adacc0f381e2e8)) of Yocto Manifests, our BuilderNet TDX image build toolchain.

### Artifacts

Signed artifacts are stored [here](https://downloads.buildernet.org/buildernet-images/), and the specific VM image file is [buildernet-v1.2.1-azure-tdx-5ddf9cba5dfe0e3ac097b005145ad789bcfdf262231382909062b02db3d461d4.wic.vhd](https://downloads.buildernet.org/buildernet-images/buildernet-v1.2.1-azure-tdx-5ddf9cba5dfe0e3ac097b005145ad789bcfdf262231382909062b02db3d461d4.wic.vhd) ([checksum](https://downloads.buildernet.org/buildernet-images/buildernet-v1.2.1-azure-tdx-5ddf9cba5dfe0e3ac097b005145ad789bcfdf262231382909062b02db3d461d4.wic.vhd.sha256), [signature](https://downloads.buildernet.org/buildernet-images/buildernet-v1.2.1-azure-tdx-5ddf9cba5dfe0e3ac097b005145ad789bcfdf262231382909062b02db3d461d4.wic.vhd.minisig)).

### Measurements

These are the new [live](https://measurements.buildernet.org/) measurements for v1.2.1:

```bash
{
    "measurement_id": "buildernet-v1.2.1-azure-tdx-5ddf9cba5dfe0e3ac097b005145ad789bcfdf262231382909062b02db3d461d4.wic.vhd",
    "attestation_type": "azure-tdx",
    "measurements": {
        "4": {
            "expected": "b5fee89a85bf5b168efc4468c18ec4718b26a5c9fc7854bdc34ce25b60add132"
        },
        "9": {
            "expected": "210d55d0e3bd00874faaf0ac45778d53a5fd13d84e3a76720cc19b72b0eefbbc"
        },
        "11": {
            "expected": "84b0ef2e25a43fae992d27602d9c35a3ec66c32fc3d7ea08df543dcc87f287e2"
        }
    }
}
```

### Service versions

| Service                                                                  | Version |
| ------------------------------------------------------------------------ | ------- |
| [Lighthouse](https://github.com/sigp/lighthouse)                         | v5.3.0  |
| [Reth](https://github.com/paradigmxyz/reth)                              | v1.0.8  |
| [Orderflow Proxy](https://github.com/flashbots/orderflow-proxy)          | v0.2.6  |
| [Rbuilder-Operator](https://github.com/flashbots/rbuilder-operator/tags) | v0.1.5  |
| [System-API](https://github.com/flashbots/system-api)                    | v0.7.0  |
| [CVM-Proxy](https://github.com/flashbots/cvm-reverse-proxy) (client)     | v0.1.0  |
| [CVM-Proxy](https://github.com/flashbots/cvm-reverse-proxy) (server)     | v0.1.0  |

---

Join the conversation [on the BuilderNet forum](https://collective.flashbots.net/c/buildernet/31) and the [Telegram group](https://t.me/buildernet_general)!
