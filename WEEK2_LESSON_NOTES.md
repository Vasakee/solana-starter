# BlockFuse Labs — Week 2: Solana Client-Side Development with TypeScript

> **Prerequisites**: You completed Week 1 (Solana concepts, installed Solana CLI, created a file-system wallet, understand accounts/programs/transactions at a high level).
>
> **What you will build this week**: You will go from zero to interacting with real Solana programs on devnet — generating wallets, moving SOL, creating tokens, minting NFTs, and operating a smart contract vault. Every script you complete runs against the live devnet blockchain.

---

## Table of Contents

1. [Environment Setup](#1-environment-setup)
2. [How This Repo Works](#2-how-this-repo-works)
3. [Module 1 — Wallet Operations & Enrollment](#3-module-1--wallet-operations--enrollment-tsprereqs)
   - 1A. Generate a Keypair (`keygen.ts`)
   - 1B. Claim Devnet SOL (`airdrop.ts`)
   - 1C. Transfer SOL (`transfer.ts`)
   - 1D. Enroll in BlockFuse (`enroll.ts`)
4. [Module 2 — SPL Tokens](#4-module-2--spl-tokens-tscluster1)
   - 2A. Create a Token Mint (`spl_init.ts`)
   - 2B. Mint Tokens (`spl_mint.ts`)
   - 2C. Transfer Tokens (`spl_transfer.ts`)
   - 2D. Add Token Metadata (`spl_metadata.ts`)
5. [Module 3 — NFTs](#5-module-3--nfts-tscluster1)
   - 3A. Upload Image (`nft_image.ts`)
   - 3B. Upload Metadata (`nft_metadata.ts`)
   - 3C. Mint the NFT (`nft_mint.ts`)
6. [Module 4 — Vault Program (Anchor)](#6-module-4--vault-program-anchor-tscluster1)
   - 4A. Initialize Vault (`vault_init.ts`)
   - 4B. Deposit SOL (`vault_deposit.ts`)
   - 4C. Withdraw SOL (`vault_withdraw.ts`)
   - 4D. Deposit SPL Tokens (`vault_deposit_spl.ts`)
   - 4E. Withdraw SPL Tokens (`vault_withdraw_spl.ts`)
   - 4F. Deposit NFT (`vault_deposit_nft.ts`)
   - 4G. Withdraw NFT (`vault_withdraw_nft.ts`)
   - 4H. Close Vault (`vault_close.ts`)
7. [Concept Reference](#7-concept-reference)
8. [Troubleshooting](#8-troubleshooting)
9. [Submission Checklist](#9-submission-checklist)

---

## 1. Environment Setup

### Install dependencies

```bash
cd ts
yarn install
```

This installs everything you need:

| Package | What it does |
|---------|-------------|
| `@solana/web3.js` | Core Solana SDK — keypairs, connections, transactions |
| `@solana/spl-token` | SPL Token operations — create mints, mint tokens, transfer |
| `@coral-xyz/anchor` | Anchor framework — interact with on-chain programs via IDL |
| `@metaplex-foundation/mpl-token-metadata` | NFT metadata standard |
| `@metaplex-foundation/umi-bundle-defaults` | Metaplex UMI framework |
| `@metaplex-foundation/umi-uploader-irys` | Upload files to Irys (decentralized storage) |
| `bs58` | Base58 encoding/decoding (Solana address format) |

### How to run scripts

Every script has a yarn command. From the `ts/` directory:

```bash
yarn keygen          # Run the keygen script
yarn airdrop         # Run the airdrop script
yarn spl_init        # Run the SPL init script
# ... and so on
```

### Project structure

```
ts/
├── prereqs/                  # Module 1 — Wallet & Enrollment
│   ├── keygen.ts             # Generate a new wallet keypair
│   ├── airdrop.ts            # Claim devnet SOL
│   ├── transfer.ts           # Transfer SOL between wallets
│   ├── enroll.ts             # Enroll in BlockFuse program
│   └── list_enrollments.ts   # View all enrolled fellows
│
├── cluster1/                 # Modules 2, 3, 4
│   ├── spl_init.ts           # Create SPL token mint
│   ├── spl_mint.ts           # Mint tokens to your wallet
│   ├── spl_transfer.ts       # Transfer tokens to someone
│   ├── spl_metadata.ts       # Attach metadata to your token
│   ├── nft_image.ts          # Upload NFT image to Irys
│   ├── nft_metadata.ts       # Upload NFT metadata JSON
│   ├── nft_mint.ts           # Mint the actual NFT
│   ├── vault_init.ts         # Initialize vault program
│   ├── vault_deposit.ts      # Deposit SOL into vault
│   ├── vault_withdraw.ts     # Withdraw SOL from vault
│   ├── vault_deposit_spl.ts  # Deposit SPL tokens into vault
│   ├── vault_withdraw_spl.ts # Withdraw SPL tokens from vault
│   ├── vault_deposit_nft.ts  # Deposit NFT into vault
│   ├── vault_withdraw_nft.ts # Withdraw NFT from vault
│   ├── vault_close.ts        # Close vault & recover rent
│   └── programs/
│       └── bfl_vault.ts      # Vault program IDL (DO NOT EDIT)
│
├── programs/                 # Program IDLs (DO NOT EDIT)
│   ├── blockfuse_enrollment.ts   # BlockFuse enrollment IDL
│   └── bfl_prereq.ts             # Prereq program IDL
│
├── bfl-wallet.json           # YOUR main wallet (you create this)
├── dev-wallet.json           # Throwaway wallet for transfer exercise
├── package.json              # Scripts & dependencies
└── tsconfig.json             # TypeScript config
```

---

## 2. How This Repo Works

Each script file in `ts/` is a **scaffold**. The boilerplate (imports, connections, wallet loading) is already written for you. Your job is to fill in the missing pieces where you see:

- `// const something = ???` — Replace `???` with the correct code
- `// ???` inside an object — Fill in the object properties
- Commented-out blocks — Uncomment and complete them
- `"<address>"` or `"<mint address>"` — Replace with actual addresses from previous steps

**The golden rule**: Each script builds on the output of the previous one. You must complete them **in order** within each module.

**How to verify**: Every script prints a Solana Explorer link on success. Click it. If you see a green checkmark on Explorer, you did it right.

---

## 3. Module 1 — Wallet Operations & Enrollment (`ts/prereqs/`)

> **Goal**: Understand how Solana wallets work, move SOL around, and register yourself on the BlockFuse enrollment program.
>
> **Concepts you will learn**: Keypairs, public/private keys, devnet, lamports, transactions, fees, Program Derived Addresses (PDAs), Anchor programs.

---

### 1A. Generate a Keypair — `keygen.ts`

**File**: `ts/prereqs/keygen.ts`
**Run**: `yarn keygen`
**Difficulty**: Beginner (read-only, nothing to fill in)

#### What this teaches

On Solana, your identity is a **keypair** — a pair of cryptographic keys:

- **Public Key** (32 bytes): Your address. You share this with everyone. It looks like `EpviT9SpKSK868pMixg9vu2rXrxeFqhZ3cxFW4UV7hMP`.
- **Secret Key** (64 bytes): Your private key. **Never share this.** It's stored as a JSON array of numbers like `[23, 141, 55, ...]`.

#### Code walkthrough

```typescript
import { Keypair } from "@solana/web3.js";

let kp = Keypair.generate()
console.log(`You've generated a new Solana wallet: ${kp.publicKey.toBase58()}

To save your wallet, copy and paste the following into a JSON file:

[${kp.secretKey}]`)
```

**Line by line:**

1. `Keypair.generate()` — Creates a brand-new random keypair using Ed25519 cryptography
2. `kp.publicKey.toBase58()` — Converts the 32-byte public key to a human-readable Base58 string
3. `kp.secretKey` — The raw 64-byte secret key as a `Uint8Array`

#### Your task

1. Run `yarn keygen`
2. Copy the `[numbers...]` output
3. Create `ts/bfl-wallet.json` and paste the array into it
4. **Also** run it again and save that output into `ts/dev-wallet.json` (this is a throwaway wallet for the transfer exercise)

#### Key concept: Why two wallets?

In the real world, you never send your entire balance from your main wallet. The `transfer.ts` exercise teaches fee calculation by draining a throwaway wallet (`dev-wallet.json`) to your main wallet (`bfl-wallet.json`). This mirrors how you'd consolidate funds in practice.

---

### 1B. Claim Devnet SOL — `airdrop.ts`

**File**: `ts/prereqs/airdrop.ts`
**Run**: `yarn airdrop`
**Difficulty**: Beginner (nothing to fill in)

#### What this teaches

Solana devnet is a test network where SOL has no real value. The **airdrop** faucet gives you free SOL for testing. This script claims 2 SOL.

#### Code walkthrough

```typescript
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import wallet from "../dev-wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try {
        const txhash = await connection.requestAirdrop(
            keypair.publicKey,
            2 * LAMPORTS_PER_SOL
        );
        console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
```

**Key concepts:**

| Concept | Explanation |
|---------|------------|
| `Connection` | A connection to a Solana RPC node. Think of it as your HTTP client to the blockchain. |
| `LAMPORTS_PER_SOL` | 1 SOL = 1,000,000,000 lamports (like wei to ETH). Always work in lamports. |
| `Keypair.fromSecretKey()` | Reconstructs a keypair from your saved secret key file. |
| `requestAirdrop()` | Asks the devnet faucet for free SOL. Returns a transaction hash. |
| `(async () => { ... })()` | An IIFE (Immediately Invoked Function Expression) — runs the async code immediately. |

#### Your task

1. Make sure `ts/dev-wallet.json` exists with your throwaway keypair
2. Run `yarn airdrop`
3. Click the Explorer link to verify — you should see 2 SOL credited

> **Note**: Devnet airdrops are rate-limited. If you get an error, wait 30 seconds and try again, or request a smaller amount.

---

### 1C. Transfer SOL — `transfer.ts`

**File**: `ts/prereqs/transfer.ts`
**Run**: `yarn transfer`
**Difficulty**: Beginner (nothing to fill in, but study the code carefully)

#### What this teaches

This is the most educational script in Module 1. It demonstrates:

1. **Building a transaction** from scratch using `SystemProgram.transfer`
2. **Calculating fees** before sending (so you can send your exact remaining balance)
3. **The transaction lifecycle**: build → get blockhash → estimate fee → adjust → sign → send → confirm

#### Code walkthrough — the fee trick

```typescript
// Step 1: Create a transaction that sends your ENTIRE balance
const transaction = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,         // Try to send everything
    })
);

// Step 2: Set the blockhash (required for all transactions)
transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
transaction.feePayer = from.publicKey;

// Step 3: Ask the network what the fee would be
const fee = (await connection.getFeeForMessage(
    transaction.compileMessage(), 'confirmed'
)).value || 0;

// Step 4: Remove the old instruction, add a new one with (balance - fee)
transaction.instructions.pop();
transaction.add(
    SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,   // NOW subtract the fee
    })
);

// Step 5: Sign and send
const signature = await sendAndConfirmTransaction(connection, transaction, [from]);
```

**Why this pattern matters**: On Solana, the fee payer must have enough SOL to cover fees AFTER the transaction executes. If you try to send your entire balance, the transaction will fail because there's nothing left for fees. This "estimate then adjust" pattern is used everywhere in production code.

#### Key concept: Transaction structure

```
Transaction
├── recentBlockhash    (prevents replay attacks — expires in ~60s)
├── feePayer           (who pays the network fee)
├── instructions[]     (what to actually do)
│   └── SystemProgram.transfer(from, to, lamports)
└── signatures[]       (cryptographic proof of authorization)
```

#### Your task

1. Make sure your `dev-wallet.json` has SOL (from the airdrop step)
2. Update the `to` address on line 7 to your `bfl-wallet.json` public key
3. Run `yarn transfer`
4. Verify on Explorer that your main wallet received the SOL

---

### 1D. Enroll in BlockFuse — `enroll.ts`

**File**: `ts/prereqs/enroll.ts`
**Run**: `yarn enroll`
**Difficulty**: Beginner (nothing to fill in, but critical to understand)

#### What this teaches

This is your first interaction with a **custom Solana program** (smart contract). You'll use the **Anchor framework** to call BlockFuse's enrollment program deployed at `5v3j8M2TNpbqJzxuP3K7sGdh848rqVLwhR6iK7iLAf7V`.

#### Code walkthrough

```typescript
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL } from "../programs/blockfuse_enrollment";

// 1. Set up the Anchor provider (connection + wallet bundled together)
const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed"
});

// 2. Create the program client from the IDL
const program = new Program(IDL, provider);

// 3. Derive the PDA where your enrollment data will be stored
const enrollment_seeds = [Buffer.from("enrollment"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
    enrollment_seeds, program.programId
);

// 4. Call the program's "complete" instruction
const txhash = await program.methods
    .complete(github)                    // Method name + arguments
    .accounts({                          // All accounts the instruction needs
        signer: keypair.publicKey,
        enrollment: enrollment_key,
        systemProgram: SystemProgram.programId,
    })
    .signers([keypair])                  // Who signs the transaction
    .rpc();                              // Send it!
```

#### Key concept: What is an IDL?

An **IDL** (Interface Definition Language) is a JSON description of a Solana program. It tells your TypeScript code:

- What **instructions** the program has (like API endpoints)
- What **accounts** each instruction needs
- What **arguments** each instruction takes
- What **data types** the program uses

Think of it like a Swagger/OpenAPI spec but for a Solana program. The IDL lives at `ts/programs/blockfuse_enrollment.ts`.

#### Key concept: What is a PDA?

A **Program Derived Address** (PDA) is a deterministic account address generated from **seeds**:

```
PDA = hash("enrollment" + your_public_key + program_id)
```

- PDAs are **deterministic**: the same seeds always produce the same address
- PDAs are **owned by the program**: only the program can write to them
- PDAs **don't have private keys**: they can't sign transactions, but the program can sign on their behalf

In this case, each fellow gets a unique enrollment PDA derived from their wallet address. This is how the program knows "this enrollment belongs to this wallet."

#### Key concept: Anchor's `.methods` pattern

```
program.methods
    .instructionName(arg1, arg2)    // WHAT to do + arguments
    .accounts({ ... })              // WHICH accounts to use
    .signers([ ... ])               // WHO authorizes it
    .rpc()                          // SEND it to the network
```

This pattern is the same for every Anchor program call in the rest of the course.

#### Your task

1. Update `github` on line 13 to your actual GitHub username
2. Make sure `bfl-wallet.json` has some SOL (at least 0.01)
3. Run `yarn enroll`
4. Verify with `yarn list_enrollments` — you should see your GitHub handle

---

## 4. Module 2 — SPL Tokens (`ts/cluster1/`)

> **Goal**: Create your own fungible token on Solana, mint it, add metadata, and transfer it.
>
> **Concepts you will learn**: SPL Token Program, mints, token accounts, Associated Token Accounts (ATAs), decimals, metadata.
>
> **Important**: From here on, you're filling in code. Look for `???` placeholders and commented-out blocks.

---

### Background: How SPL tokens work

On Solana, tokens are NOT stored in your wallet directly. Instead:

```
Token Mint (the "factory")
    │
    ├── Your Token Account (ATA) — holds YOUR balance
    ├── Bob's Token Account (ATA) — holds BOB's balance
    └── Alice's Token Account (ATA) — holds ALICE's balance
```

- A **Mint** is like a token factory. It defines the token (decimals, supply, who can mint).
- A **Token Account** holds a specific person's balance of a specific token.
- An **ATA** (Associated Token Account) is a deterministic token account — given your wallet and a mint, the ATA address is always the same.

Think of it like: the Mint is the currency itself (e.g., "BFL Token"), and each person has a separate bank account for that currency.

---

### 2A. Create a Token Mint — `spl_init.ts`

**File**: `ts/cluster1/spl_init.ts`
**Run**: `yarn spl_init`
**Difficulty**: Easy (1 line to fill in)

#### What you're doing

Creating a brand-new token on Solana. You become the **mint authority** (the only one who can create new tokens) and the **freeze authority** (can freeze accounts).

#### The code you need to write

Find this on line 15:

```typescript
// const mint = ???
```

Replace it with:

```typescript
const mint = await createMint(
    connection,          // Which network
    keypair,             // Who pays for the transaction
    keypair.publicKey,   // Mint authority (who can create tokens)
    keypair.publicKey,   // Freeze authority (who can freeze accounts)
    6                    // Decimals (6 = like USDC)
);
console.log(`Your mint address: ${mint.toBase58()}`);
```

#### Understanding the parameters

| Parameter | Value | Why |
|-----------|-------|-----|
| `connection` | Devnet RPC | Tells the SDK which network to use |
| `keypair` | Your wallet | Pays the transaction fee + rent for the new account |
| `keypair.publicKey` | Mint authority | You control who can mint new tokens |
| `keypair.publicKey` | Freeze authority | You control who can freeze token accounts |
| `6` | Decimals | 6 decimals means 1 token = 1,000,000 base units |

#### Key concept: Decimals

Blockchains don't have floating-point numbers. Instead:

```
6 decimals: 1 token    = 1,000,000 base units
            0.5 tokens = 500,000 base units
            0.000001   = 1 base unit (smallest possible amount)
```

USDC on Solana uses 6 decimals. SOL uses 9 decimals (lamports).

#### After running

**Save the mint address** — you need it for the next 3 scripts. It will look something like `7EYnhQoR9YM3N7UoaKRoA44Uy8JeaZV3qyouov87awMs`.

---

### 2B. Mint Tokens — `spl_mint.ts`

**File**: `ts/cluster1/spl_mint.ts`
**Run**: `yarn spl_mint`
**Difficulty**: Easy (2 sections to fill in)

#### Before you start

Replace `"<mint address>"` on line 15 with the mint address from the previous step.

#### What you're doing

Two things:

1. **Create an ATA** (Associated Token Account) — your "bank account" for this specific token
2. **Mint tokens** into that ATA

#### The code you need to write

**Section 1** — Create the ATA (line 20):

```typescript
const ata = await getOrCreateAssociatedTokenAccount(
    connection,          // Which network
    keypair,             // Who pays for account creation
    mint,                // Which token
    keypair.publicKey    // Whose ATA to create (yours)
);
console.log(`Your ata is: ${ata.address.toBase58()}`);
```

**Section 2** — Mint tokens (line 24):

```typescript
const mintTx = await mintTo(
    connection,          // Which network
    keypair,             // Who pays the fee
    mint,                // Which token to mint
    ata.address,         // Where to mint TO (your ATA)
    keypair,             // Mint authority (must match createMint)
    1000n * token_decimals  // Amount: 1000 tokens (with 6 decimals)
);
console.log(`Your mint txid: ${mintTx}`);
```

#### Key concept: `getOrCreateAssociatedTokenAccount`

This function is smart:

- If your ATA already exists → returns it
- If it doesn't exist → creates it, then returns it

This is why it's called `getOrCreate`. You'll use this pattern many more times.

#### Key concept: BigInt (`n` suffix)

Notice `1000n * token_decimals`. The `n` makes it a BigInt. Solana token amounts can be very large numbers, so we use BigInt to avoid JavaScript's floating-point precision issues.

`token_decimals` is defined at the top of the file as `1_000_000n` (10^6 for 6 decimals). So `1000n * 1_000_000n = 1_000_000_000n` base units = 1000 tokens.

---

### 2C. Transfer Tokens — `spl_transfer.ts`

**File**: `ts/cluster1/spl_transfer.ts`
**Run**: `yarn spl_transfer`
**Difficulty**: Medium (3 sections to fill in)

#### Before you start

1. Replace `"<mint address>"` on line 13 with your mint address
2. Replace `"<receiver address>"` on line 16 with a classmate's wallet public key (or your own second wallet)

#### What you're doing

Transferring SPL tokens from your wallet to another wallet. This requires:

1. Getting/creating YOUR ATA (the source)
2. Getting/creating the RECIPIENT's ATA (the destination)
3. Calling `transfer`

#### The code you need to write

```typescript
// 1. Get your ATA (source)
const fromAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, keypair.publicKey
);

// 2. Get/create recipient's ATA (destination)
const toAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, to    // Note: keypair pays, but ATA is for `to`
);

// 3. Transfer tokens
const tx = await transfer(
    connection,
    keypair,              // Fee payer + authority
    fromAta.address,      // Source token account
    toAta.address,        // Destination token account
    keypair.publicKey,    // Owner of source account
    1n * 1_000_000n       // Amount (1 token with 6 decimals)
);
console.log(`Transfer txid: ${tx}`);
```

#### Key insight: Who pays for the recipient's ATA?

YOU do. When you call `getOrCreateAssociatedTokenAccount` for the recipient, if they don't already have an ATA for your token, the function creates one and you pay the rent (~0.002 SOL). This is a cost of being the sender.

---

### 2D. Add Token Metadata — `spl_metadata.ts`

**File**: `ts/cluster1/spl_metadata.ts`
**Run**: `yarn spl_metadata`
**Difficulty**: Medium-Hard (3 objects + 1 function call to fill in)

#### Before you start

Replace `"<mint address>"` on line 13 with your mint address (use the `publicKey()` helper, not `new PublicKey()`— this file uses Metaplex UMI, not web3.js).

#### Background: Why metadata?

Without metadata, your token is just an anonymous address. Metadata gives it:

- A **name** (e.g., "BlockFuse Token")
- A **symbol** (e.g., "BFL")
- A **URI** pointing to a JSON file with more details (icon, description)

Metadata is stored in a special PDA owned by the Metaplex Token Metadata program.

#### Background: What is UMI?

UMI is Metaplex's newer framework that replaces the older `@metaplex-foundation/js`. It uses its own keypair/signer types (not web3.js's). That's why the top of the file converts your wallet into UMI format:

```typescript
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));
```

#### The code you need to write

**Section 1** — The accounts object:

```typescript
let accounts: CreateMetadataAccountV3InstructionAccounts = {
    mint: mint,
    mintAuthority: signer,
}
```

**Section 2** — The data object (your token's identity):

```typescript
let data: DataV2Args = {
    name: "BlockFuse Token",       // Pick your own name
    symbol: "BFL",                 // Pick your own symbol (max 10 chars)
    uri: "",                       // Empty for now (could point to JSON)
    sellerFeeBasisPoints: 0,       // Royalty: 0% (not an NFT)
    creators: null,                // No creators list
    collection: null,              // Not part of a collection
    uses: null                     // No usage tracking
}
```

**Section 3** — The args object:

```typescript
let args: CreateMetadataAccountV3InstructionArgs = {
    data,
    isMutable: true,              // Can update metadata later
    collectionDetails: null       // Not a collection parent
}
```

**Section 4** — Uncomment the transaction (lines 36-45):

```typescript
let tx = createMetadataAccountV3(
    umi,
    {
        ...accounts,
        ...args
    }
)

let result = await tx.sendAndConfirm(umi);
console.log(bs58.encode(result.signature));
```

---

## 5. Module 3 — NFTs (`ts/cluster1/`)

> **Goal**: Create a full NFT — upload the image, create the metadata JSON, and mint the NFT on-chain.
>
> **Concepts you will learn**: Decentralized storage (Irys), Metaplex NFT standard, metadata JSON structure, the createNft instruction.
>
> **Important**: NFT operations require SOL for storage fees. Make sure your wallet has at least 0.5 SOL.

---

### Background: The anatomy of a Solana NFT

A Solana NFT is actually three things:

```
1. Image file        → Stored on Irys (decentralized storage)
                        Returns: https://arweave.net/abc123...

2. Metadata JSON     → Also stored on Irys
                        Contains: name, symbol, image URL, attributes
                        Returns: https://arweave.net/def456...

3. On-chain Mint     → A token with supply = 1, decimals = 0
                        Points to the metadata JSON URI
```

You build from the bottom up: image first, then metadata (which references the image), then the mint (which references the metadata).

---

### 3A. Upload Image — `nft_image.ts`

**File**: `ts/cluster1/nft_image.ts`
**Run**: `yarn nft_image`
**Difficulty**: Medium (2 sections to fill in)

#### Before you start

Place an image file (PNG, JPG, or GIF) somewhere accessible. You'll reference its path in the code.

#### The code you need to write

```typescript
// 1. Load and convert your image
const imageFile = await readFile("./cluster1/images/generug.png"); // Your image path
const image = createGenericFile(imageFile, "generug.png", {
    contentType: "image/png"   // Match your file type
});

// 2. Upload to Irys
const [myUri] = await umi.uploader.upload([image]);
console.log("Your image URI: ", myUri);
```

#### Key concept: Irys (formerly Bundlr)

Irys is a decentralized storage network built on Arweave. When you upload a file:

1. You pay a small fee in SOL
2. The file is stored permanently on Arweave
3. You get back a URI like `https://arweave.net/abc123`

This URI is permanent and immutable — your NFT image will exist forever.

#### After running

**Save the image URI** — you need it for the next step.

---

### 3B. Upload Metadata — `nft_metadata.ts`

**File**: `ts/cluster1/nft_metadata.ts`
**Run**: `yarn nft_metadata`
**Difficulty**: Medium (metadata object + upload)

#### The code you need to write

```typescript
// 1. Reference your image URI from the previous step
const image = "https://arweave.net/YOUR_IMAGE_URI_HERE";

// 2. Build the metadata JSON (Metaplex standard)
const metadata = {
    name: "My BlockFuse NFT",
    symbol: "BFLNFT",
    description: "An NFT created during BlockFuse Week 2",
    image: image,
    attributes: [
        { trait_type: "Cohort", value: "2" },
        { trait_type: "Rarity", value: "Legendary" }
    ],
    properties: {
        files: [
            {
                type: "image/png",
                uri: image
            },
        ]
    },
    creators: []
};

// 3. Upload the metadata JSON to Irys
const myUri = await umi.uploader.uploadJson(metadata);
console.log("Your metadata URI: ", myUri);
```

#### Key concept: Metadata JSON structure

This follows the [Metaplex Token Metadata Standard](https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure):

| Field | Purpose |
|-------|---------|
| `name` | Display name of the NFT |
| `symbol` | Short symbol (like a ticker) |
| `description` | Human-readable description |
| `image` | URL to the image file |
| `attributes` | Array of trait_type/value pairs (for marketplaces) |
| `properties.files` | Links to associated files with MIME types |
| `creators` | List of creator addresses and revenue shares |

#### After running

**Save the metadata URI** — you need it for the mint step.

---

### 3C. Mint the NFT — `nft_mint.ts`

**File**: `ts/cluster1/nft_mint.ts`
**Run**: `yarn nft_mint`
**Difficulty**: Medium (1 function call to complete)

#### The code you need to write

Uncomment and complete lines 19-24:

```typescript
let tx = createNft(umi, {
    mint: mint,                    // The generated signer (line 16)
    name: "My BlockFuse NFT",
    symbol: "BFLNFT",
    uri: "https://arweave.net/YOUR_METADATA_URI_HERE",
    sellerFeeBasisPoints: percentAmount(5),   // 5% royalty
});

let result = await tx.sendAndConfirm(umi);
const signature = base58.encode(result.signature);

console.log(`Successfully Minted! Check out your TX here:
https://explorer.solana.com/tx/${signature}?cluster=devnet`);

console.log("Mint Address: ", mint.publicKey);
```

#### Key concept: What `createNft` does under the hood

One function call, but Metaplex does A LOT:

1. Creates a new token mint with **0 decimals** and **supply of 1**
2. Creates the metadata account (PDA)
3. Creates the master edition account (proves it's an NFT, not a fungible token)
4. Mints exactly 1 token to your wallet
5. Removes mint authority (so no more can ever be minted)

#### Key concept: `percentAmount` and royalties

`percentAmount(5)` = 5% royalty = 500 basis points. This means marketplaces should pay 5% to creators on secondary sales. Note: enforcement depends on the marketplace.

#### After running

**Save the mint address** — you'll need it if you want to deposit the NFT into the vault later.

---

## 6. Module 4 — Vault Program (Anchor) (`ts/cluster1/`)

> **Goal**: Interact with a deployed Anchor program that acts as a vault — deposit SOL, SPL tokens, and NFTs into it, then withdraw them.
>
> **Concepts you will learn**: Anchor program interaction, PDA chains, BN (Big Number), multi-level PDAs, ATA management for programs, account closure.
>
> **This is the hardest module.** Take your time. Each script follows the same pattern but adds complexity.

---

### Background: How the vault works

The vault program (`D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o`) uses a **chain of PDAs**:

```
You (wallet)
  │
  ├── vaultState (random keypair — stores metadata)
  │     │
  │     └── vaultAuth (PDA from seeds: ["auth", vaultState])
  │           │
  │           └── vault (PDA from seeds: ["vault", vaultAuth])
  │                 │
  │                 └── Holds your SOL / SPL tokens / NFTs
```

- **vaultState**: An account that stores who owns the vault (your pubkey), plus bump seeds
- **vaultAuth**: A PDA that acts as the authority — the program can sign with this
- **vault**: The actual account that holds funds

This two-level PDA pattern (auth → vault) is a common security pattern. The vault's authority isn't your wallet — it's a PDA. Only the program can control the funds.

### Background: The vault IDL

The vault program's IDL is at `ts/cluster1/programs/bfl_vault.ts`. **Do not edit this file.** It defines 8 instructions:

| Instruction | What it does | Accounts needed |
|-------------|-------------|-----------------|
| `initialize` | Creates the vault | owner, vaultState, vaultAuth, vault, systemProgram |
| `deposit` | Deposits SOL | owner, vaultState, vaultAuth, vault, systemProgram |
| `withdraw` | Withdraws SOL | owner, vaultState, vaultAuth, vault, systemProgram |
| `depositSpl` | Deposits SPL tokens | + ownerAta, vaultAta, tokenMint, tokenProgram, associatedTokenProgram |
| `withdrawSpl` | Withdraws SPL tokens | (same as depositSpl) |
| `depositNft` | Deposits an NFT | + nftMetadata, nftMasterEdition, metadataProgram |
| `withdrawNft` | Withdraws an NFT | (same as depositNft) |
| `closeAccount` | Closes the vault | owner, closeVaultState, vaultState, systemProgram |

---

### 4A. Initialize Vault — `vault_init.ts`

**File**: `ts/cluster1/vault_init.ts`
**Run**: `yarn vault_init`
**Difficulty**: Medium (2 PDAs + 1 method call)

#### The code you need to write

**Step 1** — Derive vaultAuth PDA (line 40):

```typescript
const vaultAuth = PublicKey.findProgramAddressSync(
    [Buffer.from("auth"), vaultState.publicKey.toBuffer()],
    program.programId
)[0];
```

**Step 2** — Derive vault PDA (line 44):

```typescript
const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultAuth.toBuffer()],
    program.programId
)[0];
```

**Step 3** — Uncomment and fill in the method call (lines 49-52):

```typescript
const signature = await program.methods.initialize()
.accounts({
    owner: keypair.publicKey,
    vaultState: vaultState.publicKey,
    vaultAuth: vaultAuth,
    vault: vault,
    systemProgram: SystemProgram.programId,
}).signers([keypair, vaultState]).rpc();
console.log(`Init success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

#### Why two signers?

`[keypair, vaultState]` — Your wallet signs (as owner) AND the vaultState keypair signs (because it's being initialized as a new account). After initialization, vaultState becomes an on-chain account and you won't need its keypair as a signer anymore.

#### After running

**Save TWO things:**

1. The **vault public key** (printed on line 36) — e.g., `J8qKEmQpadFeBuXAVseH8GNrvsyBhMT8MHSVD3enRgJz`
2. The **program address** from line 30 — `D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o`

You need both for every subsequent vault script.

---

### 4B. Deposit SOL — `vault_deposit.ts`

**File**: `ts/cluster1/vault_deposit.ts`
**Run**: `yarn vault_deposit`
**Difficulty**: Medium (2 PDAs + 1 method call)

#### Before you start

1. Replace `"<address>"` on line 33 with the vault **program** address: `D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o`
2. Replace `"<address>"` on line 36 with your **vaultState** public key from the init step

#### The code you need to write

**PDAs** (same derivation as vault_init):

```typescript
const vaultAuth = PublicKey.findProgramAddressSync(
    [Buffer.from("auth"), vaultState.toBuffer()],
    program.programId
)[0];

const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultAuth.toBuffer()],
    program.programId
)[0];
```

**Method call** (lines 46-53):

```typescript
const signature = await program.methods
.deposit(new BN(0.1 * LAMPORTS_PER_SOL))    // 0.1 SOL in lamports
.accounts({
    owner: keypair.publicKey,
    vaultState: vaultState,
    vaultAuth: vaultAuth,
    vault: vault,
    systemProgram: SystemProgram.programId,
})
.signers([keypair])
.rpc();
console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

#### Key concept: BN (Big Number)

```typescript
import { BN } from "@coral-xyz/anchor";

new BN(0.1 * LAMPORTS_PER_SOL)   // 100,000,000 lamports = 0.1 SOL
new BN(1_000_000)                 // 1 token (with 6 decimals)
```

Anchor uses `BN` for all `u64` arguments. It's similar to BigInt but compatible with Anchor's serialization.

> **Note**: You'll need to add `LAMPORTS_PER_SOL` to your import from `@solana/web3.js` if it's not already there, or just use a raw number like `new BN(100000000)`.

---

### 4C. Withdraw SOL — `vault_withdraw.ts`

**File**: `ts/cluster1/vault_withdraw.ts`
**Run**: `yarn vault_withdraw`
**Difficulty**: Medium (same pattern as deposit)

#### Before you start

Same setup as deposit — fill in the program address and vaultState address.

#### The code you need to write

Identical PDA derivation, then:

```typescript
const signature = await program.methods
.withdraw(new BN(0.05 * LAMPORTS_PER_SOL))   // Withdraw 0.05 SOL
.accounts({
    owner: keypair.publicKey,
    vaultState: vaultState,
    vaultAuth: vaultAuth,
    vault: vault,
    systemProgram: SystemProgram.programId,
})
.signers([keypair])
.rpc();
console.log(`Withdraw success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

---

### 4D. Deposit SPL Tokens — `vault_deposit_spl.ts`

**File**: `ts/cluster1/vault_deposit_spl.ts`
**Run**: `yarn vault_deposit_spl`
**Difficulty**: Hard (PDAs + ATAs + method call with many accounts)

#### Before you start

1. Replace all `"<address>"` placeholders with the correct values:
   - Line 37: Program address
   - Line 40: vaultState public key
   - Line 51: Your SPL token mint address (from Module 2)
2. Fill in `token_decimals` (line 48): `const token_decimals = 1_000_000n;` (for 6 decimals)

#### The code you need to write

**PDAs** (same as before):

```typescript
const vaultAuth = PublicKey.findProgramAddressSync(
    [Buffer.from("auth"), vaultState.toBuffer()],
    program.programId
)[0];

const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultAuth.toBuffer()],
    program.programId
)[0];
```

**ATAs** — You need two token accounts:

```typescript
// YOUR token account (source)
const ownerAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, keypair.publicKey
);

// THE VAULT's token account (destination)
const vaultAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, vaultAuth, true    // true = allowOwnerOffCurve (PDA!)
);
```

**Critical**: Notice the `true` parameter for `vaultAta`. This is `allowOwnerOffCurve`. PDAs are "off curve" (they don't have private keys), so you must set this to `true` when creating an ATA for a PDA.

**Method call:**

```typescript
const signature = await program.methods
.depositSpl(new BN(1_000_000))     // 1 token
.accounts({
    owner: keypair.publicKey,
    ownerAta: ownerAta.address,
    vaultState: vaultState,
    vaultAuth: vaultAuth,
    vaultAta: vaultAta.address,
    tokenMint: mint,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
})
.signers([keypair])
.rpc();
```

> **Note**: You may need to add `ASSOCIATED_TOKEN_PROGRAM_ID` to your import from `@solana/spl-token`.

---

### 4E. Withdraw SPL Tokens — `vault_withdraw_spl.ts`

**File**: `ts/cluster1/vault_withdraw_spl.ts`
**Run**: `yarn vault_withdraw_spl`
**Difficulty**: Hard (same pattern as deposit SPL)

Same structure as 4D but calls `.withdrawSpl()` instead of `.depositSpl()`. Fill in all the same PDAs, ATAs, and accounts.

---

### 4F. Deposit NFT — `vault_deposit_nft.ts`

**File**: `ts/cluster1/vault_deposit_nft.ts`
**Run**: `yarn vault_deposit_nft`
**Difficulty**: Hard (PDAs + metadata PDAs + ATAs + method call)

#### Before you start

Replace `"<address>"` on line 50 with your NFT mint address (from Module 3).

#### New concept: Metadata PDAs

NFTs have two additional PDA accounts managed by the Metaplex metadata program:

```typescript
const metadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// The metadata account — stores name, symbol, uri, etc.
const metadataAccount = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), metadataProgram.toBuffer(), mint.toBuffer()],
    metadataProgram
)[0];

// The master edition — proves this is an NFT (supply = 1)
const masterEdition = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), metadataProgram.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
    metadataProgram
)[0];
```

These are already computed for you in the scaffold (lines 55-70). You need to fill in the ATAs and method call.

#### The code you need to write

**ATAs:**

```typescript
const ownerAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, keypair.publicKey
);

const vaultAta = await getOrCreateAssociatedTokenAccount(
    connection, keypair, mint, vaultAuth, true
);
```

**Method call:**

```typescript
const signature = await program.methods
.depositNft()                     // No arguments for NFT deposit
.accounts({
    owner: keypair.publicKey,
    ownerAta: ownerAta.address,
    vaultState: vaultState,
    vaultAuth: vaultAuth,
    vaultAta: vaultAta.address,
    tokenMint: mint,
    nftMetadata: metadataAccount,
    nftMasterEdition: masterEdition,
    metadataProgram: metadataProgram,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
})
.signers([keypair])
.rpc();
```

---

### 4G. Withdraw NFT — `vault_withdraw_nft.ts`

**File**: `ts/cluster1/vault_withdraw_nft.ts`
**Run**: `yarn vault_withdraw_nft`
**Difficulty**: Hard (same pattern as deposit NFT)

Same structure as 4F but calls `.withdrawNft()`.

---

### 4H. Close Vault — `vault_close.ts`

**File**: `ts/cluster1/vault_close.ts`
**Run**: `yarn vault_close`
**Difficulty**: Medium

#### What this teaches

When you close an account on Solana, the rent (SOL locked in the account) is returned to you. This is like getting your security deposit back.

#### The code you need to write

```typescript
const closeVaultState = PublicKey.findProgramAddressSync(
    [Buffer.from("close"), vaultState.toBuffer()],
    program.programId
)[0];
```

> **Note**: Check the IDL — `closeAccount` needs `closeVaultState`, `vaultState`, `owner`, and `systemProgram`. The `closeVaultState` derivation depends on the specific program implementation. Read the IDL's `closeAccount` instruction accounts carefully.

**Method call:**

```typescript
const signature = await program.methods
.closeAccount()
.accounts({
    owner: keypair.publicKey,
    closeVaultState: closeVaultState,
    vaultState: vaultState,
    systemProgram: SystemProgram.programId,
})
.signers([keypair])
.rpc();
console.log(`Close success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

---

## 7. Concept Reference

### Quick reference table

| Concept | What it is | Where you'll see it |
|---------|-----------|-------------------|
| **Keypair** | Public + private key pair | Every script |
| **Lamports** | Smallest SOL unit (1 SOL = 10^9 lamports) | airdrop, transfer, vault |
| **Connection** | HTTP client to a Solana RPC node | Every script |
| **Transaction** | A bundle of instructions sent to the network | transfer.ts |
| **Instruction** | A single operation (transfer, mint, etc.) | All scripts |
| **PDA** | Deterministic address from seeds + program ID | enroll, all vault scripts |
| **Mint** | Token factory (defines decimals, authorities) | spl_init, spl_mint |
| **ATA** | Your "bank account" for a specific token | spl_mint, spl_transfer, vault_*_spl |
| **IDL** | JSON description of a program's interface | enroll, all vault scripts |
| **Anchor** | Framework for building/interacting with programs | enroll, all vault scripts |
| **UMI** | Metaplex's framework for NFT operations | spl_metadata, nft_* |
| **Irys** | Decentralized storage for NFT files | nft_image, nft_metadata |
| **BN** | Big Number type for u64 arguments | vault_deposit, vault_withdraw |

### Commitment levels

You'll see `"confirmed"` and `"finalized"` in the code:

| Level | Speed | Safety | Use when |
|-------|-------|--------|----------|
| `processed` | ~400ms | Might be rolled back | Never (for our purposes) |
| `confirmed` | ~5s | Very likely permanent | Most operations |
| `finalized` | ~12s | 100% permanent | Financial operations |

### Common error messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `Attempt to debit an account but found no record of a prior credit` | Account has no SOL | Run airdrop first |
| `Transaction simulation failed: Blockhash not found` | Transaction expired | Try again (network was slow) |
| `Account already in use` | PDA/account already exists | You already ran this script — that's OK |
| `0x1` | Insufficient funds | Need more SOL in wallet |
| `0x0` | Generic program error | Check your accounts are correct |
| `AccountNotFound` | Wrong address | Double-check your paste-in addresses |

---

## 8. Troubleshooting

### "I get a rate limit error on airdrop"

Devnet airdrops are rate-limited. Options:

1. Wait 30 seconds and try again
2. Use the Solana faucet website: https://faucet.solana.com
3. Use `yarn airdrop_to_wallet` tool and request a smaller amount

### "My transaction keeps failing"

1. Check your wallet balance: `solana balance <your-pubkey> --url devnet`
2. Make sure you're on devnet (not mainnet or localhost)
3. Verify all addresses are correct (copy-paste errors are the #1 cause)

### "I lost my vaultState address"

If you closed your terminal and lost the vaultState public key from `vault_init`:

- You'll need to run `vault_init` again to create a new vault
- The old vault still exists but you need the keypair to interact with it

**Pro tip**: After running `vault_init`, immediately paste the vaultState address into all the other vault_*.ts files.

### "createMint/mintTo returns undefined"

Make sure you're `await`-ing the call. All Solana operations are async.

### "My NFT image won't upload"

- Make sure the image file path is correct (relative to `ts/`)
- Make sure you have enough SOL (uploading costs ~0.01 SOL)
- Check your internet connection

---

## 9. Submission Checklist

Complete each module in order. For each task, paste your **Explorer transaction link** as proof of completion.

### Module 1 — Wallet & Enrollment

- [ ] `keygen` — Generated wallet, saved to `bfl-wallet.json`
- [ ] `airdrop` — Claimed devnet SOL (Explorer link: _______)
- [ ] `transfer` — Transferred SOL to main wallet (Explorer link: _______)
- [ ] `enroll` — Enrolled in BlockFuse program (Explorer link: _______)
- [ ] Verified enrollment with `yarn list_enrollments`

### Module 2 — SPL Tokens

- [ ] `spl_init` — Created token mint (Mint address: _______)
- [ ] `spl_mint` — Minted tokens to your ATA (Explorer link: _______)
- [ ] `spl_transfer` — Transferred tokens to a classmate (Explorer link: _______)
- [ ] `spl_metadata` — Added metadata to your token (Explorer link: _______)

### Module 3 — NFTs

- [ ] `nft_image` — Uploaded image to Irys (Image URI: _______)
- [ ] `nft_metadata` — Uploaded metadata JSON (Metadata URI: _______)
- [ ] `nft_mint` — Minted NFT on-chain (Explorer link: _______)

### Module 4 — Vault Program

- [ ] `vault_init` — Initialized vault (Explorer link: _______)
- [ ] `vault_deposit` — Deposited SOL (Explorer link: _______)
- [ ] `vault_withdraw` — Withdrew SOL (Explorer link: _______)
- [ ] `vault_deposit_spl` — Deposited SPL tokens (Explorer link: _______)
- [ ] `vault_withdraw_spl` — Withdrew SPL tokens (Explorer link: _______)
- [ ] `vault_deposit_nft` — Deposited NFT (Explorer link: _______)
- [ ] `vault_withdraw_nft` — Withdrew NFT (Explorer link: _______)
- [ ] `vault_close` — Closed vault and recovered rent (Explorer link: _______)

---

**Total tasks**: 20
**Estimated time**: 4-6 hours (spread across the week)
**Difficulty curve**: Modules 1-2 (beginner) → Module 3 (intermediate) → Module 4 (advanced)

> **Remember**: Every address and transaction on Solana devnet is public. Your instructors can verify all your work by looking at the blockchain. The enrollment program at `5v3j8M2TNpbqJzxuP3K7sGdh848rqVLwhR6iK7iLAf7V` records your GitHub username permanently.

Good luck, fellows.
