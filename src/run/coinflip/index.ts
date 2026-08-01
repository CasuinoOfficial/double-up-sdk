import { Transaction } from "@mysten/sui/transactions";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { signAndExecute } from "../utils";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { BetType } from "../../games/coinflip";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const testCoinflip = async (
  dbClient: DoubleUpClient,
  client: SuiGrpcClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  // heads
  // const betTypes: BetType[] = [0];
  const betAmount = 5000000;

  // 100 bets
  let betTypes: BetType[] = [];
  for (let i = 0; i < 100; i++) {
    betTypes.push(1); // all tails
  }

  try {
    const txb = new Transaction();

    const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

    dbClient.createCoinflip({
      betTypes,
      coin,
      coinType: SUI_COIN_TYPE,
      transaction: txb,
    });

    console.log("Added coinflip to transaction block.");

    const transactionResult = await signAndExecute(client, keypair, txb);
    console.log("result", transactionResult);


    console.log("Events", transactionResult?.events);

    return transactionResult?.events;
  } catch (err) {
    console.error("error", err);
  }
};
