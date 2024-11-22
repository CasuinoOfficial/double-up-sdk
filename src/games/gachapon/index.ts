import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  Transaction,
  TransactionArgument,
} from "@mysten/sui/dist/cjs/transactions";
import { GACHAPON_MODULE_NAME } from "src/constants/mainnetConstants";

interface ICreateGachaponInput {
  cost: number;
  coinType: string;
  initSupplyer: string;
  transaction: Transaction;
  gachaponPackageId: string;
}

interface IClaimGachaponTreasury {}

interface IAddEgg {
  isLocked: boolean;
  coinType: string;
  kioskId: string;
  objectId: string;
  transaction: Transaction;
}

// Create new gachapon mechine
// Only admin user can create gachapon mechine
export const createGachapon = async ({
  cost,
  coinType,
  initSupplyer,
  transaction,
  gachaponPackageId,
}: ICreateGachaponInput) => {
  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::create`,
    typeArguments: [coinType],
    arguments: [
      transaction.pure.u64(cost),
      transaction.pure.address(initSupplyer),
    ],
  });
};

export const claimGachaponTreasury = async () => {};

export const addEgg = async ({
  isLocked,
  coinType,
  kioskId,
  objectId,
  transaction,
}: IAddEgg) => {
  if (isLocked) {
    // Add locked egg
  } else {
  }
};

export const addEmptyEgg = async () => {};

export const removeEgg = async () => {};

export const drawEgg = async () => {};

export const destroyEgg = async () => {};

export const claimEgg = async () => {};
