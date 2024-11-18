import {
  ALLOY_MODULE_NAME,
  ALLOY_MARKET_CONFIG,
  ALLOY_ADMIN_CAP,
  CLOCK_OBJ_ID,
} from "../../constants/mainnetConstants";
import { bcs } from "@mysten/sui/bcs";
import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";

export interface MarketplaceInput {
  coinType: string;
  marketplace_name: string;
  transaction: TransactionType;
}

export interface MarketInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  transaction: TransactionType;
}

export interface MarketInstanceInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  lock_timestamp: number;
  end_timestamp: number;
  transaction: TransactionType;
}

export interface PlaceMarketGuessInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  round_number: number;
  player: string;
  guess: number;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
  origin?: string;
}

export interface SetAIPredictionInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  round_number: number;
  ai_prediction: number;
  ai_tx_proof: string;
  transaction: TransactionType;
}

export interface MarketSettleOrContinueInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  round_number: number;
  result: number;
  page_size?: number;
  transaction: TransactionType;
}

export interface ReleaseUnsettledMarketInput {
  coinType: string;
  marketplace_name: string;
  market_name: string;
  round_number: number;
  page_size?: number;
  transaction: TransactionType;
}

export interface DepositMarketBalanceInput {
  coinType: string;
  marketplace_name: string;
  coin: TransactionObjectArgument;
  transaction: TransactionType;
}

export interface WithdrawMarketBalanceInput {
  coinType: string;
  marketplace_name: string;
  withdraw: number;
  transaction: TransactionType;
}

interface InternalMarketplaceInput extends MarketplaceInput {
  alloyPackageId: string;
}

interface InternalMarketInput extends MarketInput {
  alloyPackageId: string;
}

interface InternalMarketInstanceInput extends MarketInstanceInput {
  alloyPackageId: string;
}

interface InternalPlaceMarketGuessInput extends PlaceMarketGuessInput {
  alloyPackageId: string;
}

interface InternalSetAIPredictionInput extends SetAIPredictionInput {
  alloyPackageId: string;
}

interface InternalMarketSettleOrContinueInput
  extends MarketSettleOrContinueInput {
  alloyPackageId: string;
}

interface InternalReleaseUnsettledMarketInput
  extends ReleaseUnsettledMarketInput {
  alloyPackageId: string;
}

interface InternalDepositMarketBalanceInput extends DepositMarketBalanceInput {
  alloyPackageId: string;
}

interface InternalWithdrawMarketBalanceInput
  extends WithdrawMarketBalanceInput {
  alloyPackageId: string;
}

export const createMarketplace = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  transaction,
}: InternalMarketplaceInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::create_marketplace`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
    ],
  });
};

export const createMarket = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  transaction,
}: InternalMarketInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::create_market`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
    ],
  });
};

export const createMarketInstance = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  lock_timestamp,
  end_timestamp,
  transaction,
}: InternalMarketInstanceInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::create_market_instance`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
      transaction.pure.u64(lock_timestamp),
      transaction.pure.u64(end_timestamp),
      transaction.object(CLOCK_OBJ_ID),
    ],
  });
};

export const placeMarketGuess = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  round_number,
  player,
  guess,
  coin,
  origin,
  transaction,
}: InternalPlaceMarketGuessInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::place_guess`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
      transaction.pure.u64(round_number),
      transaction.pure.address(player),
      transaction.pure.u64(guess),
      coin,
      transaction.pure.string(origin ?? "DoubleUp"),
      transaction.object(CLOCK_OBJ_ID),
    ],
  });
};

export const setAIPrediction = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  round_number,
  ai_prediction,
  ai_tx_proof,
  transaction,
}: InternalSetAIPredictionInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::set_ai_prediction`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
      transaction.pure.u64(round_number),
      transaction.pure.u64(ai_prediction),
      transaction.pure.string(ai_tx_proof),
      transaction.object(CLOCK_OBJ_ID),
    ],
  });
};

export const marketSettleOrContinue = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  round_number,
  result,
  page_size,
  transaction,
}: InternalMarketSettleOrContinueInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::settle_or_continue`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
      transaction.pure.u64(round_number),
      transaction.pure.u64(result),
      transaction.pure(bcs.option(bcs.U64).serialize(page_size)),
      transaction.object(CLOCK_OBJ_ID),
    ],
  });
};

export const releaseUnsettledMarket = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  market_name,
  round_number,
  page_size,
  transaction,
}: InternalReleaseUnsettledMarketInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::release_unsettled_market`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.string(market_name),
      transaction.pure.u64(round_number),
      transaction.object(CLOCK_OBJ_ID),
      transaction.pure(bcs.option(bcs.U64).serialize(page_size)),
    ],
  });
};

export const depositMarketBalance = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  coin,
  transaction,
}: InternalDepositMarketBalanceInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::deposit_market_balance`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      coin,
    ],
  });
};

export const withdrawMarketBalance = ({
  coinType,
  alloyPackageId,
  marketplace_name,
  withdraw,
  transaction,
}: InternalWithdrawMarketBalanceInput) => {
  transaction.setGasBudget(100_000_000);
  transaction.moveCall({
    target: `${alloyPackageId}::${ALLOY_MODULE_NAME}::withdraw_market_balance`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(ALLOY_ADMIN_CAP),
      transaction.object(ALLOY_MARKET_CONFIG),
      transaction.pure.string(marketplace_name),
      transaction.pure.u64(withdraw),
    ],
  });
};
