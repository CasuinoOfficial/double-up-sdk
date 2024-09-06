import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { BetType } from "../../games/coinflip";

export const testCoinflip = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  // heads
  // const betTypes: BetType[] = [0];
  const betAmount = 500000000;

  // 100 bets
  let betTypes: BetType[] = [];
  for (let i = 0; i < 100; i++) {
    betTypes.push(1); // all tails
  };

  try {
    const txb = new Transaction();
    
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    dbClient.createCoinflip({
      betTypes,
      coin,
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

    if (
      transactionResult?.effects &&
      transactionResult?.effects.status.status === "failure"
    ) {
      throw new Error(transactionResult.effects.status.error);
    }
    
    console.log("Events", transactionResult?.events);

    return transactionResult?.events;

  } catch (err) {
    console.error("error", err);
  }
};
