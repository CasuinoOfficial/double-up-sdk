import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";

import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testLimbo = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const betAmount = 1500000000;
  const multipliers = [150, 200, 101];

  try {
    const txb = new Transaction();
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    dbClient.createLimbo({
      coin,
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
    console.log("result", transactionResult);

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
