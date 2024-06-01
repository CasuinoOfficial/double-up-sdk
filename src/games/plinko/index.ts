import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from "axios";
import { randomBytes } from 'crypto-browserify';

import {
    DOUBLE_UP_API,
    PLINKO_MODULE_NAME,
    PLINKO_VERIFIER_ID,
    UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericGameResult } from "../../utils";

type PlinkoResult = any;

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

export interface PlinkoResultInput {
    coinType: string;
    pollInterval: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalPlinkoResultInput extends PlinkoResultInput {
    plinkoPackageId: string;
    suiClient: SuiClient;
}

export interface PlinkoResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

export interface PlinkoResultResponse {
    ok: boolean;
    err?: Error;
    results?: PlinkoResult[];
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

export const getPlinkoResult = async ({
    coinType,
    plinkoPackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalPlinkoResultInput): Promise<PlinkoResultResponse> => {
    const res: PlinkoResultResponse = { ok: true };

    try {
        const { ok, err, events } = await getGenericGameResult({
            coinType,
            moduleName: PLINKO_MODULE_NAME,
            packageId: plinkoPackageId,
            pollInterval,
            suiClient,
            transactionResult
        });

        if (!ok) {
            throw err;
        }

        const settlement = await axios.post(`${DOUBLE_UP_API}/plinko`, {
            coinType,
            gameInfos: events,
            gameName: PLINKO_MODULE_NAME
        });

        if (!settlement.data.results) {
            throw new Error('could not determine results');
        }

        const results = [];

        for (const gameResult of settlement.data.results) {
            results.push({
                ballCount: gameResult.ball_count,
                betSize: gameResult.bet_size,
                pnl: gameResult.pnl
            });
        }

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
