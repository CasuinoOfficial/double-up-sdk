import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE } from "../../constants";
import { checkComputerBet, getRPSResult, checkBetType } from "../../utils";

export const testRPS = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  // rock
  const betType = 0;
  const numberOfBets = 3;
  const betAmount = 500000000;

  try {
    const txb = new Transaction();
    const gameSeedList: string[] = [];

    for (let i = 0; i < numberOfBets; i++) {
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

      if (!gameOk || !gameSeed) {
        throw gameErr;
      } else {
        gameSeedList.push(gameSeed);
      }
    }

    console.log("Added rps to transaction block.");

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

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
      rawResults,
      txDigests,
    } = await dbClient.getRockPaperScissorsResult({
      betType,
      coinType: SUI_COIN_TYPE,
      gameSeed: gameSeedList[0],
      transactionResult,
    });

    if (!resultsOk || !txDigests || !rawResults || !results) {
      throw resultsErr;
    }

    console.log("Retrieved rps results.");
    console.log("Number of bets:", numberOfBets);
    for (let i = 0; i < numberOfBets; i++) {
      console.log(`Round ${i + 1}`);

      const computerBet = checkComputerBet(Number(rawResults[i].outcome));
      const rpsResult = getRPSResult(betType, computerBet);

      console.log("Game results:", rpsResult);
      console.log("User shows:", checkBetType(results[i]));
      console.log("PC shows:", checkBetType(computerBet));
      console.log("Game rawResult: ", rawResults[i]);
      console.log("txDigests:", txDigests[i]);
    }
  } catch (err) {
    console.error(err);
  }
};
