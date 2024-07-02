import { SuiKit, SuiTxBlock } from '@scallop-io/sui-kit';

import { DoubleUpClient } from '../client';

import { testCoinflip } from './coinflip';
import { testDice } from './dice';
import { testLimbo } from './limbo';
import { testLotteryBuy, testLotteryGet, testLotteryTickets, testLotteryRedeem, testLotteryResults } from './lottery';
import { testPlinko } from './plinko';
import { testRangeDiceInsideOutside, testRangeDiceOverUnder } from './rangeDice';
import { testRouletteAdd, testRouletteCreate, testRouletteExists, testRouletteStart } from './roulette';
import { testRPS } from './rps';

const { FUNCTION = "", MNEMONICS = "" } = process.env;

const suiKit = new SuiKit({ mnemonics: MNEMONICS });

// const DESUI_LIMBO_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";
// const DESUI_LIMBO_CORE_PACKAGE_ID = "0x6357ecb5a510ffda89024b37942444e6f32f69f598c0d2fec6555869882657f6";

// const DESUI_PARTNER_NFT_ID = "0x36fba171c07aa06135805a9a9d870d1565a842583f81cc386b65bd2f4335f3f3";

// const DESUI_PLINKO_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_CORE_PACKAGE_ID = "0xe73647314c4d0d007d3e65c9eb0c609104a4d03a0743b4b7177752bcb1586ac3";
// const DESUI_PLINKO_VERIFIER_ID = "0x85fed939bc09d61a314a9c0d4d16370be788a538f351b82b6b3db1ae4f1c7374";

const DESUI_RANGE_DICE_PACKAGE_ID = "0xc40772689f138d27ded3dce1bec95400ee56d4822a0ed6e63768fe7942758e92";
const DESUI_RANGE_DICE_CORE_PACKAGE_ID = "0x7a05d26f35fee4e6ab9d59cb6f7f48e90cefe2c0742e304b555fa3be8dcf2cea";

const DESUI_ROULETTE_PACKAGE_ID = "0x6eb0205627621a882b9e478b3103a961d5e249e10fef550dc8a9032ce86c0a61";
const DESUI_ROULETTE_CORE_PACKAGE_ID = "0x6eb0205627621a882b9e478b3103a961d5e249e10fef550dc8a9032ce86c0a61";

const dbClient = new DoubleUpClient({
    // limboCorePackageId: DESUI_LIMBO_CORE_PACKAGE_ID,
    // limboPackageId: DESUI_LIMBO_PACKAGE_ID,
    // partnerNftListId: DESUI_PARTNER_NFT_ID,
    // plinkoCorePackageId: DESUI_PLINKO_CORE_PACKAGE_ID,
    // plinkoPackageId: DESUI_PLINKO_PACKAGE_ID,
    // plinkoVerifierId: DESUI_PLINKO_VERIFIER_ID,
    // rangeDicePackageId: DESUI_RANGE_DICE_PACKAGE_ID,
    // rangeDiceCorePackageId: DESUI_RANGE_DICE_CORE_PACKAGE_ID,
    roulettePackageId: DESUI_ROULETTE_PACKAGE_ID,
    rouletteCorePackageId: DESUI_ROULETTE_CORE_PACKAGE_ID,

    suiClient: suiKit.client()
});

((fnName, mnemonic) => {
    if (mnemonic !== "") {
        switch (fnName) {
            case 'coinflip':
                testCoinflip(dbClient, suiKit);
                break;
            case 'dice':
                testDice(dbClient, suiKit);
                break;
            case 'limbo':
                testLimbo(dbClient, suiKit);
                break;
            case 'lottery:get':
                testLotteryGet(dbClient, suiKit);
                break;
            case 'lottery:buy':
                testLotteryBuy(dbClient, suiKit);
                break;
            case 'lottery:redeem':
                testLotteryRedeem(dbClient, suiKit);
                break;
            case 'lottery:results':
                testLotteryResults(dbClient, suiKit);
                break;
            case 'lottery:tickets':
                testLotteryTickets(dbClient, suiKit);
                break;
            case 'plinko':
                testPlinko(dbClient, suiKit);
                break;
            case 'range:io':
                testRangeDiceInsideOutside(dbClient, suiKit);
                break;
            case 'range:ou':
                testRangeDiceOverUnder(dbClient, suiKit);
                break;
            case 'roulette:add':
                testRouletteAdd(dbClient, suiKit);
                break;
            case 'roulette:create':
                testRouletteCreate(dbClient, suiKit);
                break;
            case 'roulette:exists':
                testRouletteExists(dbClient, suiKit);
                break;
            case 'roulette:start':
                testRouletteStart(dbClient, suiKit);
                break;
            case 'rps':
                testRPS(dbClient, suiKit);
                break;
            default:
                console.error("Use dedicated test function to test an individual game.\n");
        }
    } else {
        console.error("You must supply your wallet mnemonics in the .env file to test.\n");
    }
})(FUNCTION, MNEMONICS);
