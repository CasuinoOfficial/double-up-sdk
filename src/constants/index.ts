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
  "0xd3f3a32ef0edf0fcf98813aa60be1665f259caa03362c7fd7844e8a3c763ad2b";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_PACKAGE_ID =
  "0x52243cbbfbf7209aa226f623900214414f73e957e4741638f24cb3b9d0c16f96";
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
  "0xe04f1a24f63e68ecb01faf18f2fa9c5016bf72f18938b1aaf1235ba48100c01c";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";
export const PLINKO_CONFIG = "0xdc690a92f53a43981f701546481efc33e0ffb9283967d8da5565c28514793df9";

// ===============================================================================

// roulette
// ===============================================================================
export const ROULETTE_PACKAGE_ID =
  "0x2f3bef45d2783ea968c393f431fc207b8c29d14e4a487aae69251f460af17ea9";
export const ROULETTE_CONFIG = "0x2e64d8a3f6fa904d26393622e1ff3c12d056cb43a8bf924ae986c5b6c8634ea0";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// Blackjack
// ===============================================================================
export const BLACKJACK_PACKAGE_ID = "0x44bbbb69db782c2cf8252f12cda052d4680189b24d675739246f97c778c01a8b";
export const BLACKJACK_MODULE = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";
export const BLACKJACK_CONFIG = "0xbee412707092a75b292d88c53c1ebca71a2b8f56976db65eaabaefd394fe66f4";

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0xb5489c1d67defefe88c990e302121b6b7b6ff5f61bf6a91ae230b076614ed9bd";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const UFORANGE_PACKAGE_ID =
  "0xc0fdeaa0786ea2601e0fe1fd24595e2ab5fddd1dc99737c1877b8e238a559c3b";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// Craps
// ===============================================================================
export const CRAPS_PACKAGE_ID = '0xacac83e7239ce62a2b4ddf0021031eb170a8464464fe4a7691ba5c26329039a1';
export const CRAPS_CONFIG = '0x994c7e63df55a442bb3ee78b59865d23c6ff9195f2ac1a10caeb5a90b9b54e47';
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
  "0x9365ff0594a1c5c50bd1f6755910435a0757771e617d68a8f65e2f1e50666662";

export const UNI_HOUSE_OBJ_ID =
  "0x9a64c674aa752e334419bd63ef0c6eb9c9bc9271ce336b103cf25fa156a8a8da";
  
// Partner list
// ===============================================================================
export const PARTNER_NFT_LIST_ID = "0x0"