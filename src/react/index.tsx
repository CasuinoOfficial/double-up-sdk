import { SuiClient } from "@mysten/sui/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import {
  CoinflipInput,
  CoinflipResultInput,
  CoinflipResponse,
  CoinflipResultResponse,
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
  LimboResultInput,
  LimboResponse,
  LimboResultResponse,
} from "../games/limbo";
import {
  PlinkoInput,
  PlinkoResultInput,
  PlinkoResponse,
  PlinkoResultResponse,
} from "../games/plinko";
import {
  RangeDiceInput,
  RangeDiceResultInput,
  RangeDiceResponse,
  RangeDiceResultResponse,
} from "src/games/rangeDice";
import {
  CreatedRouletteTableInput,
  CreatedRouletteTableResponse,
  RouletteAddBetInput,
  RouletteAddBetResponse,
  RouletteRemoveBetInput,
  RouletteRemoveBetResponse,
  RouletteResultInput,
  RouletteResultResponse,
  RouletteStartInput,
  RouletteStartResponse,
  RouletteTableInput,
  RouletteTableResponse,
  RouletteTableExistsInput,
  RouletteTableExistsResponse,
} from "src/games/roulette";
import {
  RPSInput,
  RPSResultInput,
  RPSResponse,
  RPSResultResponse,
} from "src/games/rps";

interface DoubleUpContextState {
  addRouletteBet: (input: RouletteAddBetInput) => RouletteAddBetResponse;
  buyLotteryTickets: (input: BuyTicketsInput) => BuyTicketsResponse;
  createCoinflip: (input: CoinflipInput) => CoinflipResponse;
  createLimbo: (input: LimboInput) => LimboResponse;
  createPlinko: (input: PlinkoInput) => PlinkoResponse;
  createRangeDice: (input: RangeDiceInput) => RangeDiceResponse;
  createRockPaperScissors: (input: RPSInput) => RPSResponse;
  createRouletteTable: (input: RouletteTableInput) => RouletteTableResponse;
  doesRouletteTableExist: (
    input: RouletteTableExistsInput
  ) => Promise<RouletteTableExistsResponse>;
  getCoinflipResult: (
    input: CoinflipResultInput
  ) => Promise<CoinflipResultResponse>;
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
  getLimboResult: (input: LimboResultInput) => Promise<LimboResultResponse>;
  getPlinkoResult: (input: PlinkoResultInput) => Promise<PlinkoResultResponse>;
  getRangeDiceResult: (
    input: RangeDiceResultInput
  ) => Promise<RangeDiceResultResponse>;
  getRockPaperScissorsResult: (
    input: RPSResultInput
  ) => Promise<RPSResultResponse>;
  getRouletteResult: (
    input: RouletteResultInput
  ) => Promise<RouletteResultResponse>;
  redeemLotteryTickets: (input: RedeemTicketsInput) => RedeemTicketsResponse;
  removeRouletteBet: (
    input: RouletteRemoveBetInput
  ) => RouletteRemoveBetResponse;
  startRoulette: (input: RouletteStartInput) => RouletteStartResponse;
}

interface DoubleupProviderProps {
  children: ReactNode;
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

const DoubleUpContext = createContext<DoubleUpContextState>();

const DoubleUpProvider = ({
  children,
  coinflipPackageId,
  coinflipCorePackageId,
  dicePackageId,
  diceCorePackageId,
  limboPackageId,
  limboCorePackageId,
  origin,
  partnerNftListId,
  plinkoPackageId,
  plinkoCorePackageId,
  plinkoVerifierId,
  rangeDicePackageId,
  rangeDiceCorePackageId,
  roulettePackageId,
  rouletteCorePackageId,
  rpsPackageId,
  rpsCorePackageId,
  suiClient,
}: DoubleupProviderProps): ReactElement => {
  const dbClient = new DoubleUpClient({
    coinflipPackageId,
    coinflipCorePackageId,
    dicePackageId,
    diceCorePackageId,
    limboPackageId,
    limboCorePackageId,
    origin,
    partnerNftListId,
    plinkoPackageId,
    plinkoCorePackageId,
    plinkoVerifierId,
    rangeDicePackageId,
    rangeDiceCorePackageId,
    roulettePackageId,
    rouletteCorePackageId,
    rpsPackageId,
    rpsCorePackageId,
    suiClient,
  });

  const addRouletteBet = dbClient.addRouletteBet;

  const buyLotteryTickets = dbClient.buyLotteryTickets;

  const createCoinflip = dbClient.createCoinflip;
  const createLimbo = dbClient.createLimbo;
  const createPlinko = dbClient.createPlinko;
  const createRangeDice = dbClient.createRangeDice;
  const createRockPaperScissors = dbClient.createRockPaperScissors;
  const createRouletteTable = dbClient.createRouletteTable;

  const doesRouletteTableExist = dbClient.doesRouletteTableExist;

  const getCoinflipResult = dbClient.getCoinflipResult;
  const getCreatedRouletteTable = dbClient.getCreatedRouletteTable;
  const getLimboResult = dbClient.getLimboResult;
  const getLottery = dbClient.getLottery;
  const getLotteryDrawingResult = dbClient.getLotteryDrawingResult;
  const getLotteryHistory = dbClient.getLotteryHistory;
  const getLotteryTickets = dbClient.getLotteryTickets;
  const getPlinkoResult = dbClient.getPlinkoResult;
  const getRangeDiceResult = dbClient.getRangeDiceResult;
  const getRockPaperScissorsResult = dbClient.getRockPaperScissorsResult;
  const getRouletteResult = dbClient.getRouletteResult;

  const redeemLotteryTickets = dbClient.redeemLotteryTickets;
  const removeRouletteBet = dbClient.removeRouletteBet;

  const startRoulette = dbClient.startRoulette;

  const state: DoubleUpContextState = {
    addRouletteBet,
    buyLotteryTickets,
    createCoinflip,
    createLimbo,
    createPlinko,
    createRangeDice,
    createRockPaperScissors,
    createRouletteTable,
    doesRouletteTableExist,
    getCoinflipResult,
    getCreatedRouletteTable,
    getLimboResult,
    getLottery,
    getLotteryDrawingResult,
    getLotteryHistory,
    getLotteryTickets,
    getPlinkoResult,
    getRangeDiceResult,
    getRockPaperScissorsResult,
    getRouletteResult,
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
