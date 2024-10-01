import { SuiClient, SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
  TransactionObjectArgument,
} from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

import {
  PLINKO_MODULE_NAME,
  RAND_OBJ_ID,
  UNI_HOUSE_OBJ_ID,
  PLINKO_CONFIG,
  CLOCK_OBJ_ID,
  PYTH_SUI_PRICE_INFO_OBJ_ID,
  SUILEND_MARKET,
  SUILEND_POND_SUI_POOL_OBJ_ID,
  SUILEND_ASSET_LIST,
} from "../../constants/mainnetConstants";
import {
  getAssetIndex,
  getTypesFromVoucher,
  getVoucherBank,
} from "../../utils";

// 0: 6 Rows, 1: 9 Rows, 2: 12 Rows
type PlinkoType = 0 | 1 | 2;

export interface PlinkoInput {
  betAmount: number;
  coin: TransactionObjectArgument;
  coinType: string;
  numberOfDiscs: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin?: string;
}

interface InternalPlinkoInput extends PlinkoInput {
  plinkoPackageId: string;
}

export interface PlinkoVoucherInput {
  betSize: number;
  voucherId: string;
  numberOfDiscs: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin?: string;
}

interface InternalPlinkoVoucherInput extends PlinkoVoucherInput {
  plinkoPackageId: string;
  client: SuiClient;
}

export interface GetPlinkoTableInput {
  address: string;
  coinType: string;
}

interface InternalGetPlinkoTableInput extends GetPlinkoTableInput {
  plinkoCorePackageId: string;
  suiClient: SuiClient;
}

export interface GetPlinkoTableResponse {
  ok: boolean;
  err?: Error;
  fields?: any;
}

export interface PlinkoAddBetInput {
  creator: string;
  coin: TransactionObjectArgument;
  coinType: string;
  transaction: TransactionType;
}

interface InternalPlinkoAddBetInput extends PlinkoAddBetInput {
  origin: string;
  plinkoPackageId: string;
}

export interface PlinkoAddBetResponse {
  ok: boolean;
  err?: Error;
  betId?: TransactionArgument;
}
export interface PlinkoTableInput {
  coinType: string;
  transaction: TransactionType;
}
export interface InternalPlinkoTableInput extends PlinkoTableInput {
  plinkoCorePackageId: string;
}
export interface PlinkoRemoveBetInput {
  creator: string;
  player: string;
  coinType: string;
  transaction: TransactionType;
}

interface InternalPlinkoRemoveBetInput extends PlinkoRemoveBetInput {
  plinkoPackageId: string;
}

export interface PlinkoRemoveBetResponse {
  ok: boolean;
  err?: Error;
  returnedCoin?: TransactionArgument;
}

export interface StartMultiPlinkoInput {
  coinType: string;
  creator: string;
  numberOfDiscs: number;
  betSize: number;
  plinkoType: PlinkoType;
  transaction: TransactionType;
  origin: string;
}

interface InternalStartMultiPlinkoInput extends StartMultiPlinkoInput {
  plinkoPackageId: string;
}

export const createPlinkoTable = ({
  coinType,
  plinkoCorePackageId,
  transaction,
}: InternalPlinkoTableInput) => {
  const [table] = transaction.moveCall({
    target: `${plinkoCorePackageId}::${PLINKO_MODULE_NAME}::create_plinko_table`,
    typeArguments: [coinType],
    arguments: [
      transaction.object(UNI_HOUSE_OBJ_ID),
      transaction.object(PLINKO_CONFIG),
    ],
  });
};

