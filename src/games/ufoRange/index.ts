import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  UFORANGE_MODULE_NAME,
  UNI_HOUSE_OBJ_ID,
  RAND_OBJ_ID,
} from "../../constants";

// Note: 0 = Inside, 1 = Outside
export type InsideOutsideBet = 0 | 1;

export interface RangeInput {
  betTypes: Array<InsideOutsideBet>;
  coins: TransactionObjectArgument;
  coinType: string;
  partnerNftId?: string;
  range: number[][];
  transaction: TransactionType;
  origin?: string;
}

interface InternalRangeDiceInput extends RangeInput {
  partnerNftListId?: string;
  ufoRangePackageId?: string;
}

const isRangeNumber = (range: number | number[]): range is number =>
  typeof range === "number";

const isRangeArray = (range: number | number[]): range is number[] =>
  typeof range[0] === "number";

const MULTIPLIER = 100;

// Start ranged dice game
export const createRange = ({
  betTypes,
  coins,
  coinType,
  partnerNftId,
  partnerNftListId,
  range,
  transaction,
  ufoRangePackageId,
  origin,
}: InternalRangeDiceInput) => {
  transaction.moveCall({
    target: `${ufoRangePackageId}::${UFORANGE_MODULE_NAME}::play`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      coins,
      transaction.pure(bcs.vector(bcs.U64).serialize(betTypes)),
      transaction.pure(bcs.vector(bcs.vector(bcs.U64)).serialize(range)),
      transaction.pure.string("DoubleUp"),
    ],
  });
};
