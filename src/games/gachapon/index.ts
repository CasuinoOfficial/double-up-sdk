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
  PERSONAL_KIOSK_PACKAGE,
  RAND_OBJ_ID,
} from "../../constants/mainnetConstants";
import {
  KIOSK_LOCK_RULE,
  KIOSK_TYPE,
  KioskClient,
  PERSONAL_KIOSK_RULE_ADDRESS,
  ROYALTY_RULE,
} from "@mysten/kiosk";
import { checkIsInKiosk } from "../../utils";
import { Decimal } from "decimal.js";

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
  kioskClient: KioskClient;
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

export interface NftType {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  objectId: string;
  transaction: Transaction;
}

interface InternalNftType extends NftType {
  suiClient: SuiClient;
  gachaponPackageId: string;
}

export interface DrawFreeSpin {
  coinType: string;
  gachaponId: string;
  objectId: string;
  recipient: string;
  transaction: Transaction;
}

interface InternalDrawFreeSpin extends DrawFreeSpin {
  suiClient: SuiClient;
  gachaponPackageId: string;
}

type KeeperCap = { id: string; gachaponId: string };

export type AdminGachapon = {
  id: string;
  keeperCapId: string;
  kioskId: string;
  coinType: string;
  cost: string;
  suppliers: string[];
  lootbox: {
    id: string;
    eggCounts: string;
  };
  treasury: string;
  createdAt: string;
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

  const rest = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::close`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.object(kioskId),
    ],
  });

  return rest;
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

  const promiseList: Promise<any>[] = keeperCaps.map((keeperCap) =>
    suiClient.getObject({
      id: keeperCap.gachaponId,
      options: {
        showContent: true,
        showPreviousTransaction: true,
        showType: true,
      },
    })
  );

  const responseList = await Promise.all(promiseList);

  const createTransactionDigests = responseList.map(
    (response) => response.data.previousTransaction
  );

  const transactionDigestsPromises = createTransactionDigests.map((digest) =>
    suiClient.getTransactionBlock({
      digest,
    })
  );

  const transactionDigests = await Promise.all(transactionDigestsPromises);

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
      createdAt: transactionDigests[index].timestampMs,
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

export const adminGetEggs = async (suiClient: SuiClient, lootboxId: string) => {
  const lootboxResponse = await suiClient.getObject({
    id: lootboxId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  console.log("lootboxResponse", lootboxResponse);

  return lootboxResponse.data;
};

export const addEgg = async ({
  address,
  gachaponId,
  objectId,
  transaction,
  suiClient,
  kioskClient,
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

  if (gachaponData.content?.dataType !== "moveObject") {
    throw new Error("Invalid object type of Gachapon");
  }

  const gachaponFields = gachaponData.content?.fields as any;
  const gachaponKioskId = gachaponFields.kiosk_id;

  const { isInKiosk, objectType, kioskInfo } = await checkIsInKiosk(
    objectId,
    suiClient,
    kioskClient
  );

  transaction.setGasBudget(100_000_000);

  if (!isInKiosk || kioskInfo === null) {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
      typeArguments: [coinType, objectType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(gachaponKioskId),
        transaction.object(objectId),
      ],
    });
  } else {
    let objectToEgg: TransactionArgument;
    let kioskCap: TransactionArgument;
    let borrowPotato: TransactionArgument | null = null;

    if (kioskInfo.isPersonal) {
      const result = transaction.moveCall({
        target: `${PERSONAL_KIOSK_PACKAGE}::personal_kiosk::borrow_val`,
        arguments: [transaction.object(kioskInfo.koiskOwnerCapId)],
      });
      kioskCap = result[0];
      borrowPotato = result[1];
    } else {
      kioskCap = transaction.object(kioskInfo.koiskOwnerCapId);
    }

    if (!kioskInfo.isLocked) {
      objectToEgg = transaction.moveCall({
        target: "0x2::kiosk::take",
        typeArguments: [objectType],
        arguments: [
          transaction.object(kioskInfo.kioskId),
          kioskCap,
          transaction.pure.id(objectId),
        ],
      });
    } else {
      transaction.moveCall({
        target: "0x2::kiosk::list",
        typeArguments: [objectType],
        arguments: [
          transaction.object(kioskInfo.kioskId),
          kioskCap,
          transaction.pure.id(objectId),
          transaction.pure.u64(0),
        ],
      });

      const payment = transaction.moveCall({
        target: "0x2::coin::zero",
        typeArguments: ["0x2::sui::SUI"],
      });

      const result = transaction.moveCall({
        target: "0x2::kiosk::purchase",
        typeArguments: [objectType],
        arguments: [
          transaction.object(kioskInfo.kioskId),
          transaction.pure.id(objectId),
          payment,
        ],
      });

      objectToEgg = result[0];

      if (kioskInfo.royaltyFee != null) {
        if (Number(kioskInfo.royaltyFee.minAmount) === 0) {
          const royalty = transaction.moveCall({
            target: "0x2::coin::zero",
            typeArguments: ["0x2::sui::SUI"],
          });

          transaction.moveCall({
            target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
            typeArguments: [objectType],
            arguments: [
              transaction.object(kioskInfo.transferPoilcies.id),
              result[1],
              royalty,
            ],
          });
        } else {
          const [coin] = transaction.splitCoins(transaction.gas, [
            transaction.pure.u64(kioskInfo.royaltyFee.minAmount),
          ]);

          transaction.moveCall({
            target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
            typeArguments: [objectType],
            arguments: [
              transaction.object(kioskInfo.transferPoilcies.id),
              result[1],
              coin,
            ],
          });
        }
      }

      if (!kioskInfo.hasLockingRule) {
        transaction.moveCall({
          target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
          typeArguments: [coinType, objectType],
          arguments: [
            transaction.object(gachaponId),
            transaction.object(gachaponKioskId),
            objectToEgg,
          ],
        });
      } else {
        transaction.moveCall({
          target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::lock`,
          typeArguments: [coinType, objectType],
          arguments: [
            transaction.object(gachaponId),
            transaction.object(gachaponKioskId),
            transaction.object(kioskInfo?.transferPoilcies?.id),
            objectToEgg,
          ],
        });

        transaction.moveCall({
          target: `${PERSONAL_KIOSK_PACKAGE}::kiosk_lock_rule::prove`,
          typeArguments: [objectType],
          arguments: [result[1], transaction.object(gachaponKioskId)],
        });
      }

      transaction.moveCall({
        target: "0x2::transfer_policy::confirm_request",
        typeArguments: [objectType],
        arguments: [
          transaction.object(kioskInfo.transferPoilcies.id),
          result[1],
        ],
      });

      if (kioskInfo.isPersonal && borrowPotato != null) {
        transaction.moveCall({
          target: `${PERSONAL_KIOSK_PACKAGE}::personal_kiosk::return_val`,
          arguments: [
            transaction.object(kioskInfo.koiskOwnerCapId),
            kioskCap,
            borrowPotato,
          ],
        });
      }
    }
  }
};

