# ERC-20 Token DApp

A full-stack DApp for issuing, transferring, burning, and pausing an ERC-20 token.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.28, OpenZeppelin v5, Hardhat v2 |
| Frontend | React 19, Vite 7, TypeScript 5 |
| Web3 | wagmi v2, viem |
| Styling | Tailwind CSS 4 |

## Project Structure

```
├── contracts/          # Hardhat project
│   ├── contracts/      # Solidity contracts
│   ├── test/           # Unit tests
│   ├── ignition/       # Deploy modules
│   └── scripts/        # ABI export, verification
└── frontend/           # React + Vite app
    └── src/
        ├── components/ # UI components
        ├── hooks/      # wagmi custom hooks
        └── config/     # wagmi / contract config
```

## Contract Features

- **ERC20** — Standard token (name, symbol, totalSupply, transfer)
- **ERC20Burnable** — Token burning
- **ERC20Pausable** — Pause / unpause all transfers
- **Ownable** — Owner-only operations (mint, pause, unpause)

## Setup

```bash
npm install
```

## Usage

### 1. Start Hardhat Node

```bash
npm run node
```

### 2. Deploy Contract

```bash
npm run deploy:local
```

The deployed address is printed to the console. Set it in `frontend/.env` as `VITE_TOKEN_ADDRESS` (defaults to `0x5FbDB2315678afecb367f032d93F642f64180aa3`).

### 3. Start Frontend

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. MetaMask Configuration

| Setting | Value |
|---|---|
| Network | Localhost 8545 |
| Chain ID | 31337 |
| RPC URL | http://127.0.0.1:8545 |

## Other Commands

```bash
# Run contract tests (12 tests)
npm run test --workspace=contracts

# Compile contracts
npm run compile

# Export ABI to frontend
npm run export-abi
```

## License

MIT
