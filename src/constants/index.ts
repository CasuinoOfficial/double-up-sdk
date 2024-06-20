import { Inputs } from "@mysten/sui.js/transactions";

// coins
// ===============================================================================
export const BUCK_COIN_TYPE = "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK";
export const FUD_COIN_TYPE = "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD";
export const NAVX_COIN_TYPE="0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX"
export const PUP_COIN_TYPE = "0x980ec1e7d5a3d11c95039cab901f02a044df2d82bc79d99b60455c02524fad83::pup::PUP";
export const STASH_COIN_TYPE="0x2cff601fe16f622fd6203f8f64bef4e68d687f51f4d06f13c2bbba17cb84c87e::stash::STASH"
export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const SUICANE_COIN_TYPE = "0x8c47c0bde84b7056520a44f46c56383e714cc9b6a55e919d8736a34ec7ccb533::suicune::SUICUNE";
// ===============================================================================

// coinflip
// ===============================================================================
export const COIN_PACKAGE_ID = "0x57c3008880285085e5fd94092f21923158e3d8906161cf24d6ec1bb4e5b9036a";
export const COIN_CORE_PACKAGE_ID = "0x57c3008880285085e5fd94092f21923158e3d8906161cf24d6ec1bb4e5b9036a";
export const COIN_MODULE_NAME = "coinflip";
export const COIN_STRUCT_NAME = "Coinflip";
// ===============================================================================

// dice
// ===============================================================================
export const DICE_PACKAGE_ID = "0xca4106112a29fffdf8d8b39774535abd05896573dfbeda5ab176e1cb76a334ea";
export const DICE_CORE_PACKAGE_ID = "0xca4106112a29fffdf8d8b39774535abd05896573dfbeda5ab176e1cb76a334ea";
export const DICE_MODULE_NAME = "dice";
export const DICE_STRUCT_NAME = "Dice";
// ===============================================================================

// limbo
// ===============================================================================
export const LIMBO_CORE_PACKAGE_ID = "0xbca3313d753bba2e3b3d911d2306c5024de99dfdb2fc456850186b18867ac36c";
export const LIMBO_PACKAGE_ID = "0x26f5edaef93c8195cd5f96cdf54d96051088948ce2cb740d6c8803a53b0be3f9";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_STRUCT_NAME = "Limbo";

export const LIMBO_MIN_MULTIPLIER = "1.01";
export const LIMBO_MAX_MULTIPLIER = "100";
// ===============================================================================

// lottery
// ===============================================================================
export const LOTTERY_CORE_PACKAGE_ID = "";
export const LOTTERY_PACKAGE_ID = "0x5fad208418200537f2785aefdca3c8e15e2843ebdffd524956e6d6d6aca845a9";
export const LOTTERY_MODULE_NAME = "lottery";
export const LOTTERY_STRUCT_NAME = "Lottery";

export const LOTTERY_ID = "0x447953794edc1dd42891ca3cfbcc21ef510d42fc90db9a6d9189a2913c570f23";
export const LOTTERY_STORE_ID = "0x212509ffef4a7615c8e0f26d70ac84c93cbf88d6eb3f9f363a27d5ba2526f684";
// ===============================================================================

// plinko
// ===============================================================================
export const PLINKO_PACKAGE_ID = "0xe1956df956df4d2f3ec2dc4319e03b037d95db97a6f9845112e1ba4986703234";
export const PLINKO_CORE_PACKAGE_ID = "0x1513ee1a47bb1e3b78162f42510f3eece3c6ab0b246bdafda47f939cf7a81c07"
export const PLINKO_MODULE_NAME = "plinko";
export const PLINKO_STRUCT_NAME = "Plinko";

export const PLINKO_VERIFIER_ID = "0x898207c059a7e5d4e82cc7258ca6f1876f439265776efa502e8d1616cf198e37";
export const PLINKO_VERIFIER_OBJ = Inputs.SharedObjectRef({
  objectId: PLINKO_VERIFIER_ID,
  initialSharedVersion: 91929635,
  mutable: true,
});
// ===============================================================================

// roulette
// ===============================================================================
interface RouletteConfig {
  coinType: string;
  initialSharedVersion: number;
  mutable: boolean;
  objectId: string;
};

