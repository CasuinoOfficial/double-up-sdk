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
  betType: number;
  targets: number[];
  ranges: number[][];
  transaction: TransactionType;
}

export interface AddRiskLimitInput {
  riskLimit: number;
  coinType: string;
  transaction: TransactionType;
}

export interface RemoveRiskLimitInput {
  coinType: string;
  transaction: TransactionType;
}

export interface VersionControlInput {
  version: number;
  transaction: TransactionType;
}

export interface AddManagerInput {
  manager: string;
  transaction: TransactionType;
}

export interface RemoveManagerInput {
  manager: string;
  transaction: TransactionType;
}

export interface SetHouseEdgeInput {
  houseEdge: number;
  transaction: TransactionType;
}

export interface SetPaginationLimitInput {
  limit: number;
  transaction: TransactionType;
}

export interface SetMaxComboInput {
  maxCombo: number;
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
  betType,
  targets,
  ranges,
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
      transaction.pure.u8(betType),
      transaction.pure(bcs.vector(bcs.U64).serialize(targets)),
      transaction.pure(bcs.vector(bcs.vector(bcs.U64)).serialize(ranges)),
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

export const removeRiskLimit = async ({
  coinType,
  transaction,
}: RemoveRiskLimitInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::remove_risk_limit`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
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

export const removeManager = async ({
  manager,
  transaction,
}: RemoveManagerInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::remove_manager`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.address(manager),
    ],
  });
};

export const addVersion = async ({
  version,
  transaction,
}: VersionControlInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::add_version`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(version),
    ],
  });
};

export const removeVersion = async ({
  version,
  transaction,
}: VersionControlInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::remove_version`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(version),
    ],
  });
};

export const setHouseEdge = async ({
  houseEdge,
  transaction,
}: SetHouseEdgeInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::set_house_edge`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(houseEdge),
    ],
  });
};

export const setPaginationLimit = async ({
  limit,
  transaction,
}: SetPaginationLimitInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::set_page_size`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(limit),
    ],
  });
};

export const setMaxCombo = async ({
  maxCombo,
  transaction,
}: SetMaxComboInput) => {
  transaction.moveCall({
    target: `${MARBLE_RACING_PACKAGE_ID}::marble_racing::set_max_combo`,
    arguments: [
      transaction.object(MARBLE_RACING_CONFIG),
      transaction.object(MARBLE_RACING_ADMIN_CAP),
      transaction.pure.u64(maxCombo),
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
