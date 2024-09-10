import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { KioskClient, Network } from "@mysten/kiosk";
import {
  COIN_PACKAGE_ID,
  CRAPS_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  ROULETTE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  UFORANGE_PACKAGE_ID,
  BLACKJACK_PACKAGE_ID,
} from "../constants/mainnetConstants";

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
  createPlinkoTable,
  getPlinkoTable,
  addPlinkoBet,
  removePlinkoBet,
  startMultiPlinko,
  PlinkoInput,
  PlinkoTableInput,
  PlinkoAddBetInput,
  GetPlinkoTableInput,
  PlinkoRemoveBetInput,
  StartMultiPlinkoInput,
} from "../games/plinko";

import {
  createRange,
  RangeInput,
} from "../games/ufoRange";

import {
  addRouletteBet,
  createRouletteTable,
  removeRouletteBet,
  startRoulette,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteStartInput,
  RouletteTableInput,
  RouletteSettleOrContinueInput,
  rouletteSettleOrContinue,
  GetRouletteTableInput,
  getRouletteTable
} from "../games/roulette";

import {
  createRockPaperScissors,
  RPSInput,
} from "../games/rps";

import { 
  addCrapsBet, 
  CrapsAddBetInput, 
  CrapsRemoveBetInput, 
  crapsSettleOrContinue, 
  CrapsSettleOrContinueInput, 
  CrapsStartInput, 
  CrapsTableInput, 
  createCrapsTable, 
  getCrapsTable, 
  GetCrapsTableInput, 
  removeCrapsBet, 
  startCraps } from "../games/craps";

import {
  createBlackjackGame,
  BlackjackInput,
  getBlackjackTable,
  GetBlackjackTableInput,
  blackjackPlayerMove,
  BlackjackPlayerMoveInput,
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
  crapsPackageId?: string;
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
    crapsPackageId = CRAPS_PACKAGE_ID,
    blackjackPackageId = BLACKJACK_PACKAGE_ID,
    suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") }),
  }: DoubleUpClientInput) {
    this.coinflipPackageId = coinflipPackageId;
    this.limboPackageId = limboPackageId;
    this.origin = origin;
    this.partnerNftListId = partnerNftListId;
    this.plinkoPackageId = plinkoPackageId;
    this.ufoRangePackageId = ufoRangePackageId;
    this.roulettePackageId = roulettePackageId;
    this.crapsPackageId = crapsPackageId;
    this.rpsPackageId = rpsPackageId;
    this.blackjackPackageId = blackjackPackageId;
    this.suiClient = suiClient;
    this.kioskClient = new KioskClient({
      client: suiClient,
      network: Network.MAINNET,
    });
  }

  partnerNftListId: string | undefined;
  origin: string;

  // Game Package Ids
  coinflipPackageId: string;
  dicePackageId: string;
  limboPackageId: string;
  plinkoPackageId: string;
  ufoRangePackageId: string;
  roulettePackageId: string;
  rpsPackageId: string;
  crapsPackageId: string;
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

  // plinko
  createSinglePlinko = (input: PlinkoInput) =>
    createSinglePlinko({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
    });
  createPlinkoTable = (input: PlinkoTableInput) =>
    createPlinkoTable({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
    });
  addPlinkoBet = (input: PlinkoAddBetInput) =>
    addPlinkoBet({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      origin: this.origin,
    });
  getPlinkoTable = (input: GetPlinkoTableInput) =>
    getPlinkoTable({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      suiClient: this.suiClient,
    });
  removePlinkoBet = (input: PlinkoRemoveBetInput) =>
    removePlinkoBet({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
    });
  startMultiPlinko = (input: StartMultiPlinkoInput) =>
    startMultiPlinko({
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
  getRouletteTable = (input: GetRouletteTableInput) =>
    getRouletteTable({
      ...input,
      roulettePackageId: this.roulettePackageId,
      suiClient: this.suiClient,
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

  // Craps
  createCrapsTable = (input: CrapsTableInput) => 
    createCrapsTable({
      ...input,
      crapsPackageId: this.crapsPackageId,
    });
  getCrapsTable = (input: GetCrapsTableInput) =>
    getCrapsTable({
      ...input,
      crapsPackageId: this.crapsPackageId,
      suiClient: this.suiClient,
    });
  addCrapsBet = (input: CrapsAddBetInput) => 
    addCrapsBet({
      ...input,
      crapsPackageId: this.crapsPackageId,
      origin: this.origin
    });
  removeCrapsBet = (input: CrapsRemoveBetInput) =>
    removeCrapsBet({
      ...input,
      crapsPackageId: this.crapsPackageId,
    });
  startCraps = (input: CrapsStartInput) => 
    startCraps({
      ...input,
      crapsPackageId: this.crapsPackageId
    });
  crapsSettleOrContinue = (input: CrapsSettleOrContinueInput) => 
    crapsSettleOrContinue({
      ...input,
      crapsPackageId: this.crapsPackageId,
      origin: this.origin
    });

  // rps
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
      origin: this.origin,
    });
  getBlackjackTable = (input: GetBlackjackTableInput) =>
    getBlackjackTable({
      ...input,
      blackjackPackageId: this.blackjackPackageId,
      suiClient: this.suiClient,
    });
  blackjackPlayerMove = (input: BlackjackPlayerMoveInput) =>
    blackjackPlayerMove({
      ...input,
      blackjackPackageId: this.blackjackPackageId,
    });
}
