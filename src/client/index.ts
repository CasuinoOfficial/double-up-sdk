import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import { 
  COIN_PACKAGE_ID,
  DICE_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  PLINKO_PACKAGE_ID
} from "../constants";

import {
  createCoinflip,
  getTransactionCoinflipGameId,
  CoinFlipInput,
  CoinFlipGameIdInput
} from "../games/coinflip";

import { createDice, DiceInput } from "../games/dice";

import { createLimbo, LimboInput } from "../games/limbo";

import { createPlinko, PlinkoInput } from "../games/plinko";

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
    createCoinflip = (input: CoinFlipInput) => createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });
    getTransactionCoinflipGameId = (input: CoinFlipGameIdInput) => getTransactionCoinflipGameId({
      ...input,
      coinflipPackageId: this.coinflipPackageId,
      suiClient: this.suiClient
    });

    // dice
    createDice = (input: DiceInput) => createDice({ ...input, dicePackageId: this.dicePackageId });

    // limbo
    createLimbo = (input: LimboInput) => createLimbo({ ...input, limboPackageId: this.limboPackageId });
    // getTransactionLimboGameId = (input: LimboGameIdInput) => this.getTransactionLimboGameId({ ...input, this.suiClient: this.suiClient });

    // plinko
    createPlinko = (input: PlinkoInput) => createPlinko({ ...input, plinkoPackageId: this.plinkoPackageId });
}
