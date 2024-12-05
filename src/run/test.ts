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
} from "./gachapon";

const { FUNCTION = "", MNEMONICS = "" } = process.env;
const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
const keypair = Secp256k1Keypair.deriveKeypair(MNEMONICS);

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
        console.log("hit");
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
      case "gachapon:testAdminGetGachapons":
        testAdminGetGachapons(dbClient, keypair).then((res) =>
          console.log(res)
        );
        break;
      case "gachapon:testAdminGetEggs":
        testAdminGetEggs(
          dbClient,
          "0x6defc515ae3aca587c2c02fe6e9dd51f73865e70d15ced342e9c7a506ebfa40b" // lootboxId
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
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5", // keeperCapId
          "0x78562bb6bc2d6a470128179ae8e48f46daa8078e54c0c7db09fd691759bc546a", // kioskId
          3 // index
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
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x78562bb6bc2d6a470128179ae8e48f46daa8078e54c0c7db09fd691759bc546a", // kioskId
          "0x32bd4de51aa17a6506027e5a7b87de512cd2950f45776353c894228e822ef641" // eggId
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
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5" // keeperCapId
        );
        break;

      case "gachapon:testAddNftType":
        testAddNftType(
          dbClient,
          client,
          keypair,
          "0x2::sui::SUI", //coinType
          "", //objectType
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "0x904862e7054e948c89d6b2a3971e182af88542925f034d2e872357660a4f51e5" // keeperCapId
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
          "0x421c1b4dc2022b14e7905bb57d555651617111bb9947c19563b825eeee962f1a", // gachaponId
          "", //objectType
          "" //recipient
        );
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
