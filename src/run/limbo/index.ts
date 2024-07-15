import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";

export const testLimbo = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  const betAmount = 500000000;
  const multiplier = 1.1;

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const {
      ok: gameOk,
      err: gameErr,
      gameSeed,
    } = dbClient.createLimbo({
      coin,
      coinType: SUI_COIN_TYPE,
      multiplier,
      transaction: txb,
    });

    console.log("Added limbo to transaction block.");

    if (!gameOk || !gameSeed) {
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

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
      rawResults,
      txDigests,
    } = await dbClient.getLimboResult({
      coinType: SUI_COIN_TYPE,
      gameSeed,
      transactionResult,
    });

    if (!resultsOk) {
      throw resultsErr;
    }

    console.log("Retrieved limbo results.");
    console.log(results);
    console.log(rawResults);
    console.log(txDigests);
  } catch (err) {
    console.log(err);
  }
};
