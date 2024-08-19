import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

import { RAND_OBJ_ID, SUI_COIN_TYPE, UFORANGE_MODULE_NAME, UFORANGE_PACKAGE_ID, UNI_HOUSE_OBJ_ID } from "../../constants";
import { OverUnderBet } from "../../games/ufoRange";
import { bcs } from "@mysten/sui/bcs";

export const testRange = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
    // over
    const betTypes: OverUnderBet[] = [0];
    const betAmount = 500000000;

    const range = [[49, 100]];
    const txb = new Transaction();
    const coins = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    console.log("split coins");  

    txb.moveCall({
      target: `${UFORANGE_PACKAGE_ID}::${UFORANGE_MODULE_NAME}::play`,
      typeArguments: [SUI_COIN_TYPE],
      arguments: [
        txb.object(UNI_HOUSE_OBJ_ID),
        txb.object(RAND_OBJ_ID),
        txb.makeMoveVec({ elements: [coins] }),
        txb.pure(
          bcs.vector(bcs.U64).serialize(betTypes)
        ),
        // transaction.makeMoveVec({ elements: [rangeFormArg0]}),
        txb.pure(
          bcs.vector(bcs.vector(bcs.U64)).serialize(range)
        ),
        txb.pure.string("DoubleUp")
      ],
    });

    // dbClient.createRange({
    //   betTypes,
    //   coins: txb.makeMoveVec({ elements: [coins[0], coins[1]] }),
    //   coinType: SUI_COIN_TYPE,
    //   range,
    //   transaction: txb,
    // });

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
    console.log('result', transactionResult);

    // if (
    //   transactionResult?.effects &&
    //   transactionResult?.effects.status.status === "failure"
    // ) {
    //   throw new Error(transactionResult.effects.status.error);
    // }

    // console.log("Signed and sent transaction.");
    // console.log(transactionResult);

};
