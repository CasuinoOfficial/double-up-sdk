import {
  SuiClient,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { PLINKO_MODULE_NAME, RAND_OBJ_ID, UNI_HOUSE_OBJ_ID, PLINKO_CONFIG } from "../../constants";
import { KIOSK_ITEM, KIOSK_OWNER_CAP } from "@mysten/kiosk";

interface PlinkoGameResults {
  ballIndex: string;
  ballPath: number[];
}

interface PlinkoParsedGameResults {
  ball_index: string;
  ball_path: number[];
}

interface PlinkoResult {
  ballCount: string;
  betSize: string;
  challenged: boolean;
  gameId: string;
  gameType: PlinkoType;
  player: string;
  pnl: string;
  results: PlinkoGameResults[];
}

interface PlinkoParsedJson {
  ball_count: string;
  bet_size: string;
  challenged: boolean;
  game_id: string;
  game_type: PlinkoType;
  player: string;
  pnl: string;
  results: PlinkoParsedGameResults[];
}

// 0: 6 Rows, 1: 9 Rows, 2: 12 Rows
type PlinkoType = 0 | 1 | 2;

export interface PlinkoInput {
  betAmount: number;
  coin: TransactionObjectArgument;
  coinType: string;
  numberOfDiscs: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin?: string; 
}

interface InternalPlinkoInput extends PlinkoInput {
  plinkoPackageId: string;
}

export interface PlinkoResultInput {
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

export interface PlinkoResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface PlinkoResultResponse {
  ok: boolean;
  err?: Error;
  results?: PlinkoResult[];
  rawResults?: PlinkoParsedJson[];
  txDigests?: string[];
}

export interface CreatedPlinkoTableInput {
  coinType: string;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalCreatedPlinkoTableInput extends CreatedPlinkoTableInput {
  plinkoPackageId: string;
}

export interface CreatedPlinkoTableResponse {
  ok: boolean;
  err?: Error;
  result?: PlinkoTable;
}

interface PlinkoTable {
  tableId: string;
}

export interface PlinkoAddBetInput {
  creator: string;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

interface InternalPlinkoAddBetInput extends PlinkoAddBetInput {
  origin: string;
  plinkoPackageId: string;
}

export interface PlinkoAddBetResponse {
  ok: boolean;
  err?: Error;
  betId?: TransactionArgument;
}

interface PlinkoTableParsedJson {
  bet_id: string;
  creator: string;
  outcome: string;
  round_number: string;
  table_id: string;
}

export interface PlinkoTableInput {
  coinType: string;
  transaction: TransactionType;
}
export interface InternalPlinkoTableInput extends PlinkoTableInput {
  plinkoPackageId: string;
}

export interface PlinkoTableResponse {
  ok: boolean;
  err?: Error;
  result?: TransactionArgument;
}

export interface PlinkoTableExistsInput {
  creator: string;
  coinType: string;
}

interface InternalPlinkoTableExistsInput extends PlinkoTableExistsInput {
  plinkoPackageId: string;
  suiClient: SuiClient;
}

export interface PlinkoTableExistsResponse {
  ok: boolean;
  roundNumber?: string;
  err?: Error;
  tableExists?: boolean;
}

export interface PlinkoRemoveBetInput {
  creator: string;
  player: string;
  coinType: string;
  transaction: TransactionType;
}

interface InternalPlinkoRemoveBetInput extends PlinkoRemoveBetInput {
  plinkoPackageId: string;
}

export interface PlinkoRemoveBetResponse {
  ok: boolean;
  err?: Error;
  returnedCoin?: TransactionArgument;
}

export interface PlayPlinkoInput {
  coinType: string;
  creator: string;
  numberOfDiscs: number;
  betSize: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin: string;
}

interface InternalPlayPlinkoInput extends PlayPlinkoInput {
  plinkoPackageId: string;
}

export const createPlinkoTable = ({
  coinType, 
  plinkoPackageId,
  transaction,
}: InternalPlinkoTableInput): PlinkoTableResponse => {
  const res: PlinkoTableResponse = { ok: true };

  try {
    const [table] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::create_plinko_table`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
      ],
    });

    res.result = table;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const doesPlinkoTableExist = async ({
  creator,
  coinType,
  plinkoPackageId,
  suiClient,
}: InternalPlinkoTableExistsInput): Promise<PlinkoTableExistsResponse> => {
  const res: PlinkoTableExistsResponse = { ok: true };

  try {
    const { data } = await suiClient.getDynamicFieldObject({
      parentId: PLINKO_CONFIG,
      name: {
        type: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::GameTag<${coinType}>`,
        value: {
          creator,
        },
      },
    });

    if (data.content?.dataType !== "moveObject") {
      return null;
    }

    const fields = data.content.fields as any;
    res.roundNumber = fields.round_number;
    res.tableExists = !!data;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
}

export const getCreatedPlinkoTable = ({
  coinType,
  plinkoPackageId,
  transactionResult,
}: InternalCreatedPlinkoTableInput): CreatedPlinkoTableResponse => {
  const res: CreatedPlinkoTableResponse = { ok: true };

  try {
    const tableId = transactionResult.objectChanges.reduce((acc, current) => {
      if (
        current.type === "created" &&
        current.objectType ===
          `${plinkoPackageId}::${PLINKO_MODULE_NAME}::PlinkoTable<${coinType}>`
      ) {
        acc = current.objectId;
      }

      return acc;
    }, "");

    if (tableId.length === 0) {
      throw new Error("could not find plinko table");
    }

    res.result = { tableId };
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const addPlinkoBet = ({
  coinType,
  plinkoPackageId, 
  creator,
  coin,
  transaction,
}: InternalPlinkoAddBetInput): PlinkoAddBetResponse => {
  const res: PlinkoAddBetResponse = { ok: true };

  try {
    const [betId] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::add_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.pure.address(creator),
        coin,
      ],
    });

    res.betId = betId;
  } catch (err) {
    res.ok = false;
    res.err = err;
  };
  
  return res;
};

export const removePlinkoBet = ({
  coinType,
  plinkoPackageId,
  creator,
  player,
  transaction,
}: InternalPlinkoRemoveBetInput): PlinkoRemoveBetResponse => {
  const res: PlinkoRemoveBetResponse = { ok: true };

  try {
    const [coin] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::remove_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.pure.address(creator),
        transaction.pure.address(player),
      ],
    });

    res.returnedCoin = coin;
  } catch (err) {
    res.ok = false;
    res.err = err;
  };

  return res;
}

export const startMultiPlinko = ({
  coinType,
  creator,
  numberOfDiscs,
  betSize,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin,
}: InternalPlayPlinkoInput) => {
  transaction.moveCall({
    target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_plinko`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(PLINKO_CONFIG),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.address(creator),
      transaction.pure.u64(numberOfDiscs),
      transaction.pure.u64(betSize),
      transaction.pure.u8(plinkoType),
      transaction.pure.string(origin ?? "DoubleUp"),
    ],
  });
};


export const createSinglePlinko = ({
  coin,
  coinType,
  numberOfDiscs,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin
}: InternalPlinkoInput) => {
  transaction.moveCall({
    target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(RAND_OBJ_ID),
      transaction.pure.u64(numberOfDiscs),
      transaction.pure.u8(plinkoType),
      transaction.pure.string(origin ?? "DoubleUp"),
      coin,
    ],
  });
};