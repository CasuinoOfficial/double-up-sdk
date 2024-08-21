import { CRAPS_CONFIG, CRAPS_MODULE_NAME, RAND_OBJ_ID, UNI_HOUSE_OBJ_ID } from "src/constants";
import { bcs } from "@mysten/sui/bcs";
import {
    TransactionArgument,
    Transaction as TransactionType,
    TransactionObjectArgument,
  } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

export interface CrapsRemoveBetInput {
    coinType: string;
    tableOwner: string;
    betType: number;
    betNumber?: number;
    transaction: TransactionType;
  }

interface InternalCraosRemoveBetInput extends CrapsRemoveBetInput {
    crapsPackageId: string;
  }
  
export interface CrapsSettleOrContinueInput {
    coinType: string,
    transaction: TransactionType;
    hostAddress: string;
    origin?: string;
}

interface InternalCrapsSettleOrContinueInput extends CrapsSettleOrContinueInput {
    crapsPackageId: string;
}

export interface CrapsRemoveBetResponse {
    ok: boolean;
    err?: Error;
    returnedCoin?: TransactionArgument;
}

export interface RouletteStartInput {
    coinType: string;
    transaction: TransactionType;
  }
  
interface InternalRouletteStartInput extends RouletteStartInput {
    crapsPackageId: string;
}

export interface CrapsTableInput {
    coinType: string;
    transaction: TransactionType;
  }
  
interface InternalCrapsTableInput extends CrapsTableInput {
    crapsPackageId: string;
}

type PassLineBet = 0;
type DontPassLineBet = 1;
type FieldBet = 2;
type PlaceBet = 3;
type BuyBet = 4;
type LayBet = 5;
type LittleOnesBet = 6;
type BigOnesBet = 7;
type AllOfThemBet = 8;
type ComeBet = 9;
type DontComeBet = 10;
type HardWaysBet = 11;
type AnyCrapsBet = 12;
type CrapsSevenBet = 13;
type PassOddsBet = 14;
type DontPassOddsBet = 15;
type ComeOddsBet = 16;
type DontComeOddsBet = 17;
type CESplitBet = 18;

type CrapsBet =
  | PassLineBet
  | DontPassLineBet
  | FieldBet
  | PlaceBet
  | BuyBet
  | LayBet
  | LittleOnesBet
  | BigOnesBet
  | AllOfThemBet
  | ComeBet
  | DontComeBet
  | HardWaysBet
  | AnyCrapsBet
  | CrapsSevenBet
  | PassOddsBet
  | DontPassOddsBet
  | ComeOddsBet
  | DontComeOddsBet 
  | CESplitBet;

export interface CrapsAddBetInput {
    address: string;
    betNumber?: number;
    betType: CrapsBet;
    coin: TransactionObjectArgument;
    coinType: string;
    transaction: TransactionType;
  }
  
interface InternalCrapsAddBetInput extends CrapsAddBetInput {
    origin: string;
    crapsPackageId: string;
}

export interface GetCrapsTableInput {
    address: string;
    coinType: string;
  }
  
interface InternalGetCrapsTableInput extends GetCrapsTableInput {
    crapsPackageId: string;
    suiClient: SuiClient;
}

export interface GetCrapsTableResponse {
    ok: boolean;
    err?: Error;
    fields?: any;
}


export const createCrapsTable = ({
    coinType,
    crapsPackageId,
    transaction,
}: InternalCrapsTableInput) => {
    transaction.moveCall({
        target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::create_craps_table`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(CRAPS_CONFIG),
        ],
    });
}

export const getCrapsTable = async ({
    address,
    coinType,
    crapsPackageId,
    suiClient,
}: InternalGetCrapsTableInput): Promise<GetCrapsTableResponse> => {
    const { data } = await suiClient.getDynamicFieldObject({
        parentId: CRAPS_CONFIG,
        name: {
          type: `${crapsPackageId}::${CRAPS_MODULE_NAME}::GameTag<${coinType}>`,
          value: {
            creator: address,
          },
        },
      });
  
      if (data.content?.dataType !== "moveObject") {
        return null;
      }
  
      const fields = data.content.fields as any;
      return fields;
}

export const placeBet = ({
    address,
    betNumber,
    betType,
    coin,
    coinType,
    crapsPackageId,
    transaction,
}) => {
    transaction.moveCall({
        target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::place_bet`,
        typeArguments: [coinType],
        arguments: [
            transaction.object(UNI_HOUSE_OBJ_ID),
            transaction.object(CRAPS_CONFIG),
            transaction.pure.address(address),
            transaction.pure.u8(betType),
            transaction.pure(
              bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)
            ),
            coin,
        ],
    });
}

export const removeCrapsBet = ({
    coinType,
    betNumber,
    betType,
    crapsPackageId,
    tableOwner,
    transaction,
}: InternalCraosRemoveBetInput): CrapsRemoveBetResponse => {
    const res: CrapsRemoveBetResponse = { ok: true };
  
    try {
      const [coin] = transaction.moveCall({
        target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::remove_bet`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(CRAPS_CONFIG),
          transaction.pure.address(tableOwner),
          transaction.pure.u8(betType),
          transaction.pure(
            bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)
          ),
        ],
      });
  
      res.returnedCoin = coin;
    } catch (err) {
      res.ok = false;
      res.err = err;
    }
  
    return res;
};

export const startCraps = ({
    coinType,
    crapsPackageId,
    transaction,
}: InternalRouletteStartInput) => {
    transaction.moveCall({
        target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::start_roll`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(RAND_OBJ_ID),
          transaction.object(CRAPS_CONFIG),
        ],
    });
}

export const crapsSettleOrContinue = ({
    coinType,
    crapsPackageId,
    transaction,
    hostAddress,
    origin
  }: InternalCrapsSettleOrContinueInput) => {
    transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::settle_or_continue`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(CRAPS_CONFIG),
        transaction.pure.address(hostAddress),
        transaction.pure(bcs.option(bcs.U64).serialize(null)),
        transaction.pure.string(origin ?? "DoubleUp")
      ],
    });
  }