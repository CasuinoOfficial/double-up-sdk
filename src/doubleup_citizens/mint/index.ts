import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import {
  TransactionArgument,
  Transaction as TransactionType,
} from "@mysten/sui/transactions";

import {
  NFT_PACKAGE_ID,
  NFT_MODULE_NAME,
  NFT_FEES_COLLECTOR,
  NFT_TRANSFER_POLICY,
} from "src/constants";

export type NFTMintInput = {
  user: string;
  coin: TransactionArgument;
  whitelistTicket: string | null;
  transaction: TransactionType;
};

export type NFTRevealInput = {
  citizen: string;
  kiosk: string;
  kiosk_cap: string;
  revealTicket: string;
  transaction: TransactionType;
};

export const mint = ({
  user,
  coin,
  whitelistTicket,
  transaction,
}: NFTMintInput) => {
  let whitelistOption: TransactionArgument;
  if (typeof whitelistTicket === "string") {
    whitelistOption = transaction.moveCall({
      target: `0x2::option::some`,
      arguments: [transaction.object(whitelistTicket)],
    });
  } else {
    whitelistOption = transaction.moveCall({
      target: `0x2::option::none`,
      typeArguments: [`${NFT_PACKAGE_ID}::${NFT_MODULE_NAME}::WhitelistTicket`],
    });
  }
  const nft = transaction.moveCall({
    target: `${NFT_PACKAGE_ID}::${NFT_MODULE_NAME}::mint`,
    arguments: [transaction.object(NFT_FEES_COLLECTOR), coin, whitelistOption],
  });

  transaction.transferObjects([nft], transaction.pure.address(user));
};

export const reveal = ({
  citizen,
  kiosk,
  kiosk_cap,
  revealTicket,
  transaction,
}: NFTRevealInput) => {
  transaction.moveCall({
    target: `${NFT_PACKAGE_ID}::${NFT_MODULE_NAME}::reveal`,
    arguments: [
      transaction.object(citizen),
      transaction.object(kiosk),
      transaction.object(kiosk_cap),
      transaction.object(NFT_TRANSFER_POLICY),
      transaction.object(revealTicket),
    ],
  });
};
