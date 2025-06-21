import { SuiClient, DynamicFieldInfo } from "@mysten/sui/client";
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
import { U64FromBytes } from "../../utils";
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
const getUnihouseConfig = async (suiClient: SuiClient, coinTypes: string[]) => {
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

    return suiClient.devInspectTransactionBlock({
      transactionBlock: devTx,
      sender:
        "0xc5f9b77a07c38acc5418008dfe69255872d45e3d2334e1f52a530d1e4ad52866",
    });
  });

  const dryRunResponses = await Promise.all(dryRunPromises);

  if (!dryRunResponses || dryRunResponses.length === 0) {
    console.error("no results found");
    return houseConfig;
  }

  const realHouseConfigList = {} as Record<string, typeof houseConfig>;

  for (const [index, response] of dryRunResponses.entries()) {
    if (response?.results === undefined || response?.results?.length === 0) {
      realHouseConfigList[coinTypes[index]] = houseConfig;
      continue;
    }

    const values = response.results[0].returnValues;

    if (values === undefined || values?.length === 0) {
      console.error("no values found");
      return houseConfig;
    }

    const bytesArray = values?.map((value) => {
      return value[0];
    });

    if (!bytesArray) return houseConfig;

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
    return suiClient.multiGetObjects({
      ids: batch,
      options: {
        showContent: true,
        showType: true,
      },
    });
  });

  const houseDataList = await Promise.all(houseDataPromises);

  const houseData: any[] = houseDataList.flat();

  const houseFields = houseData.map((house) => house.data?.content?.fields);

  let houseInfo: UnihouseInfo = {};
  if (!houseFields) return houseInfo;

  const coinTypeList = houseFields.map((field) => {
    return field?.supply?.type.split("<")[2].split(">")[0];
  });

  const houseConfig = await getUnihouseConfig(suiClient, coinTypeList);

  houseFields.forEach((field, index) => {
    const tokenSymbol = unihouseList[index].objectType
      .split("::")
      .pop()
      ?.split(">")[0];

    const coinType = `${field?.supply?.type.split("<")[2].split(">")[0]}`;

    if (!tokenSymbol) return;

    const houseName = `g${tokenSymbol}`;
    const tokenType = `0x2::coin::Coin<${field?.supply?.type.split("<")[1]}<${
      field?.supply?.type.split("<")[2].split(">")[0]
    }>>`;

    const pipeDebt = field?.pipe_debt?.fields?.value;
    const totalSui = Number(pipeDebt) + Number(field?.pool);
    const totalSupply = Number(field?.supply?.fields?.value);
    const maxSupply = Number(field?.max_supply);

    const config = houseConfig.hasOwnProperty(coinType)
      ? houseConfig[coinType]
      : {
          houseFeeRate: undefined,
          riskLimit: undefined,
          depositFee: undefined,
        };

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
      houseFeeRate: config.houseFeeRate,
      riskLimit:
        config.riskLimit === "default"
          ? new Decimal(totalSui).div(20).toFixed(0)
          : config.riskLimit,
      depositFee: config.depositFee,
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

  const allRequestData: any[] = await suiClient.multiGetObjects({
    ids: redeemRequestsIdList,
    options: {
      showContent: true,
      showType: true,
    },
  });

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

export const getMaxBet = async (suiClient, coinType): Promise<number> => {
  let houseInfo = await getUnihouseData(suiClient);

  if (!houseInfo[coinType]) {
    throw new Error("House not found for cointype");
  }

  return Math.floor(Number(houseInfo[coinType].tvl) / 20);
};
