import { SuiKit, SuiTxBlock } from '@scallop-io/sui-kit';

import { DoubleUpClient } from '../client';
import {
    COIN_PACKAGE_ID,
    DICE_PACKAGE_ID,
    LIMBO_PACKAGE_ID,
    PLINKO_PACKAGE_ID
} from "../constants";

const { FUNCTION = "", MNEMONICS = "" } = process.env;

const suiKit = new SuiKit({ mnemonics: MNEMONICS });

const dbClient = new DoubleUpClient({
    coinflipPackageId: COIN_PACKAGE_ID,
    dicePackageId: DICE_PACKAGE_ID,
    limboPackageId: LIMBO_PACKAGE_ID,
    plinkoPackageId: PLINKO_PACKAGE_ID,
    suiClient: suiKit.client()
});

const testCoinflip = async () => {
    // heads
    const betType = 0;
    const betAmount = 500000000;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createCoinflip({
            betType,
            coin,
            coinType,
            transactionBlock: txb.txBlock
        });

        console.log("Added coinflip to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getCoinflipResult({
            betType,
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved coinflip results.");
        console.log(results);
    } catch (err) {
        console.error(err);
    }
};

const testDice = async () => {
    // odd
    const betType = 6;
    const betAmount = 500000000;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        txb.setGasBudget(100000000);

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createDice({
            betType,
            coin,
            coinType,
            transactionBlock: txb.txBlock
        });

        console.log("Added dice to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getDiceResult({
            betType,
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved dice results.");
        console.log(results);
    } catch (err) {
        console.log(err);
    }
};

const testLimbo = async () => {
    const betAmount = 500000000;
    const multiplier = 1.1;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createLimbo({
            coin,
            coinType,
            multiplier,
            transactionBlock: txb.txBlock
        });

        console.log("Added limbo to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getLimboResult({
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved limbo results.");
        console.log(results);
    } catch (err) {
        console.log(err);
    }
};

const testPlinko = async () => {
    const betAmount = 500000000;
    const numberOfDiscs = 1;
    
    // 6 Rows
    const plinkoType = 0;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createPlinko({
            betAmount,
            coin,
            coinType,
            numberOfDiscs,
            plinkoType,
            transactionBlock: txb.txBlock
        });

        console.log("Added plinko to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getPlinkoResult({
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved plinko results.");
        console.log(results);
    } catch (err) {
        console.log(err);
    }
};

((fnName) => {
    switch (fnName) {
        case 'coinflip':
            testCoinflip();
            break;
        case 'dice':
            testDice();
            break;
        case 'limbo':
            testLimbo();
            break;
        case 'plinko':
            testPlinko();
            break;
        default:
            console.error("Use dedicated test function to test an individual game.\n");
    }
})(FUNCTION);
