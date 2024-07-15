import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

import {
  COIN_CORE_PACKAGE_ID,
  COIN_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  LIMBO_CORE_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  PLINKO_CORE_PACKAGE_ID,
  PLINKO_VERIFIER_ID,
  ROULETTE_PACKAGE_ID,
  ROULETTE_CORE_PACKAGE_ID,
  RPS_CORE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  RANGE_DICE_PACKAGE_ID,
  RANGE_DICE_CORE_PACKAGE_ID,
} from "../constants";

import {
  createCoinflip,
  getCoinflipResult,
  CoinflipInput,
  CoinflipResultInput,
} from "../games/coinflip";

import {
  createLimbo,
  getLimboResult,
  LimboInput,
  LimboResultInput,
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
  createPlinko,
  getPlinkoResult,
  PlinkoInput,
  PlinkoResultInput,
} from "../games/plinko";

import {
  createRangeDice,
  getRangeDiceResult,
  RangeDiceInput,
  RangeDiceResultInput,
} from "../games/rangeDice";

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
  getRockPaperScissorsResult,
  RPSInput,
  RPSResultInput,
} from "../games/rps";

interface DoubleUpClientInput {
  coinflipPackageId?: string;
  coinflipCorePackageId?: string;
  dicePackageId?: string;
  diceCorePackageId?: string;
  limboPackageId?: string;
  limboCorePackageId?: string;
  origin?: string;
  partnerNftListId?: string;
  plinkoPackageId?: string;
  plinkoCorePackageId?: string;
  plinkoVerifierId?: string;
  rangeDicePackageId?: string;
  rangeDiceCorePackageId?: string;
  roulettePackageId?: string;
  rouletteCorePackageId?: string;
  rpsPackageId?: string;
  rpsCorePackageId?: string;
  suiClient?: SuiClient;
}

export class DoubleUpClient {
  constructor({
    coinflipPackageId = COIN_PACKAGE_ID,
    coinflipCorePackageId = COIN_CORE_PACKAGE_ID,
    limboPackageId = LIMBO_PACKAGE_ID,
    limboCorePackageId = LIMBO_CORE_PACKAGE_ID,
    origin = "",
    partnerNftListId,
    plinkoPackageId = PLINKO_PACKAGE_ID,
    plinkoCorePackageId = PLINKO_CORE_PACKAGE_ID,
    plinkoVerifierId = PLINKO_VERIFIER_ID,
    rangeDicePackageId = RANGE_DICE_PACKAGE_ID,
    rangeDiceCorePackageId = RANGE_DICE_CORE_PACKAGE_ID,
    roulettePackageId = ROULETTE_PACKAGE_ID,
    rouletteCorePackageId = ROULETTE_CORE_PACKAGE_ID,
    rpsPackageId = RPS_PACKAGE_ID,
    rpsCorePackageId = RPS_CORE_PACKAGE_ID,
    suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") }),
  }: DoubleUpClientInput) {
    this.coinflipPackageId = coinflipPackageId;
    this.coinflipCorePackageId = coinflipCorePackageId;

    this.limboPackageId = limboPackageId;
    this.limboCorePackageId = limboCorePackageId;

    this.origin = origin;

    this.partnerNftListId = partnerNftListId;

    this.plinkoPackageId = plinkoPackageId;
    this.plinkoCorePackageId = plinkoCorePackageId;
    this.plinkoVerifierId = plinkoVerifierId;

    this.rangeDicePackageId = rangeDicePackageId;
    this.rangeDiceCorePackageId = rangeDiceCorePackageId;

    this.roulettePackageId = roulettePackageId;
    this.rouletteCorePackageId = rouletteCorePackageId;

    this.rpsPackageId = rpsPackageId;
    this.rpsCorePackageId = rpsCorePackageId;

    this.suiClient = suiClient;
  }

  coinflipPackageId: string;
  coinflipCorePackageId: string;

  dicePackageId: string;
  diceCorePackageId: string;

  limboPackageId: string;
  limboCorePackageId: string;

  origin: string;

  partnerNftListId: string | undefined;

  plinkoPackageId: string;
  plinkoCorePackageId: string;
  plinkoVerifierId: string;

  rangeDicePackageId: string;
  rangeDiceCorePackageId: string;

  roulettePackageId: string;
  rouletteCorePackageId: string;

  rpsPackageId: string;
  rpsCorePackageId: string;

  suiClient: SuiClient;

  // coinflip
  createCoinflip = (input: CoinflipInput) =>
    createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });
  getCoinflipResult = (input: CoinflipResultInput) =>
    getCoinflipResult({
      ...input,
      coinflipCorePackageId: this.coinflipCorePackageId,
      suiClient: this.suiClient,
    });

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
  getLimboResult = (input: LimboResultInput) =>
    getLimboResult({
      ...input,
      limboCorePackageId: this.limboCorePackageId,
      suiClient: this.suiClient,
    });

  // plinko
  createPlinko = (input: PlinkoInput) =>
    createPlinko({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      plinkoVerifierId: this.plinkoVerifierId,
    });
  getPlinkoResult = (input: PlinkoResultInput) =>
    getPlinkoResult({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      plinkoCorePackageId: this.plinkoCorePackageId,
      suiClient: this.suiClient,
    });

  // range dice
  createRangeDice = (input: RangeDiceInput) =>
    createRangeDice({
      ...input,
      partnerNftListId: this.partnerNftListId,
      rangeDicePackageId: this.rangeDicePackageId,
    });
  getRangeDiceResult = (input: RangeDiceResultInput) =>
    getRangeDiceResult({
      ...input,
      rangeDiceCorePackageId: this.rangeDiceCorePackageId,
      suiClient: this.suiClient,
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
      rouletteCorePackageId: this.rouletteCorePackageId,
      suiClient: this.suiClient,
    });
  getCreatedRouletteTable = (input: CreatedRouletteTableInput) =>
    getCreatedRouletteTable({
      ...input,
      roulettePackageId: this.roulettePackageId,
    });
  getRouletteResult = (input: RouletteResultInput) =>
    getRouletteResult({
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

  // rps
  createRockPaperScissors = (input: RPSInput) =>
    createRockPaperScissors({
      ...input,
      partnerNftListId: this.partnerNftListId,
      rpsPackageId: this.rpsPackageId,
    });
  getRockPaperScissorsResult = (input: RPSResultInput) =>
    getRockPaperScissorsResult({
      ...input,
      rpsCorePackageId: this.rpsCorePackageId,
      suiClient: this.suiClient,
    });
}
