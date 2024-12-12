import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testBlackjackCreateTable = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  const txb = new Transaction();

  dbClient.createBlackjackTable({
    coinType: SUI_COIN_TYPE,
    transaction: txb,
  });

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

  console.log("Signed and sent transaction.", transactionResult);

  const resp = await dbClient.getBlackjackTable({
    coinType: SUI_COIN_TYPE,
    address: keypair.toSuiAddress(),
  });

  if (!resp) {
    return "sad";
  }
};

export const testBlackjackCreateGame = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();

    const betSize = 500_000_000;
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betSize)]);

    dbClient.createBlackjackGame({
      coinType: SUI_COIN_TYPE,
      coin,
      transaction: txb,
    });

    console.log("Added create blackjack game to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testGetBlackjackTable = async (
  dbClient: DoubleUpClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const resp = await dbClient.getBlackjackTable({
      coinType: SUI_COIN_TYPE,
      address: keypair.toSuiAddress(),
    });

    console.dir(resp, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testBlackjackPlayerHit = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();
    const HIT = 101;

    dbClient.blackjackPlayerMove({
      coinType: SUI_COIN_TYPE,
      playerAction: HIT,
      transaction: txb,
    });

    console.log("Player action HIT added to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testBlackjackPlayerStand = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();
    const STAND = 102;

    dbClient.blackjackPlayerMove({
      coinType: SUI_COIN_TYPE,
      playerAction: STAND,
      transaction: txb,
    });

    console.log("Player action STAND added to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testBlackjackPlayerDouble = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();
    const betSize = 500_000_000;
    const DOUBLE = 103;
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betSize)]);

    dbClient.blackjackPlayerMove({
      coinType: SUI_COIN_TYPE,
      playerAction: DOUBLE,
      coinOpt: coin,
      transaction: txb,
    });

    console.log("Player action DOUBLE added to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testBlackjackPlayerSplit = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();
    const betSize = 500_000_000;
    const SPLIT = 104;
    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betSize)]);

    dbClient.blackjackPlayerMove({
      coinType: SUI_COIN_TYPE,
      playerAction: SPLIT,
      coinOpt: coin,
      transaction: txb,
    });

    console.log("Player action SPLIT added to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};

export const testBlackjackPlayerSurrender = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  try {
    const txb = new Transaction();
    const SURRENDER = 105;

    dbClient.blackjackPlayerMove({
      coinType: SUI_COIN_TYPE,
      playerAction: SURRENDER,
      transaction: txb,
    });

    console.log("Player action SURRENDER added to transaction");

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
    console.dir(transactionResult, { depth: 5 });
  } catch (err) {
    console.log(err);
  }
};
