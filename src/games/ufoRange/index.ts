import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  UFORANGE_MODULE_NAME,
  UNI_HOUSE_OBJ_ID,
  RAND_OBJ_ID,
  CLOCK_OBJ_ID,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  SUILEND_ASSET_LIST,
} from "../../constants/mainnetConstants";
import {
  getAssetIndex,
  getTypesFromVoucher,
  getVoucherBank,
} from "../../utils";
import { SuiClient } from "@mysten/sui/dist/cjs/client";

// Note: 0 = Inside, 1 = Outside
export type InsideOutsideBet = 0 | 1;

export interface RangeInput {
  betTypes: Array<InsideOutsideBet>;
  coin: TransactionObjectArgument;
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

export interface RangeVoucherInput {
  betTypes: Array<InsideOutsideBet>;
  betSize: number;
  voucherId: string;
  range: number[][];
  transaction: TransactionType;
  origin?: string;
}

interface InternalRangeVoucherInput extends RangeVoucherInput {
  ufoRangePackageId: string;
  client: SuiClient;
}

const isRangeNumber = (range: number | number[]): range is number =>
  typeof range === "number";

const isRangeArray = (range: number | number[]): range is number[] =>
  typeof range[0] === "number";

const MULTIPLIER = 100;

// Start ranged dice game
export const createRange = ({
  betTypes,
  coin,
  coinType,
  partnerNftId,
  partnerNftListId,
  range,
  transaction,
  ufoRangePackageId,
  origin,
}: InternalRangeDiceInput) => {
  let assetIndex = getAssetIndex(coinType);
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${ufoRangePackageId}::${UFORANGE_MODULE_NAME}::play`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      coin,
      transaction.pure(bcs.vector(bcs.U64).serialize(betTypes)),
      transaction.pure(bcs.vector(bcs.vector(bcs.U64)).serialize(range)),
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};

export const createRangeWithVoucher = async ({
  betTypes,
  betSize,
  voucherId,
  client,
  range,
  transaction,
  ufoRangePackageId,
  origin,
}: InternalRangeVoucherInput) => {
  try {
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let voucherBank = getVoucherBank(coinType);
    transaction.setGasBudget(100_000_000);

    transaction.moveCall({
      target: `${ufoRangePackageId}::${UFORANGE_MODULE_NAME}::play_with_voucher`,
      typeArguments: [coinType, voucherType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(betSize),
        transaction.object(voucherId),
        transaction.object(voucherBank),
        transaction.pure(bcs.vector(bcs.U64).serialize(betTypes)),
        transaction.pure(bcs.vector(bcs.vector(bcs.U64)).serialize(range)),
        transaction.pure.string(origin ?? "DoubleUp"),
      ],
    });
  } catch (e) {
    console.error(e);
  }
};
