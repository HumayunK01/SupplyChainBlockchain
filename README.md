# 🔗 Supply Chain Blockchain DApp

**A decentralized supply chain management system built on Ethereum using Solidity smart contracts, Next.js 14, and Web3.js.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFF1E2?logo=hardhat&logoColor=black)](https://hardhat.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
- [Usage Guide](#-usage-guide)
- [Smart Contract Details](#-smart-contract-details)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Supply Chain Blockchain DApp** leverages blockchain to create a transparent, secure, and efficient supply chain management system. Smart contracts handle all business logic on-chain — eliminating paperwork, preventing fraud, and giving every participant a verifiable product history.

### Key Benefits

- ✅ **Transparency** — All transactions recorded immutably on the blockchain
- ✅ **Security** — Tamper-proof records prevent fraud
- ✅ **Traceability** — Full product journey from raw material to consumer
- ✅ **Efficiency** — Automated stage transitions reduce overhead
- ✅ **Decentralization** — No single point of failure

---

## ✨ Features

- 🔐 **Role-Based Access Control** — Owner, Raw Material Supplier, Manufacturer, Distributor, Retailer
- 📦 **Product Management** — Create and manage product orders on-chain
- 🔄 **Supply Chain Flow** — Stage-by-stage progression enforced by smart contract
- 📊 **Real-Time Tracking** — View detailed stage info and generate QR codes
- 🔗 **MetaMask Integration** — Seamless Web3 wallet connection

---

## 🛠 Technology Stack

| Layer | Tech |
|---|---|
| **Smart Contracts** | Solidity ^0.8.19, Hardhat |
| **Local Blockchain** | Ganache |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Web3** | Web3.js, MetaMask |
| **QR Codes** | qrcode.react |

---

## 🏗 Architecture

```
User Browser
    │
    ▼
Next.js 14 Frontend  (Tailwind CSS)
    │
    ▼
Web3.js  ←→  MetaMask
    │
    ▼
Ganache (Local Ethereum Node)
    │
    ▼
SupplyChain.sol Smart Contract
```

### Supply Chain Flow

```
Ordered → Raw Material Supply → Manufacturing → Distribution → Retail → Sold
```

---

## 📦 Prerequisites

Install these before starting:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18 or higher | [nodejs.org](https://nodejs.org/) |
| **Git** | Any | [git-scm.com](https://git-scm.com/) |
| **Ganache** | Latest GUI | [trufflesuite.com/ganache](https://trufflesuite.com/ganache/) |
| **MetaMask** | Latest | [metamask.io](https://metamask.io/) |

---

## 🚀 Quick Start Guide

Follow these steps **in order** every time you start the project.

---

### Step 1 — Clone & Install Dependencies

```bash
git clone https://github.com/faizack619/Supply-Chain-Blockchain.git
cd Supply-Chain-Blockchain

# Install blockchain/Hardhat dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

---

### Step 2 — Configure & Start Ganache

1. Open the **Ganache** desktop application
2. Click **New Workspace** → select **Ethereum**
3. Go to **Settings (⚙️) → Server** and set:
   - **Port Number**: `7545`
   - **Chain ID**: `1337`
4. Click **Save and Restart**
5. Ganache is now running with 10 pre-funded test accounts

> ⚠️ **Important:** Chain ID must be `1337`. If it shows `5777`, change it in settings.

---

### Step 3 — Compile the Smart Contract

```bash
cd backend
npm run compile
```

This compiles `contracts/SupplyChain.sol` and outputs the ABI to `client/src/artifacts/`.

---

### Step 4 — Deploy the Smart Contract

With Ganache running, deploy the contract:

```bash
npm run deploy:ganache
```

Expected output:
```
Deploying SupplyChain contract...
Deploying with account: 0xYourAddress...
Account balance: 100.0 ETH
SupplyChain deployed to: 0xContractAddress...
Network chain ID: 1337
Deployment info saved to client/src/deployments.json
```

> The contract address is automatically saved to `client/src/deployments.json`. **Do not delete this file.**

---

### Step 5 — Configure MetaMask

#### Add the Ganache Network

1. Open MetaMask → click the **network dropdown** (top center)
2. Click **Add Network** → **Add a network manually**
3. Fill in:

   | Field | Value |
   |---|---|
   | Network Name | `Ganache Local` |
   | RPC URL | `http://127.0.0.1:7545` |
   | Chain ID | `1337` |
   | Currency Symbol | `ETH` |

4. Click **Save**, then **Switch to Ganache Local**

#### Import a Ganache Account

1. In Ganache, click the **🔑 key icon** next to any account → copy the **Private Key**
2. In MetaMask → click your **account icon** → **Import Account**
3. Paste the private key → click **Import**

> The imported account will have 100 ETH for testing. The **first account** in Ganache is the contract **Owner**.

---

### Step 6 — Start the Frontend

```bash
cd client
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

MetaMask will prompt you to connect — **approve it**.

---

### ✅ You're Ready!

| Service | URL / Location |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Ganache RPC** | http://127.0.0.1:7545 |
| **MetaMask Network** | Ganache Local (Chain ID: 1337) |

---

## 🔁 Restarting After a Break

If you restart Ganache (which resets the blockchain), you must **redeploy** the contract:

```bash
cd backend
npm run deploy:ganache
```

Then refresh the frontend — MetaMask will still be connected correctly.

---

## 📖 Usage Guide

### 1. Register Roles (`/roles`)
- Only the **contract owner** (first Ganache account) can register participants
- Add a **Raw Material Supplier**, **Manufacturer**, **Distributor**, and **Retailer**
- Each requires: Ethereum address, name, and location

> ⚠️ You must register **at least one** of each role before creating any orders.

### 2. Order Materials (`/addmed`)
- Only the **contract owner** can create new product orders
- Enter product name and description

### 3. Supply Chain Flow (`/supply`)
- Each role advances the product through its stage:
  - **Raw Material Supplier** → supplies raw materials (Stage 1)
  - **Manufacturer** → manufactures the product (Stage 2)
  - **Distributor** → distributes the product (Stage 3)
  - **Retailer** → retails and marks as sold (Stages 4 & 5)
- Switch MetaMask to the relevant role's account to perform each action

### 4. Track Products (`/track`)
- Enter a product ID to view its complete journey
- See stage-by-stage details with participant info
- Generate a QR code for any product

---

## 🔐 Smart Contract Details

**`SupplyChain.sol`** — Solidity ^0.8.19

### Roles

| Role | Description |
|---|---|
| `Owner` | Deploys contract, registers roles, creates orders |
| `RMS` | Raw Material Supplier |
| `MAN` | Manufacturer |
| `DIS` | Distributor |
| `RET` | Retailer |

### Product Stages

| Stage | ID | Description |
|---|---|---|
| Init | 0 | Product ordered |
| RawMaterialSupply | 1 | Raw materials supplied |
| Manufacture | 2 | Product manufactured |
| Distribution | 3 | Product distributed |
| Retail | 4 | Product at retailer |
| Sold | 5 | Product sold |

### Key Functions

```solidity
// Register participants (owner only)
addRMS(address, name, place)
addManufacturer(address, name, place)
addDistributor(address, name, place)
addRetailer(address, name, place)

// Create product order (owner only, requires all roles registered)
addMedicine(name, description)

// Progress through stages (called by respective role accounts)
RMSsupply(medicineID)
Manufacturing(medicineID)
Distribute(medicineID)
Retail(medicineID)
sold(medicineID)

// Query current stage
showStage(medicineID) → string
```

---

## 🧰 Available Scripts

### Backend (`cd backend`)

| Script | Command | Description |
|---|---|---|
| Compile | `npm run compile` | Compile Solidity contracts |
| Deploy (Ganache) | `npm run deploy:ganache` | Deploy to Ganache (port 7545, chainId 1337) |
| Deploy (Ganache 5777) | `npm run deploy:ganache5777` | Deploy to Ganache with chainId 5777 |
| Deploy (Hardhat node) | `npm run deploy:local` | Deploy to local Hardhat node |
| Local Node | `npm run node` | Start a Hardhat EVM node |
| Test | `npm run test` | Run contract tests |
| Clean | `npm run clean` | Remove build artifacts |

### Frontend (`cd client`)

| Script | Command | Description |
|---|---|---|
| Dev Server | `npm run dev` | Start dev server at localhost:3000 |
| Build | `npm run build` | Build production bundle |
| Start | `npm start` | Serve production build |
| Lint | `npm run lint` | Run ESLint |

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ using Solidity, Next.js, and Web3**

[⬆ Back to Top](#-supply-chain-blockchain-dapp)

</div>
