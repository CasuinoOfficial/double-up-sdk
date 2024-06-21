import { SuiTxBlock } from '@scallop-io/sui-kit';

import { SUI_COIN_TYPE } from '../../constants';

export const testDice = async (dbClient, suiKit) => {
    // even
    const betType = 6;
    const betAmount = 500000000;

    try {
        const txb = new SuiTxBlock();

        txb.setGasBudget(100000000);

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok: gameOk, err: gameErr, gameSeed } = dbClient.createDice({
            betType,
            coin,
            coinType: SUI_COIN_TYPE,
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