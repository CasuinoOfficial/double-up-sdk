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
  "0xa961256e4bcad48db6a8b9f1815118a14918e3869be865c2eaca2947b09b2b47";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0xf3389ce02b73bbd7b11df7162c68a10ce145e673da46b2d791bc06ad39957a2a";
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
  "0x8c2f543b570a15d6665cf5a84fcdfc70adda78af987a9e3ea1c24fa3d34585ee";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";
export const PLINKO_CONFIG = "0x8c935877a75d1c67781fc61230972635c3c510c5fd87776086722a79df5e8b87";

// ===============================================================================

// roulette
// ===============================================================================
export const ROULETTE_PACKAGE_ID =
  "0x9f0b69ecf5260d68a4c772f8b1115afd3c53caf04d820acfc1471cc99a30b2e6";
export const ROULETTE_CONFIG = "0xef8971ec7004ae35775f434cb61e03ab1886919199ce2bb8acf5321b1b49fd10";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x2a61f12ce30502289c17fcbbfc6d0ad816cf41b219f970d0b32b82990b69d4fd";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";
export const BLACKJACK_CONFIG = "0x736c986293f00184bf73df77d6fbd5fadad2084274eeb047f3483f7274dc1c87";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xec95e40e3b624b9ccce88e62542fb1e8a0cecf22770e127ccd6bab77726dce91";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0x36ab5a1191719832e011fb69911d7c05d58798a402fde4ee92011932ad151672";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// Craps
// ===============================================================================
export const CRAPS_PACKAGE_ID = '0x701df463fbdd42389d1cd596a0bf22585ab2d367a8803ec6e1ba2facb968a16a';
export const CRAPS_CONFIG = '0xae4595a2aa7c99200a05c072025a06597ff218e072d561e48f35b388a9037665';
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
  "0x303bfc8d4911ea4a02c5f0ed0e6572b335c69dfa144e512052844eb979bc8c4c";

export const UNI_HOUSE_OBJ_ID =
  "0x9b5b94662e9ee7a3929abef69b75b66268996423ef13d3ce4d79478b8f4c10e8";
  
// Partner list
// ===============================================================================
export const PARTNER_NFT_LIST_ID = "0x0"