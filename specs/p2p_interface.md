# BuilderNet P2P Interface

## Table of contents

<!-- TOC -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Data Structures](#data-structures)
- [Network Architecture](#network-architecture)
- [Communication Protocols](#communication-protocols)
- [API Endpoints](#api-endpoints)
- [Validation Rules](#validation-rules)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This document defines the P2P communication protocols for BuilderNet nodes. BuilderNet nodes communicate with each other to share orderflow confidentially and coordinate through Flashbots infrastructure. The system prioritizes confidentiality and security through TEE-based communication.

## Configuration

### Constants

| Name | Value | Unit |
|------|-------|------|
| `MAX_CHUNK_SIZE` | `1024 * 1024` | bytes |
| `MAX_REQUEST_SIZE` | `1024 * 1024` | bytes |
| `MAX_RESPONSE_SIZE` | `10 * 1024 * 1024` | bytes |
| `TLS_CERT_VALIDITY` | `24 * 60 * 60` | seconds (24 hours) |

### Network Ports

| Port | Protocol | Service | Use |
|------|----------|---------|-----|
| `5544` | HTTPS | HAProxy | Orderflow sharing between BuilderNet nodes |
| `7936` | HTTPS/aTLS | cvm-proxy | TEE-attested TLS certificate serving |
| `9000` | TCP/UDP | Lighthouse | Consensus network peering |
| `30303` | TCP | Reth | Execution network peering |

### Timeouts

| Name | Value | Unit |
|------|-------|------|
| `ORDERFLOW_SHARING_TIMEOUT` | `60` | seconds |
| `BUILDERHUB_TIMEOUT` | `30` | seconds |
| `TEE_ATTESTATION_TIMEOUT` | `30` | seconds |

## Data Structures

### Basic Types

```python
# Node identifier (Bytes32)
NodeId = Bytes32

# TLS certificate (Bytes)
TlsCertificate = Bytes

# TEE attestation data (Bytes)
TeeAttestation = Bytes

# Timestamp (uint64)
Timestamp = uint64

# Address (Bytes20)
Address = Bytes20

# Transaction hash (Bytes32)
TxHash = Bytes32
```

### Orderflow Sharing Types

```python
@dataclass
class OrderflowShareRequest:
    source_node: NodeId
    orderflow: List[OrderflowEntry]
    target_block: BlockNumber
    timestamp: Timestamp
    signature: Bytes  # Node signature
```

```python
@dataclass
class OrderflowShareResponse:
    success: boolean
    error: Optional[str]
    timestamp: Timestamp
```

### TEE Attestation Types

```python
@dataclass
class TeeAttestationRequest:
    node_id: NodeId
    tee_measurement: Bytes
    ip_address: str
    timestamp: Timestamp
```

```python
@dataclass
class TeeAttestationResponse:
    node_id: NodeId
    tls_certificate: TlsCertificate
    tee_attestation: TeeAttestation
    peer_list: List[PeerInfo]
    configuration: BuilderHubConfig
    timestamp: Timestamp
```

## Network Architecture

### BuilderNet Node-to-Node Communication

BuilderNet nodes communicate with each other through:

1. **Node-to-Node HTTPS (Port 5544)**: For confidential orderflow sharing between BuilderNet nodes
2. **TEE-Attested Channel (Port 7936)**: For serving TLS certificates with TEE attestation

### Flashbots Infrastructure Integration

BuilderNet nodes integrate with Flashbots infrastructure through:

1. **BuilderHub**: For secrets, configuration, and peer discovery
2. **Redistribution Archive**: For storing bid and orderflow data
3. **Identity Management**: For node identity verification
4. **Bidding Coordination**: For coordinating bids across nodes

## Communication Protocols

### Orderflow Sharing Protocol

**Purpose**: Share orderflow confidentially between BuilderNet nodes.

**Communication**: HTTPS on port 5544

**Request Format**:
```json
{
    "source_node": "0x...",
    "orderflow": [
        {
            "tx_hash": "0x...",
            "gas_price": "0x...",
            "gas_limit": "0x...",
            "sender": "0x...",
            "recipient": "0x...",
            "value": "0x...",
            "data": "0x...",
            "timestamp": 1234567890,
            "source": "peer",
            "bundle_id": "0x..."
        }
    ],
    "target_block": "0x...",
    "timestamp": 1234567890,
    "signature": "0x..."
}
```

**Response Format**:
```json
{
    "success": true,
    "error": null,
    "timestamp": 1234567890
}
```

**Security**:
- Each node has its own TLS certificate
- Orderflow never leaves TEE instances
- No operator access to orderflow data
- Node signatures verify authenticity

### TEE Attestation Protocol

**Purpose**: Verify TEE environment and obtain attested TLS certificates.

**Request**: HTTPS GET to `/cert` endpoint on port 7936

**Response**: TLS certificate with TEE attestation

**Validation**:
- Verify TEE measurements match expected values
- Validate attestation signature
- Check certificate validity

**Example**:
```bash
attested-get \
    --addr=https://direct-us.buildernet.org:7936/cert \
    --expected-measurements=https://measurements.buildernet.org \
    --out-response=builder-cert.pem
```

### Peer Discovery Protocol

**Purpose**: Discover and verify other BuilderNet nodes.

**Communication**: Via BuilderHub infrastructure

**Process**:
1. Node A requests peer list from BuilderHub
2. BuilderHub returns list of verified BuilderNet nodes
3. Node A establishes connections with peers
4. Nodes exchange TEE attestations for verification

## API Endpoints

### Orderflow Sharing Endpoints

```python
# Share orderflow with peer node
POST /orderflow/share (port 5544)
Content-Type: application/json

{
    "source_node": "0x...",
    "orderflow": [...],
    "target_block": "0x...",
    "timestamp": 1234567890,
    "signature": "0x..."
}
```

### TEE Attestation Endpoints

```python
# Get attested TLS certificate
GET /cert (port 7936)
# Returns TLS certificate with TEE attestation
```

## Validation Rules

### Orderflow Sharing Validation

```python
def is_valid_orderflow_share_request(request: OrderflowShareRequest) -> boolean:
    """
    Validate an orderflow sharing request.
    """
    if request.timestamp > get_current_time():
        return False
    
    if request.timestamp < get_current_time() - 300:  # 5 minutes ago
        return False
    
    if len(request.orderflow) == 0:
        return False
    
    # Validate all orderflow entries
    for entry in request.orderflow:
        if not is_valid_orderflow_entry(entry):
            return False
    
    # TODO: Verify node signature
    # TODO: Verify source node is authorized
    
    return True
```

```python
def is_valid_orderflow_entry(entry: OrderflowEntry) -> boolean:
    """
    Validate an orderflow entry.
    """
    if entry.gas_price == 0:
        return False
    
    if entry.gas_limit == 0:
        return False
    
    if entry.timestamp > get_current_time():
        return False
    
    # Check source is valid for P2P sharing
    if entry.source not in ["peer", "flashbots"]:
        return False
    
    return True
```

### TEE Attestation Validation

```python
def is_valid_tee_attestation(response: TeeAttestationResponse) -> boolean:
    """
    Validate TEE attestation response.
    """
    if response.timestamp > get_current_time():
        return False
    
    if len(response.tls_certificate) == 0:
        return False
    
    if len(response.tee_attestation) == 0:
        return False
    
    # TODO: Verify TEE attestation signature
    # TODO: Validate TLS certificate against attestation
    
    return True
```

### Peer Validation

```python
def is_valid_peer(peer: PeerInfo) -> boolean:
    """
    Validate peer information.
    """
    if peer.timestamp > get_current_time():
        return False
    
    if len(peer.tls_certificate) == 0:
        return False
    
    if len(peer.tee_attestation) == 0:
        return False
    
    # TODO: Verify peer TEE attestation
    # TODO: Validate peer TLS certificate
    
    return True
```

## Notes

1. **TEE Confidentiality**: All sensitive orderflow data remains within TEE instances and is never exposed to operators.

2. **TLS Certificates**: Each BuilderNet node generates its own TLS certificate for secure communication.

3. **Attested Communication**: The aTLS protocol provides verifiable TEE attestation for certificate validation.

4. **Flashbots Integration**: BuilderHub provides centralized coordination while maintaining decentralization through TEE-based execution.

5. **Node-to-Node Only**: This interface is specifically for communication between BuilderNet nodes, not for end-user interactions.

6. **TODO**: Implement complete TEE attestation verification logic.

7. **TODO**: Add support for different TEE types (SGX, TDX, etc.).

8. **TODO**: Implement proper node signature verification.

9. **TODO**: Add support for different orderflow sources and their specific validation rules.

10. **TODO**: Implement proper error handling and retry mechanisms for network failures. 