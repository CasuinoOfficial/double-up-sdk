import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { nanoid } from "nanoid";

import {
  BLS_SETTLER_MODULE_NAME,
  BLS_VERIFIER_OBJ,
  RANGE_DICE_MODULE_NAME,
  RANGE_DICE_STRUCT_NAME,
  UNI_HOUSE_OBJ,
  UNIHOUSE_CORE_PACKAGE,
} from "../../constants";
import { getBlsGameInfos, getBlsGameInfosWithDraw, sleep } from "../../utils";

// Note: 0 = Over, 1 = Under
type OverUnderBet = 0 | 1;

// Note: 2 = Inside, 3 = Outside
type InsideOutsideBet = 2 | 3;

type RangeDiceResult = any;

export interface RangeDiceInput {
  betType: OverUnderBet | InsideOutsideBet;
  coin: TransactionObjectArgument;
  coinType: string;
  partnerNftId?: string;
  range: number | number[];
  transaction: TransactionType;
}

interface InternalRangeDiceInput extends RangeDiceInput {
  partnerNftListId?: string;
  rangeDicePackageId: string;
}

interface RangeDiceParsedJson {
  bet_id: string;
  outcome: string;
  player: string;
  settlements: RangeDiceSettlement[];
}

interface RangeDiceSettlement {
  bet_size: string;
  payout_amount: string;
  player_won: boolean;
  win_condition: WinCondition;
}

