import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { SUI_COIN_TYPE } from "../../constants";
import { BetType } from "../../games/coinflip";

export const testCoinflip = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  // heads
  const betTypes: BetType[] = [0];
  const betAmount = 500000000;

  try {
    const txb = new Transaction();

    const coins = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    dbClient.createCoinflip({
      betTypes,
      coins: txb.makeMoveVec({ elements: [coins] }),
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added coinflip to transaction block.");

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

    // if (
    //   transactionResult?.effects &&
    //   transactionResult?.effects.status.status === "failure"
    // ) {
    //   throw new Error(transactionResult.effects.status.error);
    // }

    console.log("Signed and sent transaction.");

    // const {
    //   ok: resultsOk,
    //   err: resultsErr,
    //   results,
    //   rawResults,
    //   txDigests,
    // } = await dbClient.getCoinflipResult({
    //   betType,
    //   coinType: SUI_COIN_TYPE,
    //   gameSeed,
    //   transactionResult,
    // });

    // if (!resultsOk || !txDigests || !rawResults || !results) {
    //   throw resultsErr;
    // }

    // console.log("Retrieved coinflip results.");
    // console.log(
    //   "Game results:",
    //   rawResults[0]?.settlements[0]?.player_won ? "won" : "lost"
    // );
    // console.log("Coin shows:", results[0] === 0 ? "heads" : "tails");
    // console.log("Game rawResult: ", rawResults);
    // console.log("txDigests:", txDigests[0]);
  } catch (err) {
    console.error("error", err);
  }
};
