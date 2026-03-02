# BlockFuse Enrollment Program - Implementation Checklist

Use this checklist to track your progress as you build and deploy your BlockFuse enrollment program.

---

## ☑️ Pre-requisites

- [ ] Anchor CLI installed (`anchor --version` shows 0.29.0+)
- [ ] Rust installed (`rustc --version` works)
- [ ] Solana CLI installed (`solana --version` works)
- [ ] Node.js and Yarn installed
- [ ] Solana configured for devnet (`solana config get` shows devnet)
- [ ] Wallet has devnet SOL (`solana balance` > 2 SOL)

---

## ☑️ Step 1: Create Anchor Workspace

- [ ] Navigate to project root: `cd solana-starter`
- [ ] Create workspace: `anchor init blockfuse-programs --no-git`
- [ ] Workspace created successfully
- [ ] `blockfuse-programs/` directory exists
- [ ] `Anchor.toml` file exists

---

## ☑️ Step 2: Create Enrollment Program

- [ ] Navigate to programs: `cd blockfuse-programs/programs`
- [ ] Remove default: `rm -rf blockfuse-programs`
- [ ] Create new directory: `mkdir blockfuse-enrollment`
- [ ] Create `blockfuse-enrollment/Cargo.toml`
- [ ] Copy Cargo.toml content from Step 2 in CREATE_BLOCKFUSE_PROGRAM.md
- [ ] Create `blockfuse-enrollment/src/lib.rs`
- [ ] Copy lib.rs content from Step 2 in CREATE_BLOCKFUSE_PROGRAM.md
- [ ] Verify files exist and content is correct

---

## ☑️ Step 3: Update Anchor.toml

- [ ] Open `blockfuse-programs/Anchor.toml`
- [ ] Update `[programs.devnet]` section
- [ ] Update `[programs.localnet]` section
- [ ] Set cluster to "Devnet"
- [ ] Verify wallet path is correct

---

## ☑️ Step 4: Initial Build

- [ ] Navigate to workspace: `cd blockfuse-programs`
- [ ] Run: `anchor build`
- [ ] Build completes without errors
- [ ] `target/deploy/blockfuse_enrollment.so` exists
- [ ] `target/deploy/blockfuse_enrollment-keypair.json` exists
- [ ] Get program ID: `solana-keygen pubkey target/deploy/blockfuse_enrollment-keypair.json`
- [ ] **SAVE PROGRAM ID:** ___________________________________

---

## ☑️ Step 5: Update Program ID

- [ ] Open `programs/blockfuse-enrollment/src/lib.rs`
- [ ] Replace `declare_id!("11111...")` with your actual program ID
- [ ] Open `Anchor.toml`
- [ ] Replace placeholder IDs in `[programs.devnet]` and `[programs.localnet]`
- [ ] Save both files

---

## ☑️ Step 6: Rebuild with Correct ID

- [ ] Run: `anchor build` again
- [ ] Build completes without errors
- [ ] Verify program binary updated

---

## ☑️ Step 7: Deploy to Devnet

- [ ] Verify network: `solana config get` (should show devnet)
- [ ] Check balance: `solana balance` (should be > 2 SOL)
- [ ] If needed, airdrop: `solana airdrop 2`
- [ ] Deploy: `anchor deploy`
- [ ] Deployment successful
- [ ] Program ID displayed matches your saved ID
- [ ] Verify program exists: `solana program show <YOUR_ID> --url devnet`

---

## ☑️ Step 8: Generate TypeScript IDL

- [ ] Verify IDL exists: `target/idl/blockfuse_enrollment.json`
- [ ] Copy IDL to TypeScript:
  ```bash
  cp target/idl/blockfuse_enrollment.json \
     ../ts/programs/blockfuse_enrollment_idl.json
  ```
- [ ] File copied successfully
- [ ] Verify JSON is valid (open and check)

---

## ☑️ Step 9: Create TypeScript Types

- [ ] Create file: `ts/programs/blockfuse_enrollment.ts`
- [ ] Copy TypeScript type definitions from Step 7 in CREATE_BLOCKFUSE_PROGRAM.md
- [ ] Verify exports: `BlockfuseEnrollment` type and `IDL` constant
- [ ] No TypeScript errors in the file

---

## ☑️ Step 10: Update Client Code

### 10a. Update ts/prereqs/enroll.ts

