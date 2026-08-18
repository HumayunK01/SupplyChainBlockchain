<p align="center">
  <img src="client/public/logo.svg" alt="SecureChain" width="60" />
</p>

<h1 align="center">SecureChain</h1>

<p align="center">
  <strong>Blockchain-based pharmaceutical supply chain with Soulbound Token identity and Merkle tree batch verification</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Solidity-^0.8.19-363636?logo=solidity&logoColor=white" alt="Solidity" />
  <img src="https://img.shields.io/badge/Next.js_14-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Hardhat-FFF1E2?logo=hardhat&logoColor=black" alt="Hardhat" />
  <img src="https://img.shields.io/badge/IPFS-65C2CB?logo=ipfs&logoColor=white" alt="IPFS" />
</p>

---

## What is SecureChain?

SecureChain tracks pharmaceutical products from raw material to consumer on an Ethereum blockchain. Every medicine has an immutable, verifiable history — eliminating counterfeiting and ensuring full traceability.

**Two key innovations set it apart:**

### 1. Soulbound Tokens (SBTs) for Identity

Every supply chain participant must hold a **non-transferable ERC-721 certificate** before they can operate. These certificates:

- Are minted on-chain with real metadata stored on **IPFS** (via Pinata)
- Cannot be transferred — permanently bound to the holder's wallet
- Can be **revoked** by the admin, which burns the token and unpins the IPFS data
- Are verified by the SupplyChain contract before any role registration

This prevents identity spoofing at the protocol level.

### 2. Merkle Tree Batch Registration

Instead of storing each medicine individually (expensive), manufacturers register an entire batch with a single **Merkle root hash**:

- **1,000 medicines = 1 transaction** (99.9% gas savings)
- Individual items are verified on-chain using cryptographic **Merkle proofs**
- The full batch manifest is stored on **IPFS** with the CID recorded on-chain
- Tamper detection is instant — changing a single character breaks the proof

---

## Supply Chain Flow

```
Raw Material Supplier  -->  Manufacturer  -->  Distributor  -->  Retailer  -->  Consumer
       (Stage 1)            (Stage 2)          (Stage 3)        (Stage 4)      (Sold)
```

Each stage is enforced by the smart contract. Only the correct role can advance a medicine to the next stage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity ^0.8.19, OpenZeppelin (ERC-721, MerkleProof) |
| Blockchain | Hardhat / Ganache (local EVM) |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Web3 | Web3.js, MetaMask |
| Decentralized Storage | IPFS via Pinata |
| Cryptography | Merkle trees (merkletreejs), keccak256 |
| Animations | Framer Motion, GSAP |

---

## Architecture

```
Browser + MetaMask
        |
   Next.js 14 Frontend
        |
   Web3.js
        |
   Local EVM (Hardhat / Ganache)
        |
   +----+----+
   |         |
SupplyChain.sol  CertificateSBT.sol
                      |
                    IPFS (Pinata)
```

**Two contracts:**
- **CertificateSBT.sol** — Issues and revokes soulbound identity tokens
- **SupplyChain.sol** — Manages roles, medicines, supply chain stages, and Merkle batches

---

## Pages

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/roles` | Register participants + view SBT certificates | Owner |
| `/addmed` | Create medicine orders | Owner |
| `/batch` | Bulk register medicines via Merkle trees | Manufacturer |
| `/supply` | Advance medicines through supply chain stages | Role-gated |
| `/track` | Track product journey + on-chain activity feed | All users |

---

## Smart Contract Events

Both contracts emit events for every significant action:

| Event | Contract | Trigger |
|---|---|---|
| `CertificateIssued` | CertificateSBT | SBT minted to participant |
| `CertificateRevoked` | CertificateSBT | SBT burned by admin |
| `RoleRegistered` | SupplyChain | New participant added |
| `MedicineAdded` | SupplyChain | New medicine order created |
| `StageUpdated` | SupplyChain | Medicine advances to next stage |
| `BatchRegistered` | SupplyChain | Merkle batch registered on-chain |

These events power the real-time **Activity Feed** on the Track page.

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18+ |
| MetaMask | Latest browser extension |
| Ganache (optional) | Latest GUI or use Hardhat node |

### Setup

```bash
# Clone
git clone https://github.com/HumayunK01/Supply-Chain-Blockchain.git
cd Supply-Chain-Blockchain

