import { SuiClient } from "@mysten/sui/client";
import {
  TransactionObjectArgument,
  Transaction as TransactionType,
} from "@mysten/sui/transactions";
import { CLOCK_OBJ_ID, RAFFLES_ID_SUI, RAFFLES_MODULE_NAME, RAFFLES_SUI_TREASURY, SUI_COIN_TYPE } from "../../constants/mainnetConstants";

export interface BuyRaffleTicketsInput {
  coin: TransactionObjectArgument;
  transaction: TransactionType;
}

interface InternalBuyRaffleTicketsInput extends BuyRaffleTicketsInput {
  rafflesPackageId: string;
  origin: string;
}
  
export interface BuyRaffleTicketsResponse {
  ok: boolean;
  err?: Error;
}

export interface RaffleParticipant {
  tickets: {
    to: number;
    from: number;
  }[];
  raffleId: string;
  lastBought: number;
  participant: string;
  totalTickets: number;
};

export interface RaffleTicketsInfo {
  id: string;
  acceptedCoins: Record<string, string>;
  deals: {
    ticketsAmount: string;
    freeTickets: string;
  }[];
};

interface InternalGetRaffleInput {
  client: SuiClient;
}

interface RaffleData {
  collected: number;
  count: number;
  cover_image: string;
  description: string;
  end_date: number;
  id: {
    id: string;
  };
  participants: Record<string, RaffleParticipant>;
  title: string;
  total_participants: number;
  total_tickets: number;
  winner: string;
  winning_ticket: number;
}

export interface RaffleResponse {
  ok: boolean;
  err?: Error;
  result?: RaffleData;
}

export const getRaffle = async ({
  client
}: InternalGetRaffleInput): Promise<RaffleResponse> => {
  const res: RaffleResponse = { ok: true};

  try {
    const raffle = await client.getObject({
      id: RAFFLES_ID_SUI,
      options: {
        showContent: true,
      },
    });

    if (raffle?.data?.content?.dataType !== "moveObject") {
      throw new Error("Invalid data type, expected moveObject");
    }

    const raffleData = raffle.data.content.fields as unknown;

    console.dir(raffleData, {depth: 5});

    res.result = raffleData as RaffleData;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
}

export const buyRaffleTickets = ({
  coin,
  rafflesPackageId,
  transaction,
  origin,
}: InternalBuyRaffleTicketsInput): BuyRaffleTicketsResponse => {
  const res: BuyRaffleTicketsResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::buy_tickets`,
      typeArguments: [SUI_COIN_TYPE],
      arguments: [
        transaction.object(RAFFLES_SUI_TREASURY),
        transaction.object(CLOCK_OBJ_ID),
        transaction.pure.id(RAFFLES_ID_SUI),
        coin,
        transaction.pure.string(origin),
      ],
    });
  } catch (err) {
    res.ok = false;
    res.err = err;
  };

  return res;
}