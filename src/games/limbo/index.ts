import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
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
  LIMBO_SETTINGS,
  RAND_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import {
  getAssetIndex,
  getTypesFromVoucher,
  getVoucherBank,
} from "../../utils";

type LimboResult = number;

interface LimboGameResults {
  bet_returned: string;
  bet_size: string;
  outcome: string;
}

export interface LimboInput {
  coin: TransactionObjectArgument;
  coinType: string;
  multipliers: number[];
  transaction: TransactionType;
  origin?: string;
}

export interface LimboVoucherInput {
  multipliers: number[];
  betSize: number;
  voucherId: string;
  transaction: TransactionType;
  origin?: string;
}

interface InternalLimboVoucherInput extends LimboVoucherInput {
  limboPackageId: string;
  client: SuiClient;
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
  coin,
  coinType,
  limboPackageId,
  multipliers,
  transaction,
  origin,
}: InternalLimboInput) => {
  for (let num of multipliers) {
    if (
      Number(num) < Number(LIMBO_MIN_MULTIPLIER) ||
      Number(num) > Number(LIMBO_MAX_MULTIPLIER)
    ) {
      throw new Error("Multiplier out of range");
    }
  }
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${limboPackageId}::${LIMBO_MODULE_NAME}::play`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(LIMBO_SETTINGS),
      transaction.object(RAND_OBJ_ID),
      coin,
      transaction.pure(bcs.vector(bcs.U64).serialize(multipliers)),
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};

export const createLimboWithVoucher = async ({
  voucherId,
  betSize,
  client,
  limboPackageId,
  multipliers,
  transaction,
  origin,
}: InternalLimboVoucherInput) => {
  try {
    for (let num of multipliers) {
      if (
        Number(num) < Number(LIMBO_MIN_MULTIPLIER) ||
        Number(num) > Number(LIMBO_MAX_MULTIPLIER)
      ) {
        throw new Error("Multiplier out of range");
      }
    }
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let voucherBank = getVoucherBank(coinType);
    transaction.setGasBudget(100_000_000);

    transaction.moveCall({
      target: `${limboPackageId}::${LIMBO_MODULE_NAME}::play_with_voucher`,
      typeArguments: [coinType, voucherType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(betSize),
        transaction.object(voucherId),
        transaction.object(voucherBank),
        transaction.pure(bcs.vector(bcs.U64).serialize(multipliers)),
        transaction.pure.string(origin ?? "DoubleUp"),
      ],
    });
  } catch (e) {
    console.error(e);
  }
};
