import { DoubleUpClient } from "../../client";

export const testGetCurves = async (dbClient: DoubleUpClient) => {
    let resp = await dbClient.getCurves({page: 0,limit: 30});
    return resp
}