# Install dependencies
cd backend && npm install
cd ../client && npm install
```

### Environment Variables

Create `client/.env.local`:

```
NEXT_PUBLIC_PINATA_JWT="your_pinata_jwt_here"
```

Get a free JWT from [pinata.cloud](https://pinata.cloud) (API Keys > New Key > enable pinJSONToIPFS).

### Deploy & Run

```bash
# Terminal 1 — Start local blockchain
cd backend
npm run node

# Terminal 2 — Deploy contracts
cd backend
npm run deploy:local

# Terminal 3 — Start frontend
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect MetaMask to `localhost:8545` (Chain ID: 1337).

> The first Hardhat account is the **Owner**. Import its private key into MetaMask.

### Using Ganache Instead

```bash
# Start Ganache GUI (port 7545, chain ID 1337)
cd backend
npm run deploy:ganache
```

Configure MetaMask with RPC URL `http://127.0.0.1:7545`.

---

## Demo Walkthrough

### Proving SBTs

1. Go to `/roles` as Owner
2. Register a participant — two MetaMask transactions fire (mint SBT + register role)
3. Click the green **"SBT Held"** badge — opens real certificate on IPFS
4. Click **Revoke** — token burned, IPFS unpinned, badge turns red

### Proving Merkle Batches

1. Go to `/batch` as a Manufacturer
2. Generate 1,000 ID codes — Merkle root appears
3. Register on-chain — gas comparison shows **99.9% savings**
4. Verify item #42 — green (authentic)
5. Change one character — red (counterfeit detected)
6. Click **"View on IPFS"** in batch history — full manifest visible

---

## Project Structure

```
Supply-Chain-Blockchain/
|-- backend/
|   |-- contracts/
|   |   |-- SupplyChain.sol        # Core supply chain logic + Merkle batches
|   |   |-- CertificateSBT.sol     # Soulbound token identity system
|   |-- scripts/
|   |   |-- deploy.ts              # Deploys both contracts
|   |   |-- benchmark.ts           # Reproducible Merkle batch performance benchmark
|   |-- hardhat.config.ts
|
|-- client/
|   |-- src/
|   |   |-- app/                   # Next.js App Router pages
|   |   |-- components/            # UI components by feature
|   |   |-- lib/
|   |   |   |-- web3.ts            # MetaMask + contract loading
|   |   |   |-- contractUtils.ts   # Role checking utilities
|   |   |   |-- pinata.ts          # IPFS upload/unpin via Pinata
|   |   |-- artifacts/             # Compiled contract ABIs
|   |   |-- deployments.json       # Contract addresses by chain ID
```

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run compile` | Compile Solidity contracts |
| `npm run node` | Start local Hardhat node |
| `npm run deploy:local` | Deploy to Hardhat node |
| `npm run deploy:ganache` | Deploy to Ganache (port 7545) |
| `npm run clean` | Remove build artifacts |
| `npm run benchmark` | Run Merkle batch performance benchmark (Hardhat localhost) |
| `npm run benchmark:ganache` | Run Merkle batch performance benchmark (Ganache, port 7545) |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## Performance Benchmark

`backend/scripts/benchmark.ts` is a reproducible benchmark of the Merkle batch pipeline. It exercises the **actual deployed contract functions** — `SupplyChain.registerMedicineBatch` (SupplyChain.sol:320) and `SupplyChain.verifyMedicineInBatch` (SupplyChain.sol:339, an OpenZeppelin `MerkleProof.verify` wrapper) — and builds trees with the exact same conventions as the frontend batch page (`client/src/app/batch/page.tsx`): identifiers of the form `${batchName}_Item_${i}`, `keccak256` leaves, `sortPairs: true`.

### What it measures

For every run it records, **without fabrication or adjustment**:

- **Merkle generation time (ms)** — off-chain CPU time to generate deterministic identifiers, build the tree, and derive the root (`process.hrtime.bigint()`)
- **Registration confirmation time (ms)** — blockchain time from transaction submission to receipt
- **Gas used** and **effective gas price** — both read from the transaction receipt
- **Verification time (ms)** — on-chain view-call execution plus RPC round trip for a valid Merkle inclusion proof of item 0, and for a deliberately tampered identifier with a mismatched proof (must be rejected)

Off-chain generation time and blockchain confirmation time are reported separately. No throughput is computed; all values are single-transaction observations. Each batch size is run 3 times; mean, minimum, and maximum are reported for timings and gas.

### Running it

```bash
# Full run: batch sizes 100, 500, 1,000, 5,000, 10,000 × 3 runs
cd backend
npm run benchmark            # against the local Hardhat node (http://127.0.0.1:8545)
# or
npm run benchmark:ganache    # against Ganache (http://127.0.0.1:7545)

