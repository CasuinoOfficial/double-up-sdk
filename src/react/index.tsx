import { SuiClient } from "@mysten/sui.js/client";

import { ReactElement, ReactNode, createContext, useContext } from "react";

import { DoubleUpClient } from "../client";

import { CoinflipInput, CoinflipResultInput, CoinflipResponse, CoinflipResultResponse } from "../games/coinflip";
import { DiceInput, DiceResultInput, DiceResponse, DiceResultResponse } from "../games/dice";
import { LimboInput, LimboResultInput, LimboResponse, LimboResultResponse } from "../games/limbo";
import { PlinkoInput, PlinkoResultInput, PlinkoResponse, PlinkoResultResponse } from "../games/plinko";

interface DoubleUpContextState {
  createCoinflip: (input: CoinflipInput) => CoinflipResponse;
  createDice: (input: DiceInput) => DiceResponse;
  createLimbo: (input: LimboInput) => LimboResponse;
  createPlinko: (input: PlinkoInput) => PlinkoResponse;
  getCoinflipResult: (input: CoinflipResultInput) => Promise<CoinflipResultResponse>;
  getDiceResult: (input: DiceResultInput) => Promise<DiceResultResponse>;
  getLimboResult: (input: LimboResultInput) => Promise<LimboResultResponse>;
  getPlinkoResult: (input: PlinkoResultInput) => Promise<PlinkoResultResponse>;
}

interface DoubleupProviderProps {
  children: ReactNode;
  coinflipPackageId?: string;
  dicePackageId?: string;
  limboPackageId?: string;
  plinkoPackageId?: string;
  suiClient?: SuiClient;
}

const DoubleUpContext = createContext<DoubleUpContextState>();

const DoubleUpProvider = ({
  children,
  coinflipPackageId,
  dicePackageId,
  limboPackageId,
  plinkoPackageId,
  suiClient
}: DoubleupProviderProps): ReactElement => {
  const dbClient = new DoubleUpClient({
    coinflipPackageId,
    dicePackageId,
    limboPackageId,
    plinkoPackageId,
    suiClient
  });

  const createCoinflip = dbClient.createCoinflip;
  const createDice = dbClient.createDice;
  const createLimbo = dbClient.createLimbo;
  const createPlinko = dbClient.createPlinko;

  const getCoinflipResult = dbClient.getCoinflipResult;
  const getDiceResult = dbClient.getDiceResult;
  const getLimboResult = dbClient.getLimboResult;
  const getPlinkoResult = dbClient.getPlinkoResult;

  const state: DoubleUpContextState = {
    createCoinflip,
    createDice,
    createLimbo,
    createPlinko,
    getCoinflipResult,
    getDiceResult,
    getLimboResult,
    getPlinkoResult
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
