import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  Transaction,
  TransactionArgument,
} from "@mysten/sui/dist/cjs/transactions";
import { GACHAPON_MODULE_NAME } from "src/constants/mainnetConstants";

export interface CreateGachaponInput {
  cost: number;
  coinType: string;
  initSupplyer: string;
  transaction: Transaction;
}

interface InternalCreateGachaponInput extends CreateGachaponInput {
  gachaponPackageId: string;
}

interface ICloseGachapon {
  gachaponId: string;
  keeperCap: string;
  transaction: Transaction;
}

interface IClaimGachaponTreasury {}

interface IAddEgg {
  isLocked: boolean;
  coinType: string;
  gachaponId: string;
  kioskId: string;
  objectId: string;
  transaction: Transaction;
  gachaponPackageId: string;
}

// Create new gachapon mechine
// Only admin user can create gachapon mechine
export const createGachapon = async ({
  cost,
  coinType,
  initSupplyer,
  transaction,
  gachaponPackageId,
}: InternalCreateGachaponInput) => {
  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::create`,
    typeArguments: [coinType],
    arguments: [
      transaction.pure.u64(cost),
      transaction.pure.address(initSupplyer),
    ],
  });
};

export const closeGachapon = async () => {};

export const claimGachaponTreasury = async () => {};

export const addEgg = async ({
  isLocked,
  coinType,
  gachaponId,
  kioskId,
  objectId,
  transaction,
  gachaponPackageId,
}: IAddEgg) => {
  if (isLocked) {
    // Add locked egg
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::lock`,
      typeArguments: [coinType],
      arguments: [
        transaction.pure.string(coinType),
        transaction.object(kioskId),
        transaction.object(objectId),
      ],
    });
  } else {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
      typeArguments: [coinType],
      arguments: [
        transaction.pure.string(coinType),
        transaction.object(kioskId),
        transaction.object(objectId),
      ],
    });
  }
};

export const addEmptyEgg = async () => {};

export const removeEgg = async () => {};

export const drawEgg = async () => {};

export const destroyEgg = async () => {};

export const claimEgg = async () => {};
