import { bcs } from "@mysten/sui/bcs";
import type { SuiClientTypes } from "@mysten/sui/client";
import { SuiGrpcClient } from "@mysten/sui/grpc";

type ExecutedTransaction = SuiClientTypes.Transaction<{
  effects: true;
  objectTypes: true;
}>;

import {
  BUCK_COIN_TYPE,
  BUCK_VOUCHER_BANK,
  ROULETTE_MODULE_NAME,
  ROULETTE_PACKAGE_ID,
  SUI_COIN_TYPE,
  SUI_VOUCHER_BANK,
  UNI_HOUSE_OBJ_ID,
} from "../constants/mainnetConstants";
import {
  KIOSK_ITEM,
  KIOSK_LOCK_RULE,
  KioskClient,
  KioskOwnerCap,
  ROYALTY_RULE,
  TransferPolicy,
} from "@mysten/kiosk";

interface GameInfo {
  gameCoinType: string;
  gameId: string;
  gameSeed?: string;
  gameStringType: string;
}

interface GameInfosInput {
  coinType: string;
  corePackageId: string;
  gameSeed: string;
  moduleName: string;
  transactionResult: ExecutedTransaction;
}

interface GenericGameInfosInput {
  filterString: string;
  gameSeed: string;
  transactionResult: ExecutedTransaction;
}

interface RouletteTableInfoInput {
  coinType: string;
  gameSeed: string;
  transactionResult: ExecutedTransaction;
}

interface RouletteTableInfo {
  tableId: string;
}

// Function to sleep for a specified duration
export const sleep = (ms: number): any =>
  new Promise((resolve) => setTimeout(resolve, ms));

// gRPC returns fully-padded addresses in type strings (0x0000...0002::sui::SUI)
// while JSON-RPC used the short form (0x2::sui::SUI). Strip leading zeros so
// type keys and comparisons keep their historical shape.
export const shortenAddressesInType = (type: string): string =>
  type.replace(/0x0*([0-9a-fA-F]+)/g, "0x$1");

export const extractGenericTypes = (typeName: string): string[] => {
  const x = typeName.split("<");
  if (x.length > 1) {
    return x[1].replace(">", "").replace(" ", "").split(",");
  } else {
    return [];
  }
};

const getGenericGameInfos = ({
  filterString,
  gameSeed,
  transactionResult,
}: GenericGameInfosInput): GameInfo[] => {
  const { effects, objectTypes } = transactionResult;

  const gameInfos = effects.changedObjects
    .filter(
      ({ objectId, idOperation }) =>
        idOperation === "Created" && objectTypes[objectId] === filterString
    )
    .map(({ objectId }) => {
      const [gameCoinType, gameStringType] = extractGenericTypes(
        objectTypes[objectId] ?? ""
      );

      return { gameId: objectId, gameStringType, gameCoinType, gameSeed };
    });

  return gameInfos;
};

export const getGameInfos = ({
  coinType,
  corePackageId,
  gameSeed,
  moduleName,
  transactionResult,
}: GameInfosInput): GameInfo[] => {
  const filterString = `${corePackageId}::${moduleName}::Game<${coinType}>`;

  return getGenericGameInfos({
    filterString,
    gameSeed,
    transactionResult,
  });
};

export const getRouletteTableInfo = ({
  coinType,
  transactionResult,
}: RouletteTableInfoInput): RouletteTableInfo[] => {
  const filterString = `${ROULETTE_PACKAGE_ID}::${ROULETTE_MODULE_NAME}::RouletteTable<${coinType}>`;

  const { effects, objectTypes } = transactionResult;
  const gameInfos = effects.changedObjects
    .filter(
      ({ objectId, idOperation }) =>
        idOperation === "Created" && objectTypes[objectId] === filterString
    )
    .map(({ objectId }) => ({ tableId: objectId }));

  return gameInfos;
};

function between(x: number, min: number, max: number) {
  return x >= min && x <= max;
}

export const checkComputerBet = (outcome: number, hasPartnerNFT: boolean) => {
  if (between(outcome, 0, hasPartnerNFT ? 295 : 290)) {
    // Computer choose rock
    return 0;
  } else if (between(outcome, 300, hasPartnerNFT ? 595 : 590)) {
    // Computer choose paper
    return 1;
  } else if (between(outcome, 600, hasPartnerNFT ? 895 : 890)) {
    // Computer choose scissors
    return 2;
  } else {
    // Computer use laser beem, you have no way to win
    return 3;
  }
};

