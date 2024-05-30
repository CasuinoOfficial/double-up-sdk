import { SuiClient } from "@mysten/sui.js/client";

import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from "react";

import { DoubleUpClient } from "../client";

import { CoinFlipInput, CoinFlipResponse } from "../games/coinflip";
import { DiceInput, DiceResponse } from "../games/dice";
import { LimboInput, LimboResponse } from "../games/limbo";
import { PlinkoInput, PlinkoResponse } from "../games/plinko";

interface DoubleUpContextState {
  createCoinflip: (input: CoinFlipInput) => CoinFlipResponse;
  createDice: (input: DiceInput) => DiceResponse;
  createLimbo: (input: LimboInput) => LimboResponse;
  createPlinko: (input: PlinkoInput) => PlinkoResponse;
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

  const state: DoubleUpContextState = {
    createCoinflip,
    createDice,
    createLimbo,
    createPlinko
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
