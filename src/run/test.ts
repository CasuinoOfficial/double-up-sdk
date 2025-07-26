// import { client, SuiTxBlock } from '@scallop-io/sui-kit';
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../client";
import { fromHEX } from "@mysten/sui/utils";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

import { testCoinflip } from "./coinflip";
import { testLimbo } from "./limbo";
import {
  testLotteryBuy,
  testLotteryGet,
  testLotteryTickets,
  testLotteryRedeem,
  testLotteryResults,
  testLotteryHistory,
} from "./lottery";
import {
  testPlinko,
  testMultiPlinkoCreate,
  testMultiPlinkoAdd,
  testMultiPlinkoRemove,
  testMultiPlinkoGet,
  testMultiPlinkoStart,
} from "./plinko";
import { testRange } from "./rangeDice";
import {
  testRouletteAdd,
  testRouletteCreate,
  testRouletteStart,
} from "./roulette";
import { testRPS } from "./rps";
import {
  testBlackjackCreateTable,
  testBlackjackCreateGame,
  testBlackjackPlayerDouble,
  testBlackjackPlayerHit,
  testBlackjackPlayerSplit,
  testBlackjackPlayerStand,
  testBlackjackPlayerSurrender,
  testGetBlackjackTable,
} from "./blackjack";
import {
  testCrapsAdd,
  testCrapsAddAndRemove,
  testCrapsCreate,
  testCrapsRoll,
  testCrapsSettle,
  testGetCrapsTable,
} from "./craps";
import {
  testGetUnihouseData,
  testGetUnihouseRedeemRequests,
  testGetGTokenBalance,
  testGetMaxBet,
} from "./unihouse";
import { testGetCurves } from "./pump";
import {
  testRaffleBuy,
  testRaffleBuyWithDeal,
  testRaffleGet,
  testRaffleGetTickets,
} from "./raffles";
import {
  testAddEgg,
  testCreateGachapon,
  testGetGachapon,
  testAdminGetGachapons,
  testAdminGetEggs,
  testCloseGachapon,
  testAddEmptyEgg,
  testRemoveEgg,
  testClaimGachaponTreasury,
  testUpdateCost,
  testAddSupplier,
  testRemoveSupplier,
  testDrawEgg,
  testDestroyEgg,
  testCreateFreeSpinner,
  testDrawFreeSpin,
  testAddNftType,
  testRemoveNftType,
  testClaimEgg,
  testGetGachapons,
} from "./gachapon";
import { testAddBet, testAddManager, testAddRiskLimit } from "./marble_racing";

const { FUNCTION = "", MNEMONICS = "", SECP_MNEMONICS = "" } = process.env;
const client = new SuiClient({ url: "https://fullnode-doubleup.com" });
const secpKeypair = Secp256k1Keypair.deriveKeypair(SECP_MNEMONICS);
const keypair = Ed25519Keypair.fromSecretKey(
  decodeSuiPrivateKey(MNEMONICS).secretKey
);

const PARTNER_NFT_ID =
  "0x36fba171c07aa06135805a9a9d870d1565a842583f81cc386b65bd2f4335f3f3";

const dbClient = new DoubleUpClient({
  partnerNftListId: PARTNER_NFT_ID,
  suiClient: client,
});

