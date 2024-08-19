import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

import { SUI_COIN_TYPE } from "../../constants";

export const testPlinko = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const betAmount = 500000000;
  const numberOfDiscs = 1;

  // 6 Rows
  const plinkoType = 0;

  const txb = new Transaction();

  const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  dbClient.createSinglePlinko({
    betAmount,
    coin,
    coinType: SUI_COIN_TYPE,
    numberOfDiscs,
    plinkoType,
    transaction: txb,
  });

  console.log("Added plinko to transaction block.");
  
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

  console.log("Signed and sent transaction.");

};
