import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";

export const testRPS = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  // rock
  const betType = 0;
  const betAmount = 500000000;

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    const {
      ok: gameOk,
      err: gameErr,
      gameSeed,
    } = dbClient.createRockPaperScissors({
      betType,
      coin,
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added rps to transaction block.");

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
      throw new Error(transactionResult?.effects.status.error);
    }

    console.log("Signed and sent transaction.");
    // console.log(transactionResult);

    const showBetType = (betType: 0 | 1 | 2) => {
      switch (betType) {
        case 0:
          return "rock";
        case 1:
          return "paper";
        case 2:
          return "scissors";
      }
    };

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
      rawResults,
      txDigests,
    } = await dbClient.getRockPaperScissorsResult({
      betType,
      coinType: SUI_COIN_TYPE,
      gameSeed,
      transactionResult,
    });

    if (!resultsOk || !txDigests || !rawResults || !results) {
      throw resultsErr;
    }

    console.log("Retrieved rps results.");
    console.log(
      "Game results:",
      rawResults[0]?.settlements[0]?.player_won ? "won" : "lost"
    );
    console.log("User shows:", showBetType(results[0]));
    console.log("Game rawResult: ", rawResults);
    console.log("txDigests:", txDigests[0]);
  } catch (err) {
    console.error(err);
  }
};
