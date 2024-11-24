import { SuiClient, SuiObjectData } from "@mysten/sui/client";

import { KioskClient, KioskOwnerCap } from "@mysten/kiosk";
import {
  CITIZENS_PACKAGE_CORE_ID,
  CITIZENS_UNCLAIMABLE_TYPES,
  SUI_COIN_TYPE,
  UNIHOUSE_PACKAGE,
} from "../../constants/mainnetConstants";
import { shortenAddress } from "../../utils";

export type Citizen = {
  id: string;
  number: string;
  rarity: string;
  attributes: {
    fields: Record<string, string>;
  } | null;
  img_url: string;
  is_revealed: boolean;
};

export type CitizenExtendWithKiosk = Citizen & {
  isLocked: boolean;
  kioskData: KioskOwnerCap | null;
};

// key is the id
export type Citizens = {
  [key: string]: CitizenExtendWithKiosk;
};

export type reward = {
  display: string;
  id: string;
  type: string;
  expiration: string;
};

export type nft = {
  id: string;
  type: string;
  display: string;
};

export type coin = {
  id: string;
  balance: string;
  type: string;
};

export type unclaimable = {
  id: string;
  display: string;
  type: string;
};

export type ticket = {
  id: string;
  type: string;
  image_url: string;
};

export type Inventory = {
  id: string;
  coins: coin[];
  rewards: reward[];
  chest: unclaimable[];
  nfts: nft[];
  reveal_ticket: ticket;
  total_items: number;
};

const getCitizenData = (data: SuiObjectData): Citizen | null => {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  const fields = data.content.fields as unknown as any;
  const citizen = { ...fields, id: fields.id.id };
  if (citizen) {
    return citizen;
  } else {
    return null;
  }
};

export const getCitizens = async (
  suiClient: SuiClient,
  kioskClient: KioskClient,
  address: string
) => {
  if (!address || address === "") return {};

  console.log("address", address);

  let citizens: Citizens = {};
  let cursor;
  let hasNextPage = true;
  while (hasNextPage) {
    const responseAddress = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        StructType: `${CITIZENS_PACKAGE_CORE_ID}::doubleup_citizens::DoubleUpCitizen`,
      },
      options: { showContent: true },
      cursor: cursor || null,
    });

    responseAddress.data.forEach((item: any) => {
      const citizen = getCitizenData(item.data);
      if (citizen) {
        const toAdd: any = citizen;
        toAdd.isLocked = false;
        toAdd.kioskData = null;
        citizens[toAdd.id] = toAdd;
      }
    });
    cursor = responseAddress.nextCursor;
    hasNextPage = responseAddress.hasNextPage;
  }

  let cursorKiosk;
  hasNextPage = true;

  while (hasNextPage) {
    const response = await kioskClient.getOwnedKiosks({
      address,
      pagination: {
        cursor: cursorKiosk || undefined,
      },
    });

    for (let kioskOwnerCap of response.kioskOwnerCaps) {
      const res = await kioskClient.getKiosk({
        id: kioskOwnerCap.kioskId,
        options: {
          withObjects: true,
          objectOptions: {
            showContent: true,
          },
        },
      });
      res.items
        .filter((item: any) => {
          return (
            item.type ===
            `${CITIZENS_PACKAGE_CORE_ID}::doubleup_citizens::DoubleUpCitizen`
          );
        })
        .forEach((item: any) => {
          if (!item.listing) {
            const toAdd = item.data.content.fields;
            toAdd.id = toAdd.id.id;
            toAdd.isLocked = item.isLocked;
            toAdd.kioskData = kioskOwnerCap;
            citizens[toAdd.id] = toAdd;
          }
        });
    }
    cursorKiosk = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  return citizens;
};

export const getCitizenInventories = async (
  suiClient: SuiClient,
  citizenId: string,
  isRevealed: boolean
): Promise<Inventory> => {
  const rewards: any[] = [];
  const coins: any[] = [];
  const nfts: any[] = [];
  const chest: any[] = [];
  let reveal_ticket: any = {
    id: "",
    type: "",
    image_url: "",
  };

  let cursor;
  let hasNextPage = true;
  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: citizenId,
      options: { showContent: true, showDisplay: true },
      cursor: cursor || null,
      limit: 50,
    });

    response.data.forEach((item: any, index) => {
      console.log(`response item ${index + 1}`, item.data);

      const content = item.data.content;
      // put in coins
      if (CITIZENS_UNCLAIMABLE_TYPES.includes(content.type)) {
        chest.push({
          id: item.data.objectId,
          type: content.type,
          display: item.data.display.data?.image_url,
        });
      } else if (
        content.type.includes("0x2::coin::Coin<") ||
        content.type === SUI_COIN_TYPE
      ) {
        coins.push({
          id: item.data.objectId,
          balance: content.fields.balance,
          type: content.type,
        });
      } else if (content.type.includes("doubleup_citizens::RevealTicket")) {
        reveal_ticket.id = item.data.objectId;
        reveal_ticket.type = content.type;
        reveal_ticket.image_url = item.data.display.data?.image_url;
      } else if (content.type.includes(UNIHOUSE_PACKAGE)) {
        // This is a reward since all rewards come from unihouse
        rewards.push({
          id: item.data.objectId,
          type: content.type,
          expiration: content.fields?.expiration_ms,
          display: item.data.display.data?.image_url,
        });
      } else {
        // then it is a random NFT -- not showing display for these
        nfts.push({
          id: item.data.objectId,
          type: content.type,
          display: item.data.display.data?.image_url,
        });
      }
    });
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  if (!isRevealed) {
    return {
      id: citizenId,
      coins: [],
      rewards: [],
      nfts: [],
      chest: [],
      reveal_ticket,
      total_items: 0,
    };
  }

  console.log(`${shortenAddress(citizenId)} response`, {
    id: citizenId,
    coins,
    rewards,
    nfts,
    chest,
    reveal_ticket,
    total_items: rewards.length + nfts.length + coins.length + chest.length,
  });

  return {
    id: citizenId,
    coins,
    rewards,
    nfts,
    chest,
    reveal_ticket,
    total_items: rewards.length + nfts.length + coins.length + chest.length,
  };
};
