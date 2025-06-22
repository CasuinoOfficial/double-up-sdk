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
export const USDC_COIN_TYPE =
  "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC";

export const SUILEND_ASSET_LIST: string[] = [SUI_COIN_TYPE];

// UNIHOUSE
// ===============================================================================
export const UNIHOUSE_CORE_PACKAGE_ID =
  "0x2f2226a22ebeb7a0e63ea39551829b238589d981d1c6dd454f01fcc513035593";
export const UNIHOUSE_PACKAGE =
  "0x775aa4de8cf0a5a31127bb3eba07671ddf5217306b2f059a2ff4de2176c62203";
export const UNI_HOUSE_OBJ_ID =
  "0x75c63644536b1a7155d20d62d9f88bf794dc847ea296288ddaf306aa320168ab";

// SUILEND
// ===============================================================================
export const SUILEND_POND_PACKAGE_ID =
  "0x4c954af811ae963eb8bc1dc81964928d4680f4cef26a041c054475b33ccea6fd";
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
  "0x50a221154d407dfe267372b60e3314fc0ba9f1e8b14ea0d95d32a7d1e552f3ba";
export const COIN_PACKAGE_ID =
  "0xc1e6752f79f8d3e989bf524eaaa371c2f2b6bb79f56388f7676073fe01157c8e";
export const COIN_SETTINGS =
  "0x50160e37ded43313e88106192966a86c94846f07d9417bf3770ae801d22eb77c";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";

// LIMBO
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID =
  "0xf4149f5a45d6bceab6d741214ffa5c654041421592427041729f0a5b02faa0ef";
export const LIMBO_PACKAGE_ID =
  "0xa4fe67f43f3529315d61021b1e05909db43682f61f362204e1aff640cb4e9a6d";
export const LIMBO_SETTINGS =
  "0xf70e9dd52342897da20195e31f503077c61de3b2ddfde0d4235975bde3903f61";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";
export const LIMBO_MIN_MULTIPLIER = "101";
export const LIMBO_MAX_MULTIPLIER = "10000";

// ROULETTE
// ===============================================================================
export const ROULETTE_CORE_PACKAGE_ID =
  "0x9fa42aa6f73652e3123701705731873bee2fc407b05777b96583bfa389277053";
export const ROULETTE_PACKAGE_ID =
  "0x6ee59ba689bf08c3535b8440597954bb7310c68cdf9a7d3f21744c736fc1fdc6";
// All package ids to loop through and find the users table
// Other table games have table creation all through the CORE package id
// this is roulette specific lazy solution for core package bug fix
// Please add any new package to this in the corresponding order
export const ROULETTE_ALL_PACKAGES = [
  "0x9fa42aa6f73652e3123701705731873bee2fc407b05777b96583bfa389277053",
  "0x2db22f1c6b40ff4ba332899b4e79c2dd7caa1768887fb066dfed313c9a31519d",
  "0x53158255db20c05d2bd67b96fed18a45a718e355455e9055d412e1d0fd540265", //v6
  "0x650fd6110a237d7d13a82a979ab40e3c604872373ef03976a7a1a0a91b2f47d3",
  "0xfadefb4aef2a8aefcf56c4164a41153981af50ff7db3209f70779c09ee3bd79c",
  "0x6ee59ba689bf08c3535b8440597954bb7310c68cdf9a7d3f21744c736fc1fdc6",
];
export const ROULETTE_CONFIG =
  "0x10b6c15345f843de1bfc2c0829b7d289214fd35407297f7a8d442363b48f30c1";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// UFO RANGE
// ===============================================================================
export const UFORANGE_CORE_PACKAGE_ID =
  "0x3d37357bac2e9644920b5c51d403938c32ea76e9ec848b1a526b208e76da1707";
export const UFORANGE_PACKAGE_ID =
  "0xc3512848a67c06b809c00ce3b727a0d0da7c121fe565371e8eab72ec9b182468";
export const UFORANGE_SETTINGS =
  "0x46c62d4486d84e30f28db15346f7f05a0a3eafcf35e5edc4ce2e3f697ad450f9";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// ROCK PAPER SCISSORS
