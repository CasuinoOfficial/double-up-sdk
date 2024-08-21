import { bcs } from "@mysten/sui/bcs";
import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";

import {
  ROULETTE_MODULE_NAME,
  UNI_HOUSE_OBJ_ID,
  ROULETTE_CONFIG,
  RAND_OBJ_ID,
} from "../../constants";

type BetRed = 0;
type BetBlack = 1;
type BetNumber = 2;
type BetEven = 3;
type BetOdd = 4;
type BetFirstTwelve = 5;
type BetSecondTwelve = 6;
type BetThirdTwelve = 7;
type BetFirstEighteen = 8;
type BetSecondEighteen = 9;
type BetFirstColumn = 10;
type BetSecondColumn = 11;
type BetThirdColumn = 12;

type RouletteBet =
  | BetRed
  | BetBlack
  | BetNumber
  | BetEven
  | BetOdd
  | BetFirstTwelve
  | BetSecondTwelve
  | BetThirdTwelve
  | BetFirstEighteen
  | BetSecondEighteen
  | BetFirstColumn
  | BetSecondColumn
  | BetThirdColumn;

export interface RouletteAddBetInput {
  address: string;
  betNumber?: number;
  betType: RouletteBet;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

interface InternalRouletteAddBetInput extends RouletteAddBetInput {
  origin: string;
  roulettePackageId: string;
}

export interface RouletteAddBetResponse {
  ok: boolean;
  err?: Error;
  betId?: TransactionArgument;
}

interface RouletteParsedJson {
  bet_id: string;
  creator: string;
  outcome: string;
  round_number: string;
  table_id: string;
}

interface BetResult {
  bet_id: string;
  is_win: string;
  bet_type: number;
  bet_number: number;
  bet_size: string;
  player: string;
}

interface BetSettledEvent {
  table_id: string;
  total_volume: number;
  round_number: string;
  creator: string;
  bet_results: BetResult[];
  origin: string;
}

export interface RouletteRemoveBetInput {
  betId: string;
  coinType: string;
  player: string;
  tableOwner: string;
  transaction: TransactionType;
}

interface InternalRouletteRemoveBetInput extends RouletteRemoveBetInput {
  origin: string;
  roulettePackageId: string;
}

export interface RouletteRemoveBetResponse {
  ok: boolean;
  err?: Error;
  returnedCoin?: TransactionArgument;
}

export interface RouletteResultInput {
  coinType: string;
  gameSeed: string;
  roundNumber: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
  withJson?: boolean;
}

interface RouletteResult {
  roll: number;
}

export interface RouletteResultResponse {
  ok: boolean;
  err?: Error;
  rawBetResults?: BetSettledEvent[];
  rawResults?: RouletteParsedJson[];
  results?: RouletteResult[];
  txDigests?: string[];
}

export interface RouletteStartInput {
  coinType: string;
  transaction: TransactionType;
}

interface InternalRouletteStartInput extends RouletteStartInput {
  roulettePackageId: string;
}

export interface RouletteStartResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface RouletteTableInput {
  coinType: string;
  transaction: TransactionType;
}

interface InternalRouletteTableInput extends RouletteTableInput {
  roulettePackageId: string;
}

export interface RouletteTableResponse {
  ok: boolean;
  err?: Error;
  result?: TransactionArgument;
}

export interface GetRouletteTableInput {
  address: string;
  coinType: string;
}

interface InternalGetRouletteTableInput extends GetRouletteTableInput {
  roulettePackageId: string;
  suiClient: SuiClient;
}

export interface GetRouletteTableResponse {
  ok: boolean;
  err?: Error;
  fields?: any;
}

export interface RouletteSettleOrContinueInput {
  coinType: string,
  transaction: TransactionType;
  hostAddress: string;
  origin?: string;
}

interface InternalRouletteSettleOrContinueInput extends RouletteSettleOrContinueInput {
  roulettePackageId: string;
}

const isBetNumber = (betType: RouletteBet): betType is BetNumber =>
  betType === 2;

export const addRouletteBet = ({
  address,
  betNumber,
  betType,
  coin,
  coinType,
  origin,
  roulettePackageId,
  transaction,
}: InternalRouletteAddBetInput): RouletteAddBetResponse => {
  const res: RouletteAddBetResponse = { ok: true };

  try {
    if (isBetNumber(betType)) {
      if (!betNumber) {
        throw new Error("invalid roulette bet");
      } else if (betNumber > 37) {
        throw new Error("roulette bet number is too high");
      }
    } else {
      if (!!betNumber) {
        throw new Error("invalid roulette bet");
      }
    }

    const [betId] = transaction.moveCall({
      target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::add_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(ROULETTE_CONFIG),
        transaction.pure.address(address),
        coin,
        transaction.pure.u8(betType),
        transaction.pure(
          bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)
        ),
        transaction.pure.string(origin ?? "DoubleUp"),
      ],
    });

    res.betId = betId;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const createRouletteTable = ({
  coinType,
  roulettePackageId,
  transaction,
}: InternalRouletteTableInput) => {
    transaction.moveCall({
      target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::create_roulette_table`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(ROULETTE_CONFIG),
      ],
    });
};

export const getRouletteTable = async ({
  address,
  coinType,
  roulettePackageId,
  suiClient,
}: InternalGetRouletteTableInput): Promise<GetRouletteTableResponse> => {
  const res: GetRouletteTableResponse = { ok: true };

  try {
    const { data } = await suiClient.getDynamicFieldObject({
      parentId: ROULETTE_CONFIG,
      name: {
        type: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::GameTag<${coinType}>`,
        value: {
          creator: address,
        },
      },
    });

    if (data.content?.dataType !== "moveObject") {
      return null;
    }

    const fields = data.content.fields as any;
    res.fields = fields;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const removeRouletteBet = ({
  betId,
  coinType,
  origin,
  player,
  roulettePackageId,
  tableOwner,
  transaction,
}: InternalRouletteRemoveBetInput): RouletteRemoveBetResponse => {
  const res: RouletteRemoveBetResponse = { ok: true };

  try {
    const [coin] = transaction.moveCall({
      target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::remove_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(ROULETTE_CONFIG),
        transaction.pure.address(tableOwner),
        transaction.pure.address(player),
        transaction.pure.id(betId),
        transaction.pure.string(origin ?? "DoubleUp"),
      ],
    });

    res.returnedCoin = coin;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const startRoulette = ({
  coinType,
  roulettePackageId,
  transaction,
}: InternalRouletteStartInput) => {
  transaction.moveCall({
    target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::start_roll`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(RAND_OBJ_ID),
      transaction.object(ROULETTE_CONFIG),
    ],
  });
};

export const rouletteSettleOrContinue = ({
  coinType,
  roulettePackageId,
  transaction,
  hostAddress,
  origin
}: InternalRouletteSettleOrContinueInput) => {
  transaction.moveCall({
    target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::settle_or_continue`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(ROULETTE_CONFIG),
      transaction.pure.address(hostAddress),
      transaction.pure(bcs.option(bcs.U64).serialize(null)),
      transaction.pure.string(origin ?? "DoubleUp")
    ],
  });
}