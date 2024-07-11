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
  DICE_CORE_PACKAGE_ID,
  DICE_MODULE_NAME,
  DICE_STRUCT_NAME,
  UNI_HOUSE_OBJ,
  UNIHOUSE_CORE_PACKAGE,
} from "../../constants";
import { getBlsGameInfos, sleep } from "../../utils";

// Note: 0 - 5 for dice rolls, and 6 = even, 7 = odd, 8 = small, 9 = big
type BetType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type DiceResult = any;

export interface DiceInput {
  betType: BetType;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

interface InternalDiceInput extends DiceInput {
  dicePackageId: string;
}

export interface DiceResultInput {
  betType: BetType;
  coinType: string;
  gameSeed: string;
  pollInterval?: number;
  transactionResult: SuiTransactionBlockResponse;
}

interface InternalDiceResultInput extends DiceResultInput {
  diceCorePackageId: string;
  suiClient: SuiClient;
}

export interface DiceResponse {
  ok: boolean;
  err?: Error;
  gameSeed?: string;
  receipt?: TransactionArgument;
}

export interface DiceResultResponse {
  ok: boolean;
  err?: Error;
  results?: DiceResult[];
}

// Add dice to the transaction block
export const createDice = ({
  betType,
  coin,
  coinType,
  dicePackageId,
  transaction,
}: InternalDiceInput): DiceResponse => {
  const res: DiceResponse = { ok: true };

  try {
    // This adds some extra entropy to the dice itself
    const userRandomness = Buffer.from(nanoid(512), "utf8");

    const [receipt] = transaction.moveCall({
      target: `${dicePackageId}::${DICE_MODULE_NAME}::start_game`,
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

    res.gameSeed = Buffer.from(userRandomness).toString("hex");
    res.receipt = receipt;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getDiceResult = async ({
  betType,
  coinType,
  diceCorePackageId,
  gameSeed,
  pollInterval = 3000,
  suiClient,
  transactionResult,
}: InternalDiceResultInput): Promise<DiceResultResponse> => {
  const res: DiceResultResponse = { ok: true };

  try {
    const gameInfos = getBlsGameInfos({
      coinType,
      corePackageId: DICE_CORE_PACKAGE_ID,
      gameSeed,
      moduleName: DICE_MODULE_NAME,
      structName: DICE_STRUCT_NAME,
      transactionResult,
    });

    const results = [];

    console.log(gameInfos);

    while (results.length === 0) {
      try {
        const events = await suiClient.queryEvents({
          query: {
            MoveEventType: `${UNIHOUSE_CORE_PACKAGE}::${BLS_SETTLER_MODULE_NAME}::SettlementEvent<${coinType}, ${diceCorePackageId}::${DICE_MODULE_NAME}::${DICE_STRUCT_NAME}>`,
          },
          limit: 50,
          order: "descending",
        });

        events.data.map((event) => {
          console.log(event);
          console.log(event.parsedJson);
        });

        // results = events.data.reduce((acc, current) => {
        //     const {
        //         bet_id,
        //         settlements
        //     } = current.parsedJson as CoinflipParsedJson;

        //     if (bet_id == gameInfos[0].gameId) {
        //         const { player_won } = settlements[0];

        //         if (player_won) {
        //             acc.push(betType === 0 ? 0 : 1);
        //         } else {
        //             acc.push(betType === 0 ? 1 : 0);
        //         }
        //     }

        //     return acc;
        // }, []);
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
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};
