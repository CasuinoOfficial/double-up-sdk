import { SuiTransactionBlockResponse } from "@mysten/sui/client";

import {
  BLS_SETTLER_MODULE_NAME,
  ROULETTE_CORE_PACKAGE_ID,
  ROULETTE_MODULE_NAME,
  UNIHOUSE_CORE_PACKAGE,
  UNIHOUSE_V4_PACKAGE,
} from "../constants";

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

interface BlsGameInfosInput extends GameInfosInput {
  structName: string;
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

export const getBlsGameInfos = ({
  coinType,
  corePackageId,
  gameSeed,
  moduleName,
  structName,
  transactionResult,
}: BlsGameInfosInput): GameInfo[] => {
  const filterString = `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::BetData<${coinType}, ${corePackageId}::${moduleName}::${structName}>`;

  return getGenericGameInfos({
    filterString,
    gameSeed,
    transactionResult,
  });
};

export const getBlsGameInfosWithDraw = ({
  coinType,
  corePackageId,
  gameSeed,
  moduleName,
  structName,
  transactionResult,
}: BlsGameInfosInput): GameInfo[] => {
  // UNIHOUSE_PACKAGE - BetDataWithDraw did not exist until unihouse v4
  const filterString = `${UNIHOUSE_V4_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::BetDataWithDraw<${coinType}, ${corePackageId}::${moduleName}::${structName}>`;

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
  const filterString = `${ROULETTE_CORE_PACKAGE_ID}::${ROULETTE_MODULE_NAME}::RouletteTable<${coinType}>`;

  const objectChanges = transactionResult.objectChanges;
  const gameInfos = (objectChanges as any[])
    .filter(({ objectType }) => objectType === filterString)
    .map(({ objectId }) => {
      const tableId = objectId as string;

      return { tableId };
    });

  return gameInfos;
};
