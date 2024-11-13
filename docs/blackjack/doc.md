## Blackjack

The following assumes that you are familiar with the game of blackjack and the possible options.

To recap HIT means “I want another card”, STAND means “I don’t want another card”, DOUBLE DOWN means “I want one more card and I double my bet”, SPLIT means “I want to separate my cards and play two hands and I add another bet of equal value to the initial bet”, “SURRENDER” may be used immediatelly after the deal, before the player has made any other actions and it will return half the stake to the user.

Each call will add move calls to an existing PTB, thus each call will require a `Transaction` as argument from the `@mysten/sui/transactions`.
This is so because you might want to add additional commands to the PTB prior to the transaction, such as `splitCoins`. The `Transaction` argument will have a new command included after each call and you are expected to execute it, usually with the player as the signer. 

### Limits

Each blackjack game has a lower and upper bound on the amount that can be staked. Typically the lowest value a SUI Coin (`Coin<SUI>`) that may be staked in a game is `1_000_000_000 MIST` or 1 SUI. The maximum value depends on how many wins were within the day, it typically stands at 5_000 SUI or `5_000 * 10^9 MIST`. If you find these limits inconvenient please contact us. 

### User actions

During a game of Blackjack the user is allowed a few different choices depending on the cards they got. These choices are coded as follows:

- HIT: 101
- STAND: 102
- DOUBLE DOWN: 103 (only allowed if the user has exactly two cards).
- SPLIT: 104 (only allowed if the user has exactly two cards of equal value).
- SURRENDER: 105 (only immediately after the deal, half the stake will be returned).

**Hand Status**

Each hand has a status code, the above numbers are possible values, additionally the following apply:

- PLAYER TURN: 100

Because there are two calls to complete a user’s action, first call the action type and then another call to process it, a status 100 means that it is the user’s turn to choose one of the actions and a status between 101-104 means that the user has chosen an action and we should execute the second call that processes the action.

### Game flow

Before the game starts each user will create their `Table`. In the future other users can join an existing `Table`. Each `Table` will be attributed to a user and it will never be deleted.

The usual process for this is when we have the address of the user we first check if there is an existing table and use that, if there is no existing table we create one.

The next step is to create a `Game` of blackjack. Each game will end when there is a settled outcome after either the dealer or the user wins, or there is a push.

After a `Game` was created, the `DoubleUpClient.getBlackjackTable` call will contain the active `Game` as well as the cards that are showing.

The user has 4 choices and SURRENDER, as detailed above, which is valid at any point before settlement and it is seldom chosen. Any choice will result in the same call, `DoubleUpClient.blackjackPlayerMove`
It will be obvious when we need to call this function by the hand’s status which will be 100.

After the call with the user choice has returned, the status will change ranging from 101 to 104 indicating the choice and your app should call `DoubleUpClient.blackjackPlayerProcessMove` which will push the game forward. 
If the user has chosen STAND then the dealer cards will be dealt followed by the final settlement of the game.
If the user is bust (total value over 21) then the game is a loss. 
If the user has chosen DOUBLE DOWN then a card will given to the user and the dealer cards will be dealt along with the final settlement.
If the user has SPLIT then the player will play twice this game (two hands), first he will HIT or STAND for the first hand and then for the second. Of course an additional SPLIT will add an additional hand that the user can play. A player may SPLIT up to 4 times per game.

SPLIT and DOUBLE DOWN actions will require an additional stake from the user, of equivalent value of the initial stake required when creating the `Game` .

Of course a Blackjack (Ace and a 10) might be the user’s starting hand in which case the hand will be settled automatically.

### Function Calls

`DoubleUpClient.getBlackjackTable`

This call will return the raw response from the blockchain, below there is an explanation of what each field means.

**Arguments**

The call requires only one object as an argument.

Argument:

  Type: Object

  Fields:

1. `address`: string,
2. `coinType`: string

`address` is the on-chain address of the user.

`coinType` is the type of the Coin that the user wants to use (must be an accepted coin type by Unihouse), eg: 

`'0x2::sui::SUI'` 
or 
`0x980ec1e7d5a3d11c95039cab901f02a044df2d82bc79d99b60455c02524fad83::pup::PUP` 

