# BlockFuse Labs — Solana Starter

A progressive curriculum for learning Solana development from scratch. You will build real on-chain programs, mint tokens, create NFTs, and interact with a vault smart contract — all on devnet.

---

## Learning Architecture

This repository follows a **hands-on, progressive learning model** with two parallel TypeScript codebases:

### Directory Structure

```
solana-starter/
├── ts/               ← WORK HERE: Scaffold code with ??? placeholders
│   ├── prereqs/      ← Module 1: Wallet basics
│   ├── cluster1/     ← Modules 2-4: SPL, NFTs, Vault
│   │   └── programs/ ← IDL type definitions (provided)
│   ├── tools/        ← Utility scripts
│   └── package.json
│
└── ts-complete/      ← REFERENCE ONLY: Complete working solutions
    ├── prereqs/
    ├── cluster1/
    │   └── programs/
    └── tools/
```

### How It Works

**`ts/` folder** contains **scaffold code** — partially completed scripts with `???` markers where you need to fill in the missing implementation. Each script has:
- All necessary imports and setup boilerplate
- Comments explaining what needs to be done
- `???` placeholders marking exactly where to write code

**`ts-complete/` folder** contains **complete reference solutions** — fully working implementations of every script. Use this ONLY when stuck or to verify your solution.

### Learning Workflow

1. **Open the scaffold script** in `ts/` (e.g., [ts/cluster1/spl_init.ts](ts/cluster1/spl_init.ts))
2. **Read the module documentation** in this README for context
3. **Find the `???` markers** and implement the missing code
4. **Run the script** via the provided yarn command (e.g., `yarn spl_init`)
5. **Compare with `ts-complete/`** if you get stuck or want to verify

### Example: SPL Token Init

**Scaffold version** ([ts/cluster1/spl_init.ts](ts/cluster1/spl_init.ts)):
```typescript
(async () => {
    try {
        // Start here
        // const mint = ???
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
```

**Complete version** ([ts-complete/cluster1/spl_init.ts](ts-complete/cluster1/spl_init.ts)):
```typescript
(async () => {
    try {
        const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            null,
            6
        );
        console.log(`Your mint address is: ${mint.toBase58()}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()
```

Your task: replace `// const mint = ???` with the call to `createMint()`.

---

## What You Will Learn

| Module | Topic |
|--------|-------|
| Prerequisites | Wallets, keypairs, airdrops, SOL transfers, on-chain enrollment |
| SPL Tokens | Create a mint, attach metadata, mint tokens, transfer tokens |
| NFTs | Upload artwork to Irys, create metadata, mint an NFT with Metaplex |
| Vault Program | Initialize a PDA vault, deposit/withdraw SOL, SPL tokens, and NFTs |

---

## What Is Solana?

Solana is a high-performance blockchain that processes thousands of transactions per second at a fraction of a cent per transaction. Before you write code, three concepts are essential.

### Accounts

Everything on Solana is an **account** — a piece of storage at a public key address. Accounts hold data and are owned by programs. Your wallet is an account. Your token balance is an account. An NFT is an account.

```
Account
├── owner (which program controls this account)
├── lamports (SOL balance in smallest unit)
├── data (arbitrary bytes)
└── executable (true if this account IS a program)
```

### Lamports

SOL is measured in **lamports** (1 SOL = 1,000,000,000 lamports). Most operations cost a fraction of a lamport in fees. Accounts must maintain a minimum lamport balance called **rent-exemption** to stay alive on-chain.

### Programs

**Programs** are Solana's equivalent of smart contracts. They are stateless — they do not store data themselves. Instead, they read and write to separate data accounts. The Token Program manages all fungible tokens. The System Program creates new accounts. Your vault is a custom program.

### PDAs (Program Derived Addresses)

A **PDA** is an account address derived deterministically from a program ID plus a set of seeds. No private key exists for a PDA — only the owning program can sign on its behalf. PDAs let programs control accounts without external keypairs.

```
seeds: ["auth", vaultState.publicKey]  →  vaultAuth PDA (owned by vault program)
seeds: ["vault", vaultAuth.publicKey]  →  vault PDA (holds your SOL/tokens)
```

