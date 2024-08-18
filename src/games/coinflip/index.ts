import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { nanoid } from "nanoid";

import {
  COIN_MODULE_NAME,
  COIN_STRUCT_NAME,
  RAND_OBJ,
  UNI_HOUSE_OBJ_ID,
  UNIHOUSE_PACKAGE,
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

// 0: Heads, 1: Tails
export type BetType = 0 | 1;

export interface CoinflipInput {
  betTypes: Array<BetType>;
  coins: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

interface InternalCoinflipInput extends CoinflipInput {
  coinflipPackageId: string;
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

interface InternalCoinflipResultInput extends CoinflipResultInput {
  coinflipCorePackageId: string;
  suiClient: SuiClient;
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
  coins,
  coinflipPackageId,
  coinType,
  transaction,
}: InternalCoinflipInput): CoinflipResponse => {
  const res: CoinflipResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${coinflipPackageId}::${COIN_MODULE_NAME}::play`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object("0x8"),
        transaction.pure(
          bcs.vector(bcs.U64).serialize(betTypes)
        ),
        coins,
        transaction.pure.string("DoubleUp")
      ],
    });

  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

