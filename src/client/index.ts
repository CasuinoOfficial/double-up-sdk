import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { KioskClient, Network } from "@mysten/kiosk";
import {
  COIN_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  ROULETTE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  UFORANGE_PACKAGE_ID,
  BLACKJACK_PACKAGE_ID,
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
  removeRouletteBet,
  startRoulette,
  CreatedRouletteTableInput,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteStartInput,
  RouletteTableInput,
  RouletteTableExistsInput,
  RouletteSettleOrContinueInput,
  rouletteSettleOrContinue
} from "../games/roulette";

import {
  createRockPaperScissors,
  RPSInput,
} from "../games/rps";

import {
  BlackjackInput,
  createBlackjackGame,
} from "../games/blackjack";

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
  blackjackPackageId?: string;
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
    roulettePackageId = ROULETTE_PACKAGE_ID,
    rpsPackageId = RPS_PACKAGE_ID,
    blackjackPackageId = BLACKJACK_PACKAGE_ID,
    suiClient = new SuiClient({ url: getFullnodeUrl("testnet") }),
  }: DoubleUpClientInput) {
    this.coinflipPackageId = coinflipPackageId;
    this.limboPackageId = limboPackageId;
    this.origin = origin;
    this.partnerNftListId = partnerNftListId;
    this.plinkoPackageId = plinkoPackageId;
    this.ufoRangePackageId = ufoRangePackageId;
    this.roulettePackageId = roulettePackageId;
    this.rpsPackageId = rpsPackageId;
    this.blackjackPackageId = blackjackPackageId;
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

  blackjackPackageId: string;

  suiClient: SuiClient;
  kioskClient: KioskClient;

  // coinflip
  createCoinflip = (input: CoinflipInput) =>
    createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });

  // lottery
  buyLotteryTickets = buyLotteryTickets;
  redeemLotteryTickets = redeemLotteryTickets;
  getLottery = () => getLottery({ suiClient: this.suiClient });
  getLotteryHistory = () => getLotteryHistory({ suiClient: this.suiClient });
  getLotteryDrawingResult = (input: DrawingResultInput) =>
    getLotteryDrawingResult({
      ...input,
      suiClient: this.suiClient,
    });
  getLotteryTickets = (input: LotteryTicketsInput) =>
    getLotteryTickets({
      ...input,
      suiClient: this.suiClient,
    });

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

  // roulette
  addRouletteBet = (input: RouletteAddBetInput) =>
    addRouletteBet({
      ...input,
      origin: this.origin,
      roulettePackageId: this.roulettePackageId,
    });
  createRouletteTable = (input: RouletteTableInput) =>
    createRouletteTable({
      ...input,
      roulettePackageId: this.roulettePackageId,
    });
  doesRouletteTableExist = (input: RouletteTableExistsInput) =>
    doesRouletteTableExist({
      ...input,
      roulettePackageId: this.roulettePackageId,
      suiClient: this.suiClient,
    });
  getCreatedRouletteTable = (input: CreatedRouletteTableInput) =>
    getCreatedRouletteTable({
      ...input,
      roulettePackageId: this.roulettePackageId,
    });
  removeRouletteBet = (input: RouletteRemoveBetInput) =>
    removeRouletteBet({
      ...input,
      origin: this.origin,
      roulettePackageId: this.roulettePackageId,
    });
  startRoulette = (input: RouletteStartInput) =>
    startRoulette({
      ...input,
      roulettePackageId: this.roulettePackageId,
    });
  rouletteSettleOrContinue = (input: RouletteSettleOrContinueInput) => 
    rouletteSettleOrContinue({
      ...input,
      roulettePackageId: this.roulettePackageId,
      origin: this.origin
    });

  // // rps
  createRockPaperScissors = (input: RPSInput) =>
    createRockPaperScissors({
      ...input,
      partnerNftListId: this.partnerNftListId,
      rpsPackageId: this.rpsPackageId,
    });

    // blackjack
  createBlackjackGame = (input: BlackjackInput) => 
    createBlackjackGame({
      ...input,
      blackjackPackageId: this.blackjackPackageId,
    });
}
