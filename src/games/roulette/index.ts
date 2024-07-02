import { bcs } from "@mysten/sui.js/bcs";
import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import { nanoid } from 'nanoid';

import {
    BLS_VERIFIER_OBJ,
    ROULETTE_CONFIGS,
    ROULETTE_MODULE_NAME,
    UNI_HOUSE_OBJ,
    RouletteConfig,
    ROULETTE_BET_SETTLED_EVENT
} from "../../constants";
import { getRouletteTableInfo, sleep } from "../../utils";

type BetRed = 0;
type BetBlack = 1;

type BetNumber = 2;

type BetEven = 3;
type BetOdd = 4;

type BetFirstTwelve = 5;
type BetSecondTwelve = 6;
type BetThirdTwelve = 7;

type BetFirstEighteen = 8;
type BetSecondEighteen = 9;

type BetFirstColumn = 10;
type BetSecondColumn = 11;
type BetThirdColumn = 12;

type RouletteBet = BetRed | BetBlack | BetNumber | BetEven | BetOdd | BetFirstTwelve | BetSecondTwelve | BetThirdTwelve | BetFirstEighteen | BetSecondEighteen | BetFirstColumn | BetSecondColumn | BetThirdColumn;

export interface CreatedRouletteTableInput {
    coinType: string;
    transactionResult: SuiTransactionBlockResponse;
}

interface InternalCreatedRouletteTableInput extends CreatedRouletteTableInput {
    roulettePackageId: string;
}

export interface CreatedRouletteTableResponse {
    ok: boolean;
    err?: Error;
    result?: RouletteTable;
}

interface RouletteTable {
    tableId: string;
}

export interface RouletteAddBetInput {
    address: string;
    betNumber?: number;
    betType: RouletteBet;
    coin: TransactionObjectArgument;
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteAddBetInput extends RouletteAddBetInput {
    origin: string;
    roulettePackageId: string;
}

export interface RouletteAddBetResponse {
    ok: boolean;
    err?: Error;
    betId?: TransactionArgument;
}

interface RouletteParsedJson {
    bet_id: string;
    creator: string;
    outcome: string;
    round_number: string;
    table_id: string;
}

interface BetResult {
    bet_id: string;
    is_win: string;
    bet_type: number;
    bet_number: number;
    bet_size: string;
    player: string;
}

interface BetSettledEvent {
    table_id: string;
    total_volume: number;
    round_number: string;
    creator: string;
    bet_results: BetResult[];
    origin: string;
}

export interface RouletteRemoveBetInput {
    betId: string;
    coinType: string;
    player: string;
    tableOwner: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteRemoveBetInput extends RouletteRemoveBetInput {
    origin: string;
    roulettePackageId: string;
}

export interface RouletteRemoveBetResponse {
    ok: boolean;
    err?: Error;
    returnedCoin?: TransactionArgument;
}

export interface RouletteResultInput {
    coinType: string;
    gameSeed: string;
    roundNumber: string;
    pollInterval?: number;
    transactionResult: SuiTransactionBlockResponse;
    withJson?: boolean;
}

interface InternalRouletteResultInput extends RouletteResultInput {
    rouletteCorePackageId: string;
    suiClient: SuiClient;
}

interface RouletteResult {
    roll: number;
}

export interface RouletteResultResponse {
    ok: boolean;
    err?: Error;
    rawBetResults?: BetSettledEvent[];
    rawResults?: RouletteParsedJson[];
    results?: RouletteResult[];
    txDigests?: string[];
}

export interface RouletteStartInput {
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteStartInput extends RouletteStartInput {
    roulettePackageId: string;
}

export interface RouletteStartResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface RouletteTableInput {
    coinType: string;
    transactionBlock: TransactionBlockType;
}

interface InternalRouletteTableInput extends RouletteTableInput {
    roulettePackageId: string;
}

export interface RouletteTableResponse {
    ok: boolean;
    err?: Error;
    result?: TransactionArgument;
}

export interface RouletteTableExistsInput {
    address: string;
    coinType: string;
}

interface InternalRouletteTableExistsInput extends RouletteTableExistsInput {
    rouletteCorePackageId: string;
    suiClient: SuiClient;
}

export interface RouletteTableExistsResponse {
    ok: boolean;
    roundNumber?: string;
    err?: Error;
    tableExists?: boolean;
}

const getRouletteConfig = (coinType: string): RouletteConfig | undefined => (
    ROULETTE_CONFIGS.find(config => config.coinType === coinType)
);

const isBetNumber = (betType: RouletteBet): betType is BetNumber => betType === 2;

export const addRouletteBet = ({
    address,
    betNumber,
    betType,
    coin,
    coinType,
    origin,
    roulettePackageId,
    transactionBlock
}: InternalRouletteAddBetInput): RouletteAddBetResponse => {
    const res: RouletteAddBetResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        if (isBetNumber(betType)) {
            if (!betNumber) {
                throw new Error('invalid roulette bet');
            } else if (betNumber > 37) {
                throw new Error('roulette bet number is too high');
            }
        } else {
            if (!!betNumber) {
                throw new Error('invalid roulette bet');
            }
        }

        const [betId] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::add_bet`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(rouletteConfig.objectId),
                transactionBlock.pure(address, 'address'),
                coin,
                transactionBlock.pure(betType),
                transactionBlock.pure(bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)),
                transactionBlock.pure(origin)
            ]
        });

        res.betId = betId;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const createRouletteTable = ({
    coinType,
    roulettePackageId,
    transactionBlock
}: InternalRouletteTableInput): RouletteTableResponse => {
    const res: RouletteTableResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const [table] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::create_roulette_table`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(rouletteConfig.objectId)
            ]
        });

