import { SuiClient } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { randomBytes } from 'crypto-browserify';

import { 
  BLS_VERIFIER_OBJ, 
  LIMBO_MAX_MULTIPLIER, 
  LIMBO_MIN_MULTIPLIER, 
  LIMBO_MODULE_NAME,
  UNI_HOUSE_OBJ
} from "../../constants";
import { extractGenericTypes, sleep } from "../../utils";

export interface LimboInput {
    coin: TransactionObjectArgument;
    coinType: string;
    multiplier: number;
    transactionBlock: TransactionBlockType;
}

interface InternalLimboInput extends LimboInput {
    limboPackageId: string;
}

export interface LimboGameIdInput {
    coinType: string;
    pollInterval: number;
    transactionResult: any;
}

interface InternalLimboGameIdInput extends LimboGameIdInput {
    suiClient: SuiClient;
}

export interface LimboResponse {
    ok: boolean;
    err?: Error;
    receipt?: TransactionArgument;
}

// Weighted flip where the user can select how much multiplier they want.
export const createLimbo = ({
    coin,
    coinType,
    limboPackageId,
    multiplier,
    transactionBlock
}: InternalLimboInput): LimboResponse => {
    const res: LimboResponse = { ok: true };

    try {
        if (Number(multiplier) < Number(LIMBO_MIN_MULTIPLIER) || Number(multiplier) > Number(LIMBO_MAX_MULTIPLIER)) {
            throw new Error("Multiplier out of range");
        };
        
        // This adds some extra entropy to the coinflip itself.
        const userRandomness = randomBytes(512);
    
        const [receipt] = transactionBlock.moveCall({
            target: `${limboPackageId}::${LIMBO_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
              transactionBlock.object(UNI_HOUSE_OBJ),
              transactionBlock.object(BLS_VERIFIER_OBJ),
              transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
              transactionBlock.pure([Math.floor(Number(multiplier) * 100)], "vector<u64>"),
              transactionBlock.makeMoveVec({ objects: [coin] }),
            ],
        });
    
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

// export const getTransactionLimboGameId = async ({
//     transactionResult,
//     coinType,
//     pollInterval = 3000,
//     suiClient
// }: InternalLimboGameIdInput) {
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
//             const events = await suiClient.queryEvents({
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
//             console.log(`No events found. Polling again in ${pollInterval * 1000} seconds...`);
//             await sleep(pollInterval);
//         }
//     }
//     return resultEvent;
// };
