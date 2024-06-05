import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from "axios";
import { nanoid } from 'nanoid';

import { 
  BLS_VERIFIER_OBJ,
  DICE_CORE_PACKAGE_ID,
  DICE_MODULE_NAME,
  DICE_STRUCT_NAME,
  DOUBLE_UP_API,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getBlsGameInfos } from "../../utils";

// Note: 0 - 5 for dice rolls, and 6 = odd, 7 = even, 8 = small, 9 = big
type BetType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type DiceResult = any;

export interface DiceInput {
    betType: BetType;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalDiceInput extends DiceInput {
    dicePackageId: string;
}

export interface DiceResultInput {
    betType: BetType;
    coinType: string;
    gameSeed: string;
    transactionResult: SuiTransactionBlockResponse;
}

export interface DiceResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface DiceResultResponse {
    ok: boolean;
    err?: Error;
    results?: DiceResult[];
}

// Add dice to the transaction block
export const createDice = ({
    betType,
    coin,
    coinType,
    dicePackageId,
    transactionBlock
}: InternalDiceInput): DiceResponse => {
    const res: DiceResponse = { ok: true };

    try {
        // This adds some extra entropy to the dice itself
        const userRandomness = Buffer.from(nanoid(512), 'utf8');

        const [receipt] = transactionBlock.moveCall({
            target: `${dicePackageId}::${DICE_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
            transactionBlock.object(UNI_HOUSE_OBJ),
            transactionBlock.object(BLS_VERIFIER_OBJ),
            transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
            transactionBlock.pure(betType),
            coin,
            ],    
        });

        res.gameSeed = Buffer.from(userRandomness).toString("hex");
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getDiceResult = async ({
    betType,
    coinType,
    gameSeed,
    transactionResult
}: DiceResultInput): Promise<DiceResultResponse> => {
    const res: DiceResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfos({
            coinType,
            corePackageId: DICE_CORE_PACKAGE_ID,
            gameSeed,
            moduleName: DICE_MODULE_NAME,
            structName: DICE_STRUCT_NAME,
            transactionResult
        });

        const settlement = await axios.post(`${DOUBLE_UP_API}/bls`, {
            coinType,
            gameInfos,
            gameName: DICE_MODULE_NAME
        });

        console.log(settlement)

        if (!settlement.data.results) {
            throw new Error('could not determine results');
        }

        const results = [];

        for (const gameResult of settlement.data.results) {
            console.log(gameResult);
        }

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
