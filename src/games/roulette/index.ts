import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { nanoid } from 'nanoid';

import {
    BLS_SETTLER_MODULE_NAME,
    BLS_VERIFIER_OBJ,
    ROULETTE_CONFIGS,
    ROULETTE_MODULE_NAME,
    ROULETTE_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE,
    RouletteConfig
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

type BetRed = 0;
type BetBlack = 1;

type BetNumber = 2;

type BetEven = 3;
type BetOdd = 4;

type BetFirstTwelve = 5;
type BetSecondTwelve = 6;
type BetThirdTwelve = 7;

type BetFirstEighteen = 8;
type BetSecondEighteen = 9;

type BetFirstColumn = 10;
type BetSecondColumn = 11;
type BetThirdColumn = 12;

type RouletteBet = BetRed | BetBlack | BetNumber | BetEven | BetOdd | BetFirstTwelve | BetSecondTwelve | BetThirdTwelve | BetFirstEighteen | BetSecondEighteen | BetFirstColumn | BetSecondColumn | BetThirdColumn;

export interface CreatedRouletteTableInput {
    coinType: string;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalCreatedRouletteTableInput extends CreatedRouletteTableInput {
    roulettePackageId: string;
}

export interface CreatedRouletteTableResponse {
    ok: boolean;
    err?: Error;
    result?: RouletteTable;
}

interface RouletteTable {
    tableId: string;
}

export interface RouletteAddBetInput {
    address: string;
    betNumber?: number;
    betType: RouletteBet;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteAddBetInput extends RouletteAddBetInput {
    origin: string;
    roulettePackageId: string;
}

export interface RouletteAddBetResponse {
    ok: boolean;
    err?: Error;
}

export interface RouletteTableInput {
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteTableInput extends RouletteTableInput {
    roulettePackageId: string;
}

export interface RouletteTableResponse {
    ok: boolean;
    err?: Error;
    result?: TransactionArgument;
}

export interface RouletteTableExistsInput {
    address: string;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteTableExistsInput extends RouletteTableExistsInput {
    roulettePackageId: string;
}

export interface RouletteTableExistsResponse {
    ok: boolean;
    err?: Error;
    result?: TransactionArgument;
}

const getRouletteConfig = (coinType: string): RouletteConfig | undefined => (
    ROULETTE_CONFIGS.find(config => config.coinType === coinType)
);

const isBetNumber = (betType: RouletteBet): betType is BetNumber => betType === 2;

export const addRouletteBet = ({
    address,
    betNumber,
    betType,
    coin,
    coinType,
    origin,
    roulettePackageId,
    transactionBlock
}: InternalRouletteAddBetInput): RouletteAddBetResponse => {
    const res: RouletteAddBetResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        if (isBetNumber(betType)) {
            if (!betNumber) {
                throw new Error('invalid roulette bet');
            } else if (betNumber > 37) {
                throw new Error('roulette bet number is too high');
            }
        } else {
            if (!!betNumber) {
                throw new Error('invalid roulette bet');
            }
        }

        transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::add_bet`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(rouletteConfig.objectId),
                transactionBlock.pure(address, 'address'),
                coin,
                transactionBlock.pure(betType),
                transactionBlock.pure(betNumber ? [betNumber] : []),
                transactionBlock.pure(origin)
            ]
        });
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

// Add roulette to the transaction block
export const createRouletteTable = ({
    coinType,
    roulettePackageId,
    transactionBlock
}: InternalRouletteTableInput): RouletteTableResponse => {
    const res: RouletteTableResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const [table] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::create_roulette_table`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(rouletteConfig.objectId)
            ]
        });

        res.result = table;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
}

export const doesRouletteTableExist = ({
    address,
    coinType,
    roulettePackageId,
    transactionBlock
}: InternalRouletteTableExistsInput): RouletteTableExistsResponse => {
    const res: RouletteTableExistsResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const [exists] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::table_exists`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(rouletteConfig.objectId),
                transactionBlock.pure(address)
            ]
        });

        res.result = exists;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getCreatedRouletteTable = ({
    coinType,
    roulettePackageId,
    transactionResult
}: InternalCreatedRouletteTableInput): CreatedRouletteTableResponse => {
    const res: CreatedRouletteTableResponse = { ok: true };

    try {
        const tableId = transactionResult.objectChanges.reduce((acc, current) => {
            if (current.type === 'created' && current.objectType === `${roulettePackageId}::${ROULETTE_MODULE_NAME}::RouletteTable<${coinType}>`) {
                acc = current.objectId;
            }

            return acc;
        }, '');

        if (tableId.length === 0) {
            throw new Error('could not find roulette table');
        }

        res.result = { tableId };
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
