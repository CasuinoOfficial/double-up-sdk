import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";

import {
  BLACKJACK_MODULE_NAME,
  UNI_HOUSE_OBJ_ID,
  RAND_OBJ_ID,
  BLACKJACK_CONFIG,
  CLOCK_OBJ_ID,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  SUILEND_ASSET_LIST,
} from "../../constants/mainnetConstants";
import { SuiClient } from "@mysten/sui/client";
import {
  getAssetIndex,
  getTypesFromVoucher,
  getVoucherBank,
} from "../../utils";

type Hit = 101;
type Stand = 102;
type Double = 103;
type Split = 104;
type Surrender = 105;

type PlayerAction = Hit | Stand | Double | Split | Surrender;

export interface BlackjackInput {
  coinType: string;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
}

interface InternalBlackjackInput extends BlackjackInput {
  blackjackCorePackageId: string;
  origin: string;
}

export interface BlackjackVoucherInput {
  betSize: number;
  voucherId: string;
  transaction: TransactionType;
}

interface InternalBlackjackVoucherInput extends BlackjackVoucherInput {
  blackjackPackageId: string;
  origin: string;
  client: SuiClient;
}

export interface GetBlackjackTableInput {
  address: string;
  coinType: string;
}

interface InternalGetBlackjackTableInput extends GetBlackjackTableInput {
  blackjackCorePackageId: string;
  suiClient: SuiClient;
}

export interface GetBlackjackTableResponse {
  balance: string;
  creator: string;
  current_game: {
    fields: {
      bet_size: string;
      current_deck: number[];
      dealer_cards: number[];
      hands: {
        cards: number[];
        status: number;
        current_sum: number;
        bet_size: string;
        is_natural_blackjack: boolean;
        is_doubled: boolean;
        is_settled: boolean;
        bet_returned: number;
      }[];
      origin: string;
      risk: number;
      start_epoch: number;
    };
    type: string;
  };
  id: {
    id: string;
  };
  round_number: string;
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

export interface BlackjackPlayerMoveVoucherInput {
  coinType: string;
  betSize?: number;
  voucherId?: string;
  playerAction: PlayerAction;
  transaction: TransactionType;
}

interface InternalBlackjackPlayerMoveVoucherInput
  extends BlackjackPlayerMoveVoucherInput {
  blackjackPackageId: string;
  client: SuiClient;
}

export const createBlackjackGame = ({
  coinType,
  coin,
  transaction,
  blackjackCorePackageId,
  origin,
}: InternalBlackjackInput) => {
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${blackjackCorePackageId}::${BLACKJACK_MODULE_NAME}::init_game`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(BLACKJACK_CONFIG),
      transaction.object(RAND_OBJ_ID),
      coin,
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};

export const createBlackjackGameWithVoucher = async ({
  betSize,
  voucherId,
  client,
  transaction,
  blackjackPackageId,
  origin,
}: InternalBlackjackVoucherInput) => {
  let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
  let voucherBank = getVoucherBank(coinType);
  transaction.setGasBudget(100_000_000);

  transaction.moveCall({
    target: `${blackjackPackageId}::${BLACKJACK_MODULE_NAME}::init_game_with_voucher`,
    typeArguments: [coinType, voucherType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(BLACKJACK_CONFIG),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(betSize),
      transaction.object(voucherId),
      transaction.object(voucherBank),
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};

export const getBlackjackTable = async ({
  address,
  coinType,
  blackjackCorePackageId,
  suiClient,
}: InternalGetBlackjackTableInput): Promise<GetBlackjackTableResponse> => {
  const { data } = await suiClient.getDynamicFieldObject({
    parentId: BLACKJACK_CONFIG,
    name: {
      type: `${blackjackCorePackageId}::${BLACKJACK_MODULE_NAME}::BlackjackTag<${coinType}>`,
      value: {
        creator: address,
      },
    },
  });

  if (data?.content?.dataType !== "moveObject") {
    return null;
  }

  const fields = data.content.fields as any;

  return fields;
};

const isDoubleOrSplit = (
  playerAction: PlayerAction
): playerAction is Double | Split =>
  playerAction === 103 || playerAction === 104;

export const blackjackPlayerMove = ({
  coinType,
  playerAction,
  coinOpt,
  transaction,
  blackjackPackageId,
}: InternalBlackjackPlayerMoveInput) => {
  transaction.setGasBudget(100_000_000);

  if (isDoubleOrSplit(playerAction)) {
    if (!coinOpt) {
      throw new Error("Coin required to DOUBLE or SPLIT");
    }

    transaction.moveCall({
      target: `${blackjackPackageId}::${BLACKJACK_MODULE_NAME}::player_move_double_split`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(BLACKJACK_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(playerAction),
        coinOpt,
      ],
    });
  } else {
    if (!!coinOpt) {
      throw new Error("Do not provide coin to HIT or STAND or SURRENDER");
    }

    transaction.moveCall({
      target: `${blackjackPackageId}::${BLACKJACK_MODULE_NAME}::player_move_hit_stand_surrender`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(BLACKJACK_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(playerAction),
      ],
    });
  }
};

export const blackjackPlayerMoveWithVoucher = async ({
  coinType,
  betSize,
  voucherId,
  client,
  playerAction,
  transaction,
  blackjackPackageId,
}: InternalBlackjackPlayerMoveVoucherInput) => {
  transaction.setGasBudget(100_000_000);

  if (isDoubleOrSplit(playerAction)) {
    if (!voucherId) {
      throw new Error("Vocuher required to DOUBLE or SPLIT");
    }
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let voucherBank = getVoucherBank(coinType);

    transaction.moveCall({
      target: `${blackjackPackageId}::${BLACKJACK_MODULE_NAME}::player_move_double_split_with_voucher`,
      typeArguments: [coinType, voucherType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(BLACKJACK_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(playerAction),
        transaction.pure.u64(betSize),
        transaction.object(voucherId),
        transaction.object(voucherBank),
      ],
    });
  } else {
    if (!!voucherId) {
      throw new Error("Do not provide voucher to HIT or STAND or SURRENDER");
    }

    transaction.moveCall({
      target: `${blackjackPackageId}::${BLACKJACK_MODULE_NAME}::player_move_hit_stand_surrender`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(BLACKJACK_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(playerAction),
      ],
    });
  }
};
