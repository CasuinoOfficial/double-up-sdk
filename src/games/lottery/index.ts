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

const LOTTERY_TYPE = 
  "0x232a8d0feaf3d8857ccf5bfc1eb0318c4ae798932df8cd895982f42124d53467::lottery::Lottery<0x2::sui::SUI>";
export interface BuyTicketsInput {
  coin: TransactionObjectArgument;
  tickets: Ticket[];
  transaction: TransactionType;
  origin?: string;
  referrer?: string;
}

interface InternalBuyTicketsInput extends BuyTicketsInput {
  lotteryPackageId: string;
}

export interface BuyTicketsOnBehalfInput {
  recipient: string;
  coin: TransactionObjectArgument;
  tickets: Ticket[];
  transaction: TransactionType;
  origin?: string;
  referrer?: string;
}

interface InternalBuyTicketsOnBehalfInput extends BuyTicketsOnBehalfInput {
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
      },
      size: string;
    };
  };
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
      },
      size: string;
    };
  };
  redemptions_allowed: {
    type: string;
    fields: {
      id: {
        id: string;
      },
      size: string;
    };
  };
  referral_rate: string;
  reward_structure_table: {
    type: string;
    fields: {
      id: {
        id: string;
      },
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
      },
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
      },
      size: string;
    };
  };
};

export interface LotteryInput {
  suiClient: SuiClient;
}

interface InternalLotteryInput extends LotteryInput {
  lotteryCorePackageId: string;
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
  lotteryId: string;
  picks: Ticket;
  epoch: number;
  timestampIssued: number;
  origin: string;
  referrer: string | null;
  winningBalance?: any; // TODO: figure out how to store option<balance>
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
  memeCoin: string;
}

export const buyLotteryTickets = ({
  coin,
  tickets: ticketsInput,
  lotteryPackageId,
  transaction,
  origin,
  referrer,
}: InternalBuyTicketsInput): BuyTicketsResponse => {
  let res: BuyTicketsResponse = { ok: true };

  try {
    for (const { numbers, specialNumber, memeCoin } of ticketsInput) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::buy_ticket`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [
          transaction.object(LOTTERY_STORE_ID),
          transaction.pure.id(LOTTERY_ID),
          coin,
          transaction.pure(bcs.vector(bcs.U8).serialize(numbers)),
          transaction.pure.u8(specialNumber),
          transaction.pure.string(memeCoin),
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

export const buyLotteryTicketsOnBehalf = ({
  recipient,
  coin,
  tickets: ticketsInput,
  lotteryPackageId,
  transaction,
  origin,
  referrer,
}: InternalBuyTicketsOnBehalfInput): BuyTicketsResponse => {
  let res: BuyTicketsResponse = { ok: true };

  try {
    for (const { numbers, specialNumber, memeCoin } of ticketsInput) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::buy_ticket_on_behalf`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [
          transaction.object(LOTTERY_STORE_ID),
          transaction.pure.id(LOTTERY_ID),
          coin,
          transaction.pure.address(recipient),
          transaction.pure(bcs.vector(bcs.U8).serialize(numbers)),
          transaction.pure.u8(specialNumber),
          transaction.pure.string(memeCoin),
          transaction.pure.string(origin?? "DoubleUp"),
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
  suiClient,
}: LotteryInput): Promise<LotteryResponse> => {
  const res: LotteryResponse = { ok: true };

  try {
    const fieldsResp = await suiClient.getDynamicFieldObject({
      name: {
        type: "0x2::object::ID",
        value: LOTTERY_ID,
      },
      parentId: LOTTERY_STORE_ID,
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
}: InternalLotteryInput): Promise<LotteryHistoryResponse> => {
  let res: LotteryHistoryResponse = { ok: true };

  try {
    let results: LotteryHistoryItem[] = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::RoundResult<${SUI_COIN_TYPE}>`,
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
  lotteryCorePackageId
}: InternalDrawingResultInput): Promise<DrawingResultResponse> => {
  const res: DrawingResultResponse = { ok: true };

  try {
    let results = [];

    while (results.length === 0) {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::RoundResult<${SUI_COIN_TYPE}>`,
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
            MoveEventType: `${lotteryCorePackageId}::${LOTTERY_MODULE_NAME}::TicketPurchased<${SUI_COIN_TYPE}>`
        },
        order: "descending",
      };

      if (!!cursor) {
        queryParams.cursor = cursor;
      }

      const resp = await suiClient.queryEvents(
        queryParams
      );

      resp.data.forEach((event) => {
        const ticket = event.parsedJson as LotteryTicket;
        if (ticket.owner === address) {
          tickets.push(ticket);
        };
      });

      cursor = resp.nextCursor;
      shouldFetchMore = resp.hasNextPage;
    };

    res.results = tickets;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const redeemLotteryTickets = ({
  epochs,
  transaction,
  lotteryPackageId
}: InternalRedeemTicketsInput): RedeemTicketsResponse => {
  const res: RedeemTicketsResponse = { ok: true };

  try {
    for (const epoch of epochs) {
      transaction.moveCall({
        target: `${lotteryPackageId}::${LOTTERY_MODULE_NAME}::redeem`,
        typeArguments: [SUI_COIN_TYPE],
        arguments: [
          transaction.object(LOTTERY_STORE_ID),
          transaction.pure.id(LOTTERY_ID),
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