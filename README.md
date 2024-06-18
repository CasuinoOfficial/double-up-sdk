# DoubleUp SDK

### Installation

```sh
$ npm install doubleup
```

### Initialization

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
    plinkoPackageId: "",
    plinkoCorePackageId: "",
    plinkoVerifierId: "",
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
    plinkoPackageId=""
    plinkoCorePackageId=""
    plinkoVerifierId=""
    suiClient={suiClient}
>
    <App />
</DoubleUpProvider>
```

### Basic Usage

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

### Games

##### Coinflip

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

##### Dice

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

##### Limbo

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

##### Plinko

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

##### Range Dice

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

##### Rock, Paper, Scissors

betType

| Value | Meaning  |
| ----- | -------- |
|   0   | Rock     |
|   1   | Paper    |
|   2   | Scissors |

pollInterval (optional, default: 3000)

milliseconds


```js
const [coin] = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount * numberOfDiscs, "u64")
);

const coinType = "0x2::sui::SUI";

// rock
const betType = 0;

const { ok: gameOk, err: gameErr, gameSeed } = createRockPaperScissors({
    betType,
    coin,
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, results } = await getRockPaperScissorsResult({
    betType,
    coinType,
    gameSeed,
    transactionResult
});
```
