import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { nanoid } from "nanoid";

import {
  BLS_VERIFIER_OBJ,
  LIMBO_MAX_MULTIPLIER,
  LIMBO_MIN_MULTIPLIER,
  LIMBO_MODULE_NAME,
  LIMBO_STRUCT_NAME,
  UNI_HOUSE_OBJ,
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";
import { rawListeners } from "process";

type LimboResult = number;

interface LimboGameResults {
  bet_returned: string;
  bet_size: string;
  outcome: string;
}

export interface LimboInput {
  coin: TransactionObjectArgument;
  coinType: string;
  multiplier: number;
  transaction: TransactionType;
}

interface LimboParsedJson {
  game_id: string;
  player: string;
  results: LimboGameResults[];
}

interface InternalLimboInput extends LimboInput {
  limboPackageId: string;
}

export interface LimboResultInput {
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalLimboResultInput extends LimboResultInput {
  limboCorePackageId: string;
  suiClient: SuiClient;
}

export interface LimboResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface LimboResultResponse {
  ok: boolean;
  err?: Error;
  results?: LimboResult[];
  rawResults?: LimboParsedJson[];
  txDigests?: string[];
}

const distanceToMultiplier = (distance: number): number => {
  distance /= 100_000;
  const res = (10_000 - distance) / (10_000 - 100 * distance);

  if (res > 100) {
    return 100;
  }

  return Math.floor(res * 100) / 100;
};

// Weighted flip where the user can select how much multiplier they want.
export const createLimbo = ({
  coin,
  coinType,
  limboPackageId,
  multiplier,
  transaction,
}: InternalLimboInput): LimboResponse => {
  const res: LimboResponse = { ok: true };

  try {
    if (
      Number(multiplier) < Number(LIMBO_MIN_MULTIPLIER) ||
      Number(multiplier) > Number(LIMBO_MAX_MULTIPLIER)
    ) {
      throw new Error("Multiplier out of range");
    }

    // This adds some extra entropy to the coinflip itself.
    const userRandomness = Buffer.from(nanoid(512), "utf8");

    const [receipt] = transaction.moveCall({
      target: `${limboPackageId}::${LIMBO_MODULE_NAME}::start_game`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ),
        transaction.object(BLS_VERIFIER_OBJ),
        transaction.pure(
          bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
        ),
        transaction.pure(
          bcs.vector(bcs.U64).serialize([Math.floor(Number(multiplier) * 100)])
        ),
        transaction.makeMoveVec({ elements: [coin] }),
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

export const getLimboResult = async ({
  coinType,
  gameSeed,
  limboCorePackageId,
  pollInterval = 3000,
  suiClient,
  transactionResult,
}: InternalLimboResultInput): Promise<LimboResultResponse> => {
  const res: LimboResultResponse = { ok: true };

  try {
    const gameInfos = getBlsGameInfos({
      coinType,
      corePackageId: limboCorePackageId,
      gameSeed,
      moduleName: LIMBO_MODULE_NAME,
      structName: LIMBO_STRUCT_NAME,
      transactionResult,
    });

    let results: LimboResult[] = [];
    let rawResults: LimboParsedJson[] = [];
    let txDigests: string[] = [];

    while (results.length === 0) {
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${limboCorePackageId}::${LIMBO_MODULE_NAME}::LimboResults<${coinType}>`,
          },
          limit: 50,
          order: "descending",
        });

        console.log("limbo event", events);

        results = events.data.reduce((acc, current) => {
          const { game_id, results } = current.parsedJson as LimboParsedJson;

          if (game_id && game_id === gameInfos[0].gameId) {
            rawResults.push(current.parsedJson as LimboParsedJson);

            txDigests.push(current.id.txDigest);

            const { outcome } = results[0];

            if (+outcome % 69 === 0) {
              acc.push(1);
            } else {
              acc.push(distanceToMultiplier(+outcome));
            }
          }

          return acc;
        }, []);
      } catch (err) {
        console.error(`DOUBLEUP - Error querying events: ${err}`);
      }

      if (results.length === 0) {
        console.log(
          `DOUBLEUP - Game in processing. Query again in ${
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