export const getPlinkoTable = async ({
  address,
  coinType,
  plinkoCorePackageId,
  suiClient,
}: InternalGetPlinkoTableInput): Promise<GetPlinkoTableResponse> => {
  const res: GetPlinkoTableResponse = { ok: true };

  try {
    const { data } = await suiClient.getDynamicFieldObject({
      parentId: PLINKO_CONFIG,
      name: {
        type: `${plinkoCorePackageId}::${PLINKO_MODULE_NAME}::GameTag<${coinType}>`,
        value: {
          creator: address,
        },
      },
    });

    if (data?.content?.dataType !== "moveObject") {
      return null;
    }

    const fields = data.content.fields as any;
    res.ok = true;
    res.fields = fields;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const addPlinkoBet = ({
  coinType,
  plinkoPackageId,
  creator,
  coin,
  transaction,
}: InternalPlinkoAddBetInput): PlinkoAddBetResponse => {
  const res: PlinkoAddBetResponse = { ok: true };

  try {
    const [betId] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::add_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.pure.address(creator),
        coin,
      ],
    });

    res.betId = betId;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const removePlinkoBet = ({
  coinType,
  plinkoPackageId,
  creator,
  player,
  transaction,
}: InternalPlinkoRemoveBetInput): PlinkoRemoveBetResponse => {
  const res: PlinkoRemoveBetResponse = { ok: true };

  try {
    const [coin] = transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::remove_bet`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.pure.address(creator),
        transaction.pure.address(player),
      ],
    });

    res.returnedCoin = coin;
  } catch (err) {
    res.ok = false;
    res.err = err;
  }

  return res;
};

export const startMultiPlinko = ({
  coinType,
  creator,
  numberOfDiscs,
  betSize,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin,
}: InternalStartMultiPlinkoInput) => {
  transaction.setGasBudget(100_000_000);
  if (coinType in SUILEND_ASSET_LIST) {
    let assetIndex = getAssetIndex(coinType);
    transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_plinko_0`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.address(creator),
        transaction.pure.u64(numberOfDiscs),
        transaction.pure.u64(betSize),
        transaction.pure.u8(plinkoType),
        transaction.pure.string(origin ?? "DoubleUp"),
        transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
        transaction.object(SUILEND_MARKET),
        transaction.object(CLOCK_OBJ_ID),
        transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
        transaction.pure.u64(assetIndex),
      ],
    });
  } else {
    transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_plinko`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(PLINKO_CONFIG),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.address(creator),
        transaction.pure.u64(numberOfDiscs),
        transaction.pure.u64(betSize),
        transaction.pure.u8(plinkoType),
        transaction.pure.string(origin ?? "DoubleUp"),
      ],
    });
  }
};

export const createSinglePlinko = ({
  coin,
  coinType,
  numberOfDiscs,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin,
}: InternalPlinkoInput) => {
  let assetIndex = getAssetIndex(coinType);
  transaction.setGasBudget(100_000_000);

  if (coinType in SUILEND_ASSET_LIST) {
    transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko_0`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(numberOfDiscs),
        transaction.pure.u8(plinkoType),
        transaction.pure.string(origin ?? "DoubleUp"),
        coin,
        transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
        transaction.object(SUILEND_MARKET),
        transaction.object(CLOCK_OBJ_ID),
        transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
        transaction.pure.u64(assetIndex),
      ],
    });
  } else {
    transaction.moveCall({
      target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko`,
      typeArguments: [coinType],
      arguments: [
        transaction.object(UNI_HOUSE_OBJ_ID),
        transaction.object(RAND_OBJ_ID),
        transaction.pure.u64(numberOfDiscs),
        transaction.pure.u8(plinkoType),
        transaction.pure.string(origin ?? "DoubleUp"),
        coin,
      ],
    });
  }
};

export const createSinglePlinkoWithVoucher = async ({
  betSize,
  voucherId,
  client,
  numberOfDiscs,
  plinkoPackageId,
  plinkoType,
  transaction,
  origin,
}: InternalPlinkoVoucherInput) => {
  try {
    let [coinType, voucherType] = await getTypesFromVoucher(voucherId, client);
    let voucherBank = getVoucherBank(coinType);
    transaction.setGasBudget(20_000_000);

    if (coinType in SUILEND_ASSET_LIST) {
      let assetIndex = getAssetIndex(coinType);
      transaction.moveCall({
        target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko_with_voucher_0`,
        typeArguments: [coinType, voucherType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure.u64(numberOfDiscs),
          transaction.pure.u8(plinkoType),
          transaction.pure.string(origin ?? "DoubleUp"),
          transaction.pure.u64(betSize),
          transaction.object(voucherId),
          transaction.object(voucherBank),
          transaction.object(SUILEND_POND_SUI_POOL_OBJ_ID),
          transaction.object(SUILEND_MARKET),
          transaction.object(CLOCK_OBJ_ID),
          transaction.object(PYTH_SUI_PRICE_INFO_OBJ_ID),
          transaction.pure.u64(assetIndex),
        ],
      });
    } else {
      transaction.moveCall({
        target: `${plinkoPackageId}::${PLINKO_MODULE_NAME}::play_singles_plinko_with_voucher`,
        typeArguments: [coinType, voucherType],
        arguments: [
          transaction.object(UNI_HOUSE_OBJ_ID),
          transaction.object(RAND_OBJ_ID),
          transaction.pure.u64(numberOfDiscs),
          transaction.pure.u8(plinkoType),
          transaction.pure.string(origin ?? "DoubleUp"),
          transaction.pure.u64(betSize),
          transaction.object(voucherId),
          transaction.object(voucherBank),
        ],
      });
    }
  } catch (e) {
    console.error(e);
  }
};
