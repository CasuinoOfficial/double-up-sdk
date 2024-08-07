import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";

export const testRangeDiceOverUnder = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  // over
  const betType = 0;
  const betAmount = 500000000;

  const range = 1;

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const {
      ok: gameOk,
      err: gameErr,
      gameSeed,
    } = dbClient.createRangeDice({
      betType,
      coin,
      coinType: SUI_COIN_TYPE,
      range,
      transaction: txb,
    });

    console.log("Added ranged dice (over/under) to transaction block.");

    if (!gameOk) {
      throw gameErr;
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
    console.log(transactionResult);

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
    } = await dbClient.getRangeDiceResult({
      betType,
      coinType: SUI_COIN_TYPE,
      //TODO: need to confirm could the gameSeed be empty string or not
      gameSeed: gameSeed ?? "",
      transactionResult,
    });

    if (!resultsOk) {
      throw resultsErr;
    }

    console.log("Retrieved dice results.");
    console.log(results);
  } catch (err) {
    console.log(err);
  }
};

export const testRangeDiceInsideOutside = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  // inside
  const betType = 2;
  const betAmount = 500000000;

  const range = [3, 4];

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const {
      ok: gameOk,
      err: gameErr,
      gameSeed,
    } = dbClient.createRangeDice({
      betType,
      coin,
      coinType: SUI_COIN_TYPE,
      range,
      transaction: txb,
    });

    console.log("Added ranged dice (inside/out) to transaction block.");

    if (!gameOk) {
      throw gameErr;
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
    console.log(transactionResult);

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
    } = await dbClient.getRangeDiceResult({
      betType,
      coinType: SUI_COIN_TYPE,
      //TODO: need to confirm could the gameSeed be empty string or not
      gameSeed: gameSeed ?? "",
      transactionResult,
    });

    if (!resultsOk) {
      throw resultsErr;
    }

    console.log("Retrieved dice results.");
    console.log(results);
  } catch (err) {
    console.log(err);
  }
};
