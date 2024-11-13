import { SuiClient } from "@mysten/sui/client";
import {
  TransactionObjectArgument,
  Transaction as TransactionType,
} from "@mysten/sui/transactions";
import { 
  CLOCK_OBJ_ID, 
  RAFFLES_ID_SUI, 
  RAFFLES_MODULE_NAME, 
  RAFFLES_SUI_TREASURY, 
  SUI_COIN_TYPE 
} from "../../constants/mainnetConstants";

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

export interface BuyRaffleTicketsWithDealInput {
  coin: TransactionObjectArgument;
  ticketDeal: string | number;
  transaction: TransactionType;
}

interface InternalBuyRaffleTicketsWithDealInput extends BuyRaffleTicketsWithDealInput {
  rafflesPackageId: string;
  origin: string;
}
  
export interface BuyRaffleTicketsWithDealResponse {
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

export interface GetTotalTicketsForUserInput {
  address: string;
  transaction: TransactionType;
}

interface InternalGetTotalTicketsForUserInput extends GetTotalTicketsForUserInput {
  rafflesPackageId: string;
}

export interface GetTotalTicketsForUserResponse {
  ok: boolean;
  err?: Error;
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

export const buyRaffleTicketsWithDeal = ({
  coin,
  ticketDeal,
  rafflesPackageId,
  transaction,
  origin,
}: InternalBuyRaffleTicketsWithDealInput): BuyRaffleTicketsResponse => {
  const res: BuyRaffleTicketsResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::buy_tickets_from_deal`,
      typeArguments: [SUI_COIN_TYPE],
      arguments: [
        transaction.object(RAFFLES_SUI_TREASURY),
        transaction.object(CLOCK_OBJ_ID),
        transaction.pure.id(RAFFLES_ID_SUI),
        coin,
        transaction.pure.u64(Number(ticketDeal)),
        transaction.pure.string(origin),
      ],
    });
  } catch (err) {
    res.ok = false;
    res.err = err;
  };

  return res;
}

export const getTotalTicketsForUser = ({
  address,
  transaction,
  rafflesPackageId,
}: InternalGetTotalTicketsForUserInput): GetTotalTicketsForUserResponse => {
  const res: GetTotalTicketsForUserResponse = { ok: true };

  try {
    let raffle = transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::borrow_raffle`,
      typeArguments: [SUI_COIN_TYPE],
      arguments: [
        transaction.object(RAFFLES_SUI_TREASURY),
        transaction.pure.id(RAFFLES_ID_SUI),
      ],
    });

    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::tickets_bought`,
      typeArguments: [SUI_COIN_TYPE],
      arguments: [
        raffle,
        transaction.pure.address(address),
      ],
    });
  } catch (err) {
    res.ok = false;
    res.err = err;
  };

  return res;
}