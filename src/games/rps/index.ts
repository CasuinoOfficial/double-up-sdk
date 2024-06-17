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
    RPS_MODULE_NAME,
    RPS_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE
} from "../../constants";
import { getBlsGameInfosWithDraw, sleep } from "../../utils";

// 0: Rock, 1: Paper, 2: Scissors
type BetType = 0 | 1 | 2;

export interface RPSInput {
    betType: BetType;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRPSInput extends RPSInput {
    rpsPackageId: string;
}

interface RPSSettlement {
    bet_size: string;
    payout_amount: string;
    player_won: boolean;
    win_condition: WinCondition;
}

interface RPSParsedJson {
    bet_id: string;
    outcome: string;
    player: string;
    settlements: RPSSettlement[];
}

export interface RPSResultInput {
    betType: BetType;
    coinType: string;
    gameSeed: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalRPSResultInput extends RPSResultInput {
    rpsCorePackageId: string;
    suiClient: SuiClient;
}

export interface RPSResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface RPSResultResponse {
    ok: boolean;
    err?: Error;
    results?: BetType[];
    rawResults?: RPSParsedJson[];
    txDigests?: string[];
}

interface WinCondition {
    vec: WinRange[];
}

interface WinRange {
    from: string;
    to: string;
}

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

// Add coinflip to the transaction block
export const createRockPaperScissors = ({
    betType,
    coin,
    rpsPackageId,
    coinType,
    transactionBlock
} : InternalRPSInput): RPSResponse => {
    const res: RPSResponse = { ok: true };

    try {
        // This adds some extra entropy to the coinflip itself
        const userRandomness = Buffer.from(nanoid(512), 'utf8');

        const [receipt] = transactionBlock.moveCall({
            target: `${rpsPackageId}::${RPS_MODULE_NAME}::start_game`,
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

export const getRockPaperScissorsResult = async ({
    betType,
    rpsCorePackageId,
    coinType,
    gameSeed,
    pollInterval = 3000,
    suiClient,
    transactionResult
}: InternalRPSResultInput): Promise<RPSResultResponse> => {
    const res: RPSResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfosWithDraw({
            coinType,
            corePackageId: rpsCorePackageId,
            gameSeed,
            moduleName: RPS_MODULE_NAME,
            structName: RPS_STRUCT_NAME,
            transactionResult
        });

        let results: BetType[] = [];
        let rawResults: RPSParsedJson[] = [];
        let txDigests: string[] = [];

        while (results.length === 0) {
            try {
                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${rpsCorePackageId}::${RPS_MODULE_NAME}::${RPS_STRUCT_NAME}>`
                    },
                    limit: 50,
                    order: 'descending'
                });

                results = events.data.reduce((acc, current) => {
                    const {
                        bet_id,
                        settlements
                    } = current.parsedJson as RPSParsedJson;

                    if (bet_id == gameInfos[0].gameId) {
                        rawResults.push(current.parsedJson as RPSParsedJson);

                        txDigests.push(current.id.txDigest);

                        const { bet_size, payout_amount } = settlements[0];

                        let res: number;

                        if (bet_size < payout_amount) {
                            // win

                            switch (betType) {
                                case ROCK:
                                    res = SCISSORS;
                                    break;
                                case PAPER:
                                    res = ROCK;
                                    break;
                                case SCISSORS:
                                    res = PAPER;
                                    break;
                            }
                        } else if (bet_size > payout_amount) {
                            // lose

                            switch (betType) {
                                case ROCK:
                                    res = PAPER;
                                    break;
                                case PAPER:
                                    res = SCISSORS;
                                    break;
                                case SCISSORS:
                                    res = ROCK;
                                    break;
                            }
                        } else {
                            // draw

                            switch (betType) {
                                case ROCK:
                                    res = ROCK;
                                    break;
                                case PAPER:
                                    res = PAPER;
                                    break;
                                case SCISSORS:
                                    res = SCISSORS;
                                    break;
                            }
                        }

                        acc.push(res);
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
        res.rawResults = rawResults;
        res.txDigests = txDigests;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
