import { SuiClient, SuiEvent } from "@mysten/sui.js/client";
// import { TransactionResult } from "@mysten/sui.js/transactions";

import { UNIHOUSE_PACKAGE } from "../constants";

interface GenericGameResultInput {
  coinType: string;
  moduleName: string;
  packageId: string;
  pollInterval: number;
  structName: string;
  suiClient: SuiClient;
  transactionResult: any;
}

// Function to sleep for a specified duration
export const sleep = (ms: number): any => (
    new Promise(resolve => setTimeout(resolve, ms))
);

export const extractGenericTypes = (typeName: string): string[] => {
    const x = typeName.split("<");
    if (x.length > 1) {
      return x[1].replace(">", "").replace(" ", "").split(",");
    } else {
      return [];
    };
};

export const getGenericGameResult = async ({
  coinType,
  moduleName,
  packageId,
  pollInterval = 3000,
  suiClient,
  structName,
  transactionResult
}: GenericGameResultInput) => {
  const objectChanges = transactionResult.objectChanges;

  const gameInfos = (objectChanges as any[])
      .filter((change) => {
          let delta =
              change.objectType ===
              `${UNIHOUSE_PACKAGE}::bls_settler::BetData<${coinType}, ${packageId}::${moduleName}::${structName}>`;

          return delta;
      })
      .map((change) => {
          const gameCoinType = extractGenericTypes(
              change.objectType ?? "",
          )[0];
          const gameStringType = extractGenericTypes(
              change.objectType ?? "",
          )[1];

          const gameId = change.objectId as string;
          
          return { gameId, gameStringType, gameCoinType };
  });

  let resultEvent: SuiEvent[] = [];
  
  while (resultEvent.length === 0) {
      try {
          const events = await suiClient.queryEvents({
              query: {
                  MoveEventModule: {
                      module: "bls_settler",
                      package: UNIHOUSE_PACKAGE,
                  }
              },
              limit: 50,
          });

          resultEvent = events.data.filter((event: any) => {
              if (event.parsedJson.bet_id === gameInfos[0].gameId) {
                return true;
              }
          });
      } catch (error) {
          console.error("Error querying events:", error);
      };

      if (resultEvent.length === 0) {
          console.log(`No events found. Polling again in ${pollInterval * 1000} seconds...`);
          await sleep(pollInterval);
      }
  }
  return resultEvent;
};
