import { Inputs } from "@mysten/sui.js/transactions";

interface RouletteConfig {
  coinType: string;
  initialSharedVersion: number;
  mutable: boolean;
  objectId: string;
};

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
export const ROULETTE_PACKAGE_ID = "0xf4d8d82cd78b54759c962b50b4b434d86f0865cddb0631e939eb10d8bcaa1fd9";
export const ROULETTE_MODULE_NAME = "roulette";
export const ROULETTE_STRUCT_NAME = "Roulette";
export const ROULETTE_CONFIGS: RouletteConfig[] = [
  {
    coinType: "0x2::sui::SUI",
    objectId: "0x8d51882ebf6e1b028a2c55484f748bb046c41dbb6cd6b882a45531eef7b0b59f",
    initialSharedVersion: 91929636,
    mutable: true,
  },
  {
    coinType: "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
    objectId: "0xb5801fddf758acc8576ebd6988dc9150baf80be78036279aab4afc04a004a5e3",
    initialSharedVersion: 92390311,
    mutable: true,
  }
];
// ===============================================================================

// rock paper scissors
// ===============================================================================
export const RPS_PACKAGE_ID = "0xd1417478493c4656891ef783fdb9144d8f008f3a16068c8aeaff89b41a320490";
export const RPS_CORE_PACKAGE_ID = "0xd1417478493c4656891ef783fdb9144d8f008f3a16068c8aeaff89b41a320490";
export const RPS_MODULE_NAME = "rock_paper_scissors";
export const RPS_STRUCT_NAME = "RockPaperScissors";
// ===============================================================================

// shared
// ===============================================================================
export const BLS_SETTLER_MODULE_NAME = "bls_settler";

export const BLS_VERIFIER_ID = "0xc85af84c78bebac4fd91d8cc25d66461503258764402b4c06c9f3e8050b5bd2e";
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

export const UNI_HOUSE_ID = "0x44d587c7f6b55fdf35d30143c67bc81911140e73e1ad9c7c17998dbd96cc1bc6";
export const UNI_HOUSE_OBJ = Inputs.SharedObjectRef({
  objectId: UNI_HOUSE_ID,
  initialSharedVersion: 89762024,
  mutable: true,
});

export const UNIHOUSE_PACKAGE = "0x7d1e81394129c8c3cbcd012e988a30ec3134a7787fe891c6c581e23dbd57ec01";
export const UNIHOUSE_CORE_PACKAGE = '0xf0978635bb456d2cb2e594cd4a018c9aed486d6cb68c7890abe5ef56838034bf';       
// ===============================================================================
