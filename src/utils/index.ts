import {
  SuiClient,
  SuiTransactionBlockResponse,
  DynamicFieldInfo,
} from "@mysten/sui/client";

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
  transactionResult: SuiTransactionBlockResponse;
}

interface GenericGameInfosInput {
  filterString: string;
  gameSeed: string;
  transactionResult: SuiTransactionBlockResponse;
}

interface RouletteTableInfoInput {
  coinType: string;
  gameSeed: string;
  transactionResult: SuiTransactionBlockResponse;
}

interface RouletteTableInfo {
  tableId: string;
}

// Function to sleep for a specified duration
export const sleep = (ms: number): any =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
  const objectChanges = transactionResult.objectChanges;

  const gameInfos = (objectChanges as any[])
    .filter(({ objectType }) => objectType === filterString)
    .map(({ objectId, objectType }) => {
      const [gameCoinType, gameStringType] = extractGenericTypes(
        objectType ?? ""
      );
      const gameId = objectId as string;

      return { gameId, gameStringType, gameCoinType, gameSeed };
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

  const objectChanges = transactionResult.objectChanges;
  const gameInfos = (objectChanges as any[])
    .filter(({ objectType }) => objectType === filterString)
    .map(({ objectId }) => {
      const tableId = objectId as string;

      return { tableId };
    });

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
  suiClient: SuiClient
): Promise<string[]> => {
  const { data: voucherIdObject } = await suiClient.getObject({
    id: voucherId,
    options: {
      showType: true,
    },
  });
  const voucherIdType = voucherIdObject.type;
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
  suiClient: SuiClient
): Promise<string[]> => {
  let unihouseFields: DynamicFieldInfo[] = [];
  let cursor;
  let hasNextPage = true;

  while (hasNextPage) {
    const response: any = await suiClient.getDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor: cursor || null,
    });

    const dynamicFields = response.data;
    const unihouseList: DynamicFieldInfo[] = dynamicFields?.filter(
      (field: DynamicFieldInfo) => field?.objectType.includes("house::House")
    );

    if (unihouseList) {
      unihouseFields = unihouseFields.concat(unihouseList);
    }
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }
  const typeList = unihouseFields.map(
    (field) => field.objectType.split("<")?.pop()?.split(">")[0] as string
  );
  return typeList;
};

export function U64FromBytes(x: number[]) {
  let u64 = BigInt(0);
  for (let i = x.length - 1; i >= 0; i--) {
    u64 = (u64 << BigInt(8)) | BigInt(x[i] ?? 0);
  }
  return u64;
}

// Function to check if an object is in a kiosk, so shouldn't give kiosk Id
export const checkIsInKiosk = async (
  objectId: string,
  suiClient: SuiClient,
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
  const { data: objectData } = await suiClient.getObject({
    id: objectId,
    options: {
      showType: true,
      showOwner: true,
    },
  });

  if (!objectData) {
    throw new Error("Object not found");
  }

  const objectType = objectData?.type;
  const owner = objectData?.owner as Record<string, string>;

  if (owner.hasOwnProperty("AddressOwner")) {
    return {
      isInKiosk: false,
      objectType: objectType,
      kioskInfo: null,
    };
  }

  const ownerId = owner?.ObjectOwner as string;

  if (!ownerId || ownerId === "") {
    throw new Error("Owner not found");
  }

  const { data: ownerObjectData } = await suiClient.getObject({
    id: ownerId,
    options: {
      showType: true,
      showContent: true,
      showOwner: true,
    },
  });

  if (!ownerObjectData) {
    throw new Error("Owner not found");
  }

  const ownerObjectType = ownerObjectData?.type;
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

  const itemOwner = ownerObjectData?.owner as any;
  const kioskId = itemOwner?.ObjectOwner as string;

  const kiosk = await kioskClient.getKiosk({
    id: kioskId,
    options: {
      withKioskFields: true,
      withListingPrices: true,
    },
  });

  const kioskOwner = kiosk?.kiosk?.owner;

  const { kioskOwnerCaps, kioskIds } = await kioskClient.getOwnedKiosks({
    address: kioskOwner,
  });

  const kioskOwnerCap = kioskOwnerCaps?.find((cap) => cap?.kioskId === kioskId);

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

  const royaltyPoliciesDynamicFields = await suiClient.getDynamicFieldObject({
    parentId: royaltyPolicies[0].id,
    name: {
      type: `0x2::transfer_policy::RuleKey<0x${royaltyRuleType}>`,
      value: { dummy_field: false },
    },
  });

  const royaltyPoliciesContent = royaltyPoliciesDynamicFields.data.content;

  if (royaltyPoliciesContent.dataType !== "moveObject") {
    throw new Error("Invalid royalty rule object type");
  }

  const fields = royaltyPoliciesContent.fields as any;

  const royaltyFeeSettings = {
    amountBp: fields?.value.fields.amount_bp,
    minAmount: fields?.value.fields.min_amount,
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

  console.log("kioskOwnerCaps", response.kioskOwnerCaps);

  return response.kioskOwnerCaps.filter((cap) => !cap.isPersonal)[0];
};
