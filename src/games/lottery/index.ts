import { SuiClient } from "@mysten/sui/client";
import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  CLOCK_OBJ,
  LOTTERY_ID,
  LOTTERY_MODULE_NAME,
  LOTTERY_PACKAGE_ID,
  LOTTERY_STORE_ID,
  SUI_COIN_TYPE,
} from "../../constants/testnetConstants";
import { sleep } from "../../utils";

export interface BuyTicketsInput {
  address: string;
  coin: TransactionObjectArgument;
  tickets: Ticket[];
  transaction: TransactionType;
}

export interface BuyTicketsResponse {
  ok: boolean;
  err?: Error;
}

export interface DrawingResultInput {
  pollInterval?: number;
  round: number;
}

interface InternalDrawingResultInput extends DrawingResultInput {
  suiClient: SuiClient;
}

export interface DrawingResultResponse {
  ok: boolean;
  err?: Error;
  result?: any;
}

interface LotteryData {
  current_round: string;
  drawing_time_ms: string;
  id: {
    id: string;
  };
  jackpot_winners: {
    type: string;
    fields: {
      id: string;
      size: string;
    };
  };
  lottery_fees: string;
  lottery_prize_pool: string;
  max_normal_ball: number;
  max_special_ball: number;
  minimum_jackpot: string;
  normal_ball_count: number;
  redemptions_allowed: {
    type: string;
    fields: {
      id: string;
      size: string;
    };
  };
  reward_structure_table: {
    type: string;
    fields: {
      id: string;
      size: string;
    };
  };
  rounds_settled: {
    type: string;
    fields: {
      id: string;
      size: string;
    };
  };
  ticket_cost: string;
  tickets: {
    type: string;
    fields: {
      head: any[];
      length: string;
      max_slice_size: string;
      next_id: string;
      spill: any;
      tail: any[];
    };
  };
  winning_tickets: {
    type: string;
    fields: {
      id: string;
      size: string;
    };
  };
}

export interface LotteryInput {
  suiClient: SuiClient;
}

export interface LotteryResponse {
  ok: boolean;
  err?: Error;
  result?: LotteryData;
}

interface LotteryHistoryItem {
  lotteryId: string;
  results: any;
  round: number;
  timestampDrawn: number;
  txDigest: string;
}

export interface LotteryHistoryResponse {
  ok: boolean;
  err?: Error;
  results?: LotteryHistoryItem[];
}

interface LotteryTicket {
  id: string;
  lotteryId: string;
  picks: Ticket;
  round: number;
  timestampIssued: number;
}

interface LotteryTicketsConfig {
  cursor?: string;
  filter: {
    StructType: string;
  };
  limit: number;
  options: {
    showContent: boolean;
    showType: boolean;
  };
  owner: string;
}

export interface LotteryTicketsInput {
  address: string;
}

interface InternalLotteryTicketsInput extends LotteryTicketsInput {
  suiClient: SuiClient;
}

export interface LotteryTicketsResponse {
  ok: boolean;
  err?: Error;
  results?: LotteryTicket[];
}

export interface RedeemTicketsInput {
  ticketIds: string[];
  transaction: TransactionType;
}

export interface RedeemTicketsResponse {
  ok: boolean;
  err?: Error;
}

export interface Ticket {
  numbers: number[];
  specialNumber: number;
}

