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
  PLINKO_VERIFIER_ID,
  RPS_CORE_PACKAGE_ID,
  RPS_PACKAGE_ID,
  RANGE_DICE_PACKAGE_ID,
  RANGE_DICE_CORE_PACKAGE_ID
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

import {
  createRangeDice,
  getRangeDiceResult,
  RangeDiceInput,
  RangeDiceResultInput
} from "../games/rangeDice";

import {
  createRockPaperScissors,
  getRockPaperScissorsResult,
  RPSInput,
  RPSResultInput
} from "../games/rps";

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
  rangeDicePackageId?: string;
  rangeDiceCorePackageId?: string;
  rpsPackageId?: string;
  rpsCorePackageId?: string;
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
      rangeDicePackageId = RANGE_DICE_PACKAGE_ID,
      rangeDiceCorePackageId = RANGE_DICE_CORE_PACKAGE_ID,
      rpsPackageId = RPS_PACKAGE_ID,
      rpsCorePackageId = RPS_CORE_PACKAGE_ID,
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

      this.rangeDicePackageId = rangeDicePackageId;
      this.rangeDiceCorePackageId = rangeDiceCorePackageId;

      this.rpsPackageId = rpsPackageId;
      this.rpsCorePackageId = rpsCorePackageId;

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

    rangeDicePackageId: string;
    rangeDiceCorePackageId: string;

    rpsPackageId: string;
    rpsCorePackageId: string;

    suiClient: SuiClient;

    // coinflip
    createCoinflip = (input: CoinflipInput) => createCoinflip({ ...input, coinflipPackageId: this.coinflipPackageId });
    getCoinflipResult = (input: CoinflipResultInput) => getCoinflipResult({
      ...input,
      coinflipCorePackageId: this.coinflipCorePackageId,
      suiClient: this.suiClient
    });

    // dice
    createDice = (input: DiceInput) => createDice({ ...input, dicePackageId: this.dicePackageId });
    getDiceResult = (input: DiceResultInput) => getDiceResult({
      ...input,
      diceCorePackageId: this.diceCorePackageId,
      suiClient: this.suiClient
    });

    // limbo
    createLimbo = (input: LimboInput) => createLimbo({ ...input, limboPackageId: this.limboPackageId });
    getLimboResult = (input: LimboResultInput) => getLimboResult({
      ...input,
      limboCorePackageId: this.limboCorePackageId,
      suiClient: this.suiClient
    });

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

    // range dice
    createRangeDice = (input: RangeDiceInput) => createRangeDice({
      ...input,
      rangeDicePackageId: this.rangeDicePackageId
    });
    getRangeDiceResult = (input: RangeDiceResultInput) => getRangeDiceResult({
      ...input,
      rangeDiceCorePackageId: this.rangeDiceCorePackageId,
      suiClient: this.suiClient
    });

    // rps
    createRockPaperScissors = (input: RPSInput) => createRockPaperScissors({
      ...input,
      rpsPackageId: this.rpsPackageId
    });
    getRockPaperScissorsResult = (input: RPSResultInput) => getRockPaperScissorsResult({
      ...input,
      rpsCorePackageId: this.rpsCorePackageId,
      suiClient: this.suiClient
    });
}
