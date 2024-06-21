import { SuiTxBlock } from '@scallop-io/sui-kit';

export const testLotteryBuy = async (dbClient, suiKit) => {
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

export const testLotteryGet = async (dbClient, suiKit) => {
    try {
        const lottery = await dbClient.getLottery();

        console.log(lottery);
    } catch (err) {
        console.log(err);
    }
};

export const testLotteryRedeem = async (dbClient, suiKit) => {
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

export const testLotteryResults = async (dbClient, suiKit) => {
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

export const testLotteryTickets = async (dbClient, suiKit) => {
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
