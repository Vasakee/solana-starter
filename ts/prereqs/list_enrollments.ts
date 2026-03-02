import { Connection, PublicKey } from "@solana/web3.js"
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor"
import { IDL } from "../programs/blockfuse_enrollment"

const PROGRAM_ID = new PublicKey("5v3j8M2TNpbqJzxuP3K7sGdh848rqVLwhR6iK7iLAf7V");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

(async () => {
    try {
        // Fetch all accounts owned by our program
        const accounts = await connection.getProgramAccounts(PROGRAM_ID);

        console.log(`\n=== BlockFuse Enrollment Registry ===`);
        console.log(`Total enrollments: ${accounts.length}\n`);

        for (const { pubkey, account } of accounts) {
            const data = account.data;

            // Skip the 8-byte discriminator
            // Then read the github field: first 4 bytes = length (little-endian), then string bytes
            const githubLen = data.readUInt32LE(8);
            const github = data.slice(12, 12 + githubLen).toString("utf8");

            // The pubkey field starts after the github bytes (12 + githubLen)
            const walletKey = new PublicKey(data.slice(12 + githubLen, 12 + githubLen + 32));

            const index = accounts.findIndex(a => a.pubkey.equals(pubkey));
            console.log(`  Student #${index + 1}`);
            console.log(`    PDA:     ${pubkey.toBase58()}`);
            console.log(`    GitHub:  ${github}`);
            console.log(`    Wallet:  ${walletKey.toBase58()}`);
            console.log(`    Balance: ${(account.lamports / 1e9).toFixed(6)} SOL`);
            console.log(``);
        }

        if (accounts.length === 0) {
            console.log("  No enrollments yet. Be the first!\n");
        }

        console.log(`=== End of Registry ===\n`);
    } catch(e) {
        console.error(`Error fetching enrollments: ${e}`)
    }
})();
