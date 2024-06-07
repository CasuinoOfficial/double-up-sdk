import { SuiKit, SuiTxBlock } from '@scallop-io/sui-kit';

import { DoubleUpClient } from '../client';

const { FUNCTION = "", MNEMONICS = "" } = process.env;

const suiKit = new SuiKit({ mnemonics: MNEMONICS });

const DESUI_LIMBO_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";
// const DESUI_LIMBO_CORE_PACKAGE_ID = "0x1dca00f307864afee72bb2ba1efc3a3d3ba27b38382b5db7635d8be370467dd7";
const DESUI_LIMBO_CORE_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";

// const DESUI_PLINKO_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_CORE_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_VERIFIER_ID = "0x85fed939bc09d61a314a9c0d4d16370be788a538f351b82b6b3db1ae4f1c7374";

const dbClient = new DoubleUpClient({
    limboCorePackageId: DESUI_LIMBO_CORE_PACKAGE_ID,
    limboPackageId: DESUI_LIMBO_PACKAGE_ID,

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

((fnName, mnemonic) => {
    if (mnemonic !== "") {
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
    } else {
        console.error("You must supply your wallet mnemonics in the .env file to test.\n");
    }
})(FUNCTION, MNEMONICS);