# Custom sizes / runs
BENCH_SIZES="100,1000" BENCH_RUNS="1" npm run benchmark
```

The script deploys **fresh instances** of the existing `CertificateSBT.sol` and `SupplyChain.sol`, registers a benchmark manufacturer (SBT certificate + role), and leaves `client/src/deployments.json` untouched. The final output includes a readable table and a machine-readable JSON block delimited by `=== BENCHMARK_RESULTS_JSON_START ===` / `=== BENCHMARK_RESULTS_JSON_END ===`.

### Measured results

Environment: Hardhat localhost, chain ID 1337, Solidity 0.8.19, optimizer runs 200, 3 runs per batch size, all valid verifications passed and all tampered identifiers were correctly rejected.

Summary (mean / min / max across 3 runs):

| Batch Size | Merkle Gen (ms) | Registration Confirm (ms) | Gas Used | Verification (ms) |
|---|---|---|---|---|
| 100 | 2.684 / 1.532 / 4.824 | 7.692 / 6.875 / 8.843 | 133513 / 127813 / 144913 | 2.657 / 1.883 / 3.364 |
| 500 | 4.681 / 3.75 / 5.378 | 7.324 / 5.696 / 9.277 | 127813 / 127813 / 127813 | 2.035 / 1.642 / 2.356 |
| 1,000 | 9.473 / 7.984 / 10.398 | 8.946 / 5.306 / 14.334 | 127813 / 127813 / 127813 | 5.437 / 2.071 / 11.769 |
| 5,000 | 42.794 / 39.735 / 45.248 | 8.23 / 4.904 / 14.148 | 127813 / 127813 / 127813 | 2.307 / 2.204 / 2.404 |
| 10,000 | 88.521 / 85.462 / 92.143 | 10.247 / 5.66 / 19.4 | 127813 / 127813 / 127813 | 2.126 / 1.914 / 2.392 |

Key observations, grounded in the contract logic:

- **Registration gas is independent of batch size.** `registerMedicineBatch` (SupplyChain.sol:320) never iterates over leaves — it stores a single 32-byte Merkle root plus a fixed-size struct in one mapping write and emits one event. Gas is therefore constant at **127,813** for every run at sizes 500–10,000 (and for runs 2–3 at size 100). The Merkle tree itself is built entirely off-chain.
- **The single 144,913 value (size 100, run 1) is a contract-state effect, not a batch-size effect.** It is always the first registration on a freshly deployed contract: `batchCtr` is written 0→1 (SSTORE cost 20,000 gas) versus 1→2, 2→3, … for later registrations (2,900 gas). The delta is exactly 17,100 = 20,000 − 2,900.
- **Merkle generation time scales with batch size** (≈2.7 ms at 100 items to ≈88.5 ms at 10,000 items) since the tree is built off-chain.
- **Verification time stays ≈2 ms** — dominated by the view-call RPC round trip; verification is O(log₂ n) hashes on-chain. Verification gas is not measured because `verifyMedicineInBatch` is a `view` function and produces no transaction receipt.
- The effective gas price shown in the raw output is assigned by the local node and declines across a session; it is a local-node artifact, not a network fee, and does not affect gas *used*.

---

## Research

This project accompanies a capstone research paper demonstrating:

- **99.98% gas savings** via Merkle tree batch registration (see [Performance Benchmark](#performance-benchmark) for reproducible measurements)
- **< 800ms** verification time per medicine (measured ≈2 ms on localhost)
- Soulbound Tokens as a decentralized identity layer for supply chain participants
- IPFS integration for verifiable, decentralized certificate and batch metadata storage

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built by <a href="https://github.com/HumayunK01">Humayun Khan</a></strong>
</p>
