# Creating Your Own BlockFuse Enrollment Program

This guide walks you through creating and deploying your own BlockFuse enrollment program to replace the WBA program.

---

## Step 1: Create a New Anchor Workspace

First, create a dedicated Anchor workspace for your BlockFuse programs:

```bash
# Navigate to your project root
cd /home/bprime/Documents/Solana-Blockfuse/solana-starter

# Create a new Anchor workspace
anchor init blockfuse-programs --no-git

# This creates:
# blockfuse-programs/
# ├── Anchor.toml
# ├── Cargo.toml
# ├── programs/
# │   └── blockfuse-programs/
# ├── tests/
# └── migrations/
```

---

## Step 2: Create the Enrollment Program

Replace the default program with the BlockFuse enrollment program:

```bash
cd blockfuse-programs/programs
rm -rf blockfuse-programs
mkdir blockfuse-enrollment
cd blockfuse-enrollment
```

Create the program structure:

### `Cargo.toml`

```toml
[package]
name = "blockfuse-enrollment"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "blockfuse_enrollment"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
```

### `src/lib.rs`

```rust
use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111"); // Temporary - will be replaced after deployment

#[program]
pub mod blockfuse_enrollment {
    use super::*;

    /// Enroll a student in BlockFuse Labs bootcamp
    /// Records their GitHub handle on-chain
    pub fn complete(ctx: Context<Complete>, github: Vec<u8>) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;
        enrollment.github = github;
        enrollment.key = ctx.accounts.signer.key();
        msg!("BlockFuse enrollment completed for: {}", ctx.accounts.signer.key());
        Ok(())
    }

    /// Update an existing enrollment (in case student needs to change their GitHub handle)
    pub fn update(ctx: Context<Update>, github: Vec<u8>) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;

        // Verify the signer matches the original enrollment
        require!(
            enrollment.key == ctx.accounts.signer.key(),
            EnrollmentError::Unauthorized
        );

        enrollment.github = github;
        msg!("BlockFuse enrollment updated for: {}", ctx.accounts.signer.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Complete<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        init,
        payer = signer,
        space = 8 + EnrollmentAccount::INIT_SPACE,
        seeds = [b"enrollment", signer.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, EnrollmentAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"enrollment", signer.key().as_ref()],
        bump,
        has_one = key @ EnrollmentError::Unauthorized
    )]
    pub enrollment: Account<'info, EnrollmentAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct EnrollmentAccount {
    #[max_len(32)]
    pub github: Vec<u8>,  // GitHub handle (up to 32 bytes)
    pub key: Pubkey,      // Student's wallet address
}

#[error_code]
pub enum EnrollmentError {
    #[msg("Unauthorized: Only the original enrollee can update their account")]
    Unauthorized,
}
```

---

## Step 3: Update Anchor.toml

Edit `blockfuse-programs/Anchor.toml`:

```toml
[toolchain]

[features]
seeds = false
skip-lint = false

[programs.devnet]
blockfuse_enrollment = "11111111111111111111111111111111"

[programs.localnet]
blockfuse_enrollment = "11111111111111111111111111111111"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

---

## Step 4: Build the Program

```bash
cd /home/bprime/Documents/Solana-Blockfuse/solana-starter/blockfuse-programs

# Build the program
anchor build

# The compiled program will be at:
# target/deploy/blockfuse_enrollment.so
```

After building, Anchor generates the program ID. Get it:

```bash
solana-keygen pubkey target/deploy/blockfuse_enrollment-keypair.json
```

**IMPORTANT**: Copy this address and update it in:
1. `programs/blockfuse-enrollment/src/lib.rs` (the `declare_id!` macro)
2. `Anchor.toml` (replace the placeholder address)

Then rebuild:

```bash
anchor build
```

---

## Step 5: Deploy to Devnet

```bash
# Ensure you're on devnet
solana config set --url devnet

# Fund your deployer wallet
solana airdrop 2

# Deploy the program
anchor deploy

# You should see:
# Program Id: <YOUR_PROGRAM_ID>
```

**Save this Program ID** — you'll need it for the client code!

---

## Step 6: Generate the IDL for TypeScript

After deployment, extract the IDL:

```bash
# The IDL is auto-generated at:
# target/idl/blockfuse_enrollment.json

# Copy it to your TypeScript folder
cp target/idl/blockfuse_enrollment.json \
   ../ts/programs/blockfuse_enrollment_idl.json
```

---

## Step 7: Update TypeScript Client Code

Create a new IDL TypeScript file:

### `ts/programs/blockfuse_enrollment.ts`

```typescript
export type BlockfuseEnrollment = {
  version: "0.1.0";
  name: "blockfuse_enrollment";
  instructions: [
    {
      name: "complete";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "enrollment";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "github";
          type: "bytes";
        }
      ];
    },
    {
      name: "update";
      accounts: [
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "enrollment";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "github";
          type: "bytes";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "EnrollmentAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "github";
            type: "bytes";
          },
          {
            name: "key";
            type: "publicKey";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "Unauthorized";
      msg: "Unauthorized: Only the original enrollee can update their account";
    }
  ];
};

