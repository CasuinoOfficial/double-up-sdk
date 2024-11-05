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
  ALLOY_CORE_PACKAGE_ID,
  ALLOY_PACKAGE_ID,
  RAFFLES_CORE_PACKAGE_ID,
  RAFFLES_PACKAGE_ID,
  GACHAPON_PACKAGE_ID,
} from "../constants/mainnetConstants";

import {
  createCoinflip,
  createCoinflipWithVoucher,
  CoinflipInput,
  CoinflipVoucherInput,
} from "../games/coinflip";

import {
  createLimbo,
  createLimboWithVoucher,
  LimboInput,
  LimboVoucherInput,
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
  RedeemTicketsInput,
  BuyTicketsInput,
  BuyTicketsOnBehalfInput,
  buyLotteryTicketsOnBehalf,
} from "../games/lottery";

import {
  createSinglePlinko,
  createSinglePlinkoWithVoucher,
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
  PlinkoVoucherInput,
} from "../games/plinko";

import {
  createRange,
  createRangeWithVoucher,
  RangeInput,
  RangeVoucherInput,
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
  getRouletteTable,
} from "../games/roulette";

import {
  createRockPaperScissors,
  createRockPaperScissorsWithVoucher,
  RPSInput,
  RPSVoucherInput,
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
  startCraps,
} from "../games/craps";

import {
  createBlackjackGame,
  BlackjackInput,
  createBlackjackTable,
  getBlackjackTable,
  GetBlackjackTableInput,
  blackjackPlayerMove,
  blackjackPlayerProcessMove,
  BlackjackPlayerMoveInput,
  BlackjackPlayerProcessMove,
  BlackjackTableInput,
} from "../games/blackjack";

import {
  depositUnihouse,
  DepositUnihouseInput,
  requestWithdrawUnihouse,
  WithdrawUnihouseInput,
  getUnihouseData,
  getRedeemRequests,
  getGTokenBalance,
  getMaxBet,
} from "../games/unihouse";

import {
  getCurves,
  GetCurvesInput,
  swapAsset,
  SwapAssetInput,
} from "../games/pump";

import {
  createMarketplace,
  createMarket,
  createMarketInstance,
  placeMarketGuess,
  setAIPrediction,
  marketSettleOrContinue,
  releaseUnsettledMarket,
  depositMarketBalance,
  withdrawMarketBalance,
  MarketplaceInput,
  MarketInput,
  MarketInstanceInput,
  PlaceMarketGuessInput,
  SetAIPredictionInput,
  MarketSettleOrContinueInput,
  ReleaseUnsettledMarketInput,
  DepositMarketBalanceInput,
  WithdrawMarketBalanceInput,
} from "../games/alloy";
import {
  buyRaffleTickets,
  BuyRaffleTicketsInput,
  buyRaffleTicketsWithDeal,
  BuyRaffleTicketsWithDealInput,
  buyRaffleTicketsWithTreats,
  BuyRaffleTicketsWithTreatsInput,
  getRaffle,
  GetRaffleInput,
  getTotalTicketsForUser,
  GetTotalTicketsForUserInput,
} from "../games/raffles";

