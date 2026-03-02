# BlockFuse Enrollment System Architecture

## Complete System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SOLANA DEVNET BLOCKCHAIN                             │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  BlockFuse Enrollment Program                                       │    │
│  │  Program ID: <YOUR_DEPLOYED_ID>                                    │    │
│  │                                                                      │    │
│  │  Instructions:                                                       │    │
│  │  ┌────────────────┐  ┌───────────────┐                            │    │
│  │  │  complete()    │  │   update()    │                            │    │
│  │  │                │  │               │                            │    │
│  │  │ Creates new    │  │ Updates       │                            │    │
│  │  │ enrollment     │  │ existing      │                            │    │
│  │  │ account        │  │ enrollment    │                            │    │
│  │  └────────────────┘  └───────────────┘                            │    │
│  │                                                                      │    │
│  │  Storage (PDAs):                                                    │    │
│  │  ┌──────────────────────────────────────────────────────────┐     │    │
│  │  │ PDA: ["enrollment", student_wallet_1]                    │     │    │
│  │  │  ├─ github: "alice"                                       │     │    │
│  │  │  └─ key: 5XzY...                                         │     │    │
│  │  ├──────────────────────────────────────────────────────────┤     │    │
│  │  │ PDA: ["enrollment", student_wallet_2]                    │     │    │
│  │  │  ├─ github: "bob"                                         │     │    │
│  │  │  └─ key: 8KmP...                                         │     │    │
│  │  ├──────────────────────────────────────────────────────────┤     │    │
│  │  │ PDA: ["enrollment", student_wallet_N]                    │     │    │
│  │  │  ├─ github: "charlie"                                     │     │    │
│  │  │  └─ key: 9NqX...                                         │     │    │
│  │  └──────────────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                         RPC Calls (JSON-RPC)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATIONS                                  │
│                                                                              │
│  ┌────────────────────────┐    ┌──────────────────────────┐               │
│  │  TypeScript Client     │    │  Rust Client (Optional)  │               │
│  │  (ts/prereqs/)         │    │  (rs/src/)               │               │
│  │                        │    │                          │               │
│  │  • enroll.ts           │    │  • prereqs.rs            │               │
│  │  • Uses @solana/web3   │    │  • Uses solana-sdk       │               │
│  │  • Uses @coral-xyz/    │    │  • Direct program calls  │               │
│  │    anchor              │    │                          │               │
│  └────────────────────────┘    └──────────────────────────┘               │
│                                                                              │
│  Dependencies:                                                               │
│  • @solana/web3.js        - Core Solana SDK                                │
│  • @coral-xyz/anchor      - Anchor framework client                        │
│  • IDL (Interface)        - Program interface definition                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │
                            User Interaction
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STUDENTS                                        │
│                                                                              │
│  • Run: yarn enroll                                                         │
│  • Provide: GitHub username                                                 │
│  • Sign: Transaction with wallet                                            │
│  • Receive: Transaction signature                                           │
│  • Verify: On Solana Explorer                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Enrollment Flow (Sequence Diagram)

