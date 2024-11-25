import { SuiClient } from "@mysten/sui/client";
import {
  TransactionObjectArgument,
  Transaction as TransactionType,
} from "@mysten/sui/transactions";
import { 
  CLOCK_OBJ_ID, 
  DOGHOUSE, 
  RAFFLES_MODULE_NAME, 
  RAFFLES_TREASURY, 
  SUI_COIN_TYPE 
} from "../../constants/mainnetConstants";
import { bcs } from "@mysten/sui/bcs";

export interface BuyRaffleTicketsInput {
  coin: TransactionObjectArgument;
  coinType: string;
  raffleId: string;
  transaction: TransactionType;
  recipient?: string;
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
  coinType: string;
  ticketDeal: string | number;
  raffleId: string;
  transaction: TransactionType;
  recipient?: string;
}

interface InternalBuyRaffleTicketsWithDealInput extends BuyRaffleTicketsWithDealInput {
  rafflesPackageId: string;
  origin: string;
}
  
export interface BuyRaffleTicketsWithDealResponse {
  ok: boolean;
  err?: Error;
}

export interface BuyRaffleTicketsWithTreatsInput {
  amount: string | number;
  doghouse: string;
  raffleId: string;
  transaction: TransactionType;
}

interface InternalBuyRaffleTicketsWithTreatsInput extends BuyRaffleTicketsWithTreatsInput {
  rafflesPackageId: string;
  origin: string;
}
  
export interface BuyRaffleTicketsWithTreatsResponse {
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

export interface GetRaffleInput {
  raffleId: string;
}

interface InternalGetRaffleInput extends GetRaffleInput {
  client: SuiClient;
}

interface RaffleData {
  accepted_coin_types: {
    fields: { contents: any[] };
    type: string;
  };
  collected: number;
  count: number;
  cover_image: string;
  description: string;
  end_date: number;
  id: { id: string };
  participants: {
    fields: { 
      id: { id: string };
      size: number;
    };
    type: string;
  };
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
  raffleId: string;
  transaction: TransactionType;
}

interface InternalGetTotalTicketsForUserInput extends GetTotalTicketsForUserInput {
  rafflesPackageId: string;
}

export interface GetTotalTicketsForUserResponse {
  ok: boolean;
  err?: Error;
}

export interface GetCoinTypesInput {
  transaction: TransactionType;
  raffleId: string;
}

interface InternalGetCoinTypesInput extends GetCoinTypesInput {
  rafflesPackageId: string;
}

export interface GetCoinTypesResponse {
  ok: boolean;
  err?: Error;
  result?: string[];
}

export const getRaffle = async ({
  raffleId,
  client
}: InternalGetRaffleInput): Promise<RaffleResponse> => {
  const res: RaffleResponse = { ok: true};

  try {
    const raffle = await client.getObject({
      id: raffleId,
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
  coinType,
  raffleId,
  transaction,
  rafflesPackageId,
  origin,
  recipient
}: InternalBuyRaffleTicketsInput): BuyRaffleTicketsResponse => {
  const res: BuyRaffleTicketsResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::buy_tickets`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(RAFFLES_TREASURY),
        transaction.object(CLOCK_OBJ_ID),
        transaction.pure.id(raffleId),
        coin,
        transaction.pure(
          bcs.option(bcs.Address).serialize(recipient ? recipient : null),
        ),
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
  coinType,
  ticketDeal,
  raffleId,
  transaction,
  rafflesPackageId,
  origin,
  recipient
}: InternalBuyRaffleTicketsWithDealInput): BuyRaffleTicketsWithDealResponse => {
  const res: BuyRaffleTicketsWithDealResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::buy_tickets_from_deal`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(RAFFLES_TREASURY),
        transaction.object(CLOCK_OBJ_ID),
        transaction.pure.id(raffleId),
        coin,
        transaction.pure.u64(Number(ticketDeal)),
        transaction.pure(
          bcs.option(bcs.Address).serialize(recipient ? recipient : null),
        ),
        transaction.pure.string(origin),
      ],
    });
  } catch (err) {
    res.ok = false;
    res.err = err;
  };

  return res;
}

export const buyRaffleTicketsWithTreats = ({
  amount,
  raffleId,
  doghouse,
  transaction,
  rafflesPackageId,
  origin
}: InternalBuyRaffleTicketsWithTreatsInput): BuyRaffleTicketsWithTreatsResponse => {
  const res: BuyRaffleTicketsWithTreatsResponse = { ok: true };

  try {
    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::buy_tickets_with_treats`,
      arguments: [
        transaction.object(RAFFLES_TREASURY),
        transaction.object(doghouse),
        transaction.object(CLOCK_OBJ_ID),
        transaction.pure.id(raffleId),
        transaction.pure.u64(Number(amount)),
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
  raffleId,
  transaction,
  rafflesPackageId,
}: InternalGetTotalTicketsForUserInput): GetTotalTicketsForUserResponse => {
  const res: GetTotalTicketsForUserResponse = { ok: true };

  try {
    let raffle = transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::borrow_raffle`,
      arguments: [
        transaction.object(RAFFLES_TREASURY),
        transaction.pure.id(raffleId),
      ],
    });

    transaction.moveCall({
      target: `${rafflesPackageId}::${RAFFLES_MODULE_NAME}::tickets_bought`,
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

// export const getRaffleSupportedCoinTypes = ({
//   transaction,
//   raffleId,
//   rafflesPackageId,
// }: InternalGetCoinTypesInput): GetCoinTypesResponse => {
//   const res: GetCoinTypesResponse = { ok: true };

//   try {

//   } catch (err) {
//     res.ok = false;
//     res.err = err;
//   };

//   return res;
// }