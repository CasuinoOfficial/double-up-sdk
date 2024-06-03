import { SuiClient, SuiTransactionBlockResponse, getFullnodeUrl } from "@mysten/sui.js/client";
import {
    TransactionArgument,
    TransactionBlock as TransactionBlockType,
    TransactionObjectArgument
} from "@mysten/sui.js/transactions";

import axios from "axios";
import { randomBytes } from 'crypto-browserify';

import {
    DESUI_PLINKO_CORE_PACKAGE_ID,
    DESUI_PLINKO_MODULE_NAME,
    DESUI_PLINKO_VERIFIER_ID,
    DESUI_PLINKO_VERIFIER_OBJ,
    DOUBLE_UP_API,
    PLINKO_CORE_PACKAGE_ID,
    PLINKO_MODULE_NAME,
    PLINKO_VERIFIER_ID,
    UNI_HOUSE_OBJ
} from "../../constants";
import { getGameInfos } from "../../utils";

interface PlinkoResult {
    ballCount: string;
    betSize: string;
    pnl: string;
}

// 0: 6 Rows, 1: 9 Rows, 2: 12 Rows
type PlinkoType = 0 | 1 | 2;

export interface PlinkoInput {
    betAmount: number;
    coin: TransactionObjectArgument;
    coinType: string;
    numberOfDiscs: number;
    plinkoType: PlinkoType;
    transactionBlock: TransactionBlockType;
}

interface InternalPlinkoInput extends PlinkoInput {
    plinkoPackageId: string;
}

export interface PlinkoResultInput {
    coinType: string;
    gameSeed: string;
    transactionResult: SuiTransactionBlockResponse;
}

export interface PlinkoResponse {
    ok: boolean;
    err?: Error;
    gameSeed?: string;
    receipt?: TransactionArgument;
}

export interface PlinkoResultResponse {
    ok: boolean;
    err?: Error;
    results?: PlinkoResult[];
}

export const createPlinko = ({
    betAmount,
    coin,
    coinType,
    numberOfDiscs,
    plinkoPackageId,
    plinkoType,
    transactionBlock,
}: InternalPlinkoInput): PlinkoResponse => {
    const res: PlinkoResponse = { ok: true };

    try {
        const userRandomness = randomBytes(512);

        const [_, receipt] = transactionBlock.moveCall({
            target: `${DESUI_PLINKO_CORE_PACKAGE_ID}::${DESUI_PLINKO_MODULE_NAME}::start_game`,
            typeArguments: [coinType],
            arguments: [
                transactionBlock.object(UNI_HOUSE_OBJ),
                transactionBlock.object(DESUI_PLINKO_VERIFIER_ID),
                transactionBlock.pure(numberOfDiscs),
                transactionBlock.pure(betAmount),
                transactionBlock.pure(plinkoType),
                transactionBlock.pure(Array.from(userRandomness), "vector<u8>"),
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

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getPlinkoResult = async ({
    coinType,
    gameSeed,
    transactionResult,
}: PlinkoResultInput): Promise<PlinkoResultResponse> => {
    const res: PlinkoResultResponse = { ok: true };

    try {
        const gameInfos = getGameInfos({
            coinType,
            corePackageId: DESUI_PLINKO_CORE_PACKAGE_ID,
            gameSeed,
            moduleName: PLINKO_MODULE_NAME,
            transactionResult
        });

        let suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

        let gameObject: any = transactionResult
            .objectChanges.filter((e) => e.type ==='created' 
            && e.objectType ==='0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3::plinko::Game<0x2::sui::SUI>'
        )[0];
        console.log('game obj', gameObject.objectId);

        // Sleep 5 seconds here to guarantee that the backend picks it up
        await sleep(10000);

        // let gameId = gameObject
        let plinkoEvents = await suiClient.queryEvents({
            /// This is one option, another one is actually querying the event type specifically and hard coding for that.
            query: {
                MoveEventType: '0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3::plinko::Outcome<0x2::sui::SUI>'
            },
            limit: 5,
            order: 'descending'
        });
        // console.log(plinkoEvents);
        let outCome: any = plinkoEvents.data.filter((e: any) => e.parsedJson.game_id === gameObject.objectId)[0];
        console.log('outcome fonud', outCome);

        // if (!settlement.data.results) {
        //     throw new Error('could not determine results');
        // }
    
        const results = [];

        // for (const gameResult of outCome.parsedJson.results) {
        //     console.log(gameResult)
        //     results.push({
        //         ball_index: gameResult.ball_index,
        //         ball_path: gameResult.ball_path,
        //     });
        // }

        res.results = outCome.parsedJson;
    } catch (err) {
        res.ok = false;
        res.err = err;
    }

    return res;
};
