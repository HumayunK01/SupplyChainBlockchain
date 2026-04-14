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

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## Research

This project accompanies a capstone research paper demonstrating:

- **99.98% gas savings** via Merkle tree batch registration
- **< 800ms** verification time per medicine
- Soulbound Tokens as a decentralized identity layer for supply chain participants
- IPFS integration for verifiable, decentralized certificate and batch metadata storage

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built by <a href="https://github.com/HumayunK01">Humayun Khan</a></strong>
</p>
