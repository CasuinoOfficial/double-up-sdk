import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { nanoid } from 'nanoid';

import { 
    BLS_SETTLER_MODULE_NAME,
    BLS_VERIFIER_OBJ,
    LIMBO_CORE_PACKAGE_ID,
    LIMBO_MAX_MULTIPLIER, 
    LIMBO_MIN_MULTIPLIER, 
    LIMBO_MODULE_NAME,
    LIMBO_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

type LimboResult = number;

export interface LimboInput {
    coin: TransactionObjectArgument;
    coinType: string;
    multiplier: number;
    transactionBlock: TransactionBlockType;
}

interface LimboParsedJson {
    bet_id: string;
    outcome: string;
    player: string;
    // settlements: CoinflipSettlement[];
}

interface InternalLimboInput extends LimboInput {
    limboPackageId: string;
}

export interface LimboResultInput {
    coinType: string;
    gameSeed: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalLimboResultInput extends LimboResultInput {
    limboCorePackageId: string;
    suiClient: SuiClient;
}

export interface LimboResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface LimboResultResponse {
    ok: boolean;
    err?: Error;
    results?: LimboResult[];
}


const distanceToMultiplier = (distance: number): number => {
    distance /= 100_000;
    const res = (10_000 - distance) / (10_000 - 100 * distance);
  
    if (res > 100) {
      return 100;
    }
  
    return Math.floor(res * 100) / 100;
};

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
        const userRandomness = Buffer.from(nanoid(512), 'utf8');
    
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
    
        res.gameSeed = Buffer.from(userRandomness).toString("hex");
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getLimboResult = async ({
    coinType,
    gameSeed,
    limboCorePackageId,
    pollInterval = 3000,
    suiClient,
    transactionResult
}: InternalLimboResultInput): Promise<LimboResultResponse> => {
    const res: LimboResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfos({
            coinType,
            corePackageId: LIMBO_CORE_PACKAGE_ID,
            gameSeed,
            moduleName: LIMBO_MODULE_NAME,
            structName: LIMBO_STRUCT_NAME,
            transactionResult
        });

        // const settlement = await axios.post(`${DOUBLE_UP_API}/settle`, {
        //     coinType,
        //     gameInfos,
        //     gameName: LIMBO_MODULE_NAME
        // });

        // if (!settlement.data.results) {
        //     throw new Error('could not determine results');
        // }

        let results: LimboResult[] = [];

        while (results.length === 0) {
            try {
                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${limboCorePackageId}::${LIMBO_MODULE_NAME}::LimboResults<${coinType}>`
                        // MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::BetKeyEvent<${coinType}, ${limboCorePackageId}::${LIMBO_MODULE_NAME}::${LIMBO_STRUCT_NAME}>`
                    },
                    limit: 50,
                    order: 'descending'
                });

                results = events.data.reduce((acc, current) => {
                    // const {
                    //     bet_id,
                    //     settlements
                    // } = current.parsedJson as CoinflipParsedJson;

                    // if (bet_id == gameInfos[0].gameId) {
                    //     const { player_won } = settlements[0];

                    //     if (player_won) {
                    //         acc.push(betType === 0 ? "heads" : "tails");
                    //     } else {
                    //         acc.push(betType === 1 ? "tails" : "heads");
                    //     }
                    // }

                    console.log(gameInfos[0].gameId)
                    console.log(current)
                    console.log(current.parsedJson)

                    return acc;
                }, []);
            } catch (err) {
                console.error(`DOUBLEUP - Error querying events: ${err}`);
            }

            if (results.length === 0) {
                console.log(`DOUBLEUP - No results found. Trying again in ${pollInterval / 1000} seconds.`);
                await sleep(pollInterval);
            }
        }

        // for (const gameResult of settlement.data.results) {
        //     if (Number(gameResult[0].outcome) % 69 === 0) {
        //         results.push(1);
        //     } else {
        //         results.push(distanceToMultiplier(Number(gameResult[0].outcome)));
        //     }
        // }

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
