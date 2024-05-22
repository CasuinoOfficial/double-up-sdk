import {
    TransactionObjectArgument,
  } from "@mysten/sui.js/transactions";
import { getFullnodeUrl, SuiClient, SuiEvent } from "@mysten/sui.js/client";
import { 
    BLS_VERIFIER_OBJ, 
    COIN_MODULE_NAME, 
    COIN_PACKAGE_ID, 
    LIMBO_MAX_MULTIPLIER, 
    LIMBO_MIN_MULTIPLIER, 
    LIMBO_MODULE_NAME, 
    LIMBO_PACKAGE_ID, 
    UNIHOUSE_PACKAGE, 
    UNI_HOUSE_OBJ } from "./doubleUpConstants";
import { randomBytes } from 'crypto-browserify';

export class DoubleUpClient {

    suiClient: SuiClient;

    constructor({
        suiClient,
    }: {
        suiClient?: SuiClient;
    }) {
        if (suiClient) this.suiClient = suiClient;
        else this.suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
    }

    // Function to add coinflip to the transaction block
    createCoinflip({
        txb,
        coinType,
        betType,
        stakeCoin,
        coinPackageId = '0x68417435d459061e9480fe1ca933415ba550f66b241156c065b3fe2f38fc3657'
    } : {
        txb: any;
        coinType: string;
        betType: 0 | 1;
        stakeCoin: TransactionObjectArgument;
        coinPackageId: string;
    }) {
        // This adds some extra entropy to the coinflip itself
        const userRandomness = randomBytes(512);
        txb.moveCall({
            target: `${coinPackageId}::${COIN_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
              txb.object(UNI_HOUSE_OBJ),
              txb.object(BLS_VERIFIER_OBJ),
              txb.pure(Array.from(userRandomness), "vector<u8>"),
              txb.pure(betType),
              stakeCoin,
            ],    
        });
    };

    // Function to create a weighted flip where the user can select how much multiplier,
    // they want.
    createWeightedFlip({
        txb,
        coinType,
        stakeCoin,
        multiplier,
    } : {
        txb: any;
        coinType: string;
        stakeCoin: TransactionObjectArgument;
        // Multiplier is a string from 1.01 to 100 max
        multiplier: string
    }) {
        if (Number(multiplier) < Number(LIMBO_MIN_MULTIPLIER) || Number(multiplier) > Number(LIMBO_MAX_MULTIPLIER)) {
            return Error("Multiplier out of range");
        };
        // This adds some extra entropy to the coinflip itself.
        const userRandomness = randomBytes(512);

        txb.moveCall({
            target: `${LIMBO_PACKAGE_ID}::${LIMBO_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
              txb.object(UNI_HOUSE_OBJ),
              txb.object(BLS_VERIFIER_OBJ),
              txb.pure(Array.from(userRandomness), "vector<u8>"),
              txb.pure([Math.floor(Number(multiplier) * 100)], "vector<u64>"),
              txb.makeMoveVec({ objects: [stakeCoin] }),
            ],
          });
    };

    async getTransactionCoinflipGameId(
        transactionResult,
        coinType,
        coinPackageId = '0x68417435d459061e9480fe1ca933415ba550f66b241156c065b3fe2f38fc3657',
        pollInterval = 3000,
    ) {
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
                const events = await this.suiClient.queryEvents({
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
                console.log("No events found. Polling again in 5 seconds...");
                await sleep(pollInterval); // Wait for the specified interval
            }
        }
        return resultEvent;
    };

    // async getTransactionWeightedCoinflipGameId(
    //     transactionResult,
    //     coinType,
    //     pollInterval = 3000,
    // ) {
    //     const objectChanges = transactionResult.objectChanges;
    //     const gameInfos = (objectChanges as any[])
    //     .filter(
    //         (change) => {                
    //           let delta = change.objectType === `
    //           ${UNIHOUSE_PACKAGE}::bls_settler::BetData<${coinType}, 
    //           ${LIMBO_CORE_PACKAGE_ID}::limbo::Limbo>`;
    //           return delta;
    //         }
    //       )
    //     .map((change) => {
    //       const gameCoinType = extractGenericTypes(
    //         change.objectType ?? "",
    //       )[0];
    //       const gameStringType = extractGenericTypes(
    //         change.objectType ?? "",
    //       )[1];
    //       const gameId = change.objectId as string;
    //       return { gameId, gameStringType, gameCoinType };
    //     });
    //     let resultEvent: SuiEvent[] = [];
        
    //     while (resultEvent.length === 0) {
    //         try {
    //             const events = await this.suiClient.queryEvents({
    //                 query: {
    //                     MoveEventModule: {
    //                         module: "bls_settler",
    //                         package: UNIHOUSE_PACKAGE,
    //                     }
    //                 },
    //                 limit: 50,
    //             });
    //             resultEvent = events.data.filter((event: any) => {
    //                 event.parsedJson.gameId === gameInfos[0].gameId
    //             });
    //         } catch (error) {
    //             console.error("Error querying events:", error);
    //         };

    //         if (resultEvent.length === 0) {
    //             console.log("No events found. Polling again in 5 seconds...");
    //             await sleep(pollInterval); // Wait for the specified interval
    //         }
    //     }
    //     return resultEvent;
    // };
}

// Function to sleep for a specified duration
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractGenericTypes(typeName: string): string[] {
    const x = typeName.split("<");
    if (x.length > 1) {
      return x[1].replace(">", "").replace(" ", "").split(",");
    } else {
      return [];
    };
  }