import { SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "../../client";

export const testGetUnihouseData = async (
    dbClient: DoubleUpClient,
) => {
    return dbClient.getUnihouseData();
}

export const testGetUnihouseRedeemRequests = async (
    dbClient: DoubleUpClient,
) => {
    return dbClient.getRedeemRequests()
}