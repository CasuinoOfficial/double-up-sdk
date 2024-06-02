import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";

import { UNIHOUSE_CORE_PACKAGE } from "../constants";

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

// Function to sleep for a specified duration
export const sleep = (ms: number): any => (
    new Promise(resolve => setTimeout(resolve, ms))
);

export const extractGenericTypes = (typeName: string): string[] => {
    const x = typeName.split("<");
    if (x.length > 1) {
      return x[1].replace(">", "").replace(" ", "").split(",");
    } else {
      return [];
    };
};

const getGenericGameInfos = ({
    filterString,
    gameSeed,
    transactionResult
}: GenericGameInfosInput): GameInfo[] => {
    const objectChanges = transactionResult.objectChanges;

    const gameInfos = (objectChanges as any[])
        .filter(({ objectType }) => objectType === filterString)
        .map(({ objectId, objectType }) => {
            const [gameCoinType, gameStringType] = extractGenericTypes(objectType ?? "");
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
    transactionResult
}: GameInfosInput): GameInfo[] => {
    const filterString = `${corePackageId}::${moduleName}::Game<${coinType}>`;

    return getGenericGameInfos({
        filterString,
        gameSeed,
        transactionResult
    });
};

export const getBlsGameInfos = ({
    coinType,
    corePackageId,
    gameSeed,
    moduleName,
    structName,
    transactionResult
}: BlsGameInfosInput): GameInfo[] => {
    const filterString = `${UNIHOUSE_CORE_PACKAGE}::bls_settler::BetData<${coinType}, ${corePackageId}::${moduleName}::${structName}>`;

    return getGenericGameInfos({
        filterString,
        gameSeed,
        transactionResult
    });
};