import {
  addEgg,
  AddEgg,
  createGachapon,
  CreateGachaponInput,
  getGachapons,
  adminGetGachapons,
  adminGetEggs,
  CloseGachapon,
  closeGachapon,
  AddEmptyEgg,
  addEmptyEgg,
  removeEgg,
  RemoveEgg,
  ClaimGachaponTreasury,
  claimGachaponTreasury,
  UpdateCost,
  updateCost,
  AddSupplier,
  addSupplier,
  RemoveSupplier,
  removeSupplier,
  DrawEgg,
  drawEgg,
  destroyEgg,
  DestroyEgg,
  ClaimEgg,
  claimEgg,
  CreateFreeSpinner,
  createFreeSpinner,
  DrawFreeSpin,
  drawFreeSpin,
  NftType,
  addNftType,
  removeNftType,
  addCoinToEgg,
  AddCoinToEgg,
  removeMultipleEggs,
  RemoveMultipleEggs,
} from "../games/gachapon";
import { LOTTERY_CORE_PACKAGE_ID, LOTTERY_PACKAGE_ID } from "../constants/testnetConstants";

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
  alloyCorePackageId?: string;
  alloyPackageId?: string;
  rafflesCorePackageId?: string;
  rafflesPackageId?: string;
  gachaponPackageId?: string;
  lotteryPackageId?: string;
  lotteryCorePackageId?: string;
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
    alloyCorePackageId = ALLOY_CORE_PACKAGE_ID,
    alloyPackageId = ALLOY_PACKAGE_ID,
    rafflesCorePackageId = RAFFLES_CORE_PACKAGE_ID,
    rafflesPackageId = RAFFLES_PACKAGE_ID,
    gachaponPackageId = GACHAPON_PACKAGE_ID,
    lotteryPackageId = LOTTERY_PACKAGE_ID,
    lotteryCorePackageId = LOTTERY_CORE_PACKAGE_ID,
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
    this.alloyCorePackageId = alloyCorePackageId;
    this.alloyPackageId = alloyPackageId;
    this.rafflesCorePackageId = rafflesCorePackageId;
    this.rafflesPackageId = rafflesPackageId;
    this.gachaponPackageId = gachaponPackageId;
    this.lotteryPackageId = lotteryPackageId;
    this.lotteryCorePackageId = lotteryCorePackageId;
    this.suiClient = suiClient;
    this.kioskClient = new KioskClient({
      client: suiClient,
      network: Network.TESTNET,
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
  alloyCorePackageId: string;
  alloyPackageId: string;
  rafflesCorePackageId: string;
  rafflesPackageId: string;
  gachaponPackageId: string;
  lotteryPackageId: string;
  lotteryCorePackageId: string;

  suiClient: SuiClient;
  kioskClient: KioskClient;

  // coinflip
  createCoinflip = (input: CoinflipInput) =>
    createCoinflip({
      ...input,
      coinflipPackageId: this.coinflipPackageId,
    });
  createCoinflipWithVoucher = (input: CoinflipVoucherInput) =>
    createCoinflipWithVoucher({
      ...input,
      coinflipPackageId: this.coinflipPackageId,
      client: this.suiClient,
    });

  // lottery
  buyLotteryTickets = (input: BuyTicketsInput) => 
    buyLotteryTickets({
      ...input,
      lotteryPackageId: this.lotteryPackageId,
    });
  buyLotteryTicketsOnBehalf = (input: BuyTicketsOnBehalfInput) => 
    buyLotteryTicketsOnBehalf({
      ...input,
      lotteryPackageId: this.lotteryPackageId,
    });
  redeemLotteryTickets = (input: RedeemTicketsInput) => 
    redeemLotteryTickets({
      ...input,
      lotteryPackageId: this.lotteryPackageId,
    });
  getLottery = () => getLottery({ suiClient: this.suiClient });
  getLotteryHistory = () => 
    getLotteryHistory({ 
      suiClient: this.suiClient,
      lotteryCorePackageId: this.lotteryCorePackageId, 
    });
  getLotteryDrawingResult = (input: DrawingResultInput) =>
    getLotteryDrawingResult({
      ...input,
      suiClient: this.suiClient,
      lotteryCorePackageId: this.lotteryCorePackageId,
    });
  getLotteryTickets = (input: LotteryTicketsInput) =>
    getLotteryTickets({
      ...input,
      suiClient: this.suiClient,
      lotteryCorePackageId: this.lotteryCorePackageId,
    });

  // limbo
  createLimbo = (input: LimboInput) =>
    createLimbo({
      ...input,
      limboPackageId: this.limboPackageId,
    });
  createLimboWithVoucher = (input: LimboVoucherInput) =>
    createLimboWithVoucher({
      ...input,
      limboPackageId: this.limboPackageId,
      client: this.suiClient,
    });

  // plinko
  createSinglePlinko = (input: PlinkoInput) =>
    createSinglePlinko({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
    });
  createSinglePlinkoWithVoucher = (input: PlinkoVoucherInput) =>
    createSinglePlinkoWithVoucher({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      client: this.suiClient,
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
  createRangeWithVoucher = (input: RangeVoucherInput) =>
    createRangeWithVoucher({
      ...input,
      ufoRangePackageId: this.ufoRangePackageId,
      client: this.suiClient,
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
  createRockPaperScissorsWithVoucher = (input: RPSVoucherInput) =>
    createRockPaperScissorsWithVoucher({
      ...input,
      rpsPackageId: this.rpsPackageId,
      client: this.suiClient,
    });

  // blackjack
  createBlackjackTable = (input: BlackjackTableInput) =>
    createBlackjackTable({
      ...input,
      blackjackCorePackageId: this.blackjackCorePackageId,
    });
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
  blackjackPlayerProcessMove = (input: BlackjackPlayerProcessMove) =>
    blackjackPlayerProcessMove({
      ...input,
    });

  // Alloy
  createMarketplace = (input: MarketplaceInput) =>
    createMarketplace({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  createMarket = (input: MarketInput) =>
    createMarket({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  createMarketInstance = (input: MarketInstanceInput) =>
    createMarketInstance({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  placeMarketGuess = (input: PlaceMarketGuessInput) =>
    placeMarketGuess({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  setAIPrediction = (input: SetAIPredictionInput) =>
    setAIPrediction({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  marketSettleOrContinue = (input: MarketSettleOrContinueInput) =>
    marketSettleOrContinue({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  releaseUnsettledMarket = (input: ReleaseUnsettledMarketInput) =>
    releaseUnsettledMarket({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  depositMarketBalance = (input: DepositMarketBalanceInput) =>
    depositMarketBalance({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });
  withdrawMarketBalance = (input: WithdrawMarketBalanceInput) =>
    withdrawMarketBalance({
      ...input,
      alloyPackageId: this.alloyPackageId,
    });

  // Raffles
  getRaffle = (input: GetRaffleInput) =>
    getRaffle({
      ...input,
      client: this.suiClient,
    });
  buyRaffleTickets = (input: BuyRaffleTicketsInput) =>
    buyRaffleTickets({
      ...input,
      rafflesPackageId: this.rafflesPackageId,
      origin: this.origin,
    });
  buyRaffleTicketsWithDeal = (input: BuyRaffleTicketsWithDealInput) =>
    buyRaffleTicketsWithDeal({
      ...input,
      rafflesPackageId: this.rafflesPackageId,
      origin: this.origin,
    });
  buyRaffleTicketsWithTreats = (input: BuyRaffleTicketsWithTreatsInput) =>
    buyRaffleTicketsWithTreats({
      ...input,
      rafflesPackageId: this.rafflesPackageId,
      origin: this.origin,
    });
  getRaffleTickets = (input: GetTotalTicketsForUserInput) =>
    getTotalTicketsForUser({
      ...input,
      rafflesPackageId: this.rafflesPackageId,
    });
  // Gachapon
  createGachapon = (input: CreateGachaponInput) =>
    createGachapon({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  closeGachapon = (input: CloseGachapon) =>
    closeGachapon({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  getGachapons = (address?: string) => getGachapons(this.suiClient, address);
  adminGetGachapons = (address?: string) =>
    adminGetGachapons(this.suiClient, address);
  adminGetEggs = (lootboxId: string) => adminGetEggs(this.suiClient, lootboxId);

  addEgg = (input: AddEgg) =>
    addEgg({
      ...input,
      suiClient: this.suiClient,
      kioskClient: this.kioskClient,
      gachaponPackageId: this.gachaponPackageId,
    });

  addCoinToEgg = (input: AddCoinToEgg) =>
    addCoinToEgg({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  removeEgg = (input: RemoveEgg) =>
    removeEgg({
      ...input,
      suiClient: this.suiClient,
      kioskClient: this.kioskClient,
      gachaponPackageId: this.gachaponPackageId,
    });

  removeMultipleEggs = (input: RemoveMultipleEggs) =>
    removeMultipleEggs({
      ...input,
      suiClient: this.suiClient,
      gachaponPackageId: this.gachaponPackageId,
    });

  addEmptyEgg = (input: AddEmptyEgg) =>
    addEmptyEgg({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  claimGachaponTreasury = (input: ClaimGachaponTreasury) =>
    claimGachaponTreasury({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  updateCost = (input: UpdateCost) =>
    updateCost({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  addSupplier = (input: AddSupplier) =>
    addSupplier({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  removeSupplier = (input: RemoveSupplier) =>
    removeSupplier({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  drawEgg = (input: DrawEgg) =>
    drawEgg({ ...input, gachaponPackageId: this.gachaponPackageId });

  destroyEgg = (input: DestroyEgg) =>
    destroyEgg({ ...input, gachaponPackageId: this.gachaponPackageId });

  claimEgg = (input: ClaimEgg) =>
    claimEgg({
      ...input,
      suiClient: this.suiClient,
      kioskClient: this.kioskClient,
      gachaponPackageId: this.gachaponPackageId,
    });

  createFreeSpinner = (input: CreateFreeSpinner) =>
    createFreeSpinner({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  addNftType = (input: NftType) =>
    addNftType({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  removeNftType = (input: NftType) =>
    removeNftType({
      ...input,
      gachaponPackageId: this.gachaponPackageId,
    });

  drawFreeSpin = (input: DrawFreeSpin) =>
    drawFreeSpin({
      ...input,
      suiClient: this.suiClient,
      kioskClient: this.kioskClient,
      gachaponPackageId: this.gachaponPackageId,
    });

  // Unihouse
  depositUnihouse = (input: DepositUnihouseInput) =>
    depositUnihouse({ ...input });
  requestWithdrawUnihouse = (input: WithdrawUnihouseInput) =>
    requestWithdrawUnihouse({ ...input });
  getUnihouseData = () => getUnihouseData(this.suiClient);
  getRedeemRequests = (address?: string) =>
    getRedeemRequests(this.suiClient, address);
  getGTokenBalance = (address: string) =>
    getGTokenBalance(this.suiClient, address);
  getMaxBet = (coinType) => getMaxBet(this.suiClient, coinType);

  // Pump
  getCurves = (input: GetCurvesInput) => getCurves({ ...input });
  swapAsset = (input: SwapAssetInput) => swapAsset({ ...input });
}
