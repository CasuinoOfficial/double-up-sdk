import { SuiClient } from "@mysten/sui/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import { CoinflipInput } from "../games/coinflip";
import { LimboInput } from "../games/limbo";
import { RangeInput } from "../games/ufoRange";
import { RPSInput } from "../games/rps";
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
  StartMultiPlinkoInput,
} from "../games/plinko";
import {
  GetRouletteTableInput,
  GetRouletteTableResponse,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteRemoveBetResponse,
  RouletteSettleOrContinueInput,
  RouletteStartInput,
  RouletteTableInput,
} from "../games/roulette";
import { 
  CrapsAddBetInput, 
  CrapsRemoveBetInput, 
  CrapsRemoveBetResponse, 
  CrapsSettleOrContinueInput, 
  CrapsStartInput, 
  CrapsTableInput, 
  GetCrapsTableInput 
} from "../games/craps";
import { 
  BlackjackDealerMoveInput, 
  BlackjackInput, 
  BlackjackPlayerMoveInput, 
  GetBlackjackTableInput, 
  GetBlackjackTableResponse 
} from "../games/blackjack";

interface DoubleUpContextState {
  addRouletteBet: (input: RouletteAddBetInput) => void;
  buyLotteryTickets: (input: BuyTicketsInput) => BuyTicketsResponse;
  createCoinflip: (input: CoinflipInput) => void;
  createLimbo: (input: LimboInput) => void;
  createSinglePlinko: (input: PlinkoInput) => void;
  createPlinkoTable: (input: PlinkoTableInput) => void;
  addPlinkoBet: (input: PlinkoAddBetInput) => PlinkoAddBetResponse;
  getPlinkoTable: (input: GetPlinkoTableInput) => Promise<GetPlinkoTableResponse>;
  removePlinkoBet: (input: PlinkoRemoveBetInput) => PlinkoRemoveBetResponse;
  startMultiPlinko: (input: StartMultiPlinkoInput) => void;
  createRange: (input: RangeInput) => void;
  createRockPaperScissors: (input: RPSInput) => void;
  createRouletteTable: (input: RouletteTableInput) => void;
  getRouletteTable: (input: GetRouletteTableInput) => Promise<GetRouletteTableResponse>;
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
  getCrapsTable: (input: GetCrapsTableInput) => void;
  addCrapsBet: (input: CrapsAddBetInput) => void;
  removeCrapsBet: (input: CrapsRemoveBetInput) => CrapsRemoveBetResponse;
  startCraps: (input: CrapsStartInput) => void;
  crapsSettleOrContinue: (input: CrapsSettleOrContinueInput) => void;
  createBlackjackGame: (input: BlackjackInput) => void;
  getBlackjackTable: (input: GetBlackjackTableInput) => Promise<GetBlackjackTableResponse>;
  blackjackDealerMove: (input: BlackjackDealerMoveInput) => void;
  blackjackPlayerMove: (input: BlackjackPlayerMoveInput) => void;
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
  const createLimbo = dbClient.createLimbo;
  const createSinglePlinko = dbClient.createSinglePlinko;
  const createPlinkoTable = dbClient.createPlinkoTable;
  const addPlinkoBet = dbClient.addPlinkoBet;
  const getPlinkoTable = dbClient.getPlinkoTable;
  const removePlinkoBet = dbClient.removePlinkoBet;
  const startMultiPlinko = dbClient.startMultiPlinko;
  const createRange = dbClient.createRange;
  const createRockPaperScissors = dbClient.createRockPaperScissors;
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
  const getBlackjackTable = dbClient.getBlackjackTable;
  const blackjackDealerMove = dbClient.blackjackDealerMove;
  const blackjackPlayerMove = dbClient.blackjackPlayerMove;

  const state: DoubleUpContextState = {
    addRouletteBet,
    buyLotteryTickets,
    createCoinflip,
    createLimbo,
    createSinglePlinko,
    createPlinkoTable,
    addPlinkoBet,
    getPlinkoTable,
    removePlinkoBet,
    startMultiPlinko,
    createRange,
    createRockPaperScissors,
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
    blackjackDealerMove,
    blackjackPlayerMove,
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
