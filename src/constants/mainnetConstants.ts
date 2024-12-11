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

export const SUILEND_ASSET_LIST: string[] = [SUI_COIN_TYPE];

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
  "0x2e7e7e71cd8cb283c4e4dbb652b9155b85dd5afce6bdd7881ae228eb26fc4082";
export const COIN_PACKAGE_ID =
  "0xc7a14e8e58abc21100a5c218d4e4f89cf8f1ac1af7066b451dfb05f976002f15";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";

// LIMBO
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID =
  "0x3e7c4f8ec751f21782c193b6cb7cc7b8172d403f4a787b6ac3ef671d9155849e";
export const LIMBO_PACKAGE_ID =
  "0x3e7c4f8ec751f21782c193b6cb7cc7b8172d403f4a787b6ac3ef671d9155849e";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";
export const LIMBO_MIN_MULTIPLIER = "101";
export const LIMBO_MAX_MULTIPLIER = "10000";

// ROULETTE
// ===============================================================================
export const ROULETTE_CORE_PACKAGE_ID =
  "0x9fa42aa6f73652e3123701705731873bee2fc407b05777b96583bfa389277053";
export const ROULETTE_PACKAGE_ID =
  "0x50cc4347ff5d5790d6bd7ac4fa28f5be6e36e10973d4eb54b7da4a85604c5ecb";
export const ROULETTE_CONFIG =
  "0x10b6c15345f843de1bfc2c0829b7d289214fd35407297f7a8d442363b48f30c1";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// UFO RANGE
// ===============================================================================
export const UFORANGE_CORE_PACKAGE_ID =
  "0x4e8fe4c1a63ca6e44255e64e84e90a9d58d55f12fcfabb938ba54715b6884be7";
export const UFORANGE_PACKAGE_ID =
  "0x4e8fe4c1a63ca6e44255e64e84e90a9d58d55f12fcfabb938ba54715b6884be7";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// ROCK PAPER SCISSORS
// ===============================================================================
export const RPS_CORE_PACKAGE_ID =
  "0x15aacb18b7139dd8a11bd53eb87b5c6bb7163c2d20b8df5097a231ea96daee1a";
export const RPS_PACKAGE_ID =
  "0x15aacb18b7139dd8a11bd53eb87b5c6bb7163c2d20b8df5097a231ea96daee1a";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";

// PLINKO
// ===============================================================================
export const PLINKO_CORE_PACKAGE_ID =
  "0x512a8cd71c5bd163ea34001778ff026049e2325856246fb787ceaada8b77b7d2";
export const PLINKO_PACKAGE_ID =
  "0x9f5b8e6f9985f9d1fe06458d1cf17dd49ec3ce2581797d5a820e522651e3475b";
export const PLINKO_CONFIG =
  "0x4f15b4d7165833f1bedbbf114393b9d723a81ce0c27552776e00af97760eab6f";
export const PLINKO_MODULE_NAME = "multi_plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

// BLACKJACK
// ===============================================================================
export const BLACKJACK_CORE_PACKAGE_ID =
  "0x5e2f4359b5c0311954f502c4e1e12a845e85152b67e033ca6f8590b5781606ff";
export const BLACKJACK_PACKAGE_ID =
  "0x9a2bf41fdc9f72e862af9d0809b5466aefe581ea45848425456647a9658a9589";
export const BLACKJACK_CONFIG =
  "0xc5bc486dfb1f35147440ea457e42154c24ea123055c372b80980051384d241fa";
export const BLACKJACK_MODULE_NAME = "blackjack";
export const BLACKJACK_STRUCT_NAME = "Blackjack";

// CRAPS
// ===============================================================================
export const CRAPS_CORE_PACKAGE_ID =
  "0x2c6b186d1bb437e09132af796714340d431c7dfaa83cddfd4b9bd785204be743";
export const CRAPS_PACKAGE_ID =
  "0x9960751493250c4a2e942ff3ae394e784e82d84bce291df3e010139d91ff4371";
export const CRAPS_CONFIG =
  "0xbec3aa034334a8b8aa01d42ed1eddd14eda93ec3187cfc10577431c541a18261";
export const CRAPS_MODULE_NAME = "craps";
export const CRAPS_STRUCT_NAME = "Craps";

// RAFFLES
// ===============================================================================
export const RAFFLES_CORE_PACKAGE_ID =
  "0xbe8090ef7d91b307024766220db52e161021b0016c0164300ee5941c7e517ab9";
export const RAFFLES_PACKAGE_ID =
  "0xbe8090ef7d91b307024766220db52e161021b0016c0164300ee5941c7e517ab9";
export const RAFFLES_TREASURY =
  "0xa7f05a7ba45ba8dc4227d7d3128f4042af4d1f4b8883fbeb7bd047e42232f240";
export const RAFFLES_MODULE_NAME = "raffles";
export const RAFFLES_STRUCT_NAME = "Raffles";

export const DOGHOUSE = "";
// GACHAPON
// ===============================================================================
export const GACHAPON_CORE_PACKAGE_ID =
  "0xe181e5d2f61a661cf2d61270dc5fb33a024ce21d32ef06786bc367f76fea541b";
export const GACHAPON_PACKAGE_ID =
  "0x8486c494351552f44019db353323b762c3719b8ae2f0be2e1bb5cb0baeef4931";
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
  "0x89748c0f249d011dedba4d4376a2d7ad83e55f24ee7c05be44e38cfbd4ad59ea";
export const ALLOY_PACKAGE_ID =
  "0x89748c0f249d011dedba4d4376a2d7ad83e55f24ee7c05be44e38cfbd4ad59ea";
export const ALLOY_MARKET_CONFIG =
  "0xf4b4f71e973d6260c6730ccabf2aff747aa9a81fd8b639c7c06f9d672f8015f3";
export const ALLOY_ADMIN_CAP =
  "0x1fb8e163793a4c608dc91b55171dc23443720e29ee18532b71a5d600424c5552";
export const ALLOY_UPGRADE_CAP =
  "0x302812d285afe7130e0ce13ee70279ffb0e4d1196c899a883c2bd3b8c49cfb0a";
export const ALLOY_MARKETPLACE_ID =
  "0xb62dc986190d742dec71ec47fa50ad47ff435b040acb930635ec05bf73851998";
export const ALLOY_MARKET_ID =
  "0x40ec1fc667e2fa0618f30d3256284b1f40bf5b6f1716c50033e35591499eaa5c";
export const ALLOY_MODULE_NAME = "alloy";
export const ALLOY_STRUCT_NAME = "alloy";

export const PERSONAL_KIOSK_PACKAGE =
  "0xdfb4f1d4e43e0c3ad834dcd369f0d39005c872e118c9dc1c5da9765bb93ee5f3";
