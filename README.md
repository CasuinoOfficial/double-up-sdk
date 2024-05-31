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
const { ok: gameOk, err: gameErr, receipt } = dbClient.createCoinflip({
    ...
});

...

const tranactionResult = await signAndExecuteTransactionBlock({ ... });

...

const { ok: resultOk, err: resultErr, events } = await dbClient.getCoinflipResult({
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

const { ok: gameOk, err: gameErr, receipt } = createCoinflip({
    ...
});

...

const tranactionResult = await signAndExecuteTransactionBlock({ ... });

...

const { ok: resultOk, err: resultErr, events } = await getCoinflipResult({
    coinType,
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
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, receipt } = createCoinflip({
    betType: 0,
    coin,
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, events } = await getCoinflipResult({
    coinType,
    pollInterval: 3000,
    transactionResult
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

pollInterval (optional, default: 3000)

milliseconds


```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, receipt } = createDice({
    betType: 0,
    coin,
    coinType,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, events } = await getDiceResult({
    coinType,
    pollInterval: 3000,
    transactionResult
});
```

##### Limbo

multiplier

1.01 - 100

pollInterval (optional, default: 3000)

milliseconds


```js
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, receipt } = createLimbo({
    coin,
    coinType,
    multiplier: 50,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, events } = await getLimboResult({
    coinType,
    pollInterval: 3000,
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
const coin = txb.splitCoins(
    txb.gas,
    txb.pure(betAmount * numberOfDiscs, "u64")
);

const coinType = "0x2::sui::SUI";

const { ok: gameOk, err: gameErr, receipt } = createPlinko({
    betAmount,
    coin,
    coinType,
    numberOfDiscs: 50,
    plinkoType: 1,
    transactionBlock: txb
});

const transactionResult = await signAndExecuteTransactionBlock({ ... });

const { ok: resultOk, err: resultErr, events } = await getPlinkoResult({
    coinType,
    pollInterval: 3000,
    transactionResult
});
```
