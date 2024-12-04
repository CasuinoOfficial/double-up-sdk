import { SuiClient, SuiObjectData } from "@mysten/sui/client";

import { KioskClient, KioskOwnerCap, KioskTransaction } from "@mysten/kiosk";
import {
  CITIZENS_PACKAGE_CORE_ID,
  CITIZENS_UNCLAIMABLE_TYPES,
  SUI_COIN_TYPE,
  UNIHOUSE_PACKAGE,
} from "../../constants/mainnetConstants";
import { shortenAddress } from "../../utils";
import { Transaction } from "@mysten/sui/dist/cjs/transactions";

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

const blackListType = [
  "0x06c74d5a35a6749eb5e70ca55389c8a5ff6a5c62feb31f2f9afa4dcc4dc7ad21::deep::DEEP",
  "0x2c1afa02f20bf462da69e24319b7b08bf390cf7d3bb842b353b5969b787d76b2::deep::DEEP",
  "0xbb583023e1c08e038330e2dd878ffb9bf3499489e6ade663aad4cf47cfa3c6a4::deep::DEEP",
  "0x270ba4e52726c10308dd05692568a13f5a987329e1000b237f2fdc5e40c26a57::deep::DEEP",
  "0x9c15760a781cc2419aae0d5f5f3d35d803d4e65bfaaae0d37d919a7da2177138::deep::DEEP",
  "0x4d0ec7dc72d1cbb0a906acea1ec766a9a69158082af2a097f002963fd6616073::deep::DEEP",
  "0xc08bd6d15b5fe06df7c4eba54952119878a555ee199a472b3bc67eb9594cbf5c::deep::DEEP",
  "0x06c74d5a35a6749eb5e70ca55389c8a5ff6a5c62feb31f2f9afa4dcc4dc7ad21::deep::DEEP",
  "0xfd424192019c9a9b8c9c054cc5fef77a2fac82cfa45f386b67ac312b42559fd9::deep::DEEP",
  "0x7527e92070d07e02e837ac9d11beebfbfcecf20f079f3873c75f6812ff3be721::deep::DEEP",
  "0x8671f1efe579dfc49228db4294119bbc3b0b25755c3b8b5cdbba625f6c7211ad::deep::DEEP",
  "0x80735b7dbd1de53d649d7f65041bdc886055f2ef0d0258411dd0995a82b5c271::deep::DEEP",
  "0x487cd99958dd5510e7c1305dc4a0046dcd248cfc6a856236c027704ecfde1377::deep::DEEP",
  "0x15bc8b580731dc174825eced57cc27014b478af2f94c23c37aab9fbdc0e68939::deep::DEEP",
  "0x2c1afa02f20bf462da69e24319b7b08bf390cf7d3bb842b353b5969b787d76b2::deep::DEEP",
  "0xc510cbb82e91b566e79db89853f3505e3acf6946114e40fdb02e87d5fa4bb000::deep::DEEP",
  "0x87e9bfd31976cd0ae8868b4efed554827038076d0715d6da98c1888af07a7158::deep::DEEP",
  "0xffcfdab9e8ef3f22965df6e51e03a8d318e311060da4df89cd9419b45991df0d::deep::DEEP",
  "0x718e50b7f929fdf90293d40c4c07a560b7ba8a74a4c404013938eddb54d5e7e8::deep::DEEP",
  "0x8ae0c78e17b338f2b05c3c2f22e20c1cb43e0b2c76281d83de7679467d50a2f5::deep::DEEP",
  "0xb10e131f4957e3aee76693d31e82ef2603da86b9325f43093b74f711320db485::deep::DEEP",
  "0xa83100875708e2175c8e6cc8293a062506e784e8d39a3bc33aa9b2d6ed9dd470::deep::DEEP",
  "0x329e80eddc89a28836dd2f7124d702bb66f3517f9f75e9841fcec08b58a52ebd::deep::DEEP",
  "0x10ef7d7d31df7af824eaba9f81d047054c2c9d2b4130ed0ba71dae4ee09d5d79::deep::DEEP",
  "0xac65ca3431c848846189eaf640ba087d4739393a5b68f1cac5cfb9c14f92bf9b::deep::DEEP",
  "0x328e4e861c10ffeac4d8e6008c598c48672df6952c26ef073f0e46a44e4c80ab::deep::DEEP",
  "0x51f33ca9e48feeda972ad58729d778c5c5803a06438a638e52a441d6f9a54a2a::deep::DEEP",
  "0xbbee5d636e6d55dbb54761ca3ce4a2686478c1d0fab553609306a7b6450b8d88::deep::DEEP",
  "0x5ecab051d930ba58710e25499cf6195435c1516ba259415cbbf59f14a31b1f89::deep::DEEP",
];

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
      // console.log(`response item ${index + 1}`, item.data);

      const content = item.data.content;
      // put in coins
      if (
        !blackListType.includes(
          content.type.split("0x2::coin::Coin<")[1].split(">")[0]
        )
      ) {
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

          // console.log(`${citizenId} coinType`, `${content.type}`);
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

  const totalItems = rewards.length + nfts.length + coins.length + chest.length;

  if (coins.length > 0) {
    console.log(`${citizenId} res`, `${totalItems} coin: ${coins.length}`);
  }

  return {
    id: citizenId,
    coins,
    rewards,
    nfts,
    chest,
    reveal_ticket,
    total_items: totalItems,
  };
};