```
Student          TypeScript          Anchor           Solana           Program
  │                Client            Provider         Network         (On-chain)
  │                  │                  │                │                │
  │──(1) Run enroll──▶                  │                │                │
  │                  │                  │                │                │
  │                  │──(2) Load wallet─▶                │                │
  │                  │                  │                │                │
  │                  │──(3) Derive PDA──────────────────▶                │
  │                  │   ["enrollment", wallet.pubkey]  │                │
  │                  │                  │                │                │
  │                  │──(4) Build tx────▶                │                │
  │                  │   complete(github)               │                │
  │                  │                  │                │                │
  │◀─(5) Sign prompt─                  │                │                │
  │                  │                  │                │                │
  │──(6) Signature───▶                  │                │                │
  │                  │                  │                │                │
  │                  │──(7) Send tx─────────────────────▶                │
  │                  │                  │                │                │
  │                  │                  │                │──(8) Execute──▶│
  │                  │                  │                │                │
  │                  │                  │                │    Create PDA  │
  │                  │                  │                │    Store data  │
  │                  │                  │                │                │
  │                  │                  │                │◀─(9) Success───│
  │                  │                  │                │                │
  │                  │◀─(10) Tx hash────────────────────│                │
  │                  │                  │                │                │
  │◀─(11) Explorer───│                  │                │                │
  │      link        │                  │                │                │
  │                  │                  │                │                │
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    PROGRAM BUILD PROCESS                          │
│                                                                   │
│  1. Write Rust Program                                           │
│     └─ programs/blockfuse-enrollment/src/lib.rs                  │
│         ├─ define instructions (complete, update)                │
│         ├─ define accounts (EnrollmentAccount)                   │
│         └─ implement business logic                              │
│                          │                                        │
│                          ▼                                        │
│  2. Anchor Build                                                 │
│     └─ anchor build                                              │
│         ├─ Compiles to BPF bytecode                              │
│         ├─ Generates program binary (.so)                        │
│         └─ Auto-generates IDL (JSON)                             │
│                          │                                        │
│                          ▼                                        │
│  3. Deploy to Devnet                                             │
│     └─ anchor deploy                                             │
│         ├─ Uploads program binary to Solana                      │
│         ├─ Assigns Program ID                                    │
│         └─ Makes program executable                              │
│                          │                                        │
│                          ▼                                        │
│  4. Generate TypeScript Client                                   │
│     └─ Copy IDL → Create types                                   │
│         ├─ IDL → ts/programs/blockfuse_enrollment_idl.json      │
│         └─ Types → ts/programs/blockfuse_enrollment.ts          │
│                          │                                        │
│                          ▼                                        │
│  5. Use in Client Code                                           │
│     └─ Import types and call program                             │
│         ├─ Import { BlockfuseEnrollment, IDL }                  │
│         ├─ Create Program instance                               │
│         └─ Call program.methods.complete()                       │
└──────────────────────────────────────────────────────────────────┘
```

