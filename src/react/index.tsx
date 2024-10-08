import { SuiClient } from "@mysten/sui/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import { CoinflipInput, CoinflipVoucherInput } from "../games/coinflip";
import { LimboInput, LimboVoucherInput } from "../games/limbo";
import { RangeInput, RangeVoucherInput } from "../games/ufoRange";
import { RPSInput, RPSVoucherInput } from "../games/rps";
import {
  BuyTicketsInput,
  BuyTicketsResponse,
  DrawingResultInput,
  DrawingResultResponse,
  LotteryResponse,
  LotteryHistoryResponse,
  LotteryTicketsInput,
  LotteryTicketsResponse,
  RedeemTicketsInput,
  RedeemTicketsResponse,
} from "../games/lottery";
import {
  GetPlinkoTableInput,
  GetPlinkoTableResponse,
  PlinkoAddBetInput,
  PlinkoAddBetResponse,
  PlinkoInput,
  PlinkoRemoveBetInput,
  PlinkoRemoveBetResponse,
  PlinkoTableInput,
  PlinkoVoucherInput,
  StartMultiPlinkoInput,
} from "../games/plinko";
import {
  GetRouletteTableInput,
  RouletteContractData,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteRemoveBetResponse,
  RouletteSettleOrContinueInput,
  RouletteStartInput,
  RouletteTableInput,
} from "../games/roulette";
import {
  CrapsAddBetInput,
  CrapsContractData,
  CrapsRemoveBetInput,
  CrapsRemoveBetResponse,
  CrapsSettleOrContinueInput,
  CrapsStartInput,
  CrapsTableInput,
  GetCrapsTableInput,
} from "../games/craps";
import {
  BlackjackInput,
  BlackjackPlayerMoveInput,
  BlackjackPlayerMoveVoucherInput,
  BlackjackPlayerProcessMove,
  BlackjackVoucherInput,
  GetBlackjackTableInput,
  GetBlackjackTableResponse,
} from "../games/blackjack";
import {
  depositUnihouse,
  requestWithdrawUnihouse,
  getUnihouseData,
  getRedeemRequests,
  DepositUnihouseInput,
  WithdrawUnihouseInput,
  BalanceList,
  getGTokenBalance,
} from "../games/unihouse";

