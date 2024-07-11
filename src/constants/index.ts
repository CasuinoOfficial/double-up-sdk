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
  "0x57c3008880285085e5fd94092f21923158e3d8906161cf24d6ec1bb4e5b9036a";
export const COIN_CORE_PACKAGE_ID =
  "0x57c3008880285085e5fd94092f21923158e3d8906161cf24d6ec1bb4e5b9036a";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// dice
// ===============================================================================
export const DICE_PACKAGE_ID =
  "0xca4106112a29fffdf8d8b39774535abd05896573dfbeda5ab176e1cb76a334ea";
export const DICE_CORE_PACKAGE_ID =
  "0xca4106112a29fffdf8d8b39774535abd05896573dfbeda5ab176e1cb76a334ea";
export const DICE_MODULE_NAME = "dice";
export const DICE_STRUCT_NAME = "Dice";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID =
  "0xbca3313d753bba2e3b3d911d2306c5024de99dfdb2fc456850186b18867ac36c";
export const LIMBO_PACKAGE_ID =
  "0x26f5edaef93c8195cd5f96cdf54d96051088948ce2cb740d6c8803a53b0be3f9";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";

export const LIMBO_MIN_MULTIPLIER = "1.01";
export const LIMBO_MAX_MULTIPLIER = "100";
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
  "0xe1956df956df4d2f3ec2dc4319e03b037d95db97a6f9845112e1ba4986703234";
export const PLINKO_CORE_PACKAGE_ID =
  "0x1513ee1a47bb1e3b78162f42510f3eece3c6ab0b246bdafda47f939cf7a81c07";
export const PLINKO_MODULE_NAME = "plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

export const PLINKO_VERIFIER_ID =
  "0x898207c059a7e5d4e82cc7258ca6f1876f439265776efa502e8d1616cf198e37";
export const PLINKO_VERIFIER_OBJ = Inputs.SharedObjectRef({
  objectId: PLINKO_VERIFIER_ID,
  initialSharedVersion: 91929635,
  mutable: true,
});
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
  "0x6eb0205627621a882b9e478b3103a961d5e249e10fef550dc8a9032ce86c0a61";
export const ROULETTE_CORE_PACKAGE_ID =
  "0x6eb0205627621a882b9e478b3103a961d5e249e10fef550dc8a9032ce86c0a61";
export const ROULETTE_MODULE_NAME = "single_roulette";
export const ROULETTE_STRUCT_NAME = "SingleRoulette";
export const ROULETTE_BET_SETTLED_EVENT = `${ROULETTE_CORE_PACKAGE_ID}::${ROULETTE_MODULE_NAME}::BetSettledEvent`;

export const ROULETTE_CONFIGS: RouletteConfig[] = [
  {
    coinType: SUI_COIN_TYPE,
    objectId:
      "0x3401a61166a84e6431b00def26f8cc2b87f78737a8d5a94c474afc1f28484629",
    initialSharedVersion: 91929636,
    mutable: true,
  },
  {
    coinType: BUCK_COIN_TYPE,
    objectId:
      "0x366ec05b281fdb99e5005432a914dbbacb3ab7d3fea87926540b36859b42870e",
    initialSharedVersion: 91929637,
    mutable: true,
  },
  {
    coinType: FUD_COIN_TYPE,
    objectId:
      "0x739fc1368d7b358b76a693435b874f594e3e05ff0f942ea9d62cb62754c65c3c",
    initialSharedVersion: 92390311,
    mutable: true,
  },
  {
    coinType: PUP_COIN_TYPE,
    objectId:
      "0x6e3f060a29490bc82d9c3d52a42f7e4e549d8d1fd89ecd769a3311a3c60f6fef",
    initialSharedVersion: 214343544,
    mutable: true,
  },
  {
    coinType: NAVX_COIN_TYPE,
    objectId:
      "0x8d7e9a860968f8c2b0dd3ffe47ff184f43c07ee764bba1ac1855012a3860bc68",
    initialSharedVersion: 214343544,
    mutable: true,
  },
  {
    coinType: STASH_COIN_TYPE,
    objectId:
      "0x955e47ef974d82af3f5b42e7c04137e38f0e5f358abaf97cb932653237d9813a",
    initialSharedVersion: 214343544,
    mutable: true,
  },
  {
    coinType: SUICANE_COIN_TYPE,
    objectId:
      "0xf3a3a1f0223e20a195ac5f3db3097e2b004f8d74cac4c170489d6aa91ac892ad",
    initialSharedVersion: 92390320,
    mutable: true,
  },
  {
    coinType: VSUI_COIN_TYPE,
    objectId:
      "0xa441ee45c1f900451ee3939e9879090e9ebdd0a8f7fb90e66558a4a3af72f46e",
    initialSharedVersion: 214343544,
    mutable: true,
  },
];

// ===============================================================================

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID =
  "0x34937f6948ff94d4195317a931d7cc87ab5aa2bd9f7e704f7f8ad0e019051051";
export const RPS_CORE_PACKAGE_ID =
  "0xd1417478493c4656891ef783fdb9144d8f008f3a16068c8aeaff89b41a320490";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const RANGE_DICE_PACKAGE_ID =
  "0x95117c2b8218490aef9e500f5b76fa3123c318f5edc7b629b857d0a69140d15f";
export const RANGE_DICE_CORE_PACKAGE_ID =
  "0x95117c2b8218490aef9e500f5b76fa3123c318f5edc7b629b857d0a69140d15f";
export const RANGE_DICE_MODULE_NAME = "dice_range";
export const RANGE_DICE_STRUCT_NAME = "DiceRange";
// ===============================================================================

// shared
// ===============================================================================
export const BLS_SETTLER_MODULE_NAME = "bls_settler";

export const BLS_VERIFIER_ID =
  "0xc85af84c78bebac4fd91d8cc25d66461503258764402b4c06c9f3e8050b5bd2e";
export const BLS_VERIFIER_OBJ = Inputs.SharedObjectRef({
  objectId: BLS_VERIFIER_ID,
  initialSharedVersion: 89762028,
  mutable: true,
});

export const CLOCK_OBJ = Inputs.SharedObjectRef({
  objectId: "0x6",
  initialSharedVersion: 1,
  mutable: false,
});

export const UNI_HOUSE_ID =
  "0x44d587c7f6b55fdf35d30143c67bc81911140e73e1ad9c7c17998dbd96cc1bc6";
export const UNI_HOUSE_OBJ = Inputs.SharedObjectRef({
  objectId: UNI_HOUSE_ID,
  initialSharedVersion: 89762024,
  mutable: true,
});

export const UNIHOUSE_PACKAGE =
  "0x2f37aa549ecd1283708d487267f93a5e4c8a759d0c2b5ddddb2162f314e6aa49";
export const UNIHOUSE_CORE_PACKAGE =
  "0xf0978635bb456d2cb2e594cd4a018c9aed486d6cb68c7890abe5ef56838034bf";
// ===============================================================================
