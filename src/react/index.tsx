import { SuiClient } from "@mysten/sui/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import {
  CoinflipInput,
} from "../games/coinflip";
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
  LimboInput,
} from "../games/limbo";
import {
  PlinkoInput,
} from "../games/plinko";
import {
  RangeInput,
} from "src/games/ufoRange";
import {
  CreatedRouletteTableInput,
  CreatedRouletteTableResponse,
  RouletteAddBetInput,
  RouletteRemoveBetInput,
  RouletteRemoveBetResponse,
  RouletteStartInput,
  RouletteTableInput,
  RouletteTableResponse,
  RouletteTableExistsInput,
  RouletteTableExistsResponse,
} from "src/games/roulette";
import {
  RPSInput,
} from "src/games/rps";

interface DoubleUpContextState {
  addRouletteBet: (input: RouletteAddBetInput) => void;
  buyLotteryTickets: (input: BuyTicketsInput) => BuyTicketsResponse;
  createCoinflip: (input: CoinflipInput) => void;
  createLimbo: (input: LimboInput) => void;
  createSinglePlinko: (input: PlinkoInput) => void;
  createRange: (input: RangeInput) => void;
  createRockPaperScissors: (input: RPSInput) => void;
  createRouletteTable: (input: RouletteTableInput) => RouletteTableResponse;
  doesRouletteTableExist: (
    input: RouletteTableExistsInput
  ) => Promise<RouletteTableExistsResponse>;
  getCreatedRouletteTable: (
    input: CreatedRouletteTableInput
  ) => CreatedRouletteTableResponse;
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
    suiClient,
  });

  const addRouletteBet = dbClient.addRouletteBet;

  const buyLotteryTickets = dbClient.buyLotteryTickets;

  const createCoinflip = dbClient.createCoinflip;
  const createLimbo = dbClient.createLimbo;
  const createSinglePlinko = dbClient.createSinglePlinko;
  const createRange = dbClient.createRange;
  const createRockPaperScissors = dbClient.createRockPaperScissors;
  const createRouletteTable = dbClient.createRouletteTable;

  const doesRouletteTableExist = dbClient.doesRouletteTableExist;

  const getCreatedRouletteTable = dbClient.getCreatedRouletteTable;
  const getLottery = dbClient.getLottery;
  const getLotteryDrawingResult = dbClient.getLotteryDrawingResult;
  const getLotteryHistory = dbClient.getLotteryHistory;
  const getLotteryTickets = dbClient.getLotteryTickets;


  const redeemLotteryTickets = dbClient.redeemLotteryTickets;
  const removeRouletteBet = dbClient.removeRouletteBet;

  const startRoulette = dbClient.startRoulette;

  const state: DoubleUpContextState = {
    addRouletteBet,
    buyLotteryTickets,
    createCoinflip,
    createLimbo,
    createSinglePlinko,
    createRange,
    createRockPaperScissors,
    createRouletteTable,
    doesRouletteTableExist,
    getCreatedRouletteTable,
    getLottery,
    getLotteryDrawingResult,
    getLotteryHistory,
    getLotteryTickets,
    redeemLotteryTickets,
    removeRouletteBet,
    startRoulette,
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