**Response**

Type: `BlackjackContractData | null` — `import {BlackjackContractData} from "doubleup/dist/blackjack"`

```tsx
export interface BlackjackContractData {
  balance: string;
  creator: string; // This should equal the address argument
  current_game: { // This might be empty
    fields: {
      bet_size: string;
      current_deck: number[];
      dealer_cards: number[];
      hands: {
        fields: {
          bet_returned: string;
          bet_size: string;
          cards: number[];
          current_sum: number;
          is_natural_blackjack: boolean;
          is_doubled: boolean;
          is_settled: boolean;
          status: string;
        };
        type: string;
      }[];
      origin: string;
      risk: number;
      start_epoch: number;
      status: string;
    };
    type: string;
  } | null;
  id: {
    id: string;
  };
  round_number: string;
}
```

**Sample Code**

```tsx
import {DBClient} from "path/to/DoubleUpClient";

const userAddress = "0xaabbcc123";
const coinType = "0x2::sui::SUI";
const checkTable = async () => {
	const response = await DBclient.getBlackjactTable({
		 address: userAddress,
	  coinType
  });
  // on chain ID of the table
  const tableId  = response.id.id;
  // current game 
  const currentGame = response.currentGame
  // currentGame might be null
  if(currentGame) {    
	  // dealer cards
	  const dealerHands = currentGame.dealer_cards
	  // player hands (a player may have more than one hand if they have split)
	  const playerHands = currentGame.player_hands
	  // player's first hand cards, this should always exist
	  const hand1 = playerHands[0];
	  const hand1Cards = hand1.fields.cards;
	  // hand's cards sum
	  const hand1Sum = hand1.fields.current_sum;
	  // is it blackjack
	  const isBlackjack = hand1.fields.is_natural_blackjack;
	  // was double down opted for
	  const didDoubleDown = hand1.fields.is_doubled;
	  // is the hand over (settled)?
	  const isSettled = hand1.fields.is_settled;
	  // how much did the user bet
	  const betAmount = hand1.fields.bet_size;
	  // status of the hand
	  const handStatus = hand1.fields.status;
  }
 
}
```

**Errors**

Errors will be encountered if the `coinType` is not valid. Remember that the response may be null which means the player does not have a table for the given `coinType`.

`DoubleUpClient.createBlackjackTable`

This call will create a `Table` if the user has none. Remember that per `coinType` a user may have only one table, so this call is needed once per user per coin that they want to use. Because this function is a blockchain transaction you will need to use `@mysten/sui` to create the PTB, call this API call and you may add other calls in the PTB depending on the use case.

**Arguments**

This call takes only one js object as argument. The object should have two fields `coinType` and `transaction`, the first is a string and the other a `Transaction`.

Argument:

Type: object

Fields: 

- coinType: string,
- transaction: Transaction

  

**Sample Code**

```tsx
import {DBClient} from "path/to/DoubleUpClient";
import {Transaction} from "@mysten/sui/transactions";
import {getSigner} from "path/to/utility_functions";

/* Every transaction needs a signer in order to be executed which is
 a keypair. If you are creating an UI then the wallet will have the method
 wallet.signAndExecuteTransaction with the signer automatically provided. */
 
 // The signer here is the user's keypair, typically the wallet has that and you
 // don't need this.
 const signer = getSigner();
 const coinType = "0x2::sui::SUI";
 const createTable = async () => {
   const tx = new Transaction;
   await DBClient.createBlackjackTable({
     coinType: coinType,
     transaction: tx
   });
   const response = await DBClient.suiClient.signAndExecuteTransaction({
     transaction: tx,
     signer: signer,
     options: {showEffects: true}
   });
   
   console.log(response.effects.status.status === "success");
 }
```

**Errors**

If a table already exists this function will throw with error code `8` from module `blackjack` function `create_blackjack_table`.

Of course the common errors like `Insufficient gas` may be encountered that are particular to Sui.

`DoubleUpClient.createBlackjackGame` 

With a `Table` created this is the next call in order. It will create a `Game` that will be attached to the `Table` and it’s data can be found with the first call explained: `DoubleUpClient.getBlackjackTable`, in the response under `currentGame`.

