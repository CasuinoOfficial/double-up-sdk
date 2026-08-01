import { SuiGrpcClient } from "@mysten/sui/grpc";
import type { SuiClientTypes } from "@mysten/sui/client";
import { bcs } from "@mysten/sui/bcs";
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionResult,
} from "@mysten/sui/transactions";
import {
  GACHAPON_CORE_PACKAGE_ID,
  GACHAPON_MODULE_NAME,
  PERSONAL_KIOSK_PACKAGE,
  RAND_OBJ_ID,
  SUI_COIN_TYPE,
} from "../../constants/mainnetConstants";
import {
  KIOSK_LOCK_RULE,
  KIOSK_TYPE,
  KioskClient,
  PERSONAL_KIOSK_RULE_ADDRESS,
  ROYALTY_RULE,
} from "@mysten/kiosk";
import {
  checkHasKiosk,
  checkIsInKiosk,
  shortenAddressesInType,
  sliceArrayIntoChunks,
} from "../../utils";
import { fromHex, toHex } from "@mysten/sui/utils";
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
  gachaponId: string;
  objectId: string;
  transaction: Transaction;
}

interface InternalAddEgg extends AddEgg {
  suiClient: SuiGrpcClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

export interface AddCoinToEgg {
  gachaponId: string;
  gachaponKioskId: string;
  gachaponCoinType: string;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: Transaction;
}

interface InternalAddCoinToEgg extends AddCoinToEgg {
  gachaponPackageId: string;
}

export interface RemoveEgg {
  address: string;
  coinType: string;
  gachaponId: string;
  kioskId: string;
  keeperCapId: string;
  index: number;
  transaction: Transaction;
  objId: string;
  isEmpty?: boolean;
  isLocked?: boolean;
}

interface InternalRemoveEgg extends RemoveEgg {
  suiClient: SuiGrpcClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

export interface RemoveMultipleEggs {
  address: string;
  coinType: string;
  gachaponId: string;
  kioskId: string;
  keeperCapId: string;
  index: number[];
  transaction: Transaction;
  objId: string[];
  isEmpty?: boolean;
}

interface InternalRemoveMultipleEggs extends RemoveMultipleEggs {
  suiClient: SuiGrpcClient;
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

export interface DrawEggWithSecondaryCurrency {
  coinType: string;
  gachaponId: string;
  count: number;
  recipient: string;
  secondaryCoinType: string;
  secondaryCoin: TransactionObjectArgument;
  transaction: Transaction;
}

interface InternalDrawEggWithSecondaryCurrency
  extends DrawEggWithSecondaryCurrency {
  gachaponPackageId: string;
}

export interface ClaimEgg {
  address: string;
  coinType: string;
  gachaponId: string;
  kioskId: string;
  eggId: string;
  transaction: Transaction;
}

interface InternalClaimEgg extends ClaimEgg {
  suiClient: SuiGrpcClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

export interface DestroyEgg {
  eggId: string;
  transaction: Transaction;
}

interface InternalDestroyEgg extends DestroyEgg {
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
  objectType: string;
  transaction: Transaction;
}

interface InternalNftType extends NftType {
  gachaponPackageId: string;
}

export interface AddSecondaryCurrency {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  secondaryCoinType: string;
  transaction: Transaction;
}

interface InternalAddSecondaryCurrency extends AddSecondaryCurrency {
  gachaponPackageId: string;
}

export interface RemoveSecondaryCurrency {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  secondaryCoinType: string;
  transaction: Transaction;
  recipient: string;
}

interface InternalRemoveSecondaryCurrency extends RemoveSecondaryCurrency {
  gachaponPackageId: string;
}

export interface WithdrawSecondaryCurrency {
  coinType: string;
  gachaponId: string;
  keeperCapId: string;
  secondaryCoinType: string;
  transaction: Transaction;
  recipient: string;
}

interface InternalWithdrawSecondaryCurrency extends WithdrawSecondaryCurrency {
  gachaponPackageId: string;
}

export interface DrawFreeSpin {
  coinType: string;
  gachaponId: string;
  objectId: string;
  recipient: string;
  transaction: Transaction;
}

export interface DrawFreeSpinMultiple {
  coinType: string;
  gachaponId: string;
  objectIds: string[];
  recipient: string;
  transaction: Transaction;
}

interface InternalDrawFreeSpin extends DrawFreeSpin {
  suiClient: SuiGrpcClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

interface InternalDrawFreeSpinMultiple extends DrawFreeSpinMultiple {
  suiClient: SuiGrpcClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

type KeeperCap = { id: string; gachaponId: string };

export type Gachapon = {
  id: string;
  keeperCapId: string;
  kioskId: string;
  coinType: string;
  cost: string;
  lootbox: {
    id: string;
    eggCounts: string;
    sliceCount: string;
  };
  createdAt: string;
};

export type Gachapons = {
  [key: string]: Gachapon;
};

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
    sliceCount: string;
  };
  treasury: string;
  createdAt: string;
};

export type AdminGachapons = {
  [key: string]: AdminGachapon;
};

export type EggInfo = {
  eggId: string;
  isLocked: boolean;
  objectId: string;
};

export type EggObjectInfo = {
  eggId: string;
  isLocked: boolean;
  objectId: string;
  objectInfo: any | null;
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

const getKeeperData = (
  data: SuiClientTypes.Object<{ json: true }>
): any | null => {
  const fields = data.json as any;

  if (!fields) {
    return null;
  }

  return { id: fields.id, gachaponId: fields.gachapon_id };
};

// gRPC event entries carry no timestamp — resolve creation times through the
// emitting transactions instead
const getGachaponCreatedTimes = async (
  suiClient: SuiGrpcClient
): Promise<Record<string, string>> => {
  const createdTimes: Record<string, string> = {};
  const entries: { gachaponId: string; digest: string }[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const eventResponse = await suiClient.listEvents({
      filter: {
        eventType: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::NewGachapon`,
      },
      order: "ascending",
      ...(cursor ? { after: cursor } : {}),
    });

    for (const item of eventResponse.events) {
      const json = item.json as any;
      if (json?.gachapon_id) {
        entries.push({
          gachaponId: json.gachapon_id,
          digest: item.transactionDigest,
        });
      }
    }

    cursor = eventResponse.endCursor;
    hasNextPage = eventResponse.hasNextPage;
  }

  const digests = [...new Set(entries.map((entry) => entry.digest))];
  const timestampByDigest: Record<string, string> = {};

  for (const batch of sliceArrayIntoChunks(digests, 50)) {
    const { response } = await suiClient.ledgerService.batchGetTransactions({
      digests: batch,
      readMask: { paths: ["digest", "timestamp"] },
    });

    for (const result of response.transactions ?? []) {
      const oneof = result.result as any;
      if (oneof.oneofKind !== "transaction") continue;
      const tx = oneof.transaction;
      if (tx.digest && tx.timestamp) {
        timestampByDigest[tx.digest] = String(
          Number(tx.timestamp.seconds) * 1000 +
            Math.floor(tx.timestamp.nanos / 1e6)
        );
      }
    }
  }

  for (const entry of entries) {
    createdTimes[entry.gachaponId] = timestampByDigest[entry.digest];
  }

  return createdTimes;
};

export const getGachapons = async (suiClient: SuiGrpcClient, address: string) => {
  let gachapons: Gachapons = {};
  let keeperCaps: KeeperCap[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  //Get gachapon keeper cap
  while (hasNextPage) {
    const response = await suiClient.listOwnedObjects({
      owner: address,
      type: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::KeeperCap`,
      include: { json: true },
      cursor,
    });

    response.objects.forEach((item: any) => {
      const keeperCap = getKeeperData(item);

      keeperCaps.push(keeperCap);
    });
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }

  //Get create gachapon event
  const createdTimes = await getGachaponCreatedTimes(suiClient);

  const promiseList: Promise<any>[] = keeperCaps.map((keeperCap) =>
    suiClient.getObject({
      objectId: keeperCap.gachaponId,
      include: { json: true, previousTransaction: true },
    })
  );

  const responseList = await Promise.all(promiseList);

  responseList.forEach((response, index) => {
    const data = response.object;
    const coinType = shortenAddressesInType(data?.type ?? "")
      .split("<")[1]
      .split(">")[0];
    const fields = data?.json as any;

    const gachapon = {
      id: keeperCaps[index].gachaponId,
      keeperCapId: keeperCaps[index].id,
      kioskId: fields.kiosk_id,
      coinType: coinType,
      cost: fields.cost,
      lootbox: {
        id: fields?.lootbox?.id,
        eggCounts: fields?.lootbox?.length,
        sliceCount: fields?.lootbox?.slice_count,
      },
      createdAt: createdTimes[keeperCaps[index].gachaponId],
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

export const adminGetGachapons = async (
  suiClient: SuiGrpcClient,
  address: string
) => {
  let gachapons: AdminGachapons = {};
  let keeperCaps: KeeperCap[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  //Get gachapon keeper cap
  while (hasNextPage) {
    const response = await suiClient.listOwnedObjects({
      owner: address,
      type: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::KeeperCap`,
      include: { json: true },
      cursor,
    });

    response.objects.forEach((item: any) => {
      const keeperCap = getKeeperData(item);

      keeperCaps.push(keeperCap);
    });
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }

  //Get create gachapon event
  const createdTimes = await getGachaponCreatedTimes(suiClient);

  const promiseList: Promise<any>[] = keeperCaps.map((keeperCap) =>
    suiClient.getObject({
      objectId: keeperCap.gachaponId,
      include: { json: true, previousTransaction: true },
    })
  );

  const responseList = await Promise.all(promiseList);

  responseList.forEach((response, index) => {
    const data = response.object;
    const coinType = shortenAddressesInType(data?.type ?? "")
      .split("<")[1]
      .split(">")[0];
    const fields = data?.json as any;
    const suppliers = fields?.suppliers?.contents as any;

    const gachapon = {
      id: keeperCaps[index].gachaponId,
      keeperCapId: keeperCaps[index].id,
      kioskId: fields.kiosk_id,
      coinType: coinType,
      cost: fields.cost,
      suppliers: suppliers,
      lootbox: {
        id: fields?.lootbox?.id,
        eggCounts: fields?.lootbox?.length,
        sliceCount: fields?.lootbox?.slice_count,
      },
      treasury: fields.treasury,
      createdAt: createdTimes[keeperCaps[index].gachaponId],
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

const getEggData = (eggsFields: any) => {
  if (!eggsFields) {
    throw new Error("Invalid object type of gachapon eggs");
  }

  const eggs = eggsFields.value;

  const eggsInfoList: EggInfo[] = eggs.map((egg: any) => {
    return {
      eggId: egg?.id,
      isLocked: egg?.content?.is_locked,
      objectId: egg?.content?.obj_id,
    };
  });

  return eggsInfoList;
};

export const adminGetEggs = async (
  suiClient: SuiGrpcClient,
  lootboxId: string,
  slice_count: string
) => {
  const lootboxVecotrPromises = [...Array(Number(slice_count))].map(
    (_, index) =>
      suiClient.getDynamicField({
        parentId: lootboxId,
        name: {
          type: "u64",
          bcs: bcs.U64.serialize(index + 1).toBytes(),
        },
      })
  );

  const lootboxVectorResponse = await Promise.all(lootboxVecotrPromises);

  const eggsPromises = lootboxVectorResponse.map(({ dynamicField }) =>
    suiClient.getObject({
      objectId:
        dynamicField.$kind === "DynamicObject"
          ? dynamicField.childId
          : dynamicField.fieldId,
      include: { json: true },
    })
  );

  const eggsResponses = await Promise.all(eggsPromises);

  const eggsDataList = eggsResponses.map((egg) =>
    getEggData(egg.object.json as any)
  );

  const eggsInfoList = eggsDataList.flat();

  const chunkedEggsInfoList: EggInfo[][] = sliceArrayIntoChunks(
    eggsInfoList,
    50
  );

  const chunkedEggObjectPromises = chunkedEggsInfoList.map((eggs: EggInfo[]) =>
    suiClient.getObjects({
      objectIds: eggs.map((egg) => egg.objectId),
      include: { json: true, display: true },
    })
  );

  const chunkedEggObjects = await Promise.all(
    chunkedEggObjectPromises.filter((egg) => egg)
  );

  const eggObjects = chunkedEggObjects
    .flatMap((response) => response.objects)
    .filter(
      (object): object is SuiClientTypes.Object<{ json: true; display: true }> =>
        !(object instanceof Error)
    );

  const coins = {};

  const coinObjectList = eggObjects.filter((eggObject) => {
    const type = shortenAddressesInType(eggObject?.type ?? "");
    return type === SUI_COIN_TYPE || type.includes("0x2::coin::Coin");
  });

  for (const coin of coinObjectList) {
    const type = shortenAddressesInType(coin?.type ?? "");
    if (coins.hasOwnProperty(type)) {
      continue;
    } else {
      coins[type] = null;
    }
  }

  const coinTypeList = Object.keys(coins);

  if (coinTypeList.length > 0) {
    const coinMetadataPromises = coinTypeList.map((coinType) => {
      return suiClient.getCoinMetadata({
        coinType:
          coinType === SUI_COIN_TYPE
            ? coinType
            : coinType.split("<")[1].split(">")[0],
      });
    });

    const coinMetadataList = await Promise.all(coinMetadataPromises);

    coinMetadataList.forEach(({ coinMetadata }, index) => {
      coins[coinTypeList[index]] = coinMetadata;
    });
  }

  return eggsInfoList.map((egg, index) => {
    if (!egg?.objectId) {
      return {
        eggId: egg.eggId,
        isLocked: egg.isLocked,
        objectId: egg.objectId,
        objectInfo: null,
      } as EggObjectInfo;
    }

    const objectType = shortenAddressesInType(
      eggObjects.find((eggObject) => eggObject?.objectId === egg.objectId)
        ?.type ?? ""
    );

    if (
      objectType === SUI_COIN_TYPE ||
      objectType.includes("0x2::coin::Coin")
    ) {
    }

    const objectDisplay = eggObjects.find(
      (eggObject) => eggObject?.objectId === egg.objectId
    )?.display?.output as any;

    const objectContent = eggObjects.find(
      (eggObject) => eggObject?.objectId === egg.objectId
    )?.json as any;

    if (Object.keys(coins).length > 0 && coins.hasOwnProperty(objectType)) {
      const objectInfo = {
        description: objectDisplay?.description,
        image_url: coins[objectType].iconUrl,
        name: objectDisplay?.name,
        type: objectType,
        ...objectDisplay,
        ...objectContent,
        ...coins[objectType],
      };

      return {
        eggId: egg.eggId,
        isLocked: egg.isLocked,
        objectId: egg.objectId,
        objectInfo,
      } as EggObjectInfo;
    } else {
      const objectInfo = {
        description: objectDisplay?.description,
        image_url: objectDisplay?.image_url ?? objectContent?.image_url,
        name: objectDisplay?.name,
        type: objectType,
        ...objectDisplay,
        ...objectContent,
      };

      return {
        eggId: egg.eggId,
        isLocked: egg.isLocked,
        objectId: egg.objectId,
        objectInfo,
      } as EggObjectInfo;
    }
  });
};

export const addEgg = async ({
  gachaponId,
  objectId,
  transaction,
  suiClient,
  kioskClient,
  gachaponPackageId,
}: InternalAddEgg) => {
  const { object: gachaponData } = await suiClient.getObject({
    objectId: gachaponId,
    include: { json: true },
  });

  const coinType = shortenAddressesInType(gachaponData?.type ?? "")
    .split("<")[1]
    .split(">")[0];

  const gachaponFields = gachaponData.json as any;

  if (!gachaponFields) {
    throw new Error("Invalid object type of Gachapon");
  }

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

export const addCoinToEgg = async ({
  gachaponId,
  gachaponKioskId,
  gachaponCoinType,
  coin,
  coinType,
  transaction,
  gachaponPackageId,
}: InternalAddCoinToEgg) => {
  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::place`,
    typeArguments: [gachaponCoinType, coinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(gachaponKioskId),
      coin,
    ],
  });
};

export const simpleRemoveEgg = ({
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

export const removeEgg = async ({
  address,
  coinType,
  gachaponId,
  keeperCapId,
  kioskId,
  index,
  transaction,
  objId,
  isEmpty,
  isLocked,
  suiClient,
  kioskClient,
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

  if (isEmpty) {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::destroy_empty`,
      arguments: [removedEgg],
    });
  } else {
    const { object: objData } = await suiClient.getObject({
      objectId: objId,
    });

    const objType = objData?.type;

    const coinType = objData?.type.includes("Coin<")
      ? objData?.type.split("<")[1].split(">")[0]
      : SUI_COIN_TYPE;

    if (!isLocked) {
      const claimedEgg = transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::redeem_unlocked_v2`,
        typeArguments: [coinType, objType, coinType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskId),
          removedEgg,
        ],
      });

      transaction.transferObjects([claimedEgg], address);

      // return claimedEgg;
    } else {
      let ownedKiosk: TransactionArgument;
      let kioskOwnerCap: TransactionArgument;

      const { kioskInfo } = await checkIsInKiosk(objId, suiClient, kioskClient);

      const ownedKioskOwnerCap = await checkHasKiosk(address, kioskClient);

      if (!ownedKioskOwnerCap || ownedKioskOwnerCap?.isPersonal) {
        [ownedKiosk, kioskOwnerCap] = transaction.moveCall({
          target: "0x2::kiosk::new",
        });
      } else {
        ownedKiosk = transaction.object(ownedKioskOwnerCap.kioskId);
        kioskOwnerCap = transaction.object(ownedKioskOwnerCap.objectId);
      }

      const payment = transaction.moveCall({
        target: "0x2::coin::zero",
        typeArguments: ["0x2::sui::SUI"],
      });

      const claimedEgg = transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::redeem_locked`,
        typeArguments: [coinType, objType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskId),
          payment,
          removedEgg,
        ],
      });

      if (kioskInfo.royaltyFee != null) {
        if (Number(kioskInfo.royaltyFee.minAmount) === 0) {
          const royalty = transaction.moveCall({
            target: "0x2::coin::zero",
            typeArguments: ["0x2::sui::SUI"],
          });

          transaction.moveCall({
            target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
            typeArguments: [objType],
            arguments: [
              transaction.object(kioskInfo.transferPoilcies.id),
              claimedEgg[1],
              royalty,
            ],
          });
        } else {
          const [coin] = transaction.splitCoins(transaction.gas, [
            transaction.pure.u64(kioskInfo.royaltyFee.minAmount),
          ]);

          transaction.moveCall({
            target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
            typeArguments: [objType],
            arguments: [
              transaction.object(kioskInfo.transferPoilcies.id),
              claimedEgg[1],
              coin,
            ],
          });
        }
      }

      if (!kioskInfo.hasLockingRule) {
        transaction.moveCall({
          target: "0x2::kiosk::place",
          typeArguments: [objType],
          arguments: [ownedKiosk, kioskOwnerCap, claimedEgg[0]],
        });
      } else {
        transaction.moveCall({
          target: "0x2::kiosk::lock",
          typeArguments: [objType],
          arguments: [
            ownedKiosk,
            kioskOwnerCap,
            transaction.object(kioskInfo.transferPoilcies.id),
            claimedEgg[0],
          ],
        });

        transaction.moveCall({
          target: `${PERSONAL_KIOSK_PACKAGE}::kiosk_lock_rule::prove`,
          typeArguments: [objType],
          arguments: [claimedEgg[1], ownedKiosk],
        });
      }

      transaction.moveCall({
        target: "0x2::transfer_policy::confirm_request",
        typeArguments: [objType],
        arguments: [
          transaction.object(kioskInfo.transferPoilcies.id),
          claimedEgg[1],
        ],
      });

      transaction.transferObjects([kioskOwnerCap], address);

      if (!ownedKioskOwnerCap || ownedKioskOwnerCap?.isPersonal) {
        transaction.moveCall({
          target: "0x2::transfer::public_share_object",
          typeArguments: ["0x2::kiosk::Kiosk"],
          arguments: [ownedKiosk],
        });
      }
    }
  }
};

export const removeMultipleEggs = async ({
  address,
  coinType,
  gachaponId,
  keeperCapId,
  kioskId,
  index,
  transaction,
  objId,
  isEmpty,
  suiClient,
  gachaponPackageId,
}: InternalRemoveMultipleEggs) => {
  transaction.setGasBudget(100_000_000);

  if (isEmpty) {
    for (let i = 0; i < index.length; i++) {
      const removedEgg = transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::take`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskId),
          transaction.object(keeperCapId),
          transaction.pure.u64(index[i]),
        ],
      });

      transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::destroy_empty`,
        arguments: [removedEgg],
      });
    }
  } else {
    const objPromises = objId.map((id) =>
      suiClient.getObject({
        objectId: id,
      })
    );

    const objResponses = await Promise.all(objPromises);

    const objData = objResponses.map((response) => response.object);
    const objTypes = objData.map((data) => data?.type);

    let claimedEggs: TransactionResult[] = [];

    for (let i = 0; i < index.length; i++) {
      const removedEgg = transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::take`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskId),
          transaction.object(keeperCapId),
          transaction.pure.u64(index[i]),
        ],
      });

      const coinTypeInsideUnlocked = objTypes[i].includes("Coin<")
        ? objTypes[i].split("<")[1].split(">")[0]
        : SUI_COIN_TYPE;

      const claimedEgg = transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::redeem_unlocked_v2`,
        typeArguments: [coinType, objTypes[i], coinTypeInsideUnlocked],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskId),
          removedEgg,
        ],
      });

      claimedEggs.push(claimedEgg);
    }

    transaction.transferObjects(claimedEggs, address);
  }
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

export const claimEgg = async ({
  address,
  coinType,
  gachaponId,
  kioskId,
  eggId,
  transaction,
  suiClient,
  kioskClient,
  gachaponPackageId,
}: InternalClaimEgg) => {
  transaction.setGasBudget(100_000_000);

  const { object: eggObject } = await suiClient.getObject({
    objectId: eggId,
    include: { json: true },
  });

  const eggFields = eggObject.json as any;

  if (!eggFields) {
    throw new Error("Invalid object type of gachapon egg");
  }

  if (eggFields.content === null || eggFields.content === undefined) {
    return null;
  }

  const { is_locked, obj_id } = eggFields.content;

  const objResponse = await suiClient.getObject({
    objectId: obj_id,
  });

  const objType = objResponse.object.type;

  if (!is_locked) {
    const coinTypeInsideUnlocked = objType.includes("Coin<")
      ? objType.split("<")[1].split(">")[0]
      : SUI_COIN_TYPE;

    const claimedEgg = transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::redeem_unlocked_v2`,
      typeArguments: [coinType, objType, coinTypeInsideUnlocked],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskId),
        transaction.object(eggId),
      ],
    });