export const removeEgg = ({
  coinType,
  gachaponId,
  keeperCapId,
  kioskId,
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

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::update_cost`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.pure.u64(newCost),
    ],
  });
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

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::add_supplier`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.pure.address(newSupplierAddress),
    ],
  });
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

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::remove_supplier`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
      transaction.pure.address(supplierAddress),
    ],
  });
};

export const drawEgg = ({
  coinType,
  coin,
  gachaponId,
  count,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalDrawEgg) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(count),
      coin,
      transaction.pure.address(recipient),
    ],
  });
};

export const destroyEgg = ({
  eggId,
  transaction,
  gachaponPackageId,
}: InternalDestroyEgg) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::destroy_empty`,
    arguments: [transaction.object(eggId)],
  });
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

export const createFreeSpinner = async ({
  coinType,
  gachaponId,
  keeperCapId,
  transaction,
  gachaponPackageId,
}: InternalCreateFreeSpinner) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::create_free_spinner`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });
};

export const addNftType = async ({
  coinType,
  gachaponId,
  keeperCapId,
  objectId,
  transaction,
  suiClient,
  gachaponPackageId,
}: InternalNftType) => {
  const objectResponse = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const objectData = objectResponse.data;

  if (objectData.content?.dataType !== "moveObject") {
    const objectType = objectData?.type;

    transaction.setGasBudget(100_000_000);

    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::add_nft_type`,
      typeArguments: [coinType, objectType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(keeperCapId),
      ],
    });
  } else {
    throw new Error("Invalid object type");
  }
};

export const drawFreeSpin = async ({
  coinType,
  gachaponId,
  objectId,
  recipient,
  transaction,
  suiClient,
  gachaponPackageId,
}: InternalDrawFreeSpin) => {
  const objectResponse = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const objectData = objectResponse.data;

  if (objectData.content?.dataType !== "moveObject") {
    const objectType = objectData?.type;

    transaction.setGasBudget(100_000_000);

    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_free_spin`,
      typeArguments: [coinType, objectType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(objectId),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.address(recipient),
      ],
    });
  } else {
    throw new Error("Invalid object type");
  }
};