interface DoubleUpContextState {
  addRouletteBet: (input: RouletteAddBetInput) => void;
  buyLotteryTickets: (input: BuyTicketsInput) => BuyTicketsResponse;
  createCoinflip: (input: CoinflipInput) => void;
  createCoinflipWithVoucher: (input: CoinflipVoucherInput) => void;
  createLimbo: (input: LimboInput) => void;
  createLimboWithVoucher: (input: LimboVoucherInput) => void;
  createSinglePlinko: (input: PlinkoInput) => void;
  createSinglePlinkoWithVoucher: (input: PlinkoVoucherInput) => void;
  createPlinkoTable: (input: PlinkoTableInput) => void;
  addPlinkoBet: (input: PlinkoAddBetInput) => PlinkoAddBetResponse;
  getPlinkoTable: (
    input: GetPlinkoTableInput
  ) => Promise<GetPlinkoTableResponse>;
  removePlinkoBet: (input: PlinkoRemoveBetInput) => PlinkoRemoveBetResponse;
  startMultiPlinko: (input: StartMultiPlinkoInput) => void;
  createRange: (input: RangeInput) => void;
  createRangeWithVoucher: (input: RangeVoucherInput) => void;
  createRockPaperScissors: (input: RPSInput) => void;
  createRockPaperScissorsWithVoucher: (input: RPSVoucherInput) => void;
  createRouletteTable: (input: RouletteTableInput) => void;
  getRouletteTable: (
    input: GetRouletteTableInput
  ) => Promise<RouletteContractData | null>;
  rouletteSettleOrContinue: (input: RouletteSettleOrContinueInput) => void;
  getLottery: () => Promise<LotteryResponse>;
  getLotteryDrawingResult: (
    input: DrawingResultInput
  ) => Promise<DrawingResultResponse>;
  getLotteryHistory: () => Promise<LotteryHistoryResponse>;
  getLotteryTickets: (
    input: LotteryTicketsInput
  ) => Promise<LotteryTicketsResponse>;
  redeemLotteryTickets: (input: RedeemTicketsInput) => RedeemTicketsResponse;
  removeRouletteBet: (
    input: RouletteRemoveBetInput
  ) => RouletteRemoveBetResponse;
  startRoulette: (input: RouletteStartInput) => void;
  createCrapsTable: (input: CrapsTableInput) => void;
  getCrapsTable: (
    input: GetCrapsTableInput
  ) => Promise<CrapsContractData | null>;
  addCrapsBet: (input: CrapsAddBetInput) => void;
  removeCrapsBet: (input: CrapsRemoveBetInput) => CrapsRemoveBetResponse;
  startCraps: (input: CrapsStartInput) => void;
  crapsSettleOrContinue: (input: CrapsSettleOrContinueInput) => void;
  createBlackjackGame: (input: BlackjackInput) => void;
  createBlackjackGameWithVoucher: (input: BlackjackVoucherInput) => void;
  getBlackjackTable: (
    input: GetBlackjackTableInput
  ) => Promise<GetBlackjackTableResponse>;
  blackjackPlayerMove: (input: BlackjackPlayerMoveInput) => void;
  blackjackPlayerMoveWithVoucher: (
    input: BlackjackPlayerMoveVoucherInput
  ) => void;
  depositUnihouse: (input: DepositUnihouseInput) => void;
  requestWithdrawUnihouse: (input: WithdrawUnihouseInput) => void;
  getUnihouseData: (suiClient: SuiClient) => void;
  getRedeemRequests: (suiClient: SuiClient, address?: string) => void;
  getGTokenBalance: (
    suiClient: SuiClient,
    address?: string
  ) => Promise<BalanceList>;
  blackjackPlayerProcessMove: (input: BlackjackPlayerProcessMove) => void;
}

interface DoubleupProviderProps {
  children: ReactNode;
  coinflipPackageId?: string;
  diceCorePackageId?: string;
  limboPackageId?: string;
  origin?: string;
  partnerNftListId?: string;
  plinkoPackageId?: string;
  ufoRangePackageId?: string;
  roulettePackageId?: string;
  rpsPackageId?: string;
  blackjackPackageId?: string;
  suiClient?: SuiClient;
}

const DoubleUpContext = createContext<DoubleUpContextState>();

