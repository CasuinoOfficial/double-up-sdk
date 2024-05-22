# DoubleUp SDK

### Installation

```sh
$ npm install double-up-sdk
```

### Initialization

```
import DoubleUp from 'double-up-sdk';

...

const dbclient = new DoubleUpClient({});
dbclient.createCoinflip({txb, coinType, betType: 1, stakeCoin});

// Execute block

const test = await dbclient.getTransactionCoinflipGameId(transactionResults, coinType);
```