    transaction.transferObjects([claimedEgg], address);

    return claimedEgg;
  } else {
    // let newKiosk: TransactionResult; //[kiosk, kioskOwnerCap]
    let ownedKiosk: TransactionArgument;
    let kioskOwnerCap: TransactionArgument;

    const { kioskInfo } = await checkIsInKiosk(obj_id, suiClient, kioskClient);

    const ownedKioskOwnerCap = await checkHasKiosk(address, kioskClient);

    if (ownedKioskOwnerCap === null || ownedKioskOwnerCap.isPersonal) {
      [ownedKiosk, kioskOwnerCap] = transaction.moveCall({
        target: "0x2::kiosk::new",
      });
    } else {
      ownedKiosk = transaction.object(ownedKioskOwnerCap.kioskId);
      kioskOwnerCap = transaction.object(ownedKioskOwnerCap.objectId);
    }

    const payment = transaction.moveCall({
      target: "0x2::coin::zero",
      typeArguments: ["0x2::sui::SUI"],
    });

    const claimedEgg = transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::redeem_locked`,
      typeArguments: [coinType, objType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskId),
        payment,
        transaction.object(eggId),
      ],
    });

    if (kioskInfo.royaltyFee != null) {
      if (Number(kioskInfo.royaltyFee.minAmount) === 0) {
        const royalty = transaction.moveCall({
          target: "0x2::coin::zero",
          typeArguments: ["0x2::sui::SUI"],
        });

        transaction.moveCall({
          target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
          typeArguments: [objType],
          arguments: [
            transaction.object(kioskInfo.transferPoilcies.id),
            claimedEgg[1],
            royalty,
          ],
        });
      } else {
        const [coin] = transaction.splitCoins(transaction.gas, [
          transaction.pure.u64(kioskInfo.royaltyFee.minAmount),
        ]);

        transaction.moveCall({
          target: `${PERSONAL_KIOSK_PACKAGE}::royalty_rule::pay`,
          typeArguments: [objType],
          arguments: [
            transaction.object(kioskInfo.transferPoilcies.id),
            claimedEgg[1],
            coin,
          ],
        });
      }
    }

    if (!kioskInfo.hasLockingRule) {
      transaction.moveCall({
        target: "0x2::kiosk::place",
        typeArguments: [objType],
        arguments: [ownedKiosk, kioskOwnerCap, claimedEgg[0]],
      });
    } else {
      transaction.moveCall({
        target: "0x2::kiosk::lock",
        typeArguments: [objType],
        arguments: [
          ownedKiosk,
          kioskOwnerCap,
          transaction.object(kioskInfo.transferPoilcies.id),
          claimedEgg[0],
        ],
      });

      transaction.moveCall({
        target: `${PERSONAL_KIOSK_PACKAGE}::kiosk_lock_rule::prove`,
        typeArguments: [objType],
        arguments: [claimedEgg[1], ownedKiosk],
      });
    }

    transaction.moveCall({
      target: "0x2::transfer_policy::confirm_request",
      typeArguments: [objType],
      arguments: [
        transaction.object(kioskInfo.transferPoilcies.id),
        claimedEgg[1],
      ],
    });

    transaction.transferObjects([kioskOwnerCap], address);

    if (!ownedKioskOwnerCap || ownedKioskOwnerCap?.isPersonal) {
      transaction.moveCall({
        target: "0x2::transfer::public_share_object",
        typeArguments: ["0x2::kiosk::Kiosk"],
        arguments: [ownedKiosk],
      });
    }

    return claimedEgg;
  }
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

export const drawEggWithSecondaryCurrency = ({
  coinType,
  secondaryCoinType,
  secondaryCoin,
  gachaponId,
  count,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalDrawEggWithSecondaryCurrency) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_via_secondary_currency`,
    typeArguments: [coinType, secondaryCoinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(count),
      secondaryCoin,
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
  objectType,
  transaction,
  gachaponPackageId,
}: InternalNftType) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::add_nft_type`,
    typeArguments: [coinType, objectType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });
};

export const addSecondaryCurrency = async ({
  coinType,
  gachaponId,
  keeperCapId,
  secondaryCoinType,
  transaction,
  gachaponPackageId,
}: InternalAddSecondaryCurrency) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::add_secondary_currency_fixed`,
    typeArguments: [coinType, secondaryCoinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });
};

