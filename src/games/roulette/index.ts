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

// Bet Types
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

// 17x Payout Bets
type BetSplit0_00 = 13;
type BetSplit0_1 = 14;
type BetSplit00_3 = 15;
type BetSplit1_2 = 16;
type BetSplit2_3 = 17;
type BetSplit4_5 = 18;
type BetSplit5_6 = 19;
type BetSplit7_8 = 20;
type BetSplit8_9 = 21;
type BetSplit10_11 = 22;
type BetSplit11_12 = 23;
type BetSplit13_14 = 24;
type BetSplit14_15 = 25;
type BetSplit16_17 = 26;
type BetSplit17_18 = 27;
type BetSplit19_20 = 28;
type BetSplit20_21 = 29;
type BetSplit22_23 = 30;
type BetSplit23_24 = 31;
type BetSplit25_26 = 32;
type BetSplit26_27 = 33;
type BetSplit28_29 = 34;
type BetSplit29_30 = 35;
type BetSplit31_32 = 36;
type BetSplit32_33 = 37;
type BetSplit34_35 = 38;
type BetSplit35_36 = 39;
type BetSplit1_4 = 40;
type BetSplit2_5 = 41;
type BetSplit3_6 = 42;
type BetSplit4_7 = 43;
type BetSplit5_8 = 44;
type BetSplit6_9 = 45;
type BetSplit7_10 = 46;
type BetSplit8_11 = 47;
type BetSplit9_12 = 48;
type BetSplit10_13 = 49;
type BetSplit11_14 = 50;
type BetSplit12_15 = 51;
type BetSplit13_16 = 52;
type BetSplit14_17 = 53;
type BetSplit15_18 = 54;
type BetSplit16_19 = 55;
type BetSplit17_20 = 56;
type BetSplit18_21 = 57;
type BetSplit19_22 = 58;
type BetSplit20_23 = 59;
type BetSplit21_24 = 60;
type BetSplit22_25 = 61;
type BetSplit23_26 = 62;
type BetSplit24_27 = 63;
type BetSplit25_28 = 64;
type BetSplit26_29 = 65;
type BetSplit27_30 = 66;
type BetSplit28_31 = 67;
type BetSplit29_32 = 68;
type BetSplit30_33 = 69;
type BetSplit31_34 = 70;
type BetSplit32_35 = 71;
type BetSplit33_36 = 72;

// 11x Payout Bets
type BetSplit0_00_2 = 73;
type BetSplit00_2_3 = 74;
type BetSplit0_1_2 = 75;
type BetStreet1_2_3 = 76;
type BetStreet4_5_6 = 77;
type BetStreet7_8_9 = 78;
type BetStreet10_11_12 = 79;
type BetStreet13_14_15 = 80;
type BetStreet16_17_18 = 81;
type BetStreet19_20_21 = 82;
type BetStreet22_23_24 = 83;
type BetStreet25_26_27 = 84;
type BetStreet28_29_30 = 85;
type BetStreet31_32_33 = 86;
type BetStreet34_35_36 = 87;

// 8x Payout Bets
type BetCorner1_2_4_5 = 88;
type BetCorner2_3_5_6 = 89;
type BetCorner4_5_7_8 = 90;
type BetCorner5_6_8_9 = 91;
type BetCorner7_8_10_11 = 92;
type BetCorner8_9_11_12 = 93;
type BetCorner10_11_13_14 = 94;
type BetCorner11_12_14_15 = 95;
type BetCorner13_14_16_17 = 96;
type BetCorner14_15_17_18 = 97;
type BetCorner16_17_19_20 = 98;
type BetCorner17_18_20_21 = 99;
type BetCorner19_20_22_23 = 100;
type BetCorner20_21_23_24 = 101;
type BetCorner22_23_25_26 = 102;
type BetCorner23_24_26_27 = 103;
type BetCorner25_26_28_29 = 104;
type BetCorner26_27_29_30 = 105;
type BetCorner28_29_31_32 = 106;
type BetCorner29_30_32_33 = 107;
type BetCorner31_32_34_35 = 108;
type BetCorner32_33_35_36 = 109;

// 5x Payout Bets
type BetDoubleStreet1_2_3_4_5_6 = 110;
type BetDoubleStreet4_5_6_7_8_9 = 111;
type BetDoubleStreet7_8_9_10_11_12 = 112;
type BetDoubleStreet10_11_12_13_14_15 = 113;
type BetDoubleStreet13_14_15_16_17_18 = 114;
type BetDoubleStreet16_17_18_19_20_21 = 115;
type BetDoubleStreet19_20_21_22_23_24 = 116;
type BetDoubleStreet22_23_24_25_26_27 = 117;
type BetDoubleStreet25_26_27_28_29_30 = 118;
type BetDoubleStreet28_29_30_31_32_33 = 119;
type BetDoubleStreet31_32_33_34_35_36 = 120;

