import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

import { SUI_COIN_TYPE } from "../../constants";

export const testLimbo = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const betAmount = 500000000;
  const multipliers = [150, 200, 101];

  try {
    const txb = new Transaction();
    const coins = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount), betAmount, betAmount]);

    dbClient.createLimbo({
      coins: txb.makeMoveVec({ elements: [coins[0], coins[1], coins[2]] }),
      coinType: SUI_COIN_TYPE,
      multipliers,
      transaction: txb,
    });

    console.log("Added limbo to transaction block.");

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
    console.log(err);
  }
};
