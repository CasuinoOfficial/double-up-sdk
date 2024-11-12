import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";

export const testRaffleGet = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const raffle = await dbClient.getRaffle();

    console.log(raffle);
  } catch (err) {
    console.log(err);
  }
};

export const testRaffleBuy = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair,
) => {
  const ticketsAmount = 2;
  const ticketPrice = 2_000_000_000;
  const price = ticketsAmount * ticketPrice;

  try {
    const txb = new Transaction();

    let [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(price)]);

    const { ok, err } = dbClient.buyRaffleTickets({
      coin,
      transaction: txb,
    });

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
};

