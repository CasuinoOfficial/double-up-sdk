import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { DoubleUpClient } from "./src/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { ROULETTE_CORE_PACKAGE_ID, ROULETTE_PACKAGE_ID, SUI_COIN_TYPE } from "./src/constants";
import { Transaction } from "@mysten/sui/transactions";
import { randomInt } from "crypto";
import { RouletteBet } from "./src/games/roulette";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import * as dotenv from 'dotenv';
import { sleep } from "./src/utils";

dotenv.config();
const PRIVKEY = process.env.PRIVKEY;

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
const { schema, secretKey } = decodeSuiPrivateKey(PRIVKEY?? "");
const keypair = Ed25519Keypair.fromSecretKey(secretKey);

const dbClient = new DoubleUpClient({
    roulettePackageId: ROULETTE_PACKAGE_ID,
    rouletteCorePackageId: ROULETTE_CORE_PACKAGE_ID,
  
    suiClient: client,
});

const testRouletteCreate = async (
    dbClient: DoubleUpClient,
    client: SuiClient,
    keypair: Ed25519Keypair
) => {
    try {
        const txb = new Transaction();
  
        const { ok: createOk, err: createErr } = dbClient.createRouletteTable({
            coinType: SUI_COIN_TYPE,
            transaction: txb,
        });
  
        console.log("Added roulette table create to transaction block.");
  
        if (!createOk) {
            throw createErr;
        }
  
        const transactionResult = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: txb as any,
            options: {
                showRawEffects: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
  
        if (
            transactionResult?.effects &&
            transactionResult?.effects.status.status === "failure"
        ) {
            throw new Error(transactionResult.effects.status.error);
        }
  
        console.log("Signed and sent transaction.");
  
        const {
            ok: getOk,
            err: getErr,
            result,
        } = dbClient.getCreatedRouletteTable({
            coinType: SUI_COIN_TYPE,
            transactionResult,
        });
  
        if (!getOk) {
            throw getErr;
        }
  
        console.log(result);
    } catch (err) {
        console.log(err);
    }
};
  
const testRouletteExists = async (
    dbClient: DoubleUpClient,
    client: SuiClient,
    keypair: Ed25519Keypair
) => {
    try {
        const address = keypair.getPublicKey().toSuiAddress();
  
        const { ok, err, tableExists } = await dbClient.doesRouletteTableExist({
            address,
            coinType: SUI_COIN_TYPE,
        });
    
        if (!ok) {
            throw err;
        }
  
        console.log({ tableExists });
    } catch (err) {
        console.log(err);
    }
};
  
const testRouletteStart = async (
    dbClient: DoubleUpClient,
    client: SuiClient,
    keypair: Ed25519Keypair
) => {
    try {
        const txb = new Transaction();
  
        const address = keypair.getPublicKey().toSuiAddress();
  
        const {
            ok: startOk,
            err: startErr,
            gameSeed,
        } = dbClient.startRoulette({
            coinType: SUI_COIN_TYPE,
            transaction: txb,
        });
  
        if (!startOk) {
            throw startErr;
        }
  
        const transactionResult = await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: txb as any,
            options: {
                showRawEffects: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
  
        if (
            transactionResult?.effects &&
            transactionResult?.effects.status.status === "failure"
        ) {
            throw new Error(transactionResult.effects.status.error);
        }
  
        // Get the current round number of the object
        const { roundNumber } = await dbClient.doesRouletteTableExist({
            address,
            coinType: SUI_COIN_TYPE,
        });
  
        const {
            ok: resultOk,
            err: resultErr,
            results,
            rawBetResults,
            rawResults,
        } = await dbClient.getRouletteResult({
            coinType: SUI_COIN_TYPE,
            //TODO: need to confirm could the gameSeed be empty string or not
            gameSeed: gameSeed ?? "",
            transactionResult,
            //TODO: need to confirm could the roundNumber be empty string or not
            roundNumber: roundNumber ?? "",
        });
  
        if (!resultOk) {
            throw resultErr;
        }
  
        console.log(results);
        console.log("raws", rawBetResults, rawResults);
    } catch (err) {
        console.dir(err, {depth: 3});
    }
};
  

const addNRouletteBets = async(
    numberBets: number,
    dbClient: DoubleUpClient,
    client: SuiClient, 
    keypair: Ed25519Keypair
) => {
    const betAmount = 1;
    const tableAddress = '0x83a2d5f495ad4dfd9f4c39c0eb0f626ad9dfd31bdd483ee9ea3087681a29bfad';

    try {
        const funderAddress = keypair.getPublicKey().toSuiAddress();
        const txb = new Transaction();
        const wallet = new Ed25519Keypair();
        const walletAddress = wallet.getPublicKey().toSuiAddress();
            
        const fundCoin = txb.splitCoins(txb.gas, [txb.pure.u64(5_000_000_000)]);
        txb.transferObjects([fundCoin], walletAddress);
            
        await client.signAndExecuteTransaction({
            signer: keypair,
            transaction: txb as any,
            options: {
                showRawEffects: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });

        const txb2 = new Transaction();

        for (let i: number = 0; i < numberBets; i++) {
            const betType = randomInt(13) as RouletteBet;
            const betNumber = (betType === 2) ? randomInt(1, 38) : undefined;
            const [coin] = txb2.splitCoins(txb2.gas, [txb2.pure.u64(betAmount)]);
            // console.log(`bet type: ${betType}, number: ${betNumber}`);
            const { ok, err } = dbClient.addRouletteBet({
                address: tableAddress,
                betNumber,
                betType,
                coin,
                coinType: SUI_COIN_TYPE,
                transaction: txb2,
            });

            if (!ok) {
                throw err;
            }
        }
    
        console.log(`Added ${numberBets} random roulette bets to transaction block from ${walletAddress}.`);
    
        const transactionResult = await client.signAndExecuteTransaction({
            signer: wallet,
            transaction: txb2 as any,
            options: {
                showRawEffects: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
    
        if (
            transactionResult?.effects &&
            transactionResult?.effects.status.status === "failure"
        ) {
            throw new Error(transactionResult.effects.status.error);
        }
    
        console.log("Signed and sent transaction.", transactionResult.digest);

        // Transfer remaining funds back to funder
        const txb3 = new Transaction();
        txb3.transferObjects([txb3.gas], funderAddress);
        await client.signAndExecuteTransaction({
            signer: wallet,
            transaction: txb3 as any,
            options: {
                showRawEffects: true,
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
            },
        });
    } catch (err) {
        console.log(err);
    }
};

const main = async(
    numberBets: number,
    numberLoops: number,
    dbClient: DoubleUpClient,
    client: SuiClient, 
    keypair: Ed25519Keypair
) => {
    // await testRouletteCreate(dbClient, client, keypair);
    // await testRouletteExists(dbClient, client, keypair);
    for (let i: number = 0; i < numberLoops; i++) {
        await addNRouletteBets(numberBets, dbClient, client, keypair);
        await sleep(5000);
    }
    // await testRouletteStart(dbClient, client, keypair);
    console.log("test complete");
};

main(250, 10, dbClient, client, keypair);