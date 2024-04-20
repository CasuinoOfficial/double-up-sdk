import { Inputs } from "@mysten/sui.js/transactions";

export const LIMBO_CORE_PACKAGE_ID =
  "0xbca3313d753bba2e3b3d911d2306c5024de99dfdb2fc456850186b18867ac36c";
export const LIMBO_PACKAGE_ID =
  "0xbca3313d753bba2e3b3d911d2306c5024de99dfdb2fc456850186b18867ac36c";
export const LIMBO_MODULE_NAME = "limbo";
export const LIMBO_RESOLVE_OUTCOME = `${LIMBO_PACKAGE_ID}::limbo::resolve_bet_outcome`
export const COIN_PACKAGE_ID = "0xb6c26aa0109aac946d1f9151580ce2fe8a388b489bf5664d7a751718fcefee1f";
export const COIN_MODULE_NAME = "coinflip";
export const LIMBO_MIN_MULTIPLIER = "1.01";
export const LIMBO_MAX_MULTIPLIER = "100";


export const UNI_HOUSE_ID =
  "0x44d587c7f6b55fdf35d30143c67bc81911140e73e1ad9c7c17998dbd96cc1bc6";

export const UNI_HOUSE_OBJ = Inputs.SharedObjectRef({
  objectId: UNI_HOUSE_ID,
  initialSharedVersion: 89762024,
  mutable: true,
});

export const BLS_VERIFIER_ID = "0xc85af84c78bebac4fd91d8cc25d66461503258764402b4c06c9f3e8050b5bd2e";

export const BLS_VERIFIER_OBJ = Inputs.SharedObjectRef({
  objectId: BLS_VERIFIER_ID,
  initialSharedVersion: 89762028,
  mutable: true,
});

export const UNIHOUSE_PACKAGE =
  "0xf0978635bb456d2cb2e594cd4a018c9aed486d6cb68c7890abe5ef56838034bf";