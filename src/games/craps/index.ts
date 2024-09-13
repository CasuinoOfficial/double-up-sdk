import {
  CLOCK_OBJ_ID,
  CRAPS_CONFIG,
  CRAPS_MODULE_NAME,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  RAND_OBJ_ID,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import { bcs } from "@mysten/sui/bcs";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";
import { getAssetIndex } from "../../utils";

export interface CrapsRemoveBetInput {
  coinType: string;
  tableOwner: string;
  betType: number;
  betNumber?: number;
  transaction: TransactionType;
}

interface InternalCrapsRemoveBetInput extends CrapsRemoveBetInput {
  crapsPackageId: string;
}

export interface CrapsSettleOrContinueInput {
  coinType: string;
  transaction: TransactionType;
  hostAddress: string;
  origin?: string;
}

interface InternalCrapsSettleOrContinueInput
  extends CrapsSettleOrContinueInput {
  crapsPackageId: string;
}

export interface CrapsRemoveBetResponse {
  ok: boolean;
  err?: Error;
  returnedCoin: TransactionArgument;
}

export interface CrapsStartInput {
  coinType: string;
  transaction: TransactionType;
}

interface InternalCrapsStartInput extends CrapsStartInput {
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

export type CrapsBet =
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

export const PassLineBet = 0;
export const DontPassLineBet = 1;
export const FieldBet = 2;
export const PlaceBet = 3;
export const BuyBet = 4;
export const LayBet = 5;
export const LittleOnesBet = 6;
export const BigOnesBet = 7;
export const AllOfThemBet = 8;
export const ComeBet = 9;
export const DontComeBet = 10;
export const HardWaysBet = 11;
export const AnyCrapsBet = 12;
export const CrapsSevenBet = 13;
export const PassOddsBet = 14;
export const DontPassOddsBet = 15;
export const ComeOddsBet = 16;
export const DontComeOddsBet = 17;
export const CESplitBet = 18;

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

export interface CrapsContractData {
  balance: string;
  bets: {
    fields: {
      head: string | null;
      id: { id: string };
      size: string;
      tail: string | null;
    };
    type: string;
  };
  creator: string;
  current_risk: string;
  id: { id: string };
  numbers_rolled: string[];
  numbers_rolled_set: { fields: { contents: string[] }; type: string };
  round_number: string;
  rounds_settled: {
    fields: { id: { id: string }; size: string };
    type: string;
  };
  settled_bets: {
    fields: {
      head: string | null;
      id: { id: string };
      size: string;
      tail: string | null;
    };
    type: string;
  };
  status: number;
  target_roll_sum: string;
}

export const createCrapsTable = ({
  coinType,
  crapsPackageId,
  transaction,
}: InternalCrapsTableInput) => {
  transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::create_craps_table`,
    typeArguments: [coinType],
    arguments: [transaction.object(CRAPS_CONFIG)],
  });
};

export const getCrapsTable = async ({
  address,
  coinType,
  crapsPackageId,
  suiClient,
}: InternalGetCrapsTableInput): Promise<CrapsContractData | null> => {
  const { data } = await suiClient.getDynamicFieldObject({
    parentId: CRAPS_CONFIG,
    name: {
      type: `${crapsPackageId}::${CRAPS_MODULE_NAME}::CrapsTag<${coinType}>`,
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

export const addCrapsBet = ({
  address,
  betNumber,
  betType,
  coin,
  coinType,
  crapsPackageId,
  transaction,
}: InternalCrapsAddBetInput) => {
  transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::place_bet`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(CRAPS_CONFIG),
      transaction.pure.address(address),
      transaction.pure.u64(betType),
      transaction.pure(
        bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)
      ),
      coin,
    ],
  });
};

export const removeCrapsBet = ({
  coinType,
  betNumber,
  betType,
  crapsPackageId,
  tableOwner,
  transaction,
}: InternalCrapsRemoveBetInput): CrapsRemoveBetResponse => {
  const [coin] = transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::remove_bet`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(CRAPS_CONFIG),
      transaction.pure.address(tableOwner),
      transaction.pure.u64(betType),
      transaction.pure(
        bcs.option(bcs.U64).serialize(betNumber ? betNumber : null)
      ),
    ],
  });
  const res: CrapsRemoveBetResponse = { ok: true, returnedCoin: coin };
  return res;
};

export const startCraps = ({
  coinType,
  crapsPackageId,
  transaction,
}: InternalCrapsStartInput) => {
  transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::start_roll`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      transaction.object(CRAPS_CONFIG),
    ],
  });
};

export const crapsSettleOrContinue = ({
  coinType,
  crapsPackageId,
  transaction,
  hostAddress,
  origin,
}: InternalCrapsSettleOrContinueInput) => {
  let assetIndex = getAssetIndex(coinType);
  transaction.moveCall({
    target: `${crapsPackageId}::${CRAPS_MODULE_NAME}::settle_or_continue_0`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(CRAPS_CONFIG),
      transaction.pure.address(hostAddress),
      transaction.pure(bcs.option(bcs.U64).serialize(null)),
      transaction.pure.string(origin ?? "DoubleUp"),
      transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
      transaction.object(SUILEND_MARKET),
      transaction.object(CLOCK_OBJ_ID),
      transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
      transaction.pure.u64(assetIndex),
    ],
  });
};
