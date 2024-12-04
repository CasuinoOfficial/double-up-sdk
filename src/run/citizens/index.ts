import { KioskClient, KioskTransaction } from "@mysten/kiosk";
import { DoubleUpClient } from "../../client";
import { shortenAddress } from "../../utils";
import { Secp256k1Keypair } from "@mysten/sui/keypairs/secp256k1";
import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

export const testGetCitizens = async (
  dbClient: DoubleUpClient,
  address: string
) => {
  return dbClient.getCitizens(address);
};

export const testGetCitizenInventories = async (
  dbClient: DoubleUpClient,
  address: string,
  citizenId?: string | string[]
) => {
  if (citizenId && typeof citizenId === "string") {
    const inventory = await dbClient.getCitizenInventories(citizenId, true);
  } else {
    const citizens = await dbClient.getCitizens(address);
    const citizenKeys = Object.keys(citizens);

    if (citizenId && citizenId.length !== 0) {
      const filteredCitizens = citizenKeys.filter((key) =>
        citizenId.includes(key)
      );
      const totalCitizens = filteredCitizens.length;
      console.log(`Total citizens: ${totalCitizens}`);
      let index = 0;

      do {
        const citizen = citizens[citizenKeys[index]];
        const inventory = await dbClient.getCitizenInventories(
          citizen.id,
          citizen.is_revealed
        );
        index++;
      } while (index < totalCitizens);
    } else {
      const totalCitizens = citizenKeys.length;
      console.log(`Total citizens: ${totalCitizens}`);
      let index = 0;

      do {
        const citizen = citizens[citizenKeys[index]];
        const inventory = await dbClient.getCitizenInventories(
          citizen.id,
          citizen.is_revealed
        );
        index++;
      } while (index < totalCitizens);
    }
  }
};

export const testLockCitizen = async (
  keypair: Secp256k1Keypair,
  client: SuiClient,
  kioskClient: KioskClient,
  citizenId: string
) => {
  const { kioskOwnerCaps } = await kioskClient.getOwnedKiosks({
    address: keypair.toSuiAddress(),
  });
  const kioskOwnerCap = kioskOwnerCaps[0];

  const tx = new Transaction();

  const kioskTx = new KioskTransaction({
    transaction: tx,
    kioskClient,
    cap: kioskOwnerCap,
  });

  // Use kioskTx.place if you don't want to lock
  kioskTx
    .lock({
      itemId: citizenId,
      itemType: `0x862810efecf0296db2e9df3e075a7af8034ba374e73ff1098e88cc4bb7c15437::doubleup_citizens::DoubleUpCitizen`,
      item: tx.object(citizenId),
      policy: tx.object(
        "0x3f930eb7f18480989eee8dca460f4edad9fbd5560c68c6a2d711785a5c0d4cb1"
      ), // policy ID
    })
    .finalize();

  const resp = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: {
      showEffects: true,
    },
  });
  console.log(resp);
};
