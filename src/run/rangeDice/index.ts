import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";

import {
  RAND_OBJ_ID,
  SUI_COIN_TYPE,
  UFORANGE_MODULE_NAME,
  UFORANGE_PACKAGE_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import { InsideOutsideBet } from "../../games/ufoRange";
import { bcs } from "@mysten/sui/bcs";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testRange = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  // inside / outside
  const betTypes: InsideOutsideBet[] = [0, 1];
  const betAmount = 500000000;

  const range = [
    [5001, 10000],
    [1, 5000],
  ];
  const txb = new Transaction();
  const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  dbClient.createRange({
    betTypes,
    coin,
    coinType: SUI_COIN_TYPE,
    range,
    transaction: txb,
  });

  console.log("Added ranged dice (over/under) to transaction block.");

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
  console.log("result", transactionResult);
};
