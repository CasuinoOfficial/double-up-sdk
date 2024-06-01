import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from "axios";
import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  DICE_MODULE_NAME,
  DICE_STRUCT_NAME,
  DOUBLE_UP_API,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericBlsGameResult } from "../../utils";

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
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalDiceResultInput extends DiceResultInput {
    dicePackageId: string;
    suiClient: SuiClient;
}

export interface DiceResponse {
    ok: boolean;
    err?: Error;
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
        const userRandomness = randomBytes(512);

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
    dicePackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalDiceResultInput): Promise<DiceResultResponse> => {
    const res: DiceResultResponse = { ok: true };

    try {
        const { ok, err, events } = await getGenericBlsGameResult({
            coinType,
            moduleName: DICE_MODULE_NAME,
            packageId: dicePackageId,
            pollInterval,
            suiClient,
            structName: DICE_STRUCT_NAME,
            transactionResult
        });

        if (!ok) {
            throw err;
        }

        const settlement = await axios.post(`${DOUBLE_UP_API}/bls`, {
            coinType,
            gameInfos: events,
            gameName: DICE_MODULE_NAME
        });

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
