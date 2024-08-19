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
  "0x5ccb82f23a20291d3a45f5b9b576aeffbb48d56e4bc58bd5befc82fa7309e496";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0x56d84253489f0c45ae045a6c814a4086306eefc04f1365964ff9146d08bee132";
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
  "0x8c80c732d006f98a9a34697bf78ffd52d309f11ce428dec19426010eb2958966";
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
  "0x9ae0dcd8d014ca9993f4432e0a817e1d7994dc7fb8247a1954473cca0629d7c4";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x4f0218468281d6d52a2f2a97c1a0c21bb64f4408bbb644ba301da477f40972a9";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xb8952a4bebb246ae2754604e283b89e9c46a9b78df67fc7ee37875f59eecb487";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0xe537921902a6c66871aabbc276ee045b05c277febfc4b2a6b1b576de764e49f6";
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
export const UNI_HOUSE_OBJ_ID =
  "0xa7ee1a753dab908862f4f6b92aa1d97abf61033e407edcde420ad91c31cb62b9";
export const UNIHOUSE_PACKAGE =
  "0x3098b601d307e1943f6477241c0fa8d9fafdbfe5f4b456fdc0b95378c0127891";
// ===============================================================================
