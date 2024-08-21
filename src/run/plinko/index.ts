import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

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

    const { ok: createOk, err: createErr } = dbClient.createPlinkoTable({
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added create plinko table to transaction block");

    if (!createOk) {
      throw createErr;
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

    console.log("Signed and sent transaction");

    const {
      ok: getOk,
      err: getErr,
      result,
    } = dbClient.getCreatedPlinkoTable({
      coinType: SUI_COIN_TYPE,
      transactionResult,
    });

    if (!getOk) {
      throw getErr;
    }

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

export const testMultiPlinkoAdd = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
) => {
  const betSize = 500000000;

  try {
    const txb = new Transaction();
    txb.setGasBudget(100000000);

    const creator = keypair.getPublicKey().toSuiAddress();
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

    console.log("Signed and sent transaction.");
  } catch (err) {
    console.log(err);
  }
};