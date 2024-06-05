import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import { 
  COIN_CORE_PACKAGE_ID,
  COIN_PACKAGE_ID,
  DICE_PACKAGE_ID,
  DICE_CORE_PACKAGE_ID,
  LIMBO_PACKAGE_ID,
  LIMBO_CORE_PACKAGE_ID,
  PLINKO_PACKAGE_ID,
  PLINKO_CORE_PACKAGE_ID,
  PLINKO_VERIFIER_ID
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
  PlinkoInput,
  PlinkoResultInput
} from "../games/plinko";

interface DoubleUpClientInput {
  coinflipPackageId?: string;
  coinflipCorePackageId?: string;
  dicePackageId?: string;
  diceCorePackageId?: string;
  limboPackageId?: string;
  limboCorePackageId?: string;
  plinkoPackageId?: string;
  plinkoCorePackageId?: string;
  plinkoVerifierId?: string;
  suiClient?: SuiClient;
}

export class DoubleUpClient {
    constructor({
      coinflipPackageId = COIN_PACKAGE_ID,
      coinflipCorePackageId = COIN_CORE_PACKAGE_ID,
      dicePackageId = DICE_PACKAGE_ID,
      diceCorePackageId = DICE_CORE_PACKAGE_ID,
      limboPackageId = LIMBO_PACKAGE_ID,
      limboCorePackageId = LIMBO_CORE_PACKAGE_ID,
      plinkoPackageId = PLINKO_PACKAGE_ID,
      plinkoCorePackageId = PLINKO_CORE_PACKAGE_ID,
      plinkoVerifierId = PLINKO_VERIFIER_ID,
      suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") })
    }: DoubleUpClientInput) {
      this.coinflipPackageId = coinflipPackageId;
      this.coinflipCorePackageId = coinflipCorePackageId;

      this.dicePackageId = dicePackageId;
      this.diceCorePackageId = diceCorePackageId;

      this.limboPackageId = limboPackageId;
      this.limboCorePackageId = limboCorePackageId;

      this.plinkoPackageId = plinkoPackageId;
      this.plinkoCorePackageId = plinkoCorePackageId;
      this.plinkoVerifierId = plinkoVerifierId;

      this.suiClient = suiClient;
    }

    coinflipPackageId: string;
    coinflipCorePackageId: string;

    dicePackageId: string;
    diceCorePackageId: string;

    limboPackageId: string;
    limboCorePackageId: string;

    plinkoPackageId: string;
    plinkoCorePackageId: string;
    plinkoVerifierId: string;

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
    createPlinko = (input: PlinkoInput) => createPlinko({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      plinkoVerifierId: this.plinkoVerifierId
    });
    getPlinkoResult = (input: PlinkoResultInput) => getPlinkoResult({
      ...input,
      plinkoPackageId: this.plinkoPackageId,
      plinkoCorePackageId: this.plinkoCorePackageId,
      suiClient: this.suiClient
    });
}