export const buyLotteryTickets = ({
  address,
  coin,
  tickets: ticketsInput,
  transaction,
}: BuyTicketsInput): BuyTicketsResponse => {
  let res: BuyTicketsResponse = { ok: true };

  try {
    const tickets = [];

    for (const { numbers, specialNumber } of ticketsInput) {
      const ticket = transaction.moveCall({
        target: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::buy_ticket`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [
          transaction.object(LOTTERY_STORE_ID),
          transaction.pure.id(LOTTERY_ID),
          coin,
          transaction.pure(bcs.vector(bcs.U8).serialize(numbers)),
          transaction.pure.u8(specialNumber),
          transaction.object(CLOCK_OBJ),
        ],
      });

      tickets.push(ticket);
    }

    transaction.transferObjects(tickets, address);
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLottery = async ({
  suiClient,
}: LotteryInput): Promise<LotteryResponse> => {
  const res: LotteryResponse = { ok: true };

  try {
    const lottery = await suiClient.getObject({
      id: LOTTERY_ID,
      options: {
        showContent: true,
      },
    });

    if (lottery?.data?.content?.dataType !== "moveObject") {
      throw new Error("Invalid data type, expected moveObject");
    }

    const lotteryData = lottery.data.content.fields as unknown;

    res.result = lotteryData as LotteryData;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLotteryHistory = async ({
  suiClient,
}: LotteryInput): Promise<LotteryHistoryResponse> => {
  let res: LotteryHistoryResponse = { ok: true };

  try {
    let results: LotteryHistoryItem[] = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::RoundResult<${SUI_COIN_TYPE}>`,
        },
        order: "descending",
      });

      const validData = events.data
        .filter((item) => item.parsedJson && item.id)
        .map(({ parsedJson, id }: any) => ({
          round: Number(parsedJson.round),
          lotteryId: parsedJson.lottery_id,
          results: parsedJson.results,
          timestampDrawn: Number(parsedJson.timestamp_drawn),
          txDigest: id.txDigest,
        }));

      if (validData.length > 0) {
        results = validData;
      }
    }

    res.results = results;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLotteryDrawingResult = async ({
  pollInterval = 3000,
  round,
  suiClient,
}: InternalDrawingResultInput): Promise<DrawingResultResponse> => {
  const res: DrawingResultResponse = { ok: true };

  try {
    let results = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::RoundResult<${SUI_COIN_TYPE}>`,
        },
        order: "descending",
        limit: 2,
      });

      results = events.data
        .filter(
          (item: any) =>
            item.parsedJson && Number(item.parsedJson.round) === round
        )
        .map(({ parsedJson, id }: any) => ({
          round: Number(parsedJson.round),
          lotteryId: parsedJson.lottery_id,
          results: parsedJson.results,
          timestampDrawn: Number(parsedJson.timestamp_drawn),
          txdigest: id.txDigest,
        }));

      if (results.length === 0) {
        console.log(
          `DOUBLEUP - Game in processing. Query again in ${
            pollInterval / 1000
          } seconds.`
        );
        await sleep(pollInterval);
      }
    }

    res.result = results[0];
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLotteryTickets = async ({
  address,
  suiClient,
}: InternalLotteryTicketsInput): Promise<LotteryTicketsResponse> => {
  const res: LotteryTicketsResponse = { ok: true };

  try {
    const tickets: LotteryTicket[] = [];

    let cursor: string = "";
    let shouldFetchMore: boolean = true;

    while (shouldFetchMore) {
      const config: LotteryTicketsConfig = {
        owner: address,
        options: {
          showContent: true,
          showType: true,
        },
        filter: {
          StructType: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::Ticket`,
        },
        limit: 50,
      };

      if (!!cursor) {
        config.cursor = cursor;
      }

      const { data, nextCursor, hasNextPage } = await suiClient.getOwnedObjects(
        config
      );

      data.forEach(({ data }) => {
        if (data?.content?.dataType === "moveObject") {
          const fields = data.content.fields as any;

          const ticket: LotteryTicket = {
            id: fields.id.id,
            picks: {
              numbers: fields.picks.fields.numbers.fields.contents.map(
                (number) => Number(number)
              ),
              specialNumber: Number(fields.picks.fields.special_number),
            },
            lotteryId: fields.lottery_id,
            round: Number(fields.round),
            timestampIssued: Number(fields.timestamp_issued),
          };

          tickets.push(ticket);
        }
      });

      cursor = nextCursor;
      shouldFetchMore = hasNextPage;
    }

    res.results = tickets;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const redeemLotteryTickets = ({
  ticketIds,
  transaction,
}: RedeemTicketsInput): RedeemTicketsResponse => {
  const res: RedeemTicketsResponse = { ok: true };

  try {
    for (const ticketId of ticketIds) {
      const optionalCoin = transaction.moveCall({
        target: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::redeem`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [
          transaction.object(ticketId),
          transaction.object(LOTTERY_STORE_ID),
          transaction.pure.id(LOTTERY_ID),
        ],
      });

      transaction.moveCall({
        target: `${LOTTERY_PACKAGE_ID}::${LOTTERY_MODULE_NAME}::transfer_optional_coin`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [optionalCoin],
      });

      transaction.moveCall({
        target: `0x1::option::destroy_none`,
        typeArguments: [`0x2::coin::Coin<${SUI_COIN_TYPE}>`],
        arguments: [optionalCoin],
      });
    }
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};
