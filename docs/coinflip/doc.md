"# Coinflip

Using the doubleup SDK you can integrate seamlessly a coinflip game.


## Things to keep in mind
Under the hood the bet is either a 0 or a 1. On your frontend you can map these numbers however you want, eg 0 is heads and 1 is tails, or the inverse.

The SDK accepts an array of bets (0 and 1s) because you can play more than one game in one go. Like 3 or 10 flips in a row. For a single flip the array should have a single element.


## Preparation
There are quite a long list of coins that doubleup supports.
The example below uses SUI, the most important thing is to make sure you have the coin decimals correct.

The coinflip SDK function requires a coin object for the bet, if it is SUI you can split it from the gas coin, otherwise you will have to split it from a Coin object.

## Code example

```ts
const COIN_TYPE = "0x2::sui::SUI";
const COIN_DECIMALS = 9;
// pick is either 0 or 1 you may set 0 and 1 be whatever you prefer for example:
const coinSideToNumber: {[key: string]: 0 | 1} = {
    "heads": 0,
    "tails": 1
};

const coinflipTx = async (
    pick: "heads" | "tails",
    amount: number
) => {
    const tx = new Transaction();

    // get coin
    // tx.gas only works with SUI
    const coin = tx.splitCoins(tx.gas, [amount * 10**COIN_DECIMALS]);
    DBClient.createCoinflip({
        betTypes: [coinSideToNumber[pick]], // this is an array, 1 element means 1 flip, 2 elements mean 2 flips...
        coinType: COIN_TYPE,
        coin,
        transaction: tx,
        origin: "Project Name"
    });

    // here you will have to sign and execute using the user's wallet on the frontend side
    // in the demo we use a private key
    const keypair = getSigner();
    const response = await DBClient.suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: {
            showEffects: true,
            showEvents: true
        }
    });

    console.log(response);
    console.log(`Coinflip transaction status is ${response.effects?.status.status}`);

    // getting the result from the event
    const evt = response.events?.filter(event => event.type.includes("BetResults"))[0];
    const eventResults = evt?.parsedJson as any;
    console.log(eventResults);
    console.log(`The bet ${Number(eventResults.bets[0].bet_returned) > 0 ? "won" : "lost"}`);
    console.log(`Bet amount: ${Number(eventResults.bets[0].bet_size) / 10**COIN_DECIMALS} ${COIN_TYPE}`);
    console.log(`Won amount: ${eventResults.bets[0].bet_returned}`);
    // The outcome decides if the bet wins, for coinflip if the bet is 0 an outcome less than 500 wins
    // and if the bet is 1 an outcome more than 500 wins
    console.log(`Random outcome: ${eventResults.bets[0].outcome}`);
}
```

## Explanation

The main function you need is `createCoinflip`;

*Arguments*
The arguments are an object with the following fields:

betTypes: array[0|1] 
`betTypes` is an number array of 0 and 1, each element represents one coinflip.

coinType: string
`coinType` is the type of the coin to be used in the form `<package id>::<module name>::<Struct name>`, for example
for usdc the correct would be: `0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC`

coin: TransactionObjectArgument
`coin` is the TS SDK representation of an on-chain coin object, in the most simple form it can be created with
`tx.object(<coin-id>)` but usually you will have to have a splitCoins command in the PTB before the coinflip transactions that will produce the required coin, like in the example.

transaction: Transaction
Before calling the `createCoinflip` method you will need to create a Transaction using the `@mysten/sui` typescript SDK. This SDK is a dependency of the doubleup SDK so it will be available by default.
`const tx = new Transaction()` is the most usual way to create a Transaction.


## Errors
Errors will appear if the arguments are incorrect, or some Sui blockchain generic errors like `Insufficient gas`,
if you encounter any weird error please contact us."