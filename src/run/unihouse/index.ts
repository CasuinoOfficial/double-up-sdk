import { DoubleUpClient } from "../../client";

export const testGetUnihouseData = async (dbClient: DoubleUpClient) => {
  return dbClient.getUnihouseData();
};

export const testGetUnihouseRedeemRequests = async (
  dbClient: DoubleUpClient
) => {
  return dbClient.getRedeemRequests();
};

export const testGetGTokenBalance = async (
  dbClient: DoubleUpClient,
  address: string
) => {
  return dbClient.getGTokenBalance(address);
};
