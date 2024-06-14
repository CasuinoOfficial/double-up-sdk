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
    RANGE_DICE_CORE_PACKAGE_ID,
    RANGE_DICE_MODULE_NAME,
    RANGE_DICE_STRUCT_NAME,
    UNI_HOUSE_OBJ,
    UNIHOUSE_CORE_PACKAGE
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

// Note: 0 = under, 1 = over
type OverUnderBetType = 0 | 1 ;

type RangeDiceResult = any;

type RangeMin = 0;
type RangeMax = 10000;

export interface RangeDiceInput {
    betType: BetType;
    coin: TransactionObjectArgument;
    coinType: string;
    lower: number;
    transactionBlock: TransactionBlockType;
    upper: number;
}

interface InternalRangeDiceInput extends RangeDiceInput {
    rangeDicePackageId: string;
}

export interface RangeDiceResultInput {
    betType: BetType;
    coinType: string;
    gameSeed: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalRangeDiceResultInput extends RangeDiceResultInput {
    diceCorePackageId: string;
    suiClient: SuiClient;
}

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
}

// Add dice to the transaction block
export const createRangeDice = ({
    betType,
    coin,
    coinType,
    lower,
    rangeDicePackageId,
    transactionBlock,
    upper
}: InternalRangeDiceInput): RangeDiceResponse => {
    const res: RangeDiceResponse = { ok: true };

    try {
        const lowerString = `${lower}`;
        // const middleString = `${middle}`;
        const upperString = `${upper}`;

        // This adds some extra entropy to the dice itself
        const userRandomness = Buffer.from(nanoid(512), 'utf8');

        // transactionBlock.moveCall({
        //     target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_over_under_game`,
        //     typeArguments: [coinType],
        //     arguments: [
        //         transactionBlock.object(UNI_HOUSE_OBJ),
        //         transactionBlock.object(BLS_VERIFIER_OBJ),
        //         transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
        //         transactionBlock.pure(middleString),
        //     ]
        // });

        const [receipt] = transactionBlock.moveCall({
            target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_range_game`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(BLS_VERIFIER_OBJ),
                transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
                transactionBlock.pure(lowerString),
                transactionBlock.pure(upperString),
                transactionBlock.pure(betType),
                coin
            ]
        });

        res.gameSeed = Buffer.from(userRandomness).toString("hex");
        res.receipt = receipt;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getRangeDiceResult = async ({
    betType,
    coinType,
    diceCorePackageId,
    gameSeed,
    pollInterval = 3000,
    suiClient,
    transactionResult
}: InternalDiceResultInput): Promise<DiceResultResponse> => {
    const res: DiceResultResponse = { ok: true };

    try {
        const gameInfos = getBlsGameInfos({
            coinType,
            corePackageId: DICE_CORE_PACKAGE_ID,
            gameSeed,
            moduleName: DICE_MODULE_NAME,
            structName: DICE_STRUCT_NAME,
            transactionResult
        });

        const results = [];

        while (results.length === 0) {
            try {
                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${diceCorePackageId}::${DICE_MODULE_NAME}::${DICE_STRUCT_NAME}>`
                    },
                    limit: 50,
                    order: 'descending'
                });

                events.data.map(event => {
                    console.log(event)
                    console.log(event.parsedJson)
                })

                // results = events.data.reduce((acc, current) => {
                //     const {
                //         bet_id,
                //         settlements
                //     } = current.parsedJson as CoinflipParsedJson;

                //     if (bet_id == gameInfos[0].gameId) {
                //         const { player_won } = settlements[0];

                //         if (player_won) {
                //             acc.push(betType === 0 ? 0 : 1);
                //         } else {
                //             acc.push(betType === 0 ? 1 : 0);
                //         }
                //     }

                //     return acc;
                // }, []);
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
