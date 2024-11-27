import {
  SuiClient,
  SuiObjectData,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionResult,
} from "@mysten/sui/dist/cjs/transactions";
import {
  GACHAPON_CORE_PACKAGE_ID,
  GACHAPON_MODULE_NAME,
  RAND_OBJ_ID,
} from "../../constants/mainnetConstants";

export interface CreateGachaponInput {
  cost: number;
  coinType: string;
  initSupplyer: string;
  transaction: Transaction;
}

interface InternalCreateGachaponInput extends CreateGachaponInput {
  gachaponPackageId: string;
}

export interface CloseGachapon {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  kioskId: string;
  transaction: Transaction;
}

interface InternalCloseGachapon extends CloseGachapon {
  gachaponPackageId: string;
}

export interface AddEgg {
  address: string;
  gachaponId: string;
  objectId: string;
  transaction: Transaction;
}

interface InternalAddEgg extends AddEgg {
  suiClient: SuiClient;
  gachaponPackageId: string;
}

export interface RemoveEgg {
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

export interface AddEmptyEgg {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  count: number;
  transaction: Transaction;
}

interface InternalAddEmptyEgg extends AddEmptyEgg {
  gachaponPackageId: string;
}

export interface ClaimGachaponTreasury {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  transaction: Transaction;
}

interface InternalClaimGachaponTreasury extends ClaimGachaponTreasury {
  gachaponPackageId: string;
}

export interface UpdateCost {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  newCost: number;
  transaction: Transaction;
}

interface InternalUpdateCost extends UpdateCost {
  gachaponPackageId: string;
}

export interface AddSupplier {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  newSupplierAddress: string;
  transaction: Transaction;
}

interface InternalAddSupplier extends AddSupplier {
  gachaponPackageId: string;
}

export interface RemoveSupplier {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  supplierAddress: string;
  transaction: Transaction;
}

interface InternalRemoveSupplier extends RemoveSupplier {
  gachaponPackageId: string;
}

export interface DrawEgg {
  coinType: string;
  coin: TransactionObjectArgument;
  gachaponId: string;
  count: number;
  recipient: string;
  transaction: Transaction;
}

interface InternalDrawEgg extends DrawEgg {
  gachaponPackageId: string;
}

export interface DestroyEgg {
  eggId: string;
  transaction: Transaction;
}

interface InternalDestroyEgg extends DestroyEgg {
  gachaponPackageId: string;
}

export interface ClaimEgg {
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

export interface CreateFreeSpinner {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  transaction: Transaction;
}

interface InternalCreateFreeSpinner extends CreateFreeSpinner {
  gachaponPackageId: string;
}

export interface AddNftType {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  transaction: Transaction;
}

type KeeperCap = { id: string; gachaponId: string };

export type AdminGachapon = {
  id: string;
  keeperCapId: string;
  kioskId: string;
  coinType: string;
  cost: number;
  suppliers: string[];
  lootbox: {
    id: string;
    eggCounts: string;
  };
  treasury: string;
};

export type AdminGachapons = {
  [key: string]: AdminGachapon;
};
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

const getKeeperData = (data: SuiObjectData): any | null => {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  const fields = data.content.fields as unknown as any;

  const keeperCap = { id: fields.id.id, gachaponId: fields.gachapon_id };
  if (keeperCap) {
    return keeperCap;
  } else {
    return null;
  }
};

export const getGachapon = async (
  suiClient: SuiClient,
  gachaponId: string
) => {};

export const adminGetGachapons = async (
  suiClient: SuiClient,
  address: string
) => {
  let gachapons: AdminGachapons = {};
  let keeperCaps: KeeperCap[] = [];
  let cursor;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::KeeperCap`,
      },
      options: { showContent: true },
      cursor: cursor || null,
    });

    response.data.forEach((item: any) => {
      const keeperCap = getKeeperData(item.data);

      keeperCaps.push(keeperCap);
    });
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  const PromiseList: Promise<any>[] = keeperCaps.map((keeperCap) =>
    suiClient.getObject({
      id: keeperCap.gachaponId,
      options: {
        showContent: true,
        showType: true,
      },
    })
  );

  const responseList = await Promise.all(PromiseList);

  responseList.forEach((response, index) => {
    const data = response.data;
    const coinType = data?.type?.split("<")[1].split(">")[0];
    const fields = data?.content?.fields as any;
    const suppliers = fields?.suppliers?.fields?.contents as any;

    const gachapon = {
      id: keeperCaps[index].gachaponId,
      keeperCapId: keeperCaps[index].id,
      kioskId: fields.kiosk_id,
      coinType: coinType,
      cost: fields.cost,
      suppliers: suppliers,
      lootbox: {
        id: fields?.lootbox?.fields?.id?.id,
        eggCounts: fields?.lootbox?.fields?.length,
      },
      treasury: fields.treasury,
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

export const addEgg = async ({
  address,
  gachaponId,
  objectId,
  transaction,
  suiClient,
  gachaponPackageId,
}: InternalAddEgg) => {
  const gachaponResponse = await suiClient.getObject({
    id: gachaponId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const gachaponData = gachaponResponse.data;
  const coinType = gachaponData?.type?.split("<")[1].split(">")[0];

  const objectResponse = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const objectData = objectResponse.data;

  // console.log("objectData", objectData);

  //if object is kiosk or object in a kiosk. And the object might locked or not

  if (
    gachaponData.content?.dataType === "moveObject" &&
    objectData.content?.dataType === "moveObject"
  ) {
    const gachaponFields = gachaponData.content?.fields as any;
    const objectType = objectData?.type;
    const kioskId = gachaponFields.kiosk_id;

    transaction.setGasBudget(100_000_000);

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

  // if (isLocked) {
  //   // Add locked egg
  //   transaction.moveCall({
  //     target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::lock`,
  //     typeArguments: [coinType, objectType],
  //     arguments: [
  //       transaction.object(gachaponId),
  //       transaction.object(kioskId),
  //       transaction.object(objectId),
  //     ],
  //   });
  // } else {
  //   transaction.moveCall({
  //     target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
  //     typeArguments: [coinType, objectType],
  //     arguments: [
  //       transaction.object(gachaponId),
  //       transaction.object(kioskId),
  //       transaction.object(objectId),
  //     ],
  //   });
  // }
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

export const updateCost = ({
  coinType,
  gachaponId,
  keeperCapId,
  newCost,
  transaction,
  gachaponPackageId,
}: InternalUpdateCost) => {
  transaction.setGasBudget(100_000_000);

  const updatedCost = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::update_cost`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.pure.u64(newCost),
    ],
  });

  return updatedCost;
};

export const addSupplier = ({
  coinType,
  gachaponId,
  keeperCapId,
  newSupplierAddress,
  transaction,
  gachaponPackageId,
}: InternalAddSupplier) => {
  transaction.setGasBudget(100_000_000);

  const addedSupplier = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::add_supplier`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.object(newSupplierAddress),
    ],
  });

