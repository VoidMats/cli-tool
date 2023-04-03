import tap from "tap";
import { REQUIRED_SUIT } from "./utils/constants.js";
import { runRequired } from "./utils/utils.js";


let index = 1;

tap.test("== TEST FOR REQUIRED VALUES ==", async (t) => {

    for (const testCase of REQUIRED_SUIT) {
        await runRequired(t, index, testCase);
        index++
    }

});
