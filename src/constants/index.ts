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
export const SUICUNE_COIN_TYPE =
  "0x8c47c0bde84b7056520a44f46c56383e714cc9b6a55e919d8736a34ec7ccb533::suicune::SUICUNE";
export const VSUI_COIN_TYPE =
  "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT";
// ===============================================================================

// coinflip
// ===============================================================================
export const COIN_PACKAGE_ID =
  "0xc1ce78e8c9eac461218455b1b3a2ab3ff927182f392f9cd1d80688d97085b44a";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0xf5943c4704216e0eeb29153389b7578faebc6185f588d845fcdfd48a9e936f06";
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
  "0xd4f2ca437f03361428e158f2bc4fc87a52a72b250b4226c1804279386a8dd9ab";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";
export const PLINKO_CONFIG = "0x0279a349f3a160876b2663eee766965f963192c778cf8579218418b2935c0d48";

// ===============================================================================

// roulette
// ===============================================================================
export const ROULETTE_PACKAGE_ID =
  "0x1e89e9b006a1715528ebe1f0b15feddc493d12459d019b09cff5794463a1c989";
export const ROULETTE_CONFIG = "0x36a4814a67d5ab35e111bf84fd4a14ff172ca13ea1ab69b483da20da10325597";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x4ffe4ebe75c63073702bec75a6739682c6b333bb49e6091e30a40cb863cd5a3c";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";
export const BLACKJACK_CONFIG = "0x7fb7db5497b832c993d4343fec08e05170fd54cd8d48e2bad0c0ec771bc9dde8";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xb7b052091369f7b2626627325ea0c988af763469aed9f5033dcd557c480e4a5b";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0x3d313119ea5284192ddcc2e9349c7f2ec153376ee3e5ec620ba90cf67e0ab8ae";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// Craps
// ===============================================================================
export const CRAPS_PACKAGE_ID = '0xab027d68203420f78bcba2ccaae7dc21ec9671228dc8ba3057d3a03e6401b4ab';
export const CRAPS_CONFIG = '0xf67a47be05791edbc3abe1e3e42a94f41d03768eb6084d0b4608d5ee61d30bb9';
export const CRAPS_MODULE_NAME = "craps";
export const CRAPS_STRUCT_NAME = "Craps";
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
  "0xcc7ac6f612b6ffda85bea0fdb99690f3608a199398439e14d61db20516586cfa";

export const UNI_HOUSE_OBJ_ID =
  "0x9fef90d29a2ecdb7e4fcc0d066bb16ea9934db17161722d87f2bc0a8ccf45a90";
  
// Partner list
// ===============================================================================
export const PARTNER_NFT_LIST_ID = "0x0"