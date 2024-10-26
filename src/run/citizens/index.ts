import { DoubleUpClient } from "../../client";

export const testGetCitizens = async (
  dbClient: DoubleUpClient,
  address: string
) => {
  return dbClient.getCitizens(address);
};
