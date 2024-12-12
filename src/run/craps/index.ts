import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import {
  CrapsRemoveBetResponse,
  PassLineBet,
  PlaceBet,
} from "../../games/craps";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testCrapsCreate = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const txb = new Transaction();

  dbClient.createCrapsTable({
    coinType: SUI_COIN_TYPE,
    transaction: txb,
  });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb as any,
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

  const resp = await dbClient.getCrapsTable({
    coinType: SUI_COIN_TYPE,
    address: keypair.toSuiAddress(),
  });

  if (!resp) {
    return "sad";
  }
};

export const testGetCrapsTable = async (
  dbClient: DoubleUpClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const resp = await dbClient.getCrapsTable({
      coinType: SUI_COIN_TYPE,
      address: keypair.toSuiAddress(),
    });

    console.log(resp);
  } catch (e) {
    console.log(e);
  }
};

export const testCrapsAdd = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const txb = new Transaction();
  const betAmount = 500000000;

  const address = keypair.getPublicKey().toSuiAddress();

  const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  dbClient.addCrapsBet({
    address,
    betType: PassLineBet,
    coin,
    coinType: SUI_COIN_TYPE,
    transaction: txb,
  });
  // const [coin2] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  // dbClient.addCrapsBet({
  //   address,
  //   betType: PlaceBet,
  //   betNumber: 6,
  //   coin: coin2,
  //   coinType: SUI_COIN_TYPE,
  //   transaction: txb,
  // });
  // const [coin3, coin4, coin5] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount), txb.pure.u64(betAmount), txb.pure.u64(betAmount)]);

  // dbClient.addCrapsBet({
  //   address,
  //   betType: PlaceBet,
  //   betNumber: 8,
  //   coin: coin3,
  //   coinType: SUI_COIN_TYPE,
  //   transaction: txb,
  // });

  // dbClient.addCrapsBet({
  //   address,
  //   betType: PlaceBet,
  //   betNumber: 5,
  //   coin: coin4,
  //   coinType: SUI_COIN_TYPE,
  //   transaction: txb,
  // });

  // dbClient.addCrapsBet({
  //   address,
  //   betType: PlaceBet,
  //   betNumber: 9,
  //   coin: coin5,
  //   coinType: SUI_COIN_TYPE,
  //   transaction: txb,
  // });

  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb as any,
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

export const testCrapsAddAndRemove = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const address = keypair.getPublicKey().toSuiAddress();

  const txb2 = new Transaction();
  let resp: CrapsRemoveBetResponse = dbClient.removeCrapsBet({
    tableOwner: address,
    betType: PassLineBet,
    coinType: SUI_COIN_TYPE,
    transaction: txb2,
  });

  txb2.transferObjects([resp.returnedCoin], keypair.toSuiAddress());

  const transactionResult2 = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb2 as any,
    options: {
      showRawEffects: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  });

  console.log("Signed and sent transaction.", transactionResult2);
};

export const testCrapsRoll = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const txb = new Transaction();

  dbClient.startCraps({
    coinType: SUI_COIN_TYPE,
    transaction: txb,
  });
  const transactionResult = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb as any,
    options: {
      showRawEffects: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  });

  console.log("rolled a number", transactionResult);
};

export const testCrapsSettle = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const txb2 = new Transaction();

  dbClient.crapsSettleOrContinue({
    coinType: SUI_COIN_TYPE,
    transaction: txb2,
    hostAddress: keypair.toSuiAddress(),
    // hostAddress: '0x2679d10a99fde34ef57bf28e22cc11c78bf2d9e8353530992df35b2160cf4b9a'
  });

  const transactionResult2 = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: txb2 as any,
    options: {
      showRawEffects: true,
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
    },
  });
  console.log("Settled", transactionResult2);
};
