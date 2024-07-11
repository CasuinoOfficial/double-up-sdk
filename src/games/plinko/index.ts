import {
  SuiClient,
  SuiEvent,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { nanoid } from "nanoid";

import { PLINKO_MODULE_NAME, UNI_HOUSE_OBJ } from "../../constants";
import { getGameInfos, sleep } from "../../utils";

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
}

interface InternalPlinkoInput extends PlinkoInput {
  plinkoPackageId: string;
  plinkoVerifierId: string;
}

export interface PlinkoResultInput {
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalPlinkoResultInput extends PlinkoResultInput {
  plinkoPackageId: string;
  plinkoCorePackageId: string;
  suiClient: SuiClient;
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

export const createPlinko = ({
  betAmount,
  coin,
  coinType,
  numberOfDiscs,
  plinkoPackageId,
  plinkoType,
  plinkoVerifierId,
  transaction,
}: InternalPlinkoInput): PlinkoResponse => {
  const res: PlinkoResponse = { ok: true };

  try {
    const userRandomness = Buffer.from(nanoid(512), "utf8");

    const [_, receipt] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::start_game`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ),
        transaction.object(plinkoVerifierId),
        transaction.pure.u64(numberOfDiscs),
        transaction.pure.u64(betAmount),
        transaction.pure.u8(plinkoType),
        transaction.pure(
          bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
        ),
        coin,
      ],
    });

    res.gameSeed = Buffer.from(userRandomness).toString("hex");
    res.receipt = receipt;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getPlinkoResult = async ({
  coinType,
  gameSeed,
  plinkoPackageId,
  plinkoCorePackageId,
  pollInterval = 3000,
  suiClient,
  transactionResult,
}: InternalPlinkoResultInput): Promise<PlinkoResultResponse> => {
  const res: PlinkoResultResponse = { ok: true };

  try {
    const gameInfos = getGameInfos({
      coinType,
      corePackageId: plinkoCorePackageId,
      gameSeed,
      moduleName: PLINKO_MODULE_NAME,
      transactionResult,
    });

    let results: PlinkoResult[] = [];
    let rawResults: PlinkoParsedJson[] = [];
    let txDigests: string[] = [];

    while (results.length === 0) {
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::Outcome<${coinType}>`,
          },
          limit: 50,
          order: "descending",
        });

        results = events.data.reduce((acc, current) => {
          const {
            ball_count,
            bet_size,
            challenged,
            game_id,
            game_type,
            player,
            pnl,
            results = [],
          } = current.parsedJson as PlinkoParsedJson;

          if (game_id === gameInfos[0].gameId) {
            rawResults.push(current.parsedJson as PlinkoParsedJson);

            txDigests.push(current.id.txDigest);

            acc.push({
              ballCount: ball_count,
              betSize: bet_size,
              challenged,
              gameId: game_id,
              gameType: game_type,
              player,
              pnl,
              results: results.map(({ ball_index, ball_path }) => ({
                ballIndex: ball_index,
                ballPath: ball_path,
              })),
            });
          }

          return acc;
        }, []);
      } catch (err) {
        console.error(`DOUBLEUP - Error querying events: ${err}`);
      }

      if (results.length === 0) {
        console.log(
          `DOUBLEUP - No results found. Trying again in ${
            pollInterval / 1000
          } seconds.`
        );
        await sleep(pollInterval);
      }
    }

    res.results = results;
    res.rawResults = rawResults;
    res.txDigests = txDigests;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};
