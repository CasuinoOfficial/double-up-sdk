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
  "0x4d39975db3238629dbabef52d4371517f9e3bdac29ec230287d1da3c3f48e671";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0x0a8b8d07beca88603e60599d292d912912ab2967385a407cf437466299664807";
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
  "0x23e03d9511c724ac51a84210e0610bd3e20194bae1009f94c3ed5702ef413433";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";
export const PLINKO_CONFIG = "0x9e29741f87e0ec9cdd43021eb5e615a508aedf35cc7a78d7b2b9a2ecb57db0b8";

// ===============================================================================

// roulette
// ===============================================================================
export const ROULETTE_PACKAGE_ID =
  "0xf6898cf9e138f194813aaa040ee06aa4635d9d4892a7cf337f32a5c91137a8f3";
export const ROULETTE_CONFIG = "0x480e4cef3a4199617e60a71ee3552f8d2399e5323c6b77f337dc2e45e6afd61d";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0xef04e35e48c8f1f1a5971fd81fa08a71f5483686f66b15cd04c5ad143e3d4591";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";
export const BLACKJACK_CONFIG = "0xcbde865663933d00076055f65f7e027f005c8b3ee153a9edfd6359a854844bce";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xab10402ed3fd468c95dbde6293fcc54a7ddf02c39c611869e64e9e43387deb92";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0x8c0efaf24ce015efeaf5f6390f77db8bae19524dfe4503592957cec1b70035a7";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// Craps
// ===============================================================================
export const CRAPS_PACKAGE_ID = '0x4bbb20826d40f01880d73d6be3e9e3893642c7df097c26ae6adb39e6b30d9722';
export const CRAPS_CONFIG = '0xc4a90f27e37df6a3e8789dda4f5676800b9749689564cb418e98ecdb3ce13f88';
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
  "0xabc8ed960455572aae8e5992ee01473d91d3e88ef658858aeec0aeaadd27fa95";

export const UNI_HOUSE_OBJ_ID =
  "0x3ba8d14d96a81ca1e5ee09fec772bfd17a6f9660b23e2becbb88defbd04300a5";
  
// Partner list
// ===============================================================================
export const PARTNER_NFT_LIST_ID = "0x0"