import { SuiClient } from "@mysten/sui/client";
import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import { CLOCK_OBJ, SUI_COIN_TYPE } from "../../constants/testnetConstants";
import { sleep } from "../../utils";
import {
  LOTTERY_MODULE_NAME,
  LOTTERY_STORE,
} from "../../constants/mainnetConstants";

export interface BuyTicketsAlternativeCoinInput {
  recipient: string;
  coin: TransactionObjectArgument;
  coinType: string;
  tickets: Ticket[];
  lotteryId: string;
  lotteryType: string;
  transaction: TransactionType;
  origin?: string;
  referrer?: string;
}

interface InternalBuyTicketsAlternativeCoinInput
  extends BuyTicketsAlternativeCoinInput {
  lotteryPackageId: string;
}

export interface BuyTicketsInput {
  recipient: string;
  coin: TransactionObjectArgument;
  tickets: Ticket[];
  lotteryId: string;
  coinType: string;
  transaction: TransactionType;
  origin?: string;
  referrer?: string;
}

interface InternalBuyTicketsInput extends BuyTicketsInput {
  lotteryPackageId: string;
}

export interface BuyTicketsResponse {
  ok: boolean;
  err?: Error;
}

export interface DrawingResultInput {
  pollInterval?: number;
  epoch: number;
}

interface InternalDrawingResultInput extends DrawingResultInput {
  suiClient: SuiClient;
  lotteryCorePackageId: string;
}

export interface DrawingResultResponse {
  ok: boolean;
  err?: Error;
  result?: any;
}

interface LotteryData {
  current_epoch: string;
  current_round_picks: any;
  epochs_settled: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
  id: {
    id: string;
  };
  jackpot_winners: string[];
  lottery_fees: string;
  lottery_prize_pool: string;
  lottery_prize_pool_size: string;
  max_normal_ball: number;
  max_special_ball: number;
  minimum_jackpot: string;
  normal_ball_count: number;
  picks_history: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
  redemptions_allowed: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
  referral_rate: string;
  reward_structure_table: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
  status: string;
  ticket_cost: string;
  ticket_history: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
  tickets: {
    type: string;
    fields: {
      head: any[];
      length: string;
      max_slice_size: string;
      next_id: string;
      spill: object;
      tail: any[];
    };
  };
  winning_tickets: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      size: string;
    };
  };
}

export interface LotteryInput {
  lotteryId: string;
}

interface InternalLotteryInput extends LotteryInput {
  suiClient: SuiClient;
}

interface InternalLotteryHistoryInput {
  lotteryCorePackageId: string;
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
  epoch: number;
  timestampDrawn: number;
  txDigest: string;
}

export interface LotteryHistoryResponse {
  ok: boolean;
  err?: Error;
  results?: LotteryHistoryItem[];
}

interface LotteryTicket {
  owner: string;
  lottery_id: string;
  picks: {
    numbers: { contents: number[] };
    special_number: number;
  };
  epoch: number;
  timestamp_issued: number;
  origin: string;
  referrer: string | null;
  winning_balance?: any; // TODO: figure out how to store option<balance>
}

interface LotteryTicketsConfig {
  cursor?: any; // TODO: declare type
  // query: {
  //   All: [
  //     { MoveEventType: string },
  //     { Sender: string }
  //   ]
  // };
  query: any;
  order: "descending" | "ascending";
  limit?: number;
}

export interface LotteryTicketsInput {
  address: string;
}

interface InternalLotteryTicketsInput extends LotteryTicketsInput {
  suiClient: SuiClient;
  lotteryCorePackageId: string;
}

export interface LotteryTicketsResponse {
  ok: boolean;
  err?: Error;
  results?: LotteryTicket[];
}

export interface RedeemTicketsInput {
  epochs: string[];
  lotteryId: string;
  coinType: string;
  transaction: TransactionType;
}

interface InternalRedeemTicketsInput extends RedeemTicketsInput {
  lotteryPackageId: string;
}

export interface RedeemTicketsResponse {
  ok: boolean;
  err?: Error;
}

export interface Ticket {
  numbers: number[];
  specialNumber: number;
}