// ===============================================================================
export const RPS_CORE_PACKAGE_ID =
  "0xcaf0accdaf364de8cbc94b38b94f4d6188a9d6c682713ef98d4fa795a2614276";
export const RPS_PACKAGE_ID =
  "0xad76838cd9115d22e698e8698aa0b4cb6022bf416cc9805a6f4cdcb0c2fbbf10";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";

// PLINKO
// ===============================================================================
export const PLINKO_CORE_PACKAGE_ID =
  "0xcc2a73921f5c3f0fc11e910afaf836def3bab7cb1ecdbc4e2757034f0841e5d5";
export const PLINKO_PACKAGE_ID =
  "0x2815bafc1698d9e35681981a6203bcb4ae327944592b9669110e164d27620f4e";
export const PLINKO_CONFIG =
  "0xbd487307d4b198fa409487418ae44b69148dff5361ab24d6e81378f50dead202";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

// BLACKJACK
// ===============================================================================
export const BLACKJACK_CORE_PACKAGE_ID =
  "0x5e2f4359b5c0311954f502c4e1e12a845e85152b67e033ca6f8590b5781606ff";
export const BLACKJACK_PACKAGE_ID =
  "0x94707e3f958ba37daf6853d604ba7679bfb291a29753206abf7c0d4d3ec1b300";
export const BLACKJACK_CONFIG =
  "0xc5bc486dfb1f35147440ea457e42154c24ea123055c372b80980051384d241fa";
// All package ids to loop through and find the users table
// Other table games have table creation all through the CORE package id
// this is roulette specific lazy solution for core package bug fix
// Please add any new package to this in the corresponding order
export const BLACKJACK_ALL_PACKAGES = [
  "0x5e2f4359b5c0311954f502c4e1e12a845e85152b67e033ca6f8590b5781606ff",
  "0x94707e3f958ba37daf6853d604ba7679bfb291a29753206abf7c0d4d3ec1b300",
];
export const BLACKJACK_MODULE_NAME = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// CRAPS
// ===============================================================================
export const CRAPS_CORE_PACKAGE_ID =
  "0x2c6b186d1bb437e09132af796714340d431c7dfaa83cddfd4b9bd785204be743";
export const CRAPS_PACKAGE_ID =
  "0x94a0a723492acc6ce56eb57d22d19636aa9f94d7d806eda3904ef98517943f36";
export const CRAPS_CONFIG =
  "0xbec3aa034334a8b8aa01d42ed1eddd14eda93ec3187cfc10577431c541a18261";
export const CRAPS_MODULE_NAME = "craps";
export const CRAPS_STRUCT_NAME = "Craps";

// Sports
export const SPORTS_CORE_PACKAGE_ID =
  "0xb3fedcdf9251f215788c8e6e15806fa4d07449b4bf4614bba9930204b43198da";
export const SPORTS_PACKAGE_ID =
  "0x9cd713a6450d0a933da1a7eb88a490570c39b2ecaebcdd736313b7d35d0fa865";
export const SPORTS_MODULE_NAME = "sports";
export const SPORTS_STRUCT_NAME = "Sportsbook";

// RAFFLES
// ===============================================================================
export const RAFFLES_CORE_PACKAGE_ID =
  "0xe208f6a4963525d38b94628d4554c5d5b70fbd8a063512f72e7c8af8c6e40dde";
export const RAFFLES_PACKAGE_ID =
  "0xe208f6a4963525d38b94628d4554c5d5b70fbd8a063512f72e7c8af8c6e40dde";
export const RAFFLES_TREASURY =
  "0xf878994a8884f447f610e6208e782b3ee11406e47989d4a2acd79efe2aca500b";
export const RAFFLES_MODULE_NAME = "raffles";
export const RAFFLES_STRUCT_NAME = "Raffles";

export const DOGHOUSE = "";
// GACHAPON
// ===============================================================================
export const GACHAPON_CORE_PACKAGE_ID =
  "0x385f7a0aef8e472e657f2795a70ca9ae5752085c03c67b7807c6cc2b1cce448f";
export const GACHAPON_PACKAGE_ID =
  "0x0b37112d665e1e8831e6f00247ab988f5f1a0b56c1573b883a9c29aa3d796612";
