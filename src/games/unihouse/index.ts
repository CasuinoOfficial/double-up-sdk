import { SuiClient, DynamicFieldInfo } from "@mysten/sui/client";
import {
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import {
  CLOCK_OBJ_ID,
  UNIHOUSE_PACKAGE,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";

export interface DepositUnihouseInput {
  coin: TransactionObjectArgument;
  coinType: string;
  address: string;
  transaction: TransactionType;
}

export interface WithdrawUnihouseInput {
  gCoin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

export type UnihouseInfo = {
  [key: string]: {
    id: string;
    tokenSymbol: string;
    coinType: string;
    tokenType: string;
    name: string;
    apy?: string;
    tvl: string;
    totalSupply?: string;
    maxSupply?: string;
    gTokenPrice: string;
  };
};

export type BalanceList = Record<string, number>;

export const depositUnihouse = ({
  coin,
  coinType,
  address,
  transaction,
}: DepositUnihouseInput) => {
  let depositAsset = transaction.moveCall({
    target: `${UNIHOUSE_PACKAGE}::unihouse::deposit`,
    typeArguments: [coinType],
    arguments: [transaction.object(UNI_HOUSE_OBJ_ID), coin],
  });
  transaction.transferObjects(
    [depositAsset],
    transaction.pure.address(address)
  );
};

export const requestWithdrawUnihouse = ({
  gCoin,
  coinType,
  transaction,
}: WithdrawUnihouseInput) => {
  transaction.moveCall({
    target: `${UNIHOUSE_PACKAGE}::unihouse::redeem_request`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      gCoin,
      transaction.object(CLOCK_OBJ_ID),
    ],
  });
};

export const getUnihouseData = async (
  suiClient: SuiClient
): Promise<UnihouseInfo> => {
  let cursor = null;
  let hasNextPage = true;
  let dynamicFields: any = [];

  while (hasNextPage) {
    const response: any = await suiClient.getDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor,
    });

    dynamicFields.push(...response.data);
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  const unihouseList: DynamicFieldInfo[] = dynamicFields?.filter(
    (field: DynamicFieldInfo) => field?.objectType.includes("house::House<")
  );
  if (!unihouseList) return {};
  const unihouseIdList = unihouseList.map((house) => house.objectId);

  const PromiseList: Promise<any>[] = unihouseIdList.map((id) => {
    return suiClient.getObject({
      id,
      options: {
        showContent: true,
        showType: true,
      },
    });
  });
  const houseData = await Promise.all(PromiseList);

  const houseFields = houseData.map((house) => house.data?.content?.fields);

  let houseInfo: UnihouseInfo = {};
  if (!houseFields) return houseInfo;

  houseFields.forEach((field, index) => {
    const tokenSymbol = unihouseList[index].objectType
      .split("::")
      .pop()
      ?.split(">")[0];

    const coinType = `${
      field?.supply?.type.split("<")[2].split(">")[0]
    }`;

    if (!tokenSymbol) return;

    const houseName = `g${tokenSymbol}`;
    const tokenType = `0x2::coin::Coin<${field?.supply?.type.split("<")[1]}<${
      field?.supply?.type.split("<")[2].split(">")[0]
    }>>`;

    const pipeDebt = field?.pipe_debt?.fields?.value;
    const totalSui = Number(pipeDebt) + Number(field?.pool);
    const totalSupply = Number(field?.supply?.fields?.value);
    const maxSupply = Number(field?.max_supply);

    houseInfo[coinType] = {
      id: unihouseList[index].objectId,
      coinType: coinType,
      tokenSymbol: tokenSymbol,
      tokenType: tokenType,
      name: houseName,
      totalSupply: totalSupply.toString(),
      maxSupply: maxSupply.toString(),
      tvl: totalSui.toString(),
      gTokenPrice: (totalSui / totalSupply).toFixed(4),
    };
  });

  return houseInfo;
};

export const getRedeemRequests = async (
  suiClient: SuiClient,
  address?: string
) => {
  let cursor = null;
  let hasNextPage = true;
  let dynamicFields: any = [];

  while (hasNextPage) {
    const response: any = await suiClient.getDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor,
    });
    dynamicFields.push(...response.data);
    cursor = response.nextCursor;
    hasNextPage = response.hasNextPage;
  }

  const redeemRequests: DynamicFieldInfo[] = dynamicFields?.filter(
    (field: DynamicFieldInfo) => field?.objectType.includes("RedeemRequest")
  );

  if (!redeemRequests) return [];

  const redeemRequestsIdList = redeemRequests.map(
    (request) => request.objectId
  );

  const PromiseList: Promise<any>[] = redeemRequestsIdList.map((id) => {
    return suiClient.getObject({
      id,
      options: {
        showContent: true,
        showType: true,
      },
    });
  });

  const allRequestData = await Promise.all(PromiseList);

  const allRequestFields = allRequestData.map(
    (request) => request.data?.content?.fields
  );

  if (!allRequestFields) return [];

  const userRedeemRequests = allRequestFields.filter(
    (request) => request?.sender === address
  );

  if (!userRedeemRequests || userRedeemRequests.length === 0) return [];

  return userRedeemRequests
    .map((request) => {
      return {
        id: request?.id?.id,
        createdAt: request?.created_at,
        balance: request?.s_coin?.fields?.balance,
      };
    })
    .sort((a, b) => {
      return Number(a.createdAt) - Number(b.createdAt);
    });
};

export const getGTokenBalance = async (
  suiClient: SuiClient,
  address: string
): Promise<BalanceList> => {
  if (!address) {
    throw Error("Address is required");
  }

  const houseInfo = await getUnihouseData(suiClient);
  const houseNames = Object.keys(houseInfo);

  const promiseList: Promise<any>[] = houseNames?.map(async (houseName) => {
    const house = houseInfo[houseName];
    const coinType = house.tokenType;

    if (coinType !== undefined) {
      let cursor = null;
      let hasNextPage = true;
      let ownedObjects: any = [];

      while (hasNextPage) {
        const response: any = await suiClient.getOwnedObjects({
          owner: address,
          filter: {
            StructType: coinType,
          },
          options: {
            showType: true,
            showContent: true,
            showDisplay: true,
          },
          cursor,
        });

        ownedObjects.push(...response.data);
        cursor = response.nextCursor;
        hasNextPage = response.hasNextPage;
      }

      return ownedObjects;
    }
  });

  const ownedObjects = await Promise.all(promiseList);

  let balances: BalanceList = {};

  ownedObjects.forEach((ownedObject, index) => {
    if (ownedObject.length === 0) {
      balances[houseNames[index]] = 0;
    } else {
      const house = Object.values(houseInfo).find(
        (house) => house.tokenType === ownedObject[0]?.data?.type
      );

      const balance = ownedObject.reduce((acc: number, gTokenObject: any) => {
        if (gTokenObject?.data?.content?.fields?.balance) {
          return acc + Number(gTokenObject.data.content.fields.balance);
        }
      }, 0);

      balances[houseNames[index]] = balance;
    }
  });

  return balances;
};

export const getMaxBet = async (
  suiClient,
  coinType
): Promise<number> => {
  let houseInfo = await getUnihouseData(suiClient);

  if (!houseInfo[coinType]) { 
    throw new Error("House not found for cointype")
  }

  return Math.floor(Number(houseInfo[coinType].tvl) / 20)
}