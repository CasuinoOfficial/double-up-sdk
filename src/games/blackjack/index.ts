import {
  Transaction as TransactionType,
  TransactionObjectArgument,
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

export const createBlackJackGame = ({
  betSize,
  coinType,
  coin,
  transaction,
  blackjackPackageId,
  origin,
}: InternalBlackjackInput) => {
  transaction.moveCall({
    target: `${blackjackPackageId}::${BLACKJACK_MODULE}::init_game`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(BLACKJACK_CONFIG_ID),
      transaction.pure.u64(betSize),
      coin,
    ],
  });
}