---

## Prerequisites & Setup

### 1. Install Node.js and Yarn

```bash
# Install Node.js 18+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18 && nvm use 18

# Install Yarn
npm install -g yarn
```

### 2. Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### 3. Install the Solana CLI

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
# Add to PATH as instructed, then verify:
solana --version
```

Configure for devnet:

```bash
solana config set --url devnet
```

### 4. Clone and Install

```bash
git clone <repo-url>
cd solana-starter/ts
yarn install
```

> Use `ts/` for the workshop exercises (it contains `???` TODO scaffolds). Use `ts-complete/` only as a reference solution set.

---

## Wallet Setup

The scripts expect two wallet files in `ts/`:

| File | Purpose |
|------|---------|
| `ts/dev-wallet.json` | Throwaway devnet wallet for prereq scripts |
| `ts/bfl-wallet.json` | Your main wallet used for all cluster1 scripts |

### Generate your wallets

```bash
# Generate dev wallet
cd ts
yarn keygen
# Paste the printed byte array into ts/dev-wallet.json as a JSON array

# Generate BFL wallet (repeat keygen, save to ts/bfl-wallet.json)
```

Or use the Solana CLI:

```bash
solana-keygen new --outfile ts/dev-wallet.json
solana-keygen new --outfile ts/bfl-wallet.json
```

### Fund with devnet SOL

```bash
# Airdrop to dev wallet
yarn airdrop

# Or airdrop directly via CLI
solana airdrop 2 $(solana-keygen pubkey ts/bfl-wallet.json) --url devnet
```

---

## How to Complete the Exercises

Each script in the `ts/` folder follows a consistent pattern designed to help you learn by doing. Here's your step-by-step guide:

### 1. Understanding the Scaffold Pattern

Every incomplete script contains:
- **Imports** — already provided (no need to add more)
- **Setup code** — connection, keypair loading, constants
- **`???` markers** — these are your implementation targets
- **Comments** — hints about what needs to be done

### 2. Finding What to Implement

Look for these patterns in the code:

```typescript
// const variableName = ???
```
This means: declare a constant and assign the result of a function call.

```typescript
// ???
```
This means: write one or more lines of code here.

```typescript
.accounts({
    // ???
})
```
This means: fill in the account object with the required keys.

### 3. Using the Documentation

For each script, follow this workflow:

**Step A: Read the module section** in this README that corresponds to your script
- Example: Before completing `spl_init.ts`, read "Module 2 — SPL Tokens"
- Understand what the script should accomplish
- Note any key concepts (PDAs, ATAs, etc.)

**Step B: Examine the scaffold file** and identify all `???` markers

**Step C: Refer to the "What each script does" subsection** for implementation details

**Step D: Check the reference solution** in `ts-complete/` if you get stuck

### 4. Common Implementation Patterns

#### Creating a Mint (SPL Token)
```typescript
const mint = await createMint(
    connection,      // Your devnet connection
    keypair,         // Payer (who pays for the account)
    keypair.publicKey, // Mint authority (who can mint tokens)
    null,            // Freeze authority (null = no one can freeze)
    6                // Decimals (6 = 1 token = 1,000,000 base units)
);
```

#### Deriving a PDA (Program Derived Address)
```typescript
const [pdaAddress, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("seed_string"), somePublicKey.toBuffer()],
    programId
);
```

#### Calling an Anchor Program Method
```typescript
const signature = await program.methods
    .instructionName(arg1, arg2)
    .accounts({
        account1: publicKey1,
        account2: publicKey2,
        systemProgram: SystemProgram.programId,
    })
    .signers([keypair])
    .rpc();
```

#### Getting an Associated Token Account (ATA)
```typescript
const ata = await getAssociatedTokenAddress(
    mintPublicKey,    // Which token mint
    ownerPublicKey    // Who owns this ATA
);
```

### 5. Testing Your Implementation

After filling in the `???` markers:

```bash
cd ts

# Run your script
yarn <script-name>