  return addedSupplier;
};

export const removeSupplier = ({
  coinType,
  gachaponId,
  keeperCapId,
  supplierAddress,
  transaction,
  gachaponPackageId,
}: InternalRemoveSupplier) => {
  transaction.setGasBudget(100_000_000);

  const removedSupplier = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::remove_supplier`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.object(supplierAddress),
    ],
  });

  return removedSupplier;
};

export const drawEgg = async ({
  coinType,
  coin,
  gachaponId,
  count,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalDrawEgg) => {
  transaction.setGasBudget(100_000_000);

  const draw = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(count),
      coin,
      transaction.object(recipient),
    ],
  });

  return draw;
};

export const destroyEgg = async ({
  eggId,
  transaction,
  gachaponPackageId,
}: InternalDestroyEgg) => {
  transaction.setGasBudget(100_000_000);

  const destroyedEgg = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::destroy_empty`,
    arguments: [transaction.object(eggId)],
  });

  return destroyedEgg;
};

export const claimEgg = async ({
  coinType,
  gachaponId,
  kioskId,
  eggId,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalClaimEgg) => {
  transaction.setGasBudget(100_000_000);

  const isLocked = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::is_locked`,
    arguments: [transaction.object(eggId)],
  });

  const claimedEgg = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::claim`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(kioskId),
      transaction.object(eggId),
      transaction.object(recipient),
    ],
  });

  return claimedEgg;
};

export const CreateFreeSpinner = async ({}) => {};
