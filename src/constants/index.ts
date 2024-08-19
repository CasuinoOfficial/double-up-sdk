import { Inputs } from "@mysten/sui/transactions";

// coins
// ===============================================================================
export const BUCK_COIN_TYPE =
  "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK";
export const FUD_COIN_TYPE =
  "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD";
export const NAVX_COIN_TYPE =
  "0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX";
export const PUP_COIN_TYPE =
  "0x980ec1e7d5a3d11c95039cab901f02a044df2d82bc79d99b60455c02524fad83::pup::PUP";
export const STASH_COIN_TYPE =
  "0x2cff601fe16f622fd6203f8f64bef4e68d687f51f4d06f13c2bbba17cb84c87e::stash::STASH";
export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const SUICANE_COIN_TYPE =
  "0x8c47c0bde84b7056520a44f46c56383e714cc9b6a55e919d8736a34ec7ccb533::suicune::SUICUNE";
export const VSUI_COIN_TYPE =
  "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT";
// ===============================================================================

// coinflip
// ===============================================================================
export const COIN_PACKAGE_ID =
  "0x11b826a79e1da7801e3e4f59ee0f2b047edbf828375b0055c92b1d242b757f01";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0x30e738500c2470521cf11df3d25f85609e731aad378948c745818fc4477674b0";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";

export const LIMBO_MIN_MULTIPLIER = "101";
export const LIMBO_MAX_MULTIPLIER = "10000";
// ===============================================================================

// lottery
// ===============================================================================
export const LOTTERY_CORE_PACKAGE_ID = "";
export const LOTTERY_PACKAGE_ID =
  "0x5fad208418200537f2785aefdca3c8e15e2843ebdffd524956e6d6d6aca845a9";
export const LOTTERY_MODULE_NAME = "lottery";
export const LOTTERY_STRUCT_NAME = "Lottery";

export const LOTTERY_ID =
  "0x447953794edc1dd42891ca3cfbcc21ef510d42fc90db9a6d9189a2913c570f23";
export const LOTTERY_STORE_ID =
  "0x212509ffef4a7615c8e0f26d70ac84c93cbf88d6eb3f9f363a27d5ba2526f684";
// ===============================================================================

// plinko
// ===============================================================================
export const PLINKO_PACKAGE_ID =
  "0x81f5fc374a94d8285ee6d140a6ba7253c38a280f908e0c48c889d7f63f3dad7c";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

// ===============================================================================

// roulette
// ===============================================================================
export interface RouletteConfig {
  coinType: string;
  initialSharedVersion: number;
  mutable: boolean;
  objectId: string;
}

export const ROULETTE_PACKAGE_ID =
  "0x7bad85c854188b6d438f14bae7a409860a1cacda891721b707059ad3e15c878d";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x60390c5d4696b81a84b9ab037dcd8828a0ac02ca91aed3dc257b7415333e54f0";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0x9f4e23421230f801d3ccbefb7b95f2691f50a918a68bb1ca3eb26e3f26ae0484";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0xfec755dcd2b2f63645686c1eb22544e304acb330fef2090593f1799b46adf557";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";
// ===============================================================================

// shared
// ===============================================================================
export const CLOCK_OBJ: any = Inputs.SharedObjectRef({
  objectId: "0x6",
  initialSharedVersion: 1,
  mutable: false,
});

export const RAND_OBJ_ID: any = "0x8";

// UNIHOUSE
export const UNIHOUSE_PACKAGE =
  "0xdb20c647b538dcd3eff8ca4303d59480d46cf5e1d22ad7ae626f78d1d970a63f";
  
export const UNI_HOUSE_OBJ_ID =
  "0x5995a0a86812cc44d09731cb85095d2c0c03857341adb0da0e7c08dfaf3e8498";
// ===============================================================================