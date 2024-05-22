import { SuiClient, SuiEvent } from "@mysten/sui.js/client";
import {
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument,
    TransactionResult
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  COIN_MODULE_NAME,
  LIMBO_MAX_MULTIPLIER, 
  LIMBO_MIN_MULTIPLIER, 
  LIMBO_MODULE_NAME, 
  LIMBO_PACKAGE_ID, 
  UNIHOUSE_PACKAGE, 
  UNI_HOUSE_OBJ
} from "../../constants";
import { extractGenericTypes, sleep } from "../../utils";

export interface CoinFlipInput {
    betType: 0 | 1;
    coinPackageId: string;
    coinType: string;
    stakeCoin: TransactionObjectArgument;
    transactionBlock: TransactionBlockType;
}

export interface CoinFlipGameIdInput {
    coinPackageId: string;
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalCoinFlipGameIdInput extends CoinFlipGameIdInput {
    suiClient: SuiClient;
}

export interface WeightedCoinFlipInput {
    coinType: string;
    multiplier: number;
    stakeCoin: TransactionObjectArgument;
    transactionBlock: TransactionBlockType;
}

// Add coinflip to the transaction block
export const createCoinflip = ({
    transactionBlock,
    coinType,
    betType,
    stakeCoin,
    coinPackageId = '0x68417435d459061e9480fe1ca933415ba550f66b241156c065b3fe2f38fc3657'
} : CoinFlipInput) => {
    // This adds some extra entropy to the coinflip itself
    const userRandomness = randomBytes(512);

    transactionBlock.moveCall({
        target: `${coinPackageId}::${COIN_MODULE_NAME}::start_game`,
        typeArguments: [coinType],
        arguments: [
          transactionBlock.object(UNI_HOUSE_OBJ),
          transactionBlock.object(BLS_VERIFIER_OBJ),
          transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
          transactionBlock.pure(betType),
          stakeCoin,
        ],    
    });
};

// Weighted flip where the user can select how much multiplier they want.
export const createWeightedFlip = ({
    transactionBlock,
    coinType,
    stakeCoin,
    multiplier,
}: WeightedCoinFlipInput) => {
    if (Number(multiplier) < Number(LIMBO_MIN_MULTIPLIER) || Number(multiplier) > Number(LIMBO_MAX_MULTIPLIER)) {
        return Error("Multiplier out of range");
    };
    
    // This adds some extra entropy to the coinflip itself.
    const userRandomness = randomBytes(512);

    transactionBlock.moveCall({
        target: `${LIMBO_PACKAGE_ID}::${LIMBO_MODULE_NAME}::start_game`,
        typeArguments: [coinType],
        arguments: [
          transactionBlock.object(UNI_HOUSE_OBJ),
          transactionBlock.object(BLS_VERIFIER_OBJ),
          transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
          transactionBlock.pure([Math.floor(Number(multiplier) * 100)], "vector<u64>"),
          transactionBlock.makeMoveVec({ objects: [stakeCoin] }),
        ],
    });
};

export const getTransactionCoinflipGameId = async ({
    transactionResult,
    coinType,
    coinPackageId = '0x68417435d459061e9480fe1ca933415ba550f66b241156c065b3fe2f38fc3657',
    pollInterval = 3000,
    suiClient
}: InternalCoinFlipGameIdInput) => {
    const objectChanges = transactionResult.objectChanges;

    const gameInfos = (objectChanges as any[])
        .filter((change) => {
            let delta =
                change.objectType ===
                `${UNIHOUSE_PACKAGE}::bls_settler::BetData<${coinType}, ${coinPackageId}::${COIN_MODULE_NAME}::Coinflip>`;

            return delta;
        })
        .map((change) => {
            const gameCoinType = extractGenericTypes(
                change.objectType ?? "",
            )[0];
            const gameStringType = extractGenericTypes(
                change.objectType ?? "",
            )[1];

            const gameId = change.objectId as string;
            
            return { gameId, gameStringType, gameCoinType };
    });

    let resultEvent: SuiEvent[] = [];
    
    while (resultEvent.length === 0) {
        try {
            const events = await suiClient.queryEvents({
                query: {
                    MoveEventModule: {
                        module: "bls_settler",
                        package: UNIHOUSE_PACKAGE,
                    }
                },
                limit: 50,
            });

            resultEvent = events.data.filter((event: any) => {
                if (event.parsedJson.bet_id === gameInfos[0].gameId) {
                  return true;
                }
            });
        } catch (error) {
            console.error("Error querying events:", error);
        };

        if (resultEvent.length === 0) {
            console.log(`No events found. Polling again in ${pollInterval * 1000} seconds...`);
            await sleep(pollInterval);
        }
    }
    return resultEvent;
};