export const getRPSResult = (playerBet: number, computerBet: number) => {
  if (computerBet === 3) {
    return "lasterBeem";
  }

  if (playerBet === computerBet) {
    return "draw";
  }

  if (
    (playerBet === 0 && computerBet === 2) ||
    (playerBet === 1 && computerBet === 0) ||
    (playerBet === 2 && computerBet === 1)
  ) {
    return "win";
  }

  return "lose";
};

export const checkBetType = (betType: number) => {
  switch (betType) {
    case 1:
      return "paper";
    case 2:
      return "scissors";
    case 3:
      return "laserBeem";
    case 0:
    default:
      return "rock";
  }
};

export const getAssetIndex = (coinType: string): number => {
  if (coinType === SUI_COIN_TYPE) {
    return 0;
  }
};

export const getVoucherBank = (coinType: string): string => {
  if (coinType === SUI_COIN_TYPE) {
    return SUI_VOUCHER_BANK;
  } else if (coinType === BUCK_COIN_TYPE) {
    return BUCK_VOUCHER_BANK;
  } else {
    throw new Error("Cointype not supported for vouchers");
  }
};

export const getTypesFromVoucher = async (
  voucherId: string,
  suiClient: SuiGrpcClient
): Promise<string[]> => {
  const { object: voucherIdObject } = await suiClient.getObject({
    objectId: voucherId,
  });
  const voucherIdType = shortenAddressesInType(voucherIdObject.type);
  return [
    getCoinTypeFromVoucher(voucherIdType),
    getVoucherTypeFromVoucher(voucherIdType),
  ];
};

const getCoinTypeFromVoucher = (voucherType: string): string => {
  return voucherType.split("<")[1].split(",")[0];
};

const getVoucherTypeFromVoucher = (voucherType: string): string => {
  return voucherType.split("<")[1].split(", ")[1].replace(">", "");
};

export const getGameSupportedCoinTypes = async (
  suiClient: SuiGrpcClient
): Promise<string[]> => {
  let unihouseFields: SuiClientTypes.DynamicFieldEntry[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await suiClient.listDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor,
    });

    const unihouseList = response.dynamicFields.filter((field) =>
      field.valueType.includes("house::House")
    );

    unihouseFields = unihouseFields.concat(unihouseList);
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }
  const typeList = unihouseFields.map((field) =>
    shortenAddressesInType(
      field.valueType.split("<")?.pop()?.split(">")[0] as string
    )
  );
  return typeList;
};

export function U64FromBytes(x: number[] | Uint8Array) {
  let u64 = BigInt(0);
  for (let i = x.length - 1; i >= 0; i--) {
    u64 = (u64 << BigInt(8)) | BigInt(x[i] ?? 0);
  }
  return u64;
}

