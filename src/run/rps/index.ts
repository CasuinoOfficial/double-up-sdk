import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

import { SUI_COIN_TYPE, FUD_COIN_TYPE } from "../../constants";
import {
  checkComputerBet,
  getRPSResult,
  checkBetType,
  getInputCoins,
} from "../../utils";
import { KioskTransaction } from "@mysten/kiosk";

export const testRPS = async (
  dbClient: DoubleUpClient,
  client: SuiClient,
  keypair: Ed25519Keypair
) => {
  //Please set these in .env file before running the test script
  //If you don't have a partner NFT, leave the PARTNER_NFT_ID empty
  const { PARTNER_NFT_ID = "", TEST_WALLET_ADDRESS = "" } = process.env;

  // paper
  const betType = 1;
  const numberOfBets = 5;
  const betAmount = 500000000;
  const partnerNftId = PARTNER_NFT_ID;
  const partnerNftType =
    "0xf78977221c9420f9a8ecf39b6bc28f7a576f92179bc29ecc34edca80ac7d9c55::tradeport::Nft<0x51e1abc7dfe02e348a3778a642ef658dd5c016116ee2e8813c4e3a12f975d88e::nft::UC>";

  try {
    console.log("testWallet", TEST_WALLET_ADDRESS);
    console.log("partnerNftId", partnerNftId);

    const hasPartnerNFT = partnerNftId !== "" && TEST_WALLET_ADDRESS !== "";
    const txb = new Transaction();
    const gameSeedList: string[] = [];

    if (hasPartnerNFT) {
      console.log("NFT player");

      const { kioskOwnerCaps } = await dbClient.kioskClient.getOwnedKiosks({
        address: TEST_WALLET_ADDRESS,
      });

      const kioskTx = new KioskTransaction({
        transaction: txb,
        kioskClient: dbClient.kioskClient,
        cap: kioskOwnerCaps[0],
      });

      const [item, promise] = kioskTx.borrow({
        itemId: partnerNftId,
        itemType: partnerNftType,
      });

      for (let i = 0; i < numberOfBets; i++) {
        const betCoins = await getInputCoins(
          client,
          txb,
          TEST_WALLET_ADDRESS,
          FUD_COIN_TYPE,
          [betAmount]
        );
        // const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

        const {
          ok: gameOk,
          err: gameErr,
          gameSeed,
        } = dbClient.createRockPaperScissors({
          betType,
          coin: betCoins[0],
          coinType: FUD_COIN_TYPE,
          partnerNftType,
          partnerNftArgument: item,
          transaction: txb,
        });

        if (!gameOk || !gameSeed) {
          throw gameErr;
        } else {
          gameSeedList.push(gameSeed);
        }
      }

      kioskTx
        .return({
          itemType: partnerNftType,
          item,
          promise,
        })
        .finalize();
    } else {
      console.log("General player");

      for (let i = 0; i < numberOfBets; i++) {
        const [coin] = txb.splitCoins(txb.gas, [txb.pure.u64(betAmount)]);

        const {
          ok: gameOk,
          err: gameErr,
          gameSeed,
        } = dbClient.createRockPaperScissors({
          betType,
          coin,
          coinType: SUI_COIN_TYPE,
          transaction: txb,
        });

        if (!gameOk || !gameSeed) {
          throw gameErr;
        } else {
          gameSeedList.push(gameSeed);
        }
      }
    }

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

    if (
      transactionResult?.effects &&
      transactionResult?.effects.status.status === "failure"
    ) {
      throw new Error(transactionResult?.effects.status.error);
    }

    console.log("Signed and sent transaction.");

    const {
      ok: resultsOk,
      err: resultsErr,
      results,
      rawResults,
      txDigests,
    } = await dbClient.getRockPaperScissorsResult({
      betType,
      coinType: SUI_COIN_TYPE,
      gameSeed: gameSeedList[0],
      transactionResult,
    });

    if (!resultsOk || !txDigests || !rawResults || !results) {
      throw resultsErr;
    }

    console.log("Retrieved rps results.");
    if (hasPartnerNFT) {
      console.log("Partner NFT ID:", partnerNftId);
    }
    console.log("Number of bets:", numberOfBets);
    for (let i = 0; i < numberOfBets; i++) {
      console.log(`Round ${i + 1}`);

      const computerBet = checkComputerBet(
        Number(rawResults[i].outcome),
        hasPartnerNFT
      );
      const rpsResult = getRPSResult(betType, computerBet);

      console.log("Game results:", rpsResult);
      console.log("User shows:", checkBetType(results[i]));
      console.log("PC shows:", checkBetType(computerBet));
      console.log("Game rawResult: ", rawResults[i]);
      console.log("txDigests:", txDigests[i]);
    }
  } catch (err) {
    console.error(err);
  }
};
