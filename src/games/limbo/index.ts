import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  LIMBO_MAX_MULTIPLIER,
  LIMBO_MIN_MULTIPLIER,
  LIMBO_MODULE_NAME,
  RAND_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants";

type LimboResult = number;

interface LimboGameResults {
  bet_returned: string;
  bet_size: string;
  outcome: string;
}

export interface LimboInput {
  coins: TransactionObjectArgument;
  coinType: string;
  multipliers: number[];
  transaction: TransactionType;
  origin?: string; 
}

interface LimboParsedJson {
  game_id: string;
  player: string;
  results: LimboGameResults[];
}

interface InternalLimboInput extends LimboInput {
  limboPackageId: string;
}

export interface LimboResultInput {
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

export interface LimboResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface LimboResultResponse {
  ok: boolean;
  err?: Error;
  results?: LimboResult[];
  rawResults?: LimboParsedJson[];
  txDigests?: string[];
}

// Weighted flip where the user can select how much multiplier they want.
// Note that the multiplers are passed in as integers and not a decimal representation i.e. 1.01 = 101
export const createLimbo = ({
  coins,
  coinType,
  limboPackageId,
  multipliers,
  transaction,
  origin
}: InternalLimboInput) => {
    for (let num of multipliers) {
      if (
        Number(num) < Number(LIMBO_MIN_MULTIPLIER) ||
        Number(num) > Number(LIMBO_MAX_MULTIPLIER)
      ) {
        throw new Error("Multiplier out of range");
      }
    };
    transaction.moveCall({
      target: `${limboPackageId}::${LIMBO_MODULE_NAME}::play`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        coins,
        transaction.pure(
          bcs.vector(bcs.U64).serialize(multipliers)
        ),
        transaction.pure.string(origin ?? "DoubleUp")
      ],
    });
};
