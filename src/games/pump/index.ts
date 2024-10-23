import axios from "axios";
import { CONFIGURATOR_OBJ_ID, PUMP_BUY_TOKEN_TARGET, PUMP_SELL_TOKEN_TARGET } from "../../constants/mainnetConstants";
import {
    Transaction as TransactionType,
    TransactionObjectArgument,
  } from "@mysten/sui/transactions";

export const BASE_DATA_URL = 'http://suilotto.com';

export interface GetCurvesInput {
    page: number;
    limit: number;
};

export interface PumpCurveItem {
    id: string;
    isActive: boolean;
    coinType: string;
    suiBalance: string;
    coinBalance: string;
    name: string;
    ticker: string;
    description: string;
    url: string;
    creator: string;
    twitter: string;
    telegram: string;
    website: string;
    migrationTarget: string;
    targetPoolId: string;
    timeCreated: string;
    lastTradeTimestamp: string;
}

export interface GetCurvesResponse {
    data: {
        data: PumpCurveItem[];
        cursor: string;
    };
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}

export async function getCurves({
    page,
    limit
}: GetCurvesInput): Promise<GetCurvesResponse> {
    const url = `${BASE_DATA_URL}/curves?type=bump&sortOrder=desc&page=${page}&limit=${limit}&search=`;
    const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data
}

export interface SwapAssetInput {
    curveId: string;
    coinType: string;
    coin: TransactionObjectArgument;
    address: string;
    direction: 'buy' | 'sell';
    transaction: TransactionType;
}

export async function swapAsset({
    curveId,
    coinType,
    coin,
    address,
    direction,
    transaction
}: SwapAssetInput) {
    if (!coin) return;
    if (direction === 'buy') {
        let resultCoin = transaction.moveCall({
            target: PUMP_BUY_TOKEN_TARGET,
            typeArguments: [coinType],
            arguments: [
                transaction.object(curveId),
                transaction.object(CONFIGURATOR_OBJ_ID),
              coin,
              transaction.pure.u64(0), // TODO: calculate minimum balance or remove this
            ],
          });
          transaction.transferObjects([resultCoin], address);
    } else {
        const resultCoin = transaction.moveCall({
            target: PUMP_SELL_TOKEN_TARGET,
            typeArguments: [coinType],
            arguments: [
                transaction.object(curveId),
                transaction.object(CONFIGURATOR_OBJ_ID),
                coin,
                transaction.pure.u64(0),
            ],
        });
        transaction.transferObjects([resultCoin], address);
    };
}