// Function to check if an object is in a kiosk, so shouldn't give kiosk Id
export const checkIsInKiosk = async (
  objectId: string,
  suiClient: SuiGrpcClient,
  kioskClient: KioskClient
): Promise<{
  isInKiosk: boolean;
  objectType: string;
  kioskInfo: {
    isLocked: boolean;
    isPersonal: boolean;
    koiskOwnerCapId: string;
    kioskId: string;
    hasLockingRule: boolean;
    royaltyFee: {
      amountBp: number;
      minAmount: string;
    } | null;
    transferPoilcies: TransferPolicy;
  };
}> => {
  let objectData: SuiClientTypes.Object;
  try {
    ({ object: objectData } = await suiClient.getObject({ objectId }));
  } catch {
    throw new Error("Object not found");
  }

  const objectType = shortenAddressesInType(objectData.type);
  const owner = objectData.owner;

  if (owner.$kind === "AddressOwner") {
    return {
      isInKiosk: false,
      objectType: objectType,
      kioskInfo: null,
    };
  }

  const ownerId = owner.ObjectOwner as string;

  if (!ownerId || ownerId === "") {
    throw new Error("Owner not found");
  }

  let ownerObjectData: SuiClientTypes.Object;
  try {
    ({ object: ownerObjectData } = await suiClient.getObject({
      objectId: ownerId,
    }));
  } catch {
    throw new Error("Owner not found");
  }

  const ownerObjectType = shortenAddressesInType(ownerObjectData.type);
  const isKioskItem = ownerObjectType.includes(KIOSK_ITEM);

  if (!isKioskItem) {
    return {
      isInKiosk: false,
      objectType: objectType,
      kioskInfo: null,
    };
  }

  const objectTransferPolicies = await kioskClient.getTransferPolicies({
    type: objectType,
  });

  const itemOwner = ownerObjectData.owner;
  const kioskId = itemOwner.ObjectOwner as string;

  const kiosk = await kioskClient.getKiosk({
    id: kioskId,
    options: {
      withKioskFields: true,
      withListingPrices: true,
    },
  });

  const kioskOwner = kiosk?.kiosk?.owner;

  let allUserKiosks: KioskOwnerCap[] = [];
  let cursorKiosk;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await kioskClient.getOwnedKiosks({
      address: kioskOwner,
      pagination: {
        cursor: cursorKiosk || undefined,
      },
    });

    if (response.kioskOwnerCaps.length > 0) {
      allUserKiosks = allUserKiosks.concat(response.kioskOwnerCaps);
    }

    cursorKiosk = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  const kioskOwnerCap = allUserKiosks?.find((cap) => cap?.kioskId === kioskId);

  const objectKioskInfo = kiosk?.items?.find(
    (item) => item?.objectId === objectId
  );

  const hasLockingRule = objectTransferPolicies.some((policy) =>
    policy.rules.some((rule) => rule.includes(KIOSK_LOCK_RULE))
  );

  const royaltyPolicies = objectTransferPolicies.filter((policy) =>
    policy.rules.some((rule) => rule.includes(ROYALTY_RULE))
  );

  if (royaltyPolicies.length === 0) {
    return {
      isInKiosk: true,
      objectType: objectType,
      kioskInfo: {
        isLocked: objectKioskInfo.isLocked,
        isPersonal: kioskOwnerCap?.isPersonal,
        koiskOwnerCapId: kioskOwnerCap?.objectId,
        kioskId: objectKioskInfo.kioskId,
        hasLockingRule,
        royaltyFee: null,
        transferPoilcies: objectTransferPolicies[0],
      },
    };
  }

  const royaltyRuleType = royaltyPolicies[0].rules.find((rule) =>
    rule.includes(ROYALTY_RULE)
  );

  const { dynamicField } = await suiClient.getDynamicField({
    parentId: royaltyPolicies[0].id,
    name: {
      type: `0x2::transfer_policy::RuleKey<0x${royaltyRuleType}>`,
      bcs: bcs
        .struct("RuleKey", { dummy_field: bcs.Bool })
        .serialize({ dummy_field: false })
        .toBytes(),
    },
  });

  const RoyaltyConfig = bcs.struct("Config", {
    amount_bp: bcs.U16,
    min_amount: bcs.U64,
  });
  const royaltyConfig = RoyaltyConfig.parse(dynamicField.value.bcs);

  const royaltyFeeSettings = {
    amountBp: royaltyConfig.amount_bp,
    minAmount: royaltyConfig.min_amount,
  };

  return {
    isInKiosk: true,
    objectType: objectType,
    kioskInfo: {
      isLocked: objectKioskInfo.isLocked,
      isPersonal: kioskOwnerCap?.isPersonal,
      koiskOwnerCapId: kioskOwnerCap?.objectId,
      kioskId: objectKioskInfo.kioskId,
      hasLockingRule,
      royaltyFee: royaltyFeeSettings,
      transferPoilcies: royaltyPolicies[0],
    },
  };
};

export const checkHasKiosk = async (
  address: string,
  kioskClient: KioskClient
) => {
  const response = await kioskClient.getOwnedKiosks({
    address,
  });

  if (!response.kioskOwnerCaps || response.kioskOwnerCaps.length === 0) {
    return null;
  }

  const normalKioskList = response.kioskOwnerCaps.filter(
    (cap) => !cap.isPersonal
  );

  if (normalKioskList.length === 0) {
    return null;
  }

  return normalKioskList[0];
};

export function sliceArrayIntoChunks(arr: any[], chunkSize: number): any[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}