export interface RangeDiceResultInput {
  betType: OverUnderBet | InsideOutsideBet;
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalRangeDiceResultInput extends RangeDiceResultInput {
  rangeDiceCorePackageId: string;
  suiClient: SuiClient;
}

// export interface DiceResponse {
//     ok: boolean;
//     err?: Error;
//     gameSeed?: string;
//     receipt?: TransactionArgument;
// }

export interface RangeDiceResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface RangeDiceResultResponse {
  ok: boolean;
  err?: Error;
  results?: RangeDiceResult[];
  rawResults?: RangeDiceParsedJson[];
  txDigests?: string[];
}

interface WinCondition {
  vec: WinRange[];
}

interface WinRange {
  from: string;
  to: string;
}

const isOverUnder = (
  betType: OverUnderBet | InsideOutsideBet
): betType is OverUnderBet => betType === 0 || betType === 1;

const isInsideOutside = (
  betType: OverUnderBet | InsideOutsideBet
): betType is InsideOutsideBet => betType === 2 || betType === 3;

const isRangeNumber = (range: number | number[]): range is number =>
  typeof range === "number";

const isRangeArray = (range: number | number[]): range is number[] =>
  typeof range[0] === "number";

const MULTIPLIER = 100;

// Start ranged dice game
export const createRangeDice = ({
  betType,
  coin,
  coinType,
  partnerNftId,
  partnerNftListId,
  range,
  transaction,
  rangeDicePackageId,
}: InternalRangeDiceInput): RangeDiceResponse => {
  let res: RangeDiceResponse = { ok: true };

  const shouldUsePartnerEdge =
    typeof partnerNftId === "string" && typeof partnerNftListId === "string";

  try {
    // This adds some extra entropy to the weighted dice itself
    const userRandomness = Buffer.from(nanoid(512), "utf8");

    if (isOverUnder(betType) && isRangeNumber(range)) {
      if (range < 1 || range > 100) {
        throw new Error("range must be between 1 - 100");
      }

      const rangeMult = Math.trunc(range * MULTIPLIER);

      if (shouldUsePartnerEdge) {
        const [receipt] = transaction.moveCall({
          target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_over_under_game_with_partner`,
          typeArguments: [coinType],
          arguments: [
            transaction.object(UNI_HOUSE_OBJ),
            transaction.object(BLS_VERIFIER_OBJ),
            transaction.pure(
              bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
            ),
            transaction.pure.u64(rangeMult),
            transaction.pure.u64(betType),
            coin,
            transaction.object(partnerNftId),
            transaction.object(partnerNftListId),
          ],
        });

        res.receipt = receipt;
      } else {
        const [receipt] = transaction.moveCall({
          target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_over_under_game`,
          typeArguments: [coinType],
          arguments: [
            transaction.object(UNI_HOUSE_OBJ),
            transaction.object(BLS_VERIFIER_OBJ),
            transaction.pure(
              bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
            ),
            transaction.pure.u64(rangeMult),
            transaction.pure.u64(betType),
            coin,
          ],
        });

        res.receipt = receipt;
      }
    } else if (
      isInsideOutside(betType) &&
      isRangeArray(range) &&
      range.length === 2
    ) {
      const [lower, upper] = range;

      if (lower < 1 || lower > 100 || upper < 1 || upper > 100) {
        throw new Error("range must be between 1 - 100");
      }

      if (lower > upper) {
        throw new Error("upper bound must be greater than lower bound");
      }

      const lowerMult = Math.trunc(lower * MULTIPLIER);
      const upperMult = Math.trunc(upper * MULTIPLIER);

      if (shouldUsePartnerEdge) {
        const [receipt] = transaction.moveCall({
          target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_range_game_with_partner`,
          typeArguments: [coinType],
          arguments: [
            transaction.object(UNI_HOUSE_OBJ),
            transaction.object(BLS_VERIFIER_OBJ),
            transaction.pure(
              bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
            ),
            transaction.pure.u64(lowerMult),
            transaction.pure.u64(upperMult),
            transaction.pure.u64(betType),
            coin,
            transaction.object(partnerNftId),
            transaction.object(partnerNftListId),
          ],
        });

        res.receipt = receipt;
      } else {
        const [receipt] = transaction.moveCall({
          target: `${rangeDicePackageId}::${RANGE_DICE_MODULE_NAME}::start_range_game`,
          typeArguments: [coinType],
          arguments: [
            transaction.object(UNI_HOUSE_OBJ),
            transaction.object(BLS_VERIFIER_OBJ),
            transaction.pure(
              bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
            ),
            transaction.pure.u64(lowerMult),
            transaction.pure.u64(upperMult),
            transaction.pure.u64(betType),
            coin,
          ],
        });

        res.receipt = receipt;
      }
    } else {
      throw new Error("invalid bet type or range");
    }

    res.gameSeed = Buffer.from(userRandomness).toString("hex");
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getRangeDiceResult = async ({
  betType,
  coinType,
  gameSeed,
  pollInterval = 3000,
  rangeDiceCorePackageId,
  suiClient,
  transactionResult,
}: InternalRangeDiceResultInput): Promise<RangeDiceResultResponse> => {
  let res: RangeDiceResultResponse = { ok: true };

  try {
    const gameInfos = getBlsGameInfosWithDraw({
      coinType,
      corePackageId: rangeDiceCorePackageId,
      gameSeed,
      moduleName: RANGE_DICE_MODULE_NAME,
      structName: RANGE_DICE_STRUCT_NAME,
      transactionResult,
    });

    let results: (OverUnderBet | InsideOutsideBet)[] = [];
    let rawResults: RangeDiceParsedJson[] = [];
    let txDigests: string[] = [];

    while (results.length === 0) {
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${rangeDiceCorePackageId}::${RANGE_DICE_MODULE_NAME}::${RANGE_DICE_STRUCT_NAME}>`,
          },
          limit: 50,
          order: "descending",
        });

        results = events.data.reduce((acc, current) => {
          const { bet_id, settlements } =
            current.parsedJson as RangeDiceParsedJson;

          if (bet_id == gameInfos[0].gameId) {
            const { player_won } = settlements[0];

            rawResults.push(current.parsedJson as RangeDiceParsedJson);
            txDigests.push(current.id.txDigest);

            let res: OverUnderBet | InsideOutsideBet;

            if (player_won) {
              res = betType;
            } else {
              switch (betType) {
                case 0:
                  res = 1;
                  break;
                case 1:
                  res = 0;
                  break;
                case 2:
                  res = 3;
                  break;
                case 3:
                  res = 2;
                  break;
              }
            }

            acc.push(res);
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
