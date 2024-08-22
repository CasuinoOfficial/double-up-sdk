import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { PlinkoRemoveBetResponse } from "../../games/plinko";

import { SUI_COIN_TYPE } from "../../constants";

export const testPlinko = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const betAmount = 500000000;
  const numberOfDiscs = 1;

  // 6 Rows
  const plinkoType = 0;

  const txb = new Transaction();

  const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  dbClient.createSinglePlinko({
    betAmount,
    coin,
    coinType: SUI_COIN_TYPE,
    numberOfDiscs,
    plinkoType,
    transaction: txb,
  });

  console.log("Added plinko to transaction block.");
  
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
  console.log('result', transactionResult);

  if (
    transactionResult?.effects &&
    transactionResult?.effects.status.status === "failure"
  ) {
    throw new Error(transactionResult.effects.status.error);
  }

  console.log("Signed and sent transaction.");

};

export const testMultiPlinkoCreate = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const txb = new Transaction();

    dbClient.createPlinkoTable({
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added create plinko table to transaction block");

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

    console.log("Signed and sent transaction", transactionResult);

    const {
      ok: getOk,
      err: getErr,
      fields,
    } = await dbClient.getPlinkoTable({
      coinType: SUI_COIN_TYPE,
      address: keypair.toSuiAddress(),
    });

    if (!getOk) {
      throw getErr;
    }

    console.log(fields);
  } catch (err) {
    console.log(err);
  }
};

export const testMultiPlinkoGet = async (
  dbClient: DoubleUpClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const {
      ok: getOk,
      err: getErr,
      fields,
    } = await dbClient.getPlinkoTable({
      coinType: SUI_COIN_TYPE,
      address: keypair.toSuiAddress(),
    });

    if (!getOk) {
      throw getErr;
    }

    console.log(fields);
  } catch (err) {
      console.log(err);
  }
}

export const testMultiPlinkoAdd = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
) => {
  const betSize = 500000000;

  try {
    const txb = new Transaction();

    const creator = keypair.toSuiAddress();
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betSize)]);

    const { ok, err } = dbClient.addPlinkoBet({
      coinType: SUI_COIN_TYPE,
      creator,
      coin,
      transaction: txb,
    });

    console.log("Added plinko bet to transaction block");

    if (!ok) {
      throw err;
    }

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
  } catch (err) {
    console.log(err);
  }
};

export const testMultiPlinkoRemove = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const address = keypair.getPublicKey().toSuiAddress();

    const txb2 = new Transaction();
    let { ok, err, returnedCoin} : PlinkoRemoveBetResponse = dbClient.removePlinkoBet({
        creator: address,
        player: address,
        coinType: SUI_COIN_TYPE,
        transaction: txb2,
    });

    if (!returnedCoin) {
      throw err;
    }
    
    txb2.transferObjects([returnedCoin], keypair.toSuiAddress());

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
  } catch (err) {
    console.log(err);
  }
}

export const testMultiPlinkoStart = async(
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
) => {
  try {
    const txb2 = new Transaction();
    
    dbClient.startMultiPlinko({
      coinType: SUI_COIN_TYPE,
      creator: keypair.toSuiAddress(),
      numberOfDiscs: 2,
      betSize: 250000000,
      plinkoType: 0,
      transaction: txb2,
      origin: "DoubleUp",
    });

    console.log("Added start multi plinko to transaction block");

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

    if (
      transactionResult2?.effects &&
      transactionResult2?.effects.status.status === "failure"
    ) {
      throw new Error(transactionResult2.effects.status.error);
    }

  console.log("Signed and sent transaction.", transactionResult2);

  } catch (err) {
    console.log(err);
  }
}