- [ ] Open `ts/prereqs/enroll.ts`
- [ ] Change import: `BflPrereq` → `BlockfuseEnrollment`
- [ ] Change import path: `bfl_prereq` → `blockfuse_enrollment`
- [ ] Update program ID to your deployed ID
- [ ] Change seed: `"prereq"` → `"enrollment"`
- [ ] Change account name: `prereq:` → `enrollment:`
- [ ] Update GitHub username to yours
- [ ] Save file

### 10b. Update ts-complete/prereqs/enroll.ts

- [ ] Open `ts-complete/prereqs/enroll.ts`
- [ ] Make same changes as above
- [ ] Save file

### 10c. OR Use Automated Script

- [ ] Run: `cd .. && ./update-to-blockfuse.sh <YOUR_PROGRAM_ID>`
- [ ] Script completes without errors
- [ ] Verify changes in all files

---

## ☑️ Step 11: Test Enrollment

- [ ] Navigate to TypeScript: `cd ts`
- [ ] Verify wallet exists: `ls bfl-wallet.json`
- [ ] If needed, create wallet: `yarn keygen`
- [ ] Fund wallet: `yarn airdrop`
- [ ] Run enrollment: `yarn enroll`
- [ ] Transaction successful
- [ ] Transaction signature displayed
- [ ] Explorer link provided

---

## ☑️ Step 12: Verify On-Chain

- [ ] Open Solana Explorer link from previous step
- [ ] Transaction shows as "Success"
- [ ] Verify instruction called: `complete`
- [ ] Check program logs show enrollment message
- [ ] Calculate your enrollment PDA:
  ```typescript
  const [enrollmentPDA, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("enrollment"), yourWallet.publicKey.toBuffer()],
    programId
  );
  ```
- [ ] View account: `solana account <ENROLLMENT_PDA> --url devnet`
- [ ] Account data exists
- [ ] GitHub handle stored correctly

---

## ☑️ Step 13: Optional - Update Rust Client

- [ ] Open `rs/src/programs/bfl_prereq.rs`
- [ ] Update program name to `blockfuse_enrollment`
- [ ] Update program ID to your deployed ID
- [ ] Update seed from `"prereq"` to `"enrollment"`
- [ ] Update account name to `EnrollmentAccount`
- [ ] Save file
- [ ] Test: `cd rs && cargo test`

---

## ☑️ Step 14: Update Documentation

- [ ] Open `README.md`
- [ ] Replace all references to "WBA" with "BlockFuse"
- [ ] Update program ID: `HC2oqz2p6DE...` → Your ID
- [ ] Update PDA seed docs: `["prereq"...]` → `["enrollment"...]`
- [ ] Update instruction references
- [ ] Save changes

---

## ☑️ Step 15: Final Verification

- [ ] Program deployed and verified on devnet
- [ ] Can enroll via `yarn enroll`
- [ ] Transaction appears on Explorer
- [ ] PDA account created with correct data
- [ ] TypeScript types work correctly
- [ ] No import errors in IDE
- [ ] README updated with correct information
- [ ] All tests pass

---

## ☑️ Post-Deployment

- [ ] Document your program ID in a safe place
- [ ] Share program ID with team/students
- [ ] Update any external documentation
- [ ] Consider writing a blog post about your program
- [ ] Plan next features (certificates, leaderboard, etc.)

---

## 🎉 Completion

Congratulations! Your BlockFuse enrollment program is now live on Solana devnet!

**Program ID:** _________________________________________

**Deployment Date:** ____________________________________

**First Enrollment TX:** __________________________________

---

## 📊 Metrics to Track

Keep track of your program's usage:

- [ ] Total enrollments: ___________
- [ ] Active students: ___________
- [ ] Completion rate: ___________%
- [ ] Average vault score: ___________
- [ ] Most active student: ___________

---

## 🚀 Next Steps

What will you build next?

- [ ] Admin dashboard to view all enrollments
- [ ] Query script to list all students
- [ ] NFT certificate minting for graduates
- [ ] Leaderboard based on vault scores
- [ ] Discord bot integration
- [ ] Referral system
- [ ] Module completion tracking
- [ ] Achievement badges
- [ ] DAO governance for curriculum

---

## 📝 Notes

Use this space to record any issues, learnings, or ideas:

```
[Your notes here]

```

---

## 🐛 Issues Encountered

If you hit any problems, document them here for future reference:

| Issue | Solution | Date |
|-------|----------|------|
|       |          |      |
|       |          |      |
|       |          |      |

---

**Remember:** This checklist is your roadmap. Come back to it as you progress!
