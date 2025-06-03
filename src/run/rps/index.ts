import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";
import { BetType } from "../../games/rps";

export const testRPS = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Secp256k1Keypair | Ed25519Keypair
) => {
  //Please set these in .env file before running the test script
  //If you don't have a partner NFT, leave the PARTNER_NFT_ID empty
  const { PARTNER_NFT_ID = "", TEST_WALLET_ADDRESS = "" } = process.env;

  // rock
  const betTypes: BetType[] = [0];
  const betAmount = 500000000;
  let txb = new Transaction();
  const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

  dbClient.createRockPaperScissors({
    betTypes,
    coin,
    coinType: SUI_COIN_TYPE,
    transaction: txb,
  });

  console.log("Added rps to transaction block.");

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

};
