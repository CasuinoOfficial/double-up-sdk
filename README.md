# DoubleUp SDK

## Installation

```sh
$ npm install doubleup
```

## Initialization

JS

```js
import { DoubleUpClient } from 'doubleup';

const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

...

const dbClient = new DoubleUpClient({
    coinflipPackageId: "",
    coinflipCorePackageId: "",
    dicePackageId: "",
    diceCorePackageId: "",
    limboPackageId: "",
    limboCorePackageId: "",
    origin=""
    partnerNftListId: "",
    plinkoPackageId: "",
    plinkoCorePackageId: "",
    plinkoVerifierId: "",
    rangeDicePackageId: "",
    rangeDiceCorePackageId: "",
    rpsPackageId: "",
    rpsCorePackageId: "",
    roulettePackageId="",
    rouletteCorePackageId=""
    suiClient
});
```

React

```js
import { DoubleUpProvider } from 'doubleup';

// or use suiClient from @mysten provider
const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

...

<DoubleUpProvider
    coinflipPackageId=""
    coinflipCorePackageId=""
    dicePackageId=""
    diceCorePackageId=""
    limboPackageId=""
    limboCorePackageId=""
    origin=""
    partnerNftListId=""
    plinkoPackageId=""
    plinkoCorePackageId=""
    plinkoVerifierId=""
    rangeDicePackageId=""
    rangeDiceCorePackageId=""
    rpsPackageId=""
    rpsCorePackageId=""
    roulettePackageId=""
    rouletteCorePackageId=""
    suiClient={suiClient}
>
    <App />
</DoubleUpProvider>
```

## Basic Usage

JS

```js
const { ok: gameOk, err: gameErr, gameSeed, receipt } = dbClient.createCoinflip({
    ...
});

...

const tranactionResult = await signAndExecuteTransactionBlock({ ... });

...

const { ok: resultOk, err: resultErr, results } = await dbClient.getCoinflipResult({
    coinType,
    transactionResult
});
```

React

```js
import { useDoubleUp } from 'doubleup';

...

const { createCoinflip, getCoinflipResult } = useDoubleUp();

...

const { ok: gameOk, err: gameErr, gameSeed } = createCoinflip({
    ...
});

...

const tranactionResult = await signAndExecuteTransactionBlock({ ... });

...

const { ok: resultOk, err: resultErr, results } = await getCoinflipResult({
    betType,
    coinType,
    gameSeed,
    transactionResult
});
```

## Partner NFTs

The following games are enabled for a reduced house edge for holders of selected NFT projects:

- Range Dice
- Rock, Paper, Scissors

When initializing the client or react provider, include the `partnerNftListId` option or prop.

Then, include `partnerNftId` in the call to the game. For example:

```js
<DoubleUpProvider
    {...otherProps},
    partnerNftListId="" <<<<<<<<<<<<
>
    <App />
</DoubleUpProvider>

...

const { ok: gameOk, err: gameErr, gameSeed } = createRangeDice({
    betType,
    coin,
    coinType,
    partnerNftId, <<<<<<<<<<<<
    range,
    transactionBlock: txb
});
```

If the player does not own the NFT passed in, then the call to the contract will fail.

## Games

### Coinflip

betType

| Value | Meaning |
| ----- | ------- |
|   0   |  Heads  |
|   1   |  Tails  |

pollInterval (optional, default: 3000)

milliseconds


```js
const betType = 0;

const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, gameSeed } = createCoinflip({
    betType,
    coin,
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getCoinflipResult({
    betType,
    coinType,
    gameSeed,
    transactionResult
});
```

### Dice

NOTE: NOT CURRENTLY IMPLEMENTED

betType

| Value | Meaning    |
| ----- | ---------- |
| 0 - 5 | Dice Rolls |
|   6   | Odd        |
|   7   | Even       |
|   8   | Small      |
|   9   | Big        |

pollInterval (optional, default: 3000)

milliseconds


```js
const betType = 0;

const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, gameSeed } = createDice({
    betType,
    coin,
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getDiceResult({
    ???
});
```

### Limbo

multiplier

1.01 - 100

pollInterval (optional, default: 3000)

milliseconds


```js
const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, gameSeed } = createLimbo({
    coin,
    coinType,
    multiplier: 50,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getLimboResult({
    coinType,
    gameSeed,
    transactionResult
});
```

### Lottery

#### Buy Ticket