        res.result = table;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
}

export const doesRouletteTableExist = async ({
    address,
    coinType,
    rouletteCorePackageId,
    suiClient
}: InternalRouletteTableExistsInput): Promise<RouletteTableExistsResponse> => {
    const res: RouletteTableExistsResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const { data } = await suiClient.getDynamicFieldObject({
            parentId: rouletteConfig.objectId,
            name: {
                type: `${rouletteCorePackageId}::${ROULETTE_MODULE_NAME}::GameTag<${coinType}>`,
                value: {
                    creator: address
                }
            }
        });

        if (data.content?.dataType !== "moveObject") {
            return null;
          }
        
        const fields = data.content.fields as any;
        res.roundNumber = fields.round_number;
        res.tableExists = !!data;
        // res.roundNumber
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getCreatedRouletteTable = ({
    coinType,
    roulettePackageId,
    transactionResult
}: InternalCreatedRouletteTableInput): CreatedRouletteTableResponse => {
    const res: CreatedRouletteTableResponse = { ok: true };

    try {
        const tableId = transactionResult.objectChanges.reduce((acc, current) => {
            if (current.type === 'created' && current.objectType === `${roulettePackageId}::${ROULETTE_MODULE_NAME}::RouletteTable<${coinType}>`) {
                acc = current.objectId;
            }

            return acc;
        }, '');

        if (tableId.length === 0) {
            throw new Error('could not find roulette table');
        }

        res.result = { tableId };
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const getRouletteResult = async ({
    coinType,
    gameSeed,
    rouletteCorePackageId,
    pollInterval = 3000,
    suiClient,
    roundNumber,
    transactionResult,
}: InternalRouletteResultInput): Promise<RouletteResultResponse> => {
    const res: RouletteResultResponse = { ok: true };

    try {
        const gameInfos = getRouletteTableInfo({
            coinType,
            gameSeed,
            transactionResult
        });

        let results: RouletteResult[] = [];
        let rawResults: RouletteParsedJson[] = [];
        let rawBetResults: BetSettledEvent[] = [];
        let txDigests: string[] = [];
        while (results.length === 0) {
            try {
                while(rawBetResults.length === 0) {
                    const { data } = await suiClient.queryEvents({
                        query: {
                          MoveEventType: `${ROULETTE_BET_SETTLED_EVENT}<${coinType}>`,
                        },
                        limit: 50,
                    });
        
                    for (let betEvents of data) {
                        const {
                            table_id,
                            round_number
                        } = betEvents.parsedJson as BetSettledEvent;
                        if (table_id === gameInfos[0].tableId && roundNumber === round_number) {
                            rawBetResults.push(betEvents.parsedJson as BetSettledEvent);
                        };
                    };
                    
                    if (rawBetResults.length === 0) {
                        console.log(`DOUBLEUP - No bet results found found. Trying again in ${pollInterval / 1000} seconds.`);
                        await sleep(pollInterval);
                    }
                }

                const events = await suiClient.queryEvents({
                    query: {
                        MoveEventType: `${rouletteCorePackageId}::${ROULETTE_MODULE_NAME}::BetResolvedEvent<${coinType}>`
                    },
                    limit: 30,
                    order: 'descending',
                });

                results = events.data.reduce((acc, current) => {
                    const {
                        outcome,
                        table_id,
                        round_number
                    } = current.parsedJson as RouletteParsedJson;

                    if (table_id === gameInfos[0].tableId && roundNumber === round_number) {
                        rawResults.push(current.parsedJson as RouletteParsedJson);
                        txDigests.push(current.id.txDigest);
                        acc.push({ roll: outcome });
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
        res.rawBetResults = rawBetResults;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const removeRouletteBet = ({
    betId,
    coinType,
    origin,
    player,
    roulettePackageId,
    tableOwner,
    transactionBlock
}: InternalRouletteRemoveBetInput): RouletteRemoveBetResponse => {
    const res: RouletteRemoveBetResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const [coin] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::remove_bet`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(rouletteConfig.objectId),
                transactionBlock.pure(tableOwner, 'address'),
                transactionBlock.pure(player, 'address'),
                transactionBlock.pure(betId),
                transactionBlock.pure(origin)
            ]
        });

        res.returnedCoin = coin;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};

export const startRoulette = ({
    coinType,
    roulettePackageId,
    transactionBlock
}: InternalRouletteStartInput): RouletteStartResponse => {
    const res: RouletteStartResponse = { ok: true };

    try {
        const rouletteConfig = getRouletteConfig(coinType);

        if (rouletteConfig === undefined) {
            throw new Error('no roulette support for selected coin');
        }

        const userRandomness = Buffer.from(nanoid(512), 'utf8');

        const [,, receipt] = transactionBlock.moveCall({
            target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::start_roll`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(BLS_VERIFIER_OBJ),
                transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
                transactionBlock.object(rouletteConfig.objectId),
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
