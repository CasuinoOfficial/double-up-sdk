import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';

import { SUI_COIN_TYPE } from "../../constants";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testBlackjackCreate = async (
	dbClient: DoubleUpClient,
	client: SuiClient,
	keypair: Ed25519Keypair,
) => {
	try {
		const txb = new Transaction();

		const betSize = 1_000_000_000;
		const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betSize)]);

		const { ok, err} = dbClient.createBlackjackGame({
			betSize,
			coinType: SUI_COIN_TYPE,
			coin,
			transaction: txb,
		});

		console.log("Added init blackjack game to transaction");

		if (!ok) {
			throw err;
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
  } catch (err) {
    console.log(err);
  }
}