export const GACHAPON_CONFIG = "";
export const GACHAPON_MODULE_NAME = "gachapon";
export const GACHAPON_RULE_MODULE_NAME = "gachapon_rule";

//************************//
//        PUMP FUN        //
//************************//
export const PUMP_PACKAGE_ID =
  "0xf202992873010d11fa2be276cee215d3f1e3ce3f416c9fbaac23f9de15cb9f13";
export const PUMP_CORE_PACKAGE_ID =
  "0x3f2a0baf78f98087a04431f848008bad050cb5f4427059fa08eeefaa94d56cca";
export const PUMP_MODULE = "curve";
export const SHARE_CURVE = `${PUMP_PACKAGE_ID}::${PUMP_MODULE}::transfer`;
export const PUMP_LIST_CURVE_TARGET = `${PUMP_PACKAGE_ID}::${PUMP_MODULE}::list`;
export const PUMP_BUY_TOKEN_TARGET = `${PUMP_PACKAGE_ID}::${PUMP_MODULE}::buy`;
export const PUMP_SELL_TOKEN_TARGET = `${PUMP_PACKAGE_ID}::${PUMP_MODULE}::sell`;
export const CONFIGURATOR_OBJ_ID =
  "0x97f24f964264611bf19e396fe25e1fb04a2bc36e66f177621ae9a5e0206745c5";
export const CURVE_LISTED_EVENT = `${PUMP_CORE_PACKAGE_ID}::${PUMP_MODULE}::BondingCurveListedEvent`;
export const TRADE_EVENT = `${PUMP_CORE_PACKAGE_ID}::${PUMP_MODULE}::SwapEvent`;

//************************//
//    ALLOY PREDICTION    //
//************************//
export const ALLOY_CORE_PACKAGE_ID =
  "0x3dfea2b0436e15d76fb27a157eda7fba5ee83af94ae068bf81602ab8b8f44ced";
export const ALLOY_PACKAGE_ID =
  "0x3dfea2b0436e15d76fb27a157eda7fba5ee83af94ae068bf81602ab8b8f44ced";
export const ALLOY_MARKET_CONFIG =
  "0x2423762bbd581ee2d182e30ab7b589a7b87cab456b02c7d1d6cc4e01932c0bed";
export const ALLOY_ADMIN_CAP =
  "0x3a323654910b5bda5590568d230e2718c2b9e251a33de97ea1f290221de9fcd7";
export const ALLOY_UPGRADE_CAP =
  "0x26f5d5543300a2f5770fe20109bac39d2d4300e3063c5a89314d47c4b5204a9d";
export const ALLOY_MARKETPLACE_ID =
  "0x3db02cfccebe7179af37d01483cdfc03e99d6d3d0e6423768bf57dfc59b762a9";
export const ALLOY_MARKET_ID =
  "0xf47a01145092a1ac1dc16c0bebc7f42e5daba4464d1c6c2d65d5546b7bf61582";

export const ALLOY_MODULE_NAME = "alloy";
export const ALLOY_STRUCT_NAME = "alloy";

export const PERSONAL_KIOSK_PACKAGE =
  "0xdfb4f1d4e43e0c3ad834dcd369f0d39005c872e118c9dc1c5da9765bb93ee5f3";

// lottery
// ===============================================================================
export const LOTTERY_CORE_PACKAGE_ID =
  "0xff7fed37f3d61ca2cb7f2628f527e5c0a26294f1589c8565333aeb1a66b02c60";
export const LOTTERY_PACKAGE_ID =
  "0xadf1c05dc6bf15ffda71a8e042f153e46c15446559ed8985e00178b57e8dee80";
export const LOTTERY_MODULE_NAME = "lottery";
export const LOTTERY_STRUCT_NAME = "Lottery";
export const LOTTERY_ID =
  "0xa174c58c216666320bf9c605e8b333518a28362f607a204d4194f03308ebf2e0";
export const LOTTERY_STORE =
  "0xde89e9f915a8b88bf5807e50aa621103c0adfb978ae4892590d5c0f0bf73848d";
// ===============================================================================
