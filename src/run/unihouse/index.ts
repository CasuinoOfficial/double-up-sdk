import { DoubleUpClient } from "../../client";
import { SUI_COIN_TYPE } from "../../constants/mainnetConstants";

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

export const testGetMaxBet = async (
  dbClient: DoubleUpClient,
) => {
  return dbClient.getMaxBet(SUI_COIN_TYPE);
};