import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";

export const testDice = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  // even
  const betType = 6;
  const betAmount = 500000000;

  try {
    const txb = new Transaction();

    txb.setGasBudget(100000000);

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const {
      ok: gameOk,
      err: gameErr,
      gameSeed,
    } = dbClient.createDice({
      betType,
      coin,
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added dice to transaction block.");

    if (!gameOk) {
      throw gameErr;
    }

    console.log("testDice check 0");

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

    console.log("testDice check 1");

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
    } = await dbClient.getDiceResult({
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
