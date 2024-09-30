import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { KioskOwnerCap, KioskTransaction } from "@mysten/kiosk";

import { randomBytes } from "crypto";

import {
  CLOCK_OBJ_ID,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  RAND_OBJ_ID,
  RPS_MODULE_NAME,
  SUILEND_ASSET_LIST,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import { KioskClient } from "@mysten/kiosk";
import { getAssetIndex, getTypesFromVoucher, getVoucherBank } from "../../utils";

// 0: Rock, 1: Paper, 2: Scissors
export type BetType = 0 | 1 | 2;

export interface RPSInput {
  betTypes: Array<BetType>;
  coin: TransactionObjectArgument; 
  coinType: string;
  partnerNftType?: string;
  nfts?: TransactionArgument;
  kioskId?: string;
  kioskOwnerCap?: string; 
  origin?: string;
  transaction: TransactionType;
}

interface InternalRPSInput extends RPSInput {
  partnerNftListId?: string;
  rpsPackageId: string;
}

export interface RPSVoucherInput {
  betTypes: Array<BetType>;
  betSize: number;
  voucherId: string;
  origin?: string;
  transaction: TransactionType;
}

interface InternalRPSVoucherInput extends RPSVoucherInput {
  rpsPackageId: string;
  client: SuiClient;
}

interface RPSSettlement {
  bet_size: string;
  payout_amount: string;
  player_won: boolean;
  win_condition: WinCondition;
}

interface RPSParsedJson {
  bet_id: string;
  outcome: string;
  player: string;
  settlements: RPSSettlement[];
}

export interface RPSResultInput {
  betType: BetType;
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalRPSResultInput extends RPSResultInput {
  rpsCorePackageId: string;
  suiClient: SuiClient;
}

export interface RPSResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface RPSResultResponse {
  ok: boolean;
  err?: Error;
  results?: BetType[];
  rawResults?: RPSParsedJson[];
  txDigests?: string[];
}

interface WinCondition {
  vec: WinRange[];
}

interface WinRange {
  from: string;
  to: string;
}

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

// Add rps to the transaction block
export const createRockPaperScissors = ({
  betTypes,
  coin,
  coinType,
  partnerNftType,
  kioskId,
  kioskOwnerCap,
  nfts,
  partnerNftListId,
  rpsPackageId,
  transaction,
  origin
}: InternalRPSInput) => {
  let assetIndex = getAssetIndex(coinType);
  transaction.setGasBudget(100_000_000);

  if (
    typeof partnerNftListId === "string" &&
    typeof partnerNftType === "string" &&
    nfts !== undefined
  ) {

    if (coinType in SUILEND_ASSET_LIST) {
      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::play_with_partner_0`,
        typeArguments: [coinType, partnerNftType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure(
            bcs.vector(bcs.U64).serialize(betTypes)
          ),
          coin,
          transaction.object(partnerNftListId),
          transaction.object(kioskId),
          transaction.object(kioskOwnerCap),
          nfts,
          transaction.pure.string(origin ?? "DoubleUp"),
          transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
          transaction.object(SUILEND_MARKET),
          transaction.object(CLOCK_OBJ_ID),
          transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
          transaction.pure.u64(assetIndex),
        ],
      });
    } else {
      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::play_with_partner`,
        typeArguments: [coinType, partnerNftType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure(
            bcs.vector(bcs.U64).serialize(betTypes)
          ),
          coin,
          transaction.object(partnerNftListId),
          transaction.object(kioskId),
          transaction.object(kioskOwnerCap),
          nfts,
          transaction.pure.string(origin ?? "DoubleUp"),
        ],
      });
    };
  } else {

    if (coinType in SUILEND_ASSET_LIST) {
      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::play_0`,
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
    } else {
      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::play`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure(
            bcs.vector(bcs.U64).serialize(betTypes)
          ),
          coin,
          transaction.pure.string(origin ?? "DoubleUp"),
        ],
      });
    }
  }
};

export const createRockPaperScissorsWithVoucher = async ({
  betTypes,
  betSize,
  voucherId,
  client,
  rpsPackageId,
  transaction,
  origin
}: InternalRPSVoucherInput) => {
  try {
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let assetIndex = getAssetIndex(coinType);
    let voucherBank = getVoucherBank(coinType);
    transaction.setGasBudget(20_000_000);
    transaction.moveCall({
      target: `${rpsPackageId}::${RPS_MODULE_NAME}::play_with_voucher_0`,
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