**Arguments**

The call takes one object as argument that has 3 fields, `coinType`, `coin` and `transaction`.
The first is a string, the second is a string and it’s the ID of the coin to be used and the last is a `Transaction`. Notice that here a coin is required and it’s value should be within accepted limits, for SUI coins, the lowest limit is 1 and the highest depends on the house, typically it is around 5000.

Argument:

  Type: Object

  Fields: 

- coinType: string,
- coin: string,
- transaction: Transaction

**Sample Code**

```tsx
import {DBClient} from "path/to/DoubleUpClient";
import {Transaction} from "@mysten/sui/transactions";
import {getSigner} from "path/to/utility_functions";

/* Every transaction needs a signer in order to be executed which is
 a keypair. If you are creating an UI then the wallet will have the method
 wallet.signAndExecuteTransaction with the signer automatically provided. */
 
 // The signer here is the user's keypair, typically the wallet has that and you
 // don't need this.
 const signer = getSigner();
 const coinType = "0x2::sui::SUI";
 const userCoinId = "0xaabbccddeeff123...";
 
 const createGame = async () => {
   const tx = new Transaction();
   DBClient.createBlackjackGame({
     coinType: coinType,
     coin: userCoinId,
     transaction: tx
   });
   const response = await DBClient.suiClient.signAndExecuteTransction({
     transaction: tx,
     signer: signer,
     options: {showEffects: true}
   });
   
   console.log(response.effects.status.status === "success");
 }
```

**Errors**

Besides the typical Sui errors like `InsufficientGas`, this call may throw if

- The `coinType` and the `coin` are not of the same type. The error will contain `Invalid Type` or some `Deserialization error`.
- The `coinType` of the `Table` is not the same as the `coinType` you gave here. Same errors as above.
- The value of the coin is either too large or too small. If the value is too large then you will see error code `3` from module `unihouse` function `assert_within_risk`.

`DoubleUpClient.blackjackPlayerMove`
This call should be called after `DoubleUpClient.createBlackjackGame`, followed by a `DoubleUpClient.blackjackProcessPlayerMove` and then again this one.
The game will end after the user either chooses STAND (102) or the the total sum of their cards exceed 21.
In order to keep track of the user's hand, you an either read the events of the response, or call `DoubleUpClient.getBlackjackTable` and read its response.

**Arguments**
This call takes an argument an object with 3 mandatory fields and one optional. `coinType`, `playerAction` and `transaction` are mandatory and `coinOpt` is optional and needed only for SPLIT or DOUBLE DOWN, this is the return of a `Transaction.splitCoins` instruction in a PTB. `playerAction` is a number with valid values from 101 to 105.

Argument 1:
Type: Object
Fields:
    coinType: string
    playerAction: number
    transaction: Transaction
    coinOpt: TransactionObjectArgument

**Sample Code**
HIT example
```tsx
import {DBClient} from "path/to/DoubleUpClient";
import {Transaction} from "@mysten/sui/transactions";
import {getSigner} from "path/to/utility_functions";

/* Every transaction needs a signer in order to be executed which is
 a keypair. If you are creating an UI then the wallet will have the method
 wallet.signAndExecuteTransaction with the signer automatically provided. */
 
 // The signer here is the user's keypair, typically the wallet has that and you
 // don't need this.
 const signer = getSigner();
 const coinType = "0x2::sui::SUI";
 
 const playerHIT = async () => {
    const tx = Transaction();
    DBClient.blackjackPlayerMove({
        coinType: coinType,
        playerAction: 101,
        transaction: tx
    });
    const response = await DBClient.suiClient.singAndExecuteTransaction({
        transaction: tx,
        signer: signer,
        options: {
            showEffects: true,
            showEvents: true
        }
    });
    console.log(response.effects.status.status === true);
    console.log(response.events);
 }
```
DOUBLE DOWN example

