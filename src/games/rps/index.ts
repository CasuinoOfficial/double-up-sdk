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
  RAND_OBJ_ID,
  RPS_MODULE_NAME,
  RPS_STRUCT_NAME,
  UNI_HOUSE_OBJ_ID,
} from "../../constants";
// import { getBlsGameInfosWithDraw, sleep } from "../../utils";
import { KioskClient } from "@mysten/kiosk";

// 0: Rock, 1: Paper, 2: Scissors
export type BetType = 0 | 1 | 2;

export interface RPSInput {
  betTypes: Array<BetType>;
  coins: TransactionObjectArgument; // This should be a vector of coins already
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
  coins,
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

    if (
      typeof partnerNftListId === "string" &&
      typeof partnerNftType === "string" &&
      nfts !== undefined
    ) {
      console.log('partner');
      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::start_game_with_partner`,
        typeArguments: [coinType, partnerNftType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure(
            bcs.vector(bcs.U64).serialize(betTypes)
          ),
          coins,
          transaction.object(partnerNftListId),
          transaction.object(kioskId),
          transaction.object(kioskOwnerCap),
          nfts,
          transaction.pure.string(origin ?? "DoubleUp")
        ],
      });

    } else {
      console.log('normal');

      transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::play`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure(
            bcs.vector(bcs.U64).serialize(betTypes)
          ),
          coins,
          transaction.pure.string(origin ?? "DoubleUp")
        ],
      });
    }
};