# Example:
yarn spl_init
```

If successful, you'll see output like:
```
Your mint address is: 7xK8z...abc123
Success! Check out your TX here:
https://explorer.solana.com/tx/...
```

If you get an error:
1. Read the error message carefully
2. Check that all addresses are correct (not placeholder values)
3. Verify your wallet has enough SOL (`yarn airdrop` if needed)
4. Compare your code with the reference solution in `ts-complete/`

### 6. Progressive Difficulty

The modules increase in complexity:

| Module | Difficulty | Key Concepts |
|--------|-----------|-------------|
| Prerequisites | ⭐ Easy | Keypairs, transactions, basic program calls |
| SPL Tokens | ⭐⭐ Medium | Mints, ATAs, token operations, metadata |
| NFTs | ⭐⭐⭐ Medium-Hard | Metaplex, off-chain storage, Irys uploads |
| Vault Program | ⭐⭐⭐⭐ Hard | PDAs, CPIs, Anchor accounts, multi-instruction flows |

### 7. Key Resources

While completing exercises, reference:
- **Solana Web3.js Docs**: https://solana-labs.github.io/solana-web3.js/
- **SPL Token Docs**: https://spl.solana.com/token
- **Metaplex Docs**: https://developers.metaplex.com/
- **Anchor Book**: https://book.anchor-lang.com/

### 8. Verification Checklist

Before moving to the next script, ensure:
- [ ] All `???` markers replaced with working code
- [ ] Script runs without errors
- [ ] Transaction succeeds on-chain (check Explorer link)
- [ ] You understand WHY each line of code is needed
- [ ] You can explain the concept to someone else

---

## Module 1 — Prerequisites Scripts

These scripts introduce the fundamentals: keypair generation, airdrops, SOL transfers, and enrolling with the BFL on-chain program.

```
ts/prereqs/
├── keygen.ts       — generate a new wallet keypair
├── airdrop.ts      — request 2 SOL from devnet faucet
├── transfer.ts     — drain dev-wallet and send all SOL to BFL address
└── enroll.ts       — call the BFL prereq program and record your GitHub handle
```

### Run in order

```bash
cd ts

# 1. Generate a keypair (save output to dev-wallet.json)
yarn keygen

# 2. Airdrop 2 devnet SOL to dev wallet
yarn airdrop

# 3. Transfer all SOL from dev wallet to BFL address
yarn transfer

# 4. Enroll with your GitHub handle on-chain
yarn enroll
```

**What `enroll` does:**
1. Loads `bfl-wallet.json` as your signer
2. Derives a PDA using seeds `["prereq", yourPublicKey]` — this is your enrollment account
3. Calls `complete(github)` on the BFL prereq program to record your GitHub username on-chain

---

## Module 2 — SPL Tokens

SPL (Solana Program Library) tokens are fungible tokens on Solana — analogous to ERC-20 tokens on Ethereum.

### Key concepts

| Term | What it is |
|------|-----------|
| **Mint account** | The global definition of a token — stores supply, decimals, mint authority |
| **ATA** (Associated Token Account) | A wallet's balance account for a specific token mint |
| **Decimals** | How divisible the token is (6 decimals = 1 token = 1,000,000 base units) |
| **Mint authority** | The keypair allowed to create new tokens |

### Token creation workflow

```
Step 1: spl_init      — create the on-chain Mint account
Step 2: spl_metadata  — attach name, symbol, and logo URI to the mint
Step 3: spl_mint      — mint tokens into your ATA
Step 4: spl_transfer  — send tokens to another wallet's ATA
```

> **Important:** Attach metadata (step 2) before minting tokens (step 3). The metadata account is linked to the mint address; it does not matter whether tokens exist yet.

### Run in order

```bash
cd ts

# 1. Create the mint account — prints your new Mint address
yarn spl_init

# 2. Add name/symbol/logo to the mint (edit the file to set your details)
yarn spl_metadata

# 3. Mint tokens to your ATA
yarn spl_mint

