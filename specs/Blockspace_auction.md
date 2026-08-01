# BuilderNet Blockspace Auction

## Table of contents

<!-- TOC -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Data Structures](#data-structures)
- [MEV-Boost Integration](#mev-boost-integration)
- [Bidding Process](#bidding-process)
- [Block Production](#block-production)
- [Refund Distribution](#refund-distribution)
- [Validation Rules](#validation-rules)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This document defines the blockspace auction mechanism used by BuilderNet. BuilderNet participates in the MEV-Boost auction system, competing with other block builders to win block production rights. The system uses the Flat Tax Rule to calculate refunds and distribute MEV value back to orderflow providers.

## Configuration

### Constants

| Name | Value | Unit |
|------|-------|------|
| `MEV_BOOST_RELAY_TIMEOUT` | `8` | seconds |
| `BIDDING_TIMEOUT` | `10` | seconds |
| `REFUND_PROCESSING_DELAY` | `5` | seconds |
| `REFUND_WALLET_ADDRESS` | `0x62A29205f7Ff00F4233d9779c210150787638E7f` | address |

### Timeouts

| Name | Value | Unit |
|------|-------|------|
| `BID_SUBMISSION_TIMEOUT` | `8` | seconds |
| `BLOCK_PRODUCTION_TIMEOUT` | `12` | seconds |
| `REFUND_DISTRIBUTION_TIMEOUT` | `60` | seconds |

## Data Structures

### Basic Types

```python
# Block number (uint64)
BlockNumber = uint64

# MEV value in wei (uint256)
MevValue = uint256

# Gas price in wei (uint256)
GasPrice = uint256

# Timestamp (uint64)
Timestamp = uint64

# Address (Bytes20)
Address = Bytes20

# Transaction hash (Bytes32)
TxHash = Bytes32

# Bundle hash (Bytes32)
BundleHash = Bytes32
```

### MEV-Boost Types

```python
@dataclass
class MevBoostBid:
    block_number: BlockNumber
    bid_value: MevValue
    block_hash: BlockHash
    extra_data: Bytes
    timestamp: Timestamp
    relay_url: str
```

```python
@dataclass
class MevBoostResponse:
    success: boolean
    block_hash: Optional[BlockHash]
    error: Optional[str]
    timestamp: Timestamp
```

### Block Building Types

```python
@dataclass
class BlockCandidate:
    block_number: BlockNumber
    transactions: List[OrderflowEntry]
    mev_value: MevValue
    proposer_payment: MevValue
    remainder: MevValue  # mev_value - proposer_payment
    timestamp: Timestamp
    builder: NodeId
```

```python
@dataclass
class BlockSubmission:
    block_number: BlockNumber
    block_hash: BlockHash
    transactions: List[OrderflowEntry]
    mev_value: MevValue
    proposer_payment: MevValue
    extra_data: Bytes
    timestamp: Timestamp
    relay_url: str
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
    timestamp: Timestamp
    status: RefundStatus  # "PENDING", "PROCESSED", "FAILED"
```

```python
class RefundStatus(Enum):
    PENDING = 0
    PROCESSED = 1
    FAILED = 2
```

### Flat Tax Rule Types

```python
@dataclass
class IdentityGroup:
    signer: Address
    transactions: List[OrderflowEntry]
    total_payment: uint256
    marginal_contribution: uint256
```

```python
@dataclass
class FlatTaxCalculation:
    total_value: MevValue
    proposer_payment: MevValue
    remainder: MevValue
    identity_groups: List[IdentityGroup]
    refunds: List[RefundEntry]
```

## MEV-Boost Integration

### Relay Selection

BuilderNet prioritizes relays that are fast, independent, and reliable. The system supports multiple relays for redundancy and competition.

```python
def select_relay(block_number: BlockNumber) -> str:
    """
    Select the best relay for block submission.
    """
    # TODO: Implement relay selection logic
    # Consider factors like:
    # - Relay performance and reliability
    # - Geographic proximity
    # - Historical success rate
    # - Fee structure
    
    return "https://relay.example.com"
```

### Bid Submission

```python
def submit_bid_to_relay(block_candidate: BlockCandidate, relay_url: str) -> MevBoostResponse:
    """
    Submit a bid to an MEV-Boost relay.
    """
    # Calculate bid value (proposer payment)
    bid_value = block_candidate.proposer_payment
    
    # Create bid
    bid = MevBoostBid(
        block_number=block_candidate.block_number,
        bid_value=bid_value,
        block_hash=calculate_block_hash(block_candidate),
        extra_data=b"BuilderNet",
        timestamp=get_current_time(),
        relay_url=relay_url
    )
    
    # Submit to relay
    response = submit_to_relay(relay_url, bid)
    return response
```

## Bidding Process

### Block Candidate Creation

```python
def create_block_candidate(node: BuilderNode, block_number: BlockNumber) -> Optional[BlockCandidate]:
    """
    Create a block candidate for bidding.
    """
    # Get orderflow for this block
    orderflow = get_orderflow_for_block(node.state, block_number)
    
    if not orderflow:
        return None
    
    # Build block using rbuilder
    block = node.rbuilder.build_block(block_number, orderflow)
    if not block:
        return None
    
    # Calculate MEV and proposer payment
    mev_value = block.mev_value
    proposer_payment = calculate_proposer_payment(mev_value)
    remainder = mev_value - proposer_payment
    
    candidate = BlockCandidate(
        block_number=block_number,
        transactions=block.transactions,
        mev_value=mev_value,
        proposer_payment=proposer_payment,
        remainder=remainder,
        timestamp=get_current_time(),
        builder=node.state.node_id
    )
    
    return candidate
```

### Bidding Strategy

```python
def calculate_proposer_payment(mev_value: MevValue) -> MevValue:
    """
    Calculate the payment to the proposer (bid value).
    """
    # BuilderNet competes in the MEV-Boost auction
    # The goal is to minimize the bid while still winning
    # This allows more value to be refunded to users
    
    # TODO: Implement sophisticated bidding strategy
    # Consider factors like:
    # - Market conditions
    # - Competition from other builders
    # - Historical bid patterns
    # - Network congestion
    
    # For now, use a simple strategy
    if mev_value > 0:
        # Bid 80% of MEV value, keeping 20% for refunds
        return mev_value * 8 // 10
    else:
        return 0
```

### Block Production

```python
def produce_block(node: BuilderNode, slot: Slot) -> Optional[BlockSubmission]:
    """
    Produce and submit a block for the current slot.
    """
    block_number = slot_to_block_number(slot)
    
    # Create block candidate
    candidate = create_block_candidate(node, block_number)
    if not candidate:
        return None
    
    # Select relay
    relay_url = select_relay(block_number)
    
    # Submit bid
    response = submit_bid_to_relay(candidate, relay_url)
    if not response.success:
        return None
    
    # Create block submission
    submission = BlockSubmission(
        block_number=block_number,
        block_hash=response.block_hash,
        transactions=candidate.transactions,
        mev_value=candidate.mev_value,
        proposer_payment=candidate.proposer_payment,
        extra_data=b"BuilderNet",
        timestamp=get_current_time(),
        relay_url=relay_url
    )
    
    # Record block production
    record_block_production(node.state, submission.block_hash, 
                           submission.block_number, submission.mev_value)
    
    return submission
```

## Block Production

### Block Building Process

```python
def build_block_with_rbuilder(node: BuilderNode, block_number: BlockNumber, 
                             orderflow: List[OrderflowEntry]) -> Optional[Block]:
    """
    Build a block using the rbuilder software.
    """
    # rbuilder handles the core block building logic
    # It implements the Flat Tax Rule for refund calculations
    # and optimizes transaction ordering for maximum MEV
    
    block = node.rbuilder.build_block(block_number, orderflow)
    return block
```

### MEV Calculation

```python
def calculate_block_mev(transactions: List[OrderflowEntry]) -> MevValue:
    """
    Calculate the MEV value of a block.
    """
    # MEV includes:
    # - Gas fees from transactions
    # - Value transfers
    # - Arbitrage opportunities
    # - Liquidations
    # - Sandwich attacks (if applicable)
    
    total_mev = 0
    
    for tx in transactions:
        # Calculate gas fees
        gas_fees = tx.gas_price * tx.gas_limit
        
        # Calculate value transfer
        value_transfer = tx.value
        
        # Add to total MEV
        total_mev += gas_fees + value_transfer
    
    return total_mev
```

## Refund Distribution

### Flat Tax Rule Implementation

```python
def calculate_refunds_flat_tax(block_candidate: BlockCandidate) -> List[RefundEntry]:
    """
    Calculate refunds using the Flat Tax Rule.
    """
    # Group transactions by signer identity
    identity_groups = group_transactions_by_signer(block_candidate.transactions)
    
    # Calculate marginal contributions
    for group in identity_groups:
        group.marginal_contribution = calculate_marginal_contribution(
            group.transactions, block_candidate.transactions, block_candidate.mev_value
        )
    
    # Apply Flat Tax Rule
    refunds = apply_flat_tax_rule(identity_groups, block_candidate.remainder)
    
    return refunds
```

```python
def calculate_marginal_contribution(transactions: List[OrderflowEntry], 
                                   all_transactions: List[OrderflowEntry],
                                   total_value: MevValue) -> uint256:
    """
    Calculate the marginal contribution of a set of transactions.
    """
    # Calculate value with these transactions
    value_with = calculate_block_mev(all_transactions)
    
    # Calculate value without these transactions
    transactions_without = [tx for tx in all_transactions if tx not in transactions]
    value_without = calculate_block_mev(transactions_without)
    
    # Marginal contribution is the difference
    marginal_contribution = value_with - value_without
    
    # Bound by total payment to prevent negative net payment
    total_payment = sum(tx.gas_price * tx.gas_limit + tx.value for tx in transactions)
    marginal_contribution = min(marginal_contribution, total_payment)
    
    return marginal_contribution
```

```python
def apply_flat_tax_rule(identity_groups: List[IdentityGroup], 
                        remainder: MevValue) -> List[RefundEntry]:
    """
    Apply the Flat Tax Rule to calculate refunds.
    """
    refunds = []
    
    # Calculate total marginal contribution
    total_marginal = sum(group.marginal_contribution for group in identity_groups)
    
    if total_marginal == 0:
        return refunds
    
    # Calculate refunds proportionally
    for group in identity_groups:
        if group.marginal_contribution > 0:
            refund_amount = (group.marginal_contribution * remainder) // total_marginal
            
            refund_entry = RefundEntry(
                recipient=group.signer,
                amount=refund_amount,
                transaction_hash=b"",  # Will be set when processed
                block_number=0,  # Will be set
                contribution=group.marginal_contribution,
                timestamp=get_current_time(),
                status=RefundStatus.PENDING
            )
            
            refunds.append(refund_entry)
    
    return refunds
```

### Identity Constraint

```python
def apply_identity_constraint(refunds: List[RefundEntry], 
                             identity_groups: List[IdentityGroup]) -> List[RefundEntry]:
    """
    Apply the identity constraint to prevent gaming.
    """
    # The identity constraint ensures that no set of identities
    # can receive more refunds than their joint marginal contribution
    
    # TODO: Implement the identity constraint optimization
    # This involves solving a constrained optimization problem
    
    return refunds
```

### Refund Processing

```python
def process_refunds(node: BuilderNode, refunds: List[RefundEntry]) -> None:
    """
    Process refunds and send them to recipients.
    """
    for refund in refunds:
        if refund.status == RefundStatus.PENDING:
            # Send refund transaction from BuilderNet refund wallet
            success = send_refund_transaction(node, refund)
            
            if success:
                refund.status = RefundStatus.PROCESSED
                refund.transaction_hash = get_refund_tx_hash(refund)
            else:
                refund.status = RefundStatus.FAILED
            
            # Update state
            node.state.pending_refunds.append(refund)
```

```python
def send_refund_transaction(node: BuilderNode, refund: RefundEntry) -> boolean:
    """
    Send a refund transaction from the BuilderNet refund wallet.
    """
    # Refunds are sent from the official BuilderNet refund wallet
    # Address: 0x62A29205f7Ff00F4233d9779c210150787638E7f
    
    # TODO: Implement refund transaction creation and submission
    # This involves:
    # 1. Creating a transaction to send refund to recipient
    # 2. Signing with refund wallet private key
    # 3. Submitting to the network
    # 4. Waiting for confirmation
    
    return True
```

## Validation Rules

### Block Candidate Validation

```python
def is_valid_block_candidate(candidate: BlockCandidate) -> boolean:
    """
    Validate a block candidate.
    """
    if candidate.block_number == 0:
        return False
    
    if len(candidate.transactions) == 0:
        return False
    
    if candidate.mev_value < 0:
        return False
    
    if candidate.proposer_payment > candidate.mev_value:
        return False
    
    if candidate.remainder != candidate.mev_value - candidate.proposer_payment:
        return False
    
    if candidate.timestamp > get_current_time():
        return False
    
    return True
```

### MEV-Boost Bid Validation

```python
def is_valid_mev_boost_bid(bid: MevBoostBid) -> boolean:
    """
    Validate an MEV-Boost bid.
    """
    if bid.bid_value == 0:
        return False
    
    if bid.block_number == 0:
        return False
    
    if bid.timestamp > get_current_time():
        return False
    
    if not is_valid_block_hash(bid.block_hash):
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

1. **MEV-Boost Integration**: BuilderNet participates in the existing MEV-Boost auction system.

2. **Flat Tax Rule**: Refunds are calculated using the Flat Tax Rule implemented in rbuilder.

3. **Refund Wallet**: All refunds are sent from the official BuilderNet refund wallet address.

4. **Bidding Strategy**: BuilderNet aims to minimize bids while still winning auctions to maximize refunds.

5. **Identity Constraint**: The system prevents gaming by constraining refunds based on joint marginal contributions.

6. **TODO**: Implement sophisticated bidding strategies based on market conditions.

7. **TODO**: Add support for multiple relay selection and redundancy.

8. **TODO**: Implement the complete identity constraint optimization.

9. **TODO**: Add support for different MEV extraction strategies.

10. **TODO**: Implement proper refund transaction creation and submission. 