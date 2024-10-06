// COINS
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

export const SUILEND_ASSET_LIST: string[] = [
  SUI_COIN_TYPE,
];

// UNIHOUSE
// ===============================================================================
export const UNIHOUSE_PACKAGE =
  "0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593";
// "0xcbea36448bc5739f17f15b7cad66d797273e86b8b0823f3f221a5c4032fdedfc";
export const UNI_HOUSE_OBJ_ID =
  "0x75c63644536b1a7155d20d62d9f88bf794dc847ea296288ddaf306aa320168ab";

// SUILEND
// ===============================================================================
export const SUILEND_POND_PACKAGE_ID =
  "0x48add966e0ecbcb701beba1f649ae8b30f09e9ec86af7a24b28b0446db673e90";
export const SUILEND_POND_MODULE_NAME = "pond";
export const SUILEND_POND_STRUCT_NAME = "SUILEND_POND";
export const SUILEND_POND_SUI_POOL_OBJ_ID =
  "0xe27ac00ce98ea96dc57d9b85a246a5297e681ec6ccf501cc67ddb6c2ecd5b28f";

// SUILEND - ARGS
export const SUILEND_MAIN_POOL_TYPE =
  "0xf95b06141ed4a174f239417323bde3f209b972f5930d8521ea38a52aff3a6ddf::suilend::MAIN_POOL";
export const SUILEND_MARKET =
  "0x84030d26d85eaa7035084a057f2f11f701b7e2e4eda87551becbc7c97505ece1";
export const PYTH_SUI_PRICE_INFO_OBJ_ID =
  "0x801dbc2f0053d34734814b2d6df491ce7807a725fe9a01ad74a07e9c51396c37";

// VOUCHERS
// ===============================================================================
export const SUI_VOUCHER_BANK = 
  "0xa07a0a48fc82fb86a416d46f3518a20e40dd211a3287f5dcfd599a5165d0f124";
export const BUCK_VOUCHER_BANK = 
  "0x313de210ab58ffd3cd120608f970fbdcb598caf87c62949eeb83c928101c417d";
export const VOUCHER_PACKAGE_ID = 
  "0xfb3efc5a003159d418a5b864d68cd562533e13cbb73d6caa0c4c1a924321b5de";
export const DOUBLEUP_TYPE = `${VOUCHER_PACKAGE_ID}::types::DoubleUp`;
export const UCESPORTS_TYPE = `${VOUCHER_PACKAGE_ID}::types::UCEsports`;
export const DESUI_TYPE = `${VOUCHER_PACKAGE_ID}::types::DesuiLabs`;
export const VOUCHER_BURN_TARGET = `${VOUCHER_PACKAGE_ID}::voucher::burn`;

// SHARED
// ===============================================================================
export const CLOCK_OBJ_ID = "0x6";
export const RAND_OBJ_ID = "0x8";

// PARTNER LIST
// ===============================================================================
export const PARTNER_NFT_LIST_ID = "0x0";

// COINFLIP
// ===============================================================================
export const COIN_CORE_PACKAGE_ID =
  "0x769c53f3c3fe689b6fdd62ade8d378428b37e5489641dd8c8ca8ec12aac6c61a";
export const COIN_PACKAGE_ID =
  "0x769c53f3c3fe689b6fdd62ade8d378428b37e5489641dd8c8ca8ec12aac6c61a";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";

// LIMBO
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID =
  "0x7ce111e52191c9a607661104a9337aa6b6dd89365d0da8b228add413f5b83f91";
export const LIMBO_PACKAGE_ID =
  "0x7ce111e52191c9a607661104a9337aa6b6dd89365d0da8b228add413f5b83f91";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";
export const LIMBO_MIN_MULTIPLIER = "101";
export const LIMBO_MAX_MULTIPLIER = "10000";

// ROULETTE
// ===============================================================================
export const ROULETTE_CORE_PACKAGE_ID =
  "0x0eb72162cfbecb56f4dd13cd558aadc78162f52f93fe5b24627e5a6f6fe15a74";
export const ROULETTE_PACKAGE_ID =
  "0x0eb72162cfbecb56f4dd13cd558aadc78162f52f93fe5b24627e5a6f6fe15a74";
export const ROULETTE_CONFIG =
  "0xa4847402c8b60dea08161f5392267a4629d80a88dbd475b5928cc21edf6f2a69";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// UFO RANGE
// ===============================================================================
export const UFORANGE_CORE_PACKAGE_ID =
  "0xe11016147b507200b9310bfbf8434803dcd446083c26263b93f50b4fcda5a2d1";
export const UFORANGE_PACKAGE_ID =
  "0xe11016147b507200b9310bfbf8434803dcd446083c26263b93f50b4fcda5a2d1";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// ROCK PAPER SCISSORS
// ===============================================================================
export const RPS_CORE_PACKAGE_ID =
  "0x01845f70326fdbe1d0f8e3aa7adf2e1e60a4506704870133ea798020e8d5fb49";
export const RPS_PACKAGE_ID =
  "0x01845f70326fdbe1d0f8e3aa7adf2e1e60a4506704870133ea798020e8d5fb49";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";

// PLINKO
// ===============================================================================
export const PLINKO_CORE_PACKAGE_ID =
  "0x2bc5f01857bdf95112037c1ccc287fc5c6da831eb6ae58da9e789c623b2c4519";
export const PLINKO_PACKAGE_ID =
  "0x2bc5f01857bdf95112037c1ccc287fc5c6da831eb6ae58da9e789c623b2c4519";
export const PLINKO_CONFIG =
  "0x111bd12d45768ffecfec9f64d9b16848afb8f4594ecb01e2db3705ad2a0bf141";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

// BLACKJACK
// ===============================================================================
export const BLACKJACK_CORE_PACKAGE_ID =
  "0xa43f534f689d4f8b7dc7cd1932330b37f93c464ae61a388affbf95a9015b3287";
export const BLACKJACK_PACKAGE_ID =
  "0xa43f534f689d4f8b7dc7cd1932330b37f93c464ae61a388affbf95a9015b3287";
export const BLACKJACK_CONFIG =
  "0x3d5954698533c1ebf6d537f19a9f0fbb1c31b72d3a81bf32c98488b27c14c8ab";
export const BLACKJACK_MODULE_NAME = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// CRAPS
// ===============================================================================
export const CRAPS_CORE_PACKAGE_ID =
  "0x825b0b75efc9e37ce6268890e78e078591d8826dd9fcdde1adee6201399df182";
export const CRAPS_PACKAGE_ID =
  "0xad253ac9337d07c5e8d58d85aea451b230674b90ec6360c2fa8a020d2ffc897a";
export const CRAPS_CONFIG =
  "0x818017e31811db32064e1c7acdd61e62e93aa243f9cdf161afec6ec6862814bc";
export const CRAPS_MODULE_NAME = "craps";
export const CRAPS_STRUCT_NAME = "Craps";