# 4. Transfer tokens to another address
yarn spl_transfer
```

### What each script does

**`spl_init.ts`** — calls `createMint()` which creates a new account owned by the Token Program. You set the number of decimals and the mint authority. Copy the printed mint address — you will need it in every subsequent script.

**`spl_metadata.ts`** — calls `createMetadataAccountV3` from Metaplex. This creates a metadata PDA at a deterministic address derived from `["metadata", metaplex_program_id, mint_address]`. Fill in `name`, `symbol`, and `uri` (can be an HTTPS or Arweave URL to a JSON file).

**`spl_mint.ts`** — calls `mintTo()`, which creates an ATA for your wallet (if it does not exist) and mints the requested amount of tokens into it.

**`spl_transfer.ts`** — calls `transfer()`, moving tokens from your ATA to the recipient's ATA. Both accounts must exist first.

---

## Module 3 — NFTs

An NFT is a token with 0 decimals and a max supply of 1. Metaplex adds the `MasterEdition` account that enforces the supply constraint. Artwork and metadata are stored off-chain — we use **Irys** (a decentralized storage layer built on Arweave) to host them.

### Key concepts

| Term | What it is |
|------|-----------|
| **Metaplex** | The standard for NFT metadata and editions on Solana |
| **MasterEdition** | An account that sets max supply = 1, making the token non-fungible |
| **Irys** | Decentralized file storage; files are permanent and content-addressed |
| **Metadata JSON** | Off-chain JSON file following the Metaplex standard (name, image, attributes) |

### NFT creation workflow

```
Step 1: nft_image     — upload artwork file to Irys, get a URI
Step 2: nft_metadata  — upload metadata JSON to Irys, get a metadata URI
Step 3: nft_mint      — create the on-chain NFT using the metadata URI
```

### Run in order

```bash
cd ts

# 1. Upload your image to Irys — prints an image URI
yarn nft_image

# 2. Upload metadata JSON referencing your image URI — prints a metadata URI
yarn nft_metadata

# 3. Mint the NFT on-chain using your metadata URI
yarn nft_mint
```

### What each script does

**`nft_image.ts`** — reads a local image file, wraps it in a `GenericFile`, and uploads it via `umi.uploader.upload()`. The returned URI points to your image on Arweave. Copy this URI.

**`nft_metadata.ts`** — builds a JSON object following the Metaplex metadata standard:
```json
{
  "name": "My NFT",
  "symbol": "BFL",
  "description": "My first NFT",
  "image": "<image URI from step 1>",
  "attributes": [{"trait_type": "rarity", "value": "common"}],
  "properties": { "files": [{"type": "image/png", "uri": "<image URI>"}] }
}
```
Uploads this JSON and returns a metadata URI.

**`nft_mint.ts`** — calls `createNft()` from `@metaplex-foundation/mpl-token-metadata`. This creates the Mint, Metadata, and MasterEdition accounts in a single transaction. The `uri` field points to your metadata JSON.

---

## Module 4 — Vault Program

The vault is a custom Anchor program that lets you lock SOL, SPL tokens, and NFTs into a program-controlled account (PDA), then withdraw them later. It demonstrates Cross-Program Invocations (CPI), PDA authority, and Anchor account validation.

### Key concepts

| Term | What it is |
|------|-----------|
| **Anchor** | A framework for Solana programs that handles serialization and account validation |
| **CPI** | Cross-Program Invocation — one program calling another (e.g., vault → System Program) |
| **PDA authority** | A PDA that signs on behalf of the vault, since PDAs have no private key |

### Vault architecture

```
Your wallet (keypair)
    │
    ▼
vaultState account  (stores owner, bumps, score)
    │
    ├── seeds: ["auth", vaultState.publicKey]
    ▼
vaultAuth PDA  (authority — can sign CPIs)
    │
    ├── seeds: ["vault", vaultAuth.publicKey]
    ▼
vault PDA  (holds SOL)
    │
    └── (ATAs created on vault auth for SPL tokens and NFTs)