// 6.2x Payout Bets
type BetDoubleStreet0_00_1_2_3 = 121;

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
  | BetThirdColumn
  | BetSplit0_00
  | BetSplit0_1
  | BetSplit00_3
  | BetSplit1_2
  | BetSplit2_3
  | BetSplit4_5
  | BetSplit5_6
  | BetSplit7_8
  | BetSplit8_9
  | BetSplit10_11
  | BetSplit11_12
  | BetSplit13_14
  | BetSplit14_15
  | BetSplit16_17
  | BetSplit17_18
  | BetSplit19_20
  | BetSplit20_21
  | BetSplit22_23
  | BetSplit23_24
  | BetSplit25_26
  | BetSplit26_27
  | BetSplit28_29
  | BetSplit29_30
  | BetSplit31_32
  | BetSplit32_33
  | BetSplit34_35
  | BetSplit35_36
  | BetSplit1_4
  | BetSplit2_5
  | BetSplit3_6
  | BetSplit4_7
  | BetSplit5_8
  | BetSplit6_9
  | BetSplit7_10
  | BetSplit8_11
  | BetSplit9_12
  | BetSplit10_13
  | BetSplit11_14
  | BetSplit12_15
  | BetSplit13_16
  | BetSplit14_17
  | BetSplit15_18
  | BetSplit16_19
  | BetSplit17_20
  | BetSplit18_21
  | BetSplit19_22
  | BetSplit20_23
  | BetSplit21_24
  | BetSplit22_25
  | BetSplit23_26
  | BetSplit24_27
  | BetSplit25_28
  | BetSplit26_29
  | BetSplit27_30
  | BetSplit28_31
  | BetSplit29_32
  | BetSplit30_33
  | BetSplit31_34
  | BetSplit32_35
  | BetSplit33_36
  | BetSplit0_00_2
  | BetSplit00_2_3
  | BetSplit0_1_2
  | BetStreet1_2_3
  | BetStreet4_5_6
  | BetStreet7_8_9
  | BetStreet10_11_12
  | BetStreet13_14_15
  | BetStreet16_17_18
  | BetStreet19_20_21
  | BetStreet22_23_24
  | BetStreet25_26_27
  | BetStreet28_29_30
  | BetStreet31_32_33
  | BetStreet34_35_36
  | BetCorner1_2_4_5
  | BetCorner2_3_5_6
  | BetCorner4_5_7_8
  | BetCorner5_6_8_9
  | BetCorner7_8_10_11
  | BetCorner8_9_11_12
  | BetCorner10_11_13_14
  | BetCorner11_12_14_15
  | BetCorner13_14_16_17
  | BetCorner14_15_17_18
  | BetCorner16_17_19_20
  | BetCorner17_18_20_21
  | BetCorner19_20_22_23
  | BetCorner20_21_23_24
  | BetCorner22_23_25_26
  | BetCorner23_24_26_27
  | BetCorner25_26_28_29
  | BetCorner26_27_29_30
  | BetCorner28_29_31_32
  | BetCorner29_30_32_33
  | BetCorner31_32_34_35
  | BetCorner32_33_35_36
  | BetDoubleStreet1_2_3_4_5_6
  | BetDoubleStreet4_5_6_7_8_9
  | BetDoubleStreet7_8_9_10_11_12
  | BetDoubleStreet10_11_12_13_14_15
  | BetDoubleStreet13_14_15_16_17_18
  | BetDoubleStreet16_17_18_19_20_21
  | BetDoubleStreet19_20_21_22_23_24
  | BetDoubleStreet22_23_24_25_26_27
  | BetDoubleStreet25_26_27_28_29_30
  | BetDoubleStreet28_29_30_31_32_33
  | BetDoubleStreet31_32_33_34_35_36
  | BetDoubleStreet0_00_1_2_3;

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
  coinType: string;
  transaction: TransactionType;
  hostAddress: string;
  origin?: string;
}

interface InternalRouletteSettleOrContinueInput
  extends RouletteSettleOrContinueInput {
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
      if (typeof betNumber !== "number") {
        throw new Error("invalid roulette bet");
      } else if (betNumber > 37) {
        throw new Error("roulette bet number does not exist");
      }
    } else {
      if (!!betNumber) {
        throw new Error(
          "Invalid combination, betType does not require betNumber"
        );
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
    arguments: [transaction.object(ROULETTE_CONFIG)],
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
    res.ok = true;
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
      transaction.object(UNI_HOUSE_OBJ_ID),
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
  origin,
}: InternalRouletteSettleOrContinueInput) => {
  transaction.moveCall({
    target: `${roulettePackageId}::${ROULETTE_MODULE_NAME}::settle_or_continue`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(ROULETTE_CONFIG),
      transaction.pure.address(hostAddress),
      transaction.pure(bcs.option(bcs.U64).serialize(null)),
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};
