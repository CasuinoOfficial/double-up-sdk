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

export const testCloseGachapon = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  kioskId: string
) => {
  const tx = new Transaction();

  //[tCoin, suiCoin]
  const [tCoin, suiCoin] = dbClient.closeGachapon({
    coinType,
    gachaponId,
    keeperCapId,
    kioskId,
    transaction: tx,
  });

  tx.transferObjects([tCoin, suiCoin], keypair.toSuiAddress());

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

export const testGetGachapon = async (
  dbClient: DoubleUpClient,
  gachaponId: string
) => {
  // const gachapons = await dbClient.getGachapons(address);
};

export const testAdminGetGachapons = async (
  dbClient: DoubleUpClient,
  keypair: Secp256k1Keypair
) => {
  const address = keypair.toSuiAddress();

  return dbClient.adminGetGachapons(address);
};

export const testAdminGetEggs = async (
  dbClient: DoubleUpClient,
  lootboxId: string
) => {
  return dbClient.adminGetEggs(lootboxId);
};

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

export const testAddEmptyEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  count: number
) => {
  const tx = new Transaction();

  dbClient.addEmptyEgg({
    coinType,
    gachaponId,
    keeperCapId,
    count,
    transaction: tx,
  });

  console.log("check1");

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
