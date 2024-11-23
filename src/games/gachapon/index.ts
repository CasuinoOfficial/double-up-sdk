import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  Transaction,
  TransactionArgument,
  TransactionResult,
} from "@mysten/sui/dist/cjs/transactions";
import { GACHAPON_MODULE_NAME } from "../../constants/mainnetConstants";

export interface CreateGachaponInput {
  cost: number;
  coinType: string;
  initSupplyer: string;
  transaction: Transaction;
}

interface InternalCreateGachaponInput extends CreateGachaponInput {
  gachaponPackageId: string;
}

interface CloseGachapon {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  kioskId: string;
  transaction: Transaction;
}

interface InternalCloseGachapon extends CloseGachapon {
  gachaponPackageId: string;
}

interface AddEgg {
  isLocked: boolean;
  coinType: string;
  gachaponId: string;
  kioskId: string;
  objectType: string;
  objectId: string;
  transaction: Transaction;
}

interface InternalAddEgg extends AddEgg {
  gachaponPackageId: string;
}

interface RemoveEgg {
  coinType: string;
  gachaponId: string;
  kioskId: string;
  keeperCapId: string;
  index: number;
  transaction: Transaction;
}

interface InternalRemoveEgg extends RemoveEgg {
  gachaponPackageId: string;
}

interface AddEmptyEgg {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  count: number;
  transaction: Transaction;
}

interface InternalAddEmptyEgg extends AddEmptyEgg {
  gachaponPackageId: string;
}

interface ClaimGachaponTreasury {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  transaction: Transaction;
}

interface InternalClaimGachaponTreasury extends ClaimGachaponTreasury {
  gachaponPackageId: string;
}

interface UpdateCost {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  newCost: number;
  transaction: Transaction;
}

interface InternalUpdateCost extends UpdateCost {
  gachaponPackageId: string;
}

interface AddSupplier {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  newSupplierAddress: string;
  transaction: Transaction;
}

interface InternalAddSupplier extends AddSupplier {
  gachaponPackageId: string;
}

interface RemoveSupplier {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  supplierAddress: string;
  transaction: Transaction;
}

interface InternalRemoveSupplier extends RemoveSupplier {
  gachaponPackageId: string;
}

interface DrawEgg {
  coinType: string;
  gachaponId: string;
  count: number;
  recipient: string;
  transaction: Transaction;
}

interface InternalDrawEgg extends DrawEgg {
  gachaponPackageId: string;
}

interface DestroyEgg {
  eggId: string;
  transaction: Transaction;
}

interface InternalDestroyEgg extends DestroyEgg {
  gachaponPackageId: string;
}

interface ClaimEgg {
  coinType: string;
  gachaponId: string;
  kioskId: string;
  eggId: string;
  recipient: string;
  transaction: Transaction;
}

interface InternalClaimEgg extends ClaimEgg {
  gachaponPackageId: string;
}
// Create new gachapon mechine
// Only admin user can create gachapon mechine
export const createGachapon = ({
  cost,
  coinType,
  initSupplyer,
  transaction,
  gachaponPackageId,
}: InternalCreateGachaponInput): TransactionResult => {
  transaction.setGasBudget(100_000_000);

  const newGachapon = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::create`,
    typeArguments: [coinType],
    arguments: [
      transaction.pure.u64(cost),
      transaction.pure.address(initSupplyer),
    ],
  });

  return newGachapon;
};

export const closeGachapon = ({
  coinType,
  gachaponId,
  keeperCapId,
  kioskId,
  transaction,
  gachaponPackageId,
}: InternalCloseGachapon) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::close`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.object(kioskId),
    ],
  });
};

export const addEgg = ({
  isLocked,
  coinType,
  gachaponId,
  kioskId,
  objectType,
  objectId,
  transaction,
  gachaponPackageId,
}: InternalAddEgg) => {
  transaction.setGasBudget(100_000_000);

  if (isLocked) {
    // Add locked egg
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::lock`,
      typeArguments: [coinType, objectType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskId),
        transaction.object(objectId),
      ],
    });
  } else {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
      typeArguments: [coinType, objectType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskId),
        transaction.object(objectId),
      ],
    });
  }
};

export const removeEgg = ({
  coinType,
  gachaponId,
  kioskId,
  keeperCapId,
  index,
  transaction,
  gachaponPackageId,
}: InternalRemoveEgg) => {
  transaction.setGasBudget(100_000_000);

  const removedEgg = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::take`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(kioskId),
      transaction.object(keeperCapId),
      transaction.pure.u64(index),
    ],
  });

  return removedEgg;
};

export const addEmptyEgg = ({
  coinType,
  gachaponId,
  keeperCapId,
  count,
  transaction,
  gachaponPackageId,
}: InternalAddEmptyEgg) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::stuff`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.pure.u64(count),
    ],
  });
};

export const claimGachaponTreasury = ({
  coinType,
  gachaponId,
  keeperCapId,
  transaction,
  gachaponPackageId,
}: InternalClaimGachaponTreasury) => {
  transaction.setGasBudget(100_000_000);

  const treasury = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::claim`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });

  return treasury;
};

export const updateCost = () => {};

export const drawEgg = async () => {};

export const destroyEgg = async () => {};

export const claimEgg = async () => {};
