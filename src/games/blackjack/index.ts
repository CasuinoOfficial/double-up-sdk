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
  ROULETTE_PACKAGE_ID,
} from "../../constants";
import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/dist/cjs/client";

export interface BlackjackInput {
  betSize: number;
  coinType: string;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
  origin: string;
}

interface InternalBlackjackInput extends BlackjackInput {
  blackjackPackageId: string;
}

export interface BlackJackGameCreatedResponse {
  ok: boolean;
  err?: Error;
  result?: TransactionArgument;
}

export interface BlackjackGameExistsInput {
  gameId: string;
  coinType: string;
}

interface InternalBlackjackGameExistsInput extends BlackjackGameExistsInput {
  blackjackPackageId: string;
  suiClient: SuiClient;
}

export interface BlackjackGameExistsResponse {
  ok: boolean;
  err?: Error;
  gameExists: boolean;
}

export interface CreatedBlackjackGameInput {
  coinType: string;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalCreatedBlackjackGameInput extends CreatedBlackjackGameInput {
  blackjackPackageId: string;
}

export interface CreatedBlackjackGameResponse {
  ok: boolean;
  err?: Error;
  result?: BlackjackGame;
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

/*
export const doesBlackjackGameExist = async ({
  gameId,
  coinType,
  blackjackPackageId,
  suiClient,
}: InternalBlackjackGameExistsInput): Promise<BlackjackGameExistsResponse> => {
  const res: BlackJackGameCreatedResponse = { ok: true };

  try {
    const { data } = await suiClient.getDynamicFieldObject({
      parentId: BLACKJACK_CONFIG_ID,
      name: gameId,
    })
  }
}


export const getCreatedBlackjackGame = ({
  coinType,
  blackjackPackageId,
  transactionResult,
}: InternalCreatedBlackjackGameInput): CreatedBlackjackGameResponse => {
  const res: CreatedBlackjackGameResponse = { ok: true };

  try {
    const gameId = transactionResult.objectChanges.reduce((acc, current) => {
      if (
        current.type === "created" &&
        current.objectType ===
          `${blackjackPackageId}::${BLACKJACK_MODULE}::RouletteTable<${coinType}>`
      ) {
        acc = current.objectId;
      }

      return acc;
    }, "");
  }
}
  */