export const removeSecondaryCurrency = async ({
  coinType,
  gachaponId,
  keeperCapId,
  secondaryCoinType,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalRemoveSecondaryCurrency) => {
  transaction.setGasBudget(100_000_000);

  const coin = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::remove_secondary_currency_fixed`,
    typeArguments: [coinType, secondaryCoinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });

  transaction.transferObjects([coin], recipient);
};

export const withdrawSecondaryCurrency = async ({
  coinType,
  gachaponId,
  keeperCapId,
  secondaryCoinType,
  recipient,
  transaction,
  gachaponPackageId,
}: InternalWithdrawSecondaryCurrency) => {
  transaction.setGasBudget(100_000_000);

  const coin = transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::withdraw_secondary_currency_fixed`,
    typeArguments: [coinType, secondaryCoinType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });

  transaction.transferObjects([coin], recipient);
};

export const removeNftType = async ({
  coinType,
  gachaponId,
  keeperCapId,
  objectType,
  transaction,
  gachaponPackageId,
}: InternalNftType) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::remove_nft_type`,
    typeArguments: [coinType, objectType],
    arguments: [
      transaction.object(gachaponId),
      transaction.object(keeperCapId),
    ],
  });
};

export const drawFreeSpin = async ({
  coinType,
  gachaponId,
  objectId,
  recipient,
  transaction,
  suiClient,
  kioskClient,
  gachaponPackageId,
}: InternalDrawFreeSpin) => {
  const { object: objectData } = await suiClient.getObject({
    objectId: objectId,
    include: { json: true },
  });

  if (!objectData.json) {
    throw new Error("Invalid object type");
  }

  const { isInKiosk, objectType, kioskInfo } = await checkIsInKiosk(
    objectId,
    suiClient,
    kioskClient
  );

  transaction.setGasBudget(100_000_000);

  if (!isInKiosk || kioskInfo === null) {
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
    if (kioskInfo.isPersonal) {
      const ID = bcs.fixedArray(32, bcs.u8()).transform({
        input: (id: string) => fromHex(id),
        output: (id) => toHex(Uint8Array.from(id)),
      });

      transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_free_spin_with_personal_kiosk`,
        typeArguments: [coinType, objectType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskInfo.kioskId),
          transaction.pure(bcs.vector(ID).serialize([objectId])),
          transaction.object(RAND_OBJ_ID),
          transaction.pure.address(recipient),
        ],
      });
    } else {
      const ID = bcs.fixedArray(32, bcs.u8()).transform({
        input: (id: string) => fromHex(id),
        output: (id) => toHex(Uint8Array.from(id)),
      });

      transaction.moveCall({
        target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_free_spin_with_kiosk`,
        typeArguments: [coinType, objectType],
        arguments: [
          transaction.object(gachaponId),
          transaction.object(kioskInfo.kioskId),
          transaction.object(kioskInfo.koiskOwnerCapId),
          transaction.pure(bcs.vector(ID).serialize([objectId])),
          transaction.object(RAND_OBJ_ID),
          transaction.pure.address(recipient),
        ],
      });
    }
  }
};

export const drawFreeSpinMultiple = async ({
  coinType,
  gachaponId,
  objectIds,
  recipient,
  transaction,
  suiClient,
  kioskClient,
  gachaponPackageId,
}: InternalDrawFreeSpinMultiple) => {
  const { objects: objectResponse } = await suiClient.getObjects({
    objectIds: objectIds,
    include: { json: true },
  });

  const objectDatas = objectResponse.map((object) =>
    object instanceof Error ? undefined : object
  );
  const objectTypes = objectDatas.map((data) => data?.type);

  if (objectTypes.length === 0)
    throw new Error("Wasn't able to fetch object types.");

  const firstObjectId = objectIds[0];
  const firstType = objectTypes[0];

  if (objectTypes.every((type) => type !== firstType)) {
    throw new Error(
      "Invalid object type. Every object should be the same type"
    );
  }

  const { isInKiosk, kioskInfo } = await checkIsInKiosk(
    firstObjectId,
    suiClient,
    kioskClient
  );

  if (!isInKiosk || kioskInfo === null) throw new Error("Invalid object type");

  if (!kioskInfo) throw new Error("Invalid kiosk");

  if (kioskInfo.isPersonal) {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_free_spin_with_personal_kiosk`,
      typeArguments: [coinType, firstType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskInfo.kioskId),
        transaction.makeMoveVec({
          elements: objectIds.map((objectId) => transaction.pure.id(objectId)),
          type: "0x2::object::ID",
        }),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.address(recipient),
      ],
    });
  } else {
    transaction.moveCall({
      target: `${gachaponPackageId}::${GACHAPON_MODULE_NAME}::draw_free_spin_with_kiosk`,
      typeArguments: [coinType, firstType],
      arguments: [
        transaction.object(gachaponId),
        transaction.object(kioskInfo.kioskId),
        transaction.object(kioskInfo.koiskOwnerCapId),
        transaction.makeMoveVec({
          elements: objectIds.map((objectId) => transaction.pure.id(objectId)),
          type: "0x2::object::ID",
        }),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.address(recipient),
      ],
    });
  }
};