export const buyLotteryTicketsAlternativePrice = ({
  recipient,
  coin,
  coinType,
  tickets: ticketsInput,
  lotteryId,
  lotteryType,
  lotteryPackageId,
  transaction,
  origin,
  referrer,
}: InternalBuyTicketsAlternativeCoinInput): BuyTicketsResponse => {
  let res: BuyTicketsResponse = { ok: true };

  try {
    for (const { numbers, specialNumber } of ticketsInput) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::buy_ticket_alternative_price`,
        typeArguments: [lotteryType, coinType],
        arguments: [
          transaction.object(LOTTERY_STORE),
          transaction.pure.id(lotteryId),
          coin,
          transaction.pure.address(recipient),
          transaction.pure(bcs.vector(bcs.U8).serialize(numbers)),
          transaction.pure.u8(specialNumber),
          transaction.pure.string(origin ?? "DoubleUp"),
          transaction.pure(bcs.option(bcs.Address).serialize(referrer ?? null)),
          transaction.object(CLOCK_OBJ),
        ],
      });
    }
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const buyLotteryTickets = ({
  recipient,
  coin,
  tickets: ticketsInput,
  lotteryId,
  coinType,
  lotteryPackageId,
  transaction,
  origin,
  referrer,
}: InternalBuyTicketsInput): BuyTicketsResponse => {
  let res: BuyTicketsResponse = { ok: true };

  try {
    for (const { numbers, specialNumber } of ticketsInput) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::buy_ticket`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(LOTTERY_STORE),
          transaction.pure.id(lotteryId),
          coin,
          transaction.pure.address(recipient),
          transaction.pure(bcs.vector(bcs.U8).serialize(numbers)),
          transaction.pure.u8(specialNumber),
          transaction.pure.string(origin ?? "DoubleUp"),
          transaction.pure(bcs.option(bcs.Address).serialize(referrer ?? null)),
          transaction.object(CLOCK_OBJ),
        ],
      });
    }
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLottery = async ({
  lotteryId,
  suiClient,
}: InternalLotteryInput): Promise<LotteryResponse> => {
  const res: LotteryResponse = { ok: true };

  try {
    const fieldsResp = await suiClient.getDynamicFieldObject({
      name: {
        type: "0x2::object::ID",
        value: lotteryId,
      },
      parentId: LOTTERY_STORE,
    });

    if (fieldsResp?.data?.content?.dataType !== "moveObject") {
      throw new Error("Invalid data type, expected moveObject");
    }

    const lotteryData = fieldsResp.data.content.fields as unknown;

    res.result = lotteryData as LotteryData;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const getLotteryHistory = async ({
  suiClient,
  lotteryCorePackageId,
}: InternalLotteryHistoryInput): Promise<LotteryHistoryResponse> => {
  let res: LotteryHistoryResponse = { ok: true };

  try {
    let results: LotteryHistoryItem[] = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::RoundResult`,
        },
        order: "descending",
      });

      const validData = events.data
        .filter((item) => item.parsedJson && item.id)
        .map(({ parsedJson, id }: any) => ({
          epoch: Number(parsedJson.epoch),
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
  epoch,
  suiClient,
  lotteryCorePackageId,
}: InternalDrawingResultInput): Promise<DrawingResultResponse> => {
  const res: DrawingResultResponse = { ok: true };

  try {
    let results = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::RoundResult`,
        },
        order: "descending",
        limit: 2,
      });

      results = events.data
        .filter(
          (item: any) =>
            item.parsedJson && Number(item.parsedJson.epoch) === epoch
        )
        .map(({ parsedJson, id }: any) => ({
          epoch: Number(parsedJson.epoch),
          lotteryId: parsedJson.lottery_id,
          results: parsedJson.results,
          timestampDrawn: Number(parsedJson.timestamp_drawn),
          txdigest: id.txDigest,
        }));

      if (results.length === 0) {
        // console.log(
        //   `DOUBLEUP - Game in processing. Query again in ${
        //     pollInterval / 1000
        //   } seconds.`
        // );
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
  lotteryCorePackageId,
}: InternalLotteryTicketsInput): Promise<LotteryTicketsResponse> => {
  const res: LotteryTicketsResponse = { ok: true };

  try {
    const tickets: LotteryTicket[] = [];
    let shouldFetchMore = true;
    let cursor = undefined;

    while (shouldFetchMore) {
      const queryParams: LotteryTicketsConfig = {
        query: {
          MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::TicketPurchased`,
        },
        order: "descending",
      };

      if (!!cursor) {
        queryParams.cursor = cursor;
      }

      const resp = await suiClient.queryEvents(queryParams);

      resp.data.forEach((event) => {
        const ticket = event.parsedJson as LotteryTicket;
        if (ticket.owner === address) {
          tickets.push(ticket);
        }
      });

      cursor = resp.nextCursor;
      shouldFetchMore = resp.hasNextPage;
    }

    res.results = tickets;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const redeemLotteryTickets = ({
  epochs,
  lotteryId,
  coinType,
  transaction,
  lotteryPackageId,
}: InternalRedeemTicketsInput): RedeemTicketsResponse => {
  const res: RedeemTicketsResponse = { ok: true };

  try {
    for (const epoch of epochs) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::redeem`,
        typeArguments: [coinType],
        arguments: [
          transaction.object(LOTTERY_STORE),
          transaction.pure.id(lotteryId),
          transaction.pure.u64(epoch),
        ],
      });
    }
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};
