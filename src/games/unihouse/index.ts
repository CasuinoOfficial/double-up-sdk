import { SuiGrpcClient } from "@mysten/sui/grpc";
import type { SuiClientTypes } from "@mysten/sui/client";
import {
  Transaction as TransactionType,
  TransactionObjectArgument,
  Transaction,
} from "@mysten/sui/transactions";
import {
  CLOCK_OBJ_ID,
  UNIHOUSE_PACKAGE,
  UNI_HOUSE_OBJ_ID,
} from "../../constants/mainnetConstants";
import { U64FromBytes, shortenAddressesInType } from "../../utils";
import Decimal from "decimal.js";

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
    maxRisk: string;
    totalSupply?: string;
    maxSupply?: string;
    gTokenPrice: string;
    houseFeeRate?: string;
    riskLimit?: string;
    depositFee?: string;
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

// Now only have SUI and USDC
const getUnihouseConfig = async (suiClient: SuiGrpcClient, coinTypes: string[]) => {
  //Default config based on the house contract
  const houseConfig = {
    houseFeeRate: "300000",
    riskLimit: "default",
    depositFee: "200",
  };

  //TODO: change to use PTB when all the houses have their config
  const dryRunPromises = coinTypes.map((coinType) => {
    const devTx = new Transaction();

    devTx.moveCall({
      target: `${UNIHOUSE_PACKAGE}::unihouse::get_house_config`,
      typeArguments: [coinType],
      arguments: [devTx.object(UNI_HOUSE_OBJ_ID)],
    });

    devTx.setSender(
      "0xc5f9b77a07c38acc5418008dfe69255872d45e3d2334e1f52a530d1e4ad52866"
    );

    return suiClient.simulateTransaction({
      transaction: devTx,
      checksEnabled: false,
      include: { commandResults: true },
    });
  });

  const dryRunResponses = await Promise.all(dryRunPromises);

  if (!dryRunResponses || dryRunResponses.length === 0) {
    console.error("no results found");
    return Object.fromEntries(coinTypes.map((ct) => [ct, houseConfig]));
  }

  const realHouseConfigList = {} as Record<string, typeof houseConfig>;

  for (const [index, response] of dryRunResponses.entries()) {
    if (
      response.$kind === "FailedTransaction" ||
      !response.commandResults ||
      response.commandResults.length === 0
    ) {
      realHouseConfigList[coinTypes[index]] = houseConfig;
      continue;
    }

    const values = response.commandResults[0].returnValues;

    if (values === undefined || values?.length === 0) {
      console.error("no values found");
      realHouseConfigList[coinTypes[index]] = houseConfig;
      continue;
    }

    const bytesArray = values?.map((value) => {
      return value.bcs;
    });

    if (!bytesArray) {
      realHouseConfigList[coinTypes[index]] = houseConfig;
      continue;
    }

    const houseConfigKeys = Object.keys(houseConfig);

    let tempHouseConfig = { ...houseConfig };

    bytesArray.forEach((bytes, index) => {
      const u64 = U64FromBytes(bytes);
      const key = houseConfigKeys[index];

      tempHouseConfig[key as keyof typeof houseConfig] = u64.toString();
    });

    realHouseConfigList[coinTypes[index]] = tempHouseConfig;
  }

  return realHouseConfigList;
};

export const getUnihouseData = async (
  suiClient: SuiGrpcClient
): Promise<UnihouseInfo> => {
  let cursor: string | null = null;
  let hasNextPage = true;
  const dynamicFields: SuiClientTypes.DynamicFieldEntry[] = [];

  while (hasNextPage) {
    const response: SuiClientTypes.ListDynamicFieldsResponse = await suiClient.listDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor,
    });

    dynamicFields.push(...response.dynamicFields);
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }

  const unihouseList = dynamicFields.filter((field) =>
    field.valueType.includes("house::House<")
  );
  if (unihouseList.length === 0) return {};
  const unihouseIdList = unihouseList.map((house) =>
    house.$kind === "DynamicObject" ? house.childId : house.fieldId
  );

  const batchSize = 50;

  const batchedIds = unihouseIdList.reduce((acc, id, index) => {
    const batchIndex = Math.floor(index / batchSize);
    if (!acc[batchIndex]) {
      acc[batchIndex] = [];
    }
    acc[batchIndex].push(id);
    return acc;
  }, [] as string[][]);

  const houseDataPromises = batchedIds.map((batch) => {
    return suiClient.getObjects({
      objectIds: batch,
      include: { json: true },
    });
  });

  const houseDataList = await Promise.all(houseDataPromises);

  const houseData = houseDataList.flatMap((response) => response.objects);

  const houseFields = houseData.map((house) =>
    house instanceof Error ? undefined : (house.json as any)
  );

  let houseInfo: UnihouseInfo = {};
  if (!houseFields) return houseInfo;

  // valueType is `<housePkg>::house::House<coinType>` — gRPC json carries no
  // type strings, so coin/token types are derived from the field entry instead
  const coinTypeList = unihouseList.map((house) =>
    shortenAddressesInType(house.valueType.split("<")[1].split(">")[0])
  );

  const houseConfig = await getUnihouseConfig(suiClient, coinTypeList);

  houseFields.forEach((field, index) => {
    const tokenSymbol = unihouseList[index].valueType
      .split("::")
      .pop()
      ?.split(">")[0];

    const coinType = coinTypeList[index];

    if (!tokenSymbol) return;

    const houseName = `g${tokenSymbol}`;
    const housePackageId = unihouseList[index].valueType.split("::house::House<")[0];
    const tokenType = `0x2::coin::Coin<${housePackageId}::house::StakedHouseCoin<${coinType}>>`;

    const pipeDebt = field?.pipe_debt?.value;
    //House Pool
    const housePool = Number(field?.house_pool);
    //Stake Pool TVL
    const stakePoolTvl = Number(pipeDebt) + Number(field?.pool);
    const totalSupply = Number(field?.supply?.value);
    const maxSupply = Number(field?.max_supply);
    const maxRisk = stakePoolTvl + housePool;

    const config = houseConfig.hasOwnProperty(coinType)
      ? houseConfig[coinType]
      : {
        houseFeeRate: undefined,
        riskLimit: undefined,
        depositFee: undefined,
      };

    houseInfo[coinType] = {
      id: unihouseIdList[index],
      coinType: coinType,
      tokenSymbol: tokenSymbol,
      tokenType: tokenType,
      name: houseName,
      totalSupply: totalSupply.toString(),
      maxSupply: maxSupply.toString(),
      tvl: stakePoolTvl.toString(),
      maxRisk: maxRisk.toString(),
      gTokenPrice: (stakePoolTvl / totalSupply).toFixed(4),
      houseFeeRate: config.houseFeeRate,
      riskLimit:
        config.riskLimit === "default"
          ? new Decimal(stakePoolTvl).div(20).toFixed(0)
          : config.riskLimit,
      depositFee: config.depositFee,
    };
  });

  return houseInfo;
};

