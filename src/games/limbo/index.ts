import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  LIMBO_MAX_MULTIPLIER, 
  LIMBO_MIN_MULTIPLIER, 
  LIMBO_MODULE_NAME,
  LIMBO_STRUCT_NAME,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericGameResult } from "../../utils";

export interface LimboInput {
    coin: TransactionObjectArgument;
    coinType: string;
    multiplier: number;
    transactionBlock: TransactionBlockType;
}

interface InternalLimboInput extends LimboInput {
    limboPackageId: string;
}

export interface LimboGameIdInput {
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalLimboGameIdInput extends LimboGameIdInput {
    limboPackageId: string;
    suiClient: SuiClient;
}

export interface LimboResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

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

export const getLimboGameResult = async ({
    coinType,
    limboPackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalLimboGameIdInput) => {
    return getGenericGameResult({
        coinType,
        moduleName: LIMBO_MODULE_NAME,
        packageId: limboPackageId,
        pollInterval,
        suiClient,
        structName: LIMBO_STRUCT_NAME,
        transactionResult
    });
};
