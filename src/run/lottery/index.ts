import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Ticket } from "../../games/lottery";
import { LOTTERY_ID, USDC_COIN_TYPE } from "../../constants/mainnetConstants";

export const testLotteryBuy = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const amount = 100000;
  const lotteryId = LOTTERY_ID;
  const coinType = USDC_COIN_TYPE;
  const inputCoinUSDC = "0x3321979541ddd816a3ce0f49bdc1ae3ca4ddb8468b61e7d29ee8d9bddf54f867";

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(inputCoinUSDC, [txb.pure.u64(amount)]);

    const tickets = [
      {
        numbers: [27, 15, 30, 7, 11, 13],
        specialNumber: 2,
      } as Ticket,
    ];

    const { ok, err } = dbClient.buyLotteryTickets({
      coin,
      tickets,
      lotteryId,
      coinType,
      transaction: txb,
      origin: "TEST",
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

    console.log("Signed and sent transaction. TxDigest: ", transactionResult.digest);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryBuyOnBehalf = async (
  address: string,
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const amount = 100000;

  try {
    const txb = new Transaction();
    const lotteryId = LOTTERY_ID;
    const coinType = USDC_COIN_TYPE;
    const inputCoinUSDC = "0x3321979541ddd816a3ce0f49bdc1ae3ca4ddb8468b61e7d29ee8d9bddf54f867";

    const [coin] = txb.splitCoins(inputCoinUSDC, [txb.pure.u64(amount)]);

    const tickets = [
      {
        numbers: [27, 15, 30, 7, 11, 13],
        specialNumber: 2,
      } as Ticket,
    ];

    const { ok, err } = dbClient.buyLotteryTicketsOnBehalf({
      coin,
      tickets,
      lotteryId,
      coinType,
      transaction: txb,
      origin: "TEST",
      recipient: address,
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

    console.log("Signed and sent transaction. TxDigest: ", transactionResult.digest);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryGet = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  try {
    const lotteryId = LOTTERY_ID;
    const lottery = await dbClient.getLottery({lotteryId});

    console.dir(lottery, {depth: 3});
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryRedeem = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const epochs = [
    "610",
  ];
  const lotteryId = LOTTERY_ID;
  const coinType = USDC_COIN_TYPE;

  try {
    const txb = new Transaction();

    const { ok, err } = dbClient.redeemLotteryTickets({
      epochs,
      transaction: txb,
      lotteryId,
      coinType
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

    console.log("Signed and sent transaction. TxDigest: ", transactionResult.digest);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryResults = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {
  const epoch = 610;

  try {
    const { ok, err, result } = await dbClient.getLotteryDrawingResult({
      epoch,
    });

    if (!ok) {
      throw err;
    }

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryHistory = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
) => {

  try {
    const { ok, err, results } = await dbClient.getLotteryHistory();

    if (!ok) {
      throw err;
    }

    console.log(results);
  } catch (err) {
    console.log(err);
  }
};

export const testLotteryTickets = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair
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
