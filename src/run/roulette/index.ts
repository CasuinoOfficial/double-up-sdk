import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { SUI_COIN_TYPE } from "../../constants";

export const testRouletteAdd = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const betAmount = 500000000;

  // red
  const betType = 0;
  let betNumber;

  // number
  // const betType = 2;
  // const betNumber = 2;

  try {
    const txb = new Transaction();

    txb.setGasBudget(100000000);

    const address = keypair.getPublicKey().toSuiAddress();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const { ok, err } = dbClient.addRouletteBet({
      address,
      betNumber,
      betType,
      coin,
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added roulette bet to transaction block.");

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

export const testRouletteCreate = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const txb = new Transaction();

    dbClient.createRouletteTable({
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added roulette table create to transaction block.");

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

    const {
      ok: getOk,
      err: getErr,
      fields,
    } = await dbClient.getRouletteTable({
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

export const testRouletteStart = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
    const txb = new Transaction();

    dbClient.startRoulette({
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

    console.log('rolled a number', transactionResult);
    const txb2 = new Transaction();

    // dbClient
    dbClient.rouletteSettleOrContinue({
      coinType: SUI_COIN_TYPE,
      transaction: txb2,
      hostAddress: keypair.toSuiAddress(),
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
    console.log('rolled a number', transactionResult2);

};
