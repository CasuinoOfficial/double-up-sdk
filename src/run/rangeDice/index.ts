import { SuiTxBlock } from '@scallop-io/sui-kit';

import { SUI_COIN_TYPE } from '../../constants';

export const testRangeDiceOverUnder = async (dbClient, suiKit) => {
    // over
    const betType = 0;
    const betAmount = 500000000;

    const range = 1;

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createRangeDice({
            betType,
            coin,
            coinType: SUI_COIN_TYPE,
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
            coinType: SUI_COIN_TYPE,
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

export const testRangeDiceInsideOutside = async (dbClient, suiKit) => {
    // inside
    const betType = 2;
    const betAmount = 500000000;

    const range = [3, 4];

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createRangeDice({
            betType,
            coin,
            coinType: SUI_COIN_TYPE,
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
            coinType: SUI_COIN_TYPE,
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
