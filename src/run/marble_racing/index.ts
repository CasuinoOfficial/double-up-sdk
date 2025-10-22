import {
  Transaction,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { DoubleUpClient } from "../../client";
import { SuiClient } from "@mysten/sui/client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testAddBet = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  coinType: string,
  raceId: string,
  betSize: number,
  betType: number,
  options: Record<string, string[]>
) => {
  const tx = new Transaction();

  const [betCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(betSize * 10 ** 9)]);

  const targets = Object.keys(options).map((key) => {
    return Number(key);
  });
  const ranges = Object.values(options).map((value) => {
    return value.map((v) => Number(v));
  });

  dbClient.addBet({
    raceId,
    betCoin,
    betCoinType: coinType,
    betType,
    targets,
    ranges,
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

export const testAddRiskLimit = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  riskLimit: number,
  coinType: string
) => {
  const tx = new Transaction();

  dbClient.addRiskLimit({
    riskLimit,
    coinType,
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

export const testRemoveRiskLimit = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  coinType: string
) => {
  const tx = new Transaction();

  dbClient.removeRiskLimit({
    coinType,
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

export const testAddManager = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  manager: string
) => {
  const tx = new Transaction();

  dbClient.addManager({
    manager,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testRemoveManager = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  manager: string
) => {
  const tx = new Transaction();

  dbClient.removeManager({
    manager,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testAddVersion = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  version: number
) => {
  const tx = new Transaction();

  dbClient.addVersion({
    version,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testRemoveVersion = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  version: number
) => {
  const tx = new Transaction();

  dbClient.removeVersion({
    version,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testSetHouseEdge = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  houseEdge: number
) => {
  const tx = new Transaction();

  dbClient.setHouseEdge({
    houseEdge,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testSetPaginationLimit = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  limit: number
) => {
  const tx = new Transaction();

  dbClient.setPaginationLimit({
    limit,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testSetMaxCombo = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  maxCombo: number
) => {
  const tx = new Transaction();

  dbClient.setMaxCombo({
    maxCombo,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};

export const testUpdateStatus = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair | Ed25519Keypair,
  raceId: string,
  status: number
) => {
  const tx = new Transaction();

  dbClient.updateStatus({
    raceId,
    status,
    transaction: tx,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx as any,
  });

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.", transactionResult);
};
