import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from "axios";
import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ,
  DOUBLE_UP_API,
  LIMBO_MAX_MULTIPLIER, 
  LIMBO_MIN_MULTIPLIER, 
  LIMBO_MODULE_NAME,
  LIMBO_STRUCT_NAME,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericBlsGameResult } from "../../utils";

type LimboResult = any;

export interface LimboInput {
    coin: TransactionObjectArgument;
    coinType: string;
    multiplier: number;
    transactionBlock: TransactionBlockType;
}

interface InternalLimboInput extends LimboInput {
    limboPackageId: string;
}

export interface LimboResultInput {
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalLimboResultInput extends LimboResultInput {
    limboPackageId: string;
    suiClient: SuiClient;
}

export interface LimboResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

export interface LimboResultResponse {
    ok: boolean;
    err?: Error;
    results?: LimboResult[];
}


const distanceToMultiplier = (distance: number): number => {
    distance /= 100_000;
    const res = (10_000 - distance) / (10_000 - 100 * distance);
  
    if (res > 100) {
      return 100;
    }
  
    return Math.floor(res * 100) / 100;
};

// Weighted flip where the user can select how much multiplier they want.
export const createLimbo = ({
    coin,
    coinType,
    limboPackageId,
    multiplier,
    transactionBlock
}: InternalLimboInput): LimboResponse => {
    const res: LimboResponse = { ok: true };

    try {
        if (Number(multiplier) < Number(LIMBO_MIN_MULTIPLIER) || Number(multiplier) > Number(LIMBO_MAX_MULTIPLIER)) {
            throw new Error("Multiplier out of range");
        };
        
        // This adds some extra entropy to the coinflip itself.
        const userRandomness = randomBytes(512);
    
        const [receipt] = transactionBlock.moveCall({
            target: `${limboPackageId}::${LIMBO_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
              transactionBlock.object(UNI_HOUSE_OBJ),
              transactionBlock.object(BLS_VERIFIER_OBJ),
              transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
              transactionBlock.pure([Math.floor(Number(multiplier) * 100)], "vector<u64>"),
              transactionBlock.makeMoveVec({ objects: [coin] }),
            ],
        });
    
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getLimboResult = async ({
    coinType,
    limboPackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalLimboResultInput): Promise<LimboResultResponse> => {
    const res: LimboResultResponse = { ok: true };

    try {
        const { ok, err, events } = await getGenericBlsGameResult({
            coinType,
            moduleName: LIMBO_MODULE_NAME,
            packageId: limboPackageId,
            pollInterval,
            suiClient,
            structName: LIMBO_STRUCT_NAME,
            transactionResult
        });

        if (!ok) {
            throw err;
        }

        const settlement = await axios.post(`${DOUBLE_UP_API}/settle`, {
            coinType,
            gameInfos: events,
            gameName: LIMBO_MODULE_NAME
        });

        if (!settlement.data.results) {
            throw new Error('could not determine results');
        }

        const results = [];

        for (const gameResult of settlement.data.results) {
            console.log(gameResult)
            if (Number(gameResult[0].outcome) % 69 === 0) {
                results.push(1);
            } else {
                results.push(distanceToMultiplier(Number(gameResult[0].outcome)));
            }
        }

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