## PDA (Program Derived Address) Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PDA DERIVATION SYSTEM                        │
│                                                                  │
│  Program ID: <YOUR_PROGRAM_ID>                                  │
│  Seed Formula: hash(["enrollment", student_pubkey], program_id) │
│                                                                  │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  Student Wallet 1: 5XzY...abc                         │     │
│  │  ↓                                                     │     │
│  │  Seeds: ["enrollment", 5XzY...abc]                    │     │
│  │  ↓                                                     │     │
│  │  PDA: 8KmP...xyz  ◀── Deterministic, unique          │     │
│  │  ↓                                                     │     │
│  │  Stores: { github: "alice", key: 5XzY...abc }        │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  Student Wallet 2: 9NqX...def                         │     │
│  │  ↓                                                     │     │
│  │  Seeds: ["enrollment", 9NqX...def]                    │     │
│  │  ↓                                                     │     │
│  │  PDA: 2RtP...uvw  ◀── Different seed = different PDA │     │
│  │  ↓                                                     │     │
│  │  Stores: { github: "bob", key: 9NqX...def }          │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                  │
│  Key Properties:                                                │
│  • Deterministic: Same inputs → same PDA                       │
│  • No private key: Only program can sign                       │
│  • Unique per student: Different wallet → different PDA       │
│  • Predictable: Can calculate address before creating         │
└─────────────────────────────────────────────────────────────────┘
```

## Instruction Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   INSTRUCTION: complete()                         │
│                                                                   │
│  Purpose: Create new enrollment for a student                    │
│                                                                   │
│  Inputs:                                                          │
│  ├─ Accounts:                                                    │
│  │   ├─ signer (Student's wallet) [SIGNER, WRITABLE]           │
│  │   ├─ enrollment (PDA) [WRITABLE]                             │
│  │   └─ systemProgram [READONLY]                                │
│  └─ Args:                                                         │
│      └─ github: Vec<u8> (GitHub username as bytes)              │
│                                                                   │
│  Process:                                                         │
│  1. Verify signer signature                                      │
│  2. Derive PDA from ["enrollment", signer.key]                  │
│  3. Create account at PDA (Anchor init)                          │
│  4. Store github and signer.key in account                       │
│  5. Return success                                               │
│                                                                   │
│  Output:                                                          │
│  └─ Transaction signature                                        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                   INSTRUCTION: update()                           │
│                                                                   │
│  Purpose: Update existing enrollment                              │
│                                                                   │
│  Inputs:                                                          │
│  ├─ Accounts:                                                    │
│  │   ├─ signer (Student's wallet) [SIGNER, WRITABLE]           │
│  │   ├─ enrollment (PDA) [WRITABLE]                             │
│  │   └─ systemProgram [READONLY]                                │
│  └─ Args:                                                         │
│      └─ github: Vec<u8> (New GitHub username)                   │
│                                                                   │
│  Process:                                                         │
│  1. Verify signer signature                                      │
│  2. Load existing enrollment account                             │
│  3. Verify enrollment.key == signer.key (authorization)         │
│  4. Update enrollment.github with new value                      │
│  5. Return success                                               │
│                                                                   │
│  Output:                                                          │
│  └─ Transaction signature                                        │
└──────────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                       │
│                                                                  │
│  1. AUTHORIZATION (Who can do what?)                            │
│     ├─ complete(): Anyone with a wallet can enroll             │
│     │   └─ Validates: Signature matches signer account         │
│     │                                                            │
│     └─ update(): Only original enrollee can update             │
│         └─ Validates: enrollment.key == signer.key             │
│                                                                  │
│  2. ACCOUNT OWNERSHIP (Who controls the data?)                  │
│     ├─ Enrollment PDAs: Owned by BlockFuse program             │
│     │   └─ Only program can modify PDA data                    │
│     │                                                            │
│     └─ Student wallets: Owned by System Program                │
│         └─ Only student can sign transactions                   │
│                                                                  │
│  3. DATA VALIDATION (What data is allowed?)                     │
│     ├─ GitHub field: Max 32 bytes (enforced by InitSpace)     │
│     ├─ Key field: Must be valid Pubkey (type-safe)            │
│     └─ PDA derivation: Deterministic, cannot be forged         │
│                                                                  │
│  4. RENT EXEMPTION (Economic security)                          │
│     ├─ Account size: 8 (discriminator) + 36 (github) + 32 (key)│
│     │   = 76 bytes                                              │
│     ├─ Rent: ~0.0006 SOL (paid by student at enrollment)      │
│     └─ Account stays on-chain indefinitely                     │
│                                                                  │
│  5. ATTACK SURFACE                                              │
│     ├─ ✅ Cannot enroll twice (PDA already exists error)       │
│     ├─ ✅ Cannot update someone else's enrollment              │
│     ├─ ✅ Cannot forge PDA addresses                           │
│     └─ ✅ Cannot bypass signature requirements                 │
└─────────────────────────────────────────────────────────────────┘
```

## Future Extensions

```
┌──────────────────────────────────────────────────────────────────┐
│                    EXTENSIBILITY ROADMAP                          │
│                                                                   │
│  Phase 1: Enhanced Enrollment                                    │
│  ├─ Add Discord handle field                                     │
│  ├─ Add Twitter handle field                                     │
│  ├─ Add email (encrypted) field                                  │
│  └─ Add timestamp of enrollment                                  │
│                                                                   │
│  Phase 2: Progress Tracking                                      │
│  ├─ Store module completion flags                                │
│  ├─ Track vault score                                            │
│  ├─ Record assignment submissions                                │
│  └─ Add achievement badges                                       │
│                                                                   │
│  Phase 3: Certification                                          │
│  ├─ Mint NFT certificate upon completion                         │
│  ├─ Store IPFS link to certificate                               │
│  ├─ Create on-chain leaderboard                                  │
│  └─ Issue verifiable credentials                                 │
│                                                                   │
│  Phase 4: Community Features                                     │
│  ├─ Referral system                                              │
│  ├─ Peer review mechanism                                        │
│  ├─ DAO governance for curriculum                                │
│  └─ Token incentives for completion                              │
└──────────────────────────────────────────────────────────────────┘
```

---

This architecture provides a solid foundation for a decentralized educational enrollment system with true student ownership of their credentials!