```tsx
import {DBClient} from "path/to/DoubleUpClient";
import {Transaction} from "@mysten/sui/transactions";
import {getSigner} from "path/to/utility_functions";

/* Every transaction needs a signer in order to be executed which is
 a keypair. If you are creating an UI then the wallet will have the method
 wallet.signAndExecuteTransaction with the signer automatically provided. */
 
 // The signer here is the user's keypair, typically the wallet has that and you
 // don't need this.
 const signer = getSigner();
 const coinType = "0x2::sui::SUI";
 const betAmount = 1_000_000_000; // this should be stored when it was first requested for the DoubleUpClient.createBlackjackGame call.
 
 const playerDOUBLEDOWN = async () => {
    const tx = Transaction();
    const coin = tx.splitCoins(tx.gas, [tx.pure.u64(betAmount)]);

    DBClient.blackjackPlayerMove({
        coinType: coinType,
        playerAction: 103,
        transaction: tx,
        coinOpt: coin
    });
    const response = await DBClient.suiClient.singAndExecuteTransaction({
        transaction: tx,
        signer: signer,
        options: {
            showEffects: true,
            showEvents: true
        }
    });
    console.log(response.effects.status.status === "success");
    console.log(response.events);
```

**Errors**
The errors from the blackjack contract that you may encounter are the following:

1. If the `playerAction` is out of bounds, lower than 101 or greater than 105 then the failure message will have:
  error code `0` from function `player_move_request` from module `blackjack`.
  
2. If the call is made when it is not the player's turn (it's the dealers turn and you should call the next call) then the failure message will have:
error code `2` from function `player_move_request` from module `blackjack`.

3. If the action choses is SPLIT (104) or DOUBLE DOWN (103) and the additional coin was not provided or the value is not equal to the initial's bet value then the failure message will have:
error code `4` from function `player_move_request` from module `blackjack`.

4. If the action is SURRENDER (105) but another action has previously occured (this is not a fresh deal) or the dealer's visible card is an ACE the failure message will have:
error code `13` from function `player_move_request` from module `blackjack`.

5. If the action is SPLIT (104) and the SPLIT action has already been performed three times in previous calls the failure message will have:
error code `1` from function `player_move_request` from module `blackjack`.

6. If the action is SPLIT (104) and the cards are not of equal value or the user has more than 2 cards then the failure message will have:
error code `5` from function `player_move_request` from module `blackjack`.

7. If the action is DOUBLE DOWN (103) and the user has more than 2 cards then the failure message will have:
error code `6` from function `player_move_request` from module `blackjack`.

8. If the action is SPLIT (104) or DOULBE DOWN (103) and the additional bet will exceed the max limits of the table the failure message will have:
error code `3` from module `unihouse` function `assert_within_risk`.


`DoubleUpClient.blackjackPlayerProcessMove`
This call should be executed after each `DoubleUpClient.blackjackPlayerMove` as long as the game hasn't ended.
**Arguments**
The call takes a single object argument with fields, `coinType`, `hostAddress` and `transaction`. The `hostAddress` is the table creator which for now it is the same as the user's address. This is required because this call may be called by anyone (eg: your backend), thus it is not necessary for the player itself to sign this transaction.

Argument 1:
Type: Object
Fields:
 coinType: string
 hostAddress: string
 transaction: Transaction

**Sample Code**
```tsx
import {DBClient} from "path/to/DoubleUpClient";
import {Transaction} from "@mysten/sui/transactions";
import {getSigner} from "path/to/utility_functions";

/* Every transaction needs a signer in order to be executed which is
 a keypair. If you are creating an UI then the wallet will have the method
 wallet.signAndExecuteTransaction with the signer automatically provided. */
 
 // The signer here is the user's keypair, typically the wallet has that and you
 // don't need this.
 const signer = getSigner();
 const coinType = "0x2::sui::SUI";
 const userAddress = "0xaabbcc123..."
 
 const processMove = () => {
    const tx = new Transcation();
    DBClient.processPlayerMove({
        coinType: coinType,
        hostAddress: userAddress,
        transaction: tx
    });

    const response = await DBClient.suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: signer,
        options: {
            showEffects: true,
            showEvents: true
        }
    });
    console.log(response.effects.status.status === "success");
    console.log(reponse.events);
 }
```

**Errors**
The call will fail if it is called out of order. Any failure indicates that a  `DoubleUpClient.blackjackPlayerMove` was not called prior to this call.