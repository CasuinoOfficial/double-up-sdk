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
    RANGE_DICE_MODULE_NAME,
    RANGE_DICE_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

// Note: 0 = Over, 1 = Under
type OverUnderBet = 0 | 1;

// Note: 2 = Inside, 3 = Outside
type InsideOutsideBet = 2 | 3;

type RangeDiceResult = any;

export interface RangeDiceInput {
    betType: OverUnderBet | InsideOutsideBet;
    coin: TransactionObjectArgument;
    coinType: string;
    range: number | number[];
    transactionBlock: TransactionBlockType;
}

interface InternalRangeDiceInput extends RangeDiceInput {
    rangeDicePackageId: string;
}

interface RangeDiceParsedJson {
    bet_id: string;
    outcome: string;
    player: string;
    settlements: RangeDiceSettlement[];
}

interface RangeDiceSettlement {
    bet_size: string;
    payout_amount: string;
    player_won: boolean;
    win_condition: WinCondition;
}

export interface RangeDiceResultInput {
    betType: OverUnderBet | InsideOutsideBet;
    coinType: string;
    gameSeed: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalRangeDiceResultInput extends RangeDiceResultInput {
    rangeDiceCorePackageId: string;
    suiClient: SuiClient;
}

// export interface DiceResponse {
//     ok: boolean;
//     err?: Error;
//     gameSeed?: string;
//     receipt?: TransactionArgument;
// }

export interface RangeDiceResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface RangeDiceResultResponse {
    ok: boolean;
    err?: Error;
    results?: RangeDiceResult[];
    rawResults?: RangeDiceParsedJson[];
    txDigests?: string[];
}

interface WinCondition {
    vec: WinRange[];
}

interface WinRange {
    from: string;
    to: string;
}

const isOverUnder = (betType: OverUnderBet | InsideOutsideBet): betType is OverUnderBet =>
    betType === 0 || betType === 1;

const isInsideOutside = (betType: OverUnderBet | InsideOutsideBet): betType is InsideOutsideBet =>
    betType === 2 || betType === 3;

const isRangeNumber = (range: number | number[]): range is number => typeof range === 'number';

const isRangeArray = (range: number | number[]): range is number[] => typeof range[0] === 'number';

// Start ranged dice game
export const createRangeDice = ({
    betType,
    coin,
    coinType,
    range,
    transactionBlock,
    rangeDicePackageId
}: InternalRangeDiceInput): RangeDiceResponse => {
    let res: RangeDiceResponse = { ok: true };

    try {
        // This adds some extra entropy to the weighted dice itself
        const userRandomness = Buffer.from(nanoid(512), 'utf8');

        if (isOverUnder(betType) && isRangeNumber(range)) {
            const [receipt] = transactionBlock.moveCall({
                target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_over_under_game`,
                typeArguments: [coinType],
                arguments: [
                    transactionBlock.object(UNI_HOUSE_OBJ),
                    transactionBlock.object(BLS_VERIFIER_OBJ),
                    transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
                    transactionBlock.pure(range),
                    transactionBlock.pure(betType),
                    coin,
                ]
            });

            res.receipt = receipt;
        } else if (isInsideOutside(betType) && isRangeArray(range) && range.length === 2) {
            const [receipt] = transactionBlock.moveCall({
                target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_range_game`,
                typeArguments: [coinType],
                arguments: [
                    transactionBlock.object(UNI_HOUSE_OBJ),
                    transactionBlock.object(BLS_VERIFIER_OBJ),
                    transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
                    transactionBlock.pure(range[0]),
                    transactionBlock.pure(range[1]),
                    transactionBlock.pure(betType),
                    coin,
                ]
            });

            res.receipt = receipt;
        } else {
            throw new Error('invalid bet type or range');
        }

        res.gameSeed = Buffer.from(userRandomness).toString("hex");
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getRangeDiceResult = async ({
    betType,
    coinType,
    gameSeed,
    pollInterval = 3000,
    rangeDiceCorePackageId,
    suiClient,
    transactionResult
}: InternalRangeDiceResultInput): Promise<RangeDiceResultResponse> => {
    let res: RangeDiceResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfos({
            coinType,
            corePackageId: rangeDiceCorePackageId,
            gameSeed,
            moduleName: RANGE_DICE_MODULE_NAME,
            structName: RANGE_DICE_STRUCT_NAME,
            transactionResult
        });

        let results: (OverUnderBet | InsideOutsideBet)[] = [];
        let rawResults: RangeDiceParsedJson[] = [];
        let txDigests: string[] = [];

        while (results.length === 0) {
            try {
                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${rangeDiceCorePackageId}::${RANGE_DICE_MODULE_NAME}::${RANGE_DICE_STRUCT_NAME}>`
                    },
                    limit: 50,
                    order: 'descending'
                });

                results = events.data.reduce((acc, current) => {
                    const {
                        bet_id,
                        settlements
                    } = current.parsedJson as RangeDiceParsedJson;

                    if (bet_id == gameInfos[0].gameId) {
                        const { player_won } = settlements[0];

                        rawResults.push(current.parsedJson as RangeDiceParsedJson);
                        txDigests.push(current.id.txDigest);

                        let res: OverUnderBet | InsideOutsideBet;

                        if (player_won) {
                            res = betType;
                        } else {
                            switch (betType) {
                                case 0:
                                    res = 1;
                                    break;
                                case 1:
                                    res = 0;
                                    break;
                                case 2:
                                    res = 3;
                                    break;
                                case 3:
                                    res = 2;
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
