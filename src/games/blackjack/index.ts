import {
  Transaction as TransactionType,
  TransactionObjectArgument,
  TransactionArgument,
} from "@mysten/sui/transactions";

import {
  BLACKJACK_MODULE,
  UNI_HOUSE_OBJ_ID,
  RAND_OBJ_ID,
  BLACKJACK_CONFIG,
} from "../../constants";
import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/dist/cjs/client";
import { bcs } from "@mysten/sui/dist/cjs/bcs";
import { transactionDataFromV1 } from "@mysten/sui/dist/cjs/transactions/data/v1";

type Hit = 101;
type Stand = 102;
type Double = 103;
type Split = 104;
type Surrender = 105;

type PlayerAction = 
  | Hit
  | Stand
  | Double
  | Split
  | Surrender;

export interface BlackjackInput {
  coinType: string;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
}

interface InternalBlackjackInput extends BlackjackInput {
  blackjackPackageId: string;
  origin: string;
}

export interface GetBlackjackTableInput {
  address: string;
  coinType: string;
}

interface InternalGetBlackjackTableInput extends GetBlackjackTableInput {
  blackjackPackageId: string;
  suiClient: SuiClient;
}

export interface GetBlackjackTableResponse {
  ok: boolean;
  err?: Error;
  fields?: BlackjackGame;
}

interface BlackjackGame {
  gameId: string;
}

export interface BlackjackDealerMoveInput {
  coinType: string;
  transaction: TransactionType;
}

interface InternalBlackjackDealerMoveInput extends BlackjackDealerMoveInput {
  blackjackPackageId: string;
}

export interface BlackjackPlayerMoveInput {
  coinType: string;
  playerAction: PlayerAction;
  coinOpt?: TransactionObjectArgument;
  transaction: TransactionType;
}

interface InternalBlackjackPlayerMoveInput extends BlackjackPlayerMoveInput {
  blackjackPackageId: string;
}

export const createBlackjackGame = ({
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
      transaction.object(BLACKJACK_CONFIG),
      coin,
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
}

export const getBlackjackTable = async ({
  address,
  coinType,
  blackjackPackageId,
  suiClient,
}: InternalGetBlackjackTableInput): Promise<GetBlackjackTableResponse> => {
  const res: GetBlackjackTableResponse = { ok: true };

  try {
    const { data } = await suiClient.getDynamicFieldObject({
      parentId: BLACKJACK_CONFIG,
      name: {
        type: `${blackjackPackageId}::${BLACKJACK_MODULE}::BlackjackTag<${coinType}>`,
        value: {
          creator: address,
        },
      },
    });

    if (data.content?.dataType !== "moveObject") {
      return null;
    }

    const fields = data.content.fields as any;
    res.ok = true;
    res.fields = fields;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
}

export const blackjackDealerMove = ({
  coinType,
  transaction,
  blackjackPackageId,
}: InternalBlackjackDealerMoveInput) => {
  transaction.moveCall({
    target: `${blackjackPackageId}::${BLACKJACK_MODULE}::dealer_move`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(BLACKJACK_CONFIG),
      transaction.object(RAND_OBJ_ID),
    ],
  });
}

const isDoubleOrSplit = (playerAction: PlayerAction): playerAction is Double | Split =>
  playerAction === (103 | 104);

export const blackjackPlayerMove = ({
  coinType,
  playerAction,
  coinOpt,
  transaction,
  blackjackPackageId,
}: InternalBlackjackPlayerMoveInput) => {
  let coin_opt;
  if (isDoubleOrSplit(playerAction)) {
    if (!coinOpt) {
      throw new Error("Coin required to DOUBLE or SPLIT");
    }
    [coin_opt] = transaction.moveCall({
      target: "0x1::option::some",
      typeArguments: [`0x2::coin::Coin<${coinType}>`],
      arguments: [coinOpt],
    });
  } else {
    if (!!coinOpt) {
      throw new Error("Do not provide coin to HIT or STAND or SURRENDER");
    }
    [coin_opt] = transaction.moveCall({
      target: "0x1::option::none",
      typeArguments: [`0x2::coin::Coin<${coinType}>`],
    });
  }

  transaction.moveCall({
    target: `${blackjackPackageId}::${BLACKJACK_MODULE}::player_move`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(BLACKJACK_CONFIG),
      transaction.pure.u64(playerAction),
      coin_opt,
    ],
  });
}
