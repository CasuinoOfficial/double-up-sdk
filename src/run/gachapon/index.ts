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
      gachaponId,
      objectId,
      transaction: tx,
    });
  } else {
    await dbClient.addEgg({
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
};

export const testRemoveEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  kioskId: string,
  index: number
) => {
  const tx = new Transaction();

  const removedEgg = dbClient.removeEgg({
    coinType,
    gachaponId,
    keeperCapId,
    kioskId,
    index,
    transaction: tx,
  });

  tx.transferObjects([removedEgg], keypair.toSuiAddress());

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

export const testClaimEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  kioskId: string,
  eggId: string
) => {
  const tx = new Transaction();

  const egg = await dbClient.claimEgg({
    coinType,
    gachaponId,
    kioskId,
    eggId,
    transaction: tx,
  });

  if (egg === null) {
    dbClient.destroyEgg({
      eggId,
      transaction: tx,
    });
  } else {
    tx.transferObjects([egg], keypair.toSuiAddress());
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

  console.log("Signed and sent transaction.", transactionResult);
};

export const testClaimGachaponTreasury = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string
) => {
  const tx = new Transaction();

  const treasury = dbClient.claimGachaponTreasury({
    coinType,
    gachaponId,
    keeperCapId,
    transaction: tx,
  });

  tx.transferObjects([treasury], keypair.toSuiAddress());

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

export const testUpdateCost = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  newCost: number
) => {
  const tx = new Transaction();

  dbClient.updateCost({
    coinType,
    gachaponId,
    keeperCapId,
    newCost,
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

export const testAddSupplier = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  newSupplierAddress: string
) => {
  if (!newSupplierAddress || newSupplierAddress === "") {
    throw new Error("newSupplierAddress is empty or undefined");
  }

  const tx = new Transaction();

  dbClient.addSupplier({
    coinType,
    gachaponId,
    keeperCapId,
    newSupplierAddress,
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

export const testRemoveSupplier = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string,
  supplierAddress: string
) => {
  if (!supplierAddress || supplierAddress === "") {
    throw new Error("supplierAddress is empty or undefined");
  }

  const tx = new Transaction();

  dbClient.removeSupplier({
    coinType,
    gachaponId,
    keeperCapId,
    supplierAddress,
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

export const testDrawEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  count: number,
  recipient: string
) => {
  const gachaponInfo = await client.getObject({
    id: gachaponId,
    options: {
      showContent: true,
    },
  });

  const gachaponContent = gachaponInfo?.data?.content;

  if (!gachaponContent) {
    throw new Error("Gachapon not found");
  } else if (gachaponContent?.dataType !== "moveObject") {
    throw new Error("Wrong dataType");
  }

  const fields = gachaponContent?.fields as any;

  const tx = new Transaction();

  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(fields.cost * count)]);

  dbClient.drawEgg({
    coinType,
    coin,
    gachaponId,
    count,
    recipient,
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

export const testDestroyEgg = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  eggId: string
) => {
  if (!eggId || eggId === "") {
    throw new Error("eggId is empty or undefined");
  }

  const tx = new Transaction();

  dbClient.destroyEgg({
    eggId,
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

export const testCreateFreeSpinner = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  keeperCapId: string
) => {
  const tx = new Transaction();

  dbClient.createFreeSpinner({
    coinType,
    gachaponId,
    keeperCapId,
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

export const testAddNftType = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  objectId: string,
  gachaponId: string,
  keeperCapId: string
) => {
  const tx = new Transaction();

  dbClient.addNftType({
    coinType,
    objectId,
    gachaponId,
    keeperCapId,
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

export const testRemoveNftType = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  objectId: string,
  gachaponId: string,
  keeperCapId: string
) => {
  const tx = new Transaction();

  dbClient.removeNftType({
    coinType,
    objectId,
    gachaponId,
    keeperCapId,
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

export const testDrawFreeSpin = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
  coinType: string,
  gachaponId: string,
  objectId: string,
  recipient: string
) => {
  const tx = new Transaction();

  dbClient.drawFreeSpin({
    coinType,
    gachaponId,
    objectId,
    recipient,
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
