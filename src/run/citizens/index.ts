import { DoubleUpClient } from "../../client";
import { shortenAddress } from "../../utils";

export const testGetCitizens = async (
  dbClient: DoubleUpClient,
  address: string
) => {
  return dbClient.getCitizens(address);
};

export const testGetCitizenInventories = async (
  dbClient: DoubleUpClient,
  address: string,
  citizenId?: string | string[]
) => {
  if (citizenId && typeof citizenId === "string") {
    const inventory = await dbClient.getCitizenInventories(citizenId, true);
  } else {
    const citizens = await dbClient.getCitizens(address);
    const citizenKeys = Object.keys(citizens);

    if (citizenId && citizenId.length !== 0) {
      const filteredCitizens = citizenKeys.filter((key) =>
        citizenId.includes(key)
      );
      const totalCitizens = filteredCitizens.length;
      console.log(`Total citizens: ${totalCitizens}`);
      let index = 0;

      do {
        const citizen = citizens[citizenKeys[index]];
        const inventory = await dbClient.getCitizenInventories(
          citizen.id,
          citizen.is_revealed
        );
        index++;
      } while (index < totalCitizens);
    } else {
      const totalCitizens = citizenKeys.length;
      console.log(`Total citizens: ${totalCitizens}`);
      let index = 0;

      do {
        const citizen = citizens[citizenKeys[index]];
        const inventory = await dbClient.getCitizenInventories(
          citizen.id,
          citizen.is_revealed
        );
        index++;
      } while (index < totalCitizens);
    }
  }
};