```

- **vaultState** is a regular keypair account you create at init. It stores ownership and the PDA bumps.
- **vaultAuth** is a PDA derived from vaultState. No private key exists — only the program can sign as vaultAuth.
- **vault** is a PDA derived from vaultAuth. SOL deposited here is locked until you withdraw.

### Run in order

```bash
cd ts

# Step 1: Initialize the vault (creates vaultState, vaultAuth, vault PDAs)
yarn vault_init
# Copy the printed vaultState public key — you need it for all subsequent scripts

# Step 2: Deposit SOL into the vault
yarn vault_deposit

# Step 2b: Withdraw SOL from the vault
yarn vault_withdraw

# Step 3: Deposit SPL tokens into the vault
yarn vault_deposit_spl

# Step 3b: Withdraw SPL tokens from the vault
yarn vault_withdraw_spl

# Step 4: Deposit an NFT into the vault
yarn vault_deposit_nft

# Step 4b: Withdraw the NFT from the vault
yarn vault_withdraw_nft

# Step 5: Close the vault and reclaim rent
yarn vault_close
```

### What each script does

**`vault_init.ts`** — generates a random `vaultState` keypair, derives `vaultAuth` and `vault` PDAs, and calls `program.methods.initialize()`. The vault is now ready to accept deposits.

**`vault_deposit.ts` / `vault_withdraw.ts`** — transfer SOL between your wallet and the vault PDA via CPI to the System Program. The vault program signs the CPI as `vaultAuth`.

**`vault_deposit_spl.ts` / `vault_withdraw_spl.ts`** — create ATAs for both the owner and the vault authority, then transfer tokens between them via CPI to the Token Program.

**`vault_deposit_nft.ts` / `vault_withdraw_nft.ts`** — same as SPL but includes the Metaplex `nftMetadata` and `nftMasterEdition` accounts for validation. The program verifies the NFT is legitimate before accepting it.

**`vault_close.ts`** — calls `closeAccount`, which closes the `vaultState` account and returns the rent lamports to your wallet.

---

## Glossary

| Term | Definition |
|------|-----------|
| **Account** | A unit of storage on Solana at a public key address |
| **Lamport** | The smallest unit of SOL (1 SOL = 1,000,000,000 lamports) |
| **Rent** | A deposit in lamports that keeps an account alive; accounts above the rent-exemption threshold are permanent |
| **Program** | An executable account — Solana's smart contract |
| **PDA** | Program Derived Address — a deterministic address with no private key, controlled by a program |
| **CPI** | Cross-Program Invocation — one program calling another program's instruction |
| **Mint** | The account that defines a token (supply, decimals, authority) |
| **ATA** | Associated Token Account — a deterministic token balance account for a wallet + mint pair |
| **IDL** | Interface Definition Language — a JSON file describing a program's instructions and accounts, used by Anchor clients |
| **Anchor** | A framework that auto-generates IDLs and client bindings for Solana programs |
| **Metaplex** | The standard protocol for NFT metadata on Solana |
| **Irys** | A decentralized storage service used to host NFT images and metadata permanently |
| **Devnet** | Solana's test network — SOL has no real value and can be airdropped freely |
| **Keypair** | A public/private key pair; the public key is the wallet address, the private key signs transactions |

---

## Troubleshooting

**`Error: Cannot find module '../bfl-wallet.json'`**
Your wallet file is missing. Run `yarn keygen` and save the output to `ts/bfl-wallet.json`.

**`Error: Cannot find module '../dev-wallet.json'`**
Your dev wallet file is missing. Save a keypair to `ts/dev-wallet.json` and rerun `yarn airdrop` / `yarn transfer`.

**`Error: Account does not exist`**
The address you filled in as `<address>` is a placeholder. Replace it with your actual on-chain address.

**`Error: insufficient funds`**
Your wallet has no devnet SOL. Run `yarn airdrop` or use `solana airdrop 2 <your-address> --url devnet`.

**`Error: 0x1` (custom program error)**
The program rejected your transaction. Double-check all account addresses — vaultState must be the one you created at init.

**Rust tests: `error[E0425]: cannot find value`**
Run `cargo test` from the `rs/` directory, not the repo root.
