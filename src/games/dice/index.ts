import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  DICE_MODULE_NAME,
  DICE_STRUCT_NAME,
  UNI_HOUSE_OBJ
} from "../../constants";
import { getGenericGameResult } from "../../utils";

// Note: 0 - 5 for dice rolls, and 6 = odd, 7 = even, 8 = small, 9 = big 
export interface DiceInput {
    betType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7| 8 | 9;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalDiceInput extends DiceInput {
    dicePackageId: string;
}

export interface DiceGameIdInput {
    coinType: string;
    pollInterval?: number;
    transactionResult: any;
}

interface InternalDiceGameIdInput extends DiceGameIdInput {
    dicePackageId: string;
    suiClient: SuiClient;
}

export interface DiceResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
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

export const getDiceGameResult = async ({
    coinType,
    dicePackageId,
    pollInterval,
    suiClient,
    transactionResult
}: InternalDiceGameIdInput) => {
    return getGenericGameResult({
        coinType,
        moduleName: DICE_MODULE_NAME,
        packageId: dicePackageId,
        pollInterval,
        suiClient,
        structName: DICE_STRUCT_NAME,
        transactionResult
    });
};
