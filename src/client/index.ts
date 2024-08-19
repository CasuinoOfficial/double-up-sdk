import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { KioskClient, Network } from "@mysten/kiosk";
import {
  COIN_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  ROULETTE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  UFORANGE_PACKAGE_ID,
} from "../constants";

import {
  createCoinflip,
  CoinflipInput,
} from "../games/coinflip";

import {
  createLimbo,
  LimboInput,
} from "../games/limbo";

import {
  buyLotteryTickets,
  getLottery,
  getLotteryDrawingResult,
  getLotteryHistory,
  getLotteryTickets,
  redeemLotteryTickets,
  DrawingResultInput,
  LotteryTicketsInput,
} from "../games/lottery";

import {
  createSinglePlinko,
  PlinkoInput,
  PlinkoResultInput,
} from "../games/plinko";

import {
  createRange,
  RangeInput,
} from "../games/ufoRange";

import {
  addRouletteBet,
  createRouletteTable,
  doesRouletteTableExist,
  getCreatedRouletteTable,
  getRouletteResult,
  removeRouletteBet,
  startRoulette,
  CreatedRouletteTableInput,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteResultInput,
  RouletteStartInput,
  RouletteTableInput,
  RouletteTableExistsInput,
} from "../games/roulette";

import {
  createRockPaperScissors,
  RPSInput,
} from "../games/rps";

interface DoubleUpClientInput {
  coinflipPackageId?: string;
  dicePackageId?: string;
  limboPackageId?: string;
  origin?: string;
  partnerNftListId?: string;
  plinkoPackageId?: string;
  ufoRangePackageId?: string;
  roulettePackageId?: string;
  rpsPackageId?: string;
  suiClient?: SuiClient;
  kioskClient?: KioskClient;
}

export class DoubleUpClient {
  constructor({
    coinflipPackageId = COIN_PACKAGE_ID,
    limboPackageId = LIMBO_PACKAGE_ID,
    origin = "DoubleUp",
    partnerNftListId,
    plinkoPackageId = PLINKO_PACKAGE_ID,
    ufoRangePackageId = UFORANGE_PACKAGE_ID,
    // rangeDiceCorePackageId = RANGE_DICE_CORE_PACKAGE_ID,
    roulettePackageId = ROULETTE_PACKAGE_ID,
    rpsPackageId = RPS_PACKAGE_ID,
    // rpsCorePackageId = RPS_CORE_PACKAGE_ID,
    suiClient = new SuiClient({ url: getFullnodeUrl("testnet") }),
  }: DoubleUpClientInput) {
    this.coinflipPackageId = coinflipPackageId;
    // this.coinflipCorePackageId = coinflipCorePackageId;

    this.limboPackageId = limboPackageId;

    this.origin = origin;

    this.partnerNftListId = partnerNftListId;

    this.plinkoPackageId = plinkoPackageId;
    this.ufoRangePackageId = ufoRangePackageId;
    // this.rangeDiceCorePackageId = rangeDiceCorePackageId;

    this.roulettePackageId = roulettePackageId;

    // this.rpsPackageId = rpsPackageId;
    // this.rpsCorePackageId = rpsCorePackageId;

    this.suiClient = suiClient;
    this.kioskClient = new KioskClient({
      client: suiClient,
      network: Network.TESTNET,
    });
  }

  coinflipPackageId: string;

  dicePackageId: string;

  limboPackageId: string;

  origin: string;

  partnerNftListId: string | undefined;

  plinkoPackageId: string;

  ufoRangePackageId: string;

  roulettePackageId: string;

  rpsPackageId: string;

  suiClient: SuiClient;
  kioskClient: KioskClient;

  // coinflip
  createCoinflip = (input: CoinflipInput) =>
    createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });

  // // lottery
  // buyLotteryTickets = buyLotteryTickets;
  // redeemLotteryTickets = redeemLotteryTickets;
  // getLottery = () => getLottery({ suiClient: this.suiClient });
  // getLotteryHistory = () => getLotteryHistory({ suiClient: this.suiClient });
  // getLotteryDrawingResult = (input: DrawingResultInput) =>
  //   getLotteryDrawingResult({
  //     ...input,
  //     suiClient: this.suiClient,
  //   });
  // getLotteryTickets = (input: LotteryTicketsInput) =>
  //   getLotteryTickets({
  //     ...input,
  //     suiClient: this.suiClient,
  //   });

  // limbo
  createLimbo = (input: LimboInput) =>
    createLimbo({ ...input, limboPackageId: this.limboPackageId });

  // // plinko
  createSinglePlinko = (input: PlinkoInput) =>
    createSinglePlinko({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
    });

  // UFO
  createRange = (input: RangeInput) =>
    createRange({
      ...input,
      partnerNftListId: this.partnerNftListId,
      ufoRangePackageId: this.ufoRangePackageId
  });

  // // roulette
  // addRouletteBet = (input: RouletteAddBetInput) =>
  //   addRouletteBet({
  //     ...input,
  //     origin: this.origin,
  //     roulettePackageId: this.roulettePackageId,
  //   });
  // createRouletteTable = (input: RouletteTableInput) =>
  //   createRouletteTable({
  //     ...input,
  //     roulettePackageId: this.roulettePackageId,
  //   });
  // doesRouletteTableExist = (input: RouletteTableExistsInput) =>
  //   doesRouletteTableExist({
  //     ...input,
  //     rouletteCorePackageId: this.rouletteCorePackageId,
  //     suiClient: this.suiClient,
  //   });
  // getCreatedRouletteTable = (input: CreatedRouletteTableInput) =>
  //   getCreatedRouletteTable({
  //     ...input,
  //     roulettePackageId: this.roulettePackageId,
  //   });
  // getRouletteResult = (input: RouletteResultInput) =>
  //   getRouletteResult({
  //     ...input,
  //     rouletteCorePackageId: this.rouletteCorePackageId,
  //     suiClient: this.suiClient,
  //   });
  // removeRouletteBet = (input: RouletteRemoveBetInput) =>
  //   removeRouletteBet({
  //     ...input,
  //     origin: this.origin,
  //     roulettePackageId: this.roulettePackageId,
  //   });
  // startRoulette = (input: RouletteStartInput) =>
  //   startRoulette({
  //     ...input,
  //     roulettePackageId: this.roulettePackageId,
  //   });

  // // rps
  // createRockPaperScissors = (input: RPSInput) =>
  //   createRockPaperScissors({
  //     ...input,
  //     partnerNftListId: this.partnerNftListId,
  //     rpsPackageId: this.rpsPackageId,
  //   });
  // getRockPaperScissorsResult = (input: RPSResultInput) =>
  //   getRockPaperScissorsResult({
  //     ...input,
  //     rpsCorePackageId: this.rpsCorePackageId,
  //     suiClient: this.suiClient,
  //   });
}
