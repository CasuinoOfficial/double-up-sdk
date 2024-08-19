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
  "0x40e238338ebe43e2c7e68f95abadbe0cf2f57b6a9c438dc8c99420971b6c01cb";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0xd641b25cde3ea14d6ff46d3ded1c0456881956f708d3f62d038b07893a2d7271";
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
  "0x8318ad757263f89c408d2adbf6ca7de4af1b74d9abc59a5299d52a0181e32aaf";
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
  "0xa6f2a0809053306da275b9460fc33b0d417200411404beafbe31bc4626f9f697";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x06dafbf1d3bc4df8765ab080c638ddcb1bee62f17e3c66091b9f32eb9835aef8";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xf8c9b9bc32fad71978aa1ce0c71899fe16d66b5e71e15e66d2d8820265589329";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0x384058b24e81df9708553b562c14481e921cc2576da90b06e5d6d31faa8c75a2";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// Craps
// ===============================================================================
export const CRAPS_PACKAGE_ID = '0x5fc268b2438c0af48ac383f47f754c1dbc1dbd653f4be6fa421c55b40b6f0dbc';
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
  "0xae976fbbfc634bcb4546ac0fea5a692de59a9f8f49a71536f0b32f6396e783b6";

export const UNI_HOUSE_OBJ_ID =
  "0x801d6de71b93d3dea11ed7fe0bf89304f8ce47fcdec884424129a535745aac3b";
// ===============================================================================