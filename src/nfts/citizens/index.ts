import { SuiClient, SuiObjectData } from "@mysten/sui/client";

import { KioskClient, KioskOwnerCap } from "@mysten/kiosk";
import { CITIZENS_PACKAGE_CORE_ID } from "../../constants/mainnetConstants";

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
