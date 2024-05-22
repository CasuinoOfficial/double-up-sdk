import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

import {
  createCoinflip,
  createWeightedFlip,
  getTransactionCoinflipGameId,
  CoinFlipGameIdInput,
  WeightedCoinFlipInput
} from "../games/coinflip";

interface DoubleUpClientInput {
  suiClient: SuiClient;
}

export class DoubleUpClient {
    constructor({
        suiClient,
    }: DoubleUpClientInput) {
      if (suiClient) {
        this.suiClient = suiClient;
      } 
      else {
        this.suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
      }
    }

    suiClient: SuiClient;

    // coinflip
    createCoinflip = createCoinflip;
    createWeightedFlip = createWeightedFlip;
    getTransactionCoinflipGameId = (input: CoinFlipGameIdInput) => getTransactionCoinflipGameId({ ...input, suiClient: this.suiClient });
    // getTransactionWeightedCoinflipGameId = (input: WeightedCoinFlipGameIdInput) => this.getTransactionWeightedCoinflipGameId({ ...input, this.suiClient: this.suiClient });
}
