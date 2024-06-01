import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from 'axios';
import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ,
  COIN_MODULE_NAME,
  COIN_STRUCT_NAME,
  DOUBLE_UP_API,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericBlsGameResult } from "../../utils";

// Note: 0 - Heads / 1 - Tails
type BetType = 0 | 1;

type CoinflipResult = "heads" | "tails";

export interface CoinflipInput {
    betType: BetType;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalCoinflipInput extends CoinflipInput {
    coinflipPackageId: string;
}

export interface CoinflipResultInput {
    betType: BetType;
    coinType: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalCoinflipResultInput extends CoinflipResultInput {
    coinflipPackageId: string;
    suiClient: SuiClient;
}

export interface CoinflipResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

export interface CoinflipResultResponse {
    ok: boolean;
    err?: Error;
    results?: CoinflipResult[];
}

// Add coinflip to the transaction block
export const createCoinflip = ({
    betType,
    coin,
    coinflipPackageId,
    coinType,
    transactionBlock
} : InternalCoinflipInput): CoinflipResponse => {
    const res: CoinflipResponse = { ok: true };

    try {
        // This adds some extra entropy to the coinflip itself
        const userRandomness = randomBytes(512);

        const [receipt] = transactionBlock.moveCall({
            target: `${coinflipPackageId}::${COIN_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
            transactionBlock.object(UNI_HOUSE_OBJ),
            transactionBlock.object(BLS_VERIFIER_OBJ),
            transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
            transactionBlock.pure(betType),
            coin,
            ],    
        });

        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }
    
    return res;
};

export const getCoinflipResult = async ({
    betType,
    coinType,
    coinflipPackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalCoinflipResultInput): Promise<CoinflipResultResponse> => {
    const res: CoinflipResultResponse = { ok: true };

    try {
        const { ok, err, events } = await getGenericBlsGameResult({
            coinType,
            moduleName: COIN_MODULE_NAME,
            packageId: coinflipPackageId,
            pollInterval,
            suiClient,
            structName: COIN_STRUCT_NAME,
            transactionResult
        });

        if (!ok) {
            throw err;
        }

        const settlement = await axios.post(`${DOUBLE_UP_API}/bls`, {
            coinType,
            gameInfos: events,
            gameName: COIN_MODULE_NAME
        });

        if (!settlement.data.results) {
            throw new Error('could not determine results');
        }

        const results = [];

        for (const gameResult of settlement.data.results) {
            const roll = +gameResult;

            if (roll >= 0 && roll <= 495) {
                results.push("heads");
            } else if (roll >= 500 && roll <= 995) {
                results.push("tails");
            } else {
                results.push(betType === 0 ? "tails" : "heads");
            }
        }

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
