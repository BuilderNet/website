# BuilderNet Protocol State

## Table of contents

<!-- TOC -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Data Structures](#data-structures)
- [State Transitions](#state-transitions)
- [Validation Rules](#validation-rules)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This document defines the persistent state maintained by BuilderNet nodes. BuilderNet is a decentralized block building network where nodes run in Trusted Execution Environments (TEEs), share orderflow confidentially, and coordinate through Flashbots infrastructure.

## Configuration

### Constants

| Name | Value | Unit |
|------|-------|------|
| `SLOTS_PER_EPOCH` | `32` | slots |
| `SECONDS_PER_SLOT` | `12` | seconds |
| `MAX_ORDERFLOW_ENTRIES` | `10000` | entries |
| `REFUND_WALLET_ADDRESS` | `0x62A29205f7Ff00F4233d9779c210150787638E7f` | address |

### Timeouts

| Name | Value | Unit |
|------|-------|------|
| `ORDERFLOW_TIMEOUT` | `60` | seconds |
| `BIDDING_TIMEOUT` | `10` | seconds |
| `BUILDERHUB_TIMEOUT` | `30` | seconds |

## Data Structures

### Basic Types

```python
# Slot number (uint64)
Slot = uint64

# Block number (uint64)
BlockNumber = uint64

# Block hash (Bytes32)
BlockHash = Bytes32

# Node identifier (Bytes32)
NodeId = Bytes32

# Transaction hash (Bytes32)
TxHash = Bytes32

# MEV value in wei (uint256)
MevValue = uint256

# Gas price in wei (uint256)
GasPrice = uint256

# TEE attestation data (Bytes)
TeeAttestation = Bytes

# TLS certificate (Bytes)
TlsCertificate = Bytes
```

### Orderflow Types

```python
@dataclass
class OrderflowEntry:
    tx_hash: TxHash
    gas_price: GasPrice
    gas_limit: uint64
    sender: Address
    recipient: Address
    value: uint256
    data: Bytes
    timestamp: uint64
    source: OrderflowSource  # "user", "searcher", "flashbots", "peer"
    bundle_id: Optional[Bytes32]  # For bundle transactions
```

```python
@dataclass
class Bundle:
    transactions: List[OrderflowEntry]
    bundle_hash: Bytes32
    target_block: BlockNumber
    min_timestamp: uint64
    max_timestamp: uint64
    refund_recipient: Address
    signer: Address
```

### Refund Types

```python
@dataclass
class RefundEntry:
    recipient: Address
    amount: uint256
    transaction_hash: TxHash
    block_number: BlockNumber
    contribution: uint256  # Marginal contribution to block value
    timestamp: uint64
    status: RefundStatus  # "PENDING", "PROCESSED", "FAILED"
```

```python
class RefundStatus(Enum):
    PENDING = 0
    PROCESSED = 1
    FAILED = 2
```

### Network Types

```python
@dataclass
class PeerInfo:
    node_id: NodeId
    address: str  # IP:port
    tls_certificate: TlsCertificate
    tee_attestation: TeeAttestation
    last_seen: uint64
    is_connected: boolean
    orderflow_count: uint64
    blocks_produced: uint64
```

```python
@dataclass
class BuilderHubConfig:
    builder_hub_url: str
    redistribution_archive_url: str
    peer_discovery_url: str
    identity_management_url: str
    secrets_endpoint: str
    configuration_endpoint: str
```

## State Transitions

### BuilderNodeState

```python
@dataclass
class BuilderNodeState:
    # Current slot and block information
    current_slot: Slot
    head_block: BlockHash
    head_block_number: BlockNumber
    
    # Network peers (other BuilderNet nodes)
    peers: List[PeerInfo]
    
    # Orderflow management
    pending_orderflow: List[OrderflowEntry]
    processed_orderflow: List[OrderflowEntry]
    orderflow_timeout: uint64
    
    # Block building state
    current_building_block: Optional[BlockNumber]
    building_orderflow: List[OrderflowEntry]
    
    # Refund tracking
    pending_refunds: List[RefundEntry]
    processed_refunds: List[RefundEntry]
    
    # Node identity and configuration
    node_id: NodeId
    operator_address: Address
    tee_attestation: TeeAttestation
    tls_certificate: TlsCertificate
    
    # Flashbots infrastructure configuration
    builder_hub_config: BuilderHubConfig
    
    # Statistics
    total_blocks_produced: uint64
    total_mev_captured: MevValue
    total_refunds_distributed: MevValue
    
    # Timestamps
    last_update: uint64
    startup_time: uint64
```

### State Update Functions

```python
def update_slot(state: BuilderNodeState, new_slot: Slot) -> None:
    """
    Update the current slot and perform slot-based state transitions.
    """
    if new_slot > state.current_slot:
        state.current_slot = new_slot
        state.last_update = get_current_time()
        
        # Clear expired orderflow
        current_time = get_current_time()
        state.pending_orderflow = [
            entry for entry in state.pending_orderflow
            if current_time - entry.timestamp < state.orderflow_timeout
        ]
```

```python
def add_orderflow(state: BuilderNodeState, entry: OrderflowEntry) -> None:
    """
    Add new orderflow to the pending queue.
    """
    if len(state.pending_orderflow) < MAX_ORDERFLOW_ENTRIES:
        state.pending_orderflow.append(entry)
    else:
        # Remove oldest entry if at capacity
        state.pending_orderflow.pop(0)
        state.pending_orderflow.append(entry)
```

```python
def share_orderflow_with_peers(state: BuilderNodeState, orderflow: List[OrderflowEntry]) -> None:
    """
    Share orderflow with other BuilderNet nodes.
    """
    # Orderflow is shared confidentially with other TEE instances
    # via port 5544 using locally generated TLS certificates
    for peer in state.peers:
        if peer.is_connected:
            # TODO: Implement confidential orderflow sharing
            pass
```

```python
def record_block_production(state: BuilderNodeState, block_hash: BlockHash,
                           block_number: BlockNumber, mev_value: MevValue) -> None:
    """
    Record successful block production and update statistics.
    """
    state.head_block = block_hash
    state.head_block_number = block_number
    state.total_blocks_produced += 1
    state.total_mev_captured += mev_value
    state.last_update = get_current_time()
```

```python
def calculate_refunds(state: BuilderNodeState, block_transactions: List[OrderflowEntry], 
                     total_mev: MevValue, proposer_payment: MevValue) -> List[RefundEntry]:
    """
    Calculate refunds using the Flat Tax Rule.
    """
    refunds = []
    remainder = total_mev - proposer_payment
    
    if remainder <= 0:
        return refunds
    
    # Group transactions by signer identity
    signer_groups = group_transactions_by_signer(block_transactions)
    
    for signer, transactions in signer_groups.items():
        # Calculate marginal contribution
        contribution = calculate_marginal_contribution(transactions, block_transactions, total_mev)
        
        # Calculate refund using Flat Tax Rule
        refund_amount = calculate_flat_tax_refund(contribution, remainder, signer_groups)
        
        if refund_amount > 0:
            refund_entry = RefundEntry(
                recipient=signer,
                amount=refund_amount,
                transaction_hash=b"",  # Will be set when processed
                block_number=state.head_block_number,
                contribution=contribution,
                timestamp=get_current_time(),
                status=RefundStatus.PENDING
            )
            refunds.append(refund_entry)
    
    return refunds
```

## Validation Rules

### State Validation

```python
def is_valid_state(state: BuilderNodeState) -> boolean:
    """
    Validate the BuilderNodeState structure and invariants.
    """
    # Check basic type constraints
    if state.current_slot < 0:
        return False
    
    if len(state.pending_orderflow) > MAX_ORDERFLOW_ENTRIES:
        return False
    
    # Check timestamp consistency
    current_time = get_current_time()
    if state.last_update > current_time:
        return False
    
    if state.startup_time > current_time:
        return False
    
    # Check refund wallet address
    if state.builder_hub_config is None:
        return False
    
    return True
```

### Orderflow Validation

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
    
    # Check source is valid
    if entry.source not in ["user", "searcher", "flashbots", "peer"]:
        return False
    
    return True
```

### Refund Validation

```python
def is_valid_refund(refund: RefundEntry) -> boolean:
    """
    Validate a refund entry.
    """
    if refund.amount == 0:
        return False
    
    if refund.block_number == 0:
        return False
    
    if refund.timestamp > get_current_time():
        return False
    
    if refund.status not in [RefundStatus.PENDING, RefundStatus.PROCESSED, RefundStatus.FAILED]:
        return False
    
    return True
```

## Notes

1. **TEE Integration**: All sensitive operations are performed within TEE instances, with orderflow remaining confidential.

2. **Orderflow Sharing**: Orderflow is shared between BuilderNet nodes via port 5544 using locally generated TLS certificates.

3. **Flashbots Infrastructure**: BuilderHub provides secrets, configuration, peer discovery, and identity management.

4. **Refund Mechanism**: Uses the Flat Tax Rule to calculate refunds based on marginal contributions to block value.

5. **Refund Wallet**: All refunds are sent from the official BuilderNet refund wallet address.

6. **TLS Certificates**: Each node generates its own TLS certificate for secure communication.

7. **TODO**: Implement the complete Flat Tax Rule calculation with identity constraints.

8. **TODO**: Add support for bundle-specific refund calculations.

9. **TODO**: Implement proper TEE attestation verification.

10. **TODO**: Add support for different orderflow sources and their specific handling. 