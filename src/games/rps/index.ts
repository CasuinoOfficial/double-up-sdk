import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { randomBytes } from "crypto";
import { nanoid } from "nanoid";

import {
  BLS_SETTLER_MODULE_NAME,
  BLS_VERIFIER_OBJ,
  RPS_MODULE_NAME,
  RPS_STRUCT_NAME,
  UNI_HOUSE_OBJ,
  UNIHOUSE_CORE_PACKAGE,
} from "../../constants";
import { getBlsGameInfosWithDraw, sleep } from "../../utils";

// 0: Rock, 1: Paper, 2: Scissors
type BetType = 0 | 1 | 2;

export interface RPSInput {
  betType: BetType;
  coin: TransactionObjectArgument;
  coinType: string;
  partnerNftId?: string;
  transaction: TransactionType;
}

interface InternalRPSInput extends RPSInput {
  partnerNftListId?: string;
  rpsPackageId: string;
}

interface RPSSettlement {
  bet_size: string;
  payout_amount: string;
  player_won: boolean;
  win_condition: WinCondition;
}

interface RPSParsedJson {
  bet_id: string;
  outcome: string;
  player: string;
  settlements: RPSSettlement[];
}

export interface RPSResultInput {
  betType: BetType;
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalRPSResultInput extends RPSResultInput {
  rpsCorePackageId: string;
  suiClient: SuiClient;
}

export interface RPSResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface RPSResultResponse {
  ok: boolean;
  err?: Error;
  results?: BetType[];
  rawResults?: RPSParsedJson[];
  txDigests?: string[];
}

interface WinCondition {
  vec: WinRange[];
}

interface WinRange {
  from: string;
  to: string;
}

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

// Add rps to the transaction block
export const createRockPaperScissors = ({
  betType,
  coin,
  coinType,
  partnerNftId,
  partnerNftListId,
  rpsPackageId,
  transaction,
}: InternalRPSInput): RPSResponse => {
  const res: RPSResponse = { ok: true };

  try {
    // This adds some extra entropy to the coinflip itself
    const userRandomness = randomBytes(512);

    if (
      typeof partnerNftId === "string" &&
      typeof partnerNftListId === "string"
    ) {
      const [receipt] = transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::start_game_with_partner`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ),
          transaction.object(BLS_VERIFIER_OBJ),
          transaction.pure(
            bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
          ),
          transaction.pure.u64(betType),
          coin,
          transaction.object(partnerNftId),
          transaction.object(partnerNftListId),
        ],
      });

      res.receipt = receipt;
    } else {
      const [receipt] = transaction.moveCall({
        target: `${rpsPackageId}::${RPS_MODULE_NAME}::start_game`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ),
          transaction.object(BLS_VERIFIER_OBJ),
          transaction.pure(
            bcs.vector(bcs.U8).serialize(Array.from(userRandomness))
          ),
          transaction.pure.u64(betType),
          coin,
        ],
      });

      res.receipt = receipt;
    }

    res.gameSeed = Buffer.from(userRandomness).toString("hex");
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getRockPaperScissorsResult = async ({
  betType,
  coinType,
  gameSeed,
  pollInterval = 3000,
  rpsCorePackageId,
  suiClient,
  transactionResult,
}: InternalRPSResultInput): Promise<RPSResultResponse> => {
  const res: RPSResultResponse = { ok: true };

  try {
    const gameInfos = getBlsGameInfosWithDraw({
      coinType,
      corePackageId: rpsCorePackageId,
      gameSeed,
      moduleName: RPS_MODULE_NAME,
      structName: RPS_STRUCT_NAME,
      transactionResult,
    });

    console.log("GameInfos: ", gameInfos.length);
    for (const [index, gameInfo] of gameInfos.entries()) {
      console.log(`GameInfo ${index}: `, gameInfo.gameId);
    }

    let results: BetType[] = [];
    let rawResults: RPSParsedJson[] = [];
    let txDigests: string[] = [];

    while (results.length < gameInfos.length) {
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${rpsCorePackageId}::${RPS_MODULE_NAME}::${RPS_STRUCT_NAME}>`,
          },
          limit: 50,
          order: "descending",
        });

        events.data.forEach((event) => {
          const { bet_id, settlements } = event.parsedJson as RPSParsedJson;

          if (bet_id == gameInfos[results.length].gameId) {
            rawResults.push(event.parsedJson as RPSParsedJson);

            txDigests.push(event.id.txDigest);

            const { bet_size, payout_amount } = settlements[0];

            let res: BetType;

            if (bet_size < payout_amount) {
              // win
              switch (betType) {
                case ROCK:
                  res = SCISSORS;
                  break;
                case PAPER:
                  res = ROCK;
                  break;
                case SCISSORS:
                  res = PAPER;
                  break;
              }
            } else if (bet_size > payout_amount) {
              // lose

              switch (betType) {
                case ROCK:
                  res = PAPER;
                  break;
                case PAPER:
                  res = SCISSORS;
                  break;
                case SCISSORS:
                  res = ROCK;
                  break;
              }
            } else {
              // draw
              switch (betType) {
                case ROCK:
                  res = ROCK;
                  break;
                case PAPER:
                  res = PAPER;
                  break;
                case SCISSORS:
                  res = SCISSORS;
                  break;
              }
            }

            results.push(res);
          }
        }, []);
      } catch (err) {
        console.error(`DOUBLEUP - Error querying events: ${err}`);
      }

      if (results.length < gameInfos.length) {
        console.log(
          `DOUBLEUP - results: ${
            results.length
          } - Game in processing. Query again in ${
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
