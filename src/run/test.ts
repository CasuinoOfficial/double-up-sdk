// import { client, SuiTxBlock } from '@scallop-io/sui-kit';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../client";
import { fromHEX } from "@mysten/sui/utils";
import { Secp256k1Keypair } from '@mysten/sui/keypairs/secp256k1';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

import { testCoinflip } from "./coinflip";
import { testLimbo } from "./limbo";
import {
  testLotteryBuy,
  testLotteryGet,
  testLotteryTickets,
  testLotteryRedeem,
  testLotteryResults,
} from "./lottery";
import { 
  testPlinko,
  testMultiPlinkoCreate,
  testMultiPlinkoAdd,
} from "./plinko";
import {
  testRange,
} from "./rangeDice";
import {
  testRouletteAdd,
  testRouletteCreate,
  testRouletteStart,
} from "./roulette";
import { testRPS } from "./rps";
import { testBlackjackCreate } from "./blackjack";
import { PLINKO_PACKAGE_ID } from "../constants";
import { testCrapsAdd, testCrapsAddAndRemove, testCrapsCreate, testCrapsRoll, testCrapsSettle, testGetCrapsTable } from "./craps";

const { FUNCTION = "", MNEMONICS = "" } = process.env;
const client = new SuiClient({ url: getFullnodeUrl("testnet") });
const keypair = Secp256k1Keypair.deriveKeypair(MNEMONICS);
const secretKey = keypair.getSecretKey();
// const { schema, secretKey } = decodeSuiPrivateKey(SECRETKEY);
// const keypair = Secp256k1Keypair.fromSecretKey(secretKey);

const PARTNER_NFT_ID =
  "0x36fba171c07aa06135805a9a9d870d1565a842583f81cc386b65bd2f4335f3f3";

const dbClient = new DoubleUpClient({
  partnerNftListId: PARTNER_NFT_ID,
  suiClient: client,
});

((fnName, secretKey) => {
  if (secretKey !== "") {
    switch (fnName) {
      case "coinflip":
        testCoinflip(dbClient, client, keypair);
        break;
      case "limbo":
        testLimbo(dbClient, client, keypair);
        break;
      // case "lottery:get":
      //   testLotteryGet(dbClient, client, keypair);
      //   break;
      // case "lottery:buy":
      //   testLotteryBuy(dbClient, client, keypair);
      //   break;
      // case "lottery:redeem":
      //   testLotteryRedeem(dbClient, client, keypair);
      //   break;
      // case "lottery:results":
      //   testLotteryResults(dbClient, client, keypair);
      //   break;
      // case "lottery:tickets":
      //   testLotteryTickets(dbClient, client, keypair);
      //   break;
      case "plinko":
        testPlinko(dbClient, client, keypair);
        break;
      case "multiplinko:create":
        testMultiPlinkoCreate(dbClient, client, keypair);
        break;
      case "multiplinko:add":
        testMultiPlinkoAdd(dbClient, client, keypair);
        break;
      case "range":
        testRange(dbClient, client, keypair);
        break;
      case "roulette:add":
        testRouletteAdd(dbClient, client, keypair);
        break;
      case "roulette:create":
        testRouletteCreate(dbClient, client, keypair);
        break;
      case "roulette:start":
        testRouletteStart(dbClient, client, keypair);
        break;
      case "craps:add":
        testCrapsAdd(dbClient, client, keypair);
        break;
      case "craps:create":
        testCrapsCreate(dbClient, client, keypair);
        break;
      case "craps:roll":
        testCrapsRoll(dbClient, client, keypair);
        break;
      case "craps:remove":
        testCrapsAddAndRemove(dbClient, client, keypair);
        break;
      case "craps:get":
        testGetCrapsTable(dbClient, keypair);
        break;
      case "craps:settle":
        testCrapsSettle(dbClient, client, keypair);
        break;
      case "rps":
        testRPS(dbClient, client, keypair);
        break;
      case "blackjack:create":
        testBlackjackCreate(dbClient, client, keypair);
        break;
      default:
        console.error(
          "Use dedicated test function to test an individual game.\n"
        );
    }
  } else {
    console.error(
      "You must supply your wallet secret key in the .env file to test.\n"
    );
  }
})(FUNCTION, MNEMONICS);
