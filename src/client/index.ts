import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { KioskClient, Network } from "@mysten/kiosk";
import {
  COIN_CORE_PACKAGE_ID,
  COIN_PACKAGE_ID,
  CRAPS_CORE_PACKAGE_ID,
  CRAPS_PACKAGE_ID,
  LIMBO_CORE_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_CORE_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  ROULETTE_CORE_PACKAGE_ID,
  ROULETTE_PACKAGE_ID,
  RPS_CORE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  UFORANGE_CORE_PACKAGE_ID,
  UFORANGE_PACKAGE_ID,
  BLACKJACK_CORE_PACKAGE_ID,
  BLACKJACK_PACKAGE_ID,
} from "../constants/mainnetConstants";

import { createCoinflip, CoinflipInput } from "../games/coinflip";

import { createLimbo, LimboInput } from "../games/limbo";

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

import { createRange, RangeInput } from "../games/ufoRange";

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
  getRouletteTable,
} from "../games/roulette";

import { createRockPaperScissors, RPSInput } from "../games/rps";

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
  startCraps,
} from "../games/craps";

import {
  createBlackjackGame,
  BlackjackInput,
  getBlackjackTable,
  GetBlackjackTableInput,
  blackjackPlayerMove,
  BlackjackPlayerMoveInput,
} from "../games/blackjack";

interface DoubleUpClientInput {
  coinflipCorePackageId?: string;
  coinflipPackageId?: string;
  diceCorePackageId?: string;
  dicePackageId?: string;
  limboCorePackageId?: string;
  limboPackageId?: string;
  origin?: string;
  partnerNftListId?: string;
  plinkoCorePackageId?: string;
  plinkoPackageId?: string;
  ufoRangeCorePackageId?: string;
  ufoRangePackageId?: string;
  rouletteCorePackageId?: string;
  roulettePackageId?: string;
  rpsCorePackageId?: string;
  rpsPackageId?: string;
  crapsCorePackageId?: string;
  crapsPackageId?: string;
  blackjackCorePackageId?: string;
  blackjackPackageId?: string;
  suiClient?: SuiClient;
  kioskClient?: KioskClient;
}

export class DoubleUpClient {
  constructor({
    coinflipCorePackageId = COIN_CORE_PACKAGE_ID,
    coinflipPackageId = COIN_PACKAGE_ID,
    limboCorePackageId = LIMBO_CORE_PACKAGE_ID,
    limboPackageId = LIMBO_PACKAGE_ID,
    origin = "DoubleUp",
    partnerNftListId,
    plinkoCorePackageId = PLINKO_CORE_PACKAGE_ID,
    plinkoPackageId = PLINKO_PACKAGE_ID,
    ufoRangeCorePackageId = UFORANGE_CORE_PACKAGE_ID,
    ufoRangePackageId = UFORANGE_PACKAGE_ID,
    rouletteCorePackageId = ROULETTE_CORE_PACKAGE_ID,
    roulettePackageId = ROULETTE_PACKAGE_ID,
    rpsCorePackageId = RPS_CORE_PACKAGE_ID,
    rpsPackageId = RPS_PACKAGE_ID,
    crapsCorePackageId = CRAPS_CORE_PACKAGE_ID,
    crapsPackageId = CRAPS_PACKAGE_ID,
    blackjackCorePackageId = BLACKJACK_CORE_PACKAGE_ID,
    blackjackPackageId = BLACKJACK_PACKAGE_ID,
    suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") }),
  }: DoubleUpClientInput) {
    this.coinflipCorePackageId = coinflipCorePackageId;
    this.coinflipPackageId = coinflipPackageId;
    this.limboCorePackageId = limboCorePackageId;
    this.limboPackageId = limboPackageId;
    this.origin = origin;
    this.partnerNftListId = partnerNftListId;
    this.plinkoCorePackageId = plinkoCorePackageId;
    this.plinkoPackageId = plinkoPackageId;
    this.ufoRangeCorePackageId = ufoRangeCorePackageId;
    this.ufoRangePackageId = ufoRangePackageId;
    this.rouletteCorePackageId = rouletteCorePackageId;
    this.roulettePackageId = roulettePackageId;
    this.crapsCorePackageId = crapsCorePackageId;
    this.crapsPackageId = crapsPackageId;
    this.rpsCorePackageId = rpsCorePackageId;
    this.rpsPackageId = rpsPackageId;
    this.blackjackCorePackageId = blackjackCorePackageId;
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
  coinflipCorePackageId: string;
  coinflipPackageId: string;
  diceCorePackageId: string;
  dicePackageId: string;
  limboCorePackageId: string;
  limboPackageId: string;
  plinkoCorePackageId: string;
  plinkoPackageId: string;
  ufoRangeCorePackageId: string;
  ufoRangePackageId: string;
  rouletteCorePackageId: string;
  roulettePackageId: string;
  rpsCorePackageId: string;
  rpsPackageId: string;
  crapsCorePackageId: string;
  crapsPackageId: string;
  blackjackCorePackageId: string;
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
      plinkoCorePackageId: this.plinkoCorePackageId,
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
      plinkoCorePackageId: this.plinkoCorePackageId,
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
      ufoRangePackageId: this.ufoRangePackageId,
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
      rouletteCorePackageId: this.rouletteCorePackageId,
    });
  getRouletteTable = (input: GetRouletteTableInput) =>
    getRouletteTable({
      ...input,
      rouletteCorePackageId: this.rouletteCorePackageId,
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
      origin: this.origin,
    });

  // Craps
  createCrapsTable = (input: CrapsTableInput) =>
    createCrapsTable({
      ...input,
      crapsCorePackageId: this.crapsCorePackageId,
    });
  getCrapsTable = (input: GetCrapsTableInput) =>
    getCrapsTable({
      ...input,
      crapsCorePackageId: this.crapsCorePackageId,
      suiClient: this.suiClient,
    });
  addCrapsBet = (input: CrapsAddBetInput) =>
    addCrapsBet({
      ...input,
      crapsPackageId: this.crapsPackageId,
      origin: this.origin,
    });
  removeCrapsBet = (input: CrapsRemoveBetInput) =>
    removeCrapsBet({
      ...input,
      crapsPackageId: this.crapsPackageId,
    });
  startCraps = (input: CrapsStartInput) =>
    startCraps({
      ...input,
      crapsPackageId: this.crapsPackageId,
    });
  crapsSettleOrContinue = (input: CrapsSettleOrContinueInput) =>
    crapsSettleOrContinue({
      ...input,
      crapsPackageId: this.crapsPackageId,
      origin: this.origin,
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
      blackjackCorePackageId: this.blackjackCorePackageId,
      origin: this.origin,
    });
  getBlackjackTable = (input: GetBlackjackTableInput) =>
    getBlackjackTable({
      ...input,
      blackjackCorePackageId: this.blackjackCorePackageId,
      suiClient: this.suiClient,
    });
  blackjackPlayerMove = (input: BlackjackPlayerMoveInput) =>
    blackjackPlayerMove({
      ...input,
      blackjackPackageId: this.blackjackPackageId,
    });
}
