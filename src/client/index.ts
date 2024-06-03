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
  CoinflipInput
} from "../games/coinflip";

import {
  createDice,
  getDiceResult,
  DiceInput
} from "../games/dice";

import {
  createLimbo,
  getLimboResult,
  LimboInput
} from "../games/limbo";

import {
  createPlinko,
  getPlinkoResult,
  PlinkoInput
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
    getCoinflipResult = getCoinflipResult;

    // dice
    createDice = (input: DiceInput) => createDice({ ...input, dicePackageId: this.dicePackageId });
    getDiceResult = getDiceResult;

    // limbo
    createLimbo = (input: LimboInput) => createLimbo({ ...input, limboPackageId: this.limboPackageId });
    getLimboResult = getLimboResult;

    // plinko
    createPlinko = (input: PlinkoInput) => createPlinko({ ...input, plinkoPackageId: this.plinkoPackageId });
    getPlinkoResult = getPlinkoResult;
}
