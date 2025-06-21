/*
  This is an example of a bot that plays the DoubleUp UFO Range game.
  The game requires the player to choose a range between 0 and 100 (2 decimals allowed)
  and a bet type which can either be 0 (INSIDE) or 1 (OUTSIDE).
  For example a range of [53, 68] with bet type 0 will win if the random result is 53 or 54 or 55 or ... up to 68 included.
  An OUTSIDE example is with range [10, 80] and bet type 1, the winning numbers are 1,2,3...,10 and 80,81,82,... 100, a total of 31 winning numbers.
  The payout is inversly proportional to the amount of winning numbers, 10 winning numbers will return 100/10 = 10x our initial bet,
  while 50 winning numbers will return 100/50 = 2x our initial bet.

  In this example we play over 50 (the code for under 50 is also implemented) for a payout of 2x our initial bet. If the first bet is lost we will
  automatically play again with double the stake until we win or we exceed our LOSS_GUARD limit. Ideally this will ensure we will profit the initial
  bet every time.

  DISCLAIMER: This code is provided without any guarantees of any kind. Eventually loss will be incured, it might even be as soon as the first run.
  The authors waive any responsibility, we provide this code as an example of the DoubleUp SDK usage, use it with coins on mainnet at your own risk.s
*/

import { Transaction } from "@mysten/sui/transactions";
import { DBClient, getSigner } from "./utils";

const coinType = "0x2::sui::SUI";
// The initial amount is dependent on our risk appetite, we should still have leeway for at least 5 losing bets
const initialAmount = 2;
const MIST = 1_000_000_000;
const overRange = [5000, 10000]; // Over 50
const underRange = [0, 5000]; // Under 50
const keypair = getSigner();
const LOSS_GUARD = 6;

// We will use sleep because sending transactions too fast might result in limit rating or errors
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const overBet = async (round: number) => {
  // if we encounter 6 loses in a row than we finish to stop losing greater amounts.
  if (round > LOSS_GUARD) throw `More than ${LOSS_GUARD} rounds!!!!`;
  // The rounds will increase every time we lose and the bet will double;
  let amount = initialAmount * 2 ** round;
  // When dealing with Sui all coin amounts should be given in MIST
  amount = amount * MIST;
  const ranges = [overRange];
  const tx = new Transaction();
  const coin = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
  DBClient.createRange({
    betTypes: [0],
    range: ranges,
    coin,
    coinType,
    transaction: tx,
  });

  const response = await DBClient.suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  // Get the correct event to read the result whether we won or lost
  const event = response.events?.filter((evs) =>
    evs.type.includes("RangeGameResult")
  );
  if (event) {
    const ev: any = event[0];
    const results = ev.parsedJson.bet_results;
    const wonAmount = results[0].bet_returned;
    const isWin = Number(wonAmount) !== 0;
    return {
      won: Number(wonAmount),
      isWin,
    };
  }
  return {
    won: -1,
    isWin: true,
  };
};

const underBet = async (round: number) => {
  if (round > 6) throw "More than 6 rounds!!!!";
  let amount = initialAmount * 2 ** round;
  amount = amount * MIST;
  const ranges = [underRange];
  const tx = new Transaction();
  const coin = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
  DBClient.createRange({
    betTypes: [0],
    range: ranges,
    coin,
    coinType,
    transaction: tx,
  });

  const response = await DBClient.suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  const event = response.events?.filter((evs) =>
    evs.type.includes("RangeGameResult")
  );
  if (event) {
    const ev: any = event[0];
    const results = ev.parsedJson.bet_results;
    const wonAmount = results[0].bet_returned;
    const isWin = Number(wonAmount) !== 0;
    return {
      won: Number(wonAmount),
      isWin,
    };
  }
  return {
    won: -1,
    isWin: true,
  };
};

// target is how many wins we want
// In this example we are aiming to win 2 SUI every time, so a target of 10 means 20 SUI win
const main = async (target: number) => {
  let winTimes = 0;
  let round = 0;
  while (winTimes < target) {
    // This is already checked but it doesn't hurt to be safe.
    if (round > LOSS_GUARD) {
      console.log(`Reached round ${LOSS_GUARD + 1} without a win gg`);
      break;
    }
    // Get our result
    const result = await overBet(round);
    if (result.isWin) {
      round = 0;
      // Increase the counter of wins
      winTimes++;
    } else {
      // Increase the round which will double the bet
      round++;
    }
    // Sleep more than 1 second to make sure all public fullnodes have the latest state
    await sleep(1213);
  }
};
main(1);
