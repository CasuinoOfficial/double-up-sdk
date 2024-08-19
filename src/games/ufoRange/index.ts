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

// Note: 0 = Over, 1 = Under
export type OverUnderBet = 0 | 1;

// Note: 2 = Inside, 3 = Outside
type InsideOutsideBet = 2 | 3;

export interface RangeInput {
  betTypes: Array<OverUnderBet>;
  coins: TransactionObjectArgument;
  coinType: string;
  partnerNftId?: string;
  range: number[][];
  transaction: TransactionType;
  ufoRangePackageId: string;
  origin?: string;
}

interface InternalRangeDiceInput extends RangeInput {
  partnerNftListId?: string;
}

const isOverUnder = (
  betType: OverUnderBet | InsideOutsideBet
): betType is OverUnderBet => betType === 0 || betType === 1;

const isInsideOutside = (
  betType: OverUnderBet | InsideOutsideBet
): betType is InsideOutsideBet => betType === 2 || betType === 3;

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
  origin
}: InternalRangeDiceInput) => {
    transaction.moveCall({
      target: `${ufoRangePackageId}::${UFORANGE_MODULE_NAME}::play`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        coins,
        transaction.pure(
          bcs.vector(bcs.U64).serialize(betTypes)
        ),
        transaction.pure(
          bcs.vector(bcs.vector(bcs.U64)).serialize(range)
        ),
        transaction.pure.string("DoubleUp")
      ],
    });
}