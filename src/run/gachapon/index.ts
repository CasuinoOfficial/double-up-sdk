import { Transaction } from "@mysten/sui/transactions";
import { DoubleUpClient } from "../../client";
import { SuiClient } from "@mysten/sui/client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";

export const testCreateGachapon = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  cost: number,
  coinType: string,
  initSupplyer: string
) => {
  const tx = new Transaction();

  dbClient.createGachapon({
    cost,
    coinType,
    initSupplyer,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
    options: {
      showRawEffects: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};
