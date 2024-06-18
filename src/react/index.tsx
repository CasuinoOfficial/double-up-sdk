import { SuiClient } from "@mysten/sui.js/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import { CoinflipInput, CoinflipResultInput, CoinflipResponse, CoinflipResultResponse } from "../games/coinflip";
import { DiceInput, DiceResultInput, DiceResponse, DiceResultResponse } from "../games/dice";
import { LimboInput, LimboResultInput, LimboResponse, LimboResultResponse } from "../games/limbo";
import { PlinkoInput, PlinkoResultInput, PlinkoResponse, PlinkoResultResponse } from "../games/plinko";
import { RangeDiceInput, RangeDiceResultInput, RangeDiceResponse, RangeDiceResultResponse } from "src/games/rangeDice";
import { RPSInput, RPSResultInput, RPSResponse, RPSResultResponse } from "src/games/rps";

interface DoubleUpContextState {
  createCoinflip: (input: CoinflipInput) => CoinflipResponse;
  createDice: (input: DiceInput) => DiceResponse;
  createLimbo: (input: LimboInput) => LimboResponse;
  createPlinko: (input: PlinkoInput) => PlinkoResponse;
  createRangeDice: (input: RangeDiceInput) => RangeDiceResponse;
  createRockPaperScissors: (input: RPSInput) => RPSResponse;
  getCoinflipResult: (input: CoinflipResultInput) => Promise<CoinflipResultResponse>;
  getDiceResult: (input: DiceResultInput) => Promise<DiceResultResponse>;
  getLimboResult: (input: LimboResultInput) => Promise<LimboResultResponse>;
  getPlinkoResult: (input: PlinkoResultInput) => Promise<PlinkoResultResponse>;
  getRangeDiceResult: (input: RangeDiceResultInput) => Promise<RangeDiceResultResponse>;
  getRockPaperScissorsResult: (input: RPSResultInput) => Promise<RPSResultResponse>;
}

interface DoubleupProviderProps {
  children: ReactNode;
  coinflipPackageId?: string;
  coinflipCorePackageId?: string;
  dicePackageId?: string;
  diceCorePackageId?: string;
  limboPackageId?: string;
  limboCorePackageId?: string;
  plinkoPackageId?: string;
  plinkoCorePackageId?: string;
  plinkoVerifierId?: string;
  rangeDicePackageId?: string;
  rangeDiceCorePackageId?: string;
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
  plinkoPackageId,
  plinkoCorePackageId,
  plinkoVerifierId,
  rangeDicePackageId,
  rangeDiceCorePackageId,
  rpsPackageId,
  rpsCorePackageId,
  suiClient
}: DoubleupProviderProps): ReactElement => {
  const dbClient = new DoubleUpClient({
    coinflipPackageId,
    coinflipCorePackageId,
    dicePackageId,
    diceCorePackageId,
    limboPackageId,
    limboCorePackageId,
    plinkoPackageId,
    plinkoCorePackageId,
    plinkoVerifierId,
    rangeDicePackageId,
    rangeDiceCorePackageId,
    rpsPackageId,
    rpsCorePackageId,
    suiClient
  });

  const createCoinflip = dbClient.createCoinflip;
  const createDice = dbClient.createDice;
  const createLimbo = dbClient.createLimbo;
  const createPlinko = dbClient.createPlinko;
  const createRangeDice = dbClient.createRangeDice;
  const createRockPaperScissors = dbClient.createRockPaperScissors;

  const getCoinflipResult = dbClient.getCoinflipResult;
  const getDiceResult = dbClient.getDiceResult;
  const getLimboResult = dbClient.getLimboResult;
  const getPlinkoResult = dbClient.getPlinkoResult;
  const getRangeDiceResult = dbClient.getRangeDiceResult;
  const getRockPaperScissorsResult = dbClient.getRockPaperScissorsResult;

  const state: DoubleUpContextState = {
    createCoinflip,
    createDice,
    createLimbo,
    createPlinko,
    createRangeDice,
    createRockPaperScissors,
    getCoinflipResult,
    getDiceResult,
    getLimboResult,
    getPlinkoResult,
    getRangeDiceResult,
    getRockPaperScissorsResult
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

export {
    DoubleUpProvider,
    useDoubleUp
};