const DoubleUpProvider = ({
  children,
  coinflipPackageId,
  limboPackageId,
  origin,
  partnerNftListId,
  plinkoPackageId,
  roulettePackageId,
  rpsPackageId,
  ufoRangePackageId,
  blackjackPackageId,
  suiClient,
}: DoubleupProviderProps): ReactElement => {
  const dbClient = new DoubleUpClient({
    coinflipPackageId,
    limboPackageId,
    origin,
    partnerNftListId,
    plinkoPackageId,
    ufoRangePackageId,
    roulettePackageId,
    rpsPackageId,
    blackjackPackageId,
    suiClient,
  });

  const addRouletteBet = dbClient.addRouletteBet;
  const buyLotteryTickets = dbClient.buyLotteryTickets;
  const createCoinflip = dbClient.createCoinflip;
  const createCoinflipWithVoucher = dbClient.createCoinflipWithVoucher;
  const createLimbo = dbClient.createLimbo;
  const createLimboWithVoucher = dbClient.createLimboWithVoucher;
  const createSinglePlinko = dbClient.createSinglePlinko;
  const createSinglePlinkoWithVoucher = dbClient.createSinglePlinkoWithVoucher;
  const createPlinkoTable = dbClient.createPlinkoTable;
  const addPlinkoBet = dbClient.addPlinkoBet;
  const getPlinkoTable = dbClient.getPlinkoTable;
  const removePlinkoBet = dbClient.removePlinkoBet;
  const startMultiPlinko = dbClient.startMultiPlinko;
  const createRange = dbClient.createRange;
  const createRangeWithVoucher = dbClient.createRangeWithVoucher;
  const createRockPaperScissors = dbClient.createRockPaperScissors;
  const createRockPaperScissorsWithVoucher =
    dbClient.createRockPaperScissorsWithVoucher;
  const createRouletteTable = dbClient.createRouletteTable;
  const rouletteSettleOrContinue = dbClient.rouletteSettleOrContinue;
  const getRouletteTable = dbClient.getRouletteTable;
  const getLottery = dbClient.getLottery;
  const getLotteryDrawingResult = dbClient.getLotteryDrawingResult;
  const getLotteryHistory = dbClient.getLotteryHistory;
  const getLotteryTickets = dbClient.getLotteryTickets;
  const redeemLotteryTickets = dbClient.redeemLotteryTickets;
  const removeRouletteBet = dbClient.removeRouletteBet;
  const startRoulette = dbClient.startRoulette;
  const createCrapsTable = dbClient.createCrapsTable;
  const getCrapsTable = dbClient.getCrapsTable;
  const addCrapsBet = dbClient.addCrapsBet;
  const removeCrapsBet = dbClient.removeCrapsBet;
  const startCraps = dbClient.startCraps;
  const crapsSettleOrContinue = dbClient.crapsSettleOrContinue;
  const createBlackjackGame = dbClient.createBlackjackGame;
  // const createBlackjackGameWithVoucher =
  //   dbClient.createBlackjackGameWithVoucher;
  const getBlackjackTable = dbClient.getBlackjackTable;
  const blackjackPlayerMove = dbClient.blackjackPlayerMove;
  // const blackjackPlayerMoveWithVoucher =
  //   dbClient.blackjackPlayerMoveWithVoucher;
  const blackjackPlayerProcessMove = dbClient.blackjackPlayerProcessMove;

  const state: DoubleUpContextState = {
    addRouletteBet,
    buyLotteryTickets,
    createCoinflip,
    createCoinflipWithVoucher,
    createLimbo,
    createLimboWithVoucher,
    createSinglePlinko,
    createSinglePlinkoWithVoucher,
    createPlinkoTable,
    addPlinkoBet,
    getPlinkoTable,
    removePlinkoBet,
    startMultiPlinko,
    createRange,
    createRangeWithVoucher,
    createRockPaperScissors,
    createRockPaperScissorsWithVoucher,
    createRouletteTable,
    getRouletteTable,
    rouletteSettleOrContinue,
    getLottery,
    getLotteryDrawingResult,
    getLotteryHistory,
    getLotteryTickets,
    redeemLotteryTickets,
    removeRouletteBet,
    startRoulette,
    createCrapsTable,
    getCrapsTable,
    addCrapsBet,
    removeCrapsBet,
    startCraps,
    crapsSettleOrContinue,
    createBlackjackGame,
    getBlackjackTable,
    blackjackPlayerMove,
    blackjackPlayerProcessMove,
    depositUnihouse,
    requestWithdrawUnihouse,
    getUnihouseData,
    getRedeemRequests,
    getGTokenBalance,
    createBlackjackGameWithVoucher: function (
      input: BlackjackVoucherInput
    ): void {
      throw new Error("Function not implemented.");
    },
    blackjackPlayerMoveWithVoucher: function (
      input: BlackjackPlayerMoveVoucherInput
    ): void {
      throw new Error("Function not implemented.");
    },
  };

  return (
    <DoubleUpContext.Provider value={state}>
      {children}
    </DoubleUpContext.Provider>
  );
};

const useDoubleUp = (): DoubleUpContextState => {
  const context = useContext<DoubleUpContextState>(DoubleUpContext);

  if (context === undefined) {
    throw new Error("useDoubleUp must be used in a DoubleupProvider");
  }

  return context;
};

export { DoubleUpProvider, useDoubleUp };
