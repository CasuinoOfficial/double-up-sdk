import {
  Transaction as TransactionType,
  TransactionObjectArgument,
  Transaction,
} from "@mysten/sui/transactions";
import {
  MARBLE_RACING_PACKAGE_ID,
  MARBLE_RACING_CONFIG,
  UNI_HOUSE_OBJ_ID,
  MARBLE_RACING_ADMIN_CAP,
} from "../../constants/mainnetConstants";
import { bcs } from "@mysten/sui/bcs";

export interface AddBetInput {
  raceId: string;
  betCoin: TransactionObjectArgument;
  betCoinType: string;
  marbleIds: number[];
  rankIndexes: number[];
  transaction: TransactionType;
}

export interface AddRiskLimitInput {
  riskLimit: number;
  coinType: string;
  transaction: TransactionType;
}

export interface AddManagerInput {
  manager: string;
  transaction: TransactionType;
}

export interface UpdateStatusInput {
  raceId: string;
  status: number;
  transaction: TransactionType;
}

export const addBet = async ({
  raceId,
  betCoin,
  betCoinType,
  marbleIds,
  rankIndexes,
  transaction,
}: AddBetInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::add_bet`,
    typeArguments: [betCoinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.pure.id(raceId),
      betCoin,
      transaction.pure(bcs.vector(bcs.U64).serialize(marbleIds)),
      transaction.pure(bcs.vector(bcs.U8).serialize(rankIndexes)),
      transaction.object("0x6"),
    ],
  });
};

export const addRiskLimit = async ({
  riskLimit,
  coinType,
  transaction,
}: AddRiskLimitInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::add_risk_limit`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(riskLimit),
    ],
  });
};

export const addManager = async ({ manager, transaction }: AddManagerInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::add_manager`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.address(manager),
    ],
  });
};

export const updateStatus = async ({
  raceId,
  status,
  transaction,
}: UpdateStatusInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::update_status`,
    arguments: [
      transaction.object(raceId),
      transaction.pure.u64(status),
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object("0x6"),
    ],
  });
};
