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
    COIN_MODULE_NAME,
    COIN_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

// 0: Heads, 1: Tails
type BetType = 0 | 1;

export interface CoinflipInput {
    betType: BetType;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalCoinflipInput extends CoinflipInput {
    coinflipPackageId: string;
}

interface CoinflipSettlement {
    bet_size: string;
    payout_amount: string;
    player_won: boolean;
    win_condition: WinCondition;
}

interface CoinflipParsedJson {
    bet_id: string;
    outcome: string;
    player: string;
    settlements: CoinflipSettlement[];
}

export interface CoinflipResultInput {
    betType: BetType;
    coinType: string;
    gameSeed: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalCoinflipResultInput extends CoinflipResultInput {
    coinflipCorePackageId: string;
    suiClient: SuiClient;
}

export interface CoinflipResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface CoinflipResultResponse {
    ok: boolean;
    err?: Error;
    results?: BetType[];
}

interface WinCondition {
    vec: WinRange[];
}

interface WinRange {
    from: string;
    to: string;
}

// Add coinflip to the transaction block
export const createCoinflip = ({
    betType,
    coin,
    coinflipPackageId,
    coinType,
    transactionBlock
} : InternalCoinflipInput): CoinflipResponse => {
    const res: CoinflipResponse = { ok: true };

    try {
        // This adds some extra entropy to the coinflip itself
        const userRandomness = Buffer.from(nanoid(512), 'utf8');

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

        res.gameSeed = Buffer.from(userRandomness).toString("hex");
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }
    
    return res;
};

export const getCoinflipResult = async ({
    betType,
    coinflipCorePackageId,
    coinType,
    gameSeed,
    pollInterval = 3000,
    suiClient,
    transactionResult
}: InternalCoinflipResultInput): Promise<CoinflipResultResponse> => {
    const res: CoinflipResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfos({
            coinType,
            corePackageId: coinflipCorePackageId,
            gameSeed,
            moduleName: COIN_MODULE_NAME,
            structName: COIN_STRUCT_NAME,
            transactionResult
        });

        let results: BetType[] = [];

        while (results.length === 0) {
            try {
                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${coinflipCorePackageId}::${COIN_MODULE_NAME}::${COIN_STRUCT_NAME}>`
                    },
                    limit: 50,
                    order: 'descending'
                });

                results = events.data.reduce((acc, current) => {
                    const {
                        bet_id,
                        settlements
                    } = current.parsedJson as CoinflipParsedJson;

                    if (bet_id == gameInfos[0].gameId) {
                        const { player_won } = settlements[0];

                        if (player_won) {
                            acc.push(betType === 0 ? 0 : 1);
                        } else {
                            acc.push(betType === 0 ? 1 : 0);
                        }
                    }

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

        res.results = results;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
