import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";

// Generate a new keypair
const kp = Keypair.generate();

// Convert secretKey (Uint8Array) to a plain array so it can be saved as JSON
const secretArray = Array.from(kp.secretKey);

// Build object with both public key and secret
const walletObj = { wallet: kp.publicKey.toBase58(), secretKey: secretArray };

// Save to ts/bfl-wallet.json (one level up from this folder)
const outPath = path.resolve(__dirname, "..", "dev-wallet.json");
fs.writeFileSync(outPath, JSON.stringify(walletObj, null, 2), { encoding: "utf8", flag: "w" });

console.log(`Created new Solana wallet: ${kp.publicKey.toBase58()}`);
console.log(`Saved wallet object to ${outPath}`);