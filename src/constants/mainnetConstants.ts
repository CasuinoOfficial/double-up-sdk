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
  "0x8214ce7fd4ef1f262c10da6f947d9ade00f01220e3ac911cac5df7d85fd400f9";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";

// LIMBO
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID =
  "0x3e7c4f8ec751f21782c193b6cb7cc7b8172d403f4a787b6ac3ef671d9155849e";
export const LIMBO_PACKAGE_ID =
  "0x82dc610eef3cb98a3ebe10967da1a35c62ee6ea3152af0b78d284560cc075508";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";
export const LIMBO_MIN_MULTIPLIER = "101";
export const LIMBO_MAX_MULTIPLIER = "10000";

// ROULETTE
// ===============================================================================
export const ROULETTE_CORE_PACKAGE_ID =
  "0x9fa42aa6f73652e3123701705731873bee2fc407b05777b96583bfa389277053";
export const ROULETTE_PACKAGE_ID =
  "0x2db22f1c6b40ff4ba332899b4e79c2dd7caa1768887fb066dfed313c9a31519d";
// All package ids to loop through and find the users table
// Other table games have table creation all through the CORE package id
// this is roulette specific lazy solution for core package bug fix
// Please add any new package to this in the corresponding order
export const ROULETTE_ALL_PACKAGES = [
  "0x9fa42aa6f73652e3123701705731873bee2fc407b05777b96583bfa389277053",
  "0x2db22f1c6b40ff4ba332899b4e79c2dd7caa1768887fb066dfed313c9a31519d",
];
export const ROULETTE_CONFIG =
  "0x10b6c15345f843de1bfc2c0829b7d289214fd35407297f7a8d442363b48f30c1";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

// UFO RANGE
// ===============================================================================
export const UFORANGE_CORE_PACKAGE_ID =
  "0x4e8fe4c1a63ca6e44255e64e84e90a9d58d55f12fcfabb938ba54715b6884be7";
export const UFORANGE_PACKAGE_ID =
  "0x9a85e8632c24b331ca34295dab91e81c3d6ba8393b3810c13109f2d382efd889";
export const UFORANGE_MODULE_NAME = "ufo_range";
export const UFORANGE_STRUCT_NAME = "UFORange";

// ROCK PAPER SCISSORS
// ===============================================================================
export const RPS_CORE_PACKAGE_ID =
  "0x15aacb18b7139dd8a11bd53eb87b5c6bb7163c2d20b8df5097a231ea96daee1a";
export const RPS_PACKAGE_ID =
  "0xbee96be842bad6f8ae0617ae98c8185b5602b63b7ad302b3c2ce7ea82366d71c";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";

// PLINKO
// ===============================================================================
export const PLINKO_CORE_PACKAGE_ID =
  "0x512a8cd71c5bd163ea34001778ff026049e2325856246fb787ceaada8b77b7d2";
export const PLINKO_PACKAGE_ID =
  "0x1fe09dde001fa92d5a60eb892615c7975556dbca2f4c29c137ff8fc003bce08f";
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
  "0x711363cd374c5b02902e70bf6c9e6147d56469a59dd31b7c662cdc8e2ead2dba";
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
  "0xbf0e36f8ba310c61d99f61b256b22e54e6f523823be8922daa17dbed97416209";
export const LOTTERY_MODULE_NAME = "lottery";
export const LOTTERY_STRUCT_NAME = "Lottery";
export const LOTTERY_ID =
  "0x25590d89ded97b12e50a069e0aebd215677eae7631a37c530a5396ed6801c100";
export const LOTTERY_STORE =
  "0xde89e9f915a8b88bf5807e50aa621103c0adfb978ae4892590d5c0f0bf73848d";
// ===============================================================================
