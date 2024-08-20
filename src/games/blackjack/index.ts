import {
  Transaction as TransactionType,
  TransactionObjectArgument,
  TransactionArgument,
} from "@mysten/sui/transactions";

import {
  BLACKJACK_MODULE,
  UNI_HOUSE_OBJ_ID,
  RAND_OBJ_ID,
  BLACKJACK_CONFIG_ID,
} from "../../constants";

export interface BlackjackInput {
  betSize: number;
  coinType: string;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
  origin?: string;
}

interface InternalBlackjackInput extends BlackjackInput {
  blackjackPackageId?: string;
}

export interface BlackJackGameCreatedResponse {
  ok: boolean;
  err?: Error;
  result?: TransactionArgument;
}

export interface BlackjackGameExistsInput {

}

interface BlackjackGame {
  gameId: string;
}

export const createBlackjackGame = ({
  betSize,
  coinType,
  coin,
  transaction,
  blackjackPackageId,
  origin,
}: InternalBlackjackInput): BlackJackGameCreatedResponse => {
  const res: BlackJackGameCreatedResponse = { ok: true };
  
  try {
    const [game] = transaction.moveCall({
      target: `${blackjackPackageId}::${BLACKJACK_MODULE}::init_game`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(BLACKJACK_CONFIG_ID),
        transaction.pure.u64(betSize),
        coin,
      ],
    });

    res.result = game;
  } catch (err) {
    res.ok = false;
    res.err = err;
  };
  
  return res;
}

export const doesBlackjackGameExist = ({

})