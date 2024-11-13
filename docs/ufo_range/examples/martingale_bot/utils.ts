import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {Secp256k1Keypair} from "@mysten/sui/keypairs/secp256k1"
import {Secp256r1Keypair} from "@mysten/sui/keypairs/secp256r1"
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import * as dotenv from "dotenv";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "doubleup";
dotenv.config();

export const getSigner = () => {
  const { schema, secretKey } = decodeSuiPrivateKey(process.env.SK!);
  if (schema === "ED25519") {
    return Ed25519Keypair.fromSecretKey(secretKey);
  } else if (schema === "Secp256k1") {
    return Secp256k1Keypair.fromSecretKey(secretKey);
  } else {
    return Secp256r1Keypair.fromSecretKey(secretKey);
  }
};

export const client = new SuiClient({
    url: getFullnodeUrl("mainnet")
});

export const DBClient = new DoubleUpClient({
    partnerNftListId: "0x0",
    suiClient: client
});