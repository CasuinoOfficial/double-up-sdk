import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testLotteryBuy = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  const amount = 2000000000;

  try {
    const address = keypair.getPublicKey().toSuiAddress();
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(amount)]);

    const tickets = [
      {
        numbers: [27, 15, 30, 7, 11],
        specialNumber: 2,
      },
    ];

    const { ok, err } = dbClient.buyLotteryTickets({
      address,
      coin,
      tickets,
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

export const testLotteryGet = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  try {
    const lottery = await dbClient.getLottery();

    console.log(lottery);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryRedeem = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  const ticketIds = [
    "0x2532e79226865b41b43781c627a0b11cef15a28267ad971d32fa99c0d2ea956b",
  ];

  try {
    const txb = new Transaction();

    const { ok, err } = dbClient.redeemLotteryTickets({
      ticketIds,
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

export const testLotteryResults = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  const round = 8679412;

  try {
    const { ok, err, result } = await dbClient.getLotteryDrawingResult({
      round,
    });

    if (!ok) {
      throw err;
    }

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryTickets = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  try {
    const address = keypair.getPublicKey().toSuiAddress();

    const { ok, err, results } = await dbClient.getLotteryTickets({
      address,
    });

    if (!ok) {
      throw err;
    }

    console.log(results);
  } catch (err) {
    console.log(err);
  }
};
