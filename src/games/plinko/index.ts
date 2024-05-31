import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
    PLINKO_MODULE_NAME,
    PLINKO_PACKAGE_ID,
    PLINKO_STRUCT_NAME,
    PLINKO_VERIFIER_ID,
    UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericGameResult } from "../../utils";

type PlinkoType = 0 | 1 | 2;

export interface PlinkoInput {
    betAmount: number;
    coin: TransactionObjectArgument;
    coinType: string;
    numberOfDiscs: number;
    plinkoType: PlinkoType;
    transactionBlock: TransactionBlockType;
}

interface InternalPlinkoInput extends PlinkoInput {
    plinkoPackageId: string;
}

export interface PlinkoGameIdInput {
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalPlinkoGameIdInput extends PlinkoGameIdInput {
    suiClient: SuiClient;
}

export interface PlinkoResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

export const createPlinko = ({
    betAmount,
    coin,
    coinType,
    numberOfDiscs,
    plinkoPackageId,
    plinkoType,
    transactionBlock,
}: InternalPlinkoInput): PlinkoResponse => {
    const res: PlinkoResponse = { ok: false };

    try {
        const userRandomness = randomBytes(512);

        const [_, receipt] = transactionBlock.moveCall({
            target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(PLINKO_VERIFIER_ID),
                transactionBlock.pure(numberOfDiscs),
                transactionBlock.pure(betAmount),
                transactionBlock.pure(plinkoType),
                transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
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

export const getPlinkoGameResult = async ({
    coinType,
    pollInterval,
    suiClient,
    transactionResult
}: InternalPlinkoGameIdInput) => {
    return getGenericGameResult({
        coinType,
        moduleName: PLINKO_MODULE_NAME,
        packageId: PLINKO_PACKAGE_ID,
        pollInterval,
        suiClient,
        structName: PLINKO_STRUCT_NAME,
        transactionResult
    });
};
