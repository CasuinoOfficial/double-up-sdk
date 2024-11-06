import { SuiClient, SuiTransactionBlockResponse, DynamicFieldInfo} from "@mysten/sui/client";

import {
  BUCK_COIN_TYPE,
  BUCK_VOUCHER_BANK,
  ROULETTE_MODULE_NAME, ROULETTE_PACKAGE_ID,
  SUI_COIN_TYPE,
  SUI_VOUCHER_BANK,
  UNI_HOUSE_OBJ_ID,
} from "../constants/mainnetConstants";

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
}

const getCoinTypeFromVoucher = (voucherType: string): string => {
  return voucherType.split("<")[1].split(",")[0];
}

const getVoucherTypeFromVoucher = (voucherType: string): string => {
  return voucherType.split("<")[1].split(", ")[1].replace(">", "");
}

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
      (field: DynamicFieldInfo) => field?.objectType.includes("house::House"),
    );

    if (unihouseList) {
      unihouseFields = unihouseFields.concat(unihouseList);
    }
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }
  const typeList = unihouseFields.map((field) => field.objectType.split("<")?.pop()?.split(">")[0] as string);
  return typeList;
}