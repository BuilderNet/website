# BuilderNet Node

## Table of contents

<!-- TOC -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
- [Configuration](#configuration)
- [Data Structures](#data-structures)
- [Node Architecture](#node-architecture)
- [Core Functions](#core-functions)
- [Orderflow Processing](#orderflow-processing)
- [Protocol Synchronization](#protocol-synchronization)
- [Block Building](#block-building)
- [Refund Processing](#refund-processing)
- [Operation](#operation)
- [Validation Rules](#validation-rules)
- [Notes](#notes)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This document defines the behavior and lifecycle of a BuilderNet node. BuilderNet nodes run in Trusted Execution Environments (TEEs), process orderflow confidentially, build blocks using the rbuilder software, and coordinate through Flashbots infrastructure.

A BuilderNet node is a decentralized block builder that participates in Ethereum's MEV-Boost auction system. Unlike traditional centralized builders, BuilderNet nodes operate in TEEs to ensure orderflow confidentiality and system integrity. Nodes share orderflow with each other on a best-effort basis and use the Flat Tax Rule to distribute MEV back to users.

## Configuration

### Constants

| Name | Value | Unit |
|------|-------|------|
| `MAX_ORDERFLOW_ENTRIES` | `10000` | entries |
| `REFUND_WALLET_ADDRESS` | `0x62A29205f7Ff00F4233d9779c210150787638E7f` | address |
| `ORDERFLOW_TIMEOUT_SECONDS` | `60` | seconds |
| `MAX_BUNDLE_SIZE` | `100` | transactions |
| `MAX_TRANSACTION_SIZE` | `128` | KB |

### Timeouts

| Name | Value | Unit |
|------|-------|------|
| `STARTUP_TIMEOUT` | `60` | seconds |
| `SHUTDOWN_TIMEOUT` | `30` | seconds |
| `ORDERFLOW_TIMEOUT` | `60` | seconds |
| `BUILDERHUB_TIMEOUT` | `30` | seconds |
| `OPERATOR_API_TIMEOUT` | `10` | seconds |
| `LOG_DELAY_SECONDS` | `300` | seconds |

## Data Structures

### Node Components

```python
@dataclass
class BuilderNode:
    # Core state
    state: BuilderNodeState
    genesis: BuilderNetGenesis
    network_config: NetworkConfig
    operator_config: OperatorConfig
    
    # TEE environment
    tee_interface: TEEInterface
    tls_certificate: TlsCertificate
    
    # Network services
    orderflow_proxy: OrderflowProxy
    haproxy: HAProxy
    cvm_proxy: CvmProxy
    
    # Block building
    rbuilder: RBuilder
    bidding_service: BiddingService
    
    # Consensus and execution
    consensus_client: ConsensusClient
    execution_client: ExecutionClient
    
    # External interfaces
    builder_hub: BuilderHub
    relay_interface: RelayInterface
    
    # Operator management
    operator_api: OperatorAPI
    
    # Lifecycle state
    is_running: boolean
    startup_time: uint64
    last_health_check: uint64
```

### BuilderNet Genesis

The BuilderNet Genesis object contains the foundational configuration and measurements that define the BuilderNet network. This object is created during network initialization and contains immutable network parameters that all nodes must participate in.

**TEE Measurements**
The genesis object stores the expected TEE measurements for all BuilderNet nodes. These measurements include the expected code hash, configuration hash, and other security parameters that must match for a node to be considered valid.

**Block Data Parameters**
Network-wide block building parameters are defined in the genesis object. This includes target block times, maximum block sizes, and other consensus parameters that all nodes must follow.

**Flashbots Infrastructure**
The genesis object contains the addresses and configuration for Flashbots infrastructure components including BuilderHub, the redistribution archive, and other network services.

**Supported Relays**
The genesis object defines the list of MEV-Boost relays that all BuilderNet nodes must support and subscribe to. This ensures consistent relay participation across the network.

**Network Identifiers**
Unique network identifiers and version information are stored in the genesis object to ensure all nodes are operating on the same network version.

### Network Configuration

Network configuration contains settings that all BuilderNet nodes must participate in and maintain the same values. These are mandatory network-wide parameters that ensure consistent behavior across all nodes.

**TEE Environment Configuration**
The network configuration specifies the TEE type (TDX, SGX, etc.) and the attestation provider to use for TEE verification. This determines how the node proves its secure execution environment.

**Block Building Parameters**
Network-wide block building configuration includes target block times and maximum block sizes. These parameters are set at the network level and all nodes must follow them.

**Relay Subscription Settings**
Network configuration defines the relay subscription parameters including subscription timeouts, retry mechanisms, and connection limits that all nodes must use when connecting to supported relays.

**Logging and Monitoring**
Network-wide logging levels and metrics collection settings that ensure consistent operational data across all nodes.

### Operator Configuration

Operator configuration contains optional settings that operators can choose to enable or configure based on their preferences. These settings do not affect network consensus but allow operators to customize their node behavior.

**Operator Identity**
The operator configuration contains the operator's address and associated credentials. This information is used for authentication and authorization in the Operator API.

**Block Filtering Preferences**
Operators can configure address blocklists, transaction type filters, and other content-based filtering rules. These settings allow operators to opt out of processing certain types of transactions or blocks.

**Management Settings**
Operator-specific settings include API access controls, notification preferences, and other management-related configurations.

**Security Parameters**
Operator security settings include authentication methods, access restrictions, and audit logging preferences.

**Performance Tuning**
Operators can configure performance-related settings such as connection pool sizes, timeout values, and resource allocation limits within network-defined bounds.

### Network Parameter Updates

Network parameter updates allow the BuilderNet network to evolve and adapt to changing requirements. These updates are coordinated across all nodes to ensure network-wide consistency.

**Update Authority**
Network parameter updates are authorized by the BuilderNet governance process. This process involves community discussion, proposal submission, and voting by network participants. The governance mechanism ensures that changes are transparent and reflect the network's collective interests.

**Update Types**
Network parameters can be updated in several categories:
- **Genesis Parameters**: Core network parameters including TEE measurements, supported relays, and network identifiers
- **Configuration Parameters**: Network-wide settings such as block building parameters, relay subscription settings, and logging levels
- **Security Parameters**: TEE configuration, attestation providers, and security-related settings

**Update Process**
The network parameter update process follows these steps:
1. **Proposal Phase**: A proposal is submitted through the governance process with detailed justification and impact analysis
2. **Discussion Phase**: The proposal is discussed by the community with technical review and feedback
3. **Voting Phase**: Network participants vote on the proposal with appropriate quorum requirements
4. **Implementation Phase**: If approved, the update is implemented across all nodes with a coordinated rollout schedule
5. **Activation Phase**: The new parameters are activated at a predetermined block height or timestamp

**Update Coordination**
All nodes must apply network parameter updates simultaneously to maintain network consistency. The update process includes:
- **Notification Period**: Nodes are notified of upcoming updates with sufficient advance notice
- **Compatibility Checks**: Updates are validated to ensure compatibility with existing node software
- **Rollback Procedures**: Emergency rollback procedures are available if issues arise during activation
- **Monitoring**: Network-wide monitoring ensures all nodes successfully apply the updates

**Update Validation**
Before activation, network parameter updates undergo rigorous validation:
- **Technical Review**: Updates are reviewed for technical correctness and security implications
- **Compatibility Testing**: Updates are tested in staging environments to ensure compatibility
- **Security Audit**: Security implications are assessed, especially for TEE-related changes
- **Performance Impact**: Performance implications are evaluated to ensure network stability

**Emergency Updates**
In critical situations, emergency network parameter updates may be implemented:
- **Security Vulnerabilities**: Immediate updates to address security issues
- **Network Stability**: Updates to resolve network-wide stability problems
- **Critical Bugs**: Fixes for bugs that affect network functionality
- **Governance Override**: Emergency procedures that bypass normal governance for critical issues

**Update Communication**
Network parameter updates are communicated through multiple channels:
- **Official Announcements**: Updates are announced through official BuilderNet channels
- **Technical Documentation**: Detailed technical documentation accompanies each update
- **Operator Notifications**: Node operators receive direct notifications of required updates
- **Community Forums**: Updates are discussed in community forums with technical details

**Update Compliance**
All nodes must comply with network parameter updates to maintain network participation:
- **Mandatory Updates**: Critical updates that all nodes must apply to continue participating
- **Grace Period**: A grace period is provided for operators to apply non-critical updates
- **Compliance Monitoring**: Network monitoring ensures all nodes are running updated parameters
- **Enforcement**: Non-compliant nodes may be excluded from network participation until updates are applied

### Service Components

```python
@dataclass
class OrderflowProxy:
    system_endpoint: str  # Port 5542
    user_endpoint: str    # Port 5543
    rbuilder_endpoint: str  # Port 8645
    
    def process_orderflow(self, orderflow: List[OrderflowEntry]) -> boolean:
        """
        Process incoming orderflow and forward to rbuilder.
        """
        # Validate orderflow
        for entry in orderflow:
            if not is_valid_orderflow_entry(entry):
                return False
        
        # Forward to rbuilder via JSON-RPC
        success = self.forward_to_rbuilder(orderflow)
        return success
    
    def forward_to_rbuilder(self, orderflow: List[OrderflowEntry]) -> boolean:
        """
        Forward orderflow to rbuilder via JSON-RPC on port 8645.
        """
        # TODO: Implement JSON-RPC communication with rbuilder
        return True
```

```python
@dataclass
class RBuilder:
    json_rpc_endpoint: str  # Port 8645
    prometheus_endpoint: str  # Port 6069
    health_endpoint: str  # Port 6070
    
    def build_block(self, block_number: BlockNumber, 
                   orderflow: List[OrderflowEntry]) -> Optional[Block]:
        """
        Build a block using the rbuilder software.
        """
        # rbuilder implements the Flat Tax Rule for refunds
        # and handles block building logic
        # TODO: Implement block building via rbuilder JSON-RPC
        return None
    
    def calculate_refunds(self, block_transactions: List[OrderflowEntry],
                         total_mev: MevValue, proposer_payment: MevValue) -> List[RefundEntry]:
        """
        Calculate refunds using the Flat Tax Rule implemented in rbuilder.
        """
        # TODO: Implement refund calculation via rbuilder
        return []
```

```python
@dataclass
class BiddingService:
    endpoint: str  # Port 6148
    supported_relays: List[str]  # From genesis
    relay_subscriptions: Dict[str, RelaySubscription]
    subscription_timeout: uint64
    
    def subscribe_to_relays(self, relay_list: List[str]) -> boolean:
        """
        Subscribe to all supported relays from genesis.
        """
        # TODO: Implement relay subscription logic
        return True
    
    def submit_bid(self, block_number: BlockNumber, bid_value: MevValue,
                   block_hash: BlockHash) -> boolean:
        """
        Submit a bid for block production to all subscribed relays.
        """
        # TODO: Implement bidding logic
        return True
```

```python
@dataclass
class ConsensusClient:
    rest_api_endpoint: str  # Port 3500
    p2p_endpoint: str       # Port 9000
    
    def get_current_slot(self) -> Slot:
        """
        Get the current consensus slot.
        """
        # TODO: Implement slot tracking
        return 0
    
    def get_block_proposer(self, slot: Slot) -> Address:
        """
        Get the proposer for a given slot.
        """
        # TODO: Implement proposer lookup
        return Address()
    
    def submit_block(self, block: Block) -> boolean:
        """
        Submit a block to the consensus layer.
        """
        # TODO: Implement block submission
        return True
```

```python
@dataclass
class ExecutionClient:
    json_rpc_endpoint: str  # Port 8545
    websocket_endpoint: str # Port 8546
    engine_api_endpoint: str # Port 8551
    metrics_endpoint: str   # Port 9001
    
    def get_block_by_number(self, block_number: BlockNumber) -> Optional[Block]:
        """
        Get block information by block number.
        """
        # TODO: Implement block retrieval
        return None
    
    def get_account_balance(self, address: Address) -> uint256:
        """
        Get account balance.
        """
        # TODO: Implement balance lookup
        return 0
    
    def estimate_gas(self, transaction: OrderflowEntry) -> uint64:
        """
        Estimate gas for a transaction.
        """
        # TODO: Implement gas estimation
        return 0
```

### Operator API Types

```python
@dataclass
class OperatorAPI:
    listen_address: str  # Port 3535
    basic_auth_secret: Optional[str]
    tls_enabled: boolean
    tls_cert_path: str
    tls_key_path: str
    
    def set_basic_auth(self, secret: str) -> boolean:
        """
        Set the basic authentication secret.
        """
        self.basic_auth_secret = secret
        return True
    
    def get_logs(self) -> str:
        """
        Get system logs.
        """
        # TODO: Implement log retrieval
        return ""
    
    def health_check(self) -> boolean:
        """
        Perform health check.
        """
        # TODO: Implement health check
        return True
    
    def restart_service(self, service_name: str) -> boolean:
        """
        Restart a specific service.
        """
        # TODO: Implement service restart
        return True
    
    def upload_file(self, file_type: str, file_data: Bytes) -> boolean:
        """
        Upload a configuration file.
        """
        # TODO: Implement file upload
        return True
```

```python
@dataclass
class OperatorApiRequest:
    endpoint: str
    method: str  # "GET", "POST", "PUT"
    data: Optional[Bytes]
    basic_auth: str
    timestamp: Timestamp
```

```python
@dataclass
class OperatorApiResponse:
    success: boolean
    data: Optional[Bytes]
    error: Optional[str]
    timestamp: Timestamp
```

## Node Architecture

### TEE Environment

BuilderNet nodes run entirely within Trusted Execution Environments (TEEs), providing:

1. **Confidentiality**: Orderflow data never leaves the TEE
2. **Integrity**: Code and configuration are verifiable through attestation
3. **Isolation**: Operators cannot access sensitive data

### Service Architecture

The node consists of several services running within the TEE:

1. **orderflow-proxy**: Handles incoming orderflow on ports 5542/5543
2. **rbuilder**: Core block building software with refund logic
3. **bidding-service**: Coordinates bidding for block production
4. **consensus-client**: Consensus layer client for slot tracking and block submission
5. **execution-client**: Execution layer client for blockchain data and gas estimation
6. **HAProxy**: Reverse proxy for external communication
7. **cvm-proxy**: TEE-attested communication proxy
8. **Operator API**: Admin interface for operators

### Network Architecture

```
External World
    ↓ (Port 443)
HAProxy → orderflow-proxy (Port 5543) → rbuilder (Port 8645)
    ↓ (Port 5544)
HAProxy → orderflow-proxy (Port 5542) → rbuilder (Port 8645)
    ↓ (Port 7936)
cvm-proxy → BuilderHub (secrets, config, peers)
    ↓ (Port 3535)
Operator API (health, logs, management)
    ↓ (Port 3500)
consensus-client → Consensus network
    ↓ (Port 8545)
execution-client → Execution network
```

## Core Functions

### Node Startup

**Initialization Process**
When starting a BuilderNet node, the system first loads the BuilderNet Genesis object which contains network-wide parameters and TEE measurements. The TEE environment is initialized using the genesis measurements and the network configuration's TEE type. A TLS certificate is generated for secure communication. All core services are then initialized including the orderflow proxy, HAProxy, cvm-proxy, rbuilder, bidding service, consensus client, and execution client.

**Relay Subscription Setup**
The bidding service subscribes to all supported relays defined in the genesis object using the network configuration's relay subscription settings. This ensures all nodes participate in the same relay network.

**External Interface Setup**
The node establishes connections to external services using addresses from the genesis object, including BuilderHub for peer management and the relay interface for MEV-Boost integration. The Operator API is initialized using the operator configuration to provide management capabilities.

**Node State Creation**
A new BuilderNode instance is created with the genesis object, network configuration, and operator configuration. The node's startup time is recorded and the running state is set to true. Background tasks are started to handle ongoing operations such as protocol synchronization and health monitoring.

### Node Shutdown

**Graceful Shutdown Process**
When shutting down a BuilderNet node, the system first checks if the node is currently running. If not, the shutdown process is skipped. The node's running state is set to false to prevent new operations from starting.

**Service Termination**
All background tasks are stopped first, followed by the persistence of the final node state to ensure no data is lost. Each service is then stopped in sequence: orderflow proxy, HAProxy, cvm-proxy, rbuilder, bidding service, consensus client, execution client, and finally the Operator API.

**State Persistence**
The final node state is persisted to ensure that any pending operations or important data are preserved for the next startup.

## Orderflow Processing

### System Guarantees

Based on TEE integrity, the orderflow processing system provides the following guarantees:

1. **Confidentiality**: Orderflow data is never exposed to operators or external parties
2. **Integrity**: Orderflow processing follows the exact logic defined in the attested code
3. **Best-Effort Propagation**: Orderflow is shared with other BuilderNet nodes on a best-effort basis
4. **Non-Repudiation**: All orderflow processing is cryptographically signed and verifiable

### Orderflow Reception and Validation

When a BuilderNet node receives an orderflow request, it follows a four-step validation process:

**Step 1: Format Validation**
The node first validates the request format. It checks that the method is either "eth_sendBundle" or "eth_sendRawTransaction". The timestamp must not be in the future and must not be older than 60 seconds. For bundle submissions, exactly one parameter is required and it must be an object. For raw transactions, exactly one parameter is required and it must be a string.

**Step 2: Source Authentication**
The node extracts the source identifier from the "X-BuilderNet-Source" header and looks up this peer in its local peer list from the protocol state. The peer must be known, connected, and active. The node verifies the peer's TLS certificate is valid and not expired, and that the peer's TEE attestation is recent and properly signed.

**Step 3: Signature Verification**
The node extracts the signature from the "X-Flashbots-Signature" header, which contains the public key and signature separated by a colon. It creates a canonical message hash from the method, parameters, timestamp, and source identifier. The signature is verified using the authenticated peer's public key through TEE-attested verification.

**Step 4: Method Processing**
If all validations pass, the node processes the request based on the method. Bundle submissions are processed by parsing the bundle structure and validating all transactions. Raw transactions are processed by validating the transaction data and creating orderflow entries.

**Authentication Details**
BuilderNet nodes authenticate orderflow by checking peer keys stored in the protocol state. Each peer entry contains the node ID, public key, TLS certificate, and TEE attestation. The TLS certificate must be issued by a trusted certificate authority and not expired. The TEE attestation must be signed, recent (within 1 hour), and contain valid measurements matching the expected TEE environment.

**Message Hashing**
The canonical message format includes the method, parameters, timestamp, and source identifier. This is serialized to JSON with sorted keys for deterministic hashing, then encoded as UTF-8 and hashed using Keccak256.

### Bundle Processing

Bundle submissions contain multiple transactions that are processed together. The node validates the bundle structure, ensuring it contains a block number and transaction list. Each transaction is validated for format and size limits. The bundle is then parsed and all transactions are converted to orderflow entries.

### Raw Transaction Processing

Individual raw transactions are processed similarly to bundle transactions but without the bundle wrapper. The transaction data is validated and converted to an orderflow entry.

### Orderflow State Management

Orderflow entries are stored in the node's state with a maximum capacity of 10,000 entries. When capacity is reached, the oldest entries are removed (FIFO). Entries are filtered by timeout and block suitability when retrieved for block building.

### Orderflow Sharing

**Sharing Guarantees**
The orderflow sharing system provides the following guarantees:

1. **Confidentiality**: Orderflow data is encrypted in transit and only accessible to authorized BuilderNet nodes
2. **Best-Effort Propagation**: Orderflow sharing is attempted with all connected peers but delivery is not guaranteed
3. **Integrity**: The orderflow sharing code running in the TEE is verifiable and cannot be tampered with
4. **Non-Repudiation**: All orderflow sharing requests are cryptographically signed and verifiable
5. **Peer Authentication**: All peer communication is authenticated using TLS certificates

**How Guarantees Are Achieved**
- **Confidentiality**: Achieved through TEE-attested TLS communication between nodes, ensuring end-to-end encryption
- **Best-Effort Propagation**: Achieved through the integrity guarantee of the TEE - the orderflow sharing code is unmodified and will attempt to share with all peers, but network-level adversaries and connectivity issues are not protected against
- **Integrity**: Achieved through TEE attestation ensuring the orderflow sharing code is verifiable and tamper-proof
- **Non-Repudiation**: Achieved through cryptographic signing of all sharing requests using TEE-attested private keys
- **Peer Authentication**: Achieved through TLS certificate verification during peer communication

**TODO**: Add link to Flashbots forum discussion on orderflow sharing guarantees and network-level protection mechanisms.

**Sharing Implementation**
Orderflow is shared with all connected peers on a best-effort basis. For each peer, the node creates a signed orderflow share request and sends it via HTTPS with TLS certificate verification. Successful and failed sharing attempts are logged for monitoring purposes.

## Protocol Synchronization

BuilderNet nodes maintain synchronization with the network by periodically fetching and updating their peer information from BuilderHub. This ensures nodes have current information about all active peers in the network.

**Peer List Fetching**
Every 5 minutes, each node fetches the current peer list from BuilderHub. The response contains node IDs, addresses, public keys, TLS certificates, and TEE attestations for all active peers in the network.

**Peer State Updates**
For each peer in the fetched list, the node checks if it already exists in its local peer state. If the peer exists, the node updates any changed information such as address, TLS certificate, TEE attestation, or public key. If any of these change, the node marks the peer as disconnected to force a reconnection. If the peer is new, the node creates a new peer entry.

**Peer Removal**
The node removes any peers from its local state that are no longer present in the BuilderHub peer list, ensuring it only maintains connections to active network participants.

**Connection Establishment**
For each peer in the updated list, the node attempts to establish a TLS connection if the peer is not already connected. Before connecting, the node verifies the peer's TLS certificate is valid and not expired, and that the peer's TEE attestation is recent and properly signed. If verification fails, the connection attempt is logged and skipped.

**Synchronization Timing**
Protocol synchronization occurs every 5 minutes to balance network overhead with keeping peer information current. Failed synchronization attempts are logged but do not prevent the node from continuing operation with its existing peer connections.

**Parameter Update Detection**
During protocol synchronization, nodes check for network parameter updates by querying BuilderHub for the latest genesis and network configuration versions. If updates are detected, nodes initiate the update process according to the network's update coordination procedures.

**Update Application**
When network parameter updates are detected, nodes apply the updates in the following order:
1. **Genesis Updates**: Core network parameters are updated first to ensure network-wide consistency
2. **Configuration Updates**: Network-wide settings are applied to align with the updated parameters
3. **Service Restart**: Critical services are restarted to apply the new configuration
4. **Validation**: The node validates that all updates have been applied correctly before resuming normal operation

## Block Building

### Block Production Process

**Relay Subscription Management**
The bidding service maintains active subscriptions to all supported relays defined in the genesis object. This includes establishing connections, handling subscription timeouts, and managing reconnection logic according to network configuration parameters.

**Orderflow Retrieval**
The block production process begins by retrieving suitable orderflow entries for the target block number. The system filters orderflow by timeout and block suitability criteria. If no suitable orderflow is available, block production is skipped.

**Block Building**
Using the rbuilder software, the node constructs a block from the available orderflow. The rbuilder implements the Flat Tax Rule for refund calculations and handles the complex logic of transaction ordering and gas optimization.

**Bid Submission**
The bidding service calculates the optimal bid value based on the MEV available in the block and submits the bid to all subscribed MEV-Boost relays. This ensures maximum coverage of the blockspace auction market.

**Block Submission**
The completed block is submitted to the MEV-Boost relay through the relay interface. The block includes all transactions and the calculated MEV value. The relay handles the auction process and proposer payment distribution.

**State Recording**
Upon successful block production, the node records the block details including hash, number, and MEV value in its state. This information is used for refund calculations and performance monitoring.

**Refund Processing**
After block production, the system calculates refunds using the Flat Tax Rule and processes them through the refund mechanism.

### Block Submission

**Relay Communication**
Blocks are submitted to MEV-Boost relays through a dedicated relay interface. The submission includes the complete block data, transaction list, and MEV calculations. The relay handles the auction process and determines the winning bid.

**Auction Participation**
The relay interface manages the bidding process and handles proposer payment distribution. The node does not directly participate in the auction but provides the block content for relay evaluation.

## Refund Processing

### Refund Calculation

**Flat Tax Rule Implementation**
Refund calculations are performed using the Flat Tax Rule implemented in the rbuilder software. The calculation takes into account the block's transactions, total MEV value, and proposer payment. The rbuilder handles the complex logic of determining each transaction's contribution to the overall MEV and calculating the appropriate refund amount.

**Refund Computation**
The system extracts block details including all transactions, the total MEV value, and the proposer payment amount. These values are passed to rbuilder's refund calculation function which implements the Flat Tax Rule algorithm to determine refund amounts for each transaction contributor.

### Refund Distribution

**Refund Processing**
For each pending refund, the system attempts to send a refund transaction. The refund status is updated based on the success or failure of the transaction. Successful refunds are marked as processed and include the transaction hash, while failed refunds are marked as failed for retry.

**Transaction Creation**
Refund transactions are created and sent from the official BuilderNet refund wallet address (0x62A29205f7Ff00F4233d9779c210150787638E7f). The transaction includes the calculated refund amount and is sent to the recipient address specified in the refund entry.

**State Management**
All refund entries are added to the node's pending refunds list for tracking and monitoring purposes. This allows the system to maintain a complete record of all refund transactions and their current status.

## Operation

### Operator API

The Operator API provides a basic interface for operators to interact with the BuilderNet node. It allows operators to observe the node's status, restart services, trigger a graceful reboot, and apply configuration changes.

**Port**: 3535 (HTTPS with TLS)

**Authentication**: HTTP Basic Auth

**Security**: 
- Designed to be used by the operator only
- Port should be firewalled to restrict public access
- Supports TLS for secure communication

**API Endpoints**
The Operator API supports the following endpoints:
- `/api/v1/set-basic-auth` - Set basic authentication secret
- `/logs` - Retrieve system logs
- `/livez` - Health check endpoint
- `/api/v1/actions/rbuilder_restart` - Restart rbuilder service
- `/api/v1/actions/rbuilder_bidding_restart` - Restart bidding service
- `/api/v1/actions/fetch_config` - Refresh configuration
- `/api/v1/actions/ssh_stop` - Stop SSH service
- `/api/v1/actions/ssh_start` - Start SSH service
- `/api/v1/file-upload/rbuilder_blocklist` - Upload blocklist file

**Basic Auth Management**
The operator can set a basic authentication secret for the API. This secret is used to authenticate all API requests. The secret is stored securely within the TEE and cannot be accessed by the operator.

**Health Monitoring**
The health check endpoint returns the current status of the node. It verifies that all core services are running and responsive. A successful health check indicates the node is operational.

**Service Management**
Operators can restart specific services through the API. Valid services include rbuilder, rbuilder_bidding, fetch_config, and ssh. Service restarts are logged and monitored for any failures.

**Configuration Management**
Operators can upload configuration files to the node. Currently supported file types include rbuilder_blocklist. Files are validated before being applied to ensure they meet the required format and security constraints.

**API Request Handling**
All API requests are validated for format, authentication, and authorization before processing. Requests are routed to appropriate handlers based on the endpoint. Invalid requests return error responses with specific error messages.

### Logging and Monitoring

**Log Delay Mechanism**
BuilderNet nodes implement a log delay mechanism to protect sensitive information. All logs are delayed by 300 seconds (5 minutes) before being made available to operators. This delay prevents operators from gaining real-time insights into orderflow processing and block building activities.

**Log Content**
Logs contain operational information such as service status, connection events, and system metrics. Sensitive data including orderflow details, transaction contents, and MEV calculations are never logged. Log entries include timestamps, event types, and relevant identifiers without exposing confidential information.

**Log Storage**
Logs are stored securely within the TEE environment. The log storage system implements rotation to prevent disk space issues. Old logs are automatically archived and can be retrieved through the Operator API.

**Monitoring Metrics**
The node provides monitoring metrics through Prometheus endpoints. Metrics include system performance, network connectivity, and service health indicators. These metrics help operators monitor node performance without exposing sensitive operational details.

**Alert System**
The node can generate alerts for critical events such as service failures, connection issues, or security violations. Alerts are sent through configured notification channels and include relevant diagnostic information while maintaining confidentiality.

## Validation Rules

### Node Validation

**State and Configuration Validation**
Node validation ensures that the node's state, genesis object, network configuration, and operator configuration are consistent and valid. The system checks that the node state is properly formatted and that all configuration objects contain required parameters with valid values.

**Genesis Validation**
The BuilderNet Genesis object is validated to ensure it contains the correct network parameters and TEE measurements. The node's TEE measurements must match those specified in the genesis object for the node to be considered valid.

**Network Configuration Validation**
The network configuration is validated to ensure it matches the network-wide parameters defined in the genesis object. This includes verification that the node is configured to support all required relays and use the correct network-wide settings.

**Parameter Update Validation**
When network parameter updates are received, the system validates the updates before application:
- **Version Compatibility**: Updates are checked for compatibility with the current node software version
- **Parameter Integrity**: Update signatures and hashes are verified to ensure authenticity
- **Impact Assessment**: The system evaluates the potential impact of updates on node operation
- **Rollback Capability**: Updates are validated to ensure they can be rolled back if necessary

**Temporal Validation**
The node's startup time must not be in the future, ensuring that the node has been properly initialized. This prevents issues with time-based operations and state management.

**TEE Environment Validation**
The TEE interface is validated to ensure it is properly initialized and functioning. This includes verification of the TEE attestation and measurement values against the genesis object to ensure the secure environment is intact.

### Orderflow Validation

**Transaction Parameter Validation**
Orderflow entries must have valid gas prices and gas limits greater than zero. These parameters are essential for transaction execution and must be properly set.

**Temporal Validation**
The orderflow entry timestamp must not be in the future. This prevents processing of transactions with invalid timing that could cause issues in block building.

**Source Validation**
The orderflow source must be one of the valid types: user, searcher, flashbots, or peer. This ensures that all orderflow comes from authorized sources and prevents processing of invalid data.

### Block Validation

**Block Structure Validation**
Produced blocks must have a valid block number greater than zero and contain at least one transaction. Empty blocks are not allowed in the BuilderNet system.

**Temporal Validation**
The block timestamp must not be in the future, ensuring that blocks are produced with valid timing information.

**MEV Validation**
The block's MEV value must be non-negative, as negative MEV values are not meaningful in the context of block building.

**Transaction Validation**
All transactions within the block must pass orderflow validation to ensure they are properly formatted and contain valid parameters.

### Operator API Validation

**Request Timing Validation**
Operator API requests must have timestamps that are not in the future and not older than 5 minutes. This prevents replay attacks and ensures requests are processed in a timely manner.

**Authentication Validation**
All Operator API requests must include basic authentication credentials. This ensures that only authorized operators can access the management interface.

**Endpoint Validation**
Requests must target valid API endpoints. The system maintains a whitelist of allowed endpoints including authentication management, log retrieval, health checks, service management, and file uploads. Invalid endpoints are rejected to prevent unauthorized access attempts.

## Notes

1. **TEE Integration**: All sensitive operations are performed within TEE instances, with orderflow remaining confidential.

2. **rbuilder Software**: The core block building logic is implemented in the open-source rbuilder software.

3. **Flat Tax Rule**: Refunds are calculated using the Flat Tax Rule implemented in rbuilder.

4. **Refund Wallet**: All refunds are sent from the official BuilderNet refund wallet address.

5. **Service Architecture**: The node consists of multiple services running within the TEE environment.

6. **Operator API**: Provides limited but useful information for operators without exposing sensitive data.

7. **Ethereum Clients**: The specification uses generic consensus and execution layer clients, allowing for different implementations.

8. **TEE Integrity Guarantees**: Orderflow processing is built on TEE integrity guarantees ensuring confidentiality, integrity, and isolation.

9. **Best-Effort Propagation**: Orderflow sharing with peers is best-effort and not guaranteed to succeed.

10. **Network vs Operator Configuration**: Network configuration contains mandatory parameters that all nodes must participate in, while operator configuration contains optional settings that operators can choose to enable or configure.

11. **Relay Subscription**: All nodes must subscribe to the same set of relays defined in the genesis object to ensure consistent network participation.

12. **Network Parameter Updates**: Network parameters can be updated through a governance process with coordinated rollout across all nodes to maintain network consistency.

13. **TODO**: Implement complete rbuilder JSON-RPC integration.

14. **TODO**: Add support for different TEE types and attestation providers.

15. **TODO**: Implement proper refund transaction creation and submission.

16. **TODO**: Add support for different orderflow sources and their specific handling.

17. **TODO**: Implement proper error handling and recovery mechanisms.

18. **TODO**: Add support for different Operator API actions and file uploads.

19. **TODO**: Add Flashbots forum link for detailed explanation of best-effort propagation guarantees. 