import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  COIN_MODULE_NAME,
  COIN_STRUCT_NAME,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericGameResult } from "../../utils";

export interface CoinflipInput {
    betType: 0 | 1;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalCoinflipInput extends CoinflipInput {
    coinflipPackageId: string;
}

export interface CoinflipResultInput {
    coinType: string;
    pollInterval?: number;
    transactionResult: any;
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
    coinType,
    coinflipPackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalCoinflipResultInput) => {
    return getGenericGameResult({
        coinType,
        moduleName: COIN_MODULE_NAME,
        packageId: coinflipPackageId,
        pollInterval,
        suiClient,
        structName: COIN_STRUCT_NAME,
        transactionResult
    });
};
