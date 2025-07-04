import {
  PaginatedEvents,
  SuiClient,
  SuiEvent,
  SuiObjectData,
  SuiObjectResponse,
  SuiParsedData,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
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
  sliceArrayIntoChunks,
} from "../../utils";
import { bcs } from "@mysten/sui/bcs";
import { fromHEX, toHEX } from "@mysten/sui/utils";
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
  suiClient: SuiClient;
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
  suiClient: SuiClient;
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
  suiClient: SuiClient;
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
  suiClient: SuiClient;
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
  suiClient: SuiClient;
  kioskClient: KioskClient;
  gachaponPackageId: string;
}

interface InternalDrawFreeSpinMultiple extends DrawFreeSpinMultiple {
  suiClient: SuiClient;
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

export const getGachapons = async (suiClient: SuiClient, address: string) => {
  const createdTimes: Record<string, string> = {};
  let gachapons: Gachapons = {};
  let keeperCaps: KeeperCap[] = [];
  let cursor;
  let hasNextPage = true;

  //Get gachapon keeper cap
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

  //Get create gachapon event
  cursor = null;
  hasNextPage = true;

  while (hasNextPage) {
    const eventResponse = await suiClient.queryEvents({
      query: {
        MoveEventType: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::NewGachapon`,
      },
      cursor: cursor || null,
    });

    for (let item of eventResponse.data) {
      const parsedJson = item.parsedJson as any;

      createdTimes[parsedJson?.gachapon_id] = item.timestampMs;
    }

    cursor = eventResponse.nextCursor;
    hasNextPage = eventResponse.hasNextPage;
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

  responseList.forEach((response, index) => {
    const data = response.data;
    const coinType = data?.type?.split("<")[1].split(">")[0];
    const fields = data?.content?.fields as any;

    const gachapon = {
      id: keeperCaps[index].gachaponId,
      keeperCapId: keeperCaps[index].id,
      kioskId: fields.kiosk_id,
      coinType: coinType,
      cost: fields.cost,
      lootbox: {
        id: fields?.lootbox?.fields?.id?.id,
        eggCounts: fields?.lootbox?.fields?.length,
        sliceCount: fields?.lootbox?.fields?.slice_count,
      },
      createdAt: createdTimes[keeperCaps[index].gachaponId],
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

export const adminGetGachapons = async (
  suiClient: SuiClient,
  address: string
) => {
  const createdTimes: Record<string, string> = {};
  let gachapons: AdminGachapons = {};
  let keeperCaps: KeeperCap[] = [];
  let cursor;
  let hasNextPage = true;

  //Get gachapon keeper cap
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

  //Get create gachapon event
  cursor = null;
  hasNextPage = true;

  while (hasNextPage) {
    const eventResponse = await suiClient.queryEvents({
      query: {
        MoveEventType: `${GACHAPON_CORE_PACKAGE_ID}::gachapon::NewGachapon`,
      },
      cursor: cursor || null,
    });

    for (let item of eventResponse.data) {
      const parsedJson = item.parsedJson as any;

      createdTimes[parsedJson?.gachapon_id] = item.timestampMs;
    }

    cursor = eventResponse.nextCursor;
    hasNextPage = eventResponse.hasNextPage;
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
        sliceCount: fields?.lootbox?.fields?.slice_count,
      },
      treasury: fields.treasury,
      createdAt: createdTimes[keeperCaps[index].gachaponId],
    };

    gachapons[keeperCaps[index].gachaponId] = gachapon;
  });

  return gachapons;
};

const getEggData = (eggsContent: SuiParsedData) => {
  if (eggsContent.dataType !== "moveObject") {
    throw new Error("Invalid object type of gachapon eggs");
  }

  const eggsFields = eggsContent?.fields as any;
  const eggs = eggsFields.value;

  const eggsInfoList: EggInfo[] = eggs.map((egg: any) => {
    return {
      eggId: egg?.fields?.id?.id,
      isLocked: egg?.fields?.content?.fields?.is_locked,
      objectId: egg?.fields?.content?.fields?.obj_id,
    };
  });

  return eggsInfoList;
};

export const adminGetEggs = async (
  suiClient: SuiClient,
  lootboxId: string,
  slice_count: string
) => {
  const lootboxVecotrPromises = [...Array(Number(slice_count))].map(
    (_, index) =>
      suiClient.getDynamicFieldObject({
        parentId: lootboxId,
        name: {
          type: "u64",
          value: (index + 1).toString(),
        },
      })
  );

  const lootboxVectorResponse = await Promise.all(lootboxVecotrPromises);

  const lootboxVectorData = lootboxVectorResponse.map(
    (response) => response.data
  );

  const eggsPromises = lootboxVectorData.map((lootbox) =>
    suiClient.getObject({
      id: lootbox.objectId,
      options: {
        showContent: true,
        showType: true,
      },
    })
  );

  const eggsResponses = await Promise.all(eggsPromises);

  const eggsContentList = eggsResponses.map((egg) => egg.data.content);

  const eggsDataList = eggsContentList.map((eggsContent) =>
    getEggData(eggsContent)
  );

  const eggsInfoList = eggsDataList.flat();

  const chunkedEggsInfoList: EggInfo[][] = sliceArrayIntoChunks(
    eggsInfoList,
    50
  );

  const chunkedEggObjectPromises: (Promise<SuiObjectResponse[]> | undefined)[] =
    chunkedEggsInfoList.map((eggs: EggInfo[]) =>
      suiClient.multiGetObjects({
        ids: eggs.map((egg) => egg.objectId),
        options: {
          showContent: true,
          showDisplay: true,
          showType: true,
        },
      })
    );

  const chunkedEggObjects = await Promise.all(
    chunkedEggObjectPromises.filter((egg) => egg)
  );

  const eggObjects = chunkedEggObjects.flat();

  const coins = {};

  const coinObjectList = eggObjects.filter((eggObject) => {
    return (
      eggObject?.data?.type === SUI_COIN_TYPE ||
      eggObject?.data?.type?.includes("0x2::coin::Coin")
    );
  });

  for (const coin of coinObjectList) {
    if (coins.hasOwnProperty(coin?.data?.type)) {
      continue;
    } else {
      coins[coin?.data?.type] = null;
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

    coinMetadataList.forEach((coinMetadata, index) => {
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

    const objectType = eggObjects.find(
      (eggObject) => eggObject?.data?.objectId === egg.objectId
    ).data?.type;

    if (
      objectType === SUI_COIN_TYPE ||
      objectType.includes("0x2::coin::Coin")
    ) {
    }

    const objectDisplay = eggObjects.find(
      (eggObject) => eggObject?.data?.objectId === egg.objectId
    ).data?.display?.data;

    const objectContent = (
      eggObjects.find((eggObject) => eggObject?.data?.objectId === egg.objectId)
        .data?.content as any
    ).fields;

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
    const objResponse = await suiClient.getObject({
      id: objId,
      options: {
        showType: true,
      },
    });

    const objData = objResponse.data;
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
        id,
        options: {
          showType: true,
        },
      })
    );

    const objResponses = await Promise.all(objPromises);

    const objData = objResponses.map((response) => response.data);
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

  const eggResponse = await suiClient.getObject({
    id: eggId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const eggContent = eggResponse?.data?.content;

  if (eggContent?.dataType !== "moveObject") {
    throw new Error("Invalid object type of gachapon egg");
  }

  const eggFields = eggContent?.fields as any;

  if (eggFields.content === null) {
    return null;
  }

  const { is_locked, obj_id } = eggFields.content.fields;

  const objResponse = await suiClient.getObject({
    id: obj_id,
    options: {
      showType: true,
    },
  });

  const objType = objResponse.data.type;

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
  const objectResponse = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const objectData = objectResponse.data;

  if (objectData.content?.dataType !== "moveObject") {
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
        input: (id: string) => fromHEX(id),
        output: (id) => toHEX(Uint8Array.from(id)),
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
        input: (id: string) => fromHEX(id),
        output: (id) => toHEX(Uint8Array.from(id)),
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
  const objectResponse = await suiClient.multiGetObjects({
    ids: objectIds,
    options: {
      showContent: true,
      showType: true,
    },
  });

  const objectDatas = objectResponse.map((response) => response.data);
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
