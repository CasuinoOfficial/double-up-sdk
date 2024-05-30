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
    dicePackageId: "",
    limboPackageId: "",
    plinkoPackageId: "",
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
    dicePackageId=""
    limboPackageId=""
    plinkoPackageId=""
    suiClient={suiClient}
>
    <App />
</DoubleUpProvider>
```

### Basic Usage

JS

```js
const { ok, err, receipt } = dbClient.createCoinflip({
    ...
});

...

await signAndExecuteTransactionBlock({ ... });
```

React

```js
import { useDoubleUp } from 'doubleup';

...

const { createCoinflip } = useDoubleUp();

...

const { ok, err, receipt } = createCoinflip({
    ...
});

...

await signAndExecuteTransactionBlock({ ... });
```

### Games

##### Coinflip

betType

| Value | Meaning |
| ----- | ------- |
|   0   |  Heads  |
|   1   |  Tails  |

```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const { ok, err, receipt } = createCoinflip({
    betType: 0,
    coin,
    coinType: "0x2::sui::SUI",
    transactionBlock: txb
});
```

##### Dice

betType

| Value | Meaning    |
| ----- | ---------- |
| 0 - 5 | Dice Rolls |
|   6   | Odd        |
|   7   | Even       |
|   8   | Small      |
|   9   | Big        |

```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const { ok, err, receipt } = createDice({
    betType: 0,
    coin,
    coinType: "0x2::sui::SUI",
    transactionBlock: txb
});
```

##### Limbo

multiplier

1.01 - 100

```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const { ok, err, receipt } = createLimbo({
    coin,
    coinType: "0x2::sui::SUI",
    multiplier: 50,
    transactionBlock: txb
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

```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount * numberOfDiscs, "u64")
);

const { ok, err, receipt } = createPlinko({
    betAmount,
    coin,
    coinType: "0x2::sui::SUI",
    numberOfDiscs: 50,
    plinkoType: 1,
    transactionBlock: txb
});
```
