import { SuiClient, SuiEvent } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  COIN_MODULE_NAME,
  UNIHOUSE_PACKAGE, 
  UNI_HOUSE_OBJ
} from "../../constants";
import { extractGenericTypes, sleep } from "../../utils";

export interface CoinFlipInput {
    betType: 0 | 1;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalCoinFlipInput extends CoinFlipInput {
    coinflipPackageId: string;
}

 export interface CoinFlipGameIdInput {
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalCoinFlipGameIdInput extends CoinFlipGameIdInput {
    coinflipPackageId: string;
    suiClient: SuiClient;
}

export interface CoinFlipResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

// Add coinflip to the transaction block
export const createCoinflip = ({
    betType,
    coin,
    coinflipPackageId,
    coinType,
    transactionBlock
} : InternalCoinFlipInput): CoinFlipResponse => {
    const res: CoinFlipResponse = { ok: true };

    try {
        // This adds some extra entropy to the coinflip itself
        const userRandomness = randomBytes(512);

        const [receipt] = transactionBlock.moveCall({
            target: `${coinflipPackageId}::${COIN_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
            transactionBlock.object(UNI_HOUSE_OBJ),
            transactionBlock.object(BLS_VERIFIER_OBJ),
            transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
            transactionBlock.pure(betType),
            coin,
            ],    
        });

        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }
    
    return res;
};

export const getTransactionCoinflipGameId = async ({
    coinflipPackageId,
    coinType,
    pollInterval = 3000,
    suiClient,
    transactionResult
}: InternalCoinFlipGameIdInput) => {
    const objectChanges = transactionResult.objectChanges;

    const gameInfos = (objectChanges as any[])
        .filter((change) => {
            let delta =
                change.objectType ===
                `${UNIHOUSE_PACKAGE}::bls_settler::BetData<${coinType}, ${coinflipPackageId}::${COIN_MODULE_NAME}::Coinflip>`;

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
