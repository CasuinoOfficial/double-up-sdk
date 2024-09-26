import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  CLOCK_OBJ_ID,
  COIN_MODULE_NAME,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  RAND_OBJ_ID,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import { getAssetIndex, getTypesFromVoucher, getVoucherBank } from "../../utils";

// 0: Heads, 1: Tails
export type BetType = 0 | 1;

export interface CoinflipInput {
  betTypes: Array<BetType>;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
  origin?: string;
}

interface InternalCoinflipInput extends CoinflipInput {
  coinflipPackageId: string;
}

export interface CoinflipVoucherInput {
  betTypes: Array<BetType>;
  betSize: number;
  voucherId: string;
  transaction: TransactionType;
  origin?: string;
}

interface InternalCoinflipVoucherInput extends CoinflipVoucherInput {
  coinflipPackageId: string;
  client: SuiClient;
}

interface CoinflipSettlement {
  bet_size: string;
  payout_amount: string;
  player_won: boolean;
  win_condition: WinCondition;
}

interface CoinflipParsedJson {
  bet_id: string;
  outcome: string;
  player: string;
  settlements: CoinflipSettlement[];
}

export interface CoinflipResultInput {
  betType: BetType;
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

export interface CoinflipResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface CoinflipResultResponse {
  ok: boolean;
  err?: Error;
  results?: BetType[];
  rawResults?: CoinflipParsedJson[];
  txDigests?: string[];
}

interface WinCondition {
  vec: WinRange[];
}

interface WinRange {
  from: string;
  to: string;
}

// Add coinflip to the transaction block
export const createCoinflip = ({
  betTypes,
  coin,
  coinflipPackageId,
  coinType,
  transaction,
  origin
}: InternalCoinflipInput) => {
  let assetIndex = getAssetIndex(coinType);
  transaction.setGasBudget(20_000_000);
  transaction.moveCall({
    target: `${coinflipPackageId}::${COIN_MODULE_NAME}::play_0`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      transaction.pure(
        bcs.vector(bcs.U64).serialize(betTypes)
      ),
      coin,
      transaction.pure.string(origin ?? "DoubleUp"),
      transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
      transaction.object(SUILEND_MARKET),
      transaction.object(CLOCK_OBJ_ID),
      transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
      transaction.pure.u64(assetIndex),
    ],
  });
};

export const createCoinflipWithVoucher = async ({
  betTypes,
  betSize,
  voucherId,
  client,
  coinflipPackageId,
  transaction,
  origin
}: InternalCoinflipVoucherInput) => {
  try {
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let assetIndex = getAssetIndex(coinType);
    let voucherBank = getVoucherBank(coinType);
    transaction.setGasBudget(20_000_000);
    transaction.moveCall({
      target: `${coinflipPackageId}::${COIN_MODULE_NAME}::play_with_voucher_0`,
      typeArguments: [coinType, voucherType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        transaction.pure(
          bcs.vector(bcs.U64).serialize(betTypes)
        ),
        transaction.pure.u64(betSize),
        transaction.object(voucherId),
        transaction.object(voucherBank),
        transaction.pure.string(origin ?? "DoubleUp"),
        transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
        transaction.object(SUILEND_MARKET),
        transaction.object(CLOCK_OBJ_ID),
        transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
        transaction.pure.u64(assetIndex),
      ],
    });
  } catch (e) {
    console.error(e);
  }
};