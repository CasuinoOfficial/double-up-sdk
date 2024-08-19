import {
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { PLINKO_MODULE_NAME, RAND_OBJ_ID, UNI_HOUSE_OBJ_ID } from "../../constants";

interface PlinkoGameResults {
  ballIndex: string;
  ballPath: number[];
}

interface PlinkoParsedGameResults {
  ball_index: string;
  ball_path: number[];
}

interface PlinkoResult {
  ballCount: string;
  betSize: string;
  challenged: boolean;
  gameId: string;
  gameType: PlinkoType;
  player: string;
  pnl: string;
  results: PlinkoGameResults[];
}

interface PlinkoParsedJson {
  ball_count: string;
  bet_size: string;
  challenged: boolean;
  game_id: string;
  game_type: PlinkoType;
  player: string;
  pnl: string;
  results: PlinkoParsedGameResults[];
}

// 0: 6 Rows, 1: 9 Rows, 2: 12 Rows
type PlinkoType = 0 | 1 | 2;

export interface PlinkoInput {
  betAmount: number;
  coin: TransactionObjectArgument;
  coinType: string;
  numberOfDiscs: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin?: string; 
}

interface InternalPlinkoInput extends PlinkoInput {
  plinkoPackageId: string;
}

export interface PlinkoResultInput {
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

export interface PlinkoResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface PlinkoResultResponse {
  ok: boolean;
  err?: Error;
  results?: PlinkoResult[];
  rawResults?: PlinkoParsedJson[];
  txDigests?: string[];
}

export const createSinglePlinko = ({
  coin,
  coinType,
  numberOfDiscs,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin
}: InternalPlinkoInput) => {
  transaction.moveCall({
    target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(numberOfDiscs),
      transaction.pure.u8(plinkoType),
      transaction.pure.string(origin ?? "DoubleUp"),
      coin,
    ],
  });
};