export const getRedeemRequests = async (
  suiClient: SuiGrpcClient,
  address?: string
) => {
  let cursor: string | null = null;
  let hasNextPage = true;
  const dynamicFields: SuiClientTypes.DynamicFieldEntry[] = [];

  while (hasNextPage) {
    const response: SuiClientTypes.ListDynamicFieldsResponse = await suiClient.listDynamicFields({
      parentId: UNI_HOUSE_OBJ_ID,
      cursor,
    });
    dynamicFields.push(...response.dynamicFields);
    cursor = response.cursor;
    hasNextPage = response.hasNextPage;
  }

  const redeemRequests = dynamicFields.filter((field) =>
    field.valueType.includes("RedeemRequest")
  );

  if (redeemRequests.length === 0) return [];

  const redeemRequestsIdList = redeemRequests.map((request) =>
    request.$kind === "DynamicObject" ? request.childId : request.fieldId
  );

  const { objects: allRequestData } = await suiClient.getObjects({
    objectIds: redeemRequestsIdList,
    include: { json: true },
  });

  const allRequestFields = allRequestData.map((request) =>
    request instanceof Error ? undefined : (request.json as any)
  );

  if (!allRequestFields) return [];

  const userRedeemRequests = allRequestFields.filter(
    (request) => request?.sender === address
  );

  if (!userRedeemRequests || userRedeemRequests.length === 0) return [];

  return userRedeemRequests
    .map((request) => {
      return {
        id: request?.id,
        createdAt: request?.created_at,
        balance: request?.s_coin?.balance,
      };
    })
    .sort((a, b) => {
      return Number(a.createdAt) - Number(b.createdAt);
    });
};

export const getGTokenBalance = async (
  suiClient: SuiGrpcClient,
  address: string
): Promise<BalanceList> => {

  console.log("address", address);
  if (!address) {
    throw Error("Address is required");
  }

  const houseInfo = await getUnihouseData(suiClient);
  const houseNames = Object.keys(houseInfo);

  const promiseList: Promise<any>[] = houseNames?.map(async (houseName) => {
    const house = houseInfo[houseName];
    const coinType = house.tokenType;

    if (coinType !== undefined) {
      let cursor: string | null = null;
      let hasNextPage = true;
      let ownedObjects: any = [];

      while (hasNextPage) {
        const response: SuiClientTypes.ListOwnedObjectsResponse = await suiClient.listOwnedObjects({
          owner: address,
          type: coinType,
          include: { json: true },
          cursor,
        });

        ownedObjects.push(...response.objects);
        cursor = response.cursor;
        hasNextPage = response.hasNextPage;
      }

      return ownedObjects;
    }
  });

  const ownedObjects = await Promise.all(promiseList);

  console.log("ownedObjects", ownedObjects);

  let balances: BalanceList = {};

  ownedObjects.forEach((ownedObject, index) => {
    if (ownedObject.length === 0) {
      balances[houseNames[index]] = 0;
    } else {
      const house = Object.values(houseInfo).find(
        (house) =>
          house.tokenType === shortenAddressesInType(ownedObject[0]?.type ?? "")
      );

      const balance = ownedObject.reduce((acc: number, gTokenObject: any) => {
        if (gTokenObject?.json?.balance) {
          return acc + Number(gTokenObject.json.balance);
        }
      }, 0);

      balances[houseNames[index]] = balance;
    }
  });

  return balances;
};

export const getMaxBet = async (suiClient: SuiGrpcClient, coinType: string): Promise<number> => {
  let houseInfo = await getUnihouseData(suiClient);

  if (!houseInfo[coinType]) {
    throw new Error("House not found for cointype");
  }

  return Math.floor(Number(houseInfo[coinType].tvl) / 20);
};
