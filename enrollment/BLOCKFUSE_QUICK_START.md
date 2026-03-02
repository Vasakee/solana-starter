# BlockFuse Enrollment Program - Quick Start

This is a condensed guide to get your BlockFuse enrollment program deployed quickly.

---

## 🚀 Fast Track (30 minutes)

### 1. Install Anchor (if not already installed)

```bash
cargo install --git https://github.com/coral-xyz/anchor aio --locked --force
aio install anchor@0.29.0
```

### 2. Create and Build Program

```bash
cd /home/bprime/Documents/Solana-Blockfuse/solana-starter

# Initialize Anchor workspace
anchor init blockfuse-programs --no-git
cd blockfuse-programs/programs

# Remove default and create enrollment program
rm -rf blockfuse-programs
mkdir blockfuse-enrollment
```

Copy the program code from `CREATE_BLOCKFUSE_PROGRAM.md` Step 2 into:
- `blockfuse-enrollment/Cargo.toml`
- `blockfuse-enrollment/src/lib.rs`

```bash
# Build
cd /home/bprime/Documents/Solana-Blockfuse/solana-starter/blockfuse-programs
anchor build

# Get the program ID
solana-keygen pubkey target/deploy/blockfuse_enrollment-keypair.json

# Copy this address and update it in:
# - programs/blockfuse-enrollment/src/lib.rs (declare_id! macro)
# - Anchor.toml (programs.devnet section)

# Rebuild with correct ID
anchor build
```

### 3. Deploy to Devnet

```bash
solana config set --url devnet
solana airdrop 2
anchor deploy
```

**SAVE THE PROGRAM ID FROM DEPLOY OUTPUT!**

### 4. Update Client Code

```bash
# Run the update script (replace with your program ID)
cd /home/bprime/Documents/Solana-Blockfuse/solana-starter
./update-to-blockfuse.sh <YOUR_PROGRAM_ID>

# Copy IDL
cp blockfuse-programs/target/idl/blockfuse_enrollment.json \
   ts/programs/blockfuse_enrollment_idl.json
```

Create `ts/programs/blockfuse_enrollment.ts` using the code from Step 7 in `CREATE_BLOCKFUSE_PROGRAM.md`

### 5. Test

```bash
cd ts
yarn enroll
```

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BlockFuse Enrollment                      │
│                    Solana Program (Devnet)                   │
│                                                              │
│  Program ID: <YOUR_DEPLOYED_ID>                             │
│                                                              │
│  Instructions:                                               │
│  ├─ complete(github: bytes)  → Create enrollment            │
│  └─ update(github: bytes)    → Update existing             │
│                                                              │
│  Accounts:                                                   │
│  └─ EnrollmentAccount                                       │
│      ├─ github: Vec<u8>    (GitHub username)               │
│      └─ key: Pubkey        (Student's wallet)              │
│                                                              │
│  PDA Seeds: ["enrollment", student_pubkey]                 │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                              │ RPC Call
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    TypeScript Client                         │
│                    (ts/prereqs/enroll.ts)                   │
│                                                              │
│  1. Load wallet keypair                                      │
│  2. Derive PDA: ["enrollment", wallet.publicKey]           │
│  3. Call program.methods.complete(github)                   │
│  4. Sign and send transaction                               │
│  5. Receive transaction signature                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### Program Derived Address (PDA)
```typescript
// Each student gets a unique enrollment account
// Seeds: ["enrollment", studentPublicKey]
const [enrollmentPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("enrollment"), studentPublicKey.toBuffer()],
    programId
);
```

### Enrollment Flow
```
Student → Call complete(github_handle)
         ↓
Program creates PDA account
         ↓
Stores: { github, wallet_address }
         ↓
Returns transaction signature
         ↓
Verify on Solana Explorer
```

---

## 📝 What Changed from WBA

| Item | WBA | BlockFuse |
|------|-----|-----------|
| **Program Name** | `wba_prereq` | `blockfuse_enrollment` |
| **Program ID** | `HC2oqz2p6DE...` | `<YOUR_ID>` |
| **PDA Seed** | `"prereq"` | `"enrollment"` |
| **Account Name** | `prereq` | `enrollment` |
| **Type** | `BflPrereq` | `BlockfuseEnrollment` |

---

## ✅ Verification Checklist

After deployment:

- [ ] Program deployed to devnet
- [ ] Program ID saved and updated in all files
- [ ] IDL copied to `ts/programs/`
- [ ] TypeScript types created (`blockfuse_enrollment.ts`)
- [ ] `update-to-blockfuse.sh` script executed
- [ ] `yarn enroll` runs successfully
- [ ] Transaction visible on Solana Explorer
- [ ] Can query enrollment account on-chain

---

## 🔍 Verify Your Deployment

### Check Program Exists
```bash
solana program show <YOUR_PROGRAM_ID> --url devnet
```

### Check Enrollment Account
```bash
# After running yarn enroll, check your enrollment PDA
solana account <ENROLLMENT_PDA> --url devnet --output json
```

### Query via TypeScript
```typescript
const enrollmentData = await program.account.enrollmentAccount.fetch(enrollmentPDA);
console.log("GitHub:", Buffer.from(enrollmentData.github).toString());
console.log("Wallet:", enrollmentData.key.toBase58());
```

---

## 🎯 Next Steps

1. **Add More Fields**: Discord, Twitter, email, etc.
2. **Create Admin Panel**: View all enrolled students
3. **Issue NFT Certificates**: Mint completion NFTs
4. **Build Leaderboard**: Track vault scores
5. **Create Referral System**: Reward student ambassadors

---

## 🐛 Common Issues

### "Insufficient funds for rent"
```bash
solana airdrop 2 --url devnet
```

### "Program failed to complete"
- Check program ID matches in all files
- Verify PDA seeds are correct
- Ensure wallet is funded

### "Account already exists"
- You've already enrolled
- Use `update` instruction instead
- Or use a different wallet to test

### Build fails
```bash
# Clean and rebuild
cd blockfuse-programs
anchor clean
anchor build
```

---

## 📚 Resources

- **Anchor Book**: https://book.anchor-lang.com
- **Solana Cookbook**: https://solanacookbook.com
- **Program Examples**: https://github.com/coral-xyz/anchor/tree/master/tests
- **Devnet Explorer**: https://explorer.solana.com/?cluster=devnet

---

## 🤝 Support

If you get stuck:
1. Check `CREATE_BLOCKFUSE_PROGRAM.md` for detailed steps
2. Compare your code with the examples
3. Verify program ID matches everywhere
4. Test with fresh wallet if needed

Your BlockFuse enrollment program brings true ownership to your bootcamp! 🚀
