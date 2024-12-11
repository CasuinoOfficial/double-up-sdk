import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { U64FromBytes } from "../../utils";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

// ps5 raffle live until end of year 2024
const raffleId =
  "0x51a8ea62752d855ea89c22a33971074125d64331149b24618ab86136297fdd3e";

export const testRaffleGet = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const raffle = await dbClient.getRaffle({
      raffleId,
    });

    console.log(raffle);
  } catch (err) {
    console.log(err);
  }
};

export const testRaffleGetTickets = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const address =
    "0xee007c079c848cb24775f644fde8bd0c3c49ccf0645cb8c81346135ea3dc5446";
  const sender = keypair.toSuiAddress();

  try {
    let tx = new Transaction();
    const { ok, err } = dbClient.getRaffleTickets({
      address,
      transaction: tx,
      raffleId,
    });

    if (!ok) {
      throw err;
    }

    let resp = await client.devInspectTransactionBlock({
      transactionBlock: tx,
      sender,
    });

    let tickets = 0;
    if (resp.results && resp.results[0].returnValues) {
      tickets = Number(U64FromBytes(resp.results![1].returnValues![0][0]));
    }

    console.log(tickets);
  } catch (err) {
    console.log(err);
  }
};

export const testRaffleBuy = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const ticketsAmount = 2;
  const ticketPrice = 2_000_000_000;
  const price = ticketsAmount * ticketPrice;

  try {
    const txb = new Transaction();

    let [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(price)]);
    let coinType = SUI_COIN_TYPE;

    const { ok, err } = dbClient.buyRaffleTickets({
      coin,
      coinType,
      raffleId,
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

export const testRaffleBuyWithDeal = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const ticketsAmount = 2;
  const ticketPrice = 2_000_000_000;
  const ticketDeal = 2;
  const price = ticketsAmount * ticketPrice;

  try {
    const txb = new Transaction();

    let [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(price)]);
    let coinType = SUI_COIN_TYPE;

    const { ok, err } = dbClient.buyRaffleTicketsWithDeal({
      coin,
      coinType,
      raffleId,
      ticketDeal,
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