```js
const address = '0x...';

const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(lottery.ticket_cost, "u64")
);

const tickets = [{
    numbers: [27, 15, 30, 7, 11],
    specialNumber: 2
}];

 const { ok, err } = buyLotteryTickets({
    address,
    coin,
    tickets,
    transactionBlock: txb
});
```

#### Get Lottery

```js
const { ok, err, result } = await getLottery();
```

#### Get Lottery History

```js
const { ok, err, results } = await getLotteryHistory();
```

#### Get Lottery Result

```js
const { ok, err, result } = await getLotteryDrawingResult({
    round: 8679412
});
```

#### Get Lottery Tickets

```js
const { ok, err, results } = await getLotteryTickets({
    address: '0x...'
});
```

#### Redeem Lottery Tickets

```js
const ticketIds = [
    '0x...',
    '0x...'
];

const { ok, err, results } = await redeemLotteryTickets({
    ticketIds
});
```

#### 

#### 

### Plinko

numberOfDiscs

1 - 100

plinkoType

| Value | Meaning |
| ----- | ------- |
|   0   | 6 Rows  |
|   1   | 9 Rows  |
|   2   | 12 Rows |

pollInterval (optional, default: 3000)

milliseconds


```js
const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount * numberOfDiscs, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, gameSeed } = createPlinko({
    betAmount,
    coin,
    coinType,
    numberOfDiscs: 50,
    plinkoType: 1,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getPlinkoResult({
    coinType,
    gameSeed,
    transactionResult
});
```

### Range Dice

** If over/under, `range` must be a number. **
** If inside/outside, `range` must be an array of two numbers. **

range

1 - 100

OR

[1 - 100, 1 - 100]

betType

| Value | Meaning |
| ----- | ------- |
|   0   | Over    |
|   1   | Under   |
|   2   | Inside  |
|   3   | Outside |

pollInterval (optional, default: 3000)

milliseconds


```js
const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount * numberOfDiscs, "u64")
);

const coinType = "0x2::sui::SUI";

// EXAMPLE: over
const betType = 0;
const range = 25;

// EXAMPLE: inside
const betType = 2;
const range = [25, 50];

const { ok: gameOk, err: gameErr, gameSeed } = createRangeDice({
    betType,
    coin,
    coinType,
    range,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getRangeDiceResult({
    betType,
    coinType,
    gameSeed,
    transactionResult
});
```

### Roulette

#### Create Table

```js
const coinType = "0x2::sui::SUI";

const { ok, err } = createRouletteTable({
    coinType,
    transactionBlock: txb
});
```

#### Table Existence

```js
const address = "0x...";
const coinType = "0x2::sui::SUI";

const { ok, err, tableExists } = await doesRouletteTableExist({
    address,
    coinType
});
```

#### Add Bet to Table

betType

| Value | Meaning                |
| ----- | ---------------------- |
|   0   | Red                    |
|   1   | Black                  |
|   2   | Number                 |
|   3   | Even                   |
|   4   | Odd                    |
|   5   | 1st 12 (1 - 12)        |
|   6   | 2nd 12 (13 - 24)       |
|   7   | 3rd 12 (25 - 36)       |
|   8   | 1st 18 (1 - 18)        |
|   9   | 2nd 18 (19 - 36)       |
|   10  | 1st Row (1, 4, 7, ...) |
|   11  | 2nd Row (2, 5, 8, ...) |
|   12  | 3rd Row (3, 6, 9, ...) |

```js
const coinType = "0x2::sui::SUI";
const tableOwner = "0x...";

const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

// red
const betType = 0;

const { ok, err, betId } = addRouletteBet({
    address: tableOwner,
    betType,
    coin,
    coinType,
    transactionBlock: txb
});

// bet on 15
const betType = 2;
const betNumber = 15;

const { ok, err, betId } = addRouletteBet({
    address: tableOwner,
    betNumber,
    betType,
    coin,
    coinType,
    transactionBlock: txb
});
```

#### Remove Bet from Table

```js
const coinType = "0x2::sui::SUI";

const self = "0x...";
const tableOwner = "0x...";

const { ok, err, results } = await removeRouletteBet({
    betId,
    coinType,
    player: self,
    tableOwner,
    transactionBlock
});
```

#### Start Roll on your Table

```js
const coinType = "0x2::sui::SUI";

const { ok: startOk, err: startErr, gameSeed } = startRoulette({
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getRouletteResult({
    coinType,
    gameSeed,
    transactionResult
});
```
