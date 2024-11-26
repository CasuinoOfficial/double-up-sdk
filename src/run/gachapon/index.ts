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

  const gachapon = dbClient.createGachapon({
    cost,
    coinType,
    initSupplyer,
    transaction: tx,
  });

  tx.transferObjects([gachapon], keypair.toSuiAddress());

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

export const testCloaseGachapon = async () => {};

export const testAddEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  gachaponId: string,
  objectId: string | string[]
) => {
  const tx = new Transaction();

  const keypairAddress = keypair.toSuiAddress();

  if (typeof objectId === "string") {
    await dbClient.addEgg({
      address: keypairAddress,
      gachaponId,
      objectId,
      transaction: tx,
    });
  } else {
    await dbClient.addEgg({
      address: keypairAddress,
      gachaponId,
      objectId: objectId[0],
      transaction: tx,
    });
  }

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

  // Get Gachapon Object

  // Check supplier

  // Get Object Info, type, isLocked or not
};
