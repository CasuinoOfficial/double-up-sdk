## DoubleUp SDK

## Example Usage

```
const dbclient = new DoubleUpClient({});
dbclient.createCoinflip({txb, coinType, betType: 1, stakeCoin});

// Execute block

const test = await dbclient.getTransactionCoinflipGameId(transactionResults, coinType);
```