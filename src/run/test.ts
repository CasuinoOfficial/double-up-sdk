import { SuiKit, SuiTxBlock } from '@scallop-io/sui-kit';

import { DoubleUpClient } from '../client';

const { FUNCTION = "", MNEMONICS = "" } = process.env;

const suiKit = new SuiKit({ mnemonics: MNEMONICS });

// const DESUI_LIMBO_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";
// const DESUI_LIMBO_CORE_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";

// const DESUI_PLINKO_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_CORE_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_VERIFIER_ID = "0x85fed939bc09d61a314a9c0d4d16370be788a538f351b82b6b3db1ae4f1c7374";

// const DESUI_RANGE_DICE_PACKAGE_ID = "0x7a05d26f35fee4e6ab9d59cb6f7f48e90cefe2c0742e304b555fa3be8dcf2cea";
// const DESUI_RANGE_DICE_CORE_PACKAGE_ID = "0x7a05d26f35fee4e6ab9d59cb6f7f48e90cefe2c0742e304b555fa3be8dcf2cea";

const dbClient = new DoubleUpClient({
    // limboCorePackageId: DESUI_LIMBO_CORE_PACKAGE_ID,
    // limboPackageId: DESUI_LIMBO_PACKAGE_ID,
    // plinkoCorePackageId: DESUI_PLINKO_CORE_PACKAGE_ID,
    // plinkoPackageId: DESUI_PLINKO_PACKAGE_ID,
    // plinkoVerifierId: DESUI_PLINKO_VERIFIER_ID,
    // rangeDicePackageId: DESUI_RANGE_DICE_PACKAGE_ID,
    // rangeDiceCorePackageId: DESUI_RANGE_DICE_CORE_PACKAGE_ID,

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

        if (!gameOk || !gameSeed) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        // console.log(transactionResult);

        const {
            ok: resultsOk,
            err: resultsErr,
            results,
            rawResults,
            txDigests
        } = await dbClient.getCoinflipResult({
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
        console.log(rawResults);
        console.log(txDigests);
    } catch (err) {
        console.error(err);
    }
};

const testDice = async () => {
    // even
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

        if (!gameOk || !gameSeed) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        // console.log(transactionResult);

        const {
            ok: resultsOk,
            err: resultsErr,
            results,
            rawResults,
            txDigests
        } = await dbClient.getLimboResult({
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved limbo results.");
        console.log(results);
        console.log(rawResults);
        console.log(txDigests);
    } catch (err) {
        console.log(err);
    }
};

const testLotteryBuy = async () => {
    const amount = 2000000000;

    try {
        const address = suiKit.currentAddress();
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(amount, "u64")]);

        const tickets = [{
            numbers: [27, 15, 30, 7, 11],
            specialNumber: 2
        }];

        const { ok, err } = dbClient.buyLotteryTickets({
            address,
            coin,
            tickets,
            transactionBlock: txb.txBlock
        });

        if (!ok) {
            throw err;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
    } catch (err) {
        console.log(err);
    }
};

const testLotteryGet = async () => {
    try {
        const lottery = await dbClient.getLottery();

        console.log(lottery);
    } catch (err) {
        console.log(err);
    }
};

const testLotteryRedeem = async () => {
    const ticketIds = [
        '0x2532e79226865b41b43781c627a0b11cef15a28267ad971d32fa99c0d2ea956b'
    ];

    try {
        const txb = new SuiTxBlock();

        const { ok, err } = dbClient.redeemLotteryTickets({
            ticketIds,
            transactionBlock: txb.txBlock
        });

        if (!ok) {
            throw err;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
    } catch (err) {
        console.log(err);
    }
};

const testLotteryResults = async () => {
    const round = 8679412;

    try {
        const { ok, err, result } = await dbClient.getLotteryDrawingResult({
            round
        });

        if (!ok) {
            throw err;
        }

        console.log(result);
    } catch (err) {
        console.log(err);
    }
};

const testLotteryTickets = async () => {
    try {
        const address = suiKit.currentAddress();

        const { ok, err, results } = await dbClient.getLotteryTickets({
            address
        });

        if (!ok) {
            throw err;
        }

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

        if (!gameOk || !gameSeed) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        // console.log(transactionResult);

        const {
            ok: resultsOk,
            err: resultsErr,
            results,
            rawResults,
            txDigests
        } = await dbClient.getPlinkoResult({
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved plinko results.");
        console.log(results);
        console.log(rawResults);
        console.log(txDigests);
    } catch (err) {
        console.log(err);
    }
};

const testRangeDiceOverUnder = async () => {
    // over
    const betType = 0;
    const betAmount = 500000000;

    const range = 1;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createRangeDice({
            betType,
            coin,
            coinType,
            range,
            transactionBlock: txb.txBlock
        });

        console.log("Added ranged dice (over/under) to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getRangeDiceResult({
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

const testRangeDiceInsideOutside = async () => {
    // inside
    const betType = 2;
    const betAmount = 500000000;

    const range = [3, 4];

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createRangeDice({
            betType,
            coin,
            coinType,
            range,
            transactionBlock: txb.txBlock
        });

        console.log("Added ranged dice (inside/out) to transaction block.");

        if (!gameOk) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        console.log(transactionResult);

        const { ok: resultsOk, err: resultsErr, results } = await dbClient.getRangeDiceResult({
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

const testRPS = async () => {
    // rock
    const betType = 0;
    const betAmount = 500000000;

    const coinType = "0x2::sui::SUI";

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createRockPaperScissors({
            betType,
            coin,
            coinType,
            transactionBlock: txb.txBlock
        });

        console.log("Added rps to transaction block.");

        if (!gameOk || !gameSeed) {
            throw gameErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        // console.log(transactionResult);

        const {
            ok: resultsOk,
            err: resultsErr,
            results,
            rawResults,
            txDigests
        } = await dbClient.getRockPaperScissorsResult({
            betType,
            coinType,
            gameSeed,
            transactionResult
        });

        if (!resultsOk) {
            throw resultsErr;
        }

        console.log("Retrieved rps results.");
        console.log(results);
        console.log(rawResults);
        console.log(txDigests);
    } catch (err) {
        console.error(err);
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
            case 'insideoutside':
                testRangeDiceInsideOutside();
                break;
            case 'limbo':
                testLimbo();
                break;
            case 'overunder':
                testRangeDiceOverUnder();
                break;
            case 'lottery:get':
                testLotteryGet();
                break;
            case 'lottery:buy':
                testLotteryBuy();
                break;
            case 'lottery:redeem':
                testLotteryRedeem();
                break;
            case 'lottery:results':
                testLotteryResults();
                break;
            case 'lottery:tickets':
                testLotteryTickets();
                break;
            case 'plinko':
                testPlinko();
                break;
            case 'rps':
                testRPS();
                break;
            default:
                console.error("Use dedicated test function to test an individual game.\n");
        }
    } else {
        console.error("You must supply your wallet mnemonics in the .env file to test.\n");
    }
})(FUNCTION, MNEMONICS);
