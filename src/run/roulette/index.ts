import { SuiTxBlock } from '@scallop-io/sui-kit';

import { SUI_COIN_TYPE } from '../../constants';

export const testRouletteAdd = async (dbClient, suiKit) => {
    const betAmount = 500000000;

    // red
    const betType = 0;
    let betNumber;

    // number
    // const betType = 2;
    // const betNumber = 2;

    try {
        const txb = new SuiTxBlock();

        txb.setGasBudget(100000000)

        const address = suiKit.currentAddress();

        const [coin] = txb.splitCoins(txb.gas, [txb.pure(betAmount, "u64")]);

        const { ok, err } = dbClient.addRouletteBet({
            address,
            betNumber,
            betType,
            coin,
            coinType: SUI_COIN_TYPE,
            transactionBlock: txb.txBlock
        });

        console.log("Added roulette bet to transaction block.");

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

export const testRouletteCreate = async (dbClient, suiKit) => {
    try {
        const txb = new SuiTxBlock();

        const { ok: createOk, err: createErr } = dbClient.createRouletteTable({
            coinType: SUI_COIN_TYPE,
            transactionBlock: txb.txBlock
        });

        console.log("Added roulette table create to transaction block.");

        if (!createOk) {
            throw createErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        console.log("Signed and sent transaction.");
        
        const { ok: getOk, getErr, result } = dbClient.getCreatedRouletteTable({
            coinType: SUI_COIN_TYPE,
            transactionResult
        });

        if (!getOk) {
            throw getErr;
        }

        console.log(result);
    } catch (err) {
        console.log(err);
    }
};

export const testRouletteExists = async (dbClient, suiKit) => {
    try {
        const address = suiKit.currentAddress();

        const { ok, err, tableExists } = await dbClient.doesRouletteTableExist({
            address,
            coinType: SUI_COIN_TYPE
        });

        if (!ok) {
            throw err;
        }

        console.log({ tableExists });
    } catch (err) {
        console.log(err);
    }
};

export const testRouletteStart = async (dbClient, suiKit) => {
    try {
        const txb = new SuiTxBlock();

        const address = suiKit.currentAddress();

        const { ok: startOk, err: startErr, gameSeed } = dbClient.startRoulette({
            coinType: SUI_COIN_TYPE,
            transactionBlock: txb.txBlock
        });

        if (!startOk) {
            throw startErr;
        }

        const transactionResult = await suiKit.signAndSendTxn(txb);

        if (transactionResult.effects.status.status === 'failure') {
            throw new Error(transactionResult.effects.status.error);
        }

        const { ok: resultOk, err: resultErr, results } = await dbClient.getRouletteResult({
            coinType: SUI_COIN_TYPE,
            gameSeed,
            transactionResult
        });

        if (!resultOk) {
            throw resultErr;
        }

        console.log(results);
    } catch (err) {
        console.log(err);
    }
};