((fnName, secretKey) => {
  if (secretKey !== "") {
    console.log(keypair.toSuiAddress());
    switch (fnName) {
      case "coinflip":
        testCoinflip(dbClient, client, keypair);
        break;
      case "limbo":
        testLimbo(dbClient, client, keypair);
        break;
      case "lottery:get":
        testLotteryGet(dbClient, client, secpKeypair);
        break;
      case "lottery:buy":
        testLotteryBuy(dbClient, client, secpKeypair);
        break;
      case "lottery:redeem":
        testLotteryRedeem(dbClient, client, secpKeypair);
        break;
      case "lottery:results":
        testLotteryResults(dbClient, client, secpKeypair);
        break;
      case "lottery:history":
        testLotteryHistory(dbClient, client, secpKeypair);
        break;
      case "lottery:tickets":
        testLotteryTickets(dbClient, client, secpKeypair);
        break;
      case "plinko":
        testPlinko(dbClient, client, keypair);
        break;
      case "multiplinko:create":
        testMultiPlinkoCreate(dbClient, client, keypair);
        break;
      case "multiplinko:add":
        testMultiPlinkoAdd(dbClient, client, keypair);
        break;
      case "multiplinko:remove":
        testMultiPlinkoRemove(dbClient, client, keypair);
        break;
      case "multiplinko:get":
        testMultiPlinkoGet(dbClient, keypair);
        break;
      case "multiplinko:start":
        testMultiPlinkoStart(dbClient, client, keypair);
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
      case "blackjack:createTable":
        testBlackjackCreateTable(dbClient, client, keypair);
        break;
      case "blackjack:createGame":
        testBlackjackCreateGame(dbClient, client, keypair);
        break;
      case "blackjack:get":
        testGetBlackjackTable(dbClient, keypair);
        break;
      case "blackjack:hit":
        testBlackjackPlayerHit(dbClient, client, keypair);
        break;
      case "blackjack:stand":
        testBlackjackPlayerStand(dbClient, client, keypair);
        break;
      case "blackjack:double":
        testBlackjackPlayerDouble(dbClient, client, keypair);
        break;
      case "blackjack:split":
        testBlackjackPlayerSplit(dbClient, client, keypair);
        break;
      case "blackjack:surrender":
        testBlackjackPlayerSurrender(dbClient, client, keypair);
        break;
      case "raffle:get":
        testRaffleGet(dbClient, client, keypair);
        break;
      case "raffle:buy":
        testRaffleBuy(dbClient, client, keypair);
        break;
      case "raffle:buyWithDeal":
        testRaffleBuyWithDeal(dbClient, client, keypair);
        break;
      case "raffle:getUserTickets":
        testRaffleGetTickets(dbClient, client, keypair);
        break;
      case "unihouse:data":
        testGetUnihouseData(dbClient).then((res) => console.log(res));
        break;
      case "unihouse:redeemrequests":
        testGetUnihouseRedeemRequests(dbClient).then((res) => console.log(res));
        break;
      case "unihouse:getgtokenbalance":
        testGetGTokenBalance(dbClient, keypair.toSuiAddress())
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
        break;
      case "unihouse:getmaxbet":
        testGetMaxBet(dbClient)
          .then((res) => console.log(res))
          .catch((err) => console.error(err));
        break;
      case "pump:getcurves":
        testGetCurves(dbClient).then((res) => console.log(res));
        break;
      case "gachapon:createGachapon":
        testCreateGachapon(
          dbClient,
          client,
          keypair,
          0,
          "0x2::sui::SUI",
          "0x6f9c618b5e4e90bd5f55528f314c264562a1bfe3cb07aea03cbe9266b349f37d"
        );
        break;
      case "gachapon:closeGachapon":
        testCloseGachapon(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0xfa8a633987d661524381bd8672b3bfd3e2d00340781f76846a4223d2d7a79251", // gachaponId
          "0xacf0ea9eaa7a8487bdc7d74463f676f4cfe79b6224a3f1eda572f8e0b9544756", // keeperCapId
          "0x56a2c6d30965696bcf123d591587951ac0dd87590c6616b6d3b89ed7b201a8da" // kioskId
        );
        break;
      case "gachapon:testGetGachapons":
        testGetGachapons(dbClient, keypair).then((res) => console.log(res));
        break;
      case "gachapon:testAdminGetGachapons":
        testAdminGetGachapons(dbClient, keypair).then((res) =>
          console.log(res)
        );
        break;
      case "gachapon:testAdminGetEggs":
        testAdminGetEggs(
          dbClient,
          "0x32872396a244b5ed76bbeeb7cf5008833904d0fa50a8d45af43d48252a3dcd0a", // lootboxId
          "11" //sliceCount
        ).then((res) => console.log(res));
        break;
      case "gachapon:testGetGachapon":
        testGetGachapon(
          dbClient,
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a"
        );
        break;
      case "gachapon:testAddEgg":
        testAddEgg(
          dbClient,
          client,
          keypair,
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0xcaa8b6842fa64b1a39078b5c012d08b0c1e1ee00108740de5b5d67dcc2236a94" //objectId
        );
        break;
      case "gachapon:testRemoveEgg":
        testRemoveEgg(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x9e9572976a5fa31be2b9e9ee57d396aa270934b1a6f1fbedd5e34d81dec8af2a", // gachaponId
          "0x4212aa2a6d148a75b9cfc344e61725e785cec303dbbc52cde69768105cf33bb7", // keeperCapId
          "0x7bcaa9d2a4d4df16297d9ea83f6eee62273472834acd822ebc1b42bc758e470b", // kioskId
          2, // index
          "0xee4294311c50cbd288bff90cbaa20b1c0b5c4038b1822d484a16a10ac4056c56", // objectId
          false, // isEmpty
          true // isLocked
        );
        break;
      case "gachapon:testAddEmptyEgg":
        testAddEmptyEgg(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5", // keeperCapId
          2
        );
        break;
      case "gachapon:testClaimEgg":
        testClaimEgg(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x9e9572976a5fa31be2b9e9ee57d396aa270934b1a6f1fbedd5e34d81dec8af2a", // gachaponId
          "0x7bcaa9d2a4d4df16297d9ea83f6eee62273472834acd822ebc1b42bc758e470b", // kioskId
          "0x276b5e02bda8716d8dbe00b92a4791e086c47076487050d7beca0c77944ed267" // eggId
        ).then((res) => console.log(res));
        break;
      case "gachapon:testClaimGachaponTreasury":
        testClaimGachaponTreasury(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5" // keeperCapId
        );
        break;
      case "gachapon:testUpdateCost":
        testUpdateCost(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5", // keeperCapId
          10_000_000 //newCost
        );
        break;
      case "gachapon:testAddSupplier":
        testAddSupplier(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5", // keeperCapId
          "0xc5f9b77a07c38acc5418008dfe69255872d45e3d2334e1f52a530d1e4ad52866" //newSupplierAddress
        );
        break;
      case "gachapon:testRemoveSupplier":
        testRemoveSupplier(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5", // keeperCapId
          "0xc5f9b77a07c38acc5418008dfe69255872d45e3d2334e1f52a530d1e4ad52866" //supplierAddress
        );
        break;
      case "gachapon:testDrawEgg":
        testDrawEgg(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          1, //count
          keypair.toSuiAddress() //recipient
        );
        break;
      case "gachapon:testDestroyEgg":
        testDestroyEgg(
          dbClient,
          client,
          keypair,
          "" // eggId
        );
        break;
      case "gachapon:testCreateFreeSpinner":
        testCreateFreeSpinner(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0xa92ab35da991f299a919ced409b1b37478ef83d9df77823d6343f322676d106b", // gachaponId
          "0xb11d0b5afa3c2fe3cf1777c54462cd848fc5b303bb50af6e99ccae801c2da64b" // keeperCapId
        );
        break;

      case "gachapon:testAddNftType":
        testAddNftType(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0xbb35722bdffea8d6b19cbb329673d1ae77f17ee83e1cab23615e9c0c55dc4dfa::keepsake_nft::KEEPSAKE", //objectType
          "0xd128f31b1d94a47f7b5ec4249f4e4fb3886dc036cc615aad70d1a9f3eec8872d", // gachaponId
          "0xda623f352d59703adf558a1e2741c6279a26c562f3052553c04a38d8a195a3ff" // keeperCapId
        );
        break;

      case "gachapon:testRemoveNftType":
        testRemoveNftType(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "", //objectType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5" // keeperCapId
        );
        break;
      case "gachapon:testDrawFreeSpin":
        testDrawFreeSpin(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "0xa92ab35da991f299a919ced409b1b37478ef83d9df77823d6343f322676d106b", // gachaponId
          "0x6e68a31df75ffd03f41692507d60f89ede0edcd38fffd7110a0faca3c9117e83", //ObjectId
          "0x350423e5588ea5cb9c367ff9d5ef6285e4cffa8a45c3f148a2e70605f24a47dd" //recipient
        );
        break;
      case "marble_racing:testAddBet":
        testAddBet(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI",
          "0xf671c3aab7ffe134560afe833c31352215a37f83936257741554aba92b6d1ae4",
          0.0001,
          {
            "343": 0,
          }
        );
        break;
      case "marble_racing:testAddRiskLimit":
        testAddRiskLimit(
          dbClient,
          client,
          keypair,
          20_000 * 10 ** 9,
          "0x2::sui::SUI"
        );
        break;
      case "marble_racing:testAddManager":
        testAddManager(dbClient, client, keypair, "address");
        break;

      default:
      // Test all
      // testCoinflip(dbClient, client, keypair);
      // testLimbo(dbClient, client, keypair);
      // testPlinko(dbClient, client, keypair);
      // testMultiPlinkoCreate(dbClient, client, keypair);
      // testMultiPlinkoAdd(dbClient, client, keypair);
      // testMultiPlinkoRemove(dbClient, client, keypair);
      // testMultiPlinkoGet(dbClient, keypair);
      // testMultiPlinkoStart(dbClient, client, keypair);
      // testRange(dbClient, client, keypair);
      // testRouletteAdd(dbClient, client, keypair);
      // testRouletteCreate(dbClient, client, keypair);
      // testRouletteStart(dbClient, client, keypair);
      // testCrapsAdd(dbClient, client, keypair);
      // testCrapsCreate(dbClient, client, keypair);
      // testCrapsRoll(dbClient, client, keypair);
      // testCrapsAddAndRemove(dbClient, client, keypair);
      // testGetCrapsTable(dbClient, keypair);
      // testCrapsSettle(dbClient, client, keypair);
      // testRPS(dbClient, client, keypair);
      // testBlackjackCreate(dbClient, client, keypair);
      // testGetBlackjackTable(dbClient, keypair);
      // testBlackjackPlayerHit(dbClient, client, keypair);
      // testBlackjackPlayerStand(dbClient, client, keypair);
      // testBlackjackPlayerDouble(dbClient, client, keypair);
      // testBlackjackPlayerSplit(dbClient, client, keypair);
      // testBlackjackPlayerSurrender(dbClient, client, keypair);
    }
  } else {
    console.error(
      "You must supply your wallet secret key in the .env file to test.\n"
    );
  }
})(FUNCTION, MNEMONICS);
