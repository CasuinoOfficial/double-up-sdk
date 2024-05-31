import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import { 
  COIN_PACKAGE_ID,
  DICE_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_PACKAGE_ID
} from "../constants";

import {
  createCoinflip,
  getCoinflipResult,
  CoinflipInput,
  CoinflipResultInput
} from "../games/coinflip";

import {
  createDice,
  getDiceResult,
  DiceInput,
  DiceResultInput
} from "../games/dice";

import {
  createLimbo,
  getLimboResult,
  LimboInput,
  LimboResultInput
} from "../games/limbo";

import {
  createPlinko,
  getPlinkoResult,
  PlinkoInput,
  PlinkoResultInput
} from "../games/plinko";

interface DoubleUpClientInput {
  coinflipPackageId: string;
  dicePackageId: string;
  limboPackageId: string;
  plinkoPackageId: string;
  suiClient: SuiClient;
}

export class DoubleUpClient {
    constructor({
      coinflipPackageId = COIN_PACKAGE_ID,
      dicePackageId = DICE_PACKAGE_ID,
      limboPackageId = LIMBO_PACKAGE_ID,
      plinkoPackageId = PLINKO_PACKAGE_ID,
      suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") })
    }: DoubleUpClientInput) {
      this.coinflipPackageId = coinflipPackageId;
      this.dicePackageId = dicePackageId;
      this.limboPackageId = limboPackageId;
      this.plinkoPackageId = plinkoPackageId;

      this.suiClient = suiClient;
    }

    coinflipPackageId: string;
    dicePackageId: string;
    limboPackageId: string;
    plinkoPackageId: string;

    suiClient: SuiClient;

    // coinflip
    createCoinflip = (input: CoinflipInput) => createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });
    getCoinflipResult = (input: CoinflipResultInput) => getCoinflipResult({
      ...input,
      coinflipPackageId: this.coinflipPackageId,
      suiClient: this.suiClient
    });

    // dice
    createDice = (input: DiceInput) => createDice({ ...input, dicePackageId: this.dicePackageId });
    getDiceResult = (input: DiceResultInput) => getDiceResult({
      ...input,
      dicePackageId: this.dicePackageId,
      suiClient: this.suiClient
    });

    // limbo
    createLimbo = (input: LimboInput) => createLimbo({ ...input, limboPackageId: this.limboPackageId });
    getLimboResult = (input: LimboResultInput) => getLimboResult({
      ...input,
      limboPackageId: this.limboPackageId,
      suiClient: this.suiClient
    });

    // plinko
    createPlinko = (input: PlinkoInput) => createPlinko({ ...input, plinkoPackageId: this.plinkoPackageId });
    getPlinkoResult = (input: PlinkoResultInput) => getPlinkoResult({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      suiClient: this.suiClient
    });
}
