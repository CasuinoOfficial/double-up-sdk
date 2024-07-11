import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";

export const testRouletteAdd = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
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
  keypair: Ed25519Keypair
) => {
  try {
    const txb = new Transaction();

    const { ok: createOk, err: createErr } = dbClient.createRouletteTable({
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added roulette table create to transaction block.");

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

    console.log("Signed and sent transaction.");

    const {
      ok: getOk,
      err: getErr,
      result,
    } = dbClient.getCreatedRouletteTable({
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

export const testRouletteExists = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  try {
    const address = keypair.getPublicKey().toSuiAddress();

    const { ok, err, tableExists } = await dbClient.doesRouletteTableExist({
      address,
      coinType: SUI_COIN_TYPE,
    });

    if (!ok) {
      throw err;
    }

    console.log({ tableExists });
  } catch (err) {
    console.log(err);
  }
};

export const testRouletteStart = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  try {
    const txb = new Transaction();

    const address = keypair.getPublicKey().toSuiAddress();

    const {
      ok: startOk,
      err: startErr,
      gameSeed,
    } = dbClient.startRoulette({
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    if (!startOk) {
      throw startErr;
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

    // Get the current round number of the object
    const { roundNumber } = await dbClient.doesRouletteTableExist({
      address,
      coinType: SUI_COIN_TYPE,
    });

    const {
      ok: resultOk,
      err: resultErr,
      results,
      rawBetResults,
      rawResults,
    } = await dbClient.getRouletteResult({
      coinType: SUI_COIN_TYPE,
      //TODO: need to confirm could the gameSeed be empty string or not
      gameSeed: gameSeed ?? "",
      transactionResult,
      //TODO: need to confirm could the roundNumber be empty string or not
      roundNumber: roundNumber ?? "",
    });

    if (!resultOk) {
      throw resultErr;
    }

    console.log(results);
    console.log("raws", rawBetResults, rawResults);
  } catch (err) {
    console.log(err);
  }
};