export const ROULETTE_PACKAGE_ID = "0xf4d8d82cd78b54759c962b50b4b434d86f0865cddb0631e939eb10d8bcaa1fd9";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";

export const ROULETTE_CONFIGS: RouletteConfig[] = [
  {
    coinType: SUI_COIN_TYPE,
    objectId: "0x8d51882ebf6e1b028a2c55484f748bb046c41dbb6cd6b882a45531eef7b0b59f",
    initialSharedVersion: 91929636,
    mutable: true
  },
  {
    coinType: BUCK_COIN_TYPE,
    objectId: "0x13d5ddb9fb5a4ed750418bb33c4fb3624b9e216d40328af2257138afd3fc7f8f",
    initialSharedVersion: 91929637,
    mutable: true
  },
  {
    coinType: FUD_COIN_TYPE,
    objectId: "0xb5801fddf758acc8576ebd6988dc9150baf80be78036279aab4afc04a004a5e3",
    initialSharedVersion: 92390311,
    mutable: true
  },
  {
    coinType: PUP_COIN_TYPE,
    objectId: "0x0fe8cacaeecf7462dbe952a190c2d130ea191637e06e015896e8f65106b4ce0f",
    initialSharedVersion: 214343544,
    mutable: true
  },
  {
    coinType: NAVX_COIN_TYPE,
    objectId: "0xc4f56c31b71b2e4c367bebfb7cb7a3caf5156ee6c02db64b4aef75d294b5769f",
    initialSharedVersion: 214343544,
    mutable: true
  },
  {
    coinType: STASH_COIN_TYPE,
    objectId: "0xeaf9087aca7ab406cb520a5ab229bffca3f6931544f5a51ae5d0281653aa0855",
    initialSharedVersion: 214343544,
    mutable: true
  },
  {
    coinType: SUICANE_COIN_TYPE,
    objectId: "0xe295e13bd9d84e3c1ae2a3f7f9986fac733d64bfeb5bf79346688032042295e1",
    initialSharedVersion: 92390320,
    mutable: true
  }
];

export const getRouletteConfig = (coinType: string): RouletteConfig | undefined => (
  ROULETTE_CONFIGS.find(config => config.coinType === coinType)
);

// ===============================================================================

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID = "0x34937f6948ff94d4195317a931d7cc87ab5aa2bd9f7e704f7f8ad0e019051051";
export const RPS_CORE_PACKAGE_ID = "0xd1417478493c4656891ef783fdb9144d8f008f3a16068c8aeaff89b41a320490";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// range dice
// ===============================================================================
export const RANGE_DICE_PACKAGE_ID = "";
export const RANGE_DICE_CORE_PACKAGE_ID = "";
export const RANGE_DICE_MODULE_NAME = "dice_range";
export const RANGE_DICE_STRUCT_NAME = "DiceRange";
// ===============================================================================

// shared
// ===============================================================================
export const BLS_SETTLER_MODULE_NAME = "bls_settler";

export const BLS_VERIFIER_ID = "0xc85af84c78bebac4fd91d8cc25d66461503258764402b4c06c9f3e8050b5bd2e";
export const BLS_VERIFIER_OBJ = Inputs.SharedObjectRef({
  objectId: BLS_VERIFIER_ID,
  initialSharedVersion: 89762028,
  mutable: true
});

export const CLOCK_OBJ = Inputs.SharedObjectRef({
  objectId: "0x6",
  initialSharedVersion: 1,
  mutable: false,
});

export const UNI_HOUSE_ID = "0x44d587c7f6b55fdf35d30143c67bc81911140e73e1ad9c7c17998dbd96cc1bc6";
export const UNI_HOUSE_OBJ = Inputs.SharedObjectRef({
  objectId: UNI_HOUSE_ID,
  initialSharedVersion: 89762024,
  mutable: true
});

export const UNIHOUSE_PACKAGE = "0x2f37aa549ecd1283708d487267f93a5e4c8a759d0c2b5ddddb2162f314e6aa49";
export const UNIHOUSE_CORE_PACKAGE = '0xf0978635bb456d2cb2e594cd4a018c9aed486d6cb68c7890abe5ef56838034bf';       
// ===============================================================================
