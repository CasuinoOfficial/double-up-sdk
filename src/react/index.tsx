import { SuiClient } from "@mysten/sui.js/client";

import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react";

import { DoubleUpClient } from "../client";

import { CoinflipInput, CoinflipResultInput, CoinflipResponse } from "../games/coinflip";
import { DiceInput, DiceResultInput, DiceResponse } from "../games/dice";
import { LimboInput, LimboResultInput, LimboResponse } from "../games/limbo";
import { PlinkoInput, PlinkoResultInput, PlinkoResponse } from "../games/plinko";

import { GenericGameResultResponse } from "../utils";

interface DoubleUpContextState {
  createCoinflip: (input: CoinflipInput) => CoinflipResponse;
  createDice: (input: DiceInput) => DiceResponse;
  createLimbo: (input: LimboInput) => LimboResponse;
  createPlinko: (input: PlinkoInput) => PlinkoResponse;
  getCoinflipResult: (input: CoinflipResultInput) => Promise<GenericGameResultResponse>;
  getDiceResult: (input: DiceResultInput) => Promise<GenericGameResultResponse>;
  getLimboResult: (input: LimboResultInput) => Promise<GenericGameResultResponse>;
  getPlinkoResult: (input: PlinkoResultInput) => Promise<GenericGameResultResponse>;
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