export const IDL: BlockfuseEnrollment = {
  version: "0.1.0",
  name: "blockfuse_enrollment",
  instructions: [
    {
      name: "complete",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "enrollment",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "github",
          type: "bytes",
        },
      ],
    },
    {
      name: "update",
      accounts: [
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "enrollment",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "github",
          type: "bytes",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "EnrollmentAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "github",
            type: "bytes",
          },
          {
            name: "key",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Unauthorized",
      msg: "Unauthorized: Only the original enrollee can update their account",
    },
  ],
};
```

---

## Step 8: Update the Enrollment Script

Update `ts/prereqs/enroll.ts` and `ts-complete/prereqs/enroll.ts`:

```typescript
import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@coral-xyz/anchor"
import { BlockfuseEnrollment, IDL } from "../programs/blockfuse_enrollment";
import wallet from "../bfl-wallet.json"

// Import keypair from wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Your GitHub handle
const github = Buffer.from("your-github-username", "utf8");

// Create Anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create program instance with YOUR deployed program ID
const program = new Program<BlockfuseEnrollment>(
    IDL,
    "YOUR_DEPLOYED_PROGRAM_ID_HERE" as Address,
    provider
);

// Derive the PDA for enrollment account
// Seeds: ["enrollment", signer.publicKey]
const enrollment_seeds = [Buffer.from("enrollment"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
    enrollment_seeds,
    program.programId
);

// Execute enrollment transaction
(async () => {
    try {
        const txhash = await program.methods
        .complete(github)
        .accounts({
            signer: keypair.publicKey,
            enrollment: enrollment_key,
            systemProgram: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();

        console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
```

**Replace `YOUR_DEPLOYED_PROGRAM_ID_HERE`** with the actual program ID from Step 5!

---

## Step 9: Update Rust Client (Optional)

If you want to update the Rust client as well, modify `rs/src/programs/bfl_prereq.rs`:

```rust
use solana_idlgen::idlgen;
idlgen!({
    "version": "0.1.0",
    "name": "blockfuse_enrollment",
    "instructions": [
        {
        "name": "complete",
        "accounts": [
            {
            "name": "signer",
            "isMut": true,
            "isSigner": true
            },
            {
            "name": "enrollment",
            "isMut": true,
            "isSigner": false
            },
            {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
            }
        ],
        "args": [
            {
            "name": "github",
            "type": "bytes"
            }
        ]
        },
        {
        "name": "update",
        "accounts": [
            {
            "name": "signer",
            "isMut": true,
            "isSigner": true
            },
            {
            "name": "enrollment",
            "isMut": true,
            "isSigner": false
            },
            {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
            }
        ],
        "args": [
            {
            "name": "github",
            "type": "bytes"
            }
        ]
        }
    ],
    "accounts": [
        {
        "name": "EnrollmentAccount",
        "type": {
            "kind": "struct",
            "fields": [
            {
                "name": "github",
                "type": "bytes"
            },
            {
                "name": "key",
                "type": "publicKey"
            }
            ]
        }
        }
    ],
    "metadata": {
        "address": "YOUR_DEPLOYED_PROGRAM_ID_HERE"
    }
});
```

---

## Step 10: Update the README

Update references in `README.md`:

1. Change "BFL on-chain program" to "BlockFuse enrollment program"
2. Update the program ID references
3. Change seed from `["prereq", yourPublicKey]` to `["enrollment", yourPublicKey]`

Example update for the Prerequisites section:

```markdown
**What `enroll` does:**
1. Loads `bfl-wallet.json` as your signer
2. Derives a PDA using seeds `["enrollment", yourPublicKey]` — this is your enrollment account
3. Calls `complete(github)` on the BlockFuse enrollment program to record your GitHub username on-chain
```

---

## Step 11: Test Your Program

```bash
cd ts

# Make sure your wallet is funded
yarn airdrop

# Run the enrollment script
yarn enroll

# You should see:
# Success! Check out your TX here:
# https://explorer.solana.com/tx/...
```

Click the Explorer link to verify your enrollment on-chain!

---

## Verification

After deployment, verify your program:

```bash
# Check program exists on devnet
solana program show <YOUR_PROGRAM_ID> --url devnet

# View your enrollment account
solana account <ENROLLMENT_PDA_ADDRESS> --url devnet
```

---

## Key Changes Summary

| What | Old (WBA) | New (BlockFuse) |
|------|-----------|-----------------|
| Program Name | `wba_prereq` | `blockfuse_enrollment` |
| Program ID | `HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1` | Your deployed ID |
| PDA Seeds | `["prereq", signer]` | `["enrollment", signer]` |
| Account Name | `prereq` | `enrollment` |
| Type Name | `BflPrereq` / `PrereqAccount` | `BlockfuseEnrollment` / `EnrollmentAccount` |

---

## Troubleshooting

**Error: `insufficient funds for rent`**
- Airdrop more SOL: `solana airdrop 2`

**Error: `invalid program id`**
- Make sure you updated the program ID in all files after building

**Error: `account already exists`**
- You've already enrolled. Use the `update` instruction instead

**Build fails**
- Check Anchor version: `anchor --version` (should be 0.29.0+)
- Update if needed: `aio install anchor@0.29.0`

---

## Next Steps

1. Create a frontend dashboard to view all enrolled students
2. Add additional fields (Discord handle, Twitter, etc.)
3. Create NFT certificates for graduates
4. Build a leaderboard system based on vault scores

Your BlockFuse enrollment program is now live on devnet! 🚀
