import { SuiTxBlock } from '@scallop-io/sui-kit';

import { SUI_COIN_TYPE } from '../../constants';

export const testLimbo = async (dbClient, suiKit) => {
    const betAmount = 500000000;
    const multiplier = 1.1;

    try {
        const txb = new SuiTxBlock();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createLimbo({
            coin,
            coinType: SUI_COIN_TYPE,
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
            coinType: SUI_COIN_TYPE,
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
